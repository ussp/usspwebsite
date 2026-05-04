---
name: DCFS Meeting Prep
description: Prepare for a DCFS meeting — finds the calendar event, pulls relevant email thread, summarizes context, saves prep notes
category: DCFS
tags: [dcfs, calendar, email, meeting]
---

# DCFS Meeting Prep

Goal: turn an upcoming DCFS-related meeting into a 1-page prep doc Vinay can skim 5 minutes before walking in.

## Account context

- Mailbox & calendar: `vinay.lagisetty@krasanconsulting.com`
- Use the `ms365` MCP tools for both calendar and mail

## Steps

1. **Resolve the meeting from `$ARGUMENTS`:**
   - If a specific date is given (e.g. `tomorrow`, `Friday`, `2026-04-29`, `next Tue`), resolve to a date and look at events that day
   - If a topic/keyword is given (e.g. `governance touchpoint`, `David`, `DCFS AI`), search calendar by subject
   - If nothing is given, list today's and tomorrow's DCFS-related events and ask which one
   - Use `mcp__ms365__list-calendar-events` with appropriate `$filter` on `start/dateTime`, `$select=subject,start,end,attendees,bodyPreview,onlineMeeting,id`

2. **Filter to DCFS-relevant events** — subject contains DCFS / ILC / IllinoisConnect / pilot / governance / 30-day / DoIT / Krasan / "AI Rollout", OR an attendee email matches the DCFS contact list (see `/dcfs:triage` for the list). Skip personal/internal-USSP meetings.

3. **Pull the originating email thread:**
   - Use the meeting subject as a search query against email (`mcp__ms365__list-mail-messages` with `$search`)
   - Also search by attendee email addresses if subject is generic
   - Find the most recent email exchange that matches the meeting topic
   - Get the full body of the latest 1-3 messages in the thread (`mcp__ms365__get-mail-message`)

4. **Cross-reference local docs:**
   - If the topic mentions "governance" or "charter": check `clients/dcfs-ilc/planning/deliverables/governance/` for active docs
   - If "metrics" or "KPI": check `clients/dcfs-ilc/planning/deliverables/metrics/`
   - If "30-day notice" or "DoIT": check `clients/dcfs-ilc/planning/deliverables/governance/doit-30day-notice-*`
   - If "playbook": check `clients/dcfs-ilc/planning/deliverables/playbooks/`
   - If a meeting-prep file already exists for this date in `clients/dcfs-ilc/planning/meeting-prep/`, surface it

5. **Build the prep doc** at `clients/dcfs-ilc/planning/meeting-prep/<YYYY-MM-DD>-<short-topic>.md`:

   ```markdown
   # Meeting Prep — <Subject>

   **When:** <date> <start time>–<end time> (timezone)
   **Where:** <Teams link or location>
   **Attendees:** <comma-separated names>

   ## Context (from email thread)
   <2-4 sentences summarizing the most recent exchange>

   ## Open items / decisions needed
   - <bullet 1>
   - <bullet 2>

   ## Vinay's role in this meeting
   <1-2 sentences — listening, presenting, deciding, etc.>

   ## Suggested talking points
   - <bullet>
   - <bullet>

   ## Linked artifacts
   - <relative path to relevant deliverables, with one-line note on each>

   ## Quick decisions queue
   <Anything from past threads still pending Vinay's response — surface here so he can decide on the spot>
   ```

6. **Tone & professionalism rules** (read these before writing):
   - **Doc Professionalism Rule:** no named attributions in client-shareable docs. Internal prep is fine to name people.
   - **Owner TBD Rule:** if ownership of an action item is unclear, write "TBD" — don't guess.
   - **Account Head Rule:** Romi owns high-level DCFS client interactions (Jim, David). Reflect that in role framing.
   - **Alec PM Rule:** Alec owns PM tasks (scheduling, status, risk).

7. **Output:** print the path to the saved prep doc + a 3-line preview at the top so Vinay knows what's in it without opening the file.

## Argument hints

- `$ARGUMENTS` examples: `tomorrow`, `Friday governance touchpoint`, `2026-04-29 14:00`, `next David sync`
- If empty, default to "next DCFS-related meeting on the calendar"

## Out of scope

- Sending email about the meeting → not this skill
- Drafting replies that came up during prep → use `/dcfs:reply`
- Triage of unrelated email → use `/dcfs:triage`
