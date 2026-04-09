## Context
OpenSpecMatch is a new matching engine replacing the current string-based resume matcher in platform-core. It must work as a standalone package (extractable to its own repo later) while being developed inside the USSP monorepo. Full design doc: `docs/openspec-spec-matching.md`.

## Goals / Non-Goals
- Goals: Improve matching quality via structured specs, support resume + RFP + grant matching, resellable as standalone product
- Non-Goals: Building a UI for OpenSpecMatch (consumers provide their own), replacing Supabase or changing the database layer, building a SaaS API (future)

## Decisions
- Decision: Monorepo-first, extract later. Package at `packages/openspecmatch/` with zero USSP coupling.
  - Alternatives: Standalone repo from day one (rejected: adds publish/version overhead during rapid iteration)
- Decision: LLM-agnostic with Anthropic + OpenAI adapters. Customer provides their own key.
  - Alternatives: Claude-only (rejected: limits resellability)
- Decision: Static TypeScript taxonomy files, not DB-backed.
  - Alternatives: Database-backed taxonomy (rejected for v1: adds complexity, deploy required anyway for schema changes)
- Decision: Three-tier operation (full/standard/minimal) — works without LLM at reduced quality.
  - Alternatives: LLM-required (rejected: npm package must work with zero API keys)
- Decision: Port InstaGrants code (Python → TypeScript) for Phase 3 extractors. Code is AI-generated, untested — must add full test coverage.
  - Alternatives: Rewrite from scratch (rejected: code is well-structured, porting is faster than rewriting)

## Risks / Trade-offs
- LLM extraction quality varies by provider and model → Mitigation: fixture-based regression tests, fallback to rule-based
- Taxonomy grows large → Mitigation: lazy loading, tree shaking for unused domains
- Parallel run period may confuse recruiters with different scores → Mitigation: clearly label "new engine (beta)" in UI

## Migration Plan
1. Build openspecmatch package with full test coverage
2. Add adapter in platform-core
3. Run old + new engines in parallel for 2 weeks (log both, display new)
4. Compare recruiter feedback
5. Disable old engine, remove deprecated code

## Open Questions
- NPM registry for external customers: private (GitHub Packages) or public npm?
- Pricing model for SaaS mode (future): per-extraction, monthly, or free tier?
- Taxonomy governance: USSP maintains core, customers extend only?
