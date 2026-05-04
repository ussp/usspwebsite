# Meeting Summary — Testing Workflow Walkthrough (Apr 24)

- **Date:** 2026-04-24
- **Type:** team (DCFS team working session)
- **Raw transcript:** [raw/2026-04-24-testing-workflow-walkthrough.txt](raw/2026-04-24-testing-workflow-walkthrough.txt)
- **Attendees:** Vinay Lagisetty (Krasan, AI Transformation Lead), Jeffrey Lobo (illinois.gov / DCFS, Intact & Preventative Services lead), Nataliia Revutska (illinois.gov / DCFS, Senior Test Engineer & QA Lead — Intact team, ~1.5 yrs on DCFS), Remya Raj (illinois.gov / DCFS, Senior Testing Specialist — Intact team, joined Nov 2025), Kamila Aibedullova (illinois.gov / DCFS, Test Services Lead across all teams + Admin/Legal team lead)
- **Duration:** ~65 min

## Purpose
Discovery session for Vinay to learn the current testing workflow on the Intact team — what tools are used, where time is spent, what is manual vs. automated, and where AI assistance might fit. The Tester is one of the five pilot roles, so this walkthrough directly feeds the tester playbook and per-role metrics. Counterpart to the Apr 23 developer walkthrough.

## Workflow understanding

The current Intact tester workflow:

| Phase | Tool / Mechanism | Notes |
|---|---|---|
| Story intake | JIRA user story | Description, acceptance criteria, business rules, validations live in the story. No separate test-strategy doc per story. |
| Test case design | Zephyr Scale (JIRA plugin) | Tester creates a "test cycle" per user story; each acceptance criterion gets at least one test case (often more for negative / edge cases). Steps entered manually in Zephyr — some testers paste from Excel, others type directly. Natalia types directly; team has tried both. |
| Peer review of test cases | Manual — second tester reviews | **No documented peer-review checklist exists today.** Confirmed by both Natalia and Kamila. Jeff flagged this as a gap to close. |
| Wait for deployment | Story sits "queued for system test release" until dev deploys to test env | Test cases often authored 1–2 days before deployment so execution can start immediately. |
| Test data preparation | Mostly manual, some automation existing | E.g., creating new audit-history entries to verify a role can view them. Time-consuming and story-dependent. |
| Security-role switching | Internal "role switch automation" app on Dynamics 365 (built by Shared Services) | Self-service: tester picks role + comment, clicks Save & Close, refreshes app, role is applied within seconds. Replaces an old manual back-and-forth with developers. |
| Execution (manual) | Zephyr Scale Test Player | Step-by-step: tester goes into IllinoisConnect, follows each test step, marks pass/fail per step, attaches actual result + screenshot. Mostly manual today; "automation also coming up." |
| Defect / bug logging | JIRA (sprint-tracked) | Bugs prioritized inside the sprint; no standalone defect dashboard yet. |
| ADA / accessibility testing | "Accessibility Insights" tool — manual | Mandatory for every story. Selenium not used. Vinay flagged this is hard to AI-accelerate. |
| Smoke / regression / E2E | Eggplant (test automation platform) — separate effort, in infancy | Goal is to build automated end-to-end suites for smoke + regression. Eggplant has its own AI roadmap (vendor release expected end of 2026); minimal AI overlap with this pilot today. |
| Test reporting | Not yet implemented | Per-sprint and per-PI test reports (bug counts, fix counts, coverage) are required but **not currently being produced.** Kamila and Jeff agreed reporting is a near-term gap. |

**Time split (Remya / Natalia estimate):** roughly 20% test case design, 80% execution + test-data prep + role-switching + screenshots + documentation. Vinay tested this estimate live; team agreed it's directionally correct, with the caveat that documentation and non-functional testing (ADA, etc.) also consume meaningful time.

**Live demo highlights:**
- Vinay had Remya paste a real user story into "Ask Rovo" with a one-line prompt: "create test cases for this user story." Rovo correctly identified the JIRA issue, generated 4 role-specific test cases, AND surfaced an additional negative test case (verify no direct URL access to audit history) the team hadn't explicitly written.
- When asked to insert into Zephyr, Rovo could only add the cases as a JIRA comment — confirmed there is **no Rovo–Zephyr integration enabled** in the current tenant.

## New tool suggested (PROMINENT SECTION)

**Tool:** Zephyr Scale Agent for Atlassian Rovo (the official Rovo agent that bridges Rovo into Zephyr Scale's test-management surface — i.e., create / update / link test cases in Zephyr from a Rovo prompt).

- **Vendor:** SmartBear (Zephyr Scale) + Atlassian (Rovo)
- **What it does:** Lets Rovo create test cases directly inside Zephyr Scale folders/sub-folders, link them to JIRA stories, and write executable steps — instead of only producing text or pasting a JIRA comment.
- **Who suggested it:** Vinay surfaced the gap during the live demo (Rovo could generate test cases but only commented them back to the JIRA story); Jeff agreed and immediately pinged Carl Lobo (the JIRA admin contact) to scope enabling it.
- **Specific use cases mentioned:**
  - Generate full test case sets (positive + negative + edge) directly into the correct Zephyr folder for a given story
  - Auto-create the Zephyr test cycle and populate steps
  - Reduce the 20% spent on test-case authoring further so testers can focus on execution and exploratory testing
- **Concerns / objections raised:**
  - Kamila and Vinay both noted prompts will need to be much more detailed (negative cases, boundary conditions, role coverage) than the one-liner used in the demo
  - Vinay raised whether test case content contains PII/PHI sent outside the tenant — Jeff confirmed test cases themselves do not contain real client data, so DLP risk is low
  - Licensing cost unknown — Jeff to check
- **Authorization status:** **NOT in the current authorized list.** The four authorized AI tools are GitHub Copilot, Atlassian Rovo, Microsoft 365 Copilot, and Dynamics 365 Copilot. The Zephyr Scale Agent for Rovo is a **separate add-on** (different vendor surface, different data path into Zephyr) — adding it to authorized usage requires **DoIT 30-day notice per AI Policy §5f.**

**Action required:** Vinay to update `tool-authorization-list.md` with this as a "Proposed addition — pending DoIT §5f notice." Jeff already initiated the technical-feasibility check with Carl Lobo (JIRA admin).

## Decisions made
| # | Decision | Details |
|---|----------|---------|
| 1 | Pursue Zephyr Scale Agent for Rovo as a tool addition | Jeff to drive technical enablement check with Carl Lobo / JIRA admin team in parallel; Vinay to file §5f notice content. |
| 2 | Treat manual functional testing as a **constrained AI fit** | The 80% execution time is mostly hands-on UI work; AI gains will concentrate in design + reporting + test-data prep, not execution. |
| 3 | Schedule a separate session for ADA / accessibility and Eggplant automation walkthroughs | Jeff to set up — out of scope for this initial discovery. |
| 4 | Schedule an Intact-specific BA walkthrough next week | Jeff to organize; include Scrum lead so they're aware of pilot direction. |

## Action items
| # | Item | Owner | Due | Status |
|---|------|-------|-----|--------|
| 1 | File §5f notice for Zephyr Scale Agent for Rovo and update tool-authorization-list | Vinay | Before pilot start (post-baseline) | Open |
| 2 | Confirm technical enablement path + licensing cost for Zephyr Scale Agent for Rovo | Jeff (with Carl Lobo / JIRA admin) | Open | Open |
| 3 | Define a peer-review checklist for test cases (negative scenarios, role coverage, edge conditions, traceability) | Kamila + Vinay | Design phase | Open |
| 4 | Build a Zephyr-import-friendly Excel template + matching Rovo prompt library so AI-generated test cases can be loaded in bulk if Zephyr Agent isn't enabled in time | Vinay | Design phase | Open |
| 5 | Define a sprint/PI test-reporting template (bug counts, fix counts, coverage, test-cycle pass rate) — fills a current reporting gap and creates an AI-assistable artifact | Kamila + Jeff + Vinay | Design phase | Open |
| 6 | Schedule Intact BA walkthrough + include Scrum lead | Jeff | Next week | Open |
| 7 | Schedule ADA / accessibility + Eggplant walkthrough sessions | Jeff | TBD | Open |
| 8 | Pre-pilot survey to Natalia + Remya (and Kamila as test services lead) | Vinay | Before baseline window closes May 4 | Open |

## Findings that affect the plan

**Where AI can plausibly accelerate (tester track):**
- **Test case generation from acceptance criteria** — proven live with Rovo on a real Intact story; produced extra negative case the team hadn't written. Strongest fit on this team.
- **Test report authoring (sprint + PI)** — current gap (no reports being generated); AI can draft from JIRA + Zephyr data. Easy quick win that also closes a leadership-visibility gap.
- **Peer-review checklist enforcement** — AI can pre-screen authored test cases against a checklist (negative coverage, role coverage, traceability) before peer review.
- **Test data preparation prompts** — for repetitive synthetic-data scenarios (e.g., create N audit-history entries with given role mix), AI can author scripts or step instructions.
- **Documentation cleanup / formatting** — the screenshot + actual-result narration that gets pasted into Zephyr is repetitive and AI-templatable.

**Where AI is unlikely to help / is risky:**
- **Manual UI test execution** — the 80% bulk of tester time. AI can't drive IllinoisConnect's UI on the tester's behalf, and the human-in-the-loop policy explicitly forbids autonomous execution. This is the structural reason it's "hard to squeeze 15% out of testing" — Vinay said this directly in the post-meeting debrief with Jeff.
- **ADA / accessibility testing** — mandatory per story, already manual via Accessibility Insights, no AI integration available today.
- **Eggplant-driven smoke / regression automation** — vendor's own AI roadmap is the right path, not this pilot's tools.
- **Auto-applying test cases to Zephyr** — even with the Zephyr Agent enabled, every AI-generated case needs human review before saving (governance principle).

**Tool / access blockers:**
- **Zephyr Scale Agent for Rovo not enabled** — single biggest blocker for tester-side AI value. Without it, generated cases can only be added as JIRA comments; manual transcription into Zephyr remains.
- **No peer-review checklist exists** — blocker for using AI as a review pre-screener; the checklist is the prompt input.
- **No sprint/PI test reports being produced today** — blocker for measuring tester-side gains via report-authoring time savings (no baseline to beat).
- Rovo–Zephyr integration may require a paid add-on / additional licensing — unconfirmed.

## New risks / items for register
- **R-NEW (Tester ceiling risk):** Tester workflow is ~80% manual UI execution that AI cannot meaningfully accelerate. Achieving 15% productivity uplift on the tester role specifically is unlikely without an automation tool change (Eggplant maturity, more Zephyr Agent capability, or reframing the role to include exploratory/coverage work). May need to set role-specific targets rather than uniform 15% across all five roles.
- **R-NEW (Tool-authorization timeline):** Zephyr Scale Agent for Rovo requires §5f 30-day DoIT notice. If filed late, it lands inside the pilot execution window rather than before it, blunting measured impact. File ASAP.
- **R-NEW (Reporting-gap risk doubles as opportunity):** No sprint/PI test reports exist today, which means there's no baseline to compare AI-assisted reporting against. Risk: gains aren't measurable unless we build a "shadow baseline" by manually drafting one report cycle pre-AI. Opportunity: this is an easy low-resistance AI win because no incumbent process is being displaced.
- **R-NEW (Peer-review checklist absence):** The lack of a peer-review checklist is a quality-process gap independent of AI; the pilot creating one is a side benefit even if AI gains are modest.

## Open questions
- What is the licensing model for Zephyr Scale Agent for Rovo? Per-user, per-tenant, included with existing Zephyr/Rovo licenses?
- How long does the §5f DoIT notice typically take in practice (30 days minimum, but often longer)?
- Does Eggplant's planned end-of-year AI release fall inside the pilot window, and should we factor it in as a forward-looking item even if it's not usable today?
- What does test-data prep look like across stories — is it largely repetitive (scriptable) or mostly bespoke (per-story creative work)?
- Are there existing test-report templates from any other DCFS team we can reuse rather than design from scratch?
- Does the tester role's per-role pilot target need to be lower than 15%, given the manual-UI ceiling? (Carry to per-role metrics deliverable.)
- Will the Intact BA walkthrough (next week) surface story-quality interventions that improve test-case generation upstream?

## Dates captured
- **Next week** — Intact BA walkthrough + Scrum lead inclusion (Jeff to schedule).
- **Monday** — Vinay to release the consolidated process / tool document (originally targeted today; pushed to Monday after this session ran long).
- **Before May 4** — pre-pilot survey to Natalia, Remya, Kamila; baseline window closes.
- **Eggplant vendor AI release** — vendor-stated end of 2026 (out of pilot window).
