import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  QuestionType,
  ResponseSource,
  SurveyImport,
  SurveyImportStatus,
  AssessmentQuestionnaire,
} from "../../types/ai-tools.js";

// Column mapping declared by the import UI. Each parsed row is a flat dict
// keyed by column name from the source file.
export interface SurveyColumnMap {
  external_id_col?: string;
  role_col?: string;
  email_col?: string;
  role_value_map?: Record<string, string>; // raw survey value → TeamMemberRole
  questions: SurveyQuestionMapping[];
}

export interface SurveyQuestionMapping {
  column: string;
  question_id: string;
  question_type: QuestionType;
  // For single/multi-choice: map raw cell value(s) to option `value` codes.
  // For multi_choice: assume the cell is a delimited string (e.g. "ChatGPT;Copilot").
  value_delimiter?: string;
  value_map?: Record<string, string>;
}

export type ParsedRow = Record<string, string | number | null | undefined>;

export interface ImportSummary {
  loaded: number;
  skipped: number;
  errors: Array<{ row: number; message: string }>;
}

// ── Import batches ────────────────────────────────────────────────────

export async function createImportBatch(
  assessmentId: string,
  source: ResponseSource,
  fileName: string | null,
  createdBy: string,
  siteId?: string
): Promise<SurveyImport> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("survey_imports")
    .insert({
      site_id: site,
      assessment_id: assessmentId,
      source,
      file_name: fileName,
      status: "pending",
      created_by: createdBy,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateImportBatchStatus(
  batchId: string,
  status: SurveyImportStatus,
  patch: Partial<Pick<SurveyImport, "total_rows" | "loaded_rows" | "skipped_rows" | "error_rows" | "error_log">> = {}
): Promise<void> {
  const supabase = getServiceClient();
  const update: Record<string, unknown> = { status, ...patch };
  if (status === "completed" || status === "failed") {
    update.completed_at = new Date().toISOString();
  }
  const { error } = await supabase
    .from("survey_imports")
    .update(update)
    .eq("id", batchId);
  if (error) throw new Error(error.message);
}

export async function getImportBatch(batchId: string): Promise<SurveyImport | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("survey_imports")
    .select("*")
    .eq("id", batchId)
    .single();
  if (error) return null;
  return data;
}

export async function listImportBatches(
  assessmentId: string,
  siteId?: string
): Promise<SurveyImport[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("survey_imports")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

// ── External questionnaire scaffolding ────────────────────────────────

/**
 * Ensures an `assessment_questionnaires` row exists for the assessment and
 * links the supplied question_ids via `questionnaire_questions`. Returns
 * the questionnaire id. Status is set to 'closed' for external imports —
 * the survey is already complete by the time data lands here.
 */
export async function ensureExternalQuestionnaire(
  assessmentId: string,
  questionIds: string[],
  siteId?: string
): Promise<AssessmentQuestionnaire> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data: existing } = await supabase
    .from("assessment_questionnaires")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("site_id", site)
    .maybeSingle();

  let questionnaire: AssessmentQuestionnaire;
  if (existing) {
    questionnaire = existing;
  } else {
    const { data: created, error } = await supabase
      .from("assessment_questionnaires")
      .insert({
        assessment_id: assessmentId,
        site_id: site,
        status: "closed",
        customized: true,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    questionnaire = created;
  }

  // Link any questions not already in questionnaire_questions
  const { data: existingLinks } = await supabase
    .from("questionnaire_questions")
    .select("question_id")
    .eq("questionnaire_id", questionnaire.id);
  const linkedIds = new Set((existingLinks || []).map((r) => r.question_id));

  const toLink = questionIds.filter((id) => !linkedIds.has(id));
  if (toLink.length) {
    // Pull current versions for the snapshot
    const { data: qRows } = await supabase
      .from("question_bank")
      .select("id, version")
      .in("id", toLink);
    const versionMap = new Map((qRows || []).map((q) => [q.id, q.version]));
    const links = toLink.map((qid, idx) => ({
      questionnaire_id: questionnaire.id,
      question_id: qid,
      question_version: versionMap.get(qid) ?? 1,
      sort_order: idx,
      is_required: false,
      target_roles: [],
    }));
    const { error: linkErr } = await supabase
      .from("questionnaire_questions")
      .insert(links);
    if (linkErr) throw new Error(linkErr.message);
  }

  return questionnaire;
}

// ── Row → response/answers loader ─────────────────────────────────────

interface MemberLookup {
  byEmail: Map<string, string>; // email lowercase → member_id
}

async function loadMemberLookup(
  assessmentId: string,
  siteId: string
): Promise<MemberLookup> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("assessment_members")
    .select("id, email, team_id, assessment_teams!inner(assessment_id)")
    .eq("site_id", siteId)
    .eq("assessment_teams.assessment_id", assessmentId);
  const byEmail = new Map<string, string>();
  for (const m of (data || []) as Array<{ id: string; email: string }>) {
    if (m.email) byEmail.set(m.email.toLowerCase(), m.id);
  }
  return { byEmail };
}

/**
 * Loads parsed rows into questionnaire_responses + response_answers.
 * Idempotent on (questionnaire_id, external_id) via the partial unique index.
 */
export async function importResponses(
  batchId: string,
  assessmentId: string,
  questionnaireId: string,
  parsedRows: ParsedRow[],
  columnMap: SurveyColumnMap,
  source: ResponseSource,
  siteId?: string
): Promise<ImportSummary> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const memberLookup = await loadMemberLookup(assessmentId, site);

  const summary: ImportSummary = { loaded: 0, skipped: 0, errors: [] };

  for (let i = 0; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    try {
      // Build response record
      const externalId = columnMap.external_id_col
        ? String(row[columnMap.external_id_col] ?? "").trim() || null
        : null;
      const emailRaw = columnMap.email_col
        ? String(row[columnMap.email_col] ?? "").trim() || null
        : null;
      const email = emailRaw ? emailRaw.toLowerCase() : null;

      const rawRole = columnMap.role_col
        ? String(row[columnMap.role_col] ?? "").trim()
        : "";
      const mappedRole = rawRole
        ? columnMap.role_value_map?.[rawRole] ?? rawRole
        : null;

      const memberId = email ? memberLookup.byEmail.get(email) ?? null : null;

      // Insert questionnaire_responses; rely on unique index for idempotency.
      const { data: response, error: respErr } = await supabase
        .from("questionnaire_responses")
        .insert({
          questionnaire_id: questionnaireId,
          member_id: memberId,
          source,
          external_id: externalId,
          import_batch_id: batchId,
          respondent_role: mappedRole,
          respondent_email: email,
          status: "completed",
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (respErr) {
        // Duplicate via partial unique index → count as skipped.
        if (respErr.code === "23505") {
          summary.skipped++;
          continue;
        }
        throw new Error(respErr.message);
      }

      // Insert response_answers per mapped question column.
      const answerRows: Record<string, unknown>[] = [];
      const nowIso = new Date().toISOString();
      for (const qmap of columnMap.questions) {
        const cell = row[qmap.column];
        if (cell === undefined || cell === null || cell === "") continue;
        answerRows.push(
          buildAnswerRow(response.id, qmap, cell, nowIso)
        );
      }
      if (answerRows.length) {
        const { error: ansErr } = await supabase
          .from("response_answers")
          .insert(answerRows);
        if (ansErr) throw new Error(ansErr.message);
      }

      summary.loaded++;
    } catch (err) {
      summary.errors.push({
        row: i,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return summary;
}

function buildAnswerRow(
  responseId: string,
  qmap: SurveyQuestionMapping,
  cell: string | number,
  answeredAt: string
): Record<string, unknown> {
  const base = {
    response_id: responseId,
    question_id: qmap.question_id,
    answered_at: answeredAt,
  };

  switch (qmap.question_type) {
    case "likert":
    case "numeric": {
      const num = typeof cell === "number" ? cell : Number(cell);
      if (Number.isNaN(num)) return { ...base };
      return qmap.question_type === "likert"
        ? { ...base, score: Math.round(num) }
        : { ...base, numeric_value: num };
    }
    case "single_choice": {
      const raw = String(cell).trim();
      const value = qmap.value_map?.[raw] ?? raw;
      return { ...base, choice_values: [value] };
    }
    case "multi_choice": {
      const raw = String(cell);
      const delim = qmap.value_delimiter ?? ";";
      const parts = raw
        .split(delim)
        .map((p) => p.trim())
        .filter(Boolean);
      const mapped = parts.map((p) => qmap.value_map?.[p] ?? p);
      return { ...base, choice_values: mapped };
    }
    case "free_text":
    default:
      return { ...base, text_value: String(cell) };
  }
}
