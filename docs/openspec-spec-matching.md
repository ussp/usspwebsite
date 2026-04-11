# OpenSpec: OpenSpecMatch — Spec-Based Matching Engine
## Universal Demand ↔ Capability Matching for Resume, RFP, and Beyond

**Version:** 0.1 (Draft)
**Date:** 2026-04-09
**Status:** Proposed
**Author:** USSP Engineering
**Product Name:** OpenSpecMatch
**License:** Proprietary (USSP) — resellable as standalone SaaS or embedded module

---

## 1. Overview

OpenSpecMatch is a **standalone, domain-agnostic matching engine** that compares structured demand specs against capability specs using a customizable scoring engine. It is designed as an **independent, resellable product** that USSP also uses internally.

The core insight: every matching problem — resume screening, RFP response, vendor evaluation, partner selection — follows the same pattern: *extract unstructured documents into structured specs, then compare what's needed against what's offered.*

**Phase 1:** Resume ↔ Position matching (first customer = USSP's own ATS)
**Phase 2:** RFP ↔ Company/Partner capability matching
**Phase 3:** Grant ↔ Organization capability matching (nonprofits, companies, consortiums)

### 1.1 Product Positioning

| Aspect | Detail |
|---|---|
| **What it is** | A pluggable matching engine with LLM-powered extraction and customizable scoring |
| **Who buys it** | Staffing agencies, HR tech platforms, procurement teams, consulting firms |
| **How it's sold** | SaaS API, embedded NPM package, or white-labeled module |
| **How USSP uses it** | Powers ATS candidate matching + RFP response tooling |
| **Independence** | Zero dependency on USSP codebase — standalone package with its own DB, API, and docs |

### 1.2 Deployment Modes

```
Mode 0: Monorepo (current — USSP internal)
  packages/openspecmatch/ inside USSP monorepo
  → platform-core imports via file: dependency
  → Fastest iteration, no publish step

Mode 1: NPM Package (future — embedded in customer apps)
  npm install @openspecmatch/engine
  → Import into any Node.js/TypeScript app
  → Bring your own LLM key, bring your own database
  → No network calls except to LLM provider

Mode 2: SaaS API (future — hosted)
  POST https://api.openspecmatch.io/v1/match
  → USSP-hosted, multi-tenant, API key auth
  → Managed taxonomy, managed LLM, managed profiles

Mode 3: Self-Hosted (future — on-prem)
  docker run openspecmatch/engine
  → Customer runs their own instance
  → Connects to their own LLM provider and database
```

### 1.3 What This Replaces (Phase 1) — USSP Internal

| Current System | New System |
|---|---|
| `packages/platform-core/src/matching/engine.ts` | `packages/openspecmatch/src/engine/matcher.ts` |
| `matching/strategies/rule-based.ts` (8 hardcoded scorers) | Configurable scoring profiles loaded from JSON/DB |
| `matching/utils/skill-synonyms.ts` (360 static synonyms) | LLM-powered taxonomy resolution |
| `types/matching.ts` (flat string arrays) | Structured specs with levels, evidence, context |
| Regex-based rate/location parsing | LLM extraction into typed fields |

### 1.2 Why the Current System Fails

1. **Skills are flat strings** — `"Python"` matches `"Python"` but `"5 years building ML pipelines in Python"` doesn't score higher than `"took a Python tutorial"`
2. **360 static synonyms can't scale** — can't cover domain-specific terms, evolving tech, or cross-domain equivalences
3. **No skill-level awareness** — no distinction between "beginner", "intermediate", "expert"
4. **Context is discarded** — resume text is parsed into flat arrays, losing all nuance
5. **Certifications use substring matching** — `"AWS"` matches `"AWSOME"`, `"CIS"` matches `"Francisco"`
6. **Education ignores field of study** — a psychology MA scores same as a CS MA
7. **Location is string inclusion** — `"San Francisco"` doesn't match `"Bay Area"` or `"SF"`
8. **Rate has no hourly/annual distinction** — `$50/hr` and `$50k/year` are treated identically
9. **No feedback loop** — recruiter feedback exists in DB but is never used to improve scoring
10. **Hardcoded weights** — every position uses the same 30/20/10/10/8/7/8/7 split regardless of role type

---

## 2. Architecture

### 2.1 System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Spec Engine                              │
│  packages/openspecmatch/                                          │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐    │
│  │  Extractors   │   │  Specs       │   │  Scoring Engine  │    │
│  │              │   │              │   │                  │    │
│  │ Resume → CS  │   │ DemandSpec   │   │ compare(DS, CS)  │    │
│  │ Position → DS│   │ CapSpec      │   │ → MatchResult    │    │
│  │ RFP → DS     │   │ MatchResult  │   │                  │    │
│  │ Company → CS │   │              │   │ ScoringProfile   │    │
│  └──────────────┘   └──────────────┘   └──────────────────┘    │
│                                                                 │
│  ┌──────────────┐   ┌──────────────────────────────────────┐    │
│  │  Taxonomy     │   │  Scoring Profiles                    │    │
│  │              │   │                                      │    │
│  │ Skill tree   │   │ "software-engineer" → weights + rules│    │
│  │ Domain tree  │   │ "healthcare-nurse"  → weights + rules│    │
│  │ Cert registry│   │ "rfp-dc-infra"      → weights + rules│    │
│  └──────────────┘   └──────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
         │                                        │
    Phase 1: Feeds into                    Phase 2: Feeds into
    platform-core ATS                      RFP response tool
    (replaces current matching/)           (new feature)
```

### 2.2 Repository & Package Structure

OpenSpecMatch starts as a package inside the USSP monorepo (`packages/openspecmatch/`). It is designed with **zero coupling** to USSP internals so it can be extracted to its own repo later when ready to sell.

**Migration path:** When ready to sell → move `packages/openspecmatch/` to its own repo → publish to npm → USSP switches from `file:packages/openspecmatch` to `@openspecmatch/engine: ^1.0.0`.

```
packages/openspecmatch/                   ← INSIDE USSP MONOREPO (extract to own repo later)
├── package.json                          ← name: "@openspecmatch/engine"
├── tsconfig.json
├── vitest.config.ts
├── LICENSE                               ← Proprietary
├── README.md                             ← Public-facing docs
├── CHANGELOG.md
│
├── src/
│   ├── index.ts                          ← Public API
│   │   │
│   │   ├── specs/                        ← Spec type definitions
│   │   │   ├── demand-spec.ts            ← DemandSpec interface
│   │   │   ├── capability-spec.ts        ← CapabilitySpec interface
│   │   │   ├── match-result.ts           ← MatchResult interface
│   │   │   └── common.ts                 ← Shared types (CapabilityItem, Level, etc.)
│   │   │
│   │   ├── taxonomy/                     ← Skill & domain classification
│   │   │   ├── types.ts                  ← TaxonomyNode, TaxonomyTree interfaces
│   │   │   ├── resolver.ts              ← resolveSkill("k8s") → node in tree
│   │   │   ├── trees/                    ← Built-in taxonomy trees
│   │   │   │   ├── technology.ts         ← Software, infra, cloud, data
│   │   │   │   ├── certifications.ts     ← Industry certs with equivalences
│   │   │   │   ├── education.ts          ← Degrees, fields, levels
│   │   │   │   └── domain-knowledge.ts   ← Healthcare, finance, gov, etc.
│   │   │   └── llm-resolver.ts           ← LLM fallback when static tree misses
│   │   │
│   │   ├── extractors/                   ← Document → Spec converters
│   │   │   ├── types.ts                  ← Extractor interface
│   │   │   ├── resume-extractor.ts       ← Resume PDF/text → CapabilitySpec
│   │   │   ├── position-extractor.ts     ← Position record → DemandSpec
│   │   │   ├── rfp-extractor.ts          ← RFP PDF → DemandSpec (Phase 2)
│   │   │   └── company-extractor.ts      ← Company profile → CapabilitySpec (Phase 2)
│   │   │
│   │   ├── engine/                       ← Core matching logic
│   │   │   ├── comparator.ts             ← Compare one DemandItem ↔ CapabilityItem
│   │   │   ├── matcher.ts                ← Compare full DemandSpec ↔ CapabilitySpec
│   │   │   ├── combinator.ts             ← Multi-entity matching (Phase 2: USSP + partners)
│   │   │   └── scorer.ts                 ← Weighted scoring with customizable profiles
│   │   │
│   │   └── profiles/                     ← Scoring configurations
│   │       ├── types.ts                  ← ScoringProfile interface
│   │       ├── defaults.ts               ← Built-in profiles (software-dev, healthcare, etc.)
│   │       └── loader.ts                 ← Load from JSON file or DB
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── taxonomy/
│   │   │   │   ├── resolver.test.ts
│   │   │   │   └── trees.test.ts
│   │   │   ├── engine/
│   │   │   │   ├── comparator.test.ts
│   │   │   │   ├── matcher.test.ts
│   │   │   │   └── scorer.test.ts
│   │   │   ├── extractors/
│   │   │   │   ├── resume-extractor.test.ts
│   │   │   │   └── position-extractor.test.ts
│   │   │   └── profiles/
│   │   │       └── loader.test.ts
│   │   │
│   │   ├── integration/
│   │   │   ├── resume-to-position.test.ts    ← End-to-end: resume PDF → match result
│   │   │   ├── scoring-profiles.test.ts      ← Profile changes affect scores correctly
│   │   │   └── taxonomy-resolution.test.ts   ← Static + LLM fallback works together
│   │   │
│   │   └── fixtures/
│   │       ├── resumes/                      ← Sample resume texts/PDFs
│   │       │   ├── senior-python-dev.txt
│   │       │   ├── junior-react-dev.txt
│   │       │   ├── healthcare-nurse.txt
│   │       │   ├── devops-engineer.txt
│   │       │   └── data-scientist.txt
│   │       ├── positions/                    ← Sample position requirements
│   │       │   ├── senior-python-dev.json
│   │       │   ├── frontend-lead.json
│   │       │   ├── registered-nurse.json
│   │       │   └── cloud-architect.json
│   │       ├── expected/                     ← Expected match results for validation
│   │       │   ├── senior-python-to-python-position.json
│   │       │   ├── junior-react-to-frontend-lead.json
│   │       │   └── nurse-to-nurse-position.json
│   │       └── profiles/                     ← Sample scoring profiles
│   │           ├── software-engineer.json
│   │           └── healthcare-clinical.json
│   │
│   └── docs/
│       ├── user-guide.md                     ← How to use, configure, and extend
│       ├── api-reference.md                  ← Full API documentation
│       ├── scoring-profiles.md               ← Profile configuration guide
│       └── taxonomy-guide.md                 ← Taxonomy extension guide
│
└── examples/
    ├── resume-matching/                      ← Minimal resume matching example
    │   ├── index.ts
    │   └── README.md
    ├── rfp-matching/                         ← RFP matching example (Phase 2)
    └── custom-domain/                        ← Example: extending to a new domain
```

#### USSP Integration (platform-core consumes openspecmatch as local dependency)

```
packages/platform-core/
├── package.json                              ← adds "@openspecmatch/engine": "file:../openspecmatch"
└── src/
    ├── matching/                             ← DEPRECATED (kept for rollback)
    │   └── ...existing files...
    ├── matching-v2/                          ← Adapter layer
    │   ├── adapter.ts                        ← Converts USSP data → OpenSpecMatch specs
    │   ├── profiles.ts                       ← USSP-specific scoring profiles
    │   └── taxonomy-extensions.ts            ← USSP-specific taxonomy additions
    └── queries/admin/
        └── matching.ts                       ← Updated to use @openspecmatch/engine
```

---

## 3. Spec Schemas

### 3.1 Common Types

```typescript
// ── Proficiency Levels ──────────────────────────────────────────

/** 5-point scale used for both demands and capabilities */
type ProficiencyLevel = 
  | "awareness"      // knows it exists, can discuss it
  | "beginner"       // can do basic tasks with guidance
  | "intermediate"   // can work independently
  | "advanced"       // can architect, lead, mentor
  | "expert";        // recognized authority, deep specialization

/** Numeric mapping for comparison */
const LEVEL_ORDINAL: Record<ProficiencyLevel, number> = {
  awareness: 1,
  beginner: 2,
  intermediate: 3,
  advanced: 4,
  expert: 5,
};

// ── Criticality ─────────────────────────────────────────────────

/** How critical is this requirement? */
type Criticality =
  | "mandatory"      // must have — failing this = disqualified
  | "important"      // strong preference — major scoring impact
  | "preferred"      // nice to have — minor scoring impact
  | "optional";      // informational — minimal scoring impact

// ── Taxonomy Reference ──────────────────────────────────────────

/** Points to a node in the capability taxonomy */
interface TaxonomyRef {
  /** Taxonomy tree (e.g., "technology", "certifications", "education") */
  tree: string;
  /** Dot-path to node (e.g., "cloud.container-orchestration.kubernetes") */
  path: string;
  /** Human-readable label */
  label: string;
}

// ── Evidence ────────────────────────────────────────────────────

/** Proof that a capability claim is real */
interface Evidence {
  type: "experience" | "certification" | "education" | "project" | "reference" | "document";
  description: string;
  /** How recent is this evidence? */
  date?: string;           // ISO date or year
  /** Duration in months (for experience) */
  durationMonths?: number;
  /** Source of this evidence (e.g., "resume", "linkedin", "recruiter_verified") */
  source: string;
}
```

### 3.2 Demand Spec (What Is Needed)

Used for: position requirements (Phase 1), RFP requirements (Phase 2)

```typescript
interface DemandSpec {
  /** Unique identifier */
  id: string;
  /** What this demand represents */
  domain: "position" | "rfp";
  /** Human-readable title */
  title: string;
  /** Source document reference */
  source: {
    type: "position" | "rfp_document";
    id: string;
    extractedAt: string;       // ISO datetime
    extractorVersion: string;
  };

  // ── The Requirements ────────────────────────────────────────

  /** Individual capability requirements */
  requirements: DemandItem[];

  // ── Context (non-scored but affects interpretation) ──────────

  context: {
    /** Industry/domain context */
    industry?: string;           // e.g., "healthcare", "government", "fintech"
    /** Work arrangement */
    location?: LocationRequirement;
    /** Compensation */
    compensation?: CompensationRequirement;
    /** Timeline */
    timeline?: TimelineRequirement;
    /** Any additional metadata */
    metadata?: Record<string, unknown>;
  };
}

interface DemandItem {
  /** Auto-generated ID for tracking */
  id: string;
  /** Which category this belongs to */
  category: DemandCategory;
  /** Resolved taxonomy reference (null if not in taxonomy) */
  taxonomyRef: TaxonomyRef | null;
  /** Raw text from source document */
  rawText: string;
  /** Required proficiency level */
  level: ProficiencyLevel;
  /** How critical is this? */
  criticality: Criticality;
  /** Minimum years of experience (if applicable) */
  minYears?: number;
  /** Maximum years (if applicable, e.g., to avoid overqualification) */
  maxYears?: number;
  /** Additional context about this requirement */
  context?: string;
  /** What evidence would satisfy this? */
  acceptableEvidence?: Evidence["type"][];
}

type DemandCategory =
  // Phase 1: Resume matching
  | "technical_skill"
  | "soft_skill"
  | "certification"
  | "education"
  | "domain_knowledge"
  | "tool_proficiency"
  // Phase 2: RFP matching (added later)
  | "financial"
  | "compliance"
  | "infrastructure"
  | "manpower"
  | "past_performance"
  | "geographic";

interface LocationRequirement {
  city?: string;
  state?: string;
  country?: string;
  workMode: "remote" | "hybrid" | "onsite";
  /** Is relocation acceptable? */
  relocationOk?: boolean;
  /** Travel percentage required */
  travelPercent?: number;
}

interface CompensationRequirement {
  min?: number;
  max?: number;
  currency: string;
  type: "hourly" | "annual" | "monthly" | "project";
}

interface TimelineRequirement {
  startDate?: string;
  urgency: "immediate" | "within_30_days" | "within_90_days" | "flexible";
  durationMonths?: number;
}
```

### 3.3 Capability Spec (What Is Offered)

Used for: candidate profiles (Phase 1), company/partner profiles (Phase 2)

```typescript
interface CapabilitySpec {
  /** Unique identifier */
  id: string;
  /** What this capability represents */
  domain: "candidate" | "company";
  /** Human-readable name */
  name: string;
  /** Source document reference */
  source: {
    type: "resume" | "profile" | "company_profile";
    id: string;
    extractedAt: string;
    extractorVersion: string;
  };

  // ── The Capabilities ────────────────────────────────────────

  /** Individual capability claims */
  capabilities: CapabilityItem[];

  // ── Context ─────────────────────────────────────────────────

  context: {
    /** Total professional experience */
    totalExperienceYears?: number;
    /** Current/most recent role */
    currentRole?: string;
    /** Location */
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
    /** Work preferences */
    workPreference?: "remote" | "hybrid" | "onsite" | "open_to_travel";
    /** Compensation expectations */
    compensation?: {
      min?: number;
      max?: number;
      currency: string;
      type: "hourly" | "annual";
    };
    /** Availability */
    availability?: {
      date: string;          // ISO date
      status: "available" | "on_assignment" | "not_looking";
    };
    /** Any additional metadata */
    metadata?: Record<string, unknown>;
  };
}

interface CapabilityItem {
  /** Auto-generated ID */
  id: string;
  /** Which category */
  category: DemandCategory;   // Same categories as DemandItem for alignment
  /** Resolved taxonomy reference */
  taxonomyRef: TaxonomyRef | null;
  /** Raw text from source document */
  rawText: string;
  /** Claimed proficiency level */
  level: ProficiencyLevel;
  /** Years of experience with this specific capability */
  years?: number;
  /** Supporting evidence */
  evidence: Evidence[];
  /** Recency — when was this last used? */
  lastUsed?: string;          // ISO date or year
  /** Tools/technologies associated with this capability */
  tools?: string[];
}
```

### 3.4 Match Result

```typescript
interface OpenSpecMatchResult {
  /** Demand spec that was matched against */
  demandId: string;
  /** Capability spec(s) that were evaluated */
  capabilityIds: string[];    // Array for multi-entity matching (Phase 2)

  /** Overall score (0-100) */
  overallScore: number;
  /** Confidence in the score (0-100) — lower when data is missing */
  confidence: number;
  /** Algorithm version that produced this result */
  engineVersion: string;
  /** Scoring profile used */
  profileId: string;
  /** When this match was computed */
  computedAt: string;

  // ── Per-Requirement Breakdown ─────────────────────────────

  /** How each demand item was matched */
  itemMatches: ItemMatch[];

  // ── Summary ───────────────────────────────────────────────

  /** Requirements that were well-matched (score ≥ 70) */
  strengths: MatchSummaryItem[];
  /** Requirements that were poorly matched (score < 50) */
  gaps: MatchSummaryItem[];
  /** Requirements where data was insufficient to score */
  unknowns: MatchSummaryItem[];

  // ── Category Scores ───────────────────────────────────────

  /** Aggregated score per category */
  categoryScores: Record<DemandCategory, {
    score: number;
    weight: number;
    weightedScore: number;
    itemCount: number;
    matchedCount: number;
  }>;

  // ── Decision Support ──────────────────────────────────────

  /** Did it pass all mandatory requirements? */
  passedMandatoryGate: boolean;
  /** List of failed mandatory requirements */
  failedMandatory: string[];
  /** Narrative summary (LLM-generated) */
  summary?: string;
}

interface ItemMatch {
  /** The demand item being matched */
  demandItemId: string;
  /** The best-matching capability item (null if no match) */
  capabilityItemId: string | null;
  /** Who provides this capability (for multi-entity, Phase 2) */
  providedBy?: string;

  // ── Scoring ───────────────────────────────────────────────

  /** Raw score for this item (0-100) */
  score: number;
  /** How was this score determined? */
  scoreBreakdown: {
    /** Taxonomy match: same node, parent/child, sibling, or unrelated */
    taxonomyMatch: "exact" | "parent" | "child" | "sibling" | "related" | "none";
    /** Level fit: how well does claimed level meet required level */
    levelFit: number;         // 0-100
    /** Evidence strength: how strong is the proof */
    evidenceStrength: number; // 0-100
    /** Recency: how recent is this capability */
    recency: number;          // 0-100
  };

  /** Human-readable explanation */
  explanation: string;
}

interface MatchSummaryItem {
  demandItemId: string;
  category: DemandCategory;
  rawText: string;
  score: number;
  explanation: string;
}
```

---

## 4. Scoring Engine

### 4.1 Scoring Profiles (The Customization Layer)

The key design principle: **different roles need different scoring logic**. A senior backend engineer position should weight technical skills heavily. A healthcare nurse position should weight certifications and licensure as mandatory gates. An RFP for data center infrastructure should weight past performance and financial capacity.

Scoring profiles are **JSON configurations** that control how the engine behaves, loadable from files or database.

```typescript
interface ScoringProfile {
  /** Unique profile identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** What domain this applies to */
  domain: "resume" | "rfp" | "universal";
  /** Description of when to use this profile */
  description: string;
  /** Version for tracking changes */
  version: string;

  // ── Category Weights ──────────────────────────────────────

  /**
   * How much each category contributes to the overall score.
   * Values are relative (will be normalized to sum to 1.0).
   * Categories not listed get weight 0.
   */
  categoryWeights: Partial<Record<DemandCategory, number>>;

  // ── Criticality Multipliers ───────────────────────────────

  /**
   * Score multipliers based on criticality.
   * A mandatory item with multiplier 2.0 counts double in its category.
   */
  criticalityMultipliers: Record<Criticality, number>;

  // ── Level Scoring Curve ───────────────────────────────────

  /**
   * How to score when candidate level differs from required level.
   * Key = (candidateLevel - requiredLevel), Value = score multiplier.
   * 0 = exact match (1.0), positive = overqualified, negative = underqualified.
   */
  levelCurve: Record<number, number>;

  // ── Mandatory Gate ────────────────────────────────────────

  /**
   * If true, any failed mandatory item = overall disqualification
   * (score set to 0, passedMandatoryGate = false).
   * If false, mandatory items just get higher weight but don't disqualify.
   */
  mandatoryIsGate: boolean;

  // ── Evidence Scoring ──────────────────────────────────────

  /**
   * How much evidence quality affects the score for each item.
   * 0.0 = evidence is ignored (trust the claim).
   * 1.0 = evidence is everything (no evidence = 0 score).
   */
  evidenceWeight: number;

  // ── Recency Decay ─────────────────────────────────────────

  /**
   * How much recency affects scoring.
   * After this many months, a capability's recency score drops to 50%.
   */
  recencyHalfLifeMonths: number;

  // ── Taxonomy Matching ─────────────────────────────────────

  /**
   * Score multipliers for taxonomy relationship types.
   * "exact" = same node. "parent" = candidate has broader skill.
   * "child" = candidate has narrower skill. "sibling" = related skill.
   */
  taxonomyMatchScores: Record<
    "exact" | "parent" | "child" | "sibling" | "related" | "none",
    number
  >;

  // ── Thresholds ────────────────────────────────────────────

  thresholds: {
    /** Minimum overall score to be considered a match */
    minimumScore: number;
    /** Minimum score for passive/automated scanning */
    passiveScanMinimum: number;
    /** Score above which an item is considered a "strength" */
    strengthThreshold: number;
    /** Score below which an item is considered a "gap" */
    gapThreshold: number;
  };
}
```

### 4.2 Built-In Scoring Profiles

#### Software Engineer (Default for tech positions)

```json
{
  "id": "software-engineer",
  "name": "Software Engineer",
  "domain": "resume",
  "description": "General-purpose profile for software development roles. Weights technical skills and experience heavily.",
  "version": "1.0",
  "categoryWeights": {
    "technical_skill": 35,
    "domain_knowledge": 10,
    "tool_proficiency": 10,
    "certification": 5,
    "education": 10,
    "soft_skill": 5
  },
  "criticalityMultipliers": {
    "mandatory": 2.0,
    "important": 1.5,
    "preferred": 1.0,
    "optional": 0.5
  },
  "levelCurve": {
    "-4": 0.0,
    "-3": 0.15,
    "-2": 0.40,
    "-1": 0.70,
    "0": 1.0,
    "1": 1.0,
    "2": 0.95,
    "3": 0.85,
    "4": 0.75
  },
  "mandatoryIsGate": false,
  "evidenceWeight": 0.3,
  "recencyHalfLifeMonths": 36,
  "taxonomyMatchScores": {
    "exact": 1.0,
    "child": 0.85,
    "parent": 0.60,
    "sibling": 0.50,
    "related": 0.30,
    "none": 0.0
  },
  "thresholds": {
    "minimumScore": 30,
    "passiveScanMinimum": 50,
    "strengthThreshold": 70,
    "gapThreshold": 50
  }
}
```

#### Healthcare Clinical

```json
{
  "id": "healthcare-clinical",
  "name": "Healthcare Clinical Staff",
  "domain": "resume",
  "description": "For nursing, clinical, and healthcare professional roles. Certifications are mandatory gates (no cert = disqualified).",
  "version": "1.0",
  "categoryWeights": {
    "certification": 35,
    "domain_knowledge": 20,
    "technical_skill": 15,
    "education": 15,
    "soft_skill": 5,
    "tool_proficiency": 5
  },
  "criticalityMultipliers": {
    "mandatory": 3.0,
    "important": 1.5,
    "preferred": 1.0,
    "optional": 0.5
  },
  "levelCurve": {
    "-4": 0.0,
    "-3": 0.0,
    "-2": 0.30,
    "-1": 0.60,
    "0": 1.0,
    "1": 1.0,
    "2": 1.0,
    "3": 1.0,
    "4": 1.0
  },
  "mandatoryIsGate": true,
  "evidenceWeight": 0.6,
  "recencyHalfLifeMonths": 24,
  "taxonomyMatchScores": {
    "exact": 1.0,
    "child": 0.70,
    "parent": 0.40,
    "sibling": 0.30,
    "related": 0.10,
    "none": 0.0
  },
  "thresholds": {
    "minimumScore": 40,
    "passiveScanMinimum": 60,
    "strengthThreshold": 75,
    "gapThreshold": 50
  }
}
```

### 4.3 Scoring Algorithm

```
FOR each DemandItem in DemandSpec:
  1. FIND best matching CapabilityItem:
     a. Resolve both to taxonomy nodes
     b. Compute taxonomy relationship (exact/parent/child/sibling/related/none)
     c. Pick the capability item with highest taxonomy match

  2. SCORE the match (0-100):
     taxonomyScore  = taxonomyMatchScores[relationship] × 100
     levelScore     = levelCurve[capLevel - demandLevel] × 100
     evidenceScore  = scoreEvidence(capItem.evidence)   // 0-100
     recencyScore   = decayFunction(capItem.lastUsed, recencyHalfLifeMonths)

     itemScore = (
       taxonomyScore × (1 - evidenceWeight) × 0.5
       + levelScore × 0.3
       + evidenceScore × evidenceWeight × 0.1
       + recencyScore × 0.1
     )

  3. APPLY criticality multiplier:
     weightedItemScore = itemScore × criticalityMultipliers[demandItem.criticality]

  4. CHECK mandatory gate:
     IF mandatoryIsGate AND criticality == "mandatory" AND itemScore < gapThreshold:
       passedMandatoryGate = false

AGGREGATE by category:
  categoryScore = sum(weightedItemScores in category) / sum(maxPossibleScores in category)

COMPUTE overall:
  overallScore = sum(categoryScore × categoryWeight for each category)
  normalize to 0-100
```

### 4.4 Profile Customization Points

Recruiters and admins can customize matching via:

| What | How | Where |
|------|-----|-------|
| Change category weights | Edit profile JSON or UI sliders | Per-position or global default |
| Add mandatory gate logic | Set `mandatoryIsGate: true` | Per profile |
| Adjust level tolerance | Modify `levelCurve` | Per profile (e.g., strict for senior roles) |
| Require evidence | Increase `evidenceWeight` | Per profile (e.g., high for compliance roles) |
| Change recency importance | Adjust `recencyHalfLifeMonths` | Per profile (fast-moving tech = shorter) |
| Override for specific position | Clone profile, modify, assign to position | Per position |

---

## 5. Capability Taxonomy

### 5.1 Design Principles

1. **Hierarchical** — skills live in a tree, enabling parent/child/sibling matching
2. **Multi-tree** — separate trees for technology, certifications, education, domains
3. **Both domains covered by default** — the shipped taxonomy supports resume matching AND RFP matching out of the box. Customers don't build taxonomy from scratch.
4. **Extensible** — customers can add nodes (proprietary tools, niche certs, country-specific compliance) without modifying the default trees
5. **LLM-augmented** — static tree handles common cases; LLM resolves unknowns and caches results

### 5.2 Default Taxonomy Trees (Shipped With Package)

| Tree | Used By | Node Count (est.) | What It Covers |
|---|---|---|---|
| **technology** | Resume + RFP | 500+ | Languages, frameworks, tools, cloud, infra, databases, DevOps, security, data/ML |
| **certifications** | Resume + RFP | 200+ | Individual certs (AWS SA, PMP, RN License) AND org certs (ISO 27001, CMMI, SOC2, FedRAMP) |
| **education** | Resume | 100+ | Degree levels, fields of study (CS, nursing, business), institution tiers |
| **domain-knowledge** | Resume + RFP | 150+ | Industry verticals (healthcare, government, finance, manufacturing), sub-domains |
| **infrastructure** | RFP (+ DevOps resumes) | 200+ | DC tiers, DR/BCP, networking (SAN, LAN, WAN), virtualization, storage, physical infra |
| **compliance** | RFP (+ some resumes) | 100+ | Regulatory frameworks (FedRAMP, HIPAA, GDPR), government procurement rules, security clearances, visa/work auth |
| **financial** | RFP only | 50+ | Turnover thresholds, net worth, EMD/bid bond capacity, credit ratings, insurance |
| **manpower** | RFP only | 50+ | Team composition requirements, on-site staffing, role-specific certifications, SLA staffing |

**Total: ~1,350+ nodes shipped as defaults.** This covers the vast majority of IT staffing, healthcare staffing, and government/enterprise RFP scenarios.

**Customers extend for:** proprietary internal tools, niche industry certifications, country-specific regulatory requirements not in the defaults.

### 5.3 Taxonomy Node Structure

```typescript
interface TaxonomyNode {
  /** Unique path (e.g., "technology.cloud.kubernetes") */
  path: string;
  /** Human-readable label */
  label: string;
  /** Alternative names / synonyms */
  aliases: string[];
  /** Parent node path (null for root) */
  parent: string | null;
  /** Child node paths */
  children: string[];
  /** Related nodes (cross-tree or lateral relationships) */
  related: string[];
  /** Description for LLM context */
  description?: string;
}
```

### 5.4 Technology Tree (Excerpt)

```
technology
├── software-development
│   ├── languages
│   │   ├── python          aliases: [py, python3]
│   │   ├── javascript      aliases: [js, ecmascript, es6]
│   │   ├── typescript      aliases: [ts]
│   │   ├── java
│   │   ├── csharp          aliases: [c#, "c sharp", .net]
│   │   ├── go              aliases: [golang]
│   │   ├── rust
│   │   └── ...
│   ├── frontend
│   │   ├── react           aliases: [react.js, reactjs]
│   │   ├── angular         aliases: [angular.js, angularjs]
│   │   ├── vue             aliases: [vue.js, vuejs]
│   │   └── ...
│   ├── backend
│   │   ├── nodejs          aliases: [node.js, node]
│   │   ├── django
│   │   ├── spring-boot     aliases: [springboot, "spring boot"]
│   │   └── ...
│   └── testing
│       ├── unit-testing    aliases: [jest, pytest, junit, vitest]
│       ├── e2e-testing     aliases: [cypress, playwright, selenium]
│       └── ...
├── cloud-infrastructure
│   ├── providers
│   │   ├── aws             aliases: ["amazon web services"]
│   │   ├── azure           aliases: ["microsoft azure"]
│   │   └── gcp             aliases: ["google cloud", "google cloud platform"]
│   ├── container-orchestration
│   │   ├── kubernetes      aliases: [k8s]
│   │   ├── docker
│   │   └── ...
│   ├── iac
│   │   ├── terraform
│   │   ├── ansible
│   │   └── ...
│   └── ...
├── data-engineering
│   ├── databases
│   │   ├── relational      aliases: [rdbms, sql]
│   │   │   ├── postgresql  aliases: [postgres, psql]
│   │   │   ├── mysql
│   │   │   └── ...
│   │   └── nosql
│   │       ├── mongodb     aliases: [mongo]
│   │       ├── redis
│   │       └── ...
│   ├── big-data
│   │   ├── spark           aliases: ["apache spark"]
│   │   ├── kafka           aliases: ["apache kafka"]
│   │   └── ...
│   └── ml-ai
│       ├── machine-learning aliases: [ml]
│       ├── deep-learning   aliases: [dl]
│       ├── nlp             aliases: ["natural language processing"]
│       └── ...
└── security
    ├── application-security aliases: [appsec]
    ├── network-security
    ├── identity            aliases: [iam, oauth, sso]
    └── ...
```

### 5.5 Resolution Strategy

```
Input: raw skill string (e.g., "Kubernetes administration and cluster management")

Step 1: Normalize — lowercase, strip punctuation
Step 2: Alias lookup — check all nodes' aliases for direct match
Step 3: Token match — tokenize input, find nodes matching individual tokens
Step 4: LLM fallback — if no match above threshold:
  - Send to LLM: "Given this taxonomy tree, which node best matches: '{input}'?"
  - LLM returns: { path: "technology.cloud.container-orchestration.kubernetes", confidence: 0.95 }
  - Cache the mapping for future lookups
Step 5: Return TaxonomyRef with match confidence
```

---

## 6. Extractors

### 6.1 Resume Extractor (Phase 1)

Converts a resume (PDF text, raw text, or structured data) into a `CapabilitySpec`.

**Current approach (what we're replacing):**
- Regex-based extraction into flat arrays
- Skills = string list, experience = single number, education = {degree, institution}

**New approach:**
- LLM-powered extraction with structured output (JSON mode)
- Each skill extracted with level, years, evidence, recency
- Education extracted with field of study, relevance
- Certifications extracted with verification status

**LLM Extraction Prompt (template):**

```
You are extracting structured capability data from a resume.
For each capability you identify, provide:
- category: one of [technical_skill, soft_skill, certification, education, domain_knowledge, tool_proficiency]
- rawText: the exact text from the resume that evidences this
- level: one of [awareness, beginner, intermediate, advanced, expert]
  - Base this on: years of experience, role seniority, described achievements
  - "Used Python" with no context = beginner
  - "5 years Python, built ML pipeline serving 1M requests/day" = advanced
  - "Published Python framework used by 500+ developers" = expert
- years: number of years using this capability (infer from employment dates if not explicit)
- evidence: array of supporting evidence from the resume
- lastUsed: when this was last actively used (infer from most recent job)
- tools: specific tools/technologies mentioned in context of this capability

Return as JSON matching the CapabilitySpec schema.
```

**Quality control:**
- Extraction runs through validation: every capability item must have at least `category`, `level`, and `rawText`
- Confidence threshold: items extracted with confidence < 0.5 are flagged for human review
- Comparison test: run extractor on fixture resumes, compare output to expected specs

### 6.2 Position Extractor (Phase 1)

Converts a position record (from `positions` + `position_requirements` tables) into a `DemandSpec`.

This is simpler than resume extraction because position data is already semi-structured. The extractor:

1. Maps `required_skills` → `DemandItem` with `criticality: "mandatory"`
2. Maps `preferred_skills` → `DemandItem` with `criticality: "preferred"`
3. Maps `required_certifications` → `DemandItem` with `category: "certification"`, `criticality: "mandatory"`
4. Maps `education_level` → `DemandItem` with `category: "education"`
5. Maps `min_experience_years` / `max_experience_years` → context field
6. Resolves each item against the taxonomy
7. Optionally enriches with LLM: "Given this job title and description, what implicit requirements are missing?"

### 6.3 RFP Extractor (Phase 2)

Converts an RFP PDF into a `DemandSpec`. Detailed design deferred to Phase 2.

### 6.4 Company/Partner Extractor (Phase 2)

Converts company capability documentation into a `CapabilitySpec`. Detailed design deferred to Phase 2.

---

## 7. Phase 1: Implementation Plan

### 7.1 Scope

- New `packages/openspecmatch/` package
- Resume → CapabilitySpec extraction
- Position → DemandSpec extraction
- Spec-to-spec matching engine with scoring profiles
- Integration with existing backoffice ATS
- Full test suite
- User guide documentation

### 7.2 What Stays the Same

- Database schema (no migrations needed — `match_scores` table stores results the same way)
- Backoffice UI (match results display is unchanged — we just provide better scores)
- API contracts (same request/response shape from backoffice perspective)
- `match_feedback` table (now wired up for feedback loop)

### 7.3 What Changes

| Component | Before | After |
|---|---|---|
| Score computation | `matching/engine.ts` → `matching/strategies/rule-based.ts` | `openspecmatch/engine/matcher.ts` → `openspecmatch/engine/scorer.ts` |
| Skill matching | String compare + 360 synonyms | Taxonomy resolution + LLM fallback |
| Skill level | Not tracked | 5-point scale with evidence |
| Category weights | Hardcoded 30/20/10/10/8/7/8/7 | Per-profile JSON config |
| Mandatory handling | Not implemented | Gate check with disqualification |
| Evidence | Not used | Scored (configurable weight) |
| Feedback | Collected but unused | Feeds into profile tuning |

### 7.4 Migration Strategy

1. Build openspecmatch as standalone package with full test coverage
2. Add adapter in `platform-core/queries/admin/matching.ts` that calls openspecmatch
3. Run **both engines in parallel** for first 2 weeks — log both scores, display openspecmatch scores
4. Compare results, tune profiles based on recruiter feedback
5. Remove old engine once openspecmatch matches or exceeds quality
6. Old `matching/` directory kept for rollback during parallel period, then deleted

### 7.5 Milestones

| # | Milestone | Description | Deliverable |
|---|-----------|-------------|-------------|
| 1 | Spec types | Define all TypeScript interfaces | `specs/*.ts` compiled, no errors |
| 2 | Taxonomy v1 | Technology + certification + education trees | `taxonomy/trees/*.ts`, 500+ nodes, resolver works |
| 3 | Position extractor | Convert position records to DemandSpec | `extractors/position-extractor.ts` + unit tests |
| 4 | Resume extractor | LLM-powered resume → CapabilitySpec | `extractors/resume-extractor.ts` + unit tests |
| 5 | Scoring engine | Comparator + matcher + scorer with profiles | `engine/*.ts` + unit tests |
| 6 | Built-in profiles | Software engineer + healthcare profiles | `profiles/defaults.ts` + profile loader |
| 7 | Integration | Wire into platform-core, parallel run | `matching.ts` adapter, integration tests |
| 8 | Test suite | Full unit + integration + fixture-based tests | All tests green, coverage > 80% |
| 9 | User guide | Configuration, extending taxonomy, custom profiles | `docs/user-guide.md` |
| 10 | Cutover | Disable old engine, openspecmatch is primary | Old code deprecated |

---

## 8. Phase 2: RFP Matching (Future)

### 8.1 What Phase 2 Adds

| Component | Description |
|---|---|
| RFP Extractor | PDF → DemandSpec with financial, compliance, infrastructure, manpower categories |
| Company Extractor | Company documentation → CapabilitySpec |
| Combinator | Multi-entity matching (USSP + Partner A + Partner B → coverage matrix) |
| RFP Scoring Profiles | Profiles for different RFP types (DC infra, staffing, software development) |
| Match optimization | Find the combination of entities that maximizes coverage |
| Gap report | Detailed report of uncovered requirements |
| Bid/no-bid recommendation | Based on coverage %, mandatory gate pass, and financial feasibility |

### 8.2 What Carries Over from Phase 1

- Spec types (DemandSpec, CapabilitySpec, MatchResult)
- Taxonomy (extended with infrastructure, compliance nodes)
- Scoring engine (same comparator, matcher, scorer)
- Profile system (new profiles for RFP domain)
- All test infrastructure

### 8.3 What's New in Phase 2

The **Combinator** — this is the novel piece. Resume matching is 1:1 (one candidate vs. one position). RFP matching is **N:1** (multiple companies combining to cover one RFP).

```typescript
interface CombinationResult extends OpenSpecMatchResult {
  /** Which entity covers which requirement */
  coverageMap: Array<{
    demandItemId: string;
    coveredBy: string;        // entity ID (e.g., "ussp" or "partner-a")
    score: number;
  }>;
  /** Requirements not covered by any entity */
  uncoveredItems: string[];
  /** Per-entity contribution summary */
  entityContributions: Array<{
    entityId: string;
    entityName: string;
    itemsCovered: number;
    percentageCovered: number;
    uniqueContribution: number;  // items only this entity covers
  }>;
  /** Recommended team composition */
  recommendation: {
    bidDecision: "strong_bid" | "conditional_bid" | "no_bid";
    rationale: string;
    suggestedPrime: string;
    suggestedSubs: string[];
  };
}
```

---

## 9. Phase 3: Grant & Nonprofit Matching (Future)

### 9.1 Why This Is the Same Problem

A grant application follows the identical Demand ↔ Capability pattern:

- **Funder** publishes a grant opportunity (= Demand Spec)
- **Nonprofit or company** has capabilities and track record (= Capability Spec)
- **Matching** determines fit, gaps, and whether to apply (= Match Spec)

The Combinator from Phase 2 also applies — collaborative grant applications where multiple orgs apply as a consortium, each covering different focus areas.

### 9.2 What Phase 3 Adds

| Component | Description |
|---|---|
| Grant Extractor | Grant announcement PDF/URL → DemandSpec (focus areas, eligibility, outcomes, budget, geography) |
| Org Capability Extractor | Nonprofit/company profile → CapabilitySpec (mission, programs, outcomes data, financials, team) |
| Grant Scoring Profiles | Profiles for different grant types (federal, foundation, corporate, research) |
| Apply/no-apply recommendation | Based on mission alignment, eligibility gates, capacity, and competition assessment |

### 9.3 Grant-Specific Taxonomy Extensions

New nodes added to existing trees (not new trees — grants share taxonomy with RFP):

| Tree | New Nodes for Grants | Examples |
|---|---|---|
| **compliance** | Nonprofit regulatory | 501(c)(3) status, DUNS/UEI, SAM.gov registration, single audit (A-133), indirect cost rate agreement |
| **financial** | Grant-specific financial | Annual operating budget, endowment, revenue diversification, grant management capacity, fiscal sponsor |
| **domain-knowledge** | Impact areas | Youth development, workforce development, housing, food security, mental health, STEM education, climate resilience |
| **manpower** | Org capacity | Board composition, staff FTEs, volunteer base, evaluation staff, grant writer, program officers |
| **compliance** | Funder-specific | NSF merit review criteria, NIH study sections, USDA NIFA requirements, state-specific rules |

### 9.4 Grant-Specific Demand Categories

Added to `DemandCategory` type:

```typescript
type DemandCategory =
  // Phase 1 (Resume)
  | "technical_skill" | "soft_skill" | "certification"
  | "education" | "domain_knowledge" | "tool_proficiency"
  // Phase 2 (RFP)
  | "financial" | "compliance" | "infrastructure"
  | "manpower" | "past_performance" | "geographic"
  // Phase 3 (Grant) — new
  | "mission_alignment"    // Does org's mission match funder's focus area?
  | "impact_evidence"      // Prior outcomes data, evaluation results
  | "target_population"    // Who does the org serve? Does it match funder's priority populations?
  | "organizational_capacity"  // Can the org actually execute the grant?
  | "sustainability"       // Plan for continuing after grant ends
  | "collaboration"        // Existing partnerships, coalition membership
```

### 9.5 Grant Scoring Profile Example

```json
{
  "id": "federal-grant",
  "name": "Federal Grant (e.g., NSF, NIH, DOE, USDA)",
  "domain": "grant",
  "description": "For federal grant opportunities. Eligibility gates are strict (SAM, UEI, audit). Mission alignment and impact evidence weighted heavily.",
  "version": "1.0",
  "categoryWeights": {
    "mission_alignment": 25,
    "impact_evidence": 20,
    "target_population": 15,
    "organizational_capacity": 15,
    "financial": 10,
    "compliance": 5,
    "collaboration": 5,
    "sustainability": 5
  },
  "criticalityMultipliers": {
    "mandatory": 3.0,
    "important": 1.5,
    "preferred": 1.0,
    "optional": 0.5
  },
  "mandatoryIsGate": true,
  "evidenceWeight": 0.7,
  "recencyHalfLifeMonths": 36,
  "thresholds": {
    "minimumScore": 40,
    "passiveScanMinimum": 60,
    "strengthThreshold": 75,
    "gapThreshold": 50
  }
}
```

### 9.6 Grant-Specific Match Output

```typescript
interface GrantMatchResult extends OpenSpecMatchResult {
  /** Eligibility checklist — all must pass for federal grants */
  eligibilityChecklist: Array<{
    requirement: string;    // e.g., "SAM.gov registration"
    status: "met" | "not_met" | "unknown";
    evidence?: string;
  }>;
  /** Mission alignment score (0-100) — how well does org's work match funder's goals? */
  missionAlignmentScore: number;
  /** Capacity assessment — can the org realistically execute this grant? */
  capacityAssessment: {
    score: number;
    risks: string[];        // e.g., "No prior federal grant experience"
    strengths: string[];    // e.g., "Strong evaluation framework in place"
  };
  /** Recommendation */
  recommendation: {
    decision: "strong_apply" | "apply_with_caveats" | "do_not_apply";
    rationale: string;
    /** What to strengthen before applying */
    preparationNeeded: string[];
    /** Suggested partners for consortium application (uses Combinator from Phase 2) */
    suggestedPartners?: string[];
  };
}
```

### 9.7 Market Opportunity

| Customer Type | Use Case | How They Use OpenSpecMatch |
|---|---|---|
| **Nonprofits** | "Which grants should we apply for?" | Upload org profile once → scan incoming grants → ranked fit list |
| **Grant consultants** | Match clients to opportunities | Maintain multiple org CapabilitySpecs, match against grant database |
| **Foundations/funders** | "Which applicants best fit our program?" | Flip the direction: grant = Demand, applicant = Capability, rank applicants |
| **Corporate CSR** | Match giving priorities to grantees | Company focus areas as Demand, nonprofit profiles as Capability |
| **Government agencies** | Evaluate grant applications at scale | Same as funder use case but with compliance-heavy profiles |

### 9.8 Prior Art: InstaGrants (`D:\Code\InstaGrants`)

USSP's InstaGrants project is an AI-powered grant writing platform with **production-ready code** that directly feeds Phase 3. Key components to port or learn from:

#### Reference Code (Design Only — NOT Tested or Validated)

> **⚠ NOTE:** InstaGrants code was AI-generated (by Claude) and is well-structured, but was **never tested or validated**. Porting the code is fine — but every ported component must have test coverage written and passing before it ships in OpenSpecMatch.

| InstaGrants Component | File | OpenSpecMatch Target | Port & Validate |
|---|---|---|---|
| OpenSpec Analyzer | `services/openspec_analyzer.py` | `extractors/grant-extractor.ts` | Port Python → TypeScript. **Test:** prompt templates against 10+ real grant PDFs, verify output schema, edge cases. |
| Match Scoring Service | `services/match_scoring_service.py` | `profiles/grant-profiles.ts` | Port scoring logic + weights. **Test:** score 50+ real org-grant pairs, validate against expert rankings. |
| Org Profile Extractor | `api/routes/profile.py` | `extractors/company-extractor.ts` | Port extraction logic. **Test:** run against 20+ real org websites, verify field accuracy. |
| Document Vision Service | `services/document_vision_service.py` | `extractors/document-service.ts` | Port multi-provider fallback chain. **Test:** same PDFs through each tier, compare quality + cost. |
| Checklist Generator | `services/ai_checklist_generator.py` | `extractors/checklist-extractor.ts` | Port extraction + typing logic. **Test:** compare AI checklists to manually created ones for 10 grants. |

#### Research to Incorporate (from ViOnSpec Whitepaper — Theoretical, Not Implemented)

**File:** `docs/resarch/ViOnSpec_Enhanced_Whitepaper.md`
**Status:** Research paper — describes architecture and algorithms that were not implemented. Good design thinking to build on, but needs validation when implemented.

| Concept | What It Is | How It Improves OpenSpecMatch |
|---|---|---|
| **Evaluation criteria as first-class objects** | Grant funders publish scoring rubrics with weights (e.g., "Approach: 35 pts, Impact: 25 pts"). InstaGrants extracts these as `EVAL-001` items. | Add `evaluationWeight` to `DemandItem` — when the demand source publishes its own scoring, use that instead of profile weights. This makes matching more accurate for grants AND RFPs that publish evaluation criteria. |
| **Multi-persona reviewer simulation** | Simulate 3-5 review panel personas (domain expert, generalist, methodologist, budget specialist). Each scores differently, then consensus. | Add optional `perspectives` to MatchResult — a hiring manager, tech lead, and HR screener would score the same candidate differently. Powerful differentiator for OpenSpecMatch as a product. |
| **Response readiness scoring** | InstaGrants scores not just "does this match?" but "is the proposal ready to submit?" — section completeness, document readiness, rubric alignment. | Add a second scoring pass: after match scoring, optionally score **response readiness** — for grants: "is the proposal complete?", for RFPs: "is the bid package complete?", for resumes: "is the application complete?" |
| **Constraint DSL** | Domain-specific rules engine: e.g., "70% of beneficiaries must be LMI", "max 15 pages", "budget ≤ $500K". More powerful than boolean mandatory gates. | Extend `DemandItem` with optional `constraints: Constraint[]` — quantitative, conditional rules beyond simple mandatory/optional. |
| **Evidence provenance chains** | Track: source document → extracted evidence → claim → outcome. Enables audit trails. | Strengthen `Evidence` type with `sourceDocument`, `extractionConfidence`, `verifiedBy` fields. Critical for compliance-heavy grants and RFPs. |
| **Bayesian confidence calibration** | Separate "confidence" from "score". A 75 score with 0.95 confidence ≠ 75 with 0.4 confidence. Isotonic regression calibration. | Improve OpenSpecMatch confidence calculation beyond the current "count of null fields" approach. |
| **Keyword fallback (no LLM)** | InstaGrants falls back to keyword overlap matching when AI API is unavailable. | OpenSpecMatch engine MUST work without LLM (reduced quality). Ship a `rule-based` strategy alongside `llm-enhanced`. Taxonomy resolution uses static alias lookup; LLM is enhancement, not dependency. |

#### InstaGrants Scoring Weights → OpenSpecMatch Profile Mapping

```
InstaGrants Grant Scoring          →  OpenSpecMatch Grant Profile
─────────────────────────────────     ─────────────────────────
mission_alignment: 0.35            →  mission_alignment: 25  (+ evaluation criteria weights from grant itself)
geographic_fit: 0.20               →  geographic: 15
capacity_match: 0.20               →  organizational_capacity: 15 + financial: 10
eligibility: 0.15                  →  compliance: 10 (mandatory gate)
deadline_fit: 0.10                 →  timeline context (not a scored category — moved to context.timeline)
                                      impact_evidence: 20 (NEW — InstaGrants doesn't score this separately)
                                      target_population: 15 (NEW)
                                      collaboration: 5 (NEW)
                                      sustainability: 5 (NEW)
```

### 9.9 What Carries Over from Phase 1 + 2

Everything. Phase 3 adds:
- New extractors — **ported from InstaGrants** (Python → TypeScript) with full test coverage added
- New taxonomy nodes (impact areas, nonprofit compliance)
- New demand categories (mission_alignment, impact_evidence, etc.)
- New scoring profiles (federal-grant, foundation-grant, corporate-grant)
- New match result extension (eligibility checklist, capacity assessment)
- Document vision service — ported from InstaGrants, tested against real documents

The engine, comparator, combinator, taxonomy resolver, and profile system are unchanged.

### 9.10 Validation Plan for Ported InstaGrants Code

Every component ported from InstaGrants must have tests written and passing before shipping:

| Feature | Validation Method | Minimum Bar |
|---|---|---|
| Grant extraction prompts | Run against 10+ real grant PDFs (federal, foundation, corporate), manually verify output | 90%+ field accuracy on structured fields, 80%+ on freeform requirements |
| Scoring weights | Score 50+ real org-grant pairs, compare to human grant writer's assessment | Spearman rank correlation ≥ 0.7 with expert rankings |
| Org profile extraction | Extract from 20+ real nonprofit websites, compare to manually compiled profiles | 85%+ field coverage, no hallucinated data |
| Document vision fallback chain | Test same 10 PDFs through each provider tier, compare extraction quality | Tier 1 (GPT-4V) ≥ 90% accuracy, Tier 3 (OCR) ≥ 60% accuracy |
| Keyword fallback scoring | Run same 50 org-grant pairs with AI and without, compare score distributions | Keyword-only Spearman ≥ 0.5 (lower bar, but still useful) |
| Checklist extraction | Compare AI-generated checklists against manually created checklists for 10 grants | Recall ≥ 85% (don't miss requirements), Precision ≥ 75% (don't hallucinate requirements) |

---

## 9A. Cross-Phase Improvements (Learned from InstaGrants)

The following improvements apply to **all phases**, not just Phase 3. They are learned from InstaGrants' production experience and research.

### 9A.1 Evaluation Criteria as First-Class Objects

Add to `DemandItem`:

```typescript
interface DemandItem {
  // ... existing fields ...

  /** Funder/buyer's own evaluation weight (if published in the document).
   *  When present, this overrides the profile's category weight for this item.
   *  Example: RFP says "Technical Approach: 35 points out of 100" → evaluationWeight: 35
   *  Example: Grant says "Innovation: 20% of review score" → evaluationWeight: 20 */
  evaluationWeight?: number;

  /** Funder's evaluation criteria text (e.g., "Proposals will be evaluated on
   *  demonstrated experience managing Tier-3 data centers of comparable scale") */
  evaluationCriteria?: string;
}
```

This means: when the demand document tells us exactly how it will be scored, we use that. When it doesn't, we fall back to the scoring profile's category weights.

### 9A.2 Multi-Perspective Matching (Optional)

```typescript
interface PerspectiveConfig {
  id: string;
  name: string;          // e.g., "Hiring Manager", "Tech Lead", "HR Screener"
  description: string;
  /** Override profile weights for this perspective */
  weightOverrides: Partial<Record<DemandCategory, number>>;
  /** Override level tolerance for this perspective */
  levelCurveOverrides?: Record<number, number>;
}

interface MultiPerspectiveResult {
  /** Individual perspective scores */
  perspectives: Array<{
    perspectiveId: string;
    perspectiveName: string;
    result: OpenSpecMatchResult;
  }>;
  /** Consensus score (average or weighted) */
  consensusScore: number;
  /** Disagreement areas (items where perspectives diverge) */
  disagreements: Array<{
    demandItemId: string;
    scores: Record<string, number>;  // perspectiveId → score
    spread: number;                  // max - min
  }>;
}
```

Usage: `engine.matchMultiPerspective(demand, capability, [hiringManager, techLead, hrScreener])`

### 9A.3 Response Readiness Scoring (Second Pass)

After matching, optionally evaluate how ready the response is:

```typescript
interface ReadinessResult {
  /** Overall readiness (0-100) */
  readinessScore: number;
  /** Readiness level */
  level: "not_started" | "draft" | "in_progress" | "review_ready" | "submission_ready";
  /** Per-component breakdown */
  components: {
    /** Are all required documents available? */
    documentReadiness: { score: number; missing: string[]; available: string[] };
    /** Are all mandatory fields filled? */
    dataCompleteness: { score: number; missing: string[]; filled: string[] };
    /** Does the response address all evaluation criteria? */
    criteriaAlignment: { score: number; addressed: string[]; unaddressed: string[] };
  };
  /** What needs to be done before submission */
  actionItems: string[];
}
```

This applies to:
- **Grants:** Is the proposal complete? All sections written? Budget included? 501(c)(3) letter uploaded?
- **RFPs:** Is the bid package complete? Technical approach written? EMD secured? Certifications attached?
- **Resumes:** Is the application complete? Resume uploaded? Cover letter? References provided?

### 9A.4 Graceful Degradation (No LLM Required)

The engine MUST work at three quality tiers:

| Tier | LLM Available | Extraction | Taxonomy Resolution | Scoring |
|---|---|---|---|---|
| **Full** | Yes | LLM-powered structured extraction | Static aliases + LLM fallback | Profile-based with evidence scoring |
| **Standard** | No | Rule-based regex/pattern extraction | Static alias lookup only | Profile-based, evidence weight = 0 |
| **Minimal** | No, no taxonomy | Raw string matching | Direct string comparison (like current USSP engine) | Simple weighted keyword overlap |

```typescript
const engine = new OpenSpecMatchEngine({
  mode: "full" | "standard" | "minimal",
  llmProvider: { ... },  // optional — only needed for "full" mode
});
```

This ensures: npm package works out of the box with zero API keys (standard mode). LLM is an **enhancement**, not a **dependency**.

### 9A.5 Demand Source Adapters (Pluggable Ingestion)

Learned from InstaGrants' Grants.gov/SAM.gov adapters:

```typescript
interface DemandSource {
  readonly name: string;
  readonly domain: "position" | "rfp" | "grant";
  /** Search for opportunities */
  search(query: DemandSearchQuery): Promise<DemandSummary[]>;
  /** Fetch full details and extract to DemandSpec */
  extract(id: string): Promise<DemandSpec>;
}

// Built-in adapters (Phase 1-3):
class ManualDemandSource implements DemandSource { ... }       // User provides text/PDF
class SupabasePositionSource implements DemandSource { ... }   // Phase 1: from DB
class GrantsGovSource implements DemandSource { ... }          // Phase 3: Grants.gov API
class SAMGovSource implements DemandSource { ... }             // Phase 3: SAM.gov API

// Customer-provided adapters:
class IndeedJobSource implements DemandSource { ... }          // Job boards
class GovWinRFPSource implements DemandSource { ... }          // RFP databases
```

---

## 10. Test Strategy

### 10.1 Test Pyramid

```
                    ┌───────────┐
                    │ E2E Tests │  ← 3-5 tests: full flow from PDF to match result
                    ├───────────┤
                 ┌──┤Integration├──┐  ← 15-20 tests: extractor→engine→result
                 │  └───────────┘  │
              ┌──┤  Unit Tests  ├──┐  ← 50+ tests: individual functions
              │  └──────────────┘  │
              └────────────────────┘
```

### 10.2 Unit Tests

#### Taxonomy Tests (`taxonomy/resolver.test.ts`)

```
TEST: resolves exact alias match
  INPUT: "k8s"
  EXPECT: { path: "technology.cloud.container-orchestration.kubernetes", confidence: 1.0 }

TEST: resolves case-insensitive match
  INPUT: "PYTHON"
  EXPECT: { path: "technology.software-development.languages.python", confidence: 1.0 }

TEST: returns null for unknown skill with no LLM
  INPUT: "flibbertygibbet"
  EXPECT: null (no match, needs LLM)

TEST: resolves parent relationship
  INPUT: { a: "kubernetes", b: "container-orchestration" }
  EXPECT: relationship = "child" (kubernetes is child of container-orchestration)

TEST: resolves sibling relationship
  INPUT: { a: "react", b: "angular" }
  EXPECT: relationship = "sibling" (both under frontend)

TEST: resolves related cross-tree
  INPUT: { a: "aws", b: "terraform" }
  EXPECT: relationship = "related" (different subtrees but associated)
```

#### Comparator Tests (`engine/comparator.test.ts`)

```
TEST: exact taxonomy match, same level → score 100
  DEMAND: { skill: "python", level: "advanced", criticality: "mandatory" }
  CAPABILITY: { skill: "python", level: "advanced", evidence: [5yr experience] }
  EXPECT: score ≈ 100

TEST: exact match, lower level → reduced score
  DEMAND: { skill: "python", level: "advanced" }
  CAPABILITY: { skill: "python", level: "intermediate" }
  EXPECT: score ≈ 70 (levelCurve[-1] = 0.70)

TEST: exact match, higher level → slight reduction for overqualification
  DEMAND: { skill: "python", level: "intermediate" }
  CAPABILITY: { skill: "python", level: "expert" }
  EXPECT: score ≈ 95 (levelCurve[+2] = 0.95)

TEST: sibling taxonomy match → reduced score
  DEMAND: { skill: "react", level: "intermediate" }
  CAPABILITY: { skill: "angular", level: "intermediate" }
  EXPECT: score ≈ 50 (taxonomyMatchScores.sibling = 0.50)

TEST: no taxonomy match → score 0
  DEMAND: { skill: "kubernetes", level: "advanced" }
  CAPABILITY: { skill: "creative-writing", level: "expert" }
  EXPECT: score ≈ 0

TEST: strong evidence boosts score
  DEMAND: { skill: "python", level: "advanced", acceptableEvidence: ["experience"] }
  CAPABILITY: { skill: "python", level: "advanced", evidence: [
    { type: "experience", description: "Led Python team for 5 years", durationMonths: 60 }
  ]}
  EXPECT: evidenceStrength score > 80

TEST: no evidence with high evidenceWeight → reduced score
  PROFILE: { evidenceWeight: 0.8 }
  DEMAND: { skill: "python", level: "advanced" }
  CAPABILITY: { skill: "python", level: "advanced", evidence: [] }
  EXPECT: score significantly lower than with evidence

TEST: stale capability with short recencyHalfLife → reduced score
  PROFILE: { recencyHalfLifeMonths: 12 }
  CAPABILITY: { skill: "python", level: "advanced", lastUsed: "2022-01-01" }
  EXPECT: recency score < 50 (4+ years old, halflife is 12 months)
```

#### Scorer Tests (`engine/scorer.test.ts`)

```
TEST: mandatory gate failure disqualifies (when mandatoryIsGate = true)
  PROFILE: healthcare-clinical (mandatoryIsGate: true)
  DEMAND: [{ skill: "RN License", criticality: "mandatory" }]
  CAPABILITY: [no matching certification]
  EXPECT: overallScore = 0, passedMandatoryGate = false

TEST: mandatory not a gate (when mandatoryIsGate = false)
  PROFILE: software-engineer (mandatoryIsGate: false)
  DEMAND: [{ skill: "Python", criticality: "mandatory" }]
  CAPABILITY: [no Python]
  EXPECT: overallScore > 0 (reduced, but not zero), passedMandatoryGate = true

TEST: category weights change relative scores
  SAME candidate + position, TWO profiles:
  PROFILE A: { technical_skill: 50, certification: 5 }
  PROFILE B: { technical_skill: 5, certification: 50 }
  EXPECT: candidate with strong skills but weak certs scores higher on A than B

TEST: criticality multipliers affect item contribution
  DEMAND: [
    { skill: "Python", criticality: "mandatory" },   // multiplier 2.0
    { skill: "Docker", criticality: "optional" }      // multiplier 0.5
  ]
  CAPABILITY: [matches Docker but not Python]
  EXPECT: low score (missing the high-multiplier item)

TEST: confidence reflects data completeness
  CAPABILITY with all fields filled → confidence > 90
  CAPABILITY with half fields null → confidence ≈ 50-70
  CAPABILITY with no evidence, no dates → confidence < 50
```

#### Extractor Tests (`extractors/resume-extractor.test.ts`)

```
TEST: extracts skills with levels from senior resume
  INPUT: fixtures/resumes/senior-python-dev.txt
  EXPECT: capabilities includes { category: "technical_skill", rawText contains "Python",
           level: "advanced" or "expert", years: >= 5 }

TEST: extracts education with field of study
  INPUT: resume with "M.S. in Computer Science, Stanford University, 2018"
  EXPECT: capabilities includes { category: "education", level: "advanced",
           rawText contains "Computer Science" }

TEST: handles resume with minimal information
  INPUT: short resume with just name, 2 skills, 1 job
  EXPECT: CapabilitySpec with low confidence, few items, no errors

TEST: extracts certifications distinctly from skills
  INPUT: resume listing "AWS Solutions Architect Professional" in certifications section
  EXPECT: capabilities includes { category: "certification", not "technical_skill" }
```

### 10.3 Integration Tests

#### Resume-to-Position Matching (`integration/resume-to-position.test.ts`)

```
TEST: senior Python dev matches Python position well
  RESUME: fixtures/resumes/senior-python-dev.txt
  POSITION: fixtures/positions/senior-python-dev.json
  EXPECT: overallScore >= 75, passedMandatoryGate = true,
          strengths includes "Python", gaps is empty or minor

TEST: junior React dev does NOT match senior frontend lead
  RESUME: fixtures/resumes/junior-react-dev.txt
  POSITION: fixtures/positions/frontend-lead.json (requires 8+ years, leadership)
  EXPECT: overallScore < 50, gaps includes experience-related items

TEST: healthcare nurse matches nurse position with clinical profile
  RESUME: fixtures/resumes/healthcare-nurse.txt
  POSITION: fixtures/positions/registered-nurse.json
  PROFILE: healthcare-clinical
  EXPECT: certification mandatory gate passed, overallScore >= 70

TEST: healthcare nurse FAILS without required license
  RESUME: nurse resume WITHOUT active RN license
  POSITION: registered-nurse (RN License = mandatory)
  PROFILE: healthcare-clinical (mandatoryIsGate: true)
  EXPECT: passedMandatoryGate = false, overallScore = 0

TEST: DevOps engineer partially matches cloud architect position
  RESUME: fixtures/resumes/devops-engineer.txt
  POSITION: fixtures/positions/cloud-architect.json
  EXPECT: overallScore 40-70 (related but not exact fit),
          strengths includes infrastructure items,
          gaps includes architecture/design items
```

#### Scoring Profile Tests (`integration/scoring-profiles.test.ts`)

```
TEST: same candidate scores differently under different profiles
  CANDIDATE: senior Python dev with strong skills, no certifications
  POSITION: same for both
  PROFILE A: software-engineer (technical_skill: 35, certification: 5)
  PROFILE B: custom (technical_skill: 5, certification: 35)
  EXPECT: scoreA > scoreB by significant margin

TEST: custom profile from JSON file loads and scores correctly
  PROFILE: loaded from fixtures/profiles/custom.json
  EXPECT: scoring uses the custom weights, not defaults

TEST: profile with mandatoryIsGate=true blocks on missing mandatory
  PROFILE: { mandatoryIsGate: true }
  DEMAND: [{ skill: "X", criticality: "mandatory" }]
  CAPABILITY: [no X]
  EXPECT: passedMandatoryGate = false

TEST: profile with mandatoryIsGate=false does NOT block
  Same setup, mandatoryIsGate: false
  EXPECT: passedMandatoryGate = true (just lower score)
```

#### Taxonomy Resolution Tests (`integration/taxonomy-resolution.test.ts`)

```
TEST: static resolution handles common tech skills
  INPUTS: ["Python", "k8s", "AWS", "React.js", "postgresql"]
  EXPECT: all resolve to correct taxonomy paths with confidence 1.0

TEST: LLM fallback resolves uncommon skill
  INPUT: "Apache Flink stream processing"
  EXPECT: resolves to data-engineering.big-data or similar, confidence > 0.7

TEST: LLM resolution is cached on second call
  INPUT: "obscure-skill-xyz" (requires LLM)
  CALL 1: LLM invoked, result returned
  CALL 2: same input → cached result, LLM NOT invoked
  EXPECT: call count to LLM = 1
```

### 10.4 Fixture-Based Regression Tests

Each fixture set consists of:
- `resumes/{name}.txt` — raw resume text
- `positions/{name}.json` — position requirements
- `expected/{resume}-to-{position}.json` — expected match result (score ranges, required strengths/gaps)

When the engine changes, run all fixtures and verify results stay within expected ranges. This prevents regressions.

```
fixtures/
├── resumes/
│   ├── senior-python-dev.txt
│   ├── junior-react-dev.txt
│   ├── healthcare-nurse.txt
│   ├── devops-engineer.txt
│   ├── data-scientist.txt
│   ├── project-manager-no-tech.txt
│   └── career-changer-bootcamp.txt
├── positions/
│   ├── senior-python-dev.json
│   ├── frontend-lead.json
│   ├── registered-nurse.json
│   ├── cloud-architect.json
│   ├── entry-level-analyst.json
│   └── scrum-master.json
└── expected/
    ├── senior-python-to-python-position.json
    ├── junior-react-to-frontend-lead.json
    ├── nurse-to-nurse-position.json
    ├── devops-to-cloud-architect.json
    ├── data-scientist-to-python-position.json
    ├── pm-to-scrum-master.json
    └── career-changer-to-entry-analyst.json
```

---

## 11. User Guide Outline

The user guide (`packages/openspecmatch/docs/user-guide.md`) will cover:

### Chapter 1: Overview
- What is spec-based matching?
- How it differs from keyword matching
- The Demand Spec ↔ Capability Spec model

### Chapter 2: For Recruiters
- How match scores are calculated (plain-language explanation)
- Reading the match result (strengths, gaps, unknowns)
- What "mandatory gate" means
- When to trust vs. question a score
- Providing feedback to improve future matches

### Chapter 3: For Admins — Scoring Profiles
- What is a scoring profile?
- Built-in profiles (software engineer, healthcare clinical)
- How to create a custom profile
  - Choosing category weights
  - Setting mandatory gates
  - Adjusting level tolerance curves
  - Configuring evidence requirements
- Assigning profiles to positions
- Testing a profile before deploying it

### Chapter 4: For Admins — Taxonomy Management
- How the taxonomy works
- Viewing the current taxonomy tree
- Adding new nodes (skills, certifications)
- Adding aliases to existing nodes
- How LLM fallback works
- Reviewing and approving LLM-resolved mappings

### Chapter 5: For Developers — Extending the Engine
- Adding a new extractor
- Adding a new taxonomy tree
- Adding a new DemandCategory
- Writing tests for custom components
- The plugin architecture (DimensionScorer → CapabilityItem comparator)

### Chapter 6: Troubleshooting
- "Score seems too low" — check taxonomy resolution, check profile weights
- "Score seems too high" — check evidence weight, check level assignment
- "Mandatory gate isn't working" — check mandatoryIsGate flag, check criticality assignment
- "LLM extraction is inconsistent" — check prompt template, review extraction validation

---

## 12. Public API (NPM Package)

The `@openspecmatch/engine` package exposes a clean, minimal API surface. Consumers don't need to understand internals.

```typescript
// ── Installation ────────────────────────────────────────────────
// npm install @openspecmatch/engine

// ── Core API ────────────────────────────────────────────────────
import {
  // Engine
  OpenSpecMatchEngine,
  
  // Extractors
  ResumeExtractor,
  PositionExtractor,
  RfpExtractor,            // Phase 2
  CompanyExtractor,        // Phase 2
  
  // Taxonomy
  TaxonomyRegistry,
  defaultTaxonomy,         // Built-in trees (technology, certs, education)
  
  // Profiles
  ScoringProfileRegistry,
  builtInProfiles,         // software-engineer, healthcare-clinical, etc.
  
  // Types (re-exported for consumers)
  type DemandSpec,
  type CapabilitySpec,
  type OpenSpecMatchResult,
  type ScoringProfile,
  type TaxonomyNode,
} from "@openspecmatch/engine";

// ── Usage: Basic resume matching ────────────────────────────────

// 1. Create engine with defaults
const engine = new OpenSpecMatchEngine({
  llmProvider: {
    type: "anthropic",     // or "openai"
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: "claude-sonnet-4-6",
  },
  taxonomy: defaultTaxonomy,
  defaultProfile: builtInProfiles["software-engineer"],
});

// 2. Extract specs from documents
const candidateSpec = await engine.extract.resume(resumeText);
const positionSpec = await engine.extract.position(positionData);

// 3. Match
const result = await engine.match(positionSpec, candidateSpec);
// → { overallScore, confidence, strengths, gaps, itemMatches, ... }

// 4. Match with custom profile
const nurseResult = await engine.match(positionSpec, candidateSpec, {
  profile: builtInProfiles["healthcare-clinical"],
});

// ── Usage: Custom profile ───────────────────────────────────────

const myProfile = engine.profiles.create({
  id: "my-company-devops",
  name: "DevOps Engineer (My Company)",
  domain: "resume",
  categoryWeights: {
    technical_skill: 25,
    tool_proficiency: 25,
    certification: 20,
    domain_knowledge: 15,
    education: 5,
    soft_skill: 5,
  },
  mandatoryIsGate: true,
  evidenceWeight: 0.4,
  // ... rest of profile config
});

// ── Usage: Extend taxonomy ──────────────────────────────────────

engine.taxonomy.addNode({
  path: "technology.cloud.my-proprietary-tool",
  label: "My Proprietary Tool",
  aliases: ["mpt", "prop-tool"],
  parent: "technology.cloud",
  children: [],
  related: ["technology.cloud.kubernetes"],
});

// ── Usage: Batch matching ───────────────────────────────────────

const candidates = [candidateSpec1, candidateSpec2, candidateSpec3];
const results = await engine.matchBatch(positionSpec, candidates);
// → sorted by overallScore descending

// ── Usage: RFP matching (Phase 2) ───────────────────────────────

const rfpSpec = await engine.extract.rfp(rfpPdfText);
const usspCapabilities = await engine.extract.company(usspProfile);
const partnerCapabilities = await engine.extract.company(partnerProfile);
const combination = await engine.matchCombination(rfpSpec, [
  usspCapabilities,
  partnerCapabilities,
]);
// → { coverageMap, uncoveredItems, recommendation, ... }
```

### 12.1 LLM Provider Interface

OpenSpecMatch is **LLM-agnostic**. Consumers provide their own LLM configuration:

```typescript
interface LLMProviderConfig {
  type: "anthropic" | "openai" | "custom";
  apiKey: string;
  model: string;
  /** For custom providers: implement this interface */
  customProvider?: {
    chat(prompt: string, schema: ZodSchema): Promise<unknown>;
  };
}
```

This means customers can use Claude, GPT, or their own fine-tuned model.

---

## 13. Dependencies

### Runtime
| Dependency | Purpose | Notes |
|---|---|---|
| TypeScript | Language | Compiled to ESM + CJS for broad compatibility |
| Zod | Schema validation | Validates LLM output matches expected shape |
| **No LLM SDK bundled** | — | Consumer provides their own via config. Engine ships with adapters for Anthropic + OpenAI. |

### Peer Dependencies (consumer installs one)
| Dependency | Purpose | Notes |
|---|---|---|
| `@anthropic-ai/sdk` | Claude API calls | Optional — only if `type: "anthropic"` |
| `openai` | OpenAI API calls | Optional — only if `type: "openai"` |

### Dev / Test
| Dependency | Purpose | Notes |
|---|---|---|
| Vitest v2 | Test runner | v2 for Windows compatibility |
| msw (Mock Service Worker) | Mock LLM API calls in tests | Avoids real API calls in unit tests |

### Storage
OpenSpecMatch is **stateless by default** — it computes matches in memory and returns results. Persistence is the consumer's responsibility. However, the package provides optional helpers:

- **Taxonomy cache:** In-memory LRU cache for LLM-resolved taxonomy mappings. Consumer can provide a custom cache adapter (Redis, SQLite, etc.)
- **Extraction cache:** Optional content-hash based cache to avoid re-extracting unchanged documents
- **No database required** — profiles and taxonomy are loaded from JSON files or passed in code

---

## 14. Open Questions

1. **LLM Provider for extraction:** Claude (Anthropic SDK) vs. GPT-4 (OpenAI)? Both supported, but which should be the *default recommendation* and test target? **Recommendation:** Claude for structured output quality, OpenAI as tested alternative. Ship adapters for both.

2. **NPM scope and registry:** `@openspecmatch/engine` on public npm? Or private registry for paying customers? **Recommendation:** Private npm registry (GitHub Packages or Cloudsmith) for initial release, public npm once product is stable.

3. **Taxonomy governance:** Who curates the shared taxonomy? USSP maintains the canonical tree, customers can extend but not modify core nodes? **Recommendation:** Ship a read-only default taxonomy. Customers extend via `addNode()`. USSP publishes taxonomy updates as semver minor releases.

4. **Pricing model for SaaS:** Per-match? Per-extraction? Monthly seat-based? **Recommendation:** Per-extraction (LLM cost is the real cost), with a monthly minimum. Matching-only (no extraction) is free tier.

5. **LLM cost passthrough:** Extraction calls LLMs. Who pays? **Recommendation:** NPM package mode = customer's own API key. SaaS mode = included in pricing with rate limits.

6. **Feedback loop mechanics:** How does user feedback ("good match" / "bad match") adjust scoring? **Recommendation:** Start with flagging extraction errors (simplest), add profile weight adjustment in v2.

7. **USSP parallel scoring period:** How long to run old + new engines side-by-side in USSP's ATS? **Recommendation:** 2 weeks minimum, with recruiter feedback comparison.

---

## 15. Success Criteria

### Phase 1 — As a standalone product:

1. **Installable:** `npm install @openspecmatch/engine` works, zero USSP dependencies
2. **Documented:** README, API reference, user guide, and examples are complete
3. **Tested:** >80% line coverage, all fixture-based regression tests passing
4. **LLM-agnostic:** Works with both Anthropic and OpenAI out of the box
5. **Profile customization works:** Consumer can create a custom profile and see score changes immediately
6. **Performance:** Scoring a single candidate takes < 2 seconds (excluding LLM extraction, which is cached)
7. **Examples run:** All three example projects (resume-matching, rfp-matching, custom-domain) work end-to-end

### Phase 1 — As USSP integration:

8. **Quality improvement:** Recruiter "bad match" feedback rate drops by 50%+ compared to current engine
9. **Mandatory gates work:** Healthcare positions with license requirements correctly filter unlicensed candidates
10. **No regression:** Matches that were correct under the old engine remain correct
11. **Zero downtime migration:** Old engine → new engine with parallel running period, no data loss
