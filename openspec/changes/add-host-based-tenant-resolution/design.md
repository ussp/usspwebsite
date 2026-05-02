# Design: Host-Based Tenant Resolution

## Context

The AI Tools service (`packages/ai-tools/`) is multi-tenant in the data layer (every row has `site_id`, every query filters by it via `getSiteId()`), but **single-tenant at runtime** — `process.env.SITE_ID` is read at startup, cached, and used to filter all queries for the lifetime of the process. So each tenant requires its own Railway service.

This design replaces the runtime-singleton with a request-scoped resolver that determines `site_id` from the incoming `Host` header against the `tenants.domain` column.

Stakeholders:
- **Platform engineers (Vinay et al.)** — own the codebase, want fewer Railway services to maintain, want onboarding to be a DB-row + DNS change.
- **Tenant admins (Naren for Tranzin, future partners)** — want their domain (`app.tranzin.com`) to serve a branded AI Tools app at low cost. Don't care about the underlying infra.
- **End users (consultants signing in)** — should see no behavioural change. Same login, same data isolation, same tools.
- **USSP super-admins** — already have cross-tenant admin views via `is_owner=true`. Those continue to work.

The 308 existing call sites of `getSiteId()` and `getSiteConfig()` make a "thread the request through every call" refactor impractical. We need a solution that keeps signatures stable.

## Goals / Non-Goals

**Goals:**
- One Railway service serves all AI Tools tenants. New tenants onboard with a DB row + DNS record only.
- The 308 existing call sites compile and run unchanged.
- Per-request DB lookup of tenant happens at most once, regardless of how many `getSiteId()` calls a request makes.
- USSP behaviour is regression-tested before any new tenant is added.
- Auth callbacks work correctly for every tenant domain via a single Google OAuth client with multiple authorized redirect URIs.
- A request to a host that doesn't match any tenant fails fast (404) rather than silently leaking another tenant's data.
- Build, dev, and script execution (no request context) continue to work via the existing `SITE_ID` env-var fallback.

**Non-Goals:**
- Refactoring `packages/backoffice/` — backoffice is USSP-admin-only and stays service-per-tenant.
- Changing the `tenants` table schema. `tenants.domain` already exists and is unique-indexable.
- Building a tenant admin self-service flow. Onboarding still goes through the existing `/admin/tenants` UI managed by USSP super-admins.
- Replacing NextAuth or moving to a different auth library.
- Multi-region / multi-cluster deployment — out of scope for this change.

## Decisions

### 1. Request context detection via Next.js `headers()`, not a threaded parameter

**Decision:** Refactor `getSiteId()` to internally call `headers()` from `next/headers` and read `host` (or `x-forwarded-host`). Look up the tenant by domain. Cache via React `cache()`.

**Alternatives considered:**
- *Thread `request` or `siteId` through every function signature* — rejected. 308 call sites across 59 files means hundreds of touchpoints, easy to miss callers, breaks every public function signature in `platform-core`. Risk of regressions in the existing well-tested USSP path is high.
- *AsyncLocalStorage to hold per-request context* — rejected. Works in plain Node, but Next.js App Router already provides `headers()` for this exact purpose, with built-in support for both Node and Edge runtimes. Don't reinvent the request-context wheel.
- *Rely solely on a custom `x-tenant-site-id` header set by middleware* — rejected as the only mechanism. Middleware in Next.js doesn't run for every kind of server invocation (e.g., during streaming or in some edge cases), so we still need a code-path fallback. The middleware is an *optimization*, not the source of truth.

**Why `headers()`:** Stable Next.js API, works in server components and server actions, works in API routes, has a clean error when called outside a request (we catch it and fall back to env var).

### 2. React `cache()` for per-request memoization

**Decision:** Wrap the `getTenantByDomain(host)` DB lookup in React's `cache()` utility. The 16 `getSiteId()` calls inside `ai-engagements.ts` will resolve to one DB query per request.

**Alternatives considered:**
- *Custom Map keyed by host* — rejected. Persists across requests, leaks memory, and gets stale when tenants change. React `cache()` is request-scoped automatically.
- *No caching, hit DB on every call* — rejected. 308 call sites × N requests/sec would hammer Supabase pointlessly. Tenant rows change rarely; per-request memoization is correct.
- *Module-level Map with TTL* — rejected. Adds complexity (eviction logic, race conditions) for marginal benefit over `cache()`.

### 3. Middleware sets `x-tenant-site-id` header for fast-path reads

**Decision:** A Next.js middleware (`packages/ai-tools/src/middleware.ts`) runs on every request, resolves the tenant by `Host`, and writes `x-tenant-site-id` to the forwarded request headers. Downstream code reads this header first; if absent, it falls back to a fresh DB lookup (which is itself cached).

**Why:** Middleware-resolved header is the *fast path* — server components read it without touching the DB at all in the common case. The DB-lookup fallback exists for routes the middleware doesn't cover (rare in App Router) and for tests.

**Tradeoff:** Middleware needs DB access. Edge runtime can't easily reach Supabase, so the middleware MUST run in the Node.js runtime (`export const runtime = 'nodejs'`). This costs a tiny bit of cold-start latency vs. Edge but matches what `tools.ussp.co` already does today.

### 4. Single Google OAuth client, multiple registered redirect URIs

**Decision:** Use one Google Cloud OAuth client (the existing `tools.ussp.co` one) and add `https://app.tranzin.com/api/auth/callback/google` (and any future tenant domain) as additional authorized redirect URIs on the same client.

**Alternatives considered:**
- *One Google OAuth client per tenant* — rejected. Adds operational burden (manage N OAuth clients, store N pairs of secrets, juggle which one to use per request). The current onboarding doc step 7 already implies one client per tenant; this change supersedes it.
- *Separate OAuth client per tenant, but shared client_secret* — rejected. Insecure and unsupported by Google.

**Why one client:** NextAuth's redirect_uri is determined by the request host. As long as the redirect URI is registered, Google accepts it. The user's email + tenant linkage is enforced server-side after the OAuth callback (against `staff_users.site_id`), not by Google.

**Implication for the existing onboarding doc:** Step 7 ("Register Google OAuth") becomes "add the new tenant's redirect URI to the existing OAuth client." Much faster.

### 5. Hard fail on unknown host (404)

**Decision:** If middleware resolves a host that doesn't match any `tenants.domain` row, return 404. Never default to USSP or any "fallback tenant."

**Why:** Defaulting to a fallback tenant on unknown host is a data-leak risk class. Better to fail loudly than silently serve the wrong tenant's data.

**Dev exception:** In `NODE_ENV !== 'production'`, the 404 page includes a hint pointing to `tenants` table contents and the resolved host, so misconfigured local dev is debuggable.

### 6. Env-var fallback ONLY when there is no request context

**Decision:** `getSiteId()` first tries `headers()`; if that throws (no request context), it falls back to `process.env.SITE_ID`. If both are absent, throw the existing error.

**Why:** Build steps, seed scripts (`scripts/seed-jobs.ts`), and migrations call platform-core functions outside any request. They've always relied on `SITE_ID` env var, and they should continue to. The fallback preserves their behaviour.

**Risk:** A bug in request-context detection could silently fall through to the env var and serve the wrong tenant in production. Mitigation: log a warning when fallback fires in `NODE_ENV === 'production'` AND when there's a `Host` header available (i.e., the request context detection failed unexpectedly).

## Risks

| Risk | Mitigation |
|---|---|
| **Breaking USSP** by introducing a regression in `getSiteId()` | Roll out in two phases: (a) ship the refactor with USSP-only DNS to the shared service and watch for regressions; (b) add Tranzin only after a stable USSP run. Keep an env-var override (`FORCE_SITE_ID`) for emergency rollback. |
| **Auth redirect mismatch** — user clicks "Sign in" on `app.tranzin.com`, lands on `tools.ussp.co/api/auth/callback/google` | NextAuth uses request host to compute redirect_uri. Validate in tests that `app.tranzin.com` requests stay on `app.tranzin.com` through the OAuth round-trip. |
| **Data leak via shared in-memory cache** — one tenant's data appears in another tenant's response | React `cache()` is request-scoped, not module-scoped. Add a test that simulates two concurrent requests for different tenants and asserts no cross-contamination. |
| **Edge runtime can't reach Supabase** in middleware | Force middleware to Node runtime via `export const runtime = 'nodejs'`. |
| **Slow first request per cold container** because middleware does a DB query | Tenant rows are tiny (~100 bytes). Add an optional in-memory cache of `domain → site_id` with short TTL (60s) at the middleware level only — invalidated on tenant CRUD. Defer to phase 2 if performance is fine without it. |
| **Tests pass but production fails** because tests stub `headers()` | Add an integration test that runs the actual middleware against a mock Next request and asserts the header propagates through to a downstream handler. |

## Rollout plan

1. **Phase 1 — Code only, no DNS changes.** Land the refactor, deploy to the existing `tools` service (still USSP-only). Run for ~24 hours with monitoring. Confirm no regression in USSP traffic, query latencies, error rates.
2. **Phase 2 — Add Tranzin.** Add `app.tranzin.com` as a custom domain on the `tools` Railway service. DNS at GoDaddy (already partly set up). Verify Tranzin signin works end-to-end. Confirm USSP still works.
3. **Phase 3 — Document and decommission.** Update `docs/ai-tools/14-tenant-onboarding.md`. Decommission the planned `tranzin-tools` Railway service if it was created.

Each phase is a separate PR, separately reviewable, separately revertable.
