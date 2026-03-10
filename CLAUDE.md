# USSP Website - AI Agent Maintenance Guide

> **CRITICAL:** This document is the single source of truth for maintaining the USSP website.
> Every AI agent MUST read this file before making ANY changes to the site.
> Failure to follow this guide will result in broken SEO, desynchronized content, and lost information.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Company Facts (Source of Truth)](#company-facts-source-of-truth)
3. [Architecture & File Map](#architecture--file-map)
4. [Database Management](#database-management)
5. [Content Sync Checklist](#content-sync-checklist)
6. [Adding a New Page](#adding-a-new-page)
7. [Updating Existing Content](#updating-existing-content)
8. [SEO Checklist](#seo-checklist)
9. [AEO (AI Search) Checklist](#aeo-ai-search-checklist)
10. [Design System Rules](#design-system-rules)
11. [Image & Media Management](#image--media-management)
12. [Deployment & Git Workflow](#deployment--git-workflow)
13. [Common Mistakes to Avoid](#common-mistakes-to-avoid)

---

## Project Overview

- **Public Site:** https://www.ussp.co
- **Back Office:** https://app.ussp.co (internal admin portal)
- **Repo:** https://github.com/ussp/usspwebsite
- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Structure:** Monorepo — `src/app/` (public site), `packages/backoffice/` (admin app), `packages/platform-core/` (shared backend)
- **Hosting:** Railway (two services from same repo: `ussp` for public site, `app` for back office)

---

## Company Facts (Source of Truth)

**ALWAYS use these exact values. If any of these change, update EVERYWHERE listed in the Content Sync Checklist.**

| Fact | Value |
|------|-------|
| Legal Name | US Software Professionals Inc. |
| DBA | USSP |
| Founded | January 23, 2003 |
| Entity Type | Corporation (CORP) |
| Registration # | 62642807 |
| State | Illinois (MST) |
| HQ Address | 875 N Michigan Ave, Suite 3100, Chicago, IL 60614 |
| Phone | +1-(312) 546-4306 |
| Fax | +1-(312) 253-2026 |
| Hours | Mon - Fri 8:00 AM to 5:00 PM |
| General Email | accounts@ussoftwarepro.com |
| Healthcare Email | medicalstaffing@ussp.co |
| Website | https://www.ussp.co |
| Offices | Chicago (HQ), India, Canada |
| Core Values | Integrity, Innovation, Respect, Accountability, Excellence |
| TOPS Contract # | CMT4599470 |
| TOPS BidBuy # | P-59947 |
| TOPS Prime | Krasan Consulting Services |
| TOPS Role | Authorized Subvendor |
| TOPS Expiry | February 2034 |

---

## Architecture & File Map

### Multi-Tenant Architecture

This repo contains both the USSP website AND the shared platform backend (`@ussp-platform/core`).
All sites share a single Supabase database with data isolated by `site_id` column.

- **SITE_ID env var**: Every site must set `SITE_ID` (e.g. `ussp`, `vqlab`) — all queries auto-filter by it
- **Shared package**: `packages/platform-core/` — queries, auth, API handlers used by all sites
- **Back-office app**: `packages/backoffice/` — internal admin portal (Google OAuth, RBAC, positions CRUD, applications management)
- **Site template**: `packages/site-template/` — scaffold for creating new site repos

### Critical Files That Contain Duplicated/Synced Content

```
D:/Code/ussp/
├── CLAUDE.md                          ← THIS FILE (maintenance guide)
├── alembic.ini                        ← Alembic migration config
├── migrations/                        ← Database schema migrations (Alembic)
│   ├── env.py                         ← Migration environment (reads DATABASE_URL)
│   ├── models.py                      ← SQLAlchemy models (multi-tenant schema)
│   ├── script.py.mako                 ← Migration file template
│   └── versions/                      ← Migration scripts (chronological)
├── packages/
│   ├── platform-core/                 ← SHARED NPM PACKAGE (@ussp-platform/core)
│   │   ├── src/
│   │   │   ├── index.ts               ← Re-exports all shared modules
│   │   │   ├── config.ts              ← getSiteId(), getSiteConfig() from SITE_ID env var
│   │   │   ├── supabase/server.ts     ← Service client
│   │   │   ├── supabase/client.ts     ← Browser client
│   │   │   ├── queries/jobs.ts        ← getActiveJobs(), getJobBySlug() — auto-filtered by site_id
│   │   │   ├── queries/applications.ts ← createOrUpdateApplication(), updateJobAlerts()
│   │   │   ├── queries/contact.ts     ← submitContactForm()
│   │   │   ├── queries/analytics.ts   ← trackEvent()
│   │   │   ├── queries/admin/         ← BACK-OFFICE QUERY MODULES
│   │   │   │   ├── positions.ts       ← CRUD: getAllPositions, create, update, toggle
│   │   │   │   ├── applications.ts    ← List, status updates, assign, notes
│   │   │   │   ├── staff.ts           ← Staff user CRUD + findByEmail
│   │   │   │   ├── contacts.ts        ← Read-only contact submissions
│   │   │   │   ├── dashboard.ts       ← Aggregated metrics
│   │   │   │   └── audit.ts           ← Audit logging + retrieval
│   │   │   ├── auth/config.ts         ← createAuth() factory for NextAuth (LinkedIn, public site)
│   │   │   ├── auth/admin-config.ts   ← createAdminAuth() factory (Google OAuth, back office)
│   │   │   ├── auth/rbac.ts           ← hasPermission(), requirePermission() — role-based access
│   │   │   ├── api/applications.ts    ← API route handler (POST)
│   │   │   ├── api/upload.ts          ← File upload handler (per-site storage path)
│   │   │   ├── api/contact.ts         ← Contact form handler
│   │   │   ├── types/database.ts      ← Public-facing TypeScript interfaces
│   │   │   ├── types/admin.ts         ← Back-office interfaces (StaffUser, AdminApplication, etc.)
│   │   │   └── types/site.ts          ← Site config interfaces
│   │   └── package.json
│   ├── backoffice/                    ← BACK-OFFICE APP (app.ussp.co)
│   │   ├── package.json
│   │   ├── next.config.ts             ← Standalone output
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx         ← Root layout, SessionProvider
│   │   │   │   ├── globals.css        ← Admin design tokens
│   │   │   │   ├── page.tsx           ← Dashboard (metrics overview)
│   │   │   │   ├── login/page.tsx     ← Google OAuth sign-in
│   │   │   │   ├── positions/         ← List, create, edit positions
│   │   │   │   ├── applications/      ← List, detail, status, notes
│   │   │   │   ├── contacts/          ← View contact submissions
│   │   │   │   ├── staff/             ← Manage staff users + roles
│   │   │   │   └── api/               ← 11 API routes (auth, CRUD, dashboard)
│   │   │   ├── lib/auth.ts            ← createAdminAuth() wrapper
│   │   │   ├── middleware.ts          ← Protect all routes except /login
│   │   │   └── components/            ← AdminSidebar, AdminTopbar, DataTable, StatusBadge, MetricCard
│   │   └── .env.local                 ← Google OAuth + Supabase credentials (gitignored)
│   └── site-template/                 ← SCAFFOLD for new site repos
│       ├── .env.example               ← Required env vars template
│       ├── package.json
│       └── src/                       ← Minimal app structure with thin API wrappers
├── scripts/
│   ├── seed-jobs.ts                   ← Seed sample job positions (uses SITE_ID)
│   └── seed-admin.ts                  ← Seed initial admin user for back office
├── public/
│   ├── llms.txt                       ← AI search: company summary (MUST sync with site content)
│   ├── llms-full.txt                  ← AI search: full company details (MUST sync with site content)
│   ├── robots.txt                     ← Search engine crawler permissions
│   └── assets/
│       ├── images/                    ← Background images (JPG)
│       ├── icons/                     ← Service icons (SVG + PNG)
│       └── logos/                     ← Company/partner logos (SVG)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 ← ROOT LAYOUT: fonts, metadata, JSON-LD Organization schema
│   │   ├── globals.css                ← Design tokens: colors, fonts
│   │   ├── sitemap.ts                 ← XML sitemap (auto-generated, must add new pages here)
│   │   ├── page.tsx                   ← Homepage
│   │   ├── discover/page.tsx          ← IT Services
│   │   ├── healthcare/page.tsx        ← Healthcare gateway
│   │   ├── healthcare-staffing/page.tsx    ← For professionals
│   │   ├── healthcare-organization/page.tsx ← For organizations
│   │   ├── blockchain/page.tsx        ← Blockchain services
│   │   ├── small-business-solutions/page.tsx ← Small biz
│   │   ├── odi-training/page.tsx      ← ODI Training
│   │   ├── tops/page.tsx              ← TOPS contract (has own JSON-LD schemas)
│   │   ├── insights/page.tsx          ← Insights listing (case studies & blog posts, dynamic)
│   │   ├── insights/[slug]/page.tsx  ← Article detail with JSON-LD, OpenGraph, share buttons
│   │   ├── careers/page.tsx           ← Careers (dynamic, fetches jobs from Supabase)
│   │   ├── lca-page/page.tsx          ← LCA compliance
│   │   └── discover1/page.tsx         ← Redirect to /discover
│   ├── lib/
│   │   ├── jobs.ts                    ← Re-exports from @ussp-platform/core (auto-filtered by site_id)
│   │   ├── auth.ts                    ← createAuth() call from shared package
│   │   └── supabase/
│   │       ├── server.ts              ← Re-exports from @ussp-platform/core
│   │       └── client.ts              ← Re-exports from @ussp-platform/core
│   └── components/
│       ├── Header.tsx                 ← Navigation menu (navItems array)
│       ├── Footer.tsx                 ← Footer links, address, "since 2003"
│       ├── ContactForm.tsx            ← Reusable contact form
│       ├── HeroSection.tsx            ← Hero with video/image background
│       ├── SectionHeading.tsx         ← Consistent section titles
│       ├── ProcessTimeline.tsx        ← Numbered step timeline
│       ├── ExpandableSection.tsx      ← Accordion/collapsible
│       ├── ApplicationForm.tsx        ← Job application form (LinkedIn + resume)
│       ├── LinkedInButton.tsx         ← LinkedIn OAuth sign-in button
│       ├── ShareButtons.tsx           ← LinkedIn/X share + copy link buttons
│       └── FileUpload.tsx             ← Drag-drop resume upload
```

---

## Database Management

### Overview

- **Database:** Supabase PostgreSQL (project `hjpmenorokkbszcedpjr`, region `us-west-2`)
- **Multi-tenancy:** All tenant tables have a `site_id` column (FK to `sites.id`). Application-level filtering is primary; RLS is a safety net.
- **Migrations:** Alembic (Python) — same pattern as the InstantMarketing project
- **Application queries:** `@ussp-platform/core` package (wraps Supabase JS client, auto-injects `site_id`)
- **Schema models:** SQLAlchemy models in `migrations/models.py` — used ONLY for Alembic migrations
- **Version table:** `alembic_version_ussp` (separate from other projects sharing the same Supabase instance)

### Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `sites` | Site registry (multi-tenant) | `id` (PK, e.g. "ussp"), `name`, `domain`, `config` (JSONB), `active` |
| `positions` | Job listings on careers page | `id`, `site_id` (FK), `title`, `slug`, `location`, `type`, `description`, `salary_range`, `department`, `active`, `created_at`, `updated_at`, `created_by` (FK staff_users) |
| `applications` | Job applications (LinkedIn OAuth) | `id`, `site_id` (FK), `full_name`, `email`, `job_title`, `job_slug`, `resume_path`, `auth_provider`, `status`, `status_updated_at`, `assigned_to` (FK staff_users), `created_at` |
| `application_positions` | Many-to-many junction | `id`, `application_id` (FK), `position_id` (FK), `applied_at` |
| `contact_submissions` | Contact form entries | `id`, `site_id` (FK), `name`, `email`, `phone`, `message`, `created_at` |
| `analytics_events` | Lightweight analytics | `id`, `site_id` (FK), `event_type`, `page_path`, `referrer`, `metadata` (JSONB), `created_at` |
| `staff_users` | Back-office users (Google OAuth) | `id`, `site_id` (FK), `email`, `full_name`, `role`, `avatar_url`, `google_sub`, `active`, `last_login_at` |
| `application_notes` | Recruiter notes on applications | `id`, `site_id` (FK), `application_id` (FK), `staff_user_id` (FK), `content`, `created_at` |
| `audit_log` | Staff action audit trail | `id`, `site_id` (FK), `staff_user_id` (FK), `action`, `entity_type`, `entity_id`, `details` (JSONB), `created_at` |
| `articles` | Insights content (blog posts & case studies) | `id`, `site_id` (FK), `slug`, `title`, `excerpt`, `body`, `content_type`, `author`, `featured_image_url`, `tags` (JSONB), `case_study_data` (JSONB), `status`, `published_at`, `meta_title`, `meta_description`, `meta_keywords`, `created_by` (FK staff_users) |

### Connection Strings (in `.env.local`)

```
# Multi-tenant platform
SITE_ID=ussp
SITE_NAME=US Software Professionals Inc.
SITE_DOMAIN=www.ussp.co

# Supabase REST API (used by Next.js app)
NEXT_PUBLIC_SUPABASE_URL=https://hjpmenorokkbszcedpjr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Direct Postgres connection (used by Alembic migrations)
DATABASE_URL=postgresql://postgres.hjpmenorokkbszcedpjr:<password>@aws-0-us-west-2.pooler.supabase.com:5432/postgres
```

### How to Make Schema Changes

**NEVER modify the database schema manually in the Supabase dashboard.** Always use Alembic migrations so changes are tracked in version control.

#### Step 1: Update the SQLAlchemy model
Edit `migrations/models.py` to reflect the desired schema change (add/remove columns, tables, etc.).

#### Step 2: Create a migration
```bash
alembic revision -m "Describe the change"
```
This generates a new file in `migrations/versions/`. Edit the `upgrade()` and `downgrade()` functions.

#### Step 3: Apply the migration
```bash
alembic upgrade head
```

#### Step 4: Update the application code
- Update the TypeScript interface in `src/lib/jobs.ts` (or the relevant query file)
- Update the `.select()` query to include new columns
- Update the page component to display the new data

#### Step 5: Update seed script if needed
If the change adds new columns to `positions`, update `scripts/seed-jobs.ts` with sample data.

#### Step 6: Commit the migration
```bash
git add migrations/ src/lib/ scripts/
git commit -m "Add [column/table] via Alembic migration"
```

### Example: Adding a Column

```python
# In migrations/versions/YYYYMMDD_HHMMSS_<rev>_<slug>.py
def upgrade() -> None:
    op.add_column("positions", sa.Column("salary_range", sa.String(100), nullable=True))

def downgrade() -> None:
    op.drop_column("positions", "salary_range")
```

Then update `migrations/models.py`:
```python
class Position(Base):
    __tablename__ = "positions"
    # ... existing columns ...
    salary_range = Column(String(100))  # <-- add here
```

Then update `src/lib/jobs.ts`:
```typescript
export interface Job {
  // ... existing fields ...
  salary_range?: string;  // <-- add here
}
// Update .select() to include "salary_range"
```

### Useful Alembic Commands

| Command | Purpose |
|---------|---------|
| `alembic upgrade head` | Apply all pending migrations |
| `alembic downgrade -1` | Rollback last migration |
| `alembic current` | Show current migration version |
| `alembic history` | Show migration history |
| `alembic revision -m "message"` | Create new migration file |

### Seeding Data

To populate sample job positions:
```bash
npx tsx scripts/seed-jobs.ts
```

To create the initial back-office admin user:
```bash
ADMIN_EMAIL=vinay@lagisetty.com npx tsx scripts/seed-admin.ts
```

Both seed scripts read `.env.local` for Supabase credentials and are idempotent (safe to run multiple times).

### Key Rules

1. **Always use Alembic for schema changes** — never use the Supabase dashboard SQL editor for DDL
2. **Keep `migrations/models.py` in sync** — it must match the actual database schema
3. **Keep TypeScript interfaces in sync** — `packages/platform-core/src/types/database.ts` must match the database columns
4. **Migration files are append-only** — never edit an existing migration that has been applied
5. **Test locally before pushing** — run `alembic upgrade head` to verify the migration works
6. **Always include `site_id`** — every new tenant table MUST have a `site_id` column with FK to `sites.id`
7. **Rebuild platform-core after changes** — run `cd packages/platform-core && npx tsc` before `npm run build`

### Onboarding a New Site

1. Insert into `sites` table: `INSERT INTO sites (id, name, domain) VALUES ('newsite', 'Company Name', 'www.newsite.com');`
2. Copy `packages/site-template/` to a new repo
3. Set `SITE_ID=newsite` in `.env.local` and hosting env vars
4. Set Supabase credentials (shared instance)
5. Set unique `AUTH_SECRET` and LinkedIn OAuth credentials
6. Customize design, pages, and content (all unique per site)
7. Deploy to Railway (or similar)

---

## Content Sync Checklist

### When COMPANY INFO changes (address, phone, email, etc.)

Update ALL of these files:

| # | File | What to update |
|---|------|---------------|
| 1 | `CLAUDE.md` | Company Facts table (this file) |
| 2 | `src/app/layout.tsx` | `metadata.description`, JSON-LD `address`, `telephone`, `faxNumber` |
| 3 | `src/components/Footer.tsx` | Address, phone, fax, hours in footer |
| 4 | `src/components/ContactForm.tsx` | Default address, phone, email, hours |
| 5 | `src/app/page.tsx` | About Us section text |
| 6 | `src/app/odi-training/page.tsx` | Contact section address, phone, email |
| 7 | `src/app/small-business-solutions/page.tsx` | Contact section |
| 8 | `src/app/lca-page/page.tsx` | Company info box |
| 9 | `src/app/tops/page.tsx` | Contract details grid, JSON-LD schemas (Organization + FAQPage) |
| 10 | `public/llms.txt` | Company Overview section |
| 11 | `public/llms-full.txt` | Company Details section + FAQ answers |

### When NAVIGATION changes (add/remove/rename page)

| # | File | What to update |
|---|------|---------------|
| 1 | `src/components/Header.tsx` | `navItems` array - add/remove/reorder items |
| 2 | `src/components/Footer.tsx` | Footer link lists (Services, Healthcare columns) |
| 3 | `src/app/sitemap.ts` | Add new URL entry with priority and changeFrequency |
| 4 | `public/llms.txt` | Add service/page description |
| 5 | `public/llms-full.txt` | Add detailed section for new page |
| 6 | `public/robots.txt` | No change needed (allows all by default) |

### When SERVICES change

| # | File | What to update |
|---|------|---------------|
| 1 | `src/app/page.tsx` | Services grid (4 cards) and Focus Areas section |
| 2 | `src/app/discover/page.tsx` | Same services grid and focus areas (DUPLICATED from homepage) |
| 3 | `src/app/layout.tsx` | JSON-LD `knowsAbout` array |
| 4 | `public/llms.txt` | Services section |
| 5 | `public/llms-full.txt` | Detailed services descriptions |
| 6 | `src/components/Footer.tsx` | Services column links |

### When HEALTHCARE content changes

| # | File | What to update |
|---|------|---------------|
| 1 | `src/app/healthcare-staffing/page.tsx` | Professional-facing content |
| 2 | `src/app/healthcare-organization/page.tsx` | Organization-facing content |
| 3 | `src/app/healthcare/page.tsx` | Gateway page (links to both) |
| 4 | `src/app/page.tsx` | Healthcare card in Service Division Grid |
| 5 | `public/llms.txt` | Healthcare Staffing section |
| 6 | `public/llms-full.txt` | Full Healthcare Staffing section |

### When TOPS/GOVERNMENT CONTRACT info changes

| # | File | What to update |
|---|------|---------------|
| 1 | `CLAUDE.md` | Company Facts table (this file) |
| 2 | `src/app/tops/page.tsx` | Contract details grid, FAQ section, BOTH JSON-LD schemas |
| 3 | `public/llms.txt` | Government Contracts section |
| 4 | `public/llms-full.txt` | Full TOPS section + FAQ answers |

### When INSIGHTS content changes (articles, case studies, blog posts)

| # | File | What to update |
|---|------|---------------|
| 1 | Backoffice CMS | Create/edit articles at `/articles` in back-office app |
| 2 | `public/llms.txt` | Update Insights section if new content types or topics are added |
| 3 | `public/llms-full.txt` | Update Insights section with new content descriptions |

**Note:** Individual articles are managed through the backoffice CMS (database-driven). No code changes needed to publish new articles.

### When CORE VALUES change

| # | File | What to update |
|---|------|---------------|
| 1 | `src/app/page.tsx` | Values parallax section |
| 2 | `public/llms.txt` | Core Values line |
| 3 | `public/llms-full.txt` | Core Values section |
| 4 | `CLAUDE.md` | Company Facts table |

---

## Adding a New Page

Follow these steps IN ORDER. Do NOT skip any step.

### Step 1: Create the page file
```
src/app/{page-slug}/page.tsx
```

### Step 2: Add metadata with SEO keywords
Every page MUST have:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title - USSP",  // Will use template: "%s | USSP"
  description: "Include 'Since 2003', '20+ years', and relevant keywords. Keep under 160 chars.",
  keywords: "comma, separated, keywords",
};
```

### Step 3: Use consistent design components
- Use `SectionHeading` for all section titles
- Use `HeroSection` for page hero areas
- Use `ContactForm` for contact sections
- Use `ProcessTimeline` for step-by-step processes
- Use `ExpandableSection` for collapsible content
- Follow font conventions (see Design System Rules below)

### Step 4: Add to navigation
Edit `src/components/Header.tsx` → `navItems` array.
Decide: top-level item or nested under a dropdown?

### Step 5: Add to footer (if appropriate)
Edit `src/components/Footer.tsx` → add link in relevant column.

### Step 6: Add to sitemap
Edit `src/app/sitemap.ts` → add new entry:
```ts
{
  url: `${baseUrl}/new-page`,
  lastModified,
  changeFrequency: "monthly",  // weekly | monthly | yearly
  priority: 0.8,               // 1.0 = homepage, 0.9 = key pages, 0.7-0.8 = standard
},
```

### Step 7: Update llms.txt
Edit `public/llms.txt` → add brief section about the new page.

### Step 8: Update llms-full.txt
Edit `public/llms-full.txt` → add detailed section with all content from the page.

### Step 9: Add JSON-LD if applicable
If the page is a service, product, FAQ, or government contract, add relevant JSON-LD:
- `Service` schema for service pages
- `FAQPage` schema for pages with Q&A content
- `GovernmentService` for government contract pages
- `Course` for training pages

### Step 10: Test
```bash
npm run build   # Must compile with 0 errors
npm run dev     # Visual check at localhost
```

### Step 11: Commit with descriptive message
```bash
git add -A && git commit -m "Add [page name] page with SEO/AEO optimization" && git push
```

---

## Updating Existing Content

### Text/Copy Changes
1. Find the page file in `src/app/{slug}/page.tsx`
2. Update the text
3. Check if the SAME text appears in:
   - `public/llms.txt`
   - `public/llms-full.txt`
   - Any JSON-LD `description` fields in the same file
   - The `metadata.description` at the top of the file
4. Update ALL occurrences

### Adding a New Section to an Existing Page
1. Add the JSX to the page file
2. Update `public/llms-full.txt` with the new section content
3. If it's a major section, also update `public/llms.txt`

### Removing Content
1. Remove from the page file
2. Remove from `public/llms.txt`
3. Remove from `public/llms-full.txt`
4. Remove any JSON-LD references
5. If removing a page entirely, also:
   - Remove from `Header.tsx` navItems
   - Remove from `Footer.tsx` links
   - Remove from `sitemap.ts`
   - Delete the `src/app/{slug}/` directory

---

## SEO Checklist

Every page MUST have:

- [ ] **`<Metadata>` export** with `title`, `description` (include "Since 2003", "20+ years")
- [ ] **Unique title** - no two pages should have the same title
- [ ] **Meta description** under 160 characters, includes primary keyword
- [ ] **H1 tag** - exactly ONE per page (the main heading)
- [ ] **Semantic HTML** - proper heading hierarchy (H1 → H2 → H3)
- [ ] **Image alt text** - every `<Image>` must have descriptive `alt`
- [ ] **Internal links** - link to other relevant USSP pages where natural
- [ ] **External links** - use `rel="noopener noreferrer"` and `target="_blank"`
- [ ] **Canonical URL** - set via `metadataBase` in root layout
- [ ] **Listed in sitemap.ts** with appropriate priority

### Page-specific SEO:
- [ ] **TOPS page:** GovernmentService + FAQPage JSON-LD schemas
- [ ] **Homepage:** Organization JSON-LD (in layout.tsx)
- [ ] **Service pages:** Include specific service keywords in metadata

---

## AEO (AI Search) Checklist

For AI engines (Claude, ChatGPT, Perplexity, Google AI) to correctly answer questions about USSP:

### Files that AI crawlers read:
| File | URL | Purpose |
|------|-----|---------|
| `public/llms.txt` | `/llms.txt` | Quick summary (~100 lines) |
| `public/llms-full.txt` | `/llms-full.txt` | Deep detail (~400+ lines) |
| `public/robots.txt` | `/robots.txt` | Crawler permissions |
| `src/app/sitemap.ts` | `/sitemap.xml` | Page discovery |
| JSON-LD in pages | Embedded in HTML | Structured data |

### When updating ANY content, ask:
1. "If someone asks an AI 'What does USSP do?', will the AI have the updated info?"
2. "If someone asks 'Is USSP a TOPS vendor?', will the AI give the correct answer?"
3. "If someone asks 'Where is USSP located?', will the AI have the right address?"

If the answer is NO → update `llms.txt` and `llms-full.txt`.

### AI crawler robots.txt entries to maintain:
```
GPTBot          → OpenAI / ChatGPT
ChatGPT-User    → ChatGPT browsing
ClaudeBot       → Claude search
Claude-Web      → Claude web access
anthropic-ai    → Anthropic
PerplexityBot   → Perplexity AI
Google-Extended → Google AI Overviews / Gemini
Applebot-Extended → Apple Intelligence / Siri
cohere-ai       → Cohere
Bytespider      → ByteDance AI
```

If a new AI search engine emerges, add its crawler to `robots.txt` with `Allow: /`.

### llms.txt format rules:
- Use markdown headers (`#`, `##`) for sections
- Use bullet points for lists
- Keep concise - this is for quick AI consumption
- Always include: company name, founding date, location, services, contact

### llms-full.txt format rules:
- Comprehensive - include ALL content from ALL pages
- Use clear section separators (`---`)
- Include FAQ section at the bottom
- Write in third person ("USSP provides..." not "We provide...")
- Include exact contract numbers, dates, addresses

---

## Design System Rules

### Fonts (NEVER change without updating all files)

| Font | CSS Variable | Usage | Weight |
|------|-------------|-------|--------|
| Alata | `--font-alata` | Headings, nav, buttons, labels | 400 |
| Montserrat | `--font-montserrat` | Body text, paragraphs, descriptions | 400, 700 |
| League Spartan | `--font-spartan` | Display text (special use) | 400, 700 |

### How to apply fonts in JSX:
```tsx
// Headings and navigation
className="font-[family-name:var(--font-alata)]"

// Body text and descriptions
className="font-[family-name:var(--font-montserrat)]"

// Display text
className="font-[family-name:var(--font-spartan)]"
```

### Colors (defined in `globals.css`)

| Name | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| White | `#FFFFFF` | `--color-white` | Backgrounds, text on dark |
| Dark | `#222222` | `--color-dark` | Body text |
| Light Gray | `#E8EAEC` | `--color-light-gray` | Section backgrounds |
| Near Black | `#1C1C1C` | `--color-near-black` | Dark sections, header |
| Primary Blue | `#2563EB` | `--color-primary` | CTAs, links, accents |
| Primary Dark | `#1D4ED8` | `--color-primary-dark` | Hover states |

### Tailwind usage:
```tsx
bg-white  bg-dark  bg-light-gray  bg-near-black  bg-primary  bg-primary-dark
text-white  text-dark  text-dark/70  text-primary  text-white/80
```

### Section patterns:
- **White sections:** `bg-white` with `text-dark`
- **Gray sections:** `bg-light-gray` with `text-dark`
- **Dark sections:** `bg-near-black` with `text-white`
- **Hero sections:** Use `HeroSection` component with overlay
- **Alternating:** White → Gray → White → Gray (keeps visual rhythm)

### Spacing:
- Section padding: `py-20` (standard), `py-32` (hero/feature)
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Narrow content: `max-w-4xl mx-auto px-4`

### Component usage hierarchy:
1. Always use `SectionHeading` for section titles (ensures H2 consistency)
2. Always use `HeroSection` for page hero areas
3. Always use `ContactForm` for contact sections (prevents address drift)
4. Always use `ProcessTimeline` for numbered steps
5. Always use `ExpandableSection` for collapsible FAQ-style content

---

## Image & Media Management

### Image locations:
```
public/assets/images/    ← Full-size background/section images (JPG)
public/assets/icons/     ← Service/feature icons (SVG preferred, PNG fallback)
public/assets/logos/     ← Company and partner logos (SVG preferred)
```

### When adding a new image:
1. Place in appropriate directory
2. Use descriptive filename: `healthcare-hero.jpg` not `img1.jpg`
3. Optimize before committing (compress JPGs, minify SVGs)
4. Use Next.js `<Image>` component with `fill` and `object-cover` for backgrounds
5. ALWAYS provide descriptive `alt` text for SEO

### Current images:
| File | Source | Used on |
|------|--------|---------|
| `healthcare-hero.jpg` | Unsplash | Homepage, Healthcare, HC-Staffing, HC-Org |
| `values-bg.jpg` | Unsplash | Homepage values parallax |
| `tech-grid.jpg` | Unsplash | Homepage, Healthcare gateway |
| `small-biz-hero.jpg` | Strikingly | Small Business Solutions hero |
| `data-analytics.jpg` | Unsplash | Homepage, Discover (focus area) |
| `iot-cloud.jpg` | Unsplash | Homepage, Discover (focus area) |
| `tech-advisory.jpg` | Unsplash | Homepage, Discover (focus area) |
| `recruitment.svg` | Custom | Homepage, Discover (service icon) |
| `solution-delivery.svg` | Custom | Homepage, Discover (service icon) |
| `product-dev.svg` | Custom | Homepage, Discover (service icon) |
| `custom-training.svg` | Custom | Homepage, Discover (service icon) |
| `thinglist.svg` | Placeholder | Homepage, Discover (portfolio) |
| `versaquant.svg` | Placeholder | Homepage, Discover (portfolio) |

### Video embeds:
| ID | Platform | Used on |
|----|----------|---------|
| `IY4ZjNNuNGI` | YouTube | Homepage hero, Blockchain hero |

---

## Deployment & Git Workflow

### Hosting

Both services are deployed on Railway from the same repo (`ussp/usspwebsite`). **Do NOT use Root Directory** — both services need the full repo available because the back office depends on `@ussp-platform/core` (shared package at `packages/platform-core/`). Instead, use Custom Build/Start Commands per service.

| Service | Root Directory | Custom Build Command | Custom Start Command | Domain |
|---------|---------------|---------------------|---------------------|--------|
| `ussp` (public site) | Empty | `cd packages/platform-core && npx tsc && cd ../.. && next build` | `npm run start` | `www.ussp.co` |
| `app` (back office) | Empty | `cd packages/platform-core && npx tsc && cd ../backoffice && next build` | `cd packages/backoffice && npm run start` | `app.ussp.co` |

### Railway Environment Variables — Public Site (`ussp` service)

| Variable | Purpose | Value |
|----------|---------|-------|
| `SITE_ID` | Multi-tenant site identifier | `ussp` |
| `SITE_NAME` | Display name | `US Software Professionals Inc.` |
| `SITE_DOMAIN` | Production domain | `www.ussp.co` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase REST API | `https://hjpmenorokkbszcedpjr.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | (from Supabase dashboard) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key (server-side only) | (from Supabase dashboard) |
| `AUTH_URL` | NextAuth production callback base URL | `https://www.ussp.co` |
| `AUTH_SECRET` | NextAuth session encryption | (generated secret) |
| `AUTH_LINKEDIN_ID` | LinkedIn OAuth app ID | (from LinkedIn Developer Portal) |
| `AUTH_LINKEDIN_SECRET` | LinkedIn OAuth app secret | (from LinkedIn Developer Portal) |

**CRITICAL:** If `AUTH_URL` is missing, LinkedIn OAuth will redirect to `localhost` and fail with "redirect_uri does not match the registered value".

### Railway Environment Variables — Back Office (`app` service)

| Variable | Purpose | Value |
|----------|---------|-------|
| `SITE_ID` | Multi-tenant site identifier | `ussp` |
| `SITE_NAME` | Display name | `USSP Back Office` |
| `SITE_DOMAIN` | Production domain | `app.ussp.co` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase REST API | `https://hjpmenorokkbszcedpjr.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | (same as public site) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | (same as public site) |
| `AUTH_URL` | NextAuth production callback base URL | `https://app.ussp.co` |
| `AUTH_SECRET` | NextAuth session encryption | (different secret from public site) |
| `GOOGLE_CLIENT_ID` | Google OAuth app ID | (from Google Cloud Console) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth app secret | (from Google Cloud Console) |
| `PORT` | HTTP port | `3000` |

**Back-office Railway build config:**
- Builder: Nixpacks
- Root Directory: Empty (full repo needed for shared package)
- Custom Build Command: `cd packages/platform-core && npx tsc && cd ../backoffice && next build`
- Custom Start Command: `cd packages/backoffice && npm run start`

**Manual deploy via CLI:**
```bash
railway service app && railway up    # Back office
railway service ussp && railway up   # Public site
```

### LinkedIn OAuth Setup (Public Site)

The LinkedIn Developer Portal (https://www.linkedin.com/developers/apps/) must have these **Authorized redirect URLs**:

| Environment | Redirect URL |
|-------------|-------------|
| Production | `https://www.ussp.co/api/auth/callback/linkedin` |
| Local dev | `http://localhost:3000/api/auth/callback/linkedin` |

### Google OAuth Setup (Back Office)

Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client: **USSP Back Office**

| Environment | Redirect URL |
|-------------|-------------|
| Production | `https://app.ussp.co/api/auth/callback/google` |
| Local dev | `http://localhost:3001/api/auth/callback/google` |

Authorized JavaScript Origins: `http://localhost:3001`, `https://app.ussp.co`

### Branch strategy:
- `main` - production branch, always deployable, auto-deploys to Railway
- Feature branches for significant changes

### Before every commit:
```bash
cd packages/platform-core && npx tsc    # Rebuild shared package
cd ../.. && npm run build               # Public site must pass with 0 errors
cd packages/backoffice && npm run build  # Back office must pass with 0 errors
```

### Commit message format:
```
[Action] [What changed] with [context]

Examples:
- Add healthcare staffing page with SEO optimization
- Update company address across all synced files
- Fix broken image reference on blockchain page
```

### After pushing:
- Railway auto-deploys BOTH services from `main` — check Railway dashboard for deploy status
- Spot-check public site at https://www.ussp.co
- Spot-check back office at https://app.ussp.co
- Test on mobile viewport

---

## Common Mistakes to Avoid

### 1. Updating content in only ONE place
**Wrong:** Change the phone number in `ContactForm.tsx` only
**Right:** Change it in ContactForm, Footer, layout.tsx JSON-LD, llms.txt, llms-full.txt, CLAUDE.md, every page with hardcoded contact info

### 2. Adding a page without updating sitemap
**Wrong:** Create `src/app/new-page/page.tsx` and forget `sitemap.ts`
**Right:** Always add to sitemap.ts, Header.tsx, Footer.tsx, llms.txt, llms-full.txt

### 3. Using wrong font
**Wrong:** `className="font-sans"` or `className="font-bold"`
**Right:** `className="font-[family-name:var(--font-alata)]"` for headings

### 4. Forgetting "Since 2003" in metadata
**Wrong:** `description: "USSP provides IT services"`
**Right:** `description: "Since 2003, USSP provides IT services with 20+ years of expertise"`

### 5. Hardcoding colors instead of using theme
**Wrong:** `className="bg-[#2563EB]"`
**Right:** `className="bg-primary"`

### 6. Not updating JSON-LD when content changes
**Wrong:** Change FAQ text in JSX but leave JSON-LD FAQ schema with old text
**Right:** Update BOTH the visible text AND the JSON-LD structured data

### 7. Forgetting llms.txt files
**Wrong:** Add a whole new service division page, never update llms.txt
**Right:** Any content change that affects what an AI should know about USSP → update llms.txt + llms-full.txt

### 8. Breaking image references
**Wrong:** Rename `healthcare-hero.jpg` to `medical-hero.jpg` without updating all pages
**Right:** Search for the old filename across ALL files before renaming

### 9. Modifying database schema without Alembic
**Wrong:** Add a column via Supabase dashboard SQL editor
**Right:** Create an Alembic migration, update `migrations/models.py`, run `alembic upgrade head`

### 10. Forgetting to sync TypeScript interfaces with schema changes
**Wrong:** Add a `description` column via Alembic but forget to update `src/lib/jobs.ts`
**Right:** Update the SQLAlchemy model, Alembic migration, TypeScript interface, `.select()` query, and page component — all in the same commit

---

## Quick Reference: "I want to..."

| I want to... | Files to touch |
|---|---|
| Change company address | `CLAUDE.md`, `layout.tsx`, `Footer.tsx`, `ContactForm.tsx`, `page.tsx`, `odi-training/page.tsx`, `small-business-solutions/page.tsx`, `lca-page/page.tsx`, `tops/page.tsx`, `llms.txt`, `llms-full.txt` |
| Change phone number | Same as address |
| Add a new service | `page.tsx`, `discover/page.tsx`, `layout.tsx` (knowsAbout), `Footer.tsx`, `llms.txt`, `llms-full.txt` |
| Add a new page | See "Adding a New Page" section (11 steps) |
| Remove a page | Delete dir, remove from `Header.tsx`, `Footer.tsx`, `sitemap.ts`, `llms.txt`, `llms-full.txt` |
| Change a page title | Page's `metadata.title`, `Header.tsx` navItems label, `sitemap.ts`, `llms.txt` |
| Update TOPS contract info | `CLAUDE.md`, `tops/page.tsx` (grid + JSON-LD + FAQ), `llms.txt`, `llms-full.txt` |
| Add new office location | `CLAUDE.md`, `layout.tsx` JSON-LD, `Footer.tsx`, `llms.txt`, `llms-full.txt`, `page.tsx` About section |
| Change brand colors | `globals.css` (theme tokens) - propagates via Tailwind |
| Change fonts | `globals.css` + `layout.tsx` (font imports) |
| Add social media links | `layout.tsx` JSON-LD `sameAs` array, `Footer.tsx`, `llms.txt` |
| Add a new AI crawler | `robots.txt` - add `User-agent` + `Allow: /` block |
| Update founding year claim | NEVER - it's 2003, verify with Registration #62642807 |
| Add a database column | `migrations/models.py` (SQLAlchemy model), new Alembic migration, `packages/platform-core/src/types/database.ts` (TypeScript interface), update query in `packages/platform-core/src/queries/`, rebuild package, `scripts/seed-jobs.ts` (if positions table) |
| Add a new database table | `migrations/models.py` (new class, include `site_id`), new Alembic migration, new query file in `packages/platform-core/src/queries/`, new API handler in `packages/platform-core/src/api/`, rebuild package |
| Add/update job positions | Run `npx tsx scripts/seed-jobs.ts` (upserts on `site_id,slug`), or use back office at `app.ussp.co/positions/new` |
| Onboard a new site | See "Onboarding a New Site" in Database Management section |
| Modify shared backend | Edit `packages/platform-core/src/`, run `cd packages/platform-core && npx tsc`, then rebuild all sites |
| Add a back-office page | Add page in `packages/backoffice/src/app/`, add API route, use `export const dynamic = "force-dynamic"` for server pages |
| Add a back-office staff user | Use `app.ussp.co/staff/new` or run `ADMIN_EMAIL=x npx tsx scripts/seed-admin.ts` |
| Change RBAC permissions | Edit `packages/platform-core/src/auth/rbac.ts` ROLE_PERMISSIONS, rebuild |
| Add back-office feature | Add query in `packages/platform-core/src/queries/admin/`, add API route in backoffice, add page, rebuild both |
