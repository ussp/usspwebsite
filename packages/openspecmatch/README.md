# OpenSpecMatch

A structured matching engine that compares demands (position requirements) against capabilities (candidate resumes) using taxonomy resolution, proficiency levels, evidence scoring, and configurable scoring profiles.

## Installation

```bash
npm install @openspecmatch/engine
```

Optional peer dependencies for LLM-powered extraction:

```bash
npm install @anthropic-ai/sdk   # For Anthropic Claude
npm install openai               # For OpenAI
```

## Quick Start

```typescript
import { OpenSpecMatchEngine } from "@openspecmatch/engine";

const engine = new OpenSpecMatchEngine();

const position = {
  id: "pos-1",
  title: "Senior Python Developer",
  requiredSkills: ["Python", "PostgreSQL", "Docker"],
  preferredSkills: ["Kubernetes", "AWS"],
  requiredCertifications: ["AWS SAA"],
  educationLevel: "bachelors",
  minExperienceYears: 5,
  sector: "commercial",
  location: { city: "Chicago", state: "IL", workMode: "hybrid" },
};

const resume = {
  id: "res-1",
  name: "Jane Doe",
  text: `Senior Software Engineer with 7 years of Python experience.
    Built REST APIs with Django and Flask. PostgreSQL and Redis.
    Docker, Kubernetes, AWS. AWS Solutions Architect Associate certified.
    BS Computer Science, University of Illinois.`,
};

const result = engine.matchResume(position, resume);

console.log(result.overallScore);        // 0-100
console.log(result.confidence);          // 0-100
console.log(result.passedMandatoryGate); // true/false
console.log(result.strengths);           // Items scored 70+
console.log(result.gaps);               // Items scored below 50
```

## Features

- **Taxonomy resolution** -- 650+ built-in skill, certification, education, and domain nodes with alias support. "k8s" matches "Kubernetes", "AWS SAA" matches "AWS Solutions Architect".
- **Proficiency levels** -- Five-point scale (awareness through expert) with configurable level curves.
- **Evidence scoring** -- Stronger proof (years of experience, certifications) scores higher than bare mentions.
- **Recency decay** -- Skills used recently score higher. Configurable half-life per profile.
- **Location matching** -- Metro area recognition (20+ metros), work mode compatibility (remote/hybrid/onsite).
- **Sector awareness** -- Federal, state, local, commercial, nonprofit, education, healthcare sectors with cross-sector partial credit.
- **Scoring profiles** -- Built-in profiles for software engineering and healthcare. Create custom profiles for any domain.
- **LLM mode** -- Optional LLM-powered resume extraction using Anthropic Claude or OpenAI for higher accuracy.
- **Batch matching** -- Match one position against many resumes in a single call.

## Operation Modes

| Mode | Resume Extraction | LLM Required | Use Case |
|------|------------------|--------------|----------|
| `standard` | Rule-based (regex/pattern) | No | Fast, no API cost |
| `full` | LLM-powered | Yes | Higher accuracy for complex resumes |

```typescript
// Standard mode (default)
const engine = new OpenSpecMatchEngine();

// Full mode with Anthropic
const engine = new OpenSpecMatchEngine({
  mode: "full",
  llm: { type: "anthropic", apiKey: "sk-ant-..." },
});

// Full mode with OpenAI
const engine = new OpenSpecMatchEngine({
  mode: "full",
  llm: { type: "openai", apiKey: "sk-...", model: "gpt-4o" },
});
```

In full mode, use the async methods:

```typescript
const result = await engine.matchResumeAsync(position, resume);
const results = await engine.matchResumesAsync(position, [resume1, resume2]);
```

## Scoring Profiles

Two built-in profiles ship with the package:

**`software-engineer`** (default) -- Technical skills weighted 35%. Mandatory items are soft penalties (no auto-disqualification). Evidence weight 30%. Skills decay over 36 months.

**`healthcare-clinical`** -- Certifications weighted 35%. Mandatory gate ON: missing a required license sets the score to 0. Evidence weight 60%. Skills decay over 24 months.

Register custom profiles:

```typescript
engine.registerProfile({
  id: "government-it",
  name: "Government IT",
  domain: "resume",
  description: "Profile for government IT positions",
  version: "1.0.0",
  categoryWeights: {
    technical_skill: 25,
    certification: 10,
    education: 10,
    domain_knowledge: 25,
    tool_proficiency: 10,
    soft_skill: 5,
    compliance: 10,
    geographic: 5,
    financial: 0, infrastructure: 0, manpower: 0, past_performance: 0,
  },
  criticalityMultipliers: { mandatory: 2.5, important: 1.5, preferred: 1.0, optional: 0.5 },
  levelCurve: { "-2": 0.20, "-1": 0.60, "0": 1.00, "1": 1.00, "2": 0.95 },
  mandatoryIsGate: true,
  evidenceWeight: 0.4,
  recencyHalfLifeMonths: 36,
  gapThreshold: 50,
  taxonomyMatchScores: { exact: 1.0, parent: 0.65, child: 0.75, sibling: 0.40, related: 0.25, none: 0.0 },
});

const result = engine.matchResume(position, resume, "government-it");
```

## Taxonomy

The built-in taxonomy includes four trees:

| Tree | Nodes | Covers |
|------|-------|--------|
| `technology` | 300+ | Languages, frameworks, cloud, databases, DevOps, AI/ML, testing, enterprise platforms |
| `certifications` | 60+ | AWS, Azure, GCP, security, PM, healthcare, data |
| `education` | 20+ | Degree levels and fields of study |
| `domainKnowledge` | 200+ | Government agencies, sectors, compliance frameworks, industry verticals |

Access the resolver directly for taxonomy lookups:

```typescript
const resolved = engine.taxonomy.resolve("k8s");
// { node: { id: "kubernetes", label: "Kubernetes", ... }, tree: "technology", confidence: 1.0 }

const rel = engine.taxonomy.relationship(nodeA, nodeB);
// "exact" | "parent" | "child" | "sibling" | "related" | "none"
```

## Reading Results

A `SpecMatchResult` contains:

| Field | Type | Description |
|-------|------|-------------|
| `overallScore` | 0-100 | Weighted aggregate score |
| `confidence` | 0-100 | How much data was available to score |
| `passedMandatoryGate` | boolean | Whether all mandatory items were found |
| `failedMandatory` | string[] | IDs of mandatory items that failed |
| `strengths` | MatchSummaryItem[] | Items scored 70+ |
| `gaps` | MatchSummaryItem[] | Items scored below the gap threshold |
| `unknowns` | MatchSummaryItem[] | Items with no matching data |
| `categoryScores` | Record | Per-category score, weight, and match count |
| `itemMatches` | ItemMatch[] | Full detail for every demand-capability pair |

Each `ItemMatch` includes a `scoreBreakdown` with four factors: `taxonomyMatch`, `levelFit`, `evidenceStrength`, and `recency`.

## RFP Matching (Phase 2)

OpenSpecMatch also supports **Government RFP** scoring: match a `DemandSpec` with `domain: "rfp"` against a `CapabilitySpec` with `domain: "company"`, producing a verdict (GO / GO_WITH_REMEDIATION / NO_GO) plus structured blockers + remediation plans.

### Extractors

- `RFPExtractor` — rule-based, takes structured requirement list; good when a bid team has already read the RFP.
- `LLMRFPExtractor` — extracts from raw RFP text (Anthropic/OpenAI); LLM-only items are tagged with `extractor:llm_only` in their context.
- `CompanyExtractor` — rule-based, takes structured capability input.
- `LLMCompanyExtractor` — extracts from company profile docs / pitch decks.

### Multi-entity Combinator

Bids often come from a consortium (primary bidder + tech partner). `combine()` merges multiple `CapabilitySpec`s into a single consortium spec. Overlapping items keep the highest level, union evidence, and preserve per-entity attribution via a synthetic `[contributors]` evidence record.

```typescript
const consortium = engine.combineCapabilities(
  [usspplSpec, fleetronixSpec],
  { combinedId: "bid-consortium", combinedName: "USSPPL + Fleetronix" }
);
```

### `government-rfp` Scoring Profile

Built-in profile tuned for India Govt RFPs:

- `mandatoryIsGate: true` — missing a mandatory compliance/infrastructure item sets `overallScore` to 0 and flags the gate fail.
- Category weights: compliance 25, infrastructure 30, past_performance 18, manpower 12, financial 10, geographic 5.
- `evidenceWeight: 0.45` — Govt values proven track record.
- 48-month recency half-life.

### Bid / No-Bid Recommender

`matchRFP()` is the convenience method for the full pipeline. It attaches a `recommendation` to the result.

```typescript
import { OpenSpecMatchEngine } from "@openspecmatch/engine";

const engine = new OpenSpecMatchEngine();

const remediation = {
  "cmp-001": { description: "Engage ARAI for AIS 140 TAC", estimatedEffortWeeks: 12, ownerHint: "Tech partner" },
  "inf-001": { description: "Migrate backend to NIC Cloud", estimatedEffortWeeks: 8, ownerHint: "CTO" },
  // ...
};

const result = engine.matchRFP(demand, capability, {
  profileId: "government-rfp",
  recommender: { remediation, goThreshold: 70 },
});

console.log(result.recommendation!.verdict);     // "GO" | "GO_WITH_REMEDIATION" | "NO_GO"
console.log(result.recommendation!.blockers);    // failed mandatories + important misses
console.log(result.recommendation!.remediation); // per-blocker remediation plans
```

### Verdict Rules

| Condition | Verdict |
|---|---|
| Gate passes AND overall score ≥ `goThreshold` (default 70) | `GO` |
| Gate fails BUT every mandatory blocker has a remediation path | `GO_WITH_REMEDIATION` |
| Gate passes but overall < `goThreshold` | `GO_WITH_REMEDIATION` (fix important gaps) |
| Gate fails AND any mandatory blocker has no remediation | `NO_GO` |

### Reference Fixture — Fleettronix (AIS 140 / Andhra Pradesh)

The package ships a full fixture in `src/__tests__/fixtures/fleettronix/`:

- `ais140-demand.ts` — DemandSpec hand-authored from the MoRTH Gazette + VTS Guidelines.
- `ussppl-fleetronix-capability.ts` — CapabilitySpec combining USSPPL (bidder) + Fleetronix (tech partner).

Run the full pipeline interactively:

```bash
cd packages/openspecmatch
npx tsx examples/fleettronix-rfp/run-match.ts --report
```

Expected output: `GO_WITH_REMEDIATION` verdict with 21 mandatory blockers (TAC, NIC Cloud, VAHAN, ERSS, CERT-IN, SSL, SoI, PBG, EMD, etc.), each with a remediation path.

### Phase 2 Taxonomy Trees

Three new taxonomy trees load by default via `createDefaultResolver()`:

- **infrastructure** — NIC Cloud, VAHAN, ERSS/Dial-112, CERT-IN, SoI maps, Control Tower, MC equipment, connectivity
- **financial** — PBG, EMD, turnover brackets, Nirbhaya funding, GeM/MSME empanelment
- **manpower** — PIU, nodal officer, 24×7 ops, helpdesk L1/L2/L3, language coverage (Telugu, Hindi, English)

## Detailed Scoring Rules

See [docs/matching-algorithm.md](docs/matching-algorithm.md) for a full explanation of how taxonomy matching, level fit, evidence, recency, and location scoring work.

## Developer Guide

See [docs/developer-guide.md](docs/developer-guide.md) for architecture details, custom extractors, taxonomy extension, and database integration patterns.

## License

UNLICENSED
