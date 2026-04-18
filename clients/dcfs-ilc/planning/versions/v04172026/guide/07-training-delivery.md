---
title: "Training Delivery"
description: "6 role-based training tracks with content, delivery methods, and materials"
---

# Chapter 7: Training Delivery Plan

## Purpose

This chapter defines how we train the two pilot teams — approximately 25-30 people — to use GitHub Copilot and Atlassian Rovo effectively within their daily SDLC processes on Illinois Connect. Training is the bridge between tool availability and actual productivity gain. Without structured, role-specific, hands-on training grounded in real ILC work, the tools become expensive shelf-ware.

Every session in this plan ends with participants doing real work on real ILC stories, defects, or code — not hypothetical exercises.

---

## 7.1 Training Philosophy & Principles

**Hands-on over lecture.** No session is more than 20% presentation. The remaining 80% is guided practice and independent work using actual ILC artifacts.

**Role-relevant, not generic.** A BA learning to draft acceptance criteria with Rovo needs different training than a developer learning to generate Dynamics 365 X++ with Copilot. Each role gets a dedicated track with SDLC processes specific to their daily work.

**Guardrails first.** Every participant understands the State of Illinois DoIT AI Policy boundaries before touching a tool. This is not optional — it is the first thing taught in the Foundation session.

**Augmenting, not replacing.** AI tools augment human judgment. Every output requires human review. This principle is reinforced in every session, not just stated once.

**Real artifacts, real feedback loops.** Exercises use actual ILC user stories, test cases, and codebase modules. Participants leave training having already produced work product with the tools.

**Measure what matters.** Training completion is necessary but insufficient. We measure whether participants can independently apply what they learned within one week of training.

---

## 7.2 Pre-Requisites

Before any training session begins, the following must be in place for all pilot team participants:

### Tool Access
- [ ] GitHub Copilot licenses provisioned and verified working in VS Code / Visual Studio
- [ ] Atlassian Rovo enabled on the pilot teams' JIRA boards
- [ ] Participants have confirmed they can access both tools from their workstations
- [ ] VPN / network access verified (State of Illinois network restrictions cleared)

### Guardrails Understanding
- [ ] All participants have received and acknowledged the DoIT AI Policy summary (one-page version)
- [ ] Guardrails cheat sheet distributed at least 24 hours before Foundation session
- [ ] Pilot team leads have confirmed their team members' participation

### Environment
- [ ] Training environment identified — Teams meeting with screen sharing for remote, conference room with projector for in-person
- [ ] Sample ILC stories and code modules selected and verified accessible to all participants
- [ ] Trainer has admin access to both Copilot and Rovo dashboards to troubleshoot during sessions

---

## 7.3 Training Schedule Overview

Training follows a deliberate sequence: Foundation first (everyone together), then role-specific tracks in parallel, then leadership last (informed by what pilot teams experienced).

```
Week 1
├── Day 1: Foundation Session (all pilot participants)        — 1.5h
├── Day 2: BA Track + Developer Track (parallel)              — 3h each
├── Day 3: Tester Track + Scrum Master Track (parallel)       — 3h / 2h
└── Day 4: Buffer day for makeup sessions

Week 2
├── Day 1: Leadership Briefing                                — 1h
└── Days 2-5: Post-training support begins (office hours, Teams channel)
```

**Total training time per person:**
- BAs: 4.5 hours (Foundation + BA Track)
- Testers: 4.5 hours (Foundation + Tester Track)
- Developers: 4.5 hours (Foundation + Developer Track)
- Scrum Masters/Leads: 3.5 hours (Foundation + SM Track)
- Leadership: 1 hour (Leadership Briefing only)

---

## 7.4 Training Tracks

---

### Track 1: Foundation

| | |
|---|---|
| **Audience** | All pilot team participants (BAs, Testers, Developers, Scrum Masters) |
| **Duration** | 1.5 hours |
| **Delivery Format** | Live workshop (remote via Teams or in-person) |
| **Tools Covered** | GitHub Copilot overview, Atlassian Rovo overview |

#### Learning Objectives

1. Articulate the purpose of the AI pilot and how it connects to ILC program goals
2. Identify which tool applies to which SDLC processes (Copilot for code, Rovo for JIRA-based work)
3. Explain the three non-negotiable guardrails: no PII in prompts, no autonomous code deployment, human review on all outputs
4. Demonstrate basic prompt structure (context + instruction + constraints) in both tools
5. Know where to get help during the pilot (Teams channel, office hours, escalation path)

#### Session Outline

| Time | Activity | Format |
|------|----------|--------|
| 0:00 - 0:10 | Welcome & pilot overview — why we're doing this, what success looks like, the 5% productivity target | Presentation |
| 0:10 - 0:25 | DoIT AI Policy walkthrough — what's allowed, what's prohibited, consequences of violations | Presentation + Q&A |
| 0:25 - 0:40 | Tool landscape — Copilot capabilities, Rovo capabilities, which roles use which tool | Live demo |
| 0:40 - 0:55 | Prompting fundamentals — anatomy of a good prompt, context setting, iterative refinement | Live demo with audience participation |
| 0:55 - 1:10 | Guided exercise — everyone writes 3 prompts (one per category: summarize, generate, review) using a sample ILC story | Hands-on (individual) |
| 1:10 - 1:20 | Share-out — 3-4 participants show their prompts and outputs, group discusses quality | Group discussion |
| 1:20 - 1:30 | Q&A, logistics for role tracks, Teams channel introduction | Open discussion |

#### Materials Needed

- DoIT AI Policy one-page summary
- Guardrails cheat sheet
- Sample ILC user story (pre-selected, non-sensitive)
- Slide deck (10 slides maximum)
- Teams channel link and office hours schedule

#### Success Criteria

- 100% of pilot participants attend (or complete makeup session within 48 hours)
- Every participant can state the three guardrails without reference
- Every participant has written at least one prompt and reviewed an AI-generated output
- Post-session survey: 80%+ report feeling "ready to learn more in role track"

---

### Track 2: BA Track

| | |
|---|---|
| **Audience** | Business Analysts on pilot teams (approximately 4-6 people) |
| **Duration** | 3 hours |
| **Delivery Format** | Live workshop with hands-on lab |
| **Primary Tool** | Atlassian Rovo (JIRA AI) |
| **Secondary Tool** | GitHub Copilot Chat (for documentation tasks) |

#### Learning Objectives

1. Use Rovo to draft user stories with acceptance criteria from stakeholder notes or meeting transcripts
2. Use Rovo to analyze an existing epic and identify gaps in story coverage
3. Use Rovo to generate BDD-style acceptance criteria (Given/When/Then) for ILC Dynamics 365 workflows
4. Apply the guardrails to BA-specific SDLC processes — recognizing when story content contains PII-adjacent data
5. Evaluate and refine AI-generated story content to meet ILC quality standards

#### Session Outline

| Time | Activity | Format |
|------|----------|--------|
| 0:00 - 0:15 | BA-specific SDLC processes overview — where AI fits in requirements, story writing, refinement | Presentation |
| 0:15 - 0:45 | Demo: Drafting a user story with Rovo — from raw stakeholder notes to structured story with AC | Live demo + discussion |
| 0:45 - 1:15 | **Lab 1:** Participants draft 2 user stories from provided ILC stakeholder notes using Rovo. Trainer circulates. | Hands-on (individual) |
| 1:15 - 1:30 | Review Lab 1 outputs — compare AI-generated stories to manually written ones, identify gaps | Group review |
| 1:30 - 1:45 | Break | |
| 1:45 - 2:00 | Demo: Epic analysis — using Rovo to scan an existing ILC epic for missing stories, duplicate coverage, inconsistent AC | Live demo |
| 2:00 - 2:30 | **Lab 2:** Participants analyze a real ILC epic (pre-selected) using Rovo, document findings | Hands-on (pairs) |
| 2:30 - 2:45 | Demo: Generating BDD acceptance criteria — Rovo prompts for Given/When/Then format specific to Dynamics 365 case management workflows | Live demo |
| 2:45 - 3:00 | **Lab 3:** Participants convert 3 existing ILC stories' AC to BDD format using Rovo. Debrief and Q&A. | Hands-on (individual) + group debrief |

#### Materials Needed

- 2 sets of sample ILC stakeholder notes (sanitized of PII)
- 1 real ILC epic with 8-10 stories for analysis exercise
- 3 ILC stories with traditional AC (for BDD conversion exercise)
- BA prompt library (Rovo-specific) — printed and digital
- "Before/After" examples: manually written AC vs. AI-augmented AC

#### Success Criteria

- Each BA produces at least 2 stories that meet ILC quality standards (reviewed by trainer)
- Each BA can demonstrate iterative prompt refinement (not just accepting first output)
- Each BA identifies at least 1 PII/guardrail concern in an exercise scenario
- Post-session: BAs commit to using Rovo on at least 3 real stories in Sprint 1 of the pilot

---

### Track 3: Tester Track

| | |
|---|---|
| **Audience** | Testers/QA on pilot teams (approximately 4-6 people) |
| **Duration** | 3 hours |
| **Delivery Format** | Live workshop with hands-on lab |
| **Primary Tool** | Atlassian Rovo (JIRA AI) |
| **Secondary Tool** | GitHub Copilot (for test script augmentation) |

#### Learning Objectives

1. Use Rovo to generate test cases from ILC user stories and acceptance criteria
2. Use Rovo to identify edge cases and negative test scenarios for Dynamics 365 workflows
3. Use Copilot to augment test script scaffolding (where applicable to ILC test automation)
4. Apply guardrails to testing SDLC processes — handling test data that mirrors production PII patterns
5. Critically evaluate AI-generated test cases for completeness against ILC business rules

#### Session Outline

| Time | Activity | Format |
|------|----------|--------|
| 0:00 - 0:15 | Testing SDLC processes overview — where AI augments test planning, case creation, defect analysis | Presentation |
| 0:15 - 0:45 | Demo: Generating test cases from a user story — using Rovo to produce functional, edge case, and negative tests for an ILC case management story | Live demo + discussion |
| 0:45 - 1:15 | **Lab 1:** Participants generate test cases for 2 ILC user stories using Rovo. Compare AI output to existing manually written test cases. | Hands-on (individual) |
| 1:15 - 1:30 | Review Lab 1 — what did AI catch that humans missed? What did AI miss that humans caught? | Group review |
| 1:30 - 1:45 | Break | |
| 1:45 - 2:15 | Demo: Defect analysis — using Rovo to summarize defect clusters from JIRA, identify patterns across ILC sprints | Live demo |
| 2:15 - 2:45 | **Lab 2:** Participants analyze a set of ILC defects (pre-selected sprint) using Rovo, produce a defect trend summary and recommended regression focus areas | Hands-on (pairs) |
| 2:45 - 3:00 | Demo + discussion: Copilot for test automation — generating test script scaffolding, limitations, when to use vs. when not to. Q&A and debrief. | Live demo + open discussion |

#### Materials Needed

- 2 ILC user stories with AC (for test case generation)
- Existing manually written test cases for comparison
- 1 sprint's worth of ILC defects in JIRA (sanitized, 15-20 defects)
- Tester prompt library (Rovo-specific + Copilot test scenarios)
- Test case quality checklist (ILC-specific)

#### Success Criteria

- Each tester generates test cases that cover at least functional, negative, and edge case categories
- Each tester can articulate what AI-generated test cases miss (business context, integration dependencies)
- Each tester produces a defect analysis summary deemed useful by their Scrum Master
- Post-session: Testers commit to using Rovo for test case generation on at least 2 stories in Sprint 1

---

### Track 4: Developer Track

| | |
|---|---|
| **Audience** | Developers on pilot teams (approximately 8-12 people) |
| **Duration** | 3 hours |
| **Delivery Format** | Live workshop with hands-on coding lab |
| **Primary Tool** | GitHub Copilot (inline suggestions + Chat) |
| **Secondary Tool** | None (developers do not use Rovo for code tasks) |

#### Learning Objectives

1. Use Copilot inline suggestions effectively for Dynamics 365 X++ and C# code within the ILC codebase
2. Use Copilot Chat to explain unfamiliar ILC code modules, generate unit test scaffolding, and refactor existing code
3. Apply the guardrails to development SDLC processes — no PII in prompts, review all suggestions before accepting, no autonomous deployment
4. Recognize when Copilot suggestions are wrong or subtly incorrect (hallucinated APIs, incorrect Dynamics 365 patterns)
5. Configure Copilot workspace settings for optimal ILC development workflow

#### Session Outline

| Time | Activity | Format |
|------|----------|--------|
| 0:00 - 0:10 | Developer-specific SDLC processes — where Copilot fits in coding, code review, debugging, documentation | Presentation |
| 0:10 - 0:30 | Demo: Copilot inline suggestions — writing X++ for an ILC case management module, accepting/rejecting/modifying suggestions | Live coding demo |
| 0:30 - 0:50 | Demo: Copilot Chat — explaining an existing ILC module, asking for refactoring suggestions, generating XML documentation comments | Live coding demo |
| 0:50 - 1:20 | **Lab 1:** Participants implement a small feature using Copilot on a pre-selected ILC code module. Track accept/reject ratio. | Hands-on coding (individual) |
| 1:20 - 1:35 | Break | |
| 1:35 - 1:55 | Demo: Unit test generation — using Copilot to scaffold tests for ILC business logic, reviewing for correctness | Live coding demo |
| 1:55 - 2:25 | **Lab 2:** Participants generate unit tests for an existing ILC module using Copilot. Evaluate: do the tests actually test the right things? | Hands-on coding (individual) |
| 2:25 - 2:45 | Demo: Common pitfalls — Copilot suggesting deprecated Dynamics 365 APIs, generating plausible-but-wrong business logic, handling large file context limits | Live demo + discussion |
| 2:45 - 3:00 | **Lab 3 (mini):** Participants use Copilot Chat to explain a complex ILC module they're unfamiliar with, then verify accuracy. Debrief. | Hands-on + group discussion |

#### Materials Needed

- Pre-selected ILC code module for Lab 1 (low-complexity, well-defined feature)
- Pre-selected ILC module with existing business logic for Lab 2 (unit test target)
- Complex ILC module for Lab 3 (code explanation exercise)
- Developer prompt library (Copilot-specific — inline and Chat)
- VS Code / Visual Studio Copilot configuration guide
- "Before/After" examples: manual code vs. Copilot-augmented code (same feature)

#### Success Criteria

- Each developer completes Lab 1 with a working implementation that passes review
- Each developer can identify at least 1 incorrect Copilot suggestion and explain why it's wrong
- Each developer demonstrates the accept-review-modify workflow (not blind acceptance)
- Post-session: Developers commit to using Copilot on at least 2 real development tasks in Sprint 1

---

### Track 5: Scrum Master Track

| | |
|---|---|
| **Audience** | Scrum Masters and Team Leads on pilot teams (approximately 2-4 people) |
| **Duration** | 2 hours |
| **Delivery Format** | Live workshop with facilitated discussion |
| **Tools Covered** | Rovo (for sprint analytics and retrospective insights), Copilot awareness (to coach team members) |

#### Learning Objectives

1. Use Rovo to generate sprint health summaries, velocity trend analysis, and impediment patterns from JIRA data
2. Identify and address adoption resistance patterns — coaching techniques for team members who are hesitant
3. Understand the measurement framework well enough to explain metrics and their purpose to team members
4. Recognize guardrail violations and know the escalation process
5. Facilitate AI-augmented retrospectives that capture both productivity data and team sentiment

#### Session Outline

| Time | Activity | Format |
|------|----------|--------|
| 0:00 - 0:10 | SM role in the pilot — you're the adoption driver, the guardrail enforcer, and the feedback conduit | Presentation |
| 0:10 - 0:30 | Demo: Rovo for sprint analytics — generating velocity summaries, identifying bottleneck stories, comparing pilot vs. control team patterns | Live demo |
| 0:30 - 0:50 | **Lab 1:** Participants use Rovo to analyze their most recent sprint data and produce a sprint health summary | Hands-on (individual) |
| 0:50 - 1:10 | Coaching techniques — handling "I don't trust AI" resistance, the "it's faster to do it myself" objection, maintaining team morale during the learning curve | Facilitated discussion |
| 1:10 - 1:30 | Measurement framework walkthrough — what metrics we're tracking, what the dashboard shows, how to interpret data without creating pressure | Presentation + Q&A |
| 1:30 - 1:50 | **Lab 2:** Participants draft their Sprint 1 retrospective plan — incorporating AI adoption questions, identifying what data to capture, planning the feedback loop | Hands-on (pairs) |
| 1:50 - 2:00 | Guardrail enforcement, escalation process, and Q&A | Open discussion |

#### Materials Needed

- Recent sprint data from pilot teams in JIRA (velocity, story completion, defect counts)
- SM prompt library (Rovo-specific — sprint analysis, retrospective prompts)
- Measurement framework summary (one-page reference)
- Coaching scenarios handout (3-4 common resistance patterns with suggested responses)
- Escalation process flowchart (guardrail violation reporting)

#### Success Criteria

- Each SM produces a sprint health summary that surfaces actionable insights (not just raw data)
- Each SM has a documented Sprint 1 retrospective plan that includes AI adoption feedback
- Each SM can explain the measurement framework to a team member in plain language
- Each SM can identify a guardrail violation scenario and describe the correct escalation

---

### Track 6: Leadership Briefing

| | |
|---|---|
| **Audience** | Jim Daugherty (CIO), John (ADM), Product Owners |
| **Duration** | 1 hour |
| **Delivery Format** | Executive briefing with live demonstration |
| **Tools Covered** | Both (overview level — leadership does not need hands-on proficiency) |

#### Learning Objectives

1. Understand the pilot structure, timeline, and what "success" means quantitatively (5% productivity target)
2. See a live demonstration of both tools applied to real ILC work (not slides about tools)
3. Understand the guardrail framework and how compliance is enforced
4. Know what decisions will be needed from leadership at the end of the pilot (scale, modify, or stop)
5. Understand the measurement framework and how to interpret the dashboard

#### Session Outline

| Time | Activity | Format |
|------|----------|--------|
| 0:00 - 0:05 | Pilot status and training completion summary | Presentation |
| 0:05 - 0:20 | Live demo: A BA drafting a story with Rovo, a developer completing a feature with Copilot — real ILC artifacts, real time | Live demonstration |
| 0:20 - 0:30 | Measurement framework and dashboard walkthrough — what the numbers mean, how to read trends | Dashboard walkthrough |
| 0:30 - 0:40 | Guardrails and compliance — what's enforced, what's been observed so far, risk posture | Presentation |
| 0:40 - 0:50 | Decision framework — what data we'll present at pilot end, what options are on the table (scale to all 12 teams, modify approach, discontinue) | Discussion |
| 0:50 - 1:00 | Q&A | Open discussion |

#### Materials Needed

- Executive summary deck (5 slides maximum)
- Live demo environment with pre-staged ILC artifacts (story for BA demo, code module for developer demo)
- Dashboard access (or screenshots if access is restricted)
- Decision framework one-pager (criteria for scale/modify/stop)

#### Success Criteria

- Leadership can articulate the pilot's purpose and success criteria in their own words
- Leadership has seen the tools working on real ILC artifacts (not hypothetical demos)
- Leadership understands the decision they'll be asked to make and when
- No unresolved concerns about guardrails or compliance

---

## 7.5 Materials Inventory

The following materials must be created and reviewed before training begins. Each item has an owner and a target completion date relative to training start (T-minus days).

### Prompt Libraries (T-7 days)

| Library | Tool | Audience | Contents |
|---------|------|----------|----------|
| BA Prompt Library | Rovo | BAs | 15-20 prompts: story drafting, AC generation (BDD), epic analysis, stakeholder note summarization, requirements gap identification |
| Tester Prompt Library | Rovo + Copilot | Testers | 15-20 prompts: test case generation from AC, edge case identification, defect pattern analysis, test script scaffolding |
| Developer Prompt Library | Copilot | Developers | 15-20 prompts: X++/C# code generation, code explanation, unit test generation, refactoring suggestions, documentation comments |
| SM Prompt Library | Rovo | Scrum Masters | 10-15 prompts: sprint health summary, velocity analysis, impediment identification, retrospective question generation |

Each prompt library includes:
- The prompt text
- Expected output format
- When to use it (which SDLC process)
- Common modifications for different scenarios
- What to watch for in the output (known failure modes)

### Example Outputs (T-5 days)

| Example | Description |
|---------|-------------|
| Story Before/After | Same ILC story written manually vs. augmented with Rovo — annotated differences |
| Test Case Before/After | Same test cases written manually vs. generated with Rovo — coverage comparison |
| Code Before/After | Same ILC feature implemented manually vs. with Copilot — time and quality comparison |
| Sprint Summary Before/After | Sprint report written manually vs. generated with Rovo — insight quality comparison |

### Reference Cards (T-7 days)

| Card | Format | Description |
|------|--------|-------------|
| Guardrails Cheat Sheet | Laminated card / PDF | Three rules, examples of violations, escalation contact. Fits on one page. |
| Do/Don't Reference Card | Laminated card / PDF | Two columns per role: what to use AI for, what NOT to use AI for. Role-specific. |
| Quick Start Guide — Copilot | PDF | Setup verification, basic commands, keyboard shortcuts, ILC-specific tips. 2 pages max. |
| Quick Start Guide — Rovo | PDF | Accessing Rovo in JIRA, basic commands, ILC board-specific tips. 2 pages max. |

### Hands-On Exercise Materials (T-3 days)

| Material | Source | Preparation Needed |
|----------|--------|-------------------|
| Sample ILC stakeholder notes (2 sets) | Actual ILC documentation | Sanitize PII, verify accessibility |
| ILC epic with 8-10 stories | JIRA | Select appropriate epic, verify all stories visible to participants |
| 3 ILC stories with traditional AC | JIRA | Select stories suitable for BDD conversion |
| 2 ILC user stories for test case generation | JIRA | Select stories with clear, testable AC |
| 1 sprint of ILC defects (15-20) | JIRA | Select representative sprint, sanitize if needed |
| ILC code module for Lab 1 (feature implementation) | Git repo | Select low-complexity module, create branch, write exercise instructions |
| ILC code module for Lab 2 (unit test target) | Git repo | Select module with business logic, verify Copilot can access it |
| Complex ILC module for Lab 3 (code explanation) | Git repo | Select module unfamiliar to most developers |

---

## 7.6 Delivery Options

Not every session must be live instructor-led. This flexibility matrix defines what options are available and when each is appropriate.

| Delivery Mode | Best For | Limitations | Tracks Where Applicable |
|---------------|----------|-------------|------------------------|
| **Live Instructor-Led (Remote)** | Foundation, initial role tracks, complex topics | Requires scheduling coordination, trainer availability | All tracks — primary mode |
| **Live Instructor-Led (In-Person)** | Developer track (screen sharing awkward for coding), leadership briefing | Requires travel, room booking | Developer, Leadership |
| **Recorded Session** | Makeup sessions for absent participants, reference/review | No interaction, no real-time Q&A, no hands-on coaching | Foundation (recording of live), role track demos only |
| **Train-the-Trainer** | Scaling to remaining 10 teams after pilot | Requires identifying and preparing internal trainers (SMs are candidates) | All tracks during scale phase |
| **Self-Paced with Prompt Library** | Post-training reinforcement, new team member onboarding | No immediate feedback, requires discipline | Supplementary to any track — not a replacement for initial training |
| **AI-Generated Materials** | Prompt library updates, reference card revisions | Must be reviewed by human trainer before distribution | Materials creation only — not session delivery |

### Recommended Delivery Plan

| Phase | Mode | Notes |
|-------|------|-------|
| Pilot training (2 teams) | Live instructor-led | All sessions delivered live by Krasan AI Transformation team |
| Makeup sessions | Recorded + 1:1 follow-up | Recording from live session + 30-min 1:1 with trainer to cover hands-on labs |
| Scale to 10 teams | Train-the-trainer | Pilot team SMs become trainers, supported by Krasan team. Prompt libraries and materials provided. |
| Ongoing onboarding | Self-paced + office hours | New team members use materials + attend weekly office hours |

---

## 7.7 Post-Training Support

Training is Day 1. The real learning happens in Weeks 1-4 when participants apply the tools to actual sprint work.

### Office Hours

| Schedule | Duration | Format | Audience |
|----------|----------|--------|----------|
| Tuesdays 2:00-3:00 PM CT | 1 hour | Drop-in Teams call | All pilot participants |
| Thursdays 10:00-11:00 AM CT | 1 hour | Drop-in Teams call | All pilot participants |

Office hours run for the duration of the pilot (8 weeks minimum). No appointment needed. Trainer is available to screen share, troubleshoot, and demonstrate specific SDLC processes.

### Teams Channel: `#ilc-ai-pilot`

Dedicated channel for pilot participants. Used for:
- **Quick questions** — "How do I prompt Rovo to generate BDD AC for a batch processing story?"
- **Sharing wins** — "Copilot saved me 30 minutes on this unit test scaffolding"
- **Reporting issues** — "Copilot suggested a deprecated API again"
- **Weekly tips** — Trainer posts 1 tip per week, role-specific, based on observed usage patterns

Channel is monitored by the Krasan AI Transformation team. Response SLA: same business day.

### Weekly Tips Schedule

| Week | Topic | Target Roles |
|------|-------|--------------|
| Week 1 | "Iterating on prompts — why your second prompt matters more than your first" | All |
| Week 2 | "Context is king — how to set up Copilot/Rovo context for ILC-specific outputs" | Developers, BAs |
| Week 3 | "Reviewing AI outputs — a 60-second checklist before you accept" | All |
| Week 4 | "Advanced prompting — chaining prompts for complex SDLC processes" | BAs, Testers |
| Week 5 | "What NOT to ask AI — recognizing tasks where manual is faster" | All |
| Week 6 | "Sharing prompt templates across the team — building your team's library" | Scrum Masters |
| Week 7 | "Measuring your own improvement — how to self-assess productivity gains" | All |
| Week 8 | "Preparing for scale — what worked, what to change for the next 10 teams" | Scrum Masters, Leads |

### Escalation Path

| Issue | First Contact | Escalation |
|-------|---------------|------------|
| Tool not working (access, errors) | Teams channel | Krasan AI Transformation Lead |
| Guardrail violation observed | Scrum Master | Krasan AI Transformation Lead, then Jim/John |
| AI output quality concern | Office hours | Prompt library update (within 48 hours) |
| Training content gap | Teams channel | Supplemental mini-session scheduled within 1 week |

---

## 7.8 Training Completion Tracking

### Completion Verification

Training attendance alone does not equal training completion. Each participant must meet all three criteria:

| Criteria | How Verified | Tracked By |
|----------|-------------|------------|
| **Attended session** (or completed makeup) | Attendance log from Teams/in-person sign-in | Trainer |
| **Completed all hands-on labs** | Lab outputs reviewed by trainer during session | Trainer |
| **Demonstrated independent use within 7 days** | SM confirms participant used tool on at least 1 real story/task in Sprint 1 | Scrum Master |

### Completion Dashboard

The following is tracked per participant and reported to leadership weekly during the pilot:

| Metric | Target | Data Source |
|--------|--------|-------------|
| Foundation completion rate | 100% of pilot team members | Attendance log |
| Role track completion rate | 100% of pilot team members | Attendance log |
| 7-day independent use rate | 90%+ of trained participants | SM confirmation |
| Office hours attendance (first 2 weeks) | At least 1 visit per participant | Teams call log |
| Teams channel engagement (first 2 weeks) | At least 1 post or reply per participant | Channel analytics |

### Training Effectiveness Measurement

Beyond completion, we measure whether training actually changed behavior:

| Indicator | Measurement Method | Timeline |
|-----------|-------------------|----------|
| **Tool adoption rate** | % of trained participants actively using tools in Sprint 1 | End of Sprint 1 |
| **Prompt quality improvement** | Trainer reviews sample prompts from Week 1 vs. Week 4 — are they more specific, better structured? | Week 4 |
| **Self-reported confidence** | Survey: "On a scale of 1-5, how confident are you using [tool] in your daily work?" | Post-training, Week 4, Week 8 |
| **Help request trend** | Are office hours / Teams questions decreasing over time? Shifting from basic to advanced? | Weekly |
| **Output quality** | Sample review of AI-augmented artifacts (stories, test cases, code) vs. baseline quality | Sprint 2 onward |
| **Time-to-productivity** | How many sprints until a trained participant stops needing extra support? | Sprint 3 target |

### Remediation Process

If a participant is not demonstrating independent use by end of Sprint 1:

1. SM has a 1:1 conversation to understand blockers (tool issues? confidence? workload?)
2. If tool/skill issue: schedule 30-minute 1:1 coaching session with trainer
3. If resistance/preference: document and escalate to Krasan AI Transformation Lead for coaching approach
4. If workload: work with SM to identify 1 low-pressure task where AI can be tried without sprint risk

No participant is penalized for slow adoption. The goal is to understand WHY and remove barriers — not to force compliance.

---

## Summary

| Track | Audience | Duration | Primary Tool | Key Deliverable |
|-------|----------|----------|-------------|-----------------|
| Foundation | All pilot participants | 1.5h | Both (overview) | Guardrails understanding, basic prompting |
| BA Track | Business Analysts | 3h | Rovo | AI-augmented user stories with BDD AC |
| Tester Track | Testers/QA | 3h | Rovo + Copilot | AI-generated test cases and defect analysis |
| Developer Track | Developers | 3h | Copilot | AI-augmented coding, unit tests, code review |
| Scrum Master Track | SMs/Leads | 2h | Rovo | Sprint analytics, adoption coaching plan |
| Leadership Briefing | CIO, ADM, POs | 1h | Both (demo) | Decision framework understanding |

**Total materials to create:** 4 prompt libraries, 4 before/after examples, 4 reference cards, 8 exercise datasets.

**Total training calendar:** 5 days of delivery + ongoing support for pilot duration.

**Success definition:** 90%+ of trained pilot participants independently using approved tools on real ILC work by end of Sprint 1.
