---
name: DCFS Email Reply
description: Draft a reply to a recent DCFS thread — matches tone from past correspondence, saves to drafts, never auto-sends
category: DCFS
tags: [dcfs, email, draft]
---

# DCFS Email Reply

Goal: draft a high-quality reply to a recent DCFS-thread email. Save as a draft. Never auto-send.

## Account context

- Mailbox: `vinay.lagisetty@krasanconsulting.com`
- Use the `ms365` MCP tools

## Steps

1. **Identify the target email from `$ARGUMENTS`:**
   - If a person is named (e.g. `Jeffrey`, `David`, `Romi`), find the latest unanswered email FROM them
   - If a subject/keyword is given (e.g. `governance charter`, `30-day notice`), search subject and pick the most recent thread
   - If `$ARGUMENTS` includes the desired reply content (e.g. `to Jeffrey: yes Option B works`), use that as the body intent
   - If nothing is given, list the 5 most recent unanswered DCFS-thread emails and ask which one
   - Use `mcp__ms365__list-mail-messages` with `$search` and `$filter`

2. **Determine "unanswered":**
   - For the target email's `conversationId`, check Sent Items via `mcp__ms365__list-mail-messages` with `$filter` on conversationId
   - If Vinay has not sent in this thread since the target email's `receivedDateTime`, it's unanswered

3. **Read the thread context:**
   - Get the full body of the latest 1-3 messages in the thread with `mcp__ms365__get-mail-message`
   - Note: who's CC'd, what was asked, what's been promised, what's outstanding

4. **Tone matching — read past Vinay-sent emails to this person/group:**
   - Pull 3-5 prior sent emails from Vinay to the same recipient(s)
   - Note: signature style, opening phrasing, formality level, typical length, use of bullet points vs prose
   - Match that tone in the draft

5. **Draft the reply:**
   - Address the actual asks/questions in the target email
   - If `$ARGUMENTS` specified intent, use that as the substantive content
   - Keep it short — Vinay's pattern from past correspondence
   - End with the appropriate signature he typically uses
   - Use HTML body content (`contentType: "html"`) — Graph mangles plain text in some clients

6. **Save as draft using `mcp__ms365__create-reply-draft`** (NOT `send-mail`):
   - This creates a draft in the Drafts folder linked to the original message
   - Vinay can open Outlook/OWA, review, edit, and send manually
   - **Never use `send-mail` from this skill** unless the user explicitly types "send it now" in `$ARGUMENTS`

7. **Output to terminal:**
   - The full draft text (so user can review without opening Outlook)
   - Confirmation that it's saved to Drafts
   - A reminder: "Open in Outlook → Drafts to review and send"

## Tone & professionalism rules

- **Doc Professionalism Rule:** in client-facing emails, use generic project-objective language. No attributing decisions to specific people unless that's accurate and necessary.
- **Account Head Rule:** Romi owns high-level DCFS client interactions. If the email is from Jim/David and substantive, suggest Vinay loop Romi or have Romi reply directly.
- **Alec PM Rule:** if the email is about scheduling, status, or PM logistics, suggest forwarding to Alec.
- **Owner TBD Rule:** if Vinay is being asked to commit to ownership of something unclear, don't blindly accept — draft "TBD pending discussion with [Romi/Alec]" or similar.

## Argument patterns

- `$ARGUMENTS = "Jeffrey"` → reply to latest unanswered Jeffrey email; let Claude infer content
- `$ARGUMENTS = "Jeffrey: confirm Option B works"` → reply to Jeffrey with that intent
- `$ARGUMENTS = "governance charter thread"` → reply to latest unanswered email in that subject thread
- `$ARGUMENTS = "Jim with status update"` → reply to Jim, content = status update (pull recent metrics/progress notes from local repo)
- `$ARGUMENTS = ""` → list 5 unanswered DCFS threads and ask

## Critical: never auto-send

This skill writes drafts, not sent emails. Vinay reviews and sends from Outlook. The only exception is if the user types `"send it now"` literally in arguments — and even then, confirm once before calling `send-mail`.

## Out of scope

- Triage of inbox → use `/dcfs:triage`
- Meeting prep → use `/dcfs:prep`
- Forwarding (different action) → ask Vinay if forward is wanted, then use `mcp__ms365__create-forward-draft`
