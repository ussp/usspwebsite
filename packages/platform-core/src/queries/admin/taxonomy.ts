import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";

// ── Types ─────────────────────────────────���────────────────────────

export interface TaxonomyNodeRow {
  id: string;
  site_id: string;
  tree: string;
  node_id: string;
  path: string;
  label: string;
  parent_path: string | null;
  aliases: string[];
  related_paths: string[];
  description: string | null;
  source: string;
  usage_count: number;
  promoted: boolean;
  promoted_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface UnresolvedSkillRow {
  id: string;
  site_id: string;
  raw_text: string;
  source: string;
  source_id: string | null;
  occurrence_count: number;
  resolved: boolean;
  resolved_node_path: string | null;
  first_seen_at: string;
  last_seen_at: string;
}

export interface CreateTaxonomyNodeInput {
  tree: string;
  node_id: string;
  path: string;
  label: string;
  parent_path?: string;
  aliases?: string[];
  related_paths?: string[];
  description?: string;
  created_by?: string;
}

// ── Custom Taxonomy Nodes ───────────────���──────────────────────────

const NODE_COLUMNS =
  "id, site_id, tree, node_id, path, label, parent_path, aliases, related_paths, description, source, usage_count, promoted, promoted_at, created_by, created_at, updated_at";

export async function getCustomTaxonomyNodes(
  tree?: string,
): Promise<TaxonomyNodeRow[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("taxonomy_nodes")
    .select(NODE_COLUMNS)
    .eq("site_id", getSiteId())
    .order("tree")
    .order("path");

  if (tree) {
    query = query.eq("tree", tree);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as TaxonomyNodeRow[];
}

export async function getCustomTaxonomyNode(
  id: string,
): Promise<TaxonomyNodeRow | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("taxonomy_nodes")
    .select(NODE_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as TaxonomyNodeRow;
}

export async function createTaxonomyNode(
  input: CreateTaxonomyNodeInput,
): Promise<{ success: boolean; node?: TaxonomyNodeRow; error?: string }> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("taxonomy_nodes")
    .insert({
      site_id: getSiteId(),
      tree: input.tree,
      node_id: input.node_id,
      path: input.path,
      label: input.label,
      parent_path: input.parent_path || null,
      aliases: input.aliases || [],
      related_paths: input.related_paths || [],
      description: input.description || null,
      source: "recruiter",
      created_by: input.created_by || null,
    })
    .select(NODE_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, node: data as TaxonomyNodeRow };
}

export async function updateTaxonomyNode(
  id: string,
  updates: {
    label?: string;
    aliases?: string[];
    related_paths?: string[];
    description?: string;
    parent_path?: string;
  },
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("taxonomy_nodes")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteTaxonomyNode(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("taxonomy_nodes")
    .delete()
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function incrementNodeUsage(
  path: string,
): Promise<void> {
  const supabase = getServiceClient();
  // Increment usage count
  const { data: existing } = await supabase
    .from("taxonomy_nodes")
    .select("id, usage_count")
    .eq("site_id", getSiteId())
    .eq("path", path)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("taxonomy_nodes")
      .update({
        usage_count: (existing.usage_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  }
}

// ── Unresolved Skills ──────────────────────────────────────────────

export async function getUnresolvedSkills(
  resolvedFilter?: boolean,
): Promise<UnresolvedSkillRow[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("unresolved_skills")
    .select("*")
    .eq("site_id", getSiteId())
    .order("occurrence_count", { ascending: false });

  if (resolvedFilter !== undefined) {
    query = query.eq("resolved", resolvedFilter);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as UnresolvedSkillRow[];
}

export async function upsertUnresolvedSkill(
  rawText: string,
  source: string,
  sourceId?: string,
): Promise<void> {
  const supabase = getServiceClient();
  const siteId = getSiteId();

  // Try to increment existing
  const { data: existing } = await supabase
    .from("unresolved_skills")
    .select("id, occurrence_count")
    .eq("site_id", siteId)
    .eq("raw_text", rawText)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("unresolved_skills")
      .update({
        occurrence_count: (existing.occurrence_count || 0) + 1,
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("unresolved_skills")
      .insert({
        site_id: siteId,
        raw_text: rawText,
        source,
        source_id: sourceId || null,
      });
  }
}

export async function resolveUnresolvedSkill(
  id: string,
  nodePath: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("unresolved_skills")
    .update({
      resolved: true,
      resolved_node_path: nodePath,
      last_seen_at: new Date().toISOString(),
    })
    .eq("site_id", getSiteId())
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Taxonomy tree summary (for UI) ─────────────────────────────────

export async function getTaxonomySummary(): Promise<{
  trees: { tree: string; nodeCount: number }[];
  totalCustom: number;
  totalUnresolved: number;
}> {
  const supabase = getServiceClient();
  const siteId = getSiteId();

  const { data: nodes } = await supabase
    .from("taxonomy_nodes")
    .select("tree")
    .eq("site_id", siteId);

  const { count: unresolvedCount } = await supabase
    .from("unresolved_skills")
    .select("*", { count: "exact", head: true })
    .eq("site_id", siteId)
    .eq("resolved", false);

  // Group by tree
  const treeCounts = new Map<string, number>();
  for (const n of nodes || []) {
    treeCounts.set(n.tree, (treeCounts.get(n.tree) || 0) + 1);
  }

  return {
    trees: [...treeCounts].map(([tree, nodeCount]) => ({ tree, nodeCount })),
    totalCustom: nodes?.length || 0,
    totalUnresolved: unresolvedCount || 0,
  };
}
