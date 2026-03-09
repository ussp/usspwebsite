export const dynamic = "force-dynamic";

import Link from "next/link";
import { getStaffUsers } from "@ussp-platform/core/queries/admin/staff";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { StaffTable } from "./staff-table";

export const metadata = { title: "Staff" };

export default async function StaffPage() {
  const staff = await getStaffUsers();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Staff ({staff.length})</h2>
          <Link
            href="/staff/new"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Add Staff
          </Link>
        </div>
        <StaffTable staff={staff} />
      </main>
    </>
  );
}
