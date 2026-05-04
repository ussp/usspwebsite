# Meeting Summary — DCFS Architecture High-Level Walkthrough

- **Date:** 2026-04-16
- **Type:** Team discovery (DCFS shared services / enterprise architecture)
- **Raw transcript:** [raw/2026-04-16-architecture-walkthrough.txt](raw/2026-04-16-architecture-walkthrough.txt)
- **Attendees:** Shyamsundar Venkataraman (Enterprise Architect, Shared Services), Kashif Ali (Enterprise Architect, Shared Services), Krishna Mekala (Krasan), Vinay Lagisetty (Krasan)
- **Missing:** Jeff Lobo (on leave, returning next day)
- **Duration:** ~41 min

## Purpose
Understand enterprise architecture, where arch review happens in the SDLC, tools used, opportunities for AI augmentation.

## Key facts captured
- **Target system:** Illinois Connect — Dynamics 365 + Dataverse, retiring 3 legacy platforms. Modular child-welfare case management.
- **Domains/modules:** intake, investigations, family services (intact), permanency, provider licensing. Each has own business logic but cross-linked.
- **Integration layer (business):** courts, providers, address validation, identity services, Adobe Sign.
- **Integration layer (technical):** Azure API Management (internal + external consumers).
- **Data & analytics:** Azure Data Factory, Databricks, SQL Server, Data Lake, Power BI.
- **Arch governance:** Each product team has a solution architect. Pre-ARB board (Shyam + Kashif + Maximus architects) → formal ARB board.
- **Arch cadence:** Designs should be ready pre-PI; reality is sprint-level ongoing refinement.
- **Tools:** Visio (diagramming standard — attached to Confluence as image, not live), SDD in Word, SharePoint as version control, Confluence for overall content + approvals.
- **Code that exists:** plugins, APIs, logic apps, function apps in Azure (shared services acknowledges these are AI-speedup candidates — not just configuration).
- **Team locations:** Shyam — Pacific; Kashif — Central (Houston); Krishna — Central (Illinois); Jeff — Eastern.
- **Maximus** (50% federally funded): third-party auditor. Verifies process adherence, maturity model, required artifacts (DevOps strategy, test strategy, ARB docs). Docs primarily from shared services + IT teams.

## Decisions / Outcomes
- Scope confirmed: AI rollout is **SDLC acceleration only** — no change to business/domain logic. Architects welcome SDLC improvement suggestions.
- Architects will come back with proposed AI use cases on their side (plugins, APIs, logic apps).

## Action items
| # | Item | Owner | Notes |
|---|------|-------|-------|
| 1 | Shyam + Kashif to surface AI use-case ideas (plugins/APIs/logic/function apps) | Shyam + Kashif | Back to Vinay in a follow-up |
| 2 | Get list of Maximus-required documents from Jeff | Krishna/Jeff | Determine AI authoring/maintenance opportunities |
| 3 | Vinay to share tool doc + next-step planning with architects | Vinay | After governance is settled |
| 4 | Resolve Krasan email/Teams access for Vinay (Shyam saw Vinay in Krasan Teams) | Robert | Unblocks collaboration |

## Findings that affect the plan
- **Claude is NOT approved.** Approved stack: GitHub Copilot, Microsoft Copilot, Dynamics 365 Copilot. Models: OpenAI and Google via Copilot; Claude is out.
- **30-day DoIT notice:** Vinay's understanding — notification only, not approval. Went out "this Tuesday" (April 14).
- **Visio-as-image-in-Confluence** is a measurable content-search gap. Mermaid or equivalent would unlock AI readability. Candidate for Architect pilot use case (but may be a standards change, not in scope here).
- **Maximus artifact workflow** is a strong document-authoring AI use case (versioning, comments, cross-doc consistency). Microsoft 365 Copilot fits.
- **Plugins / APIs / logic apps / function apps = the real code** in DCFS. This validates Developer track assumption that GitHub Copilot has runway on Azure-side code even though much is configuration.
- **Pre-ARB board** is an architecture review checkpoint that could benefit from AI-assisted SDD consistency/completeness checks — add to arch use case shortlist.

## New items for assumptions register
- **A-NEW:** Microsoft Copilot (M365) and Dynamics 365 Copilot licenses status — unknown. Need confirmation (like Copilot) from Dave.
- **Validates A-06:** Claude is NOT approved — move from "Assumed" to "Validated."

## People added to directory
- **Shyamsundar Venkataraman** — Enterprise Architect, Shared Services (Pacific time). Oversees all 10-12 teams.
- **Kashif Ali** — Enterprise Architect, Shared Services (Houston/Central). Cross-cutting with Shyam.
- **Maximus** — federal auditor (50% federal funding). Process + maturity model verification.
