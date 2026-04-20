## ADDED Requirements

### Requirement: RFP Demand Extractor

OpenSpecMatch SHALL provide an RFP-specific demand extractor that converts an RFP document set into a `DemandSpec` with `domain: "rfp"`.

#### Scenario: PDF RFP produces structured DemandSpec

- **WHEN** `RFPExtractor.extract(rfpInput)` is called with one or more RFP PDF paths plus optional scheme metadata
- **THEN** a `DemandSpec` is returned whose `source.type = "rfp_document"` and whose `requirements` array contains at least one `DemandItem` per distinct requirement in the source PDFs
- **AND** every `DemandItem` is tagged with a Phase 2 `DemandCategory` (compliance, infrastructure, financial, manpower, past_performance, or geographic)

#### Scenario: LLM-augmented extraction covers free-form scope

- **WHEN** an RFP includes a narrative scope section that is not structured as citations or annexures
- **AND** `LLMRFPExtractor` is used with an LLM provider configured
- **THEN** requirements implied by the narrative are extracted and merged into the final `DemandSpec`
- **AND** LLM-only requirements are flagged in their `context` field as `"extractor:llm_only"` so a human can review them

#### Scenario: Fleettronix reference fixture reproduces hand-authored baseline

- **WHEN** the extractor runs against the AIS 140 Gazette and VTS Guidelines PDFs in `projects/rfp/Fleettronix_VLTD_AIS140/`
- **THEN** the produced `DemandSpec` covers every `DemandItem` ID present in the hand-authored baseline under semantic equivalence (not string identity)
- **AND** no hand-authored requirement is dropped from the extractor output

### Requirement: Company Capability Extractor

OpenSpecMatch SHALL provide a company capability extractor that converts a company profile document into a `CapabilitySpec` with `domain: "company"`.

#### Scenario: Company profile PDF produces CapabilitySpec

- **WHEN** `CompanyExtractor.extract(companyInput)` is called with a profile/pitch PDF path
- **THEN** a `CapabilitySpec` is returned whose `source.type = "company_profile"`
- **AND** every `CapabilityItem` includes at least one `Evidence` record citing the source document and approximate page or slide number

#### Scenario: Turnover and team-size headlines extracted as structured items

- **WHEN** a profile contains a turnover table (e.g. "FY 24-25 turnover: 5.5 Cr") or team-size statement (e.g. "180 employees")
- **THEN** the extractor creates `CapabilityItem`s in the `financial` and `manpower` categories respectively, with the figure captured in `evidence[].description`

### Requirement: Multi-entity Capability Combinator

OpenSpecMatch SHALL provide a Combinator that merges multiple `CapabilitySpec`s representing a bidding consortium into a single combined `CapabilitySpec`.

#### Scenario: Two entities with overlapping items produce a merged spec

- **WHEN** `combine([usspplSpec, fleetronixSpec], policy)` is called
- **AND** both specs contain capability items resolvable to the same taxonomy node (e.g. both claim Hyderabad location)
- **THEN** the resulting `CapabilitySpec` contains a single merged item for that taxonomy node
- **AND** the merged item's `level` equals the higher level between the two source items
- **AND** the merged item's `evidence` array is the union of both source evidence arrays
- **AND** the merged item's `metadata.contributors` lists both source entity IDs

#### Scenario: Non-overlapping items are preserved with attribution

- **WHEN** a capability item exists in only one of the input specs
- **THEN** the combined spec contains that item unchanged except for `metadata.contributors` being set to the single source entity ID

### Requirement: Government RFP Scoring Profile

OpenSpecMatch SHALL ship a built-in scoring profile `government-rfp` tuned for India Government RFP scoring.

#### Scenario: Profile is registered by default

- **WHEN** `new OpenSpecMatchEngine()` is constructed with no overrides
- **THEN** `engine.profiles.get("government-rfp")` returns a valid `ScoringProfile`

#### Scenario: Mandatory gate is enabled

- **WHEN** the `government-rfp` profile is inspected
- **THEN** `mandatoryIsGate` is `true`
- **AND** category weights place `compliance` and `infrastructure` among the top three categories by weight

#### Scenario: Missing mandatory item drops overall score to zero

- **WHEN** a match is run with the `government-rfp` profile
- **AND** any `DemandItem` with `criticality: "mandatory"` scores below the profile's `gapThreshold`
- **THEN** `result.passedMandatoryGate` is `false`
- **AND** `result.overallScore` is `0`
- **AND** `result.failedMandatory` contains the offending demand item IDs

### Requirement: Bid/No-Bid Recommendation

OpenSpecMatch SHALL extend `SpecMatchResult` with an optional `recommendation` field that summarises a go/no-go decision for RFP matches.

#### Scenario: Full pass produces GO verdict

- **WHEN** a match passes the mandatory gate AND `overallScore >= 70`
- **THEN** `result.recommendation.verdict` equals `"GO"`

#### Scenario: Remediable gate failure produces GO_WITH_REMEDIATION

- **WHEN** a match fails the mandatory gate
- **AND** every failed mandatory item has a known remediation path declared in its `context`
- **THEN** `result.recommendation.verdict` equals `"GO_WITH_REMEDIATION"`
- **AND** `result.recommendation.remediation` lists each blocker with its remediation path

#### Scenario: Unremediable failure produces NO_GO

- **WHEN** a match fails the mandatory gate
- **AND** at least one failed mandatory item has no declared remediation path
- **THEN** `result.recommendation.verdict` equals `"NO_GO"`

#### Scenario: Fleettronix fixture returns GO_WITH_REMEDIATION

- **WHEN** the full pipeline (extractors + combinator + match + recommender) runs against the Fleettronix fixture
- **THEN** `result.recommendation.verdict` equals `"GO_WITH_REMEDIATION"`
- **AND** `result.recommendation.blockers` includes at minimum: AIS 140 TAC, NIC Cloud hosting, VAHAN integration, ERSS integration, and CERT-IN security certification

### Requirement: Phase 2 Taxonomy Trees

OpenSpecMatch SHALL include built-in taxonomy trees for Phase 2 demand categories: infrastructure, financial, and manpower.

#### Scenario: Infrastructure tree resolves Govt-tech vocabulary

- **WHEN** the default resolver is asked to resolve strings such as "NIC Cloud", "VAHAN", "Dial 112", "ERSS", or "Survey of India"
- **THEN** each resolves to a node in the infrastructure tree with confidence `>= 0.8`

#### Scenario: Financial tree resolves bid-capacity concepts

- **WHEN** the default resolver is asked to resolve "Performance Bank Guarantee", "EMD", "working capital", or "Nirbhaya funding"
- **THEN** each resolves to a node in the financial tree with confidence `>= 0.8`

#### Scenario: Manpower tree resolves Govt-project roles

- **WHEN** the default resolver is asked to resolve "nodal officer", "PIU", "24x7 helpdesk", or "Telugu language support"
- **THEN** each resolves to a node in the manpower tree with confidence `>= 0.8`

#### Scenario: Fleettronix fixture resolves above 90 percent

- **WHEN** every `DemandItem` and `CapabilityItem` in the Fleettronix fixture is run through the default resolver
- **THEN** at least 90 percent of items resolve to a non-null taxonomy node
