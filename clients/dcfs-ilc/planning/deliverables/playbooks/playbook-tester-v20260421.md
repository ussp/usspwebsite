# Tester (QA) Playbook v0 — DCFS Illinois Connect AI Pilot

> **Version:** v0.1 — V20260421
> **Status:** DRAFT — pilot starter; will be refined with pilot learnings into v1.0 deliverable at end of pilot PI
> **Owner:** Vinay Lagisetty
> **Audience:** Krasan Testers/QA participating in pilot, John (Agile Delivery Manager — testing focus), Romi

---

## ⚠ Data Boundaries — Read Before Every Session

Before using any AI tool described in this playbook:

- **Never paste** DCFS case data, child names, case IDs, CANTS/CCWIS records, SSN, DOB, addresses, phone numbers, or any PII into a prompt — in any tool (Rovo, GitHub Copilot, M365 Copilot, D365 Copilot). **Test data that mirrors production patterns counts — use synthetic data only.**
- **Keep prompts abstract.** Describe the test scenario shape, not the data. Synthetic/redacted test cases only.
- **Self-report near-misses.** If you realize you pasted something you shouldn't have, notify the Pilot Governance Lead via the Teams channel immediately. 1-hour CIO escalation per charter §9.
- **Weekly compliance check** (Pilot Governance §5.5) explicitly reviews prompt-drift incidents. Self-reporting is welcomed — no penalty for catching and flagging your own near-miss.
- **When in doubt, ask before submitting.** The AI Transformation Lead is available on the Teams channel.

---

## Change log

| Version | Date | Changed by | What changed |
|---------|------|-----------|--------------|
| v0.1 | 2026-04-21 | Vinay | Initial draft — Phase 1 scope, bottleneck-focused, Eggplant + Zephyr + Postman tooling, defect triage |

---

## 1. Why testers are the most important Phase 1 role

**Testing is the bottleneck at DCFS.** Multiple recent sprints show high commitment with 0 completed (e.g., IPT_PI25.1.3: 39 SP committed, 0 completed; IPT_PI25.1.4: 37 SP, 0 completed) — work is stuck after development. The PI completion sits at 67% against 71% time elapsed.

**Implication:** AI for testers moves the headline number. AI for devs without AI for testers creates more WIP at the bottleneck. The pilot's productivity story rests heavily on this role.

Per Apr 21 walkthrough — the proposed V3 workflow splits testing into `Testing → Integration → Acceptance Testing → Acceptance Testing Complete`, with sub-stage markers (DEV unit / TEST functional / INT smoke / UAT). This finer granularity is measurement-rich for AI impact attribution once V3 stabilizes.

---

## 2. Approved tools for testers

| Tool | Use | Status |
|------|-----|--------|
| **Atlassian Rovo** | Test case generation from AC; defect triage; report writing | Available |
| **GitHub Copilot** | Test scripts (Eggplant, Selenium, Postman), test data | When deployed |
| **Zephyr** | Test case management (existing) | Already in use |
| **Eggplant** (Keysight) | UI test automation | Already in use; Selenium being migrated to it |
| **Postman** | API testing | Already in use |
| **AXE / NVDA / Color Contrast** | Accessibility testing | Already in use |

**Not approved:** ChatGPT direct, Claude direct, any external LLM.

---

## 3. Use cases & prompt patterns

### 3.1 Test case generation from acceptance criteria

**When:** Story moves from "Ready For Development" to your test case authoring queue.

**Tool:** Rovo (story-aware) → export to Zephyr

**Prompt pattern:**
```
Story: [paste story]
Acceptance Criteria: [paste all AC]

Generate test cases covering:
1. Each AC — happy path
2. Validation rules — negative tests for each input field
3. Permission/role variants — for each user role mentioned
4. Boundary conditions — empty, max-length, special chars, edge dates
5. Error states — what error message for what failure
6. Audit/logging — confirm expected log entry per action
7. Cross-functional — performance baseline, accessibility check

For each test case: provide
- Test ID (format: TC-{story-key}-{NN})
- Title (action-oriented)
- Preconditions
- Steps (numbered, atomic)
- Expected result
- Test type (Functional / Validation / Permission / Boundary / Error / Audit / NFR)
- Priority (P1 / P2 / P3)

Output in a format I can paste into Zephyr.
```

**Quality check:**
- Does every AC have at least one test case?
- Are negative tests included, not just happy path?
- Are test cases atomic (one assertion per test) or compound (avoid)?
- Verify test types are correctly tagged for Zephyr filtering

### 3.2 Test data generation

**When:** Need synthetic data for a test case (e.g., new case record, family relationships, address variants).

**Tool:** Copilot (with Dataverse schema reference)

**Prompt pattern:**
```
Generate synthetic test data for the following Dataverse entity:

Entity: [entity name]
Schema: [paste entity definition or attach]

Generate [N] records covering:
- Required fields populated
- Optional field variants (some present, some absent)
- Boundary values (max-length strings, edge dates, max numeric)
- Special character handling (apostrophes in names, hyphens, accents)
- Relationship fields linked to placeholder GUIDs

CRITICAL: Use only synthetic / clearly-fake data. No real names, no real
addresses, no real SSN, no real DOB. Use:
- Names: "Test_Family_001 Person_001" pattern
- Addresses: "123 Test St, Springfield IL 62701" pattern
- SSN: "XXX-XX-XXXX" placeholder format only
- DOB: dates in 1900s or 2200s (clearly synthetic)

Output as JSON or CSV (specify which).
```

**Quality check:** Scan output for any pattern that looks real. If unsure, regenerate.

### 3.3 Eggplant script authoring

**When:** Automating a UI test case in Eggplant (Keysight) DSL.

**Tool:** Copilot (note: Eggplant DSL has less training data than Selenium, may need more iteration)

**Prompt pattern:**
```
Generate an Eggplant Functional script for this test case:

Test Case: [paste test case from Zephyr / your authoring]
Application URL: [URL]
Login credentials variable: [variable name from your env config]

Eggplant context:
- We use Eggplant Functional with [SenseTalk / web driver — confirm]
- Image-based or DOM-based selectors? [confirm with team]
- Existing helper script library: [list relevant helpers]

Generate:
- Setup (navigate, login)
- Test steps (numbered to match test case steps)
- Assertions per step
- Teardown (logout, clean state)
- Error handling (screenshots on fail)

Comment each block to match the test case step number.
```

**Quality check:**
- Does the script follow team conventions (selector strategy, helper usage)?
- Are assertions specific enough that a failure reveals what broke?
- Does teardown leave the app in a clean state for the next test?

**Eggplant-specific notes:**
- Copilot has more JavaScript/Java/Python training than SenseTalk — output may need more correction
- Keep a "good Eggplant examples" library and paste as reference in prompts
- For Selenium → Eggplant migration, see 3.4

### 3.4 Selenium → Eggplant migration

**When:** Migrating an existing Selenium test to Eggplant.

**Tool:** Copilot Chat

**Prompt pattern:**
```
Migrate this Selenium test to Eggplant Functional:

Selenium source:
[paste Selenium test code]

Target Eggplant approach:
- DSL: SenseTalk (or [confirm])
- Selector strategy: [image / DOM / XPath — confirm with team]
- Helper library: [list]

Preserve:
- Test logic (same steps, same assertions)
- Test data references (same data sources)
- Wait/timing behavior (don't introduce flakiness)

Translate:
- Locators (Selenium WebElement → Eggplant equivalent)
- Waits (Selenium WebDriverWait → Eggplant wait)
- Assertions (assertEquals → assert)
- Data setup/teardown

Comment each translated block with "// from Selenium: [original line]"
so reviewers can verify.
```

**Quality check:** Run both Selenium and translated Eggplant against the same test environment. Outputs should match.

### 3.5 API test scripts (Postman)

**When:** Testing a Dynamics 365 / Azure Function / Logic App API.

**Tool:** Copilot

**Prompt pattern:**
```
Generate a Postman collection for this API:

API spec: [paste OpenAPI / Swagger / endpoint description]
Authentication: [Bearer token / OAuth / API key — specify]
Environment variables: [list]

Generate requests for:
1. Happy path — all valid inputs
2. Validation errors — each required field missing
3. Auth failures — missing token, expired token, wrong scope
4. Boundary — max payload size, special chars, Unicode
5. Negative — wrong HTTP method, wrong content-type

For each request:
- Pre-request script (any setup)
- Request body (with variables for dynamic data)
- Tests (response status, schema validation, business rule checks)
- Save response to env variable if needed for chained requests

Output as Postman collection JSON I can import.
```

**Quality check:** Import into Postman, verify all requests resolve, run the collection in order.

### 3.6 Defect triage

**When:** New defect comes in; need to assess severity, find root cause hints, identify duplicates.

**Tool:** Rovo

**Prompt pattern:**
```
Triage this new defect:

[paste defect summary, steps, expected, actual, environment]

For triage:
1. Search for similar past defects (last 6 months) — list top 5 candidates
   with similarity reasoning
2. Suggest likely root cause area (UI / API / DB / config / data)
3. Suggest severity (Blocker / Critical / Major / Minor / Trivial) with rationale
4. Suggest priority (P0-P3) with rationale
5. Suggest team owner based on the area
6. List 3 questions a developer would need answered before fixing

Constraint: Cite each similar defect by Jira key. Don't invent defect keys.
```

**Quality check:** Verify each cited Jira key exists. Verify the suggested area matches the actual symptom (Rovo can mis-classify).

### 3.7 Regression test maintenance

**When:** UI or API change breaks existing automated tests; need to update them.

**Tool:** Copilot

**Prompt pattern:**
```
This test was working but now fails due to [describe UI/API change]:

Test code: [paste]
Failure log: [paste]
Change description: [what changed in the app]

Update the test to:
- Reflect the new UI/API
- Preserve original test intent (don't change what's being tested)
- Use the same selector strategy as the original
- Update any assertions that need new expected values
- Add a comment noting the update reason

If the change makes the test obsolete, say so instead of updating.
```

**Quality check:** Run updated test; verify it passes for the right reason (not because the assertion got weakened).

### 3.8 Test report / status summary

**When:** Writing daily / weekly / sprint-end test status.

**Tool:** Rovo

**Prompt pattern:**
```
Generate a test status summary for [team] for [date range].

Pull from Jira:
- Test cases executed (count by status: pass/fail/blocked/not-run)
- New defects opened (count by severity)
- Defects closed (count)
- Defects deferred (count + brief rationale)
- Test coverage % for current sprint stories

Format:
- 1-paragraph executive summary (5 sentences max)
- Bullet list of top 3 risks
- Bullet list of top 3 wins
- Defect trend (this week vs last week)
- Recommendation for stakeholders

Audience: [PO / Scrum Master / Program leadership — adjust tone]
```

**Quality check:** Verify counts against Jira directly. Don't post a Rovo summary without spot-checking the numbers.

---

## 4. Workflow integration

### Where AI fits in the tester workflow

```
STORY READY (in "Ready For Development" or moving to sprint)
      ↓
[ROVO — generate test cases from AC] → export to Zephyr
      ↓
TEST CASES IN ZEPHYR (review + edit + organize)
      ↓
[COPILOT — generate test data]
      ↓
TEST DATA STAGED
      ↓
[COPILOT — generate / update Eggplant script for automatable cases]
      ↓
AUTOMATED TESTS COMMITTED
      ↓
STORY ENTERS "TESTING" stage
      ↓
Manual + Automated execution
      ↓
Defects logged
      ↓
[ROVO — defect triage on each new bug]
      ↓
[ROVO — daily/weekly test status reports]
```

### Tag every AI-touched test case

- In Zephyr: add label `ai-assisted` to test cases generated/edited with AI
- In Jira: add comment on linked story noting AI use for testing artifacts
- In Eggplant repo: add `// AI-assisted` comment to scripts touched by Copilot

This is required for the AI vs. non-AI comparison at end of pilot.

---

## 5. HITL discipline & DCFS guardrails

### Hard rules

1. **No real DCFS data in prompts** — no real names, case IDs, SSNs, addresses. Synthetic only.
2. **No security documentation in prompts**.
3. **Human-in-the-loop on every output** — review before commit / before execution.
4. **Synthetic data must look obviously synthetic** — see 3.2 conventions.
5. **No production data exports as "test data"** — ever.

### Soft rules

- Don't paste full Eggplant scripts from other teams without their context
- Don't accept Rovo defect classifications without your judgment
- Don't trust Copilot-generated Eggplant scripts without running them
- Flag if an AI-generated test passes "too easily" — may have weak assertions

### What to do if you suspect a leak

1. Stop using AI for that test case
2. Note what was pasted
3. Notify Robert Rodriguez immediately
4. Do not continue until reviewed

---

## 6. Success metrics for tester pilot participants

Tracked from Jira + Zephyr + Tempo (if hours logged) + manual logs.

### Throughput (the bottleneck-easing metrics)

| Metric | Source | Target |
|--------|--------|--------|
| Test cases authored per tester per week | Zephyr | +25% over baseline |
| Eggplant scripts authored / updated per week | Eggplant repo + manual log | +20% over baseline |
| Defects triaged per tester per day | Jira workflow | +15% over baseline |

### Bottleneck (the headline-moving metrics)

| Metric | Source | Target |
|--------|--------|--------|
| Functional test cycle time (entry → exit) | Jira changelog | -20% over baseline |
| Stories completing UAT first attempt | Jira workflow transitions | ↑ |
| UAT rejection rate | Jira workflow transitions | ↓ |
| Sprint stories reaching "Done" | Jira | ↑ (this is the headline) |

### Quality (guardrails — must not regress)

| Metric | Source | Target |
|--------|--------|--------|
| Defects caught at Test stage (vs. escaping to UAT) | Jira "found in" field | ↑ (earlier catch) |
| Defects escaping to Production | Jira | flat or ↓ |
| Test case quality (re-run rate due to test bug) | Manual tracking | flat or ↓ |
| Automation flakiness rate | CI dashboard | flat or ↓ |

### Adoption / activity

| Metric | Source | Target |
|--------|--------|--------|
| % test cases tagged `ai-assisted` | Zephyr label | trended; expect 50%+ by Sprint 4 |
| Copilot acceptance rate (when generating scripts) | Copilot admin | 40-70% (not 100%) |

### Self-reported

| Metric | Source | Target |
|--------|--------|--------|
| Time saved per test case authored (mins) | Weekly check-in | self-reported, trended |
| Confidence in AI-generated tests (1-5) | Monthly survey | ≥ 4 by Sprint 4 |

---

## 7. Training emphasis

### Pre-pilot training (3h, before PI Planning)

| Module | Duration | Content |
|--------|----------|---------|
| Foundation (shared) | 1.5h | DoIT compliance, HITL, success criteria |
| Tester track | 3h | Rovo for test cases (the 8 patterns above), Copilot for Eggplant DSL (special focus — less common), Postman generation, defect triage workflow, anti-patterns |

### Critical training emphases

- **Eggplant DSL prompting** — Copilot has less SenseTalk training than Selenium; build a "good Eggplant examples" library and use as reference
- **Synthetic data discipline** — show what real-vs-synthetic looks like; this is the most likely accidental policy violation
- **Defect triage with AI** — when to trust Rovo's similarity match vs. when to dig deeper
- **Test case quality vs. quantity** — AI-generated volume must not weaken assertions
- **Zephyr label hygiene** — `ai-assisted` label is required for measurement

---

## 8. Anti-patterns

| Anti-pattern | Why it's bad | What to do instead |
|--------------|--------------|-------------------|
| Asking Rovo to generate test cases without pasting the AC | Tests miss the actual requirements | Always paste full AC; they're the source of truth |
| Accepting Copilot's first Eggplant script without running it | Eggplant DSL is uncommon — Copilot makes more errors here | Run every script in a test env before committing |
| Generating 50 test cases for a 3-AC story | Volume ≠ coverage; reviewer fatigue weakens reviews | Match test count to AC count; one test per AC + edge cases |
| Using AI to write test cases AND the code being tested | Tautology — same hallucinations on both sides | Different tools or same tool different prompts; human verifies independence |
| Pasting production data as "realistic test data" | Hard policy violation | Generate synthetic per 3.2 conventions |
| Removing `ai-assisted` label after testing passes | Skews comparison | Keep label always |
| Trusting Rovo defect-similarity without clicking through to verify | False positives waste dev time | Always verify cited Jira keys |
| Letting Copilot write the test assertion AND the expected value | Test always passes — meaningless | Human owns expected value |

---

## 9. Open questions for this Tester playbook

1. **Where in testing is the bottleneck specifically?** Functional, Integration, UAT? Need V3 sub-stage data once available.
2. **Why is testing the bottleneck?** Manual regression burden? Test data scarcity? Tester headcount? Story quality? Environment availability? Each has a different AI play.
3. **What's the Selenium → Eggplant migration progress per team?** Affects how much of the pilot involves migration vs. new authoring.
4. **Is Zephyr API accessible?** For pulling test execution metrics into the pilot scorecard.
5. **What's the test environment availability situation?** If testing is blocked on env scarcity, AI doesn't help — that's an infra problem.
6. **Do testers log hours in Tempo?** If yes, hours-per-test-case becomes measurable.
7. **Are there reusable Eggplant helpers / page objects?** AI prompts work better with these as context.
8. **What's the current defect leak rate (Test → UAT → Prod)?** Need baseline for the "earlier catch" metric.

---

## 10. Pilot participant checklist

Before you start using AI on test work:

- [ ] Foundation training complete
- [ ] Tester track complete
- [ ] Rovo access on DCFS Jira
- [ ] Copilot deployed to your machine (or fallback to Rovo-only for now)
- [ ] Zephyr access + label scheme reviewed
- [ ] Eggplant + Postman + AXE access confirmed
- [ ] Read this playbook end-to-end
- [ ] Synthetic test data conventions understood (3.2)
- [ ] `ai-assisted` label workflow understood (Zephyr + Jira + repo)
- [ ] Know how to report a suspected leak (Robert)
- [ ] Tracking time saved in weekly check-in

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
