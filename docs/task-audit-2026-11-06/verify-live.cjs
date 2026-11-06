'use strict';
const fs=require('node:fs'),path=require('node:path');
const base=__dirname;
const receipt=JSON.parse(fs.readFileSync(path.join(base,'apply-receipt.json')));
async function get(project,route){
  const url=`http://127.0.0.1:6010${route}${route.includes('?')?'&':'?'}project=${encodeURIComponent(project)}`;
  let res;
  try {res=await fetch(url,{signal:AbortSignal.timeout(20000)});}
  catch(first){res=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{Connection:'close'}});}
  if(!res.ok)throw Error(`${project} ${route}: ${res.status}`);
  return res.json();
}
async function main(){
  const report={at:new Date().toISOString(),projects:[],errors:[],totals:{active:0,archived:0,retained:0,audited:0},dependencyIssues:[]};
  for(const project of receipt.projects){
    try{
      const name=project.project;
      const all=(await get(name,'/api/tasks/list?includeArchived=1')).tasks;
      const active=(await get(name,'/api/tasks/list')).tasks;
      const archived=(await get(name,'/api/tasks/list?archived=1')).tasks;
      const stats=await get(name,'/api/tasks/stats');
      const lookup=new Map(all.map(t=>[t.id,t]));
      const auditedIds=new Set(project.results.map(row=>row.id));
      if(lookup.size!==auditedIds.size || all.some(task=>!auditedIds.has(task.id)))throw Error('Current task set differs from audit; refresh concurrent changes');
      for(const row of project.results){
        const task=lookup.get(row.id);
        if(!task)throw Error(`Missing audited task ${row.id}`);
        if(task.audit_note!==row.auditNote)throw Error(`Audit note mismatch ${row.id}`);
        if(row.disposition && (!task.archived_at || task.archive_disposition!==row.disposition))throw Error(`Archive mismatch ${row.id}`);
        if(!row.disposition && task.archived_at)throw Error(`Residual work incorrectly archived ${row.id}`);
        if(task.status!==row.status)throw Error(`Source status changed since application ${row.id}`);
      }
      if(stats.total!==active.length || stats.archived!==archived.length || all.length!==active.length+archived.length)throw Error('Native counts disagree');
      const projectStats=await get(name,`/api/projects/${encodeURIComponent(name)}/stats`);
      if(projectStats.tasks.total!==active.length)throw Error(`Project count ${projectStats.tasks.total} != ${active.length}`);
      const graph=await get(name,'/api/tasks/graph');
      for(const link of graph.links||[]){
        const dependent=lookup.get(link.target);
        if(!dependent || dependent.archived_at || dependent.status==='done')continue;
        const prerequisite=lookup.get(link.source);
        if(!prerequisite)report.dependencyIssues.push({project:name,id:link.target,prerequisite:link.source,kind:link.source.includes(':')?'external_reference':'missing_reference'});
        else if(prerequisite.archived_at && prerequisite.status!=='done')report.dependencyIssues.push({project:name,id:link.target,prerequisite:link.source,kind:'retired_unfinished_prerequisite',disposition:prerequisite.archive_disposition});
      }
      report.projects.push({project:name,active:active.length,archived:archived.length,retained:all.length,audited:project.results.length,byStatus:stats.byStatus});
      report.totals.active+=active.length;report.totals.archived+=archived.length;report.totals.retained+=all.length;report.totals.audited+=project.results.length;
    }catch(error){report.errors.push({project:project.project,error:error.message});}
  }
  const parent=JSON.parse(fs.readFileSync(path.join(base,'parent-audit.json')));
  for(const name of ['imaginebox','finetuned']){
    try{
      const all=(await get(name,'/api/tasks/list?includeArchived=1')).tasks;
      const active=(await get(name,'/api/tasks/list')).tasks;
      const archived=(await get(name,'/api/tasks/list?archived=1')).tasks;
      const stats=await get(name,'/api/tasks/stats');
      const audited=parent.tasks.filter(t=>t.project===name);
      if(all.length!==audited.length || all.some(task=>!audited.some(row=>row.id===task.id && row.currentStatus===task.status)))throw Error('Canonical managed tasks changed since audit');
      if(all.length!==active.length+archived.length || stats.total!==active.length || stats.archived!==archived.length)throw Error('Managed projection counts disagree');
      const projectStats=await get(name,`/api/projects/${name}/stats`);
      if(projectStats.tasks.total!==active.length)throw Error('Managed project card count disagrees');
      if(archived.some(task=>task.original_status!=='DONE'))throw Error('Unaccepted managed task archived');
      report.projects.push({project:name,managed:true,active:active.length,archived:archived.length,retained:all.length,audited:audited.length,revision:all[0]?.revision,sourceAuthority:'Unchanged evidence-gated tracker; archive is a read-only presentation projection'});
      report.totals.active+=active.length;report.totals.archived+=archived.length;report.totals.retained+=all.length;report.totals.audited+=audited.length;
    }catch(error){report.errors.push({project:name,error:error.message});}
  }
  fs.writeFileSync(path.join(base,'live-verification.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({projects:report.projects.length,totals:report.totals,errors:report.errors,dependencyIssues:report.dependencyIssues.length},null,2));
  if(report.errors.length)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exit(1)});
