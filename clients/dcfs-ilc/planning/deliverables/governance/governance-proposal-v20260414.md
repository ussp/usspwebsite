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

### Phase B: DCFS AI Governance Team (Stood up DURING Pilot, for Scale)

Established by DCFS during the pilot — not after. Recommended **as a range**, not a fixed team size, so DCFS can start immediately with minimum-viable and grow.

#### Minimum Viable (3 DCFS seats) — can start immediately

| Role | Responsibility | Filled By |
|------|---------------|-----------|
| **CIO** (Sponsor) | Executive authority. Approves scale decisions, tool additions, policy changes. | DCFS CIO |
| **AI Governance Chair** *(combines Chair + Program oversight)* | Leads meetings. Drives agenda. Tracks action items. Ensures AI aligns with agency priorities and CCWIS. | DCFS designee |
| **Security & Privacy Lead** *(combines Security + Data Privacy)* | Data classification, policy interpretation, security controls, incident review, PII boundaries — for DCFS systems (CANTS, CCWIS, FERPA, HIPAA). | DCFS designee |

This satisfies NIST AI RMF GOVERN minimums and DoIT AI Policy §4 agency-oversight requirements. **DCFS can seat this in days, not weeks.**

#### Expanded (adds 3 DCFS seats) — add as pilot matures or before scale

| Role | Responsibility | Filled By |
|------|---------------|-----------|
| **Program Director** | Dedicated CCWIS / program alignment (split from Chair when volume warrants). | DCFS designee |
| **Data Privacy Officer** | Sensitive data boundaries — split from Security when scale introduces more data surfaces. | DCFS designee |
| **Business Representative** | Ensures AI serves the agency mission, not just delivery efficiency. | DCFS PO or program lead |

#### Vendor (always)

| Role | Responsibility | Filled By |
|------|---------------|-----------|
| **AI Transformation Leader** | Presents risk register, monitoring data, pilot results, playbooks, scale recommendations. **Reports to — does not sit on — the governance team.** | Delivery vendor |
| **Engagement Director** | Presents program status, contractual alignment, resource commitments. | Delivery vendor |

**Why a range:** different orgs have different bench depth. MVG lets DCFS start today, not after 6 designees are identified. Roles split (Chair/Program, Security/Privacy) only when volume or complexity warrants it.

**DoIT relationship:** external liaison for state-wide AI policy. DoIT sets the policy framework (DoIT AI Policy effective Apr 1, 2025); this team operates *under* that framework and reports compliance up to DoIT. DoIT is **not a team member**.

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
| Sample AI-assisted PRs per sprint for HITL adherence | Pilot Governance Lead | No (inform) |
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

## 11. Phase B Charter — What It Should Include (Forward-Looking)

The Phase B charter — the operating document for the full DCFS AI Governance Team at scale — will be written when Phase B is seated. Pilot learnings should feed directly into it. The charter should incorporate, at minimum:

### 11.1 Controls that scale differently than pilot

| Pilot approach (process-based) | Scale approach (technical + process) |
|--------------------------------|---------------------------------------|
| Tool admin dashboards for AI usage monitoring | Formal AI usage log — structured, auditable, exportable (if DoIT requires) |
| Spot checks for PII / case data drift | Technical PII detection controls — Microsoft Purview DLP policies for Copilot, GitHub Copilot content exclusion rules, automated prompt scanning |
| Escalation path via Teams channel (1-hour CIO notification) | Formalized incident reporting system with ticketing and SLA tracking |
| Training + playbook sign-off per pilot participant | Org-wide AI use certification with periodic re-verification |

### 11.2 Governance items to revisit at scale

- **Membership** — expand Phase B from MVG (3 seats) to full (6 seats): Program Director, Data Privacy Officer, Business Representative.
- **Cadence** — move from monthly 60-min to scaled cadence (monthly full team + weekly operating-level sub-committees).
- **Decision rights** — revise matrix for ART-wide decisions: tool additions, guardrail changes, scope expansion.
- **Reporting to DoIT / Maximus** — establish formal reporting templates beyond ad-hoc updates.

### 11.3 Capture these pilot-phase learnings when drafting Phase B charter

- **Explicit PII monitoring in weekly compliance check** — included in Pilot Governance Charter §5.5. Carry forward as a named checkpoint in Phase B weekly/monthly review.
- **Tool usage from dashboards** — works for pilot; DoIT may require formal manual log at scale. Phase B team to determine.
- **Escalation path** — pilot model is lightweight (1-hour CIO notification). Scale may require tiered escalation with ticketing.
- **Audit trail** — JIRA + GitHub history covers pilot. At scale, add automated log aggregation (SIEM or equivalent).
- **Training recertification** — pilot runs one-time training. Scale should require periodic (e.g., annual) recertification for all AI tool users.

### 11.4 Open items for Phase B to resolve (by end of pilot)

- Does DoIT require a formal AI usage log once we scale beyond pilot? (Flagged in Pilot Governance Charter §7.3 for Phase B to resolve.)
- Do we need Microsoft Purview or an equivalent DLP tool for prompt-level PII protection?
- How does the team handle new AI tools as they emerge (approval process, re-assessment cycle)?
- How is scaling paced — team-by-team, role-by-role, or all-at-once?

---

## Attachments (available upon request)

- Full NIST AI RMF governance mapping: `guide/03b-nist-ai-rmf-governance.md`
- DoIT AI Policy compliance map: `guide/appendix-b-doit-policy-map.md`
- Code generation policy review: `code-generation-policy-review.md`
- Tool authorization list: `tool-authorization-list.md`
- Assumptions & risks register: `assumptions-and-risks.md`
- AI Transformation Framework presentation: `framework-presentation.html` (V04142026)
