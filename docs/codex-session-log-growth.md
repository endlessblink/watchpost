# Why Codex session logs balloon (measured 2026-11-06)

Largest session measured: `~/.codex/sessions/2026/11/04/rollout-...0a6553f90016.jsonl`, 212 MB, 48 compactions, 134 sessions that day.

| Record | Share | What it is |
|---|---|---|
| `compacted` | 51% (108 MB, 48 records, ~2.2 MB each) | Codex writes the whole retained history again at every compaction, including every inline screenshot (25-30 images, ~2.3 MB) still in it. |
| `world_state` (full) | 16% (33 MB, 49 records of ~680 KB) | Each full snapshot embeds `permissions.approved_command_prefixes`: 666 KB of the 718 KB record. Source: `~/.codex/rules/default.rules`, 2,076 "always allow" rules, 703 KB. 529 of them are single long one-off commands (>400 chars) = 458 KB (65% of the file). |
| `item_completed` events | 9% | normal event log |
| tool outputs, reasoning, messages | rest | normal |

Writer: Codex's own rollout recorder (0.163/0.164). Neither a plugin nor TermFleet writes these records.
No Codex setting was found that turns the image copy or the rules copy off.

## What can be fixed at the source
1. Rules: trim `default.rules` to general prefixes. Dropping the 529 one-off long rules shrinks each snapshot from ~700 KB to ~245 KB, about 22 MB (10%) per large session. It changes what Codex auto-approves, so it needs Noam's OK; nothing was changed.
2. Compaction copies: fewer images in the history (screenshots as files, not pasted inline) and fewer compactions (the 200k limit already cuts these). Each compaction costs about 2.2 MB while images stay in context.
