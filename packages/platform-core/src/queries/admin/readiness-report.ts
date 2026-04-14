import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import { READINESS_TIERS } from "../../types/ai-tools.js";
import { getReadinessAssessment } from "./readiness.js";
import { getAssessmentCompany } from "./readiness-company.js";
import { getAssessmentTeam, listAssessmentMembers } from "./readiness-team.js";
import { getAssessmentPolicy } from "./readiness-policy.js";
import { getQuestionnaire, listResponses } from "./readiness-questionnaire.js";

export interface CapabilityScore {
  capability: string;
  label: string;
  avg_score: number;
  response_count: number;
  is_blocker: boolean;
  by_role: Record<string, { avg: number; count: number }>;
}

export interface ReadinessReportData {
  assessment: Awaited<ReturnType<typeof getReadinessAssessment>>;
  company: Awaited<ReturnType<typeof getAssessmentCompany>>;
  team: Awaited<ReturnType<typeof getAssessmentTeam>>;
  members: Awaited<ReturnType<typeof listAssessmentMembers>>;
  policy: Awaited<ReturnType<typeof getAssessmentPolicy>>;
  overall_score: number;
  tier: typeof READINESS_TIERS[number];
  capability_scores: CapabilityScore[];
  response_rate: { total: number; completed: number; percentage: number };
  regulatory_gaps: string[];
  prior_comparison: PriorComparison | null;
}

export interface PriorComparison {
  prior_assessment_id: string;
  prior_overall_score: number;
  overall_delta: number;
  capability_deltas: { capability: string; current: number; prior: number; delta: number }[];
}

const CAPABILITY_LABELS: Record<string, string> = {
  ai_accessible_data: "AI-Accessible Internal Data",
  ai_stance_clarity: "Clear AI Stance",
  healthy_data_ecosystem: "Healthy Data Ecosystems",
  platform_engineering: "Platform Engineering",
  user_centric_focus: "User-Centric Focus",
  version_control_maturity: "Version Control Maturity",
  small_batches: "Working in Small Batches",
  ai_policy_exists: "AI Usage Policy Exists",
  ai_policy_coverage: "AI Policy Coverage",
  regulatory_awareness: "Regulatory Awareness",
  ai_governance: "AI Governance",
};

export async function generateReadinessReport(
  assessmentId: string,
  siteId?: string
): Promise<ReadinessReportData> {
  const site = siteId || getSiteId();
  const supabase = getServiceClient();

  // Gather all data
  const [assessment, company, team, policy] = await Promise.all([
    getReadinessAssessment(assessmentId, site),
    getAssessmentCompany(assessmentId, site),
    getAssessmentTeam(assessmentId, site),
    getAssessmentPolicy(assessmentId, site),
  ]);

  if (!assessment) throw new Error("Assessment not found");

  const members = team ? await listAssessmentMembers(team.id, site) : [];
  const questionnaire = await getQuestionnaire(assessmentId, site);
  const responses = questionnaire ? await listResponses(questionnaire.id) : [];

  // Get all answers from completed responses
  const completedResponseIds = responses.filter((r) => r.status === "completed").map((r) => r.id);

  let allAnswers: { response_id: string; question_id: string; score: number | null; flag: string | null }[] = [];
  if (completedResponseIds.length) {
    const { data } = await supabase
      .from("response_answers")
      .select("response_id, question_id, score, flag")
      .in("response_id", completedResponseIds);
    allAnswers = data || [];
  }

  // Get question metadata for capability mapping
  const questionIds = [...new Set(allAnswers.map((a) => a.question_id))];
  let questionMap: Record<string, { capability: string | null; category: string }> = {};
  if (questionIds.length) {
    const { data: questions } = await supabase
      .from("question_bank")
      .select("id, capability, category")
      .in("id", questionIds);
    for (const q of questions || []) {
      questionMap[q.id] = { capability: q.capability, category: q.category };
    }
  }

  // Build member role lookup
  const memberRoleMap: Record<string, string> = {};
  const responseMemberMap: Record<string, string> = {};
  for (const m of members) memberRoleMap[m.id] = m.role;
  for (const r of responses) responseMemberMap[r.id] = r.member_id;

  // Aggregate scores by capability
  const capabilityData: Record<string, { scores: number[]; byRole: Record<string, number[]> }> = {};

  for (const answer of allAnswers) {
    if (answer.score == null || answer.flag === "not_applicable") continue;

    const qMeta = questionMap[answer.question_id];
    if (!qMeta?.capability) continue;

    const cap = qMeta.capability;
    if (!capabilityData[cap]) capabilityData[cap] = { scores: [], byRole: {} };

    capabilityData[cap].scores.push(answer.score);

    // Track by role
    const memberId = responseMemberMap[answer.response_id];
    const role = memberId ? memberRoleMap[memberId] : "unknown";
    if (!capabilityData[cap].byRole[role]) capabilityData[cap].byRole[role] = [];
    capabilityData[cap].byRole[role].push(answer.score);
  }

  // Compute capability scores
  const capabilityScores: CapabilityScore[] = Object.entries(capabilityData).map(([cap, data]) => {
    const avg = data.scores.reduce((s, v) => s + v, 0) / data.scores.length;
    const byRole: Record<string, { avg: number; count: number }> = {};
    for (const [role, scores] of Object.entries(data.byRole)) {
      byRole[role] = {
        avg: Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 100) / 100,
        count: scores.length,
      };
    }
    return {
      capability: cap,
      label: CAPABILITY_LABELS[cap] || cap,
      avg_score: Math.round(avg * 100) / 100,
      response_count: data.scores.length,
      is_blocker: avg < 3.0,
      by_role: byRole,
    };
  });

  // Overall score
  const allCapScores = capabilityScores.map((c) => c.avg_score);
  const overallScore = allCapScores.length
    ? Math.round((allCapScores.reduce((s, v) => s + v, 0) / allCapScores.length) * 100) / 100
    : 0;

  // Determine tier
  const tier = READINESS_TIERS.find((t) => overallScore >= t.min && overallScore <= t.max) || READINESS_TIERS[0];

  // Regulatory gaps
  const regulatoryGaps: string[] = [];
  if (policy) {
    const coverage = policy.coverage as Record<string, boolean>;
    const areas = ["data_privacy", "ip_ownership", "approved_tools", "prohibited_uses", "data_handling"];
    for (const area of areas) {
      if (!coverage[area]) regulatoryGaps.push(area);
    }
    if (!policy.has_policy) regulatoryGaps.unshift("no_policy");
  }

  // Prior comparison
  let priorComparison: PriorComparison | null = null;
  if (assessment.prior_assessment_id) {
    try {
      const priorReport = await generateReadinessReport(assessment.prior_assessment_id, site);
      const capDeltas = capabilityScores.map((cs) => {
        const prior = priorReport.capability_scores.find((p) => p.capability === cs.capability);
        return {
          capability: cs.capability,
          current: cs.avg_score,
          prior: prior?.avg_score || 0,
          delta: Math.round((cs.avg_score - (prior?.avg_score || 0)) * 100) / 100,
        };
      });
      priorComparison = {
        prior_assessment_id: assessment.prior_assessment_id,
        prior_overall_score: priorReport.overall_score,
        overall_delta: Math.round((overallScore - priorReport.overall_score) * 100) / 100,
        capability_deltas: capDeltas,
      };
    } catch {
      // Prior assessment may not have complete data
    }
  }

  return {
    assessment,
    company,
    team,
    members,
    policy,
    overall_score: overallScore,
    tier,
    capability_scores: capabilityScores,
    response_rate: {
      total: responses.length,
      completed: completedResponseIds.length,
      percentage: responses.length ? Math.round((completedResponseIds.length / responses.length) * 100) : 0,
    },
    regulatory_gaps: regulatoryGaps,
    prior_comparison: priorComparison,
  };
}
