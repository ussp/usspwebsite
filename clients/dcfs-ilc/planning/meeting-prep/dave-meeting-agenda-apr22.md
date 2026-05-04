# Dave Meeting — Agenda (Wed Apr 22, 2026)

> **Audience:** **David Nika** — Deputy CIO, Data Management · Illinois DoIT (interim AI lead during Jim Daugherty's absence) · David.Nika@illinois.gov
> **From:** Romi Kovacs (lead) + Vinay Lagisetty (subject expert)
> **Pre-brief:** Romi to walk Dave through this Apr 21 at 3:30 PM CT
> **Duration target:** 60 min
> **Pre-read:** Rollout plan v6 + scope running book + this agenda

---

## Purpose

Confirm pilot scope, resolve three remaining blockers, align on governance posture, and validate the metrics direction. This is the last gate before baseline work begins.

---

## Agenda (60 min)

### 1. Context + progress since Jim meeting (5 min)
- Three discovery sessions complete (PO/BPR, Platform Ops, Enterprise Architecture).
- Pilot team selected: **Intact** (5-6 people).
- Plan compressed — pilot still ends **~July 20**.
- New PM (Alec Granderson, Krasan) owns schedule; Smart Sheets source of truth.

### 2. Approach — confirm (5 min)
Same 8-phase framework Jim already signed off on (Apr 13):

**Govern → Baseline → Design → Train → Pilot → Measure → Playbook → Scale**

- **Govern** (done / in flight): DoIT policy + NIST AI RMF mapped, governance doc drafting.
- **Baseline** (now – Apr 30): JIRA data extraction + SPACE survey + discovery.
- **Design** (May 1 – 13): AI-augmented workflow per role; playbook skeletons.
- **Train** (May 5 – 20): Foundation + 4 role tracks; pair-programmer onboarding.
- **Pilot** (May 14 – Jul 20): Intact team runs 2 PI's worth of sprints with AI tools + pair programmers.
- **Measure** (ongoing + post-pilot): weekly collection; final comparison end of pilot.
- **Playbook** (Jul – Aug): finalize per-role playbooks from pilot learnings.
- **Scale** (Aug onward — DCFS-owned): rollout to remaining 11 teams.

**Ask Dave:** any changes to approach since Jim signed off?

### 3. Pilot scope — confirm (5 min) — **decision needed**
- 1 pilot team = Intact (Rina = RTE).
- 5 roles: Tester, SA, BA, Dev (platform/configurator), BA-Tech.
- **Scrum Lead dropped** (not enough efficiency gain to justify).
- **13-week duration; pilot-end milestone = ~July 20**; post-pilot measurement + playbook extends past that.
- **Pair programming model:** each pilot-role participant paired with an external AI-experienced counterpart for 2 sprints (Dinkar procuring).
- Target: **10–15% improvement in tangible SDLC output** (not story points).

**Ask Dave:** sign-off on scope.

### 3a. Timeline — confirm (3 min) — **decision needed**

| Milestone | Date |
|-----------|------|
| Baseline data collection complete | Apr 30 |
| Design + training materials ready | May 13 |
| PI 20 Planning | May 5 – 7 |
| Sprint 2.1 start (training) | May 14 |
| Pilot mid-point pulse | ~Jun 10 |
| **Pilot end (hard milestone)** | **~Jul 20** |
| Playbook + results report | Aug |
| Scale recommendation to DCFS | End of Aug |

**Ask Dave:** Does July 20 pilot-end date hold? Any DCFS calendar events (audits, Maximus reviews, releases) that push this?

### 3b. Pair programming model — validate (5 min)

**What:** For each of the 5 pilot roles, pair the DCFS pilot-team member with an external AI-experienced counterpart for the first ~2 sprints.

**Why:** Accelerates adoption. Removes "I don't know what I'm doing" friction. Creates a champion per role that can propagate to other teams post-pilot.

**Structure:**
- ~5-6 external resources (one per role) — Dinkar (Krasan) procuring from bench.
- Stair-step onboarding — start with 1-2 roles week 1, add rest as they join. We don't need all 6 on day one.
- External resources leave after 2 sprints; DCFS pilot members become the AI champions for their role across teams.

**Ask Dave:**
- Any DCFS concerns about external consultants embedded in Intact team sprints for 2 sprints?
- Clearance requirements — do the pair programmers need DCFS background checks, or are they non-touching (code-review/coaching only)?
- Preferred onboarding order — which role should land first?

### 4. Governance structure — two-phase model (7 min) — **direction confirmation**

**Phase A — Pilot Governance Team (now → Jul 20)** — lightweight, runs the pilot
- Pilot Governance Lead: **proposed DCFS designee (David Nika?)**
- Executive sponsor: Jim (DCFS CIO)
- Optional: Security/Compliance observer (DCFS designee)
- AI Transformation Lead (Vinay) + Engagement Director (Romi) — report/recommend, don't sit on team
- Cadence: **weekly 45 min**
- Authority: approve pilot scope, tools, guardrails. Can halt on safety.
- NOT in scope: ART-wide scale decisions.

**Phase B — DCFS AI Governance Team — stood up DURING the pilot, not after**
- DCFS identifies + seats members **by ~Jul 1** so they can review pilot results end-of-July.
- **All seats = DCFS people** (DoIT is external policy liaison, not a team member).
- **Recommended as a range, not a fixed team size** — lets DCFS start immediately:

  **Minimum Viable (3 seats) — start today:**
  - Executive Sponsor (CIO — Jim)
  - AI Governance Chair *(combines Chair + Program oversight)*
  - Security & Privacy Lead *(combines Security + Data Privacy)*

  **Expanded (adds 3 seats as pilot matures / before scale):**
  - Program Director *(dedicated)*
  - Data Privacy Officer *(split from Security)*
  - Business Representative

- Krasan reports to — does not sit on — this team.
- Cadence: monthly 60 min.
- Authority: approve playbooks, approve scale, approve tool additions, policy changes.
- Why a range: different orgs have different bench depth. MVG satisfies NIST AI RMF GOVERN minimums + DoIT §4 agency-oversight. Split later only when volume warrants.

**Key dependency to flag:**
> If Phase B is not seated by ~Jul 1, scale decisions slip past the pilot end-date.

**Cross-cutting principles:**
- Human-in-the-loop on 100% of AI output (DoIT 4d/5d).
- No sensitive DCFS data in prompts (DoIT 4f) — enforced by training + per-sprint spot checks.
- Audit trail in JIRA transitions + GitHub PR history.
- **During pilot: documentation over formal approval gates** — disciplined, but fast.

**Asks Dave (direction, not hard decision):**
1. Is the two-phase structure acceptable?
2. Will DCFS own identifying + seating Phase B members during the pilot?
3. Who should Pilot Governance Lead be — David himself, or another DCFS designee?

*Full detail: [`deliverables/governance-proposal-v04142026.md`](../deliverables/governance-proposal-v04142026.md). Aligned with NIST AI RMF GOVERN 2 + DoIT AI Policy §4.*

### 5. DoIT 30-day notice (10 min) — **blocker**
- Policy: written report, agency-head signoff (Jim), provided to DoIT ≥ 30 days before use.
- **Our read:** notification, not approval. Use = tool access for 5-6 people for SDLC acceleration (no business-system change).

**Open questions for Dave:**
- Template/format? Is there a DCFS precedent doc we can base ours on?
- Is the 30 days a hard gate? Can we do baselining + training in parallel?
- Who on DCFS side drafts these? (We don't have institutional knowledge here.)

**Ask Dave:** owner + template + whether parallel work is OK.

### 6. Tool authorization (10 min) — **blocker**

| Tool | Purpose | What we need Dave to confirm |
|------|---------|-------------------------------|
| GitHub Copilot | Developer — plugins, APIs, logic apps, function apps | Already confirmed. Tier (Business/Enterprise)? License count? |
| Atlassian Rovo | BA + Tester — story/test generation | Already enabled. **Which tier?** Generative features or only orchestration? |
| **Microsoft 365 Copilot** | SA + BA-Tech — heavy SDD/Visio/Word/SharePoint workflow | Licensed? Budgeted? Available to pilot? |
| **Dynamics 365 Copilot** | Platform Dev — configuration-first workflow | Enabled in Dynamics GCC? |

**Explicit confirmations:**
- Claude is **NOT** approved — correct?
- Approved models = OpenAI + Google (via Copilot) — correct?

**Ask Dave:** four checkbox answers + action list for anything we need to request.

### 7. Metrics to track — validate (7 min) — **decision needed**
We will finalize the metric set AFTER baseline (Apr 30), but bringing the **candidate set** today for directional OK.

**Measurement philosophy:**
- **Tangible outputs**, not story points (story points shrink as AI accelerates sizing).
- **Before/after comparison** — pilot team vs. baseline vs. control teams.
- **Multi-dimensional** — no single metric can fake improvement.
- **8–12 metrics max** — avoid measurement burden.

**Candidate metric families (research-backed):**

| Family | Candidate metrics | Research / standard |
|--------|-------------------|---------------------|
| **Delivery** | Sprint velocity · cycle time (In Progress → Done) · throughput · sprint predictability · lead time | DORA / Accelerate (Forsgren 2018) |
| **Quality** | Story quality score (13 criteria) · story rejection rate · first-pass yield · test coverage · defect density | QUS (Lucassen 2016) · Six Sigma · ISO/IEC 25010 |
| **Efficiency** | Story review cycle time · test creation time · documentation coverage (% PRs with docs) | DORA · SPACE (Microsoft Research 2021) |
| **Team health** | SPACE 5-dim survey · requirement clarity · AI tool satisfaction | Forsgren 2021 (ACM) |

**What the 12:30 PM session with Matt + Jeff establishes:**
- Which of these we can compute today from JIRA.
- Which need workflow normalization first.
- Realistic date for baseline readiness (likely Apr 30).

**Ask Dave:**
- Is this direction acceptable?
- Anything Dave expects to see that's missing (e.g., specific DCFS reporting metrics)?
- Any Maximus-required metrics we need to feed into?
- Any CIO-level dashboard Dave wants live read-only access to?

### 8. Section 5e clarification (3 min)
- Does Copilot operating on ILC source code = "State data for AI purposes" requiring Agency Head written consent?
- **Our read:** no — ILC source code contains no protected state data.

**Ask Dave:** written determination (or email confirmation) so we can close this risk.

### 9. Gartner engagement (2 min)
- Jim referenced Gartner (23% benchmark) in his framing.
- **Our assumption:** not a pre-pilot gate.

**Ask Dave:** confirm — and if Gartner *is* engaged post-pilot, timing + what format.

### 10. Current risks — review (5 min)

Snapshot from the risk register. Want Dave aware and to flag anything we've missed.

**Top risks right now:**

| # | Risk | Severity | Mitigation in progress |
|---|------|----------|------------------------|
| 1 | **DoIT 30-day notice delays pilot start** | High | Template + parallel-work determination in this meeting |
| 2 | **M365 / D365 Copilot not licensed** — blocks SA + BA-Tech + Platform Dev tracks | High | Confirming with Dave today |
| 3 | **Section 5e ambiguity** — "State data for AI" treatment of source code | High | Written determination requested from Dave |
| 4 | **Pair-programmer hiring velocity** — 5-6 external hires needed, Dinkar procuring | Medium | Stair-step onboarding; start with 1-2 roles |
| 5 | **10-15% improvement target** — ambitious on config-first platform in 13 weeks | Medium | Measurement trends, not just absolute; adoption maturity acknowledged |
| 6 | **Team resistance / training time impacts velocity** | Medium | Only 5-6 people trained (not whole team); voluntary pair programming |
| 7 | **Novelty effect** — early gains don't sustain | Medium | Don't report Week 1 numbers; wait for Sprint 3+ |
| 8 | **Plan source-of-truth transition** (Vinay's Excel → Alec's Smart Sheets) | Low | Alec publishes this week; Vinay's Excel retired |

**Ask Dave:**
- Any risks we haven't captured? (audits, Maximus reviews, leadership changes, release freezes)
- Anything DCFS is currently dealing with that could bleed into our pilot window?
- Is there a release freeze or critical prod event between now and July 20?

### 11. Dave's questions / concerns (open, ~5 min)
Leave slack for Dave to push back or add items.

---

## Decisions we need by end of meeting

| # | Decision | Owner after decision |
|---|----------|----------------------|
| 1 | Pilot scope green-lit | Vinay starts baselining |
| 2 | Governance posture acceptable | Vinay finalizes governance doc |
| 3 | 30-day notice owner + template identified | Romi files within the week |
| 4 | Tool availability confirmed (4 tools) | Romi requests anything missing |
| 5 | Metric direction acceptable | Vinay validates via baseline |
| 6 | Section 5e determination in writing | Close R-05 |

---

## What we bring

- Rollout plan v5 (PDF export).
- 1-page pilot scope summary.
- Tool matrix (Section 5 table).
- Pilot team roster.
- Candidate metric set (Section 6).

## What we do after

- Minutes + action list within 24 hours (Vinay).
- Any Dave-requested doc changes folded into v6.
- Smart Sheets plan updated by Alec.
- Baseline work starts immediately (JIRA + survey).

---

## Open items flagged for Dave (snapshot)

1. Rovo tier — lookup owner needed.
2. Pair-programmer hiring (Dinkar procuring, but Dave should be aware).
3. Data team discovery call with Chase Yeung — not yet scheduled.
4. Intact pilot team kickoff — to be scheduled by Romi + Rina.
5. Maximus-required doc list — awaiting Jeff.

*Krasan email password — resolved Apr 21.*
