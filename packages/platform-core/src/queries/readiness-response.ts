/**
 * Public (no admin auth) query module for questionnaire responses.
 * Used by the tokenized response page — respondents don't need an account.
 */
import { getServiceClient } from "../supabase/server.js";
import type {
  QuestionnaireResponse,
  ResponseAnswer,
  SubmitAnswerInput,
  QuestionnaireQuestion,
  QuestionBankItem,
} from "../types/ai-tools.js";

export async function getResponseByToken(token: string): Promise<QuestionnaireResponse | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("questionnaire_responses")
    .select("*")
    .eq("token", token)
    .single();
  if (error) return null;
  return data;
}

export async function getResponseMember(memberId: string) {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("assessment_members")
    .select("*")
    .eq("id", memberId)
    .single();
  if (error) return null;
  return data;
}

/**
 * Get questions for a response, filtered by the member's role.
 */
export async function getQuestionsForResponse(
  questionnaireId: string,
  memberRole: string
): Promise<(QuestionnaireQuestion & { question: QuestionBankItem })[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("questionnaire_questions")
    .select("*, question:question_bank(*)")
    .eq("questionnaire_id", questionnaireId)
    .order("sort_order");
  if (error) throw new Error(error.message);

  const allQuestions = data || [];

  // Filter: include if target_roles is empty (universal) or includes member's role
  return allQuestions.filter((qq) => {
    const roles = qq.target_roles as string[];
    return roles.length === 0 || roles.includes(memberRole);
  });
}

export async function getExistingAnswers(responseId: string): Promise<ResponseAnswer[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("response_answers")
    .select("*")
    .eq("response_id", responseId);
  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Save answers (partial or complete). Upserts by response_id + question_id.
 */
export async function saveAnswers(
  responseId: string,
  answers: SubmitAnswerInput[]
): Promise<void> {
  const supabase = getServiceClient();

  for (const answer of answers) {
    // Check if answer exists
    const { data: existing } = await supabase
      .from("response_answers")
      .select("id")
      .eq("response_id", responseId)
      .eq("question_id", answer.question_id)
      .single();

    const row = {
      score: answer.score ?? null,
      comment: answer.comment ?? null,
      flag: answer.flag ?? null,
      answered_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase
        .from("response_answers")
        .update(row)
        .eq("id", existing.id);
    } else {
      await supabase
        .from("response_answers")
        .insert({
          response_id: responseId,
          question_id: answer.question_id,
          ...row,
        });
    }
  }

  // Update response status
  const { data: allAnswers } = await supabase
    .from("response_answers")
    .select("id")
    .eq("response_id", responseId);

  const status = (allAnswers?.length || 0) > 0 ? "in_progress" : "not_started";
  await supabase
    .from("questionnaire_responses")
    .update({
      status,
      started_at: new Date().toISOString(),
    })
    .eq("id", responseId)
    .is("started_at", null); // only set started_at once
}

/**
 * Mark a response as completed.
 */
export async function completeResponse(responseId: string): Promise<void> {
  const supabase = getServiceClient();
  await supabase
    .from("questionnaire_responses")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", responseId);
}
