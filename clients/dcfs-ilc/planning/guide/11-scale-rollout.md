# Chapter 11: Scale & Rollout

## Purpose

If the pilot proves successful, expand AI augmentation from 2 pilot teams to all 12 teams across the ART. Scale is based on proven results, not assumptions.

## When This Happens

- **Phase:** Scale
- **Timing:** Next PI after pilot results are reviewed
- **Deliverable:** ART-Wide Rollout Plan

## Go / No-Go Decision

Before scaling, the leadership team reviews the Pilot Results Report (see [Chapter 9](09-measurement-reporting.md)) and makes a go/no-go decision.

### Go Criteria

| Criterion | Threshold |
|-----------|-----------|
| Velocity improvement | 5%+ over baseline |
| Quality maintained or improved | No increase in defect density or escape rate |
| Team satisfaction | SPACE scores stable or improved |
| Compliance | Zero guardrail violations |
| Adoption rate | >70% of pilot participants actively using tools |
| Executive approval | CIO confirms scale is appropriate |

### No-Go Signals

- Quality degraded during pilot
- Teams stopped using tools after initial novelty
- Compliance violations occurred
- Metrics showed no meaningful improvement
- Executive concerns not addressed

### Partial Go

If results are mixed — for example, BA processes improved but developer processes didn't — scale only what worked. Not everything needs to scale together.

## Scale Strategy

### Phased Rollout (Not Big Bang)

Scale happens in waves, not all 12 teams at once:

| Wave | Teams | Timing | Focus |
|------|-------|--------|-------|
| Wave 1 (Pilot) | 2 teams | Pilot PI | Full framework — all roles, all processes |
| Wave 2 | 3-4 teams | Next PI | Proven processes only — based on pilot results |
| Wave 3 | Remaining teams | PI after that | Full rollout with refined playbooks |

### AI Champions Model

Pilot team members become **AI Champions** for the scale rollout:

- Each pilot participant is paired with 1-2 people from new teams
- Champions provide hands-on coaching during the first 2-3 sprints
- Champions share effective prompts, common pitfalls, and practical tips
- This is peer learning, not top-down training

### Training for Scale

Training at scale is streamlined based on pilot learnings:

1. **Foundation track** — Same for everyone (DoIT compliance, guardrails)
2. **Role tracks** — Updated with pilot lessons learned, refined prompts, real examples
3. **Delivery method** — Can shift from live workshops to recorded sessions + champion coaching
4. **Duration** — May be shorter than pilot training (skip what didn't work, focus on what did)

See [Chapter 7: Training Delivery](07-training-delivery.md) for the full training plan.

## Measurement at Scale

### ART-Level Metrics

At scale, measurement shifts from team-level to ART-level:

| What Changes | How |
|-------------|-----|
| No more control group | All teams are now using AI tools |
| Comparison shifts | Current PI vs pilot PI vs pre-pilot baseline |
| Frequency | Sprint-level tracking continues; executive report at PI boundaries |
| Dashboard | tools.ussp.co shows ART-wide view, not just pilot teams |

### Continuous Improvement

- Playbooks updated each PI based on new learnings
- Prompt libraries grow as more teams contribute
- Quarterly readiness re-assessment to track attitude and skills change
- Annual review of KPIs and measurement framework

## Rollout Checklist

Before each wave:

- [ ] Pilot results reviewed and go decision confirmed
- [ ] Playbooks updated with pilot lessons learned
- [ ] AI Champions identified and briefed
- [ ] Tool access provisioned for new teams
- [ ] Training scheduled (Foundation + role tracks)
- [ ] JIRA tracking confirmed for new teams
- [ ] Dashboard configured for new teams
- [ ] Executive briefed on expansion plan

## End State

When scale is complete:

> AI augmentation is standard practice across the ART — not a special project, just how teams work.

- Every BA uses Rovo for story quality and AC generation
- Every tester uses AI for test script creation
- Every developer uses Copilot for code review and documentation
- Every Scrum Master uses AI for sprint insights
- Playbooks are maintained as living documents
- Measurement continues at ART level
- New team members are onboarded with AI training as standard

---

**Next:** [Chapter 12: Tools Platform](12-tools-platform.md) — tools.ussp.co user guide and dashboard configuration
