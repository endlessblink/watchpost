import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const { createEngine } = createRequire(import.meta.url)('../../modules/task-engine.js');
let engine, folder, plan;
const ids = tasks => tasks.map(task => task.id).sort();
const sync = rows => {
    fs.writeFileSync(plan, '| ID | Lane | Task | Status | Priority | Deps |\n|---|---|---|---|---|---|\n' +
        rows.map(([id, status, dependencies = '-']) => `| ${id} | Work | ${id} outcome | ${status} | P1 | ${dependencies} |`).join('\n'));
    engine.syncFromMarkdown(plan);
};

beforeEach(() => {
    folder = fs.mkdtempSync(path.join(os.tmpdir(), 'watchpost-readiness-'));
    plan = path.join(folder, 'MASTER_PLAN.md');
    engine = createEngine();
    engine.initDb(path.join(folder, 'db.sqlite'));
});
afterEach(() => {
    engine.closeDb();
    fs.rmSync(folder, { recursive: true, force: true });
});

describe('canonical native task readiness', () => {
    it('offers only planned tasks with resolved prerequisites', () => {
        sync([['TASK-1', 'Planned'], ['TASK-2', 'In Progress'], ['TASK-3', 'Review'],
            ['TASK-4', 'Paused'], ['TASK-5', 'Done'], ['TASK-6', 'Planned', 'TASK-5'],
            ['TASK-7', 'Planned', 'TASK-3']]);
        expect(ids(engine.getReady())).toEqual(['TASK-1', 'TASK-6']);
        expect(ids(engine.getBlocked())).toEqual(['TASK-7']);
    });

    it('missing prerequisites block instead of silently satisfying a dependency', () => {
        sync([['TASK-2', 'Planned', 'TASK-1']]);
        expect(ids(engine.getReady())).toEqual([]);
        expect(ids(engine.getBlocked())).toEqual(['TASK-2']);
        expect(engine.getGraph().links).toEqual([{ target: 'TASK-2', source: 'TASK-1' }]);
    });

    it('archiving a prerequisite removes its task but preserves the surviving dependency', () => {
        sync([['TASK-1', 'Done'], ['TASK-2', 'Planned', 'TASK-1']]);
        expect(ids(engine.getReady())).toEqual(['TASK-2']);
        sync([['TASK-2', 'Planned', 'TASK-1']]);
        expect(engine.getTask('TASK-1')).toBeNull();
        expect(ids(engine.getReady())).toEqual([]);
        expect(ids(engine.getBlocked())).toEqual(['TASK-2']);
        expect(engine.getGraph().links).toEqual([{ target: 'TASK-2', source: 'TASK-1' }]);
        engine.closeDb();
        engine.initDb(path.join(folder, 'db.sqlite'));
        expect(ids(engine.getBlocked())).toEqual(['TASK-2']);
        sync([['TASK-1', 'Done'], ['TASK-2', 'Planned', 'TASK-1']]);
        expect(ids(engine.getReady())).toEqual(['TASK-2']);
        sync([['TASK-2', 'Planned']]);
        expect(ids(engine.getReady())).toEqual(['TASK-2']);
        expect(engine.getGraph().links).toEqual([]);
    });
});
