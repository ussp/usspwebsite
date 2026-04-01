# OpenSpec: AI Transformation Monitoring Tool
## USSP Tools Platform - Measuring AI Training Impact on Scrum Teams

**Version:** 1.0
**Date:** 2026-03-31
**Status:** Implemented
**Author:** USSP Engineering
**Deployment:** tools.ussp.co
**Documentation:** See `docs/ai-tools/README.md` for the complete documentation book (13 chapters)

---

## 1. Overview

The AI Transformation Monitoring Tool is a standalone web application that quantitatively measures the impact of AI training on Scrum team productivity. USSP consultants use it to establish a data-driven baseline of a team's delivery performance, deliver role-customized AI enablement training, then measure again to demonstrate concrete, research-backed improvement.

This tool is designed as a **completely independent module** — all database tables are self-contained (only referencing the shared `sites` and `staff_users` tables), enabling it to be spun off as a standalone product at any time.

**Deployment:** `tools.ussp.co` (separate Railway service)
**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase

---

## 2. Problem Statement

Organizations investing in AI training for their engineering teams face a critical gap: **there is no standardized, research-backed way to measure whether the training actually improved team performance.**

Current challenges:
- AI training budgets are approved on faith, not data
- Teams cannot demonstrate ROI to leadership
- No baseline exists to compare against post-training performance
- Metrics are collected manually, inconsistently, or not at all
- Training is generic — a developer and a QA engineer receive the same content despite doing fundamentally different work
- Government agencies (USSP's TOPS contract clients) require measurable outcomes to justify technology investments

### The Oracle Contrast

On March 31, 2026, Oracle conducted massive AI-driven layoffs — replacing workers with AI systems. This tool represents the **opposite philosophy**: AI training doesn't eliminate jobs; it **amplifies** the existing team. The same people, equipped with the right AI tools for their specific roles, deliver measurably more value. No one loses their job. Everyone becomes more effective.

---

## 3. Methodology Paper: Measuring AI Transformation in Scrum Teams

### 3.1 Research Foundation

This tool's measurement methodology is grounded in peer-reviewed research and industry-standard frameworks:

#### DORA Metrics (Google Cloud / Accelerate, 2018-2024)
**Source:** Forsgren, N., Humble, J., Kim, G. — *Accelerate: The Science of Lean Software and DevOps* (2018). Extended by annual State of DevOps Reports (2018-2024).

The four key metrics that predict software delivery performance:

| Metric | What It Measures | How AI Training Affects It |
|--------|-----------------|---------------------------|
| **Deployment Frequency** | How often code deploys to production | AI-assisted coding accelerates feature completion, enabling more frequent releases |
| **Lead Time for Changes** | Time from commit to production | AI tools reduce coding time, automated test generation shortens verification |
| **Change Failure Rate** | % of deployments causing incidents | AI code review catches defects earlier; risk: AI-generated code may introduce novel bugs |
| **Mean Time to Recovery (MTTR)** | Time to restore service after failure | AI-assisted debugging and root cause analysis reduce recovery time |

DORA research classifies teams into Elite, High, Medium, and Low performers. AI training aims to move teams up at least one tier.

#### SPACE Framework (Microsoft Research, 2021)
**Source:** Forsgren, N., Storey, M-A., Maddila, C., Zimmermann, T., Houck, B., Butler, J. — *"The SPACE of Developer Productivity"* (ACM Queue, 2021).

Five dimensions — no single metric is sufficient:

| Dimension | What It Measures | Survey Questions Used |
|-----------|-----------------|----------------------|
| **Satisfaction** | Developer happiness, fulfillment, tool satisfaction | "I am satisfied with my development tools and workflow" (1-5) |
| **Performance** | Quality of outcomes, reliability, meeting goals | "I consistently deliver high-quality work that meets sprint commitments" (1-5) |
| **Activity** | Volume of meaningful output, task completion rate | "I complete a meaningful number of tasks each sprint" (1-5) |
| **Communication** | Collaboration quality, review speed, knowledge sharing | "My team communicates effectively and reviews happen promptly" (1-5) |
| **Efficiency** | Time on valuable work vs toil, unblocked flow | "I spend most of my time on valuable work, not repetitive tasks" (1-5) |

**Key principle from SPACE authors:** Always measure at least 3 dimensions, mixing perceptual (surveys) with objective (system data). Never use Activity alone — it incentivizes busy-work over impact.

#### DevEx Framework (ACM Queue, 2023)
**Source:** Noda, A., Storey, M-A., Forsgren, N. — *"DevEx: What Actually Drives Productivity"* (ACM Queue, 2023).

Three core dimensions of developer experience:

| Dimension | What It Measures | AI Training Impact |
|-----------|-----------------|-------------------|
| **Flow State** | Ability to focus without interruption | AI handles boilerplate, reducing context switches. Developers stay in flow longer. |
| **Feedback Loops** | Speed of build/test/review cycles | AI-generated tests run faster. AI code review provides instant feedback. |
| **Cognitive Load** | Mental effort to understand and work in the system | AI explains unfamiliar code, generates documentation. BUT: over-reliance may reduce deep understanding. |

#### Empirical Studies

| Study | Key Finding | Relevance |
|-------|-------------|-----------|
| **Peng et al. (2023)** — GitHub/Microsoft | Copilot users completed tasks **55.8% faster** in randomized controlled trial (95 developers) | Benchmark for individual task completion improvement |
| **Dell'Acqua et al. (2023)** — Harvard Business School / BCG | 758 consultants using GPT-4: **25% faster**, **40% higher quality**, completed **12.2% more tasks** | Benchmark for knowledge work improvement; also identified the "jagged frontier" where AI can mislead |
| **McKinsey (2023)** — "Unleashing Developer Productivity with Generative AI" | **20-45% productivity improvement** across software engineering tasks, varying by task type (documentation 50%+, code generation 35-45%, debugging variable) | Task-type-specific benchmarks |
| **Forrester TEI (2023)** — Total Economic Impact of GitHub Copilot | **22% developer productivity improvement**, $1.5M+ NPV for composite organization | Enterprise ROI benchmark |
| **Google DORA Report (2024)** | AI tool adoption positively correlated with Elite/High performer classification | Validates DORA metrics as AI impact indicators |
| **DORA AI Capabilities Model (2025)** | 7 organizational capabilities determine AI success; "AI is an amplifier" | Organizational readiness assessment framework |
| **DORA State of AI-assisted Software Development (2025)** | 90% use AI; only 24% trust AI code significantly; 3 core tensions identified | AI trust metric, tension tracking, amplifier model |

### 3.2 Measurement Methodology

#### Phase 0 (Optional): AI Readiness Assessment

Score the organization's 7 DORA AI capabilities (1-5 each):
- AI-Accessible Internal Data, Clear AI Stance, Healthy Data Ecosystems
- Platform Engineering, User-Centric Focus, Version Control Maturity, Working in Small Batches

**Tiers**: Not Ready (<2.0), Foundation Needed (2.0-2.9), Ready (3.0-3.9), Well Positioned (4.0-5.0)

This phase is standalone (runs as its own module) but can be linked to a Transformation engagement. If linked, the final report includes an **Amplifier Analysis** correlating readiness with improvement.

#### Phase 1: Baseline Assessment (3-6 sprints before AI training)

**Quantitative (from Scrum tool integration):**
- Sprint velocity (story points completed per sprint, averaged)
- Cycle time (median time from issue start to done)
- Sprint predictability (committed vs delivered ratio)
- Throughput (items completed per sprint)
- Bug escape rate (production bugs per sprint)
- DORA metrics from CI/CD pipeline

**Qualitative (from surveys):**
- SPACE survey (5 dimensions, 1-5 Likert scale, all team members)
- DevEx survey (3 dimensions, 1-5 Likert scale, all team members)

#### Phase 2: AI Training Delivery (outside the tool)

Training is customized by role based on the activity analysis from baseline data:
- What issue types each person works on
- How time is distributed across activities
- Which activities have the highest AI automation potential

#### Phase 3: Post-Training Assessment (3-6 sprints after training + 2-4 week ramp-up buffer)

Same metrics collected again. The 2-4 week buffer after training completion allows the team to internalize new tools and practices before measurement begins.

#### Phase 4: Comparison & Report

**Delta Calculation:**
- For metrics where higher is better (velocity, throughput, deployment frequency): `((post - baseline) / baseline) * 100`
- For metrics where lower is better (cycle time, MTTR, change failure rate, cognitive load): `((baseline - post) / baseline) * 100`
- Survey scores: direct difference and percentage change

**Overall Improvement Score:**
Weighted average across all dimensions:
- DORA metrics: 30% weight (4 metrics, 7.5% each)
- Scrum metrics: 30% weight (4 metrics, 7.5% each)
- SPACE survey: 25% weight (5 dimensions, 5% each)
- DevEx survey: 15% weight (3 dimensions, 5% each)

**Benchmark Comparison:**
Results are contextualized against published research benchmarks:
- < 10% improvement: Below typical AI training impact
- 10-25% improvement: Consistent with conservative estimates (Forrester)
- 25-45% improvement: Consistent with McKinsey and Harvard/BCG findings
- > 45% improvement: Exceptional (approaching GitHub Copilot individual task benchmark)

### 3.3 Statistical Rigor

- **Minimum sample**: At least 3 sprints per assessment period for reliable averages
- **Learning curve buffer**: First 2-4 weeks post-training excluded from "after" measurements
- **Novelty effect awareness**: Report flags if improvement exceeds 60% (may include novelty/engagement boost that fades)
- **Quality co-measurement**: Every speed metric is paired with a quality metric. Improvement claims require no degradation in quality.
- **Goodhart's Law warning**: Metrics are observational, not targets. Teams are measured on what they naturally produce, not incentivized to game specific numbers.

---

## 4. Government Efficiency Application

### 4.1 Why Government Teams Need This Tool

USSP serves government agencies through its **TOPS (Technology Outsourcing and Professional Services)** contract:
- **Contract #:** CMT4599470
- **BidBuy #:** P-59947
- **Prime:** Krasan Consulting Services
- **USSP Role:** Authorized Subvendor
- **Expiry:** February 2034

Government agencies face unique pressures:
- **Budget justification**: Every training dollar must demonstrate measurable outcomes
- **Oversight requirements**: Auditors and inspectors general require data-driven evidence of improvement
- **Workforce modernization mandates**: Executive orders and agency directives increasingly require AI adoption with measurable results
- **Taxpayer accountability**: Public funds demand transparent ROI reporting
- **Headcount constraints**: Government teams cannot simply "hire more people" — they must make existing teams more productive

### 4.2 How the Tool Addresses Government Needs

| Government Requirement | How the Tool Addresses It |
|----------------------|--------------------------|
| **Measurable outcomes** | Quantitative before/after data using peer-reviewed frameworks (DORA, SPACE, DevEx) |
| **Audit trail** | Every data point is timestamped, attributed, and linked to its source (Jira, Azure DevOps) |
| **Standardized methodology** | Research-backed framework with published citations — not proprietary or arbitrary |
| **Role-based training** | Training is customized per role, ensuring every government employee gets relevant AI tools — not generic "AI awareness" |
| **No job displacement** | The tool explicitly measures "same team, more output" — aligns with government workforce protection policies |
| **Budget ROI** | Executive summary reports show concrete productivity gains that justify training investment |
| **Cross-team benchmarking** | Government agencies can compare improvement across departments and teams |
| **Compliance with AI mandates** | Demonstrates structured, measured AI adoption — not ad-hoc experimentation |

### 4.3 Government-Specific Features

- **Executive Summary Export**: One-page PDF suitable for budget justifications and IG reports
- **Audit-Ready Data**: All metrics traced to source with timestamps and assessor attribution
- **FedRAMP-Compatible Architecture**: Supabase-based, deployable to government-approved cloud infrastructure
- **Section 508 Compliance**: Accessible UI with proper ARIA labels, keyboard navigation, and screen reader support
- **Multi-Agency Support**: Multi-tenant architecture supports multiple agencies under one deployment
- **Historical Trending**: Track improvement over multiple training cycles (quarterly, annually) to show sustained impact

### 4.4 Government Use Case Example

**Scenario:** Illinois state agency IT team (8 developers, 2 QA, 1 Scrum Master, 1 PO) under TOPS contract.

1. **Baseline (Q1 2026)**: Tool connects to Azure DevOps, observes 4 sprints. Velocity: 42 pts/sprint. Cycle time: 8.3 days. SPACE satisfaction: 3.1/5.
2. **Training (April 2026)**: Role-customized AI training:
   - Developers: GitHub Copilot + AI code review
   - QA: AI test case generation + automated regression
   - SM: AI sprint planning + burndown prediction
   - PO: AI backlog prioritization + user story generation
3. **Post-Training (Q2 2026)**: Same metrics. Velocity: 58 pts/sprint (+38%). Cycle time: 5.1 days (-39%). SPACE satisfaction: 4.2/5 (+35%).
4. **Report**: Executive summary shows 37% overall improvement. Benchmark context: "Consistent with McKinsey 20-45% range." The agency uses this to justify continued AI training investment in their FY2027 budget request.

---

## 5. Solution Architecture

### 5.1 Integration Layer

The tool integrates with project management and DevOps tools to automatically collect metrics. This is the primary data source — manual entry is only for SPACE/DevEx surveys.

#### Supported Integrations

| Platform | Data Collected | API Used |
|----------|---------------|----------|
| **Jira Cloud** | Sprints, velocity, story points, cycle time, issues by type/assignee | Jira REST API v3 |
| **Azure DevOps** | Iterations, work items, velocity, cycle time, pipelines | Azure DevOps REST API |
| **GitHub** | PRs, commits, deployments, CI/CD runs (for DORA metrics) | GitHub REST API v3 |
| **GitLab** | MRs, commits, deployments, pipelines | GitLab REST API v4 |
| **Linear** | Cycles, issues, velocity | Linear GraphQL API |

#### Integration Architecture

```
[Jira/ADO/GitHub] → [Integration Client] → [Adapter] → [Unified SprintData] → [ai_metrics table]
```

- **Integration Client**: Platform-specific API wrapper handling auth, pagination, rate limiting
- **Adapter**: Normalizes platform-specific data into a unified `SprintData` format
- **Unified Format**: All metrics stored in `ai_metrics` with `category` + `metric_name` columns regardless of source

#### Jira Integration Detail

```
Connection Config:
- Jira Cloud URL (e.g., https://company.atlassian.net)
- API token (stored encrypted)
- Project key (e.g., "PLAT")
- Board ID (for sprint data)

Data Pulled:
- GET /rest/agile/1.0/board/{boardId}/sprint — Sprint list with dates
- GET /rest/agile/1.0/sprint/{sprintId}/issue — Issues per sprint with story points
- GET /rest/api/3/search — Issue details with changelog for cycle time calculation
- Computed: velocity, throughput, cycle time, predictability, bug count per sprint
```

### 5.2 Role-Based Training Recommendations

The tool analyzes each team member's activity data from the integration to recommend specific AI training:

**Activity Analysis** (from Jira data):
- Issue types worked on (story, bug, task, spike)
- Story point distribution
- Time in different workflow states
- Comment/collaboration patterns

**Training Catalog by Role**:

| Role | AI Tools | Training Modules |
|------|----------|-----------------|
| **Developer** | GitHub Copilot, Cursor, AI code review, AI debugging | "AI Pair Programming", "AI-Assisted Code Review", "AI Test Generation", "Prompt Engineering for Developers" |
| **QA/Tester** | AI test case generation, visual testing AI, AI exploratory testing | "AI-Powered Test Automation", "AI Regression Testing", "AI Bug Report Analysis" |
| **Scrum Master** | AI sprint planning, AI retrospective analysis, AI burndown prediction | "AI Sprint Analytics", "AI-Facilitated Retrospectives", "Predictive Velocity Modeling" |
| **Product Owner** | AI requirements writing, AI backlog prioritization, AI user story generation | "AI Backlog Management", "AI User Story Refinement", "AI Stakeholder Report Generation" |
| **DevOps** | AI CI/CD optimization, AI incident response, AI monitoring | "AI Infrastructure Management", "AI-Assisted Incident Response", "AI Pipeline Optimization" |
| **Designer** | AI prototyping, AI design system generation, AI accessibility testing | "AI Design Workflows", "AI-Assisted Accessibility Compliance" |

### 5.3 Assessment Workflow

```
┌─────────────┐    ┌───────────────┐    ┌─────────────┐    ┌──────────────────┐    ┌────────────┐
│  1. Create   │───→│ 2. Baseline   │───→│ 3. Training │───→│ 4. Post-Training │───→│ 5. Report  │
│  Engagement  │    │  Assessment   │    │  Delivery   │    │   Assessment     │    │ Generation │
└─────────────┘    └───────────────┘    └─────────────┘    └──────────────────┘    └────────────┘
     │                    │                    │                     │                     │
     ▼                    ▼                    ▼                     ▼                     ▼
  Add teams,         Connect Jira,       Generate role-       Same data sync        Compute deltas,
  members,           sync 3-6 sprints,   based training       + surveys for         benchmark vs
  integration        conduct SPACE/      plans from           post period           research,
  config             DevEx surveys       activity analysis                          executive summary
```

---

## 6. Database Schema

All tables use UUID primary keys, include `site_id` for multi-tenancy, and have `created_at`/`updated_at` timestamps. **No foreign keys to any existing ATS tables** (positions, applications, candidates, etc.) — this module is fully independent.

### 6.1 Table: `ai_engagements`

A training engagement with a client organization.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | UUID | PK | Server-generated |
| `site_id` | String(50) | FK `sites.id` | Multi-tenant isolation |
| `name` | String(255) | NOT NULL | e.g., "Acme Corp - Platform Team Q2 2026" |
| `client_name` | String(255) | NOT NULL | Client organization name |
| `engagement_lead_id` | UUID | FK `staff_users.id` | USSP consultant running this |
| `status` | String(20) | NOT NULL | draft, baseline, training, post_assessment, completed, archived |
| `integration_type` | String(20) | NULL | jira, azure_devops, github, gitlab, linear, manual |
| `integration_config` | JSONB | NULL | `{ baseUrl, projectKey, boardId, token_encrypted }` |
| `notes` | Text | NULL | Internal notes |
| `created_at` | DateTime | NOT NULL | Server default: now() |
| `updated_at` | DateTime | NOT NULL | Server default: now() |

**Indexes:** `(site_id, status)`, `(site_id, engagement_lead_id)`
**Unique:** `(site_id, name)`

### 6.2 Table: `ai_teams`

Teams within an engagement. One engagement can train multiple teams.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | UUID | PK | |
| `site_id` | String(50) | FK `sites.id` | |
| `engagement_id` | UUID | FK `ai_engagements.id` | |
| `name` | String(255) | NOT NULL | e.g., "Platform Team", "Mobile Team" |
| `team_size` | Integer | NOT NULL | |
| `external_team_id` | String(255) | NULL | Jira board ID, ADO team ID, etc. |
| `created_at` | DateTime | NOT NULL | |
| `updated_at` | DateTime | NOT NULL | |

**Indexes:** `(site_id, engagement_id)`

### 6.3 Table: `ai_team_members`

Individual team members with their roles. Used for role-based training and per-person activity analysis.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | UUID | PK | |
| `site_id` | String(50) | FK `sites.id` | |
| `team_id` | UUID | FK `ai_teams.id` | |
| `display_name` | String(255) | NOT NULL | "Dev-1" or real name (consultant's choice) |
| `role` | String(50) | NOT NULL | developer, qa, scrum_master, product_owner, devops, designer |
| `external_user_id` | String(255) | NULL | Jira account ID (for integration mapping) |
| `created_at` | DateTime | NOT NULL | |

**Indexes:** `(site_id, team_id)`

### 6.4 Table: `ai_assessments`

A measurement period (baseline or post-training) for a specific team.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | UUID | PK | |
| `site_id` | String(50) | FK `sites.id` | |
| `team_id` | UUID | FK `ai_teams.id` | |
| `assessment_type` | String(20) | NOT NULL | baseline, post_training |
| `period_start` | DateTime | NOT NULL | Start of measurement window |
| `period_end` | DateTime | NOT NULL | End of measurement window |
| `sprint_count` | Integer | NULL | Number of sprints observed |
| `data_source` | String(20) | NOT NULL | integration, manual |
| `status` | String(20) | NOT NULL | draft, collecting, completed |
| `assessed_by` | UUID | FK `staff_users.id` | |
| `notes` | Text | NULL | |
| `created_at` | DateTime | NOT NULL | |
| `updated_at` | DateTime | NOT NULL | |

**Indexes:** `(site_id, team_id, assessment_type)`
**Unique:** `(site_id, team_id, assessment_type)` — one baseline, one post per team

### 6.5 Table: `ai_metrics`

Unified metrics table for all categories (DORA, SPACE, DevEx, Scrum). One row per metric per assessment (or per member for survey responses).

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | UUID | PK | |
| `site_id` | String(50) | FK `sites.id` | |
| `assessment_id` | UUID | FK `ai_assessments.id` | |
| `category` | String(20) | NOT NULL | dora, space, devex, scrum |
| `metric_name` | String(50) | NOT NULL | e.g., "deployment_frequency", "velocity", "satisfaction" |
| `metric_value` | Numeric | NOT NULL | The numeric value |
| `metric_unit` | String(30) | NOT NULL | per_week, minutes, percentage, story_points, score_1_5, count |
| `member_id` | UUID | FK `ai_team_members.id` | NULL for team-level metrics; set for individual survey responses |
| `raw_data` | JSONB | NULL | Source data from integration (sprint breakdown, etc.) |
| `created_at` | DateTime | NOT NULL | |

**Indexes:** `(site_id, assessment_id, category, metric_name)`, `(site_id, assessment_id, member_id)`

**Metric Catalog:**

| Category | metric_name | metric_unit | Level | Direction |
|----------|------------|-------------|-------|-----------|
| dora | deployment_frequency | per_week | team | higher_better |
| dora | lead_time_minutes | minutes | team | lower_better |
| dora | change_failure_rate | percentage | team | lower_better |
| dora | mttr_minutes | minutes | team | lower_better |
| scrum | velocity | story_points | team | higher_better |
| scrum | cycle_time_days | count | team | lower_better |
| scrum | predictability | percentage | team | higher_better |
| scrum | throughput | count | team | higher_better |
| scrum | bug_escape_rate | count | team | lower_better |
| space | satisfaction | score_1_5 | member | higher_better |
| space | performance | score_1_5 | member | higher_better |
| space | activity | score_1_5 | member | higher_better |
| space | communication | score_1_5 | member | higher_better |
| space | efficiency | score_1_5 | member | higher_better |
| devex | flow_state | score_1_5 | member | higher_better |
| devex | feedback_loops | score_1_5 | member | higher_better |
| devex | cognitive_load | score_1_5 | member | lower_better |

### 6.6 Table: `ai_training_plans`

Role-based training recommendations generated from activity analysis.

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `id` | UUID | PK | |
| `site_id` | String(50) | FK `sites.id` | |
| `team_id` | UUID | FK `ai_teams.id` | |
| `member_id` | UUID | FK `ai_team_members.id` | NULL for team-wide recommendations |
| `role` | String(50) | NOT NULL | Target role |
| `activity_summary` | JSONB | NULL | What this person does (from Jira analysis) |
| `recommended_tools` | JSONB | NOT NULL | `[{ tool, reason, expected_impact }]` |
| `recommended_training` | JSONB | NOT NULL | `[{ module, description, duration_hours, priority }]` |
| `status` | String(20) | NOT NULL | proposed, approved, in_progress, completed |
| `created_at` | DateTime | NOT NULL | |
| `updated_at` | DateTime | NOT NULL | |

**Indexes:** `(site_id, team_id)`, `(site_id, team_id, role)`

---

## 7. API Endpoints

All endpoints require authentication (Google OAuth via NextAuth) and RBAC permission checks.

### 7.1 Engagement Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/engagements` | `ai_engagements.read` | List all engagements (filterable by status, lead) |
| POST | `/api/engagements` | `ai_engagements.create` | Create engagement |
| GET | `/api/engagements/[id]` | `ai_engagements.read` | Get engagement detail |
| PATCH | `/api/engagements/[id]` | `ai_engagements.update` | Update engagement |
| DELETE | `/api/engagements/[id]` | `ai_engagements.delete` | Archive engagement |

### 7.2 Team Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/teams?engagement_id=X` | `ai_engagements.read` | List teams for engagement |
| POST | `/api/teams` | `ai_engagements.update` | Add team to engagement |
| GET | `/api/teams/[id]` | `ai_engagements.read` | Get team detail |
| PATCH | `/api/teams/[id]` | `ai_engagements.update` | Update team |
| GET | `/api/teams/[id]/members` | `ai_engagements.read` | List team members |
| POST | `/api/teams/[id]/members` | `ai_engagements.update` | Add team member |
| PATCH | `/api/teams/[id]/members/[mid]` | `ai_engagements.update` | Update member |

### 7.3 Integration & Sync Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | `/api/teams/[id]/sync` | `ai_assessments.create` | Trigger data pull from integration |
| POST | `/api/teams/[id]/test-connection` | `ai_engagements.update` | Test integration connectivity |

### 7.4 Assessment Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/assessments?team_id=X` | `ai_assessments.read` | List assessments for team |
| POST | `/api/assessments` | `ai_assessments.create` | Create assessment (baseline/post) |
| GET | `/api/assessments/[id]` | `ai_assessments.read` | Get assessment with metrics |
| PATCH | `/api/assessments/[id]` | `ai_assessments.update` | Update assessment status/dates |
| POST | `/api/assessments/[id]/metrics` | `ai_assessments.update` | Batch upsert metrics |
| POST | `/api/assessments/[id]/survey` | `ai_assessments.update` | Submit SPACE/DevEx survey responses |

### 7.5 Training Plan Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/training-plans?team_id=X` | `ai_training.read` | List training plans |
| POST | `/api/training-plans/generate` | `ai_training.create` | Auto-generate from activity analysis |
| PATCH | `/api/training-plans/[id]` | `ai_training.update` | Update plan status/content |

### 7.6 Report Endpoints

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/api/reports/[teamId]` | `ai_reports.read` | Get computed comparison report |
| POST | `/api/reports/[teamId]/compute` | `ai_reports.read` | Trigger report recomputation |

---

## 8. UI Components & Pages

### 8.1 Page Map

```
/                                              → Dashboard (engagement overview)
/login                                         → Google OAuth login
/engagements                                   → Engagements list (DataTable)
/engagements/new                               → Create engagement + integration setup
/engagements/[id]                              → Engagement detail (teams overview)
/engagements/[id]/teams/new                    → Add team + connect to Jira board
/engagements/[id]/teams/[teamId]               → Team detail (members, metrics, timeline)
/engagements/[id]/teams/[teamId]/baseline      → Baseline assessment wizard
/engagements/[id]/teams/[teamId]/post-training → Post-training assessment wizard
/engagements/[id]/teams/[teamId]/survey        → Generate & manage SPACE/DevEx surveys
/engagements/[id]/teams/[teamId]/training-plan → Role-based training recommendations
/engagements/[id]/teams/[teamId]/report        → Before/After comparison report
/methodology                                   → Research citations + methodology
```

### 8.2 New Components

| Component | Purpose |
|-----------|---------|
| `AdminSidebar` | Navigation for AI tools app |
| `AdminTopbar` | User info and sign-out |
| `MetricCard` | KPI display (value, label, subtext) |
| `DataTable` | Sortable, filterable table |
| `StatusBadge` | Color-coded engagement/assessment status |
| `IntegrationSetup` | Jira/ADO/GitHub connection wizard |
| `TeamCard` | Team summary with improvement percentage |
| `AssessmentWizard` | Multi-step assessment configuration |
| `SprintDataTable` | Sprint-by-sprint data view from integration |
| `BeforeAfterCard` | Side-by-side metric comparison with delta |
| `ImprovementBadge` | +/- percentage pill (green for positive, red for negative) |
| `RadarChart` | Custom SVG 5-axis spider chart for SPACE dimensions |
| `BarComparisonChart` | Before/after horizontal bar chart |
| `EngagementTimeline` | Horizontal phase timeline with status indicators |
| `LikertScale` | 1-5 radio button group for surveys |
| `RoleActivityCard` | Activity breakdown per role with AI tool recommendations |
| `TrainingPlanCard` | Training module card with status and priority |
| `ResearchCitationCard` | Study name, key finding, source, year |

### 8.3 Key Screen Designs

#### Dashboard
```
┌────────────────────────────────────────────────────────────────┐
│  AI Transformation Monitor                                      │
├────────┬────────┬────────┬────────┐                            │
│ Active │ Teams  │  Avg   │Assess- │                            │
│Engage- │Assessed│Improve-│ ments  │                            │
│ ments  │        │ ment   │In Prog │                            │
│   4    │  12    │ +31%   │   3    │                            │
├────────┴────────┴────────┴────────┘                            │
│                                                                 │
│  Recent Engagements                                             │
│  ┌──────────────────────────────────────────────────┐          │
│  │ Acme Corp - Platform Team    │ +38% │ Completed  │          │
│  │ State of IL - IT Division    │ +27% │ Post-Assess│          │
│  │ TechCo - Mobile Team         │  --  │ Baseline   │          │
│  └──────────────────────────────────────────────────┘          │
└────────────────────────────────────────────────────────────────┘
```

#### Comparison Report
```
┌────────────────────────────────────────────────────────────────┐
│  Platform Team - AI Transformation Report                       │
│  Client: Acme Corp  |  Baseline: Jan-Mar 2026  |  Post: May-Jul│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Overall Improvement: ████████████████████ +37.2%              │
│  Benchmark: Consistent with McKinsey 20-45% range               │
│                                                                 │
│  DORA Metrics                                                   │
│  ┌──────────────┬──────────┬──────────┬─────────┐              │
│  │ Metric       │ Baseline │   Post   │  Delta  │              │
│  ├──────────────┼──────────┼──────────┼─────────┤              │
│  │ Deploy Freq  │ 2/week   │ 5/week   │ +150%   │              │
│  │ Lead Time    │ 4.2 days │ 1.8 days │ -57%    │              │
│  │ Failure Rate │ 12%      │ 8%       │ -33%    │              │
│  │ MTTR         │ 45 min   │ 22 min   │ -51%    │              │
│  └──────────────┴──────────┴──────────┴─────────┘              │
│                                                                 │
│  SPACE Survey                    Scrum Metrics                  │
│  ┌─────────────────────┐        ┌─────────────────────┐        │
│  │    Satisfaction      │        │ Velocity: 42→58 +38%│        │
│  │   ╱ ╲               │        │ Cycle:  8.3→5.1 -39%│        │
│  │  ╱   ╲  ← post     │        │ Predict: 72%→89%    │        │
│  │ Efficiency  Perform │        │ Through: 14→19 +36% │        │
│  │  ╲   ╱  ← baseline │        └─────────────────────┘        │
│  │   ╲ ╱               │                                       │
│  │  Comm    Activity    │                                       │
│  └─────────────────────┘                                        │
│                                                                 │
│  Research Context                                               │
│  ┌──────────────────────────────────────────────────┐          │
│  │ Harvard/BCG Study: 25% faster, 40% better quality│          │
│  │ McKinsey: 20-45% improvement in software eng     │          │
│  │ Your result: +37.2% — within expected range      │          │
│  └──────────────────────────────────────────────────┘          │
└────────────────────────────────────────────────────────────────┘
```

---

## 9. User Flows

### 9.1 Complete Engagement Flow

1. USSP consultant logs into `tools.ussp.co` with Google OAuth
2. Creates new engagement: "State of IL - IT Division Q2 2026"
3. Adds team: "Application Development Team" (8 members)
4. Connects Jira: enters Atlassian URL, API token, board ID
5. Tests connection — tool confirms access to 6 months of sprint data
6. Adds team members: maps Jira users to roles (4 devs, 2 QA, 1 SM, 1 PO)
7. Creates baseline assessment: selects date range (last 4 sprints)
8. Clicks "Sync Data" — tool pulls sprint data, computes DORA/Scrum metrics
9. Generates SPACE/DevEx survey link — shares with team members
10. Team members complete 8-question survey (5 SPACE + 3 DevEx)
11. Baseline complete — tool shows baseline summary
12. Consultant generates training plans — tool analyzes per-person activity and recommends role-specific AI training
13. Training delivered (4-6 weeks, outside tool)
14. Creates post-training assessment: selects date range (4 sprints after ramp-up buffer)
15. Syncs data + conducts survey again
16. Opens comparison report — sees +32% overall improvement
17. Exports executive summary for agency budget justification

### 9.2 Survey Flow

1. Consultant creates survey from team detail page
2. Tool generates unique survey URL (no auth required for respondents)
3. Consultant shares URL with team via email/Slack
4. Team member opens URL, sees their anonymous identifier (Dev-1, QA-2, etc.)
5. Answers 8 questions on 1-5 Likert scale with optional comments
6. Submits — data stored in `ai_metrics` linked to their `member_id`
7. Consultant sees response count on survey page (e.g., "6/8 completed")

---

## 10. File Structure

### New Package: `packages/ai-tools/`

```
packages/ai-tools/
├── package.json                                    # name: "@ussp/ai-tools", port 3002
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── railway.toml
├── .env.example
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── globals.css
    │   ├── page.tsx                                # Dashboard
    │   ├── login/page.tsx
    │   ├── methodology/page.tsx
    │   ├── engagements/
    │   │   ├── page.tsx                            # List
    │   │   ├── new/page.tsx                        # Create
    │   │   └── [id]/
    │   │       ├── page.tsx                        # Detail
    │   │       └── teams/
    │   │           ├── new/page.tsx                # Add team
    │   │           └── [teamId]/
    │   │               ├── page.tsx                # Team detail
    │   │               ├── baseline/page.tsx
    │   │               ├── post-training/page.tsx
    │   │               ├── survey/page.tsx
    │   │               ├── training-plan/page.tsx
    │   │               └── report/page.tsx
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts
    │       ├── engagements/route.ts
    │       ├── engagements/[id]/route.ts
    │       ├── teams/route.ts
    │       ├── teams/[id]/route.ts
    │       ├── teams/[id]/members/route.ts
    │       ├── teams/[id]/members/[memberId]/route.ts
    │       ├── teams/[id]/sync/route.ts
    │       ├── teams/[id]/test-connection/route.ts
    │       ├── assessments/route.ts
    │       ├── assessments/[id]/route.ts
    │       ├── assessments/[id]/metrics/route.ts
    │       ├── assessments/[id]/survey/route.ts
    │       ├── training-plans/route.ts
    │       ├── training-plans/generate/route.ts
    │       ├── training-plans/[id]/route.ts
    │       └── reports/[teamId]/route.ts
    ├── lib/
    │   └── auth.ts
    └── components/
        ├── AdminSidebar.tsx
        ├── AdminTopbar.tsx
        ├── MetricCard.tsx
        ├── DataTable.tsx
        ├── StatusBadge.tsx
        ├── IntegrationSetup.tsx
        ├── TeamCard.tsx
        ├── AssessmentWizard.tsx
        ├── SprintDataTable.tsx
        ├── BeforeAfterCard.tsx
        ├── ImprovementBadge.tsx
        ├── RadarChart.tsx
        ├── BarComparisonChart.tsx
        ├── EngagementTimeline.tsx
        ├── LikertScale.tsx
        ├── RoleActivityCard.tsx
        ├── TrainingPlanCard.tsx
        └── ResearchCitationCard.tsx
```

### Platform-Core Additions

```
packages/platform-core/src/
├── types/ai-tools.ts                              # All interfaces
├── queries/admin/
│   ├── ai-engagements.ts                          # Engagement + team + member CRUD
│   ├── ai-assessments.ts                          # Assessment + metrics CRUD
│   ├── ai-reports.ts                              # Report computation engine
│   └── ai-training.ts                             # Training plan generation
└── integrations/
    ├── types.ts                                    # Unified SprintData interfaces
    ├── jira.ts                                     # Jira REST API client
    ├── azure-devops.ts                             # Azure DevOps client
    ├── github-metrics.ts                           # GitHub metrics client
    └── adapter.ts                                  # Multi-source normalizer
```

### Database Migration

```
migrations/
├── models.py                                       # Add 6 ai_* table classes
└── versions/
    └── 20260401_000016_create_ai_transformation_tables.py
```

### Unit Tests

```
packages/platform-core/src/__tests__/
├── ai-reports.test.ts                              # Delta calculations, benchmarks, edge cases
├── ai-engagements.test.ts                          # CRUD query tests
├── ai-assessments.test.ts                          # Assessment + metrics tests
└── integrations/
    ├── jira.test.ts                                # Jira API client (mocked HTTP)
    └── adapter.test.ts                             # Data normalization tests

packages/ai-tools/src/__tests__/
└── components/
    ├── RadarChart.test.tsx                          # SVG geometry rendering
    ├── ImprovementBadge.test.tsx                    # Correct +/- display and colors
    └── BeforeAfterCard.test.tsx                     # Comparison logic
```

---

## 11. Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Separate package** (`packages/ai-tools/`) | Different product, different users (consultants vs recruiters). Independent deployment at `tools.ussp.co`. Can be spun off. |
| **Independent tables** (no ATS FKs) | Only references `sites` + `staff_users`. Entire module can be extracted to its own database/repo. |
| **Unified metrics table** | Single `ai_metrics` with `category` + `metric_name` instead of separate DORA/SPACE/DevEx tables. Simpler, more extensible, easy to add new metric types. |
| **Integration-first** | Manual data entry is error-prone and low-adoption. Pulling from Jira/ADO automatically ensures consistent, complete data. |
| **No external chart libs** | Matches existing codebase pattern. RadarChart is straightforward SVG. Bar charts are CSS-width based. |
| **Anonymous respondent IDs** | Survey anonymity encourages honest responses. Consultant maintains offline mapping. |
| **Research citations built-in** | Every report includes benchmark context. Legitimizes the tool's methodology for government and enterprise clients. |
| **Government-first features** | Audit trail, exportable reports, standardized methodology — designed for agencies that need to justify budgets. |

---

## 12. Future Enhancements

### 12.1 Planned
- **PDF Export**: Generate executive summary PDF for stakeholders and budget justifications
- **Historical Trending**: Track team improvement over multiple training cycles (quarterly view)
- **Cross-Engagement Analytics**: Compare improvement rates across different clients and team types
- **AI-Powered Insights**: Use LLM to generate narrative analysis of the improvement data
- **Slack/Teams Notifications**: Alert consultants when surveys are completed or data syncs finish

### 12.2 Considered
- **Real-time Dashboard**: Live sprint monitoring instead of periodic sync
- **Custom Metric Weights**: Allow consultants to adjust the weighting formula for different client priorities
- **Team Self-Service**: Allow team leads to create their own assessments without USSP consultant
- **Marketplace Integration**: Connect to AI tool usage analytics (Copilot dashboard, Cursor analytics) for direct adoption measurement
- **Certification System**: Issue "AI-Transformed Team" certificates with verified improvement scores

---

## 13. References

1. Forsgren, N., Humble, J., Kim, G. (2018). *Accelerate: The Science of Lean Software and DevOps.* IT Revolution Press.
2. Forsgren, N., Storey, M-A., Maddila, C., et al. (2021). "The SPACE of Developer Productivity." *ACM Queue*, 19(1).
3. Noda, A., Storey, M-A., Forsgren, N. (2023). "DevEx: What Actually Drives Productivity." *ACM Queue*, 21(2).
4. Peng, S., Kalliamvakou, E., Cihon, P., Demirer, M. (2023). "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot." *arXiv:2302.06590*.
5. Dell'Acqua, F., McFowland, E., Mollick, E., et al. (2023). "Navigating the Jagged Technological Frontier: Field Experimental Evidence of the Effects of AI on Knowledge Worker Productivity and Quality." *Harvard Business School Working Paper 24-013*.
6. McKinsey & Company (2023). "Unleashing Developer Productivity with Generative AI."
7. Forrester Research (2023). "The Total Economic Impact of GitHub Copilot."
8. Google DORA Team (2024). *State of DevOps Report 2024.*
9. Google DORA Team (2025). *State of AI-assisted Software Development.*
10. Google DORA Team (2025). *DORA AI Capabilities Model.* 7 capabilities that amplify AI benefits.

---

## 14. Verification Checklist

- [ ] Alembic migration creates all 6 `ai_*` tables with correct columns and indexes
- [ ] `cd packages/platform-core && npx tsc` — no TypeScript errors
- [ ] `cd packages/ai-tools && npm run dev` — app boots on port 3002
- [ ] Google OAuth login works on tools.ussp.co domain
- [ ] Create engagement → add team → add members → data persists in DB
- [ ] Jira integration: test connection → sync sprint data → metrics populated
- [ ] SPACE/DevEx survey: generate link → submit responses → data stored
- [ ] Training plan generation produces role-appropriate recommendations
- [ ] Comparison report computes correct deltas and benchmark comparisons
- [ ] RadarChart renders 5-axis SPACE overlay (baseline gray, post blue)
- [ ] ImprovementBadge shows green +% for improvement, red -% for regression
- [ ] Two teams in same engagement show individual improvement percentages
- [ ] All unit tests pass: `npm test`
- [ ] No FK references to ATS tables (positions, applications, candidates)
