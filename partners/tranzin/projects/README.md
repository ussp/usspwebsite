# Tranzin Projects — Source Materials

This folder holds working materials per project: research notes, deck source (MD), reference docs, draft proposals.

The **published** deliverables (HTML decks Naren can share with prospects) live under `partners/tranzin/website/decks/`. This folder is the workshop; the website is the shop window.

## Layout

```
projects/
├── README.md                            ← you are here
├── banking-mcp/                         working materials for Tranzin's banking prospect
│   ├── README.md                        engagement brief, source emails, decisions
│   ├── deck.md                          banking-specific deck content (16 slides)
│   └── architecture.md                  drilled-in reference architecture
├── capability-deck/                     source for the generic Tranzin capability deck
│   └── (source.md to be added as deck content evolves)
└── india-ais140-vehicle-tracking/       Fleetronix VLTD/AIS-140 bid (AP Minister pitch)
```

## Project vs. deck — which goes where

| Lives in `projects/<x>/` | Lives in `website/decks/<x>/` |
|---|---|
| Source MD content, drafts, decisions log | The published HTML deck |
| Engagement brief, prospect background, contacts | Customer-facing brand and copy |
| Reference architecture, ASCII diagrams, build plan | Rendered SVGs, styled architecture stack |
| Open questions, internal commentary | Polished customer collateral |

## Naming

- Folder names are kebab-case (e.g. `banking-mcp`, `capability-deck`).
- Client-specific projects sit alongside generic ones; the published deck is what determines whether the deck URL is generic (`/decks/capability`) or client-scoped (`/decks/clients/acme-bank`).

## Publishing flow

1. Draft + iterate in `projects/<x>/` (MD).
2. When ready to share, build the HTML in `website/decks/<slug>/index.html` (mirror an existing deck's structure).
3. Commit + push to `main` → Railway auto-deploys → share the URL.

Detail on deck conventions: `partners/tranzin/website/decks/README.md`.
