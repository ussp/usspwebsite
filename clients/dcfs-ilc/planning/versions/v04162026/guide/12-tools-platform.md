---
title: "Tools Platform"
description: "tools.ussp.co user guide, dashboard configuration, and tooltips"
---

# Chapter 12: Tools Platform

## Purpose

The AI Transformation Monitor at **tools.ussp.co** is the platform that powers assessment tracking, training plans, measurement, and executive reporting. This chapter is the user guide for the platform as it applies to this engagement.

## Platform Overview

| Feature | What It Does | Who Uses It |
|---------|-------------|-------------|
| **Engagements** | Create and manage AI transformation engagements | AI Transformation Leader |
| **Assessments** | Baseline and post-training measurement (automated + survey) | AI Transformation Leader |
| **Training Plans** | Auto-generated role-specific training recommendations | AI Transformation Leader |
| **Reports** | Before/after comparison with DORA, SPACE, DevEx metrics | AI Transformation Leader, CIO |
| **Dashboard** | Real-time engagement status and improvement tracking | CIO, Engagement Director |

## Getting Started

1. Navigate to [tools.ussp.co](https://tools.ussp.co)
2. Log in with your Google or Microsoft account
3. Select the DCFS ILC engagement from the dashboard

## Workflow

```
Create Engagement → Add Teams → Baseline Assessment → Training Plan → Post-Training Assessment → View Report
```

### Step 1: Create Engagement

- Name: "DCFS Illinois Connect — AI Pilot"
- Client: DCFS / DeWitt
- Teams: Add pilot teams + control teams
- PI: Specify the PI start and end dates

### Step 2: Baseline Assessment

The platform supports two types of baseline data:

**Automated (JIRA Integration):**
- Connect JIRA instance
- Platform pulls velocity, cycle time, throughput, predictability, defect density
- Data covers last 3 completed sprints

**Manual (Surveys):**
- SPACE survey (5 dimensions, 1-5 scale)
- DevEx survey (3 dimensions, 1-5 scale)
- Distribute via platform-generated links
- Responses collected and scored automatically

**Timing:** Baseline assessment should cover 3-6 months of sprint data (minimum 3 sprints). Allow 2-4 weeks after training for the post-training assessment.

### Step 3: Training Plan

The platform auto-generates training recommendations based on:
- Team roles and composition
- Assessment results (skills gaps)
- Available tools (Copilot, Rovo)

**Customize** the auto-generated plan to match the 6-track training delivery plan in [Chapter 7](07-training-delivery.md).

### Step 4: Post-Training Assessment

After the pilot PI completes:
- Run the same automated JIRA pull (same metrics, new sprint data)
- Redistribute SPACE and DevEx surveys
- Platform computes before/after comparison automatically

### Step 5: View Report

The Transformation Report includes:
- **Overall improvement %** with benchmark context
- **DORA metrics** comparison (before/after)
- **Scrum metrics** (velocity, cycle time, throughput, predictability, bug escape rate)
- **SPACE radar chart** (5-axis: Satisfaction, Performance, Activity, Communication, Efficiency)
- **DevEx section** (Flow State, Feedback Loops, Cognitive Load)

**Weighting:** DORA 30%, Scrum 30%, SPACE 25%, DevEx 15%

## Leadership Dashboard

The executive-facing dashboard shows a simplified view:

| View | What It Shows |
|------|-------------|
| **Executive Summary** | 3-4 big numbers: overall improvement %, teams trained, stories processed with AI, velocity trend |
| **Team Comparison** | Pilot teams vs control teams, side by side |
| **Trend** | Sprint-over-sprint progress during pilot PI |
| **Compliance** | DoIT policy status (green/yellow/red) |

Access: Read-only URL shared with CIO. No login required for view-only access.

## Tooltips & Contextual Help

The platform includes tooltips for key concepts:

| Term | Tooltip |
|------|---------|
| DORA Metrics | "DevOps Research and Assessment — industry-standard delivery metrics" |
| SPACE | "Satisfaction, Performance, Activity, Communication, Efficiency — Microsoft Research framework" |
| Baseline | "Your team's performance before AI tools were introduced" |
| Improvement % | "Weighted average across all measured dimensions" |
| Cycle Time | "Average days from 'In Progress' to 'Done' for completed stories" |

## Troubleshooting

| Issue | Solution |
|-------|---------|
| JIRA data not loading | Check JIRA integration credentials; verify API access |
| Survey responses incomplete | Resend survey link; check spam folders; extend deadline |
| Report shows 0% improvement | Verify post-training data covers enough sprints (minimum 3) |
| Dashboard not updating | Refresh browser; check if assessment status is "Completed" |

## Platform Limitations

- The platform tracks and reports — it does not deliver training or create playbooks
- Survey distribution is via link sharing — no built-in email distribution
- JIRA integration requires API access (admin-level)
- Real-time dashboard updates depend on JIRA sync frequency

---

**Next:** [Chapter 13: Deployment](13-deployment.md) — How to set up the framework for a new engagement
