# Testing Services Lead Playbook v0 — DCFS Illinois Connect AI Pilot

> **Version:** v0.1 — V20260422
> **Status:** DRAFT — pilot starter; will be refined with pilot learnings into v1.0 deliverable at end of pilot PI
> **Owner:** Vinay Lagisetty
> **Audience:** Krasan Testing Services Lead, John (Agile Delivery Manager — testing focus), Romi

---

## ⚠ Data Boundaries — Read Before Every Session

As Testing Services Lead, you set the testing-data standard for the program — your discipline models the discipline expected of every tester.

- **Never paste** DCFS case data, child names, case IDs, CANTS/CCWIS records, SSN, DOB, addresses, phone numbers, or any PII into a prompt — in any tool (Rovo, GitHub Copilot, M365 Copilot, D365 Copilot). **Test data that mirrors production patterns counts — use synthetic only.**
- **Strategy documents should reference data patterns abstractly** — "use synthetic case records with representative fields" rather than actual examples.
- **Self-report near-misses.** If you realize you pasted something you shouldn't have, notify the Pilot Governance Lead via the Teams channel immediately. 1-hour CIO escalation per charter §9.
- **Weekly compliance check** (Pilot Governance §5.5) explicitly reviews prompt-drift incidents across all testers. As Testing Services Lead you support this review.
- **When in doubt, ask before submitting.** The AI Transformation Lead is available on the Teams channel.

---

## Change log

| Version | Date | Changed by | What changed |
|---------|------|-----------|--------------|
| v0.1 | 2026-04-22 | Vinay | Initial draft — added as 5th Phase 1 role; strategy/coordination focus distinct from individual Tester playbook; targets the bottleneck at the portfolio level |

---

## 1. Why the Testing Services Lead is the highest-leverage Phase 1 role

**Testing is the bottleneck at DCFS.** The individual Tester playbook scales tester productivity 1-to-1. The Testing Services Lead playbook scales **the testing system** that all testers operate in — strategy, environments, test data, automation roadmap, coverage decisions.

A 15% gain on each individual tester is meaningful. A better testing strategy from the Testing Services Lead can move the whole program — by removing systemic constraints (env scarcity, redundant test cases, low-value manual tests) that no individual tester can solve.

This role's AI use is more **strategic and coordinative** than authoring. Tools that consume and synthesize program-wide data (Rovo, Power BI Copilot, Copilot Chat) are higher value than IDE-style code generation tools.

### Distinction from individual Tester role

| Aspect | Individual Tester | Testing Services Lead |
|--------|------------------|----------------------|
| Scope | One team, one sprint | Program (12 teams), one PI+ |
| Output | Test cases, scripts, defect reports | Test strategy, coverage decisions, env policy, automation roadmap, portfolio defect analysis, executive reports |
| Primary AI tool | Copilot (Eggplant scripts), Rovo (test cases) | Rovo (strategy docs, defect patterns), Power BI Copilot (dashboards), Copilot Chat (analysis) |
| Decisions owned | "Is this test case correct" | "What should we test deeply, what should we spot-check" |
| Time horizon | Sprint | PI + multi-PI roadmap |

**Pair with Tester playbook:** Testing Services Lead participants must read both playbooks. Many Tester use cases are also done at the lead level when working on a specific issue.

---

## 2. Approved tools for Testing Services Lead

| Tool | Use | Status |
|------|-----|--------|
| **Atlassian Rovo** | PRIMARY — strategy docs, PI test plans, defect pattern analysis, status reports, cross-team coordination | Available |
| **Copilot Chat** | Bug pattern analysis, Eggplant strategy review, automation script review | When deployed |
| **GitHub Copilot** | Limited — for any direct test/script work | When deployed |
| **M365 Copilot** | Exec reports, PowerPoint summaries, Teams meeting prep, Outlook | Available |
| **Power BI Copilot** | Defect dashboards, coverage analytics, sprint/PI test reporting | **NEW ASK — flag for Dave** |
| **Zephyr AI features** (if available) | Portfolio-level test execution view, AI-assisted test case curation | **VERIFY — already approved tool, AI features may be enabled** |
| **Eggplant AI features** (if available) | Automation strategy decisions; AI-assisted authoring patterns | **VERIFY — already approved tool, AI features may be enabled** |
| **Teams Copilot** | Meeting summaries for cross-team test reviews | **Likely available — M365 stack — VERIFY** |

**Not approved:** ChatGPT direct, Claude direct, any external LLM.

---

## 3. Use cases & prompt patterns

### 3.1 PI test strategy authoring

**When:** Before each PI, drafting the program-level test strategy.

**Tool:** Rovo (Confluence-aware)

**Prompt pattern:**
```
Draft a PI test strategy for [PI ID] based on:

- Scope: epics planned for this PI from [link to PI plan / Jira filter]
- Risk areas from previous PI: [list — high-defect areas, late-discovery
  areas, env stability issues]
- Team capacity: [tester FTE per team]
- Automation coverage current state: [% by team or feature area]
- Compliance scope: [IL Rule 431, ADA, accessibility checkpoints]

Output a strategy document with:
1. PI test objectives (3-5 measurable)
2. Risk-based testing priorities (heat map: feature area × risk level)
3. Test type allocation (% manual, % automated, % exploratory) per area
4. Environment requirements + scheduling considerations
5. Test data needs + synthesis strategy
6. Cross-team coordination requirements
7. Entry/exit criteria for each test stage
8. Compliance test coverage commitments
9. Automation backlog priorities for this PI
10. Risks, assumptions, dependencies

Length: 2-3 pages. Format: Confluence page with sections matching above.
Source citations to prior PI retros + defect data.
```

**Quality check:** Verify all source data references; cross-check with team Test Leads before finalizing. Walk through with John.

### 3.2 Portfolio-level defect pattern analysis

**When:** Monthly or per-PI — find systemic defect patterns across teams.

**Tool:** Rovo + Copilot Chat (after CSV export from Jira)

**Prompt pattern (Rovo):**
```
Analyze the past [90 days / PI 26.1] of defects across ALL 12 teams:

[link to Jira filter]

Identify:
1. Top 5 defect categories by volume (with examples per category)
2. Top 3 categories by severity-weighted volume
3. Cross-team patterns (same defect type appearing in multiple teams)
4. Stage where defects are caught (Dev / Test / UAT / Prod) — trend
5. Stage where defects are introduced (per "found in" + RCA when available)
6. Reopen patterns — defects fixed then reopened (root cause weakness)
7. Time-to-resolve trends by category
8. Outliers — single defects with disproportionate impact

For each finding: cite at least 3 example Jira keys.
Suggest 3 systemic improvements (process, tool, or training) with estimated impact.

Constraint: Don't invent Jira keys; verify each cited bug exists.
```

**Quality check:** Spot-check 5 cited Jira keys; ensure root cause groupings match actual defect content; review with Test Leads before recommending changes.

### 3.3 PI test plan generation (per team, rolled up)

**When:** During PI planning — coordinate test plans across all teams.

**Tool:** Rovo

**Prompt pattern:**
```
For each team committing to PI [ID], generate a test plan summary using:

- Stories committed: [Jira filter per team]
- Team test capacity: [FTE × sprint days × utilization]
- Story estimation: [SP per story]
- Test ratio benchmark: [historical hrs/SP for testing per team]

For each team's test plan, output:
- Total testable stories + total SP
- Estimated test effort (hrs) using historical ratio
- Capacity gap (effort vs available capacity) — flag overcommit
- Test types needed (functional/automation/regression/performance/accessibility)
- Cross-team dependencies that affect testing
- Recommended test sequencing

Then a program-level rollup:
- Overcommitted teams (need scope cut or capacity add)
- Undercommitted teams (capacity available for risk-based deep tests)
- Cross-team test coordination requirements
- Critical path test items

Output as a Confluence page with one section per team + program rollup.
```

**Quality check:** Verify each team's capacity input with their Test Lead; flag overcommits in PI Planning.

### 3.4 Test environment scheduling & conflict analysis

**When:** Continuous; especially before PI / sprint planning.

**Tool:** Rovo

**Prompt pattern:**
```
Analyze test environment usage and conflicts:

Environments: [list of envs — DEV, TEST, INT, UAT, perf, etc.]
Teams using each: [matrix]
Sprint schedule: [PI calendar]
Known booking conflicts: [list]

For the next [sprint / PI]:
1. Identify scheduling conflicts (two teams need same env same time)
2. Identify under-utilized capacity (env time available but unused)
3. Suggest schedule adjustments to resolve conflicts
4. Flag environment-quality risks (stability, recent failures)
5. Recommend env-availability requirements to feed into PI plan

Constraint: Don't invent environments; use the provided list. Don't
re-allocate without flagging which teams it affects.
```

**Quality check:** Verify resolution proposals don't break other dependencies; coordinate with infra/env team.

### 3.5 Test data strategy

**When:** Per PI — what synthetic data is needed, by whom, when.

**Tool:** Rovo

**Prompt pattern:**
```
Develop a test data strategy for PI [ID]:

PI scope: [link to plan]
Entities involved: [list per team]
Data volume needs (per team): [estimates]
Data quality needs: [edge cases, boundary, special chars per team]

Generate:
1. Per-entity data requirements (volume, variants, edge cases)
2. Source: synthetic generation / masked from prod / mock from spec
3. Owner: who creates and maintains the dataset
4. Refresh frequency: how often the dataset gets refreshed
5. Sharing: which teams can use which datasets
6. Compliance: confirm no PII / no real child welfare data in any path
7. Tool: which tool generates each dataset (Copilot, custom script, vendor tool)

Output: a per-entity matrix + a program-level governance summary.
```

**Quality check:** Ensure NO path involves real DCFS data; coordinate with data team for synthesis approach; sign-off from compliance.

### 3.6 Automation roadmap & ROI analysis

**When:** Per PI — what to automate next, what to deprecate.

**Tool:** Rovo + Copilot Chat

**Prompt pattern:**
```
Analyze our automation backlog for ROI prioritization:

Current automation suite: [link to inventory or paste summary]
Manual test cases by frequency: [list — what tests run every sprint, every release]
Selenium → Eggplant migration progress: [status per team]
Recent automation failures (flakiness): [defect data]

For each candidate automation:
1. Current manual cost (hrs per execution × frequency × teams using)
2. Estimated automation effort (hrs to build + maintain annually)
3. Payback period (months)
4. Risk reduction (how often does this manual test catch a defect)
5. Maintenance risk (how often does this area change)

Output: prioritized automation backlog with top 10 candidates ranked by
ROI, plus 5 candidates to DEPRECATE (low value, high maintenance).
```

**Quality check:** Validate cost estimates with Test Leads; verify deprecation candidates aren't catching real defects (look at recent fail history).

### 3.7 Cross-team test coordination

**When:** Ongoing — surface dependencies between teams' test work.

**Tool:** Rovo

**Prompt pattern:**
```
Find cross-team test dependencies for [time window — current sprint / PI]:

Teams: all 12
Stories with cross-team dependencies: [Jira filter for "depends on" links
across teams]

For each cross-team dependency that affects testing:
1. Who's testing first (the dependency provider)
2. Who's testing second (the dependent)
3. Test handoff requirement (data, env, mock service, contract test)
4. Risk if first team is late (cascade impact on second team's testing)
5. Mitigation (mock, contract test, decoupled testing)

Output a dependency map for the test coordination meeting.
```

**Quality check:** Verify each cited dependency in Jira; confirm handoff understanding with Test Leads on both sides.

### 3.8 Executive test status reporting

**When:** Weekly — to Jim/Dave + program leadership.

**Tool:** Rovo + Power BI Copilot (if approved) + M365 Copilot (for slide drafting)

**Prompt pattern (Rovo for narrative):**
```
Draft this week's program test status:

Pull from Jira:
- Test cases executed (by team, by stage)
- Defects opened/closed/deferred (by severity)
- Test coverage % per PI scope
- Automation suite execution + flakiness
- Environment availability + incidents

Output a 1-page executive summary with:
- Headline (1 sentence)
- 3 wins
- 3 risks
- 3 asks (where leadership can help)
- Trend chart references

Tone: Factual, surface real risks, no hedging.
Audience: CIO + program leadership.
```

**Prompt pattern (Power BI Copilot for charts):**
```
[in Power BI Copilot] Build a sprint test trend dashboard with:
- Defect volume by severity over last 6 sprints (stacked bar)
- Test execution pass rate by team (line, last 6 sprints)
- Automation coverage % by team (current snapshot)
- Defect aging (open defects by age bucket)
- Defect leak rate (caught at Test / UAT / Prod)
```

**Quality check:** Verify every number against Jira; review with John before sending up; never let AI summarize numbers without source verification.

### 3.9 Tester coaching and best-practice capture

**When:** Ongoing — turn pilot learnings into team-wide knowledge.

**Tool:** Rovo

**Prompt pattern:**
```
Synthesize pilot Tester learnings from these weekly check-ins and surveys:

[paste check-in notes / link to survey results]

Identify:
1. Prompt patterns that worked well (with examples)
2. Prompt patterns that failed (with reasons)
3. Tool features underutilized (Copilot/Rovo/Eggplant)
4. Skill gaps surfaced (where training falls short)
5. Process changes that helped or hurt

Output: an updated section for the Tester playbook + a coaching note for
Test Leads on what to reinforce.
```

**Quality check:** Cross-reference with what testers actually said (don't let Rovo paraphrase away nuance).

### 3.10 V3 workflow rollout coordination (if Testing Services Lead is involved)

**When:** When V3 workflow rollout touches testing stages.

**Tool:** Rovo

**Prompt pattern:**
```
For the V3 workflow transition:

V3 changes affecting testing:
- Testing splits into: Testing → Integration → Acceptance Testing → Acceptance Testing Complete
- Sub-stage markers: DEV unit / TEST functional / INT smoke / UAT (smoke + regression + demo + USA + DoD + sign-off)
- Explicit DoR Sign-Off gate added before Backlog

For [team] migrating to V3:
1. Map current test stage activities to V3 equivalents
2. Identify new activities required by V3 (per sub-stage marker)
3. Identify activities deprecated by V3
4. Estimate transition effort (hrs per team)
5. Risks during transition (gaps in coverage, env confusion, metric discontinuity)
6. Coordination needs with Vinay's AI pilot (don't co-cutover)

Output: per-team transition plan + program-level coordination summary.
```

**Quality check:** Coordinate with V3 owner; ensure AI pilot timing aligns (don't cutover both at once for the same team).

---

## 4. Workflow integration

### Where AI fits in the Testing Services Lead workflow

```
PROGRAM-LEVEL CYCLES
     ├── PER PI (every 12 weeks)
     │     ├── PI test strategy [ROVO 3.1]
     │     ├── PI test plan rollup [ROVO 3.3]
     │     ├── Test data strategy [ROVO 3.5]
     │     ├── Automation roadmap update [ROVO 3.6 + COPILOT CHAT]
     │     └── PI test readiness gate review
     │
     ├── PER MONTH
     │     ├── Portfolio defect pattern analysis [ROVO 3.2]
     │     └── Tester coaching synthesis [ROVO 3.9]
     │
     ├── PER WEEK
     │     ├── Executive status report [ROVO 3.8 + POWER BI COPILOT + M365 COPILOT]
     │     ├── Cross-team test dependency review [ROVO 3.7]
     │     └── Test environment conflict resolution [ROVO 3.4]
     │
     └── PER SPRINT (every 2 weeks)
           ├── Sprint test risk review (per team rollup)
           └── Defect triage portfolio view
```

### Tag every AI-touched artifact at this level

- **Strategy docs / plans / reports:** add `ai-assisted` Confluence label
- **Power BI dashboards:** note "AI-assisted" in dashboard description
- **Slide decks:** add a footer note "AI-assisted draft, human-reviewed"

The Testing Services Lead's AI use is high-visibility — labeling is a transparency commitment to leadership, per DoIT 5a-c.

---

## 5. HITL discipline & DCFS guardrails

### Hard rules

1. **No real DCFS case data in any prompt** — at this role's level, you have access to lots of program data; the temptation to paste "real examples" is high. Don't.
2. **No real defect content with PII** — if a defect description contains case-identifiable info, redact before pasting.
3. **No security documentation in prompts**.
4. **All strategy docs reviewed before publication** — don't publish Rovo output to leadership without your own pass.
5. **All numbers verified against source** — Rovo can paraphrase numbers incorrectly; you own the integrity.
6. **All cited Jira keys verified to exist** — Rovo hallucinates keys.

### Soft rules

- Don't let AI make strategic recommendations without your synthesis
- Don't accept defect category groupings without checking 5 examples per category
- Don't publish exec reports without John reviewing first
- Treat AI summaries of survey free-text with skepticism — paraphrasing loses signal
- Flag if Rovo invents an environment, team name, or system reference

### What to do if you suspect a leak

1. Stop using AI on that artifact
2. Note what was pasted
3. Notify Robert Rodriguez immediately
4. Do not publish until reviewed

---

## 6. Success metrics for Testing Services Lead pilot participant

This role's success is measured by **portfolio-level outcomes**, not personal throughput.

### Bottleneck-easing (the headline)

| Metric | Source | Target |
|--------|--------|--------|
| % Work Completed per PI on pilot teams | Weekly Completed Work slide | +10 pts (67% → 77%) |
| Stories clearing UAT first attempt (program) | Jira workflow | ↑ |
| UAT rejection rate (program) | Jira workflow | ↓ |
| Test cycle time per stage (program median) | Jira changelog | ↓ |
| Defect leak rate (Test → UAT → Prod) | Jira "found in" | ↓ |

### Coordination & strategy outputs

| Metric | Source | Target |
|--------|--------|--------|
| PI test strategy delivered N weeks before PI | Confluence timestamps | trended |
| Cross-team test dependency conflicts resolved per sprint | Coordination log | trended |
| Environment conflicts resolved before sprint start | Env scheduling | ↓ unresolved |
| Automation backlog ROI items shipped per PI | Repo + tracking | trended |

### Quality of AI-augmented outputs

| Metric | Source | Target |
|--------|--------|--------|
| Strategy docs needing significant rework after AI draft | Doc revisions | trended ↓ |
| Defect category groupings validated by Test Leads | Review | 95%+ accurate |
| Numerical accuracy in exec reports (vs Jira source) | Spot audit | 100% |

### Self-reported

| Metric | Source | Target |
|--------|--------|--------|
| Hours saved per week (strategy/coordination work) | Weekly check-in | self-reported |
| Confidence in AI output (1-5) | Monthly survey | ≥ 4 by Sprint 4 |
| Most useful AI use case | Monthly survey | informs Phase 2 |

---

## 7. Training emphasis

### Pre-pilot training (3h, before PI Planning)

| Module | Duration | Content |
|--------|----------|---------|
| Foundation (shared) | 1.5h | DoIT compliance, HITL, success criteria |
| Testing Services Lead track | 3h | Rovo for strategy/planning prompts (3.1, 3.3, 3.5, 3.6), Rovo for analysis (3.2, 3.9), Power BI Copilot (3.8), M365 Copilot for exec reports, anti-patterns |
| **Add-on:** Tester track | 3h (recommended) | The TS Lead should understand the Tester playbook to coach effectively |

### Critical training emphases

- **Source-grounded prompting** — at this level, every output is read by leadership; verifiable sources are mandatory
- **Numerical integrity discipline** — Rovo can drift on numbers; you own them
- **Defect category quality** — AI groupings are starting points; validate with Test Leads
- **When to NOT use AI** — strategic judgment calls; you are the judgment, AI is the synthesis
- **Coaching tester pilot participants** — knowledge transfer pattern from your AI use to theirs

---

## 8. Anti-patterns

| Anti-pattern | Why it's bad | What to do instead |
|--------------|--------------|-------------------|
| Publishing Rovo strategy drafts as final | Strategy is your judgment, not AI's | Use Rovo for synthesis; you write the recommendation |
| Trusting Rovo's numerical summaries | Rovo paraphrases numbers wrong | Numbers come from queries; Rovo does narrative only |
| Asking Rovo to "decide" what to test | Test priorities are risk decisions you own | Use Rovo to surface options; you decide |
| Pasting real defect descriptions with PII | Hard policy violation | Redact before pasting; or paste Jira key only and let Rovo fetch |
| Letting AI categorize defects without verifying examples | Wrong categories → wrong improvements | Spot-check 5 examples per category |
| Generating an exec report without source verification | One bad number burns credibility | Audit every number before sending |
| Publishing without John's review | Cross-team strategy needs his sign-off | John reviews; you publish |
| Using AI to write the test strategy AND the success metrics | Tautology — strategy meets its own bar | Strategy and measurement are separate exercises |
| Sharing useful prompts privately | Loses program-wide learning | Share to playbook + train Test Leads |

---

## 9. Open questions for this Testing Services Lead playbook

1. **Who is the Testing Services Lead?** Confirm name + reporting line (likely under John?)
2. **Are there team-level Test Leads in addition?** If yes, this playbook may have a junior version for them.
3. **Power BI Copilot — is it approved / available?** Critical for the dashboard use cases (3.8).
4. **Does Zephyr have AI features enabled at DCFS?** Could substantially augment 3.6 / 3.9.
5. **Does Eggplant have AI features beyond what we know?** Worth verifying with John.
6. **What's the env availability situation?** If env scarcity is the actual bottleneck, AI on testing strategy hits a ceiling — needs infra investment.
7. **Is there a centralized synthetic data factory or per-team?** Affects 3.5 strategy.
8. **What's the V3 rollout timing?** Testing Services Lead is the natural owner for V3 testing-side coordination.
9. **What exec-report cadence does Jim/Dave expect?** Weekly per current rhythm — confirm.
10. **Is there a defect classification taxonomy already?** If yes, AI uses it. If not, this is a gap to fill in pilot.

---

## 10. Pilot participant checklist

Before you start using AI on Testing Services Lead work:

- [ ] Foundation training complete
- [ ] Testing Services Lead track complete
- [ ] Tester track complete (recommended for coaching readiness)
- [ ] Rovo access on DCFS Jira/Confluence
- [ ] Power BI Copilot access confirmed (or workaround agreed)
- [ ] M365 Copilot access (Outlook + PowerPoint + Word)
- [ ] Read this playbook end-to-end
- [ ] Read the Tester playbook end-to-end
- [ ] Numerical-integrity discipline understood
- [ ] Source-grounding practice understood
- [ ] Confluence `ai-assisted` label workflow understood
- [ ] Know how to report a suspected leak (Robert)
- [ ] Tracking time saved in weekly check-in
- [ ] Coaching plan in place for pilot Testers (you teach what you learn)

---

## Appendix A: Reference

| For details on... | See |
|-------------------|-----|
| Engagement scope, in/out, Phase 2/3 | [../scope-running-book-v04212026.md](../scope-running-book-v04212026.md) |
| Individual Tester role | [./playbook-tester-v04212026.md](playbook-tester-v04212026.md) |
| Measurement methodology | [../measurement-methodology-v04142026.md](../measurement-methodology-v04142026.md) |
| Rollout plan + timeline | [../../rollout-plan.md](../../rollout-plan.md) |
| DoIT policy + governance | [../governance-proposal-v04142026.md](../governance-proposal-v04142026.md) |
| Risk register | [../assumptions-and-risks.md](../assumptions-and-risks.md) |
| Other role playbooks | [./](.) |
