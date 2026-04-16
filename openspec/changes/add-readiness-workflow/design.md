## Context

The AI Tools platform (`packages/ai-tools/`) currently has a static readiness guide page. This change converts it into a full multi-step workflow: company intake → team setup → questionnaire generation → email distribution → response collection → report generation.

The platform already has patterns for:
- Multi-step engagement workflows (engagements → teams → assessments → metrics)
- Form data collection (MetricsEntryForm, survey LikertScale)
- API routes with RBAC
- Supabase queries via platform-core
- Multi-tenant data isolation via `site_id`

### Stakeholders
- USSP consultants running readiness assessments for clients
- Client team members receiving questionnaires (external, no login)
- Engagement managers reviewing reports

## Goals / Non-Goals

**Goals:**
- Structured intake of company context, regulatory environment, and AI policy status
- Role-aware team directory with automatic question mapping
- Generated questionnaires customized to company type + team function + member role
- Frictionless response collection (tokenized links, no login for respondents)
- Actionable readiness report with tier, blockers, and recommendations

**Non-Goals:**
- Real-time collaboration / live editing of questionnaires by multiple admins
- AI-generated questions (use curated question bank)
- Integration with external HR systems for team member import
- Automated follow-up scheduling beyond basic reminders

## Decisions

### 1. Questionnaire Architecture: Versioned Question Bank + Selection Engine
- **Decision**: Maintain a curated, versioned question bank in the database. Each question is tagged by `entity_type[]`, `role[]`, `category`, and `capability`. Questions have version numbers — edits create new versions, originals are preserved. A selection function picks active questions matching the company and team profile.
- **Why**: More maintainable than hardcoded questions. Allows adding questions without code changes. Versioning ensures historical assessments always show the exact wording respondents saw. Simpler than AI generation while being more flexible than static forms.
- **Alternative considered**: Hardcoded question arrays (like current CAPABILITIES array) — rejected because it can't adapt to company context or evolve over time.

### 1b. Unmapped Role Handling
- **Decision**: When a team member has role "other" with a custom label that has no matching questions in the bank, the system assigns only universal questions (7 DORA + 4 policy) and creates a "question development request." Admins see these requests in the question bank UI and can develop role-specific questions that are automatically picked up by future assessments.
- **Why**: The role taxonomy will never be complete. Rather than silently giving someone a generic questionnaire, we explicitly flag the gap so the question bank evolves with real usage. Once questions are developed for a custom role, they're available forever.

### 1c. Question Feedback Loop
- **Decision**: Respondents can flag individual questions as "unclear" or "not applicable to my role." These flags are aggregated per question. Questions exceeding 25% flag rate (on 10+ responses) are auto-flagged for admin review.
- **Why**: Question quality degrades without feedback. Customer-facing respondents are the best signal for whether a question is confusing or irrelevant. The threshold prevents noise from small sample sizes while surfacing real problems.

### 2. Response Collection: Tokenized Links (No Auth)
- **Decision**: Each team member gets a unique URL with a secure token. No login required to respond.
- **Why**: Minimizes friction for respondents who are external client staff. They shouldn't need accounts on our platform.
- **Token design**: UUID v4, stored in `questionnaire_responses.token`, expires with the assessment deadline.

### 3. Email: Resend SDK
- **Decision**: Use Resend for transactional email (questionnaire invites, reminders).
- **Why**: Simple API, good deliverability, React Email support for templating, generous free tier. Already used in similar USSP projects.
- **Alternative considered**: SendGrid — more complex setup, overkill for this volume.

### 4. Report: Server-rendered HTML with Print CSS
- **Decision**: Generate reports as styled HTML pages with `@media print` CSS. No server-side PDF generation.
- **Why**: Simpler implementation, works in all browsers, users can print to PDF natively. Avoids heavyweight PDF libraries.

### 5. Multi-Step UI: Stepper Pattern
- **Decision**: Use a step indicator (similar to existing `StepIndicator` component) with URL-based routing for each phase.
- **Why**: Each step is a meaningful save point. Users can leave and return. Matches existing engagement workflow patterns.
- **Route structure**:
  - `/readiness/new` — start new assessment
  - `/readiness/[id]/company` — company profile
  - `/readiness/[id]/team` — team details + members
  - `/readiness/[id]/policy` — AI policy intake
  - `/readiness/[id]/questionnaire` — review generated questionnaire
  - `/readiness/[id]/distribute` — send emails, track responses
  - `/readiness/[id]/report` — view readiness report
  - `/readiness/[id]/respond/[token]` — public respondent page (no auth)

### 6. Database: Extend Existing Pattern
- **Decision**: New tables follow existing `site_id` multi-tenant pattern. Assessment links to optional `engagement_id` for integration with transformation workflow.
- **Why**: Consistent with platform-core conventions. Allows standalone assessments or engagement-linked ones.

## Risks / Trade-offs

- **Email deliverability**: Questionnaire emails could land in spam. Mitigation: use Resend with proper DKIM/SPF, include clear sender identity.
- **Question bank maintenance**: Curated questions need periodic updates as AI landscape evolves. Mitigation: admin UI for question management in future phase.
- **Response rate**: External respondents may not complete questionnaires. Mitigation: reminder capability, response tracking dashboard, configurable deadlines.
- **Scope creep**: This is a large feature. Mitigation: implement phases sequentially, each phase is independently useful.

## Migration Plan

1. Add database tables via Alembic migration
2. Seed question bank with initial curated questions
3. Build API routes incrementally (company → team → questionnaire → distribute → report)
4. Build UI pages matching the step flow
5. Replace static `/readiness` page with assessment list + "New Assessment" CTA
6. Existing readiness guide content moves to a help/reference section within the workflow

## Open Questions

1. Should the question bank be seeded from a JSON file or managed via admin UI from the start?
2. What's the target number of questions per role? (Suggest: 15-25 to keep completion under 10 minutes)
3. Should we support anonymous responses (no name attached) for psychological safety?
