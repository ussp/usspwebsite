# Meeting Summary — Atlassian Tools Sync (JIRA / Rovo / workflow)

- **Date:** 2026-04-14 (afternoon, 2:20 PM CT)
- **Type:** Team discovery (DCFS shared services)
- **Raw transcript:** [raw/2026-04-14-pm-atlassian-tools.txt](raw/2026-04-14-pm-atlassian-tools.txt)
- **Attendees:** Matt Tomeo (RTE), Carl Oberg (Platform Operations Lead — DCFS), Vinay Kumar (JIRA admin, Krasan), Vinay Lagisetty (Krasan)
- **Duration:** ~42 min

## Purpose
Walk through current JIRA/Atlassian workflow, Rovo capabilities, testing tools. Capture tool gaps and AI use cases.

## Key facts captured
- **Rovo is already enabled** (bundled into Atlassian) — but *tier unknown*. Multiple tiers exist (~$17/user/mo for next tier). Currently useful as an orchestration/connector layer across JIRA + Confluence + Bitbucket; generative creation inside JIRA is limited in current tier.
- **Carl Oberg owns 5 teams** under Platform Operations: Azure Power Platform, JIRA admins, ECM/FileNet/DataCap, IMS/DB2, mainframe. Not part of sprint teams but cross-cutting.
- **Zephyr Scale** (JIRA plugin) holds test cases + runs — manually loaded today.
- **Eggplant** is being rolled out for automated/smoke testing.
- **UAT deployments:** Carl's team handles UAT + prod deployments.
- **Currently in production:** FPR, CWEL, Intake.
- **Current JIRA structure:** 15 separate team boards, no program-level epic board. Matt tracks dependencies in spreadsheets → PowerPoint (painful).
- **Big Picture** plugin is at *base tier* — needs upgrade for program-level reporting.
- **Workflow (current state being simplified):** planning board (refinement) → team scrum boards (sprint) → acceptance/completion → UAT/prod deployment via shared services.
- **Carl already uses AI informally:** pulls meeting transcripts, summaries, cue points; uses AI for PIRs, release notes, user-story drafts.

## Decisions / Outcomes
- Agreed story points are NOT a valid efficiency metric (they shrink as AI accelerates sizing).
- Carl's framing accepted: use "AI-enhanced Definition of Done" and compare before/after on test coverage, documentation ratio, quality gates, smoke-test automation.

## Action items
| # | Item | Owner | Notes |
|---|------|-------|-------|
| 1 | Identify Rovo tier DCFS currently holds | Matt / Carl | Determines whether Rovo can generate vs. only orchestrate |
| 2 | Send list of desired tool access (BigPicture upgrade, plugins) to Vinay | Matt + Carl | Feed into tool authorization list |
| 3 | Separate working session to detail AI use cases per role | Matt + Carl + Vinay | Post-baselining |
| 4 | Vinay to send 13→20 week plan to team Thursday | Vinay | Baselining prep |

## Findings that affect the plan
- **Rovo tier is unknown** — material to training strategy. Lower tier limits how much of the BA/Tester tracks can rely on it.
- **Program-level epic board is a structural prerequisite** for any program-level efficiency measurement. This is not AI, but it unblocks measurement. Flag as adjacent work.
- **No Google-model access yet** (Vinay Kumar: "we're not Google-certified in DCFS, we're Copilot"). Approved models appear to be OpenAI via GitHub Copilot; confirm.
- **Human-in-the-loop is already understood as doctrine** — Carl reinforced multiple times. Good alignment with DoIT policy.
- **Story-writing agent idea** (Vinay Kumar): vertex-style agent for BA story consistency. Good candidate for a pilot use case, but needs closed-loop training on DCFS context — longer horizon than 13 weeks.

## New risks / items for register
- **R-NEW-1:** Rovo tier insufficient → BA/Tester tracks rely on generative features that don't exist in our tier. Mitigation: confirm tier this week; adjust training or request upgrade.
- **R-NEW-2:** BigPicture base tier → no reliable dependency/epic reporting → measurement of cross-team efficiency is manual. Flag as a measurement dependency, not a blocker for pilot.

## People added to directory
- **Matt Tomeo** — Release Train Engineer (RTE), Krasan. Confirmed as joint owner of JIRA baseline analysis.
- **Carl Oberg** — Platform Operations Lead (DCFS). Former JIRA admin; AI-aware; leads deployment to UAT/prod.
- **Vinay Kumar** — JIRA admin (Krasan side). Previously paid JIRA invoices — familiar with licensing cost dynamics.
