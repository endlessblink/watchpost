import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createCodexIndex } = require('../../modules/codex-index.js');

let dir, file, reads;
const ts = n => new Date(Date.now() - n * 1000).toISOString();
const line = o => JSON.stringify(o) + '\n';

function make(extra = {}) {
    return createCodexIndex({
        listFiles: () => [file],
        rowToEntries: (row, ctx) => {
            if (row.type === 'session_meta') { ctx.project = row.project; return []; }
            reads.push(row.n);
            return [{ ts: row.ts, tid: `t${row.n}`, project: ctx.project || 'unknown', n: row.n }];
        },
        ...extra,
    });
}

beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wp-codex-'));
    file = path.join(dir, 'rollout.jsonl');
    reads = [];
});

describe('incremental session index', () => {
    it('reads a file once and only the new part after it grows', async () => {
        fs.writeFileSync(file, line({ type: 'session_meta', project: 'p1' }) + line({ n: 1, ts: ts(5) }) + line({ n: 2, ts: ts(4) }));
        const idx = make();
        await idx.scanOnce();
        expect(reads).toEqual([1, 2]);
        await idx.scanOnce();                       // nothing new: no re-read
        expect(reads).toEqual([1, 2]);
        fs.appendFileSync(file, line({ n: 3, ts: ts(1) }));
        await idx.scanOnce();                       // only the appended row
        expect(reads).toEqual([1, 2, 3]);
        expect(idx.getEntries(1, 'p1').map(e => e.n)).toEqual([1, 2, 3]);
    });

    it('skips huge embedded-image lines without parsing them', async () => {
        fs.writeFileSync(file, line({ n: 1, ts: ts(5) }) + line({ n: 2, ts: ts(4), blob: 'x'.repeat(300 * 1024) }) + line({ n: 3, ts: ts(3) }));
        const idx = make();
        await idx.scanOnce();
        expect(reads).toEqual([1, 3]);
    });

    it('waits for an unfinished last line instead of losing it', async () => {
        fs.writeFileSync(file, line({ n: 1, ts: ts(5) }) + '{"n":2,"ts":"' + ts(4));
        const idx = make();
        await idx.scanOnce();
        expect(reads).toEqual([1]);
        fs.appendFileSync(file, '"}\n');
        await idx.scanOnce();
        expect(reads).toEqual([1, 2]);
    });

    it('tolerates a malformed line and filters by age and project', async () => {
        fs.writeFileSync(file, line({ type: 'session_meta', project: 'p1' }) + 'not json\n' + line({ n: 1, ts: ts(5) }) + line({ n: 2, ts: new Date(Date.now() - 3 * 86400000).toISOString() }));
        const idx = make();
        await idx.scanOnce();
        expect(idx.getEntries(1, 'p1').map(e => e.n)).toEqual([1]);
        expect(idx.getEntries(5, 'p1').map(e => e.n)).toEqual([1, 2]);
        expect(idx.getEntries(5, 'other')).toEqual([]);
    });

    it('keeps only the newest entries per file so memory stays bounded', async () => {
        let body = '';
        for (let i = 1; i <= 50; i++) body += line({ n: i, ts: ts(100 - i) });
        fs.writeFileSync(file, body);
        const idx = make({ perFileCap: 10 });
        await idx.scanOnce();
        expect(idx.getEntries(1).map(e => e.n)).toEqual([41, 42, 43, 44, 45, 46, 47, 48, 49, 50]);
    });

    it('requests never touch the files: getEntries is memory only', async () => {
        fs.writeFileSync(file, line({ n: 1, ts: ts(5) }));
        const idx = make();
        await idx.scanOnce();
        fs.unlinkSync(file);
        expect(idx.getEntries(1).map(e => e.n)).toEqual([1]);
    });
});
