export const dynamic = "force-dynamic";

import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import {
  getCustomTaxonomyNodes,
  getUnresolvedSkills,
  getTaxonomySummary,
} from "@ussp-platform/core/queries/admin/taxonomy";
import { TaxonomyDashboard } from "./taxonomy-dashboard";

export const metadata = { title: "Taxonomy" };

export default async function TaxonomyPage() {
  const [customNodes, unresolvedSkills, summary] = await Promise.all([
    getCustomTaxonomyNodes(),
    getUnresolvedSkills(false),
    getTaxonomySummary(),
  ]);

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Skills Taxonomy</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage the skills, certifications, and domain knowledge used for candidate matching
            </p>
          </div>
        </div>

        <TaxonomyDashboard
          customNodes={customNodes}
          unresolvedSkills={unresolvedSkills}
          summary={summary}
        />
      </main>
    </>
  );
}
