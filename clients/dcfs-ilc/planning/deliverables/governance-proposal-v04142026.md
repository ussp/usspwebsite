# AI Governance Structure Proposal — DCFS Illinois Connect

> **Version:** V04142026
> **To:** Dave (Interim AI Lead), Jim Daugherty (CIO)
> **From:** Vinay Lagisetty (AI Transformation Leader, Krasan)
> **Date:** April 14, 2026
> **Reference:** April 13 meeting with Jim — Jim requested a governance structure proposal

---

## 1. Purpose

This proposal establishes the governance structure for AI adoption on the DCFS Illinois Connect (ILC) program, as requested by CIO Jim Daugherty on April 13, 2026. The structure is aligned with the **NIST AI Risk Management Framework (AI RMF 1.0)** and the **State of Illinois DoIT AI Policy** (effective April 1, 2025).

**Core principle:** DCFS governs. Krasan executes and reports.

---

## 2. Why Governance Matters Now

The ILC AI pilot introduces AI tools into a child welfare system modernization — a high-sensitivity domain with regulatory oversight (CANTS, IL Rule 431, FERPA, HIPAA, CCWIS). Before any AI tool is deployed, we need:

- A clear decision-making structure (who approves what)
- Risk identification and tracking
- Compliance verification with DoIT AI Policy
- Human oversight protocols
- Incident response procedures

Jim confirmed in the April 13 meeting that he wants a governance team established, external validation from Gartner, and a documented governance process before the pilot begins.

---

## 3. Proposed Governance Team

### Composition

| Role | Filled By | Responsibility |
|------|-----------|---------------|
| **Sponsor / Chair** | Jim Daugherty, CIO (DCFS/DoIT) | Executive authority. Approves tools, guardrails, scale decisions. Monthly briefing. |
| **Interim Lead** | Dave (designated by Jim) | Day-to-day governance decisions during Jim's absence. First point of contact. |
| **Member** | DCFS Program Director or Deputy CIO | Ensures AI aligns with agency priorities and CCWIS compliance. |
| **Member** | DoIT Security / Compliance Rep | Data classification, DoIT policy interpretation, security controls. |
| **Member** | DCFS Data Privacy Officer | Child welfare data boundaries (CANTS, IL Rule 431, FERPA, HIPAA). |
| **Member** | State Product Owner(s) | Represents the business. Ensures AI serves DCFS mission. |
| **Presenter (invited)** | Vinay Lagisetty (Krasan) | Presents risk register, monitoring data, pilot results. Reports to the team — does not sit on it. |
| **Presenter (invited)** | Romi / Emil Kovacs (Krasan) | Presents program status, contractual alignment, resource commitments. |

### Why This Structure

- **DCFS owns the risk** — the State is accountable for AI deployment per DoIT policy
- **Krasan executes** — we build, train, measure, and report
- **Separation ensures objectivity** — the team doing the work doesn't approve its own decisions
- **Jim remains sponsor** even during absence — Dave acts on his behalf with authority to make day-to-day decisions

---

## 4. Meeting Cadence

| Phase | Frequency | Duration | Focus |
|-------|-----------|----------|-------|
| **Now → PI Planning (Apr 14 – May 5)** | Weekly | 45 min | Establish charter, resolve blockers (5e, 5f, Copilot status), approve tools, approve pilot teams |
| **Pilot (Sprints 1-5)** | Bi-weekly | 45 min | Monitor pilot metrics, review incidents, adjust guardrails |
| **Post-Pilot** | As needed | 60 min | Review results, go/no-go on scale |
| **Scale (if approved)** | Monthly | 45 min | ART-wide monitoring, ongoing risk management |

---

## 5. Decision Rights

| Decision | Who Decides | Jim/Dave Approval? |
|----------|------------|-------------------|
| Approve AI Usage Playbook | Governance team | Yes |
| Approve pilot team selection | Governance team | Yes |
| Approve training curriculum | Governance team | No (inform only) |
| Add new AI tool | Governance team recommendation | Yes + DoIT 30-day notice |
| Modify guardrails (relax) | Governance team recommendation | Yes |
| Modify guardrails (strengthen) | Governance team | No (inform only) |
| Scale to additional teams | Governance team recommendation | Yes |
| Halt pilot (safety concern) | Any governance member or CIO | N/A — anyone can halt |
| Approve code generation step (stair-stepped) | Governance team | Yes (each step approved individually) |

---

## 6. Immediate Blockers Requiring Governance Action

These items were identified in the April 13 meeting and need resolution before the pilot can proceed:

| # | Blocker | Question | Owner | Impact if Unresolved |
|---|---------|----------|-------|---------------------|
| 1 | **DoIT 30-day notice** | Has the AI System Assessment been filed for Copilot and/or Rovo? | Dave/Jim | 30-day delay to pilot start |
| 2 | **Section 5e — State data** | Does Copilot accessing ILC source code = "State data for AI purposes"? | Dave/Jim | Requires written Agency Head consent |
| 3 | **Copilot deployment** | Are licenses purchased? Can they be deployed to ILC teams? Timeline? | Dave | No dev track without Copilot |
| 4 | **Copilot tier** | Which tier — Free/Pro (not appropriate for gov) or Business/Enterprise? | Dave | Data privacy implications |
| 5 | **Dynamics sandbox** | Can we set up a POC environment outside the State for config generation testing? | Dinkar/Dave | No config generation track without it |

---

## 7. Risk Register Summary

Full register maintained in `assumptions-and-risks.md` (V04142026). Summary:

| Severity | Count | Key Items |
|----------|-------|-----------|
| Critical | 2 | PII in AI prompts, State pulls tools mid-pilot |
| High | 6 | 3 are blockers (30-day notice, Copilot deployment, Section 5e) |
| Medium | 7 | AI output quality, team resistance, training capacity impact |
| Low | 2 | Team selection, Gartner availability |
| **Total** | **17** | **3 active blockers** |

---

## 8. Framework Alignment

This governance structure aligns with:

| Framework | How |
|-----------|-----|
| **NIST AI RMF 1.0** | GOVERN 1 (policies), GOVERN 2 (accountability), GOVERN 5 (stakeholders), MANAGE 2 (incidents) |
| **DoIT AI Policy** | Section 4 (governance structure), Section 5f (assessment/notice), Section 6 (incident response), Section 7 (continuous monitoring) |
| **DCFS Guardrails** | Human-in-the-loop, no PII, SDLC only, approved tools only |

Detailed NIST mapping: `guide/03b-nist-ai-rmf-governance.md`

---

## 9. Proposed First Meeting Agenda

**AI Governance Team — Kickoff**
**When:** Week of April 14 (proposed)
**Duration:** 45 minutes

1. **Introductions & charter review** (10 min) — purpose, scope, membership, decision rights
2. **Blocker resolution** (20 min) — DoIT 30-day notice status, Section 5e, Copilot deployment
3. **Tool approval** (10 min) — Review tool authorization list, approve initial toolset
4. **Next steps & cadence** (5 min) — Confirm weekly meetings through PI Planning

---

## 10. What We Need from Dave

1. **Review this proposal** and confirm the structure works
2. **Identify governance team members** — who from DCFS/DoIT should be on the team?
3. **Schedule the kickoff meeting** — week of April 14
4. **Resolve the 3 blockers** — DoIT notice, Section 5e, Copilot status
5. **Confirm Jim's delegation scope** — what can Dave approve vs what needs Jim?

---

## Attachments (available upon request)

- Full NIST AI RMF governance mapping: `guide/03b-nist-ai-rmf-governance.md`
- DoIT AI Policy compliance map: `guide/appendix-b-doit-policy-map.md`
- Code generation policy review: `code-generation-policy-review.md`
- Tool authorization list: `tool-authorization-list.md`
- Assumptions & risks register: `assumptions-and-risks.md`
- AI Transformation Framework presentation: `framework-presentation.html` (V04142026)
