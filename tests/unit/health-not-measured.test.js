import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const scanner = require('../../scripts/health-scanner.js');

let empty;
beforeAll(() => { empty = fs.mkdtempSync(path.join(os.tmpdir(), 'wp-health-')); });
afterAll(() => { fs.rmSync(empty, { recursive: true, force: true }); });

describe('a check that cannot run is "not measured", never a fake zero', () => {
    it('type check without a tsconfig is not measured and has no count', async () => {
        const r = await scanner.scanTypeScript(undefined, empty);
        expect(r.status).toBe('not-measured');
        expect(r.count).toBeUndefined();
        expect(r.reason).toMatch(/tsconfig/);
    });

    it('lint, dead code, audit and outdated are not measured in a folder with no JavaScript project', async () => {
        for (const fn of ['scanESLint', 'scanDeadCode', 'scanAudit', 'scanOutdated']) {
            const r = await scanner[fn](undefined, empty);
            expect(r.status, fn).toBe('not-measured');
            expect(r.errors ?? r.files ?? r.total ?? r.count, fn).toBeUndefined();
        }
    });

    it('bundle size and coverage without a build or report are not measured', async () => {
        for (const fn of ['scanBundleSize', 'scanCoverage']) {
            const r = await scanner[fn](undefined, empty);
            expect(r.status, fn).toBe('not-measured');
        }
    });

    it('tool help text counts as "did not run"', () => {
        expect(scanner.toolDidNotRun({ stdout: 'Version 5.4\nCommon Commands:\n  tsc', stderr: '' })).toBe(true);
        expect(scanner.toolDidNotRun({ stdout: '', stderr: 'sh: 1: vue-tsc: not found' })).toBe(true);
        expect(scanner.toolDidNotRun({ stdout: 'Unknown command: "knip"', stderr: '' })).toBe(true);
        expect(scanner.toolDidNotRun({ stdout: 'src/a.ts(1,1): error TS2304: x', stderr: '' })).toBe(false);
    });

    it('not-measured results are left out of the score and explain why', () => {
        const nm = scanner.notMeasured('No TypeScript setup (no tsconfig.json) in this project.');
        const h = scanner.calculateHealthScore({
            typescript: nm, eslint: scanner.notMeasured('No ESLint setup in this project.'),
            deadCode: { files: 0 }, coverage: scanner.notMeasured('x'), bundleSize: scanner.notMeasured('x'),
            audit: { total: 0, critical: 0, high: 0 }, outdated: { count: 0 }
        });
        expect(h.measuredChecks).toBe(3);
        expect(h.score).toBe(100);
        const ts = h.explain.find(r => r.key === 'typescript');
        expect(ts.measured).toBe(false);
        expect(ts.score).toBeNull();
        expect(ts.note).toMatch(/tsconfig/);
    });
});
