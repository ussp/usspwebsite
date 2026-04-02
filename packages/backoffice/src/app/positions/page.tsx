export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllPositionsWithCounts } from "@ussp-platform/core/queries/admin/positions";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { PositionsTable } from "./positions-table";

export const metadata = { title: "Positions" };

export default async function PositionsPage() {
  const positions = await getAllPositionsWithCounts();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Positions ({positions.length})
          </h2>
          <Link
            href="/positions/new"
            title="Create a new job posting — it will appear on the careers page once activated"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            + New Position
          </Link>
        </div>
        <PositionsTable positions={positions} />
      </main>
    </>
  );
}
