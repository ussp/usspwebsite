## ADDED Requirements

### Requirement: Canonical Metric Library
The system SHALL maintain a canonical metric library (site_id null) seeded from the DCFS pilot 52-metric inventory. Each library entry SHALL include role, name, what_it_measures, data_source, collection_difficulty (easy/medium/hard), ai_win_likelihood (high/medium/low), velocity_impact, quality_impact, category (DORA / SPACE / Quality / Survey-derived / Shift-left / Release Quality / Cross-cutting / Custom), version, and status (draft/active/deprecated).

#### Scenario: Browsing the canonical library
- **WHEN** an admin opens `/metrics/library` without a tenant filter
- **THEN** the system SHALL list all active canonical metrics with category, role, and difficulty/win flags visible

#### Scenario: Filtering by category
- **WHEN** the admin filters by category "DORA Benchmarks"
- **THEN** the system SHALL show only the 4 DORA metrics: Deployment frequency, Change failure rate, Rework rate, AI tool ROI composite

#### Scenario: Versioning a metric
- **WHEN** the admin edits an active library entry
- **THEN** the system SHALL create a new version with incremented version number, mark the previous version deprecated, and preserve the previous version's record so engagements pinned to it continue to read consistent metadata

### Requirement: Tenant-Specific Library Clones
The system SHALL allow a tenant (site_id) to clone a canonical library entry. Cloned entries SHALL retain a reference to the parent canonical metric and version, and the tenant MAY modify the clone without affecting the canonical record.

#### Scenario: Cloning a canonical metric
- **WHEN** an admin clones the canonical "Story quality score (QUS 13-criteria)" into the DCFS tenant
- **THEN** the system SHALL create a new `metric_library` row with `site_id = dcfs_site_id`, `parent_metric_id = canonical id`, `is_canonical = false`, version 1

#### Scenario: Editing a tenant clone
- **WHEN** the DCFS admin edits the cloned QUS metric to add a custom rubric note
- **THEN** the system SHALL update the tenant clone only — the canonical record SHALL remain unchanged

### Requirement: Per-Metric Collection Methods
The system SHALL store, per library metric, a collection-methods record describing data source, specific collection steps, automation level (automated / semi_auto / manual), owner role, cadence, prerequisites (as a list), estimated effort, and a sample query when applicable.

#### Scenario: Viewing collection method for a metric
- **WHEN** the admin opens a metric detail page for "Test coverage %"
- **THEN** the system SHALL display the data source ("Zephyr Scale ↔ JIRA links"), the steps, owner ("AI Transformation Lead"), cadence ("Per sprint"), prerequisites ("Zephyr Scale REST API token"), and estimated effort ("~5 min")

#### Scenario: Aggregated prerequisites across selected metrics
- **WHEN** an engagement has selected 12 metrics that all require "JIRA REST API token"
- **THEN** the engagement prerequisites view SHALL show "JIRA REST API token" once with a "12 metrics blocked" badge, not 12 separate entries

### Requirement: Engagement Metric Selection
The system SHALL allow each engagement to select metrics from the library (canonical or tenant-cloned) and add custom metrics not in the library. Each engagement-metric SHALL have a status (proposed / locked / dropped), inherit the library metric's role assignment by default, and support per-engagement role re-mapping.

#### Scenario: Selecting metrics for the DCFS engagement
- **WHEN** the DCFS admin adds the 52 pilot metrics to the engagement in `proposed` status
- **THEN** the system SHALL create 52 `engagement_metrics` rows, each pinned to the active version of the library metric

#### Scenario: Locking the final metric set
- **WHEN** the role lead picks the final 1–2 metrics for their role and the admin marks them `locked`
- **THEN** the system SHALL set `status = locked`, `locked_at = now()`, and the design-phase metric set is treated as committed

#### Scenario: Adding a custom (engagement-only) metric
- **WHEN** the admin creates a metric not in the library by setting `is_custom = true` and providing `custom_definition`
- **THEN** the system SHALL store it as engagement-scoped only (no library reference); it SHALL not propagate to the canonical library

### Requirement: Engagement-Level Feasibility Tracking
The system SHALL track collection feasibility (Confirmed / Pending / Blocked) per engagement-metric, with notes explaining the local situation. Feasibility SHALL be a per-engagement attribute, not a library attribute.

#### Scenario: Same metric, different feasibility per engagement
- **WHEN** the DCFS engagement marks "Test coverage %" as `confirmed` (Zephyr Scale enabled) and another engagement marks the same library metric as `blocked` (no Zephyr Scale)
- **THEN** the system SHALL persist both feasibility records independently

#### Scenario: Resolving a prerequisite unblocks dependent metrics
- **WHEN** the admin marks the "JIRA REST API token" prerequisite as resolved for the engagement
- **THEN** the system SHALL surface a banner suggesting the admin update feasibility on each metric that lists this prerequisite

### Requirement: Trailing-Indicator Awareness
The system SHALL flag metrics that need a minimum number of measurement periods before producing a meaningful read (e.g., "Released-story bug return rate" needs 3 sprints). The flag SHALL be stored in `metric_library.metadata.trailing_periods` (integer).

#### Scenario: Trend view for a trailing indicator with insufficient data
- **WHEN** the admin opens the trend view for a metric flagged with `trailing_periods = 3` and only 1 period of data exists
- **THEN** the system SHALL display "Needs 2 more periods before first meaningful read" instead of plotting noise

#### Scenario: Trend view once enough periods exist
- **WHEN** 3 or more periods of data exist
- **THEN** the system SHALL plot the trend with the baseline horizontal line and any defined target line

### Requirement: Survey-Derived Metric Computation
The system SHALL allow library metrics to be linked to specific survey questions with a computation type (likert_avg / likert_delta / count / percentage). When a survey round closes, the system SHALL auto-compute the metric value for each engagement that has the metric selected and insert a record into `metric_collection_records`.

#### Scenario: Linking the AI skills delta metric to B-block questions
- **WHEN** the admin links the "Pre/mid/post AI skills delta" library metric to questions B1–B7 with computation `likert_delta`
- **THEN** subsequent survey rounds SHALL trigger a delta computation against the baseline round and store the result per engagement

#### Scenario: Auto-compute on round close
- **WHEN** a "mid" survey round closes for an engagement that has the skills-delta metric selected
- **THEN** the system SHALL compute `mid_avg − baseline_avg` across the linked questions and insert the value into `metric_collection_records`

### Requirement: Excel Export of Engagement Metrics
The system SHALL export an engagement's selected metrics and collection methods as an Excel workbook for sharing with stakeholders who do not use the tool (DoIT, RTE, role leads). Export SHALL include the metric inventory sheet (with category / role / difficulty / win / velocity impact / quality impact) and a collection-methods sheet (with data source / method / prerequisites / feasibility).

#### Scenario: Engagement admin downloads Excel snapshot
- **WHEN** the admin clicks "Export to Excel" on the engagement metrics page
- **THEN** the system SHALL generate an .xlsx with two sheets matching the structure of the seed Excels and trigger a browser download

#### Scenario: No import from Excel back to the tool
- **WHEN** an admin attempts to upload a modified Excel back into the tool
- **THEN** the system SHALL not accept Excel imports; edits MUST be made in the tool to avoid bidirectional drift

### Requirement: Open-Ended Role Taxonomy
The system SHALL treat `metric_library.role` as a free-text field, not a constrained enum, so that engagements MAY introduce new roles (e.g., Tech Lead, UX Designer, SRE, Data Engineer) without a schema change. The metric-library UI SHALL populate role filters from the distinct set of roles currently present in the library.

#### Scenario: Adding a metric for a new role
- **WHEN** an engagement introduces a "Tech Lead" role that does not exist in the seeded library and the admin creates a new metric with `role = "Tech Lead"`
- **THEN** the system SHALL persist the metric without rejecting the unknown role, and the library role filter SHALL include "Tech Lead" on next render

#### Scenario: Library grows alongside engagement role expansion
- **WHEN** subsequent engagements continue adding roles outside the DCFS pilot's 7 (BA, Dev, QA, Architect, Scrum Master, RTE, Product Owner)
- **THEN** the library SHALL accumulate role-specific metrics over time, and the canonical library SHALL be reviewed periodically by superadmins to promote tenant-specific role metrics into canonical entries when broadly applicable

### Requirement: Multi-Tenant Data Isolation
All metric library, engagement metric, feasibility, and collection record data SHALL be scoped by `site_id` per the multi-tenant pattern. Canonical library entries (`site_id null`) SHALL be readable by all tenants but writable only by superadmins. Tenant-cloned entries (`site_id` populated) SHALL be readable and writable only by the owning tenant's admins.

#### Scenario: Tenant cannot edit canonical library
- **WHEN** a tenant admin attempts to edit a canonical library entry
- **THEN** the system SHALL reject the request and prompt the admin to clone first

#### Scenario: Superadmin updates canonical library
- **WHEN** a superadmin edits a canonical library entry
- **THEN** the system SHALL create a new version (per the versioning requirement) and the new version SHALL be available to all tenants
