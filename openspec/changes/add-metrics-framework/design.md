# Design: Metrics Framework

## Context

The DCFS pilot built a 52-metric inventory + collection-methods catalog using Excel + markdown. The AI Transformation Tool already has type-level scaffolding (`MetricCategory`) but no actual metric inventory or tracking. This change productizes the pilot work into a multi-tenant capability.

## Architectural Decisions

### Decision 1: Library + Engagement separation (canonical vs. cloned)

Two distinct tables:
- **`metric_library`** — master inventory. `site_id` nullable: null = canonical (Krasan-curated), populated = tenant-specific.
- **`engagement_metrics`** — per-engagement selection. References `metric_library.id` + `metric_version`.

**Why two layers:** the library is reusable IP. Each engagement's selection is the actual measurement plan. Without separation, every engagement would either fork the library (drift) or be limited to one master list (rigid).

**Why version pinning at engagement level:** a library metric may be revised mid-pilot (e.g., DORA publishes 2026 changes). Engagements need to keep measuring the version they started with until they explicitly upgrade.

### Decision 2: Feasibility lives at engagement, not library

Same metric may be **Confirmed** at one engagement (e.g., DCFS where Rovo Enterprise is enabled) and **Blocked** at another (e.g., a tenant without Zephyr Scale). Putting feasibility on the library would force one truth across all tenants — wrong.

Feasibility is therefore on `engagement_metric_feasibility`, with notes explaining the local situation (e.g., "blocked pending JIRA admin token from Matt, expected by sprint 1 kickoff").

### Decision 3: Reuse readiness questionnaire infrastructure for survey rounds

The existing `add-readiness-workflow` change already shipped `assessment_questionnaires`, `questionnaire_responses`, `response_answers`. Survey-derived metrics (skill delta, productivity perception, quality perception, adoption barrier index) are computed from the same response data — just with `survey_round` (baseline / mid / post / pulse) as a new column.

**Why not build a parallel survey system:** duplicate infrastructure for the same data shape. The readiness module already handles tokenized response links, distribution, reminders, response collection.

### Decision 4: Trailing-indicator flag in metric metadata

Metrics like "Released-story bug return rate" need 2–3 sprints of data before first read. Add `trailing_periods` to `metric_library.metadata` jsonb. The trend view checks `period_count < trailing_periods` and displays "Needs N more periods" instead of plotting noise.

### Decision 5: Auto-aggregate prerequisites

`metric_collection_methods.prerequisites` is `text[]` (e.g., `['JIRA REST API token', 'Zephyr Scale API token']`). The engagement view aggregates across all selected metrics — same prerequisite appearing across 12 metrics shows as one item with "12 metrics blocked" badge. Resolves the "death by a thousand small asks" problem when talking to a JIRA admin.

### Decision 6: Excel export-only, no import

Excel is the conversation surface for non-tool users (DoIT, RTE, role leads). But the tool is source-of-truth. Importing Excel back risks bidirectional drift. Edit in the tool; export Excel snapshots when sharing.

### Decision 7: Roles are open-ended (free-text, not enum)

`metric_library.role` is a free-text column, not a constrained enum. The DCFS pilot covers 7 roles (BA, Dev, QA, Architect, Scrum Master, RTE, Product Owner), but every future engagement may introduce roles outside that set — Tech Lead, UX Designer, SRE, Data Engineer, Platform Engineer, ML Engineer, etc. Locking the schema to a fixed enum would force a migration each time a new role appears.

**Implication:** when an engagement adds a new role to scope, the workflow is (1) add role-appropriate metrics to the library (canonical or tenant clone), (2) select them into the engagement. Both steps happen in-tool without a schema change. The library is expected to grow over time as the tenant base broadens.

**UI affordance:** the metric-library list view exposes a "Role" filter populated from the distinct set of roles currently in the library — so newly-added roles surface automatically without code changes.

## Out of Scope

- **Predictive analytics on metric trends** — that's a future change.
- **Automatic data extraction from JIRA / GitHub / Zephyr** — collection method captures the *how*, but actual data ingestion is out of scope here. Collected values are entered manually or via per-tenant scripts that hit the API.
- **Custom metric formulas** — all metrics are individual values for now; composite metrics (like DORA's AI tool ROI composite = usage × acceptance × time saved) are stored as a single value with computation done externally for now.
- **Cross-engagement benchmarking** — comparing metric values across engagements requires anonymization rules we haven't defined.

## Sequencing & Dependencies

- **Phase 1 (Library + Collection Methods)** must land first — everything else depends on the library.
- **Phase 2 (Engagement Selection)** depends on Phase 1 + existing engagement infrastructure (already shipped).
- **Phase 3 (Feasibility tracking)** depends on Phase 2.
- **Phase 4 (Survey Integration)** depends on Phase 1 + the existing `add-readiness-workflow` (already shipped).
- **Phase 5 (Tracking & Trends)** depends on Phase 2.

Phases 1–3 can ship as the MVP — that's enough to drive the DCFS Apr 30 metrics-and-feasibility conversations through the tool.
