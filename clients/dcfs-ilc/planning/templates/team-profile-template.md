# Pilot Team Profile — Template

> **Version:** V04142026
> **Purpose:** Capture the composition, SDLC workflow, objectives, and tooling for each pilot team before AI augmentation begins. One profile per team.
> **When:** Completed during Baseline & Design phase, before training starts.

---

## Team Information

| Field | Value |
|-------|-------|
| **Team Name** | |
| **Scrum Master / Lead** | |
| **Product Owner** | |
| **Sprint Length** | |
| **Current PI** | |
| **Domain / Focus Area** | |
| **Dynamics Module** | |

---

## Team Composition

| # | Name | Role | Vendor | In AI Pilot? | AI Tool |
|---|------|------|--------|-------------|---------|
| 1 | | Product Owner | State / ISI | No (not Krasan) | — |
| 2 | | BA - Functional | CSG | No (initially) | — |
| 3 | | BA - Technical | Krasan | **Yes** | Rovo |
| 4 | | Configuration Lead | Krasan | **Yes** | Power Platform AI / D365 Copilot |
| 5 | | Configuration | Krasan | **Yes** | Power Platform AI / D365 Copilot |
| 6 | | Developer | Krasan | **Yes** | GitHub Copilot |
| 7 | | Developer | Krasan | **Yes** | GitHub Copilot |
| 8 | | Tester | Krasan | **Yes** | Copilot + Rovo |
| 9 | | Tester | Krasan | **Yes** | Copilot + Rovo |
| 10 | | Scrum Master / Lead | Krasan | **Yes** | Rovo |

> **Note:** Actual team composition varies. Update this table with real names and roles. Verify with Romi.

---

## SDLC Workflow — Current State

### How Work Flows Through This Team

```
Backlog → Refinement → Sprint Planning → In Progress → Code/Config Review → QA/Testing → Done
```

Document the actual JIRA workflow states for this team:

| # | JIRA Status | Who Does the Work | Typical Duration | Notes |
|---|------------|-------------------|-----------------|-------|
| 1 | Backlog | PO prioritizes | Ongoing | |
| 2 | Refinement | BA-Functional + BA-Technical | | |
| 3 | Ready for Sprint | PO approves | | |
| 4 | Sprint Planning | Scrum Master + full team | | |
| 5 | In Progress - Requirements | BA-Technical | | |
| 6 | In Progress - Configuration | Config team | | |
| 7 | In Progress - Development | Developers | | |
| 8 | Code/Config Review | Peer review | | |
| 9 | Ready for QA | Handoff to testers | | |
| 10 | In QA | Testers | | |
| 11 | QA Passed / Failed | Testers | | |
| 12 | Done | Scrum Master confirms | | |

> **Action:** Get exact JIRA workflow states from Matt (RTE). These are needed for cycle time computation.

---

## Team Objectives

### Current Sprint/PI Objectives

| # | Objective | Priority | Notes |
|---|-----------|----------|-------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

### Delivery Expectations

| Question | Answer |
|----------|--------|
| What is the team expected to deliver this PI? | |
| Is there pressure to increase velocity? | |
| Are there any high-risk or critical-path stories? | |
| Does the team have capacity for 15% AI adoption time? | |
| PO awareness / support for the pilot? | |

---

## Tools — Current State

| Category | Tool | How Used | Access Confirmed? |
|----------|------|---------|------------------|
| Project Tracking | JIRA | Stories, sprints, backlog | |
| Documentation | Confluence | Requirements, design docs | |
| Source Control | GitHub | Code repos | |
| IDE | Visual Studio | Dynamics plugins, C#/X++ | |
| Platform | Dynamics 365 | Configuration, entities, workflows | |
| CI/CD | | | |
| Testing | | Manual / Zephyr / other | |
| Communication | Microsoft Teams | Team channel | |

### AI Tools — To Be Added

| Tool | For Role | Status | Access? |
|------|---------|--------|---------|
| GitHub Copilot | Developers | Pending deployment | |
| Atlassian Rovo | BA-Technical, Testers, SM | Pending verification | |
| Power Automate Copilot | Configuration | Pending evaluation | |
| D365 Copilot | Configuration | Pending evaluation | |

---

## SDLC Processes — AI Augmentation Map

For this specific team, which processes will be augmented:

| SDLC Process | Role | Current State (how they do it today) | AI-Augmented State | AI Tool | Stair Step |
|-------------|------|-------------------------------------|-------------------|---------|-----------|
| Use case / requirement writing | BA-Technical | | | Rovo | Step 1 |
| Acceptance criteria generation | BA-Technical | | | Rovo | Step 1 |
| Configuration design | Config team | | | Power Platform AI | Step 4 |
| Configuration generation | Config team | | | D365 Copilot | Step 4 |
| Plugin / custom code | Developers | | | GitHub Copilot | Step 5 |
| Code review | Developers | | | GitHub Copilot | Step 2 |
| Documentation | All | | | Copilot | Step 2 |
| Test script creation | Testers | | | Copilot + Rovo | Step 3 |
| Sprint insights | Scrum Master | | | Rovo | Step 1 |

> **Fill in "Current State"** during the Dynamics working session with Kashif/Shyam and team interviews.

---

## Baseline Metrics (Pre-AI)

| Metric | Sprint N-3 | Sprint N-2 | Sprint N-1 | Average |
|--------|-----------|-----------|-----------|---------|
| Velocity (story points) | | | | |
| Cycle time (days) | | | | |
| Throughput (items) | | | | |
| Sprint predictability (%) | | | | |
| Story rejection rate (%) | | | | |
| Defect density | | | | |
| Lines of code committed | | | | |
| Documentation pages | | | | |

> **Source:** JIRA data pull by Vinay + Matt

---

## Readiness Assessment Results

| Dimension | Score (1-5) | Notes |
|-----------|------------|-------|
| Skills | | |
| Process | | |
| Attitude | | |
| Infrastructure | | |
| **Overall Readiness** | | |

> **Source:** AI Readiness Assessment survey results

---

## Risks & Concerns (Team-Specific)

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| | | | |
| | | | |

---

## Training Status

| Track | Scheduled | Completed | Notes |
|-------|-----------|-----------|-------|
| Foundation | | | |
| BA-Technical | | | |
| Configuration | | | |
| Developer | | | |
| Tester | | | |
| Scrum Master | | | |

---

## Notes

*Add any team-specific observations, constraints, or context here.*
