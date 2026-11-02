// Noam 2026-11-02: the Watchpost board for termfleet kept 246 old tasks (85 titled "P1"/"P2") after MASTER_PLAN.md was cleaned: the sync only added and updated, never removed.
// The plan file is the source: a task that is no longer in it is no longer on the board.
import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
const engine = createRequire(import.meta.url)('../../modules/task-engine.js');

describe('syncFromMarkdown reconciles with the plan file', () => {
    it('a task removed from MASTER_PLAN.md leaves the board on the next sync', () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wp-reconcile-'));
        const md = path.join(dir, 'MASTER_PLAN.md');
        const header = '| ID | Lane | Task | Status | Priority | Deps |\n|----|------|------|--------|----------|------|\n';
        fs.writeFileSync(md, `# Plan\n\n${header}| T-1 | A | First thing | Planned | P1 | - |\n| T-2 | A | Old thing | Planned | P2 | T-1 |\n`);
        engine.initDb(path.join(dir, 'db.sqlite'));
        expect(engine.syncFromMarkdown(md)).toBe(2);
        fs.writeFileSync(md, `# Plan\n\n${header}| T-1 | A | First thing | Planned | P1 | - |\n| T-3 | A | New thing | Planned | P1 | - |\n`);
        engine.syncFromMarkdown(md);
        expect(engine.getTasks().map((t) => t.id).sort()).toEqual(['T-1', 'T-3']);
        engine.closeDb();
    });
});
