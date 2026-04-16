## ADDED Requirements

### Requirement: Assessment Scope Selection
The system SHALL provide a scope selection step as the first step after creating a readiness assessment. The consultant SHALL select which of the 9 software delivery pillars are in scope: Development Process, Testing & Quality, Documentation, PMO & Reporting, BA & Requirements, DevOps & Infrastructure, Data & Analytics, Security & Compliance, Design & UX. All downstream steps (constraints, SDLC phases, questionnaire questions, use cases, risk register, report sections) SHALL filter to only the selected pillars.

#### Scenario: Select 5 of 9 pillars for DCFS
- **WHEN** the consultant selects Development Process, Testing & Quality, Documentation, PMO & Reporting, and BA & Requirements
- **THEN** the SDLC template SHALL only generate phases for those 5 pillars, the questionnaire SHALL only include questions tagged to those pillars, and the report SHALL omit DevOps, Data, Security, and Design sections

#### Scenario: Data readiness step conditional on scope
- **WHEN** the Data & Analytics pillar is NOT in scope
- **THEN** the Data Readiness Scorecard step SHALL be hidden from the workflow and omitted from the report

#### Scenario: Scope change warning
- **WHEN** the consultant changes scope after SDLC phases or questionnaire have been generated
- **THEN** the system SHALL warn that downstream content may need regeneration

### Requirement: Organizational Constraints Capture
The system SHALL provide a dedicated step for capturing organizational constraints across 6 categories: Technology, AI Tools, Process, Data & Privacy, Policy & Compliance, and Budget & Resources. Each constraint SHALL have a description, category, severity (hard or soft), source, and notes. Hard constraints SHALL block downstream AI suggestions; soft constraints SHALL generate warnings. Approved AI tools with their capabilities and restrictions SHALL be captured as part of the AI Tools category.

#### Scenario: Add a hard process constraint
- **WHEN** the consultant adds constraint "AI cannot write production code" with category "Process" and severity "Hard"
- **THEN** the SDLC augmentation step SHALL exclude code-writing AI opportunities and the constraint SHALL appear in the report

#### Scenario: Add approved AI tools
- **WHEN** the consultant adds "GitHub Copilot" with capabilities "code suggestions, test generation, documentation" and restrictions "cannot commit to repository"
- **THEN** SDLC augmentation suggestions SHALL only use capabilities within these bounds

#### Scenario: Pre-populate constraints for entity type
- **WHEN** the consultant clicks "Pre-populate" for a state agency
- **THEN** common state agency constraints SHALL be added: procurement compliance (Policy, Hard), FOIA applicability (Policy, Hard), data sovereignty (Data & Privacy, Hard)

#### Scenario: Fewer constraints enable more opportunities
- **WHEN** an organization has fewer hard constraints
- **THEN** the SDLC analysis SHALL show more augmentation opportunities and the report SHALL note the wider AI adoption potential

### Requirement: AI-Augmented SDLC Process Analysis
The system SHALL provide a step where the consultant documents the team's current SDLC process as ordered phases (filtered to in-scope pillars), records current tools and pain points per phase, and maps AI augmentation opportunities filtered by organizational constraints and approved tools. The system SHALL produce a side-by-side "Current SDLC vs. AI-Augmented SDLC" comparison with per-phase improvement projections.

#### Scenario: Load Scrum template filtered by scope
- **WHEN** the consultant selects "Scrum" template and the in-scope pillars are Development, Testing, Documentation, PMO, BA
- **THEN** the system SHALL generate phases: Sprint Planning, Backlog Grooming, Story Refinement, Development, Code Review, Testing, Documentation, Sprint Retrospective — excluding deployment and infrastructure phases

#### Scenario: Auto-suggest augmentations filtered by constraints
- **WHEN** approved tool is "GitHub Copilot" and hard constraint is "cannot write production code"
- **THEN** Development phase suggestions SHALL include "code review suggestions" and "test generation" but NOT "code generation" or "code completion"

#### Scenario: Mark current strengths
- **WHEN** the consultant marks "team already uses Copilot for test suggestions" as a current strength
- **THEN** the report SHALL highlight it positively: "Current strength — team already leverages AI here"

#### Scenario: Side-by-side comparison
- **WHEN** the SDLC analysis is complete
- **THEN** the report SHALL show "Current Process" vs. "AI-Augmented Process" per phase with what changes and projected improvement

#### Scenario: Improvement projection
- **WHEN** improvement estimates are entered per opportunity
- **THEN** the system SHALL compute per-phase and overall projected improvement

### Requirement: Data Readiness Scorecard
The system SHALL provide a data readiness assessment step (only when Data & Analytics pillar is in scope) where the consultant scores five dimensions on a 1-5 scale: data quality, data accessibility, data governance, data pipelines, and data security. Each dimension SHALL include evidence notes. The system SHALL compute an overall data readiness score and display it as a standalone section in the report.

#### Scenario: Consultant scores data readiness
- **WHEN** scores are entered for all 5 dimensions
- **THEN** the system SHALL compute the average and display a dimension-level breakdown in the report

#### Scenario: Low data quality flagged as blocker
- **WHEN** data quality scores below 2.0
- **THEN** the report SHALL flag "Data Quality" as a critical blocker

#### Scenario: Data step hidden when not in scope
- **WHEN** Data & Analytics pillar is not in scope
- **THEN** the data readiness step SHALL not appear in the workflow

### Requirement: Use Case Identification and Prioritization
The system SHALL allow consultants to enter AI use cases tagged to in-scope pillars, score each on business impact (1-5) and implementation effort (1-5), and classify them into an effort/impact matrix: Quick Wins (high impact, low effort), Strategic Bets (high impact, high effort), Fill-Ins (low impact, low effort), Avoid (low impact, high effort). Use cases SHALL be auto-grouped into 4 investment tiers by timeline: Tier 1 Quick Wins (0-3 months), Tier 2 Foundation (3-6 months), Tier 3 Strategic (6-12 months), Tier 4 Future (12+ months).

#### Scenario: Classify a quick win
- **WHEN** a use case has impact 4 and effort 2
- **THEN** it SHALL be classified as "Quick Win" in the top-left quadrant

#### Scenario: Filter use cases by pillar
- **WHEN** the consultant filters by "Testing & Quality" pillar
- **THEN** only use cases tagged to that pillar SHALL appear

#### Scenario: Investment tier grouping
- **WHEN** 8 use cases have varying timelines
- **THEN** the report SHALL group them into 4 tiers with correct labels and timeframes

#### Scenario: Effort/impact matrix visualization
- **WHEN** multiple use cases are entered
- **THEN** the system SHALL display a 2x2 matrix with use cases plotted as dots in their quadrants

### Requirement: Risk Register
The system SHALL maintain a risk register pre-populated with common risks based on entity type AND selected pillars. Each risk SHALL have: description, category (technical/organizational/regulatory/ethical), likelihood (1-5), impact (1-5), computed risk score (likelihood x impact), mitigation, and owner. Risks SHALL be sorted by score descending and color-coded: red (>= 15), amber (8-14), green (< 8).

#### Scenario: Pre-populate risks scoped to pillars
- **WHEN** the entity type is state agency and in-scope pillars are Development and Testing
- **THEN** pre-populated risks SHALL include development-relevant risks (shadow AI usage, code IP concerns) but NOT infrastructure risks

#### Scenario: Risk color-coding
- **WHEN** a risk has likelihood 4 and impact 5
- **THEN** it SHALL have risk score 20 and be color-coded red

### Requirement: Pilot/POC Recommendation
The system SHALL allow consultants to create pilot recommendations linked to Quick Win use cases. Each pilot SHALL have: title, scope, measurable success criteria, timeline, team roles, tools, estimated cost, and go/no-go criteria. The system SHALL warn if a pilot depends on an unresolved readiness blocker.

#### Scenario: Create pilot from quick win
- **WHEN** a Quick Win use case is selected as the basis for a pilot
- **THEN** the pilot SHALL be pre-populated with the use case title and description

#### Scenario: Blocker warning
- **WHEN** a pilot requires a capability scoring below 3.0
- **THEN** the system SHALL display a warning about the readiness blocker dependency

### Requirement: AI Enhancement Catalog
The system SHALL maintain a versioned master catalog of AI enhancements organized by the 9 assessment pillars (~120 items in v1). For each assessment, the consultant SHALL evaluate every in-scope catalog item and assign a status: already in use, new opportunity, blocked by constraint, not applicable, or not evaluated. The system SHALL compute coverage statistics and flag evaluation gaps. The catalog SHALL be versioned so that when AI capabilities evolve, new catalog versions can be released without affecting historical assessments.

#### Scenario: Evaluate enhancements for in-scope pillars
- **WHEN** an assessment has 5 pillars in scope containing 52 applicable catalog items
- **THEN** the consultant SHALL see only those 52 items and the system SHALL track evaluation progress: "48 of 52 evaluated (92%)"

#### Scenario: Coverage gap detection
- **WHEN** 4 items remain as "not evaluated"
- **THEN** the report SHALL flag these as assessment gaps with a yellow warning

#### Scenario: Enhancement status breakdown
- **WHEN** all items are evaluated
- **THEN** the report SHALL show: "12 already in use, 18 new opportunities, 8 blocked by constraints, 14 not applicable"

#### Scenario: Catalog version update
- **WHEN** a new catalog version (v2) is released with 6 new Testing enhancements
- **THEN** existing assessments remain on v1 and new assessments use v2; re-assessments can compare what changed between versions

### Requirement: Report Traceability
Every readiness report SHALL record the exact versions of all data sources used: AI Enhancement Catalog version, Question Bank version, SDLC Template version, Risk Template version, and Constraint Template version. The report SHALL also record snapshots of: company policy, approved tools, constraints, and scope. This metadata SHALL appear in a "Report Metadata" section and on the print footer for auditability.

#### Scenario: Version stamps in report
- **WHEN** a report is generated
- **THEN** it SHALL display: catalog version (e.g., "v3, 2026-04-01"), question bank version, SDLC template version, assessment date, and scope summary

#### Scenario: Historical report reproducibility
- **WHEN** a user views a 6-month-old report after the catalog has been updated to v4
- **THEN** the report SHALL still show the data and catalog items from v2 that was in effect at assessment time

#### Scenario: Re-assessment version comparison
- **WHEN** a re-assessment is run after a catalog update
- **THEN** the report SHALL note which catalog items are new since the prior assessment and which have been deprecated

### Requirement: Scope-Aware Report
The readiness report SHALL include sections only for in-scope pillars and entered data. The assessment scope summary SHALL always appear. Sections with no data (no use cases entered, no risks entered) SHALL be omitted rather than shown empty. All new sections SHALL be print-friendly.

#### Scenario: Complete report for scoped assessment
- **WHEN** 5 of 9 pillars are in scope with all deliverables entered
- **THEN** the report SHALL include: Scope, Constraints, AI-Augmented SDLC (5 phases), Use Cases, Investment Tiers, Risks, Pilots, Capability Scores, Blockers — but NOT Data Readiness, DevOps sections, Security sections, or Design sections

#### Scenario: Minimal report
- **WHEN** only scope and constraints are entered (no SDLC analysis, no use cases)
- **THEN** the report SHALL include: Scope, Constraints, Capability Scores, Blockers — omitting all optional sections
