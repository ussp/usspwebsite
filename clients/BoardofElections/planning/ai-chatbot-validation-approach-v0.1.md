# SBE Voter Chatbot — Validation Approach

**Version:** v0.1 (internal working draft, Vinay)
**Date:** 2026-05-14
**Status:** Pre-circulation — for Vinay's own thinking before sharing with Jay / Sandip / Dinkar. Not client-facing.
**Scope:** Validation framework for a public-facing voter-FAQ chatbot on the modernized SBE website, built on Microsoft technology, evaluated against Illinois DoIT policy.

---

## TL;DR

- **Frame:** NIST AI RMF (Govern / Map / Measure / Manage) as the validation skeleton, mapped onto Illinois DoIT policy domains. DoIT does not formally mandate NIST AI RMF, but its AI Policy v2 (April 2025) and security stack (NIST CSF + 800-53) already mirror it — so the structure is defensible and recognizable.
- **Stack:** Microsoft Copilot Studio (UX/orchestration) calling an Azure AI Foundry RAG backend (Azure OpenAI + Azure AI Search + Azure AI Content Safety). Microsoft Entra ID gates the phased rollout. Azure Commercial likely sufficient; Azure Government TBC.
- **Anchor risks driving every control:**
  1. **Voter disenfranchisement** from hallucinated polling dates, deadlines, or rules
  2. **Political neutrality** breach (chatbot endorses or appears to favor)
  3. **Accessibility** non-compliance (IITAA 2.1 / WCAG 2.1 AA)
  4. **Privacy** drift — PIPA exposure if PII collected, BIPA exposure if voice/biometric inputs introduced
  5. **Public trust** — Illinois AG has already cautioned voters against using AI for election info
- **Validation method:** evidence-per-control matrix + gated phased deployment (Entra-only internal → named external testers → public with WAF + abuse monitoring).
- **Open items to close before client-facing version:** Azure Gov vs Commercial posture in IL; full text of DoIT AI Policy v2; IITAA self-audit owner; voter-data fence governance (content curator + refresh cadence).

---

## 1. Why this framework

### Why NIST AI RMF specifically
- DoIT publishes no AI-specific assurance framework; its AI Policy v2 (Apr 2025) is principles-based (oversight, transparency, data-quality ownership, human-in-loop, violations reporting).
- DoIT's enterprise security stack is built on **NIST CSF + NIST SP 800-53** (Moderate baseline floor). AI RMF shares vocabulary and reviewers will recognize the structure.
- Gives Krasan a defensible answer to "how do you know this is safe?" — we're not inventing, we're applying the federal reference framework that DoIT's own security policies cite.
- Aligns with the approach already used on DCFS pilot governance charter (consistency across Krasan-Illinois engagements).

### Why this is internal-only right now
- DoIT AI Policy v2 PDF needs full read before we cite specific clauses externally (currently summarized from search excerpts).
- Several "Microsoft side" choices (Azure Gov vs Commercial; ZDR opt-out; Copilot Studio vs raw Foundry) are open and benefit from internal alignment first.
- The "approach" needs Jay/Sandip sign-off before becoming a slide in the Path Forward deck or a client artifact.

---

## 2. Applicable DoIT + Illinois policies

| # | Policy / Standard | Authority | What it requires | Citation |
|---|---|---|---|---|
| P1 | **DoIT AI Policy v2** (Apr 1, 2025) | Illinois DoIT | Utilizing-agency owns training-data quality + governance; mandatory human oversight; human-in-loop intervals; transparent stakeholder communication; violations to DoIT.Security@illinois.gov | [doit.illinois.gov AI policy PDF](https://doit.illinois.gov/content/dam/soi/en/web/doit/documents/support/policies/2021/20250401-DoIT-AI%20Policy-v2-A11Y.pdf) |
| P2 | **IITAA 2.1** (eff. June 24, 2024) | Illinois DoIT | WCAG 2.1 Level AA + Section 508; self-validate (no state cert path) | [IITAA 2.1 Standards](https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-2-1-standards.html) |
| P3 | **DoIT Enterprise Information Security Policy** | Illinois DoIT | NIST CSF + 800-53 baseline; Access Control, SC, SA&A, Contingency Planning sub-policies | [DoIT cybersecurity policies](https://doit.illinois.gov/initiatives/cybersecurity/policies.html) |
| P4 | **Data Security on Government Computers Act** | 20 ILCS 450 | Reasonable security for state data on state devices and third parties | — |
| P5 | **PIPA** (Personal Information Protection Act) | 815 ILCS 530 | Breach notification + reasonable security for personal info | — |
| P6 | **BIPA** (Biometric Information Privacy Act) | 740 ILCS 14 | Written consent + retention policy for biometric identifiers — only triggers if voice/face/retina collected | — |
| P7 | **Illinois Procurement Code** + BidBuy | 30 ILCS 500 | Standard SaaS/cloud procurement; no AI-specific statute | [IITAA procurement guidance](https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-procurement.html) |
| P8 | **HAVA + EAC AI guidance** (Feb 2024) | Federal | HAVA security funds usable for voter-education AI; testing and accuracy emphasized | [eac.gov/AI](https://www.eac.gov/AI) |
| P9 | **CISA "Risk in Focus: GenAI & 2024 Election Cycle"** | Federal | Amplifies existing election risks; emphasizes pre-deployment testing | [CISA brief](https://www.cisa.gov/resources-tools/resources/risk-focus-generative-ai-and-2024-election-cycle) |

**Not directly applicable but flagged:** HB3773 (AI in employment, eff. Jan 1, 2026) — does not reach voter chatbot. SOPPA (K-12 only). No Illinois "AI Bill of Rights."

---

## 3. Validation matrix — NIST AI RMF → DoIT → Microsoft

The matrix below is the heart of the approach. For each AI RMF sub-function we name the DoIT requirement satisfied, the Microsoft control that delivers it, and the evidence Krasan must produce before pilot-to-prod gate. Rows kept short; expand per-control in v0.2.

### 3.1 GOVERN — accountability, lifecycle policy, culture

| AI RMF sub-fn | DoIT req | Microsoft control / mechanism | Validation evidence |
|---|---|---|---|
| GOVERN 1.1 — Legal & regulatory mapping | P1, P2, P3 | N/A (governance artifact) | Signed policy register: this doc, ratified by SBE + Krasan + DoIT |
| GOVERN 1.2 — Risk management roles defined | P1 (human oversight) | N/A | RACI: SBE = system owner; Krasan = build/test; DoIT.Security = compliance reviewer; named human-in-loop monitor |
| GOVERN 1.4 — Decisions documented | P1 (transparent communication) | Azure AI Foundry evaluations + run history | Architecture Decision Records (ADRs) per design choice |
| GOVERN 1.5 — Incident response process | P1 (violations to DoIT.Security) | Azure Monitor + Sentinel + Defender for AI | Incident runbook: detection → notification chain → DoIT.Security@ |
| GOVERN 1.7 — Decommissioning plan | P1 lifecycle | N/A | End-of-life plan: data deletion, index destruction, ZDR confirmation |
| GOVERN 2.1 — Roles & competencies | P1 | N/A | Training plan for SBE staff who operate the bot (content curators, escalation handlers) |
| GOVERN 3.2 — Diverse perspectives | — | N/A | Pilot tester roster includes LEP, accessibility users, election-admin SMEs |
| GOVERN 4.1 — Workforce empowered to flag risks | P1 | Copilot Studio escalation topics; "report a problem" button in canvas | Escalation flow tested in pilot |
| GOVERN 5 — Third-party assessment | P3 800-53 SA-9 | Microsoft SOC 2, FedRAMP, ISO 27001 attestations | Vendor risk file with current attestation links |
| GOVERN 6 — Inventory & cataloguing | P1 | Azure resource tags, Foundry project inventory | Asset register including model versions, dataset versions, index version |

### 3.2 MAP — context, intended use, risks, impacts

| AI RMF sub-fn | DoIT req | Microsoft control | Validation evidence |
|---|---|---|---|
| MAP 1.1 — Intended purpose documented | P1 (transparency) | System prompt + Foundry project README | Statement of intended use signed by SBE: scope = voter FAQs only; out-of-scope = candidate/party info, legal advice, vote prediction |
| MAP 2.1 — System categorisation | P3 (800-53 RMF Categorize) | N/A | NIST 800-60 categorization: confidentiality LOW (public data), integrity MODERATE (voter harm if wrong), availability LOW-MODERATE |
| MAP 3.1 — Benefits & costs | P1 | N/A | Brief: alternative is "no chatbot" — quantify the gap (volume of call-center load, hours wait, languages) |
| MAP 4.1 — Impacts on individuals & groups | P2 IITAA, AG voter caution | Copilot Studio multi-lang, Azure AI Translator | Impact assessment covering: LEP voters (Spanish, Polish, Chinese, etc.), disability users, elderly, first-time voters |
| MAP 5.1 — Risk inventory | P1, P8, P9 | Foundry risk register | Top-risk list: hallucinated deadline; partisan output; jailbreak extracting endorsements; prompt-injection from voter input; out-of-date polling location |
| MAP 5.2 — Likelihood & impact rated | — | Foundry evaluations | Risk matrix with mitigations mapped to MEASURE/MANAGE controls below |

### 3.3 MEASURE — testing, validation, monitoring (the heaviest section)

| AI RMF sub-fn | DoIT req | Microsoft control | Validation evidence |
|---|---|---|---|
| MEASURE 1.1 — Approach selected | P1 (governance), P3 (assessment) | Azure AI Foundry **evaluations** (built-in metrics: groundedness, relevance, fluency, retrieval) + custom evaluators | Test plan v1 |
| MEASURE 2.1 — Trustworthy characteristics evaluated | — | Foundry safety evaluations + Content Safety | Trust dashboard: groundedness ≥ X, jailbreak block rate, neutrality eval pass rate |
| MEASURE 2.2 — Hallucination / accuracy | P1, P8 EAC accuracy | **Azure AI Content Safety — Groundedness Detection** (flag + auto-correct API); manual SME review of 200+ Q-A pairs against IBOE source-of-truth | Accuracy attestation signed by SBE election ops |
| MEASURE 2.3 — Political neutrality | P1 (governance) | Content Safety **custom blocklists** (candidate names, party slogans, "who should I vote for" patterns); system prompt neutrality directives; Foundry evaluations for political-stance leak | Red-team report on neutrality probes |
| MEASURE 2.4 — Adversarial robustness | P3 800-53 SA-11 | **Prompt Shields** (direct = jailbreak; indirect = XPIA from injected web content) | Prompt-injection test suite results |
| MEASURE 2.5 — Privacy | P5 PIPA, P6 BIPA | Content Safety PII detection; no audio/biometric inputs (BIPA scope-out); ZDR / abuse-monitoring opt-out for Azure OpenAI | Data flow diagram + ZDR confirmation letter from Microsoft |
| MEASURE 2.6 — Security | P3, P4 | Entra ID + Private Endpoint + Key Vault + Defender for AI | 800-53 SCA assessment summary; pen-test (light) on the web embed |
| MEASURE 2.7 — Accessibility | P2 IITAA 2.1 | Copilot Studio VPAT 2.5 / WCAG 2.2 conformance | Independent IITAA audit (third-party, not Microsoft VPAT alone) covering hosted page + chat canvas; keyboard, screen reader (JAWS, NVDA), color contrast, no timeouts |
| MEASURE 3.1 — Continuous monitoring | P1 oversight | Azure Monitor + Log Analytics + Foundry trace | Live monitoring dashboard, weekly review cadence |
| MEASURE 3.2 — Feedback loop | P1 transparency | Copilot Studio user-feedback (thumbs / "report a problem") | Feedback triage SLA + monthly trend report |

### 3.4 MANAGE — operations, response, change

| AI RMF sub-fn | DoIT req | Microsoft control | Validation evidence |
|---|---|---|---|
| MANAGE 1.1 — Risk treatment | All | N/A | Treatment register: each top risk has mitigation + residual rating + accepted by SBE |
| MANAGE 2.1 — Change management | P1 lifecycle | Foundry version pins + deployment slots; Azure DevOps / GitHub | Change-control SOP; model upgrade gate (re-run MEASURE suite before promote) |
| MANAGE 3.1 — Incident handling | P1, P5 PIPA breach | Sentinel playbook; PIPA notification template | Tabletop exercise log |
| MANAGE 4.1 — Decommissioning | — | Index delete + resource teardown scripts | Documented runbook |

---

## 4. Reference architecture (proposed)

```
┌────────────────────────────────────────────────────────────────────┐
│   PUBLIC: elections.il.gov (modernized SBE website)                │
│   ┌──────────────────────────────────────────────────────────┐    │
│   │  Web chat canvas (Copilot Studio web embed)              │    │
│   │  • IITAA-tested, keyboard + screen reader                │    │
│   │  • Strong disclaimer + "verify at official source" CTA    │    │
│   └────────────────────────────┬─────────────────────────────┘    │
└────────────────────────────────┼──────────────────────────────────┘
                                 │ HTTPS, WAF, rate limit
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│   AZURE COMMERCIAL (region TBC — Central US or East US 2)          │
│                                                                    │
│   Copilot Studio agent  ─── Entra ID auth (pilot) / anon (prod)   │
│         │                                                          │
│         ├──► Azure AI Content Safety                               │
│         │     • Prompt Shields (direct + indirect)                 │
│         │     • Groundedness Detection (+ auto-correct)            │
│         │     • Custom blocklists (candidates / parties / patterns)│
│         │                                                          │
│         ├──► Azure AI Foundry / Azure OpenAI                       │
│         │     • Model: GPT-4o or GPT-4.1 (latest GA)               │
│         │     • Modified Abuse Monitoring + ZDR (requested)        │
│         │     • Private Endpoint, customer-managed keys            │
│         │                                                          │
│         └──► Azure AI Search (the "Fence")                         │
│               • Hybrid: BM25 + vector (HNSW) + semantic ranker    │
│               • Index: approved IBOE PDFs, statute references,    │
│                        polling-location feed, voter-reg flows      │
│               • Curation owner: SBE; refresh cadence: TBC          │
│                                                                    │
│   Observability: Azure Monitor + Log Analytics + Foundry trace    │
│   Security: Sentinel + Defender for AI                             │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. Phased deployment gates ("Safe-Launch")

The PPT's Slide 4 already calls out a phased pilot. Concretizing the gates:

| Phase | Audience | Auth | Required gate evidence to advance |
|---|---|---|---|
| **0 — Build** | Krasan dev team | Entra (Krasan tenant) | RAG index seeded; baseline evals green |
| **1 — Internal pilot** | SBE staff only | Entra (SBE group) | MEASURE suite passed: groundedness, blocklists, prompt shields, accessibility automated checks |
| **2 — Closed beta** | Named external testers (LEP / accessibility / election admins) | Entra (invited group) | Independent IITAA audit pass; red-team report; SBE legal review |
| **3 — Public soft launch** | Public, but feature-gated (banner: "beta — verify with official source") | Anonymous | DoIT.Security review sign-off; Sentinel + monitoring dashboards live |
| **4 — GA** | Public, full launch | Anonymous | 30-day stability window; feedback triage SLA in place; incident runbook tabletop'd |

Rollback criterion at every gate: any failure in MEASURE 2.2 (accuracy), 2.3 (neutrality), or 2.7 (accessibility) blocks promotion. Gate decisions logged in change-control SOP.

---

## 6. Open questions / Vinay TBD

Tracked as decisions to close before circulating v0.2 to Jay/Sandip.

1. **Azure Gov vs Azure Commercial** — voter-FAQ data is public, so Commercial likely fine; need DoIT confirmation. *Owner: TBD (recommend asking DoIT.Security directly).*
2. **Full DoIT AI Policy v2 text** — research summarized from excerpts; pull clean PDF and verify clause-by-clause before any clause we cite externally. *Owner: TBD.*
3. **IITAA self-audit owner** — DoIT requires agency self-validation. Is Krasan delivering the audit, or is SBE engaging a third-party (e.g., Level Access, Deque)? *Owner: TBD.*
4. **Voter-data "fence" governance** — what exact content goes in the AI Search index, who at SBE owns curation, refresh cadence (especially close to election dates). *Owner: TBD.*
5. **BIPA scope-out** — confirm chatbot is text-only, no voice input or webcam. Get this written into the system definition. *Owner: TBD.*
6. **ZDR / Modified Abuse Monitoring opt-out** — initiate the Microsoft customer-managed request. Worth pursuing for "voter data sovereignty" optics even if data is public. *Owner: TBD.*
7. **Public-trust messaging** — Illinois AG has cautioned voters against AI for election info. Need a disclaimer + "verify at official source" CTA strategy aligned with SBE comms. *Owner: TBD.*
8. **Procurement vehicle** — assume Krasan delivers under existing SBE engagement; no new RFP. Confirm with Sandip.
9. **Krasan role** — is this a Krasan-led pilot, an SBE-led pilot with Krasan advisory, or a vendor co-build? Affects who owns evidence artifacts.
10. **Model selection** — GPT-4o / GPT-4.1 vs smaller (GPT-4o-mini) for cost; gated by accuracy evals.

---

## 7. Benchmarks (state precedents)

For credibility when speaking to SBE / DoIT:
- **California SOS "Sam"** — first state elections chatbot (Microsoft AI/bot services).
- **Arizona SOS 2024** — 655K+ chatbot interactions + 550K+ SMS voter-assist messages.
- **NY DMV / CA SoS** chatbots — non-election but state-agency precedent.
- Cautionary: [Proof News / CBS study](https://www.cbsnews.com/news/ai-chatbots-inaccurate-election-information-proof-news/) on AI election-info inaccuracy — reinforces *why* the RAG fence + groundedness + blocklists are non-negotiable.

---

## 8. What v0.2 / next steps look like

- Close 5+ of the 10 open items above
- Pull and verify DoIT AI Policy v2 full text
- Add concrete acceptance thresholds (e.g., "groundedness ≥ 0.9 on 200-question gold set")
- Draft 1–2 slides for Jay's deck (lift the matrix headline + phased gates)
- Draft email reply to Jay's thread once internal alignment reached

---

## References

**Illinois DoIT / state**
- [DoIT AI Policy v2 (Apr 1, 2025) PDF](https://doit.illinois.gov/content/dam/soi/en/web/doit/documents/support/policies/2021/20250401-DoIT-AI%20Policy-v2-A11Y.pdf)
- [IITAA 2.1 Standards](https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-2-1-standards.html)
- [IITAA Procurement Guidance](https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-procurement.html)
- [DoIT Cybersecurity Policies](https://doit.illinois.gov/initiatives/cybersecurity/policies.html)
- [GenAI & NLP Task Force Report (Dec 2024)](https://doit.illinois.gov/content/dam/soi/en/web/doit/meetings/ai-taskforce/reports/2024-gen-ai-task-force-report.pdf)

**Federal / elections**
- [EAC AI page](https://www.eac.gov/AI)
- [CISA: Risk in Focus — GenAI & 2024 Election Cycle](https://www.cisa.gov/resources-tools/resources/risk-focus-generative-ai-and-2024-election-cycle)
- [Brennan Center: Safeguards for AI in Election Administration](https://www.brennancenter.org/our-work/research-reports/safeguards-using-artificial-intelligence-election-administration)

**Microsoft / Azure architecture**
- [Baseline Azure AI Foundry Chat Reference Architecture](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/architecture/conversational-bot)
- [Hybrid search in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview)
- [Semantic Ranker](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview)
- [Azure AI Content Safety — what's new](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/whats-new)
- [Prompt Shields](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection)
- [Data, privacy, and security for Azure OpenAI](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy)
- [Azure OpenAI abuse monitoring (opt-out)](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/abuse-monitoring?view=foundry-classic)
- [Azure OpenAI in Azure Government](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/azure-government?view=foundry-classic)
- [Azure OpenAI Data Zones](https://azure.microsoft.com/en-us/blog/announcing-the-availability-of-azure-openai-data-zones-and-latest-updates-from-azure-ai/)

**Precedents**
- [California SOS elections chatbot "Sam"](https://www.sos.ca.gov/administration/news-releases-and-advisories/2020-news-releases-and-advisories/ap20089-secretary-state-alex-padilla-launches-new-elections-chatbot)
- [Arizona SOS final AI/elections report](https://azsos.gov/news/903)
