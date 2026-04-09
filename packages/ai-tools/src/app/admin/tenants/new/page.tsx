"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

export default function NewTenantPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    site_id: "",
    name: "",
    short_name: "",
    domain: "",
    auth_provider: "google" as "google" | "microsoft",
    auto_provision: false,
    default_role: "viewer",
    allowed_domain: "",
    primary_color: "#2563EB",
    tagline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        allowed_domain: form.allowed_domain || undefined,
        tagline: form.tagline || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create tenant");
      setSaving(false);
      return;
    }

    router.push("/admin/tenants");
  };

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h1 className="text-2xl font-bold mb-6">New Tenant</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg border border-light-gray p-6 space-y-4">
            <h2 className="font-semibold text-dark mb-2">Tenant Identity</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark/70 mb-1">
                  Site ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.site_id}
                  onChange={(e) => setForm({ ...form, site_id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
                  placeholder="e.g. karsan"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm"
                  required
                />
                <p className="text-xs text-dark/40 mt-1">Permanent identifier (lowercase)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark/70 mb-1">
                  Short Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.short_name}
                  onChange={(e) => setForm({ ...form, short_name: e.target.value })}
                  placeholder="e.g. Karsan"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Karsan Consulting Services"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1">Domain</label>
              <input
                type="text"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                placeholder="e.g. tools.karsan.io"
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-light-gray p-6 space-y-4">
            <h2 className="font-semibold text-dark mb-2">Authentication</h2>

            <div>
              <label className="block text-sm font-medium text-dark/70 mb-1">Auth Provider</label>
              <select
                value={form.auth_provider}
                onChange={(e) => setForm({ ...form, auth_provider: e.target.value as "google" | "microsoft" })}
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm"
              >
                <option value="google">Google</option>
                <option value="microsoft">Microsoft (Azure AD)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="auto_provision"
                checked={form.auto_provision}
                onChange={(e) => setForm({ ...form, auto_provision: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="auto_provision" className="text-sm text-dark/70">
                Auto-provision users on first login
              </label>
            </div>

            {form.auto_provision && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div>
                  <label className="block text-sm font-medium text-dark/70 mb-1">Default Role</label>
                  <select
                    value={form.default_role}
                    onChange={(e) => setForm({ ...form, default_role: e.target.value })}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark/70 mb-1">
                    Allowed Email Domain
                  </label>
                  <input
                    type="text"
                    value={form.allowed_domain}
                    onChange={(e) => setForm({ ...form, allowed_domain: e.target.value })}
                    placeholder="e.g. karsan.io"
                    className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-light-gray p-6 space-y-4">
            <h2 className="font-semibold text-dark mb-2">Branding</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark/70 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.primary_color}
                    onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                    className="w-10 h-10 rounded border border-light-gray cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.primary_color}
                    onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-light-gray rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark/70 mb-1">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="e.g. Assess · Transform · Govern"
                  className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Tenant"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/tenants")}
              className="px-6 py-2 border border-light-gray text-dark/60 text-sm rounded-lg hover:bg-light-gray/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
