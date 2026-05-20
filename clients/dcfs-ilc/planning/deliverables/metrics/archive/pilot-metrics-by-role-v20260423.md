# Pilot Metrics by Role — Measurement Plan and Data Sources

> **Version:** V20260423 (v1.0 draft)
> **Owner:** AI Transformation Lead (Krasan)
> **Companion to:** Pilot Governance Charter V20260423 §7 "What we track"
> **For review by:** David Nika, Jim Daugherty, Romi Kovacs, pilot team leads
> **Purpose:** Define what each pilot role is measured on and where the data comes from.

---

## 1. Purpose

The Pilot Governance Charter defines *what* is tracked at the governance level (dashboards, spot checks, risk register). This document goes one level deeper: for each of the five pilot roles, it lists the specific metrics we will collect, the data source, how we collect it, the cadence, and who collects it.

**This is a candidate set for team review.** The pilot team and governance leads should walk through each metric and select the subset (target: 8–12 total) that:
- Is measurable with the data / tools we actually have
- Is worth the collection burden
- Maps to the 10–15% productivity improvement target
- Avoids double-counting (e.g., multiple speed metrics)

Final metric set will be locked at the end of the baselining phase (by April 30).

---

## 2. Measurement philosophy

- **Tangible outputs, not story points.** Story points shrink as AI accelerates sizing; they understate real gains.
- **Before / after + control.** Every role compares pilot-period metrics against a pre-pilot baseline and against other teams that are not using AI tools.
- **Multi-dimensional per role.** No single metric can fake improvement — we look at quality, speed, and health together.
- **8 – 12 metrics maximum** to avoid measurement burden on the pilot team.

---

## 3. Role × Metric × Data Source

### 3.1 Business Analyst (BA)

**Pilot member:** Sushil
**Primary focus:** Story quality and refinement throughput — the upstream lever that prevents downstream rework.

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| Story quality score (QUS 13-criteria) | Programmatic scoring of story content against 13 quality criteria | JIRA stories — scanned by script | Per sprint | AI Transformation Lead (script) |
| Story rejection rate | Percentage of stories returned to BA for rework after review | JIRA transition history | Per sprint | AI Transformation Lead (JIRA export) |
| Refinement cycle time | Days from story created to "Ready for Dev" | JIRA transition timestamps | Per sprint | AI Transformation Lead (JIRA export) |
| SME clarification requests | Count of JIRA comments requesting clarification from subject-matter experts | JIRA comments / labels | Per sprint | AI Transformation Lead (JIRA export) |
| Acceptance criteria completeness | Manual score 1–5 on AC quality for sampled stories | Spot check log | Per sprint | Pilot Governance Lead |

### 3.2 Solution Architect (SA)

**Pilot member:** Kelly
**Primary focus:** Architecture documentation quality and cycle time through the pre-ARB / ARB process.

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| SDD creation time | Hours to draft a Solution Design Document per feature | Manual log (Tempo or spreadsheet) | Per SDD | SA (self-reported) |
| Pre-ARB cycle time | Days from SDD draft submission to pre-ARB approval | JIRA architecture-review tickets | Per SDD | AI Transformation Lead |
| SDD revision count | Number of revisions before pre-ARB approval | SharePoint version history | Per SDD | AI Transformation Lead (SharePoint export) |
| Cross-team dependencies identified | Count of cross-team dependencies surfaced per sprint | JIRA epic link analysis | Per sprint | AI Transformation Lead |
| Architecture decision records (ADRs) logged | Count of ADRs captured in Confluence per sprint | Confluence ADR pages | Per sprint | AI Transformation Lead |

### 3.3 Developer (Platform Developer)

**Pilot members:** Anusha, Chaitanya
**Primary focus:** Delivery throughput, code quality, and documentation.

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| Story cycle time | Days from "In Progress" to "Done" | JIRA transition timestamps | Per story | AI Transformation Lead (JIRA export) |
| Defect density | Bugs raised per story point delivered | JIRA issue links | Per sprint | AI Transformation Lead (JIRA export) |
| Code review cycle time | Hours from PR opened to PR merged | GitHub pull request history | Per PR | AI Transformation Lead (GitHub API) |
| Documentation coverage | Percentage of PRs that include documentation updates | GitHub PR file analysis (script) | Per sprint | AI Transformation Lead (script) |
| Lines of code delivered (plugins, APIs, logic apps, function apps) | Net lines added per sprint for code artifacts | GitHub diff statistics | Per sprint | AI Transformation Lead (script) |
| Configuration items delivered | Count of Dynamics configuration changes exported | Dynamics solution export logs | Per sprint | Developer (self-reported, verified by SA) |
| First-pass QA yield | Percentage of stories passing QA on first attempt | JIRA transition history ("In QA" → "Done" vs. back to "In Progress") | Per sprint | AI Transformation Lead |

### 3.4 Senior Tester

**Pilot members:** Remeer, Natalie
**Primary focus:** Test creation speed, coverage, and escape rate.

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| Test case creation time | Hours to author test cases per story | Manual timesheet or Zephyr Scale timestamps | Per story | Tester (self-reported) |
| Test coverage | Percentage of stories with at least one linked test case | Zephyr Scale ↔ JIRA link coverage | Per sprint | AI Transformation Lead |
| Defect escape rate | Percentage of defects found after UAT vs. total defects | JIRA bug labels (pre-UAT vs. post-UAT) | Per sprint | AI Transformation Lead |
| Regression cycle time | Hours to execute a full regression test cycle | Zephyr Scale test runs | Per sprint | AI Transformation Lead |
| Test-to-story ratio | Average number of test cases per story | Zephyr Scale + JIRA | Per sprint | AI Transformation Lead |

### 3.5 Testing Services Lead

**Pilot member:** Camilla
**Primary focus:** Portfolio-level testing strategy, cross-team consistency, and automation leverage.

| Metric | What it measures | Data source | Cadence | Collected by |
|--------|------------------|-------------|---------|--------------|
| Testing strategy artifacts produced | Count of strategy documents, guidelines, or playbook sections authored per sprint | SharePoint / Confluence | Per sprint | Testing Services Lead (self-reported) |
| Cross-team test coverage consistency | Variance in test coverage across the 12 ILC teams | Zephyr Scale (aggregated) | Monthly | AI Transformation Lead |
| Test automation coverage | Percentage of test cases that are automated (Eggplant / Zephyr automated) | Zephyr Scale automation flags | Per sprint | AI Transformation Lead |
| Cross-team defect trends | Defect escape-rate trend across teams (monthly moving average) | JIRA bug data (aggregated) | Monthly | AI Transformation Lead |
| Testing Services Playbook contributions | Updates to the cross-team testing playbook per sprint | Confluence page history | Per sprint | Testing Services Lead (self-reported) |

---

## 4. Cross-cutting metrics (all roles)

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

## 5. Data sources — summary

| Source | Provides | Access | Extraction method |
|--------|----------|--------|-------------------|
| **JIRA Cloud** | Stories, epics, bugs, transitions, comments, labels, story points, acceptance criteria | Pilot team + AI Transformation Lead | JIRA REST API / JQL export |
| **Zephyr Scale** (JIRA plugin) | Test cases, test runs, test-to-story links, automation flags | Pilot team + AI Transformation Lead | Zephyr REST API / CSV export |
| **GitHub** | Pull requests, commits, diffs, code review comments, merge timestamps | Developer + AI Transformation Lead | GitHub REST API |
| **Confluence Cloud** | Architecture pages, ADRs, playbook contributions, meeting minutes | All roles + AI Transformation Lead | Confluence API / manual export |
| **SharePoint** | SDD documents, version history, review cycle artifacts | SA + AI Transformation Lead | SharePoint export / manual review |
| **Dynamics solution exports** | Configuration change logs | Developer | Manual export |
| **Tool analytics** | AI usage volume, acceptance rates | Tool administrators | GitHub Copilot admin, Atlassian Rovo analytics, M365 Copilot usage reports |
| **Survey tool** (Survey Monkey) | SPACE survey, AI tool satisfaction, pulse check | AI Transformation Lead | Direct platform export |
| **Manual logs** | Spot check log, change request register | Pilot Governance Lead | Maintained in Teams channel |

> **Collection method detail** (scripts, APIs, prerequisites, effort per source) lives in the companion document: **Pilot Metrics Collection Methods V20260423**. Refer to it before starting extraction.

---

## 6. Collection cadence

| Cadence | Metrics |
|---------|---------|
| **Daily** | AI usage volume, prompt-drift incidents (if any) |
| **Weekly (in Pilot Governance meeting)** | All JIRA-derived delivery metrics, AI acceptance rate, spot check findings |
| **Per sprint** | SDD-related metrics, test coverage, cross-team dependencies, ADR count, AI tool satisfaction |
| **Per feature or per PR** | Story cycle time, code review cycle time, SDD cycle time |
| **Pre-pilot (baseline), mid-pilot, post-pilot** | SPACE survey (team health, satisfaction) |
| **Monthly** | Cross-team trends (defect escape rate, coverage consistency) |

---

## 7. Who owns collection

| Owner | Responsibilities |
|-------|-------------------|
| **AI Transformation Lead (Vinay — Krasan)** | Most JIRA-, GitHub-, Confluence-, and Zephyr-derived metrics (via scripts or direct export). Consolidates data weekly for Pilot Governance meeting. |
| **Pilot Governance Lead (DCFS — TBD)** | Spot check log, change request register, compliance evidence. Reviews data weekly. |
| **Pilot team members (self-reported)** | Manual-log metrics: SDD creation time (SA), test case creation time (Tester), configuration items delivered (Developer), Testing Services Playbook contributions (Testing Services Lead). Reported in a shared timesheet or Tempo. |
| **Tool administrators** | Pull usage analytics from GitHub Copilot admin, Atlassian Rovo analytics, M365 Copilot usage reports. |

---

## 8. Reporting

Metrics feed into three channels:

1. **Weekly dashboard** — refreshed before each Tuesday Pilot Governance meeting. Compares pilot metrics against baseline, shows week-over-week delta.
2. **Mid-pilot checkpoint report** — cumulative dashboard, trend analysis, early signals on whether the 10–15% target is trending.
3. **End-of-pilot report** — final comparison (pilot vs. baseline vs. control teams), lessons learned, and playbook revisions.

---

## 9. Open items for validation

These items need to be resolved before the final metric set is locked at the end of baselining:

| # | Item | Owner | Target |
|---|------|-------|--------|
| 1 | Confirm JIRA API access for automated extraction | AI Transformation Lead + JIRA admin | By April 24 |
| 2 | Confirm Zephyr Scale API access for test-coverage extraction | AI Transformation Lead + JIRA admin | By April 24 |
| 3 | Confirm GitHub Copilot and Atlassian Rovo analytics tiers (some metrics require Enterprise tier) | DCFS (via DoIT) | With tool authorization |
| 4 | Confirm survey tool selection (Survey Monkey via Krasan, or another) | AI Transformation Lead + DCFS | By April 25 |
| 5 | Confirm DCFS is comfortable with per-individual metrics being visible to Pilot Governance | DCFS + Pilot Governance Lead | Before pilot start |
| 6 | Identify any metrics DCFS or Maximus requires that are not listed above | DCFS / David Nika | Before baselining complete |

---

## 10. Version history

| Version | Date | Changes |
|---------|------|---------|
| v1.0 draft | 2026-04-23 | Initial measurement plan — candidate metric set for all five pilot roles, cross-cutting metrics, data sources, cadence, ownership, and open items. |

---

*This is a working document. Updates after baselining complete and the final metric set is locked.*
