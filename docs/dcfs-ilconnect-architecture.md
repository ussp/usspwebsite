# DCFS Illinois Connect (ILConnect) — Capability & AI Improvement Framework

> **Purpose:** Show CIO Jim Doherty exactly which capabilities we're improving, how we measure them today, and how AI augmentation moves the needle.
> **Source:** Krishna Mekala (Service Delivery Lead), engagement kickoff meetings, team input.
> **Framework:** People, Process, Tools — mapped to measurable outcomes.

---

## Capability Map: People, Process, Tools

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        DCFS ILConnect — CAPABILITY VIEW                      │
│                                                                              │
│  PEOPLE (Roles)          PROCESS (What they do)         TOOLS (What they use)│
│  ─────────────           ──────────────────────         ─────────────────────│
│                                                                              │
│  Business Analysts  ───► Story Writing & Refinement ──► JIRA, Confluence     │
│                     ───► Acceptance Criteria        ──► JIRA, Rovo           │
│                     ───► Requirements Documentation ──► Confluence, SharePt  │
│                                                                              │
│  Developers         ───► Plugin Development (C#)   ──► Visual Studio, ADO   │
│                     ───► Form Scripting (JS)        ──► VS Code, ADO        │
│                     ───► Code Review                ──► Azure DevOps         │
│                     ───► Solution Packaging         ──► XRMToolBox           │
│                                                                              │
│  Testers            ───► Test Script Creation       ──► Eggplant, Zephyr    │
│                     ───► Test Execution             ──► Eggplant, Postman   │
│                     ───► ADA/Accessibility Testing  ──► AXE, NVDA           │
│                     ───► Performance Testing        ──► Keysight Perf       │
│                                                                              │
│  Scrum Leads        ───► Sprint Planning            ──► JIRA                │
│                     ───► Velocity Tracking          ──► JIRA, Power BI      │
│                     ───► Impediment Resolution      ──► JIRA, Confluence    │
│                                                                              │
│  Architects         ───► Solution Design            ──► Figma, Confluence   │
│                     ───► Integration Design         ──► Azure (Logic/Func)  │
│                     ───► Technical Guidance          ──► Confluence, ADO     │
│                                                                              │
│  Data Team          ───► Data Migration (ETL)       ──► Informatica, ADF    │
│                     ───► Reporting & Analytics      ──► Power BI, SQL Svr   │
│                     ───► Data Quality               ──► SQL Server          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Processes Identified for Improvement

We have an existing contract with the State of Illinois. These teams are **already delivering**. The goal is not to change what they do — it's to make them measurably better at it using AI.

### Process 1: User Story Writing & Refinement

| Dimension | Current State | AI-Improved State |
|-----------|--------------|-------------------|
| **People** | BAs write user stories manually; quality varies by experience level | BAs use AI as co-author; consistent quality floor across all BAs |
| **Process** | BA drafts story → PO reviews → rework cycles → approval | BA drafts with AI assist → fewer rework cycles → faster approval |
| **Tools** | JIRA, Confluence, manual templates | JIRA + Rovo (AI), Confluence context feeding Rovo |
| **Current Pain** | Inconsistent story quality; junior BAs produce stories that need 2-3 revision cycles; Copilot tested but makes poorly written stories worse |
| **Constraint** | No child welfare data in AI prompts; stories must use sanitized/generic references |

**How we measure today:**
| Metric | Source | Baseline Available? |
|--------|--------|-------------------|
| Avg rework cycles per story (draft → approved) | JIRA workflow timestamps | Yes — can pull from JIRA history |
| Time from story created → story approved | JIRA | Yes |
| Story rejection rate at sprint review | JIRA + Scrum Lead tracking | Likely tracked informally |
| Story quality score (meets INVEST criteria) | Manual review | No — need to establish rubric |

**What we show Jim:**
- "Stories took an average of X days from draft to approval. With AI assist, pilot teams reduced that to Y days."
- "Rework cycles dropped from 2.5 avg to 1.2 avg."
- "Story quality scores (new rubric) improved from X to Y."

---

### Process 2: Test Script Creation

| Dimension | Current State | AI-Improved State |
|-----------|--------------|-------------------|
| **People** | Testers manually write test scripts from acceptance criteria | Testers use AI to generate draft test scripts, then review/refine |
| **Process** | Read AC → write test steps → enter in Zephyr → review → execute | AI generates draft from AC → tester validates/adjusts → execute |
| **Tools** | Zephyr (JIRA), Eggplant, Postman | + GitHub Copilot or Rovo for script drafting |
| **Current Pain** | Time-intensive; testers are bottleneck; test coverage gaps when rushed |

**How we measure today:**
| Metric | Source | Baseline Available? |
|--------|--------|-------------------|
| Time from story approved → test scripts ready | JIRA/Zephyr timestamps | Yes |
| Test cases created per sprint | Zephyr | Yes |
| Test coverage (% of AC with test cases) | Zephyr vs JIRA stories | Can be calculated |
| Defect escape rate (bugs found in higher environments) | JIRA defect tracking | Yes |

**What we show Jim:**
- "Test script creation time reduced from X hours to Y hours per story."
- "Test coverage increased from X% to Y% of acceptance criteria."
- "Defect escape rate dropped — catching more bugs earlier."

---

### Process 3: Code Development (Plugins & Scripting)

| Dimension | Current State | AI-Improved State |
|-----------|--------------|-------------------|
| **People** | Developers write C# plugins and JS form scripts manually | Developers use Copilot for code assist, boilerplate, and review |
| **Process** | Read story → design → code → unit test → PR → code review → merge | Same flow, but coding and unit test phases are faster |
| **Tools** | Visual Studio, Azure DevOps, XRMToolBox | + GitHub Copilot (state-purchased, pending deployment) |
| **Current Pain** | Plugin boilerplate is repetitive; context switching between Dynamics patterns |
| **Constraint** | **No autonomous code generation** — AI assists, human reviews every line |

**How we measure today:**
| Metric | Source | Baseline Available? |
|--------|--------|-------------------|
| Cycle time: story assigned → PR submitted | Azure DevOps + JIRA | Yes |
| PR review turnaround time | Azure DevOps | Yes |
| Build failure rate | Azure DevOps Pipelines | Yes |
| Lines of code / story point (rough proxy) | Azure DevOps | Can be calculated |
| Defects per release | JIRA | Yes |

**What we show Jim:**
- "Development cycle time reduced from X days to Y days per story."
- "Build failures decreased — Copilot catches common mistakes pre-commit."
- "Developers spend less time on boilerplate, more on business logic."

---

### Process 4: Sprint Velocity & Delivery

| Dimension | Current State | AI-Improved State |
|-----------|--------------|-------------------|
| **People** | 12 Scrum teams, ~160 Krasan consultants | Same teams, AI-augmented in roles above |
| **Process** | Standard SAFe sprints → PI planning → delivery | Same cadence, but individual tasks within sprints complete faster |
| **Tools** | JIRA, Power BI | Same + AI-augmented role-level tools |
| **Current Pain** | Teams delivering satisfactorily but CIO wants 5%+ improvement |

**How we measure today:**
| Metric | Source | Baseline Available? |
|--------|--------|-------------------|
| Story points committed vs delivered per sprint | JIRA | **Yes — this is the primary KPI** |
| Sprint burndown consistency | JIRA | Yes |
| PI predictability (planned vs actual) | JIRA + RTE tracking | Yes |
| Avg story cycle time (created → done) | JIRA | Yes |

**What we show Jim:**
- "Pilot teams delivered X% more story points per sprint vs baseline."
- "Non-pilot teams stayed flat — the difference is AI augmentation."
- "Sprint predictability improved from X% to Y%."

---

### Process 5: Documentation & Knowledge Sharing

| Dimension | Current State | AI-Improved State |
|-----------|--------------|-------------------|
| **People** | All roles contribute to Confluence; architects document designs | AI assists in drafting, searching, and maintaining docs |
| **Process** | Manual authoring → review → publish → hope people find it | AI-assisted authoring + AI-powered search across Confluence |
| **Tools** | Confluence, SharePoint | + Confluence AI / Rovo search |
| **Current Pain** | Knowledge siloed; team members can't find existing docs; duplicated effort |

**How we measure today:**
| Metric | Source | Baseline Available? |
|--------|--------|-------------------|
| Time spent searching for information (self-reported) | Survey | No — need baseline survey |
| Documentation currency (% of docs updated within 90 days) | Confluence analytics | Can be calculated |
| Duplicate/conflicting documentation incidents | Informal | No — need tracking |

**What we show Jim:**
- "Team members report X% less time searching for information."
- "Documentation quality and findability improved — fewer 'I didn't know that existed' moments."

---

### Process 6: Data Migration & ETL

| Dimension | Current State | AI-Improved State |
|-----------|--------------|-------------------|
| **People** | Chase Yeung's data team handles migrations and reporting | AI assists with mapping rules, transformation logic, data quality checks |
| **Process** | Source analysis → mapping → ETL build → validate → migrate | AI-assisted mapping suggestions + automated validation rules |
| **Tools** | Informatica, Azure Data Factory, SQL Server | + AI for mapping/transformation (requires assessment) |
| **Current Pain** | Complex legacy-to-Dynamics mappings; manual validation is slow |

**How we measure today:**
| Metric | Source | Baseline Available? |
|--------|--------|-------------------|
| Data migration error rate | Migration logs | Yes |
| Time per migration batch | ETL job logs | Yes |
| Data quality issues found post-migration | JIRA defects | Yes |

**What we show Jim:**
- "Migration error rates reduced through AI-assisted validation."
- "Mapping creation time decreased — AI suggests based on schema analysis."

---

## Measurement Dashboard (What Jim Sees)

```
┌──────────────────────────────────────────────────────────────────┐
│              AI TRANSFORMATION SCORECARD                          │
│                                                                  │
│  ┌─────────────────────┐  ┌──────────────────────┐              │
│  │  VELOCITY           │  │  QUALITY              │              │
│  │  ────────           │  │  ───────              │              │
│  │  Story points/sprint│  │  Story rework cycles  │              │
│  │  Sprint predictab.  │  │  Defect escape rate   │              │
│  │  Cycle time         │  │  Story quality score  │              │
│  │  Target: +5%        │  │  Test coverage %      │              │
│  └─────────────────────┘  └──────────────────────┘              │
│                                                                  │
│  ┌─────────────────────┐  ┌──────────────────────┐              │
│  │  EFFICIENCY         │  │  COMPARISON           │              │
│  │  ──────────         │  │  ──────────           │              │
│  │  Story draft→approve│  │  Pilot vs Non-Pilot   │              │
│  │  Test script time   │  │  Before vs After      │              │
│  │  Dev cycle time     │  │  Team-by-team trends  │              │
│  │  Doc search time    │  │  Role-by-role impact  │              │
│  └─────────────────────┘  └──────────────────────┘              │
│                                                                  │
│  Data Sources: JIRA, Azure DevOps, Zephyr, Power BI             │
│  Reporting: Power BI dashboard (existing tool, new views)        │
│  Cadence: Weekly during pilot, PI-level for executive review     │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tool Inventory (Reference)

### Currently In Use

| Category | Tool | Used By |
|----------|------|---------|
| **Platform** | Dynamics 365 (Customer Service), Dataverse | All teams |
| **Low-Code** | Power Apps, Power Automate, Power Pages | BAs, Devs |
| **Development** | .NET/C#, JavaScript, PCF Controls, Bootstrap CSS | Developers |
| **Business Rules** | North52 | Configurators |
| **Integration** | Azure Logic Apps, Azure Functions, Azure API Mgmt | Architects, Devs |
| **External** | IBM FileNet, Adobe Sign, Address Validation | Integration team |
| **Data/ETL** | Informatica, Azure Data Factory, SQL Server | Data team |
| **Documents** | DocumentCorePack, Adobe Sign | BAs, Case workers |
| **DevOps** | Azure DevOps (Repos + Pipelines), XRMToolBox, App Insights | Developers |
| **Testing** | Keysight Eggplant, Keysight Perf, Postman, AXE, NVDA | Testers |
| **Collaboration** | JIRA + Zephyr, Confluence, SharePoint | All teams |
| **Reporting** | Power BI | Leads, Mgmt |
| **Design** | Figma | Architects, UX |

### AI Tools (Available / Pending)

| Tool | Status | Target Roles | Constraint |
|------|--------|-------------|------------|
| **Atlassian Rovo** | Available (JIRA AI) | BAs, Testers, Scrum Leads | Already in toolbox |
| **GitHub Copilot** | State-purchased, **not yet deployed** | Developers | Need to request access |
| **Confluence AI** | Available | All | Part of Atlassian suite |
| **Copilot for Power BI** | Unknown — needs license check | Data team, Mgmt | Requires M365 Copilot license |
| **Copilot for Power Platform** | Unknown — needs license check | BAs, Configurators | Requires separate license |

---

## Hard Constraints (Jim's Directives)

| Constraint | Implication |
|-----------|-------------|
| No autonomous code generation | AI assists only; every line human-reviewed |
| AI for SDLC only, not business processes | No AI touching child welfare workflows |
| No child information in AI | Zero PII/case data in prompts or training |
| No security documentation shared | Security plans stay internal |
| State AI policy (DoIT) governs all | Must obtain and comply with official policy |
| GitHub Copilot not yet deployed | Can't demo until state IT enables access |

---

## Open Questions (for Krishna & Chase Calls)

### Krishna — Tech Stack & Process Deep-Dive
1. What does a typical sprint look like for a developer? (code → test → deploy inner loop)
2. How are Dynamics solutions structured — single solution or segmented by team?
3. Branching and release strategy in Azure DevOps?
4. Plugin deployment — managed vs unmanaged solutions?
5. How is Dataverse schema managed across environments (dev/test/prod)?
6. Any existing AI/ML usage (Power Platform AI Builder, etc.)?
7. Power Automate flow versioning — how are flows promoted across environments?
8. North52 rules — volume and complexity?
9. Current App Insights coverage — what's monitored, what gaps?
10. FileNet integration — real-time or batch?

### Chase — Data Architecture & Measurement
1. What data sources feed into Power BI today?
2. How is sprint/velocity data currently reported? (JIRA → Power BI pipeline?)
3. What JIRA metrics are already being tracked at the team and ART level?
4. Data migration status — how many legacy systems remain?
5. Current data quality processes — automated or manual?
6. Can we build the AI scorecard into existing Power BI infrastructure?
7. What's the data team's current sprint workload and process?
8. ETL pipeline monitoring — what alerts exist today?
9. Any data governance or data catalog in place?
10. What would it take to extract story-level cycle time data from JIRA for baselining?
