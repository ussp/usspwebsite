## 1. Database Schema
- [x] 1.1 Create Alembic migration for `readiness_assessments` table (id, site_id, engagement_id nullable, status, created_by, deadline, created_at, updated_at)
- [x] 1.2 Create `assessment_companies` table (id, assessment_id, site_id, name, industry, entity_type, state, size, sector_constraints jsonb)
- [x] 1.3 Create `assessment_teams` table (id, assessment_id, site_id, name, function, methodology, size, objectives text, pain_points text, ai_hopes text)
- [x] 1.4 Create `assessment_members` table (id, team_id, site_id, name, email, role, seniority, created_at)
- [x] 1.5 Create `assessment_policies` table (id, assessment_id, site_id, has_policy boolean, policy_document_url, coverage jsonb, notes text)
- [x] 1.6 Create `question_bank` table (id, site_id nullable, category, capability, question_text, description, entity_types text[], roles text[], is_default boolean, sort_order, version integer default 1, status enum draft/active/deprecated, parent_question_id nullable FK self-ref, created_by, created_at, updated_at)
- [x] 1.7 Create `question_development_requests` table (id, site_id, custom_role_label, status enum pending/in_progress/completed, requested_from_assessment_id FK, resolved_by, resolved_at, created_at)
- [x] 1.8 Create `assessment_questionnaires` table (id, assessment_id, site_id, status, generated_at, customized boolean)
- [x] 1.9 Create `questionnaire_questions` table (id, questionnaire_id, question_id, question_version integer, sort_order, is_required)
- [x] 1.10 Create `questionnaire_responses` table (id, questionnaire_id, member_id, token uuid, status, started_at, completed_at)
- [x] 1.11 Create `response_answers` table (id, response_id, question_id, score integer, comment text, flag enum null/unclear/not_applicable, answered_at)
- [x] 1.12 Create `question_feedback_stats` table (id, question_id, times_asked integer, avg_score numeric, unclear_count integer, not_applicable_count integer, needs_review boolean, last_computed_at)
- [x] 1.13 Add TypeScript interfaces in platform-core for all new tables
- [x] 1.14 Seed question bank v1 with default questions (7 DORA capabilities + 4 policy areas + role-specific per SDLC role)

## 2. Expand TeamMemberRole Taxonomy
- [x] 2.1 Extend `TeamMemberRole` union in `platform-core/src/types/ai-tools.ts` to add: business_analyst, tech_lead, architect, integration_tester, performance_tester, release_manager, data_analyst, data_engineer, security_engineer, ux_researcher, technical_writer, program_manager, project_manager, engineering_manager, database_admin, system_admin, support_engineer, other
- [x] 2.2 Update `TEAM_MEMBER_ROLE_LABELS` with display labels for all new roles
- [x] 2.3 Add `ROLE_QUESTION_CATEGORIES` mapping — which question categories each role receives
- [x] 2.4 Extend `TRAINING_CATALOG` with modules for new roles (BA, integration_tester, tech_lead, architect, etc.)
- [x] 2.5 Add database migration to expand role enum/check constraint if applicable
- [x] 2.6 Update existing UI role dropdowns in engagement team forms to include new roles

## 3. Platform-Core Queries
- [x] 3.1 `queries/admin/readiness.ts` — CRUD for readiness_assessments (incl. prior_assessment_id for re-assessments)
- [x] 3.2 `queries/admin/readiness-company.ts` — CRUD for assessment_companies
- [x] 3.3 `queries/admin/readiness-team.ts` — CRUD for assessment_teams + assessment_members (incl. custom_role_label)
- [x] 3.4 `queries/admin/readiness-policy.ts` — CRUD for assessment_policies
- [x] 3.5 `queries/admin/question-bank.ts` — CRUD for questions with versioning (create new version on edit, deprecate old), filter by entity_type/role/category/status
- [x] 3.6 `queries/admin/question-development.ts` — CRUD for development requests, auto-create on unmapped role, resolve when questions published
- [x] 3.7 `queries/admin/question-feedback.ts` — aggregate response flags into feedback stats, compute needs_review threshold (>25% flag rate on 10+ responses)
- [x] 3.8 `queries/admin/readiness-questionnaire.ts` — generate questionnaire (select active questions by profile, pin question_version), CRUD for questionnaire_questions
- [x] 3.9 `queries/readiness-response.ts` — public (no admin) response submission with flag support, fetch by token, save partial
- [x] 3.10 `queries/admin/readiness-report.ts` — aggregate scores, compute tier, identify blockers, compare with prior assessment

## 4. API Routes
- [x] 4.1 `POST/GET /api/readiness` — create and list readiness assessments
- [x] 4.2 `GET/PUT /api/readiness/[id]` — get and update assessment
- [x] 4.3 `POST/GET/PUT /api/readiness/[id]/company` — company profile CRUD
- [x] 4.4 `POST/GET/PUT /api/readiness/[id]/team` — team details CRUD
- [x] 4.5 `POST/GET/DELETE /api/readiness/[id]/team/members` — member directory CRUD
- [x] 4.6 `POST/GET/PUT /api/readiness/[id]/policy` — AI policy intake CRUD
- [x] 4.7 `POST /api/readiness/[id]/questionnaire/generate` — generate custom questionnaire from profile
- [x] 4.8 `GET/PUT /api/readiness/[id]/questionnaire` — view and customize generated questionnaire
- [x] 4.9 `POST /api/readiness/[id]/distribute` — send questionnaire emails to all members
- [x] 4.10 `POST /api/readiness/[id]/remind` — send reminder emails to non-respondents
- [x] 4.11 `GET /api/readiness/[id]/responses` — response tracking (who responded, who hasn't)
- [x] 4.12 `GET/POST /api/readiness/respond/[token]` — public response page (no auth, token-based)
- [x] 4.13 `GET /api/readiness/[id]/report` — generate report data

## 5. Email Integration
- [x] 5.1 Install Resend SDK, add `RESEND_API_KEY` env var
- [x] 5.2 Create questionnaire invitation email template
- [x] 5.3 Create reminder email template
- [x] 5.4 Create completion confirmation email template (sent to respondent)
- [x] 5.5 Create assessment-complete notification email (sent to admin when all responses in)

## 6. UI — Assessment List & Creation
- [x] 6.1 Convert `/readiness` from static guide to assessment list page (table of assessments + "New Assessment" button)
- [x] 6.2 Create `/readiness/new` — start new assessment (name, optional engagement link, deadline)
- [x] 6.3 Add StepIndicator component showing workflow phases
- [x] 6.4 Support re-assessment: "Re-assess" button on completed assessments that creates a new assessment pre-populated with same company/team data

## 7. UI — Company Profile
- [x] 7.1 Create `/readiness/[id]/company` page with form: name, industry, entity type dropdown (private, public university, state agency, federal agency, municipality, regulated entity), state selector, size, notes
- [x] 7.2 Auto-surface applicable regulations based on entity type + state selection (reuse StateLawSelector data)
- [x] 7.3 Save/load company profile via API

## 8. UI — Team Setup
- [x] 8.1 Create `/readiness/[id]/team` page with team info form: name, function, methodology, size, objectives, pain points, AI hopes
- [x] 8.2 Create member directory section: add members (name, email, role dropdown with full SDLC taxonomy, seniority)
- [x] 8.3 Bulk member import (CSV upload or paste)
- [x] 8.4 Show role distribution summary (e.g., "3 developers, 2 BAs, 1 SM, 1 PO, 2 integration testers")

## 9. UI — AI Policy Intake
- [x] 9.1 Create `/readiness/[id]/policy` page: has_policy toggle, policy document upload, coverage checklist (data privacy, IP, approved tools, prohibited uses, data handling)
- [x] 9.2 Show regulatory gap analysis: compare policy coverage against applicable regulations from company profile
- [x] 9.3 Flag missing policy as blocker with recommendation

## 10. UI — Questionnaire Review
- [x] 10.1 Create `/readiness/[id]/questionnaire` page showing generated questions grouped by category
- [x] 10.2 Allow reordering, adding, removing questions before distribution
- [x] 10.3 Show which questions go to which roles (role badges per question)
- [x] 10.4 "Generate Questionnaire" button that calls the generation API

## 11. UI — Distribution & Tracking
- [x] 11.1 Create `/readiness/[id]/distribute` page with member list, email status, response status
- [x] 11.2 "Send All" button to distribute questionnaire
- [x] 11.3 "Send Reminder" button for non-respondents
- [x] 11.4 Real-time response tracking (completed/pending/not started per member)
- [x] 11.5 Progress bar showing overall completion percentage

## 12. UI — Public Response Page
- [x] 12.1 Create `/readiness/respond/[token]` public page (no auth required)
- [x] 12.2 Show questionnaire with Likert scale (1-5), optional comment, and "Flag as unclear" / "Not applicable to my role" buttons per question
- [x] 12.3 Progress indicator and save-as-you-go (partial responses, flags saved immediately)
- [x] 12.4 Thank-you confirmation screen on completion

## 13. UI — Report
- [x] 13.1 Create `/readiness/[id]/report` page with executive summary
- [x] 13.2 Per-capability score visualization (radar chart or bar chart)
- [x] 13.3 Readiness tier badge with explanation
- [x] 13.4 Blocker list with recommendations
- [x] 13.5 Regulatory gap analysis section
- [x] 13.6 Role-based perception comparison (how developers vs BAs vs testers vs managers scored capabilities)
- [x] 13.7 Print-friendly CSS for PDF export via browser print
- [x] 13.8 Re-assessment comparison: if prior assessment exists, show score delta per capability with trend arrows

## 14. UI — Question Bank Admin
- [x] 14.1 Create `/readiness/questions` admin page — list all questions with search, filter by category/role/status
- [x] 14.2 Question detail view: wording, tags, version history timeline, feedback stats (times asked, avg score, unclear %, N/A %)
- [x] 14.3 Edit question flow: creates new version, shows diff from prior version, sets old to deprecated
- [x] 14.4 Create new question form: text, description, category, capability, entity_types multi-select, roles multi-select
- [x] 14.5 Development requests dashboard: list pending/in-progress requests with unmapped role labels, link to create questions for that role
- [x] 14.6 "Needs Review" filter: show questions auto-flagged for high unclear/N/A rates with feedback details
- [x] 14.7 Bulk status management: deprecate/reactivate questions in batch

## 15. Integration
- [x] 14.1 Link readiness assessment to engagement (optional) — show readiness results in engagement detail
- [x] 14.2 Update AdminSidebar readiness link to go to assessment list
- [x] 14.3 Move existing readiness guide content to a help/reference panel within the workflow
