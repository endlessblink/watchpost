import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname, '../..');
const pages = fs.readdirSync(root, { withFileTypes: true })
    .filter(d => d.isDirectory() && fs.existsSync(path.join(root, d.name, 'index.html')) && d.name !== 'local' && d.name !== 'node_modules')
    .map(d => d.name);

describe('shared Dusk dropdown', () => {
    it('every page with a <select> loads dusk-select.js and the shared styles', () => {
        const offenders = [];
        for (const dir of pages) {
            const html = fs.readFileSync(path.join(root, dir, 'index.html'), 'utf8');
            if (!/<select[\s>]/.test(html)) continue;
            if (!html.includes('../dusk-select.js') || !html.includes('../dusk-tokens.css')) offenders.push(dir);
        }
        expect(offenders).toEqual([]);
    });

    it('styles for the menu live in the shared tokens file', () => {
        const css = fs.readFileSync(path.join(root, 'dusk-tokens.css'), 'utf8');
        expect(css).toContain('.dusk-menu');
        expect(css).toContain('.dusk-opt');
    });
});
