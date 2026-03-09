import { getServiceClient } from "../supabase/server.js";
import { getSiteId } from "../config.js";
import type { Job } from "../types/database.js";

export type { Job };

const JOB_COLUMNS = "title, slug, location, type, description, posted_at, closed_at, site_id";

export async function getActiveJobs(): Promise<Job[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("positions")
    .select(JOB_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("positions")
    .select(JOB_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) return null;
  return data;
}
