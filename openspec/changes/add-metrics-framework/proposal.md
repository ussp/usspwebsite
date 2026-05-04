# Change: Add Metrics Framework to AI Transformation Tool

## Why

The DCFS pilot built a 52-metric inventory + collection-methods catalog + DORA 2025 benchmarks + shift-left testing pattern + release-quality trailing indicators + survey-derived metrics from scratch. Today this lives as Excel + markdown in `clients/dcfs-ilc/planning/deliverables/metrics/` — engagement-specific files that don't carry forward. Every future engagement (or any tenant of the AI Transformation Tool) would have to rebuild the same framework.

The AI Transformation Tool already has the bones of this — a `MetricCategory` type with `dora | space | devex | scrum | quality | readiness` — but no actual metric inventory, no collection-methods catalog, no per-engagement customization, and no place to track collection feasibility. This change productizes the DCFS pilot work into reusable, multi-tenant capabilities so any engagement can clone, customize, run baseline survey rounds, track collection feasibility per source, and see metric trends without rebuilding from scratch.

## What Changes

### Phase 1: Metric Library (master inventory)

- **Master metric library** seeded from the DCFS pilot 52-metric inventory. Each metric has: role, name, what it measures, data source, collection difficulty (easy/medium/hard), AI win likelihood (high/medium/low), velocity impact, quality impact, category (DORA / SPACE / Quality / Survey-derived / Shift-left / Release Quality / Custom).
- **Categorization** matches DORA 2025 framing — Delivery / Predictability / Investment / AI — plus the SDLC-specific categories surfaced in the DCFS pilot.
- **Reusable across tenants** — every site_id can clone the master library and customize. Original library stays canonical; site-level edits create derived versions.
- **Versioned** — metrics evolve (e.g., DORA published 2025 changes); each metric has a version + status (draft/active/deprecated) so engagements pin a known version.

### Phase 2: Engagement Metric Selection

- **Per-engagement metric set** — for an active engagement, admin selects which metrics from the library are in scope. Selection is by role (e.g., select 1–2 BA metrics), aligned with the per-role lock pattern from DCFS Apr 24 D-3.
- **Custom metrics** — engagement can add tenant-specific metrics not in the master library (saved as `is_custom = true`).
- **Role mapping** — selected metrics inherit the role assignments from the library, but admin can re-map per engagement.

### Phase 3: Collection Methods Catalog

- **Per-metric collection method** — for each library metric, a collection-methods record: data source, specific collection steps, auto/manual flag, owner, cadence, prerequisites, estimated effort, sample query.
- **Engagement-specific feasibility** — for each metric in an engagement's selected set, admin tracks feasibility (Confirmed / Pending / Blocked) and notes per metric. This is the conversation surface for talking to the engagement's RTE / data admins.
- **Prerequisite tracking** — the catalog surfaces aggregated prerequisites (e.g., "JIRA REST API token needed" appears once even if 12 metrics depend on it). Resolving the prerequisite unblocks all dependent metrics.

### Phase 4: Survey Integration

- **Survey-derived metrics** — link metric library entries to specific survey questions (B-block skill questions → "Pre/mid/post AI skills delta"). When a survey round closes, derived metrics are auto-computed.
- **Pre / mid / post rounds** — three-round survey cadence (already designed for DCFS) is the default; engagement can add sprint-pulse rounds.
- **Reuses** the existing readiness questionnaire infrastructure (`assessment_questionnaires`, `questionnaire_responses`, `response_answers`) extended with a `survey_round` column.

### Phase 5: Metric Tracking & Trends

- **Metric collection records** — for each metric × engagement × period (sprint/PI/month), record the collected value, baseline value, and notes.
- **Trend view** — dashboard shows metric trend across periods, with baseline horizontal line, target line, and a flag for trailing indicators that need N periods before first read (e.g., released-story bug return rate, bug-trend slope).
- **Multi-dimensional view** — per-engagement dashboard cross-tabs metrics by category (DORA, Quality, Survey-derived, etc.) and role.
- **Export** — engagement metric set + collection methods + current values export to Excel for sharing with non-tool users (DoIT, RTE, etc.).

## Impact

- **Affected specs:** `metrics-framework` (new capability)
- **Affected code:**
  - `packages/ai-tools/src/app/metrics/` — new module: library, engagement selection, collection methods, trends
  - `packages/platform-core/src/types/ai-tools.ts` — extend with metric library + collection-method + tracking types
  - `packages/platform-core/src/queries/admin/metrics-library.ts` — new query module
  - `packages/platform-core/src/queries/admin/metrics-collection.ts` — new query module
  - `packages/platform-core/src/queries/admin/metrics-trends.ts` — new query module
  - `migrations/` — new tables for metric library, engagement metric selections, collection methods, collection records
  - `packages/ai-tools/src/app/api/metrics/` — new API routes

## Database Tables (new)

- `metric_library` — master metric inventory (id, site_id nullable for canonical, category, role, name, what_it_measures, data_source, collection_difficulty, ai_win_likelihood, velocity_impact, quality_impact, version, status, parent_metric_id, is_canonical, created_by, created_at, updated_at)
- `metric_collection_methods` — per-library-metric collection details (id, metric_id, method_steps, auto_manual, owner_role, cadence, prerequisites text[], estimated_effort, sample_query)
- `engagement_metrics` — selected metrics per engagement (id, engagement_id, metric_id, metric_version, custom_role_label nullable, is_custom boolean, custom_definition jsonb, status enum proposed/locked/dropped, locked_at, notes)
- `engagement_metric_feasibility` — per-engagement collection feasibility (id, engagement_metric_id, feasibility enum confirmed/pending/blocked, blocker_notes, last_updated_by, last_updated_at)
- `metric_collection_records` — collected values (id, engagement_metric_id, period_type enum sprint/pi/month, period_label, value numeric, baseline_value numeric, notes, collected_by, collected_at)
- `metric_survey_links` — links survey questions to metric library entries (id, metric_id, question_id, computation enum likert_avg / likert_delta / count / percentage)

## Decisions Made

1. **Multi-tenant from day one** — `site_id` nullable on `metric_library` (null = canonical, populated = tenant-specific). Tenant clones inherit version pointer.
2. **Versioning over branching** — same pattern as readiness `question_bank` — new versions, old versions preserved, active version is the default.
3. **Collection feasibility lives at engagement level, not library level** — same metric may be Confirmed at one engagement (e.g., DCFS where Rovo is enabled) and Blocked at another. Library captures the "how"; engagement captures the "actually working here?".
4. **Trailing indicators flagged** — `metric_library.metadata` jsonb captures `trailing_periods` int when applicable so trend view shows "needs N periods" placeholder.
5. **Reuse readiness questionnaire infrastructure for survey rounds** — don't build a parallel survey system; extend existing tables with `survey_round` and `engagement_id`.
6. **Excel export, not import** — output an Excel for DoIT / RTE conversations, but the source of truth is the tool. (DCFS's Excel + Markdown files become the seed data for the canonical library, then retire as live artifacts.)
7. **Roles are open-ended; library grows with roles** — `metric_library.role` is a free-text field, not a fixed enum. When a new role is introduced into an engagement (beyond the DCFS pilot's 7 — BA, Dev, QA, Architect, Scrum Master, RTE, Product Owner), the library MUST accommodate adding new role-specific metrics without a schema change. The seed data covers the pilot's role inventory, but the library is expected to expand as engagements introduce additional roles (e.g., Tech Lead, UX Designer, SRE, Data Engineer).

## Migration of DCFS Pilot Artifacts

The DCFS pilot's Excel + Markdown files become the seed data for the canonical metric library (v1). Specifically:

- `pilot-metrics-proposal-to-doit-v20260430.xlsx` (52 metrics) → seeds `metric_library` (canonical, site_id null)
- `pilot-metrics-collection-methods-v20260430.xlsx` (collection details) → seeds `metric_collection_methods`
- DCFS engagement creates a clone of the canonical library, locks its 8–12 selected metrics, and records feasibility per metric in `engagement_metric_feasibility`
- Markdown thinking docs (`pilot-metrics-by-role-v20260427.md`, etc.) stay as the historical record but are no longer the source of truth once the tool is live
