import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AssessmentEnhancementStatusRecord,
  EnhancementStatus,
  EnhancementCoverageStats,
} from "../../types/readiness-deliverables.js";

export async function getEnhancementStatuses(
  assessmentId: string,
  siteId?: string
): Promise<AssessmentEnhancementStatusRecord[]> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const { data, error } = await supabase
    .from("assessment_enhancement_statuses")
    .select("*")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId);

  if (error || !data) return [];
  return data as AssessmentEnhancementStatusRecord[];
}

export async function setEnhancementStatus(
  assessmentId: string,
  catalogItemId: string,
  status: EnhancementStatus,
  opts?: {
    tool_used?: string;
    blocking_constraint_id?: string;
    notes?: string;
    catalog_version?: number;
  },
  siteId?: string
): Promise<AssessmentEnhancementStatusRecord | null> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  const row: Record<string, unknown> = {
    assessment_id: assessmentId,
    site_id: site,
    catalog_item_id: catalogItemId,
    status,
    updated_at: new Date().toISOString(),
  };

  if (opts?.tool_used !== undefined) row.tool_used = opts.tool_used;
  if (opts?.blocking_constraint_id !== undefined) row.blocking_constraint_id = opts.blocking_constraint_id;
  if (opts?.notes !== undefined) row.notes = opts.notes;
  if (opts?.catalog_version !== undefined) row.catalog_version = opts.catalog_version;

  const { data, error } = await supabase
    .from("assessment_enhancement_statuses")
    .upsert(row, { onConflict: "assessment_id,site_id,catalog_item_id" })
    .select("*")
    .single();

  if (error || !data) return null;
  return data as AssessmentEnhancementStatusRecord;
}

export async function computeCoverageStats(
  assessmentId: string,
  inScopePillars: string[],
  siteId?: string
): Promise<EnhancementCoverageStats> {
  const supabase = getServiceClient();
  const site = siteId ?? getSiteId();

  // Get all active catalog items for in-scope pillars
  const { data: catalogItems } = await supabase
    .from("ai_enhancement_catalog")
    .select("id, pillar")
    .eq("status", "active")
    .in("pillar", inScopePillars.length > 0 ? inScopePillars : ["__none__"]);

  const items = catalogItems ?? [];

  // Get all statuses for this assessment
  const { data: statuses } = await supabase
    .from("assessment_enhancement_statuses")
    .select("catalog_item_id, status")
    .eq("site_id", site)
    .eq("assessment_id", assessmentId);

  const statusMap = new Map<string, EnhancementStatus>();
  for (const s of statuses ?? []) {
    statusMap.set(s.catalog_item_id, s.status as EnhancementStatus);
  }

  const byStatus: Record<EnhancementStatus, number> = {
    in_use: 0,
    opportunity: 0,
    blocked: 0,
    not_applicable: 0,
    not_evaluated: 0,
  };

  const byPillar: Record<string, { total: number; evaluated: number; coverage_pct: number }> = {};

  for (const pillar of inScopePillars) {
    byPillar[pillar] = { total: 0, evaluated: 0, coverage_pct: 0 };
  }

  let totalEvaluated = 0;

  for (const item of items) {
    const status = statusMap.get(item.id) ?? "not_evaluated";
    byStatus[status]++;

    const pillar = item.pillar as string;
    if (byPillar[pillar]) {
      byPillar[pillar].total++;
      if (status !== "not_evaluated") {
        byPillar[pillar].evaluated++;
        totalEvaluated++;
      }
    }
  }

  // Compute coverage percentages
  for (const pillar of Object.keys(byPillar)) {
    const p = byPillar[pillar];
    p.coverage_pct = p.total > 0 ? Math.round((p.evaluated / p.total) * 100) : 0;
  }

  const total = items.length;
  const coveragePct = total > 0 ? Math.round((totalEvaluated / total) * 100) : 0;

  return {
    total,
    evaluated: totalEvaluated,
    coverage_pct: coveragePct,
    by_status: byStatus,
    by_pillar: byPillar,
  };
}
