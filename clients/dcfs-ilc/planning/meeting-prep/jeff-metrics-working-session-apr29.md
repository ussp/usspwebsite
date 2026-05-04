# Pilot Metrics Working Session — Agenda

**When:** Wed Apr 29, 2026 (TBD by Jeff — AI #3 from Apr 28 minutes, due 4/29)
**Duration:** 60 min
**Attendees:** Jeff Lobo, Matt Tomeo, Romi Kovacs, Vinay Lagisetty
**Goal:** Lock the final **8–10 quantitative pilot metrics** (1–2 per role) before Sprint 1 kickoff.

---

## Pre-read

`deliverables/metrics/pilot-metrics-by-role-v20260427.md` — full candidate set (~43 metrics, 5 roles, all with data sources / cadence / owner mapped).

Walkthroughs already done: Apr 16 SA · Apr 23 Developer (Dynamics decision tree) · Apr 24 Tester + TSL · BA pending.

---

## Framing (5 min)

- Per **Apr 24 governance D-3**: per-role metric selection is a **design-phase deliverable**, not baseline-phase.
- Today's job: pick 1–2 must-haves per role from the candidate set. Lock the 8–10.
- Selection criteria: (a) measurable with tools we actually have, (b) signal worth the collection burden, (c) maps to role-specific portfolio target, (d) avoids double-counting speed metrics.

---

## Role-by-role lock (40 min — ~7 min per role)

For each role: pick 1 productivity/speed metric + 1 quality metric.

| Role | Target | Suggested defaults to challenge |
|------|--------|----------------------------------|
| **BA** (15–20%) | speed + quality | Story quality score (QUS) · Refinement cycle time |
| **Developer** (10–15%, gated R-22) | speed + quality | Story-to-deploy cycle time · % stories needing rework due to incomplete AC |
| **Tester** (5–10%, authoring slice only) | authoring + coverage | Test-case-authoring-time · Negative-case-coverage % |
| **TSL** (10–15%) | rollup + consistency | Cross-team test-report rollup time · Cross-team coverage variance |
| **SA** (10–15%) | speed + quality | SDD creation time · SDD revision count |

**Cross-cutting (always-on, no need to lock):** AI tool usage volume · AI acceptance rate · SPACE survey (3x).

---

## Data-source prereqs (10 min)

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | JIRA Cloud API access for automated extraction | Vinay + JIRA admin | Confirm today |
| 2 | Zephyr Scale API access for test coverage | Vinay + JIRA admin | Confirm today |
| 3 | GitHub Copilot + Rovo analytics tier (some metrics need Enterprise) | DCFS via DoIT | Confirm with tool authorization |
| 4 | Survey tool selection (Survey Monkey via Krasan, or DCFS-provided?) | Vinay + DCFS | Decide today |
| 5 | DCFS comfort with per-individual metric visibility to Pilot Governance | DCFS / Dave | Flag — needs Dave sign-off |
| 6 | Any Maximus / DCFS-required metric not in candidate set | DCFS / Dave | Flag for Dave |

---

## Open items to assign owner + date (5 min)

- **R-22:** GitHub Copilot enablement on team GCC environment (gates dev target) — Romi+Vinay → Dave/Jim
- **§5f notice:** Zephyr Scale Agent for Rovo (R-NEW-6)
- **Peer-review checklist** for test cases — Kamila + Vinay
- **Sprint/PI test-reporting template** — Kamila + Jeff + Vinay
- **BA walkthrough** — Jeff to schedule (was due week of Apr 27)

---

## Decisions to leave with

1. The **8–10 locked metrics** (named, by role)
2. Confirmed **data sources + access path** for each
3. **Survey tool** named (Survey Monkey vs. alternative)
4. **Owner + date** for each open item above
5. Whether per-individual metric visibility is OK (or aggregated-only)

---

## Parking lot (not for this session)

- Final BA metric refinement → after Intact BA walkthrough
- Mid-pilot dashboard build → AI Transformation Lead, post-design-phase
- Maximus governance feedback loop → out of scope for pilot v1
