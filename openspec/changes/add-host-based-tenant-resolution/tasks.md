# Tasks

## 1. Foundation — request-aware tenant resolution

- [x] 1.1 Add `getTenantByDomain(domain: string)` to `packages/platform-core/src/queries/admin/tenants.ts` — returns the full tenant row or `null`.
- [x] 1.2 Refactor `getSiteId()` in `packages/platform-core/src/config.ts` — try `x-tenant-site-id` header first, then fall back to `process.env.SITE_ID`. Throw if neither resolves. (Synchronous; the async DB lookup happens in middleware so the 308 existing call sites stay sync.)
- [x] 1.3 Refactor `getSiteConfig()` in the same file — removed module-level cache (was a multi-tenant data-leak class). siteDomain now sourced from request host when available.
- [~] 1.4 ~~Add a `getSiteIdFromHost(host: string)` helper in `config.ts`~~ — intentionally not extracted; middleware calls `getTenantByDomain` directly. Add later if a second caller needs it.
- [x] 1.5 In `NODE_ENV === 'production'`, log a structured warning when fallback to `process.env.SITE_ID` fires *while* a `Host` header is present (signals a regression in request-context detection).
- [x] 1.6 Build platform-core: `cd packages/platform-core && npx tsc` — no type errors.

## 2. Middleware — set `x-tenant-site-id`

- [x] 2.1 Create `packages/ai-tools/src/middleware.ts` with `runtime = 'nodejs'` and matcher excluding static assets and Next internals. (NextAuth callbacks deliberately included so signin sees the right tenant.)
- [x] 2.2 Resolve the request host via `request.headers.get('x-forwarded-host')` falling back to `host` (port stripped, lowercased), call `getTenantByDomain`.
- [x] 2.3 If a tenant matches: set `x-tenant-site-id` on the forwarded request headers, continue.
- [x] 2.4 If no tenant matches: respond 404. In non-production, the body includes the resolved host and instructions for adding the missing tenant via `/admin/tenants`.
- [ ] 2.5 (Deferred — optional) 60s in-memory `Map<host, siteId>` cache in middleware to skip DB on warm requests. Skipped for v1; re-evaluate after seeing production query latencies.

## 3. NextAuth — multi-tenant single-client

- [x] 3.1 ~~Refactor NextAuth route to derive `redirect_uri` from request host~~ — already works as-is. NextAuth has `trustHost: true` (admin-config.ts:69) and computes redirect_uri from the current request host. No code change needed.
- [x] 3.2 ~~In `signIn` callback, resolve the user's tenant from the request host~~ — already works. Callback calls `getSiteId()` which is now request-aware. (admin-config.ts:84,153 — no edits required, behaviour shifts automatically once getSiteId is request-aware.)
- [x] 3.3 ~~In `session` callback, attach resolved `site_id` to the session token~~ — already does. (admin-config.ts:166: `t.siteId = siteId`.)
- [ ] 3.4 (Deferred to Phase 2 hardening) Session-token rotation safety check — if a token's `site_id` doesn't match the current request's tenant, force re-auth. NOT critical for v1 because cookies are domain-scoped (a Tranzin cookie won't be sent to USSP and vice versa). Belt-and-suspenders defense — add later.

## 4. Tests

- [ ] 4.1 (Deferred) `packages/platform-core/src/__tests__/config.test.ts` — request-ctx vs fallback cases. Manual smoke test on USSP first; add unit coverage in a follow-up PR before adding more tenants.
- [ ] 4.2 (Deferred) `packages/ai-tools/src/__tests__/middleware.test.ts`.
- [ ] 4.3 (Deferred) `packages/ai-tools/src/__tests__/auth-multitenant.test.ts`.
- [ ] 4.4 (Deferred) Run full test suite. Pre-existing tests still pass after `npx tsc --noEmit` succeeds in both packages — that's the current bar; vitest run deferred to follow-up.

## 5. USSP regression validation (Phase 1 deploy)

- [ ] 5.1 Deploy to the existing `tools` Railway service. Do NOT add any new domain yet.
- [ ] 5.2 Smoke test 10 representative pages on `tools.ussp.co` (engagements list, single engagement, readiness assessment, sidebar entitlements, signin, signout, admin tenant list, admin user list, methodology page, profile page).
- [ ] 5.3 Compare query latencies and error rates against the pre-deploy baseline (24-hour window). Roll back if p95 latency rises >20% or error rate rises >0.1%.
- [ ] 5.4 Confirm no entries appear in the production warning log from task 1.5 (the "fallback fired with Host present" warning).
- [ ] 5.5 Soak for 24 hours before proceeding to phase 2.

## 6. Add Tranzin (Phase 2)

- [ ] 6.1 In Railway dashboard, add `app.tranzin.com` as a custom domain on the existing `tools` service. Capture the CNAME target and TXT verification token.
- [ ] 6.2 Set GoDaddy DNS for tranzin.com: CNAME `app` → Railway target, TXT `_railway-verify.app` → token (use the existing `TRANZIN_GODADDY_API_KEY` in `.env.local`).
- [ ] 6.3 Update the existing Google OAuth client in Google Cloud Console — add `https://app.tranzin.com/api/auth/callback/google` to authorized redirect URIs.
- [ ] 6.4 Verify https://app.tranzin.com loads with Tranzin branding (logo, navy/gold colors, tagline) — pulled from the `tenants` row.
- [ ] 6.5 Sign in as Naren (`admin@tranzin.com`); confirm sidebar shows only the 5 enabled tools and that `engagements`, `readiness`, etc. data is empty (Tranzin has no records yet).
- [ ] 6.6 Sign in as Vinay (`vinay@lagisetty.com`) on `tools.ussp.co`; confirm USSP data still appears unchanged. No cross-contamination.

## 7. Document and clean up (Phase 3)

- [x] 7.1 Rewrite `docs/ai-tools/14-tenant-onboarding.md` — completed 2026-05-01. New flow: (1) DB rows via Admin UI or REST, (2) Custom domain on existing `tools` service, (3) DNS records, (4) Add redirect URI to "USSP Back Office" OAuth client, (5) Verify. Tranzin worked example included.
- [ ] 7.2 Add a brief "host-based tenancy" section to `packages/platform-core/README.md` (or create one) explaining the request-context model for new contributors.
- [x] 7.3 ~~Decommission `tranzin-tools` Railway service~~ — no-op; never provisionally created. Onboarding went directly via the host-based path.
- [ ] 7.4 Archive this OpenSpec change after one week of stable production: `openspec archive add-host-based-tenant-resolution`.
