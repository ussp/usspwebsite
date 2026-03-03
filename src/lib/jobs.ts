import { getServiceClient } from "@/lib/supabase/server";

export interface Job {
  title: string;
  slug: string;
  location: string;
  type: string;
}

export async function getActiveJobs(): Promise<Job[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("positions")
    .select("title, slug, location, type")
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("positions")
    .select("title, slug, location, type")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) return null;
  return data;
}
