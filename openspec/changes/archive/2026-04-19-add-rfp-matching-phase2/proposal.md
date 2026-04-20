# Change: Add RFP Matching (Phase 2) to OpenSpecMatch

## Why

The `add-openspecmatch` change delivered Phase 1 (resume matching) and explicitly reserved §13 "Phase 2: RFP Matching" as future work. We now have a real engagement — the **Fleettronix / AIS 140 Monitoring Centre** pre-RFP pitch to the Andhra Pradesh Transport Minister — that needs structured bid/no-bid scoring against a Government RFP.

A stopgap ran through the existing engine with hand-authored fixtures (`packages/openspecmatch/examples/fleettronix-rfp/`). It proved the DemandSpec/CapabilitySpec schema already supports RFP-shaped data, but exposed two limits:

1. **No extractors for RFP PDFs or company profiles** — every spec has to be hand-written.
2. **No taxonomy coverage for RFP categories** — infrastructure, financial, manpower items fall back to text similarity, which produces false-negative mandatory failures (e.g. demand "ERSS integration" vs capability "emergency routing" scores 0).

This proposal formalises Phase 2. Fleettronix is the reference fixture: the hand-authored files become the first real test case the extractors must be able to reproduce.

## What Changes

### 1. Taxonomy trees for RFP categories

- **infrastructure** tree — cloud providers (NIC Cloud, AWS, Azure), integration hubs (VAHAN, ERSS/Dial-112, SMS gateway), hosting/connectivity, physical MC equipment, GIS/mapping (Survey of India), monitoring + alert categories.
- **financial** tree — turnover brackets, bank-guarantee capacity, EMD capability, working-capital position, milestone cash-flow types.
- **manpower** tree — team-composition roles (PIU, nodal officer, helpdesk, MC operators), language coverage, 24×7 coverage, delivery/PM roles.

### 2. RFP Demand Extractor

- Input: RFP PDF + supporting scheme docs + structured metadata.
- Output: `DemandSpec` with `domain: "rfp"`, grouped `DemandItem`s in Phase-2 categories (compliance, infrastructure, financial, manpower, past_performance, geographic).
- LLM-assisted for free-form extraction; rule-based normalisation for citation-style requirements (Gazette clauses, annexure features).

### 3. Company Capability Extractor

- Input: company profile (pitch deck, overview doc, filings).
- Output: `CapabilitySpec` with `domain: "company"`.
- Detects capability items, evidence (deployment count, turnover, references), and cross-links Evidence records to source doc + page.

### 4. Multi-entity Combinator

- Input: N `CapabilitySpec`s (primary bidder + N-1 partners) + a "combination policy" (who claims what).
- Output: a single combined `CapabilitySpec` representing the consortium.
- Records per-item attribution so bid teams can see which entity supplies each capability.

### 5. `government-rfp` scoring profile (built-in)

- `mandatoryIsGate: true` — missing a compliance/infrastructure mandatory = gate failure.
- Category weights tuned for Govt RFP: compliance 25, infrastructure 30, manpower 12, financial 10, past_performance 18, geographic 5.
- Evidence-weighted (`0.45`) with 48-month recency half-life (Govt values proven track record).

### 6. Bid/no-bid recommendation output

- Extends `SpecMatchResult` with a `recommendation` section: `GO | GO_WITH_REMEDIATION | NO_GO`, surfaced failed-mandatory items with remediation effort estimates, and a dollarised exposure if PBG/EMD items fail.

### 7. Fleettronix reference fixture (promoted)

- Hand-authored files in `examples/fleettronix-rfp/` are promoted into `__tests__/fixtures/fleettronix/`.
- An integration test asserts the new extractors, run against `projects/rfp/Fleettronix_VLTD_AIS140/` source docs, produce specs within tolerance of the hand-authored baselines.

## Impact

- **Affected specs:** `openspecmatch` (ADDED requirements — RFP matching sub-capability, multi-entity combination, government-rfp profile, bid/no-bid output).
- **Affected code:**
  - `packages/openspecmatch/src/taxonomy/trees/infrastructure.ts` (new)
  - `packages/openspecmatch/src/taxonomy/trees/financial.ts` (new)
  - `packages/openspecmatch/src/taxonomy/trees/manpower.ts` (new)
  - `packages/openspecmatch/src/extractors/rfp-extractor.ts` (new)
  - `packages/openspecmatch/src/extractors/llm-rfp-extractor.ts` (new)
  - `packages/openspecmatch/src/extractors/company-extractor.ts` (new)
  - `packages/openspecmatch/src/extractors/llm-company-extractor.ts` (new)
  - `packages/openspecmatch/src/engine/combinator.ts` (new)
  - `packages/openspecmatch/src/profiles/defaults.ts` (add `GOVERNMENT_RFP_PROFILE`)
  - `packages/openspecmatch/src/specs/match-result.ts` (extend with `recommendation`)
  - `packages/openspecmatch/src/engine/recommender.ts` (new)
- **Non-breaking:** all Phase 1 resume-matching behaviour unchanged.
- **Cross-reference:** tied to `add-openspecmatch` tasks §2.7, §2.8, §2.9, §13.1–§13.6. Those checkboxes are ticked as this change lands.
- **Reference fixture:** `projects/rfp/Fleettronix_VLTD_AIS140/` (AIS 140 Gazette PDF, VTS Guidelines PDF, Fleetronix deck, USSPPL ITR).
