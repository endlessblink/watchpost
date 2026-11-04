'use strict';

(function () {
    const params = new URLSearchParams(location.search);
    const project = params.get('project') || 'imaginebox';
    const category = params.get('category') || '';
    document.getElementById('title').textContent = project === 'imaginebox' ? 'ImagineBox project plan' : project === 'finetuned' ? 'Finetuned project plan' : project + ' project plan';
    for (const link of document.querySelectorAll('[data-category]')) {
        const query = new URLSearchParams({ project });
        if (link.dataset.category) query.set('category', link.dataset.category);
        link.href = '?' + query;
        if (link.dataset.category === category) link.setAttribute('aria-current', 'page');
    }
    for (const link of document.querySelectorAll('[data-project]')) {
        if (!category && link.dataset.project === project) link.setAttribute('aria-current', 'page');
    }

    async function refresh() {
        const notice = document.getElementById('notice');
        notice.textContent = 'Loading saved plan…';
        try {
            const response = await fetch('/api/project-plan?' + new URLSearchParams({ project }), { cache: 'no-store' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Plan request failed');
            const rows = parseRows(data.content);
            const effectiveCategory = category === 'all' ? '' : category || data.category || '';
            const selected = rows.filter(row => !effectiveCategory || row[5] === effectiveCategory);
            const body = document.getElementById('tasks');
            body.replaceChildren();
            for (const row of selected) {
                const tr = document.createElement('tr');
                for (const value of row) {
                    const td = document.createElement('td');
                    td.textContent = value;
                    tr.appendChild(td);
                }
                body.appendChild(tr);
            }
            document.getElementById('plan').textContent = data.content;
            document.getElementById('updated').textContent = 'Read at ' + new Date().toLocaleString() + ' · Saved plan SHA-256: ' + data.sha256;
            notice.textContent = selected.length + ' tasks' + (effectiveCategory ? ' in ' + effectiveCategory : '') + '. READY means verification recorded; DONE also requires owner acceptance.';
        } catch (error) {
            notice.textContent = 'Could not load this project: ' + error.message;
            document.getElementById('tasks').replaceChildren();
        }
    }

    // Match only canonical roadmap rows. Detail headings and acceptance tables
    // are preserved in the full document without being mistaken for new tasks.
    function parseRows(content) {
        return content.split('\n').filter(line => /^\| [A-Z]+-\d+ \|/.test(line)).map(line => line.split('|').slice(1, -1).map(cell => cell.trim()))
            .filter(row => row.length === 6 && /^P[123]$/.test(row[2]) && ['PLANNED', 'IN PROGRESS', 'READY', 'DONE'].includes(row[3]) && ['finetuned', 'imagine-box'].includes(row[5]));
    }

    document.getElementById('refresh').addEventListener('click', refresh);
    refresh();
}());
