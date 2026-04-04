"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

interface SelectOption {
  id: string;
  name?: string;
  title?: string;
  full_name?: string;
  email?: string;
}

export default function NewAssignmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillCandidateId = searchParams.get("candidate_id") || "";

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Dropdown data
  const [candidates, setCandidates] = useState<SelectOption[]>([]);
  const [positions, setPositions] = useState<SelectOption[]>([]);
  const [clients, setClients] = useState<SelectOption[]>([]);
  const [endClients, setEndClients] = useState<SelectOption[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/candidates?candidate_type=internal_employee").then((r) => r.json()),
      fetch("/api/positions").then((r) => r.json()),
      fetch("/api/clients").then((r) => r.json()),
      fetch("/api/end-clients").then((r) => r.json()),
    ]).then(([cands, pos, cli, ec]) => {
      if (Array.isArray(cands)) setCandidates(cands);
      if (Array.isArray(pos)) setPositions(pos);
      if (Array.isArray(cli)) setClients(cli);
      if (Array.isArray(ec)) setEndClients(ec);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      candidate_id: form.get("candidate_id"),
      position_id: form.get("position_id") || null,
      client_id: form.get("client_id") || null,
      end_client_id: form.get("end_client_id") || null,
      role_title: form.get("role_title"),
      start_date: form.get("start_date"),
      end_date: form.get("end_date") || null,
      bill_rate: form.get("bill_rate") || null,
      pay_rate: form.get("pay_rate") || null,
      status: "active",
      notes: form.get("notes") || null,
    };

    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      // Update candidate status to on_assignment
      if (body.candidate_id) {
        await fetch(`/api/candidates/${body.candidate_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ current_status: "on_assignment" }),
        });
      }
      router.push("/assignments");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create assignment");
      setSaving(false);
    }
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <button
          onClick={() => router.push("/assignments")}
          className="text-sm text-dark/50 hover:text-primary transition-colors mb-2 inline-block"
        >
          &larr; Back to Assignments
        </button>
        <h2 className="text-xl font-bold mb-6">New Assignment</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-light-gray p-6 max-w-2xl space-y-5"
        >
          {error && (
            <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* Candidate */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Employee / Candidate *
            </label>
            <select
              name="candidate_id"
              required
              defaultValue={prefillCandidateId}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select candidate...</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Role Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Role Title *
            </label>
            <input
              name="role_title"
              required
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          {/* Position (optional - link to tracked position) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Linked Position
            </label>
            <select
              name="position_id"
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">None (external placement)</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client</label>
              <select
                name="client_id"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select client...</option>
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
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select end client...</option>
                {endClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date *
              </label>
              <input
                name="start_date"
                type="date"
                required
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                End Date
              </label>
              <input
                name="end_date"
                type="date"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Bill Rate ($/hr)
              </label>
              <input
                name="bill_rate"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. 85"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Pay Rate ($/hr)
              </label>
              <input
                name="pay_rate"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. 55"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              rows={3}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Any additional notes about this assignment..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Assignment"}
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
