import { getServiceClient } from "@/lib/supabase/server";

export interface Job {
  title: string;
  slug: string;
  location: string;
  type: string;
  description: string;
  posted_at: string;
  closed_at: string | null;
}

export async function getActiveJobs(): Promise<Job[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("positions")
    .select("title, slug, location, type, description, posted_at, closed_at")
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("positions")
    .select("title, slug, location, type, description, posted_at, closed_at")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) return null;
  return data;
}
