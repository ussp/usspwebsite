# Pilot Measurement Methodology — DCFS Illinois Connect

> **Version:** V04142026
> **Owner:** Vinay Lagisetty
> **Action Item:** From April 13 Jim meeting — "Develop a methodology for measuring pilot outcomes based on code generation, documentation lines, and configuration lines, avoiding reliance on point systems."

---

## 1. Measurement Philosophy

Jim directed: **measure tangible outputs, not story points.**

Story points measure effort estimation, not productivity. In a configuration-first Dynamics 365 environment, story points are especially misleading — a 5-point config story and a 5-point custom code story are fundamentally different work. Tangible outputs are observable, countable, and comparable.

---

## 2. What We Measure

### Primary Metrics — Tangible Outputs

| Metric | Definition | How to Track | Unit | Direction |
|--------|-----------|-------------|------|-----------|
| **Lines of code generated & accepted** | AI-suggested code lines that developer reviewed and committed | Git diff analysis — compare AI-suggested vs committed | Lines per sprint | Higher = better |
| **Lines of code acceptance rate** | % of AI suggestions accepted vs rejected | Copilot telemetry (Enterprise tier) | % | Higher = better (but 100% is a red flag) |
| **Documentation lines generated** | Docs generated via AI (technical docs, inline comments, README) | Git diff on doc files + manual tracking | Lines per sprint | Higher = better |
| **Configuration lines generated** | D365 config artifacts generated/assisted by AI | Manual tracking — config team logs AI-assisted vs manual | Config items per sprint | Higher = better |
| **Test scripts generated** | Test cases/scripts generated from acceptance criteria via AI | Manual tracking — tester logs AI-generated vs manual | Scripts per sprint | Higher = better |

### Secondary Metrics — Quality & Efficiency

| Metric | Definition | How to Track | Source | Direction |
|--------|-----------|-------------|--------|-----------|
| **Cycle time** | Days from "In Progress" to "Done" | JIRA workflow timestamps | JIRA | Lower = better |
| **Story rejection rate** | % of stories sent back for rework | JIRA transitions | JIRA | Lower = better |
| **First pass yield** | % of stories passing QA on first attempt | JIRA transitions | JIRA | Higher = better |
| **Defect density** | Bugs per story delivered | JIRA | JIRA | Lower = better |
| **Rework rate** | Stories reopened after "Done" | JIRA | JIRA | Lower = better |
| **Review turnaround time** | Time from PR submitted to approved | Git/JIRA | Git | Lower = better |

### Team Health Metrics — Survey-Based

| Metric | Definition | How to Track | Frequency |
|--------|-----------|-------------|-----------|
| **SPACE survey** | Satisfaction, Performance, Activity, Communication, Efficiency (1-5 scale) | Survey (5 questions) | Before pilot + after pilot |
| **DevEx survey** | Flow state, feedback loops, cognitive load (1-5 scale) | Survey (3 questions) | Before pilot + after pilot |
| **Mid-pilot pulse** | Usefulness, productivity change, barriers, recommendations | Survey (5 questions) | End of Sprint 3 |

---

## 3. How to Track Tangible Outputs

### Code Generation (Developers)

**Method:** Copilot telemetry + Git analysis

```
1. GitHub Copilot Enterprise provides usage dashboards:
   - Suggestions shown per user
   - Suggestions accepted per user
   - Acceptance rate
   - Languages/files where Copilot was used

2. Git diff analysis (weekly):
   - Total lines committed by pilot dev
   - Lines in files where Copilot was active
   - Compare to same dev's baseline (pre-AI sprints)

3. Developer self-reporting (weekly check-in):
   - "This week, Copilot helped me with: [list tasks]"
   - "Estimated time saved: [X hours]"
   - "AI output I rejected because: [reason]"
```

**What to watch:** Acceptance rate of 100% = not reviewing. Target 40-70% acceptance rate — means developer is evaluating and selecting.

### Documentation (All Roles)

**Method:** Git diff on documentation files + manual log

```
1. Identify documentation files (*.md, *.docx, Confluence pages)
2. Weekly: count new/modified doc lines in pilot team repos
3. Compare to baseline (same metric from pre-AI sprints)
4. Team members tag commits: "[AI-assisted]" in commit message
```

### Configuration (Configuration Team)

**Method:** Manual tracking log — no automated way to measure this yet

```
Configuration Tracking Log (per sprint):

| Date | Config Item | AI-Assisted? | Tool Used | Time (manual) | Time (with AI) | Notes |
|------|------------|-------------|-----------|--------------|---------------|-------|
|      |            | Yes/No      |           |              |               |       |
```

**Key question for Kashif/Shyam:** Is there a way to log D365 configuration changes with metadata indicating AI assistance? If Power Automate Copilot is used, is there a usage log?

### Test Scripts (Testers)

**Method:** Manual tracking + JIRA linking

```
Test Script Tracking Log (per sprint):

| Story | Test Scripts Total | AI-Generated | AI-Accepted | Time (manual) | Time (with AI) | Notes |
|-------|-------------------|-------------|-------------|--------------|---------------|-------|
|       |                   |             |             |              |               |       |
```

---

## 4. Comparison Model

### Three-Way Comparison

| Comparison | What It Shows |
|-----------|-------------|
| **Pilot vs Baseline** | Did the AI team improve compared to their own past performance? |
| **Pilot vs Control** | Did the AI team improve compared to teams without AI in the same PI? |
| **Sprint-over-Sprint** | Is the improvement trend increasing, stable, or declining over the 5 sprints? |

### Statistical Honesty

With only 2 pilot teams and 10 control teams, we won't have statistical significance in the traditional sense. Be transparent about this:

- Report **trend direction and magnitude**, not p-values
- Show **per-team data**, not just averages (averages hide team-level variation)
- Acknowledge **novelty effect** — sprint 1-2 data may be inflated; sprint 3-5 is the real signal
- Report **both successes and failures** — what didn't work is as valuable as what did

---

## 5. Measurement Timeline

| When | What | Who |
|------|------|-----|
| **Pre-pilot (Apr 14-May 5)** | Baseline: JIRA data (3 sprints), SPACE/DevEx survey, readiness assessment | Vinay + Matt |
| **Sprint 1-2** | Setup: establish tracking logs, configure Copilot telemetry, train teams on logging | Vinay |
| **Sprint 3 (mid-pilot)** | Pulse survey, first tangible output comparison vs baseline | Vinay |
| **Sprint 3-4 (pilot)** | Weekly: collect tangible output logs, JIRA metrics, check-in feedback | Vinay |
| **Sprint 5 (end of pilot)** | Post-pilot: SPACE/DevEx resurvey, final JIRA pull, compile all output data | Vinay |
| **Post-pilot (1 week)** | Pilot Results Report: before/after comparison, lessons learned, scale recommendation | Vinay |

---

## 6. Reporting Deliverables

| Report | Audience | Frequency | Content |
|--------|----------|-----------|---------|
| **Weekly check-in report** | Pilot teams, Romi | Weekly | Tangible outputs this week, adoption rate, blockers, adjustments |
| **Mid-pilot pulse report** | Dave, governance team | Once (Sprint 3) | Survey results, trend direction, early findings |
| **Pilot Results Report** | Dave, Jim, governance team | Once (end of PI) | Full before/after comparison, all metrics, lessons learned |
| **Executive brief** | Jim (CIO) | Once (end of PI) | 1-page summary: improvement %, key findings, scale recommendation |
| **Dashboard** | Dave, Jim | Always current | JIRA dashboards + Power BI (or tools.ussp.co if approved) |

---

## 7. How to Calculate Improvement

### Tangible Output Improvement

```
Improvement % = ((Pilot Output - Baseline Output) / Baseline Output) × 100

Example:
  Baseline: Dev committed 200 lines/sprint (no AI)
  Pilot:    Dev committed 240 lines/sprint (with Copilot)
  Improvement: ((240 - 200) / 200) × 100 = 20%
```

### Quality Improvement

```
Quality Improvement = Baseline Defect Rate - Pilot Defect Rate

Example:
  Baseline: 3 bugs per 100 lines
  Pilot:    2 bugs per 100 lines
  Improvement: 33% reduction in defect density
```

### Composite Score (for executive reporting)

| Category | Weight | What's Measured |
|----------|--------|----------------|
| Tangible outputs (LOC, docs, config) | 40% | Volume of AI-assisted deliverables |
| Quality (defects, rework, first pass yield) | 30% | Did quality hold or improve? |
| Efficiency (cycle time, review time) | 20% | Did things get faster? |
| Team health (SPACE/DevEx) | 10% | Did teams feel better or worse? |

```
Composite = (Output Improvement × 0.4) + (Quality Improvement × 0.3) 
          + (Efficiency Improvement × 0.2) + (Health Improvement × 0.1)
```

---

## 8. Target: 10-15% in 13 Weeks

Jim's target mapped to tangible metrics:

| Metric | Baseline (estimated) | 10% Target | 15% Target |
|--------|---------------------|-----------|-----------|
| Lines of code per sprint (per dev) | TBD from baseline | +10% | +15% |
| Documentation coverage | TBD from baseline | +10% | +15% |
| Test scripts per sprint (per tester) | TBD from baseline | +10% | +15% |
| Cycle time | TBD from baseline | -10% | -15% |
| Defect density | TBD from baseline | -10% | -15% |

**Note:** We won't know if 10-15% is realistic until we have baseline data. The stair-stepped approach means full impact may not be visible until Sprint 4-5 (Steps 4-5 of the stair).

---

## 9. What NOT to Measure

| Don't Measure | Why |
|--------------|-----|
| Story points velocity | Jim directed tangible outputs; points are estimation, not output |
| Lines of code as sole metric | LOC alone incentivizes bloat; pair with quality metrics |
| Hours worked | We're measuring output, not input |
| Individual performance | This is team-level measurement, not individual ranking |
| AI tool uptime | Not a productivity metric |

---

## 10. Open Questions

1. **Copilot telemetry:** Does the State's Copilot tier provide usage dashboards? (Ask Dave)
2. **Git access:** Can we run git diff analysis on ILC repos? (Ask Dave/Matt)
3. **Config tracking:** Is there a D365 change log that distinguishes AI-assisted vs manual config? (Ask Kashif)
4. **Baseline period:** Are the last 3 sprints representative, or were there anomalies (holidays, incidents)? (Ask Matt)
5. **Capacity adjustment:** How do we account for the 15% training capacity reduction in output comparisons? (Normalize output by available capacity)
