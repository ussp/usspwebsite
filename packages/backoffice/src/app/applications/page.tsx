export const dynamic = "force-dynamic";

import { getApplications } from "@ussp-platform/core/queries/admin/applications";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { ApplicationsTable } from "./applications-table";
import Link from "next/link";

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Applications ({applications.length})
          </h2>
          <Link
            href="/applications/new"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm rounded-lg transition-colors"
          >
            + New Application
          </Link>
        </div>
        <ApplicationsTable applications={applications} />
      </main>
    </>
  );
}
