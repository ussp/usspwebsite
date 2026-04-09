# Change: Add OpenSpecMatch — Spec-Based Matching Engine

## Why
The current ATS resume matching engine uses string-based keyword matching with 360 hardcoded synonyms, producing poor-quality results. Skills have no level awareness, certifications use fragile substring matching, location is string inclusion, and recruiter feedback is collected but never used. USSP also needs RFP response matching and grant matching — all three are the same Demand vs. Capability comparison pattern.

## What Changes
- Add new `packages/openspecmatch/` — standalone, domain-agnostic matching engine
- Define three spec schemas: DemandSpec, CapabilitySpec, MatchResult
- Build hierarchical capability taxonomy (~1,350 nodes across 8 trees)
- Build LLM-powered extractors (resume, position, RFP, grant, company)
- Build customizable scoring engine with pluggable profiles
- Integrate with existing ATS (platform-core consumes as local dependency)
- **Phase 1:** Resume matching (replace current engine)
- **Phase 2:** RFP matching with multi-entity Combinator
- **Phase 3:** Grant/nonprofit matching (port from InstaGrants research)

## Impact
- Affected specs: openspecmatch (new capability)
- Affected code:
  - `packages/openspecmatch/` (new package)
  - `packages/platform-core/src/matching/` (deprecated, replaced by adapter)
  - `packages/platform-core/src/queries/admin/matching.ts` (updated to use openspecmatch)
  - `packages/backoffice/src/app/api/positions/[id]/matches/route.ts` (updated)
- Breaking: Match score internals change (per-item breakdown replaces 8-dimension flat scores)
- Non-breaking: API response shape stays compatible (overallScore, confidence, matchAreas, gapAreas)
- Reference: Full design doc at `docs/openspec-spec-matching.md`
