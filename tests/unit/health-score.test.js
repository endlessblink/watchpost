import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { calculateHealthScore } = require('../../scripts/health-scanner.js');

const perfect = {
    typescript: { count: 0 },
    eslint: { errors: 0, warnings: 0 },
    deadCode: { files: 0 },
    coverage: { coverage: 100 },
    bundleSize: { totalMB: 1 },
    audit: { total: 0, critical: 0, high: 0 },
    outdated: { count: 0 },
};

describe('health score', () => {
    it('is 100 when every check is measured and clean', () => {
        const h = calculateHealthScore(perfect);
        expect(h.score).toBe(100);
        expect(h.grade).toBe('A');
        expect(h.measuredChecks).toBe(7);
    });

    it('leaves a check that was never measured out instead of scoring it zero', () => {
        const { coverage, ...withoutCoverage } = perfect;
        const h = calculateHealthScore(withoutCoverage);
        expect(h.score).toBe(100);
        expect(h.measuredChecks).toBe(6);
        const row = h.explain.find(r => r.key === 'coverage');
        expect(row).toMatchObject({ measured: false, weight: 0, points: 0, score: null });
        expect(row.note).toMatch(/left out/);
    });

    it('a real weakness still costs points, and the rows add up to the score', () => {
        const h = calculateHealthScore({ ...perfect, coverage: { coverage: 50 } });
        expect(h.score).toBeLessThan(100);
        const sum = h.explain.reduce((acc, r) => acc + r.points, 0);
        expect(Math.abs(sum - h.score)).toBeLessThan(1.1);
        expect(h.explain.reduce((acc, r) => acc + r.weight, 0)).toBeGreaterThanOrEqual(99);
    });

    it('with nothing measured the score is 0 and says so', () => {
        const h = calculateHealthScore({});
        expect(h.score).toBe(0);
        expect(h.measuredChecks).toBe(0);
    });
});
