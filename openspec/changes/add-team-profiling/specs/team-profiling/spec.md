## ADDED Requirements

### Requirement: Team Composition Capture
When adding or editing a team in an engagement, the system SHALL allow users to define team members with role, vendor/organization, AI pilot participation status, and assigned AI tool.

#### Scenario: Add team with multi-vendor composition
- **WHEN** user creates a team and adds members
- **THEN** each member has fields for name, role (BA-Technical, Configuration, Developer, Tester, Scrum Master, PO, BA-Functional), vendor (Krasan, CSG, ISI, State, Other), in-pilot flag (yes/no), and AI tool assignment

#### Scenario: Filter pilot participants
- **WHEN** user views the team profile
- **THEN** pilot participants (in-pilot = yes) are visually distinguished from non-pilot members

### Requirement: SDLC Workflow Definition
The system SHALL allow users to define the team's SDLC workflow as an ordered list of JIRA status states, with the role responsible and typical duration for each state.

#### Scenario: Define workflow states
- **WHEN** user configures the team's SDLC workflow
- **THEN** they can add ordered status states (e.g., Backlog, Refinement, In Progress, Code Review, QA, Done) with role assignment and expected duration

#### Scenario: Workflow used for cycle time
- **WHEN** the measurement module computes cycle time
- **THEN** it uses the team's defined workflow states to calculate time between "In Progress" and "Done" states

### Requirement: Team Objectives
The system SHALL capture the team's current sprint/PI objectives and delivery expectations, including whether the team has capacity for AI adoption activities.

#### Scenario: Record PI objectives
- **WHEN** user edits team objectives
- **THEN** they can enter PI objectives, delivery expectations, and a capacity allocation percentage for AI adoption (e.g., 15%)

### Requirement: Current Tools Inventory
The system SHALL capture the team's current tool stack (project tracking, source control, IDE, platform, CI/CD, testing, communication) and their AI tool additions.

#### Scenario: Document existing and new tools
- **WHEN** user edits the team's tool inventory
- **THEN** they can list current tools by category and mark which AI tools are being added for the pilot

### Requirement: AI Augmentation Map
The system SHALL allow users to map each SDLC process to the role performing it, the current state, the AI-augmented state, the AI tool used, and the stair-step level.

#### Scenario: Map processes to AI augmentation
- **WHEN** user configures the AI augmentation map
- **THEN** each row contains: SDLC process name, role, current state description, AI-augmented state description, AI tool, and stair-step number (1-5)

### Requirement: Baseline Metrics Display
The system SHALL display the team's baseline metrics (from the assessment module) within the team profile, showing the last 3 sprints of data.

#### Scenario: View baseline on team profile
- **WHEN** user views the team profile
- **THEN** baseline metrics (velocity, cycle time, throughput, predictability, rejection rate, defect density, LOC committed, documentation pages) are displayed with per-sprint values and averages

### Requirement: Readiness Assessment Link
The system SHALL link the team's readiness assessment results (from Chapter 4 instrument) to the team profile, showing sub-scores for Skills, Process, Attitude, and Infrastructure.

#### Scenario: View readiness on team profile
- **WHEN** user views the team profile
- **THEN** readiness assessment scores are displayed with sub-dimension breakdown and overall readiness tier

### Requirement: Training Status Tracking
The system SHALL track training completion per team member, showing which training tracks have been scheduled, completed, or are pending.

#### Scenario: Track training per role
- **WHEN** user views training status for a team
- **THEN** each member shows their assigned training tracks and completion status (Scheduled, Completed, Pending)

### Requirement: Team Profile Detail Page
The system SHALL provide a team profile detail page within the engagement view that consolidates all team information: composition, workflow, objectives, tools, augmentation map, baseline, readiness, and training status.

#### Scenario: View complete team profile
- **WHEN** user clicks on a team within an engagement
- **THEN** the team profile page displays all sections in a tabbed view with section navigation

### Requirement: Assessment Integration
The system SHALL automatically populate team profile data from the assessment module — readiness scores from the readiness assessment, baseline metrics from JIRA baseline, and training assignments from team composition.

#### Scenario: Readiness assessment populates team profile
- **WHEN** the readiness assessment for a team is completed
- **THEN** the team profile's readiness section automatically updates with sub-scores (Skills, Process, Attitude, Infrastructure) and overall readiness tier

#### Scenario: Baseline assessment populates team profile
- **WHEN** the JIRA baseline data pull is completed for a team
- **THEN** the team profile's baseline section automatically displays the last 3 sprints of metrics

#### Scenario: Training plan auto-generated from composition
- **WHEN** user clicks "Generate Training Plan" on the team profile
- **THEN** the system assigns training tracks based on member roles (Foundation for all pilot members, role-specific tracks by role) and creates training status records

#### Scenario: Pilot readiness gate
- **WHEN** the engagement lead checks if a team is ready to enter the pilot
- **THEN** the system validates: all pilot members have completed their assigned training tracks, readiness score is above threshold, baseline metrics are captured

### Requirement: Contextual Tooltips
The system SHALL provide contextual tooltips on all team profile fields explaining the purpose, expected values, and guidance for each input.

#### Scenario: User hovers over a field label
- **WHEN** user hovers over or focuses on a team profile field label
- **THEN** a tooltip appears with a brief explanation of the field's purpose and expected values

### Requirement: Audit Logging
The system SHALL log all team profile create, update, and delete operations to the audit trail with user, timestamp, and change details.

#### Scenario: Team profile modified
- **WHEN** any team profile data is created, updated, or deleted
- **THEN** an audit log entry records the user, timestamp, field changed, old value, and new value

### Requirement: Documentation
The system's team profiling feature SHALL be documented in the user guide (usage), admin guide (API/schema), and framework guide (deployment), with tooltips providing inline help for all fields.

#### Scenario: New user learns team profiling
- **WHEN** a new user accesses the team profiling feature
- **THEN** they can reference the user guide for step-by-step instructions, tooltips for inline help, and the admin guide for technical details
