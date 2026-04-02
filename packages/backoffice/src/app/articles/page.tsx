export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllArticles } from "@ussp-platform/core/queries/admin/articles";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { ArticlesTable } from "./articles-table";

export const metadata = { title: "Articles" };

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Articles ({articles.length})
          </h2>
          <Link
            href="/articles/new"
            title="Write a new article or insight — will be published on the website's Insights page"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
          >
            + New Article
          </Link>
        </div>
        <ArticlesTable articles={articles} />
      </main>
    </>
  );
}
