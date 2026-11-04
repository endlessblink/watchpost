'use strict';

const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');

(async () => {
    const base = process.env.WATCHPOST_URL || 'http://127.0.0.1:6010';
    const initial = await (await fetch(base + '/api/status')).json();
    const browser = await chromium.launch({ headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
        const errors = [];
        const requests = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('request', request => requests.push({ method: request.method(), url: request.url() }));
        const counts = {};
        for (const category of ['all', 'imagine-box', 'finetuned']) {
            const project = category === 'finetuned' ? 'finetuned' : 'imaginebox';
            const url = base + '/project-plan/?project=' + project + (category === 'all' ? '&category=all' : '');
            await page.goto(url, { waitUntil: 'networkidle' });
            await page.waitForFunction(() => /^\d+ tasks/.test(document.getElementById('notice').textContent));
            const rows = await page.locator('#tasks tr').allTextContents();
            assert(rows.length > 0, 'Expected project tasks for ' + category);
            if (category !== 'all') {
                const categories = await page.locator('#tasks tr td:last-child').allTextContents();
                assert(categories.every(value => value === category));
            }
            counts[category] = rows.length;
            const payload = await (await fetch(base + '/api/project-plan?project=imaginebox')).json();
            assert.equal(await page.locator('#plan').textContent(), payload.content);
            assert.equal(crypto.createHash('sha256').update(payload.content).digest('hex'), payload.sha256);
            await page.locator('summary').click();
            await page.screenshot({ path: '/tmp/watchpost-plan-' + category + '.png', fullPage: false });
        }
        assert.equal(counts.all, counts['imagine-box'] + counts.finetuned);
        assert.deepEqual(errors, []);
        assert(requests.every(request => request.method === 'GET'));
        assert(!requests.some(request => request.url.includes('/api/tasks/') || request.url.includes('/activate')));
        const final = await (await fetch(base + '/api/status')).json();
        assert.equal(final.masterPlanPath, initial.masterPlanPath);
        const result = { passed: true, counts, activeProjectUnchanged: true, pageErrors: errors, onlyGetRequests: true,
            screenshots: ['/tmp/watchpost-plan-all.png', '/tmp/watchpost-plan-imagine-box.png', '/tmp/watchpost-plan-finetuned.png'] };
        fs.writeFileSync('/tmp/watchpost-project-plan-e2e.json', JSON.stringify(result, null, 2) + '\n');
        console.log(JSON.stringify(result));
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
