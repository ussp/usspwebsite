# Pilot Metrics by Role — Measurement Plan and Data Sources

> **Version:** V20260427 (v2.0 draft)
> **Owner:** AI Transformation Lead (Krasan)
> **Companion to:** Pilot Governance Charter V20260427 §7 "What we track"
> **Supersedes (in part):** [pilot-metrics-by-role-v20260423.md](pilot-metrics-by-role-v20260423.md) — v20260423 retained as the prior baseline; this version updates the Tester and Developer sections with discovery-walkthrough findings and reflects the Apr 24 governance scope decision.
> **For review by:** David Nika, Jim Daugherty, Romi Kovacs, pilot team leads
> **Purpose:** Define what each pilot role is measured on and where the data comes from.

---

## what's-new-in-v20260427

This version incorporates three things that landed between Apr 23 and Apr 27:

1. **Apr 23 Dynamics developer workflow walkthrough** (Vinay + Jeff Lobo + Kali Devineni + Anudeep Chaitanya) — confirmed the developer decision tree (out-of-box rules → North52 → JS → plugin/PCF/Azure Function), confirmed GitHub Copilot is licensed by DoIT but **not yet provisioned** for the team's GCC environment, and surfaced specific unit-of-work baselines (per-validator, per-expression, per-plugin time).
2. **Apr 24 testing workflow walkthrough** (Vinay + Jeff Lobo + Nataliia Revutska + Remya Raj + Kamila Aibedullova) — confirmed the **80/20 split** (20% test-case design, 80% execution + data prep + role switching + screenshots + documentation), surfaced that **no sprint/PI test reports are produced today**, and proved Rovo can generate role-aware test cases plus a negative case from a real story (live demo on Intact).
3. **Apr 24 governance charter review** (Vinay + Jeff + Krishna + Robert + Dinkar + Alec) — formal decision **D-3**: per-role candidate metric selection moves from baseline phase to **design phase as a formal deliverable**. This document is now a design-phase input, not a baseline-phase lock.

See change log below for the full diff vs. v20260423.

---

## phase-clarification-prominent-note

> **Per Apr 24 governance review (D-3): per-role metric selection is a DESIGN-PHASE deliverable, not a baseline-phase task.**
>
> - The baseline phase collects evidence (workflow walkthroughs, current-state timings, tool inventory, story/test/code samples).
> - The **design phase** is where each role lead, working with the AI Transformation Lead, **selects the final 1–2 metrics per role** (8–10 total across the pilot) from the candidate set in this document.
> - Charter language is now decoupled from a fixed metric list — the charter says "metrics will be tracked" and points to this document as the working candidate set.
> - **Each role lead drives candidate metric refinement against the role's actual workflow.** This means Kali/Chaitanya refine the developer set, Nataliia/Remya/Kamila refine the tester set, and so on — informed by the walkthroughs already completed and those still pending.
> - Final lock target: end of design phase (post-PI-planning, before Pilot Sprint 1 kickoff).

---

## 1. purpose

The Pilot Governance Charter defines *what* is tracked at the governance level (dashboards, spot checks, risk register). This document goes one level deeper: for each of the five pilot roles, it lists the candidate metrics we may collect, the data source, how we collect it, the cadence, and who collects it.

**This is a candidate set for design-phase selection.** The pilot team and governance leads walk through each metric during design phase and select the subset (target: 8–10 total, 1–2 per role) that:

- Is measurable with the data / tools we actually have
- Is worth the collection burden
- Maps to the role-specific productivity target (see §10)
- Avoids double-counting (e.g., multiple speed metrics)

---

## 2. measurement-philosophy

- **Tangible outputs, not story points.** Story points shrink as AI accelerates sizing; they understate real gains.
- **Before / after + control.** Every role compares pilot-period metrics against a pre-pilot baseline and against other teams that are not using AI tools.
- **Multi-dimensional per role.** No single metric can fake improvement — we look at quality, speed, and health together.
- **8–10 metrics maximum** to avoid measurement burden on the pilot team.
- **Role-specific targets, single headline.** Internal targets differ by role (see §10); executive comms retain a single 10–15% portfolio headline.

---

## 3. role-x-metric-x-data-source

### 3.1 business-analyst-ba

**Pilot member:** Sushil
**Primary focus:** Story quality and refinement throughput — the upstream lever that prevents downstream rework.
**Walkthrough status:** *Pending — Intact BA walkthrough scheduled for week of Apr 27 (Jeff to organize, will include Scrum lead).* Metrics below carried forward from v20260423; will be refined post-walkthrough.

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| Story quality score (QUS 13-criteria) | Programmatic scoring of story content against 13 quality criteria | JIRA stories — scanned by script | Per sprint | AI Transformation Lead (script) |
| Story rejection rate | Percentage of stories returned to BA for rework after review | JIRA transition history | Per sprint | AI Transformation Lead (JIRA export) |
| Refinement cycle time | Days from story created to "Ready for Dev" | JIRA transition timestamps | Per sprint | AI Transformation Lead (JIRA export) |
| SME clarification requests | Count of JIRA comments requesting clarification from subject-matter experts | JIRA comments / labels | Per sprint | AI Transformation Lead (JIRA export) |
| Acceptance criteria completeness | Manual score 1–5 on AC quality for sampled stories | Spot check log | Per sprint | Pilot Governance Lead |

### 3.2 ba-tech

**Pilot member:** TBD (PMO/BA inclusion pending Romi/Dave conversation per Apr 24 governance review D-4)
**Primary focus:** Technical-spec authoring and config-side acceptance criteria — bridges BA and developer roles.
**Walkthrough status:** *Pending — to be combined with the Intact BA walkthrough.* Metrics inherit from the BA candidate set; refinement deferred until the role's pilot member is confirmed.

### 3.3 solution-architect-sa

**Pilot member:** Kelly (per v20260423); Kali Devineni confirmed for the **Intact developer-side architect** participation per Apr 23 walkthrough decision D-1.
**Primary focus:** Architecture documentation quality and cycle time through the pre-ARB / ARB process.
**Walkthrough status:** *Apr 16 architecture walkthrough completed; Apr 23 developer walkthrough confirmed Visio-as-JPEG diagram parsing gap from the developer side too.* Metrics carried forward from v20260423.

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| SDD creation time | Hours to draft a Solution Design Document per feature | Manual log (Tempo or spreadsheet) | Per SDD | SA (self-reported) |
| Pre-ARB cycle time | Days from SDD draft submission to pre-ARB approval | JIRA architecture-review tickets | Per SDD | AI Transformation Lead |
| SDD revision count | Number of revisions before pre-ARB approval | SharePoint version history | Per SDD | AI Transformation Lead (SharePoint export) |
| Cross-team dependencies identified | Count of cross-team dependencies surfaced per sprint | JIRA epic link analysis | Per sprint | AI Transformation Lead |
| Architecture decision records (ADRs) logged | Count of ADRs captured in Confluence per sprint | Confluence ADR pages | Per sprint | AI Transformation Lead |

### 3.4 developer-platform-developer

**Pilot members:** Anudeep Chaitanya (Intact); Anusha (per v20260423, second team)
**Primary focus:** Delivery throughput, code quality, and documentation across the Dynamics decision-tree workflow (out-of-box rules → North52 → JS → plugin/PCF/Azure Function).

**Apr 23 walkthrough findings — incorporated below:**

- The work decomposes into discrete unit-of-work primitives (one validator, one expression, one plugin) that are easier to baseline than story points.
- Most time is spent in the low-code surface (Power Apps maker + Power Automate); the pro-code tail (VS / VS Code) is the minority but is where Copilot lands hardest.
- **Caveat:** the highest-value GitHub Copilot use cases (plugins, PCF, Azure Functions, JS) are **BLOCKED** until DoIT closes the Copilot enablement gap on the team's GCC environment (R-22). Until then, use Rovo + JS-via-VS-Code path with degraded acceleration. **Realistic developer target is gated on Copilot enablement.**

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| Story cycle time | Days from "In Progress" to "Done" | JIRA transition timestamps | Per story | AI Transformation Lead (JIRA export) |
| **Story-to-deploy cycle time** *(NEW Apr 27)* | End-to-end days from JIRA story acceptance ("Ready for Dev") to deployed code in test/UAT/Prod | JIRA transitions + Azure DevOps / GitHub deploy timestamps | Per story | AI Transformation Lead |
| **Time per JS validator** *(NEW Apr 27)* | Hours to author a client-side JavaScript validator (currently in VS Code or Notepad++) | Self-reported log + PR timestamps | Per validator | Developer (self-reported) |
| **Time per North52 expression** *(NEW Apr 27)* | Hours to author a North52 low-code business-rule expression | Self-reported log + North52 audit history | Per expression | Developer (self-reported) |
| **Time per .NET plugin / PCF / Azure Function** *(NEW Apr 27)* | Hours to author a pro-code artifact in Visual Studio | Self-reported log + commit timestamps | Per artifact | Developer (self-reported) |
| **% stories needing rework due to incomplete AC** *(NEW Apr 27)* | Stories returned to BA mid-sprint because acceptance criteria were insufficient to build against | JIRA transition history + comment labels | Per sprint | AI Transformation Lead (links to BA story-quality dependency, **R-26**) |
| Defect density | Bugs raised per story point delivered | JIRA issue links | Per sprint | AI Transformation Lead (JIRA export) |
| Code review cycle time | Hours from PR opened to PR merged | GitHub pull request history | Per PR | AI Transformation Lead (GitHub API) |
| Documentation coverage | Percentage of PRs that include documentation updates | GitHub PR file analysis (script) | Per sprint | AI Transformation Lead (script) |
| Lines of code delivered (plugins, APIs, logic apps, function apps) | Net lines added per sprint for code artifacts | GitHub diff statistics | Per sprint | AI Transformation Lead (script) |
| Configuration items delivered | Count of Dynamics configuration changes exported | Dynamics solution export logs | Per sprint | Developer (self-reported, verified by SA) |
| First-pass QA yield | Percentage of stories passing QA on first attempt | JIRA transition history ("In QA" → "Done" vs. back to "In Progress") | Per sprint | AI Transformation Lead |

### 3.5 senior-tester

**Pilot members:** Nataliia Revutska, Remya Raj (Intact). Note: pilot member name "Remeer, Natalie" in v20260423 corrected to Nataliia + Remya following the Apr 24 walkthrough.
**Primary focus:** Test creation speed, coverage, and escape rate — with explicit recognition of the manual-UI ceiling on the execution side.

**Apr 24 walkthrough findings — incorporated below:**

- Time split is **20% test-case design / 80% execution + data prep + role switching + screenshots + documentation** (confirmed live by Nataliia and Remya).
- Live demo: Rovo generated **4 role-specific test cases plus 1 negative case** the team hadn't written, from a real Intact story.
- **No sprint/PI test reports are produced today** — Kamila and Jeff confirmed this is a current reporting gap. Any AI-drafted report is purely additive (no incumbent process to displace).
- No documented peer-review checklist exists today (separate quality gap; pilot will create one).
- Zephyr Scale Agent for Rovo is the highest-value enabler but is **NOT in the authorized list** — requires §5f 30-day DoIT notice (R-NEW-6 in rollout-plan §8).

**Caveat (must be prominent):** **Test-execution-time will be hard to move.** ~80% of tester work is manual UI execution where AI cannot drive (HITL governance forbids autonomous execution of IllinoisConnect). Realistic tester productivity target is **5–10% portfolio impact** (vs. uniform 15%) — gains land in the 20% authoring slice + new sprint/PI report drafting + peer-review checklist pre-screening.

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| **Test-case-authoring-time** *(promoted from "test case creation time" Apr 27)* | Hours to author test cases per story (the 20% slice where AI lands) | Manual timesheet or Zephyr Scale timestamps | Per story | Tester (self-reported) |
| **Test-cases-per-story** *(NEW Apr 27)* | Average count of test cases authored per JIRA story (proxy for coverage breadth) | Zephyr Scale + JIRA | Per sprint | AI Transformation Lead |
| **Negative-case-coverage %** *(NEW Apr 27)* | Percentage of stories where at least one negative / edge / role-denial test case was authored (Rovo demonstrated this on Apr 24) | Zephyr Scale + tagging convention to be defined | Per sprint | AI Transformation Lead |
| **Test-report-drafting-time** *(NEW METRIC Apr 27)* | Hours to draft a sprint or PI test report (bug counts, fix counts, coverage, pass rate). **No incumbent process today — any AI-drafted output is purely additive (pure upside).** | Self-reported log; AI Transformation Lead spot-check | Per sprint / per PI | Tester or Testing Services Lead (self-reported) |
| Test coverage | Percentage of stories with at least one linked test case | Zephyr Scale ↔ JIRA link coverage | Per sprint | AI Transformation Lead |
| Defect escape rate | Percentage of defects found after UAT vs. total defects | JIRA bug labels (pre-UAT vs. post-UAT) | Per sprint | AI Transformation Lead |
| Regression cycle time | Hours to execute a full regression test cycle | Zephyr Scale test runs | Per sprint | AI Transformation Lead |
| Test-execution-time *(track but do NOT target)* | Hours to execute a test cycle manually in the Zephyr Scale Test Player against IllinoisConnect | Zephyr Scale timestamps | Per cycle | AI Transformation Lead |
| Test-to-story ratio | Average number of test cases per story | Zephyr Scale + JIRA | Per sprint | AI Transformation Lead |

### 3.6 testing-services-lead

**Pilot member:** Kamila Aibedullova (cross-team Test Services Lead + Admin/Legal team lead per Apr 24 walkthrough)
**Primary focus:** Portfolio-level testing strategy, cross-team consistency, and automation leverage.
**Walkthrough status:** Apr 24 testing walkthrough included Kamila; her metrics inherit from v20260423 with the addition of the new sprint/PI test-reporting metric (since she would own the cross-team report rollup).

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| Testing strategy artifacts produced | Count of strategy documents, guidelines, or playbook sections authored per sprint | SharePoint / Confluence | Per sprint | Testing Services Lead (self-reported) |
| **Cross-team test-report rollup time** *(NEW Apr 27)* | Hours to roll up sprint/PI reports across the 12 ILC teams once each team produces one | Self-reported log | Per sprint / per PI | Testing Services Lead (self-reported) |
| Cross-team test coverage consistency | Variance in test coverage across the 12 ILC teams | Zephyr Scale (aggregated) | Monthly | AI Transformation Lead |
| Test automation coverage | Percentage of test cases that are automated (Eggplant / Zephyr automated) | Zephyr Scale automation flags | Per sprint | AI Transformation Lead |
| Cross-team defect trends | Defect escape-rate trend across teams (monthly moving average) | JIRA bug data (aggregated) | Monthly | AI Transformation Lead |
| Testing Services Playbook contributions | Updates to the cross-team testing playbook per sprint | Confluence page history | Per sprint | Testing Services Lead (self-reported) |

### 3.7 data-role-out-of-scope-for-pilot-v1

The Data role (originally raised in early planning by Chase) is **not in the v1 pilot** per Apr 24 governance review D-4 (5 pilot roles confirmed: Tester, SA, BA, Dev, BA-Tech; no Scrum Lead). Carried forward as a candidate for post-pilot scaling.

---

## 4. cross-cutting-metrics-all-roles

These metrics apply to every pilot role and are collected at the team level, not the individual level.

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| AI tool usage volume | Number of prompts sent, hours of tool use per role | Tool analytics (GitHub Copilot dashboard, Atlassian Rovo analytics, M365 Copilot usage report) | Weekly | AI Transformation Lead |
| AI acceptance rate | Percentage of AI suggestions accepted / edited / rejected | Tool analytics + spot check log | Weekly | AI Transformation Lead |
| Prompt-drift incidents | Count of cases where PII, case data, or out-of-scope content was surfaced in a prompt | Incident reports + spot check log | Ongoing | Pilot Governance Lead |
| Documentation completeness score | Composite score on documentation presence and quality | Confluence + GitHub PR analysis | Per sprint | AI Transformation Lead |
| SPACE survey (5 dimensions) | Team health — satisfaction, performance, activity, communication, efficiency | Survey tool (Survey Monkey — pre-pilot, mid-pilot, post-pilot) | 3 times per pilot | AI Transformation Lead |
| AI tool satisfaction | Rolling satisfaction score per pilot member | Short survey (5-question pulse) | Per sprint | AI Transformation Lead |

---

## 5. data-sources-summary

| Source | Provides | Access | Extraction method |
|--------|----------|--------|-------------------|
| **JIRA Cloud** | Stories, epics, bugs, transitions, comments, labels, story points, acceptance criteria | Pilot team + AI Transformation Lead | JIRA REST API / JQL export |
| **Zephyr Scale** (JIRA plugin) | Test cases, test runs, test-to-story links, automation flags | Pilot team + AI Transformation Lead | Zephyr REST API / CSV export |
| **GitHub** | Pull requests, commits, diffs, code review comments, merge timestamps | Developer + AI Transformation Lead | GitHub REST API |
| **Azure DevOps / deploy pipelines** *(new — for story-to-deploy cycle time)* | Deploy timestamps to test/UAT/Prod | Developer + Release Manager | Pipeline export |
| **Confluence Cloud** | Architecture pages, ADRs, playbook contributions, meeting minutes | All roles + AI Transformation Lead | Confluence API / manual export |
| **SharePoint** | SDD documents, version history, review cycle artifacts | SA + AI Transformation Lead | SharePoint export / manual review |
| **Dynamics solution exports** | Configuration change logs | Developer | Manual export |
| **North52 audit history** *(new — for time-per-expression)* | Expression authoring/edit timestamps | Developer | North52 admin export |
| **Tool analytics** | AI usage volume, acceptance rates | Tool administrators | GitHub Copilot admin, Atlassian Rovo analytics, M365 Copilot usage reports |
| **Survey tool** (Survey Monkey) | SPACE survey, AI tool satisfaction, pulse check | AI Transformation Lead | Direct platform export |
| **Manual logs** | Spot check log, change request register, per-unit-of-work timing logs (validators, expressions, plugins, test-cases, test-reports) | Pilot Governance Lead + role members | Maintained in Teams channel / Tempo / shared sheet |

> **Collection method detail** (scripts, APIs, prerequisites, effort per source) lives in the companion document: **Pilot Metrics Collection Methods V20260423** (to be re-versioned alongside this doc when collection scripts are written).

---

## 6. collection-cadence

| Cadence | Metrics |
|---------|---------|
| **Daily** | AI usage volume, prompt-drift incidents (if any) |
| **Weekly (in Pilot Governance meeting)** | All JIRA-derived delivery metrics, AI acceptance rate, spot check findings |
| **Per sprint** | SDD-related metrics, test coverage, cross-team dependencies, ADR count, AI tool satisfaction, **test-report-drafting-time**, **% stories needing rework due to incomplete AC**, **negative-case-coverage %** |
| **Per feature or per PR** | Story cycle time, code review cycle time, SDD cycle time, **story-to-deploy cycle time** |
| **Per unit of work** *(new Apr 27)* | **Time per JS validator**, **time per North52 expression**, **time per plugin/PCF/Azure Function**, **test-case-authoring-time** |
| **Per PI** *(new Apr 27)* | **Test-report-drafting-time** (PI rollup), **cross-team test-report rollup time** |
| **Pre-pilot (baseline), mid-pilot, post-pilot** | SPACE survey (team health, satisfaction) |
| **Monthly** | Cross-team trends (defect escape rate, coverage consistency) |

---

## 7. who-owns-collection

| Owner | Responsibilities |
|-------|-------------------|
| **AI Transformation Lead (Vinay — Krasan)** | Most JIRA-, GitHub-, Confluence-, and Zephyr-derived metrics (via scripts or direct export). Consolidates data weekly for Pilot Governance meeting. |
| **Pilot Governance Lead (Dave — DCFS, per Apr 24 governance D-10)** | Spot check log, change request register, compliance evidence. Reviews data weekly. |
| **Pilot team members (self-reported)** | Manual-log metrics: SDD creation time (SA), test-case-authoring-time (Tester), configuration items delivered (Developer), Testing Services Playbook contributions (Testing Services Lead), **per-unit-of-work timing logs (validators, expressions, plugins)**, **test-report-drafting-time**. Reported in a shared timesheet or Tempo. |
| **Tool administrators** | Pull usage analytics from GitHub Copilot admin, Atlassian Rovo analytics, M365 Copilot usage reports. |

---

## 8. reporting

Metrics feed into three channels:

1. **Weekly dashboard** — refreshed before each Tuesday Pilot Governance meeting. Compares pilot metrics against baseline, shows week-over-week delta.
2. **Mid-pilot checkpoint report** — cumulative dashboard, trend analysis, early signals on whether the role-specific targets are trending.
3. **End-of-pilot report** — final comparison (pilot vs. baseline vs. control teams), lessons learned, and playbook revisions.

---

## 9. open-items-for-design-phase-validation

These items move from "before baseline lock" (v20260423 framing) to "design-phase decisions" per Apr 24 governance D-3:

| # | Item | Owner | Target |
|---|------|-------|--------|
| 1 | Confirm JIRA API access for automated extraction | AI Transformation Lead + JIRA admin | Design phase |
| 2 | Confirm Zephyr Scale API access for test-coverage extraction | AI Transformation Lead + JIRA admin | Design phase |
| 3 | Confirm GitHub Copilot and Atlassian Rovo analytics tiers (some metrics require Enterprise tier) | DCFS (via DoIT) | With tool authorization |
| 4 | Confirm survey tool selection (Survey Monkey via Krasan, or another) | AI Transformation Lead + DCFS | Design phase |
| 5 | Confirm DCFS is comfortable with per-individual metrics being visible to Pilot Governance | DCFS + Pilot Governance Lead (Dave) | Before pilot start |
| 6 | Identify any metrics DCFS or Maximus requires that are not listed above | DCFS / David Nika | Design phase |
| 7 | **Lock final 1–2 metrics per role (8–10 total)** *(per Apr 24 D-3)* | Each role lead + AI Transformation Lead | Design phase |
| 8 | **Resolve GitHub Copilot enablement gap on team GCC environment** *(R-22 — gates the developer target)* | Romi + Vinay → Dave/Jim | Before pilot start |
| 9 | **File §5f notice for Zephyr Scale Agent for Rovo** *(R-NEW-6)* | Vinay | Before pilot start |
| 10 | **Define peer-review checklist for test cases** | Kamila + Vinay | Design phase |
| 11 | **Define sprint/PI test-reporting template** | Kamila + Jeff + Vinay | Design phase |
| 12 | **Pending walkthroughs:** Intact BA + Scrum lead (next week), ADA/accessibility + Eggplant (TBD), BA-Tech (TBD) | Jeff to schedule | Design phase |

---

## 10. role-specific-portfolio-targets

Per Apr 27 rollout-plan §9 update and the Apr 24 testing walkthrough finding that uniform 15% does not fit the tester role:

| Role | Plausible target | Rationale |
|------|------------------|-----------|
| BA / BA-Tech | 15–20% | Story authoring, AC generation, refinement prep — high AI fit |
| Developer (config-heavy) | 10–15% **(gated on Copilot enablement)** | JS, Power Automate flows, plugin authoring — strong Copilot fit; gated on R-22 resolution |
| Tester | 5–10% (authoring slice) | 80% manual UI execution unmovable; gains in test-case authoring + new sprint/PI report drafting (gap today = pure upside) |
| Testing Services Lead | 10–15% | Portfolio reporting, cross-team pattern detection |
| Solution Architect | 10–15% | Documentation generation, pattern explanation |
| **Headline (executive comms)** | **10–15%** | Single uniform portfolio target preserved for executive comms |

**Stance:** internal targets differ by role and are defended by the per-role workflow analysis above; executive headline retains the original 10–15%.

---

## 11. cross-references

- **Base version:** [pilot-metrics-by-role-v20260423.md](pilot-metrics-by-role-v20260423.md)
- **Apr 23 developer walkthrough:** [`meeting-notes/team/2026-04-23-dynamics-developer-workflow-walkthrough-summary.md`](../../../meeting-notes/team/2026-04-23-dynamics-developer-workflow-walkthrough-summary.md)
- **Apr 24 testing walkthrough:** [`meeting-notes/team/2026-04-24-testing-workflow-walkthrough-summary.md`](../../../meeting-notes/team/2026-04-24-testing-workflow-walkthrough-summary.md)
- **Apr 24 governance review:** [`meeting-notes/team/2026-04-24-governance-doc-review-summary.md`](../../../meeting-notes/team/2026-04-24-governance-doc-review-summary.md)
- **Risk register:** [`deliverables/strategy/assumptions-and-risks.md`](../strategy/assumptions-and-risks.md)
  - **R-22** GitHub Copilot enablement gap (gates developer target)
  - **R-23** Tester unable to hit uniform 15% (drives role-specific targets)
  - **R-26** Story-quality dependency on AI gains (cross-cuts BA → Dev metrics)
- **Rollout plan:** [`planning/rollout-plan.md`](../../rollout-plan.md) — §6.2 (Proposed Metrics + per-role candidate baselines), §9 (Role-specific targets table)
- **Companion doc:** [pilot-metrics-collection-methods-v20260423.md](pilot-metrics-collection-methods-v20260423.md) (collection scripts, prerequisites — to be re-versioned)

---

## 12. version-history

| Version | Date | Changes |
|---------|------|---------|
| v1.0 draft (v20260423) | 2026-04-23 | Initial measurement plan — candidate metric set for all five pilot roles, cross-cutting metrics, data sources, cadence, ownership, and open items. |
| **v2.0 draft (v20260427)** | **2026-04-27** | **Added Apr 23 developer walkthrough findings (story-to-deploy cycle time, time per JS validator, time per North52 expression, time per .NET plugin/PCF/Azure Function, % stories needing rework due to incomplete AC). Added Apr 24 testing walkthrough findings (test-case-authoring-time, test-cases-per-story, negative-case-coverage %, test-report-drafting-time as a new additive metric). Added prominent caveat that test-execution-time will be hard to move (~80% manual UI). Added role-specific portfolio targets table per rollout-plan §9. Reflected Apr 24 governance D-3: per-role metric selection moved from baseline phase → design phase as a formal deliverable. Corrected tester pilot member names (Nataliia + Remya, not "Remeer, Natalie"). Confirmed Pilot Governance Lead = Dave (D-10). Added cross-references to R-22 / R-23 / R-26 and rollout-plan §6.2 + §9.** |

---

## 13. change-log-vs-v20260423

**Added:**
- Phase clarification note (per-role metric selection = design phase, not baseline phase) per Apr 24 D-3
- Tester section updates: test-case-authoring-time, test-cases-per-story, negative-case-coverage %, **test-report-drafting-time** (new additive metric)
- Tester caveat: ~80% manual UI execution unmovable; realistic 5–10% portfolio target
- Developer section updates: time per JS validator, time per North52 expression, time per .NET plugin/PCF/Azure Function, story-to-deploy cycle time, % stories needing rework due to incomplete AC
- Developer caveat: highest-value Copilot use cases gated on R-22 enablement
- Role-specific portfolio targets table (§10)
- BA-Tech section (3.2) — placeholder; member TBD pending Romi/Dave conversation
- Data role explicitly marked out-of-scope for v1 pilot (3.7)
- Per-unit-of-work and per-PI cadence rows (§6)
- New data sources: Azure DevOps deploy pipelines, North52 audit history (§5)
- Cross-references section (§11) linking walkthroughs and risk register

**Changed:**
- Tester pilot member names corrected (Nataliia Revutska + Remya Raj, not "Remeer, Natalie")
- Pilot Governance Lead named (Dave) per Apr 24 D-10
- Open items framing — "before final metric set is locked" → "design-phase decisions"
- "Final metric set will be locked at the end of the baselining phase" language removed (now design-phase)
- Headings switched to kebab-case for consistency with other metrics docs

**Preserved:**
- All BA, Solution Architect, Testing Services Lead candidate metrics from v20260423 (no walkthrough findings to override yet)
- All cross-cutting metrics
- Reporting framework (weekly / mid-pilot / end-of-pilot)
- Measurement philosophy

**Intentionally not removed:**
- v20260423 itself remains on disk as the prior baseline. This v20260427 supersedes the Tester and Developer role sections only; the BA, BA-Tech, SA, Testing Services Lead sections are forward-compatible with v20260423 and will be re-versioned when their respective walkthroughs land.

---

*This is a working document. Next update after the Intact BA walkthrough (week of Apr 27) and the design-phase metric selection working sessions.*
