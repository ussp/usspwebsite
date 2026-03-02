# AI Agent Development Guide - USSP Website

> **Purpose:** This is the definitive operational guide for ANY AI agent (Claude, ChatGPT, Copilot, Cursor, Windsurf, Devin, or any future AI coding assistant) working on the USSP website codebase.
>
> **Rule #1:** Read this ENTIRE document before making ANY change.
> **Rule #2:** When in doubt, check this document.
> **Rule #3:** After every change, verify against this document.

---

## 1. CRITICAL: Content Synchronization Map

The USSP website has content duplicated across multiple files for SEO and AEO purposes. **This is intentional.** Every piece of content exists in up to 6 places. If you update one and miss the others, the site becomes inconsistent and AI search engines will return conflicting information.

### 1.1 Master Content Registry

Every piece of important content and WHERE it lives:

#### Company Name
| Location | File | Line/Section |
|----------|------|-------------|
| Page title | `src/app/layout.tsx` | `metadata.title.default` |
| Meta description | `src/app/layout.tsx` | `metadata.description` |
| JSON-LD | `src/app/layout.tsx` | `Organization.name` |
| Footer brand | `src/components/Footer.tsx` | `<h3>USSP</h3>` |
| Header logo | `src/components/Header.tsx` | `<span>USSP</span>` |
| AI summary | `public/llms.txt` | Line 1 heading |
| AI full | `public/llms-full.txt` | About section heading + Company Details |
| TOPS page | `src/app/tops/page.tsx` | Hero text, JSON-LD `provider.name` |
| Careers | `src/app/careers/page.tsx` | Hero heading, body text |

#### Address: 875 N Michigan Ave, Suite 3100, Chicago, IL 60614
| Location | File |
|----------|------|
| Root JSON-LD | `src/app/layout.tsx` → `Organization.address` |
| Footer | `src/components/Footer.tsx` → contact column |
| Contact Form | `src/components/ContactForm.tsx` → address display |
| Homepage | `src/app/page.tsx` → (via ContactForm) |
| ODI Training | `src/app/odi-training/page.tsx` → contact section |
| Small Business | `src/app/small-business-solutions/page.tsx` → (via ContactForm) |
| LCA Page | `src/app/lca-page/page.tsx` → company info box |
| TOPS page | `src/app/tops/page.tsx` → JSON-LD `provider.address` |
| AI summary | `public/llms.txt` → Company Overview |
| AI full | `public/llms-full.txt` → Company Details + FAQ |

#### Phone: +1-(312) 546-4306
| Location | File |
|----------|------|
| Root JSON-LD | `src/app/layout.tsx` → `Organization.telephone` |
| Footer | `src/components/Footer.tsx` |
| Contact Form | `src/components/ContactForm.tsx` |
| ODI Training | `src/app/odi-training/page.tsx` |
| LCA Page | `src/app/lca-page/page.tsx` |
| AI summary | `public/llms.txt` |
| AI full | `public/llms-full.txt` |

#### Fax: +1-(312) 253-2026
| Location | File |
|----------|------|
| Root JSON-LD | `src/app/layout.tsx` → `Organization.faxNumber` |
| Footer | `src/components/Footer.tsx` |
| LCA Page | `src/app/lca-page/page.tsx` |
| AI summary | `public/llms.txt` |
| AI full | `public/llms-full.txt` |

#### Email: accounts@ussoftwarepro.com
| Location | File |
|----------|------|
| ODI Training | `src/app/odi-training/page.tsx` |
| Small Business | `src/app/small-business-solutions/page.tsx` |
| Contact Form | `src/components/ContactForm.tsx` → default prop |
| AI summary | `public/llms.txt` |
| AI full | `public/llms-full.txt` |

#### Email: medicalstaffing@ussp.co
| Location | File |
|----------|------|
| Healthcare Org | `src/app/healthcare-organization/page.tsx` → hero CTA + ContactForm |
| AI summary | `public/llms.txt` |
| AI full | `public/llms-full.txt` |

#### Founded: January 23, 2003
| Location | File |
|----------|------|
| Root JSON-LD | `src/app/layout.tsx` → `Organization.foundingDate` |
| Root meta | `src/app/layout.tsx` → `metadata.description` ("Since 2003") |
| Homepage about | `src/app/page.tsx` → "Established in 2003" |
| Footer | `src/components/Footer.tsx` → "Serving clients since 2003" |
| TOPS page | `src/app/tops/page.tsx` → multiple locations + both JSON-LD schemas |
| TOPS metadata | `src/app/tops/page.tsx` → `metadata.title` and `metadata.description` |
| Careers | `src/app/careers/page.tsx` → body text + `metadata.description` |
| All page metas | Every `page.tsx` → `metadata.description` includes "Since 2003" or "20+ years" |
| AI summary | `public/llms.txt` → Company Overview |
| AI full | `public/llms-full.txt` → Company Details `foundingDate` + FAQ |
| This guide | `CLAUDE.md` → Company Facts table |

#### Core Values: Integrity, Innovation, Respect, Accountability, Excellence
| Location | File |
|----------|------|
| Homepage | `src/app/page.tsx` → Values parallax section |
| AI summary | `public/llms.txt` → Core Values |
| AI full | `public/llms-full.txt` → Core Values section |
| This guide | `CLAUDE.md` → Company Facts table |

---

## 2. Architecture Decision Records

### 2.1 Why Next.js App Router?
- Server-side rendering for SEO
- Static generation for performance
- Built-in sitemap generation
- TypeScript for type safety
- Easy to extend with new pages

### 2.2 Why Tailwind CSS v4?
- Utility-first for rapid development
- Theme tokens in `globals.css` via `@theme inline`
- No separate tailwind.config.js needed (v4 uses CSS)

### 2.3 Why three font families?
- **Alata** = Brand identity (headings, nav, buttons) - distinctive, modern
- **Montserrat** = Readability (body text) - professional, clean
- **League Spartan** = Special emphasis - reserved for display use
- These match the original Strikingly site design

### 2.4 Why llms.txt AND llms-full.txt?
- `llms.txt` = Quick reference (~100 lines) for AI that needs fast answers
- `llms-full.txt` = Complete reference (~400+ lines) for AI that needs deep details
- Both follow the emerging `llms.txt` protocol standard
- Linked via `<link rel="alternate">` in `<head>` for crawler discovery

### 2.5 Why JSON-LD instead of microdata?
- Google officially recommends JSON-LD
- Easier to maintain (separate from HTML)
- Supports nested schemas
- Better for AI answer extraction

---

## 3. File-by-File Responsibility Map

### 3.1 Root Configuration

| File | Responsibility | When to modify |
|------|---------------|----------------|
| `next.config.ts` | Image domains, build config | Adding external image sources |
| `tsconfig.json` | TypeScript config | Never (unless adding paths) |
| `package.json` | Dependencies | Adding new npm packages |
| `postcss.config.mjs` | PostCSS/Tailwind | Never |
| `eslint.config.mjs` | Linting rules | Adjusting code style rules |
| `.gitignore` | Git ignore patterns | Adding build artifacts |

### 3.2 Global Files (affect EVERY page)

| File | Responsibility | Impact of change |
|------|---------------|-----------------|
| `src/app/layout.tsx` | Root layout, fonts, global metadata, Organization JSON-LD | Changes title template, meta, schema for ALL pages |
| `src/app/globals.css` | Color tokens, font variables, base styles | Changes design tokens site-wide |
| `src/components/Header.tsx` | Navigation menu | Changes nav on ALL pages |
| `src/components/Footer.tsx` | Footer content, links | Changes footer on ALL pages |

### 3.3 Shared Components

| Component | Used by | Props |
|-----------|---------|-------|
| `HeroSection` | Homepage, Small Biz, Blockchain, HC-Staffing, HC-Org | heading, subheading, buttonText, buttonHref, backgroundImage, videoId, videoType, overlay, height |
| `ContactForm` | Homepage, ODI, Small Biz, Blockchain, HC-Staffing, HC-Org, TOPS, Careers | title, subtitle, showAddress, email |
| `SectionHeading` | Almost every page | title, subtitle, light |
| `ProcessTimeline` | Small Biz, Blockchain, HC-Staffing | steps[], title, subtitle |
| `ExpandableSection` | HC-Staffing | title, content |

### 3.4 Page Files

| Page | Route | Metadata | JSON-LD | Contact |
|------|-------|----------|---------|---------|
| Homepage | `/` | Yes | Via layout | ContactForm (default) |
| IT Services | `/discover` | Yes | No | ContactForm (default) |
| Healthcare Gateway | `/healthcare` | Yes | No | No |
| HC Staffing | `/healthcare-staffing` | Yes | No | ContactForm (default) |
| HC Organization | `/healthcare-organization` | Yes | No | ContactForm (medicalstaffing@) |
| Blockchain | `/blockchain` | Yes | No | ContactForm (default) |
| Small Business | `/small-business-solutions` | Yes | No | ContactForm (accounts@) |
| ODI Training | `/odi-training` | Yes | No | ContactForm (accounts@) |
| TOPS | `/tops` | Yes | GovernmentService + FAQPage | ContactForm (default) |
| Careers | `/careers` | Yes | No | ContactForm (default) |
| LCA | `/lca-page` | Yes | No | No (info only) |
| Discover1 | `/discover1` | Yes | No | No (redirect) |

### 3.5 SEO/AEO Files

| File | URL Path | Format | Update frequency |
|------|----------|--------|-----------------|
| `public/llms.txt` | `/llms.txt` | Markdown | Every content change |
| `public/llms-full.txt` | `/llms-full.txt` | Markdown | Every content change |
| `public/robots.txt` | `/robots.txt` | robots.txt | When new AI crawlers emerge |
| `src/app/sitemap.ts` | `/sitemap.xml` | Generated XML | When pages added/removed |

---

## 4. Standard Operating Procedures

### 4.1 SOP: Adding a New Page

```
CHECKLIST (do not skip any step):

□ 1. Create directory: src/app/{slug}/
□ 2. Create page.tsx with Metadata export
□ 3. Include "Since 2003" or "20+ years" in metadata.description
□ 4. Use design system fonts and colors (see Section 6)
□ 5. Use shared components (HeroSection, SectionHeading, ContactForm)
□ 6. Add to Header.tsx navItems array
□ 7. Add to Footer.tsx link columns (if relevant)
□ 8. Add to sitemap.ts with priority and changeFrequency
□ 9. Add section to public/llms.txt
□ 10. Add detailed section to public/llms-full.txt
□ 11. Add JSON-LD schema if applicable (Service, FAQPage, Course, etc.)
□ 12. Run: npm run build (must pass with 0 errors)
□ 13. Visual check in browser
□ 14. Git commit and push
```

### 4.2 SOP: Removing a Page

```
CHECKLIST:

□ 1. Delete src/app/{slug}/ directory
□ 2. Remove from Header.tsx navItems
□ 3. Remove from Footer.tsx links
□ 4. Remove from sitemap.ts
□ 5. Remove section from public/llms.txt
□ 6. Remove section from public/llms-full.txt
□ 7. Search entire codebase for links to the page: grep -r "/{slug}" src/
□ 8. Update/remove any internal links pointing to deleted page
□ 9. Consider adding a redirect if the page had external traffic
□ 10. Run: npm run build
□ 11. Git commit and push
```

### 4.3 SOP: Updating Company Contact Info

```
CHECKLIST (for address, phone, fax, email, or hours change):

□ 1. Update CLAUDE.md Company Facts table
□ 2. Update src/app/layout.tsx → JSON-LD Organization schema
□ 3. Update src/components/Footer.tsx → contact column
□ 4. Update src/components/ContactForm.tsx → displayed info
□ 5. Update src/app/page.tsx → if About section mentions it
□ 6. Update src/app/odi-training/page.tsx → contact section
□ 7. Update src/app/small-business-solutions/page.tsx → contact section
□ 8. Update src/app/lca-page/page.tsx → company info box
□ 9. Update src/app/tops/page.tsx → JSON-LD provider.address + FAQ
□ 10. Update public/llms.txt → Company Overview + Contact sections
□ 11. Update public/llms-full.txt → Company Details + FAQ answers
□ 12. Run: npm run build
□ 13. Git commit and push
```

### 4.4 SOP: Updating Service Offerings

```
CHECKLIST:

□ 1. Update the specific service page (e.g., discover/page.tsx)
□ 2. Update src/app/page.tsx if homepage also shows this service
□ 3. Update src/app/layout.tsx → JSON-LD knowsAbout array
□ 4. Update src/components/Footer.tsx → Services column if needed
□ 5. Update public/llms.txt → Services section
□ 6. Update public/llms-full.txt → Detailed service description
□ 7. Run: npm run build
□ 8. Git commit and push
```

### 4.5 SOP: Adding a Government Contract

```
CHECKLIST:

□ 1. Create new page: src/app/{contract-slug}/page.tsx
□ 2. Include Metadata with keywords (contract #, agency, role)
□ 3. Add GovernmentService JSON-LD schema
□ 4. Add FAQPage JSON-LD schema with Q&A about the contract
□ 5. Include "Since 2003" and "20+ years" for credibility
□ 6. Add to Header.tsx → Government dropdown
□ 7. Add to sitemap.ts with priority 0.9
□ 8. Add to public/llms.txt → Government Contracts section
□ 9. Add to public/llms-full.txt → Full contract details + FAQ
□ 10. Update CLAUDE.md if contract details need to be in source of truth
□ 11. Run: npm run build
□ 12. Git commit and push
```

### 4.6 SOP: Adding Social Media / External Profiles

```
CHECKLIST:

□ 1. Update src/app/layout.tsx → JSON-LD Organization.sameAs array
□ 2. Add social links to src/components/Footer.tsx
□ 3. Update public/llms.txt → add social URLs
□ 4. Update public/llms-full.txt → add social URLs
□ 5. Git commit and push
```

---

## 5. SEO Rules

### 5.1 Title Tag Format
```
{Page Title} | USSP
```
The `| USSP` suffix is automatically added by `metadata.title.template` in layout.tsx.
Exception: Homepage uses the full default title.

### 5.2 Meta Description Rules
- Maximum 160 characters
- MUST include "Since 2003" OR "20+ years" OR "established 2003"
- MUST include primary keyword for the page
- MUST include "USSP" or "US Software Professionals"
- Should include a call-to-action or value proposition

### 5.3 Heading Hierarchy
```
H1 → Only ONE per page (main heading in hero or first section)
H2 → Section headings (use SectionHeading component)
H3 → Subsection headings within sections
H4+ → Rarely used, only for deep nesting
```

### 5.4 Image SEO
- File names: descriptive, kebab-case (`healthcare-hero.jpg` not `IMG_001.jpg`)
- Alt text: descriptive, includes context (`"Healthcare professional with patient"`)
- Use Next.js `<Image>` component for automatic optimization
- Lazy loading is automatic (except above-fold images with `priority`)

### 5.5 Internal Linking
- Every page should link to at least 2 other USSP pages
- Use descriptive anchor text (not "click here")
- Homepage should link to all major service pages

### 5.6 JSON-LD Schema Types Used

| Schema | Page | Purpose |
|--------|------|---------|
| `Organization` | layout.tsx (all pages) | Company knowledge panel |
| `GovernmentService` | tops/page.tsx | Government contract details |
| `FAQPage` | tops/page.tsx | FAQ rich results |

### 5.7 When to Add New JSON-LD
- New service page → `Service` schema
- New training page → `Course` schema
- New FAQ content → `FAQPage` schema
- New job listings → `JobPosting` schema
- New contract page → `GovernmentService` schema

---

## 6. Design System Reference

### 6.1 Font Application Cheat Sheet

```tsx
// ✅ CORRECT - Headings, nav items, buttons, labels
<h2 className="font-[family-name:var(--font-alata)]">Title</h2>

// ✅ CORRECT - Body text, descriptions, paragraphs
<p className="font-[family-name:var(--font-montserrat)]">Text</p>

// ❌ WRONG - Never use generic font classes
<h2 className="font-sans">Title</h2>
<p className="font-serif">Text</p>
```

### 6.2 Color Application Cheat Sheet

```tsx
// Backgrounds
bg-white          // Standard white section
bg-light-gray     // Alternating gray section
bg-near-black     // Dark section (hero, footer)
bg-primary        // CTA banner, accent section
bg-primary-dark   // Hover state for primary

// Text
text-dark         // Standard body text on light bg
text-dark/70      // Secondary text on light bg
text-dark/50      // Tertiary/muted text
text-white        // Text on dark bg
text-white/80     // Secondary text on dark bg
text-white/50     // Muted text on dark bg
text-primary      // Accent text, links, labels

// Borders
border-dark/10    // Subtle border on cards
border-white/10   // Subtle border on dark bg
```

### 6.3 Section Layout Pattern

```tsx
// Standard section
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeading title="..." subtitle="..." />
    {/* Content */}
  </div>
</section>

// Narrow content section
<section className="py-20 bg-light-gray">
  <div className="max-w-4xl mx-auto px-4">
    <SectionHeading title="..." />
    {/* Content */}
  </div>
</section>

// Dark section
<section className="py-20 bg-near-black text-white">
  <div className="max-w-4xl mx-auto px-4 text-center">
    {/* Content */}
  </div>
</section>
```

### 6.4 Card Pattern
```tsx
<div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
  <h3 className="text-lg font-[family-name:var(--font-alata)] mb-3">Title</h3>
  <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)]">Description</p>
</div>
```

### 6.5 Button Patterns
```tsx
// Primary CTA (filled)
<a className="px-8 py-3 bg-primary text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors">

// Secondary CTA (outline on light)
<a className="px-8 py-3 border-2 border-near-black text-near-black font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-near-black hover:text-white transition-all">

// CTA on dark background (outline)
<a className="px-8 py-3 border-2 border-white text-white font-[family-name:var(--font-alata)] text-sm uppercase tracking-wider hover:bg-white hover:text-near-black transition-all">
```

---

## 7. Testing Procedures

### 7.1 Before Every Commit
```bash
# Must pass with 0 errors
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Visual check
npm run dev
# Then check: homepage, at least 2 other pages, mobile viewport
```

### 7.2 Content Sync Verification
After any content change, run these mental checks:

1. **Search test:** `grep -r "OLD_VALUE" src/ public/` → should return 0 results
2. **AI answer test:** "If I asked Claude/ChatGPT about this, would it get the right answer from llms.txt?"
3. **Nav test:** Does the navigation reflect all current pages?
4. **Sitemap test:** Does sitemap.ts include all public pages?
5. **Footer test:** Does the footer have working links to all major sections?

### 7.3 SEO Verification
After any metadata change:
1. Check page `<title>` in browser tab
2. Check `<meta name="description">` via View Source
3. Check JSON-LD via Google Rich Results Test (when deployed)
4. Verify sitemap.xml is accessible at `/sitemap.xml`

---

## 8. Disaster Recovery

### 8.1 If content gets out of sync
1. Treat `CLAUDE.md` Company Facts table as the source of truth
2. Run a full audit of all files listed in Section 1.1
3. Update all files to match CLAUDE.md
4. Rebuild and test

### 8.2 If a build fails after changes
1. Read the error message carefully
2. Most common: missing import, JSX syntax error, or TypeScript type error
3. Do NOT skip TypeScript errors - they indicate real problems
4. Fix the error, rebuild, then commit

### 8.3 If AI search returns wrong info about USSP
1. Check `public/llms.txt` and `public/llms-full.txt` for accuracy
2. Check JSON-LD schemas for accuracy
3. Check `public/robots.txt` still allows AI crawlers
4. Update the incorrect content in ALL locations
5. Wait for crawlers to re-index (can take days to weeks)

---

## 9. Future Considerations

### 9.1 When Adding CMS Integration
If a CMS (Contentful, Sanity, Strapi) is added later:
- `llms.txt` and `llms-full.txt` should be auto-generated from CMS content
- JSON-LD should be dynamically built from CMS data
- Sitemap should be dynamically generated from CMS pages
- This guide's sync checklists become less critical (CMS is single source)

### 9.2 When Adding Blog
- Create `src/app/blog/` with dynamic routes
- Add `BlogPosting` JSON-LD schema per post
- Update sitemap.ts to dynamically include blog posts
- Add blog section to llms.txt
- Add RSS feed at `/feed.xml`

### 9.3 When Adding Job Board
- Create dynamic job listing pages
- Add `JobPosting` JSON-LD per listing
- Update careers page to pull from job data
- Add job listings to llms-full.txt or auto-generate

### 9.4 When Adding New Government Contracts
- Follow SOP 4.5 exactly
- Each contract gets its own page with its own JSON-LD
- Update the Government dropdown in Header.tsx
- ALWAYS include contract numbers, agency, role, and expiry date
