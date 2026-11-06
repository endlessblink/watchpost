import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(__dirname, '../..');
const launcher = fs.readFileSync(path.join(repoRoot, 'watchpost'), 'utf8');

describe('Watchpost remote access CLI', () => {
    it('uses private Tailscale Serve for remote access', () => {
        expect(launcher).toContain('tailscale serve --bg --https="${REMOTE_HTTPS_PORT}" "${PORT}"');
        expect(launcher).toContain('tailscale serve --https="${REMOTE_HTTPS_PORT}" off');
        expect(launcher).toContain('tailscale serve status');
    });

    it('does not expose Watchpost through Funnel or reset unrelated routes', () => {
        expect(launcher).not.toMatch(/tailscale funnel.*WATCHPOST|WATCHPOST.*tailscale funnel/);
        expect(launcher).not.toContain('tailscale serve reset');
        expect(launcher).not.toContain('tailscale funnel reset');
    });
});
