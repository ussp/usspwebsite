# Chapter 4: User Guide — Assessments

[Back to Table of Contents](README.md) | [Previous: Engagements](03-user-guide-engagements.md)

---

## What Is an Assessment?

An **assessment** is a measurement period — either **baseline** (before AI training) or **post-training** (after). Each team gets one of each. The tool compares the two to calculate improvement.

## Creating a Baseline Assessment

1. On the engagement detail page, click **"Baseline"** on the team card
2. Set the measurement window:

| Field | Description | Recommendation |
|-------|-------------|----------------|
| **Period Start** | When to start measuring | 3-6 months before training |
| **Period End** | When to stop measuring | Right before training begins |
| **Sprints Observed** | Number of sprints in this window | Minimum 3 for reliable averages |
| **Data Source** | How data is collected | "From Integration" if Jira/ADO connected |

3. Click **"Create Baseline Assessment"**

## Creating a Post-Training Assessment

1. Click **"Post-Training"** on the team card
2. Same form as baseline, but for the post-training period

### Important: The Ramp-Up Buffer

**Start your post-training measurement 2-4 weeks AFTER training ends.** This buffer lets the team internalize new tools and practices. Measuring too early captures the learning curve, not the improvement.

```
Training Ends → [2-4 week buffer] → Post-Training Period Starts → [3-6 sprints] → Period Ends
```

## Data Collection: Integration vs Manual

### Integration (Recommended)
When connected to Jira, Azure DevOps, or GitHub, the tool automatically pulls:
- **Scrum metrics**: Sprint velocity, cycle time, predictability, throughput, bug escape rate
- **DORA metrics**: Deployment frequency, lead time, change failure rate, MTTR

Click **"Sync Data"** to pull the latest data from your connected tool.

### Manual Entry
If no integration is available, you can manually enter metrics through the API:
```
POST /api/assessments/{id}/metrics
```
See the [API Reference](12-api-reference.md) for details.

## SPACE & DevEx Surveys

These are the **only manual data collection** — even with integrations.

### What Gets Surveyed

**SPACE Framework** (5 questions, 1-5 scale):

| Dimension | Question |
|-----------|----------|
| Satisfaction | "I am satisfied with my development tools and workflow" |
| Performance | "I consistently deliver high-quality work that meets sprint commitments" |
| Activity | "I complete a meaningful number of tasks each sprint" |
| Communication | "My team communicates effectively and reviews happen promptly" |
| Efficiency | "I spend most of my time on valuable work, not repetitive tasks" |

**DevEx Framework** (3 questions, 1-5 scale):

| Dimension | Question |
|-----------|----------|
| Flow State | "I have long uninterrupted blocks for focused work" |
| Feedback Loops | "I get fast feedback from CI/CD and code reviews" |
| Cognitive Load | "I spend significant time understanding complex systems" (inverted: 1=high load, 5=low load) |

### Conducting the Survey

1. Navigate to the team's survey page
2. For each team member, enter their responses on the 1-5 scale
3. Submit — responses are stored in `ai_metrics` linked to the assessment

### Survey Best Practices

- **Same respondents**: The same people should complete both baseline and post-training surveys
- **Anonymity**: Use anonymous identifiers if honest responses are a concern
- **No coaching**: Don't tell respondents what answers you want
- **Context-free**: Respondents should rate their experience, not compare to a previous answer

## Assessment Status

| Status | Meaning |
|--------|---------|
| **Draft** | Created but no data collected yet |
| **Collecting** | Data sync or survey in progress |
| **Completed** | All data collected, ready for report |

Mark the assessment as "completed" once all data (integration + survey) is collected.

---

[Next: User Guide: Training Plans →](05-user-guide-training-plans.md)
