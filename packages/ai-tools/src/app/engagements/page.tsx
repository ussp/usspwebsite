import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllEngagements } from "@ussp-platform/core/queries/admin/ai-engagements";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import StatusBadge from "@/components/StatusBadge";
import type { EngagementStatus } from "@ussp-platform/core";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EngagementsListPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const engagements = await getAllEngagements();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Engagements</h1>
          <Link
            href="/engagements/new"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            New Engagement
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-light-gray">
          {engagements.length === 0 ? (
            <p className="text-sm text-dark/40 py-12 text-center">
              No engagements yet. Create your first engagement to start measuring AI transformation.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-light-gray text-left">
                  <th className="px-5 py-3 font-medium text-dark/60">Name</th>
                  <th className="px-5 py-3 font-medium text-dark/60">Client</th>
                  <th className="px-5 py-3 font-medium text-dark/60">Integration</th>
                  <th className="px-5 py-3 font-medium text-dark/60">Status</th>
                  <th className="px-5 py-3 font-medium text-dark/60">Created</th>
                </tr>
              </thead>
              <tbody>
                {engagements.map((eng) => (
                  <tr key={eng.id} className="border-b border-light-gray/50 hover:bg-light-gray/30">
                    <td className="px-5 py-3">
                      <Link
                        href={`/engagements/${eng.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {eng.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-dark/60">{eng.client_name}</td>
                    <td className="px-5 py-3 text-dark/50 capitalize">
                      {eng.integration_type || "manual"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={eng.status as EngagementStatus} />
                    </td>
                    <td className="px-5 py-3 text-dark/50">
                      {new Date(eng.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
