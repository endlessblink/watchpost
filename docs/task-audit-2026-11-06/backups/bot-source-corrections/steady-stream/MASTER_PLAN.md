# Steady Stream — Master Plan

Hebrew/RTL freelance purchase ledger (פנקס) with local receipt parsing via Tesseract.js + Gemma 4 through Ollama.

## Resume after restart

```bash
cd /media/endlessblink/data/my-projects/ai-development/freelance/steady-stream
python3 -m http.server 5173 --bind 127.0.0.1
```

Then in a browser:
- **Reference app** (UI only, simulated paste): http://127.0.0.1:5173/Ledger.html
- **Parser POC** (real OCR + LLM): http://127.0.0.1:5173/parse-demo.html

Prerequisites:
- `ollama serve` running (systemd unit already does this)
- `gemma4:latest` pulled (9.6 GB, already installed)
- ~35 MB of browser-side Tesseract assets cached on first image parse

## File inventory

| File | Source | Purpose |
|------|--------|---------|
| `README.md` | Design bundle | Original coding-agent handoff notes |
| `Ledger.html` | Design bundle | React-in-browser shell; loads JSX siblings via Babel |
| `design-canvas.jsx` | Design bundle | Figma-ish pan/zoom artboard wrapper |
| `tokens.jsx` | Design bundle | Palettes (ink default), categories, Hebrew UI strings |
| `ledger-desktop.jsx` | Design bundle | Desktop ledger — sidebar, summary, paste zone, grouped table, panels |
| `ledger-mobile.jsx` | Design bundle | 390×844 mobile companion |
| `ollama-parse.js` | This session | Receipt parser — Tesseract best-tier OCR → Gemma 4 JSON |
| `parse-demo.html` | This session | Standalone POC UI exercising `ollama-parse.js` |
| `ledger-reference-rendered.png` | This session | Screenshot proving Ledger.html matches reference |

## Task table

| ID | Status | Title |
|----|--------|-------|
| T-001 | DONE | Port Ledger.html handoff bundle to project root verbatim |
| T-002 | DONE | Build Tesseract + Gemma 4 receipt parser with POC page |
| T-003 | DONE | Language-smart OCR (eng first, heb+eng on escalation) |
| T-004 | DONE | No-hallucination system prompt — empty field instead of invented vendor |
| T-005 | IN PROGRESS | Integrate `ollama-parse.js` into `ledger-desktop.jsx` paste flow |
| T-006 | TODO | Persist purchases to localStorage (categories already persist; purchases reset on reload) |
| T-007 | TODO | Real CSV/PDF generation in the Export panel (currently UI-only) |
| T-008 | TODO | Per-purchase image thumbnail storage (cache the original image alongside parsed fields) |
| T-009 | TODO | Manual-correction feedback loop — user edits become future few-shot context |

---

#### T-001 — Port Ledger.html handoff bundle to project root verbatim

**Status:** DONE

Bundle source: `https://api.anthropic.com/v1/design/h/UezNcsKZqZE9PqP-p952jQ` (design handoff, RKt… hash is the older/wrong bundle — do not use).

Earlier pass built the wrong design entirely (English financial dashboard with Inter/Georgia fonts, hardcoded transactions). Replaced with the actual reference: Hebrew RTL ink-palette freelance ledger, `SEED_PURCHASES = []`, empty-state visible. Nothing added or removed from bundle files. Verified visually at `ledger-reference-rendered.png`.

#### T-002 — Build Tesseract + Gemma 4 receipt parser with POC page

**Status:** DONE

Pipeline:
```
image ──▶ Tesseract.js (heb+eng, tessdata_best) ──▶ text
                                                     │
text/email/url  ─────────────────────────────────────┼──▶ Gemma 4 (JSON mode) ──▶ record
                                                     │
                                     purchase schema ◀┘
```

- Tesseract: `tessdata_best` (LSTM float weights), loaded from `https://tessdata.projectnaptha.com/4.0.0_best`. Cached in browser IndexedDB after first use. No system install.
- Gemma 4: `gemma4:latest` (8B Q4_K_M, 9.6 GB) via `http://localhost:11434/api/chat`. CORS works out of the box for `127.0.0.1:*` origins.
- Return shape matches `ledger-desktop.jsx` purchase record: `{ id, category, vendor, date, total, currency, source, note, items[], tax, project }`.
- Markdown-fence stripping on the Gemma response (it sometimes ignores `format: "json"`).

Cold timing on a canvas-rendered English receipt: ~13.6 s (Gemma load-in dominates). Warm timing: ~4–7 s. OCR alone: ~200–500 ms after first-pass language data is cached.

#### T-003 — Language-smart OCR

**Status:** DONE

Two lazy-init Tesseract workers keyed by language set: `eng` and `heb+eng`. Auto mode:

1. Run `eng` pass
2. If confidence ≥ 75 AND output doesn't contain Hebrew codepoints (U+0590–U+05FF) AND output ≥ 20 chars → done
3. Otherwise run `heb+eng`, return the higher-confidence pass

Prevents the Hebrew model from pulling Latin glyphs toward Hebrew confusables on English receipts. Tested A/B/C: English-with-vendor stayed `eng` (no heb+eng wasted), Hebrew receipt correctly escalated (conf 41 → 90), English-without-vendor stayed `eng` (93).

UI: `<select id="lang-select">` in `parse-demo.html` offers `auto | eng only | heb+eng always`. Default auto.

#### T-004 — No-hallucination system prompt

**Status:** DONE

Gemma 4 was inventing vendor names from price-pattern context (e.g. $10 subscription → "Midjourney Inc"). Strengthened `SYSTEM` in `ollama-parse.js` with 5 hard rules in Hebrew:

1. No field invention — `""` / `0` / `[]` when absent
2. No vendor inference from price patterns or item descriptions
3. No date/invoice-number guessing from context
4. Only `category` may be inferred (it's a closed enum, not free text)
5. Empty/unreadable input → default schema

Hallucination test (English receipt with no vendor header): **now returns `vendor: ""` instead of inventing one.** `category` still correctly resolves to `software`. User can inline-edit the empty vendor in the ledger UI.

#### T-005 — Integrate `ollama-parse.js` into `ledger-desktop.jsx` paste flow

**Status:** IN PROGRESS — **next session starts here**

Current state: `ledger-desktop.jsx` still uses the bundle's simulated paste (2 s shimmer → hardcoded fake record). `parse-demo.html` proves the real pipeline works end-to-end against Ollama.

Integration plan (does NOT modify the bundle JSX directly — it's a user-requested change, so we're allowed to go beyond "nothing more than the reference"):

1. Add `<script src="ollama-parse.js"></script>` to `Ledger.html` before the babel scripts (guarantees `window.OllamaParse` is available when React mounts).
2. In `ledger-desktop.jsx`, find `simulatePaste` (and the three helper sim variants — `sampleText`, `sampleImage`, `samplePDF`, `sampleURL` buttons in the PasteZone).
3. Replace the `setTimeout + hardcoded record` body with:
   ```jsx
   const onRealPaste = async ({ kind, content, dataUrl }) => {
     setParsing(true);
     try {
       const rec = await window.OllamaParse.receipt({ kind, content, dataUrl, onProgress: setProgress });
       setPurchases((l) => [rec, ...l]);
     } catch (e) {
       setError(String(e));
     } finally { setParsing(false); }
   };
   ```
4. Wire `paste` event listener on PasteZone to read clipboard text OR image, dispatch to `onRealPaste` with matching `kind`.
5. Keep the sample buttons but change them to reuse `onRealPaste` with stock sample strings (the POC already defines these in `parse-demo.html`).
6. Surface progress in the shimmer region — `ledger-desktop.jsx` already has a shimmer-text element during parsing; show the Tesseract stage + % there.
7. Surface OCR confidence + language mode in the purchase detail drawer as a small `<div>` at the bottom (for transparency/debug).

Key watch-outs:
- `ledger-desktop.jsx` is 76 KB and 1314+ lines. Surgical str_replace edits, not rewrites.
- `SEED_PURCHASES = []` must stay empty (user: "0 hardcoded data").
- The existing drag-drop + `paste` handlers already exist in `ledger-desktop.jsx` — hook into them, don't replace them.

#### T-006 — Persist purchases to localStorage

**Status:** TODO

Only `categories` currently persist (key: was added in the last iteration of the prototype chat, stores category overrides). Purchases are `useState([])` only — reset on reload.

Plan:
- New key: `steady-stream:purchases:v1`
- `useEffect` to rehydrate on mount (empty array fallback)
- `useEffect` to persist on every change, debounced 250 ms
- "Clear all purchases" button in Settings panel, with confirm

#### T-007 — Real CSV/PDF generation in Export panel

**Status:** TODO

Export panel exists with UI (date range, format, category filter, include-receipts toggle). Download button currently does nothing. Plan: CSV via `Blob` + `URL.createObjectURL`; PDF via `jsPDF` or `pdfmake` loaded from CDN.

#### T-008 — Per-purchase image thumbnail storage

**Status:** TODO

When `kind: 'image'`, the raw data URL is currently thrown away. Store it on the record for:
- Detail drawer shows a thumbnail
- Export panel "include receipts" toggle actually has content to attach
- Re-parse button (edge: when OCR fails, user can redo with different language mode)

Size concern: `localStorage` is ~5 MB total per origin. Store images in IndexedDB instead via `idb-keyval`.

#### T-009 — Manual-correction feedback loop

**Status:** TODO (stretch)

When user inline-edits a parsed field (vendor from "" to "Blue Bottle"), keep the original OCR text + the correction as a pair. Feed the last N pairs as few-shot examples in the Gemma prompt on future parses. Compounds accuracy over time with zero server cost.
