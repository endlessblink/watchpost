import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const apiPath = require.resolve('../../controlroom/api.js');
const apiRequire = createRequire(apiPath);
const { createPlanDoorEngine } = require('../../modules/plan-door-engine');

function outlook(query = { includeStale: '1' }, cached = null, options = {}, route = '/api/outlook') {
    const projects = [
        { name: 'imaginebox', root: '/product', masterPlan: '/product/MASTER_PLAN.md', planDoor: true, planCategory: 'imagine-box' },
        { name: 'finetuned', root: '/film', masterPlan: '/product/MASTER_PLAN.md', planDoor: true, planCategory: 'finetuned' },
        { name: 'ordinary', root: '/ordinary', masterPlan: '/ordinary/MASTER_PLAN.md' },
    ];
    const state = { revision: 9, evidence: {}, tasks: {
        'TASK-001': { title: 'Product work', status: 'IN PROGRESS', priority: 'P1', category: 'imagine-box', dependencies: [] },
        'TASK-002': { title: 'Film work', status: 'IN PROGRESS', priority: 'P0', category: 'finetuned', dependencies: [] },
        'TASK-003': { title: 'Product ready', status: 'READY', priority: 'P1', category: 'imagine-box', dependencies: [] },
        'TASK-004': { title: 'Film done', status: 'DONE', priority: 'P2', category: 'finetuned', dependencies: [] },
    } };
    const ordinary = '| TASK-100 | Ordinary work | P1 | IN PROGRESS |';
    const fakeFs = { ...fs, mkdirSync() {}, writeFileSync() {}, existsSync: () => false,
        readFileSync(file) {
            if (file.endsWith('/projects.json')) return JSON.stringify(projects);
            if (file.endsWith('/outlook.json') && cached) return JSON.stringify({ timestamp: Date.now(), payload: cached });
            if (file === '/ordinary/MASTER_PLAN.md') return ordinary;
            if (file === '/product/MASTER_PLAN.md') return '| TASK-999 | Stale shared work | P1 | IN PROGRESS |';
            throw new Error('Missing fixture: ' + file);
        },
    };
    const module = { exports: {} };
    vm.runInNewContext(fs.readFileSync(apiPath, 'utf8'), { module, exports: module.exports, process,
        require(id) {
            if (id === 'fs') return fakeFs;
            if (id === '../modules/plan-door-engine') return {
                createPlanDoorEngine: project => createPlanDoorEngine(project, () => JSON.stringify(state)),
            };
            return apiRequire(id);
        },
    }, { filename: apiPath });
    const handlers = new Map();
    module.exports({ get: (route, ...callbacks) => handlers.set(route, callbacks.at(-1)), post() {}, delete() {}, put() {}, patch() {} }, options);
    let result;
    handlers.get(route)({ query, params: { name: 'ordinary' } }, { json(payload) { result = payload; } });
    return result;
}

describe('engine-backed project summaries', () => {
    const options = { getTaskEngine: project => project.name === 'ordinary' ? {
        getStats: () => ({ total: 2, archived: 5, byStatus: [{ status: 'review', count: 1 }, { status: 'in_progress', count: 1 }] }),
        getTasks: () => [{ id: 'TASK-200', title: 'Current database work', status: 'in_progress' }],
    } : null };
    it('uses persisted unarchived counts and titles for ordinary outlook projects', () => {
        const project = outlook(undefined, null, options).projects.find(project => project.name === 'ordinary');
        expect(project.taskStats).toMatchObject({ total: 2, done: 0, inProgress: 1, review: 1 });
        expect(project.topInProgress).toEqual(['TASK-200: Current database work']);
    });
    it('uses the same persisted counts in project cards and project stats', () => {
        const cards = outlook(undefined, null, options, '/api/projects/enriched');
        expect(cards.find(project => project.name === 'ordinary').taskStats.total).toBe(2);
        expect(outlook(undefined, null, options, '/api/projects/:name/stats').tasks.total).toBe(2);
    });
});

describe('outlook managed plan scope', () => {
    it('counts authoritative scoped tasks and titles while preserving ordinary plans', () => {
        const payload = outlook();
        const product = payload.projects.find(project => project.name === 'imaginebox');
        const film = payload.projects.find(project => project.name === 'finetuned');
        const ordinary = payload.projects.find(project => project.name === 'ordinary');
        expect(product.taskStats).toMatchObject({ total: 2, inProgress: 1, review: 1, done: 0 });
        expect(product.topInProgress).toEqual(['TASK-001: Product work']);
        expect(film.taskStats).toMatchObject({ total: 1, inProgress: 1, done: 0, archived: 1, review: 0 });
        expect(film.topInProgress).toEqual(['TASK-002: Film work']);
        expect(ordinary.taskStats).toMatchObject({ total: 1, inProgress: 1 });
        expect(ordinary.topInProgress).toEqual(['TASK-100: Ordinary work']);
        expect(payload.globalStats).toMatchObject({ totalInProgress: 3, totalDone: 0, totalPlanned: 0 });
    });
    it('does not reuse stale Markdown-derived cache for managed plans', () => {
        const payload = outlook({}, { projects: [], globalStats: { totalInProgress: 999 } });
        expect(payload.projects.map(project => project.name)).toContain('imaginebox');
        expect(payload.globalStats.totalInProgress).toBe(3);
    });
});
