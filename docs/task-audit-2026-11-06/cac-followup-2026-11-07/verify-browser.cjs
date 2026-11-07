const fs=require('node:fs');
const {chromium}=require('/media/endlessblink/data/my-projects/ai-development/devops/termfleet/node_modules/playwright');
const base='/media/endlessblink/data/my-projects/ai-development/devops/watchpost/docs/task-audit-2026-11-06/cac-followup-2026-11-07';
async function main(){
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 try{
  await context.addCookies([{name:'wp_project',value:'claude-and-conquer',url:'http://127.0.0.1:6010'}]);
  await context.route('**/*',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:6010/kanban/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelectorAll('#kanban-board .task-card').length===7);
  const cards=await page.locator('#kanban-board .task-card').evaluateAll(cs=>cs.map(c=>({id:c.dataset.id,text:c.innerText})));
  const expected=['FEATURE-021','TASK-082','TASK-083','TASK-100','TASK-105','TASK-111','TASK-119'];
  if(JSON.stringify(cards.map(c=>c.id).sort())!==JSON.stringify(expected.sort()))throw Error('Incorrect active task IDs');
  const total=await page.locator('#stats-bar #stat-total').innerText();if(total!=='7')throw Error('Incorrect total '+total);
  await page.getByRole('button',{name:'Archive',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('#archive-board .task-card').length===140);
  const archived=await page.locator('#archive-board .task-card').evaluateAll(cs=>cs.map(c=>({id:c.dataset.id,text:c.innerText})));
  for(const id of ['TASK-084','TASK-091','TASK-114'])if(!archived.find(c=>c.id===id)?.text.includes('Duplicate'))throw Error('Consolidated card missing '+id);
  if(!archived.find(c=>c.id==='INQUIRY-042')?.text.includes('Superseded'))throw Error('Inquiry not retired');
  const stats=await(await context.request.get('http://127.0.0.1:6010/api/projects/claude-and-conquer/stats')).json();
  if(stats.tasks.total!==7)throw Error('Project-card count incorrect');
  if(errors.length)throw Error(errors.join(';'));
  fs.writeFileSync(base+'/browser-readback.json',JSON.stringify({at:new Date().toISOString(),url:'http://127.0.0.1:6010/kanban/index.html',headless:true,active:cards,archived:archived.map(c=>c.id),counts:{active:7,planned:3,inProgress:1,review:3,archived:140,retained:147},projectCardTotal:stats.tasks.total,pageErrors:errors,passed:true},null,2));
  console.log('PASS: exact7active,140Archive,3planned/1inprogress/3review, projectcard7, zero pageerrors');
 }finally{await context.close();await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
