"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

export default function NewPositionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      slug: String(form.get("title"))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      location: form.get("location"),
      type: form.get("type"),
      department: form.get("department") || null,
      salary_range: form.get("salary_range") || null,
      description: form.get("description") || null,
      active: form.get("active") === "on",
    };

    const res = await fetch("/api/positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/positions");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create position");
      setSaving(false);
    }
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h2 className="text-xl font-bold mb-6">New Position</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-light-gray p-6 max-w-2xl space-y-4"
        >
          {error && (
            <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              name="title"
              required
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Location *
              </label>
              <input
                name="location"
                required
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                name="type"
                required
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <input
                name="department"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Salary Range
              </label>
              <input
                name="salary_range"
                placeholder="e.g. $80k-$120k"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={8}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              defaultChecked
              className="rounded"
            />
            Active (visible on careers page)
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Position"}
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
