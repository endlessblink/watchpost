'use strict';

const fs = require('fs');
const crypto = require('crypto');

// An independent read-only view. Never initializes the task engine, changes the
// selected project or accepts a filesystem path from a browser request.
module.exports = function mountProjectPlanView(app, registryPath, resolvePlanForRequest) {
    const projects = () => JSON.parse(fs.readFileSync(registryPath, 'utf8')).projects;
    const viewUrl = project => '/project-plan/?project=' + encodeURIComponent(project.name);
    // Managed plans have their own evidence-gated write door. Old board actions
    // must not initialize a second database or write generated Markdown.
    app.post('/api/projects/:name/activate', (req, res, next) => {
        const project = projects().find(entry => entry.name === req.params.name);
        if (!project?.readOnlyPlan) return next();
        return res.json({ readOnly: true, viewUrl: viewUrl(project), project });
    });
    if (resolvePlanForRequest) {
        app.use(['/api/tasks', '/api/task', '/api/beads'], (req, res, next) => {
            const named = req.query.project || req.body?.project;
            const selected = typeof named === 'string' ? projects().find(entry => entry.name === named) : null;
            const plan = selected?.masterPlan || resolvePlanForRequest(req);
            const project = projects().find(entry => entry.readOnlyPlan && entry.masterPlan === plan);
            if (!project) return next();
            return res.status(409).json({ error: 'This plan is managed by its evidence-gated project tracker. Use the read-only view.', readOnly: true, viewUrl: viewUrl(project) });
        });
    }
    app.get('/api/project-plan', (req, res) => {
        res.set('Cache-Control', 'no-store');
        const name = req.query.project;
        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'Select a registered project by name.' });
        }
        try {
            const project = projects().find(entry => entry.name === name);
            if (!project || !project.masterPlan) {
                return res.status(404).json({ error: 'Registered project plan not found.' });
            }
            const content = fs.readFileSync(project.masterPlan, 'utf8');
            return res.json({ project: project.name, category: project.planCategory || null, content,
                sha256: crypto.createHash('sha256').update(content).digest('hex'),
                readOnly: true });
        } catch (error) {
            const status = error.code === 'ENOENT' ? 404 : 500;
            return res.status(status).json({ error: status === 404 ? 'Registered plan file is unavailable.' : 'Could not read the project plan.' });
        }
    });
};
