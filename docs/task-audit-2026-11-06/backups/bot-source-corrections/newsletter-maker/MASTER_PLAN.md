# MASTER_PLAN.md - "בינה, בקיצור" Newsletter Maker

## Project Overview
Automated newsletter creation tool for "בינה, בקיצור" - a Hebrew RTL weekly newsletter covering AI and open-source news. The app helps curate content, translate/rewrite to Hebrew, generate email HTML, and send via Listmonk.

**Owner:** Noam Naumovsky
**Website:** bina-bekitzur.com
**Stack:** Next.js 15 / PostgreSQL / Prisma / Tailwind / shadcn/ui / TipTap / Claude API / Listmonk

---

## Phase 1: Core App (MVP) - COMPLETE

### TASK-101: Project Scaffold - DONE
Next.js 15 + TypeScript + Tailwind CSS 4 + shadcn/ui + Prisma + Docker Compose

### TASK-102: Database Schema - DONE
5 Prisma models (Source, ScrapedItem, HebrewContent, Newsletter, Setting), 3 enums

### TASK-103: RTL Hebrew Layout - DONE
Sidebar navigation, Rubik font, dir="rtl", dashboard with live DB stats

### TASK-104: TipTap Hebrew Editor - DONE
RTL WYSIWYG editor with toolbar (bold, italic, headings, lists, links, alignment)

### TASK-105: Claude API Integration - DONE
Summarize, rewrite to Hebrew, summary section generation, image prompt generation

### TASK-106: Newsletter HTML Builder - DONE
Table-based email HTML matching issue #41 design (#F4F7FA bg, #2CB191 CTA, 640px width, Rubik font)

### TASK-107: All Pages & Server Actions - DONE
Feed, Newsletter list/editor, Sources, Settings - all with Zod validation + server actions

### TASK-108: Preview & Send - DONE
Mobile/desktop preview toggle, test email, social text generation, Listmonk campaign creation

### TASK-109: URL Content Fetcher - DONE
Auto-fetch from GitHub, HuggingFace, and general article URLs (paste URL workflow)

### TASK-110: Listmonk Setup - DONE
Docker containers running, API user created, campaign creation verified via API

**Progress (2026-02-08):** Phase 1 fully built and architect-verified. 50 source files, 6 pages, 8 API routes. Build clean, TypeScript clean. Listmonk configured on port 9090 with API authentication. SMTP not yet configured (needs provider). Claude API key not yet added to .env.

---

## Phase 2: Content Pipeline Enhancement - IN PROGRESS

### TASK-201: SMTP Provider Setup - TODO
Configure a real SMTP provider in Listmonk so emails can actually be delivered.
Options: Brevo (300/day free), Resend (100/day free), Gmail SMTP (500/day), Amazon SES.
**Action:** Go to http://localhost:9090 → Settings → SMTP and enter provider credentials.

### TASK-202: Claude API Key - TODO
Add Claude API key to `.env` as `CLAUDE_API_KEY=sk-ant-...` to enable AI features (summarize, rewrite to Hebrew, image prompts).

### TASK-203: Import Subscribers - TODO
Import existing subscriber list from MailerLite into Listmonk. Currently only 1 test subscriber.

### TASK-204: Content Ranking & AI Categorization - TODO
Add AI-powered scoring and categorization of scraped items to help prioritize content for newsletters.

### TASK-205: Enhanced URL Fetcher - TODO
Expand fetcher to handle more source types (Twitter/X threads, Reddit posts, YouTube transcripts).

---

## Phase 3: Image Generation - NOT STARTED

### TASK-301: Replicate/Ideogram API Integration - TODO
Connect to Replicate or Ideogram API for generating newsletter cover images from Claude-generated prompts.

### TASK-302: Image Overlay System - TODO
Add newsletter branding overlay (logo, issue number, title) on generated images.

### TASK-303: Image Upload to Listmonk - TODO
Auto-upload generated images to Listmonk media library for embedding in newsletters.

---

## Phase 4: Polish & Social - NOT STARTED

### TASK-401: WhatsApp/Facebook Posting Workflow - TODO
Social text generation is built (formatters exist). Add copy-to-clipboard UI and posting guides.

### TASK-402: Mobile Responsive UI - TODO
Ensure all pages work well on mobile devices (currently desktop-focused).

### TASK-403: Newsletter Templates - TODO
Add ability to save and reuse newsletter templates with different layouts.

### TASK-404: Analytics Dashboard - TODO
Show Listmonk campaign stats (opens, clicks, bounces) on the dashboard.

### TASK-405: Subscriber Management UI - TODO
Add subscriber list management within the app (import, export, segments).

---

## Current Infrastructure

### Docker Compose Services
| Service | Container | Port | Purpose |
|---------|-----------|------|---------|
| App PostgreSQL | newsletter-maker-postgres-1 | localhost:5432 | App database |
| Listmonk | newsletter-maker-listmonk-1 | localhost:9090 | Email sending |
| Listmonk DB | newsletter-maker-listmonk-db-1 | internal only | Listmonk's own DB |

### Credentials
- **Listmonk admin:** http://localhost:9090 (admin / admin1234)
- **Listmonk API user:** newsletter-app / `iHvxXJFcBpzCHkPvRKpRH2dAkMchLW1W`
- **App DB:** postgresql://newsletter:newsletter_dev@localhost:5432/newsletter

### Environment Variables (`.env`)
| Variable | Status | Notes |
|----------|--------|-------|
| `DATABASE_URL` | Set | Working |
| `CLAUDE_API_KEY` | **EMPTY** | Needs your Claude API key for AI features |
| `REPLICATE_API_TOKEN` | **EMPTY** | Needed for Phase 3 image generation |
| `LISTMONK_API_URL` | Set | http://localhost:9090 |
| `LISTMONK_API_USER` | Set | newsletter-app |
| `LISTMONK_API_PASS` | Set | Token-based auth |

### How to Start
```bash
cd /media/endlessblink/data/my-projects/ai-development/newsletter-maker
docker compose up -d          # Start DB + Listmonk
npm run dev                   # Start dev server at localhost:3000
```

### How to Reset
```bash
npx prisma db push --force-reset                              # Reset app DB
docker compose --profile setup run --rm listmonk-setup        # Re-init Listmonk
```

---

## File Structure (50 source files)

### Pages (6)
| Page | Path | Description |
|------|------|-------------|
| Dashboard | `src/app/page.tsx` | Live stats from DB |
| Feed | `src/app/feed/` | Add content items manually or via URL |
| Newsletters | `src/app/newsletter/page.tsx` | List/create/delete newsletters |
| Editor | `src/app/newsletter/[id]/` | Full editor (content, summary, preview tabs) |
| Sources | `src/app/sources/` | Manage content sources |
| Settings | `src/app/settings/` | App settings + Listmonk status |

### API Routes (8)
| Route | Purpose |
|-------|---------|
| `/api/fetch-url` | Fetch content from GitHub/HuggingFace/article URLs |
| `/api/ai/summarize` | Claude content summarization |
| `/api/ai/rewrite` | Claude Hebrew rewriting |
| `/api/ai/image-prompt` | Claude image prompt generation |
| `/api/newsletter/[id]/send` | Send via Listmonk (test/live) |
| `/api/newsletter/[id]/html` | Get generated newsletter HTML |
| `/api/newsletter/[id]/social` | Generate WhatsApp/Facebook text |
| `/api/listmonk` | Health check proxy |

### Core Libraries
| Library | Path | Purpose |
|---------|------|---------|
| Claude AI | `src/lib/claude.ts` | 4 AI functions (summarize, rewrite, summary, image prompt) |
| Prompts | `src/lib/prompts.ts` | 5 Hebrew prompt templates |
| Listmonk | `src/lib/listmonk.ts` | Full API client (campaigns, lists, media, health) |
| HTML Builder | `src/lib/newsletter/html-builder.ts` | Table-based email HTML (415 lines) |
| Social | `src/lib/newsletter/social-formatter.ts` | WhatsApp/Facebook text formatters |
| URL Fetcher | `src/lib/fetcher/` | GitHub, HuggingFace, article parsers |

---

## Known Issues & Gotchas
- **Port 9000 conflict:** Portainer uses 9000, so Listmonk runs on 9090
- **Listmonk v6 auth:** Uses API token users, NOT config.toml basic auth
- **Health check:** Uses `/api/lists` not `/api/health` (v6 requires auth for health)
- **Next.js 15 params:** Dynamic route params are `Promise<{id: string}>` - must await
- **`force-dynamic`:** All pages using Prisma need `export const dynamic = 'force-dynamic'`
- **Buffer type:** `listmonk.ts` needs `new Uint8Array(file)` for Blob compatibility
- **Stale LSP:** LSP sometimes shows Prisma import errors that don't exist - verify with `npx tsc --noEmit`

---

## Architecture Reference
- Full design specs: `ARCHITECTURE.md`
- Coding standards: `CLAUDE.md`
