---
title: "Baseline Measurement"
description: "JIRA metrics, SPACE/DevEx surveys, and baseline report"
---

# Chapter 5: Baseline Measurement

## Purpose

Before introducing AI tools, we must capture where teams are today. The baseline serves as the "before" in a before/after comparison — without it, any claimed improvement is anecdotal, not evidence.

## When This Happens

- **Phase:** Baseline
- **Timing:** 2-3 weeks before training begins
- **Deliverable:** Baseline Metrics Report

## What We Measure

### Automated Metrics (from JIRA)

These are pulled from the last 3 completed sprints for all 12 teams:

| Metric | Description | Source |
|--------|------------|--------|
| Sprint velocity | Average story points completed per sprint | JIRA |
| Cycle time | Days from "In Progress" to "Done" | JIRA |
| Throughput | Items completed per sprint | JIRA |
| Sprint predictability | Committed vs delivered points | JIRA |
| Story rejection rate | % of stories sent back for rework | JIRA |
| First pass yield | % of stories passing QA on first attempt | JIRA |
| Defect density | Bugs per story point delivered | JIRA |
| Rework rate | Stories reopened after Done | JIRA |

### Manual Metrics

| Metric | Description | Source |
|--------|------------|--------|
| Story quality score | 13-criteria checklist (clarity, AC, completeness) | JIRA Quality Scanner |
| Test coverage | % of stories with linked test cases | Zephyr |
| Documentation completeness | % of features with current Confluence docs | Audit |

### Survey Metrics

| Survey | What It Measures | Audience |
|--------|-----------------|----------|
| AI Readiness Assessment | Skills, process, attitudes, infrastructure readiness | All 12 teams |
| SPACE Survey | Satisfaction, Performance, Activity, Communication, Efficiency | Pilot teams only |
| DevEx Survey | Flow state, feedback loops, cognitive load | Pilot teams only |

See [Chapter 4: Readiness Assessment](04-readiness-assessment.md) for the full assessment instrument.

## Data Collection Process

### Step 1: JIRA Access (Week 1)

- Confirm JIRA access with Matt (RTE)
- Identify JIRA workflow states (needed for cycle time computation)
- Pull 3 sprints of data for all 12 teams
- Validate data completeness — flag teams with incomplete tracking

### Step 2: Quality Scanner (Week 1)

- Run the JIRA Quality Scanner on stories from the last 3 sprints
- Score each story against the 13-criteria checklist (QUS framework)
- Compute average quality score per team

### Step 3: Readiness Assessment (Week 1-2)

- Distribute the AI Readiness Assessment to all 12 teams (see [Chapter 4](04-readiness-assessment.md))
- Collect responses over 5 business days
- Compute readiness scores per team

### Step 4: SPACE/DevEx Survey (Week 2)

- Distribute to pilot team candidates only
- 8 questions total (5 SPACE + 3 DevEx)
- Establishes team health baseline for before/after comparison

### Step 5: Baseline Report (Week 2-3)

- Compile all data into Baseline Metrics Report
- Per-team breakdown with averages and ranges
- Highlight differences between teams (inform pilot selection)
- Load baseline data into tools.ussp.co

## Baseline Metrics Report — Structure

```
1. Executive Summary
   - Overall ART performance snapshot
   - Key findings and notable patterns

2. Per-Team Metrics
   - Velocity, cycle time, throughput, predictability
   - Quality scores, rejection rates, defect density
   - Readiness assessment scores

3. Team Comparison
   - Side-by-side comparison across all 12 teams
   - Identify high-readiness and low-readiness teams

4. Pilot Team Recommendation
   - Based on readiness scores + metric profiles
   - Recommended pilot teams and rationale
   - Recommended control teams

5. KPI Selection
   - Based on executive priorities (from discovery)
   - Up to 8 KPIs selected for the pilot
   - Data availability confirmed for each

6. Appendix: Raw Data
   - Sprint-by-sprint data per team
   - Individual readiness assessment results (anonymized)
```

## Pilot Team Selection Criteria

The baseline data, combined with the readiness assessment, informs pilot team selection:

| Criterion | Why It Matters |
|-----------|---------------|
| High readiness score | Team is willing and able to adopt AI tools |
| Moderate velocity (not extreme) | Room for measurable improvement without ceiling effects |
| Good data hygiene | JIRA tracking is complete enough to measure changes |
| Strong Scrum Master | Can coach adoption and report issues |
| Representative workload | Not the most complex or simplest team — generalizable results |
| Cooperative PO/BA/Dev relationship | Reduces friction during adoption |

## What a Good Baseline Looks Like

- **Complete:** Data for all 12 teams, at least 3 sprints each
- **Consistent:** Same JIRA workflow states used across teams (or differences documented)
- **Honest:** Captures actual performance, not aspirational numbers
- **Actionable:** Clearly shows which KPIs have room for improvement and which teams are pilot-ready

---

**Next:** [Chapter 6: Process Design](06-process-design.md) — Mapping current → AI-augmented state for each SDLC process
