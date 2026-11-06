'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

const statusMap = { PLANNED: 'planned', 'IN PROGRESS': 'in_progress', READY: 'review', DONE: 'done' };
const gateMessage = 'This project uses the evidence-gated plan tracker. Use tools/plan_tracker.py with the current revision and required evidence; quick status changes cannot bypass those checks.';

function createPlanDoorEngine(project, run = execFileSync) {
    const root = path.dirname(project.masterPlan);
    const state = JSON.parse(run('/usr/bin/python3', [path.join(root, 'tools/plan_tracker.py'), 'list'], { cwd: root, encoding: 'utf8', timeout: 10000, maxBuffer: 8 * 1024 * 1024 }));
    const all = Object.entries(state.tasks).map(([id, task]) => ({ id, title: task.title, priority: task.priority, status: statusMap[task.status], original_status: task.status, lane: task.category, deps: task.dependencies, evidence: state.evidence[id] || null, revision: state.revision, managed_plan: true }));
    const tasks = all.filter(task => task.lane === project.planCategory);
    const done = new Set(all.filter(task => task.status === 'done').map(task => task.id));
    const ready = task => task.deps.every(dep => done.has(dep));
    const reject = () => { throw new Error(gateMessage); };
    return {
        managedPlan: true,
        getTasks: filters => tasks.filter(task => (!filters?.status || task.status === filters.status) && (!filters?.priority || task.priority === filters.priority)),
        getTask: id => tasks.find(task => task.id === id) || null,
        getReady: () => tasks.filter(task => task.status !== 'done' && ready(task)),
        getBlocked: () => tasks.filter(task => task.status !== 'done' && !ready(task)),
        getGraph: () => ({ nodes: tasks, links: tasks.flatMap(task => task.deps.map(dep => ({ source: dep, target: task.id }))) }),
        getStats: () => ({ total: tasks.length, byStatus: counts(tasks, 'status'), byPriority: counts(tasks, 'priority') }),
        projectStats: () => ({ total: tasks.length, done: tasks.filter(t => t.status === 'done').length, inProgress: tasks.filter(t => t.status === 'in_progress').length, planned: tasks.filter(t => t.status === 'planned').length, paused: 0, review: tasks.filter(t => t.status === 'review').length }),
        updateStatus: reject, writeBackStatus: reject, addDep: reject, removeDep: reject, addComment: reject,
        syncFromMarkdown: () => tasks.length,
        closeDb: () => {},
        markdown: () => '# ' + (project.name === 'finetuned' ? 'Finetuned' : 'ImagineBox') + ' Master Plan\n\nSQLite-backed task scope: ' + project.planCategory + '. Full source is available from /api/master-plan?full=1.\n\n| ID | Lane | Task | Status | Priority | Deps |\n|---|---|---|---|---|---|\n' + tasks.map(task => '| ' + [task.id, task.lane, task.title, task.status.toUpperCase().replace('_', ' '), task.priority, task.deps.join(', ') || '—'].join(' | ') + ' |').join('\n') + '\n',
    };
}

function counts(tasks, key) {
    const result = new Map();
    tasks.forEach(task => result.set(task[key], (result.get(task[key]) || 0) + 1));
    return [...result].map(([value, count]) => ({ [key]: value, count }));
}

// The project this browser last picked travels with every request as a cookie, so what the
// dashboard shows no longer depends on the one global "active project" other clients can change.
const PROJECT_COOKIE = 'wp_project';

function cookieValue(header, name) {
    if (typeof header !== 'string' || !header) return '';
    for (const part of header.split(';')) {
        const eq = part.indexOf('=');
        if (eq < 0) continue;
        if (part.slice(0, eq).trim() === name) {
            try { return decodeURIComponent(part.slice(eq + 1).trim()); } catch (_) { return ''; }
        }
    }
    return '';
}

function resolveProject(projects, req, activePlan, activeName) {
    const named = req?.query?.project || req?.body?.project;
    if (typeof named === 'string') return projects.find(project => project.name === named) || null;
    const cwd = req?.query?.cwd || req?.body?.cwd;
    if (typeof cwd === 'string' && cwd) {
        const resolved = path.resolve(cwd);
        const matches = projects.filter(project => project.root && (resolved === project.root || resolved.startsWith(project.root + path.sep)));
        if (matches.length) return matches.sort((a, b) => b.root.length - a.root.length)[0];
    }
    const saved = cookieValue(req?.headers?.cookie, PROJECT_COOKIE);
    if (saved) {
        const picked = projects.find(project => project.name === saved);
        if (picked) return picked;
    }
    return projects.find(project => project.name === activeName && project.masterPlan === activePlan)
        || projects.find(project => project.masterPlan === activePlan && project.name === path.basename(path.dirname(activePlan || '')))
        || projects.find(project => project.masterPlan === activePlan) || null;
}

function selectProject(project, environment, persist) {
    environment.MASTER_PLAN_PATH = project.masterPlan;
    environment.WATCHPOST_PROJECT_NAME = project.name;
    persist('MASTER_PLAN_PATH', project.masterPlan);
    persist('WATCHPOST_PROJECT_NAME', project.name);
}

module.exports = { createPlanDoorEngine, resolveProject, selectProject, gateMessage, PROJECT_COOKIE, cookieValue };
