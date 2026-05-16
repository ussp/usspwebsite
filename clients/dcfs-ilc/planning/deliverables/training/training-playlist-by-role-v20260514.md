# DCFS AI Pilot — Curated Training Playlist by Role

> **Date:** May 14, 2026
> **Version:** v2 — adds AI fundamentals, context engineering, D365 AI, measurement, and internal playbook references
> **Status:** Draft

---

## How to use this

1. Each role has a **must-watch core** (~2–3h pre-work) — required before the role's working session (see structure below)
2. **Stretch picks** are optional deeper dives — for the most engaged participants
3. **Reference shelf** items are linked once and re-used by office hours / cheat sheets
4. All resources are **free** and **government-appropriate** (Microsoft, GitHub, Atlassian, NIST, DORA Research)
5. Pre-work is consumed on a **personal browser** (or VS Code for hands-on labs) — not via in-tenant Copilot, since the State tenant Copilot can't browse the web

---

## How training is structured

Training is delivered in three layers per role. This playlist is layer 1 only.

| Layer | What | Format | Owner |
|-------|------|--------|-------|
| **1. Pre-work** | Self-paced learning of the curated playlist below | Personal time, ~2–3h per role | Each participant |
| **2. Working session** | Collaborative session with the AI enablement team — explore how AI fits into real role-specific workflows, walk through actual use cases, and update the runbook based on what we learn together | Live, working session (not lecture), ~2–3h per role | AI enablement team + pilot team |
| **3. Office hours** | Open Q&A and applied support during the pilot sprints | 30 min/week per role | AI enablement team |

The **working session** is the heart of training — it isn't an instructor-led class. The AI enablement team and the pilot team work side by side on real ILC artifacts, surface specific use cases, refine the role's runbook (playbook) based on what works, and capture anti-patterns to avoid.

---

## GCC availability notes (May 2026) — read first

**This affects what we can actually demo in working sessions:**

| Tool / Feature | GCC (regular) | GCC-High | Source |
|----------------|---------------|----------|--------|
| **Microsoft 365 Copilot Chat** | ✅ Available | ✅ Available | [Microsoft Public Sector Blog](https://techcommunity.microsoft.com/blog/publicsectorblog/continuing-our-momentum-expanding-microsoft-365-copilot-capabilities-across-u-s-/4506954) |
| **M365 Copilot in Word / Excel / PowerPoint (agentic)** | ⚠️ Partial — rolling out | ✅ Available (Dec 2025) | [Microsoft GCC-High announcement](https://techcommunity.microsoft.com/blog/publicsectorblog/microsoft-365-copilot-is-now-available-in-gcc-high/4473310) |
| **Power BI Copilot** | ❌ **NOT supported** — GPU availability | ❌ NOT supported | [Power BI for US Government](https://learn.microsoft.com/en-us/fabric/enterprise/powerbi/service-government-us-overview) |
| **Power Automate Copilot** | ✅ Confirmed enabled Apr 23 | — | DCFS tenant walkthrough |
| **Power Apps Copilot for tables** | ✅ Confirmed enabled Apr 23 | — | DCFS tenant walkthrough |
| **Power Apps form-designer Copilot** | ❌ NOT enabled | — | DCFS tenant walkthrough |
| **GitHub Copilot** | ⚠️ Licensed, not yet provisioned for our team | — | DoIT enablement pending |
| **D365 Copilot** | ❌ Not enabled in tenant | — | Microsoft engagement in flight to clarify GCC availability |
| **Copilot Studio + Agent Builder** | ✅ Available (Apr 2026) | ✅ Available | [Microsoft Adoption GCC](https://adoption.microsoft.com/en-us/copilot/gcc/) |
| **Atlassian Rovo** | ✅ Enabled | — | DCFS tenant walkthrough |

---

## Module 0a — AI Fundamentals (everyone, ~75 min)

**Goal:** baseline AI literacy. Every participant — from leadership to BA to dev — should understand the basics of what generative AI is, how an LLM produces output, what it's good at, and what it isn't, before touching a tool.

### Must-watch core

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 1 | [Microsoft Learn — Introduction to generative AI and agents](https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/) | 30 min | LLMs, prompts, agents — the foundational concepts |
| 2 | [Microsoft Learn — Introduction to generative AI: Exploring the basics](https://learn.microsoft.com/en-us/training/modules/intro-generative-ai-explore-basics/) | 20 min | Hands-on framing with Microsoft Copilot examples |
| 3 | [Microsoft Learn — AI fluency: Explore generative AI](https://learn.microsoft.com/en-us/training/modules/explore-generative-ai/) | 25 min | What's changing about creativity & productivity work |

### Stretch picks

- [Generative AI for Beginners (Microsoft, 21 lessons, free, self-paced)](https://microsoft.github.io/generative-ai-for-beginners/) — full curriculum if someone wants to go deep; available as [GitHub repo](https://github.com/microsoft/generative-ai-for-beginners)
- [AI for Beginners (Microsoft, 12 weeks, 24 lessons)](https://github.com/microsoft/AI-For-Beginners) — broader AI/ML for those who want the wider field

---

## Track 0 — DoIT AI Policy & Governance (mandatory gate, ~45 min)

**Goal:** every participant can articulate boundary rules before getting a tool license.

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 1 | [State of Illinois — DoIT Policy on the Acceptable and Responsible Use of AI (v2)](https://doit.illinois.gov/content/dam/soi/en/web/doit/documents/support/policies/2021/20250401-DoIT-AI%20Policy-v2-%20A11Y.pdf) | 25 min | Authoritative State of Illinois policy |
| 2 | [Illinois Generative AI and NLP Task Force Report (Dec 2024)](https://doit.illinois.gov/content/dam/soi/en/web/doit/meetings/ai-taskforce/reports/20241220-gen-ai-task-force-report.pdf) | 15 min | State context on GenAI risks (civil rights, labor, consumer protection) |
| 3 | [NIST AI RMF Playbook overview](https://airc.nist.gov/airmf-resources/playbook/) | 15 min | GOVERN / MAP / MEASURE / MANAGE structure we'll reference repeatedly |

### Reference shelf

- [NIST AI Risk Management Framework — full landing](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST Generative AI Profile (AI 600-1) — full PDF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) — 200+ suggested actions, 12 GenAI-specific risks
- [Microsoft Responsible AI principles](https://www.microsoft.com/en-us/ai/principles-and-approach)
- [GitHub Copilot Trust Center](https://resources.github.com/copilot-trust-center/) — IP, data, audit

---

## Foundation — Prompt Engineering (everyone, ~75 min)

**Goal:** baseline prompt literacy. The CSCI pattern: Clear goal, Specific Source, Contextual framing, Iterative refinement.

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 1 | [Microsoft Learn — Introduction to Microsoft 365 Copilot](https://learn.microsoft.com/en-us/training/modules/introduction-microsoft-365-copilot/) | 30 min | What M365 Copilot does + responsible AI framing |
| 2 | [Microsoft Learn — Craft effective prompts for Microsoft 365 Copilot (path)](https://learn.microsoft.com/en-us/training/paths/craft-effective-prompts-copilot-microsoft-365/) | 25 min (first module) | Clear goal / context / source / expectation pattern |
| 3 | [Microsoft Learn — Introduction to prompt engineering with GitHub Copilot](https://learn.microsoft.com/en-us/training/modules/introduction-prompt-engineering-with-github-copilot/) | 20 min | Prompt engineering core principles in IDE context |

### Reference shelf

- [Microsoft Research — Prompt Engineering: Improving our Ability to Communicate with an LLM](https://www.microsoft.com/en-us/research/group/dynamics-insights-apps-artificial-intelligence-machine-learning/articles/prompt-engineering-improving-our-ability-to-communicate-with-an-llm/) — research-grade depth
- [DAIR.AI Prompt Engineering Guide](https://www.promptingguide.ai/) — vendor-neutral comprehensive reference
- [Microsoft 365 Copilot Prompts Gallery](https://m365.cloud.microsoft/copilot-prompts) — copyable, role-tagged prompts

---

## Foundation+ — Context Engineering & Grounding (everyone, ~45 min)

**Goal:** understand why **context matters more than prompt cleverness**. Every Copilot answer is the result of: system instructions + prior conversation + retrieved/grounded content + user prompt — all squeezed into a finite context window. Misunderstanding this is the #1 source of "Copilot got it wrong" complaints.

### Must-watch core

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 1 | [Microsoft Tech Community — Grounding LLMs](https://techcommunity.microsoft.com/blog/fasttrackforazureblog/grounding-llms/3843857) | 15 min | What grounding is, why it matters for accuracy + governance |
| 2 | [Microsoft Learn — How Copilot in Microsoft Fabric works](https://learn.microsoft.com/en-us/fabric/fundamentals/how-copilot-works) | 15 min | Anatomy of a Copilot answer — system, retrieval, prompt, response |
| 3 | [Copilot Context Windows: What They Are & How to Manage Them](https://www.futuresavvy.co.uk/tips-tricks/understanding-and-managing-context-windows-how-to-keep-your-copilot-conversations-focused) | 15 min | Practical: managing long conversations + when to start fresh |

### Stretch picks

- [The New Stack — Context Engineering: Going Beyond Prompt Engineering and RAG](https://thenewstack.io/context-engineering-going-beyond-prompt-engineering-and-rag/) — the broader discipline (system instructions + retrieval + memory + placement + format)
- [Microsoft Learn — Develop a RAG-based solution with your own data using Microsoft Foundry](https://learn.microsoft.com/en-us/training/modules/build-copilot-ai-studio/) — hands-on RAG (for Solution Architects + Configuration Team)
- [Microsoft Learn — Enhance AI responses with RAG in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/retrieval-augmented-generation) — practical RAG application
- [What is Context Engineering? (Elastic)](https://www.elastic.co/what-is/context-engineering) — architecting reliable AI

### Key takeaways (will reinforce in Foundation session)

- **M365 Copilot in DCFS grounds on the Microsoft Graph** — your accessible Teams, SharePoint, OneDrive, Outlook content. Not the web. Not other tenants.
- **Rovo grounds on JIRA + Confluence** in your instance.
- **GitHub Copilot grounds on the open repo + your prompt context** — not on closed/external repos.
- **Context windows are finite.** Long chat histories and verbose prompts crowd out retrieved content. Start fresh conversations when topic shifts.

---

## Internal Playbooks & Runbooks (everyone — required reference, ~30 min)

> DCFS-specific playbooks built for this engagement. Every role gets a copy of their own playbook + the cross-role policies before going live with tools. Links resolve relative to this HTML file &mdash; place the playbook files in the same folder as this document (e.g. your Downloads folder) and the links will open them directly.

| # | Resource | Audience | Purpose |
|---|----------|----------|---------|
| 1 | [BA Playbook](playbook-ba-v20260421.docx) | BA-Technical | Workflow steps + PII warning blocks |
| 2 | [Developer Playbook](playbook-developer-v20260427.docx) | Developer | Tool usage + HITL checkpoints |
| 3 | [Tester Playbook](playbook-tester-v20260427.docx) | Tester | Test case workflow + PII-safe test data |
| 4 | [Data Playbook](playbook-data-v20260421.docx) | Data Team | Data handling + AI Data Mapping use |
| 5 | [Testing Services Lead Playbook](playbook-testing-services-lead-v20260422.docx) | TSL | Reporting + escalation runbook |
| 6 | [Pilot Governance Charter](pilot-governance-charter-v20260428.docx) | All | Governance cadence, escalations, decision rights |
| 7 | [Tool Authorization List](tool-authorization-list.docx) | All | What's authorized, what's pending, scope rules |
| 8 | [Compliance Map (DoIT Policy → NIST AI RMF → our controls)](compliance-map-v20260422.docx) | All (mandatory) | Cross-walk used in Track 0 |

### Key playbook habits everyone learns

- **HITL discipline.** Every AI output gets human review before it lands anywhere durable (JIRA, code, Confluence, email).
- **PII never leaves the tenant.** No client data, case data, or personal info in prompts to any AI.
- **Escalation runbook.** If an AI surfaces something concerning (PII exposure, hallucinated client info, biased output) &mdash; there's a documented path. (Pilot Gov Lead first.)
- **Audit log discipline.** Use the State Copilot &mdash; not personal tools. State tools log; personal tools don't.

---

## Role 1: BA-Technical Playlist (~2h pre-work)

**Tools used:** Atlassian Rovo (JIRA + Confluence), M365 Copilot Chat
**Use cases:** AC drafting, user story refinement, requirements extraction, Confluence summarization

### Must-watch core

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 1 | [Atlassian — Get started with Rovo AI (free quick-start)](https://community.atlassian.com/learning/course/get-started-quickly-with-rovo) | 60 min | Free live-instructor class; earns the Rovo Fundamentals certificate |
| 2 | [Atlassian — Get the most out of Rovo (free path)](https://community.atlassian.com/learning/path/get-the-most-out-of-rovo) | 45 min | Search, chat, agents across Atlassian + connected apps |
| 3 | [Atlassian Support — Use Rovo to write or edit content in Jira](https://support.atlassian.com/jira-software-cloud/docs/use-atlassian-intelligence-to-help-write-or-edit-content/) | 15 min | The actual JIRA workflow we'll use in lab |

### Stretch picks

- [Atlassian Support — Check acceptance criteria in a code review](https://support.atlassian.com/rovo/docs/check-acceptance-criteria-in-a-code-review/) — AC verification workflow
- [Atlassian University — full catalog](https://university.atlassian.com/student/catalog/list) — search "AI" or "Rovo"

### Reference shelf

- [Atlassian Community — Rovo articles](https://community.atlassian.com/forums/Atlassian-AI-Rovo-articles)
- [Rovo for QA — designing test cases in JIRA](https://community.atlassian.com/forums/App-Central-articles/Atlassian-Rovo-in-QA-Instantly-Designing-Test-Cases-in-Jira-with/ba-p/3144170) — useful for BAs writing testable ACs

---

## Role 2: Developer Playlist (~3h pre-work)

**Tools used:** GitHub Copilot, Power Automate Copilot, Power Apps Copilot for tables, (eventually) D365 Copilot
**Use cases:** code generation, unit test scaffolding, refactoring, flow drafting, eventual D365 X++ / plugin / PCF work

> ⚠️ GitHub Copilot is licensed but **not yet provisioned** for our GCC environment. Pre-work uses personal-account GitHub Copilot or the GitHub Skills sandbox.
> ⚠️ D365 Copilot is **not enabled in our tenant**. Microsoft engagement in flight to clarify GCC availability. Pre-work in this section is "what to expect when it lands."

### Must-watch core

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 1 | [Microsoft Learn — Introduction to GitHub Copilot](https://learn.microsoft.com/en-us/training/modules/introduction-to-github-copilot/) | 45 min | Authoritative intro; Individual/Business/Enterprise tiers |
| 2 | [Microsoft Learn — GitHub Copilot Fundamentals (path, Part 1 of 2)](https://learn.microsoft.com/en-us/training/paths/copilot/) | 60 min | Full fundamentals path |
| 3 | [Microsoft Learn — Develop Unit Tests using GitHub Copilot Tools](https://learn.microsoft.com/en-us/training/modules/develop-unit-tests-using-github-copilot-tools/) | 30 min | xUnit / test generation labs |
| 4 | [GitHub Docs — Writing tests with GitHub Copilot](https://docs.github.com/en/copilot/tutorials/write-tests) | 20 min | Official tutorial — patterns for unit/integration tests |
| 5 | [Microsoft Learn — Use Copilot in Power Automate](https://learn.microsoft.com/en-us/training/modules/use-copilot-power-automate/) | 30 min | Maker-side flow drafting — confirmed-enabled GCC tool |

### Microsoft Dynamics 365 AI deep dive (~60 min)

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 6 | [Microsoft Learn — Agents, Copilot, and AI capabilities in Dynamics 365 apps](https://learn.microsoft.com/en-us/dynamics365/copilot/) | 25 min | Full D365 Copilot capability landscape — what's in each module |
| 7 | [Microsoft Learn — Get started with Copilot for Microsoft Power Platform (path)](https://learn.microsoft.com/en-us/training/paths/copilot-power-platform/) | 25 min | Power Platform AI for makers (Apps, Automate, Pages, Dataverse) |
| 8 | [Microsoft Copilot Developer Camp](https://microsoft.github.io/copilot-camp/) | 30 min (self-paced; pick relevant chapters) | Extending Copilot — for devs who build agents / connectors |

### Stretch picks

- [Microsoft Learn — Create Power Platform solutions with AI and Copilot](https://learn.microsoft.com/en-us/training/paths/copilot-solutions/) — solution-level patterns
- [Microsoft Learn — GitHub Copilot Bootcamp (show)](https://learn.microsoft.com/en-us/shows/github-copilot-bootcamp/prompt-engineering-with-github-copilot) — deeper prompt engineering for code
- [GitHub — Copilot CLI for Beginners (8-chapter hands-on)](https://github.com/github/copilot-cli-for-beginners)

### Reference shelf

- [GitHub Copilot Chat cheat sheet (slash commands)](https://docs.github.com/en/copilot/github-copilot-chat-cheat-sheet) — printable
- [GitHub Docs — Generating unit tests (cookbook)](https://docs.github.com/en/copilot/tutorials/copilot-chat-cookbook/testing-code/generate-unit-tests)
- [GitHub Copilot Trust Center](https://resources.github.com/copilot-trust-center/)

---

## Role 3: Tester Playlist (~2.5h pre-work)

**Tools used:** Atlassian Rovo, GitHub Copilot (if writing automation), Zephyr Scale, M365 Copilot Chat

### Must-watch core

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 1 | [Atlassian — Get started with Rovo AI (free quick-start)](https://community.atlassian.com/learning/course/get-started-quickly-with-rovo) | 60 min | Foundation cert |
| 2 | [Atlassian Community — Rovo in QA: Designing Test Cases in JIRA](https://community.atlassian.com/forums/App-Central-articles/Atlassian-Rovo-in-QA-Instantly-Designing-Test-Cases-in-Jira-with/ba-p/3144170) | 20 min | Exact pattern: requirement → positive / negative / boundary cases |
| 3 | [Atlassian Community — From User Story to Automated Test Execution](https://community.atlassian.com/forums/App-Central-articles/From-User-Story-to-Automated-Test-Execution-A-Virtuous-AI-Cycle/ba-p/3206564) | 25 min | End-to-end pattern incl. Zephyr integration |
| 4 | [Microsoft Learn — Work Smarter In Excel With Copilot Chat](https://learn.microsoft.com/en-us/training/modules/work-smarter-excel/) | 30 min | Test execution summary reports |
| 5 | [Atlassian Workshop — Build an AI Agent with Rovo (hands-on)](https://university.atlassian.com/student/page/2803560-how-to-build-an-ai-agent-with-rovo) | 30 min | Free hands-on Rovo agent building |

### Stretch picks (if tester writes automation)

- [Microsoft Learn — Develop Unit Tests using GitHub Copilot Tools](https://learn.microsoft.com/en-us/training/modules/develop-unit-tests-using-github-copilot-tools/)
- [GitHub Docs — Writing tests with GitHub Copilot](https://docs.github.com/en/copilot/tutorials/write-tests)

### Reference shelf

- [Using Rovo in JIRA — optimize test cases and tickets](https://blog.nashtechglobal.com/using-rovo-in-jira-optimize-test-cases-and-tickets/)
- [Atlassian Rovo Agents overview](https://www.atlassian.com/software/rovo/agents)

---

## Role 4: Solution Architect Playlist (~3h pre-work)

**Tools used:** M365 Copilot Chat, Copilot in Word/Excel/PowerPoint (GCC parity rolling), Rovo (Confluence)

> ⚠️ Power BI Copilot NOT supported in GCC. SAs use JIRA dashboards + Excel Copilot for metrics views.

### Must-watch core

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 1 | [Microsoft Learn — Craft effective prompts for M365 Copilot (full path)](https://learn.microsoft.com/en-us/training/paths/craft-effective-prompts-copilot-microsoft-365/) | 90 min | Prompt engineering across Word/Excel/PPT/Teams/Outlook |
| 2 | [Microsoft Learn — Build effective presentations with AI (PowerPoint)](https://learn.microsoft.com/en-us/training/modules/present-copilot-microsoft-powerpoint/) | 30 min | Stakeholder design decks |
| 3 | [Microsoft Learn — Work Smarter In Excel With Copilot Chat](https://learn.microsoft.com/en-us/training/modules/work-smarter-excel/) | 30 min | Options analysis tables |
| 4 | [Atlassian — Get the most out of Rovo](https://community.atlassian.com/learning/path/get-the-most-out-of-rovo) | 45 min | Confluence ADR drafting + cross-app search |

### Stretch picks

- [Microsoft Learn — Develop a RAG-based solution with your own data (Foundry)](https://learn.microsoft.com/en-us/training/modules/build-copilot-ai-studio/) — for architecture work involving grounding
- [Microsoft Federal Business Applications — Copilot whitepaper](https://github.com/microsoft/Federal-Business-Applications/blob/main/whitepapers/copilot/README.md) — federal-tier deployment + security architecture
- [Microsoft Adoption — Copilot for US Government (GCC)](https://adoption.microsoft.com/en-us/copilot/gcc/) — government adoption playbook

### Reference shelf

- [Microsoft 365 Copilot Prompts Gallery](https://m365.cloud.microsoft/copilot-prompts) — filter for architect-relevant prompts
- [NIST AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/)
- [Microsoft 365 and Copilot for Government](https://www.microsoft.com/en-us/microsoft-365/government)

---

## Role 5: Testing Services Lead Playlist (~2.5h pre-work)

**Tools used:** Atlassian Rovo + dashboards, M365 Copilot Chat, JIRA Dashboards, Excel Copilot

### Must-watch core

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 1 | [Atlassian — Get started with Rovo AI (free quick-start)](https://community.atlassian.com/learning/course/get-started-quickly-with-rovo) | 60 min | Foundation cert |
| 2 | [Atlassian — Get the most out of Rovo](https://community.atlassian.com/learning/path/get-the-most-out-of-rovo) | 45 min | Cross-app summarization at scale |
| 3 | [Microsoft Learn — Work Smarter In Excel With Copilot Chat](https://learn.microsoft.com/en-us/training/modules/work-smarter-excel/) | 30 min | Sprint quality reports, capacity modeling |
| 4 | [Atlassian Support — Configure a JIRA dashboard](https://support.atlassian.com/jira-software-cloud/docs/configure-a-dashboard/) | 15 min | Test execution dashboards (replaces Power BI) |

### Stretch picks

- [Atlassian Rovo Agents](https://www.atlassian.com/software/rovo/agents) — quality / testing agents

### Measurement references — keep handy (not required training)

For when you need to interpret pilot signals or frame our own metrics — read on demand, not as pre-work:

- [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/) — industry baseline for AI productivity
- [DORA Insights — Balancing AI tensions](https://dora.dev/insights/balancing-ai-tensions/) — throughput up + stability fluctuation pattern
- [Swarmia — DORA, SPACE, and DX Core 4 comparison](https://www.swarmia.com/blog/comparing-developer-productivity-frameworks/) — framework selection
- [DZone — SPACE Framework in the AI Era](https://dzone.com/articles/space-framework-ai-developer-productivity)

---

## Role 6: Leadership Briefing Playlist (~1.5h pre-work)

**Audience:** DCFS and Krasan leadership / executive sponsors
**Goal:** understand the dashboard, the risks, how to read pilot signals, the governance frame

### Must-watch core

| # | Resource | Duration | Why |
|---|----------|----------|-----|
| 1 | [NIST — AI Risk Management Framework landing](https://www.nist.gov/itl/ai-risk-management-framework) | 15 min | Executive framing for AI governance |
| 2 | [Microsoft — M365 and Copilot for Government overview](https://www.microsoft.com/en-us/microsoft-365/government) | 15 min | Vendor's government posture |
| 3 | [Microsoft Adoption — Copilot for US Government (GCC)](https://adoption.microsoft.com/en-us/copilot/gcc/) | 20 min | Adoption frameworks + free expert sessions |
| 4 | [DORA — State of AI-assisted Software Development 2025 (Executive Summary section)](https://cloud.google.com/resources/content/2025-dora-ai-assisted-software-development-report) | 20 min | Industry research on what AI adoption actually delivers |
| 5 | [Illinois Generative AI and NLP Task Force Report (Dec 2024)](https://doit.illinois.gov/content/dam/soi/en/web/doit/meetings/ai-taskforce/reports/20241220-gen-ai-task-force-report.pdf) | 15 min | State-level GenAI policy context |

### Stretch picks

- [NIST Generative AI Profile (AI 600-1) — Executive Summary section](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) — 12 GenAI-specific risks framed for execs
- [Microsoft Public Sector Blog — Copilot in U.S. Government clouds](https://techcommunity.microsoft.com/blog/publicsectorblog/continuing-our-momentum-expanding-microsoft-365-copilot-capabilities-across-u-s-/4506954) — current GCC roadmap

---

## Coverage matrix — which topic in which role

| Topic | Everyone | BA | Dev | Tester | SA | TSL | Lead |
|-------|----------|----|----|-------|----|----|----|
| AI fundamentals (what is gen AI / LLMs) | ✅ (Module 0a) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| DoIT AI Policy + NIST AI RMF | ✅ (Track 0) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Prompt engineering basics | ✅ (Foundation) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Context engineering / grounding | ✅ (Foundation+) | ✅ | ✅ | ✅ | ✅ (depth) | ✅ | ✅ (overview) |
| Internal playbooks + runbooks | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Atlassian Rovo (JIRA + Confluence) | — | ✅ | — | ✅ | ✅ | ✅ | — |
| GitHub Copilot (code) | — | — | ✅ | (stretch) | — | — | — |
| Power Automate / Power Apps Copilot | — | — | ✅ | — | — | — | — |
| Microsoft Dynamics 365 AI | — | — | ✅ | — | (stretch) | — | — |
| M365 Copilot (Word/Excel/PPT) | — | (touch) | (touch) | (touch) | ✅ | ✅ | (touch) |
| Measurement (DORA / SPACE / DX) | — | — | — | — | (stretch) | (reference) | ✅ |
| Government cloud (GCC) specifics | — | — | ✅ | — | ✅ | — | ✅ |
