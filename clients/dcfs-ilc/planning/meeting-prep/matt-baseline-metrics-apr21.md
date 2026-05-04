# Matt + Jeff Working Session — Baseline Metrics (Apr 21, 12:30 PM CT)

> **Attendees:** Vinay (lead), Matt Tomeo (RTE), Jeff Lobo (Enterprise Architect), Alec Granderson (PM), John Luna (optional)
> **Duration:** 60 min
> **Purpose:** Identify what JIRA/Atlassian tracks today, what's clean enough to use as baseline, what's missing, what we can improve.
> **Why this matters:** Output feeds directly into tomorrow's Dave meeting metrics slide. Without this, we can't validate our metric direction with Dave.

---

## Session goal

Leave this meeting with:
1. A clear **list of metrics we CAN compute today** from existing JIRA data.
2. A list of **metrics we WANT but need workflow/config changes** for.
3. An **owner + ETA** for each gap.
4. Alignment that these become the baseline set proposed to Dave.

---

## Part 1 — What do we track today? (20 min)

For each candidate metric, ask: **Is this data in JIRA? Clean? Reliable across teams?**

### Delivery metrics (DORA)

| Metric | What JIRA needs | Matt/Jeff — status? |
|--------|------------------|----------------------|
| Sprint velocity (story points / sprint) | Estimates + completion status | |
| Cycle time (In Progress → Done, days) | Status transition timestamps | |
| Throughput (items completed / sprint) | Completion count + sprint boundary | |
| Sprint predictability (committed vs delivered) | Sprint-start snapshot + end delta | |
| Lead time (created → done) | Creation + done timestamps | |

### Quality metrics (QUS + Six Sigma + ISO 25010)

| Metric | What JIRA needs | Matt/Jeff — status? |
|--------|------------------|----------------------|
| Story quality score (QUS 13-criteria) | Programmatic scan of story content | Script needed |
| Story rejection rate (% returned to refinement) | Transition history to "Ready for Dev" back to earlier state | |
| First-pass yield (% stories passing QA first attempt) | Transition history from "In QA" outcomes | |
| Test coverage (% stories with linked test cases) | Story ↔ Zephyr link coverage | |
| Defect density (bugs / story point delivered) | Bug type issues linked to parent story | |

### Efficiency metrics (DORA + SPACE)

| Metric | What JIRA needs | Matt/Jeff — status? |
|--------|------------------|----------------------|
| Story review cycle time (draft → Ready for Dev) | Creation + state-change timestamps | |
| Test creation time (hours/story) | Manual tracking or Zephyr timestamps | |
| Documentation coverage (% PRs with docs) | GitHub + JIRA link analysis | |

### Team health (SPACE — not JIRA)

Not from JIRA — survey-based. Survey Monkey approved (Apr 21). Draft questions in flight for tomorrow.

---

## Part 2 — Current JIRA state (10 min)

Ask Matt directly:

1. **Workflow states** — what are the exact status names on each team's board today? (We know pre/post-refinement is simplifying — get current state.)
2. **Sprint data availability** — how many clean sprints of history do we have per team? (Need ≥3 for baseline.)
3. **Board consistency** — are the 15 team boards consistent enough to compare, or do each have custom states?
4. **Epic ↔ story ↔ bug linkage** — reliable? or sprawling?
5. **Zephyr usage** — are all 12 teams using it, or only some? Do stories consistently link to test cases?
6. **JIRA access for metric extraction** — API key or data export? Do we have what we need to pull baseline data?
7. **Rovo tier** — is this knowable today, or do we need Dave to help?
8. **BigPicture tier** — same question. Affects cross-team reporting.

---

## Part 3 — What's missing / what to improve (15 min)

For each gap identified in Part 1, who owns the fix and how long?

### Known-likely gaps (from Apr 14 Atlassian session with Carl)
- 15 separate team boards, no program-level epic board → blocks program-level metrics.
- BigPicture at base tier → dependency tracking lives in Matt's spreadsheets.
- Epics duplicated across teams instead of shared.
- Test cases in Zephyr but linkage to stories uneven.

### For the pilot (Intact team specifically)
- Is the Intact board representative of DCFS "standard"? (Or unusually clean/messy?)
- Can we tighten Intact's workflow to DCFS-standard states *before* baseline starts, so pilot + control comparison is apples-to-apples?

---

## Part 4 — Decisions / action items (10 min)

Leave with:

| # | Decision / Action | Owner | Due |
|---|-------------------|-------|-----|
| 1 | Baseline metric set proposed to Dave (8-12 metrics) | Vinay | Today EOD |
| 2 | JIRA data pull / export for Intact + 3 control teams (last 3 sprints) | Matt | Apr 24 |
| 3 | QUS scan script for story quality | Vinay (script) + Matt (data) | Apr 28 |
| 4 | Workflow state normalization if needed | Matt | Before May 5 PI |
| 5 | Rovo tier lookup | Matt + Carl | Apr 23 |
| 6 | BigPicture upgrade ask → add to Dave tool list | Vinay | Tomorrow's deck |

---

## What Vinay brings to the session

- **This doc** — walk Matt/Jeff through it.
- **Proposed metric families** (from Dave deck) — get their gut-feel on feasibility.
- **Scope of Intact pilot team** — they may flag JIRA-side risks specific to Intact.
- **Question list from the Apr 14 Atlassian session** — refresh what Carl already raised.

## What Vinay takes away

- Confirmed baseline metric set to put on tomorrow's Dave slide.
- Owner list for any metric that needs JIRA config/script work.
- Realistic baseline data date (so we can commit to Dave on timeline).
- Jeff's view on whether Intact's JIRA state is representative.

---

## Key question to answer before leaving

**"Can we propose these 8-12 metrics to Dave tomorrow with confidence that we can actually compute them in the baseline window (by Apr 30)?"**

If YES → propose them.
If NO → propose a smaller set + a plan for the rest.
