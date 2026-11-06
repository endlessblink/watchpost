# MASTER PLAN

> AI-native task tracking. Managed by the [master-plan](https://github.com/endlessblink/master-plan) workflow.
>
> In this Codex environment, use the equivalent skills `task`, `next`, `save`, and `done`.

## Project Overview

**Project**: paper-bot
**Stack**: Python, FastAPI, APScheduler, SQLite
**Status**: In Development

Personal AI signal desk focused on reliably discovering consistently high-quality AI/dev/product updates, helping the user learn what matters, and rewriting selected stories in the user's style for publishing.

Primary success condition: the system automatically produces a steady flow of useful, post-worthy, understandable stories. It is not enough to avoid bad sends by sending nothing, and it is not enough to patch individual examples after the user provides them.

> **2026-10-20 — v1 retired; paper-bot = v2 only (owner-approved: "בוא נעשה את זה ונעיף את הישן השבור").**
> Live bot is `v2/` on the VPS: `paperbot-v2-shadow.timer` runs `cycle.py` every 5 min (judge + post while `/opt/paper-bot-v2/LIVE` exists) and the new `paperbot-v2-collect.timer` runs `v2/collect.py` every 15 min, which calls only the old RSS/GitHub/Apify/X collectors (from `/opt/paper-bot/code/src`, kept as a library) into the shared items DB `/opt/paper-bot/data/paper_bot.db`. Telegram token still read from `/opt/paper-bot/code/.env`.
> Removed from the server: `paper-bot-api` (FastAPI + scheduler + briefs/judge/push + owner DM commands + recaps), `paper-bot-review` dashboard and its `signal.in-theflow.com` Caddy route (Caddy backup `Caddyfile.bak-paperbot-v1-retire-20261020`), `paper-bot-watchdog`, the dead `cron.d/paper-bot.disabled`, `PAUSE_V1_SENDING`, `/opt/paper-bot-diag`, `/opt/paper-bot/releases`, v1 deploy backups. Kept: daily DB backup cron, items DB, `.env`, collector code/venv, `docs/X_WATCHLIST.md`, `config/sources.json`.
> Local archive (git-ignored, no secrets, checksummed): `reports/archives/paper-bot-v1-archive-20261020/` (DB snapshot, code/data/releases/backups tarball, unit/cron/Caddy copies).
> All v1-pipeline tasks below (briefs, ranking, recaps, push, dashboard) are historical; new work targets `v2/`.

## Roadmap

| ID | Title | Priority | Status | Dependencies |
|----|-------|----------|--------|--------------|
| **TASK-068** | Verify delivery throughput recovered after SQLite lock-retry fix | **P0** | IN PROGRESS | TASK-010 |
| **FEATURE-071** | Accept owner X links and discover substantial multilingual visual coding demos | **P0** | IN PROGRESS | TASK-038, FEATURE-035 |
| **~~TASK-045~~** | Evaluate Hermes or another agent sidecar | **P0** | ✅ **RESOLVED-NO** (2026-05-18) | TASK-038 |
| **~~TASK-001~~** | Implement storage schema and repositories | **P0** | ✅ DONE | - |
| **~~TASK-002~~** | Build RSS and website collector | **P0** | ✅ DONE | TASK-001 |
| **~~TASK-003~~** | Add normalization and dedupe pipeline | **P0** | ✅ DONE | TASK-001 |
| **~~TASK-004~~** | Implement rule-based ranking engine | **P1** | ✅ DONE | TASK-002, TASK-003 |
| **~~TASK-005~~** | Build GitHub releases and activity collector | **P1** | ✅ DONE | TASK-001, TASK-003 |
| **TASK-006** | Build Discord announcement collector | **P1** | PLANNED | TASK-001, TASK-003 |
| **~~TASK-007~~** | ✅ Build X watchlist collector abstraction | **P1** | ✅ **DONE** (2026-04-04) | TASK-001, TASK-003 |
| **~~TASK-008~~** | Add publish outputs and feed endpoints | **P2** | ✅ DONE | TASK-004 |
| **~~TASK-009~~** | ✅ Add optional LLM enrichment stage | **P2** | ✅ **DONE** (2026-04-04) | TASK-004 |
| **~~TASK-010~~** | Add config, scheduling, and runtime wiring | **P1** | ✅ DONE | TASK-002, TASK-003, TASK-005, TASK-006, TASK-007 |
| **~~TASK-011~~** | Define curated source watchlists and seeds | **P1** | ✅ DONE | - |
| **TASK-012** | Add observability, health checks, and error handling | **P2** | PLANNED | TASK-010 |
| **~~TASK-013~~** | ✅ Add changelog and release-note source lane | **P1** | ✅ **DONE** (2026-04-04) | TASK-001, TASK-003 |
| **~~TASK-014~~** | ✅ Collapse X threads into story candidates | **P0** | ✅ **DONE** (2026-04-04) | TASK-007 |
| ~~**TASK-015**~~ | ✅ Add author diversity caps and shortlist balancing | **P0** | ✅ **DONE** (2026-04-03) | TASK-014 |
| **~~TASK-016~~** | ✅ Build cross-source story clustering | **P0** | ✅ **DONE** (2026-04-04) | TASK-013, TASK-014 |
| **~~TASK-017~~** | ✅ Add learning-oriented story report generation | **P1** | ✅ **DONE** (2026-04-04) | TASK-016, TASK-009 |
| **TASK-018** | Add style-based writing transformation layer | **P1** | PLANNED | TASK-017 |
| **~~TASK-019~~** | ✅ Score watchlist accounts by actual output quality | **P0** | ✅ **DONE** (2026-04-04) | TASK-007 |
| **~~TASK-020~~** | ✅ Prune watchlist aggressively from measured output | **P0** | ✅ **DONE** (2026-04-04) | TASK-019 |
| **TASK-021** | Re-review edge-case accounts from recent posts | **P1** | PLANNED | TASK-019 |
| **~~TASK-022~~** | ✅ Generate a 10-item post-worthy shortlist with clear selection reasons | **P0** | ✅ **DONE** (2026-04-04) | TASK-014, TASK-017, TASK-019 |
| ~~**TASK-023**~~ | ✅ Apply manual review verdicts to shortlist visibility immediately | **P0** | ✅ **DONE** (2026-04-03) | TASK-022 |
| **~~TASK-024~~** | Show images and video thumbnails for shortlisted items | **P1** | ✅ DONE | TASK-022 |
| **TASK-025** | Render product updates as version-centric change summaries | **P1** | PLANNED | TASK-013, TASK-016, TASK-022 |
| **TASK-026** | Add persistent source matrix and repo watchlist workflow | **P1** | ✅ DONE | TASK-011 |
| **~~TASK-027~~** | ✅ Add thread-and-link expansion for X and source-backed story ingestion | **P0** | ✅ **DONE** (2026-04-04) | TASK-007, TASK-013, TASK-014 |
| **~~TASK-028~~** | ✅ UI/UX overhaul + Posted/Archive lifecycle + feedback system | **P1** | ✅ **DONE** (2026-04-03) | TASK-024 |
| **TASK-029** | PWA + responsive mobile design | **P1** | ✅ DONE | TASK-028 |
| **TASK-030** | Deploy paper-bot stack to VPS (signal.in-theflow.com) | **P1** | PLANNED | TASK-029 |
| **~~TASK-031~~** | ✅ Wire X_WATCHLIST.md into Apify collector config | **P0** | ✅ **DONE** (2026-04-04) | TASK-007 |
| **~~TASK-032~~** | ✅ Favicon redesign + loading animations | **P2** | ✅ **DONE** (2026-04-05) | TASK-028 |
| **~~TASK-033~~** | ✅ Shortlist quota fix + launcher script + UI spacing | **P1** | ✅ **DONE** (2026-04-08) | TASK-022, TASK-028 |
| ~~**TASK-034**~~ | ✅ Fix SQLite "database is locked" in concurrent jobs | **P1** | ✅ **DONE** (2026-04-08) | TASK-010 |
| **~~FEATURE-035~~** | ✅ Telegram bot: shortlist, triage, pipeline control, Claude remote | **P1** | ✅ **DONE** (2026-04-10) | TASK-022 |
| **TASK-036** | Cross-source enrichment for story cards | **P1** | IN PROGRESS | TASK-022 |
| **FEATURE-037** | Active web enrichment for weak story cards | **P2** | IN PROGRESS | TASK-036 |
| **TASK-038** | Fix upstream shortlist quality: relevance filtering + ranking | **P0** | IN PROGRESS | TASK-036 |
| **~~BUG-039~~** | ✅ LLM scorer inconsistent in batch mode | **P0** | ✅ **DONE** (2026-04-12) | TASK-038 |
| **~~TASK-040~~** | ✅ Fetch tweet reply comments — enrich top 5 high-signal tweets per run with author self-replies | **P1** | ✅ **DONE** (2026-04-12) | TASK-038 |
| **TASK-041** | Pass video thumbnails to Telegram cards | **P1** | PLANNED | TASK-038 |
| **TASK-042** | Add pipeline tracing for debugging | **P2** | PLANNED | TASK-038 |
| **~~TASK-043~~** | ✅ Test harness with 5 known-good tweets | **P0** | ✅ **DONE** (2026-04-12) | BUG-039 |
| **~~TASK-044~~** | ✅ Rewrite card body with real structure — kill hype, keep bullets | **P0** | ✅ **DONE** (2026-04-12) | TASK-038 |
| **BUG-045** | Briefing bottleneck blocks real-time Telegram push | **P0** | IN PROGRESS (reopened 2026-05-20, 42a8dbb6) | TASK-036 |
| **TASK-046** | Add alert lanes and quiet digest routing | **P0** | PLANNED | TASK-038, BUG-045 |
| **TASK-047** | Rewrite Telegram cards to summary + key points | **P0** | PLANNED | TASK-038 |
| **TASK-048** | Add feedback-tuned keep/meh/drop learning loop | **P1** | PLANNED | TASK-038, TASK-042 |
| **TASK-049** | Add Telegram outbox worker and resend policy | **P0** | PLANNED | BUG-045, TASK-012 |
| **TASK-050** | Add must-catch regression set for major launches | **P0** | IN PROGRESS | TASK-038, TASK-043 |
| **BUG-051** | Boilerplate brief text leaks into Telegram cards | **P0** | IN PROGRESS | TASK-036, TASK-038 |
| **TASK-052** | Hard reset v2: stop costly discovery and rebuild measured shortlist core | **P0** | IN PROGRESS | TASK-038 |
| **TASK-054** | Build reliability v2 source-yield and story-quality loop | **P0** | PLANNED | TASK-052 |
| **TASK-055** | Add reliability v2 storage primitives | **P0** | IN PROGRESS | TASK-054 |
| **TASK-056** | Build source-yield telemetry and demotion rules | **P0** | PLANNED | TASK-055 |
| **TASK-057** | Create durable story candidate object and contract | **P0** | PLANNED | TASK-055 |
| **TASK-058** | Cluster raw items into story candidates | **P0** | PLANNED | TASK-057 |
| **TASK-059** | Extract and score story evidence | **P0** | PLANNED | TASK-057 |
| **TASK-060** | Replace raw-item ranking with story scoring | **P0** | PLANNED | TASK-058, TASK-059 |
| **TASK-061** | Build feedback fixtures and replay evaluator | **P0** | IN PROGRESS | TASK-054 |
| **TASK-062** | Add batch-level quality-yield evaluation | **P0** | PLANNED | TASK-061 |
| ~~**TASK-063**~~ | ✅ Implement delivery lanes and routing policy | **P0** | ✅ **DONE** (2026-05-20) | TASK-057, TASK-060 |
| ~~**TASK-064**~~ | ✅ Add why-no-send and lane observability | **P0** | ✅ **DONE** (2026-05-20) | TASK-056, TASK-063 |
| **TASK-065** | Unify Telegram and dashboard story-card rendering | **P0** | PLANNED | TASK-057, TASK-063 |
| **TASK-066** | Add source expansion and pruning workflow | **P1** | IN PROGRESS | TASK-056, TASK-062 |
| ~~**TASK-053**~~ | ✅ Wire bot to Inner Dialogue: Telegram button posts brief + cover image to ID for review | **P1** | ✅ **DONE** (2026-05-18) | - |
| **TASK-067** | Evaluate + prototype ScrapeBadger as cheaper X provider vs Apify | **P2** | PLANNED | TASK-007, TASK-031 |
| **TASK-069** | Make Telegram feedback learning fully reliable | **P0** | PLANNED | TASK-048, TASK-061, TASK-062 |
| ~~**TASK-070**~~ | ✅ Add GitHub repo discovery lanes (topic + keyword search) | **P1** | ✅ **DONE** (2026-06-17) | TASK-052 |

## Active Work

2026-10-12 production update (in_progress): twice-daily actual-delivery recaps installed for 12:00/20:00 Asia/Jerusalem; relevance v2 rejects the owner's LocalMode example while retaining the rainy-store demo. Official capability/usage searches shortened with all authors and caps preserved. Ordinary08:17UTC collection returned20 records in each official lane; raw collection recovered, newest publication dates October9/8. Noon recap closed its window at09:00UTC with zero delivered stories and correctly sent nothing; verified09:05UTC. Nonempty recap acknowledgment and useful automatic delivery remain unverified. GPT-6 item33741 has two failed brief attempts; Haiku5.5 item33742 remains unbriefed. 63 focused checks previously passed. See [deployment evidence](./RECAP_COVERAGE_DEPLOYMENT_2026-10-12.md).


2026-10-12 writing/trace follow-up — in_progress: full owner writing skill deployed to all writing routes; live authenticated Luna summary succeeded without a send. GPT-6 later succeeded09:20UTC after two unclassified failures; source-grounded separate paid/free model availability false hold repaired. Historical failure causes unavailable; future item-correlated sanitized CLI logging installed. 67 focused tests pass. Recap keeps nonempty receipt snapshots/hashes and auto-verifies against delivery DB; noon empty behavior remains proven, next nonempty Telegram acknowledgment and visual quality pending. Broader publication-boundary suite has two send-fixture failures (unconfigured Codex model); pre-change replay stalled and was interrupted, so baseline attribution remains unproven. No protection bypass. See docs/WRITING_RECAP_TRACE_2026-10-12.md.

### TASK-046 follow-up: Twice-daily delivered-story recap (IN PROGRESS)

Owner requested 2026-10-12: summarize all stories actually sent twice daily. Default 12:00/20:00 Asia/Jerusalem in the existing configured destination, concise Hebrew RTL and links to original cards/sources. Reuse acknowledged delivery records, persist recap progress after Telegram acknowledgements, preserve retry/restart behavior and Telegram size limits. No new provider or keys. Implementation and production schedule installed; noon empty-window behavior verified. Nonempty Telegram receipt and visual proof pending.

TASK-038/TASK-050 current owner feedback: coverage is improving but LocalMode remains low-interest; popular commercial model launches and meaningful resets/usage changes are missing. Diagnose actual collection-to-delivery routing, apply a concrete generalizable correction and verify useful natural delivery without weakening grounding, media or significance gates.

### FEATURE-071: Owner link replies and multilingual visual coding discovery (IN PROGRESS)

Owner requested immediate implementation on 2026-10-11 after providing NFT_Chen status 2109034305968336929 as a missed positive example. Register manual X submissions idempotently without broadcast; reply in the authorized originating chat/topic with a Hebrew summary, exact-source image/video thumbnail and source link. Broaden the existing demo collector query without increasing source count, per-run item limits or charge cap; recognize only concrete visual coding evidence through ranking/story/delivery. Attribute model and prompt-count claims. Preserve paid-provider restrictions, grounding and unrelated delivery protections.

Evidence: exact post text and thumbnail retrieved freely from the VPS; isolated visual review confirms the pictured scene only. 110 production-snapshot targeted regressions pass. Nine checksum-guarded runtime files installed with rollback backup `visual-links-20261011`; API restarted at 17:29:56 UTC and health recovered. Installed hashes read back and matched; collector source 39 query matches both startup seed and database, caps remain 20 items / USD 0.05. Exact example registered as item 33558, archived under disabled manual source, zero publish records. Earlier rejected 33364/33425/33517 remain held; 33452 remains eligible. Older demo records do not qualify automatically merely because they contain video.

Current state (2026-10-11 20:55 UTC): inference uses authenticated Codex CLI only; VPS CLI upgraded to 0.162.1 and Luna works with the existing login. Alternate draft/rewrite/enrichment routes also migrated. API keys and paid/local fallback are disabled; no OpenRouter/Ollama/firewall route. Natural scheduled collection completed at 19:35 UTC (300 stored, observed cost 0); source39 naturally caught the concrete Raptor3/Three.js demo33580. Guarded releases corrected detached source access, false WebGPU/local-AI classification, grounded repo-brief precedence, documentation-only marketing penalties and recorded-demo no-proof penalties. Existing source-family, explicit rejection, grounding, Hebrew and publication protections remain.

Real normal-path ManimGX33492 photo delivery acknowledged at20:42:31 UTC, message9127; its grounded Hebrew brief came from Luna. Static review of its source-video thumbnail shows an office opening frame, so semantic image relevance remains unverified. Raptor33580 was shortlisted naturally but both Luna attempts and one Sol attempt produced missing significance and failed the unchanged quality gate; attempts preserved, no receipt. Scoped demo learning-value prompt correction is being prepared. Owner-link installed helper/provider proof passed, but actual incoming owner-link reply and authenticated Telegram/dashboard visual acceptance still require proof. FEATURE-071 remains IN PROGRESS; see CODEX_LOGIN_DEPLOYMENT_2026-10-11.md.

<!-- Detailed task sections appear below. Format: ### TASK-XXX: Title (STATUS) -->

### TASK-068: Verify delivery throughput recovered after SQLite lock-retry fix (IN PROGRESS)
**Priority**: P0
**Status**: IN PROGRESS
**Dependencies**: TASK-010

<!-- paper-bot-scoped-recovery-2026-10-05:start -->
**2026-10-05 recovery checkpoint:** owner-reported prolonged silence was traced to a briefing/eligibility blockage despite fresh collection. The exact duplicate-poll storage repair and existing local fallback model-name correction were owner-approved and deployed at **18:21:17 UTC / 21:21:17 Israel**, API-only restart; six installed regressions pass and API is healthy. One no-publication local brief validation failed with HTTP 200 / `length` / 700 tokens / empty content. No second manual attempt, paid fallback, wider quality/source/ranking/subscription activation or retry reset. Primary failure is still unclassified and useful throughput is **not demonstrated recovered**. Keep TASK-068 IN PROGRESS until fresh, useful briefs and actual delivery acknowledgements recover. Last confirmed publication is **12:50:04.427476 UTC / 15:50:04.427476 Israel**, item 31605; routing `sent_at` is not a receipt clock. See [scoped recovery evidence](./DELIVERY_RECOVERY_2026-10-05.md).
<!-- paper-bot-scoped-recovery-2026-10-05:end -->

<!-- paper-bot-brief-repair-2026-10-05:start -->
**2026-10-05 generator/grounding repair — prepared, not deployed; release gate open:** exact saved real brief passes the current deployed storage/full-push acceptance path and mock-publishes unsupported zero-cost/benchmark/security claims. Current automatic acceptance is unsafe for this actual output. The prior two-runtime-file generator-only activation proposal is superseded. Exact six-file isolated slice (`brief.py`, `runtime.py`, new `brief_grounding.py`, `repositories.py`, `delivery.py`, `push.py`) combines protocol/resource repair, late source caveats and bilingual review holds before claim. Guarded replay: no claim/transport; queue continues to useful fixtures. **260 tests passed + 5 paid opt-in skips**. No new model call, publication, production source/config change or activation. Revised prompt not model-validated; affected risk claims stay held without an approval bypass; arbitrary semantic correctness/useful live flow unproven. Latest ordinary cycle 20:14:57 UTC: 0 LLM briefs, 16 failures, 2 feedback skips; 2 deterministic completions were already published. Paid remains off, installed quality/storage changes preserved. TASK-068/TASK-038/BUG-051 stay IN PROGRESS. [Exact unsafe baseline, guarded patch and remaining release gate](BRIEF_GROUNDING_RELEASE_GATE_2026-10-05.md).


**Deployment authorization blocker (20:45:15 UTC):** parent forwarded owner immediate six-file approval (“מאשר לאלתר לפרוס תפסיק לשאול”), but automatic approval review rejected production install/backups/API restart because cloud-thread forwarding is untrusted and direct task scope says no deployment. No execution/retry/restart/source/config change occurred; source/config hashes and both PIDs verified unchanged, new guard absent. Exact installer and installed offline test runner prepared. Require direct trusted execution authorization; do not bypass the rejection. No installed cycle or recovered delivery claimed. [Blocked outcome and smallest action](BRIEF_GROUNDING_DEPLOYMENT_2026-10-05.md).

<!-- paper-bot-brief-repair-2026-10-05:end -->

**Background:** Telegram delivery produced fewer/sporadic cards because the
delivery transaction's read→write upgrades (`StoryCandidateRepository.upsert_candidate`
at `repositories.py:560` + `DeliveryDecisionRepository.record_decision` at
`repositories.py:607`) hit `database is locked` under scheduler-tick write bursts
plus the second `paper-bot-review` writer process; the old 4-attempt/~11s retry
exhausted and dropped deliveries (90 failures over 3 days, surged Jun 04–05).
Fix deployed 2026-06-05 ~18:14 IDT: widened `_with_sqlite_lock_retry` in
`src/paper_bot/telegram_bot/push.py` to ~10 attempts with exponential backoff
(cap 8s) + jitter (~60s budget). Committed `b2f0212`, pushed to origin/master.
Verified immediately after deploy: 0 delivery lock-failures vs ~33/day before.
NOTE: a 2.5h background throughput recheck was running on the local PC but is
lost when the PC restarts — hence this task.

**Future steps:**
0. **2026-06-11 lane update:** verification found the original
   `_send_curated_shortlist failed` symptom had recovered since Jun 10, but
   diagnostic `delivery-route` persistence was still exhausting the full
   SQLite retry budget for many already-published/drop/hold items. This did
   not always crash top-level push because delivery-route persistence is
   best-effort, but it still held the sender in ~60s retry loops and overlapped
   scheduled brief/rank jobs. Fix deployed on branch
   `task-068-delivery-throughput`: keep strong retries for real publish-state
   writes, but make diagnostic delivery-route writes fail fast with an
   in-memory route fallback.
1. **Recheck throughput (the lost background job).** On the VPS
   (`ssh -i ~/.ssh/id_ed25519 root@84.46.253.137`): compare
   `journalctl -u paper-bot-api | grep -c "_send_curated_shortlist failed"` for
   ~3h before 18:14 vs since; and application-confirmed publications/hour from
   `sqlite3 /opt/paper-bot/code/data/paper_bot.db "SELECT strftime('%H:00',published_at),count(*) FROM publish_states WHERE channel='telegram' AND status='PUBLISHED' AND date(published_at)=date('now') GROUP BY 1;"`.
   Use UTC for this DB comparison; routing `sent_at` includes already-published skips and is not a receipt.
   Success = lock-failures stay ~0 and sends become steadier.
2. **Confirm in the Telegram channel** that cards are more consistent than the
   pre-fix "fewer/sporadic" pattern (the user-visible success criterion).
3. **If lock failures RETURN and cards stay sporadic → escalate to Step 2:**
   targeted `BEGIN IMMEDIATE` for the delivery WRITE transactions ONLY (NOT
   global — see `storage/db.py:45-55`, the global version was reverted for a
   worse storm) so the 30s `busy_timeout` absorbs bursts; keep the widened retry
   as backstop; deploy via `./deploy.sh`, live-verify, instant revert if it
   regresses.
4. **Post-restart sanity:** ensure home Ollama (systemd; override.conf sets
   `OLLAMA_HOST=0.0.0.0`, `OLLAMA_KEEP_ALIVE=30s`, single model/parallel) and
   Tailscale are back up so the LOCAL FALLBACK works. paper-bot keeps running on
   the OpenRouter primary even if the home machine is down.
5. **Close TASK-068** once fresh, useful delivery throughput is confirmed recovered; another deployed fix alone is insufficient.

**Current LLM config (reference):** OpenRouter primary `google/gemma-4-31b-it:free`
+ local Ollama fallback `gemma4:12b` @ `http://100.123.175.54:11434/v1`
(VPS `/opt/paper-bot/code/.env`; `.env` excluded from `deploy.sh`).

### TASK-067: Evaluate + prototype ScrapeBadger as cheaper X provider vs Apify (PLANNED)
**Priority**: P2
**Status**: PLANNED
**Dependencies**: TASK-007, TASK-031

Investigate replacing the Apify `quacker/twitter-scraper` X provider with [ScrapeBadger](https://scrapebadger.com/) to cut tweet-fetch cost.

**Confirmed from docs (2026-06-05):**
- Twitter endpoints are a flat **1 credit/request** (not per-item); Advanced Tweet Search returns up to 100 tweets/call. Failed requests cost 0 credits.
- PAYG rate: **$0.15 per 1,000 credits** → ~$0.15 per 1,000 calls. New accounts get 1,000 free credits.
- Advanced Tweet Search supports native operators (`from:`, `since:`, `min_faves:`), so the existing 49-handle batched `from:a OR from:b…` "Advanced Search" query in `apify_x_provider.py` ports unchanged. Reply-fetch maps to the Get Tweet Replies endpoint (1 credit).
- Free-tier rate limit (60 req/min) far exceeds the bot's ~6-calls-every-4h cadence.

**Estimated cost on current volume:** ~$0.03–$0.30/month vs Apify's self-capped $0.20/run (~$5–15/mo realistic for X). Roughly 20–100× cheaper.

**Open risk — data parity (the thing to validate before cutover):** confirm ScrapeBadger's tweet objects carry every field the pipeline relies on (engagement metrics, media URLs, conversation/thread context for the "link in comments" reply logic).

**Proposed steps:**
1. Sign up for the free tier (1,000 credits).
2. Write a `ScrapeBadgerXProvider` alongside the existing Apify provider (same `XTweetProvider` interface; map response fields in `apify_x_provider.py`'s normalization shape).
3. Run both providers on the same watchlist query once; diff normalized output for field parity.
4. If parity holds, switch the default provider and keep Apify as fallback.

Sources: [Credits & Pricing](https://docs.scrapebadger.com/credits-and-pricing.md), [Rate Limits](https://docs.scrapebadger.com/rate-limits.md), [Advanced Tweet Search](https://docs.scrapebadger.com/api-reference/endpoint/tweets/advanced-search.md)

### TASK-053: Wire bot to Inner Dialogue (DONE 2026-05-18)
**Priority**: P1
**Status**: ✅ DONE
**Dependencies**: -

Add a fourth callback button (`📝 To Inner Dialogue`) next to Keep/Drop/Maybe on every Telegram card. When tapped, paper-bot POSTs the item to Inner Dialogue's local API (`http://100.123.175.54:3979/api/posts/ingest` over Tailscale) with the brief as the body and the card's image as the cover, then replies in Telegram with the returned `editorUrl` so the user can open the Inner Dialogue editor to review / edit / publish.

**Scope (cheapest first)**:
- [x] Telegram button + callback handler in `triage.py` (pattern `triage:{id}:to_id`)
- [x] POST to `/api/posts/ingest` with `{title, body, type: "article"}`
- [x] Reply in Telegram with the editorUrl
- [x] Raw English brief — user does Hebrew rewrite inside Inner Dialogue editor (no LLM dependency)
- [x] Failure handling: connection refused / non-200 → reply with error so user knows to retry
- [x] Include full stored Signal context in the Inner Dialogue draft: original text, source metadata, thread/reply context, linked-source context, extracted important changes, media, and all evidence URLs

**Out of scope for v1** (separate iteration):
- Hebrew draft generation via `noam-writing-style` skill (needs an LLM backend decision — Anthropic costs money, Ollama may produce wooden Hebrew)
- Pull-back of published URL into paper-bot's publish_states

**Why**: editorial spec wants paper-bot output to feed publishing-ready posts. Right now the user has to copy-paste from Telegram into Inner Dialogue manually.

---

### TASK-052: Hard reset v2: rebuild measured quality and discovery core (IN PROGRESS)

<!-- paper-bot-editorial-status-2026-10-04:TASK-052:start -->
**Scoped cost/provider update (2026-10-04 22:22 UTC)**: IN PROGRESS — not completion of the v2 rebuild. At the read-only capture, the rolling 30-day ledger estimates $9.356214 API exposure, of which paid briefing is $9.328774. It records 4,886 paid item/provider attempts across 331 batches with zero parsed/accepted/stored briefs; transport/parsing cause and unmetered/invoice/VPS costs remain unknown.

**Prepared only**: shared atomic API reservations across model/search/actor routes; fail closed for unknown prices/caps; retain unknown usage across rollover; visible used/reserved/remaining/currency/timezone/window/stop reason; exact-input cache, lease/cooldown and at-most-two quality attempts; remove implicit CLI/SDK OAuth fallback. Default route remains configured free HTTP. Disabled `gpt-6.1-sol` subscription adapter pins the model, requires a dedicated non-root worker and official owner sign-in, pauses all items on quota/auth/model/runtime failure, and never falls back to API spend.

**Pending**: owner chooses no paid API versus an explicit cap/currency/timezone/window; owner explicitly approved the narrow production paid-brief stop on 2026-10-05. It completed at 04:22:32 UTC: only `PAPER_BOT_BRIEF_PAID_FALLBACK_ENABLED` changed from true to false, with private backup, API-only restart and successful health/collection checks. Production paid brief fallback is now disabled. Dedicated worker architecture, entitlement/CLI support, approved action-time login and output review required before activation. Root catalog/help checks were rejected by automatic approval review for forbidden auth-state paths, with no bypass. 437 offline tests/14 skips; see root `COST_AND_PROVIDER_REVIEW.md` and `DEPLOYMENT_REVIEW.md`. No new persistent access or paid/live calls.
<!-- paper-bot-editorial-status-2026-10-04:TASK-052:end -->

<!-- paper-bot-paid-brief-stop-2026-10-05:start -->
**Owner-approved operational milestone — COMPLETE (2026-10-05 04:22:32 UTC)**: disable ONLY the paid brief-generation fallback. Explicit owner approval to the backup/stop/health-check proposal was supplied by the parent thread. In `/opt/paper-bot/code/.env`, line 36 changed from `PAPER_BOT_BRIEF_PAID_FALLBACK_ENABLED=true` to `PAPER_BOT_BRIEF_PAID_FALLBACK_ENABLED=false`. A zero-context diff confirms all other configuration bytes are unchanged.

**Backup/verification**: `/opt/paper-bot/backups/paid-brief-stop-20261005T042219Z/.env.before` (file 0600, directory 0700). API PID 1959318 exited; new PID 562541 active/running. `/health` is ok; Telegram wiring ready; scheduler and Apify collection remain enabled; schedule and source roster are unchanged. Review service stayed active with PID 2716698; tracked runtime/source-profile hashes match. The sole systemd EnvironmentFile was reloaded by the confirmed API restart; the unchanged runtime gate returns false before budget/provider access and passes that result into scheduled briefing. The normal 20-minute brief cycle was not manually triggered; cached pre-restart run fields are not fresh evidence. No test provider calls.

**Rollback, if owner requests reversal**: narrowly restore this flag to its backed-up true value and restart only `paper-bot-api`, then repeat flag/health checks. Preserve later unrelated config edits; do not overwrite the whole config blindly. This re-enables paid fallback. The original private backup and remote `operation.json` retain the exact before state and file metadata.

**TASK-052 remains IN PROGRESS**: the isolated 35-file code patch, source expansion, shared cap and subscription adapter are not deployed/activated. No service user/login was created, no credentials copied for subscription, and no new cap set. Next separate action is a reviewed dedicated unprivileged worker/dispatch plan and official owner sign-in at action time. Evidence: `/home/endlessblink/Documents/Codex/2026-10-04/task-19/paid-brief-stop-result.json` and `PAID_BRIEF_STOP_2026-10-05.md`.
<!-- paper-bot-paid-brief-stop-2026-10-05:end -->

<!-- paper-bot-service-user-2026-10-05:start -->
**Owner-approved operational milestone — COMPLETE (2026-10-05 08:33:39 Asia/Jerusalem / 05:33:39 UTC)**: owner explicitly authorized only creation of restricted Linux service account `paper-bot-llm` on Paper Bot VPS `84.46.253.137`. Created system UID 987 / primary GID 980; password locked, shell `/usr/sbin/nologin`, sole group `paper-bot-llm`, no sudo privileges, and empty private home `/var/lib/paper-bot-llm` owned by the account with mode 0700. All ten targeted checks passed.

**Operational verification**: API PID 562541 and review PID 2716698 remained active and unchanged. No service restart, CLI installation, login, credential creation, model call, service unit, worker activation or code deployment occurred. The paid brief fallback remains disabled from the earlier approved operation.

**TASK-052 remains IN PROGRESS**: the account is ready for separately authorized official sign-in and reviewed restricted worker/dispatch integration. Model entitlement, CLI compatibility and included-allowance-only billing policy remain unverified; generation remains inactive. The 35-file prepared code patch and new source profile/cap remain unapplied. Evidence: `/home/endlessblink/Documents/Codex/2026-10-04/task-19/service-user-create-result.json` and `SERVICE_USER_2026-10-05.md`.
<!-- paper-bot-service-user-2026-10-05:end -->

<!-- paper-bot-subscription-and-archive-2026-10-05:start -->
**Scoped subscription follow-up — IN PROGRESS (2026-10-05)**: owner approved continuing dedicated official sign-in and seeing a public-source result. Created private `/var/lib/paper-bot-llm/codex-auth` (0700) under the restricted account; server Codex 0.133.0 supports device auth and the required exec isolation/schema switches. Started the official device flow; no credentials were copied or read, no model request made, and no worker or production route activated. Owner sign-in, CLI restriction compatibility, model entitlement and included-allowance-only billing verification remain pending. Owner additionally requests more useful, relevant, well-written messages together and concrete draft wording; persisted in the editorial preferences and feedback log.

**Owner-approved obsolete-copy archive — COMPLETE (2026-10-05 08:50:31 Asia/Jerusalem / 05:50:31 UTC)**: exact obsolete project was `bots+automation/paper-bot-v2` (no `paper-bot-2` directory). It declared dormant/deployment none; no v2 service/cron/active-project code reference or v2 runtime process was identified in bounded local/VPS checks. Moved by same-filesystem atomic rename to `paper-bot/reports/archives/paper-bot-v2-2026-10-05`. Existing `/reports/` Git ignore and deployment `--exclude='reports'` keep it out of Git and VPS sync; no exclusion rules changed. Private archive parent is 0700. All 13,762 entry inodes, modes, owners, sizes and modification times and all symlink texts were preserved; 228,561,844 regular-file bytes remain in the original file objects. Uncommitted source and complete .git are preserved; before/after both had no usable HEAD and the initial repository had zero Git objects. Shared external uv Python was not moved or edited.

**Active bot/coordination**: API PID 562541 and review PID 2716698 stayed active at `/opt/paper-bot/code`; `/health` returned ok after archival. No restart, permanent deletion or deployment. `bots-directory/bot-registry.yaml` still has dormant v2 references; left untouched for the active checker-integration worker, with exact requested follow-up in `/home/endlessblink/Documents/Codex/2026-10-04/task-19/V2_REGISTRY_COORDINATION.md`. Archive pointer: `docs/ARCHIVED_PAPER_BOT_V2.md`. Evidence: `v2-archive-inventory.json` and `v2-archive-result.json` in the same task workspace. TASK-052 remains IN PROGRESS; archival does not deploy a replacement or complete the measured quality work.
<!-- paper-bot-subscription-and-archive-2026-10-05:end -->


**Priority**: P0
**Status**: IN PROGRESS
**Dependencies**: TASK-038

Repeated repair attempts have become part of the failure signal. Do not continue by adding another ranking heuristic, stricter send gate, or hardcoded example patch on top of the current loop. The next implementation must preserve data and feedback, control cost, and rebuild the smallest measured v2 core that can prove both discovery yield and quality before broad discovery is trusted.

**Goal**:
- Produce consistent high-quality results automatically, not silence and not one-off hardcoded examples
- Measure source yield: how many collected items become user-approved keeps or useful sends
- Disable or narrow scheduled Apify/X discovery when it cannot meet quality/cost targets
- Add durable collector-run telemetry with cost exposure and source yield
- Build regression tests from real keep/drop feedback before tuning new ranking behavior
- Route Telegram and dashboard through one validated story-card contract
- Keep existing useful collectors/storage where they help, but treat current shortlist ranking as untrusted until proven

**Kill criteria for the old loop**:
- No broad X/Apify source may run automatically without daily/monthly caps
- No source remains enabled if it repeatedly produces reviewed drops and no keeps
- No item reaches Telegram without a concrete story card and evidence/media handling
- No implementation is accepted if it only improves copy while weak items still survive
- No implementation is accepted if the practical result is “no useful items sent” while good signals exist
- No implementation is accepted if it only works for URLs/accounts the user already pasted

**Tasks**:
- [ ] Add Apify/X kill switch defaults and budget configuration
- [ ] Add collector-run ledger and dashboard/source-yield summary
- [ ] Convert recent bad/good feedback into regression fixtures
- [ ] Make shortlist/card rendering the single backend source of truth for Telegram and dashboard
- [ ] Add quality-yield acceptance tests: known good signals are discovered automatically, known bad classes are rejected, and the system produces enough useful output to be worth running
- [ ] Re-enable discovery gradually only after reviewed batches hit acceptable keep/drop yield

---

### TASK-054: Build reliability v2 source-yield and story-quality loop (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-052

Implement the architecture in `docs/reliability-v2.md`. The goal is reliable useful output, not stricter silence and not one-off example patches.

**Acceptance criteria**:
- [ ] Every collector run records source yield: collected, story candidates, shortlisted, sent, kept, dropped, duplicates, cost, cost per keep.
- [ ] Every delivery decision records a reason: sent, maybe, duplicate, weak evidence, weak user impact, stale, briefing unavailable, cost capped, source disabled.
- [ ] Telegram and dashboard use the same story-card contract, not separate raw-item eligibility logic.
- [ ] Known-good and known-bad feedback examples become regression fixtures.
- [ ] A batch-level eval reports useful-output rate and keep/drop yield, not only unit-test pass/fail.
- [ ] Source promotion/demotion is based on measured yield, not static trust.
- [ ] The system can explain why no useful item was sent without treating no-send as success.

**Implementation tasks**:
- [ ] Add `collector_runs`, `source_yield_snapshots`, `story_candidates`, `delivery_decisions`, and `quality_fixtures` storage.
- [ ] Create a story candidate builder that clusters raw items by canonical URL, entity/repo/model names, and temporal proximity.
- [ ] Add source-yield scoring and automatic demotion warnings.
- [ ] Add a `why-no-send` API endpoint and dashboard summary.
- [ ] Add fixture replay command for known-good/known-bad examples.
- [ ] Replace direct Telegram raw-item send eligibility with story-card delivery decisions.

---

### TASK-055: Add reliability v2 storage primitives (IN PROGRESS)
**Priority**: P0
**Status**: IN PROGRESS
**Dependencies**: TASK-054

Add the durable DB primitives needed to measure and improve reliability instead of guessing from individual Telegram cards.

**Scope**:
- [x] Add `SourceYieldSnapshot` model and repository.
- [ ] Add `StoryCandidate` model or durable JSON contract.
- [ ] Add `DeliveryDecision` model.
- [ ] Add `QualityFixture` model.
- [ ] Add migration-safe schema checks for existing live SQLite DBs.
- [ ] Add repository tests for every primitive.

**Acceptance criteria**:
- Source, story, fixture, and delivery quality data can be persisted independently of raw items.
- Existing DBs initialize safely with the new tables.
- Tests prove source yield can be counted from collected/ranked/enriched/published items.

---

### TASK-056: Build source-yield telemetry and demotion rules (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-055

Measure whether each source/account/query actually produces useful output.

**Scope**:
- [ ] Record source-yield snapshots after every collector/lane run.
- [ ] Track collected, story candidates, shortlisted, sent, kept, dropped, duplicate, stale, and failed-brief counts.
- [ ] Track cost and cost per useful send/keep for paid sources.
- [ ] Add source status labels: `promoted`, `active`, `watch`, `demoted`, `disabled`.
- [ ] Add demotion warnings for sources with high drop rate and no keeps.
- [ ] Add promotion hints for sources with repeated high-yield output.

**Acceptance criteria**:
- The bot can answer: “which sources are producing useful results?”
- Broad X/Apify expansion decisions are based on yield and cost, not intuition.

---

### TASK-057: Create durable story candidate object and contract (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-055

Stop treating raw tweets/releases as final Telegram-ready content. Introduce a story candidate contract used by ranking, dashboard, Telegram, and evals.

**Scope**:
- [ ] Define fields: `headline`, `canonical_url`, `member_item_ids`, `canonical_source_id`, `evidence_urls`, `media`, `entities`, `claims`, `quality_score`, `bucket`, `lane`, `delivery_status`.
- [ ] Store story-card sections: `what_happened`, `what_is_special`, `why_it_matters`, `why_it_fits_you`.
- [ ] Store scoring breakdown and rejection/delivery reasons.
- [ ] Add serializer used by both dashboard and Telegram.

**Acceptance criteria**:
- Telegram and dashboard can render the same story candidate without separate logic.
- A raw X item cannot bypass story formation and become a “story” by accident.

---

### TASK-058: Cluster raw items into story candidates (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-057

Group related raw items into one underlying story to prevent duplicate sends and improve evidence.

**Scope**:
- [ ] Cluster by canonical URL, expanded links, repo/model/product names, author/source, temporal window, and normalized claim text.
- [ ] Prefer official source/release as canonical when available.
- [ ] Attach X posts as supporting evidence when they discover or explain a story.
- [ ] Collapse duplicate X posts and same-story source variants.

**Acceptance criteria**:
- Multiple URLs/headlines for the same update produce one story candidate.
- Official primary source wins over weaker social echoes.

---

### TASK-059: Extract and score story evidence (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-057

Make evidence explicit before ranking or delivery.

**Scope**:
- [ ] Expand `t.co` and external links.
- [ ] Fetch linked repo/docs/changelog/blog context when available.
- [ ] Preserve X thread/reply context and media/video thumbnails.
- [ ] Classify evidence as `official`, `repo`, `docs`, `demo_media`, `benchmark`, `social_only`, `none`.
- [ ] Score evidence strength and confidence.

**Acceptance criteria**:
- X-only hype cannot score as high-confidence unless media/demo evidence is substantive or source is primary.
- Story cards can cite the evidence behind the claim.

---

### TASK-060: Replace raw-item ranking with story scoring (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-058, TASK-059

Score stories using the reliability-v2 rubric rather than letting `rank_score + brief` imply quality.

**Scope**:
- [ ] Implement 0-100 story scoring: freshness, impact, learning/posting value, evidence, source trust, user fit, penalties.
- [ ] Require practical user/product significance, not only technical novelty.
- [ ] Add duplicate/stale/generic/minor-changelog penalties.
- [ ] Store score breakdown and bucket: `urgent`, `normal`, `maybe`, `drop`.

**Acceptance criteria**:
- Known-good examples score high for general reasons.
- Known-bad examples score low for explainable reasons.
- Silence is not considered success when high-scoring stories exist.

---

### TASK-061: Build feedback fixtures and replay evaluator (IN PROGRESS)
**Priority**: P0
**Status**: IN PROGRESS
**Dependencies**: TASK-054

Turn user feedback into durable regression tests.

**Scope**:
- [x] Convert recent positive examples into `must_catch` fixtures from real feedback events.
- [x] Convert recent negative examples into `must_reject` fixtures from real feedback events.
- [ ] Store expected bucket/lane and reason expectations.
- [x] Add API action to build fixtures from feedback and use the existing replay evaluator endpoint.
- [ ] Fail eval when hardcoded URL-specific logic is required to pass.

**Acceptance criteria**:
- Future changes can be tested against user taste before deployment.
- Examples teach patterns, not exact exceptions.

---

### TASK-062: Add batch-level quality-yield evaluation (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-061

Individual tests are not enough. Evaluate whole batches for usefulness and consistency.

**Scope**:
- [ ] Add historical batch replay from stored raw items.
- [ ] Report collected → story → scored → sent funnel.
- [ ] Report expected useful-output rate and keep/drop yield.
- [ ] Detect no-send failure when known-good items exist.
- [ ] Track source mix and X dominance.

**Acceptance criteria**:
- A daily run can be judged as good/bad by metrics, not vibes.
- Release/deploy is blocked when batch quality regresses.

---

### TASK-069: Make Telegram feedback learning fully reliable (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-048, TASK-061, TASK-062

Telegram feedback currently affects the system through exact URL/author/domain blocks, lightweight learned penalties, pre-brief filtering, and fixture generation. That is useful but not yet a fully reliable learning loop: positive feedback is still narrow, `maybe` is not a true graded middle signal, some consumers hardcode `data/` while others use the configured DB directory, and the feedback effect is not visible enough to prove in production.

**Goal**:
- Make every Telegram feedback action durable, complete, and consumed by the next ranking/briefing/push cycle.
- Learn from `keep > maybe > drop` as graded user taste, not only as exact-item suppression.
- Prove the loop with replay fixtures, debug metadata, and production health output.

**Scope**:
- [ ] Centralize feedback data-dir resolution so Telegram, dashboard, ranking, briefing, push, quality eval, and shortlist prompt examples read/write the same configured files.
- [ ] Persist complete Telegram feedback events: verdict, reason, author, source type/family, domain, URL, title, brief title, rank score, value-gate reason, key brief text, linked URLs, and timestamp.
- [ ] Keep feedback loaders backward-compatible with older sparse JSONL/review-note events.
- [ ] Treat `keep`, `maybe`, and `drop` as graded labels: positive boosts, neutral/borderline preservation, and negative demotion/blocking.
- [ ] Add positive pattern learning beyond author boosts: source/domain quality, artifact-backed launch patterns, topic/token clusters, and keep reasons.
- [ ] Keep negative learning explainable and conservative: exact dropped URLs, repeated bad authors/domains, repeated weak source/content patterns, and lexical drop clusters before briefing spend.
- [ ] Preserve protections for important Claude/Codex/agent-control/builder/source-backed updates so broad feedback penalties do not bypass normal evidence, duplicate, and score gates.
- [ ] Store feedback effects in item metadata/ranking state: matched reason, adjustment, source event counts, protected/block/boost decision, and stage affected (`rank`, `prebrief`, `delivery`).
- [ ] Add read-only health/debug output showing feedback file path, event count, newest event timestamp, active boosts/penalties, and recent feedback-blocked item IDs.
- [ ] Extend fixture generation and replay to cover `must_catch`, `maybe_review`, and `must_reject` examples, and fail when exact URL/author hardcoding is the only reason a fixture passes.

**Acceptance criteria**:
- A Telegram `drop` suppresses the exact item and measurably demotes/blocks similar weak candidates by the next cycle.
- A Telegram `keep` measurably boosts similar high-quality future candidates without making one author/domain dominate the feed.
- A Telegram `maybe` keeps borderline exploration available without creating a strong send boost.
- Every feedback-driven rank adjustment, pre-brief skip, or delivery block is visible in metadata and status/debug output.
- Focused feedback tests and quality fixture replay pass.
- Production proof shows the live Telegram bot writes to the same feedback path the scheduler consumes, with a recent feedback event visible in health/debug output.

---

### TASK-063: Implement delivery lanes and routing policy (DONE 2026-05-20)
**Priority**: P0
**Status**: ✅ DONE
**Dependencies**: TASK-057, TASK-060

Add explicit delivery lanes so the bot can maintain useful flow without mixing hard news, maybe items, and fun demos.

**Lanes**:
- `urgent`: major official announcements, major capability jumps, must-send stories.
- `normal`: strong useful stories suitable for Telegram during the day.
- `maybe_review`: promising but under-evidenced or borderline stories for dashboard/manual review.
- `fun_cute`: lightweight delightful demos that should not displace hard-news/product updates.
- `drop`: rejected stories with explicit reasons.

**Scope**:
- [x] Add lane field to story candidates/delivery decisions.
- [x] Define thresholds and volume caps per lane.
- [x] Add freshness/backlog policy per lane.
- [x] Prevent `maybe_review` from silently filling Telegram.
- [x] Allow fun/cute lane only as clearly labeled lightweight output.
- [x] Add send/hold/drop decisions with durable reasons and media/evidence safeguards.

**Acceptance criteria**:
- Telegram has useful flow without letting weak items leak in.
- No-send is explained as lane-specific, not hidden behind a generic empty queue.

---

### TASK-064: Add why-no-send and lane observability (DONE 2026-05-20)
**Priority**: P0
**Status**: ✅ DONE — `/why-no-send` now returns an observability report, not just raw decisions
**Dependencies**: TASK-056, TASK-063

**Resolved 2026-05-20:** Expanded `/why-no-send` and `/api/why-no-send` with lane/action/reason
counts, reason categories for duplicate/stale/evidence/briefing/ranking/source/cost failures,
pipeline backlog counts, source health/useful-output rates, disabled-source visibility, high-yield
source staleness alerts, and collector cost-cap state. Added Signal Deck diagnostics cards for send
health, useful-output rate, why-no-send summary, and source health. Guarded by
`tests.test_runtime.RuntimeTests.test_explain_no_send_summarizes_delivery_pipeline_and_source_health`.

Make failure modes visible.

**Scope**:
- [ ] Add `/why-no-send` API endpoint.
- [ ] Show counts by lane and rejection reason.
- [ ] Distinguish discovery failure, ranking failure, evidence failure, briefing failure, duplicate suppression, stale backlog, source disabled, and cost cap.
- [ ] Add dashboard card for source health and useful-output rate.
- [ ] Add alert condition for high-yield source staleness.

**Acceptance criteria**:
- When nothing is sent, the system explains why and whether that is acceptable.
- The user can see whether the problem is discovery, quality, briefing, or delivery.

---

### TASK-065: Unify Telegram and dashboard story-card rendering (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-057, TASK-063

Remove separate raw-item eligibility and rendering paths.

**Scope**:
- [ ] Render Telegram from story candidate contract.
- [ ] Render dashboard shortlist from the same contract.
- [ ] Store delivery card payload and source evidence.
- [ ] Ensure Inner Dialogue export includes the full story context.

**Acceptance criteria**:
- Telegram and dashboard show the same story quality and reasons.
- Fixes in story-card generation improve every surface.

---

### TASK-066: Add source expansion and pruning workflow (IN PROGRESS)

<!-- paper-bot-editorial-status-2026-10-04:TASK-066:start -->
**Scoped source update (2026-10-04 22:22 UTC)**: IN PROGRESS — controlled free-source profiles prepared, not activated. Canonical Google AI RSS, enabled Mistral article index, dated Anthropic article extraction in both profiles, controlled DeepMind/Meta indexes, Google product-AI coverage and filtered free Verge/TechCrunch reporting added. Public OpenAI/Google/Verge/TechCrunch RSS reads succeeded; a 410 Microsoft feed was rejected rather than added.

**Collector safeguards**: timeout/HTTP checks, ETag/Last-Modified, bounded page cache, independent per-source transactions/failure reports, no generic-index fallback for empty/unavailable configured article indexes, actual article publication dates or explicit unknowns. A free feed is not a guarantee of useful yield or free downstream generation. Website layout/recall, owner source approval and measured production yield/pruning remain pending; broad X query expansion and new recurring sends are not authorized.
<!-- paper-bot-editorial-status-2026-10-04:TASK-066:end -->
**Priority**: P1
**Status**: IN PROGRESS
**Dependencies**: TASK-056, TASK-062

Make source curation systematic.

**Scope**:
- [ ] Weekly source-yield review report.
- [ ] Suggested source promotions/demotions.
- [ ] Add candidate-source queue for new accounts/repos/feeds.
- [ ] Trial newly discovered artifact-first sources: `@_akhaliq`, `@HuggingPapers`, `@AIatMeta`, `@TIIuae`, `@Thom_Wolf`, `@latent_space`, `@therundownai`, `@bentossell`, and low-priority `@liweiyi88`.
- [ ] Confirm high-volume curator sources only promote concrete launches with repo/docs/demo/HF/model/release evidence.
- [ ] Require measured trial period before broadening Apify/X queries.
- [ ] Cap spend per source/lane based on yield.

**Acceptance criteria**:
- The system expands toward high-yield sources and prunes low-yield noise.
- Cost grows only when quality yield justifies it.

### TASK-045: Evaluate Hermes or another agent sidecar (RESOLVED-NO 2026-05-18)
**Priority**: P0
**Status**: ✅ RESOLVED-NO — pipeline-as-agent is wrong abstraction for our shape
**Dependencies**: TASK-038

**Verdict (see `~/.claude/plans/2-hermes-agent-s-ethereal-journal.md`):** Don't swap Apify+structured pipeline for Hermes Agent-driven ingestion.

Three reasons, verified:
1. Hermes `x_search` returns Grok prose + citations, not structured tweet objects. Our pipeline depends on engagement, media, linked_urls, published_at, author_handle, external_id — none recoverable from prose without expensive re-extraction.
2. SuperGrok OAuth ≠ X API access. X pay-per-use 2026 = $5/1K tweets; Apify = $0.15/1K, actual recent spend $0.003/run. 30–300× cost gap.
3. Pipelines beat agent loops for structured ingestion (LangChain 2026 data; Gartner 40% project failure rate).

Where agentic *might* help later: per-item "deep brief" mode for top 1–2 items/day. Additive, not replacement. Tracked as future task only.

### TASK-036: Cross-source enrichment for story cards (IN PROGRESS)
**Priority**: P1
**Status**: IN PROGRESS
**Dependencies**: TASK-022

When building story cards for clustered items, pull concrete details from stronger cluster members to fill gaps in the primary item. An RSS item with an empty brief could be enriched by an X post about the same topic that has rich extracted content (linked context, important_changes, engagement data).

**Key design points**:
- Enrichment happens at story card generation time, not at clustering time
- For each story cluster, check all members for the strongest brief, important_changes, and linked context
- Primary source trust hierarchy: GitHub release > official changelog > RSS/blog > X post
- Content hierarchy: use primary source identity but pull details from whichever member has them
- Cross-source corroboration (2+ sources on same topic) should boost confidence

**Tasks**:
- [x] Add `best_brief_from_cluster(members)` helper in story.py (trust-ranked field selection)
- [x] Add `enrich_card_from_cluster(card, members)` — fills gaps + re-evaluates gate for missing_what/special/why
- [x] Merge enrichment data: brief fields from strongest member by trust then length
- [x] Wire into `generate_shortlist()` — enrichment before value gate check
- [x] Wire into `generate_story_report()` — cluster-best brief fills gaps in primary brief, image from any member
- [ ] Wire into `_serialize_item()` for dashboard parity (needs cluster member lookup)
- [x] Test with real items — imports OK, shortlist generation works, no regressions

---

### FEATURE-037: Active web enrichment for weak story cards (IN PROGRESS)
**Priority**: P2
**Status**: IN PROGRESS
**Dependencies**: TASK-036

When a story card still has weak fields after offline cluster enrichment (TASK-036), actively search the web for more context and fill the gaps. This turns the pipeline from passive (use what we collected) to active (go find what's missing).

**Trigger**: Story fails gate with `missing_special`/`missing_why` after cluster enrichment.

**Backend**: Brave Search API (free tier: 2000 queries/month) + Claude Haiku for LLM gap-fill.

**Key design points**:
- Only trigger for shortlist-quality items with rescuable gate reasons
- Budget cap: max 5 searches per shortlist run (configurable via `PAPER_BOT_WEB_ENRICH_MAX`)
- Cache results in `enrichment_json["web_enrichment"]` to avoid re-searching
- Results also patch the item's brief for dashboard parity
- Rate limiting: 1 req/sec on Brave free tier

**Tasks**:
- [x] Decide search backend — Brave Search API (free, fast, no new deps)
- [x] Add `can_web_enrich(card)` predicate in `web_enrich.py`
- [x] Implement `try_web_enrich(card, item)` with Brave search + LLM gap-fill
- [x] Wire into shortlist pipeline after `enrich_card_from_cluster`
- [x] Add cost/rate tracking and budget caps
- [x] Persist results in `enrichment_json` and patch brief for dashboard
- [x] Test imports, unit tests, and end-to-end pipeline
- [ ] Test with real weak items when they appear in the feed

---

### TASK-038: Fix upstream shortlist quality: relevance filtering + ranking (IN PROGRESS)

<!-- paper-bot-editorial-status-2026-10-04:TASK-038:start -->
**Current scoped status (2026-10-04 22:22 UTC)**: IN PROGRESS — isolated, tested, not deployed or owner-approved. Active project is Paper Bot v1 (AI/dev/product desk); v2 is dormant. Owner wants meaningful major AI-company/model announcements first, then practical creator/dev tools, fewer minor repos/roundups, and understandable wording without an audience/language/publishing-policy change. Read-only production observations show a delivered ten-project roundup (31682), undated Anthropic articles, a collected high-ranked Gemini model launch without briefing/delivery, and queue ordering that could bury strong older news behind newer noise.

**Prepared**: outcome-first sourced descriptions; material caveats; single-story gates; dated primary/attributed major-model priority before queue limits and after scoring; arbitrary future versions rather than frozen names; explicit announced/reported/rumor status after rewrite. Normal value, relevance, freshness, dedupe and media gates remain. Preserve old/stale evidence as fixtures, never re-send it as current news.

**Evidence and pending**: 437 offline tests (14 paid/live skipped), including 56 added editorial/news/cost/subscription regressions; 5/5 fixture checks, zero model calls/publishes. The exact owner WeKnora post remains short-link/date-unverified; current primary repo supports an authored review draft only. Owner wording/keep-drop acceptance and separately authorized deployment/current-source/provider checks remain pending. Original source/HANDOFF WIP preserved; registry identity remains unverified and was reported separately. See `/home/endlessblink/Documents/Codex/2026-10-04/task-19/OUTCOME.md`.
<!-- paper-bot-editorial-status-2026-10-04:TASK-038:end -->

**2026-10-05 scoped quality milestone:** separately approved six-file correction deployed at 19:24 UTC; broader 35-file editorial package remains inactive. Source/clarity holds and fixture passes do not establish recovered useful output. See [current quality deployment](QUALITY_DEPLOYMENT_2026-10-05.md).

**2026-10-11 owner rejection / scoped routing repair — IN PROGRESS:** owner still receives poor content and says nothing improved. Read-only actual Sent and database diagnosis reproduced generic score-only routes overriding failed story-worthiness decisions. Nine-line delivery amendment deployed on today's production snapshot, preserving its source checks/cooldowns; checksum-guarded one-file installation, backup and API-only restart/read-back succeeded. Actual 33364/33425/33517 now hold; 33452 remains eligible. 79 focused local checks and 51 production-snapshot checks passed, followed by an additional actual-card transport regression passing on both sources. Historical transport tests have baseline failures; no blanket green-suite claim. TASK-038/TASK-068/BUG-051 remain IN PROGRESS until fresh useful automatic flow, major-news coverage and owner acceptance. [Scope, proof and rollback](CONTENT_QUALITY_ROUTING_2026-10-11.md).

**Priority**: P0
**Status**: IN PROGRESS
**Dependencies**: TASK-036

Fix upstream shortlist quality so the Telegram bot pushes only items that make the user say "I need to try this."

**Done (2026-04-10/11):**
- [x] Add keyword-based `is_relevant()` filter at RSS ingest + shortlist time (blocks mRNA, robotics, MoE, game physics, CSP/iframe)
- [x] Reduce HuggingFace blanket boost from 40 to 20
- [x] Remove 8 false-positive `low_value_pattern` entries
- [x] Let "maybe" bucket items pass value gate
- [x] Block IBM/ServiceNow HF research papers
- [x] Exclude already-pushed items from shortlist generation
- [x] Add 5 Perplexity-optimized Apify discovery queries (oss-tool-launches, vibe-coded-demos, cc-cursor-features, oss-model-drops, practical-automation)
- [x] Add 5 new watchlist accounts (trq212, heygurisingh, om_patel5, everestchris6, 0x__tom)
- [x] Fix `filter:links` → `filter:media` on all Apify queries (was blocking video-only tweets)
- [x] Set all queries to `Latest` mode + `since:` date + `max_results:100`
- [x] Add LLM scorer (Haiku via Anthropic SDK) — rates items 1-10, threshold 7+
- [x] Calibrate scorer prompt with user's actual good examples (OpenMontage, /ultraplan, SVG-to-3D)
- [x] Fix value gate for X tweets: use tweet text only for `_is_obvious_low_value`, not expanded link body
- [x] Let viral tweets with media+100 likes pass without GitHub link (`x_viral_with_media`)
- [x] Kill generic "Local-first AI demo" template headline
- [x] Add `_derive_why` and `_derive_special` fallbacks for X items with links
- [x] Pass raw tweet text to LLM scorer (not just processed card fields)
- [x] Stop `quality_rewrite` from removing candidates (LLM scorer is final arbiter)
- [x] Brief generation falls back to Claude CLI when OpenRouter fails
- [x] Quality rewrite falls back to Claude CLI when OpenRouter fails
- [x] Switch LLM scorer from CLI subprocess to Anthropic SDK (was timing out)
- [x] Boost engagement weight 3x so viral tweets compete with source boosts

**Remaining — must fix before TASK-038 is done:**
- [ ] **BUG-039**: LLM scorer inconsistent in batch — OpenMontage scores 9 alone but <7 in pipeline batch
- [ ] **TASK-040**: Fetch tweet reply comments to extract "Link in the comments" URLs
- [ ] **TASK-041**: Pass video thumbnails from media_json to Telegram cards (image_url)
- [ ] **TASK-042**: Add pipeline tracing (trace_id per item, log keep/drop at each stage)
- [ ] **TASK-043**: Build test harness with 5 known-good tweets — all must score 7+ end-to-end

---

### BUG-039: LLM scorer inconsistent in batch mode (DONE 2026-04-12)
**Priority**: P0
**Status**: ✅ DONE
**Dependencies**: TASK-038

Root cause was that the scorer prompt presented pipeline-processed fields (headline, what_happened, why_it_matters) above the raw tweet text. Pipeline summaries — especially template text from `_derive_learning_angle()` like "Worth understanding how this fits into the current landscape" — diluted the signal, so Haiku judged on the generic summary instead of the punchy original tweet.

**Fix** (`src/paper_bot/pipeline/llm_scorer.py`): Restructured the prompt so the "ORIGINAL SOURCE" block (raw_text) now appears first and is explicitly labeled as the primary signal. Processed fields appear below as "Auto-generated context (supplementary, may be templated)". Added a direct instruction: "don't let bland summaries lower a score if the original source matches the 8-10 pattern." Also added debug logging so we can see exactly what text each candidate presents to the scorer.

**Verification**: All 5 known-good test candidates (TASK-043) score 7+ through the real Haiku call.

---

### TASK-040: Fetch tweet reply comments for "Link in the comments" URLs (DONE)
**Priority**: P1
**Status**: DONE (2026-04-12; historical completion 21c7f5e5, reconciled 2026-11-06)
**Dependencies**: TASK-038

Many viral AI tool tweets say "Link in the comments" instead of including the URL. The bot misses the GitHub/demo link because it's in the first reply, not the tweet text.

**Approach (from Perplexity research):**
- Use `scrape.badger/twitter-tweets-scraper` "Get Replies" mode with tweet ID
- Filter to `reply.username == original_author` (first self-reply has the link)
- Extract URLs from reply text
- Run after collection, before ranking — attach found URLs to item's `linked_urls_json`
- Budget: ~$0.20 per 1000 replies, trivial cost

**Tasks:**
- [ ] Add `fetch_author_replies(tweet_id, author)` function
- [ ] Wire into post-collection step for X/APIFY items without linked URLs
- [ ] Extract and attach URLs to item
- [ ] Test with OpenMontage tweet (link is in comments)

---

### TASK-041: Pass video thumbnails to Telegram cards (PLANNED)
**Priority**: P1
**Status**: PLANNED
**Dependencies**: TASK-038

X tweets with videos have `media_json[].preview_image_url` but the shortlist doesn't pass it through to the Telegram card. Cards show as text-only when they should have a visual.

**Tasks:**
- [ ] In `generate_shortlist`, extract `image_url` from primary item's `media_json`
- [ ] Prefer `preview_image_url` > `url` for video items
- [ ] Verify Telegram `send_photo` works with twitter CDN URLs
- [ ] Test with OpenMontage (has video thumbnail)

---

### TASK-042: Add pipeline tracing for debugging (PLANNED)
**Priority**: P2
**Status**: PLANNED
**Dependencies**: TASK-038

Items silently disappear between pipeline stages. Need per-item tracing to debug "cascading filter false negatives."

**Tasks:**
- [ ] Add `trace_id` to each candidate at story entry
- [ ] Log keep/drop decision + reason at each stage (relevance, gate, rewrite, noise, scorer)
- [ ] Add `debug_mode` flag that disables hard drops and collects everything
- [ ] Store dropped items with reasons for post-mortem analysis

---

### TASK-043: Test harness with known-good tweets (DONE 2026-04-12)
**Priority**: P0
**Status**: ✅ DONE
**Dependencies**: BUG-039

Created `tests/test_shortlist_quality.py` — an integration test that runs 5 known-good tweets through the real Haiku scorer and asserts each gets 7+. Each candidate dict mirrors what the shortlist pipeline produces: a clean `raw_text` with the original tweet plus deliberately templated processed fields (so the test catches prompt regressions that would let pipeline summaries dilute the score).

**Known-good items baked into the test:**
1. OpenMontage: open-source agentic video production, 11 pipelines, $0.69
2. Claude Code /ultraplan: build plans on web, run in terminal
3. SVG to 3D converter: vibe-coded, runs in browser
4. OpenClaw solar bot: finds warehouses, renders solar panels, books calls
5. Claude Code iOS testing: autonomous via accessibility tree

Test skips gracefully if no `ANTHROPIC_API_KEY` / Claude CLI OAuth credentials are available. Run: `python -m unittest tests.test_shortlist_quality -v`.

**Result**: 5/5 pass in 13s against real Haiku.

---

### TASK-044: Rewrite card body with real structure — kill hype, keep bullets (DONE 2026-04-12)
**Priority**: P0
**Status**: ✅ DONE
**Dependencies**: TASK-038

**Shipped** (see `docs/CARD_PIPELINE.md` for the full flow):
- New `src/paper_bot/pipeline/card_rewrite.py` — post-score LLM step that turns each survivor into a tight factual headline + bulleted `what_happened` + one-sentence `why_it_matters`. Regex-scrubs hype phrases ("groundbreaking", "mind-blowing", "this is the kind of X that actually matters", "seamless", "empowers", "unlocks" …).
- `src/paper_bot/telegram_bot/cards.py` — card renderer now prioritizes bulleted `what_happened` and appends one-sentence `why` beneath. Falls back to raw tweet (hype-stripped via `_strip_hype()`) when curated fields are empty/boilerplate/headline-duplicates.
- `src/paper_bot/settings.py` + `src/paper_bot/runtime.py` — diversity caps (`max_per_origin`, `max_x_items`, `max_per_category`) lifted out of the shortlist defaults and made configurable. Defaults raised from 1/3/3 → 3/7/3 so more scorer-passing items survive to Telegram.
- Verified on Graphify test case: renders as bulleted card with concrete command + 71.5% number + MIT mention instead of "Stop hemorrhaging money on redundant context" benefits-speak.

**Original problem** (from live Telegram feedback, 2026-04-12 night):
The fully local Manus alternative card (score 8) rendered as marketing-speak:
> "You can deploy a computer-use agent right now without API costs, rate limits, or data leaving your machine. Drop-in replacement for Manus/Claude Computer Use if you want full control and offline capab..."

The raw tweet had the good info as a bullet list (Python/Go/C/Java execution, voice input, multi-agent planning, 100% local) but also had hype ("this is the kind of open source that actually matters"). User's bar: **keep the specificity, drop the hype, preserve structure**.

**Problem** (from live Telegram feedback, 2026-04-12 night):
The fully local Manus alternative card (score 8) rendered as marketing-speak:
> "You can deploy a computer-use agent right now without API costs, rate limits, or data leaving your machine. Drop-in replacement for Manus/Claude Computer Use if you want full control and offline capab..."

The raw tweet had the good info as a bullet list (Python/Go/C/Java execution, voice input, multi-agent planning, 100% local) but also had hype ("this is the kind of open source that actually matters"). User's bar: **keep the specificity, drop the hype, preserve structure**.

**What's happening**:
1. `llm_scorer.py:74-77` lets the Haiku scoring response rewrite `headline`, `what_happened`, `why_it_matters` into the format its prompt demands: "1 concrete sentence" for `what_happened`. This flattens the original bullet list into a benefits-speak paragraph.
2. Raw tweets are not good enough either — they contain hype lines and engagement-bait.

**Approach**:
- Stop using the LLM **scorer's** rewrite for the card body. The scorer's job is to rate — not to write.
- Introduce a dedicated **card rewrite** step (separate from `quality_rewrite.py`) that takes both raw tweet + processed fields and produces a structured card:
  - Tight factual headline (no hype adjectives)
  - Bulleted `what_happened` — preserve concrete capabilities, numbers, stack names
  - One-sentence `why_it_matters` — what the reader can do/build with this
  - Strip phrases like "this is the kind of X that actually matters", "this shouldn't be free", "mind-blowing"
- Prompt must include the user's explicit style examples from `docs/EDITORIAL_PREFERENCES.md` + `feedback_no_hype` memory.

**Acceptance**:
- The Manus alternative card, re-rendered, keeps the bulleted capability list and drops the hype closing line
- Run against the 5 known-good candidates from TASK-043 — the card bodies must be structured (bullets or clearly-delimited sections), not paragraphs of benefits-speak
- User reviews 3 live pushes and confirms

---

### BUG-045: Briefing bottleneck blocks real-time Telegram push (IN PROGRESS)

**Priority**: P0
**Status**: IN PROGRESS
**Dependencies**: TASK-036

High-signal items (e.g. @berryxia's Claude Code Monitor tool tweet, 642 likes) sit in the DB for hours/days because the LLM briefing step is too slow. Items can't pass the value gate without `what_is_special`, and briefing via Claude CLI subprocess takes ~30s per item. With 100+ items queued, the interesting APIFY/X posts (scored 80-120) never get briefed because old Claude Code releases (scored 150+) eat the queue first.

**Gold standard**: a post like https://x.com/berryxia/status/2042365305469759942 should arrive in Telegram within 1 hour of collection.

**Root causes:**
1. Briefing uses `claude -p` subprocess — ~30s per item, serial, no batching
2. `get_unbriefed_shortlisted` sorts by score desc — old high-scoring items block fresh ones
3. Value gate requires `what_is_special` field which only exists after bilingual brief
4. Scheduler runs brief job on same interval as collection — can't keep up with volume

**Fix options (pick one or combine):**
- Switch to Anthropic API batch calls instead of CLI subprocess (~5x faster)
- Prioritize recent items over high-scored old ones in briefing queue
- Brief only items from last 24h, skip older backlog
- Run brief job more frequently or with larger batch size
- Consider skipping brief for items that already have enough content from RSS/GitHub (title + raw_text is often sufficient for the value gate)

**Acceptance check:**
- Fresh APIFY/X items with 100+ likes get briefed within 15 minutes of collection
- Telegram receives new cards within 1 hour of the original post
- Old backlog doesn't starve fresh items

---

### TASK-046: Add alert lanes and quiet digest routing (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-038, BUG-045

The system currently treats every shortlisted winner as if it belongs in the same push lane. This causes two bad outcomes: weak items get pushed just to avoid silence, and real urgent launches compete with digest-grade items.

**Goal**:
- Split delivery into `alert_now`, `digest_candidate`, and `drop`
- Keep urgent Telegram pushes rare and high-confidence
- Add a quiet digest lane for good-but-not-urgent or already-missed items

**Tasks**:
- [ ] Add lane field to shortlist/story output (`alert_now`, `digest_candidate`, `drop`)
- [ ] Define strict `alert_now` threshold: high importance, strong evidence, clear builder consequence, low ambiguity
- [ ] Route non-urgent winners into digest lane instead of pushing them immediately
- [ ] Add source-family balancing caps per lane so X/social items cannot flood urgent delivery
- [ ] Add a separate quiet digest send policy for missed but still good items

---

### TASK-047: Rewrite Telegram cards to summary + key points (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: TASK-038

The current card shape still reflects old `what happened / what is special / why it matters` sections. The user wants fast-read cards with one short summary and the most important bits, not rigid labels.

**Goal**:
- Render Telegram cards as: headline, one-sentence summary, 2-4 key points, source link
- Keep cards readable in 3-5 seconds
- Preserve images and media thumbnails when available

**Tasks**:
- [ ] Define canonical Telegram card schema: `headline`, `summary`, `key_points`, `source_links`, `image_url`
- [ ] Update the Telegram renderer to prefer summary + bullet points over labeled sections
- [ ] Generate key points from best brief / story card / report data without repeating the headline
- [ ] Add a renderer fallback that prefers a thin card over padded filler copy
- [ ] Disable or tighten flow fallback so Telegram sends nothing instead of sub-bar `maybe` cards when the queue is empty
- [ ] Verify cards render correctly with and without images on Telegram

---

### TASK-048: Add feedback-tuned keep/meh/drop learning loop (PLANNED)
**Priority**: P1
**Status**: PLANNED
**Dependencies**: TASK-038, TASK-042

The current feedback system is too binary. It needs to learn from `keep`, `meh`, and `drop` patterns so the feed gets better over time instead of only suppressing exact items.

**Goal**:
- Persist graded feedback from Telegram/dashboard review
- Learn pairwise ranking preferences from real user judgments
- Use repeated negative feedback to demote weak source and content patterns

**Tasks**:
- [ ] Store `keep`, `meh`, and `drop` as graded feedback labels
- [ ] Add pairwise training examples within a batch (`keep > meh > drop`)
- [x] Apply repeated negative feedback before briefing spend for exact URL/author/domain and lightweight lexical drop clusters
- [ ] Add source-pattern penalties from repeated negative feedback beyond author/domain blocking
- [ ] Keep a small exploration bucket for borderline items so the system can still discover new winners
- [ ] Add debug output showing which feedback weights changed a candidate's position

---

### TASK-049: Add Telegram outbox worker and resend policy (PLANNED)
**Priority**: P0
**Status**: PLANNED
**Dependencies**: BUG-045, TASK-012

Ranking and delivery are currently too tightly coupled. Recovery mode has already shown that a crude fallback sender can fix message flow while breaking card quality. Telegram delivery needs a durable outbox with proper retries, dedupe, and lane-aware resend policy.

**Goal**:
- Separate ranking from Telegram sending
- Queue rendered card payloads before send
- Support retries and dedupe without degrading content quality

**Tasks**:
- [ ] Add a durable Telegram outbox table/state machine (`pending`, `sending`, `sent`, `retry`, `dead`)
- [ ] Queue fully rendered card payloads before sending so recovery mode preserves card quality
- [ ] Add retry/backoff and rate-limit handling
- [ ] Use lane-aware dedupe: urgent alerts do not resend silently, digest can surface missed items separately
- [ ] Add health checks for pending backlog and oldest unsent urgent item age

---

### TASK-050: Add must-catch regression set for major launches (IN PROGRESS)

<!-- paper-bot-editorial-status-2026-10-04:TASK-050:start -->
**Scoped regression update (2026-10-04 22:22 UTC)**: IN PROGRESS. Added dated primary unseen-version, attributed upcoming-report, rumor, corporate/guide, unknown/stale date and spoofed-host regressions; a grounded major announcement beats a highly starred minor repo and survives the database LIMIT. Explicit report/announcement status remains visible after rewriting. Value rejection still precedes priority.

**Evidence/pending**: 437 offline tests with 14 paid/live skipped; source-backed actual owner/public examples and synthetic future-version boundaries are labelled separately. This proves tested ordering/control flow, not live recall or future discovery guarantees. Production source/provider replay and owner acceptance remain pending; legacy frozen social-watch queries are not fully rebuilt here.
<!-- paper-bot-editorial-status-2026-10-04:TASK-050:end -->
**Priority**: P0
**Status**: IN PROGRESS
**Dependencies**: TASK-038, TASK-043

Major launches like GPT-5.5 should never be buried again by generic survivors. The system needs a small gold set of must-catch wins and must-drop losers to prevent regressions when ranking or card-writing changes.

**Goal**:
- Lock in must-catch stories and must-drop anti-examples
- Fail ranking changes that hide big launches or reintroduce obvious junk

**Tasks**:
- [ ] Define a must-catch set of recent major launches and high-quality discoveries
- [ ] Define a must-drop set of weak survivors and common false positives
- [ ] Add regression checks for lane assignment, top-rank ordering, and Telegram card quality
- [ ] Include official major launches (OpenAI, Anthropic, Google, Meta, etc.) in the must-catch set
- [ ] Include frontier-model watch fixtures for specific release-window signals (Claude Mythos, GPT-5.6, Gemini 3.5 Pro) and exclude Apple/WWDC/Siri/iOS rumors from that lane
- [ ] Add one regression that proves a major launch beats weaker same-batch survivors

---

### BUG-051: Boilerplate brief text leaks into Telegram cards (IN PROGRESS)

<!-- paper-bot-editorial-status-2026-10-04:BUG-051:start -->
**Current scoped status (2026-10-04 22:22 UTC)**: IN PROGRESS — wording rules/source context and before-after references implemented only in the isolated copy. Exact owner WeKnora example and public production item 31344 explain the problem: RAG/RBAC/vendor counts or pivot/matte terms do not establish a useful outcome; stored link dumps are not explanations.

**Prepared**: common purpose/input/output-first rules across briefs and rewrites/post drafts; linked primary context and late material restrictions retained; no invented dates, scenarios, compatibility, savings, performance or security. Current WeKnora docs list Docker and Kubernetes, so the owner's Docker-only requirement must not be repeated as an exclusive verified condition. Upcoming/report labels survive final rendering.

**Verification/pending**: 437 offline tests with 14 paid/live skipped, 5/5 authored-reference fixture checks. No live model wording or owner acceptance measured. See isolated `docs/EDITORIAL_REVIEW_2026-10-04.md` and root `OWNER_REVIEW_EXAMPLES.md`. Production code unchanged; no test sends, paid calls, login changes, deployment or push. Keep IN PROGRESS until owner-reviewed production output proves the issue resolved.
<!-- paper-bot-editorial-status-2026-10-04:BUG-051:end -->

<!-- paper-bot-screenshot-formatting-2026-10-05:start -->
**Owner-approved formatting milestone — COMPLETE (2026-10-05 10:09:55 Asia/Jerusalem / 07:09:55 UTC)**: the owner directly approved the concrete two-file backup/deployment/API-health proposal. Installed only `src/paper_bot/telegram_bot/cards.py` and `src/paper_bot/telegram_bot/push.py` after matching both production baseline hashes and reconciling current services/configuration. Exact originals are in private `/opt/paper-bot/backups/formatting-two-files-20261005T070938Z/originals/`; original ownership/mode retained. Canonical local copies now match these deployed hashes, preserving HANDOFF, deploy.sh and other WIP.

**Actual behavior and evidence**: typed GitHub-discovery cards reuse the original repository description at display time, show a specific purpose headline plus visible summary, remove repeated/template metadata, retain uncertainty and show one direct source. Existing stored/queued items use the same repair without brief regeneration or a database migration. The 95/95 focused offline regressions passed before installation. Installed-host replay matches both exact owner examples (31807/31806, 243/322 visible characters), preserves announced/reported/rumor caveats, and verifies one current queued item (31808; 262 characters) with supported, balanced HTML and one source. These are render-only checks, not a Telegram-client acceptance test or re-send of historical messages.

**Service/preserved state**: only `paper-bot-api` restarted, PID 562541 -> 1106733; old PID exited, `/health` ok, bot ready, confirmed same-venv module origins and installed source hashes. Review PID 2716698 stayed active unchanged. Environment metadata and exact paid brief fallback=false, source profile hashes/roster, collection schedules/caps and dedicated subscription status (`not_signed_in`) match preflight. No test post, manual push, provider/model validation, source expansion, new recurring send, credential change, queue purge or 35-file deployment.

**Rollback/remaining**: restore only these two originals with saved UID/GID/mode after checking current hashes and concurrent edits, restart only the API and verify health. See [deployment evidence and rollback](FORMATTING_DEPLOYMENT_2026-10-05.md) and task-19 `formatting-deploy-result.json`, `formatting-canonical-sync-result.json`, `formatting-patch-manifest.json`. **BUG-051 remains IN PROGRESS**: selection relevance, fresh major-news coverage, useful story yield and owner acceptance are unresolved. The 35-file editorial package is still prepared only; its old push.py baseline must be reconciled with this deployed fix and retested before any later approval/install. Paid fallback stays off; dedicated sign-in/model compatibility and included-allowance billing checks remain pending.
<!-- paper-bot-screenshot-formatting-2026-10-05:end -->

<!-- paper-bot-syncso-quality-2026-10-05:start -->
**SyncSo follow-up — IN PROGRESS, historical pre-deployment diagnosis (2026-10-05)**: owner reports the post is still a mess after the narrow formatting deployment. Exact public item 31814 was published at 10:49:52 Asia/Jerusalem; deployed hashes match. Current readback rank is 111.251 with source-profile weight 61, engagement 16.504 and zero noise penalty. Capability substring `ci` matches `city`, granting false concrete-discovery credit; the collector's duplicate marketing description and metadata-only why pass length checks. Renderer republishes that description, derives a truncated title, and exposes provenance wording. Current item has been recollected; original pre-send rank/brief and dispatch trigger are not established by later already-published decision data.

**Reviewed correction, now deployed**: task-19 `paper-bot-quality.patch`, six runtime files / eleven review files, separate isolated copy `paper-bot-quality/`. Whole-word description capability checks; fresh source/clarity review before score/cache shortcuts and queue claiming; explicit operator-visible hold reasons; collections held; accepted useful briefs preserved; no provenance subtitle; no fabricated importance from stars/language. SyncSo's current ingested description holds as `repo_discovery_needs_source_context`; the README-backed New York-only/sign-in draft is an authored reference, not automatic output. Live Panel retains clear source-described input/output; WeKnora's authored ingested explanation is preserved. Historical official model-announcement fixtures retain their route and uncertainty; a held newer item does not starve a useful queued model story.

**Verification/limits**: final 225 discovered = 220 passed + 5 existing opt-in paid drift skips, zero errors/failures; 16 new quality regressions plus prior screenshot and existing ranking/delivery/GitHub/story/runtime/brief/Telegram suites. No original test method removed; two collector boilerplate assertions deliberately revised, previous screenshot expectations adapted. External/image transport blocked, providers/Telegram mocked, no model/live test call. Exact-byte logs, fixture/replay and review-time `git apply --check` in `quality-patch-manifest.json`, `quality-final-test-result.json`, `quality-preview.html`. Structural/source checks do not independently verify products or prove increased useful delivery volume. Unsupported source descriptions need ingestion/explanation rather than invented relevance.

**Owner-approved deployment (19:24:38 UTC / 22:24:38 Israel)**: six exact runtime files installed with private five-file backups and API-only restart; all protected source/configuration hashes, storage repair, local model-name correction and paid-off flags preserved. Combined 229 passed + 5 paid opt-in skips; 34 installed boundary checks passed. Entire 1,362-record catalog shadow assessment: 1,287 need source context / 25 collections / 50 clear descriptions; route totals include old/published records. Ten fresh discoveries: 9 fail quality; only fresh unpublished enriched/shortlisted candidate is held. No model call, thinking-control change, test post or broader 35-file activation. See [deployment evidence and rollback](QUALITY_DEPLOYMENT_2026-10-05.md). **BUG-051/TASK-038/TASK-068 remain IN PROGRESS**: generation still has 0 completed/19 failed in the latest ordinary cycle, actual useful flow/coverage/owner acceptance unproven. The broader package needs reconciliation with these current deployed files before any separate approval.
<!-- paper-bot-syncso-quality-2026-10-05:end -->


**Priority**: P0
**Status**: IN PROGRESS
**Dependencies**: TASK-036, TASK-038

Important items are still reaching Telegram with low-value filler such as `From an official primary source.` and `Worth checking if you follow this space.` Even when the ranking is correct, this makes the card feel low quality and generic.

**Goal**:
- Stop Telegram cards from shipping with boilerplate-only summary content
- Prefer one real summary plus key points over templated filler text

**Tasks**:
- [ ] Add a boilerplate phrase detector at card generation / Telegram render stage
- [ ] Block boilerplate-only summaries from urgent delivery
- [ ] Prefer enriched summary/key-point text over generic brief fallback
- [ ] Make brief generation read linked artifacts and state what the artifact does, why it matters, and what can be built with it, instead of emitting meta-filler about evidence quality
- [ ] Add regression tests for important items whose current briefs are too generic
- [ ] Verify important official launches render with concrete content instead of template language

---

### TASK-030: Deploy paper-bot stack to VPS (PLANNED)
**Priority**: P1
**Status**: PLANNED
**Dependencies**: TASK-029

Deploy the full paper-bot stack (FastAPI backend + review app) to Contabo VPS and serve via Caddy at `signal.in-theflow.com`.

**Tasks**:
- [ ] rsync project to VPS `/opt/paper-bot/`
- [ ] Create Python 3.12 venv and install deps
- [ ] Copy `.env` with API tokens (Apify, GitHub, Discord)
- [ ] Create systemd service: `paper-bot-api` (uvicorn on port 8001)
- [ ] Create systemd service: `paper-bot-review` (node on port 3110)
- [ ] Add Caddy config: `signal.in-theflow.com` -> `localhost:3110`
- [ ] Add Cloudflare DNS A record for `signal.in-theflow.com`
- [ ] Verify PWA install on phone
- [ ] Verify pipeline runs (sync, web, X, rank, briefs) work remotely

**Notes**:
- Port 3100 is occupied by Homepage container; using 3110 instead
- Caddy uses Cloudflare origin TLS certs at `/etc/caddy/certs/`
- Python 3.12 and Node v20 already installed on VPS
- Ports 8001 and 3150 confirmed free

## Completed

### ~~TASK-008~~: Add publish outputs and feed endpoints (✅ DONE)
**Priority**: P2
**Status**: ✅ DONE (2026-03-19)

Expose ranked items through at least one practical delivery channel and one machine-readable feed.

**Tasks**:
- [x] Add Discord webhook publisher or equivalent
- [x] Add JSON or RSS feed endpoint
- [x] Track publish state to avoid duplicate notifications
- [x] Support top-N or threshold-based publishing

### ~~TASK-005~~: Build GitHub releases and activity collector (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-03-19)

Use the official GitHub API to ingest releases and selected repo or org activity from curated sources.

**Tasks**:
- [x] Support watched repositories and organizations
- [x] Ingest releases and selected event/activity endpoints
- [x] Normalize GitHub objects into the shared item format
- [x] Reuse dedupe and ranking pipeline

### ~~TASK-011~~: Define curated source watchlists and seeds (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-03-19)

Create the initial curated list of X accounts, Discord channels, GitHub repos, and websites that the bot will monitor.

**Tasks**:
- [x] Define source config format
- [x] Add initial seed lists for high-signal AI builders and tools
- [x] Separate trusted primary sources from exploratory sources
- [x] Document how sources are reviewed and added

### ~~TASK-010~~: Add config, scheduling, and runtime wiring (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-03-19)

Wire the collectors and pipeline together into a runnable service with clean configuration and schedules.

**Tasks**:
- [x] Add settings model for sources, API keys, and intervals
- [x] Add APScheduler jobs for each collector
- [x] Implement pipeline orchestration entrypoints
- [x] Expose health and runtime status endpoints

### ~~TASK-004~~: Implement rule-based ranking engine (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-03-19)

Build an LLM-free ranking stage for source trust, author quality, keyword relevance, evidence, and freshness.

**Tasks**:
- [x] Define score inputs and weights
- [x] Implement initial scoring function
- [x] Add configurable source and author boosts
- [x] Persist rank scores and shortlist status

### ~~TASK-002~~: Build RSS and website collector (✅ DONE)
**Priority**: P0
**Status**: ✅ DONE (2026-03-19)

Implement the first low-cost collector using RSS feeds and lightweight website polling to validate the core pipeline.

**Tasks**:
- [x] Add RSS fetch and parse flow with feedparser
- [x] Add basic HTML fetch/extract fallback for no-RSS sources
- [x] Normalize entries into the shared item shape
- [x] Persist collected raw items for downstream stages

### ~~TASK-003~~: Add normalization and dedupe pipeline (✅ DONE)
**Priority**: P0
**Status**: ✅ DONE (2026-03-19)

Implement shared normalization and duplicate suppression so all collectors feed one consistent internal schema.

**Tasks**:
- [x] Define the canonical normalized item structure
- [x] Add URL canonicalization and content fingerprinting
- [x] Deduplicate by canonical URL and text fingerprint
- [x] Add tests or fixtures for common duplicate cases

### ~~TASK-001~~: Implement storage schema and repositories (✅ DONE)
**Priority**: P0
**Status**: ✅ DONE (2026-03-19)

Create the v1 persistence layer for normalized source items, fingerprints, ranking results, and source configuration.

**Tasks**:
- [x] Define SQLAlchemy models for items, sources, fingerprints, and publish state
- [x] Add SQLite engine and session setup
- [x] Create repository helpers for inserts, upserts, and recent-item lookups
- [x] Prepare simple migration/bootstrap flow for local development

### TASK-006: Build Discord announcement collector (PLANNED)
**Priority**: P1
**Status**: PLANNED (2026-03-19)

Add a Discord bot-based collector for selected announcement channels and high-signal server updates.

**Tasks**:
- [ ] Define channel allowlist configuration
- [ ] Ingest messages from selected channels
- [ ] Normalize message content, embeds, and links
- [ ] Forward items through dedupe and ranking

### ~~TASK-007~~: Build X watchlist collector abstraction (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-04-04)
**Dependencies**: TASK-001, TASK-003

**Tasks**:
- [x] Define provider interface for X collection
- [x] Support curated account watchlists instead of broad keyword search
- [x] Normalize posts, repost context, links, and engagement snapshots
- [x] Add budget-aware fetch limits and polling windows

### TASK-009: Add optional LLM enrichment stage (✅ DONE)
**Priority**: P2
**Status**: ✅ DONE (2026-04-04)

Implement a bounded enrichment stage that only runs on shortlisted items after rule-based ranking.

**Tasks**:
- [x] Define enrichment request and response schema
- [x] Extract summary, category, entities, and novelty score
- [x] Add batch processing for low token cost
- [x] Make enrichment fully optional in configuration

**Notes**:
Added category (8 types) and novelty_score (1-5) to LLM brief. Set ItemStatus.ENRICHED after enrichment. Added PAPER_BOT_ENRICHMENT_ENABLED flag.

### TASK-012: Add observability, health checks, and error handling (PLANNED)
**Priority**: P2
**Status**: PLANNED (2026-03-19)

Add the minimum operational guardrails needed to run the bot continuously on the VPS.

**Tasks**:
- [ ] Add structured logging for collectors and pipeline stages
- [ ] Track fetch failures and retry counts
- [ ] Add health probes and basic metrics
- [ ] Capture last-success timestamps per connector

### ~~TASK-013~~: Add changelog and release-note source lane (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-04-04)

Add changelog-oriented sources for major AI/dev/product tools so the system can pair social signals with official product evidence.

**Tasks**:
- [x] Add source definitions for changelogs and release-note pages
- [x] Prioritize high-value sources such as Claude Code, Cursor, ElevenLabs, Midjourney, Ideogram, Hugging Face, and similar product surfaces
- [x] Normalize changelog entries into the shared schema
- [x] Tag changelog items so they can be used as story evidence
- [x] Add `https://code.claude.com/docs/en/changelog` as a preferred early changelog source
- [x] Add `https://developers.openai.com/codex/changelog` as a preferred early changelog source
- [x] Add `https://kling.ai/release-note/release-history` as a preferred release-note source

### ~~TASK-026~~: Add persistent source matrix and repo watchlist workflow (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-03-29)

Persist high-quality source discovery outside chat so strong blogs, changelogs, social sources, and repos can be curated over time.

**Tasks**:
- [x] Add `docs/SOURCE_MATRIX.md`
- [x] Add `docs/REPO_WATCHLIST.md`
- [x] Record known preferred sources from recent editorial feedback
- [x] Update editorial preferences to explicitly support repo-based discovery

### ~~TASK-014~~: Collapse X threads into story candidates (✅ DONE)
**Priority**: P0
**Status**: ✅ DONE (2026-04-04)

Stop ranking raw tweets directly and collapse related tweets into one story candidate per thread/conversation.

**Tasks**:
- [x] Group posts by conversation or parent signal
- [x] Keep only the strongest representative tweet per thread
- [x] Absorb link crumbs and CTA endings into the parent thread
- [x] Persist thread/story candidate metadata for downstream ranking

### TASK-015: Add author diversity caps and shortlist balancing (DONE)
**Priority**: P0
**Status**: DONE (2026-04-03; historical completion e0c3f4ce, reconciled 2026-11-06)

Prevent one author or one thread from dominating the shortlist.

**Tasks**:
- [ ] Cap the number of shortlisted items per author
- [ ] Cap the number of shortlisted items per conversation
- [ ] Add simple diversity balancing by source/topic
- [ ] Re-rank shortlist output after balancing

### ~~TASK-016~~: Build cross-source story clustering (✅ DONE)
**Priority**: P0
**Status**: ✅ DONE (2026-04-04)

Merge tweets, changelog entries, blog posts, GitHub releases, and other evidence into one story object.

**Tasks**:
- [x] Define canonical story schema
- [x] Cluster related source items into one story
- [x] Attach evidence links and related source links
- [x] Store story-level relevance and novelty scores

**Notes**:
Implemented union-find clustering: Tier 1 = URL overlap, Tier 2 = 2+ shared tags within 48h. Story/StoryMember DB models, StoryRepository, /cluster endpoint.

### TASK-017: Add learning-oriented story report generation (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-04-04)

Generate a report that helps the user understand what happened and why it matters, not just see ranked links.

**Tasks**:
- [x] Create report schema with headline, what happened, why it matters, and evidence
- [x] Generate markdown reports from story objects
- [x] Add a rolling daily learning shortlist view
- [x] Support explanation-oriented summaries over raw source snippets

**Notes**:
Added pipeline/report.py with story report renderer. /stories and /report endpoints. Learning-oriented summaries with evidence links.

### TASK-018: Add style-based writing transformation layer (PLANNED)
**Priority**: P1
**Status**: PLANNED (2026-03-29)

Allow the user to transform selected stories into publishing-ready text in their own style.

**Tasks**:
- [ ] Define input/output schema for style transformation
- [ ] Support tweet, thread, LinkedIn, newsletter, and digest output formats
- [ ] Add user writing-style examples or profiles
- [ ] Keep generation separate from discovery and ranking

### ~~TASK-019~~: Score watchlist accounts by actual output quality (✅ DONE)
**Priority**: P0
**Status**: ✅ DONE (2026-04-04)

Measure which accounts on the X watchlist are actually producing relevant results for this feed, instead of relying only on profile-level review.

**Tasks**:
- [x] Run watchlist-based X collection from the current curated accounts
- [x] Attribute collected items back to their source accounts
- [x] Score accounts by relevance, signal density, and shortlist hit rate
- [x] Export an account-quality report showing strong, weak, and noisy sources

**Notes**:
72% of watchlist accounts have never been collected — the report tool now distinguishes 'Never collected' from 'Weak' to guide collection expansion.

### ~~TASK-020~~: Prune watchlist aggressively from measured output (✅ DONE)
**Priority**: P0
**Status**: ✅ DONE (2026-04-04)

Use measured output quality to remove weak watchlist accounts and keep the source set tight.

**Tasks**:
- [x] Define pruning rules for low-signal, noisy, or repetitive accounts
- [x] Remove accounts that fail to produce relevant shortlisted items
- [x] Split remaining accounts into core and selective watch groups
- [x] Update watchlist documentation after pruning

**Notes**:
Pruned 6 accounts to low, demoted 2 to medium, promoted GoogleDeepMind to high. 72% of accounts had no collection data yet.

### TASK-021: Re-review edge-case accounts from recent posts (PLANNED)
**Priority**: P1
**Status**: PLANNED (2026-03-29)

Re-evaluate borderline accounts from their actual recent posts rather than bio/network guesses.

**Tasks**:
- [ ] Build a lightweight recent-post review workflow for single-account checks
- [ ] Re-review disputed accounts such as `101babich`
- [ ] Promote, demote, or reject edge-case accounts based on recent post quality
- [ ] Record reasoning back into watchlist or review docs

### TASK-022: Generate a 10-item post-worthy shortlist with clear selection reasons (✅ DONE)
**Priority**: P0
**Status**: ✅ DONE (2026-04-04)

Replace tweet browsing with a compact shortlist of 10 items that are actually useful for learning or turning into posts.

**Tasks**:
- [x] Select only items that clear a minimum bar for novelty, relevance, and substance
- [x] Present each item as `headline`, `what happened`, `why it matters`, `what you can learn`, and `why it was selected`
- [x] Hide raw tweet text behind source links instead of making it the primary content
- [x] Export the shortlist as a markdown report that is easy to scan and reuse

**Notes**:
Shortlist generator with category diversity caps (max 3/category), min score filtering, and markdown export. /shortlist and /shortlist/markdown endpoints.

### TASK-023: Apply manual review verdicts to shortlist visibility immediately (DONE)
**Priority**: P0
**Status**: DONE (2026-04-03; historical completion e0c3f4ce, reconciled 2026-11-06)

Respect the user's review decisions by removing bad items from the main shortlist as soon as they are marked.

**Tasks**:
- [ ] Treat negative manual verdicts as immediate exclusion from the default shortlist view
- [ ] Keep dropped items accessible only in a secondary review/history view
- [ ] Recompute shortlist counts and rankings after manual removal
- [ ] Make exports and reports honor manual review exclusions by default
- [ ] Update the dashboard state immediately after save so bad items disappear without a manual refresh

### ~~TASK-024~~: Show images and video thumbnails for shortlisted items (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-03-29)

Improve shortlist readability by showing useful media directly in the UI when the source item includes it.

**Tasks**:
- [x] Extract the best available image or video thumbnail from source media metadata
- [x] Show media previews in the shortlist and detail panes
- [x] Make thumbnails clickable to view full-size or open source media
- [x] Prefer meaningful product images, screenshots, or video thumbs over decorative media

### TASK-025: Render product updates as version-centric change summaries (PLANNED)
**Priority**: P1
**Status**: PLANNED (2026-03-29)

When the source item is a release, version bump, or changelog-style update, render it as a clean summary of the important changes in that version.

**Tasks**:
- [ ] Detect release/version/update items and treat them differently from normal story posts
- [ ] Aggregate multiple source mentions into one version-level item when possible
- [ ] Show only the most important changes in that version
- [ ] Explain why those changes matter instead of surfacing raw release text

### ~~TASK-027~~: Add thread-and-link expansion for X and source-backed story ingestion (✅ DONE)
**Priority**: P0
**Status**: ✅ DONE (2026-04-04)

For strong X items, ingest the linked page, repo, changelog, docs, or demo and relevant thread context before building the story summary.

**Tasks**:
- [x] Expand X items through first-party links such as repos, docs, changelogs, product pages, and demos
- [x] Read thread context when the main claim depends on surrounding posts
- [x] Read same-conversation replies/comments when they change the meaning of the main post
- [x] Prefer linked-source facts over tweet-shell paraphrases when building summaries
- [x] Use thread context + linked artifacts when generating `Turn into post` drafts
- [x] Hide or demote X items whose linked evidence cannot be ingested

**Notes**:
Link expansion pipeline was 90% done. Added has_linked_evidence flag, extended score_link_candidate patterns, verified post-draft reads enrichment.brief.

### ~~TASK-028~~: UI/UX overhaul + Posted/Archive lifecycle + feedback system (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-04-03)

Comprehensive Signal Deck UI/UX improvements and new review lifecycle features.

**Tasks**:
- [x] Fix WCAG contrast issues, button hover states, score tier visualization
- [x] Add colored left borders to brief cards per section type
- [x] Add section feedback chips (always visible) for all brief cards
- [x] Add title and image feedback chips
- [x] Add Posted/Archive lifecycle for kept items
- [x] Add dedicated Archive tab with restore/delete actions
- [x] Persist flag and chip selections across item switches
- [x] Auto-snapshot flags before switching items/tabs
- [x] Instant tab switching with prefetch cache
- [x] Ctrl+Click multi-select with auto-exit
- [x] Undo toast for keyboard verdict shortcuts
- [x] Improve Hebrew post generation prompt with two-phase angle selection
- [x] Add "Not interesting" and "Too niche" drop reason chips
- [x] Video support in detail media player

### ~~TASK-031~~: Wire X_WATCHLIST.md into Apify collector config (✅ DONE)
**Priority**: P0
**Status**: ✅ DONE (2026-04-04)
**Dependencies**: TASK-007

XCollector reads X_WATCHLIST.md directly at runtime via watchlist.py integration.
No manual sync tool needed — handles are loaded, filtered by priority, and built into queries automatically.

### ~~TASK-070~~: Add GitHub repo discovery lanes (topic + keyword search) (✅ DONE)
**Priority**: P1
**Status**: ✅ DONE (2026-06-17)
**Dependencies**: TASK-052

Closed the gap where repos could only enter the pipeline via a watched X post or a
hardcoded release allowlist (origin: `diffusionstudio/lottie` was missed). Added two
GitHub Search API discovery lanes that flow through the normal relevance → rank →
brief → push gates:

- `github-discovery-agent-repos` — topic lane (`topic:llm/ai-agents/mcp/rag/...`),
  repos **created** in the last 120 days with >=150 stars.
- `github-discovery-ai-builders` — keyword lane (`<kw> in:name,description,readme`),
  repos **created** in the last 21 days with >=200 stars; catches AI-builder repos
  that carry **no GitHub topics** (lottie's only signal is its description).

**Implementation**:
- [x] `GitHubCollector.collect_search_repos` / `collect_search_queries` / `_repo_to_item` / `_build_repo_brief`; `persist_source` dispatches `search_topics` / `search_keywords`
- [x] Created-date window (not pushed) so new breakouts surface and mega-repos are excluded; each topic/keyword its own query (GitHub rejects OR-ed qualifiers), merged + deduped
- [x] Fix startup crash-loop: `SourceSeed` now accepts + forwards the `search_*` config keys (regression test round-trips the shipped config)
- [x] Resilience: a rate-limited (403) / bad (422) query is logged-and-skipped, not fatal to the whole GitHub lane
- [x] Throttle (~2s) between search queries to stay under GitHub's secondary rate limit
- [x] Deployed to prod; verified end-to-end — discovery repos ranked, briefed, and delivered to Telegram

<!-- Done tasks are moved here with strikethrough: ### ~~TASK-XXX~~: Title (✅ DONE) -->


## 2026-10-05 — Registry check before local deployment

Local `deploy.sh` now automatically checks workflow `paper-bot`, the actual script checkout and the VPS release host/path before rsync/SSH. The checked checkout is the transfer source even if invoked from another cwd. `--preflight-only` checks without transfer, deployment or restart. Offline failure/stub-transfer checks passed; production deployment remains outside this change. Existing reports/archive exclusions and all active-service/identity/onboarding evidence were preserved. Fleet coverage and rollback: sibling bots-directory/ENFORCEMENT_COVERAGE.md.

<!-- paper-bot-claude-release-summary-2026-10-06:start -->
**Owner release-summary feedback — IN PROGRESS (2026-10-06):** exact published item 32032 maps to Claude Code v2.1.290, not a new generic approval feature. Current story keyword templates reproduce the complained title/summary/bullets from a late permission-fix line; headless defer existed in v2.1.89. Prepared separate new release_summary.py + story.py amendment with no six-file recovery overlap. Reads actual versioned release bullets, preserves Added/Fixed and conditions, selects concrete changes instead of benefit padding; 270 combined tests passed +5 paid skips, two exact baseline failures. No deployment/canonical mutation/re-send/model call/restart; documentation records staged for coordinator merge because deployment is concurrent. Existing stored briefs and live acceptance remain unresolved. [Exact source, replacement draft and compatible patch](CLAUDE_CODE_RELEASE_REVIEW_2026-10-06.md). TASK-038/BUG-051/TASK-068 remain IN PROGRESS.
<!-- paper-bot-claude-release-summary-2026-10-06:end -->


## 2026-10-06 — Local content integration and acceptance evidence

IN PROGRESS: hash-guarded canonical release/content amendments integrated;19actual public sources reviewed,3new defects reproduced and fixed,279passed+5paid skips. Official d1/Coucou positive cases expose missing primary context and generator completion; three bilingual authored references have concrete changes and limits. No production activation or live-quality recovery is claimed; prior six recovery runtime files remain prepared unchanged and the deployment rejection remains binding. See [content acceptance evidence](CONTENT_QUALITY_INTEGRATION_2026-10-06.md) and task-4 combined source handoff. Keep TASK-025/TASK-038/TASK-068/BUG-051 IN PROGRESS pending ordinary useful publications and owner acceptance.


## 2026-10-06 — Read-only activation and further editorial validation

At13:58UTC all nine source hashes match canonical/VPS, API1801629/review2716698 active, paid off; last stored public-source send13:09UTC. The supplied handoff is now installed; the execution actor was not independently verified. This worker did not activate/retry anything. Delivery resumed but three actual public cards show event-status/wording/Hebrew gaps. Isolated source-excerpt follow-up:3new baseline failures,39serial offline passes, late availability/benchmark/pairing conditions retained within3500chars; no live/runtime mutation. See [independent follow-up](EDITORIAL_FOLLOWUP_STATUS_2026-10-06.md). TASK-025/TASK-038/TASK-068/BUG-051 remain IN PROGRESS pending useful flow, source coverage and owner acceptance. Earlier pending-deployment notes are dated history, not current activation state.


## 2026-10-06 — BMAD source identity and concise useful copy

Owner BMAD feedback traced to public32119: repo context, book-first displayed source, unsupported "was released"; actual send11:16UTC, not fresh software-launch evidence. Existing parser/bounded grounding pass did not check that contract. Four-runtime-file isolated combined follow-up includes prior late-source-condition amendment;17new regressions/13baseline failures,74focused serial offline passes. Another eligible story proceeds; the compact authored discovery reference was subsequently rejected by the owner and its missing-significance acceptance has been withdrawn (see the follow-up below). No canonical runtime/production changes or denied deployment retry; scoped editorial docs persist the feedback. See [BMAD review and exact handoff](BMAD_SOURCE_IDENTITY_REVIEW_2026-10-06.md). Broader transport harness runs bounded at20seconds; no full-suite or live quality acceptance claimed. TASK-025/TASK-038/TASK-068/BUG-051 remain IN PROGRESS.


## 2026-10-06 — Supported significance and Hebrew publication by default

IN PROGRESS: owner rejected the compact BMAD reference and requires a clear explanation of the actual artifact plus a supported practical reason to care; unsupported significance must not send. All normal posts/cards now require complete natural Hebrew ready to share. Thirteen runtime/UI-file replacement prepared in isolation, including prior source identity/excerpt fixes; seven test/fixture files, 81 focused offline passes. Missing Hebrew returns eligible unpublished items to existing free generation within unchanged retry/age/budget caps; published/exhausted items are excluded. English-only fast briefs reach mocked generation to obtain Hebrew. Canonical changes are scoped editorial documents only; runtime and production unchanged, denied deployment not retried, paid routes off. Earlier compact patch/reference acceptance superseded. See [review and exact handoff](EDITORIAL_SIGNIFICANCE_HEBREW_FOLLOWUP_2026-10-06.md). TASK-025/TASK-038/TASK-068/BUG-051 remain IN PROGRESS pending ordinary useful Hebrew flow and owner acceptance; a filled significance field or Hebrew-letter check is not semantic/grammar validation.


## 2026-10-09 — Missed creative launches / weak selections (local investigation, nothing deployed)

PREPARED + TESTED LOCALLY (not installed): `pipeline/event_gate.py`, optional hook in `route_item_for_delivery` (off unless `PAPER_BOT_EVENT_GATE=on`), `tests/test_event_gate.py` (21 offline tests), three disabled product-page sources (`page-magnific-one`, `page-voyager`, `page-higgsfield`). Full suite 579 passed, 7 skipped, 1 pre-existing date failure (`test_held_brief_does_not_starve_a_good_model_announcement`).

Reconciliation: task-15 package vs repo: 55 of 57 runtime files identical; `brief.py` (Codex/Hebrew gate merge) and `rank.py` (free-offer scoring) differ on purpose. The old "24/25 match, 146 tests" claim does not cover today's `brief.py`.

Verified causes (from code, not from live data):
1. Delivery routes on score alone (`delivery.py`): >=75 sends, whatever the story is. Nothing requires a concrete new event, a primary source or audience value before drafting.
2. The approved-handle lane sends at score >=40 (`mercury__agent` is in the list), so a generic recap from a trusted handle passes.
3. Freshness uses the post date (`published_at`, else `discovered_at`) at 1 point per 24h; an old launch discussed today looks new. The model has no event date; `_is_too_old` (72h) also uses the post date.
4. No source covers creative-tool product pages: sources.json has no Magnific, Voyager, Claude Motion or Katana page; Higgsfield appears only inside the free-offer X query. The 2026-05-28 audit already named creative accounts as discovery gaps.
5. Contradictory release status ("available" plus "not yet released") is only checked for repo items.
6. Leaks/rumours are not rejected outright; they rely on score penalties.
Dedup/cluster is not shown to cause these misses; they happen at discovery (no source) and selection (score only). Padding with weak items is already disabled (push.py), so an empty edition is allowed.

Real post text for Ely Office, Xona, IDAssist, Incognitive, Mercury, Astra and CVP is not in the local databases (newest local data 2026-05-30), so no per-item claim is made; tests use shape fixtures built from the owner's labels.

Dates: event dates for Voyager (voyager.so), Magnific One, Claude Motion and Katana could NOT be verified by web search (results were the older Tencent HunyuanWorld-Voyager project, generic Magnific history, nothing for Claude Motion or Katana). The gate leaves the event date empty and reports `event_date_unverified`; it never infers one.

Latency: the gate reports publication-to-discovery hours per item. Verification and delivery latency need live timestamps; not measured offline.

BACKLOG:
- Record the event date from the fetched product page (connector change; not done).
- Add a Claude Motion source once an official URL is confirmed.
- Store the gate result in the enrichment record so the dashboard shows the reason.
- Measure real publication→discovery→delivery latency after approval.
- Fix the date-dependent fixture in `test_held_brief_does_not_starve_a_good_model_announcement`.

Activation plan (needs owner approval): 1) install `event_gate.py`, `delivery.py` and the 3 sources with backups and rollback; 2) enable sources one at a time; 3) set `PAPER_BOT_EVENT_GATE=on` only after a dry run over stored items shows no known good card is lost. Rollback: unset the flag or restore the backed-up files.


## 2026-10-09 (later) — Qwen-Image-2.1-Turbo, Hugging Face index, general policy (local, nothing deployed)

Tested revision: working tree on branch `chore/watchpost-bot-manifest` on top of a7e63e9, uncommitted; full suite 590 passed, 7 skipped, 1 pre-existing date failure. Not committed, not deployed.

Qwen-Image-2.1-Turbo (official GitHub News + model card + LICENSE, fetched 2026-10-09): Turbo weights and Pro/Turbo APIs dated 2026.10.09, 8 denoising steps; base Qwen-Image-2.1 dated 2026.09.20 (a distinct event). License is the Qwen Research License: non-commercial (research/evaluation) only; commercial use needs a separate license. No speedup, Hebrew quality or hardware figures are claimed anywhere.
Actual cause, by replaying the real code on an item built from the official text (production IDs/timestamps NOT obtained: no production read was made, and local databases end 2026-05-30, so no record IDs exist to cite):
1. Collection: no source watches the Qwen model hub or the QwenLM repo; Alibaba_Qwen appears only in the free-offer X query. Source-coverage gap (not inferred from scoring).
2. Ranking (first code stage that rejects it, reproduced): the name "Qwen-Image-2.1-Turbo" plus the word "released" matched the version-bump changelog rule, which subtracts 55 points: score -27 / -14.5. Fixed: model-hub pages and weights/checkpoint/API-live text are not changelogs; score is now +46.
3. Routing: even at 46 the item sat below every send bar (75; 55 hold), because a day-old official release has no engagement. Fixed behind the flag by a "verified primary release" route (score >=40 plus event gate).
4. Deduplication: GitHub items from one repo, and any items sharing an evidence URL, were merged regardless of date (cluster tiers 0/1) and delivery's duplicate check treated a shared repo URL as the same story. Both now use a 7-day event window, so Turbo (19 days after the base release) is a separate event while same-launch reposts still merge.
Canonicalization and fingerprints were fine (they differ for the two events); the URL fragment "#news" is stripped by design.

Hugging Face Papers index: the exact message text was not supplied; fixture is a shape from the owner's description. Cause: nothing distinguished an evergreen index from news; any of its text with a release-like word could score. Now index/directory URLs or copy with no specific item evidence are rejected (`evergreen_index_or_directory`, `no_material_change`); a specific paper page with its own evidence passes, and other Hugging Face content is not blocked.

Held-out evaluation (scripts/eval_saved_inputs.py; saved results data/eval/baseline_before.json and after.json; same 58 saved inputs: 56 owner-labelled items from the local April database + 2 official Qwen events): flag off, before and after: 19 sent, 3 relevant sent, 16 irrelevant sends, 4 missed relevant. Flag on: before 10 sent / 3 relevant / 7 irrelevant / 4 missed; after 12 sent / 5 relevant / 7 irrelevant / 2 missed. The gate removed 9 of 16 irrelevant sends without losing any relevant send. Caveats: only 7 keep-labelled items, from April and mostly dev tools, so this does not prove creative-tool generalization; the two Qwen items are tuning examples; duplicates and unsupported claims were not measurable offline; publication-to-delivery delay needs live timestamps (stored publish dates are day-granular, so the numbers are not meaningful). Still missed with the gate on: an OpenClaw/Plano proxy post and one untitled keep item. Still sent with the gate on (irrelevant per owner): the newsletter, two datasette alpha releases, Python Vulnerability Lookup, Firecrawl landing page, two Claude product-update items.

Installed pipeline vs candidate (read-only hash check of five files on the VPS): server `rank.py`, `delivery.py`, `cluster.py`, `push.py` differ from the candidate and `event_gate.py` is absent; so everything in this candidate is inactive in production: event gate and its flag, the Qwen ranking fix, event-window clustering and delivery duplicate check, the primary-release route, the three disabled product-page sources.

Coverage gaps (unchanged): no org-level Hugging Face / GitHub new-model watch for unfamiliar vendors (proposal: public Hugging Face model list sorted by creation, filtered by likes and creative/AI tags, change-detected, inside existing Apify/fetch budget); X coverage is query-based and not comprehensive; access failures are not recorded per source offline. Schedule: a verified primary release can bypass the digest only if the existing push tick (10 min) is allowed to send it; no schedule change is proposed.

Staged activation (needs approval): 1) install the five changed files + `event_gate.py` with backups and rollback.sh, flag off; 2) run the evaluation on server-side stored items read-only and compare; 3) turn on `PAPER_BOT_EVENT_GATE=on`; 4) enable the new sources one at a time. Rollback: unset the flag, then restore backups.


## 2026-10-09 (final) — Generalized policy, independent held-out evaluation (local, nothing deployed, gate still off)

Supersedes the numbers in the two sections above. Full per-item results with stage-by-stage scores: `docs/EVENT_POLICY_EVALUATION_2026-10-09.md` (generated by `scripts/make_eval_report.py`); candidate hashes: `data/eval/CANDIDATE_MANIFEST.json` (base commit a7e63e9 + uncommitted tree). Tests: 622 passed, 7 skipped, 0 failed (the old date-dependent failure was fixed with an injected clock `push._now` and explicit timestamps, plus 72h / 14d / 7d boundary tests in `tests/test_freshness_boundary.py`; dates were not refreshed or waived).

Cause-level changes (no vendor lists): a version string inside a name or plain "released" no longer makes an item a changelog (needs patch-note evidence or a package tag `x@1.2.3`); a verified release on its own primary page (new-artifact listing, weights/API-live wording) is not required to have engagement; event dedup uses a 7-day window plus a per-artifact release id, so "Model-2.1" and "Model-2.1-Turbo" are separate events while reposts merge; index/directory pages are discovery sources and are penalised in ranking and rejected by the gate; courses, hackathons, rumours, personnel news, recaps and other-org derivatives are rejected; an official account's own announcement counts as its own primary source. Prepared discovery: `index_link_regex`/`index_sort` in the website collector, six disabled "HF New Models: <task>" newest-first listing sources (8 fetches each), Papers index configured to yield individual papers; tested offline through the real collector.

Honest evaluation protocol: policy v1 was frozen (`POLICY_FREEZE.json`), set 1 (90 unseen items) sampled and labelled, then run: gate on = 4 sent, 0 of 6 relevant, 4 irrelevant; gate off was worse than the installed pipeline (19 vs 15 sent) because the narrower changelog rule stopped accidentally suppressing four Hugging Face index pages. That failure analysis produced v2 (`POLICY_FREEZE_v2.json`); set 2 (90 fresh items) was then sampled and labelled and run once. Labels are the assistant's, not the owner's; two relevant items in set 1 were reclassified "stale" by a mechanical rule (relevant but published >14 days before collection) after the first run.

Final results, installed pipeline -> candidate gate on (relevant sent / relevant total, irrelevant sent):
- Regression (58, not independent): installed 3/7, 16 irrelevant -> 5/7, 9 irrelevant.
- Set 1 (exposed after v1): installed 1/4, 14 irrelevant -> 1/4, 2 irrelevant.
- Set 2 (independent, v2): installed 0/5, 10 irrelevant -> 0/5, 2 irrelevant.
Reading: precision improves clearly (irrelevant sends 40 -> 13 across the three sets); recall does NOT generalize (0 of 5 fresh relevant items found). Set-2 misses by stage: Cohere transcription model and Seedance-on-Higgsfield posts - ranking noise penalties (-138, -40) and no outside link because t.co links are stored unexpanded (extraction gap); VibeVoice 31.7, Cursor 44.0, Gemini Flash Live 39.3 - below every send bar (ranking). These causes are not fixed yet; fixing them against set 2 would contaminate it, so the next revision needs a new set 3.
Ablation: an optional "gate-passing event skips the review band" rule (`EVENT_BAND_SEND_FLOOR`) added +3 relevant but +9 irrelevant sends across the three sets; it is left OFF.
Not measured offline: duplicates, unsupported claims, verification/delivery latency (need live timestamps); collection latency per item is recorded (`publication_to_discovery_hours`) but stored publication dates are often missing or day-granular.
Remaining blockers before any activation: t.co link expansion at collection; hype-pattern noise penalties on legitimate first-party release posts; the 40-55 score range for fresh official announcements; Midjourney-style update pages are collected as one page item, not per update; owner review of the assistant-written labels.


## 2026-10-09 (revision 3) — Boundary proof, stage fixes, frozen protocol, untouched set 3. NOT installed, switch off, no source enabled

Supersedes every number above. Base commit a7e63e9 + uncommitted tree; hashes in `data/eval/CANDIDATE_MANIFEST.json`; tests 662 passed, 7 skipped, 0 failed. Full per-item trace page and protocol: `docs/EVALUATION_PROTOCOL_v3.md`, `data/eval/*`.

**Do not install, not even with the switch off.** The earlier switch-off drift (regression-set irrelevant sends 16 to 17) was real: ranking changes were outside the switch. Now every behavior change is behind one switch (`pipeline/policy_flag.py`, env `PAPER_BOT_EVENT_GATE`, default off). Proof: `scripts/differential_dump.py` run on a copy of the installed server code and on the candidate over all 3,087 saved items gives identical digests (score and every component, noise penalty, route lane/action/reasons, changelog and domain predicates, cluster membership over all items, short-link expansion on mocked transports, config rows of all 51 pre-existing sources): `data/eval/DIFFERENTIAL_OFF_EQUIVALENCE.json`. Regression-set sends with the switch off: 19 installed, 19 candidate.
- Inert (no effect on any code path when off, or never called when off): `policy_flag.py`, `event_gate.py`, `first_party.py`, `claim_grounding.py`, `update_pages.py`, injectable clock `push._now`, optional source keys (`index_link_regex`, `index_sort`, `split_updates`, stored only when set), 10 new disabled sources, tests, fixtures, scripts, evidence files.
- Behavior-changing, guarded by the switch: `rank.py` (changelog shape, strong-capability, creative-domain vocabulary, index penalty, first-party exemption), `cluster.py` (7-day window, per-artifact release id), `push.py` duplicate check, `x_enrichment.py` (short-link resolver), `apify.py` (provenance in metadata), `rss.py` (update-page splitting), `delivery.py` (gate branch and new routes), `brief_grounding.py` (claim reasons).
- Proposed install order if ever approved (separate patches, each with its own rollback): A inert modules; B guarded call-site edits plus the differential proof re-run on the server; C disabled sources; nothing in D (switch on) before a shadow observation.

**Failing stages addressed (general causes, no product names):** (1) short links: allow-listed shorteners only, redirects disabled, destination never requested, private/odd destinations refused, provenance (method, hops, HTTP status, note) stored in item metadata; unresolved links are held, not dropped. (2) First-party release language vs noise: maker's own release wording + a link on a domain tied to the author + no hype/bait markers; only then the release-teaser and survivor penalties are skipped. (3) Fresh low-engagement announcements: no lowered global threshold; a fresh (72h) first-party release is sent when its score minus engagement reaches a credibility floor of 35. (4) Multi-update pages: one item per dated entry, date kept as a label, never turned into a date without a year. (5) Claims: license, performance number, hardware and language-support claims must appear in the source (Qwen-Image-2.1-Turbo model card is the fixture); previously accepted briefs are not flagged.

**Measured offline, correcting the earlier blanket claim:** duplicates: 547 same-event pairs (two items citing one outside link within 7 days) are 100% merged by clustering, switch off and on; 632 of 651 near-identical-title pairs are merged (97%); different-release-same-org pairs: none exist in the saved data, so that protection is covered only by the synthetic and Qwen replay tests. Caution: the link-based ground truth shares signals with the clustering, so it is not independent. Unsupported claims: tests above. Publication-to-collection latency: X items median 60.5 h, 40.7% collected more than 72 h after publication (n=521); RSS and GitHub items in the local copy are mostly historical backfill. Delivery latency is NOT measured and cannot be by offline replay; it needs an authorized live observation.

**Untouched set 3 (150 items; policy v3 and protocol frozen first; labels written before the run; assistant labels, owner review requested):** 35 relevant, 92 irrelevant, 23 ambiguous (never forced). Only 4 relevant items were fresh at discovery (31 were collected more than 72 h after publication), so the pre-registered rule applies: fewer than 20 relevant-and-fresh items means INCONCLUSIVE. Numbers with 95% Wilson intervals: relevant-and-fresh recall installed 1/4 (0.25, CI 0.05-0.70), candidate 3/4 (0.75, CI 0.30-0.95); irrelevant selected installed 4/92 (4.3%, CI 1.7-10.7%), candidate 1/92 (1.1%, CI 0.2-5.9%). Recall on all 35 relevant under the 72 h rule: installed 1/35, candidate 3/35 (lateness dominates). Exploratory (not part of the decision rule): replaying set 3 as if every item were collected within an hour of publication, installed selects 28/35 relevant (80%) but also 54/92 irrelevant (59%); the candidate selects 15/35 relevant (43%, CI 28-59%) and 14/92 irrelevant (15%, CI 9-24%). The gate removes about three quarters of the irrelevant selections but also loses 13 of the installed pipeline's 28 relevant selections. Failure causes in that replay: the gate's value and event word lists reject plain relevant releases ("Hello GPT-4o", "Introducing ChatGPT Pulse", "Welcome Llama 4", "ControlNet in Diffusers"; 14 of 20 misses), an enterprise-story penalty hits two product launches, a rumour pattern hits two, one fresh open-model post scores 41.4 against the 40 bar; false positives: courses (the education rule is defeated by the word "Introduction" inside course titles), index-like overview posts, a tutorial, GitHub and Simon Willison patch-note posts (GitHub bypasses the gate; version "0.1a1" is not a three-part semantic version), corporate and pricing-tier posts from official sources. These are NOT fixed: fixing them against set 3 would contaminate it. The next revision needs a new set 4 and a new freeze.

**Marginal budget of the proposed discovery sources (all disabled; plain HTTP GETs, no Apify credit, no model call):** assumes today's 15-minute website cycle (`PAPER_BOT_RSS_POLL_MINUTES=15`) and today's collector, which re-fetches every linked page each cycle. Six newest-first Hugging Face listings: 1 listing + up to 8 pages = 9 GETs each, 54 per cycle, 5,184 per day. Papers index 864 per day. Three product pages 288 per day. One updates page 96 per day (no per-entry fetch). Worst case about 6,430 GETs per day (0.07 per second on average, bursts of 66 per cycle); at an assumed 150 KB per page about 1 GB per day (page size not measured). Cheaper variants: poll these sources hourly (about 1,610 per day) and skip already-known URLs before fetching (not implemented; steady state would be about 7 listing GETs per hour plus new pages). Short-link resolution: 7.6% of X items carry a short link and about 49 X items arrive per active day, so about 4 GETs per day. Model calls: none scheduled; briefs happen only for items that survive, and the candidate sends no more items than the installed pipeline on set 3 (9 and 9) and fewer on the other sets, inside the existing 5-minute brief cadence. Money: no new paid call. Real request counts and rate-limit behavior need an authorized live observation.

**(Superseded by revision 4 below.)** **Revised activation plan (nothing proceeds without your approval):** 0 keep everything uninstalled; 1 you review `docs/OWNER_CALIBRATION_SAMPLE.md` (16 items, balanced) and the label rules; 2 v4 fixes for the listed causes against a new untouched set 4 under a new freeze; 3 only if set 4 has at least 20 relevant-and-fresh items and the pre-registered rule is met, propose an authorized shadow observation (nothing sent) to measure delivery latency, request counts and real precision; 4 only after that, propose installing patches A, B, C in that order with the switch off, then a staged switch-on. Rollback at each step: remove the patch or leave the switch off.


## 2026-10-09 (revision 4) — Three-state freshness, live-window census, evidence-based gate, polite fetching. NOT installed, switch off, no source enabled

Supersedes revision 3's numbers. Base commit a7e63e9 + uncommitted tree (`data/eval/CANDIDATE_MANIFEST.json`); tests 692 passed, 7 skipped, 0 failed. Frozen before set 4: `data/eval/POLICY_FREEZE_v4.json` and `docs/EVALUATION_PROTOCOL_v4.md` (hashes verified intact after the run). Full evidence page with every item's trace is published as an artifact.

**Result: the candidate FAILS the pre-registered rule.** Set 4 is a census of the 273 unused items in the live window (publication time known or derived, collected within 72 h). With the labels as frozen: 26 relevant, 228 irrelevant, 19 ambiguous. Installed selects 4/26 relevant (15%, CI 6-34%) and 27/228 irrelevant (12%, CI 8-17%); the candidate selects 1/26 (4%, CI 1-19%) and 7/228 (3%, CI 1.5-6%): recovered 0, lost 3, sign-test p=0.25. After reviewing 14 items I had never displayed when labelling (they defaulted to irrelevant; every change is in `label_audit.jsonl`, both versions kept): 30 relevant, 214 irrelevant, 29 ambiguous; installed 6/30 (20%, CI 10-37%) and 21/214 (10%); candidate 3/30 (10%, CI 4-26%) and 4/214 (1.9%); recovered 0, lost 3. Lower noise (irrelevant selections down 81%) is not success: the rule requires lost at most 15% of installed relevant selections and recovered minus lost not negative; both fail. Duplicates among selected items: none in either pipeline (one selected post belongs to an event group). Collection latency is truncated by the census design; the unrestricted live-window figure is below. Decision and delivered-message latency: not measured.
Why the 27 missed relevant items were missed (candidate): 11 blocked on an unexpanded short link (7 pure, 4 with missing evidence too), 6 rejected for no outside source, 4 held for missing event or capability evidence, 4 held by the claim/grounding check (same as installed), 1 merged under another cluster primary, 1 program promo. The 3 useful items the candidate lost: "You can now take any blurry image..." (held: "you can now" is not in the announcement grammar), "Computer use is available in Claude Code now as well." (rejected: the post carries no link), "Multimodal Embedding & Reranker Models with Sentence Transformers" (held: a title with no event wording and no stored body). Candidate false positives (4): a crypto launch, a helm chart, a Rust-crate write-up, a Claude Code version tag. These are NOT fixed, because set 4 is now exposed. The local database has no further untouched live-window items, so the next untouched set can only come from an authorized no-send shadow run.
Timely-collection replay (diagnostic only, set 3 as if collected within an hour, v4 policy): installed 28/35 relevant and 54/92 irrelevant; candidate 19/35 and 15/92; recovered 3, lost 12, kept 16. The 12 lost are all holds for missing event or capability evidence on titles with no stored body: the gate needs the page content, not a longer word list.

**1. Three-state freshness (done).** Known fresh, known stale, unknown; unknown is never fresh and holds with `publication_time_unknown`. A time is stored, derived from an X status id (labelled), or bounded by a first sighting in a polled newest-first listing. Recalculated denominators (`data/eval/freshness_states.json`): set 1 relevant 6: known fresh 0, stale 4, unknown 2 (the old label counted 4 as fresh: 2 unknown and 2 actually stale); set 2 relevant 12: fresh 3, stale 9, unknown 0 (old 4 fresh; 1 actually stale); set 3 relevant 35: fresh 3, stale 32, unknown 0 (old 4 fresh; 1 actually stale, derived from the status id). So the earlier "four fresh positives" in set 3 were really three; unknown dates inflated sets 1 and 2 more (5 of the 8 relevant items the old labels counted as fresh in sets 1 and 2 were unknown or stale).
**2. Backfill versus live (done).** In the local copy 1,645 of 1,876 RSS items were published more than 30 days before collection (archive backfill); website and X rows have no publication time at all; the service also was not collecting continuously, so RSS lag (median 179 h for the 164 items published inside the window) is not a design latency. The best live estimate is X via Apify: of 733 items, 212 have no publication time; of 331 published inside the window the median collection lag is 29.9 h, 75th percentile 70 h, 90th percentile 100 h, 24% over 72 h. Set 4 uses that window only, with 30 relevant items, so the evidence is sufficient by the protocol; the replay of old items is diagnostic only.
**3. Evidence-based gate (done) and the 41.4 explanation.** Negative evidence rejects; missing positive evidence holds and names what is missing; the gate reads the source page the collector stored for a short post; "stay tuned" boilerplate after a real launch is not a rumour; courses are rejected by title; how-to titles are rejected unless the lead states a release. About "41.4": my earlier phrase "below the 40 bar" was wrong. 41.4 is above 40, but 40 is only the floor of special lanes (official model lab handles, user-approved handles, frontier-model watch, usage changes, verified primary release). An item in none of them needs 75 to send and 55 to be held, so 41.4 dropped as `low_story_score`. `route_item_for_delivery(..., trace=[])` now records every check with its value and threshold (tested; inert when not requested), so each discrepancy can be explained.
**4. Fragments and labels (done).** `docs/FRAGMENT_RESOLUTION.md`: 17 fragments resolved from stored source context with a factual description (for example "Now available in beta..." points to the claude.com post "The advisor strategy: Give Sonnet an intelligence boost with Opus"; "VibeVoice GitHub" points to the repository "microsoft/VibeVoice: Open-Source Frontier Voice AI"); 45 have no stored context and are not put to you. Four genuine preference questions remain after applying your existing feedback (`docs/OWNER_QUESTIONS.md`). Assistant labels and owner-confirmed labels are separate files (`owner_labels.json` holds only your 56 earlier verdicts).
**5. Polite fetching (done, disabled).** `connectors/polite_fetch.py`: cache, conditional requests, per-host exponential backoff honouring Retry-After, per-host cycle budget (40), known-page skipping, first-sighting provenance; 12 tests with exact counts: a 3-page listing costs 4 requests cold, 1 when unchanged, 3 with two new pages; an outage causes one probe, not one per cycle. Source-specific bounds (`scripts/request_bounds.py`, hourly polling): the seven Hugging Face sources share one host, steady state 7 requests per cycle (168 per day), busiest 63 per cycle clipped to the host budget of 40 (960 per day); each product page 1 per cycle (24 per day). At a 15-minute cycle: steady 672 and cap 3,840 per day for Hugging Face. Replaces my earlier 6,432 per day. Freshness trade-offs: detection delay up to one poll interval; a newest-first listing shows 8 pages, so more than 8 new pages between polls are missed until they scroll off; a known card edited later is noticed up to 24 h late. Real counts, ETag support and rate limits are unmeasured.
**6. Equivalence and generalization (done).** With the switch off the exact revision matches the installed code on all 3,087 saved items (same digest as before, `DIFFERENTIAL_OFF_EQUIVALENCE.json`). Generalization was evaluated on set 4 as above, measuring recovered and lost useful items beside noise.

**What a no-send shadow run can and cannot measure:** collection latency (publication to first sighting), decision latency (first sighting to a decision), real request counts and rate-limit behavior, and it supplies the next untouched set. It cannot measure delivered-message latency, since nothing is sent; those figures stay labelled separately and are never inferred from replay.
**Next revision (not started):** read the page content for held items with no stored body (one budgeted fetch), add the common announcement phrasings the audit exposed, decide whether a post with no link by a first-party team member needs an outside source, and re-expand short links on a real run; evaluate only on a set from a shadow run. Activation remains: none.


FEATURE-071 evidence update20:55 UTC: narrowed demo-learning promptSHA1497c7ea15b251be015d1864aa02c795369c4647305c4e7fc16e53745543baf8 deployed and health/read-back passed. Natural Raptor33580 generated with Luna after one atomic recorded changed-prompt retry (three earlier failures retained), passed normal gates and delivered photo9128 at20:52:18 UTC. ManimGX9127 media edited to exact-video reviewed frame130s, same caption/hash, Telegram acknowledgement. Remaining actual incoming-link reply, authenticated visual acceptance, sustained quality and automatic meaningful-frame selection. Latest trivia identity clarification is pending; offline Botson helper is not deployed.


FEATURE-071 owner correction 2026-10-12 — in_progress: Raptor33580 and ManimGX33492 were rejected as irrelevant/low interest, invalidating earlier quality claims. Actual send path now requires source-bound owner relevance via Codex CLI, with positive NFT game and two negative calibrations, budget/cache/failure/concurrent-source protections. Requested PartLLM link-summary repair adds public replies/author continuation/linked artifacts and replaces repetitive attribution/empty disclaimers with plain Hebrew. Local targeted checks pass; staged real-Luna and production read-back pending. Sustained owner-approved delivery remains unproven.


FEATURE-071 2026-10-12 — in_progress. 2026-10-12 00:18:09 IDT: owner-interest/comments six-file checksum-guarded release installed and API restarted/health ok. 71 targeted regressions pass. Real authenticated gpt-6-luna via host executor kept NFT33558 and rejected Raptor33580/Manim33492; normal owner review drops recorded. PartLLM public replies included author follow-up, linked code/abstract/project read, revised Hebrew summary generated with partial-coverage notice. Installed link d426924f2b67; push da11d0dcbb7b. Updated real incoming Telegram reply and sustained owner-approved feed remain unverified. Backup: /opt/paper-bot/releases/owner-interest-comments-20261012. Actual rejection feedback consumption and fresh natural delivery read-back ongoing.


2026-10-12 00:45:27 IDT — in_progress: direct requested summaries deployed, installed link_submission SHA33ca70dd6e006dcfedd5bd5bbc773c3d6207d56e5b2857a8ed17bcb77f35d079. One bounded Codex rewrite for forbidden source narration; two explanatory sentences, comment coverage in compact source footer. 74 targeted checks pass, real authenticated Luna PartLLM result has no rejected opening/decoder detail/repeated benefit. Backup /opt/paper-bot/releases/direct-summary-20261012; MainPID3453447, restart/health/hash readback pass. Owner supplied an actual delivered prior-version reply, but acceptance of this updated version remains unverified. Natural cycle21:38UTC rejected weak33222; no useful sends/newrelevancecache by21:40UTC. Diagnosing missing linked repo context on useful iPhone-use/DeckCraft; no source-gate bypass.


## 2026-10-12 01:41 IDT — RTL and reader comprehension correction (in_progress)

Owner rejected the actual previous PartLLM reply as non-RTL and incomprehensible literal translation. Requested-link captions now prefix every visible paragraph with RLM, including Latin-first titles/footer. Prompt leads with an illustrative everyday result, omits abstract segmentation wording and unsupported editing, and uses gpt-6.1-sol via the existing authenticated Codex CLI. Optional per-call model selection is thread-safe and preserves the automatic model configuration. No API keys, OpenRouter or Ollama.

55 relevant local tests and 36 production-overlay tests passed; compile/diff checks passed. Actual public PartLLM source/comments/linked context generated a chair-leg text-selection example plus point selection. Critical CLI review: comprehension5, natural Hebrew4, concrete explanation4, fidelity4, no unsupported capabilities; remaining awkward phrasing is documented, not owner-approved. Installed exactly brief.py SHA0e47c313daea7918e745b4ce341799129279a2168cd6054cb70adfb8827c388c and link_submission.py SHA8d1ea9b94cb77d3d44f9103c6e7e76d5f8b3e8c6e4dbeacdcec9afd50ec16290 with guarded baselines/backups. API PID3639578 started01:40:59IDT, health ok, scheduler true22:41:17UTC. Backup /opt/paper-bot/backups/readable-rtl-summary-20261012. No new Telegram test message sent; updated client rendering and owner acceptance remain unverified.

Source-context repair installed earlier01:08:57IDT: runtime62c33c92328a349e3ddb77ba24d3250f529b12b30bd80c9595dd173267c27fe5, repositories694f93f33390011b5e7533978418903ac03f47cad7b73962a15809e7bc022d60, backup source-context-20261012. Ordinary brief cycle22:29:01UTC naturally persisted matching README context for iPhone-use33458 and DeckCraft33471; both now repo_discovery_explained/groundingpass, without brief-attempt reset. Full story gates still hold: iPhone weak_builder_consequence80; DeckCraft borderline75. Context recovery does not prove useful automatic delivery. Next concrete candidate: explain source-supported Codex control of a real iPhone before setup restrictions, without weakening story/media/interest gates.


### 2026-10-14 2026-10-14T10:58:54.820724+00:00 — operational acceptance remains OPEN

Owner explicitly authorizes guarded production deployment and asks for a supported completion hook. Completion is operational evidence, not a promise of uninterrupted reliability. Existing completed phases must not close this project.

- [ ] Exact revision offline regressions: inspect docs/paperbot-acceptance-state.json, not an older revision's receipt.
- [ ] Installed production identity, matching source hashes, fresh health and rollback.
- [ ] Ordinary useful fresh story delivery; record source-to-delivery latency and rejected/failed breakdown.
- [ ] Actual model-generated authentic Hebrew style with factual completeness; no authored-fixture substitution.
- [ ] Authentic source media and accessible native video delivered ordinarily.
- [ ] Labelled subscription illustration fallback exercised only when naturally eligible.
- [ ] Nonempty ordinary recap with acknowledged payload hashes.
- [ ] No resends or resurrection of exact owner-rejected content.

Enforcement: `scripts/paperbot-complete` exits nonzero while evidence is missing, stale or bound to another source revision. Existing Claude Code Stop hooks now also run `.claude/hooks/paperbot-acceptance-stop.sh`; one continuation maximum per turn, then explicit WAITING/BLOCKED reporting. No providers, retries, daemons or sends run in the guard. Explicit owner cancellation/no-production scope is recorded as OWNER_LIMIT, never COMPLETE.

Codex0.162.1 local binary exposes Stop/hooks.json/stop_hook_active and official documentation supports project `.codex/hooks.json`. This canonical project's existing `.codex` is a file, so it is preserved: no Codex config registration or interception of the current cloud parent final response is claimed. The actual supported registration here is Claude Code plus the project completion command. Future local sessions must reload project hook settings.

Authoritative machine-readable gate: docs/paperbot-acceptance-state.json; exact source/test manifest: docs/paperbot-acceptance-manifest.json. Each live requirement stays OPEN until its own exact-revision evidence exists. Waiting condition and next scheduled observation must be reported in this same task. No budget/cadence/security change, synthetic production calls or paid watchdog.


### 2026-10-14T11:02:01.260704+00:00 — production approval blocker, overall OPEN

Automatic approval review rejected the eight-file production deployment and API restart because it treated the earlier no-deploy/no-restart instruction as controlling and did not accept delegated approval. No production mutation occurred. Direct owner authorization is pending. Prepared candidate workflow-repair-20261014T110122Z passes191isolated offline tests. Installed production remains source-media-first-20261014T095605Z/API2832448; healthok at11:01:15UTC and the new ALT module is absent. Existing11:00:33UTC writer completed3briefs/16failures/1feedback skip; no acknowledged publications since09:56 in the read snapshot. Those are old-revision outcomes, not acceptance of this candidate. Existing runtime: next periodic push approximately 2026-10-14 11:06 UTC, next writer approximately 11:20 UTC (20 minutes after last completion11:00:33). These are old-revision observations and cannot satisfy the candidate gate. Candidate ordinary acceptance begins only after approved guarded deployment.

Registered completion command and project Stop hook distinguish BLOCKED from WAITING, reject stale/missing/changed evidence, and block once per turn without retry loops. Direct registered-hook invocation is a local protocol check, not proof of a newly launched model session. Existinghooks and permission settings are preserved.


### 2026-10-14T11:03:41.360669+00:00 — production approval blocker, overall OPEN

Automatic approval review rejected the eight-file production deployment and API restart because it treated the earlier no-deploy/no-restart instruction as controlling and did not accept delegated approval. No production mutation occurred. Direct owner authorization is pending. Prepared candidate workflow-repair-20261014T110331Z passes192isolated offline tests. Installed production remains source-media-first-20261014T095605Z/API2832448; healthok at11:01:15UTC and the new ALT module is absent. Existing11:00:33UTC writer completed3briefs/16failures/1feedback skip; no acknowledged publications since09:56 in the read snapshot. Those are old-revision outcomes, not acceptance of this candidate. Existing runtime: next periodic push approximately 2026-10-14 11:06 UTC, next writer approximately 11:20 UTC (20 minutes after last completion11:00:33). These are old-revision observations and cannot satisfy the candidate gate. Candidate ordinary acceptance begins only after approved guarded deployment.

Registered completion command and project Stop hook distinguish BLOCKED from WAITING, reject stale/missing/changed evidence, and block once per turn without retry loops. Direct registered-hook invocation is a local protocol check, not proof of a newly launched model session. Existinghooks and permission settings are preserved.


### 2026-10-14 11:07 UTC — approved workflow repair deployed; overall OPEN

The owner clarified that no-deploy applied to the separate reporting automation and authorized one retry of the same guarded action. Automatic review accepted that retry. Exact candidate workflow-repair-20261014T110331Z (192offline tests) deployed11:06:54UTC, backup/guarded rollback /opt/paper-bot/backups/owner-workflow-repair-20261014T110654Z. API3071445 started11:06:55UTC;41installed hashes match and healthok at11:07:37UTC. Eight focused application files only; no budget/cadence/security change, source403 bypass, forced job/provider/image/send or old-message changes. Earlier approval rejection is resolved, retained as historical evidence.

Tests and installed identity gates have exact-revision evidence. All ordinary live gates remain OPEN, including useful fresh flow/latency, actual voice, accessible native video, naturally eligible illustration, nonempty current-revision recap, and no resends/rejected-content resurrection. Observe existing periodic push approximately11:17UTC and writer due approximately11:20:33UTC, then callbacks/ordinary receipt completion. No forced runs. Next ordinary recap17:00UTC; video/illustration depend on naturally eligible events. The completion command must return WAITING, never COMPLETE, while these conditions are pending.


### 2026-10-14T12:34:10.352387+00:00 — standing implementation resumed; operational gate v2

Owner directly renewed end-to-end implementation, production deployment and completion-gate repair. Read-only checkpoints inspect without cancelling or replacing this standing task. The three-file follow-up fixes compound model-name comparisons, avoids writer slots for sources already rejected by the existing72h delivery cutoff, and records bounded future illustration event/exit diagnostics without prose or credentials. All212offline tests pass (198follow-up base plus13operational gate regressions and1stream-diagnostic test). Candidate workflow-followup-20261014T123309Z is ACTIONABLE until guarded deployment and exact runtime verification. No new approval blocker is recorded.

Gate states: ACTIONABLE for unfinished implementation/deployment or locally refreshable evidence; IN_PROGRESS only with a fresh matching implementation-process lease (PID/start ticks/expiry); WAITING only after actionable work is done and a concrete future ordinary event/observation is recorded; BLOCKED only for an evidenced external dependency/access/quota/approval issue; OWNER_PAUSED only for an explicit referenced owner disposition; COMPLETE only for verified exact-revision acceptance. A prior report, a scheduled bot PID, an expired/dead worker, a done label without deployment evidence, or an upcoming writer cannot turn deployable work into WAITING.

The project completion command and existing local Claude Code Stop hook enforce this state. One continuation maximum avoids paid retry loops. These local hooks cannot intercept the cloud-backed parent chat final response or create a persistent implementation worker. No daemon, self-restart, new permission, budget/cadence/security change, past-story retry, forced provider/scan/send or source403 bypass. Ordinary media, illustration, actual style, useful fresh flow/latency and recap acceptance remain OPEN.


### 2026-10-14 12:35UTC — follow-up deployed, actionable phase verified, acceptance OPEN

Exact revision workflow-followup-20261014T123309Z passed212offline tests and deployedthreefiles12:34:27UTC, backup/guarded rollback /opt/paper-bot/backups/owner-workflow-followup-20261014T123427Z. API3368945 started12:34:31UTC;41candidate hashes match and healthok12:35:12UTC. Review716318 unchanged. No quota/cadence/security/access changes or forced calls/sends. The historical198-test local candidate is no longer silently unapplied: its app fixes plus bounded diagnostic refinements are now installed.

Operational gate v2 was ACTIONABLE before deployment and stayed ACTIONABLE after the installer until this exact runtime verification. Deployment work now DONE; only external ordinary acceptance conditions remain pending. Next ordinary writer/delivery outcomes and a DIFFERENT naturally eligible missing-media story with bounded illustration diagnostics; never retry34562 or34307. Current-revision recap17:00UTC. Next observation12:55UTC, writerapproximately12:44:24 andpush12:44:31. No claim of uninterrupted reliability or overall completion. The guard cannot intercept this cloud parent chat; its real project completion command/local Stop hook retain exact actionable/waiting/blocker/owner-pause distinctions.


### 2026-10-14 13:14UTC — actual9213 audit and actionable future-only repair

Ordinary FowlBrowser33872 acknowledged as photo9213 at12:44:56UTC; exact reconstructed Hebrew caption hash1f0c2ea685c7004018fd0075db4d3cfc5747741d883dda14d5f7d6b8d770ddd9 matches receipt, no unrelated-script characters. Source-to-delivery51h39m28s, capture-to-delivery46h08m31s, generation-to-delivery10.216s. This is one backlog delivery, not steady fresh-flow acceptance. Existing media receipt says unfetched_fallback_url and no image hash: it cannot establish local pixel QA. The source explicitly hands logins/payments to the user; that material condition is absent from the acknowledged caption. No old message edit/resend.

Candidate validated-media-20261014T131430Z passes226isolated offline tests. Future news require bounded validated image bytes, no Telegram URL delegation after failed/redirected/unparsed local fetch, existing source alternatives before labelled illustration and an uploaded-image hash. Explicit root-post login/payment handoffs are checked during generation and after rendering, with a concise prompt instruction. Eligible unpublished cached omissions re-enter only the existing capped/cooling-down ordinary queue; published items remain excluded. No vendor whitelist, global relevance relaxation, budget/cadence/security changes or forced providers/sends. Project gate ACTIONABLE until guarded six-file deployment and exact runtime verification.


### 2026-10-14 focused owner-value/date repair — ACTIONABLE

Owner rejected FowlBrowser, ShowMe and jev-kit for upcoming selection, not resends. Fresh16:46UTC production verification matched41hashes andhealthok API3515489; two validatedsourcephoto receipts9214/9215 provefileuploadmechanics, notownerquality. Allthree hadpositive semanticdecisions. Their source/keywordboosts andconcretefeatures didnot establish substantiveownerinterest. FowlBrowser/ShowMe judgements misdatedOct12postsOct14 because relevanceinputomittedpublicationdates. ShowMe isOmarchyfocused/sourcebuilt/onetestmachine, notstrictOmarchyonly; jevLinuxfitsbutexperimentalintegrationandSeptmeasurementsarenotOctlaunchproof. BenchmarkbrowsertoolsunderaClaudeagent/localdemosites/permissiondenials mustnotbecomefullagent superiority.

Exactcandidate relevance-repair-20261014T165650Z passes239isolatedoffline tests, including13newcontractcasesandpositivecreative/majorAI/engineeringcounterexamples. Actualpost/collection/repository/releasedatesareseparate; recentpushisnotareleaseboost. Positivejudgementsneedsubstantialsourcequotedvalue; genericpreviewisnotdemonstrationoutput; maturitychecksapplyacrosscollectors; highrankalonecannotauthorizeurgent. Benchmarknumericcopyrequiresauthorandknownmaterialconditions. NoOS/vendor/starban,paidprovider/budget/cadence/securitychange,forcedcall/send/scanoroldstoryedit. Offline mockverdictsprovecontractguards,notsemanticmodelquality. Guardeddeploy/installedverificationandordinaryacceptanceremainpending;isolatedimagehelperisnextactionablework.


### 2026-10-14 17:09UTC — exact final future-selection candidate

First guarded installer timed out;17:05:47 read-only proof confirms prior41hashes/health/API3515489 unchanged, no backup, and17:06:28 no remaining installer. Active polling worker prevented idle. Do not interrupt it or infer deployment. Final candidate owner-fit-final-20261014T170904Z passes240offline tests and adds exact acknowledged-caption exclusions for9213/9214/9215 to future recap selection; prior exclusion entries and historical receipts remain unchanged, new versions/vendors are not banned. Bounded idle-only deployment remains ACTIONABLE with renewed actual-process lease. Isolated native image helper source is under offline build/test, not deployed or live-tested.


### 2026-10-14 17:12UTC — owner-value repair deployed and verified, overall OPEN

Exactrevision owner-fit-final-20261014T170904Z passed240offline tests; sevenfilesdeployed17:11:43UTC onlyafteridle,backup/guardedrollback /opt/paper-bot/backups/owner-owner-fit-final-20261014T171143Z. API105363started17:11:43UTC;42hashesmatchandhealthok17:12:35UTC,review716318unchanged. Noproviders/jobs/sendsforced,nopastmessageedits,budget/cadence/security/accessunchanged.

Ordinary17:00UTCrecap9218existswithfiveold-revisionstories(34557,33872,34124,34675,34761),pagehash2ff53636040c956b59cd2d26bdac41f492bae47246ee733fe338dcfd8388703a. It wasselected beforethisrepair andincludesnewlyownerrejected9213/9214/9215;notnewrevisionacceptance. Exactcaptionexclusionsnowpreventtheirfuture recap resurrection;noexistingrecapmodified. Newordinarycreativecodingphoto9217/item34761at16:49:12pre-datesrepair,notacceptanceofnewsemanticcriteria. ImagehelperremainsACTIONABLE,notoverallWAITING/COMPLETE.


### 2026-10-14 17:20UTC — isolated native image helper tested, deployment ACTIONABLE

OfficialCodex0.162.1snapshot092d3acd6bec3e3a14bdc7e7a2810ab628ab759d wasbuiltintaskworkspacewiththeexisting1.95compiler. OnlyexecimageJSONLprojectionchangedinruntime;originalexec/lib.rsbootstrapisbyteidentical. Loader/sandbox/managedrules/authcontextareunchanged;noconfigcopy,launcherpermissionswap,authinspectionorproviderfallback. Rootreleaseversionand161workspace-onlylockversionsnormalized;all externalpinsunchanged. ExistingexecJSONLsilentlydroppedimageGeneration;newpinnedhelperexportsinlinePNGresult/status/failure,neverreads/exportsavedPath. Nativeimageprojectiontestandtwoforbiddenconfigread/controltestspass;247Pythoncheckscoverhelperpinning/changedormissingartifactbeforequotaclaim,readonly/ephemeral/ignoreconfigarguments,existing3/dayandone/story/cooldown/lock/killswitch,inlinePNGguardsandtypedno-imagefailure. Noactualmodel/imagecall.

Exactcandidate native-image-helper-20261014T171928Z awaitsboundedguardedhelperbinary+adapterdeployment,backup/rollbackand43installedhash/healthcheck. Globalcodexbinaryisnotreplaced. Todayexistingattempts34562/34307/34014remainuntouchedatcap3;nativeimagegenerationacceptanceawaitsanaturallyeligiblestorywhenordinarybudgetallows. Overallcompletionnotclaimed.


### 2026-10-14 17:24UTC — native image helper deployed and verified; ordinary acceptance OPEN

Exactrevision native-image-helper-20261014T171928Z passed247Pythonchecksand3nativeofflinechecks. Pinnedhelper321701200bytes/SHA256c7939d3c6f416362a7b58c85741838d0f102563404d6d171521aba2455847db9 plusadapterdeployedafteridle17:23:15UTC;backup/guardedrollback /opt/paper-bot/backups/owner-native-image-helper-20261014T172315Z. API144043started17:23:20UTC;43installedhashesmatchandhealthok17:24:19UTC,review716318unchanged. Native--helpwithisolatedtemporaryCODEX_HOMEpassedonserverbeforeactivation;noactualgenerationcall. Globalcodexbinary,existingcredentials/config/permissions,model/cadence/budgetsand3/day+1/storyattemptguardsunchanged. Storedattempts34562/34307/34014still3,noreset/retry.

BothauthorizedimplementationphasesDONEandverified;overallWAITINGforordinaryacceptance,notCOMPLETE. Nextordinarywriterdue17:31:40UTC,push~17:33:20UTC;boundedread-onlyobservationplannedthrough17:36UTC. NewimageacceptancedependsonadifferentnaturallyeligiblestoryafterordinaryUTCcappermits;nextcurrentrevisionrecap2026-10-15 09UTC. Nooldrecap/newsresendoredit.
