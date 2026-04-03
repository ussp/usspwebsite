# DCFS Illinois Connect (ILC) — AI Productivity Initiative

> **Client:** Department of Child and Family Services (State of Illinois)
> **Project:** Illinois Connect (ILC) — Legacy-to-Dynamics 365 Modernization
> **Prime Vendor:** Crescent (Krasan Consulting Services)
> **USSP Role:** AI Strategy & Measurement (subcontractor under Crescent)
> **Engagement Start:** April 2026

---

## Quick Links

| Resource | Location |
|----------|----------|
| Meeting Notes | `meeting-notes/` |
| Rollout Plan (due Apr 17) | `planning/rollout-plan.md` |
| Playbooks (in progress) | `playbooks/` |
| Onboarding Docs | `onboarding/` |
| AI Transformation Tool | `packages/ai-tools/` (tools.ussp.co) |
| OpenSpec (measurement framework) | `docs/openspec-ai-transformation.md` |
| AI Tools User Guides | `docs/ai-tools/` |

---

## Engagement Summary

CIO Jim Doherty has requested an AI rollout plan across 12 SAFe product teams (160 Crescent consultants) to achieve a **5% productivity improvement**. USSP is providing AI strategy, measurement, and training under Crescent.

### Scope

- **12 product teams** in a SAFe ART working on child welfare modernization
- **Phase 1 roles:** Business Analysts, Testers, Developers, Data team
- **Approved tools:** GitHub Copilot, Atlassian Rovo (JIRA AI), Confluence
- **Approach:** Pilot → Measure → Playbooks → Full Rollout

### Key Constraints

- No autonomous code generation (firm state boundary)
- Must comply with State of Illinois / DoIT AI policy
- Only state-approved AI tools (no external tools without rigorous approval)
- GitHub Copilot purchased but not yet deployed to teams

---

## Key People

| Person | Role | Organization |
|--------|------|-------------|
| Jim Doherty | CIO (executive sponsor, client) | DCFS / DeWitt |
| Dinkar | Executive sponsor | Crescent |
| Romi | Delivery Engagement Director | Crescent |
| Vinay | AI Lead | USSP |
| Chase | Data Architect | Crescent |
| John | Agile Delivery Manager | Crescent |
| Matt | RTE (Release Train Engineer) | Crescent |
| Robert | Agile Workforce Manager | Crescent |
| Darren | Chief Solution Architect | State of Illinois |

---

## Timeline

| Date | Milestone |
|------|-----------|
| 2026-04-03 | Kickoff meeting (this document) |
| 2026-04-08 | Romi meets Jim — Vinay access clearance |
| 2026-04-07 week | 2x planning meetings + Vinay onboarding |
| **2026-04-17** | **Rollout plan due** |
| End of April | Pilot team selection, training materials ready |
| 2026-05-05 to 07 | PI Planning — present plan to Jim |
| May–July 2026 | Pilot PI execution (AI vs non-AI teams) |
| End of Pilot PI | Results, playbooks, rollout recommendation |

---

## Folder Structure

```
clients/dcfs-ilc/
├── README.md                    ← This file
├── meeting-notes/
│   └── 2026-04-03-kickoff.md   ← Full kickoff meeting notes
├── planning/
│   ├── rollout-plan.md          ← Due Apr 17
│   ├── baseline-metrics.md      ← Measurement baseline definition
│   ├── pilot-team-selection.md  ← Pilot participants
│   ├── executive-discovery-questionnaire.md ← Interview guide for Jim
│   └── methodology-citations.md ← Research backing for every metric
├── reference-docs/
│   ├── 20250401-DoIT-AI Policy-v2- A11Y.pdf ← State of Illinois AI Policy
│   ├── doit-ai-policy-summary.md  ← Actionable summary of policy constraints
│   └── DCFS AI Rollout Plan.docx  ← Client-shared rollout plan document
├── playbooks/
│   ├── ba-playbook.md           ← Business Analyst AI playbook
│   ├── tester-playbook.md       ← Tester AI playbook
│   ├── developer-playbook.md    ← Developer AI playbook
│   └── data-playbook.md         ← Data team AI playbook
└── onboarding/
    └── vinay-onboarding.md      ← Context gathering checklist
```
