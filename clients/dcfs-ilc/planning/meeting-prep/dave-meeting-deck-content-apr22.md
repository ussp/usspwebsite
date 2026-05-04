# Dave Meeting Deck — Slide Content (Wed Apr 22)

> **Purpose:** Clean slide content for the Dave meeting. Drop into existing deck (`framework-presentation-main.html` or `DCFS-AI-Framework-Krasan.pptx`) as 4 new/updated slides.
> **Recommended order for Dave meeting:** Title → Context → **Scope** → **Governance** → **Metrics** → Tools → 30-day notice → **Open items** → Closing.
> **Design:** Match existing Krasan style (dark navy `#16213e`, highlight red `#e94560`, Alata/Montserrat/Segoe UI).

---

## Slide 1 — Pilot Scope (new / replaces old scope slide)

### Title
**Pilot Scope — Confirming the Box**

### Sub-head
1 team. 5 roles. 2 sprints to baseline. 13 weeks total.

### Body (two columns)

**Left — What's in scope**
- **Pilot team:** Intact (Rina = RTE)
- **5 roles:** Tester, Solution Architect, Business Analyst, Developer (platform/configurator), BA-Tech
- **Pair programming:** 1 external AI-experienced counterpart per role × 2 sprints (Dinkar procuring)
- **13-week duration:** baseline → train → pilot → measure
- **Pilot end:** ~July 20 (hard milestone)

**Right — What's NOT in scope**
- No changes to business logic, workflows, or domain rules
- No autonomous AI commits (human-in-the-loop on 100%)
- No DCFS case data / PII in AI prompts
- No new vendors/tools beyond approved Copilot + Rovo + M365/D365 Copilot
- Post-pilot measurement & playbook extends past July 20 — justified by results analysis

### Ask on the slide
> **Decision:** Dave, do we have your sign-off on this scope?

### Footer
Scrum Lead role was dropped vs. prior version — not enough measurable gain to justify the overhead.

---

## Slide 2 — Governance Structure (new)

### Title
**Governance — Two-Phase Structure**

### Sub-head
Pilot governance runs the 13-week pilot. Full DCFS AI Governance Team is stood up **during the pilot** so they can approve pilot results + playbooks for scale.

### Body — side-by-side two tables

#### Phase A — Pilot Governance Team (now → Jul 20)
**Lightweight. Enough to govern the pilot.**

| Role | Filled by |
|------|-----------|
| Pilot Governance Lead | **DCFS designee** (proposed: David Nika) |
| Executive sponsor | Jim Daugherty (DCFS CIO) |
| Security / Compliance observer | DCFS designee (optional for pilot) |
| AI Transformation Lead | Vinay (Krasan) — presents/recommends |
| Engagement Director | Romi (Krasan) — program status |

- **Cadence:** weekly, 45 min
- **Authority:** approve pilot scope, tools, guardrails, training. Can halt pilot on safety concerns.
- **Not in scope:** cannot approve ART-wide scale decisions.

#### Phase B — DCFS AI Governance Team (stood up DURING pilot)
**DCFS builds this team while the pilot runs. Start minimum-viable now; grow as needed. They approve pilot results + playbooks before scale.**

**Minimum Viable (3 seats) — start immediately**
| Role | Filled by |
|------|-----------|
| Executive Sponsor (CIO) | Jim Daugherty (DCFS) |
| AI Governance Chair *(combines Chair + Program oversight)* | DCFS designee |
| Security & Privacy Lead *(combines Security + Data Privacy)* | DCFS designee |

**Expanded (adds 3 more seats) — add as pilot matures / before scale**
| Role | Filled by |
|------|-----------|
| Program Director *(dedicated CCWIS/program alignment)* | DCFS designee |
| Data Privacy Officer *(split from Security when scaling)* | DCFS designee |
| Business Representative | DCFS PO / program lead |

**Vendor (always)** — Krasan AI Transformation Lead + Engagement Director *report to — do not sit on — this team.*

- **Cadence:** start monthly 60 min; as-needed for incidents.
- **Authority:** approve playbooks, scale rollout, new tools, policy changes.
- **DoIT relationship:** external liaison for state-wide AI policy — **not a team member.** DCFS governs; DoIT is the policy authority the team reports compliance to.

### Why a range
- Different orgs have different bench depth. MVG lets DCFS start **today**, not after 6 designees are identified.
- The 3 MVG seats cover the NIST AI RMF GOVERN minimums and DoIT AI Policy §4 agency-oversight requirement.
- Split security + privacy later only when volume/complexity warrants it.

### Footer callout — the handoff
**Key dependency:** DCFS identifies and seats Phase B members by **~Jul 1** so they can review pilot results end-of-July. If Phase B is not seated in time, **scale decisions slip**.

### Transition (bottom of slide, in italics)
> *Pilot ends Jul 20 → Pilot Governance Lead presents results + draft playbooks to CIO + Phase B team → Phase B approves (or requests revisions) → scale begins next PI.*

### Ask on the slide
> **Direction confirmation:**
> 1. Is this two-phase structure acceptable?
> 2. Will DCFS own identifying/seating Phase B members during the pilot?
> 3. Who should we propose as Pilot Governance Lead — David, or another DCFS designee?

### Footnote
Full detail: `deliverables/governance-proposal-v04142026.md`. Aligned with NIST AI RMF GOVERN 2 (governance proportional to risk) and DoIT AI Policy Section 4.

---

## Slide 3 — Metrics Direction (new)

### Title
**Metrics — Validation Before Baseline Starts**

### Sub-head
Tangible SDLC output, not story points. Final set locked after baseline (Apr 30); direction confirmed today.

### Body (grouped table)

| Family | Candidate metrics | Research basis |
|--------|-------------------|----------------|
| **Delivery** | Sprint velocity · cycle time · throughput · sprint predictability | DORA/Accelerate (Forsgren 2018) |
| **Quality** | Story quality score · story rejection rate · first-pass yield · test coverage · defect density | QUS (Lucassen 2016) · Six Sigma · ISO/IEC 25010 |
| **Efficiency** | Story review cycle time · test creation time · documentation coverage | DORA · SPACE (Microsoft Research 2021) |
| **Team health** | SPACE 5-dim survey · requirement clarity | Forsgren 2021 (ACM) |

### Measurement philosophy
- Before/after comparison against control teams (other ILC teams as control)
- 8-12 metrics max (avoid measurement burden)
- Every metric traces to a research-backed framework
- **Story points are NOT a metric** — they shrink as AI-assisted sizing improves, so they would understate gains

### Ask on the slide
> **Decision:** Is this metric direction acceptable?
> Anything Dave expects to see that's missing?
> Any DCFS/Maximus reporting metrics we need to feed into?

### Footer
Final metric set will be proposed by Apr 30 after baseline interviews and JIRA scan.

---

## Slide 4 — Open Items & Asks (new — replaces stale `open-items.html`)

### Title
**Open Items — What We Need From Dave**

### Sub-head
3 blockers to clear. 4 checkboxes to confirm. 1 written determination.

### Body (three columns)

**🔴 Blockers to clear**
1. **30-day DoIT notice** — template, owner, whether parallel work is OK
2. **Tool authorization** (see below — 4 items)
3. **Section 5e determination** — does Copilot on ILC source code = "State data for AI"?

**🟡 Four tool confirmations**
| Tool | Question |
|------|----------|
| GitHub Copilot | Tier + license count? |
| Atlassian Rovo | Which tier? Generative or orchestration only? |
| M365 Copilot | Licensed? Budgeted? Pilot access? |
| D365 Copilot | Enabled in our Dynamics GCC? |

Confirm: Claude NOT approved. Approved models = OpenAI + Google via Copilot.

**🟢 Flagged for awareness (not blockers)**
- Data team discovery call (Chase Yeung) — not yet scheduled
- Intact pilot-team kickoff — Romi + Rina to schedule
- Maximus-required doc list — pending Jeff
- Gartner engagement timing — confirm it's post-pilot, not a pre-pilot gate
- Pair-programmer hiring — Dinkar procuring (~6 external hires)

### Footer
Every open item here is tracked in Smart Sheets plan (Alec) + `assumptions-and-risks.md`.

---

## Optional Slide 5 — Timeline Reminder (if not already in the deck)

### Title
**Where We Are on the Clock**

### Visual (bar or simple timeline)
```
Apr 7 ────▼ Kickoff
Apr 13 ──▼ Jim meeting
Apr 14-16 ─▼ Discovery (PO, Platform Ops, Architecture)
Apr 17 ──▼ Pilot team selected = Intact
Apr 21 ──▼ Tuesday cadence begins · PM onboarded (Alec)
Apr 22 ──▼ TODAY — Dave meeting
Apr 28 ──▼ Baseline metrics locked
May 5-7 ─▼ PI 20 Planning
May 14 ──▼ Sprint 2.1 start · Training begins
Jul 20 ──▼ PILOT END (hard milestone)
Aug-Sep ─▼ Measurement · playbook · scale recommendation
```

### Ask on the slide
> July 20 pilot end date holds. Measurement + playbook extends past that by design.

---

## How to assemble

1. **Fastest path:** open `framework-presentation-main.html`, copy these 4 slide blocks into new `<div class="slide">` sections (use slide-number 9, 10, 11, 12 or renumber as needed).
2. **If using pptxgenjs:** add 4 new slide definitions to `build-pptx.js` mirroring existing slide style (DARK_BG, HIGHLIGHT, etc.).
3. **Fastest if no time to code:** paste into `DCFS-AI-Framework-Krasan.pptx` directly; use existing slide as template.
4. **Minimum viable for Dave meeting:** print *this markdown file* and present from it if deck update isn't ready.

## What to KEEP from existing deck
- Title + Krasan branding
- Context / Opportunity slides
- Framework overview (Govern → Baseline → Train → Pilot → Measure → Playbook → Scale)
- Research/methodology citations (DORA, SPACE, QUS)
- Pilot team composition slide (update numbers to 5 roles, add pair programming)

## What to REPLACE
- `open-items.html` — completely stale (references Apr 13 Jim meeting). Use Slide 4 content here.
- Any "2 pilot teams" or "Finance + Intact" reference — now 1 team, Intact only.
- Any "6 roles" reference — now 5 (Scrum Lead dropped).
- Any mention of Claude as approved — NOT approved.
