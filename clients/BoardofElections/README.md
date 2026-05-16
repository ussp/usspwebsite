# Illinois State Board of Elections (ILSBE / BOE)

Krasan client — AI advisory on website modernization.

## Engagement snapshot

- **Client:** Illinois State Board of Elections (referred to as **SBE**, **ILSBE**, or **BOE**)
- **Krasan project:** SBE Website Modernization (in progress; not originally AI-scoped)
- **AI trigger:** UI/UX requirement sessions surfaced client inquiries about simple search + pluggable AI (chatbot / popup) for site navigation
- **Direction:** RAG (Retrieval-Augmented Generation) over approved content — "Fenced" vector DB, neutrality guardrails, phased pilot
- **Krasan POC:** Jay Wingender
- **Vinay role:** Cc'd on internal AI discussions — TBD on engagement depth

## Key constraints

- **IITAA** (Illinois Information Technology Accessibility Act) — screen readers, LEP voters
- **Voter data sovereignty** — must stay inside state fence, not train public models
- **Anti-hallucination** — incorrect polling dates / laws could cause voter disenfranchisement
- **Political neutrality** — guardrails against candidate / party discussion

## Folder structure

```
BoardofElections/
├── README.md               ← this file
├── meeting-notes/          ← internal Krasan meetings + client touchpoints
└── reference-docs/         ← decks, RFP responses, source materials
```

## Timeline (current)

| Date | Event | Notes |
|---|---|---|
| 2026-05-13 | Internal Krasan AI Path Forward meeting | Jay Wingender shared 5-slide deck; rescheduled from earlier date |

## Open questions

- Strategy: internal Krasan effort vs. external client engagement
- Pilot scope, owner, and timeline
- RAG stack decisions (vector DB, hosting, content ingestion)
- Vinay's role relative to DCFS/ILC commitments
