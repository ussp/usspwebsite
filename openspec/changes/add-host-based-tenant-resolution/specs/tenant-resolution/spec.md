## ADDED Requirements

### Requirement: Request-Scoped Tenant Resolution

The AI Tools service SHALL resolve the active tenant for each incoming HTTP request by matching the request's `Host` header (preferring `x-forwarded-host` when present) against the `tenants.domain` column in the database. The resolved `site_id` SHALL be available to all server-side code (server components, server actions, API routes, query functions) without explicit threading of a request parameter.

#### Scenario: Request to a registered tenant domain

- **WHEN** an HTTP request arrives with `Host: app.tranzin.com` and a `tenants` row exists with `domain = 'app.tranzin.com'` and `site_id = 'tranzin'`
- **THEN** the platform's `getSiteId()` function returns `'tranzin'`
- **AND** every query executed during this request filters data by `site_id = 'tranzin'`
- **AND** the resolved tenant is determined exactly once per request (no repeated DB lookups for the same host within the request)

#### Scenario: Request with x-forwarded-host (CDN / proxy)

- **WHEN** an HTTP request arrives with `Host: tools-production.up.railway.app` and `x-forwarded-host: app.tranzin.com`
- **THEN** the platform resolves the tenant using the value from `x-forwarded-host`, not `Host`
- **AND** the resolved `site_id` is `'tranzin'`

#### Scenario: Request to an unregistered host

- **WHEN** an HTTP request arrives with `Host: not-a-tenant.example.com` and no `tenants` row matches that domain
- **THEN** the middleware responds with HTTP 404
- **AND** no downstream handler executes for that request
- **AND** no tenant's data is served by default

### Requirement: Environment Variable Fallback Outside Request Context

When platform-core code runs outside any HTTP request (build steps, seed scripts, Alembic migrations, dev shells, tests with no request mock), `getSiteId()` SHALL fall back to the `SITE_ID` environment variable. This preserves existing behaviour for non-request contexts.

#### Scenario: Seed script run from CLI

- **WHEN** a developer runs `SITE_ID=ussp npx tsx scripts/seed-jobs.ts` from a shell
- **THEN** `getSiteId()` returns `'ussp'` from the env var
- **AND** the script seeds USSP data as it does today

#### Scenario: No request context and no env var

- **WHEN** code calls `getSiteId()` outside a request and `SITE_ID` is unset
- **THEN** the function throws the existing error message indicating `SITE_ID` must be set

#### Scenario: Production fallback fires while a Host header is available

- **WHEN** a request is in flight (Host header present), but the request-context detection fails and `getSiteId()` falls back to the env var in `NODE_ENV === 'production'`
- **THEN** the platform emits a structured warning log entry containing the resolved host and the env-var value used
- **AND** the request still completes (the fallback is not fatal) so production traffic is not interrupted

### Requirement: Per-Request Tenant Cache

The platform SHALL look up a tenant from the database at most once per HTTP request, regardless of how many times `getSiteId()` or `getSiteConfig()` is called within that request.

#### Scenario: Many getSiteId calls within one request

- **WHEN** a single request handler calls `getSiteId()` 16 times (e.g., the existing `ai-engagements.ts` query module)
- **THEN** the database is queried for the tenant at most once during that request
- **AND** all 16 calls return the same value

#### Scenario: Cache does not leak across requests

- **WHEN** two concurrent requests arrive for two different tenants
- **THEN** each request resolves to its own tenant
- **AND** no request observes a value cached from a different request

### Requirement: Multi-Tenant Authentication via Single OAuth Client

The AI Tools NextAuth configuration SHALL support all tenant domains through a single Google OAuth client with multiple authorized redirect URIs registered in Google Cloud Console.

#### Scenario: Sign-in flow stays on the originating tenant domain

- **WHEN** a user clicks "Sign in with Google" on `app.tranzin.com`
- **THEN** NextAuth uses `https://app.tranzin.com/api/auth/callback/google` as the redirect URI
- **AND** the OAuth callback returns to `app.tranzin.com`, not to `tools.ussp.co`

#### Scenario: User signs in to the wrong tenant

- **WHEN** a user whose email is registered in `staff_users` for `site_id = 'ussp'` only attempts to sign in on `app.tranzin.com`
- **AND** the Tranzin tenant has `auto_provision = false`
- **THEN** sign-in is rejected
- **AND** the user is shown an error explaining their account is not registered for this tenant

#### Scenario: Session token replay across tenants

- **WHEN** a session token issued for `site_id = 'ussp'` is presented to a request whose resolved tenant is `'tranzin'`
- **THEN** the session is invalidated for that request
- **AND** the user is redirected to sign in again on the correct tenant

### Requirement: Public Function Signatures Preserved

The public signatures of `getSiteId(): string` and `getSiteConfig(): SiteConfig` exported from `packages/platform-core/src/config.ts` SHALL remain backwards-compatible. Existing call sites (308 across 59 files) SHALL compile and run without modification.

#### Scenario: Existing query function compiles and runs unchanged

- **WHEN** the refactor lands and existing code in `packages/platform-core/src/queries/admin/ai-engagements.ts` is unchanged
- **THEN** the file compiles under `npx tsc` with no new errors
- **AND** all of its 16 internal `getSiteId()` calls return the correct value at runtime
