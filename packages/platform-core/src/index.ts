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
export { handleApplication } from "./api/applications.js";
export { handleUpload } from "./api/upload.js";
export { handleContact } from "./api/contact.js";
export type { ApiResponse } from "./api/upload.js";

// Types
export type { Job, Application, ContactSubmission, AnalyticsEvent, Article, CaseStudyData, Client, ClientContact, EndClient } from "./types/database.js";
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
  AdminClient,
  AdminClientContact,
  AdminEndClient,
  CreateClientInput,
  UpdateClientInput,
  CreateClientContactInput,
  UpdateClientContactInput,
  ClientFilters,
  CreateEndClientInput,
  UpdateEndClientInput,
  EndClientFilters,
  CandidatePii,
  UpsertCandidatePiiInput,
  VisaType,
  StatusHistoryEntry,
  PositionStats,
  PositionListItem,
  DocumentRequest,
  DocumentRequestType,
  DocumentRequestStatus,
  CandidateReferenceRecord,
  CreateDocumentRequestInput,
  SubmitDocumentRequestInput,
  CreateCandidateReferenceInput,
  DOCUMENT_REQUEST_TYPE_LABELS,
  DOCUMENT_REQUEST_STATUS_LABELS,
} from "./types/admin.js";

// AI Transformation Monitoring Tool types
export type {
  EngagementStatus,
  IntegrationType,
  TeamMemberRole,
  AssessmentType,
  AssessmentStatus,
  DataSource,
  MetricCategory,
  TrainingPlanStatus,
  MetricDirection,
  MetricDefinition,
  AIEngagement,
  AITeam,
  AITeamMember,
  AIAssessment,
  AIMetric,
  AITrainingPlan,
  ActivitySummary,
  RecommendedTool,
  RecommendedTraining,
  CreateEngagementInput,
  UpdateEngagementInput,
  CreateTeamInput,
  UpdateTeamInput,
  CreateTeamMemberInput,
  CreateAssessmentInput,
  UpdateAssessmentInput,
  CreateMetricInput,
  CreateTrainingPlanInput,
  UpdateTrainingPlanInput,
  MetricDelta,
  CategorySummary,
  BenchmarkComparison,
  TransformationReport,
  AIToolsDashboardMetrics,
  EngagementDetail,
  SprintData,
  SprintIssue,
  IntegrationSyncResult,
  TrainingModule,
  ReadinessTier,
  ReadinessCapability,
  ReadinessAssessmentResult,
  AmplifierAnalysis,
  TensionAnalysis,
} from "./types/ai-tools.js";
export {
  ENGAGEMENT_STATUS_LABELS,
  ENGAGEMENT_STATUS_COLORS,
  TEAM_MEMBER_ROLE_LABELS,
  ASSESSMENT_STATUS_LABELS,
  TRAINING_PLAN_STATUS_LABELS,
  METRIC_CATALOG,
  RESEARCH_BENCHMARKS,
  TRAINING_CATALOG,
  READINESS_TIER_THRESHOLDS,
  READINESS_TIER_LABELS,
  READINESS_TIER_COLORS,
  getMetricDefinition,
} from "./types/ai-tools.js";

// AI Laws & Regulations
export type { AILaw } from "./types/ai-laws.js";
export { AI_LAW_CATALOG, getLawsByState, getAvailableStates, getFederalLaws } from "./types/ai-laws.js";
