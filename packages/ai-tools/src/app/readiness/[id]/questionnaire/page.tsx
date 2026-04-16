"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import { TEAM_MEMBER_ROLE_LABELS } from "@ussp-platform/core";
import InfoTip from "@/components/InfoTip";
import type { TeamMemberRole } from "@ussp-platform/core";

interface QQuestion {
  id: string;
  question_id: string;
  question_version: number;
  sort_order: number;
  is_required: boolean;
  target_roles: string[];
  question: {
    question_text: string;
    category: string;
    capability: string | null;
    description: string | null;
  };
}

export default function QuestionnairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [questions, setQuestions] = useState<QQuestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    loadQuestionnaire();
  }, [id]);

  async function loadQuestionnaire() {
    const res = await fetch(`/api/readiness/${id}/questionnaire`);
    const data = await res.json();
    if (data?.questions) setQuestions(data.questions);
  }

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch(`/api/readiness/${id}/questionnaire/generate`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate");
      }
      await loadQuestionnaire();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate questionnaire");
    }
    setGenerating(false);
  }

  async function removeQuestion(qqId: string) {
    await fetch(`/api/readiness/${id}/questionnaire`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", questionId: qqId }),
    });
    setQuestions((prev) => prev.filter((q) => q.id !== qqId));
  }

  // Group by category
  const grouped: Record<string, QQuestion[]> = {};
  questions.forEach((q) => {
    const cat = q.question.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(q);
  });

  const CATEGORY_LABELS: Record<string, string> = {
    dora_capability: "DORA Capabilities",
    ai_policy: "AI Policy & Governance",
    role_specific: "Role-Specific Questions",
    workflow: "Workflow & Methodology",
  };

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        <ReadinessSteps assessmentId={id} currentStep={10} status={assessment?.status || "draft"} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold mb-1">Questionnaire<InfoTip text="Questions are selected from the question bank based on the company entity type, team function, and member roles. Universal questions go to everyone; role-specific questions go only to matching roles." /></h1>
            <p className="text-sm text-dark/50">
              {questions.length > 0
                ? `${questions.length} questions generated. Review and customize before distributing.`
                : "Generate a custom questionnaire based on the company and team profile."}
            </p>
          </div>
          <button onClick={generate} disabled={generating}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
            {generating ? "Generating..." : questions.length > 0 ? "Regenerate" : "Generate Questionnaire"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {questions.length > 0 && (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, qs]) => (
              <div key={category} className="bg-white rounded-lg border border-light-gray p-5">
                <h2 className="text-sm font-semibold uppercase text-dark/40 mb-4">
                  {CATEGORY_LABELS[category] || category} ({qs.length})
                </h2>
                <div className="space-y-3">
                  {qs.map((q, i) => (
                    <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-light-gray/30">
                      <span className="text-xs text-dark/30 font-mono mt-0.5">{q.sort_order}</span>
                      <div className="flex-1">
                        <p className="text-sm">{q.question.question_text}</p>
                        {q.question.description && (
                          <p className="text-xs text-dark/40 mt-1">{q.question.description}</p>
                        )}
                        <div className="flex gap-1 mt-2">
                          {q.target_roles.length === 0 ? (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Universal</span>
                          ) : (
                            q.target_roles.map((r) => (
                              <span key={r} className="text-[10px] bg-light-gray text-dark/50 px-1.5 py-0.5 rounded">
                                {TEAM_MEMBER_ROLE_LABELS[r as TeamMemberRole] || r}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                      <button onClick={() => removeQuestion(q.id)} className="text-xs text-red-400 hover:text-red-600">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => router.push(`/readiness/${id}/use-cases`)} className="text-sm text-dark/50 hover:text-dark">
            &larr; Back: Use Cases
          </button>
          {questions.length > 0 && (
            <button onClick={() => router.push(`/readiness/${id}/distribute`)}
              className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              Next: Distribute &rarr;
            </button>
          )}
        </div>
      </main>
    </>
  );
}
