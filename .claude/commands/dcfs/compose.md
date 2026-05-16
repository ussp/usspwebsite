---
name: DCFS Email Compose
description: Compose a new DCFS email from scratch — resolves recipient(s), drafts subject + body in Vinay's tone, saves to drafts, never auto-sends
category: DCFS
tags: [dcfs, email, draft, compose]
---

# DCFS Email Compose

Goal: draft a high-quality NEW email (not a reply) on a DCFS topic. Save as a draft. Never auto-send.

## Account context

- Mailbox: `vinay.lagisetty@krasanconsulting.com`
- Use the `ms365` MCP tools

## When to use this vs other DCFS commands

- **New thread, no existing email to reply to** → this command
- **Reply to a received email** → `/dcfs:reply`
- **Forward a received email** → ask first, then use `mcp__ms365__create-forward-draft`
- **Catch up on inbox** → `/dcfs:triage`
- **Meeting prep** → `/dcfs:prep`

## Steps

1. **Parse intent from `$ARGUMENTS`:**
   - Common shape: `to <person(s)> about <topic>` or `to <person> with <content>`
   - Examples:
     - `to Jeffrey about D365 enablement timeline`
     - `to Jim with weekly status`
     - `to Krishna, Romi about Microsoft FastTrack engagement`
   - If `$ARGUMENTS` is empty, ask: "Who's the recipient and what's the topic?"

2. **Resolve recipient(s) to email address(es):**
   - DCFS engagement contacts have multiple addresses (krasan + illinois.gov). Resolve by searching prior correspondence.
   - Use `mcp__ms365__list-mail-messages` with `$search="from:<name>"` or `$search="to:<name>"` to find the right address(es).
   - Default convention from recent threads: include BOTH the krasan and illinois.gov addresses for DCFS folks (Jeffrey, Krishna, Emil, John) unless context suggests otherwise.
   - If multiple people match, list them and ask.
   - Quick reference (verify before using — addresses may have changed):
     - **Jim Daugherty** (CIO) — illinois.gov address
     - **David Nika** (Deputy CIO) — David.Nika@illinois.gov
     - **Jeffrey Lobo** — Jeffrey.Lobo@krasanconsulting.com + Jeffrey.Lobo@illinois.gov
     - **Krishna Mekala** — Krishna.Mekala@krasanconsulting.com + Krishna.Mekala@illinois.gov
     - **Romi** (Emil Kovacs, Krasan Account Head) — Emil.Kovacs@krasanconsulting.com
     - **Alec** (Krasan PM) — Alec.Granderson@krasanconsulting.com
     - **Robert Rodriguez** — Robert.Rodriguez@krasanconsulting.com
     - **Matt Tomeo** — Matthew.Tomeo@krasanconsulting.com

3. **Pull context from the local repo if topic-relevant:**
   - The DCFS project lives at `D:\Code\ussp\clients\dcfs-ilc\`
   - For status updates → check `planning/deliverables/metrics/`, `meeting-notes/status/`
   - For governance → `planning/deliverables/governance/`
   - For tool/Copilot questions → `planning/deliverables/strategy/tool-authorization-list.md`
   - For pilot plan → `planning/rollout-plan.md`
   - Open questions tracker → `planning/open-tasks-v20260423.md`
   - Use `Read` / `Grep` to pull only what's relevant; don't dump.

4. **Tone matching — read prior Vinay-sent emails to this recipient:**
   - Pull 3-5 prior sent emails from Vinay TO this person/group via `mcp__ms365__list-mail-messages` with `$search="from:vinay.lagisetty AND to:<recipient>"`.
   - Note: opening style ("Hi <name>," vs "<name>," vs "Team,"), formality, length, bullet vs prose, sign-off.
   - Match that tone.

5. **Draft a clear subject line:**
   - Pattern from existing DCFS correspondence: `DCFS AI Pilot — <specific topic>` or `<specific deliverable name>` (e.g., "DCFS AI Pilot — metrics proposal for review").
   - Avoid generic subjects ("Quick question", "Follow-up").

6. **Draft the body:**
   - Lead with the ask or purpose in the first sentence.
   - Match Vinay's signature length: typically short (3-6 sentences), bullet lists only when listing concrete items.
   - End with the appropriate sign-off ("Vinay" for short notes, "Regards / Vinay Lagisetty" for more formal — pick based on prior-correspondence tone).
   - Use HTML body content (`contentType: "html"`) — Graph mangles plain text in some clients.

7. **Save as draft using `mcp__ms365__create-draft-email`** (NOT `send-mail`):
   - This creates a draft in the Drafts folder.
   - Vinay can open Outlook/OWA, review, edit, and send manually.
   - **Never use `send-mail` from this skill** unless the user explicitly types "send it now" in `$ARGUMENTS` — and even then, confirm once.

8. **Output to terminal:**
   - The full draft text (subject + body, so user can review without opening Outlook)
   - To/Cc recipients used
   - Confirmation that it's saved to Drafts
   - A reminder: "Open in Outlook → Drafts to review and send"

## Tone & professionalism rules

- **Doc Professionalism Rule:** in client-facing emails, use generic project-objective language. No attributing decisions to specific people unless that's accurate and necessary.
- **Account Head Rule:** Romi owns high-level DCFS client interactions. If the email is going to Jim or David and is substantive (strategic decisions, escalations, scope changes), suggest either:
  - Vinay loops Romi via cc, OR
  - Romi sends it directly (offer to draft for Romi to forward)
- **Alec PM Rule:** if the email is about scheduling, status, or PM logistics, suggest Alec is the appropriate sender or cc.
- **Owner TBD Rule:** if drafting commits Vinay to ownership of something unclear, write "TBD pending discussion with [Romi/Alec]" rather than blindly accepting.

## Argument patterns

- `$ARGUMENTS = "to Jeffrey about D365 enablement"` → To: Jeffrey (both addresses), topic = D365 enablement, infer content from project context
- `$ARGUMENTS = "to Jim with status update"` → To: Jim, content = status update pulled from local repo (metrics, recent progress)
- `$ARGUMENTS = "to Krishna, Romi cc Alec about FastTrack questions"` → multi-recipient with cc
- `$ARGUMENTS = "to Romi: here are the open questions for Microsoft"` → To: Romi, body uses provided intent as substantive content
- `$ARGUMENTS = ""` → ask "who's the recipient and what's the topic?"

## Critical: never auto-send

This skill writes drafts, not sent emails. Vinay reviews and sends from Outlook. The only exception is if the user types `"send it now"` literally in arguments — and even then, confirm once before calling `send-mail`.

## Out of scope

- Reply to existing thread → use `/dcfs:reply`
- Forward an email → ask Vinay if forward is wanted, then use `mcp__ms365__create-forward-draft`
- Triage of inbox → use `/dcfs:triage`
- Meeting prep → use `/dcfs:prep`
