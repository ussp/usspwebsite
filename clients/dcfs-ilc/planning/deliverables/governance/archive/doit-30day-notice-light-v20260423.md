# 30-Day Notice to DoIT — Light Version (1-Page)

> **Purpose:** Short 1-page memo for David to share tomorrow. Conveys the essentials DoIT needs under §5f without appendix detail. Pair with the **detailed version** (`doit-30day-notice-detailed-v04222026.docx`) as supporting material if requested.
> **Who signs:** Jim Daugherty (DCFS CIO).
> **Draft owner (final):** DCFS policy lead (to be named).
> **Version:** V04222026 (v0.1 light)

---

# MEMORANDUM

**TO:** [FILL — DoIT AI Policy contact]
**FROM:** Jim Daugherty, Chief Information Officer, Illinois Department of Children and Family Services (DCFS)
**DATE:** [FILL]
**SUBJECT:** 30-Day Advance Notice — AI-Augmented SDLC Pilot on Illinois Connect
**REFERENCE:** DoIT AI Policy §5f (effective April 1, 2025)

---

## 1. Notice

Pursuant to DoIT AI Policy §5f, DCFS provides 30-day advance notice of an AI-augmented software development lifecycle (SDLC) pilot on the Illinois Connect (ILC) program. The pilot begins no earlier than 30 calendar days after DoIT's receipt of this notice.

## 2. AI systems

- **GitHub Copilot** (State-licensed) — developer code assistance
- **Atlassian Rovo** (State-licensed) — story/test assistance for business analysts and testers
- **Microsoft 365 Copilot** (licensing pending) — document/SDD assistance for architects
- **Dynamics 365 Copilot** (licensing pending) — platform-developer configuration assistance

## 3. Scope

- One product team (Intact), five roles, approximately 10 sprint weeks (Sprints PI 6.2.1 through PI 6.2.5), with post-pilot measurement and playbook finalization continuing through August.
- Purpose: SDLC acceleration (story authoring, test generation, code suggestion, documentation).
- **Out of scope:** business-logic decisions, case-handling workflows, interaction with protected data.

## 4. Data scope (§5e determination)

The AI systems will operate on:
- ILC source code (.NET / TypeScript / plugins / APIs / logic apps / function apps)
- JIRA stories and acceptance criteria
- Internal documentation (SDDs, Confluence, Visio diagrams)
- Configuration artifacts (Dynamics solution exports, Power Automate flows)

**Agency Head determination:** These artifacts do **not** contain protected state data, case data, or PII, and therefore do not constitute "State data for AI purposes" under §5e. No AI system will interact with DCFS case data, CANTS, CCWIS records, or PII.

## 5. Controls

- **Human-in-the-loop** on 100% of AI output (developer reviews/edits/accepts each suggestion; peer PR review before any commit). (§4d, §5d, §6)
- **No protected data in prompts** — enforced by training, guardrails, and per-sprint spot checks. (§4b, §4f)
- **Transparency** — written disclosure to all pilot participants; AI-assisted artifacts labeled. (§5a–c)
- **Governance** — DCFS-led Pilot Governance Team, weekly oversight; DCFS AI Governance Team (minimum 3 seats) stood up during pilot. (Aligned with NIST AI RMF GOVERN 2 + DoIT §4)
- **Audit trail** — JIRA transitions, GitHub PR history, weekly governance minutes.
- **Bias mitigation** — weekly spot checks; corrective action logged. (§4a, §11)
- **Incident reporting** — established path with 1-hour CIO notification on any data-boundary concern. (§12)

## 6. Certification

I have reviewed the assessment and approve the proposed AI deployment under the controls documented herein. Detailed assessment and supporting materials are available on request.

| Signature | Date |
|-----------|------|
| _________________________________ | [FILL] |
| Jim Daugherty, CIO, DCFS | |

**Earliest deployment-start date:** DoIT receipt date + 30 calendar days.

## 7. Point of contact

David Nika, Deputy CIO, DCFS — David.Nika@illinois.gov

---

*Detailed assessment available on request — see `doit-30day-notice-detailed-v04222026` for compliance map, governance structure, risks, and mitigations.*
