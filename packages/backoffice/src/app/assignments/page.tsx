export const dynamic = "force-dynamic";

import { getAssignments } from "@ussp-platform/core/queries/admin/assignments";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { AssignmentsTable } from "./assignments-table";

export const metadata = { title: "Assignments" };

export default async function AssignmentsPage() {
  const assignments = await getAssignments();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Assignments ({assignments.length})</h2>
        </div>
        <AssignmentsTable assignments={assignments} />
      </main>
    </>
  );
}
