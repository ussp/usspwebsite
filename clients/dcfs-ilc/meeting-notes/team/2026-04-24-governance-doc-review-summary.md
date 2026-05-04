# Meeting Summary — Governance Doc Review (Apr 24)

- **Date:** 2026-04-24 (Friday)
- **Type:** team
- **Raw transcript:** [raw/2026-04-24-governance-doc-review.txt](raw/2026-04-24-governance-doc-review.txt)
- **Attendees:** Vinay Lagisetty (Krasan), Jeffrey Lobo (Illinois DoIT/DCFS), Krishna Mekala (Illinois DoIT/DCFS — shared services), Robert Rodriguez (Krasan), Dinkar Karumuri (Krasan), Alec Granderson (Krasan)
- **Duration:** ~33 min

## Purpose
Review Vinay's draft AI Augmentation pilot governance charter (`pilot-governance-charter-v20260423`) with Jeff and capture his line-edits/feedback before reformatting into the DCFS template. Matt was meant to attend but was stuck in a parallel ARB/facilities deep-dive meeting.

## Decisions made
| # | Decision | Details |
|---|----------|---------|
| D-1 | **Reformat charter into DCFS template** | Jeff sent the official DCFS doc template to Vinay (originally to wrong "Vinay Errabelli" Krasan account; now resent to vinay@lagisetty.com). Going forward DCFS templates are mandatory for all governance/charter deliverables — not Krasan templates. |
| D-2 | **Decouple metrics from NIST AI RMF in the charter** | Jeff + Dinkar agreed: don't tightly couple. The DoIT policy doesn't require metrics; NIST is referenced as audit-trail backing only. Charter will say "metrics will be tracked" without enumerating them in the governance doc. |
| D-3 | **Move metrics commitment from "baseline" to "design" phase** | Specific per-role metrics will be locked in during design, not baseline. Two metrics per role (8–10 total) is the working assumption; even one per role acceptable for some roles. |
| D-4 | **Keep 5 pilot roles; no Scrum Lead** | Reaffirmed — Tester, SA, BA, Dev, BA-Tech. PMO/BA inclusion still pending Romi/Dave conversation, but Vinay believes BA role will show measurable improvement based on yesterday's working session ("how Rao was generating story points"). |
| D-5 | **Risk register = Excel attachment, shared with Illinois.gov** | Vinay to attach an Excel risk-register template (not Word). Lives on shared account between DCFS and Krasan; PM updates weekly. |
| D-6 | **Phase numbering correction** | "PI 6" should be "26.2.1" — DCFS PI numbering convention. |
| D-7 | **Add code generation to in-scope activities** | Currently lists code explanation, refactoring, documentation, configuration. Add code generation explicitly (pro-code stuff). |
| D-8 | **Prompt logging deferred to post-pilot** | Pilot will research and "firm it up" rather than implement upfront. Required eventually for PII detection workflow but treated as out-of-scope for the pilot itself; called out in the charter as a pilot output. |
| D-9 | **Cadence stays weekly** | DoIT suggests weekly governance cadence; charter retains weekly + incident-response (email on critical issues) + midpoint check-in. |
| D-10 | **Governance lead = Dave; Responsible = Jim; Security/Privacy lead = TBD** | Pending Dave's input on who fills security/privacy lead role for the pilot. |

## Action items
| # | Item | Owner | Due | Status |
|---|------|-------|-----|--------|
| A-1 | Apply Jeff's edits (PI 6 → 26.2.1; add code generation activity) | Vinay | Today (Apr 24) | Open |
| A-2 | Decouple measure step from NIST in charter; move from baseline to design | Vinay | Today (Apr 24) | Open |
| A-3 | Reformat charter into DCFS template Jeff sent | Vinay | Mon Apr 27 morning | Open |
| A-4 | Attach Excel risk-register template to charter package | Vinay | Mon Apr 27 morning | Open |
| A-5 | Send v2 charter to Jeff for quick review | Vinay | End of Friday or Mon AM | Open |
| A-6 | Jeff reviews v2 and emails feedback | Jeffrey Lobo | Tonight or Mon AM | Open |
| A-7 | Follow up with Romi on whether 30-day notice memo (drafted by Darren Turner, addressed to Brandon Rago) was sent to Jim | Jeffrey Lobo | Mon Apr 27 | Open |
| A-8 | Reschedule formal governance-doc walkthrough that didn't happen today (Matt was unavailable) | TBD | Next touchpoint | Open |
| A-9 | Schedule Pierre/PI-week social with team (Dinkar in town May 4 Mon/Tue nights) | Romi + Robert | This week | Open |
| A-10 | Separate call to scope prompt-logging implementation (administration / who reviews / PII workflow) | Vinay + Jeff | TBD | Open |

## Findings that affect the plan
- **Charter is in good shape but needs reformatting + decoupling pass.** Jeff called the work "really quite good" and "comprehensive"; the substantive feedback was light — primarily about over-coupling to NIST, template format, and phase numbering.
- **DCFS template now required for governance deliverables.** Future Krasan deliverables (charter, risk register, etc.) must use DCFS templates not Krasan templates. This is a precedent — apply to all subsequent docs.
- **Metrics deferral is now formally in the charter** — moved to design phase. This buys time but increases dependency on the design-phase team conversations. The 8 metrics Jim referenced are not committed in the governance doc; per-role metric selection is a design-phase deliverable.
- **Prompt logging surfaced as a real governance gap.** Required for PII detection. Tools (Copilot/Azure/GitHub) support it but require admin configuration + a review workflow (who reviews, how PII is flagged, who administers). Out of scope for pilot but must be a named pilot output to feed post-pilot governance.
- **Gartner role still ambiguous.** Jim mentioned wanting Gartner to review; nobody on this call knows the actual scope. Open question to bring back to Jim/Romi.
- **Security/Privacy lead role unfilled.** Pending Dave's input.
- **Jim is out for PI week (May 4–6).** Dinkar coming to Pierre Mon May 4 (arrive) – Tue May 5 night; leaves Wed AM. Wants Romi/Robert to organize team social both nights. Jim's absence noted but not blocking.

## New risks / items for register
- **R-NEW-6:** Prompt-logging implementation has no owner inside DCFS yet (admin, reviewer, PII triage workflow). Mitigation: scope as pilot output; Jeff + Vinay separate call.
- **R-NEW-7:** Gartner expectations unknown — could surface late as a review/sign-off requirement that adds time. Mitigation: surface to Romi/Jim explicitly; meanwhile NIST AI RMF retained as audit-trail anchor (irrefutable, gold-standard).
- **R-NEW-8:** Wrong-Vinay email collision risk — Jeff's first send went to "Vinay Errabelli" on the Krasan account. All future official correspondence to use vinay@lagisetty.com (or whichever Krasan account is verified). Operational nuisance, not a project risk per se, but worth flagging.

## Dates captured
- **Mon Apr 27** — v2 charter to Jeff (target).
- **Tue Apr 28** — next Tuesday cadence touchpoint.
- **May 4 (Mon)** — Dinkar arrives Pierre; team social night 1.
- **May 5 (Tue)** — Pierre night 2; team social night 2.
- **May 6 (Wed AM)** — Dinkar departs Pierre. (Jim out PI week.)
