export const dynamic = "force-dynamic";

import { getCandidates } from "@ussp-platform/core/queries/admin/candidates";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { CandidatesTable } from "./candidates-table";

export const metadata = { title: "Candidates" };

export default async function CandidatesPage() {
  const candidates = await getCandidates();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Candidates ({candidates.length})</h2>
        </div>
        <CandidatesTable candidates={candidates} />
      </main>
    </>
  );
}
