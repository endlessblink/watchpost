# Bot and supporting project audit — 2026-11-06

State: in_progress for the whole Watchpost goal; this assigned598-row inventory review is delivered to the parent for controlled application. Source plan corrections are now applied with pre-write backups and before/after digests; no runtime mutation was performed.

## Coverage and evidence limits

All598 recovered rows across14 assigned canonical projects are accounted for in bots-audit.json, including the5 newly recovered nested rows. Each row identifies the source, task-specific occurrences, detailed section span/digest where available, source status, classification, recommendation and next action. Exact task-ID subjects were checked against up to2500 reachable commits per repo, and task-ID matches were searched in source/tests. This is bounded evidence gathering, not exhaustive behavioral verification of every implementation.

262 completed rows are explicitly source-declared completion without fresh independent acceptance. They can be archived as historical declared work while preserving that uncertainty. They must not be reported as independently runtime-verified.

## Changes safe to apply

1. Archive the88 superseded rows with a reason naming the retired architecture. This is cancellation/supersession, never a claim that the original implementation passed. Preserve the source text and dependencies.
2. Correct newsletter-maker TASK101–110 from planned to done: exact source headings14,17,20,23,26,29,32,35,38,41 end `- DONE`; Phase1 line12 says COMPLETE. Runtime SMTP/model activation is separate TODO work.
3. Consolidate CAC TASK014 into FEATURE005: same detail heading line200. Consolidate mixed TASK082–084 umbrella into existing animation TASK083 and TASK084 without erasing the separate browser-extension gate.
4. Consolidate brainiac BRN001 timer-install slice into BRN011; BRN001 still carries sweep correctness limitations, and BRN002 remains owner triage review.
5. Move delivered-but-unaccepted milestones to review and reset false activity claims. Full exact recommendation list follows.

## All original in-progress claims

- claude-and-conquer/BUG-032: superseded → done. This is unfinished legacy Node Telegram poller scope; the owner-retired poller is exited and Hermes owns the live bot. Closing as superseded must not claim implementation or revive the token-sharing poller.
- claude-and-conquer/FEATURE-005: superseded → done. This is unfinished legacy Node Telegram poller scope; the owner-retired poller is exited and Hermes owns the live bot. Closing as superseded must not claim implementation or revive the token-sharing poller.
- claude-and-conquer/FEATURE-014: superseded → done. This is unfinished legacy Node Telegram poller scope; the owner-retired poller is exited and Hermes owns the live bot. Closing as superseded must not claim implementation or revive the token-sharing poller.
- claude-and-conquer/FEATURE-015: superseded → done. This is unfinished legacy Node Telegram poller scope; the owner-retired poller is exited and Hermes owns the live bot. Closing as superseded must not claim implementation or revive the token-sharing poller.
- claude-and-conquer/FEATURE-021: needs_verification → review. Active Health App scope has built/deployed milestones, but source and registry preserve owner acceptance gaps. Planned/in-progress is an inaccurate implementation stage; review preserves the missing acceptance proof.
- claude-and-conquer/TASK-014: duplicate → done. TASK-014 and FEATURE-005 share one detail heading and same remaining Codex backend work; preserve FEATURE-005 as canonical retired-scope history.
- claude-and-conquer/TASK-030: superseded → done. This is unfinished legacy Node Telegram poller scope; the owner-retired poller is exited and Hermes owns the live bot. Closing as superseded must not claim implementation or revive the token-sharing poller.
- claude-and-conquer/TASK-031: superseded → done. This is unfinished legacy Node Telegram poller scope; the owner-retired poller is exited and Hermes owns the live bot. Closing as superseded must not claim implementation or revive the token-sharing poller.
- claude-and-conquer/TASK-033: superseded → done. This is unfinished legacy Node Telegram poller scope; the owner-retired poller is exited and Hermes owns the live bot. Closing as superseded must not claim implementation or revive the token-sharing poller.
- claude-and-conquer/TASK-035: superseded → done. This is unfinished legacy Node Telegram poller scope; the owner-retired poller is exited and Hermes owns the live bot. Closing as superseded must not claim implementation or revive the token-sharing poller.
- claude-and-conquer/TASK-036: superseded → done. This is unfinished legacy Node Telegram poller scope; the owner-retired poller is exited and Hermes owns the live bot. Closing as superseded must not claim implementation or revive the token-sharing poller.
- claude-and-conquer/TASK-055: superseded → done. This is unfinished legacy Node Telegram poller scope; the owner-retired poller is exited and Hermes owns the live bot. Closing as superseded must not claim implementation or revive the token-sharing poller.
- claude-and-conquer/TASK-066: superseded → done. Old Node-bot food/persona Telegram verification targets a retired runtime. Current food/workout capability belongs to Hermes/Health App.
- claude-and-conquer/TASK-081: superseded → done. Old Node-bot food/persona Telegram verification targets a retired runtime. Current food/workout capability belongs to Hermes/Health App.
- claude-and-conquer/TASK-082: duplicate → planned. TASK-082–084 umbrella mixes browser reconnection and animation production/review. TASK083 and084 already retain the actionable animation scopes.
- claude-and-conquer/TASK-119: stale_in_progress → planned. Six asset redraws remain explicitly unfinished; no completion proof was established.
- botson/T-097: needs_verification → review. Requested GG.deals feed and LLM reranker are present in production source; current row overstates ongoing build. Actual natural daily delivery and acceptance need confirmation.
- design-ai-bot/BOT-001: stale_in_progress → paused. Source says Kapso prototype exists but eSIM purchase/account verification and WAHA route decision are outstanding; this is an externally blocked migration, not active implementation.
- paper-bot/BUG-045: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- paper-bot/BUG-051: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- paper-bot/FEATURE-037: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- paper-bot/FEATURE-071: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- paper-bot/TASK-036: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- paper-bot/TASK-038: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- paper-bot/TASK-050: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- paper-bot/TASK-052: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- paper-bot/TASK-055: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- paper-bot/TASK-061: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- paper-bot/TASK-066: needs_verification → review. Shared collector/source capability may still apply because v2 explicitly imports old collectors, but old v1 acceptance or activity claims do not establish v2 coverage.
- paper-bot/TASK-068: superseded → done. The owner-approved2026-10-20 retirement explicitly makes v1 briefs/ranking/recaps/push/dashboard tasks historical; current runtime is v2, so old pipeline work is superseded rather than completed.
- contractor/TASK-044: stale_in_progress → review. Source records an initial CSS layer and owner rejection of prior mixed surfaces, with explicit visual acceptance still open; no fresh owner acceptance or active implementation receipt.
- steady-stream/T-005: stale_in_progress → planned. Plan says next session starts here; current ledger still has simulated parsing timers and no OllamaParse call. No claim that the integration is active is substantiated.
- cc-linux-enhancments/TASK-002: needs_verification → review. Implemented token meter/config/lean-ctx and measured session improvements are documented; remaining controlled-session A/B is explicitly optional, and later backlog levers are untouched. Keep review of delivered milestone separate from unstarted optimizations.
- hermes-agent/HERMES-002: needs_verification → review. Mapped active local source has the requested formatter and7 targeted rendering regressions; real Telegram rendering and current loaded deployment remain unverified.
- lifeboat-live/TASK-2: needs_verification → review. Later local evidence2026-10-06 supersedes the initial nothing-changed note: context-layer fix built, effectiveness explicitly inconclusive/untested.

## Superseded rows by project

- claude-and-conquer: BUG-032, BUG-041, BUG-042, BUG-043, BUG-044, BUG-045, FEATURE-005, FEATURE-014, FEATURE-015, FEATURE-017, FEATURE-019, FEATURE-020, TASK-018, TASK-019, TASK-020, TASK-021, TASK-022, TASK-023, TASK-024, TASK-025, TASK-026, TASK-027, TASK-028, TASK-030, TASK-031, TASK-033, TASK-034, TASK-035, TASK-036, TASK-047, TASK-049, TASK-051, TASK-052, TASK-053, TASK-054, TASK-055, TASK-056, TASK-057, TASK-058, TASK-059, TASK-060, TASK-061, TASK-062, TASK-063, TASK-064, TASK-065, TASK-066, TASK-068, TASK-069, TASK-070, TASK-071, TASK-072, TASK-073, TASK-074, TASK-075, TASK-081
- hermes-agent: HERMES-003
- paper-bot: BUG-045, BUG-051, FEATURE-037, FEATURE-071, TASK-018, TASK-025, TASK-030, TASK-036, TASK-038, TASK-041, TASK-042, TASK-045, TASK-046, TASK-047, TASK-048, TASK-049, TASK-050, TASK-052, TASK-054, TASK-055, TASK-056, TASK-057, TASK-058, TASK-059, TASK-060, TASK-061, TASK-062, TASK-065, TASK-067, TASK-068, TASK-069

## Active successor and consolidation boundaries

- C&C legacy Node Telegram poller is retired: CLAUDE.md and registry claude-and-conquer-legacy agree, and fresh VPS Docker inspection confirms exited. Health App is separately active and must stay visible. Do not restart the legacy poller.
- Paper Bot plan lines17–21 explicitly retire v1 as of Oct20 with owner approval. Old briefs/ranking/recaps/push/dashboard progress claims are historical. Fresh current units are paperbot-v2-collect/shadow/vendors. The current useful natural-delivery outcome needs one explicit v2 task; old v1 identifiers may link to it as superseded history. Retain collector/source TASK006/012/021/066 until v2-specific gaps are checked because old collectors remain shared.
- HERMES003 sidecar topology requires C&C to remain gatekeeper and forbid direct Hermes polling, while actual current design has C&C retired and Hermes gateway owning the channel. Archive the obsolete topology, preserve its security requirements under current runtime owner.
- HERMES002 requested formatter and7 rendering tests exist in registry-mapped lifeboat source; user-visible Telegram rendering/copying and loaded-code proof remain unverified.
- Steady Stream table-card titles are status words, not task names. Restore detail titles T001–009. The T005 ledger still has simulated parsing timers; separate OllamaParse POC exists, integration remains backlog.
- Contractor TASK044 should own the cohesive visual outcome, with TASK045/048/049/050 as preserved implementation/acceptance checklist. TASK046 switching isolation and TASK047 CV labels remain separate behavior tasks. Do not close these on theme code alone.
- Pronto31 offline unit tests pass, but a local SQLite session/proposal prototype is narrower than planned FlowState durability/LangGraph/write-back/recovery/promotion. Move built milestone slices to review; keep uncovered lane acceptance.
- Uatu has only plan and metadata folders, no implementation scaffold:43 planned tasks genuinely unstarted, not obsolete merely by age.
- Brainiac userbus readback failed `No medium found`; timer install current state remains unverified. BRN011 done is a historical source declaration, not live proof.
- DesignAI BOT001 is waiting for real eSIM/account setup and route decision. Record concrete blocked prerequisite; do not buy, pair, or deploy during board cleanup.

## Duplication candidates retained as distinct

- Botson T039 auto-detect topic IDs and T047 auto-detect forum topics have similar names, but distinct contexts/acceptance; no evidence supports deleting one.
- Newsletter Claude integration105 vs API-key activation202 are distinct build/config scopes. HTML builder106 vs templates403 are distinct fixed builder vs reusable layout scopes.
- Paper FEATURE037 web enrichment and TASK036 story enrichment overlap in retired v1, so both archive under the v2 supersession rather than inventing a new v1 consolidation.
- Cross-project source collection, planning, financial tracking and health work is not consolidated merely for similar vocabulary; each has a different authority/runtime.

## Dependencies and unresolved coverage

383 rows have extracted summary-table dependency references. 0 rows refer to IDs absent from this assigned project inventory; these are preserved and must be resolved, not silently removed.

All done rows without independent proof remain declared_done_unverified. Real authenticated acceptance, natural sends, phone visuals, paid/model behavior, protected installed private source, and external prerequisite decisions were not fabricated or forced.

## Applied source corrections

Twenty-two active-stage task statuses were corrected in eleven plans; fourteen plans received dated scope/audit notes. Source-declared newsletter DONE headings needed parser repair, not rewriting. Superseded and duplicate original statuses were preserved. Every edited plan has a pre-write backup and digest in bots-source-corrections.json. Bot checker failures and bounded evidence are recorded separately in bots-checker-receipts.json; the registry was not overwritten. Current parser readback is recorded in bots-source-readback.json; valid plain/bulleted status-field misses have been reported to the parent for repair.

Partial consolidations TASK-082 and BRN-001 remain REVIEW with explicit residual verification scopes; neither is eligible for whole-task archival. TASK-014 alone is a full duplicate of FEATURE-005. The ledger reflects these distinctions.

## Final completion classification correction

Income Zen IZ-001 and IZ-004 explicitly declare DONE in both summary and dedicated source status. Their ledger now records declared_done_unverified and archival eligibility; it does not claim fresh runtime validation. Final bot classifications: {"declared_done_unverified": 264, "superseded": 88, "unfinished": 217, "needs_verification": 24, "duplicate": 1, "stale_in_progress": 4}.
