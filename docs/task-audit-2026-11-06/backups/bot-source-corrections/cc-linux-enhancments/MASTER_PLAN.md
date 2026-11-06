# MASTER_PLAN — Linux Workstation Improvements

## Open Tasks

### TASK-001 — Move heavy builds and agent workloads to the VPS

**Priority:** P0  
**Status:** PLANNED

Move memory-intensive compiles, test suites, installers, and autonomous agent
work from the local desktop to the VPS while keeping interactive desktop apps
and TermFleet responsive.

#### Safety constraints

- Checkpoint and push active work before moving any workload.
- Keep source repositories on disk-backed storage, never RAM-backed temporary
  storage.
- Use a dedicated non-root VPS user, SSH keys, and least-privilege services.
- Transfer secrets through the VPS secret store or protected environment files;
  never commit them.
- Limit remote build and agent concurrency so the VPS cannot enter the same
  memory-pressure failure mode.
- Keep a local fallback and rollback path until remote execution is proven.

#### Implementation plan

1. Inventory heavy local builds, tests, installers, and long-running agents.
2. Measure VPS CPU, RAM, swap, disk space, and existing service load.
3. Prepare a disk-backed remote workspace and resource-limited runner.
4. Add a safe sync-and-run command with dry-run, checkpoint, and resume support.
5. Move one representative build first and compare correctness and duration.
6. Route eligible TermFleet tasks to the VPS while preserving local terminals.
7. Add pressure monitoring, concurrency limits, and automatic backoff.
8. Document rollback and verify the desktop stays responsive during remote work.

#### Acceptance

- A representative heavy build completes on the VPS from a clean checkout.
- Local memory pressure stays below 5% during the remote build.
- No credentials appear in Git history, logs, or copied command output.
- Interrupted work can resume without losing uncommitted changes.
- Local execution remains available as a documented fallback.

### TASK-002 — Cut Codex token/quota use on marathon sessions (lossless)

**Priority:** P0
**Status:** IN PROGRESS

Reduce Codex CLI token/quota burn during long multi-hour sessions on the $200
ChatGPT Pro subscription WITHOUT losing context (no lossy compaction). Root cause
measured: tool outputs/file reads are ~89% of the transcript and get replayed
every turn; a 692-turn session cost ~13.3M effective (full-price-equiv) tokens
even at 95% cache. Constraint: subscription uses OAuth + Responses API, so
third-party compression proxies (Headroom, Token Limits) can't safely sit in
front of it — solution must run inside Codex via MCP.

#### Done so far

- Measurement tool: `scripts/codex-tokens` (also at ~/app-data/bin/codex-tokens)
  — shows cached vs full-price spend + cache-busting resends from rollout logs.
- Baseline captured: worst session ~89.6M raw / ~13.3M effective input tokens.
- Config (`~/.codex/config.toml`, backups kept): added `tool_output_token_limit`
  = 16000, `model_verbosity = "low"`, decision-preserving `compact_prompt`.
- Installed **lean-ctx 3.9.12** (AST/MCP, lossless-by-retrieval) and ran
  `lean-ctx wrap codex`; set **minimal 5-tool profile** (fixed cost ~8K/session).
- Full plan: `docs/codex-token-optimization-plan.md`.

#### Results (measured 2026-07-21, post-install)

- **New sessions improved ~2.5-3.5x**: per-turn effective cost fell from ~24K
  (pre-install) to ~6.5-10K. Growth flattened: a pre-install session hit 209K by
  turn 56; a post-install one was still 137K at turn 84. Fixed overhead did NOT
  rise (18.5-23K vs 21-30K before). Cache-busting resends: 5-7/session -> ~0.
- **Local A/B proof**: `lean-ctx read --mode signatures` cut a real source file
  6063 -> 405 chars (**94%**), with full source retrievable on demand (lossless
  by retrieval, not summarization).
- `lean-ctx gain` self-reports 4.2M tokens saved / 74% compression on touched
  traffic; +1.7K/turn fixed injection.
- **Key limitation found**: a RESUMED marathon session does NOT benefit. The
  692-turn session grew to 872 turns; its last 180 turns still cost ~24K/turn
  (13.35M -> 17.68M effective). lean-ctx cannot retroactively shrink the ~500MB
  of already-recorded history, so the 10% cache tax on that mass is unavoidable.
  Benefit applies to NEW sessions only.
- Tuned to `tool_profile = "minimal"` + `disabled_tools = ["ctx_glob"]`
  (~/.config/lean-ctx/config.toml) -> fixed cost 8225 -> **8068 tok/session**.

#### Decision: do NOT add more tools (step 4 closed)

- `context-compression` (structured files) is **not warranted** — scanned
  projects have **zero** JSON/CSV/TSV files over 500KB. Adding it would be pure
  fixed-cost overhead for no gain.
- External memory is **already covered**: lean-ctx ships cross-session memory
  (CCP: `knowledge remember/recall`, `sessions`, `gotchas`) and Codex
  `memories` is enabled. No third tool needed.

#### Remaining (optional)

1. Session-level A/B needs a real Codex run (cannot be automated here): run one
   identical task with `LEAN_CTX_DISABLED=1`, then without, compare via
   `codex-tokens`.
2. Re-measure periodically; if `lean-ctx tools health` shows the 8K fixed cost
   isn't earned back on light sessions, drop to a leaner profile or disable.
3. Undo path if ever needed: `lean-ctx unwrap codex`.

#### BACKLOG — untouched levers (return here)

Ranked by value. Nothing below is started.

**B1. Cut the fixed per-session overhead (~18-23K) — biggest remaining win.**
Driven by 17 enabled plugins + 3 MCP servers + ~200 skills, all injected every
turn. Options: disable rarely-used plugins (`codex plugin`), move seldom-
triggered skills out of the active skills dir (keep ~20-30), and/or per-task
Codex profiles (`codex -p <name>` layers `~/.codex/<name>.config.toml`) so heavy
plugins/MCP load only when that job needs them. Estimated 5-10K/session saved.
Measure before/after with turn-1 input from `codex-tokens`.

**B2. Context hygiene — `.codexignore` + scoped runs.** Exclude node_modules,
build artifacts, fixtures, vendor docs, large logs; run Codex from
subdirectories in monorepos instead of repo root. Reported 30-60% cut to initial
context. Free, lossless, no tooling.

**B3. Sub-agent isolation.** Push noisy exploration into Codex sub-agents
(`spawn_agent`) with cheaper models, so their tool output never lands in the
main window. Keeps the main session's growth curve flat.

**B4. Resume-cost warning.** Small script/hook that flags when the session you
are about to resume is already in the expensive zone (large recorded history),
since resumed sessions get no lean-ctx benefit.

**B5. Archive the session backlog.** `~/.codex/sessions` was ~35GB with several
500-750MB rollouts. Archive/delete old ones (`codex archive` / `codex delete`)
— housekeeping, and reduces the chance of accidentally resuming a costly one.

#### Acceptance

- Read-heavy session shows clearly lower effective billable tokens vs baseline.
- No context loss: full detail retrievable on demand (AST/cached expand).
- lean-ctx fixed per-session cost is earned back (net savings positive).
