# DCFS ILC — Baseline Metrics Definition

> **Status:** TODO — Define during discovery phase (Apr 7–17)
> **Owner:** Vinay
> **Dependencies:** JIRA access, Matt's help understanding available data

---

## Purpose

Establish quantitative baselines before AI tools are introduced so that improvement can be measured objectively. Jim (CIO) specifically wants to compare AI-augmented pilot teams against non-AI teams.

---

## Proposed Metrics

### Tier 1: Primary (Must Have)

These directly measure the 5% productivity target.

| Metric | Definition | Source | Baseline Period |
|--------|-----------|--------|----------------|
| Sprint velocity | Avg story points completed per sprint | JIRA | Last 3 sprints |
| Sprint completion rate | % of committed stories delivered | JIRA | Last 3 sprints |
| Story cycle time (by size) | Days from "In Progress" → "Done" | JIRA | Last 3 sprints |

### Tier 2: Role-Specific Efficiency

These measure where AI can make a difference per role.

| Metric | Role | Definition | Source |
|--------|------|-----------|--------|
| Story authoring time | BA | Creation → "Ready for Dev" | JIRA workflow timestamps |
| Story approval cycles | BA/PO | # of review rounds before approval | JIRA comments/transitions |
| Test script creation time | Tester | Story "Ready for Test" → test scripts complete | JIRA / manual tracking |
| Story rejection rate | BA | % sent back for rework | JIRA transitions |
| Defect escape rate | Tester | Defects found in later stages | JIRA bug tracking |

### Tier 3: Quality (Qualitative → Quantitative)

| Metric | Definition | How to Measure |
|--------|-----------|---------------|
| Story quality score | Does story meet defined quality criteria? | Checklist assessment (AI-assisted) |
| Documentation completeness | Are Confluence docs current and sufficient? | Manual audit |
| Rework rate | Stories reopened after "Done" | JIRA |

---

## Open Questions

- [ ] What JIRA workflow states exist? (need to map to cycle time measurement)
- [ ] Is story point sizing consistent across teams?
- [ ] Can we export JIRA data programmatically (API access)?
- [ ] Do teams use sub-tasks? If so, how do we account for them?
- [ ] Is there a standard definition of "Ready for Dev" across teams?
- [ ] How many sprints of historical data do we have?

---

## Data Collection Plan

<!-- TODO: After JIRA access and Matt walkthrough -->

1. Export sprint velocity data for all 12 teams (last 3–6 sprints)
2. Export story-level data with workflow transitions and timestamps
3. Identify 2–3 pilot teams and their matched control teams
4. Calculate baseline averages per metric
5. Document any anomalies or caveats

---

*To be completed during discovery phase. Requires JIRA access and Matt's collaboration.*
