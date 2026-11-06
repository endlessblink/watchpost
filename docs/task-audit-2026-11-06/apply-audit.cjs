'use strict';
// Applies reversible Watchpost presentation metadata; canonical source statuses
// remain owned by each project's plan/tracker and are never changed here.
const fs = require('node:fs');
const path = require('node:path');
const {createEngine} = require('../../modules/task-engine');
const Database = require('better-sqlite3');
const base = __dirname;
const read = name => JSON.parse(fs.readFileSync(path.join(base, name), 'utf8'));
const sources = [['bots-audit.json','tasks'],['content-audit.json','tasks'],['productivity-audit.json','rows'],['parent-audit.json','tasks'],['worktree-task-audit.json','tasks']];
const rows = new Map(), overlaps = [];
for (const [file,key] of sources) {
  if (!fs.existsSync(path.join(base,file))) throw Error(`Required audit ledger missing: ${file}`);
  for (const row of read(file)[key]) {
    const k = `${row.project}\0${row.id}`;
    if (rows.has(k)) overlaps.push({project:row.project,id:row.id,first:rows.get(k).classification,second:row.classification});
    else rows.set(k,row);
  }
}
const inventory = read('inventory.json');
const mode = process.argv[2] || 'prepare';
const receipt = {mode,at:new Date().toISOString(),overlaps,projects:[],errors:[]};
async function request(name, route) {
  const response=await fetch(`http://127.0.0.1:6010${route}${route.includes('?')?'&':'?'}project=${encodeURIComponent(name)}`);
  if (!response.ok) throw Error(`${name}: HTTP ${response.status}`);
  return response.json();
}
async function main() {
  const prepared=[];
  const backupDir='/tmp/watchpost-full-audit-backups-20261106';
  if (mode==='apply') fs.mkdirSync(backupDir,{recursive:true,mode:0o700});
  for (const record of inventory) {
    const name=record.project.name;
    const selected=[...rows.values()].filter(row=>row.project===name);
    if (!selected.length || record.project.planDoor || record.project.readOnlyPlan || record.taskError) continue;
    try {
      const dir=path.dirname(record.planPath);
      const root=['docs','doc','planning','.github'].includes(path.basename(dir))?path.dirname(dir):dir;
      const dbPath=path.join(root,'.watchpost/db.sqlite');
      const backup=path.join(backupDir,name.replace(/[^a-zA-Z0-9_-]/g,'_')+'-full-audit.sqlite');
      if (mode==='apply' && fs.existsSync(dbPath) && !fs.existsSync(backup)) {
        const source=new Database(dbPath,{readonly:true});
        try {await source.backup(backup);} finally {source.close();}
      }
      const live=await request(name,'/api/tasks/list?includeArchived=1');
      const taskMap=new Map(live.tasks.map(t=>[t.id,t]));
      const graph=await request(name,'/api/tasks/graph');
      const results=[];
      for (const row of selected) {
        const task=taskMap.get(row.id);
        if (!task) {receipt.errors.push({project:name,id:row.id,error:'Audited ID missing from live source'});continue;}
        const canonical=row.canonicalTask ? (typeof row.canonicalTask==='string'?row.canonicalTask:`${row.canonicalTask.project}:${row.canonicalTask.id}`) : '';
        const dependencyIssues=(graph.links||[]).filter(link=>link.target===row.id).flatMap(link=>{
          const prerequisite=taskMap.get(link.source);
          return !prerequisite ? [`${link.source}: unresolved reference`] : prerequisite.archived_at && prerequisite.status!=='done' ? [`${link.source}: retired unfinished prerequisite`] : [];
        });
        const note=`[Task audit 2026-11-06] ${row.classification}. ${row.rationale || ''}${canonical?' Canonical task: '+canonical+'.':''} Next action: ${row.nextAction || 'Recheck current implementation and acceptance before claiming completion.'}${dependencyIssues.length?' Dependencies need reconciliation: '+dependencyIssues.join('; ')+'.':''}`;
        let disposition=null;
        if (row.archiveEligible!==false) {
          if (['superseded','duplicate','rejected'].includes(row.classification)) disposition=row.classification;
          else if (task.status==='done' && ['declared_done_unverified','completed','done'].includes(row.classification)) disposition='completed';
        }
        results.push({id:row.id,status:task.status,classification:row.classification,disposition,auditNote:note,dependencyIssues,recommendedStatus:row.recommendedStatus,sourceStatusMismatch:!!row.recommendedStatus && row.recommendedStatus!==task.status});
      }
      receipt.projects.push({project:name,dbPath,backup,results});
      prepared.push({dbPath,results});
    } catch(error) {receipt.errors.push({project:name,error:error.message});}
  }
  // All IDs and scopes are checked before presentation changes are applied.
  if (mode==='apply' && !receipt.errors.length) for (const project of prepared) {
    const engine=createEngine();
    try {
      const db=engine.initDb(project.dbPath);
      db.transaction(()=>{for (const row of project.results) {
        const task=engine.getTask(row.id);
        if (task.status!==row.status) throw Error(`Source changed during preflight: ${row.id}`);
        if (task.audit_note!==row.auditNote) engine.addComment(row.id,row.auditNote);
        if (row.disposition) engine.archiveTask(row.id,row.auditNote.slice(0,1000),row.disposition);
        else if (task.archived_at) engine.restoreTask(row.id);
      }})();
    } finally {engine.closeDb();}
  }
  fs.writeFileSync(path.join(base,`${mode}-receipt.json`),JSON.stringify(receipt,null,2));
  console.log(JSON.stringify({mode,projects:receipt.projects.length,tasks:receipt.projects.reduce((s,p)=>s+p.results.length,0),archives:receipt.projects.flatMap(p=>p.results).filter(t=>t.disposition).length,errors:receipt.errors},null,2));
  if(receipt.errors.length)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1;});
