"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

export default function NewAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reassessId = searchParams.get("reassess");

  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          deadline: deadline || undefined,
          prior_assessment_id: reassessId || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to create assessment");
      const data = await res.json();
      router.push(`/readiness/${data.id}/company`);
    } catch {
      setError("Failed to create assessment. Please try again.");
      setSaving(false);
    }
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">
          {reassessId ? "Re-Assessment" : "New Readiness Assessment"}
        </h1>
        <p className="text-sm text-dark/50 mb-6">
          {reassessId
            ? "Create a new assessment based on a prior one to track readiness improvement."
            : "Start a new AI readiness assessment for a team or organization."}
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-light-gray p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Assessment Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Acme Corp — Q2 2026 Readiness"
              className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deadline (optional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Assessment"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/readiness")}
              className="text-sm text-dark/50 hover:text-dark"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
