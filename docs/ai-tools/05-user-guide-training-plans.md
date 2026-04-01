# Chapter 5: User Guide — Training Plans

[Back to Table of Contents](README.md) | [Previous: Assessments](04-user-guide-assessments.md)

---

## What Are Training Plans?

Training plans are **role-customized AI training recommendations** generated for each team member. The tool analyzes what each person does (based on their role) and recommends specific AI tools and training modules.

This is the core of our philosophy: **every role gets the right tools.**

## Generating Training Plans

1. On the engagement detail page, click **"Training Plan"** on the team card
2. Click **"Generate Plans"**
3. The system creates one plan per team member, based on their role

Plans are generated from the built-in training catalog. Future versions will also use Jira activity data to further customize.

## Understanding the Training Plan

Each plan card shows:

### Recommended Tools
AI tools appropriate for the role. Examples:

| Role | Tools |
|------|-------|
| Developer | GitHub Copilot, Cursor, CodeRabbit |
| QA/Tester | Testim, Mabl, Applitools |
| Scrum Master | Jira AI, Miro AI, ChatGPT |
| Product Owner | ChatGPT, Claude, Jira AI |
| DevOps | GitHub Copilot, PagerDuty AI |

### Training Modules
Specific training sessions with:
- **Module name** — What the training covers
- **Duration** — Hours needed
- **Priority** — High (red), Medium (amber), Low (gray)

High-priority modules are the most impactful for the role and should be delivered first.

## Training Catalog by Role

### Developers
| Module | Duration | Tools |
|--------|----------|-------|
| AI Pair Programming | 4h | GitHub Copilot, Cursor |
| AI-Assisted Code Review | 2h | GitHub Copilot, CodeRabbit |
| AI Test Generation | 3h | GitHub Copilot, Diffblue |
| Prompt Engineering for Developers | 2h | ChatGPT, Claude |

### QA/Testers
| Module | Duration | Tools |
|--------|----------|-------|
| AI-Powered Test Automation | 4h | Testim, Mabl, GitHub Copilot |
| AI Regression Testing | 2h | Testim, Applitools |
| AI Bug Report Analysis | 2h | ChatGPT, Claude |

### Scrum Masters
| Module | Duration | Tools |
|--------|----------|-------|
| AI Sprint Analytics | 3h | ChatGPT, Claude, Jira AI |
| AI-Facilitated Retrospectives | 2h | Miro AI, ChatGPT |
| Predictive Velocity Modeling | 2h | ChatGPT, Claude |

### Product Owners
| Module | Duration | Tools |
|--------|----------|-------|
| AI Backlog Management | 3h | Jira AI, ChatGPT, Claude |
| AI User Story Refinement | 2h | ChatGPT, Claude |
| AI Stakeholder Report Generation | 2h | ChatGPT, Claude |

### DevOps Engineers
| Module | Duration | Tools |
|--------|----------|-------|
| AI Infrastructure Management | 3h | GitHub Copilot, ChatGPT |
| AI-Assisted Incident Response | 3h | ChatGPT, Claude, PagerDuty AI |
| AI Pipeline Optimization | 2h | GitHub Copilot, ChatGPT |

## Plan Status Tracking

| Status | Meaning |
|--------|---------|
| **Proposed** | Generated, not yet approved by client/consultant |
| **Approved** | Client agreed to this training plan |
| **In Progress** | Training is being delivered |
| **Completed** | All modules in this plan have been delivered |

Update plan status via the API as training progresses.

## Customizing Plans

You can adjust plans through the API:
- Add or remove recommended tools
- Change training module priorities
- Add custom training modules specific to the client

```
PATCH /api/training-plans/{id}
```

---

[Next: User Guide: Reports →](06-user-guide-reports.md)
