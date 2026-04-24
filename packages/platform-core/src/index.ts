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
  SalaryType,
  CandidateCertification,
  CertificationSource,
  CreateCertificationInput,
  UpdateCertificationInput,
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
  OnboardingStepKey,
  OnboardingStepStatus,
  CandidateOnboarding,
  PipelineGateResult,
  ONBOARDING_STEP_LABELS,
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
  ContactCategory,
  AIEngagementContact,
  DocumentCategory,
  AIEngagementDocument,
  // Readiness workflow types
  ReadinessAssessmentStatus,
  EntityType,
  CompanySize,
  TeamFunction,
  TeamMethodology,
  SeniorityLevel,
  QuestionStatus,
  QuestionFlag,
  QuestionnaireStatus,
  ResponseStatus,
  DevRequestStatus,
  QuestionCategory,
  ReadinessAssessment,
  AssessmentCompany,
  AssessmentTeam,
  AssessmentMember,
  AssessmentPolicy,
  QuestionBankItem,
  QuestionDevelopmentRequest,
  AssessmentQuestionnaire,
  QuestionnaireQuestion,
  QuestionnaireResponse,
  ResponseAnswer,
  QuestionFeedbackStats,
  CreateReadinessAssessmentInput,
  UpdateReadinessAssessmentInput,
  UpsertAssessmentCompanyInput,
  UpsertAssessmentTeamInput,
  CreateAssessmentMemberInput,
  UpdateMemberPilotInput,
  TeamTrainingStatus,
  CreateTrainingStatusInput,
  UpdateTrainingStatusInput,
  UpsertAssessmentPolicyInput,
  CreateQuestionInput,
  SubmitAnswerInput,
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
  CONTACT_CATEGORY_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  // Readiness workflow constants
  ROLE_QUESTION_CATEGORIES,
  ENTITY_TYPE_LABELS,
  COMPANY_SIZE_LABELS,
  TEAM_FUNCTION_LABELS,
  TEAM_METHODOLOGY_LABELS,
  SENIORITY_LABELS,
  READINESS_TIERS,
  POLICY_COVERAGE_AREAS,
  // Team profiling constants
  VENDOR_LABELS,
  AI_TOOL_LABELS,
  TRAINING_TRACK_LABELS,
  ROLE_TO_DEFAULT_TRACKS,
  ROLE_TO_DEFAULT_AI_TOOL,
} from "./types/ai-tools.js";

// Tenant types
export type {
  AuthProvider,
  Tenant,
  CreateTenantInput,
  UpdateTenantInput,
  TenantToolEntitlement,
  UpdateToolEntitlementInput,
  ToolKey,
} from "./types/tenant.js";
export { TOOL_KEYS, TOOL_KEY_LABELS, TOOL_KEY_SECTIONS } from "./types/tenant.js";

// Readiness Deliverables types
export type {
  AssessmentPillar, ConstraintCategory, ConstraintSeverity,
  UseCaseQuadrant, InvestmentTier, ImprovementType, RiskCategory, EnhancementStatus,
  CatalogVersionRecord, AIEnhancementCatalogItem, AssessmentEnhancementStatusRecord,
  AssessmentVersionStampRecord, AssessmentScopeRecord, AssessmentConstraintRecord,
  ApprovedToolRecord, WorkflowPhaseRecord, AIOpportunityRecord,
  DataReadinessRecord, UseCaseRecord, RiskRecord, PilotRecord,
  SetScopeInput, CreateConstraintInput, CreateApprovedToolInput,
  CreateWorkflowPhaseInput, CreateAIOpportunityInput, UpsertDataReadinessInput,
  CreateUseCaseInput, CreateRiskInput, CreatePilotInput,
  EnhancementCoverageStats,
} from "./types/readiness-deliverables.js";
export {
  ASSESSMENT_PILLAR_LABELS, PILLAR_PHASE_MAPPING,
  CONSTRAINT_CATEGORY_LABELS, CONSTRAINT_TEMPLATES,
  USE_CASE_QUADRANT_LABELS, INVESTMENT_TIER_LABELS, IMPROVEMENT_TYPE_LABELS,
  RISK_CATEGORY_LABELS, RISK_TEMPLATES,
  DATA_READINESS_DIMENSIONS, ENHANCEMENT_STATUS_LABELS,
  computeQuadrant, computeInvestmentTier, computeRiskScore, getRiskColor,
} from "./types/readiness-deliverables.js";

// AI Laws & Regulations
export type { AILaw } from "./types/ai-laws.js";
export { AI_LAW_CATALOG, getLawsByState, getAvailableStates, getFederalLaws } from "./types/ai-laws.js";

// Corporate Vault + Client Documents
export type {
  CorporateDocType,
  CorporateDocument,
  CreateCorporateDocumentInput,
  UpdateCorporateDocumentInput,
  ClientDocType,
  ClientDocument,
  CreateClientDocumentInput,
  UpdateClientDocumentInput,
  ExpiryStatus,
} from "./types/admin.js";
export {
  CORPORATE_DOC_TYPES,
  CORPORATE_DOC_TYPE_DEFAULTS,
  CLIENT_DOC_TYPES,
  CLIENT_DOC_TYPE_DEFAULTS,
  deriveExpiryStatus,
} from "./types/admin.js";
export * as corporateDocuments from "./queries/admin/corporate-documents.js";
export * as clientDocuments from "./queries/admin/client-documents.js";
