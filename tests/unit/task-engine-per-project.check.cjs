// Two projects, two engines, used alternately: each must only ever return its own tasks.
const assert = require('assert');
const fs = require('fs'), os = require('os'), path = require('path');
const { createEngine } = require('../../modules/task-engine.js');
const header = '| ID | Lane | Task | Status | Priority | Deps |\n|----|------|------|--------|----------|------|\n';
const mk = (rows) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'wp-pp-')); const md = path.join(d, 'MASTER_PLAN.md'); fs.writeFileSync(md, '# P\n\n' + header + rows); return { d, md }; };
const A = mk('| A-1 | x | Alpha one | Planned | P1 | - |\n| A-2 | x | Alpha two | Planned | P2 | A-1 |\n');
const B = mk('| B-1 | y | Beta one | Planned | P1 | - |\n');
const ea = createEngine(), eb = createEngine();
ea.initDb(path.join(A.d, '.watchpost', 'db.sqlite')); eb.initDb(path.join(B.d, '.watchpost', 'db.sqlite'));
ea.syncFromMarkdown(A.md); eb.syncFromMarkdown(B.md);
for (let i = 0; i < 3; i++) {
  assert.deepStrictEqual(ea.getTasks().map(t => t.id), ['A-1', 'A-2']);
  assert.deepStrictEqual(eb.getTasks().map(t => t.id), ['B-1']);
  assert.strictEqual(ea.getStats().total, 2); assert.strictEqual(eb.getStats().total, 1);
}
ea.updateStatus('A-1', 'done');
assert.strictEqual(eb.getTask('B-1').status !== 'done', true);
assert.strictEqual(eb.getTask('A-1'), null);
// closing one engine does not affect the other
ea.closeDb(); assert.deepStrictEqual(eb.getTasks().map(t => t.id), ['B-1']);
eb.closeDb();
console.log('per-project engines OK');
