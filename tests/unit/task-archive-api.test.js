import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const express = require('express');
const { createEngine } = require('../../modules/task-engine');
const { mountTaskArchiveRoutes } = require('../../modules/task-archive-api');
let dir, engine, server, base, plan, requestEngine;

beforeEach(async () => {
    server = null;
    dir = mkdtempSync(join(tmpdir(), 'watchpost-archive-api-'));
    plan = join(dir, 'MASTER_PLAN.md');
    writeFileSync(plan, '### TASK-001: Finished prerequisite (DONE)\n\n### TASK-002: Open work\n**Depends**: TASK-001\n');
    engine = createEngine();
    engine.initDb(join(dir, 'db.sqlite'));
    engine.syncFromMarkdown(plan);
    requestEngine = engine;
    const app = express();
    app.use(express.json());
    mountTaskArchiveRoutes(app, (req, res, next) => { req.taskEngine = requestEngine; next(); });
    await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
    base = `http://127.0.0.1:${server.address().port}`;
});

afterEach(async () => {
    if (server) await new Promise(resolve => server.close(resolve));
    engine?.closeDb();
    if (dir) rmSync(dir, { recursive: true, force: true });
});

async function post(id, action, body = {}) {
    const response = await fetch(`${base}/api/tasks/${id}/${action}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
}

describe('task archive routes', () => {
    it('persists archive through sync and reopening, keeps source and dependencies, then restores', async () => {
        const original = readFileSync(plan, 'utf8');
        const archived = await post('TASK-001', 'archive', { reason: 'Verified complete' });
        expect(archived).toMatchObject({ status: 200, body: { id: 'TASK-001', archived: true,
            task: { status: 'done', archive_reason: 'Verified complete' } } });
        expect(archived.body.task.archived_at).toBeTruthy();
        engine.syncFromMarkdown(plan);
        engine.closeDb();
        engine.initDb(join(dir, 'db.sqlite'));
        expect(engine.getTasks().map(task => task.id)).toEqual(['TASK-002']);
        expect(engine.getReady().map(task => task.id)).toContain('TASK-002');
        expect(readFileSync(plan, 'utf8')).toBe(original);
        expect(await post('TASK-001', 'restore')).toMatchObject({ status: 200,
            body: { id: 'TASK-001', archived: false, task: { status: 'done', archived_at: null } } });
        expect(engine.getTasks()).toHaveLength(2);
    });

    it('rejects unfinished work without changing its status', async () => {
        expect((await post('TASK-002', 'archive')).status).toBe(409);
        expect(engine.getTask('TASK-002')).toMatchObject({ status: 'planned', archived_at: null });
    });
    it('requires an explicit disposition and reason to retire unfinished work', async () => {
        expect((await post('TASK-002','archive',{disposition:'superseded'})).status).toBe(400);
        expect((await post('TASK-002','archive',{disposition:'made-up',reason:'old'})).status).toBe(400);
        const result=await post('TASK-002','archive',{disposition:'superseded',reason:'Replaced by the canonical workflow'});
        expect(result).toMatchObject({status:200,body:{task:{status:'planned',archive_disposition:'superseded'}}});
    });

    it('returns 404 for unknown archive and restore targets', async () => {
        for (const action of ['archive', 'restore']) expect((await post('TASK-999', action)).status).toBe(404);
    });

    it('validates archive reasons and permits an omitted reason', async () => {
        for (const reason of [null, 12, {}, [], 'x'.repeat(1001)]) {
            expect((await post('TASK-001', 'archive', { reason })).status).toBe(400);
            expect(engine.getTask('TASK-001').archived_at).toBeNull();
        }
        expect((await post('TASK-001', 'archive')).status).toBe(200);
    });

    it('preserves managed-plan authority when archive operations are unsupported', async () => {
        requestEngine = { getTask: () => ({ id: 'TASK-001', status: 'done' }) };
        for (const action of ['archive', 'restore']) expect((await post('TASK-001', action)).status).toBe(409);
        expect(engine.getTask('TASK-001').archived_at).toBeNull();
    });
});
