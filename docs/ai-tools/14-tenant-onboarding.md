# Tenant Onboarding Guide — AI Transformation Tools

> **Architecture note:** As of OpenSpec change `add-host-based-tenant-resolution` (commit `99ea3d6`, 2026-05-01), the AI Tools platform runs as **a single Railway service that serves all tenants**. Tenants are resolved at request time from the `Host` header against the `tenants.domain` column. **Do NOT create a new Railway service per tenant.**
>
> **Known auth-route exception (read this):** the host→tenant middleware excludes `/api/auth/*` routes — Next.js strips the Host header when middleware clones the request, which breaks Auth.js's URL derivation. So for sign-in flows, `getSiteId()` falls back to `process.env.SITE_ID` (currently `ussp`). The practical impact: a Tranzin user signing in via `app.tranzin.com` is auto-provisioned with `site_id=ussp` unless they already exist as a Tranzin staff user. Until a session-level tenant binding lands, **pre-create the tenant's users in `staff_users` before they sign in for the first time** (Step 1.4 below). Tenant-correct rendering of pages still works fine post-login — only the auto-provisioning path is affected.

This guide walks through onboarding a new white-label client onto the shared `tools` Railway service. Each new client gets:

- Their own custom domain (e.g., `app.client.com`)
- Their own brand (logo, primary color, tagline)
- Their own user roster, isolated by `site_id` row-level filtering
- Access to whichever AI tools you enable for them

A first-time onboarding takes **~10 minutes** end-to-end if everything's in hand.

---

## Critical env vars on the `tools` Railway service

Before any new-tenant work, sanity-check the **`tools`** service's env vars. These are **set once and apply to every tenant** the service serves. Getting them wrong silently breaks OAuth in ways that are hard to diagnose.

| Variable | Must be | Why |
|---|---|---|
| `AUTH_URL` | **NOT SET** (deleted entirely) | Auth.js v5 lets `AUTH_URL` *override* everything else, pinning OAuth `redirect_uri` to one host regardless of which tenant the user came in from. The in-code multi-tenant factory derives the correct host per-request — only works when `AUTH_URL` is absent. |
| `AUTH_TRUST_HOST` | **NOT SET** (deleted entirely) | Was tried during debugging; doesn't fix anything on its own in this stack and adds noise. The in-code `trustHost: true` is sufficient. |
| `AUTH_SECRET` | Set (any 32+ char secret) | Required for JWT signing. Don't rotate without coordinated session invalidation. |
| `SITE_ID` | `ussp` | Acts as the fallback site for `/api/auth/*` routes (see auth-route exception in the architecture note). Don't change unless you know what you're doing. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Set, pointing at the shared **USSP Back Office** OAuth client | Single client serves all Google tenants. See Step 4. |

> **Why removing `AUTH_URL` alone isn't enough:** It is necessary but not sufficient. Removing `AUTH_URL` makes `trustHost: true` *theoretically* take over — but in `next-auth@5.0.0-beta.30` + `next@16.1.6`, `trustHost` is silently broken and OAuth URLs default to `https://localhost:3000/...`. The code-level workaround in `packages/platform-core/src/auth/admin-config.ts` (the `createMultiTenantAdminAuth()` factory) is what actually makes multi-tenant OAuth work. See [The multi-tenant OAuth pattern](#the-multi-tenant-oauth-pattern--reusable-across-projects) below.

---

## Prerequisites

Before you start, gather:

| Input | Notes |
|---|---|
| **Site ID** | Lowercase, kebab-case, permanent. e.g., `tranzin`. Becomes the `site_id` everywhere. |
| **Brand name** | Full name (e.g., "Tranzin") + short name shown in sidebar |
| **Domain** | Final hostname users will visit (e.g., `app.tranzin.com`). Must be a registered domain you control DNS for. |
| **Auth provider** | `google` or `microsoft`. **Recommend `google`** — same `USSP Back Office` OAuth client serves all Google tenants; minimal setup. |
| **Email domain** | The domain emails will arrive from (e.g., `tranzin.com`). Used by `auto_provision` to gate who can self-create accounts. |
| **Brand color** | Single hex (e.g., `#D4AF37`). Used for accents in sidebar/login. |
| **Tagline** | Optional. Shown on login. |
| **Logo** | SVG preferred + PNG fallback. Optional at first; can be added later. |
| **Tool entitlements** | Pick from: `readiness`, `engagements`, `governance`, `methodology`, `tools`. Most clients get all 5. |
| **Initial users** | At least one admin (e.g., the client's primary contact). Email + name + role. |
| **DNS access** | API key or admin-console access for the domain's DNS provider (GoDaddy, Cloudflare, etc.) |

---

## Step 1 — Create DB rows

Two paths. Pick whichever is faster for you.

### Path A — Admin UI (recommended for non-technical adds)

1. Sign in to https://tools.ussp.co as a USSP super-admin
2. Sidebar → **Admin** → **Tenant Management**
3. **+ New Tenant** → fill in the prerequisites. Save.
4. From the tenant list, click **Configure** on the new row → toggle on the tools the client should access. Save.
5. **Users** card → **+ Add User** for each initial user with their email, name, role.

### Path B — Direct REST (recommended for repeatable onboarding via script)

The Admin UI just hits Supabase. For automation, do the same inserts directly via the Supabase REST API using the service-role key. Three tables in order:

```python
# 1. Insert sites row (FK target for staff_users)
POST /rest/v1/sites
[{
  "id": "<site_id>",                  # e.g., "tranzin"
  "name": "<full-name>",              # e.g., "Tranzin"
  "domain": "<domain>",               # e.g., "app.tranzin.com"
  "active": true,
  "config": {}
}]

# 2. Insert tenants row (drives branding + auth + entitlement model)
POST /rest/v1/tenants
[{
  "site_id": "<site_id>",
  "name": "<full-name>",
  "short_name": "<short>",            # shown in sidebar
  "domain": "<domain>",
  "auth_provider": "google",          # or "microsoft"
  "primary_color": "#<hex>",
  "tagline": "<tagline>",
  "auto_provision": true,             # auto-create users on first login
  "default_role": "viewer",
  "allowed_domain": "<email-domain>", # restricts auto-provision
  "is_owner": false,                  # USSP=true; everyone else=false
  "active": true
}]

# 3. Insert tool entitlements (one row per enabled tool)
POST /rest/v1/tenant_tool_entitlements
[
  {"site_id": "<site_id>", "tool_key": "readiness",   "enabled": true},
  {"site_id": "<site_id>", "tool_key": "engagements", "enabled": true},
  {"site_id": "<site_id>", "tool_key": "governance",  "enabled": true},
  {"site_id": "<site_id>", "tool_key": "methodology", "enabled": true},
  {"site_id": "<site_id>", "tool_key": "tools",       "enabled": true}
]

# 4. Insert initial users
POST /rest/v1/staff_users
[
  {"site_id": "<site_id>", "email": "<admin-email>", "full_name": "<name>", "role": "admin",  "active": true},
  {"site_id": "<site_id>", "email": "<other-email>", "full_name": "<name>", "role": "viewer", "active": true}
]
```

All inserts use header `Prefer: resolution=merge-duplicates,return=representation` for idempotency.

**Heads up:** All four inserts must succeed. `staff_users.site_id` has an FK to `sites.id` (NOT `tenants.site_id`), so the `sites` row must exist first.

---

## Step 2 — Add custom domain on Railway

The `tools` service already runs all tenants. We just add the new domain to it.

1. Railway dashboard → `ussp` project → **`tools` service** (the existing one — **NOT a new service**)
2. **Settings** → **Networking** → **Custom Domain** → **+ Add Custom Domain**
3. Enter the domain (e.g., `app.tranzin.com`). Save.
4. Railway shows two records you'll need to add at the tenant's DNS provider:
   - `CNAME @` (or for a subdomain, the subdomain) → `<some>.up.railway.app`
   - `TXT _railway-verify.<subdomain>` → `railway-verify=<token>`
5. Copy both. We'll use them in Step 3.

---

## Step 3 — Set DNS records at the tenant's DNS provider

### GoDaddy (programmatic via API)

Save the tenant's GoDaddy API key + secret to `.env.local` under the `<TENANT>_GODADDY_*` namespace (per the env-var-naming convention):

```
TENANT_GODADDY_API_KEY=<key>
TENANT_GODADDY_API_SECRET=<secret>
```

Then PUT both records via the GoDaddy v1 API:

```
PUT /v1/domains/<domain>/records/CNAME/<sub>     [{"data": "<railway-target>", "ttl": 600, "type": "CNAME", "name": "<sub>"}]
PUT /v1/domains/<domain>/records/TXT/_railway-verify.<sub>  [{"data": "railway-verify=<token>", "ttl": 600, "type": "TXT", "name": "_railway-verify.<sub>"}]
```

(See `partners/tranzin/` for a worked example — `TRANZIN_GODADDY_API_KEY` was used to set `app.tranzin.com` records on 2026-05-01.)

### Apex domains (no `www`)

GoDaddy rejects `CNAME @`. Use either:

- **A record at apex** pointing to Railway/Fastly anycast (`151.101.2.15` worked for `tranzin.com`); Railway's SNI routing handles the rest
- **Domain forwarding** in the GoDaddy dashboard: apex → `https://www.<domain>` (301, Forward only)

### Other registrars (Cloudflare, Namecheap, etc.)

Same two records. Set them via that provider's UI or API.

---

## Step 4 — Add OAuth redirect URI

### Google (most tenants)

The shared OAuth client is named **"USSP Back Office"** in Google Cloud Console.

1. https://console.cloud.google.com/apis/credentials
2. **OAuth 2.0 Client IDs** → click **USSP Back Office**
3. **Authorized redirect URIs** → **+ ADD URI**
4. Paste: `https://<domain>/api/auth/callback/google`
5. **SAVE**

**Do NOT create a new OAuth client per tenant.** One client, many redirect URIs.

### Microsoft Entra ID (Azure AD)

For tenants that require Microsoft auth (e.g., gov/enterprise clients), this is more involved:

1. https://entra.microsoft.com → **App registrations** → **New registration**
2. Name: `AI Transformation Tools — <client-name>`
3. Supported account types: **Single tenant** (typical) or **Multi-tenant** (rare)
4. Redirect URI: `https://<domain>/api/auth/callback/microsoft-entra-id`
5. After creation, copy:
   - Application (client) ID → set as `AUTH_MICROSOFT_<TENANT>_ID`
   - Directory (tenant) ID → set as `AUTH_MICROSOFT_<TENANT>_TENANT`
   - Certificates & secrets → New client secret → set as `AUTH_MICROSOFT_<TENANT>_SECRET`
6. **API permissions:** Microsoft Graph → User.Read (default; verify it's there)
7. Set the env vars on the `tools` Railway service. *Microsoft tenants currently still require per-tenant env vars; consolidating into the shared host-based flow is a follow-up.*

---

## Step 5 — Verify end-to-end

DNS propagation usually takes 1–10 min. SSL provisioning is automatic once Railway sees the verification TXT.

```bash
# 1. DNS resolves
dig +short app.<domain>             # should return Railway's CNAME target
dig +short -t TXT _railway-verify.<sub>.<domain>   # should return the railway-verify=... token

# 2. HTTPS works (no cert errors)
curl -sI https://<domain>           # 200 (or 307 redirect to /login)

# 3. Branding renders
curl -s https://<domain>/login | grep -E "primary_color|<tagline-snippet>"

# 4. Sign-in flow (manual, in browser)
# Visit https://<domain>/login → click "Sign in with Google" (or Microsoft)
# → expect callback to <domain> (NOT tools.ussp.co) → land on dashboard
# → sidebar shows ONLY the entitled tools (verify nothing extra leaked)
# → admin can see /admin/tenants ONLY if is_owner=true (USSP staff)
```

If sign-in returns a Google "redirect_uri_mismatch" error, the redirect URI didn't get saved in the OAuth client (Step 4). Verify in Google Cloud Console.

If the page returns 404 with no apparent reason, the `tenants` row likely has the wrong `domain` value — middleware can't find a match. Check `tenants.domain` exactly matches the request host (no trailing slash, no protocol prefix, no port).

---

## Step 6 — Hand-off to the client

Once verified, send the client:
- The signed-in URL: `https://<domain>`
- The list of users you provisioned (so they know who has access)
- A note that auto-provisioning is on for `<email-domain>` (anyone at that email domain who signs in gets auto-created as `viewer`; admins must be added explicitly)

---

## The multi-tenant OAuth pattern — reusable across projects

**TL;DR:** Auth.js v5's `trustHost: true` is silently broken in `next-auth@5.0.0-beta.30` + `next@16.1.6`. To run **one Next.js + Auth.js service serving multiple custom domains** (white-label/SaaS pattern) you need a code-level workaround that derives the host per-request. Copy the pattern below into any project hitting the same wall.

### What breaks if you don't apply this

When the same service is reachable at `tenant-a.com` AND `tenant-b.com`:

1. **OAuth `redirect_uri` sent to the IdP** defaults to `https://localhost:3000/api/auth/callback/google` regardless of which tenant the user came from. Google then bounces the user to localhost (broken in production) or — if `AUTH_URL=https://canonical.com` is set as a workaround — to the one canonical host. Either way: the state cookie set on the tenant host can't be found at the callback host → `error=Configuration`.
2. **Post-signin redirect** (where Auth.js sends the user after a successful callback) *also* defaults to `https://localhost:3000/` via a separate code path. User signs in successfully, lands on localhost, sees `ERR_CONNECTION_REFUSED`.
3. **Post-signout redirect** has the same bug — same code path as post-signin.

All three failure modes feel like different bugs. They're the same root cause: Auth.js v5's URL derivation refuses to read `X-Forwarded-Host` from the request even when `trustHost: true` is set. Tracked upstream as [#10915](https://github.com/nextauthjs/next-auth/issues/10915), [#10928](https://github.com/nextauthjs/next-auth/issues/10928), [#12225](https://github.com/nextauthjs/next-auth/issues/12225), with fix PR [#13323](https://github.com/nextauthjs/next-auth/pull/13323) open and unmerged for ~9 months.

### What does NOT work (don't waste time on these)

| Attempt | Why it doesn't work |
|---|---|
| Set `trustHost: true` in code | The option is honored but the URL-derivation path that reads `X-Forwarded-Host` is the broken part. |
| Set `AUTH_TRUST_HOST=true` env var | Same path; same bug. Redundant with the in-code option. |
| Upgrade `next-auth` to the latest beta (e.g. beta.31) | Fix PR #13323 is not merged into any released beta as of late 2026. |
| Set `AUTH_URL=https://tenant-a.com` | Works for tenant A only — pins the callback to one host. Breaks for all other tenants. |
| `AUTH_REDIRECT_PROXY_URL` (the "preview deploy" pattern) | Designed for preview deployments, not tenant custom domains. Apple OAuth doesn't support it. Has its own cookie-domain footguns ([#12225](https://github.com/nextauthjs/next-auth/issues/12225)). |
| Whitelist many redirect URIs on one OAuth client | Doesn't fix the host-derivation bug. (Also: Google caps at 10 unique domains per OAuth project.) |

### The pattern that works: lazy factory + `redirectProxyUrl` + `redirect` callback

Two coordinated overrides:

1. **Outbound OAuth — `redirectProxyUrl`** set dynamically per-request via the lazy `NextAuth()` factory. This controls the `redirect_uri` parameter sent to the IdP.
2. **Post-signin/signout — `redirect` callback** that rewrites the (broken) `baseUrl` to the actual request host.

The whole thing lives in `packages/platform-core/src/auth/admin-config.ts` as `createMultiTenantAdminAuth()`. Reduced to its essentials:

```ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

function buildBaseConfig(): NextAuthConfig {
  return {
    trustHost: true,                         // necessary but not sufficient
    providers: [Google({ clientId: ..., clientSecret: ... })],
    callbacks: { /* signIn, jwt, session — same as single-tenant */ },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const base = buildBaseConfig();

  // Read the REAL host per-request. In Next 16 `headers()` is async-only.
  let realBase: string | null = null;
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "https";
    const host  = h.get("x-forwarded-host") ?? h.get("host");
    if (host) realBase = `${proto}://${host}`;
  } catch {
    // No request context (build/seed) — skip overrides; that's fine because
    // build-time invocations don't initiate OAuth.
  }

  if (!realBase) return base;

  return {
    ...base,
    // (1) Fix the OUTBOUND redirect_uri sent to Google.
    redirectProxyUrl: `${realBase}/api/auth`,
    callbacks: {
      ...base.callbacks,
      // (2) Fix the POST-SIGNIN/SIGNOUT redirect. Auth.js's `baseUrl`
      //     parameter here is the same broken localhost:3000 default;
      //     swap it for the real per-request base.
      async redirect({ url, baseUrl }) {
        if (url.startsWith("/")) return `${realBase}${url}`;
        if (url.startsWith(baseUrl)) return realBase + url.slice(baseUrl.length);
        if (url.startsWith(realBase!)) return url;
        return realBase!;
      },
    },
  };
});
```

### Why this works (mental model)

- `NextAuth()` accepts an **async factory function** as well as a static config object. When given a factory, Auth.js calls it on each handler invocation, so `realBase` is captured per-request.
- `redirectProxyUrl` is the documented escape hatch for telling Auth.js "use this URL as the canonical base for the OAuth callback." We're just setting it dynamically per request.
- The `redirect` callback fires for every post-action redirect (after signIn, after signOut, after callback). Auth.js calls it with `baseUrl` set to its broken-derived value; we replace it with the per-request real base.
- The `try/import("next/headers")` pattern: `next/headers` is only available during a request, not at build/startup. The try guards the build path. At build time we just return the base config — which is fine because builds don't initiate OAuth.

### Required infrastructure outside the code

Even with the code right, you also need:

1. **IdP redirect URIs whitelisted** for *every* tenant host: `https://<tenant>/api/auth/callback/google` (Google) or equivalent. One OAuth client, many redirect URIs (cap: 10 unique domains per Google OAuth project — beyond that, use per-tenant clients).
2. **The reverse proxy must set `X-Forwarded-Host` and `X-Forwarded-Proto`**. Railway's edge does this by default. Verify on other platforms (Fly, Render, etc.) before deploying.
3. **`AUTH_URL` MUST NOT be set** as an env var. It overrides the factory-set proxy URL and re-pins the callback to one host.
4. **Same `AUTH_SECRET` across all tenants** — sessions are JWT-signed; all tenant domains share the same signing key (already true when serving from one process).

### Portability to other platforms

- **Vercel**: same pattern works, but Vercel's own preview deploy infrastructure uses `AUTH_REDIRECT_PROXY_URL`. Don't use both.
- **Fly.io / Render / Fly Machines**: verify `X-Forwarded-Host` is set by the edge. If not, use the raw `Host` header (the pattern above does this as fallback).
- **Cloudflare Workers / Edge runtime**: `next/headers` works the same. Pattern is unchanged.
- **Self-hosted nginx**: ensure your nginx config sets `proxy_set_header X-Forwarded-Host $host;` and `proxy_set_header X-Forwarded-Proto $scheme;`.

### When to retire this workaround

Watch [PR #13323](https://github.com/nextauthjs/next-auth/pull/13323). Once it merges and ships in a `next-auth` release, you can in theory remove the `redirectProxyUrl` and the `redirect` callback overrides. **Verify with a live request before deleting** — the upstream fix may not catch the post-signin redirect path. Keep the lazy factory either way; it's the only way the per-request host derivation works.

---

## Troubleshooting

Common failure modes and the fix. Always check the Railway env vars (top of this doc) first — they're the #1 source of silent OAuth failures.

| Symptom | Likely cause | Fix |
|---|---|---|
| OAuth `redirect_uri` sent to Google is `https://localhost:3000/api/auth/callback/google` | The deployment is running code that uses `createAdminAuth()` (single-tenant) instead of `createMultiTenantAdminAuth()` — or the lazy-factory workaround was removed. | Verify `packages/ai-tools/src/lib/auth.ts` imports and calls `createMultiTenantAdminAuth()`. Rebuild + redeploy. See [The multi-tenant OAuth pattern](#the-multi-tenant-oauth-pattern--reusable-across-projects). |
| OAuth `redirect_uri` sent to Google is correct (`https://<tenant>/...`) but **after** sign-in the user lands on `https://localhost:3000/` | Same Auth.js URL-derivation bug, different code path. The `redirect` callback override is missing or not deployed. | Confirm the `redirect` callback exists in `createMultiTenantAdminAuth()`. Rebuild platform-core + redeploy ai-tools. |
| Sign-out redirects user to `https://localhost:3000/login` | Same root cause as the post-signin redirect — Auth.js's `redirect` callback gets a broken `baseUrl`. Fix is the same; if signin-redirect works but signout doesn't, the `redirect` callback isn't being invoked for signout (rare; check Auth.js version). | Verify the `redirect` callback in code; it should handle BOTH signin and signout (Auth.js calls it for both). |
| Sign-in redirects to `/login?error=Configuration` regardless of which tenant the user started on | `AUTH_URL` env var is set, pinning the OAuth callback to one host. State cookie set on tenant host can't be found at the canonical host. | **Delete the `AUTH_URL` env var** from the tools service. Force a redeploy (env-only changes sometimes SKIP — `railway redeploy --service tools --yes`). Also delete `AUTH_TRUST_HOST` if set — it's unnecessary and adds noise. |
| Google returns `Error 400: redirect_uri_mismatch` after the user picks their Google account | The tenant's callback URL isn't in the OAuth client's authorized redirect URIs. | Step 4: add `https://<tenant-domain>/api/auth/callback/google` to the **USSP Back Office** client in Google Cloud Console. |
| Page returns 404 immediately when visiting the tenant domain | `tenants.domain` doesn't exactly match the request `Host` header (trailing slash, port, protocol, or capitalization). Middleware hard-fails on no match — intentional, no fallback. | Verify with `SELECT site_id, domain FROM tenants WHERE active = true;`. Domain must be lowercase, no protocol, no port, no trailing slash. |
| User authenticates via Google but lands back on `/login` with no error | `signIn` callback returned `false`. Most common causes: (a) email not in `staff_users` for the resolved `site_id`, (b) `auto_provision = false` on the tenant, (c) `allowed_domain` set and email doesn't match. | Check `staff_users WHERE email = ? AND active = true;` for the resolved site. If pre-creation is required (it usually is for non-superadmins), add the user to `staff_users` per Step 1.4. Remember: auth routes resolve `site_id` from `process.env.SITE_ID` (= `ussp`), NOT from the host — so a Tranzin user signing in via `app.tranzin.com` is looked up under `site_id=ussp`. Pre-create with `site_id=ussp` until session-level tenant binding ships. |
| Login worked but the user sees USSP branding on a tenant domain | This is the same auth-route exception — the user got auto-provisioned with `site_id=ussp`. Their *pages* still resolve to the right tenant via middleware, but their `staff_users` row points at the wrong site. | Manual fix: `UPDATE staff_users SET site_id = '<tenant>' WHERE email = ?;` Long-term fix is on the roadmap (session carries tenant binding from referer/host at sign-in time). |
| `redirect_uri_mismatch` on a brand-new tenant even after Step 4 | Google's redirect URI changes can take up to 5 min to propagate. | Wait 5 min and retry. If still failing, confirm you saved the URI in the *correct* OAuth client (the one whose client ID is in the tools service's `GOOGLE_CLIENT_ID` env var — there's often a stale dev client kicking around). |
| Service serves a request but with stale env vars | Railway showed `SKIPPED` for the env-change deployment, meaning it didn't spin up a fresh container. The currently-active container is still running with old env. | Force a fresh deploy: `railway redeploy --service tools --yes`. |
| Multiple SKIPPED deployments in a row after env var changes | Service is in `SLEEPING` state — Railway's sleep mode doesn't spin up a new container for env-only changes. | A real request will wake it with new env, OR force with `railway redeploy --service tools --yes`. |

### How Google's `redirect_uri_mismatch` is *different* from `error=Configuration`

These look similar to a user but mean different things:

- **`redirect_uri_mismatch`** is from **Google** — happens *before* the OAuth handshake completes. Google rejected the `redirect_uri` parameter we sent because it's not in the client's authorized list. Fix: add to Google Cloud Console (Step 4).
- **`error=Configuration`** is from **Auth.js** — happens *after* Google sent the user back. Our app couldn't validate the callback (usually because the state cookie wasn't on the right host). Fix: env vars (top of this doc) and the lazy-factory pattern.

If you're not sure which one you're getting, look at the URL the user lands on:
- Lands on `accounts.google.com` with an error → it's Google
- Lands on `/login?error=Configuration` (your own domain) → it's Auth.js

### Diagnosing live: dump the runtime callback URL

```bash
# (1) What URL is Auth.js sending to Google as redirect_uri?
rm -f /tmp/c.txt
CSRF=$(curl -sk -c /tmp/c.txt https://<tenant>/api/auth/csrf | jq -r .csrfToken)
curl -sk -b /tmp/c.txt -X POST "https://<tenant>/api/auth/signin/google" \
  -H "content-type: application/x-www-form-urlencoded" \
  -H "x-auth-return-redirect: 1" \
  -d "csrfToken=$CSRF&callbackUrl=%2F" \
  | jq -r '.url' | python -c "import sys,urllib.parse; q=urllib.parse.parse_qs(urllib.parse.urlparse(sys.stdin.read().strip()).query); print('redirect_uri:', q.get('redirect_uri',['MISSING'])[0])"
rm -f /tmp/c.txt
```

What you want to see: `https://<tenant>/api/auth/callback/google` (matches the host you queried). If you see `localhost:3000` → lazy-factory workaround isn't active. If you see a different tenant host → `AUTH_URL` is set.

---

## Reference

### Tables involved

| Table | Purpose | Keyed by |
|---|---|---|
| `sites` | Canonical site/tenant registry, FK target for `staff_users.site_id` and other multi-tenant tables | `id` (string slug, e.g., `"tranzin"`) |
| `tenants` | AI Tools-specific config: branding, auth provider, auto-provision, entitlements scope, owner flag | `site_id` (FK to `sites.id`) |
| `tenant_tool_entitlements` | Per-tenant tool toggles | `(site_id, tool_key)` |
| `staff_users` | Per-tenant user roster | `(site_id, email)` |

### Roles

`admin` (full access) · `recruiter` · `sales` · `viewer` (default for auto-provisioned). See `packages/platform-core/src/auth/rbac.ts`.

### Tool keys

`readiness` · `engagements` · `governance` · `methodology` · `tools`

### How a request resolves to a tenant

1. Request hits `https://<domain>` → Railway/Fastly edge
2. `packages/ai-tools/src/middleware.ts` runs: reads `Host` (or `x-forwarded-host`)
3. Calls `getTenantByDomain(host)` → looks up `tenants.domain = host`
4. If found: sets `x-tenant-site-id: <site_id>` on the forwarded request → 200
5. If not found: returns 404. **Does not fall back to a default tenant.** This is intentional (data-leak protection).
6. Downstream code calls `getSiteId()` → reads the header → all queries filter by that `site_id`

### Suspending a tenant

1. Admin UI → Tenant Management → tenant detail → **Suspend Tenant**
2. Or directly: `UPDATE tenants SET active = false WHERE site_id = '<id>'` (the middleware excludes `active = false` rows from the lookup)

Data is preserved. Reactivate by flipping `active = true`.

### Decommissioning a tenant

1. Suspend first (Step above)
2. Drop their custom domain from Railway (Settings → Networking → ✕)
3. Remove their DNS records at the registrar
4. Remove the redirect URI from the OAuth client
5. Optional: delete `tenant_tool_entitlements` and `staff_users` rows. Keep `tenants` and `sites` rows for audit history (with `active = false`).

### Worked example: Tranzin

- Site ID: `tranzin`
- Domain: `app.tranzin.com` (registered in Naren Kollu's GoDaddy account; Vinay has delegate access)
- DB rows inserted via REST: `sites`, `tenants`, `tenant_tool_entitlements` (5 rows), `staff_users` (Naren admin + Ashvin viewer)
- Railway: added `app.tranzin.com` to `tools` service (CNAME target `z0rb3br5.up.railway.app`)
- DNS: `CNAME app → z0rb3br5.up.railway.app`, `TXT _railway-verify.app → railway-verify=941b9bbb…`
- Google OAuth: `https://app.tranzin.com/api/auth/callback/google` added to **USSP Back Office** client
- Branding: gold `#D4AF37`, tagline "Outcomes First. Technology Second."
