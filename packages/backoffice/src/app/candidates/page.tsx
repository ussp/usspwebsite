export const dynamic = "force-dynamic";

import { getCandidates } from "@ussp-platform/core/queries/admin/candidates";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import Link from "next/link";
import { CandidatesTable } from "./candidates-table";

export const metadata = { title: "Candidates" };

export default async function CandidatesPage() {
  const candidates = await getCandidates();
  const benchCount = candidates.filter(
    (c) => c.candidate_type === "internal_employee" && c.current_status === "available"
  ).length;

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Candidates ({candidates.length})</h2>
            {benchCount > 0 && (
              <p className="text-sm text-dark/50 mt-0.5">
                {benchCount} on bench
              </p>
            )}
          </div>
          <Link
            href="/candidates/new"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Add Candidate
          </Link>
        </div>
        <CandidatesTable candidates={candidates} />
      </main>
    </>
  );
}
