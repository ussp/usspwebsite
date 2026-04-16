"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import { POLICY_COVERAGE_AREAS } from "@ussp-platform/core";
import InfoTip from "@/components/InfoTip";

export default function PolicyIntakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [hasPolicy, setHasPolicy] = useState(false);
  const [coverage, setCoverage] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    fetch(`/api/readiness/${id}/policy`).then((r) => r.json()).then((data) => {
      if (data) {
        setHasPolicy(data.has_policy || false);
        setCoverage(data.coverage || {});
        setNotes(data.notes || "");
      }
    });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/readiness/${id}/policy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ has_policy: hasPolicy, coverage, notes }),
    });
    setSaving(false);
  }

  const coveredCount = Object.values(coverage).filter(Boolean).length;

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-3xl">
        <ReadinessSteps assessmentId={id} currentStep={3} status={assessment?.status || "draft"} />

        <h1 className="text-xl font-bold mb-1">AI Policy Intake</h1>
        <p className="text-sm text-dark/50 mb-6">Capture the organization&apos;s existing AI policy and identify gaps.</p>

        <div className="bg-white rounded-lg border border-light-gray p-6 space-y-6">
          {/* Has policy toggle */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Does the organization have a written AI usage policy?<InfoTip text="A written policy communicating approved AI tools, prohibited uses, and data handling rules. Not having one is a critical blocker in the readiness report." /></label>
            <div className="flex gap-3">
              <button onClick={() => setHasPolicy(true)}
                className={`px-3 py-1 rounded text-sm font-medium ${hasPolicy ? "bg-emerald-100 text-emerald-700" : "bg-light-gray text-dark/40"}`}>
                Yes
              </button>
              <button onClick={() => setHasPolicy(false)}
                className={`px-3 py-1 rounded text-sm font-medium ${!hasPolicy ? "bg-red-100 text-red-700" : "bg-light-gray text-dark/40"}`}>
                No
              </button>
            </div>
          </div>

          {/* No policy warning */}
          {!hasPolicy && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium">Readiness Blocker: No AI Policy</p>
              <p className="text-xs text-red-600 mt-1">
                The organization should create an AI usage policy before AI training begins.
                This will be flagged as a critical blocker in the readiness report.
              </p>
            </div>
          )}

          {/* Policy coverage */}
          {hasPolicy && (
            <div>
              <p className="text-sm font-medium mb-3">
                Policy Coverage ({coveredCount}/5 areas)<InfoTip text="Check each area the organization's AI policy addresses. Uncovered areas appear as gaps in the readiness report." />
              </p>
              <div className="space-y-2">
                {(POLICY_COVERAGE_AREAS as readonly { key: string; label: string }[]).map((area) => (
                  <label key={area.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={coverage[area.key] || false}
                      onChange={(e) => setCoverage({ ...coverage, [area.key]: e.target.checked })}
                      className="rounded border-light-gray text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{area.label}</span>
                  </label>
                ))}
              </div>

              {coveredCount < 5 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-amber-800">
                    <strong>{5 - coveredCount} gap{5 - coveredCount > 1 ? "s" : ""} identified</strong> — uncovered areas will be flagged in the readiness report.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              rows={3} placeholder="Additional details about AI policy, governance committee, etc."
              className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => router.push(`/readiness/${id}/team`)} className="text-sm text-dark/50 hover:text-dark">
            &larr; Back
          </button>
          <button onClick={() => { handleSave().then(() => router.push(`/readiness/${id}/scope`)); }}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: Scope &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
