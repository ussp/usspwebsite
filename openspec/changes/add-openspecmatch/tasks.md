## 1. Foundation
- [ ] 1.1 Initialize `packages/openspecmatch/` with package.json, tsconfig, vitest config
- [ ] 1.2 Define common types (ProficiencyLevel, Criticality, TaxonomyRef, Evidence)
- [ ] 1.3 Define DemandSpec interface and schema validation (Zod)
- [ ] 1.4 Define CapabilitySpec interface and schema validation (Zod)
- [ ] 1.5 Define SpecMatchResult interface and schema validation (Zod)
- [ ] 1.6 Define ScoringProfile interface
- [ ] 1.7 Write unit tests for all type definitions and Zod schemas

## 2. Taxonomy
- [ ] 2.1 Define TaxonomyNode interface and TaxonomyTree structure
- [ ] 2.2 Build technology tree (languages, frameworks, cloud, data, security — 500+ nodes)
- [ ] 2.3 Build certifications tree (individual + organizational — 200+ nodes)
- [ ] 2.4 Build education tree (degrees, fields, levels — 100+ nodes)
- [ ] 2.5 Build domain-knowledge tree (industry verticals — 150+ nodes)
- [ ] 2.6 Build infrastructure tree (DC, networking, storage — 200+ nodes)
- [ ] 2.7 Build compliance tree (regulatory, procurement — 100+ nodes)
- [ ] 2.8 Build financial tree (turnover, bonds, capacity — 50+ nodes)
- [ ] 2.9 Build manpower tree (team composition, roles — 50+ nodes)
- [ ] 2.10 Implement static alias resolver (normalizeSkill equivalent)
- [ ] 2.11 Implement taxonomy relationship calculator (exact/parent/child/sibling/related)
- [ ] 2.12 Implement LLM fallback resolver with caching
- [ ] 2.13 Write unit tests for resolver (alias lookup, relationship detection, LLM fallback)
- [ ] 2.14 Write unit tests for each taxonomy tree (node count, alias coverage, no orphans)

## 3. Extractors
- [ ] 3.1 Define Extractor interface
- [ ] 3.2 Build PositionExtractor (position DB record → DemandSpec)
- [ ] 3.3 Build ResumeExtractor (resume text → CapabilitySpec via LLM)
- [ ] 3.4 Build rule-based ResumeExtractor fallback (no LLM, regex/pattern-based)
- [ ] 3.5 Create resume test fixtures (5+ sample resumes: senior dev, junior dev, nurse, devops, data scientist)
- [ ] 3.6 Create position test fixtures (5+ sample positions with requirements)
- [ ] 3.7 Create expected output fixtures (what extraction should produce for each fixture)
- [ ] 3.8 Write unit tests for PositionExtractor
- [ ] 3.9 Write unit tests for ResumeExtractor (LLM-mocked)
- [ ] 3.10 Write unit tests for rule-based fallback extractor

## 4. Scoring Engine
- [ ] 4.1 Build Comparator (compare one DemandItem vs one CapabilityItem)
- [ ] 4.2 Build Matcher (compare full DemandSpec vs full CapabilitySpec)
- [ ] 4.3 Build Scorer (weighted aggregation with profile config)
- [ ] 4.4 Implement mandatory gate logic (mandatoryIsGate)
- [ ] 4.5 Implement level curve scoring
- [ ] 4.6 Implement evidence strength scoring
- [ ] 4.7 Implement recency decay scoring
- [ ] 4.8 Implement taxonomy match scoring
- [ ] 4.9 Implement confidence calculation
- [ ] 4.10 Write unit tests for Comparator (exact match, level diff, sibling, no match, evidence)
- [ ] 4.11 Write unit tests for Scorer (mandatory gate, category weights, criticality multipliers)
- [ ] 4.12 Write unit tests for confidence calculation

## 5. Scoring Profiles
- [ ] 5.1 Create software-engineer profile (JSON)
- [ ] 5.2 Create healthcare-clinical profile (JSON)
- [ ] 5.3 Build profile loader (from JSON file)
- [ ] 5.4 Build profile registry (lookup by ID)
- [ ] 5.5 Write unit tests for profile loading and validation

## 6. Public API
- [ ] 6.1 Create OpenSpecMatchEngine class (main entry point)
- [ ] 6.2 Wire up extract.resume(), extract.position() methods
- [ ] 6.3 Wire up match() and matchBatch() methods
- [ ] 6.4 Wire up taxonomy and profile registries
- [ ] 6.5 Implement 3-tier mode (full/standard/minimal)
- [ ] 6.6 Export public types from index.ts
- [ ] 6.7 Write integration tests (resume → extract → match → result)

## 7. Integration with USSP ATS
- [ ] 7.1 Add `@openspecmatch/engine` as file: dependency in platform-core
- [ ] 7.2 Create adapter in platform-core (converts USSP data → OpenSpecMatch specs)
- [ ] 7.3 Update matching.ts query to use OpenSpecMatch engine
- [ ] 7.4 Run both engines in parallel (log both, display new)
- [ ] 7.5 Write integration tests for adapter layer

## 8. Fixture-Based Regression Tests
- [ ] 8.1 Create 7+ fixture pairs (resume + position + expected match result)
- [ ] 8.2 Build test runner that validates scores are within expected ranges
- [ ] 8.3 Ensure all fixture tests pass

## 9. Documentation
- [ ] 9.1 Write user guide: Chapter 1 (Overview)
- [ ] 9.2 Write user guide: Chapter 2 (For Recruiters)
- [ ] 9.3 Write user guide: Chapter 3 (Scoring Profiles)
- [ ] 9.4 Write user guide: Chapter 4 (Taxonomy Management)
- [ ] 9.5 Write user guide: Chapter 5 (For Developers)
- [ ] 9.6 Write user guide: Chapter 6 (Troubleshooting)
- [ ] 9.7 Write API reference
- [ ] 9.8 Write README.md for the package
- [ ] 9.9 Create example project: resume-matching

## 10. Cutover
- [ ] 10.1 Monitor parallel run for 2 weeks
- [ ] 10.2 Compare recruiter feedback on old vs new scores
- [ ] 10.3 Disable old matching engine
- [ ] 10.4 Remove deprecated `matching/` directory from platform-core
