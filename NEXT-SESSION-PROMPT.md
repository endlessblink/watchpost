# Prompt for a fresh instance: finish the Watchpost redesign (all open issues)

Paste everything below the line into a new Claude Code session started in
`/media/endlessblink/data/my-projects/ai-development/devops/watchpost`.

---

You are continuing the Watchpost redesign for Noam. Read this whole brief first. Work on branch `feat/dusk-redesign` (already has all work so far, committed, not pushed).

## House rules (from Noam, non-negotiable)
- **Structural fixes only. No patches, no stopgaps, no "temporary" caches or hides.** Find the rule that produced each failure, change that rule, and report what is now true. If something you build is really a stopgap, do not report it as the fix: build the real one.
- Never take over his screen: no headed browser, no `tauri dev`, no xdotool. Test with headless Playwright only (module path `/home/endlessblink/.npm-global/lib/node_modules/playwright`, use `waitUntil: 'domcontentloaded'` or `'load'`, never `networkidle` because the pages keep an event stream open).
- Do not call cloud LLM providers with his accounts. Local only.
- Before editing code run `termfleet-sure "1. Root cause: ... 2. Confidence: HIGH ... 3. ... 4. Fix: ... 5. Side effects: ..."` (the gate wants HIGH). Before editing any HTML/CSS design file, load the `impeccable` skill.
- Do not delete data. Do not touch files from other sessions that are uncommitted in the working tree: `bots/api.js`, `modules/changelog-engine.js`, `modules/task-engine.js`, `projects.json`, `skills/bot-fleet/SKILL.md`, `watchpost`, `MASTER_PLAN.md`, `AGENTS.md`, `.watchpost/`, `modules/network-access.js`, `docs/usage-chip.png`, and the tests for them.
- Do not hand over to another instance or spawn successors. Answer Noam in 1 to 4 plain sentences, no paths or code unless asked. Verify before claiming: show test output (`npx vitest run`) and a headless check from the same turn.
- Restart the server by killing the node process on 6010 and starting `node server.js` as a managed background task. **Never swap node_modules binaries while the server runs** (that crashed it once).

## The design ("Dusk")
Soft dark, low contrast, rounded (cards 14px, buttons 10px, pills), quiet screens, icons first, nothing sharp or noisy. Tokens in `dusk-tokens.css`; shell in `shell.css` + `index.html` (icon rail on the left, a centred project bar at the top with a 16:9 thumbnail, pages in iframes); each page has its own `dusk.css`. Mockups of every screen: https://claude.ai/artifact/X9C2xL5BgJFNfNdyZNTzoW (private to Noam). Layout rule: no fixed width caps, groups flow into balanced columns (`.fluid-columns` in `dusk-tokens.css`), so there is no dead space at any size.

## What is already done (do not redo)
One resolver decides which project a request means (explicit project, then folder, then this browser's `wp_project` cookie, then the global default); every route uses it. A project without a plan file reads as "no plan"; the board offers "Create plan file" (never overwrites). Health score counts only measured checks and explains itself. Skills filter by the picked project. Board columns all fold. Codex logs are read by a background incremental index (`modules/codex-index.js`), not per request. Agent log tab removed from the menu (nothing feeds it).

## OPEN ISSUES (do these, in this order)

### 1. Dropdowns must match the redesign (Noam's latest request)
Native `<select>` popups show the operating system's blue menu (see the sort menu on the Board). Replace every native select with ONE shared Dusk dropdown component (rounded menu on `--card-2`, 10px items, check mark on the chosen item, keyboard: arrows, Enter, Escape, type-to-find; opens under its trigger, closes on outside click; accessible `role="listbox"`; icon-only triggers keep their `aria-label`). Build it once (for example `dusk-select.js` + styles in `dusk-tokens.css`) and use it everywhere; remove the per-page one-off menus. Current native selects: `kanban/index.html` (7: type, priority, sort, plus the task panel's status, priority, complexity), `controlroom/index.html` (2), `flow/index.html` (1), `changelog/index.html` (2, page is hidden but keep it consistent). The project list popover in `index.html` and the per-card menus in the Projects page already use custom menus: make them use the same component or the same tokens so they look identical. Keep the existing element ids and `onchange` behaviour working (other code reads them).

### 2. Why Codex session logs balloon (73 GB in three weeks)
Another agent started this and has not reported. Findings so far: 842 files in `~/.codex/sessions`, about 87 MB each; about half of the largest file is `compacted` records carrying embedded images, another 16% is `world_state` snapshots with images (101 single lines over 200 KB), the rest is `item_completed` events. Find which program writes those records and why (Codex itself, a plugin, or TermFleet), and fix it at the source (a Codex setting, a hook, how sessions are run). Measure with `scratchpad`-style scripts. Report the cause, the fix, and expected saving per session. **Do not delete, move or compress any existing log without Noam's explicit OK**; if proposing cleanup, list specific files with sizes and use `gio trash`.

### 3. Flow page shows "Failed to load MASTER_PLAN.md"
Reproduced for the project `claude-and-conquer` (cookie `wp_project=claude-and-conquer`). Find the real cause in `flow/index.html` and the routes it calls, and fix it at the cause. Also `/api/locks` returns 404 (called by Flow and by `timeline/index.html`): either implement the locks endpoint properly or remove the dead feature from both pages.

### 4. Health scan is wrong for projects without TypeScript
The scan runs `tsc` where there is no `tsconfig`, prints its help text into the log, and then shows "0 errors" in red. A check that cannot run must be "not measured" (and left out of the score), never a fake 0. Audit every check in `scripts/health-scanner.js` the same way (eslint, dead code, audit, outdated, build). Add unit tests next to `tests/unit/health-score.test.js`.

### 5. Project bar numbers go stale
After creating a plan file the bar still says "0 active · 0 open" because it reads cached project stats. Make the bar read fresh numbers whenever the project or its plan changes (the server already broadcasts `project-changed`). Also show the plan state ("No plan file yet") consistently on the Projects page cards.

### 6. Known smaller problems
- Bots page: the catalog lists Botson, Claude & Conquer, Hermes Gateway and Paper Bot twice (data comes from `bots/api.js`, which another session owns: report the cause to Noam instead of editing it).
- Agent log data: server returns totals as `totalEvents` without a `stats` wrapper (page expects a different shape); `changelog.db` has had no new rows since spring because no capture hook is installed. Decide with Noam whether the Agent log should come back; if yes, wire a real capture source, otherwise remove the dead page, its routes and `modules/changelog-engine.js` consumers in one clean change (ask him, deleting needs his OK).
- Skills "All skills" map is a heap of overlapping names (layout code, not styling).
- Docs map first view shows only a few nodes (fit-to-view on load).
- Server page: when a group splits across columns its header does not repeat; either keep small groups whole or repeat the header.
- `better-sqlite3` was rebuilt for Node 22.19 (it had been built for another Node and silently disabled the task service). Make the server fail loudly at startup and report "task service unavailable: reason" in `/api/status` if the native module ever fails to load, instead of silently serving 503s.
- `/api/usage` reads `~/.watchpost/data/usage.json`, which is written by another session; confirm who writes it and that the weekly figure is always present.

### 7. Finish
Run `npx vitest run` (all must pass), run a headless tour of every tab at 1440, 1000 and 390 wide with a project that has a plan file, one without, and one with a thumbnail, fix anything broken, update `tests/unit` for each structural change, commit in small commits on `feat/dusk-redesign` (end commit messages with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`), and tell Noam what is true now. Do not push or open a PR unless he asks.
