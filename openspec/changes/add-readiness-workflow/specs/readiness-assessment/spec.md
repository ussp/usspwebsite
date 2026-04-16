## ADDED Requirements

### Requirement: Company Profile Intake
The system SHALL collect company information including name, industry, entity type (private company, public university, state agency, federal agency, municipality, regulated entity), state/jurisdiction, organization size, and sector-specific constraints before generating a readiness questionnaire.

#### Scenario: State agency selected
- **WHEN** the user selects entity type "state agency" and state "Illinois"
- **THEN** the system SHALL surface applicable Illinois AI regulations and flag state-specific compliance requirements

#### Scenario: Public university selected
- **WHEN** the user selects entity type "public university"
- **THEN** the system SHALL flag FERPA applicability and education-sector AI policies in addition to state regulations

#### Scenario: Regulated healthcare entity
- **WHEN** the user selects entity type "regulated entity" with industry "healthcare"
- **THEN** the system SHALL flag HIPAA AI provisions and applicable state health data laws

### Requirement: AI Policy Intake
The system SHALL capture whether the organization has an existing AI usage policy, allow upload of the policy document, and assess coverage across five areas: data privacy, IP/code ownership, approved tools, prohibited uses, and data handling.

#### Scenario: No AI policy exists
- **WHEN** the user indicates no AI policy exists
- **THEN** the system SHALL flag "No AI Policy" as a readiness blocker and recommend creating one before AI training begins

#### Scenario: Partial policy coverage
- **WHEN** the user indicates a policy exists but only covers 2 of 5 areas
- **THEN** the system SHALL identify the uncovered areas and include them as gaps in the readiness report

### Requirement: General Regulatory Context
The system SHALL automatically identify applicable AI regulations based on entity type, state, and industry — including state executive orders, federal guidelines (NIST AI RMF), and sector-specific rules (FERPA, HIPAA, state government procurement rules).

#### Scenario: Auto-detection of regulations
- **WHEN** a company profile is saved with entity type and state
- **THEN** the system SHALL display a list of applicable regulations with links to source legal text

### Requirement: Team Information Collection
The system SHALL collect team details including team name, function (development, QA, DevOps, data, mixed), methodology (Scrum, Kanban, SAFe, Waterfall), team size, team objectives, current pain points, and what the team hopes AI will help with.

#### Scenario: Development team with Scrum methodology
- **WHEN** a team is created with function "development" and methodology "Scrum"
- **THEN** the generated questionnaire SHALL include Scrum-specific AI readiness questions (e.g., sprint planning with AI, code review automation)

#### Scenario: Team objectives captured
- **WHEN** the user enters team objectives and pain points
- **THEN** these SHALL be included in the readiness report context section

### Requirement: Expanded SDLC Role Taxonomy
The system SHALL expand the TeamMemberRole type to include comprehensive SDLC roles beyond the current 6 (developer, qa, scrum_master, product_owner, devops, designer). The expanded role set SHALL include: business_analyst, tech_lead, architect, integration_tester, performance_tester, release_manager, data_analyst, data_engineer, security_engineer, ux_researcher, technical_writer, program_manager, project_manager, engineering_manager, database_admin, system_admin, support_engineer, and other (with free-text label). Each role SHALL have a display label and be mapped to appropriate questionnaire question categories.

#### Scenario: BA role questionnaire mapping
- **WHEN** a member has role "business_analyst"
- **THEN** the questionnaire SHALL include questions about AI-assisted requirements gathering, user story generation, process modeling, and stakeholder communication

#### Scenario: Integration tester role mapping
- **WHEN** a member has role "integration_tester"
- **THEN** the questionnaire SHALL include questions about AI-assisted test automation, API testing, regression suite management, and environment configuration

#### Scenario: Tech lead role mapping
- **WHEN** a member has role "tech_lead"
- **THEN** the questionnaire SHALL include questions spanning both developer-level AI coding tools AND governance/architecture review concerns

#### Scenario: Unmapped role flagged for questionnaire development
- **WHEN** a member has role "other" with custom label (e.g., "Accessibility Specialist") and no role-specific questions exist in the question bank for that label
- **THEN** the system SHALL flag this role as "unmapped — needs questionnaire development", assign only the universal questions (7 DORA capabilities + 4 policy areas), and create a development request record so an admin can develop role-specific questions later

#### Scenario: Previously unmapped role now has questions
- **WHEN** an admin has since developed and published questions tagged to custom role label "Accessibility Specialist"
- **THEN** future assessments with that role SHALL automatically pick up the new role-specific questions in addition to universal questions

### Requirement: Team Member Directory
The system SHALL maintain a directory of team members with name, email, role (from the expanded SDLC role taxonomy), and seniority level for each readiness assessment.

#### Scenario: Add team member
- **WHEN** a member is added with name, email, and role "developer"
- **THEN** the member SHALL appear in the team directory and be eligible for questionnaire distribution

#### Scenario: Role distribution summary
- **WHEN** multiple members are added to a team
- **THEN** the system SHALL display a summary of role distribution (e.g., "4 developers, 1 SM, 1 PO, 2 managers")

#### Scenario: Bulk import via CSV
- **WHEN** the user uploads a CSV file with columns name, email, role
- **THEN** the system SHALL create member records for each valid row and report any import errors

### Requirement: Custom Questionnaire Generation
The system SHALL generate a role-aware questionnaire based on company entity type, industry, applicable regulations, team function, team methodology, and each member's role. Questions SHALL be selected from a curated question bank tagged by these dimensions.

#### Scenario: Developer receives coding-specific questions
- **WHEN** a questionnaire is generated for a member with role "developer"
- **THEN** the questionnaire SHALL include questions about AI coding tools, code review practices, version control maturity, and technical debt

#### Scenario: Business analyst receives requirements questions
- **WHEN** a questionnaire is generated for a member with role "business_analyst"
- **THEN** the questionnaire SHALL include questions about AI-assisted requirements elicitation, user story generation, process documentation, and stakeholder analysis

#### Scenario: Scrum master receives facilitation questions
- **WHEN** a questionnaire is generated for a member with role "scrum_master"
- **THEN** the questionnaire SHALL include questions about AI sprint analytics, retrospective facilitation, impediment tracking, and velocity prediction

#### Scenario: Integration tester receives testing questions
- **WHEN** a questionnaire is generated for a member with role "integration_tester"
- **THEN** the questionnaire SHALL include questions about AI test generation, regression analysis, test environment automation, and defect pattern recognition

#### Scenario: DevOps receives infrastructure questions
- **WHEN** a questionnaire is generated for a member with role "devops"
- **THEN** the questionnaire SHALL include questions about AI-assisted IaC, pipeline optimization, incident response automation, and monitoring intelligence

#### Scenario: Manager receives governance questions
- **WHEN** a questionnaire is generated for a member with role "engineering_manager" or "program_manager" or "project_manager"
- **THEN** the questionnaire SHALL include questions about AI governance, policy awareness, team adoption readiness, and change management

#### Scenario: Architect receives design questions
- **WHEN** a questionnaire is generated for a member with role "architect"
- **THEN** the questionnaire SHALL include questions about AI-assisted design review, technical debt analysis, architecture documentation, and technology evaluation

#### Scenario: State agency gets compliance-heavy questionnaire
- **WHEN** a questionnaire is generated for a state agency entity type
- **THEN** the questionnaire SHALL include additional questions about procurement compliance, data sovereignty, and public records implications

#### Scenario: Admin previews before sending
- **WHEN** the questionnaire is generated
- **THEN** the admin SHALL be able to review, reorder, add, or remove questions before distribution

### Requirement: Questionnaire Email Distribution
The system SHALL send personalized questionnaire invitation emails to each team member with a unique tokenized response link that does not require authentication.

#### Scenario: Send questionnaire to all members
- **WHEN** the admin clicks "Send All" on the distribution page
- **THEN** each team member SHALL receive an email with their personalized questionnaire link

#### Scenario: Tokenized link access
- **WHEN** a team member clicks their questionnaire link
- **THEN** they SHALL be able to access and complete their questionnaire without creating an account or logging in

#### Scenario: Send reminder to non-respondents
- **WHEN** the admin clicks "Send Reminder"
- **THEN** only members who have not completed the questionnaire SHALL receive a reminder email

### Requirement: Response Collection
The system SHALL collect questionnaire responses via a public page accessible by tokenized link. Each question SHALL be answered on a 1-5 Likert scale with an optional free-text comment. Partial responses SHALL be saved automatically.

#### Scenario: Complete a questionnaire
- **WHEN** a respondent answers all questions and submits
- **THEN** the response SHALL be marked as completed and the admin dashboard SHALL reflect the updated completion count

#### Scenario: Partial response saved
- **WHEN** a respondent answers some questions but navigates away
- **THEN** answered questions SHALL be saved and the respondent can resume later using the same token link

#### Scenario: Response tracking dashboard
- **WHEN** the admin views the distribution page
- **THEN** they SHALL see each member's response status (not started, in progress, completed) and an overall completion percentage

### Requirement: Readiness Report Generation
The system SHALL generate a readiness report that includes: overall readiness tier (Not Ready / Foundation Needed / Ready / Well Positioned), per-capability scores aggregated from responses, blocker identification for capabilities below 3.0, regulatory gap analysis comparing AI policy coverage against applicable regulations, and role-based perception comparison.

#### Scenario: All responses collected
- **WHEN** all team members have completed their questionnaires
- **THEN** the system SHALL compute aggregate scores per capability, assign a readiness tier, and generate the full report

#### Scenario: Blocker identification
- **WHEN** a capability scores below 3.0 in aggregate
- **THEN** the report SHALL flag it as a blocker with a specific recommendation for remediation

#### Scenario: Role-based perception comparison
- **WHEN** the report is generated
- **THEN** it SHALL show how different roles scored each capability (e.g., developers rated version control 4.2 while managers rated it 2.8)

#### Scenario: Print to PDF
- **WHEN** the user clicks print or uses browser print
- **THEN** the report page SHALL render in a clean, print-optimized layout suitable for PDF export

### Requirement: Assessment Lifecycle
The system SHALL support a readiness assessment lifecycle: draft (intake in progress) → collecting (questionnaires sent, waiting for responses) → completed (report generated). Assessments MAY optionally be linked to an engagement.

#### Scenario: Create standalone assessment
- **WHEN** a user creates a new readiness assessment without linking to an engagement
- **THEN** the assessment SHALL function independently with its own company profile, team, and report

#### Scenario: Link to engagement
- **WHEN** a user creates a readiness assessment linked to an engagement
- **THEN** the readiness results SHALL be accessible from the engagement detail page and included in the transformation report's Amplifier Analysis

### Requirement: Re-Assessment Support
The system SHALL support re-assessments — running the same questionnaire against the same company and team at a later date to track readiness improvement over time. Re-assessments SHALL pre-populate company and team data from the prior assessment.

#### Scenario: Create re-assessment
- **WHEN** a user clicks "Re-assess" on a completed assessment
- **THEN** a new assessment SHALL be created with company profile and team directory pre-populated from the original, and the user can update members/roles before generating a new questionnaire

#### Scenario: Compare assessments
- **WHEN** a re-assessment report is generated and a prior assessment exists for the same company
- **THEN** the report SHALL show per-capability score deltas with trend indicators (improved, declined, unchanged) compared to the prior assessment

### Requirement: Question Bank Versioning
The question bank SHALL be versioned. Each question SHALL have a `version` number (starting at 1) and a `status` (draft, active, deprecated). When a question is revised, the system SHALL create a new version rather than editing in place, preserving the original so that historical assessment results remain tied to the exact question wording respondents saw. Each generated questionnaire SHALL record the question version used.

#### Scenario: Question revised after customer feedback
- **WHEN** an admin edits an active question's wording
- **THEN** the system SHALL create a new version (version N+1) with status "active", set the prior version to "deprecated", and all future questionnaires SHALL use the new version

#### Scenario: Historical report shows original wording
- **WHEN** a user views a completed assessment report
- **THEN** the report SHALL display the exact question wording from the version used at the time of the assessment, not the current active version

#### Scenario: View question version history
- **WHEN** an admin views a question in the question bank management UI
- **THEN** they SHALL see all versions with timestamps, the author who made each change, and which version is currently active

### Requirement: Unmapped Role Development Tracking
The system SHALL track custom roles that have no role-specific questions in the question bank. When a new unmapped role appears in an assessment, the system SHALL create a "question development request" that is visible to admins. Admins can then develop role-specific questions, tag them to that role, and publish them so future assessments automatically include them.

#### Scenario: New unmapped role triggers development request
- **WHEN** a team member is added with role "other" and custom label "Data Governance Officer" and no questions are tagged to that label
- **THEN** the system SHALL create a question development request with status "pending" visible in the admin question bank UI

#### Scenario: Admin develops questions for flagged role
- **WHEN** an admin opens a pending development request and creates new questions tagged to "Data Governance Officer"
- **THEN** the request status SHALL change to "completed" and the new questions SHALL be available for the next questionnaire generation

#### Scenario: Dashboard shows unmapped role count
- **WHEN** an admin views the question bank management page
- **THEN** they SHALL see a count of pending development requests (unmapped roles needing questions) as a prominent badge

### Requirement: Question Feedback and Continuous Improvement
The system SHALL collect feedback on question quality from two sources: (1) respondents can flag a question as "unclear" or "not applicable" during the questionnaire, and (2) admins can review aggregate feedback per question after assessments complete. Questions with high "unclear" or "not applicable" rates SHALL be flagged for review.

#### Scenario: Respondent flags question as unclear
- **WHEN** a respondent marks a question as "unclear" during the questionnaire
- **THEN** the flag SHALL be recorded with the response and the respondent SHALL still be able to answer or skip the question

#### Scenario: Respondent flags question as not applicable
- **WHEN** a respondent marks a question as "not applicable" to their role
- **THEN** the flag SHALL be recorded, the question SHALL be treated as skipped (not counted in scoring), and the admin SHALL see this in the feedback report

#### Scenario: Admin reviews question feedback
- **WHEN** an admin views a question in the question bank after multiple assessments
- **THEN** they SHALL see aggregate stats: total times asked, average score, "unclear" flag count, "not applicable" flag count, and a flag rate percentage

#### Scenario: Auto-flag questions with high issue rate
- **WHEN** a question has an "unclear" or "not applicable" rate above 25% across at least 10 responses
- **THEN** the system SHALL automatically flag the question as "needs review" in the admin UI with a yellow warning badge
