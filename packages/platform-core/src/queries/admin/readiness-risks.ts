import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  RiskRecord,
  CreateRiskInput,
} from "../../types/readiness-deliverables.js";
import {
  computeRiskScore,
  RISK_TEMPLATES,
} from "../../types/readiness-deliverables.js";

export async function listRisks(
  assessmentId: string,
  siteId?: string
): Promise<RiskRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("risks")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId)
    .order("risk_score", { ascending: false });

  if (error || !data) return [];
  return data as RiskRecord[];
}

export async function createRisk(
  assessmentId: string,
  input: CreateRiskInput,
  siteId?: string
): Promise<RiskRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const riskScore =
    input.likelihood != null && input.impact_score != null
      ? computeRiskScore(input.likelihood, input.impact_score)
      : null;

  const { data, error } = await supabase
    .from("risks")
    .insert({
      assessment_id: assessmentId,
      site_id: site,
      description: input.description,
      category: input.category,
      likelihood: input.likelihood ?? null,
      impact_score: input.impact_score ?? null,
      risk_score: riskScore,
      mitigation: input.mitigation ?? null,
      owner: input.owner ?? null,
      is_preseeded: false,
    })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as RiskRecord;
}

export async function updateRisk(
  id: string,
  input: Partial<CreateRiskInput>,
  siteId?: string
): Promise<RiskRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  // Fetch current record to merge for risk_score recomputation
  const { data: current } = await supabase
    .from("risks")
    .select("likelihood, impact_score")
    .eq("site_id", site)
    .eq("id", id)
    .single();

  const likelihood = input.likelihood ?? current?.likelihood;
  const impactScore = input.impact_score ?? current?.impact_score;

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (input.description !== undefined) updateData.description = input.description;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.likelihood !== undefined) updateData.likelihood = input.likelihood;
  if (input.impact_score !== undefined) updateData.impact_score = input.impact_score;
  if (input.mitigation !== undefined) updateData.mitigation = input.mitigation;
  if (input.owner !== undefined) updateData.owner = input.owner;

  // Recompute risk_score
  if (likelihood != null && impactScore != null) {
    updateData.risk_score = computeRiskScore(likelihood, impactScore);
  }

  const { data, error } = await supabase
    .from("risks")
    .update(updateData)
    .eq("site_id", site)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) return null;
  return data as RiskRecord;
}

export async function deleteRisk(
  id: string,
  siteId?: string
): Promise<void> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  await supabase
    .from("risks")
    .delete()
    .eq("site_id", site)
    .eq("id", id);
}

export async function seedRisksByEntityType(
  assessmentId: string,
  entityType: string,
  siteId?: string
): Promise<RiskRecord[]> {
  const templates = RISK_TEMPLATES[entityType];
  if (!templates || templates.length === 0) return [];

  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const rows = templates.map((t, i) => ({
    assessment_id: assessmentId,
    site_id: site,
    description: t.description,
    category: t.category,
    likelihood: t.likelihood,
    impact_score: t.impact,
    risk_score: computeRiskScore(t.likelihood, t.impact),
    mitigation: t.mitigation,
    is_preseeded: true,
    sort_order: i,
  }));

  const { data, error } = await supabase
    .from("risks")
    .insert(rows)
    .select("*");

  if (error || !data) return [];
  return data as RiskRecord[];
}
