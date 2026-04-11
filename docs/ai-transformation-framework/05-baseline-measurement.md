---
title: "Baseline Measurement"
description: "Capturing current delivery metrics from project management tools and team surveys"
---

# Chapter 5: Baseline Measurement

## Purpose

Before introducing AI tools, we must capture where teams are today. The baseline serves as the "before" in a before/after comparison -- without it, any claimed improvement is anecdotal, not evidence.

## When This Happens

- **Phase:** Baseline
- **Timing:** 2-3 weeks before training begins
- **Deliverable:** Baseline Metrics Report

## What We Measure

### Automated Metrics (from JIRA, Azure DevOps, or equivalent)

These are pulled from the last 3 completed sprints for all teams:

| Metric | Description | Source |
|--------|------------|--------|
| Sprint velocity | Average story points completed per sprint | Project management tool |
| Cycle time | Days from "In Progress" to "Done" | Project management tool |
| Throughput | Items completed per sprint | Project management tool |
| Sprint predictability | Committed vs. delivered points | Project management tool |
| Story rejection rate | Percentage of stories sent back for rework | Project management tool |
| First pass yield | Percentage of stories passing QA on first attempt | Project management tool |
| Defect density | Bugs per story point delivered | Project management tool |
| Rework rate | Stories reopened after Done | Project management tool |

### Manual Metrics

| Metric | Description | Source |
|--------|------------|--------|
| Story quality score | 13-criteria checklist (clarity, acceptance criteria, completeness) | Quality Scanner |
| Test coverage | Percentage of stories with linked test cases | Test management tool |
| Documentation completeness | Percentage of features with current documentation | Audit |

### Survey Metrics

| Survey | What It Measures | Audience |
|--------|-----------------|----------|
| AI Readiness Assessment | Skills, process, attitudes, infrastructure readiness | All teams |
| SPACE Survey | Satisfaction, Performance, Activity, Communication, Efficiency | Pilot teams only |
| DevEx Survey | Flow state, feedback loops, cognitive load | Pilot teams only |

See [Chapter 4: Readiness Assessment](04-readiness-assessment.md) for the full assessment instrument.

## Data Collection Process

### Step 1: Tool Access (Week 1)

- Confirm access to the project management tool (JIRA, Azure DevOps, Rally, etc.) with the release train engineer or project manager
- Identify workflow states (needed for cycle time computation)
- Pull 3 sprints of data for all teams
- Validate data completeness -- flag teams with incomplete tracking

### Step 2: Quality Scanner (Week 1)

- Run the quality scanner on stories from the last 3 sprints
- Score each story against the 13-criteria checklist (QUS framework)
- Compute average quality score per team

### Step 3: Readiness Assessment (Week 1-2)

- Distribute the AI Readiness Assessment to all teams (see [Chapter 4](04-readiness-assessment.md))
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
- Load baseline data into the AI Transformation Monitor

## Baseline Metrics Report -- Structure

```
1. Executive Summary
   - Overall delivery organization performance snapshot
   - Key findings and notable patterns

2. Per-Team Metrics
   - Velocity, cycle time, throughput, predictability
   - Quality scores, rejection rates, defect density
   - Readiness assessment scores

3. Team Comparison
   - Side-by-side comparison across all teams
   - Identify high-readiness and low-readiness teams

4. Pilot Team Recommendation
   - Based on readiness scores + metric profiles
   - Recommended pilot teams and rationale
   - Recommended control teams

5. KPI Selection
   - Based on executive priorities (from discovery)
   - Selected KPIs for the pilot (typically 6-10)
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
| Good data hygiene | Project management tracking is complete enough to measure changes |
| Strong Scrum Master | Can coach adoption and report issues |
| Representative workload | Not the most complex or simplest team -- generalizable results |
| Cooperative PO/BA/Dev relationship | Reduces friction during adoption |

## What a Good Baseline Looks Like

- **Complete:** Data for all teams, at least 3 sprints each
- **Consistent:** Same workflow states used across teams (or differences documented)
- **Honest:** Captures actual performance, not aspirational numbers
- **Actionable:** Clearly shows which KPIs have room for improvement and which teams are pilot-ready

---

**Next:** Chapter 6: Process Design -- Mapping current state to AI-augmented state for each SDLC process
