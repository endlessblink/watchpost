import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createPlanDoorEngine, resolveProject, selectProject } = require('../../modules/plan-door-engine');
const projects = [{ name: 'imaginebox', root: '/product', masterPlan: '/product/MASTER_PLAN.md', planCategory: 'imagine-box' }, { name: 'finetuned', root: '/film', masterPlan: '/product/MASTER_PLAN.md', planCategory: 'finetuned' }];
const state = { revision: 6, tasks: { 'TASK-001': { title: 'Product', status: 'READY', priority: 'P1', category: 'imagine-box', dependencies: [] }, 'TASK-002': { title: 'Film', status: 'PLANNED', priority: 'P1', category: 'finetuned', dependencies: ['TASK-001'] } }, evidence: {} };

describe('native plan-door engine', () => {
    it('archives accepted history in the view while retaining canonical dependency completion', () => {
        const snapshot=structuredClone(state);
        snapshot.tasks['TASK-001'].status='DONE';
        snapshot.tasks['TASK-003']={title:'Next product task',status:'PLANNED',priority:'P1',category:'imagine-box',dependencies:['TASK-001']};
        const engine=createPlanDoorEngine(projects[0],()=>JSON.stringify(snapshot));
        expect(engine.getTasks().map(t=>t.id)).toEqual(['TASK-003']);
        expect(engine.getTasks({archivedOnly:true}).map(t=>t.id)).toEqual(['TASK-001']);
        expect(engine.getTasks({includeArchived:true})).toHaveLength(2);
        expect(engine.getReady().map(t=>t.id)).toEqual(['TASK-003']);
        expect(engine.getStats()).toMatchObject({total:1,archived:1});
        expect(engine.getTask('TASK-001').original_status).toBe('DONE');
        expect(()=>engine.updateStatus('TASK-001','planned')).toThrow('evidence-gated');
    });
    it('uses canonical CLI JSON, scopes categories and preserves READY', () => {
        const calls = [];
        const engine = createPlanDoorEngine(projects[0], (...args) => { calls.push(args); return JSON.stringify(state); });
        expect(calls[0][1]).toEqual(['/product/tools/plan_tracker.py', 'list']);
        expect(engine.getTasks()).toMatchObject([{ id: 'TASK-001', status: 'review', original_status: 'READY' }]);
        expect(engine.getStats().total).toBe(1);
        expect(engine.markdown()).toContain('| TASK-001 | imagine-box | Product | REVIEW | P1 | — |');
        expect(() => engine.updateStatus('TASK-001', 'done')).toThrow('evidence-gated');
    });
    it('keeps cross-category dependencies blocked and separate scopes with same plan path', () => {
        const engine = createPlanDoorEngine(projects[1], () => JSON.stringify(state));
        expect(engine.getReady()).toEqual([]);
        expect(engine.getBlocked()).toMatchObject([{ id: 'TASK-002' }]);
        expect(resolveProject(projects, {}, '/product/MASTER_PLAN.md', 'finetuned').name).toBe('finetuned');
        expect(resolveProject(projects, { query: { cwd: '/film' } }, '/product/MASTER_PLAN.md', 'imaginebox').name).toBe('finetuned');
        expect(resolveProject(projects, { query: { project: 'imaginebox' } }, '/product/MASTER_PLAN.md', 'finetuned').name).toBe('imaginebox');
    });
    it('ordinary selection persists distinct project identity without modifying plan data', () => {
        const environment = {};
        const calls = [];
        selectProject(projects[1], environment, (...args) => calls.push(args));
        expect(environment.WATCHPOST_PROJECT_NAME).toBe('finetuned');
        expect(resolveProject(projects, {}, environment.MASTER_PLAN_PATH, environment.WATCHPOST_PROJECT_NAME).name).toBe('finetuned');
        selectProject(projects[0], environment, (...args) => calls.push(args));
        expect(environment.WATCHPOST_PROJECT_NAME).toBe('imaginebox');
        expect(calls).toHaveLength(4);
    });
});
