# Hermes Agent — MASTER_PLAN

Project planning wrapper for Hermes Agent work tracked by Watchpost. The active Hermes source checkout currently lives at `/home/endlessblink/.hermes/hermes-agent`; this project exists under the user's normal development workspace so Watchpost can track Hermes-related product and infrastructure tasks without mixing them into Watchpost's own roadmap.

---

## Active Tasks

| ID         | Title                                                                      | Priority | Status      | Dependencies |
| ---------- | -------------------------------------------------------------------------- | -------- | ----------- | ------------ |
| HERMES-001 | Scoped node-graph memory retrieval for projects, entities, and preferences | P1       | TODO        | -            |
| HERMES-002 | Telegram gateway RTL + Markdown rendering for mixed Hebrew/English replies | P1       | IN_PROGRESS | -            |
| HERMES-003 | VPS-hosted internal Hermes runtime for trusted bots and services           | P0       | TODO        | -            |

---

## Active Work

### HERMES-001: Scoped node-graph memory retrieval for projects, entities, and preferences

**Priority:** P1
**Status:** Todo

#### Problem

Hermes currently injects a small global memory list into every conversation. That works for a few stable user preferences, but it breaks down for this workspace: the user has many projects (`Botson`, `TermFleet`, `Watchpost`, `Rough Cut`, and more), each with its own conventions, quality bars, deployment rules, and vocabulary. A project-specific memory can pollute unrelated tasks, and the limited global memory budget encourages unsafe compression or deletion of unrelated memories.

#### Goal

Add a scoped memory/retrieval layer where memories are stored as small nodes with typed relationships and only relevant nodes are loaded for the current task. The goal is not to inject a bigger memory dump; it is to retrieve less, better, and with project/entity context.

#### Scope

- Define a minimal graph model:
  - node types: `user_preference`, `project`, `entity`, `workflow`, `vocabulary`, `environment_fact`, `safety_rule`.
  - edge types: `belongs_to`, `mentions`, `prefers`, `dislikes`, `requires`, `depends_on`, `synonym_of`, `relevant_to`.
- Add a retrieval policy that uses the current prompt, cwd/project path, session source, and mentioned entities to select memory nodes.
- Keep global memory for tiny always-relevant facts only; move project-heavy details into scoped nodes or skill/reference files.
- Add first-class vocabulary nodes for mixed Hebrew/English transcription terms such as `Watchpost`, `TermFleet`, `Hermes`, `Codex`, `Claude Code`, `OpenCode`, `MASTER_PLAN`, `Rough Cut`, and `Botson`.
- Add management UX for inspecting why a node was loaded and which nodes were skipped, so memory behavior is debuggable.
- Provide a migration path from existing flat memory entries into scoped nodes without silently deleting project memories.

#### Key files / refs

- Active Hermes source checkout: `/home/endlessblink/.hermes/hermes-agent`
- Hermes memory/config docs and current memory provider integration.
- Existing session search (`state.db` + FTS) as a source for provenance and fallback recall.
- Skills/reference files for procedural or long-form knowledge that should not live in always-loaded memory.

#### Verification

- A `TermFleet` / `Watchpost` conversation loads `TermFleet` / `Watchpost` nodes but does not load `Botson` content-quality preferences unless `Botson` is mentioned.
- A `Botson` conversation loads `Botson` deployment/content-quality rules and can state why those rules are relevant.
- Memory addition under a full global-memory budget does not require deleting unrelated project memories.
- The user can inspect loaded memory nodes and their relationships in a readable debug view.
- Regression tests cover project-scoped retrieval, synonym/entity matching, and “do not load unrelated project memory” behavior.

---

### HERMES-002: Telegram gateway RTL + Markdown rendering for mixed Hebrew/English replies

**Priority:** P1
**Status:** In Progress

#### Problem

Hermes replies in Telegram often mix Hebrew, English product names, paths, code, tables, bullets, and emphasis. Telegram's bidirectional text handling can scramble punctuation and English terms in RTL paragraphs. Separately, some Markdown constructs are not rendered reliably: tables should remain tables, bullets should remain bullets, and emphasis should remain bold/italic instead of appearing as raw Markdown.

#### Goal

Make Telegram gateway output predictable for Hebrew-first conversations with embedded English/code. Replies should be readable in Telegram without forcing the user to mentally reorder mixed RTL/LTR text, and Markdown formatting should degrade gracefully when Telegram cannot render a construct natively.

#### Scope

- Add an RTL-safe message formatting layer for Telegram deliveries:
  - wrap English product names, code identifiers, file names, paths, and commands in inline code or code blocks where appropriate.
  - use Unicode bidi isolation marks (`LRI`/`PDI`, `LRM`/`RLM`) only where they improve rendering without hurting copy/paste too much.
  - prefer bullets/key-value lists over dense mixed-direction paragraphs.
- Audit Telegram Markdown conversion so supported constructs render correctly: bold, italic, inline code, code blocks, links, bullets, numbered lists, and tables or table fallbacks.
- Add a table fallback strategy when Telegram parsing cannot preserve pipe tables: convert to compact bullet/key-value groups instead of raw broken Markdown.
- Add a Hebrew/mixed-language style policy for agent replies: English entities in code spans, paths in code blocks, short bullets for structured facts, minimal mixed-direction punctuation.
- Add snapshot tests for outgoing Telegram payloads that include Hebrew + English + numbers + code + tables.
- Make the behavior platform-scoped so it improves Telegram without degrading CLI/Discord/Slack output.

#### Key files / refs

- Active Hermes source checkout: `/home/endlessblink/.hermes/hermes-agent`
- Telegram gateway adapter and Markdown conversion code.
- Hermes prompt/persona guidance for Telegram output style.
- Existing messaging delivery tests or gateway snapshot tests.

#### Verification

- Telegram test messages render correctly for:
  - Hebrew sentence containing `Watchpost`, `TermFleet`, `MASTER_PLAN`, and numbers.
  - file path/code block delivery.
  - bullets and numbered lists.
  - bold/italic emphasis.
  - a table or table-fallback message.
- Copying code/path text from Telegram does not include harmful invisible characters in code spans or blocks.
- Non-Telegram platforms keep their existing Markdown behavior.
- User-visible replies in Hebrew avoid raw broken Markdown when Telegram does not support a construct.

---

### HERMES-003: VPS-hosted internal Hermes runtime for trusted bots and services

**Priority:** P0
**Status:** TODO

#### Problem

The user wants Hermes to become a stronger, more consistent runtime layer behind domain-specific bots and services, starting with Claude & Conquer. Claude & Conquer should remain responsible for its specific food/exercise Telegram role, but it should be able to call Hermes for broader reasoning, memory, analysis, tools, and future shared agent capabilities.

This must not create a server security hole. Hermes will have powerful tools, so exposing it casually to other services, the public internet, or broad filesystem/terminal permissions would be unsafe.

#### Goal

Run Hermes on the VPS as a private internal agent runtime that trusted local services can call safely. Start with Claude & Conquer as the first consumer, then leave a clean pattern for additional bots/services.

#### Scope

- Install/run Hermes on the VPS as a managed service, separate from Claude & Conquer.
- Enable Hermes API Server for internal service calls.
- Bind Hermes to localhost or a private network only; never public internet by default.
- Use a strong API key and document how services should authenticate.
- Create a dedicated Hermes profile for Claude & Conquer assist work, instead of using the user's default profile.
- Limit enabled toolsets/credentials for the service profile to the minimum needed.
- Ensure Hermes does not receive Telegram updates directly for the Claude & Conquer bot.
- Add a small Claude & Conquer integration path that calls Hermes only for explicit assist/analysis flows such as weekly insights or complex food/exercise questions.
- Keep Claude & Conquer as the user-facing gatekeeper: formatting, Hebrew tone, topic identity, and final Telegram send stay in Claude & Conquer.
- Add timeouts, logging, and fallback behavior when Hermes is unavailable.

#### Security constraints

- Do not run Hermes as root.
- Do not expose Hermes API on `0.0.0.0` without an explicit private-network/proxy/auth design.
- Do not give service profiles broad access to `/`, `/root`, `/etc`, SSH keys, Docker socket, or unrelated project secrets.
- Do not allow Hermes to send Telegram messages directly for Claude & Conquer flows unless explicitly designed and approved later.
- Prefer per-service profiles and per-service credentials as the platform expands.

#### Key files / refs

- Active Hermes source checkout: `/home/endlessblink/.hermes/hermes-agent`
- Claude & Conquer project: `/media/endlessblink/data/my-projects/ai-development/bots+automation/claude-and-conquer`
- Hermes API Server docs: `website/docs/user-guide/features/api-server.md`
- Claude & Conquer `MASTER_PLAN.md` tasks around VPS deployment and backend support.

#### Verification

- Hermes service is running on the VPS and survives restart.
- `GET /health` or equivalent API health check succeeds from the VPS locally/private network.
- Claude & Conquer can call Hermes for one explicit assist command without exposing Hermes publicly.
- If Hermes is stopped, Claude & Conquer returns a safe fallback/error and continues normal food/exercise operation.
- Security check confirms Hermes is not listening on a public interface and does not run as root.
- Service profile has only the intended toolsets/credentials enabled.

## Bot identity (added 2026-10-02)

This project's bot: `fuel / form / lifeboat / office (Hermes-hosted)` — this plan covers the Hermes platform wrapper; the bots it hosts are separate handles (`fuel` topic 306 and `form` topic 303 on the VPS gateway, `lifeboat`, `office`, ... locally). See its entry in `devops/brainiac/BOTS.md` (single source of truth for every bot; Hermes = platform only, bots are referred to by handle). Update BOTS.md when this bot's topic, profile, host, token owner or status changes. No token values in plans.
