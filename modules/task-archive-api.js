'use strict';

function mountTaskArchiveRoutes(app, requireTaskEngine) {
    for (const action of ['archive', 'restore']) {
        app.post(`/api/tasks/:id/${action}`, requireTaskEngine, (req, res) => {
            const engine = req.taskEngine;
            const method = action === 'archive' ? 'archiveTask' : 'restoreTask';
            if (typeof engine[method] !== 'function') {
                return res.status(409).json({ error: 'This project manages its tasks through its evidence-gated tracker.' });
            }
            const reason = req.body?.reason;
            const disposition = req.body?.disposition ?? 'completed';
            if (action === 'archive' && reason !== undefined && (typeof reason !== 'string' || reason.length > 1000)) {
                return res.status(400).json({ error: 'Archive reason must be a string of at most 1000 characters.' });
            }
            if (action === 'archive' && (!['completed', 'superseded', 'duplicate', 'rejected'].includes(disposition) ||
                (disposition !== 'completed' && !reason?.trim()))) {
                return res.status(400).json({ error: 'Retired work requires a valid disposition and an explicit reason.' });
            }
            try {
                const id = req.params.id;
                const task = engine.getTask(id);
                if (!task) return res.status(404).json({ error: 'Task not found.' });
                if (action === 'archive' && disposition === 'completed' && task.status !== 'done') {
                    return res.status(409).json({ error: 'Only completed tasks can be archived.' });
                }
                if (action === 'archive') engine.archiveTask(id, reason ?? '', disposition);
                else engine.restoreTask(id);
                return res.json({ success: true, id, archived: action === 'archive', task: engine.getTask(id) });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
}

module.exports = { mountTaskArchiveRoutes };
