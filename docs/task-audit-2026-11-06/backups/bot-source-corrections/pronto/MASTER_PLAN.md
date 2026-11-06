# Pronto Master Plan

Updated: 2026-08-02

## Objective

Build a trustworthy conversational planning agent that uses FlowState as its
database and lets the user continuously reshape a plan without losing context,
creating duplicate tasks, or silently changing authoritative data.

## Architecture decision

Use LangGraph for the bounded conversation and planning state machine, Pydantic
models for typed boundaries, and a small API/transport layer for the first user
surface. Use FlowState's existing Supabase/PostgreSQL database for authoritative
tasks plus Pronto's namespaced planning sessions, revisions, proposals, events,
and checkpoints.

Do not copy Hermes' generic conversation loop, gateway lifecycle, or overlapping
Personal Assistant UI. Reuse the existing Personal Assistant durable-state,
idempotency, replay, adapter, reconciliation, and regression patterns where
they fit the new boundaries.

## Task lanes

### PRONTO-001 — Clean foundation

Status: planned

Create the standalone project, dependency policy, environment contract, local
test harness, and project-level safety rules. No FlowState writes or model-driven
side effects are allowed in this lane.

Acceptance: a fresh checkout installs, starts a health endpoint, runs the unit
suite, and fails closed when required database configuration is absent.

### PRONTO-002 — FlowState read boundary

Status: planned

Implement a typed, read-only adapter over FlowState's canonical task/project,
calendar, and workspace reads. Capture source timestamps, identifiers, and
read receipts so every planning proposal can explain which facts it used.

Acceptance: generated fixtures and a real read-only FlowState probe produce the
same normalized snapshot shape; no Pronto code writes task records directly.

### PRONTO-003 — Durable planning domain

Status: planned

Define planning sessions, task snapshots, plan documents, revisions, proposals,
conversation turns, decisions, and synchronization receipts. Store them in
FlowState's database under a Pronto namespace with workspace/user isolation.

Acceptance: revisions are append-only, current state can be reconstructed,
accepted changes are idempotent, and an interrupted session can be resumed from
its last committed revision.

### PRONTO-004 — Conversational planning graph

Status: planned

Build the LangGraph flow for message classification, authoritative reload,
constraint extraction, plan proposal, user discussion, revision, and rendering.
The graph must pause for user feedback instead of treating silence or model
confidence as approval.

Acceptance: the user can turn a large task inventory into a plan, ask for a
different grouping or format, reorder priorities, split/merge/defer work, and
undo the last accepted revision without losing the conversation lineage.

### PRONTO-005 — Approved FlowState write-back

Status: planned

Add proposal previews and explicit approval for task creation, edits, dates,
priority changes, completion, and archive actions. Route writes through
FlowState's canonical validation/RPC boundary and record the result as a
receipt; reject stale snapshots and duplicate submissions.

Acceptance: rejected, edited, duplicated, stale, and partially failed writes
leave no ambiguous task state and can be reconciled from authoritative readback.

### PRONTO-006 — User surface and recovery proof

Status: planned

Add the smallest conversational surface, then test clean startup, process crash,
database retry, browser/transport reconnect, concurrent user messages, and
FlowState changes made outside Pronto. Preserve visible plan output and a
machine-readable evidence receipt for every scenario.

Acceptance: restart resumes the same planning session without replaying a user
message or duplicating a revision; external FlowState edits are detected before
the next proposal; no raw transport or model errors reach the user.

### PRONTO-007 — Trust promotion gate

Status: planned

Run repeated generated and real-data journeys, including task mountains,
conflicting deadlines, stale context, interruptions, undo, and approved writes.
Promote only after the same invariants pass across consecutive clean runs.

Acceptance: evidence shows zero duplicate accepted revisions, zero unapproved
writes, deterministic restart recovery, authoritative readback agreement, and
clear handling of unknown or conflicting facts.

## Explicit non-goals for v1

- Autonomous email/message sending.
- Calendar mutation without a separate approval lane.
- General-purpose computer use.
- Multi-agent delegation or agent swarms.
- Recreating Hermes' gateway or desktop runtime.
