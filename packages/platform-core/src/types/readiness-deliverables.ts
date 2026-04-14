// =============================================================================
// Readiness Deliverables — Types & Constants
//
// Assessment scope, constraints, SDLC analysis, AI enhancement catalog,
// use case prioritization, risk register, pilots, version stamps.
// =============================================================================

// ── Assessment Pillars ────────────────────────────────────────────────

export type AssessmentPillar =
  | "development" | "testing" | "documentation" | "pmo"
  | "ba" | "devops" | "data" | "security" | "design";

export const ASSESSMENT_PILLAR_LABELS: Record<AssessmentPillar, { label: string; description: string; examples: string }> = {
  development: { label: "Development Process", description: "Coding, code review, branching, PR workflow, technical debt", examples: "Copilot code suggestions, PR review automation" },
  testing: { label: "Testing & Quality", description: "Test automation, coverage, regression, defect management", examples: "AI test generation, regression prioritization" },
  documentation: { label: "Documentation", description: "Technical docs, runbooks, knowledge base, API docs", examples: "AI doc generation, changelog automation" },
  pmo: { label: "PMO & Reporting", description: "Sprint planning, velocity tracking, status reports, retros", examples: "Jira AI sprint analytics, report generation" },
  ba: { label: "BA & Requirements", description: "Story writing, acceptance criteria, process modeling", examples: "AI story refinement, requirements extraction" },
  devops: { label: "DevOps & Infrastructure", description: "CI/CD, deployments, monitoring, environments, IaC", examples: "IaC generation, incident root cause analysis" },
  data: { label: "Data & Analytics", description: "Data pipelines, data quality, reporting, BI, governance", examples: "SQL optimization, data quality detection" },
  security: { label: "Security & Compliance", description: "Security reviews, vulnerability scanning, compliance", examples: "Vulnerability detection, threat modeling" },
  design: { label: "Design & UX", description: "Prototyping, user research, accessibility, design systems", examples: "Design-to-code, accessibility audit" },
};

// ── Pillar → SDLC Phase Mapping ───────────────────────────────────────

export const PILLAR_PHASE_MAPPING: Record<AssessmentPillar, { name: string; description: string }[]> = {
  pmo: [
    { name: "Sprint Planning", description: "Capacity planning, sprint goal setting, work selection" },
    { name: "Sprint Retrospective", description: "Team reflection, action items, process improvement" },
    { name: "Status Reporting", description: "Progress updates, metrics dashboards, stakeholder communication" },
  ],
  ba: [
    { name: "Backlog Grooming", description: "Story refinement, estimation, acceptance criteria" },
    { name: "Requirements Analysis", description: "Stakeholder interviews, requirements documentation, gap analysis" },
  ],
  development: [
    { name: "Development", description: "Feature implementation, coding, debugging" },
    { name: "Code Review", description: "PR reviews, code quality checks, knowledge sharing" },
  ],
  testing: [
    { name: "Testing", description: "Unit testing, integration testing, QA validation" },
    { name: "Regression Testing", description: "Regression suite execution, test maintenance" },
  ],
  documentation: [
    { name: "Documentation", description: "Technical docs, API docs, knowledge base updates" },
  ],
  devops: [
    { name: "Deployment", description: "Build, deploy, release management" },
    { name: "Infrastructure", description: "Environment management, monitoring, IaC" },
  ],
  data: [
    { name: "Data Pipeline", description: "ETL processes, data transformation, data loading" },
    { name: "Data Quality", description: "Data validation, quality monitoring, governance" },
  ],
  security: [
    { name: "Security Review", description: "Code security scanning, dependency audit, threat assessment" },
  ],
  design: [
    { name: "Design", description: "UI/UX design, prototyping, design review" },
  ],
};

// ── Constraint Categories ─────────────────────────────────────────────

export type ConstraintCategory = "technology" | "ai_tools" | "process" | "data_privacy" | "policy_compliance" | "budget_resources";
export type ConstraintSeverity = "hard" | "soft";

export const CONSTRAINT_CATEGORY_LABELS: Record<ConstraintCategory, { label: string; description: string; examples: string[] }> = {
  technology: { label: "Technology", description: "Infrastructure and platform limitations", examples: ["On-prem only, no cloud AI", "Must use Azure stack", "No GPU infrastructure"] },
  ai_tools: { label: "AI Tools", description: "Approved and prohibited AI tools", examples: ["Only Copilot and Jira AI approved", "No open-source LLMs", "Must go through procurement"] },
  process: { label: "Process", description: "Workflow and development process restrictions", examples: ["AI cannot write production code", "All AI output must be human-reviewed", "No autonomous deployments"] },
  data_privacy: { label: "Data & Privacy", description: "Data handling and privacy rules", examples: ["No PII in AI prompts", "Data cannot leave US region", "HIPAA applies"] },
  policy_compliance: { label: "Policy & Compliance", description: "Regulatory and legal constraints", examples: ["State procurement rules", "FOIA applies to AI content", "Union agreement restricts automation"] },
  budget_resources: { label: "Budget & Resources", description: "Budget and capacity constraints", examples: ["No additional tool budget this FY", "2 hours/week max for AI training", "No dedicated AI team"] },
};

// ── Pre-seeded Constraints by Entity Type ──────────────────────────────

export const CONSTRAINT_TEMPLATES: Record<string, { description: string; category: ConstraintCategory; severity: ConstraintSeverity }[]> = {
  state_agency: [
    { description: "State procurement rules apply to all AI tool purchases", category: "policy_compliance", severity: "hard" },
    { description: "FOIA may apply to AI-generated content and prompts", category: "policy_compliance", severity: "hard" },
    { description: "Data must remain within state-approved infrastructure", category: "data_privacy", severity: "hard" },
    { description: "Budget cycles may delay new tool acquisition", category: "budget_resources", severity: "soft" },
  ],
  federal_agency: [
    { description: "FedRAMP compliance required for all cloud AI tools", category: "technology", severity: "hard" },
    { description: "FISMA security controls apply to AI systems", category: "policy_compliance", severity: "hard" },
    { description: "Data sovereignty — no data outside US borders", category: "data_privacy", severity: "hard" },
  ],
  public_university: [
    { description: "FERPA applies to any AI processing student data", category: "data_privacy", severity: "hard" },
    { description: "Academic freedom policies may affect AI tool mandates", category: "policy_compliance", severity: "soft" },
  ],
  regulated_entity: [
    { description: "Industry-specific compliance requirements apply (HIPAA, SOX, etc.)", category: "policy_compliance", severity: "hard" },
    { description: "Audit trail required for AI-assisted decisions", category: "process", severity: "hard" },
  ],
  private: [],
  municipality: [
    { description: "Public records laws may apply to AI-generated content", category: "policy_compliance", severity: "hard" },
    { description: "Municipal procurement process required for new tools", category: "budget_resources", severity: "soft" },
  ],
};

// ── Use Case Quadrants & Investment Tiers ──────────────────────────────

export type UseCaseQuadrant = "quick_win" | "strategic_bet" | "fill_in" | "avoid";
export type InvestmentTier = "tier1" | "tier2" | "tier3" | "tier4";
export type ImprovementType = "time_savings" | "quality" | "automation" | "insight";

export function computeQuadrant(impact: number, effort: number): UseCaseQuadrant {
  if (impact >= 3 && effort <= 3) return "quick_win";
  if (impact >= 3 && effort > 3) return "strategic_bet";
  if (impact < 3 && effort <= 3) return "fill_in";
  return "avoid";
}

export function computeInvestmentTier(timelineMonths: number): InvestmentTier {
  if (timelineMonths <= 3) return "tier1";
  if (timelineMonths <= 6) return "tier2";
  if (timelineMonths <= 12) return "tier3";
  return "tier4";
}

export const USE_CASE_QUADRANT_LABELS: Record<UseCaseQuadrant, { label: string; color: string; description: string }> = {
  quick_win: { label: "Quick Win", color: "emerald", description: "High impact, low effort — do these first" },
  strategic_bet: { label: "Strategic Bet", color: "blue", description: "High impact, high effort — plan carefully" },
  fill_in: { label: "Fill-In", color: "gray", description: "Low impact, low effort — do if time permits" },
  avoid: { label: "Avoid", color: "red", description: "Low impact, high effort — not worth the investment" },
};

export const INVESTMENT_TIER_LABELS: Record<InvestmentTier, { label: string; timeframe: string; description: string }> = {
  tier1: { label: "Tier 1 — Quick Wins", timeframe: "0-3 months", description: "High impact, low effort. Start here." },
  tier2: { label: "Tier 2 — Foundation", timeframe: "3-6 months", description: "Medium effort items that build capability." },
  tier3: { label: "Tier 3 — Strategic", timeframe: "6-12 months", description: "High impact but significant investment." },
  tier4: { label: "Tier 4 — Future State", timeframe: "12+ months", description: "Aspirational, depends on maturity." },
};

export const IMPROVEMENT_TYPE_LABELS: Record<ImprovementType, string> = {
  time_savings: "Time Savings",
  quality: "Quality Improvement",
  automation: "Automation",
  insight: "Better Insights",
};

// ── Risk Register ─────────────────────────────────────────────────────

export type RiskCategory = "technical" | "organizational" | "regulatory" | "ethical";

export const RISK_CATEGORY_LABELS: Record<RiskCategory, string> = {
  technical: "Technical",
  organizational: "Organizational",
  regulatory: "Regulatory",
  ethical: "Ethical",
};

export function computeRiskScore(likelihood: number, impact: number): number {
  return likelihood * impact;
}

export function getRiskColor(score: number): string {
  if (score >= 15) return "red";
  if (score >= 8) return "amber";
  return "green";
}

export const RISK_TEMPLATES: Record<string, { description: string; category: RiskCategory; likelihood: number; impact: number; mitigation: string }[]> = {
  state_agency: [
    { description: "Shadow AI usage — staff using unapproved AI tools", category: "organizational", likelihood: 4, impact: 3, mitigation: "Clear approved tools list, training, monitoring" },
    { description: "AI-generated code IP ownership uncertainty", category: "regulatory", likelihood: 3, impact: 4, mitigation: "Legal review of AI tool ToS, clear IP policy" },
    { description: "Data sovereignty violation via cloud AI tools", category: "regulatory", likelihood: 2, impact: 5, mitigation: "Use only approved on-prem or FedRAMP tools" },
    { description: "Public records exposure from AI prompt logs", category: "regulatory", likelihood: 3, impact: 4, mitigation: "Disable prompt logging, review FOIA implications" },
  ],
  regulated_entity: [
    { description: "HIPAA violation from PII in AI prompts", category: "regulatory", likelihood: 3, impact: 5, mitigation: "PII detection guardrails, approved tool list, training" },
    { description: "Algorithmic bias in AI-assisted decisions", category: "ethical", likelihood: 3, impact: 4, mitigation: "Human review requirement, bias testing" },
  ],
  private: [
    { description: "Over-reliance on AI reducing team skills", category: "organizational", likelihood: 3, impact: 3, mitigation: "Balanced training, human review requirements" },
    { description: "Data leakage via AI tool APIs", category: "technical", likelihood: 3, impact: 4, mitigation: "Data classification, approved tool restrictions" },
  ],
  public_university: [
    { description: "FERPA violation from student data in AI prompts", category: "regulatory", likelihood: 3, impact: 5, mitigation: "No student PII in AI tools, training" },
  ],
  federal_agency: [
    { description: "FedRAMP compliance gap with AI tools", category: "regulatory", likelihood: 3, impact: 5, mitigation: "Only use FedRAMP-authorized tools" },
  ],
  municipality: [
    { description: "Public records request for AI-generated artifacts", category: "regulatory", likelihood: 3, impact: 3, mitigation: "Document AI usage, retention policy" },
  ],
};

// ── Data Readiness ────────────────────────────────────────────────────

export const DATA_READINESS_DIMENSIONS = [
  { key: "data_quality", label: "Data Quality", rubric_low: "No formal data quality process, frequent errors", rubric_high: "Automated quality checks, monitored, near-zero errors" },
  { key: "data_accessibility", label: "Data Accessibility", rubric_low: "Data siloed, manual requests needed", rubric_high: "Self-service access, well-documented APIs, real-time" },
  { key: "data_governance", label: "Data Governance", rubric_low: "No ownership, no catalog, no retention policy", rubric_high: "Clear ownership, cataloged, lineage tracked, retention enforced" },
  { key: "data_pipelines", label: "Data Pipelines", rubric_low: "Manual ETL, batch only, no monitoring", rubric_high: "Automated pipelines, near-real-time, monitored, self-healing" },
  { key: "data_security", label: "Data Security", rubric_low: "No encryption, shared credentials, no audit trail", rubric_high: "Encrypted at rest/transit, RBAC, full audit trail" },
] as const;

// ── Enhancement Status ────────────────────────────────────────────────

export type EnhancementStatus = "in_use" | "opportunity" | "blocked" | "not_applicable" | "not_evaluated";

export const ENHANCEMENT_STATUS_LABELS: Record<EnhancementStatus, { label: string; color: string; description: string }> = {
  in_use: { label: "Already In Use", color: "emerald", description: "Team actively uses this AI capability today" },
  opportunity: { label: "New Opportunity", color: "blue", description: "Feasible within constraints, not yet adopted" },
  blocked: { label: "Blocked", color: "red", description: "Would help but violates a hard constraint" },
  not_applicable: { label: "Not Applicable", color: "gray", description: "Doesn't apply to this team or project" },
  not_evaluated: { label: "Not Evaluated", color: "amber", description: "Assessment gap — needs review" },
};

// ── Interfaces ────────────────────────────────────────────────────────

export interface CatalogVersionRecord {
  id: string;
  version_number: number;
  release_date: string;
  release_notes: string | null;
  item_count: number;
  created_by: string | null;
  created_at: string;
}

export interface AIEnhancementCatalogItem {
  id: string;
  pillar: AssessmentPillar;
  name: string;
  description: string | null;
  example_tools: string | null;
  version: number;
  status: string;
  parent_item_id: string | null;
  catalog_version_id: string | null;
  created_at: string;
}

export interface AssessmentEnhancementStatusRecord {
  id: string;
  assessment_id: string;
  site_id: string;
  catalog_item_id: string;
  catalog_version: number;
  status: EnhancementStatus;
  tool_used: string | null;
  blocking_constraint_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentVersionStampRecord {
  id: string;
  assessment_id: string;
  site_id: string;
  source_type: string;
  source_version: number;
  source_date: string | null;
  created_at: string;
}

export interface AssessmentScopeRecord {
  id: string;
  assessment_id: string;
  site_id: string;
  pillar: AssessmentPillar;
  in_scope: boolean;
  created_at: string;
}

export interface AssessmentConstraintRecord {
  id: string;
  assessment_id: string;
  site_id: string;
  description: string;
  category: ConstraintCategory;
  severity: ConstraintSeverity;
  source: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
}

export interface ApprovedToolRecord {
  id: string;
  assessment_id: string;
  site_id: string;
  tool_name: string;
  vendor: string | null;
  capabilities: string | null;
  restrictions: string | null;
  created_at: string;
}

export interface WorkflowPhaseRecord {
  id: string;
  assessment_id: string;
  site_id: string;
  name: string;
  description: string | null;
  pillar: string | null;
  roles_involved: string[];
  current_tools: string[];
  time_spent_hours: number | null;
  pain_points: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AIOpportunityRecord {
  id: string;
  phase_id: string;
  assessment_id: string;
  site_id: string;
  description: string;
  approved_tool: string | null;
  expected_improvement: string | null;
  improvement_type: ImprovementType | null;
  improvement_pct: number | null;
  constraint_compliant: boolean;
  is_current_strength: boolean;
  sort_order: number;
  created_at: string;
}

export interface DataReadinessRecord {
  id: string;
  assessment_id: string;
  site_id: string;
  data_quality: number | null;
  data_accessibility: number | null;
  data_governance: number | null;
  data_pipelines: number | null;
  data_security: number | null;
  evidence_notes: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface UseCaseRecord {
  id: string;
  assessment_id: string;
  site_id: string;
  title: string;
  description: string | null;
  pillar: string | null;
  affected_roles: string[];
  impact_score: number | null;
  effort_score: number | null;
  quadrant: UseCaseQuadrant | null;
  timeline_months: number | null;
  required_tools: string | null;
  prerequisites: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RiskRecord {
  id: string;
  assessment_id: string;
  site_id: string;
  description: string;
  category: RiskCategory;
  likelihood: number | null;
  impact_score: number | null;
  risk_score: number | null;
  mitigation: string | null;
  owner: string | null;
  is_preseeded: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PilotRecord {
  id: string;
  assessment_id: string;
  site_id: string;
  use_case_id: string | null;
  title: string;
  scope_description: string | null;
  success_criteria: string | null;
  timeline: string | null;
  team_roles: string[];
  tools_needed: string | null;
  estimated_cost: string | null;
  go_nogo_criteria: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ── Input Types ───────────────────────────────────────────────────────

export interface SetScopeInput {
  pillars: { pillar: AssessmentPillar; in_scope: boolean }[];
}

export interface CreateConstraintInput {
  description: string;
  category: ConstraintCategory;
  severity: ConstraintSeverity;
  source?: string;
  notes?: string;
}

export interface CreateApprovedToolInput {
  tool_name: string;
  vendor?: string;
  capabilities?: string;
  restrictions?: string;
}

export interface CreateWorkflowPhaseInput {
  name: string;
  description?: string;
  pillar?: string;
  roles_involved?: string[];
  current_tools?: string[];
  time_spent_hours?: number;
  pain_points?: string;
}

export interface CreateAIOpportunityInput {
  phase_id: string;
  description: string;
  approved_tool?: string;
  expected_improvement?: string;
  improvement_type?: ImprovementType;
  improvement_pct?: number;
  constraint_compliant?: boolean;
  is_current_strength?: boolean;
}

export interface UpsertDataReadinessInput {
  data_quality?: number;
  data_accessibility?: number;
  data_governance?: number;
  data_pipelines?: number;
  data_security?: number;
  evidence_notes?: Record<string, string>;
}

export interface CreateUseCaseInput {
  title: string;
  description?: string;
  pillar?: string;
  affected_roles?: string[];
  impact_score?: number;
  effort_score?: number;
  timeline_months?: number;
  required_tools?: string;
  prerequisites?: string;
}

export interface CreateRiskInput {
  description: string;
  category: RiskCategory;
  likelihood?: number;
  impact_score?: number;
  mitigation?: string;
  owner?: string;
}

export interface CreatePilotInput {
  use_case_id?: string;
  title: string;
  scope_description?: string;
  success_criteria?: string;
  timeline?: string;
  team_roles?: string[];
  tools_needed?: string;
  estimated_cost?: string;
  go_nogo_criteria?: string;
}

// ── Coverage Stats ────────────────────────────────────────────────────

export interface EnhancementCoverageStats {
  total: number;
  evaluated: number;
  coverage_pct: number;
  by_status: Record<EnhancementStatus, number>;
  by_pillar: Record<string, { total: number; evaluated: number; coverage_pct: number }>;
}
