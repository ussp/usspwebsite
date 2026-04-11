# OpenSpecMatch Developer Guide

> For developers integrating OpenSpecMatch into an application.

---

## Architecture Overview

OpenSpecMatch follows a pipeline architecture:

```
Input Data
  |
  v
Extractors  -->  DemandSpec / CapabilitySpec  (structured intermediate format)
  |
  v
Matcher     -->  compares items using TaxonomyResolver + ScoringProfile
  |
  v
SpecMatchResult  (scores, strengths, gaps, breakdowns)
```

**Key components:**

| Component | Role |
|-----------|------|
| `PositionExtractor` | Converts position records into `DemandSpec` |
| `ResumeExtractor` | Converts resume text into `CapabilitySpec` (rule-based) |
| `LLMResumeExtractor` | Converts resume text into `CapabilitySpec` (LLM-powered) |
| `TaxonomyResolver` | Resolves strings to taxonomy nodes, computes relationships |
| `matchSpecs` | Scores a `DemandSpec` against a `CapabilitySpec` |
| `ScoringProfile` | Controls weights, curves, thresholds, and gate behavior |
| `OpenSpecMatchEngine` | Facade that wires everything together |

The specs (`DemandSpec`, `CapabilitySpec`) are the core data model. You can construct them manually, use the built-in extractors, or write your own extractors. The matcher and scorer only care about the spec shape, not how it was produced.

---

## OpenSpecMatchEngine API Reference

### Constructor

```typescript
new OpenSpecMatchEngine(config?: EngineConfig)
```

`EngineConfig` fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `mode` | `"full" \| "standard" \| "minimal"` | Auto-detected | `"full"` if `llm` is provided, else `"standard"` |
| `profiles` | `ScoringProfile[]` | `[]` | Additional profiles to register alongside built-in defaults |
| `resolver` | `TaxonomyResolver` | Built-in trees | Custom taxonomy resolver |
| `llm` | `LLMProviderConfig` | `undefined` | LLM provider for async extraction |

### Extraction Methods

```typescript
engine.extractPosition(input: PositionInput): DemandSpec
engine.extractResume(input: ResumeInput): CapabilitySpec          // sync, rule-based
engine.extractResumeAsync(input: ResumeInput): Promise<CapabilitySpec>  // async, LLM
```

### Matching Methods

```typescript
// Match pre-extracted specs
engine.match(demand: DemandSpec, capability: CapabilitySpec, profileId?: string): SpecMatchResult

// Match pre-extracted demand against multiple capabilities
engine.matchBatch(demand: DemandSpec, capabilities: CapabilitySpec[], profileId?: string): SpecMatchResult[]

// Convenience: extract + match (sync, rule-based)
engine.matchResume(position: PositionInput, resume: ResumeInput, profileId?: string): SpecMatchResult
engine.matchResumes(position: PositionInput, resumes: ResumeInput[], profileId?: string): SpecMatchResult[]

// Convenience: extract + match (async, LLM-powered)
engine.matchResumeAsync(position: PositionInput, resume: ResumeInput, profileId?: string): Promise<SpecMatchResult>
engine.matchResumesAsync(position: PositionInput, resumes: ResumeInput[], profileId?: string): Promise<SpecMatchResult[]>
```

### Profile Management

```typescript
engine.registerProfile(profile: ScoringProfile): void
engine.getProfile(id?: string): ScoringProfile      // Returns default (software-engineer) if id is omitted
engine.listProfiles(): string[]                      // Returns registered profile IDs
```

### Taxonomy Access

```typescript
engine.taxonomy: TaxonomyResolver   // Direct access to the resolver
engine.hasLLM: boolean              // Whether LLM extraction is available
```

---

## Custom Scoring Profiles

A `ScoringProfile` controls every aspect of how matching works. All fields are validated with Zod at runtime.

### Profile Structure

```typescript
import type { ScoringProfile } from "@openspecmatch/engine";

const profile: ScoringProfile = {
  id: "data-science",
  name: "Data Science",
  domain: "resume",                    // "resume" | "rfp" | "universal"
  description: "Optimized for data science and ML engineering roles",
  version: "1.0.0",

  // How much each category contributes to the final score.
  // Values are relative weights (do not need to sum to 100).
  categoryWeights: {
    technical_skill: 30,
    certification: 5,
    education: 15,
    domain_knowledge: 20,
    tool_proficiency: 15,
    soft_skill: 5,
    financial: 0,
    compliance: 0,
    infrastructure: 0,
    manpower: 0,
    past_performance: 0,
    geographic: 10,
  },

  // How much criticality level multiplies an item's weight.
  criticalityMultipliers: {
    mandatory: 2.0,
    important: 1.5,
    preferred: 1.0,
    optional: 0.5,
  },

  // Score multiplier based on (candidate level - required level).
  // Key "0" = exact match, "-1" = one level below, "+1" = one level above.
  levelCurve: {
    "-2": 0.20,
    "-1": 0.60,
    "0": 1.00,
    "1": 1.00,
    "2": 0.95,
  },

  // If true, a missing mandatory item sets the total score to 0.
  mandatoryIsGate: false,

  // How much evidence quality affects the item score (0 to 1).
  evidenceWeight: 0.35,

  // Months after which a skill's recency score drops to 50%.
  recencyHalfLifeMonths: 30,

  // Items scoring below this threshold appear in the "gaps" list.
  gapThreshold: 50,

  // Score multipliers for different taxonomy relationship types.
  taxonomyMatchScores: {
    exact: 1.0,
    parent: 0.65,
    child: 0.75,
    sibling: 0.45,
    related: 0.25,
    none: 0.0,
  },
};
```

Register and use:

```typescript
engine.registerProfile(profile);
const result = engine.matchResume(position, resume, "data-science");
```

---

## Extending the Taxonomy

### Adding Nodes at Runtime

Use `buildTree` to create a custom tree and register it with the resolver:

```typescript
import { buildTree, TaxonomyResolver } from "@openspecmatch/engine";

const customTree = buildTree("custom-skills", "Custom Skills", [
  {
    id: "quantum-computing",
    label: "Quantum Computing",
    aliases: ["qc", "quantum"],
    children: [
      { id: "qiskit", label: "Qiskit", aliases: ["ibm-qiskit"] },
      { id: "cirq", label: "Cirq", aliases: ["google-cirq"] },
    ],
  },
]);

const resolver = new TaxonomyResolver();
resolver.registerTree(customTree);
```

To extend the built-in taxonomy rather than replace it, create the default resolver first and add your tree:

```typescript
import { createDefaultResolver, buildTree } from "@openspecmatch/engine";

const resolver = createDefaultResolver();
resolver.registerTree(buildTree("my-extras", "Extra Skills", [
  { id: "bun", label: "Bun", aliases: ["bun.js", "bunjs"] },
]));

const engine = new OpenSpecMatchEngine({ resolver });
```

### Taxonomy Resolver Methods

```typescript
resolver.resolve(input: string): ResolveResult
resolver.relationship(nodeA: TaxonomyNode, nodeB: TaxonomyNode): TaxonomyRelationship
resolver.getNode(path: string): TaxonomyNode | null
resolver.getTree(id: string): TaxonomyTree | undefined
resolver.treeCount: number
resolver.totalNodeCount: number
```

`ResolveResult` contains:

| Field | Type | Description |
|-------|------|-------------|
| `node` | `TaxonomyNode \| null` | The matched node |
| `tree` | `string \| null` | Tree ID the node belongs to |
| `confidence` | `0-1` | Match confidence |
| `method` | `"exact_id" \| "exact_alias" \| "lowercase_alias" \| "none"` | How the match was found |

---

## Writing a Custom Extractor

Implement `DemandExtractor` or `CapabilityExtractor` for your data source:

```typescript
import type { CapabilityExtractor } from "@openspecmatch/engine";
import type { CapabilitySpec, CapabilityItem } from "@openspecmatch/engine";
import type { TaxonomyResolver } from "@openspecmatch/engine";

interface LinkedInProfile {
  name: string;
  headline: string;
  positions: Array<{ title: string; company: string; months: number }>;
  skills: string[];
  certifications: string[];
}

class LinkedInExtractor implements CapabilityExtractor<LinkedInProfile> {
  constructor(private resolver: TaxonomyResolver) {}

  extract(input: LinkedInProfile): CapabilitySpec {
    const items: CapabilityItem[] = [];

    for (const skill of input.skills) {
      const resolved = this.resolver.resolve(skill);
      items.push({
        id: `skill-${skill}`,
        category: "technical_skill",
        rawText: skill,
        taxonomyRef: resolved.node
          ? { tree: resolved.tree!, path: resolved.node.path, label: resolved.node.label }
          : null,
        level: "intermediate",  // Default; refine based on experience duration
        evidence: [],
      });
    }

    return {
      id: `linkedin-${input.name}`,
      sourceType: "linkedin",
      version: "0.1.0",
      extractedAt: new Date().toISOString(),
      items,
    };
  }
}
```

Then use it with the engine's lower-level `match` method:

```typescript
const extractor = new LinkedInExtractor(engine.taxonomy);
const capability = extractor.extract(linkedInProfile);
const demand = engine.extractPosition(position);
const result = engine.match(demand, capability);
```

---

## Database Integration Pattern

OpenSpecMatch is a pure computation library with no database dependency. USSP's ATS integrates it using an adapter layer that you can replicate:

### 1. Store specs alongside records

```typescript
// After extraction, persist the spec as JSON
const demandSpec = engine.extractPosition(positionRecord);
await db.positions.update(positionRecord.id, {
  demand_spec: JSON.stringify(demandSpec),
});

const capabilitySpec = await engine.extractResumeAsync(resumeInput);
await db.candidates.update(candidateId, {
  capability_spec: JSON.stringify(capabilitySpec),
});
```

### 2. Match on demand, cache results

```typescript
async function matchCandidate(positionId: string, candidateId: string): Promise<SpecMatchResult> {
  const position = await db.positions.get(positionId);
  const candidate = await db.candidates.get(candidateId);

  const demand: DemandSpec = JSON.parse(position.demand_spec);
  const capability: CapabilitySpec = JSON.parse(candidate.capability_spec);

  const result = engine.match(demand, capability, position.scoring_profile);

  // Cache the result
  await db.matchResults.upsert({
    position_id: positionId,
    candidate_id: candidateId,
    overall_score: result.overallScore,
    confidence: result.confidence,
    passed_gate: result.passedMandatoryGate,
    result_json: JSON.stringify(result),
    computed_at: result.computedAt,
  });

  return result;
}
```

### 3. Re-extract when source data changes

Specs are a snapshot. When a position's requirements change or a candidate uploads a new resume, re-extract and re-match:

```typescript
async function onResumeUpdated(candidateId: string, newResumeText: string) {
  const capabilitySpec = await engine.extractResumeAsync({ id: candidateId, name: "...", text: newResumeText });
  await db.candidates.update(candidateId, { capability_spec: JSON.stringify(capabilitySpec) });

  // Re-match against all active positions this candidate is applied to
  const applications = await db.applications.findByCandidate(candidateId);
  for (const app of applications) {
    await matchCandidate(app.position_id, candidateId);
  }
}
```

---

## Standalone Functions

For cases where you do not need the engine facade:

```typescript
import { matchSpecs, matchBatch, compareItems } from "@openspecmatch/engine";
import { createDefaultResolver, SOFTWARE_ENGINEER_PROFILE } from "@openspecmatch/engine";

const resolver = createDefaultResolver();

// Match two pre-built specs
const result = matchSpecs(demandSpec, capabilitySpec, SOFTWARE_ENGINEER_PROFILE, resolver);

// Batch match
const results = matchBatch(demandSpec, [cap1, cap2, cap3], SOFTWARE_ENGINEER_PROFILE, resolver);
```

---

## Input Types

### PositionInput

```typescript
interface PositionInput {
  id: string;
  title: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  requiredCertifications?: string[];
  preferredCertifications?: string[];
  educationLevel?: string;
  educationField?: string;
  minExperienceYears?: number;
  maxExperienceYears?: number;
  industry?: string;
  sector?: string;                     // federal, state, local, commercial, nonprofit, education, healthcare
  client?: string;                     // e.g., "DCFS", "DOD"
  requiredDomainKnowledge?: string[];
  requiredCompliance?: string[];       // e.g., "HIPAA", "FedRAMP", "CJIS"
  securityClearance?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    workMode?: "remote" | "hybrid" | "onsite";
    relocationOk?: boolean;
  };
  compensation?: {
    min?: number;
    max?: number;
    currency?: string;
    type?: "hourly" | "annual" | "monthly" | "project";
  };
  description?: string;
}
```

### ResumeInput

```typescript
interface ResumeInput {
  id: string;
  name: string;
  text: string;   // Plain text content of the resume
}
```
