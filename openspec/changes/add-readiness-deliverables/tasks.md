## 0. AI Enhancement Catalog & Versioning Infrastructure
- [x] 0.1 Create `catalog_versions` table (id, version_number int, release_date, release_notes text, item_count int, created_by, created_at)
- [x] 0.2 Create `ai_enhancement_catalog` table (id, pillar, name, description, example_tools text, version int, status active/deprecated/new, parent_item_id FK self-ref, catalog_version_id FK, created_at)
- [x] 0.3 Create `assessment_enhancement_status` table (id, assessment_id FK, site_id, catalog_item_id FK, catalog_version int, status enum in_use/opportunity/blocked/not_applicable/not_evaluated, tool_used text, blocking_constraint_id FK nullable, notes text, created_at, updated_at)
- [x] 0.4 Create `assessment_version_stamps` table (id, assessment_id FK, site_id, source_type enum catalog/question_bank/sdlc_template/risk_template/constraint_template, source_version int, source_date timestamp, created_at)
- [x] 0.5 Add SQLAlchemy models for catalog tables
- [x] 0.6 TypeScript interfaces: CatalogVersion, AIEnhancementCatalogItem, AssessmentEnhancementStatus, AssessmentVersionStamp
- [x] 0.7 Seed catalog v1 with ~120 enhancements across 9 pillars (Development ~15, Testing ~14, Documentation ~10, PMO ~10, BA ~9, DevOps ~11, Data ~10, Security ~10, Design ~10)
- [x] 0.8 Platform-core queries: `queries/admin/enhancement-catalog.ts` — list by pillar, list by version, get item history, create new version
- [x] 0.9 Platform-core queries: `queries/admin/enhancement-status.ts` — set/get status per assessment per catalog item, compute coverage stats (evaluated/total, per-pillar breakdown)
- [x] 0.10 Platform-core queries: `queries/admin/version-stamps.ts` — record version stamps when assessment steps complete, retrieve stamps for report
- [x] 0.11 API routes: `GET /api/readiness/catalog` — list catalog items by pillar (filtered to in-scope), `GET /api/readiness/catalog/versions` — list catalog versions
- [x] 0.12 API routes: `GET/POST /api/readiness/[id]/enhancements` — get/set enhancement statuses for assessment
- [x] 0.13 API routes: `GET /api/readiness/[id]/version-stamps` — get version stamps
- [x] 0.14 Add package.json exports for new query modules

## 1. Database Schema
- [x] 1.1 Create Alembic migration (0026) for `assessment_scope` table (id, assessment_id, site_id, pillar enum, in_scope boolean, created_at)
- [x] 1.2 Create `assessment_constraints` table (id, assessment_id, site_id, description, category enum technology/ai_tools/process/data_privacy/policy_compliance/budget_resources, severity enum hard/soft, source text, notes text, sort_order, created_at)
- [x] 1.3 Create `assessment_approved_tools` table (id, assessment_id, site_id, tool_name, vendor, capabilities text, restrictions text, created_at)
- [x] 1.4 Create `assessment_workflow_phases` table (id, assessment_id, site_id, name, description, pillar text, roles_involved jsonb, current_tools jsonb, time_spent_hours numeric, pain_points text, sort_order, created_at, updated_at)
- [x] 1.5 Create `assessment_ai_opportunities` table (id, phase_id FK, assessment_id, site_id, description, approved_tool text, expected_improvement text, improvement_type enum time_savings/quality/automation/insight, improvement_pct numeric, constraint_compliant boolean default true, is_current_strength boolean default false, sort_order, created_at)
- [x] 1.6 Create `assessment_data_readiness` table (id, assessment_id, site_id, data_quality int, data_accessibility int, data_governance int, data_pipelines int, data_security int, evidence_notes jsonb, created_at, updated_at)
- [x] 1.7 Create `assessment_use_cases` table (id, assessment_id, site_id, title, description, pillar text, affected_roles jsonb, impact_score int 1-5, effort_score int 1-5, quadrant text, timeline_months int, required_tools text, prerequisites text, sort_order, created_at, updated_at)
- [x] 1.8 Create `assessment_risks` table (id, assessment_id, site_id, description, category enum technical/organizational/regulatory/ethical, likelihood int 1-5, impact_score int 1-5, risk_score int, mitigation text, owner text, is_preseeded boolean, sort_order, created_at, updated_at)
- [x] 1.9 Create `assessment_pilots` table (id, assessment_id, site_id, use_case_id FK nullable, title, scope_description, success_criteria text, timeline text, team_roles jsonb, tools_needed text, estimated_cost text, go_nogo_criteria text, sort_order, created_at, updated_at)
- [x] 1.10 Add SQLAlchemy models to models.py for all new tables

## 2. TypeScript Types & Constants
- [x] 2.1 Add `AssessmentPillar` type (9-value union) and `ASSESSMENT_PILLAR_LABELS` with descriptions, example phases, example use cases per pillar
- [x] 2.2 Add `PILLAR_PHASE_MAPPING` — which SDLC phases belong to which pillars
- [x] 2.3 Add interfaces: AssessmentScope, AssessmentConstraint, ApprovedTool, WorkflowPhase, AIOpportunity, DataReadinessScorecard, AssessmentUseCase, AssessmentRisk, AssessmentPilot
- [x] 2.4 Add input types: SetScopeInput, CreateConstraintInput, CreateApprovedToolInput, CreateWorkflowPhaseInput, CreateAIOpportunityInput, UpsertDataReadinessInput, CreateUseCaseInput, CreateRiskInput, CreatePilotInput
- [x] 2.5 Add constants: CONSTRAINT_CATEGORIES (6 with labels, descriptions, examples), CONSTRAINT_SEVERITIES, DEFAULT_WORKFLOW_PHASES per methodology per pillar, PHASE_AI_SUGGESTIONS per phase per tool, DATA_READINESS_DIMENSIONS, RISK_CATEGORIES, USE_CASE_QUADRANTS, INVESTMENT_TIERS, IMPROVEMENT_TYPES
- [x] 2.6 Add pre-seeded risk templates by entity type + pillar
- [x] 2.7 Add pre-seeded constraint templates by entity type
- [x] 2.8 Export all new types and constants from platform-core index.ts

## 3. Platform-Core Queries
- [x] 3.1 `queries/admin/readiness-scope.ts` — set/get scope pillars, helper to check if pillar in scope
- [x] 3.2 `queries/admin/readiness-constraints.ts` — CRUD for constraints and approved tools, filter helper (check if action violates hard constraint), pre-populate by entity type
- [x] 3.3 `queries/admin/readiness-sdlc.ts` — CRUD for workflow phases and AI opportunities; generate phases from methodology template filtered by scope; suggest augmentations per phase filtered by constraints + approved tools
- [x] 3.4 `queries/admin/readiness-data.ts` — upsert/get data readiness scorecard
- [x] 3.5 `queries/admin/readiness-use-cases.ts` — CRUD for use cases, compute quadrant, list by quadrant, group by investment tier, filter by pillar
- [x] 3.6 `queries/admin/readiness-risks.ts` — CRUD for risks, pre-seed by entity type + scope, sort by risk score
- [x] 3.7 `queries/admin/readiness-pilots.ts` — CRUD for pilots, link to use cases, blocker check
- [x] 3.8 Update `readiness-report.ts` — add scope summary, constraints, SDLC analysis, conditional data scorecard, use case roadmap, investment tiers, risk register, pilot recommendations

## 4. API Routes
- [x] 4.1 `GET/POST /api/readiness/[id]/scope` — get/set assessment scope (which pillars in scope)
- [x] 4.2 `GET/POST/DELETE /api/readiness/[id]/constraints` — constraints CRUD
- [x] 4.3 `GET/POST/DELETE /api/readiness/[id]/constraints/tools` — approved tools CRUD
- [x] 4.4 `POST /api/readiness/[id]/constraints/seed` — pre-populate constraints by entity type
- [x] 4.5 `GET/POST/PUT/DELETE /api/readiness/[id]/sdlc/phases` — SDLC phases CRUD
- [x] 4.6 `POST /api/readiness/[id]/sdlc/phases/template` — load from methodology + scope
- [x] 4.7 `GET/POST/PUT/DELETE /api/readiness/[id]/sdlc/opportunities` — AI opportunities CRUD
- [x] 4.8 `POST /api/readiness/[id]/sdlc/suggest` — auto-suggest augmentations filtered by constraints
- [x] 4.9 `GET/POST /api/readiness/[id]/data` — data readiness scorecard (only if Data pillar in scope)
- [x] 4.10 `GET/POST/PUT/DELETE /api/readiness/[id]/use-cases` — use case CRUD
- [x] 4.11 `GET/POST/PUT/DELETE /api/readiness/[id]/risks` — risk register CRUD
- [x] 4.12 `POST /api/readiness/[id]/risks/seed` — pre-populate risks by entity type + scope
- [x] 4.13 `GET/POST/PUT/DELETE /api/readiness/[id]/pilots` — pilot CRUD
- [x] 4.14 Add package.json exports for all new query modules

## 5. UI — Assessment Scope (`/readiness/[id]/scope`)
- [x] 5.1 Create step page with 9 pillar cards, each toggleable (in scope / out of scope)
- [x] 5.2 Each card shows: pillar name, description, example SDLC phases, example AI use cases
- [x] 5.3 "Select All" / "Clear All" buttons
- [x] 5.4 Summary bar: "X of 9 pillars selected"
- [x] 5.5 InfoTip per pillar explaining what it covers and when to include it
- [x] 5.6 Scope change warning: if scope changes after downstream steps are completed, warn that SDLC phases and questionnaire may need regeneration

## 6. UI — Organizational Constraints (`/readiness/[id]/constraints`)
- [x] 6.1 Create step page with 6 constraint category sections (collapsible)
- [x] 6.2 Each category: existing constraints list + "Add Constraint" form (description, severity hard/soft toggle, source, notes)
- [x] 6.3 AI Tools category: special approved tools sub-section (tool name, vendor, capabilities, restrictions)
- [x] 6.4 Constraint summary: "X hard constraints, Y soft constraints"
- [x] 6.5 "Pre-populate" button: loads common constraints for the entity type
- [x] 6.6 InfoTips per category with examples, plus hard vs. soft explanation
- [x] 6.7 Banner: "Fewer constraints = more AI opportunities. If policies change, re-assess to see expanded possibilities."

## 7. UI — AI-Augmented SDLC Analysis (`/readiness/[id]/sdlc`)
- [x] 7.1 "Load Template" button — select methodology (Scrum/SAFe/Kanban), generates only phases for in-scope pillars
- [x] 7.2 Phase list: each phase shows name, description, roles, current tools, time spent, pain points — editable
- [x] 7.3 Per-phase AI augmentation: suggested opportunities (auto-generated from approved tools + constraints), confirm/edit/remove/add
- [x] 7.4 Each opportunity: description, tool, expected improvement %, type, constraint-compliant flag
- [x] 7.5 Current strengths toggle: "team already does this" vs. "new opportunity"
- [x] 7.6 Side-by-side view: "Current SDLC" vs. "AI-Augmented SDLC" showing changes per phase
- [x] 7.7 Improvement summary: total projected improvement (conservative/optimistic)
- [x] 7.8 InfoTips: improvement estimation rubrics, constraint compliance

## 8. UI — Data Readiness Scorecard (`/readiness/[id]/data`)
- [x] 8.1 Only accessible if Data & Analytics pillar is in scope (redirect with message if not)
- [x] 8.2 5 dimension sliders/inputs (1-5) with evidence notes per dimension
- [x] 8.3 Rubric InfoTips per dimension (what 1 means, what 5 means)
- [x] 8.4 Overall data readiness score (average) with tier badge
- [x] 8.5 Visual: horizontal bars for 5 dimensions

## 9. UI — Use Case Prioritization (`/readiness/[id]/use-cases`)
- [x] 9.1 Use case entry form: title, description, pillar tag (from in-scope pillars), affected roles, impact (1-5), effort (1-5), timeline (months), tools, prerequisites
- [x] 9.2 Auto-compute quadrant label and color
- [x] 9.3 Effort/Impact 2x2 matrix visualization with plotted use cases
- [x] 9.4 Sortable use case list with edit/delete, filterable by pillar
- [x] 9.5 InfoTips for impact and effort scoring criteria

## 10. UI — Risk Register (`/readiness/[id]/risks`)
- [x] 10.1 "Pre-populate" button: seeds risks based on entity type + in-scope pillars
- [x] 10.2 Risk entry form: description, category, likelihood (1-5), impact (1-5), mitigation, owner
- [x] 10.3 Auto-compute risk score, sort descending, color-code (red >= 15, amber >= 8, green < 8)
- [x] 10.4 Edit and delete
- [x] 10.5 InfoTips for likelihood and impact rubrics

## 11. UI — Pilot/POC Recommendations (`/readiness/[id]/pilot`)
- [x] 11.1 Show Quick Win use cases as selectable cards
- [x] 11.2 Pilot form: scope, success criteria, timeline, team roles, tools, cost, go/no-go criteria
- [x] 11.3 Link to source use case (optional)
- [x] 11.4 Blocker warning if pilot depends on unresolved readiness blockers
- [x] 11.5 InfoTips for success criteria and go/no-go criteria

## 12. UI — AI Enhancement Evaluation (`/readiness/[id]/enhancements`)
- [x] 12.1 Create step page showing catalog items grouped by in-scope pillar
- [x] 12.2 Each item: name, description, status dropdown (in_use/opportunity/blocked/not_applicable/not_evaluated), tool_used field (if in_use), blocking constraint link (if blocked), notes
- [x] 12.3 Coverage progress bar per pillar: "12/15 evaluated" with color (green = 100%, yellow = incomplete)
- [x] 12.4 Overall coverage banner: "Evaluated 48 of 52 applicable enhancements (92%)" — warns on gaps
- [x] 12.5 Filter/sort: by pillar, by status, show only not-evaluated
- [x] 12.6 Summary cards: count by status (12 in use, 18 opportunities, 8 blocked, 14 N/A)
- [x] 12.7 InfoTips per status explaining what each means and when to use it

## 13. UI — Update ReadinessSteps & Navigation
- [x] 13.1 Update ReadinessSteps: company → team → policy → **scope** → **constraints** → **sdlc** → **enhancements** → **data** (conditional) → **use-cases** → questionnaire → distribute → **risks** → report → **pilot**
- [x] 12.2 Scope-aware step rendering: hide "Data" step if Data pillar not in scope
- [x] 12.3 Update step numbering, back/next buttons on all pages

## 13. UI — Report Enhancements
- [x] 13.1 Add Assessment Scope section: which pillars are in scope (always shown)
- [x] 13.2 Add Constraints summary: 6-category overview, hard/soft counts, approved tools list
- [x] 13.3 Add AI-Augmented SDLC: side-by-side per phase, improvement projections
- [x] 13.4 Add Data Readiness Scorecard: 5-dimension bars + overall score (conditional on scope)
- [x] 13.5 Add Use Case Roadmap: effort/impact matrix + prioritized list (conditional on data)
- [x] 13.6 Add Investment Tiers: grouped by timeline (conditional on data)
- [x] 13.7 Add Risk Register: sorted, color-coded table (conditional on data)
- [x] 13.8 Add Pilot Recommendations: pilot cards with details (conditional on data)
- [x] 14.9 Add AI Enhancement Coverage section: per-pillar evaluated/total, status breakdown (in_use/opportunity/blocked/N-A), coverage percentage, gaps flagged
- [x] 14.10 Add Report Metadata section (bottom): version stamps for catalog, question bank, SDLC template, risk template; assessment date, scope, constraint counts
- [x] 14.11 Print CSS for all new sections including version stamp footer on every printed page

## 15. Unit Tests
- [x] 15.1 Catalog v1 completeness: all 9 pillars have items, total ~120
- [x] 15.2 Catalog versioning: new version preserves old, links parent items
- [x] 15.3 Enhancement coverage computation: evaluated/total, per-pillar percentages
- [x] 15.4 Enhancement status filtering by scope (only in-scope pillars counted)
- [x] 15.5 Version stamp recording and retrieval
- [x] 15.6 Pillar-to-phase mapping completeness
- [x] 14.2 Scope filtering: phases generated only for in-scope pillars
- [x] 14.3 Constraint enforcement: hard constraints block suggestions, soft constraints warn
- [x] 14.4 AI augmentation suggestion filtering by constraints + approved tools
- [x] 14.5 Improvement projection aggregation
- [x] 14.6 Quadrant computation (impact/effort → 4 quadrants)
- [x] 14.7 Investment tier grouping from timeline
- [x] 14.8 Risk score computation and color coding
- [x] 14.9 Data readiness overall score
- [x] 14.10 Pre-seeded risk template coverage by entity type + pillar
- [x] 14.11 Pilot blocker check logic
- [x] 14.12 Conditional report section logic (omit empty/out-of-scope sections)

## 15. Documentation
- [x] 15.1 Update readiness-assessment-guide.md: add scope selection, constraints, SDLC analysis, and all new deliverables
- [x] 15.2 Update readiness-best-practices.md: add scope-aware InfoTip requirements, constraint category guidelines
- [x] 15.3 Add rubric descriptions: pillar selection guidance, constraint severity, improvement estimation, data readiness dimensions, impact/effort scoring, risk likelihood/impact
- [x] 15.4 Add SDLC template documentation per methodology per pillar
