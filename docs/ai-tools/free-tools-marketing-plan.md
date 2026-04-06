# Free Tools Marketing Plan — AI Transformation Tool (tools.ussp.co)

> Strategy: Engineering as Marketing ([playbook reference](../strategy-engineering-as-marketing.md))
> Goal: Drive organic traffic from Google to tools.ussp.co, convert visitors into engagement leads

---

## Target Audience

| Segment | Who They Are | What They Search For |
|---------|-------------|---------------------|
| **Gov IT Leaders** | State/federal CIOs, IT directors | "AI readiness assessment", "government AI compliance" |
| **Engineering Managers** | Team leads evaluating AI adoption | "developer productivity metrics", "DORA metrics calculator" |
| **Scrum Masters / Agile Coaches** | Measuring team performance | "sprint velocity calculator", "scrum metrics" |
| **Consultants** | Firms pitching AI transformation | "AI ROI calculator", "AI training impact" |
| **HR / Procurement** | Justifying AI training budgets | "AI training ROI", "technology training business case" |

---

## Free Tools to Build (Prioritized)

### Tier 1 — High Volume, Low KD, Highly Relevant

These are the first tools to build. Each directly attracts potential customers of the AI Transformation Monitor.

#### 1. DORA Metrics Calculator
- **Target keyword:** "dora metrics calculator", "dora metrics benchmark"
- **What it does:** User inputs deploy frequency, lead time, change failure rate, MTTR — tool instantly classifies them as Elite/High/Medium/Low performer per DORA benchmarks
- **CTA:** "Know your DORA tier — now track how AI training moves you up. Try the AI Transformation Monitor."
- **Build effort:** Low (static calculation, no backend needed)

#### 2. Sprint Velocity Calculator
- **Target keyword:** "sprint velocity calculator", "agile velocity calculator"
- **What it does:** Input story points completed across sprints, get average velocity, trend line, predictability score
- **CTA:** "Velocity is just the start. Measure 50+ metrics before and after AI training."
- **Build effort:** Low

#### 3. AI Readiness Assessment (Public Version)
- **Target keyword:** "ai readiness assessment", "ai readiness quiz", "is my team ready for ai"
- **What it does:** 10-question quiz based on the 7 DORA AI Capabilities. Outputs a readiness tier (Exploring → Adopting → Scaling → Transforming) with actionable recommendations
- **CTA:** "Get a detailed readiness breakdown with a full engagement. Talk to our team."
- **Build effort:** Low (simplified version of existing readiness module)

#### 4. AI ROI Calculator
- **Target keyword:** "ai roi calculator", "ai training roi", "calculate ai return on investment"
- **What it does:** Input team size, avg salary, current velocity, expected improvement % — outputs projected annual savings, payback period, cost-per-developer ROI
- **CTA:** "Estimates are good. Measured data is better. Track real ROI with the AI Transformation Monitor."
- **Build effort:** Low

#### 5. Developer Productivity Score
- **Target keyword:** "developer productivity metrics", "developer productivity score", "measure developer productivity"
- **What it does:** Input SPACE-style survey answers (5 questions) + basic DORA numbers → get a composite developer productivity score with benchmarks
- **CTA:** "This is a snapshot. Get continuous before/after measurement across your entire team."
- **Build effort:** Low-Medium

---

### Tier 2 — Medium Volume, Strong Relevance

#### 6. Scrum Team Health Check
- **Target keyword:** "scrum team health check", "agile team assessment"
- **What it does:** Quick survey (10 questions) covering velocity, bug escape rate, predictability, satisfaction → radar chart output
- **CTA:** "Track how AI training transforms your team health over time."
- **Build effort:** Low

#### 7. State AI Law Checker
- **Target keyword:** "state ai regulations", "ai laws by state", "ai compliance checker"
- **What it does:** Select your state → see applicable AI regulations, compliance requirements, and governance recommendations (already have this data in the readiness module)
- **CTA:** "Compliance is table stakes. Prove your AI investment delivers ROI."
- **Build effort:** Very Low (extract existing StateLawSelector into standalone tool)

#### 8. AI Training Plan Generator
- **Target keyword:** "ai training plan", "ai training plan template", "ai training for developers"
- **What it does:** Select team roles (developer, QA, scrum master, etc.) and current tool usage → generates a role-specific AI training roadmap
- **CTA:** "Now measure whether the training actually worked. Try the AI Transformation Monitor."
- **Build effort:** Low (simplified version of existing training plan feature)

#### 9. Change Failure Rate Calculator
- **Target keyword:** "change failure rate calculator", "change failure rate benchmark"
- **What it does:** Input total deployments and failed deployments over a period → get CFR %, DORA tier, and industry benchmark comparison
- **CTA:** "AI-assisted code review can cut your failure rate. Measure the impact."
- **Build effort:** Very Low

#### 10. Cycle Time Calculator
- **Target keyword:** "cycle time calculator software", "lead time for changes calculator"
- **What it does:** Input start dates and deploy dates for recent changes → get average cycle time, percentiles, and DORA classification
- **CTA:** "Track cycle time improvement before and after AI adoption."
- **Build effort:** Very Low

---

### Tier 3 — Niche, High Intent

#### 11. AI Business Case Generator
- **Target keyword:** "ai business case template", "ai investment justification"
- **What it does:** Input org details, team size, budget → generates a formatted one-page business case document (PDF) for AI training investment
- **CTA:** "Built the case? Now prove the results. The AI Transformation Monitor provides audit-ready data."
- **Build effort:** Medium

#### 12. DevEx Survey Template
- **Target keyword:** "developer experience survey", "devex survey questions"
- **What it does:** Pre-built survey based on the SPACE + DevEx frameworks (8 questions). User can copy/export to Google Forms or download CSV
- **CTA:** "Surveys alone don't tell the full story. Combine with DORA metrics in the AI Transformation Monitor."
- **Build effort:** Very Low

#### 13. Government AI Compliance Checklist
- **Target keyword:** "government ai policy template", "federal ai compliance checklist"
- **What it does:** Interactive checklist of AI governance requirements (policy coverage, regulatory awareness, data ecosystem health) with downloadable PDF
- **CTA:** "Compliance + performance measurement in one platform."
- **Build effort:** Low

---

## Implementation Plan

### Phase 1 (Week 1-2): Foundation
- [ ] Set up `/tools/` route in ai-tools app for free public tools (no auth required)
- [ ] Create shared tool page template (input form → result display → CTA banner)
- [ ] Build Tool #1 (DORA Metrics Calculator) as the template
- [ ] Build Tool #9 (Change Failure Rate) and #10 (Cycle Time) — very quick wins reusing the template

### Phase 2 (Week 3-4): Core Tools
- [ ] Build Tool #2 (Sprint Velocity Calculator)
- [ ] Build Tool #3 (AI Readiness Assessment — public version)
- [ ] Build Tool #4 (AI ROI Calculator)
- [ ] Build Tool #7 (State AI Law Checker — extract from existing)

### Phase 3 (Week 5-6): Expansion
- [ ] Build Tool #5 (Developer Productivity Score)
- [ ] Build Tool #6 (Scrum Team Health Check)
- [ ] Build Tool #8 (AI Training Plan Generator)

### Phase 4 (Week 7-8): High-Intent Tools
- [ ] Build Tool #11 (AI Business Case Generator)
- [ ] Build Tool #12 (DevEx Survey Template)
- [ ] Build Tool #13 (Government AI Compliance Checklist)

### Ongoing
- [ ] Monitor Ahrefs for new keyword opportunities monthly
- [ ] A/B test CTAs to optimize conversion to engagement leads
- [ ] Add tools.ussp.co/tools to sitemap, llms.txt
- [ ] Track: impressions → clicks → tool usage → CTA clicks → leads

---

## SEO Setup Per Tool

Each free tool page needs:

```
✅ Unique meta title: "[Tool Name] — Free Online Calculator | USSP"
✅ Meta description with target keyword + "free" + benefit
✅ H1 matching the target keyword exactly
✅ JSON-LD (SoftwareApplication or WebApplication type)
✅ Internal link to main product (tools.ussp.co)
✅ Internal links between related free tools
✅ Canonical URL
✅ Open Graph image (auto-generated or templated)
```

---

## CTA Pattern

Every tool follows this funnel:

```
[User searches keyword on Google]
        ↓
[Lands on free tool — gets instant value, no login required]
        ↓
[Sees result + CTA banner at bottom]
        ↓
[CTA: "Want to measure this across your whole team over time? →"]
        ↓
[Links to tools.ussp.co or a contact/demo form]
```

**Key rule:** The free tool must deliver real value with zero friction (no signup, no email gate). The CTA sells the *upgrade* — ongoing measurement, team-wide tracking, audit-ready reports.

---

## Keyword Validation Checklist

Before building each tool, validate on Ahrefs:

- [ ] Monthly search volume ≥ 500 (ideal: 1,000+)
- [ ] Keyword difficulty ≤ 15 (ideal: <10)
- [ ] Current SERP has no dominant tool (or existing tools are poor quality)
- [ ] Keyword intent is "tool/calculator" not "definition/article"
- [ ] Searcher could plausibly be a potential customer

---

## Success Metrics

| Metric | Target (6 months) |
|--------|--------------------|
| Free tools live | 10+ |
| Monthly organic visitors to /tools/ | 5,000+ |
| Monthly leads from CTAs | 30+ |
| Engagement demos booked | 5+/month |
| Cost | $0 (organic only) |
