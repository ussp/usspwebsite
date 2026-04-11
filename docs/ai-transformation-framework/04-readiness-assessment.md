---
title: "Readiness Assessment"
description: "23-question survey instrument for measuring AI readiness across delivery teams"
---

# Chapter 4: AI Readiness Assessment

## Purpose

This chapter provides a standardized assessment instrument for measuring AI readiness across delivery teams. The assessment captures quantitative baselines and qualitative insights that directly inform pilot team selection, training design, and post-pilot attitude measurement.

**Audience:** All team members across all delivery teams (BAs, Testers, Developers, Scrum Masters/Leads)

**Timing:** Administered before pilot team selection, during the readiness phase of the AI Transformation Framework

**Estimated completion time:** 10-15 minutes

---

## Assessment Overview

### Why This Assessment

USSP / Krasan's AI Transformation Framework is built on the principle that successful AI adoption requires understanding where teams actually are, not where we assume they are. This assessment serves three purposes:

1. **Pilot team selection** -- Identify which teams have the right combination of readiness, openness, and SDLC process maturity to serve as the pilot
2. **Training customization** -- Understand skill gaps and concerns so training content addresses real needs, not generic topics
3. **Baseline measurement** -- Establish quantitative scores for skills, attitudes, and process readiness that can be compared against post-pilot results to demonstrate measurable change

### Who Completes It

Every team member across all delivery teams completes the assessment individually. Responses are confidential at the individual level; results are aggregated and reported at the team level.

### How It Is Distributed

The assessment is distributed electronically (Microsoft Forms, Google Forms, or equivalent) with a unique link per team to enable team-level aggregation. Paper copies are available on request. Team leads and Scrum Masters are responsible for ensuring completion within the collection window.

---

## Section A: Current AI Experience

*These questions establish a factual baseline of each person's exposure to AI tools. No right or wrong answers.*

**A1.** Have you used any AI-assisted development or productivity tools in a professional setting?

- [ ] Yes, regularly (daily or weekly)
- [ ] Yes, occasionally (a few times per month)
- [ ] Yes, but only briefly or in a trial
- [ ] No, but I have used AI tools personally (e.g., ChatGPT)
- [ ] No, I have not used AI tools

**A2.** Which of the following AI tools have you used? (Select all that apply)

- [ ] Code completion / AI pair programming tools (e.g., GitHub Copilot, Cursor, Tabnine, Codeium)
- [ ] AI-powered project management or knowledge tools (e.g., Atlassian Intelligence, Notion AI)
- [ ] General-purpose AI assistants (e.g., ChatGPT, Claude, Google Gemini)
- [ ] Other AI productivity tools (please specify): ___________
- [ ] None

**A3.** In which SDLC processes have you applied AI tools? (Select all that apply)

- [ ] Writing or generating code
- [ ] Writing or refining user stories / requirements
- [ ] Test case creation or test script generation
- [ ] Code review or pull request analysis
- [ ] Documentation or knowledge base creation
- [ ] Bug triage or defect analysis
- [ ] Sprint planning or estimation support
- [ ] None of the above

**A4.** How would you describe the outcome of your AI tool usage so far?

- [ ] Significantly improved my productivity
- [ ] Somewhat improved my productivity
- [ ] Neutral -- about the same as without AI
- [ ] Made things slower or more complicated
- [ ] Not applicable -- I have not used AI tools

**A5.** Have you received any formal training on AI tools for software development or business analysis?

- [ ] Yes, comprehensive training (multi-day or certification)
- [ ] Yes, introductory training (workshop, webinar, or short course)
- [ ] Self-taught only (tutorials, documentation, experimentation)
- [ ] No training

---

## Section B: Skills Self-Assessment

*Rate your current comfort level with each skill area. This is a self-assessment, not a test. Honest responses help us design training that meets you where you are.*

**Scale:** 1 = No experience | 2 = Aware but not practiced | 3 = Can do with guidance | 4 = Comfortable independently | 5 = Could teach others

| # | Skill Area | 1 | 2 | 3 | 4 | 5 |
|---|-----------|---|---|---|---|---|
| B1 | Writing effective prompts to get useful output from AI tools | | | | | |
| B2 | Reviewing and validating AI-generated code for correctness and security | | | | | |
| B3 | Using AI to augment user story writing or requirements refinement | | | | | |
| B4 | Using AI to generate or augment test cases and test scripts | | | | | |
| B5 | Integrating AI tool output into existing SDLC processes (not replacing, but augmenting current workflows) | | | | | |
| B6 | Identifying when AI suggestions are wrong, incomplete, or inappropriate for the context | | | | | |

---

## Section C: Process Readiness

*Rate how well your team's current processes support AI tool adoption. Consider your team's actual day-to-day practices, not aspirational goals.*

**Scale:** 1 = Strongly disagree | 2 = Disagree | 3 = Neutral | 4 = Agree | 5 = Strongly agree

| # | Statement | 1 | 2 | 3 | 4 | 5 |
|---|-----------|---|---|---|---|---|
| C1 | Our team has well-defined, documented SDLC processes that new team members can follow | | | | | |
| C2 | Our team regularly reviews and improves our development and testing workflows | | | | | |
| C3 | Our team has clear code review standards and practices | | | | | |
| C4 | Our team has the capacity to adopt new tools without disrupting current sprint commitments | | | | | |
| C5 | Our team lead or Scrum Master actively supports experimentation with new approaches | | | | | |

---

## Section D: Attitudes and Concerns

*Your honest perspective on AI in the workplace is essential. These responses directly shape how the framework addresses real concerns rather than assumed ones.*

**Scale:** 1 = Strongly disagree | 2 = Disagree | 3 = Neutral | 4 = Agree | 5 = Strongly agree

| # | Statement | 1 | 2 | 3 | 4 | 5 |
|---|-----------|---|---|---|---|---|
| D1 | I believe AI tools can meaningfully improve the quality of my work | | | | | |
| D2 | I am confident that AI tools will augment my role, not replace it | | | | | |
| D3 | I am willing to invest time learning AI tools even if it temporarily slows me down | | | | | |
| D4 | I believe my team would benefit from a structured AI adoption approach rather than ad-hoc experimentation | | | | | |

**D5.** What is your biggest concern about AI tool adoption in your daily work? (Open text -- please be specific)

```
[Open response field]
```

**D6.** What SDLC process do you think AI could most improve for your team, and why? (Open text)

```
[Open response field]
```

---

## Section E: Infrastructure Readiness

*These questions are completed once per team, typically by the Scrum Master or team lead.*

**E1.** Does your team currently have access to approved AI code assistance tools (e.g., code completion, AI pair programming)?

- [ ] Yes, all team members
- [ ] Yes, some team members
- [ ] No, but access has been requested
- [ ] No
- [ ] Unsure

**E2.** Does your team currently have access to approved AI productivity tools (e.g., AI-powered search, content generation, knowledge management)?

- [ ] Yes, enabled for the team
- [ ] Partially enabled
- [ ] No, but tools are available in our environment
- [ ] No
- [ ] Unsure

**E3.** Are there any technical, security, or policy constraints that would prevent your team from using AI tools in your development environment? (Select all that apply)

- [ ] Network or firewall restrictions
- [ ] Client data handling policies that restrict AI tool use
- [ ] IDE or toolchain limitations
- [ ] Approval or procurement process not yet completed
- [ ] No known constraints
- [ ] Unsure -- need to verify with project leadership

---

## Scoring Methodology

### Individual Scoring

Each respondent receives sub-scores calculated from their Likert-scale responses:

| Sub-Score | Source Questions | Calculation |
|-----------|-----------------|-------------|
| **Skills** | B1 through B6 | Average of 6 responses (1-5 scale) |
| **Process** | C1 through C5 | Average of 5 responses (1-5 scale) |
| **Attitude** | D1 through D4 | Average of 4 responses (1-5 scale) |

Section A (Current AI Experience) is not scored numerically. It provides categorical context for interpreting the other scores.

Section E (Infrastructure Readiness) is scored as a team-level binary checklist, not averaged across individuals.

### Team-Level Aggregation

Team readiness scores are calculated by averaging individual sub-scores across all respondents on each team:

| Metric | Formula |
|--------|---------|
| Team Skills Score | Average of all individual Skills sub-scores on the team |
| Team Process Score | Average of all individual Process sub-scores on the team |
| Team Attitude Score | Average of all individual Attitude sub-scores on the team |
| **Team Readiness Score** | **Weighted average: Skills (30%) + Process (30%) + Attitude (30%) + Infrastructure (10%)** |

**Infrastructure scoring** for the weighted average:

| Infrastructure Status | Score |
|----------------------|-------|
| All approved AI tools fully available, no constraints | 5.0 |
| All tools available, minor constraints | 4.0 |
| Some tools available, others in progress | 3.0 |
| Tools requested but not yet available | 2.0 |
| No tools available or significant constraints | 1.0 |

### Readiness Tiers

| Tier | Team Readiness Score | Interpretation |
|------|---------------------|----------------|
| **High Readiness** | 4.0 - 5.0 | Strong candidate for pilot; minimal barriers to adoption |
| **Moderate Readiness** | 3.0 - 3.9 | Viable with targeted support; training can close gaps |
| **Developing Readiness** | 2.0 - 2.9 | Needs foundational preparation before AI tool rollout |
| **Low Readiness** | 1.0 - 1.9 | Significant barriers; address prerequisites first |

---

## How Results Are Used

### Pilot Team Selection Criteria

The pilot team is selected based on a composite evaluation, not solely on the highest readiness score. The selection criteria are:

1. **Team Readiness Score of 3.0 or higher** -- Minimum threshold. Teams below this need foundational work first.
2. **Attitude sub-score of 3.5 or higher** -- The pilot team must be willing participants. A high-skill but low-enthusiasm team will not produce the demonstration effect needed for broader rollout.
3. **Process sub-score of 3.0 or higher** -- The team needs enough process maturity that AI augmentation integrates into existing workflows rather than adding chaos.
4. **Infrastructure availability** -- Approved AI tools must be accessible to the pilot team before the pilot begins.
5. **Scrum Master/Lead engagement** -- Qualitative factor based on the team lead's responses in Sections C5 and D3-D4, plus direct conversation.
6. **Team size and composition** -- The pilot team should include a mix of roles (BAs, Testers, Developers) to validate AI augmentation across multiple SDLC processes.

If multiple teams meet all criteria, prefer the team whose open-text responses (D5, D6) indicate specific, constructive ideas about where AI can help, as this suggests engaged critical thinking rather than passive acceptance.

### Training Priority Matrix

Assessment results drive training content prioritization for each team:

| Skills Sub-Score | Training Priority |
|-----------------|-------------------|
| Below 2.0 | **Fundamentals first** -- Start with AI literacy, basic prompting, understanding what AI tools can and cannot do |
| 2.0 - 3.0 | **Guided practice** -- Structured exercises with approved tools in role-specific SDLC processes |
| 3.0 - 4.0 | **Applied integration** -- Focus on augmenting existing workflows, advanced prompting, quality validation |
| Above 4.0 | **Peer leadership** -- These individuals can support teammates; focus on mentoring and best-practice sharing |

Training is customized by role using the breakdown from Section A3 (which SDLC processes people have or have not applied AI to) and Section B (specific skill gaps per role).

### Baseline for Measuring Attitude Change

The Attitude sub-score from this pre-pilot assessment is the baseline. The same four attitude questions (D1-D4) are re-administered:

- **Post-pilot** (to the pilot team only) -- Measures whether hands-on experience with the framework changed attitudes
- **Pre-rollout** (to all teams) -- Measures whether the pilot team's results and testimonials influenced attitudes across the organization
- **Post-rollout** (to all teams) -- Measures sustained attitude change after broader adoption

Attitude change is reported as:
- Delta per question (D1-D4 individually)
- Delta of the Attitude sub-score average
- Shift in the distribution (e.g., percentage of respondents moving from "Disagree" to "Agree")

This data provides quantitative evidence that the framework produces measurable cultural and behavioral change, not just tool usage.

---

## Distribution Plan

### Timeline

| Step | When | Owner |
|------|------|-------|
| Finalize assessment instrument | Before distribution | AI Transformation Leader |
| Create electronic form | 2 business days before distribution | AI Transformation Leader |
| Distribute to all team leads | Day 1 of collection window | AI Transformation Leader |
| Team leads communicate to their teams | Day 1-2 | Scrum Masters / Team Leads |
| Collection window open | 5 business days | All respondents |
| Reminder to incomplete respondents | Day 3 of collection window | Scrum Masters / Team Leads |
| Collection window closes | Day 5 | -- |
| Analysis and team scoring | Days 6-8 | AI Transformation Leader |
| Results presentation to engagement leadership | Day 10 | AI Transformation Leader |

### Collection Requirements

- **Target response rate:** 80% or higher per team for results to be considered representative
- **Confidentiality:** Individual responses are not shared with team leads or project management. Only team-level aggregates are reported.
- **Incomplete teams:** If a team falls below 80% response rate, extend their window by 2 business days with a direct communication from the team lead.

### Who Analyzes Results

The AI Transformation Leader owns analysis and reporting. The analysis deliverable includes:

1. **Team readiness scorecard** -- One page per team showing all sub-scores, readiness tier, and key findings
2. **Cross-team comparison** -- Ranked view of all teams on each dimension
3. **Pilot team recommendation** -- Recommended pilot team(s) with rationale mapped to selection criteria
4. **Concern themes** -- Categorized summary of open-text responses (D5, D6) across all teams
5. **Training plan inputs** -- Role-by-role skill gap summary driving training content priorities

Results are presented to engagement leadership before the pilot team is formally selected, allowing for discussion and any adjustments based on factors not captured in the assessment (e.g., upcoming team changes, sprint calendar constraints).

---

**Next:** [Chapter 5: Baseline Measurement](05-baseline-measurement.md) -- Capturing current delivery metrics before AI introduction
