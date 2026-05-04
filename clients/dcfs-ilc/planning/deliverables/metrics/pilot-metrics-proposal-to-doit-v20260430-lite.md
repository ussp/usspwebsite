# Pilot Metrics Proposal — DoIT Review

> **Version:** V20260430 (v1.1 — team feedback applied)
> **Owner:** AI Transformation Lead (Krasan)
> **Audience:** DoIT (via Dave Nika and Romi Kovacs); copy to Pilot Governance Lead
> **Status:** DRAFT — for Romi review before routing to Dave/DoIT

## Apr 30 team feedback applied

Team review of the lite proposal surfaced the following changes (now incorporated):
1. **NEW metric: SDD rejection rate** (SA Recommended) — replaces "SDD revision count" with team-preferred name; same idea, broader scope (initial submission → full ARB approval).
2. **SA Top 2 revisited:** original picks (SDD creation time, SDD completeness score) moved to **Discussion / Need to Review**. SA second Recommended is TBD pending team confirmation.
3. **Pre-ARB cycle time:** team noted "we don't track the duration" — no current baseline. Pilot will establish baseline from sprint 1.
4. **Story cycle time (development time):** end boundary changed from "In Progress → Done" to **"In Progress → In Testing"** — keeps this metric dev-only. Story-to-deploy covers full delivery cycle separately.
5. **First-pass QA yield:** open question — confirm exact JIRA workflow status names for the calculation.
6. **Test coverage %:** kept at story-level (not AC-level) — easier to collect, matches existing Zephyr report. AC-level moved to Discussion as future enhancement.
> **Companion docs:**
> - [pilot-metrics-by-role-v20260427.md](./pilot-metrics-by-role-v20260427.md) — full candidate set
> - [pilot-metrics-collection-methods-v20260423.md](./pilot-metrics-collection-methods-v20260423.md) — collection methods + prerequisites
> - [tool-authorization-list.md](../strategy/tool-authorization-list.md) — AI tool catalog

---

## 1. Purpose

This document proposes the metric set we intend to track during the DCFS AI Pilot, organized by pilot role. It is the curated subset of the larger candidate list that we believe is (a) measurable with the data and tools we have, (b) worth the collection burden, (c) maps to the role-specific productivity target, and (d) ties to the DoIT AI Policy MEASURE / MONITOR controls and NIST AI RMF MEASURE function.

The proposal is **2 metrics per role × 5 roles + cross-cutting = ~12 metrics total** — within the 8–10 range agreed with governance, with two cross-cutting items added for AI-policy-required oversight (usage volume and prompt-drift incidents).

Per Apr 24 governance review (D-3), final per-role metric selection is a design-phase decision driven by each role lead. This document is the **recommended starter set** for DoIT review; the role lead may refine within the candidate list referenced above.

---

## 2. Measurement philosophy

- **Tangible outputs over story points.** Story points compress as AI accelerates sizing; they understate gains.
- **Before / after + control.** Pilot members compared against pre-pilot baseline and against non-pilot teams.
- **Multi-dimensional.** No single metric can fake improvement — quality, speed, and team health are tracked together.
- **Role-specific targets, single executive headline.** Internal targets differ by role; executive comms keep the uniform 10–15% portfolio target.

### Metric type — what each one actually measures

Not every metric in the catalog measures performance improvement. We classify metrics into five types and only the **Performance** type evidences the productivity-improvement claim. The rest provide necessary supporting context but should not be presented as performance gains.

| Metric Type | What it measures | Examples | Used to evidence... |
|---|---|---|---|
| **Performance** | Quantitative deltas on actual work output (the productivity-improvement story) | Story quality score, refinement cycle time, story-to-deploy, first-pass QA yield, test coverage %, automation coverage %, deployment frequency, change failure rate, rework rate | Did AI move the needle on the work? |
| **Adoption** | Are people actually using the AI tools? | AI tool usage volume, AI suggestion acceptance rate, AI tool ROI composite | Are the tools being adopted? (Necessary but not sufficient.) |
| **Capability** | Did pilot members get better at AI-assisted work? | Pre/mid/post AI skills delta, adoption barrier index | Are people growing in AI fluency? |
| **Sentiment** | How do people feel about AI? (self-reported / survey) | Self-reported productivity perception, self-reported quality perception, SPACE survey, AI tool satisfaction pulse | Is adoption sustainable from a team-health standpoint? |
| **Process Safety** | Governance / compliance signal — are we using AI safely? | Prompt-drift incidents | DoIT MEASURE/MONITOR oversight (§6, §7, §11) |

### How AI impact is actually measured

**Performance metrics are how we measure AI impact.** The 10 Recommended metrics (all type Performance) are the productivity-improvement evidence — collected continuously per sprint from JIRA, Zephyr Scale, GitHub, and Azure DevOps. Sprint-over-sprint deltas vs. the pre-pilot baseline are the AI-impact story.

**The other metric types (Adoption, Capability, Sentiment, Process Safety) are survey-driven** — they live alongside Performance metrics but use a different collection cadence:

- **Baseline survey** (pre-pilot, already in flight as v0.2) — captures starting AI experience, skills, sentiment, adoption barriers per role.
- **End-of-sprint survey** — short pulse (5 questions) per sprint to track adoption + sentiment + capability growth as the pilot runs.
- **End-of-pilot survey** — full repeat of the baseline survey to produce the before/after improvement picture on the survey-driven dimensions.

This split keeps Performance metrics as the headline (continuous, quantitative, what DoIT will see in MEASURE/MONITOR reports) and survey metrics as the supporting before/after story (qualitative team-health and adoption picture).

**DORA 2025 caveat:** DORA's "AI Productivity Paradox" finding shows that high adoption + positive sentiment can coexist with flat team-level delivery. We cannot substitute Adoption or Sentiment metrics for Performance. The Recommended Top 10 stays Performance-only; surveys complement but do not replace.

---

## 3. Proposed metrics by role

### 3.1 Business Analyst — Sushil

| Metric | What it measures | Data source | Why this metric |
|--------|------------------|-------------|-----------------|
| **Story quality score (QUS 13-criteria)** | Programmatic scoring of story content against 13 quality criteria | JIRA stories — script-scanned | Upstream lever — bad stories cause downstream rework at testing where rework is most expensive |
| **Refinement cycle time** | Days from "Story created" → "Ready for Dev" | JIRA transition timestamps | Direct AI productivity signal for BA workflow; aligns with Preparation Metrics slide |

**Role target:** 15–20% improvement on these metrics within the pilot PI.

### 3.2 Solution Architect — Kali Devineni

| Metric | What it measures | Data source | Why this metric |
|--------|------------------|-------------|-----------------|
| **SDD rejection rate** | Number of revisions an SDD goes through from initial submission through full ARB approval | SharePoint version history + ARB tracking | Direct signal on first-draft quality — fewer revisions = better drafts. Team-named metric (Apr 30 feedback). |

**Team feedback (Apr 30):** original Top 2 (SDD creation time, SDD completeness score) moved to Discussion / Need to Review pending team confirmation. Pre-ARB cycle time noted as no-current-baseline (would be measured from pilot start). SA second Recommended is **TBD pending team confirmation**.

**Role target:** 10–15% improvement.

### 3.3 Dynamics Developer — Anudeep Chaitanya

| Metric | What it measures | Data source | Why this metric |
|--------|------------------|-------------|-----------------|
| **Story cycle time (development time)** | Days from "In Progress" → **"In Testing"** — development-only (handoff to testing), not full delivery cycle | JIRA transitions | Direct development throughput. Apr 30 team feedback: end boundary at "In Testing" handoff keeps this dev-only. Full delivery cycle covered separately by story-to-deploy. |
| **First-pass QA yield** | % of stories passing QA on first attempt | JIRA transition history ("In QA" → "Done" vs. back to "In Progress") | Quality signal — proves AI isn't trading speed for defects. Apr 30 team feedback: open question — confirm exact JIRA workflow status names for the calculation. |

**DCFS work order:** Dynamics Developers build in this priority order — (1) **Configuration first** (out-of-box Dynamics + Power Apps maker), (2) **North52 expressions** (low-code business rules), (3) **Custom code** (.NET plugins, PCF, Azure Functions, JS validators). AI lift is expected at each tier; the highest-value custom-code tier is gated on R-22.

**Role target:** 10–15% improvement, **gated on R-22 (GitHub Copilot enablement on team GCC env)**.

### 3.4 Senior Tester — Nataliia Revutska + Remya Raj

| Metric | What it measures | Data source | Why this metric |
|--------|------------------|-------------|-----------------|
| **Test coverage %** | % of stories with at least one linked test case | Zephyr Scale ↔ JIRA links | Easy collection, direct completeness signal. Apr 30 team feedback: kept at story-level (not AC-level) — matches existing Zephyr report. AC-level coverage is a future enhancement in Discussion. |
| **Test cases per story** | Average count of test cases per JIRA story | Zephyr Scale + JIRA | Breadth signal — Rovo demo (Apr 24) generated 5 cases from 1 story, direct AI win. |

**Role target:** 5–10% on the authoring slice (acknowledging 80% of tester time is manual UI execution where AI cannot drive).

### 3.5 Testing Services Lead — Kamila Aibedullova

| Metric | What it measures | Data source | Why this metric |
|--------|------------------|-------------|-----------------|
| **Test automation coverage %** | % of test cases automated (Eggplant / Zephyr automated) for the pilot team | Zephyr Scale automation flags | Single-team leverage signal — shows whether AI assistance helps grow the automation footprint |
| **Testing Services Playbook contributions** | Count of TSL-authored updates to the cross-team testing playbook per sprint | Confluence page history | The TSL's pilot deliverable that gets the program ready to scale — playbook is the reusable scaling artifact |

**Pilot scope note:** The pilot runs on **1 team**, so genuinely cross-team metrics (cross-team coverage consistency, cross-team defect trends, cross-team test-report rollup time, cross-team pattern detection count) are **deferred** to the multi-team scaling phase — they are not measurable in a 1-team pilot. The TSL participates in the pilot as the test-strategy and playbook owner; her metrics are scoped to single-team output and reusable artifact production.

**Role target:** 10–15%.

---

## 4. Cross-cutting metrics (all roles)

These cover the AI policy / governance side regardless of role and are required for DoIT MEASURE / MONITOR oversight.

| Metric | What it measures | Data source | Cadence |
|--------|------------------|-------------|---------|
| **AI tool usage volume + acceptance rate** | Prompts sent, hours of tool use, % suggestions accepted / edited / rejected | Tool analytics (GitHub Copilot, Atlassian Rovo, M365 Copilot admin dashboards) | Weekly |
| **Prompt-drift incidents** | Any case where PII, case data, or out-of-scope content surfaced in a prompt | Incident reports + spot-check log | Ongoing — required by DoIT AI Policy §6 (HITL) and §7 (monitoring) |
| **SPACE survey (5 dimensions)** | Team health — Satisfaction, Performance, Activity, Communication, Efficiency | Survey (pre-pilot, mid-pilot, post-pilot) | 3 times per pilot |

---

## 5. Alignment with the State of Illinois DoIT AI Policy

The DoIT AI Policy ("Policy on the Acceptable and Responsible Use of Artificial Intelligence", effective April 1, 2025) defines the controls that AI use within State agencies must evidence. This metric set is designed to produce that evidence. Each policy section relevant to MEASURE / MONITOR is mapped below to specific metrics in the proposal.

| DoIT AI Policy section | What the policy requires | Metrics that produce the evidence |
|---|---|---|
| **§4d — Human in the Loop** | "AI Systems shall not make decisions autonomously" — every decision must have a human reviewer | Story quality score, AC completeness, SDD completeness rubric, First-pass QA yield, Negative-case coverage % — every one is downstream of human review of AI output. AI suggestion acceptance rate (cross-cutting) directly evidences how often humans accept vs. edit vs. reject AI suggestions. |
| **§5d — Human Oversight Roles** | "Define and assign clear oversight roles and responsibilities" | Per-role metric ownership in §3 names the role lead. Pilot Governance Lead is named for spot-check log + change-request register. |
| **§5e — Data Management** | "No State data for AI purposes without express written Agency Head consent + 30-day DoIT advance notice" | Prompt-drift incident metric (cross-cutting) flags any case where State data appears in a prompt outside the authorized scope. Spot-check log is the operational instrument. |
| **§5f — Accountability Assessment** | "Before using AI, assess the system's adherence to this policy" — written assessment, Agency Head signoff, 30-day DoIT notice | Tool authorization list (companion doc) is the input; this metrics proposal is the output for the post-deployment monitoring plan referenced in the assessment. |
| **§6 — Workflow Documentation / HITL Intervals** | "Documented protocols for human oversight; outline scope of AI deployment; consider human-in-the-loop intervals" | Refinement cycle time, Code review cycle time, Pre-ARB cycle time, Test-case authoring time — all measure the human review/oversight steps in the workflow, not just the AI output. |
| **§7 — Continuous Monitoring** | "Continuous monitoring of AI Systems" — extensive documentation of design, deployment, modifications | Cross-cutting: AI tool usage volume (weekly), AI suggestion acceptance rate (weekly), prompt-drift incidents (ongoing). SPACE survey across 3 rounds covers team-level health monitoring. |
| **§11 — Fairness & Bias Mitigation** | "Conduct and document regular reviews to ensure AI Systems are free from biases" | Spot-check log (Pilot Governance Lead reviews ~3–5 AI-assisted artifacts per week) — the operational mechanism. Story quality and AC completeness rubrics include bias review criteria (stereotyped sample names, biased test data). |
| **§12 — Security Reporting** | "Reporting process for AI security concerns" | Prompt-drift incidents (cross-cutting) feed the security reporting channel; route through the AI policy bridge per the governance charter. |

This proposal also maps to NIST AI RMF MEASURE 2.5 (Validity), 2.7 (Tracking), and 3.3 (Continuous improvement) as a defense-in-depth complement — but the **primary alignment is to the DoIT AI Policy sections above**, since that is what State agencies are directly accountable to.

### Coverage of MEASURE / MONITOR specifically

| Policy expectation | Evidence in this proposal |
|---|---|
| AI is being monitored continuously (§7) | Weekly AI tool usage + acceptance rate metrics; ongoing prompt-drift incident logging |
| Human oversight is preserved (§4d, §6) | Quality metrics (story quality, AC completeness, SDD completeness, first-pass QA yield) measure the human review step, not just AI output volume |
| Bias is being checked (§11) | Spot-check log + bias-review criteria embedded in story quality and AC rubrics |
| Roles and responsibilities are clear (§5d) | Each metric in §3 has a named owner (role lead or AI Transformation Lead); Pilot Governance Lead named for spot-check log |
| Data exposure is bounded (§5e, §4f) | Prompt-drift incident metric tracks any out-of-scope content surfaced in a prompt; spot-check log verifies |
| Changes are documented (§7) | Mid-pilot checkpoint report and end-of-pilot report — both produced via the same metric set with deltas vs. baseline |

---

## 6. Role-specific portfolio targets (executive headline preserved)

| Role | Internal target | Executive headline |
|------|-----------------|--------------------|
| BA | 15–20% | 10–15% portfolio (uniform) |
| Solution Architect | 10–15% | 10–15% portfolio |
| Dynamics Developer | 10–15% (gated on Copilot enablement) | 10–15% portfolio |
| Senior Tester | 5–10% | 10–15% portfolio |
| Testing Services Lead | 10–15% | 10–15% portfolio |

Internal targets reflect the workflow analysis from the Apr 23 / Apr 24 walkthroughs (e.g., the 80% manual UI ceiling on the tester role). Executive comms retain the uniform headline.

---

## 7. Key dependencies and gates

| Dependency | Gate | Owner |
|------------|------|-------|
| GitHub Copilot enablement on team GCC env (R-22) | Developer target depends on it | Romi / Vinay → Dave / Jim |
| JIRA + Zephyr API access for automated extraction | All JIRA-derived metrics | AI Transformation Lead + JIRA admin (Matt) |
| Atlassian Rovo tier confirmation + analytics surface | AI usage volume + acceptance rate metrics | Jeff Lobo |
| MS specialist engagement on Power Platform / Dataverse / D365 maker Copilot enablement | Determines which dev workflow Copilot features are usable | Romi |
| Survey tool selection | SPACE survey collection | AI Transformation Lead + DCFS |

---

## 8. Open questions for DoIT

1. Are individual-level metrics (per-pilot-member) acceptable for governance visibility, or should we report only at role / team level?
2. Does DoIT want an interim mid-pilot checkpoint report in addition to the end-of-pilot report?
3. Is there a preferred reporting format / template DoIT already uses we should align with?

> *Q "Is the metric set aligned with how DoIT expects MEASURE / MONITOR to be evidenced under the State AI Policy?" was previously open and is now answered in §5 above using the DoIT AI Policy of April 1, 2025.*

---

## 9. Version history

| Version | Date | Changes |
|---------|------|---------|
| v1.0 draft (V20260430) | 2026-04-30 | Initial DoIT-bound proposal — curated subset of the candidate list, organized by role with rationale, role-specific targets, NIST / DoIT policy mapping, dependency table, and open questions for DoIT. |

---

*This is a working draft. Update after Romi review and after design-phase per-role metric refinement (in flight following the Apr 30 metrics email to role leads).*
