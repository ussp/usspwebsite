# Tranzin Marketing Site

Static marketing site for Tranzin, deployed as its own Railway service at `tranzin.com`.

## Local preview

```bash
python -m http.server 4000 --directory partners/tranzin/website
# open http://localhost:4000
```

(`package.json` is retained for an alternate Node-based local preview via `npm run dev`, but the production container does not use Node.)

## Production server

Caddy 2 (alpine) serves the static files. Chosen over `serve@14` (Node) after a silent-death incident on 2026-05-19 — Node-based static servers have no supervision and can wedge under bot probing. Caddy is a single Go binary running as PID 1, with strict 404s for missing paths (so WordPress endpoint probes don't get 200 responses anymore).

## Deploy to Railway

Runs as its own Railway service in the `ussp` project — separate from `ussp` (main site), `app` (back office), and `tools` (AI tools).

### One-time service setup

1. In Railway: **New Service → GitHub repo `ussp/usspwebsite`**
2. **Settings → Source → Watch Paths**: `partners/tranzin/website/**`
3. **Settings → Networking → Custom Domain**: add `tranzin.com` and `www.tranzin.com`
4. Copy the Railway-issued CNAME target
5. In GoDaddy DNS for `tranzin.com`, add:
   - `CNAME` `www` → `<railway-target>.up.railway.app`
   - `A` (apex `@`) → use Railway's apex IPs OR redirect via GoDaddy's domain forwarding to `www.tranzin.com`

### Deploys

Railway auto-deploys on push to `main` when files under `partners/tranzin/website/` change. No manual step.

## Files

- `index.html` — single-file site (multi-page via `.pg` / `.on` CSS toggle, no client-side routing)
- `assets/logos/tranzin-logo.{svg,png}` — brand mark
- `Dockerfile` — `caddy:2-alpine` base, copies Caddyfile + site
- `Caddyfile` — Caddy 2 config: port from `$PORT`, gzip/zstd, security headers, strict 404
- `railway.json` — Railway build/deploy config (Dockerfile builder, `restartPolicyType: ALWAYS`)
- `package.json` — retained only for local Node-based preview; not used in production
