---
title: "Pilot Execution"
description: "Team selection criteria, control group design, weekly cadence, check-in templates, and mid-pilot pulse survey"
---

# Chapter 8: Pilot Execution

## Purpose

The pilot is where the framework meets reality. A small number of teams use AI tools with training and support for one full iteration cycle, while the remaining teams continue as-is (control group). Everything is measured.

## When This Happens

- **Phase:** Pilot
- **Timing:** 1 full Program Increment (PI) or equivalent cycle -- typically 5 sprints / 10 weeks
- **Deliverable:** Weekly Check-in Reports, Mid-Pilot Pulse Report

## Pilot Structure

| Group | Teams | What They Do |
|-------|-------|-------------|
| **Pilot** | 2-3 teams (recommended) | AI tools + training + weekly support |
| **Control** | Remaining teams | Business as usual -- no AI tools, no training |

Same iteration cycle. Same conditions. Measurable difference.

### Why 2-3 Pilot Teams?

- **1 team** is too risky -- if that team has an unusual sprint, you have no comparison within the pilot group
- **2-3 teams** gives you enough signal to see patterns while keeping the pilot manageable
- **More than 3** dilutes the support model and reduces the quality of training and coaching

### Pilot Team Selection Criteria

Select pilot teams that maximize the chance of a meaningful signal:

| Criterion | Why It Matters |
|-----------|---------------|
| **Stable team composition** | No staffing changes expected during pilot period |
| **Representative work mix** | Team works on a mix of new development, maintenance, and defect resolution |
| **Engaged Scrum Master** | SM is willing to drive adoption, collect feedback, and enforce guardrails |
| **Willing participants** | Team members are curious or at least open -- not hostile to AI tools |
| **Measurable baseline** | Team has at least 3 sprints of reliable data in the project tracker |
| **Not the highest or lowest performers** | Avoid ceiling/floor effects; pick middle-of-the-pack teams for clearest signal |

### Pilot Team Composition (per team)

| Role | Count | AI Focus |
|------|-------|----------|
| BA | 1 | Story quality, AC generation |
| Tester | 1 | Test generation from AC |
| Developer | 1-2 | Code explanation, documentation, unit tests |
| Scrum Master/Lead | 1 | Oversight, reporting, coaching |

## Pilot Launch

The pilot launches at the beginning of the iteration cycle (e.g., PI Planning):

1. **Organization-level announcement** -- Brief overview of the AI pilot to all teams (what it is, what it isn't, who's participating)
2. **Pilot team briefing** -- Detailed expectations, tool access confirmed, support channels established
3. **Control team briefing** -- Explain they're the baseline comparison; their work doesn't change
4. **Metrics confirmation** -- Verify project tracker data collection is working for all teams

## Weekly Cadence

| Day | Activity | Owner |
|-----|----------|-------|
| Monday | Review previous sprint's AI usage and metrics | AI Transformation Lead |
| Wednesday | Weekly check-in with pilot teams (30 min) | AI Transformation Lead + Scrum Leads |
| Friday | Weekly check-in report distributed | AI Transformation Lead |

### Weekly Check-in Agenda (30 min)

1. **What worked this week?** (5 min) -- Specific AI augmentations that helped
2. **What didn't work?** (5 min) -- AI outputs that were rejected, unhelpful, or wrong
3. **Adoption blockers** (5 min) -- Tool access issues, prompt problems, guardrail confusion
4. **Metrics snapshot** (5 min) -- Quick look at velocity, quality, cycle time vs baseline
5. **Adjustments** (5 min) -- What to try differently next week
6. **Prompt sharing** (5 min) -- Effective prompts that others should try

### Weekly Check-in Report Template

```
## Weekly Check-in Report -- Week [N]
**Date:**
**Sprint:**
**Teams:**

### Metrics Snapshot
| Metric | Baseline | This Week | Trend |
|--------|----------|-----------|-------|
| Velocity | | | |
| Cycle time | | | |
| Rejection rate | | | |

### What's Working
-

### What's Not Working
-

### Adjustments Made
-

### Adoption Rate
- Stories where AI was used: X / Y (Z%)
- Team members actively using tools: X / Y

### Concerns / Escalations
-

### Next Week Focus
-
```

## Per-Sprint Activities

| Activity | Who | When |
|----------|-----|------|
| AI-augmented story writing | BAs | Sprint planning + during sprint |
| AI-assisted test generation | Testers | After stories are ready |
| AI-assisted code review/docs | Developers | During development |
| Sprint metrics collection | AI Transformation Lead | End of each sprint |
| Quality spot checks | Pilot team leads | Per sprint |
| Adoption challenge documentation | All pilot participants | Ongoing |

## What Success Looks Like During the Pilot

- Pilot team members are **actively using** AI tools (not just installed)
- AI-generated outputs are being **reviewed and refined** (not blindly accepted)
- Weekly check-ins surface **real feedback** (both positive and negative)
- Metrics show **directional improvement** (even if small -- trend matters more than magnitude)
- No **compliance violations** (no sensitive data in prompts, no autonomous deployment)

## What to Watch For

| Signal | What It Means | Action |
|--------|-------------|--------|
| Team stops using tools after week 2 | Novelty wore off; real friction emerged | Investigate blockers; provide hands-on support |
| Speed up but quality drops | AI is generating faster but lower-quality outputs | Reinforce review practices; update prompts |
| Huge improvement (>30%) in week 1 | Likely novelty effect -- won't sustain | Don't report inflated numbers; wait for week 3+ data |
| One role adopts, others don't | Training gap or tool fit issue for non-adopting role | Role-specific follow-up session |
| Complaints about "extra work" | AI is adding steps instead of reducing them | Redesign the augmented process; simplify prompts |

## Support During the Pilot

- **Office hours:** 2x per week, 1 hour each -- drop in for prompt help, tool questions
- **Chat channel:** Dedicated channel for pilot participants to share tips and ask questions
- **Weekly tips:** AI Transformation Lead sends 1-2 practical tips per week
- **Prompt library:** Shared repository of effective prompts, organized by role and SDLC process

## Mid-Pilot Pulse Survey

At the midpoint (end of sprint 3 in a 5-sprint pilot), distribute a short pulse survey:

1. How useful have AI tools been in your daily work? (1-5)
2. Has your productivity improved since training? (1-5)
3. What's the biggest barrier to using AI tools more? (open text)
4. What prompt or technique has been most helpful? (open text)
5. Would you recommend AI tools to colleagues on other teams? (Yes / No / Not yet)

Results inform whether adjustments are needed for the second half of the pilot.

### Acting on Survey Results

| Signal | Action |
|--------|--------|
| Average usefulness < 3.0 | Emergency review -- something fundamental isn't working. 1:1s with low scorers. |
| Average usefulness 3.0-3.9 | Targeted intervention -- identify specific blockers from open text responses |
| Average usefulness 4.0+ | On track -- continue current support model, share wins with leadership |
| "Biggest barrier" clusters around one theme | Address that theme immediately (additional training, tool config change, process redesign) |
| > 70% would recommend | Strong signal for scale readiness |

---

**Next:** [Chapter 9: Measurement and Reporting](09-measurement-reporting.md) -- KPIs, before/after comparison, and leadership dashboard
