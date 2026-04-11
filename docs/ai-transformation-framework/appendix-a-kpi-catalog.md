---
title: "KPI Catalog"
description: "Full 22-KPI reference with formulas, data sources, and selection guidance"
---

# Appendix A: Full KPI Catalog

> **Framework includes 22 KPIs across 5 categories. Up to 8 will be selected for each engagement based on executive priorities and data availability. Not all KPIs apply to every engagement -- configuration-first platforms may not use code-centric metrics.**

---

## Category 1: Velocity (4 KPIs)

### KPI 1 -- Sprint Velocity

- **Description:** Average story points completed per sprint
- **Formula:** `SUM(story_points_done) / number_of_sprints`
- **Data Source:** Work tracking tool (e.g., JIRA, Azure DevOps)
- **Collection Method:** Automated -- extracted from sprint reports
- **Frequency:** Per sprint
- **Target Direction:** Higher is better

### KPI 2 -- Cycle Time

- **Description:** Days from In Progress to Done
- **Formula:** `AVG(date_done - date_in_progress)` for all stories in the sprint
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- calculated from workflow timestamps
- **Frequency:** Per sprint
- **Target Direction:** Lower is better

### KPI 3 -- Throughput

- **Description:** Number of items completed per sprint
- **Formula:** `COUNT(stories where status = Done)` at sprint close
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- extracted from sprint reports
- **Frequency:** Per sprint
- **Target Direction:** Higher is better

### KPI 4 -- Sprint Predictability

- **Description:** Ratio of committed versus delivered story points
- **Formula:** `SUM(story_points_delivered) / SUM(story_points_committed) * 100`
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- sprint commitment snapshot at sprint start vs. sprint close
- **Frequency:** Per sprint
- **Target Direction:** Higher is better (target: 80-100%)

---

## Category 2: Quality (6 KPIs)

### KPI 5 -- Story Quality Score

- **Description:** 13-criteria checklist measuring clarity, acceptance criteria, and completeness
- **Formula:** `SUM(criteria_met) / 13 * 100` per story; report team average
- **Data Source:** Scanner (AI-powered story quality scanner)
- **Collection Method:** Automated -- scanner evaluates each story against the 13-point rubric
- **Frequency:** Per sprint
- **Target Direction:** Higher is better

### KPI 6 -- Story Rejection Rate

- **Description:** Percentage of stories sent back for rework during review
- **Formula:** `COUNT(stories_rejected) / COUNT(stories_submitted_for_review) * 100`
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- tracked via workflow transitions (any move from review back to draft/in-progress)
- **Frequency:** Per sprint
- **Target Direction:** Lower is better

### KPI 7 -- First Pass Yield

- **Description:** Percentage of stories passing QA on the first attempt
- **Formula:** `COUNT(stories_passing_qa_first_attempt) / COUNT(stories_submitted_to_qa) * 100`
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- tracked via workflow transitions (stories that move from QA to Done without returning to In Progress)
- **Frequency:** Per sprint
- **Target Direction:** Higher is better

### KPI 8 -- Test Coverage

- **Description:** Percentage of stories with linked test cases
- **Formula:** `COUNT(stories_with_linked_tests) / COUNT(total_stories) * 100`
- **Data Source:** Test management tool (e.g., Zephyr, TestRail, Azure Test Plans)
- **Collection Method:** Automated -- traceability report cross-referenced with stories
- **Frequency:** Per sprint
- **Target Direction:** Higher is better

### KPI 9 -- Defect Density

- **Description:** Number of bugs per story point delivered
- **Formula:** `COUNT(bugs_found) / SUM(story_points_delivered)`
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- query for issue type = Bug linked to sprint stories
- **Frequency:** Per sprint
- **Target Direction:** Lower is better

### KPI 10 -- Defect Escape Rate

- **Description:** Defects found in UAT or production (escaped past QA)
- **Formula:** `COUNT(defects_found_in_uat_or_prod) / COUNT(total_defects) * 100`
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- query filtering bugs by environment field (UAT, Production)
- **Frequency:** Per sprint
- **Target Direction:** Lower is better

---

## Category 3: Efficiency (5 KPIs)

### KPI 11 -- Story Review Cycle Time

- **Description:** Days from story draft to ready-for-dev status
- **Formula:** `AVG(date_ready_for_dev - date_created)` for all stories in the sprint
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- calculated from workflow timestamps
- **Frequency:** Per sprint
- **Target Direction:** Lower is better

### KPI 12 -- Test Creation Time

- **Description:** Hours required to create test scripts per story
- **Formula:** `SUM(hours_spent_on_test_creation) / COUNT(stories_with_tests)`
- **Data Source:** Manual (time tracking by QA team)
- **Collection Method:** Manual -- QA team logs hours per story in time tracking or sprint retrospective
- **Frequency:** Per sprint
- **Target Direction:** Lower is better

### KPI 13 -- Story Authoring Time

- **Description:** Time from story creation to ready-for-dev
- **Formula:** `AVG(date_ready_for_dev - date_created)` in hours or days
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- calculated from workflow timestamps
- **Frequency:** Per sprint
- **Target Direction:** Lower is better

### KPI 14 -- Sprint Completion Rate

- **Description:** Percentage of committed stories delivered by sprint close
- **Formula:** `COUNT(stories_done) / COUNT(stories_committed) * 100`
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- sprint commitment snapshot at sprint start vs. sprint close
- **Frequency:** Per sprint
- **Target Direction:** Higher is better

### KPI 15 -- Rework Rate

- **Description:** Stories reopened after being marked Done
- **Formula:** `COUNT(stories_reopened_after_done) / COUNT(stories_completed) * 100`
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- workflow transition tracking (Done to any active status)
- **Frequency:** Per sprint
- **Target Direction:** Lower is better

---

## Category 4: Team Health (4 KPIs)

### KPI 16 -- SPACE Survey

- **Description:** Composite score across Satisfaction, Performance, Activity, Communication, and Efficiency dimensions
- **Formula:** `AVG(satisfaction, performance, activity, communication, efficiency)` each scored 1-5
- **Data Source:** Survey
- **Collection Method:** Manual -- anonymous team survey distributed at the end of each iteration cycle (or quarterly)
- **Frequency:** Per iteration cycle
- **Target Direction:** Higher is better

### KPI 17 -- Requirement Clarity

- **Description:** Team perception score for "Requirements are clear when I start work" (1-5 scale)
- **Formula:** `AVG(clarity_rating)` across all respondents
- **Data Source:** Survey
- **Collection Method:** Manual -- question embedded in sprint retrospective or standalone pulse survey
- **Frequency:** Per sprint
- **Target Direction:** Higher is better

### KPI 18 -- Documentation Completeness

- **Description:** Percentage of features with current, up-to-date documentation
- **Formula:** `COUNT(features_with_current_docs) / COUNT(total_features) * 100`
- **Data Source:** Audit (documentation platform)
- **Collection Method:** Manual -- periodic documentation audit against feature inventory
- **Frequency:** Per iteration cycle
- **Target Direction:** Higher is better

### KPI 19 -- Planning Accuracy

- **Description:** Estimation variance between actual effort and original estimate
- **Formula:** `ABS(actual_points - estimated_points) / estimated_points * 100` averaged across stories
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- story point estimate vs. actual (or time estimate vs. time logged)
- **Frequency:** Per sprint
- **Target Direction:** Lower is better (closer to 0% variance)

---

## Category 5: Migration (3 KPIs)

### KPI 20 -- Migration Defect Rate

- **Description:** Data migration defects discovered per sprint
- **Formula:** `COUNT(migration_defects)` per sprint
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- query filtering for component = "Data Migration" and type = Bug
- **Frequency:** Per sprint
- **Target Direction:** Lower is better

### KPI 21 -- Config Documentation

- **Description:** Platform configuration documentation completeness
- **Formula:** `COUNT(configs_documented) / COUNT(total_configs) * 100`
- **Data Source:** Documentation platform
- **Collection Method:** Manual -- audit of documentation pages against configuration registry
- **Frequency:** Per iteration cycle
- **Target Direction:** Higher is better

### KPI 22 -- Feature Lead Time

- **Description:** End-to-end time from feature definition to production delivery
- **Formula:** `AVG(date_delivered - date_feature_defined)` in days
- **Data Source:** Work tracking tool
- **Collection Method:** Automated -- epic/feature timestamps from creation to Done
- **Frequency:** Per iteration cycle
- **Target Direction:** Lower is better

---

## KPI Selection Guidance

Not every engagement uses all 22 KPIs. The framework recommends selecting **up to 8 KPIs** per engagement. Use the following process to choose the right subset.

### Step 1: Identify Executive Priorities

During the Executive Discovery phase, determine which outcomes matter most to leadership. Common priority themes and their associated KPIs:

| Executive Priority | Recommended KPIs |
|---|---|
| Speed / Time-to-Market | Sprint velocity, Cycle time, Throughput, Feature lead time |
| Delivery Predictability | Sprint predictability, Sprint completion rate, Planning accuracy |
| Quality / Reduce Defects | Defect density, Defect escape rate, First pass yield, Story quality score |
| Efficiency / Cost Reduction | Story authoring time, Test creation time, Story review cycle time, Rework rate |
| Team Satisfaction | SPACE survey, Requirement clarity |
| Migration Success | Migration defect rate, Config documentation |

### Step 2: Assess Data Availability

For each candidate KPI, verify that the required data source is accessible and reliable:

| Collection Method | Prerequisites |
|---|---|
| **Automated (Work tracking)** | Project access, consistent workflow usage, standard field conventions |
| **Automated (Test management)** | Test management tool integration active, test cases linked to stories |
| **Automated (Scanner)** | Story quality scanner deployed and configured |
| **Manual (Survey)** | Survey tool available, team participation commitment |
| **Manual (Audit)** | Documentation platform access, feature/config registry maintained |
| **Manual (Time tracking)** | Team willingness to log effort data |

Drop any KPI whose data source is unreliable or unavailable. A KPI with bad data is worse than no KPI.

### Step 3: Balance the Portfolio

A strong KPI set covers multiple categories. Aim for:

- **2-3 from Velocity or Efficiency** -- measures of speed and throughput
- **2-3 from Quality** -- guards against speed gains that sacrifice quality
- **1-2 from Team Health** -- ensures improvements are sustainable
- **0-1 from Migration** -- only if the engagement includes data migration or platform configuration

### Step 4: Confirm Baseline Feasibility

Before finalizing, verify that each selected KPI can be baselined within the first 2-3 sprints. If historical data exists, use it. If not, the baseline period must capture enough data points for a meaningful starting measurement.

### Step 5: Lock and Communicate

Document the selected KPIs, their formulas, owners, and collection cadence in the engagement charter. Share with the full team so everyone understands what is being measured and why.

---

## Summary Table

| # | Category | KPI | Source | Collection | Frequency | Direction |
|---|---|---|---|---|---|---|
| 1 | Velocity | Sprint velocity | Work tracking | Automated | Per sprint | Higher |
| 2 | Velocity | Cycle time | Work tracking | Automated | Per sprint | Lower |
| 3 | Velocity | Throughput | Work tracking | Automated | Per sprint | Higher |
| 4 | Velocity | Sprint predictability | Work tracking | Automated | Per sprint | Higher |
| 5 | Quality | Story quality score | Scanner | Automated | Per sprint | Higher |
| 6 | Quality | Story rejection rate | Work tracking | Automated | Per sprint | Lower |
| 7 | Quality | First pass yield | Work tracking | Automated | Per sprint | Higher |
| 8 | Quality | Test coverage | Test management | Automated | Per sprint | Higher |
| 9 | Quality | Defect density | Work tracking | Automated | Per sprint | Lower |
| 10 | Quality | Defect escape rate | Work tracking | Automated | Per sprint | Lower |
| 11 | Efficiency | Story review cycle time | Work tracking | Automated | Per sprint | Lower |
| 12 | Efficiency | Test creation time | Manual | Manual | Per sprint | Lower |
| 13 | Efficiency | Story authoring time | Work tracking | Automated | Per sprint | Lower |
| 14 | Efficiency | Sprint completion rate | Work tracking | Automated | Per sprint | Higher |
| 15 | Efficiency | Rework rate | Work tracking | Automated | Per sprint | Lower |
| 16 | Team Health | SPACE survey | Survey | Manual | Per cycle | Higher |
| 17 | Team Health | Requirement clarity | Survey | Manual | Per sprint | Higher |
| 18 | Team Health | Documentation completeness | Audit | Manual | Per cycle | Higher |
| 19 | Team Health | Planning accuracy | Work tracking | Automated | Per sprint | Lower |
| 20 | Migration | Migration defect rate | Work tracking | Automated | Per sprint | Lower |
| 21 | Migration | Config documentation | Documentation | Manual | Per cycle | Higher |
| 22 | Migration | Feature lead time | Work tracking | Automated | Per cycle | Lower |
