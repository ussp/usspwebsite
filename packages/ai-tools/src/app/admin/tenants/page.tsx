import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import Link from "next/link";
import { getAllTenants, getTenantStats } from "@ussp-platform/core/queries/admin/tenants";
import { getTenantBySiteId } from "@ussp-platform/core/queries/admin/tenants";

export const dynamic = "force-dynamic";

export default async function TenantsListPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Verify owner admin
  const user = session.user as Record<string, unknown>;
  const siteId = user.siteId as string;
  const role = user.role as string;
  const currentTenant = await getTenantBySiteId(siteId);
  if (role !== "admin" || !currentTenant?.is_owner) redirect("/");

  const [tenants, stats] = await Promise.all([
    getAllTenants(),
    getTenantStats(),
  ]);

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tenant Management</h1>
            <p className="text-sm text-dark/50 mt-1">Manage tenants, tool access, and users across all sites</p>
          </div>
          <Link
            href="/admin/tenants/new"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            + New Tenant
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-light-gray">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-light-gray text-left">
                <th className="px-5 py-3 font-medium text-dark/60">Tenant</th>
                <th className="px-5 py-3 font-medium text-dark/60">Domain</th>
                <th className="px-5 py-3 font-medium text-dark/60">Auth</th>
                <th className="px-5 py-3 font-medium text-dark/60">Users</th>
                <th className="px-5 py-3 font-medium text-dark/60">Tools</th>
                <th className="px-5 py-3 font-medium text-dark/60">Status</th>
                <th className="px-5 py-3 font-medium text-dark/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => {
                const s = stats.find((s) => s.site_id === t.site_id);
                return (
                  <tr key={t.id} className="border-b border-light-gray/50 hover:bg-light-gray/30">
                    <td className="px-5 py-3">
                      <div>
                        <span className="font-medium">{t.name}</span>
                        {t.is_owner && (
                          <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            Owner
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-dark/40">{t.site_id}</span>
                    </td>
                    <td className="px-5 py-3 text-dark/60">{t.domain || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        t.auth_provider === "microsoft"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {t.auth_provider === "microsoft" ? "Microsoft" : "Google"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-dark/60">{s?.active_users ?? 0}</td>
                    <td className="px-5 py-3 text-dark/60">
                      {t.is_owner ? "All" : `${s?.tools_enabled ?? 0}/5`}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        t.active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {t.active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/tenants/${t.site_id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        Configure
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
