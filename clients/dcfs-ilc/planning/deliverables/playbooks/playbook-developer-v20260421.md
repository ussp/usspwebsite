# Developer Playbook v0 — DCFS Illinois Connect AI Pilot

> **Version:** v0.1 — V20260421
> **Status:** DRAFT — pilot starter; will be refined with pilot learnings into v1.0 deliverable at end of pilot PI
> **Owner:** Vinay Lagisetty
> **Audience:** Krasan developers participating in pilot, Krishna (Senior Solution Architect), Darrin (Chief Solution Architect), John (Agile Delivery Manager), Romi

---

## ⚠ Data Boundaries — Read Before Every Session

Before using any AI tool described in this playbook:

- **Never paste** DCFS case data, child names, case IDs, CANTS/CCWIS records, SSN, DOB, addresses, phone numbers, or any PII into a prompt — in any tool (Rovo, GitHub Copilot, M365 Copilot, D365 Copilot). **Debug data, production logs, and real error payloads often contain PII — strip before pasting.**
- **Keep prompts abstract.** Describe the code problem or error pattern, not the data. Use synthetic/redacted examples.
- **Self-report near-misses.** If you realize you pasted something you shouldn't have, notify the Pilot Governance Lead via the Teams channel immediately. 1-hour CIO escalation per charter §9.
- **Weekly compliance check** (Pilot Governance §5.5) explicitly reviews prompt-drift incidents. Self-reporting is welcomed — no penalty for catching and flagging your own near-miss.
- **HITL is mandatory.** Every AI suggestion must be reviewed, edited or rejected by you before commit. Peer PR approval required before merge.
- **When in doubt, ask before submitting.** The AI Transformation Lead is available on the Teams channel.

---

## Change log

| Version | Date | Changed by | What changed |
|---------|------|-----------|--------------|
| v0.1 | 2026-04-21 | Vinay | Initial draft — Phase 1 scope, Copilot-focused, D365/.NET/PCF/Power Platform, mandatory HITL discipline |

---

## 1. Why developers are a Phase 1 role (but not the headline lever)

Per the Apr 21 walkthrough — **testing is the bottleneck, not development.** Multiple sprints show high dev throughput followed by 0 stories clearing testing/UAT.

That means: **AI-assisted dev productivity gains, by themselves, won't move the headline % Work Completed metric.** They build dev capacity that the team can deploy once the bottleneck eases.

**Why developers are still in Phase 1:**
1. Build dev capacity in parallel — when bottleneck clears, teams can absorb scope expansion
2. Earlier-stage defect catching (unit tests with Copilot) reduces what reaches Test stage — direct bottleneck contribution
3. Rapid documentation generation removes a chronic time sink
4. Bug investigation acceleration shortens the dev → test → fix loop

**Critical constraint (Jim's hard rule):** AI CAN write production code. Developer reviews/edits/accepts every suggestion. Standard peer review + PR approval before commit. **No autonomous commits, ever.**

---

## 2. Approved tools for developers

| Tool | Use | Status |
|------|-----|--------|
| **GitHub Copilot** (multi-model: OpenAI, Gemini, Claude via Copilot) | PRIMARY — code completion, chat, refactoring | When deployed (R-04) |
| **Copilot Chat** | Explanation, review, debugging, design discussion | When deployed |
| **D365 Power Platform AI** (Power FX Copilot) | Power Apps formula generation, Power Automate flow building | Available |
| **Atlassian Rovo** | Story context, AC reference, Confluence cross-ref while coding | Available |
| **M365 Copilot** | Email, Teams, Outlook, doc summarization | Available |

**Not approved:** ChatGPT direct, Claude direct, any external LLM.

---

## 3. Use cases & prompt patterns

### 3.1 Dynamics 365 plugin (C#)

**When:** Building a server-side plugin for D365 business logic.

**Tool:** Copilot in Visual Studio + Copilot Chat for design

**Prompt pattern (Copilot Chat, design):**
```
I need a D365 plugin for the [Account / Contact / custom entity] entity.

Trigger: [Create / Update / Delete] on [stage: pre-validation, pre-operation,
post-operation]

Business requirement: [paste from story AC]

Constraints:
- Synchronous execution (per existing pattern in our codebase)
- No external HTTP calls (offline-safe)
- Must respect security context of triggering user
- Must log to plugin trace log on error
- Follow our existing plugin base class pattern: [paste base class signature]

Generate:
- Plugin class scaffold inheriting our base
- Step registration metadata (entity, message, stage, filtering attributes)
- Pseudocode for the business logic before the actual implementation
- Test scenarios (for unit test generation later)

Do not generate the implementation yet — let me review the design first.
```

**Then for implementation (Copilot inline):**
```
// [paste reviewed pseudocode]
// Implement the plugin per the design above. Use Dataverse SDK 9.x.
// Use IOrganizationService for queries, not Web API.
// Throw InvalidPluginExecutionException with user-friendly messages on validation failures.
```

**HITL checklist (mandatory before commit):**
- [ ] Read every line of generated code
- [ ] Confirm SDK calls match our codebase conventions
- [ ] Confirm no hardcoded GUIDs / magic strings
- [ ] Confirm exception handling follows our pattern
- [ ] Wrote at least one unit test before commit
- [ ] PR submitted, peer review passed

### 3.2 JavaScript / PCF controls

**When:** Building or modifying form scripts, ribbon scripts, or PCF (PowerApps Component Framework) custom controls.

**Tool:** Copilot

**Prompt pattern (form script):**
```
Generate a D365 form script for the [entity] form.

Trigger: [OnLoad / OnSave / OnChange of field X]
Behavior: [paste AC]

Constraints:
- Use formContext (not Xrm.Page — modern UI required)
- Async/await for any Web API calls
- Use Xrm.WebApi for queries (not OData direct)
- Show user notifications via formContext.ui.setFormNotification
- Follow our naming: function names prefixed with "ilc_"

Generate the function. Add JSDoc.
```

**Prompt pattern (PCF control):**
```
Generate a PCF control for [purpose].

Manifest requirements:
- Bound to: [entity attribute type]
- Configuration properties: [list]
- Resources: [JS, CSS, images]

Component logic: [describe]

Generate:
- ControlManifest.Input.xml
- index.ts (TypeScript) with init, updateView, getOutputs, destroy
- CSS file with our design system tokens [paste tokens or link]

Use React inside the PCF (we use React for complex controls).
```

**HITL checklist:**
- [ ] Verify Xrm API calls match our wrapper conventions
- [ ] Test in browser dev tools before deploy
- [ ] Run accessibility check (NVDA + AXE) — required for any UI
- [ ] PR submitted, peer review passed

### 3.3 Power Platform formulas (Power FX)

**When:** Working in Power Apps canvas apps or Power Automate flows.

**Tool:** Power Platform AI Copilot (built into the maker experience) + GitHub Copilot for surrounding logic

**Prompt pattern (Power Apps Copilot):**
```
[Use the in-product Copilot prompt — keep prompts business-language]

Example: "Filter the Cases gallery to show only cases assigned to the
current user that are open and were modified in the last 30 days."

Then review the generated Power FX expression. Power FX is unique — verify
function signatures against the official Power FX reference.
```

**HITL checklist:**
- [ ] Verify Power FX functions exist (Copilot can hallucinate function names)
- [ ] Test the formula with real-shaped data (synthetic, not real)
- [ ] Confirm delegation warnings addressed
- [ ] Document the formula intent in the app comments

### 3.4 Unit test generation

**When:** Writing tests alongside code (do this for every story — pushes defect catches earlier).

**Tool:** Copilot (in Visual Studio with test framework loaded)

**Prompt pattern:**
```
Generate unit tests for this method:

[paste method]

Test framework: xUnit (or MSTest — match project)
Mocking: Moq (or FakeXrmEasy for Dataverse)

Cover:
1. Happy path — valid input, expected output
2. Each guard clause — null inputs, invalid state, missing dependencies
3. Boundary cases — empty collections, max-length strings, zero/negative numbers
4. Each branch in the method
5. Error paths — what happens when downstream call throws

For Dataverse-touching code, use FakeXrmEasy to mock IOrganizationService.

Each test:
- Arrange / Act / Assert sections clearly marked
- One logical assertion per test (multiple physical asserts OK if one logical)
- Test name format: MethodName_Condition_ExpectedResult
```

**HITL checklist:**
- [ ] Run all tests; verify they pass for the right reasons
- [ ] Verify negative tests fail when assertion is removed (mutation check)
- [ ] Coverage tool shows expected branches covered
- [ ] No test depends on real Dataverse / external service

### 3.5 Code review (self-review before PR)

**When:** Before submitting a PR, especially for AI-assisted code.

**Tool:** Copilot Chat

**Prompt pattern:**
```
Review this code for:

1. Bugs — logic errors, race conditions, null deref risks
2. Security — input validation, injection risks (SQL, XSS), secret exposure
3. Performance — N+1 queries, unbounded loops, large in-memory ops
4. Maintainability — clarity, naming, single-responsibility
5. Conventions — does it match our team patterns?
6. Tests — is the change adequately tested?
7. Documentation — does the code need comments? Is the README affected?

[paste code or PR diff]

Our team conventions: [paste link or summary]

Output as a checklist with PASS / NEEDS WORK / NOT APPLICABLE per item,
with one-sentence reason for any NEEDS WORK.
```

**HITL checklist:**
- [ ] Review every "NEEDS WORK" item — fix or document why ignored
- [ ] Don't suppress findings without justification in the PR description
- [ ] Self-review is NOT a substitute for peer review

### 3.6 Refactoring

**When:** Cleaning up legacy code, reducing duplication, modernizing patterns.

**Tool:** Copilot + Copilot Chat

**Prompt pattern:**
```
Refactor this code to:

[paste refactoring goal — e.g., "extract the validation logic into a
separate method", "replace the if/else chain with a strategy pattern",
"convert sync to async/await"]

Code:
[paste]

Constraints:
- Behavior must be identical (no functional changes)
- All existing tests must continue to pass
- Don't introduce new dependencies without flagging
- Match our code style: [paste link to style guide]
- Make changes in small, reviewable chunks (one concept per commit)

Output the refactored code with a brief explanation of what changed and why.
```

**HITL checklist:**
- [ ] Existing tests pass without modification (proves behavior preserved)
- [ ] Add tests for the refactored seams
- [ ] PR description explains the refactor and the value
- [ ] If the diff is large, split into multiple PRs

### 3.7 Documentation

**When:** Writing README, API docs, code comments, or design docs.

**Tool:** Copilot Chat for drafts; Rovo for Confluence integration

**Prompt pattern (code → README):**
```
Generate a README.md section for this module:

[paste relevant code or describe the module]

Include:
- Purpose (1 paragraph)
- Architecture diagram (Mermaid syntax)
- API reference (per public method: signature, params, returns, throws,
  example usage)
- Configuration (env vars, settings, secrets — note where they're stored,
  not the values)
- How to run locally (assume our standard dev setup)
- How to run tests
- Known limitations / gotchas

Keep it focused. Don't repeat what the code already says.
```

**Prompt pattern (story → Confluence) using Rovo:**
```
Update the Confluence page [link] with the changes from this completed story:

Story: [Jira key]
What changed: [brief description]
Affected sections of the page: [list]

Preserve the existing page structure. Add a "Changes" section at the bottom
with date and Jira link.
```

**HITL checklist:**
- [ ] Verify code examples in docs actually compile/run
- [ ] Verify API signatures match real method signatures (Copilot can drift)
- [ ] No real env var values in docs — placeholders only

### 3.8 Bug investigation

**When:** New bug assigned; need to find root cause.

**Tool:** Copilot Chat

**Prompt pattern:**
```
I'm debugging this issue:

Symptom: [paste defect description]
Stack trace: [paste]
Recent changes (last 7 days) to affected area: [paste git log or PR list]
Reproduction steps: [paste]

Help me:
1. Identify the most likely root cause area (file/method) based on stack trace
2. Suggest 3 hypotheses for what could cause this
3. For each hypothesis, suggest the smallest test to confirm/refute
4. Note any similar patterns in our codebase that might be related

Constraint: Don't suggest fixes yet — I want to confirm the cause first.
```

**HITL checklist:**
- [ ] Verify the suggested file/method actually exists and is reached by the code path
- [ ] Confirm hypothesis with a real test before implementing fix
- [ ] Document the root cause in the bug ticket (so future devs learn)

---

## 4. Workflow integration

### Where AI fits in the dev workflow

```
STORY ASSIGNED (in "Sprint Backlog" → "In Development")
      ↓
[ROVO — pull story context, linked Confluence pages, AC]
      ↓
[COPILOT CHAT — design discussion / pseudocode review]
      ↓
DESIGN APPROVED (mental or quick chat with peer)
      ↓
[COPILOT — code generation, line by line, with HITL on every accept]
      ↓
[COPILOT — generate unit tests alongside the code]
      ↓
LOCAL TEST PASSES
      ↓
[COPILOT CHAT — self-review before PR]
      ↓
PR SUBMITTED → peer review (human, no AI substitute) → approval
      ↓
COMMIT (only after PR approval)
      ↓
Story moves to "Queued For Test Release"
```

### Tag every AI-touched commit and PR

- **In commit message:** Add `[AI-assisted]` tag if Copilot suggested >25% of the code in the commit
- **In PR description:** Add a section "AI Assistance: [tool] used for [tasks]; X% of code AI-suggested vs. human-written"
- **In Jira story:** Add label `ai-assisted`

This is required for the AI vs. non-AI comparison at end of pilot.

---

## 5. HITL discipline & DCFS guardrails — CRITICAL

This is the most important section of this playbook. Jim's hard constraint: **every AI suggestion is reviewed by a developer + standard peer review + PR approval before commit. No autonomous commits.**

### Hard rules

1. **No autonomous commits, ever.** Even for trivial changes. Human reviews + PR.
2. **No DCFS case data in prompts** — no child names, case IDs, family details, real addresses, real DOB, real SSN.
3. **No security documentation in prompts** — security plans, vuln reports, network diagrams, secrets, connection strings.
4. **No production data as test data** — synthetic only.
5. **Every AI-assisted commit must be tagged** — `[AI-assisted]` in commit message.
6. **Peer review must include the AI portion** — reviewer should treat AI-assisted code with normal scrutiny, not skip it.
7. **No copy-paste of proprietary code into AI prompts that route to external models** — Copilot's enterprise tier is approved; verify your prompts go through the enterprise proxy.

### Soft rules

- Don't accept Copilot's first suggestion without reading it
- Don't accept long blocks (>10 lines) without thinking through what they do
- Don't suppress Copilot Chat review findings without documented reason
- Don't use AI to write the test AND the implementation simultaneously without independent verification
- Treat 100% Copilot acceptance rate as a yellow flag — you may not be reviewing
- Treat <20% acceptance rate as a yellow flag — you may not be using it for the right tasks

### What to do if you suspect a leak

1. Stop using AI in the affected code area
2. Note exactly what was pasted (don't paste it again to recall)
3. Notify Robert Rodriguez immediately
4. Do not commit / push the affected code until reviewed

### What to do if Copilot generates something that looks like real data

1. Don't commit it
2. Regenerate with explicit "use only synthetic data" instruction
3. If it persists, report to Vinay — may indicate training data contamination

---

## 6. Success metrics for developer pilot participants

Tracked from Git/Azure DevOps + Copilot admin telemetry + Tempo + Jira.

### Productivity

| Metric | Source | Target |
|--------|--------|--------|
| Lines of AI-assisted code accepted per dev per sprint | Copilot admin | trended |
| Story points completed per dev per sprint | Jira velocity | +10-15% over baseline |
| Hours per story point (Tempo) | Tempo | -10-15% over baseline |
| PR cycle time (open → merged) | Azure DevOps Repos | -10% |
| Documentation lines per sprint | Git diff on doc files | trended |

### Quality (guardrails — must not regress)

| Metric | Source | Target |
|--------|--------|--------|
| Defects caught at Dev stage (unit tests, self-review) | Jira "found in" | ↑ (earlier catch) |
| Defects escaping to Test stage from this dev's stories | Jira | flat or ↓ |
| Defects escaping to UAT/Prod | Jira | flat or ↓ |
| Review iterations per PR | Azure DevOps | flat (NOT ↑ — would suggest AI code is buggy) |
| Code coverage delta on touched files | Coverage tool | flat or ↑ |
| Static analysis findings (SonarQube) per KLOC | SonarQube | flat or ↓ |

### Adoption / activity

| Metric | Source | Target |
|--------|--------|--------|
| Copilot acceptance rate | Copilot admin | 40-70% (avoid 100% — not reviewing) |
| Copilot active days per week | Copilot admin | 4-5 |
| % commits tagged `[AI-assisted]` | Git log scan | trended |
| % PRs with AI Assistance section filled in | PR review | 100% (compliance) |

### Self-reported

| Metric | Source | Target |
|--------|--------|--------|
| Time saved per story (hrs) | Weekly check-in | self-reported, trended |
| Confidence in AI code (1-5) | Monthly survey | ≥ 4 by Sprint 4 |
| Hardest tasks for AI (free text) | Monthly survey | informs Phase 2 |

---

## 7. Training emphasis

### Pre-pilot training (3h, before PI Planning)

| Module | Duration | Content |
|--------|----------|---------|
| Foundation (shared) | 1.5h | DoIT compliance, HITL, success criteria |
| Developer track | 3h | Copilot in VS, Copilot Chat workflows, prompt patterns (the 8 above), HITL discipline drills, anti-patterns, accessibility considerations, security review |

### Critical training emphases

- **HITL discipline** — drill the workflow until it's habit. The biggest pilot risk is autonomous commits.
- **Reading AI-generated code** — slow down on long blocks; read before accepting
- **D365 plugin patterns** — Copilot needs your codebase patterns as reference; build a "good examples" file
- **Power FX peculiarities** — Copilot can hallucinate Power FX function names; verify against reference
- **Eggplant DSL** (if you write tests) — see Tester playbook
- **Synthetic data** — what real-vs-synthetic looks like
- **Commit/PR tagging** — `[AI-assisted]` discipline is required for measurement

---

## 8. Anti-patterns

| Anti-pattern | Why it's bad | What to do instead |
|--------------|--------------|-------------------|
| Accepting long Copilot suggestions without reading | The biggest HITL risk; Jim's hard constraint | Read every line; reject if you can't explain it |
| Pasting connection strings, secrets, env vars, or PII into prompts | Hard policy violation | Use placeholders; never paste real secrets |
| Letting Copilot autocomplete without thinking | You stop being the engineer | Pause; think; then accept or reject |
| Removing the `[AI-assisted]` tag because it "looks bad in PRs" | Skews comparison; hides the truth | Tag accurately; the data is the point |
| Using Copilot to write a test that asserts the same thing the code under test does | Tautological — test always passes | Human owns the assertion |
| Generating a refactor that changes behavior without realizing | Silent regression | Existing tests must still pass without modification |
| Skipping peer review for "trivial AI-generated changes" | Trivial-looking AI code can have subtle bugs | Peer review every PR, no exceptions |
| Pasting another team's code without their context | Out-of-context suggestions; potential cross-team confusion | Stick to your team's codebase or ask the owner |
| Asking Copilot to "fix" a failing test by changing the assertion | Defeats the test's purpose | Fix the code; if the test is wrong, document why and rewrite carefully |
| Trusting Copilot Chat's "this is secure" assessment without security review | False confidence | Use security training + threat modeling; don't outsource security to AI |

---

## 9. Open questions for this Developer playbook

1. **When does Copilot deploy to ILC teams?** (R-04 blocker)
2. **What Copilot tier is purchased?** (Business / Enterprise — affects telemetry availability)
3. **Is Copilot Chat enabled in addition to inline?**
4. **Does Section 5e require Agency Head consent for Copilot to access ILC source?** (R-05 blocker)
5. **What's the existing PR template?** Need to add the AI Assistance section.
6. **Are there existing "good examples" files per pattern (plugin, PCF, etc.)?** AI prompts work much better with these as reference.
7. **What's the SonarQube setup?** Need baseline for quality guardrails.
8. **What's the unit test coverage baseline per repo?** Need pre-pilot snapshot.
9. **Who's the security champion per team?** AI-generated code needs extra security review.
10. **Is there a code review checklist?** AI Assistance review should be appended.

---

## 10. Pilot participant checklist

Before you start using AI on dev work:

- [ ] Foundation training complete
- [ ] Developer track complete
- [ ] Copilot deployed and signed in (verify enterprise proxy)
- [ ] Copilot Chat enabled
- [ ] Rovo access on DCFS Jira/Confluence
- [ ] Read this playbook end-to-end
- [ ] HITL discipline drill completed (Vinay-led)
- [ ] PR template updated with AI Assistance section
- [ ] Commit message tagging convention understood
- [ ] `ai-assisted` Jira label workflow understood
- [ ] Know how to report a suspected leak (Robert)
- [ ] Synthetic data conventions understood (see Tester playbook 3.2)
- [ ] Tracking time saved in weekly check-in

---

## Appendix A: Reference

| For details on... | See |
|-------------------|-----|
| Engagement scope, in/out, Phase 2/3 | [../scope-running-book-v04212026.md](../scope-running-book-v04212026.md) |
| Measurement methodology | [../measurement-methodology-v04142026.md](../measurement-methodology-v04142026.md) |
| Rollout plan + timeline | [../../rollout-plan.md](../../rollout-plan.md) |
| DoIT policy + governance | [../governance-proposal-v04142026.md](../governance-proposal-v04142026.md) |
| Code generation policy | [../code-generation-policy-review.md](../code-generation-policy-review.md) |
| Risk register | [../assumptions-and-risks.md](../assumptions-and-risks.md) |
| Other role playbooks | [./](.) |
