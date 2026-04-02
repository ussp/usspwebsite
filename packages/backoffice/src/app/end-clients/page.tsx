import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import Link from "next/link";
import type { AdminEndClient } from "@ussp-platform/core/types/admin";

export const dynamic = "force-dynamic";

async function getEndClients(): Promise<AdminEndClient[]> {
  const { getAllEndClients } = await import(
    "@ussp-platform/core/queries/admin/end-clients"
  );
  return getAllEndClients();
}

export default async function EndClientsPage() {
  const endClients = await getEndClients();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">End Clients</h2>
          <Link
            href="/end-clients/new"
            title="Add the final client organization where a candidate will be placed"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            + New End Client
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-light-gray overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-light-gray/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Description</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-gray">
              {endClients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-dark/50">
                    No end clients yet. Add one to get started.
                  </td>
                </tr>
              )}
              {endClients.map((ec) => (
                <tr
                  key={ec.id}
                  className="hover:bg-light-gray/30 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/end-clients/${ec.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {ec.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-dark/70 max-w-md truncate">
                    {ec.description || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs ${
                        ec.active
                          ? "bg-success/10 text-success"
                          : "bg-dark/10 text-dark/50"
                      }`}
                    >
                      {ec.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark/50">
                    {new Date(ec.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
