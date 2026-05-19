/**
 * Loads the DCFS / ILC AI Pilot Baseline Survey end-to-end:
 *   1. Creates the readiness_assessment shell (if missing)
 *   2. Seeds the question_bank with 31 questions (if missing)
 *   3. Parses ILC AI Survey.xlsx + ResponseQuality.xlsx
 *   4. Filters out SurveyMonkey-flagged poor-quality rows
 *   5. Creates an import batch + ensures the external questionnaire
 *   6. Inserts questionnaire_responses + response_answers for each valid respondent
 *
 * Usage:
 *   npx tsx --env-file .env.local scripts/load-dcfs-baseline-survey.ts
 *
 * Re-runnable: questions dedupe on text, responses dedupe on (questionnaire_id, external_id).
 */

import ExcelJS from "exceljs";
import { resolve } from "path";
import { getServiceClient } from "@ussp-platform/core/supabase/server";
import type { CreateQuestionInput, QuestionOption } from "@ussp-platform/core/types/ai-tools";
import {
  createQuestion,
  listQuestions,
} from "@ussp-platform/core/queries/admin/question-bank";
import {
  createImportBatch,
  ensureExternalQuestionnaire,
  updateImportBatchStatus,
} from "@ussp-platform/core/queries/admin/survey-import";

const ASSESSMENT_NAME = "DCFS / ILC AI Pilot Baseline (May 2026)";
const SITE_ID = process.env.SITE_ID || "dcfs";
const CREATED_BY = process.env.SEED_CREATED_BY || "loader@krasanconsulting.com";
const SURVEY_XLSX = resolve(
  "clients/dcfs-ilc/planning/deliverables/baseline-survey/raw/Excel/ILC AI Survey.xlsx"
);
const QUALITY_XLSX = resolve(
  "clients/dcfs-ilc/planning/deliverables/baseline-survey/raw/Excel/ResponseQuality.xlsx"
);

// ── Likert and skill text → numeric maps ─────────────────────────────

const LIKERT5: Record<string, number> = {
  "strongly disagree": 1,
  disagree: 2,
  neutral: 3,
  agree: 4,
  "strongly agree": 5,
};
const SKILL5: Record<string, number> = {
  "no experience": 1,
  "aware but not practiced": 2,
  "can do with guidance": 3,
  "comfortable independently": 4,
  "could teach others": 5,
};

function norm(v: unknown): string {
  if (v == null) return "";
  return String(v).trim().toLowerCase();
}

function likert(v: unknown): number | null {
  return LIKERT5[norm(v)] ?? null;
}

function skill(v: unknown): number | null {
  const n = norm(v);
  if (!n || n.startsWith("not applicable")) return null;
  return SKILL5[n] ?? null;
}

// ── Question seed definitions ────────────────────────────────────────

const ATTITUDE_QS: CreateQuestionInput[] = [
  {
    category: "attitude",
    capability: "ai_value_belief",
    question_text: "AI tools can meaningfully improve my work quality",
    question_type: "likert",
  },
  {
    category: "attitude",
    capability: "ai_augmentation_stance",
    question_text: "AI tools will augment my role, not replace it",
    question_type: "likert",
  },
  {
    category: "attitude",
    capability: "learning_willingness",
    question_text: "I am willing to invest time learning AI tools",
    question_type: "likert",
  },
  {
    category: "attitude",
    capability: "structured_adoption",
    question_text: "Structured AI adoption is better than ad-hoc",
    question_type: "likert",
  },
];

const AI_SKILL_QS: CreateQuestionInput[] = [
  ["prompt_writing", "Writing effective prompts for AI tools"],
  ["output_review", "Identifying wrong / incomplete AI suggestions"],
  ["user_story_ai", "AI for user-story writing / requirements"],
  ["acceptance_criteria_ai", "AI for acceptance-criteria / requirements docs"],
  ["code_review_ai", "Reviewing AI-generated code for correctness / security"],
  ["test_case_ai", "AI for test-case generation"],
  ["test_strategy_ai", "AI for test strategy / coverage / test-data generation"],
  ["sdlc_integration_ai", "Integrating AI output into existing SDLC workflows"],
  ["d365_ai", "AI for D365 / Power Platform development"],
].map(([cap, text]) => ({
  category: "ai_skill",
  capability: cap,
  question_text: text,
  question_type: "likert" as const,
}));

const GOVERNANCE_QS: CreateQuestionInput[] = [
  {
    category: "governance",
    capability: "data_boundary_clarity",
    question_text:
      "I am confident I know what data I can and cannot enter into an AI prompt on this program",
    question_type: "likert",
  },
  {
    category: "governance",
    capability: "incident_response_clarity",
    question_text:
      "I know what to do if I accidentally enter PII or case data into an AI prompt",
    question_type: "likert",
  },
  {
    category: "governance",
    capability: "policy_awareness",
    question_text: "I understand the DoIT AI Policy requirements that apply to my role",
    question_type: "likert",
  },
];

const DEVEX_QS: CreateQuestionInput[] = [
  ["work_quality_confidence", "Confidence in work quality"],
  ["meaningful_output", "Meaningful sprint output"],
  ["team_communication", "Team communication effectiveness"],
  ["tools_satisfaction", "Job satisfaction with current tools / processes"],
  ["timely_feedback", "Timely feedback on completed work"],
  ["focus_without_switching", "Focus without context-switching"],
  ["tool_intuitiveness", "Tool / process intuitiveness"],
  ["deep_focus_time", "Periods of deep, uninterrupted focus"],
].map(([cap, text]) => ({
  category: "devex",
  capability: cap,
  question_text: text,
  question_type: "likert" as const,
}));

const TOOL_USAGE_OPTIONS: QuestionOption[] = [
  { value: "chatgpt", label: "ChatGPT / GPT-4" },
  { value: "ms_copilot", label: "Microsoft 365 Copilot" },
  { value: "google_gemini", label: "Google Gemini" },
  { value: "claude", label: "Claude (Anthropic)" },
  { value: "atlassian_rovo", label: "Atlassian Rovo / Atlassian Intelligence" },
  { value: "github_copilot", label: "GitHub Copilot" },
  { value: "d365_copilot", label: "Dynamics 365 Copilot" },
  { value: "other", label: "Other" },
];

const SDLC_OPTIONS: QuestionOption[] = [
  { value: "documentation", label: "Documentation" },
  { value: "code_generation", label: "Code writing / generation" },
  { value: "user_stories", label: "User stories / requirements" },
  { value: "test_creation", label: "Test case creation" },
  { value: "bug_triage", label: "Bug triage / defect analysis" },
  { value: "code_review", label: "Code review / PR analysis" },
  { value: "sprint_planning", label: "Sprint planning / estimation" },
];

const CONSTRAINT_OPTIONS: QuestionOption[] = [
  { value: "data_privacy", label: "Data privacy / compliance concerns (CANTS, CCWIS, PII, FERPA)" },
  { value: "no_access", label: "No access / not yet provisioned" },
  { value: "no_training", label: "No training on how to use it" },
  { value: "havent_tried", label: "Haven't tried yet" },
  { value: "quality_concerns", label: "Output quality / accuracy concerns" },
  { value: "not_authorized", label: "Manager / organization hasn't authorized use" },
  { value: "workflow_misfit", label: "Tool doesn't fit my workflow" },
  { value: "sprint_pressure", label: "Faster to do it the old way under sprint pressure" },
];

const OUTCOME_OPTIONS: QuestionOption[] = [
  { value: "significantly_improved", label: "Significantly improved productivity" },
  { value: "somewhat_improved", label: "Somewhat improved productivity" },
  { value: "neutral", label: "Neutral" },
  { value: "slower", label: "Made things slower or more complicated" },
  { value: "not_applicable", label: "Not applicable" },
];

const TRAINING_OPTIONS: QuestionOption[] = [
  { value: "comprehensive", label: "Yes, comprehensive (multi-day / certification)" },
  { value: "introductory", label: "Yes, introductory (workshop / webinar)" },
  { value: "self_taught", label: "Self-taught only" },
  { value: "none", label: "No training" },
];

const MULTI_AND_SINGLE_QS: CreateQuestionInput[] = [
  {
    category: "tool_usage",
    capability: "ai_tools_used",
    question_text: "Which AI tools have you used in the last sprint?",
    question_type: "multi_choice",
    options: TOOL_USAGE_OPTIONS,
  },
  {
    category: "tool_usage",
    capability: "sdlc_application",
    question_text: "Which SDLC processes have you applied AI to?",
    question_type: "multi_choice",
    options: SDLC_OPTIONS,
  },
  {
    category: "constraints",
    capability: "ai_use_blockers",
    question_text: "What prevented or limited your AI tool use in the last sprint?",
    question_type: "multi_choice",
    options: CONSTRAINT_OPTIONS,
  },
  {
    category: "outcome",
    capability: "self_reported_outcome",
    question_text: "What outcome have AI tools had on your work to date?",
    question_type: "single_choice",
    options: OUTCOME_OPTIONS,
  },
  {
    category: "ai_skill",
    capability: "training_received",
    question_text: "What AI training have you received?",
    question_type: "single_choice",
    options: TRAINING_OPTIONS,
  },
];

const FREE_TEXT_QS: CreateQuestionInput[] = [
  {
    category: "free_text",
    capability: "concerns",
    question_text: "What's your biggest concern about AI tool adoption on this program?",
    question_type: "free_text",
    anonymous_aggregate: true,
  },
  {
    category: "free_text",
    capability: "improvement_area",
    question_text: "Where do you think AI could most improve your team's work?",
    question_type: "free_text",
    anonymous_aggregate: true,
  },
];

const ALL_QUESTIONS: CreateQuestionInput[] = [
  ...ATTITUDE_QS,
  ...AI_SKILL_QS,
  ...GOVERNANCE_QS,
  ...DEVEX_QS,
  ...MULTI_AND_SINGLE_QS,
  ...FREE_TEXT_QS,
];

// ── Column maps (from _analyze.py — SurveyMonkey export structure) ───
// Within each Likert range the order matches the seeded question order.

// Column → seeded question_text. Order MUST match the xlsx layout.
// Verified against ILC AI Survey.xlsx header row by `_inspect-xlsx.ts`.
const ATTITUDE_RANGE = { start: 48, end: 52, questions: ATTITUDE_QS };
const SKILL_RANGE = { start: 34, end: 43, questions: AI_SKILL_QS };
const DEVEX_RANGE = {
  start: 68,
  end: 76,
  // Survey column order (68→75) — different from seed order
  questions: [
    DEVEX_QS[3], // 68: Job satisfaction with current tools / processes
    DEVEX_QS[0], // 69: Confidence in work quality
    DEVEX_QS[1], // 70: Meaningful sprint output
    DEVEX_QS[2], // 71: Team communication effectiveness
    DEVEX_QS[5], // 72: Focus without context-switching
    DEVEX_QS[7], // 73: Periods of deep, uninterrupted focus
    DEVEX_QS[4], // 74: Timely feedback on completed work
    DEVEX_QS[6], // 75: Tool / process intuitiveness
  ],
};
const GOVERNANCE_RANGE = { start: 76, end: 79, questions: GOVERNANCE_QS };
const TOOLS_USED_RANGE = { start: 14, end: 24 };
const SDLC_RANGE = { start: 24, end: 32 };
const CONSTRAINTS_RANGE = { start: 58, end: 68 };
const OUTCOME_COL = 32;
const TRAINING_COL = 33;
const FREE_TEXT_CONCERNS_COL = 52;
const FREE_TEXT_IMPROVE_COL = 53;
const ROLE_COL = 10;
const ROLE_OTHER_COL = 11;
const RESPONDENT_ID_COL = 0;

// Multi-choice raw cell text → option value mappers
function squash(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function matchOption(raw: string, options: QuestionOption[]): string | null {
  const n = squash(raw);
  if (!n) return null;
  // Exact-match the squashed form first
  for (const o of options) {
    if (squash(o.label) === n) return o.value;
  }
  // Strong contains-match (rare exports add prefix/suffix)
  for (const o of options) {
    const sq = squash(o.label);
    if (sq.length > 5 && (n.includes(sq) || sq.includes(n))) return o.value;
  }
  // Otherwise store raw slugified (won't collide with mapped values)
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

// ── Main ─────────────────────────────────────────────────────────────

interface QuestionLookup {
  byText: Map<string, string>;
}

async function ensureAssessmentAndQuestions(): Promise<{ assessmentId: string; lookup: QuestionLookup }> {
  const supabase = getServiceClient();

  // 1. Assessment
  const { data: existing } = await supabase
    .from("readiness_assessments")
    .select("*")
    .eq("site_id", SITE_ID)
    .eq("name", ASSESSMENT_NAME)
    .maybeSingle();

  let assessmentId: string;
  if (existing) {
    assessmentId = existing.id;
    console.log(`Using existing assessment ${assessmentId}`);
  } else {
    const { data: created, error } = await supabase
      .from("readiness_assessments")
      .insert({
        site_id: SITE_ID,
        name: ASSESSMENT_NAME,
        status: "completed",
        created_by: CREATED_BY,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    assessmentId = created.id;
    console.log(`Created assessment ${assessmentId}`);
  }

  // 2. Questions
  const existingForSite = await listQuestions({ status: "active" }, SITE_ID);
  const existingTexts = new Map(existingForSite.map((q) => [q.question_text, q.id]));

  let created = 0;
  for (const q of ALL_QUESTIONS) {
    if (existingTexts.has(q.question_text)) continue;
    const inserted = await createQuestion(q, CREATED_BY, SITE_ID);
    existingTexts.set(inserted.question_text, inserted.id);
    created++;
  }
  console.log(`Questions: ${created} created, ${ALL_QUESTIONS.length - created} already present`);

  return { assessmentId, lookup: { byText: existingTexts } };
}

interface RowsResult {
  headers: string[];
  rows: unknown[][];
  poorQuality: Set<string>;
}

function cellToValue(cell: ExcelJS.Cell): unknown {
  const v = cell.value;
  if (v == null) return null;
  if (typeof v === "object" && "richText" in (v as object)) {
    return (v as { richText: { text: string }[] }).richText.map((r) => r.text).join("");
  }
  if (typeof v === "object" && "text" in (v as object)) {
    return (v as { text: string }).text;
  }
  if (typeof v === "object" && "result" in (v as object)) {
    return (v as { result: unknown }).result ?? null;
  }
  return v;
}

function worksheetToRows(ws: ExcelJS.Worksheet): unknown[][] {
  const out: unknown[][] = [];
  const maxCol = ws.columnCount;
  ws.eachRow({ includeEmpty: true }, (row) => {
    const rowVals: unknown[] = [];
    for (let c = 1; c <= maxCol; c++) {
      const cell = row.getCell(c);
      rowVals.push(cellToValue(cell));
    }
    out.push(rowVals);
  });
  return out;
}

async function readWorkbooks(): Promise<RowsResult> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(SURVEY_XLSX);
  const ws = wb.worksheets[0];
  const data = worksheetToRows(ws);

  const h1 = (data[0] || []) as unknown[];
  const h2 = (data[1] || []) as unknown[];
  const headers = h1.map((v, i) => {
    const a = v == null ? "" : String(v);
    const b = h2[i] == null ? "" : String(h2[i]);
    return [a, b].filter(Boolean).join(" — ");
  });
  const rows = data.slice(2);

  // Poor-quality lookup
  const qwb = new ExcelJS.Workbook();
  await qwb.xlsx.readFile(QUALITY_XLSX);
  const qws = qwb.worksheets[0];
  const qdata = worksheetToRows(qws);
  const qheaders = (qdata[0] || []).map((v) => (v == null ? "" : String(v)));
  const ridIdx = qheaders.findIndex((h) =>
    /respondent\s*id|response\s*id/i.test(h)
  );
  const flagIdx = qheaders.findIndex((h) => /poor\s*quality/i.test(h));

  const poorQuality = new Set<string>();
  if (ridIdx >= 0 && flagIdx >= 0) {
    for (let i = 1; i < qdata.length; i++) {
      const r = qdata[i];
      const rid = r[ridIdx];
      const flag = String(r[flagIdx] ?? "").trim().toLowerCase();
      if (flag === "true" && rid != null) poorQuality.add(String(rid));
    }
  }

  return { headers, rows, poorQuality };
}

interface AnswerInsert {
  question_id: string;
  score?: number | null;
  text_value?: string | null;
  choice_values?: string[];
  numeric_value?: number | null;
  answered_at: string;
}

function buildAnswersForRow(row: unknown[], lookup: QuestionLookup): AnswerInsert[] {
  const answers: AnswerInsert[] = [];
  const now = new Date().toISOString();

  // Likert-style ranges (one column per question, in seed order)
  function addLikertRange(range: typeof ATTITUDE_RANGE, useSkillScale = false) {
    for (let i = range.start, qi = 0; i < range.end && qi < range.questions.length; i++, qi++) {
      const v = row[i];
      if (v == null || String(v).trim() === "") continue;
      const score = useSkillScale ? skill(v) : likert(v);
      if (score == null) continue;
      const qid = lookup.byText.get(range.questions[qi].question_text);
      if (!qid) continue;
      answers.push({ question_id: qid, score, answered_at: now });
    }
  }

  addLikertRange(ATTITUDE_RANGE);
  addLikertRange(SKILL_RANGE, true);
  addLikertRange(DEVEX_RANGE);
  addLikertRange(GOVERNANCE_RANGE);

  // Multi-choice ranges
  function addMultiChoice(
    range: { start: number; end: number },
    questionText: string,
    options: QuestionOption[]
  ) {
    const qid = lookup.byText.get(questionText);
    if (!qid) return;
    const values: string[] = [];
    for (let i = range.start; i < range.end; i++) {
      const v = row[i];
      if (v == null) continue;
      const s = String(v).trim();
      if (!s) continue;
      const mapped = matchOption(s, options);
      if (mapped && !values.includes(mapped)) values.push(mapped);
    }
    if (values.length) {
      answers.push({ question_id: qid, choice_values: values, answered_at: now });
    }
  }

  addMultiChoice(TOOLS_USED_RANGE, MULTI_AND_SINGLE_QS[0].question_text, TOOL_USAGE_OPTIONS);
  addMultiChoice(SDLC_RANGE, MULTI_AND_SINGLE_QS[1].question_text, SDLC_OPTIONS);
  addMultiChoice(CONSTRAINTS_RANGE, MULTI_AND_SINGLE_QS[2].question_text, CONSTRAINT_OPTIONS);

  // Single-choice
  function addSingleChoice(col: number, questionText: string, options: QuestionOption[]) {
    const v = row[col];
    if (v == null) return;
    const s = String(v).trim();
    if (!s) return;
    const qid = lookup.byText.get(questionText);
    if (!qid) return;
    const mapped = matchOption(s, options);
    if (mapped) answers.push({ question_id: qid, choice_values: [mapped], answered_at: now });
  }

  addSingleChoice(OUTCOME_COL, MULTI_AND_SINGLE_QS[3].question_text, OUTCOME_OPTIONS);
  addSingleChoice(TRAINING_COL, MULTI_AND_SINGLE_QS[4].question_text, TRAINING_OPTIONS);

  // Free-text
  function addFreeText(col: number, questionText: string) {
    const v = row[col];
    if (v == null) return;
    const s = String(v).trim();
    if (!s || ["unsure", "n/a", "na", "none", "-", ".", "open-ended response"].includes(s.toLowerCase())) {
      return;
    }
    const qid = lookup.byText.get(questionText);
    if (!qid) return;
    answers.push({ question_id: qid, text_value: s, answered_at: now });
  }

  addFreeText(FREE_TEXT_CONCERNS_COL, FREE_TEXT_QS[0].question_text);
  addFreeText(FREE_TEXT_IMPROVE_COL, FREE_TEXT_QS[1].question_text);

  return answers;
}

async function loadResponses(assessmentId: string, lookup: QuestionLookup): Promise<void> {
  const supabase = getServiceClient();

  console.log(`\nReading ${SURVEY_XLSX} ...`);
  const { rows, poorQuality } = await readWorkbooks();
  console.log(`Total rows: ${rows.length}, flagged poor quality: ${poorQuality.size}`);

  const allQuestionIds = Array.from(lookup.byText.values());
  const batch = await createImportBatch(
    assessmentId,
    "surveymonkey",
    "ILC AI Survey.xlsx",
    CREATED_BY,
    SITE_ID
  );
  const questionnaire = await ensureExternalQuestionnaire(
    assessmentId,
    allQuestionIds,
    SITE_ID
  );

  let loaded = 0;
  let skipped = 0;
  const errors: Array<{ row: number; message: string }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rid = row[RESPONDENT_ID_COL];
    if (rid == null) continue;
    const externalId = String(rid);
    if (poorQuality.has(externalId)) {
      skipped++;
      continue;
    }

    try {
      const roleRaw = row[ROLE_COL];
      const roleOther = row[ROLE_OTHER_COL];
      let role: string | null = null;
      if (roleRaw != null && String(roleRaw).trim()) {
        const r = String(roleRaw).trim();
        role = r.toLowerCase().includes("other") && roleOther
          ? String(roleOther).trim()
          : r;
      }

      // Insert response
      const { data: response, error: respErr } = await supabase
        .from("questionnaire_responses")
        .insert({
          questionnaire_id: questionnaire.id,
          member_id: null,
          source: "surveymonkey",
          external_id: externalId,
          import_batch_id: batch.id,
          respondent_role: role,
          respondent_email: null,
          status: "completed",
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (respErr) {
        if (respErr.code === "23505") {
          skipped++;
          continue;
        }
        throw new Error(respErr.message);
      }

      const answers = buildAnswersForRow(row, lookup);
      if (answers.length) {
        const rows = answers.map((a) => ({
          response_id: response.id,
          question_id: a.question_id,
          score: a.score ?? null,
          text_value: a.text_value ?? null,
          choice_values: a.choice_values ?? [],
          numeric_value: a.numeric_value ?? null,
          answered_at: a.answered_at,
        }));
        const { error: ansErr } = await supabase.from("response_answers").insert(rows);
        if (ansErr) throw new Error(ansErr.message);
      }

      loaded++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push({ row: i, message: msg });
    }
  }

  await updateImportBatchStatus(batch.id, errors.length && loaded === 0 ? "failed" : "completed", {
    total_rows: rows.length,
    loaded_rows: loaded,
    skipped_rows: skipped,
    error_rows: errors.length,
    error_log: errors,
  });

  console.log(`\nImport summary:`);
  console.log(`  Loaded:  ${loaded}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors:  ${errors.length}`);
  if (errors.length) {
    console.log(`\nFirst 5 errors:`);
    for (const e of errors.slice(0, 5)) {
      console.log(`  row ${e.row}: ${e.message}`);
    }
  }
  console.log(`\nBatch ${batch.id} / questionnaire ${questionnaire.id}`);
  console.log(`View at /readiness/baselines/${assessmentId}`);
}

async function main() {
  const { assessmentId, lookup } = await ensureAssessmentAndQuestions();
  await loadResponses(assessmentId, lookup);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
