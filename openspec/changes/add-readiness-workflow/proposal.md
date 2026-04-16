# Change: Add full Readiness Assessment workflow

## Why
The current `/readiness` page is a static reference guide. To deliver real value, the tool needs to collect company context, team details, AI policies, and regulatory environment — then generate a custom questionnaire, distribute it to team members via email, collect responses, and produce a readiness report. This transforms the readiness module from a reference page into the primary intake workflow for new engagements.

## What Changes

### Phase 1: Company & Team Intake
- **Company profile form** — name, industry, entity type (private, public university, state agency, federal agency, regulated entity), state/jurisdiction, size, sector-specific constraints
- **Regulatory context auto-detection** — based on entity type and state, surface applicable AI regulations (existing StateLawSelector data) and flag compliance requirements
- **AI policy intake** — capture whether the company has an existing AI policy, upload the policy document if it exists, and note which areas it covers (data privacy, IP, approved tools, prohibited uses, data handling)
- **General AI policy awareness** — flag sector-specific AI regulations automatically (e.g., state government executive orders, FERPA for universities, HIPAA for healthcare)

### Phase 2: Team Profile
- **Team information form** — team name, function (development, QA, DevOps, data, mixed), methodology (Scrum, Kanban, SAFe, Waterfall), team size
- **Team objectives** — what the team is trying to achieve, current pain points, what they hope AI will help with
- **Role directory** — add team members with name, email, role (from expanded SDLC taxonomy), seniority level
- **Expanded SDLC role taxonomy** — extends current 6 roles to 24+: developer, qa, scrum_master, product_owner, devops, designer, **business_analyst**, **tech_lead**, **architect**, **integration_tester**, **performance_tester**, **release_manager**, **data_analyst**, **data_engineer**, **security_engineer**, **ux_researcher**, **technical_writer**, **program_manager**, **project_manager**, **engineering_manager**, **database_admin**, **system_admin**, **support_engineer**, **other** (with custom label)
- **Role-based question mapping** — different roles get different questionnaire sections (a developer gets coding tool questions; a BA gets requirements/process questions; a scrum master gets facilitation/analytics questions; an integration tester gets test automation questions; a manager gets governance questions)

### Phase 3: Custom Questionnaire Generation
- **Versioned question bank** — every question has a version number, status (draft/active/deprecated), and full edit history. Revisions create new versions; originals are preserved so historical reports always show the exact wording respondents answered
- **Context-aware selection** — questions selected based on: entity type, industry regulations, team function, role, existing AI policy status
- **Question categories**: 7 DORA capabilities + 4 AI policy areas + role-specific AI tool experience + team workflow maturity
- **Unmapped role flagging** — when a custom role ("other") has no role-specific questions, the system flags it as "needs questionnaire development" and creates a development request. Only universal questions are assigned until role-specific ones are developed and published
- **Questionnaire preview** — admin can review and optionally customize the generated questionnaire before sending
- **Respondent feedback loop** — respondents can flag questions as "unclear" or "not applicable" during the survey. Questions with high flag rates are auto-flagged for admin review
- **Question bank admin UI** — manage questions, view version history, review feedback stats, resolve development requests for unmapped roles

### Phase 4: Distribution & Collection
- **Email distribution** — send personalized questionnaire links to each team member
- **Unique response links** — each member gets a tokenized link (no login required for respondents)
- **Response tracking dashboard** — see who has responded, send reminders to non-respondents
- **Response deadline** — configurable deadline with automated reminder capability

### Phase 5: Report Generation
- **Aggregate scoring** — compute per-capability scores from individual responses, weighted by role relevance
- **Readiness tier assignment** — Not Ready / Foundation Needed / Ready / Well Positioned
- **Blocker identification** — flag capabilities scoring below 3.0 with specific recommendations
- **Regulatory gap analysis** — compare AI policy coverage against applicable regulations
- **Role-based insights** — how different roles perceive readiness (developers vs managers vs POs)
- **Executive summary** — one-page printable/exportable summary
- **Detailed report** — full breakdown with individual scores, comments, and recommendations

## Impact
- Affected specs: `readiness-assessment` (new capability)
- Affected code:
  - `packages/ai-tools/src/app/readiness/` — transforms from static page to multi-step workflow
  - `packages/platform-core/src/types/` — new types for company profiles, questionnaires, responses
  - `packages/platform-core/src/queries/` — new query modules for readiness data
  - `migrations/` — new tables for companies, teams, questionnaires, responses
  - `packages/ai-tools/src/app/api/` — new API routes for questionnaire CRUD, email distribution, response collection
  - `packages/ai-tools/src/components/` — new form components for each phase

## Database Tables (New)
- `readiness_assessments` — top-level assessment record (linked to engagement or standalone), `prior_assessment_id` for re-assessments
- `assessment_companies` — company profile data per assessment
- `assessment_teams` — team details per assessment
- `assessment_members` — team member directory per assessment (role from expanded taxonomy, custom_role_label for "other")
- `question_bank` — master question bank with tags (entity_type[], role[], category, capability), `version` integer, `status` (draft/active/deprecated), `parent_question_id` (links versions), `created_by`, `created_at`
- `question_development_requests` — tracks unmapped roles needing questions (custom_role_label, status: pending/in_progress/completed, requested_from_assessment_id)
- `assessment_questionnaires` — generated questionnaire instance per assessment
- `questionnaire_questions` — questions selected for a specific questionnaire (with ordering, `question_version` to pin exact version used)
- `questionnaire_responses` — individual member responses (linked by token, no auth required)
- `response_answers` — individual answers per question per response, `score` integer 1-5, `comment` text, `flag` enum (null/unclear/not_applicable)
- `question_feedback_stats` — materialized/cached aggregate feedback per question (times_asked, avg_score, unclear_count, not_applicable_count, needs_review boolean)

## Decisions Made
1. **Tokenized links** for respondents (no login required) — sufficient for now
2. **Resend** for transactional email (invitations, reminders)
3. **Browser print-to-PDF** — server-rendered HTML with print CSS, no server-side PDF generation
4. **Re-assessment supported** — run the same questionnaire again to track readiness improvement over time
