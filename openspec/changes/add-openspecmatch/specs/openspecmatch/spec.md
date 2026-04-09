## ADDED Requirements

### Requirement: Demand Spec Extraction
The system SHALL extract structured DemandSpec objects from unstructured source documents. A DemandSpec SHALL contain a list of DemandItems, each with category, taxonomy reference, proficiency level, criticality, and optional evidence requirements. The system SHALL support extraction from position database records (Phase 1), RFP PDFs (Phase 2), and grant announcements (Phase 3).

#### Scenario: Position record extraction
- **WHEN** a position record with required_skills, preferred_skills, education_level, min_experience_years, and required_certifications is provided
- **THEN** the system SHALL produce a DemandSpec with one DemandItem per requirement
- **AND** required_skills SHALL have criticality "mandatory"
- **AND** preferred_skills SHALL have criticality "preferred"
- **AND** each DemandItem SHALL have a resolved taxonomy reference where possible

#### Scenario: Position with no requirements
- **WHEN** a position record has no skills, certifications, or education listed
- **THEN** the system SHALL produce a DemandSpec with zero DemandItems
- **AND** the DemandSpec SHALL still be valid and matchable (producing low-confidence results)

#### Scenario: RFP PDF extraction (Phase 2)
- **WHEN** an RFP PDF text is provided
- **THEN** the system SHALL extract DemandItems across all applicable categories (technical_skill, financial, compliance, infrastructure, manpower, past_performance, geographic)
- **AND** each DemandItem SHALL include the raw text from the source document

#### Scenario: Grant announcement extraction (Phase 3)
- **WHEN** a grant announcement text is provided
- **THEN** the system SHALL extract DemandItems including mission_alignment, impact_evidence, target_population, organizational_capacity, sustainability, and collaboration categories

### Requirement: Capability Spec Extraction
The system SHALL extract structured CapabilitySpec objects from unstructured source documents. A CapabilitySpec SHALL contain a list of CapabilityItems, each with category, taxonomy reference, proficiency level, evidence, and recency. The system SHALL support extraction from resumes (Phase 1), company profiles (Phase 2), and organization profiles (Phase 3).

#### Scenario: Resume extraction with LLM
- **WHEN** resume text is provided and LLM is available (full mode)
- **THEN** the system SHALL produce a CapabilitySpec with CapabilityItems for each identified skill, certification, education, and domain knowledge
- **AND** each CapabilityItem SHALL have a proficiency level inferred from context (not just "has/doesn't have")
- **AND** proficiency level SHALL be one of: awareness, beginner, intermediate, advanced, expert
- **AND** each CapabilityItem SHALL include evidence extracted from the resume text

#### Scenario: Resume extraction without LLM
- **WHEN** resume text is provided and LLM is NOT available (standard mode)
- **THEN** the system SHALL produce a CapabilitySpec using rule-based pattern extraction
- **AND** proficiency levels SHALL default to "intermediate" when context is insufficient
- **AND** the result SHALL have lower confidence than LLM-extracted results

#### Scenario: Resume with minimal information
- **WHEN** a short resume with only a name, 2 skills, and 1 job is provided
- **THEN** the system SHALL produce a valid CapabilitySpec with few items and low confidence
- **AND** the system SHALL NOT error or return null

### Requirement: Capability Taxonomy
The system SHALL maintain a hierarchical capability taxonomy with multiple trees. Each taxonomy node SHALL have a unique path, human-readable label, aliases, parent reference, children, and related nodes. The taxonomy SHALL ship with default trees covering technology, certifications, education, domain-knowledge, infrastructure, compliance, financial, and manpower (~1,350+ nodes total).

#### Scenario: Alias resolution
- **WHEN** the string "k8s" is resolved against the taxonomy
- **THEN** the system SHALL return the node at path "technology.cloud-infrastructure.container-orchestration.kubernetes"
- **AND** the resolution confidence SHALL be 1.0 (exact alias match)

#### Scenario: Relationship detection
- **WHEN** the relationship between "react" and "angular" is computed
- **THEN** the system SHALL return "sibling" (both are children of the same frontend parent)

#### Scenario: LLM fallback resolution
- **WHEN** a skill string has no matching alias in the static taxonomy
- **AND** LLM is available (full mode)
- **THEN** the system SHALL send the string to the LLM with taxonomy context
- **AND** the system SHALL cache the resolved mapping for future lookups
- **AND** subsequent lookups for the same string SHALL NOT invoke the LLM

#### Scenario: No LLM available
- **WHEN** a skill string has no matching alias in the static taxonomy
- **AND** LLM is NOT available (standard mode)
- **THEN** the system SHALL return null (no match)
- **AND** the system SHALL NOT error

#### Scenario: Customer extends taxonomy
- **WHEN** a customer adds a new node via addNode()
- **THEN** the new node SHALL be resolvable by path and aliases
- **AND** the new node SHALL participate in relationship detection with existing nodes
- **AND** the default taxonomy nodes SHALL NOT be modified

### Requirement: Scoring Engine
The system SHALL compare a DemandSpec against one or more CapabilitySpecs and produce a SpecMatchResult. The scoring SHALL be configurable via ScoringProfiles that control category weights, criticality multipliers, level tolerance curves, mandatory gate behavior, evidence weight, recency decay, and taxonomy match scores.

#### Scenario: Basic match scoring
- **WHEN** a DemandSpec and CapabilitySpec are provided with a ScoringProfile
- **THEN** the system SHALL produce a SpecMatchResult with overallScore (0-100), confidence (0-100), per-item matches, strengths, gaps, and unknowns
- **AND** overallScore SHALL be the weighted aggregation of per-category scores

#### Scenario: Mandatory gate pass
- **WHEN** a ScoringProfile has mandatoryIsGate=true
- **AND** all mandatory DemandItems have matching CapabilityItems scoring above gapThreshold
- **THEN** passedMandatoryGate SHALL be true

#### Scenario: Mandatory gate fail
- **WHEN** a ScoringProfile has mandatoryIsGate=true
- **AND** any mandatory DemandItem has no matching CapabilityItem or scores below gapThreshold
- **THEN** passedMandatoryGate SHALL be false
- **AND** overallScore SHALL be 0
- **AND** failedMandatory SHALL list the failed requirement IDs

#### Scenario: Mandatory gate disabled
- **WHEN** a ScoringProfile has mandatoryIsGate=false
- **AND** a mandatory DemandItem is not matched
- **THEN** passedMandatoryGate SHALL be true
- **AND** the missing mandatory item SHALL reduce the score via criticality multiplier but NOT disqualify

#### Scenario: Category weight customization
- **WHEN** two ScoringProfiles differ only in categoryWeights
- **AND** the same DemandSpec and CapabilitySpec are matched with each
- **THEN** the overallScores SHALL differ according to the weight differences
- **AND** a candidate strong in technical_skill SHALL score higher with a profile weighting technical_skill at 35 than one weighting it at 5

#### Scenario: Level tolerance curve
- **WHEN** a DemandItem requires level "advanced" and the CapabilityItem claims level "intermediate" (one level below)
- **THEN** the level fit score SHALL be levelCurve[-1] (e.g., 0.70 for software-engineer profile)
- **AND** when the CapabilityItem claims level "expert" (one level above)
- **THEN** the level fit score SHALL be levelCurve[+1] (e.g., 1.0)

#### Scenario: Evidence strength scoring
- **WHEN** a CapabilityItem has strong evidence (experience with duration, specific achievements)
- **THEN** the evidence strength score SHALL be higher than a CapabilityItem with no evidence
- **AND** the impact of evidence on the overall item score SHALL be controlled by ScoringProfile.evidenceWeight

#### Scenario: Recency decay
- **WHEN** a CapabilityItem has lastUsed date older than ScoringProfile.recencyHalfLifeMonths
- **THEN** the recency score SHALL be below 50
- **AND** a recently-used capability SHALL score higher on recency than a stale one

#### Scenario: Taxonomy match scoring
- **WHEN** a DemandItem and CapabilityItem resolve to the same taxonomy node
- **THEN** the taxonomy match score SHALL be taxonomyMatchScores.exact (1.0)
- **WHEN** they resolve to sibling nodes
- **THEN** the taxonomy match score SHALL be taxonomyMatchScores.sibling (e.g., 0.50)
- **WHEN** there is no taxonomy relationship
- **THEN** the taxonomy match score SHALL be taxonomyMatchScores.none (0.0)

### Requirement: Scoring Profiles
The system SHALL support customizable scoring profiles loaded from JSON files or provided programmatically. The system SHALL ship with at least two built-in profiles: "software-engineer" and "healthcare-clinical". Profiles SHALL control all scoring parameters without code changes.

#### Scenario: Built-in software-engineer profile
- **WHEN** the "software-engineer" profile is used
- **THEN** technical_skill category SHALL have the highest weight
- **AND** mandatoryIsGate SHALL be false
- **AND** evidenceWeight SHALL be moderate (0.3)

#### Scenario: Built-in healthcare-clinical profile
- **WHEN** the "healthcare-clinical" profile is used
- **THEN** certification category SHALL have the highest weight
- **AND** mandatoryIsGate SHALL be true (missing license = disqualified)
- **AND** evidenceWeight SHALL be high (0.6)

#### Scenario: Custom profile creation
- **WHEN** a customer creates a ScoringProfile via the API
- **THEN** the profile SHALL be usable immediately for matching
- **AND** the profile SHALL be validated (weights must be positive, levelCurve keys must be integers)

#### Scenario: Invalid profile rejected
- **WHEN** a ScoringProfile with negative weights or missing required fields is provided
- **THEN** the system SHALL throw a validation error
- **AND** the system SHALL NOT use a partially-valid profile

### Requirement: Three-Tier Operation Mode
The system SHALL operate in three modes: full (LLM available), standard (no LLM), and minimal (no LLM, no taxonomy). The mode SHALL be configurable at engine initialization. The system SHALL produce valid results in all modes, with quality degrading gracefully from full to minimal.

#### Scenario: Full mode
- **WHEN** the engine is initialized with mode "full" and a valid LLM provider config
- **THEN** extractors SHALL use LLM for structured extraction
- **AND** taxonomy resolution SHALL use static aliases + LLM fallback
- **AND** scoring SHALL use evidence weight and all profile features

#### Scenario: Standard mode
- **WHEN** the engine is initialized with mode "standard" (no LLM config)
- **THEN** extractors SHALL use rule-based pattern extraction
- **AND** taxonomy resolution SHALL use static alias lookup only
- **AND** scoring SHALL set evidenceWeight to 0 (no evidence scoring without LLM extraction)
- **AND** results SHALL have lower confidence than full mode

#### Scenario: Minimal mode
- **WHEN** the engine is initialized with mode "minimal"
- **THEN** extractors SHALL use basic string tokenization
- **AND** taxonomy resolution SHALL use direct string comparison (like current USSP matching engine)
- **AND** scoring SHALL use simple weighted keyword overlap
- **AND** results SHALL have lowest confidence

### Requirement: Batch Matching
The system SHALL support matching multiple CapabilitySpecs against a single DemandSpec in a single call. Results SHALL be returned sorted by overallScore descending.

#### Scenario: Batch of candidates against one position
- **WHEN** matchBatch() is called with one DemandSpec and 10 CapabilitySpecs
- **THEN** the system SHALL return 10 SpecMatchResults sorted by overallScore descending
- **AND** each result SHALL be identical to calling match() individually

#### Scenario: Empty batch
- **WHEN** matchBatch() is called with zero CapabilitySpecs
- **THEN** the system SHALL return an empty array
- **AND** the system SHALL NOT error

### Requirement: LLM Provider Agnosticism
The system SHALL support multiple LLM providers without code changes. At minimum, Anthropic (Claude) and OpenAI (GPT) SHALL be supported. Customers SHALL provide their own LLM API key.

#### Scenario: Anthropic provider
- **WHEN** the engine is initialized with llmProvider type "anthropic" and a valid API key
- **THEN** extraction and taxonomy resolution SHALL use the Anthropic API

#### Scenario: OpenAI provider
- **WHEN** the engine is initialized with llmProvider type "openai" and a valid API key
- **THEN** extraction and taxonomy resolution SHALL use the OpenAI API

#### Scenario: Custom provider
- **WHEN** the engine is initialized with llmProvider type "custom" and a customProvider implementation
- **THEN** extraction and taxonomy resolution SHALL use the custom provider's chat() method

#### Scenario: No provider (standard mode)
- **WHEN** the engine is initialized without any llmProvider
- **THEN** the engine SHALL operate in standard mode (no LLM features)
- **AND** the engine SHALL NOT error on initialization

### Requirement: Zero USSP Coupling
The `packages/openspecmatch/` package SHALL have zero imports from USSP-specific code (platform-core, backoffice, site-template, ai-tools). All USSP integration SHALL happen through an adapter layer in platform-core that imports openspecmatch, not the reverse.

#### Scenario: Package independence
- **WHEN** the openspecmatch package is compiled
- **THEN** it SHALL compile successfully with no dependencies on any other package in the USSP monorepo
- **AND** its package.json SHALL NOT reference platform-core, backoffice, or any USSP package

#### Scenario: Extractable to standalone repo
- **WHEN** `packages/openspecmatch/` is copied to a standalone repository
- **AND** its dependencies are installed
- **THEN** it SHALL compile, and all tests SHALL pass without any USSP monorepo files present

### Requirement: Per-Item Match Breakdown
Every SpecMatchResult SHALL include a per-item breakdown showing how each DemandItem was matched. Each ItemMatch SHALL include the demand item ID, the best matching capability item ID, the raw score, and a score breakdown (taxonomy match type, level fit, evidence strength, recency).

#### Scenario: Full breakdown available
- **WHEN** a match is computed
- **THEN** the result SHALL contain one ItemMatch per DemandItem
- **AND** each ItemMatch SHALL include a human-readable explanation

#### Scenario: Unmatched demand item
- **WHEN** a DemandItem has no matching CapabilityItem
- **THEN** the ItemMatch SHALL have capabilityItemId null and score 0
- **AND** the item SHALL appear in the gaps list

### Requirement: Evaluation Criteria Override
When a DemandItem includes an evaluationWeight (funder/buyer's own published scoring weight), the system SHALL use that weight instead of the ScoringProfile's category weight for that item.

#### Scenario: RFP with published scoring rubric
- **WHEN** an RFP DemandSpec has DemandItems with evaluationWeight values (e.g., "Technical Approach: 35 points")
- **THEN** the scoring engine SHALL use evaluationWeight for those items
- **AND** items without evaluationWeight SHALL fall back to the ScoringProfile's categoryWeights

#### Scenario: No evaluation weights
- **WHEN** a DemandSpec has no DemandItems with evaluationWeight set
- **THEN** all scoring SHALL use the ScoringProfile's categoryWeights (default behavior)

### Requirement: Multi-Entity Combination Matching (Phase 2)
The system SHALL support matching a DemandSpec against multiple CapabilitySpecs simultaneously to find the optimal combination of entities that maximizes coverage. The result SHALL include a coverage map showing which entity covers which requirement, uncovered items, per-entity contribution, and a bid/no-bid recommendation.

#### Scenario: Two-company RFP bid
- **WHEN** matchCombination() is called with an RFP DemandSpec and CapabilitySpecs for USSP and Partner A
- **THEN** the result SHALL assign each DemandItem to the entity with the highest score for that item
- **AND** the result SHALL report uncovered items (neither entity matches)
- **AND** the result SHALL report each entity's unique contribution

#### Scenario: Single entity fallback
- **WHEN** matchCombination() is called with only one CapabilitySpec
- **THEN** the result SHALL be equivalent to a regular match() call
- **AND** all coverage SHALL be attributed to that single entity
