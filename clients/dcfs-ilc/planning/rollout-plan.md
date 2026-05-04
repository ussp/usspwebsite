# DCFS Illinois Connect — AI-Augmented Agile Delivery Plan

> **Version:** V04272026 (DRAFT v6.2)
> **Status:** Updated post-Apr 23–24 discovery sessions — tester role manual-UI ceiling surfaced; **Zephyr Scale Agent for Atlassian Rovo** identified as high-value new tool (pending DoIT §5f notice); Dynamics developer workflow precedence captured; Apr 24 governance review feedback incorporated
> **Framework Guide:** See [guide/README.md](guide/README.md) for the complete 13-chapter framework reference
> **Scope details:** See [deliverables/scope-running-book-v04212026.md](deliverables/scope-running-book-v04212026.md) (v0.2) — living source of truth for in-scope, out-of-scope, Phase 2/3 candidates, tool asks, and what can be measured in Pilot 1
> **Role playbooks (v0 drafts) — 5 roles:** [BA](deliverables/playbooks/playbook-ba-v04212026.md) · [Tester](deliverables/playbooks/playbook-tester-v04212026.md) · [Testing Services Lead](deliverables/playbooks/playbook-testing-services-lead-v04222026.md) · [Developer](deliverables/playbooks/playbook-developer-v04212026.md) · [Data](deliverables/playbooks/playbook-data-v04212026.md) — refined into v1.0 deliverables at end of pilot PI
> **Owner:** Vinay Lagisetty (AI Transformation Leader, Krasan) + Romi (Engagement Director, Krasan)
> **Audience:** Dave (Interim AI Lead), Jim Daugherty (CIO, DCFS/DoIT), Dinkar (Krasan Executive Sponsor)
> **Methodology:** GQM (Basili 1994), DORA/Accelerate (Forsgren 2018), SPACE (Microsoft Research 2021), QUS (Lucassen 2016), Six Sigma DMAIC, NIST AI RMF 1.0

## Change log
- **v6.2 (Apr 27):** Three discovery meetings processed (Apr 23 Dynamics developer workflow, Apr 24 testing workflow, Apr 24 governance charter review). Key updates:
  - Per-role candidate metric selection moved from baseline phase → **design phase as a formal deliverable** (per Apr 24 governance review).
  - **Tester role flagged at risk of missing uniform 15% target** — workflow is ~80% manual UI execution where AI cannot drive under HITL governance. Consider role-specific targets (see §9).
  - **NEW TOOL IDENTIFIED: Zephyr Scale Agent for Atlassian Rovo** — bridges Rovo into Zephyr Scale so generated test cases save directly into Zephyr folders linked to JIRA stories. Highest-value tester acceleration. **NOT in current authorized 4 — requires DoIT §5f 30-day notice before pilot use.**
  - **GitHub Copilot enablement gap** — licensed by DoIT but not yet provisioned for this team's GCC environment. Hard blocker for highest-value developer use cases.
  - **Visio→Mermaid conversion** added as cross-cutting prerequisite (Visio-as-JPEG diagrams are not AI-parseable; surfaced Apr 16 architect side, confirmed Apr 23 dev side).
  - **DCFS Work Product template** adoption is now a cross-deliverable rule for all client-shareable artifacts (per Apr 24 governance review).
  - **Prompt-logging owner gap inside DCFS** identified as governance gap (PII detection at scale) — separate Vinay+Jeff call needed; deferred to post-pilot but must be a named pilot output.
  - Pilot governance charter v0.3 DRAFT delivered in DCFS template format on Apr 24; v2 charter milestone Apr 27.
- **v6.1 (Apr 22):** Reconciled 5-role vs 4-role inconsistency. **Testing Services Lead** (formerly "Test Lead") added as 5th Phase 1 role — portfolio-level owner of the testing bottleneck, highest leverage on the % Work Completed headline. Playbook v0 drafted. Tool-ask gap list added to scope book §2.5: Power BI Copilot, Teams/SharePoint/Loop Copilot, ADO Copilot, verification of Eggplant AI + Zephyr AI features.
- **v6 (Apr 21):** Apr 21 Jira/process walkthrough findings captured in new [scope-running-book-v04212026.md](deliverables/scope-running-book-v04212026.md). Key new framing: testing is the bottleneck; story quality is the upstream lever; dual-pipeline measurement (refinement + delivery); V3 workflow transition is a measurement confound risk. Four role playbooks (v0) drafted for pilot kickoff: BA, Tester, Developer, Data.
- **v5 (Apr 20):** Pilot team confirmed = Intact (5-6 people). Governance simplified — no external approval gates. Metrics defined post-baseline. Tuesday 8 AM CT cadence. Approved toolset corrected (Claude NOT approved; add M365 Copilot + D365 Copilot). 30-day notice reframed as task. PI 20 Planning dates confirmed May 5+7; Sprint 2.1 starts May 14.
- **v4 (Apr 14):** Post-Jim meeting.

---

## 1. Executive Summary

Krasan proposes a structured AI augmentation pilot across select ILC product teams to measurably improve delivery productivity and quality. AI tools available to the State — **GitHub Copilot** (multi-model: OpenAI, Google Gemini, Anthropic Claude), **Atlassian Rovo**, and **Dynamics 365 Power Platform AI** — will be applied to BA-Technical, Configuration, Developer, Tester, and Scrum Master workflows with structured training, clear guardrails, and research-backed measurement.

**Target:** 10-15% productivity improvement within 13 weeks (1 PI), measured by tangible outputs (lines of code, documentation, configuration generated) — not story points.

**Approach:** Govern → Baseline → Design → Train → Pilot → Measure → Playbook → Scale

**Philosophy:** AI amplifies the existing team — same people, better tools, more output. No workforce reduction. AI-assisted code generation is in scope from day one, with mandatory human-in-the-loop review (developer accepts/edits every suggestion; peer review + PR approval before commit).

**Governance:** DCFS-led governance team (NIST AI RMF + DoIT AI Policy aligned). Krasan executes and reports. See [governance proposal](governance-proposal-v04142026.md).

**Interim Contact:** Dave (designated by Jim during his absence).

---

## 2. Context

### The Engagement
- **Project:** Illinois Connect (ILC) — legacy child welfare system modernization to Microsoft Dynamics 365
- **Scale:** 12 SAFe product teams, 160+ Krasan consultants, part of a single ART
- **Domain:** Department of Child and Family Services — at-risk children intake through safe placement
- **Tech stack:** Dynamics 365, Visual Studio, JIRA, Confluence, GitHub

### The Ask
CIO Jim Daugherty has asked Krasan to develop and execute an AI rollout plan to improve productivity across the ILC product teams. The target is **10-15% improvement within 13 weeks**, measured by tangible outputs. AI-assisted code generation is in scope under a mandatory human-in-the-loop model (per DoIT AI Policy section 4d and 5d). Dave is designated interim AI lead during Jim's absence.

### Current State
- Teams are delivering satisfactorily — client is happy with current commitments
- No AI augmentation in place (greenfield opportunity)
- Environment deployment issues recently resolved (no longer a blocker)
- Baseline velocity data exists per team in JIRA
- Informal Copilot testing by John (Agile Delivery Manager) showed mixed results:
  - AI amplifies quality — good input produces better output; bad input produces worse output
  - Rovo outperforms Copilot for story writing (Confluence gives it project context)
  - Pure AI-generated content without human guidance is poor quality
  - BA skill is the critical factor in AI tool effectiveness

---

## 3. Governance & Compliance

### 3.1 State of Illinois DoIT AI Policy (Effective April 1, 2025)

All AI use by State agencies must comply with the DoIT "Policy on the Acceptable and Responsible Use of Artificial Intelligence." Key requirements for our pilot:

| Requirement | DoIT Section | How We Comply |
|-------------|-------------|---------------|
| Human in the loop for all AI decisions | 4d, 6 | AI suggests, human decides — mandatory review before accepting any AI output |
| No access to protected data without Agency Head authorization | 4f | No DCFS case data in AI prompts; Copilot/Rovo process code and JIRA stories only |
| No discrimination or bias | 4a, 11 | Bias awareness training; per-sprint review of AI-generated content |
| Transparency — disclose AI use to users | 5a-c | Written disclosure to all pilot participants; AI-assisted deliverables labeled |
| AI System Assessment Report with Agency Head signoff | 5f | **NEEDS CLARIFICATION:** Are Copilot/Rovo already assessed? If not, report needed 30 days before launch |
| State data use requires Agency Head written consent | 5e | **NEEDS CLARIFICATION:** Does Copilot accessing ILC code = "State data for AI purposes"? |
| Continuous monitoring and documentation | 7 | tools.ussp.co provides continuous measurement, documented baselines, audit trail |
| Security reporting process | 12 | AI security awareness in training; reporting channel established |
| Bias mitigation — regular reviews, corrective action | 11 | Per-sprint bias spot checks; documented review process |

> **Critical path:** If DoIT assessment and 30-day notice have NOT been filed, earliest legal pilot start is 30 days after filing. This must be confirmed with Jim by April 8.

### 3.2 DCFS-Specific Constraints

| Constraint | Source | Impact |
|-----------|--------|--------|
| Human-in-the-loop on all AI output | DoIT Policy 4d + 5d | Developer reviews/edits/accepts every AI suggestion; peer review + PR approval before commit. No autonomous commits. |
| No sensitive DCFS data in prompts | DoIT Policy 4f | Training required; child welfare data is highly sensitive |
| Only state-approved AI tools | Jim | Start with Copilot + Rovo; any additional tools require state approval process |
| CMS precedent — tools can be pulled | Dinkar | October 2025: Federal pulled AI tools from CMS/Medicare mid-sprint. We must stay well within boundaries |

---

## 4. Approach: Govern → Baseline → Train → Pilot → Measure → Playbook → Scale

### Phase 0: Governance & Access (Apr 7–17)

| # | Task | Owner | Due | Status |
|---|------|-------|-----|--------|
| 1 | Confirm DoIT assessment status for Copilot/Rovo | Romi (ask Jim Apr 8) | Apr 8 | TODO |
| 2 | Get Vinay access clearance from Jim | Romi | Apr 8 | TODO |
| 3 | Obtain DoIT AI Policy compliance status from Jim | Robert | Apr 10 | TODO |
| 4 | Create Krasan email/network access for Vinay | Dinkar's team | Apr 10 | TODO |
| 5 | JIRA/Confluence walkthrough with Matt | Vinay + Matt | Apr 10 | TODO |
| 6 | Architecture/dev process walkthrough with architect | Vinay + Darren | Apr 12 | TODO |
| 7 | Understand JIRA workflow states for metric computation | Vinay + Matt | Apr 12 | TODO |
| 8 | Confirm Copilot deployment status and timeline | Romi + Jim | Apr 8 | TODO |
| 9 | Review and finalize this rollout plan | All | **Apr 17** | IN PROGRESS |

### Phase 1: Baseline & Design (Apr 17–30)

> See [Ch 4: Readiness Assessment](guide/04-readiness-assessment.md), [Ch 5: Baseline](guide/05-baseline-measurement.md), [Ch 6: Process Design](guide/06-process-design.md)

| # | Task | Owner | Due |
|---|------|-------|-----|
| 10 | Executive discovery interview with Jim (metrics + governance) | Vinay + Romi | Before Springfield trip |
| 11 | Run Jira Quality Scanner to auto-compute baseline metrics | Vinay + Matt | Apr 21 |
| 12 | Collect baseline velocity data — last 3 sprints, all 12 teams | Vinay + Matt | Apr 23 |
| 13 | Distribute AI Readiness Assessment to all 12 teams | Vinay | Apr 21 |
| 14 | Analyze readiness results — skills gaps, resistance areas, infrastructure | Vinay | Apr 25 |
| 15 | Distribute baseline SPACE/DevEx survey to pilot team candidates | Vinay | Apr 25 |
| 16 | Select pilot teams based on readiness + baseline data | Romi + John + Chase | Apr 25 |
| 17 | Map current → AI-augmented state for SDLC processes per role | Vinay | Apr 28 |
| 18 | Per-role candidate metric set selected (formal **design-phase** deliverable per Apr 24 governance review — was previously a baseline-phase task) | Vinay + role leads | Apr 28 |
| 18a | Visio→Mermaid conversion for IllinoisConnect architecture diagrams (cross-cutting AI ingestion prerequisite — surfaced Apr 16 architect side, confirmed Apr 23 dev side) | Vinay + Shyam/Kashif | Apr 30 |
| 19 | Produce baseline metrics report | Vinay | Apr 30 |

### Phase 2: Train (Late April / Early May)

> See [Ch 7: Training Delivery](guide/07-training-delivery.md) for full 6-track plan

| # | Task | Owner | Due |
|---|------|-------|-----|
| 20 | Build training materials — prompt libraries, examples, cheat sheets | Vinay | End of Apr |
| 21 | Deliver Foundation track (1.5h) — DoIT compliance, guardrails, success criteria | Vinay + Robert | Week before PI Planning |
| 22 | Deliver BA track (3h) — story quality, AC generation with Rovo | Vinay | Week before PI Planning |
| 23 | Deliver Tester track (3h) — test generation from AC, Rovo/Copilot | Vinay | Week before PI Planning |
| 24 | Deliver Developer track (3h) — code explanation, docs, refactoring with Copilot | Vinay | Week before PI Planning |
| 25 | Deliver Scrum Master track (2h) — sprint insights, metrics, coaching adoption | Vinay | Week before PI Planning |
| 26 | Deliver Leadership Briefing (1h) — what AI does/doesn't, dashboard demo | Vinay + Romi | Week before PI Planning |
| 27 | Draft role-based playbooks from process designs + training materials | Vinay | End of Apr |
| 28 | Springfield trip — present plan to Jim | Romi + Vinay | Before May 5 |

### Phase 3: Pilot & Measure (May 5 – July, 1 full PI)

> See [Ch 8: Pilot Execution](guide/08-pilot-execution.md), [Ch 9: Measurement](guide/09-measurement-reporting.md)

| # | Task | Owner | Cadence |
|---|------|-------|---------|
| 29 | PI Planning — introduce AI pilot to ART | Romi + Vinay | May 5–7 |
| 30 | Configure tools.ussp.co — engagement, teams, baseline data loaded | Vinay | May 5 |
| 31 | Share read-only dashboard URL with Jim | Vinay + Romi | May 5 |
| 32 | AI-augmented teams operate with trained tools and practices | Pilot teams | Daily |
| 33 | Non-AI teams continue as-is (control group) | Control teams | Daily |
| 34 | Weekly check-ins: what's working, what's not, adjustments | Vinay + Romi | Weekly |
| 35 | Continuous metrics collection via JIRA + tools.ussp.co | Vinay | Ongoing |
| 36 | Per-sprint bias and quality spot checks | Pilot team leads | Per sprint |
| 37 | Mid-pilot pulse survey (end of sprint 3) | Vinay | Mid-PI |
| 38 | Document adoption challenges and best practices | All | Ongoing |

### Phase 4: Playbook & Scale (End of Pilot PI)

> See [Ch 10: Playbooks](guide/10-playbooks.md), [Ch 11: Scale](guide/11-scale-rollout.md)

| # | Task | Owner | Due |
|---|------|-------|-----|
| 39 | Post-pilot SPACE/DevEx resurvey | Vinay | End of PI |
| 40 | Compile measurement results: AI teams vs baseline vs control | Vinay | End of PI |
| 41 | Produce Pilot Results Report with before/after comparison | Vinay | End of PI |
| 42 | Finalize role-based playbooks (BA, Tester, Developer, Scrum Master) | Vinay | End of PI |
| 43 | Executive results dashboard + 1-page brief for Jim | Vinay + Romi | End of PI |
| 34 | Go/no-go recommendation for full ART rollout | Romi + Dinkar | End of PI |

---

## 5. Target Roles & AI Use Cases

### Approved Use Cases (from DCFS AI Rollout Plan + meeting)

| Role | AI Tool | Use Case | Expected Benefit |
|------|---------|----------|-----------------|
| **BA** | Rovo (JIRA AI) | User story quality assessment and refinement | Faster story authoring, fewer review cycles |
| **BA** | Rovo + Confluence | Acceptance criteria generation (Gherkin format) | Better testability, clearer requirements |
| **BA** | Rovo | Requirement summarization, impact analysis, refinement prep | Reduced BA prep time |
| **Tester** | Rovo / Copilot | Test script generation from acceptance criteria | Faster test creation, better coverage |
| **Tester** | Copilot | Edge case identification, test data generation | Fewer defect escapes |
| **Developer** | Copilot | Code explanation — paste complex code, get explanation + bug identification | Faster onboarding, faster debugging |
| **Developer** | Copilot | Unit test scenario suggestions (dev still writes code) | 10-20% time savings per story |
| **Developer** | Copilot | Technical documentation generation from code | Hours saved per sprint |
| **Developer** | Copilot | Refactoring suggestions (dev still implements) | Better code quality |
| **Data** | TBD | TBD (Chase to identify) | TBD |

### Explicitly NOT Approved

| What | Why |
|------|-----|
| Autonomous AI commits (no human review) | DoIT policy 4d: human-in-the-loop on all AI decisions; 5d: human reviews AI output before use |
| Pasting DCFS case data / PII into AI prompts | DoIT policy 4b, 4f: protected data restrictions |
| Using non-state-approved AI tools | Jim: only Copilot + Rovo without further approval |

> **Apr 27 update — workflow discovery findings (Apr 23 + Apr 24 walkthroughs)**
>
> **Developer (Apr 23, with Jeff/Kali/Chaitanya — illinois.gov):** Strict implementation precedence at DCFS — OOB Dynamics rules → North52 (low-code rule engine) → JavaScript (VS Code/Notepad++) → .NET plugins / PCF / Azure Functions (Visual Studio). Highest-value Copilot fits: plugin/PCF/Azure Function authoring in VS, JavaScript form-event handlers, Power Automate flow scaffolding (Copilot pane already enabled). **Power Apps form designer Copilot NOT enabled in GCC tenant** (release-cadence gap). JIRA Rovo story decomposition proven live in session.
>
> **Tester (Apr 24, with Jeff/Remya/Kamila — illinois.gov):** Workflow is ~80% manual UI execution and ~20% authoring. AI gains land primarily in the 20% authoring slice (test case generation from acceptance criteria, sprint/PI test reports — currently no reports exist, so any output is additive). **Manual UI execution unlikely to move under HITL governance.**
>
> **🆕 NEW TOOL: Zephyr Scale Agent for Atlassian Rovo**
> Bridges Rovo into Zephyr Scale so generated test cases save directly into Zephyr folders linked to a JIRA story (current Rovo limitation: can only post a JIRA comment). Suggested by Vinay during a live demo where a real Intact story was pasted into Rovo and produced 4 role-based test cases plus a negative case — but no path to land them in Zephyr without manual paste.
> - **Status:** NOT in current authorized 4 (GitHub Copilot, Atlassian Rovo, M365 Copilot, D365 Copilot).
> - **Action required:** DoIT §5f 30-day notice before pilot use.
> - **Owners:** Jeff Lobo + Carl Lobo (JIRA admin) scoping enablement; Vinay drafts §5f notice.
> - **Pilot fallback if not enabled in time:** generate via Rovo, manual copy-paste into Zephyr folders.
>
> **🚧 BLOCKER: GitHub Copilot enablement** — licensed by DoIT but not yet provisioned for this team's GCC environment. Blocks the highest-value developer use cases (plugin/PCF/Azure Function authoring). Vinay + Romi to escalate.

---

## 6. Measurement Framework

### 6.1 Methodology

Our measurement approach is grounded in published, peer-reviewed research:

| Framework | Source | What It Provides |
|-----------|--------|-----------------|
| **GQM** (Goal-Question-Metric) | Basili et al. 1994, University of Maryland / NASA | Measurement design — every metric traces to a business goal |
| **DORA / Accelerate** | Forsgren, Humble, Kim 2018 (Google) | Delivery performance metrics (velocity, lead time, failure rate) |
| **SPACE** | Forsgren et al. 2021 (Microsoft Research, ACM) | Multi-dimensional team health (satisfaction, performance, communication) |
| **QUS** (Quality User Story) | Lucassen et al. 2016 (Utrecht University) | 13-criteria story quality scoring |
| **Six Sigma DMAIC** | Harry & Schroeder 2000 | Before/after measurement methodology (Define, Measure, Analyze, Improve, Control) |
| **ISO/IEC 25010** | ISO 2023 | International standard for software product quality |

### 6.2 Proposed Metrics

**Note:** Final metrics to be selected after executive discovery interview with Jim. Recommended starter set below — pick 8-12 max to avoid measurement burden.

> **Apr 27 update — per-role metric selection moved to design phase**
>
> Per the Apr 24 governance charter review, **per-role candidate metric selection is now a formal design-phase deliverable**, not a baseline-phase task. Each role lead drives candidate metric refinement against the role's actual workflow (informed by Apr 23/24 discovery walkthroughs). The per-role candidate metric set lives in `deliverables/metrics/pilot-metrics-by-role-v04232026.md` — to be re-versioned post-discovery.
>
> **New tester-side candidate baselines (from Apr 24 walkthrough):**
> - test-case-authoring-time
> - test-cases-per-story
> - negative-case-coverage %
> - test-report-drafting-time *(NEW metric — no sprint/PI reports exist today, so any AI-drafted output is purely additive)*
>
> **Caveat:** test-execution-time metric will be hard to move because ~80% of tester work is manual UI execution where AI cannot drive (HITL governance forbids autonomous).
>
> **New developer-side candidate baselines (from Apr 23 walkthrough):**
> - time per JS validator
> - time per North52 expression
> - time per .NET plugin
> - story-to-deploy cycle time
> - % stories needing rework due to incomplete acceptance criteria

#### Velocity & Delivery (from JIRA — automated)

| Metric | Definition | Source | Research |
|--------|-----------|--------|----------|
| Sprint velocity | Avg story points completed per sprint | JIRA | DORA (throughput) |
| Cycle time | Avg days from "In Progress" to "Done" | JIRA | DORA (lead time) |
| Throughput | Items completed per sprint | JIRA | DORA (throughput) |
| Sprint predictability | Committed vs delivered points | JIRA | SPACE (performance) |

#### Quality (from JIRA + manual — see Jira Quality Scanner)

| Metric | Definition | Source | Research |
|--------|-----------|--------|----------|
| Story quality score | Checklist score: AC, clarity, format, completeness | JIRA scanner + manual | QUS 13-criteria |
| Story rejection rate | % stories sent back for rework after review | JIRA transitions | Six Sigma (rework) |
| First pass yield | % stories passing QA on first attempt | JIRA transitions | Six Sigma (FPY) |
| Test coverage | % of stories with linked test cases | JIRA links | ISO 25010 (testability) |
| Defect density | Bugs per story point delivered | JIRA | Capers Jones (DRE) |

#### Efficiency (from JIRA — automated)

| Metric | Definition | Source | Research |
|--------|-----------|--------|----------|
| Story review cycle time | Days from story draft to "Ready for Dev" | JIRA | DORA (lead time) |
| Test creation time | Hours to create test scripts per story | Manual tracking | SPACE (efficiency) |

#### Team Health (survey — via tools.ussp.co)

| Metric | Definition | Source | Research |
|--------|-----------|--------|----------|
| SPACE survey (5 dimensions) | Satisfaction, Performance, Activity, Communication, Efficiency | Survey (1-5 scale) | Forsgren 2021 (ACM) |
| Requirement clarity | "Requirements are clear when I start work" | Survey (1-5 scale) | SPACE (communication) |

### 6.3 Measurement Approach

| Phase | What We Measure | How |
|-------|----------------|-----|
| **Baseline** (Apr) | All selected metrics from last 3 sprints | JIRA export + Jira Quality Scanner + SPACE survey |
| **During Pilot** (May–Jul) | Same metrics, same cadence | Continuous collection from JIRA + bi-weekly surveys |
| **Post-Pilot** | Same metrics from pilot PI | JIRA export + survey + comparison report |
| **Comparison** | AI pilot teams vs baseline vs control teams | Before/after delta analysis via tools.ussp.co |

### 6.4 Measurement Tool

All metrics tracked in the **AI Transformation Monitor** at `tools.ussp.co`:
- Research-backed computation (DORA, SPACE, DevEx, QUS)
- Before/after comparison with improvement percentages
- JIRA integration for automated metric collection
- Survey system for team health metrics
- Role-based training plan generation
- Executive report with benchmarks against Forrester, McKinsey, GitHub research

---

## 7. Pilot Team Selection

### Selection Criteria
- Technically mature team with strong leadership
- Strong BAs who can evaluate AI output quality (critical — AI amplifies skill)
- Cooperative PO/BA/Dev relationship
- Representative workload (not the most complex or unstable team)
- Each pilot team minimum: 1 BA, 1 Tester, 1 Developer

### Proposed Structure
- **2-3 pilot teams** receive AI training and tools
- **Remaining teams** continue as-is (control group for comparison)
- John has identified candidate names; Chase to add data team representatives

### Pilot Participants Per Team

| Role | Count | AI Focus |
|------|-------|----------|
| BA | 1 | Story quality, AC generation, refinement prep |
| Tester | 1 | Test generation from AC, edge cases |
| Developer | 1-2 | Code explanation, docs, refactoring suggestions |
| Scrum Lead | 1 | Oversight, weekly check-in reporting |

---

## 8. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| State pulls AI tools mid-pilot (CMS precedent, Oct 2025) | Medium | High | Full DoIT policy compliance upfront; stay within boundaries; document everything |
| DoIT 30-day notice not yet filed — delays pilot launch | Unknown | High | Clarify with Jim by Apr 8; if not filed, file immediately |
| AI makes stories/tests worse (garbage in, garbage out) | High | Medium | Training first; quality checklist; mandatory human review |
| Copilot not deployed to teams in time | Medium | Medium | Start with Rovo (already available); Copilot is additive, not required for Phase 1 |
| Baseline metrics not available in JIRA | Low | Medium | Jira Quality Scanner auto-computes from existing data; manual fallback |
| Sensitive child welfare data in AI prompts | Low | Critical | Strict training; "No PII" rule in every playbook; spot checks per sprint |
| Pilot teams not representative | Low | Low | Selection criteria; 2-3 diverse teams |
| Team resistance to AI tools | Medium | Medium | Voluntary pilot with strong participants; training shows value before asking for adoption |
| **R-NEW-6** Zephyr Scale Agent for Rovo §5f notice timeline (Apr 27) | Medium | Medium | Pilot fallback: Rovo-only with manual copy-paste from JIRA comment to Zephyr folders. File §5f notice immediately to clear path for full Agent before Pilot Sprint 2 |
| **R-NEW-7** GitHub Copilot enablement gap — licensed by DoIT, not yet provisioned for team GCC environment (Apr 27) | High | High | Vinay + Romi escalate to Jim/David; if unresolved before pilot start, developer use cases shift to Rovo-only and JS-Copilot-via-VS-Code path |
| **R-NEW-8** Tester role unable to hit uniform 15% productivity target due to ~80% manual UI execution (Apr 27) | High | Medium | Adopt **role-specific targets** (see §9 update); tester gains land in 20% authoring slice + new sprint/PI report drafting (gap today = pure upside) |
| **R-NEW-9** Power Apps form-designer Copilot missing in GCC tenant (Apr 27) | Medium | Low | Release-cadence gap — confirm with Microsoft / DoIT; affects only ~10% of dev workflow; not a pilot-blocker |
| **R-NEW-10** Baseline pollution from pre-pilot AI tool exploration (Apr 27) | Medium | Medium | Tighten baseline window; document any pre-pilot tool usage by team members; consider exclusion criteria when computing deltas |
| **R-NEW-11** Story quality dependency on AI gains — bad input → worse output (Apr 27) | High | Medium | BA training first; story hygiene pre-check in dev playbook; AI amplifies skill |
| **R-NEW-12** Visio-as-JPEG architecture diagrams not AI-parseable (Apr 27) | High | Low | Visio→Mermaid conversion as cross-cutting prerequisite (task 18a) |
| **R-NEW-13** Prompt-logging owner gap inside DCFS (PII detection at scale) (Apr 27) | High | High | Surfaced Apr 24 — separate Vinay+Jeff call needed; deferred to post-pilot but must be a named pilot output |
| **R-NEW-14** Tester peer-review checklist absent (Apr 27) | Medium | Medium | Create checklist (Kamila + Vinay) — prerequisite for AI peer-review pre-screening use case |
| **R-NEW-15** Sprint/PI test-report baseline gap — no reports exist today (Apr 27) | Low | Low | Reframe as opportunity: AI-drafted reports are pure additive output; build a template before pilot starts |
| **R-NEW-16** Wrong-Vinay email-collision risk (operational — multiple Vinays in DCFS distribution lists) (Apr 27) | Low | Low | Always use full email with `vinay.lagisetty@krasanconsulting.com`; Alec to verify distribution lists |

---

## 9. Success Criteria (Updated April 13 — Jim's Targets)

| Criterion | Target | How Measured |
|-----------|--------|-------------|
| **Tangible output improvement** | **10-15%** | Lines of code, documentation, configuration generated (pilot vs baseline) |
| Cycle time reduction | >= 10% | JIRA transition timestamps |
| Quality maintained or improved | No increase in defect density | JIRA defect tracking |
| Story rejection rate reduction | Measurable decrease | JIRA transitions |
| First pass yield improvement | Measurable increase | JIRA transitions |
| Team satisfaction (SPACE survey) | No decrease (ideally increase) | Survey scores |
| Playbooks produced | 1 per role | BA-Tech, Config, Developer, Tester, Scrum Master |
| DoIT policy compliance | 100% | Documented compliance on all 12 sections |
| Human-in-the-loop adherence | 100% of AI-assisted commits pass through developer review + peer PR approval | Audit via PR history + per-sprint spot checks |

> **Apr 27 update — role-specific targets consideration**
>
> The uniform 10–15% target may not fit all 5 roles equally. Per the Apr 24 testing walkthrough, ~80% of tester work is manual UI execution where AI cannot help under HITL governance — a uniform 15% applied only to the 20% authoring slice nets ~3% portfolio impact for that role. Recommend differentiated targets in the design phase, defended by per-role workflow analysis:
>
> | Role | Plausible target | Rationale |
> |------|------------------|-----------|
> | BA / BA-Tech | 15–20% | Story authoring, AC generation, refinement prep — high AI fit |
> | Developer (config-heavy) | 10–15% | JS, Power Automate flows, plugin authoring — strong Copilot fit (gated on Copilot enablement) |
> | Tester | 5–10% (authoring slice) | 80% manual UI execution unmovable; gains in test-case-authoring + new sprint/PI report drafting |
> | Testing Services Lead | 10–15% | Portfolio-level reporting, cross-team pattern detection |
> | Solution Architect | 10–15% | Documentation generation, pattern explanation — M365 Copilot fit |
>
> **Headline:** retain a single 10–15% portfolio target for executive comms; refine internal per-role targets in the design phase.

See [measurement-methodology-v04142026.md](measurement-methodology-v04142026.md) for full methodology.

---

## 10. Timeline

| Date | Milestone |
|------|-----------|
| Apr 7 | Planning meetings begin (2x/week) |
| Apr 8 | Romi meets Jim — clearance, DoIT status, Copilot deployment |
| Apr 7-12 | Vinay onboarding: JIRA (Matt), Architecture (Darren), role workflows |
| **Apr 17** | **This plan finalized and shared with Romi/Dinkar** |
| Apr 17-25 | Executive discovery interview with Jim; pilot team selection |
| Apr 21 | Run Jira Quality Scanner — auto-compute baseline |
| Apr 25 | Baseline SPACE/DevEx surveys distributed |
| Apr 28 | Metrics set finalized based on Jim's priorities |
| Apr 30 | Baseline metrics report complete; training materials ready |
| Late Apr | Springfield trip — present plan to Jim |
| **May 5-7** | **PI Planning — AI pilot announced, begins with new PI** |
| May-July | Pilot execution — weekly check-ins, continuous measurement |
| End of PI | Pilot results report, playbooks, rollout recommendation |
| **Month 5** | ART-wide rollout (if pilot succeeds) |

---

## 11. Deliverables

| # | Deliverable | Due | Owner |
|---|------------|-----|-------|
| 1 | This rollout plan | Apr 17 | Vinay + Romi |
| 2 | DoIT policy compliance status (from Jim) | Apr 8-10 | Romi + Robert |
| 3 | Baseline metrics report | Apr 30 | Vinay |
| 4 | Training materials (per role) | Before PI Planning | Vinay |
| 5 | AI Usage Playbook — DoIT-compliant guardrails | Before PI Planning | Vinay + Robert |
| 6 | Weekly status updates | During pilot | Vinay + Romi |
| 7 | Pilot results report (before/after comparison) | End of pilot PI | Vinay |
| 8 | Role-based playbooks v1.0 (BA, Tester, Developer, Data) — see [v0 drafts](deliverables/playbooks/) | End of pilot PI | Vinay |
| 9 | Executive recommendation for ART-wide rollout | End of pilot PI | Vinay + Romi |
| 10 | **DCFS Work Product template** adopted for all client-shareable deliverables (cross-deliverable rule, per Apr 24 governance review) | Ongoing | Vinay |
| 11 | DoIT §5f 30-day notice for Zephyr Scale Agent for Atlassian Rovo (per Apr 27 finding) | Apr 30 (file ASAP) | Vinay + Robert |
| 12 | Pilot governance charter v0.4 — metrics text trimmed, references separate metrics doc (per Jeff's Apr 24 question) | Apr 30 | Vinay |

---

## 12. Working Team

### Client-side (DCFS / Illinois DoIT)
| Person | Role | Contribution |
|--------|------|-------------|
| **Jim Daugherty** | CIO, DCFS | Initiative sponsor; 10–15% productivity target; approved AI code generation under HITL |
| **David Nika** | Deputy CIO — Data Management, Illinois DoIT | **Interim AI lead during Jim's absence**; point of contact for governance, tool authorization, 30-day DoIT notice (David.Nika@illinois.gov) |
| **Darren** | Chief Solution Architect | Architecture context, dev process walkthrough |

### Krasan
| Person | Role | Contribution |
|--------|------|-------------|
| **Vinay Lagisetty** | AI Transformation Leader | Plan, training, measurement, tool assessment, playbooks |
| **Emil "Romi" Kovacs** | Engagement Director | Client relationship (Jim, Dave), access, compliance, account head |
| **Alec Granderson** | Senior PM | Project schedule (Smart Sheets source of truth), milestones, dependencies |
| **Robert Rodriguez** | Workforce Manager | DoIT policy bridge, documentation, onboarding, coordination |
| **Matt Tomeo** | RTE | JIRA/Confluence access, Rovo capabilities, tool config, baseline data |
| **John Luna** | Agile Delivery Mgr | Pilot candidate identification, testing focus, Copilot experience |
| **Jeffrey Lobo** | Enterprise Architect | Maximus audit reqs, arch-side AI use cases |
| **Chase Yeung** | Senior Data Architect | Data team representation, data use cases |
| **Krishna Mekala** | Senior Business Architect / PO | Shared services coordination |
| **Vinay Kumar** | JIRA Admin | JIRA configuration, plugin access |
| **Dinkar** | Executive Sponsor | Strategic direction, pair-programmer procurement |

---

## 13. IP & Productization

This engagement produces reusable assets for Krasan/USSP:
- Role-based AI playbooks (productizable with minor variations)
- AI Transformation measurement methodology and tool (tools.ussp.co)
- Training curriculum for AI-augmented Scrum teams
- Government AI compliance framework (DoIT policy mapping)

Jim is aware and amenable to Krasan/USSP productizing these deliverables.

---

## Appendix A: Open Questions (To Resolve by Apr 17)

- [x] What is the State of Illinois DoIT AI policy? — **Obtained and analyzed**
- [ ] Has DCFS filed DoIT AI System Assessment for Copilot/Rovo?
- [ ] When will GitHub Copilot be deployed to ILC teams?
- [ ] What JIRA workflow states are configured? (needed for cycle time computation)
- [ ] Which specific teams are best candidates for pilot?
- [ ] What process documentation exists in Confluence?
- [ ] What is the CI/CD pipeline? (Azure DevOps? GitHub Actions?)
- [ ] What .NET / TypeScript versions are in use?
- [ ] What automated testing framework do testers use?
- [ ] Can we access JIRA via API for automated metric collection?
- [ ] Does Copilot accessing ILC source code = "State data for AI purposes" per DoIT policy?

## Appendix B: Research Citations

See `methodology-citations.md` for full citations mapping every metric to published research (ISO 25010, DORA, SPACE, QUS, Six Sigma, CMMI, Capers Jones, GQM, NIST, McKinsey).

---

*Draft v2 — April 3, 2026. To be finalized through discovery phase (Apr 7-17) and executive interview with Jim.*
