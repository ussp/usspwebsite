## 1. Database Schema (Extend Existing)
- [ ] 1.1 Add `vendor` column to `assessment_members` table (enum: krasan, csg, isi, state, other)
- [ ] 1.2 Add `in_pilot` boolean column to `assessment_members` table
- [ ] 1.3 Add `ai_tool` column to `assessment_members` table (copilot, rovo, d365_copilot, power_automate, other)
- [ ] 1.4 Add `stair_step` column to `assessment_ai_opportunities` table (integer 1-5)
- [ ] 1.5 Add `team_training_status` table (member_id, track_name, status, scheduled_date, completed_date, site_id)
- [ ] 1.6 Create Alembic migration (extend existing tables + new training table)
- [ ] 1.7 Update SQLAlchemy models in migrations/models.py

## 2. Platform Core (Extend Existing Queries)
- [ ] 2.1 Update TeamMember type in `types/ai-tools.ts` — add vendor, in_pilot, ai_tool fields
- [ ] 2.2 Update `readiness-team.ts` queries — include new fields in CRUD operations
- [ ] 2.3 Add TrainingStatus type and queries in new `readiness-training.ts`
- [ ] 2.4 Add query: getTeamPilotReadiness — check training complete + readiness above threshold + baseline captured
- [ ] 2.5 Add query: generateTrainingPlan — auto-assign tracks based on member roles (Foundation for all pilot members, role-specific by role)
- [ ] 2.6 Add query: getEngagementTeamSummary — all teams with readiness tier, training %, pilot status
- [ ] 2.7 Export new types and queries from platform-core index.ts
- [ ] 2.8 Follow existing query patterns in `queries/admin/readiness-*.ts`

## 3. API Routes (Extend Existing)
- [ ] 3.1 PATCH /api/readiness/[id]/team/members/[memberId] — update vendor, in_pilot, ai_tool
- [ ] 3.2 GET/POST/PATCH /api/readiness/[id]/team/training-status — training completion CRUD
- [ ] 3.3 POST /api/readiness/[id]/team/generate-training-plan — auto-generate from composition
- [ ] 3.4 GET /api/readiness/[id]/team/pilot-readiness — check pilot readiness gate
- [ ] 3.5 GET /api/readiness/[id]/summary — engagement-level team summary dashboard
- [ ] 3.6 Add audit logging for all mutations

## 4. UI — Extend Team Page
- [ ] 4.1 Add vendor dropdown to team member form (Krasan, CSG, ISI, State, Other)
- [ ] 4.2 Add "In Pilot" toggle to team member form
- [ ] 4.3 Add AI tool selector to team member form (context-aware based on role)
- [ ] 4.4 Add stair-step selector to SDLC/AI opportunities view (dropdown 1-5 per process)
- [ ] 4.5 Add training status tab to team page — matrix (rows=members, columns=tracks, cells=status badge)
- [ ] 4.6 Add "Generate Training Plan" button — auto-populates training assignments
- [ ] 4.7 Add pilot readiness indicator — green/yellow/red badge showing if team can enter pilot
- [ ] 4.8 Add engagement dashboard summary card — team count, avg readiness, training %, pilot-ready count

## 5. Assessment Integration
- [ ] 5.1 Use vendor field to filter pilot participants — highlight Krasan-only view
- [ ] 5.2 Use in_pilot flag to determine which members receive training assignments
- [ ] 5.3 Connect training completion to pilot readiness gate — all pilot members must complete assigned tracks
- [ ] 5.4 Use stair_step to track which code generation level each process is approved for
- [ ] 5.5 Feed augmentation map + stair_step into reporting — show which processes improved at which step
- [ ] 5.6 Auto-populate AI tool assignment based on role (BA-Tech→Rovo, Dev→Copilot, Config→D365, Tester→Copilot+Rovo)

## 6. Tooltips
- [ ] 6.1 "Vendor" — "The organization employing this team member. Pilot starts with Krasan roles only — other vendors join after initial issues are resolved"
- [ ] 6.2 "In Pilot" — "Include this member in the AI pilot. They will receive training and use AI tools during pilot sprints"
- [ ] 6.3 "AI Tool" — "The primary AI tool assigned based on role: GitHub Copilot (developers), Rovo (BAs/testers/SMs), D365 Copilot (configuration), Power Automate (workflows)"
- [ ] 6.4 "Stair Step" — "Adoption level: 1=stories/docs, 2=comprehension, 3=test scripts, 4=config generation, 5=code generation. Each step requires governance approval"
- [ ] 6.5 "Training Status" — "Pending=not scheduled, Scheduled=date set, Completed=attended and demonstrated competency"
- [ ] 6.6 "Pilot Readiness" — "Green=all training complete, readiness above threshold, baseline captured. Yellow=partially ready. Red=blockers exist"
- [ ] 6.7 "Generate Training Plan" — "Auto-assigns training tracks based on member roles. Foundation for all, role-specific by role"
- [ ] 6.8 Use existing InfoTip component at `packages/ai-tools/src/components/InfoTip.tsx`

## 7. Unit Testing
- [ ] 7.1 Query tests: update member with vendor, in_pilot, ai_tool — verify fields persisted
- [ ] 7.2 Query tests: training status CRUD — create, update, list by member, list by team
- [ ] 7.3 Query tests: generateTrainingPlan — correct tracks assigned per role, Foundation for all pilot members
- [ ] 7.4 Query tests: getTeamPilotReadiness — passes when all criteria met, fails with clear reason when not
- [ ] 7.5 Query tests: getEngagementTeamSummary — aggregates correctly across teams
- [ ] 7.6 Query tests: site_id isolation — verify multi-tenant filtering
- [ ] 7.7 API tests: PATCH member — 200 with valid data, 400 with invalid vendor
- [ ] 7.8 API tests: training status — CRUD operations, audit logging
- [ ] 7.9 API tests: generate training plan — correct assignments, idempotent
- [ ] 7.10 API tests: pilot readiness — correct gate logic
- [ ] 7.11 API tests: RBAC — admin can edit, viewer can read
- [ ] 7.12 Integration test: add members → set vendor/pilot → generate plan → complete training → check readiness gate
- [ ] 7.13 Follow existing test patterns in `packages/platform-core/src/__tests__/readiness-*.test.ts` (Vitest v2)

## 8. Documentation — User Guide
- [ ] 8.1 Update `docs/ai-tools/03-user-guide-engagements.md` — team profiling section
- [ ] 8.2 Update `docs/ai-tools/04-user-guide-assessments.md` — vendor/pilot fields, training integration
- [ ] 8.3 Update `docs/ai-tools/05-user-guide-training-plans.md` — auto-generation from team composition
- [ ] 8.4 Update `docs/ai-tools/06-user-guide-reports.md` — stair-step data in reports
- [ ] 8.5 Add screenshots of updated team page

## 9. Documentation — Admin Guide
- [ ] 9.1 Update `docs/ai-tools/11-developer-guide.md` — new fields, extended queries
- [ ] 9.2 Update `docs/ai-tools/12-api-reference.md` — extended endpoints, new fields
- [ ] 9.3 Update memory/database.md — schema changes

## 10. Documentation — Framework Guide
- [ ] 10.1 Update `clients/dcfs-ilc/planning/guide/12-tools-platform.md` — team profiling with vendor/pilot
- [ ] 10.2 Update `clients/dcfs-ilc/planning/guide/13-deployment.md` — team setup includes vendor/pilot step
- [ ] 10.3 Update `docs/ai-transformation-framework/12-tools-platform.md` — generic version
- [ ] 10.4 Update `docs/ai-transformation-framework/13-deployment.md` — generic version
- [ ] 10.5 Update `clients/dcfs-ilc/planning/team-profile-template.md` — note fields now in platform

## 11. Best Practices
- [ ] 11.1 Multi-tenant: all new columns/tables include site_id
- [ ] 11.2 Audit logging: all mutations logged
- [ ] 11.3 RBAC: follow existing rbac.ts patterns
- [ ] 11.4 TypeScript: strict types, no `any`
- [ ] 11.5 Testing: minimum 80% coverage, all API routes tested
- [ ] 11.6 Accessibility: labels, aria attributes on new form fields
- [ ] 11.7 Performance: no N+1 queries on team summary
- [ ] 11.8 Validation: required fields enforced at API level
