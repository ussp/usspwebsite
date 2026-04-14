import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type { QuestionBankItem, CreateQuestionInput } from "../../types/ai-tools.js";

interface QuestionFilters {
  category?: string;
  capability?: string;
  status?: string;
  roles?: string[];
  entity_types?: string[];
}

export async function listQuestions(
  filters: QuestionFilters = {},
  siteId?: string
): Promise<QuestionBankItem[]> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  let query = supabase
    .from("question_bank")
    .select("*")
    .or(`site_id.is.null,site_id.eq.${site}`)
    .order("sort_order");

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.capability) query = query.eq("capability", filters.capability);
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let results = data || [];

  // Client-side filter for roles/entity_types (JSONB array containment)
  if (filters.roles?.length) {
    results = results.filter((q) => {
      const qRoles = q.roles as string[];
      if (!qRoles.length) return true; // universal question
      return qRoles.some((r: string) => filters.roles!.includes(r));
    });
  }
  if (filters.entity_types?.length) {
    results = results.filter((q) => {
      const qTypes = q.entity_types as string[];
      if (!qTypes.length) return true; // applies to all
      return qTypes.some((t: string) => filters.entity_types!.includes(t));
    });
  }

  return results;
}

export async function getQuestion(id: string): Promise<QuestionBankItem | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("question_bank")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getQuestionVersionHistory(questionId: string): Promise<QuestionBankItem[]> {
  const supabase = getServiceClient();

  // Find the root question (follow parent chain)
  let rootId = questionId;
  let current = await getQuestion(questionId);
  while (current?.parent_question_id) {
    rootId = current.parent_question_id;
    current = await getQuestion(rootId);
  }

  // Get all versions: the root + all descendants
  const { data, error } = await supabase
    .from("question_bank")
    .select("*")
    .or(`id.eq.${rootId},parent_question_id.eq.${rootId}`)
    .order("version");

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createQuestion(
  input: CreateQuestionInput,
  createdBy: string,
  siteId?: string
): Promise<QuestionBankItem> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const { data, error } = await supabase
    .from("question_bank")
    .insert({
      site_id: site,
      category: input.category,
      capability: input.capability || null,
      question_text: input.question_text,
      description: input.description || null,
      entity_types: input.entity_types || [],
      roles: input.roles || [],
      is_default: false,
      sort_order: input.sort_order || 0,
      version: 1,
      status: "active",
      parent_question_id: null,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Creates a new version of an existing question. The old version is deprecated.
 */
export async function reviseQuestion(
  questionId: string,
  newText: string,
  newDescription: string | undefined,
  revisedBy: string,
  siteId?: string
): Promise<QuestionBankItem> {
  const supabase = getServiceClient();
  const site = siteId || getSiteId();

  const existing = await getQuestion(questionId);
  if (!existing) throw new Error("Question not found");

  // Find root parent for the version chain
  const rootId = existing.parent_question_id || existing.id;

  // Deprecate old version
  await supabase
    .from("question_bank")
    .update({ status: "deprecated", updated_at: new Date().toISOString() })
    .eq("id", questionId);

  // Create new version
  const { data, error } = await supabase
    .from("question_bank")
    .insert({
      site_id: site || existing.site_id,
      category: existing.category,
      capability: existing.capability,
      question_text: newText,
      description: newDescription ?? existing.description,
      entity_types: existing.entity_types,
      roles: existing.roles,
      is_default: existing.is_default,
      sort_order: existing.sort_order,
      version: existing.version + 1,
      status: "active",
      parent_question_id: rootId,
      created_by: revisedBy,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateQuestionStatus(
  questionId: string,
  status: "draft" | "active" | "deprecated"
): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("question_bank")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", questionId);
  if (error) throw new Error(error.message);
}

/**
 * Select questions for a questionnaire based on company/team/member profile.
 * Returns active questions matching the entity type and member roles.
 */
export async function selectQuestionsForProfile(
  entityType: string,
  roles: string[],
  siteId?: string
): Promise<QuestionBankItem[]> {
  const allActive = await listQuestions({ status: "active" }, siteId);

  return allActive.filter((q) => {
    // Entity type filter
    const qTypes = q.entity_types as string[];
    if (qTypes.length && !qTypes.includes(entityType)) return false;

    // Role filter: universal questions (empty roles) go to everyone
    const qRoles = q.roles as string[];
    if (qRoles.length === 0) return true;

    // Role-specific: include if any target role matches
    return qRoles.some((r) => roles.includes(r));
  });
}
