# Tenant Onboarding Guide — AI Transformation Tools

> **Architecture note:** As of OpenSpec change `add-host-based-tenant-resolution` (commit `99ea3d6`, 2026-05-01), the AI Tools platform runs as **a single Railway service that serves all tenants**. Tenants are resolved at request time from the `Host` header against the `tenants.domain` column. **Do NOT create a new Railway service per tenant.**

This guide walks through onboarding a new white-label client onto the shared `tools` Railway service. Each new client gets:

- Their own custom domain (e.g., `app.client.com`)
- Their own brand (logo, primary color, tagline)
- Their own user roster, isolated by `site_id` row-level filtering
- Access to whichever AI tools you enable for them

A first-time onboarding takes **~10 minutes** end-to-end if everything's in hand.

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
