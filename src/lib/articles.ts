// Re-export from shared platform package
// All queries are auto-filtered by SITE_ID env var
export { getPublishedArticles, getArticleBySlug, getArticleSlugs } from "@ussp-platform/core/queries/articles";
export type { Article } from "@ussp-platform/core/queries/articles";
