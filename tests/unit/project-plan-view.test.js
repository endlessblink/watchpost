import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const express = require('express');
const mountProjectPlan = require('../../modules/project-plan-view.js');
let root;
let server;
let base;

beforeEach(async () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'watchpost-plan-view-'));
    fs.writeFileSync(path.join(root, 'MASTER_PLAN.md'), '# Project\n| TASK-001 | A | P1 | READY | — | imagine-box |\n');
    fs.writeFileSync(path.join(root, 'projects.json'), JSON.stringify({ projects: [{ name: 'sample', root, masterPlan: path.join(root, 'MASTER_PLAN.md'), planCategory: 'finetuned', readOnlyPlan: true }] }));
    const app = express();
    mountProjectPlan(app, path.join(root, 'projects.json'), () => path.join(root, 'MASTER_PLAN.md'));
    await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
    base = `http://127.0.0.1:${server.address().port}`;
});

afterEach(async () => {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(root, { recursive: true, force: true });
});

describe('read-only project plan', () => {
    it('reads exact registered plan including category and READY without caching tasks', async () => {
        const response = await fetch(base + '/api/project-plan?project=sample');
        expect(response.status).toBe(200);
        expect(response.headers.get('cache-control')).toBe('no-store');
        const json = await response.json();
        expect(json.content).toBe(fs.readFileSync(path.join(root, 'MASTER_PLAN.md'), 'utf8'));
        expect(json.sha256).toMatch(/^[a-f0-9]{64}$/);
        expect(json.project).toBe('sample');
        expect(json.category).toBe('finetuned');
        expect(fs.existsSync(path.join(root, '.watchpost'))).toBe(false);
        fs.appendFileSync(path.join(root, 'MASTER_PLAN.md'), '\nOwner changed it.');
        const changed = await (await fetch(base + '/api/project-plan?project=sample')).json();
        expect(changed.sha256).not.toBe(json.sha256);
    });
    it('refuses missing, unknown, array and traversal selections without global fallback', async () => {
        for (const query of ['', '?project=unknown', '?project=../../MASTER_PLAN.md', '?project[]=sample']) {
            const response = await fetch(base + '/api/project-plan' + query);
            expect(response.status).toBe(query && !query.includes('[]') ? 404 : 400);
        }
    });
    it('returns explicit missing-file failure and exposes no write route', async () => {
        fs.unlinkSync(path.join(root, 'MASTER_PLAN.md'));
        expect((await fetch(base + '/api/project-plan?project=sample')).status).toBe(404);
        expect((await fetch(base + '/api/project-plan?project=sample', { method: 'POST' })).status).toBe(404);
    });
    it('opens managed projects without global activation or competing task cache', async () => {
        const selected = await (await fetch(base + '/api/projects/sample/activate', { method: 'POST' })).json();
        expect(selected.readOnly).toBe(true);
        expect(selected.viewUrl).toBe('/project-plan/?project=sample');
        for (const method of ['GET', 'POST']) {
            expect((await fetch(base + '/api/tasks/list', { method })).status).toBe(409);
        }
        expect(fs.existsSync(path.join(root, '.watchpost'))).toBe(false);
    });
});
