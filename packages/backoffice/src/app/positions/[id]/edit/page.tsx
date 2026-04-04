"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

interface Position {
  id: string;
  title: string;
  slug: string;
  location: string;
  type: string;
  work_mode: string | null;
  department: string | null;
  salary_range: string | null;
  client_id: string | null;
  end_client_id: string | null;
  description: string | null;
  bill_rate: string | null;
  duration_hours: string | null;
  active: boolean;
  is_hot: boolean;
}

interface SelectOption {
  id: string;
  name: string;
}

export default function EditPositionPage() {
  const router = useRouter();
  const params = useParams();
  const [position, setPosition] = useState<Position | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<SelectOption[]>([]);
  const [endClients, setEndClients] = useState<SelectOption[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/positions/${params.id}`).then((r) => r.json()),
      fetch("/api/clients").then((r) => r.json()),
      fetch("/api/end-clients").then((r) => r.json()),
    ])
      .then(([posData, clientsData, endClientsData]) => {
        setPosition(posData);
        setClients(clientsData);
        setEndClients(endClientsData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load position");
        setLoading(false);
      });
  }, [params.id]);

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
      work_mode: form.get("work_mode") || null,
      department: form.get("department") || null,
      salary_range: form.get("salary_range") || null,
      client_id: form.get("client_id") || null,
      end_client_id: form.get("end_client_id") || null,
      description: form.get("description") || null,
      bill_rate: form.get("bill_rate") || null,
      duration_hours: form.get("duration_hours") || null,
      active: form.get("active") === "on",
      is_hot: form.get("is_hot") === "on",
    };

    const res = await fetch(`/api/positions/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/positions");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update position");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-dark/50">Loading...</p>
        </main>
      </>
    );
  }

  if (!position) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-danger">Position not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h2 className="text-xl font-bold mb-6">Edit Position</h2>
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
              defaultValue={position.title}
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
                defaultValue={position.location}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                name="type"
                required
                defaultValue={position.type}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Work Mode
              </label>
              <select
                name="work_mode"
                defaultValue={position.work_mode || ""}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">-- Select --</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <input
                name="department"
                defaultValue={position.department || ""}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Salary Range
              </label>
              <input
                name="salary_range"
                defaultValue={position.salary_range || ""}
                placeholder="e.g. $80k-$120k"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Bill Rate (Customer)
              </label>
              <input
                name="bill_rate"
                defaultValue={position.bill_rate || ""}
                placeholder="e.g. $75/hr"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Duration / Hours
              </label>
              <input
                name="duration_hours"
                defaultValue={position.duration_hours || ""}
                placeholder="e.g. 40 hrs/week, 6 months"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client</label>
              <select
                name="client_id"
                defaultValue={position.client_id || ""}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">-- No Client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                End Client
              </label>
              <select
                name="end_client_id"
                defaultValue={position.end_client_id || ""}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">-- No End Client --</option>
                {endClients.map((ec) => (
                  <option key={ec.id} value={ec.id}>
                    {ec.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={8}
              defaultValue={position.description || ""}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="active"
                defaultChecked={position.active}
                className="rounded"
              />
              Active (visible on careers page)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_hot"
                defaultChecked={position.is_hot}
                className="rounded accent-orange-500"
              />
              <span className="inline-flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-700">HOT</span>
                Mark as hot (pinned to top of dashboard)
              </span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
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
