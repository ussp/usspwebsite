# Dave Meeting — Apr 22, 2026

> **Attendees:** Dave (Deputy CIO, DoIT), Romi, Vinay
> **Purpose:** Clear 3 governance blockers, walk pilot plan
> **Status:** ✅ Done · follow-up email sent to Dave
> **Related:** `planning/meeting-prep/dave-meeting-agenda-apr22.md`

---

## Headline outcomes

1. **Dave meeting completed.** Follow-up email sent.
2. **Next action (Vinay → Dave):** send DoIT 30-day notice starting email — G3.
3. **New constraint surfaced:** Microsoft Copilot cannot access external sources (no web search / no browsing outside the State tenant).

---

## Tool limitation — "Copilot can't go outside"

Dave's point (paraphrased): the State-authorized Microsoft Copilot is **sandboxed to the State tenant**. It cannot pull from the open web, cannot run live web search, and cannot retrieve external documents, news, or third-party sites.

### What this means in practice

| Capability | State Copilot | Notes |
|------------|---------------|-------|
| Answer from State tenant data (M365 docs, Teams, Outlook, SharePoint) | ✅ Yes | Grounded on user's accessible tenant content |
| Answer from Dataverse / D365 records | ✅ Yes | When Copilot is enabled there |
| Web search / open-web grounding | ❌ No | Disabled at tenant policy level |
| Fetch external URL supplied by user | ❌ No | Blocked |
| Summarize a public article | ❌ No | Unless the content is already inside the tenant |
| Current events / news | ❌ No | Model training data only; no live web |
| Public documentation lookup (e.g., Microsoft Learn) | ❌ No | Via Copilot — use a browser instead |

### Implications by role / tool

- **M365 Copilot (BAs, SMs, Leadership):** great for email drafting, summarizing Teams/SharePoint, rewriting stories — but don't expect live research. Training must call this out explicitly.
- **GitHub Copilot (Developers):** already does not browse; uses model weights + codebase context. Same limitation, different reason.
- **Atlassian Rovo (BA/SM/Tester):** grounded on JIRA + Confluence — different product but similar "stays inside your tenant" posture. Confirm Rovo's web behavior separately.
- **D365 Copilot (Configuration):** grounded on Dataverse. Same sandbox.
- **Power BI Copilot:** grounded on your dataset. Same sandbox.

### Open questions (need verification)

1. Is this a **State-wide DoIT policy**, or a DCFS tenant configuration? (affects whether it's changeable per tenant)
2. Does the State block the "web grounding" toggle that Microsoft introduced for M365 Copilot in 2024 (Bing-backed)?
3. Does it also apply to **Copilot Chat** in Edge (work mode)?
4. What about **GitHub Copilot Chat's `@web` / code-search** features — blocked or allowed?
5. Does the restriction cover Copilot Studio-built agents that call external connectors?

### Action items from this finding

- [ ] Update `tool-authorization-list.md` with a "Tool Limitations" section (done in same commit).
- [ ] Add training-module item: **"What Copilot can't do"** — prevents wasted prompts / user frustration.
- [ ] Draft a 1-page "Copilot boundaries" cheat sheet for every pilot participant — ships with Foundation session.
- [ ] Email Dave to confirm exact scope of the restriction (tenant policy text, toggles, exceptions).
- [ ] Revisit the BA / Developer / Tester playbooks — remove any step that assumes web retrieval.

---

## Other items from the meeting (to fill in as memory allows)

- DoIT 30-day notice — Dave to identify owner and template; Vinay sends starting email today
- Section 5e determination — pending
- Tool availability (Copilot tier, Rovo tier, M365 Copilot, D365 Copilot) — pending Dave check
- Pilot Governance Lead — may be Dave himself

---

## Link back

- Agenda used: `planning/meeting-prep/dave-meeting-agenda-apr22.md`
- Deck used: `planning/meeting-prep/dave-meeting-deck-content-apr22.md`
- Tracker: `planning/open-tasks-v04222026.md` — rows G3–G7 still open post-meeting
