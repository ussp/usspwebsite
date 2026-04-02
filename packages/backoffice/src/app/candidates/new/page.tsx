"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

export default function NewCandidatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      full_name: form.get("full_name"),
      email: form.get("email"),
      phone: form.get("phone") || null,
      candidate_type: form.get("candidate_type"),
      current_status: form.get("current_status"),
      source: form.get("source"),
      summary: form.get("summary") || null,
      salary_expectation_min: form.get("salary_min")
        ? Number(form.get("salary_min"))
        : null,
      salary_expectation_max: form.get("salary_max")
        ? Number(form.get("salary_max"))
        : null,
      salary_type: form.get("salary_type") || null,
    };

    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/candidates/${data.id}`);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add candidate");
      setSaving(false);
    }
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <button
          onClick={() => router.push("/candidates")}
          className="text-sm text-dark/50 hover:text-primary transition-colors mb-2 inline-block"
        >
          &larr; Back to Candidates
        </button>
        <h2 className="text-xl font-bold mb-6">Add Candidate</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-light-gray p-6 max-w-2xl space-y-5"
        >
          {error && (
            <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* Type selection - prominent */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Candidate Type *
            </label>
            <div className="flex gap-3">
              {[
                {
                  value: "internal_employee",
                  label: "Internal Employee",
                  desc: "Current employee / bench",
                  color: "border-blue-300 bg-blue-50 text-blue-800",
                  checkedColor:
                    "border-blue-500 bg-blue-100 text-blue-900 ring-2 ring-blue-500/30",
                },
                {
                  value: "external",
                  label: "External",
                  desc: "Outside candidate",
                  color: "border-gray-300 bg-gray-50 text-gray-800",
                  checkedColor:
                    "border-gray-500 bg-gray-100 text-gray-900 ring-2 ring-gray-400/30",
                },
                {
                  value: "vendor",
                  label: "Vendor",
                  desc: "From partner / vendor",
                  color: "border-purple-300 bg-purple-50 text-purple-800",
                  checkedColor:
                    "border-purple-500 bg-purple-100 text-purple-900 ring-2 ring-purple-500/30",
                },
              ].map((opt) => (
                <label key={opt.value} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="candidate_type"
                    value={opt.value}
                    defaultChecked={opt.value === "internal_employee"}
                    className="peer sr-only"
                  />
                  <div
                    className={`p-3 rounded-lg border text-center transition-all ${opt.color} peer-checked:${opt.checkedColor}`}
                  >
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-xs opacity-70">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <input
                name="full_name"
                required
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                name="phone"
                type="tel"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+1 (312) 555-0123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="current_status"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="available">Available (Bench)</option>
                <option value="employed">Employed</option>
                <option value="on_assignment">On Assignment</option>
                <option value="not_looking">Not Looking</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Source</label>
            <select
              name="source"
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="internal">Internal</option>
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option>
              <option value="application">Application</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Salary / Rate Expectations
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  name="salary_min"
                  type="number"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Min"
                />
              </div>
              <div>
                <input
                  name="salary_max"
                  type="number"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Max"
                />
              </div>
              <div>
                <select
                  name="salary_type"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Type</option>
                  <option value="hourly">Hourly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea
              name="summary"
              rows={3}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Brief summary of skills, experience, current role..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Candidate"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm rounded-lg border border-light-gray hover:bg-light-gray transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
