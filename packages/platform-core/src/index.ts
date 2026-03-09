// Config
export { getSiteId, getSiteConfig } from "./config.js";

// Supabase clients
export { getServiceClient } from "./supabase/server.js";
export { getBrowserClient } from "./supabase/client.js";

// Queries
export { getActiveJobs, getJobBySlug } from "./queries/jobs.js";
export { getPublishedArticles, getArticleBySlug, getArticleSlugs } from "./queries/articles.js";
export { createOrUpdateApplication, updateJobAlerts } from "./queries/applications.js";
export { submitContactForm } from "./queries/contact.js";
export { trackEvent } from "./queries/analytics.js";

// Auth
export { createAuth } from "./auth/config.js";
export { createAdminAuth } from "./auth/admin-config.js";
export { hasPermission, requirePermission } from "./auth/rbac.js";

// API handlers
export { handleApplicationPost } from "./api/applications.js";
export { handleUploadPost } from "./api/upload.js";
export { handleContactPost } from "./api/contact.js";

// Types
export type { Job, Application, ContactSubmission, AnalyticsEvent, Article, CaseStudyData } from "./types/database.js";
export type { SiteConfig, SiteRecord } from "./types/site.js";
export type { CreateApplicationInput } from "./queries/applications.js";
export type { ContactFormInput } from "./queries/contact.js";
export type { TrackEventInput } from "./queries/analytics.js";
export type { CreateAuthOptions } from "./auth/config.js";
export type { CreateAdminAuthOptions } from "./auth/admin-config.js";
export type {
  StaffUser,
  StaffRole,
  ApplicationStatus,
  ApplicationNote,
  AuditLogEntry,
  DashboardMetrics,
  AdminPosition,
  AdminApplication,
  AdminArticle,
  ArticleContentType,
  ArticleStatus,
  CreateArticleInput,
  UpdateArticleInput,
  ArticleFilters,
} from "./types/admin.js";
