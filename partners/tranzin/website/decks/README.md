# Tranzin Sales Decks

Decks served from `tranzin.com/decks/*` — single-file HTML, share-link only (excluded from search indexes via `robots.txt` + per-page `meta robots noindex`).

## Layout

```
decks/
├── README.md                ← you are here
├── capability/              → tranzin.com/decks/capability
│   └── index.html           generic Tranzin capability deck
├── banking/                 → tranzin.com/decks/banking
│   └── (placeholder — populate when needed)
└── clients/                 → tranzin.com/decks/clients/<slug>
    └── (per-client decks — unlisted, share via direct URL)
```

## Conventions

| Item | Choice |
|------|--------|
| **Format** | Single-file HTML per deck (`index.html`). All CSS + JS inline. |
| **Frame** | 1120 × 630 px slides (16:9). Slide system based on the DCFS deck pattern. |
| **Brand** | Tranzin colors (navy / royal / gold / cream) + Cormorant Garamond (display) + DM Sans (body). Logo at `../../assets/logos/tranzin-logo.svg`. |
| **Controls** | Prev / Next / Counter / Present / Print / PPTX / Hide. Keyboard: ← → ↑ ↓ Space PgUp PgDn Home End ESC F5 H. URL hash sync (`#slide-N`). |
| **Indexing** | All decks include `<meta name="robots" content="noindex,nofollow">` AND are blocked via root `robots.txt`. |
| **Source** | Markdown source lives under `partners/tranzin/projects/<project>/` — not in this folder. |

## Adding a new deck

1. Pick the URL slug (e.g. `clients/acme-bank`).
2. Create `decks/<slug>/index.html` — copy `capability/index.html` as a starting point, swap content.
3. Keep the `meta robots noindex` line.
4. Confirm the logo path resolves (relative from your slug — usually `../../assets/logos/tranzin-logo.svg`; from nested `clients/<slug>/` it becomes `../../../assets/logos/tranzin-logo.svg`).
5. Commit + push to `main`. Railway watches `partners/tranzin/website/**` and auto-deploys.

## Local preview

```powershell
python -m http.server 4000 --directory partners/tranzin/website
# open http://localhost:4000/decks/capability/
```

## Deploy

Railway service `tranzin-site` builds the `Dockerfile` in this folder. The Dockerfile copies `index.html`, `assets/`, `decks/`, and `robots.txt` into `/srv` — Caddy 2 serves them.

A new deck is live ~2 minutes after `git push origin main` (when the file changes match the watch-path `partners/tranzin/website/**`).
