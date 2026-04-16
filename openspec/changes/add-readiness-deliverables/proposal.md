# Change: Add scoped assessment pillars, AI enhancement catalog, constraints, and consulting-grade deliverables

## Why
Three problems with the current readiness tool:

1. **It assesses everything.** Not every engagement needs every dimension. A migration team focused on development process and testing doesn't need a data pipelines assessment or UX research evaluation. The tool should let the consultant define what's in scope first, then only show relevant steps.

2. **It lacks the deliverables consulting firms produce.** Industry comparison (McKinsey, Deloitte, BCG, Accenture) shows we're missing: workflow/SDLC analysis, organizational constraints capture, use case prioritization, risk register, and pilot recommendations.

3. **No completeness guarantee.** The current report only shows what the consultant happened to enter. There's no master checklist ensuring all possible AI enhancements were evaluated. No one in the industry maintains a versioned, pillar-by-pillar AI enhancement catalog — we would be the first.

Additionally, reports must be **auditable and traceable**. When AI capabilities evolve and the catalog updates, historical reports must still reference the exact versions of the catalog, policies, constraints, and SDLC templates that were in effect at assessment time.

The immediate customer (DCFS/ILC via Krasan) demonstrates all three: they have 5 of 9 pillars in scope, specific constraints (only Copilot + Jira AI approved, no production code writing), and need a complete assessment of all AI enhancement possibilities within those bounds.

## What Changes

### Step 0: Assessment Scope — Select What's Being Assessed

The first step after creating an assessment. The consultant selects which **pillars of software delivery** are in scope for this project. All downstream steps, questions, and report sections filter to only the selected pillars.

**9 Assessment Pillars:**

| Pillar | What It Covers | Example Questions / SDLC Phases |
|--------|---------------|-------------------------------|
| **Development Process** | Coding, code review, branching, PR workflow, technical debt | Development, Code Review phases |
| **Testing & Quality** | Test automation, coverage, regression, defect management | Testing, QA phases |
| **Documentation** | Technical docs, runbooks, knowledge base, API docs | Documentation phase |
| **PMO & Reporting** | Sprint planning, velocity tracking, status reports, retros | Sprint Planning, Retro phases |
| **BA & Requirements** | Story writing, acceptance criteria, process modeling, stakeholder analysis | Grooming, Requirements phases |
| **DevOps & Infrastructure** | CI/CD, deployments, monitoring, environments, IaC | Deployment, Infrastructure phases |
| **Data & Analytics** | Data pipelines, data quality, reporting, BI, data governance | Data phases |
| **Security & Compliance** | Security reviews, vulnerability scanning, compliance automation | Security phases |
| **Design & UX** | Prototyping, user research, accessibility, design systems | Design phases |

Each pillar has a short description and example use cases to help the consultant decide relevance.

**Scope drives everything:**
- **Constraints step**: only shows pillars relevant to scope (no "Data & Privacy" constraints if Data pillar not in scope)
- **SDLC analysis**: only generates phases relevant to in-scope pillars
- **Questionnaire**: only includes questions tagged to in-scope pillars
- **Use cases**: categorized by pillar, only in-scope pillars available
- **Report**: only includes sections for in-scope pillars

### AI Enhancement Catalog (versioned master inventory)

A maintained, versioned inventory of **every possible AI enhancement** across the 9 SDLC pillars. ~120 items in v1, organized by pillar:

| Pillar | # Items | Examples |
|--------|---------|---------|
| **Development** | ~15 | Code completion, code review automation, refactoring assistance, PR description generation, merge conflict resolution, dead code detection |
| **Testing** | ~14 | Unit test generation, regression prioritization, test data generation, flaky test detection, visual regression, API contract tests, coverage gap analysis |
| **Documentation** | ~10 | API doc generation, README generation, changelog generation, architecture diagrams, runbook generation, ADR drafting |
| **PMO** | ~10 | Sprint velocity forecasting, effort estimation, status report generation, meeting summarization, backlog prioritization, dependency mapping |
| **BA & Requirements** | ~9 | Requirements extraction from transcripts, user story generation, acceptance criteria generation, gap analysis, impact analysis |
| **DevOps** | ~11 | IaC generation, CI/CD pipeline generation, incident root cause analysis, log anomaly detection, deployment risk scoring, cost optimization |
| **Data** | ~10 | Schema design suggestion, SQL optimization, data quality anomaly detection, synthetic data generation, data lineage mapping |
| **Security** | ~10 | Vulnerability detection, secrets detection, threat modeling, compliance automation, incident response playbooks, attack surface analysis |
| **Design** | ~10 | UI generation from wireframes, design-to-code, accessibility audit, UX copy generation, design system compliance |

**For each enhancement, the consultant records:**
- **Already in use** (green) — team does this today, with which tool
- **New opportunity** (blue) — feasible within constraints, recommended
- **Blocked** (red) — would help but violates a hard constraint
- **Not applicable** (gray) — doesn't apply to this team/project
- **Not evaluated** (yellow) — gap in assessment, needs review

**Versioning:**
- Catalog has a version number (v1, v2, v3...) and release date
- New AI capabilities (e.g., new Copilot features, new tools) create a new catalog version
- Old versions are preserved — reports always reference the version used
- Catalog items have individual status: active, deprecated (replaced by newer item), new (added in this version)

**Coverage check in report:**
- "Evaluated 52 of 52 applicable AI enhancements (100% coverage)"
- "12 already in use, 18 new opportunities, 8 blocked, 14 not applicable"
- Per-pillar breakdown with coverage percentage
- Any "not evaluated" items flagged as assessment gaps

### Report Traceability (audit trail)

Every report stamps the exact versions of all data sources used:

```
── Report Version Stamps ──────────────
AI Enhancement Catalog:    v3 (2026-04-01)
Question Bank:             v2 (2026-03-15)
SDLC Template (SAFe):      v1 (2026-02-01)
Risk Template (State):     v2 (2026-03-20)
Constraint Template:       v1 (2026-01-15)

── Assessment Snapshots ───────────────
Company Policy:            "DCFS AI Policy v1.2" (uploaded)
Constraints:               8 hard, 3 soft
Approved Tools:            GitHub Copilot, Jira AI Rovo
Scope:                     5 of 9 pillars
Assessment Date:           2026-04-13
```

This ensures:
- **Reproducibility**: any historical report can be traced to exact inputs
- **Re-assessment comparison**: when catalog updates, re-running shows what changed ("v3 added 6 new enhancements in Testing — 3 are new opportunities for your team")
- **Audit compliance**: state agencies and regulated entities can demonstrate assessment rigor
- **Evolution tracking**: over time, see how the AI landscape grew and how the org's adoption progressed

### Step 1: Organizational Constraints (scoped to selected pillars)
Before designing any future state, capture what the organization **cannot** do. Constraints are structured into 6 categories:

- **Technology** — infrastructure limitations
- **AI Tools** — approved/prohibited tools + capabilities/restrictions per tool
- **Process** — workflow restrictions (e.g., "AI cannot write production code")
- **Data & Privacy** — data handling rules
- **Policy & Compliance** — regulatory/legal constraints
- **Budget & Resources** — capacity constraints

Each constraint: description, category, severity (hard/soft), source, notes.

**Hard constraints** block downstream suggestions. **Soft constraints** generate warnings. Fewer constraints = more AI opportunity — the report shows this explicitly.

### Step 2: AI-Augmented SDLC Process Analysis
Maps the team's current SDLC and shows how each in-scope phase can be augmented with approved AI tools within constraints.

- **SDLC phase template**: pre-populated based on methodology (Scrum/SAFe/Kanban) and scoped pillars — only generates phases for selected pillars
- **Per-phase AI augmentation**: system suggests opportunities filtered by approved tools + hard constraints
- **Current strengths vs. new opportunities**: consultant marks what team already does well
- **Side-by-side**: "Current SDLC" vs. "AI-Augmented SDLC" per phase
- **Improvement projection**: per-phase and overall estimated improvement

### Step 3: Data Readiness Scorecard (only if Data & Analytics pillar in scope)
5-dimension data assessment: quality, accessibility, governance, pipelines, security. Consultant-scored with evidence notes. Standalone report section.

### Step 4: Use Case Prioritization with Effort/Impact Matrix
Structured use case entry with impact (1-5) and effort (1-5) scoring. Auto-classifies into 4 quadrants: Quick Wins, Strategic Bets, Fill-Ins, Avoid. Use cases are tagged to in-scope pillars.

### Step 5: Investment Tiers
Auto-groups use cases by timeline: Tier 1 Quick Wins (0-3 months), Tier 2 Foundation (3-6 months), Tier 3 Strategic (6-12 months), Tier 4 Future (12+ months).

### Step 6: Risk Register
Pre-populated risks based on entity type + selected pillars. Custom entries. Likelihood x Impact scoring, color-coded, sorted by risk score.

### Step 7: Pilot/POC Recommendations
Structured pilots linked to Quick Win use cases. Scope, success criteria, timeline, go/no-go criteria. Warns if pilot depends on readiness blockers.

### Report Integration
Report sections are **conditional** — only in-scope sections appear:
- Executive Summary (always)
- Assessment Scope — which pillars are in scope (always)
- Readiness Tier & Capability Scores (always)
- Organizational Constraints (always)
- AI-Augmented SDLC Process (always, filtered to in-scope phases)
- Data Readiness Scorecard (only if Data & Analytics in scope)
- Use Case Roadmap with effort/impact matrix (if use cases entered)
- Investment Tiers (if use cases entered)
- Risk Register (if risks entered)
- Blockers & Policy Gaps (always)
- Role-Based Perception (always)

**Post-report deliverable (designed after reviewing findings):**
- Pilot/POC Recommendations — informed by report findings, blockers, and quick wins

## Impact
- Affected specs: `readiness-deliverables` (new capability)
- Affected code:
  - `packages/platform-core/src/types/ai-tools.ts` — new types for scope, constraints, SDLC, use cases, risks, pilots
  - `packages/platform-core/src/queries/admin/` — new query modules
  - `migrations/` — new tables
  - `packages/ai-tools/src/app/readiness/[id]/` — new step pages
  - `packages/ai-tools/src/app/readiness/[id]/report/` — conditional report sections
  - `packages/ai-tools/src/components/ReadinessSteps.tsx` — scope-aware step flow

## Database Tables (New)
- `ai_enhancement_catalog` — versioned master inventory of AI enhancements (pillar, name, description, version, status active/deprecated/new, parent_item_id for version chain, created_at)
- `catalog_versions` — catalog version registry (version number, release_date, release_notes, item_count)
- `assessment_enhancement_status` — per-assessment status of each catalog item (assessment_id, catalog_item_id, catalog_version, status: in_use/opportunity/blocked/not_applicable/not_evaluated, tool_used, notes)
- `assessment_version_stamps` — records exact versions of all data sources used in an assessment (assessment_id, source_type, source_version, source_date)
- `assessment_scope` — selected pillars per assessment (assessment_id, pillar, in_scope boolean)
- `assessment_constraints` — organizational constraints (description, category, severity hard/soft, source, notes)
- `assessment_approved_tools` — approved AI tools (tool_name, vendor, capabilities, restrictions)
- `assessment_workflow_phases` — SDLC phases scoped to selected pillars
- `assessment_ai_opportunities` — AI opportunities per phase filtered by constraints
- `assessment_data_readiness` — 5-dimension data scorecard (only if Data pillar in scope)
- `assessment_use_cases` — use cases with impact/effort scoring, tagged to pillars
- `assessment_risks` — risk register with likelihood x impact
- `assessment_pilots` — pilot recommendations linked to use cases
