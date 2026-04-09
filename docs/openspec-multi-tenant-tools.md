# OpenSpec: Multi-Tenant AI Tools Platform
## Domain-Based Tenant Isolation with Tool Entitlements

**Version:** 1.0
**Date:** 2026-04-09
**Status:** Draft
**Author:** USSP Engineering

---

## 1. Overview

Enable the AI Transformation Tools platform (`packages/ai-tools/`) to serve multiple tenants (organizations) from the same codebase, each with:

- **Separate domains** — `tools.ussp.co` (USSP), `tools.karsan.io` (Karsan)
- **Separate auth providers** — Google OAuth (USSP), Azure AD / Microsoft (Karsan)
- **Data isolation** — each tenant sees only their own engagements, teams, assessments
- **Tool entitlements** — USSP admins control which platform features each tenant can access
- **White-label sidebar** — tenant-specific branding and nav items based on entitlements

---

## 2. Problem Statement

Karsan Consulting Services wants to use USSP's AI Transformation Tools for their DCFS engagement. Requirements:

1. Karsan staff authenticate via their existing Azure AD (Microsoft 365/SharePoint SSO)
2. Karsan users see **only** Karsan engagements, teams, and assessments
3. USSP controls **which tools** Karsan has access to (e.g., Transformation Monitor yes, GRC no)
4. The platform must remain a single codebase / single Railway deployment per tenant
5. USSP's own access (`tools.ussp.co`) is unaffected

Currently the platform only supports Google OAuth and has no concept of per-tenant feature gating.

---

## 3. Solution Architecture

### 3.1 Deployment Model: Option A — Separate Services (Recommended)

Two Railway services from the same repo, differentiated by environment variables:

| Config | USSP Service | Karsan Service |
|--------|-------------|----------------|
| Domain | `tools.ussp.co` | `tools.karsan.io` |
| `SITE_ID` | `ussp` | `karsan` |
| `AUTH_PROVIDER` | `google` | `microsoft` |
| `AUTH_TRUST_HOST` | `true` | `true` |
| `AUTH_GOOGLE_ID` | `<ussp-google-id>` | — |
| `AUTH_GOOGLE_SECRET` | `<ussp-google-secret>` | — |
| `AUTH_MICROSOFT_ID` | — | `<karsan-azure-client-id>` |
| `AUTH_MICROSOFT_SECRET` | — | `<karsan-azure-client-secret>` |
| `AUTH_MICROSOFT_TENANT` | — | `<karsan-azure-tenant-id>` |
| `SITE_NAME` | `USSP` | `Karsan` |
| `SITE_DOMAIN` | `tools.ussp.co` | `tools.karsan.io` |

Data isolation is automatic — all queries already filter by `site_id`.

### 3.2 Auth Provider Abstraction

**File:** `packages/platform-core/src/auth/admin-config.ts`

Extend `createAdminAuth` to support multiple OAuth providers:

```typescript
export interface CreateAdminAuthOptions {
  provider?: "google" | "microsoft";  // default: "google"
  // Google
  googleClientId?: string;
  googleClientSecret?: string;
  // Microsoft / Azure AD
  microsoftClientId?: string;
  microsoftClientSecret?: string;
  microsoftTenantId?: string;         // restricts to single Azure AD tenant
  signInPage?: string;
}
```

**Behavior:**
- `provider=google` (default): Current behavior, unchanged
- `provider=microsoft`: Uses `next-auth/providers/microsoft-entra-id` (formerly Azure AD)
  - `tenantId` restricts login to Karsan's Azure AD tenant only
  - On first sign-in, auto-create `staff_users` record with `site_id=karsan` and default role `viewer`
  - Or, require pre-registration in `staff_users` (same as current Google flow)

**Login page** detects provider from env and shows the appropriate button:
- Google: "Sign in with Google"
- Microsoft: "Sign in with Microsoft"

### 3.3 Tool Entitlements System

#### 3.3.1 Database Schema

New table: `tenant_tool_entitlements`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `site_id` | VARCHAR(50) | FK — tenant identifier (e.g., `karsan`) |
| `tool_key` | VARCHAR(100) | Feature/tool identifier |
| `enabled` | BOOLEAN | Whether this tenant can access the tool |
| `enabled_by` | UUID | FK to `staff_users.id` (who enabled it) |
| `enabled_at` | TIMESTAMP | When it was enabled |
| `created_at` | TIMESTAMP | Row creation time |
| `updated_at` | TIMESTAMP | Last update time |

**Unique constraint:** `(site_id, tool_key)`

#### 3.3.2 Tool Keys Registry

Each gatable feature has a unique key:

| Tool Key | Sidebar Label | Description |
|----------|--------------|-------------|
| `readiness` | Readiness Assessment | Step 1 — AI capability evaluation |
| `engagements` | Transformation Monitor | Step 2 — Before/after training measurement |
| `governance` | GRC & Compliance | Step 3 — Policy, risk, audit tracking |
| `methodology` | Methodology & Research | Frameworks, papers, citations |
| `tools.dora-calculator` | DORA Metrics Calculator | Free public tool |
| `tools.change-failure-rate` | Change Failure Rate | Free public tool |
| `tools.cycle-time-calculator` | Cycle Time Calculator | Free public tool |
| `tools.velocity-calculator` | Sprint Velocity Calculator | Free public tool |
| `tools.ai-roi-calculator` | AI ROI Calculator | Free public tool |

**Rules:**
- USSP (`site_id=ussp`) always has **all tools enabled** (owner tenant, not gated)
- New tenants start with **no tools enabled** — USSP admin explicitly enables them
- Tool keys use dot notation for hierarchy: `tools.*` = all free public tools

#### 3.3.3 Entitlement Check Flow

```
Request → Auth (session with siteId) → Check entitlements → Render
```

1. On login, session includes `siteId` (already implemented)
2. Sidebar component fetches entitlements for the session's `siteId`
3. Non-entitled nav items are hidden (not shown as disabled — clean removal)
4. API routes for gated features also check entitlements (defense in depth)
5. Entitlements are cached per session (revalidate on page reload)

### 3.4 USSP Super Admin: Cross-Tenant Management Console

**Route:** `/admin/tenants` (only visible to USSP owner-tenant admins: `is_owner=true` + role `admin`)

USSP admins have **full control** over all tenants — they can create tenants, enable/disable tools, add/remove/deactivate users, and manage branding for every site from a single console.

#### 3.4.1 Tenant List View (`/admin/tenants`)

| Column | Source |
|--------|--------|
| Tenant Name | `tenants.name` |
| Domain | `tenants.domain` |
| Auth Provider | Google / Microsoft |
| Status | Active / Suspended |
| Active Users | Count of `staff_users` where `active=true` for that `site_id` |
| Tools Enabled | Count of enabled entitlements |
| Actions | Configure / Suspend / Activate |

**Actions:**
- **+ New Tenant** button → `/admin/tenants/new`
- **Suspend** toggle → sets `tenants.active=false`, blocks all logins for that tenant
- **Configure** → `/admin/tenants/[siteId]`

#### 3.4.2 Create Tenant (`/admin/tenants/new`)

Form fields:

| Field | Required | Notes |
|-------|----------|-------|
| Site ID | Yes | Lowercase, unique, permanent (e.g., `acme`) |
| Full Name | Yes | "Acme Consulting Group" |
| Short Name | Yes | "Acme" (used in UI branding) |
| Domain | Yes | `tools.acme.com` |
| Auth Provider | Yes | Dropdown: Google / Microsoft |
| Auto-Provision | No | Toggle — auto-create users on first login |
| Default Role | No | Role for auto-provisioned users (default: `viewer`) |
| Allowed Domain | No | Email domain restriction for Google (e.g., `acme.com`) |
| Logo | No | Upload or URL |
| Primary Color | No | Color picker (default: `#2563EB`) |

#### 3.4.3 Tenant Detail / Configure (`/admin/tenants/[siteId]`)

Three cards on the detail page:

---

**Card 1: Tool Entitlements**

A checklist of all available tools with toggle switches:

```
┌─────────────────────────────────────────────┐
│  Tool Entitlements — Karsan                  │
├─────────────────────────────────────────────┤
│                                              │
│  1 · Assess                                  │
│  [x] Readiness Assessment                    │
│                                              │
│  2 · Transform                               │
│  [x] Transformation Monitor                  │
│                                              │
│  3 · Govern                                  │
│  [ ] GRC & Compliance                        │
│                                              │
│  Reference                                   │
│  [ ] Methodology & Research                  │
│  [x] Free Public Tools (all 5)               │
│                                              │
│  Last updated: 2026-04-09 by vinay@          │
└─────────────────────────────────────────────┘
```

Changes take effect immediately — tenant sidebar updates on next page load.

---

**Card 2: User Management**

USSP admins can **add, edit, deactivate, and change roles** for users on ANY tenant — not just their own.

```
┌──────────────────────────────────────────────────────────────┐
│  Users — Karsan (3 active, 1 inactive)          [+ Add User] │
├──────────────────────────────────────────────────────────────┤
│  Email                  │ Name           │ Role    │ Status  │
│  john@karsan.io         │ John Smith     │ admin   │ Active  │
│  sarah@karsan.io        │ Sarah Chen     │ viewer  │ Active  │
│  mike@karsan.io         │ Mike Johnson   │ viewer  │ Active  │
│  old@karsan.io          │ Old Employee   │ viewer  │ Inactive│
└──────────────────────────────────────────────────────────────┘
```

**Add User** — creates a `staff_users` record with the tenant's `site_id`:

| Field | Required | Notes |
|-------|----------|-------|
| Email | Yes | Must match tenant's `allowed_domain` if set |
| Full Name | Yes | |
| Role | Yes | Dropdown: `admin`, `recruiter`, `viewer` |

**Per-user actions:**
- **Change Role** — dropdown change, saves immediately
- **Deactivate** — sets `active=false`, user can no longer log in
- **Reactivate** — sets `active=true`
- **Remove** — deletes `staff_users` record (with confirmation)

**Important:** Tenant `admin` role users can manage their own tenant's users (scoped). USSP owner admins can manage users across ALL tenants (cross-tenant).

---

**Card 3: Tenant Info & Branding**

Editable fields:

| Field | Editable |
|-------|----------|
| Site ID | No (permanent) |
| Full Name | Yes |
| Short Name | Yes |
| Domain | Yes |
| Auth Provider | Yes (with warning — may break existing user logins) |
| Logo | Yes (upload / URL) |
| Primary Color | Yes (color picker) |
| Tagline | Yes |
| Auto-Provision | Yes (toggle) |
| Default Role | Yes |
| Allowed Domain | Yes |
| Status | Yes (Active / Suspended) |
| Created | No (display only) |

---

#### 3.4.4 RBAC for Cross-Tenant Management

| Permission | Who |
|-----------|-----|
| `tenants.read` | USSP owner admins |
| `tenants.create` | USSP owner admins |
| `tenants.update` | USSP owner admins |
| `tenants.manage_users` | USSP owner admins (cross-tenant) + tenant admins (own tenant only) |
| `tenants.manage_entitlements` | USSP owner admins only |
| `tenants.suspend` | USSP owner admins only |

**Key rule:** A tenant's own `admin` can manage users within their tenant. Only USSP owner admins can manage tools, entitlements, branding, and suspension across all tenants.

#### 3.4.5 Admin Sidebar Addition

Add to sidebar (visible only to USSP owner admins):

```typescript
// Only shown when session.siteId matches an is_owner=true tenant
{ href: "/admin/tenants", label: "Tenant Management", icon: "🏢", section: "Admin", toolKey: null },
```

### 3.5 Sidebar Entitlement Filtering

**File:** `packages/ai-tools/src/components/AdminSidebar.tsx`

Current `navItems` array becomes the master list. Each item gets a `toolKey` field:

```typescript
const navItems = [
  { href: "/", label: "Dashboard", icon: "📊", section: "", toolKey: null },  // always visible
  { href: "/readiness", label: "Readiness Assessment", ..., toolKey: "readiness" },
  { href: "/engagements", label: "Transformation Monitor", ..., toolKey: "engagements" },
  { href: "/governance", label: "GRC & Compliance", ..., toolKey: "governance" },
  { href: "/methodology", label: "Methodology & Research", ..., toolKey: "methodology" },
  { href: "/tools", label: "Free Public Tools", ..., toolKey: "tools" },
];
```

**Filtering logic:**
- If `toolKey` is `null` → always show (Dashboard)
- If `site_id === "ussp"` → show all (owner tenant)
- Otherwise → show only if `tenant_tool_entitlements` has `enabled=true` for that `tool_key`

### 3.6 White-Label Branding

When Karsan users access `tools.karsan.io`, the entire UI should feel like a Karsan product — no USSP references.

**Branding fields** (from `tenants` table):

| Field | USSP | Karsan |
|-------|------|--------|
| `name` | US Software Professionals | Karsan Consulting Services |
| `short_name` | USSP | Karsan |
| `logo_url` | `/assets/logos/ussp-logo.svg` | `/assets/logos/karsan-logo.svg` (or remote URL) |
| `primary_color` | `#2563EB` | Karsan brand color (TBD) |
| `tagline` | Assess - Transform - Govern | Assess - Transform - Govern (or custom) |

**Where branding applies:**

| Location | Current (USSP-only) | White-labeled |
|----------|---------------------|---------------|
| Sidebar header | "AI Transformation" | `tenant.short_name` + "AI Transformation" or custom |
| Sidebar footer | "Based on DORA, SPACE..." | Same (framework-neutral) |
| Page `<title>` | "... \| USSP" | "... \| Karsan" (from `SITE_NAME` env var) |
| Login page | "Sign in to USSP AI Tools" | "Sign in to Karsan AI Tools" |
| Dashboard greeting | "USSP AI Transformation" | "Karsan AI Transformation" |
| Metadata / OpenGraph | USSP branding | Tenant branding |
| Topbar / header | USSP references | Tenant name |
| Favicon | USSP icon | Tenant icon (via `favicon_url` field) |

**Implementation:**
- `SITE_NAME` env var already exists — drives `<title>` tags and metadata
- Add a `useTenant()` hook that reads tenant config (name, logo, colors) from session or API
- Sidebar, topbar, login page, and dashboard consume `useTenant()` for display
- Tenant logos stored in `/public/assets/logos/` or loaded from `logo_url` (external OK)
- Optional: `primary_color` override applied via CSS custom property on `<body>` for per-tenant accent color

### 3.7 Tenant Registry Table

New table: `tenants`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `site_id` | VARCHAR(50) | Unique tenant identifier |
| `name` | VARCHAR(255) | Full display name (e.g., "Karsan Consulting Services") |
| `short_name` | VARCHAR(50) | Short name for UI (e.g., "Karsan") |
| `domain` | VARCHAR(255) | Primary domain |
| `auth_provider` | VARCHAR(50) | `google` or `microsoft` |
| `logo_url` | VARCHAR(500) | Tenant logo for sidebar / login branding |
| `favicon_url` | VARCHAR(500) | Tenant favicon |
| `primary_color` | VARCHAR(7) | Brand accent color hex (e.g., `#2563EB`) |
| `tagline` | VARCHAR(255) | Optional tagline override |
| `is_owner` | BOOLEAN | `true` for USSP (can manage other tenants) |
| `active` | BOOLEAN | Whether tenant is active |
| `created_at` | TIMESTAMP | Row creation time |
| `updated_at` | TIMESTAMP | Last update time |

**Seed data:**

| site_id | name | domain | auth_provider | is_owner |
|---------|------|--------|---------------|----------|
| `ussp` | US Software Professionals | USSP | `tools.ussp.co` | `google` | `true` |
| `karsan` | Karsan Consulting Services | Karsan | `tools.karsan.io` | `microsoft` | `false` |

---

## 4. Database Migrations

### Migration 0021: Create tenant tables

```sql
-- tenants registry
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    domain VARCHAR(255),
    auth_provider VARCHAR(50) NOT NULL DEFAULT 'google',
    logo_url VARCHAR(500),
    favicon_url VARCHAR(500),
    primary_color VARCHAR(7) DEFAULT '#2563EB',
    tagline VARCHAR(255),
    auto_provision BOOLEAN NOT NULL DEFAULT FALSE,
    default_role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    allowed_domain VARCHAR(255),
    is_owner BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- tool entitlements
CREATE TABLE tenant_tool_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id VARCHAR(50) NOT NULL REFERENCES tenants(site_id),
    tool_key VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    enabled_by UUID REFERENCES staff_users(id),
    enabled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(site_id, tool_key)
);

-- Seed USSP as owner tenant
INSERT INTO tenants (site_id, name, domain, auth_provider, is_owner)
VALUES ('ussp', 'US Software Professionals', 'tools.ussp.co', 'google', true);
```

---

## 5. Implementation Checklist

### Phase 1: Auth Provider Abstraction
- [ ] Install `next-auth` Microsoft Entra ID provider: `npm install @auth/core`
- [ ] Extend `CreateAdminAuthOptions` with `provider`, Microsoft credentials
- [ ] Update `createAdminAuth` to conditionally use Google or Microsoft provider
- [ ] Update `ai-tools/src/lib/auth.ts` to pass `provider` from env
- [ ] Update login page to show correct provider button based on env
- [ ] Add `AUTH_PROVIDER`, `AUTH_MICROSOFT_*` env vars to `.env.example`
- [ ] Test: USSP login still works with Google
- [ ] Test: Microsoft login flow works with Azure AD test tenant

### Phase 2: Tenant Registry & Entitlements Schema
- [ ] Add `Tenant` and `TenantToolEntitlement` models to `migrations/models.py`
- [ ] Create Alembic migration `0021`
- [ ] Add TypeScript interfaces to `platform-core/src/types/admin.ts`
- [ ] Add queries: `getTenant`, `getAllTenants`, `getToolEntitlements`, `updateToolEntitlement`
- [ ] Add API routes in ai-tools: `/api/admin/tenants`, `/api/admin/tenants/[siteId]/entitlements`
- [ ] Seed USSP and Karsan tenants

### Phase 3: Sidebar Entitlement Filtering
- [ ] Add `toolKey` to sidebar `navItems`
- [ ] Create `useEntitlements()` hook — fetches and caches entitlements for session
- [ ] Filter sidebar nav items based on entitlements
- [ ] Add entitlement check middleware to gated API routes
- [ ] Test: Karsan user sees only enabled tools
- [ ] Test: USSP user sees all tools regardless

### Phase 4: Admin Tenant Management UI
- [ ] Create `/admin/tenants` page (list view)
- [ ] Create `/admin/tenants/[siteId]` page (detail/configure)
- [ ] Tool entitlements toggle card with save
- [ ] Tenant users read-only card
- [ ] Tenant info card
- [ ] Add "Tenant Management" to sidebar (visible only to USSP owner admins)
- [ ] RBAC: Add `tenants.*` permissions to admin role

### Phase 5: Karsan Deployment
- [ ] Create Railway service for Karsan (ai-tools-karsan)
- [ ] Configure env vars (SITE_ID=karsan, AUTH_PROVIDER=microsoft, etc.)
- [ ] Add custom domain `tools.karsan.io` in Railway
- [ ] Configure DNS CNAME for `tools.karsan.io`
- [ ] Register Azure AD app in Karsan's Microsoft Entra admin center
- [ ] Add redirect URI: `https://tools.karsan.io/api/auth/callback/microsoft-entra-id`
- [ ] Seed Karsan tenant and initial staff users
- [ ] USSP admin enables tools for Karsan via `/admin/tenants/karsan`
- [ ] End-to-end test: Karsan user login → sees only entitled tools → sees only Karsan data

---

## 6. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Cross-tenant data access | All queries filter by `site_id` (existing) + API routes verify session `siteId` matches request |
| Entitlement bypass via direct URL | API routes check entitlements server-side, not just sidebar hiding |
| Azure AD tenant restriction | `microsoftTenantId` config restricts login to Karsan's org only |
| USSP admin impersonation | Tenant management only available to `is_owner=true` tenant + `admin` role |
| Tool key tampering | Entitlement toggles validate `tool_key` against known registry |

---

## 7. New Tenant Onboarding (Repeatable Process)

The platform supports **unlimited tenants**. Karsan is the first, but any consulting firm, partner, or client can be onboarded using the same flow.

### 7.1 Self-Service Onboarding (via Admin UI)

USSP admins onboard a new tenant entirely from `/admin/tenants`:

**Step 1 — Create Tenant** (`/admin/tenants/new`)

| Field | Example |
|-------|---------|
| Site ID | `acme` (lowercase, unique, permanent) |
| Name | Acme Consulting Group |
| Short Name | Acme |
| Domain | `tools.acme.com` |
| Auth Provider | Google / Microsoft / SAML (future) |
| Logo | Upload or URL |
| Primary Color | `#FF6B00` |

On save → inserts into `tenants` table, all tools default to **disabled**.

**Step 2 — Enable Tools** (`/admin/tenants/acme`)

Toggle on the tools this tenant should access. Save → inserts/updates `tenant_tool_entitlements`.

**Step 3 — Add Initial Users** (`/admin/tenants/acme` → Users card)

Option A: Add staff users manually (email + role)
Option B: Allow auto-provisioning on first Azure AD / Google login (configurable per tenant)

| Column | Value |
|--------|-------|
| `auto_provision` | BOOLEAN on `tenants` table |
| `default_role` | VARCHAR — role assigned to auto-provisioned users (e.g., `viewer`) |

When `auto_provision=true`, any user from the tenant's auth provider (restricted by Azure tenant ID or Google domain) gets auto-created in `staff_users` on first login.

### 7.2 Infrastructure Setup (one-time per tenant)

| Step | Who | Action |
|------|-----|--------|
| 1 | USSP DevOps | Create Railway service from same repo |
| 2 | USSP DevOps | Set env vars: `SITE_ID`, `AUTH_PROVIDER`, credentials, `SITE_NAME`, `SITE_DOMAIN` |
| 3 | USSP DevOps | Add custom domain in Railway → get CNAME target |
| 4 | Tenant IT | Add CNAME DNS record pointing to Railway |
| 5 | Tenant IT (if Microsoft) | Register Azure AD app, provide client ID/secret/tenant ID |
| 6 | USSP Admin | Create tenant + enable tools + add users via admin UI |

**Goal:** Steps 1-5 are one-time infra. Step 6 is fully self-service for USSP admins — no code changes needed.

### 7.3 Tenant Lifecycle

| State | Meaning |
|-------|---------|
| `active=true` | Normal operation |
| `active=false` | Suspended — users cannot log in, data preserved |
| Deleted | Remove tenant record + entitlements. Data in `ai_engagements`, `ai_teams`, etc. retained (orphaned by `site_id`) for audit. Cleanup optional. |

USSP admins can suspend/reactivate tenants from the admin UI without touching Railway.

---

## 8. Updated Schema: Auto-Provisioning Fields

Add to `tenants` table:

| Column | Type | Description |
|--------|------|-------------|
| `auto_provision` | BOOLEAN | Auto-create staff_users on first login from tenant's auth provider |
| `default_role` | VARCHAR(50) | Role assigned to auto-provisioned users (default: `viewer`) |
| `allowed_domain` | VARCHAR(255) | Email domain restriction for Google auth (e.g., `acme.com`) |

**Auth flow with auto-provisioning:**

```
User logs in via Azure AD / Google
  → Is email in staff_users for this site_id? → YES → proceed (existing flow)
  → NO → Is auto_provision enabled for this tenant?
    → YES → Create staff_users record (site_id, email, name, default_role) → proceed
    → NO → Deny access ("Contact your administrator")
```

For Microsoft: `tenantId` already restricts to the org. No extra domain check needed.
For Google: `allowed_domain` ensures only `@acme.com` emails can auto-provision (prevents personal Gmail).

---

## 9. Future Considerations

- **SAML / SSO provider** — Add `saml` as a third `auth_provider` option for enterprise tenants that don't use Azure AD or Google
- **Per-tool-instance entitlements** — Split `tools` key into `tools.dora-calculator`, `tools.velocity-calculator`, etc. for granular control (keys already defined in registry)
- **Tenant self-service admin** — Let tenant admins manage their own users and view their own usage (scoped admin role)
- **Usage metering** — Track tool usage per tenant for billing, reporting, or usage caps
- **Tiered plans** — Map entitlements to pricing tiers (Free / Pro / Enterprise) for potential SaaS model
- **Tenant-specific custom tools** — Allow tenants to request custom calculators or assessments, gated by a tenant-specific tool key
