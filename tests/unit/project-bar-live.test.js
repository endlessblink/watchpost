import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname, '../..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

describe('project bar and cards stay current', () => {
    it('the bar reads live counts from the task service on project change and on every sync', () => {
        const html = read('index.html');
        expect(html).toContain("fetch('/api/tasks/stats");
        const setBadge = html.slice(html.indexOf('function setActiveBadge'), html.indexOf('async function refreshBarStats'));
        expect(setBadge).toContain('refreshBarStats()');
        const sync = html.slice(html.indexOf('async function syncActiveProject'), html.indexOf('setInterval(syncActiveProject'));
        expect(sync).toContain('refreshBarStats()');
    });

    it('the project list reports whether a plan file exists and cards say so', () => {
        expect(read('controlroom/api.js')).toContain('planExists');
        expect(read('controlroom/index.html')).toContain('No plan file yet');
        expect(read('index.html')).toContain('No plan file yet');
    });
});
