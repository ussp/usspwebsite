# USSP Back Office

Internal administration portal for USSP staff. Manages job positions, applications, contacts, and staff users.

**Production:** https://app.ussp.co
**Local dev:** http://localhost:3001

---

## Quick Start

### Prerequisites
- Node.js 20+
- Access to USSP Supabase instance
- Google OAuth credentials (separate client from public site)

### Setup

1. **Install dependencies** (from repo root):
   ```bash
   npm install
   cd packages/backoffice && npm install
   ```

2. **Build shared package:**
   ```bash
   cd packages/platform-core && npx tsc
   ```

3. **Configure environment:**
   Copy and fill in `packages/backoffice/.env.local`:
   ```
   SITE_ID=ussp
   SITE_NAME=USSP Back Office
   SITE_DOMAIN=app.ussp.co

   NEXT_PUBLIC_SUPABASE_URL=https://hjpmenorokkbszcedpjr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase dashboard>
   SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard>

   AUTH_SECRET=<generate with: openssl rand -base64 32>
   AUTH_URL=http://localhost:3001
   GOOGLE_CLIENT_ID=<from Google Cloud Console>
   GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
   ```

4. **Run database migration** (if not already applied):
   ```bash
   alembic upgrade head
   ```

5. **Seed initial admin user:**
   ```bash
   ADMIN_EMAIL=vinay@lagisetty.com npx tsx scripts/seed-admin.ts
   ```

6. **Start dev server:**
   ```bash
   cd packages/backoffice && npm run dev
   ```
   Open http://localhost:3001 — sign in with your Google account.

---

## Architecture

```
packages/backoffice/          ← This app (Next.js 16)
packages/platform-core/       ← Shared backend queries + auth
migrations/                   ← Database schema (Alembic)
```

The backoffice consumes `@ussp-platform/core` just like the public site. All database queries go through the shared package, ensuring consistent multi-tenant filtering by `site_id`.

### Authentication
- **Provider:** Google OAuth (via NextAuth v5)
- **Access control:** Only users in the `staff_users` table can sign in
- **Superadmins:** `vinay@lagisetty.com`, `swapan@lagisetty.com`, `arjun@lagisetty.com` — auto-created on first login
- **Other staff:** Must be added via Staff page before they can sign in

### RBAC Roles

| Role | Permissions |
|------|-------------|
| `admin` | Full access to everything |
| `recruiter` | Positions CRUD, Applications CRUD, Contacts read, Dashboard |
| `sales` | Contacts CRUD, Applications read, Articles CRUD, Dashboard |
| `hr_manager` | Applications CRUD, Staff read, Dashboard |
| `viewer` | Read-only access to all resources |

---

## Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Dashboard with metrics overview | All roles |
| `/login` | Google OAuth sign-in | Public |
| `/positions` | List all positions | recruiter, admin |
| `/positions/new` | Create a new position | recruiter, admin |
| `/positions/[id]` | Edit a position | recruiter, admin |
| `/applications` | List applications with status filters | recruiter, hr_manager, admin |
| `/applications/[id]` | Application detail, status updates, notes | recruiter, hr_manager, admin |
| `/contacts` | View contact form submissions | all roles (read) |
| `/staff` | List staff users | admin |
| `/staff/new` | Add a new staff user | admin |

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/positions` | List / create positions |
| GET/PATCH | `/api/positions/[id]` | Get / update position |
| GET | `/api/applications` | List applications (with filters) |
| GET/PATCH | `/api/applications/[id]` | Get / update status + assignment |
| GET/POST | `/api/applications/[id]/notes` | List / add notes |
| GET | `/api/contacts` | List contact submissions |
| GET/POST | `/api/staff` | List / create staff |
| PATCH/DELETE | `/api/staff/[id]` | Update / deactivate staff |
| GET | `/api/dashboard` | Dashboard metrics |

All API routes require authentication and check RBAC permissions.

---

## Deployment (Railway)

The back office runs as a separate Railway service in the same project as the public site.

| Setting | Value |
|---------|-------|
| Root Directory | `packages/backoffice` |
| Builder | Railpack (default) |
| Custom Build Command | `cd ../platform-core && npx tsc && cd ../backoffice && npm run build` |
| Custom Start Command | `npm run start` |
| Port | `3000` |
| Custom Domain | `app.ussp.co` |

### Setting variables via CLI:
```bash
railway variables --set "KEY=value" -s app
```

### Google OAuth redirect URIs (Google Cloud Console):
- `http://localhost:3001/api/auth/callback/google` (dev)
- `https://app.ussp.co/api/auth/callback/google` (prod)

---

## Development Workflow

### Adding a new page
1. Create page in `src/app/{route}/page.tsx`
2. Add `export const dynamic = "force-dynamic"` if it fetches data server-side
3. Create API route in `src/app/api/{route}/route.ts` if needed
4. Add RBAC checks in the API route
5. Add nav item in `src/components/AdminSidebar.tsx`

### Adding a new query
1. Create/edit query file in `packages/platform-core/src/queries/admin/`
2. Add export to `packages/platform-core/src/index.ts`
3. Add sub-path export to `packages/platform-core/package.json`
4. Rebuild: `cd packages/platform-core && npx tsc`

### Build verification
```bash
cd packages/platform-core && npx tsc         # Shared package
cd packages/backoffice && npm run build       # Back office
cd . && npm run build                         # Public site (no regressions)
```
