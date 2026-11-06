# Content and Bina backlog audit — 2026-11-06

State: `in_progress` for overall delivery; the assigned source audit is complete. Five local source plans were corrected after backups and applicable domain routing. No runtime, paid service, secret, publication or customer data was mutated. The parent owns board synchronization, dispositions and live verification.

## Coverage and limits

`content-audit.json` accounts for **1,459 records across 12 canonical projects**, including 24 recovered records (17 nested Bina-ve-ze tasks, three suffixed Arthouse tasks, and four distinct completed records recovered from reused Bina IDs). Every record has its exact source row/section; 485 referenced source/test/doc paths were checked for existence. Git task-reference history is recorded where available. A commit message or a file's existence is supporting evidence, not runtime acceptance.

| Project | Records |
|---|---:|
| bina-meatzevet-courses | 697 |
| arthouse | 155 |
| rough-cut-mvp | 275 |
| inner-dialouge | 118 |
| bina-ve-ze | 93 |
| fine-cut | 48 |
| Archive/Claude-of-war | 34 |
| bina-meatezvet-bot | 13 |
| bina-bekitzur | 10 |
| content-maker | 10 |
| rtl-tools | 4 |
| 04_סוכנים | 2 |

Classifications after corrections: 1000 declared_done_unverified, 395 unfinished, 46 needs_verification, 3 stale_in_progress, 14 duplicate, 1 superseded. None is labelled freshly verified done solely from an old plan. Ages, `updated_at` cache timestamps and an `Archive/` parent folder did not establish obsolescence.

Canonical Bina skill sync succeeded. The canonical manifest is release 0.2.5. Its marketing, generation and Notion skills do not apply to a read-only task audit, so no irrelevant skill was invoked. The vault's Bina project context, Rough Cut stability-first project note and Arthouse watcher authority were inspected. No project was promoted or ranked.

## Concrete source corrections

### Bina courses

- **Ten old summary statuses contradict explicit DONE detail headers:** TASK-1952, 1953, 1954, 1955, 1957, 1958, 1959, 1960, 1961 and 1964. Details occur at lines 210–331. The lifecycle DONE headers were introduced by commit `231704d2` on 2026-08-08, after the earlier August 5 partial checkpoint. Reconcile the summaries, preserve detailed evidence, and archive as completed declarations. This does not close the remaining controlled rollout, operator configuration or communication-workspace tasks.
- **TASK-1876 is explicitly Paused**, line 973, despite its IN PROGRESS heading and summary. Keep its preflight and five-page acceptance checklist; display PAUSED.
- **TASK-1939 is operator-blocked**, lines 489–500: code and production migrations are declared complete, but token configuration and one real generation request remain gates. Display PAUSED with those gates. Do not configure secrets or spend generation credits for board cleanup.
- **TASK-1928 has three different meanings**, not one large feature: completed lecturers/guest speakers (detail 478–487, summary 2269), completed privileged admin/Cloudflare Stream route tests (summary 2140), and a stray IN PROGRESS draft task (2303) which duplicates canonical TASK-1939. Keep lecturers TASK-1928, assign a new unused ID to the route-test record, move subject-specific dependencies TASK-1931/TASK-1936 to that new ID, and turn the stray draft row into an alias to 1939. Do not simply overwrite the last title.
- **TASK-1925, TASK-1927 and TASK-1834 also collide between distinct subjects.** Exact rows are retained in `projects[].tableCollisions`. Split the subjects before trusting last-row-wins task parsing. TASK-426/427 repeat the same completed redirect subject in two stages and can share one canonical card; they are not evidence of separate unimplemented work.
- TASK-1803–1809 contain real saved WIP and public smoke/typecheck evidence, but the admin-preview routing matrix was skipped (detail 1608–1650). These are related implementation/verification tasks, not seven freshly completed tasks. Keep the membership resolver, hub/routing/profile implementation and final matrix verification distinct, with dependencies preserved.
- FEATURE-012, TASK-349, TASK-362 and TASK-366 explicitly retain partial taxonomy, mailing sync or entitlement/purchase activation scope. They must remain open.
- TASK-1874's financial/provider reconciliation remains unresolved; newer September evidence still says 24-versus-25 provider-ledger discrepancy. Do not mark done from the working checkout alone.
- TASK-1896/1914/1956/1966 overlap at the email platform boundary, but their remaining CRM, newsletter/club adapter and production communication/approval gates differ. Link them to the shared foundation and the current communication workspace; do not erase remaining work by calling them duplicates.

### Arthouse

The source explicitly marks **14 TASK cards as compatibility mirrors** of canonical ARTH cards (lines 2203–2257): TASK-002, 020, 021, 025, 029, 032, 034, 070, 080, 107, 108, 121, 125 and 126. Consolidate each with the matching ARTH ID while preserving the alias/history. TASK-002 contributes a duplicate dogfood IN PROGRESS claim; its canonical ARTH-002 is still open.

ARTH-070a (public i18n foundation, DONE), ARTH-070b (private translation, TODO), and ARTH-070c (ingest translation, DONE) are distinct suffixed IDs at source lines 286–288. Preserve all three; do not collapse them into parent ARTH-070. ARTH-118 source-validation acceptance remains open, and the active lane ARTH-130–141 contains real unmet catalogue/profile/extension gates. The VPS-only catalogue/publish boundary remains in effect.

### Bina-ve-ze

- The five-column `ID | Type | Priority | Status | Title` tables were producing titles such as “TASK” and “FEATURE”; preserve the descriptive final-column titles.
- **T-001 must remain blocked/paused.** The source-side Contentful token is removed, but detail 504–508 explicitly requires owner-side revocation. Git blame proves the June 1 blocked detail is newer than the April 3 DONE table. No token or history contents were read.
- **T-030/T-031 have conflicting DONE table and TODO detail from the same commit `c7b6c135`.** This is not a proved temporal reopening. Current PersonalSite code contains the parallax implementation at 685–694; recommend REVIEW until the exact visual/reduced-motion criteria are reconciled, rather than pretending it is untouched work or freshly accepted.
- T-098 is REVIEW and explicitly **not deployed**; owner content gates remain. T-074's sequential lighting acceptance requires a real GPU, and T-079 retains explicit debug/test/skill cleanup. A headless rendering pass cannot close them.
- The 17 recovered nested task sections are included in the ledger, including seven remaining/open records and ten completed declarations. They cannot disappear merely because the original parser ignored `####` headings.

### Rough Cut

- TASK-247 says **SLICE 1 DONE**, not the entire cleanup lane. Keep IN PROGRESS; preserve the completed geometry seam as evidence.
- TASK-274 is REVIEW: tested candidate awaiting owner visual confirmation, integration, repackaging and exact-artifact proof.
- TASK-275 is PAUSED behind the trusted key, signed metadata, approved release and real download/rollback gates. Publishing remains unauthorized.
- TASK-273 is unresolved decoder/portrait acceptance. Passing reruns do not prove a cause or close the risk.
- TASK-264 is a parent release-readiness effort whose named remaining work is TASK-269. Link the parent to that remaining checklist; do not treat both as independent simultaneous runs or erase their acceptance gates.
- TASK-026 (Wayland capture), TASK-231 (Trim mode), TASK-269–272 retain specific partial implementation/acceptance evidence and must remain open. “Supersedes-on-completion” in TASK-026 is conditional; it does not obsolete the older cursor tasks today.

### Bina moderation bot

- **TASK-011 is rejected/obsolete**, not planned work: July 17 source evaluation and commit `b1a540d` reject the LLM stage (2 ambiguous records out of 614; 17% false positives). Archive as REJECTED with the revisit condition; never label implemented.
- **TASK-012 is partially implemented and paused.** The October 10 source retains external watchdog, real session probe and dead-man switch gates; the in-bot alert alone does not close them. The original parser lost its decorated IN PROGRESS status.
- Source lifecycle manifest commit `03828b6` says PAUSED pending pairing/configuration. The older October 4 bot registry says VPS WORKING, which is stale/conflicting evidence. Current read-only public VPS `/health` returned `ok:false`, `whatsapp.status:SCAN_QR_CODE`. This is not authenticated visual or identity proof. No pairing, restart, message or registry mutation was attempted.
- TASK-005 has partial configuration/safety evidence; TASK-006 retains welcome automation acceptance. Neither is complete just because old test-group moderation worked.

### Content Maker and other projects

- Content Maker TASK-006 is partial character prompt work awaiting paid/manual reference generation and Soul ID training. Keep the operator gate; do not spend. Root `characters/tom.md`/`jane.md` and old `videos/product-videos` path are currently absent, so locate the moved material before proceeding.
- Content Maker TASK-004's May reorg merge instruction predates the current September Finetuned/ImagineBox branch. Compare ancestry and unique commits before calling it done or obsolete; do not merge the old branch automatically. The parent must keep the separately managed Finetuned project identity intact.
- RTL-003 is source-declared DONE; its referenced shell scripts exist. No RTL-named desktop launcher was found in the current applications directory, so installed launcher acceptance is unverified. Correct the parser's false TODO without claiming a fresh installation.
- Archive/Claude-of-war's later synthetic TODO block contradicts earlier checked implementation lists and existing scenes/entities. TASK-001/003/005/007/008/013 are flagged REVIEW with both source sections. Remaining movement/physics/camera/level/enemy tasks retain unchecked subcriteria; file existence alone does not close them. Keeping the archived project does not authorize deletion or imply its unfinished features were cancelled.
- Fine Cut's 37 completed declarations are already archived; 11 explicit unfinished tasks retain unchecked scope. Inner Dialogue's 106 done declarations and 12 planned tasks have no explicit evidence of project cancellation. Bina-bekitzur's ten share-readiness tasks and the management vault Windows installation task also retain explicit acceptance work. No age-only archive recommendation was made.

## Parent application checks

1. Reconcile parser recovery and source status collisions before bulk archiving.
2. Apply the exact safe DONE/PAUSED corrections and explicit duplicate/rejected dispositions, retaining original source and audit provenance.
3. Validate that duplicate aliases no longer inflate active counts, suffixed/nested tasks remain visible, and unresolved acceptance gates stay visible.
4. Read back each applied task and compare project counts, live board and Archive view. Keep current-runtime acceptance explicitly unverified where this audit records only source completion declarations.

## Source updates applied and read back

Backups for all five plans are in `/tmp/watchpost-content-source-backups-20261106`; before/after SHA-256, domain gate receipt and isolated parser readback are stored in `content-audit.json.sourceUpdates`. The source parse now retains 697 courses records, 155 Arthouse records, 275 Rough Cut records, 93 Bina-ve-ze records and 10 Content Maker records. The focused statuses/new identities all matched the intended corrections. All five changed-plan whitespace/diff checks passed.

Bina courses routing was rechecked immediately before writing: `route_allowed`, destination `courses`, registry SHA `3fe7f22c08f1262f12cab6f801c6bce1bc417ffa0408497783b0fd59fff8b97f`, route SHA `18f2d49e14df5d20f8428da13ec2bb9f738b57a6df4268ba93890a202f91951d`. The canonical management instructions and product context were read. Unfinished club-growth TASK-1803–1809 were paused based on the explicit September club retirement; financial, cancellation and legacy access protections were retained.

The reused completed subjects now have unique IDs TASK-1974 (cron wiring/drift), TASK-1975 (non-Cardcom handlers), TASK-1976 (privileged admin/Stream route tests) and TASK-1977 (normal sign-in redirect). RLS remains TASK-1834; lecturers remain TASK-1928; route-test follow-ups TASK-1931/1936 now point to1976. The stray draft row is retained as alias history to1939.

Bina-ve-ze's own source plan establishes a personal AI atelier/portfolio project. It is neither the Bina Meatzevet business domain nor a Lead OS record; an attempted Bina route check correctly denied that unrelated destination and was not used as authority. Local personal-site plan corrections proceeded under the user's board-cleanup scope, without expanding the domain registry. The business Bina moderation bot is genuinely outside the registered Bina destinations, so its source plan remained unchanged after denial. Parent may apply board dispositions while preserving that explicit source gate.

Parent still needs to sync source changes, archive the completed/rejected records, suppress duplicate aliases without changing unfinished canonical status, and verify the actual live board/counts/Archive. No product acceptance is upgraded by these planning corrections.

## Fresh parser reconciliation

35 Arthouse records now retain their explicit summary-table DONE declaration after the title-column/status inheritance parser fix; classified source-declared done with current runtime acceptance unverified. Six archived game-project conflicts retain explicit TODO/planned while requiring checklist reconciliation. Moderation bot TASK-011 uses rejected disposition, preserving source status. No source writes in this reconciliation.
