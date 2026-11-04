'use strict';

const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');

(async () => {
    const base = process.env.WATCHPOST_URL || 'http://127.0.0.1:6010';
    const before = await (await fetch(base + '/api/status')).json();
    const registry = await (await fetch(base + '/api/projects')).json();
    const film = registry.projects.find(project => project.name === 'finetuned');
    const product = registry.projects.find(project => project.name === 'imaginebox');
    assert(film && product);
    assert.equal(film.planCategory, 'finetuned');
    assert.equal(product.planCategory, 'imagine-box');
    assert.equal(film.masterPlan, product.masterPlan);
    const cacheDir = path.join(product.root, '.watchpost');
    const cacheFingerprint = () => fs.existsSync(cacheDir) ? fs.readdirSync(cacheDir).sort().map(name => [name, crypto.createHash('sha256').update(fs.readFileSync(path.join(cacheDir, name))).digest('hex')]) : null;
    const cacheBefore = cacheFingerprint();
    const browser = await chromium.launch({ headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
        const mutations = [];
        page.on('request', request => { if (request.method() !== 'GET') mutations.push({ method: request.method(), url: request.url() }); });
        await page.goto(base, { waitUntil: 'domcontentloaded' });
        await page.locator('#active-project-badge').click();
        await page.locator('#project-switcher-search').fill('finetuned');
        const option = page.locator('.project-switcher-item').filter({ hasText: 'finetuned' });
        await option.waitFor();
        assert.equal(await option.count(), 1);
        await page.screenshot({ path: '/tmp/watchpost-finetuned-project-list.png', fullPage: false });
        await option.click();
        await page.waitForURL('**/project-plan/?project=finetuned');
        await page.waitForFunction(() => /^2 tasks in finetuned/.test(document.getElementById('notice').textContent));
        const categories = await page.locator('#tasks tr td:last-child').allTextContents();
        assert.deepEqual(categories, ['finetuned', 'finetuned']);
        await page.screenshot({ path: '/tmp/watchpost-finetuned-project-default.png', fullPage: false });
        await page.locator('[data-project="imaginebox"]').click();
        await page.waitForFunction(() => /^8 tasks in imagine-box/.test(document.getElementById('notice').textContent));
        const imagineBoxCount = await page.locator('#tasks tr').count();
        await page.locator('[data-category="all"]').click();
        await page.waitForFunction(() => /^10 tasks\./.test(document.getElementById('notice').textContent));
        const allTaskCount = await page.locator('#tasks tr').count();
        assert.deepEqual(mutations, []);
        const after = await (await fetch(base + '/api/status')).json();
        assert.equal(after.masterPlanPath, before.masterPlanPath);
        assert.deepEqual(cacheFingerprint(), cacheBefore);
        const receipt = { passed: true, projectNames: [film.name, product.name], selectedViaVisibleProjectList: true, defaultCategory: 'finetuned', defaultTaskCount: categories.length, imagineBoxDefaultTaskCount: imagineBoxCount, explicitAllTaskCount: allTaskCount, activePlanUnchanged: true, competingCacheUnchanged: true, mutationRequests: mutations, url: base + '/project-plan/?project=finetuned', screenshots: ['/tmp/watchpost-finetuned-project-list.png', '/tmp/watchpost-finetuned-project-default.png'] };
        fs.writeFileSync('/tmp/watchpost-project-selector-e2e.json', JSON.stringify(receipt, null, 2) + '\n');
        console.log(JSON.stringify(receipt));
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
