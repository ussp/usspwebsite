# Email — Post Dave Meeting (Apr 22)

> **To (Krasan + DCFS working group):**
> - Nika, David &lt;David.Nika@illinois.gov&gt; — Deputy CIO, DCFS
> - Kovacs, Emil R. &lt;Emil.Kovacs@Illinois.gov&gt;
> - Rodriguez, Robert &lt;Robert.L.Rodriguez@Illinois.gov&gt;
> - Manzoor, Arshad &lt;Arshad.Manzoor@illinois.gov&gt;
> - Rodriguez, Robert &lt;Robert.Rodriguez@krasanconsulting.com&gt;
> - Vinay@lagisetty.com
>
> **Attachment:** DCFS-AI-Framework-Krasan.pptx (latest version)

---

**Subject:** DCFS AI Pilot — Framework recap + open items for this week

Hi David, all,

Thank you for the time today. Attached is the latest version of the **AI-Augmented Agile Delivery framework** we walked through, incorporating the Apr 21 Jira/process walkthrough findings and the compressed pilot schedule.

**Quick recap of what we covered:**

- **Pilot:** Intact team, 5 roles (Solution Architect, Business Analyst, Platform Developer, Senior Tester, Testing Services Lead), running Sprints PI 6.2.1 & PI 6.2.2 with continuation through PI 6.2.5.
- **Target:** 10–15% productivity improvement, measured on tangible SDLC outputs (not story points). Pilot establishes the trajectory; full realization expected across 2 PIs as adoption matures.
- **Approach:** 8-phase framework — Govern → Baseline → Design → Train → Pilot → Measure → Playbook → Scale.
- **Governance:** Two-phase — lightweight Pilot Governance Team during the pilot; DCFS AI Governance Team (3-seat minimum viable, up to 6 seats as it matures) stood up *during* the pilot so it can approve playbooks before scale.
- **Pair-programmer model (for discussion):** 5 AI-experienced specialists embedded in the Intact team during pilot → same 5 specialists redeploy into 5 other ILC teams for Scale Wave 1. Same hiring investment, used twice.
- **Tools:** Confirmed existing State investment in GitHub Copilot + Atlassian Rovo; pending confirmation on Microsoft 365 Copilot and Dynamics 365 Copilot.

---

## Open items — what we need from DCFS

### 🔴 This week — pilot blockers

| # | Item | Owner |
|---|------|-------|
| 1 | **Section 5e written determination** — does Copilot operating on ILC source code count as "State data for AI purposes"? | David |
| 2 | **Tool availability confirmations** (6 questions): GitHub Copilot tier · Rovo tier · M365 Copilot licensed + available · D365 Copilot enabled in Dynamics GCC · Approved AI models (OpenAI / Google / Anthropic) · Section 5e position | David |
| 3 | **DoIT 30-day notice** — template, owner, whether baseline work can proceed in parallel during the 30-day window | David / DCFS policy lead |

### 🟡 This month

| # | Item | Owner |
|---|------|-------|
| 4 | **Pilot Governance Lead** — DCFS designee named | David + Jim |
| 5 | **Security & Privacy observer** for Pilot Governance Team (optional) | David |
| 6 | **Clearance process + timeline** for the 5 pair-programming AI specialists (external Krasan-sourced consultants) | David / Robert (L.) |
| 7 | Flag any **DCFS-side risks** we haven't captured — production release freeze, Maximus audit window, federal reporting deadlines, leadership transitions | David |

### ✅ Ongoing

| # | Item | Owner |
|---|------|-------|
| 8 | Weekly status cadence — format preferred (written summary / Tuesday touchpoint / dashboard?) | David |
| 9 | Dashboard read-only access — would you like live visibility to pilot metrics? | David |

---

## What we're doing in parallel (Krasan)

- **This week:** Pilot scope document finalized · baseline survey drafted and out for review · baseline metrics set validated with Matt + Jeff
- **Next week:** Baseline survey distributed · Intact pilot team kickoff · baseline data extraction from JIRA
- **By May 5:** Baseline metrics report complete · training materials drafted · ready for PI 6 Planning

---

## References

Full detail for anything above is in:
- **Framework deck** (attached): `DCFS-AI-Framework-Krasan.pptx`
- **Rollout plan:** `planning/rollout-plan.md` (v6.1)
- **Governance proposal + charter:** `planning/deliverables/governance-proposal-v04142026.md`, `planning/deliverables/pilot-governance-charter-v04222026.md`
- **Compliance map:** `planning/deliverables/compliance-map-v04222026.md`
- **DoIT 30-day notice template (draft):** `planning/deliverables/doit-ai-assessment-report-template-v04222026.md`
- **Pair-programmer strategy:** `planning/deliverables/pair-programmer-strategy-v04222026.md`
- **Open tasks tracker:** `planning/open-tasks-v04222026.md`

---

Happy to walk through any of the above in more detail, and looking forward to closing the three this-week items so we can start baselining without delay.

Thanks,
Vinay Lagisetty
AI Transformation Leader — Krasan Consulting Services
Vinay@lagisetty.com

---

## Shorter alternative (if you want a tighter email)

**Subject:** DCFS AI Pilot — framework deck + open items for this week

Hi David, all,

Thanks for the time today. Attached is the latest **AI framework deck** reflecting the Apr 21 walkthrough findings and the compressed pilot schedule.

**Three items we need to close this week to keep the pilot on track:**
1. Section 5e written determination — Copilot on ILC source code = "State data for AI"?
2. Tool availability — 6 confirmations (GitHub Copilot tier · Rovo tier · M365 Copilot · D365 Copilot · Section 5e · approved models)
3. DoIT 30-day notice template + owner; whether baseline work can proceed in parallel

**Four items for this month:**
- Pilot Governance Lead (DCFS designee)
- Security & Privacy observer (optional)
- Clearance process + timeline for 5 pair-programming AI specialists
- Any DCFS-side risks we haven't captured (audits, release freezes, leadership, federal reporting)

**In parallel, we're:** drafting the baseline survey, finalizing the pilot scope document, and preparing for the Intact pilot kickoff next week. All pointers + supporting docs in the deck appendix.

Happy to discuss any of this — and thanks again for pushing this forward.

Thanks,
Vinay
