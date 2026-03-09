import { getServiceClient } from "../supabase/server.js";
import { getSiteId } from "../config.js";
import type { Article } from "../types/database.js";

export type { Article };

const ARTICLE_COLUMNS =
  "title, slug, excerpt, body, content_type, author, featured_image_url, tags, case_study_data, status, published_at, meta_title, meta_description, meta_keywords, site_id";

export async function getPublishedArticles(
  contentType?: "case_study" | "blog_post"
): Promise<Article[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (contentType) {
    query = query.eq("content_type", contentType);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data;
}

export async function getArticleSlugs(): Promise<
  { slug: string; updated_at: string | null }[]
> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("site_id", getSiteId())
    .eq("status", "published");

  if (error || !data) return [];
  return data;
}
