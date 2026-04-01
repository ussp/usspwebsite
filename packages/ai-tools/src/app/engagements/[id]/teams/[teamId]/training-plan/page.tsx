"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import type { AITrainingPlan } from "@ussp-platform/core";
import { TEAM_MEMBER_ROLE_LABELS, TRAINING_PLAN_STATUS_LABELS } from "@ussp-platform/core";
import type { TeamMemberRole, TrainingPlanStatus } from "@ussp-platform/core";

export default function TrainingPlanPage() {
  const { teamId } = useParams<{ id: string; teamId: string }>();
  const [plans, setPlans] = useState<AITrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/training-plans?team_id=${teamId}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setPlans)
      .finally(() => setLoading(false));
  }, [teamId]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/training-plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: teamId }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Training Plans</h1>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate Plans"}
          </button>
        </div>

        <p className="text-sm text-dark/50 mb-6">
          AI training recommendations customized by role, based on what each team member does.
          Every role gets the right tools — our philosophy: amplify, not replace.
        </p>

        {loading ? (
          <p className="text-dark/40">Loading...</p>
        ) : plans.length === 0 ? (
          <div className="bg-white rounded-lg border border-light-gray p-8 text-center">
            <p className="text-dark/40">
              No training plans yet. Click &ldquo;Generate Plans&rdquo; to create role-based recommendations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg border border-light-gray p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">
                      {TEAM_MEMBER_ROLE_LABELS[plan.role as TeamMemberRole] || plan.role}
                    </h3>
                    {plan.member_id && (
                      <p className="text-xs text-dark/40">Individual plan</p>
                    )}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    plan.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                    plan.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                    plan.status === "approved" ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {TRAINING_PLAN_STATUS_LABELS[plan.status as TrainingPlanStatus] || plan.status}
                  </span>
                </div>

                {/* Recommended tools */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-dark/60 mb-1">Recommended Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(plan.recommended_tools as Array<{ tool: string; reason: string }>).map((t, i) => (
                      <span
                        key={i}
                        className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary text-xs"
                        title={t.reason}
                      >
                        {t.tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Training modules */}
                <div>
                  <p className="text-xs font-medium text-dark/60 mb-1">Training Modules</p>
                  <div className="space-y-1.5">
                    {(plan.recommended_training as Array<{ module: string; description: string; duration_hours: number; priority: string }>).map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          t.priority === "high" ? "bg-danger" :
                          t.priority === "medium" ? "bg-warning" :
                          "bg-gray-400"
                        }`} />
                        <span className="font-medium">{t.module}</span>
                        <span className="text-dark/40">({t.duration_hours}h)</span>
                        <span className="text-dark/30">{t.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
