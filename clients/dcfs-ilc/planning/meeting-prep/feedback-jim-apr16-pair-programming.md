# CIO Feedback — Pair Programming & Resource Augmentation

> **Date:** April 16, 2026
> **From:** Jim Daugherty (CIO)
> **Context:** Feedback during project planning review
> **Documented by:** Vinay Lagisetty

---

## Jim's Feedback

Jim raised a concern about the **15% capacity reduction** during the AI pilot training period. His suggestion:

1. **Pair programming** — pair existing team members with someone who has AI experience during the pilot
2. **Resource augmentation** — bring in additional resource(s) with AI tool experience to work alongside the team
3. **Define the requirements** — what kind of resource? Junior or senior? What skills?

The intent is to **offset the productivity dip** that comes from pulling team members into training while keeping delivery velocity stable.

---

## Analysis

### Resource Requirements (if pursued)

A pair programming partner for this engagement would need:

| Requirement | Detail |
|-------------|--------|
| **AI tool proficiency** | Hands-on experience with GitHub Copilot and/or Atlassian Rovo |
| **Domain awareness** | Understanding of SDLC processes (story writing, testing, code review, config) |
| **Tech stack familiarity** | Dynamics 365, .NET ecosystem, or willingness to learn quickly |
| **Government clearance** | Must pass DCFS background check requirements |
| **Contract alignment** | Must be sourced through Krasan (TOPS subvendor) or approved by DCFS |
| **Availability** | Short-term engagement — 3-4 months during pilot |
| **Level** | Senior preferred — needs to coach, not be coached. A junior resource would increase the bandwidth problem, not reduce it. |

### Constraints That Make This Difficult

1. **Government onboarding timeline** — DCFS/State of Illinois requires background checks, possible clearance processes. Onboarding a new resource takes 2-4 weeks minimum, which eats into the pilot window.

2. **Short engagement duration** — the pilot runs ~3 months (8 sprints). A new resource needs time to understand ILC's codebase, the Dynamics environment, the child welfare domain, and CCWIS compliance context. Realistic ramp-up is 2-3 weeks. That leaves 2 months of productive pairing at best.

3. **Narrow talent pool** — the intersection of "experienced with AI coding tools" + "available for short-term government work" + "can pass DCFS background checks" + "fits Krasan's contract structure" is very small. AI tool experience is common in the private sector but rare in government consulting circles.

4. **Krasan roles only** — the pilot is scoped to Krasan consultants. Adding a resource means Krasan hires or subcontracts, which has budget and contractual implications that need Romi's input.

5. **Domain knowledge gap** — even an AI-experienced developer won't know ILC's business rules, data model, or regulatory constraints. They'd be effective at general Copilot coaching but limited in domain-specific pair programming.

6. **Cost vs. benefit** — a senior AI-experienced consultant for 3-4 months is a significant cost. The pilot is designed to measure whether AI tools improve productivity. Adding a resource confounds the measurement — was the improvement from AI tools or from the extra person?

### Alternative Approaches

| Alternative | Pros | Cons |
|-------------|------|------|
| **Internal AI champions** — identify 1-2 fast learners from pilot teams early (Sprint 2-3), have them coach peers | No onboarding cost, they know the domain, organic knowledge transfer | Takes time to develop, initially one more thing on Vinay's plate |
| **Vinay as pair partner** — during early sprints, Vinay pairs with team members on their first AI-assisted tasks | Already the AI expert, knows the tools and the engagement | Single-person bottleneck gets worse, Vinay is already overloaded |
| **Staggered onboarding** (current plan) — roles come online sequentially, so the bandwidth hit is spread across 6 sprints | Already built into the plan, no additional cost | Doesn't fully address Jim's concern about capacity |
| **Extended sprint capacity** — negotiate with Romi/POs to reduce sprint commitments by 10-15% during pilot | Honest about the investment, no additional resource needed | Stakeholders may resist reduced delivery |
| **Async AI coaching** — recorded training + prompt libraries + cheat sheets so team members self-serve | Scalable, no scheduling overhead | Less effective than live pairing for complex tasks |

### Recommendation

**Short-term (pilot):** Don't pursue external resource augmentation for the pilot. The onboarding time, government constraints, and measurement confounding make it impractical for a 3-month window. Instead:

1. **Identify AI champions early** (add to WBS 5, Sprint 2-3) — watch for team members who pick up the tools quickly and naturally help others
2. **Vinay pairs during initial sprints** — dedicate time in Sprint 2 and Sprint 3 for hands-on pairing with BA-Tech and Dev teams respectively
3. **Negotiate capacity adjustment** — work with Romi to set expectations with POs that pilot sprints will have ~10-15% reduced velocity

**Long-term (scale, WBS 8+):** If the pilot proves successful and the CIO approves scale to all 12 teams, THEN the resource augmentation question becomes real. At scale, it may make sense to bring in 1-2 AI coaching resources to support the Wave 2 rollout. The pilot will have produced playbooks, prompt libraries, and trained champions who can help onboard new resources faster.

---

## Open Questions

1. **Does Krasan have budget for a short-term AI resource?** — Discuss with Romi
2. **What is DCFS background check timeline for new resources?** — Discuss with Dave
3. **Would Jim accept AI champions from within the team as the pairing model?** — Follow up with Jim
4. **Can sprint capacity be formally adjusted during pilot?** — Discuss with Romi and POs

---

## Action Items

| Action | Owner | Target |
|--------|-------|--------|
| Discuss resource budget with Romi | Vinay | Week of 4/21 |
| Add "Identify AI champions" task to WBS 5 | Vinay | In planner |
| Add "Vinay pairing sessions" to Sprint 2-3 notes | Vinay | In planner |
| Follow up with Jim on champion model as alternative | Vinay/Dave | Next meeting |
| Update R10 (risk register) with Jim's feedback | Vinay | In planner |

---

*This document captures Jim's feedback for the record. Decisions on resource augmentation are pending discussions with Romi (budget) and Dave (government constraints).*
