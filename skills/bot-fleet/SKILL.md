---
name: bot-fleet
description: Use when asked about any of Noam's bots or bot personas — "diet bot", "excersize bot", "orchestrator bot", "paper-bot", "personal-assistany", "botson", "botty", "world's greatest bot", "bina bot", "claude and conquer", "hermes gateway", "Concil of bots" — or about the fleet generally ("which bots do I have", "where does bot X run", "what platform is X on", "what persona is in topic N", "is bot X running", "where does bot X's code live"). Also use before editing a bot's config, prompt, or deployment, so you act on live state rather than a repo doc.
---

# Bot fleet

Noam's bots span the VPS, workstation, source checkouts, installed environments
and personas within shared gateways. Resolve the bot in the maintained registry
first, then verify the actual path and current runtime. Watchpost is supporting
discovery evidence; a generated catalog or a running PID can be stale or select a
different release from the source checkout.

## How to answer a question about a bot

1. **Resolve the registry reference first** — read
   `/media/endlessblink/data/my-projects/ai-development/bots+automation/bots-directory/bot-registry.yaml`.
   Select one `workflow_references.id`, read its identity entry and matching
   `runtime_surfaces`, and confirm the actual path's source/release/runtime role.
   Keep dormant rebuilds and intentionally retired pollers separate. Unknown
   identity, owner, path or revision stays unknown; do not invent a match from a name.

2. **Run the explicit non-mutating workflow check before edits:**
   ```bash
   python3 /media/endlessblink/data/my-projects/ai-development/bots+automation/bots-directory/tools/check_bot_workflow.py \
     --bot paper-bot \
     --checkout /media/endlessblink/data/my-projects/ai-development/bots+automation/paper-bot
   ```
   Use the resolved ID and actual local checkout, not the example when working
   on another bot. Missing/ambiguous/stale references or path mismatches require
   bounded reconciliation. Read-only discovery can continue. This checker
   enforces references only when invoked; it is not permission, a read receipt,
   universal managed-dot enforcement, or a reason to install global hooks.

3. **Use the generated index as supporting evidence** — `~/.claude/knowledge/bot-fleet.md`. It covers
   every bot: platform, where it runs, repo path, personas with topic ids, lifecycle,
   and any drift between what's documented and what's deployed. This works even when
   Watchpost is stopped.

4. **For a single bot or persona, resolve it directly** (Watchpost running):
   Use `GET /api/bots/resolve?q=diet+bot` on the existing private Watchpost surface.
   Alias-aware — "diet bot", "diet-bot" and "food bot" resolve a catalog candidate.
   The response includes a live system prompt: inspect only needed non-secret
   identity/path/routing fields; never copy prompts, credentials or raw private
   chat into the registry. Compare the result with the registry and actual runtime.

5. **For the whole fleet with current runtime status:**
   Use `GET /api/bots` for catalog metadata or the existing generated index for
   a dated summary. Extract only necessary identity/path/state fields before
   reporting. `GET /api/bots/index.md` also regenerates the index file; do not
   call it merely to prove a registry read or treat its timestamp as identity proof.

If Watchpost is not running, continue from the registry and dated generated file;
state the scope/date of the observation and verify the actual service path. A
loopback health/dashboard URL is on the recorded host, not automatically local.

## Rules

- **Verified runtime provenance beats an assumed checkout.** Compare bounded
  non-secret current service/config/artifact evidence with the registry and catalog.
  An installed interpreter may import an editable source elsewhere. Disk HEAD,
  image ID, process health, loaded revision, authenticated visual acceptance and
  delivered behavior are distinct evidence; do not upgrade one from another.
  When evidence disagrees, report and reconcile the exact drift before acting.
- **Preserve dated evidence.** Update the matching registry record with sources,
  timestamps and next check; historical identity or WORKING claims keep their old
  dates unless revalidated. Do not overwrite unrelated workers' files or state.
- **A persona is not a bot.** "Diet Bot" is a Telegram topic persona served by the
  `hermes-gateway` process, not its own deployment. Answer at the level asked, but make
  the relationship clear before anyone tries to restart "the diet bot".
- **A stopped container is not always an outage.** Some bots are stopped on purpose
  (token conflicts). The catalog marks those `retired` — do not "fix" them.
- **Report drift.** If the catalog flags drift for the bot in question, mention it;
  that is usually the real answer to "why is this behaving oddly".

## Adding a bot to the catalog

Create `.watchpost/bot.json` in the bot's repo. It is picked up automatically — no
Watchpost change needed. Repos outside the scanned tree can be added to
`botManifestRoots` in Watchpost's `local/config.json`.

```json
{
  "id": "my-bot",
  "name": "My Bot",
  "aliases": ["nickname people actually use"],
  "platform": "telegram",
  "lifecycle": "active",
  "summary": "One line on what it does.",
  "deployment": { "kind": "vps-docker", "vpsBotId": "my-bot", "container": "my-bot" },
  "chats": [{ "id": "-100…", "label": "Group name" }],
  "personaSource": { "kind": "hermes-config", "path": "/opt/hermes-data/config.yaml" },
  "personas": [{ "topicId": "306", "name": "Diet Bot" }],
  "notes": "Gotchas worth knowing before touching it."
}
```

`deployment.kind`: `vps-docker` · `vps-systemd` · `local-docker` · `local` · `none`.
`lifecycle`: `active` · `dormant` · `retired`.
Declared `personas` are compared against live config — a mismatch surfaces as drift,
which is the point. Omit `personaSource` for bots with no readable persona config.

Never hand-edit `~/.claude/knowledge/bot-fleet.md` — it is regenerated and your edit
will be overwritten. Fix the manifest or the bot's live config instead.
