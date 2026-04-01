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

export type TeamMemberRole = "developer" | "qa" | "scrum_master" | "product_owner" | "devops" | "designer";

export type AssessmentType = "readiness" | "baseline" | "post_training";

export type AssessmentStatus = "draft" | "collecting" | "completed";

export type DataSource = "integration" | "manual";

export type MetricCategory = "dora" | "space" | "devex" | "scrum" | "readiness";

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
];
