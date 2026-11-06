'use strict';
// Incremental index of agent session logs.
//
// The rule this replaces: "answer a request by re-reading every session file".
// Session archives are huge (tens of GB), so that froze the whole server.
// Now a background scan reads each file ONCE, remembers how far it got, and
// only reads what was appended since. Requests read the small in-memory index.
const fs = require('fs');

const CHUNK_BYTES = 8 * 1024 * 1024;

function createCodexIndex({
    listFiles,                 // (days) => absolute file paths changed within the last N days
    rowToEntries,              // (row, ctx) => entries (ctx carries session id, folder, branch across rows)
    maxLineBytes = 256 * 1024, // lines above this are embedded images/snapshots: skipped unparsed
    intervalMs = 60 * 1000,
    retainDays = 2,            // only recent sessions are indexed; older archives are never read
    perFileCap = 3000,         // newest entries per session file: bounds memory
    maxEntries = 200000,
} = {}) {
    const files = new Map();   // path -> { offset, ctx, entries }
    let scanning = false;
    let timer = null;
    let lastScanAt = 0;

    async function readNewLines(fp, state) {
        const handle = await fs.promises.open(fp, 'r');
        try {
            const { size } = await handle.stat();
            if (size < state.offset) { state.offset = 0; state.entries = []; state.ctx = { file: fp }; } // file was replaced
            const buffer = Buffer.allocUnsafe(CHUNK_BYTES);
            let carry = Buffer.alloc(0);
            let position = state.offset;
            while (position < size) {
                const { bytesRead } = await handle.read(buffer, 0, CHUNK_BYTES, position);
                if (!bytesRead) break;
                position += bytesRead;
                let data = carry.length ? Buffer.concat([carry, buffer.subarray(0, bytesRead)]) : Buffer.from(buffer.subarray(0, bytesRead));
                let start = 0;
                let nl;
                while ((nl = data.indexOf(10, start)) !== -1) {
                    const lineLen = nl - start;
                    if (lineLen > 0 && lineLen <= maxLineBytes) {
                        try {
                            const row = JSON.parse(data.toString('utf8', start, nl));
                            const found = rowToEntries(row, state.ctx);
                            if (found.length) {
                                for (const e of found) state.entries.push(e);
                                if (state.entries.length > perFileCap) state.entries.splice(0, state.entries.length - perFileCap);
                            }
                        } catch { /* a malformed line is skipped, never fatal */ }
                    }
                    state.offset += lineLen + 1;
                    start = nl + 1;
                }
                carry = data.subarray(start);   // an unfinished last line waits for the next scan
                await new Promise(resolve => setImmediate(resolve)); // let requests through
            }
        } finally {
            await handle.close();
        }
    }

    async function scanOnce() {
        if (scanning) return;
        scanning = true;
        try {
            const paths = listFiles(retainDays);
            for (const fp of paths) {
                let state = files.get(fp);
                if (!state) { state = { offset: 0, ctx: { file: fp }, entries: [] }; files.set(fp, state); }
                try {
                    const { size } = await fs.promises.stat(fp);
                    if (size !== state.offset) await readNewLines(fp, state);
                } catch { /* unreadable file: try again next scan */ }
                await new Promise(resolve => setImmediate(resolve));
            }
            const live = new Set(paths);
            for (const fp of [...files.keys()]) if (!live.has(fp)) files.delete(fp); // aged out
            lastScanAt = Date.now();
        } finally {
            scanning = false;
        }
    }

    function getEntries(days, projectFilter) {
        const cutoffIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        const seen = new Set();
        const out = [];
        for (const state of files.values()) {
            for (const entry of state.entries) {
                if (entry.ts < cutoffIso) continue;
                if (projectFilter && entry.project !== projectFilter) continue;
                if (seen.has(entry.tid)) continue;
                seen.add(entry.tid);
                out.push(entry);
                if (out.length >= maxEntries) return out;
            }
        }
        return out;
    }

    function start() {
        if (timer) return;
        scanOnce().catch(() => {});
        timer = setInterval(() => scanOnce().catch(() => {}), intervalMs);
        if (timer.unref) timer.unref();
    }

    function stop() { if (timer) clearInterval(timer); timer = null; }

    return { start, stop, scanOnce, getEntries, status: () => ({ files: files.size, lastScanAt, scanning }) };
}

module.exports = { createCodexIndex };
