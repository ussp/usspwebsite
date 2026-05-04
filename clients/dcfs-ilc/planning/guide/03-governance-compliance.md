---
title: "Governance & Compliance"
description: "DoIT AI Policy alignment, guardrails, and regulatory mapping"
---

# Chapter 3: Governance & Compliance

## Purpose

Before any AI tool is used, the framework must be aligned with the client's regulatory and policy environment. For State of Illinois engagements, this means full compliance with the DoIT AI Policy and any agency-specific constraints.

## When This Happens

- **Phase:** Govern
- **Timing:** Before baseline measurement or training
- **Deliverable:** AI Usage Playbook & Compliance Map

## DoIT AI Policy — Overview

The State of Illinois Department of Innovation & Technology (DoIT) AI Policy (effective April 1, 2025) has 12 sections that govern AI use across state agencies. Every section must be mapped to our compliance approach.

### Compliance Map

| # | DoIT Section | Requirement | Our Approach | Status |
|---|-------------|-------------|-------------|--------|
| 1 | Purpose & Scope | Applies to all state AI use | Framework applies only to SDLC processes — no business process automation | Covered |
| 2 | Definitions | AI system classification | Copilot and Rovo are "AI-assisted tools" — human-in-the-loop | Covered |
| 3 | Responsible AI Principles | Transparency, fairness, accountability | Training includes responsible AI module; all outputs human-reviewed | Covered |
| 4 | AI Governance Structure | Agency-level oversight | Engagement Director + AI Transformation Leader provide oversight | Covered |
| 5a | Approved AI Tools | Only state-approved tools | Copilot + Rovo only — no additional tools without state approval | Covered |
| 5b | AI Training Requirements | Staff must be trained | Foundation track covers policy compliance for all pilot participants | Covered |
| 5c | Data Classification | Data handling rules | No PII, no case data, no security docs in any AI prompt | Covered |
| 5d | AI Output Review | Human review required | All AI output reviewed by human before use — documented in playbooks | Covered |
| 5e | State Data for AI | Written consent for state data | Needs clarification: does Copilot on ILC code = "state data for AI"? | Needs CIO |
| 5f | Assessment & Notice | 30-day notice + assessment | Must confirm if Copilot/Rovo have been assessed; if not, 30-day gate | Needs CIO |
| 6 | Incident Response | AI-related incident handling | Framework includes bias/quality spot checks per sprint | Covered |
| 7 | Continuous Monitoring | Ongoing AI oversight | AI Transformation Monitor (tools.ussp.co) provides continuous tracking | Covered |

### Blockers Requiring CIO Input

Two sections require executive confirmation before the pilot can start:

1. **Section 5e — State Data for AI:** Does Copilot accessing ILC source code constitute "State data for AI purposes"? If yes, requires written Agency Head consent + 30-day DoIT notice.

2. **Section 5f — Assessment & Notice:** Has the DoIT AI System Assessment been filed for Copilot and/or Rovo? If not filed, earliest pilot start = 30 days after filing.

## DCFS-Specific Guardrails

These are non-negotiable constraints for the DCFS engagement:

| Guardrail | Detail |
|-----------|--------|
| **Human-in-the-loop required on all AI output. No autonomous AI commits.** | Developer reviews, edits, and accepts every AI suggestion; peer PR review and approval before commit. Documented in every playbook. |
| **AI for SDLC only** | All targeted processes are delivery processes (story writing, testing, coding, docs). Zero business process automation. |
| **No child information shared** | "No PII" rule in every playbook. Training module. Per-sprint spot checks. |
| **No security documentation** | Security plans excluded from all AI tool contexts. Team is trained on boundaries. |
| **Only state-approved tools** | Copilot + Rovo + Confluence AI. No additional tools without state approval. |
| **Human-in-the-loop** | Every AI-generated output is reviewed, edited, and approved by a human before use. |

## Regulatory Considerations

DCFS operates under multiple regulatory frameworks beyond DoIT:

| Regulation | Relevance | Our Compliance |
|-----------|-----------|---------------|
| IL Rule 431 | DCFS administrative rules | AI does not touch case decisions or child welfare processes |
| CANTS (Child Abuse & Neglect Tracking) | Sensitive data system | No CANTS data in any AI prompt |
| 42 CFR Part 2 | Substance abuse records | Excluded from all AI contexts |
| FERPA | Educational records | Excluded from all AI contexts |
| HIPAA | Health information | No health data in AI prompts |
| IRS Pub 1075 | Federal tax information | Excluded from all AI contexts |
| CCWIS Final Rule (45 CFR 1355) | Federal child welfare IT standards | AI augmentation does not affect CCWIS certification; modules remain compliant |

## Deliverable: AI Usage Playbook

The governance phase produces an **AI Usage Playbook** that is distributed to all pilot participants. It includes:

1. **Approved tools** — What you can use (Copilot, Rovo) and what you cannot
2. **Data boundaries** — What data can and cannot be entered into AI tools
3. **Output rules** — All AI output must be reviewed by a human before use
4. **Incident reporting** — What to do if AI produces inappropriate output
5. **Compliance checklist** — Per-sprint verification that guardrails are being followed

## Governance Checklist

Before proceeding to Baseline:

- [ ] DoIT AI Policy — all 12 sections reviewed and mapped
- [ ] CIO confirmed: Section 5e (state data) interpretation
- [ ] CIO confirmed: Section 5f (assessment/notice) status
- [ ] DCFS-specific guardrails documented and approved
- [ ] AI Usage Playbook drafted
- [ ] Regulatory considerations documented
- [ ] Tool access confirmed (Copilot licenses, Rovo access)

---

**Next:** [Chapter 4: Readiness Assessment](04-readiness-assessment.md) — Formal survey instrument for all teams
