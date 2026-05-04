# Pair-Programmer Strategy — DCFS ILC AI Rollout

> **Version:** V04222026 (v1.0 draft)
> **Owner:** Vinay Lagisetty + Emil "Romi" Kovacs
> **For review by:** David Nika, Jim Daugherty, Dinkar (Krasan), Pilot Governance Team
> **Status:** DRAFT — **up for discussion** in the Apr 22 meeting. Not a committed approach yet.

---

## 1. Purpose

This document describes how AI-experienced "pair programmers" are used twice in this engagement — first to accelerate the pilot, then to enable scale — turning a one-time hiring investment into the **scale mechanism** for all of ILC.

---

## 2. Concept in one sentence

**Five AI-experienced specialists, one per pilot role, work with the Intact pilot team during the pilot — then redeploy as embedded AI specialists into five other ILC teams after pilot, applying the playbooks developed during the pilot.**

---

## 3. The two-phase model

### Phase 1 — Pilot (May 14 → Jul 20)

**Who:** 5 specialists (1 per pilot role): Tester · SA · BA · Developer · BA-Tech.

**Where:** Embedded in the **Intact pilot team**.

**What they do:**
- **First ~2 sprints (Mode A — co-pilot):** Work side-by-side with the pilot team member using AI tools. Co-create outputs. Shortens learning curve.
- **Remaining sprints (Mode B — coach):** Step back. Pilot team member owns the work; specialist reviews, advises, transfers context. Builds DCFS capability.

**Outputs they help produce:**
- Role-specific AI-usage playbooks (drafted iteratively throughout pilot)
- Prompt libraries per role
- AI-assisted artifacts (stories, tests, code, docs, configuration) with HITL audit trail
- Cross-role patterns and examples (for scale)

**Why this matters for the pilot:**
- Pilot team focuses on learning AI methods without missing sprint commitments
- Accelerates time-to-first-meaningful-output from weeks to days
- Produces a demonstrated playbook (not theoretical) by pilot end

### Phase 2 — Scale Wave 1 (Aug onward)

**Who:** The same 5 specialists.

**Where:** Each specialist embeds in a different non-pilot ILC team — so **5 teams get AI enablement** in the first scale wave.

**What they do:**
- Apply the playbooks that came out of the pilot (not reinventing)
- Work with each team's role counterpart the same way they did in the pilot (co-pilot → coach)
- Identify patterns specific to each team's workflow
- Hand off to a named DCFS team member per role — that person becomes the internal AI champion for their team
- Rotate out of that team and into the next when the embedded role champion is self-sufficient (~2 sprints per team per specialist)

**Why this matters for scale:**
- The same 5 hires cover 5 teams in the first wave without additional hiring
- Playbooks get battle-tested across multiple teams (not just Intact)
- Every team ends up with an internal AI champion — self-sustaining
- Scale speed is constrained by onboarding, not by hiring

### Phase 3 — Scale Wave 2 and beyond (optional)

If Phase 2 proves successful:
- **Option A:** The 5 specialists continue rotating through remaining ILC teams (12 teams total = ~5 more teams in wave 2, remaining in wave 3)
- **Option B:** DCFS internal AI champions from Phase 2 train additional internal champions (no more external resources)
- **Option C:** Second small wave of specialists hired for specialized roles (e.g., data team, if data team uses different tools)

DCFS chooses based on results, budget, and residual risk.

---

## 4. Role definitions

### Pair Programmer / AI Specialist

| Aspect | Detail |
|--------|--------|
| Background | AI-experienced consultant. Proficient with GitHub Copilot + M365 Copilot + Atlassian Rovo + Dynamics 365 Copilot workflows. Has coached teams through AI adoption previously. |
| Reports to | AI Transformation Lead (Vinay) during pilot; Pilot Governance Lead during scale |
| Billed through | Krasan (Dinkar procuring from Krasan bench) |
| DCFS clearance | Required — assume standard clearance cycle |
| Engagement type | Non-touching coaching (no commits, no config changes — pilot team member owns every artifact) |
| Time commitment | Full-time during assigned sprint; rotates to next team after 2 sprints |

### DCFS AI Champion (post-scale)

| Aspect | Detail |
|--------|--------|
| Who | A named DCFS team member per role, identified during Phase 2 embedding |
| Role | Internal AI lead for their team and role after specialist rotates out |
| Responsibilities | Maintain team's AI practice, onboard new team members, escalate issues to Phase B Governance |
| Support | Ongoing office hours from AI Transformation Lead; quarterly community-of-practice |

---

## 5. Exit strategy (how this becomes self-sustaining)

1. **End of Pilot (~Jul 20):** 5 specialists + 5 Intact role members → Intact team is self-sufficient with named DCFS AI champion per role.
2. **End of Phase 2 Wave 1 (~Dec):** 5 specialists + 5 other teams → each team has named DCFS AI champion per role.
3. **Phase 3 (optional):** specialists may rotate to remaining teams or phase out entirely as DCFS champions train additional internal champions.
4. **Sustained state:** DCFS AI Governance Team + 12 internal AI champions run the practice. Specialists have left. Krasan provides advisory / support only.

**Key principle:** The playbook, not the consultant, is the sustainable asset. Consultants are the accelerant.

---

## 6. Resource requirements

### From Krasan / Dinkar

| Phase | Specialists needed | Duration |
|-------|---------------------|----------|
| Pilot | 5 | ~13 weeks (May → Jul) |
| Scale Wave 1 | Same 5 | ~6 months (Aug → Jan) |
| Total commitment | 5 FTE-equivalent | ~9 months if both phases approved |

Hiring velocity: specialists must be onboarded by early May to be effective in Sprint 2.1. Stair-step onboarding is acceptable (1-2 roles first week, remainder over May).

### From DCFS

| Phase | Requirement |
|-------|-------------|
| Pilot | Pilot team member per role available for pairing. DCFS clearance for 5 specialists. |
| Scale Wave 1 | One team member per role per team, identified as AI champion. |
| Ongoing | Phase B Governance team seated to approve playbooks + scale decisions. |

### Budget framing

The **pilot investment is the only new commitment**. Scale usage of the same 5 people is incremental, not new. This makes the pair-programmer model **high-leverage for the pilot investment**.

---

## 7. Risks & mitigations

> **Key constraint to surface honestly:** finding the right AI-experienced specialists is difficult. The profile we need (AI-fluent + role-deep + coaching-capable + government-cleared) is rare. This is a real constraint on hiring velocity and potentially on quality of the specialists we can bring in. It is the single biggest risk to this strategy.

| Risk | Mitigation |
|------|-----------|
| **Hiring the right people is hard** — AI-experienced + role-deep + coaching-capable + cleared is a rare profile | Cast a wide net via Krasan bench first; accept longer ramp-up if needed; fall back to 3-role initial pilot if 5 can't be sourced; may need to hire contract-to-perm rather than pure contract |
| Hiring velocity slip — even if right profile exists, onboarding is slow | Stair-step onboarding (1-2 roles first, remainder rolling); start clearance as soon as Dave approves in principle |
| Specialist quality mismatch — rushed hire = wrong person | Defined skills matrix per role; trial sprint before long-term embedding; replace early if mismatch detected |
| DCFS clearance delays for specialists | Start clearance as soon as Dave approves specialists-in-principle; parallel with baselining |
| Pilot team feels "replaced" not "helped" | Explicit Mode B handoff after first 2 sprints; DCFS team member is always the artifact owner |
| Specialists create dependency (DCFS can't operate without them) | Named internal champion per role; specialist rotates out on a pre-agreed date |
| Scale Wave 1 drags specialists too thin | 2 sprints per team cap; playbook must be primary tool, specialist is accelerant |
| Different team workflows require playbook revision | Specialists feed observations back to AI Transformation Lead weekly; playbooks are living docs |

**If hiring velocity is the binding constraint,** the strategy still works — it just extends the ramp-up. Pilot might start with 3 roles rather than 5; remaining roles join over the first few sprints. DCFS should be prepared for a stair-step model, not all specialists on day one.

---

## 8. Decisions needed

| # | Decision | From | By |
|---|----------|------|-----|
| 1 | DCFS OK with external AI-experienced consultants embedded in Intact pilot team for 13 weeks? | David Nika | Apr 22 meeting |
| 2 | Clearance requirements + timeline for 5 specialists? | David Nika | Within this week |
| 3 | Preferred onboarding order (which role first)? | David + Rina | Before May 5 |
| 4 | Scale Wave 1 approved in principle? (Final go-decision at pilot end) | David + CIO | Apr 22 meeting, subject to pilot results |
| 5 | Post-Wave 1 strategy (Option A / B / C) | DCFS AI Governance Team (Phase B) | End of Wave 1 |

---

## 9. Why this model makes sense for DCFS

1. **Same people, two uses.** The pair-programmer hiring investment for the pilot is also the scale mechanism. No second hiring wave needed for Wave 1.
2. **Battle-tested playbooks.** By end of Wave 1, playbooks are validated across 6 teams (pilot + 5 scale teams), not just 1.
3. **Internal champions per team.** Each scaled team finishes with its own named AI champion per role — 30+ internal champions by end of Wave 1.
4. **Governance-aligned.** Phase B DCFS AI Governance Team approves playbooks before each wave; rotation cadence is manageable.
5. **Exit is clear.** Specialists rotate out team by team; DCFS champions take over. Not a permanent consultant-dependency.
6. **Conservative on commitment.** Pilot is the only current commitment; scale is a decision DCFS makes based on pilot results.

---

## 10. Open assumptions (flag if any change)

- A specialist works full-time on the assigned team during their rotation (not split across 2 teams).
- Pilot team is available for pairing 100% of sprint (not distracted by other work).
- All 5 specialists are Krasan-sourced; no other vendor procurement needed.
- Clearance cycle is standard (similar to Vinay's cycle).
- Phase B DCFS AI Governance Team is seated in time to approve Wave 1 scale.

---

## 11. Version history

| Version | Date | Changes |
|---------|------|---------|
| v1.0 draft | 2026-04-22 | Initial strategy — pilot + scale two-phase model, with rotation mechanics and exit strategy. |
