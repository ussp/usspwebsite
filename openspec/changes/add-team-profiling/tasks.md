## 1. Database Schema
- [ ] 1.1 Add team_members table (name, role, vendor, in_pilot, ai_tool, team_id, site_id)
- [ ] 1.2 Add team_workflow_states table (team_id, order, status_name, responsible_role, typical_duration_hours, site_id)
- [ ] 1.3 Add team_objectives table (team_id, pi_number, objective, priority, capacity_ai_pct, site_id)
- [ ] 1.4 Add team_tools table (team_id, category, tool_name, is_ai_tool, access_confirmed, site_id)
- [ ] 1.5 Add team_augmentation_map table (team_id, sdlc_process, role, current_state, augmented_state, ai_tool, stair_step, site_id)
- [ ] 1.6 Add team_training_status table (team_member_id, track_name, status, scheduled_date, completed_date, site_id)
- [ ] 1.7 Add team_readiness_scores table (team_id, skills_score, process_score, attitude_score, infrastructure_score, overall_score, readiness_tier, assessment_date, site_id)
- [ ] 1.8 Create Alembic migration with proper foreign keys and indexes
- [ ] 1.9 Add site_id column to all tables (multi-tenant isolation per project conventions)
- [ ] 1.10 Update SQLAlchemy models in migrations/models.py

## 2. Platform Core (Types & Queries)
- [ ] 2.1 Add TypeScript interfaces: TeamMember, TeamWorkflowState, TeamObjective, TeamTool, TeamAugmentationMap, TeamTrainingStatus, TeamReadinessScore, TeamProfile (composite)
- [ ] 2.2 Add query: createTeamProfile (creates team with all sub-records)
- [ ] 2.3 Add query: getTeamProfile (joins all related data into single response)
- [ ] 2.4 Add query: updateTeamProfile (partial updates)
- [ ] 2.5 Add queries: team members CRUD (add, list, update, remove)
- [ ] 2.6 Add queries: workflow states CRUD (add, reorder, update, remove)
- [ ] 2.7 Add queries: augmentation map CRUD (add, update, remove)
- [ ] 2.8 Add queries: training status CRUD (update status, bulk update)
- [ ] 2.9 Add queries: readiness scores (upsert from assessment, get by team)
- [ ] 2.10 Add query: getTeamBaselineMetrics (read from existing assessment module)
- [ ] 2.11 Add query: getCycleTimeByWorkflowStates (use team's defined states for computation)
- [ ] 2.12 Add query: generateTrainingPlan (auto-generate from composition — match roles to tracks)
- [ ] 2.13 Export all new types and queries from platform-core index.ts
- [ ] 2.14 Follow existing query patterns (see queries/admin/*.ts for conventions)

## 3. API Routes
- [ ] 3.1 GET/POST/PATCH /api/engagements/[id]/teams/[teamId]/profile — full profile CRUD
- [ ] 3.2 GET/POST/PATCH/DELETE /api/engagements/[id]/teams/[teamId]/members — team members
- [ ] 3.3 GET/POST/PATCH /api/engagements/[id]/teams/[teamId]/workflow — workflow states
- [ ] 3.4 GET/POST/PATCH /api/engagements/[id]/teams/[teamId]/augmentation-map — process map
- [ ] 3.5 GET/PATCH /api/engagements/[id]/teams/[teamId]/training-status — training completion
- [ ] 3.6 GET /api/engagements/[id]/teams/[teamId]/readiness — readiness scores (read from assessment)
- [ ] 3.7 GET /api/engagements/[id]/teams/[teamId]/baseline — baseline metrics (read from assessment)
- [ ] 3.8 POST /api/engagements/[id]/teams/[teamId]/generate-training-plan — auto-generate from composition
- [ ] 3.9 Add RBAC: admin and engagement_lead can edit; viewer can read
- [ ] 3.10 Add audit logging for all mutations (follow existing audit pattern)

## 4. UI — Team Profile Page
- [ ] 4.1 Team profile detail page layout — tabbed sections (Composition, Workflow, Objectives, Tools, Augmentation Map, Baseline, Readiness, Training)
- [ ] 4.2 Team composition section — table with add/edit/remove, role dropdown, vendor dropdown, pilot toggle, AI tool selector
- [ ] 4.3 SDLC workflow section — ordered list with drag-to-reorder, role assignment, duration input
- [ ] 4.4 Team objectives section — PI objectives list, capacity % slider (0-100)
- [ ] 4.5 Tools inventory section — categorized list (current tools + AI additions with access confirmed toggle)
- [ ] 4.6 AI augmentation map section — editable table (process → role → current state → augmented state → tool → stair step dropdown 1-5)
- [ ] 4.7 Baseline metrics display — read-only cards showing last 3 sprints + averages (from assessment module)
- [ ] 4.8 Readiness assessment display — radar chart or score cards showing 4 dimensions + overall tier
- [ ] 4.9 Training status display — per-member matrix (rows = members, columns = tracks, cells = status badge)
- [ ] 4.10 "Generate Training Plan" button — auto-populates training assignments based on composition roles
- [ ] 4.11 Team profile summary card on engagement dashboard — shows team name, member count, readiness tier, training completion %

## 5. Assessment Integration
- [ ] 5.1 Link readiness assessment (Ch 4 instrument) to team — when assessment is completed, scores populate team profile automatically
- [ ] 5.2 Link baseline assessment to team — when JIRA baseline is pulled, metrics appear in team profile
- [ ] 5.3 Use team composition to pre-populate assessment distribution list (which members get which surveys)
- [ ] 5.4 Use augmentation map to customize training plan — only assign tracks for processes the team is augmenting
- [ ] 5.5 Use workflow states in measurement module — cycle time computation uses team-specific states, not global defaults
- [ ] 5.6 Use readiness scores in pilot team selection — rank teams by overall readiness, flag teams below threshold
- [ ] 5.7 Feed augmentation map into reporting — show which specific processes improved per team in Pilot Results Report
- [ ] 5.8 Connect training completion to pilot readiness gate — team cannot enter pilot until all members complete assigned tracks

## 6. Tooltips
- [ ] 6.1 "Role" field — "Select the team member's role: BA-Technical writes use cases/requirements, Configuration manages D365 entities and workflows, Developer builds custom plugins, Tester validates functionality, Scrum Master leads sprint ceremonies"
- [ ] 6.2 "Vendor" field — "The organization employing this team member. Pilot starts with Krasan roles only — other vendors join after initial issues are resolved"
- [ ] 6.3 "In Pilot" toggle — "Include this member in the AI pilot. They will receive training and use AI tools during the pilot sprints"
- [ ] 6.4 "AI Tool" selector — "The primary AI tool assigned to this member based on their role"
- [ ] 6.5 "SDLC Workflow States" — "The sequence of JIRA statuses that work items follow on this team. Used to compute cycle time and identify bottlenecks"
- [ ] 6.6 "Capacity %" — "Percentage of sprint capacity allocated for AI adoption activities (training, prompt learning, process adjustment). Recommended: 15%"
- [ ] 6.7 "Stair Step" — "The adoption level for this process: Step 1 (stories/docs) → Step 2 (comprehension) → Step 3 (test scripts) → Step 4 (config generation) → Step 5 (code generation). Each step requires governance approval"
- [ ] 6.8 "Readiness Tier" — "Based on readiness assessment: High (4.0+) = strong pilot candidate, Medium-High (3.5-3.9) = good with targeted training, Medium (3.0-3.4) = additional preparation needed, Low (<3.0) = not recommended for initial pilot"
- [ ] 6.9 "Training Status" — "Pending = not yet scheduled, Scheduled = date set, Completed = attended and demonstrated competency"
- [ ] 6.10 "Generate Training Plan" — "Auto-assigns training tracks based on team member roles. Foundation track assigned to all pilot participants. Role-specific tracks assigned by role"
- [ ] 6.11 Use existing Tooltip component at `packages/backoffice/src/components/Tooltip.tsx` or create equivalent for ai-tools package

## 7. Unit Testing
- [ ] 7.1 Query tests: createTeamProfile — verify all sub-records created with correct foreign keys
- [ ] 7.2 Query tests: getTeamProfile — verify joins return complete profile
- [ ] 7.3 Query tests: updateTeamProfile — verify partial updates don't clobber other fields
- [ ] 7.4 Query tests: team members CRUD — add, update, remove, list by team
- [ ] 7.5 Query tests: workflow states — add, reorder (verify order column), remove
- [ ] 7.6 Query tests: augmentation map CRUD
- [ ] 7.7 Query tests: training status — update single, bulk update
- [ ] 7.8 Query tests: readiness scores upsert — insert new, update existing
- [ ] 7.9 Query tests: getCycleTimeByWorkflowStates — verify computation uses team-specific states
- [ ] 7.10 Query tests: generateTrainingPlan — verify correct tracks assigned per role
- [ ] 7.11 Query tests: site_id isolation — verify queries filter by site_id (multi-tenant)
- [ ] 7.12 API route tests: POST team profile — verify 201 created with audit log
- [ ] 7.13 API route tests: GET team profile — verify complete response structure
- [ ] 7.14 API route tests: PATCH team profile — verify partial update
- [ ] 7.15 API route tests: RBAC — verify admin can edit, viewer can only read
- [ ] 7.16 API route tests: 404 for non-existent team
- [ ] 7.17 API route tests: 400 for invalid data (missing required fields)
- [ ] 7.18 Integration test: create team → add profile → add members → generate training plan → verify assignments
- [ ] 7.19 Integration test: complete assessment → verify readiness scores appear on team profile
- [ ] 7.20 Integration test: complete training → verify pilot readiness gate passes
- [ ] 7.21 Follow existing test patterns — see `packages/platform-core/src/__tests__/` for conventions (Vitest v2)

## 8. Documentation — User Guide
- [ ] 8.1 Update `docs/ai-tools/03-user-guide-engagements.md` — add "Team Profile" section explaining how to create and manage team profiles
- [ ] 8.2 Update `docs/ai-tools/04-user-guide-assessments.md` — explain how assessment results link to team profiles
- [ ] 8.3 Update `docs/ai-tools/05-user-guide-training-plans.md` — explain auto-generation from team composition
- [ ] 8.4 Update `docs/ai-tools/06-user-guide-reports.md` — explain how augmentation map data appears in reports
- [ ] 8.5 Add screenshots/examples of the team profile page

## 9. Documentation — Admin Guide
- [ ] 9.1 Update `docs/ai-tools/11-developer-guide.md` — new API endpoints, data models, query patterns
- [ ] 9.2 Update `docs/ai-tools/12-api-reference.md` — full API spec for all new endpoints
- [ ] 9.3 Update `docs/ai-tools/14-tenant-onboarding.md` — team profiling as part of tenant setup
- [ ] 9.4 Document database schema changes in memory/database.md

## 10. Documentation — Framework Guide
- [ ] 10.1 Update `clients/dcfs-ilc/planning/guide/12-tools-platform.md` — add team profiling workflow
- [ ] 10.2 Update `clients/dcfs-ilc/planning/guide/13-deployment.md` — add team profile setup to deployment steps
- [ ] 10.3 Update `docs/ai-transformation-framework/12-tools-platform.md` — generic version
- [ ] 10.4 Update `docs/ai-transformation-framework/13-deployment.md` — generic version
- [ ] 10.5 Update team-profile-template.md — note that this is now captured in the platform

## 11. Best Practices
- [ ] 11.1 Multi-tenant: all tables include site_id, all queries filter by SITE_ID env var
- [ ] 11.2 Audit logging: all create/update/delete operations logged to audit table
- [ ] 11.3 RBAC: follow existing rbac.ts patterns for permission checks
- [ ] 11.4 TypeScript: strict types, no `any` in new code
- [ ] 11.5 API: use platform-core API handler patterns (error handling, validation)
- [ ] 11.6 UI: follow existing component patterns (cards, tables, badges from backoffice)
- [ ] 11.7 Testing: minimum 80% coverage on new queries, all API routes tested
- [ ] 11.8 Accessibility: all form fields have labels, tooltips use aria attributes
- [ ] 11.9 Performance: team profile query should be single round-trip (join, not N+1)
- [ ] 11.10 Validation: required fields enforced at API level, friendly error messages
