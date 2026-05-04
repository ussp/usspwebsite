# Scope Running Book — DCFS Illinois Connect AI Pilot

> **Version:** v0.2 — V04222026 (file kept as v04212026 for stable filename; version field tracks edits)
> **Status:** LIVING DOCUMENT — update as scope is confirmed, expanded, or deferred
> **Owner:** Vinay Lagisetty (AI Transformation Leader, Krasan)
> **Audience:** Romi, Jim Daugherty, Dave (interim AI lead), Krasan working team
> **Source sessions:** Working sessions Apr 7-21, 2026 + DCFS Jira/process walkthrough Apr 21
> **Companion docs:** [rollout-plan.md](rollout-plan.md), [measurement-methodology-v04142026.md](measurement-methodology-v04142026.md), [assumptions-and-risks.md](assumptions-and-risks.md), [playbooks/](playbooks/)

---

## Purpose of this document

This is the **single source of truth** for what is in-scope, out-of-scope, deferred, or under consideration for the DCFS AI rollout. It is **versioned and dated** so we can track how scope evolves through pilot, learning, and scale phases.

Every scope decision should be reflected here. Every change updates the change log at the bottom.

---

## Change log

| Version | Date | Changed by | What changed |
|---------|------|-----------|--------------|
| v0.2 | 2026-04-22 | Vinay | Added Testing Services Lead as 5th Phase 1 role (testing bottleneck owner at portfolio level). Added §2.5 Tool Asks — Pending Approval (Power BI Copilot, Eggplant AI, Zephyr AI, Teams Copilot, SharePoint Copilot, ADO Copilot). Updated role × tool matrix and Phase 2 list to remove Scrum Master from Phase 2 → kept Architect/PO/PMO. |
| v0.1 | 2026-04-21 | Vinay | Initial draft following Apr 21 Jira/process walkthrough — captures bottleneck insight (testing), workflow heterogeneity, dual-pipeline measurement, role × tool matrix, Phase 2/3 candidates, things-to-think-about |

---

## 1. Strategic Framing

### 1.1 What we now know about DCFS

After the Apr 21 walkthrough of DCFS Jira, the SDLC, the weekly reports, and the proposed V3 workflow, several findings reshape the AI value story:

| Finding | Why it matters |
|---------|---------------|
| **Testing is the bottleneck** (per John Luna and confirmed by 0/39, 0/37 sprint completion patterns) | AI applied only to dev creates WIP at testing; AI must target the constraint to move PI completion |
| **Story quality drives downstream rework** | AI on the BA side compounds AI on the testing side — fix the input, the bottleneck eases |
| **Workflow is heterogeneous** | Dev product teams use Scrum; data conversion teams (e.g., OLPD) use Kanban with different stages — measurement cannot be one-size-fits-all |
| **Two productivity pipelines, not one** | Refinement pipeline (BAs, Architects) AND delivery pipeline (Devs, QA). Both visible in existing weekly reports. AI should target both. |
| **Epic 1:1 with team** | Clean attribution; pilot teams' impact is fully traceable; cross-team coupling happens at story level via dependencies |
| **Mature measurement stack already exists** | Velocity report, weekly Completed Work slide, weekly Preparation Metrics slide, Jira Plans/Advanced Roadmaps. We layer on, we don't rebuild. |
| **V3 workflow transition is in flight** | Adds Integration stage, splits acceptance testing, planning becomes Kanban, sub-stage markers (DEV/TEST/INT/UAT). If V3 cuts over during AI pilot, the two changes confound each other. |

### 1.2 Strategic hypothesis for the pilot

> **Apply AI to story quality (BA/Rovo) and functional testing (QA/Copilot+Rovo) — the bottleneck and its upstream cause — to lift PI Work Completed from 67% baseline toward 77%+ within one PI, while quality metrics (defect density, UAT rejection rate) hold or improve. Build dev capacity (Copilot for HITL code) in parallel so teams can absorb scope expansion once the bottleneck eases.**

This is tighter and more defensible than "make everyone faster with AI."

---

## 2. Phase 1 (Pilot) — IN SCOPE

### 2.1 Pilot teams

- **Number:** 2-3 pilot teams (final selection by Romi + John + Chase by Apr 25)
- **Selection criteria:**
  - Strong BAs who can evaluate AI output quality (per Apr 13 lesson — AI amplifies skill, not replaces it)
  - Cooperative PO/BA/Dev/QA relationship
  - Representative workload (not most complex, not most stable)
  - **Low cross-team dependency coupling** (NEW — so internal velocity gains show up in PI metrics)
  - Each pilot team minimum: 1 BA, 1 Tester, 1-2 Developers, 1 Scrum Lead
  - Sample across **workflow archetypes** (NEW — at least one dev team and one data/conversion team, not just dev teams)
- **Pilot duration:** 1 full PI (~13 weeks, 6 sprints) — aligns with PI 26.2 or PI 26.3 depending on V3 cutover timing

### 2.2 Approved tools (Phase 1 only)

| Tool | Status | Primary roles |
|------|--------|---------------|
| **GitHub Copilot** (multi-model: OpenAI, Gemini, Claude) | State-purchased; deployment timeline TBD (R-04) | Developer, Tester, Data |
| **Atlassian Rovo** | Available on DCFS Jira/Confluence | BA, Tester, Scrum Lead |
| **M365 Copilot** | Available; needs license confirmation | All (productivity, doc summarization) |
| **D365 Power Platform AI** | Available in environment | Developer, Configuration |

**Not approved for Phase 1:**
- Anthropic Claude direct (only via Copilot routing) — deferred to Phase 2 if approved
- ChatGPT direct — not approved
- Any new tool — requires DoIT approval cycle (rigorous; 30-day notice may apply)

### 2.3 Phase 1 role × tool × use-case matrix

**Phase 1 covers 5 roles** (updated v0.2): BA, Tester, **Testing Services Lead**, Developer, Data team. Testing Services Lead is the portfolio-level owner of the testing bottleneck — moved from Phase 2 → Phase 1 because the pilot's headline metric (% Work Completed) hinges on testing throughput, and a strategy-level role is the highest leverage point on that bottleneck.

#### BA — Story quality & refinement (PRIMARY LEVER)

| Activity | Tool | Use case | Pilot success metric |
|----------|------|----------|---------------------|
| Story drafting | Rovo | First-draft from policy doc / ticket / meeting notes | SP refined per BA per week ↑ |
| Acceptance criteria | Rovo | Generate Given/When/Then from story + Confluence | % stories returned for clarification ↓ |
| Story slicing | Rovo | Break large stories into deliverable slices | Story carryover rate ↓ |
| Definition of Ready check | Rovo | Score against DoR checklist before sign-off | DoR pass rate on first review ↑ |
| Cross-reference dependencies | Rovo | Find related stories/epics across teams | (Quality signal — fewer late dependency surprises) |
| Policy interpretation | Rovo | Summarize CCWIS / IL Rule 431 sections | (Time saved — self-reported) |

**See:** [playbook-ba-v04212026.md](playbooks/playbook-ba-v04212026.md)

#### Tester (QA) — Functional testing (BOTTLENECK LEVER)

| Activity | Tool | Use case | Pilot success metric |
|----------|------|----------|---------------------|
| Test case generation | Rovo → Zephyr | Draft test cases from acceptance criteria | Test cases authored per tester per week ↑ |
| Test data generation | Copilot | Synthetic test data matching Dataverse schema | Test data prep time ↓ |
| Eggplant script authoring | Copilot | Generate / refactor Eggplant automation scripts | Automation coverage % ↑ |
| Selenium → Eggplant migration | Copilot | Translate existing Selenium tests | Migration progress per sprint |
| API test scripts | Copilot | Postman collection generation from API specs | (Activity volume) |
| Defect triage | Rovo | Summarize defect history, suggest similar past fixes | Defect-fix turnaround ↓ |
| Regression test maintenance | Copilot | Update tests when UI/API changes | (Activity volume) |
| Test report writing | Rovo | Summarize test execution into status reports | (Time saved — self-reported) |

**See:** [playbook-tester-v04212026.md](playbooks/playbook-tester-v04212026.md)

#### Testing Services Lead — Bottleneck strategy (HIGHEST PORTFOLIO LEVERAGE)

Strategic/coordinative role distinct from individual Tester. Owns test strategy, env policy, automation roadmap, defect pattern analysis, executive reporting.

| Activity | Tool | Use case | Pilot success metric |
|----------|------|----------|---------------------|
| PI test strategy authoring | Rovo | Draft program-level test strategy per PI | Strategy delivered N weeks before PI start |
| Portfolio defect pattern analysis | Rovo + Copilot Chat | Cross-team defect patterns, root cause clusters | Systemic improvements identified per PI |
| PI test plan rollup | Rovo | Per-team test plans + program rollup with capacity gaps | Overcommit/undercommit flagged at PI Planning |
| Env scheduling / conflict resolution | Rovo | Identify and resolve test env booking conflicts | Unresolved conflicts at sprint start ↓ |
| Test data strategy | Rovo | Per-PI synthetic data needs + governance | Test data prep blockers ↓ |
| Automation roadmap & ROI | Rovo + Copilot Chat | Prioritize automation backlog by ROI; identify deprecation candidates | Automation suite ROI improves |
| Cross-team test coordination | Rovo | Surface cross-team test handoffs & dependencies | Cascade-blocked test items ↓ |
| Executive test status report (weekly) | Rovo + Power BI Copilot + M365 Copilot | Weekly defect/coverage/risk report to leadership | Numerical accuracy 100%; audit-pass |
| Tester coaching synthesis | Rovo | Turn pilot Tester learnings into team-wide guidance | Playbook updates per PI |
| V3 workflow rollout coordination | Rovo | Per-team transition planning for V3 testing changes | V3 cutover coordinated with AI pilot timing |

**See:** [playbook-testing-services-lead-v04222026.md](playbooks/playbook-testing-services-lead-v04222026.md)

#### Developer — Code generation with HITL (CAPACITY BUILDER)

| Activity | Tool | Use case | Pilot success metric |
|----------|------|----------|---------------------|
| C# plugin development | Copilot | Dynamics 365 plugin scaffolds, business logic | Lines of AI-assisted code accepted ↑ |
| JavaScript / PCF controls | Copilot | UI behavior code, PCF control boilerplate | (Activity volume) |
| Power Platform formulas | Copilot (Power FX) | Power Apps formula generation | (Activity volume) |
| Unit test generation | Copilot | Tests alongside code | Defects caught at Dev stage ↑ |
| Code review | Copilot Chat | Self-review before PR | Review iterations per PR (watch — should NOT spike) |
| Refactoring | Copilot | Modernize legacy patterns | (Quality signal) |
| Documentation | Copilot Chat + Rovo | README, API docs, code comments | Doc lines per sprint ↑ |
| Bug investigation | Copilot Chat | Stack trace analysis, root cause | Bug-to-fix cycle ↓ |

**See:** [playbook-developer-v04212026.md](playbooks/playbook-developer-v04212026.md)

#### Data team (Chase Yeung's group) — Migration

| Activity | Tool | Use case | Pilot success metric |
|----------|------|----------|---------------------|
| Data mapping | Copilot | Field mapping logic source → Dataverse | Mapping rules per engineer per week ↑ |
| ETL pipeline (ADF / Informatica) | Copilot | Transformation expressions, dataflow steps | (Activity volume) |
| SQL query generation | Copilot | Source data analysis, validation scripts | (Activity volume) |
| Data quality checks | Copilot | Validation rules from schema | Mock-run pass rate ↑ |
| Conversion script authoring | Copilot | Conversion scripts (matches OLPD-style boards) | Records migrated per sprint ↑ |
| Reconciliation reports | Copilot + Rovo | Source vs. target comparison, variance summaries | (Time saved — self-reported) |
| Documentation | Rovo | Mapping documentation, conversion run reports | Doc lines per sprint ↑ |

**See:** [playbook-data-v04212026.md](playbooks/playbook-data-v04212026.md)

### 2.5 Tool Asks — PENDING APPROVAL (gaps to flag with Dave/Romi)

Beyond the four tools currently approved (Copilot, Rovo, M365 Copilot, D365 Power Platform AI), the following would substantially expand AI value but need confirmation/approval. These ARE NOT pilot blockers — pilot can proceed without them — but each one unlocks specific use cases.

| Tool | Why we want it | Roles benefiting | Approval risk | Status |
|------|---------------|------------------|---------------|--------|
| **Power BI Copilot** | Defect dashboards, sprint/PI test reporting, executive reports with auto-narrative | Testing Services Lead, Scrum Master (Phase 2), Data team | Low — already in MS stack | **ASK Dave** |
| **Eggplant AI features** (Keysight) | If their tool already has AI-assisted authoring, we lose value not using it | Tester, Testing Services Lead | Low — already approved tool | **ASK John (verify what's enabled)** |
| **Zephyr AI features** | AI for test case authoring, suite curation, execution insights | Tester, Testing Services Lead | Low — already approved tool | **ASK John (verify what's enabled)** |
| **Teams Copilot** | Meeting summaries for cross-team test reviews, retros, status meetings | All roles, especially Testing Services Lead, Scrum Master | Low — M365 stack | **ASK Dave** |
| **SharePoint Copilot** | Search/curation of SharePoint-hosted process docs (Confluence is primary, SP secondary) | All roles | Low — M365 stack | **ASK Dave** |
| **Azure DevOps Copilot** | Work-item generation, pipeline assistance, repo-level insights | Developer, Testing Services Lead | Medium — separate Azure license tier | **ASK Dave** |
| **GitHub Copilot Workspace / agent mode** | Multi-step dev workflows beyond single-line completion | Developer | Low — Copilot tier feature | **ASK Dave (which Copilot tier is purchased)** |
| **Microsoft Loop** | Collaboration / shared workspaces with AI suggestions | PMO (Phase 2), Scrum Master | Low — M365 stack | **ASK Dave** |
| **Anthropic Claude direct** | Stronger reasoning on complex story/spec analysis | BA, Testing Services Lead | High — separate vendor, separate DoIT review | **DEFER to Phase 2** |

**Recommendation:** Bundle the M365-stack asks (Power BI Copilot, Teams Copilot, SharePoint Copilot, Loop) as a single ask to Dave — likely all auth'd under existing M365 enterprise license. The Eggplant/Zephyr ones are verifications, not new approvals. ADO Copilot is the only one likely to need its own conversation.

### 2.4 Phase 1 — IN-SCOPE supporting work

- **Training (per role):** Foundation (1.5h) + role track (2-3h each) before PI Planning
- **Prompt libraries** (per role)
- **AI Usage Playbook** with DoIT-compliant guardrails
- **Baseline measurement:** Last 2 PIs (PI 25.2 + PI 26.1) per pilot team
- **Weekly check-ins** during pilot (Tuesday 8 AM CT cadence)
- **Mid-pilot pulse survey** (end of Sprint 3)
- **Per-sprint bias and quality spot checks**
- **Continuous metrics collection** via Jira API + Tempo + Copilot telemetry
- **`ai-assisted` Jira label governance** (NEW — required for AI vs non-AI story comparison)

---

## 3. Phase 1 — OUT OF SCOPE

| What | Why out of scope | When it might come in |
|------|------------------|----------------------|
| Autonomous AI commits (no human review) | DoIT 4d/5d hard constraint — never in scope | Never |
| DCFS case data / PII in AI prompts | DoIT 4f hard constraint — never in scope | Never |
| Tools beyond Copilot + Rovo + M365 Copilot + D365 AI | Requires DoIT approval cycle | Phase 2 if a tool clears review |
| Non-Krasan vendors (CSG BAs, ISI PMs, State POs) | Apr 13 decision — start Krasan-only to reduce friction | Phase 2 once Phase 1 shows results |
| Architect role-specific AI tooling | Not a Phase 1 priority; few people, high context-switching | Phase 2 candidate |
| Scrum Master / RTE-specific AI workflows | Coordination work; Phase 2 candidate | Phase 2 candidate |
| Product Owner workflows | State employees — separate auth/access | Phase 3 |
| PMO process improvement | Approved use area but not Phase 1 priority | Phase 2 candidate |
| Sprint analytics / reporting AI | Possible via Rovo, but Phase 2 | Phase 2 candidate |
| Workforce reduction / staff optimization | Jim Apr 13: "longer-term goal, not immediate" | Phase 3 — only after demonstrated, sustained results |
| Replacing existing reporting infrastructure | Existing weekly reports are the anchor — we layer on | Never (intentional) |
| Child welfare business process automation | Jim Apr 8 hard constraint — AI is for SDLC only | Never |
| Security documentation processed by AI | Jim Apr 8 hard constraint | Never |

---

## 4. Phase 2 — EXPANSION CANDIDATES (post-pilot, conditional on results)

To be evaluated at end of pilot PI based on results, learnings, and remaining capacity.

### 4.1 Additional roles

| Candidate role | Tool | Use case | Why Phase 2 |
|----------------|------|----------|-------------|
| **Scrum Master / RTE** | Rovo + Teams Copilot | Retro analysis, sprint health summaries, dependency tracking, RAID summaries, meeting facilitation | Coordination work — pull forward to Phase 1 if Testing Services Lead surfaces SM as critical to bottleneck (V3 rollout coordination is partly SM territory) |
| **Architect / Tech Lead** | Copilot Chat + Rovo | Design discussions, ADR drafting, cross-team coordination, tech debt analysis | Few people, high context cost; needs proven prompting patterns from Phase 1 |
| **Configuration role** (D365 Power Platform admin/builder, distinct from .NET dev) | D365 Power Platform AI (Power Apps Copilot, Power Automate Copilot) | Power Apps formula generation, Power Automate flow building, model-driven app config | Often folded into Developer role today; if separate at DCFS, add Phase 1.5 |
| **Product Owner** | Rovo | Backlog grooming, prioritization summaries, story scoring | State employees — separate access/auth path |
| **PMO** | Rovo + Loop | Status rollups, RAID summaries, governance documentation | Coordination role; defer to validate value with delivery roles first |

### 4.2 Additional capability areas

| Capability | Tool | Why Phase 2 |
|------------|------|-------------|
| Sprint analytics & insights | Rovo, custom dashboards | Build on stabilized Phase 1 metrics |
| Cross-team dependency intelligence | Rovo | Needs trained pattern from Phase 1 |
| Auto-generated weekly status reports | Rovo + Power BI | Layer on after baseline proves measurement signal |
| Test data factory (centralized synthetic data service) | Copilot + custom | Significant infra work; only after testing-bottleneck thesis is proven |
| AI-assisted code review bot | Copilot + GitHub Actions | Strict HITL means automated comments only, no auto-approval |
| Confluence knowledge base curation with Rovo | Rovo | Depends on Phase 1 surfacing what knowledge gaps exist |

### 4.3 Additional vendor groups

| Group | When | Notes |
|-------|------|-------|
| CSG BAs (PMO/BA-Functional) | Phase 2 | Add after Krasan results demonstrate value; Jim offered exec support |
| ISI PMs | Phase 2 | Coordination role — Rovo for status reports |
| State POs | Phase 3 | Separate access/auth path; lowest risk to defer |

---

## 5. Phase 3 — LONG-TERM / DEFERRED

To be considered only after Phase 1 + Phase 2 success and full DCFS Governance Team formation.

| Item | Why deferred | Conditions to consider |
|------|--------------|------------------------|
| **Workforce optimization** (staff size) | Jim Apr 13: longer-term goal; never the Phase 1 message | Sustained, measured productivity gains across full ART for 2+ PIs |
| **AI in business processes** (not SDLC) | Jim Apr 8 hard constraint | Would require Jim to lift constraint; child welfare process is sensitive |
| **External AI tools** (ChatGPT, Claude direct, Gemini direct) | Requires DoIT approval | Each requires separate AI System Assessment under DoIT 5f |
| **Custom AI agents / autonomous workflows** | Requires substantial governance update; CMS precedent risk | Federal AI policy stabilization + DCFS Governance Team approval |
| **AI-assisted production operations** (not dev) | Out of current AI Target Areas | Separate engagement scope |
| **AI for cross-state data sharing** (CCWIS interoperability) | Federal/multi-state policy implications | Federal CCWIS office sign-off |

---

## 6. What Can Be Measured in Pilot 1

This section is the practical answer to "what data do we collect, from where, to prove the pilot worked." All measurement layers onto **existing DCFS infrastructure** — no new dashboards or reporting systems required.

### 6.1 Headline metrics (anchored on existing weekly executive reports)

| Metric | Baseline source | Pilot source | Target |
|--------|----------------|--------------|--------|
| **% Work Completed per PI** (existing weekly slide) | Last 2 PIs from weekly slide | Pilot PI weekly slide | +10 pts (67% → 77%) on pilot teams |
| **PI Preparation Velocity** (SP refined per week, existing weekly slide) | Last PI prep slides | Pilot prep slides | +15% on pilot BAs |
| **Sprint commitment vs. completed ratio** | Jira velocity report | Jira velocity report | Predictability gap narrows |

### 6.2 Workflow / Jira-derived metrics (no new instrumentation)

| Metric | Source | Why it matters |
|--------|--------|---------------|
| **Cycle time per stage** (Dev / Test / UAT) | Jira changelog API | Isolates where AI saves time vs. where bottleneck remains |
| **First-time pass rate** | Jira workflow transitions | Quality guardrail — % stories completing without backward transition |
| **UAT rejection rate** | Jira workflow transitions | Bottleneck-tail health |
| **Defect density per story** | Jira bug links | Quality guardrail — bugs ÷ story points delivered |
| **Defects caught at Dev/Test stage** | Jira bug "found in" field | Earlier detection = lower cost; AI test-gen should improve this |
| **Backward transitions per sprint** | Jira changelog | Rework signal |
| **Time in "Awaiting Analysis" / "In Analysis"** | Jira changelog | Where Rovo for BAs should help most |
| **Cross-team dependency aging** | Jira links + Plans | Coupling impact on pilot team measurability |

### 6.3 Tempo-derived metrics (Tempo add-on already installed)

| Metric | Source | Why it matters |
|--------|--------|---------------|
| **Hours per story point** (actual vs estimate) | Tempo | Direct AI productivity signal — should drop on AI-assisted stories |
| **Hours on bugs vs. features** | Tempo | Firefighting ratio — should drop if quality holds |
| **Hours on unplanned work** | Tempo | Disruption signal |

### 6.4 Tool telemetry (when Copilot deploys)

| Metric | Source | Why it matters |
|--------|--------|---------------|
| **Copilot acceptance rate** per user / team | GitHub Copilot admin | Adoption + skill signal (40-70% target; 100% = not reviewing) |
| **Copilot active user rate** weekly | GitHub Copilot admin | Adoption health |
| **Copilot lines suggested vs. accepted** | GitHub Copilot admin | Volume of AI-assisted output |
| **Rovo queries per user per week** | Atlassian admin (limited) | Adoption signal — supplement with survey |

### 6.5 Survey-based metrics (monthly, all pilot consultants)

| Metric | Method | Why |
|--------|--------|-----|
| **SPACE survey** (S, P, A, C, E — 1-5 scale) | Survey via tools.ussp.co or MS Forms | Multi-dimensional team health (Forsgren 2021) |
| **DevEx survey** (Flow, Feedback, Cognitive load) | Survey | Developer experience |
| **Perceived time saved per week** | Survey | Self-reported productivity |
| **Confidence in AI output (1-5)** | Survey | Quality perception |
| **Tasks where AI helped most / least** | Survey free-text | Refines Phase 2 scope |
| **Training effectiveness** | Survey | Improves training for Phase 2 rollout |

### 6.6 AI-assisted vs. non-assisted comparison (NEW requirement)

Comparison only works if every story is tagged with `ai-assisted` label when AI was used in implementation. Two approaches:

- **Phase 1 Wave A (start):** Self-report label on the story as part of definition-of-done checklist
- **Phase 1 Wave B (later):** Derive from GitHub Copilot telemetry by matching commits (via branch naming `IPT-4758-xxx`) to acceptance events

Comparison table at end of pilot:

| Metric | Baseline (last 2 PIs) | Pilot AI-assisted stories | Pilot non-assisted stories | Delta |
|--------|----------------------|--------------------------|---------------------------|-------|
| Defects per 10 SP | | | | |
| % defects caught in Dev/Test | | | | |
| First-time pass rate | | | | |
| UAT rejection rate | | | | |
| Cycle time (Dev stage) | | | | |
| Hours per story point (Tempo) | | | | |

If AI-assisted column is **better or equal** to non-assisted → velocity gains didn't cost quality. Done.

### 6.7 Composite "Pilot Success" score (for executive reporting)

| Category | Weight | What's measured |
|----------|--------|----------------|
| Tangible outputs (LOC, docs, config, test cases) | 40% | Volume of AI-assisted deliverables (per Jim's directive — tangible, not points) |
| Quality (defects, rework, first-time pass) | 30% | No regression at the bottleneck |
| Efficiency (cycle time, hours per SP) | 20% | Faster flow through the SDLC |
| Team health (SPACE/DevEx) | 10% | Did teams feel better or worse |

```
Composite = (Output × 0.4) + (Quality × 0.3) + (Efficiency × 0.2) + (Health × 0.1)
```

### 6.8 Measurement infrastructure ask

The full measurement scorecard requires only **two new things from DCFS engineering**:

1. **Jira/Tempo API access** for a service account (so we can pull changelog + Tempo data programmatically)
2. **`ai-assisted` Jira label** added to story workflow + DoD checklist update

Everything else is analysis on existing data.

---

## 7. What We Need to Think About

Open considerations that aren't decisions yet, but need to be on the table.

### 7.1 V3 workflow rollout vs. AI pilot — confound risk

The proposed V3 workflow (Image 11 from Apr 21 walkthrough) introduces:
- Planning Board changes from Scrum to Kanban
- Explicit DoR Sign-Off gate
- Testing splits into Testing → Integration → Acceptance Testing → Acceptance Testing Complete
- Sub-stage markers (DEV/TEST/INT/UAT)

**If V3 cuts over during the AI pilot, we cannot tell which gains came from AI vs. from workflow improvement.**

Three options to handle:

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Sequence** | V3 stabilizes 1 PI; AI pilot starts following PI | Cleanest measurement | Slowest timeline |
| **Pilot AI on V3-stabilized teams** | If V3 rolls out staggered, pilot AI on early-V3 teams | Controls workflow change | Needs DCFS to confirm staggered rollout |
| **Concurrent — measure both effects** | Pre-V3+no-AI baseline → V3+no-AI control → V3+AI pilot | Faster; can attribute both effects | Needs more teams; complex stats |

**Recommendation:** Option 2 if rollout is staggered, Option 1 if big-bang. **Don't start AI pilot in same PI as V3 cutover for any given team.**

**Open question for Jim/Matt:** What's the V3 rollout schedule? Big-bang or staggered?

### 7.2 Pilot team selection — dependency coupling

Epics are 1:1 with team (clean), but stories within epics depend across teams. If pilot teams have heavy cross-team coupling, internal velocity gains get absorbed by waiting on non-pilot dependencies.

**Recommendation:** Score candidate teams on cross-team dependency density using the Plans/Dependencies tab in Jira. Pilot the **most independent teams** so gains show up in PI metrics, not just internal numbers.

**Open question:** Has anyone scored teams on dependency density?

### 7.3 Testing-bottleneck interpretation

Multiple sprints with high commit / 0 completed (e.g., IPT_PI25.1.3 39/0, IPT_PI25.1.4 37/0) suggest testing/UAT tail is severe. Need to confirm:

- **Where in testing** is the bottleneck — Functional, Integration, UAT? (V3's sub-stages help reveal this)
- **Why it's the bottleneck** — manual regression burden? Test data scarcity? Tester headcount? Story quality? Environment availability?
- **Are testers in scope for AI rollout?** (Yes per Phase 1, but worth confirming with John)
- **Are environments a constraint?** (If yes, no amount of AI helps — that's an infra problem)

### 7.4 Story-quality lever sizing

John Luna's point: bad stories cause downstream rework. We don't yet know:

- **Baseline rework rate** caused by story quality vs. other causes (env, code, requirements change)
- **% of UAT rejections** that trace back to ambiguous acceptance criteria
- **% of test failures** caused by tests written against unclear stories

**Recommendation:** Pull the last 2 PIs of bug data, categorize root causes, and confirm story-quality is a meaningful share before over-investing on the BA track.

### 7.5 Workflow heterogeneity (dev vs. data conversion)

Dev product teams use Scrum + standard workflow. Data conversion teams (e.g., OLPD) use Kanban + 9-stage migration workflow. A single "AI productivity" metric won't work across both.

**Recommendation:**
- Per-archetype baselines (don't compare data team velocity to dev team velocity)
- Per-archetype success metrics (records migrated for data; SP completed for dev)
- Pilot at least one team of each archetype to validate the AI plan works for both

### 7.6 V3 sub-stage markers as future measurement opportunity

Once V3 stabilizes, the DEV/TEST/INT/UAT sub-stage markers give us **activity-level measurement** — we can attribute productivity gains to specific stages, not just global "% Work Completed." This is a much more defensible AI ROI story.

**Recommendation:** Treat V3 as enabling infrastructure for Phase 2 measurement; collaborate with whoever owns V3 rollout.

### 7.7 Copilot deployment timing (R-04)

Pilot cannot fully run if Copilot isn't deployed to teams. Currently:
- State purchased licenses
- Not yet provisioned to ILC teams
- No confirmed timeline

**Mitigation:** Phase 1 can start with Rovo-only for BA + early Tester tracks. Copilot adds Dev + heavy Test/Data tracks. If Copilot slips, pilot scope shrinks rather than delays.

### 7.8 DoIT 30-day notice (R-03)

If DoIT AI System Assessment hasn't been filed for Copilot/Rovo, earliest legal pilot start is 30 days after filing. **This is a hard blocker for pilot date.** Must confirm with Dave.

### 7.9 Section 5e ambiguity (R-05)

Does Copilot accessing ILC source code count as "State data for AI purposes" requiring Agency Head written consent? Needs legal interpretation from Dave/Jim before pilot starts.

### 7.10 HITL discipline at scale

Jim's hard constraint: every AI suggestion gets developer review + peer review + PR approval. Pilot must demonstrate:
- 100% PR pass-through compliance (no bypass)
- Audit trail showing AI-assisted commits go through normal review
- Per-sprint spot checks

**Recommendation:** PR template addition: "Did AI assist with this change? If yes, what % of code is AI-suggested vs. human-written?" Combined with `ai-assisted` Jira label, this creates the audit trail.

### 7.11 Measurement of refinement-side AI impact

Refinement work (BA writing stories, AC, etc.) is harder to measure than code work — there's no telemetry like Copilot acceptance rate for Rovo story-drafting. Currently we can measure:

- SP refined per week per BA (from Prep Metrics report)
- Story rework rate
- DoR pass rate
- Self-reported time saved

**Open question:** Can Rovo provide per-user query telemetry? If not, is there a usage log accessible to admins?

### 7.12 Pilot capacity overhead

Per Apr 13: 15% of sprint capacity allocated for AI adoption (training, learning, logging). Pilot velocity comparisons must normalize for this — we're not measuring "team with 15% less capacity vs. team with full capacity," we're measuring "with-AI productivity adjusted for adoption tax."

**Recommendation:** Two-track reporting:
- **Raw delta** (with adoption tax) — what leadership sees first
- **Adjusted delta** (capacity-normalized) — what reveals true productivity ceiling

### 7.13 What "tangible outputs" means in a configuration-first environment

Jim directed: measure tangible outputs, not story points. But DCFS is configuration-first Dynamics 365 — 5-point config story ≠ 5-point custom code story. We need to define "tangible output" per work type:

- Code: lines of AI-suggested code accepted (Copilot telemetry)
- Configuration: config items per sprint (manual log — needs Kashif/Shyam input on whether D365 has change-log metadata for AI-assisted)
- Test scripts: scripts authored per sprint (manual log + Zephyr export)
- Documentation: lines of doc generated (Git diff on doc files + Confluence)
- Mapping rules / ETL: artifacts authored per sprint (manual log)
- Stories / AC: Jira stories with `ai-assisted` label

### 7.14 Pilot-to-scale transition gate

What are the explicit go/no-go criteria for ART-wide rollout after pilot? Today the rollout plan says "Go/no-go recommendation for full ART rollout" but doesn't define thresholds.

**Recommendation:** Define before pilot starts:
- Minimum % Work Completed improvement on pilot teams
- No quality regression beyond X%
- Adoption rate ≥ Y% on pilot teams
- Team satisfaction (SPACE) — no decrease
- DoIT compliance — 100% (any breach = no-go)
- Playbooks finalized and approved by full Governance Team

### 7.15 Confluence content quality affects Rovo output

Rovo's advantage over Copilot for story writing comes from Confluence integration. If Confluence content is stale, contradictory, or sparse for some teams, Rovo will produce poor output for those teams.

**Open question:** What's the Confluence content health per team? Are some teams' Confluence spaces well-curated and others not? This affects which teams will benefit from Rovo most.

---

## 8. Summary — The Pilot Story in One Page

### What we're doing
Apply AI to story quality (BA/Rovo) + functional testing (QA/Copilot+Rovo) + dev capacity building (Copilot for HITL code) + data migration (Copilot) on **2-3 pilot teams** for **one PI (~13 weeks)**.

### Why this approach
- **Testing is the bottleneck** — moving the dev-only needle won't move PI completion
- **Story quality is upstream** — fix the input, the bottleneck eases
- **Existing DCFS measurement stack is mature** — we layer onto it, we don't rebuild
- **Two productivity pipelines** (refinement + delivery) — both visible in existing weekly reports

### What we measure
- **Headline:** % Work Completed per PI on pilot teams (target +10 pts)
- **Quality guardrails:** defect density, first-time pass rate, UAT rejection rate
- **Comparison:** AI-assisted vs. non-assisted stories (using `ai-assisted` Jira label)
- **Adoption:** Copilot acceptance rate, Rovo usage, SPACE survey
- **All from existing systems:** Jira, Tempo, Copilot admin, surveys

### What we ask of DCFS
1. Jira/Tempo API access (service account)
2. New `ai-assisted` label + DoD checklist update
3. Confirm DoIT 30-day notice status (R-03)
4. Confirm Copilot deployment timeline (R-04)
5. Confirm V3 rollout schedule (so we don't confound the pilot)
6. Pilot team selection by Apr 25

### What's deferred
- Other roles (Architect, SM/RTE, PO, PMO) → Phase 2
- Other vendors (CSG, ISI, State POs) → Phase 2
- New AI tools beyond Copilot + Rovo + M365 + D365 AI → Phase 2 (with DoIT review)
- Workforce optimization → Phase 3 (sustained results required)
- Business process AI → Never (Jim's hard constraint)

---

## Appendix A: Document version history rules

- Filenames use `-vMMDDYYYY.md` suffix matching existing convention
- Frontmatter includes `Version: vX.Y` (semantic-ish — major.minor)
- Change log table at top tracks every change
- When a major decision changes scope, bump major version (v0.x → v1.0 at first review by Romi/Jim)
- Old versions archived under `clients/dcfs-ilc/planning/versions/`

## Appendix B: Cross-reference

| For details on... | See |
|-------------------|-----|
| Engagement framing, timeline, deliverables | [rollout-plan.md](rollout-plan.md) |
| Measurement methodology in depth | [measurement-methodology-v04142026.md](measurement-methodology-v04142026.md) |
| Risk register | [assumptions-and-risks.md](assumptions-and-risks.md) |
| Governance proposal | [governance-proposal-v04142026.md](governance-proposal-v04142026.md) |
| Code generation policy | [code-generation-policy-review.md](code-generation-policy-review.md) |
| Tool authorization status | [tool-authorization-list.md](tool-authorization-list.md) |
| Role playbooks | [playbooks/](playbooks/) (one per role, also dated) |
