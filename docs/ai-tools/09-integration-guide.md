# Chapter 9: Integration Guide

[Back to Table of Contents](README.md) | [Previous: Government & Compliance](08-government-compliance.md)

---

## Supported Integrations

| Platform | What Gets Pulled | Status |
|----------|-----------------|--------|
| **Jira Cloud** | Sprints, velocity, story points, cycle time, issues | Implemented |
| **Azure DevOps** | Iterations, work items, velocity, cycle time, pipelines | Implemented |
| **GitHub** | PRs, commits, deployments, CI/CD runs | Implemented |
| **GitLab** | MRs, commits, deployments, pipelines | Planned |
| **Linear** | Cycles, issues, velocity | Planned |

## Jira Cloud Setup

### Prerequisites
- Jira Cloud account (not Jira Server/Data Center)
- API token with read access to the target project
- Board ID of the Scrum board to monitor

### Step 1: Generate an API Token
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Name it "USSP AI Monitor" (or similar)
4. Copy the token — you won't see it again

### Step 2: Find Your Board ID
1. Navigate to your Jira Scrum board
2. Look at the URL: `https://yourcompany.atlassian.net/jira/software/projects/PROJ/boards/123`
3. The number after `/boards/` is your Board ID (e.g., `123`)

### Step 3: Configure in the Tool
When creating the engagement, select "Jira Cloud" as the integration and provide:

| Field | Value |
|-------|-------|
| Base URL | `https://yourcompany.atlassian.net` |
| Project Key | e.g., `PROJ` |
| Board ID | e.g., `123` |
| API Token | The token you generated |

### What Jira Data Gets Pulled

**Sprint Data** (`/rest/agile/1.0/board/{boardId}/sprint`):
- Sprint name, start date, end date, state
- Committed vs completed story points
- Items committed vs completed
- Bug count

**Issue Details** (`/rest/agile/1.0/sprint/{sprintId}/issue`):
- Issue type (story, bug, task, spike)
- Assignee (mapped to team member)
- Story points
- Cycle time (computed from status change history)

### Story Points Field
Jira uses custom fields for story points. The integration checks these fields in order:
1. `story_points` (standard)
2. `customfield_10016` (common default)
3. `customfield_10028` (alternative)

If your Jira uses a different custom field, contact the development team to add it.

## Azure DevOps Setup

### Prerequisites
- Azure DevOps organization with a project
- Personal Access Token (PAT) with read access

### Step 1: Generate a PAT
1. Go to `https://dev.azure.com/{org}/_usersSettings/tokens`
2. Click **"New Token"**
3. Set scope: **Work Items (Read)**, **Build (Read)**
4. Copy the token

### Step 2: Configure
| Field | Value |
|-------|-------|
| Base URL | `https://dev.azure.com/yourorg` |
| Project Key | Your project name |
| Board ID | Team name (e.g., "Platform Team") |
| API Token | Your PAT |

### What ADO Data Gets Pulled
- Iterations (sprints) with start/end dates
- Work items per iteration with story points
- Work item types and states for cycle time
- Completion status

## GitHub Setup (DORA Metrics)

GitHub integration focuses on **DORA metrics** — deployment data and PR metrics.

### Prerequisites
- GitHub repository
- Personal Access Token with `repo` and `deployments` scope

### Step 1: Generate a Token
1. Go to https://github.com/settings/tokens
2. Create a **Fine-grained personal access token**
3. Select the repository
4. Grant: Contents (read), Deployments (read), Pull requests (read)

### Step 2: Configure
| Field | Value |
|-------|-------|
| Repository Owner | e.g., `ussp` |
| Repository Name | e.g., `usspwebsite` |
| API Token | Your GitHub token |

### What GitHub Data Gets Pulled
- **Deployments**: Deployment count, success/failure, environment
- **Pull Requests**: Merged PRs, review turnaround time, author

### DORA Metrics Computed from GitHub
| Metric | How It's Computed |
|--------|------------------|
| Deployment Frequency | Production deployments / weeks in period |
| Lead Time | Median time from PR creation to merge |
| Change Failure Rate | Failed deployments / total deployments |
| MTTR | Not available from GitHub alone — requires incident tracking |

## Syncing Data

After integration is configured:

1. Create a baseline or post-training assessment
2. Set the date range (which sprints to observe)
3. The system pulls data automatically when the assessment is created
4. To re-sync, use the API: `POST /api/teams/{id}/sync`

## Troubleshooting Integrations

| Issue | Solution |
|-------|---------|
| "Cannot access board" | Check API token permissions and board ID |
| No story points showing | Your Jira may use a different custom field — contact dev team |
| Missing sprints | Ensure sprints are "closed" (active/future sprints may be filtered) |
| Authentication failed | Regenerate your API token |
| Rate limiting | The tool respects rate limits; large boards may take longer |

---

[Next: Tracking & Monitoring →](10-tracking-monitoring.md)
