# Claude-and-Conquer Master Plan

## Overview

Private standalone Telegram bot for Claude Code sessions. Provides conversational AI access, multi-project management, and multi-backend support (Claude Code + Codex) via Telegram.

## Task ID Format

| Prefix | Usage |
|--------|-------|
| `FEATURE-XXX` | Major features |
| `TASK-XXX` | Features and improvements |
| `BUG-XXX` | Bug fixes |
| `INQUIRY-XXX` | Research/investigation |

**Rules:**
- IDs are sequential (TASK-001, TASK-002...)
- Completed: ~~TASK-001~~ with strikethrough + DONE
- Never reuse IDs

## Roadmap

| ID | Title | Priority | Status | Dependencies |
|----|-------|----------|--------|--------------|
| **FEATURE-021** | **Health Coach web app (PWA) replacing the Telegram health bots** — plan: `docs/superpowers/specs/2026-10-16-health-app-design.md` | **P0** | REVIEW | - |
| **TASK-114** | **Health app step 1: exercise library screen (read-only, real data, animations)** | **P0** | DONE LOCALLY 2026-10-16 — 883 exercises, 120 clean animations, search/filters/detail; Playwright 390×844: 0 cropped, 0 broken, 0 errors | FEATURE-021 |
| **TASK-115** | **Health app step 2: passcode login** | **P0** | DONE LOCALLY 2026-10-16 — data/media 401 without login, wrong-code message, 5-try limit, 1-year HttpOnly cookie | TASK-114 |
| **TASK-116** | **Health app step 3: Today screen from the Hermes health log** | **P0** | DONE LOCALLY 2026-10-16 — mirrors get_day (corrections/cancelled); verified on demo log + copy of real log. Real log's last entry is 2026-08-27. On VPS the log is mode 600 owned by uid 10000, so the app must run as uid 10000 | TASK-115 |
| **TASK-117** | **Health app step 4: deploy to VPS behind Caddy, installable** | **P0** | DONE 2026-10-16 — https://api.in-theflow.com/coach/ ; systemd `health-app` (uid 10000 `hermes-data`, 127.0.0.1:8650, /opt/health-app, `health-app/scripts/deploy.sh`); Caddy route added after backup `Caddyfile.bak-health-app-20261016-201911`; live Playwright run: login, Today (real log), library, Secure cookie, service worker, 0 broken images; other sites on the host still 200 | TASK-116 |
| **TASK-118** | **Health app step 5: food and workout coach chats via Hermes** | **P0** | REVIEW — DEPLOYED 2026-10-16, awaiting Noam's first live message — no Hermes change/restart was needed: the API server's `X-Hermes-Persona: telegram:-1004230590253:306/303` header answers as the topic with its telegram toolset (health+exercise); session `coachapp-<coach>-<date>`; verified locally vs a fake Hermes (persona/session/stream/MEDIA→animation) and live without AI calls (history 200 with the real key, 401 without login) | TASK-117 |
| **TASK-120** | **Health app goal pass (Noam's /goal 2026-10-16)**: Hebrew names + explanations for all 883 exercises (data/he-names, data/he-text), bigger animations + full-screen viewer with X, one-exercise-at-a-time workout mode, meal photo + voice dictation in chats, 7-day chart, weekly suggestions, offline/busy handling (service worker), e2e suite | **P0** | DONE 2026-10-16 — e2e on live test copy https://api.in-theflow.com/coach-staging/ (fake coach `health-app-fake-coach`, demo log, `scripts/deploy-staging.sh`, Caddy backup `Caddyfile.bak-health-staging-20261016-230309`): 47/47; real app read-only: 30/30 ×4 runs; unit 17/17. Two earlier intermittent test-browser stops during the offline step were not reproduced in 5 later runs with crash logging | FEATURE-021 |
| **TASK-121** | **Verified coaching flow (Noam 2026-10-17)**: training profile page (goal, days, minutes, level, gear + weights he can handle, injuries with side/note, never-give list, favourites, notes) stored by the app (`APP_DATA`), fixed weekly program built from it (no randomness) with easy/fine/hard progression from one-at-a-time mode, every workout reply and history checked server-side (blocked exercise swapped, weight capped), profile + today's session sent to the workout coach each turn, coach `PROFILE_UPDATE` lines become approve-cards | **P0** | REVIEW — DEPLOYED 2026-10-18 — unit 25/25; live test copy 68/68; real app read-only 37/37; real profile is an unsaved draft (seeded from Hermes memories, flags the 2 kg dumbbells vs 16 kg kettlebell conflict) until Noam saves it; Telegram untouched | FEATURE-021 |
| **TASK-122** | **Saved product library (Noam 2026-10-20)**: send label/front photos, barcode, name or a screenshot in the app or Diet Bot; agent reads or searches free sources, saves calories/protein/carbs/fat (+fiber/sugar/sodium) per 100 g and per serving with an online picture; "I ate X" uses it and asks the amount; "My products" page; protein/carbs/fat day totals; vegetarian warning — spec: `docs/superpowers/specs/2026-10-20-health-app-product-library.md` | **P1** | REVIEW — BUILT, ON TEST COPY 2026-10-20 — bot tools in `health-app/hermes-overlay` (image `hermes-agent:health-products-20261020`, also restores the health tools the 2026-08-29 image dropped: no meals logged since 2026-08-27); bot tests 14/14, app unit 43/43, products e2e 25/25 on https://api.in-theflow.com/coach-staging/ (own code dir + test passcode now), full e2e 100/102 (2 workout-chat fails also fail on the old code). LIVE 2026-10-20 14:35 (Noam's go): gateway+dashboard on the new image (rollback: `docker-compose.yml.bak-products-20261020-143447`), Diet Bot prompt replaced (`config.yaml.bak-products-20261020-143447`), app deployed; live tools + read-only API checked. FIX 2026-10-21 (Noam: "can't add a product photo"): no add button on My products, a photo with no words was sent as "what I just ate", and the bot's web search needed a paid key (VPS SearXNG mostly rate-limited). Now: "+ הוספת מוצר מתמונה" button, "שמור כמוצר / אכלתי את זה" choices on an attached photo, free `health_product_web_search` (SearXNG, Yandex fallback) + `health_product_read_page` tools, prompt says front-only photo → identify and look values up. Live image `hermes-agent:health-products-20261021` (rollback `*.bak-20261021-searchfix`); e2e `health-app/e2e/add-product.mjs` 14/14 on test copy, 12/12 look-only on live. His WIN! blondie-pretzel bar saved from the exact online label (240 kcal, 20 g protein per 64 g bar). Awaiting his first real add from the app/bot. 2026-10-21 later (Noam: Ctrl+V did nothing): paste (Ctrl/Cmd+V) and drag-and-drop of a picture in both coach chats (same preview/✕/choices) and on My products (same as the add button); `e2e/paste.mjs` real-clipboard desktop test 14/14 on test copy, look-only 11/11 on live. 2026-10-21 night (Noam: My products into settings + real segmentation/filters for many products, via impeccable): new Settings page (gear on Today) with My products, profile, plan, stretch breaks; reusable `public/listview.js` (search with Hebrew prefixes, category chips with counts, filter sheet on phone / side rail on computer, sort, paging, remembered choices); categories from one shared list `hermes-overlay/agent/product_categories.json` (bot assigns on save, app falls back, editable; bot keeps his category/star on updates), favorites (star), usage from the food log (recently/most eaten). Live bot image `hermes-agent:health-products-20261021b` (rollback `docker-compose.yml.bak-20261021-categories`), 17 bot tests, 48 app tests; test copy seeded with 101 products (`scripts/seed-staging-products.mjs`), `e2e/products-list.mjs` all pass on test copy and look-only on live (phone + computer) | FEATURE-021 |
| **TASK-119** | **Redraw 6 approved animations with printed captions or cut edges (Barbell_Bench_Press_-_Medium_Grip, Dumbbell_Bench_Press, Kettlebell_Pistol_Squat, Kettlebell_Turkish_Get-Up_Squat_style, One-Arm_Kettlebell_Floor_Press, Wrist_Extension_Isometric)** | **P1** | PLANNED | - |
| **TASK-081** | **Prove improved food flow in real Telegram bot end to end** | **P0** | IN PROGRESS | TASK-052 |
| **TASK-082** | **Restore in-control extension and automatic browser-session recovery** | **P0** | IN PROGRESS | - |
| **TASK-083** | **Generate and review complete exercise-animation library** | **P0** | IN PROGRESS — 2 approved CLI artwork calls; neutral review pending; motion incomplete | TASK-082 |
| **TASK-084** | **Reliable animation review learning loop and batch promotion/rejection delivery** | **P0** | IN PROGRESS — gates/bank installed locally; 0 full entries; not deployed | TASK-083 |
| ~~**FEATURE-001**~~ | ~~**Streaming responses to Telegram**~~ | **P1** | DONE | - |
| ~~**FEATURE-002**~~ | ~~**Session auto-naming from topic**~~ | **P2** | DONE | - |
| ~~**FEATURE-003**~~ | ~~**Inline /stop to cancel requests**~~ | **P1** | DONE | FEATURE-001 |
| ~~**FEATURE-004**~~ | ~~**Usage limit warning (5h/7d)**~~ | **P1** | DONE | - |
| **FEATURE-005** | **Codex backend support** | **P2** | IN PROGRESS | - |
| ~~**FEATURE-006**~~ | ~~**Voice message support (Groq Whisper)**~~ | **P2** | DONE | - |
| ~~**FEATURE-007**~~ | ~~**Session pinning**~~ | **P3** | DONE | - |
| ~~**FEATURE-008**~~ | ~~**Scheduled prompts**~~ | **P3** | DONE | - |
| ~~**FEATURE-009**~~ | ~~**AskUserQuestion as inline buttons**~~ | **P1** | DONE | FEATURE-001 |
| ~~**FEATURE-010**~~ | ~~**Slash commands & skills menu**~~ | **P1** | DONE | - |
| ~~**TASK-001**~~ | ~~**System prompt per session via /cc**~~ | **P2** | DONE | - |
| ~~**TASK-002**~~ | ~~**Projects sorted by usage frequency**~~ | **P2** | DONE | - |
| ~~**FEATURE-011**~~ | ~~**Multi-workspace via Telegram groups**~~ | **P1** | DONE | - |
| ~~**FEATURE-012**~~ | ~~**Workspace creation wizard**~~ | **P1** | DONE | FEATURE-011 |
| ~~**FEATURE-013**~~ | ~~**Workspace management (/workspace command)**~~ | **P2** | DONE | FEATURE-011 |
| **TASK-014** | **Codex auth + backend switching** | **P2** | IN PROGRESS | FEATURE-005 |
| ~~**BUG-001**~~ | ~~**Duplicate message on streaming HTML fallback**~~ | **P1** | DONE | - |
| ~~**BUG-002**~~ | ~~**Choice button text too long / cut off**~~ | **P1** | DONE | - |
| ~~**BUG-003**~~ | ~~**Project discovery misses code-only projects**~~ | **P1** | DONE | - |
| ~~**BUG-004**~~ | ~~**Frequent request timeout at 60s**~~ | **P1** | DONE | - |
| ~~**BUG-005**~~ | ~~**Mobile replies too long / mixed UI language**~~ | **P1** | DONE | - |
| ~~**BUG-006**~~ | ~~**Over-eager approval buttons cause response loops**~~ | **P1** | DONE | - |
| ~~**BUG-007**~~ | ~~**“load <project>” intent not switching project context reliably**~~ | **P1** | DONE | - |
| ~~**BUG-008**~~ | ~~**Filtered project picker callbacks select wrong project index**~~ | **P1** | DONE | - |
| ~~**BUG-009**~~ | ~~**Bot stops responding after file-change approval**~~ | **P1** | DONE | - |
| ~~**TASK-015**~~ | ~~**Bot responsiveness hardening**~~ | **P1** | DONE | - |
| ~~**TASK-016**~~ | ~~**Per-workspace whitelist / ACL**~~ | **P1** | DONE | FEATURE-011 |
| ~~**TASK-017**~~ | ~~**Directory-level execution guardrails**~~ | **P1** | DONE | TASK-016 |
| **TASK-018** | **Session export command (`/export`)** | **P2** | PENDING | - |
| **TASK-019** | **Safe Git helper commands (`/git`)** | **P2** | PENDING | - |
| **TASK-020** | **Crash-safe session resume after bot restart** | **P1** | PENDING | TASK-015 |
| **TASK-021** | **Workspace launch profiles (env/model/backend presets)** | **P2** | PENDING | FEATURE-011 |
| **TASK-022** | **Phone-requested controlled terminal jobs (`/exec`)** | **P2** | PENDING | TASK-017 |
| **TASK-023** | **Cross-device chat/session continuity** | **P2** | PENDING | TASK-020 |
| **TASK-024** | **Production-grade token-bucket quotas per chat/user** | **P1** | PENDING | TASK-015 |
| **TASK-025** | **Security audit log + incident timeline command** | **P1** | PENDING | TASK-016 |
| **TASK-026** | **Archive upload analysis with zip/tar safety checks** | **P2** | PENDING | TASK-017 |
| **TASK-027** | **Context-aware quick actions menu (`/actions`)** | **P2** | PENDING | FEATURE-010 |
| **TASK-028** | **Detailed usage/cost telemetry in status/health** | **P2** | PENDING | FEATURE-004 |
| ~~**TASK-029**~~ | ~~**Auto-project switching in ensureSessionForIncoming**~~ | **P1** | DONE | - |
| **TASK-030** | **acceptEdits permission mode for autonomous file editing** | **P1** | IN PROGRESS | - |
| **TASK-031** | **Telegram visual rendering (tables, assets)** | **P0** | IN PROGRESS | - |
| **BUG-032** | **Hebrew messages unclear / garbled RTL** | **P0** | IN PROGRESS | - |
| **TASK-033** | **Always show clickable buttons for options** | **P0** | IN PROGRESS | - |
| **TASK-034** | **Multi-account auth rotation + quota warnings** | **P1** | PENDING | FEATURE-004, TASK-014 |
| **FEATURE-014** | **Mid-stream message queue - read user messages during active processing** | **P0** | IN PROGRESS | TASK-015 |
| **FEATURE-015** | **Auto-action mode - act directly instead of presenting option buttons** | **P0** | IN PROGRESS | FEATURE-009 |
| **FEATURE-016** | **Dynamic image generation via /image command** | **P2** | DONE | - |
| **TASK-035** | **Response formatting - break long text into readable paragraphs with bullet points** | **P0** | IN PROGRESS | - |
| **TASK-036** | **Smart suggestion buttons - show clickable options when Claude asks user to choose** | **P0** | IN PROGRESS | FEATURE-015 |
| **FEATURE-017** | **Voice replies via ElevenLabs TTS** | **P2** | PENDING | FEATURE-006 |
| ~~**BUG-037**~~ | ~~**Suggestion buttons appear then disappear in Telegram**~~ | **P1** | DONE | TASK-036 |
| **FEATURE-018** | **Health tracking persistence layer (SQLite + charts + weekly summary)** | **P2** | PENDING | - |
| ~~**INQUIRY-038**~~ | ~~**Investigate bot context loss, wrong projects, folder access**~~ | **P0** | DONE | - |
| ~~**BUG-039**~~ | ~~**Project discovery shows 566 unrelated folders**~~ | **P0** | DONE | INQUIRY-038 |
| ~~**BUG-040**~~ | ~~**Session context loss after restart / failed resume**~~ | **P0** | DONE | INQUIRY-038 |
| ~~**TASK-041**~~ | ~~**Folder access UX: /access command + cross-project hints**~~ | **P1** | DONE | INQUIRY-038 |
| ~~**TASK-043**~~ | ~~**Network resilience: auto-retry transient errors + poll watchdog**~~ | **P1** | DONE | TASK-015 |
| ~~**TASK-044**~~ | ~~**VPS deployment: Docker + heartbeat failover + OpenRouter**~~ | **P1** | ✅ **DONE** (2026-03-08) |
| ~~**TASK-045**~~ | ~~**VPS deployment: Dockerfile + docker-compose**~~ | **P1** | ✅ **DONE** (2026-03-08) | TASK-044 |
| ~~**TASK-046**~~ | ~~**OpenRouter backend (replaces API key auth)**~~ | **P1** | ✅ **DONE** (2026-03-08) | TASK-044 |
| **TASK-047** | **VPS deployment: Set default model to Haiku 4.5** | **P2** | PENDING | TASK-046 |
| ~~**TASK-048**~~ | ~~**VPS deployment: Docker healthcheck + auto-restart on stuck**~~ | **P1** | ✅ **DONE** (2026-03-08) | TASK-045 |
| **TASK-049** | **VPS deployment: Caddy reverse proxy for webapp (port 3456)** | **P2** | PENDING | TASK-045 |
| ~~**TASK-050**~~ | ~~**VPS deployment: Migrate data (SQLite DBs + state.json)**~~ | **P1** | ✅ **DONE** (2026-05-09) | TASK-045 |
| **TASK-067** | **Persona separation hardened: forum topics require explicit /persona; new-day re-applies persona** | **P0** | ✅ **DONE** (2026-05-09) | - |
| **TASK-068** | **Polling offset advances after processUpdate (at-least-once delivery)** | **P1** | ❌ **REVERTED** (2026-05-09) — caused redelivery spam during long Claude runs because in-flight tasks delay offset advancement; reverted to original at-most-once behaviour | - |
| **TASK-076** | **REGRESSION: state.json must live on the bind-mounted volume** | **P0** | ✅ **DONE** (2026-05-09) — `STATE_PATH=/app/data/state.json` set in docker-compose; `config.js` auto-defaults to `./data/state.json` when `./data` exists; startup logs `[startup] statePath=…`. Root cause of "no memory + wrong persona" incident: bot was loading/saving an ephemeral `/app/state.json` inside the container so every restart wiped chatPersonas, persistentSessionByChat, activeThreadByChat, chatTitles. Tests in `test/statePath.test.js` and `test/statePersistence.test.js` lock this in. | - |
| **TASK-077** | **REGRESSION: persona regex must distinguish food vs exercise topics** | **P0** | ✅ **DONE** (2026-05-09) — `test/persona.test.js` (7 tests) covers: explicit thread override wins; chat-title regex auto-detect for non-forum chats; chat-level override beats title regex; reset override returns null; Hebrew titles. | - |
| **TASK-078** | **REGRESSION: persistentSessionByChat key round-trip** | **P0** | ✅ **DONE** (2026-05-09) — `test/statePersistence.test.js` asserts `<chatId>:<threadId>` keys (with negative numeric chatId) survive save→load and that the runtime persistKey computation matches the on-disk key string. | - |
| **TASK-079** | **REGRESSION: unknown top-level state keys must survive loadState** | **P0** | ✅ **DONE** (2026-05-09) — covered in `test/statePersistence.test.js`; protects future-added fields and the runtime-only ones (`activeThreadByChat`, `chatTitles`, `lastThreadByChat`) from silent drop on load. | - |
| **TASK-080** | **REGRESSION: docker-compose must set STATE_PATH** | **P1** | ✅ **DONE** (2026-05-09) — `docker-compose.yml` env now includes `STATE_PATH=/app/data/state.json`. Belt-and-braces against the `config.js` default. | - |
| **TASK-069** | **Hardcoded Ollama IP at config.js:92 — move to env-only with VPS validation** | **P1** | PENDING | - |
| **TASK-070** | **accountManager rotation lock: Promise chain → async-mutex** | **P1** | PENDING | - |
| **TASK-071** | **Docker healthcheck inline JS hangs on Node failure → curl-based** | **P1** | PENDING | - |
| **TASK-072** | **Container runs as root — add USER directive** | **P2** | PENDING | - |
| **TASK-073** | **Verify ensureSessionForIncoming chat-mutex placement (potential race)** | **P2** | PENDING | - |
| **TASK-074** | **Atomic state.json write fails on bind-mounted volumes** | **P2** | PENDING | - |
| **TASK-075** | **chatMutexes pool growth — TTL doesn't fire on dormant chats** | **P2** | PENDING | - |
| **TASK-051** | **VPS deployment: Startup notification (bot sends Telegram msg on boot)** | **P3** | PENDING | TASK-050 |
| **TASK-052** | **VPS deployment: End-to-end smoke test** | **P1** | PENDING | TASK-050 |
| **TASK-053** | **Strip coding-specific features for lifestyle bot instances** | **P2** | PENDING | TASK-044 |
| **TASK-054** | **Multi-instance support: spin up separate bots with different tokens/prompts** | **P2** | PENDING | TASK-052 |
| **FEATURE-019** | **Web search tool (live info, news, recipes, etc.)** | **P2** | PENDING | TASK-044 |
| **FEATURE-020** | **Video/content search (YouTube exercise videos, tutorials)** | **P2** | PENDING | TASK-044 |
| **INQUIRY-042** | **Evaluate custom app vs Telegram platform** | **P0** | IN PROGRESS | - |
| **TASK-055** | **Phase 1: Install Claude Code CLI in container Dockerfile** | **P0** | IN PROGRESS | TASK-046 |
| **TASK-056** | **Phase 1: Sync Claude OAuth credentials from PC to VPS** | **P0** | PENDING | TASK-055 |
| **TASK-057** | **Phase 1: Mount /root/.claude credentials volume in container** | **P0** | PENDING | TASK-056 |
| **TASK-058** | **Phase 1: Switch DEFAULT_BACKEND from openrouter to sdk** | **P0** | PENDING | TASK-057 |
| **TASK-059** | **Phase 2: Install Codex CLI in container Dockerfile** | **P1** | PENDING | TASK-058 |
| **TASK-060** | **Phase 2: Sync Codex OAuth credentials from PC to VPS** | **P1** | PENDING | TASK-059 |
| **TASK-061** | **Phase 2: Wire Codex backend errors into accountManager rotation** | **P1** | PENDING | TASK-060 |
| **TASK-062** | **Phase 3: Tunnel from VPS to local Ollama on user PC for Gemma 4** | **P2** | PENDING | TASK-058 |
| **TASK-063** | **Phase 3: Add Gemma backend handler in sessionManager** | **P2** | PENDING | TASK-062 |
| **TASK-064** | **Phase 3: Wire Gemma as final fallback in accountManager chain** | **P2** | PENDING | TASK-063 |
| **TASK-065** | **Remove OpenRouter backend code after fallback chain verified** | **P2** | PENDING | TASK-064 |
| **TASK-066** | **Restore historical context for food/exercise chats — re-bind to wrong thread** | **P0** | IN PROGRESS | - |

## Active Work

### TASK-082–084: Exercise animation production, review, and browser control (REVIEW)

Expanded scope recorded 2026-09-03:

- Restore the in-control extension from its development checkout through the actually installed extension identity, with a visible automatic reload/reconnect path and a version/error matrix; do not treat a build or connector process as proof of a usable authenticated browser session.
- Inventory missing exercise, stretch, warm-up, cool-down, broomstick-flexibility and Pomodoro-break animations under the latest approved contract. The current replacement policy supersedes the old title and one-second pose-strip rules: no embedded text, complete native motion, readable full-envelope fit, approved illustration, stable camera/scale and source-correct movement. See the 2026-10-04 status below; framing acceptance does not approve an animation.
- Keep candidate, review, rejected, and approved assets separate and versioned; provide dashboard filters, multi-select approval/rejection, categorized emoji rejection tags plus custom reasons, explicit send actions, and delivery to the bot working folders without overwriting approved assets.
- Preserve rejection media, structured reasons, gate measurements, prompts, hashes, and review decisions as durable lessons; use them for safe regeneration and frozen pass/fail regression fixtures, with deterministic checks separated from read-only visual review and human exercise-safety review.
- Verify focused tests, full tests, gallery visibility, and real authenticated browser behavior in sequence; record unavailable live, second-identity, backend-chaos, and human-safety checks as unverified rather than passed.

Current proof boundary:

- The actual installed unpacked extension is the Life-Boat \`tools/in-control\` checkout (ID \`bbehdjdhegeiiceimbfedoppbjhffnhk\`); it now has an explicit reconnect action and error matrix, and Chrome visibly lists that extension and ID after the source update. The exact version display still needs a clean structured read-back.
- Automatic reconnect success, authenticated Telegram inspection, and a fresh visible send receipt remain unverified because the live connector runner has not returned a receipt.
- Animation review contracts and deterministic checks exist in the workspace; complete library generation, visual approval, batch folder delivery, and live gallery verification remain in progress.

### TASK-081: Prove improved food flow in real Telegram bot end to end (IN PROGRESS)

Progress saved 2026-06-12:
- Deployed `dd07796` (`Make food logging useful without interrogation`), `b3a29ae` (`Protect food estimation prompt routing`), and `e6acacb` (`Mount food priors in production`) to `origin/main` and the VPS.
- The VPS `claude-and-conquer` container is healthy and actively polling after the 90s heartbeat failover.
- Production container smoke passed for:
  - known food prior text: `אכלתי 2 פיתות + גבינה לבנה 5%`
  - unknown food text with default portion guidance
  - food photo captioned `אל תשאל שאלות, תעריך`
- Production has food priors mounted at `/app/out`, including `/app/out/Health/Foods/2 פיתות + גבינה לבנה 5%.md` with the expected calorie/protein history.
- Full regression suite passed after the deploy-config guard was added: `STATE_PATH=/tmp/claude-and-conquer-goal-compose-full.json npm test` (12/12).

Remaining proof before DONE:
1. Manually send these in Telegram `excersize-bot` -> `food-logging`:
   - `אכלתי 2 פיתות + גבינה לבנה 5%`
   - `אכלתי מנה של מאכל חדש לגמרי שאין בהיסטוריה`
   - a food photo captioned `אל תשאל שאלות, תעריך`
2. Inspect the real bot replies and VPS logs.
3. Mark DONE only if the replies estimate calories/protein first and do not start an interrogation loop.

Current blocker:
- Automated real-user Telegram Desktop smoke is unsafe in this session because the desktop focus jumped between Telegram, FlowState, Signal, and browser/search overlays. Do not attempt blind typing into Telegram from automation unless focus can be locked and visually verified first.

### TASK-030: acceptEdits permission mode (IN PROGRESS)

Implemented:
- Added `--permission-mode acceptEdits` to both `sendInput` and `sendInputStreaming` CLI args
- Claude CLI now auto-approves file edits (Read/Edit/Write) without terminal prompt
- Bash commands remain controlled by project-level allow/deny rules

Testing:
- [ ] Send message asking bot to edit a file → should work without "permission blocked"
- [ ] Verify Bash commands still respect safety rules
- [ ] Confirm no regression in streaming responses

### TASK-029: Auto-project switching in ensureSessionForIncoming (DONE)

Implemented:
- `ensureSessionForIncoming` now runs `smartProjectMatchFromText` even when active session exists
- Auto-switches when message mentions a different project (with confirmation message)
- Reuses existing active sessions before creating new ones
- No false switches: same-project mentions stay on current session
- Cleaned up 11 temporary debug `console.log` statements from handlePhoto, runPromptForSession, and update handler

### FEATURE-005 / TASK-014: Codex backend maturity (IN PROGRESS)

Implemented:
- Session-level backend metadata (`claude` / `codex`)
- `/backend` command to inspect/switch backend
- Codex preflight check in `/status`
- Codex execution path with streaming emulation fallback

Remaining:
- Stronger Codex auth diagnostics (token/source-level)
- True native Codex streaming mode and tool event parity
- Backend-specific context migration options

### FEATURE-006: Voice message support (DONE)

Implemented:
- `src/voiceTranscribe.js` module using Groq Whisper API (`whisper-large-v3-turbo`)
- `handleVoice()` in index.js downloads OGG from Telegram, transcribes via Groq
- Shows transcript to user, then routes text to active Claude session
- Config keys: `groqApiKey`, `whisperModel` in config.js
- Requires `GROQ_API_KEY` in `.env` to activate (graceful skip if missing)

### TASK-018: Session export command (`/export`) (PENDING)

Planned scope:
- Export active session history to JSON/Markdown artifact
- Include metadata: session id, project path, backend, timestamps
- Optional export target path and Telegram file delivery

### TASK-019: Safe Git helper commands (`/git`) (PENDING)

Planned scope:
- Start with read-only git actions (`status`, `diff`, `log`)
- Strictly disable destructive git actions by default
- Optional ACL gating for higher-risk subcommands in future

### External Inspirations (added 2026-02-22)

Borrowed from `RichardAtCT/claude-code-telegram`:
- `TASK-018` Session export formats (`Markdown/HTML/JSON`)  
  Source: https://github.com/RichardAtCT/claude-code-telegram (working features list: session export)  
- `TASK-019` Safe git operations from chat  
  Source: https://github.com/RichardAtCT/claude-code-telegram (working features list: safe git operations)  
- `TASK-024` Token-bucket rate limiting and stronger per-user quotas  
  Source: https://github.com/RichardAtCT/claude-code-telegram (working features + config mentions token bucket/rate limits)  
- `TASK-025` Audit logging and security event tracking  
  Source: https://github.com/RichardAtCT/claude-code-telegram (working features/security sections)  
- `TASK-026` Archive upload analysis with extraction safety  
  Source: https://github.com/RichardAtCT/claude-code-telegram (working features: archive extraction)  
- `TASK-027` Context-aware quick actions  
  Source: https://github.com/RichardAtCT/claude-code-telegram (working features: quick actions)  
- `TASK-028` Usage and cost tracking expansion  
  Source: https://github.com/RichardAtCT/claude-code-telegram (working features: usage/cost tracking)

Borrowed from `Cerulin/Chell`:
- `TASK-020` Resume terminal/conversation after restart  
  Source: https://github.com/Cerulin/Chell (roadmap: resume on restart)  
- `TASK-021` Custom launch scripts/profiles  
  Source: https://github.com/Cerulin/Chell (roadmap: custom terminal launch profiles)  
- `TASK-022` Request terminal jobs from phone  
  Source: https://github.com/Cerulin/Chell (roadmap: request a terminal from phone)  
- `TASK-023` Sync chats across devices and handoff behavior  
  Source: https://github.com/Cerulin/Chell (roadmap: chat sync across devices / cloud handoff)

### TASK-043: Network resilience (DONE)

Bot would get stuck on transient network errors (ECONNRESET, fetch failed) without crashing, so systemd couldn't restart it.

Implemented:
- Auto-retry on transient network errors (ECONNRESET, ECONNREFUSED, ETIMEDOUT, fetch failed, terminated, socket hang up, EAI_AGAIN) in `runPromptStreaming()` — up to 2 retries with increasing delay (3s, 6s)
- Hebrew status message shown during retry: "שגיאת רשת זמנית, מנסה שוב"
- Poll watchdog: checks every 60s if last successful poll was >5 minutes ago, force-exits for systemd restart
- Existing `Restart=on-failure` + `RestartSec=5s` in systemd handles the watchdog exit

### TASK-044: VPS Deployment via Docker + Heartbeat Failover (DONE 2026-03-08)

Deployed bot to Contabo VPS (84.46.253.137) as a Docker container with heartbeat-based primary/standby failover. Local bot is primary (SDK/Max), VPS is standby (OpenRouter/Haiku).

**What was built:**
- Dockerfile + docker-compose.yml + .dockerignore
- OpenRouter streaming backend (src/openRouterBackend.js)
- Heartbeat failover system (src/failover.js): local sends heartbeats every 30s, VPS activates after 90s silence
- Doppler secrets management on VPS
- Deploy script (scripts/deploy-vps.sh)
- UFW firewall: port 3456 open from local IP only

**Decision log:**
- Local OAuth/Max subscription is not viable on VPS (ToS restrictions, token expiry)
- OpenRouter chosen for multi-model flexibility (Haiku 4.5 default, can switch per-session)
- Default model: Haiku 4.5 ($1/$5 per 1M tokens) -- best Hebrew quality + cheapest Claude
- Use case: food tracking, exercise logging, news, general assistant (not coding)

**Sub-tasks:**

| Sub-task | Status | Notes |
|----------|--------|-------|
| TASK-045: Dockerfile + docker-compose + .dockerignore | DONE | Node 20 slim + native deps |
| TASK-046: OpenRouter backend | DONE | SSE streaming, model-agnostic |
| TASK-047: Default model to Haiku 4.5 | PENDING | Set in VPS .env |
| TASK-048: Docker healthcheck | DONE | /health endpoint, auto-restart |
| TASK-049: Caddy config for webapp | PENDING | Reverse proxy port 3456 on VPS |
| TASK-050: Data migration | ✅ DONE | 2026-05-09: re-imported 631 pre-Apr-16 messages of session `09c1330f-…` from local `data/bot.db` into VPS `/opt/claude-and-conquer/data/bot.db` via `db.importMessages`. VPS main session now has 760 messages (Feb 17 → May 5). VPS reset on Apr 16 23:43 IDT (`state.json.pre-clean-20260416-234354`) had wiped pre-Apr-16 history; recovered from local repo. |
| TASK-051: Startup notification | PENDING | Bot sends "I'm online" on Telegram at boot |
| TASK-052: E2E smoke test | PENDING | Full cycle: send msg -> get response on VPS |

**Architecture:**
```
Local (primary)                    VPS (standby)
┌─────────────┐   heartbeat/30s   ┌──────────────┐
│ SDK backend  │ ───────────────→ │ OpenRouter    │
│ Telegram poll│                  │ Standby mode  │
│ Port 3456    │                  │ Port 3456     │
└─────────────┘                  └──────────────┘
If heartbeats stop for 90s → VPS activates polling
```

### TASK-053: Strip coding features for lifestyle bot instances (PENDING)

For non-coding bot instances (food tracker, exercise coach, etc.), strip or disable:
- Project browsing/switching
- File editing / acceptEdits mode
- Git helpers
- Directory guardrails
- Codex backend

Keep: chat, voice, image gen, session management, SQLite history, webapp rendering.
Approach: config flag (`BOT_MODE=lifestyle` vs `BOT_MODE=coding`) rather than forking code.

### TASK-054: Multi-instance support (PENDING)

Spin up multiple bot instances from the same codebase with different configs:
- Each instance gets its own Telegram bot token, system prompt, and model
- docker-compose with multiple services or a shared image + per-instance .env
- Shared SQLite DB or isolated per-instance
- Example instances: food-tracker, exercise-coach, news-digest, general-assistant

### FEATURE-014: Mid-stream message queue (IN PROGRESS)

When Claude is processing a request, the user can send additional messages. Currently these spin-wait in `withChatLock` and fire as separate turns. Instead:

Scope:
- [ ] Add per-chat message buffer (`pendingMessages`) that collects messages arriving during an active run
- [ ] After current Claude response completes, check buffer and auto-send accumulated messages as a combined follow-up
- [ ] If user sends message with new info mid-stream, append it to the active Claude session context
- [ ] Support mid-stream cancellation: if user sends "stop" or contradicting instruction, cancel current run and start fresh with new context

Architecture:
- Replace `withChatLock` busy-wait with proper queue
- `pendingMessages[chatId]` array collects messages while `activeRunsByChat.has(chatId)`
- On run completion, drain queue: join messages, send as single follow-up prompt
- For SDK backend: investigate `AbortController` + re-query with appended context

### FEATURE-015: Auto-action mode (IN PROGRESS)

Claude should act directly on what it thinks the user means, without creating numbered option lists with inline keyboard buttons.

Scope:
- [ ] Add system prompt instruction telling Claude to act directly, not present options
- [x] Remove or gate `extractChoices` + `buildChoicesKeyboard` from the response flow
- [x] Keep buttons only for explicit tool calls (`AskUserQuestion`) and command menus
- [ ] Add config flag `AUTO_ACTION_MODE=true` in .env to toggle behavior

Architecture:
- System prompt addition: "Act on the user's intent directly. Do not present numbered option lists."
- In `sendFinalStreamedReply`: skip `extractChoices` when AUTO_ACTION_MODE is on
- In `sendClaudeReply`: same skip
- Preserve buttons for: `/commands`, `/menu`, `/projects`, explicit `AskUserQuestion` tool calls

### TASK-036: Smart suggestion buttons (IN PROGRESS)

When Claude presents suggestions/recommendations and asks the user to choose, auto-generate clickable inline buttons. When Claude is just executing, no buttons.

Scope:
- [ ] Detect "suggestion mode": response ends with a question AND contains bullet/numbered list items
- [ ] Extract list items as clickable buttons (max 8)
- [ ] Always add "Write my own..." free-text button
- [ ] Do NOT trigger on execution responses (no trailing question)
- [ ] Works with both Hebrew and English

Architecture:
- New function `extractSuggestionButtons(text)` that checks: (1) last line is a question, (2) text has bullets/numbered items
- Replaces the old always-on `extractChoices` behavior
- `autoActionMode` stays on for Claude's behavior, but bot UI still generates buttons when appropriate

### TASK-035: Response formatting (IN PROGRESS)

Bot responses should be well-structured and readable, not long text blobs.

Scope:
- [ ] Add system prompt rules for formatting: short paragraphs, bullet points, blank lines between sections
- [ ] Ensure Hebrew RTL formatting works with structured text
- [ ] Keep responses concise (3-8 lines default) with clear visual separation

### FEATURE-019: Web search tool (PENDING)

Give the bot access to live web information for news, recipes, health info, etc.

**Options:**
- **Anthropic tool_use with web search**: Claude's API supports tool calling -- define a `web_search` tool, bot executes it and returns results to Claude
- **Brave Search API**: Free tier (1 req/sec, 2000/month). Cheap paid tiers.
- **SerpAPI / Serper.dev**: Google results via API ($50/month for 5000 searches, or free tiers)
- **Tavily**: Built for AI agents, returns clean summaries ($0.01/search)

**Recommended:** Tavily or Brave Search -- both cheap, AI-optimized, easy to integrate as a Claude tool.

### FEATURE-020: Video/content search (PENDING)

Search YouTube for exercise videos, tutorials, cooking guides, etc.

**Options:**
- **YouTube Data API v3**: Free quota (10,000 units/day, search costs 100 units = 100 searches/day). Returns video titles, thumbnails, links.
- **Invidious API**: No API key needed, but less reliable
- **SerpAPI YouTube search**: Paid but structured results

**Recommended:** YouTube Data API v3 -- free tier is plenty for personal use. Bot sends video link + thumbnail in Telegram.

**Flow:** User says "show me a 10 minute core workout" -> Claude calls `search_videos` tool -> bot queries YouTube API -> returns top 3 results as Telegram messages with video links.

### INQUIRY-042: Evaluate custom app vs Telegram platform (IN PROGRESS)

After 40+ features/fixes on Telegram, evaluating whether to build a custom web/mobile app, stay on Telegram, or take a hybrid approach.

**14 hard Telegram platform constraints identified:**

| # | Constraint | Impact |
|---|-----------|--------|
| 1 | 3900-char message cap | Long responses split into fragments |
| 2 | Edit rate limit (1.2s) | Streaming feels laggy, tokens dropped |
| 3 | No syntax highlighting | Code is monochrome `<pre>` blocks |
| 4 | No markdown tables | Full conversion layer needed (90+ lines) |
| 5 | 64-byte callback_data | Buttons carry indices, not data |
| 6 | RTL/Hebrew bidi broken | Every line needs manual Unicode marks |
| 7 | No file/diff views | Can't show code changes visually |
| 8 | No multi-select buttons | One tap at a time only |
| 9 | HTML-only formatting | No rich components or custom layouts |
| 10 | AskUserQuestion incompatible | Claude's native tool doesn't work |
| 11 | Single-channel per session | Queue + drain pattern required |
| 12 | Forum topics fragile | TOPIC_CLOSED errors, stale thread IDs |
| 13 | Voice capped at 5 min | 20MB file download limit |
| 14 | No push if bot down | No background notification mechanism |

**What Telegram gives for free:** Cross-platform clients, push notifications, auth/identity, file sharing, message history, offline queuing, groups/forums, Bot API, zero client hosting, inline keyboards.

**Options evaluated:**

| Option | Effort | Verdict |
|--------|--------|---------|
| **A: Stay on Telegram** | Low | Iterative improvement, but 5+ constraints are fundamental and unsolvable |
| **B: Custom Web App** | Very High (3-6 months) | Full control but rebuilds everything Telegram gives for free |
| **C: Hybrid (Recommended)** | Medium | Keep Telegram for chat, build companion web app for rich content |

**Option C detail:** Keep Telegram as primary chat interface. Build companion web app for rich rendering (code with syntax highlighting, diffs, dashboards, settings, analytics). "View in app" buttons link from Telegram to web dashboard. Existing `src/webapp/server.js` is the starting point. Incremental migration, not a rewrite.

**Status:** Awaiting user decision on direction.

### FEATURE-016: Dynamic image generation via /image (DONE)

Implemented:
- `generateImage()` function with 11-model catalog across 7 providers
- `resolveModel()` for fuzzy model name matching
- `/image [model:name] <prompt>` command in bot
- `sendPhoto()` method added to TelegramApi
- Fixed `_uploadRequest` to use native FormData (removed undici dependency)
- Fixed `num_images` string bug

### TASK-015: Responsiveness hardening (DONE)

Implemented:
- Polling loop now dispatches updates asynchronously (no long-request blocking of polling)
- In-flight update cap and lag telemetry (`state.updateLagMs`)
- Run watchdog timeout for stuck requests
- Debounced state writes for reduced I/O contention, with explicit flush on critical exits
- `/health` command for runtime diagnostics

### Workspace + Access Safety (DONE)

Implemented:
- Multi-workspace metadata tracking per chat
- Workspace wizard intent (`create workspace` / `/workspace create`)
- `/workspace list|rename|archive|roots`
- Per-workspace ACL roles (`owners/operators/readers`) via `/acl`
- Directory allowlist guardrails via workspace `allowedRoots`

## Completed

| ID | Title | Completed |
|----|-------|-----------|
| ~~FEATURE-001~~ | Streaming responses to Telegram | 2026-02-18 |
| ~~TASK-002~~ | Projects sorted by usage frequency | 2026-02-18 |
| ~~BUG-003~~ | Project discovery misses code-only projects | 2026-02-20 |
| ~~BUG-002~~ | Choice button text too long / cut off | 2026-02-20 |
| ~~BUG-004~~ | Frequent request timeout at 60s | 2026-02-20 |
| ~~BUG-005~~ | Mobile replies too long / mixed UI language | 2026-02-20 |
| ~~BUG-006~~ | Over-eager approval buttons cause response loops | 2026-02-20 |
| ~~BUG-007~~ | “load <project>” intent not switching project context reliably | 2026-02-20 |
| ~~BUG-008~~ | Filtered project picker callbacks select wrong project index | 2026-02-20 |
| ~~FEATURE-004~~ | Usage limit warning (5h/7d) | 2026-02-20 |
| ~~FEATURE-002~~ | Session auto-naming from topic | 2026-02-22 |
| ~~FEATURE-003~~ | Inline /stop to cancel requests | 2026-02-22 |
| ~~FEATURE-007~~ | Session pinning | 2026-02-22 |
| ~~FEATURE-008~~ | Scheduled prompts | 2026-02-22 |
| ~~FEATURE-009~~ | AskUserQuestion as inline buttons | 2026-02-22 |
| ~~FEATURE-010~~ | Slash commands & skills menu | 2026-02-22 |
| ~~TASK-001~~ | System prompt per session | 2026-02-22 |
| ~~FEATURE-011~~ | Multi-workspace via Telegram groups | 2026-02-22 |
| ~~FEATURE-012~~ | Workspace creation wizard | 2026-02-22 |
| ~~FEATURE-013~~ | Workspace management | 2026-02-22 |
| ~~BUG-001~~ | Duplicate message on streaming HTML fallback | 2026-02-22 |
| ~~BUG-009~~ | Bot stops responding after file-change approval | 2026-02-22 |
| ~~TASK-015~~ | Bot responsiveness hardening | 2026-02-22 |
| ~~TASK-016~~ | Per-workspace whitelist / ACL | 2026-02-22 |
| ~~TASK-017~~ | Directory-level execution guardrails | 2026-02-22 |
| ~~FEATURE-006~~ | Voice message support (Groq Whisper) | 2026-02-25 |
| ~~FEATURE-016~~ | Dynamic image generation via /image | 2026-02-25 |
| ~~TASK-043~~ | Network resilience: auto-retry + poll watchdog | 2026-03-05 |

---

## 2026-10-02 — Review findings and exercise-animation target pipeline (PROPOSED / TODO)

Source: read-only review `claude-and-conquer-review-2026-10-02.md` (kept outside the repo, in the agent workspace). Everything below is **proposed**; nothing here is implemented, and no existing task was edited. IDs continue after TASK-084 / BUG-040. Effort: S ≤ half a day, M ≤ 2 days, L > 2 days. Priority: P0 urgent, P1 soon, P2 later.

Context that applies to all general tasks: per `CLAUDE.md:3-8` the live Telegram bot has been the Hermes `hermes-gateway` container since 2026-07-07 and this repo's container is stopped on purpose, so the general tasks protect the dev copy, the animation workspace and a possible failover run, not live traffic.

### General findings

| ID | Title | Priority | Effort | Status | Dependencies |
|----|-------|----------|--------|--------|--------------|
| BUG-041 | Test suite writes to the real `data/state.json` | P0 | S | TODO | - |
| BUG-042 | 17 of 146 tests fail (all sharedContext) | P1 | S–M | TODO | BUG-041 |
| TASK-085 | CI plus one test command that also runs the Python tests | P1 | M | TODO | BUG-041, BUG-042 |
| BUG-043 | Webapp binds `0.0.0.0` and heartbeat secret has a public default | P0 | S | TODO | - |
| TASK-086 | Harden agent privileges (`acceptEdits`, raw `/cc`, root container) | P1 | M | TODO | - |
| TASK-087 | Split `src/index.js` and `src/sessionManager.js` | P2 | L | TODO | BUG-041, TASK-085 |
| BUG-044 | Ollama URL default is a hardcoded private IP | P2 | S | TODO | - |
| TASK-088 | Collapse the HANDOFF files | P2 | S | TODO | - |
| TASK-089 | Clean the repo root and back up / ignore `out/` and `exercise-demos/` | P1 | S | TODO | - |
| BUG-045 | README documents PM2 scripts that do not exist | P2 | S | TODO | - |
| TASK-090 | Retire or fence `src/imageGen.js` (GPT Image 1.5 route vs "GPT Image 2 / Seedream 5 only") | P1 | S | TODO | - |

#### BUG-041: Test suite writes to the real `data/state.json` (TODO, P0, S)
- Evidence: `package.json:9` runs `node --test --test-concurrency=1`. `test/statePath.test.js` and `test/statePersistence.test.js` use temp dirs, but other tests load the app: `test/processUpdate.e2e.test.js:60` mutates `__testHooks.state`, and `src/index.js:8` loads `./state/store` while `src/index.js:55,67` call `persistStateNow()`. Running the suite on 2026-10-02 rewrote `data/state.json` and `data/state.json.bak` (both gitignored: `.gitignore:3`).
- Do: have `npm test` set `STATE_PATH` to a fresh temp file and `HOME`/`CLAUDE_CONFIG_DIR` to a temp dir (a small `test/setup.js` loaded with `--import`/`--require`, or a `scripts/run-tests.js` wrapper); make `src/state/store` refuse the default path when `NODE_ENV=test`. Add a test that fails if `data/state.json` mtime changes during the run.
- Done when: running `npm test` leaves `data/` untouched (checked by mtime/hash).

#### BUG-042: 17 of 146 tests fail, all in sharedContext (TODO, P1, S–M)
- Evidence: observed run of `node --test` on 2026-10-02: 146 tests, 17 failing, numbered #113–132, all in `test/sharedContext.test.js`. Cause not investigated.
- Do: run that file alone with isolated state (after BUG-041), classify as stale test vs real bug, fix or delete each with a note here. Do not mark them skipped silently.
- Done when: `npm test` is green or each remaining skip has an owner and reason.

#### TASK-085: CI and a single test command (TODO, P1, M)
- Evidence: there is no `.github/` directory; the Python tests (`test/audit-exercise-candidate.test.py`, `test/exercise-no-title.test.py`, `test/rigged-exercise-pilots.test.py`) are not run by `npm test` (`package.json:9`).
- Do: add `npm run test:all` (node tests + `python -m pytest`/`unittest` for `test/*.py`), a minimal CI workflow (install, lint if any, `test:all`, with the BUG-041 isolation), and fail CI when `data/state.json` changes. Add the frozen exercise-animation fixtures to the required set (`test/frozen-exercise-animation-fixtures.test.js`).

#### BUG-043: Webapp bind and default secret (TODO, P0, S)
- Evidence: `src/webapp/server.js:807` `server.listen(port, '0.0.0.0', …)`; `docker-compose.yml:11` publishes `3456:3456`; `src/failover.js:7` `HEARTBEAT_SECRET = process.env.HEARTBEAT_SECRET || 'cnq-heartbeat'`.
- Do: bind to `127.0.0.1` unless `WEBAPP_HOST` is set; publish compose as `127.0.0.1:3456:3456` (or behind the existing reverse proxy); fail startup when failover is enabled and `HEARTBEAT_SECRET` is unset; verify the Mini App `initData` check still runs on every route.
- Done when: a request from another host to port 3456 is refused, and startup without a secret fails with a clear message.

#### TASK-086: Harden agent privileges (TODO, P1, M)
- Evidence: `src/sessionManager.js:905` and `:1663` use `permissionMode: 'acceptEdits'` (see TASK-030); `src/index.js:3532` `/cc` forwards raw input; `Dockerfile` has no `USER` (runs as root) and `docker-compose.yml:15-17` mounts `/opt/claude-auth` and `/opt/codex-auth` read-write at `/root/.claude` and `/root/.codex`.
- Do: confirm the owner check covers `/cc` and the webapp, add an allowlist of slash commands that may be forwarded, run the container as a non-root user with a read-only root filesystem and the auth mounts read-only where the CLIs allow it, and document why `acceptEdits` is acceptable (or replace with per-tool approval) in this plan next to TASK-030.

#### TASK-087: Split the two giant files (TODO, P2, L)
- Evidence: `src/index.js` 4,633 lines, `src/sessionManager.js` 1,928 lines.
- Do: only after BUG-041/TASK-085 give a safety net; extract by seam (commands, callbacks, voice, projects, menus), one PR per module, with no behavior change.

#### BUG-044: Hardcoded Ollama address (TODO, P2, S)
- Evidence: `src/config.js:106` defaults `OLLAMA_URL` to `http://100.123.175.54:11434` (a Tailscale-range address, not a LAN one).
- Do: default to empty/disabled and log once when unset; document `OLLAMA_URL` in `.env.example`.

#### TASK-088: HANDOFF sprawl (TODO, P2, S)
- Evidence: `HANDOFF.md` plus seven `HANDOFF-20261001-{b..h}.md` files created on 2026-10-01 (some tracked, some untracked: `git status` shows `A HANDOFF-20261001-f.md`, `?? HANDOFF-20261001-g.md`, `?? …-h.md`).
- Do: fold the still-true content into `HANDOFF.md` and the animation docs, move the rest under `docs/handoffs/`, and agree a rule (one rolling handoff per workstream). Nothing is deleted without Noam's approval.

#### TASK-089: Stray root files and large untracked assets (TODO, P1, S)
- Evidence: untracked at the repo root: 13 PNG screenshots (`animation-dashboard*.png`, `dashboard-*.png`, `exercise-*.png`), `animation-dashboard.html` (1.1 MB), `live-gallery-index.html`, six `live-review-sheet-0N-frame-{a,b}.json` (1.5–2.2 MB each), `public-*.json`, `zellij-clipboard-fix-log.txt`; `out/` is 464 MB and `exercise-demos/` 91 MB, both untracked, with only 76 files tracked in git.
- Do: move screenshots and review JSON under `docs/evidence/` or `out/review/`; add `.gitignore` entries for generated outputs; decide where the approved GIFs and cast PNGs live permanently (git-LFS, a bucket, or the Hermes repo's `assets/exercise_demos/`) and **back them up first**, because the only copy of costly generations is this untracked tree.

#### BUG-045: README claims PM2 supervision that does not exist (TODO, P2, S)
- Evidence: `README.md:14` and `:66-69` document `npm run pm2:start`; `package.json` has only `service:*` scripts that call `systemctl --user` (lines 11–18), and `docker-compose.yml` uses `restart: unless-stopped`.
- Do: replace with the real supervision (systemd user unit or Docker) and mention the "live bot is Hermes" banner from `CLAUDE.md` in the README.

#### TASK-090: Stale `src/imageGen.js` route (TODO, P1, S)
- Evidence: `src/imageGen.js:17-18` lists `gpt-image` (GPT-4o Image) and `gpt-image-1.5` (`gpt-image/1.5-text-to-image`, "GPT Image 1.5") via Kie AI keyed by `IMAGE_GEN_API_KEY`. The exercise route does not use it, and the rule for exercise visuals is GPT Image 2 or Seedream 5 only.
- Do: either remove the 1.5 / GPT-4o entries from the picker or label `/image` as "general images, not for exercise assets"; add a test that exercise tooling never imports `src/imageGen.js`. Any removal needs Noam's go-ahead (the `/image` feature is FEATURE-016, DONE).

### Exercise-animation target pipeline (extends TASK-083 / TASK-084)

**Current status — 2026-10-04:** The table reflects scoped local implementation below; no task here is complete or deployed. Detailed bullets retain the 2026-10-02 proposals as history. Current release requirements are in `docs/exercise-animation-review-contract.md` and the 2026-10-04 update: native 24 fps, no text, one initial uniform full-envelope fit (no universal cast height), no per-frame recentering/scale or fabricated poses, and required independent/user/safety review. Proposed sparse/interpolated timing and numeric heuristics alone cannot approve a replacement. The separate Hermes assembler, live provider evaluation and real end-to-end delivery remain pending.

Evidence base: all 94 live gallery cards fail review (`public-exercise-visual-review.json`: 94 cards, 826 frames, 0 full loops verified; 65 flagged realistic/photographic, about 46 cropped or too small, 28 with embedded text); GIF timing is inconsistent (of 76 GIFs, 31 are 8×220 ms, 21 are 4 frames at 520–1100 ms, 18 are 7×1000 ms, 6 are 5×1000 ms); Quad r6 `registration.json` shows the support toe drifting 48 px between frames before post-hoc translation, and `normalise_height` (`scripts/build-grid-candidate-gif.py:39`) forces every Shoulder r2 frame to 628 px, hiding raw scale drift; the per-frame `ADAPTIVE` palette at `scripts/build-grid-candidate-gif.py:151` can shimmer.

Three implementations overlap today: (1) the skill/workflow (`~/.codex/skills/exercise-demo-gifs`, `~/.claude/workflows/exercise-demo-batch.js`, Magnific `images_generate`, `build_demo_gif.py`); (2) the Hermes production tool (`devops/hermes/exercise-library`, branch `feat/exercise-library`: `tools/exercise_demo_generator.py` — `MAX_GENERATION_ATTEMPTS=3` at line 55, `_physics_contract` at line 59, prompt at line 294 — and `tools/exercise_strip.py`); (3) this repo's candidate scripts (`scripts/build-grid-candidate-gif.py`, `scripts/build-exercise-candidate.py`).

**Cross-repo note:** the Hermes side has no MASTER_PLAN for the exercise library (`devops/hermes/MASTER_PLAN.md` covers other work; the worktree `devops/hermes/exercise-library` has only `HANDOFF.md`). Tasks below that must land in the Hermes worktree are marked **[Hermes]** and are tracked here only. The worktree currently has uncommitted edits (`scripts/build_exercise_index.py`, `tools/check_bot_demos.py`, three test files), so coordinate before touching it.

| ID | Title | Priority | Effort | Status | Dependencies |
|----|-------|----------|--------|--------|--------------|
| TASK-091 | Per-exercise JSON manifest | P0 | M | IN PROGRESS — frozen C&C manifest installed/tested; cross-path parity pending | - |
| TASK-092 | Locked inputs on every call: cast, style anchor, canvas template | P0 | S | IN PROGRESS — three hashed inputs enforced offline; live calls unverified | TASK-091 |
| TASK-093 | Star-of-edits keyframe generation (GPT Image 2 only) | P1 | M | IN PROGRESS — 2 approved CLI artwork calls; corrected neutral pending review; motion withheld | TASK-091, TASK-092 |
| TASK-094 | One shared deterministic assembler with GIF + MP4/WebM output **[Hermes]** | P0 | M | IN PROGRESS — C&C native exports tested; shared Hermes assembler pending | TASK-091 |
| TASK-095 | Automatic QA gate: numeric checks plus vision rubric | P0 | M | IN PROGRESS — required proportions gate enforced/tested locally; live visual/model validation pending | TASK-094 |
| TASK-096 | Human approval gate reads QA results | P1 | S | IN PROGRESS — reference-bound proportions/landmarks gate installed; real approvals/dashboard proof pending | TASK-095 |
| TASK-097 | Cost ledger and cache keyed by prompt+reference hash | P1 | S–M | IN PROGRESS — bounded ledger/cache tested; upstream cost unverified | TASK-091 |
| TASK-098 | Consolidate the three overlapping implementations **[Hermes]** | P1 | L | PLANNED — generators not consolidated; live end-to-end proof pending | TASK-094, TASK-095 |

#### TASK-091: Per-exercise JSON manifest (IN PROGRESS, P0, M)
- Fields: `exercise_id` (DatasetId), each character's approved cast ID plus PNG SHA256 (including women and varied body types; no universal male/female proportions template), camera and facing, anchor point and ground line, `keyframes[]` (N ≥ 8, each with joint-level pose text, e.g. "left knee 90°, right foot planted"), physics contract (reuse `_physics_contract`, `exercise_demo_generator.py:59`), loop rule (first and last frame match), frame delays, attempt budget, and a state machine (`draft → generating → qa_failed|qa_passed → human_approved → promoted`).
- Done when: Calf, Shoulder Rolls and Quad have manifests that reproduce their accepted candidates, and every script reads the manifest instead of ad-hoc arguments.

#### TASK-092: Locked inputs (IN PROGRESS, P0, S)
- Every generation call passes the same three inputs: the cast PNG, one approved style-anchor strip, and a canvas template (fixed margins, ground line). Hash all three into the manifest and reject a run when a hash differs. Evidence: skin colour stays consistent only when the reference is passed (cast RGB 189,149,121; Shoulder r2 ≈ 195,151,122; Quad r6 ≈ 199,146,114).

#### TASK-093: Star-of-edits keyframes (IN PROGRESS, P1, M)
- Generate each hard pose as an edit of keyframe 1 (or the grid) rather than a chain, so errors do not accumulate; keep GPT Image 2 only. Evidence: Pass-Through needed 7 batches and is still contested; Quad needed 6; documented failures include a duplicated shoe (Quad r3), detached fragments (Pass-Through r6), and a reversal before closing (Arm Circles r1) in `HANDOFF.md` and the feedback doc.

#### TASK-094: Shared deterministic assembler **[Hermes]** (IN PROGRESS, P0, M)
- One module used by both repos: global scale from the cast height (frames more than 3% off are flagged, not silently rescaled; replaces `normalise_height` median behaviour), shared global palette (replace per-frame `ADAPTIVE`), at least 8 frames at ≤ 250 ms, GIF plus MP4 and WebM via ffmpeg (Hermes already has an optional MP4 path at `exercise_strip.py:415-440`), integer registration only, and interpolation as an optional step that must pass TASK-095.
- Done when: the same inputs give byte-identical output twice, and Calf/Shoulder/Quad rebuild from stored raw panels.

#### TASK-095: Automatic QA gate (IN PROGRESS, P0, M)
- Numeric support: character-specific reference measurements, stable body anchors and plausible segment-length observations where landmarks are established; account for camera/foreshortening and uncertainty. Fragment/edge/timing checks remain supporting diagnostics. Numeric thresholds never certify anatomy or override a failed/unverified visual proportions gate. Reuse `scripts/check-exercise-animation-pixels.py` and `scripts/audit-exercise-candidate.py`.
- Required visual proportions gate: compare every generated character, including women, with their own approved cast; review head/body, torso/pelvis/legs, upper/lower limb segments, joints, hands, feet, perspective and all-frame temporal consistency. Unknown landmarks are unverified. Numeric, style, canvas and frame-count passes cannot replace actual independent visual review or override failure. Model scores remain supporting defect observations rather than anatomical approval.
- A candidate with any blocker never reaches the dashboard. Failing scores block publication.

#### TASK-096: Human gate (IN PROGRESS, P1, S)
- Keep the existing dashboard and `scripts/promote-exercise-animation.js` approval as the last step; show the QA scores and defect tags beside each candidate and require a hash match between the reviewed bundle and the promoted bundle.

#### TASK-097: Cost ledger and cache (IN PROGRESS, P1, S–M)
- Append-only JSONL: timestamp, exercise, attempt, prompt hash, reference hashes, credits/cost, outcome. Cache generated panels by `(prompt hash + reference hashes)`; cap at 3 attempts per exercise per day without an explicit override. Evidence: about 350 credits per exercise on the Magnific route; accepted results took 2, 2, 6 and 7+ attempts.

#### TASK-098: Consolidate three implementations **[Hermes]** (PLANNED, P1, L)
- Pick the Hermes `tools/exercise_demo_generator.py` + `tools/exercise_strip.py` as the single implementation, move the manifest, assembler and QA into it, make `~/.codex/skills/exercise-demo-gifs`, the workflow, and this repo's scripts thin callers, and retire duplicates after one exercise has gone through the new path end to end. Preserve `docs/exercise-animation-review-contract.md` semantics (hash-bound evidence, verifiers, promote).

### Suggested order
1. BUG-041, BUG-043 (small, risky today) and TASK-089's backup step.
2. TASK-091, TASK-094, TASK-095 (the animation quality gate).
3. BUG-042 + TASK-085, then TASK-092/093/096/097, then TASK-086, TASK-090, BUG-044/045, TASK-088; TASK-087 and TASK-098 last.

## 2026-10-02 — Health product: deep-review tasks (PROPOSED / TODO)

> **Note — product name pending.** The product that contains the food and exercise bots has no agreed name yet; Noam chooses between **fuel-and-form, vitalog, tempo, bodyledger, kav-briut** (TASK-112). This repo name `claude-and-conquer` is historical and does not describe it. The "two bots" are not two Telegram bots: they are **topic 306 (Fuel / Diet Bot, food + calories)** and **topic 303 (Form / "excersize bot", workouts + exercise demos)** of the VPS Hermes gateway (group "Concil of bots" `-1004230590253`, identity `claude_and_conquer_bot`). Hermes is the platform, not a bot; use the handles `fuel` and `form` (see `devops/brainiac/BOTS.md`).

Source: read-only review `health-product-deep-review-2026-10-02.md` (kept outside the repo in the agent workspace; supersedes the earlier superficial review). Everything below is **proposed**; nothing is implemented and no existing task was edited. IDs continue after TASK-098 / BUG-045. Tasks marked **[Hermes repo]** land in the Hermes code (`devops/hermes`; the deployed worktree is `devops/hermes/exercise-library`, branch `feat/exercise-library`; the ledger code is in `devops/hermes/.worktrees/pa-stab-003`, branch `fix/pa-stab-003-implementation`) and need Noam's approval before any change there. Hermes-repo paths below are relative to `devops/hermes/.worktrees/pa-stab-003` unless stated. Effort: S ≤ half a day, M ≤ 2 days, L > 2 days.

Context: a shared health ledger already exists (`agent/health_state.py`, `tools/health_tool.py`, commit `ea21c45c4e` 2026-07-20): both topics log and read meals/workouts through `health_log_event`, `health_correct_event`, `health_get_day`. What is missing is profile, goals, weight, injuries, preferences, plans, structured food data and safety wording. Persona prompts live only in VPS `config.yaml` (`telegram.channel_prompts`), so their text and safety wording are unverified.

| ID | Title | Priority | Effort | Status | Dependencies |
|----|-------|----------|--------|--------|--------------|
| TASK-099 | Commit the health ledger into the deployed branch + back up ledger and personas **[Hermes repo]** | P0 | S | TODO | - |
| TASK-100 | Health core schema v2: profile, goals with effective dates, injuries, weight, preferences, structured food items, plans **[Hermes repo]** | P0 | M | TODO | TASK-099 |
| TASK-101 | Read-only `health_context` tool + one persona line (minimal first step) **[Hermes repo]** | P0 | S | TODO | TASK-099 |
| TASK-102 | Resolve "no raw history across topics": full sharing between `fuel` and `form`, compact-only for others **[Hermes repo]** | P1 | S | TODO | TASK-101 |
| TASK-103 | Replace hardcoded 1900 kcal with goal + TDEE model with a floor **[Hermes repo]** | P0 | M | TODO | TASK-100 |
| BUG-046 | Daily calorie target is global, so changing it rewrites past days **[Hermes repo]** | P1 | S | TODO | TASK-103 |
| TASK-104 | Structured food-photo analysis: items, portions, confidence, image ref, correction loop **[Hermes repo]** | P0 | M | TODO | TASK-100 |
| TASK-105 | Food-photo evaluation set and regression check | P1 | M | TODO | TASK-104 |
| TASK-106 | Hebrew/Israeli food DB seeded from `out/Health/Foods` (+ read-only importer) | P1 | M-L | TODO | TASK-100, TASK-111 |
| TASK-107 | Meal plans feature (plan documents, planned vs eaten) **[Hermes repo]** | P2 | L | TODO | TASK-100, TASK-106 |
| TASK-108 | Persistent injuries feed the workout builder **[Hermes repo]** | P1 | M | TODO | TASK-100 |
| TASK-109 | Safety wording and guardrails in persona files (ED, minimum intake, medical, injury, supplements) | P0 | S-M | TODO | TASK-110 |
| TASK-110 | Version-controlled persona files rendered to VPS config via a YAML-safe dump **[Hermes repo]** | P0 | S-M | TODO | TASK-099 |
| TASK-111 | Back up / protect `out/Health` and retire the regex-scraped pipeline | P0 | S | TODO | - |
| TASK-112 | Product naming decision + rename checklist | P1 | S (decision) / M (rename) | TODO | - |
| TASK-113 | Keep `BOTS.md` rows for `fuel`/`form` accurate as these tasks land | P2 | S | TODO | - |

### TASK-099: Commit the ledger into the deployed branch + back up (P0, S) **[Hermes repo]**
Evidence: `agent/health_state.py` (423 lines), `agent/health_status_export.py`, `tools/health_tool.py` (324), `toolsets.py` health toolsets and 3 test files exist only on `fix/pa-stab-003-implementation` / `feat/browser-tab-control` (commit `ea21c45c4e`); `git ls-files agent/health_state.py` is empty in `devops/hermes/exercise-library`; `devops/hermes/exercise-library/HANDOFF.md:56-57` says `tools/health_tool.py` is untracked in the live tree. Do: bring these files into the lineage that builds the deployed image (`hermes-agent:council-20260719`) so it is reproducible; run the 21 focused tests in an isolated HOME; snapshot VPS `ledger.json` (`$HERMES_HOME/state/health/ledger.json`) and the persona prompts to a private backup. Do not commit without approval. Acceptance: the deployed branch builds the same tools; a restore of ledger + personas is rehearsed.

### TASK-100: Health core schema v2 (P0, M) **[Hermes repo]**
Evidence: the store holds events plus one number — `agent/health_state.py:147-165` (class, `state/health/ledger.json`, `dailyTargetCalories`); no profile/weight/injury/preference/plan exists; weight exists only in legacy Daily notes. Add versioned documents beside the ledger: `profile` (units, language, timezone, height/age/sex, activity, diet constraints, equipment), `goals` (calorie target with effective-from date, protein target, workout days), `injuries` (area, status, restrictions, confirmedByUser), `weight` events, `preferences`, `plans`, and structured food `items[]` per event; every write carries `source` (`fuel|form|user|import`) and `revision` compare-and-set. Keep JSON + flock + atomic write; keep tool API stable so SQLite can replace it later. Acceptance: schemaVersion 2 migration of an existing ledger, tests for revision conflicts, no change to existing tool behaviour.

### TASK-101: `health_context` read tool (P0, S) **[Hermes repo]** — minimal first step
A read-only tool returning ~1-2 KB: profile essentials, active goal and today's budget/remaining, active injuries, preferences, last 3 days summary, and what the other topic logged since the last turn ("lunch 640 kcal (fuel 13:02)"). Add one line to both personas: "call `health_context` first". Until TASK-100 lands it may read a hand-written `profile.json`. Evidence: `tools/health_tool.py:160-190` has only `health_get_day`/`health_compact_status`; `toolsets.py` `health` toolset lists three tools. Acceptance: both topics call it and answer with the same facts.

### TASK-102: Sharing policy conflict (P1, S) **[Hermes repo]**
Evidence: commit `ea21c45c4e` message "Rejected: Share raw diet or exercise history across Council topics"; compact-only export `agent/health_status_export.py:18-21` (contract `health-compact-v1`, 16 KiB cap); `~/.hermes/profiles/office-work/config.yaml:750-755` reads it over ssh. Decision (Noam): `fuel` and `form` share full context through `health_context`; every other profile (e.g. `office`) stays compact-only. Implement as two toolsets (`health` for the two health topics, `health_status` for the rest) and document it in `BOTS.md` data-read columns. Acceptance: office-work still cannot read meal labels.

### TASK-103: Goal + TDEE model, remove hardcoded 1900 (P0, M) **[Hermes repo]**
Evidence: 1900 appears in `agent/health_state.py:30` (`DEFAULT_DAILY_TARGET`), `tools/health_tool.py:92` (`config.get("daily_target_calories", 1900)`), and `bots+automation/claude-and-conquer/src/index.js:1263` ("תקציב: 1,900 קל (net אחרי אימון)"). The only TDEE code is the upstream optional skill `optional-skills/health/fitness-nutrition/scripts/body_calc.py:38` (Mifflin-St Jeor) and `macros()` at `:96-104` with a fixed -500 kcal and no floor. Build: goal record (cut/maintain/gain, target, protein) with effective date; a suggestion helper (Mifflin-St Jeor) that **never writes a goal by itself** — only after Noam confirms; a minimum-intake floor and a cap on deficit rate; exercise-burn "eat back" default **off** (burn is an LLM estimate, `health_state.py` `get_day` nets it from the budget). Acceptance: no literal 1900 left in code; changing a goal needs `confirmed=true`; floor tested.

### BUG-046: Target is global, not per date (P1, S) **[Hermes repo]**
Evidence: `agent/health_state.py:161` stores one `dailyTargetCalories` per ledger and `get_day` uses it for every date, so changing the target silently changes remaining-calories for past days. Fix with an effective-dated target history (part of TASK-103). Acceptance: a regression test shows an old day keeps its old target.

### TASK-104: Structured food-photo analysis (P0, M) **[Hermes repo]**
Evidence: live path is generic vision (`~/.hermes/config.yaml:188-193` `auxiliary.vision` provider `auto`, model empty; VPS value unknown) plus persona; `tools/health_tool.py:226-257` logs only label + kcal range + 5 optional macros, `agent/health_state.py` `_macros` accepts arbitrary keys; legacy prompts: `src/index.js:633` (`foodPrecisionInstructions`), `:646` (`readFoodReferenceCandidates`, token-overlap threshold 3), `:1354` (`userWantsFoodEstimateWithoutQuestions`), photo prompt ~`:1360-1385`. Define an event schema: `items[] {name_he, name_en, grams, kcal, protein, carbs, fat, confidence, basis(photo|text|database|user_corrected)}`, `imageRef`, portion reference used, `estimateBy`, correction history; photo flow: identify -> estimate portions -> ask at most one question when confidence is low -> log -> accept correction (supersede, existing `health_correct_event`) -> remember "foods I eat" priors. Record which vision model was used. Acceptance: three real photos end to end with items and confidence visible; a correction updates the prior.

### TASK-105: Food-photo eval set (P1, M)
No evaluation exists; TASK-081 (end-to-end proof, IN PROGRESS) is manual. Build a small labeled set (photos with user-confirmed items/kcal, Hebrew dishes, mixed plates, drinks), a scorer (item recall, kcal error band, confidence calibration) and a rerun command, stored outside Telegram. Keep private (health data): store in a private path, not in git. Acceptance: baseline score recorded for the current prompt; any prompt/model change reruns it.

### TASK-106: Hebrew/Israeli food DB + importer (P1, M-L)
Evidence: only the personal `bots+automation/claude-and-conquer/out/Health/Foods` (102 notes, 420 KB; kcal and protein only, no carbs/fat) carries Hebrew names; upstream `optional-skills/health/fitness-nutrition/scripts/nutrition_search.py:20-27` queries USDA (US foods, English, `DEMO_KEY` 30 req/h). Build a local foods table (name_he, aliases, per-100g and per-serving values, source, times_logged) seeded by a one-off **read-only importer** of the Foods notes (Daily 7 notes and Workouts 10 notes for history), plus a plan to add Israeli packaged-food values. Never call a live API as part of a test. Acceptance: lookup by Hebrew alias returns kcal and macros with source.

### TASK-107: Meal plans (P2, L) **[Hermes repo]**
Evidence: nothing generates or stores a meal plan anywhere; food events allow only `consumed|cancelled` (`agent/health_state.py:127-128`) so "planned food" is impossible. Add plan documents (days × meals × items, referencing the foods table), `planned` food status, planned-vs-eaten view in `health_context`, constraints from profile (allergies, dislikes, budget), and goal-aware targets from TASK-103. Wording must respect the TASK-109 safety rules. Acceptance: a one-week plan generated, edited by the user, and tracked against logged meals.

### TASK-108: Persistent injuries in the workout builder (P1, M) **[Hermes repo]**
Evidence: `devops/hermes/exercise-library/tools/exercise_library_tool.py:736-830` (`_handle_build_workout`: seeded random pick by muscles/equipment/level), `:744` and schema `:934-937` (`avoid` is a per-call list of names/ids, not persisted), `_prescription` `:690-706` (fixed sets/reps by level). Make `exercise_build_workout` read active injuries/restrictions from the health core and exclude or substitute exercises automatically, report what was excluded and why, and tell the user to see a professional for pain. Progression/history awareness is a follow-up. Acceptance: with an active shoulder restriction no overhead movement is returned.

### TASK-109: Safety wording and guardrails (P0, S-M)
Evidence: no eating-disorder-sensitive language, minimum intake, medical disclaimer, injury rule or supplement policy found in product code (greps of `src/`, exercise tools, health skill returned only noise); `body_calc.py:96-104` applies -500 kcal with no floor; `src/index.js:1354` biases toward "estimate without questions"; live persona text is VPS-only and unverified. Write one shared safety block for both personas: no judgmental/shaming language about food or weight, no promoting very low intake or compensatory exercise, floor and deficit limits, "not medical advice" and refer to a professional for pain, injury, medication, pregnancy, eating-disorder signals; no supplement claims, no dosing; injuries: stop and ask. Acceptance: block present in `personas/shared-rules.md` and rendered into both topics; reviewed by Noam.

### TASK-110: Version-controlled personas rendered to VPS config (P0, S-M) **[Hermes repo]**
Evidence: personas exist only in VPS `/opt/hermes-data/config.yaml` `telegram.channel_prompts` keyed `<chat>:<topic>` (bot-fleet.md lists only the first ~200 characters); `devops/hermes/exercise-library/HANDOFF.md` gotcha: a colon-space inside a persona prompt breaks the YAML and the gateway silently serves no personas. Keep `personas/fuel.md`, `personas/form.md`, `personas/shared-rules.md` (front matter: handle, topic, owns, reads, tools) in a repo; a render script produces `channel_prompts` with a YAML-safe dump and a load check; deploy is a separate approved step. Acceptance: rendered YAML loads, round-trips, and the two topics reply with their personas after a deploy (approval required).

### TASK-111: Back up and protect `out/Health` (P0, S)
Evidence: `bots+automation/claude-and-conquer/out/Health/` (Foods 102 notes, Daily 7 notes 2026-04-03..04-16, Workouts 10) is under untracked `out/` — not in git, not backed up; the nightly pipeline `scripts/cron-daily.sh:1-37` runs inside the stopped container and `scripts/extractDay.js` + `lib/extractDayParser.js` scrape model-written Hebrew tables by regex (brittle; last output 2026-04-16). Do: copy the vault to a private, backed-up location (not git, health data), keep it out of `out/`, mark `cron-daily.sh`/`extractDay` as legacy, and replace with the structured ledger (TASK-100/104). Acceptance: restore tested; no health data committed.

### TASK-112: Product name + rename checklist (P1, S decision / M rename)
Decision (Noam): pick one of fuel-and-form, vitalog, tempo, bodyledger, kav-briut; recommended `fuel-and-form` (bots `fuel` + `form`). Rename checklist — **do not rename without approval**; reference counts (2026-10-02 grep in `ai-development`, excluding `node_modules`, `.git`, `out`, `*.db`, lockfiles): "claude-and-conquer" 147 hits / 52 files; "claude_and_conquer" 10 / 4; "Claude & Conquer" 20 / 6; "claude and conquer" 6 / 6. Items: folder `bots+automation/claude-and-conquer`; git remote `origin = github.com/endlessblink/claude---conquer` (already differs from the folder name); `package.json` (9 hits: name + scripts), `docker-compose.yml:4` `container_name`, `.dockerignore:4`, `.gitignore:11`; runtime upload dir `.claude-and-conquer/uploads` (`src/sessionManager.js:1543,1572`, deploy excludes) — existing uploads depend on it; strings `src/index.js:431,571,4432`, `src/openRouterBackend.js:47` (HTTP-Referer), `sessionManager.js:131`; VPS `/opt/claude-and-conquer`, container `claude-and-conquer`, host cron `docker exec claude-and-conquer /app/scripts/cron-daily.sh` (`scripts/deploy-vps.sh` 7 hits, `scripts/cron-daily.sh` 2); user unit `~/.config/systemd/user/claude-and-conquer.service` (disabled, inactive); no PM2 config exists (README claim only); Watchpost `.watchpost/bot.json` (6), `devops/watchpost/projects.json` (3), `vps/bots.json` (6), `tests/unit/bots-catalog.test.js` (1); `bots-directory/bot-registry.yaml` (8, + a `.bak` copy 8), `~/.claude/knowledge/bot-fleet.md` (5, generated); Claude Code project memory directory keyed by the folder path (renaming orphans its 5 memory files); plans/docs: this repo `CLAUDE.md` 7, `AGENTS.md` 6, `MASTER_PLAN.md` 5, ten `HANDOFF*.md`, `bots+automation/hermes-agent/MASTER_PLAN.md` 12, `devops/termfleet/MASTER_PLAN.md` 3, `bots+automation/freelance-desk/MASTER_PLAN.md` 2, `cc-linux-enhancments/docs/opencode-claude-migration-plan.md` 8, `permanent/skills/telegram-bot/skill.md` 7, `vps-ops` 1, `canvas-review` 1. Leave alone: historical freelance-desk evidence JSON (~30 hits) and Hermes session dumps. Telegram username `claude_and_conquer_bot` is changeable in BotFather (verify; allowlists use chat ids). Suggested order: new product home + BOTS.md display names first; rename the legacy folder only if wanted, in one change with a link check. Acceptance: decision recorded here and in `BOTS.md`.

### TASK-113: Keep `BOTS.md` current for `fuel`/`form` (P2, S)
`devops/brainiac/BOTS.md` is the single source of truth for every bot (owned by the brainiac project, task BRN-004). When any task above changes persona location, data owned/read, topic, host or token owner, update the `fuel`/`form` rows and run `python3 -B devops/brainiac/scripts/check_bots_registry.py`. Acceptance: no drift reported for these rows.

### Suggested order (health tasks)
1. TASK-099, TASK-111, TASK-110 (protect what exists, make personas reproducible).
2. TASK-101 (minimal shared context), TASK-109 (safety wording), TASK-112 decision.
3. TASK-100, TASK-103 + BUG-046, TASK-102.
4. TASK-104, TASK-105, TASK-106, TASK-108.
5. TASK-107 (meal plans) and TASK-113 last.

### Bot identity
This project's bot: `claude-and-conquer` (legacy, stopped on purpose; shares the Telegram identity of `fuel`/`form`). See its entry in `devops/brainiac/BOTS.md` (single source of truth for every bot; Hermes = platform only). Update BOTS.md when this bot's topic, profile, host, token owner or status changes. No token values in plans.

## Evidence locations (2026-10-02)
Review reports are saved in-repo: `docs/reviews/claude-and-conquer-review-2026-10-02.md` and `docs/reviews/health-product-deep-review-2026-10-02.md`. Earlier references to scratch/chat copies (`/workspace/...`) mean these files.

## 2026-10-04 — Exercise animation reliability and curated bank (IN PROGRESS)

Updated 2026-10-04 21:40 UTC. This update covers TASK-083, TASK-084 and
TASK-091–098 only. The exercise-library worktree has no separate MASTER_PLAN;
its owned status remains tracked here, as the cross-repo note above specifies.
Other projects, health-ledger tasks, browser work and agents' WIP are unchanged.

### Installed locally and tested; not deployed

- C&C: 16 scoped files installed in this repository after isolated implementation.
  Frozen request/reference/implementation hashes, bounded attempts, interruption
  and cancellation handling, shared-palette native assembly, complete export/frame
  evidence and current review/promotion checks are implemented. The selected offline
  suite passes **58 tests**. Positive approval fixtures are simulated tests, not
  real visual, motion or safety approval. All 16 installed hashes still match.
- Hermes: 19 scoped files installed in `devops/hermes/exercise-library`, including
  bank-first lookup/demo/workout paths, current whole-entry/media/source checks,
  exact requested filters/quantities and missing-count reporting, plus an idempotent
  repetition receipt only after confirmed delivery. **74 selected offline tests**
  pass through its required test runner. A real historical GIF reached the existing
  tool/media adapter in an isolated local test. This is not live client delivery.
  All 19 installed hashes still match.
- No VPS deployment, live bank/profile install, push, bot start/message, paid
  generation, provider image/video/model call or credential transmission occurred.
  The legacy C&C bot remains stopped. Source changes preserve unrelated WIP;
  integration checked 84 C&C and 598 Hermes unrelated files without changes.

### Owner decisions and actual animation status

- The owner chose a curated approved bank instead of relying on unrestricted
  generation during workout delivery. **Zero complete bank entries are approved**.
  Nine exact historical animation approvals across eight exercises are retained as
  evidence; missing metadata, context and safety/full-entry reviews still withhold
  release. No historical approval was silently upgraded to a full bank approval.
- The owner selected **Arm Circles** as the regeneration pilot. The earlier Pelvic
  Tilt alternative is canceled. The source requires arms laterally parallel to the
  floor, approximately one-foot circles for about ten seconds, then reversal.
  The pilot plans forward first; the source does not name the initial direction.
  Source-omitted reverse duration/cadence remain explicit assumptions to settle.
- Framing was accepted: compare **16:9 and 9:16** per exercise, preserving anatomical
  proportions and using the maximum readable uniform fit of the complete movement
  and equipment envelope. Camera/scale stay stable within each clip; no universal
  character pixel height. Study dimensions are 1280×720 / 720×1280 with 48 px inset.
  This accepts layout direction, not motion, provider capability, clinical safety,
  or a rendered animation. Real upright-phone playback remains unverified.
- Earlier, two flat-plane Arm static iterations were rendered from the approved
  character texture. All five final native PNGs were inspected. **FAIL / WITHHELD**: abrupt
  elbow contour, unresolved sleeve/root continuity, missing shorts fabric where
  the original hand occluded it, and strict white-margin fringe pixels. Fixed bone
  lengths did not prove anatomy. No native motion/GIF/MP4 or approval followed.
- Online primary-source research supports complete layered artwork, hidden-surface
  drawing, rotation/weighted deformation and range tests. Existing Blender 5.0.1
  is verified, but the available mechanical mannequin lacks approved character,
  clothing and illustration style. **Substantial 3D construction remains held**.
  The owner authorized a minimal complete-layered 2D feasibility sample: one
  continuous shoulder/sleeve/elbow/wrist/hand chain, hidden shorts fabric, neutral
  and raised-extreme crops, and at most two observed repairs. That local trial is
  **complete within its bound; the static asset gate FAILS / WITHHOLDS**.
- The new SVG trial retained separate editable layers and unchanged source bytes.
  Native librsvg/Cairo rendering repaired the initial black paint export; the first
  repair restored shoulder contact and the raised direction. The final cloth-only
  repair removed the observed above-hem hand sliver while preserving the source
  thigh. All five final PNGs and source were inspected independently at native size.
  Arm/yoke/hand still fail approved illustration and natural construction; cloth
  retains visible texture repetition, patch boundaries and a mismatched hem. All
  28 earlier r1/r2 files are unchanged. Local cleanup/connected contour is not
  anatomical or animation approval. No full-body or native motion followed, and
  the trial does not establish that complete layered 2D is impossible or Blender
  is required. No model/provider call, new charge, install or bank promotion occurred.
- The owner requested the reusable process in the existing `exercise-demo-gifs`
  skill. Its update is **installed** at `~/.codex/skills/exercise-demo-gifs/`.
  Frontmatter and relative references validate; a fresh independent three-case
  offline behavior dry run passes after correcting an inset-contract ambiguity.
  All installed skill hashes were read back; both original helpers are unchanged.
  The skill does not mandate Blender or assert new animation success. These are
  skill-process checks, not live generation, animation or clinical acceptance.

### Next concrete step and release boundaries

1. Skill update, independent offline dry run and minimal 2D trial are complete
   within their local scopes. The skill/helpers and failed render evidence are
   preserved. Arm remains incomplete because the new artwork gate failed.
2. Obtain source-matching continuous arm/shoulder/hand and integrated hidden-cloth
   artwork, then test required depth/views and range. A cause-specific brief is
   prepared; the exhausted two-repair bound does not reset automatically. For a
   model-assisted edit, the native image tool does not expose requested-model
   selection or subscription/cost confirmation. A supported connected GPT Image 2
   or Seedream 5 route must verify model and zero new charge before a run; any
   new-cost route requires its exact provider/model, data and cost approved first.
   Proposed data is only approved cast and selected failed component PNGs. No
   provider/upload was invoked to bypass this missing evidence. Full 3D remains held.
3. After the static gate passes, render and inspect a short complete forward circle
   at native 24 fps, four-times-slow speed and repeated wrap; only then build the
   complete forward/reverse source sequence and declared holds. Keep the required
   current-hash independent visual/motion, owner and qualified-human safety reviews.
   Arm remains marked complex. Any failure rejects; unresolved criteria withhold.
4. Complete metadata/context/safety and full-entry review before the first real
   bank release. Consolidating the separate generators and proving live client
   delivery remain outstanding; neither is completed by local fixture tests.

The owner explicitly requires timely meaningful updates when a trial fails and
the next cause-specific experiment, rather than silence or ending useful work at
the first failed bound. Continue authorized inspection and offline preparation
while respecting a route hold. No new paid generation/API charges, sensitive upload,
installation/account setup, external publication/push or shared agent-kit/guard/
security edits are authorized. If a needed live call/upload is proposed, provide
its exact provider/model, data and cost for approval and continue offline fixtures.

### Evidence

- Repository requirement → check → result matrix and commands:
  [exercise-animation-reliability-20261004.md](docs/exercise-animation-reliability-20261004.md).
- Hermes matrix and bank limits:
  `devops/hermes/exercise-library/docs/exercise-bank-reliability-20261004.md`.
- Isolated evidence root:
  `/home/endlessblink/Documents/Codex/2026-10-04/task-13/`:
  `integration-receipt.json`, `bank-integration-receipt.json`,
  `current-installed-source-verification.json`,
  `claude-and-conquer/evidence/test-results.json`,
  `hermes-bank/evidence/test-results.json`,
  `frame-standard-study/proposed-frame-contract.json`,
  `arm-circles-local-rig-20261004/pilot-review.md`, native `static-r2/` PNGs,
  `resume-asset-inspection/route-comparison-and-2d-brief.md`,
  `resume-asset-inspection/blender-asset-capabilities.json`,
  `arm-circles-layered-2d-sample-20261004/feasibility-review.md`,
  `arm-circles-layered-2d-sample-20261004/pilot-outcome.json`,
  `arm-circles-layered-2d-sample-20261004/r3/visual-review.json`,
  `arm-circles-layered-2d-sample-20261004/r3/render-evidence.json`,
  `arm-circles-layered-2d-sample-20261004/r3/` native PNGs and editable SVGs,
  `arm-circles-layered-2d-sample-20261004/matching-artwork-brief.md`,
  `arm-circles-layered-2d-sample-20261004/image-route-constraint.json`,
  `exercise-demo-gifs-skill-update/static-validation.json`,
  `exercise-demo-gifs-skill-update/behavior-validation.json`,
  `exercise-demo-gifs-skill-update/installation-receipt.json`,
  `exercise-demo-gifs-skill-update/forward-test-r2/forward-test-evidence.json`.
  The first dry run found a narrower 16 px check was insufficient for the accepted
  48 px band; the revised independent check preserved the 48 px failures.
- Private Library framing comparison: `libfile_c337f67984f08191987c41d74af956c1`;
  rejected local static contact sheet: `libfile_0605724718708191992eb4849eb78b6d`.
  These are inspection artifacts, not approved demos or evidence of motion.

## 2026-10-05 — Arm Circles matching-artwork route (IN PROGRESS)

The owner asked to continue Arm Circles with the approved character, correct adult
proportions and accepted per-exercise landscape/portrait framing. TASK-083 remains
in progress: no usable new animation is approved. TASK-093 has no model run yet.
The prior local asset failures and release criteria are retained without changes.

- Fresh [official image-route documentation](https://learn.chatgpt.com/docs/image-generation)
  explicitly identifies `gpt-image-2` for built-in Codex generation and general
  Codex allowance. This resolves the earlier published-backend evidence gap; the
  native tool still has no selectable snapshot or billing/quota controls.
- [Official pricing](https://learn.chatgpt.com/docs/pricing) allows image usage to
  draw paid credits after included limits. Current-account included headroom and
  credit/automatic-reload exposure remain unverified: the supported public usage
  page returned no readable account data and no authenticated usage tool is exposed.
  CLI help was inspected, but no new model session, credentials inspection or
  billing-setting change was made. A read-only Weave model-capability lookup lacked
  its required Figma connection and returned no usable model/cost contract; no setup
  or fallback run followed.
- One concrete artwork edit is prepared for review through native OpenAI imagegen:
  one unchanged approved cast PNG plus a source-specific prompt; one tool invocation,
  request one neutral/raised-extreme construction sheet, no automatic retries or
  paid API fallback. Each requested panel is 1280×720 landscape with 48 px white
  inset and fixed proportional fit/camera/stance. The containing sheet is 1280×1440.
  Dimensions are requested, not wrapper-verified. The PNG would be an artwork
  candidate, not a layered rig, motion sequence or acceptance receipt.
- **Manual gate before generation:** approve this exact one-call artwork action
  (the earlier exercise-call scope differs), and confirm current supported account
  usage will cover it without paid-credit/automatic-reload spend. The proposed
  incremental charge is zero only if included allowance covers the job; there is
  no exposed fixed per-call quota. No generation run or artwork upload occurred.
- After an approved call, inspect actual source/neutral/extreme at native size for
  identity/style, adult proportions, natural shoulder/sleeve/elbow/wrist/hand,
  complete hidden fabric/hem and framing. Failed or unresolved criteria withhold
  motion. Articulation/layers/depth and native/slow complete-circle motion remain
  subsequent proof gates. No cutout retry, exercise substitution, new install,
  substantial 3D construction, bank promotion or external publication was performed.

Prepared evidence under the existing isolated task root:
`arm-circles-matched-artwork-proposal-20261005/route-review.md`,
`one-call-proposal.json`, `prepared-imagegen-arguments.json`,
`artwork-edit-prompt.txt`, `inputs/approved-character.png`, and
`route-capability-evidence.json`.



### One-call owner approval received; included-usage status unavailable

The owner's subsequent "מאשר" approves the exact one-call artwork action above.
That scope permission is recorded and must not be requested again. The unchanged
no-new-paid-generation condition still applies; remaining included allowance is
not established by the permission itself.

- The supported local App Server proxy was tried for read-only status. Default
  sandbox access was denied; the standard approval mechanism allowed the same
  read-only operation. The approved proxy then timed out during initialization
  with no protocol response, so no account limits were received. A cause-specific
  unbuffered-read correction also timed out. No daemon restart, authentication,
  model turn, settings mutation or provider fallback followed.
- A concise information question asks whether the supported Usage page shows
  sufficient included allowance without paid credits. This asks for missing account
  information, not another artwork permission. The account may not be inferred
  from the CLI or published pricing; no charge-free claim is made.
- The unchanged approved reference was inspected independently at native size;
  source identity, three-quarter/front camera, detailed pencil/ink texture, gray
  tee, green shorts, white socks/trainers and the original hand's cloth occlusion
  are recorded. Reference/prompt hashes and exact prepared arguments were verified.
- A frozen requirement-to-check matrix and read-only original-pixel checker are
  ready for any returned sheet. Wrong layout and nonwhite/nonopaque 48 px bands
  reject; visual anatomy/style/pose/cloth remain independent acceptance gates.
  Running the checker on the source is a negative-layout baseline, not a generated
  artwork result. It does not alter images or fabricate acceptance.

Current handoff: **manual_action_required for included-usage information only**.
Scope approval is **received**. Generation invocations and artwork uploads remain
**0**. TASK-083 remains in progress; TASK-093 has no run. The prior failed local
trial and unchanged release criteria are preserved. No new animation, articulation
proof, bank entry, installation, account setup or publication is claimed.

New evidence in `arm-circles-matched-artwork-proposal-20261005/`:
`owner-approval-and-preflight.json`, `input-visual-readiness.json`,
`included-usage-status-buffered.json`, `artwork-review-matrix.md`,
`inspect-artwork-output.py`, `checker-source-layout-diagnosis.json`.


## 2026-10-05 — Arm Circles CLI artwork trial and private review save

This is the current status and supersedes the earlier included-usage blocker above.
TASK-083 remains in progress; TASK-093 now has one actual artwork evaluation call,
not a complete keyframe pipeline or native animation.

- Official Codex CLI 0.160.0 was already authenticated with ChatGPT. Supported
  read-only account and usage checks verified the same CLI account, general
  `codex` bucket, 94% weekly included allowance remaining, no secondary limit,
  no quota exhaustion and no reached spending control. Built-in GPT Image 2
  uses that general allowance. An absolute per-call quota maximum was not an
  owner requirement; the extra blocker was withdrawn. Post-call checks show
  the same credit balance and included headroom. No payment/credit opt-in,
  token export, installation, account or security setting change occurred.
- Exactly one approved frozen matching-artwork request ran. The saved original
  is a single 1182×1330 RGB PNG, SHA-256
  `2ded86f225070ac62653f72442d86159964b67b0bde52564d4c1c89da2becd88`.
  Source/reference/prompt bytes are unchanged. The raw sheet was not resized or
  cleaned to claim generator compliance. The one-call budget is exhausted;
  no retry or provider fallback followed.
- **Static FAIL / WITHHELD:** 1280×1440 was requested; the returned size differs.
  Both actual 1182×665 equal-half 48 px diagnostic bands contain nonwhite pixels
  (140,401 / 140,470). Body clearance fails; shoe/base placement differs by about
  14 px between views. Face/clothes are recognizable and the earlier obvious
  shorts hole/cutout cap was not seen, but exact style/hand anatomy/detail and
  the calibrated modest raised extreme remain unresolved. Static pictures do
  not establish shared anatomy, reversible layers, depth or deformation.
- The actual unchanged raw candidate is saved to **private Library** as
  `Arm_Circles_FAILED_static_candidate_20261005.png`:
  `libfile_f6e810a31c3081919241a76fb1319b0b`.
  A clearly labeled review comparison is separately saved as
  `Arm_Circles_FAILED_static_visual_review_20261005.png`:
  `libfile_eb07694f71748191a54a01cd783eaa0e`.
  These are failed static review artifacts, not approved bank media. No share,
  publishing, promotion, native motion or qualified-human acceptance occurred.
- **Technical formatting is separable:** padding alone is insufficient, but one
  identical uniform fit of both entire panels into a 1280×720 canvas's 1184×624
  interior (about 0.93835 scale / 1109×624 content, identical x≈85/y=48 placement)
  can fix dimensions and exact-white outer inset without stretching/redrawing
  anatomy. It would preserve about 13.1 px of foot-placement difference and
  retain interior offwhite texture. It does not repair pose drift or certify
  character/hand/style fidelity. Only feasibility was assessed; no corrected
  candidate export was created.
- **Recommended next bounded decision:** inspect the private original/comparison
  for asset suitability. If worthwhile, one offline export-only diagnostic may
  isolate formatting: one common uniform fit plus white padding, one pixel check,
  zero generation calls, no per-pose alignment, anatomy edits, rigging or motion.
  Any technical pass leaves pose/style/articulation gates withheld. New artwork
  authoring or a targeted image call requires its own explicit bound; do not
  reset the exhausted generation budget. Arm Circles and accepted per-exercise
  16:9/9:16 proportional readable framing remain unchanged.

Evidence root:
`/home/endlessblink/Documents/Codex/2026-10-05/task-6/arm-circles-cli-auth-preflight-20261005/`:
`execution-receipt.json`, `cli-status-verified.json`,
`cli-status-after-generation.json`, `generated-pixel-inspection.json`,
`actual-size-pixel-diagnostic.json`, `local-formatting-assessment.json`,
`library-confirmed-receipts.json`, `outcome.md`, `status.json`, and
`library-deliverables/`. All unrelated repository WIP is preserved.


### Pending targeted Arm artwork correction — no second call yet

The parent proposed one further targeted artwork request for stance/proportions;
owner approval is pending at `Sentinel_bc19920dfeb481919b1feca86e9f91a7`. No second
image call has occurred. Prior call budget remains exhausted; no retry is inferred.

The prepared recommendation is one corrected neutral whole character, using the
unchanged approved cast as sole identity/style reference, to establish one body
anchor rather than another independently drawn pair. This draft recommendation
must match the final owner-approved scope before execution. A flattened image
may improve static anatomy/stance/style, but does not supply an articulated asset.
Complete authored layers/mesh, hidden surfaces/views and inspected deformation
are still required before any motion claim or spend justified as animation.

Safe deterministic common uniform fit/white padding can repair canvas/export
formatting and inset clearance; do not reject otherwise usable artwork solely
because the generator returned different raster dimensions. That export cannot
repair pose drift or certify anatomy/style. After static acceptance, a separately
bounded same-asset range/depth trial and one short full forward circle at native
24 fps / four-times-slow / repeated wrap must pass before the complete source
forward/reverse sequence and independent/owner/qualified-human release gates.

Concrete draft and feasibility boundaries:
`/home/endlessblink/Documents/Codex/2026-10-05/task-6/arm-circles-cli-auth-preflight-20261005/next-correction-brief.md`.
Private candidate and visual-review Library IDs above are confirmed. Nothing is
published, promoted or approved as native animation.


## 2026-10-05 — Approved neutral Arm Circles correction and private Library delivery

This is the current status. It supersedes the pending/no-second-call subsection
above, while preserving the earlier failed trial and quota history.

- Owner response `Sentinel_c28b31f6e8b08191927b279f2bd078fe` ("כן. מאשר לאלתר") explicitly
  approved one additional targeted stance/proportions call associated with
  `Sentinel_bc19920dfeb481919b1feca86e9f91a7`. One neutral complete-character request ran,
  one output returned, no automatic retries. The two separately approved jobs now
  total **2 image calls**; no further call is authorized by these approvals.
- The same official Codex CLI / ChatGPT route was used. Supported pre/post account
  and general `codex` quota reads show 94% included allowance remaining, unchanged
  credits, no reached quota/spending control. No paid API fallback, credit opt-in,
  token copy, installation or account/security settings change occurred.
- New unchanged raw: **1672×941 RGB PNG**, SHA-256
  `58107a269f40e76cc512d4bcbaed228c892a1e1b785b59e6db7b7525dc9b6917`. Source and frozen prompt remain unchanged.
  Native inspection found a more coherent adult-looking neutral figure, readable
  source-like gray/green clothing, grounded stance and continuous illustrated arms.
  Exact source proportions/body anchors and finger/nail fidelity remain review
  questions. **STATIC REVIEW PENDING**, not rejected merely for raster size.
- Safe offline canvas formatting is complete: 1280×720 landscape and 720×1280
  portrait, exact 48px outer white bands (0 nonwhite band pixels), one initial
  isotropic fit per canvas. Portrait trims only inspected empty side margins;
  no fingers/shoes/body parts, anatomy or pose were cropped/changed. The native
  export pixels were inspected. Neutral framing does not establish the calibrated
  complete motion envelope. An underfilled whole-bitmap portrait diagnostic is
  retained locally as evidence rather than presented as the selected portrait.
- Actual private Library images are confirmed, with local version metadata applied:
  old raw `libfile_f6e810a31c3081919241a76fb1319b0b` (reused; no duplicate),
  new raw `libfile_db893d01e9708191a8ab0316f9b6a6fe`,
  landscape `libfile_c2f74c56b6c881918e9889f33041b988`,
  portrait `libfile_9640f6b313e48191b52877b30b398183`.
  The previous labeled failed review remains `libfile_eb07694f71748191a54a01cd783eaa0e`.
- Illustration only. Layers/mesh, concealed surfaces/views, joint deformation,
  same-asset range/depth proof, native 24fps / 4× slow / repeated-wrap motion and
  owner/independent/required human acceptance remain gates. The prior failed cutout
  was not reused. No bank promotion, publication or approved animation occurred.

Current evidence root: `/home/endlessblink/Documents/Codex/2026-10-05/task-6/arm-circles-neutral-correction-20261005`; `outcome.md`, `status.json`,
`receipt.json`, `pixel-review-and-formatting.json`, `library-confirmed-receipts.json`
and original/generated review PNGs. All unrelated WIP remains preserved.


## 2026-10-05 — Required proportions approval gate for every generated character

Owner `Sentinel_c00a5b628db08191887e6a2f1fb46639` explicitly requires proportions as an approval gate, including
women. The rule is character-specific reference fidelity plus plausible anatomy,
not a single ideal body type or an identical male/female numeric template.

- Scoped local implementation: `scripts/exercise_character_proportions.py`
  defines a required reference/asset/frame-evidence-bound visual checklist.
  `exercise_animation_pipeline.py` places it in prompts and unverified templates
  and refuses review/promotion without every required supported visual result.
  The existing promotion command uses that same verifier; technical passes cannot
  bypass this gate. Pixel diagnostics leave proportions **unverified**.
- Mandatory review: head/body, torso/pelvis/legs, arm and leg segments, joint
  placement, palms/thumbs/fingers, feet/ankles/stance, perspective and temporal
  consistency. Unknown landmarks/hidden digits without supporting views remain
  unverified. Perspective may alter projected 2D lengths; actual bone-length
  drift fails. Every final frame and native/4× slow/wrap review are still needed.
- Use each individual's approved cast ID/hash, reference-approval decision source
  and body context. Approximate landmark-based ratios only support observations;
  no fixed male/female shape, head count or universal skeletal ratio is introduced.
  Numeric-only review is refused. Canvas, style and frame count never override
  a proportions fail/unverified result. Independent/owner/required human gates
  and the verifier's evidence-authenticity limitations remain unchanged.
- **Hold:** no new generation/automatic retry/pose expansion or promotion until
  the required gate passes. Offline review preparation of existing pixels is
  permitted. Static evidence cannot approve temporal anatomy or native motion.
  The current new Arm Circles illustration retains **pending proportions/hands
  review**; the broad visual screen was not a full gate pass or grandfathering.
- **Validation:** 38 focused offline regressions passed (9 new gate tests,
  20 existing pipeline, 8 diagnostics, 1 legacy-promotion refusal). These include
  male/female own-reference contracts with different synthetic ratio claims,
  missing/stale/unapproved evidence, failed/unverified subcriteria, unknown
  landmarks, numeric-only claims, endpoint-only temporal coverage, drift and
  refusal to promote a hands failure. Fixtures/claims are explicitly simulated;
  no real character, anatomy or safety acceptance is established by those tests.
- The gate is integrated into `test:animations`' existing regression runner.
  The preparation implementation hash includes its module; stale prepared jobs
  must use a new isolated job. Historical evidence and unrelated WIP are preserved.
  This task made **0 new provider calls and 0 real promotions**. No installs,
  account/security changes or deployment occurred. Separate Hermes/provider
  implementations remain unchanged; shared enforcement/live validation is pending.

Contract/checklist: `docs/exercise-animation-review-contract.md`.
Implementation/regression evidence:
`/home/endlessblink/Documents/Codex/2026-10-05/task-6/arm-circles-proportions-gate-20261005` (`test-results.json`, guarded integration receipt, owned diff).
Current Arm static gate record: `current-arm-static-proportions-review.json`
and `current-arm-static-proportions-verification.json` in that evidence root.

## Board audit — 2026-11-06

The Node Telegram poller remains retired; current Telegram delivery belongs to Hermes and the web companion is the separate active Health App. Original legacy statuses remain historical and superseded rows are archived by disposition, not relabelled implemented. TASK-014 shares FEATURE-005 and is consolidated into it. TASK-082 retains the browser-extension reconnection/version/authenticated-receipt gate; animation production and review remain TASK-083 and TASK-084, with original asset and safety requirements preserved. Health App FEATURE-021/TASK-118/TASK-121/TASK-122 are REVIEW for delivered work with owner/real-flow acceptance still open. TASK-119 remains PLANNED: the six redraws have no completion proof. Earlier local-only TASK-114–116 proof limits remain intact.
