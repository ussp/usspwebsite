import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { QuestionBankItem, QuestionType } from "../../types/ai-tools.js";

// Aggregations for externally-imported baseline surveys. Distinct from
// readiness-report.ts which produces the readiness *tier* report.

export interface QuestionAggregate {
  question_id: string;
  question_text: string;
  question_type: QuestionType;
  capability: string | null;
  category: string;
  n: number;
  mean: number | null; // Likert/numeric only
  agree_plus_pct: number | null; // % scoring >= 4 on Likert
  strongly_agree_pct: number | null; // % scoring == 5 on Likert
}

export interface RoleAggregate {
  role: string;
  n: number;
  mean: number | null;
}

export interface ChoiceDistribution {
  value: string;
  label: string;
  count: number;
  pct: number;
}

export interface FreeTextSample {
  response_id: string;
  text: string;
  role: string | null;
}

interface RawAnswer {
  question_id: string;
  score: number | null;
  text_value: string | null;
  choice_values: string[] | null;
  numeric_value: number | null;
  response_id: string;
}

async function loadAnswersForAssessment(
  assessmentId: string,
  siteId: string
): Promise<{
  answers: RawAnswer[];
  responseRoles: Map<string, string | null>;
  questions: Map<string, QuestionBankItem>;
}> {
  const supabase = getServiceClient();

  // Get all questionnaires for the assessment
  const { data: questionnaires } = await supabase
    .from("assessment_questionnaires")
    .select("id")
    .eq("assessment_id", assessmentId)
    .eq("site_id", siteId);
  const qIds = (questionnaires || []).map((q) => q.id);
  if (!qIds.length) {
    return { answers: [], responseRoles: new Map(), questions: new Map() };
  }

  // Responses → role lookup
  const { data: responses } = await supabase
    .from("questionnaire_responses")
    .select("id, respondent_role, member_id, assessment_members(role)")
    .in("questionnaire_id", qIds);

  const responseRoles = new Map<string, string | null>();
  for (const r of (responses || []) as Array<{
    id: string;
    respondent_role: string | null;
    assessment_members: { role: string }[] | { role: string } | null;
  }>) {
    // Prefer explicit respondent_role (external imports), fall back to member.role
    const member = Array.isArray(r.assessment_members)
      ? r.assessment_members[0]
      : r.assessment_members;
    const role = r.respondent_role || member?.role || null;
    responseRoles.set(r.id, role);
  }

  const responseIds = Array.from(responseRoles.keys());
  if (!responseIds.length) {
    return { answers: [], responseRoles, questions: new Map() };
  }

  // Answers
  const { data: answers } = await supabase
    .from("response_answers")
    .select(
      "response_id, question_id, score, text_value, choice_values, numeric_value, flag"
    )
    .in("response_id", responseIds)
    .neq("flag", "not_applicable");

  // Questions metadata
  const questionIds = Array.from(
    new Set((answers || []).map((a) => a.question_id))
  );
  let questionsMap = new Map<string, QuestionBankItem>();
  if (questionIds.length) {
    const { data: qData } = await supabase
      .from("question_bank")
      .select("*")
      .in("id", questionIds);
    questionsMap = new Map((qData || []).map((q) => [q.id, q]));
  }

  return {
    answers: (answers || []) as RawAnswer[],
    responseRoles,
    questions: questionsMap,
  };
}

export async function getAssessmentAggregateByQuestion(
  assessmentId: string,
  siteId?: string
): Promise<QuestionAggregate[]> {
  const site = siteId || getSiteId();
  const { answers, questions } = await loadAnswersForAssessment(assessmentId, site);

  const byQ = new Map<string, RawAnswer[]>();
  for (const a of answers) {
    if (!byQ.has(a.question_id)) byQ.set(a.question_id, []);
    byQ.get(a.question_id)!.push(a);
  }

  const out: QuestionAggregate[] = [];
  for (const [qid, aList] of byQ.entries()) {
    const q = questions.get(qid);
    if (!q) continue;

    const isLikert = q.question_type === "likert";
    const isNumeric = q.question_type === "numeric";

    let mean: number | null = null;
    let agreePlus: number | null = null;
    let stronglyAgree: number | null = null;
    let n = aList.length;

    if (isLikert) {
      const scored = aList.filter((a) => a.score != null);
      n = scored.length;
      if (n > 0) {
        const sum = scored.reduce((s, a) => s + (a.score ?? 0), 0);
        mean = sum / n;
        agreePlus = (scored.filter((a) => (a.score ?? 0) >= 4).length / n) * 100;
        stronglyAgree = (scored.filter((a) => a.score === 5).length / n) * 100;
      }
    } else if (isNumeric) {
      const scored = aList.filter((a) => a.numeric_value != null);
      n = scored.length;
      if (n > 0) {
        const sum = scored.reduce((s, a) => s + (a.numeric_value ?? 0), 0);
        mean = sum / n;
      }
    }

    out.push({
      question_id: qid,
      question_text: q.question_text,
      question_type: q.question_type,
      capability: q.capability,
      category: q.category,
      n,
      mean,
      agree_plus_pct: agreePlus,
      strongly_agree_pct: stronglyAgree,
    });
  }

  return out.sort((a, b) => a.category.localeCompare(b.category) || a.question_text.localeCompare(b.question_text));
}

export async function getAssessmentAggregateByQuestionAndRole(
  assessmentId: string,
  questionId: string,
  minCohortSize = 8,
  siteId?: string
): Promise<RoleAggregate[]> {
  const site = siteId || getSiteId();
  const { answers, responseRoles, questions } = await loadAnswersForAssessment(
    assessmentId,
    site
  );

  const q = questions.get(questionId);
  if (!q) return [];

  const byRole = new Map<string, number[]>();
  for (const a of answers) {
    if (a.question_id !== questionId) continue;
    const role = responseRoles.get(a.response_id);
    if (!role) continue;

    let val: number | null = null;
    if (q.question_type === "likert") val = a.score;
    else if (q.question_type === "numeric") val = a.numeric_value;
    if (val == null) continue;

    if (!byRole.has(role)) byRole.set(role, []);
    byRole.get(role)!.push(val);
  }

  const out: RoleAggregate[] = [];
  for (const [role, vals] of byRole.entries()) {
    if (vals.length < minCohortSize) continue;
    const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
    out.push({ role, n: vals.length, mean });
  }
  return out.sort((a, b) => (b.mean ?? 0) - (a.mean ?? 0));
}

export async function getMultiChoiceDistribution(
  assessmentId: string,
  questionId: string,
  siteId?: string
): Promise<ChoiceDistribution[]> {
  const site = siteId || getSiteId();
  const { answers, questions } = await loadAnswersForAssessment(
    assessmentId,
    site
  );
  const q = questions.get(questionId);
  if (!q) return [];

  // n = number of unique responses (respondents who answered this question)
  const respondents = new Set<string>();
  const tally = new Map<string, number>();

  for (const a of answers) {
    if (a.question_id !== questionId) continue;
    respondents.add(a.response_id);
    for (const v of a.choice_values || []) {
      tally.set(v, (tally.get(v) ?? 0) + 1);
    }
  }

  const n = respondents.size || 1;
  const labelOf = new Map(
    (q.options || []).map((o) => [o.value, o.label])
  );

  return Array.from(tally.entries())
    .map(([value, count]) => ({
      value,
      label: labelOf.get(value) ?? value,
      count,
      pct: (count / n) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getFreeTextSamples(
  assessmentId: string,
  questionId: string,
  limit = 5,
  siteId?: string
): Promise<FreeTextSample[]> {
  const site = siteId || getSiteId();
  const { answers, responseRoles } = await loadAnswersForAssessment(
    assessmentId,
    site
  );

  const samples: FreeTextSample[] = [];
  for (const a of answers) {
    if (a.question_id !== questionId) continue;
    if (!a.text_value) continue;
    samples.push({
      response_id: a.response_id,
      text: a.text_value,
      role: responseRoles.get(a.response_id) ?? null,
    });
  }
  // Stable order: take first N rather than random
  return samples.slice(0, limit);
}

export interface BaselineSummary {
  total_responses: number;
  total_questions: number;
  role_breakdown: Array<{ role: string; n: number; pct: number }>;
}

export async function getBaselineSummary(
  assessmentId: string,
  siteId?: string
): Promise<BaselineSummary> {
  const site = siteId || getSiteId();
  const supabase = getServiceClient();

  const { data: questionnaires } = await supabase
    .from("assessment_questionnaires")
    .select("id")
    .eq("assessment_id", assessmentId)
    .eq("site_id", site);
  const qIds = (questionnaires || []).map((q) => q.id);

  if (!qIds.length) {
    return { total_responses: 0, total_questions: 0, role_breakdown: [] };
  }

  const { count: responseCount } = await supabase
    .from("questionnaire_responses")
    .select("id", { count: "exact", head: true })
    .in("questionnaire_id", qIds);

  const { count: questionCount } = await supabase
    .from("questionnaire_questions")
    .select("id", { count: "exact", head: true })
    .in("questionnaire_id", qIds);

  const { data: roleRows } = await supabase
    .from("questionnaire_responses")
    .select("respondent_role, member_id, assessment_members(role)")
    .in("questionnaire_id", qIds);

  const roleTally = new Map<string, number>();
  let total = 0;
  for (const r of (roleRows || []) as Array<{
    respondent_role: string | null;
    assessment_members: { role: string }[] | { role: string } | null;
  }>) {
    const member = Array.isArray(r.assessment_members)
      ? r.assessment_members[0]
      : r.assessment_members;
    const role = r.respondent_role || member?.role || "unknown";
    roleTally.set(role, (roleTally.get(role) ?? 0) + 1);
    total++;
  }

  const role_breakdown = Array.from(roleTally.entries())
    .map(([role, n]) => ({ role, n, pct: total ? (n / total) * 100 : 0 }))
    .sort((a, b) => b.n - a.n);

  return {
    total_responses: responseCount ?? 0,
    total_questions: questionCount ?? 0,
    role_breakdown,
  };
}
