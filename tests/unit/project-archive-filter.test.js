import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const start = html.indexOf('function applyFilter(items)');
const code = html.slice(start, html.indexOf('function render()', start));
describe('everyday project selection', () => {
  it('omits archived duplicates and templates, retaining an explicitly active archive', () => {
    const context = vm.createContext({ filter: '', isActiveProject: p => p.name === 'selected archive' });
    vm.runInContext(code, context);
    const result = context.applyFilter([{ name: 'normal' }, { name: 'duplicate', archived: true }, { name: 'selected archive', archived: true }]);
    expect(result.map(p => p.name)).toEqual(['normal', 'selected archive']);
  });
});
