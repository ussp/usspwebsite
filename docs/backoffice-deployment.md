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

This creates all required tables including `staff_users`, `application_notes`, `audit_log`, `candidates`, `candidate_certifications`, `candidate_onboardings`, `resumes`, `match_scores`, and more. Current head revision: `0020`.

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

### Monorepo Strategy

Both the public site and back office deploy from the **same GitHub repo** as separate Railway services. Because the back office depends on `@ussp-platform/core` (a shared package via `file:../platform-core`), the full repo must be available at build time.

**Do NOT use Root Directory** for services that depend on shared packages. Instead, use Custom Build/Start Commands per service. This ensures the full monorepo is available during the build.

### Service Setup

1. In your Railway project, click **"+ New Service"** > select the same GitHub repo
2. **Settings > Source**:
   - **Root Directory**: Leave **empty** (do NOT set to `packages/backoffice`)
   - Connect to GitHub repo and `main` branch
3. **Settings > Build**:
   - Builder: **Nixpacks** (set via `railway.toml` in repo root)
   - Custom Build Command: `cd packages/platform-core && npx tsc && cd ../backoffice && next build`
   - Custom Start Command: `cd packages/backoffice && npm run start`
4. **Settings > Networking**: Add custom domain `app.ussp.co`, port `3000`

> **Why no Root Directory?** Railway's Root Directory strips the build context to only that subdirectory. Since the back office imports from `@ussp-platform/core` (at `packages/platform-core/`), the shared package wouldn't be available if the context is limited to `packages/backoffice/`.

### Public Site Service (`ussp`)

The public site service uses similar settings:

| Setting | Value |
|---------|-------|
| Root Directory | Empty |
| Custom Build Command | `cd packages/platform-core && npx tsc && cd ../.. && next build` |
| Custom Start Command | `npm run start` |

### Configuration Files

The repo includes these Railway/Nixpacks config files:

| File | Purpose |
|------|---------|
| `railway.toml` | Tells Railway to use Nixpacks builder for public site |
| `nixpacks.toml` | Build phases for public site (compiles platform-core first) |

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

### Deploying

**Auto-deploy:** Both services auto-deploy when you push to `main`.

**Manual deploy via CLI:**
```bash
# Deploy backoffice
railway service app && railway up

# Deploy public site
railway service ussp && railway up
```

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

### API Routes Reference

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/applications` | GET, POST | List applications (GET), create manual application (POST) |
| `/api/applications/[id]` | GET, PATCH | Get/update application details and status |
| `/api/applications/[id]/notes` | GET, POST | List/add application notes |
| `/api/applications/[id]/notes/[noteId]` | PATCH, DELETE | Edit/delete a note |
| `/api/applications/[id]/history` | GET | Get status change history |
| `/api/applications/[id]/requests` | GET, POST | List/create document requests |
| `/api/applications/[id]/requests/[reqId]` | PATCH | Update document request status |
| `/api/positions` | GET, POST | List/create positions |
| `/api/positions/[id]` | GET, PATCH | Get/update position |
| `/api/candidates/[id]/pii/upload` | POST | Get signed URL for candidate document upload |
| `/api/upload` | POST | Get signed URL for resume upload (manual applications) |
| `/api/contacts` | GET | List contact form submissions |
| `/api/staff` | GET, POST | List/create staff users |
| `/api/articles` | GET, POST | List/create articles |
| `/api/articles/[id]` | GET, PATCH, DELETE | Get/update/delete article |
| `/api/clients` | GET, POST | List/create clients |
| `/api/end-clients` | GET, POST | List/create end clients |
| `/api/positions/[id]/matches` | GET, POST | Get match scores (GET), run candidate matching (POST) |
| `/api/matches/[id]/feedback` | POST | Submit recruiter feedback on a match score |
| `/api/positions/[id]/stats` | GET | Position applicant stats and flow data |
| `/api/positions/[id]/activity` | GET | Position audit activity feed |
| `/api/candidates` | GET, POST | List/create candidates |
| `/api/candidates/[id]` | GET, PATCH | Get/update candidate (type, status, location, work preference) |
| `/api/candidates/[id]/certifications` | GET, POST | List/add certifications |
| `/api/candidates/[id]/certifications/[certId]` | PATCH, DELETE | Update/delete certification |
| `/api/candidates/[id]/resumes` | GET, POST | List/create resumes |
| `/api/candidates/[id]/pii` | GET, PUT | Get/update encrypted PII data |
| `/api/candidates/[id]/pii/upload` | POST | Get signed URL for visa document upload |
| `/api/applications/by-email` | GET | Cross-application lookup by email |
| `/api/dashboard` | GET | Dashboard metrics |
| `/api/assignments` | GET, POST | List/create assignments |
| `/api/assignments/[id]` | GET, PATCH | Get/update assignment |

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
