# Tranzin Marketing Site

Sample static site provided by Tranzin (admin@tranzin.com), staged for separate Railway deploy at `tranzin.com`.

## Local preview

```bash
cd partners/tranzin/website
npm install
npm run dev
# open http://localhost:4000
```

Or without installing deps:

```bash
python -m http.server 4000 --directory partners/tranzin/website
```

## Deploy to Railway

This site is meant to run as its **own Railway service** — separate from `ussp` (main site), `app` (back office), and `tools` (AI tools), per the multi-tenant pattern.

### One-time service setup

1. In Railway: **New Service → GitHub repo `ussp/usspwebsite`**
2. **Settings → Source → Root Directory**: `partners/tranzin/website`
3. **Settings → Networking → Custom Domain**: add `tranzin.com` and `www.tranzin.com`
4. Copy the Railway-issued CNAME target
5. In GoDaddy DNS for `tranzin.com`, add:
   - `CNAME` `www` → `<railway-target>.up.railway.app`
   - `A` (apex `@`) → use Railway's apex IPs OR redirect via GoDaddy's domain forwarding to `www.tranzin.com`

### Deploys

Railway auto-deploys on push to `main` when files under `partners/tranzin/website/` change. No manual step.

## Files

- `index.html` — single-file SPA (multi-page via `.pg` / `.on` CSS toggle)
- `assets/logos/tranzin-logo.{svg,png}` — brand mark
- `package.json` — `serve` static server for Railway
- `railway.json` — Railway build/deploy config
