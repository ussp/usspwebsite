"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import { ENTITY_TYPE_LABELS, COMPANY_SIZE_LABELS } from "@ussp-platform/core";
import InfoTip from "@/components/InfoTip";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia",
];

export default function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [form, setForm] = useState({
    name: "", industry: "", entity_type: "private", state: "", size: "", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    fetch(`/api/readiness/${id}/company`).then((r) => r.json()).then((data) => {
      if (data) setForm({
        name: data.name || "",
        industry: data.industry || "",
        entity_type: data.entity_type || "private",
        state: data.state || "",
        size: data.size || "",
        notes: data.notes || "",
      });
    });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/readiness/${id}/company`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleNext() {
    handleSave().then(() => router.push(`/readiness/${id}/team`));
  }

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-3xl">
        <ReadinessSteps assessmentId={id} currentStep={1} status={assessment?.status || "draft"} />

        <h1 className="text-xl font-bold mb-1">Company Profile</h1>
        <p className="text-sm text-dark/50 mb-6">Enter information about the organization being assessed.</p>

        <div className="bg-white rounded-lg border border-light-gray p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name *<InfoTip text="The legal or commonly known name of the organization being assessed. This appears in the report header." /></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Entity Type *<InfoTip text="Determines which AI regulations and compliance requirements apply. State agencies and universities have additional regulatory questions." /></label>
              <select value={form.entity_type} onChange={(e) => setForm({ ...form, entity_type: e.target.value })}
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                {Object.entries(ENTITY_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v as string}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                placeholder="e.g., Healthcare, Finance, Government"
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">State / Jurisdiction<InfoTip text="Used to identify applicable state-level AI regulations. The report will link to relevant legal text." /></label>
              <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Select state...</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Organization Size<InfoTip text="Helps calibrate questionnaire complexity and report recommendations for the org's scale." /></label>
              <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Select size...</option>
                {Object.entries(COMPANY_SIZE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v as string}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3} placeholder="Any additional context about the organization..."
              className="w-full border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button onClick={handleSave} disabled={saving}
            className="text-sm text-dark/50 hover:text-dark disabled:opacity-50">
            {saving ? "Saving..." : saved ? "Saved \u2713" : "Save Draft"}
          </button>
          <button onClick={handleNext}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: Team Setup &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
