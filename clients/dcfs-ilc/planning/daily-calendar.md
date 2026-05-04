# DCFS/ILC AI Rollout — Daily Calendar

> Running daily log of meetings, decisions, blockers, and planned activities.
> One block per day. Add today's block at the TOP so the latest is always visible.
> Keep entries terse — details live in `meeting-notes/` and `rollout-plan.md`.

## Format for each day
```
## YYYY-MM-DD (Day)
**Meetings:** <list>
**Decisions:** <one-liners>
**Blockers:** <list or "none">
**Action items closed:** <list>
**Action items opened:** <list>
**Next up:** <tomorrow's focus>
```

---

## Upcoming / scheduled

| Date | Event | Notes |
|------|-------|-------|
| 2026-04-21 Tue 3:30 PM CT | Romi + Dave pre-meeting | Needs agenda + deck from Vinay before 3:30 |
| 2026-04-22 Wed | **Dave formal meeting** — scope, 30-day notice, tools (M365 Copilot, D365 Copilot, Rovo tier), Gartner | Romi + Vinay |
| 2026-04-23–24 Thu–Fri | Romi OUT | Team continues without him |
| 2026-04-28 Tue 8 AM CT | Next recurring touchpoint | |
| TBD | Data team discovery call (Chase Yeung + data team) | **Overdue** |
| TBD | Pilot-team kickoff with Intact participants | Romi + Rina |
| 2026-05-05 Tue | PI 20 Planning Day 1 | Full day |
| 2026-05-07 Thu | PI 20 Planning Day 2 | Half day |
| 2026-05-14 Thu | Sprint 2.1 start | Training phase target |
| 2026-05-27 | Sprint 2.1 end / Sprint 2.2 start | |
| 2026-07-20 | **Pilot end (hard milestone)** | Post-pilot measurement + playbook extends past this |

---

## 2026-04-21 (Tuesday)

**Meetings:**
- 8 AM CT — Krasan leadership touchpoint (first recurring Tuesday). Alec Granderson introduced as senior PM; converting plan to Smart Sheets.
  → [summary](../meeting-notes/status/2026-04-21-krasan-leadership-touchpoint-summary.md)
- **12:30 PM CT** — Baseline metrics working session (Vinay + Matt + Jeff + Alec).
- **3:30 PM CT** — Romi + Dave pre-meeting (Romi only; sets expectations for tomorrow).

**Decisions today:**
- Alec owns project plan going forward (Smart Sheets is source of truth). Vinay's Excel decommissioned.
- Dave formal meeting = tomorrow Wed Apr 22.
- Drop Scrum Lead from pilot — 5 roles now: Tester, SA, BA, Dev, BA-Tech.
- Pilot end date = ~July 20 (holds).
- Pair programming added to plan — ~6 external AI-experienced hires needed (Dinkar procuring).
- Pilot team kickoff meeting treated as milestone.
- Survey tool = Survey Monkey via Krasan (Tracy Dempsey).
- Romi out Thu–Fri this week.

**Access update:**
- Krasan email received Apr 20 ✅
- **Password reset RESOLVED** ✅ (Apr 21)
- DCFS fingerprinting application received Apr 20 5 PM; Vinay going today.

**Blockers still open:**
- Rovo tier unknown — raising with Dave tomorrow.
- M365 Copilot + D365 Copilot availability — raising with Dave tomorrow.
- Plan source-of-truth transition (Excel → Smart Sheets) — Alec owns; this week.
- Pair-programmer hiring velocity (Dinkar owns).
- Data team discovery call (Chase) — still not scheduled.

**Action items opened today (hot list):**
- ⏰ **Dave agenda + deck to Romi before 3:30 PM CT today** — Vinay
- 12:30 PM CT baselining session — Vinay + Matt + Jeff + Alec
- Baseline survey questions draft — Vinay, tomorrow
- Import/publish plan in Smart Sheets — Alec, this week
- Schedule pilot team kickoff with Intact participants — Romi + Rina
- Fingerprinting appointment — Vinay, today

**Next up (tomorrow Apr 22):**
- Dave meeting (Romi + Vinay + deck)
- Baseline survey questions out for review

---

## 2026-04-20 (Monday)

**Meetings:** (none logged)
**Decisions:**
- Meeting-notes folder reorganized: `status/` vs `team/`, with `raw/` subfolders and extracted summaries.
- Daily calendar established (this file).

**Blockers:**
- Krasan email + Teams access for Vinay still not provisioned (Romi/Robert owner).
- Dave meeting not yet scheduled.

**Action items opened:**
- Extract summaries for 4 April meetings (Apr 14 AM, Apr 14 PM, Apr 16, Apr 17) — **DONE**
- Update rollout-plan and assumptions-and-risks with Apr 14-17 findings.

**Next up:**
- Complete scope document (prereq for Dave meeting).
- Build sample baseline survey for review.
- Confirm Dave meeting date.

---

## 2026-04-17 (Friday)

**Meetings:**
- Krasan Leadership Touchpoint / AI Rollout Working Session (Romi, Jeff, Vinay K, Robert, John, Chase, Vinay) — 63 min
  → [summary](../meeting-notes/status/2026-04-17-krasan-leadership-touchpoint-summary.md)

**Decisions:**
- Pilot team = **Intact** (not Finance/Budget, not 2 teams). Rina is RTE.
- Pilot composition: 1 Architect (Kelly), 1 BA (Sushil), 2 Platform Devs (Anusha, Chaitanya), 2 Senior Testers (Remeer, Natalie) + Camilla (cross-team Testing Services Lead, observer).
- Valerie Hutton (PMO BA) — tentative addition; Romi coordinating with Becky.
- Governance simplified: no external approvals, just documentation.
- Metrics defined POST-baseline, not upfront.
- Meeting cadence: Tuesdays 8 AM Central, 1 hour.
- 30-day notice is a task/dependency, not a risk.
- Workspace = "DCFS AI Rollout" MS Teams channel shared tab.

**Blockers:**
- Krasan email/Teams access still not squared away.
- 30-day notice format/content unclear — Dave meeting needed.

**Action items closed:**
- Pilot team selection (was pending since Apr 13 Jim meeting).

**Action items opened:**
- Set up Dave meeting (scope + notice + tools + Gartner) — Romi
- Create pilot scope document — Vinay
- Convert plan/risks to Excel/tracker — Vinay
- Check Tracy on survey tool + external tool policy — Romi
- Work with Marketing (Melinda, Tony) on survey — Romi/Robert
- Build sample baseline survey — Vinay
- Provision Vinay's Krasan access — Romi/Robert
- JIRA baseline analysis (John + Matt)
- Gartner engagement clarification (Dave meeting)

**Next up:**
- Weekend/Monday: scope doc + survey sample.
- Tuesday Apr 22 (earliest): Dave meeting + leadership touchpoint.

---

## 2026-04-16 (Wednesday)

**Meetings:**
- DCFS Architecture high-level walkthrough (Shyam, Kashif, Krishna, Vinay) — 41 min
  → [summary](../meeting-notes/team/2026-04-16-architecture-walkthrough-summary.md)

**Decisions:**
- Scope of AI rollout confirmed: SDLC acceleration only, no change to business logic.
- Architects will come back with AI use-case ideas (plugins, APIs, logic apps, function apps).

**Blockers:** none from this meeting.

**Action items opened:**
- Get Maximus-required docs list (Krishna/Jeff).
- Arch use-case shortlist (Shyam + Kashif).
- Resolve Vinay's Krasan access (still open).

**Key learnings:**
- Claude is NOT approved — validated. Approved: GitHub Copilot, Microsoft Copilot, D365 Copilot.
- Plugins/APIs/logic apps/function apps are the real code (validates Developer-track value).
- Maximus auditor workflow is a strong document-authoring AI use case.
- Visio-in-Confluence-as-image is a searchability gap.

---

## 2026-04-14 (Monday)

**Meetings:**
- AM — PO/BPR business flow walkthrough (Michael Clemons, John, Vinay) — 40 min
  → [summary](../meeting-notes/team/2026-04-14-am-po-business-flow-summary.md)
- PM — Atlassian tools sync (Matt, Carl, Vinay K, Vinay) — 42 min
  → [summary](../meeting-notes/team/2026-04-14-pm-atlassian-tools-summary.md)

**Decisions:**
- Story points NOT a valid efficiency metric (both meetings aligned).
- Measurement will use test coverage, documentation ratio, quality gates, smoke-test automation — "AI-enhanced Definition of Done."

**Blockers:**
- Rovo tier unknown.
- BigPicture at base tier (no program-level reporting).
- POs have no AI subscription.

**Action items opened:**
- Rovo tier identification (Matt/Carl).
- Tool-access ask list (Matt + Carl to send; Vinay to consolidate).
- PO-team AI tool shortlist (Vinay — Michael said POs can't self-select).
- John to share recording with Andrew.

**Key learnings:**
- JIRA is source of truth ("if it's not in JIRA, it's not real").
- Toolchain: Visio + Excel + Word SDD + JIRA + Confluence + SharePoint.
- BA skill is the story-quality bottleneck (validates BA-first training strategy).
- PMO story-QA review is a bottleneck (Valerie) — strong pilot candidate.
- Michael's framing: AI for cross-team pattern discovery ("best of breed" for similar work across verticals).
- 15 separate JIRA team boards, no program-level epic board yet.

---

## (Pre-Apr 14 meetings are in `meeting-notes/` root — kickoff, Dinkar, Krishna/Chase, Jim Apr 13. Not rehydrated here.)
