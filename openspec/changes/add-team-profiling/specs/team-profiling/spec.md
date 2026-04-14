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
- **THEN** the team profile page displays all sections in a single, scrollable view with section navigation
