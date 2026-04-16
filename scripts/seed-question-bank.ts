/**
 * Seed the question bank v1 with default readiness assessment questions.
 *
 * Categories:
 *   - dora_capability: 7 DORA capabilities (universal — all roles)
 *   - ai_policy: 4 AI policy/governance areas (universal — all roles)
 *   - role_specific: role-targeted questions
 *   - workflow: team methodology / workflow questions
 *
 * Usage: SITE_ID=ussp npx tsx scripts/seed-question-bank.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SeedQuestion {
  category: string;
  capability?: string;
  question_text: string;
  description?: string;
  entity_types: string[];  // empty = applies to all
  roles: string[];          // empty = universal (all roles)
  sort_order: number;
}

// ── Universal: DORA Capabilities (all roles) ────────────────────────────
const doraQuestions: SeedQuestion[] = [
  { category: "dora_capability", capability: "ai_accessible_data", question_text: "Can your AI tools access internal documentation, codebases, and knowledge bases?", description: "AI is connected to internal docs, code, and knowledge bases — not just generic public data.", entity_types: [], roles: [], sort_order: 1 },
  { category: "dora_capability", capability: "ai_stance_clarity", question_text: "Does your organization have a clear, communicated policy on AI use?", description: "The organization has an explicit, communicated policy on how AI should and shouldn't be used.", entity_types: [], roles: [], sort_order: 2 },
  { category: "dora_capability", capability: "healthy_data_ecosystem", question_text: "Is your internal data high-quality, accessible, and well-organized?", description: "Internal data is high-quality, accessible, searchable, and unified across systems.", entity_types: [], roles: [], sort_order: 3 },
  { category: "dora_capability", capability: "platform_engineering", question_text: "Do your internal platforms support automated, secure workflows?", description: "Internal platforms provide automated, secure pathways that allow AI benefits to scale.", entity_types: [], roles: [], sort_order: 4 },
  { category: "dora_capability", capability: "user_centric_focus", question_text: "Do teams focus on user outcomes, not just velocity?", description: "Teams prioritize building the right things for users, not just building faster.", entity_types: [], roles: [], sort_order: 5 },
  { category: "dora_capability", capability: "version_control_maturity", question_text: "Does the team use mature branching, review, and version control practices?", description: "Mature version control practices act as a safety net for AI-accelerated change.", entity_types: [], roles: [], sort_order: 6 },
  { category: "dora_capability", capability: "small_batches", question_text: "Does the team deliver work in small, frequent increments?", description: "Teams deliver in small increments to manage the risk and velocity that AI introduces.", entity_types: [], roles: [], sort_order: 7 },
];

// ── Universal: AI Policy (all roles) ────────────────────────────────────
const policyQuestions: SeedQuestion[] = [
  { category: "ai_policy", capability: "ai_policy_exists", question_text: "Does your organization have a written AI usage policy that has been communicated to employees?", description: "Score 1 = no policy, 5 = comprehensive policy actively enforced.", entity_types: [], roles: [], sort_order: 10 },
  { category: "ai_policy", capability: "ai_policy_coverage", question_text: "Does the AI policy cover data privacy, IP ownership, approved tools, prohibited uses, and data handling?", description: "Score 1 = no coverage, 5 = all areas comprehensively addressed.", entity_types: [], roles: [], sort_order: 11 },
  { category: "ai_policy", capability: "regulatory_awareness", question_text: "Is the team aware of applicable state and federal AI regulations?", description: "Score 1 = no awareness, 5 = team trained on applicable regulations.", entity_types: [], roles: [], sort_order: 12 },
  { category: "ai_policy", capability: "ai_governance", question_text: "Is there an AI governance committee or formal review process for AI tool adoption?", description: "Score 1 = no governance, 5 = formal committee with review process.", entity_types: [], roles: [], sort_order: 13 },
];

// ── Role-specific questions ─────────────────────────────────────────────
const roleQuestions: SeedQuestion[] = [
  // Developer
  { category: "role_specific", capability: "ai_coding_tools", question_text: "How frequently do you use AI coding assistants (e.g., Copilot, Cursor) in your daily work?", roles: ["developer", "tech_lead"], entity_types: [], sort_order: 20 },
  { category: "role_specific", capability: "ai_coding_tools", question_text: "How confident are you in reviewing and validating AI-generated code before committing?", roles: ["developer", "tech_lead"], entity_types: [], sort_order: 21 },
  { category: "role_specific", capability: "code_review", question_text: "Does your team use AI-assisted code review tools?", roles: ["developer", "tech_lead", "architect"], entity_types: [], sort_order: 22 },
  { category: "role_specific", capability: "version_control", question_text: "How mature is your team's branching and PR review process?", roles: ["developer", "tech_lead"], entity_types: [], sort_order: 23 },
  { category: "role_specific", capability: "technical_debt", question_text: "Does your team systematically track and address technical debt?", roles: ["developer", "tech_lead", "architect"], entity_types: [], sort_order: 24 },

  // QA / Tester
  { category: "role_specific", capability: "test_automation", question_text: "What percentage of your test suite is automated?", roles: ["qa", "integration_tester", "performance_tester"], entity_types: [], sort_order: 30 },
  { category: "role_specific", capability: "test_automation", question_text: "Have you used AI to generate or maintain test cases?", roles: ["qa", "integration_tester"], entity_types: [], sort_order: 31 },
  { category: "role_specific", capability: "regression_testing", question_text: "How do you currently prioritize regression test cases after code changes?", roles: ["qa", "integration_tester"], entity_types: [], sort_order: 32 },
  { category: "role_specific", capability: "bug_analysis", question_text: "Do you use any AI-assisted tools for bug triage or duplicate detection?", roles: ["qa", "integration_tester", "developer"], entity_types: [], sort_order: 33 },

  // Business Analyst
  { category: "role_specific", capability: "requirements_gathering", question_text: "How do you currently document requirements from stakeholder meetings?", roles: ["business_analyst"], entity_types: [], sort_order: 40 },
  { category: "role_specific", capability: "requirements_gathering", question_text: "Have you used AI to help draft or refine user stories and acceptance criteria?", roles: ["business_analyst", "product_owner"], entity_types: [], sort_order: 41 },
  { category: "role_specific", capability: "process_modeling", question_text: "Do you use AI tools to create or validate process flows and business rules?", roles: ["business_analyst"], entity_types: [], sort_order: 42 },
  { category: "role_specific", capability: "stakeholder_analysis", question_text: "How do you analyze and prioritize stakeholder needs today?", roles: ["business_analyst"], entity_types: [], sort_order: 43 },

  // Scrum Master
  { category: "role_specific", capability: "sprint_analytics", question_text: "Do you use data analytics to identify sprint bottlenecks and velocity trends?", roles: ["scrum_master"], entity_types: [], sort_order: 50 },
  { category: "role_specific", capability: "retrospective_facilitation", question_text: "How do you currently facilitate retrospectives and track action items?", roles: ["scrum_master"], entity_types: [], sort_order: 51 },
  { category: "role_specific", capability: "velocity_prediction", question_text: "Do you use any predictive tools to forecast sprint capacity?", roles: ["scrum_master", "product_owner"], entity_types: [], sort_order: 52 },

  // Product Owner
  { category: "role_specific", capability: "backlog_management", question_text: "How do you currently prioritize and groom the product backlog?", roles: ["product_owner"], entity_types: [], sort_order: 60 },
  { category: "role_specific", capability: "story_refinement", question_text: "Have you used AI to generate user stories or identify missing edge cases?", roles: ["product_owner", "business_analyst"], entity_types: [], sort_order: 61 },
  { category: "role_specific", capability: "stakeholder_reporting", question_text: "How do you generate progress reports for stakeholders?", roles: ["product_owner", "program_manager", "project_manager"], entity_types: [], sort_order: 62 },

  // DevOps
  { category: "role_specific", capability: "infrastructure_automation", question_text: "What percentage of your infrastructure is managed as code (IaC)?", roles: ["devops", "system_admin"], entity_types: [], sort_order: 70 },
  { category: "role_specific", capability: "pipeline_optimization", question_text: "Have you used AI to optimize CI/CD pipeline performance?", roles: ["devops", "release_manager"], entity_types: [], sort_order: 71 },
  { category: "role_specific", capability: "incident_response", question_text: "Do you use AI for log analysis or automated incident triage?", roles: ["devops", "system_admin", "support_engineer"], entity_types: [], sort_order: 72 },

  // Architect
  { category: "role_specific", capability: "architecture_review", question_text: "Do you use AI tools to review architecture decisions or identify design patterns?", roles: ["architect", "tech_lead"], entity_types: [], sort_order: 80 },
  { category: "role_specific", capability: "technology_evaluation", question_text: "How do you evaluate new technologies and frameworks for your stack?", roles: ["architect"], entity_types: [], sort_order: 81 },

  // Manager roles
  { category: "role_specific", capability: "governance", question_text: "How does your organization evaluate and approve new AI tools for team use?", roles: ["engineering_manager", "program_manager", "project_manager"], entity_types: [], sort_order: 90 },
  { category: "role_specific", capability: "change_management", question_text: "What is your approach to managing the change impact of AI tool adoption?", roles: ["engineering_manager", "program_manager", "project_manager"], entity_types: [], sort_order: 91 },
  { category: "role_specific", capability: "team_adoption", question_text: "How ready is your team to adopt AI tools in their daily workflow?", roles: ["engineering_manager"], entity_types: [], sort_order: 92 },
  { category: "role_specific", capability: "risk_assessment", question_text: "Have you assessed the risks of AI adoption (data leakage, over-reliance, skill atrophy)?", roles: ["engineering_manager", "program_manager", "security_engineer"], entity_types: [], sort_order: 93 },

  // Data roles
  { category: "role_specific", capability: "data_analysis", question_text: "Do you use AI for exploratory data analysis or pattern detection?", roles: ["data_analyst", "data_engineer"], entity_types: [], sort_order: 100 },
  { category: "role_specific", capability: "data_quality", question_text: "How do you ensure data quality and integrity in your pipelines?", roles: ["data_engineer", "database_admin"], entity_types: [], sort_order: 101 },

  // Security
  { category: "role_specific", capability: "security_review", question_text: "Do you use AI to identify security vulnerabilities or review configurations?", roles: ["security_engineer"], entity_types: [], sort_order: 110 },
  { category: "role_specific", capability: "compliance_automation", question_text: "Have you explored AI for compliance reporting or audit automation?", roles: ["security_engineer"], entity_types: [], sort_order: 111 },

  // Support / Docs
  { category: "role_specific", capability: "knowledge_management", question_text: "Do you use AI to create or maintain technical documentation?", roles: ["technical_writer", "support_engineer"], entity_types: [], sort_order: 120 },
  { category: "role_specific", capability: "documentation", question_text: "How current is your team's technical documentation?", roles: ["technical_writer"], entity_types: [], sort_order: 121 },

  // Designer / UX
  { category: "role_specific", capability: "design_workflows", question_text: "Do you use AI for prototyping, wireframing, or design exploration?", roles: ["designer", "ux_researcher"], entity_types: [], sort_order: 130 },
  { category: "role_specific", capability: "accessibility", question_text: "Do you use AI to audit accessibility compliance?", roles: ["designer", "ux_researcher", "developer"], entity_types: [], sort_order: 131 },
  { category: "role_specific", capability: "user_research", question_text: "Have you used AI to analyze user interview transcripts or synthesize research findings?", roles: ["ux_researcher"], entity_types: [], sort_order: 132 },

  // Performance tester specific
  { category: "role_specific", capability: "performance_analysis", question_text: "Do you use AI to design load test scenarios or analyze performance bottlenecks?", roles: ["performance_tester"], entity_types: [], sort_order: 140 },

  // Release manager specific
  { category: "role_specific", capability: "release_planning", question_text: "Do you use AI for release scheduling, dependency analysis, or rollback planning?", roles: ["release_manager"], entity_types: [], sort_order: 150 },
];

// ── Entity-type-specific questions ──────────────────────────────────────
const entityQuestions: SeedQuestion[] = [
  { category: "ai_policy", capability: "regulatory_awareness", question_text: "Is your team aware of state procurement rules regarding AI tool usage in government contracts?", entity_types: ["state_agency", "municipality"], roles: [], sort_order: 200 },
  { category: "ai_policy", capability: "regulatory_awareness", question_text: "Does your organization comply with FERPA requirements when using AI with student data?", entity_types: ["public_university"], roles: [], sort_order: 201 },
  { category: "ai_policy", capability: "regulatory_awareness", question_text: "Is your AI usage compliant with HIPAA requirements for protected health information?", entity_types: ["regulated_entity"], roles: [], sort_order: 202 },
  { category: "ai_policy", capability: "ai_governance", question_text: "Does your agency have an AI governance executive order or directive in effect?", entity_types: ["state_agency", "federal_agency"], roles: [], sort_order: 203 },
  { category: "ai_policy", capability: "ai_policy_coverage", question_text: "Does your AI policy address public records and FOIA implications of AI-generated content?", entity_types: ["state_agency", "federal_agency", "municipality"], roles: [], sort_order: 204 },
  { category: "ai_policy", capability: "ai_policy_coverage", question_text: "Does your AI policy address data sovereignty requirements for government systems?", entity_types: ["state_agency", "federal_agency"], roles: [], sort_order: 205 },
];

// ── Workflow questions (team methodology specific) ──────────────────────
const workflowQuestions: SeedQuestion[] = [
  { category: "workflow", capability: "small_batches", question_text: "What is your average sprint length and how often do you release to production?", roles: [], entity_types: [], sort_order: 300 },
  { category: "workflow", capability: "small_batches", question_text: "Does your team practice continuous integration with automated builds?", roles: [], entity_types: [], sort_order: 301 },
  { category: "workflow", capability: "platform_engineering", question_text: "Does your team have self-service environments for development and testing?", roles: [], entity_types: [], sort_order: 302 },
];

async function seed() {
  const allQuestions = [
    ...doraQuestions,
    ...policyQuestions,
    ...roleQuestions,
    ...entityQuestions,
    ...workflowQuestions,
  ];

  console.log(`Seeding ${allQuestions.length} questions into question_bank...`);

  // Check if questions already exist
  const { count } = await supabase
    .from("question_bank")
    .select("*", { count: "exact", head: true })
    .eq("is_default", true);

  if (count && count > 0) {
    console.log(`Found ${count} existing default questions. Skipping seed.`);
    console.log("To re-seed, delete existing default questions first.");
    return;
  }

  const rows = allQuestions.map((q) => ({
    site_id: null, // global defaults
    category: q.category,
    capability: q.capability || null,
    question_text: q.question_text,
    description: q.description || null,
    entity_types: q.entity_types,
    roles: q.roles,
    is_default: true,
    sort_order: q.sort_order,
    version: 1,
    status: "active",
    parent_question_id: null,
    created_by: "system_seed_v1",
  }));

  const { error } = await supabase.from("question_bank").insert(rows);

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${allQuestions.length} questions (v1).`);
}

seed();
