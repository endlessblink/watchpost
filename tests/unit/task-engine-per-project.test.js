// Noam 2026-11-03: the board for termfleet showed another project's tasks because one global engine was flipped between projects.
// Each project has its own engine and database; alternating use must never mix them.
// (Plain-Node proof, since vitest may run under a Node that cannot load better-sqlite3: task-engine-per-project.check.cjs)
import { describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
const { createEngine } = createRequire(import.meta.url)('../../modules/task-engine.js');
const header = '| ID | Lane | Task | Status | Priority | Deps |\n|----|------|------|--------|----------|------|\n';
const mk = (rows) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'wp-pp-')); const md = path.join(d, 'MASTER_PLAN.md'); fs.writeFileSync(md, '# P\n\n' + header + rows); return { d, md }; };

describe('one engine per project', () => {
    it('alternating engines return only their own project tasks', () => {
        const A = mk('| A-1 | x | Alpha one | Planned | P1 | - |\n');
        const B = mk('| B-1 | y | Beta one | Planned | P1 | - |\n| B-2 | y | Beta two | Planned | P1 | - |\n');
        const ea = createEngine(), eb = createEngine();
        ea.initDb(path.join(A.d, '.watchpost', 'db.sqlite')); eb.initDb(path.join(B.d, '.watchpost', 'db.sqlite'));
        ea.syncFromMarkdown(A.md); eb.syncFromMarkdown(B.md);
        for (let i = 0; i < 3; i++) {
            expect(ea.getTasks().map((t) => t.id)).toEqual(['A-1']);
            expect(eb.getTasks().map((t) => t.id)).toEqual(['B-1', 'B-2']);
        }
        ea.closeDb(); eb.closeDb();
    });
});
