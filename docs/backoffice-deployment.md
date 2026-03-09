# USSP Back Office — Deployment & Installation Guide

## Overview

The back office is a Next.js 16 app at `packages/backoffice/` in the USSP monorepo. It shares the Supabase database with the public site via the `@ussp-platform/core` shared package.

| Component | Location |
|-----------|----------|
| App code | `packages/backoffice/` |
| Shared queries | `packages/platform-core/src/queries/admin/` |
| Auth config | `packages/platform-core/src/auth/admin-config.ts` |
| RBAC | `packages/platform-core/src/auth/rbac.ts` |
| DB models | `migrations/models.py` |
| Migration | `migrations/versions/20260309_000007_add_backoffice_foundation.py` |

---

## Fresh Installation

### 1. Clone and install

```bash
git clone https://github.com/ussp/usspwebsite.git
cd usspwebsite
npm install
cd packages/backoffice && npm install
```

### 2. Apply database migration

Ensure `DATABASE_URL` is set in your environment or `.env` (for Alembic):

```bash
alembic upgrade head
```

This creates: `staff_users`, `application_notes`, `audit_log` tables and extends `positions`/`applications`.

### 3. Configure environment

Create `packages/backoffice/.env.local` (see `.env.example` for template):

```
SITE_ID=ussp
SITE_NAME=USSP Back Office
SITE_DOMAIN=app.ussp.co
NEXT_PUBLIC_SUPABASE_URL=https://hjpmenorokkbszcedpjr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_ROLE_KEY=<key>
AUTH_SECRET=<openssl rand -base64 32>
AUTH_URL=http://localhost:3001
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
```

### 4. Set up Google OAuth

In **Google Cloud Console > APIs & Services > Credentials**:

1. Create a new OAuth 2.0 Client ID (or reuse existing)
2. Name: `USSP Back Office`
3. Add Authorized JavaScript Origins:
   - `http://localhost:3001`
   - `https://app.ussp.co`
4. Add Authorized Redirect URIs:
   - `http://localhost:3001/api/auth/callback/google`
   - `https://app.ussp.co/api/auth/callback/google`

### 5. Seed admin user

```bash
ADMIN_EMAIL=vinay@lagisetty.com npx tsx scripts/seed-admin.ts
```

Or just sign in — superadmin emails are auto-created on first Google sign-in.

### 6. Build and run

```bash
cd packages/platform-core && npx tsc
cd ../backoffice && npm run dev
```

Open http://localhost:3001

---

## Railway Deployment

### Service Setup

1. In your Railway project, click **"+ New Service"** > select the same GitHub repo
2. **Settings > Source > Root Directory**: `packages/backoffice`
3. **Settings > Build**:
   - Builder: **Railpack** (default)
   - Custom Build Command: `cd ../platform-core && npx tsc && cd ../backoffice && npm run build`
   - Custom Start Command: `npm run start`
4. **Settings > Networking**: Add custom domain `app.ussp.co`, port `3000`

### Environment Variables

Set via dashboard or CLI:

```bash
railway variables \
  --set "SITE_ID=ussp" \
  --set "SITE_NAME=USSP Back Office" \
  --set "SITE_DOMAIN=app.ussp.co" \
  --set "NEXT_PUBLIC_SUPABASE_URL=https://hjpmenorokkbszcedpjr.supabase.co" \
  --set "NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>" \
  --set "SUPABASE_SERVICE_ROLE_KEY=<key>" \
  --set "AUTH_SECRET=<generated secret>" \
  --set "AUTH_URL=https://app.ussp.co" \
  --set "GOOGLE_CLIENT_ID=<client id>" \
  --set "GOOGLE_CLIENT_SECRET=<client secret>" \
  --set "PORT=3000" \
  -s app
```

### DNS

Point `app.ussp.co` CNAME to the Railway-provided domain.

### Verify

```bash
railway variables -s app -k    # Check all vars are set
```

Visit https://app.ussp.co/login after deployment completes.

---

## Cookie Isolation

The public site and back office use completely separate auth:

| | Public Site | Back Office |
|-|-------------|-------------|
| Domain | `www.ussp.co` | `app.ussp.co` |
| Auth provider | LinkedIn OAuth | Google OAuth |
| AUTH_SECRET | Unique secret A | Unique secret B |
| Session cookie | Scoped to www.ussp.co | Scoped to app.ussp.co |

No cookie collision is possible.

---

## Updating the Back Office

### Adding new features

1. Add query in `packages/platform-core/src/queries/admin/`
2. Export from `packages/platform-core/package.json` (sub-path export)
3. Rebuild: `cd packages/platform-core && npx tsc`
4. Add API route in `packages/backoffice/src/app/api/`
5. Add page in `packages/backoffice/src/app/`
6. Verify builds:
   ```bash
   cd packages/platform-core && npx tsc
   cd ../backoffice && npm run build
   cd ../.. && npm run build  # Public site regression check
   ```

### Database changes

1. Update `migrations/models.py`
2. Create Alembic migration: `alembic revision -m "description"`
3. Apply: `alembic upgrade head`
4. Update TypeScript types in `packages/platform-core/src/types/admin.ts`
5. Update queries in `packages/platform-core/src/queries/admin/`
6. Rebuild platform-core

---

## Monitoring

- **Railway dashboard**: Build logs, deploy status, resource usage
- **Supabase dashboard**: Query logs, RLS policy checks
- **Audit log**: All staff actions logged to `audit_log` table, viewable via API at `/api/audit`
