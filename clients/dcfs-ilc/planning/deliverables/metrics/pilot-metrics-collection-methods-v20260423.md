# Pilot Metrics — Collection Methods

> **Version:** V20260423 (v1.0 draft)
> **Owner:** AI Transformation Lead (Krasan)
> **Companion to:** Pilot Metrics by Role V20260423 (the "what" and "where"); this document is the "how"
> **For review by:** AI Transformation Lead, Pilot Governance Lead, pilot team leads, JIRA admin, GitHub admin
> **Purpose:** Define the specific collection methods, tools, scripts, and prerequisites for each data source used to measure the pilot.

---

## 1. Purpose

The Pilot Metrics by Role document defines *what* we measure per role and *where* the data lives. This companion document defines *how* we actually extract that data each week, which scripts or manual steps are involved, and what prerequisites (API tokens, tier upgrades) need to be in place before collection can start.

Use this document as the operational runbook for anyone doing the data collection.

---

## 2. Collection methods per data source

### 2.1 JIRA (automated)

- **Method:** JQL query scheduled weekly; results exported via JIRA REST API into a working spreadsheet or directly into the metrics dashboard.
- **What we pull:** transition timestamps (for cycle-time metrics), comment counts (for clarification-request metric), label flags (for bug classification), story/epic links (for coverage metrics).
- **Owner of extraction script:** AI Transformation Lead.
- **Prerequisite:** JIRA API token with read access.

### 2.2 Zephyr Scale (semi-automated)

- **Method:** Zephyr provides a REST API for test cases, test runs, and execution status. A weekly CSV export is pulled and joined with JIRA stories to compute coverage.
- **What we pull:** number of tests per story, automation flags, test run outcomes (pass / fail / blocked).
- **Prerequisite:** Zephyr API token.
- **Fallback:** if Zephyr uptake is low across teams, we fall back to counting from JIRA links only.

### 2.3 GitHub (automated)

- **Method:** GitHub REST API polled weekly. A script extracts PR metadata (opened / merged timestamps, reviewer count, file changes, docs-file presence).
- **What we pull:** cycle time per PR, documentation-coverage score (does the PR touch a `docs/` path or a `README`?), reviewer participation, diff stats (LOC).
- **Prerequisite:** GitHub Enterprise tier confirmation (some analytics require Business/Enterprise) — part of tool authorization.

### 2.4 Confluence / SharePoint (semi-manual)

- **Method:** Page history and version history are reviewed weekly. For SharePoint, a page-inventory export lists SDD versions. For Confluence, ADR pages are counted via page-label search.
- **What we pull:** SDD revision count, ADR count, Testing Services Playbook updates.
- **Owner:** AI Transformation Lead runs the inventory queries; SA and Testing Services Lead flag any new pages they authored in the weekly report.

### 2.5 Dynamics solution exports (manual)

- **Method:** Developer runs a solution export at the end of each sprint and shares the diff. The change log is tallied for the "configuration items delivered" metric.
- **Owner:** Developer (self-reported); verified by Solution Architect.
- **Cadence:** end of each sprint.

### 2.6 Tool analytics (dashboard-based)

**Atlassian Rovo is expected to be the primary AI tool** across BA, Tester, and SA workflows — so Rovo analytics will be the densest data source on the tool-usage side.

- **Atlassian Rovo:** Analytics tab in the Atlassian admin console shows generative-feature usage, prompt counts, and acceptance patterns across JIRA and Confluence. Because Rovo sits inside the Atlassian ecosystem, it directly correlates with JIRA/Confluence activity — richer than standalone-tool analytics.
- **GitHub Copilot:** Admin dashboard shows prompt count and acceptance rate per user. Requires Enterprise tier for per-user breakdown.
- **M365 Copilot:** Usage report in the Microsoft 365 admin center.
- **Method:** AI Transformation Lead pulls weekly screenshots / CSV exports from each dashboard. Rovo data is consolidated into the primary AI usage log; GitHub Copilot and M365 Copilot data are secondary inputs.
- **Cadence:** weekly.

### 2.7 Survey (SPACE + AI tool satisfaction)

- **Method:** Survey questionnaire distributed three times — pre-pilot (baseline), mid-pilot (~June 10), and post-pilot. Short 5-question pulse survey runs per sprint.
- **Owner:** AI Transformation Lead drafts the questions; Workforce Manager facilitates distribution.
- **Prerequisite:** Confirm survey tool choice (Survey Monkey is the current proposal).

### 2.8 Manual logs (spot check + AI usage + change request)

- **Spot check log:** Pilot Governance Lead reviews 3–5 AI-assisted artifacts per week during the weekly governance meeting. Findings recorded in a shared Teams file.
- **AI usage log:** Pilot team members note any unusual prompts or near-miss incidents in a shared log.
- **Change request register:** Pilot Governance Lead logs every scope / tool / guardrail change request with decision and rationale.
- All three live in the "DCFS AI Rollout" Teams channel.

### 2.9 Self-reported timesheet (SDD, test-case creation, playbook contributions)

- **Method:** Pilot members log time against specific activity buckets in a shared spreadsheet or Tempo (if available). Weekly rollup feeds the dashboard.
- **Owner:** Each pilot member (self-reported); AI Transformation Lead consolidates.
- **Note:** This is the highest-burden collection method. The team should select sparingly — only metrics where time cost is a primary signal.

---

## 3. Prerequisites summary

| # | Prerequisite | Owner | Target |
|---|--------------|-------|--------|
| 1 | JIRA API token with read access | AI Transformation Lead + JIRA admin | Before baselining starts |
| 2 | Zephyr Scale API token | AI Transformation Lead + JIRA admin | Before baselining starts |
| 3 | GitHub tier confirmation (Business / Enterprise) | DCFS (via DoIT) | With tool authorization |
| 4 | Survey tool selection confirmed | AI Transformation Lead + DCFS | Before baseline survey goes out |
| 5 | SharePoint access for SDD version history | AI Transformation Lead | Before baselining starts |
| 6 | Teams channel set up for manual logs | Pilot Governance Lead | Before pilot start |

---

## 4. Automation level — quick reference

| Source | Automation | Weekly effort |
|--------|------------|---------------|
| JIRA | Fully automated (script) | Minimal — review only |
| GitHub | Fully automated (script) | Minimal — review only |
| Zephyr Scale | Semi-automated (CSV + join) | ~15 min |
| Confluence / SharePoint | Semi-manual (inventory query) | ~20 min |
| Tool analytics dashboards | Manual (screenshots / CSV) | ~15 min per tool |
| Surveys | Platform-based (3 rounds + sprint pulse) | ~30 min per round |
| Manual logs | Fully manual | ~15 min per week (Governance Lead) |
| Self-reported timesheet | Manual (pilot team) | ~5 min per day per member |

---

## 5. Version history

| Version | Date | Changes |
|---------|------|---------|
| v1.0 draft | 2026-04-23 | Initial collection-methods document — split from Pilot Metrics by Role for separation between "what we measure" and "how we collect." |

---

*This is a working operational runbook. Update as collection methods change or new data sources are added.*
