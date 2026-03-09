export const dynamic = "force-dynamic";

import { getApplications } from "@ussp-platform/core/queries/admin/applications";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { ApplicationsTable } from "./applications-table";

export const metadata = { title: "Applications" };

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const applications = await getApplications({
    status: params.status as import("@ussp-platform/core/types/admin").ApplicationStatus | undefined,
    search: params.search,
  });

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <h2 className="text-xl font-bold mb-6">
          Applications ({applications.length})
        </h2>
        <ApplicationsTable applications={applications} />
      </main>
    </>
  );
}
