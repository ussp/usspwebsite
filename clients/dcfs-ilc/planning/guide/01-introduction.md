---
title: "Introduction"
description: "Why AI transformation, philosophy, and the 8-phase framework"
---

# Chapter 1: Introduction

## The Opportunity

Illinois Connect (ILC) is migrating three legacy systems — SACWIS, CYCIS, and MARS — to a unified CCWIS platform on Microsoft Dynamics 365. Across 12 SAFe product teams and 160+ Krasan consultants, this Agile Release Train (ART) is delivering critical capabilities for the Illinois Department of Child and Family Services (DCFS).

AI is becoming standard for high-performing delivery teams. The State has already invested in **GitHub Copilot** and **Atlassian Rovo**. Teams are delivering well — AI builds on a strong foundation, not a broken one.

## Philosophy

### Amplify, Don't Replace

AI augments the existing team — same people, better tools, more output. There is no workforce reduction. Human-in-the-loop is required on all AI output; no autonomous AI commits. AI assists, the human decides.

### Measure, Don't Guess

Every claim must be backed by data. We establish a baseline before AI is introduced, run a controlled pilot (AI teams vs non-AI teams), and compare results using research-backed measurement frameworks (DORA, SPACE, QUS, Six Sigma).

### Pilot, Then Scale

Start with 2 teams. Select targeted SDLC processes. Measure the impact. Scale what works. This is not a big-bang rollout — it's a disciplined, evidence-based approach.

## The Framework

Krasan is building a structured AI transformation framework for ILC — designed to work within government guardrails while delivering measurable results.

```
Govern → Baseline → Design → Train → Pilot → Measure → Playbook → Scale
```

| Phase | What Happens | Deliverable |
|-------|-------------|-------------|
| **Govern** | Align with DoIT AI Policy, define guardrails, confirm tool access | AI Usage Playbook, Compliance Map |
| **Baseline** | Capture current metrics from JIRA, distribute readiness assessment | Baseline Metrics Report |
| **Design** | Map current state → AI-augmented state for SDLC processes per role | Process Design Docs, Role-Based Playbooks, Training Plan |
| **Train** | Role-specific training: responsible AI use, approved SDLC processes | Training Completion Report |
| **Pilot** | 2 teams use AI tools for 1 full PI; remaining teams are control group | Weekly Check-in Reports |
| **Measure** | Continuous metrics collection; compare pilot vs baseline vs control | Pilot Results Report, Lessons Learned |
| **Playbook** | Codify what worked into living, role-based playbooks | Finalized Playbooks |
| **Scale** | Roll out to all 12 teams based on proven results | ART-Wide Rollout Plan |

## Key Constraints

- **Human-in-the-loop required on all AI output. No autonomous AI commits.** — Developer reviews, edits, and accepts every AI suggestion; peer PR review and approval before commit
- **No PII in AI prompts** — No case data, no child information, no security documentation
- **DoIT AI Policy compliance** — All 12 sections mapped to our compliance approach
- **State-approved tools only** — GitHub Copilot + Atlassian Rovo. No additional tools without state approval
- **Human-in-the-loop** — Every AI output is reviewed by a human before use

## Who This Guide Is For

This guide serves multiple audiences:

- **Executive sponsors** — Understand the framework, review measurement, approve scale decisions
- **AI Transformation Leader** — Execute every phase, build materials, run training, report results
- **Engagement Director** — Manage client relationship, coordinate teams, approve pilot design
- **Team leads / Scrum Masters** — Coach AI adoption, interpret metrics, contribute to playbooks
- **Individual contributors** — Complete training, use AI tools in daily work, provide feedback

## What This Guide Is Not

- It is **not a finished product** — this framework is being built for ILC and will evolve based on pilot learnings
- It is **not a technology manual** — Copilot and Rovo have their own documentation; this guide covers how to apply them within our framework
- It is **not a replacement for the rollout plan** — the [rollout plan](../rollout-plan.md) has specific dates, task owners, and timelines; this guide provides the methodology

---

**Next:** [Chapter 2: Executive Discovery](02-executive-discovery.md) — How to gather organizational context and executive priorities before building the framework
