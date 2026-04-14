import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  UseCaseRecord,
  UseCaseQuadrant,
  InvestmentTier,
  CreateUseCaseInput,
} from "../../types/readiness-deliverables.js";
import {
  computeQuadrant,
  computeInvestmentTier,
} from "../../types/readiness-deliverables.js";

export async function listUseCases(
  assessmentId: string,
  siteId?: string
): Promise<UseCaseRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("use_cases")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("sort_order");

  if (error || !data) return [];
  return data as UseCaseRecord[];
}

export async function createUseCase(
  assessmentId: string,
  input: CreateUseCaseInput,
  siteId?: string
): Promise<UseCaseRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const quadrant =
    input.impact_score != null && input.effort_score != null
      ? computeQuadrant(input.impact_score, input.effort_score)
      : null;

  const { data, error } = await supabase
    .from("use_cases")
    .insert({
      assessment_id: assessmentId,
      site_id: site,
      title: input.title,
      description: input.description ?? null,
      pillar: input.pillar ?? null,
      affected_roles: input.affected_roles ?? [],
      impact_score: input.impact_score ?? null,
      effort_score: input.effort_score ?? null,
      quadrant,
      timeline_months: input.timeline_months ?? null,
      required_tools: input.required_tools ?? null,
      prerequisites: input.prerequisites ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as UseCaseRecord;
}

export async function updateUseCase(
  id: string,
  input: Partial<CreateUseCaseInput>,
  siteId?: string
): Promise<UseCaseRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  // Fetch current record to merge scores for quadrant recomputation
  const { data: current } = await supabase
    .from("use_cases")
    .select("impact_score, effort_score")
    .eq("site_id", site)
    .eq("id", id)
    .single();

  const impact = input.impact_score ?? current?.impact_score;
  const effort = input.effort_score ?? current?.effort_score;

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.pillar !== undefined) updateData.pillar = input.pillar;
  if (input.affected_roles !== undefined) updateData.affected_roles = input.affected_roles;
  if (input.impact_score !== undefined) updateData.impact_score = input.impact_score;
  if (input.effort_score !== undefined) updateData.effort_score = input.effort_score;
  if (input.timeline_months !== undefined) updateData.timeline_months = input.timeline_months;
  if (input.required_tools !== undefined) updateData.required_tools = input.required_tools;
  if (input.prerequisites !== undefined) updateData.prerequisites = input.prerequisites;

  // Recompute quadrant
  if (impact != null && effort != null) {
    updateData.quadrant = computeQuadrant(impact, effort);
  }

  const { data, error } = await supabase
    .from("use_cases")
    .update(updateData)
    .eq("site_id", site)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) return null;
  return data as UseCaseRecord;
}

export async function deleteUseCase(
  id: string,
  siteId?: string
): Promise<void> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  await supabase
    .from("use_cases")
    .delete()
    .eq("site_id", site)
    .eq("id", id);
}

export async function getUseCasesByQuadrant(
  assessmentId: string,
  siteId?: string
): Promise<Record<UseCaseQuadrant, UseCaseRecord[]>> {
  const all = await listUseCases(assessmentId, siteId);

  const grouped: Record<UseCaseQuadrant, UseCaseRecord[]> = {
    quick_win: [],
    strategic_bet: [],
    fill_in: [],
    avoid: [],
  };

  for (const uc of all) {
    const q = uc.quadrant ?? "avoid";
    grouped[q].push(uc);
  }

  return grouped;
}

export async function getUseCasesByTier(
  assessmentId: string,
  siteId?: string
): Promise<Record<InvestmentTier, UseCaseRecord[]>> {
  const all = await listUseCases(assessmentId, siteId);

  const grouped: Record<InvestmentTier, UseCaseRecord[]> = {
    tier1: [],
    tier2: [],
    tier3: [],
    tier4: [],
  };

  for (const uc of all) {
    const tier = uc.timeline_months != null
      ? computeInvestmentTier(uc.timeline_months)
      : "tier4";
    grouped[tier].push(uc);
  }

  return grouped;
}
