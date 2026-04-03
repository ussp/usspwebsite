# DCFS Illinois Connect — AI-Augmented Agile Delivery Plan

> **Status:** DRAFT v2 — Due April 17, 2026
> **Owner:** Vinay Lagisetty (Karsan, AI Transformation Leader) + Romi (Karsan, Engagement Director)
> **Audience:** Jim Doherty (CIO, DCFS/DeWitt), Dinkar (Karsan Executive Sponsor)
> **Methodology:** GQM (Basili 1994), DORA/Accelerate (Forsgren 2018), SPACE (Microsoft Research 2021), QUS (Lucassen 2016), Six Sigma DMAIC

---

## 1. Executive Summary

Karsan proposes a structured AI augmentation pilot across select ILC product teams to measurably improve delivery productivity and quality. AI tools already available to the State — **GitHub Copilot** and **Atlassian Rovo** — will be applied to Business Analyst, Tester, and Developer workflows with structured training, clear guardrails, and research-backed measurement.

**Target:** 5%+ improvement in team velocity and delivery quality over one Program Increment (PI), measured against a quantitative baseline.

**Approach:** Govern → Baseline → Train → Pilot → Measure → Playbook → Scale

**Philosophy:** AI amplifies the existing team — same people, better tools, more output. No workforce reduction. No autonomous code generation.

---

## 2. Context

### The Engagement
- **Project:** Illinois Connect (ILC) — legacy child welfare system modernization to Microsoft Dynamics 365
- **Scale:** 12 SAFe product teams, 160+ Karsan consultants, part of a single ART
- **Domain:** Department of Child and Family Services — at-risk children intake through safe placement
- **Tech stack:** Dynamics 365, Visual Studio, JIRA, Confluence, GitHub

### The Ask
CIO Jim Doherty has asked Karsan to develop and execute an AI rollout plan to improve productivity across the ILC product teams. The target is a measurable 5% improvement, with the possibility of exceeding that.

### Current State
- Teams are delivering satisfactorily — client is happy with current commitments
- No AI augmentation in place (greenfield opportunity)
- Environment deployment issues recently resolved (no longer a blocker)
- Baseline velocity data exists per team in JIRA
- Informal Copilot testing by John (Agile Delivery Manager) showed mixed results:
  - AI amplifies quality — good input produces better output; bad input produces worse output
  - Rovo outperforms Copilot for story writing (Confluence gives it project context)
  - Pure AI-generated content without human guidance is poor quality
  - BA skill is the critical factor in AI tool effectiveness

---

## 3. Governance & Compliance

### 3.1 State of Illinois DoIT AI Policy (Effective April 1, 2025)

All AI use by State agencies must comply with the DoIT "Policy on the Acceptable and Responsible Use of Artificial Intelligence." Key requirements for our pilot:

| Requirement | DoIT Section | How We Comply |
|-------------|-------------|---------------|
| Human in the loop for all AI decisions | 4d, 6 | AI suggests, human decides — mandatory review before accepting any AI output |
| No access to protected data without Agency Head authorization | 4f | No DCFS case data in AI prompts; Copilot/Rovo process code and JIRA stories only |
| No discrimination or bias | 4a, 11 | Bias awareness training; per-sprint review of AI-generated content |
| Transparency — disclose AI use to users | 5a-c | Written disclosure to all pilot participants; AI-assisted deliverables labeled |
| AI System Assessment Report with Agency Head signoff | 5f | **NEEDS CLARIFICATION:** Are Copilot/Rovo already assessed? If not, report needed 30 days before launch |
| State data use requires Agency Head written consent | 5e | **NEEDS CLARIFICATION:** Does Copilot accessing ILC code = "State data for AI purposes"? |
| Continuous monitoring and documentation | 7 | tools.ussp.co provides continuous measurement, documented baselines, audit trail |
| Security reporting process | 12 | AI security awareness in training; reporting channel established |
| Bias mitigation — regular reviews, corrective action | 11 | Per-sprint bias spot checks; documented review process |

> **Critical path:** If DoIT assessment and 30-day notice have NOT been filed, earliest legal pilot start is 30 days after filing. This must be confirmed with Jim by April 8.

### 3.2 DCFS-Specific Constraints

| Constraint | Source | Impact |
|-----------|--------|--------|
| No autonomous code generation | Jim (CIO) + Romi | Copilot for suggestions only; developers implement all code |
| No AI-generated production code commits | Rollout Plan Doc | Same as above — AI assists, human authors |
| No sensitive DCFS data in prompts | DoIT Policy 4f | Training required; child welfare data is highly sensitive |
| Only state-approved AI tools | Jim | Start with Copilot + Rovo; any additional tools require state approval process |
| CMS precedent — tools can be pulled | Dinkar | October 2025: Federal pulled AI tools from CMS/Medicare mid-sprint. We must stay well within boundaries |

---

## 4. Approach: Govern → Baseline → Train → Pilot → Measure → Playbook → Scale

### Phase 0: Governance & Access (Apr 7–17)

| # | Task | Owner | Due | Status |
|---|------|-------|-----|--------|
| 1 | Confirm DoIT assessment status for Copilot/Rovo | Romi (ask Jim Apr 8) | Apr 8 | TODO |
| 2 | Get Vinay access clearance from Jim | Romi | Apr 8 | TODO |
| 3 | Obtain DoIT AI Policy compliance status from Jim | Robert | Apr 10 | TODO |
| 4 | Create Karsan email/network access for Vinay | Dinkar's team | Apr 10 | TODO |
| 5 | JIRA/Confluence walkthrough with Matt | Vinay + Matt | Apr 10 | TODO |
| 6 | Architecture/dev process walkthrough with architect | Vinay + Darren | Apr 12 | TODO |
| 7 | Understand JIRA workflow states for metric computation | Vinay + Matt | Apr 12 | TODO |
| 8 | Confirm Copilot deployment status and timeline | Romi + Jim | Apr 8 | TODO |
| 9 | Review and finalize this rollout plan | All | **Apr 17** | IN PROGRESS |

### Phase 1: Discovery & Baseline (Apr 17–30)

| # | Task | Owner | Due |
|---|------|-------|-----|
| 10 | Executive discovery interview with Jim (metrics + governance) | Vinay + Romi | Before Springfield trip |
| 11 | Run Jira Quality Scanner to auto-compute baseline metrics | Vinay + Matt | Apr 21 |
| 12 | Collect baseline velocity data — last 3 sprints, all 12 teams | Vinay + Matt | Apr 23 |
| 13 | Distribute baseline SPACE/DevEx survey to pilot team members | Vinay | Apr 25 |
| 14 | Select pilot teams and participants | Romi + John + Chase | Apr 25 |
| 15 | Finalize metrics set based on Jim's priorities | Vinay | Apr 28 |
| 16 | Produce baseline metrics report | Vinay | Apr 30 |

### Phase 2: Training (Late April / Early May)

| # | Task | Owner | Due |
|---|------|-------|-----|
| 17 | Develop role-specific training materials | Vinay | End of Apr |
| 18 | Conduct training: BA track — story quality, AC generation, Rovo usage | Vinay | Week before PI Planning |
| 19 | Conduct training: Tester track — test generation from AC, Rovo/Copilot | Vinay | Week before PI Planning |
| 20 | Conduct training: Developer track — code explanation, docs, refactoring | Vinay | Week before PI Planning |
| 21 | Training module: DoIT AI Policy compliance, responsible use, bias awareness | Vinay + Robert | Week before PI Planning |
| 22 | Springfield trip — present plan to Jim | Romi + Vinay | Before May 5 |

### Phase 3: Pilot Execution (May 5 – July, 1 full PI)

| # | Task | Owner | Cadence |
|---|------|-------|---------|
| 23 | PI Planning — introduce AI pilot to ART | Romi + Vinay | May 5–7 |
| 24 | AI-augmented teams operate with trained tools and practices | Pilot teams | Daily |
| 25 | Non-AI teams continue as-is (control group) | Control teams | Daily |
| 26 | Weekly check-ins: what's working, what's not, adjustments | Vinay + Romi | Weekly |
| 27 | Continuous metrics collection via JIRA + tools.ussp.co | Vinay | Ongoing |
| 28 | Per-sprint bias and quality spot checks | Pilot team leads | Per sprint |
| 29 | Document adoption challenges and best practices | All | Ongoing |

### Phase 4: Results & Playbooks (End of Pilot PI)

| # | Task | Owner | Due |
|---|------|-------|-----|
| 30 | Compile measurement results: AI teams vs baseline vs control | Vinay | End of PI |
| 31 | Produce Pilot Results Report with before/after comparison | Vinay | End of PI |
| 32 | Produce role-based playbooks (BA, Tester, Developer, Data) | Vinay | End of PI |
| 33 | Executive summary and recommendation for Jim | Vinay + Romi | End of PI |
| 34 | Go/no-go recommendation for full ART rollout | Romi + Dinkar | End of PI |

---

## 5. Target Roles & AI Use Cases

### Approved Use Cases (from DCFS AI Rollout Plan + meeting)

| Role | AI Tool | Use Case | Expected Benefit |
|------|---------|----------|-----------------|
| **BA** | Rovo (JIRA AI) | User story quality assessment and refinement | Faster story authoring, fewer review cycles |
| **BA** | Rovo + Confluence | Acceptance criteria generation (Gherkin format) | Better testability, clearer requirements |
| **BA** | Rovo | Requirement summarization, impact analysis, refinement prep | Reduced BA prep time |
| **Tester** | Rovo / Copilot | Test script generation from acceptance criteria | Faster test creation, better coverage |
| **Tester** | Copilot | Edge case identification, test data generation | Fewer defect escapes |
| **Developer** | Copilot | Code explanation — paste complex code, get explanation + bug identification | Faster onboarding, faster debugging |
| **Developer** | Copilot | Unit test scenario suggestions (dev still writes code) | 10-20% time savings per story |
| **Developer** | Copilot | Technical documentation generation from code | Hours saved per sprint |
| **Developer** | Copilot | Refactoring suggestions (dev still implements) | Better code quality |
| **Data** | TBD | TBD (Chase to identify) | TBD |

### Explicitly NOT Approved

| What | Why |
|------|-----|
| Autonomous code generation | Jim: firm boundary; DoIT policy: human in the loop |
| AI-generated production code commits | Rollout plan: AI assists only, human authors |
| Pasting DCFS case data / PII into AI prompts | DoIT policy 4b, 4f: protected data restrictions |
| Using non-state-approved AI tools | Jim: only Copilot + Rovo without further approval |

---

## 6. Measurement Framework

### 6.1 Methodology

Our measurement approach is grounded in published, peer-reviewed research:

| Framework | Source | What It Provides |
|-----------|--------|-----------------|
| **GQM** (Goal-Question-Metric) | Basili et al. 1994, University of Maryland / NASA | Measurement design — every metric traces to a business goal |
| **DORA / Accelerate** | Forsgren, Humble, Kim 2018 (Google) | Delivery performance metrics (velocity, lead time, failure rate) |
| **SPACE** | Forsgren et al. 2021 (Microsoft Research, ACM) | Multi-dimensional team health (satisfaction, performance, communication) |
| **QUS** (Quality User Story) | Lucassen et al. 2016 (Utrecht University) | 13-criteria story quality scoring |
| **Six Sigma DMAIC** | Harry & Schroeder 2000 | Before/after measurement methodology (Define, Measure, Analyze, Improve, Control) |
| **ISO/IEC 25010** | ISO 2023 | International standard for software product quality |

### 6.2 Proposed Metrics

**Note:** Final metrics to be selected after executive discovery interview with Jim. Recommended starter set below — pick 8-12 max to avoid measurement burden.

#### Velocity & Delivery (from JIRA — automated)

| Metric | Definition | Source | Research |
|--------|-----------|--------|----------|
| Sprint velocity | Avg story points completed per sprint | JIRA | DORA (throughput) |
| Cycle time | Avg days from "In Progress" to "Done" | JIRA | DORA (lead time) |
| Throughput | Items completed per sprint | JIRA | DORA (throughput) |
| Sprint predictability | Committed vs delivered points | JIRA | SPACE (performance) |

#### Quality (from JIRA + manual — see Jira Quality Scanner)

| Metric | Definition | Source | Research |
|--------|-----------|--------|----------|
| Story quality score | Checklist score: AC, clarity, format, completeness | JIRA scanner + manual | QUS 13-criteria |
| Story rejection rate | % stories sent back for rework after review | JIRA transitions | Six Sigma (rework) |
| First pass yield | % stories passing QA on first attempt | JIRA transitions | Six Sigma (FPY) |
| Test coverage | % of stories with linked test cases | JIRA links | ISO 25010 (testability) |
| Defect density | Bugs per story point delivered | JIRA | Capers Jones (DRE) |

#### Efficiency (from JIRA — automated)

| Metric | Definition | Source | Research |
|--------|-----------|--------|----------|
| Story review cycle time | Days from story draft to "Ready for Dev" | JIRA | DORA (lead time) |
| Test creation time | Hours to create test scripts per story | Manual tracking | SPACE (efficiency) |

#### Team Health (survey — via tools.ussp.co)

| Metric | Definition | Source | Research |
|--------|-----------|--------|----------|
| SPACE survey (5 dimensions) | Satisfaction, Performance, Activity, Communication, Efficiency | Survey (1-5 scale) | Forsgren 2021 (ACM) |
| Requirement clarity | "Requirements are clear when I start work" | Survey (1-5 scale) | SPACE (communication) |

### 6.3 Measurement Approach

| Phase | What We Measure | How |
|-------|----------------|-----|
| **Baseline** (Apr) | All selected metrics from last 3 sprints | JIRA export + Jira Quality Scanner + SPACE survey |
| **During Pilot** (May–Jul) | Same metrics, same cadence | Continuous collection from JIRA + bi-weekly surveys |
| **Post-Pilot** | Same metrics from pilot PI | JIRA export + survey + comparison report |
| **Comparison** | AI pilot teams vs baseline vs control teams | Before/after delta analysis via tools.ussp.co |

### 6.4 Measurement Tool

All metrics tracked in the **AI Transformation Monitor** at `tools.ussp.co`:
- Research-backed computation (DORA, SPACE, DevEx, QUS)
- Before/after comparison with improvement percentages
- JIRA integration for automated metric collection
- Survey system for team health metrics
- Role-based training plan generation
- Executive report with benchmarks against Forrester, McKinsey, GitHub research

---

## 7. Pilot Team Selection

### Selection Criteria
- Technically mature team with strong leadership
- Strong BAs who can evaluate AI output quality (critical — AI amplifies skill)
- Cooperative PO/BA/Dev relationship
- Representative workload (not the most complex or unstable team)
- Each pilot team minimum: 1 BA, 1 Tester, 1 Developer

### Proposed Structure
- **2-3 pilot teams** receive AI training and tools
- **Remaining teams** continue as-is (control group for comparison)
- John has identified candidate names; Chase to add data team representatives

### Pilot Participants Per Team

| Role | Count | AI Focus |
|------|-------|----------|
| BA | 1 | Story quality, AC generation, refinement prep |
| Tester | 1 | Test generation from AC, edge cases |
| Developer | 1-2 | Code explanation, docs, refactoring suggestions |
| Scrum Lead | 1 | Oversight, weekly check-in reporting |

---

## 8. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| State pulls AI tools mid-pilot (CMS precedent, Oct 2025) | Medium | High | Full DoIT policy compliance upfront; stay within boundaries; document everything |
| DoIT 30-day notice not yet filed — delays pilot launch | Unknown | High | Clarify with Jim by Apr 8; if not filed, file immediately |
| AI makes stories/tests worse (garbage in, garbage out) | High | Medium | Training first; quality checklist; mandatory human review |
| Copilot not deployed to teams in time | Medium | Medium | Start with Rovo (already available); Copilot is additive, not required for Phase 1 |
| Baseline metrics not available in JIRA | Low | Medium | Jira Quality Scanner auto-computes from existing data; manual fallback |
| Sensitive child welfare data in AI prompts | Low | Critical | Strict training; "No PII" rule in every playbook; spot checks per sprint |
| Pilot teams not representative | Low | Low | Selection criteria; 2-3 diverse teams |
| Team resistance to AI tools | Medium | Medium | Voluntary pilot with strong participants; training shows value before asking for adoption |

---

## 9. Success Criteria

| Criterion | Target | How Measured |
|-----------|--------|-------------|
| Velocity improvement (pilot teams vs baseline) | >= 5% | JIRA sprint velocity comparison |
| Story quality score improvement | Measurable increase | QUS-based scoring before/after |
| Story review cycle time reduction | >= 10% | JIRA transition timestamps |
| Test creation time reduction | >= 15% | Manual time tracking |
| First pass yield improvement | Measurable increase | JIRA transitions (stories rejected in QA) |
| Team satisfaction (SPACE survey) | No decrease (ideally increase) | Survey scores |
| Playbooks produced | 1 per role | BA, Tester, Developer, Data playbooks |
| DoIT policy compliance | 100% | Documented compliance on all 12 sections |

---

## 10. Timeline

| Date | Milestone |
|------|-----------|
| Apr 7 | Planning meetings begin (2x/week) |
| Apr 8 | Romi meets Jim — clearance, DoIT status, Copilot deployment |
| Apr 7-12 | Vinay onboarding: JIRA (Matt), Architecture (Darren), role workflows |
| **Apr 17** | **This plan finalized and shared with Romi/Dinkar** |
| Apr 17-25 | Executive discovery interview with Jim; pilot team selection |
| Apr 21 | Run Jira Quality Scanner — auto-compute baseline |
| Apr 25 | Baseline SPACE/DevEx surveys distributed |
| Apr 28 | Metrics set finalized based on Jim's priorities |
| Apr 30 | Baseline metrics report complete; training materials ready |
| Late Apr | Springfield trip — present plan to Jim |
| **May 5-7** | **PI Planning — AI pilot announced, begins with new PI** |
| May-July | Pilot execution — weekly check-ins, continuous measurement |
| End of PI | Pilot results report, playbooks, rollout recommendation |
| **Month 5** | ART-wide rollout (if pilot succeeds) |

---

## 11. Deliverables

| # | Deliverable | Due | Owner |
|---|------------|-----|-------|
| 1 | This rollout plan | Apr 17 | Vinay + Romi |
| 2 | DoIT policy compliance status (from Jim) | Apr 8-10 | Romi + Robert |
| 3 | Baseline metrics report | Apr 30 | Vinay |
| 4 | Training materials (per role) | Before PI Planning | Vinay |
| 5 | AI Usage Playbook — DoIT-compliant guardrails | Before PI Planning | Vinay + Robert |
| 6 | Weekly status updates | During pilot | Vinay + Romi |
| 7 | Pilot results report (before/after comparison) | End of pilot PI | Vinay |
| 8 | Role-based playbooks (BA, Tester, Developer, Data) | End of pilot PI | Vinay |
| 9 | Executive recommendation for ART-wide rollout | End of pilot PI | Vinay + Romi |

---

## 12. Working Team

| Person | Role | Contribution |
|--------|------|-------------|
| **Vinay** (Karsan) | AI Transformation Leader | Plan, training, measurement, tool assessment, playbooks |
| **Romi** (Karsan) | Delivery Lead | Jim relationship, access, compliance, Springfield trip |
| **Robert** (Karsan) | Workforce Manager | DoIT policy bridge, documentation, coordination |
| **Matt** (Karsan) | RTE | JIRA/Confluence access, Rovo capabilities, tool config |
| **John** (Karsan) | Agile Delivery Mgr | Pilot candidate identification, testing focus, Copilot experience |
| **Chase** (Karsan) | Data Architect | Data team representation, data use cases |
| **Darren** (State) | Chief Solution Architect | Architecture context, dev process walkthrough |
| **Dinkar** (Karsan) | Executive Sponsor | Strategic direction, bench resource commitment |

---

## 13. IP & Productization

This engagement produces reusable assets for Karsan/USSP:
- Role-based AI playbooks (productizable with minor variations)
- AI Transformation measurement methodology and tool (tools.ussp.co)
- Training curriculum for AI-augmented Scrum teams
- Government AI compliance framework (DoIT policy mapping)

Jim is aware and amenable to Karsan/USSP productizing these deliverables.

---

## Appendix A: Open Questions (To Resolve by Apr 17)

- [x] What is the State of Illinois DoIT AI policy? — **Obtained and analyzed**
- [ ] Has DCFS filed DoIT AI System Assessment for Copilot/Rovo?
- [ ] When will GitHub Copilot be deployed to ILC teams?
- [ ] What JIRA workflow states are configured? (needed for cycle time computation)
- [ ] Which specific teams are best candidates for pilot?
- [ ] What process documentation exists in Confluence?
- [ ] What is the CI/CD pipeline? (Azure DevOps? GitHub Actions?)
- [ ] What .NET / TypeScript versions are in use?
- [ ] What automated testing framework do testers use?
- [ ] Can we access JIRA via API for automated metric collection?
- [ ] Does Copilot accessing ILC source code = "State data for AI purposes" per DoIT policy?

## Appendix B: Research Citations

See `methodology-citations.md` for full citations mapping every metric to published research (ISO 25010, DORA, SPACE, QUS, Six Sigma, CMMI, Capers Jones, GQM, NIST, McKinsey).

---

*Draft v2 — April 3, 2026. To be finalized through discovery phase (Apr 7-17) and executive interview with Jim.*
