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
| **GitHub Copilot** | Microsoft/GitHub | Code suggestions, code review, documentation | Developers | **Unknown — verify with Dave** | Usage telemetry via GitHub admin | State purchased but not confirmed deployed to ILC teams. **Supports multiple AI models** — see below. |
| **Atlassian Rovo** | Atlassian | JIRA AI — story quality, search, summarization | BA-Technical, Testers, SM | **Unknown — verify** | Atlassian admin analytics | Available with JIRA Cloud; confirm ILC has access |
| **Confluence AI** | Atlassian | Documentation assistance, summarization | All | **Likely available** | Part of Confluence analytics | Bundled with Confluence Cloud |

---

## GitHub Copilot — Multi-Model Support (Jim's Question)

**Jim is correct.** GitHub Copilot now supports multiple AI models — not just OpenAI. Organizations can choose which models their teams use.

### Available Models in GitHub Copilot

| Vendor | Models | Hosted By | Data Privacy |
|--------|--------|-----------|-------------|
| **OpenAI** | GPT-5.4, GPT-4.1 (default), GPT-4o, o1-preview | Azure OpenAI (GitHub-managed) | No training on Enterprise data |
| **Anthropic Claude** | Claude Sonnet 4.6, Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.7 | Anthropic PBC + AWS | **Zero data retention agreement** with Anthropic |
| **Google Gemini** | Gemini 3.1 Pro, Gemini 3 Flash, Gemini 2.5 Pro | Google Cloud (GCP) | Google commits to not training on GitHub data |

### Key Facts for State of Illinois

- **Multi-model launched:** October 2024 at GitHub Universe
- **Enterprise controls:** Org/enterprise admins can enable/disable specific models and vendors via policy
- **Government-appropriate tier:** Copilot Business or Enterprise — GitHub does NOT use data for training
- **Free/Pro tiers:** NOT appropriate for government (data may be used for training as of April 2026)
- **Data residency:** Available for US, EU, Australia, Japan
- **Compliance:** SOC 2, ISO 27001 reporting available on Enterprise tier
- **Default if no model selected:** Claude Sonnet 4.6 is used automatically

### Approval Status (from Jim, April 13)

| Vendor | Model | Approved by State? | Notes |
|--------|-------|--------------------|-------|
| **OpenAI** | GPT-5.4, GPT-4.1 | **Yes — approved** | Default model in Copilot |
| **Google** | Gemini 3.1 Pro, 3 Flash, 2.5 Pro | **Needs verification** — Jim to check | Jim believes it may be approved but needs to confirm |
| **Anthropic** | Claude Sonnet 4.6, Opus 4 | **Not confirmed** | Zero data retention = strongest privacy, worth pursuing |

### Implications for DCFS

1. **OpenAI is approved** — we can use GPT models in Copilot immediately (once Copilot is deployed)
2. **Google needs Jim's confirmation** — he said he'll check
3. **Claude worth pursuing** — zero data retention is the strongest privacy guarantee for government
4. **Enterprise admin controls** which models developers can use — governance team can set policy
5. **One tool, multiple models** — simplifies procurement (just GitHub Copilot Enterprise, not separate AI vendor contracts)
6. **Question for Dave:** Which GitHub Copilot tier does the State have? (Free/Pro = not appropriate. Business/Enterprise = good.)

---

## Category 2: Microsoft Platform AI (Built into Dynamics 365 / Power Platform)

These may already be available as part of the Dynamics 365 / Power Platform licensing. **Key question for Jeffrey/Kashif working session.**

| Tool | What It Does | Roles | Available in GCC? | Additional License? | Status |
|------|-------------|-------|-------------------|-------------------|--------|
| ~~Copilot for Dynamics 365~~ | ~~Conversational AI — summaries, case routing~~ | ~~Business users~~ | ~~Yes~~ | ~~M365 Copilot $30/user/mo~~ | **Out of scope** — business process, not SDLC |
| **Power Automate Copilot** | Draft workflows from natural language | Configuration | Yes | Included in Power Platform | **Needs evaluation** |
| **Dataverse AI Data Mapping** | Automate legacy data import/transformation rules | Data Team, Configuration | Yes (2025 Wave 2) | Included | **Needs evaluation** |
| **Power Apps Model-Driven Copilot** | Natural language interaction with app data | Configuration | GA April 15, 2026 | M365 Copilot $30/user/mo | **Needs evaluation** |
| ~~AI Builder Document Processing~~ | ~~Extract data from case files, court docs~~ | ~~Business users~~ | ~~Yes~~ | ~~AI Builder credits~~ | **Out of scope** — business process, not SDLC |
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
