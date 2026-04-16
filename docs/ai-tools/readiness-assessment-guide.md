# AI Readiness Assessment — Usage Guide

> For USSP consultants running AI readiness assessments for clients.

---

## Overview

The AI Readiness Assessment tool evaluates an organization's readiness to adopt AI based on the **DORA 2025 AI Capabilities Model**. It collects company context, team details, and AI policy information, generates a custom questionnaire distributed via email, and produces a readiness report with tier assignment, blockers, and recommendations.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Readiness Tier** | Not Ready (< 2.0), Foundation Needed (2.0-2.9), Ready (3.0-3.9), Well Positioned (4.0-5.0) |
| **Capability** | One of 7 DORA capabilities or 4 AI policy areas scored 1-5 |
| **Blocker** | Any capability scoring below 3.0 — should be addressed before AI training |
| **Universal Question** | Goes to all team members regardless of role |
| **Role-Specific Question** | Only sent to members with matching roles |
| **Unmapped Role** | A custom role ("Other") with no role-specific questions yet — flagged for development |

---

## Workflow (6 Steps)

### Step 1: Company Profile (`/readiness/[id]/company`)

Enter the organization's details:

| Field | Required | Purpose |
|-------|----------|---------|
| Company Name | Yes | Report header, identification |
| Entity Type | Yes | Determines applicable regulations. State agencies get procurement/FOIA questions; universities get FERPA questions; regulated entities get HIPAA questions |
| Industry | No | Adds context to the report |
| State | No | Identifies state-level AI regulations (links to legal text) |
| Organization Size | No | Calibrates questionnaire complexity |
| Notes | No | Free-text context |

**Tip:** Entity type is the most impactful field — it shapes the entire questionnaire and regulatory analysis.

### Step 2: Team Setup (`/readiness/[id]/team`)

Define the team and add members:

**Team Info:**
- Team name, function (dev/QA/DevOps/data/mixed), methodology (Scrum/Kanban/SAFe/Waterfall)
- Objectives, pain points, AI hopes (included in report context)

**Members:**
- Add one by one or bulk import via CSV (`name, email, role`)
- 24 SDLC roles available: developer, QA, scrum master, product owner, DevOps, designer, business analyst, tech lead, architect, integration tester, performance tester, release manager, data analyst, data engineer, security engineer, UX researcher, technical writer, program/project/engineering manager, DBA, sysadmin, support engineer
- Select "Other" + custom label for unlisted roles — the system creates a development request for future question coverage
- Seniority (junior/mid/senior/lead/principal) is optional

**The role distribution summary** shows at a glance: "3 developers, 2 BAs, 1 SM, 1 PO"

### Step 3: AI Policy Intake (`/readiness/[id]/policy`)

Capture the organization's AI policy status:

1. **Has policy?** — Yes/No toggle. "No" = critical blocker in the report
2. **Coverage areas** (if yes) — check which of 5 areas the policy covers:
   - Data Privacy & Confidentiality
   - Code Ownership & IP
   - Approved AI Tools List
   - Prohibited Uses
   - Data Handling & Storage
3. **Notes** — governance committee details, review process, etc.

Uncovered areas appear as **policy gaps** in the report.

### Step 4: Generate Questionnaire (`/readiness/[id]/questionnaire`)

Click **Generate Questionnaire** to create a custom questionnaire:

- **Universal questions** (7 DORA capabilities + 4 AI policy areas) go to everyone
- **Role-specific questions** are added based on each member's role
- **Entity-type-specific questions** are added for government/university/regulated entities
- Questions are **version-pinned** — if a question is later revised, the report shows the exact wording respondents answered

**Customization:** Before distributing, you can:
- Remove individual questions
- See which roles each question targets (role badges)
- Regenerate to reset

**Unmapped roles:** If a member has "Other" as their role and no matching questions exist, a development request is created and visible in the Question Bank admin.

### Step 5: Distribute & Track (`/readiness/[id]/distribute`)

Click **Send All** to email questionnaires:

- Each member gets a unique tokenized link (no login required)
- Track responses in real-time: not started / in progress / completed
- Progress bar shows overall completion percentage
- **Send Reminder** button emails only non-respondents

**For respondents:** The questionnaire takes 5-10 minutes. They can:
- Score each question 1-5
- Add optional comments
- Flag questions as "unclear" or "not applicable to my role"
- Save progress and return later

### Step 6: View Report (`/readiness/[id]/report`)

The report includes:

| Section | Description |
|---------|-------------|
| **Readiness Tier** | Overall score with tier badge and color |
| **Capability Scores** | Bar chart per capability, with blocker flag for < 3.0 |
| **Blockers** | List of capabilities below 3.0 with remediation recommendations |
| **Policy Gaps** | Missing coverage areas in the AI policy |
| **Role-Based Perception** | How different roles scored the same capability (reveals misalignment) |
| **Re-assessment Comparison** | If prior assessment exists, shows per-capability deltas with trend arrows |

**Export:** Click "Print / PDF" to generate a clean, print-optimized PDF via browser print.

---

## Re-Assessments

From the assessment list, click **Re-assess** on a completed assessment to:
1. Create a new assessment pre-populated with the same company and team data
2. Update members/roles if team composition changed
3. Run a new questionnaire
4. The report automatically compares scores against the prior assessment

---

## Question Bank Management (`/readiness/questions`)

Accessible from the sidebar (admin only).

### Versioning
- Editing a question creates a **new version** — the old version is deprecated
- Historical reports always show the exact wording from the version used
- View the full version history for any question

### Feedback Loop
- Respondents can flag questions as "unclear" or "not applicable"
- Questions with > 25% flag rate (on 10+ responses) are auto-flagged for review
- Admin sees aggregate stats: times asked, avg score, unclear %, N/A %

### Development Requests
- When a team member has "Other" role with no matching questions, a development request is created
- Admin sees pending requests with the custom role label
- Create questions tagged to that role to resolve the request

---

## Environment Setup

| Env Variable | Required | Description |
|-------------|----------|-------------|
| `RESEND_API_KEY` | For email | Resend API key for sending questionnaire emails |
| `NEXT_PUBLIC_APP_URL` | For email links | Base URL for response links (default: https://tools.ussp.co) |
| `RESEND_FROM_EMAIL` | For email sender | From address (default: USSP AI Tools <noreply@ussp.co>) |

### Seeding the Question Bank

Run once after migration to populate default questions:

```bash
SITE_ID=ussp npx tsx scripts/seed-question-bank.ts
```

This creates 55+ v1 questions across DORA capabilities, AI policy, role-specific, entity-type, and workflow categories.

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `readiness_assessments` | Top-level assessment records |
| `assessment_companies` | Company profile per assessment |
| `assessment_teams` | Team details per assessment |
| `assessment_members` | Team member directory |
| `assessment_policies` | AI policy intake |
| `question_bank` | Versioned question bank (global + tenant) |
| `question_development_requests` | Unmapped role tracking |
| `assessment_questionnaires` | Generated questionnaire instances |
| `questionnaire_questions` | Questions in a questionnaire (version-pinned) |
| `questionnaire_responses` | Member responses (with token) |
| `response_answers` | Individual answers (score, comment, flag) |
| `question_feedback_stats` | Cached feedback aggregates |

All tables use `site_id` for multi-tenant isolation.
