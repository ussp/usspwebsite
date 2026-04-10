# Appendix D: Templates Collection

## Overview

This appendix provides ready-to-use templates for all recurring activities in the AI Transformation Framework. Each template is designed to be copied, filled in, and used as-is. Templates are referenced from their corresponding chapters throughout the guide.

---

## Template 1: AI Readiness Assessment — Condensed Version

> **Full version:** See [Chapter 4: Readiness Assessment](04-readiness-assessment.md) for the complete instrument with scoring methodology, distribution plan, and analysis procedures.

This condensed version is for quick reference when setting up the electronic survey form (Microsoft Forms or equivalent).

### Section A: Current AI Experience (5 questions, multiple choice)

```
A1. Have you used any AI-assisted development or productivity tools professionally?
    [ ] Yes, regularly (daily/weekly)
    [ ] Yes, occasionally (few times/month)
    [ ] Yes, but only briefly or in a trial
    [ ] No, but I have used AI tools personally
    [ ] No, I have not used AI tools

A2. Which AI tools have you used? (Select all)
    [ ] GitHub Copilot
    [ ] Atlassian Rovo / Atlassian Intelligence
    [ ] ChatGPT / GPT-4
    [ ] Google Gemini
    [ ] Claude (Anthropic)
    [ ] Other code completion tools
    [ ] Other AI productivity tools: ___________
    [ ] None

A3. In which SDLC processes have you applied AI tools? (Select all)
    [ ] Code writing/generation
    [ ] User stories / requirements
    [ ] Test case creation
    [ ] Code review / PR analysis
    [ ] Documentation
    [ ] Bug triage / defect analysis
    [ ] Sprint planning / estimation
    [ ] None

A4. How would you describe the outcome of your AI tool usage?
    [ ] Significantly improved productivity
    [ ] Somewhat improved productivity
    [ ] Neutral
    [ ] Made things slower or more complicated
    [ ] Not applicable

A5. Have you received formal AI tools training?
    [ ] Yes, comprehensive (multi-day / certification)
    [ ] Yes, introductory (workshop / webinar)
    [ ] Self-taught only
    [ ] No training
```

### Section B: Skills Self-Assessment (6 questions, 1-5 scale)

```
Scale: 1=No experience | 2=Aware but not practiced | 3=Can do with guidance
       4=Comfortable independently | 5=Could teach others

B1. Writing effective prompts for AI tools               [1] [2] [3] [4] [5]
B2. Reviewing AI-generated code for correctness/security [1] [2] [3] [4] [5]
B3. Using AI for user story writing / requirements        [1] [2] [3] [4] [5]
B4. Using AI for test case generation                     [1] [2] [3] [4] [5]
B5. Integrating AI output into existing SDLC workflows   [1] [2] [3] [4] [5]
B6. Identifying wrong/incomplete AI suggestions           [1] [2] [3] [4] [5]
```

### Section C: Process Readiness (5 questions, 1-5 scale)

```
Scale: 1=Strongly disagree | 2=Disagree | 3=Neutral | 4=Agree | 5=Strongly agree

C1. Our team has well-defined, documented SDLC processes  [1] [2] [3] [4] [5]
C2. Our team regularly reviews and improves workflows     [1] [2] [3] [4] [5]
C3. Our team has clear code review standards              [1] [2] [3] [4] [5]
C4. Our team can adopt new tools without disrupting work  [1] [2] [3] [4] [5]
C5. Our Scrum Master supports experimentation             [1] [2] [3] [4] [5]
```

### Section D: Attitudes & Concerns (6 questions, 4 Likert + 2 open)

```
Scale: 1=Strongly disagree | 2=Disagree | 3=Neutral | 4=Agree | 5=Strongly agree

D1. AI tools can meaningfully improve my work quality     [1] [2] [3] [4] [5]
D2. AI tools will augment my role, not replace it         [1] [2] [3] [4] [5]
D3. I am willing to invest time learning AI tools         [1] [2] [3] [4] [5]
D4. Structured AI adoption is better than ad-hoc          [1] [2] [3] [4] [5]

D5. What is your biggest concern about AI tool adoption?
    [Open text]

D6. What SDLC process could AI most improve for your team, and why?
    [Open text]
```

### Section E: Infrastructure Readiness (3 questions, team-level, completed by Scrum Master)

```
E1. GitHub Copilot access:  [ ] All members  [ ] Some  [ ] Requested  [ ] No  [ ] Unsure
E2. Atlassian Rovo access:  [ ] Enabled  [ ] Partial  [ ] Available  [ ] No  [ ] Unsure
E3. Constraints: (Select all)
    [ ] Network/firewall  [ ] Data policy  [ ] IDE/toolchain  [ ] Procurement
    [ ] No known constraints  [ ] Unsure
```

### Scoring Quick Reference

```
Skills Score:      Average of B1-B6
Process Score:     Average of C1-C5
Attitude Score:    Average of D1-D4
Team Readiness:    Skills (30%) + Process (30%) + Attitude (30%) + Infrastructure (10%)

Tiers: High (4.0-5.0) | Moderate (3.0-3.9) | Developing (2.0-2.9) | Low (1.0-1.9)
```

---

## Template 2: SPACE Survey

> **Reference:** Forsgren et al. (2021) -- see [Appendix C](appendix-c-research-citations.md), Citation 2.

**Audience:** All pilot and control team members
**Timing:** Pre-pilot (baseline), mid-pilot (Sprint 3 pulse), post-pilot
**Estimated completion time:** 3-5 minutes

```
SPACE Developer Experience Survey
==================================

Team: ___________________    Date: ___________    Role: [ ] BA  [ ] Tester  [ ] Dev  [ ] SM/Lead

Rate each statement on a scale of 1 to 5.
1 = Strongly disagree    2 = Disagree    3 = Neutral    4 = Agree    5 = Strongly agree

S - SATISFACTION
Q1. I am satisfied with my ability to do my job effectively
    using the tools and processes available to me.              [1] [2] [3] [4] [5]

P - PERFORMANCE
Q2. I am confident that the work I produce meets the quality
    standards expected by my team and stakeholders.             [1] [2] [3] [4] [5]

A - ACTIVITY
Q3. I feel that I am able to complete a meaningful amount
    of work during a typical sprint.                            [1] [2] [3] [4] [5]

C - COMMUNICATION & COLLABORATION
Q4. My team communicates effectively, and I have the
    information I need to do my work without unnecessary
    delays or blockers.                                         [1] [2] [3] [4] [5]

E - EFFICIENCY & FLOW
Q5. I am able to focus on my work without frequent
    context-switching, unnecessary meetings, or process
    friction slowing me down.                                   [1] [2] [3] [4] [5]
```

### Scoring

```
Individual SPACE Score:   Average of Q1-Q5
Team SPACE Score:         Average of all individual scores on the team
Per-Dimension Score:      Average of each question across all team members

Display: Radar chart with 5 axes (S, P, A, C, E)
Compare: Baseline shape (gray) vs. current shape (blue for pilot, dotted for control)
```

---

## Template 3: DevEx Survey

> **Reference:** Developer Experience research -- see [Appendix C](appendix-c-research-citations.md), Citation 2 (SPACE/DevEx).

**Audience:** All pilot and control team members
**Timing:** Pre-pilot (baseline) and post-pilot
**Estimated completion time:** 2-3 minutes

```
Developer Experience (DevEx) Survey
=====================================

Team: ___________________    Date: ___________    Role: [ ] BA  [ ] Tester  [ ] Dev  [ ] SM/Lead

Rate each statement on a scale of 1 to 5.
1 = Strongly disagree    2 = Disagree    3 = Neutral    4 = Agree    5 = Strongly agree

FLOW STATE
Q1. I regularly experience periods of deep, uninterrupted
    focus during my work where I can make meaningful progress
    on complex tasks.                                           [1] [2] [3] [4] [5]

FEEDBACK LOOPS
Q2. When I complete work (code, stories, test cases), I
    receive timely feedback that helps me improve and move
    forward without long waiting periods.                       [1] [2] [3] [4] [5]

COGNITIVE LOAD
Q3. The tools, processes, and systems I use are intuitive
    enough that I can focus on the problem I am solving
    rather than fighting the tools or processes themselves.     [1] [2] [3] [4] [5]
```

### Scoring

```
Individual DevEx Score:   Average of Q1-Q3
Team DevEx Score:         Average of all individual scores on the team
Per-Dimension Score:      Average of each question across all team members

Display: Radar chart with 3 axes (Flow State, Feedback Loops, Cognitive Load)
Compare: Baseline shape (gray) vs. current shape (blue)
```

---

## Template 4: Weekly Check-In Report

> **Reference:** Chapter 9, Section 9.7.1

**Audience:** Romi (Engagement Director), Vinay (AI Transformation Leader), pilot team Scrum Masters
**Cadence:** Weekly (updated each Friday)
**Format:** Shared document, not sent to CIO unless requested

```
Weekly Check-In Report
=======================

Week of: _______________              Sprint: _____ of 5
Report prepared by: ________________  Date: ___________

1. SPRINT METRICS SNAPSHOT
--------------------------
| Metric                  | Pilot Team 1 | Pilot Team 2 | Control Avg |
|-------------------------|-------------|-------------|-------------|
| Velocity (pts)          |             |             |             |
| Sprint completion %     |             |             |             |
| Cycle time (days, avg)  |             |             |             |
| Stories completed       |             |             |             |
| Defects found           |             |             |             |

2. AI ADOPTION OBSERVATIONS
----------------------------
What teams are actively using:


What teams are avoiding or underusing:


Notable examples of effective AI use this week:


3. BLOCKERS & RISKS
---------------------
| Blocker/Risk | Impact | Owner | Target Resolution |
|-------------|--------|-------|-------------------|
|             |        |       |                   |
|             |        |       |                   |

4. ACTION ITEMS
-----------------
| Action | Owner | Due | Status |
|--------|-------|-----|--------|
|        |       |     |        |
|        |       |     |        |

Carryover from last week:


5. QUALITATIVE FEEDBACK FROM TEAM LEADS
-----------------------------------------
Team 1 Scrum Master observations:


Team 2 Scrum Master observations:


6. COMPLIANCE CHECK
---------------------
[ ] No protected data entered into AI tools this week
[ ] All AI output reviewed by human before use
[ ] No AI-related incidents reported
[ ] If incident occurred, document here: _________________

7. NEXT WEEK FOCUS
--------------------


```

---

## Template 5: Mid-Pilot Pulse Survey

> **Reference:** Chapter 9, Section 9.3 (administered at Sprint 3)

**Audience:** Pilot team members only
**Timing:** After Sprint 3 retrospective
**Estimated completion time:** 3-5 minutes

```
Mid-Pilot Pulse Survey
========================

Team: ___________________    Date: ___________    Role: [ ] BA  [ ] Tester  [ ] Dev  [ ] SM/Lead

Rate each statement on a scale of 1 to 5.
1 = Strongly disagree    2 = Disagree    3 = Neutral    4 = Agree    5 = Strongly agree

Q1. The AI tools (Copilot/Rovo) are helping me be more
    productive in my daily work.                                [1] [2] [3] [4] [5]

Q2. The training I received prepared me well for using
    AI tools effectively.                                       [1] [2] [3] [4] [5]

Q3. I feel confident in my ability to identify when AI
    output is incorrect and needs to be changed.                [1] [2] [3] [4] [5]

Q4. The guardrails and data boundaries are clear -- I know
    what I can and cannot share with AI tools.                  [1] [2] [3] [4] [5]

Q5. I would recommend the AI-augmented workflow to
    colleagues on other teams.                                  [1] [2] [3] [4] [5]

OPEN TEXT (optional):

What is working well with AI tools in your daily work?


What is not working well or could be improved?


What additional training or support would help you?

```

### Scoring & Use

```
Per-question average across pilot team members.
Compare Q1/Q5 scores to attitude baseline (D1-D4 from readiness assessment).
Use open-text responses to adjust training for remaining sprints.

Key decision point:
- If Q1 average < 3.0: AI tools are not perceived as helpful. Investigate root cause.
- If Q2 average < 3.0: Training needs revision before scale.
- If Q4 average < 3.0: Guardrails need reinforcement -- compliance risk.
- If Q5 average >= 4.0: Strong signal for scale recommendation.
```

---

## Template 6: Meeting Notes

> **Reference:** Chapter 2, Executive Discovery

**Use for:** Executive discovery sessions, weekly check-ins, mid-pilot reviews, lessons learned sessions, and any other framework-related meetings.

```
Meeting Notes
==============

Meeting:    _________________________________
Date:       ___________    Time: ______ - ______
Location:   _________________________________ (or Teams/Zoom link)
Facilitator: ________________________________

Attendees:
- ___________________ (Role)
- ___________________ (Role)
- ___________________ (Role)
- ___________________ (Role)

Absent:
- ___________________ (Role)

PURPOSE
--------


AGENDA
-------
1.
2.
3.
4.

DISCUSSION NOTES
-----------------
(Capture key points, decisions, and context. Attribute statements to speakers
where appropriate. Do not transcribe verbatim -- capture meaning.)

Topic 1: _____________________


Topic 2: _____________________


Topic 3: _____________________


DECISIONS MADE
---------------
| # | Decision | Made by | Rationale |
|---|----------|---------|-----------|
| 1 |          |         |           |
| 2 |          |         |           |

ACTION ITEMS
-------------
| # | Action | Owner | Due Date | Priority |
|---|--------|-------|----------|----------|
| 1 |        |       |          |          |
| 2 |        |       |          |          |
| 3 |        |       |          |          |

OPEN QUESTIONS / PARKING LOT
------------------------------
(Items raised but not resolved -- carry forward to next meeting)

1.
2.

NEXT MEETING
--------------
Date: ___________    Time: ______
Agenda items for next time:
-
-

Notes prepared by: ___________________    Date distributed: ___________
```

---

## Template 7: Prompt Library — Per Role

> **Reference:** Chapter 10 (Playbooks)

One prompt library is maintained per role (BA, Tester, Developer). This template provides the structure. Actual prompts are developed during training (Chapter 7) and refined during the pilot (Chapter 8).

```
Prompt Library: [Role Name]
=============================

Last updated: ___________    Maintained by: ___________________

HOW TO USE THIS LIBRARY
- Each prompt is a starting point -- adapt to your specific context.
- Always review AI output before using it. Never accept output blindly.
- Do NOT include any PII, case data, CANTS data, security docs, or
  protected information in any prompt.
- Only use approved tools: GitHub Copilot, Atlassian Rovo.

────────────────────────────────────────────────────────────────

CATEGORY: [e.g., User Story Writing / Test Case Generation / Code Implementation]

PROMPT ID:   [ROLE]-[CATEGORY]-[###]
PROMPT NAME: [Descriptive name]
TOOL:        [Copilot / Rovo]
CONTEXT:     [When to use this prompt -- what situation or task]

PROMPT TEXT:
"""
[The actual prompt text goes here.
 Include placeholders in [BRACKETS] for variable content.
 Be specific about the format you want the output in.]
"""

EXPECTED OUTPUT:
[Describe what good output looks like for this prompt.]

VALIDATION CHECKLIST:
[ ] Output is factually correct
[ ] Output matches the context of my specific story/code/test
[ ] No PII or protected data in the output
[ ] Output follows team coding standards / story format / test conventions
[ ] I have reviewed and edited the output before using it

NOTES:
[Tips, common adjustments, known limitations, anti-patterns to avoid.]

EFFECTIVENESS RATING: [1-5, updated periodically based on team feedback]

────────────────────────────────────────────────────────────────

CATEGORY: [Next category]

PROMPT ID:   [ROLE]-[CATEGORY]-[###]
...

────────────────────────────────────────────────────────────────

REVISION HISTORY
| Date | Change | Changed by |
|------|--------|-----------|
|      |        |           |
```

### Role-Specific Categories

```
BA Prompt Library Categories:
- User Story Drafting (from Confluence context)
- Acceptance Criteria Generation
- Story Refinement and Improvement
- Story Splitting
- Requirements Clarification Questions

Tester Prompt Library Categories:
- Test Case Generation from Acceptance Criteria
- Test Script Drafting
- Edge Case Identification
- Test Data Suggestions
- Regression Test Planning

Developer Prompt Library Categories:
- Code Implementation from Story
- Unit Test Generation
- Code Review Assistance
- Refactoring Suggestions
- Documentation Generation
- Bug Fix Assistance
```

---

## Template 8: Guardrails Cheat Sheet

> **Reference:** Chapter 3 (Governance), Appendix B (DoIT Policy Map)

One-page reference card for all pilot participants. Print and post at workstations or pin in Teams channel.

```
┌──────────────────────────────────────────────────────────────────────┐
│                    AI GUARDRAILS CHEAT SHEET                         │
│                   DCFS Illinois Connect (ILC)                        │
│                   Krasan AI Transformation Framework                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  APPROVED TOOLS                                                      │
│  ──────────────                                                      │
│  YES: GitHub Copilot, Atlassian Rovo, Confluence AI                  │
│  NO:  ChatGPT, Claude, Gemini, Bard, or any other AI tool           │
│       for state work                                                 │
│                                                                      │
│  THE GOLDEN RULE                                                     │
│  ───────────────                                                     │
│  AI SUGGESTS --- YOU DECIDE                                          │
│  Every AI output must be reviewed, edited if needed, and             │
│  approved by you before it is used anywhere.                         │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  NEVER SHARE WITH AI TOOLS                                           │
│  ─────────────────────────                                           │
│  [ ] Names, SSNs, DOBs, or any PII of any person                    │
│  [ ] CANTS data (case numbers, reporter info, investigations)        │
│  [ ] Child welfare case notes or investigation details               │
│  [ ] Substance abuse treatment records (42 CFR Part 2)              │
│  [ ] Educational records (FERPA)                                     │
│  [ ] Health information (HIPAA)                                      │
│  [ ] Federal tax information (IRS Pub 1075)                          │
│  [ ] Security documentation, architecture diagrams, or              │
│      security plans                                                  │
│  [ ] Passwords, API keys, credentials, or access tokens             │
│  [ ] Production database connection strings                          │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  OK TO SHARE WITH AI TOOLS                                           │
│  ─────────────────────────                                           │
│  [x] Source code (application logic, UI components, APIs)            │
│  [x] User story text (with no real names or case data)               │
│  [x] Test case descriptions (with synthetic/mock data only)          │
│  [x] Technical documentation (non-security)                          │
│  [x] Error messages and stack traces (scrubbed of PII)               │
│  [x] Configuration files (without credentials)                       │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  BEFORE YOU ACCEPT AI OUTPUT                                         │
│  ───────────────────────────                                         │
│  Ask yourself:                                                       │
│  1. Is this correct? (Does the code work? Is the story accurate?)    │
│  2. Is this complete? (Missing edge cases? Missing AC?)              │
│  3. Is this appropriate? (Any bias? Any assumptions?)                │
│  4. Does this follow our standards? (Coding, story format, tests)    │
│  5. Would I put my name on this? (You own it once you accept it.)    │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  IF SOMETHING GOES WRONG                                             │
│  ───────────────────────                                             │
│  AI produces biased or inappropriate output:                         │
│    -> Do not use it. Report to AI Transformation Leader.             │
│    -> Add to sprint retro for team discussion.                       │
│                                                                      │
│  You accidentally shared protected data with an AI tool:             │
│    -> IMMEDIATELY report to AI Transformation Leader                 │
│       AND DCFS security.                                             │
│    -> Do not attempt to "undo" -- report first.                      │
│                                                                      │
│  AI tool is down or not working:                                     │
│    -> Continue working without AI. All processes have manual         │
│       fallback. Do not use unauthorized tools as substitutes.        │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  REPORTING CHANNEL                                                   │
│  ─────────────────                                                   │
│  Microsoft Teams: [AI Transformation Channel Name]                   │
│  AI Transformation Leader: Vinay Lagisetty                           │
│  Engagement Director: Romi                                           │
│                                                                      │
│  DoIT AI Policy: Effective April 1, 2025 -- full compliance          │
│  required. See Appendix B for section-by-section map.                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Template 9: Lessons Learned

> **Reference:** Chapter 9, Section 9.9

**Collection points:** Each sprint retro, weekly check-ins, mid-pilot review, end-of-pilot session.

```
Lessons Learned Entry
======================

Date:           ___________
Sprint:         _____ of 5
Reported by:    ___________________
Team:           ___________________

CATEGORY
---------
[ ] Training
[ ] Tool Usage
[ ] Measurement
[ ] Process
[ ] Governance
[ ] Other: ___________________

OBSERVATION
------------
What happened? (Be specific -- include the context, the SDLC process,
and the AI tool involved.)



IMPACT
-------
What was the effect? Was it positive or negative? How significant?
(If possible, quantify: time saved, errors caught, rework caused.)



ROOT CAUSE
-----------
Why did it happen? What conditions led to this outcome?



ACTION
-------
What should we do differently at scale? What should we repeat?



PRIORITY
---------
[ ] Must Fix    -- This will cause problems at scale if not addressed
[ ] Should Improve -- Important but not blocking
[ ] Nice to Have   -- Would make things better but not critical

APPLIES TO
-----------
[ ] All roles
[ ] BA only
[ ] Tester only
[ ] Developer only
[ ] Scrum Master / Lead only

EVIDENCE
---------
Link to JIRA issue, screenshot, metric, or other supporting artifact:


────────────────────────────────────────────────────────────────

LESSONS LEARNED LOG (Summary View)
===================================

| # | Date | Category | Observation (brief) | Priority | Action Owner | Status |
|---|------|----------|---------------------|----------|-------------|--------|
| 1 |      |          |                     |          |             |        |
| 2 |      |          |                     |          |             |        |
| 3 |      |          |                     |          |             |        |

Status: [ ] Captured  [ ] Under review  [ ] Action planned  [ ] Resolved  [ ] Incorporated into scale plan
```

### Example Entry (for reference)

```
Date:           [Sprint 2 close]
Sprint:         2 of 5
Reported by:    [Pilot Team 1 Scrum Master]
Team:           [Pilot Team 1]

CATEGORY:       [x] Training

OBSERVATION:    BAs retained prompt techniques better when they practiced on
                their own team's actual backlog stories during training, not
                generic examples. Two BAs who used real stories were producing
                AI-augmented stories independently by Sprint 1. Two BAs who
                trained on generic examples needed coaching support through
                Sprint 2.

IMPACT:         Positive. Teams using real stories in training adopted AI 2x
                faster in Sprint 1. Estimated 1-sprint faster time to
                independence per BA.

ROOT CAUSE:     Context-specific practice creates immediate utility. Generic
                examples feel theoretical and do not transfer as well to
                actual work.

ACTION:         For scale rollout, use each team's actual backlog stories as
                training material. Coordinate with POs to identify 3-5 real
                stories per team before training sessions.

PRIORITY:       [x] Must Fix

APPLIES TO:     [x] BA only

EVIDENCE:       Compare Sprint 1 AI adoption rates between BAs who trained
                on real vs. generic stories. Data in tools.ussp.co training
                effectiveness report.
```

---

## Template Index

| # | Template | Primary Chapter | When Used |
|---|----------|----------------|-----------|
| 1 | AI Readiness Assessment (condensed) | Chapter 4 | Pre-pilot, all 12 teams |
| 2 | SPACE Survey | Chapter 5, 9 | Pre-pilot, mid-pilot, post-pilot |
| 3 | DevEx Survey | Chapter 5, 9 | Pre-pilot, post-pilot |
| 4 | Weekly Check-In Report | Chapter 9 | Every Friday during pilot |
| 5 | Mid-Pilot Pulse Survey | Chapter 9 | After Sprint 3 |
| 6 | Meeting Notes | Chapter 2 | Every meeting |
| 7 | Prompt Library (per role) | Chapter 10 | During training, refined throughout pilot |
| 8 | Guardrails Cheat Sheet | Chapter 3 | Distributed to all participants at training |
| 9 | Lessons Learned | Chapter 9 | Each retro, weekly, mid-pilot, end-of-pilot |
