# OpenSpec: Free Tools Marketing Module
## AI Transformation Platform — SEO-Driven Lead Generation via Public Free Tools

**Version:** 1.0
**Date:** 2026-04-06
**Status:** Proposed
**Author:** USSP Engineering
**Deployment:** tools.ussp.co/tools/* (public, no auth)
**Strategy Source:** [Engineering as Marketing Playbook](./strategy-engineering-as-marketing.md)

---

## 1. Overview

Add a suite of public, no-login-required free tools to the AI Transformation Platform (`tools.ussp.co`) that rank on Google for high-intent keywords and funnel visitors toward USSP's paid AI transformation engagements.

This follows the **Engineering as Marketing** strategy: build small, useful tools that target specific search keywords, deliver instant value, and include a CTA to the main product. Each tool is a standalone page under `/tools/*` — completely independent of the authenticated engagement workflow.

**Key constraint:** Zero marketing spend. All traffic comes from organic Google search. The tools themselves ARE the marketing.

---

## 2. Why We're Doing This

### 2.1 The Business Case

USSP has built a powerful AI Transformation Monitor, but **nobody outside our direct network knows it exists**. Every customer today comes from one of two channels:

1. **TOPS contract relationships** — government agencies we already work with through Krasan
2. **Direct outreach** — cold emails, LinkedIn messages, personal introductions

Both channels are **linear**: every new customer requires manual effort to find and close. There is no compounding effect. If we stop reaching out, leads stop.

**Engineering as Marketing flips this.** Instead of finding customers one at a time, we build free tools that rank on Google and attract customers who are *already searching for exactly what we offer*. Every tool we publish works 24/7, forever, at zero marginal cost. Traffic compounds as more tools rank for more keywords.

### 2.2 Why This Strategy Fits USSP

| Strength | How It Applies |
|----------|---------------|
| **We're builders, not marketers** | This strategy turns building into marketing. No ad campaigns, no cold email sequences, no content calendar. Just build useful tools. |
| **We already have the domain expertise** | DORA metrics, SPACE framework, AI readiness — we literally built an enterprise platform around these. Simplified public versions are trivial. |
| **We already have the components** | RadarChart, LikertScale, BeforeAfterCard, StateLawSelector — these exist and work. We're wrapping existing IP in SEO-friendly pages. |
| **Government buyers research online** | IT directors and engineering managers Google "DORA metrics calculator" before they issue an RFP. Being the tool they find = being top of mind when budget opens. |
| **Zero ongoing cost** | No ad spend, no marketing team, no content writers. Just occasional new tool builds as keyword opportunities emerge. |
| **TOPS contract = credibility** | When a government IT leader uses our free DORA calculator and sees "US Software Professionals — TOPS Authorized Subvendor", that builds trust before we ever talk to them. |

### 2.3 What Success Looks Like

**3 months:** 5-8 tools live, Google starts indexing, first organic visitors trickling in. LinkedIn posts sharing the tools drive early traffic.

**6 months:** 13 tools live, 5,000+ monthly visitors, first inbound leads from people we've never contacted. "I found your DORA calculator and want to talk about AI training for our team."

**12 months:** Tools are ranking page 1 for 20+ keywords. Inbound leads supplement TOPS outreach. The AI Transformation Monitor has a public presence independent of the contract relationship.

**Long-term:** Every new government engagement starts with "I've already used your free tools" — the sales conversation is warmer and shorter.

### 2.4 Why Now

- The AI Transformation Monitor is built and stable — we have capacity to build the marketing layer
- AI tool adoption is accelerating in government (executive orders, agency mandates) — search volume for "AI readiness" and "AI ROI" keywords is growing
- Competitors haven't built free tools in this niche yet — low keyword difficulty means we can rank now before the space gets crowded
- With AI-assisted coding, building 13 tools takes ~35 hours total — the ROI on that time investment is enormous if even one tool generates a single government engagement ($50K+ revenue)

---

## 3. Current State (The Problem)

The AI Transformation Monitor is a powerful enterprise tool, but it has **zero organic discovery**:
- The root `layout.tsx` sets `robots: "noindex, nofollow"` in metadata — Google is told not to index any page
- No `robots.txt` or `sitemap.xml` exist for the ai-tools subdomain
- No public-facing pages exist — every page requires Google OAuth login
- Traffic relies entirely on direct outreach and TOPS contract relationships
- Potential customers searching for "DORA metrics calculator" or "AI readiness assessment" never encounter USSP

### The Opportunity

Engineering managers, Scrum masters, and government IT leaders actively search for:
- DevOps measurement tools (DORA calculators, velocity trackers)
- AI readiness assessments and checklists
- ROI calculators for AI training investment
- Compliance checklists for AI governance

These searchers are **exactly the people** who would benefit from a full AI Transformation engagement. By building free versions of tools that USSP already has internally, we create a permanent, compounding inbound lead channel.

### Proven Results (Case Study)

Bhanu (SiteGPT, $13K MRR) used this exact strategy:
- 50 free tools → 50,000 monthly visitors → 300 leads/month → $0 ad spend
- 90% of Google traffic comes from free tools
- Each new tool takes <5 minutes to build once templates exist

---

## 4. Solution Architecture

### 4.1 Public Tools Module

All free tools live under `/tools/*` and share a common layout with NO authentication required.

```
tools.ussp.co/tools/                         → Tools directory (listing page)
tools.ussp.co/tools/dora-calculator          → DORA Metrics Calculator
tools.ussp.co/tools/velocity-calculator      → Sprint Velocity Calculator
tools.ussp.co/tools/ai-readiness-quiz        → AI Readiness Assessment (public)
tools.ussp.co/tools/ai-roi-calculator        → AI ROI Calculator
tools.ussp.co/tools/dev-productivity-score   → Developer Productivity Score
tools.ussp.co/tools/team-health-check        → Scrum Team Health Check
tools.ussp.co/tools/state-ai-laws            → State AI Law Checker
tools.ussp.co/tools/training-plan-generator  → AI Training Plan Generator
tools.ussp.co/tools/change-failure-rate      → Change Failure Rate Calculator
tools.ussp.co/tools/cycle-time-calculator    → Cycle Time Calculator
tools.ussp.co/tools/ai-business-case         → AI Business Case Generator
tools.ussp.co/tools/devex-survey             → DevEx Survey Template
tools.ussp.co/tools/ai-compliance-checklist  → Government AI Compliance Checklist
```

### 4.2 Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Public route group** (`/tools/*`) | Separate from authenticated `/engagements/*`. Clean URL structure for SEO. |
| **No auth required** | Zero friction = maximum usage. No email gates, no signup walls. |
| **Client-side only** | All calculations run in the browser. No API calls, no DB writes. No server cost per user. |
| **Shared CTA component** | Every tool uses the same `CTABanner` component — consistent funnel, easy A/B testing. |
| **Public layout** | Tools use `PublicToolLayout` (no AdminSidebar). Clean, fast, SEO-optimized. |
| **Indexable** | `/tools/*` routes override `noindex` with `index, follow`. Rest of site stays private. |
| **Reuse existing components** | RadarChart, LikertScale, BeforeAfterCard are already built and have zero auth dependencies. |
| **No database** | Free tools store nothing server-side. Results live in component state only. Privacy-friendly. |

### 4.3 SEO Architecture

Each tool page includes:
- `<title>` and `<meta name="description">` targeting the primary keyword
- `<h1>` matching the target keyword exactly
- JSON-LD `SoftwareApplication` structured data
- Canonical URL
- Open Graph + Twitter Card meta tags
- Internal links to related tools (cross-linking network)
- `sitemap.xml` inclusion (tools-specific sitemap)

The `/tools/` directory page serves as a hub — linking to all tools with category groupings and keyword-rich descriptions.

---

## 5. Tool Specifications

### 5.1 DORA Metrics Calculator

**Target keywords:** "dora metrics calculator", "dora metrics benchmark", "dora performance levels"
**Est. volume:** 1,200/mo | **KD:** ~8

**Inputs:**
| Field | Type | Validation |
|-------|------|------------|
| Deployment Frequency | Select | Multiple times/day, Daily, Weekly, Monthly, Yearly |
| Lead Time for Changes | Number + Unit | Minutes/Hours/Days/Weeks/Months |
| Change Failure Rate | Number | 0-100% |
| Mean Time to Recovery | Number + Unit | Minutes/Hours/Days |

**Output:**
- Overall DORA tier: **Elite**, **High**, **Medium**, or **Low**
- Per-metric tier classification with color coding
- Benchmark comparison table (your value vs Elite/High/Medium/Low thresholds)
- Radar chart visualization (reuse existing `RadarChart` component)

**DORA Classification Thresholds (from Accelerate):**

| Metric | Elite | High | Medium | Low |
|--------|-------|------|--------|-----|
| Deploy Freq | Multiple/day | Daily-Weekly | Weekly-Monthly | Monthly+ |
| Lead Time | <1 hour | 1 day-1 week | 1 week-1 month | 1-6 months |
| CFR | 0-15% | 16-30% | 31-45% | 46-100% |
| MTTR | <1 hour | <1 day | <1 week | 1 week+ |

**CTA:** "You're a [tier] performer. AI training can move you up. See how teams improve 20-45% with measured AI transformation. → Learn about AI Transformation Monitor"

**Reusable components:** RadarChart, MetricCard, GuideBanner

---

### 5.2 Sprint Velocity Calculator

**Target keywords:** "sprint velocity calculator", "agile velocity calculator", "scrum velocity"
**Est. volume:** 2,400/mo | **KD:** ~6

**Inputs:**
- Sprint data rows (add/remove): Sprint name + Story points completed + Story points committed
- Minimum 3 sprints, maximum 20

**Output:**
- Average velocity (mean of completed points)
- Velocity trend (improving, stable, declining — based on linear regression direction)
- Sprint predictability (% of committed delivered, averaged)
- Velocity range (min-max) and standard deviation
- Bar chart showing committed vs completed per sprint
- Predictability badge: Stable (>85%), Variable (70-85%), Unpredictable (<70%)

**CTA:** "Velocity is just one metric. Measure 50+ dimensions — DORA, SPACE, DevEx — before and after AI training. → Try the AI Transformation Monitor"

---

### 5.3 AI Readiness Assessment (Public Quiz)

**Target keywords:** "ai readiness assessment", "ai readiness quiz", "is my organization ready for ai"
**Est. volume:** 3,600/mo | **KD:** ~12

**Inputs:**
7 questions (one per DORA AI Capability), each on a 1-5 Likert scale:

| # | Capability | Question |
|---|-----------|----------|
| 1 | AI-Accessible Data | "Our internal data (docs, code, tickets) is well-organized and accessible to AI tools" |
| 2 | Clear AI Stance | "Our organization has a clear, communicated position on AI adoption" |
| 3 | Healthy Data Ecosystems | "Our data is clean, well-documented, and regularly maintained" |
| 4 | Platform Engineering | "We have standardized, self-service developer platforms and CI/CD pipelines" |
| 5 | User-Centric Focus | "Our teams prioritize user needs and iterate based on feedback" |
| 6 | Version Control Maturity | "All code, config, and infrastructure is version-controlled with good branching practices" |
| 7 | Working in Small Batches | "Our teams deliver work in small, frequent increments rather than large releases" |

**Output:**
- Overall readiness tier: **Not Ready** (<2.0), **Foundation Needed** (2.0-2.9), **Ready** (3.0-3.9), **Well Positioned** (4.0-5.0)
- Per-capability score with color bar
- Top 2 strengths and top 2 gaps identified
- Personalized recommendation paragraph based on tier
- Radar chart of all 7 capabilities

**CTA:** "This is a quick self-assessment. For a detailed, data-driven readiness evaluation with actionable training plans, talk to our AI transformation consultants. → Book a Call"

**Reusable components:** LikertScale (existing), RadarChart (existing), GuideBanner

---

### 5.4 AI ROI Calculator

**Target keywords:** "ai roi calculator", "ai training roi", "return on investment ai"
**Est. volume:** 1,800/mo | **KD:** ~10

**Inputs:**
| Field | Type | Default |
|-------|------|---------|
| Team size | Number | 8 |
| Average annual salary per person | Currency | $120,000 |
| Expected productivity improvement | Slider | 25% (range: 10-55%) |
| AI tool cost per person/month | Currency | $40 |
| Training cost (one-time, total) | Currency | $15,000 |

**Output:**
- Annual productivity gain (in $ equivalent): `team_size × salary × improvement%`
- Annual AI tool cost: `team_size × tool_cost × 12`
- Net annual benefit: `gain - tool_cost - training_cost`
- ROI percentage: `(net_benefit / (tool_cost + training_cost)) × 100`
- Payback period (months): `total_investment / (monthly_gain - monthly_tool_cost)`
- Benchmark context: "Research shows 20-55% improvement (McKinsey, GitHub, Harvard/BCG)"

**CTA:** "Estimates are good. Measured data is better. Track real before-and-after ROI across your team with audit-ready reports. → AI Transformation Monitor"

---

### 5.5 Developer Productivity Score

**Target keywords:** "developer productivity metrics", "developer productivity score", "measure developer productivity"
**Est. volume:** 1,500/mo | **KD:** ~11

**Inputs:**
- 5 SPACE survey questions (1-5 Likert, reuse `LikertScale`)
- 3 DevEx survey questions (1-5 Likert)
- Optional: 4 DORA metric values (if known)

**Output:**
- SPACE composite score (average of 5 dimensions) with radar chart
- DevEx composite score (average of 3 dimensions)
- Combined Developer Productivity Score (weighted: SPACE 50%, DevEx 30%, DORA 20% if provided)
- Per-dimension breakdown with industry benchmarks
- Strengths and areas for improvement

**CTA:** "This score captures one point in time. Track how AI training transforms these metrics over multiple sprints. → Learn more"

**Reusable components:** LikertScale, RadarChart, MetricCard, BeforeAfterCard (for benchmark comparison)

---

### 5.6 Scrum Team Health Check

**Target keywords:** "scrum team health check", "agile team assessment", "team health check template"
**Est. volume:** 1,000/mo | **KD:** ~7

**Inputs:**
10 questions on a 1-5 scale covering:
- Sprint goal achievement, Backlog readiness, Retrospective effectiveness
- Cross-functional collaboration, Technical debt management
- Continuous improvement, Stakeholder satisfaction
- Deployment confidence, Incident response, Team morale

**Output:**
- Overall health score (percentage)
- Health tier: Thriving (>80%), Healthy (60-80%), Needs Attention (40-60%), At Risk (<40%)
- Radar chart of all 10 dimensions
- Top 3 actionable recommendations based on lowest-scoring areas

**CTA:** "A healthy team amplifies AI benefits. Measure how AI training impacts every dimension of team health. → AI Transformation Monitor"

---

### 5.7 State AI Law Checker

**Target keywords:** "state ai regulations", "ai laws by state", "ai compliance requirements"
**Est. volume:** 2,000/mo | **KD:** ~5

**Implementation:** Extract the existing `StateLawSelector` component into a public page. Already fully built — just needs a public route and SEO wrapper.

**What already exists:**
- `StateLawSelector.tsx` — state dropdown, law cards, federal laws section
- Law data catalog in `@ussp-platform/core` (AILaw type)
- Status badges (Active, Proposed, Enacted, Effective dates)
- Direct links to law text

**Additional for public page:**
- SEO meta tags and JSON-LD
- Brief intro explaining why AI compliance matters
- CTA at bottom

**CTA:** "Compliance is the baseline. Prove your AI investment delivers measurable results with audit-ready data. → Talk to our team"

**Data source note:** `StateLawSelector` imports law data from `@ussp-platform/core` as static catalog data (hardcoded arrays, not DB queries). This is the one exception to "pure client-side" — the data is bundled at build time via the import, but no runtime API calls are made.

**Build effort:** Very low — wrap existing component in public layout + SEO.

---

### 5.8 AI Training Plan Generator

**Target keywords:** "ai training plan", "ai training plan template", "ai skills training plan"
**Est. volume:** 1,400/mo | **KD:** ~9

**Inputs:**
| Field | Type |
|-------|------|
| Team composition | Multi-select roles + count (e.g., 4 Developers, 2 QA, 1 SM, 1 PO) |
| Current AI tool usage | Checkboxes: None, GitHub Copilot, Cursor, ChatGPT, Other |
| Primary language/stack | Select: Python, Java, TypeScript, C#, Go, Other |
| Training goal | Select: Productivity, Quality, Speed, All-around |

**Output:**
- Role-by-role training plan table
- For each role: recommended AI tools, training modules, estimated hours, priority
- Total training hours and suggested timeline (weeks)
- Downloadable as text/markdown (copy-to-clipboard)

**CTA:** "This is a generic plan. Get a data-driven, customized training plan based on your team's actual Jira/ADO activity analysis. → Book a consultation"

---

### 5.9 Change Failure Rate Calculator

**Target keywords:** "change failure rate", "change failure rate calculator", "cfr devops"
**Est. volume:** 900/mo | **KD:** ~4

**Inputs:**
- Total deployments in period
- Failed deployments (caused rollback, hotfix, incident, or degraded service)

**Output:**
- Change Failure Rate percentage
- DORA tier for this metric
- Industry benchmark comparison
- Recommendations based on tier

**CTA:** "AI-assisted code review can reduce failure rates. Measure the before and after. → AI Transformation Monitor"

**Build effort:** Very low — single calculation.

---

### 5.10 Cycle Time Calculator

**Target keywords:** "cycle time calculator software", "lead time for changes", "devops lead time calculator"
**Est. volume:** 800/mo | **KD:** ~6

**Inputs:**
- Table of recent changes: Start date + Deploy date (add/remove rows, min 5)

**Output:**
- Average cycle time
- Median cycle time
- 95th percentile
- DORA lead time tier classification
- Trend visualization (if enough data points)

**CTA:** "AI tools can cut cycle time by 30-50%. Track the real improvement with measured data. → Learn more"

**Build effort:** Very low.

---

### 5.11 AI Business Case Generator

**Target keywords:** "ai business case template", "ai investment business case", "ai justification template"
**Est. volume:** 600/mo | **KD:** ~8

**Inputs:**
| Field | Type |
|-------|------|
| Organization name | Text |
| Department/team | Text |
| Team size | Number |
| Current annual budget | Currency |
| Proposed AI investment | Currency |
| Expected improvement | Slider (10-55%) |
| Timeline | Select: 3/6/12 months |
| Industry | Select: Government, Healthcare, Finance, Technology, Other |

**Output:**
Formatted one-page business case with:
- Executive summary
- Problem statement (generic, customized by industry)
- Proposed solution
- Expected ROI (calculated from inputs)
- Research backing (citations from Accelerate, McKinsey, Harvard/BCG)
- Risk mitigation
- Recommended next steps

Copy-to-clipboard as formatted text. Government-specific language if "Government" selected.

**CTA:** "A business case gets approval. Measured results keep the program funded. → Audit-ready ROI tracking with AI Transformation Monitor"

---

### 5.12 DevEx Survey Template

**Target keywords:** "developer experience survey", "devex survey questions", "developer satisfaction survey"
**Est. volume:** 700/mo | **KD:** ~5

**Implementation:** Display the 8-question SPACE + DevEx survey with:
- Question text, response scale, and what each dimension measures
- "Copy all questions" button (plain text for Google Forms / Typeform)
- "Download CSV template" for spreadsheet-based collection
- Explanation of how to interpret results

**CTA:** "Surveys are step one. Combine with DORA metrics for the complete picture. → AI Transformation Monitor"

**Build effort:** Very low — static content with copy/download actions.

---

### 5.13 Government AI Compliance Checklist

**Target keywords:** "government ai compliance", "federal ai policy checklist", "ai governance checklist"
**Est. volume:** 500/mo | **KD:** ~6

**Implementation:** Interactive checklist (checkboxes, progress bar):
- AI Usage Policy (documented, communicated, enforced)
- AI Governance Board (established, meeting regularly)
- Data Classification (AI-eligible data identified)
- Risk Assessment (AI risks documented)
- Training Records (AI training tracked)
- Vendor Assessment (AI tool vendors evaluated)
- Bias/Fairness Review (AI outputs audited)
- Incident Response (AI failure procedures documented)
- Regulatory Monitoring (state/federal AI laws tracked)
- Budget Justification (ROI measurement in place)

**Output:**
- Compliance score (X/10 items complete)
- Compliance tier: Compliant, Mostly Compliant, Gaps Identified, Not Ready
- Recommendations for incomplete items
- Links to relevant state laws (cross-link to State AI Law Checker tool)

**CTA:** "Governance + measurable results = audit-proof AI program. → Talk to our team"

---

## 6. Shared Components (New)

### 6.1 PublicToolLayout

Replaces `AdminSidebar + AdminTopbar` for public pages.

```
┌──────────────────────────────────────────────────────────┐
│  ◆ USSP AI Tools    [All Tools]                   [ussp.co] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   {tool content}                                         │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [CTA Banner]                                            │
├──────────────────────────────────────────────────────────┤
│  Related Tools: [Tool A] [Tool B] [Tool C]               │
├──────────────────────────────────────────────────────────┤
│  Footer: © USSP | Privacy | Terms | ussp.co              │
└──────────────────────────────────────────────────────────┘
```

- Minimal header: logo + "All Tools" link + link back to ussp.co
- No sidebar — tools are single-column, focused layouts
- CTA banner slot (filled per-tool)
- Related tools section (cross-linking for SEO)
- Lightweight footer

### 6.2 CTABanner

Reusable call-to-action component used at the bottom of every tool.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `headline` | string | Bold headline (e.g., "Ready for the full picture?") |
| `description` | string | 1-2 sentence value prop |
| `primaryAction` | { label, href } | Main CTA button |
| `secondaryAction?` | { label, href } | Optional secondary link |

**Design:** Full-width blue (`bg-primary`) banner with white text. Primary button is white with blue text. Stands out clearly from tool content.

### 6.3 ToolCard

Used on the `/tools/` directory page to list all available tools.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Tool name |
| `description` | string | One-line description |
| `href` | string | Link to tool page |
| `category` | string | "DevOps Metrics" / "AI Assessment" / "Planning" / "Compliance" |
| `icon` | string | Category icon |

### 6.4 ResultCard

Standardized result display after calculation.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Metric name |
| `value` | string/number | Calculated result |
| `tier?` | string | Classification (Elite, High, etc.) |
| `tierColor?` | string | Badge color |
| `benchmark?` | string | Industry benchmark for context |
| `direction?` | "higher_better" / "lower_better" | Arrow direction |

---

## 7. SEO & Indexing Strategy

### 7.1 Robots.txt Update

Current state: entire site is `noindex, nofollow`.

**Change:** Allow indexing of `/tools/*` only.

```
# tools.ussp.co robots.txt
User-agent: *
Disallow: /engagements/
Disallow: /readiness/
Disallow: /methodology/
Disallow: /login/
Disallow: /api/

# Allow free tools
Allow: /tools/

Sitemap: https://tools.ussp.co/sitemap.xml
```

### 7.2 Sitemap

New `sitemap.ts` generating entries for all `/tools/*` pages with `changeFrequency: "monthly"` and `priority: 0.8`.

### 7.3 JSON-LD Per Tool

Each tool emits `SoftwareApplication` structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "DORA Metrics Calculator",
  "description": "Free online calculator to measure your DORA metrics and classify your team as Elite, High, Medium, or Low performer.",
  "url": "https://tools.ussp.co/tools/dora-calculator",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "author": {
    "@type": "Organization",
    "name": "US Software Professionals Inc.",
    "url": "https://www.ussp.co"
  }
}
```

### 7.4 llms.txt Sync

Update the **main site's** `public/llms.txt` and `public/llms-full.txt` to reference the free tools (per content sync checklist — new service offering requires llms.txt update). Add a section like:

```
## Free AI & DevOps Tools (tools.ussp.co/tools/)
USSP offers 13 free online tools for engineering teams:
- DORA Metrics Calculator — classify your team as Elite/High/Medium/Low
- Sprint Velocity Calculator — track velocity trends and predictability
- AI Readiness Assessment — 7-question quiz based on DORA AI Capabilities
[... etc for all 13 tools ...]
```

### 7.5 Accessibility

All public tool pages must meet WCAG 2.1 AA:
- Semantic HTML (`<main>`, `<section>`, `<form>`, `<label>`)
- Keyboard navigable (tab order, focus indicators, enter to submit)
- Sufficient color contrast (tier badges, result colors — 4.5:1 minimum)
- Screen reader support (ARIA labels on interactive elements, result announcements)
- Responsive design — all tools must work on mobile (Google ranks mobile-first)

### 7.6 Mobile Responsiveness

Free tool pages receive mobile search traffic. All layouts must be responsive:
- Input forms: single-column on mobile, multi-column on desktop
- Result cards: stack vertically on mobile
- RadarChart: scale to container width (already responsive via `size` prop)
- CTABanner: full-width with stacked buttons on mobile
- Touch targets: minimum 44x44px for buttons and interactive elements

---

## 8. File Structure

### New Files

```
packages/ai-tools/src/
├── app/
│   └── tools/                                    # PUBLIC ROUTE GROUP (no auth)
│       ├── layout.tsx                            # PublicToolLayout (no sidebar, SEO-optimized)
│       ├── page.tsx                              # Tools directory — lists all free tools
│       ├── dora-calculator/page.tsx              # DORA Metrics Calculator
│       ├── velocity-calculator/page.tsx          # Sprint Velocity Calculator
│       ├── ai-readiness-quiz/page.tsx            # AI Readiness Assessment (public)
│       ├── ai-roi-calculator/page.tsx            # AI ROI Calculator
│       ├── dev-productivity-score/page.tsx       # Developer Productivity Score
│       ├── team-health-check/page.tsx            # Scrum Team Health Check
│       ├── state-ai-laws/page.tsx                # State AI Law Checker
│       ├── training-plan-generator/page.tsx      # AI Training Plan Generator
│       ├── change-failure-rate/page.tsx          # Change Failure Rate Calculator
│       ├── cycle-time-calculator/page.tsx        # Cycle Time Calculator
│       ├── ai-business-case/page.tsx             # AI Business Case Generator
│       ├── devex-survey/page.tsx                 # DevEx Survey Template
│       └── ai-compliance-checklist/page.tsx      # Government AI Compliance Checklist
├── components/
│   ├── PublicToolLayout.tsx                       # NEW — public page layout
│   ├── CTABanner.tsx                             # NEW — call-to-action banner
│   ├── ToolCard.tsx                              # NEW — tool listing card
│   ├── ResultCard.tsx                            # NEW — standardized result display
│   ├── RadarChart.tsx                            # EXISTING — reuse
│   ├── LikertScale.tsx                           # EXISTING — reuse
│   ├── BeforeAfterCard.tsx                       # EXISTING — reuse
│   ├── MetricCard.tsx                            # EXISTING — reuse
│   ├── GuideBanner.tsx                           # EXISTING — reuse
│   ├── ImprovementBadge.tsx                      # EXISTING — reuse
│   └── StateLawSelector.tsx                      # EXISTING — reuse
```

### New Infrastructure Files

| File | Purpose |
|------|---------|
| `packages/ai-tools/src/app/sitemap.ts` | Dynamic sitemap including all `/tools/*` pages |
| `packages/ai-tools/public/robots.txt` | Allow `/tools/`, disallow authenticated routes |

### Modified Files

| File | Change |
|------|--------|
| `packages/ai-tools/src/app/layout.tsx` | Remove global `robots: "noindex, nofollow"` — move to per-route metadata so `/tools/*` can set `index, follow` while authenticated pages keep `noindex` |
| `public/llms.txt` | Add section about USSP free AI/DevOps tools at tools.ussp.co/tools/ |
| `public/llms-full.txt` | Add detailed descriptions of each free tool |

---

## 9. Implementation Plan

### 9.1 Strategy: Build the Template, Then Scale Fast

The key insight from Bhanu's approach: **the first tool takes the longest because you're building the infrastructure.** Every tool after that is fast because you copy the pattern. With AI-assisted coding, once the template exists, a new tool can be built in under 30 minutes.

**Our approach:**
1. **Phase 1** builds the foundation — public layout, shared components, SEO infrastructure, and 3 tools that establish the template
2. **Phases 2-4** scale rapidly — each tool reuses the template and existing components
3. **After Phase 4** — new tools can be added in <1 hour each as new keyword opportunities emerge

### 9.2 Phase 1: Foundation (Week 1-2)

**Goal:** Infrastructure + template + first 3 tools live. Google starts indexing.

| Task | Effort | Why First |
|------|--------|-----------|
| Create `PublicToolLayout` component | 2 hours | Every tool needs this |
| Create `CTABanner`, `ToolCard`, `ResultCard` | 2 hours | Shared across all tools |
| Create `/tools/` directory page | 1 hour | Hub page for SEO internal linking |
| Create `robots.txt` and `sitemap.ts` | 30 min | Google can't find us without these |
| Move `noindex` from global layout to per-route | 30 min | Unblock indexing for `/tools/*` |
| **Build DORA Metrics Calculator** | 3 hours | **Establishes the template** — input form, calculation, result display, CTA. Every future tool follows this pattern. |
| Build Change Failure Rate Calculator | 1 hour | Simplest tool — validates the template works |
| Build Cycle Time Calculator | 1 hour | Second validation — proves the template scales |
| **Phase 1 total** | **~10 hours** | |

**Phase 1 exit criteria:**
- [ ] 3 tools live at `tools.ussp.co/tools/*`
- [ ] Accessible without login
- [ ] Google Search Console shows pages submitted for indexing
- [ ] PostHog tracking events firing

### 9.3 Phase 2: Core Tools (Week 3-4)

**Goal:** Add the 4 highest-impact tools. These target the highest-volume keywords and reuse the most existing code.

| Task | Effort | Why This Phase |
|------|--------|---------------|
| Sprint Velocity Calculator | 3 hours | 2,400/mo volume — highest traffic potential |
| AI Readiness Quiz | 3 hours | 3,600/mo volume — directly maps to our paid readiness module |
| AI ROI Calculator | 2 hours | 1,800/mo volume — speaks directly to budget decision-makers |
| State AI Law Checker | 1 hour | Extract existing `StateLawSelector` — nearly zero new code |
| **Phase 2 total** | **~9 hours** | |

**Phase 2 exit criteria:**
- [ ] 7 tools live
- [ ] First LinkedIn post sharing the tools (drive early traffic while SEO ramps)
- [ ] Cross-linking between all tools implemented

### 9.4 Phase 3: Expansion (Week 5-6)

**Goal:** Fill out the survey/assessment category. These tools collect qualitative data that complements the quantitative calculators.

| Task | Effort | Why This Phase |
|------|--------|---------------|
| Developer Productivity Score | 3 hours | Combines SPACE + DevEx + DORA — our differentiator |
| Scrum Team Health Check | 3 hours | Broader audience — attracts agile coaches beyond DevOps |
| AI Training Plan Generator | 3 hours | Directly funnels to consulting engagements |
| **Phase 3 total** | **~9 hours** | |

**Phase 3 exit criteria:**
- [ ] 10 tools live
- [ ] Google Search Console showing impressions for target keywords
- [ ] Second LinkedIn post with early usage stats

### 9.5 Phase 4: High-Intent (Week 7-8)

**Goal:** Add tools that target buyers, not just practitioners. These have lower volume but higher conversion intent — people building business cases and compliance checklists are closer to purchasing.

| Task | Effort | Why This Phase |
|------|--------|---------------|
| AI Business Case Generator | 4 hours | Targets procurement/leadership — the people who sign contracts |
| DevEx Survey Template | 1 hour | Low-effort — static content with copy/download |
| Government AI Compliance Checklist | 2 hours | Government-specific — differentiates us from generic tools |
| **Phase 4 total** | **~7 hours** | |

**Phase 4 exit criteria:**
- [ ] All 13 tools live
- [ ] Update main site `llms.txt` and `llms-full.txt`
- [ ] All verification checklist items passing
- [ ] Monthly review cadence established

### 9.6 Ongoing (Post-Launch)

| Activity | Frequency | Purpose |
|----------|-----------|---------|
| Check Google Search Console | Weekly | Track indexing and impression growth |
| Review PostHog tool usage | Weekly | Identify popular tools and CTA performance |
| Check Ahrefs keyword rankings | Monthly | Track ranking progress for target keywords |
| Build new tools from keyword opportunities | As found | Compound traffic growth — each tool = new entry point |
| A/B test CTAs | Quarterly | Optimize conversion from visitor to lead |
| Share tools on LinkedIn | Bi-weekly | Supplement organic with social while SEO ramps |

**Total estimated effort: ~35 hours across 8 weeks. Ongoing: ~2 hours/week.**

---

## 10. Conversion Funnel & Metrics

### 10.1 Funnel

```
[Google Search] → [Free Tool Page] → [Use Tool] → [See CTA] → [Click CTA] → [Contact/Demo]
                        ↓                                            ↓
                   (SEO impression)                           (Conversion event)
```

### 10.2 Tracking

| Event | How to Track |
|-------|-------------|
| Page views | PostHog page_view (already integrated) |
| Tool usage | PostHog custom event: `tool_used` with `{ tool_name }` |
| CTA impressions | PostHog custom event: `cta_viewed` with `{ tool_name }` |
| CTA clicks | PostHog custom event: `cta_clicked` with `{ tool_name, destination }` |
| Google impressions/clicks | Google Search Console (add tools.ussp.co) |
| Keyword rankings | Ahrefs rank tracker |

### 10.3 Success Targets (6 months post-launch)

| Metric | Target |
|--------|--------|
| Tools live | 13 |
| Monthly organic page views | 5,000+ |
| Monthly tool usages | 2,000+ |
| Monthly CTA clicks | 100+ |
| Monthly leads (contact/demo requests) | 10+ |
| Google keywords ranking page 1 | 20+ |
| Cost | $0 (organic only) |

---

## 11. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low initial traffic | High | Medium | Expected — SEO takes 3-6 months. Supplement with 2-3 LinkedIn posts sharing tools. |
| Competitors outrank us | Medium | Medium | Target KD <10 keywords. Quality of tool + USSP domain authority should suffice. |
| Tools cannibalize paid engagement | Low | Low | Free tools are simplified snapshots. Full engagement provides ongoing, team-wide, integration-backed measurement. |
| Maintenance burden | Low | Low | Tools are client-side only, no DB, no API. Maintenance is near-zero. |
| SEO changes devalue tools | Low | Medium | Diversify across 13+ keywords. No single tool is a single point of failure. |

---

## 12. Future Enhancements

### 12.1 Planned (post-launch, data-driven)
- **Email capture (optional):** "Get your results emailed" — builds a nurture list without gating the tool
- **Comparison mode:** "Compare your team against industry averages" with more detailed benchmarks
- **Shareable results:** Unique URL for results (e.g., `/tools/dora-calculator?df=5&lt=120&cfr=12&mttr=30`) — enables sharing and backlinks
- **Blog posts per tool:** "How to Measure DORA Metrics: A Complete Guide" + embedded calculator — doubles the keyword surface

### 12.2 Considered
- **PDF export of results** — adds perceived value, especially for business case generator
- **Multi-language support** — Spanish/French for government diversity requirements
- **API access** — expose calculators as API endpoints for developers to embed
- **Community benchmarks** — anonymous aggregated data showing "you vs. all users" (requires opt-in data collection)

---

## 13. Verification Checklist

### Pre-Launch
- [ ] `PublicToolLayout` renders without auth — visit `/tools/` while logged out
- [ ] All 13 tool pages load without redirect to `/login`
- [ ] `robots.txt` allows `/tools/*`, disallows `/engagements/*` and `/api/*`
- [ ] `sitemap.xml` includes all `/tools/*` pages with correct URLs
- [ ] Each tool has unique `<title>`, `<meta description>`, JSON-LD
- [ ] Each tool's `<h1>` matches target keyword
- [ ] CTABanner appears at bottom of every tool with correct links
- [ ] Related tools section cross-links to 3 relevant tools
- [ ] No authenticated routes are exposed — `/engagements/*` still requires login
- [ ] PostHog tracking fires for `tool_used` and `cta_clicked` events
- [ ] Google Search Console configured for `tools.ussp.co`
- [ ] All calculations produce correct results (manual verification)

### Post-Launch (monthly)
- [ ] Check Google Search Console for indexing status of all tool pages
- [ ] Review PostHog for tool usage and CTA click-through rates
- [ ] Check Ahrefs for keyword ranking positions
- [ ] Identify lowest-performing tools — improve or replace
- [ ] Identify new keyword opportunities — build new tools

---

## 14. References

1. Bhanu / SiteGPT — "How I Grew My App to $13K/month" (Starter Story, 2026). Engineering as Marketing strategy achieving 50K monthly visitors with $0 ad spend.
2. Forsgren, N., Humble, J., Kim, G. (2018). *Accelerate: The Science of Lean Software and DevOps.* — DORA metric thresholds used in calculators.
3. Forsgren, N., et al. (2021). "The SPACE of Developer Productivity." *ACM Queue.* — Survey framework for DevEx tools.
4. Noda, A., et al. (2023). "DevEx: What Actually Drives Productivity." *ACM Queue.* — DevEx dimensions.
5. Google DORA Team (2025). *DORA AI Capabilities Model.* — 7 capabilities used in readiness quiz.
6. Peng, S., et al. (2023). "The Impact of AI on Developer Productivity." — 55.8% improvement benchmark.
7. McKinsey (2023). "Unleashing Developer Productivity with Generative AI." — 20-45% improvement range.
