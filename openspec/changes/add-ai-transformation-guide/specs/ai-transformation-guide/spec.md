## ADDED Requirements

### Requirement: AI Transformation Framework Guide Structure
The guide SHALL be organized as 13 chapters plus appendices, covering the complete 8-phase framework (Govern, Baseline, Design, Train, Pilot, Measure, Playbook, Scale) with each chapter as a standalone markdown file under `clients/dcfs-ilc/planning/guide/`.

#### Scenario: User navigates the guide
- **WHEN** a user opens the guide README
- **THEN** they see a table of contents with all 13 chapters and 4 appendices with descriptions

### Requirement: AI Readiness Assessment Instrument
The guide SHALL include a formal assessment instrument (Chapter 4) with at least 23 questions covering skills, process readiness, attitudes, and infrastructure, designed for distribution to all teams before pilot selection.

#### Scenario: Assessment distributed to teams
- **WHEN** the readiness assessment is distributed to all 12 teams
- **THEN** each team member completes a 10-15 minute survey covering AI experience, skills self-assessment, process readiness, attitudes/concerns, and infrastructure readiness

#### Scenario: Readiness score computed
- **WHEN** assessment responses are collected
- **THEN** a readiness score per team is computed with sub-scores for Skills, Process, Attitude, and Infrastructure

### Requirement: Training Delivery Plan
The guide SHALL include a training delivery plan (Chapter 7) with 6 role-based tracks (Foundation, BA, Tester, Developer, Scrum Master, Leadership), each specifying content, duration, delivery method, materials, and success criteria.

#### Scenario: Training tracks cover all pilot roles
- **WHEN** a training plan is created for a pilot engagement
- **THEN** it includes tracks for all participating roles plus a foundation track for compliance and a leadership briefing

#### Scenario: Training materials inventory
- **WHEN** training preparation begins
- **THEN** a materials inventory lists all required assets (prompt libraries, example outputs, guardrails cheat sheets, reference cards)

### Requirement: Leadership Dashboard Concept
The guide SHALL include a leadership dashboard concept (Chapter 9) describing executive-facing views for CIO visibility into pilot progress, mapping to tools.ussp.co capabilities.

#### Scenario: CIO views pilot progress
- **WHEN** the CIO accesses the dashboard
- **THEN** they see executive summary metrics, team comparison (pilot vs control), sprint-over-sprint trends, and compliance status

### Requirement: Deployment Guide
The guide SHALL include a deployment guide (Chapter 13) describing how to set up the AI transformation framework for a new client engagement.

#### Scenario: New engagement setup
- **WHEN** a new AI transformation engagement begins
- **THEN** the deployment guide provides step-by-step instructions for configuring tools.ussp.co, distributing assessments, and initializing baseline measurement

### Requirement: Consistent Terminology
The guide SHALL use consistent terminology throughout: "SDLC processes" (not "use cases"), "augmenting" (not "changing"), and frame the framework as intent being built (not a finished product).

#### Scenario: Terminology consistency check
- **WHEN** the guide is reviewed
- **THEN** no instances of deprecated terminology ("use cases" for process selection, "changing processes") appear in guide chapters
