# Tranzin — Banking MCP Engagement Deck

> **Audience:** Tranzin's banking prospect (Oracle / SQL Server / Salesforce / siloed reporting → Agentic Enterprise Architecture)
> **Submitter:** Tranzin (Naren Kollu)
> **Brand surface:** Tranzin only. No delivery partner named on customer-facing pages.
> **Proof point:** VionOS at Launch Warwick (live production deployment)
> **Status:** MD outline — review + edit, then we build HTML deck

---

## What's in this folder

| File | Purpose |
|------|---------|
| `README.md` | This file — index, brand decisions, source material, review process |
| `deck.md` | Full deck content, slide-by-slide (single file for fast review) |
| `architecture.md` | Drilled-in reference architecture diagram (ASCII + SVG build plan) |

---

## How to review

1. Read `deck.md` end-to-end (16 slides, ~10 min)
2. Note edits inline or by slide number
3. Review the architecture diagram in `architecture.md`
4. Once approved, we build the HTML deck (same pattern as `sales/web/index.html` and `frontend/launch_warwick/public/igmfund/`)

---

## Decisions locked in

| Decision | Choice |
|----------|--------|
| Format | MD first → HTML after approval |
| Cover brand | **Tranzin only.** No delivery partner appears on the cover, headlines, contact block, or anywhere in the deck. |
| Platform branding | The platform is "Tranzin Context-First AI Platform" / "our Context-First AI Platform". No third-party platform attribution. |
| Delivery footprint | Slide 14 references onshore + offshore presence in Chicago / India / Canada as Tranzin's own footprint. |
| Launch Warwick exposure | Named case study with architecture diagram |
| Tone | Capability statement + proposal hybrid — Tranzin is the contracting party, bank is the reader |

---

## Source material

- **Naren's email — 2026-05-05** "Banking MCP prospect" — defines the bank's situation (Oracle/SQL/SF legacy), 5 core challenges, 5 transformation goals (Interoperability, Data Readiness, Agentic Layer, Guardrails, Scalable Architecture).
- **Context-First AI Platform reference material** at `D:\Code\ussp\` (internal — not surfaced in the deck) — defines the platform: Connect / Trust / Evolve, 34+ connectors, TTL & trust scoring, MCP-ready, knowledge graph, framework-agnostic.
- **VionOS Story Deck** at `sales/decks/VionOS_Story_Deck_Content.md` — Launch Warwick case study: Sense → Think → Act, three live products (CustomerOPS, VisionOPS, MarketingOPS), proof numbers.
- **CLAUDE.md** at repo root — actual technical inventory of VionOS (50+ services, MCP gateway, brain knowledge graph, edge AI on Jetson, 8 AI crews).

---

## The thesis (one sentence)

**Don't renovate the legacy stack — wrap it, govern the data, and let agents decide.** Tranzin brings (1) a Context-First AI Platform that is already MCP-ready with 34+ connectors, (2) VionOS at Launch Warwick as a working proof point of the exact same pattern in production, and (3) 23+ years of enterprise solution-delivery muscle to ship it.

---

## What this deck is NOT

- Not a technical SoW — this is a capability + roadmap pitch. SoW comes after the bank engages.
- Not a generic AI sales deck — it's structured around the bank's own 5 transformation goals so they recognize themselves on every slide.
- Not VionOS-first — VionOS is the proof, not the product being sold. The product is Tranzin's capability to build the same for the bank.

---

## Open questions before we build HTML

1. **StaffingOPS number** — Slide 10 has a `[FILL: labor cost or hours reduction 2025→2026]` placeholder for the headline staffing outcome. What's the concrete number? (e.g. "-X% hourly labor cost YoY", "-Y labor hours/week", "+Z% RPLH"). This is now the lead result line.
2. **Bank name** — Naren hasn't named the prospect. Should we leave `[Client Bank]` placeholder or get the name first?
3. **Compliance hooks** — anything specific (SOX, OCC, FFIEC, GLBA)? If known, we name-drop on the Guardrails slide.
4. **Ballpark engagement size** — do we float a number on the Engagement Model slide or leave open?
5. **Demo access** — confirm we can show LW VionOS dashboard live (or do we use screenshots only)?
6. **Co-presenter** — is Naren presenting alone, or with you on the call? Affects the Close slide CTA.
