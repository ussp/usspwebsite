import { getServiceClient } from "../../supabase/server.js";
import type {
  AIEnhancementCatalogItem,
  CatalogVersionRecord,
} from "../../types/readiness-deliverables.js";

export async function listCatalogItems(
  pillar?: string,
  status?: string
): Promise<AIEnhancementCatalogItem[]> {
  const supabase = getServiceClient();

  let query = supabase
    .from("ai_enhancement_catalog")
    .select("*")
    .order("pillar")
    .order("name");

  if (pillar) {
    query = query.eq("pillar", pillar);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as AIEnhancementCatalogItem[];
}

export async function listCatalogVersions(): Promise<CatalogVersionRecord[]> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("catalog_versions")
    .select("*")
    .order("version_number", { ascending: false });

  if (error || !data) return [];
  return data as CatalogVersionRecord[];
}

export async function getLatestCatalogVersion(): Promise<CatalogVersionRecord | null> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("catalog_versions")
    .select("*")
    .order("version_number", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as CatalogVersionRecord;
}

export async function getCatalogItemsByPillars(
  pillars: string[]
): Promise<AIEnhancementCatalogItem[]> {
  if (pillars.length === 0) return [];

  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("ai_enhancement_catalog")
    .select("*")
    .eq("status", "active")
    .in("pillar", pillars)
    .order("pillar")
    .order("name");

  if (error || !data) return [];
  return data as AIEnhancementCatalogItem[];
}
