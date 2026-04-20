## Context

OpenSpecMatch Phase 1 (resume matching) is in production. Phase 2 (RFP matching) has been listed under `add-openspecmatch` tasks §13 as future work. The Fleettronix / AIS 140 engagement is the first real RFP-shaped use case and a hand-authored stopgap (`examples/fleettronix-rfp/`) already proved the core schema supports RFP data.

The existing engine already:

- Supports `DemandCategory` values for Phase 2 categories (compliance, infrastructure, financial, manpower, past_performance, geographic) — defined in `specs/common.ts`.
- Allows `DemandSpec.domain: "rfp"` and `CapabilitySpec.domain: "company"` — no schema change needed.
- Handles `taxonomyRef: null` with text-similarity fallback — functional but noisy.
- Supports custom scoring profiles via `registerProfile()`.

**Constraint:** Phase 1 behaviour must be untouched. All additions are additive.

**Stakeholders:** USSP-USSPPL-Fleetronix bid consortium (Veena, Anuradha, Anurag Kotha), future Govt RFP responders across other states.

## Goals / Non-Goals

### Goals

- Produce a `DemandSpec` from an RFP PDF without hand-authoring.
- Produce a `CapabilitySpec` from a company profile doc without hand-authoring.
- Combine multiple bidder profiles into a single consortium `CapabilitySpec`.
- Tighten taxonomy resolution for Phase 2 categories so text-similarity false negatives drop below 10%.
- Produce an actionable bid/no-bid `Recommendation` from any `SpecMatchResult`.
- Ship Fleettronix as a regression fixture the extractors must be able to reproduce.

### Non-Goals

- No automated web-crawling of RFP portals (manual upload only).
- No PBG/EMD capacity verification against bank feeds — capability metadata is self-declared.
- No price-bid modelling. This is a capability matcher, not a bidding tool.
- No replacement of the manual Minister-pitch process — this informs it, doesn't automate it.
- No domain-specific extractors beyond Govt RFP shape (no healthcare-RFP, no grant-specific extractors — Phase 3 deferred).

## Decisions

### D1. RFP extractor = rule-based skeleton + LLM augmentation

Govt scheme documents have two shapes: (a) cited clauses and annexure features (rule-based parseable), (b) free-text scope narrative (LLM-better). Decision: build both and merge into a single `DemandSpec`, deduplicating by semantic equivalence.

**Alternatives considered:**
- LLM-only: cheaper to build but fails for citation-heavy Govt docs where position is semantic (e.g. "Annexure B §2.7 Emergency Alert" is itself a handle the extractor must preserve).
- Rule-based only: can't handle narrative scope sections.

### D2. Multi-entity Combinator merges rather than stacks

When USSPPL + Fleetronix combine, capabilities overlap (both claim Hyderabad presence). Decision: merge overlapping items, keep highest `level`, union evidence, record attribution in item `metadata.contributors: string[]`.

**Alternatives considered:**
- Stack (keep all per-entity items separately): simpler but inflates match counts and breaks category-weight math.

### D3. `mandatoryIsGate: true` in `government-rfp` profile

Govt RFPs disqualify bidders on certification gaps (TAC, CERT-IN). Profile default must reflect that. Individual users can register a cloned profile with `mandatoryIsGate: false` for "what if we could waive this?" analysis.

### D4. `Recommendation` is additive on `SpecMatchResult`

Rather than a separate `RFPMatchResult` type, extend the existing result with an optional `recommendation` field. Keeps API surface small and lets Phase 1 consumers ignore it.

### D5. Fleettronix fixture over synthetic fixture

Decision: promote the existing hand-authored `examples/fleettronix-rfp/` into `__tests__/fixtures/fleettronix/` as the primary regression fixture. Synthetic fixtures drift from reality; this one is grounded in a real engagement.

**Trade-off:** the test suite now depends on real engagement docs staying in `projects/rfp/Fleettronix_VLTD_AIS140/`. Mitigation: the fixtures folder keeps its own snapshot of the essential text (not PDFs) so tests are self-contained even if project docs move.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| LLM RFP extractor hallucinates requirements not in the source | Cross-check with rule-based output; flag any LLM-only item as low-confidence; manual review step before producing final DemandSpec |
| Taxonomy trees under-cover Govt/Govt-tech vocabulary | Ship with 40-60 nodes per tree (not exhaustive), rely on `custom-taxonomy` DB extensions (§8 of add-openspecmatch) to grow over time |
| Combinator double-counts evidence across entities | Dedup by (category, resolved-taxonomy-node) and union evidence arrays; unit test |
| `Recommendation` verdict feels prescriptive when RFP scoring is really judgment-heavy | Surface blockers + remediation explicitly; verdict is a headline, not a final decision — doc makes this clear |
| Fleettronix fixture becomes stale (docs update, we lose regression signal) | Keep fixture text frozen in tests; refresh only via explicit test-fixture PR |

## Migration Plan

- No migrations required — additive change.
- Hand-authored `examples/fleettronix-rfp/` files remain during development; they move to `__tests__/fixtures/fleettronix/` when §9 lands.
- Downstream code (USSP ATS) unaffected — this change doesn't touch `matching.ts`.

## Open Questions

- Do we want a separate `InfrastructureTree` export or have `createDefaultResolver()` compose it automatically? *(Default: auto-compose; users always get full resolver.)*
- Should the LLM extractor consume `cache_control` for long RFP PDFs? *(Likely yes for Anthropic — Nirbhaya scheme + Gazette are repeated scorer inputs.)*
- Who owns the `custom-taxonomy` entries for this engagement — USSPPL back office taxonomy admin, or bid-team flat file? *(Defer to team-profiling flow; default to back-office admin.)*
