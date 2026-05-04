# Code Generation Policy Review — Illinois DoIT AI Policy

> **Purpose:** Review whether the State of Illinois DoIT AI Policy prohibits or restricts AI-assisted code generation, and identify open questions for the team.
> **Action Item:** From April 13 Jim Daugherty meeting — "Review the state AI policy specifically regarding code generation and send open-ended questions about any restrictions."
> **Owner:** Vinay Lagisetty
> **Date:** April 13, 2026

---

## Finding: The Policy Does NOT Prohibit Code Generation

After reviewing all 12 sections of the DoIT AI Policy (effective April 1, 2025), **there is no explicit prohibition on AI-assisted code generation.** The "no autonomous code generation" constraint was a self-imposed Krasan guardrail — not a policy requirement.

Jim Daugherty confirmed this in the April 13 meeting: *"This constraint was accidental."*

---

## What the Policy Actually Requires

| Policy Section | Requirement | Impact on Code Generation | Compliant? |
|---------------|-------------|--------------------------|------------|
| **4d — Human in the Loop** | "AI Systems shall NOT make decisions autonomously. Must have 'human in the loop' for all decisions." | Copilot suggests code; developer reviews, edits, accepts/rejects. **Human decides.** | **Yes** — standard code review process satisfies this |
| **5a — Approved Tools** | Only state-approved AI tools | GitHub Copilot is state-purchased. Need to confirm formal approval status. | **Likely yes** — verify with Dave |
| **5b — Training** | Staff must be trained before using AI tools | Developer track in our training plan covers this | **Yes** — covered in framework |
| **5c — Data Classification** | No protected data in AI prompts | Source code is not PII. But: does ILC code contain embedded data references? | **Needs review** — see Question 3 |
| **5d — AI Output Review** | All AI-generated output must be reviewed by human before use | Code review process (peer review + PR approval) satisfies this | **Yes** — standard SDLC practice |
| **5e — State Data for AI** | If "State data" is used for AI purposes, requires written Agency Head consent | **Open question:** Does Copilot accessing ILC source code = "State data for AI"? | **Needs CIO clarification** |
| **5f — Assessment & Notice** | 30-day notice + AI System Assessment Report before new AI deployment | Has this been filed for Copilot? If not, 30-day gate applies | **Needs CIO clarification** |
| **6 — Incident Response** | Must have process for AI-related incidents | Framework includes per-sprint spot checks and incident reporting | **Yes** — covered |
| **7 — Continuous Monitoring** | Ongoing AI oversight required | tools.ussp.co provides continuous monitoring | **Yes** — covered |

---

## What Code Generation Looks Like Under the Policy

With human-in-the-loop compliance, AI-assisted code generation works like this:

```
Developer writes prompt or context → Copilot suggests code → Developer reviews suggestion
  → Developer accepts, modifies, or rejects → Code goes through standard code review
    → Peer reviewer approves → Code is committed
```

**At no point does AI autonomously commit code.** Every line is:
1. Suggested by AI
2. Reviewed by the developer
3. Reviewed by a peer
4. Committed by a human

This satisfies Section 4d (human-in-the-loop) and Section 5d (AI output review).

---

## Approach: AI-Assisted Code Generation from Day One with HITL

AI-assisted code generation is in scope from day one under mandatory human-in-the-loop (HITL). The developer reviews, edits, and accepts every AI suggestion, and every change goes through standard peer PR review and approval before commit. No autonomous AI commits. This satisfies DoIT Policy sections 4d (human in the loop) and 5d (AI output review).

Prerequisites for any developer using AI-assisted code generation:
- Training completed for the role
- Guardrails understood and acknowledged
- Code review process in place (peer PR review + approval)
- Governance team informed

---

## Open Questions for the Team

### For Dave (Interim AI Lead) / Jim (CIO)

1. **Section 5e — State Data:** Does Copilot accessing ILC source code (Dynamics 365 plugins, Power Apps, configuration) constitute "State data for AI purposes"? If yes, we need written Agency Head consent before the pilot.

2. **Section 5f — Assessment Status:** Has the DoIT AI System Assessment Report been filed for GitHub Copilot and/or Atlassian Rovo? If not, when can it be filed? (30-day gate from filing date.)

3. **Tool Approval Status:** Is GitHub Copilot formally approved under Section 5a, or is it just purchased? Is there a difference in the DoIT process?

### For Jeffrey / Dynamics Experts (Kashif, Shyam)

4. **Configuration vs Code:** In the Dynamics 365 context, is AI-assisted configuration generation treated the same as code generation? Does the platform have its own AI features (e.g., Copilot for Dynamics) that are already approved?

5. **Source Code Sensitivity:** Does the ILC source code contain embedded references to sensitive data (case IDs, PII patterns, security configs)? This affects whether Section 5c (data classification) applies to code generation prompts.

6. **Code Review Process:** What is the current code review process for ILC? PR-based? Peer review? Automated checks? We need to confirm it satisfies Section 5d.

### For Governance Team

7. **Governance Approval:** Should code generation be explicitly approved by the governance team before introduction, or does it fall under the existing pilot scope approved by Jim?

8. **Incident Definition:** What constitutes an "incident" for AI-generated code? Options:
   - AI suggests code with a security vulnerability (caught in review)
   - AI-generated code passes review but causes a production defect
   - AI suggestions contain patterns from external/proprietary code

9. **Audit Trail:** Does the state require an audit trail of which code was AI-assisted vs human-written? If so, how do we track this?
well
### For Dave — Continuous Monitoring & Tooling

10. **Continuous Monitoring Tools:** DoIT Section 7 and NIST MEASURE 3 both require continuous AI oversight. Can we use JIRA dashboards and Power BI for pilot metrics tracking? Are there other state-approved monitoring tools available?

11. **Monitoring Tool Options within State Environment:**

| Option | What It Does | Likely Available? | Approval Needed? |
|--------|-------------|-------------------|-----------------|
| JIRA dashboards | Native reporting — velocity, cycle time, quality | Yes (already in use) | No |
| Power BI | Dashboards from JIRA data for leadership visibility | Likely (standard state tool) | Verify |
| Azure Monitor / App Insights | Built into Azure — track AI tool usage | Likely (Dynamics 365 is Microsoft) | Verify |
| Azure DevOps dashboards | If used alongside JIRA | Possible | Verify |
| Excel / SharePoint | Manual tracking, state-approved | Yes | No |
| tools.ussp.co (Krasan platform) | AI Transformation Monitor — assessments, reports, dashboards | External tool — needs state approval + DoIT 30-day notice | Yes |

**Recommendation:** Start with JIRA dashboards + Power BI (already approved, no procurement). Position tools.ussp.co as an optional enhancement through the governance team approval process later.

12. **External Tool Approval:** If we want to use tools.ussp.co for monitoring, does it require DoIT 30-day notice under Section 5f? Or is it treated differently since it's a vendor reporting tool, not an AI system being deployed to state employees?

### Microsoft Dynamics 365 AI Capabilities (Research Finding)

**Dynamics 365 has built-in AI/Copilot features that may already be available or licensable:**

| Capability | What It Does | Relevance to ILC | Availability in GCC |
|-----------|-------------|-------------------|-------------------|
| **Copilot for Dynamics 365** | Conversational AI embedded in D365 apps — summaries, case routing, record management | Direct — caseworker productivity, case management | Available in GCC (must be manually enabled) |
| **Power Automate Copilot** | Draft entire workflows from plain English | High — care workflows, intake processes, case transitions | Available |
| **Dataverse AI-assisted data mapping** | Automates legacy data import and transformation rules | High — SACWIS/CYCIS/MARS data migration | Available (2025 Wave 2) |
| **Power Apps model-driven Copilot** | Natural language interaction with app data, UI scaffolding | Medium — case management dashboards | GA April 15, 2026 |
| **AI Builder Document Processing** | Extract data from case files, assessments, court docs (90%+ accuracy) | High — child welfare document processing | Available |
| **Copilot-assisted expression editing** | Generate/fix Power Automate expressions without manual code | Medium — workflow configuration | Available (2025 Wave 1) |
| **Dataverse prompt columns** | Auto-populate fields (case summaries, risk assessments) | Medium-High — case processing | Available |
| **Process Mining** | AI-powered root cause analysis of workflow bottlenecks | Medium — identify config gaps | Available |

**Critical for State of Illinois:**
- Copilot apps in GCC Dataverse are **NOT enabled by default** — admin must manually install
- M365 Copilot licensing: $30/user/month on top of base D365 licensing
- GCC-High has M365 Copilot (launched Dec 2024)

**Key question for Jeffrey/Kashif/Shyam:** Are any of these Dynamics 365 AI features already enabled in the ILC environment? If not, what's needed to activate them? This could be a faster path to AI augmentation than GitHub Copilot for the configuration team.

**Impact on pilot:** If Dynamics 365 Copilot is available, the Configuration Team has a native AI tool — no need for GitHub Copilot for their workflows. This changes the tool matrix:

| Role | Primary AI Tool |
|------|----------------|
| BA-Technical | Rovo (JIRA AI) |
| Configuration Team | **Dynamics 365 Copilot / Power Platform AI** |
| Development Team | GitHub Copilot |
| Testers | Copilot + Rovo |
| Scrum Master | Rovo |

---

### For Gartner (External Validation — Jim's Request)

13. **Industry Practice:** What are other state/government agencies doing with AI code generation? What guardrails have they established?

14. **Risk Framework:** What does Gartner recommend as the governance framework for AI-assisted code generation in government settings?

---

## Recommendation

**Proceed with AI-assisted code generation from day one under mandatory HITL.** The DoIT policy supports AI code generation with human-in-the-loop. The key blockers are administrative (Section 5e/5f clarifications), not policy prohibitions.

**Immediate actions:**
1. Send Questions 1-3 to Dave/Jim for resolution
2. Send Questions 4-6 to Jeffrey for the Dynamics working session
3. Send Questions 10-12 to Dave for monitoring tool clarification
4. Include code generation in the governance proposal (Task #4)
5. Include HITL-governed code generation in the pilot plan from sprint 1
6. Default to JIRA + Power BI for monitoring until external tools are approved

---

## Policy Reference

Full DoIT AI Policy summary: `reference-docs/doit-ai-policy-summary.md`
Full compliance map: `guide/appendix-b-doit-policy-map.md`
NIST AI RMF governance: `guide/03b-nist-ai-rmf-governance.md`
