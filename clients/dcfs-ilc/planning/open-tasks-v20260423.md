# Open Tasks Tracker — DCFS ILC AI Rollout

> **Version:** V20260423
> **Purpose:** Single list of open tasks consolidated from recent meetings + working sessions. For Alec to import into Smart Sheets (project plan source of truth).
> **Format:** ready for copy-paste into Smart Sheets / Excel.
> **Refresh:** whenever a new task is opened or one is closed. Owner marks status in Smart Sheets once imported.
> **Supersedes:** V04222026

---

## Legend

- **Status:** ⏳ Open · 🔄 In Progress · ✅ Done · ⚠ Blocked
- **Priority:** 🔴 Blocker · 🟡 High · 🟢 Normal

---

## Phase 0 — Governance & Access

| # | Task | Owner | Due | Priority | Status | Notes |
|---|------|-------|-----|----------|--------|-------|
| G1 | Dave meeting — walk through agenda, clear 3 blockers | Romi + Vinay | Wed Apr 22 | 🔴 | ✅ | Done Apr 22 — follow-up email sent to Dave |
| G2 | Romi pre-brief Dave at 3:30 PM CT | Romi | Apr 21 | 🔴 | ✅ | Done |
| G3 | DoIT 30-day notice — starting draft (light + detailed) to David | Vinay → David | Thu Apr 23 | 🔴 | ✅ | Done Apr 23 — light version attached to email; detailed kept as backup |
| G4 | Section 5e determination — Copilot on source = State data? | Dave | After Apr 22 mtg | 🔴 | ⏳ | Addressed in 30-day notice §4; awaiting Dave's confirmation |
| G5 | Tool availability — GitHub Copilot tier, Rovo tier, M365 Copilot, D365 Copilot | Dave | After Apr 22 mtg | 🔴 | ⏳ | 4 checkboxes — waiting on Dave |
| G6 | Pilot Governance Charter — finalize for team review | Vinay | Apr 23 | 🟡 | ✅ | Done Apr 23 — V20260423 sent to Krasan team for review |
| G7 | Pilot Governance Charter — Krasan team review | Romi + Jeff + John + Robert + Alec + Dinkar | Apr 24 | 🟡 | 🔄 | Review email sent Apr 23 |
| G8 | Pilot Governance Charter — send to Dave | Vinay | Apr 25 | 🟡 | ⏳ | After team review incorporated |
| G9 | Pilot Governance Lead — DCFS designee identified | Dave + Jim | Apr 25 | 🔴 | ⏳ | May propose David himself |
| G10 | Security & Privacy Lead (pilot) — DCFS designee | Dave | Apr 30 | 🟡 | ⏳ | Part of MVG 3-seat team |
| G11 | DCFS AI Governance Team Phase B — MVG seated | DCFS | Jul 1 | 🟡 | ⏳ | Hard dependency for scale |
| G12 | Krasan email password reset | Robert / Ryan | Apr 21 | 🟡 | ✅ | Done Apr 21 |
| G13 | Vinay DCFS fingerprinting | Vinay | Apr 22 | 🟡 | ✅ | Done Apr 22 — submitted |
| G14 | Copilot tool limitations — confirm scope with Dave (no web search / sandboxed to tenant) | Vinay → Dave | Apr 25 | 🔴 | 🔄 | Surfaced Apr 22 |
| G15 | "Copilot boundaries" one-pager + Foundation training module | Vinay | May 1 | 🟡 | ⏳ | Ships with Foundation session |
| G16 | Audit playbooks for web-retrieval assumptions | Vinay | May 3 | 🟡 | ⏳ | Remove any step that relies on live web |

---

## Phase 0b — Governance artifacts produced (Apr 22–23)

These are the supporting documents created for pilot governance. All are draft-complete and ready for team review / DCFS review.

| # | Artifact | Owner | Status | File |
|---|----------|-------|--------|------|
| A1 | Pilot Governance Charter | Vinay | ✅ | `deliverables/pilot-governance-charter-v20260423.docx` |
| A2 | Governance Proposal (structure + Phase B forward-looking §11) | Vinay | ✅ | `deliverables/governance-proposal-v20260414.docx` |
| A3 | DoIT AI Policy Compliance Map | Vinay | ✅ | `deliverables/compliance-map-v20260422.md` |
| A4 | DoIT 30-day notice — light version (1-page memo) | Vinay | ✅ | `deliverables/doit-30day-notice-light-v20260423.docx` |
| A5 | DoIT 30-day notice — detailed version (4-page assessment) | Vinay | ✅ | `deliverables/doit-30day-notice-detailed-v20260423.docx` |
| A6 | Pair-Programmer Strategy document | Vinay | ✅ | `deliverables/pair-programmer-strategy-v20260422.md` |
| A7 | Pilot Metrics by Role | Vinay | ✅ | `deliverables/pilot-metrics-by-role-v20260423.docx` |
| A8 | Pilot Metrics — Collection Methods | Vinay | ✅ | `deliverables/pilot-metrics-collection-methods-v20260423.docx` |
| A9 | Role playbooks (BA, Tester, Dev, Data, Testing Services Lead) with PII warning blocks | Vinay | ✅ | `deliverables/playbooks/` |
| A10 | Training plan updated with explicit PII/§5.5 compliance tie | Vinay | ✅ | `guide/07-training-delivery.md` |
| A11 | Framework deck V20260422 (Dave version) | Vinay | ✅ | `presentation/DCFS-AI-Framework-Krasan.pptx` |
| A12 | Jim deck backed up | Vinay | ✅ | `presentation/*.backup-jim*` |

---

## Phase 1 — Baseline & Design (Apr 21 → May 13)

| # | Task | Owner | Due | Priority | Status | Notes |
|---|------|-------|-----|----------|--------|-------|
| B1 | Baseline metrics session — finalize candidate set | Vinay + Matt + Jeff + Alec | Apr 21 12:30 CT | 🟡 | ✅ | Done — testing-is-bottleneck finding. Candidate set captured in `pilot-metrics-by-role-v20260423.docx` |
| B2 | JIRA data pull — Intact + 3 control teams, last 3 sprints | Matt | Apr 24 | 🟡 | ⏳ | Needs JIRA API/export access |
| B3 | QUS story quality scan script | Vinay | Apr 28 | 🟢 | ⏳ | Script authored; feed data |
| B4 | Workflow-state normalization (if needed) | Matt | May 4 | 🟢 | ⏳ | Before PI Planning |
| B5 | Baseline survey — questions draft | Vinay | Apr 24 | 🟡 | 🔄 | Qual + quant; in progress |
| B6 | Baseline survey — review (John, Jeff, Romi) | John + Jeff + Romi | Apr 25 | 🟡 | ⏳ | After draft |
| B7 | Baseline survey — tool setup (Survey Monkey via Tracy) | Robert | Apr 24 | 🟡 | ⏳ | Tracy Dempsey coordinating |
| B8 | Baseline survey — distribute to pilot team | Vinay | Apr 28 | 🟡 | ⏳ | |
| B9 | Data team discovery call with Chase + data team | Chase + Vinay | Apr 25 | 🟡 | ⏳ | Overdue — still not scheduled |
| B10 | Intact pilot team kickoff meeting | Romi + Rina | Apr 28 | 🟡 | ⏳ | Set expectations with 5 roles (Kelly, Sushil, Anusha, Chaitanya, Remeer, Natalie, Camilla) |
| B11 | Baseline metrics report | Vinay | Apr 30 | 🟡 | ⏳ | Feeds May 5 PI Planning |
| B12 | Role workflow mapping — BA, SA, Developer, Tester, Testing Services Lead | Vinay | May 8 | 🟢 | 🔄 | Initial mapping in playbooks; refinement needed |
| B13 | Role playbooks v0 → v0.5 refinement | Vinay | May 13 | 🟢 | 🔄 | v0 drafts done; PII warnings added Apr 23 |
| B14 | Finalize metric set (team selects 8-12 from candidates) | Vinay + Pilot Gov team | Apr 30 | 🟡 | ⏳ | Team reviews `pilot-metrics-by-role-v20260423.docx` to select |

---

## Phase 2 — Train (May 5 → May 20)

| # | Task | Owner | Due | Priority | Status | Notes |
|---|------|-------|-----|----------|--------|-------|
| T1 | Training materials per role — prompt libraries, cheat sheets | Vinay | May 3 | 🟡 | ⏳ | 5 roles |
| T2 | Foundation training deck (1.5h) — DoIT, guardrails, HITL | Vinay + Robert | Before May 5 | 🟡 | ⏳ | Everyone attends |
| T3 | BA track delivery (3h) | Vinay | Week of May 12 | 🟢 | ⏳ | |
| T4 | Tester track delivery (3h) | Vinay | Week of May 12 | 🟢 | ⏳ | |
| T5 | Developer track delivery (3h) | Vinay | Week of May 12 | 🟢 | ⏳ | |
| T6 | SA track delivery (2h) | Vinay | Week of May 12 | 🟢 | ⏳ | M365 Copilot–heavy |
| T7 | Testing Services Lead track delivery (2h) | Vinay | Week of May 12 | 🟢 | ⏳ | 5th role added Apr 22 |
| T8 | Leadership briefing (1h) — dashboard, success criteria | Vinay + Romi | Week of May 12 | 🟢 | ⏳ | Jim/Dave |

---

## Phase 3 — Pair Programming (May 5 → Jun 15)

| # | Task | Owner | Due | Priority | Status | Notes |
|---|------|-------|-----|----------|--------|-------|
| P1 | Identify pair-programmer roles + order (stair-step) | Vinay + Romi | Apr 25 | 🟡 | ⏳ | Strategy documented; execution ordering open |
| P2 | Source pair programmers (Krasan bench) | Dinkar | May 1 | 🔴 | ⏳ | ~5 external hires |
| P3 | Confirm DCFS clearance requirements for pair programmers | Dave | After Apr 22 mtg | 🟡 | ⏳ | In 🟡 This-month asks to Dave |
| P4 | Pair programmer onboarding — role 1 | Dinkar + Vinay | May 5 | 🟡 | ⏳ | |
| P5 | Pair programmer onboarding — roles 2-5 | Dinkar + Vinay | Rolling May 5-20 | 🟡 | ⏳ | |

---

## Phase 4 — Pilot & Measure (May 14 → Jul 20)

| # | Task | Owner | Due | Priority | Status | Notes |
|---|------|-------|-----|----------|--------|-------|
| E1 | PI 6 Planning — present AI pilot | Romi + Vinay | May 5-7 | 🟡 | ⏳ | |
| E2 | Configure metrics dashboard — engagement, teams, baseline | Vinay | May 5 | 🟡 | ⏳ | |
| E3 | Share read-only dashboard with Dave | Vinay + Romi | May 5 | 🟢 | ⏳ | Subject to Dave's preference (ongoing ask) |
| E4 | Sprint PI 6.2.1 start — training active | Pilot team | May 14 | 🟡 | ⏳ | |
| E5 | Weekly Pilot Governance meeting | Pilot Gov Lead | Every Tue | 🟡 | ⏳ | Per charter §4 |
| E6 | Weekly metrics collection | Vinay | Weekly | 🟡 | ⏳ | Per collection methods doc |
| E7 | Per-sprint AI output spot-check (3-5 artifacts) | Pilot Gov Lead | Weekly | 🟡 | ⏳ | Per charter §5.2 |
| E8 | Mid-pilot pulse survey | Vinay | ~Jun 10 | 🟢 | ⏳ | |
| E9 | Mid-pilot checkpoint — governance | Pilot Gov Lead | ~Jun 10 | 🟡 | ⏳ | Per charter §4 |

---

## Phase 5 — Playbook & Scale (Jul 20 → Aug)

| # | Task | Owner | Due | Priority | Status | Notes |
|---|------|-------|-----|----------|--------|-------|
| S1 | Post-pilot SPACE/DevEx resurvey | Vinay | Jul 23 | 🟡 | ⏳ | |
| S2 | Compile pilot results — AI vs baseline vs control | Vinay | Jul 30 | 🟡 | ⏳ | |
| S3 | Pilot Results Report (before/after) | Vinay | Aug 1 | 🟡 | ⏳ | |
| S4 | Playbooks v1.0 — BA, Tester, Developer, SA, Testing Services Lead | Vinay | Aug 8 | 🟡 | ⏳ | |
| S5 | Executive results dashboard + 1-page brief | Vinay + Romi | Aug 1 | 🟡 | ⏳ | For CIO |
| S6 | Phase B team reviews playbooks + approves scale | Phase B Gov Team | Aug | 🔴 | ⏳ | Requires Phase B seated |
| S7 | Go/no-go recommendation for ART rollout | Romi + Dinkar | End of Aug | 🟡 | ⏳ | |

---

## Ongoing / Cross-cutting

| # | Task | Owner | Cadence | Priority | Status | Notes |
|---|------|-------|---------|----------|--------|-------|
| O1 | Weekly status update to Dave | Vinay + Romi | Weekly | 🟡 | ⏳ | Format TBC — in 🟡 ongoing ask to Dave |
| O2 | Risk register update | Vinay | Weekly | 🟡 | 🔄 | `assumptions-and-risks.md` |
| O3 | Smart Sheets plan maintenance | Alec | Continuous | 🟡 | 🔄 | Source of truth |
| O4 | Teams "DCFS AI Rollout" channel — keep docs current | Vinay + Alec | Continuous | 🟢 | 🔄 | |
| O5 | Tuesday leadership touchpoint 8 AM CT | Romi | Weekly | 🟡 | 🔄 | Est. Apr 21 |
| O6 | Daily calendar log | Vinay | Daily | 🟢 | 🔄 | `planning/daily-calendar.md` |

---

## Follow-ups owed to us (from discovery meetings — still open)

| From | What was promised | Who | Still Open? |
|------|-------------------|-----|-------------|
| Apr 14 AM PO/BPR | Michael's AI tool ideas for PO/PM workflow | Michael Clemons | ⏳ |
| Apr 14 AM PO/BPR | John loops Andrew in on recording | John | ⏳ |
| Apr 14 PM Atlassian | Tool access request list | Matt + Carl | ⏳ |
| Apr 14 PM Atlassian | Rovo tier lookup | Matt + Carl | ⏳ |
| Apr 16 Architecture | AI use-case ideas (plugins/APIs/logic apps) | Shyam + Kashif | ⏳ |
| Apr 16 Architecture | Maximus-required doc list | Krishna + Jeff | ⏳ |

**Action:** Vinay to send a one-paragraph follow-up email to each group this week.

---

## Summary counts (updated Apr 23)

| Phase | Open | In Progress | Done | Blocker | Total |
|-------|------|-------------|------|---------|-------|
| 0 Governance | 6 | 2 | 6 | 4 | 16 |
| 0b Artifacts | 0 | 0 | 12 | 0 | 12 |
| 1 Baseline | 10 | 3 | 1 | 0 | 14 |
| 2 Train | 8 | 0 | 0 | 0 | 8 |
| 3 Pair Programming | 4 | 0 | 0 | 1 | 5 |
| 4 Pilot & Measure | 9 | 0 | 0 | 0 | 9 |
| 5 Playbook & Scale | 6 | 0 | 0 | 1 | 7 |
| Ongoing | 1 | 5 | 0 | 0 | 6 |
| Follow-ups | 6 | 0 | 0 | 0 | 6 |
| **Total** | **50** | **10** | **19** | **6** | **83** |

**Progress since V04222026:** +18 tasks closed (12 governance artifacts produced + 6 process items completed).

---

## Changes since V04222026

### Newly completed (✅)
- Dave meeting walkthrough + follow-up (G1)
- Pilot Governance Charter drafted + ready for team review (G6)
- DoIT 30-day notice drafted (light + detailed) (G3)
- Compliance Map drafted (A3)
- Pair-Programmer Strategy drafted (A6)
- Pilot Metrics by Role drafted (A7)
- Pilot Metrics Collection Methods drafted (A8)
- Governance Proposal §11 (Phase B forward-looking) added (A2)
- All 5 playbooks updated with PII warning blocks (A9)
- Training plan §7.x updated with PII/§5.5 compliance tie (A10)
- Framework deck V20260422 (Dave version) delivered (A11)
- Jim deck backed up (A12)
- Fingerprinting submitted (G13)

### Newly in progress (🔄)
- Charter team review (G7)
- Baseline survey drafting (B5)
- Role workflow mapping / playbook refinement (B12, B13)

### Newly added
- G7: Charter team review
- G8: Charter send-to-Dave
- G15–G16: Copilot boundaries one-pager + playbook web-retrieval audit
- A1–A12: Phase 0b artifacts section
- B14: Finalize metric set from candidate list
- T7: Testing Services Lead track (5th role added)

---

## Handoff note to Alec

Import each row above as a Smart Sheets task. Use columns:
- Task ID · Task name · Owner · Due date · Priority · Status · Phase · Notes

Dependencies to model in Smart Sheets:
- G3, G4, G5 → gate E1, E4
- G7 → G8 → Charter to Dave
- B1 → B2 → B11 → E2
- B14 → E6 (metric set locked before weekly collection)
- G11 → S6
- P2 → P4, P5
- T1 → T2-T8
- B11 → E1
