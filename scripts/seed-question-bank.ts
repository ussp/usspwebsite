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
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.log("No .env.local found, using existing environment variables");
}

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
  anonymous_aggregate?: boolean;  // true = reports show aggregate only, no per-member/per-role attribution
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

// ── Workflow pain points (universal — captures current-state bottlenecks) ─────
// Scale: 1 = minimal / not a problem, 5 = significant / painful. Comment captures specifics.
const painPointQuestions: SeedQuestion[] = [
  { category: "workflow_pain_points", capability: "time_sinks", question_text: "How much of your week is spent on repetitive or tedious tasks? (1 = <1 hr, 5 = 10+ hrs)", description: "In the comment, list the 2-3 biggest time sinks in your current workflow.", roles: [], entity_types: [], sort_order: 400 },
  { category: "workflow_pain_points", capability: "context_switching", question_text: "How disruptive is context switching or tool hopping in your day? (1 = minimal, 5 = constant disruption)", description: "In the comment, name the tools or handoffs that cause the most friction.", roles: [], entity_types: [], sort_order: 401 },
  { category: "workflow_pain_points", capability: "avoided_tasks", question_text: "How often do you defer or avoid tasks because they feel tedious? (1 = rarely, 5 = frequently)", description: "In the comment, list the tasks you avoid or postpone.", roles: [], entity_types: [], sort_order: 402 },
  { category: "workflow_pain_points", capability: "rework", question_text: "How often does your work require rework due to unclear requirements, missing context, or review feedback? (1 = rarely, 5 = most stories)", description: "In the comment, describe where rework most commonly originates.", roles: [], entity_types: [], sort_order: 403 },
];

// ── AI aspirations (universal + role-tailored — where could AI help?) ────────
// Scale: 1 = no help / not useful, 5 = major help / transformational. Comment is the key signal.
const aspirationQuestions: SeedQuestion[] = [
  // Universal
  { category: "ai_aspirations", capability: "ai_help_general", question_text: "If AI could take one task off your plate tomorrow, how much would that improve your week? (1 = minor, 5 = transformational)", description: "In the comment, describe the single task you would hand to AI first.", roles: [], entity_types: [], sort_order: 500 },
  { category: "ai_aspirations", capability: "ai_help_confidence", question_text: "How confident are you that AI can meaningfully help with your role today? (1 = skeptical, 5 = very confident)", description: "In the comment, explain what's driving your confidence level — past experience, specific use cases, or concerns.", roles: [], entity_types: [], sort_order: 501 },

  // Role-tailored aspirations
  { category: "ai_aspirations", capability: "ai_help_ba", question_text: "Where could AI help most in your BA workflow? (1 = nowhere obvious, 5 = many opportunities)", description: "In the comment, describe which artifacts, meetings, or handoffs you'd most want AI to assist with (e.g., story drafting, AC generation, requirement elaboration, stakeholder summaries).", roles: ["business_analyst", "product_owner"], entity_types: [], sort_order: 510 },
  { category: "ai_aspirations", capability: "ai_help_dev", question_text: "Which parts of your dev loop feel most automatable with AI? (1 = few, 5 = many)", description: "In the comment, describe the specific steps — scaffolding, boilerplate, test generation, refactoring, code explanation, documentation — you'd most want AI to assist with.", roles: ["developer", "tech_lead", "architect"], entity_types: [], sort_order: 511 },
  { category: "ai_aspirations", capability: "ai_help_qa", question_text: "Where could AI help most in your test workflow? (1 = few opportunities, 5 = many)", description: "In the comment, describe where you'd most want AI support — test case generation, edge case identification, regression prioritization, defect triage, test data generation.", roles: ["qa", "integration_tester", "performance_tester"], entity_types: [], sort_order: 512 },
  { category: "ai_aspirations", capability: "ai_help_sm", question_text: "Where could AI help most in your Scrum Master workflow? (1 = few, 5 = many)", description: "In the comment, describe where you'd most want AI support — sprint analytics, retro synthesis, impediment tracking, stakeholder reporting.", roles: ["scrum_master"], entity_types: [], sort_order: 513 },
  { category: "ai_aspirations", capability: "ai_help_po", question_text: "Where could AI help most in your Product Owner workflow? (1 = few, 5 = many)", description: "In the comment, describe where you'd most want AI support — backlog grooming, story prioritization, stakeholder summaries, release notes.", roles: ["product_owner"], entity_types: [], sort_order: 514 },
  { category: "ai_aspirations", capability: "ai_help_devops", question_text: "Where could AI help most in your DevOps/platform work? (1 = few, 5 = many)", description: "In the comment, describe where you'd most want AI support — pipeline tuning, log analysis, incident triage, IaC generation, config drift detection.", roles: ["devops", "release_manager", "system_admin"], entity_types: [], sort_order: 515 },
  { category: "ai_aspirations", capability: "ai_help_architect", question_text: "Where could AI help most in your architecture work? (1 = few, 5 = many)", description: "In the comment, describe where you'd most want AI support — design reviews, pattern identification, tech evaluation, documentation.", roles: ["architect"], entity_types: [], sort_order: 516 },
  { category: "ai_aspirations", capability: "ai_help_data", question_text: "Where could AI help most in your data work? (1 = few, 5 = many)", description: "In the comment, describe where you'd most want AI support — exploratory analysis, data quality checks, pipeline debugging, schema documentation.", roles: ["data_analyst", "data_engineer", "database_admin"], entity_types: [], sort_order: 517 },
  { category: "ai_aspirations", capability: "ai_help_pm", question_text: "Where could AI help most in your PM/program work? (1 = few, 5 = many)", description: "In the comment, describe where you'd most want AI support — status reporting, risk identification, meeting synthesis, cross-team coordination.", roles: ["program_manager", "project_manager", "engineering_manager"], entity_types: [], sort_order: 518 },

];

// ── AI Sentiment (universal — anonymous aggregation) ────────────────────────
// Scale: 1 = strongly disagree, 5 = strongly agree. Flagged anonymous_aggregate
// so reports show only overall distribution, never per-member or per-role breakdown.
// Separates distinct fears (job replacement, trust, skill atrophy, pressure, support, net)
// so training can target the dominant concern per team instead of guessing.
const sentimentQuestions: SeedQuestion[] = [
  { category: "ai_sentiment", capability: "job_replacement", question_text: "AI tools will make my role obsolete within the next 3-5 years.", description: "Agreement with this statement (1 = strongly disagree, 5 = strongly agree). Optional comment: what's driving your view?", roles: [], entity_types: [], sort_order: 600, anonymous_aggregate: true },
  { category: "ai_sentiment", capability: "management_intent", question_text: "I'm concerned the organization is introducing AI to reduce headcount, not to support teams.", description: "Agreement (1-5). Optional comment.", roles: [], entity_types: [], sort_order: 601, anonymous_aggregate: true },
  { category: "ai_sentiment", capability: "ai_trust", question_text: "I trust AI-generated output enough to rely on it in my day-to-day work.", description: "Agreement (1-5). Optional comment on what would increase or decrease your trust.", roles: [], entity_types: [], sort_order: 602, anonymous_aggregate: true },
  { category: "ai_sentiment", capability: "skill_atrophy", question_text: "Using AI tools will weaken my core professional skills over time.", description: "Agreement (1-5). Optional comment.", roles: [], entity_types: [], sort_order: 603, anonymous_aggregate: true },
  { category: "ai_sentiment", capability: "adoption_pressure", question_text: "I feel pressure from leadership or peers to adopt AI even when I'm uncertain about it.", description: "Agreement (1-5). Optional comment.", roles: [], entity_types: [], sort_order: 604, anonymous_aggregate: true },
  { category: "ai_sentiment", capability: "training_adequacy", question_text: "I expect to have enough training and support to use AI tools effectively on this project.", description: "Agreement (1-5). Optional comment: what would 'enough support' look like for you?", roles: [], entity_types: [], sort_order: 605, anonymous_aggregate: true },
  { category: "ai_sentiment", capability: "net_sentiment", question_text: "Overall, I feel positive about the AI rollout on this project.", description: "Agreement (1-5). Optional comment.", roles: [], entity_types: [], sort_order: 606, anonymous_aggregate: true },
];

async function seed() {
  const allQuestions = [
    ...doraQuestions,
    ...policyQuestions,
    ...roleQuestions,
    ...entityQuestions,
    ...workflowQuestions,
    ...painPointQuestions,
    ...aspirationQuestions,
    ...sentimentQuestions,
  ];

  console.log(`Checking ${allQuestions.length} questions against existing bank...`);

  // Fetch existing default questions by text so re-running the seed is additive.
  const { data: existing, error: fetchErr } = await supabase
    .from("question_bank")
    .select("question_text")
    .eq("is_default", true)
    .is("site_id", null);

  if (fetchErr) {
    console.error("Failed to read existing questions:", fetchErr.message);
    process.exit(1);
  }

  const existingTexts = new Set((existing ?? []).map((r: { question_text: string }) => r.question_text));
  const toInsert = allQuestions.filter((q) => !existingTexts.has(q.question_text));

  if (toInsert.length === 0) {
    console.log(`All ${allQuestions.length} questions already present. Nothing to insert.`);
    return;
  }

  console.log(`Inserting ${toInsert.length} new questions (${allQuestions.length - toInsert.length} already present)...`);

  const rows = toInsert.map((q) => ({
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
    anonymous_aggregate: q.anonymous_aggregate === true,
    created_by: "system_seed_v1",
  }));

  const { error } = await supabase.from("question_bank").insert(rows);

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${toInsert.length} new questions (v1).`);
}

seed();
