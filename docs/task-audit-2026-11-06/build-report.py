#!/usr/bin/env python3
"""Regenerate an offline task report from current audit ledgers."""
import csv
import json
from pathlib import Path

root = Path(__file__).resolve().parent
rows = []
sources = []
raw_count = 0
receipt_path = root / 'apply-receipt.json'
receipt = json.loads(receipt_path.read_text()) if receipt_path.exists() else {}
applied = {(p['project'], t['id']): t for p in receipt.get('projects', []) for t in p.get('results', [])}
applied_times = {(p['project'], t['id']): p.get('followupAt', receipt.get('at')) for p in receipt.get('projects', []) for t in p.get('results', [])}
for path in sorted(root.glob('*-audit.json')):
    ledger = json.loads(path.read_text())
    tasks = ledger.get('rows', ledger.get('tasks', []))
    tasks = [task for task in tasks if task.get('id')]
    if not tasks:
        continue
    sources.append(f'{path.name}: {len(tasks)}')
    for task in tasks:
        row = dict(task, ledger=path.name)
        evidence = row.get('evidence', [])
        if isinstance(evidence, (dict, str)):
            evidence = [evidence]
        row['evidenceText'] = '\n\n'.join(e if isinstance(e, str) else json.dumps(e, ensure_ascii=False) for e in evidence)
        canonical = row.get('canonicalTask')
        if isinstance(canonical, dict):
            row['canonicalTask'] = ':'.join(str(canonical.get(k, '')) for k in ['project', 'id'])
        result = applied.get((row.get('project'), row.get('id')))
        if result:
            row['boardReceiptStatus'] = result.get('status')
            row['boardReceiptDisposition'] = result.get('disposition')
            row['boardReceiptAt'] = applied_times[(row.get('project'), row.get('id'))]
            row['dependencyIssues'] = result.get('dependencyIssues', [])
            row['boardAuditNote'] = result.get('auditNote')
        rows.append(row)
raw_count = len(rows)
deduped = {}
def priority(row):
    project = row.get('project')
    preferred = 'bots-audit.json' if project in {'cc-linux-enhancments', 'lifeboat-live'} else 'content-audit.json' if project == 'rtl-tools' else None
    return 2 if row['ledger'] == preferred else 0 if row['ledger'] == 'worktree-task-audit.json' else 1
for row in rows:
    key = row.get('project'), row['id']
    old = deduped.get(key)
    if old is None or priority(row) > priority(old):
        deduped[key] = row
rows = list(deduped.values())
fields = ['ledger', 'project', 'id', 'title', 'currentStatus', 'sourceStatus', 'appliedStatus', 'classification', 'recommendedStatus', 'canonicalTask', 'rationale', 'nextAction', 'executionVerification', 'applicationGate', 'boardReceiptStatus', 'boardReceiptDisposition', 'boardReceiptAt', 'dependencyIssues', 'boardAuditNote', 'evidenceText']
with (root / 'task-audit.csv').open('w', newline='') as output:
    writer = csv.DictWriter(output, fieldnames=fields, lineterminator='\n')
    writer.writeheader()
    for row in rows:
        values = {k: json.dumps(v, ensure_ascii=False) if isinstance(v, (dict, list)) else v for k in fields if (v := row.get(k)) is not None}
        values = {k: '\n'.join(line.rstrip() for line in v.split('\n')) if isinstance(v, str) else v for k, v in values.items()}
        writer.writerow({k: "'" + v if isinstance(v, str) and v.startswith(('=', '+', '-', '@')) else v for k, v in values.items()})
payload = json.dumps(rows, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
page = '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Watchpost task audit</title>
<style>
:root{font-family:system-ui,sans-serif;color:#e5eaf3;background:#10151f;color-scheme:dark}body{max-width:1400px;margin:auto;padding:28px}h1{font-size:28px}p{line-height:1.5;color:#bdcce1}a{color:#8fc7ff}.controls{display:flex;gap:10px;flex-wrap:wrap;position:sticky;top:0;background:#10151f;padding:14px 0;z-index:1}input,select,button{font:inherit;padding:10px;border:1px solid #46546a;border-radius:6px;background:#1b2433;color:white}input{flex:1;min-width:240px}.card{border:1px solid #344258;border-radius:8px;padding:16px;margin:12px 0;background:#171f2c}.meta{display:flex;gap:8px;flex-wrap:wrap;font-size:13px}.tag{background:#26354b;padding:4px 7px;border-radius:4px}h2{font-size:18px}summary{cursor:pointer;color:#a7d2ff}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.6 ui-monospace,monospace;background:#0d131d;padding:12px}.pagination{display:flex;gap:14px;margin:20px 0}.notice{border-left:3px solid #d7ac5d;padding:12px;background:#27251e}button:disabled{opacity:.4}
</style><h1>Watchpost task audit</h1><p>6 November 2026 audit snapshot · Claude &amp; Conquer corrected 7 November: 7 active (3 planned, 1 in progress, 3 review), 140 archived. Other projects retain their original audit cutoff.</p><p class="notice">Historical completion declarations are distinct from current runtime verification. Recommendations are distinct from applied changes. Board receipt badges show recorded application results, not owner acceptance. Fifty agent-ops owner claims cannot be validated as active: this is an execution-evidence gap, not a claim that the underlying product work is blocked. Task-plan excerpts are included; raw private conversations are excluded.</p><p id="coverage">COVERAGE</p><p><a href="task-audit.csv" download>Download all unique task rows as CSV</a></p><div class="controls"><input id="search" aria-label="Search tasks" placeholder="Search title, ID, evidence, or next action"><select id="project" aria-label="Project"></select><select id="classification" aria-label="Classification"></select><select id="status" aria-label="Current status"></select><select id="target" aria-label="Recommended status"></select><button id="reset">Reset</button></div><p id="count" aria-live="polite"></p><div id="results"></div><div class="pagination"><button id="previous">Previous</button><span id="page"></span><button id="next">Next</button></div><script id="data" type="application/json">PAYLOAD</script><script>
const rows=JSON.parse(document.getElementById('data').textContent);let page=0;const size=75;
const filters=[['project','project','All projects'],['classification','classification','All classifications'],['status','currentStatus','All current statuses'],['target','recommendedStatus','All recommendations']];
for(const [id,key,label] of filters){const e=document.getElementById(id);e.add(new Option(label,''));for(const v of [...new Set(rows.map(r=>r[key]).filter(Boolean))].sort())e.add(new Option(v,v));e.onchange=()=>{page=0;render()}}
const search=document.getElementById('search');search.oninput=()=>{page=0;render()};document.getElementById('reset').onclick=()=>{search.value='';for(const [id] of filters)document.getElementById(id).value='';page=0;render()};document.getElementById('previous').onclick=()=>{page--;render()};document.getElementById('next').onclick=()=>{page++;render()};
function node(tag,text,cls){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n}
function render(){const q=search.value.toLocaleLowerCase();const selected=rows.filter(r=>filters.every(([id,key])=>!document.getElementById(id).value||r[key]===document.getElementById(id).value)&&(!q||[r.project,r.id,r.title,r.rationale,r.nextAction,r.evidenceText].join(' ').toLocaleLowerCase().includes(q)));const pages=Math.max(1,Math.ceil(selected.length/size));page=Math.min(page,pages-1);const out=document.getElementById('results');out.replaceChildren();for(const r of selected.slice(page*size,(page+1)*size)){const c=node('article','','card'),m=node('div','','meta');for(const t of [r.project,r.id,r.classification,`Current: ${r.currentStatus||'unknown'}`,`Recommend: ${r.recommendedStatus||'unknown'}`,r.appliedStatus?`Applied source: ${r.appliedStatus}`:'Recommendation pending'])m.append(node('span',t,'tag'));c.append(m,node('h2',r.title||r.id));for(const [label,key] of [['Reason','rationale'],['Next action','nextAction'],['Canonical task','canonicalTask']])if(r[key])c.append(node('p',label+': '+r[key]));const d=node('details','');d.append(node('summary','Show exact evidence'),node('pre',r.evidenceText||'No task-specific evidence recorded.'));c.append(d,node('small',r.ledger));out.append(c)}document.getElementById('count').textContent=`${selected.length.toLocaleString()} matching tasks of ${rows.length.toLocaleString()} · ${new Set(rows.map(r=>r.project)).size} projects`;document.getElementById('page').textContent=`Page ${page+1} of ${pages}`;document.getElementById('previous').disabled=page===0;document.getElementById('next').disabled=page+1===pages}render();
</script></html>'''.replace('PAYLOAD', payload).replace('COVERAGE', f'{len(rows):,} unique task records from {raw_count:,} ledger rows; {raw_count-len(rows)} repeated project/ID records deduplicated. Original JSON ledgers preserve all raw evidence. Coverage verified by exact project/ID accounting; current worker activity remains separately unverified.')
page = page.replace("r.appliedStatus?`Applied source: ${r.appliedStatus}`:'Recommendation pending'", "r.boardReceiptStatus?`Board receipt: ${r.boardReceiptStatus} / ${r.boardReceiptDisposition||'retained'}`:r.appliedStatus?`Applied source: ${r.appliedStatus}`:'Recommendation pending'")
page = page.replace("['Canonical task','canonicalTask']", "['Canonical task','canonicalTask'],['Execution verification','executionVerification']")
page = page.replace("const d=node('details','');", "if(r.applicationGate)c.append(node('p','Authority / execution gate: '+JSON.stringify(r.applicationGate)));const d=node('details','');")
page = page.replace("const d=node('details','');", "if(r.dependencyIssues?.length)c.append(node('p','Dependencies to reconcile: '+r.dependencyIssues.join('; ')));const d=node('details','');")
(root / 'task-audit.html').write_text(page)
print(json.dumps({'rawRows': raw_count, 'uniqueRows': len(rows), 'deduplicated': raw_count-len(rows), 'projects': len({r['project'] for r in rows}), 'sources': sources}, indent=2))
