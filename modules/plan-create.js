'use strict';
// Create a project's MASTER_PLAN.md from inside Watchpost.
// Rules: never overwrite an existing plan; reuse one that already exists (root or docs/).
const fs = require('fs');
const path = require('path');

const PLAN_LOCATIONS = ['MASTER_PLAN.md', path.join('docs', 'MASTER_PLAN.md')];

function findExistingPlan(root) {
    for (const rel of PLAN_LOCATIONS) {
        const candidate = path.join(root, rel);
        if (fs.existsSync(candidate)) return candidate;
    }
    return null;
}

function starterPlan(projectName) {
    return `# ${projectName} - Master Plan

> What this project is for, in a sentence or two.

---

## Phase 1: Getting started

### TASK-001: Describe what this project should achieve
**Status**: Todo
**Priority**: High
**Complexity**: Low

Write the goal and what "done" looks like. Add more tasks below as they come up.
`;
}

// Returns { ok, created, planPath } or { ok:false, code, message }.
function createPlanFile(project) {
    if (!project || !project.root) {
        return { ok: false, code: 'NO_ROOT', message: 'This project has no folder on disk.' };
    }
    if (!fs.existsSync(project.root) || !fs.statSync(project.root).isDirectory()) {
        return { ok: false, code: 'ROOT_MISSING', message: 'The project folder does not exist.' };
    }
    const existing = findExistingPlan(project.root);
    if (existing) return { ok: true, created: false, planPath: existing };

    const planPath = path.join(project.root, PLAN_LOCATIONS[0]);
    try {
        // 'wx' fails if the file appeared in the meantime: a plan is never overwritten.
        fs.writeFileSync(planPath, starterPlan(project.name), { flag: 'wx' });
    } catch (err) {
        if (err.code === 'EEXIST') return { ok: true, created: false, planPath };
        return { ok: false, code: err.code || 'WRITE_FAILED', message: `Could not write the plan file: ${err.message}` };
    }
    return { ok: true, created: true, planPath };
}

module.exports = { createPlanFile, findExistingPlan, starterPlan };
