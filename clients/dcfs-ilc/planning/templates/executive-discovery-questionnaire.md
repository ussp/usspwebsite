# DCFS ILC — Executive Discovery Questionnaire

> **Purpose:** Interview guide for CIO Jim Daugherty to identify which quality and productivity dimensions matter most to DCFS. The answers determine which metrics we track during the AI pilot.
> **When:** Before or during the Springfield trip (before PI Planning May 5-7)
> **Interviewer:** Vinay + Romi
> **Duration:** 30-45 minutes

---

## Introduction Script

> "Jim, before we finalize the measurement plan for the AI pilot, we want to make sure we're measuring what matters most to you and DCFS. We have a research-backed framework with multiple dimensions, but we don't want to measure everything — we want to focus on the dimensions that will prove value to your stakeholders. This conversation helps us design the right scorecard."

---

## Section 1: Defining Success

**1.1** When you picture the AI pilot being a success 6 months from now, what does that look like? What would you point to as evidence?

**1.2** Beyond the 5% productivity target, are there other outcomes that would make this a win?

**1.3** Who else needs to see the results? (Governor's office, DeWitt leadership, legislative oversight?) What would convince *them*?

**1.4** If you had to rank these three, what order?
  - [ ] Teams deliver more work per sprint (velocity/throughput)
  - [ ] The quality of what's delivered improves (fewer defects, better docs)
  - [ ] Teams are happier and more efficient in their daily work (satisfaction)

**1.5** What concerns you most about AI adoption across the teams?

---

## Section 2: Story & Requirements Quality

> *Context: Romi mentioned that story quality, BA productivity, and review cycle time are areas where AI could help.*

**2.1** How satisfied are you with the **quality of user stories** today? (1-5)
  - What's the biggest issue? (unclear requirements, missing AC, too vague, too large?)

**2.2** How long does it typically take for a story to go from **first draft to approved/ready-for-dev**?
  - Is that acceptable, or is it a bottleneck?

**2.3** What percentage of stories get **sent back for rework** after initial review?
  - Is that tracked anywhere today?

**2.4** Would you value a metric that measures **story quality against a checklist** (clarity, acceptance criteria completeness, testability, edge cases)?
  - [ ] Yes, very important
  - [ ] Nice to have
  - [ ] Not a priority

**2.5** How important is **planning accuracy** — are stories consistently sized correctly, or is there significant estimation variance?
  - [ ] Critical — we often miss commitments due to bad estimates
  - [ ] Moderate — some variance but manageable
  - [ ] Not a concern

---

## Section 3: Testing Quality

**3.1** How satisfied are you with **test coverage** today? (1-5)

**3.2** How long does it typically take to **create test scripts** for a 5-point story?

**3.3** What's your **first-pass yield** — what percentage of stories pass QA on the first attempt?

**3.4** Do you track **defect density** (bugs per story point) or **bug escape rate** (bugs found after sprint)?

**3.5** Which testing metric would be most valuable to improve?
  - [ ] Speed of test creation
  - [ ] Test coverage (% of AC with tests)
  - [ ] Test script quality (thoroughness)
  - [ ] First-pass yield (fewer defects)
  - [ ] All of the above

---

## Section 4: Documentation

**4.1** How important is **documentation** in your delivery assessment?
  - [ ] Critical — compliance/audit requires it
  - [ ] Important — teams reference it regularly
  - [ ] Secondary — working software matters more

**4.2** What percentage of completed features have **up-to-date Confluence documentation**?

**4.3** Would measuring **documentation coverage** (% of stories with updated docs) be valuable?

**4.4** Is the quality of documentation a concern, or just the existence of it?

---

## Section 5: Team Communication & Alignment

> *Context: Romi mentioned architect-to-dev communication as an area with room for improvement.*

**5.1** How well do architects communicate technical direction to dev teams? (1-5)

**5.2** How often do developers start work and then discover the requirements were misunderstood?

**5.3** Would you value a metric that captures **team alignment** — how clear requirements are when developers actually start working?

---

## Section 6: What's Already Measured

**6.1** What metrics does DCFS/ILC already track today?
  - [ ] Sprint velocity
  - [ ] Sprint burndown
  - [ ] Cycle time
  - [ ] Throughput
  - [ ] Bug counts
  - [ ] Test pass rates
  - [ ] Other: ___________

**6.2** Where is this data? (Jira reports, manual spreadsheets, PI reviews?)

**6.3** Are there metrics that leadership reviews regularly at PI boundaries or quarterly reviews?

**6.4** Is there a **JIRA dashboard** that tracks these today?

---

## Section 7: Measurement Approach

**7.1** For the pilot comparison (AI teams vs non-AI teams), which approach do you prefer?
  - [ ] Compare same teams before vs after (baseline approach)
  - [ ] Compare AI pilot teams vs control teams in same PI
  - [ ] Both

**7.2** How often would you like to see progress reports?
  - [ ] Weekly (during pilot)
  - [ ] Per sprint (every 2 weeks)
  - [ ] Monthly
  - [ ] At PI boundaries only

**7.3** What format works best for you?
  - [ ] Dashboard I can check anytime
  - [ ] Periodic report/deck
  - [ ] Both

**7.4** Would a real-time dashboard showing pilot progress be useful to you, or do you prefer periodic reports? What 3-4 numbers would you want to see at a glance?

---

## Section 8: Constraints & Guardrails

**8.1** We will apply human-in-the-loop on all AI output — developer reviews/edits/accepts every AI suggestion, and peer PR review and approval before commit. No autonomous AI commits. Are there any other specific restrictions?

**8.2** Can we access JIRA data programmatically (API) for automated metric collection, or must it be manual?

**8.3** Are there data sensitivity concerns with running metrics through the measurement tool? (The tool runs on USSP infrastructure, not DCFS)

**8.4** Are there specific state procurement or approval requirements for any tools beyond Copilot and Rovo?

---

## Section 9: DoIT AI Policy Compliance (CRITICAL — Must Clarify Before Pilot)

> *Context: The State of Illinois DoIT AI Policy (effective April 1, 2025) applies to all AI use by state agencies. Several sections have requirements that could be pilot-blocking if not already addressed. We need clarity on what DCFS has already done vs what we need to do.*

**9.1** Has DCFS already produced an **AI System Assessment Report** for GitHub Copilot and/or Atlassian Rovo?
  - If yes: can we get a copy?
  - If no: do we need to produce one before the pilot? (Policy Section 5f requires Agency Head signoff + 30-day DoIT advance notice)

**9.2** Has DCFS submitted the **30-day advance notice to DoIT** required before using these AI tools?
  - If yes: are we covered under that submission?
  - If no: this is a potential **30-day gate** before pilot can launch

**9.3** Does DCFS consider GitHub Copilot accessing ILC source code as "**use of State data for AI purposes**"? (Policy Section 5e)
  - If yes: has the Agency Head provided written consent?
  - Same question for Rovo accessing Jira/Confluence project data

**9.4** Has DCFS designated an employee to perform the **AI Policy functions** as required? (Policy Section 2 — required within 30 days of policy effective date)
  - Who is that person?
  - Should our pilot compliance flow through them?

**9.5** Does DCFS already have a **protected data classification** for ILC project data?
  - Is ILC source code considered Protected Data?
  - Are Jira stories/Confluence docs containing child welfare workflows considered Protected Data?
  - If yes: Section 4f requires written Agency Head authorization + 30-day DoIT notice before AI can access it

**9.6** Does DCFS have an existing **AI security incident reporting process**? (Policy Section 12)
  - If yes: should pilot participants use that process?
  - If no: should we help establish one for the pilot?

**9.7** Has DCFS already conducted or planned **bias and fairness reviews** for AI-assisted development tools? (Policy Section 11)
  - Are bias reviews expected per sprint? Per PI? Per incident only?

**9.8** Does DCFS have specific **disclosure/transparency requirements** for internal AI tool use? (Policy Section 5a-c)
  - Do team members need written notification that AI tools are being used?
  - Do deliverables need to be labeled as "AI-assisted"?

**9.9** What is the **escalation path** for AI-related concerns during the pilot? (Policy Section 8-9)
  - Should concerns go to the designated AI Policy employee? To Jim? To DoIT directly?

**9.10** Bottom line: **What do we need to deliver to DCFS before the pilot can start?**
  - Assessment report?
  - DoIT notification?
  - Agency Head written consent?
  - Training certification?
  - Or is this all already handled and we can proceed with our plan?

---

> **Why this matters:** The DoIT policy has a **30-day advance notice** requirement for several items. If those haven't been filed, the earliest the pilot can legally start is 30 days after we file. This could push the pilot past PI Planning (May 5-7) if we don't clarify NOW.

---

## After the Interview: Metric Selection Matrix

Based on Jim's responses, fill in:

| Metric | Jim's Priority | Data Available? | Effort to Collect | Include in Pilot? |
|--------|---------------|----------------|-------------------|------------------|
| Sprint velocity | | | | |
| Cycle time | | | | |
| Sprint predictability | | | | |
| Throughput | | | | |
| Bug escape rate | | | | |
| Story quality score | | | | |
| Story rejection rate | | | | |
| Story review cycle time | | | | |
| AC completeness | | | | |
| Test coverage % | | | | |
| Test script quality | | | | |
| Test creation time | | | | |
| Documentation coverage | | | | |
| Documentation quality | | | | |
| Defect density | | | | |
| Rework percentage | | | | |
| First pass yield | | | | |
| Planning accuracy | | | | |
| Requirement clarity | | | | |
| Architect-dev alignment | | | | |
| DORA (deploy freq, lead time, CFR, MTTR) | | | | |
| SPACE survey (5 dimensions) | | | | |
| DevEx survey (9 dimensions) | | | | |

**Rule of thumb:** Pick 8-12 metrics max. More than that dilutes focus and creates collection burden.

---

## Recommended Starter Set (if Jim doesn't have strong preferences)

**Velocity (3):** sprint velocity, cycle time, throughput
**Quality (4):** story quality score, story rejection rate, first pass yield, test coverage %
**Efficiency (2):** story review cycle time, test creation time
**Team Health (2):** SPACE survey (5 dimensions), requirement clarity
**Total: 11 metrics** — manageable, covers all dimensions Jim mentioned

---

*Prepared for the Springfield trip. Bring printed copies for Jim and take notes directly on this document.*
