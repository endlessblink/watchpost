import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(__dirname, '../..');
const readRepoFile = (rel) => fs.readFileSync(path.join(repoRoot, rel), 'utf8');

describe('Project switcher regression coverage', () => {
    // Guards against the regression where the well-designed project switcher
    // (badge + popover + search + per-project meta) was replaced with a
    // bare <select id="project-select"> that rendered as the native dropdown.
    it('keeps the project-switcher badge + popover markup in the header', () => {
        const html = readRepoFile('index.html');

        expect(html).toContain('id="active-project-badge"');
        expect(html).toContain('id="bar-name"');
        expect(html).toContain('project-switcher-trigger');
        expect(html).toContain('id="project-switcher-popover"');
        expect(html).toContain('id="project-switcher-search"');
        expect(html).toContain('id="project-switcher-list"');
        expect(html).toContain('id="project-switcher-manage"');

        expect(html).not.toContain('id="project-select"');
        expect(html).not.toContain('id="project-scan-btn"');
    });

    // The popover must paint above the iframe content: the rail sits above the frames
    // and the popover is fixed with a higher z-index than the rail.
    it('keeps the rail and popover above iframes so the popover is visible', () => {
        const css = readRepoFile('shell.css');

        const railBlock = css.match(/\.rail\s*\{[^}]*\}/);
        expect(railBlock, '.rail CSS block missing').not.toBeNull();
        expect(railBlock[0]).toMatch(/position:\s*relative/);
        expect(railBlock[0]).toMatch(/z-index:\s*30/);

        const popover = css.match(/\.project-switcher-popover\s*\{[^}]*\}/);
        expect(popover, '.project-switcher-popover CSS block missing').not.toBeNull();
        expect(popover[0]).toMatch(/position:\s*fixed/);
        expect(popover[0]).toMatch(/z-index:\s*50/);
    });

    it('always shows which project is on and follows the server', () => {
        const html = readRepoFile('index.html');

        expect(html).toContain('id="bar-name"');
        expect(html).toContain('id="bar-thumb"');
        // one control: the side menu no longer repeats the project
        expect(html).not.toContain('id="active-project-caption"');
        expect(html).toContain('syncActiveProject');
    });

    it('wires the switcher to the activate API and broadcasts to iframes', () => {
        const html = readRepoFile('index.html');

        expect(html).toContain("'/api/projects/'");
        expect(html).toContain("'/activate'");
        expect(html).toContain('/api/projects/enriched');
        expect(html).toContain('broadcastProjectSwitch');
        expect(html).toContain("switchTab('kanban')");
        expect(html).toContain("switchTab('projects')"); // Manage all → Projects tab
    });

    it('supports keyboard nav + search filtering in the popover', () => {
        const html = readRepoFile('index.html');

        // Search input feeds the filter
        expect(html).toMatch(/search\.addEventListener\(\s*'input'/);
        // Arrow keys + Enter + Escape handled
        expect(html).toMatch(/case 'ArrowDown'|e\.key === 'ArrowDown'/);
        expect(html).toMatch(/case 'ArrowUp'|e\.key === 'ArrowUp'/);
        expect(html).toMatch(/case 'Enter'|e\.key === 'Enter'/);
        expect(html).toMatch(/case 'Escape'|e\.key === 'Escape'/);
    });

    it('keeps Control Room cards switching the active project on click', () => {
        const html = readRepoFile('controlroom/index.html');

        // Activate handler, not openDetail-on-click
        expect(html).toContain('async function activateProject(name)');
        expect(html).toContain("'/api/projects/' + encodeURIComponent(name) + '/activate'");
        // Card body click triggers activate, not detail overlay
        expect(html).toContain("action === 'open'");
        expect(html).toContain('activateProject(name)');
        // Parent navigation message
        expect(html).toContain("type: 'activate-and-navigate'");
        expect(html).toContain("target: 'kanban'");
        // The pick travels with the message so the shell updates without waiting for an event
        expect(html).toMatch(/activate-and-navigate'[^;]*project:/);
    });

    it('keeps the launcher server detached after the shell exits', () => {
        const launcher = readRepoFile('watchpost');

        expect(launcher).toContain('nohup setsid env WATCHPOST_CWD=');
        expect(launcher).toContain('disown "$pid"');
    });
});
