"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";

const TOOL_REGISTRY = [
  { key: "readiness", label: "Readiness Assessment", section: "1 · Assess" },
  { key: "engagements", label: "Transformation Monitor", section: "2 · Transform" },
  { key: "governance", label: "GRC & Compliance", section: "3 · Govern" },
  { key: "methodology", label: "Methodology & Research", section: "Reference" },
  { key: "tools", label: "Free Public Tools (all 5)", section: "Reference" },
];

interface TenantData {
  site_id: string;
  name: string;
  short_name: string;
  domain: string | null;
  auth_provider: string;
  logo_url: string | null;
  primary_color: string | null;
  tagline: string | null;
  auto_provision: boolean;
  default_role: string;
  allowed_domain: string | null;
  is_owner: boolean;
  active: boolean;
  created_at: string;
}

interface ToolEntitlement {
  tool_key: string;
  enabled: boolean;
  enabled_at: string | null;
}

interface TenantUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  active: boolean;
  last_login_at: string | null;
}

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.siteId as string;

  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [entitlements, setEntitlements] = useState<Record<string, boolean>>({});
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [saving, setSaving] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", full_name: "", role: "viewer" });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [tenantRes, entRes, usersRes] = await Promise.all([
      fetch(`/api/admin/tenants/${siteId}`),
      fetch(`/api/admin/tenants/${siteId}/entitlements`),
      fetch(`/api/admin/tenants/${siteId}/users`),
    ]);

    if (tenantRes.ok) setTenant(await tenantRes.json());
    if (entRes.ok) {
      const data: ToolEntitlement[] = await entRes.json();
      const map: Record<string, boolean> = {};
      data.forEach((e) => (map[e.tool_key] = e.enabled));
      setEntitlements(map);
    }
    if (usersRes.ok) setUsers(await usersRes.json());
    setLoading(false);
  }, [siteId]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveEntitlements = async () => {
    setSaving(true);
    const items = TOOL_REGISTRY.map((t) => ({
      tool_key: t.key,
      enabled: entitlements[t.key] ?? false,
    }));

    await fetch(`/api/admin/tenants/${siteId}/entitlements`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entitlements: items }),
    });
    setSaving(false);
  };

  const addUser = async () => {
    const res = await fetch(`/api/admin/tenants/${siteId}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      setNewUser({ email: "", full_name: "", role: "viewer" });
      setShowAddUser(false);
      loadData();
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    await fetch(`/api/admin/tenants/${siteId}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    loadData();
  };

  const toggleUserActive = async (userId: string, active: boolean) => {
    await fetch(`/api/admin/tenants/${siteId}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    loadData();
  };

  const toggleTenantActive = async () => {
    if (!tenant) return;
    const newActive = !tenant.active;
    const confirmed = confirm(
      newActive
        ? `Reactivate ${tenant.name}? Users will be able to log in again.`
        : `Suspend ${tenant.name}? All users will be blocked from logging in.`
    );
    if (!confirmed) return;

    await fetch(`/api/admin/tenants/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: newActive }),
    });
    loadData();
  };

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-dark/40">Loading...</p>
        </main>
      </>
    );
  }

  if (!tenant) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-red-600">Tenant not found</p>
        </main>
      </>
    );
  }

  const activeUsers = users.filter((u) => u.active).length;
  const inactiveUsers = users.filter((u) => !u.active).length;
  let lastSection = "";

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{tenant.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded ${
                tenant.active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}>
                {tenant.active ? "Active" : "Suspended"}
              </span>
              {tenant.is_owner && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Owner</span>
              )}
            </div>
            <p className="text-sm text-dark/50 mt-1">{tenant.site_id} &middot; {tenant.domain || "No domain"}</p>
          </div>
          <button
            onClick={() => router.push("/admin/tenants")}
            className="text-sm text-dark/60 hover:text-dark"
          >
            &larr; Back to Tenants
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tool Entitlements Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-light-gray p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Tool Entitlements</h2>
                {!tenant.is_owner && (
                  <button
                    onClick={saveEntitlements}
                    disabled={saving}
                    className="px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>

              {tenant.is_owner ? (
                <p className="text-sm text-dark/50">Owner tenants have access to all tools.</p>
              ) : (
                <div className="space-y-1">
                  {TOOL_REGISTRY.map((tool) => {
                    const showSection = tool.section !== lastSection;
                    lastSection = tool.section;
                    return (
                      <div key={tool.key}>
                        {showSection && (
                          <p className="text-[10px] font-semibold text-dark/40 uppercase tracking-wider pt-3 pb-1">
                            {tool.section}
                          </p>
                        )}
                        <label className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-light-gray/50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={entitlements[tool.key] ?? false}
                            onChange={(e) =>
                              setEntitlements({ ...entitlements, [tool.key]: e.target.checked })
                            }
                            className="rounded"
                          />
                          <span className="text-sm">{tool.label}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* User Management Card */}
            <div className="bg-white rounded-lg border border-light-gray p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">
                  Users ({activeUsers} active{inactiveUsers > 0 ? `, ${inactiveUsers} inactive` : ""})
                </h2>
                <button
                  onClick={() => setShowAddUser(!showAddUser)}
                  className="px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
                >
                  + Add User
                </button>
              </div>

              {showAddUser && (
                <div className="bg-light-gray/30 rounded-lg p-4 mb-4 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Email"
                      className="px-3 py-2 border border-light-gray rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                      placeholder="Full Name"
                      className="px-3 py-2 border border-light-gray rounded-lg text-sm"
                    />
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="px-3 py-2 border border-light-gray rounded-lg text-sm"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addUser}
                      className="px-4 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddUser(false)}
                      className="px-4 py-1.5 text-dark/60 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {users.length === 0 ? (
                <p className="text-sm text-dark/40 py-4 text-center">No users yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-light-gray text-left">
                      <th className="pb-2 font-medium text-dark/60">Email</th>
                      <th className="pb-2 font-medium text-dark/60">Name</th>
                      <th className="pb-2 font-medium text-dark/60">Role</th>
                      <th className="pb-2 font-medium text-dark/60">Last Login</th>
                      <th className="pb-2 font-medium text-dark/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className={`border-b border-light-gray/50 ${!u.active ? "opacity-50" : ""}`}>
                        <td className="py-2.5">{u.email}</td>
                        <td className="py-2.5">{u.full_name}</td>
                        <td className="py-2.5">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            className="text-xs border border-light-gray rounded px-2 py-1"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="recruiter">Recruiter</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-2.5 text-dark/50 text-xs">
                          {u.last_login_at
                            ? new Date(u.last_login_at).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="py-2.5">
                          <button
                            onClick={() => toggleUserActive(u.id, !u.active)}
                            className={`text-xs ${u.active ? "text-red-600 hover:text-red-800" : "text-emerald-600 hover:text-emerald-800"}`}
                          >
                            {u.active ? "Deactivate" : "Reactivate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Tenant Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-light-gray p-6">
              <h2 className="font-semibold mb-4">Tenant Info</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-dark/50">Site ID</dt>
                  <dd className="font-mono">{tenant.site_id}</dd>
                </div>
                <div>
                  <dt className="text-dark/50">Domain</dt>
                  <dd>{tenant.domain || "—"}</dd>
                </div>
                <div>
                  <dt className="text-dark/50">Auth Provider</dt>
                  <dd className="capitalize">{tenant.auth_provider}</dd>
                </div>
                <div>
                  <dt className="text-dark/50">Auto-Provision</dt>
                  <dd>{tenant.auto_provision ? "Enabled" : "Disabled"}</dd>
                </div>
                {tenant.auto_provision && (
                  <>
                    <div>
                      <dt className="text-dark/50">Default Role</dt>
                      <dd className="capitalize">{tenant.default_role}</dd>
                    </div>
                    <div>
                      <dt className="text-dark/50">Allowed Domain</dt>
                      <dd>{tenant.allowed_domain || "Any"}</dd>
                    </div>
                  </>
                )}
                <div>
                  <dt className="text-dark/50">Primary Color</dt>
                  <dd className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded"
                      style={{ backgroundColor: tenant.primary_color || "#2563EB" }}
                    />
                    {tenant.primary_color || "#2563EB"}
                  </dd>
                </div>
                <div>
                  <dt className="text-dark/50">Tagline</dt>
                  <dd>{tenant.tagline || "Default"}</dd>
                </div>
                <div>
                  <dt className="text-dark/50">Created</dt>
                  <dd>{new Date(tenant.created_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>

            {!tenant.is_owner && (
              <button
                onClick={toggleTenantActive}
                className={`w-full py-2 text-sm rounded-lg border transition-colors ${
                  tenant.active
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {tenant.active ? "Suspend Tenant" : "Reactivate Tenant"}
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
