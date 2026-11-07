'use strict';
const fs=require('node:fs'),path=require('node:path');
const {createEngine}=require('../../../modules/task-engine');
const Database=require('better-sqlite3');
const base=__dirname, audit=path.dirname(base);
const project='claude-and-conquer';
const source=JSON.parse(fs.readFileSync(path.join(base,'source-receipt.json')));
const ledger=JSON.parse(fs.readFileSync(path.join(audit,'bots-audit.json'))).tasks.filter(r=>r.project===project);
async function get(route){const r=await fetch('http://127.0.0.1:6010'+route+(route.includes('?')?'&':'?')+'project='+project,{headers:{Connection:'close'}});if(!r.ok)throw Error('HTTP '+r.status);return r.json();}
async function main(){
 const tasks=(await get('/api/tasks/list?includeArchived=1')).tasks;
 if(tasks.length!==147 || new Set(tasks.map(t=>t.id)).size!==147 || ledger.length!==147)throw Error('Task identity set changed; refresh audit');
 const lookup=new Map(tasks.map(t=>[t.id,t]));
 for(const [id,status] of Object.entries(source.expectedActive))if(lookup.get(id)?.status!==status)throw Error('Canonical source stage mismatch '+id);
 const dbPath='/media/endlessblink/data/my-projects/ai-development/bots+automation/claude-and-conquer/.watchpost/db.sqlite';
 const backup='/tmp/cac-followup-20261107-before.sqlite';
 if(!fs.existsSync(backup)){const db=new Database(dbPath,{readonly:true});try{await db.backup(backup);}finally{db.close();}}
 const engine=createEngine();const results=[];
 try{
  const db=engine.initDb(dbPath);
  db.transaction(()=>{
   for(const row of ledger){
    const task=engine.getTask(row.id);
    if(!task || task.status!==lookup.get(row.id)?.status)throw Error('Source changed during preflight '+row.id);
    const canonical=row.canonicalTask?(typeof row.canonicalTask==='string'?row.canonicalTask:row.canonicalTask.project+':'+row.canonicalTask.id):'';
    const note=`[Task audit ${row.auditDate||'2026-11-06'}] ${row.classification}. ${row.rationale||''}${canonical?' Canonical task: '+canonical+'.':''} Next action: ${row.nextAction||'Recheck source acceptance.'}`;
    let disposition=null;
    if(row.archiveEligible!==false){
     if(['duplicate','superseded','rejected'].includes(row.classification))disposition=row.classification;
     else if(task.status==='done' && ['declared_done_unverified','completed','done'].includes(row.classification))disposition='completed';
    }
    if(task.audit_note!==note)engine.addComment(row.id,note);
    if(disposition)engine.archiveTask(row.id,note.slice(0,1000),disposition);
    else if(task.archived_at)engine.restoreTask(row.id);
    results.push({id:row.id,status:task.status,classification:row.classification,disposition,auditNote:note,dependencyIssues:[],recommendedStatus:row.recommendedStatus,sourceStatusMismatch:!!row.recommendedStatus&&row.recommendedStatus!==task.status});
   }
  })();
 }finally{engine.closeDb();}
 const after=(await get('/api/tasks/list?includeArchived=1')).tasks;
 const active=(await get('/api/tasks/list')).tasks;
 const archived=(await get('/api/tasks/list?archived=1')).tasks;
 const stats=await get('/api/tasks/stats');
 const expected=Object.keys(source.expectedActive).sort();
 if(JSON.stringify(active.map(t=>t.id).sort())!==JSON.stringify(expected))throw Error('Active set mismatch');
 if(after.length!==147 || archived.length!==147-expected.length || stats.total!==expected.length || stats.archived!==147-expected.length)throw Error('Count mismatch');
 const graph=await get('/api/tasks/graph');
 const activeDeps=(graph.links||[]).filter(l=>expected.includes(l.target));
 if(activeDeps.some(l=>!expected.includes(l.source)))throw Error('Consolidated parent still depends on an archived child');
 for(const row of results){const t=after.find(t=>t.id===row.id);if(t.audit_note!==row.auditNote||t.status!==row.status||Boolean(t.archived_at)!==Boolean(row.disposition))throw Error('Presentation mismatch '+row.id);}
 const applied={at:new Date().toISOString(),project,dbPath,backup,results,counts:{retained:after.length,active:active.length,archived:archived.length,byStatus:stats.byStatus},activeDependencies:activeDeps,errors:[],runtimeMutations:0};
 fs.writeFileSync(path.join(base,'apply-readback.json'),JSON.stringify(applied,null,2));
 const receiptPath=path.join(audit,'apply-receipt.json');
 const receipt=JSON.parse(fs.readFileSync(receiptPath));
 const index=receipt.projects.findIndex(p=>p.project===project);
 if(index<0)throw Error('Original project receipt missing');
 receipt.projects[index]={project,dbPath,backup,results,followupAt:applied.at};
 fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2));
 console.log(JSON.stringify({project,counts:applied.counts,exactIdentitySet:true,activeDependencies:activeDeps,errors:[]},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
