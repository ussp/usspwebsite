# AI Tool Authorization List — DCFS Illinois Connect

> **Status:** DRAFT — Living document, updated as tools are identified
> **Owner:** Vinay Lagisetty
> **Action Item:** From April 13 Jim meeting — "Compile a list of additional AI tools beyond Copilot/Rovo. Assess audit functionalities for potential procurement."
> **Last Updated:** April 14, 2026

---

## How This List Works

This is a running inventory of all AI tools being considered, evaluated, or approved for the ILC engagement. As we conduct working sessions (Jeffrey, Kashif, Shyam, Chase) and discover new capabilities, tools are added here. The governance team reviews and approves tools before deployment.

**Approval path:** Identify → Evaluate → Governance Team Review → DoIT 30-day notice (if required) → Deploy

---

## Category 1: State-Purchased / Already Available

These tools are purchased by the State. Deployment status needs confirmation.

| Tool | Vendor | Purpose | Roles | Deployed? | Audit Capability | Notes |
|------|--------|---------|-------|-----------|-----------------|-------|
| **GitHub Copilot** | Microsoft/GitHub | Code suggestions, code review, documentation | Developers | **Unknown — verify with Dave** | Usage telemetry via GitHub admin | State purchased but not confirmed deployed to ILC teams |
| **Atlassian Rovo** | Atlassian | JIRA AI — story quality, search, summarization | BA-Technical, Testers, SM | **Unknown — verify** | Atlassian admin analytics | Available with JIRA Cloud; confirm ILC has access |
| **Confluence AI** | Atlassian | Documentation assistance, summarization | All | **Likely available** | Part of Confluence analytics | Bundled with Confluence Cloud |

---

## Category 2: Microsoft Platform AI (Built into Dynamics 365 / Power Platform)

These may already be available as part of the Dynamics 365 / Power Platform licensing. **Key question for Jeffrey/Kashif working session.**

| Tool | What It Does | Roles | Available in GCC? | Additional License? | Status |
|------|-------------|-------|-------------------|-------------------|--------|
| **Copilot for Dynamics 365** | Conversational AI in D365 — summaries, case routing, record mgmt | Configuration, All | Yes (must be manually enabled) | M365 Copilot $30/user/mo | **Needs evaluation** |
| **Power Automate Copilot** | Draft workflows from natural language | Configuration | Yes | Included in Power Platform | **Needs evaluation** |
| **Dataverse AI Data Mapping** | Automate legacy data import/transformation rules | Data Team, Configuration | Yes (2025 Wave 2) | Included | **Needs evaluation** |
| **Power Apps Model-Driven Copilot** | Natural language interaction with app data | Configuration | GA April 15, 2026 | M365 Copilot $30/user/mo | **Needs evaluation** |
| **AI Builder Document Processing** | Extract data from case files, assessments, court docs (90%+ accuracy) | Data Team | Yes | AI Builder credits or add-on | **Needs evaluation** |
| **Copilot-Assisted Expression Editing** | Generate/fix Power Automate expressions | Configuration | Yes (2025 Wave 1) | Included in Power Platform | **Needs evaluation** |
| **Dataverse Prompt Columns** | Auto-populate fields (summaries, risk assessments) | Configuration | Yes | Included | **Needs evaluation** |
| **Process Mining** | AI-powered workflow bottleneck analysis | SM, Configuration | Yes | Power Automate Process Mining license | **Needs evaluation** |

---

## Category 3: Additional Tools to Evaluate

Tools that may provide value but need investigation and procurement.

| Tool | Vendor | Purpose | Why Consider? | Audit Capability | Status |
|------|--------|---------|-------------|-----------------|--------|
| **Azure DevOps Copilot** | Microsoft | Work item suggestions, PR summaries | If teams use ADO alongside JIRA | Azure admin telemetry | **To investigate** |
| **Copilot for Security** | Microsoft | Security review of code/config | Jim mentioned audit tools | Security Center logs | **To investigate** |
| **Power BI Copilot** | Microsoft | Natural language data analysis, dashboard creation | Leadership dashboard, measurement reporting | Power BI admin analytics | **To investigate** |
| **Microsoft Copilot Studio** | Microsoft | Build custom AI agents for team-specific tasks | Could create ILC-specific assistants | Studio analytics | **To investigate** |

---

## Category 4: Monitoring & Measurement Tools

Tools for tracking the pilot and continuous monitoring (DoIT Section 7 / NIST MEASURE 3).

| Tool | Type | Purpose | Available? | Approval Needed? |
|------|------|---------|-----------|-----------------|
| **JIRA Dashboards** | Native | Sprint metrics, velocity, cycle time, quality | Yes (in use) | No |
| **Power BI** | State tool | Leadership dashboards from JIRA data | Likely yes | Verify |
| **Azure Monitor / App Insights** | Native | Track AI tool usage within Azure environment | Likely (D365 is Microsoft) | Verify |
| **Excel / SharePoint** | State tool | Manual tracking, data collection | Yes | No |
| **tools.ussp.co** | External (Krasan) | AI Transformation Monitor — assessments, reports | Needs state approval | Yes — DoIT 30-day notice? |

---

## Category 5: Explicitly NOT Approved

Tools that are out of scope for this engagement.

| Tool | Why Not |
|------|---------|
| ChatGPT (OpenAI) | Not state-approved; data privacy concerns |
| Claude (Anthropic) | Not state-approved |
| Google Gemini | Not state-approved |
| Any open-source LLM | No state vetting, no audit trail |
| Any tool requiring PII/case data | Violates DCFS data boundaries |

---

## Tool-to-Role Matrix (Draft)

Based on current understanding — will be refined after working sessions.

| Role | Primary Tool | Secondary Tool | Platform AI |
|------|-------------|---------------|-------------|
| BA-Technical | Rovo (JIRA AI) | Confluence AI | — |
| Configuration Team | **D365 Copilot (TBD)** | Power Automate Copilot | Power Platform AI |
| Development Team | GitHub Copilot | — | — |
| Testers | Copilot | Rovo | — |
| Scrum Master | Rovo | Power BI Copilot (TBD) | — |
| Data Team | Dataverse AI Mapping (TBD) | AI Builder (TBD) | Power Platform AI |
| Leadership | Power BI dashboards | — | — |

---

## Open Questions

1. **GitHub Copilot:** Is it deployed to ILC teams? If not, what's the timeline? (Ask Dave)
2. **Rovo:** Is Rovo enabled on ILC JIRA Cloud? (Ask Dave/Matt)
3. **D365 Copilot:** Is it enabled in the ILC Dataverse instance? (Ask Jeffrey/Kashif)
4. **Power Platform AI:** Which Power Platform AI features are currently active? (Ask Jeffrey/Kashif)
5. **M365 Copilot licensing:** Does the State have M365 Copilot licenses? At $30/user/mo, what's the budget? (Ask Dave)
6. **AI Builder credits:** Does the State have AI Builder credits for document processing? (Ask Jeffrey)
7. **Procurement process:** For tools not yet purchased, what's the state procurement timeline? (Ask Dave)
8. **DoIT 30-day notice:** Which of these tools require a DoIT 30-day notice before deployment? (Ask Dave)

---

## Next Steps

1. Share this draft with Dave for initial review
2. Refine during Jeffrey/Kashif/Shyam working session (Dynamics capabilities)
3. Refine during Chase session (data team tools)
4. Submit to governance team for formal review
5. Keep updating as new tools are identified

---

*This is a living document. Add tools as they are discovered. Remove tools if they are rejected.*
