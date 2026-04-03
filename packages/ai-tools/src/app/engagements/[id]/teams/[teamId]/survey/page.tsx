"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import LikertScale from "@/components/LikertScale";
import type {
  EngagementDetail,
  AITeamMember,
  AIAssessment,
  AssessmentType,
} from "@ussp-platform/core";

// ---------------------------------------------------------------------------
// Survey question definitions
// ---------------------------------------------------------------------------

interface SurveyQuestion {
  id: string;
  category: "space" | "devex";
  metric_name: string;
  label: string;
  reverseScored?: boolean;
}

const SPACE_QUESTIONS: SurveyQuestion[] = [
  {
    id: "space_satisfaction",
    category: "space",
    metric_name: "satisfaction",
    label: "I am satisfied with my development tools and workflow",
  },
  {
    id: "space_performance",
    category: "space",
    metric_name: "performance",
    label: "I consistently deliver high-quality work that meets sprint commitments",
  },
  {
    id: "space_activity",
    category: "space",
    metric_name: "activity",
    label: "I complete a meaningful number of tasks each sprint",
  },
  {
    id: "space_communication",
    category: "space",
    metric_name: "communication",
    label: "My team communicates effectively and reviews happen promptly",
  },
  {
    id: "space_efficiency",
    category: "space",
    metric_name: "efficiency",
    label: "I spend most of my time on valuable work, not repetitive tasks",
  },
];

const DEVEX_QUESTIONS: SurveyQuestion[] = [
  {
    id: "devex_flow_state",
    category: "devex",
    metric_name: "flow_state",
    label: "I can get into a focused 'flow state' regularly during my work",
  },
  {
    id: "devex_feedback_loops",
    category: "devex",
    metric_name: "feedback_loops",
    label: "I get fast feedback on my work (builds, tests, reviews)",
  },
  {
    id: "devex_cognitive_load",
    category: "devex",
    metric_name: "cognitive_load",
    label: "I can understand the codebase/processes without excessive mental effort",
  },
  {
    id: "devex_velocity_gain",
    category: "devex",
    metric_name: "velocity_gain",
    label: "AI tools have noticeably increased my speed of delivery",
  },
  {
    id: "devex_verification_tax",
    category: "devex",
    metric_name: "verification_tax",
    label: "AI-generated work requires significant additional review effort",
    reverseScored: true,
  },
  {
    id: "devex_entry_barrier_reduction",
    category: "devex",
    metric_name: "entry_barrier_reduction",
    label: "AI tools make it easier to work in unfamiliar areas",
  },
  {
    id: "devex_expertise_depth_risk",
    category: "devex",
    metric_name: "expertise_depth_risk",
    label: "I worry about becoming too dependent on AI for deep technical knowledge",
    reverseScored: true,
  },
  {
    id: "devex_prototyping_speed",
    category: "devex",
    metric_name: "prototyping_speed",
    label: "AI tools help me prototype and explore solutions faster",
  },
  {
    id: "devex_last_mile_friction",
    category: "devex",
    metric_name: "last_mile_friction",
    label:
      "AI-generated output needs significant manual cleanup before it's production-ready",
    reverseScored: true,
  },
];

const ALL_QUESTIONS = [...SPACE_QUESTIONS, ...DEVEX_QUESTIONS];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function SurveyPage() {
  const { id: engagementId, teamId } = useParams<{ id: string; teamId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [engagement, setEngagement] = useState<EngagementDetail | null>(null);
  const [members, setMembers] = useState<AITeamMember[]>([]);
  const [assessments, setAssessments] = useState<AIAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [assessmentType, setAssessmentType] = useState<AssessmentType>(
    (searchParams.get("type") as AssessmentType) || "baseline"
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Derived
  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v > 0).length,
    [answers]
  );
  const totalQuestions = ALL_QUESTIONS.length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);
  const allAnswered = answeredCount === totalQuestions;

  // Find the matching team from the engagement data
  const team = engagement?.teams.find((t) => t.id === teamId);

  // Find the assessment for the selected type
  const selectedAssessment = useMemo(() => {
    if (assessmentType === "baseline") {
      return assessments.find((a) => a.assessment_type === "baseline");
    }
    return assessments.find((a) => a.assessment_type === "post_training");
  }, [assessments, assessmentType]);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [engRes, membersRes, assessRes] = await Promise.all([
          fetch(`/api/engagements/${engagementId}`),
          fetch(`/api/teams/${teamId}/members`),
          fetch(`/api/assessments?team_id=${teamId}`),
        ]);

        if (engRes.ok) setEngagement(await engRes.json());
        if (membersRes.ok) setMembers(await membersRes.json());
        if (assessRes.ok) setAssessments(await assessRes.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [engagementId, teamId]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleAnswer(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function resetForm() {
    setAnswers({});
    setSubmitted(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAssessment) {
      setError(
        `No ${assessmentType} assessment found for this team. Create one first from the Baseline or Post-Training page.`
      );
      return;
    }
    if (!selectedMemberId) {
      setError("Please select a team member.");
      return;
    }
    if (!allAnswered) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    // Build the metrics payload
    const metrics = ALL_QUESTIONS.map((q) => ({
      category: q.category,
      metric_name: q.metric_name,
      metric_value: answers[q.id],
      metric_unit: "score_1_5",
    }));

    try {
      const res = await fetch(`/api/assessments/${selectedAssessment.id}/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: [
            {
              member_id: selectedMemberId,
              metrics,
            },
          ],
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to submit survey. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6 max-w-4xl">
          <p className="text-dark/40 font-[family-name:var(--font-montserrat)]">
            Loading survey...
          </p>
        </main>
      </>
    );
  }

  if (!engagement || !team) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6 max-w-4xl">
          <p className="text-red-600 font-[family-name:var(--font-montserrat)]">
            Engagement or team not found.
          </p>
        </main>
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Success state
  // ---------------------------------------------------------------------------

  if (submitted) {
    const memberName =
      members.find((m) => m.id === selectedMemberId)?.display_name || "Team member";

    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6 max-w-4xl">
          <div className="bg-white rounded-lg border border-light-gray p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold font-[family-name:var(--font-alata)] mb-2">
              Survey Submitted
            </h2>
            <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)] mb-6">
              {memberName}&apos;s {assessmentType === "baseline" ? "baseline" : "post-training"}{" "}
              survey responses have been saved successfully.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedMemberId("");
                  resetForm();
                }}
                className="px-5 py-2.5 text-sm rounded-lg border border-light-gray hover:bg-light-gray transition-colors font-[family-name:var(--font-alata)]"
              >
                Submit for Another Member
              </button>
              <button
                onClick={() => router.push(`/engagements/${engagementId}`)}
                className="px-5 py-2.5 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors font-[family-name:var(--font-alata)]"
              >
                Back to Engagement
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Render survey form
  // ---------------------------------------------------------------------------

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-dark/40 font-[family-name:var(--font-montserrat)] mb-1">
            {engagement.name}
          </p>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-alata)] mb-1">
            Team Survey &mdash; {team.name}
          </h1>
          <p className="text-sm text-dark/50 font-[family-name:var(--font-montserrat)]">
            Collect individual perceptions on satisfaction, performance, developer experience,
            and AI tool impact. Each team member should complete this survey once per assessment
            period.
          </p>
        </div>

        {/* Controls row: member selector + assessment type */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Member selector */}
            <div>
              <label className="block text-sm font-medium font-[family-name:var(--font-alata)] mb-1">
                Team Member
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => {
                  setSelectedMemberId(e.target.value);
                  resetForm();
                }}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm font-[family-name:var(--font-montserrat)] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select a team member...</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.display_name} ({m.role})
                  </option>
                ))}
              </select>
              {members.length === 0 && (
                <p className="text-[11px] text-red-500 mt-1">
                  No team members found. Add members to this team first.
                </p>
              )}
            </div>

            {/* Assessment type */}
            <div>
              <label className="block text-sm font-medium font-[family-name:var(--font-alata)] mb-1">
                Assessment Type
              </label>
              <select
                value={assessmentType}
                onChange={(e) => {
                  setAssessmentType(e.target.value as AssessmentType);
                  resetForm();
                }}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm font-[family-name:var(--font-montserrat)] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="baseline">Baseline (before training)</option>
                <option value="post_training">Post-Training (after training)</option>
              </select>
              {!selectedAssessment && (
                <p className="text-[11px] text-amber-600 mt-1">
                  No {assessmentType} assessment exists yet. Create one first.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {selectedMemberId && (
          <div className="bg-white rounded-lg border border-light-gray p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium font-[family-name:var(--font-alata)] text-dark/60">
                Progress
              </span>
              <span className="text-xs font-[family-name:var(--font-montserrat)] text-dark/50">
                {answeredCount} of {totalQuestions} questions answered
              </span>
            </div>
            <div className="w-full bg-light-gray rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Survey form */}
        {selectedMemberId ? (
          <form onSubmit={handleSubmit}>
            {/* SPACE Framework */}
            <div className="bg-white rounded-lg border border-light-gray p-6 mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold font-[family-name:var(--font-alata)] mb-1">
                  SPACE Framework
                </h2>
                <p className="text-xs text-dark/50 font-[family-name:var(--font-montserrat)]">
                  Five dimensions of developer productivity: Satisfaction, Performance, Activity,
                  Communication, and Efficiency.
                </p>
              </div>
              <div className="space-y-5">
                {SPACE_QUESTIONS.map((q) => (
                  <div key={q.id}>
                    <LikertScale
                      name={q.id}
                      label={q.label}
                      value={answers[q.id] || 0}
                      onChange={(v) => handleAnswer(q.id, v)}
                    />
                    {q.reverseScored && (
                      <p className="text-[10px] text-amber-600 ml-26 -mt-2">
                        Reverse-scored: higher = more friction
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* DevEx Framework */}
            <div className="bg-white rounded-lg border border-light-gray p-6 mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold font-[family-name:var(--font-alata)] mb-1">
                  Developer Experience (DevEx)
                </h2>
                <p className="text-xs text-dark/50 font-[family-name:var(--font-montserrat)]">
                  Core developer experience dimensions plus AI-specific tensions from the DORA
                  2025 research program.
                </p>
              </div>
              <div className="space-y-5">
                {DEVEX_QUESTIONS.map((q) => (
                  <div key={q.id}>
                    <LikertScale
                      name={q.id}
                      label={q.label}
                      value={answers[q.id] || 0}
                      onChange={(v) => handleAnswer(q.id, v)}
                    />
                    {q.reverseScored && (
                      <p className="text-[10px] text-amber-600 ml-26 -mt-2">
                        Reverse-scored: higher = more friction
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700 font-[family-name:var(--font-montserrat)]">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting || !allAnswered || !selectedAssessment}
                className="px-6 py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-[family-name:var(--font-alata)]"
              >
                {submitting ? "Submitting..." : "Submit Survey"}
              </button>
              {!allAnswered && selectedMemberId && (
                <span className="text-xs text-dark/40 font-[family-name:var(--font-montserrat)]">
                  Answer all {totalQuestions} questions to enable submission
                </span>
              )}
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-lg border border-light-gray p-8 text-center">
            <p className="text-sm text-dark/40 font-[family-name:var(--font-montserrat)]">
              Select a team member above to begin the survey.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
