import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(__dirname, '../..');
const server = fs.readFileSync(path.join(repoRoot, 'server.js'), 'utf8');
const vpsApi = fs.readFileSync(path.join(repoRoot, 'vps/api.js'), 'utf8');

describe('VPS service mapping regression coverage', () => {
    it('keeps the VPS API mounted on the local Watchpost server', () => {
        expect(server).toContain("const mountVpsRoutes = require('./vps/api')");
        expect(server).toContain('mountVpsRoutes(app)');
    });

    it('keeps live service discovery and operational routes available', () => {
        expect(vpsApi).toContain("app.get('/api/vps/status'");
        expect(vpsApi).toContain("app.get('/api/vps/health'");
        expect(vpsApi).toContain("app.get('/api/vps/logs/:service'");
        expect(vpsApi).toContain("app.post('/api/vps/restart/:service'");
        expect(vpsApi).toContain("app.post('/api/vps/update/:service'");
        expect(vpsApi).toContain('sshRun(');
    });
});
