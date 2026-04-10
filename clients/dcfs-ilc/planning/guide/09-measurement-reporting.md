# Chapter 9: Measurement, Reporting & Leadership Dashboard

> **Purpose:** Define what we measure, how we collect the data, how we compare pilot vs. control, and how Jim sees results without attending weekly standups.

> **Key principle:** Start with the SDLC process, identify what AI improves in that process, then select the KPI that proves it. Never measure something just because you can.

---

## 9.1 Measurement Philosophy

Most AI pilots fail at measurement because they start with the tool ("Copilot saves X minutes") instead of the process. We start from the opposite direction:

```
SDLC Process  -->  AI Intervention  -->  Observable Change  -->  KPI
```

**Example:**

| SDLC Process | AI Intervention | Observable Change | KPI |
|---|---|---|---|
| BA writes user story | Rovo drafts story from Confluence context | Fewer review cycles, faster "Ready for Dev" | Story review cycle time, rejection rate |
| Tester creates test cases | Copilot generates test stubs from acceptance criteria | Less time to first test execution | Test creation time |
| Developer implements feature | Copilot suggests code completions | Faster coding, fewer syntax-level bugs | Cycle time, defect density |

This process-first approach means every KPI has a clear causal chain back to a specific AI-augmented workflow. When Jim asks "why did this number move?" we can answer with the process, not just the tool.

**Why this matters for DCFS:** Jim led NLP adoption at DCFS that reduced caseworker paperwork by 5 hours per week. He will ask hard questions about attribution. A process-first model gives us defensible answers.

---

## 9.2 KPI Selection Approach

We maintain a catalog of 22 KPIs across 5 categories (see [Appendix A](../appendix-a-kpi-catalog.md) for the full catalog with definitions, formulas, and data sources). Not all 22 are measured in the pilot. We select up to 8 based on Jim's priorities during the executive discovery session.

### The 5 Categories

| Category | KPIs Available | Examples |
|---|---|---|
| **Velocity** | 4 | Sprint velocity, cycle time, throughput, predictability |
| **Quality** | 6 | Story quality score (QUS), rejection rate, first pass yield, test coverage, defect density, defect escape rate |
| **Efficiency** | 5 | Story review cycle time, test creation time, story authoring time, sprint completion rate, rework rate |
| **Team Health** | 4 | SPACE survey, requirement clarity, documentation completeness, planning accuracy |
| **Migration** | 3 | Migration defect rate, config documentation, feature lead time |

### Selection Process

1. **Jim identifies top 3 priorities** during executive discovery (e.g., "velocity matters most, but quality can't slip")
2. **We map priorities to categories** — if velocity is priority #1, we include sprint velocity + cycle time + throughput
3. **We ensure coverage** — at least 1 KPI from Quality and Team Health regardless of priorities (to catch regression)
4. **We confirm data feasibility** — every selected KPI must have a reliable data source before we commit to it
5. **Final set: 6-8 KPIs** — enough to tell the story, few enough to actually track

### Recommended Starting Set (Pre-Discovery)

Based on the rollout plan success criteria and what JIRA can provide automatically:

| # | KPI | Category | Why |
|---|-----|----------|-----|
| 1 | Sprint velocity | Velocity | Primary productivity measure; directly maps to 5% target |
| 2 | Story cycle time | Velocity | Shows where AI accelerates the flow |
| 3 | Story review cycle time | Efficiency | Direct measure of BA workflow improvement |
| 4 | Test creation time | Efficiency | Direct measure of Tester workflow improvement |
| 5 | Story quality score (QUS) | Quality | Ensures AI doesn't degrade output quality |
| 6 | Defect escape rate | Quality | Safety net — catches quality regression |
| 7 | SPACE survey composite | Team Health | Developer experience must not degrade |
| 8 | Sprint completion rate | Velocity | Predictability matters for PI planning |

This set will be adjusted after the discovery session with Jim. If he cares about migration-specific outcomes, we swap in migration KPIs.

---

## 9.3 Measurement Timeline

### Pre-Pilot (Weeks -3 to 0)

| When | What | Source | Owner |
|---|---|---|---|
| Week -3 | Pull last 3 sprints of JIRA data for pilot + control teams | JIRA API / export | Vinay + Matt |
| Week -3 | Compute baseline velocity, cycle time, throughput, completion rate | JIRA data | tools.ussp.co |
| Week -2 | Distribute SPACE survey (all 12 teams) | Survey tool | Vinay |
| Week -2 | Distribute DevEx survey (all 12 teams) | Survey tool | Vinay |
| Week -2 | Run readiness assessment on pilot teams | tools.ussp.co | Vinay |
| Week -1 | Compile baseline report | tools.ussp.co | Vinay |
| Week -1 | Review baseline with Romi; adjust KPI selection if data gaps found | Meeting | Vinay + Romi |
| Week 0 | Lock baseline numbers — no retroactive changes after this point | Documented | Vinay |

### During Pilot (Sprints 1-5)

| Cadence | What | Source |
|---|---|---|
| Continuous | JIRA metrics auto-collected (velocity, cycle time, throughput, transitions) | JIRA integration |
| Each sprint | Sprint completion rate calculated at sprint close | JIRA |
| Each sprint | Story quality spot-check (sample 3-5 stories per pilot team) | Manual QUS scoring |
| Weekly | Check-in with pilot team Scrum Masters — qualitative observations | Meeting notes |
| Sprint 3 | Mid-pilot SPACE pulse survey (pilot teams only) | Survey tool |
| Sprint 3 | Mid-pilot review — are we trending toward 5%? Adjust training if not | tools.ussp.co |

### Post-Pilot (Week after Sprint 5)

| When | What | Source |
|---|---|---|
| Day 1-2 | Final JIRA data pull — all 5 sprints for pilot + control | JIRA |
| Day 1-2 | Post-training SPACE survey (all 12 teams) | Survey tool |
| Day 1-2 | Post-training DevEx survey (all 12 teams) | Survey tool |
| Day 3-5 | Before/after analysis with statistical comparison | tools.ussp.co |
| Day 5-7 | Pilot Results Report drafted | Vinay |
| Day 7-10 | Executive brief prepared for Jim | Vinay + Romi |

---

## 9.4 Data Collection Methods

### Automated (JIRA Integration)

These metrics require no manual effort once the integration is configured:

| Metric | JIRA Data Point | Calculation |
|---|---|---|
| Sprint velocity | Story points in completed issues per sprint | Sum of points, status = Done at sprint close |
| Cycle time | Issue transition timestamps | "In Progress" to "Done" elapsed time |
| Throughput | Count of completed stories per sprint | Count, status = Done at sprint close |
| Sprint completion rate | Committed vs. completed | Completed points / committed points at sprint start |
| Story review cycle time | Transition timestamps | "In Review" to "Ready for Dev" elapsed time |
| Rejection rate | Status transitions | Count of "In Review" -> "Rework" / total stories |
| Defect escape rate | Bug issues linked to stories | Bugs found post-QA / total stories |

**Integration approach:** JIRA REST API, polled daily. Data flows into tools.ussp.co for computation and dashboarding. Matt (ILC JIRA admin) will help with API access and workflow state mapping.

### Manual Collection

| Metric | Collection Method | Frequency | Who |
|---|---|---|---|
| Story quality score | QUS rubric applied to sampled stories (3-5 per team per sprint) | Per sprint | Vinay or trained BA |
| Test creation time | Testers log time from "story assigned" to "test cases complete" | Per story | Testers (self-report) |
| Story authoring time | BAs log time from "story started" to "submitted for review" | Per story | BAs (self-report) |
| Documentation completeness | Manual audit of Confluence pages against checklist | Mid-pilot + end | Vinay |

**Minimizing manual burden:** Self-reported time tracking is lightweight — we ask for a single number per story, not timesheets. We provide a simple form (not a spreadsheet) that takes < 30 seconds per entry.

### Surveys

| Survey | Framework | Length | When |
|---|---|---|---|
| SPACE Survey | 5 dimensions: Satisfaction, Performance, Activity, Communication, Efficiency | 15-20 questions, ~10 min | Pre-pilot, mid-pilot (pulse), post-pilot |
| DevEx Survey | 3 dimensions: Flow State, Feedback Loops, Cognitive Load | 10-12 questions, ~7 min | Pre-pilot, post-pilot |

Surveys go to all 12 teams (pilot + control) at baseline and post-pilot. This lets us compare whether pilot teams' experience changed differently from control teams.

---

## 9.5 Comparison Model

We use a 3-way comparison to isolate AI's impact from natural team variation:

```
                    Baseline          Pilot Period
                    (3 sprints)       (5 sprints)
                    ───────────       ────────────
Pilot Teams    ──>  [Baseline A]  ->  [Measured A']    -->  A' vs A = improvement
Control Teams  ──>  [Baseline B]  ->  [Measured B']    -->  B' vs B = natural drift
                                                       -->  (A'-A) vs (B'-B) = AI attribution
```

### Why 3-Way?

| Comparison | What It Tells You | Limitation |
|---|---|---|
| Pilot vs. own baseline | Did pilot teams improve? | Could be Hawthorne effect, sprint variability, or seasonal factors |
| Control vs. own baseline | Did non-AI teams change? | Natural drift reference |
| Pilot improvement vs. control improvement | Is the pilot improvement beyond what would have happened anyway? | This is the real signal |

### Statistical Approach

- **Sample size:** 2 pilot teams x 5 sprints = 10 sprint data points; 10 control teams provide the comparison band
- **Method:** We compare the pilot team improvement percentage against the range of control team improvements. If pilot teams improve by 8% and control teams range from -2% to +3%, the signal is clear
- **Honesty clause:** With 2 pilot teams, we cannot achieve p < 0.05 statistical significance. We will state this clearly. The pilot produces a strong directional signal, not a clinical trial. Scale to 6+ teams provides the statistical power

### Handling Confounders

| Confounder | Mitigation |
|---|---|
| Hawthorne effect (teams try harder because they're watched) | Control teams are also monitored; survey both groups |
| Sprint variability | Use 3-sprint baseline average, not a single sprint |
| Team composition changes | Document any staffing changes during pilot; note in analysis |
| Different work types (new dev vs. migration vs. maintenance) | Track story type distribution; normalize if skewed |
| PI boundary effects | Align pilot to full PI; avoid measuring partial PIs |

---

## 9.6 Leadership Dashboard

### Purpose

Jim should be able to see how the pilot is performing at any time without scheduling a meeting, attending a check-in, or reading a 20-page report. The dashboard gives him a live, glanceable view of what matters.

The dashboard is part of the tools.ussp.co reporting module (AI Transformation Monitor), which already handles assessment, training plans, and reporting for the engagement.

### Dashboard Views

#### View 1: Executive Summary

The landing view. Four big numbers, updated after each sprint close.

| Metric | Display | Example |
|---|---|---|
| Overall improvement % | Large number with trend arrow | **+7.2%** (up arrow) |
| Teams trained | Count / total | **2 / 12** (pilot phase) |
| Stories processed with AI assist | Cumulative count | **47 stories** |
| Velocity trend | Sparkline or mini-chart | Sprint-over-sprint line |

Below the big numbers: a one-paragraph auto-generated summary. Example:

> *Pilot teams are showing a 7.2% velocity improvement over baseline through Sprint 3, compared to 1.1% natural improvement in control teams. Story quality scores are stable (no regression). Mid-pilot SPACE survey shows slight improvement in Satisfaction dimension. On track for 5% target.*

#### View 2: Team Comparison

Side-by-side comparison of pilot vs. control teams for each selected KPI.

| KPI | Pilot Team Avg | Control Team Avg | Delta |
|---|---|---|---|
| Velocity (pts/sprint) | 42.5 | 38.0 | +11.8% vs baseline |
| Cycle time (days) | 3.2 | 4.1 | -22% vs baseline |
| Sprint completion % | 88% | 82% | +6pt vs baseline |
| Story quality (QUS) | 7.8/10 | 7.5/10 | +0.3 vs baseline |

Color coding: green if pilot outperforms control by > 3%, yellow if within 3%, red if pilot underperforms.

#### View 3: Trend

Sprint-over-sprint line charts for primary KPIs. Shows:
- Pilot team trendline
- Control team trendline
- Baseline reference line (horizontal)

One chart per KPI. Visible at a glance whether the lines are diverging (good) or converging (intervention needed).

#### View 4: SPACE & DevEx Radar

Radar chart with 5 SPACE axes (Satisfaction, Performance, Activity, Communication, Efficiency) showing:
- Baseline shape (gray)
- Current shape (blue for pilot, dotted for control)

Separate radar for DevEx (3 axes: Flow State, Feedback Loops, Cognitive Load).

#### View 5: Compliance Status

DoIT policy compliance checklist — red/yellow/green for each of the 12 policy sections.

| DoIT Section | Status | Notes |
|---|---|---|
| Human in the loop (4d, 6) | Green | All AI outputs reviewed before use |
| No protected data in prompts (4f) | Green | Training completed; no incidents |
| AI System Assessment (5f) | Yellow | Filed; awaiting Agency Head signoff |
| Transparency disclosure (5a-c) | Green | All participants notified |

This view matters because CMS had AI tools pulled in October 2025. Jim will want proof of compliance at all times.

### Composite Score Calculation

The overall improvement % on the Executive Summary view is a weighted composite:

| Framework | Weight | What It Covers |
|---|---|---|
| DORA metrics | 30% | Deployment frequency, lead time, change failure rate, MTTR |
| Scrum metrics | 30% | Velocity, cycle time, throughput, predictability, bug escape rate |
| SPACE | 25% | 5-axis developer experience survey |
| DevEx | 15% | Flow state, feedback loops, cognitive load |

The weighting reflects that this engagement is about delivery improvement (DORA + Scrum = 60%) balanced with team experience (SPACE + DevEx = 40%). Weights can be adjusted if Jim prioritizes differently.

### Reporting Cadence

| Artifact | Audience | Frequency | Format |
|---|---|---|---|
| Dashboard | Jim (CIO) | Always current (updated at sprint close) | tools.ussp.co |
| Formal executive brief | Jim, Dinkar | At PI boundaries | 1-page PDF |
| Weekly check-in report | Romi, Vinay, team leads | Weekly | Internal doc |
| Mid-pilot pulse report | Romi, Vinay | Once (Sprint 3) | Internal doc |

Jim sees the dashboard whenever he wants. We push formal reports to him only at PI boundaries — no weekly email noise.

---

## 9.7 Reporting Deliverables

### 9.7.1 Weekly Check-In Report (Internal)

**Audience:** Romi, Vinay, pilot team Scrum Masters
**Purpose:** Keep the execution team aligned on progress and blockers

Contents:
- Sprint metrics snapshot (velocity, completion rate, cycle time)
- AI adoption observations (what teams are using, what they're avoiding)
- Blockers and risks
- Action items for next week
- Qualitative feedback from team leads

**Format:** Shared doc, updated each Friday. Not sent to Jim unless he requests it.

### 9.7.2 Mid-Pilot Pulse Report

**Audience:** Romi, Vinay
**Purpose:** Checkpoint — are we trending toward 5%? Do we need to adjust?

Contents:
- 3-sprint trend for all selected KPIs
- Pilot vs. control comparison at midpoint
- SPACE pulse survey results (pilot teams)
- Training effectiveness assessment — are teams actually using the techniques taught?
- Course correction recommendations (if any)

**Timing:** After Sprint 3 retrospective.

### 9.7.3 Pilot Results Report (Final)

**Audience:** Jim, Dinkar, Romi, Vinay
**Purpose:** Definitive before/after comparison with attribution analysis

Contents:
1. Executive summary (1 paragraph)
2. Methodology recap (how we measured, what we controlled for)
3. KPI results table — baseline, pilot period, control period, delta, AI-attributed improvement
4. Statistical analysis and confidence statement
5. SPACE/DevEx before/after comparison
6. Qualitative findings (what teams said, what we observed)
7. DoIT compliance summary
8. Recommendations for scale

**Format:** Structured report (10-15 pages), plus the 1-page executive brief (below).

### 9.7.4 Executive Brief (1-Page for Jim)

**Audience:** Jim Daugherty (CIO)
**Purpose:** One page with the answer to "Did it work?"

Layout:
- **Top third:** 3-4 big numbers (velocity improvement %, quality trend, teams trained, compliance status)
- **Middle third:** Before/after comparison chart (pilot vs. control)
- **Bottom third:** Go/no-go recommendation with rationale, next steps

This is what Jim takes into his leadership meetings. It must be self-contained — no "see page 14 for details."

### 9.7.5 Scale Recommendation

**Audience:** Jim, Dinkar, Romi
**Purpose:** Data-backed go/no-go for expanding from 2 teams to all 12

Contents:
- Pilot results summary (from above)
- Readiness assessment for remaining 10 teams
- Resource requirements for scale (training capacity, tool licenses, measurement infrastructure)
- Proposed rollout schedule (waves of 2-3 teams)
- Risks and mitigations for scale
- Updated ROI projection based on actual pilot results

**Decision framework:** See Section 9.8 (Success Criteria) below.

---

## 9.8 Success Criteria

The following criteria determine whether the pilot is successful and informs the scale recommendation. These align with [Section 9 of the Rollout Plan](../rollout-plan.md#9-success-criteria).

| Criterion | Target | How Measured | Minimum for "Go" |
|---|---|---|---|
| Velocity improvement | >= 5% | Sprint velocity, pilot vs. baseline, adjusted for control drift | >= 3% (with positive trend) |
| Story quality score | No decrease, ideally increase | QUS scoring, before/after | No statistically meaningful decrease |
| Story review cycle time | >= 10% reduction | JIRA transition timestamps | >= 5% reduction |
| Test creation time | >= 15% reduction | Manual time tracking | >= 10% reduction |
| First pass yield | Measurable increase | JIRA transitions | No decrease |
| SPACE survey | No decrease | Survey composite score | No decrease in any dimension > 0.5 SD |
| Playbooks produced | 1 per role | BA, Tester, Developer playbooks | At least BA + Developer |
| DoIT compliance | 100% | Documented compliance | 100% (non-negotiable) |

### Decision Matrix

| Outcome | Criteria Met | Action |
|---|---|---|
| **Strong Go** | 6+ criteria met including velocity >= 5% | Scale immediately in next PI |
| **Conditional Go** | 4-5 criteria met, velocity >= 3% | Scale with modifications; address gaps first |
| **Extend** | 2-3 criteria met, positive trend but not yet at targets | Run 1 more PI with adjustments before scaling |
| **No Go** | < 2 criteria met or quality/compliance regression | Stop; reassess approach fundamentally |

---

## 9.9 Lessons Learned Capture

We capture lessons learned continuously, not just at the end. This feeds directly into the scale playbook.

### Collection Points

| When | Method | Who |
|---|---|---|
| Each sprint retro | Pilot teams add AI-specific items to their existing retro | Scrum Masters |
| Weekly check-ins | Vinay documents observations | Vinay |
| Mid-pilot | Structured reflection (what's working, what's not, what to change) | Pilot team members |
| End of pilot | Formal lessons learned session (60 min) | All pilot participants |

### Structured Format

Each lesson follows this template:

```
Category:     [Training | Tool Usage | Measurement | Process | Governance]
Observation:  [What happened]
Impact:       [What was the effect — positive or negative]
Root Cause:   [Why it happened]
Action:       [What to do differently at scale]
Priority:     [Must Fix | Should Improve | Nice to Have]
```

**Example:**

```
Category:     Training
Observation:  BAs retained prompt techniques better when practiced on their own
              team's stories during training, not generic examples
Impact:       Teams using real stories in training adopted AI 2x faster in Sprint 1
Root Cause:   Context-specific practice creates immediate utility; generic
              examples feel theoretical
Action:       For scale, use each team's actual backlog stories as training material
Priority:     Must Fix
```

### Lessons Feed Into

| Artifact | How Lessons Are Used |
|---|---|
| Training materials | Revise curriculum based on what teams actually struggled with |
| Role playbooks | Include tips and anti-patterns from real team experience |
| Scale plan | Adjust rollout sequence, training duration, support model |
| Governance docs | Update compliance procedures if gaps were found |
| Measurement approach | Refine KPI selection, data collection methods, survey questions |

---

## 9.10 Platform: tools.ussp.co

The AI Transformation Monitor at tools.ussp.co is the system of record for all measurement and reporting in this engagement. It already provides:

| Module | Function |
|---|---|
| Assessment | Readiness assessment for teams and individuals |
| Training Plans | Role-based training curriculum tracking |
| DORA Metrics | Deployment frequency, lead time, change failure rate, MTTR |
| Scrum Metrics | Velocity, cycle time, throughput, predictability, bug escape rate |
| SPACE Radar | 5-axis developer experience visualization |
| DevEx Dashboard | Flow state, feedback loops, cognitive load tracking |
| Composite Score | Weighted rollup (DORA 30%, Scrum 30%, SPACE 25%, DevEx 15%) |
| Reporting | Exportable reports, trend charts, team comparisons |

For this engagement, the platform handles:
- Baseline computation from JIRA data
- Sprint-over-sprint tracking and trend analysis
- Pilot vs. control team comparison
- Survey distribution and analysis (SPACE, DevEx)
- Dashboard views described in Section 9.6
- Report generation for all deliverables in Section 9.7

JIRA data is ingested via API. Survey data is entered through the platform. Manual metrics (time tracking) are entered via simple forms. All data is stored with team and sprint identifiers for proper segmentation.
