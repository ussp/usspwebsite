## Context

The readiness assessment workflow needs to adapt to different engagement scopes. A full enterprise assessment touches all software delivery dimensions, while a focused engagement like DCFS only touches development, testing, documentation, PMO, and BA. The tool should ask "what are we assessing?" first, then tailor everything downstream.

## Goals / Non-Goals

**Goals:**
- Assessment scope selection as the first step — 9 pillars, consultant picks what's relevant
- All downstream steps (constraints, SDLC, questionnaire, use cases, risks, pilots, report) filter by scope
- Organizational constraints as a structured foundation layer
- AI-augmented SDLC with constraint-filtered opportunity mapping
- Consulting-grade deliverables: use case roadmap, investment tiers, risk register, pilot recommendations
- Data readiness scorecard (conditional on scope)

**Non-Goals:**
- Dynamic scope changes mid-assessment (scope is set upfront, can be changed but triggers regeneration)
- Automated constraint discovery from external systems
- Financial ROI modeling

## Decisions

### 1. Assessment Scope: 9 Pillars of Software Delivery
- **Decision**: Define 9 pillars that cover the full software delivery lifecycle. Consultant selects which are in scope. Everything downstream filters.
- **Why**: Not every engagement needs every dimension. DCFS needs 5 of 9. A data team might need 3 of 9. Making the consultant select upfront prevents irrelevant screens, questions, and report sections.
- **Pillar design**: Each pillar maps to SDLC phases, question bank categories, use case tags, and risk templates. This is the single filter that cascades through the entire assessment.
- **Pillar list**: Development Process, Testing & Quality, Documentation, PMO & Reporting, BA & Requirements, DevOps & Infrastructure, Data & Analytics, Security & Compliance, Design & UX.

### 2. Organizational Constraints: 6 Categories with Hard/Soft Severity
- **Decision**: Constraints are captured in 6 categories (Technology, AI Tools, Process, Data & Privacy, Policy & Compliance, Budget & Resources). Each has hard (blocking) or soft (warning) severity.
- **Why**: Every organization has different boundaries. The constraint layer is the foundation that makes the SDLC analysis and all recommendations realistic rather than aspirational.
- **Hard vs. Soft**: Hard constraints filter out suggestions entirely. Soft constraints flag them with warnings. The report shows: "If constraint X were relaxed, Y additional opportunities become available."
- **Constraint categories vs. assessment pillars**: These are different dimensions. Pillars = what we're assessing. Categories = what limits us. A "Process" constraint like "no autonomous deployments" applies across Development and DevOps pillars.

### 3. AI-Augmented SDLC: Scope-Filtered Phase Generation
- **Decision**: SDLC phases are generated based on selected pillars + methodology template. Only in-scope pillars produce phases.
- **Why**: If "Design & UX" is not in scope, no design phases appear. If "Data & Analytics" is not in scope, no data pipeline phases appear. The SDLC analysis stays focused.
- **Phase-to-pillar mapping**: Sprint Planning → PMO, Grooming → BA, Development → Development Process, Code Review → Development Process, Testing → Testing & Quality, Documentation → Documentation, Deployment → DevOps, Retro → PMO. Multiple pillars can map to one phase.

### 4. Conditional Report Sections
- **Decision**: Report sections only appear for in-scope pillars and entered data. No empty sections.
- **Why**: A DCFS report shouldn't have a blank "Data Readiness" section. If the pillar wasn't in scope, the section is omitted entirely. If use cases weren't entered, the roadmap section is omitted.

### 5. Use Cases Tagged to Pillars
- **Decision**: Each use case is tagged to one or more in-scope pillars. The effort/impact matrix can be filtered by pillar.
- **Why**: Lets the report show "Quick Wins for Testing" vs. "Quick Wins for PMO" — actionable for different audiences.

### 6. Risk Pre-Seeding: Entity Type + Scope
- **Decision**: Pre-populated risks consider both entity type AND selected pillars. A state agency with DevOps in scope gets infrastructure-specific compliance risks that a state agency without DevOps wouldn't see.
- **Why**: More targeted risk suggestions = less cleanup by the consultant.

### 7. Workflow Step Order
- **Decision**: company → team → policy → **scope** → **constraints** → **sdlc** → **data** (if in scope) → **use-cases** → questionnaire → distribute → **risks** → report → **pilot**
- **Why**: Scope must come before constraints (constraints are filtered to scope). Constraints must come before SDLC (SDLC is filtered by constraints). Data is conditional on scope. Use cases, risks, and pilots build on the SDLC analysis.

### 8. AI Enhancement Catalog: Versioned Master Inventory
- **Decision**: Maintain a versioned catalog of ~120 AI enhancements organized by pillar. Each assessment evaluates all in-scope items. The catalog is updated when AI capabilities evolve (new tools, new features). Old versions are preserved.
- **Why**: No one in the industry maintains this. It guarantees completeness — the report shows "we evaluated 52 of 52 applicable enhancements" instead of "we thought of these 8." It also tracks the AI landscape evolution over time.
- **Versioning model**: Same pattern as the question bank — new versions create new items linked to parents, old items deprecated. Catalog versions are numbered (v1, v2, v3) with release dates.
- **Update cadence**: Quarterly review recommended. Major tool releases (e.g., new Copilot features) trigger ad-hoc updates.

### 9. Report Traceability: Version Stamps on Everything
- **Decision**: Every report records the exact versions of: AI Enhancement Catalog, Question Bank, SDLC Template, Risk Template, Constraint Template. Plus snapshots of: company policy, constraints, approved tools, scope.
- **Why**: Auditability for regulated clients (state agencies, healthcare). Reproducibility for re-assessments. Evolution tracking across assessments.
- **Storage**: `assessment_version_stamps` table — one row per source type per assessment. Source types: `catalog`, `question_bank`, `sdlc_template`, `risk_template`, `constraint_template`.
- **Report rendering**: Version stamps appear in a "Report Metadata" section at the bottom of every report, and in the print header.

## Risks / Trade-offs

- **Scope selection adds a step**: Mitigation — it's a simple checkbox screen, takes 30 seconds, saves minutes downstream.
- **Pillar boundaries are fuzzy**: Some activities span pillars (e.g., "API documentation" = Development + Documentation). Mitigation — allow multiple pillar tags per phase, question, and use case.
- **Scope lock-in**: Changing scope mid-assessment requires regenerating SDLC phases and questionnaire. Mitigation — warn on scope change, offer to regenerate.
