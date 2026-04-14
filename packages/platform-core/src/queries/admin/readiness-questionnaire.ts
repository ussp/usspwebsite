import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AssessmentQuestionnaire,
  QuestionnaireQuestion,
  QuestionnaireResponse,
  QuestionBankItem,
} from "../../types/ai-tools.js";
import { selectQuestionsForProfile } from "./question-bank.js";
import { getAssessmentCompany } from "./readiness-company.js";
import { getAssessmentTeam, listAssessmentMembers } from "./readiness-team.js";
import { createDevelopmentRequest } from "./question-development.js";

export async function getQuestionnaire(assessmentId: string, siteId?: string): Promise<AssessmentQuestionnaire | null> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();
  const { data, error } = await supabase
    .from("assessment_questionnaires")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("site_id", site)
    .single();
  if (error) return null;
  return data;
}

export async function getQuestionnaireQuestions(questionnaireId: string): Promise<(QuestionnaireQuestion & { question: QuestionBankItem })[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("questionnaire_questions")
    .select("*, question:question_bank(*)")
    .eq("questionnaire_id", questionnaireId)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Generate a questionnaire for an assessment based on company/team/member profiles.
 * Selects questions from the bank, pins versions, and creates development requests for unmapped roles.
 */
export async function generateQuestionnaire(
  assessmentId: string,
  siteId?: string
): Promise<AssessmentQuestionnaire> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  // Gather profile data
  const company = await getAssessmentCompany(assessmentId, site);
  if (!company) throw new Error("Company profile required before generating questionnaire");

  const team = await getAssessmentTeam(assessmentId, site);
  if (!team) throw new Error("Team profile required before generating questionnaire");

  const members = await listAssessmentMembers(team.id, site);
  if (!members.length) throw new Error("At least one team member required");

  // Collect all unique roles
  const allRoles = [...new Set(members.map((m) => m.role))];
  const customRoleMembers = members.filter((m) => m.role === "other" && m.custom_role_label);

  // Create development requests for unmapped custom roles
  for (const member of customRoleMembers) {
    // Check if questions exist for this custom role label
    const { data: matching } = await supabase
      .from("question_bank")
      .select("id")
      .eq("status", "active")
      .contains("roles", [member.custom_role_label!])
      .limit(1);

    if (!matching?.length) {
      await createDevelopmentRequest(member.custom_role_label!, assessmentId, site);
    }
  }

  // Select questions matching profile
  const selectedQuestions = await selectQuestionsForProfile(company.entity_type, allRoles, site);

  // Delete existing questionnaire if regenerating
  const existing = await getQuestionnaire(assessmentId, site);
  if (existing) {
    await supabase.from("questionnaire_questions").delete().eq("questionnaire_id", existing.id);
    await supabase.from("assessment_questionnaires").delete().eq("id", existing.id);
  }

  // Create questionnaire
  const { data: questionnaire, error: qError } = await supabase
    .from("assessment_questionnaires")
    .insert({
      assessment_id: assessmentId,
      site_id: site,
      status: "draft",
      generated_at: new Date().toISOString(),
      customized: false,
    })
    .select()
    .single();
  if (qError) throw new Error(qError.message);

  // Insert questions with version pinning and role targeting
  const questionRows = selectedQuestions.map((q, i) => ({
    questionnaire_id: questionnaire.id,
    question_id: q.id,
    question_version: q.version,
    sort_order: i + 1,
    is_required: true,
    target_roles: q.roles, // empty = universal
  }));

  if (questionRows.length) {
    const { error: insertError } = await supabase
      .from("questionnaire_questions")
      .insert(questionRows);
    if (insertError) throw new Error(insertError.message);
  }

  return questionnaire;
}

export async function updateQuestionnaireStatus(
  questionnaireId: string,
  status: string
): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("assessment_questionnaires")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", questionnaireId);
  if (error) throw new Error(error.message);
}

export async function removeQuestionFromQuestionnaire(
  questionnaireQuestionId: string
): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("questionnaire_questions")
    .delete()
    .eq("id", questionnaireQuestionId);
  if (error) throw new Error(error.message);
}

export async function reorderQuestionnaireQuestions(
  questionnaireId: string,
  orderedIds: string[]
): Promise<void> {
  const supabase = getServiceClient();
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from("questionnaire_questions")
      .update({ sort_order: i + 1 })
      .eq("id", orderedIds[i])
      .eq("questionnaire_id", questionnaireId);
  }
}

// --- Response management ---

export async function createResponsesForMembers(
  questionnaireId: string,
  members: { id: string }[]
): Promise<QuestionnaireResponse[]> {
  const supabase = getServiceClient();
  const rows = members.map((m) => ({
    questionnaire_id: questionnaireId,
    member_id: m.id,
    status: "not_started",
  }));

  const { data, error } = await supabase
    .from("questionnaire_responses")
    .insert(rows)
    .select();
  if (error) throw new Error(error.message);
  return data || [];
}

export async function listResponses(questionnaireId: string): Promise<QuestionnaireResponse[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("questionnaire_responses")
    .select("*")
    .eq("questionnaire_id", questionnaireId);
  if (error) throw new Error(error.message);
  return data || [];
}
