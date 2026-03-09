import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import type {
  AdminArticle,
  CreateArticleInput,
  UpdateArticleInput,
  ArticleFilters,
} from "../../types/admin.js";

const ARTICLE_COLUMNS =
  "id, site_id, slug, title, excerpt, body, content_type, author, featured_image_url, tags, case_study_data, status, published_at, meta_title, meta_description, meta_keywords, created_by, created_at, updated_at";

export async function getAllArticles(
  filters: ArticleFilters = {}
): Promise<AdminArticle[]> {
  const supabase = getServiceClient();
  let query = supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("site_id", getSiteId())
    .order("created_at", { ascending: false });

  if (filters.content_type) {
    query = query.eq("content_type", filters.content_type);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getArticleById(
  id: string
): Promise<AdminArticle | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function createArticle(
  input: CreateArticleInput,
  staffUserId?: string
): Promise<{ success: boolean; article?: AdminArticle; error?: string }> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("articles")
    .insert({
      site_id: getSiteId(),
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt || null,
      body: input.body,
      content_type: input.content_type,
      author: input.author || null,
      featured_image_url: input.featured_image_url || null,
      tags: input.tags || [],
      case_study_data: input.case_study_data || null,
      status: input.status || "draft",
      published_at: input.published_at || null,
      meta_title: input.meta_title || null,
      meta_description: input.meta_description || null,
      meta_keywords: input.meta_keywords || null,
      created_by: staffUserId || null,
    })
    .select(ARTICLE_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, article: data };
}

export async function updateArticle(
  id: string,
  input: UpdateArticleInput
): Promise<{ success: boolean; article?: AdminArticle; error?: string }> {
  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
  if (input.body !== undefined) updateData.body = input.body;
  if (input.content_type !== undefined) updateData.content_type = input.content_type;
  if (input.author !== undefined) updateData.author = input.author;
  if (input.featured_image_url !== undefined) updateData.featured_image_url = input.featured_image_url;
  if (input.tags !== undefined) updateData.tags = input.tags;
  if (input.case_study_data !== undefined) updateData.case_study_data = input.case_study_data;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.published_at !== undefined) updateData.published_at = input.published_at;
  if (input.meta_title !== undefined) updateData.meta_title = input.meta_title;
  if (input.meta_description !== undefined) updateData.meta_description = input.meta_description;
  if (input.meta_keywords !== undefined) updateData.meta_keywords = input.meta_keywords;

  const { data, error } = await supabase
    .from("articles")
    .update(updateData)
    .eq("site_id", getSiteId())
    .eq("id", id)
    .select(ARTICLE_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, article: data };
}
