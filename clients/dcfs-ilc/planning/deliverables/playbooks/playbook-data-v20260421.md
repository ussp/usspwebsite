# Data Team Playbook v0 — DCFS Illinois Connect AI Pilot

> **Version:** v0.1 — V20260421
> **Status:** DRAFT — pilot starter; will be refined with pilot learnings into v1.0 deliverable at end of pilot PI
> **Owner:** Vinay Lagisetty
> **Audience:** Krasan data engineers participating in pilot, Chase Yeung (Data Architect), Krishna (Senior Solution Architect), Romi

---

## ⚠ Data Boundaries — Read Before Every Session

**The data team role carries the highest PII exposure risk** — you work directly with data. Strictness matters.

- **Never paste** DCFS case data, child names, case IDs, CANTS/CCWIS records, SSN, DOB, addresses, phone numbers, or any PII into a prompt — in any tool (Rovo, GitHub Copilot, M365 Copilot, D365 Copilot). **Real data samples, even "just to show the format," are not acceptable.**
- **Always use synthetic data.** For mapping, transformation, or reconciliation prompts, create or use pre-approved synthetic rows that mimic structure but carry no real values.
- **Source-system snapshots belong in the source system.** Don't lift rows into prompts.
- **Self-report near-misses.** If you realize you pasted something you shouldn't have, notify the Pilot Governance Lead via the Teams channel immediately. 1-hour CIO escalation per charter §9.
- **Weekly compliance check** (Pilot Governance §5.5) explicitly reviews prompt-drift incidents. Self-reporting is welcomed — no penalty for catching and flagging your own near-miss.
- **When in doubt, ask before submitting.** The AI Transformation Lead is available on the Teams channel.

---

## Change log

| Version | Date | Changed by | What changed |
|---------|------|-----------|--------------|
| v0.1 | 2026-04-21 | Vinay | Initial draft — Phase 1 scope, Copilot for Informatica/ADF/SQL, mapping + ETL + reconciliation, addresses OLPD-style data conversion boards |

---

## 1. Why the data team is a Phase 1 role

DCFS is migrating SACWIS / CYCIS / MARS → Dynamics 365 / Dataverse. The data team's work is its own SDLC archetype, distinct from product team dev:

- **Workflow:** OLPD-style Conversion Board (Initial Data Assessment → Source Data Analysis → Target Data Modeling → Data Cleansing → Data Conversion → Mock Run Testing → Data Validation → User Acceptance) — Kanban, not Scrum
- **Output:** Mapping rules, transformation logic, conversion scripts, validation reports — not features
- **Throughput unit:** Records migrated, mapping rules authored, mock-run pass rate — not story points

**Why AI here is high-leverage:**
- Mapping work is high-volume, pattern-rich → Copilot excels at it
- SQL/ETL transformation logic is verbose → AI saves typing
- Reconciliation reports follow templates → AI accelerates writing
- Documentation (mapping spec, conversion design) is chronic time sink

---

## 2. Approved tools for data team

| Tool | Use | Status |
|------|-----|--------|
| **GitHub Copilot** | PRIMARY — SQL, ADF, Informatica expressions, conversion scripts, data quality rules | When deployed |
| **Copilot Chat** | Design, debugging, mapping reviews | When deployed |
| **Atlassian Rovo** | Mapping documentation in Confluence, conversion run reports | Available |
| **M365 Copilot** | Excel-based mapping spreadsheets, status reports | Available |

**Not approved:** ChatGPT direct, Claude direct, any external LLM.

---

## 3. Use cases & prompt patterns

### 3.1 Field-level data mapping (source → Dataverse)

**When:** Mapping a SACWIS / CYCIS / MARS source table to a Dataverse entity.

**Tool:** Copilot Chat (with both schemas as context)

**Prompt pattern:**
```
Generate field-level mapping from this source table to this Dataverse entity:

Source schema (SACWIS table):
[paste DDL or column list with types, nullability, constraints]

Target schema (Dataverse entity):
[paste entity definition — column name, data type, required, max length,
choice options if applicable]

Mapping considerations:
- Direct 1:1 mappings (same semantic, compatible type)
- Type coercions needed (e.g., source CHAR(10) → target string with trim)
- Lookups (source ID → target GUID via lookup table)
- Choice/option set mappings (source code → Dataverse option value)
- Calculated fields (combine source fields → single target)
- Default values for required target fields not in source
- Unmappable source fields (note for review — drop or capture?)
- Required target fields with no source (note for review — default or block?)

Output:
| Source Field | Target Field | Mapping Type | Transformation | Notes |
|--------------|--------------|-------------|----------------|-------|

Flag every uncertain mapping as REVIEW.

Constraint: Don't invent target fields. If source has a field with no target,
mark as UNMAPPED — don't create a fake destination.
```

**Quality check:** Walk through every REVIEW row with the data architect; verify every direct mapping with one sample record (synthetic).

### 3.2 SQL transformation queries

**When:** Writing the SQL that extracts source data and applies transformations before loading.

**Tool:** Copilot in your SQL IDE

**Prompt pattern:**
```
Write a SQL query to:
- Extract from [source table(s)]
- Apply these transformations: [list, ref to mapping spec]
- Output columns matching: [target schema]

Specifics:
- Source: SQL Server [version]
- Joins required: [list]
- Filter: [criteria — e.g., active records only, last X years, specific
  organization unit]
- Handle NULLs: [policy — coalesce, exclude, default]
- Handle duplicates: [policy — dedupe by what key]
- Performance hints: indexed columns are [list]; expected row count is [N]

Output the query with comments per transformation block.
```

**Quality check:** Run against a small subset first; verify row count and sample values; profile for performance before full run.

### 3.3 Azure Data Factory pipeline

**When:** Building or modifying an ADF dataflow / pipeline.

**Tool:** Copilot Chat (ADF JSON is verbose — Copilot helps generate scaffolds)

**Prompt pattern:**
```
Generate an ADF dataflow to:

Source: [linked service + dataset]
Transformations: [ordered list — Filter, Derived Column, Join, Aggregate, etc.]
Sink: [linked service + dataset]

Specifics:
- Schema drift handling: [enabled/disabled]
- Partition strategy: [round-robin / hash / single]
- Error row handling: [route to error sink / continue / fail]
- Logging: [info / debug level]

Output:
- Dataflow JSON
- Pipeline JSON (if pipeline-level orchestration needed)
- Parameter list (with descriptions)
- Suggested triggers (schedule / event / manual)

Match our existing ADF naming conventions: [paste examples]
```

**Quality check:** Import into ADF, run debug session against subset, verify lineage and row counts.

### 3.4 Informatica mapping expressions

**When:** Writing transformations in Informatica PowerCenter / Cloud.

**Tool:** Copilot

**Prompt pattern:**
```
Generate Informatica expressions for these transformations:

Source columns: [list with types]
Target columns: [list with types]
Required transformations:
[list — e.g., "Concatenate FIRST_NAME and LAST_NAME with space",
"Convert YYYYMMDD string to DATE", "Lookup ORG_CODE in ORG_LOOKUP table",
"Decode STATUS codes A/I/P to Active/Inactive/Pending"]

Output Informatica expression syntax (not SQL — note the difference):
- Use IIF, DECODE, TO_DATE, TO_CHAR, LOOKUP functions per Informatica syntax
- Handle nulls explicitly with IIF(ISNULL(...))
- Add comments per expression

For lookups: provide both the lookup transformation config AND the
lookup-pulling expression.
```

**Quality check:** Test in Informatica; verify expressions compile and produce expected outputs on sample data.

### 3.5 Data quality / validation rules

**When:** Writing pre-load or post-load validation checks.

**Tool:** Copilot

**Prompt pattern:**
```
Generate data quality validation rules for this Dataverse entity:

Entity schema: [paste]
Business rules (from BA / SME): [list]

Generate validation rules covering:
1. Required field presence
2. Format checks (email, phone, SSN format — note: validation only, no
   real values)
3. Range checks (date ranges, numeric ranges)
4. Referential integrity (lookups must resolve)
5. Cross-field consistency (e.g., end date > start date)
6. Choice value validity (must be in option set)
7. Uniqueness constraints
8. Business rule validity (per provided rules)

For each rule:
- Rule ID (DQ-{entity}-{NN})
- Rule description (1 sentence)
- SQL or Power FX expression to detect violations
- Severity (Critical / Warning / Info)
- Recommended action on failure (block / log / alert)

Output as a table I can import into our DQ framework.
```

**Quality check:** Run rules against historical data sample; expected violation counts should match SME expectations.

### 3.6 Conversion script authoring (matches OLPD board workflow)

**When:** Writing the script that performs an actual data conversion run.

**Tool:** Copilot

**Prompt pattern:**
```
Generate a conversion script following our OLPD conversion pattern:

Stage: [Initial Data Assessment / Source Data Analysis / Target Data Modeling /
        Data Cleansing / Data Conversion / Mock Run Testing / Data Validation]

Inputs:
- Source table(s): [list]
- Mapping spec: [link]
- Validation rules: [link]
- Target environment: [Mock / UAT / Prod — affects logging level]

Required steps:
1. Pre-flight checks (source row count, target schema confirmed)
2. Extract → Transform → Load (with row-by-row error capture)
3. Post-load reconciliation (row counts, sum-checks on numeric fields)
4. Validation rule pass (run DQ rules)
5. Generate conversion report

Logging:
- Row-level: only on errors (avoid huge logs in prod)
- Stage-level: always (for the conversion report)
- Performance: capture elapsed per stage

Output a script in [PowerShell / SQL / Python / ADF — match our toolchain]
with each stage clearly delimited.
```

**Quality check:** Mock run before production; review reconciliation report; verify error capture works by inducing a known failure.

### 3.7 Reconciliation reports

**When:** After a conversion run; need to compare source vs. target.

**Tool:** Copilot for SQL + Rovo for the report write-up

**Prompt pattern (Copilot — SQL):**
```
Generate reconciliation queries comparing source vs. target:

Source: [system + table(s)]
Target: Dataverse [entity]
Conversion run ID: [ID]

Generate queries for:
1. Row count delta (source vs. target — should match within tolerance)
2. Sum/count delta on key numeric fields (financial integrity)
3. Distinct value comparison on categorical fields
4. Unmapped record list (source records that didn't make it to target)
5. Error record list (records that errored during conversion)
6. Sample row comparison (random N records, full field-by-field diff)

Tolerances:
- Row count: 0% delta required (must match exactly)
- Numeric sums: 0% delta required
- Distinct values: 0 unexpected target values

Output queries + a summary template I can fill with the results.
```

**Prompt pattern (Rovo — write-up):**
```
Write a conversion run report based on these reconciliation results:

[paste query results]

Audience: Data Architect (Chase) + program leadership
Length: 1 page

Include:
- Run summary (date, environment, scope)
- Headline result (PASS / PASS WITH ISSUES / FAIL)
- Reconciliation table (source vs target counts)
- Issues encountered (with proposed resolution)
- Recommendation (proceed to next environment / address issues and re-run)

Tone: factual, no hedging, surface real risks honestly.
```

**Quality check:** Verify every number in the report against the source query — Rovo can paraphrase numbers incorrectly.

### 3.8 Mapping documentation

**When:** Creating / updating the mapping spec in Confluence.

**Tool:** Rovo

**Prompt pattern:**
```
Update the mapping spec page [Confluence link] for entity [name]:

New mappings to add:
[paste from your mapping work]

Changes to existing mappings:
[paste change list with rationale]

Maintain the existing page structure:
- Section 1: Overview
- Section 2: Source schema reference
- Section 3: Target schema reference
- Section 4: Field-by-field mapping table
- Section 5: Transformation notes
- Section 6: Validation rules
- Section 7: Open questions
- Section 8: Change log

Add a change log entry with date, change description, and author.
```

**Quality check:** Verify all new mappings appear in section 4 table; confirm change log is appended (not replaced).

---

## 4. Workflow integration (OLPD-style Conversion Board)

### Where AI fits in the data team workflow

```
SOURCE SYSTEM (SACWIS / CYCIS / MARS)
      ↓
[INITIAL DATA ASSESSMENT]
  └─ Copilot for source profiling SQL
      ↓
[SOURCE DATA ANALYSIS]
  └─ Copilot for analysis queries
      ↓
[TARGET DATA MODELING]
  └─ Copilot Chat for entity design discussion
  └─ Rovo for documentation
      ↓
[DATA CLEANSING]
  └─ Copilot for cleansing SQL/ADF
      ↓
[DATA CONVERSION]
  └─ Copilot for conversion script (per 3.6)
  └─ Copilot for ADF/Informatica (per 3.3, 3.4)
      ↓
[MOCK RUN TESTING]
  └─ Copilot for reconciliation queries (per 3.7)
  └─ Rovo for run report (per 3.7)
      ↓
[DATA VALIDATION]
  └─ Copilot for DQ rules (per 3.5)
      ↓
[USER ACCEPTANCE]
  └─ Rovo for UAT summary
      ↓
PRODUCTION CONVERSION
```

### Tag every AI-touched artifact

- **Mapping spreadsheet:** column "AI-Assisted" — Yes/No per row
- **Conversion script:** add `# AI-assisted` comment in script header
- **DQ rules:** tag in metadata
- **Confluence page:** add label `ai-assisted`
- **Jira card:** label `ai-assisted`

---

## 5. HITL discipline & DCFS guardrails

### Hard rules

1. **No real source data in prompts** — even for "realistic mapping examples." Use synthetic.
2. **No real PII patterns** — no real SSNs, names, addresses, even as samples.
3. **Human reviews every mapping** — AI suggests, data architect confirms.
4. **Conversion scripts go through PR review** — no autonomous execution.
5. **Production runs require explicit human approval** — no scheduled AI-triggered conversions.

### Soft rules

- Validate AI-generated SQL on small samples first (cost + risk control)
- Don't paste another team's data schema without permission
- Don't trust Copilot-generated DQ rules without SME validation
- Reconciliation numbers must come from real queries, not Rovo summaries
- Flag if Copilot suggests dropping data without your review

### What to do if you suspect a leak

1. Stop the conversion run if mid-execution
2. Do not commit or share the output
3. Notify Robert Rodriguez immediately
4. Review what was pasted; document for incident response

---

## 6. Success metrics for data team pilot participants

Tracked from Jira (OLPD-style boards) + manual logs + Tempo.

### Throughput (data-team specific)

| Metric | Source | Target |
|--------|--------|--------|
| Mapping rules authored per engineer per week | Mapping spec versioning | +20% over baseline |
| Records migrated per sprint | Conversion run logs | +15% over baseline |
| ETL pipeline tasks delivered per sprint | Jira (OLPD-style cards) | +15% |
| DQ rules authored per sprint | DQ framework | +20% |
| Conversion scripts per sprint | Repo commits | trended |

### Quality (guardrails)

| Metric | Source | Target |
|--------|--------|--------|
| Mock-run pass rate on first try | Conversion run logs | ↑ |
| Data quality defect rate per 1000 records | DQ framework | ↓ |
| Reconciliation discrepancies per run | Reconciliation reports | ↓ |
| Re-run rate (how often a conversion needs re-running) | Conversion logs | ↓ |
| Production conversion rollback rate | Conversion logs | flat (must not regress) |

### Adoption

| Metric | Source | Target |
|--------|--------|--------|
| % mappings tagged AI-assisted | Mapping spec | trended |
| Copilot acceptance rate (data-team users) | Copilot admin | 40-70% |

### Self-reported

| Metric | Source | Target |
|--------|--------|--------|
| Time saved per mapping rule (mins) | Weekly check-in | self-reported |
| Time saved per conversion script (hrs) | Weekly check-in | self-reported |
| Confidence in AI output (1-5) | Monthly survey | ≥ 4 by Sprint 4 |

---

## 7. Training emphasis

### Pre-pilot training (3h, before PI Planning)

| Module | Duration | Content |
|--------|----------|---------|
| Foundation (shared) | 1.5h | DoIT compliance, HITL, success criteria |
| Data team track | 3h | Copilot for SQL/ADF/Informatica patterns, mapping prompts (3.1), DQ rule generation (3.5), reconciliation workflow (3.7), Confluence/Rovo for mapping spec, anti-patterns |

### Critical training emphases

- **Schema-aware prompting** — give Copilot the source AND target schema for better output
- **SQL Server / ADF / Informatica syntax differences** — Copilot defaults to standard SQL; verify dialect-specific functions
- **Reconciliation discipline** — numbers must come from queries, not summaries
- **Mock-before-prod** — never run AI-generated conversion against production without mock run
- **No-real-data discipline** — synthetic patterns for any sample data

---

## 8. Anti-patterns

| Anti-pattern | Why it's bad | What to do instead |
|--------------|--------------|-------------------|
| Pasting real source data as "example for context" | Hard policy violation | Use synthetic schema-shaped examples |
| Accepting an AI mapping without verifying with sample data | Subtle errors compound across millions of records | Verify every direct mapping with a sample row |
| Running AI-generated SQL against full source dataset first time | Performance / cost / lock risk | Start with TOP 100, iterate, then scale |
| Letting Copilot "guess" target field for unmappable source | Creates fictional target fields | Mark UNMAPPED; ask data architect |
| Writing reconciliation reports from Rovo without source queries | Numbers may drift from reality | Numbers come from queries; Rovo does narrative only |
| Using AI to skip the mock-run stage | Mock run catches errors AI can't predict | Mock is mandatory regardless of AI confidence |
| Removing AI-Assisted tag because the mapping looks "obvious" | Skews comparison | Tag accurately; the data is the point |
| Trusting a Copilot-generated DQ rule without SME confirmation | DQ rules encode business logic AI doesn't know | SME signs off on every DQ rule |
| Asking Copilot to optimize a slow query without understanding the original | "Optimization" may change semantics | Profile first, understand bottleneck, then optimize with verification |

---

## 9. Open questions for this Data playbook

1. **What's the OLPD-team current mapping rule throughput?** (baseline)
2. **Does the data team use Tempo for hours tracking?**
3. **What's the target-state reconciliation tolerance per entity?** (some entities require 0%, others may allow small variances)
4. **Are there existing Copilot-friendly SQL/ADF examples in our repos?**
5. **Is there a data dictionary in Confluence that Rovo can use as context?**
6. **Are mock-run environments accessible per data engineer or shared?**
7. **What's the production conversion rollback procedure?** (need to confirm AI-generated scripts can be rolled back)
8. **Is Chase's team using the OLPD-style Conversion Board, or is each conversion team using their own?** (affects measurement aggregation)
9. **What's the current reconciliation defect leak rate?** (mock pass → prod issues)
10. **Are there cross-system data lineage tools we should reference for Copilot context?**

---

## 10. Pilot participant checklist

Before you start using AI on data work:

- [ ] Foundation training complete
- [ ] Data team track complete
- [ ] Copilot deployed (or fallback to Rovo for documentation only)
- [ ] Rovo access on DCFS Jira/Confluence
- [ ] Source system access and schema documentation in hand
- [ ] Dataverse target schema in hand
- [ ] Read this playbook end-to-end
- [ ] Mock environment access confirmed
- [ ] Mapping spec template + Confluence page in hand
- [ ] Synthetic data conventions understood
- [ ] AI-assisted tagging convention understood (mapping spec + Jira + repo)
- [ ] Know how to report a suspected leak (Robert)
- [ ] Tracking time saved in weekly check-in

---

## Appendix A: Reference

| For details on... | See |
|-------------------|-----|
| Engagement scope, in/out, Phase 2/3 | [../scope-running-book-v04212026.md](../scope-running-book-v04212026.md) |
| Measurement methodology | [../measurement-methodology-v04142026.md](../measurement-methodology-v04142026.md) |
| Rollout plan + timeline | [../../rollout-plan.md](../../rollout-plan.md) |
| DoIT policy + governance | [../governance-proposal-v04142026.md](../governance-proposal-v04142026.md) |
| Risk register | [../assumptions-and-risks.md](../assumptions-and-risks.md) |
| Other role playbooks | [./](.) |
