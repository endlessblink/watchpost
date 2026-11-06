// Archive registry presentation only. Task state, selection and managed plan authority stay intact.
function updateProjectArchive(data, name, archived, reason, now = new Date().toISOString()) {
    const project = data.projects.find(p => p.name === name);
    if (!project) return { status: 404, error: `Project "${name}" not found` };
    if (archived && (typeof reason !== 'string' || !reason.trim() || reason.length > 1000)) {
        return { status: 400, error: 'An archive reason of 1–1000 characters is required' };
    }
    if (archived) {
        project.archived = true;
        project.archivedAt = project.archivedAt || now;
        project.archiveReason = reason.trim();
    } else {
        delete project.archived;
        delete project.archivedAt;
        delete project.archiveReason;
    }
    return { status: 200, project };
}

function mountProjectArchiveRoutes(app, readProjects, writeProjects) {
    for (const [action, archived] of [['archive', true], ['restore', false]]) {
        app.post(`/api/projects/:name/${action}`, (req, res) => {
            const data = readProjects();
            const result = updateProjectArchive(data, req.params.name, archived, req.body?.reason);
            if (result.status === 200) writeProjects(data);
            return res.status(result.status).json(result.error ? { error: result.error } : { project: result.project, archived });
        });
    }
}

module.exports = { updateProjectArchive, mountProjectArchiveRoutes };
