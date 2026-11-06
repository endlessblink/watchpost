import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createPlanFile, starterPlan } = require('../../modules/plan-create.js');
const { resolveProject, cookieValue, PROJECT_COOKIE } = require('../../modules/plan-door-engine.js');

let root;
beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'wp-plan-')); });

describe('createPlanFile', () => {
    it('creates a plan with a first task in the project root', () => {
        const res = createPlanFile({ name: 'demo', root });
        expect(res).toMatchObject({ ok: true, created: true, planPath: path.join(root, 'MASTER_PLAN.md') });
        const text = fs.readFileSync(res.planPath, 'utf8');
        expect(text).toContain('# demo - Master Plan');
        expect(text).toMatch(/### TASK-001: .+\n\*\*Status\*\*: Todo/);
    });

    it('never overwrites an existing plan', () => {
        const plan = path.join(root, 'MASTER_PLAN.md');
        fs.writeFileSync(plan, 'MINE');
        const res = createPlanFile({ name: 'demo', root });
        expect(res).toMatchObject({ ok: true, created: false, planPath: plan });
        expect(fs.readFileSync(plan, 'utf8')).toBe('MINE');
    });

    it('reuses a plan that already lives in docs/', () => {
        fs.mkdirSync(path.join(root, 'docs'));
        const plan = path.join(root, 'docs', 'MASTER_PLAN.md');
        fs.writeFileSync(plan, 'DOCS PLAN');
        const res = createPlanFile({ name: 'demo', root });
        expect(res).toMatchObject({ ok: true, created: false, planPath: plan });
        expect(fs.existsSync(path.join(root, 'MASTER_PLAN.md'))).toBe(false);
    });

    it('refuses a project whose folder is missing', () => {
        expect(createPlanFile({ name: 'x', root: path.join(root, 'nope') })).toMatchObject({ ok: false, code: 'ROOT_MISSING' });
        expect(createPlanFile({ name: 'x' })).toMatchObject({ ok: false, code: 'NO_ROOT' });
    });

    it('starter text is stable and names the project', () => {
        expect(starterPlan('abc')).toContain('# abc - Master Plan');
    });
});

describe('which project a request means', () => {
    const projects = [
        { name: 'a', root: '/p/a', masterPlan: '/p/a/MASTER_PLAN.md' },
        { name: 'b', root: '/p/b', masterPlan: '/p/b/MASTER_PLAN.md' },
        { name: 'c', root: '/p/c', masterPlan: '/p/c/MASTER_PLAN.md' },
    ];
    const cookie = name => ({ headers: { cookie: `x=1; ${PROJECT_COOKIE}=${encodeURIComponent(name)}; y=2` } });

    it('reads the cookie value safely', () => {
        expect(cookieValue('a=1; wp_project=hello%20x; b=2', 'wp_project')).toBe('hello x');
        expect(cookieValue('', 'wp_project')).toBe('');
        expect(cookieValue(undefined, 'wp_project')).toBe('');
        expect(cookieValue('wp_project=%E0%A4%A', 'wp_project')).toBe('');
    });

    it('this browser\'s choice beats the global default', () => {
        expect(resolveProject(projects, cookie('b'), '/p/a/MASTER_PLAN.md', 'a').name).toBe('b');
    });

    it('an explicit project or folder beats the browser choice', () => {
        expect(resolveProject(projects, { ...cookie('b'), query: { project: 'c' } }, '/p/a/MASTER_PLAN.md', 'a').name).toBe('c');
        expect(resolveProject(projects, { ...cookie('b'), query: { cwd: '/p/c/src' } }, '/p/a/MASTER_PLAN.md', 'a').name).toBe('c');
    });

    it('an unknown cookie falls back to the global default', () => {
        expect(resolveProject(projects, cookie('ghost'), '/p/a/MASTER_PLAN.md', 'a').name).toBe('a');
    });

    it('without a cookie the global default is used (agents, CLI)', () => {
        expect(resolveProject(projects, { headers: {} }, '/p/a/MASTER_PLAN.md', 'a').name).toBe('a');
    });
});
