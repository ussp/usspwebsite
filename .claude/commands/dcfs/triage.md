---
name: DCFS Email Triage
description: Catch up on DCFS-related email — pulls last 24-48h, groups by sender, surfaces priorities and action items
category: DCFS
tags: [dcfs, email, triage]
---

# DCFS Triage

Goal: give Vinay a fast morning catch-up on DCFS-thread email so he can start the day knowing what's urgent, what's waiting on him, and what's just FYI.

## Account context

- Mailbox: `vinay.lagisetty@krasanconsulting.com` (Krasan / DCFS engagement)
- Use the `ms365` MCP tools — verify auth first with `mcp__ms365__verify-login` if uncertain

## Key contacts (treat as DCFS-thread signal)

**Krasan side:**
- Jeffrey Lobo (`Jeffrey.Lobo@krasanconsulting.com`)
- Robert Rodriguez (`Robert.Rodriguez@krasanconsulting.com`)
- Romi Kovacs / Emil Kovacs (`Emil.Kovacs@krasanconsulting.com`) — Engagement Director
- Alec Granderson (`Alec.Granderson@krasanconsulting.com`) — PM owner for DCFS scheduling/status
- Krishna Mekala (`Krishna.Mekala@krasanconsulting.com`)
- Chase Yeung (`Chase.Yeung@krasanconsulting.com`)
- Dinkar Karumuri (`dinkar@krasanconsulting.com`)
- John Luna (`John.Luna@krasanconsulting.com`)
- Matthew Tomeo (`Matthew.Tomeo@krasanconsulting.com`)

**State of Illinois side (illinois.gov):**
- Jeffrey Lobo (`jeffrey.lobo@illinois.gov`)
- Chase Yeung (`chase.m.yeung@illinois.gov`)
- Krishna Mekala IL (`Krishna.Mekala@Illinois.gov`)
- Matthew Tomeo (`matthew.tomeo@illinois.gov`)

**DCFS leadership (priority — flag explicitly):**
- DCFS CIO (Jim Daugherty)
- Deputy CIO Data Management (David Nika)

## Steps

1. **Fetch:** use `mcp__ms365__list-mail-messages` with `$top=25`, `orderby=receivedDateTime desc`, `select=id,subject,from,toRecipients,receivedDateTime,bodyPreview,isRead,hasAttachments`. Cover the last 48h unless the user gave a different window in `$ARGUMENTS`.

2. **Filter to DCFS-relevant:** keep emails where the sender or any recipient is in the contact list above, OR the subject mentions DCFS / ILC / IllinoisConnect / pilot / governance / 30-day / DoIT / CCWIS / CANTS / AI Rollout. Drop everything else (newsletters, IT notifications, Microsoft sales).

3. **Group by sender** (or thread). For each group, summarize each email in **one sentence** — what it asks or says, not its history.

4. **Tag priorities:**
   - `[CIO]` — anything from/about the DCFS CIO or Deputy CIO
   - `[ASK]` — direct ask of Vinay (question, decision needed, document review)
   - `[FYI]` — informational, no action expected
   - `[OVERDUE]` — received >48h ago and Vinay hasn't replied (use `mcp__ms365__list-mail-messages` to check Sent items if needed)

5. **Extract action items** Vinay specifically owns. List as bullets at the bottom: who asked, what's needed, by when (if stated).

6. **Output format** (markdown to terminal, do not save unless asked):

   ```
   # DCFS Triage — <date>

   ## Priority
   - [CIO] [sender] — [one-sentence summary]
   - [ASK] [sender] — [...]

   ## Other DCFS thread
   ### From [sender] (N emails)
   - [Subject] — [one-sentence summary] [tag]

   ## Action items for Vinay
   - [Who] asked [what], by [when]
   ```

7. **Do not** send replies, mark anything read, or modify state. Triage is read-only.

## Argument hints

- `$ARGUMENTS` may contain a window like `last 7 days` or `since Monday` or a focus like `from Jeffrey only`. Honor it; default is "last 48h, all DCFS contacts".

## Out of scope for this skill

- Drafting replies → use `/dcfs:reply`
- Meeting prep → use `/dcfs:prep`
- Scheduled background runs → see `clients/dcfs-ilc/playbooks/claude-code-m365-email-setup.md` Step 5
