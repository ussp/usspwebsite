"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

interface SelectOption {
  id: string;
  name: string;
}

interface ImportedData {
  title: string | null;
  location: string | null;
  type: string | null;
  work_mode: string | null;
  description: string | null;
  salary_range: string | null;
  bill_rate: string | null;
}

export default function NewPositionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<SelectOption[]>([]);
  const [endClients, setEndClients] = useState<SelectOption[]>([]);

  // Import state
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackText, setFallbackText] = useState("");

  // Form refs for setting values after import
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const workModeRef = useRef<HTMLSelectElement>(null);
  const departmentRef = useRef<HTMLInputElement>(null);
  const salaryRef = useRef<HTMLInputElement>(null);
  const billRateRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => setClients(data));
    fetch("/api/end-clients")
      .then((r) => r.json())
      .then((data) => setEndClients(data));
  }, []);

  function fillForm(data: ImportedData) {
    if (data.title && titleRef.current) titleRef.current.value = data.title;
    if (data.location && locationRef.current)
      locationRef.current.value = data.location;
    if (data.type && typeRef.current) typeRef.current.value = data.type;
    if (data.work_mode && workModeRef.current)
      workModeRef.current.value = data.work_mode;
    if (data.salary_range && salaryRef.current)
      salaryRef.current.value = data.salary_range;
    if (data.bill_rate && billRateRef.current)
      billRateRef.current.value = data.bill_rate;
    if (data.description && descriptionRef.current)
      descriptionRef.current.value = data.description;
    setImportSuccess(true);
    setImportError("");
  }

  async function handleImport() {
    if (!linkedinUrl.trim()) return;
    setImporting(true);
    setImportError("");
    setImportSuccess(false);
    setShowFallback(false);

    try {
      const res = await fetch("/api/positions/import-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkedinUrl }),
      });
      const result = await res.json();

      if (result.success) {
        fillForm(result.data);
      } else if (result.error === "fetch_failed") {
        setShowFallback(true);
        setImportError(
          "Could not fetch from LinkedIn. Paste the job description below instead."
        );
      } else if (result.error === "invalid_url") {
        setImportError("Invalid LinkedIn URL. Use a link like linkedin.com/jobs/view/...");
      } else {
        setImportError("Could not parse the job posting. Try pasting the text instead.");
        setShowFallback(true);
      }
    } catch {
      setImportError("Network error. Try pasting the job description instead.");
      setShowFallback(true);
    } finally {
      setImporting(false);
    }
  }

  async function handleFallbackParse() {
    if (!fallbackText.trim()) return;
    setImporting(true);
    setImportError("");

    try {
      const res = await fetch("/api/positions/import-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fallbackText }),
      });
      const result = await res.json();
      if (result.success) {
        fillForm(result.data);
        setShowFallback(false);
      } else {
        setImportError("Could not parse the text. Please fill in the form manually.");
      }
    } catch {
      setImportError("Something went wrong. Please fill in the form manually.");
    } finally {
      setImporting(false);
    }
  }

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

        {/* LinkedIn Import Panel */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4 max-w-2xl">
          <h3 className="text-sm font-semibold mb-3">Import from LinkedIn</h3>
          <div className="flex gap-2">
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="Paste LinkedIn job URL (e.g. linkedin.com/jobs/view/...)"
              className="flex-1 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleImport();
                }
              }}
            />
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || !linkedinUrl.trim()}
              className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {importing ? "Importing..." : "Import"}
            </button>
          </div>

          {importError && (
            <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded mt-2">
              {importError}
            </p>
          )}

          {importSuccess && (
            <p className="text-sm text-green-700 bg-green-50 p-2 rounded mt-2">
              Imported successfully. Review the fields below and save.
            </p>
          )}

          {showFallback && (
            <div className="mt-3 space-y-2">
              <textarea
                value={fallbackText}
                onChange={(e) => setFallbackText(e.target.value)}
                rows={6}
                placeholder="Paste the full job description text here..."
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={handleFallbackParse}
                disabled={importing || !fallbackText.trim()}
                className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {importing ? "Parsing..." : "Parse Text"}
              </button>
            </div>
          )}
        </div>

        <form
          ref={formRef}
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
              ref={titleRef}
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
                ref={locationRef}
                name="location"
                required
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                ref={typeRef}
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Work Mode
              </label>
              <select
                ref={workModeRef}
                name="work_mode"
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
                ref={departmentRef}
                name="department"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Salary Range
              </label>
              <input
                ref={salaryRef}
                name="salary_range"
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
                ref={billRateRef}
                name="bill_rate"
                placeholder="e.g. $75/hr"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Duration / Hours
              </label>
              <input
                ref={durationRef}
                name="duration_hours"
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
              ref={descriptionRef}
              name="description"
              rows={8}
              className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="active"
                defaultChecked
                className="rounded"
              />
              Active (visible on careers page)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_hot"
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
