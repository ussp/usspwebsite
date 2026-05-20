# Pilot Baseline Survey — Curated Set

> **Version:** V20260423 (v1.1 draft)
> **Owner:** AI Transformation Lead (Krasan)
> **For review by:** John, Jeff, Romi, Robert
> **Purpose:** Specify which existing research-backed survey templates we use for the pre-pilot baseline, with any DCFS-specific adaptations.
> **Delivery platform:** **Krasan AI Transformation Monitoring Tool** at `tools.ussp.co` (NOT Survey Monkey). DCFS engagement already seeded with 3 pilot teams.
> **Source templates:** `guide/appendix-d-templates.md` (full library — already research-backed, published, with scoring methodology)

---

## 1. What we're using (three existing templates)

The Krasan framework already has research-backed survey templates in `guide/appendix-d-templates.md`. For the pre-pilot baseline we combine three of them:

| # | Template | Questions | Source | Purpose |
|---|----------|-----------|--------|---------|
| 1 | **AI Readiness Assessment** (Template 1, condensed) | 23 | Ch. 4 + Appendix D §1 | Current AI experience, skills, process readiness, attitudes, infrastructure |
| 2 | **SPACE Survey** (Template 2) | 5 | Forsgren et al. 2021 — Appendix D §2 | Team-health baseline: Satisfaction / Performance / Activity / Communication / Efficiency |
| 3 | **DevEx Survey** (Template 3) | 3 | Developer Experience research — Appendix D §3 | Flow state, feedback loops, cognitive load |

**Total:** 31 questions. Estimated completion time: **10–15 minutes**.

All three run again mid-pilot (SPACE + Pulse) and post-pilot (SPACE + DevEx) — the research-backed cadence for measuring transformation impact.

---

## 2. DCFS-specific adaptations

The existing templates are strong as-is. Only minor tweaks needed for the DCFS context:

### Adaptations to Template 1 (Readiness Assessment)

| Section / Question | Adaptation | Reason |
|--------------------|------------|--------|
| Role checkbox | Add "Testing Services Lead" to the role list (currently: BA / Tester / Dev / SM/Lead) | 5th role added Apr 22 |
| Section A — AI tools used | Add "Microsoft 365 Copilot" and "Dynamics 365 Copilot" to the list | DCFS-approved tool set |
| Section D5 (concerns) | Add prompt: "Including concerns about DCFS data boundaries (CANTS, CCWIS, PII)" | DCFS compliance framing |
| Section E (Infrastructure) | Add row: "Microsoft 365 Copilot access" and "Dynamics 365 Copilot access" | DCFS tool authorization items |

### Adaptations to Templates 2 and 3 (SPACE + DevEx)

**None.** These are standardized research instruments — changing them breaks comparability with the research benchmarks. Use as-is.

### Optional addition — DCFS Compliance self-assessment (3 questions)

If reviewers agree it adds value, add a small 3-question compliance-awareness block at the end of Template 1:

```
DCFS Compliance Awareness (3 questions, 1-5 scale)

CA1. I am confident I know what data I can and cannot enter
     into an AI prompt on this program.                          [1] [2] [3] [4] [5]

CA2. I know what to do if I accidentally enter PII or case data
     into an AI prompt.                                          [1] [2] [3] [4] [5]

CA3. I understand the DoIT AI Policy requirements that apply
     to my role.                                                 [1] [2] [3] [4] [5]
```

This aligns with the Pilot Governance Charter §5.5 weekly compliance check — self-reported confidence is a leading indicator of training effectiveness.

---

## 3. What to send to reviewers

**Do not re-review the original templates** — those have been reviewed and published in the framework guide. What reviewers should focus on:

1. **Are the DCFS adaptations correct?** (role list, tool list, compliance section)
2. **Is the compliance self-assessment (optional addition) worth including?** Reviewer's call.
3. **Do we survey control teams too?** (Previously discussed — TBD)
4. **Does Survey Monkey skip-logic support what we need?** Robert to verify with Tracy.

---

## 4. Delivery — hybrid model

**Survey Monkey for collection. `tools.ussp.co` for development and post-processing.**

Rationale: the pilot team is unlikely to log into a new Krasan portal to take a 15-minute survey. Survey Monkey (or email-based distribution) is the lowest-friction collection channel. Our tool then does the heavy analytical work — scoring, comparison, live reporting — against published research benchmarks.

### Who does what

| Stage | Platform | Why |
|-------|----------|-----|
| **Survey design / instance configuration** | `tools.ussp.co` | Templates 1 + 2 + 3 already built in. Apply DCFS adaptations once; generate the authoritative question set for Survey Monkey. |
| **Distribution** | Survey Monkey (via Tracy Dempsey / Krasan) | Low friction — respondents click one link, no account needed |
| **Response collection** | Survey Monkey | Collects responses, exports to CSV |
| **Import + scoring** | `tools.ussp.co` | CSV import; tool auto-computes SPACE / DevEx / Readiness scores per research methodology |
| **Jira quantitative metrics** | `tools.ussp.co` (Jira adapter) | Auto-pull cycle time, velocity, quality metrics — no manual collection needed |
| **Reporting / dashboards** | `tools.ussp.co` | Live radar charts (baseline vs. current, pilot vs. control); shared read-only with Dave |
| **Mid-pilot + post-pilot re-survey** | Same hybrid — Survey Monkey out, tool in | Maintains consistency across time points |

### What this gives us

- Respondents see a single clean Survey Monkey link — no sign-up, no portal navigation
- We get automated, research-backed scoring via `tools.ussp.co`
- Live dashboard for Dave (read-only) — not quarterly static reports
- Auto-computed pilot-vs-control comparison in the tool
- Jira quantitative metrics flow directly into the same dashboard

### Distribution plan

| Step | Owner | Timing |
|------|-------|--------|
| DCFS adaptations confirmed by John + Jeff + Romi | Reviewers | Apr 24 |
| Final question set generated from `tools.ussp.co` survey configuration | Vinay | Apr 24 |
| Survey built in Survey Monkey (Tracy Dempsey facilitating) | Robert | Apr 25 |
| Sent to Intact pilot team (Kelly, Sushil, Anusha, Chaitanya, Remeer, Natalie, Camilla) | Vinay | Apr 28 |
| Sent to 2 control teams (reference group — picked by John) | Vinay | Apr 28 |
| Response window | — | 5 business days |
| Survey Monkey CSV export → import to `tools.ussp.co` | Vinay | Apr 30 |
| Auto-generated baseline report (reviewed) | Vinay | Apr 30 |
| Live dashboard share with Dave (read-only) | Vinay + Romi | May 5 |

---

## 5. Scoring and analysis

Scoring is already defined in each template:

- **Template 1:** Skills (30%) + Process (30%) + Attitude (30%) + Infrastructure (10%) → Team Readiness tier (High / Moderate / Developing / Low)
- **Template 2:** SPACE radar chart (5 axes), baseline shape vs. current shape
- **Template 3:** DevEx radar chart (3 axes), baseline vs. current

Follow the scoring methodology in `guide/appendix-d-templates.md` — no reinvention needed.

---

## 6. Why we're reusing, not rewriting

- **Research-backed.** Templates 2 and 3 are drawn from peer-reviewed research (Forsgren et al. 2021). Rewriting breaks comparability with published benchmarks.
- **Framework consistency.** Other Krasan engagements use these same templates. Reusing them builds the IP Krasan can reapply.
- **Faster to field.** No design cycle needed — just the DCFS-specific tweaks above.
- **Pre-vetted.** These templates have been reviewed in the framework guide already.
- **Built into our own tool.** `tools.ussp.co` already implements these templates with scoring and visualizations — we deliver via our platform, not a third-party form.

## 6a. Positioning note for Dave / DCFS

Talking-point:

> *"Distribution runs on Survey Monkey so respondents don't have to learn a new portal. Scoring, analysis, and the live dashboard run on Krasan's AI Transformation Monitoring Tool — Jira-integrated, research-backed, with live radar charts for SPACE / DevEx / Readiness. Dave gets read-only dashboard access once pilot starts."*

This reinforces:
- **Low friction for respondents** — Survey Monkey link, no account setup
- **Heavy analytics live in our tool** — Krasan's productized framework (IP angle in Rollout Plan §13)
- **DCFS gets live visibility** — not quarterly static reports
- **Post-pilot continuity** — measurement continues on the same dashboard when scaling
- **Differentiator** — "we'll email you Survey Monkey results" vs. "here's a live comparison dashboard"

---

## 7. Open questions for reviewers

1. DCFS adaptations acceptable as listed in §2?
2. Include the optional 3-question DCFS Compliance Awareness block?
3. Survey control teams too? If yes, same version or Template 1 only (skip SPACE + DevEx)?
4. Any Survey Monkey skip-logic constraints we need to know about?

---

## Version history

| Version | Date | Changes |
|---------|------|---------|
| v0.1 | 2026-04-23 | Initial draft — tried to rewrite from scratch (25 questions). Superseded. |
| v1.0 | 2026-04-23 | Rewritten to curate from existing `guide/appendix-d-templates.md` library (Templates 1 + 2 + 3, 31 questions) with DCFS-specific adaptations only. |
