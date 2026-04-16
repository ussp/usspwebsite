# DCFS ILC — Architecture & Process Discovery Questions

> **Purpose:** Understand current-state processes, identify AI opportunities, and map future-state workflows for the AI Transformation engagement.
> **Meeting type:** Internal Krasan — gathering information for transformation planning
> **Date:** April 2026
> **Prepared by:** Vinay Lagisetty (AI Transformation Leader)

---

## 1. Development Stack & Environment

- What is the tech stack? (.NET, Java, Dynamics 365 — versions?)
- What IDE does the team use? (Visual Studio, VS Code — relevant for Copilot integration)
- Where does source code live? (GitHub, Azure DevOps, Bitbucket — relevant for Copilot licensing)
- What is the branching strategy? (affects where AI-generated code enters the pipeline)
- Is there a sandbox/dev environment separate from State production?

---

## 2. SDLC & Tooling

- Walk me through a story from backlog to production — what tools touch it at each step?
- Where are stories and acceptance criteria written? (JIRA, Azure DevOps, Confluence?)
- How are test cases managed? (manual, automated, what framework?)
- What does the CI/CD pipeline look like? (build, test, deploy — automated or manual gates?)
- Where does documentation live?
- What does the definition of done look like for a typical story?

---

## 3. Current Process — By Role

### 3a. Story Writing (BA-Technical)

- How does a story go from requirement to ready-for-dev? Who writes acceptance criteria?
- How long does it take to write a well-groomed story with ACs?
- What is the biggest bottleneck — understanding requirements, writing ACs, getting approval?
- How much rework happens after stories go to dev? (stories coming back for clarification)
- Are there templates or standards for story writing?
- How are stories prioritized and assigned?

### 3b. Development

- When a dev picks up a story, what is their typical workflow? (read story > write code > test > PR > review)
- How much time is spent writing code vs reading/understanding existing code?
- How much time on documentation? (inline comments, API docs, Confluence pages)
- What does code review look like? How long does a PR sit before review?
- How much boilerplate or repetitive code exists?
- What are the most common types of bugs? Where do they originate?
- Are there coding standards or linting rules enforced?

### 3c. Testing

- How are test cases written? From ACs? From requirements? From code?
- Manual vs automated testing — what is the split?
- How long does it take to write test cases for a typical story?
- What is the defect rate? Where do defects usually come from?
- What testing tools are in use? (Selenium, Postman, manual scripts?)
- Is there regression testing? How is it managed?

### 3d. Configuration (Dynamics 365)

- Which Dynamics modules are in scope? (CE, F&O, custom?)
- How much is configuration vs custom code?
- How are config changes designed and documented?
- Is there a config spec before implementation, or is it done directly in the system?
- How are config changes tested before moving to production?
- What is the config deployment process? (solution transport, managed/unmanaged?)
- How much of the work is repetitive setup vs complex logic?

### 3e. Scrum Master

- How are sprint ceremonies run today? (planning, standup, retro, demo)
- How are impediments tracked and escalated?
- How much time on reporting and metrics?
- How are retrospective action items tracked? Do they get completed?
- What tools does the SM use day-to-day?

---

## 4. Where AI Can Help — "Where Does Time Go?"

*Ask each role:*

- What takes the most time that feels repetitive or mechanical?
- What do you wish you had help with that you don't have time for?
- Where do mistakes happen most often?
- What would you do with an extra 2 hours per sprint?
- Is there any work that gets skipped because there isn't enough time? (documentation, tests, code review depth)

---

## 5. Future Process — "What Could It Look Like?"

*Don't present solutions — plant seeds and gauge reactions:*

- If a tool could draft acceptance criteria from a requirement summary, would that help or get in the way?
- If code suggestions appeared as you typed, would that speed you up or distract you?
- If test cases were auto-generated from ACs, would you trust them enough to start from?
- If sprint reports were auto-generated from JIRA data, would that save meaningful time?
- If config specs could be drafted from requirements, would that reduce errors?
- If retrospective summaries and action items were auto-generated, would that be useful?

---

## 6. Team Structure & People

- How many developers, testers, BAs, config specialists, SMs across the 12 teams?
- How are teams organized? (feature teams, component teams, platform team?)
- Do all teams follow the same process or do some have different workflows?
- Who are the most experienced people on each team? (potential AI champions)
- What is the team's general attitude toward AI tools? (excited, skeptical, neutral?)
- Has anyone on the team already used AI tools informally?

---

## 7. Data & Security

- What data does the team touch day-to-day? (helps define AI guardrails)
- Is source code considered State data? (directly relates to Section 5e blocker)
- What is the code classification? (public, internal, confidential?)
- Any existing DLP or data loss prevention tools in place?
- Are there restrictions on what can be pasted into external tools?

---

## 8. Current AI Tool Status

- Is GitHub Copilot deployed? What tier (Business/Enterprise)? Which teams have access?
- Is Rovo / Confluence AI available? Who has licenses?
- Has anyone on the team already used AI tools informally?
- Any past AI experiments or POCs? What happened?
- Are there any other AI tools in use or under evaluation?

---

## 9. Metrics & Access

- Can we get JIRA access for baseline data pulls? (need to contact Matt/RTE)
- What metrics does the team already track? (velocity, cycle time, defect rate?)
- Is there a Power BI or reporting setup we can tap into?
- Who approves external tool access for measurement dashboards?
- How many sprints of historical data are available?

---

## 10. Constraints

- What cannot change? (processes, tools, team structure that are fixed)
- Are there upcoming releases or freezes we need to work around?
- Any compliance audits or reviews scheduled during the pilot window (May-Aug)?
- Are there any contractual constraints on AI tool usage?
- What approvals are needed to change the development workflow?

---

## Capture Framework

For each process discussed, capture:

| Current Process | Time Spent | Pain Point | AI Opportunity | Tool | Expected Benefit |
|---|---|---|---|---|---|
| BA writes ACs manually | 2-3h/story | Rework when ACs ambiguous | Rovo drafts ACs from requirements | Rovo | Reduce rework, faster grooming |
| Dev writes unit tests | 1-2h/story | Tedious, often skipped | Copilot generates test stubs | Copilot | Better coverage, less time |
| Test case creation | 1-2h/story | Manual, inconsistent | Generate from ACs | Copilot/Rovo | Consistent coverage |
| Config documentation | 30min-1h | Often skipped | Auto-generate from config | Copilot | Better audit trail |
| Sprint reports | 1-2h/sprint | Manual JIRA extraction | Auto-generate from JIRA | Rovo | SM time freed up |

---

## Closing Question

> "If this AI pilot succeeds and we could show Jim a 10-15% improvement by July 20 — which process, if improved, would be the most visible and convincing to leadership?"

---

## Notes

*(Capture answers during the meeting below)*



