/**
 * Seeds the question_bank with the DCFS / ILC AI Pilot Baseline Survey questions
 * and creates the readiness_assessment shell. After running, use the
 * /readiness/import UI (or the full response loader below) to load the 122
 * responses from ILC AI Survey.xlsx.
 *
 * Usage:
 *   SITE_ID=dcfs npx tsx scripts/load-dcfs-baseline-survey.ts
 *
 * Idempotent: skips questions with identical question_text under the same
 * site_id, skips assessment if one with the same name already exists.
 */

import { getServiceClient } from "@ussp-platform/core/supabase/server";
import type { CreateQuestionInput, QuestionOption } from "@ussp-platform/core/types/ai-tools";
import { createQuestion } from "@ussp-platform/core/queries/admin/question-bank";

const ASSESSMENT_NAME = "DCFS / ILC AI Pilot Baseline (May 2026)";
const SITE_ID = process.env.SITE_ID || "dcfs";
const CREATED_BY = process.env.SEED_CREATED_BY || "loader@krasanconsulting.com";

// ── Question definitions ─────────────────────────────────────────────
// Aligned with baseline-report-v20260518.md sections.

const ATTITUDE_QS: CreateQuestionInput[] = [
  {
    category: "attitude",
    capability: "ai_value_belief",
    question_text: "AI tools can meaningfully improve my work quality",
    question_type: "likert",
  },
  {
    category: "attitude",
    capability: "ai_augmentation_stance",
    question_text: "AI tools will augment my role, not replace it",
    question_type: "likert",
  },
  {
    category: "attitude",
    capability: "learning_willingness",
    question_text: "I am willing to invest time learning AI tools",
    question_type: "likert",
  },
  {
    category: "attitude",
    capability: "structured_adoption",
    question_text: "Structured AI adoption is better than ad-hoc",
    question_type: "likert",
  },
];

const AI_SKILL_QS: CreateQuestionInput[] = [
  ["prompt_writing", "Writing effective prompts for AI tools"],
  ["output_review", "Identifying wrong / incomplete AI suggestions"],
  ["user_story_ai", "AI for user-story writing / requirements"],
  ["acceptance_criteria_ai", "AI for acceptance-criteria / requirements docs"],
  ["code_review_ai", "Reviewing AI-generated code for correctness / security"],
  ["test_case_ai", "AI for test-case generation"],
  ["test_strategy_ai", "AI for test strategy / coverage / test-data generation"],
  ["sdlc_integration_ai", "Integrating AI output into existing SDLC workflows"],
  ["d365_ai", "AI for D365 / Power Platform development"],
].map(([cap, text]) => ({
  category: "ai_skill",
  capability: cap,
  question_text: text,
  question_type: "likert" as const,
}));

const GOVERNANCE_QS: CreateQuestionInput[] = [
  {
    category: "governance",
    capability: "data_boundary_clarity",
    question_text: "I am confident I know what data I can and cannot enter into an AI prompt on this program",
    question_type: "likert",
  },
  {
    category: "governance",
    capability: "incident_response_clarity",
    question_text: "I know what to do if I accidentally enter PII or case data into an AI prompt",
    question_type: "likert",
  },
  {
    category: "governance",
    capability: "policy_awareness",
    question_text: "I understand the DoIT AI Policy requirements that apply to my role",
    question_type: "likert",
  },
];

const DEVEX_QS: CreateQuestionInput[] = [
  ["work_quality_confidence", "Confidence in work quality"],
  ["meaningful_output", "Meaningful sprint output"],
  ["team_communication", "Team communication effectiveness"],
  ["tools_satisfaction", "Job satisfaction with current tools / processes"],
  ["timely_feedback", "Timely feedback on completed work"],
  ["focus_without_switching", "Focus without context-switching"],
  ["tool_intuitiveness", "Tool / process intuitiveness"],
  ["deep_focus_time", "Periods of deep, uninterrupted focus"],
].map(([cap, text]) => ({
  category: "devex",
  capability: cap,
  question_text: text,
  question_type: "likert" as const,
}));

const TOOL_USAGE_OPTIONS: QuestionOption[] = [
  { value: "chatgpt", label: "ChatGPT / GPT-4" },
  { value: "ms_copilot", label: "Microsoft 365 Copilot" },
  { value: "google_gemini", label: "Google Gemini" },
  { value: "claude", label: "Claude (Anthropic)" },
  { value: "atlassian_rovo", label: "Atlassian Rovo / Atlassian Intelligence" },
  { value: "github_copilot", label: "GitHub Copilot" },
  { value: "d365_copilot", label: "Dynamics 365 Copilot" },
  { value: "other", label: "Other" },
];

const SDLC_OPTIONS: QuestionOption[] = [
  { value: "documentation", label: "Documentation" },
  { value: "code_generation", label: "Code writing / generation" },
  { value: "user_stories", label: "User stories / requirements" },
  { value: "test_creation", label: "Test case creation" },
  { value: "bug_triage", label: "Bug triage / defect analysis" },
  { value: "code_review", label: "Code review / PR analysis" },
  { value: "sprint_planning", label: "Sprint planning / estimation" },
];

const CONSTRAINT_OPTIONS: QuestionOption[] = [
  { value: "data_privacy", label: "Data privacy / compliance concerns (CANTS, CCWIS, PII, FERPA)" },
  { value: "no_access", label: "No access / not yet provisioned" },
  { value: "no_training", label: "No training on how to use it" },
  { value: "havent_tried", label: "Haven't tried yet" },
  { value: "quality_concerns", label: "Output quality / accuracy concerns" },
  { value: "not_authorized", label: "Manager / organization hasn't authorized use" },
  { value: "workflow_misfit", label: "Tool doesn't fit my workflow" },
  { value: "sprint_pressure", label: "Faster to do it the old way under sprint pressure" },
];

const OUTCOME_OPTIONS: QuestionOption[] = [
  { value: "significantly_improved", label: "Significantly improved productivity" },
  { value: "somewhat_improved", label: "Somewhat improved productivity" },
  { value: "neutral", label: "Neutral" },
  { value: "slower", label: "Made things slower or more complicated" },
  { value: "not_applicable", label: "Not applicable" },
];

const TRAINING_OPTIONS: QuestionOption[] = [
  { value: "comprehensive", label: "Yes, comprehensive (multi-day / certification)" },
  { value: "introductory", label: "Yes, introductory (workshop / webinar)" },
  { value: "self_taught", label: "Self-taught only" },
  { value: "none", label: "No training" },
];

const MULTI_AND_SINGLE_QS: CreateQuestionInput[] = [
  {
    category: "tool_usage",
    capability: "ai_tools_used",
    question_text: "Which AI tools have you used in the last sprint?",
    question_type: "multi_choice",
    options: TOOL_USAGE_OPTIONS,
  },
  {
    category: "tool_usage",
    capability: "sdlc_application",
    question_text: "Which SDLC processes have you applied AI to?",
    question_type: "multi_choice",
    options: SDLC_OPTIONS,
  },
  {
    category: "constraints",
    capability: "ai_use_blockers",
    question_text: "What prevented or limited your AI tool use in the last sprint?",
    question_type: "multi_choice",
    options: CONSTRAINT_OPTIONS,
  },
  {
    category: "outcome",
    capability: "self_reported_outcome",
    question_text: "What outcome have AI tools had on your work to date?",
    question_type: "single_choice",
    options: OUTCOME_OPTIONS,
  },
  {
    category: "ai_skill",
    capability: "training_received",
    question_text: "What AI training have you received?",
    question_type: "single_choice",
    options: TRAINING_OPTIONS,
  },
];

const FREE_TEXT_QS: CreateQuestionInput[] = [
  {
    category: "free_text",
    capability: "concerns",
    question_text: "What's your biggest concern about AI tool adoption on this program?",
    question_type: "free_text",
    anonymous_aggregate: true,
  },
  {
    category: "free_text",
    capability: "improvement_area",
    question_text: "Where do you think AI could most improve your team's work?",
    question_type: "free_text",
    anonymous_aggregate: true,
  },
];

const ALL_QUESTIONS: CreateQuestionInput[] = [
  ...ATTITUDE_QS,
  ...AI_SKILL_QS,
  ...GOVERNANCE_QS,
  ...DEVEX_QS,
  ...MULTI_AND_SINGLE_QS,
  ...FREE_TEXT_QS,
];

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  const supabase = getServiceClient();

  // 1. Find or create the readiness_assessment
  const { data: existing } = await supabase
    .from("readiness_assessments")
    .select("*")
    .eq("site_id", SITE_ID)
    .eq("name", ASSESSMENT_NAME)
    .maybeSingle();

  let assessment = existing;
  if (!assessment) {
    const { data: created, error } = await supabase
      .from("readiness_assessments")
      .insert({
        site_id: SITE_ID,
        name: ASSESSMENT_NAME,
        status: "completed",
        created_by: CREATED_BY,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    assessment = created;
    console.log(`Created assessment ${assessment.id}`);
  } else {
    console.log(`Using existing assessment ${assessment.id}`);
  }

  // 2. Seed question_bank (skip questions whose text already exists for this site)
  const { data: existingQs } = await supabase
    .from("question_bank")
    .select("question_text")
    .or(`site_id.is.null,site_id.eq.${SITE_ID}`);
  const existingTexts = new Set(
    (existingQs || []).map((q: { question_text: string }) => q.question_text)
  );

  let created = 0;
  let skipped = 0;
  for (const q of ALL_QUESTIONS) {
    if (existingTexts.has(q.question_text)) {
      skipped++;
      continue;
    }
    await createQuestion(q, CREATED_BY, SITE_ID);
    created++;
  }

  console.log(`Questions: ${created} created, ${skipped} skipped (duplicate)`);
  console.log(`\nNext step: open /readiness/import in the ai-tools app and`);
  console.log(`upload ILC AI Survey.xlsx, selecting "${ASSESSMENT_NAME}".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
