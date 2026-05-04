# AI Tool Authorization List — DCFS Illinois Connect

> **Version:** V20260430
> **Status:** DRAFT — Living document, updated as tools are identified
> **Owner:** Vinay Lagisetty
> **Action Item:** From April 13 Jim meeting — "Compile a list of additional AI tools beyond Copilot/Rovo. Assess audit functionalities for potential procurement."

## Apr 30 update — email-in-flight to Romi (AI tool access + status check)

Email drafted to Romi (cc Robert / Jeff / Alec / Dinkar) consolidating the picture of which AI tools we have access to, what tier, and what's still blocked. Key updates vs. the Apr 27 view:

- **Zephyr Scale Agent for Rovo — RECLASSIFIED:** per recent research, the agent is **free** (included with Rovo at no additional cost) and can be enabled by the JIRA admin. **No §5f notice required** (was R-NEW-6). Action item: coordinate with JIRA admin to enable. Whether DoIT still wants a procedural tools-list update (no spend, no new vendor) is a question for Robert.
- **Copilot in Dataverse / D365 maker — confirmed mixed:** table generation worked in a recent walkthrough meeting; other Copilot features in the same surface did NOT work. Suggests partial / inconsistent enablement at our datacenter (likely a GCC-vs-commercial-cloud parity gap). **New action: broker an MS specialist engagement (FastTrack or Premier) via Romi to confirm exactly which Power Platform / Dataverse / D365 maker Copilot features are enabled at our datacenter.** Unblocks the Power Apps maker, Power Automate designer, and Dataverse rows together.
- **Copilot in Dynamics 365 Customer Service (Service Agent / end-user):** flagged as **likely OUT of scope** — touches business processes, conflicts with Jim's "AI for SDLC only" constraint. Pending formal sign-off from Jim/Dave before pilot.
- **Copilot Studio:** dropped from the in-scope list (was already noted as out-of-scope-pending in earlier rows; now explicitly removed from the scope conversation).

Owners on the new asks: Romi (MS specialist engagement), Robert (DoIT procedural notice question for Zephyr), Jeff (Rovo tier confirmation + JIRA admin path), Alec (dependency tracking).

## Apr 27 update — discovery findings

Three working sessions (Apr 23 Dynamics dev workflow, Apr 24 testing workflow, Apr 24 governance review) updated tool status as follows:
- **GitHub Copilot:** licensed by DoIT but **NOT YET PROVISIONED** for this team's GCC environment — hard blocker for highest-value developer use cases
- **Atlassian Rovo:** enabled and working — used live in both Apr 23 and Apr 24 sessions
- **Power Automate Copilot:** confirmed enabled in `make.gov.powerautomate.us` — flow scaffolding works
- **Power Apps Copilot for tables:** confirmed enabled in this GCC tenant
- **Power Apps form-designer Copilot:** **NOT enabled** in GCC tenant (release-cadence gap — affects ~10% of dev workflow)
- **🆕 Zephyr Scale Agent for Atlassian Rovo** — identified as high-value tester acceleration (see new Category 3b below). NOT in current authorized 4. *(Apr 30 correction: free + JIRA-admin-enabled — see Apr 30 update above and Category 3b below.)*

---

## How This List Works

This is a running inventory of all AI tools being considered, evaluated, or approved for the ILC engagement. As we conduct working sessions (Jeffrey, Kashif, Shyam, Chase) and discover new capabilities, tools are added here. The governance team reviews and approves tools before deployment.

**Approval path:** Identify → Evaluate → Governance Team Review → DoIT 30-day notice (if required) → Deploy

---

## Category 1: State-Purchased / Already Available

These tools are purchased by the State. Deployment status needs confirmation.

| Tool | Vendor | Purpose | Roles | Deployed? | Audit Capability | Notes |
|------|--------|---------|-------|-----------|-----------------|-------|
| **GitHub Copilot** | Microsoft/GitHub | Code suggestions, code review, documentation | Developers | **🚧 Licensed by DoIT, NOT YET PROVISIONED** for this team's GCC environment (confirmed Apr 23) | Usage telemetry via GitHub admin | Hard blocker for plugin/PCF/Azure Function authoring use cases. Vinay+Romi to escalate. **Supports multiple AI models** — see below. |
| **Atlassian Rovo** | Atlassian | JIRA AI — story quality, search, summarization | BA-Technical, Testers, SM | ✅ **Enabled and working** (used live in Apr 23 + Apr 24 sessions) | Atlassian admin analytics | Generated 4 role-based test cases + 1 negative case from a real Intact story (Apr 24 demo). Limitation: writes back as JIRA comment only — see Zephyr Scale Agent for Rovo (Category 3b) for the bridge to Zephyr Scale folders. |
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
| **Power Automate Copilot** | Draft workflows from natural language | Configuration | Yes | Included in Power Platform | ✅ **Confirmed enabled** in `make.gov.powerautomate.us` (Apr 23 walkthrough) — flow skeleton generation works; per-action config still manual |
| **Power Apps Copilot for tables** | Generate Dataverse tables and relationships from natural language | Configuration, Data Team | ✅ **Yes — enabled in this GCC tenant** (Apr 23) | Included in Power Platform | Use for table modeling acceleration |
| **Power Apps form-designer Copilot** | Natural-language form generation in maker | Configuration | ❌ **NOT enabled in GCC** (Apr 23) | Included in Power Platform | Release-cadence gap; confirm with Microsoft / DoIT. Affects ~10% of dev workflow — not a pilot blocker |
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

## Category 3b: Proposed Additions — Free / Admin-Enabled (Apr 30 update)

> **🆕 Surfaced Apr 24 testing workflow walkthrough.** Original framing (Apr 27): "NOT in authorized 4, requires §5f 30-day notice." **Apr 30 reclassification:** the Zephyr Scale Agent for Rovo is **free** (included with Rovo, no separate licensing) and can be enabled by the JIRA admin. No §5f license blocker. Action item is operational, not procedural.

| Tool | Vendor | Purpose | Roles | Why Consider | License / Enablement | Pilot Fallback |
|------|--------|---------|-------|--------------|----------------------|----------------|
| **Zephyr Scale Agent for Atlassian Rovo** | Atlassian / SmartBear | Bridges Rovo into Zephyr Scale so generated test cases save directly into Zephyr folders linked to a JIRA story (current Rovo limit: only writes a JIRA comment) | Tester, Testing Services Lead | Highest-value tester acceleration identified. Live demo (Apr 24): Rovo generated 4 role-based test cases + 1 negative case from a real Intact story, but no path to land them in Zephyr without manual paste. Closing this gap captures the entire test-authoring win. | **Free** — bundled with Rovo. **JIRA admin enables.** Owner: coordinate via Jeff Lobo to identify the JIRA admin and request enablement. Open question to Robert: does DoIT still want a procedural tools-list update (no spend, no new vendor)? | Rovo-only generation + manual copy/paste from JIRA comment into Zephyr Scale folders. Acceptable for Pilot Sprint 1; bottleneck by Sprint 2. |

### Zephyr Scale Agent — additional context

- **Suggested by:** Vinay during Apr 24 testing workflow walkthrough demo.
- **DCFS technical owners:** Jeff Lobo + Carl Lobo (JIRA admin) — already pinged to scope enablement.
- **Release availability:** Rovo Agents marketplace (Atlassian) — **bundled with Rovo at no additional cost** (Apr 30 confirmation).
- **Audit capability:** Inherits Atlassian admin analytics (per-user prompt activity).
- **Compliance posture:** Same data boundary as Rovo (state tenant). No external grounding. Fits within DoIT AI Policy §4d / §6 HITL discipline (the Agent generates; humans accept/edit each test case before saving).
- **Risk if not enabled in time:** Tester role authoring slice gain shrinks to ~50% of potential (manual paste latency erodes the speed advantage).
- **Apr 30 reclassification rationale:** earlier framing assumed separate licensing requiring §5f notice. Confirmed bundled and admin-enabled — no license event, so the §5f trigger may not apply. Robert to confirm whether the procedural notice is still desired.

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

## Category 4b: Tool Limitations & Boundaries (State Tenant)

> Surfaced in Apr 22 Dave meeting. Full notes: `meeting-notes/2026-04-22-dave-meeting.md`.

**Headline constraint:** State-authorized Microsoft Copilot is **sandboxed to the State tenant**. It cannot access external sources — no web search, no browsing outside the tenant, no fetching user-supplied URLs.

### Capability matrix

| Capability | State Copilot | Notes |
|------------|---------------|-------|
| Answer from State tenant data (M365, Teams, SharePoint, Outlook) | ✅ Yes | Grounded on user's accessible content |
| Answer from Dataverse / D365 records | ✅ Yes (where Copilot is enabled) | Sandboxed to the instance |
| Web search / open-web grounding | ❌ No | Disabled at tenant policy level |
| Fetch external URL supplied by user | ❌ No | Blocked |
| Summarize a public article | ❌ No | Only if content lives in tenant |
| Current events / news | ❌ No | Model training data only |
| Public documentation lookup (e.g., Microsoft Learn via Copilot) | ❌ No | Use a browser instead |

### Per-tool implications

- **M365 Copilot** (BA, SM, Leadership): great for tenant-grounded work; will **not** do research. Flag explicitly in Foundation training.
- **GitHub Copilot** (Devs): no browsing by design; uses model weights + repo context.
- **Atlassian Rovo** (BA/SM/Tester): grounded on JIRA + Confluence; Rovo web behavior TBC.
- **D365 Copilot** (Configuration): grounded on Dataverse.
- **Power BI Copilot**: grounded on dataset.

### Open questions (to confirm with Dave)

1. Statewide DoIT policy or DCFS tenant-specific?
2. Is Microsoft's "web grounding" toggle blocked (Bing-backed)?
3. Does restriction apply to Copilot Chat in Edge (work mode)?
4. Does it cover GitHub Copilot Chat `@web` / code-search features?
5. Does it cover Copilot Studio agents calling external connectors?

### Actions

- [ ] Confirm exact policy scope with Dave (email)
- [ ] Build "Copilot boundaries" one-pager — ships with Foundation training
- [ ] Add "What Copilot can't do" module to Foundation session
- [ ] Audit BA / Developer / Tester playbooks for steps that assume web retrieval

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

1. ~~**GitHub Copilot:** Is it deployed to ILC teams?~~ → **Resolved Apr 23:** licensed by DoIT, NOT YET PROVISIONED for this team's GCC environment. Escalation to Dave/Jim required.
2. ~~**Rovo:** Is Rovo enabled on ILC JIRA Cloud?~~ → **Resolved Apr 23/24:** ✅ enabled and working.
3. **D365 Copilot:** Is it enabled in the ILC Dataverse instance? (Ask Jeffrey/Kashif)
4. ~~**Power Platform AI:** Which Power Platform AI features are currently active?~~ → **Partially resolved Apr 23:** Power Automate Copilot ✅, Power Apps Copilot for tables ✅, Power Apps form-designer Copilot ❌ (not enabled in GCC).
5. **M365 Copilot licensing:** Does the State have M365 Copilot licenses? At $30/user/mo, what's the budget? (Ask Dave)
6. **AI Builder credits:** Does the State have AI Builder credits for document processing? (Ask Jeffrey)
7. **Procurement process:** For tools not yet purchased, what's the state procurement timeline? (Ask Dave)
8. **DoIT 30-day notice:** Which of these tools require a DoIT 30-day notice before deployment? (Ask Dave)
9. ~~**Zephyr Scale Agent for Rovo licensing model + cost**~~ → **Resolved Apr 30:** free, included with Rovo. JIRA admin enables. Open follow-up: does DoIT still want a procedural tools-list update?
10. **🆕 GitHub Copilot enablement timeline** for this team's GCC environment — escalate to Dave/Jim (Apr 27)
11. **🆕 Power Apps form-designer Copilot enablement** in GCC tenant — release-cadence gap; confirm with Microsoft / DoIT (Apr 27)
12. **🆕 (Apr 30) Datacenter / GCC enablement parity for Power Platform / Dataverse / D365 maker Copilot** — table generation works, other features don't. MS specialist (FastTrack or Premier) engagement requested via Romi to confirm exactly which features are enabled at our datacenter and any pending GCC rollout dates.
13. **🆕 (Apr 30) D365 Customer Service Copilot (Service Agent / end-user)** — formal sign-off needed from Jim/Dave that this is out of scope for the pilot (touches business processes vs. SDLC).
14. **🆕 (Apr 30) Rovo tier + analytics surface** — confirm currently enabled tier and whether per-user usage analytics are pullable for measurement.

---

## Next Steps

1. Share this draft with Dave for initial review
2. Refine during Jeffrey/Kashif/Shyam working session (Dynamics capabilities)
3. Refine during Chase session (data team tools)
4. Submit to governance team for formal review
5. Keep updating as new tools are identified

---

*This is a living document. Add tools as they are discovered. Remove tools if they are rejected.*
