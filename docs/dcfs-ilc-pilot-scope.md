# DCFS Illinois Connect — AI Productivity Pilot Scope

**Engagement:** Illinois Connect (SACWIS → CCWIS on Dynamics 365)
**Client:** IL Department of Children and Family Services (DCFS)
**Client Executive Sponsor:** Jim Daugherty, CIO — IL DoIT
**Delivery Lead / Engagement Director:** Emil "Romi" Kovacs — Krasan Consulting Services
**Project Manager:** Alec Granderson — Krasan Consulting Services
**AI Transformation Leader:** Vinay Lagisetty — Krasan Consulting Services
**Status:** Draft v0.3
**Date:** April 17, 2026

---

## 1. Purpose

Define the scope, team, measurement approach, and governance for the AI productivity pilot on the Intact product team. The pilot is the first operational validation of the AI Transformation Framework on Illinois Connect and is the basis for scale-out decisions across the remaining 11 SAFe product teams.

## 2. Objectives

1. Validate productivity impact of approved AI tools (GitHub Copilot, Atlassian Rovo) on a live SAFe delivery team without disrupting commitments. **Target: 15% productivity improvement by July 20, 2026.**
2. Establish quantitative baselines and post-pilot deltas for velocity, cycle time, and artifact quality.
3. Produce role-based playbooks (BA, Developer, Tester, Solution Architect) ready for rollout to the remaining teams.
4. Identify governance, policy, and tooling gaps before broader scale-out.
5. Confirm all usage stays inside state AI policy and DCFS constraints.

## 3. Pilot Team — Intact (Single Team)

**Team:** Intact — **one team only** for the pilot phase (decision confirmed 2026-04-17 call)
**Scrum Leader:** Reena Mohan (Senior) — team lead, not modified for pilot

### Why One Team (Not Multiple)

The pilot is a **controlled validation**, not a parallel rollout. Running multiple teams simultaneously would:
- Dilute measurement signal (can't isolate AI impact from team variance)
- Stretch Vinay's coaching and measurement capacity thin
- Multiply governance exposure before blockers are retired
- Make it harder to produce clean role-based playbooks for scale-out

Intact is the sole pilot team. Scale-out to the remaining 11 teams begins only after end-of-PI review and Jim's go decision.

### Pilot Roster — 4 Roles / 6 People (2026-04-17 Decision)

**Decision:** Reduce the pilot from 5 roles to **4 roles / 6 people**. Config, Scrum Master, and PMO/Story QA are deferred to the Scale phase (WBS 8.2a). To be formally ratified at the **Pilot Plan Approval meeting (WBS 1.15, 4/22–4/27)**.

**Why the reduction:**
- Tighter measurement signal with fewer moving parts
- Protects coaching and measurement capacity across the pilot PI
- Shortens the role-by-role design phase (WBS 3.5–3.18a) — design end date pulls in from July 8 to **June 22** (~2.5 weeks saved)

**Confirmed Pilot Participants:**

| # | Name | Role | Level | Vendor | Focus |
|---|---|---|---|---|---|
| 1 | Sushil Murali | Business Analyst (BA) | Senior | Krasan | User story quality, AC generation with Rovo |
| 2 | Kali Devineni | Solution Architect (SA) | Junior | Krasan | Architecture guidance, design review with AI assistance |
| 3 | Anusha Manuguru | Developer | Senior | Krasan | Copilot-assisted development (non-autonomous) |
| 4 | Anudeep Chaitanya | Developer | Junior | Krasan | Copilot-assisted development, learning curve measurement |
| 5 | Remya Raj | Tester | Senior | Krasan | Test script generation from ACs |
| 6 | Nataly Revutska | Tester | Senior | Krasan | Test script generation, coverage expansion |

**Deferred to Scale Phase (WBS 8.2a):**

| Role | Previously named candidate | Status |
|---|---|---|
| Configuration | — (Jeffrey/Kashif session driven) | **Deferred** — benefit from pilot learnings before designing Dynamics/Power Platform AI workflows |
| Scrum Master | — | **Deferred** — lower immediate AI leverage than content roles; design after pilot data |
| PMO / Story QA | CSG (PMO team) | **TBD — pending confirmation with CSG.** If PMO participates, the role is added to the pilot roster and WBS 1.13 (PMO BA Assignment) closes with onboarding. If not, PMO design work moves to WBS 8.2a and story-QA bottleneck relief is deferred to the Scale phase. |

**Team lead (not a pilot participant):** Reena Mohan (Scrum Leader, Senior) — runs Intact team as usual.

### Control Comparison

To measure impact, pair Intact's results against 1–2 non-AI teams of comparable size and story mix over the same PI. Control teams to be identified by the Release Train Engineer (RTE) and Agile Delivery Manager before PI Planning.

## 4. Pilot Duration

- **Start:** Pilot PI (May 2026) — begins immediately following PI Planning (May 5–7)
- **Duration:** One full Program Increment (~3 months / 5–6 sprints)
- **End:** Late July / early August 2026
- **Weekly check-ins** with pilot team to capture qualitative feedback
- **Mid-PI checkpoint** to adjust prompts, patterns, and tool usage

### Timeline Impact of Reduced Role Scope (2026-04-17)

The role-by-role design phase (WBS 3.5–3.19a) is currently built for 5 sequential roles (BA-Tech → Dev → Config → Tester → SM) running May 5 → July 8 (~9 weeks). Reducing the pilot to fewer roles compresses this phase:

| Pilot role count | Design phase ends | Weeks saved | Effect on July 20 deadline |
|---|---|---|---|
| 5 roles (original) | ~July 8 | 0 | Risk R12 = High |
| 4 roles | ~late June | ~1.5 | Risk R12 = High |
| 3 roles | ~mid June | ~3 | Risk R12 = Medium |
| 2 roles | ~early June | ~4.5 | Risk R12 = Medium/Low |
| 1 role | ~May 22 | ~6.5 | Risk R12 = Low |

**Knock-on effects of shorter design:**
- Foundation training (WBS 5.3) can start earlier → Sprint 1 becomes usable sooner
- Vinay's coaching load drops — parallel work during pilot execution becomes feasible
- Role-based playbook deliverables shrink in count but finish earlier
- Non-piloted roles move to Phase 2 scale-out and are designed with real pilot learnings applied

**Final design-phase end date is pending pilot roster/role confirmation at WBS 1.15.** Project plan (`clients/dcfs-ilc/planning/project-planner.html`) will be re-trimmed once roles are finalized.

## 5. Scope

### In Scope (Pilot Phase)

- SDLC augmentation for the **piloted subset of roles only** (specific roles TBD — confirmed at WBS 1.15). Non-piloted roles are not dropped — they move to the Scale phase (Phase 8); see §3.
- Approved AI tools only (see §6)
- Workflow augmentation within the piloted roles (examples — applicable only if the role is in pilot scope):
  - User story drafting, refinement, and acceptance criteria (BA)
  - Story qualification and review / PMO bottleneck relief (PMO)
  - Test script generation from acceptance criteria (Tester)
  - Code suggestions and review assistance (Developer — non-autonomous, human-in-the-loop)
  - Documentation generation (Architect / Dev)
  - Sprint analytics and reporting (SM)
- Measurement of velocity, cycle time, quality for the piloted roles and team

### Deferred to Scale Phase (Phase 8)

- Role-by-role design, playbook authoring, and training for any SDLC role **not** selected for the pilot
- Wave 2 rollout to additional teams beyond Intact
- ART-wide rollout planning

### Out of Scope

- Autonomous code generation or auto-commit
- Any interaction with **child welfare business processes**
- Any use of **child data, case data, or PII**
- Any use of **security documentation or security plans**
- Production code commits written entirely by AI
- Tools outside the approved list
- Platform team (separate from 12 product teams — may be added in later phase)

## 6. Approved Tools

Tool authorization list (WBS 1.11) completed 2026-04-18. **Full authoritative inventory:** `clients/dcfs-ilc/planning/deliverables/tool-authorization-list.md` — the list below is a summary synced with that document and the 2026-04-14 tool-access request sent to Romi (for Jim).

### 6.0 Licenses & Access Needed (Summary for Dave / Jim)

This is the full set of licenses or access provisioning required to execute the pilot. Action owner: **Dave / DoIT** unless noted.

| # | Tool | License / Access Need | Who Asks | Status |
|---|---|---|---|---|
| 1 | GitHub Copilot (Enterprise tier) | Confirm tier; provision to ILC dev teams | Dave / DoIT | **Blocker** — verify tier + deploy |
| 2 | GitHub Copilot — Claude models | Add Anthropic to approved model list | Jim | Not confirmed |
| 3 | GitHub Copilot — Gemini models | Confirm Google approval | Jim | Pending Jim |
| 4 | Atlassian Rovo | Confirm enabled on ILC JIRA Cloud | Dave / Matt | Verify |
| 5 | Confluence AI | Confirm enabled | Dave / Matt | Likely available, verify |
| 6 | Microsoft 365 Copilot ($30/user/mo) | Licenses + deployment | Jim (sent via Romi 4/14) | Awaiting Jim's routing |
| 7 | Copilot for Dynamics 365 | License + D365 enablement | Jim (sent via Romi 4/14) | Awaiting Jim's routing |
| 8 | Microsoft Purview | Access for AI compliance / data flow monitoring | Jim (sent via Romi 4/14) | Awaiting Jim's routing |
| 9 | Entra ID audit logs (Copilot) | Access for usage tracking / audit trail | Jim (sent via Romi 4/14) | Awaiting Jim's routing |
| 10 | Power Platform AI (Automate Copilot, Dataverse AI, Power Apps Copilot, Expression Editing, Prompt Columns, Process Mining) | Confirm which are already bundled; enable | Jeffrey / Kashif session | Needs evaluation |
| 11 | Azure DevOps Copilot | License (if ADO is in use) | Dave | To investigate |
| 12 | GitHub Advanced Security | License | Dave | To investigate (Apr 17 call) |
| 13 | Copilot for Security | License | Dave | To investigate |
| 14 | Power BI Copilot | Usually requires M365 Copilot license | Dave | To investigate |
| 15 | Microsoft Copilot Studio | License | Dave | To investigate |
| 16 | Eggplant AI | License (test generation) | Dave | To investigate (Apr 17 call) |
| 17 | tools.ussp.co (Krasan AI Transformation Monitor) | DoIT 30-day notice / approval | Dave | External tool — notice required? |

**Action for Pilot Plan Approval meeting (WBS 1.15, 4/22–4/27):** confirm which of rows 1–9 will be resolved before Governance Sign-off (WBS 1.16, 5/4). Rows 10–16 can be evaluated during baseline and design phases; they are not pilot blockers.

### 6.1 What We Have (State-Purchased / Already Available)

| Tool | Vendor | Purpose / Roles | Deployment Status |
|---|---|---|---|
| GitHub Copilot | Microsoft/GitHub | Code suggestions, review, docs — Developers | **Verify with Dave** — purchased but ILC deployment unconfirmed |
| Atlassian Rovo | Atlassian | JIRA AI — BA-Tech, Testers, SM | **Verify with Dave/Matt** — likely available |
| Confluence AI | Atlassian | Documentation assistance — All | **Likely available** (bundled with Confluence Cloud) |

### 6.2 GitHub Copilot — Multi-Model Approval Status

Copilot Enterprise supports multiple AI models via admin policy. Approval status per Jim (April 13):

| Vendor | Models | State Approval |
|---|---|---|
| OpenAI | GPT-5.4, GPT-4.1 (default), GPT-4o, o1-preview | **Approved** |
| Google | Gemini 3.1 Pro, 3 Flash, 2.5 Pro | **Pending** — Jim to confirm |
| Anthropic | Claude Sonnet 4.6, Opus 4, Sonnet 4, 3.7 | **Not confirmed** — worth pursuing (zero data retention) |

**Open question for Dave:** Which Copilot tier does the State have? Business/Enterprise are acceptable; Free/Pro are not (data may be used for training).

### 6.3 What We Requested (Sent to Romi → Jim, 2026-04-14)

See `meeting-prep/email-romi-tool-request-04142026.md`.

| Tool | Purpose |
|---|---|
| Microsoft 365 Copilot | AI in Word, Excel, Teams, PowerPoint |
| Copilot for Dynamics 365 | AI inside D365 for configuration and data queries |
| Microsoft Purview | AI compliance and data flow monitoring |
| Entra ID audit logs for Copilot | Usage tracking and audit trail |

*Awaiting Jim's routing to the right DoIT contact.*

### 6.4 Microsoft Platform AI — Needs Evaluation (Jeffrey/Kashif Session)

May already be bundled in Dynamics 365 / Power Platform licensing.

| Tool | Purpose | Status |
|---|---|---|
| Power Automate Copilot | Draft workflows from natural language | Needs evaluation |
| Dataverse AI Data Mapping | Legacy data import/transformation | Needs evaluation |
| Power Apps Model-Driven Copilot | NL interaction with app data (GA April 15, 2026) | Needs evaluation |
| Copilot-Assisted Expression Editing | Fix Power Automate expressions | Needs evaluation |
| Dataverse Prompt Columns | Auto-populate fields | Needs evaluation |
| Process Mining | AI-powered workflow bottleneck analysis | Needs evaluation |

**Out of scope** (business process, not SDLC): Copilot for D365 conversational summaries, AI Builder document processing.

### 6.5 Additional Tools to Investigate

| Tool | Why Consider? | Status |
|---|---|---|
| Azure DevOps Copilot | Work item suggestions, PR summaries (if ADO used alongside JIRA) | To investigate |
| GitHub Advanced Security | DevSecOps augmentation | To investigate (Apr 17 call) |
| Copilot for Security | Security review of code/config (Jim's audit ask) | To investigate |
| Power BI Copilot | NL data analysis, leadership dashboards | To investigate |
| Microsoft Copilot Studio | Build ILC-specific AI agents | To investigate |
| Eggplant AI | Test generation | To investigate (Apr 17 call) |

### 6.6 Explicitly NOT Approved

| Tool | Why Not |
|---|---|
| ChatGPT, Claude.ai, Gemini (consumer) | Not state-approved; data privacy concerns |
| Any open-source LLM | No state vetting, no audit trail |
| Any tool requiring PII / case data | Violates DCFS data boundaries |

Any tool beyond the approved list in §6.1–6.2 requires state approval and is out of scope for this pilot.

## 7. Workflows Targeted

| Workflow | Current Owner | AI Assist | Expected Gain |
|---|---|---|---|
| User story drafting | BA | Rovo (Confluence context) | Reduced rewrites, higher first-pass approval |
| Acceptance criteria generation | BA | Rovo | More complete ACs, fewer dev clarifications |
| **Story qualification & QA review** | **PMO (Valerie)** | **Rovo (rubric-based pre-screen)** | **Relieve current bottleneck; more stories qualified per day; consistent rubric application** |
| Test script creation from ACs | Tester | Rovo + Copilot | Faster script authoring, higher coverage |
| Code suggestions | Developer | Copilot (human review required) | Faster iteration on plugins, Power Apps, PCF |
| Design documentation | Architect / Dev | Rovo + Copilot | Consistent, complete design notes |
| Sprint retro analytics | Scrum Lead | Rovo + JIRA analytics | Better trend visibility |

## 8. Baseline Metrics

All baselines captured from the last 3 PIs before pilot starts and agreed with client leadership.

| Metric | Unit | Captured By |
|---|---|---|
| Team velocity | Story points / sprint | RTE (JIRA) |
| Story cycle time | Days: draft → approved → dev-ready | RTE / Scrum Lead |
| Time to write a 5-point story (BA) | Hours avg | BA self-report + JIRA |
| **PMO story qualification throughput** | **Stories qualified per day** | **PMO / JIRA** |
| **PMO review cycle time** | **Hours: story submitted → qualified or returned** | **PMO / JIRA** |
| Time to write test scripts from ACs | Hours per story | Tester self-report |
| Story quality score | Rubric (1–5): completeness, clarity, testability | Peer review sample |
| Defect escape rate | Defects per sprint post-deployment | QA |
| Rework rate | % stories returned to backlog after "done" | JIRA |
| **Story rework rate after PMO qualification** | **% qualified stories returned for rework in sprint** | **JIRA** |

## 9. Success Criteria

The pilot target is **15% productivity improvement by July 20, 2026**. Success criteria are structured as three tiers so outcomes can be reported honestly against this target:

### 9.1 Productivity Delta Tiers

| Tier | Velocity delta (Intact vs. baseline) | Interpretation |
|---|---|---|
| **Floor** | ≥ 5% | Below target — positions a trajectory story toward 15% at scale. |
| **Solid** | ≥ 10% | On track to reach target after scale-out with Config / SM / PMO roles added. |
| **Stretch** | ≥ 15% | Target met. Full confidence for ART-wide rollout. |

PMO / Story-QA tier (applies only if PMO is in pilot scope per WBS 1.13): **≥20% increase** in stories qualified per day OR **≥30% reduction** in review cycle time — standalone success metric for bottleneck relief.

### 9.2 Additional Success Criteria

1. Cycle time reduction ≥10% on BA story prep and tester script prep
2. Story quality score improvement of ≥0.5 on the rubric
3. No constraint violations (no child data, no autonomous code, within DoIT policy)
4. Role-based playbooks (BA, Dev, SA, Tester — 4 pilot roles) produced and reviewed by governance lead
5. Clear go / no-go recommendation with risks and remediation for scale-out to remaining 11 teams

### 9.3 Target-Attainment Risk

The 15% target is aggressive relative to industry norms (5–10% in 13 weeks) and runs on a compressed 6-sprint pilot with limited per-role data density (Tester: 3 sprints). Risk mitigations are captured in the project plan (see R07, R12, R16, R17 in `clients/dcfs-ilc/planning/project-planner.html`). Executive-level expectation setting on realistic ranges occurs before the July 20 interim results review.

## 10. Governance

- **Weekly pilot retro** — AI Transformation Leader, Agile Delivery Manager, RTE, Scrum Lead — Fridays
- **Bi-weekly executive update** — Delivery Lead to Client Executive Sponsor and Krasan Executive Sponsor
- **Mid-PI checkpoint** — full pilot team plus RTE, Architect, AI Transformation Leader
- **End-of-PI review** — present results to Client Executive Sponsor with playbooks and scale recommendation
- **Escalation path:** AI Transformation Leader → Delivery Lead → Krasan Executive Sponsor / Client Executive Sponsor
- **AI policy oversight:** Krasan Managing Consultant bridges DoIT AI policy to engagement practices

## 11. Dependencies (Client Action Required)

1. GitHub Copilot license provisioning from State
2. DoIT AI policy document
3. Client approval of baseline metrics before pilot Sprint 1
4. Clearance / background check completion for AI Transformation Leader
5. Confluence, JIRA, Rovo access confirmed for all 6 pilot participants
6. Control team selection (RTE + Agile Delivery Manager) before PI Planning

## 12. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Copilot access not provisioned in time | Delays dev/tester workflows | Start pilot with Rovo-only for BA/Tester; bring in developers when access lands |
| Federal-level pullback of AI tools | Pilot halted mid-PI | Stay strictly within DoIT policy; document all usage; avoid expansion beyond approved tools |
| Low-quality inputs degrade AI output | Bad stories produce worse output with AI | Mandatory training before tool use; prompt templates; peer review |
| Baseline disputes | Can't prove improvement | Lock baselines with client leadership in writing before Sprint 1 |
| BA inexperience masks AI errors | Quality regression | Pair junior BAs with senior review during pilot |
| Pilot team pulled to delivery firefighting | Measurement invalidated | Delivery Lead protects pilot capacity; pilot work is their primary work |

## 13. Deliverables

| Deliverable | Owner | Due |
|---|---|---|
| Pilot scope (this doc) approved | Project Team → Delivery Lead → Client Executive Sponsor | Before PI Planning |
| DCFS AI Guardrails Document (WBS 1.12) | AI Transformation Leader | Apr 25 |
| Pilot Plan Approval meeting | Delivery Lead + AI Transformation Leader | Apr 22–27 |
| Governance Sign-off (WBS 1.16) | Client Governance Lead | May 4 |
| Baseline metrics locked | AI Transformation Leader + RTE + Client Leadership | Apr 30 |
| Training materials v1 (BA, Dev, SA, Tester) | AI Transformation Leader | May 7 (PI Planning) |
| Prompt library in Confluence | AI Transformation Leader + pilot team | Sprint 1 |
| Measurement dashboard | AI Transformation Leader + Data Architect | Sprint 2 |
| Mid-PI checkpoint report | AI Transformation Leader | Sprint 3 |
| End-of-PI results + role playbooks | AI Transformation Leader | End of PI |
| Scale-out recommendation | AI Transformation Leader + Delivery Lead | End of PI |

## 14. Project Plan / Schedule (Call Update 2026-04-17)

Near-term WBS items to complete before the Governance Sign-off gate:

| WBS | Task | Start | End | Owner | Status | Notes / Deliverables |
|---|---|---|---|---|---|---|
| 1.11 | Tool Authorization List | 4/14 | 4/18 | Vinay | **Completed** | Approved Tool Authorization List (tool, vendor, model, approval status, restrictions). Copilot multi-model, M365 Copilot, Power Platform Copilot, ADO/GitHub Advanced Security, Confluence AI, Eggplant AI. |
| 1.12 | DCFS AI Guardrails Document | 4/14 | 4/25 | Vinay | **In Progress** | Data boundaries (no PII, no CANTS, no security docs), human-in-the-loop rules, regulatory mapping (HIPAA, FERPA, 42 CFR Part 2, CCWIS). Depends on WBS 1.5. |
| 1.13 | PMO BA Assignment | 4/21 | 4/24 | Romi | Not Started | Romi to work with PMO to confirm Valerie Hutton's pilot participation. |
| 1.14 | Create Scope Document | 4/17 | 4/22 | Vinay | Not Started | This document (`docs/dcfs-ilc-pilot-scope.md`) finalized for Pilot Plan Approval meeting. |
| 1.15 | Pilot Plan Approval | 4/22 | 4/27 | Romi / Vinay | Not Started | Meeting with Dave. Agenda: Scope, Notice, Tools, Project Plan, **Gartner (Do we?)**, Metrics baseline, Pair Programming. Baseline metrics locked in this session. |
| 1.16 | Governance Sign-off — Approve Package for Pilot | 4/28 | 5/4 | Dave | Not Started | Gate before Pilot (not Baseline). All blockers resolved, governance team named, guardrails approved. Depends on WBS 1.5, 1.6, 1.7, 1.9, 1.12, 1.15. Deliverable: signed governance approval (email or meeting minutes) authorizing Pilot phase. |

### Open Decisions for Pilot Plan Approval (4/22–4/27)

- **PMO / Story QA participation in pilot.** Current roster: 6 pilot participants (BA + SA + 2 Developers + 2 Testers). PMO inclusion (bringing roster to 7) is pending confirmation with CSG. Decision affects WBS 1.13 (PMO BA Assignment) and whether story-QA bottleneck relief is addressed in the pilot or deferred to WBS 8.2a.
- **Governance model — split responsibility or full-client review.** The current plan routes all methodology, team, training, and measurement decisions through client governance approval, placing WBS 1.16 (Governance Sign-off) on the critical path with six upstream dependencies and putting PI Planning (May 5) at risk. **Recommendation:** split governance — client governs state-owned concerns (tool licensing, data boundaries, DoIT notice filings, state system access, final pilot go/no-go); delivery partner self-governs execution internals (pilot methodology, Krasan-staff team composition, training content, measurement approach, internal playbook drafts). Expected compression: approval chain from ~3 weeks to ~1 week, with baseline/design running in parallel. Full vendor-governed AI use is not recommended because state-purchased licenses, state data infrastructure, and DoIT AI policy are client regulatory obligations a vendor cannot approve on the state's behalf.
- **AI Maturity framework.** Recommendation: Gartner 5-stage model (Awareness → Active → Operational → Systemic → Transformational) as the maturity axis for assessment. Alternative frameworks to be evaluated at this meeting.
- **Baseline metrics.** Lock metric set and capture approach before pilot Sprint 1 (see §8).
- **Pair programming.** Inclusion and role in baseline measurement to be determined.
- **DoIT notice.** Confirm whether any state AI notice / assessment filing is required before pilot kickoff.

---

## 15. Open Items

1. Confirm 2 additional BAs (Sr + Jr) for the pilot team to match target composition
2. Confirm whether Anudeep (Junior Developer) counts toward 2-Sr-Dev target or add one more Senior Developer
3. Capture full list of **additional tools requested** beyond Copilot and Rovo
4. Identify 1–2 control teams for comparison
5. Receive DoIT AI policy from Jim
6. Confirm access to Rovo and provision Copilot for all 6 participants (plus Valerie for Rovo)
7. Confirm PMO (CSG) vendor alignment and Valerie Hutton's availability for pilot commitment
8. Define story qualification rubric Valerie uses today — needed to configure Rovo pre-screen prompts

---

*Prepared for client and delivery leadership review. Not for external distribution.*
