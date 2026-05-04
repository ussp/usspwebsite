// =============================================================================
// AI Transformation Monitoring Tool — Type Definitions
//
// Two modules in one:
//   1. AI Transformation Monitor — measures team productivity before/after AI training
//   2. AI Readiness Assessment — measures organizational readiness for AI (DORA 2025)
//
// Independent module: no imports from ATS types (admin.ts, database.ts).
// Only references StaffRole for RBAC compatibility.
// =============================================================================

// -----------------------------------------------------------------------------
// Enums & Constants
// -----------------------------------------------------------------------------

export type EngagementStatus = "draft" | "readiness" | "baseline" | "training" | "post_assessment" | "completed" | "archived";

export type IntegrationType = "jira" | "azure_devops" | "github" | "gitlab" | "linear" | "manual";

export type TeamMemberRole =
  | "developer" | "qa" | "scrum_master" | "product_owner" | "devops" | "designer"
  | "business_analyst" | "tech_lead" | "architect" | "integration_tester"
  | "performance_tester" | "release_manager" | "data_analyst" | "data_engineer"
  | "security_engineer" | "ux_researcher" | "technical_writer"
  | "program_manager" | "project_manager" | "engineering_manager"
  | "database_admin" | "system_admin" | "support_engineer" | "other";

export type AssessmentType = "readiness" | "baseline" | "post_training";

export type AssessmentStatus = "draft" | "collecting" | "completed";

export type DataSource = "integration" | "manual";

export type MetricCategory = "dora" | "space" | "devex" | "scrum" | "quality" | "readiness";

export type TrainingPlanStatus = "proposed" | "approved" | "in_progress" | "completed";

export type MetricDirection = "higher_better" | "lower_better";

export const ENGAGEMENT_STATUS_LABELS: Record<EngagementStatus, string> = {
  draft: "Draft",
  readiness: "Readiness",
  baseline: "Baseline",
  training: "Training",
  post_assessment: "Post-Assessment",
  completed: "Completed",
  archived: "Archived",
};

export const ENGAGEMENT_STATUS_COLORS: Record<EngagementStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  readiness: "bg-cyan-100 text-cyan-800",
  baseline: "bg-blue-100 text-blue-800",
  training: "bg-amber-100 text-amber-800",
  post_assessment: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  archived: "bg-gray-100 text-gray-500",
};

export const TEAM_MEMBER_ROLE_LABELS: Record<TeamMemberRole, string> = {
  developer: "Developer",
  qa: "QA/Tester",
  scrum_master: "Scrum Master",
  product_owner: "Product Owner",
  devops: "DevOps Engineer",
  designer: "Designer",
  business_analyst: "Business Analyst",
  tech_lead: "Tech Lead",
  architect: "Architect",
  integration_tester: "Integration Tester",
  performance_tester: "Performance Tester",
  release_manager: "Release Manager",
  data_analyst: "Data Analyst",
  data_engineer: "Data Engineer",
  security_engineer: "Security Engineer",
  ux_researcher: "UX Researcher",
  technical_writer: "Technical Writer",
  program_manager: "Program Manager",
  project_manager: "Project Manager",
  engineering_manager: "Engineering Manager",
  database_admin: "Database Admin",
  system_admin: "System Admin",
  support_engineer: "Support Engineer",
  other: "Other",
};

// Question categories each role receives in readiness questionnaires.
// "universal" questions (7 DORA capabilities + 4 AI policy) go to all roles.
// These are the ADDITIONAL role-specific categories.
export type QuestionCategory = "dora_capability" | "ai_policy" | "role_specific" | "workflow";

export const ROLE_QUESTION_CATEGORIES: Record<TeamMemberRole, string[]> = {
  developer: ["ai_coding_tools", "code_review", "version_control", "technical_debt"],
  qa: ["test_automation", "regression_testing", "bug_analysis", "test_data"],
  scrum_master: ["sprint_analytics", "retrospective_facilitation", "impediment_tracking", "velocity_prediction"],
  product_owner: ["backlog_management", "story_refinement", "stakeholder_reporting", "prioritization"],
  devops: ["infrastructure_automation", "pipeline_optimization", "incident_response", "monitoring"],
  designer: ["design_workflows", "prototyping", "accessibility", "design_systems"],
  business_analyst: ["requirements_gathering", "process_modeling", "stakeholder_analysis", "documentation"],
  tech_lead: ["ai_coding_tools", "code_review", "architecture_review", "governance"],
  architect: ["architecture_review", "technical_debt", "technology_evaluation", "documentation"],
  integration_tester: ["test_automation", "api_testing", "regression_management", "environment_config"],
  performance_tester: ["test_automation", "performance_analysis", "load_testing", "monitoring"],
  release_manager: ["pipeline_optimization", "release_planning", "change_management", "incident_response"],
  data_analyst: ["data_analysis", "reporting", "visualization", "data_quality"],
  data_engineer: ["data_pipelines", "infrastructure_automation", "data_quality", "monitoring"],
  security_engineer: ["security_review", "compliance_automation", "incident_response", "governance"],
  ux_researcher: ["user_research", "survey_design", "data_analysis", "accessibility"],
  technical_writer: ["documentation", "content_generation", "review_automation", "knowledge_management"],
  program_manager: ["governance", "stakeholder_reporting", "change_management", "risk_assessment"],
  project_manager: ["governance", "stakeholder_reporting", "change_management", "planning"],
  engineering_manager: ["governance", "change_management", "team_adoption", "risk_assessment"],
  database_admin: ["infrastructure_automation", "data_quality", "monitoring", "incident_response"],
  system_admin: ["infrastructure_automation", "monitoring", "incident_response", "security_review"],
  support_engineer: ["incident_response", "knowledge_management", "bug_analysis", "documentation"],
  other: [],  // universal questions only; role-specific questions developed via development requests
};

export const ASSESSMENT_STATUS_LABELS: Record<AssessmentStatus, string> = {
  draft: "Draft",
  collecting: "Collecting Data",
  completed: "Completed",
};

export const TRAINING_PLAN_STATUS_LABELS: Record<TrainingPlanStatus, string> = {
  proposed: "Proposed",
  approved: "Approved",
  in_progress: "In Progress",
  completed: "Completed",
};

// -----------------------------------------------------------------------------
// Metric Catalog — defines all measurable metrics with metadata
// -----------------------------------------------------------------------------

export interface MetricDefinition {
  category: MetricCategory;
  name: string;
  label: string;
  unit: string;
  direction: MetricDirection;
  level: "team" | "member";
  description: string;
}

export const METRIC_CATALOG: MetricDefinition[] = [
  // DORA metrics
  { category: "dora", name: "deployment_frequency", label: "Deployment Frequency", unit: "per_week", direction: "higher_better", level: "team", description: "How often the team deploys to production" },
  { category: "dora", name: "lead_time_minutes", label: "Lead Time for Changes", unit: "minutes", direction: "lower_better", level: "team", description: "Time from commit to production" },
  { category: "dora", name: "change_failure_rate", label: "Change Failure Rate", unit: "percentage", direction: "lower_better", level: "team", description: "Percentage of deployments causing incidents" },
  { category: "dora", name: "mttr_minutes", label: "Mean Time to Recovery", unit: "minutes", direction: "lower_better", level: "team", description: "Time to restore service after failure" },
  // Scrum metrics
  { category: "scrum", name: "velocity", label: "Velocity", unit: "story_points", direction: "higher_better", level: "team", description: "Story points completed per sprint (averaged)" },
  { category: "scrum", name: "cycle_time_days", label: "Cycle Time", unit: "count", direction: "lower_better", level: "team", description: "Median days from issue start to done" },
  { category: "scrum", name: "predictability", label: "Sprint Predictability", unit: "percentage", direction: "higher_better", level: "team", description: "Committed vs delivered ratio" },
  { category: "scrum", name: "throughput", label: "Throughput", unit: "count", direction: "higher_better", level: "team", description: "Items completed per sprint" },
  { category: "scrum", name: "bug_escape_rate", label: "Bug Escape Rate", unit: "count", direction: "lower_better", level: "team", description: "Production bugs per sprint" },
  // SPACE survey dimensions
  { category: "space", name: "satisfaction", label: "Satisfaction", unit: "score_1_5", direction: "higher_better", level: "member", description: "Tool and workflow satisfaction" },
  { category: "space", name: "performance", label: "Performance", unit: "score_1_5", direction: "higher_better", level: "member", description: "Quality of outcomes and commitments" },
  { category: "space", name: "activity", label: "Activity", unit: "score_1_5", direction: "higher_better", level: "member", description: "Meaningful task completion rate" },
  { category: "space", name: "communication", label: "Communication", unit: "score_1_5", direction: "higher_better", level: "member", description: "Team collaboration and review speed" },
  { category: "space", name: "efficiency", label: "Efficiency", unit: "score_1_5", direction: "higher_better", level: "member", description: "Time on valuable work vs toil" },
  // DevEx survey dimensions
  { category: "devex", name: "flow_state", label: "Flow State", unit: "score_1_5", direction: "higher_better", level: "member", description: "Ability to focus without interruption" },
  { category: "devex", name: "feedback_loops", label: "Feedback Loops", unit: "score_1_5", direction: "higher_better", level: "member", description: "Speed of build/test/review cycles" },
  { category: "devex", name: "cognitive_load", label: "Cognitive Load", unit: "score_1_5", direction: "lower_better", level: "member", description: "Mental effort to understand and work in the system" },
  // DevEx — Three AI Tensions (DORA 2025)
  { category: "devex", name: "velocity_gain", label: "AI Velocity Gain", unit: "score_1_5", direction: "higher_better", level: "member", description: "Speed improvement from AI-assisted coding" },
  { category: "devex", name: "verification_tax", label: "Verification Tax", unit: "score_1_5", direction: "lower_better", level: "member", description: "Time spent auditing and verifying AI-generated output" },
  { category: "devex", name: "entry_barrier_reduction", label: "Entry Barrier Reduction", unit: "score_1_5", direction: "higher_better", level: "member", description: "AI makes it easier to work in unfamiliar areas" },
  { category: "devex", name: "expertise_depth_risk", label: "Expertise Depth Risk", unit: "score_1_5", direction: "lower_better", level: "member", description: "Risk of reduced deep understanding due to AI reliance" },
  { category: "devex", name: "prototyping_speed", label: "Prototyping Speed", unit: "score_1_5", direction: "higher_better", level: "member", description: "Speed of creating prototypes and proofs of concept with AI" },
  { category: "devex", name: "last_mile_friction", label: "Last Mile to Production", unit: "score_1_5", direction: "lower_better", level: "member", description: "Friction getting AI-assisted work to production quality" },
  // Quality metrics — story quality, test coverage, documentation, planning
  { category: "quality", name: "story_quality_score", label: "Story Quality Score", unit: "score_1_5", direction: "higher_better", level: "team", description: "Average quality rating of user stories against defined criteria (clarity, AC completeness, testability, acceptance criteria, edge cases)" },
  { category: "quality", name: "story_rejection_rate", label: "Story Rejection Rate", unit: "percentage", direction: "lower_better", level: "team", description: "Percentage of stories sent back for rework after review by PO/PM" },
  { category: "quality", name: "story_review_cycle_time", label: "Story Review Cycle Time", unit: "days", direction: "lower_better", level: "team", description: "Average days from story draft to approved/ready-for-dev" },
  { category: "quality", name: "acceptance_criteria_completeness", label: "AC Completeness", unit: "score_1_5", direction: "higher_better", level: "team", description: "Average completeness score of acceptance criteria (covers happy path, edge cases, error handling)" },
  { category: "quality", name: "test_coverage_percentage", label: "Test Coverage", unit: "percentage", direction: "higher_better", level: "team", description: "Percentage of acceptance criteria with corresponding test cases" },
  { category: "quality", name: "test_script_quality", label: "Test Script Quality", unit: "score_1_5", direction: "higher_better", level: "team", description: "Quality of test scripts — clear steps, expected results, data setup, edge case coverage" },
  { category: "quality", name: "test_creation_time_hours", label: "Test Creation Time", unit: "hours", direction: "lower_better", level: "team", description: "Average hours to create test scripts per story (by story point size)" },
  { category: "quality", name: "documentation_coverage", label: "Documentation Coverage", unit: "percentage", direction: "higher_better", level: "team", description: "Percentage of completed stories with updated Confluence documentation" },
  { category: "quality", name: "documentation_quality", label: "Documentation Quality", unit: "score_1_5", direction: "higher_better", level: "team", description: "Quality of technical and process documentation (current, accurate, findable)" },
  { category: "quality", name: "defect_density", label: "Defect Density", unit: "count", direction: "lower_better", level: "team", description: "Defects found per story point delivered (lower = higher quality)" },
  { category: "quality", name: "rework_percentage", label: "Rework Percentage", unit: "percentage", direction: "lower_better", level: "team", description: "Percentage of sprint capacity spent on rework vs new development" },
  { category: "quality", name: "first_pass_yield", label: "First Pass Yield", unit: "percentage", direction: "higher_better", level: "team", description: "Percentage of stories that pass QA on first attempt without defects" },
  { category: "quality", name: "planning_accuracy", label: "Planning Accuracy", unit: "percentage", direction: "higher_better", level: "team", description: "How accurately stories were sized — actual effort vs estimated (closer to 100% = better)" },
  { category: "quality", name: "requirement_clarity", label: "Requirement Clarity", unit: "score_1_5", direction: "higher_better", level: "member", description: "Team members rate how clear requirements are when they start work" },
  { category: "quality", name: "architect_dev_alignment", label: "Architect-Dev Alignment", unit: "score_1_5", direction: "higher_better", level: "member", description: "Developers rate clarity of technical direction from architect" },
  // SPACE — AI-specific survey additions (DORA 2025)
  { category: "space", name: "ai_trust", label: "AI Trust Level", unit: "score_1_5", direction: "higher_better", level: "member", description: "Confidence in AI-generated code and suggestions" },
  { category: "space", name: "ai_adoption_rate", label: "AI Adoption Rate", unit: "percentage", direction: "higher_better", level: "member", description: "Self-reported frequency of AI tool usage in daily work" },
  { category: "space", name: "verification_overhead", label: "Verification Overhead", unit: "score_1_5", direction: "lower_better", level: "member", description: "Proportion of time spent reviewing AI output vs original work" },
  // AI Readiness — DORA AI Capabilities Model (7 capabilities, org-level)
  { category: "readiness", name: "ai_accessible_data", label: "AI-Accessible Internal Data", unit: "score_1_5", direction: "higher_better", level: "team", description: "AI is connected to internal docs, code, and knowledge bases" },
  { category: "readiness", name: "ai_stance_clarity", label: "Clear AI Stance", unit: "score_1_5", direction: "higher_better", level: "team", description: "Organization has explicit, communicated policy on AI use" },
  { category: "readiness", name: "healthy_data_ecosystem", label: "Healthy Data Ecosystems", unit: "score_1_5", direction: "higher_better", level: "team", description: "Internal data is high-quality, accessible, and unified" },
  { category: "readiness", name: "platform_engineering", label: "Platform Engineering", unit: "score_1_5", direction: "higher_better", level: "team", description: "Internal platforms provide automated, secure pathways for AI" },
  { category: "readiness", name: "user_centric_focus", label: "User-Centric Focus", unit: "score_1_5", direction: "higher_better", level: "team", description: "Teams build the right things, not just faster things" },
  { category: "readiness", name: "version_control_maturity", label: "Version Control Maturity", unit: "score_1_5", direction: "higher_better", level: "team", description: "Mature version control as safety net for AI-accelerated change" },
  { category: "readiness", name: "small_batches", label: "Working in Small Batches", unit: "score_1_5", direction: "higher_better", level: "team", description: "Team delivers in small increments to manage AI-driven velocity" },
  // AI Policy & Compliance readiness (legal/regulatory)
  { category: "readiness", name: "ai_policy_exists", label: "AI Usage Policy Exists", unit: "score_1_5", direction: "higher_better", level: "team", description: "Organization has a written, communicated AI usage policy" },
  { category: "readiness", name: "ai_policy_coverage", label: "AI Policy Coverage", unit: "score_1_5", direction: "higher_better", level: "team", description: "Policy covers data privacy, code ownership, approved tools, and prohibited uses" },
  { category: "readiness", name: "regulatory_awareness", label: "Regulatory Awareness", unit: "score_1_5", direction: "higher_better", level: "team", description: "Team is aware of applicable state and federal AI regulations" },
  { category: "readiness", name: "ai_governance", label: "AI Governance", unit: "score_1_5", direction: "higher_better", level: "team", description: "AI governance committee, responsible person, or review process exists" },
];

// Lookup helper
export function getMetricDefinition(category: MetricCategory, name: string): MetricDefinition | undefined {
  return METRIC_CATALOG.find((m) => m.category === category && m.name === name);
}

// -----------------------------------------------------------------------------
// Entity Interfaces
// -----------------------------------------------------------------------------

export interface AIEngagement {
  id: string;
  site_id: string;
  name: string;
  client_name: string;
  engagement_lead_id: string | null;
  status: EngagementStatus;
  integration_type: IntegrationType | null;
  integration_config: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AITeam {
  id: string;
  site_id: string;
  engagement_id: string;
  name: string;
  team_size: number;
  external_team_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AITeamMember {
  id: string;
  site_id: string;
  team_id: string;
  display_name: string;
  role: TeamMemberRole;
  external_user_id: string | null;
  created_at: string;
}

export interface AIAssessment {
  id: string;
  site_id: string;
  team_id: string;
  assessment_type: AssessmentType;
  period_start: string;
  period_end: string;
  sprint_count: number | null;
  data_source: DataSource;
  status: AssessmentStatus;
  assessed_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIMetric {
  id: string;
  site_id: string;
  assessment_id: string;
  category: MetricCategory;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  member_id: string | null;
  raw_data: Record<string, unknown> | null;
  created_at: string;
}

export interface AITrainingPlan {
  id: string;
  site_id: string;
  team_id: string;
  member_id: string | null;
  role: TeamMemberRole;
  activity_summary: ActivitySummary | null;
  recommended_tools: RecommendedTool[];
  recommended_training: RecommendedTraining[];
  status: TrainingPlanStatus;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
// Nested Types
// -----------------------------------------------------------------------------

export interface ActivitySummary {
  issueTypes: { type: string; count: number; points: number }[];
  totalStoryPoints: number;
  topActivities: string[];
}

export interface RecommendedTool {
  tool: string;
  reason: string;
  expected_impact: string;
}

export interface RecommendedTraining {
  module: string;
  description: string;
  duration_hours: number;
  priority: "high" | "medium" | "low";
}

// -----------------------------------------------------------------------------
// Input Types (for create/update operations)
// -----------------------------------------------------------------------------

export interface CreateEngagementInput {
  name: string;
  client_name: string;
  engagement_lead_id?: string;
  integration_type?: IntegrationType;
  integration_config?: Record<string, unknown>;
  notes?: string;
}

export interface UpdateEngagementInput {
  name?: string;
  client_name?: string;
  engagement_lead_id?: string;
  status?: EngagementStatus;
  integration_type?: IntegrationType;
  integration_config?: Record<string, unknown>;
  notes?: string;
}

export interface CreateTeamInput {
  engagement_id: string;
  name: string;
  team_size: number;
  external_team_id?: string;
}

export interface UpdateTeamInput {
  name?: string;
  team_size?: number;
  external_team_id?: string;
}

export interface CreateTeamMemberInput {
  team_id: string;
  display_name: string;
  role: TeamMemberRole;
  external_user_id?: string;
}

export interface CreateAssessmentInput {
  team_id: string;
  assessment_type: AssessmentType;
  period_start: string;
  period_end: string;
  sprint_count?: number;
  data_source?: DataSource;
  notes?: string;
}

export interface UpdateAssessmentInput {
  period_start?: string;
  period_end?: string;
  sprint_count?: number;
  data_source?: DataSource;
  status?: AssessmentStatus;
  notes?: string;
}

export interface CreateMetricInput {
  assessment_id: string;
  category: MetricCategory;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  member_id?: string;
  raw_data?: Record<string, unknown>;
}

export interface CreateTrainingPlanInput {
  team_id: string;
  member_id?: string;
  role: TeamMemberRole;
  activity_summary?: ActivitySummary;
  recommended_tools: RecommendedTool[];
  recommended_training: RecommendedTraining[];
}

export interface UpdateTrainingPlanInput {
  recommended_tools?: RecommendedTool[];
  recommended_training?: RecommendedTraining[];
  status?: TrainingPlanStatus;
}

// -----------------------------------------------------------------------------
// Report Types
// -----------------------------------------------------------------------------

export interface MetricDelta {
  metric_name: string;
  label: string;
  category: MetricCategory;
  baseline_value: number;
  post_value: number;
  delta: number;
  improvement_pct: number;
  direction: MetricDirection;
  unit: string;
}

export interface CategorySummary {
  category: MetricCategory;
  deltas: MetricDelta[];
  avg_improvement_pct: number;
}

export interface BenchmarkComparison {
  source: string;
  finding: string;
  range_low: number;
  range_high: number;
  year: number;
}

export const RESEARCH_BENCHMARKS: BenchmarkComparison[] = [
  { source: "Forrester TEI (GitHub Copilot)", finding: "22% developer productivity improvement", range_low: 15, range_high: 25, year: 2023 },
  { source: "McKinsey", finding: "20-45% productivity improvement in software engineering", range_low: 20, range_high: 45, year: 2023 },
  { source: "Harvard/BCG Study", finding: "25% faster, 40% higher quality", range_low: 25, range_high: 40, year: 2023 },
  { source: "GitHub Copilot Study (Peng et al.)", finding: "55.8% faster task completion", range_low: 45, range_high: 60, year: 2023 },
  { source: "DORA State of DevOps (2025)", finding: "AI is an amplifier — magnifies existing strengths AND weaknesses", range_low: 0, range_high: 100, year: 2025 },
  { source: "DORA AI Capabilities Model (2025)", finding: "7 organizational capabilities determine AI adoption success", range_low: 0, range_high: 100, year: 2025 },
  { source: "DORA (2025)", finding: "90% of tech professionals use AI; only 24% trust AI-generated code significantly", range_low: 20, range_high: 90, year: 2025 },
];

export interface TransformationReport {
  team_id: string;
  team_name: string;
  engagement_name: string;
  client_name: string;
  baseline_period: { start: string; end: string; sprint_count: number | null };
  post_period: { start: string; end: string; sprint_count: number | null };
  categories: CategorySummary[];
  overall_improvement_pct: number;
  benchmark_context: string;
  benchmarks: BenchmarkComparison[];
  readiness_context: ReadinessAssessmentResult | null;
  amplifier_analysis: AmplifierAnalysis | null;
  tensions: TensionAnalysis[];
  computed_at: string;
}

// -----------------------------------------------------------------------------
// AI Readiness Assessment Types (DORA 2025 AI Capabilities Model)
// Standalone module that can also optionally link to a Transformation engagement
// -----------------------------------------------------------------------------

export type ReadinessTier = "not_ready" | "foundation_needed" | "ready" | "well_positioned";

export const READINESS_TIER_THRESHOLDS: { tier: ReadinessTier; min: number; label: string; description: string }[] = [
  { tier: "well_positioned", min: 4.0, label: "Well Positioned", description: "Strong foundations. AI will amplify existing strengths significantly." },
  { tier: "ready", min: 3.0, label: "Ready", description: "Adequate foundations. AI training should produce measurable improvement." },
  { tier: "foundation_needed", min: 2.0, label: "Foundation Needed", description: "Some capabilities present but key gaps remain. Targeted fixes recommended before training." },
  { tier: "not_ready", min: 0, label: "Not Ready", description: "Critical gaps in AI foundations. Address blockers before investing in AI training." },
];

export const READINESS_TIER_LABELS: Record<ReadinessTier, string> = {
  not_ready: "Not Ready",
  foundation_needed: "Foundation Needed",
  ready: "Ready",
  well_positioned: "Well Positioned",
};

export const READINESS_TIER_COLORS: Record<ReadinessTier, string> = {
  not_ready: "bg-red-100 text-red-800",
  foundation_needed: "bg-amber-100 text-amber-800",
  ready: "bg-blue-100 text-blue-800",
  well_positioned: "bg-emerald-100 text-emerald-800",
};

export interface ReadinessCapability {
  name: string;
  label: string;
  score: number;
  description: string;
}

export interface ReadinessAssessmentResult {
  team_id: string;
  capabilities: ReadinessCapability[];
  overall_score: number;
  readiness_tier: ReadinessTier;
  tier_label: string;
  tier_description: string;
  blockers: ReadinessCapability[];
  computed_at: string;
}

export interface AmplifierAnalysis {
  readiness_score: number;
  improvement_score: number;
  correlation_narrative: string;
}

export interface TensionAnalysis {
  tension_name: string;
  label: string;
  positive_pole: MetricDelta | null;
  negative_pole: MetricDelta | null;
  net_narrative: string;
}

// -----------------------------------------------------------------------------
// Dashboard Types
// -----------------------------------------------------------------------------

export interface AIToolsDashboardMetrics {
  total_engagements: number;
  active_engagements: number;
  total_teams: number;
  assessments_in_progress: number;
  avg_improvement_pct: number | null;
  recent_engagements: (AIEngagement & { team_count: number; improvement_pct: number | null })[];
}

// -----------------------------------------------------------------------------
// Engagement Detail (joined data)
// -----------------------------------------------------------------------------

export interface EngagementDetail extends AIEngagement {
  teams: (AITeam & {
    members: AITeamMember[];
    readiness: AIAssessment | null;
    baseline: AIAssessment | null;
    post_training: AIAssessment | null;
    improvement_pct: number | null;
    readiness_score: number | null;
  })[];
  lead_name: string | null;
}

// -----------------------------------------------------------------------------
// Integration Types (for Jira/ADO/GitHub data sync)
// -----------------------------------------------------------------------------

export interface SprintData {
  sprint_name: string;
  sprint_number: number;
  start_date: string;
  end_date: string;
  committed_points: number;
  completed_points: number;
  items_committed: number;
  items_completed: number;
  bugs_found: number;
  issues: SprintIssue[];
}

export interface SprintIssue {
  key: string;
  type: string; // story, bug, task, spike
  summary: string;
  assignee_id: string | null;
  story_points: number;
  cycle_time_days: number | null;
  status: string;
}

export interface IntegrationSyncResult {
  success: boolean;
  sprints: SprintData[];
  computed_metrics: CreateMetricInput[];
  errors?: string[];
}

// Training catalog for role-based recommendations
export interface TrainingModule {
  module: string;
  description: string;
  duration_hours: number;
  target_roles: TeamMemberRole[];
  tools: string[];
}

export const TRAINING_CATALOG: TrainingModule[] = [
  // Developer modules
  { module: "AI Pair Programming", description: "Using GitHub Copilot and Cursor for code generation, completion, and refactoring", duration_hours: 4, target_roles: ["developer"], tools: ["GitHub Copilot", "Cursor"] },
  { module: "AI-Assisted Code Review", description: "Leveraging AI to review PRs, catch bugs, and suggest improvements", duration_hours: 2, target_roles: ["developer"], tools: ["GitHub Copilot", "CodeRabbit"] },
  { module: "AI Test Generation", description: "Using AI to generate unit tests, integration tests, and test data", duration_hours: 3, target_roles: ["developer", "qa"], tools: ["GitHub Copilot", "Diffblue"] },
  { module: "Prompt Engineering for Developers", description: "Writing effective prompts for code generation, debugging, and documentation", duration_hours: 2, target_roles: ["developer", "qa", "devops"], tools: ["ChatGPT", "Claude"] },
  // QA modules
  { module: "AI-Powered Test Automation", description: "Building and maintaining test suites with AI assistance", duration_hours: 4, target_roles: ["qa"], tools: ["Testim", "Mabl", "GitHub Copilot"] },
  { module: "AI Regression Testing", description: "Using AI to identify and prioritize regression test cases", duration_hours: 2, target_roles: ["qa"], tools: ["Testim", "Applitools"] },
  { module: "AI Bug Report Analysis", description: "AI-assisted bug triage, duplicate detection, and root cause suggestions", duration_hours: 2, target_roles: ["qa", "developer"], tools: ["ChatGPT", "Claude"] },
  // Scrum Master modules
  { module: "AI Sprint Analytics", description: "Using AI to analyze sprint data, predict velocity, and identify bottlenecks", duration_hours: 3, target_roles: ["scrum_master"], tools: ["ChatGPT", "Claude", "Jira AI"] },
  { module: "AI-Facilitated Retrospectives", description: "AI-powered retrospective facilitation and action item generation", duration_hours: 2, target_roles: ["scrum_master"], tools: ["Miro AI", "ChatGPT"] },
  { module: "Predictive Velocity Modeling", description: "Building AI models to forecast sprint outcomes and capacity", duration_hours: 2, target_roles: ["scrum_master", "product_owner"], tools: ["ChatGPT", "Claude"] },
  // Product Owner modules
  { module: "AI Backlog Management", description: "AI-assisted backlog prioritization, grooming, and estimation", duration_hours: 3, target_roles: ["product_owner"], tools: ["Jira AI", "ChatGPT", "Claude"] },
  { module: "AI User Story Refinement", description: "Generating and refining user stories, acceptance criteria, and edge cases with AI", duration_hours: 2, target_roles: ["product_owner"], tools: ["ChatGPT", "Claude"] },
  { module: "AI Stakeholder Report Generation", description: "Creating executive summaries and progress reports using AI", duration_hours: 2, target_roles: ["product_owner", "scrum_master"], tools: ["ChatGPT", "Claude"] },
  // DevOps modules
  { module: "AI Infrastructure Management", description: "Using AI for IaC generation, optimization, and troubleshooting", duration_hours: 3, target_roles: ["devops"], tools: ["GitHub Copilot", "ChatGPT"] },
  { module: "AI-Assisted Incident Response", description: "AI-powered log analysis, root cause identification, and runbook generation", duration_hours: 3, target_roles: ["devops"], tools: ["ChatGPT", "Claude", "PagerDuty AI"] },
  { module: "AI Pipeline Optimization", description: "Optimizing CI/CD pipelines with AI-suggested improvements", duration_hours: 2, target_roles: ["devops"], tools: ["GitHub Copilot", "ChatGPT"] },
  // Designer modules
  { module: "AI Design Workflows", description: "Using AI for prototyping, wireframing, and design system generation", duration_hours: 3, target_roles: ["designer"], tools: ["Figma AI", "Midjourney", "ChatGPT"] },
  { module: "AI-Assisted Accessibility Compliance", description: "Using AI to audit and improve accessibility (Section 508, WCAG)", duration_hours: 2, target_roles: ["designer", "developer"], tools: ["axe AI", "ChatGPT"] },
  // Business Analyst modules
  { module: "AI-Assisted Requirements Gathering", description: "Using AI to elicit, analyze, and document requirements from stakeholder interviews", duration_hours: 3, target_roles: ["business_analyst"], tools: ["ChatGPT", "Claude", "Otter.ai"] },
  { module: "AI User Story Generation", description: "Generating user stories, acceptance criteria, and edge cases with AI assistance", duration_hours: 2, target_roles: ["business_analyst", "product_owner"], tools: ["ChatGPT", "Claude"] },
  { module: "AI Process Modeling", description: "Using AI to create and validate process flows, swimlane diagrams, and decision trees", duration_hours: 2, target_roles: ["business_analyst"], tools: ["ChatGPT", "Miro AI"] },
  // Tech Lead / Architect modules
  { module: "AI Architecture Review", description: "Using AI to review architecture decisions, identify patterns, and evaluate trade-offs", duration_hours: 3, target_roles: ["tech_lead", "architect"], tools: ["ChatGPT", "Claude", "GitHub Copilot"] },
  { module: "AI Technical Debt Analysis", description: "Leveraging AI to identify, prioritize, and plan technical debt remediation", duration_hours: 2, target_roles: ["tech_lead", "architect", "developer"], tools: ["SonarQube AI", "ChatGPT"] },
  // Integration / Performance Tester modules
  { module: "AI-Assisted API Testing", description: "Using AI to generate API test cases, mock data, and validate integration contracts", duration_hours: 3, target_roles: ["integration_tester", "qa"], tools: ["Postman AI", "ChatGPT", "GitHub Copilot"] },
  { module: "AI Performance Test Design", description: "AI-assisted load test scenario design, threshold analysis, and bottleneck identification", duration_hours: 3, target_roles: ["performance_tester"], tools: ["ChatGPT", "k6", "Grafana AI"] },
  // Data roles modules
  { module: "AI-Powered Data Analysis", description: "Using AI for exploratory data analysis, pattern detection, and insight generation", duration_hours: 3, target_roles: ["data_analyst", "data_engineer"], tools: ["ChatGPT", "Claude", "Jupyter AI"] },
  { module: "AI Data Pipeline Development", description: "Using AI to generate ETL code, optimize queries, and validate data transformations", duration_hours: 3, target_roles: ["data_engineer", "database_admin"], tools: ["GitHub Copilot", "ChatGPT"] },
  // Security modules
  { module: "AI Security Review", description: "Using AI to identify vulnerabilities, review security configurations, and generate compliance reports", duration_hours: 3, target_roles: ["security_engineer"], tools: ["ChatGPT", "Claude", "Snyk AI"] },
  // Management modules
  { module: "AI Change Management", description: "Using AI for adoption planning, impact analysis, and communication strategy for AI rollouts", duration_hours: 2, target_roles: ["engineering_manager", "program_manager", "project_manager"], tools: ["ChatGPT", "Claude"] },
  { module: "AI Risk Assessment", description: "Using AI to identify, evaluate, and mitigate risks in AI adoption programs", duration_hours: 2, target_roles: ["engineering_manager", "program_manager", "security_engineer"], tools: ["ChatGPT", "Claude"] },
  // Release / Ops modules
  { module: "AI Release Planning", description: "Using AI for release scheduling, dependency analysis, and rollback planning", duration_hours: 2, target_roles: ["release_manager"], tools: ["ChatGPT", "Jira AI"] },
  { module: "AI System Administration", description: "Using AI for system monitoring, log analysis, and automated remediation", duration_hours: 3, target_roles: ["system_admin", "database_admin"], tools: ["ChatGPT", "Claude"] },
  // Support / Docs modules
  { module: "AI Knowledge Management", description: "Using AI to create, organize, and maintain technical documentation and knowledge bases", duration_hours: 2, target_roles: ["technical_writer", "support_engineer"], tools: ["ChatGPT", "Claude", "Notion AI"] },
  { module: "AI-Assisted Support Triage", description: "Using AI for ticket classification, root cause suggestion, and response drafting", duration_hours: 2, target_roles: ["support_engineer"], tools: ["ChatGPT", "Claude"] },
  // UX Research modules
  { module: "AI User Research", description: "Using AI to analyze user interviews, synthesize findings, and generate research reports", duration_hours: 3, target_roles: ["ux_researcher", "designer"], tools: ["ChatGPT", "Claude", "Dovetail AI"] },
];

// -----------------------------------------------------------------------------
// Engagement Contacts (Org Directory)
// -----------------------------------------------------------------------------

export type ContactCategory = "executive" | "state" | "leadership" | "working_team";

export interface AIEngagementContact {
  id: string;
  site_id: string;
  engagement_id: string;
  display_name: string;
  full_name: string | null;
  email: string | null;
  title: string;
  organization: string | null;
  category: ContactCategory;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const CONTACT_CATEGORY_LABELS: Record<ContactCategory, string> = {
  executive: "Executive Sponsors",
  state: "State / Client",
  leadership: "Engagement Leadership",
  working_team: "Working Team",
};

// -----------------------------------------------------------------------------
// Engagement Documents
// -----------------------------------------------------------------------------

export type DocumentCategory = "general" | "policy" | "framework" | "meeting_notes" | "playbook" | "reference";

export interface AIEngagementDocument {
  id: string;
  site_id: string;
  engagement_id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  storage_path: string;
  category: DocumentCategory;
  description: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  general: "General",
  policy: "Policy & Governance",
  framework: "Framework",
  meeting_notes: "Meeting Notes",
  playbook: "Playbook",
  reference: "Reference",
};

// =============================================================================
// Readiness Assessment Workflow
// =============================================================================

export type ReadinessAssessmentStatus = "draft" | "collecting" | "completed";
export type EntityType = "private" | "public_university" | "state_agency" | "federal_agency" | "municipality" | "regulated_entity";
export type CompanySize = "small" | "medium" | "large" | "enterprise";
export type TeamFunction = "development" | "qa" | "devops" | "data" | "mixed";
export type TeamMethodology = "scrum" | "kanban" | "safe" | "waterfall" | "other";
export type SeniorityLevel = "junior" | "mid" | "senior" | "lead" | "principal";
export type QuestionStatus = "draft" | "active" | "deprecated";
export type QuestionFlag = "unclear" | "not_applicable";
export type QuestionnaireStatus = "draft" | "ready" | "sent" | "closed";
export type ResponseStatus = "not_started" | "in_progress" | "completed";
export type DevRequestStatus = "pending" | "in_progress" | "completed";

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  private: "Private Company",
  public_university: "Public University",
  state_agency: "State Agency",
  federal_agency: "Federal Agency",
  municipality: "Municipality",
  regulated_entity: "Regulated Entity",
};

export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  small: "Small (1-50)",
  medium: "Medium (51-500)",
  large: "Large (501-5000)",
  enterprise: "Enterprise (5000+)",
};

export const TEAM_FUNCTION_LABELS: Record<TeamFunction, string> = {
  development: "Development",
  qa: "QA / Testing",
  devops: "DevOps / Infrastructure",
  data: "Data / Analytics",
  mixed: "Mixed / Cross-functional",
};

export const TEAM_METHODOLOGY_LABELS: Record<TeamMethodology, string> = {
  scrum: "Scrum",
  kanban: "Kanban",
  safe: "SAFe",
  waterfall: "Waterfall",
  other: "Other",
};

export const SENIORITY_LABELS: Record<SeniorityLevel, string> = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
  principal: "Principal / Staff",
};

export const READINESS_TIERS = [
  { label: "Not Ready", min: 0, max: 1.99, color: "red", description: "Critical gaps. Fix before training." },
  { label: "Foundation Needed", min: 2.0, max: 2.99, color: "amber", description: "Key gaps remain. Targeted fixes first." },
  { label: "Ready", min: 3.0, max: 3.99, color: "blue", description: "Adequate. Training should produce results." },
  { label: "Well Positioned", min: 4.0, max: 5.0, color: "emerald", description: "Strong foundations. AI will amplify." },
] as const;

// AI policy coverage areas
export const POLICY_COVERAGE_AREAS = [
  { key: "data_privacy", label: "Data Privacy & Confidentiality" },
  { key: "ip_ownership", label: "Code Ownership & IP" },
  { key: "approved_tools", label: "Approved AI Tools List" },
  { key: "prohibited_uses", label: "Prohibited Uses" },
  { key: "data_handling", label: "Data Handling & Storage" },
] as const;

// --- Interfaces ---

export interface ReadinessAssessment {
  id: string;
  site_id: string;
  name: string;
  engagement_id: string | null;
  prior_assessment_id: string | null;
  status: ReadinessAssessmentStatus;
  created_by: string;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentCompany {
  id: string;
  assessment_id: string;
  site_id: string;
  name: string;
  industry: string | null;
  entity_type: EntityType;
  state: string | null;
  size: CompanySize | null;
  sector_constraints: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentTeam {
  id: string;
  assessment_id: string;
  site_id: string;
  name: string;
  team_function: TeamFunction | null;
  methodology: TeamMethodology | null;
  size: number | null;
  objectives: string | null;
  pain_points: string | null;
  ai_hopes: string | null;
  created_at: string;
  updated_at: string;
}

export type MemberVendor = "krasan" | "csg" | "isi" | "state" | "other";
export type MemberAiTool = "copilot" | "rovo" | "d365_copilot" | "power_automate" | "confluence_ai" | "other" | null;
export type TrainingTrack = "foundation" | "ba_technical" | "configuration" | "developer" | "tester" | "scrum_master" | "leadership";
export type TrainingStatusValue = "pending" | "scheduled" | "completed";

export const VENDOR_LABELS: Record<MemberVendor, string> = {
  krasan: "Krasan",
  csg: "CSG",
  isi: "ISI",
  state: "State of Illinois",
  other: "Other",
};

export const AI_TOOL_LABELS: Record<string, string> = {
  copilot: "GitHub Copilot",
  rovo: "Atlassian Rovo",
  d365_copilot: "D365 Copilot",
  power_automate: "Power Automate Copilot",
  confluence_ai: "Confluence AI",
  other: "Other",
};

export const TRAINING_TRACK_LABELS: Record<TrainingTrack, string> = {
  foundation: "Foundation",
  ba_technical: "BA-Technical",
  configuration: "Configuration",
  developer: "Developer",
  tester: "Tester",
  scrum_master: "Scrum Master",
  leadership: "Leadership Briefing",
};

export const ROLE_TO_DEFAULT_TRACKS: Record<string, TrainingTrack[]> = {
  business_analyst: ["foundation", "ba_technical"],
  developer: ["foundation", "developer"],
  qa: ["foundation", "tester"],
  scrum_master: ["foundation", "scrum_master"],
  tech_lead: ["foundation", "developer", "scrum_master"],
  architect: ["foundation", "developer"],
  integration_tester: ["foundation", "tester"],
  performance_tester: ["foundation", "tester"],
  product_owner: ["foundation", "leadership"],
  engineering_manager: ["foundation", "leadership"],
  program_manager: ["foundation", "leadership"],
  project_manager: ["foundation", "leadership"],
  other: ["foundation"],
};

export const ROLE_TO_DEFAULT_AI_TOOL: Record<string, MemberAiTool> = {
  business_analyst: "rovo",
  developer: "copilot",
  qa: "copilot",
  scrum_master: "rovo",
  tech_lead: "copilot",
  architect: "copilot",
  integration_tester: "copilot",
  performance_tester: "copilot",
  product_owner: null,
  engineering_manager: null,
  program_manager: null,
  project_manager: null,
  other: null,
};

export interface AssessmentMember {
  id: string;
  team_id: string;
  site_id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  custom_role_label: string | null;
  seniority: SeniorityLevel | null;
  vendor: MemberVendor | null;
  in_pilot: boolean;
  ai_tool: MemberAiTool;
  created_at: string;
}

export interface TeamTrainingStatus {
  id: string;
  member_id: string;
  site_id: string;
  track_name: TrainingTrack;
  status: TrainingStatusValue;
  scheduled_date: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentPolicy {
  id: string;
  assessment_id: string;
  site_id: string;
  has_policy: boolean;
  policy_document_url: string | null;
  coverage: Record<string, boolean>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestionBankItem {
  id: string;
  site_id: string | null;
  category: string;
  capability: string | null;
  question_text: string;
  description: string | null;
  entity_types: string[];
  roles: string[];
  is_default: boolean;
  sort_order: number;
  version: number;
  status: QuestionStatus;
  parent_question_id: string | null;
  anonymous_aggregate: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestionDevelopmentRequest {
  id: string;
  site_id: string;
  custom_role_label: string;
  status: DevRequestStatus;
  requested_from_assessment_id: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface AssessmentQuestionnaire {
  id: string;
  assessment_id: string;
  site_id: string;
  status: QuestionnaireStatus;
  generated_at: string | null;
  customized: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireQuestion {
  id: string;
  questionnaire_id: string;
  question_id: string;
  question_version: number;
  sort_order: number;
  is_required: boolean;
  target_roles: string[];
}

export interface QuestionnaireResponse {
  id: string;
  questionnaire_id: string;
  member_id: string;
  token: string;
  status: ResponseStatus;
  started_at: string | null;
  completed_at: string | null;
}

export interface ResponseAnswer {
  id: string;
  response_id: string;
  question_id: string;
  score: number | null;
  comment: string | null;
  flag: QuestionFlag | null;
  answered_at: string | null;
}

export interface QuestionFeedbackStats {
  id: string;
  question_id: string;
  times_asked: number;
  avg_score: number | null;
  unclear_count: number;
  not_applicable_count: number;
  needs_review: boolean;
  last_computed_at: string | null;
}

// --- Input types ---

export interface CreateReadinessAssessmentInput {
  name: string;
  engagement_id?: string;
  prior_assessment_id?: string;
  deadline?: string;
}

export interface UpdateReadinessAssessmentInput {
  name?: string;
  status?: ReadinessAssessmentStatus;
  deadline?: string;
}

export interface UpsertAssessmentCompanyInput {
  name: string;
  industry?: string;
  entity_type: EntityType;
  state?: string;
  size?: CompanySize;
  sector_constraints?: Record<string, unknown>;
  notes?: string;
}

export interface UpsertAssessmentTeamInput {
  name: string;
  team_function?: TeamFunction;
  methodology?: TeamMethodology;
  size?: number;
  objectives?: string;
  pain_points?: string;
  ai_hopes?: string;
}

export interface CreateAssessmentMemberInput {
  name: string;
  email: string;
  role: TeamMemberRole;
  custom_role_label?: string;
  seniority?: SeniorityLevel;
  vendor?: MemberVendor;
  in_pilot?: boolean;
  ai_tool?: MemberAiTool;
}

export interface UpdateMemberPilotInput {
  vendor?: MemberVendor;
  in_pilot?: boolean;
  ai_tool?: MemberAiTool;
}

export interface CreateTrainingStatusInput {
  track_name: TrainingTrack;
  status?: TrainingStatusValue;
  scheduled_date?: string;
}

export interface UpdateTrainingStatusInput {
  status: TrainingStatusValue;
  scheduled_date?: string;
  completed_date?: string;
}

export interface UpsertAssessmentPolicyInput {
  has_policy: boolean;
  policy_document_url?: string;
  coverage?: Record<string, boolean>;
  notes?: string;
}

export interface CreateQuestionInput {
  category: string;
  capability?: string;
  question_text: string;
  description?: string;
  entity_types?: string[];
  roles?: string[];
  sort_order?: number;
}

export interface SubmitAnswerInput {
  question_id: string;
  score?: number;
  comment?: string;
  flag?: QuestionFlag;
}
