# Meeting Summary — Dynamics Developer Workflow Walkthrough (Apr 23)

- **Date:** 2026-04-23
- **Type:** team (DCFS team working session)
- **Raw transcript:** [raw/2026-04-23-dynamics-developer-workflow-walkthrough.txt](raw/2026-04-23-dynamics-developer-workflow-walkthrough.txt)
- **Attendees:** Vinay Lagisetty (Krasan, AI Transformation Lead), Jeffrey Lobo (illinois.gov / DCFS, Intact & Preventative Services lead), Kali Devineni (illinois.gov / DCFS, Solution Architect — Intact & Preventative Services), Anudeep Chaitanya (illinois.gov / DCFS, Platform / Dynamics Developer — Intact & Preventative Services, ~1+ year on team)
- **Duration:** ~67 min

## Purpose
Discovery session for Vinay to learn the day-to-day Dynamics 365 developer workflow on the Intact & Preventative Services product team — what tools are used, where time is spent, where AI assistance might fit. The Intact team is one of the pilot teams, and Kali (architect) + Chaitanya (developer) are the candidate pilot participants on the developer side. Tester walkthrough is being scheduled separately by Jeff (Natalia + Kamilla, test services lead) for the following day.

## Workflow understanding

The current Dynamics developer workflow on Intact:

| Phase | Tool / Mechanism | Notes |
|---|---|---|
| Story intake | JIRA user story | Has description, acceptance criteria, scenarios, validations. No formal story method (no Darwin / INVEST enforcement). No separate BRD — "all our requirements are in these stories." |
| Architecture / business context | Confluence (linked from JIRA) | General app context lives in Confluence. Visio diagrams attached as JPEGs (not live / not Mermaid). |
| Implementation decision tree (firm convention) | "Development guidelines" — strict precedence: 1) out-of-the-box Dynamics business rules → 2) North52 (low-code business-rule engine, similar to PowerFX) → 3) JavaScript (client-side) → 4) Plugins / Azure Functions (server-side / pro-code) | Developer always tries the highest-level tool first; only drops to code when the prior layer can't satisfy the requirement. |
| Table & relationship modeling | make.powerapps.com (Power Apps maker portal) | Copilot for table/relationship creation IS enabled in this GCC tenant. Tested live: prompt-based table creation worked in a sandbox earlier but errored on the live attempt; relationship-creation needs the related table added to the solution first. Forms generation via Copilot does NOT appear to be enabled here. |
| Form configuration (Model-Driven App) | Power Apps form designer | Drag-and-drop. JS files attached to OnChange / OnSave. Business rules tab + JS libraries tab visible in form designer. Copilot widget for forms not present in this GCC env. |
| Workflow / async logic | make.gov.powerautomate.us (Power Automate, gov tenant) | Copilot pane IS visible ("Create your automation with Copilot"). Generates a flow skeleton from a natural-language prompt; configuration of each step still manual. |
| Client-side validation logic | North52 (preferred) → JavaScript fallback. JS is currently authored in VS Code or Notepad++ (no Copilot today). | |
| Server-side / synchronous logic where Power Automate can't meet latency or behavior requirements | .NET plugins, custom PCF components, Azure Functions — authored in Visual Studio | This is the genuine pro-code surface. GitHub Copilot would land here. Currently NOT enabled (DoIT has licensed it but rollout to this team has not happened). |
| Source control / CI | (not deeply discussed — assumed Azure DevOps / GitHub repos for plugins; Power Apps solutions exported separately) | |
| Story-management AI today | Atlassian Rovo ("Ask Rovo") IS available in JIRA | Live test on a case-flow diagram: Rovo produced a usable epic/user-story breakdown ("as a customer service representative / case worker / intake specialist / case manager …"). Microsoft Copilot's web pane choked on the same diagram (low-resolution JPEG decode). |
| Diagram authoring | Visio → exported as JPEG/PNG and pasted into Confluence / JIRA | Confirmed AI-readability gap. Mermaid would be far better for LLM ingestion. Kali noted she sometimes recreates Visio diagrams in a Mermaid-looking style; not standard practice. |

Most of the developer's time is in Power Apps maker + Power Automate (low-code/no-code surface). VS / VS Code time is the minority but it's where the most repetitive boilerplate lives (plugins, JS validation, PCF).

## Decisions made
| # | Decision | Details |
|---|----------|---------|
| 1 | Intact developer track will pilot with Kali (architect) + Chaitanya (developer) | Confirmed in session; testers will be covered in a separate walkthrough Jeff is scheduling (Natalia + Kamilla). |
| 2 | Hold off on tool experimentation until after May 4 (PI planning) | Vinay explicitly asked the team not to start using AI tools on real project work yet — baselining must remain undisturbed; freedom to use opens up "after May 12." |
| 3 | GitHub Copilot Pro license tier is the working assumption for developers | Tier (Business vs Enterprise vs Pro) still pending confirmation with DoIT. |

## Action items
| # | Item | Owner | Due | Status |
|---|------|-------|-----|--------|
| 1 | Confirm GitHub Copilot license tier (Pro / Business / Enterprise) and push for environment enablement on this GCC tenant | Jeff Lobo / DoIT | Before May 12 | Open |
| 2 | Investigate why Power Apps form-designer Copilot widget is missing in this GCC tenant (table-creation Copilot is present, forms Copilot is not — likely GCC release lag, not licensing) | Vinay + Chaitanya | Before design phase wrap | Open |
| 3 | Document the existing decision tree (out-of-box rules → North52 → JS → plugin) into the developer playbook so AI prompts can respect it | Vinay | Design phase | Open |
| 4 | Send pre-pilot survey to Kali + Chaitanya | Vinay | Before baseline window closes May 4 | Open |
| 5 | Set up working session to take one real story and walk it end-to-end with each candidate AI tool to identify automation points | Vinay + Kali + Chaitanya | After governance approval | Open |
| 6 | Capture token-usage / Microsoft Purview telemetry plan so leadership can approve tool usage | Vinay | Governance phase | Open |

## Findings that affect the plan

**Where AI can plausibly accelerate (developer track):**
- **Plugin / Azure Function / PCF authoring in Visual Studio** — strongest GitHub Copilot fit; this is the pro-code tail of the workflow.
- **JavaScript form-event handlers** (OnChange / OnSave) currently written in VS Code or Notepad++ — easy Copilot win, plus generated unit-test scaffolding.
- **Power Automate flow scaffolding** — Copilot pane is already enabled in the gov tenant; produces flow skeletons from prompts. Configuration of individual actions is still manual but skeleton authoring is a measurable savings.
- **Story-to-validation-rules translation** — JIRA stories already carry acceptance criteria and validation lists; concat-to-prompt approach (proven by Vinay on rule generation in past projects) can produce North52 expressions or JS validators in bulk.
- **Story decomposition from a diagram via Atlassian Rovo** — proven live in this session on a case-flow diagram. Useful for new-feature kickoff.
- **Story quality / completeness pre-check** — "is this story actually buildable?" gate before pull-into-sprint.

**Where AI is unlikely to help (or is risky):**
- **Power Apps form designer (drag-and-drop)** — Copilot for forms is not enabled in this GCC tenant; even when enabled, the gain on a drag-and-drop UI is marginal versus pro-code.
- **Diagram-driven generation when the diagram is a Visio JPEG** — confirmed live: Microsoft Copilot rejected the case-flow image as low-resolution. LLMs need Mermaid or text relationships; this is a content-format problem upstream of AI, not an AI capability problem.
- **Auto-applying configuration changes** — explicit human-in-the-loop policy: AI may generate code/config but a human must review and submit. No auto-push.
- **Dynamics 365 Copilot (the in-app one)** — Jeff correctly flagged this is end-user / business-process facing (chat, case-history surfacing, embedded agents), not an SDLC accelerator. Don't conflate it with the developer copilots.

**Gaps in current workflow:**
- No standardized story method (no INVEST / Darwin gate). Story quality is therefore variable, which directly affects how well any prompt-based generation will perform.
- Visio-as-JPEG-in-Confluence is the same gap surfaced in the Apr 16 architecture walkthrough — now confirmed from the developer side too. Mermaid migration would benefit both architects and developers.
- No BRDs separate from stories — all context lives inline in the JIRA story. Means prompts have to lean on Rovo's Confluence/JIRA grounding rather than a clean spec doc.

**Tool / access blockers:**
- GitHub Copilot is licensed by DoIT but **not yet enabled** for this team's environment. Hard blocker for the highest-value developer use cases (plugins, PCF, JS).
- Power Apps form-designer Copilot is **missing from this GCC tenant** despite table-creation Copilot being present — likely a GCC release-cadence limitation, needs Microsoft / DoIT confirmation.
- Microsoft Purview telemetry for token usage / DLP needs to be stood up before usage is approved (Vinay flagged in session).
- Chaitanya is "still getting access" to some environments — small but real onboarding lag.

## New risks / items for register
- **R-NEW (Workflow):** GCC tenant feature parity lag — Copilot rollout to GCC consistently trails commercial. The form-designer Copilot gap is a concrete instance. Risk: pilot value depends on features that may not land in GCC inside the pilot window.
- **R-NEW (Baseline integrity):** Live demos in this session involved real (sandbox) prompt usage. If similar exploration happens before May 4, baseline measurements will be polluted. Mitigation: explicit hold-off communicated in this session; needs reinforcement with the team.
- **R-NEW (Story-quality dependency):** AI productivity gains on this team are gated by story quality, which is currently informal. If stories don't carry clean acceptance criteria, prompt-based generation degrades. Candidate for a separate "story hygiene" intervention.
- **R-NEW (Tool sprawl / "which Copilot"):** Session surfaced at least five distinct "Copilots" (GitHub, Microsoft 365, Power Automate, Power Apps maker, Dynamics 365). Risk of user confusion and incorrect tool selection — playbook needs an explicit "which Copilot for which task" decision aid.

## Open questions
- What is the actual GCC enablement timeline for GitHub Copilot on this team's environment?
- Is form-designer Copilot a GCC release gap or a tenant-config gap? (Confirm with Microsoft / DoIT.)
- Does Atlassian Rovo support Visio/JPEG diagram ingestion natively, or do we need a Visio→Mermaid pre-processing step?
- What North52 license / API surface exists? Can we generate North52 expressions programmatically from JIRA acceptance criteria?
- What is the team's actual sprint cadence and PI calendar — Vinay referenced May 4 as PI planning; need to confirm that and the May 12 "freedom to use" date.
- How does the team handle plugin / PCF source control today? GitHub Copilot value is much higher if there's an existing repo with patterns to ground on.
- Are there existing unit tests for plugins / JS, or is QA primarily black-box on the deployed app? (Affects test-generation use case.)
- Is there a documented prompt library or just ad-hoc usage today? (Chaitanya has read articles on GitHub Copilot but hasn't used it.)

## Dates captured
- **May 4** — PI planning; baseline window must close by then.
- **May 12** — earliest date the team may begin freely using AI tools on real work (post-governance approval).
- **April 24** (next day) — separate test team walkthrough scheduled by Jeff with Natalia + Kamilla (test services lead).
