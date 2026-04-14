# Assumptions & Risks Register — DCFS Illinois Connect AI Pilot

> **Version:** V04142026
> **Status:** Living document — updated as assumptions are validated or invalidated
> **Owner:** Vinay Lagisetty

---

## Assumptions

Assumptions are things we believe to be true but have not yet confirmed. Each assumption must be validated or it becomes a risk.

### Tool & Infrastructure Assumptions

| # | Assumption | Status | How to Validate | Owner |
|---|-----------|--------|-----------------|-------|
| A-01 | GitHub Copilot licenses exist and are purchased by the State | **Unvalidated** | Ask Dave — what tier? Business/Enterprise? | Dave |
| A-02 | GitHub Copilot can be deployed to ILC teams | **Unvalidated** | Ask Dave — deployment timeline, blockers | Dave |
| A-03 | Atlassian Rovo is enabled on ILC JIRA Cloud | **Unvalidated** | Ask Dave/Matt — is Rovo active? | Dave/Matt |
| A-04 | OpenAI models are approved for State use (via Copilot) | **Validated** (Jim, Apr 13) | Jim confirmed | Jim |
| A-05 | Google Gemini may be approved for State use (via Copilot) | **Pending** | Jim to check | Jim |
| A-06 | Anthropic Claude is not yet approved | **Assumed** | Not discussed — worth pursuing (zero data retention) | Vinay |
| A-07 | Dynamics 365 Power Platform AI features are available in GCC | **Likely** (per research) | Ask Jeffrey/Kashif — what's enabled in ILC? | Jeffrey |
| A-08 | JIRA has sufficient data for baseline (3+ sprints) | **Assumed** | Verify with Matt once JIRA access granted | Matt |
| A-09 | There is no existing Dynamics dev/sandbox environment for POC | **Stated** (Apr 13 meeting) | Dinkar investigating demo environment setup | Dinkar |
| A-10 | M365 Copilot licensing ($30/user/mo) is available or budgetable | **Unvalidated** | Ask Dave — budget for Copilot licensing | Dave |

### Organizational Assumptions

| # | Assumption | Status | How to Validate | Owner |
|---|-----------|--------|-----------------|-------|
| A-11 | Jim supports AI code generation (stair-stepped) | **Validated** (Apr 13) | Jim: "constraint was accidental" | Jim |
| A-12 | Jim's target is 10-15% improvement in 13 weeks | **Validated** (Apr 13) | Stated in meeting | Jim |
| A-13 | Measurement should use tangible outputs, not story points | **Validated** (Apr 13) | Jim directed this | Jim |
| A-14 | Dave is interim AI lead during Jim's absence | **Validated** (Apr 13) | Jim designated Dave | Jim |
| A-15 | PMO and BA teams are approved for pilot involvement | **Validated** (Apr 13) | Jim approved, cautioned about resistance | Jim |
| A-16 | Pilot starts with Krasan roles only | **Validated** (Apr 13 + Romi) | Include other vendors after initial issues resolved | Romi |
| A-17 | PO and BA-Functional are NOT Krasan resources | **Needs verification with Romi** | Confirm team composition per Scrum team | Romi |
| A-18 | PI 20 Planning is May 5 | **Assumed** | Verify with Matt (RTE) | Matt |
| A-19 | Pilot targets Sprints 3 & 4 of PI 20 | **Discussed** (Apr 13) | Confirm with Dave/Romi | Dave |
| A-20 | 15% of sprint capacity can be allocated for AI adoption | **Discussed** (Apr 13) | Must be agreed with team leads and POs | Romi/John |
| A-21 | Gartner consultation is available to the State | **Assumed** (Jim suggested) | Jim to facilitate | Jim |

### Compliance Assumptions

| # | Assumption | Status | How to Validate | Owner |
|---|-----------|--------|-----------------|-------|
| A-22 | DoIT AI Policy does NOT prohibit code generation | **Validated** (policy review) | Policy requires human-in-the-loop, not prohibition | Vinay |
| A-23 | DoIT 30-day notice has NOT been filed for Copilot/Rovo | **Unknown** | Ask Dave — critical path item | Dave |
| A-24 | Copilot on ILC source code may trigger Section 5e ("State data for AI") | **Unknown** | Ask Dave/Jim — needs legal interpretation | Dave |
| A-25 | A DCFS-led governance team will be established | **Agreed** (Apr 13) | Jim wants this | Jim |
| A-26 | ILC source code does not contain embedded PII | **Assumed** | Verify with Kashif/Shyam during Dynamics session | Jeffrey |

---

## Risks

### Critical Risks (Impact = Critical)

| # | Risk | Likelihood | Impact | Mitigation | Owner | Status |
|---|------|-----------|--------|-----------|-------|--------|
| R-01 | **Sensitive child welfare data in AI prompts** — PII, case data, CANTS data entered into Copilot/Rovo | Low | Critical | Strict training; "No PII" rule in every playbook; per-sprint spot checks; incident reporting | Vinay | Open — mitigated by guardrails |
| R-02 | **State pulls AI tools mid-pilot** — CMS precedent Oct 2025 where state revoked AI access | Medium | Critical | Full DoIT compliance upfront; NIST AI RMF governance; stay within boundaries; document everything | Romi | Open |

### High Risks

| # | Risk | Likelihood | Impact | Mitigation | Owner | Status |
|---|------|-----------|--------|-----------|-------|--------|
| R-03 | **DoIT 30-day notice not filed** — if not filed, pilot cannot start for 30 days | Unknown | High | Clarify with Dave immediately; if not filed, file ASAP | Dave | Open — **blocker** |
| R-04 | **Copilot not deployed to teams** — licenses purchased but not provisioned | Medium | High | Start pilot with Rovo-only for BA/Tester tracks; Copilot needed for Dev track | Dave | Open — **blocker** |
| R-05 | **Section 5e ambiguity** — Copilot on ILC code may require Agency Head written consent | Medium | High | Get legal interpretation from Dave/Jim before pilot | Dave | Open — **blocker** |
| R-06 | **No Dynamics sandbox environment** — can't test config generation without a safe environment | High | High | Dinkar investigating POC environment outside state; Jim offered to look into quick POC buy | Dinkar | Open |
| R-07 | **Multi-vendor team complexity** — PO (State), BA-Functional (CSG) not in pilot initially; friction when they're added | Medium | High | Start Krasan-only; add other vendors after proving value; Jim offered exec support | Romi | Open |
| R-08 | **10-15% target may not be achievable in 13 weeks** — ambitious target on config-first platform with limited code | Medium | High | Set expectations: measure trend direction, not just absolute numbers; stair-stepped adoption means full impact may take 2 PIs | Vinay | Open |

### Medium Risks

| # | Risk | Likelihood | Impact | Mitigation | Owner | Status |
|---|------|-----------|--------|-----------|-------|--------|
| R-09 | **AI makes outputs worse** — garbage in, garbage out; poor prompts produce poor results | High | Medium | Training first; prompt libraries; quality checklist; mandatory human review | Vinay | Open |
| R-10 | **Team resistance to AI tools** — developers/testers don't want to change habits | Medium | Medium | Voluntary pilot with strong participants; training shows value; AI champions model | Vinay/John | Open |
| R-11 | **Baseline metrics not available** — JIRA data incomplete or inconsistent across teams | Low | Medium | JIRA Quality Scanner auto-computes; manual fallback; may need to adjust KPI selection | Vinay/Matt | Open |
| R-12 | **Training time impacts delivery** — 15% capacity for AI reduces sprint commitments | High | Medium | Explicitly communicate to stakeholders; adjust velocity expectations for pilot sprints | Romi | Open |
| R-13 | **Measurement methodology unclear** — tangible outputs (LOC, docs, config) harder to track than story points | Medium | Medium | Define measurement methodology before pilot; establish tracking mechanisms in Sprint 1-2 | Vinay | Open |
| R-14 | **Novelty effect** — early improvements don't sustain; teams revert to old habits | Medium | Medium | Don't report week 1 numbers; wait for sprint 3+ data; continuous reinforcement via playbooks | Vinay | Open |
| R-15 | **Monitoring tools not approved** — tools.ussp.co may need DoIT approval as external tool | Medium | Medium | Default to JIRA dashboards + Power BI; tools.ussp.co as optional enhancement later | Vinay | Open |

### Low Risks

| # | Risk | Likelihood | Impact | Mitigation | Owner | Status |
|---|------|-----------|--------|-----------|-------|--------|
| R-16 | **Pilot teams not representative** — selected teams are too easy or too hard | Low | Low | Selection criteria documented; readiness assessment informs selection | Vinay/John | Open |
| R-17 | **Gartner consultation not available** — State doesn't have Gartner access | Low | Low | Proceed with NIST AI RMF framework; Gartner is validation, not dependency | Jim | Open |

---

## Risk Summary

| Severity | Count | Blockers |
|----------|-------|----------|
| Critical | 2 | 0 (mitigated) |
| High | 6 | 3 (R-03, R-04, R-05) |
| Medium | 7 | 0 |
| Low | 2 | 0 |
| **Total** | **17** | **3 blockers** |

**Three blockers to resolve with Dave:**
1. R-03 — DoIT 30-day notice status
2. R-04 — Copilot deployment status
3. R-05 — Section 5e legal interpretation

---

## Assumptions-to-Risk Conversion

When an assumption is invalidated, it becomes a risk:

| If This Assumption... | Is Invalidated... | It Becomes Risk... |
|----------------------|-------------------|-------------------|
| A-01 (Copilot licenses exist) | No licenses | R-04 escalates to Critical |
| A-18 (PI 20 is May 5) | PI delayed | Timeline shifts, may miss 13-week window |
| A-20 (15% capacity available) | POs reject capacity allocation | Pilot can't run during sprints — needs separate time |
| A-23 (30-day notice not filed) | Confirmed not filed | R-03 confirmed — 30-day delay |
| A-26 (No PII in source code) | Code contains PII patterns | R-01 escalates — need code review before Copilot access |

---

*This is a living document. Update as assumptions are validated and risks are resolved.*
