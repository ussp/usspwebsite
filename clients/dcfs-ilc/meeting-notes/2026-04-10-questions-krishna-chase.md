# Questions for Krishna Mekala & Chase Yeung Calls

> **Date:** Friday April 10, 2026 (or next available)
> **Duration:** 40 minutes each
> **Purpose:** Get context needed for Jim meeting (Apr 13) and rollout plan (Apr 17)

---

## Krishna Mekala — Tech Stack & Development Process

### SACWIS → CCWIS Migration Context
1. Where are we in the SACWIS → CCWIS migration? What percentage of modules have been migrated to Dynamics 365?
2. How is the SACWIS → Dataverse field mapping currently done? (Manual spreadsheets? Automated tools? What's the pain level?)
3. Are there CCWIS certification requirements that affect how we build/test? Any federal reporting mandates (AFCARS/NCANDS)?

### Development Process (Day-in-the-Life)
4. What does a typical sprint look like for a developer on this project? (inner loop: code → test → deploy)
5. Configuration vs custom code ratio — roughly what percentage of work is Power Apps/Power Automate config vs C# plugin development?
6. How are Dynamics 365 solutions structured — single solution or segmented by team?
7. Plugin deployment process — managed vs unmanaged solutions? How do changes move dev → test → prod?

### DevOps & Tooling
8. Branching strategy in Azure DevOps — feature branches? Release branches?
9. How is Dataverse schema managed across environments?
10. Any existing CI/CD automation or is deployment mostly manual through XRMToolBox?
11. App Insights — what's monitored today? Any gaps?

### AI Readiness
12. Are there any existing AI/ML models in use? Power Platform AI Builder?
13. Has anyone on the teams used Copilot or Rovo informally? What was the experience?
14. Any known blockers to GitHub Copilot deployment? (license status, network restrictions, etc.)

### Data Governance
15. How is test data managed? Do developers ever work with real DCFS case data in dev/test environments?
16. Are there existing DLP policies or data classification rules in the M365 tenant?

---

## Chase Yeung — Data Architecture & Measurement

### Data Landscape
1. What data sources feed into Power BI today? Is there a data warehouse or does Power BI connect directly to Dataverse?
2. How is sprint/velocity data currently reported? (JIRA → Power BI pipeline? Manual export?)
3. What JIRA metrics are already being tracked at the team and ART level?
4. Do you have JIRA dashboards that track velocity, cycle time, or throughput today?

### Migration Data
5. Data migration status — how many legacy SACWIS systems/databases remain?
6. Current data quality processes — automated validation or manual review?
7. What does the SACWIS → Dataverse ETL pipeline look like? (Informatica, ADF, or both?)
8. Data migration error rates — are these tracked per sprint?

### Measurement Infrastructure
9. Can we build the AI scorecard/dashboard into existing Power BI infrastructure?
10. Can we access JIRA data programmatically (API) for automated metric collection?
11. What would it take to extract story-level cycle time data from JIRA for baselining?

### Data Team AI Opportunities
12. What are the biggest time sinks for your team? Where would AI save the most time?
13. Are there field mapping tasks where AI could assist? (SACWIS field → Dataverse entity mapping)
14. Any data governance or data catalog in place?
15. What does your team's sprint process look like? (separate from dev teams or embedded?)

---

## Questions for Other Krasan Team Members

### Matt (RTE) — JIRA/Confluence Configuration
1. What are the exact JIRA workflow states? (needed to compute cycle time metrics)
2. Is Atlassian Intelligence (Rovo) currently enabled in the JIRA instance? What features are turned on?
3. Can Rovo be restricted at the project level — enable for delivery projects, disable for case-content projects?
4. What Confluence spaces exist? How complete is the documentation?
5. Is there a JIRA API key or service account available for metrics collection?

### John (Agile Delivery Manager) — Pilot & Testing
1. Which 2-3 teams would you recommend for the pilot? Why?
2. What's the current testing bottleneck — test script creation, test data, or execution?
3. Your informal Copilot testing — can you share specific examples of what worked and what didn't?
4. Do testers use Gherkin/BDD format for acceptance criteria today, or is that aspirational?
5. How are test cases managed in Zephyr? Linked to stories? Coverage tracked?

### Robert Rodriguez — Governance & Policy
1. Have you obtained the DoIT AI policy from Jim yet?
2. Is there a named AI governance lead at DCFS?
3. Has DCFS filed the DoIT AI System Assessment for any tools?
4. Is Microsoft Purview DLP already configured in the M365 tenant?
5. What's the onboarding/clearance timeline for Vinay?

### Darrin Turner (Chief Solution Architect) — Architecture
1. How are security roles structured in the Dynamics 365 implementation?
2. What integration patterns are used with FileNet, Adobe Sign, and other external systems?
3. Are there architecture decision records (ADRs) or similar docs?
4. What .NET version and patterns are used for plugins?
5. Any architectural concerns about AI tool usage (data flow, network boundaries)?

---

## Priority Questions for Jim Meeting (Apr 13)

These are the questions we MUST get answered from Jim — either directly or through Romi:

1. **DoIT Assessment status** — Have Copilot/Rovo been assessed? 30-day gate.
2. **GitHub Copilot deployment** — When available to ILC teams?
3. **"State data for AI"** — Does Copilot on ILC code trigger Section 5e?
4. **M365 Copilot** — Is this already deployed to the teams? License confirmed?
5. **Purview DLP** — Is it configured for the tenant?
6. **PI cadence** — When does the next PI start? (Critical for pilot timing)
7. **Named AI governance lead** — Who at DCFS is responsible?
8. **Pilot team approval** — 2-3 teams, Jim's sign-off
9. **Metrics priorities** — What does success look like to Jim specifically?
10. **CCWIS certification** — Any AI implications for federal certification?

---

*Prepared April 9, 2026. Update with answers after each call.*
