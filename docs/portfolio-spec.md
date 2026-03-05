# USSP Portfolio & Blog Specification

## Phase 1: Portfolio Page (`/portfolio`)

### Purpose
Showcase USSP's production-deployed software products as managed services that enable AI acceleration for small businesses and enterprises. The core positioning: **"We make sure your AI agents have the right context."** USSP connects siloed business systems, keeps data current, and delivers it to any AI agent framework — so businesses can focus on decisions, not data plumbing. No client names — white-labeled, deployable solutions.

### Core Positioning (Hero Message)
**"We Keep Your AI Agents Smart."**
Your AI is only as good as the data it can see. USSP connects your business systems, keeps context current, and ensures every AI agent — whether CrewAI, LangGraph, Claude, or custom — reasons over real-time, unified business data. Delivered as a managed service by a team with 20+ years of IT expertise.

### Page Structure

```
/portfolio
├── Hero: "We Keep Your AI Agents Smart"
├── Product Categories (filterable grid)
├── Individual Product Cards (expandable)
├── Delivery Model (Managed Services)
├── Tech Stack Overview
├── CTA: "Let's Build Your Solution"
└── Contact Form
```

---

### Delivery Model

**All products are delivered as managed services.** This is USSP's core differentiator — not just software, but software + expertise + ongoing support.

| Phase | What USSP Does |
|-------|---------------|
| **Discovery** | Understand the customer's business, systems, and workflows |
| **Build** | Custom integrations, business rules, domain knowledge, AI configuration |
| **Deploy** | Production deployment, data migration, staff training |
| **Manage** | Ongoing monitoring, new integrations, rule updates, optimization, support |

**Why managed service matters:**
- Every business has different systems (POS, CRM, phone vendors)
- Business rules change as the company grows
- Data sources update their APIs and break
- AI coaching and campaign logic needs tuning based on results
- USSP's 20+ years of IT expertise is the moat — anyone can install software, but building the right connectors, rules, and domain knowledge requires human expertise

This model creates **recurring revenue** and deep customer relationships, not one-time software sales.

---

### Product Catalog (White-Labeled)

#### Category 1: Business Intelligence & Analytics

| # | Product Name | Based On | Description |
|---|-------------|----------|-------------|
| 1 | **Unified Communications Intelligence Platform** | Communications app (deployed for entertainment venue) | AI-powered communications platform that integrates calls, SMS/texting, CRM, and POS data into a single intelligence layer. Generates outbound call campaigns from historical POS customer lists. Automates routine monitoring and follow-ups so staff can focus on upselling and conversion. AI-coached talking points, priority-ranked lead queues, and real-time performance dashboards — customized to each business's workflows. Vendor-agnostic phone integration (RingCentral and extensible to other providers). **Enables AI acceleration** — keeps communication data current and contextual so any AI agent framework (CrewAI, LangGraph, Claude, custom) can reason over real-time customer interactions. **Delivered as a managed service** — USSP builds the integrations, configures campaign rules, customizes AI coaching logic, and provides ongoing monitoring, optimization, and support. |
| 2 | **Executive Command Center** | AskCEO | Unified executive dashboard for multi-site business oversight. Real-time KPI scorecards, cross-functional insights across marketing, finance, operations, and staffing. Built-in financial planning with P&L forecasting, budget builder, multi-scenario "what-if" analysis, cash flow modeling, and EBITDA tracking. Automated alerts, threshold monitoring, and quick-action menus. |

#### Category 2: Marketing & Customer Engagement

| # | Product Name | Based On | Description |
|---|-------------|----------|-------------|
| 3 | **Marketing Automation Suite** | InstantMarketing Campaigns | AI-powered campaign management with customer segmentation, SMS automation, AI copywriting, real-time performance tracking, and built-in community/influencer relationship management for local marketing outreach. |
| 4 | **Competitive Intelligence Platform** | InstantMarketing CI | Automated competitor monitoring — pricing changes, events, reviews, SEO rankings, and market positioning insights delivered daily. |

#### Category 3: Operations & Facility Management

| # | Product Name | Based On | Description |
|---|-------------|----------|-------------|
| 7 | **Digital Twin (3D Facility Simulator)** | InstantMarketing Digital Twin | 3D facility simulation with real-time guest flow, zone occupancy, queue prediction, staffing ratios, and revenue-per-zone modeling. Replay historical days or simulate future scenarios. |
| 8 | **Staffing Optimizer** | InstantMarketing Staffing | Demand-based staffing forecasts, labor cost optimization, scheduling integration, and decline-factor modeling for daily operations. |

#### Category 4: Growth & Strategy

| # | Product Name | Based On | Description |
|---|-------------|----------|-------------|
| 7 | **Market Analysis & Site Selection** | InstantMarketing TAM | Total addressable market sizing by ZIP code, drive-time isochrone mapping, census demographic analysis, and competitive density scoring for new location decisions. |
| 8 | **Acquisition Scoring Engine** | ETAC | Multi-site benchmarking, acquisition opportunity scoring (0-100), fair value estimation, and portfolio optimization for growth-stage businesses and PE firms. |

#### Category 5: AI & Automation

| # | Product Name | Based On | Description |
|---|-------------|----------|-------------|
| 9 | **Managed Data Intelligence Platform** | VionOS ETL + Cognee Brain | A three-layer managed platform that turns siloed business data into AI-ready intelligence. **Connect:** Custom connectors for any data source (POS, CRM, phone, staffing, ads, census — 34 pre-built, extensible). **Understand:** Domain-specific business rules, insight generation, anomaly detection, and continuous data health monitoring. **Remember:** Processed data is ingested into a semantic knowledge graph (powered by Cognee) so AI agents have full business context for reasoning. Each deployment is customized — new connectors, rules, and domain knowledge are built to match the customer's specific systems and business logic. Ongoing managed service includes monitoring, new integrations, and rule updates as the business evolves. |
| 10 | **AI Workflow Engine** | VionOS / CrewAI Crews | Configurable AI agent workflows that automate marketing analysis, report generation, data validation, and operational insights. 8+ specialized AI crews powered by the Managed Data Intelligence Platform. |

---

### Product Card Design (per product)

Each card should display:
- **Icon** (SVG, category-colored)
- **Product name** (Alata font)
- **One-line tagline**
- **3-4 key features** (bullet points)
- **Tech badges** (e.g., "AI-Powered", "Real-Time", "Multi-Site")
- **Expandable details** (full description on click)

### Tech Stack Section

Display as a horizontal badge grid:
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Three.js
- **Backend:** Python, FastAPI, Flask, Node.js
- **Database:** PostgreSQL, Supabase, Redis
- **AI:** OpenAI GPT-4, Anthropic Claude, CrewAI
- **Cloud:** Railway, AWS, Vercel
- **Integrations:** RingCentral, CRM systems, POS platforms, Census API

### SEO Metadata

```
Title: "Products & Portfolio | Custom Software Solutions | USSP - Since 2003"
Description: "Since 2003, USSP builds production-grade software products: AI-powered analytics, marketing automation, 3D facility simulation, financial planning, and more. 20+ years of expertise."
Keywords: "custom software products, AI analytics platform, marketing automation, digital twin, staffing optimization, financial planning software, USSP portfolio"
```

### JSON-LD

- `ItemList` schema containing `SoftwareApplication` entries for each product
- `FAQPage` for common questions about custom development

---

## Phase 2: Blog (`/blog`)

### Purpose
SEO-driven content marketing with case studies, thought leadership, and technical insights. Each blog post is a potential search engine entry point.

### Architecture

```
/blog                     ← Blog index (paginated list)
/blog/[slug]              ← Individual blog post
```

### Implementation Options

| Option | Pros | Cons |
|--------|------|------|
| **A: MDX files in repo** | Simple, version controlled, no CMS needed | Requires deploy for new posts |
| **B: Supabase CMS** | Dynamic, no redeploy needed, admin UI | More complex, needs admin panel |
| **C: Headless CMS (Sanity/Contentful)** | Best editing UX, preview, scheduling | External dependency, cost |

**Recommendation:** Option A (MDX) for launch. Can migrate to B later.

### Blog File Structure

```
src/
├── app/blog/
│   ├── page.tsx              ← Blog index
│   └── [slug]/page.tsx       ← Blog post template
├── content/blog/
│   ├── call-intelligence-platform.mdx
│   ├── digital-twin-facility-simulation.mdx
│   ├── ai-marketing-automation.mdx
│   └── ...
```

### Initial Blog Posts (Case Studies)

| # | Title | Focus Product | Angle |
|---|-------|--------------|-------|
| 1 | "How AI Automates the Busywork So Your Team Can Focus on Selling" | Unified Comms Platform | POS-driven campaigns, AI coaching, automation of monitoring → humans focus on upselling & conversion |
| 2 | "3D Digital Twins: Simulating Your Facility Before Opening Day" | Digital Twin | Innovation, tech showcase |
| 3 | "Automating Small Business Marketing with AI Agents" | Marketing Suite | AI capabilities, time savings |
| 4 | "From Spreadsheets to Real-Time KPIs: Modernizing Business Intelligence" | KPI Dashboard | Before/after transformation |
| 5 | "Using Census Data and Drive-Time Analysis for Site Selection" | Market Analysis | Data-driven decision making |

### Blog Post Template

Each post includes:
- **Hero image**
- **Title + date + reading time**
- **Problem statement** (what the client struggled with)
- **Solution** (what USSP built, with screenshots)
- **Key features** (3-5 highlights)
- **Results** (metrics, improvements — use realistic but anonymized numbers)
- **Tech stack used**
- **CTA** → Contact form or /portfolio link

### Blog SEO

- Each post gets unique `metadata` with targeted keywords
- `BlogPosting` JSON-LD schema per post
- Internal links to `/portfolio` and `/ai-transformation`
- Social sharing meta (OpenGraph images)

---

## Implementation Order

### Phase 1: Portfolio (Priority)
1. Create `/portfolio` page with all 12 products
2. Add to Header nav, Footer, sitemap
3. Update llms.txt and llms-full.txt
4. Add JSON-LD structured data

### Phase 2: Blog (After Portfolio)
1. Set up MDX blog infrastructure
2. Create blog index and post template
3. Write first 3 case study posts
4. Add to nav and sitemap
5. Update llms.txt

---

## Files To Create/Modify

### Phase 1 (Portfolio)
| Action | File |
|--------|------|
| CREATE | `src/app/portfolio/page.tsx` |
| MODIFY | `src/components/Header.tsx` — add Portfolio to nav |
| MODIFY | `src/components/Footer.tsx` — add Portfolio link |
| MODIFY | `src/app/sitemap.ts` — add /portfolio |
| MODIFY | `src/app/layout.tsx` — add to knowsAbout |
| MODIFY | `public/llms.txt` — add Portfolio section |
| MODIFY | `public/llms-full.txt` — add detailed product descriptions |

### Phase 2 (Blog)
| Action | File |
|--------|------|
| CREATE | `src/app/blog/page.tsx` |
| CREATE | `src/app/blog/[slug]/page.tsx` |
| CREATE | `src/content/blog/*.mdx` (3-5 posts) |
| INSTALL | `@next/mdx` + `gray-matter` packages |
| MODIFY | `next.config.ts` — MDX support |
| MODIFY | `src/components/Header.tsx` — add Blog to nav |
| MODIFY | `src/app/sitemap.ts` — add /blog entries |
| MODIFY | `public/llms.txt` — add blog mention |
