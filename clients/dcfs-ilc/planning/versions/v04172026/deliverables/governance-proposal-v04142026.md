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

## 3. Two-Phase Governance Model

Governance scales with risk. The pilot carries lower risk (2 teams, bounded scope). Full ART-wide rollout requires formal governance. This is aligned with NIST AI RMF GOVERN 2 (governance proportional to risk) and DoIT AI Policy Section 4 (agency-level oversight).

### Phase A: Pilot Governance Team (During Pilot)

Lightweight team — enough to make day-to-day decisions for the pilot. Minimum DCFS representation required.

| Role | Responsibility | Filled By |
|------|---------------|-----------|
| **Pilot Governance Lead** (DCFS) | Day-to-day governance decisions. Approves pilot scope, tools, guardrails. Reports to CIO. | DCFS designee |
| **CIO** (Sponsor) | Executive authority. Approves pilot launch. Available for escalations. Receives weekly summary. | Agency CIO |
| **AI Transformation Leader** (Vendor) | Presents risk register, metrics, issues. Recommends — does not approve. | Delivery vendor |
| **Engagement Director** (Vendor) | Presents program status, contractual alignment. | Delivery vendor |

**Scope:** Pilot only (2 teams). Cannot approve ART-wide decisions.
**Cadence:** Weekly (45 min) during pilot.
**Authority:** Approve pilot-scope changes, tool access, training, guardrail adjustments. Can halt pilot on safety concerns.

### Phase B: Full AI Governance Team (Post-Pilot, for Scale)

Established by the CIO after pilot results are reviewed. This is the permanent governance body that approves playbooks, scale decisions, and ongoing AI oversight.

| Role | Responsibility | Filled By |
|------|---------------|-----------|
| **CIO** (Sponsor) | Executive authority. Approves scale decisions, tool additions, policy changes. | Agency CIO |
| **AI Governance Chair** (DCFS) | Leads meetings. Drives agenda. Tracks action items. | DCFS designee |
| **Program Director** (DCFS) | Ensures AI aligns with agency priorities and program compliance (e.g., CCWIS). | DCFS designee |
| **Security / Compliance Representative** (DoIT) | Data classification, policy interpretation, security controls, incident review. | DoIT designee |
| **Data Privacy Officer** (DCFS) | Sensitive data boundaries (child welfare, PII, regulatory data). | DCFS designee |
| **Business Representative** (State) | Ensures AI serves the agency mission, not just delivery efficiency. | State PO or program lead |
| **AI Transformation Leader** (Vendor) | Presents risk register, monitoring data, pilot results, playbooks, scale recommendations. **Reports to — does not sit on — the governance team.** | Delivery vendor |
| **Engagement Director** (Vendor) | Presents program status, contractual alignment, resource commitments. | Delivery vendor |

**Scope:** All teams. Approves playbooks, scale rollout, new tools, policy changes.
**Cadence:** Monthly (60 min) at scale. As-needed for incidents.
**Authority:** Full — approve scale, approve playbooks, add/remove tools, modify guardrails, halt AI use.

### Transition: Pilot → Full Governance

| Step | What Happens | When |
|------|-------------|------|
| 1 | Pilot completes. Results compiled. | End of pilot PI |
| 2 | Pilot Governance Lead presents results + playbooks to CIO. | End of pilot PI + 1 week |
| 3 | CIO establishes Full AI Governance Team — identifies members. | CIO decides timing |
| 4 | Full team reviews and approves playbooks from pilot. | First full team meeting |
| 5 | Full team approves scale plan (or requests changes). | First or second meeting |
| 6 | Scale begins with governance oversight. | Next PI |

**Key principle:** Playbooks are NOT final until the full governance team approves them. The pilot produces drafts. Governance approves the versions that get scaled.

### Why Two Phases

- **NIST AI RMF GOVERN 2:** Governance structures should be proportional to risk. Pilot = lower risk = lighter governance. Scale = higher risk = full governance.
- **DoIT AI Policy Section 4:** Requires agency-level oversight. Pilot Governance Lead (DCFS designee) satisfies this during pilot. Full team satisfies it at scale.
- **Practical:** CIO may not have all governance team members identified yet. Pilot gives time to identify the right people while work progresses.
- **No vendor self-governance:** Even the pilot team has DCFS representation. The vendor presents and recommends — DCFS decides.

---

## 4. Meeting Cadence

| Phase | Team | Frequency | Duration | Focus |
|-------|------|-----------|----------|-------|
| **Pre-Pilot** | Pilot Governance | Weekly | 45 min | Resolve blockers, approve tools, approve pilot teams |
| **During Pilot** | Pilot Governance | Weekly | 45 min | Monitor metrics, review incidents, adjust guardrails |
| **Post-Pilot** | Pilot Governance → CIO | As needed | 60 min | Present results, recommend scale |
| **Scale Setup** | Full Governance | As needed | 60 min | Review playbooks, approve scale plan |
| **Scale Ongoing** | Full Governance | Monthly | 60 min | ART-wide monitoring, ongoing risk management |

---

## 5. Decision Rights

### Pilot Phase (Pilot Governance Team)

| Decision | Who Decides | CIO Approval? |
|----------|------------|---------------|
| Approve pilot team selection | Pilot Governance Lead | Yes |
| Approve training curriculum | Pilot Governance Lead | No (inform) |
| Approve AI Usage Playbook (pilot) | Pilot Governance Lead | Yes |
| Approve each code generation stair-step | Pilot Governance Lead | Yes |
| Modify guardrails (strengthen) | Pilot Governance Lead | No (inform) |
| Modify guardrails (relax) | Pilot Governance Lead | Yes |
| Halt pilot (safety concern) | Pilot Governance Lead or CIO | N/A — either can halt |

### Scale Phase (Full AI Governance Team)

| Decision | Who Decides | CIO Approval? |
|----------|------------|---------------|
| Approve finalized playbooks | Full Governance Team | Yes |
| Approve scale to additional teams | Full Governance Team recommendation | Yes |
| Add new AI tool | Full Governance Team recommendation | Yes + DoIT 30-day notice |
| Modify guardrails (relax) | Full Governance Team recommendation | Yes |
| Expand scope to non-Krasan roles | Full Governance Team | Yes |
| Expand scope to business processes | Not within governance authority | Yes + full risk reassessment |
| Halt AI use (safety concern) | Any member or CIO | N/A — anyone can halt |

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
