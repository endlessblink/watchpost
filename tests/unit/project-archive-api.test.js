import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { updateProjectArchive, mountProjectArchiveRoutes } = require('../../modules/project-archive-api');
describe('reversible project archival', () => {
    it('preserves selection and managed metadata then restores', () => {
        const data = { selected: 'managed', projects: [{ name: 'managed', active: true, planDoor: 'door', planCategory: 'finetuned', masterPlan: '/plan', modules: ['x'] }] };
        const before = structuredClone(data);
        expect(updateProjectArchive(data, 'managed', true, 'Duplicate', 'first').project).toMatchObject({ ...before.projects[0], archived: true, archivedAt: 'first', archiveReason: 'Duplicate' });
        updateProjectArchive(data, 'managed', true, 'Duplicate', 'second');
        expect(data.projects[0].archivedAt).toBe('first');
        updateProjectArchive(data, 'managed', false);
        expect(data).toEqual(before);
    });
    it('rejects invalid reasons and unknown projects without mutation', () => {
        const data = { projects: [{ name: 'one' }] };
        expect(updateProjectArchive(data, 'unknown', true, 'Absent').status).toBe(404);
        for (const reason of ['', null, 5, {}, 'x'.repeat(1001)]) expect(updateProjectArchive(data, 'one', true, reason).status).toBe(400);
        expect(data.projects[0]).toEqual({ name: 'one' });
    });
    it('mounts both routes and persists only successful changes', () => {
        const routes = {}, data = { projects: [{ name: 'one' }] }; let writes = 0;
        mountProjectArchiveRoutes({ post: (url, handler) => { routes[url] = handler; } }, () => data, () => writes++);
        let body, status;
        const res = { status: n => { status = n; return res; }, json: x => { body = x; } };
        routes['/api/projects/:name/archive']({ params: { name: 'one' }, body: { reason: 'Duplicate' } }, res);
        expect(status).toBe(200); expect(body.project.archived).toBe(true); expect(writes).toBe(1);
        routes['/api/projects/:name/restore']({ params: { name: 'one' }, body: {} }, res);
        expect(body.project.archived).toBeUndefined(); expect(writes).toBe(2);
        routes['/api/projects/:name/archive']({ params: { name: 'absent' }, body: { reason: 'Duplicate' } }, res);
        expect(status).toBe(404); expect(writes).toBe(2);
    });
});
