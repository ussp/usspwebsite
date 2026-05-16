# AI Path Forward with SBE — Meeting Notes

**Date:** 2026-05-13, 4:30–5:00 PM CT
**Format:** Microsoft Teams
**Subject:** AI Path Forward with SME (State Board of Elections)
**Organizer:** Jay Wingender (Krasan)
**Deck sent:** 2026-05-13 (received 05-14 00:32 UTC) — `../reference-docs/AI-and-Pathforward-with-SBE-2026-05-13.pptx`

## Attendees

**To:**
- Dinkar Karumuri
- Steve Peralta
- Dale Ferguson
- Darrin Turner
- Tony Fremarek
- Kristen Bien
- Malinda Lloyd
- Brian Fitzgerald

**Cc:**
- Sandip Dalvi
- Vinay Lagisetty

**From:** Jay Wingender (Krasan)

## Context

Rescheduled internal Krasan conversation on client inquiries about AI technology with the **Illinois State Board of Elections (ILSBE / BOE)** client and how the project team should respond. Driven by AI questions raised in the SBE UI/UX requirement sessions for the new SBE website modernization (not originally AI-targeted).

## Deck contents (5 slides)

### Slide 1 — Title
AI and Path Forward with ILSBE — May 13, 2026

### Slide 2 — Agenda
- SBE use case leading to AI tool inquiries
- Sample approach for general path forward for Krasan and future clients
- Open Discussion

### Slide 3 — Identified use case (BOE Website Modernization)
- SBE expressed growing need for AI guidance across new website + public sector operations
- Krasan identified internal resources to address inquiries from the State
- Open questions surfaced in UI/UX requirement sessions:
  - Simple search (search button) options across the website
  - Pluggable AI architecture — Chatbot / AI popup (ChatGPT, Gemini, Copilot) for navigation
- Direction: identify/implement **RAG (Retrieval-Augmented Generation)**:
  - **The Fence** — Vector DB of approved IBOE content only
  - **The Logic** — AI searches only the fenced environment
  - **The Output** — Summary, with fallback assistance if info not found

### Slide 4 — Sample Approach for AI Path Forward
- Next steps — Strategy definition: internal to Krasan vs. external to client
- Key questions ("Trust vs. Tech" equation):
  - **Security** — prevent hallucinations (fake polling dates / laws → voter disenfranchisement)
  - **Accessibility** — IITAA (Illinois Information Technology Accessibility Act) compliance, screen readers, LEP voters
  - **Governance** — voter data sovereignty (stays within state fence, not used to train public models)
- Strategy: "Safe-Launch" attack plan with pluggable architecture
  - Not building from scratch — plugging pre-built AI into federally secured, private container
  - **RAG Fence** — AI only uses official PDFs as source of truth
  - **Neutrality Filter** — hard-coded guardrails preventing discussion of candidates / political parties
  - **Phased deployment** — internal-only pilot for client staff before public-facing voter tools

### Slide 5
Empty / closing

## Open items / TBD

- Owner of strategy definition (internal vs. external)
- Pilot scope and timeline
- RAG infrastructure decisions (vector DB, hosting, content ingestion approach)
- IITAA compliance review path
- Vinay's role on this engagement vs. DCFS/ILC

## Email body

> Thank you everyone for joining todays call. Attached is the presentation for your review.
>
> Jay
