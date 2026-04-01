# Chapter 3: User Guide — Engagements

[Back to Table of Contents](README.md) | [Previous: Getting Started](02-getting-started.md)

---

## What Is an Engagement?

An **engagement** represents a complete AI training project with a client. It contains:
- Client organization name
- One or more Scrum teams
- Integration configuration (Jira, Azure DevOps, etc.)
- A lifecycle: Draft → Baseline → Training → Post-Assessment → Completed

## Creating an Engagement

1. Click **"New Engagement"** on the Dashboard or Engagements page
2. Fill in the form:

| Field | Required | Description |
|-------|----------|-------------|
| **Engagement Name** | Yes | Descriptive name, e.g., "Acme Corp - Platform Team Q2 2026" |
| **Client Name** | Yes | Client organization name |
| **Integration** | Yes | Which Scrum tool the client uses (Jira, Azure DevOps, GitHub, GitLab, Linear, or Manual) |
| **Notes** | No | Internal notes for the team |

3. Click **"Create Engagement"**

You'll be redirected to the engagement detail page.

## Engagement Detail Page

The detail page shows:

### Timeline
A horizontal timeline displaying the current phase: Setup → Baseline → Training → Post-Assessment → Complete. Green circles indicate completed phases, blue indicates the current phase.

### Teams Section
Each team is displayed as a card showing:
- Team name and member count
- Member list with roles
- Assessment status (baseline and post-training)
- Action buttons: Baseline, Training Plan, Post-Training, View Report

## Adding a Team

1. On the engagement detail page, click **"Add Team"**
2. Enter the team name (e.g., "Platform Team")
3. Add team members:
   - **Display Name** — The person's name or anonymous identifier (e.g., "Dev-1")
   - **Role** — Developer, QA/Tester, Scrum Master, Product Owner, DevOps, or Designer
4. Click **"+ Add Member"** to add more members
5. Click **"Create Team"**

### Why Roles Matter

The role assignment drives **customized training recommendations**. A developer gets different AI tools and training than a QA tester or Scrum Master. This is our core differentiator — every role gets the right tools.

### Anonymous vs Named Members

You can use either approach:
- **Real names** (e.g., "Jane Smith") — easier to track, but less survey anonymity
- **Anonymous identifiers** (e.g., "Dev-1", "QA-2") — encourages honest survey responses. Keep a private mapping.

## Engagement Status Lifecycle

| Status | What It Means |
|--------|--------------|
| **Draft** | Just created, no assessments started |
| **Baseline** | Baseline assessment is in progress |
| **Training** | Training is being delivered (tracked manually) |
| **Post-Assessment** | Post-training assessment is in progress |
| **Completed** | Both assessments done, report available |
| **Archived** | No longer active (soft delete) |

The status updates automatically as you create assessments. You can also manually set it from the API.

---

[Next: User Guide: Assessments →](04-user-guide-assessments.md)
