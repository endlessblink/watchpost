import { afterEach, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { createEngine } = require('../../modules/task-engine');
const engines = [];
const dirs = [];
function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'watchpost-archive-'));
  dirs.push(dir);
  const engine = createEngine();
  engines.push(engine);
  engine.initDb(join(dir, 'db.sqlite'));
  const plan = join(dir, 'MASTER_PLAN.md');
  writeFileSync(plan, '### TASK-001: Completed prerequisite (DONE)\n\n### TASK-002: Remaining work\n**Depends**: TASK-001\n');
  engine.syncFromMarkdown(plan);
  return { engine, plan, dir };
}
afterEach(() => {
  engines.splice(0).forEach(e => e.closeDb());
  dirs.splice(0).forEach(d => rmSync(d, { recursive: true, force: true }));
});

describe('persistent task archives', () => {
  it('exposes the newest dated audit note without hiding ordinary comments', () => {
    const {engine}=fixture();
    engine.addComment('TASK-002','[Task audit 2026-11-06] Earlier assessment');
    engine.addComment('TASK-002','Ordinary discussion');
    engine.addComment('TASK-002','[Task audit 2026-11-06] Unverified; next: check runtime');
    expect(engine.getTasks().find(t=>t.id==='TASK-002').audit_note).toContain('Unverified; next: check runtime');
    expect(engine.getTask('TASK-002').comments).toHaveLength(3);
    expect(engine.getTask('TASK-002').audit_note).toContain('Unverified; next: check runtime');
  });
  it('supports older project comment tables without rewriting their history', () => {
    const {engine,dir}=fixture();
    engine.closeDb();
    const Database=require('better-sqlite3'), db=new Database(join(dir,'db.sqlite'));
    db.exec('ALTER TABLE comments RENAME COLUMN content TO body');
    db.close();
    engine.initDb(join(dir,'db.sqlite'));
    engine.addComment('TASK-002','[Task audit 2026-11-06] Legacy schema preserved');
    expect(engine.getTasks().find(t=>t.id==='TASK-002').audit_note).toContain('Legacy schema preserved');
    expect(engine.getTask('TASK-002').comments[0].content).toContain('Legacy schema preserved');
  });
  it('hides completed records from the board while retaining satisfied prerequisites', () => {
    const { engine } = fixture();
    engine.archiveTask('TASK-001', 'Completed review');
    expect(engine.getTasks().map(t => t.id)).toEqual(['TASK-002']);
    expect(engine.getTasks({ archivedOnly: true })[0]).toMatchObject({ id: 'TASK-001', status: 'done', archive_reason: 'Completed review' });
    expect(engine.getTasks({ includeArchived: true })).toHaveLength(2);
    expect(engine.getTask('TASK-001').archived_at).toBeTruthy();
    expect(engine.getTask('TASK-002').deps).toEqual(['TASK-001']);
    expect(engine.getReady().map(t => t.id)).toContain('TASK-002');
    expect(engine.getBlocked()).toHaveLength(0);
    expect(engine.getStats().total).toBe(1);
  });
  it('keeps archives through source sync and database reopening, and allows restoration', () => {
    const { engine, plan, dir } = fixture();
    engine.archiveTask('TASK-001', 'Completed review');
    engine.syncFromMarkdown(plan);
    engine.closeDb();
    engine.initDb(join(dir, 'db.sqlite'));
    expect(engine.getTasks()).toHaveLength(1);
    engine.restoreTask('TASK-001');
    expect(engine.getTasks()).toHaveLength(2);
    expect(engine.getTask('TASK-001').archived_at).toBeNull();
  });
  it('rejects unfinished or missing records without changing task status', () => {
    const { engine } = fixture();
    expect(() => engine.archiveTask('TASK-002', 'old')).toThrow(/completed/i);
    expect(() => engine.archiveTask('TASK-999', 'old')).toThrow(/not found/i);
    expect(engine.getTask('TASK-002').status).toBe('planned');
  });
  it('reopens a previously archived task when its source becomes unfinished', () => {
    const { engine, plan } = fixture();
    engine.archiveTask('TASK-001', 'Completed review');
    writeFileSync(plan, '### TASK-001: Reopened prerequisite (IN PROGRESS)\n\n### TASK-002: Remaining work\n**Depends**: TASK-001\n');
    engine.syncFromMarkdown(plan);
    expect(engine.getTask('TASK-001')).toMatchObject({ status: 'in_progress', archived_at: null });
    expect(engine.getReady()).toHaveLength(0);
    expect(engine.getBlocked().map(t => t.id)).toContain('TASK-002');
  });
  it('keeps the same task ID isolated between projects', () => {
    const one = fixture().engine;
    const two = fixture().engine;
    one.archiveTask('TASK-001', 'Completed review');
    expect(two.getTasks()).toHaveLength(2);
    expect(two.getTask('TASK-001').archived_at).toBeNull();
  });
  it('archives superseded unfinished work without pretending its prerequisites are complete', () => {
    const {engine,plan}=fixture();
    writeFileSync(plan,'### TASK-001: Retired work\n\n### TASK-002: Dependent\n**Depends**: TASK-001\n');
    engine.syncFromMarkdown(plan);
    engine.archiveTask('TASK-001','Replaced by another workflow','superseded');
    engine.syncFromMarkdown(plan);
    expect(engine.getTask('TASK-001')).toMatchObject({status:'planned',archive_disposition:'superseded'});
    expect(engine.getTasks().map(t=>t.id)).toEqual(['TASK-002']);
    expect(engine.getReady()).toHaveLength(0);
    expect(engine.getBlocked().map(t=>t.id)).toEqual(['TASK-002']);
    writeFileSync(plan,'### TASK-001: Work resumed (IN PROGRESS)\n\n### TASK-002: Dependent\n**Depends**: TASK-001\n');
    engine.syncFromMarkdown(plan);
    expect(engine.getTask('TASK-001').archived_at).toBeNull();
  });
});
