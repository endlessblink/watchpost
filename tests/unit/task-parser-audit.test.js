import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const { createEngine } = createRequire(import.meta.url)('../../modules/task-engine');
function parse(markdown) {
  const dir=mkdtempSync(join(tmpdir(),'watchpost-parser-audit-')), engine=createEngine();
  try {
    engine.initDb(join(dir,'db.sqlite')); writeFileSync(join(dir,'MASTER_PLAN.md'),markdown);
    engine.syncFromMarkdown(join(dir,'MASTER_PLAN.md'));
    return engine.getTasks({includeArchived:true}).map(task=>engine.getTask(task.id));
  } finally { engine.closeDb(); rmSync(dir,{recursive:true,force:true}); }
}
describe('audited source status formats',()=>{
  it('reads plain and bulleted status fields',()=>{
    expect(parse('### TASK-1: Work\nStatus: REVIEW\n### TASK-2: Other\n- **Status:** REVIEW — replay remaining').map(t=>t.status)).toEqual(['review','review']);
  });
  it('keeps explicitly blocked owner-stopped work out of the planned queue',()=>{
    expect(parse('### TASK-84: Stopped work\n**Status**: BLOCKED (2026-11-06)')[0].status).toBe('paused');
  });
  it('preserves explicit status across statusless two-cell summaries',()=>{
    expect(parse('### BRN-002: Work\n**Status:** REVIEW\n\n| ID | Notes |\n|---|---|\n| BRN-002 | Implementation awaiting checks |')[0].status).toBe('review');
    expect(parse('| ID | Notes |\n|---|---|\n| BRN-002 | REVIEW — implemented, awaiting checks |')[0].status).toBe('review');
  });
  it('preserves dated shared-queue status',()=>{
    expect(parse('### TASK-1: Work (IN PROGRESS)\n**Priority**: P2\n**Status**: IN PROGRESS (2026-08-22)')[0].status).toBe('in_progress');
  });
  it('reads inline status independently of priority',()=>{
    expect(parse('### RTL-003: Tools\n**Priority:** P1 | **Status:** DONE')[0].status).toBe('done');
  });
  it('preserves decorated progress and does not reset a known status from unrecognized prose',()=>{
    expect(parse('### TASK-001: Work\n**Status:** 🔄 IN PROGRESS')[0].status).toBe('in_progress');
    expect(parse('| ID | Title | Priority | Status |\n|---|---|---|---|\n| TASK-001 | Work | P1 | IN PROGRESS |\n### TASK-001: Work\n**Status:** Implementation staged; production unknown')[0].status).toBe('in_progress');
  });
  it('recognizes explicit DONE suffixes',()=>{
    const task=parse('### TASK-101: Project Scaffold - DONE')[0];
    expect(task.status).toBe('done'); expect(task.title).toBe('Project Scaffold');
  });
  it('keeps local completion awaiting acceptance under review',()=>{
    expect(parse('### TASK-101: Project Scaffold - DONE LOCALLY, awaiting acceptance')[0].status).toBe('review');
  });
  it('reads nested completed headings in both bold-strike orders',()=>{
    expect(parse('#### **~~TASK-101~~**: Work\n**Status:** DONE\n#### ~~**TASK-102**~~: Other\n**Status:** DONE').map(t=>t.status)).toEqual(['done','done']);
  });
  it('recognizes priority and status together in a nested heading',()=>{
    expect(parse('#### TASK-006 — Character references (P1, IN PROGRESS)')[0]).toMatchObject({status:'in_progress',priority:'P1'});
  });
  it('ignores fenced examples',()=>{
    expect(parse('```markdown\n### TASK-001: Example - DONE\n```\n### TASK-002: Actual\n**Status:** REVIEW (2026-11-06)').map(t=>[t.id,t.status])).toEqual([['TASK-002','review']]);
  });
  it('uses named table columns rather than mistaking type or status for a title',()=>{
    const tasks=parse('| ID | Type | Priority | Status | Title |\n|---|---|---|---|---|\n| T-098 | FEATURE | P0 | REVIEW | Recruiter portfolio |\n| T-066 | FEATURE | P1 | DOING | Studio home |');
    expect(tasks.map(t=>[t.title,t.status])).toEqual(expect.arrayContaining([['Recruiter portfolio','review'],['Studio home','in_progress']]));
  });
  it('retains distinct suffixed identities and their dependencies',()=>{
    const tasks=parse('| ID | Title | Status | Deps |\n|---|---|---|---|\n| ARTH-070a | Public | DONE | |\n| ARTH-070b | Private | TODO | ARTH-070a |');
    expect(tasks.map(t=>[t.id,t.status])).toEqual([['ARTH-070a','done'],['ARTH-070b','planned']]);
  });
  it('does not turn a generated asks inbox into development tasks',()=>{
    expect(parse('| ID | Kind | Status | Due | Task | What |\n|---|---|---|---|---|---|\n| N-1348 | message | deferred | tomorrow | TASK-001 | A private request |\n\n### TASK-001: Actual task\n**Status:** TODO').map(t=>t.id)).toEqual(['TASK-001']);
  });
  it('preserves inline declared prerequisites while ignoring related prose',()=>{
    const tasks=parse('### TASK-1944: Work\n**Priority**: P1 | **Depends on**: TASK-1943, TASK-1797 (foundation), other:BUG-1942\n**Related**: BUG-999\n### TASK-1943: Foundation (DONE)');
    expect(tasks.find(t=>t.id==='TASK-1944').deps).toEqual(['TASK-1797','TASK-1943','other:BUG-1942']);
  });
});
