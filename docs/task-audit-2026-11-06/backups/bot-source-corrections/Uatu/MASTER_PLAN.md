# Uatu — Autonomous VPS Monitoring & Self-Healing System

**Uatu** watches over your VPS so you don't have to. Named after the Marvel Watcher, this TypeScript/Node.js daemon runs on a Contabo VPS (Ubuntu 22.04, 4CPU/8GB/150GB, IP 84.46.253.137), monitors Docker containers (Supabase, WAHA, Caddy), system resources, HTTP endpoints, and logs. It auto-fixes known issues via a YAML playbook, uses Claude Code CLI headless for unknown issue analysis, reports via Telegram, and bridges to the Watchpost orchestration dashboard.

**Stack:** TypeScript · Node.js · better-sqlite3 · Fastify · Telegraf · yaml · zod · Claude Code CLI  
**Target VPS:** Contabo, Ubuntu 22.04, 4CPU/8GB/150GB, IP `84.46.253.137`  
**Scan interval:** 30 minutes  
**Deployment:** systemd service at `/opt/uatu`

---

## Summary Table

| ID | Type | Priority | Status | Summary | Deps |
|----|------|----------|--------|---------|------|
| PRE-001 | INQUIRY | P0 | PLANNED | Verify VPS RAM headroom for Uatu daemon | — |
| PRE-002 | INQUIRY | P0 | PLANNED | Test Claude Code CLI headless on VPS | — |
| PRE-003 | TASK | P0 | PLANNED | Create Telegram bot via @BotFather | — |
| TASK-001 | TASK | P0 | PLANNED | Initialize project scaffold | — |
| TASK-002 | TASK | P0 | PLANNED | Define core TypeScript types | — |
| TASK-003 | TASK | P0 | PLANNED | Create config module | — |
| TASK-004 | TASK | P0 | PLANNED | Create shell utility | — |
| TASK-005 | TASK | P0 | PLANNED | Create lockfile utility | — |
| TASK-006 | TASK | P0 | PLANNED | Container scanner | TASK-002, TASK-004 |
| TASK-007 | TASK | P0 | PLANNED | Resource scanner | TASK-002, TASK-003, TASK-004 |
| TASK-008 | TASK | P0 | PLANNED | Endpoint scanner | TASK-002, TASK-003 |
| TASK-009 | TASK | P0 | PLANNED | Log scanner | TASK-002, TASK-004 |
| TASK-010 | TASK | P0 | PLANNED | Scanner aggregator | TASK-006..TASK-009 |
| TASK-011 | TASK | P0 | PLANNED | Define playbook YAML schema + initial entries | TASK-002 |
| TASK-012 | TASK | P0 | PLANNED | Playbook loader with zod validation | TASK-011 |
| TASK-013 | TASK | P0 | PLANNED | Issue matcher with AND/OR condition support | TASK-012 |
| TASK-014 | TASK | P0 | PLANNED | Playbook executor with before/after state | TASK-004, TASK-012 |
| TASK-015 | TASK | P0 | PLANNED | Forbidden operations deny list | — |
| TASK-016 | TASK | P0 | PLANNED | Cooldown tracker with SQLite persistence | TASK-024 |
| TASK-017 | TASK | P1 | PLANNED | Telegraf bot setup with graceful shutdown | PRE-003 |
| TASK-018 | TASK | P1 | PLANNED | Report formatter with Markdown structure | TASK-002 |
| TASK-019 | TASK | P1 | PLANNED | Inline keyboard for AI proposals | TASK-017, TASK-018 |
| TASK-020 | TASK | P1 | PLANNED | Fallback storage and retry queue | TASK-018 |
| TASK-021 | TASK | P1 | PLANNED | Claude Code CLI bridge | PRE-002, TASK-004 |
| TASK-022 | TASK | P1 | PLANNED | Proposal formatter for AI analysis output | TASK-021, TASK-018 |
| TASK-023 | TASK | P1 | PLANNED | AI cost tracking per invocation to SQLite | TASK-021, TASK-024 |
| TASK-024 | TASK | P1 | PLANNED | SQLite state store with 5 tables | TASK-002 |
| TASK-025 | TASK | P1 | PLANNED | HTTP API via Fastify (5 endpoints) | TASK-024 |
| TASK-026 | TASK | P1 | PLANNED | Health endpoint for UptimeRobot | TASK-025 |
| TASK-027 | TASK | P2 | PLANNED | Watchpost bridge plugin scaffold | TASK-025 |
| TASK-028 | TASK | P2 | PLANNED | Auto-register Uatu in Watchpost registry | TASK-027 |
| TASK-029 | TASK | P2 | PLANNED | Sync engine: issues→tasks, fixes→status | TASK-027, TASK-028 |
| TASK-030 | TASK | P0 | PLANNED | Main orchestrator loop | TASK-010, TASK-012, TASK-014, TASK-017, TASK-021, TASK-024 |
| TASK-031 | TASK | P0 | PLANNED | Internal 30-min scheduler with graceful stop | TASK-030 |
| TASK-032 | TASK | P0 | PLANNED | Per-stage error isolation in scan cycle | TASK-030 |
| TASK-033 | TASK | P1 | PLANNED | systemd unit file for Uatu service | TASK-031 |
| TASK-034 | TASK | P1 | PLANNED | Install script: SSH copy, npm ci, systemd | TASK-033 |
| TASK-035 | TASK | P1 | PLANNED | Doppler config: Uatu project and secrets | PRE-003 |
| TASK-036 | TASK | P1 | PLANNED | UptimeRobot monitor setup (manual) | TASK-026 |
| TASK-037 | TASK | P2 | PLANNED | Scanner unit tests with mocked commands | TASK-010 |
| TASK-038 | TASK | P2 | PLANNED | Playbook unit tests (match, cooldown, deny) | TASK-016 |
| TASK-039 | TASK | P2 | PLANNED | Integration test: full scan cycle mocked | TASK-030 |
| TASK-040 | TASK | P2 | PLANNED | E2E test on VPS (manual verification) | TASK-034 |

---

## Phase 0 — Prerequisites

### PRE-001 — Verify VPS RAM headroom for Uatu daemon

**Type:** INQUIRY | **Priority:** P0 | **Status:** PLANNED | **Deps:** —

Run `docker stats --no-stream` on the VPS to get current memory consumption of all running containers (Supabase stack, WAHA, Caddy). Calculate available headroom against the 8GB total. Uatu itself will consume approximately 100–200MB resident. Need confirmation that existing services + Uatu daemon fit comfortably within the 8GB limit.

**Command to run:**
```bash
ssh vps "docker stats --no-stream --format 'table {{.Name}}\t{{.MemUsage}}'"
ssh vps "free -h"
```

**Acceptance:** Confirm at least 512MB free after accounting for Uatu overhead.

---

### PRE-002 — Test Claude Code CLI headless on VPS

**Type:** INQUIRY | **Priority:** P0 | **Status:** PLANNED | **Deps:** —

Verify that `claude` CLI is installed on the VPS and works in non-interactive (headless) mode. This is required for the AI bridge (TASK-021). The `--bare` flag suppresses interactive prompts; `--output-format json` is needed for programmatic parsing.

**Command to run on VPS:**
```bash
claude --bare -p "echo test" --allowedTools "Bash" --output-format json
```

**Acceptance:** JSON response returned without hanging for input. Confirm `ANTHROPIC_API_KEY` is available in the VPS environment (or via Doppler).

---

### PRE-003 — Create Telegram bot via @BotFather

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** —

Manual step. Open Telegram, message `@BotFather`, run `/newbot`. Name it "Uatu Monitor". Save the bot token. Also obtain the target chat ID (send a message to the bot, then call `https://api.telegram.org/bot{TOKEN}/getUpdates` to get the chat ID).

**Secrets to store in Doppler (Uatu project):**
- `TELEGRAM_BOT_TOKEN` — the bot token from @BotFather
- `UATU_CHAT_ID` — the numeric chat ID for report delivery

**Acceptance:** Can send a test message via curl to the bot token and see it appear in Telegram.

---

## Phase 1 — Foundation

### TASK-001 — Initialize project scaffold

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** —

Set up the TypeScript/Node.js project structure from scratch.

**Files to create:**
- `package.json` — name: `uatu`, scripts: `build`, `start`, `dev`, `test`
- `tsconfig.json` — target ES2022, module NodeNext, strict mode, outDir: `dist/`
- `CLAUDE.md` — AI context doc describing the project for headless Claude invocations
- `.gitignore` — node_modules, dist/, .env, *.sqlite
- `.env.example` — TELEGRAM_BOT_TOKEN, UATU_CHAT_ID, ANTHROPIC_API_KEY, UATU_PORT, DB_PATH

**Dependencies to install:**
```
telegraf better-sqlite3 fastify yaml zod
```

**Dev dependencies:**
```
typescript @types/node @types/better-sqlite3 tsx vitest
```

**Directory structure:**
```
src/
  scanner/
  playbook/
  reporter/
  ai/
  state/
  utils/
  types.ts
  config.ts
  index.ts
bridge/
infra/
tests/
playbook.yaml
```

---

### TASK-002 — Define core TypeScript types

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** —

**File:** `src/types.ts`

Define all shared types used across the system:

```typescript
enum Severity { critical = 'critical', warning = 'warning', info = 'info' }

interface Issue {
  id: string;          // uuid
  scanCycleId: string;
  source: 'container' | 'resource' | 'endpoint' | 'log';
  service: string;     // container name, endpoint URL, etc.
  severity: Severity;
  description: string;
  raw: Record<string, unknown>; // raw data from scanner
  detectedAt: Date;
}

interface Fix {
  issueId: string;
  playbookEntryId?: string;
  action: string;
  beforeState: string;
  afterState: string;
  success: boolean;
  executedAt: Date;
  error?: string;
}

interface PlaybookEntry { /* see TASK-011 */ }
interface ScanResult { issues: Issue[]; scannedAt: Date; durationMs: number; }
interface ScanCycle { id: string; startedAt: Date; completedAt?: Date; }
interface Report { scanCycle: ScanCycle; issues: Issue[]; fixes: Fix[]; }
```

---

### TASK-003 — Create config module

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** —

**File:** `src/config.ts`

Centralized configuration with environment variable overrides:

**Thresholds:**
- CPU load: 80% (1-min average / CPU count)
- RAM usage: 85%
- Disk usage warning: 85%, critical: 90%

**Service definitions:**
- Containers to monitor: `supabase-db`, `supabase-kong`, `supabase-auth`, `waha`, `caddy` (configurable via env)
- HTTP endpoints: `http://localhost:8000` (WAHA), `http://localhost:3050` (Supabase Studio), `http://localhost:80`, `https://localhost:443`
- Endpoint timeout: 10 seconds

**Telegram config:**
- Bot token from `TELEGRAM_BOT_TOKEN`
- Chat ID from `UATU_CHAT_ID`

**Other:**
- Scan interval: 30 minutes (default)
- DB path: `./uatu.sqlite` (override via `DB_PATH`)
- HTTP API port: 6020 (override via `UATU_PORT`)
- Log scanner lookback: 30 minutes

---

### TASK-004 — Create shell utility

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** —

**File:** `src/utils/shell.ts`

Safe command execution wrapper around Node.js `child_process.execFile`:

```typescript
interface ShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

async function shell(cmd: string, args: string[], opts?: {
  timeout?: number;   // default 30s
  cwd?: string;
}): Promise<ShellResult>
```

- Uses `execFile` (not `exec`) to avoid shell injection
- Captures stdout and stderr separately
- Returns exit code (does not throw on non-zero)
- Enforces timeout via `AbortController`
- Logs command + exit code at debug level

---

### TASK-005 — Create lockfile utility

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** —

**File:** `src/utils/lockfile.ts`

File-based mutual exclusion to prevent overlapping scan cycles:

```typescript
class Lockfile {
  acquire(): Promise<void>   // throws if lock held; writes PID + timestamp
  release(): void            // removes lockfile
  isStale(): boolean         // true if PID in lock is no longer running
}
```

- Lock file location: `./uatu.lock` (configurable)
- Stale detection: check if PID in lockfile is alive via `process.kill(pid, 0)`
- Auto-cleanup on stale lock before acquiring
- On process exit (`SIGINT`/`SIGTERM`), release lock automatically

---

## Phase 2 — Scanners

### TASK-006 — Container scanner

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-002, TASK-004

**File:** `src/scanner/containers.ts`

Detect stopped, unhealthy, and crash-looping containers.

**Method:**
1. Run `docker ps -a --format '{{json .}}'` to get all containers
2. Run `docker inspect <name>` for detailed health check state on monitored containers
3. Compare against configured container list from `src/config.ts`

**Issue conditions:**
- Container not running (status != `running`) → `severity: critical`
- Container health status = `unhealthy` → `severity: critical`
- Container restart count > 3 in last hour → `severity: warning`
- Configured container missing entirely → `severity: critical`

**Output:** `Issue[]`

---

### TASK-007 — Resource scanner

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-002, TASK-003, TASK-004

**File:** `src/scanner/resources.ts`

Monitor CPU, RAM, and disk usage against configured thresholds.

**CPU:** `os.loadavg()[0]` divided by `os.cpus().length` → percentage  
**RAM:** Parse output of `free -m` (total, used, available columns)  
**Disk:** Parse output of `df -h /` and `/var/lib/docker` (if separate mount)

**Issue conditions:**
- CPU > 80% → `severity: warning`; CPU > 95% → `severity: critical`
- RAM > 85% → `severity: warning`; RAM > 95% → `severity: critical`
- Disk > 85% → `severity: warning`; Disk > 90% → `severity: critical`

**Output:** `Issue[]` (empty if all within thresholds)

---

### TASK-008 — Endpoint scanner

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-002, TASK-003

**File:** `src/scanner/endpoints.ts`

HTTP GET health checks against configured endpoints.

**Implementation:** Use Node.js built-in `fetch` (Node 18+) with `AbortController` for timeout.

**Per endpoint:**
- Record response time (ms)
- Record HTTP status code
- Classify: 2xx = healthy, 5xx = critical, timeout/connection refused = critical, 4xx = warning

**Issue conditions:**
- Non-2xx status → severity based on code range
- Connection refused → `severity: critical` (service down)
- Response time > 5s → `severity: warning`

**Output:** `Issue[]`

---

### TASK-009 — Log scanner

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-002, TASK-004

**File:** `src/scanner/logs.ts`

Parse recent Docker container logs and systemd journal for error patterns.

**Sources:**
- `docker logs --since 30m <container>` for each monitored container
- `journalctl --since "30 min ago" --no-pager -o short-monotonic`

**Pattern matching (regex):**
- `OOM|out of memory|killed process` → `severity: critical`
- `segfault|SIGSEGV|core dumped` → `severity: critical`
- `ERROR|FATAL|PANIC|CRIT` → `severity: warning`
- `WARNING|WARN` → `severity: info`

**Deduplication:** Group identical patterns within same service; report count rather than individual lines.

**Output:** `Issue[]`

---

### TASK-010 — Scanner aggregator

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-006, TASK-007, TASK-008, TASK-009

**File:** `src/scanner/index.ts`

Run all four scanners in parallel and merge results into a unified `ScanResult`.

```typescript
async function runAllScanners(): Promise<ScanResult>
```

**Implementation:**
- Use `Promise.allSettled([containers(), resources(), endpoints(), logs()])`
- For each rejected scanner, log the error as a `warning`-severity issue with `source: 'scanner'`
- Assign a `scanCycleId` (uuid) to all issues in this batch
- Record total duration (from first scanner start to last settlement)

**Guarantee:** Individual scanner failures never abort the full scan.

---

## Phase 3 — Playbook Engine

### TASK-011 — Playbook YAML schema + initial entries

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-002

**File:** `playbook.yaml`

Define the YAML structure and seed with known fixes:

```yaml
entries:
  - id: restart-stopped-container
    description: Restart a stopped container
    trigger:
      source: container
      condition: status == "stopped"
      severity: [critical]
    action:
      type: shell
      command: docker
      args: ["start", "{{service}}"]
    cooldown:
      maxAttempts: 3
      windowMinutes: 60
    verifyAfter:
      type: container-running
      service: "{{service}}"

  - id: truncate-docker-logs
    description: Truncate Docker log files when disk > 85%
    trigger:
      source: resource
      condition: disk_percent > 85
    action:
      type: shell
      command: truncate
      args: ["-s", "0", "/var/lib/docker/containers/{{service}}/{{service}}-json.log"]
    cooldown:
      maxAttempts: 1
      windowMinutes: 360

  - id: vacuum-journalctl
    description: Vacuum journalctl when disk > 90%
    trigger:
      source: resource
      condition: disk_percent > 90
      severity: [critical]
    action:
      type: shell
      command: journalctl
      args: ["--vacuum-size=500M"]
    cooldown:
      maxAttempts: 1
      windowMinutes: 1440

  - id: restart-on-endpoint-failure
    description: Restart container when its endpoint fails
    trigger:
      source: endpoint
      condition: status == "down"
      severity: [critical]
    action:
      type: shell
      command: docker
      args: ["restart", "{{service}}"]
    cooldown:
      maxAttempts: 2
      windowMinutes: 60
```

---

### TASK-012 — Playbook loader with zod validation

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-011

**File:** `src/playbook/index.ts`

Parse and validate `playbook.yaml` at startup using `yaml` and `zod`:

```typescript
const PlaybookEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  trigger: z.object({
    source: z.enum(['container', 'resource', 'endpoint', 'log']),
    condition: z.string(),
    severity: z.array(z.enum(['critical', 'warning', 'info'])).optional(),
  }),
  action: z.object({
    type: z.literal('shell'),
    command: z.string(),
    args: z.array(z.string()),
  }),
  cooldown: z.object({
    maxAttempts: z.number(),
    windowMinutes: z.number(),
  }),
  verifyAfter: z.object({ type: z.string(), service: z.string() }).optional(),
});
```

Throws descriptive error on schema violation. Exports validated `PlaybookEntry[]`.

---

### TASK-013 — Issue matcher with AND/OR condition support

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-012

**File:** `src/playbook/index.ts` (extend loader)

Match `Issue[]` from scanners against loaded playbook entries.

```typescript
function matchIssue(issue: Issue, entries: PlaybookEntry[]): PlaybookEntry | null
```

**Condition evaluation:**
- Parse condition strings like `status == "stopped"`, `disk_percent > 85`
- Support `AND` / `OR` compound conditions
- Template substitution: `{{service}}` → `issue.service`
- Severity filter: only match if issue severity is in entry's severity list

Returns the first matching entry (or `null` for no match — escalate to AI).

---

### TASK-014 — Playbook executor with before/after state

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-004, TASK-012

**File:** `src/playbook/executor.ts`

Execute a matched playbook action and capture state changes.

```typescript
async function executeAction(issue: Issue, entry: PlaybookEntry): Promise<Fix>
```

**Sequence:**
1. Capture before-state (container status, disk usage, endpoint response)
2. Check forbidden operations list (TASK-015) — abort if match
3. Execute action via `shell()` utility with template substitution
4. Wait for `verifyAfter` condition (poll up to 60s with 5s intervals)
5. Capture after-state
6. Return `Fix` with success/failure and both states

---

### TASK-015 — Forbidden operations deny list

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** —

**File:** `src/playbook/forbidden.ts`

Hard-coded list of patterns that must never be executed by Uatu, regardless of playbook content or AI proposals.

**Forbidden patterns (checked as substring/regex against full command string):**
- `rm -rf`
- `docker system prune`
- `.env` (any write to .env files)
- `iptables` / `ufw`
- `doppler`
- `DROP TABLE` / `DELETE FROM` (SQL)
- `chmod 777`
- `> /dev/sda` (disk wipe patterns)

```typescript
function isForbidden(command: string, args: string[]): boolean
function assertNotForbidden(command: string, args: string[]): void // throws
```

Called by executor BEFORE every shell invocation. Also called by AI bridge before applying any AI-suggested command.

---

### TASK-016 — Cooldown tracker with SQLite persistence

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-024

**File:** `src/playbook/cooldown.ts`

Track per-service, per-action attempt counts within a rolling time window.

```typescript
class CooldownTracker {
  canExecute(service: string, actionId: string, entry: PlaybookEntry): boolean
  recordAttempt(service: string, actionId: string): void
  getAttemptCount(service: string, actionId: string, windowMinutes: number): number
}
```

**Storage:** In-memory cache backed by SQLite `playbook_actions` table (so counts survive restarts).

**Escalation:** When `canExecute` returns `false` (cooldown exceeded), the orchestrator must escalate to AI analysis + human Telegram approval instead of retrying the automated fix.

---

## Phase 4 — Telegram Reporter

### TASK-017 — Telegraf bot setup with graceful shutdown

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** PRE-003

**File:** `src/reporter/telegram.ts`

Initialize Telegraf bot with long-polling (not webhook — simpler for VPS without domain).

```typescript
class TelegramReporter {
  constructor(token: string, chatId: string)
  async send(message: string): Promise<void>
  async sendWithButtons(message: string, buttons: InlineButton[]): Promise<void>
  async start(): Promise<void>
  async stop(): Promise<void>
}
```

**Graceful shutdown:** Register `SIGINT` and `SIGTERM` handlers to call `bot.stop()` before process exit. Prevents duplicate message delivery on restart.

**Error handling:** Catch `TelegramError` and log; never throw to caller (Telegram outages must not crash the monitor).

---

### TASK-018 — Report formatter with Markdown structure

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-002

**File:** `src/reporter/formatter.ts`

Produce structured Telegram Markdown v2 reports.

**Issue report format:**
```
🚨 *CRITICAL* | Container Scanner
Service: `supabase-db`
Status: stopped (was running)
Detected: 2026-04-05 14:32 UTC
Cycle ID: `abc123`

✅ *Auto-fixed*: Executed `docker start supabase-db`
Before: stopped | After: running
Duration: 4.2s
```

**Severity badges:** 🚨 CRITICAL, ⚠️ WARNING, ℹ️ INFO  
**Fix status:** ✅ Auto-fixed, 🤖 AI Proposed, ❌ Fix failed, 🔄 Cooldown — escalated  
**Scan summary:** Sent at end of each cycle with counts by severity.

---

### TASK-019 — Inline keyboard for AI proposals

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-017, TASK-018

**File:** `src/reporter/telegram.ts` (extend)

When an issue cannot be auto-fixed (no playbook match or cooldown exceeded), send a Telegram message with Approve/Reject inline buttons.

**Flow:**
1. Send formatted proposal (from TASK-022) with `[✅ Approve] [❌ Reject]` buttons
2. Register `bot.action('approve_<issueId>', ...)` callback
3. On approve: execute the proposed command (after forbidden check), report result
4. On reject: log rejection, mark issue as `human-rejected`
5. Timeout after 30 minutes: auto-reject with notification

**Callback data format:** `approve_<issueId>` / `reject_<issueId>` (max 64 chars per Telegram limit).

---

### TASK-020 — Fallback storage and retry queue

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-018

**File:** `src/reporter/fallback.ts`

When Telegram is unreachable, persist reports locally and retry when connectivity returns.

```typescript
class FallbackReporter {
  async queue(report: FormattedReport): Promise<void>  // writes to JSON file
  async flush(): Promise<void>   // attempts to send all queued reports
  async startRetryLoop(): Promise<void>  // polls every 5 min
}
```

**Storage:** `./reports-queue.json` (FIFO array of serialized reports)  
**Retry:** Every 5 minutes, attempt `flush()`. On success, clear sent entries.  
**Max queue:** 100 reports (drop oldest on overflow with a warning log).

---

## Phase 5 — Claude Code AI Bridge

### TASK-021 — Claude Code CLI bridge

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** PRE-002, TASK-004

**File:** `src/ai/bridge.ts`

Invoke Claude Code CLI in headless mode for analysis of unknown issues.

```typescript
interface AIAnalysis {
  rootCause: string;
  suggestedFix: { command: string; args: string[]; };
  riskAssessment: 'low' | 'medium' | 'high';
  confidence: number;  // 0-1
  reasoning: string;
}

async function analyzeIssue(issue: Issue, context: ScanResult): Promise<AIAnalysis>
```

**CLI invocation:**
```bash
claude --bare \
  --output-format json \
  --allowedTools "Bash,Read" \
  --max-turns 5 \
  --max-budget-usd 1.00 \
  -p "<structured prompt with issue details>"
```

**Prompt template:** Includes issue description, raw scanner data, recent logs snippet, system resource state, list of running containers. Instructs Claude to respond with JSON matching `AIAnalysis` schema.

**Parse:** Extract JSON from `--output-format json` response. Validate with zod.

---

### TASK-022 — Proposal formatter for AI analysis output

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-021, TASK-018

**File:** `src/ai/proposal.ts`

Convert `AIAnalysis` output into a human-readable Telegram proposal message.

**Format:**
```
🤖 *AI Analysis Required* | unknown issue
Service: `waha`

*Root Cause:* Container running out of memory due to webhook queue backup.

*Proposed Fix:*
Command: `docker restart waha`
Risk: 🟡 Medium | Confidence: 87%

*Reasoning:* Memory usage at 94%, restart will clear queue...

[✅ Approve] [❌ Reject]
```

Risk indicators: 🟢 Low, 🟡 Medium, 🔴 High

---

### TASK-023 — AI cost tracking per invocation

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-021, TASK-024

**File:** `src/ai/bridge.ts` (extend)

Log AI usage to SQLite for cost visibility.

**Per invocation, record:**
- Timestamp
- Issue ID that triggered analysis
- Model used (from CLI output metadata)
- Input tokens, output tokens
- Estimated cost (USD)
- Duration (ms)
- Success / failure

**Monthly summary:** Include in weekly Telegram digest. Alert if monthly spend exceeds configurable threshold (default: $5.00).

---

## Phase 6 — State Store & API

### TASK-024 — SQLite state store with 5 tables

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-002

**File:** `src/state/store.ts`

Initialize and manage the SQLite database using `better-sqlite3` (synchronous API, simpler for daemon use).

**Tables:**

```sql
CREATE TABLE scans (
  id TEXT PRIMARY KEY,
  started_at INTEGER,
  completed_at INTEGER,
  issue_count INTEGER,
  fix_count INTEGER
);

CREATE TABLE issues (
  id TEXT PRIMARY KEY,
  scan_id TEXT REFERENCES scans(id),
  source TEXT, service TEXT, severity TEXT,
  description TEXT, raw TEXT, detected_at INTEGER,
  resolved INTEGER DEFAULT 0
);

CREATE TABLE fixes (
  id TEXT PRIMARY KEY,
  issue_id TEXT REFERENCES issues(id),
  playbook_entry_id TEXT,
  action TEXT, before_state TEXT, after_state TEXT,
  success INTEGER, executed_at INTEGER, error TEXT
);

CREATE TABLE playbook_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service TEXT, action_id TEXT,
  executed_at INTEGER
);

CREATE TABLE ai_costs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issue_id TEXT, model TEXT,
  input_tokens INTEGER, output_tokens INTEGER,
  cost_usd REAL, duration_ms INTEGER,
  success INTEGER, timestamp INTEGER
);
```

Export typed query functions (not raw SQL) for use by other modules.

---

### TASK-025 — HTTP API via Fastify

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-024

**File:** `src/state/api.ts`

Fastify HTTP server exposing read-only query endpoints. Default port: 6020.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/status` | Current daemon status, uptime, last scan |
| GET | `/api/scans` | Recent scan history (last 50) |
| GET | `/api/issues` | Open issues (unresolved), filterable by severity |
| GET | `/api/fixes` | Recent fix history with success/failure |
| GET | `/api/playbook` | Loaded playbook entries (for inspection) |

All responses: `Content-Type: application/json`. No auth (localhost-only binding).

---

### TASK-026 — Health endpoint for UptimeRobot

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-025

**File:** `src/state/api.ts` (extend)

Add a lightweight health check endpoint suitable for external monitoring.

```
GET /api/health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "uptime": 86400,
  "lastScanAt": "2026-04-05T14:30:00Z",
  "lastScanAge": 1800,
  "openIssues": { "critical": 0, "warning": 2, "info": 1 },
  "version": "1.0.0"
}
```

**Degraded (200 with status: "degraded"):** If last scan is older than 2x the scan interval.  
**Down (503):** If database is unreadable or daemon is in fatal error state.

---

## Phase 7 — Watchpost Bridge

### TASK-027 — Watchpost bridge plugin scaffold

**Type:** TASK | **Priority:** P2 | **Status:** PLANNED | **Deps:** TASK-025

**File:** `bridge/index.ts`

Separate lightweight package in `bridge/` directory. Polls the Uatu HTTP API and syncs data to Watchpost (localhost:6010).

```typescript
interface BridgeConfig {
  uatuBaseUrl: string;      // default: http://localhost:6020
  watchpostBaseUrl: string; // default: http://localhost:6010
  pollIntervalMs: number;   // default: 60000 (1 min)
}

class UatuWatchpostBridge {
  async start(): Promise<void>
  async stop(): Promise<void>
  async poll(): Promise<void>
}
```

Runs as a separate process (or can be embedded). Graceful shutdown on SIGINT.

---

### TASK-028 — Auto-register Uatu in Watchpost registry

**Type:** TASK | **Priority:** P2 | **Status:** PLANNED | **Deps:** TASK-027

**File:** `bridge/index.ts` (extend)

On first run (or if not already registered), POST to Watchpost projects registry.

```typescript
async function ensureRegistered(config: BridgeConfig): Promise<void>
```

**POST to `localhost:6010/api/projects`:**
```json
{
  "name": "Uatu",
  "path": "/opt/uatu",
  "masterPlanPath": "/opt/uatu/MASTER_PLAN.md",
  "type": "monitoring-daemon"
}
```

**Idempotent:** Check `GET /api/projects` first; only register if Uatu is not already listed. Store registration state in `bridge/.registered` flag file.

---

### TASK-029 — Sync engine: issues to tasks, fixes to status

**Type:** TASK | **Priority:** P2 | **Status:** PLANNED | **Deps:** TASK-027, TASK-028

**File:** `bridge/sync.ts`

Map Uatu domain objects to Watchpost task concepts.

**Issue → Watchpost task:**
- New critical issue → `POST /api/task/add` with title `[Uatu] <description>` (max 80 chars)
- Task body contains full issue details, service, scanner source
- Track `issueId → watchpostTaskId` mapping in `bridge/sync-state.json`

**Fix applied → status update:**
- Successful fix → `POST /api/beads/close/<taskId>` (DONE)
- Failed fix → `POST /api/task/<taskId>/status` (BLOCKED)

**Issue resolved (gone in next scan) → close task:**
- If issue no longer appears in `GET /api/issues`, close the Watchpost task

---

## Phase 8 — Orchestrator

### TASK-030 — Main orchestrator loop

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-010, TASK-012, TASK-014, TASK-017, TASK-021, TASK-024

**File:** `src/index.ts`

The central coordinator that sequences all subsystems for each scan cycle.

**Sequence per cycle:**
1. `lockfile.acquire()` — abort if already running
2. Create `ScanCycle` record in SQLite (state: running)
3. `runAllScanners()` → `Issue[]`
4. Persist issues to SQLite
5. For each issue:
   a. `matchIssue(issue, playbook)` → entry or null
   b. If match and `cooldown.canExecute()` → `executeAction()` → record `Fix`
   c. If match but cooldown exceeded → `analyzeIssue()` → send Telegram proposal
   d. If no match → `analyzeIssue()` → send Telegram proposal
6. Send scan summary via Telegram
7. Update `ScanCycle` record (state: complete)
8. `lockfile.release()`

---

### TASK-031 — Internal 30-min scheduler with graceful shutdown

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-030

**File:** `src/index.ts` (extend)

Schedule recurring scans and handle process signals cleanly.

```typescript
class UatuDaemon {
  async start(): Promise<void>   // runs initial scan, starts interval
  async stop(): Promise<void>    // waits for current scan to complete
}
```

**Scheduler:** `setInterval` with 30-minute default (configurable via `SCAN_INTERVAL_MINUTES`).

**Startup:** Run an immediate scan on `start()` (don't wait 30 min for first data).

**Shutdown:** On `SIGINT`/`SIGTERM`, set a shutdown flag. If mid-scan, wait for current cycle to complete (max 10 min), then exit cleanly. This prevents partial state writes.

---

### TASK-032 — Per-stage error isolation in scan cycle

**Type:** TASK | **Priority:** P0 | **Status:** PLANNED | **Deps:** TASK-030

**File:** `src/index.ts` (extend)

Wrap each major stage of the orchestrator loop in independent try/catch blocks.

**Isolation boundaries:**
- Scanner aggregator failure → log + send Telegram alert + continue to next cycle
- Playbook executor failure for issue N → log + continue to issue N+1
- AI bridge failure → log + send "manual review needed" Telegram alert
- Telegram reporter failure → log + write to fallback (TASK-020)
- SQLite write failure → log to stderr (best-effort persistence)

**Principle:** A failure in any single component must not prevent the rest of the cycle from completing.

---

## Phase 9 — Deployment

### TASK-033 — systemd unit file

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-031

**File:** `infra/uatu.service`

```ini
[Unit]
Description=Uatu — VPS Monitoring & Self-Healing Daemon
After=network.target docker.service
Wants=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/uatu
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=uatu
EnvironmentFile=/opt/uatu/.env

[Install]
WantedBy=multi-user.target
```

**Notes:**
- Runs as root (required for docker commands and system introspection)
- `EnvironmentFile` points to Doppler-injected env or static `.env`
- Logs to journald (queryable via `journalctl -u uatu -f`)

---

### TASK-034 — Install script: SSH copy, npm ci, systemd

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-033

**File:** `infra/install.sh`

One-command deploy from local machine to VPS.

**Steps:**
1. `rsync -av --exclude node_modules --exclude dist ./ root@84.46.253.137:/opt/uatu/`
2. SSH: `cd /opt/uatu && npm ci --production`
3. SSH: `cd /opt/uatu && npm run build`
4. SSH: `cp infra/uatu.service /etc/systemd/system/`
5. SSH: `systemctl daemon-reload && systemctl enable uatu && systemctl start uatu`
6. SSH: `systemctl status uatu` (verify running)
7. SSH: `journalctl -u uatu -n 50` (show initial logs)

**Prerequisites check:** Verify Node.js ≥ 18, npm, docker available on VPS before proceeding.

---

### TASK-035 — Doppler config: Uatu project and secrets

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** PRE-003

**File:** Documented in `CLAUDE.md`

Create a dedicated Doppler project for Uatu secrets management.

**Doppler project:** `uatu`  
**Config:** `production`

**Secrets to configure:**
| Key | Description |
|-----|-------------|
| `TELEGRAM_BOT_TOKEN` | From @BotFather (PRE-003) |
| `UATU_CHAT_ID` | Target Telegram chat ID (PRE-003) |
| `ANTHROPIC_API_KEY` | For Claude Code CLI bridge |
| `UATU_PORT` | HTTP API port (default: 6020) |
| `DB_PATH` | SQLite file path (default: /opt/uatu/uatu.sqlite) |
| `SCAN_INTERVAL_MINUTES` | Scan frequency (default: 30) |

**Injection:** Update `infra/install.sh` to use `doppler run -- node dist/index.js` in the systemd `ExecStart`, or pre-inject to `.env` file on the VPS.

---

### TASK-036 — UptimeRobot monitor setup (manual)

**Type:** TASK | **Priority:** P1 | **Status:** PLANNED | **Deps:** TASK-026

Manual step performed in UptimeRobot dashboard after TASK-026 is deployed.

**Monitor configuration:**
- Type: HTTP(s)
- URL: `http://84.46.253.137:6020/api/health`
- Interval: 5 minutes
- Alert contacts: Email + Telegram (the Uatu bot)
- Keyword check: response must contain `"status":"ok"` or `"status":"degraded"`

**Why:** Provides external monitoring of Uatu itself (watches the Watcher). If Uatu crashes and can't self-report, UptimeRobot alerts via independent channel.

---

## Phase 10 — Testing

### TASK-037 — Scanner unit tests with mocked commands

**Type:** TASK | **Priority:** P2 | **Status:** PLANNED | **Deps:** TASK-010

**File:** `tests/scanner.test.ts`

Unit tests for all four scanners using Vitest. Mock the `shell()` utility to return pre-defined command outputs.

**Container scanner tests:**
- Mock `docker ps -a` with a stopped container → assert `severity: critical` issue
- Mock `docker inspect` with `unhealthy` health status → assert issue
- All containers healthy → assert empty issue list

**Resource scanner tests:**
- Mock `free -m` at 92% RAM → assert `severity: critical`
- Mock `df -h` at 87% disk → assert `severity: warning`
- All within thresholds → assert empty

**Endpoint scanner tests:**
- Mock `fetch` returning 503 → assert `severity: critical`
- Mock connection refused → assert issue
- All 200 OK → assert empty

**Log scanner tests:**
- Mock docker logs containing "OOM killed" → assert `severity: critical`
- Mock journal with ERROR lines → assert warning issues

---

### TASK-038 — Playbook unit tests

**Type:** TASK | **Priority:** P2 | **Status:** PLANNED | **Deps:** TASK-016

**File:** `tests/playbook.test.ts`

Unit tests for the playbook engine components.

**Loader tests:**
- Valid YAML → parses without error
- Missing required field → throws descriptive zod error
- Invalid action type → throws

**Matcher tests:**
- Stopped container → matches `restart-stopped-container` entry
- Disk > 85% → matches `truncate-docker-logs`
- Unknown issue → returns null

**Cooldown tests:**
- First attempt → allowed
- 3rd attempt within window → allowed
- 4th attempt within window → denied (escalate)
- Attempt after window expires → allowed again

**Forbidden operations tests:**
- `rm -rf /` → `isForbidden` returns true
- `docker start waha` → `isForbidden` returns false
- `doppler run` → `isForbidden` returns true

---

### TASK-039 — Integration test: full scan cycle mocked

**Type:** TASK | **Priority:** P2 | **Status:** PLANNED | **Deps:** TASK-030

**File:** `tests/integration.test.ts`

End-to-end test of the full orchestrator cycle with all external calls mocked.

**Scenario:** Stopped container detected → playbook match → execute fix → Telegram report sent

**Mocks:**
- `shell()` → returns stopped container from docker ps, then running after restart
- `fetch()` for endpoints → 200 OK
- Telegram `sendMessage()` → captured for assertion
- SQLite → in-memory (`:memory:`) database

**Assertions:**
1. Scan detects the stopped container issue
2. Playbook matches `restart-stopped-container`
3. `executeAction` called with correct container name
4. Fix recorded in SQLite with `success: true`
5. Telegram message sent containing container name and "Auto-fixed"
6. ScanCycle recorded as complete in SQLite

---

### TASK-040 — E2E test on VPS (manual verification)

**Type:** TASK | **Priority:** P2 | **Status:** PLANNED | **Deps:** TASK-034

Manual end-to-end verification on the live VPS after deployment.

**Steps:**
1. Deploy Uatu via `infra/install.sh`
2. Verify `systemctl status uatu` shows active/running
3. Stop a non-critical container: `docker stop waha`
4. Wait for next scan cycle (or trigger via `systemctl restart uatu` for immediate scan)
5. Verify: Uatu detects stopped container in logs (`journalctl -u uatu -f`)
6. Verify: Uatu executes `docker start waha` automatically
7. Verify: Telegram message received with issue description and fix confirmation
8. Verify: `GET /api/issues` returns resolved issue
9. Verify: `GET /api/fixes` shows successful fix record
10. Verify: Container is running again (`docker ps | grep waha`)

**Pass criteria:** All 10 steps verified without manual intervention.

---

## Architecture Notes

### Component Dependency Graph

```
PRE-001, PRE-002, PRE-003
         ↓
TASK-001 (scaffold)
         ↓
TASK-002 (types) → TASK-003 (config) → TASK-004 (shell) → TASK-005 (lockfile)
         ↓                                    ↓
TASK-006..009 (scanners) ──────────→ TASK-010 (aggregator)
                                              ↓
TASK-011..015 (playbook) ──────────→ TASK-016 (cooldown)
         ↓                                    ↓
TASK-024 (SQLite) ─────────────────→ TASK-025..026 (API)
         ↓
TASK-017..020 (Telegram) → TASK-021..023 (AI bridge)
         ↓
TASK-030..032 (orchestrator) → TASK-033..036 (deployment)
         ↓
TASK-027..029 (Watchpost bridge)
         ↓
TASK-037..040 (tests)
```

### Operational Boundaries

| Uatu CAN do automatically | Uatu MUST ask human |
|--------------------------|---------------------|
| Restart stopped containers | Any action hitting forbidden list |
| Truncate/rotate logs | Cooldown-exceeded actions |
| Vacuum journalctl | Unknown issues (AI proposes, human approves) |
| Restart on endpoint failure | Any SQL database operations |

### Port Map

| Port | Service |
|------|---------|
| 6010 | Watchpost API |
| 6020 | Uatu HTTP API (default) |
| 8000 | WAHA (monitored) |
| 3050 | Supabase Studio (monitored) |
| 80/443 | Caddy (monitored) |
