# 30-Day Notice to DoIT — Starting Draft

> **Purpose:** Short, signature-ready memo that satisfies **DoIT AI Policy §5f** (AI System Assessment Report + Agency Head signoff + 30-day advance notice to DoIT).
> **Who signs:** Jim Daugherty (DCFS CIO, Agency Head). David Nika (Deputy CIO) can coordinate filing.
> **Format:** ~2 pages. Attach supporting docs as exhibits.
> **Status:** Starting draft — fill in [FILL] fields and adjust to DCFS house style before sending.
> **Version:** V20260428 (v0.2)
> **Change vs v0.1 (Apr 22):** Added Zephyr Scale Agent for Atlassian Rovo as a fifth covered tool — surfaced in the Apr 24 testing-workflow walkthrough as the highest-value tester acceleration. Same data envelope as Rovo (no scope expansion). §1, §2, §3, §9 updated. Light-version companion updated in lockstep (`doit-30day-notice-light-v20260428.md`).

---

## How to use this

1. Fill in `[FILL]` fields (dates, DoIT contact name, filing method).
2. Jim reviews + signs.
3. Email to DoIT with attachments listed in §9.
4. **30-day clock starts the day DoIT confirms receipt.**
5. Retain signed copy in DCFS records (SharePoint + Teams AI Rollout channel).

---

# MEMORANDUM

**TO:** [FILL — DoIT AI Policy Office / Named contact]
**FROM:** Jim Daugherty, Chief Information Officer, Illinois Department of Children and Family Services (DCFS)
**DATE:** [FILL]
**SUBJECT:** AI System Assessment Report and 30-Day Advance Notice — Illinois Connect AI-Augmented Agile Delivery Pilot
**REFERENCE:** State of Illinois DoIT Policy on the Acceptable and Responsible Use of Artificial Intelligence (effective April 1, 2025), §5f

---

## 1. Purpose

Pursuant to DoIT AI Policy §5f, this memorandum serves as DCFS's **AI System Assessment Report** and **30-day advance notice** of intended AI system deployment on the Illinois Connect (ILC) program.

DCFS proposes to deploy AI-assisted software development tools — **GitHub Copilot** and **Atlassian Rovo** (already licensed by the State), with **Microsoft 365 Copilot**, **Dynamics 365 Copilot**, and **Zephyr Scale Agent for Atlassian Rovo** pending licensing confirmation — for a bounded SDLC-acceleration pilot beginning no earlier than 30 days after DoIT's receipt of this notice.

---

## 2. AI System(s) Being Deployed

| Tool | Purpose | Status |
|------|---------|--------|
| GitHub Copilot (Business/Enterprise tier) | Developer code assistance — plugins, APIs, logic apps, function apps | Already State-licensed |
| Atlassian Rovo | Business analyst + tester assistance — story quality, acceptance criteria, test drafts | Already State-licensed |
| Microsoft 365 Copilot | Solution architect + BA-tech assistance — SDD, Word, Visio, SharePoint workflow | Pending licensing confirmation |
| Dynamics 365 Copilot | Platform developer assistance — Dynamics configuration workflows | Pending licensing confirmation |
| Zephyr Scale Agent for Atlassian Rovo | Tester + Testing Services Lead assistance — generates test cases from acceptance criteria and writes them directly into Zephyr Scale folders linked to JIRA stories (extends Rovo; replaces manual paste from a JIRA comment). Same data envelope as Rovo — no expansion of data scope. | Licensing scoping with Atlassian / SmartBear |

---

## 3. Scope of Use

- **Pilot team:** Intact product team (one of twelve ILC product teams) — 5 roles participating (Solution Architect, Business Analyst, Platform Developer, Senior Tester, Testing Services Lead).
- **Duration:** Pilot runs approximately 10 weeks (Sprints PI 6.2.1 through PI 6.2.5, ending on or about July 20). Post-pilot measurement and playbook finalization continue through August; scale recommendation issued in early September.
- **Purpose:** Accelerate the software development lifecycle (SDLC) — story authoring, test generation, code suggestion, documentation drafting, configuration assistance.
- **Out of scope:** Business-logic decisions, case-handling workflows, interaction with protected data.

---

## 4. Data Scope (DoIT Policy §5e determination)

AI tools will operate on the following categories of agency artifacts:

| Data category | AI interaction | Justification |
|---------------|----------------|---------------|
| DCFS case data, CANTS, CCWIS case files | **None** | Prohibited by policy §4f; enforced by training and spot checks |
| Personally identifiable information (PII) | **None** | Prohibited; enforced by training and technical controls |
| ILC source code (.NET, TypeScript, plugins, APIs, function apps) | **Yes** | Source code contains no protected state data or PII. **Agency Head determination:** ILC source code does NOT constitute "State data for AI purposes" under §5e |
| JIRA stories and acceptance criteria | **Yes** | Describe system behavior; no case data |
| Internal documentation (SDDs, Confluence, Visio) | **Yes** | No protected data per existing documentation standards |
| Configuration artifacts (Dynamics solution exports, Power Automate flows) | **Yes** | No protected data in configuration definitions |

**Agency Head position on §5e:** The Agency Head has determined that AI tool operation on ILC source code, JIRA stories, documentation, and configuration artifacts — as scoped above — does not require additional written consent for "State data for AI purposes," because none of these artifacts contain protected state data or PII.

---

## 5. Assessment Findings

### 5.1 Projected benefits
- Measured productivity improvement in SDLC activities (target: 10–15% on tangible outputs).
- Reduction in manual effort on documentation, repetitive coding, and test authoring.
- Foundation for scalable AI adoption across the broader ILC program.

### 5.2 Risks identified (ranked)
| Risk | Severity | Mitigation |
|------|----------|-----------|
| Protected data entering AI prompts | Critical | Training, spot checks, incident reporting, per-sprint audit trail |
| Bias in AI suggestions | High | Bias awareness training; weekly spot-check review |
| Vendor-side breach | High | Enterprise-tier tools only; zero-retention contracts |
| Over-reliance on AI outputs | Medium | Mandatory human review; peer review; quality scoring |

### 5.3 Controls in place
- **Human-in-the-loop on 100% of AI output** — every AI suggestion is reviewed, edited, or rejected by the assigned developer before acceptance; peer PR review is mandatory before any AI-assisted code is committed (§4d, §5d, §6).
- **No protected data in prompts** — enforced by training, explicit guardrails in the AI Usage Playbook, and per-sprint spot checks (§4b, §4f).
- **Transparency** — all pilot participants receive written disclosure of AI use; AI-assisted deliverables are labeled (§5a–c).
- **Audit trail** — JIRA state transitions, GitHub PR history, and weekly governance minutes preserve a complete record (§7).
- **Bias mitigation** — weekly spot checks with corrective action logged; mandatory bias-awareness training (§4a, §11).
- **Security reporting** — incident reporting path established in Teams channel; escalation to CIO within 1 hour of any data-boundary breach (§12).

---

## 6. Governance

DCFS has established a two-phase governance model aligned with **NIST AI Risk Management Framework 1.0** and DoIT AI Policy §4:

- **Phase A (Pilot):** Pilot Governance Team — DCFS-led, weekly 45-minute review cycle, with authority to approve pilot-scope changes, guardrail adjustments, and incident response. Seats: Pilot Governance Lead (DCFS), Executive Sponsor (CIO), optional Security & Privacy observer (DCFS).
- **Phase B (Scale):** Full DCFS AI Governance Team — to be stood up during the pilot; approves playbooks, scale decisions, policy changes. Minimum 3 seats (CIO, Governance Chair + Program, Security & Privacy Lead), expandable to 6 as scale warrants.

Krasan (delivery vendor) reports to and recommends; does not sit on either governance body.

---

## 7. Conclusions

Based on the assessment:

1. The proposed AI deployment is **narrowly scoped** (SDLC acceleration on a single product team, five defined roles).
2. **No protected state data or PII** will be processed by AI tools under the controls documented herein.
3. **Mandatory human-in-the-loop review** is enforced on 100% of AI outputs.
4. **Governance and audit controls** are proportional to risk and aligned with NIST AI RMF and DoIT §4.
5. The deployment is **recommended for approval** under the conditions described in §4–6.

---

## 8. Agency Head Certification

I, **Jim Daugherty, Chief Information Officer, Illinois Department of Children and Family Services**, have reviewed this AI System Assessment Report. The findings and conclusions are accurate to my knowledge. I approve the proposed AI deployment under the conditions and controls documented herein, and I provide this notice to DoIT at least thirty (30) calendar days in advance of tool deployment, pursuant to §5f.

| Signature | Date |
|-----------|------|
| _________________________________ | [FILL] |
| Jim Daugherty, CIO, DCFS | |

**Earliest deployment-start date:** 30 calendar days after DoIT receipt of this notice: **[FILL — receipt date + 30 days]**

---

## 9. Attachments (for DoIT file)

1. **DoIT AI Policy Compliance Map** — section-by-section mapping of §§4a, 4b, 4d, 4f, 5a–c, 5d, 5e, 5f, 6, 7, 11, 12 to our operational controls. *(`compliance-map-v04222026.pdf`)*
2. **Governance Structure Proposal** — two-phase DCFS-led governance model aligned with NIST AI RMF. *(`governance-proposal-v04142026.pdf`)*
3. **Pilot Governance Charter** — weekly operating rules, agenda, escalation paths, tracked artifacts. *(`pilot-governance-charter-v04222026.pdf`)*
4. **Code Generation Policy Review** — HITL enforcement detail on AI-assisted code generation. *(`code-generation-policy-review.pdf`)*
5. **Tool Authorization List** — full tool inventory, tier requirements, model approvals. *(`tool-authorization-list.pdf`)*
6. **Rollout Plan** — full plan (baseline → pilot → playbook → scale) with measurement methodology. *(`rollout-plan-v6.1.pdf`)*

---

## 10. Point of contact

For questions or additional information, please contact:

- **Primary:** David Nika, Deputy CIO, DCFS — David.Nika@illinois.gov
- **Copy:** Jim Daugherty, CIO, DCFS

---

*End of memorandum.*

---

## Internal prep notes — NOT part of the notice sent to DoIT

### Questions for David to resolve before final filing

1. **Format:** Is this memo structure acceptable to DCFS legal/policy, or does DCFS have a prior-precedent template we should conform to?
2. **Owner:** Who inside DCFS drafts the final version — Krasan (Vinay) with DCFS review, or a DCFS compliance/policy person?
3. **Submission channel:** Email to a named DoIT contact? DoIT portal? Signed PDF via inter-agency mail?
4. **§5e position:** Is Jim's §5e determination incorporated here (§4 of this memo) sufficient, or does it need a separate written attestation?
5. **Timing:** Is the 30 calendar days a hard gate for all pilot activity, or can baselining + training proceed in parallel during the 30-day window?
6. **Revisions:** Can we start the 30-day clock with v0.1 and revise during the window, or must the report be final-signed when submitted?
7. **Precedent:** Has DCFS submitted any prior AI notices under this policy (April 2025 onward) that we can reference for consistency?

### Version history

| Version | Date | Changes |
|---------|------|---------|
| v0.1 | 2026-04-22 | Initial drafting. Memo format per §5f. Pending David's validation. |
| v0.2 | 2026-04-28 | Added Zephyr Scale Agent for Atlassian Rovo as a fifth covered tool (surfaced in Apr 24 testing-workflow walkthrough — highest-value tester acceleration). Same data envelope as Rovo, so §4 data scope unchanged. §1 (Purpose), §2 (AI Systems), and §9 reference list updated. Light-version companion `doit-30day-notice-light-v20260428.md` updated in lockstep. |

### How to convert to Word / PDF for submission

```bash
# From planning/deliverables/
pandoc doit-30day-notice-starting-draft-v04222026.md \
  -o doit-30day-notice-v04222026.docx

# Or direct to PDF via LaTeX (if installed)
pandoc doit-30day-notice-starting-draft-v04222026.md \
  -o doit-30day-notice-v04222026.pdf \
  --pdf-engine=xelatex
```

---

## Email cover for sending this memo

**To:** [FILL — DoIT AI Policy contact]
**Cc:** David Nika; Jim Daugherty; Romi (Krasan); Vinay (Krasan)
**Subject:** DCFS — AI System Assessment Report and 30-Day Advance Notice (DoIT AI Policy §5f) — Illinois Connect AI Pilot

Dear [FILL],

Pursuant to DoIT AI Policy §5f, please find attached DCFS's AI System Assessment Report and 30-day advance notice of intended AI system deployment on the Illinois Connect program.

The pilot is narrowly scoped (one product team, five roles, approximately 10 sprint weeks with post-pilot measurement through August), operates on code/story/documentation artifacts only (no protected state data), and is governed by a two-phase DCFS-led model aligned with NIST AI RMF and DoIT §4.

Kindly confirm receipt so we can log the 30-day clock start. The earliest deployment-start date will be 30 calendar days following your confirmation.

Supporting documents are attached (compliance map, governance proposal, pilot charter, code generation policy review, tool authorization list, rollout plan).

Please direct any questions to David Nika (Deputy CIO) at David.Nika@illinois.gov or to me.

Respectfully,

**Jim Daugherty**
Chief Information Officer
Illinois Department of Children and Family Services
