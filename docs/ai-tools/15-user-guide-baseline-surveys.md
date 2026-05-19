# Baseline Surveys — User Guide & Reference

> Audience: admins running external-survey imports and developers extending the platform.
> Surface: `tools.ussp.co` → **Readiness Assessment** sidebar group → **Survey Baselines** (and **Import Survey** action).

---

## What this is for

`tools.ussp.co` was originally built around *native* readiness assessments — a 12-step wizard that collects company profile, team roster, AI policy, etc., generates a token-keyed questionnaire, and emails respondents to fill it in. That flow assumes:

- you control the question bank
- every respondent has a pre-registered member record
- every answer is a Likert score

External surveys (SurveyMonkey, MS Forms, Google Forms, CSV exports) violate all three. The **Baseline Surveys** feature lets you load that data without distorting the existing readiness flow, then render aggregates in the same UI.

Use it when:
- you already ran a survey externally and just need the results in the platform
- you want to compare pre/post survey results across an engagement
- the survey contains non-Likert questions (multi-select, free-text, numeric)
- you don't have per-respondent email/identity (anonymous responses)

---

## Admin user guide

### 1 · Seed the question bank

The platform aggregates by `question_bank.id`. Before importing responses you need question_bank entries for every column you intend to load.

Two ways:
- **Admin → Question Bank** UI (`/readiness/questions`) — create one at a time, set type (Likert / single / multi / numeric / free_text) and options.
- **Bulk seed via SQL or a one-off script** — see `scripts/load-dcfs-baseline-survey.ts` for the DCFS example. Copy and adapt the `ALL_QUESTIONS` array for new surveys.

Question types currently supported:

| Type | Storage | Aggregation |
|---|---|---|
| `likert` | `response_answers.score` (1–5 integer) | mean, % agree+ (≥4), % strongly agree (=5) |
| `single_choice` | `response_answers.choice_values` (1-element array) | distribution % |
| `multi_choice` | `response_answers.choice_values` (n-element array) | distribution % |
| `numeric` | `response_answers.numeric_value` (any numeric) | mean |
| `free_text` | `response_answers.text_value` (raw string) | sample quotes (first N) |

### 2 · Create the assessment

`/readiness` → **+ New Assessment** → name it (e.g. "Q3 2026 Pulse Survey"). Skip the company/team/policy wizard steps — for imported surveys they aren't used; the assessment just exists as a container.

Alternative: create via a script that inserts directly into `readiness_assessments` with `status='completed'`.

### 3 · Import the file

`/readiness/import` → upload `.xlsx` or `.csv` (5 MB cap). The page parses the file client-side and shows every column with a sample value.

For each column, pick one of:

- **Ignore** — skip this column entirely (timestamps, IP addresses, internal SurveyMonkey columns, etc.)
- **External ID** — the per-respondent unique key. Used for dedup if you re-import the same file.
- **Role** — the respondent's job role. Raw value is stored as `respondent_role`.
- **Email** — used to try matching against existing `assessment_members.email`. Optional.
- **Question** — pick the matching `question_bank` row from the dropdown, set the question type. For multi-select, optionally set a delimiter (default `;`).

Hit **Import**. The page reports `loaded / skipped / errors`. Skipped responses are duplicates (same `(questionnaire_id, external_id)`) — safe to re-run.

### 4 · Read the report

`/readiness/baselines/<assessment-id>` shows:

- **Population card** — total responses, questions answered, role breakdown
- **Findings sections** — grouped by `question_bank.category`. Likert questions show n / mean / agree+%. Multi-choice show distribution tables (% of all respondents, not just answerers). Single-choice same. Top-5 Likert items get a role-segmented sub-table (cohorts with n ≥ 8).
- **Free-text section** — sample quotes from each free-text question (first 5)
- **Import history** — every batch with timestamp, source, loaded/skipped/error counts

### 5 · Where the assessment shows up

- `/readiness` list — imported assessments are tagged "imported" and the row link routes directly to `/readiness/baselines/<id>` instead of the wizard's Company step.
- `/readiness/baselines` list — only assessments that have at least one `survey_imports` row, sorted by most-recent import.
- Sidebar — "Survey Baselines" entry under **1 · Assess**, visible whenever the `readiness` tool entitlement is enabled for the current tenant.

### Idempotency & re-imports

- The same external_id within the same questionnaire is blocked at the DB level (`uq_responses_questionnaire_external` partial unique index).
- Each import run creates a new `survey_imports` row regardless — gives you a clean audit trail of who ran what when.
- To completely re-import a file, delete the `questionnaire_responses` rows for that questionnaire first (`response_answers` cascade automatically).

---

## What's stored where

### Tables (migration `0030`)

```
readiness_assessments (existing — shell)
  └─ assessment_questionnaires (existing — instance per assessment)
       ├─ questionnaire_questions (existing — pinned question snapshot)
       └─ questionnaire_responses (now: member_id NULLABLE)
            ├─ respondent_role           ← captured even when anonymous
            ├─ respondent_email          ← optional, for fuzzy member match
            ├─ source                    ← native | surveymonkey | csv_import | manual
            ├─ external_id               ← from source system (e.g. SurveyMonkey respondent id)
            ├─ import_batch_id           ← FK to survey_imports
            └─ response_answers (existing — now richer)
                 ├─ score                ← Likert 1–5 (existing)
                 ├─ text_value           ← NEW: free_text answers
                 ├─ choice_values JSONB  ← NEW: single/multi-choice
                 └─ numeric_value        ← NEW: numeric answers

survey_imports (NEW — batch tracking)
  id, site_id, assessment_id, source, file_name,
  total_rows, loaded_rows, skipped_rows, error_rows,
  status, error_log (JSONB), created_by, created_at, completed_at

question_bank (existing — extended)
  ├─ question_type   ← NEW: likert | single_choice | multi_choice | numeric | free_text
  └─ options JSONB   ← NEW: [{value, label}] for choice questions
```

### Code map

| File | Role |
|---|---|
| `migrations/versions/20260519_000030_add_question_types_and_external_sources.py` | Schema migration |
| `packages/platform-core/src/types/ai-tools.ts` | `QuestionType`, `QuestionOption`, `ResponseSource`, `SurveyImport` types |
| `packages/platform-core/src/utils/survey-parse.ts` | Pure helpers — Likert/skill mappers, `matchOption`, `buildAnswerFields`, all aggregation math |
| `packages/platform-core/src/queries/admin/survey-import.ts` | Batch lifecycle + external-questionnaire scaffolding + per-row response/answer insertion |
| `packages/platform-core/src/queries/admin/baseline-report.ts` | Aggregation queries; delegates math to `survey-parse.ts` |
| `packages/platform-core/src/queries/admin/question-bank.ts` | Question CRUD (now passes through `question_type` + `options`) |
| `packages/ai-tools/src/app/readiness/import/page.tsx` | Upload + column-mapping UI (parses xlsx client-side via `xlsx`) |
| `packages/ai-tools/src/app/api/survey-import/run/route.ts` | API: receives `{assessmentId, source, fileName, columnMap, rows}`, calls the loader chain |
| `packages/ai-tools/src/app/readiness/baselines/page.tsx` | List of imported assessments |
| `packages/ai-tools/src/app/readiness/baselines/[id]/page.tsx` | Per-assessment report |
| `packages/ai-tools/src/components/AdminSidebar.tsx` | "Survey Baselines" nav entry |
| `scripts/load-dcfs-baseline-survey.ts` | End-to-end loader: parses xlsx + ResponseQuality, seeds questions, imports 122 responses |

### Pure helpers (testable, no I/O)

In `packages/platform-core/src/utils/survey-parse.ts`:

- `likertScore(v)` / `skillScore(v)` — text→numeric (1–5)
- `squash(s)` / `matchOption(raw, options)` — robust option-label matching
- `buildAnswerFields(questionType, cell, options?, delimiter?)` — dispatches cell value to the right `response_answers` field
- `aggregateLikert(answers)` → `{n, mean, agree_plus_pct, strongly_agree_pct}`
- `aggregateNumeric(answers)` → `{n, mean}`
- `aggregateByRole(answers, responseRoles, valueField, minCohortSize)` — role-segmented mean with cohort-size filter
- `aggregateMultiChoice(answers, totalRespondents, options)` — distribution rows, denominator = total respondents

---

## Extending for a new survey

1. **Decide on the question set.** Either reuse existing `question_bank` entries or create new ones (with the right `question_type` and `options`).
2. **Create the assessment** (`/readiness/new`).
3. **Import via UI** — for one-off surveys. For repeatable imports or surveys with many columns, write a script following the DCFS pattern:
   - Open xlsx with `exceljs` (SheetJS 0.18.5 has an inflate bug with some SurveyMonkey exports — see memory `xlsx-exceljs-fallback`)
   - Use `createImportBatch` + `ensureExternalQuestionnaire` + manual response/answer insertion
   - Call `updateImportBatchStatus` at the end
4. **Verify.** Spot-check 3–5 aggregate numbers from your source-of-truth report against `/readiness/baselines/<id>`. Discrepancies almost always mean column-order mismatch or denominator confusion.

### Adding a new question type

If you need a type beyond the five current ones (e.g. ranking, matrix), the work is:
1. Extend the `QuestionType` union in `types/ai-tools.ts`
2. Add a case to `buildAnswerFields` dispatch
3. If aggregation differs, add a helper in `survey-parse.ts` + a `aggregate*` test
4. Update the report page to render the new type
5. Update the import UI's type dropdown

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Array buffer allocation failed` parsing xlsx | SheetJS 0.18.5 inflate bug | Switch to `exceljs` (already installed at repo root) |
| Likert numbers off but other types match | Survey column order differs from seed order | Map columns to questions by header text, not by index — see DCFS loader's explicit `DEVEX_RANGE.questions` array |
| Multi-choice %s too high (e.g. 66% vs expected 57%) | Denominator = answerers, not total respondents | Already fixed in `aggregateMultiChoice` (uses `totalRespondents`). Pass `responseRoles.size` from the query layer. |
| Two options with shared first word cross-match (e.g. "Code review" → code_generation) | First-word substring matcher was too loose | Already fixed: `matchOption` uses squash-then-exact-then-strong-contains. Don't reintroduce first-word fallback. |
| Re-import shows `skipped` instead of loading | `(questionnaire_id, external_id)` already exists | Delete prior `questionnaire_responses` rows for that questionnaire, or use a fresh `external_id` column |
| Imported assessment opens in the native wizard | Assessment has no `survey_imports` rows yet | Either run an import first, or the assessment was never meant to be external — leave it in the wizard flow |

---

## Verification reference: DCFS / ILC AI Pilot Baseline (May 2026)

After importing the 122 valid responses, these aggregates should match the published `baseline-report-v20260518.md`:

| Item | Expected | Source |
|---|---|---|
| Total valid responses | 122 (134 total − 12 poor-quality) | ResponseQuality.xlsx |
| Willing to invest time learning AI tools | mean 4.35, agree+ 95% | Finding 1 |
| AI augments my role | mean 3.82, agree+ 73% | Finding 1 |
| Confidence in work quality (DevEx high) | mean 4.26 | DevEx |
| Periods of deep, uninterrupted focus (DevEx low) | mean 3.65 | DevEx |
| Using ChatGPT / GPT-4 | 57% (70/122) | Finding 4 |
| Using Microsoft 365 Copilot | 51% (63/122) | Finding 4 |
| Using GitHub Copilot | 12% (15/122) | Finding 4 |

If any deviates by more than ±1 pt / ±0.05 mean, investigate column mapping or denominator before declaring done.
