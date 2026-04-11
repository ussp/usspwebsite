---
title: "Measurement and Reporting"
description: "KPI selection approach, 3-way comparison model, leadership dashboard, reporting deliverables, and success criteria framework"
---

# Chapter 9: Measurement, Reporting & Leadership Dashboard

> **Purpose:** Define what we measure, how we collect the data, how we compare pilot vs. control, and how leadership sees results without attending weekly standups.

> **Key principle:** Start with the SDLC process, identify what AI improves in that process, then select the KPI that proves it. Never measure something just because you can.

---

## 9.1 Measurement Philosophy

Most AI pilots fail at measurement because they start with the tool ("AI saves X minutes") instead of the process. We start from the opposite direction:

```
SDLC Process  -->  AI Intervention  -->  Observable Change  -->  KPI
```

**Example:**

| SDLC Process | AI Intervention | Observable Change | KPI |
|---|---|---|---|
| BA writes user story | AI drafts story from context | Fewer review cycles, faster "Ready for Dev" | Story review cycle time, rejection rate |
| Tester creates test cases | AI generates test stubs from acceptance criteria | Less time to first test execution | Test creation time |
| Developer implements feature | AI suggests code completions | Faster coding, fewer syntax-level bugs | Cycle time, defect density |

This process-first approach means every KPI has a clear causal chain back to a specific AI-augmented workflow. When leadership asks "why did this number move?" you can answer with the process, not just the tool.

---

## 9.2 KPI Selection Approach

We maintain a catalog of 22 KPIs across 5 categories (see Appendix A for the full catalog with definitions, formulas, and data sources). Not all 22 are measured in the pilot. Select up to 8 based on the executive sponsor's priorities during the discovery session.

### The 5 Categories

| Category | KPIs Available | Examples |
|---|---|---|
| **Velocity** | 4 | Sprint velocity, cycle time, throughput, predictability |
| **Quality** | 6 | Story quality score (QUS), rejection rate, first pass yield, test coverage, defect density, defect escape rate |
| **Efficiency** | 5 | Story review cycle time, test creation time, story authoring time, sprint completion rate, rework rate |
| **Team Health** | 4 | SPACE survey, requirement clarity, documentation completeness, planning accuracy |
| **Domain-Specific** | 3 | Domain-specific defect rate, config documentation, feature lead time |

### Selection Process

1. **Executive sponsor identifies top 3 priorities** during discovery (e.g., "velocity matters most, but quality can't slip")
2. **Map priorities to categories** -- if velocity is priority #1, include sprint velocity + cycle time + throughput
3. **Ensure coverage** -- at least 1 KPI from Quality and Team Health regardless of priorities (to catch regression)
4. **Confirm data feasibility** -- every selected KPI must have a reliable data source before committing to it
5. **Final set: 6-8 KPIs** -- enough to tell the story, few enough to actually track

### Recommended Starting Set (Pre-Discovery)

Based on typical engagement success criteria and what project trackers can provide automatically:

| # | KPI | Category | Why |
|---|-----|----------|-----|
| 1 | Sprint velocity | Velocity | Primary productivity measure; directly maps to improvement target |
| 2 | Story cycle time | Velocity | Shows where AI accelerates the flow |
| 3 | Story review cycle time | Efficiency | Direct measure of BA workflow improvement |
| 4 | Test creation time | Efficiency | Direct measure of Tester workflow improvement |
| 5 | Story quality score (QUS) | Quality | Ensures AI doesn't degrade output quality |
| 6 | Defect escape rate | Quality | Safety net -- catches quality regression |
| 7 | SPACE survey composite | Team Health | Developer experience must not degrade |
| 8 | Sprint completion rate | Velocity | Predictability matters for planning |

This set is adjusted after the discovery session. If the sponsor prioritizes domain-specific outcomes, swap in domain-specific KPIs.

---

## 9.3 Measurement Timeline

### Pre-Pilot (Weeks -3 to 0)

| When | What | Source |
|---|---|---|
| Week -3 | Pull last 3 sprints of project tracker data for pilot + control teams | Project tracker API / export |
| Week -3 | Compute baseline velocity, cycle time, throughput, completion rate | Measurement platform |
| Week -2 | Distribute SPACE survey (all teams) | Survey tool |
| Week -2 | Distribute DevEx survey (all teams) | Survey tool |
| Week -2 | Run readiness assessment on pilot teams | Measurement platform |
| Week -1 | Compile baseline report | Measurement platform |
| Week -1 | Review baseline with engagement lead; adjust KPI selection if data gaps found | Meeting |
| Week 0 | Lock baseline numbers -- no retroactive changes after this point | Documented |

### During Pilot (Sprints 1-5)

| Cadence | What | Source |
|---|---|---|
| Continuous | Project tracker metrics auto-collected (velocity, cycle time, throughput, transitions) | Project tracker integration |
| Each sprint | Sprint completion rate calculated at sprint close | Project tracker |
| Each sprint | Story quality spot-check (sample 3-5 stories per pilot team) | Manual QUS scoring |
| Weekly | Check-in with pilot team Scrum Masters -- qualitative observations | Meeting notes |
| Sprint 3 | Mid-pilot SPACE pulse survey (pilot teams only) | Survey tool |
| Sprint 3 | Mid-pilot review -- are we trending toward target? Adjust training if not | Measurement platform |

### Post-Pilot (Week after Sprint 5)

| When | What | Source |
|---|---|---|
| Day 1-2 | Final project tracker data pull -- all 5 sprints for pilot + control | Project tracker |
| Day 1-2 | Post-pilot SPACE survey (all teams) | Survey tool |
| Day 1-2 | Post-pilot DevEx survey (all teams) | Survey tool |
| Day 3-5 | Before/after analysis with statistical comparison | Measurement platform |
| Day 5-7 | Pilot Results Report drafted | AI Transformation Lead |
| Day 7-10 | Executive brief prepared for sponsor | AI Transformation Lead + engagement lead |

---

## 9.4 Data Collection Methods

### Automated (Project Tracker Integration)

These metrics require no manual effort once the integration is configured:

| Metric | Data Point | Calculation |
|---|---|---|
| Sprint velocity | Story points in completed issues per sprint | Sum of points, status = Done at sprint close |
| Cycle time | Issue transition timestamps | "In Progress" to "Done" elapsed time |
| Throughput | Count of completed stories per sprint | Count, status = Done at sprint close |
| Sprint completion rate | Committed vs. completed | Completed points / committed points at sprint start |
| Story review cycle time | Transition timestamps | "In Review" to "Ready for Dev" elapsed time |
| Rejection rate | Status transitions | Count of "In Review" -> "Rework" / total stories |
| Defect escape rate | Bug issues linked to stories | Bugs found post-QA / total stories |

**Integration approach:** Project tracker REST API, polled daily. Data flows into the measurement platform for computation and dashboarding. The project tracker admin will help with API access and workflow state mapping.

### Manual Collection

| Metric | Collection Method | Frequency | Who |
|---|---|---|---|
| Story quality score | QUS rubric applied to sampled stories (3-5 per team per sprint) | Per sprint | AI Transformation Lead or trained BA |
| Test creation time | Testers log time from "story assigned" to "test cases complete" | Per story | Testers (self-report) |
| Story authoring time | BAs log time from "story started" to "submitted for review" | Per story | BAs (self-report) |
| Documentation completeness | Manual audit against checklist | Mid-pilot + end | AI Transformation Lead |

**Minimizing manual burden:** Self-reported time tracking is lightweight -- a single number per story, not timesheets. Provide a simple form (not a spreadsheet) that takes < 30 seconds per entry.

### Surveys

| Survey | Framework | Length | When |
|---|---|---|---|
| SPACE Survey | 5 dimensions: Satisfaction, Performance, Activity, Communication, Efficiency | 15-20 questions, ~10 min | Pre-pilot, mid-pilot (pulse), post-pilot |
| DevEx Survey | 3 dimensions: Flow State, Feedback Loops, Cognitive Load | 10-12 questions, ~7 min | Pre-pilot, post-pilot |

Surveys go to all teams (pilot + control) at baseline and post-pilot. This lets you compare whether pilot teams' experience changed differently from control teams.

---

## 9.5 Comparison Model

We use a 3-way comparison to isolate AI's impact from natural team variation:

```
                    Baseline          Pilot Period
                    (3 sprints)       (5 sprints)
                    -----------       ------------
Pilot Teams    -->  [Baseline A]  ->  [Measured A']    -->  A' vs A = improvement
Control Teams  -->  [Baseline B]  ->  [Measured B']    -->  B' vs B = natural drift
                                                       -->  (A'-A) vs (B'-B) = AI attribution
```

### Why 3-Way?

| Comparison | What It Tells You | Limitation |
|---|---|---|
| Pilot vs. own baseline | Did pilot teams improve? | Could be Hawthorne effect, sprint variability, or seasonal factors |
| Control vs. own baseline | Did non-AI teams change? | Natural drift reference |
| Pilot improvement vs. control improvement | Is the pilot improvement beyond what would have happened anyway? | This is the real signal |

### Statistical Approach

- **Sample size:** 2-3 pilot teams x 5 sprints = 10-15 sprint data points; control teams provide the comparison band
- **Method:** Compare the pilot team improvement percentage against the range of control team improvements. If pilot teams improve by 8% and control teams range from -2% to +3%, the signal is clear
- **Honesty clause:** With 2-3 pilot teams, you likely cannot achieve p < 0.05 statistical significance. State this clearly. The pilot produces a strong directional signal, not a clinical trial. Scale to 6+ teams provides the statistical power

### Handling Confounders

| Confounder | Mitigation |
|---|---|
| Hawthorne effect (teams try harder because they're watched) | Control teams are also monitored; survey both groups |
| Sprint variability | Use 3-sprint baseline average, not a single sprint |
| Team composition changes | Document any staffing changes during pilot; note in analysis |
| Different work types (new dev vs. maintenance) | Track story type distribution; normalize if skewed |
| Iteration boundary effects | Align pilot to full iteration cycle; avoid measuring partial cycles |

---

## 9.6 Leadership Dashboard

### Purpose

The executive sponsor should be able to see how the pilot is performing at any time without scheduling a meeting, attending a check-in, or reading a 20-page report. The dashboard gives them a live, glanceable view of what matters.

### Dashboard Views

#### View 1: Executive Summary

The landing view. Four big numbers, updated after each sprint close.

| Metric | Display | Example |
|---|---|---|
| Overall improvement % | Large number with trend arrow | **+7.2%** (up arrow) |
| Teams trained | Count / total | **2 / 10** (pilot phase) |
| Stories processed with AI assist | Cumulative count | **47 stories** |
| Velocity trend | Sparkline or mini-chart | Sprint-over-sprint line |

Below the big numbers: a one-paragraph auto-generated summary. Example:

> *Pilot teams are showing a 7.2% velocity improvement over baseline through Sprint 3, compared to 1.1% natural improvement in control teams. Story quality scores are stable (no regression). Mid-pilot SPACE survey shows slight improvement in Satisfaction dimension. On track for improvement target.*

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

### Composite Score Calculation

The overall improvement % on the Executive Summary view is a weighted composite:

| Framework | Weight | What It Covers |
|---|---|---|
| DORA metrics | 30% | Deployment frequency, lead time, change failure rate, MTTR |
| Scrum metrics | 30% | Velocity, cycle time, throughput, predictability, bug escape rate |
| SPACE | 25% | 5-axis developer experience survey |
| DevEx | 15% | Flow state, feedback loops, cognitive load |

The weighting reflects that engagements are typically about delivery improvement (DORA + Scrum = 60%) balanced with team experience (SPACE + DevEx = 40%). Weights can be adjusted based on sponsor priorities.

### Reporting Cadence

| Artifact | Audience | Frequency | Format |
|---|---|---|---|
| Dashboard | Executive sponsor | Always current (updated at sprint close) | Measurement platform |
| Formal executive brief | Executive sponsor + leadership | At iteration cycle boundaries | 1-page PDF |
| Weekly check-in report | Engagement lead, team leads | Weekly | Internal doc |
| Mid-pilot pulse report | Engagement lead | Once (Sprint 3) | Internal doc |

The sponsor sees the dashboard whenever they want. Push formal reports only at iteration cycle boundaries -- no weekly email noise.

---

## 9.7 Reporting Deliverables

### 9.7.1 Weekly Check-In Report (Internal)

**Audience:** Engagement lead, pilot team Scrum Masters
**Purpose:** Keep the execution team aligned on progress and blockers

Contents:
- Sprint metrics snapshot (velocity, completion rate, cycle time)
- AI adoption observations (what teams are using, what they're avoiding)
- Blockers and risks
- Action items for next week
- Qualitative feedback from team leads

**Format:** Shared doc, updated each Friday. Not sent to the executive sponsor unless requested.

### 9.7.2 Mid-Pilot Pulse Report

**Audience:** Engagement lead
**Purpose:** Checkpoint -- are we trending toward the improvement target? Do we need to adjust?

Contents:
- 3-sprint trend for all selected KPIs
- Pilot vs. control comparison at midpoint
- SPACE pulse survey results (pilot teams)
- Training effectiveness assessment -- are teams actually using the techniques taught?
- Course correction recommendations (if any)

**Timing:** After Sprint 3 retrospective.

### 9.7.3 Pilot Results Report (Final)

**Audience:** Executive sponsor, engagement lead
**Purpose:** Definitive before/after comparison with attribution analysis

Contents:
1. Executive summary (1 paragraph)
2. Methodology recap (how we measured, what we controlled for)
3. KPI results table -- baseline, pilot period, control period, delta, AI-attributed improvement
4. Statistical analysis and confidence statement
5. SPACE/DevEx before/after comparison
6. Qualitative findings (what teams said, what we observed)
7. Compliance summary
8. Recommendations for scale

**Format:** Structured report (10-15 pages), plus the 1-page executive brief (below).

### 9.7.4 Executive Brief (1-Page)

**Audience:** Executive sponsor
**Purpose:** One page with the answer to "Did it work?"

Layout:
- **Top third:** 3-4 big numbers (velocity improvement %, quality trend, teams trained, compliance status)
- **Middle third:** Before/after comparison chart (pilot vs. control)
- **Bottom third:** Go/no-go recommendation with rationale, next steps

This is what the sponsor takes into their leadership meetings. It must be self-contained -- no "see page 14 for details."

### 9.7.5 Scale Recommendation

**Audience:** Executive sponsor, engagement lead
**Purpose:** Data-backed go/no-go for expanding from pilot teams to the full organization

Contents:
- Pilot results summary (from above)
- Readiness assessment for remaining teams
- Resource requirements for scale (training capacity, tool licenses, measurement infrastructure)
- Proposed rollout schedule (waves of 2-3 teams)
- Risks and mitigations for scale
- Updated ROI projection based on actual pilot results

**Decision framework:** See Section 9.8 (Success Criteria) below.

---

## 9.8 Success Criteria

The following criteria determine whether the pilot is successful and inform the scale recommendation.

| Criterion | Target | How Measured | Minimum for "Go" |
|---|---|---|---|
| Velocity improvement | >= 5% | Sprint velocity, pilot vs. baseline, adjusted for control drift | >= 3% (with positive trend) |
| Story quality score | No decrease, ideally increase | QUS scoring, before/after | No statistically meaningful decrease |
| Story review cycle time | >= 10% reduction | Project tracker transition timestamps | >= 5% reduction |
| Test creation time | >= 15% reduction | Manual time tracking | >= 10% reduction |
| First pass yield | Measurable increase | Project tracker transitions | No decrease |
| SPACE survey | No decrease | Survey composite score | No decrease in any dimension > 0.5 SD |
| Playbooks produced | 1 per role | BA, Tester, Developer playbooks | At least BA + Developer |
| Compliance | 100% | Documented compliance | 100% (non-negotiable) |

### Decision Matrix

| Outcome | Criteria Met | Action |
|---|---|---|
| **Strong Go** | 6+ criteria met including velocity >= 5% | Scale immediately in next iteration cycle |
| **Conditional Go** | 4-5 criteria met, velocity >= 3% | Scale with modifications; address gaps first |
| **Extend** | 2-3 criteria met, positive trend but not yet at targets | Run 1 more cycle with adjustments before scaling |
| **No Go** | < 2 criteria met or quality/compliance regression | Stop; reassess approach fundamentally |

---

## 9.9 Lessons Learned Capture

Capture lessons learned continuously, not just at the end. This feeds directly into the scale playbook.

### Collection Points

| When | Method | Who |
|---|---|---|
| Each sprint retro | Pilot teams add AI-specific items to their existing retro | Scrum Masters |
| Weekly check-ins | AI Transformation Lead documents observations | AI Transformation Lead |
| Mid-pilot | Structured reflection (what's working, what's not, what to change) | Pilot team members |
| End of pilot | Formal lessons learned session (60 min) | All pilot participants |

### Structured Format

Each lesson follows this template:

```
Category:     [Training | Tool Usage | Measurement | Process | Governance]
Observation:  [What happened]
Impact:       [What was the effect -- positive or negative]
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
