# Full task audit implementation plan

Inventory every registered scope, including absent plans and worktree copies.
Review every canonical task against its source, history and available runtime.
Missing evidence remains explicit; a task's age alone never means completed.

Parser candidate: preserve explicit dated statuses, inline fields, nested task
headings and DONE suffixes. First reproduce the inspected failures in tests;
retain pending acceptance as REVIEW and ignore fenced example tasks.

Archive candidate: retain original statuses for obsolete or duplicate work.
Archival must never silently satisfy an unfinished prerequisite. Consolidation
requires a named successor; managed trackers keep their supported write gates.

Back up changed plans and databases, preserve unrelated edits, read back every
change and verify the live board, counts and Archive view headlessly.
