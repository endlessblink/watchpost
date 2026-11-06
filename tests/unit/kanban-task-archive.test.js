import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../../kanban/index.html', import.meta.url), 'utf8');
const start = html.indexOf('async function loadTaskApiKanbanData(');
const end = html.indexOf('// Render kanban board', start);
const loader = html.slice(start, end);

describe('native archive board loading', () => {
  it('keeps a successful empty task list authoritative instead of resurrecting source tasks', async () => {
    const context = vm.createContext({ CONFIG: { useApi: true }, API_BASE: '', Date, AbortSignal,
      fetch: async () => ({ ok: true, json: async () => ({ tasks: [] }) }), console });
    vm.runInContext(loader, context);
    const data = await context.loadTaskApiKanbanData();
    expect(data).not.toBeNull();
    expect(data.activeWork).toEqual([]);
  });
  it('requests preserved archived records for the archive view', async () => {
    const urls = [];
    const context = vm.createContext({ CONFIG: { useApi: true }, API_BASE: '', Date, AbortSignal,
      fetch: async url => { urls.push(url); return { ok: true, json: async () => ({ tasks: [{ id: 'TASK-001', title: 'Complete', status: 'done', archived_at: '2026-11-06', archive_reason: 'Reviewed complete' }] }) }; }, console });
    vm.runInContext(loader, context);
    const data = await context.loadTaskApiKanbanData(true);
    expect(urls[0]).toContain('includeArchived=1');
    expect(data.activeWork[0]).toMatchObject({ id: 'TASK-001', status: 'done', archivedAt: '2026-11-06' });
  });
});
