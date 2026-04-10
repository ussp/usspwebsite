# Chapter 13: Deployment

## Purpose

This chapter describes how to deploy the AI Transformation Framework for a new client engagement — from initial setup through first pilot. Use this as a step-by-step guide when starting with a new client.

## Pre-Requisites

Before deploying the framework, confirm:

- [ ] Client engagement contract is signed
- [ ] AI Transformation Leader is assigned
- [ ] Engagement Director is identified
- [ ] Client's project methodology is known (SAFe, Scrum, etc.)
- [ ] Client's tech stack is documented
- [ ] Client's AI policy/constraints are understood (or will be discovered)

## Deployment Steps

### Week 1-2: Govern

| Step | Action | Reference |
|------|--------|-----------|
| 1 | **Identify executive sponsor** — who makes AI adoption decisions | [Ch 2](02-executive-discovery.md) |
| 2 | **Prepare org contact sheet** — gather client context before the first meeting | [Ch 2](02-executive-discovery.md) |
| 3 | **Review client's AI policy** — map to compliance framework | [Ch 3](03-governance-compliance.md) |
| 4 | **Confirm approved AI tools** — what's purchased, what's deployed | [Ch 3](03-governance-compliance.md) |
| 5 | **Schedule executive discovery session** — 45-60 min listening meeting | [Ch 2](02-executive-discovery.md) |
| 6 | **Conduct executive discovery** — capture priorities, concerns, success definition | [Ch 2](02-executive-discovery.md) |
| 7 | **Draft AI Usage Playbook** — guardrails, data boundaries, tool rules | [Ch 3](03-governance-compliance.md) |

### Week 2-3: Baseline & Design

| Step | Action | Reference |
|------|--------|-----------|
| 8 | **Distribute AI Readiness Assessment** — all teams, not just pilot candidates | [Ch 4](04-readiness-assessment.md) |
| 9 | **Pull baseline metrics** — JIRA data for last 3 sprints, all teams | [Ch 5](05-baseline-measurement.md) |
| 10 | **Run quality scanner** — story quality scores across teams | [Ch 5](05-baseline-measurement.md) |
| 11 | **Distribute SPACE/DevEx survey** — pilot team candidates | [Ch 5](05-baseline-measurement.md) |
| 12 | **Analyze readiness results** — compute team scores, identify pilot candidates | [Ch 4](04-readiness-assessment.md) |
| 13 | **Select pilot teams** — based on readiness + baseline data | [Ch 5](05-baseline-measurement.md) |
| 14 | **Map SDLC processes** — current → AI-augmented state per role | [Ch 6](06-process-design.md) |
| 15 | **Select KPIs** — up to 8, based on executive priorities | [Ch 9](09-measurement-reporting.md) |
| 16 | **Produce baseline report** | [Ch 5](05-baseline-measurement.md) |

### Week 3-4: Train

| Step | Action | Reference |
|------|--------|-----------|
| 17 | **Build training materials** — prompt libraries, example outputs, cheat sheets | [Ch 7](07-training-delivery.md) |
| 18 | **Deliver Foundation track** — compliance, guardrails, what success looks like | [Ch 7](07-training-delivery.md) |
| 19 | **Deliver role-specific tracks** — BA, Tester, Developer, Scrum Master | [Ch 7](07-training-delivery.md) |
| 20 | **Deliver Leadership Briefing** — what AI does/doesn't, dashboard demo | [Ch 7](07-training-delivery.md) |
| 21 | **Draft role-based playbooks** — from process designs + training materials | [Ch 10](10-playbooks.md) |

### Week 5+: Pilot & Measure

| Step | Action | Reference |
|------|--------|-----------|
| 22 | **Launch pilot at PI Planning** — announce to ART, brief pilot teams | [Ch 8](08-pilot-execution.md) |
| 23 | **Configure tools.ussp.co** — create engagement, add teams, load baseline | [Ch 12](12-tools-platform.md) |
| 24 | **Share dashboard URL with executive** — read-only access | [Ch 9](09-measurement-reporting.md) |
| 25 | **Run weekly check-ins** — 30 min, pilot teams, adjust as needed | [Ch 8](08-pilot-execution.md) |
| 26 | **Mid-pilot pulse survey** — at sprint 3 midpoint | [Ch 8](08-pilot-execution.md) |
| 27 | **Post-pilot measurement** — JIRA pull + SPACE/DevEx resurvey | [Ch 9](09-measurement-reporting.md) |
| 28 | **Produce Pilot Results Report** — before/after comparison | [Ch 9](09-measurement-reporting.md) |
| 29 | **Finalize playbooks** — update with pilot lessons learned | [Ch 10](10-playbooks.md) |
| 30 | **Go/no-go decision** — scale or adjust | [Ch 11](11-scale-rollout.md) |

## Platform Setup

### tools.ussp.co Configuration

1. **Create tenant** (if new client) — see [AI Tools Tenant Onboarding](../../docs/ai-tools/14-tenant-onboarding.md)
2. **Create engagement** — name, client, teams, PI dates
3. **Configure JIRA integration** — API credentials, project keys
4. **Create baseline assessment** — automated (JIRA) + manual (surveys)
5. **Generate training plan** — customize based on [Chapter 7](07-training-delivery.md)
6. **Share dashboard** — generate read-only URL for executive

### File Structure for New Engagement

```
clients/[client-name]/
├── README.md                    ← Engagement overview
├── meeting-notes/               ← Chronological meeting notes
├── planning/
│   ├── rollout-plan.md          ← Customized from template
│   ├── executive-discovery-questionnaire.md
│   ├── guide/                   ← Copy and customize this guide
│   └── slides/                  ← Presentation deck
├── playbooks/                   ← Role-based playbooks (evolve during pilot)
├── onboarding/                  ← Team member onboarding docs
└── reference-docs/              ← Client-specific reference materials
```

## Customization Points

Every engagement is different. The framework is designed to be customized at these points:

| What to Customize | How | When |
|-------------------|-----|------|
| AI tools | Different clients use different tools — adjust training and playbooks | Govern phase |
| SDLC processes | Map to client's actual processes, not generic ones | Design phase |
| KPIs | Select based on executive priorities and data availability | Baseline phase |
| Training content | Use client's real stories/code in hands-on exercises | Train phase |
| Compliance | Map to client's specific regulatory environment | Govern phase |
| Dashboard views | Configure for what the executive wants to see | Pilot phase |

## Reusable Assets

These assets transfer across engagements:

- Framework structure (8 phases)
- Assessment instrument (customize questions for context)
- Training track structure (customize content for tools)
- Measurement methodology (DORA, SPACE, QUS, DevEx)
- Playbook template structure
- tools.ussp.co platform
- This guide

---

**End of Guide**

Return to [Table of Contents](README.md)
