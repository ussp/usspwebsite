# Assumptions & Risks Register — DCFS Illinois Connect AI Pilot

> **Version:** V04272026
> **Status:** Living document — updated as assumptions are validated or invalidated
> **Owner:** Vinay Lagisetty

## Apr 27 update — discovery findings

Three working sessions (Apr 23 Dynamics dev workflow, Apr 24 testing workflow, Apr 24 governance review) generated:
- **Status changes** to existing assumptions A-02, A-03, A-07, A-23 (see status column)
- **6 new assumptions** A-31 through A-36 (governance + tool + workflow)
- **11 new risks** R-21 through R-31, mapped to R-NEW-6 through R-NEW-16 in `rollout-plan.md` v6.2
- **Risk count:** 20 → 31; new blockers: GitHub Copilot enablement, Zephyr Agent §5f notice, prompt-logging owner gap

---

## Assumptions

Assumptions are things we believe to be true but have not yet confirmed. Each assumption must be validated or it becomes a risk.

### Tool & Infrastructure Assumptions

| # | Assumption | Status | How to Validate | Owner |
|---|-----------|--------|-----------------|-------|
| A-01 | GitHub Copilot licenses exist and are purchased by the State | **Unvalidated** | Ask Dave — what tier? Business/Enterprise? | Dave |
| A-02 | GitHub Copilot can be deployed to ILC teams | **🚧 Partially invalidated (Apr 23)** — licensed by DoIT but NOT YET PROVISIONED for this team's GCC environment. Escalation in flight. | Vinay+Romi escalating to Dave/Jim | Dave |
| A-03 | Atlassian Rovo is enabled on ILC JIRA Cloud | **✅ Validated (Apr 23/24)** — enabled and used live in both walkthroughs | — | Dave/Matt |
| A-04 | OpenAI models are approved for State use (via Copilot) | **Validated** (Jim, Apr 13) | Jim confirmed | Jim |
| A-05 | Google Gemini may be approved for State use (via Copilot) | **Pending** | Jim to check | Jim |
| A-06 | Anthropic Claude is not yet approved | **Assumed** | Not discussed — worth pursuing (zero data retention) | Vinay |
| A-07 | Dynamics 365 Power Platform AI features are available in GCC | **✅ Partially validated (Apr 23)** — Power Automate Copilot ✅, Power Apps Copilot for tables ✅; Power Apps form-designer Copilot ❌ (NOT enabled in GCC — release-cadence gap) | — | Jeffrey |
| A-08 | JIRA has sufficient data for baseline (3+ sprints) | **Assumed** | Verify with Matt once JIRA access granted | Matt |
| A-09 | There is no existing Dynamics dev/sandbox environment for POC | **Stated** (Apr 13 meeting) | Dinkar investigating demo environment setup | Dinkar |
| A-10 | M365 Copilot licensing ($30/user/mo) is available or budgetable | **Unvalidated** | Ask Dave — budget for Copilot licensing | Dave |

### Organizational Assumptions

| # | Assumption | Status | How to Validate | Owner |
|---|-----------|--------|-----------------|-------|
| A-11 | Jim supports AI-assisted code generation from day one under mandatory HITL | **Validated** (Apr 13) | Jim: "constraint was accidental" | Jim |
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
| A-31 | **Zephyr Scale Agent for Atlassian Rovo requires DoIT §5f 30-day notice** before pilot use (Apr 27) | **Confirmed** — NOT in current authorized 4 | Vinay drafting notice; Robert/Romi review; Dave/Jim signoff | Vinay |
| A-32 | **Per-role candidate metric selection lives in design phase**, not baseline phase (Apr 27, per Apr 24 governance review) | **✅ Validated (Apr 24)** — Jeff/Vinay agreed in governance review | Reflected in rollout-plan.md v6.2 §6.2 | Vinay |
| A-33 | **DCFS Work Product template** is the standard for all client-shareable deliverables (Apr 27) | **✅ Validated (Apr 24)** — Jeff: "We should use the DCFS document template" | Apply going forward; charter v0.3 already migrated | Vinay |
| A-34 | **Visio-as-JPEG architecture diagrams are not AI-parseable** — must be converted to Mermaid for AI ingestion (Apr 27) | **✅ Validated (Apr 23)** — confirmed live failure during dev walkthrough | Cross-cutting prerequisite — task 18a in rollout plan | Vinay + Shyam/Kashif |
| A-35 | **Tester role workflow is ~80% manual UI execution** where AI cannot drive under HITL governance (Apr 27) | **✅ Validated (Apr 24)** — observed during testing walkthrough | Drives role-specific target proposal in rollout plan §9 | Vinay |
| A-36 | **No sprint/PI test reports exist today** — AI-drafted reports are pure additive output, no incumbent process to displace (Apr 27) | **✅ Validated (Apr 24)** — confirmed during testing walkthrough | Build report template before pilot starts | Kamila + Vinay |
| A-24 | Copilot on ILC source code may trigger Section 5e ("State data for AI") | **Unknown** | Ask Dave/Jim — needs legal interpretation | Dave |
| A-25 | A DCFS-led governance team will be established | **Agreed** (Apr 13) | Jim wants this — two-phase model (pilot governance → full governance) | Jim |
| A-26 | ILC source code does not contain embedded PII | **Assumed** | Verify with Kashif/Shyam during Dynamics session | Jeffrey |
| A-27 | CIO will establish full AI Governance Team after pilot results are reviewed | **Assumed** | Pilot governance is interim; full team formed when CIO is ready | CIO |
| A-28 | Playbooks require full governance team approval before scaling to all teams | **Assumed** | Pilot produces draft playbooks; full governance approves final versions | CIO |
| A-29 | Pilot Governance Lead will be a DCFS designee, not a vendor resource | **Assumed** | No vendor self-governance even during pilot — DCFS must chair | CIO |
| A-30 | Governance is a separate workstream running in parallel with the pilot | **Assumed** | Governance setup, meetings, reviews happen alongside delivery work | Vinay |

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
| R-04b | **Tool access not in place before Design & Develop phase** — GitHub Copilot, Rovo, M365 Copilot, D365 Copilot all need confirmed tier/licensing/provisioning before we can design role-specific workflows and train the pilot team | High | High | Close all 6 tool questions with Dave in Apr 22 meeting; fallback is to sequence training so tools-first roles (Dev, BA, Tester) begin while waiting on M365/D365 Copilot for SA/BA-Tech | Dave + Romi | Open — **blocker** |
| R-05 | **Section 5e ambiguity** — Copilot on ILC code may require Agency Head written consent | Medium | High | Get legal interpretation from Dave/Jim before pilot | Dave | Open — **blocker** |
| R-06 | **No Dynamics sandbox environment** — can't test config generation without a safe environment | High | High | Dinkar investigating POC environment outside state; Jim offered to look into quick POC buy | Dinkar | Open |
| R-07 | **Multi-vendor team complexity** — PO (State), BA-Functional (CSG) not in pilot initially; friction when they're added | Medium | High | Start Krasan-only; add other vendors after proving value; Jim offered exec support | Romi | Open |
| R-08 | **10-15% target may not be achievable in 13 weeks** — ambitious target on config-first platform with limited code | Medium | High | Set expectations: measure trend direction, not just absolute numbers; full impact may take 2 PIs as adoption matures | Vinay | Open |

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
| R-18 | **No DCFS designee for Pilot Governance Lead** — CIO doesn't assign someone before pilot | Medium | High | Pilot cannot proceed without DCFS governance representation. Escalate to CIO. | CIO | Open |
| R-19 | **Full governance team not formed before scale** — CIO delays establishing full team | Medium | Medium | Scale cannot begin without full governance approval of playbooks. Pilot continues in steady state. | CIO | Open |
| R-20 | **Governance overhead slows pilot execution** — too many approvals, too many meetings | Low | Medium | Pilot governance is lightweight (1 DCFS lead + weekly 45 min). Keep it lean. | Vinay | Open |

---

## Apr 27 — New Risks from Discovery Sessions

> Sequential numbering continues from R-20. Each risk shows the cross-reference label used in `rollout-plan.md` v6.2 (R-NEW-X) for traceability.

### High Risks (Apr 27)

| # | Risk | Likelihood | Impact | Mitigation | Owner | Status |
|---|------|-----------|--------|-----------|-------|--------|
| R-22 *(R-NEW-7)* | **GitHub Copilot enablement gap** — licensed by DoIT, not yet provisioned for team GCC environment. Blocks plugin/PCF/Azure Function authoring (highest-value developer use cases). | High | High | Vinay + Romi escalate to Jim/David. Fallback: developer use cases shift to Rovo-only and JS-Copilot-via-VS-Code path. | Romi/Vinay | Open — **blocker** |
| R-28 *(R-NEW-13)* | **Prompt-logging owner gap inside DCFS** — no DCFS-side owner identified for prompt logging at scale (PII detection, audit trail). Surfaced as governance gap during Apr 24 charter review. | High | High | Separate Vinay+Jeff call needed to identify owner. Deferred to post-pilot for full implementation, but must be a named pilot output. | Vinay+Jeff | Open — **blocker** |
| R-23 *(R-NEW-8)* | **Tester role unable to hit uniform 15% productivity target** — workflow is ~80% manual UI execution where AI cannot drive under HITL governance. | High | Medium | Adopt role-specific targets (rollout-plan §9). Tester gains land in 20% authoring slice + new sprint/PI report drafting (gap today = pure upside). | Vinay | Open |
| R-26 *(R-NEW-11)* | **Story quality dependency on AI gains** — bad input produces worse output (AI amplifies skill). | High | Medium | BA training first; story hygiene pre-check in dev playbook; QUS scoring in baseline. | Vinay | Open |

### Medium Risks (Apr 27)

| # | Risk | Likelihood | Impact | Mitigation | Owner | Status |
|---|------|-----------|--------|-----------|-------|--------|
| R-21 *(R-NEW-6)* | **Zephyr Scale Agent for Rovo §5f notice timeline** — adoption blocked until DoIT 30-day notice clears. | Medium | Medium | Pilot fallback: Rovo-only with manual copy-paste from JIRA comment to Zephyr folders. File §5f notice immediately to clear path for full Agent before Pilot Sprint 2. | Vinay+Robert | Open |
| R-25 *(R-NEW-10)* | **Baseline pollution from pre-pilot AI tool exploration** — team members may have already used Rovo informally, polluting the "before" baseline. | Medium | Medium | Tighten baseline window; document any pre-pilot tool usage; consider exclusion criteria when computing deltas. | Vinay+Matt | Open |
| R-29 *(R-NEW-14)* | **Tester peer-review checklist absent** — currently no formal checklist for peer-reviewing test cases. Prerequisite for AI peer-review pre-screening use case. | Medium | Medium | Create checklist (Kamila + Vinay) before pilot starts. | Kamila+Vinay | Open |

### Low Risks (Apr 27)

| # | Risk | Likelihood | Impact | Mitigation | Owner | Status |
|---|------|-----------|--------|-----------|-------|--------|
| R-24 *(R-NEW-9)* | **Power Apps form-designer Copilot missing in GCC tenant** — release-cadence gap. | Medium | Low | Confirm with Microsoft / DoIT. Affects only ~10% of dev workflow; not a pilot blocker. | Vinay | Open |
| R-27 *(R-NEW-12)* | **Visio-as-JPEG architecture diagrams not AI-parseable** — confirmed live failure during Apr 23 dev walkthrough. | High | Low | Visio→Mermaid conversion as cross-cutting prerequisite (rollout-plan task 18a). | Vinay+Shyam/Kashif | Open |
| R-30 *(R-NEW-15)* | **Sprint/PI test-report baseline gap** — no reports exist today, so no baseline to beat. | Low | Low | Reframe as opportunity: AI-drafted reports are pure additive output. Build a template before pilot starts. | Kamila+Vinay | Open — opportunity |
| R-31 *(R-NEW-16)* | **Wrong-Vinay email-collision risk** — multiple people named Vinay in DCFS distribution lists; risk of misrouted email. | Low | Low | Always use full email `vinay.lagisetty@krasanconsulting.com`. Alec to verify all distribution lists. | Alec | Open |

---

## Risk Summary

| Severity | Count | Blockers |
|----------|-------|----------|
| Critical | 2 | 0 (mitigated) |
| High | 11 | 6 (R-03, R-04, R-04b, R-05, R-22, R-28) |
| Medium | 12 | 0 |
| Low | 6 | 0 |
| **Total** | **31** | **6 blockers** |

**Six blockers to resolve:**
1. R-03 — DoIT 30-day notice status (with Dave)
2. R-04 — Copilot deployment status (with Dave)
3. R-04b — Tool access not in place before Design & Develop phase (with Dave)
4. R-05 — Section 5e legal interpretation (with Dave)
5. **R-22 (Apr 27) — GitHub Copilot enablement gap** for team's GCC environment (escalate to Dave/Jim)
6. **R-28 (Apr 27) — Prompt-logging owner gap inside DCFS** (Vinay+Jeff call needed)

---

## Assumptions-to-Risk Conversion

When an assumption is invalidated, it becomes a risk:

| If This Assumption... | Is Invalidated... | It Becomes Risk... |
|----------------------|-------------------|-------------------|
| A-01 (Copilot licenses exist) | No licenses | R-04 escalates to Critical |
| A-02 (Copilot deployable to ILC) | NOT YET PROVISIONED for team GCC | **R-22 confirmed (Apr 27)** — escalate to Dave/Jim |
| A-07 (Power Platform AI in GCC) | Form-designer Copilot NOT enabled | **R-24 confirmed (Apr 27)** — confirm release-cadence gap with Microsoft |
| A-18 (PI 20 is May 5) | PI delayed | Timeline shifts, may miss 13-week window |
| A-20 (15% capacity available) | POs reject capacity allocation | Pilot can't run during sprints — needs separate time |
| A-23 (30-day notice not filed) | Confirmed not filed | R-03 confirmed — 30-day delay |
| A-26 (No PII in source code) | Code contains PII patterns | R-01 escalates — need code review before Copilot access |
| A-31 (Zephyr Agent §5f required) | §5f notice delayed | **R-21 confirmed (Apr 27)** — pilot proceeds with Rovo+manual-paste fallback |
| A-35 (Tester ~80% manual UI) | Confirmed during walkthrough | **R-23 confirmed (Apr 27)** — adopt role-specific targets |

---

*This is a living document. Update as assumptions are validated and risks are resolved.*
