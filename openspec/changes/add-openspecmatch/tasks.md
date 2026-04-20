## 1. Foundation
- [x] 1.1 Initialize `packages/openspecmatch/` with package.json, tsconfig, vitest config
- [x] 1.2 Define common types (ProficiencyLevel, Criticality, TaxonomyRef, Evidence)
- [x] 1.3 Define DemandSpec interface and schema validation (Zod)
- [x] 1.4 Define CapabilitySpec interface and schema validation (Zod)
- [x] 1.5 Define SpecMatchResult interface and schema validation (Zod)
- [x] 1.6 Define ScoringProfile interface
- [x] 1.7 Write unit tests for all type definitions and Zod schemas

## 2. Taxonomy
- [x] 2.1 Define TaxonomyNode interface and TaxonomyTree structure
- [x] 2.2 Build technology tree (languages, frameworks, cloud, data, security, enterprise, PM tools, GIS, BA skills — 300+ nodes)
- [x] 2.3 Build certifications tree (individual + organizational — 60+ nodes)
- [x] 2.4 Build education tree (degrees, fields, levels — 20+ nodes)
- [x] 2.5 Build domain-knowledge tree (sectors, industry verticals, compliance, procurement — 200+ nodes)
- [x] 2.6 Build soft skills tree (leadership, communication, collaboration — 15+ nodes)
- [x] 2.7 Build infrastructure tree (DC, networking, storage — for Phase 2 RFP matching) *(landed via add-rfp-matching-phase2 §1)*
- [x] 2.8 Build financial tree (turnover, bonds, capacity — for Phase 2 RFP matching) *(landed via add-rfp-matching-phase2 §2)*
- [x] 2.9 Build manpower tree (team composition, roles — for Phase 2 RFP matching) *(landed via add-rfp-matching-phase2 §3)*
- [x] 2.10 Implement static alias resolver (normalizeSkill equivalent)
- [x] 2.11 Implement taxonomy relationship calculator (exact/parent/child/sibling/related)
- [x] 2.12 Build DB-backed custom taxonomy extensions (taxonomy_nodes table)
- [x] 2.13 Build unresolved skills tracking (unresolved_skills table)
- [ ] 2.14 Write unit tests for resolver (alias lookup, relationship detection)
- [ ] 2.15 Write unit tests for each taxonomy tree (node count, alias coverage, no orphans)
- [x] 2.16 Audit taxonomy against real USSP data — achieved 100% resolution (91/91 position skills, 176/176 resume items)

## 3. Extractors
- [x] 3.1 Define Extractor interface (sync + async)
- [x] 3.2 Build PositionExtractor (position DB record → DemandSpec) — includes sector, compliance, clearance, domain knowledge
- [x] 3.3 Build LLMResumeExtractor (resume text → CapabilitySpec via LLM) — Anthropic + OpenAI adapters
- [x] 3.4 Build rule-based ResumeExtractor (no LLM, regex/pattern-based) — skills, certs, education, domain knowledge, soft skills
- [x] 3.5 Build PDF/DOCX text extraction (pdf-parse for PDFs, XML parsing for DOCX)
- [x] 3.6 Wire resume text extraction on application upload (non-blocking, stores to resumes table)
- [x] 3.7 Create resume test fixtures (3 synthetic + 10 real USSP resumes)
- [x] 3.8 Create position test fixtures (4 synthetic + 17 real USSP positions with requirements)
- [ ] 3.9 Create expected output fixtures (what extraction should produce for each fixture)
- [ ] 3.10 Write unit tests for PositionExtractor
- [ ] 3.11 Write unit tests for ResumeExtractor (LLM-mocked)

## 4. Scoring Engine
- [x] 4.1 Build Comparator (compare one DemandItem vs one CapabilityItem)
- [x] 4.2 Build Matcher (compare full DemandSpec vs full CapabilitySpec)
- [x] 4.3 Build Scorer (weighted aggregation with profile config)
- [x] 4.4 Implement mandatory gate logic (mandatoryIsGate)
- [x] 4.5 Implement level curve scoring
- [x] 4.6 Implement evidence strength scoring
- [x] 4.7 Implement recency decay scoring
- [x] 4.8 Implement taxonomy match scoring
- [x] 4.9 Implement confidence calculation
- [x] 4.10 Implement location matching (20+ metro areas, state abbreviations, remote/hybrid/onsite compatibility)
- [x] 4.11 Implement sector matching (federal/state/local/commercial/nonprofit/education/healthcare)
- [ ] 4.12 Write unit tests for Comparator (exact match, level diff, sibling, no match, evidence)
- [ ] 4.13 Write unit tests for Scorer (mandatory gate, category weights, criticality multipliers)
- [ ] 4.14 Write unit tests for location matcher

## 5. Scoring Profiles
- [x] 5.1 Create software-engineer profile
- [x] 5.2 Create healthcare-clinical profile
- [ ] 5.3 Build profile loader (from JSON file)
- [x] 5.4 Build profile registry (lookup by ID)
- [ ] 5.5 Write unit tests for profile loading and validation

## 6. Public API
- [x] 6.1 Create OpenSpecMatchEngine class (main entry point)
- [x] 6.2 Wire up extractResume(), extractResumeAsync(), extractPosition() methods
- [x] 6.3 Wire up match(), matchBatch(), matchResume(), matchResumes(), matchResumeAsync(), matchResumesAsync()
- [x] 6.4 Wire up taxonomy and profile registries
- [ ] 6.5 Implement minimal mode (basic string matching fallback)
- [x] 6.6 Export public types from index.ts
- [x] 6.7 Write integration tests (resume → extract → match → result) — 15 integration tests

## 7. Integration with USSP ATS
- [x] 7.1 Add `@openspecmatch/engine` as file: dependency in platform-core
- [x] 7.2 Create adapter in platform-core (converts USSP data → OpenSpecMatch specs → MatchResult)
- [x] 7.3 Update matching.ts query to use OpenSpecMatch as primary engine
- [x] 7.4 Run both engines in parallel (log score differences > 20 for monitoring)
- [x] 7.5 Seed position requirements for 17 active positions
- [x] 7.6 Extract and store resume text for 6 candidates from Supabase storage
- [x] 7.7 Test against real USSP data — correct rankings across 4 position types
- [ ] 7.8 Write integration tests for adapter layer

## 8. Living Taxonomy System
- [x] 8.1 Create taxonomy_nodes DB table (migration 0024)
- [x] 8.2 Create unresolved_skills DB table (migration 0024)
- [x] 8.3 Build taxonomy CRUD queries in platform-core
- [x] 8.4 Build backoffice taxonomy admin page (app.ussp.co/taxonomy)
- [x] 8.5 Build API routes (GET/POST /api/taxonomy, GET/PATCH/DELETE /api/taxonomy/[id])
- [x] 8.6 Build promote script (scripts/promote-taxonomy.ts) — exports mature custom nodes to base package
- [x] 8.7 Add taxonomy link to admin sidebar

## 9. Fixture-Based Regression Tests
- [ ] 9.1 Create 7+ fixture pairs (resume + position + expected match result)
- [ ] 9.2 Build test runner that validates scores are within expected ranges
- [ ] 9.3 Ensure all fixture tests pass

## 10. Documentation
- [ ] 10.1 Write user guide: Chapter 1 (Overview)
- [x] 10.2 Write user guide: Chapter 2 (For Recruiters) — docs/matching-algorithm.md
- [ ] 10.3 Write user guide: Chapter 3 (Scoring Profiles)
- [ ] 10.4 Write user guide: Chapter 4 (Taxonomy Management)
- [ ] 10.5 Write user guide: Chapter 5 (For Developers)
- [ ] 10.6 Write API reference
- [ ] 10.7 Write README.md for the package
- [x] 10.8 Create example scripts — examples/match-resume.ts, examples/compare-extractors.ts

## 11. Cutover
- [ ] 11.1 Monitor parallel run for 2 weeks
- [ ] 11.2 Compare recruiter feedback on old vs new scores
- [ ] 11.3 Disable old matching engine
- [ ] 11.4 Remove deprecated `matching/` directory from platform-core

## 12. LLM-Powered Extraction Pipeline (Future)
- [ ] 12.1 Add LLM extraction as part of resume upload pipeline (on upload → extract with Claude/GPT → store)
- [ ] 12.2 Build resume upload webhook/trigger that calls LLMResumeExtractor
- [ ] 12.3 Store LLM-extracted CapabilitySpec alongside raw text in resumes table
- [ ] 12.4 Use pre-extracted CapabilitySpec in matching (skip re-extraction, faster scoring)
- [ ] 12.5 Add cost tracking for LLM extraction calls (per-resume API cost)
- [ ] 12.6 Build LLM fallback taxonomy resolver with caching (unknown skills → LLM classifies → cache)
- [ ] 12.7 Compare rule-based vs LLM extraction quality on 50+ real resumes
- [ ] 12.8 Switch scoring to use LLM-extracted specs when available, rule-based as fallback

## 13. Phase 2: RFP Matching (delivered via add-rfp-matching-phase2)
- [x] 13.1 Build RFP extractor (PDF → DemandSpec with financial, compliance, manpower items) *(landed via add-rfp-matching-phase2 §4 — RFPExtractor + LLMRFPExtractor)*
- [x] 13.2 Build Company extractor (company profile → CapabilitySpec) *(landed via add-rfp-matching-phase2 §5 — CompanyExtractor + LLMCompanyExtractor)*
- [x] 13.3 Build Combinator (multi-entity matching: USSP + partners vs RFP requirements) *(landed via add-rfp-matching-phase2 §6)*
- [x] 13.4 Build infrastructure, financial, manpower taxonomy trees *(landed via add-rfp-matching-phase2 §1-3)*
- [x] 13.5 Create RFP scoring profile *(landed via add-rfp-matching-phase2 §7 — GOVERNMENT_RFP_PROFILE)*
- [x] 13.6 Build bid/no-bid recommendation engine *(landed via add-rfp-matching-phase2 §8 — recommender + matchRFP)*
