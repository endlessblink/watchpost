import { afterEach, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { createEngine } = createRequire(import.meta.url)('../../modules/task-engine.js');
let engine;
let dir;
afterEach(() => {
  engine?.closeDb();
  if (dir) fs.rmSync(dir, { recursive: true, force: true });
});
function sync(markdown) {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'watchpost-status-'));
  engine = createEngine();
  engine.initDb(path.join(dir, 'db.sqlite'));
  const file = path.join(dir, 'MASTER_PLAN.md');
  fs.writeFileSync(file, markdown);
  engine.syncFromMarkdown(file);
  return engine.getTasks();
}
describe('reviewed task status parsing', () => {
  it.each(['✅ **DONE** (2026-05-09)', 'DONE (verified present in dashboard 2026-10-05)', 'DONE 2026-10-16 — live checks passed'])('recognizes explicit completed status %s', (status) => {
    expect(sync(`| TASK-001 | Delivered work | P1 | ${status} | - |`)[0].status).toBe('done');
  });
  it.each(['DONE LOCALLY 2026-10-16', 'DONE but awaiting owner acceptance', 'DONE — remaining visual acceptance', 'DONE; live delivery unverified'])('keeps incomplete completion status in review: %s', (status) => {
    expect(sync(`| TASK-001 | Work | P1 | ${status} | - |`)[0].status).toBe('review');
  });
  it('keeps outstanding acceptance visible even with a struck task ID', () => {
    expect(sync('| ~~TASK-001~~ | Work | P1 | DONE but awaiting owner acceptance | - |')[0].status).toBe('review');
  });
  it('does not treat deployment alone as completion', () => {
    expect(sync('| TASK-001 | Work | P1 | DEPLOYED 2026-10-16 | - |')[0].status).not.toBe('done');
  });
  it('accepts reversed bold and strike wrappers used in existing plans', () => {
    expect(sync('| **~~BUG-039~~** | Delivered scorer | P0 | ✅ **DONE** (2026-04-12) | - |')[0].status).toBe('done');
  });
  it('preserves explicit table status when a detail heading has no status', () => {
    expect(sync('| TASK-001 | Work | P1 | DONE |\n\n### TASK-001 — Work\nMore detail.')[0].status).toBe('done');
  });
  it('honors an explicit detail status over the table', () => {
    expect(sync('| TASK-001 | Work | P1 | DONE | - |\n\n### TASK-001 — Work\n**Status:** in_progress')[0].status).toBe('in_progress');
  });
});
