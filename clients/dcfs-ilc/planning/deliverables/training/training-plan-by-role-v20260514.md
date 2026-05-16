# DCFS AI Pilot — Per-Role Training Plan (Free Resources)

> **Date:** May 14, 2026
> **Version:** v1 — draft for review
> **Scope:** Pilot teams only (~25–30 people across 6 roles)
> **Source authority:** complements `planning/guide/07-training-delivery.md` (framework) — this doc is the **practical per-role plan with curated free resources**
> **Status:** Draft

---

## Why "free resources only"

- **No new procurement** required to start training next week — sidesteps any DoIT 30-day notice process.
- **Government-appropriate** — Microsoft Learn, GitHub Skills, Atlassian University, NIST publications are all State-acceptable.
- **Reusable** for the broader rollout (160 consultants across 12 teams) without per-seat training costs.
- **State-tenant safe** — most learning happens in personal browsers; tool practice happens in the sandboxed State tenant.

---

## Design constraints (recap)

- **Track 0 is a hard gate.** No tool license until DoIT AI Policy + DCFS Governance is completed and the AI Use Acknowledgment is signed.
- **State-tenant sandboxing.** Copilot cannot do web search inside the tenant — pre-work that requires reading external pages happens in personal browsers, **not via Copilot chat**.
- **HITL discipline.** Every output requires human review. Reinforced in every session, not just stated once.
- **SDLC focus only.** Business-process AI features (D365 Customer Service Copilot, Service Agent, etc.) are out of scope for this pilot.
- **D365 Copilot not yet enabled in GCC.** Configuration / Data Team tracks include "what to expect once enabled" segments but rely on Power Automate Copilot + Power Apps Copilot for tables (✅ confirmed enabled Apr 23) for hands-on labs.

---

## Cross-cutting: Track 0 + Foundation (everyone)

### Track 0 — DoIT AI Policy & DCFS Governance (1h, mandatory gate)

**Goal:** every participant can recite the four boundary rules (no PII in prompts, HITL on every output, tenant-only data, audit logged) before getting a tool license.

**Pre-work (~45 min):**
- Read: DoIT AI Policy v2 — full PDF (`reference-docs/20250401-DoIT-AI Policy-v2- A11Y.pdf`) — ~30 min
- Read: `reference-docs/doit-ai-policy-summary.md` (our one-pager) — 10 min
- Sign: AI Use Acknowledgment form

**Free supporting resources:**
- **NIST AI RMF Playbook** — https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook — anchors the GOVERN / MAP / MEASURE / MANAGE structure we'll reference repeatedly
- **Microsoft Responsible AI Standard (v2)** — https://www.microsoft.com/en-us/ai/principles-and-approach — vendor-side framing
- **Microsoft Trust Center — Copilot data protection** — https://www.microsoft.com/en-us/trust-center — for the data-boundary segment

**Session content (1h live):**
- 15 min — Four boundary rules walk-through, with DCFS-specific examples
- 20 min — "What Copilot can and can't do in our tenant" — the sandboxing one-pager
- 15 min — HITL workflow demo (using a real ILC story)
- 10 min — AI Use Acknowledgment Q&A + signing

---

### Foundation Session (1.5h, everyone)

**Goal:** baseline prompt literacy + understanding of what each tool is good and bad at.

**Pre-work (~30 min):**
- Watch: **GitHub — "What is GitHub Copilot?"** (15 min) — https://github.com/features/copilot
- Watch: **Atlassian — Rovo Overview** (10 min) — https://www.atlassian.com/software/rovo
- Skim: **Microsoft Learn — "Get started with Microsoft 365 Copilot"** module — https://learn.microsoft.com/en-us/training/modules/get-started-microsoft-365-copilot/

**Session content (1.5h live):**
- 20 min — Prompt fundamentals: clear / specific / contextual / iterative (CSCI)
- 20 min — Tool landscape: which tool for which job (Copilot vs. Rovo vs. Power Platform AI)
- 30 min — Hands-on prompt lab: each person writes 3 prompts on an ILC story, gets peer feedback
- 20 min — "What good looks like" — review of strong vs. weak prompts on actual ILC artifacts

**Free supporting resources:**
- **Microsoft Learn — Prompt engineering fundamentals** — https://learn.microsoft.com/en-us/training/modules/intro-to-prompt-engineering-with-azure-openai/
- **GitHub Skills — "Introduction to GitHub Copilot"** — https://github.com/skills (search "Copilot")
- **DAIR.AI Prompt Engineering Guide** — https://www.promptingguide.ai/ — comprehensive reference, free, open-licensed

---

## Role Track 1: BA-Technical (3h)

**Primary tools:** Atlassian Rovo (JIRA + Confluence), M365 Copilot (Word, Outlook)
**Use cases:** acceptance criteria drafting, user story refinement, requirements extraction from meeting notes, Confluence page summarization

### Pre-work (~2h)

| Resource | Source | Time | Purpose |
|----------|--------|------|---------|
| **Atlassian University — Rovo for JIRA Cloud** (free path) | https://university.atlassian.com/student/path/1487127/activity | 45 min | Core Rovo capabilities in JIRA |
| **Atlassian — Rovo Agents overview** | https://www.atlassian.com/software/rovo/agents | 20 min | Understand the agent model |
| **Microsoft Learn — "Use Copilot in Microsoft Word"** | https://learn.microsoft.com/en-us/training/modules/use-copilot-microsoft-word/ | 30 min | Drafting + summarization |
| **Microsoft Learn — "Use Copilot in Outlook"** | https://learn.microsoft.com/en-us/training/modules/use-copilot-microsoft-outlook/ | 20 min | Email summarization, draft replies |

### Live session content (3h)

- **0:00–0:30** Tool warm-up: open a real ILC story in JIRA, use Rovo to summarize linked Confluence pages
- **0:30–1:00** Acceptance criteria lab: take an under-specified story, use Rovo to propose Gherkin-style ACs, **human review and edit**, paste back into JIRA
- **1:00–1:30** Requirements extraction lab: feed Rovo a stakeholder email thread → draft user story → human edit → commit to JIRA
- **1:30–2:00** Confluence page generation: use Rovo to draft a "process change" page from bullets; **human review for accuracy + PII scan**; publish
- **2:00–2:30** Anti-patterns: where Rovo hallucinates fields, invents stakeholders, or assumes structure — how to catch
- **2:30–3:00** Build your own prompt library — each BA leaves with 5 reusable prompt templates for their workflow

### Cheat sheet to build (handout)

- BA Prompt Library: 10 starter prompts (story refinement, AC drafting, summarization, change-impact, dependency-mapping, stakeholder-language translation, gap analysis, risk surfacing, definition-of-done check, glossary lookup)

### Post-training (free, ongoing)

- **Atlassian Community — Rovo forum** — https://community.atlassian.com/ — peer Q&A
- Office hours: 30 min/week with Vinay during pilot

---

## Role Track 2: Developer (3h)

**Primary tools:** GitHub Copilot (Chat + inline + Edits), Power Automate Copilot (configuration work), Power Apps Copilot for tables
**Use cases:** code generation, unit test scaffolding, refactoring, code explanation, code review assistance, Power Automate flow drafting

> ⚠️ GitHub Copilot is **licensed by DoIT but NOT YET PROVISIONED** for this team's GCC environment. Pre-work uses the personal-account free tier or GitHub Skills sandbox; live session requires GCC provisioning to complete (escalation to Dave/Jim in flight). If still blocked at session time, run lab on a personal repo + treat as "what to expect when provisioned."

### Pre-work (~2.5h)

| Resource | Source | Time | Purpose |
|----------|--------|------|---------|
| **GitHub Skills — "Getting started with GitHub Copilot"** | https://github.com/skills/getting-started-with-github-copilot | 45 min | Hands-on inline + chat fundamentals |
| **GitHub Docs — Copilot in VS Code guide** | https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-your-ide | 30 min | IDE setup + workflows |
| **GitHub Copilot Chat cheat sheet** | https://docs.github.com/en/copilot/github-copilot-chat-cheat-sheet | 15 min | Slash commands + @-mentions |
| **Microsoft Learn — "Build a flow with Power Automate Copilot"** | https://learn.microsoft.com/en-us/training/modules/build-flows-copilot/ | 30 min | Maker-side configuration |
| **YouTube — GitHub Universe Copilot sessions** (curated playlist) | https://www.youtube.com/@GitHub | 30 min | Real-world patterns |

### Live session content (3h)

- **0:00–0:30** Setup verification: VS Code + Copilot + ILC repo cloned. Resolve auth issues. (Hard prereq.)
- **0:30–1:00** Code-completion lab: extend an ILC Dynamics 365 plugin/PCF method. Compare Copilot suggestion vs. handwritten.
- **1:00–1:30** Test-scaffolding lab: generate xUnit tests for an existing class. Review for false coverage.
- **1:30–2:00** Refactoring lab: ask Copilot to refactor a 200-line method; **human reviews each change**, commits only the wins.
- **2:00–2:30** Power Automate lab: draft an ILC flow from natural language in `make.gov.powerautomate.us`. Hand-tune each action.
- **2:30–3:00** Anti-patterns: hallucinated APIs, wrong null-handling, fabricated test data. How to catch in review.

### Cheat sheet to build (handout)

- Dev Prompt Library: inline-comment patterns ("// generate xUnit test for..."), chat slash commands (/explain, /fix, /tests), refactoring prompts, Power Automate Copilot patterns
- "When to ignore Copilot" — situations where rolling your own beats accepting suggestion

### Post-training (free, ongoing)

- **GitHub Copilot Trust Center** — https://resources.github.com/copilot-trust-center/ — data, IP, audit answers
- **Microsoft Learn — Power Platform learning paths** — https://learn.microsoft.com/en-us/training/powerplatform/
- Office hours: 30 min/week with Vinay during pilot

---

## Role Track 3: Tester (3h)

**Primary tools:** Atlassian Rovo (JIRA + Confluence), GitHub Copilot (test code), Zephyr Scale (test mgmt)
**Use cases:** test case generation from stories, negative test case ideation, test step refinement, defect triage assistance, test execution reporting

> 📝 **Zephyr Scale Agent for Rovo** is bundled with Rovo (free) — JIRA admin enablement in progress (owner: Jeff Lobo). If still pending at session time, Rovo generates test cases as a JIRA comment, tester manually pastes into Zephyr folders. Acceptable for Sprint 1.

### Pre-work (~2h)

| Resource | Source | Time | Purpose |
|----------|--------|------|---------|
| **Atlassian University — Rovo for JIRA** (testing modules) | https://university.atlassian.com/ | 45 min | Test case generation from Rovo |
| **SmartBear / Zephyr Scale tutorials** | https://support.smartbear.com/zephyr-scale-cloud/docs/ | 30 min | Test management fundamentals |
| **Microsoft Learn — "Get started with Copilot in M365"** | https://learn.microsoft.com/en-us/training/modules/get-started-microsoft-365-copilot/ | 20 min | Excel + Word for test reports |
| **GitHub Skills — Copilot for test generation** | https://github.com/skills | 30 min | If tester writes automation |

### Live session content (3h)

- **0:00–0:30** Story-to-test-case lab: pick a real ILC story, use Rovo to generate role-based positive cases, **tester reviews + edits**
- **0:30–1:00** Negative test ideation: prompt Rovo for boundary, error-handling, security, accessibility cases
- **1:00–1:30** Defect triage lab: cluster a backlog of similar defects with Rovo; identify root-cause patterns
- **1:30–2:00** Test report generation: use M365 Copilot in Excel to summarize sprint test execution
- **2:00–2:30** (If GitHub Copilot provisioned) Test automation lab: generate Selenium or Playwright test for an ILC screen
- **2:30–3:00** Anti-patterns: tests with no real assertion, fabricated data, missing PII scrubbing in test data

### Cheat sheet to build (handout)

- Tester Prompt Library: AC-to-test, negative-test generators, regression scoping, defect clustering, test report summarization
- PII Test Data Discipline: rules for synthetic vs. real data in test cases

### Post-training (free, ongoing)

- **Atlassian — Rovo for testing** community discussions
- Office hours: 30 min/week with Vinay during pilot

---

## Role Track 4: Solution Architect (2h)

**Primary tools:** M365 Copilot (Word, Excel, PowerPoint, Teams), Power BI Copilot (where enabled), Rovo (Confluence)
**Use cases:** architecture document generation, ADR drafting, options analysis, stakeholder communication, design review prep

### Pre-work (~3h)

| Resource | Source | Time | Purpose |
|----------|--------|------|---------|
| **Microsoft Learn — "Microsoft 365 Copilot for Architects/IT Pros"** path | https://learn.microsoft.com/en-us/training/paths/copilot-microsoft-365/ | 60 min | Full M365 surface |
| **Microsoft Learn — "Use Copilot in PowerPoint"** | https://learn.microsoft.com/en-us/training/modules/use-copilot-microsoft-powerpoint/ | 30 min | Stakeholder decks |
| **Microsoft Learn — "Use Copilot in Excel"** | https://learn.microsoft.com/en-us/training/modules/use-copilot-microsoft-excel/ | 30 min | Options analysis tables |
| **Atlassian University — Confluence + Rovo** | https://university.atlassian.com/ | 30 min | ADRs + design pages |
| **Microsoft Learn — Power BI Copilot** | https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction | 30 min | Read-only of metrics dashboards |

### Live session content (2h)

- **0:00–0:30** ADR generation lab: use M365 Copilot to draft an Architecture Decision Record from rough bullets; review for accuracy
- **0:30–1:00** Options analysis: use Excel Copilot to build comparison table across 3 design options
- **1:00–1:30** Stakeholder deck: use PowerPoint Copilot to draft a 5-slide design review deck
- **1:30–2:00** Anti-patterns: invented vendors, wrong cost estimates, fabricated benchmark numbers — how to catch

### Cheat sheet to build (handout)

- SA Prompt Library: ADR template, options-analysis template, design-review deck outline, stakeholder-translation prompts

---

## Role Track 5: Testing Services Lead (2.5h)

**Primary tools:** Atlassian Rovo + dashboards, M365 Copilot, JIRA Dashboards / Power BI for reporting
**Use cases:** test strategy drafting, sprint reporting, capacity planning, quality trend analysis

### Pre-work (~2.5h)

| Resource | Source | Time | Purpose |
|----------|--------|------|---------|
| **Atlassian University — Rovo for managers** | https://university.atlassian.com/ | 45 min | Reporting + summarization at scale |
| **Microsoft Learn — Copilot in Excel** | https://learn.microsoft.com/en-us/training/modules/use-copilot-microsoft-excel/ | 30 min | Quality trend analysis |
| **JIRA — Built-in dashboard reports tutorial** | https://support.atlassian.com/jira-software-cloud/docs/configure-a-dashboard/ | 30 min | Test execution dashboards |
| **Microsoft Learn — Power BI Copilot basics** | https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction | 30 min | If/when enabled |

### Live session content (2.5h)

- **0:00–0:30** Sprint test report lab: generate sprint quality report from JIRA data using Copilot in Excel
- **0:30–1:00** Test strategy lab: use Rovo + Confluence to draft a test strategy page for a new ILC module
- **1:00–1:30** Capacity planning: use Excel Copilot to model tester capacity vs. forecasted test cases
- **1:30–2:00** Quality trend analysis: use Copilot to find regression patterns across sprints
- **2:00–2:30** Governance fit: how testing-lead outputs feed into the Pilot Governance dashboard

---

## Role Track 6: Leadership Briefing (1h)

**Audience:** Jim, Dave, Romi, Jeff, other DCFS / Krasan leadership
**Goal:** understand the dashboard, the success criteria, the risks, and how to interpret pilot data

> 🟡 **Account Head:** Romi co-delivers this briefing. Vinay handles content; Romi handles framing for DCFS executives.

### Pre-work (~1h)

| Resource | Source | Time | Purpose |
|----------|--------|------|---------|
| **NIST AI RMF — Executive Summary** | https://www.nist.gov/itl/ai-risk-management-framework | 30 min | Governance framing |
| **Microsoft — "Copilot adoption for leaders"** | https://adoption.microsoft.com/en-us/copilot/ | 20 min | Vendor leadership perspective |
| **Pilot Governance Charter** (internal) | `deliverables/governance/pilot-governance-charter-v20260428.md` | 10 min | Our own charter |

### Live session content (1h)

- **0:00–0:15** Pilot scope, timeline, success criteria recap
- **0:15–0:30** Dashboard walkthrough — engagement, team, baseline metrics
- **0:30–0:45** Risk register + escalation path
- **0:45–1:00** Q&A

---

## Master free-resource library

Curated, government-appropriate, ranked by signal-to-noise:

### Tier 1 — Authoritative / vendor-published
- **Microsoft Learn** — https://learn.microsoft.com/ — every Copilot surface
- **GitHub Skills** — https://github.com/skills — hands-on labs
- **Atlassian University** — https://university.atlassian.com/ — Rovo + JIRA + Confluence
- **GitHub Copilot Trust Center** — https://resources.github.com/copilot-trust-center/
- **Microsoft Trust Center** — https://www.microsoft.com/en-us/trust-center

### Tier 2 — Standards / governance
- **NIST AI RMF** — https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook
- **NIST AI RMF Generative AI Profile** — https://www.nist.gov/itl/ai-risk-management-framework
- **Microsoft Responsible AI Standard** — https://www.microsoft.com/en-us/ai/principles-and-approach

### Tier 3 — Community / educational (use selectively)
- **DAIR.AI Prompt Engineering Guide** — https://www.promptingguide.ai/ — solid, vendor-neutral
- **GitHub Universe session recordings** — https://www.youtube.com/@GitHub
- **Microsoft Mechanics** (YouTube) — https://www.youtube.com/@MicrosoftMechanics
- **Microsoft Reactor sessions** — https://developer.microsoft.com/en-us/reactor/

### Skip / NOT for State use
- ❌ ChatGPT / OpenAI documentation — not a State-approved tool
- ❌ Claude / Anthropic prompt library — not a State-approved tool
- ❌ Google Gemini guides — not a State-approved tool

---

## Delivery logistics

- **Format:** Teams meeting with screen sharing (remote-first). Some role tracks may have an in-person option at the Krasan office for hands-on labs.
- **Pre-work delivery:** SharePoint folder per role; participants self-mark completion ahead of live session.
- **Materials:** all cheat sheets generated as Word docs + saved to the pilot Confluence space. Each participant leaves the live session with their own prompt library file.
- **Office hours:** Vinay 30 min/week per role during the 5-sprint pilot. Group session, not 1:1.
- **Recording:** all live sessions recorded for makeup viewing — stored in the pilot Teams channel.

---

## Build-out punch list (what we need to produce next)

| # | Item | Owner | Effort | Source |
|---|------|-------|--------|--------|
| 1 | Foundation deck (1.5h slides) | Vinay + Robert | ~6h | Curate from Microsoft Learn slides + DCFS examples |
| 2 | BA Prompt Library cheat sheet | Vinay | 3h | Atlassian University patterns + ILC examples |
| 3 | Developer Prompt Library cheat sheet | Vinay | 4h | GitHub Skills patterns + ILC code examples |
| 4 | Tester Prompt Library cheat sheet | Vinay | 3h | Rovo testing patterns + ILC story examples |
| 5 | SA Prompt Library cheat sheet | Vinay | 2h | M365 Copilot architecture patterns |
| 6 | TSL Prompt Library cheat sheet | Vinay | 2h | Reporting + strategy patterns |
| 7 | Leadership 1-page summary (for the briefing) | Vinay + Romi | 2h | Governance Charter excerpts + dashboard sketch |
| 8 | DCFS AI Use Acknowledgment form | Robert | 1h | DoIT Policy template |
| 9 | Track 0 — "Copilot boundaries" one-pager | Vinay | 2h | (was due May 1 — overdue) |
| 10 | Sample ILC story / code / test artifacts for labs | Pilot leads | 2h | Pull from real backlog |

**Total prep effort:** ~27h. Spread across Vinay + Robert + Romi + pilot leads, parallelizable to ~1 week.

---

## Notes

- This plan is **deliverable-light, resource-heavy** on purpose — we're leaning on Microsoft / GitHub / Atlassian's free content rather than building from scratch. Our value-add is the **DCFS-specific framing, ILC examples, governance overlay, and curation**.
- Once D365 Copilot lands in GCC (Krishna's MS engagement in flight), this plan extends with a D365-specific module for the Configuration / Data Team — drafted but withheld from live delivery until enablement is confirmed.
- Resource links are all current as of May 14, 2026. Recheck before each delivery cycle — vendor URLs shift.
