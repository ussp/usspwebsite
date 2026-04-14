# DCFS ILC — AI Transformation Planning

> **Version:** V04142026
> **Engagement:** Illinois Connect AI-Augmented Agile Delivery
> **Client:** DCFS / DeWitt (Krasan branding)

---

## Quick Access

| Document | What | Open |
|----------|------|------|
| **Project Planner** | Interactive Gantt, risks, assumptions | [project-planner.html](project-planner.html) |
| **Rollout Plan** | Master plan (v4) | [rollout-plan.md](rollout-plan.md) |
| **Presentation** | Slide deck (V04142026) | [presentation/framework-presentation-main.html](presentation/framework-presentation-main.html) |
| **Framework Guide** | 13-chapter Docsify guide | [guide/](guide/) |

---

## Directory Structure

```
planning/
├── rollout-plan.md                    ← Master plan (v4, V04142026)
├── project-planner.html              ← Interactive Gantt + risks + assumptions
│
├── presentation/                     ← Slides & deck
│   ├── slides/                       ← Individual slide HTML files
│   ├── build-presentation.js         ← Build script
│   ├── build-pptx.js                ← PPTX generator
│   ├── framework-presentation.html   ← Full deck (main + appendix)
│   ├── framework-presentation-main.html  ← Main slides only (9 slides)
│   ├── speaker-notes.md             ← Full speaker notes
│   └── speaker-notes-30min.md       ← 30-min condensed version
│
├── deliverables/                     ← Documents for Dave / Jim / governance
│   ├── governance-proposal-v04142026.md
│   ├── code-generation-policy-review.md
│   ├── tool-authorization-list.md
│   ├── measurement-methodology-v04142026.md
│   └── assumptions-and-risks.md
│
├── templates/                        ← Reusable templates
│   ├── team-profile-template.md
│   ├── executive-discovery-questionnaire.md
│   └── pilot-team-selection.md
│
├── research/                         ← Background research & citations
│   ├── methodology-citations.md
│   └── baseline-metrics.md
│
├── meeting-prep/                     ← Meeting-specific materials
│   ├── meeting-prep-apr13.md
│   └── email-romi-tool-request-04142026.md
│
└── guide/                            ← Framework Guide (Docsify site)
    ├── index.html                    ← Serve with: npx serve
    ├── README.md → 13 chapters + 4 appendices
    └── ...
```

## Key Deliverables Status

| # | Deliverable | Status | File |
|---|------------|--------|------|
| 1 | Code generation policy review | **Done** | [deliverables/code-generation-policy-review.md](deliverables/code-generation-policy-review.md) |
| 2 | Tool authorization list | **Done** | [deliverables/tool-authorization-list.md](deliverables/tool-authorization-list.md) |
| 3 | Rollout timeline (Gantt) | **Done** | [project-planner.html](project-planner.html) |
| 4 | Governance proposal | **Done** | [deliverables/governance-proposal-v04142026.md](deliverables/governance-proposal-v04142026.md) |
| 5 | AI policy sharing | **Done** | Sent to Jeffrey/Dinkar |
| 6 | Measurement methodology | **Done** | [deliverables/measurement-methodology-v04142026.md](deliverables/measurement-methodology-v04142026.md) |
| 7 | Framework reassessment (v4) | **Done** | [rollout-plan.md](rollout-plan.md) |
