# Tasks: Add Metrics Framework

## 1. Database Schema
- [ ] 1.1 Create Alembic migration for `metric_library` (id, site_id nullable, category, role, name, what_it_measures, data_source, collection_difficulty, ai_win_likelihood, velocity_impact, quality_impact, version integer default 1, status enum draft/active/deprecated, parent_metric_id nullable FK self-ref, is_canonical boolean, metadata jsonb, created_by, created_at, updated_at)
- [ ] 1.2 Create `metric_collection_methods` table (id, metric_id FK, method_steps text, auto_manual enum automated/semi_auto/manual, owner_role text, cadence text, prerequisites text[], estimated_effort text, sample_query text)
- [ ] 1.3 Create `engagement_metrics` table (id, engagement_id FK, site_id, metric_id FK, metric_version integer, custom_role_label text nullable, is_custom boolean, custom_definition jsonb, status enum proposed/locked/dropped, locked_at, notes, created_at, updated_at)
- [ ] 1.4 Create `engagement_metric_feasibility` table (id, engagement_metric_id FK, feasibility enum confirmed/pending/blocked, blocker_notes text, last_updated_by, last_updated_at)
- [ ] 1.5 Create `metric_collection_records` table (id, engagement_metric_id FK, period_type enum sprint/pi/month, period_label text, value numeric, baseline_value numeric, notes, collected_by, collected_at)
- [ ] 1.6 Create `metric_survey_links` table (id, metric_id FK, question_id FK, computation enum likert_avg/likert_delta/count/percentage)
- [ ] 1.7 Add `survey_round` enum column to `assessment_questionnaires` (baseline / mid / post / pulse)
- [ ] 1.8 Add TypeScript interfaces in `platform-core/src/types/ai-tools.ts` for all new tables
- [ ] 1.9 Seed canonical `metric_library` from DCFS pilot 52-metric inventory (one-time migration script reading the Excel)
- [ ] 1.10 Seed `metric_collection_methods` from DCFS pilot collection-methods Excel

## 2. Platform-Core Queries
- [ ] 2.1 `queries/admin/metrics-library.ts` — CRUD for metric library (list with filters by category/role/site_id, create/update/clone, version on edit, deprecate old)
- [ ] 2.2 `queries/admin/metrics-collection.ts` — CRUD for collection methods linked to library entries
- [ ] 2.3 `queries/admin/engagement-metrics.ts` — per-engagement selection (add from library, add custom, lock, drop)
- [ ] 2.4 `queries/admin/metric-feasibility.ts` — feasibility tracking + aggregated prerequisites view
- [ ] 2.5 `queries/admin/metric-records.ts` — collection records CRUD + trend retrieval
- [ ] 2.6 `queries/admin/metric-survey-derived.ts` — compute survey-derived metrics from response_answers per round

## 3. API Routes
- [ ] 3.1 `GET /api/metrics/library` — list canonical + tenant-specific library entries (filterable)
- [ ] 3.2 `POST/PUT/DELETE /api/metrics/library/[id]` — CRUD for library entries (admin / superadmin only for canonical)
- [ ] 3.3 `POST /api/metrics/library/[id]/clone` — clone a canonical entry into the tenant's library
- [ ] 3.4 `GET/POST /api/engagements/[id]/metrics` — list and add metrics to an engagement
- [ ] 3.5 `PATCH /api/engagements/[id]/metrics/[metric-id]` — update status (lock/drop) or edit custom definition
- [ ] 3.6 `PUT /api/engagements/[id]/metrics/[metric-id]/feasibility` — set feasibility + notes
- [ ] 3.7 `POST/GET /api/engagements/[id]/metrics/[metric-id]/records` — record values per period
- [ ] 3.8 `GET /api/engagements/[id]/metrics/prerequisites` — aggregated prerequisites view
- [ ] 3.9 `GET /api/engagements/[id]/metrics/export` — Excel export of selected metrics + collection methods

## 4. UI — AI Tools (`packages/ai-tools/src/app/metrics/`)
- [ ] 4.1 `/metrics/library` — browse canonical + tenant-specific library; filter by category, role, difficulty, win likelihood
- [ ] 4.2 `/metrics/library/[id]` — metric detail page with collection methods view
- [ ] 4.3 `/metrics/library/new` — create custom metric (tenant-scoped)
- [ ] 4.4 `/engagements/[id]/metrics` — engagement metric selection page (add from library, lock, drop, add custom)
- [ ] 4.5 `/engagements/[id]/metrics/feasibility` — feasibility tracker with aggregated prerequisites and per-metric notes
- [ ] 4.6 `/engagements/[id]/metrics/[metric-id]/trend` — single-metric trend view with baseline + target overlays + trailing-indicator badge
- [ ] 4.7 `/engagements/[id]/metrics/dashboard` — multi-metric dashboard cross-tabbed by category and role
- [ ] 4.8 Excel export button on engagement metrics page (downloads .xlsx via export API)

## 5. Survey Integration
- [ ] 5.1 Extend `assessment_questionnaires` with `survey_round` so the same questionnaire can run pre/mid/post/pulse rounds
- [ ] 5.2 Add `metric_survey_links` admin UI under metric library — link a library metric to specific question(s) with computation type
- [ ] 5.3 Auto-compute survey-derived metric values when a survey round closes (insert into `metric_collection_records` for the engagement's selected survey-derived metrics)
- [ ] 5.4 Pulse survey distribution flow (lighter than 3-round survey — sprint cadence)

## 6. Seed Data Migration (DCFS pilot artifacts)
- [ ] 6.1 Write seed script that reads `pilot-metrics-proposal-to-doit-v20260430.xlsx` and inserts canonical `metric_library` rows
- [ ] 6.2 Write seed script that reads `pilot-metrics-collection-methods-v20260430.xlsx` and inserts `metric_collection_methods` rows linked to library entries
- [ ] 6.3 Create the DCFS engagement record (or fetch existing) and pre-populate `engagement_metrics` with all 52 metrics in `proposed` status
- [ ] 6.4 Backfill `engagement_metric_feasibility` from the collection-methods Excel feasibility column
- [ ] 6.5 Manual verification: open the tool against the seeded DCFS engagement and confirm all 52 metrics appear with correct categories, roles, and feasibility flags

## 7. Tests
- [ ] 7.1 Unit tests for library CRUD with versioning (create new version on edit, deprecate old)
- [ ] 7.2 Unit tests for engagement-metric selection (add from library, custom, lock, drop)
- [ ] 7.3 Unit tests for survey-derived metric computation (likert avg, delta across rounds)
- [ ] 7.4 Integration test: full flow from library browse → engagement add → feasibility set → record value → trend view
- [ ] 7.5 Integration test: Excel export round-trip vs. seeded library
- [ ] 7.6 Fixture-based regression: seeded DCFS library matches the 52 metrics from the source Excel

## 8. Documentation
- [ ] 8.1 Update `packages/ai-tools/README.md` (or equivalent) with the metrics module overview
- [ ] 8.2 Add a "Metrics Framework" section to user-facing docs explaining library / engagement selection / feasibility / trend
- [ ] 8.3 Document the canonical-vs-tenant library model and how to clone
- [ ] 8.4 Sunset the DCFS Excel + Markdown source-of-truth — add deprecation note pointing to the tool
- [ ] 8.5 Document the role-extension workflow — how to add metrics for a new role (Tech Lead, UX Designer, SRE, etc.) and when to promote tenant-specific role metrics into the canonical library
