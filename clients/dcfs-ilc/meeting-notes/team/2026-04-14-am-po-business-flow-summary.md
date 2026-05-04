# Meeting Summary — DCFS PO/BPR Business Flow Walkthrough

- **Date:** 2026-04-14 (morning)
- **Type:** Team discovery (DCFS)
- **Raw transcript:** [raw/2026-04-14-am-po-business-flow.txt](raw/2026-04-14-am-po-business-flow.txt)
- **Attendees:** Michael Clemons (Lead Product Owner, PO team — DCFS), John Luna (Krasan), Vinay Lagisetty (Krasan)
- **Missing:** Andrew (peer PO lead — sick)
- **Duration:** ~40 min

## Purpose
Understand the PO/BPR workflow feeding JIRA stories to the 12-14 ILC product teams. Identify where AI augmentation fits.

## Key facts captured
- **12-14 product teams**, each aligned to a DCFS vertical; each vertical has multiple functional areas/capabilities.
- Two PO leads: Michael (5 POs) + Andrew (5-6 POs). Each team has one PO.
- BPR origin: pre-2022 discovery with SMEs captured as-is systems + pain points + opportunities (OTI).
- **Toolchain (current):** Visio (swim lanes + annotations) → Excel (pain points/OTI) → Word (SDD) → JIRA (epics/stories) → Confluence (team roadmaps, visual layouts).
- **Source of truth:** JIRA. "If it doesn't exist in JIRA, it's not real."
- **Building blocks** (≈19): Dynamics modules + Adobe, eCAP, REDCap, North52, etc.
- **Capability-based stories:** POs write what the user needs to do; tech team decides how much of Dynamics to leverage vs. extend vs. build custom. POs themselves have low visibility into Dynamics out-of-box modules (~65% coverage estimated before extension).
- **BA role:** Krasan BAs must be well-versed in the functional area (OTI, discovery docs, vision) — this is the rate-limiting input to story quality.
- **PI planning:** Teams try to come in with all stories vetted; often only 4 of 6 sprints fully laid out post-PI.

## Decisions / Outcomes
- None — discovery only.

## Action items
| # | Item | Owner | Notes |
|---|------|-------|-------|
| 1 | Michael's team to surface AI tool ideas for PO/PM workflow | Michael (to John) | Pass to Vinay for tool request list |
| 2 | John to share recording link with Andrew | John | For Andrew to catch up |
| 3 | Vinay to propose AI tool shortlist tailored for POs (Michael explicitly said POs can't self-select) | Vinay | Feed into tool authorization list |

## Findings that affect the plan
- **POs have NO AI subscription today.** We need to include PO/PM tools in the authorization ask (Jim currently only approved Copilot + Rovo for dev teams).
- **Documentation sprawl is real:** Visio + Excel + Word + JIRA + Confluence. Strong opportunity for Microsoft 365 Copilot on the document side (not just GitHub Copilot on code).
- **Story quality is BA-skill-limited**, which directly validates the rollout-plan assumption that BA training is the highest-leverage investment.
- **Michael's suggestion:** AI could correlate similar work across multiple teams (e.g., team A case-handling ≈ team D case-handling) — "best of breed" pattern discovery. Worth adding as a pilot use case.

## People added to directory
- **Michael Clemons** — Lead Product Owner (PO team). Reports into product side; has 5 POs under him. Knowledgeable on Dynamics from prior life. Not PMO.
- **Andrew (last name TBC)** — peer PO lead (5-6 POs). Not met yet.
