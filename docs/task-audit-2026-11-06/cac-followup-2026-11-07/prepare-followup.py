import json,re,hashlib,shutil,datetime,collections
from pathlib import Path
from urllib.request import urlopen

root=Path('/media/endlessblink/data/my-projects/ai-development/bots+automation/claude-and-conquer')
audit=Path('/media/endlessblink/data/my-projects/ai-development/devops/watchpost/docs/task-audit-2026-11-06')
dest=audit/'cac-followup-2026-11-07'
dest.mkdir(exist_ok=True)
plan=root/'MASTER_PLAN.md'
old=plan.read_text()
backup=dest/'MASTER_PLAN.before.md'
if backup.exists(): raise RuntimeError('Already prepared; inspect receipt before repeating')
backup.write_text(old)
live=json.load(urlopen('http://127.0.0.1:6010/api/tasks/list?includeArchived=1&project=claude-and-conquer'))['tasks']
(dest/'before.json').write_text(json.dumps(live,ensure_ascii=False,indent=2))
active={t['id']:t for t in live if not t['archived_at']}
assert len(active)==43
groups={
 'FEATURE-021':['TASK-114','TASK-115','TASK-116','TASK-118','TASK-121','TASK-122'],
 'TASK-083':['TASK-084']+[f'TASK-{n:03}' for n in range(91,99)],
 'TASK-100':['FEATURE-018','TASK-099','TASK-101','TASK-102','TASK-103','BUG-046','TASK-104','TASK-105','TASK-106','TASK-107','TASK-108','TASK-109','TASK-110','TASK-112','TASK-113'],
 'TASK-111':['TASK-088','TASK-089'],
}
superseded=['INQUIRY-042','TASK-085','TASK-086','TASK-087','TASK-090']
survivors={
 'FEATURE-021':('Health web app: verify remaining real-use acceptance','REVIEW'),
 'TASK-082':('Browser recovery: verify the remaining connection gate','REVIEW'),
 'TASK-083':('Exercise animations: remaining library and review work','REVIEW'),
 'TASK-100':('Health data, nutrition and privacy follow-ups','PLANNED'),
 'TASK-111':('Private health-data backup and repository housekeeping','PLANNED'),
 'TASK-119':('Redraw six exercise animations with captions or cut edges','PLANNED'),
}
assert set(active)==set(survivors)|set(superseded)|{x for v in groups.values() for x in v}
notes={
 'FEATURE-021':'One acceptance card for the delivered Health App, not six parallel implementation tasks. Preserve original per-step evidence limits: local-only library/login/Today evidence is not fresh live proof; coach first-message, actual profile save/injury/gear constraints, real product-photo add/paste, media continuity and physical-phone acceptance remain unverified. Later Oct31 release evidence shows an active web service and installed product/profile code, not owner sign-off. No Hermes restart or model call is authorized by this consolidation.',
 'TASK-082':'Retain the original browser-extension reconnection, version identity and authenticated receipt requirement. This is a verification gate, not evidence of a running browser repair. The animation initiative is separately tracked in TASK-083; browser automation must still respect screen-isolation and explicit approval rules.',
 'TASK-083':'One animation initiative replaces ten overlapping pipeline and production cards. Current guided_grid workflow supersedes the older star-of-edits implementation recipe, but all unresolved outcomes remain required. Preserve complete library coverage, redraw/review/rejection feedback, reference/manifest identity, locked cast/style/canvas inputs, deterministic assembly/export, numeric and independent visual/motion/safety QA, human review/promotion, cache/cost accounting and generator parity. Oct23 adc7461 records new candidate loops and owner rejection; Oct24 f0e0216 adds real quota enforcement, so the old zero-output narrative is not current. Preserve Oct16 failed-animation redraw-until-end-to-end requirement; Oct23 three bar-free pulls/redos/review queue; hard 6% daily/40% weekly limits and no-reading=no-spend. The Arm source-feasibility exception is a separate held branch in the canonical project note. Whole-library completion, current batch activity and owner acceptance remain unverified; REVIEW describes accumulated candidates and acceptance work, not a finished library.',
 'TASK-100':'Consolidated future health roadmap. None of the merged tasks is declared implemented: retain their original detailed requirements and acceptance checks below. Current web app has profile, injury guards and products, but full schema migration, dated targets/TDEE/floors, cross-topic context/privacy, structured-photo evaluation, imported Hebrew foods and plan semantics still need requirement-by-requirement gap verification. This card has no dependency on its own consolidated historical children. Private backup is independently tracked in TASK-111; preserve original substep ordering in this checklist. Naming is an approval-gated decision, not authorization to rename.',
 'TASK-111':'One private-data preservation and repository-housekeeping task combines the backup/restore requirement with root/HANDOFF cleanup. Keep health notes, existing animation artifacts, dirty work and uploads intact. First inventory and establish a private recoverable backup; rehearse restoration before any cleanup. No deletion, moving owner data, bot restart or publishing is authorized by the board audit.',
 'TASK-119':'The six specifically named redraws remain an unfinished deliverable. Their original names and visual requirements remain in the historical source table. Broad Health App deployment and animation candidate commits do not prove these six were redrawn and accepted.'
}
# Change only retained summary rows and retained dedicated headings. Original child
# details and statuses remain intact, and archive records preserve those stages.
new=[]
for line in old.splitlines():
 m=re.match(r'^\|\s*(?:\*\*|~~)*([A-Z]+-\d+)(?:\*\*|~~)*\s*\|',line)
 if m and m.group(1) in survivors:
  id=m.group(1); cells=line.split('|'); title,status=survivors[id]
  # The retained rows use either ID/title/priority/status/deps or add effort.
  cells[2]=' '+title+' '
  status_index=5 if id in ['TASK-100','TASK-111'] else 4
  cells[status_index]=' '+status+' '
  cells[-2]=' - '
  line='|'.join(cells)
 if re.match(r'^### TASK-082–084:',line):
  line='### TASK-082: Browser recovery verification (REVIEW)'
 elif re.match(r'^#{2,6}\s+(TASK-100|TASK-111):',line):
  id=re.search(r'(TASK-\d+):',line).group(1)
  line=f'### {id}: {survivors[id][0]} (PLANNED)'
 new.append(line)
text='\n'.join(new)+'\n'
# Canonical consolidated acceptance checklists: add dedicated source sections to
# retained cards without copying private data or altering historical requirements.
text+='\n## Board consolidation — 2026-11-07\n\nThis replaces the broad keep-open recommendations from the 6 November audit. The six active cards below carry the unresolved work. Historical child records remain in Archive with their original stages; consolidation is not completion. The legacy Node Telegram poller remains retired and stopped.\n'
for id,(title,status) in survivors.items():
 text+=f'\n### {id}: {title} ({status})\n\n{notes[id]}\n\n'
 for child in groups.get(id,[]):
  # Retain the original full detail where present, otherwise the exact summary.
  match=re.search(r'^#{2,6}\s+'+re.escape(child)+r':[^\n]*\n(.*?)(?=^#{2,6}\s|\Z)',old,re.M|re.S)
  detail=match.group(1).strip() if match else active[child]['title']
  # Blockquote prevents embedded status/table fields from changing the parent parse.
  text+=f'- [ ] {child} — original requirement retained for reconciliation:\n\n'
  text+='\n'.join('> '+s for s in detail.splitlines())+'\n\n'
 text+='**Depends on:** -\n'
plan.write_text(text)
ledgerfile=audit/'bots-audit.json'
ledger=json.loads(ledgerfile.read_text())
shutil.copy2(ledgerfile,dest/'bots-audit.before.json')
mapping={child:parent for parent,children in groups.items() for child in children}
for row in ledger['tasks']:
 if row['project']!='claude-and-conquer' or row['id'] not in active: continue
 id=row['id'];row['auditDate']='2026-11-07'
 row['evidence']+=['MASTER_PLAN.md: Board consolidation — 2026-11-07; original requirements and evidence preserved in canonical task checklist.',str(backup)]
 if id in survivors:
  title,status=survivors[id];row.update(title=title,currentStatus=status.lower(),recommendedStatus=status.lower(),parserStatus=status.lower(),archiveEligible=False,canonicalTask=None,rationale=notes[id],nextAction='Review the consolidated acceptance checklist in this task before resuming work; do not infer completion or current execution.')
  row['classification']='needs_verification' if status=='REVIEW' else 'unfinished'
 elif id in mapping:
  parent=mapping[id];row.update(classification='duplicate',archiveEligible=True,canonicalTask={'project':'claude-and-conquer','id':parent},rationale=f'Consolidated into {parent}; this is an overlapping child or milestone of the same workstream. Its full unfinished acceptance requirements and original evidence remain in the canonical source checklist; no implementation or owner acceptance is claimed.',nextAction=f'Continue the {id} requirements through {parent}; do not create a second parallel backlog card.')
 else:
  parent='FEATURE-021' if id=='INQUIRY-042' else None
  reason='The later explicit Health PWA decision and deployed FEATURE-021 supersede the old platform-choice inquiry; current Health App acceptance is still open.' if parent else 'This maintenance proposal targets the retired Node Telegram poller, not the active Health App or Hermes gateway. The poller is intentionally exited; no new legacy refactor is in the active delivery scope.'
  row.update(classification='superseded',archiveEligible=True,canonicalTask={'project':'claude-and-conquer','id':parent} if parent else None,rationale=reason,nextAction='Use the active Health App/Hermes authority; do not restart or refactor the retired poller as part of backlog cleanup.')
ledger['classificationCounts']=dict(collections.Counter(r['classification'] for r in ledger['tasks']))
ledgerfile.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
receipt={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'before':{'active':43,'planned':25,'in_progress':10,'review':8},'expectedActive':{id:status.lower() for id,(_,status) in survivors.items()},'groups':groups,'superseded':superseded,'sourceBackup':str(backup),'beforeSha256':hashlib.sha256(old.encode()).hexdigest(),'afterSha256':hashlib.sha256(text.encode()).hexdigest(),'scopeNotes':notes,'runtimeReadback':{'legacy':'exited','hermes':'running','healthApp':'active','sourceIdentity':'health-app-web;claude-and-conquer-legacy','modelCalls':0,'runtimeMutations':0}}
(dest/'source-receipt.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'survivors':len(survivors),'consolidated':len(mapping),'superseded':len(superseded),'sourceReceipt':str(dest/'source-receipt.json')},indent=2))
