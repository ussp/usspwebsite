export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { connection } from "next/server";
import { getAssignments } from "@ussp-platform/core/queries/admin/assignments";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import Link from "next/link";
import { AssignmentsTable } from "./assignments-table";

export const metadata = { title: "Assignments" };

export default async function AssignmentsPage() {
  await connection();
  const assignments = await getAssignments();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Assignments ({assignments.length})</h2>
          <Link
            href="/assignments/new"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            + New Assignment
          </Link>
        </div>
        <Suspense>
          <AssignmentsTable assignments={assignments} />
        </Suspense>
      </main>
    </>
  );
}
