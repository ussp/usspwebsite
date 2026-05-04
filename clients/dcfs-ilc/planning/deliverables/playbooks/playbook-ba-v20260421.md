# BA Playbook v0 — DCFS Illinois Connect AI Pilot

> **Version:** v0.1 — V20260421
> **Status:** DRAFT — pilot starter; will be refined with pilot learnings into v1.0 deliverable at end of pilot PI
> **Owner:** Vinay Lagisetty
> **Audience:** Krasan BAs participating in pilot, John (Agile Delivery Manager), Romi

---

## ⚠ Data Boundaries — Read Before Every Session

Before using any AI tool described in this playbook:

- **Never paste** DCFS case data, child names, case IDs, CANTS/CCWIS records, SSN, DOB, addresses, phone numbers, or any PII into a prompt — in any tool (Rovo, GitHub Copilot, M365 Copilot, D365 Copilot). **Even examples or "it's just for testing" cases are not acceptable.**
- **Keep prompts abstract.** Describe the problem shape, not the data. Use synthetic or redacted examples only.
- **Self-report near-misses.** If you realize you pasted something you shouldn't have, notify the Pilot Governance Lead via the Teams channel immediately. 1-hour CIO escalation per charter §9.
- **Weekly compliance check** (Pilot Governance §5.5) explicitly reviews prompt-drift incidents. Self-reporting is welcomed — no penalty for catching and flagging your own near-miss.
- **When in doubt, ask before submitting.** The AI Transformation Lead is available on the Teams channel.

---

## Change log

| Version | Date | Changed by | What changed |
|---------|------|-----------|--------------|
| v0.1 | 2026-04-21 | Vinay | Initial draft — Phase 1 scope, Rovo-focused, story-quality-as-bottleneck-lever framing |

---

## 1. Why BAs are a Phase 1 priority

DCFS testing is the bottleneck. Bad stories cause downstream rework AT testing, where rework is most expensive (5-10x cost vs. catching at refinement). **AI applied to story quality compounds AI applied to testing.**

Per Apr 13 informal testing by John:
- **Rovo writes tighter stories than Copilot** — likely because of Confluence integration giving project context
- **AI on bad stories produces worse stories** — AI amplifies skill, not replaces it
- **Less experienced BAs may not catch AI errors** — pair junior BAs with senior reviewers

**Implication:** This playbook assumes BA still owns story quality. AI is a force multiplier for an experienced BA, not a substitute for one.

---

## 2. Approved tools for BAs

| Tool | Use | Status |
|------|-----|--------|
| **Atlassian Rovo** | PRIMARY — story drafting, AC, refinement, summarization | Available on DCFS Jira/Confluence |
| **M365 Copilot** | Secondary — meeting notes, doc summarization, Outlook | Available |
| **GitHub Copilot** | Tertiary — only for technical BAs working on Power FX, JS snippets | When deployed |

**Not approved:** ChatGPT direct, Claude direct, any external LLM.

---

## 3. Use cases & prompt patterns

### 3.1 Story drafting from policy / source docs

**When:** Translating CCWIS requirements, IL Rule 431 sections, or ILC source policy docs into user stories.

**Tool:** Rovo (Confluence-aware)

**Prompt pattern:**
```
Using the [Confluence page link / attached doc], draft a user story for the
following requirement:

[Paste requirement text or link]

Format: "As a [role], I want [capability], so that [outcome]"
Include:
- Business context (1 sentence)
- 3-5 acceptance criteria in Given/When/Then format
- Out-of-scope items (1-2 bullets)
- Dependencies on other stories or systems (if any)

Constraint: Do not invent business rules. If a rule is unclear from the
source, flag it as "OPEN" rather than assumption.
```

**Quality check:** Did Rovo invent any business rule? Cross-reference every AC against source. If Rovo introduced anything not in the source, edit it out or convert to OPEN.

### 3.2 Acceptance criteria expansion

**When:** Story exists but AC is sparse or non-testable.

**Tool:** Rovo

**Prompt pattern:**
```
Story: [paste story]
Existing AC: [paste current AC]

Expand the AC to cover:
1. Happy path (primary user flow)
2. Validation rules (each input field)
3. Error states and messages
4. Permission/role-based variants
5. Boundary conditions (empty, max-length, special chars)
6. Audit/logging requirements

Format: Given/When/Then.
Mark each AC as "Functional", "Validation", "Permission", "Audit" so testers
can group their test cases.

Source: [link to relevant Confluence pages]
```

**Quality check:** Each AC must be testable as written — testers should not have to ask "what does this mean."

### 3.3 Story slicing

**When:** Story is too large for a single sprint or covers multiple personas/flows.

**Tool:** Rovo

**Prompt pattern:**
```
This story is too large: [paste story + AC]

Slice it into 2-4 stories that:
- Each delivers user-visible value (no purely technical splits)
- Can be completed independently within one sprint
- Have clear AC boundaries
- Follow vertical-slice principle (UI + logic + data, not horizontal layers)

For each slice: provide title, story, AC, and rationale for the split.
```

**Quality check:** Each slice must pass DoR independently. Don't accept slices that can't be tested without each other.

### 3.4 Definition of Ready (DoR) check

**When:** Before sign-off in Planning Board "Ready For Development" column.

**Tool:** Rovo

**Prompt pattern:**
```
Score this story against the DCFS Definition of Ready:

[paste story + AC + linked dependencies]

DoR checklist:
1. Story has clear user value statement
2. AC are testable (each one can produce pass/fail)
3. Dependencies on other stories/systems are identified
4. Mockups/wireframes attached (if UI)
5. Data model implications noted (if data)
6. Permission/role implications noted
7. Estimation discussed and agreed
8. No OPEN items in AC
9. Source documentation linked

Output: For each item, state PASS / FAIL / NEEDS REVIEW with one-sentence
reason. Then provide a DoR score (0-9) and overall recommendation
(Ready / Not Ready / Needs Refinement).
```

**Quality check:** Don't accept "PASS" from Rovo without your own visual confirmation of mockups/links. Rovo cannot see attachments — only what's in the story text.

### 3.5 Cross-reference dependencies

**When:** Refining a story that may interact with other teams' work.

**Tool:** Rovo

**Prompt pattern:**
```
Find Jira stories and epics related to: [topic / entity / capability]

Check across:
- Open epics in any team
- Stories in current PI (PI 26.1) and next PI (PI 26.2)
- Recently closed stories in last 2 sprints

Group by team. For each related item, note: relationship (depends on / blocks /
similar / supersedes), team owner, current status.

Source story: [link or paste]
```

**Quality check:** Verify every match by clicking through. Rovo may surface false positives based on keyword overlap.

### 3.6 Policy interpretation / summarization

**When:** Need to understand a CCWIS / IL Rule 431 / federal regulation section relevant to a story.

**Tool:** Rovo (with Confluence policy library access)

**Prompt pattern:**
```
Summarize the requirements relevant to [topic] from:
[Confluence page link or paste of policy text]

Output:
- Key requirements (bulleted, source citation per requirement)
- Mandatory vs. optional flags
- Exceptions or edge cases
- Implementation implications for ILC
- Open questions / ambiguities

Constraint: Cite source paragraph for every claim. If a claim is unsourced,
do not include it.
```

**Quality check:** Verify every cited paragraph. AI summarization can drift from source — never trust without source verification.

### 3.7 Refinement meeting prep

**When:** Preparing to lead a refinement session.

**Tool:** Rovo + M365 Copilot

**Prompt pattern (Rovo):**
```
For these stories scheduled for refinement next [date]:
[list of Jira keys]

For each: surface
- Open AC items
- Unresolved dependencies
- Linked discussion comments needing resolution
- Estimated discussion time (S/M/L)

Output a refinement agenda with stories ordered by priority and estimated time.
```

**Prompt pattern (M365 Copilot):**
```
Draft a Teams message inviting [team] to refinement on [date].
Include the agenda from Rovo and ask each attendee to review the linked
stories beforehand.
```

---

## 4. Workflow integration

### Where AI fits in the BA workflow

```
SOURCE DOC (CCWIS/IL Rule/policy)
      ↓
[ROVO — story drafting from source]
      ↓
DRAFT STORY (in "Awaiting Analysis")
      ↓
BA review + edit + ground in source
      ↓
[ROVO — AC expansion]
      ↓
STORY WITH AC (in "In Analysis")
      ↓
BA review + adjust + cross-check
      ↓
[ROVO — DoR check]
      ↓
DOR-PASSING STORY (in "Ready For Development")
      ↓
[ROVO — refinement prep] before refinement session
      ↓
TEAM REFINEMENT (BA leads, with Rovo-prepared materials)
      ↓
DOR SIGN-OFF → BACKLOG
```

### Tag every AI-touched story

Add Jira label `ai-assisted` to any story where Rovo (or Copilot) was used in drafting, AC, or DoR scoring. This is **required** for the AI vs. non-AI comparison at end of pilot.

Add a comment on the story: "AI-assisted with Rovo for [drafting / AC / DoR / cross-ref]." Brief, factual.

---

## 5. HITL discipline & DCFS guardrails

### Hard rules (Jim's constraints)

1. **No DCFS case data in any prompt** — no child names, case IDs, family details, dates of incidents, addresses. Ever. Even synthetic-looking data may be real.
2. **No security documentation in prompts** — security plans, vulnerability reports, network diagrams.
3. **Human-in-the-loop on every output** — every AI suggestion is reviewed by you before it lands in the story.
4. **No PII patterns** — SSN, DOB, phone numbers, even examples.
5. **Source-grounded** — if Rovo invents a business rule, edit it out.

### Soft rules (good practice)

- Don't paste full stories from other teams without their context
- Don't ask Rovo to "predict" what users will want — that's what BA discovery is for
- Don't accept Rovo output verbatim — always edit with your judgment
- Flag when Rovo trims meaningful detail (per Apr 13 lesson — Copilot does this; Rovo less so but watch for it)

### What to do if you suspect a leak

1. Stop using AI on that story
2. Note what was pasted
3. Notify Robert Rodriguez (AI policy bridge) immediately
4. Do not continue until reviewed

---

## 6. Success metrics for BA pilot participants

These are tracked from Jira + the existing weekly Preparation Metrics report (no new instrumentation needed).

### Throughput

| Metric | Source | Target |
|--------|--------|--------|
| Story points refined per BA per week | Prep Metrics report | +15% over baseline |
| Stories refined per BA per week | Prep Metrics report | +15% over baseline |
| % of next-PI scope refined N weeks before PI start | Prep Metrics report | Earlier readiness curve |

### Quality

| Metric | Source | Target |
|--------|--------|--------|
| % stories returned for clarification | Jira backward transitions | ↓ vs baseline |
| Story rework count per refined story | Jira changelog | ↓ |
| DoR pass rate on first review | Jira workflow | ↑ |
| % AC marked OPEN at sign-off | Jira AC field | ↓ |
| UAT rejection rate caused by AC ambiguity | Jira UAT failure analysis | ↓ |

### Self-reported

| Metric | Source | Target |
|--------|--------|--------|
| Time saved per refined story (hrs) | Weekly check-in survey | self-reported, trended |
| Confidence in AI output (1-5) | Monthly survey | ≥ 4 by Sprint 4 |
| Most useful AI use case (free text) | Monthly survey | informs Phase 2 |
| Most frustrating AI use case (free text) | Monthly survey | informs training updates |

---

## 7. Training emphasis

### Pre-pilot training (3h, before PI Planning)

| Module | Duration | Content |
|--------|----------|---------|
| Foundation (shared with all roles) | 1.5h | DoIT compliance, HITL discipline, what AI does/doesn't do, success criteria |
| BA-specific track | 3h | Rovo prompt patterns (the 7 above), live demo with 2 real stories, hands-on with redacted examples, prompt library walkthrough, anti-patterns |

### Ongoing training (weekly during pilot)

- 15-min "what worked / what didn't" share-out at weekly check-in
- Prompt library updated based on what BAs discover
- Pair junior BAs with senior reviewers — required for first 2 sprints

### Critical training emphases

- **How to spot when Rovo trims meaningful detail** — show before/after examples
- **How to ground prompts in source documentation** — bring the source to the prompt, don't ask Rovo to recall
- **How to enforce the OPEN convention** — never let assumptions become silent decisions
- **DoIT compliance refresh** — what data CANNOT go into prompts

---

## 8. Anti-patterns (what NOT to do)

| Anti-pattern | Why it's bad | What to do instead |
|--------------|--------------|-------------------|
| Pasting full Confluence pages and asking "summarize this" without specifying what for | Output is generic; loses signal | Ask for specific output (AC, dependencies, etc.) tied to a story |
| Accepting Rovo's first output without editing | AI amplifies your skill only if you exercise it | Treat first draft as exactly that — a draft to react to |
| Using AI to estimate story points | Estimation requires team knowledge AI doesn't have | Estimation is a team activity; AI doesn't substitute |
| Asking Rovo to "decide" between two design options | AI shouldn't make business/design decisions | Use AI to enumerate trade-offs; human decides |
| Removing the `ai-assisted` label after the story passes UAT | Skews the AI vs. non-AI comparison | Keep the label; that's how we measure |
| Pasting case data into a prompt to make it "more realistic" | Hard policy violation — child welfare data | Use synthetic/redacted examples; never real data |
| Sharing useful prompts privately, not with the team | Loses pilot learning | Share to the prompt library — it's a team product |

---

## 9. Open questions for this BA playbook

These need pilot-time answers — capture in `things-to-think-about` section of scope running book as they come up.

1. **What's the actual baseline for "story rework rate caused by AC ambiguity"?** Need root-cause analysis of last 2 PIs of bug data.
2. **Is Rovo Confluence content health uniform across teams?** Stale Confluence = poor Rovo output.
3. **Can BAs see Rovo per-user usage telemetry?** Otherwise we rely on self-report.
4. **Do all 12 teams use the same DoR checklist, or is it team-specific?** Affects whether the DoR-check prompt above is shareable.
5. **Are there existing prompt libraries from other Krasan engagements we can adapt?** Check with Dinkar's bench.
6. **Is BA refinement work captured in Tempo?** If yes, hours-per-refined-story becomes measurable. If not, self-report only.

---

## 10. Pilot participant checklist

Before you start using AI on a story:

- [ ] You completed the Foundation training (DoIT compliance, HITL discipline)
- [ ] You completed the BA track (3h)
- [ ] You have access to Rovo on DCFS Jira
- [ ] You have access to the Confluence space your team uses
- [ ] You have read this playbook end-to-end
- [ ] You understand the `ai-assisted` label requirement
- [ ] You know who your senior reviewer pair is (first 2 sprints only — for junior BAs)
- [ ] You know how to report a suspected data leak (notify Robert)
- [ ] You're tracking time saved per story in the weekly check-in

---

## Appendix A: Reference

| For details on... | See |
|-------------------|-----|
| Engagement scope, in/out, Phase 2/3 | [../scope-running-book-v04212026.md](../scope-running-book-v04212026.md) |
| Measurement methodology | [../measurement-methodology-v04142026.md](../measurement-methodology-v04142026.md) |
| Rollout plan + timeline | [../../rollout-plan.md](../../rollout-plan.md) |
| DoIT policy + governance | [../governance-proposal-v04142026.md](../governance-proposal-v04142026.md) |
| Risk register | [../assumptions-and-risks.md](../assumptions-and-risks.md) |
| Other role playbooks | [./](.) |
