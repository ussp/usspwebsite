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

Training follows a deliberate sequence: governance first (mandatory gate — no tool access without it), then Foundation (everyone together), then role-specific tracks in parallel, then leadership last (informed by what pilot teams experienced).

```
Week 1
├── Day 1 AM: Track 0 — DoIT AI Policy & DCFS AI Governance        — 1h (mandatory, gates tool access)
├── Day 1 PM: Foundation Session (all pilot participants)          — 1.5h
├── Day 2:    BA Track + Developer Track (parallel)                — 3h each
├── Day 3 AM: Tester Track + Solution Architect Track (parallel)   — 3h each
├── Day 3 PM: Testing Services Lead Track                          — 2.5h
└── Day 4:    Buffer day for makeup sessions + Track 0 makeups

Week 2
├── Day 1: Leadership Briefing (incl. 0.5h Track 0 segment + briefing) — 1.5h
└── Days 2-5: Post-training support begins (office hours, Teams channel)
```

**Total training time per person (live sessions + pre-work):**
- BAs: 2-3h pre-work + 5.5h live (Track 0 + Foundation + BA Track) = **7.5-8.5h total**
- Testers: 2h pre-work + 5.5h live (Track 0 + Foundation + Tester Track) = **~7.5h total**
- Developers: 2-3h pre-work + 5.5h live (Track 0 + Foundation + Developer Track) = **7.5-8.5h total**
- Solution Architects: 3h pre-work + 5.5h live (Track 0 + Foundation + SA Track) = **~8.5h total**
- Testing Services Leads: 2-3h pre-work + 5h live (Track 0 + Foundation + TSL Track) = **~7-8h total**
- Leadership: 1h pre-work + 1.5h live (0.5h Track 0 segment + Leadership Briefing) = **~2.5h total**

**Track 0 is a hard gate.** No tool license is provisioned until the participant has attended Track 0 and signed the AI Use Acknowledgment. Makeup sessions are scheduled Day 4 of Week 1 for any Day-1 absences.

---

## 7.4 Training Tracks

---

### Pre-Work: Role-Based Free Self-Paced Training

Before the live Foundation session, every participant completes role-specific free self-paced modules. This baseline ensures live sessions focus on hands-on ILC application rather than tool basics. Completion is tracked by the Scrum Master (pilot) or role lead (scale phase); est. 1-3 hours per role. All modules below are free unless noted.

**Mandatory for every role before live training begins:** governance pre-work — "Responsible AI Principles" (Microsoft Learn) + DoIT AI Policy one-pager (internal) + NIST AI RMF overview (internal, see Chapter 3b). This pre-work feeds the Track 0 Governance session.

#### Pilot Roles (Cohort 1 — Sprints 1-2)

| Role | Recommended Free Modules | Source | Est. Time |
|------|-------------------------|--------|-----------|
| **All participants (Foundation pre-work)** | "Your Top AI Questions Answered: AI Literacy for Everyone" + "Introduction to Microsoft 365 Copilot" + Responsible AI Principles module | LinkedIn Learning + Microsoft Learn | ~1.5h |
| **Business Analysts** | "Get started with Microsoft 365 Copilot" (Word/Outlook path) + MS-4004 Operations use case + "Work with cases in Dynamics 365 Customer Service" (D365 case management fluency) + Atlassian Rovo quick-start | MS Learn + Atlassian University | 2-3h |
| **Testers / QA** | "Introduction to GitHub Copilot" + "Configure Copilot in Dynamics 365 Customer Service" + Atlassian Rovo test scenarios | MS Learn + Atlassian University | ~2h |
| **Developers** | GitHub Copilot Fundamentals Part 1 + "Get Started with GitHub Copilot" + "Introduction to GitHub Copilot Business" | MS Learn | 2-3h |
| **Solution Architects** | GitHub Copilot Fundamentals Part 1 + Part 2 + "Agents, Copilot, and AI Capabilities in Dynamics 365" + "Configure Copilot in Dynamics 365 Customer Service" + "Get started with M365 Copilot" (Word for design docs) | MS Learn | ~3h |
| **Testing Services Leads** | "Configure Copilot in Dynamics 365 Customer Service" + "Introduction to GitHub Copilot" (test framework awareness) + MS-4004 Operations use case (test-strategy reporting) + Atlassian Rovo quick-start (defect analytics) + LinkedIn Learning "Responsible AI Foundations" | MS Learn + Atlassian University + LinkedIn Learning | 2-3h |
| **Leadership (CIO, ADM, POs)** | "Prepare your organization for Microsoft 365 Copilot" (adoption strategy) + MS-4004 Executives use case | MS Learn | ~1h |

#### Scale-Phase Roles (Cohorts 2+ — planned, activated post-pilot)

| Role | Recommended Free Modules | Source | Est. Time |
|------|-------------------------|--------|-----------|
| **Scrum Masters / Team Leads** | "Prepare your organization for Microsoft 365 Copilot" + MS-4004 Operations & Communications modules + LinkedIn Learning "Responsible AI Foundations" + Atlassian Rovo for sprint analytics | MS Learn + LinkedIn Learning + Atlassian University | ~2h |
| **Product Owners** | MS-4004 Executives + Operations use cases + Atlassian Rovo for backlog refinement + "Prepare your organization for M365 Copilot" | MS Learn + Atlassian University | ~2h |
| **Release Train Engineers / SAFe Leads** | MS-4004 Operations + Communications + Rovo for program-level analytics + LinkedIn Learning "Responsible AI Foundations" | MS Learn + Atlassian + LinkedIn Learning | ~2h |
| **Solution Architects / Technical Architects** | GitHub Copilot Fundamentals Part 1 + Part 2 + "Agents, Copilot, and AI Capabilities in Dynamics 365" + "Configure Copilot in Dynamics 365 Customer Service" | MS Learn | ~3h |
| **Data Engineers / DBAs** | GitHub Copilot Fundamentals Part 1 + "Introduction to GitHub Copilot Business" + MS-4004 IT use case (data patterns) | MS Learn | ~2-3h |
| **DevOps / Build Engineers** | GitHub Copilot Fundamentals Part 1 + Part 2 + "Introduction to GitHub Copilot Enterprise" + MS-4004 IT use case | MS Learn | ~3h |
| **UX / UI Designers** | MS-4004 Marketing + Communications use cases + M365 Copilot for Designer/PowerPoint modules | MS Learn | ~2h |
| **Technical Writers / Documentation** | "Get started with M365 Copilot" (Word focus) + MS-4004 Communications use case + GitHub Copilot Fundamentals Part 1 (for API/code doc) | MS Learn | ~2h |
| **PMO / Project Managers** | MS-4004 Executives + Operations + Finance use cases + "Get started with Copilot in Dynamics 365 Project Operations" | MS Learn | ~2-3h |
| **Security / Compliance Engineers** | LinkedIn Learning "Responsible AI Foundations" path + "Prepare your organization for M365 Copilot" (security section) + "Introduction to GitHub Copilot Enterprise" (audit/admin features) | LinkedIn Learning + MS Learn | ~3h |
| **Support / Helpdesk (Tier 1-2)** | MS-4004 Customer Service use case + "Work with cases in Dynamics 365 Customer Service" + "Configure Copilot in Dynamics 365 Customer Service" | MS Learn | ~2-3h |
| **Training / Enablement / L&D** | Microsoft Copilot Academy (Viva Learning) + MS-4004 HR use case + train-the-trainer materials from pilot debrief | MS Learn + internal | ~3h |

**Advanced optional (for Krasan AI Transformation trainers — internal only, not DCFS consultants):** IndyDevDan *Principled AI Coding* (6h) + *Tactical Agentic Coding* (6.5h) — practical pattern library for the trainer team. Paid. Claude Code is not on the DoIT-approved tool list so these patterns are for trainer knowledge, not DCFS-facing delivery.

**Certification pathways (optional, sponsored):** GitHub Copilot Certification for developers; Microsoft Azure AI Fundamentals (AI-901, successor to AI-900 retiring June 30, 2026) for the broader team; MS-4004 completion badge for business roles.

> **Tool approval note:** Microsoft 365 Copilot and Dynamics 365 Copilot are in-scope for the pilot pending DoIT approval. Pre-work proceeds regardless — teams are ready the moment approval lands. See §7.9 for the full external training catalog.
>
> **Scale-phase note:** Cohorts 2+ tracks are *planned*, not scheduled. Pilot feedback (§7.10) informs which scale-phase tracks activate first, in what order, and with what modifications. The pilot's 4 roles (BA/Tester/Dev/SM) implement the plan end-to-end and validate it before broader rollout.

---

### Track 0: DoIT AI Policy & DCFS AI Governance

| | |
|---|---|
| **Audience** | All pilot participants (BAs, Testers, Developers, Scrum Masters) **+ Leadership attends the first 30 min** |
| **Duration** | 1 hour (mandatory; no attendance = no tool access) |
| **Delivery Format** | Live workshop (remote or in-person) — scenario-driven, sign-off required |
| **Tools Covered** | N/A — policy and governance focus; tool specifics deferred to Foundation (Track 1) |
| **Timing** | Day 1, Morning — precedes Foundation. Rationale: guardrails before tool use, not after. |

#### Learning Objectives

1. Articulate the Illinois DoIT AI Policy key provisions — allowed, restricted, and prohibited uses
2. Articulate DCFS-specific AI governance — child welfare data sensitivity, PII/PHI patterns in Dynamics 365 case records, State Ethics Act obligations, NIST AI RMF alignment (see Chapter 3b)
3. Recognize AI limitations that shape *how* the tools must be used: hallucinations, domain-accuracy degradation on X++ / D365 customizations, bias risk in child-welfare-adjacent content, stale training data, confident wrong answers
4. Apply the HITL principle concretely — what "human review" means operationally, what gets logged, who signs off, what the audit trail looks like
5. Identify the escalation path for suspected policy violations, AI-output quality incidents, and tool misuse — first contact, SLA, compliance-reporting cadence
6. Sign the AI Use Acknowledgment (completion gate for tool access provisioning)

#### Session Outline

| Time | Activity | Format |
|------|----------|--------|
| 0:00 - 0:10 | Why governance first — the policy landscape: State of Illinois DoIT AI Policy, NIST AI RMF, DCFS-specific considerations, consequences of non-compliance | Presentation |
| 0:10 - 0:25 | DoIT AI Policy deep dive — allowed uses (productivity, summarization, draft generation), restricted uses (with review + approval gates), prohibited uses (autonomous decisioning, PII in prompts, generative content masquerading as official record) | Presentation + Q&A |
| 0:25 - 0:40 | DCFS AI governance — child welfare data sensitivity, PII/PHI patterns in SACWIS/CYCIS/MARS data migrated to D365, State Ethics Act obligations, alignment with NIST AI RMF's Govern/Map/Measure/Manage functions | Presentation + scenario discussion |
| 0:40 - 0:50 | **AI limitations every user must know** — hallucinations (fabricated APIs, fake case numbers, plausible-but-wrong dates), domain gaps (X++ / D365 customizations less-trained), bias risks (language patterns in child-welfare content), confidence ≠ correctness, stale training data | Presentation + live demo of AI failure modes |
| 0:50 - 0:58 | **Lab:** Scenario sorting — in pairs, classify 10 DCFS-specific AI-use scenarios as Allowed / Restricted (needs approval) / Prohibited. Debrief as full group. | Hands-on (pairs) + group review |
| 0:58 - 1:00 | Escalation path + compliance reporting cadence + AI Use Acknowledgment sign-off (digital form) | Open discussion + sign-off |

#### Materials Needed

- DoIT AI Policy one-page summary (distributed T-24h)
- DCFS AI Governance one-pager — Krasan AI Transformation team to prepare; covers child welfare data sensitivity, State Ethics Act intersection, NIST AI RMF alignment
- AI Limitations cheat sheet — hallucination examples (ideally DCFS-relevant: fake case numbers, wrong statute citations, fabricated Dynamics 365 entity names)
- 10 scenario cards for sorting lab (DCFS-specific, validated by compliance)
- AI Use Acknowledgment form (digital — captures participant name, date, training completion, policy version)
- Escalation path flowchart (violation, quality incident, access issue)
- Reference links: DoIT AI Policy (state.il.us/doit), NIST AI RMF 1.0, Chapter 3 + 3b of this guide

#### Success Criteria

- 100% attendance + signed AI Use Acknowledgment on file (attendance alone is insufficient)
- Every participant correctly classifies ≥8/10 scenarios in the sorting lab
- Every participant can state the three core guardrails (no PII in prompts, HITL required, human review on all outputs) without reference
- Every participant can name two concrete AI limitations relevant to their role
- Compliance / DoIT liaison sign-off on training delivery before tool provisioning proceeds
- No tool license is activated for any participant who has not completed Track 0

#### Ongoing Governance Refresh

| Cadence | Activity | Owner |
|---------|----------|-------|
| Each new cohort | Full 1-hour Track 0 delivery | Krasan AI Transformation Lead |
| Weekly (pilot phase) | **Training discipline is reinforced in the Pilot Governance Team weekly meeting (Charter §5.5 Compliance check).** Explicit prompt-drift review of PII, case data, CANTS/CCWIS references, out-of-scope content. Self-reporting is welcomed. | Pilot Governance Lead |
| Quarterly (all active users) | 15-minute refresh — policy updates, incident lessons, new AI limitation patterns observed | Compliance + Krasan |
| On policy change | Ad-hoc update session within 2 weeks of policy revision; re-acknowledgment required | Compliance |

> **Note for pilot participants:** Training is the first line of defense on PII boundaries, but not the only one. Your weekly Pilot Governance Team meeting (§5.5 Compliance check) explicitly reviews prompt-drift incidents. If you catch a near-miss — yours or a teammate's — self-report to the Pilot Governance Lead immediately. There is no penalty for catching and flagging your own near-miss; there IS expected accountability for unflagged drift.
| On incident | Root-cause walkthrough to affected team + full-program advisory via `#ilc-ai-pilot` | Krasan + Compliance |

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
3. Explain the three non-negotiable guardrails: no PII in prompts, HITL required on all AI output (no autonomous AI commits), human review on all outputs
4. Demonstrate basic prompt structure (context + instruction + constraints) in both tools
5. Know where to get help during the pilot (Teams channel, office hours, escalation path)

#### Session Outline

| Time | Activity | Format |
|------|----------|--------|
| 0:00 - 0:10 | Welcome & pilot overview — why we're doing this, what success looks like, the 15% productivity target | Presentation |
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
3. Apply the guardrails to development SDLC processes — no PII in prompts, HITL required on all AI output (developer reviews/edits/accepts every suggestion, peer PR review and approval before commit), no autonomous AI commits
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

### Track 5: Solution Architect Track

| | |
|---|---|
| **Audience** | Solution Architects and Technical Architects on pilot teams (approximately 1-2 people) |
| **Duration** | 3 hours |
| **Delivery Format** | Live workshop with hands-on architecture lab |
| **Primary Tools** | GitHub Copilot (Chat for design + ADR drafting), Dynamics 365 Customer Service Copilot (D365 architecture decisions), M365 Copilot (Word for design docs and stakeholder comms) |
| **Secondary Tool** | Atlassian Rovo (epic decomposition, cross-story dependency analysis) |

#### Learning Objectives

1. Use GitHub Copilot Chat to draft architecture decision records (ADRs), evaluate design tradeoffs against ILC constraints, and generate sequence/component diagrams as code (PlantUML/Mermaid)
2. Use Dynamics 365 Customer Service Copilot configuration knowledge to make informed architecture decisions about case management workflows, agent assist, and Copilot extensibility points within ILC
3. Use M365 Copilot in Word/PowerPoint to accelerate architecture documentation, design reviews, and stakeholder-facing material
4. Use Rovo to analyze epics for architectural risk, missing non-functional requirements, and integration dependencies across ILC modules
5. Apply guardrails to architecture-level SDLC processes — recognizing when AI design suggestions conflict with State of Illinois data residency, security, or accessibility constraints
6. Critically evaluate AI-generated architecture content for hallucinated patterns, deprecated D365 capabilities, or violations of approved reference architectures

#### Session Outline

| Time | Activity | Format |
|------|----------|--------|
| 0:00 - 0:10 | Architect-specific SDLC processes — where AI fits in design, ADRs, integration mapping, NFR definition, design reviews | Presentation |
| 0:10 - 0:40 | Demo: ADR drafting with Copilot Chat — design tradeoff exploration, alternatives evaluation, decision documentation for an ILC integration scenario | Live demo + discussion |
| 0:40 - 1:10 | **Lab 1:** Participants draft an ADR for a real ILC architecture decision using Copilot Chat. Trainer reviews for completeness and accuracy. | Hands-on (individual) |
| 1:10 - 1:25 | Break | |
| 1:25 - 1:55 | Demo: D365 Customer Service Copilot architecture deep dive — agent assist configuration, Copilot extensibility surfaces, when to use built-in capabilities vs. custom extensions for ILC | Live demo + discussion |
| 1:55 - 2:25 | **Lab 2:** Participants design a D365 Copilot integration approach for a specific ILC case workflow. Document decision in an ADR. | Hands-on (pairs) |
| 2:25 - 2:45 | Demo: Rovo for epic-level analysis — surfacing architectural risk, NFR gaps, and integration dependencies across an ILC epic | Live demo |
| 2:45 - 3:00 | **Lab 3 (mini):** Participants run Rovo against a real ILC epic and identify the top 3 architectural concerns. Debrief and Q&A. | Hands-on + group discussion |

#### Materials Needed

- 1 real ILC architecture decision scenario for Lab 1 (sanitized, well-defined integration question)
- 1 real ILC case workflow for Lab 2 (D365 Copilot integration target)
- 1 ILC epic for Lab 3 (multi-story, integration-heavy)
- Architect prompt library (Copilot Chat for ADRs + D365 Copilot architecture queries + M365 Copilot for design docs)
- ILC reference architecture summary (1-2 pages — current-state architecture + approved patterns)
- "Before/After" examples: manually written ADR vs. Copilot-augmented ADR

#### Success Criteria

- Each architect produces an ADR (Lab 1) that meets ILC documentation quality standards (reviewed by trainer)
- Each architect can identify at least 1 hallucinated or incorrect AI-generated architecture suggestion and explain why
- Each architect demonstrates the design-iterate-document workflow (not single-prompt completion)
- Post-session: architects commit to using AI on at least 2 real architecture artifacts in Sprint 1

---

### Track 6: Testing Services Lead Track

| | |
|---|---|
| **Audience** | Testing Services Leads on pilot teams (approximately 1-2 people) |
| **Duration** | 2.5 hours |
| **Delivery Format** | Live workshop with facilitated discussion + hands-on lab |
| **Primary Tools** | Atlassian Rovo (test strategy, defect analytics, sprint test planning), Dynamics 365 Customer Service Copilot (test scenario design for case workflows) |
| **Secondary Tools** | GitHub Copilot (test framework + automation strategy awareness), M365 Copilot (test-strategy reporting in Word/Excel) |

#### Learning Objectives

1. Use Rovo to generate test strategy documents, sprint test plans, and cross-story regression scope based on JIRA epic and story data
2. Use Rovo for defect analytics — pattern detection across sprints, severity-trend analysis, and recommended regression focus areas
3. Use D365 Customer Service Copilot configuration knowledge to design test scenarios that exercise AI-augmented case workflows correctly (including failure modes)
4. Use M365 Copilot to accelerate test-strategy reporting, defect-trend memos, and stakeholder communication
5. Identify and address tester adoption resistance — coaching techniques for testers hesitant to use AI tools
6. Recognize guardrail violations specific to testing (PII patterns in test data, AI-generated test data masquerading as production, autonomous test execution decisions) and know the escalation process

#### Session Outline

| Time | Activity | Format |
|------|----------|--------|
| 0:00 - 0:10 | Testing Services Lead role in the pilot — you set the test strategy, drive QA tooling adoption, and own the defect-trend narrative | Presentation |
| 0:10 - 0:35 | Demo: Rovo for sprint test planning + defect analytics — generating test strategy summaries, identifying defect clusters, proposing regression scope | Live demo |
| 0:35 - 1:05 | **Lab 1:** Participants use Rovo to analyze a recent ILC sprint and produce a test-strategy summary + defect-trend memo | Hands-on (individual) |
| 1:05 - 1:20 | Break | |
| 1:20 - 1:45 | Demo: D365 Customer Service Copilot test scenarios — designing tests that exercise Copilot-augmented case workflows, including failure-mode scenarios (hallucinations, irrelevant suggestions, latency) | Live demo + discussion |
| 1:45 - 2:10 | **Lab 2:** Participants design a test approach for a Copilot-augmented ILC case workflow. Identify functional, edge case, and AI-specific failure-mode tests. | Hands-on (pairs) |
| 2:10 - 2:25 | Coaching techniques — handling tester resistance to AI ("AI tests miss what humans catch"), maintaining test rigor during the learning curve, role-modeling HITL behavior | Facilitated discussion |
| 2:25 - 2:30 | Guardrail enforcement specific to testing (PII in test data, audit trail for AI-generated test cases), escalation process, Q&A | Open discussion |

#### Materials Needed

- 1 recent ILC sprint's defect data + sprint outcomes (sanitized) for Lab 1
- 1 D365-Copilot-augmented ILC case workflow specification for Lab 2
- TSL prompt library (Rovo for test strategy + defect analytics + D365 Copilot test design + M365 Copilot for reporting)
- Test-strategy quality checklist (ILC-specific)
- Coaching scenarios handout (3-4 common tester resistance patterns + suggested responses)
- AI-specific failure-mode reference (hallucination, drift, false confidence — examples from D365 Copilot)

#### Success Criteria

- Each TSL produces a test-strategy summary + defect-trend memo (Lab 1) deemed actionable by their pilot team
- Each TSL can articulate at least 2 AI-specific failure modes that testing must cover
- Each TSL has a documented coaching plan for at least 1 tester team member
- Each TSL can identify a testing-specific guardrail violation scenario and describe correct escalation
- Post-session: TSLs commit to using Rovo for test strategy on at least 2 real sprints in Pilot Sprints 1-2

---

### Track 7: Leadership Briefing

| | |
|---|---|
| **Audience** | Jim Daugherty (CIO), John (ADM), Product Owners |
| **Duration** | 1 hour |
| **Delivery Format** | Executive briefing with live demonstration |
| **Tools Covered** | Both (overview level — leadership does not need hands-on proficiency) |

#### Learning Objectives

1. Understand the pilot structure, timeline, and what "success" means quantitatively (15% productivity target)
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

## 7.9 External Training Research & Vendor Catalog

This catalog lists vetted external training resources that supplement the custom live tracks. Pre-work in §7.4 is drawn from here. The catalog is reviewed every 4 weeks during pilot and quarterly thereafter, with immediate updates when a resource retires, a new DoIT-approved tool is added, or pilot feedback surfaces a coverage gap.

### Microsoft Learn — Free, Official, Certification-Eligible

#### GitHub Copilot

| Module / Path | Audience | URL |
|---|---|---|
| GitHub Copilot Fundamentals Part 1 | Developers, Architects, DevOps | `learn.microsoft.com/en-us/training/paths/copilot/` |
| GitHub Copilot Fundamentals Part 2 (advanced) | Developers, Architects | `learn.microsoft.com/en-us/training/paths/gh-copilot-2/` |
| Get Started with GitHub Copilot | Developers (first-time users) | `learn.microsoft.com/en-us/training/modules/get-started-github-copilot/` |
| Introduction to GitHub Copilot Business | POs, Architects, Compliance | `learn.microsoft.com/en-us/training/modules/introduction-to-github-copilot-for-business/` |
| Introduction to GitHub Copilot Enterprise | Architects, DevOps, Security/Compliance | `learn.microsoft.com/en-us/training/modules/introduction-to-github-copilot-enterprise/` |
| GH-300T00-A: GitHub Copilot (formal course) | Developer cert track | `learn.microsoft.com/en-us/training/courses/gh-300t00` |
| GitHub Copilot Certification | Developers (credential) | `learn.microsoft.com/en-us/credentials/certifications/github-copilot/` |

#### Microsoft 365 Copilot

| Module / Path | Audience | URL |
|---|---|---|
| Introduction to Microsoft 365 Copilot | All roles (literacy baseline) | `learn.microsoft.com/en-us/training/modules/introduction-microsoft-365-copilot/` |
| Get Started with Microsoft 365 Copilot (3 modules) | BAs, SMs, Leadership, PMO | `learn.microsoft.com/en-us/training/paths/get-started-with-microsoft-365-copilot/` |
| Prepare Your Organization for M365 Copilot | SMs, Leadership, Security/Compliance, L&D | `learn.microsoft.com/en-us/training/paths/prepare-your-organization-microsoft-365-copilot/` |
| MS-4004: Empower Your Workforce with M365 Copilot Use Cases (10 role scenarios) | BAs, SMs, PMO, POs, Leadership | `learn.microsoft.com/en-us/training/courses/ms-4004` |
| Microsoft Copilot Academy (Viva Learning) | Org-wide curriculum deployment | `learn.microsoft.com/en-us/viva/learning/academy-copilot` |
| Explore the Possibilities with M365 Copilot | All roles | `learn.microsoft.com/en-us/training/modules/explore-possibilities-microsoft-365-copilot/` |
| Transform Ideas into Action with Copilot Chat (Basic) | BAs, SMs, Support | `learn.microsoft.com/en-us/training/paths/explore-microsoft-365-copilot-business-chat/` |

#### Dynamics 365 Copilot (critical for ILC — D365 case management)

| Module / Path | Audience | URL |
|---|---|---|
| Configure Copilot in Dynamics 365 Customer Service | Architects, Developers, Testers, Support | `learn.microsoft.com/en-us/training/modules/configure-copilot/` |
| Work with Cases in Dynamics 365 Customer Service | BAs, Testers, Support | `learn.microsoft.com/en-us/training/paths/work-with-cases-in-dynamics-365-for-customer-service/` |
| Agents, Copilot, and AI Capabilities in Dynamics 365 | Architects, POs, Leadership | `learn.microsoft.com/en-us/dynamics365/copilot/ai-get-started` |
| Use Copilot for Dynamics 365 Sales | Reference only (not ILC-aligned) | `learn.microsoft.com/en-us/training/paths/use-copilot-sales/` |
| Get Started with Copilot in Dynamics 365 Project Operations | PMO, RTEs | `learn.microsoft.com/en-us/training/modules/get-started-copilot-project-operations/` |
| Service Agent for M365 Copilot in Dynamics 365 | Support, Architects (emerging — Mar 2026) | `microsoft.com/en-us/dynamics-365/blog/it-professional/2026/03/31/service-agent-microsoft-365-copilot/` |

#### AI Foundations & Certification

| Module / Path | Audience | URL |
|---|---|---|
| AI-900: Azure AI Fundamentals (**retires June 30, 2026**) | All (certification) | `learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/` |
| AI-901 (successor to AI-900) | All (certification — target post-June 2026) | (to be published by Microsoft) |
| AI-900T00-A Course | Self-paced cert prep | `learn.microsoft.com/en-us/training/courses/ai-900t00` |
| Responsible AI Principles (embedded in multiple paths) | All — governance pre-work | Multiple; see "Prepare Your Organization for M365 Copilot" |

### LinkedIn Learning — Subscription (many orgs have access; confirm entitlement)

| Path / Course | Audience | Duration |
|---|---|---|
| Building AI Literacy (learning path) | All roles — literacy baseline | ~8h |
| Your Top AI Questions Answered: AI Literacy for Everyone | All — 45-min primer | ~45 min |
| Responsible AI Foundations (pathway) | SMs, Leadership, Security/Compliance, L&D | ~3h |
| AI Skill Pathways (role-based collections) | Role-specific | varies |
| Building AI Products | Architects, POs | ~4h |

### Atlassian University — Free (Atlassian-provided)

| Resource | Audience |
|---|---|
| Rovo Quick-Start | BAs, Testers, SMs, POs, RTEs |
| Rovo for Sprint Analytics | SMs, RTEs, PMO |
| Atlassian Cloud Admin + Security for Rovo Enablement | Security/Compliance, DevOps |

### Coursera — Paid; Optional Sponsored

| Specialization / Course | Audience | Notes |
|---|---|---|
| Wharton: AI for Business (4-course) | Leadership, POs, PMO | Non-technical, strategy/ethics focus |
| Microsoft Azure AI-900 Fundamentals (5-course) | All (cert prep) | Pairs with official Microsoft Learn path |

### IndyDevDan / Agentic Engineer — Paid; **Trainer Internal Use Only**

| Course | Audience | URL |
|---|---|---|
| Principled AI Coding (6h) | Krasan AI Transformation trainers (internal) | `agenticengineer.com/principled-ai-coding` |
| Tactical Agentic Coding (6.5h, Claude Code + MCP) | Krasan trainers (internal) | `agenticengineer.com/tactical-agentic-coding` |

**Use-case restriction:** Claude Code is not on the DoIT-approved tool list. These courses level up the internal trainer team's pattern knowledge; the *patterns* translate to Copilot/Rovo, but Claude Code itself is not used with DCFS/ILC artifacts.

### Vendor-Direct & Ad-Hoc (monitored for updates)

| Resource | Purpose | URL |
|---|---|---|
| GitHub Docs — Copilot Quickstart | Developer onboarding reference | `docs.github.com/copilot` |
| Microsoft Adoption: Copilot Scenario Library | Real-world scenarios indexed by role/department | `adoption.microsoft.com/en-us/scenario-library/` |
| Microsoft 365 Copilot Skilling Center | Admin adoption/skilling content | `adoption.microsoft.com/en-us/copilot/skilling-center/` |
| GitHub Copilot product page | Feature tracking | `github.com/features/copilot/` |

### How These Are Used in the Program

| Phase | External Training Use |
|-------|----------------------|
| Pre-pilot (T-7 to T-0) | Pre-work tables in §7.4 — role-specific modules required before Track 0 / Foundation |
| Pilot weeks 1-8 | Weekly Microsoft Learn module assignment via `#ilc-ai-pilot` Teams channel (see §7.7 weekly tips schedule) |
| Scale phase | Train-the-trainer SMs reuse this catalog as onboarding curriculum for new teams; scale-phase role tracks (§7.4) lean heavily on Microsoft Learn free content to keep live-session load manageable |
| Ongoing | Certification pathways (GitHub Copilot cert, AI-901) sponsored via Krasan L&D budget for interested consultants |

### Catalog Maintenance

**Maintained by:** Krasan AI Transformation team.
**Review cadence:** every 4 weeks during pilot, quarterly after.
**Immediate-update triggers:**
- A resource retires or is deprecated (e.g., AI-900 → AI-901 in June 2026)
- A new DoIT-approved tool lands (catalog gains a new section)
- Pilot feedback surfaces a gap not covered by an existing resource
- A new Microsoft/GitHub/Atlassian module is released relevant to pilot roles

---

## 7.10 Pilot Training Feedback Loop

Training-v1 (pilot) is the input to training-v2 (scale). This section defines how we capture what worked, what didn't, and how v2 is updated before cohort 2 begins.

### Data Captured During Pilot

| Source | What's Captured | When | Owner |
|--------|-----------------|------|-------|
| Post-session survey (Track 0 + each role track + Foundation) | Clarity of material, pacing, hands-on value, confidence rating, three-things-to-change | Immediately after each session | Trainer |
| Weekly `#ilc-ai-pilot` pulse | Unprompted wins, complaints, tool frustrations, prompt patterns that worked | Continuous, summarized weekly | Krasan AI Transformation team |
| Office hours topic log | Which questions come up repeatedly — signals training gaps | Continuous | Trainer |
| SM sprint retro AI items | Adoption barriers, sprint-impact observations | Each sprint retro | Scrum Master |
| Mid-pilot training retrospective (Sprint 3) | Structured 1h session: what's sticking, what isn't, what to change for scale | Sprint 3, end of week | Krasan AI Transformation Lead |
| End-of-pilot training effectiveness report | Completion data + adoption rate + output quality + participant NPS + governance-incident log | Sprint 6, end of pilot | Krasan AI Transformation Lead |

### Training v2 Update Process (before scale to cohorts 2+)

1. **Consolidate feedback** (Week 1 post-pilot) — all data sources above compiled into a single training effectiveness report.
2. **Root-cause training gaps** (Week 1-2) — for each "didn't work," identify whether the cause was content, pacing, materials, pre-work, or unrelated (tool, process, leadership).
3. **Update materials** (Week 2-3):
   - Prompt libraries: add patterns that pilot participants actually used successfully; remove patterns that didn't stick
   - Before/after examples: replace with real pilot artifacts where possible
   - Scenario cards (Track 0): refresh with DCFS-specific incidents observed during pilot
   - AI limitations cheat sheet: add any new failure modes surfaced
   - Weekly tips schedule: reorder based on what topics generated the most office-hours questions
4. **Re-sequence tracks if needed** (Week 2-3) — e.g., if SMs needed the coaching content earlier, or BAs needed more D365 Customer Service Copilot hands-on time.
5. **Activate scale-phase role tracks in priority order** (Week 3-4) — based on which non-pilot roles are most demand-driven and which have the strongest Microsoft Learn pre-work base already built.
6. **Compliance re-review of Track 0** (Week 3-4) — DoIT liaison and DCFS compliance approve any governance-content changes before cohort-2 delivery.

### What Gets Preserved vs. Rewritten

| Element | Default | Why |
|---------|---------|-----|
| Governance-sign-off model (Track 0 gate) | Preserved | Non-negotiable compliance model |
| Role-track structure (6 pilot tracks) | Preserved | Validated by pilot |
| Specific exercises / artifacts | Rewritten | Replaced with pilot-sourced real artifacts for freshness + relevance |
| Prompt libraries | Updated | Augmented with pilot-discovered patterns |
| Pre-work module list | Updated | Swapped for newer Microsoft Learn modules as they're released |
| Weekly tips schedule | Rewritten | Reordered by measured question-frequency data |
| Scale-phase role tracks | Newly activated | Were planned-only during pilot; activated now |

### Success Criteria for Training v2

- All training v2 updates published before cohort-2 Day 1
- Cohort-2 sessions run at least 20% faster than cohort-1 equivalents (material tightened based on feedback)
- Cohort-2 participants score ≥10% higher on scenario-sorting lab (Track 0) than cohort-1 baseline
- Governance incidents per 100 trained users decrease cohort-over-cohort
- Post-session survey "hands-on value" rating increases cohort-over-cohort

---

## Summary

| Track | Audience | Duration | Primary Tool | Key Deliverable |
|-------|----------|----------|-------------|-----------------|
| **Track 0: Governance** | **All participants + Leadership** | **1h (mandatory gate)** | **N/A (policy)** | **Signed AI Use Acknowledgment; scenario-based classification proficiency** |
| Foundation | All pilot participants | 1.5h | All approved tools (overview) | Guardrails understanding, basic prompting |
| BA Track | Business Analysts | 3h | Rovo + M365 Copilot + D365 Customer Service Copilot | AI-augmented user stories with BDD AC |
| Tester Track | Testers / QA | 3h | Rovo + GitHub Copilot + D365 Customer Service Copilot | AI-generated test cases and defect analysis |
| Developer Track | Developers | 3h | GitHub Copilot (+ D365 Copilot awareness) | AI-augmented coding, unit tests, code review |
| Scrum Master Track | SMs / Leads | 2h | Rovo + M365 Copilot | Sprint analytics, adoption coaching plan |
| Leadership Briefing | CIO, ADM, POs | 1h | All (demo) | Decision framework understanding |
| **Scale-Phase Tracks (planned)** | **POs, RTEs, Architects, Data Eng, DevOps, UX, Tech Writers, PMO, Security, Support, L&D** | **1.5-3h each** | **Role-specific mix** | **Cohort 2+ readiness; activated post-pilot per feedback** |

**Total materials to create (pilot):** DoIT/DCFS governance pack (policy summary, scenario cards, acknowledgment form, AI limitations cheat sheet) + 4 prompt libraries + 4 before/after examples + 4 reference cards + 8 exercise datasets.

**Total training calendar (pilot):** 5 days of delivery (incl. Track 0 gate) + 1-3h role-specific free self-paced pre-work + ongoing support for pilot duration.

**Success definition:** 100% Track 0 completion + signed acknowledgment before any tool provisioning; 90%+ of trained pilot participants independently using approved tools on real ILC work by end of Sprint 1.

**Scale-phase scope:** The plan covers 11 additional roles beyond the pilot 4, with recommended free pre-work catalogued per role (§7.4 pre-work table). Pilot outcomes and feedback (§7.10) drive which scale-phase tracks activate first.
