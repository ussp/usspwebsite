# Pilot Governance Charter — DCFS ILC AI Rollout

> **Version:** v0.3 — 2026-04-28 — Minor changes to §9 Escalation Path
> **Owner:** Pilot Governance Lead (DCFS designee — TBD)
> **For review by:** David Nika, Jim Daugherty, Romi Kovacs, Vinay Lagisetty, pilot team leads
> **Reviewed:** 2026-04-28 — Emil Romulus Kovacs / Jeffrey Lobo (Krasan / DCFS)
> **Scope:** Pilot phase only (Sprints PI 6.2.1 → PI 6.2.5, Intact team, 5 roles)

---

## 1. Purpose

This charter defines how pilot governance **operates** — who meets, when, what they review, what they decide, what they track, and what artifacts come out. It is the working rulebook for the pilot phase (Sprints PI 6.2.1 → PI 6.2.5, ending on or about July 20, 2026).

Phase B (DCFS AI Governance Team for scale) has a separate charter — defined when that team is seated.

---

## 2. Scope

### In scope for pilot governance

- **Pilot team:** Intact (1 team, 5 roles — Tester, Solution Architect, Business Analyst, Developer, Testing Services Lead)
- **Tools:** GitHub Copilot, Atlassian Rovo, M365 Copilot, D365 Copilot (subject to authorization)
- **Activities:** AI-assisted story writing, acceptance criteria, test generation, code explanation/refactoring, documentation, configuration
- **Boundaries:** SDLC acceleration only — no business logic, domain, or workflow changes
- **Compliance envelope:** DoIT AI Policy (Apr 1, 2025) + NIST AI RMF 1.0 + DCFS data regs (CANTS, CCWIS, FERPA, HIPAA)

### Out of scope for pilot governance

- Scaling decisions (those require Phase B — full DCFS AI Governance Team)
- New tools beyond the 4 authorized
- Changes to agency-level AI policy
- Anything touching DCFS case data, PII, or protected state data

---

## 3. Governance team composition

Recommended minimum viable — 3 DCFS voting seats, plus 2 vendor roles attending as non-voting / ex officio advisors:

| Role | Name | Status |
|------|------|--------|
| Pilot Governance Lead | *DCFS designee* | **TBD** (pending David's confirmation) |
| Executive Sponsor | Jim Daugherty (DCFS CIO) | Confirmed |
| Security & Privacy Lead *(combines security + data privacy for pilot)* | *DCFS designee* | **TBD** |
| AI Transformation Lead *(non-voting / ex officio)* | Vinay Lagisetty (Krasan) | Confirmed |
| Engagement Director *(non-voting / ex officio)* | Emil "Romi" Kovacs (Krasan) | Confirmed |

**DoIT:** external policy liaison, not a team member. Compliance reports sent up per DoIT AI Policy §4.

---

## 4. Meeting cadence

| Meeting | Frequency | Duration | Purpose |
|---------|-----------|----------|---------|
| **Pilot Governance Weekly** | Every Tuesday | 45 min | Review pilot progress, approve changes, clear blockers |
| **Incident response** | As needed | 30 min | Safety / compliance incidents — triggered by Pilot Governance Lead |
| **Mid-pilot checkpoint** | ~Jun 17, 2026 | 60 min | Assess pilot health against 15% productivity target; adjust if needed |
| **Pilot closeout** | ~Jul 20, 2026 | 60 min | Present results + draft playbooks to Phase B team (once seated) |

---

## 5. Weekly meeting — what gets reviewed

Each weekly Pilot Governance meeting covers these items. Target time per item in parentheses. The metrics dashboard runs bi-weekly; all other items run every meeting.

### 5.1 Metrics dashboard (10 min, **bi-weekly**)
- Bi-weekly delta on active baseline metrics (see §7).
- Flag any metric trending wrong direction (>10% decline from baseline).
- No deep-dive — that's for mid-pilot checkpoint.

### 5.2 AI output quality spot check (10 min)
- Sample 3–5 AI-assisted artifacts from the week (1 story, 1 test, 1 doc, 1 code snippet).
- Check: HITL review happened? Quality acceptable? Any drift from guardrails?
- Record findings in Spot Check Log (see §7.4).

### 5.3 Risks & blockers (10 min)
- Review risk register changes since last week.
- New risks flagged by pilot team or AI Transformation Lead.
- Action owners + due dates for any mitigation.

### 5.4 Change requests (5 min)
- Any pilot team request for: new tool, guardrail adjustment, scope expansion, training tweak.
- **Approve / defer / deny** in the meeting — do not carry over.
- Log in Change Request Register (see §7.5).

### 5.5 Compliance check (5 min)
- DoIT AI Policy compliance status — any gap surfaced this week?
- **Explicit check — any prompt-drift incidents?** PII, case data, CANTS/CCWIS references, or out-of-scope content in prompts or AI output.
- Audit trail spot check (JIRA transitions + GitHub PR history).
- Bias / fairness spot check (are AI suggestions reflecting any pattern we should flag?).

### 5.6 Action items + next week (5 min)
- Confirm owner + due date for anything new.
- Preview next week (training schedule, sprint boundaries, vendor arrivals).

---

## 6. Decisions in scope for pilot governance

| Decision | Authority |
|----------|-----------|
| Approve pilot-scope changes | Pilot Governance Lead (requires CIO for scope expansion) |
| Approve tool access additions within authorized set | Pilot Governance Lead |
| Approve guardrail adjustments | Pilot Governance Lead (log reason + impact) |
| Approve training content changes | Pilot Governance Lead + AI Transformation Lead |
| Halt pilot on safety / compliance concerns | Pilot Governance Lead (notify CIO within 24 hr) |
| Extend pilot timeline | CIO only (Pilot Governance Lead recommends) |
| Add a new tool outside authorized set | CIO only (requires DoIT 30-day notice) |
| Approve a different pilot team / roles | CIO only |

---

## 7. What we track (artifacts + metrics)

### 7.1 Active pilot metrics

**Final metric set will be locked at the Develop stage of the pilot, prior to Sprint 1 kickoff. Candidate families:**

| Family | Metrics |
|--------|---------|
| Delivery | sprint velocity · cycle time · throughput · sprint predictability |
| Quality | story quality score (QUS) · story rejection rate · first-pass yield · test coverage · defect density |
| Efficiency | story review cycle time · test creation time · documentation coverage |
| Team health | SPACE survey (5-dim) · requirement clarity · AI tool satisfaction |

**Measurement philosophy:** tangible outputs, not story points. Before/after pilot vs. baseline + control teams.

### 7.2 Risk register

Maintained by the AI Transformation Lead and reviewed weekly in §5.3 (internal working document).

### 7.3 AI tool usage data

**During pilot:** Read directly from tool admin dashboards (GitHub Copilot, Atlassian Rovo, Microsoft 365 Copilot, Dynamics 365 Copilot). Includes prompt counts, acceptance/rejection rates, and per-user activity. Tool dashboards satisfy DoIT AI Policy §7 monitoring and documentation requirements; no separate manual log required during pilot.

Prompt-drift incidents (PII, case data near-miss, out-of-scope output) are captured via the escalation path in §9 and reviewed in §5.5 Compliance check.

> **Flag for full rollout:** If DoIT or DCFS determines that a formal, structured AI usage log is required when the program scales beyond pilot (Phase B — ART-wide rollout), it will be designed and implemented at that time. Not in scope for pilot.

### 7.4 Spot check log

For each weekly sample (see §5.2):
- Artifact type (story / test / doc / code)
- Reviewer
- HITL verification ✅ / ⚠ / ❌
- Quality grade (1–5)
- Notes / learnings

### 7.5 Change request register

For each CR raised in §5.4:
- Date raised
- Requested by
- Nature of change
- Decision (approve / defer / deny)
- Decision rationale
- Implemented date

### 7.6 Compliance evidence

Kept in the "DCFS AI Rollout" Teams channel (shared tab):
- Training completion records (all pilot participants)
- AI disclosure acknowledgments
- Guardrail doc sign-offs
- DoIT 30-day notice + any correspondence
- Per-sprint audit trail exports

---

## 8. Pilot team → governance channel

| Channel | When | Who |
|---------|------|-----|
| Pilot team daily stand-up flag | Anything urgent (safety, blocker) | Pilot team members → Pilot Governance Lead via AI Transformation Lead |
| Weekly report in | Mon EOD before Tue governance meeting | AI Transformation Lead |
| Incident report | Within 1 hour of event | Pilot team member → AI Transformation Lead → Pilot Governance Lead |

---

## 9. Escalation path

| Trigger | Who notifies | Who decides | Within |
|---------|--------------|-------------|--------|
| Data leak, PII in prompt, case data near-miss | Pilot team members → AI Transformation Lead → Pilot Governance Lead | CIO | 1 hour |
| Tool vendor breach / safety issue | AI Transformation Lead → Pilot Governance Lead | CIO + DoIT | 4 hours |
| Metric trends significantly wrong (>20% decline) | AI Transformation Lead | Pilot Governance Lead → CIO | Weekly meeting |
| Pilot team resistance / morale issue | RTE + pilot team lead (scrum lead) → Engagement Director | Pilot Governance Lead + CIO | Next weekly |
| Scope creep request from pilot team | Pilot team → AI Transformation Lead | Pilot Governance Lead (CIO if outside authority) | Next weekly |

---

## 10. End-of-pilot handoff to Phase B

| # | What | When |
|---|------|------|
| 1 | Pilot closes; results compiled | ~Jul 20, 2026 |
| 2 | Pilot Governance Lead presents pilot results + draft playbooks to Phase B team | ~Jul 27, 2026 |
| 3 | Phase B reviews / approves / requests revisions on playbooks | First Phase B meeting |
| 4 | Scale plan approved (or revised) | First or second Phase B meeting |
| 5 | Scale begins with Phase B oversight | Next PI |

**Key dependency:** Phase B (full DCFS AI Governance Team) must be seated **by ~Jul 1, 2026** — otherwise scale decisions slip past the pilot window.

---

## 11. Document artifacts (to be maintained)

| Artifact | Owner | Cadence | Location |
|----------|-------|---------|----------|
| Pilot Governance Charter (this document) | Pilot Governance Lead | As needed | Teams channel |
| Weekly meeting minutes | Pilot Governance Lead | Weekly | Teams channel |
| Risk register | AI Transformation Lead | Weekly | Internal working document |
| AI tool usage data | AI Transformation Lead | Weekly | Pulled from tool admin dashboards |
| Spot check log | Pilot Governance Lead | Weekly | Teams channel |
| Change request register | Pilot Governance Lead | Per CR | Teams channel |
| Compliance evidence | AI Transformation Lead + Pilot Governance Lead | Ongoing | Teams channel (shared tab) |
| Metrics dashboard | AI Transformation Lead | Weekly auto-refresh | Dedicated dashboard |

---

## 12. Sign-off

| Role | Name | Signed | Date |
|------|------|--------|------|
| Executive Sponsor | Jim Daugherty (DCFS CIO) | | |
| Interim AI Lead | David Nika (Deputy CIO, Data Management) | | |
| Pilot Governance Lead | *DCFS designee — TBD* | | |
| Engagement Director | Emil "Romi" Kovacs (Krasan) | | |
| AI Transformation Lead | Vinay Lagisetty (Krasan) | | |

---

*This charter is a working document. Update as pilot operations evolve.*
