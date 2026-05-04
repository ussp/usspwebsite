# Tester (QA) Playbook v0 — DCFS Illinois Connect AI Pilot

> **Version:** v0.2 — V20260427
> **Status:** DRAFT — pilot starter, refined with Apr 24 testing-workflow walkthrough findings; will harden into v1.0 deliverable at end of pilot PI
> **Owner:** Vinay Lagisetty
> **Audience:** Krasan + DCFS Testers/QA participating in pilot, John (Agile Delivery Manager — testing focus), Kamila (Test Services Lead), Romi
> **Supersedes:** [playbook-tester-v20260421.md](./playbook-tester-v20260421.md) (kept for traceability; do not delete)

---

## What's new in v20260427 vs. v20260421

The Apr 21 draft was authored before any tester walkthrough. The Apr 24 working session with Nataliia, Remya, Kamila, and Jeff replaced several assumed workflow elements with observed reality. Major changes:

1. **Workflow phases section rewritten** to match the actual Intact-team flow (Story → Zephyr Scale design → peer review → wait-for-deploy → test data → role switch → Test Player execution → defects → ADA → Eggplant → reporting). Time split documented at ~20% authoring / ~80% manual UI execution.
2. **New Zephyr Scale Agent for Atlassian Rovo workflow** added as the primary recommended path for test-case generation, with a documented Rovo-only-with-manual-paste fallback until §5f notice clears.
3. **AI use cases re-mapped per phase** with explicit "high-value / not-helpful / risky" calls — manual UI execution and ADA testing are now explicitly flagged as constrained-fit zones.
4. **Prerequisites section added** for items that must exist before pilot can land tester gains: peer-review checklist, sprint/PI report template, §5f notice for Zephyr Agent.
5. **Role-specific target note** added — uniform 15% does not fit the tester role; realistic portfolio impact is 5-10% with the gains concentrated in the 20% authoring slice and the new sprint/PI report drafting (which is pure upside because no incumbent process exists).
6. **Eggplant section repositioned** — vendor's own AI roadmap (end-of-2026 release) is the right path; out of scope for active pilot acceleration.
7. **New risks linked**: R-21 (Zephyr §5f timeline), R-23 (tester ceiling), R-29 (peer-review checklist absent), R-30 (no test-report baseline), and R-25 (baseline pollution).

---

## ⚠ Data Boundaries — Read Before Every Session

Before using any AI tool described in this playbook:

- **Never paste** DCFS case data, child names, case IDs, CANTS/CCWIS records, SSN, DOB, addresses, phone numbers, or any PII into a prompt — in any tool (Rovo, Zephyr Scale Agent, GitHub Copilot, M365 Copilot, D365 Copilot). **Test data that mirrors production patterns counts — use synthetic data only.**
- **Test cases themselves are typically safe** (Jeff confirmed Apr 24 — Intact test cases do not contain real client data) but the inputs you describe in steps must still be synthetic.
- **Keep prompts abstract.** Describe the test scenario shape, not the data. Synthetic/redacted test data only.
- **Self-report near-misses.** If you realize you pasted something you shouldn't have, notify the Pilot Governance Lead via the Teams channel immediately. 1-hour CIO escalation per charter §9.
- **Weekly compliance check** (Pilot Governance §5.5) explicitly reviews prompt-drift incidents. Self-reporting is welcomed — no penalty for catching and flagging your own near-miss.
- **When in doubt, ask before submitting.** The AI Transformation Lead is available on the Teams channel.

---

## Change log

| Version | Date | Changed by | What changed |
|---------|------|-----------|--------------|
| v0.1 | 2026-04-21 | Vinay | Initial draft — Phase 1 scope, bottleneck-focused, Eggplant + Zephyr + Postman tooling, defect triage |
| v0.2 | 2026-04-27 | Vinay | Apr 24 testing-workflow walkthrough findings incorporated. Workflow phases rewritten to match Intact-team observed reality. Added Zephyr Scale Agent for Rovo as primary test-case generation path with Rovo-only-with-paste fallback. Repositioned Eggplant as out-of-scope-for-active-pilot (vendor AI roadmap is right path). Added prerequisites section, role-specific target note, ADA-as-constrained-fit explicit call. Linked R-21, R-23, R-25, R-29, R-30. |

---

## 1. Why testers are the most important Phase 1 role

**Testing is the bottleneck at DCFS.** Multiple recent sprints show high commitment with 0 completed (e.g., IPT_PI25.1.3: 39 SP committed, 0 completed; IPT_PI25.1.4: 37 SP, 0 completed) — work is stuck after development. The PI completion sits at 67% against 71% time elapsed.

**Implication:** AI for testers moves the headline number. AI for devs without AI for testers creates more WIP at the bottleneck. The pilot's productivity story rests heavily on this role.

**However, the Apr 24 walkthrough sharpened the picture:** ~80% of tester time is hands-on manual UI execution that AI cannot drive under HITL. The headline-moving gains land in the 20% authoring slice plus a new sprint/PI report-drafting capability that does not exist today. See §7 (role-specific target note) and the [Apr 24 walkthrough summary](../../../meeting-notes/team/2026-04-24-testing-workflow-walkthrough-summary.md).

Per Apr 21 walkthrough — the proposed V3 workflow splits testing into `Testing → Integration → Acceptance Testing → Acceptance Testing Complete`, with sub-stage markers (DEV unit / TEST functional / INT smoke / UAT). This finer granularity is measurement-rich for AI impact attribution once V3 stabilizes.

---

## 2. Approved tools for testers

| Tool | Use | Status |
|------|-----|--------|
| **Atlassian Rovo** | Test case generation from AC; defect triage; report writing | ✅ Available, used live Apr 24 |
| **GitHub Copilot** | Test scripts (Eggplant, Selenium, Postman), test data | 🚧 Licensed by DoIT, not yet provisioned for this team's GCC environment |
| **Zephyr Scale (Test Player)** | Test case management + step-by-step execution | ✅ Already in use |
| **Eggplant (Keysight)** | UI test automation — smoke/regression suites | 🚧 In infancy; vendor AI roadmap end-2026; out of scope for active pilot acceleration |
| **Postman** | API testing | ✅ Already in use |
| **Accessibility Insights** | ADA / accessibility testing — mandatory per story | ✅ Already in use, fully manual |
| **Internal "Role Switch" app (Shared Services)** | Self-service security-role switching on D365 | ✅ Already in use, automated; not an AI surface |

**Pending DoIT §5f notice (recommended addition — see §3 below):**

| Tool | Use | §5f Status |
|------|-----|------------|
| **Zephyr Scale Agent for Atlassian Rovo** | Bridge Rovo into Zephyr Scale folders so generated test cases save directly (vs. JIRA-comment-only today) | NOT FILED — Vinay drafts; due Apr 30. See [tool-authorization-list.md Category 3b](../strategy/tool-authorization-list.md#category-3b-proposed-additions--pending-doit-5f-notice). |

**Not approved:** ChatGPT direct, Claude direct, any external LLM.

---

## 3. Zephyr Scale Agent for Atlassian Rovo — primary recommended path

> **The single biggest tester-side AI lever identified in the Apr 24 walkthrough.** Without it, Rovo can only post generated test cases as a JIRA comment; the tester then transcribes manually into Zephyr. With it, generated cases save directly into the correct Zephyr folder linked to the JIRA story. Closing this gap captures the full test-case-authoring win.

### What it does

- Creates / updates / links test cases inside Zephyr Scale folders from a Rovo prompt
- Auto-creates the Zephyr test cycle and populates step-by-step instructions
- Links generated cases back to the originating JIRA story
- Inherits the Rovo data path (state tenant, no external grounding)

### Authorization status

- **Vendor:** SmartBear (Zephyr Scale) + Atlassian (Rovo) — separate add-on from the four currently authorized tools
- **§5f status:** NOT FILED — Vinay drafting; Robert/Romi reviewing; Dave/Jim signoff. Due Apr 30. Cross-ref [R-21](../strategy/assumptions-and-risks.md#high-risks-apr-27).
- **Technical enablement:** Jeff Lobo + Carl Lobo (JIRA admin) scoping licensing model + cost
- **Data boundary:** Same as Rovo (state tenant). Test cases do not contain real client data per Jeff (Apr 24).

### Pilot fallback (until §5f clears)

Use **Rovo-only with manual copy/paste from JIRA comment to Zephyr folders.** Steps:

1. In JIRA, open the user story.
2. Use Rovo "Ask" with the test-case prompt pattern (§4.1 below).
3. Rovo writes generated test cases as a comment on the story.
4. Open Zephyr Scale, navigate to the correct folder for the story.
5. Manually transcribe each test case (title, steps, expected) into Zephyr.
6. Add the `ai-assisted` label to each transcribed case.

**Acceptable for Pilot Sprint 1.** Bottleneck by Sprint 2 — file §5f notice immediately to clear path before Sprint 2.

### Full Zephyr Scale Agent workflow (post-§5f-clearance)

1. In JIRA, open the user story.
2. Invoke the Zephyr Scale Agent for Rovo with the detailed prompt pattern (§4.1).
3. Agent generates test cases directly into the Zephyr folder linked to the story.
4. Tester reviews each generated case in Zephyr — accept, edit, or discard.
5. Confirm `ai-assisted` label is applied (Agent should auto-tag; verify).
6. Run peer review (§5) before execution.

### Prompt detail required

Single-line prompts (e.g., "create test cases for this user story") will under-deliver. Use the structured pattern in §4.1 to surface negative cases, role coverage, boundary conditions, and audit/logging checks.

---

## 4. Use cases & prompt patterns

### 4.1 Test case generation from acceptance criteria

**When:** Story moves from "Ready For Development" to your test case authoring queue.

**Tool:** Zephyr Scale Agent for Rovo (preferred, post §5f) → directly into Zephyr | Rovo (fallback) → JIRA comment → manual paste

**Prompt pattern:**
```
Story: [paste story]
Acceptance Criteria: [paste all AC]
Business rules / validations: [paste]

Generate test cases covering:
1. Each AC — happy path
2. Validation rules — negative tests for each input field
3. Permission/role variants — for each user role mentioned
   (DCFS: include role-specific access tests, e.g., direct-URL access blocked for unauthorized roles)
4. Boundary conditions — empty, max-length, special chars, edge dates
5. Error states — what error message for what failure
6. Audit/logging — confirm expected log entry per action
7. Cross-functional — performance baseline, accessibility check

For each test case: provide
- Test ID (format: TC-{story-key}-{NN})
- Title (action-oriented)
- Preconditions (including any role-switch prerequisite)
- Steps (numbered, atomic, written for the Zephyr Test Player)
- Expected result
- Test type (Functional / Validation / Permission / Boundary / Error / Audit / NFR)
- Priority (P1 / P2 / P3)

Output in Zephyr-import-ready format (or save directly to Zephyr if Agent-enabled).
```

**Quality check:**
- Does every AC have at least one test case?
- Are negative tests included, not just happy path?
- Are role-specific permission tests included where the story mentions multiple roles?
- Are test cases atomic (one assertion per test) or compound (avoid)?
- Verify test types are correctly tagged for Zephyr filtering

**Apr 24 demo evidence:** Rovo correctly identified the JIRA story, generated 4 role-specific cases AND surfaced an additional negative test (verify no direct URL access to audit history) the team had not explicitly written. This is the strongest-fit AI use case on the tester track.

### 4.2 Test data preparation prompts

**When:** Need synthetic data for a test case (e.g., new audit-history entries, family relationships, address variants). Largely repetitive and scriptable.

**Tool:** Copilot (with Dataverse schema reference) — once provisioned. Until then, Rovo for the prompt-drafting; manual generation.

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
- Role-mix variants (e.g., for audit-history scenarios, distribute across required roles)

CRITICAL: Use only synthetic / clearly-fake data. No real names, no real
addresses, no real SSN, no real DOB. Use:
- Names: "Test_Family_001 Person_001" pattern
- Addresses: "123 Test St, Springfield IL 62701" pattern
- SSN: "XXX-XX-XXXX" placeholder format only
- DOB: dates in 1900s or 2200s (clearly synthetic)

Output as JSON or CSV (specify which) or as Power Automate flow steps.
```

**Quality check:** Scan output for any pattern that looks real. If unsure, regenerate.

**Open question (per Apr 24):** Is test-data prep largely repetitive (scriptable, high AI fit) or mostly bespoke (per-story creative work, lower AI fit)? Carry to design phase.

### 4.3 Sprint / PI test report drafting (NEW — high value, low resistance)

**When:** End of sprint or end of PI. Reports are required but **not currently being produced** (Apr 24 — Kamila + Jeff confirmed). This is pure additive output, no incumbent process to displace.

**Tool:** Rovo (JIRA + Zephyr data access)

**Prompt pattern:**
```
Generate a test status summary for [team] for [sprint/PI].

Pull from JIRA + Zephyr Scale:
- Test cases executed (count by status: pass/fail/blocked/not-run)
- Test cycle pass rate per story
- New defects opened (count by severity / priority)
- Defects closed (count)
- Defects deferred (count + brief rationale)
- Test coverage % for current sprint stories
- ADA / accessibility issues found (count)
- Stories with all test cases passing
- Stories blocked in test (with blocker reason)

Format:
- 1-paragraph executive summary (5 sentences max)
- Bullet list of top 3 risks
- Bullet list of top 3 wins
- Defect trend (this sprint vs. last sprint, this PI vs. last PI)
- Per-story test-cycle status table
- Recommendation for stakeholders

Audience: [PO / RTE / Program leadership — adjust tone]
```

**Quality check:** Verify counts against JIRA + Zephyr directly. Don't ship a Rovo summary without spot-checking the numbers.

**Why this matters:** No baseline to beat = AI-drafted report is pure upside. Easy quick win that also closes a leadership-visibility gap. See [R-30](../strategy/assumptions-and-risks.md#low-risks-apr-27) — opportunity-flagged risk.

### 4.4 Peer-review pre-screening (after checklist exists)

**When:** Tester has authored a draft test cycle for a story; wants AI to pre-screen before sending to peer reviewer.

**Tool:** Rovo

**Prerequisite:** A peer-review checklist must exist. **It does not today** (Apr 24 — Kamila + Nataliia confirmed). Creating the checklist is a §5 prerequisite. See [R-29](../strategy/assumptions-and-risks.md#medium-risks-apr-27).

**Prompt pattern (once checklist exists):**
```
Pre-screen the following test cycle against our peer-review checklist:

Story: [link or paste]
Test cycle: [paste cases or link to Zephyr cycle]
Checklist:
[paste DCFS test-case peer-review checklist v1]

For each checklist item, mark:
- ✅ Passed — cite specific test case(s) demonstrating it
- ⚠ Concern — cite gap or weak case
- ❌ Failed — cite missing coverage

Output a single table: checklist item | status | specific test ID(s) or gap | suggested fix
```

**Quality check:** Spot-check 2-3 of Rovo's "passed" items by reading the cited test cases — verify Rovo isn't inflating coverage.

### 4.5 Documentation / screenshot narration

**When:** Pasting actual-result narration alongside screenshots into Zephyr after a test step. This is repetitive boilerplate work that consumes meaningful tester time per Apr 24 estimate.

**Tool:** Rovo or M365 Copilot

**Prompt pattern:**
```
Given this test step description and screenshot context [paste step + brief
text description of what the screenshot shows], write a 2-3 sentence actual-
result narration suitable for pasting into the Zephyr Scale Test Player.

Tone: matter-of-fact, present tense. Cite the specific UI element interacted
with. Do not include synthetic test data values inline — say "the configured
test family" rather than "Test_Family_001."

If the screenshot indicates a defect (mismatch with expected), end with one
sentence flagging it.
```

**Quality check:** Read the narration. Does it match what the screenshot shows? Don't paste auto-narrations without skimming.

### 4.6 Defect triage (carried over from v20260421, lightly tuned)

**When:** New defect comes in; need to assess severity, find root cause hints, identify duplicates.

**Tool:** Rovo

**Prompt pattern:**
```
Triage this new defect:

[paste defect summary, steps, expected, actual, environment]

For triage:
1. Search for similar past defects (last 6 months) — list top 5 candidates
   with similarity reasoning
2. Suggest likely root cause area (UI / API / Dataverse / config / data / role-permission)
3. Suggest severity (Blocker / Critical / Major / Minor / Trivial) with rationale
4. Suggest priority (P0-P3) with rationale
5. Suggest team owner based on the area
6. List 3 questions a developer would need answered before fixing

Constraint: Cite each similar defect by JIRA key. Don't invent JIRA keys.
```

**Quality check:** Verify each cited JIRA key exists. Verify the suggested area matches the actual symptom (Rovo can mis-classify).

### 4.7 Postman API test scripts (carried over, unchanged)

**When:** Testing a Dynamics 365 / Azure Function / Logic App API.

**Tool:** Copilot — once provisioned

**Prompt pattern:** (unchanged from v20260421 §3.5)
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

### 4.8 Eggplant scripts — DEPRECATED for active pilot acceleration

**Status (Apr 24):** Eggplant smoke/regression automation is in infancy at DCFS. The vendor (Keysight) has an AI release on its roadmap targeted end-of-2026 — outside the pilot window. **Direct Copilot-on-Eggplant authoring acceleration is not a pilot focus.**

**Carry-over guidance:** Testers actively building Eggplant scripts may still use Copilot (when provisioned) for SenseTalk drafting per §3.3 of v20260421. But this is opportunistic, not a pilot success metric.

**Policy implication:** Sprint/PI report metrics should not weight Eggplant authoring as an AI gain.

---

## 5. Workflow phases (Apr 24 actual — Intact team)

> **Source of truth:** [Apr 24 testing workflow walkthrough summary](../../../meeting-notes/team/2026-04-24-testing-workflow-walkthrough-summary.md). Replaces the simpler diagram in v20260421 §4.

### Phase-by-phase

| # | Phase | Tool / Mechanism | AI fit |
|---|-------|------------------|--------|
| 1 | **Story intake** | JIRA user story (description, AC, business rules, validations live here; no separate test-strategy doc per story) | ✅ Strong fit — feed AC into §4.1 prompt |
| 2 | **Test case design** | Zephyr Scale (JIRA plugin) — "test cycle" per story; tester creates cases manually or pastes from Excel | ✅ **Strongest fit** — Zephyr Scale Agent for Rovo (§3) or Rovo + manual paste fallback |
| 3 | **Peer review** | Manual — second tester reviews. **No documented checklist exists** (Apr 24). | ⚠ Possible after checklist exists (§4.4) — currently a prerequisite gap |
| 4 | **Wait for deployment** | Story queued for system-test release until dev deploys to test env | ❌ Not AI-relevant |
| 5 | **Test data prep** | Mostly manual; some automation; story-dependent | ✅ Moderate fit (§4.2) — strength depends on whether prep is repetitive vs. bespoke |
| 6 | **Security-role switching** | Internal Shared-Services app on D365 — self-service, automated | ❌ Not AI-relevant — already automated |
| 7 | **Manual UI execution** | Zephyr Scale Test Player — tester goes into IllinoisConnect, follows each step, marks pass/fail, attaches actual result + screenshot | ❌ **Constrained fit** — HITL forbids autonomous execution; ~80% of tester time |
| 8 | **Defect logging** | JIRA (sprint-tracked); no standalone defect dashboard | ✅ Moderate fit (§4.6 triage) |
| 9 | **ADA / accessibility testing** | Accessibility Insights — manual, mandatory per story. Selenium not used. | ❌ **Constrained fit** — no AI integration available; mandatory manual |
| 10 | **Smoke / regression / E2E** | Eggplant — separate effort, in infancy. Vendor AI roadmap end-2026. | ❌ Out of scope for active pilot (vendor's own AI is right path) |
| 11 | **Sprint / PI test reporting** | **Not currently produced** (Apr 24 — Kamila + Jeff). Required but absent. | ✅ **High-value, low-resistance** — pure additive output (§4.3, R-30) |

### Time split (Remya + Nataliia estimate, Apr 24)

- ~20% test case design / authoring
- ~80% execution + test-data prep + role switching + screenshots + documentation + ADA testing

**Implication:** AI gains land in the 20% authoring slice plus the new sprint/PI report-drafting capability. The 80% execution bulk is a structural ceiling on the tester role under current tooling.

### Where AI fits — visual

```
JIRA STORY (intake)
    ↓
[ZEPHYR SCALE AGENT FOR ROVO — generate test cases from AC]
   (or fallback: Rovo + manual paste from JIRA comment to Zephyr folder)
    ↓
TEST CASES IN ZEPHYR (review + edit + organize)
    ↓
[ROVO — peer-review pre-screen against checklist (after checklist exists)]
    ↓
PEER REVIEW (human)
    ↓
WAIT FOR DEPLOYMENT
    ↓
[COPILOT or ROVO — generate test data prompts / scripts]
    ↓
ROLE SWITCH (Shared Services app — automated, not AI)
    ↓
MANUAL UI EXECUTION (Zephyr Test Player — human, ~80% of time)
    ↓
[ROVO — narration drafting for actual-result text + screenshot captions]
    ↓
DEFECTS LOGGED (JIRA)
    ↓
[ROVO — defect triage on each new bug]
    ↓
ADA TESTING (Accessibility Insights — human, mandatory, no AI)
    ↓
SPRINT END
    ↓
[ROVO — sprint/PI test report drafting (NEW — pure upside, no incumbent)]
```

### Tag every AI-touched test case

- In Zephyr: add label `ai-assisted` to test cases generated/edited with AI
- In JIRA: add comment on linked story noting AI use for testing artifacts
- In Eggplant repo (if used): add `// AI-assisted` comment to scripts touched by Copilot
- For sprint/PI reports: tag the report with `ai-drafted` in the file name or header metadata

This is required for the AI vs. non-AI comparison at end of pilot.

---

## 6. Prerequisites before pilot can land tester gains

These items must be in place — or have a documented fallback — before tester pilot can capture the available value. Each is a gating dependency, not an aspiration.

| # | Prerequisite | Why it gates value | Owner | Due |
|---|--------------|-------------------|-------|-----|
| 1 | **§5f notice for Zephyr Scale Agent for Rovo** filed with DoIT | Without it, Sprint 2+ test-case authoring bottlenecks on manual paste | Vinay (drafts); Robert/Romi review; Dave/Jim signoff | Apr 30 (so 30-day clock clears before Pilot Sprint 2) |
| 2 | **Peer-review checklist for test cases** created and adopted | AI peer-review pre-screening (§4.4) requires a checklist as input. Independent of AI, this is a quality-process gap. | Kamila + Vinay | Design phase (before pilot start) |
| 3 | **Sprint/PI test-report template** drafted | AI drafting (§4.3) needs a template to produce against. Currently no incumbent — must be built. | Kamila + Jeff + Vinay | Design phase (before pilot start) |
| 4 | **Zephyr-import-friendly Excel template** + matching Rovo prompt library | Bridges fallback path during §5f wait window. Bulk-load AI-generated cases without per-case manual paste. | Vinay | Design phase |
| 5 | **GitHub Copilot provisioned** for this team's GCC environment | Enables Postman API test generation (§4.7) and richer test-data scripting (§4.2). Today licensed but not provisioned. | Romi + Vinay (escalate to Dave/Jim) | Before pilot start — see R-22 |
| 6 | **Pre-pilot survey** to Nataliia + Remya + Kamila | Captures baseline self-reported time-per-phase before any tool change. Closes baseline-pollution risk (R-25). | Vinay | Before May 4 (baseline window closes) |

---

## 7. Role-specific target note

> **Cross-ref:** [rollout-plan.md §9 — role-specific targets](../../rollout-plan.md). [R-23](../strategy/assumptions-and-risks.md#high-risks-apr-27) — tester ceiling risk.

A uniform 15% productivity target across all five pilot roles does not fit the tester role given the workflow structure observed Apr 24:

- **20% authoring slice:** Zephyr Scale Agent for Rovo + structured prompts can plausibly compress this by 30-50% — but that's 6-10 percentage points of the total tester portfolio.
- **80% execution / data-prep / ADA / documentation slice:** AI cannot drive UI under HITL; ADA is mandatory manual; role-switching is already automated. Best-case AI assistance here is narration drafting and test-data scripting — single-digit-percentage compression on this slice.
- **Sprint/PI report drafting (new, ~5% of tester time once template exists):** pure additive output. No incumbent process to displace. AI can deliver 70-90% of the draft for human review — but this is also small in portfolio terms.

**Realistic portfolio impact: 5-10%.** Setting tester target at 15% will under-credit observed improvements and demoralize the role most central to the bottleneck story. This must be reflected in role-specific targets in the rollout plan.

**The headline-bottleneck improvement still flows from tester role gains** — not because tester-portfolio impact is large, but because the bottleneck is downstream of dev and the 5-10% applies to a high-leverage chokepoint.

---

## 8. HITL discipline & DCFS guardrails

### Hard rules

1. **No real DCFS data in prompts** — no real names, case IDs, SSNs, addresses. Synthetic only. Test cases themselves are typically safe (Apr 24 confirmation) but synthetic data values inside steps are still required.
2. **No security documentation in prompts.**
3. **Human-in-the-loop on every output** — review before save / before commit / before execution. The Zephyr Scale Agent generates; humans accept/edit before persisting.
4. **No autonomous UI execution** — AI does not drive IllinoisConnect on the tester's behalf. Period.
5. **Synthetic data must look obviously synthetic** — see §4.2 conventions.
6. **No production data exports as "test data"** — ever.

### Soft rules

- Don't paste full Eggplant scripts from other teams without their context
- Don't accept Rovo defect classifications without your judgment
- Don't trust Copilot-generated Eggplant scripts without running them
- Flag if an AI-generated test passes "too easily" — may have weak assertions
- Don't ship a Rovo-drafted sprint report without spot-checking counts against JIRA + Zephyr directly

### What to do if you suspect a leak

1. Stop using AI for that test case
2. Note what was pasted
3. Notify the Pilot Governance Lead via the Teams channel immediately (1-hour CIO escalation per charter §9)
4. Do not continue until reviewed

---

## 9. Success metrics for tester pilot participants

Tracked from JIRA + Zephyr + Tempo (if hours logged) + manual logs.

### Throughput (the bottleneck-easing metrics)

| Metric | Source | Target |
|--------|--------|--------|
| Test cases authored per tester per week | Zephyr | +30-50% over baseline (authoring slice) |
| Defects triaged per tester per day | JIRA workflow | +15% over baseline |
| Sprint/PI test reports produced | Zephyr + JIRA | 100% of sprints (vs. 0% baseline — pure additive) |

### Bottleneck (the headline-moving metrics)

| Metric | Source | Target |
|--------|--------|--------|
| Functional test cycle time (entry → exit) | JIRA changelog | -10-15% over baseline |
| Stories completing UAT first attempt | JIRA workflow transitions | ↑ |
| UAT rejection rate | JIRA workflow transitions | ↓ |
| Sprint stories reaching "Done" | JIRA | ↑ (this is the headline) |

### Quality (guardrails — must not regress)

| Metric | Source | Target |
|--------|--------|--------|
| Defects caught at Test stage (vs. escaping to UAT) | JIRA "found in" field | ↑ (earlier catch) |
| Defects escaping to Production | JIRA | flat or ↓ |
| Test case quality (re-run rate due to test bug) | Manual tracking | flat or ↓ |
| ADA defects found per story | Accessibility Insights output | flat (mandatory coverage maintained) |

### Adoption / activity

| Metric | Source | Target |
|--------|--------|--------|
| % test cases tagged `ai-assisted` | Zephyr label | trended; expect 50%+ by Sprint 4 |
| Copilot acceptance rate (when generating scripts) | Copilot admin | 40-70% (not 100%) |
| Zephyr Scale Agent usage rate (post-§5f) | Atlassian admin | trended |

### Self-reported

| Metric | Source | Target |
|--------|--------|--------|
| Time saved per test case authored (mins) | Weekly check-in | self-reported, trended |
| Time saved per sprint report drafted (hrs) | Weekly check-in | self-reported, trended |
| Confidence in AI-generated tests (1-5) | Monthly survey | ≥ 4 by Sprint 4 |

---

## 10. Training emphasis

### Pre-pilot training (3h, before PI Planning)

| Module | Duration | Content |
|--------|----------|---------|
| Foundation (shared) | 1.5h | DoIT compliance, HITL, success criteria, Copilot boundaries (no web grounding — see tool-authorization-list.md Category 4b) |
| Tester track | 3h | Zephyr Scale Agent for Rovo (or fallback path), test-case prompt structuring, defect triage workflow, sprint/PI report drafting against new template, peer-review checklist usage, ADA-as-out-of-scope explicit framing, anti-patterns |

### Critical training emphases

- **Zephyr Scale Agent for Rovo prompt depth** — single-line prompts under-deliver; teach the structured pattern in §4.1
- **Synthetic data discipline** — show what real-vs-synthetic looks like; this is the most likely accidental policy violation
- **Defect triage with AI** — when to trust Rovo's similarity match vs. when to dig deeper
- **Test case quality vs. quantity** — AI-generated volume must not weaken assertions
- **Zephyr label hygiene** — `ai-assisted` label is required for measurement
- **Sprint/PI report drafting** — this is a brand-new capability; spend explicit training time on the template + prompt
- **What AI cannot help with on this role** — set expectations early on the 80% execution ceiling, ADA, Eggplant; testers should not feel they're failing the pilot if those areas don't move

---

## 11. Anti-patterns

| Anti-pattern | Why it's bad | What to do instead |
|--------------|--------------|-------------------|
| Asking Rovo to generate test cases without pasting the AC | Tests miss the actual requirements | Always paste full AC + business rules; they're the source of truth |
| Single-line "create test cases" prompts | Surfaces only happy paths; misses negatives, role variants, boundaries | Use the structured pattern in §4.1 |
| Accepting Zephyr Scale Agent output without review | Even with the Agent, every case needs human review before saving (governance principle) | Review each generated case in Zephyr; accept/edit/discard |
| Accepting Copilot's first Eggplant script without running it | Eggplant DSL is uncommon — Copilot makes more errors here | Run every script in a test env before committing |
| Generating 50 test cases for a 3-AC story | Volume ≠ coverage; reviewer fatigue weakens reviews | Match test count to AC coverage; one test per AC + targeted edge cases |
| Using AI to write test cases AND the code being tested | Tautology — same hallucinations on both sides | Different tools or same tool different prompts; human verifies independence |
| Pasting production data as "realistic test data" | Hard policy violation | Generate synthetic per §4.2 conventions |
| Removing `ai-assisted` label after testing passes | Skews comparison | Keep label always |
| Trusting Rovo defect-similarity without clicking through to verify | False positives waste dev time | Always verify cited JIRA keys |
| Letting Copilot write the test assertion AND the expected value | Test always passes — meaningless | Human owns expected value |
| Shipping a Rovo-drafted sprint report without verifying counts | Numbers may not match JIRA / Zephyr ground truth | Spot-check key counts against source systems |
| Trying to "AI-accelerate" ADA testing to hit the 15% target | ADA has no AI integration today; trying creates compliance risk | Accept ADA as an AI-out-of-scope phase; argue for role-specific targets instead |
| Pre-pilot informal Rovo use polluting the baseline | Inflates "before" number; deflates measured AI gain | Disclose any pre-pilot tool exploration in the pre-May-4 survey (R-25) |

---

## 12. Open questions / blockers

1. **Zephyr Scale Agent §5f timeline** — how long will the DoIT 30-day notice take in practice? File ASAP. (R-21)
2. **Zephyr Scale Agent licensing model and cost** — per-user, per-tenant, included with existing Zephyr/Rovo licenses? Jeff + Carl Lobo investigating.
3. **Eggplant AI roadmap visibility** — does the vendor end-of-2026 release fall inside the pilot window? Should we factor it as a forward-looking item even if not usable today?
4. **Peer-review checklist owner and format** — Kamila + Vinay to define. Format: paper checklist, Confluence template, JIRA validation rule? (R-29)
5. **Baseline pollution from prior Rovo use** — has the Intact team used Rovo informally before pilot start? Pre-pilot survey closes this. (R-25)
6. **Test-data prep nature** — repetitive (high AI fit) vs. bespoke (low AI fit)? Carry to design phase observation.
7. **Existing test-report templates from other DCFS teams** — anything to reuse vs. design from scratch?
8. **Where in testing is the bottleneck specifically?** Functional, Integration, UAT? Need V3 sub-stage data once available.
9. **Test environment availability situation** — if testing is blocked on env scarcity, AI doesn't help — that's an infra problem.
10. **Tempo logging** — do testers log hours? If yes, hours-per-test-case and hours-per-report become measurable.
11. **Sprint/PI test-report template content** — what fields does leadership actually want? Coordinate with Jeff + RTE.

---

## 13. Pilot participant checklist

Before you start using AI on test work:

- [ ] Foundation training complete (incl. Copilot boundaries module)
- [ ] Tester track complete
- [ ] Rovo access on DCFS JIRA confirmed
- [ ] Zephyr Scale Agent for Rovo enablement status known (full path or documented fallback)
- [ ] Copilot deployed to your machine (or fallback to Rovo-only for now)
- [ ] Zephyr Scale access + label scheme reviewed
- [ ] Eggplant + Postman + Accessibility Insights access confirmed
- [ ] Read this playbook end-to-end
- [ ] Synthetic test data conventions understood (§4.2)
- [ ] Peer-review checklist exists and is understood (§6 prerequisite)
- [ ] Sprint/PI report template exists and is understood (§6 prerequisite)
- [ ] `ai-assisted` label workflow understood (Zephyr + JIRA + repo)
- [ ] Know how to report a suspected leak (Pilot Governance Lead, Teams channel, 1-hour CIO escalation)
- [ ] Tracking time saved in weekly check-in
- [ ] Pre-pilot survey submitted (before May 4)

---

## Appendix A: Reference

| For details on... | See |
|-------------------|-----|
| Prior version (for traceability) | [./playbook-tester-v20260421.md](./playbook-tester-v20260421.md) |
| Apr 24 testing-workflow walkthrough findings | [../../meeting-notes/team/2026-04-24-testing-workflow-walkthrough-summary.md](../../../meeting-notes/team/2026-04-24-testing-workflow-walkthrough-summary.md) |
| Tester-specific risks (R-21 §5f, R-23 ceiling, R-25 pollution, R-29 checklist, R-30 reports) | [../strategy/assumptions-and-risks.md](../strategy/assumptions-and-risks.md) |
| Zephyr Scale Agent for Rovo authorization status | [../strategy/tool-authorization-list.md Category 3b](../strategy/tool-authorization-list.md) |
| Engagement scope, in/out, Phase 2/3 | [../scope-running-book-v04212026.md](../scope-running-book-v04212026.md) |
| Measurement methodology | [../measurement-methodology-v04142026.md](../measurement-methodology-v04142026.md) |
| Rollout plan + timeline + role-specific targets (§9) | [../../rollout-plan.md](../../rollout-plan.md) |
| DoIT policy + governance | [../governance-proposal-v04142026.md](../governance-proposal-v04142026.md) |
| Other role playbooks | [./](.) |
