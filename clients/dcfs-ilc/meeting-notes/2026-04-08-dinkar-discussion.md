# DCFS CCWIS Program — AI Rollout Discussion with Dinkar

> **Date:** April 8, 2026
> **Participants:** Vinay Lagisetty, Dinkar
> **Status:** Program context (SACWIS/CCWIS, regulatory) confirmed. Tool availability (M365 Copilot, Purview DLP) needs verification with team.
> **Context:** Deep-dive discussion on program context, regulatory environment, and review of Romi's draft rollout plan

---

## Program Context

| Dimension | Detail |
|-----------|--------|
| **Client** | Illinois DCFS |
| **Program** | SACWIS to CCWIS migration using Microsoft Dynamics 365 |
| **Federal mandate** | CCWIS Final Rule — 45 CFR Part 1355 (2016) |
| **Approach** | Minimum customization, configuration-first |
| **Team** | 12 Agile Release Trains (ARTs), 160 team members running SAFe sprints |
| **USSP/Krasan Role** | We ARE the delivery team — not advising the client, building the solution |
| **CIO Directive** | Use AI to improve team throughput across all 12 teams |

### SACWIS → CCWIS Migration Key Facts

| Dimension | SACWIS | CCWIS |
|-----------|--------|-------|
| Architecture | Monolithic, state-siloed | Modular, API-first, interoperable |
| Federal mandate | CAPTA 1993 | 2016 Final Rule 45 CFR Part 1355 |
| Data standard | Proprietary state schema | CCWIS XML / API-based |
| Federal funding | 50% FFP | 50% FFP if certified |
| AI/Analytics | Bolt-on | Native architecture supports it |

**Key insight:** CCWIS allows modular third-party systems — individual components (analytics, reporting) can be built and certified separately. CCWIS-certified modules qualify for **50% Federal Financial Participation (FFP)**.

---

## Regulatory Environment

This program operates under **multiple overlapping data protection frameworks** — stricter than standard HIPAA:

| Framework | Scope |
|-----------|-------|
| **IL DCFS Rule 431** | Illinois-specific confidentiality of child abuse/neglect records |
| **CANTS** | Child Abuse and Neglect Tracking System — highly restricted |
| **SACWIS/CCWIS** | Federal child welfare data standards (45 CFR Part 1355) |
| **42 CFR Part 2** | Substance abuse records common in DCFS cases |
| **FERPA** | Educational records for school-age children |
| **HIPAA** | Health information overlay |
| **IRS Pub 1075** | Federal tax information in case files |

**Critical point:** Re-identification risk is extreme. Protected entities include:
- Child names, case numbers, CANTS IDs
- Placement details
- Parent/guardian names
- Perpetrator names

---

## AI Tools — Full Stack

### Tools In Scope

| Tool | Roles | Primary Use |
|------|-------|-------------|
| **M365 Copilot** | BAs, POs, SMs | User story drafting, AC generation, meeting summaries, requirement summarization, documentation |
| **GitHub Copilot** | Developers, configurators, QA | Code explanation, test suggestions, Power Automate documentation, Dataverse schema docs, refactoring |
| **Jira** | All roles | Sprint and backlog tracking |
| **Atlassian Intelligence (Rovo)** | All roles | AI features within Jira — backlog health, story refinement, sprint insights, ART-level visibility |

### Tool Naming Clarifications
- "Jira AI" is officially **Atlassian Intelligence**, powered by **Rovo**
- Atlassian Intelligence = the engine; Rovo = the interface
- GitHub Copilot and M365 Copilot are **separate products** with separate licenses and separate use cases

### Tools NOT In Scope
- ChatGPT, Claude, Gemini, or any external/personal AI tool
- Any AI tool not provisioned through program IT governance
- Copilot in personal Microsoft accounts (must be tenant-licensed)

---

## Data Governance Rules

### Universal Rule — ALL Tools
> **No real DCFS case data, child names, case numbers, client identifiers, CANTS report IDs, or placement details in any prompt, ticket, description, or document fed to any AI tool.**

### Per-Tool Data Boundaries

| Tool | Allowed | Prohibited |
|------|---------|-----------|
| **M365 Copilot** | Program documents, user stories, meeting notes | Any real case data |
| **GitHub Copilot** | Code, config, scripts, anonymized test data | Real field values, case numbers |
| **Jira / Rovo** | Sprint data, delivery tickets, velocity metrics | Real DCFS case numbers, child names in any ticket field |

### Jira-Specific Risk
Developers and BAs can accidentally write real identifiers into ticket descriptions (e.g., "Fix bug for case #IL-2024-0034521"). Rovo then has access to it.

**Guardrail needed:** Tickets must use functional references only — "child record," "case record" — never real identifiers.

### Admin Actions Required
1. Confirm Rovo can be restricted at the project level in Jira — enable for delivery projects, disable for any project touching case-related content
2. Configure Microsoft Purview DLP to enforce M365 Copilot data boundaries at the tenant level
3. Confirm GitHub Copilot license status before listing as approved

---

## Review of Romi's Draft Rollout Plan

**Document:** "DCFS AI Rollout Plan V20260804" — first draft direction document, not a playbook.

### What It Gets Right
- Pilot → Measure → Scale structure is correct
- SAFe-aligned metrics (cycle time, escape defect rate, story readiness) are solid
- "AI as Accelerator, not Developer" guardrail aligns with CIO's minimum-customization mandate
- Gherkin/BDD approach for acceptance criteria is appropriate for Dynamics config testing
- Use case table for roles is practical

### Critical Gaps Identified (Vinay's Comments)

#### 1. Data Governance — Insufficient
Single bullet ("No sensitive DCFS data in prompts") is not enough. Needs at minimum one paragraph acknowledging IL Rule 431, CANTS sensitivity, and the specific data types prohibited. Leadership will push back immediately.

#### 2. Pilot Scale Not Defined
Doesn't specify how many of 12 teams are in the pilot. Recommend 2-3 teams representing different workstreams. Needs a **Center of Enablement (CoE)** or **Community of Practice** structure to capture and share learnings during pilot, not after.

#### 3. Missing Migration-Specific Use Cases
Use case table is generic. Must add:
- SACWIS → Dataverse field mapping assistance
- CCWIS federal requirement traceability
- Power Automate flow documentation
- Dataverse entity documentation
These are the actual high-value use cases for this program.

#### 4. Timeline Not PI-Anchored
Month 1-5 linear timeline drifts. Must reanchor to PI cadence:
- PI N = Governance + baseline
- PI N+1 = Pilot
- PI N+2 = ART-wide rollout
This makes the throughput goal measurable at PI boundaries.

#### 5. Developer Section Generic
Doesn't reflect that this is a Dynamics 365 configuration team. Replace generic code examples with:
- Power Automate flow generation
- Dataverse schema documentation
- Security role matrix validation
- Business rule logic review

#### 6. BA Section Missing Highest-ROI Use Case
**SACWIS to Dataverse field mapping** is the single highest-value BA use case — can cut mapping time by **50-60%**. Also missing:
- AFCARS/NCANDS reporting gap analysis
- Federal compliance requirement summarization from ACF policy documents

---

## Refined Guiding Principles

### AI as Accelerator, Not Developer
Since no AI-generated production code commits are permitted:

**Use AI for:**
- Documentation
- Test generation
- Analysis
- Refactoring suggestions
- Requirements clarification
- Knowledge retrieval
- SACWIS → Dataverse field mapping assistance
- CCWIS federal requirement traceability
- Power Automate flow documentation
- Dataverse configuration documentation

**Avoid:**
- Autonomous coding
- AI-generated production code commits
- AI-generated Jira tickets committed without human review
- GitHub Copilot suggestions in Dynamics config scripts without peer review

---

## Migration-Specific Metrics (Add to Framework)

| Metric | Source |
|--------|--------|
| SACWIS → Dataverse field mapping accuracy rate | Manual review |
| CCWIS requirement traceability coverage (% of federal requirements traced to stories) | JIRA |
| Dynamics configuration documentation completeness | Confluence |
| Data migration defect rate per sprint | JIRA |

---

## Open Items to Resolve

- [ ] Is GitHub Copilot already licensed for the dev team or pending?
- [ ] Can Rovo be restricted at the project level in this Jira instance — confirm with Jira admin
- [ ] Is Purview DLP already configured for the M365 tenant or does it need setup?
- [ ] How many of the 12 teams will be in the pilot?
- [ ] What is the current PI cadence — when does the next PI start?
- [ ] Who is the named AI governance lead for this program?

---

*Documented April 9, 2026. Program context (SACWIS/CCWIS, regulatory environment) confirmed by Dinkar. Tool availability details (M365 Copilot licensing, Purview DLP config, GitHub Copilot status) still need verification with team.*
