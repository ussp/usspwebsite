# Pilot Metrics — AI Contribution Breakdown

> **Version:** V20260430 (v1.0 draft)
> **Owner:** AI Transformation Lead (Krasan)
> **Companion to:** `pilot-metrics-proposal-to-doit-v20260430.xlsx` (the metric inventory)
> **Audience:** Pilot governance team, role leads, DoIT
> **Purpose:** For each of the 10 recommended metrics, explain WHY and HOW the proposed AI workflow moves it. This is the theory-of-change behind the measurement plan.

---

## How to read this document

Each section covers one recommended metric and breaks down:

- **What it measures** — restated for context
- **Today's state** — what the workflow looks like without AI
- **AI lever(s)** — which tools and workflow changes move this metric
- **Mechanism** — concretely, what AI does that improves the number
- **Expected impact** — directional magnitude (with role-specific target)
- **Dimension** — does this primarily move velocity, quality, or both
- **Risks / caveats** — what can go wrong and how to mitigate

---

## 1. Story Quality Score (QUS 13-Criteria) — Business Analyst

**What it measures:** Programmatic score of each user story against 13 quality criteria (Quality User Story framework) — covering things like clarity, INVEST adherence, AC presence, scope, format.

**Today's state:** Stories are written in JIRA by the BA (Sushil) based on PO intake docs and OTI / discovery context. Story quality is BA-skill-limited — confirmed in the Apr 14 PO walkthrough. Inconsistent across teams; weak stories cause downstream rework at testing where rework is most expensive (per the Apr 21 walkthrough finding).

**AI lever(s):**
- **Atlassian Rovo** in JIRA — generates draft story content from a brief and Confluence context.
- **M365 Copilot** in Word/Outlook — drafts story narratives from intake notes and email threads.

**Mechanism:** Rovo has structured awareness of QUS-style criteria built into its story prompts. Given a brief plus relevant Confluence/OTI context, it produces drafts that already include AC, scope statements, and a testable verb structure. The BA reviews and edits — AI fills in the patterns BAs commonly skip when rushing.

**Expected impact:** 15–20% lift on the average QUS score across pilot-team stories within the pilot PI.

**Dimension:** Quality (direct). Indirect velocity impact via reduced downstream rework.

**Risks / caveats:**
- AI on bad inputs produces bad stories — BA still has to recognize when AI introduces errors.
- Less experienced BAs may accept AI output uncritically. Pair with peer review during ramp.
- QUS criteria can be gamed (formatting only) — combine with the AC completeness rubric to catch shallow improvements.

---

## 2. Acceptance Criteria Completeness — Business Analyst

**What it measures:** Manual rubric (1–5) on AC quality for ~10 sampled stories per sprint — covering testability, coverage of happy path + edge cases, format consistency.

**Today's state:** AC quality varies sharply by BA. Common gaps: missing negative cases, ambiguous "should" language, no role/permission boundaries, no data-volume boundaries. These gaps surface during dev (`% stories needing rework due to incomplete AC` jumps) or, worse, during testing.

**AI lever(s):**
- **Rovo** — given a story narrative, generates a candidate AC block including positive, negative, and edge cases.
- **M365 Copilot Chat** — used in workshop / refinement mode to interactively expand AC.

**Mechanism:** Rovo's training set surfaces common AC patterns (boundary, role, data, error). When the BA invokes "generate AC" on a story, the output covers the dimensions a human under time pressure would skip. The BA reviews and prunes.

**Expected impact:** Average AC completeness rubric score moves from ~3.0 baseline to ~4.0 within the pilot PI. Downstream signal: drop in `% stories needing rework due to incomplete AC` by 30–50%.

**Dimension:** Quality (direct). Indirect velocity impact downstream.

**Risks / caveats:**
- AC bloat — AI generates lots of cases, including irrelevant ones. Train BAs to prune aggressively.
- Domain-specific edge cases (DCFS-specific case-handling logic) AI can't infer — BA must add these manually.
- Pair the rubric with a sample-only audit (10 stories) to keep collection burden low.

---

## 3. SDD Creation Time — Solution Architect

**What it measures:** Hours to draft a Solution Design Document per feature (self-reported in Tempo or shared sheet).

**Today's state:** SDDs are drafted in Word by the SA, with diagrams in Visio embedded as images, stored in SharePoint with version control. Pre-ARB review cycle adds revisions. Today the SA writes from scratch each time, even when patterns repeat.

**AI lever(s):**
- **M365 Copilot** in Word — drafts SDD sections from a brief and prior similar SDDs.
- **Atlassian Rovo** — pulls related Confluence pages (architecture decisions, prior designs, integration patterns) as context.
- **Copilot in Power Platform / Dataverse maker** — for the data model section, AI generates table sketches that the SA refines.

**Mechanism:** AI does the mechanical work of (a) starting a Word doc with the SDD template populated, (b) pulling reference patterns from similar prior SDDs, (c) generating data-model sketches. The SA's time shifts from blank-page authoring to review/refinement — typically a 2–3× speedup on the drafting portion.

**Expected impact:** 10–15% reduction in SDD creation time within the pilot PI. Larger gain (closer to 30%) on SDDs that closely resemble prior ones.

**Dimension:** Velocity (direct, frees architect capacity). Indirect quality via better pattern reuse.

**Risks / caveats:**
- AI produces generic content — SA must add ILC-specific architectural decisions.
- Hallucinated references to nonexistent prior SDDs — verify cross-references before submitting to pre-ARB.
- Self-reported logging is high burden; sample only or pull from Tempo.

---

## 4. SDD Completeness Score (Pre-ARB Rubric) — Solution Architect

**What it measures:** Rubric score on SDD completeness against the pre-ARB checklist — covers data model, integration points, sequence diagrams, ADRs, security considerations, deployment notes.

**Today's state:** SDDs are reviewed at pre-ARB (Shyam + Kashif + Maximus architects). Common gaps: missing security section, weak deployment notes, no ADRs documented, integration points listed but not diagrammed.

**AI lever(s):**
- **M365 Copilot** in Word — generates completeness checklist drafts and fills in standard sections (security, deployment).
- **Rovo** — pulls applicable architecture patterns and decision records from Confluence.

**Mechanism:** AI prompts the SA with the pre-ARB checklist and generates draft content for sections the SA might skip under time pressure (security, deployment, ADR rationale). The SA reviews and refines. Pre-ARB reviewers see more complete first drafts; revision count drops.

**Expected impact:** 15–25% lift in pre-ARB rubric score; downstream `SDD revision count` drops by ~30%.

**Dimension:** Quality (direct).

**Risks / caveats:**
- AI may generate generic security/compliance language that's wrong for DCFS context (CANTS, FERPA boundaries) — SA must validate.
- Rubric design matters — rubric must be objective enough to score consistently across SDDs.

---

## 5. Story Cycle Time (Development Time) — Dynamics Developer

**What it measures:** Days from "In Progress" → "Done" — the canonical development-time metric.

**Today's state:** Dynamics Developers work in a strict priority order — **(1) Configuration first** (out-of-box Dynamics + Power Apps maker), **(2) North52 expressions** (low-code business rules), **(3) Custom code** (.NET plugins, PCF, Azure Functions, JS validators). Per the Apr 23 walkthrough: most time is spent in the configuration + North52 tiers; the custom-code tail is the minority but the area where GitHub Copilot has the strongest impact.

**AI lever(s):**
- **GitHub Copilot** in Visual Studio — for plugins, PCF, Azure Functions, JS validators.
- **Copilot in Power Apps maker / Power Automate designer** — for canvas authoring, flow design.
- **Rovo / M365 Copilot** — for understanding requirements and generating boilerplate code comments / docs.

**Mechanism:** On the pro-code tail, Copilot generates boilerplate, completes patterns, and writes test scaffolding — measurable acceleration. On the low-code surface, designer Copilot accelerates flow building and table generation. The combined effect on story cycle time: faster transition through "In Progress" because boilerplate that previously took hours now takes minutes.

**Expected impact:** 10–15% reduction in story cycle time **gated on R-22 (GitHub Copilot enablement on team GCC env)**. Without R-22 resolution, gain shrinks to 5–8% (low-code Copilot only).

**Dimension:** Velocity (direct). Indirect quality risk — see caveats.

**Risks / caveats:**
- DORA 2025: AI can hurt stability if quality slips. Pair with `First-pass QA yield` to catch this.
- Copilot on poorly-written stories produces poor code — story quality (metric 1) gates this.
- Per-validator / per-expression / per-plugin granularity available as **custom metrics** if a team wants the deeper view (DCFS-specific).

---

## 6. First-Pass QA Yield — Dynamics Developer

**What it measures:** % of stories passing QA on first attempt (no transition back from "In QA" to "In Progress").

**Today's state:** Stories often bounce back from QA due to acceptance-criteria gaps, missed edge cases, or shallow developer testing before handoff. This is the inverse of the rework rate at the dev/QA boundary.

**AI lever(s):**
- **Rovo** — generates additional test cases at story creation (shift-left pattern, see metric inventory) so QA finds fewer gaps.
- **Copilot in VS / VS Code** — generates unit tests alongside production code.
- **AC completeness lift** (metric 2) directly reduces QA bounce-backs.

**Mechanism:** Two AI levers compound. (a) Better AC means dev knows what to build. (b) AI-generated unit tests catch bugs before QA sees them. Result: stories arriving at QA are more likely to pass first try.

**Expected impact:** First-pass yield moves from ~60% baseline to ~75% within the pilot PI.

**Dimension:** Quality (direct). Strong indirect velocity — fewer rework loops mean more committed stories complete.

**Risks / caveats:**
- DORA 2025 explicitly flagged: AI accelerates dev, but if QA isn't proportionally supported, downstream stability suffers. Watch this metric for early-warning signs.
- Yield can be gamed by softening QA criteria — combine with `defect escape rate` (post-UAT) for a downstream check.

---

## 7. Test Coverage % — Senior Tester

**What it measures:** % of stories with at least one linked test case in Zephyr Scale. Story-level coverage (per Apr 30 team feedback — easier to collect, matches existing Zephyr report).

**Today's state:** Coverage varies by story complexity and tester time available. Per the Apr 24 walkthrough, ~20% of tester time is authoring; 80% is execution + data prep + role switching + screenshots. Coverage suffers when tester time is squeezed.

**AI lever(s):**
- **Rovo** in JIRA + Zephyr Scale — generates test cases from the story description and AC, attached at creation time.
- **Zephyr Scale Agent for Rovo** — bridges Rovo into Zephyr folders so generated cases land in the right place automatically (free + admin-enabled per Apr 30 finding).

**Mechanism:** Rovo reads the story + AC, drafts a candidate test case set, and (with the Zephyr Agent) saves them directly into the Zephyr folder linked to the story. Tester reviews and refines. Coverage % rises mechanically because the floor (zero-coverage stories) drops.

**Expected impact:** Coverage % from ~70% baseline to ~90% within the pilot PI. One of the easiest wins — purely additive.

**Dimension:** Quality (direct, completeness signal).

**Dependency on AC quality (BA #2):** Coverage % is gated on AC quality. If ACs are vague, AI generates shallow tests — coverage % rises but the tests are useless. We pair AC completeness + Test coverage % so a hollow gain shows up as flat AC completeness against rising coverage — and we'd catch it.

**Risks / caveats:**
- AI-generated test cases may be shallow or duplicative — tester must prune.
- Coverage % alone doesn't measure depth; pair with `negative-case coverage %` and `test cases per story`.
- Zephyr Scale Agent for Rovo enablement is required; coordinate with JIRA admin.
- AC-level coverage (% of ACs with linked tests) is in Discussion as a future enhancement once AC-to-test traceability convention is established.

---

## 8. Test Cases Per Story — Senior Tester

**What it measures:** Average count of test cases per JIRA story.

**Today's state:** Range varies wildly — simple stories may have 1–2 cases; complex ones have 8+. Average is ~3–4 per story. Tester time pressure drives the average down on busy sprints.

**AI lever(s):**
- **Rovo** — generates 3–8 test cases per story including positive, negative, edge, and role-denial cases (live demo Apr 24: generated 4 role-based + 1 negative case from a real Intact story).
- **Zephyr Scale Agent for Rovo** — saves them automatically.

**Mechanism:** Rovo's strength is breadth — it doesn't get tired or under time pressure. For a given story, it generates a richer case set than a tester producing under sprint pressure. The tester's job shifts from authoring to curating.

**Expected impact:** Average test cases per story moves from ~3.5 baseline to ~6 within the pilot PI.

**Dimension:** Quality (direct, breadth signal).

**Risks / caveats:**
- More cases ≠ better coverage if they're redundant. Track alongside negative-case coverage %.
- Generated cases need DCFS-specific data and role context — tester must adapt.
- Test execution time (the 80% slice) does NOT improve proportionally — set expectations.

---

## 9. Test Automation Coverage % — Testing Services Lead

**What it measures:** % of test cases automated (Eggplant + Zephyr-flagged automated cases).

**Today's state:** ILC is migrating Selenium → Eggplant (Keysight). Automation coverage is uneven across the 12 teams. Eggplant's SenseTalk DSL has less Copilot training data than Selenium, making AI-assisted authoring harder.

**AI lever(s):**
- **GitHub Copilot** + a curated "good Eggplant examples" library — narrows the DSL gap.
- **Rovo** — converts manual test cases into Eggplant scripts using examples as reference.
- **Zephyr Scale Agent for Rovo** — links generated automation back to source cases.

**Mechanism:** AI accelerates two parts: (a) writing new automation from manual cases (drafting), (b) keeping existing automation current as the UI changes (maintenance). The pilot focuses on (a) — converting manual cases into Eggplant scripts using a curated example library so Copilot has good context.

**Expected impact:** Automation coverage % moves up by 5–10 percentage points within the pilot PI. Larger gain in subsequent PIs as the example library grows.

**Dimension:** Quality (direct, repeatable quality signal). Indirect velocity (long-term — automation reduces tester load).

**Risks / caveats:**
- Eggplant DSL gap is real — early Copilot output will be wrong. Build the example library before rollout.
- Don't over-automate flaky scenarios — automation maintenance is a hidden cost.
- ADA / accessibility test cases require special handling (Accessibility Insight, AXE, NVDA) — out of pilot scope.

---

## 10. Testing Services Playbook Contributions — Testing Services Lead

**What it measures:** Count of TSL-authored updates to the cross-team testing playbook per sprint (Confluence page history).

**Today's state:** Playbook updates happen ad-hoc, when the TSL has time between cross-team coordination work. Updates often lag behind actual practice — by the time the playbook is updated, the team has moved on. Kamila is also Admin/Legal team lead, so playbook authoring competes with day-job demands.

**AI lever(s):**
- **M365 Copilot** in Word — drafts playbook sections from meeting notes and pilot lessons learned.
- **Rovo** in Confluence — drafts updates from existing Confluence content + recent pilot retrospectives.
- **Atlassian Rovo** in Jira — pulls related stories / defects to inform "lessons learned" sections.

**Mechanism:** TSL captures pilot lessons during weekly governance meetings. AI drafts playbook sections from those notes plus existing Confluence content. TSL reviews, refines, and publishes. What previously took an hour per playbook update now takes 15–20 minutes — so more updates get authored within the same time budget.

**Expected impact:** Update count per sprint moves from baseline (~1 per sprint) to ~3 per sprint. The qualitative output is what matters — the playbook becomes the reusable scaling artifact for the post-pilot multi-team rollout.

**Dimension:** Quality (reusable artifact). Indirect velocity (lowers future-team onboarding load).

**Risks / caveats:**
- Volume isn't the goal — quality of playbook content matters more than count. Pair with peer-review by another TSL or architect.
- Pilot scope is 1 team; cross-team playbook utility is hypothetical until scale phase.
- AI-drafted content needs DCFS-specific context — Kamila adds the institutional knowledge.

> **Note on cross-team metrics:** Genuinely cross-team TSL metrics (rollup time, coverage consistency, defect trends, pattern detection) are **deferred** to the multi-team scaling phase — not measurable in a 1-team pilot.

---

## Summary table — how AI moves each top metric

| # | Metric | Primary AI lever | Velocity / Quality |
|---|--------|------------------|--------------------|
| 1 | Story quality score (QUS) | Rovo + M365 Copilot | Quality |
| 2 | AC completeness | Rovo | Quality |
| 3 | SDD creation time | M365 Copilot + Rovo | Velocity |
| 4 | SDD completeness score | M365 Copilot + Rovo | Quality |
| 5 | Story cycle time (development time) | GitHub Copilot + Power Platform Copilot | Velocity (R-22 gated) |
| 6 | First-pass QA yield | Rovo + GitHub Copilot (tests) | Quality |
| 7 | Test coverage % | Rovo + Zephyr Scale Agent | Quality |
| 8 | Test cases per story | Rovo + Zephyr Scale Agent | Quality |
| 9 | Test automation coverage % | GitHub Copilot + Rovo + Eggplant examples | Quality |
| 10 | Testing Services Playbook contributions | M365 Copilot + Rovo | Quality (reusable scaling artifact) |

---

## DORA 2025 alignment

The DORA 2025 report on AI-assisted development found that AI gains often don't appear in team-level delivery metrics (the "Productivity Paradox"). Our 10 recommended metrics are deliberately split across **individual-output signals** (where AI gains do appear) and **quality / completeness signals** (where AI is least likely to hurt and most likely to help):

- **Individual output signals:** Story quality, SDD creation time, story cycle time, test coverage, test cases per story, automation coverage, rollup time
- **Quality guardrails:** AC completeness, SDD completeness, first-pass QA yield

This matches DORA 2025's recommendation: track individual lift while watching team-level stability. If `first-pass QA yield` or `defect escape rate` (not in top 10 but worth a watching brief) start trending wrong, AI velocity gains are unsafe and we throttle.

---

## Risks shared across metrics

- **AI on bad inputs** — story quality is the upstream gate. If story quality doesn't move, downstream metrics (AC completeness, first-pass QA yield, test coverage) all suffer. Phase BA training first.
- **Tool gating** — R-22 (Copilot GCC) and Power Platform Copilot datacenter parity gate metrics 5 and parts of 7–10. Resolve before pilot kickoff or set realistic expectations.
- **Survey-derived insight loss** — the v0.2 baseline survey already in flight feeds skill-delta and perception metrics (not in top 10 but they're how we triangulate the quantitative numbers above). Make sure response rate is high.
- **Reviewer fatigue** — AI generates volume; humans review. Pace adoption to avoid review-bottleneck.

---

## Version history

| Version | Date | Changes |
|---------|------|---------|
| v1.0 draft (V20260430) | 2026-04-30 | Initial AI-contribution breakdown for the 10 recommended metrics — mechanism, expected impact, dimension, risks per metric. |
