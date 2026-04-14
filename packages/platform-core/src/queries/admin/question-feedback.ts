import { getServiceClient } from "../../supabase/server.js";
import type { QuestionFeedbackStats } from "../../types/ai-tools.js";

const NEEDS_REVIEW_THRESHOLD = 0.25; // 25%
const MIN_RESPONSES_FOR_REVIEW = 10;

export async function getQuestionFeedbackStats(questionId: string): Promise<QuestionFeedbackStats | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("question_feedback_stats")
    .select("*")
    .eq("question_id", questionId)
    .single();
  if (error) return null;
  return data;
}

export async function listFlaggedQuestions(): Promise<QuestionFeedbackStats[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("question_feedback_stats")
    .select("*")
    .eq("needs_review", true)
    .order("unclear_count", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Recompute feedback stats for a question from response_answers data.
 */
export async function recomputeFeedbackStats(questionId: string): Promise<QuestionFeedbackStats> {
  const supabase = getServiceClient();

  // Get all answers for this question
  const { data: answers, error: answersError } = await supabase
    .from("response_answers")
    .select("score, flag")
    .eq("question_id", questionId);

  if (answersError) throw new Error(answersError.message);

  const allAnswers = answers || [];
  const timesAsked = allAnswers.length;
  const scored = allAnswers.filter((a) => a.score != null);
  const avgScore = scored.length > 0
    ? scored.reduce((sum, a) => sum + a.score!, 0) / scored.length
    : null;
  const unclearCount = allAnswers.filter((a) => a.flag === "unclear").length;
  const notApplicableCount = allAnswers.filter((a) => a.flag === "not_applicable").length;

  const flagRate = timesAsked > 0 ? (unclearCount + notApplicableCount) / timesAsked : 0;
  const needsReview = timesAsked >= MIN_RESPONSES_FOR_REVIEW && flagRate > NEEDS_REVIEW_THRESHOLD;

  const stats = {
    question_id: questionId,
    times_asked: timesAsked,
    avg_score: avgScore ? Math.round(avgScore * 100) / 100 : null,
    unclear_count: unclearCount,
    not_applicable_count: notApplicableCount,
    needs_review: needsReview,
    last_computed_at: new Date().toISOString(),
  };

  // Upsert
  const { data: existing } = await supabase
    .from("question_feedback_stats")
    .select("id")
    .eq("question_id", questionId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("question_feedback_stats")
      .update(stats)
      .eq("question_id", questionId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from("question_feedback_stats")
      .insert(stats)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}
