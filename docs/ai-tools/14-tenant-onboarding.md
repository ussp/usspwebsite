# Tenant Onboarding Guide — AI Transformation Tools

## Overview

The AI Tools platform supports multi-tenant deployment. Each tenant gets their own domain, authentication provider, and data isolation. USSP is the owner tenant and manages all other tenants.

Current tenants:

- **USSP** (owner) — tools.ussp.co — Google OAuth
- **Karsan** (planned) — tools.karsan.io — Microsoft Azure AD

## Prerequisites

- USSP admin access to tools.ussp.co
- Railway account with access to the USSP project
- DNS access for the tenant's domain
- OAuth credentials from the tenant's identity provider

## Step-by-Step: Onboarding a New Tenant

### Step 1: Register Tenant in Database

1. Log in to tools.ussp.co as a USSP admin
2. Navigate to Tenant Management (sidebar → Admin → Tenant Management)
3. Click "+ New Tenant"
4. Fill in:
   - **Site ID**: Lowercase identifier (e.g., `karsan`) — permanent, cannot be changed
   - **Full Name**: "Karsan Consulting Services"
   - **Short Name**: "Karsan" (shown in sidebar, login page)
   - **Domain**: "tools.karsan.io"
   - **Auth Provider**: Microsoft (Azure AD) or Google
   - **Auto-Provision**: Enable if you want users auto-created on first login
   - **Default Role**: Viewer (recommended for auto-provisioned users)
   - **Allowed Domain**: e.g., "karsan.io" (restricts which emails can auto-provision)
   - **Primary Color**: Tenant brand color (hex)
   - **Tagline**: Optional custom tagline
5. Click "Create Tenant"

### Step 2: Enable Tools

1. From the tenant list, click "Configure" on the new tenant
2. In the Tool Entitlements card, toggle on the tools this tenant should access:
   - Readiness Assessment (Step 1 · Assess)
   - Transformation Monitor (Step 2 · Transform)
   - GRC & Compliance (Step 3 · Govern)
   - Methodology & Research (Reference)
   - Free Public Tools (Reference)
3. Click "Save Changes"

### Step 3: Add Initial Users

1. In the Users card on the tenant detail page, click "+ Add User"
2. Enter email, full name, and role for each user
3. Recommended: Add at least one admin user for the tenant
4. If auto-provisioning is enabled, users can also be created on first login

### Step 4: Create Railway Service

1. In Railway dashboard, create a new service from the same repo
2. Name it descriptively (e.g., `ai-tools-karsan`)
3. Set the following environment variables:

```
# Site Identity
SITE_ID=karsan
SITE_NAME=Karsan
NEXT_PUBLIC_SITE_NAME=Karsan
SITE_DOMAIN=tools.karsan.io

# Supabase (same database as USSP)
NEXT_PUBLIC_SUPABASE_URL=<same as ussp service>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<same as ussp service>
SUPABASE_SERVICE_ROLE_KEY=<same as ussp service>

# Auth
AUTH_SECRET=<generate a new secret: openssl rand -base64 32>
AUTH_TRUST_HOST=true
AUTH_PROVIDER=microsoft
NEXT_PUBLIC_AUTH_PROVIDER=microsoft

# Microsoft Azure AD
AUTH_MICROSOFT_ID=<azure-app-client-id>
AUTH_MICROSOFT_SECRET=<azure-app-client-secret>
AUTH_MICROSOFT_TENANT=<azure-tenant-id>

# Auto-provisioning (optional)
AUTO_PROVISION=true
DEFAULT_ROLE=viewer
ALLOWED_DOMAIN=karsan.io
```

4. Set build command: `cd packages/platform-core && npx tsc && cd ../../packages/ai-tools && npm run build`
5. Set start command: `cd packages/ai-tools && npm run start`
6. Set root directory: `/` (monorepo root)
7. Set watch paths: `packages/platform-core/src/**`, `packages/ai-tools/**`

### Step 5: Configure Custom Domain

1. In Railway service settings → Networking → Custom Domains
2. Add `tools.karsan.io`
3. Railway will provide a CNAME target (e.g., `xxx.up.railway.app`)
4. In the tenant's DNS provider, add:
   ```
   Type: CNAME
   Name: tools
   Value: <railway-cname-target>
   TTL: 3600
   ```
5. Wait for DNS propagation and Railway SSL certificate provisioning (usually 5-10 minutes)

### Step 6: Register Azure AD Application (for Microsoft auth)

1. Go to Microsoft Entra admin center (https://entra.microsoft.com)
2. App registrations → New registration
3. Name: "AI Transformation Tools - Karsan"
4. Supported account types: "Accounts in this organizational directory only" (single tenant)
5. Redirect URI: `https://tools.karsan.io/api/auth/callback/microsoft-entra-id`
6. After creation:
   - Copy Application (client) ID → set as `AUTH_MICROSOFT_ID`
   - Copy Directory (tenant) ID → set as `AUTH_MICROSOFT_TENANT`
   - Go to Certificates & secrets → New client secret → copy value → set as `AUTH_MICROSOFT_SECRET`
7. API permissions: Microsoft Graph → User.Read (should be there by default)

### Step 7: Register Google OAuth (for Google auth tenants)

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URI: `https://tools.<domain>/api/auth/callback/google`
5. Copy Client ID → `AUTH_GOOGLE_ID`, Client Secret → `AUTH_GOOGLE_SECRET`

### Step 8: Verify End-to-End

1. Navigate to `https://tools.karsan.io`
2. Verify: Login page shows "by Karsan" and Microsoft sign-in button
3. Sign in with a Karsan Azure AD account
4. Verify: Sidebar shows only enabled tools
5. Verify: Sidebar header shows "Karsan" branding
6. Verify: Engagements and data are isolated (empty for new tenant)
7. Verify: Cannot access disabled tool URLs directly (redirects to dashboard)

## Suspending a Tenant

1. Go to Tenant Management → tenant detail
2. Click "Suspend Tenant"
3. All users will be blocked from logging in
4. Data is preserved — reactivate at any time

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_ID` | Yes | Unique tenant identifier (must match DB) |
| `SITE_NAME` | Yes | Display name for metadata |
| `NEXT_PUBLIC_SITE_NAME` | Yes | Display name for client-side UI |
| `SITE_DOMAIN` | Yes | Primary domain |
| `AUTH_PROVIDER` | Yes | `google` or `microsoft` |
| `NEXT_PUBLIC_AUTH_PROVIDER` | Yes | Same as AUTH_PROVIDER (client-side) |
| `AUTH_TRUST_HOST` | Yes | Set to `true` for custom domains |
| `AUTH_SECRET` | Yes | NextAuth session secret (unique per service) |
| `AUTH_MICROSOFT_ID` | If Microsoft | Azure AD application client ID |
| `AUTH_MICROSOFT_SECRET` | If Microsoft | Azure AD client secret |
| `AUTH_MICROSOFT_TENANT` | If Microsoft | Azure AD tenant ID |
| `AUTH_GOOGLE_ID` | If Google | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | If Google | Google OAuth client secret |
| `AUTO_PROVISION` | No | `true` to auto-create users on first login |
| `DEFAULT_ROLE` | No | Role for auto-provisioned users (default: viewer) |
| `ALLOWED_DOMAIN` | No | Email domain restriction for auto-provision |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Unauthorized" after login | Check staff_users has a record for this email + site_id |
| OAuth callback error | Verify redirect URI matches exactly in provider console |
| Sidebar shows all tools | Check tenant_tool_entitlements has rows for this site_id |
| "Tenant not found" | Run migration 0023 if not yet applied |
| DNS not resolving | Wait for propagation, verify CNAME record |
| SSL certificate error | Railway auto-provisions SSL — wait 5-10 mins after DNS |
