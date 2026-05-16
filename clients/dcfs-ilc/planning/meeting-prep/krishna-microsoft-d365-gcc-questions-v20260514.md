# Krishna — Microsoft D365 GCC: Technical Capability & Availability Questions

> **Date:** May 14, 2026
> **For:** Krishna Mekala — upcoming conversation with Microsoft
> **Purpose:** Get clarity from Microsoft on **what Dynamics 365 AI can technically do** and **what is actually available in our GCC tenant** today. Enablement path and licensing/cost are intentionally **parked** for a follow-up conversation — focus is technical capability + availability only.
> **Status:** Draft — Krishna to refine before MS conversation

---

## Background to set with Microsoft

- **DCFS / ILC AI Pilot:** initiating an AI augmentation pilot for our product teams (Scrum-aligned, ~12 teams, ~160 consultants).
- **Tenant:** State of Illinois GCC (Government Community Cloud).
- **Current observation (per DoIT, May 1):** D365 Copilot is **not enabled** in our environment today.
- **What we need from this call:** a clear technical picture of (a) what D365 AI/Copilot is capable of, and (b) which of those capabilities are technically available in GCC and our tenant. We are **not** discussing licensing, pricing, or enablement procedure in this conversation — that's a separate track.

---

## Section 1: What CAN Dynamics 365 do with AI today? (Capability)

We want to scope the realistic AI capability surface across D365 before we make any internal decisions.

1. What are the **current D365 Copilot and AI features** available across the product family (Customer Service, Field Service, Sales, Finance & Ops, Project Operations) — categorized by:
   - **Maker / configuration AI** (table generation, form generation, expression editing, model-driven app Copilot, etc.)
   - **Business-user / end-user AI** (Service Agent, case summarization, email drafting, etc.)
   - **Admin / governance AI** (impact analysis, audit assistance)
2. Which of these are **GA today** vs. preview / coming soon?
3. Are there **AI Builder** capabilities (document processing, form processing, prediction models) that overlap or complement Copilot? What can it technically do?
4. For each feature, what's the **input/output behavior** — e.g., does it generate code, generate configuration, generate natural language, surface insights, automate a workflow? We want to map capability to our pilot roles.

---

## Section 2: GCC parity — what is and isn't technically available in GCC

This is the critical block. We need to understand the technical state of D365 AI in GCC vs. commercial, separately from any tenant-side configuration.

5. Provide the **complete list of Dynamics 365 Copilot / AI features technically available in GCC** today (not commercial), with the commercial-only features called out separately.
6. Which D365 AI features are **roadmapped for GCC** but not yet released? Approximate target windows (quarter / wave) for each?
7. For each maker-side Copilot feature (Power Apps table Copilot, form-designer Copilot, model-driven Copilot, Power Automate Copilot, expression editing) — is it **available at the GCC datacenter level** for our region?
8. We have **observed asymmetry** in our own tenant via the `make.gov.powerautomate.us` walkthrough on Apr 23:
   - ✅ Power Automate Copilot works
   - ✅ Power Apps Copilot for tables works
   - ❌ Power Apps form-designer Copilot does NOT work
   Is this expected GCC behavior (feature not yet in GCC) or a tenant-side state issue?
9. Are there **regional or datacenter-specific** AI feature differences within GCC? (Some features rolling out by datacenter wave?)
10. Are there features that exist in **commercial** but will likely **never come to GCC** (or have no committed roadmap)? We'd rather know now than design around something that won't land.

---

## Section 3: What's technically reachable in DCFS's tenant today

11. Can Microsoft share / pull what D365 AI / Copilot features are **technically reachable** in the DCFS tenant (or the broader State of Illinois GCC tenant DCFS sits under) — regardless of whether they're "turned on"?
12. What's the technical distinction between **"present in the tenant"** vs. **"feature switch enabled"** for D365 Copilot? When Bill says "none of those are enabled," does that mean the features are absent from the tenant, or present but switched off?
13. Are there any AI features that are **on by default** in a D365 tenant that we may already have access to and not be aware of?
14. Is there a way for us to **inspect from the tenant side** what AI surfaces are technically available without going through Microsoft each time?

---

## Section 4: Data, audit, and technical boundary (capability posture)

This is technical, not procedural — we need to understand how the features behave, not what governance steps apply.

15. For each D365 AI feature in GCC, confirm the **data boundary**: where does prompt and grounding data flow? Stays in GCC, or does any flow to commercial / cross-boundary?
16. **Prompt visibility for governance** — if a user invokes Copilot, can the State / DCFS admin see **the actual prompt text the user submitted**, the **AI response returned**, and the **grounding sources used**? For each Copilot surface (D365 maker, model-driven, Power Automate, Power Apps, AI Builder), confirm:
    - Are prompts captured in an admin-accessible log?
    - Are AI responses captured alongside the prompt?
    - Where do these logs live (Purview audit log, Power Platform admin center, Dataverse audit, Azure Monitor, somewhere else)?
    - **Retention period** for prompt/response logs?
    - **Exportability** — can we pull these for a governance review or AI Policy §6 audit?
    - **Per-user breakdown** — can we attribute every prompt to a named user (AD identity)?
17. What **admin-side audit / telemetry surface** is technically available for D365 Copilot in GCC beyond prompt content — usage counts, feature adoption metrics, error rates?
18. Does **Microsoft Purview** integration with D365 Copilot work the same way in GCC as commercial — technically? Specifically, does Purview's **Copilot prompt and response audit** surface exist in GCC?
19. Are there **DLP (Data Loss Prevention)** capabilities for Copilot in GCC that work at the feature level — and do they apply to prompt content (blocking sensitive data in user prompts)?
20. For Copilot features that **ground on Dataverse data** — what's the technical scope? Per-environment, per-table, per-row security inheritance?

---

## Section 5: Feature independence (technical decoupling)

We want to be explicit that our pilot is **SDLC-focused, not business-process-focused** — so we need to know what we can technically enable independently.

21. Confirm that the **maker-side Copilot features** (table Copilot, form Copilot, expression editing, model-driven Copilot in maker context) can be enabled **independently** of the **end-user / Service Agent Copilot features** — i.e., is it technically possible to turn on the SDLC-acceleration AI without turning on the business-user AI?
22. Are there **technical feature dependencies** that force bundling we should know about? (E.g., feature X requires feature Y also be on.)
23. For each major Copilot surface, what are the **technical prerequisites** at the tenant/environment level — Dataverse environment type, security roles, network configuration, identity setup — that affect whether the feature *can* work?

---

## What we are NOT asking in this call (parked)

To keep this conversation focused and short:

- **Licensing & pricing** (SKUs, per-user costs, trial licenses, AI Builder credit allocations) — separate conversation
- **Procurement / enablement procedure** (FastTrack engagement scope, timelines, the DoIT governance Idea process) — separate conversation
- **Pilot rollout sequencing** (which users get what, when) — separate internal discussion

We'll bring those up after we have the technical picture clear.

---

## What good looks like coming out of this conversation

A clear technical answer to two questions:

1. **What is D365 AI technically capable of?** (feature inventory with capability descriptions)
2. **What of that capability is technically available in our GCC tenant today?** (with the gaps and roadmap items called out)

That gives us the foundation to make informed downstream decisions about what to ask for, in what order, and through which path.

---

## Logistical asks for Microsoft

- Share **GCC-specific D365 Copilot feature documentation** (not commercial docs).
- Share any **GCC feature parity matrix** or release-cadence schedule.
- Share **reference architectures or technical walkthroughs** specific to GCC D365 Copilot deployments.

---

## Notes for Krishna

- Earlier draft of broader MS questions (covering GitHub Copilot, M365 Copilot, etc.) sits in `email-romi-microsoft-gcc-copilot-questions-v20260514.md` — this doc is the **D365-specific, technical-only subset**.
- Romi is owning the broader FastTrack / Premier engagement — worth a quick alignment with him before the MS call so we don't run parallel uncoordinated tracks with Microsoft.
- David and Jeffrey are cc'd on the original Bill thread — loop them in on what comes back from MS.
