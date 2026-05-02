# Change: Host-Based Tenant Resolution for AI Tools

## Why

The AI Tools platform (`packages/ai-tools/`) currently scales tenancy by **deploying a separate Railway service per tenant**: `tools` for USSP (`SITE_ID=ussp`, `tools.ussp.co`), and a second service planned for Karsan (`SITE_ID=karsan`, `tools.karsan.io`). Each new tenant requires a new Railway service, a new SSL cert, a new deploy pipeline, and per-service env-var maintenance.

`packages/platform-core/src/config.ts:5-14` reads `process.env.SITE_ID` once at process startup and caches it as a singleton. Every multi-tenant query in the platform (308 call sites of `getSiteId()` / `getSiteConfig()` across 59 files) reads from that singleton, so a single Railway process is permanently bound to one tenant.

Trigger: Tranzin is being onboarded as a new tenant on `app.tranzin.com`. Rather than spinning up a third Railway service (`tranzin-tools`), and a fourth for the next partner after that, we want **one AI Tools service that serves all tenants** — resolved at request time from the incoming `Host` header against the existing `tenants.domain` column.

This change is purely infrastructure-internal — no schema migration, no behaviour change for users, no breakage of existing call sites.

## What Changes

### Tenant resolution becomes request-aware (modified)

- `getSiteId()` and `getSiteConfig()` in `packages/platform-core/src/config.ts` SHALL detect the current request's `Host` header (via Next.js `headers()` API) and look up the matching tenant by domain. The result SHALL be cached per-request via React's `cache()` so the 16 calls inside `ai-engagements.ts` only hit the DB once.
- When called outside a request context (build time, scripts, dev shell), the functions SHALL fall back to `process.env.SITE_ID` to preserve current behaviour.
- Public function signatures SHALL remain unchanged so the 308 existing call sites compile and run untouched.

### New: tenant-resolution middleware

- A new `packages/ai-tools/src/middleware.ts` SHALL run on every request, look up the tenant by host, and write the resolved `site_id` into a request header `x-tenant-site-id` for downstream handlers.
- If the host doesn't match any tenant, the middleware SHALL respond with 404 (and a developer-friendly message in non-production).

### NextAuth becomes multi-tenant single-client

- `packages/ai-tools/src/app/api/auth/[...nextauth]/route.ts` SHALL accept callbacks for any tenant domain registered in the `tenants` table.
- A single Google OAuth Client SHALL be configured with multiple authorized redirect URIs (`https://tools.ussp.co/api/auth/callback/google`, `https://app.tranzin.com/api/auth/callback/google`, etc.). NextAuth resolves the right one from the request's host automatically.
- On signin, the user's tenant SHALL be determined from the request host (same resolution as queries), and the user-tenant linkage in `staff_users` SHALL be enforced against that resolved tenant.

### Onboarding becomes DB-row + DNS

- `docs/ai-tools/14-tenant-onboarding.md` SHALL be updated. New tenants no longer need a Railway service. Steps reduce to: (1) Tenant Management UI creates the row, (2) DNS CNAME points the new domain at the shared service.

## Impact

- **Affected specs:** `tenant-resolution` (new).
- **Affected code:**
  - `packages/platform-core/src/config.ts` — refactor `getSiteId()`/`getSiteConfig()` to be request-aware with env-var fallback. Add new helper `getSiteIdFromHost(host)`.
  - `packages/platform-core/src/queries/admin/tenants.ts` — add `getTenantByDomain(domain)` query (cached per request).
  - `packages/ai-tools/src/middleware.ts` — new file, host → tenant resolution + header injection + 404 on miss.
  - `packages/ai-tools/src/app/api/auth/[...nextauth]/route.ts` — refactor to derive tenant from request host on signin and callback.
  - `docs/ai-tools/14-tenant-onboarding.md` — rewrite to reflect new flow.
  - `packages/ai-tools/src/__tests__/middleware.test.ts` — new test file.
  - `packages/platform-core/src/__tests__/config.test.ts` — extend tests for request-context vs fallback behaviour.
- **Affected services:**
  - Existing `tools` Railway service stays as the canonical AI Tools deployment.
  - Tranzin's incoming `app.tranzin.com` will be added as a custom domain on the existing `tools` service (no new Railway service created).
  - Future planned `tranzin-tools` and `karsan-tools` Railway services are no longer needed.
- **Out of scope:**
  - `packages/backoffice` — the backoffice stays service-per-tenant (it's USSP-admin-only).
  - The public marketing sites (`src/app/`, `partners/tranzin/website/`) — those are static, separate Railway services, and don't share this architecture.
  - Database schema — `tenants.domain` already exists.
- **Risks:** see design.md.
