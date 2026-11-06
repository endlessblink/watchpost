# MASTER_PLAN.md - brainiac

## Overview

brainiac is the cross-project orchestrator for every project and bot on Noam's system (see `AGENTS.md`). Agent-agnostic: nothing here depends on one harness. Read-only toward other projects; it owns `BOTS.md`, the drift checker, the nightly sweep and the suggestion/archive queues. Created 2026-10-02. Task IDs: `BRN-nnn`. Everything below is **proposed / TODO** unless stated; nothing is implemented except the initial `BOTS.md` and `scripts/check_bots_registry.py` (moved here from the bots-directory on 2026-10-02, untracked).

## Summary

| ID | Title | Priority | Effort | Status | Dependencies |
|----|-------|----------|--------|--------|--------------|
| BRN-001 | Nightly read-only sweep script + systemd user timer | P0 | M | TODO | - |
| BRN-002 | Triage baseline: find and import the 2026-09-25 project-retriage verdicts | P0 | S | TODO | - |
| BRN-003 | Morning report file + delivery (Hermes cron / Telegram topic) | P1 | M | TODO | BRN-001 |
| BRN-004 | Own BOTS.md + drift checker; keep pointers current | P0 | S | TODO (files exist) | - |
| BRN-005 | Cross-bot: token ownership map and rotation checklist | P1 | M | TODO | BRN-004 |
| BRN-006 | Cross-bot: naming scheme (handles, WHOAMI lines, generic SOUL.md fixes) | P1 | S | TODO | BRN-004 |
| BRN-007 | Cross-bot: shared health core coordination | P1 | S | TODO | BRN-004 |
| BRN-008 | Approval workflow: accepted suggestion -> proposed task in a project plan | P1 | M | TODO | BRN-001 |
| BRN-009 | Archive / consolidation proposals queue | P2 | S | TODO | BRN-001, BRN-002 |
| BRN-010 | Register brainiac in Watchpost and cross-link from owning plans | P2 | S | TODO | BRN-004 |

### BRN-001: Nightly read-only sweep (TODO)
`scripts/sweep.py` (stdlib only) run by a **systemd user timer** (`brainiac-sweep.service` + `.timer`, not tied to any agent; `Nice`/`IOSchedulingClass=idle`, `TimeoutStartSec`). Over every project under `ai-development/*/*`:
- activity: last commit date, commits in last 7/30 days, last file mtime;
- uncommitted work: modified/untracked counts, unpushed commits (e.g. termfleet had 78 unpushed commits and red CI on 2026-10-02);
- stale branches / worktrees (e.g. `devops/hermes` has `.worktrees/`, `update-safety-worktrees/`, four `*.git-cleaning-crew-quarantine-20260829` dirs);
- disk size per project and top offenders (termfleet: 989 releases = 18 GB, 20,069 pane PNGs = 4.8 GB);
- tracked generated files (`node_modules`, `dist`, `*.db`, `out/`, release bundles) and **untracked data stores that are not backed up** (e.g. `claude-and-conquer/out/Health`);
- dead folders: empty, no git, no recent mtime, or names with `backup|quarantine|.bak|pre-consolidation|disabled` (e.g. `devops/in-contril-kernel` vs `in-control-kernel`, `directive-validation-harness.disabled-backup-20260820`, `termfleet-pre-consolidation-20260717.bundle`, `misc/claorie-counting-app`);
- compare each project against the triage verdict (BRN-002) and flag mismatches (verdict "archive" but active; verdict "keep" but dead).
Constraints: read-only; bounded `os.scandir` (never an unbounded `find`); skip `node_modules`/`.git` internals; no network; no VPS; write only `reports/`; lockfile to prevent overlap; never print env/config values. Acceptance: runs under the timer with all projects, exits 0, report contains no tokens (regex check), runtime < 5 min.

### BRN-002: Triage baseline (TODO)
Find the **2026-09-25 project-retriage note**. Not found on 2026-10-02 by searching the Obsidian `MAIN VULT`, `~/.claude/projects/*/memory`, `~/.watchpost`, `~/.codex`, `~/.hermes` memories and `ai-development/permanent` (only unrelated "triage" notes exist). Ask Noam for the path, then import the verdicts (project -> keep/archive/merge/unknown + date) into `data/triage-verdicts.json`. Acceptance: every top-level project has a verdict or an explicit "unknown".

### BRN-003: Morning report (TODO)
Sweep writes `reports/YYYY-MM-DD.md` + `reports/latest.md` + `reports/latest.json` (plain files any agent can read). Top: changes since yesterday, red flags (unbacked data, CI red, unpushed commits, disk growth), questions needing approval. Delivery: a Hermes cron job (`no_agent` style) posts a short summary to a Telegram topic **only after Noam chooses the topic/bot handle and approves the first message** (external send); until then the file is the delivery. Size cap, no secrets, no exact finances, no health content.

### BRN-004: BOTS.md + drift checker (TODO; files exist)
`BOTS.md` and `scripts/check_bots_registry.py` live here (moved from `bots-directory` on 2026-10-02; `bot-registry.yaml`, validator and watchdog stay in `bots+automation/bots-directory`). Tasks: add the checker to the nightly sweep and report drift in the morning report; resolve the open items in BOTS.md "Needs verification" (first drift item: `orchestrator` route has no local profile dir); point `devops/hermes/MASTER_PLAN.md`, the bots-directory README (proposal only) and each bot-owning plan at this file; decide how BOTS.md and Watchpost's generated `bot-fleet.md` stay consistent.

### BRN-005: Token ownership map (TODO)
Per identity: owner project, where the secret lives (Doppler path vs VPS `.env` vs local `~/.hermes/.env`), who polls it, rotation date, last-rotated evidence. Known items: `@claude_and_conquer_bot` token only in VPS `/opt/hermes-runtime/.env` (not Doppler) and shared with the stopped legacy container (409 risk); Botson token appeared in service logs (rotation + redaction pending per `bot-registry.yaml`); orphan `@hermes_e6k7p2vepjqmyrwm_bot`. Output is a table of references only, never values.

### BRN-006: Naming scheme (TODO)
Hermes = platform only; every bot has a lowercase handle (BOTS.md), a display prefix, and a one-line WHOAMI at the top of its `SOUL.md`/persona file. Fix generic "You are Hermes Agent ... Nous Research" SOUL.md in `office-work`, `show-time`, `personal-assistant-acceptance`. Product-name decisions for the health product are separate (candidates: fuel-and-form, vitalog, tempo, bodyledger, kav-briut; pending Noam).

### BRN-007: Shared health core coordination (TODO)
The two health "bots" are topics 306 (`fuel`) and 303 (`form`) of the VPS Hermes gateway. Implementation tasks live in `bots+automation/claude-and-conquer/MASTER_PLAN.md` (TASK-099 to TASK-113, BUG-046; Hermes-repo items marked there). brainiac only coordinates: single owner per change, no duplicate plan, keep BOTS.md rows for `fuel`/`form` accurate (persona file location, data owned/read) as those tasks land.

### BRN-008: Approval workflow (TODO)
Files: `suggestions/queue.md` (id, source sweep date, target project, proposed text, status `proposed -> accepted|rejected -> applied`), `suggestions/applied.md` (log with plan path, assigned IDs, `git diff --stat`). Flow: sweep/agent adds a suggestion -> Noam accepts/rejects -> only accepted ones are appended to the target project's `MASTER_PLAN.md` (next free ID in that plan's scheme, status proposed/TODO, append-only, verified by `git diff`, no commit). Acceptance: dry-run on one real suggestion with Noam's approval.

### BRN-009: Archive / consolidation queue (TODO)
`proposals/archive-queue.md`: candidates found by the sweep with evidence (size, last activity, verdict, backup status) and a recommended action (archive / merge / keep / ask). **Proposal only; nothing is moved or deleted without Noam's approval.** Seed candidates are listed in BRN-001.

### BRN-010: Register brainiac (TODO)
Propose (not edit) a Watchpost `projects.json` entry and `.watchpost` manifest for brainiac, and a pointer from `bots+automation/bots-directory/README.md`. Needs Noam's approval because both files belong to other projects.

### Suggested order
1. BRN-004 (already created), BRN-002.
2. BRN-001, then BRN-003 (file-only delivery first).
3. BRN-008, BRN-009.
4. BRN-005, BRN-006, BRN-007 in parallel with owning projects.
5. BRN-010 last.

## 2026-10-02 (later) — Status updates and new tasks

Status words below: **implemented, awaiting install/approval** = code/files exist and were tested once manually; nothing is installed or enabled and nothing is done until Noam approves.

| ID | Update |
|----|--------|
| BRN-001 | **implemented, awaiting install/approval.** `scripts/sweep.py` (stdlib, read-only on other projects, writes only `snapshots/` + `reports/`, atomic, per-project time budgets, never aborts on one bad project, diff since last snapshot, exit 2 if incomplete, `fcntl` lock) and user units in `systemd/` (`brainiac-sweep.{service,timer}` nightly light, `brainiac-sweep-full.{service,timer}` weekly full, `brainiac-heartbeat.{service,timer}`, `brainiac-failure@.service` OnFailure hook, all `Persistent=true`, `flock` in the unit). Not installed. Manual full run 2026-10-02: 143 projects, 0 failures, about 14 s; `.git`/index mtimes and `git status` counts of all 143 projects identical before and after. Install commands: `systemd/README.md`. Known gaps: file-mtime "recent activity" is polluted by edits made by agents today (e.g. plan appends); git worktrees of one repo are counted separately; size scan does not de-duplicate nested repos; no CI/stars lookups. |
| BRN-002 | **implemented, awaiting Noam's review.** The lost 09-25 report was restored verbatim from a box copy to `snapshots/2026-09-25-project-retriage.md` (sha256 verified), transcribed into `data/triage-baseline-2026-09-25.json`, and a fresh triage was written to `snapshots/2026-10-02-project-triage.{md,json}`. Evidence-based verdict changes live in `data/triage-overrides.json` (2 so far). 65 of 143 projects have no 09-25 verdict and carry an automatic rating that needs a human decision. |
| BRN-003 | **partly implemented.** The report file half exists (`reports/latest.md`, `latest.json`, `heartbeat.json`, `LAST_FAILURE`; any agent can read them). Delivery to Hermes/Telegram is not done: see BRN-012. |
| BRN-004 | unchanged (BOTS.md and `scripts/check_bots_registry.py` exist; checker not yet in the nightly run). |
| BRN-009 | **seeded.** The weekly snapshot already lists archive candidates, merge candidates, dead folders, duplicate remotes and dirty/unpushed work. The approval queue file (`proposals/archive-queue.md`) is still to do. |

### BRN-011: Enable the sweep timers (DONE 2026-10-03)
Evidence: three timers active; scheduled light sweep ran by itself 2026-10-03 02:31 (140 projects, 0 failures, 5.8 s) and the 09:00 heartbeat fired; `check_heartbeat.py` -> OK; induced-failure test passed 2026-10-02.
Original steps: run the install block in `systemd/README.md` (`systemctl --user link ...`, `daemon-reload`, `enable --now` the three timers, optionally `loginctl enable-linger`). Then start `brainiac-sweep.service` once under systemd and run `scripts/check_heartbeat.py`. Acceptance: `systemctl --user list-timers 'brainiac-*'` shows three timers, a nightly run updates `reports/heartbeat.json`, an induced failure writes `reports/LAST_FAILURE`.

### BRN-012: Deliver the morning report to a Hermes/Telegram topic (TODO, needs approval and a decision)
Decide the topic and the bot handle (see `BOTS.md`; candidates: `orchestrator` topic 3 or `office` topic 695), then add a Hermes cron job (`no_agent`) that reads `reports/latest.md`, builds a short summary (changes since yesterday, red flags, stale heartbeat, questions needing approval; no tokens, no finance details, no health content) and posts it. First post only after Noam approves the exact text. Also alert when `check_heartbeat.py` fails. Acceptance: one approved test post, then a scheduled daily post.

### BRN-013: Triage review and follow-ups (TODO)
Walk through the 2026-10-02 snapshot with Noam: rate the 65 auto-rated projects; confirm or reverse the two overrides (`claude-and-conquer` MERGE->KEEP, `bina-meatzevet-management-vault` ARCHIVE->KEEP); decide the flagged cases. Findings to review (all read-only observations, no action taken): `content-creation/content-maker` 169 GB (show-runner-videos 106 GB, `_local` 49 GB); `productivity/flow-state` 53 GB (backups 25 GB, release 23 GB); `content-creation/pixie-labs-archive` 50 GB; `devops/hermes` 36 GB; `cc-linux-enhancments` 35 GB (`.resolve-upgrade-backups` 16 GB + `-staging` 10 GB); `freelance/bina-meatzevet-courses` 35 GB (`.worktrees` 27 GB, 168 unpushed commits); `bots+automation/freelance-desk` 27 GB (`jobrunner` 26 GB); `freelance/bina-meatzevet-management-vault` `.git` 15 GB; `devops/termfleet` 13 GB (`src-tauri` 12 GB, 78 unpushed). Unpushed or uncommitted work to protect before any move: Hermes repos (382 unpushed shared by exercise-library, lifeboat-live and hermes-merge worktrees), `web-dev/bina-bekitzur` (10 dirty, 3 unpushed). Four quarantined `flowstate-*.git-cleaning-crew-quarantine-20260829` folders (3.6 GB for the largest) have broken git links. The 09-25 baseline names `obsidian-plugins/*`, `roni-test` (now under `misc/`) and the termfleet bundle, which no longer exist at those paths. Sweep improvements to consider: ignore plan-file mtimes, de-duplicate worktrees, record nested repos once.

## 2026-10-02 — Pointer: TermFleet integration evaluation
Noam is considering making Brainiac an integral part of TermFleet. Evaluation (fit, generalization, personal vs shared, privacy model, scope-creep, phased roadmap, recommendation: opt-in "Projects" module with a sidecar indexer, built after TermFleet's size-control and security basics) is in `devops/termfleet/MASTER_PLAN.md` epic **TC-151 "Integrations: Brainiac"** (children TC-151a..h) and the report `termfleet-deep-dive-2026-10-02.md`. Status: proposed; nothing here changes until Noam decides. This project keeps owning `BOTS.md`, `sweep.py` and the personal Hermes/Telegram delivery either way.

## 2026-10-02 (evening) — assembly-line interface and phased write powers

Status: **proposed**. Sources: `docs/reviews/termfleet-plugins-and-assembly-line-2026-10-02.md` (interface design) and Noam's phase decision. Brainiac and `devops/assembly-line` stay **separate projects that communicate through versioned files**; brainiac observes/triages/suggests, assembly-line queues/implements/reviews. Write powers are **not enabled**; `config/flags.json` exists with every flag `false` and AGENTS.md "Phases and write powers" states the gates. Phase 1 (read-only sweep + suggestions) stays as is until it has run reliably for about two weeks.

| ID | Title | Pri | Effort | Status | Depends on |
|----|-------|-----|--------|--------|------------|
| BRN-014 | `contracts/`: JSON Schemas + fixtures for project-index, suggestion, approval-record, handoff, task-queue, run-report, workspace-registry, control-flags | P1 | S | TODO | - |
| BRN-015 | Emit `reports/project-index.json` from the sweep (plan path/format, `assembly.covered`) | P1 | S | TODO | BRN-014 |
| BRN-016 | Read-only reader for assembly-line reports/queue; assembly-line section in the morning report | P1 | S | TODO | BRN-014 |
| BRN-017 | Workspace-registry awareness: sweep labels `assembly_workspace`, never flags or touches them | P1 | S | TODO | BRN-014 |
| BRN-018 | Interface decision record: D1 status writer, D2 inbox promotion, D3 `PLAN.md` -> `MASTER_PLAN.md`, D4 contracts location | P2 | S | TODO (needs Noam) | - |
| BRN-019 | Control flags + kill switch enforcement: one gate helper every write path calls (flag on, `state/KILL` absent, phase gate recorded); missing/unreadable = off | P1 | S | TODO | - |
| BRN-020 | Suggestion + approval record formats and CLI (`suggest/list/approve/reject/expire`), approval bound to content hash, expiry, hash-chained `state/approvals.jsonl` | P1 | M | TODO | BRN-014, BRN-019 |
| BRN-021 | Phase-1 stability gate: criteria and recorder for "ran reliably ~2 weeks" (`state/phase-gates.json`: 14 green heartbeats, 0 failed/incomplete runs, `ro_check` clean, Noam sign-off) | P1 | S | TODO | BRN-001, BRN-011 |
| BRN-022 | Phase 2: approved-task writer into the owning plan (flag `plan_append`): dry-run diff, provenance line with BRN suggestion id and approval id, `flock` + tail-hash check, post-check that only additions changed, undo | P1 | M | TODO (blocked by gates) | BRN-019, BRN-020, BRN-021, BRN-023 |
| BRN-023 | Audit log + undo manifest format (`state/audit.jsonl` hash-chained; `undo <id>`) used by every write power | P1 | S | TODO | BRN-019 |
| BRN-024 | Phase 3a: archive mover (flag `archive_move`): moves an approved project into `_archive/<date>/<name>/` with `manifest.json`, 30-day undo window, dry run first, never hard delete; refuses on uncommitted/unpushed work, worktrees, assembly workspaces, running processes, TermFleet-open panes | P2 | M | TODO (blocked) | BRN-019, BRN-020, BRN-023 |
| BRN-025 | Phase 3b: approved bloat cleanup (flag `cleanup`): allow-listed targets only (build output, caches), trash with manifest and size check, dry run first | P2 | M | TODO (blocked) | BRN-024 |
| BRN-026 | Phase 4: hand approved implementation tasks to assembly-line (flag `handoff_assembly_line`): `handoff-1.0` file into its declared inbox, requires approval scope `handoff-implementation`, project allow-listed with `autonomy >= 2`, provenance checked on its side | P2 | M | TODO (blocked) | BRN-022, BRN-014, AL-4 |
| BRN-027 | Safety test suite with replay fixtures: flags off => every write path refuses; kill switch stops; changed text invalidates approval; expired approval refused; dirty/unpushed repo refused; path outside allow-list refused; undo restores exact bytes | P1 | M | TODO | BRN-019..BRN-025 |
| BRN-028 | "Turn on" procedure: `brainiac enable <phase>` writes the flag only after gate checks and a typed confirmation, records who/when in the audit log; `brainiac disable` and `KILL` documented | P2 | S | TODO | BRN-019, BRN-021 |

### Gates (all write powers)
Approval record (per item, hash-bound, expiring) · dry run first · undo manifest before change · append-only audit log · flag + kill switch checked immediately before each write · refuse on dirty/unpushed repos and assembly-line workspaces · afterwards verification (`git diff` additions only). Phases 2+ are off by default and only Noam turns them on.

### Notes
BRN-014..BRN-018 come from the assembly-line interface review (division of responsibility, contracts, flows, risks); BRN-019..BRN-028 implement the phased administrative features. The assembly-line side (AL-1..AL-6) is listed in `devops/assembly-line/PLAN.md` (appended section) because that project has no `MASTER_PLAN.md`.

## Evidence locations (2026-10-02)
Cross-project reports saved here: `docs/reviews/termfleet-plugins-and-assembly-line-2026-10-02.md` (referenced by AGENTS.md and `devops/assembly-line/PLAN.md`) and `docs/reviews/termfleet-deep-dive-2026-10-02.md`. The status/Goal-Now review lives in `devops/termfleet/docs/reviews/`. The 2026-09-25 retriage report is in `snapshots/`. Originals/other copies: owning-project `docs/reviews/` dirs.
