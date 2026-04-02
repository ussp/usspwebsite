import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import Link from "next/link";
import type { AdminClient } from "@ussp-platform/core/types/admin";

export const dynamic = "force-dynamic";

async function getClients(): Promise<AdminClient[]> {
  const { getAllClients } = await import(
    "@ussp-platform/core/queries/admin/clients"
  );
  return getAllClients();
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Clients</h2>
          <Link
            href="/clients/new"
            title="Add a direct client who contracts with USSP for staffing services"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            + New Client
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
              {clients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-dark/50">
                    No clients yet. Add one to get started.
                  </td>
                </tr>
              )}
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-light-gray/30 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {client.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-dark/70 max-w-md truncate">
                    {client.description || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs ${
                        client.active
                          ? "bg-success/10 text-success"
                          : "bg-dark/10 text-dark/50"
                      }`}
                    >
                      {client.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark/50">
                    {new Date(client.created_at).toLocaleDateString()}
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
