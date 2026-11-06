# Life-Boat Telegram — Master Plan

Status: in progress
Last updated: 2026-09-13

This is the repository-local execution plan for Life-Boat. Cross-agent ownership
remains in the shared agent-ops plan; durable decisions remain in Obsidian.

## Secondary task — scheduler delivery and content read-back

- [ ] Verify the scheduler end to end: repair or document the stale persisted
      vault-path/runtime issue, then read back the next scheduled message in the
      isolated Telegram hub and prove wording, delivery, duplicate suppression,
      and persisted receipts. The latest scheduled message was visible and
      referenced the correct conversation content; this confirms content
      relevance for that run, but does not yet prove the post-fix wording,
      delivery, or duplicate gates.

## Outcome

Life-Boat must sustain a concrete, meaningful Hebrew conversation from vague
openings using retained context, recover from correction or pushback, remain on
the active thread, and avoid generic or repetitive turns. Its morning,
casual-check-in, and daily-summary services must actually run at their due
boundaries and produce visible Telegram receipts. Readiness is unproven until
the relevant behavior is demonstrated on Telegram Web and the supporting
runtime evidence is captured.

## Current release objective — locked

The current objective is a staged repair or replacement of the Life-Boat
conversation-quality path while preserving the working Telegram, session,
memory, scheduler, and shared-pipeline boundaries. A full product rewrite is not
assumed; the new path must first prove itself behind a controlled rollout.

### GOAL: working, high-quality, safe Life-Boat memory — in progress

Owner-approved 2026-09-05. Definition of done: Life-Boat stores what matters
without being told, finds it again in a later conversation, answers from it in
Telegram, and never reads or exposes a note it does not own. Local suites are
not sufficient evidence for any stage below. Route and invariants:
`docs/lifeboat-current-goal.md`.

- [x] G-1 Retrieval proof — PASSED 2026-09-05 on the approved run: model called,
      owned note seeded, protected search succeeded, read through the returned
      reference succeeded and was proven, answer proven, no memory write, vault
      snapshot unchanged, three requests. Proves the model can use the protected
      discovery path on synthetic notes. Does not prove save judgment, the live
      prompt, or Telegram delivery.
- [x] G-2 Result handling — not required; G-1 passed on its first approved run.
      No retry, limit change or weakened check was applied.
- [x] G-3 Save-quality matrix — PASSED 2026-09-05, six of seven cases. Two
      defects found and fixed. First, the input ceiling charged each request's
      full UTF-8 body as if bytes were tokens, so replayed history exhausted the
      budget before the real token ceiling — that is why the earlier cases were
      inconclusive. The budget value is unchanged; admission still refuses an
      oversized request on the conservative estimate before any network call and
      failed attempts still keep their full reservation, but a completed request
      now settles at the provider's reported input tokens. Second, neither the
      production memory guidance nor the synthetic instruction told the model to
      look for an existing note before writing, so from an empty conversation it
      duplicated a note and dropped a stated correction. Both now carry the same
      update-rather-than-duplicate clause; nothing was removed from the evidence
      boundary. `append`, `correction`, `correction-known-note`, `transient`,
      `refusal` and `production-discovery` all pass.
- [x] G-2b RESTORED 2026-09-06, and the suite is now fully green for the first
      time: 11,044 pass, 0 fail, Ruff clean. The first attempt failed for two
      reasons, both now fixed. It read the compatibility placeholder as an
      opening, so it demanded a fresh commitment on every mid-conversation turn;
      "opened" now means his own message opened it — the explicit flag, or his
      text actually reading as a broad request. And it counted only an
      announcement ("let's start with X") as advancing, when the good replies in
      the recorded trajectories commit by naming one concrete moment of his and
      asking about it; that shape now counts. Handing the choice back and
      anchoring on the chat are still refused.
      A third defect surfaced while fixing it and was already there before:
      "sounds like you had a hard week" — a hedged read with no question and no
      invitation to correct — was being accepted whenever recent turns were
      supplied. That is exactly the short reflection that ends the turn which he
      reported. Now caught as `read_without_a_way_back`, kept separate from the
      advance issue so a hedged opening is judged on having a way back in rather
      than on failing to commit, with repair guidance for editor and rewriter.
      Not yet live: needs a gateway restart, deliberately left for him to time.
      Watch for the opposite failure in real use — this is a rejector, and an
      over-eager rejector pushes the bot toward saying nothing.
- [x] G-2b-history RAISED IN PRIORITY 2026-09-06: the two remaining reviewer failures
      are not cosmetic. Noam reported the old failure returning at symptom
      level, in his words: a short reflection, a question that hands process
      management back to him, or stopping when there is no immediate solution,
      instead of the assistant continuing to hold the structure. That is
      precisely what the deleted `assistant_did_not_advance` block protected
      against, together with `_STEERING_HANDBACK_RE` and `_USER_SELECTION_RE`
      (the latter two orphaned by the same deletion). The in-flight branch
      removed it; a first restore attempt over-rejected (7 failures became 10)
      and was reverted, leaving the protection absent. It now has live evidence
      behind it and should be restored properly: the earlier attempt failed
      because `opening_shape` also covers the compatibility path where any
      active debrief turn counts as an opening, so a working candidate must
      separate "opened a review" from "is mid-review" and be proven against the
      dialogue trajectories, not only the four matrix cases.
      Related and separate: the bot marked one queue thread complete and
      advanced itself to the next topic purely by list order, then said so. It
      also revealed a fourth store — a local eight-item todo list, distinct from
      the canonical queue (14 items, 12 pending), the ten private notes and the
      ownership ledgers. Deciding the transition mechanism is blocked on the
      owner; consolidating the stores belongs in the GRAPH lane.
- [ ] G-2c STRUCTURAL, raised by the owner 2026-09-06 and correct: "aren't we
      back to building patches? isn't it clear it must always check context?"
      He is right on both counts, and the second is the project's own rule --
      conversational judgment must be model-led, not keyword matching. Two
      design faults, distinct from any single missed phrase: 1. **The checks are gated on debrief mode.** Whether a reply hands the
      work back, commits to nothing, or invents an occasion does not depend
      on a mode flag, yet `debrief_problems` only runs when a debrief is
      active. His failing exchange was accepted with no debrief flags at all. 2. **Quality is being decided by phrase lists.** `_TRANSITION_REQUEST_RE`,
      `_WIDENS_SCOPE_RE`, `_PAST_OCCASION_RE`, `_CHAT_META_ANCHOR_RE` and the
      rest each encode one phrasing. The next phrasing he uses slips through,
      and a Hebrew speaker has many. This is the treadmill he named, and
      `CLAUDE.md` forbids it in as many words.
      The intended shape: the deterministic layer keeps only what it is for --
      privacy, authorization, safety, transport -- while "did this reply do the
      work" is judged by the model reviewer that already exists, on every turn
      rather than in a mode. Do not attempt this as another quick edit; it
      changes what the reviewer is, needs the trajectories plus his real
      exchanges as evidence, and the failure mode of getting it wrong is a bot
      that says nothing. The phrase patterns stay meanwhile as a stopgap that
      keeps him working, and every one added is a reason to do this sooner.
      FOUND 2026-09-06: the model-based reviewer already exists and already
      judges exactly this. `gateway/lifeboat_semantic_gate.py` asks an
      independent checker to read the conversation and return, among others,
      `responsibility_handoff` -- "do not end by merely pointing out something
      is unclear and asking the user to resolve it when the known event already
      gives the assistant a reasonable next step" -- and `premature_closure`.
      That is his exact failing reply, judged by reading rather than by phrase.
      It was silently off for Life-Boat for two reasons, one of them the third
      instance of the profile-versus-base home split: the `lifeboat-semantic-
shadow` and `-gate` flag files existed only in the base Hermes home, where
      a Life-Boat turn never looks, and `auxiliary.lifeboat_semantic_checker`
      was never configured for the profile at all.
      Enabled 2026-09-06 in OBSERVE-ONLY mode: checker configured on the same
      subscription route already used for compression (no new provider, no new
      class of exposure), shadow flag created in the profile home, blocking flag
      deliberately NOT created. It now runs on every reply and logs pass,
      failures and enforce=False. Config backed up, YAML re-validated, gateway
      restarted (PID 2863283).
      Next: read the logged verdicts against his real conversations. If the
      checker's judgement matches what he would have wanted blocked, enable the
      gate and start retiring the phrase patterns. If it does not, say so --
      turning it into a hard gate on weak evidence is how the bot goes quiet.
- [ ] G-3a Open, non-blocking: the `injection` case holds every safety property
      on all three runs but its usefulness half is unstable — once it read the
      note and omitted the day, once it answered without reading. Long-standing
      flake, already recorded as answer-unproven before this work. Do not weaken
      the oracle to close it.
- [ ] G-4 Live enablement — PREREQUISITE, not just for recall: the live turn
      gets the write-only memory tool, while search/read arrive with the
      separate discovery toolset. While discovery is off the model cannot find
      an existing note, so the new guidance cannot be followed and duplicates
      are unavoidable in production. Verify owner identity, profile, topic,
      config and service state without exposing secrets; prepare the narrow
      discovery-on change plus rollback; then request approval. Shared gateway
      restart briefly affects other conversations.
      Change prepared and validated offline 2026-09-05 against the real
      authorization gate: owner authorized, other user denied, other topic
      denied, and removing the block restores today's behavior exactly. Values
      live in the session scratchpad note `discovery-enablement.md`; nothing was
      applied.
      Was blocked by unrelated in-flight reviewer work in this checkout;
      finished 2026-09-05 (see G-4a). No longer a restart hazard.
      APPLIED and LIVE 2026-09-06. The last open gap was closed first: a new
      `append-forced` case reproduces the live constraint that the turn's first
      tool call is spent on the memory decision before the model may search, and
      it passed on the first run in four requests -- the model still found the
      existing note and appended instead of starting a second one. The config
      was backed up (`config.yaml.bak-predisco-20260906-080225`), the six-line
      discovery block added under the existing `lifeboat_memory` key, and read
      back through the real gate: owner authorized, another user denied, another
      topic denied. Gateway restarted cleanly (PID 319704, active/running,
      Result=success, NRestarts=0); the startup warnings present are unrelated
      pre-existing ones from other profiles. Rollback is deleting those six
      lines and restarting, or restoring the backup.
- [ ] G-4 Live enablement — verify owner identity, profile, topic, config and
      service state without exposing secrets; prepare the narrow discovery-on
      change plus rollback; then request approval. Shared gateway restart briefly
      affects other conversations.
- [x] G-4a Finished the unrelated in-flight reviewer work that blocked the
      restart, 2026-09-05. The branch had left three pieces written but never
      connected, and the first was a live crash: `gateway/lifeboat_rewrite.py`
      called `is_implicit_context_opening`, which no version of
      `gateway/lifeboat_turn_context.py` defined, so the reply-repair path
      raised at runtime and 32 tests failed at import. Defined it over the
      existing `_CONTEXT_REQUEST_RE` — an implicit review or check-in opening,
      alongside `is_broad_debrief` for one that names the period.
      That exposed two more orphans, both already written with their intent in
      comments. `opening_shape` was computed and unused: on the turn that opens
      a review there is no earlier read to correct and no retained material, so
      a hedged read that then asks him about it now counts as offered for
      correction, and a proposal of where to start is treated as a scope choice
      rather than an unsourced claim. Continuing turns keep the strict rule,
      which is where `unsourced_continuity` earned its place. `_CHAT_META_ANCHOR_RE`
      was compiled and never applied: anchoring a review on the message he just
      sent, or on what led him to write, now fails as `chat_meta_anchor`, with
      repair guidance added for the editor and the rewriter.
      Separately, three `test_status_command` cases were stale rather than
      broken — `/profile` deliberately abbreviates a home-relative path to `~`,
      and only one of the four sibling tests had been updated to keep its
      fixture outside the real home. Nothing was removed from any reviewer.
      342 reviewer, debrief, editor, rewrite and turn-context tests pass; the
      status suite passes 20; Ruff clean.
- [ ] G-4b Seven failures remain in that branch and are NOT loose ends: four in
      `test_lifeboat_focused_matrices.py` and three dialogue trajectories. They
      are unchanged with the G-4a reviewer edits toggled off, so they predate
      this work. They assert that a broad opening must anchor on retained
      material rather than only on his own words — the contract the branch
      deliberately reversed when `build_turn_context` stopped injecting the
      stored queue, journal and transcript. Deciding whether the tests or the
      new direction is right is a product decision about what Life-Boat should
      do with retained material, not a mechanical fix; per the preservation-first
      rule it needs a named candidate and independent challenge, and the branch
      owner's intent should settle it. They are assertion failures, not import
      errors, so they are not a restart hazard.
      Owner decided 2026-09-06: "it should search but not invent" — the four
      matrix cases are protections worth keeping, since they reject a generic
      "what else has been going on lately?", an invented "last Thursday, who did
      you meet first?", and a reply that only mirrors his own words.
      First candidate tried and REVERTED: restoring the deleted
      `assistant_did_not_advance` block (which is what orphaned
      `_USER_SELECTION_RE` and `_CHAT_META_ANCHOR_RE`), gated on `opening_shape`
      and exempting a hedged read. It fixed three of the four but rejected five
      previously-passing cases, taking the suite from 7 failures to 10, so the
      worktree was returned to the 7-failure state. Evidence, not approval: the
      old block is too blunt because `opening_shape` also covers the
      compatibility path where any active debrief turn is treated as broad,
      while the committed version gated on the user's actual text. A working
      candidate needs to separate "opened a review" from "is mid-review", and
      must be proven against the trajectory suites, not only the four cases.
      Second pass, kept: 7 failures down to 2, no new failures, Ruff clean.
      Three changes, each measured on its own and each a wiring of the branch's
      own intent. `retained_text` and a new `said_text` (his own words, current
      turn plus prior user turns) now separate the retained archive from what he
      actually said, so the stale-topic check stops calling his own words stale;
      it also exempts a reply grounded in one concrete moment, since reaching
      into retained material to ask about a specific event is the "search" half
      and only a summary that names old topics is the invented half. That fixed
      all three trajectories. Added `invented_occasion` for a named past
      occasion he never mentioned ("last Thursday, who did you meet first?"),
      and `broadened_after_a_specific_answer` for widening the scope right after
      he gave something specific, both with editor and rewriter guidance.
      A fourth candidate, requiring a retained anchor on an opening turn, was
      tried and REVERTED: it fixed one case but broke a previously-passing one,
      and reset-debrief and short-name anchors kept needing exceptions. The two
      remaining failures both want an opening reply that ignores available
      material to be rejected; that rule needs a sharper definition than token
      overlap before it is worth keeping.
- [ ] G-5 Telegram proof — ordinary owner messages only: storage, cross-session
      recall, conversation separation, refusal of unauthorized notes, read-back of
      what persisted. Do not use the operator as a repeated debugging harness.

### GRAPH lane — the memory becomes a node graph, maintained by the bot

Design is canonical in `docs/lifeboat-memory-system.md`; read it first. Intent:
a graph of people, thought patterns and events and how they influence each
other. Decided 2026-09-06: the bot maintains it (not the Obsidian plugin,
which only runs while the desktop app is open and knows none of these notes'
protections), and we take the plugin's proven design rather than inventing.
Until this lane ships, memory behaves exactly as it does today.

Measurement set, from notes already in the folder — every stage is judged
against flat search as the baseline, because the closest published comparison
gives graph traversal only about three points over plain search:
a. Where does the comparison loop keep showing up?
b. What has changed in how he reads Ri since the first note about her?
c. What sets off the secondary self-criticism?

- [x] R-G1 Edge-writing boundary. The writer may now mint wiki-links, but only
      when constructed as the maintainer, and only into notes already in the
      ownership ledger; Markdown links stay refused everywhere so an edge can
      never address a URL. Conversational paths keep the old refusal, since a
      link asserted mid-turn is the invented connection this exists to avoid.
      141 memory tests pass including four new boundary tests; Ruff clean.
- [x] R-G2 Entity and pattern notes. Person and pattern nodes are ordinary owned
      Markdown so Obsidian renders the graph natively and he can edit them
      himself. Only two kinds exist — events stay the ordinary notes they
      already are, since a third vocabulary is drift the extraction pass would
      wander into. Names are folded for comparison (case, punctuation, Unicode
      composition, which differs for Hebrew by keyboard) and stripped of path
      and link characters, so a name cannot smuggle a traversal. Obsidian's own
      `aliases` frontmatter is the one addition to the otherwise closed set, and
      it is carried on the authorized read so resolving one node against another
      never re-reads a file outside that path. Resolution only ever consults
      notes the caller is granted, so a name match can never become a merge into
      an unowned note. 13 new tests, 178 across the memory suites, Ruff clean.
- [ ] R-G3 Extraction pass. A separate model call over already-stored notes —
      never the conversing model — emitting a closed set of typed edges with a
      quoted source span. Code validates the schema and drops anything
      unquotable, because the nearest comparable implementation reports roughly
      one extraction in ten drifting from the requested vocabulary. Verify on
      copies of the real notes before any live write.
      Runs on a LOCAL model (Ollama, already installed). Decided 2026-09-06 on
      the owner's privacy question: today note text reaches a cloud model only
      when a conversation retrieves it, and a nightly cloud pass would instead
      send every note every night. Cloud quality matters least for this job —
      it proposes structure from text already written, and code validates the
      output — so the trade is a weaker extractor for keeping his accumulated
      history on the machine. Do not move it to the cloud without recording a
      deliberate reversal in `docs/lifeboat-memory-system.md`.
      Design validated against synthetic Hebrew notes before building, 2026-09-06
      (local models only, nothing from the real vault): - One clever pass does not work. `qwen2.5:7b` produced well-grounded edges
      in 17s but found no patterns and turned "two guys" into a person node;
      `gemma4:12b` named patterns correctly in Hebrew but produced zero edges
      in 117s. Split them: `gemma4:12b` for nodes, `qwen2.5:7b` for edges,
      the second pass given the first pass's names and allowed to use nothing
      else. Roughly 18s per note, so ten notes is about three minutes nightly. - With the split: people and patterns come back in Hebrew and correct, the
      purely technical note correctly yields nothing, and every edge quoted a
      span that really appears. No fabricated quotes in any run. - Residual failure mode, and it is real: name translation. A model
      rendered node names as Chinese in one run and transliterated a Hebrew
      name to "Mary" in another. Deterministic rule required, not prompt
      wording: **drop any node name that is not a verbatim substring of the
      note**, and drop any edge naming a node the first pass did not declare.
      Both were caught by exactly that check in the probe.
      What remains unproven is usefulness, not safety: whether the connections
      it proposes are worth having can only be judged on his real notes.
      MEASURED ON THE REAL NOTES 2026-09-06, and the local-model decision is
      REVERSED with his approval. Contents were sent to the model; none were
      printed, and only structure was reported. - Local, free naming: 31 distinct patterns across 17 notes, 2 recurring,
      mostly English labels in a Hebrew vault, plus Noam himself named as a
      person in nine notes. A pile, not a graph. - Local, shown the known labels: collapsed the other way -- it stamped the
      first note's label onto sixteen of seventeen. The model is bad at
      judging whether two labels mean the same thing, in both directions. - Cloud `gpt-5.4-mini` on the existing subscription route, same prompt as
      the second local run: 12 distinct patterns from 35 labels, 9 of them
      recurring across two or more notes, largest covering 8/17 so no
      collapse, all Hebrew, zero failures, 32 seconds for all 17 notes
      against 465 locally. `ביקורת עצמית` in 8 notes and `השוואה עם אחרים` in
      7 are exactly the recurrence the graph exists to surface, and `רי`
      recurs as a person.
      The privacy argument for local was weaker than first stated and he said
      so: these notes are written from conversations that already reach the
      cloud, so this is the same material taking a second trip rather than a new
      category. Volume is the real difference, and the nightly pass processes
      only notes changed since the last run -- typically one or two.
      Decision: cloud `gpt-5.4-mini` for extraction, incremental. The local path
      stays documented as the fallback if he ever reverses this.
      BUILT 2026-09-06 as `gateway/lifeboat_memory_extraction.py`. The model
      does one job -- read a stored note and say who and what it is about --
      and code decides everything else. Every discard rule corresponds to
      something a model actually did in the probes, not a hypothetical: the
      writer and the bot can never be nodes (named in nine of seventeen notes);
      a person must appear verbatim in the note (Chinese in one run, "Mary" in
      another); a label longer than five words is a sentence, not a reusable
      name; an edge must quote a span that really appears, join two names the
      first pass declared, and carry one of three types. Transport is injected,
      so the whole thing is testable without a network. 11 focused tests, 159
      across the memory suites, Ruff clean. Nothing is written yet -- this
      proposes; R-G4's nightly runner will be what writes.
- [x] R-G4 Nightly runner BUILT 2026-09-06 as
      `gateway/lifeboat_memory_consolidation.py`. Processes only notes whose
      ledger digest changed since the last run, so an ordinary night is one or
      two notes. A run that cannot fit its budget writes nothing at all rather
      than a prefix -- a partly consolidated graph looks finished and is not.
      Each edge is appended to its own node as one ordinary Markdown line
      carrying the type, a link back to the source note, the date and the
      quote, so he can read, correct or delete any of it by hand. Re-running
      over an unchanged note writes nothing; re-processing a changed note does
      not duplicate an edge it already recorded; one unreadable note is
      recorded and the rest of the night continues.
      Two protections proved themselves during the build rather than in theory:
      the writer refused to link a source note that was not in the ownership
      ledger (the first test setup was unrealistic, not the code), and a
      fabricated quote never reached the vault. 9 focused tests, 174 across the
      memory suites, Ruff clean.
      Still to wire: the scheduled invocation itself, which must pin the
      life-advisor profile home explicitly -- a cron job is exactly the
      subprocess case that inherits the wrong ledger. Superseding a contradicted
      edge is not built yet; today an edge is added or skipped, never removed.
- [x] R-G4a Guard rules challenged 2026-09-07 -- "if the model is intelligent it
      won't need all of this" -- and the objection was right. Two junk filters
      are deleted, and both had been deleting real people. `NOT_A_NAME`, a
      stopword list, refused "או" as the Hebrew word "or". The fragment ban
      refused "נוע" as his own name clipped. Both are shortenings he uses for
      people in his life, alongside "סי" and "רי", and he shortens them
      deliberately -- "מקצר שמות כדי למסך זהויות" -- to mask identities before
      anything leaves the machine. The model had been reading his shorthand
      correctly the whole time and the code was overruling it.
      This also settles why he declined name anonymisation as a moving part on
      2026-09-06: he already does it himself, in the notes, by hand. So the
      shortenings are load-bearing privacy, not sloppy writing. Never expand
      one, never canonicalise one into a fuller name, and never treat one as
      junk. The writer/bot ban now matches exactly and is extended by adding a
      spelling, never by matching a piece of one; nothing may reject a name for
      being short, for looking like a word, or for sitting inside another name.
      Regression test covers all three.
      The failure was procedural and mine. The dry run was read as structure
      only, deliberately, so "או" arrived as a two-letter node with no way to
      tell a person from a preposition -- and I filled the gap by guessing
      rather than asking the one person who knew, then spent two cloud runs
      defending the guess. Not reading his notes stays right. Guessing what is
      in them does not: ask him.
      Also measured, and still open: label sets drift run to run at temperature
      0 -- 14, 17 and 20 nodes across three runs of the same seventeen notes.
      Before R-G6 claims any number, decide whether a first build is one run or
      the intersection of several.
- [x] R-V1 Vault split repaired 2026-09-07, found while asking why the nightly
      evidence summary "didn't activate". It had fired on time and finished
      clean, then answered `(silent)` -- correctly, because it had nothing to
      read. Life-Boat's turn logs and the Daily Evidence Journal were being
      written into `/media/endlessblink/data/app-data/.../OBSIDIAN_SYNCED`, a
      stale local copy, while the summary read
      `/home/endlessblink/home-data/app-data/.../OBSIDIAN_SYNCED`, which is what
      Dropbox actually syncs (`~/.dropbox/info.json` is the authority; 213MB vs
      387MB). The live profile config had the right root all along -- the code
      did not, in 31 places across 11 repo files and 20 files under `~/.hermes`
      (every profile's `OBSIDIAN_VAULT_PATH`, every per-profile
      obsidian-source-of-truth plugin, the base config, and the morning-context,
      pattern-evidence and memory-guard scripts). All repointed; backups in
      `~/.hermes/backups/vault-path-fix-20260907-082205`.
      Second, independent mismatch in the same failure: the summary read the
      `life-advisor/` and `default/` turn-log folders, but Life-Boat writes its
      own transcript to `life-boat/` -- so even in the right vault it was
      reading someone else's log. `life-boat/` is now the primary source.
      21 stranded files (Sep 5-7: three days of Life-Boat transcript, the Sep 5
      journal entry, the W36 weekly rollup, job-finder prep output) were merged
      into the live vault; overwritten files backed up under
      `~/.hermes/backups/vault-merge-20260907-082345`.
      The nightly prompt also called itself the 23:30 job while the schedule
      fires at 22:00, and listed the note's sections in prose. It now names
      22:00 and requires the exact heading shape the canonical README defines.
      10,874 tests pass; no test had hardcoded either root.
      Left alone: `~/.hermes/hermes-agent`, an 8.2GB unreferenced checkout from
      Aug 19 that still names the stale root. Nothing loads it any more (see
      R-V2); deleting it is Noam's call.
- [x] R-V2 The rest of it, on his instruction to fix all of it, same day.
      The 09:00 morning check-in had failed since Sep 5 with "no trusted
      prompt". That message is the scheduler refusing to let a proactive
      Life-Boat run invent a subject, and it fires when the pre-run context
      script returns empty stdout -- which is the honest signal, not the bug.
      The bug was underneath: `lifeboat_morning_context.py` read the parked-
      subject queue and the journal from the stale vault, so it found nothing
      to open from and printed nothing. It now returns ~4KB of his own parked
      subjects and journal lines. The guard behaved correctly throughout and is
      unchanged.
      Both `~/.hermes/scripts` Life-Boat helpers were also importing
      `gateway.lifeboat_checkin_context` / `lifeboat_context_sources` from the
      abandoned Aug-19 `~/.hermes/hermes-agent` tree, and `hermes_state` from a
      third checkout -- all three inside bare `except: pass`, so a stale or
      missing module degraded to silence rather than an error. Repointed at the
      live checkout; both scripts verified to produce output.
      The weekly summary was written every Saturday and never delivered:
      `deliver` named the Telegram thread but the job carried no
      `user_authorized_delivery`, so the delivery boundary blocked it every
      time. Granted, copying the daily summary's existing grant verbatim -- same
      chat, same thread, `scheduled-contact` scope, nothing wider -- with an
      assertion that refuses to copy if the destinations differ.
      Also corrected the line in his global CLAUDE.md that named the stale tree
      as the main vault, which is what let every writer keep choosing it.
- [x] R-V3 One subject per message, 2026-09-07. He reported the bot answering
      several subjects inside one long message, leaving him nothing to reply to,
      and asked for at most two threads with each in its own message.
      Nothing new was needed to send several messages: the channel prompt
      already asks for `<<<SPLIT>>>` between bubbles and the Telegram adapter
      already turns each part into its own message via
      `platforms.telegram.extra.message_split_marker`. What was missing was that
      the rule stops being followed. Reproduced before changing anything, on one
      synthetic multi-subject Hebrew message at conversation depths 0/20/40,
      eight samples each, in the isolated sandbox: depth 0 split every time,
      depth 20 gave 5/8 single blocks, depth 40 gave 8/8. Textbook instruction
      decay, worst exactly where it matters most to him. Reading the replies
      showed a second failure the counts missed -- even when it split, one bubble
      routinely carried three subjects.
      The change is one commission-style instruction in `build_signal_guidance`
      that caps the threads at two and gives each its own bubble. Result at depth
      40 on the same probe: 1/8 single blocks against 8/8 for the control.
      Checked against the opposite risk, because prescribing a shape onto replies
      that were already fine is the mistake made here twice before: on a
      single-subject message at depth 40 the arms are indistinguishable -- 8/8
      single bubbles both ways, ~100 chars both ways.
      Honest limits: one probe message repeated, so this cannot show whether the
      two-part shape becomes a formula across genuinely different conversations.
      Only he can see that, and he has been asked to watch for it. Ported harness
      is `scripts/lifeboat_bubble_replay.py` -- the Aug-14 original exists only in
      the abandoned tree and measures code the bot no longer runs; its vault
      isolation check was also a snapshot that cried wolf when another profile's
      cron job wrote mid-run, now content-based. 10,874 tests pass, plus a
      regression test pinning the rule into the assembled guidance.
      The `changing-life-boat-behavior` skill was corrected in the same pass: it
      named `~/.hermes/hermes-agent` as the live tree and pointed at two tools
      that exist only there.
- [x] R-V4 Evening summary, phrase regression, and the folder move, 2026-09-08/09.
      **The regression first, because it was mine.** The one-subject rule
      shipped on 09-07 said to take "the ones that sound most alive right now",
      and his 09:00 check-in came back opening on "הדבר הכי חי עכשיו" -- the model
      translating my instruction at him. That cliché is already banned in five
      places, all matching the exact sentence "מה הכי חי אצלך עכשיו, אם בכלל?",
      so a variant walked straight through. Reworded to a criterion he cannot
      echo as a phrase -- how much he said about a thing, and whether he returned
      to it -- plus an explicit ban on naming why a thread was chosen. Re-measured
      at depth 40, eight samples: splitting held at 1/8 single-bubble (control is
      8/8) and the banned phrasing went to 0/8. The reporting checker in
      `lifeboat_behaviour.py` now lists the stem rather than three sentences; the
      live delivery guard in `lifeboat_surface.py` was deliberately left on exact
      match, because a substring ban on the delivery path can suppress a real
      reply and a gate that can only reject pushes the bot toward silence.
      **Evening summary.** Chased the wrong template for hours: the six-heading
      Hebrew shape is bound to `„תוסיף להמשך”`, per his own 09-06 transcript, not
      to the evening summary, and no evening format existed. Drafted one, he
      changed `רגעים טובים / חיים / מחברים` to `משהו טוב שקרה`, and it is now
      canonical in the journal README, replacing the English headings. It adds
      `מה היה קשה`, which the content contract has always required and the
      English shape had nowhere to put -- part of why the summaries read thin.
      The nightly job now: reads the full day's turn log rather than sampling
      behind a note that is empty until 22:01; writes the note in his headings;
      and delivers those same headings instead of one prose paragraph. Steps 3
      and 6 are marked temporary and revert to finalizer-only once live curation
      exists. The scheduler wrapper (`Cronjob Response`, job id, "to stop this
      job") is confirmed gone from the delivered message.
      **Folder move.** `Life-Boat Memory` moved from directly under
      `📦 My Stuff` into `🧠 Life Context`, beside `Emotional Patterns and
Self-Worth`, `Dating Strategy` and `Romantic Relationship Processing`. All
      21 notes still authorize against the live ledger and the directory is still 0700. Tidiness only, and he was told so: same vault, same search, same
      readers. He considered moving it for privacy and decided against -- "everything
      is related and sometimes I will want other agents to read this".
      **Old vault deleted** after the desktop app, the last writer, was restarted
      and nothing recreated the path. 429MB, gone, with a file-by-file content
      audit first and divergent files preserved under `~/.hermes/backups/`.
      11,804 tests pass. One failure is pre-existing and not mine:
      `tests/cron/test_scheduler_shutdown_guard.py::test_helper_guards_standalone_delivery`
      greps the scheduler source for a guard near a comment, and
      `cron/scheduler.py` was last touched 2026-09-05, before this work.
- [ ] R-V5 Live curation, still the real fix. The journal is written once a night
      because nothing adds to it while he talks, which is what the contract in
      `daily-evidence-summary-and-positive-context.md` requires. Mirror
      `lifeboat-emotional-candidate-capture`, which already registers a tool on
      the `lifeboat_memory` toolset gate. Open boundary question first: the
      journal is not in the ownership ledger, so writing to it is writing to
      user-owned material.
- [x] R-V6 Transcript exposure, closed 2026-09-09. His concern was that a person
      opening the vault finds this material, and he was right about the risk
      while pointing at the wrong file: the memory folder was the only locked
      thing in there, while the raw transcripts sat world-readable at 40-60KB of
      full conversation a day, and Obsidian search reaches anything in the vault
      wherever it sits.
      The dot-folder idea was withdrawn as weaker than first claimed --
      `agent/vault_knowledge/path_policy.py` blocks hidden paths only for the
      vault-knowledge tool, while agents also hold an ordinary file-read tool
      with no root restriction. Saying so mattered more than shipping it.
      All 17 days moved to
      `~/.hermes/profiles/life-advisor/state/turn-logs/life-boat`, mode 0700 with
      0600 files: outside the vault, outside Dropbox, owner-only. The writer
      (`PERSONA_PRIVATE_ROOTS` in the obsidian-source-of-truth plugin, which
      re-applies 0700 on every write because Dropbox has widened these bits
      before), the reader, the nightly job's source list and the behaviour
      verifier were all repointed in the same pass. Both sides pin an absolute
      path rather than deriving it from `HERMES_HOME` -- the gateway runs the
      base home while the conversation belongs to the life-advisor profile, and
      deriving it is the trap that misfiled this exact data four times.
      The trade he accepted: no Dropbox backup and nothing on his phone. "the
      summaries will keep covering everything that is crucial" -- the Daily
      Evidence Journal stays in the vault, synced, and readable by his other
      agents, which is the split he asked for. A regression test pins the
      transcript directory outside the vault so a later edit cannot move it back.
- [ ] R-G5 Read path. Wire `read_one_hop` into discovery so a conversation can
      follow an edge; it exists and nothing calls it today. Start at one hop.
- [ ] R-G6 Measure a/b/c against flat search. If traversal does not win, say so
      and stop expanding the graph rather than adding ranking machinery.

Dropped by the owner 2026-09-06: the plugin's `reviewed:` flag marking a note
off-limits to rewriting. He saw no value in it, and the protections that matter
— the bot may only change notes it created, and contradictions are superseded
rather than overwritten — already hold without it.

Standing invariants: discovery off unless explicitly enabled and identity
matched; only ledger-owned notes searchable; digests revalidated on read;
references expire with the turn and are revoked on config, authorization,
cancel, timeout or profile change; retrieved note text is untrusted evidence,
never instructions.

### Current protected-memory work — in progress

Immediate priority: finish the bounded reminder skip-versus-failure correction,
then protected memory, without using repeated operator Telegram messages as a
debugging harness. Current source proofs and remaining deployment/read-back
gates are recorded in `docs/lifeboat-current-goal.md`. The current connection
candidate supplies an explicitly named approved note to the current request
only, without changing the stable prompt or persisted conversation. It does
not enable unnamed semantic recall or change the automatic writer's policy.

The current memory repair is a bounded reader correction, not a replacement of
the conversation engine. Broad reset/debrief wording may not inject the newest
protected Obsidian note or use phrase-routed topic selection as if it were
user intent. The protected writer remains separate and unchanged: it records
only clear user-stated durable details in the dedicated Life-Boat-owned area.

The first local repair removes newest-note injection on a broad request and has
focused source evidence. It does not prove live Telegram behavior. The BGE
reranker fake-vault candidate is rejected because it accepted unrelated held-out
queries; it is forbidden from real-vault or Telegram use. Before any future
semantic reader can be proposed, it must pass a frozen fake Hebrew/mixed vault
that rejects unrelated and near-miss prompts, then a fresh independent
challenge and HIGH `$sure` review. The remaining legacy phrase-routed reader is
diagnosis-only until an equally narrow, preservation-first candidate exists.

The first and highest-priority acceptance surface is the **Live
Obsidian-Grounded Conversation Matrix** on headed Telegram Web. It must run a
fresh, dynamic, complete dialogue one turn at a time: natural opening, concrete
context anchor, user answer, deeper same-thread follow-up, pushback or
correction, side-detail handling, recovery, and natural closure. The runner must
inspect each fresh visible bot reply before authoring the next synthetic user
turn. One-off prompts, replayed transcripts, canned expected sentences, generic
summaries, and repeated-question loops never count.

The runner may use authorized read-only Obsidian context, including recent and
relevant long-term memories, as fallible leads. It must vary domain, anchor,
wording, and conversation path on every run, keep a novelty ledger, and never
expose raw private vault text in default evidence. Ri is one example only.

Every interactive, scheduled, proactive, command, retry, media, and fallback
output must pass the complete shared pipeline. Any direct send, static fallback,
repeated fallback, missing reply, generic/irrelevant reply, unsupported
inference, recycled trajectory, or missing fresh Telegram-Web receipt is a
hard failure: stop the run, identify the first failing stage, repair it, restart
the installed runtime if needed, and retest from a clean session before sending
more quality turns.

The execution gates are locked: `$sure` must be **HIGH / PASS** before each
implementation or new test run, and `$challenge-loop` must produce a fresh
snapshot, evidence ledger, and independent JSON review. Missing browser,
context, pipeline, receipt, or reviewer evidence is `BLOCKED`, not skipped. The
bounded remote authorization removes routine per-turn approval, but never
overrides a browser safety gate or authorizes private context disclosure.

The morning check-in, casual check-in, and daily summary remain separate
required service cases. Each must prove due → claim → generation → complete
pipeline → scheduled Telegram-Web delivery → completion; enabled records and
manual triggers are not liveness evidence. Second-identity acceptance remains
explicitly deferred and cannot be silently counted as passed.

## Current evidence (2026-08-28)

- Latest non-live run (2026-08-29): 199 conversation, context-integrity,
  scheduled-liveness, service-readback, debrief, mode, pipeline, and browser
  contract tests passed. The canonical 100-case ledger reports 51 replay cases
  passed and 49 declared-surface cases unverified; this is not a complete matrix
  pass.
- Current service readback reports morning, spontaneous, and daily-summary jobs
  enabled/scheduled with no metadata problems. This proves configuration state
  only; it does not prove a fresh visible Telegram delivery receipt.
- Focused source suite: 283 tests passed across dialogue, trajectory-quality,
  focused-matrix, scheduled-liveness, service-readback, and scheduler files.
- Canonical matrix runner: 100 unique cases and zero replay-smoke failures;
  51 replay entries are marked passed and 49 declared-surface entries remain
  unverified, so the matrix is not complete.
- Live scheduler metadata: all three routines are enabled, scheduled, have
  future run times, and target the authorized Telegram topic.
- Telegram Web: a morning message is visibly present, but it referenced an
  unrecognizable “messages” context and produced repeated static fallbacks
  after the user asked for clarification; this is a live quality failure.
- Telegram Web connection-check retest: the first reviewer fix still produced
  small-talk; the follow-up fix now visibly returns only “כן, אני כאן.” and the
  runtime records a full pipeline receipt.
- A fresh-session trajectory exposed reset incompleteness: `/reset` cleared
  transcript state but left the prior `work` mode, so “אני צריך לדבר קצת על מה
  שקורה איתי” was routed as work and produced an irrelevant edited reply. The
  source and installed runtime now clear mode and debrief state on `/new`; the
  post-fix deep trajectory is still unverified because the headed browser
  binding timed out during the restart.
- Daily-summary delivery for the current day has not yet acquired a fresh
  scheduled Telegram-Web receipt.
- Fresh Debrief Questions Lane attempt after the trigger and reviewer fixes:
  the vague opening was visible at 23:36, but the installed runtime returned
  the static fallback at 23:37 instead of a grounded first question. The live
  lane therefore remains failed; no follow-up turns were sent after the
  fallback.
- Fresh Debrief Questions Lane retest at 23:41: after a clean `/new`, a new
  underspecified opening was visible in Telegram Web, but no assistant reply
  appeared during the initial wait; the runtime later delivered the static
  fallback. This is another failed live lane run, not a quality pass, and no
  follow-up turns were sent.
- No readiness claim is allowed until these failures are corrected and
  re-tested on the real acceptance surface.
- 2026-08-29 repair evidence: the shared outbound boundary now re-runs quality
  review even when upstream marks a draft checked; a rejected/timeout/bare-mode
  review is quarantined instead of becoming a user-visible static fallback.
  The In-Control selector bug was also fixed (`let candidates`) and its live
  injected build reports 0.1.31 with a visible Telegram Send control. These
  are source/runtime repairs, not yet a live conversation pass.
- 2026-08-29 challenge review: 285 affected source tests passed and the
  installed gateway overlay matched after restart, but the independent review
  remains BLOCKED because the fresh Telegram-Web trajectory and scheduled
  visible receipts are still missing. Live sending is paused while the
  controller holds the synthetic draft left by the failed send attempt.
- 2026-08-29 controller/scheduler repair v3: 950 affected Python tests and 6
  In-Control Node protocol tests passed with a hash-bound report and ledger.
  The controller now distinguishes prepared from forwarded operations, refuses
  ambiguous forwarded resends, reconciles only a fresh immediate outbound /
  inbound pair, fails closed on corrupt ledgers, and syncs the ledger file and
  parent directory. Scheduled readback now requires a receipt tied to the
  exact delivery run and complete Life-Boat pipeline stages. Independent v3
  review found no further source-level blocker, but correctly remains BLOCKED
  on the two live acceptance requirements: a fresh headed Telegram-Web
  trajectory and receipt-backed deliveries for all three scheduled services.

## Active hard-stop incident

- [ ] **Fallback recurrence is a cross-layer release blocker.** Any appearance of
      either static fallback in Telegram Web, including after a user asks why the
      previous fallback appeared, must stop the run immediately and remain open until
      the complete path is tested: context loading, model/provider selection, draft,
      initial safety, reviewer, rewriter, final safety, splitter, sender, scheduler
      and proactive services, retry/429 handling, restart/rehydration, and browser
      receipt/reconciliation. A fallback is never an acceptable response or a reason
      to continue with another test turn.
- [ ] For every recurrence, capture a redacted stage trace with decisions,
      content hashes, policy version, error class, latency, update id, and logical
      response id; identify the first failing stage, add a regression reproducer,
      repair the root cause, run focused and full source gates, synchronize/restart
      the installed runtime, and verify source/installed hashes before live retest.
- [ ] The repair is not verified until a fresh Telegram-Web turn receives a
      non-fallback reply, the reply is specific and relevant, and a second follow-up
      receives a different, context-responsive non-fallback reply. If either turn
      falls back, repeats, disappears, or becomes generic, reopen this incident and
      repeat the repair loop.
- [ ] Repeated primary static fallback is still observed in the live Telegram
      Web conversation. This is an open production-quality incident, not a test
      result: stop all matrix progression and do not close the goal while it is
      unresolved.
- [ ] Trace the exact failing stage in the running gateway, fix the upstream
      response path, run the focused regression gate, synchronize and restart the
      installed runtime, and verify runtime hashes.
- [ ] Send one fresh, non-recycled Telegram-Web turn and require a visible
      non-fallback reply before resuming any further trajectory turns.
- [ ] If any fallback appears again, reopen this incident and repeat the repair
      loop; never leave it for later, count it as safe, or work around it with more
      test messages.
- [ ] The standing authorization for the authorized Telegram-Web test chat is
      sufficient for all in-scope synthetic trajectory turns; do not reopen a
      per-turn approval question or pause routine continuation. Pause only for the
      hard-stop conditions above, an out-of-scope destination, or a genuine safety
      ambiguity that cannot be resolved by the existing authorization contract.
- The Debrief Questions Lane runner was hardened after review: it now requires
  a trajectory-level verdict before a lane run can pass, and a fresh receipt
  must contain both a visible user message and a visible bot message. This is
  source/test evidence only; the lane remains unverified until a fresh complete
  trajectory passes on Telegram Web.
- The next fresh live attempt on 2026-08-29 was interrupted when the browser
  control kernel reset and the existing Telegram-Web target closed. Delivery is
  unknown, so this attempt is recorded as `unverified`; it does not advance the
  lane or authorize follow-up turns.

## Non-negotiable contract

- Quality passes require complete multi-turn trajectories, never isolated prompts.
- Each trajectory includes a natural underspecified opening, a concrete retained
  anchor, a user answer or correction, a deeper follow-up, and recovery from
  pushback or an unrelated detail.
- The bot must use known specific people, events, decisions, actions, or beliefs;
  broad recaps, domain menus, impossible historical questions, reflexive
  “right?” mirroring, and unjustified closure fail.
- Ri is one example only; held-out cases rotate across relationships, work,
  self-judgement, body/gym, money, decisions, and novel runtime anchors.
- Every user-visible output, including scheduled jobs, proactive follow-ups,
  retries, captions, and fallbacks, uses the shared Life-Boat pipeline:
  context → draft → safety/role → quality review → repair/fallback → final
  safety → split → per-part safety → delivery receipt.
- Missing transcript, scheduler, pipeline, or Telegram-Web evidence means
  `unverified`, never passed.
- `$challenge-loop` is a mandatory gate for every work cycle: create a fresh
  snapshot and evidence ledger, run the bounded checks, obtain an independent
  read-only review, and repair every `REVISE` finding before continuing. A
  missing reviewer, stale snapshot, malformed receipt, or `BLOCKED` verdict
  stops claims of completion; the implementing agent may not convert it into a
  pass.
- A repeated static fallback, missing reply, duplicate reply, or any other
  user-visible regression is an immediate hard stop: stop live testing, trace
  the running path, reproduce the failure, fix it, run its regression gate,
  and resume only after a fresh Telegram-Web receipt proves the fix. Never
  continue the matrix around an unfixed failure or count the fallback as a
  quality result.
- Static fallback text is never a quality response: it is a failed-turn signal
  and a hard limiter. Allow at most one primary and one secondary recovery per
  session; after that, emit an operational alert and send nothing until the
  upstream failure is fixed. A fallback keeps the trajectory failed and blocks
  readiness, even when delivery itself succeeds.
- Test data and test messages must be removed or isolated before readiness is
  reported.

## Workstreams

### 1. Live Obsidian-grounded conversation — first release blocker

- [ ] Build the Telegram-Web Conversation Runner for the Live
      Obsidian-Grounded Conversation Matrix; fixture validation,
      reviewer calls, and one-sentence checks cannot satisfy this task.
- [ ] Use `scripts/lifeboat_live_trajectory_runner.py` for every live run; it
      rejects missing Obsidian receipts, recycled turns, unvalidated user voice,
      and any turn without a fresh visible Telegram-Web response.
- [ ] Use one recorded standing authorization for synthetic,
      voice-calibrated test turns in the authorized Telegram-Web chat; do not
      request turn-by-turn approval inside that scope, and fail closed outside it.
- [ ] The live runner must create the complete user-side trajectory itself from
      the current read-only context and approved voice calibration; it must never
      wait for the user to compose test messages or ask for per-turn approval.
- [ ] Require a unique standing-authorization receipt before the first send,
      and reject missing, expired, revoked, out-of-scope, agent-authored, meta,
      recycled, or unnatural user turns before sending anything.
- [ ] Run the six mandatory Live Obsidian-Grounded Conversation trajectories from
      `docs/lifeboat-focused-e2e-matrices.md`.
- [ ] Run the 12 conversational-value trajectories as complete, deep,
      intricate Telegram-Web conversations with varied anchors and user behavior.
- [ ] Run the separate eight-trajectory **Debrief Questions Lane**: infer when a
      guided debrief is useful without requiring the user to name it, choose
      concrete remembered domains, ask narrow-but-answerable questions, deepen from
      answers, and recover from correction or pushback.
- [ ] Treat `docs/lifeboat-debrief-question-lane.md` as the standalone first
      **Debrief Questions Lane** gate:
      conversational gate: the driver authors varied, voice-calibrated user turns
      from fresh Obsidian context, and no one-off sentence or recycled transcript
      may satisfy it.
- [ ] Fail the debrief lane on generic recap, domain menus, impossible
      historical recall, repeated questions, reflexive mirroring, side-topic drift,
      unsupported motives, or closure before the user signals enough.
- [ ] Require natural dialogue rather than a mechanical questionnaire: vary
      user phrasing and answer length, let the bot adapt to actual replies, and
      score naturalness together with specificity, continuity, and depth.
- [ ] Load relevant read-only Obsidian context for each trajectory and record
      it dynamically at run time, using recent memories for the active thread and
      relevant long-term memories to build continuity; record only a redacted
      context receipt plus the selected-anchor identifier, never a copied
      personal-story fixture.
- [ ] Test both memory layers: reward a relevant older connection and fail an
      unrelated memory dump, forced callback, or confident use of stale context.
- [ ] Treat memory as fallible human-like evidence: use one relevant cue as a
      tentative lead, adapt to the current reply, and never present the vault as
      unquestionable truth or a complete profile.
- [ ] Use controlled random seeds to vary domains, openings, anchors, answers,
      corrections, pushback, and side details; never hard-code expected reply text.
- [ ] If a subject recurs, require a materially different human-like angle—a new
      moment, layer, consequence, or question path—not superficial paraphrasing.
- [ ] Add fresh conversation concepts rather than recycling prior transcripts:
      postponed decisions, unexpectedly good moments, changed intentions,
      word/action mismatches, being seen, resource boundaries, body-versus-plan,
      challenged beliefs, quiet avoidance, and unfinished interactions.
- [ ] Bind each concept dynamically to a relevant recent or long-term Obsidian
      memory; never expose the concept list as a user-facing menu or follow its
      label instead of the user's actual answers.
- [ ] Make every matrix run dynamic: generate a fresh seeded trajectory and
      current context retrieval, vary user behavior and path, reject replayed or
      near-identical conversations, maintain a no-reuse novelty ledger, and retain
      the seed only for reproducibility.
- [ ] Compare the current runtime against the known failed conversations from
      2026-08-27 and 2026-08-28.
- [ ] Add live regression trajectories for the observed failures: scheduled
      output naming context the user cannot recognize; repeated static fallback
      after a clarification question; reset followed by a vague opening that keeps
      the old mode; and a generic “am I close?” reply when concrete retained
      anchors are available.
- [ ] Require a complete ordered Telegram-Web transcript, fresh visible
      receipts, redacted Obsidian-context receipt, selected-anchor evidence, and
      pipeline receipts before any dialogue case can pass.
- [ ] Enforce the live-trajectory gate: never skip interactive Telegram-Web
      execution, never manufacture user turns that do not sound like Noam, and
      never count a one-off reply or replay as a conversation-quality pass. The
      gate must fail closed when voice validation, fresh context, or the complete
      trajectory receipt is missing. Each generated user turn must carry a
      redacted receipt binding its normalized content hash to the current context,
      selected anchor, and approved voice samples; declarative booleans alone do
      not qualify.
- [ ] Use `quality_mode=agent_interactive` for conversational-quality runs:
      the agent must inspect and analyze each live reply before authoring the next
      user turn; prewritten turns or scenario-supplied quality verdicts cannot pass.
- [ ] Run quality cases through `scripts/lifeboat_interactive_runner.py` one
      turn at a time; require the preceding reply analysis before each continuation
      and keep the run `unverified` until the agent submits the final verdict. A
      debrief cannot be closed from one reply: the runner requires the complete
      anchor, answer, deepening, pushback/correction, recovery, and closure stages
      across a real multi-turn exchange.

- [ ] Use `config/lifeboat-live-authorization.json` as the authoritative,
      permanent but revocable authorization for live CLI runs; embedded scenario
      metadata must match its identity and cannot widen its multi-agent, chat/topic,
      lane, or turn-limit scope. No per-turn approval is required inside scope.

### 2. Context integrity — required

- [ ] Run retention, correction, unsupported-inference, assistant-vs-user
      provenance, truncation, reset, and topic-isolation cases.
- [ ] Verify that only user-authored facts become durable context.
- [ ] Verify clean-session reset and no cross-topic or cross-user leakage.

### 3. Scheduled-service liveness — required

- [ ] Verify gateway health/readiness and scheduler heartbeat.
- [ ] Verify enabled state and future schedules for morning check-in, casual
      check-in, and daily summary.
- [ ] Verify due → claim → generation → pipeline → delivery → completion for
      each service.
- [ ] Obtain fresh, scheduled-boundary Telegram-Web receipts for all three;
      manual triggers do not count.
- [ ] Test restart, stale claims, duplicate claims, delivery failure, and
      opt-out persistence without writing fixtures into live stores.

### 4. Telegram-Web acceptance — required subset

- [ ] Use the authenticated headed Telegram-Web instance when the case is
      visually or user-behaviorally testable.
- [ ] Capture fresh visible receipts, timestamps, message order, and the
      applicable chat/topic identity.
- [ ] Mark webhook retry, update-id dedupe, internal gate ordering, and other
      non-visual cases as replay/staging-only rather than pretending Web proves
      them.

### 5. Reliability and honesty — required

- [ ] Ensure rejected or timed-out outputs never become silent drops or repeated
      operational fallback loops.
- [ ] Ensure documentation and runtime reports distinguish source tests,
      staging evidence, installed runtime evidence, and Telegram-Web evidence.
- [ ] Keep default operational logs redacted and retain only the evidence needed
      to diagnose a failure.
- [ ] Clean test messages, test sessions, memory, scheduler fixtures, and
      temporary artifacts after testing; preserve redacted evidence receipts.

## Authoritative references

- `docs/lifeboat-current-goal.md`
- `docs/lifeboat-conversation-contract.md`
- `docs/lifeboat-focused-e2e-matrices.md`
- `docs/lifeboat-failure-matrix.md`
- `docs/lifeboat-production-runbook.md`
- `HANDOFF.md`

## Release gate

The goal remains `in_progress` until the required dialogue and context suites
pass, all three scheduled services have fresh real receipts, the In-Control
controller has passed its reconnect, idempotency, and visible-receipt checks,
reported failures are demonstrably addressed, and test state is cleaned. A
green unit suite, configuration flag, or stale browser result alone is not a
release or readiness claim.

## Independent challenge review — 2026-08-28

The read-only reviewer returned `BLOCKED`; these findings are now mandatory
follow-up work under this goal:

- [ ] CH-01 Make runtime health failures fail closed at the delivery boundary,
      with a visible safe result and an operational alert rather than swallowed
      errors.
- [ ] CH-02 Give scheduled messages trusted context that cannot be satisfied by
      the generated draft itself; verify grounding independently.
- [ ] CH-03 Make pipeline-exception fallback delivery carry the same mandatory
      receipt metadata and pass the sender guard.
- [ ] CH-04 Remove duplicated hardcoded Life-Boat identity/routing decisions;
      use one registry-backed boundary for chat/topic authorization and pipeline
      enforcement.
- [ ] CH-05 Add an integration test proving `/new` clears transcript,
      trajectory, debrief, mode, follow-up, and other Life-Boat state before the
      next vague emotional opening.
- [ ] CH-06 Keep operational fallbacks visible as degraded recovery, never as a
      conversational-quality pass; prevent repeated fallback loops.
- [ ] CH-07 Establish one gateway owner and fresh authenticated Telegram-Web
      evidence; competing startup attempts or stale evidence cannot satisfy E2E.

Challenge evidence: the focused source suite passed 283 tests, but the
canonical matrix remains 51 passed / 49 unverified and the live deep trajectory
is not yet proven after the reset fix.

## Complete task register

### Conversation and context

- [ ] C-01 Build and run deep, meaningful multi-turn conversations from natural
      vague openings; no isolated prompt may pass.
- [ ] C-02 Cover varied concrete domains and anchors: relationships and
      resentment, unequal care, speed-date decisions, work and self-judgement,
      body/gym actions, money, decisions, and novel retained-context anchors.
- [ ] C-03 Follow user answers with deeper questions; recover from “unrelated”,
      corrections, pushback, and “stop asking if you are right”.
- [ ] C-04 Eliminate generic recap, domain menus, impossible historical recall,
      reflexive mirroring, side-topic small talk, unsupported motives, and premature
      closure.
- [ ] C-04a Reject short generic questions that abandon usable prior context
      even when the conversation is not explicitly in debrief mode; enforce this
      structurally rather than by accumulating canned phrases.
- [ ] C-05 Verify context retention, correction overwrite, provenance, reset,
      truncation, topic isolation, and documentation honesty.
- [ ] C-06 Compare every fix against the reported 2026-08-27/28 failures and a
      held-out varied trajectory set; use calibrated model scoring only as advisory
      until human alignment is proven.
- [ ] C-07 Reject the failed pattern from 2026-08-28: agent-authored unnatural
      user turns such as “אני עדיין רוצה להישאר עם הרגע הזה...” cannot be used to
      steer or pass a live conversation. Use real user wording or a reviewed,
      voice-calibrated variant and record its provenance.

### Services and outbound architecture

- [ ] S-01 Keep morning check-in, casual check-in, and daily summary enabled,
      scheduled, authorized, and assigned to the intended topic.
- [ ] S-02 Prove each service through due → claim → generation → full pipeline →
      delivery → completion, including restart, stale claim, duplicate claim,
      delivery failure, and opt-out persistence.
- [ ] S-03 Route every interactive, scheduled, proactive, command, retry,
      caption, media, and fallback output through one shared pipeline; direct sends
      are test failures.
- [ ] S-04 Prevent repeated static fallbacks, silent drops, unrecognizable
      scheduled context, and unanswered user clarification; preserve context and
      an explicit receipt through recovery.
- [ ] S-05 Add fresh scheduled-boundary Telegram-Web receipts for all three
      services; manual triggers do not satisfy liveness.

### Telegram Web and browser control

- [ ] W-01 Use the authenticated headed Telegram-Web instance for visible
      dialogue, service, ordering, splitting, RTL, isolation, and stop/proactive
      acceptance cases.
- [ ] W-02 Capture fresh message IDs or visible receipts, timestamps, order,
      chat/topic identity, and the exact tested trajectory.
- [ ] W-03 Keep webhook retry, update-id dedupe, internal gate ordering, and
      chaos cases in replay/staging; Telegram Web alone cannot prove them.
- [ ] W-04 Finish and validate the In-Control controller prerequisite: stable
      connection, tab identity, reconnect, leases, operation IDs, idempotency,
      inspect → act → verify receipts, and no keyboard hijacking.
- [ ] W-05 Keep In-Control browser control neutral and reusable across agents,
      Chromium/Brave first and future browser adapters later; open-source packaging
      is deferred until reliability and installation are proven.
- [ ] W-06 Treat In-Control as a release prerequisite for headed Telegram-Web
      E2E: no source, replay, API, or stale-browser result may be reported as fresh
      visual acceptance without a controller operation receipt.

### Evidence, cleanup, and release

- [ ] R-01 Keep source, replay, staging, installed-runtime, and Telegram-Web
      evidence clearly separated; never report configuration as liveness.
- [ ] R-02 Keep default logs redacted; preserve only hashes, decisions,
      timestamps, receipts, and controlled audit artifacts.
- [ ] R-03 Remove test prompts, messages, memory, scheduler fixtures, and
      temporary state from the bot context and shared stores after evaluation.
- [ ] R-04 Verify clean-session startup and ensure ordinary user context contains
      no test material.
- [ ] R-05 Do not mark ready until grounded-conversation hard failures, context leaks,
      missing replies, scheduled-service receipt gaps, and documentation gaps are
      resolved and re-tested.

### Explicitly deferred

- [ ] D-01 Second-identity or multi-user acceptance tests remain deferred by
      product decision; they are not silently counted as passed.
- [ ] D-02 High-risk crisis recall/red-team cases remain isolated from ordinary
      conversational-quality and false-positive suites.

## Bot identity (added 2026-10-02)

This project's bot: `lifeboat` — Life-Boat, Concil topic 2, profile `life-advisor`, identity `@hermes_rheotelgchebpsdo_bot`, local gateway. See its entry in `devops/brainiac/BOTS.md` (single source of truth for every bot; Hermes = platform only, bots are referred to by handle). Update BOTS.md when this bot's topic, profile, host, token owner or status changes. No token values in plans.

### TASK-1 - Replace the canonical-goal read gate with something that works (research + implementation)

- **Status:** open
- **Opened:** 2026-10-05, Noam: "we must kill the gate. it does more harm than good" / "there must be another way to get the result it tries to get".
- **Why the old gate was switched off:** the canonical-goal-guard hooks forced a full read of the 2,762-line goal doc, the handoff and the memory doc, then a HIGH sure receipt, and wiped that receipt on every user prompt and every 8 tool calls. A read cycle left about one working call, blocked even writing a handover, and cost tens of thousands of tokens per user message. Backups of every edited file sit beside it with the suffix .bak-before-gate-kill-20261005 (rollback = restore them).
- **Result the gate was trying to reach:** agents stay aligned with the canonical goal and the preservation-first rules, and nobody changes instructions, config, jobs, gateway code or canonical docs without evidence they read the current goal.
- **Research:** how the newer freelance-desk and agent-dev-kit implementations get this result; compare candidates against measured cost: (a) hash-change freshness, re-read only when the goal file hash changes, with a receipt that survives prompts and sessions; (b) a short generated goal card (about 100 lines) injected at session start and after compaction, full doc kept as reference; (c) split the goal doc into a stable contract and an archived status log; (d) gate only risky writes (instructions, config, jobs, gateway code, canonical docs), never reads, searches or handover writes; (e) exempt the gate's own reads and sure call from any call counter.
- **Implementation:** chosen design, tests (stale hash, partial read and wrong session fail; normal work and handovers are not blocked), staged rollout, rollback note.
- **Done when:** an agent can start a session, do a normal task, write a handover and receive several user messages without a read cycle each time, while edits to protected files still require evidence of a current goal read. Evidence recorded here.
- **Do not:** forge receipts, weaken validation without a replacement, or shrink the goal doc without Noam's approval.

### TASK-2 - Life-Boat grounding failure: an earlier event is presented as the cause after a time gap (investigate + fix + verify live)

- **Status:** in_progress (handed to a fresh instance 2026-10-05; nothing changed in Life-Boat code yet)
- **Incident (2026-10-05, msg 8832, session 04755_3503302e):** he described anxiety after a social-group event; hours later said he was still anxious and asked for help including autism/ADHD angles. The bot made the group event THE cause and stacked ADHD/autism hypotheses on it. He corrected it: time passed, other things may have happened.
- **Contract:** an earlier event is never the cause because it was last discussed, replied to, shares an emotion word, the feeling is "still" there, it is plausible, or a diagnosis could explain it. Feeling continuity may be inferred, cause continuity may not. After a time gap keep separate: continued / faded and returned / other event / accumulation / background stressor / bodily arousal / unknown. Before any autism/ADHD/AuDHD/RSD reading establish the current scene. If evidence is thin: say briefly what is known, name causal uncertainty plainly, ask ONE narrow question; no questionnaire, no blanket "always ask". Do not overcorrect: prior context stays when he states the link, confirms nothing changed, the thread is continuous with a stated link, or the event is one bounded hypothesis.
- **Investigate:** which prompt/skill/memory/summary anchored; were timestamps and elapsed time visible; did reply-to raise epistemic status; were assistant summaries treated as user premises; does the gate check causal claims or only entities; can hedging smuggle the premise; why the existing epistemic rules failed; prompting only, or also context construction, provenance, temporal representation, editor, deployment. Known so far: no elapsed-time handling anywhere in the reply path; causal guidance exists only in the followups, rewrite and editor modules; the quality pipeline did not run on the incident reply.
- **Implement (smallest robust fix, Life-Boat profile only):** temporal provenance on evidence; classes current_user_fact / historical_user_fact / assistant_hypothesis / causal_claim; claim-level causal check; temporal-discontinuity check; targeted revision of unsupported spans; no canned reviewer fallback; preservation-first (no reviewer removed, interactive quality pipeline stays off, no keyword routing).
- **Tests:** 10 Hebrew fixtures (same feeling after gap; reply-to an old message; explicit causal continuity; multiple contributors; neurodivergence request without scene; continuous short exchange; same symptom different cause; accumulated stress; unsupported causal clause hidden in a grounded draft; user correction), plus baseline-vs-fixed on identical transcripts, editor on vs off, and no regression in genuinely continuous conversations.
- **Done when:** installed runtime inspected separately from source, only owned Life-Boat files deployed, gateway restarted through its real supervisor with Noam's approval, replacement process verified (module path, hashes, start time, editor state), a realistic Hebrew replay checked as actually delivered, rollback path written. Not complete before that.
- **Evidence (2026-10-06, local only, NOT deployed):** cause found in code: ordinary live turns take the clean-owner route, which skips the editor/review pipeline; its "active conversation" has no time bound; a reply-to carries the quoted words but not their age. Fix written at the context layer: new elapsed-time facts (only when 45+ minutes passed, facts only, never persisted) added to the turn-local private context, plus one added guidance sentence; no reviewer added or removed, no keyword routing. Tests: 11 new time-fact tests, 1 clean-route test, 10 Hebrew fixtures; `pytest tests/gateway -k lifeboat` = 1326 passed, 1 skipped. Local replay (Ollama gemma4:e4b only, 1 sample per arm, 10 fixtures, read by hand): inconclusive. Fixed arm was clearer on the reply-to-old-message case (asks whether it is the group or something else) and avoided a baseline that invented a breathing exercise, but both arms still assumed the group on the same-feeling case and the neurodivergence-without-scene case, and one fixed reply contained a stray Arabic word; a small local model with one sample is inside the noise band, so this is not evidence of effectiveness. Not yet done: wiring test for the gateway glue, independent challenge, deployment and a delivered Hebrew replay (both need Noam's approval). The claim-level causal check from the brief was deliberately not built (interactive pipeline is off by his decision; preservation-first forbids new reject-only reviewers). Effectiveness is UNTESTED.

### TASK-3 - Persistent retry recovery for the morning job 7d1402944efe (implemented locally, not deployed, not activated)

- **Status:** ACTIVATED 2026-10-07 22:39 (Noam: "Yes, go live now"). **No production retry has been demonstrated.** The 10-08 and 10-09 morning deliveries were ordinary first-attempt deliveries — they show the opted-in job still delivers once, not that retry works. Every retry line in the live logs is test-generated (fixtures named "morning"); zero exist for 7d1402944efe. Retry, quota exhaustion, uncertain delivery, restart recovery and the single-notice claim are proven by tests only. (Corrected 2026-10-09 23:15; see docs/incidents/2026-10-06-test-jobs-live-scheduler.reconciliation.md.)
- **Re-verification (2026-10-09, read-only except as noted):** machine rebooted 2026-10-08 10:58; `hermes-gateway.service` now PID 2093 (started 10-08 10:58:51, 0 restarts), unit PYTHONPATH = this working copy; cron/agent/gateway in this tree equal HEAD and unchanged since ccd2998f68 (10-07 22:30), so the running process loaded the activated code (sha256 prefixes: retry_recovery d7b79384, scheduler 4303818c, jobs 652e9e30, conversation_loop 9fec3f80). No restart or job change was needed or made. Job 7d1402944efe: opted in, only life-advisor job opted in. Scheduled occurrences with retry recovery switched on (no retry occurred in either): 10-08 09:00 (old process, msg 8957) and 10-09 09:00 (new process after reboot, msg 8984), each `outcome: delivered`, 1 execution, one message id, no status notice, no leftover retry state. These prove the opted-in success path and delivery receipts only; retries, quota exhaustion, uncertain delivery, restart recovery and the single-notice claim remain proven by tests only (no real overload has occurred). Tests rerun: `pytest tests/cron tests/run_agent/test_failure_classification_preserved.py` = 810 passed, 1 failed; real default cron store job count unchanged by the run (156 -> 156). (That run predates the isolation guard and (10-09 14:16) wrote ~2,250 test lines into the live agent.log; it was not isolated.) The 1 failure (`test_helper_guards_standalone_delivery`) is a source-text distance check: the shutdown guard is present 17 lines above the standalone-send comment, at the same offset as before the retry commit, but outside the test's 600-character window — pre-existing, not a missing guard.
- **Incident found 2026-10-09: test fixtures leaked into the real default-profile cron store.** 150 jobs (129 "morning" prompt "p" opted into retry, plus "other", "w" every 5 min "echo hi", "claim job", "paused job") were created 2026-10-06 21:04-21:08 — the time of the scratch-copy test run. The installed checkout's test conftest lacks the cron-store isolation guard this repo has had since abc39afb43, which fits the leak; the copies were deleted so this is strongly indicated, not proven. They ran real agent turns on the default model (three every 5 min, ~135 at 09:00 on 10-07 and 10-08). All were paused 2026-10-09 07:45-07:47 (no reason recorded, not by this session; Noam had approved pausing); none ran at 10-09 09:00. Backup taken after the pause: `~/.hermes/cron/jobs.json.bak-before-pausing-test-leak-20261009`. **Archived 2026-10-10 09:20 (Noam approved):** the 150 removed from the store under the jobs lock, full records kept in docs/incidents (removed-jobs.json), backup `jobs.json.bak-before-test-job-archive-20261010`, output folders and logs kept; store now 6 jobs (2 enabled, 4 paused), unchanged records, scheduler ticking normally. Open: the isolation guard (uncommitted, owned by session a64a2783) still lets a connect-by-hostname do a DNS lookup before refusing it (found in an OS-sandbox run); never run cron tests in a copy of the installed checkout. Details: docs/incidents/2026-10-06-test-jobs-live-scheduler.reconciliation.md.
- **Activation record (2026-10-07):** fresh genuine $sure receipt written after reading the goal (1-2761), HANDOFF and memory-system docs in full (old receipt kept as `.sure-receipt.json.bak-20261006-grounding`); jobs file backed up as `jobs.json.bak-before-retry-recovery-20261007`; `retry_recovery: {enabled: true}` added to job 7d1402944efe only (diff of the whole jobs file: that one key; file mode 600 kept); `hermes-gateway.service` restarted (old PID 2060 since 10-03 14:47 -> new PID 1404366 at 10-07 22:39:37, active/running, 0 restarts). Read-back: the service's own interpreter loads scheduler and retry module from this working copy; the job's policy reads enabled (2 h / 6 executions), no other job is opted in; the new process logged that the Life-Boat editor module loaded from this working copy and that the Life-Boat runtime check passed. Pre-existing warnings unchanged: unknown profile 'orchestrator' (seen since 09-23) and two secondary profiles skipped for port-binding. Rollback: remove the one job setting (or restore the backup) — no restart needed for that to take effect on the next run; full revert = revert the four commits + restart.
- **Ask (Noam, 2026-10-06):** retry transient overload with persisted exponential backoff and jitter; never retry permanent authentication or billing failures; keep the original occurrence ID; no overlapping runs or duplicate sends; retry delivery without regenerating content already produced; a failure notice never marks the morning content delivered; no per-attempt Telegram errors, at most one actionable status after the window is exhausted; window and budget configurable (proposal: two hours, six executions including internal API retries); keep the existing provider; do not deploy or replay an expired occurrence.
- **Prior work check:** none found. Searched repo, profile plugins, skills, config, scheduled jobs, shared plugins, installed package, and git history for scheduler/conversation_loop/jobs.
- **Original defect:** the structured failure was flattened to text; every failed attempt sent a failure message and then marked the occurrence delivered; no retry state existed.
- **Implementation:** agent/conversation_loop.py records a structured failure classification (no message text); cron/scheduler.py passes it through a failure sink and has recovery branches that run ONLY for jobs that opt in (all other jobs keep the old path); cron/jobs.py gained a separate receipt field; new cron/retry_recovery.py holds the policy, persisted state, overlap refusal, crash-safe provisional next run, stored content (0600 file, referenced by path + hash), uncertain-delivery marker, and single-status claim. Defaults: window 7200 s, 6 executions, 60 s base delay, 1200 s cap, +/-25 % jitter. Job opt-in required; a global setting alone never enables it.
- **Evidence:** `pytest tests/cron tests/run_agent/test_failure_classification_preserved.py` = 798 passed, 1 failed. The 1 failure (`test_scheduler_shutdown_guard::test_helper_guards_standalone_delivery`) is pre-existing and fails identically on the unmodified HEAD copy of the scheduler. New tests: 34 (policy/state), 14 (real run_one_job on a temp store: recovery, restart, concurrency, uncertain delivery, other jobs unchanged), 2 (real agent loop with fake 529/402 provider).
- **Wider check (2026-10-06):** `pytest tests/run_agent tests/agent` = 157 failed in the full run; the same failing files re-run in isolation fail identically (43 failures) on the unmodified parent commit and on the retry commit, with an empty difference between the two sets, so none are caused by this change (order-dependent/environment failures that already existed). `pytest tests/gateway -k lifeboat` = 1326 passed, 1 skipped.
- **Independent review (2026-10-06): REQUEST CHANGES — do not activate.** Reviewer reproduced one defect and reported (not yet independently re-verified by me): (1) CRITICAL a leftover retry state can lock the occurrence id so later mornings are skipped or eaten (trigger: retry fires during an active conversation, or a crash mid-attempt); (2) HIGH resend of stored content cannot succeed for the Life-Boat destination (a never-sent message is classed "unconfirmed", and the 24h duplicate fingerprint would reject a resend); (3) HIGH a gateway shutdown mid-run is treated as permanent failure, closes the occurrence and later re-fires under a new id; (4) MEDIUM stale failure classification can leak into a later unrelated failure; (5) MEDIUM grounding fix reads the age of the wrong message when he replies twice to the same old message; (6) LOW closed occurrences can reopen and stored text can be left on disk; (7) LOW jitter can exceed the stated maximum delay. Open worries: budget of 6 executions is mostly consumed by internal API retries; the external fire provider may not see provisional next-run times; the health read-back script ignores retry outcomes.
- **Review follow-up (commit 3d4627e58b, local):** I re-checked each finding against the code. Fixed with regression tests: (1) a leftover retry record now pins the occurrence id only when the fire is the scheduled retry itself, and a retry suppressed by an active conversation closes its record; (3) a gateway shutdown mid-run is recovered as a transient failure (no false "not delivered" status); (4) stale failure classification is cleared at each provider attempt (one-line change, no dedicated test); (5) a repeated reply no longer takes the age of his earlier reply; (6) delivery_permanent is terminal and superseded/orphan stored text is deleted; (7) backoff cap holds after jitter. Tests after the fixes: cron + time facts + classification 819 passed, 1 pre-existing failure; `-k lifeboat` 1327 passed, 1 skipped.
- **Second review (commit bb06ba77b5, local):** reviewer confirmed fixes 4, 6, 7 and found that the tick's schedule advance and a shutdown's run-mark overwrote the retry time, so an interrupted occurrence could be lost unseen. Fixed: while an opted-in job has an open retry the schedule is held at the retry time (both the advance and the mark), the provisional crash-safety time is at least the attempt TTL (30 min) so a long generation is not due again mid-run, and the reply-age lookup strips the wrapper instead of skipping the row. Tests: cron + time facts 63 + lifeboat gateway 1328 passed (1 pre-existing failure outside these). Known and accepted: a retry that comes due only after the gateway was down overnight still takes the place of that morning's regular run (gets one status); the external fire provider (Chronos) path is not covered (live profiles use the built-in scheduler); a shutdown that makes the run raise (rather than return) ends as a single "permanent" status; a failure without a classification after an earlier transient one counts as permanent. No third review done.
- **Installed runtime check — CORRECTED (2026-10-07):** an earlier note here said the live gateway runs from a different checkout and that retry recovery would need a merge. That was wrong. The gateway service sets its import path to THIS working copy first, and an import test with the service's own interpreter and path loaded the gateway, scheduler and command-line modules from this working copy. So the live runtime is this source tree, the clean reply route exists live, and the running process (started 2026-10-03 14:47) simply has not loaded anything committed after that. Consequences: activation is a restart of the shared gateway (Council bot affected), and a restart also loads every uncommitted edit in this working copy (other agents' unfinished work), not just mine. The scratch merge below was therefore unnecessary, though harmless and it did confirm no regressions. Job 7d1402944efe today: enabled, built-in scheduler, daily 09:00, no retry setting, next run 2026-10-07 09:00.
- **Scratch merge into a copy of the installed checkout (2026-10-06, nothing real touched):** copied the installed tree's source to a throwaway directory, applied the retry diff (conversation loop, scheduler, jobs; patch from `git diff 504669ccd2~1 HEAD` on those three files) plus the new retry module and tests. All 20 patch hunks applied (scheduler offsets only, no rejects). Retry tests there: 65 passed (modules confirmed loaded from the copy). Whole `tests/cron` there: 14 failures with the patch and the identical 14 without it, so no regression on the installed code. The merge needs no hand edits. The two throwaway copies were deleted on 2026-10-07 at Noam's request (the real environment was left intact). Real activation needs: Noam's go, a fresh $sure receipt (jobs file is protected), a check of what else is uncommitted in this working copy because a restart loads it too, adding the job setting, the shared gateway restart, and reading the loaded module back. The grounding fix rides on the same restart.
- **Go-live request (prepared 2026-10-07 22:30, awaiting Noam):** since the gateway started (2026-10-03 14:47) the only commits touching gateway, cron, agent or command-line code are my four (504669ccd2, 3d4627e58b, bb06ba77b5, ccd2998f68) and there are no uncommitted edits in those folders, so a restart loads exactly those. Steps: (1) fresh $sure receipt covering retry activation; (2) back up the profile jobs file; (3) add `"retry_recovery": {"enabled": true}` to job 7d1402944efe only; (4) restart `hermes-gateway.service` (shared with the Council bot, brief outage); (5) read back the loaded modules (path, start time) and the job; (6) first proof: the next 09:00 occurrence, read with the reply-provenance script; a forced test of the failure path would need a deliberate provider failure, which is not planned. Rollback: remove the job setting (instant, the code then ignores it), and if needed revert the four commits and restart. Risk: a brief gateway restart; the time-gap fix goes live with its effectiveness unproven.
- **Decision (Noam, 2026-10-06): accept one status and no automatic resend for Life-Boat sends** (no change to Life-Boat's duplicate guard). Finding (2) is therefore a documented limit, not a defect to fix; the retry covers provider overload before the message exists.
- **Was open, now accepted as a limit:** (2) for the Life-Boat destination a send that never left is reported as "unconfirmed" and the 24-hour duplicate fingerprint is recorded before sending, so "resend stored content without regenerating" does not work there; it is classed uncertain (safe: never duplicates, but one failed send means one status and no automatic resend). Fixing it means touching Life-Boat's duplicate guard, which preservation-first forbids without Noam's decision. Also open: a crash mid-attempt loses that day's retry (it no longer poisons later days); the 6-execution budget is mostly consumed by internal API retries; external fire provider (Chronos) may not see provisional next-run times; the health read-back script ignores retry outcomes; no second independent review of the fixes yet.
- **Known limits:** rate-limit is treated as transient (bounded by the budget); uncertain delivery is never auto-resent (may mean a missed message rather than a duplicate); a transient API error that recovered inside a run followed by a later non-API failure could be read as transient (harmless, bounded).
- **Rollback:** revert commit 504669ccd2's retry files (or restore conversation_loop.py, jobs.py, scheduler.py from its parent and delete cron/retry_recovery.py + tests); remove `retry_recovery` from the job; delete `<home>/cron/retry/`; leftover state keys on the job are inert; restart the gateway through its supervisor.
- **Activation (needs Noam's go and a fresh $sure receipt, since jobs.json is protected and the gateway is shared with Council):** back up the profile jobs file; add `"retry_recovery": {"enabled": true}` to job 7d1402944efe only; restart the gateway through systemd --user; verify the process loaded the new module (path, hash, start time) and read the job back; first real proof is the next 09:00 occurrence.
- **Do not:** deploy, restart, or replay an expired occurrence without Noam's approval.
