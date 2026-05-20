# Tranzin Capability Deck — Source Content

> Source markdown for the generic Tranzin capability deck published at `tranzin.com/decks/capability`. The HTML deck is the source of truth; this file mirrors the structure for easy editing of copy.

**Published at:** `partners/tranzin/website/decks/capability/index.html` → `tranzin.com/decks/capability`
**Status:** Living document — update this when copy changes, then re-render into the HTML.
**Branding:** Tranzin (navy / royal / gold / cream), logo from `partners/tranzin/website/assets/logos/tranzin-logo.svg`, deck format adapted from the DCFS Intact onboarding deck.

---

## What this deck is

A reusable capability statement for Tranzin sales conversations across industries. **Not** a one-off pitch for a single prospect — the only client-specific deck materials live under `partners/tranzin/website/decks/clients/<slug>/` (unlisted, share-link only).

## The thesis (one sentence)

**Don't renovate the legacy stack — wrap it, govern the data, and let agents decide.** Tranzin brings a Context-First AI Platform that is already MCP-ready, VionOS at Launch Warwick as a working proof point of the same pattern in production, and 23+ years of enterprise solution-delivery muscle to ship it.

## Slide-by-slide outline

| # | Title | Role |
|---|-------|------|
| 1 | Cover — Agentic Enterprise Architecture | Brand + thesis |
| 2 | Our Thesis | 3 anchors: platform / pattern / team |
| 3 | The Pattern We See in Modern Enterprises | Universal legacy posture + 5 transformation goals |
| 4 | Why Tranzin — Three Reasons | Platform exists / pattern proven / team can deliver |
| 5 | Technical Capability — Mapped to Five Layers | What Tranzin brings into each layer |
| 6 | Functional Use Cases Across Industries | Banking · telco · insurance · retail · energy · hospitality · public sector |
| 7 | The Platform — Tranzin Context-First AI | Connect · Trust · Evolve |
| 8 | Reference Architecture | 5-layer stack (visual) |
| 9 | Proof — VionOS at Launch Warwick | What we built (Sense / Think / Act) |
| 10 | Proof — Results | StaffingOPS · CustomerOPS · VisionOPS · MarketingOPS |
| 11 | How the Pattern Translates Across Industries | 4-column mapping table |
| 12 | Use Case Library — Agents Live on the Platform | 7 concrete agent patterns |
| 13 | Engagement Model | Assess → Architect → Accelerate → Staff (4 phases, 2 shapes) |
| 14 | Beyond MCP — Full Capability Stack | Adjacent capabilities + footprint + certs |
| 15 | Next Steps + Contact | Discovery → Assessment → Lighthouse |

## Editing the content

Edit copy directly in `partners/tranzin/website/decks/capability/index.html` — each slide is inside its own `<div class="slide">…</div>` block, clearly commented (`<!-- ── SLIDE N: Title ── -->`).

When making changes:
1. Edit the HTML directly.
2. Update this `source.md` to match.
3. Commit + push to `main` (Railway auto-deploys ~2 min later).

## Source material referenced

- Banking MCP prospect framing — `partners/tranzin/projects/banking-mcp/deck.md` (specific RFP framing kept separately)
- Aryaki / SalesGO collaboration brief (Naren, 2026-05-02) — informs the cross-vertical use case examples (Slide 6, 12)
- VionOS Story Deck — Launch Warwick case study (the proof on Slides 9–10)
- USSP `llms.txt` — Context-First AI Platform capabilities and pre-built solutions
- DCFS Intact onboarding deck format — slide engine, presentation controls, structure

## Future deck variants (not yet built)

| Variant | URL | Status |
|---------|-----|--------|
| Banking-specific deck | `/decks/banking` | source MD ready at `projects/banking-mcp/deck.md` |
| Healthcare-specific deck | `/decks/healthcare` | not started |
| Public-sector deck | `/decks/public-sector` | not started |
| Per-client decks | `/decks/clients/<slug>` | per-prospect, unlisted |

## Open items for the capability deck

- Confirm StaffingOPS YoY proof number (currently soft directional language; see Slide 10).
- Confirm pre-built solution list against current platform reality (Slide 7, second column).
- Add SVG version of the architecture diagram if needed for print fidelity (currently a styled HTML stack).
- Add `<meta property="og:*">` tags for link previews when sharing via Slack / LinkedIn / email.
