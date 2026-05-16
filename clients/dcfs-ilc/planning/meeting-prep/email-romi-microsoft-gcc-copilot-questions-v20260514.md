# Email to Romi — Microsoft GCC / Copilot Open Questions

> **Date:** May 14, 2026
> **From:** Vinay
> **To:** Romi (to forward to Microsoft FastTrack / Premier specialist)
> **Subject:** DCFS/ILC AI Pilot — Microsoft GCC + Copilot for Dynamics: open questions
> **Status:** Draft

---

Romi,

For the Microsoft FastTrack / Premier engagement you're setting up, here's the consolidated list of open questions we need a Microsoft specialist to answer. Most are about **what's actually enabled in our GCC tenant today** vs. what's on the roadmap, plus a few scope/licensing clarifications. Happy to join the call if useful.

---

## 1. GCC Tenant — Feature Enablement Parity

What we've confirmed via the Apr 23 walkthroughs in `make.gov.powerautomate.us`:

- ✅ **Power Automate Copilot** — enabled, flow skeleton generation works
- ✅ **Power Apps Copilot for tables** — enabled (Dataverse table generation works)
- ❌ **Power Apps form-designer Copilot** — NOT enabled in our GCC tenant
- ❌ **GitHub Copilot** — licensed by DoIT, NOT YET PROVISIONED for this team's GCC environment

**Questions for Microsoft:**

1. Can you confirm the complete list of Power Platform / Dataverse / D365 maker Copilot features currently enabled at our GCC datacenter, and the roadmap dates for the gaps?
2. **Power Apps form-designer Copilot** — when is GCC parity expected? (Affects ~10% of our developer workflow.)
3. **GitHub Copilot for GCC** — what's the provisioning path and timeline for our team? DoIT has licenses; we need them turned on for the ILC GCC environment.
4. **Power Apps Model-Driven Copilot** — GA was April 15, 2026. Is it available in GCC, and does it require M365 Copilot licensing?
5. **Copilot-Assisted Expression Editing** (Power Automate, 2025 Wave 1) — enabled in GCC?
6. **Dataverse AI Data Mapping** (2025 Wave 2) — enabled in GCC? Useful for our data migration work.
7. **Dataverse Prompt Columns** — enabled in GCC?

---

## 2. D365 Copilot — Scope Clarification

We've drawn a line: **Copilot for Dynamics 365 Customer Service (Service Agent / end-user)** is being treated as **out of scope** for this pilot because it touches business processes rather than the SDLC (which is our pilot's focus per Jim's constraint).

**Questions:**

8. Confirm that the D365 maker-side Copilot features (table generation, model-driven app Copilot, expression editing) are distinct from the D365 Customer Service Copilot end-user features — i.e., we can enable the SDLC-relevant ones without enabling the business-user-facing ones.
9. Is **D365 Copilot enabled in the ILC Dataverse instance** today? If not, what's the enablement path and licensing implication?

---

## 3. Licensing & Procurement

10. **M365 Copilot** — does the State have existing M365 Copilot licenses we can pull from for the pilot team? If new procurement is required, what's the GCC SKU and the typical lead time?
11. **AI Builder credits** — does the State have AI Builder credits provisioned for the DCFS tenant? (Relevant if Dataverse AI Data Mapping or document processing comes into scope.)
12. **Power Automate Process Mining** — separate license required, or included? Pricing for GCC?
13. **Copilot for Security** and **Power BI Copilot** — licensing model for GCC and whether they fit the pilot's audit/measurement needs.

---

## 4. Sandboxing / Web Grounding Boundaries

DCFS has a strong policy that State-authorized Copilot is sandboxed to the State tenant — no web search, no external URL fetching, no browsing outside the tenant. We need this confirmed at the Microsoft level so we can document it correctly for training.

14. Is the **"web grounding" toggle (Bing-backed)** disabled at our tenant-policy level, or is that a DCFS-specific configuration?
15. Does the restriction apply to **Copilot Chat in Edge (work mode)**?
16. Does it cover **GitHub Copilot Chat `@web`** / code-search features once GitHub Copilot is provisioned?
17. Does it cover **Copilot Studio agents calling external connectors**?

---

## 5. Audit / Telemetry Surface

For NIST AI RMF MEASURE compliance and our pilot measurement plan, we need to know:

18. What **per-user usage analytics** are available for each Copilot surface (M365, GitHub, D365, Power Platform) in GCC?
19. Are admin-side **prompt logs** available, and what's the retention?
20. Does **Microsoft Purview** integration with Copilot work the same way in GCC as commercial?

---

## Context for the MS specialist

- **Engagement:** DCFS/ILC AI rollout pilot — 12 Scrum teams, ~160 consultants
- **Constraint:** AI tooling limited to SDLC roles (developers, testers, configuration team, BA, SM) — not business-user workflows
- **Authorized tools today:** GitHub Copilot (licensed, not provisioned), Atlassian Rovo (enabled), Power Automate Copilot + Power Apps Copilot for tables (enabled in GCC)
- **Pilot start:** targeting end of May / early June 2026
- **Governance:** DoIT AI Policy v2 §4d + NIST AI RMF; 30-day notice required for new tools

---

Let me know if you'd like this reformatted before forwarding, or if there are other questions you want bundled in.

Thanks,
Vinay
