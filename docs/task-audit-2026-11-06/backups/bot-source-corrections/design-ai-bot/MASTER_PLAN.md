# MASTER_PLAN

## Summary

| ID | Title | Priority | Status |
| --- | --- | --- | --- |
| **BOT-001** | **Migrate bot from Kapso to WAHA using real eSIM** | **P1** | IN PROGRESS |

## BOT-001

### Goal

Move the current Hebrew WhatsApp summary bot off the Kapso virtual-number path and onto a real eSIM-backed WhatsApp account connected through the existing WAHA server.

### Current Task

Continue from the current Kapso prototype and switch the runtime path to WAHA after acquiring a real Israeli eSIM number that supports WhatsApp verification, normal group membership, and community use.

### What Was Built

- Created a minimal TypeScript WhatsApp bot project in this repo
- Added Express webhook server with health endpoint
- Added Kapso webhook registration script
- Implemented OpenRouter-based Hebrew summarization flow
- Added command triggers: `/sum`, `/summary`, `/סכם`
- Bot fetches recent conversation history before summarizing
- Updated docs and env scaffolding for the current prototype

### Verified State

- The project builds successfully with `npm run build`
- The bot runs successfully with `npm start`
- Verified health endpoint returned:

```json
{"ok":true,"botName":"Design-AI","phoneNumberId":"991295117410886","model":"google/gemma-4-31b-it"}
```

- An internal dry run through OpenRouter produced a valid Hebrew summary output

### Current Configuration

- Current bot internal name: `Design-AI`
- Current OpenRouter model: `google/gemma-4-31b-it`
- Current Kapso production number ID: `991295117410886`
- Current project path: `/media/endlessblink/data/my-projects/ai-development/bots+automation/design-ai-bot`

### What We Learned

- Kapso virtual numbers appear too limited for the intended community/subgroup workflow
- Adding the Kapso virtual number to a WhatsApp community does not automatically place it in the actual subgroups that matter
- The subgroup membership issue is a WhatsApp/platform limitation, not a bot-code limitation
- A real mobile number is preferable for this use case
- For personal use, WAHA is likely a better fit than Kapso

### WAHA Context

- Existing WAHA dashboard: `http://84.46.253.137:3050/dashboard`
- Existing WAHA container name: `waha`
- Existing WAHA sessions path: `/opt/waha/sessions`
- Existing WAHA webhook currently points to another service, so this bot should use either:
  - a separate WAHA session, or
  - a separate WAHA instance/container

### Decision Taken

Preferred path is:

1. Buy a real Israeli eSIM with voice and SMS
2. Use it for WhatsApp / WhatsApp Business verification
3. Connect that account to the existing WAHA infrastructure
4. Adapt this bot from Kapso payload handling to WAHA payload handling
5. Test in direct chat, regular groups, and then community-related contexts if needed

### Recommended eSIM Criteria

- Real mobile number
- Supports SMS reception
- Supports voice calls or at least incoming calls
- Not data-only
- Cheap monthly plan is fine; large data bundles are unnecessary

### Remaining Work

1. Purchase and activate the Israeli eSIM
2. Create or connect the WhatsApp account on that number
3. Decide whether to reuse the existing WAHA instance with a new session or deploy a separate WAHA container
4. Replace Kapso webhook parsing with WAHA webhook parsing in `src/index.ts`
5. Replace Kapso send/history APIs with WAHA-compatible equivalents
6. Verify `/sum` works end-to-end with the real account
7. Add group-safe restrictions if needed after live testing

### Resume Notes

- This task is intentionally still in progress
- The current codebase is a working Kapso/OpenRouter prototype, not the final WAHA version
- Best resume point after restart: start from the WAHA migration decision, not from the original Kapso onboarding

## Bot identity (added 2026-10-02)

This project's bot: `design-ai` — Design AI Bot, dormant local Kapso/OpenRouter prototype awaiting the WAHA migration decision. See its entry in `devops/brainiac/BOTS.md` (single source of truth for every bot; Hermes = platform only, bots are referred to by handle). Update BOTS.md when this bot's topic, profile, host, token owner or status changes. No token values in plans.
