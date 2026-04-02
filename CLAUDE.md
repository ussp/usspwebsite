# USSP Website - AI Agent Maintenance Guide

> **CRITICAL:** This document is the single source of truth for maintaining the USSP website.
> Every AI agent MUST read this file before making ANY changes to the site.
> Failure to follow this guide will result in broken SEO, desynchronized content, and lost information.

---

## Detailed References

For detailed guides, see memory files (AI agents: read these as needed for the task at hand):

- **Database & migrations:** `~/.claude/projects/D--Code-ussp/memory/database.md` — tables, schema changes, Alembic commands, seeding, onboarding new sites
- **Content sync checklist:** `~/.claude/projects/D--Code-ussp/memory/content-sync.md` — which files to update when company info, navigation, services, healthcare, TOPS, or core values change
- **Deployment & env vars:** `~/.claude/projects/D--Code-ussp/memory/deployment.md` — Railway config, env vars for both services, OAuth setup, git workflow
- **SEO/AEO checklists:** `~/.claude/projects/D--Code-ussp/memory/seo-aeo.md` — per-page SEO requirements, AI crawler config, llms.txt format rules
- **Adding/updating pages:** `~/.claude/projects/D--Code-ussp/memory/adding-pages.md` — 11-step new page process, content update procedures, image/media management

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
- **Back-office app**: `packages/backoffice/` — internal admin portal (Google OAuth, RBAC)
- **Site template**: `packages/site-template/` — scaffold for creating new site repos

### File Map

```
D:/Code/ussp/
├── CLAUDE.md                            ← THIS FILE
├── alembic.ini                          ← Alembic migration config
├── migrations/                          ← DB schema migrations (Alembic)
│   ├── env.py, models.py, script.py.mako
│   └── versions/                        ← Migration scripts
├── packages/
│   ├── platform-core/                   ← SHARED NPM PACKAGE (@ussp-platform/core)
│   │   └── src/
│   │       ├── index.ts, config.ts
│   │       ├── supabase/{server,client}.ts
│   │       ├── queries/{jobs,applications,contact,analytics}.ts
│   │       ├── queries/admin/{positions,applications,staff,contacts,dashboard,audit}.ts
│   │       ├── queries/admin/{candidates,certifications,resumes,matching,candidate-pii}.ts
│   │       ├── auth/{config,admin-config,rbac}.ts
│   │       ├── api/{applications,upload,contact}.ts
│   │       └── types/{database,admin,site,matching}.ts
│   ├── backoffice/                      ← BACK-OFFICE APP (app.ussp.co)
│   │   └── src/app/
│   │       ├── layout.tsx, globals.css, page.tsx (dashboard)
│   │       ├── login/, positions/, applications/, candidates/, contacts/, staff/
│   │       └── api/                     ← API routes (incl. applications/by-email)
│   └── site-template/                   ← Scaffold for new site repos
├── scripts/
│   ├── seed-jobs.ts                     ← Seed job positions
│   ├── seed-admin.ts                    ← Seed admin user
│   └── backfill-candidates.ts           ← Fix orphaned applications missing candidates
├── public/
│   ├── llms.txt, llms-full.txt          ← AI search files (MUST sync with content)
│   ├── robots.txt
│   └── assets/{images,icons,logos}/
└── src/
    ├── app/
    │   ├── layout.tsx                   ← ROOT LAYOUT: fonts, metadata, JSON-LD Organization
    │   ├── globals.css                  ← Design tokens
    │   ├── sitemap.ts                   ← XML sitemap (add new pages here)
    │   ├── page.tsx                     ← Homepage
    │   ├── discover/page.tsx            ← IT Services
    │   ├── healthcare/page.tsx          ← Healthcare gateway
    │   ├── healthcare-staffing/page.tsx ← For professionals
    │   ├── healthcare-organization/page.tsx ← For organizations
    │   ├── blockchain/page.tsx          ← Blockchain services
    │   ├── small-business-solutions/page.tsx
    │   ├── odi-training/page.tsx        ← ODI Training
    │   ├── tops/page.tsx                ← TOPS contract (has own JSON-LD)
    │   ├── insights/page.tsx            ← Insights listing (dynamic)
    │   ├── insights/[slug]/page.tsx     ← Article detail
    │   ├── careers/page.tsx             ← Careers (dynamic, from Supabase)
    │   ├── lca-page/page.tsx            ← LCA compliance
    │   └── discover1/page.tsx           ← Redirect to /discover
    ├── lib/
    │   ├── jobs.ts, auth.ts             ← Re-exports from @ussp-platform/core
    │   └── supabase/{server,client}.ts  ← Re-exports from @ussp-platform/core
    └── components/
        ├── Header.tsx                   ← Navigation (navItems array)
        ├── Footer.tsx                   ← Footer links, address, "since 2003"
        ├── ContactForm.tsx              ← Reusable contact form
        ├── HeroSection.tsx              ← Hero with video/image background
        ├── SectionHeading.tsx           ← Consistent section titles
        ├── ProcessTimeline.tsx          ← Numbered step timeline
        ├── ExpandableSection.tsx        ← Accordion/collapsible
        ├── ApplicationForm.tsx          ← Job application form
        ├── LinkedInButton.tsx, ShareButtons.tsx, FileUpload.tsx
```

---

## Design System Rules

### Fonts

| Font | CSS Variable | Usage | Weight |
|------|-------------|-------|--------|
| Alata | `--font-alata` | Headings, nav, buttons, labels | 400 |
| Montserrat | `--font-montserrat` | Body text, paragraphs, descriptions | 400, 700 |
| League Spartan | `--font-spartan` | Display text (special use) | 400, 700 |

```tsx
className="font-[family-name:var(--font-alata)]"       // Headings
className="font-[family-name:var(--font-montserrat)]"   // Body
className="font-[family-name:var(--font-spartan)]"      // Display
```

### Colors (defined in `globals.css`)

| Name | Hex | Tailwind class |
|------|-----|---------------|
| White | `#FFFFFF` | `bg-white` / `text-white` |
| Dark | `#222222` | `bg-dark` / `text-dark` |
| Light Gray | `#E8EAEC` | `bg-light-gray` |
| Near Black | `#1C1C1C` | `bg-near-black` |
| Primary Blue | `#2563EB` | `bg-primary` / `text-primary` |
| Primary Dark | `#1D4ED8` | `bg-primary-dark` |

### Section Patterns
- **White sections:** `bg-white` + `text-dark`
- **Gray sections:** `bg-light-gray` + `text-dark`
- **Dark sections:** `bg-near-black` + `text-white`
- **Alternating:** White -> Gray -> White -> Gray (visual rhythm)

### Spacing
- Section padding: `py-20` (standard), `py-32` (hero/feature)
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Narrow content: `max-w-4xl mx-auto px-4`

### Component Hierarchy
1. `SectionHeading` for section titles (H2 consistency)
2. `HeroSection` for page hero areas
3. `ContactForm` for contact sections (prevents address drift)
4. `ProcessTimeline` for numbered steps
5. `ExpandableSection` for collapsible FAQ-style content

---

## Common Mistakes to Avoid

1. **Updating content in only ONE place** — Change phone/address/email in ALL synced files (see content-sync.md)
2. **Adding a page without updating sitemap** — Always add to `sitemap.ts`, `Header.tsx`, `Footer.tsx`, `llms.txt`, `llms-full.txt`
3. **Using wrong font** — Use `font-[family-name:var(--font-alata)]` not `font-sans`
4. **Forgetting "Since 2003" in metadata** — Every page description should include "Since 2003" or "20+ years"
5. **Hardcoding colors** — Use `bg-primary` not `bg-[#2563EB]`
6. **Not updating JSON-LD when content changes** — Update BOTH visible text AND JSON-LD structured data
7. **Forgetting llms.txt files** — Any content change affecting what AI should know about USSP -> update both llms files
8. **Breaking image references** — Search for old filename across ALL files before renaming
9. **Modifying DB schema without Alembic** — Never use Supabase dashboard SQL editor for DDL
10. **Forgetting to sync TypeScript interfaces** — Update SQLAlchemy model, Alembic migration, TS interface, `.select()` query, and page component together

---

## Quick Reference: "I want to..."

| I want to... | Files to touch |
|---|---|
| Change company address/phone | `CLAUDE.md`, `layout.tsx`, `Footer.tsx`, `ContactForm.tsx`, `page.tsx`, `odi-training/page.tsx`, `small-business-solutions/page.tsx`, `lca-page/page.tsx`, `tops/page.tsx`, `llms.txt`, `llms-full.txt` |
| Add a new service | `page.tsx`, `discover/page.tsx`, `layout.tsx` (knowsAbout), `Footer.tsx`, `llms.txt`, `llms-full.txt` |
| Add a new page | See `adding-pages.md` (11 steps) |
| Remove a page | Delete dir, remove from `Header.tsx`, `Footer.tsx`, `sitemap.ts`, `llms.txt`, `llms-full.txt` |
| Change a page title | Page `metadata.title`, `Header.tsx`, `sitemap.ts`, `llms.txt` |
| Update TOPS contract info | `CLAUDE.md`, `tops/page.tsx` (grid + JSON-LD + FAQ), `llms.txt`, `llms-full.txt` |
| Add new office location | `CLAUDE.md`, `layout.tsx` JSON-LD, `Footer.tsx`, `llms.txt`, `llms-full.txt`, `page.tsx` |
| Change brand colors | `globals.css` (theme tokens) — propagates via Tailwind |
| Change fonts | `globals.css` + `layout.tsx` (font imports) |
| Add social media links | `layout.tsx` JSON-LD `sameAs`, `Footer.tsx`, `llms.txt` |
| Add a new AI crawler | `robots.txt` — add `User-agent` + `Allow: /` block |
| Update founding year | NEVER — it's 2003, verify with Registration #62642807 |
| Add a database column | See `database.md` — models.py, Alembic migration, TS interface, query, seed script |
| Add a new database table | See `database.md` — models.py (with `site_id`), migration, query, API handler |
| Add/update job positions | `npx tsx scripts/seed-jobs.ts` or back office at `app.ussp.co/positions/new` |
| Onboard a new site | See `database.md` — Onboarding section |
| Modify shared backend | Edit `packages/platform-core/src/`, run `cd packages/platform-core && npx tsc`, rebuild all sites |
| Add a back-office page | Page in `packages/backoffice/src/app/`, API route, `export const dynamic = "force-dynamic"` |
| Add back-office staff user | `app.ussp.co/staff/new` or `ADMIN_EMAIL=x npx tsx scripts/seed-admin.ts` |
| Change RBAC permissions | Edit `packages/platform-core/src/auth/rbac.ts`, rebuild |
| Add back-office feature | Query in `platform-core/src/queries/admin/`, API route, page, rebuild both |
| Add candidate certification | Back office at `app.ussp.co/candidates/[id]` — certifications card, or API `POST /api/candidates/[id]/certifications` |
| Verify a certification | Back office candidate detail — click checkmark on cert, or API `PATCH /api/candidates/[id]/certifications/[certId]` with `{ action: "verify" }` |
| Update candidate salary | Back office candidate detail — salary expectations card, or API `PATCH /api/candidates/[id]` with `salary_expectation_min`, `salary_expectation_max`, `salary_type` |
| Fix orphaned applications | `npx tsx scripts/backfill-candidates.ts` — creates missing candidate records and links them |
| Add matching dimension | Edit `packages/platform-core/src/types/matching.ts` — add to `MatchDimension`, `DEFAULT_WEIGHTS`, `CandidateMatchData`, `PositionMatchData` |
| View/update onboarding | Back office candidate detail page — sidebar shows onboarding checklist (I-9, Background, Orientation) |
| Add a pipeline gate check | Edit `packages/platform-core/src/queries/admin/pipeline-gates.ts` — add check in `checkPipelineGates()` |
| Override a gate check | Advance with `forceOverride: true` in PATCH `/api/applications/[id]` — audit logged, admin/recruiter only |
