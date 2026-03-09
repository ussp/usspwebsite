"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Article } from "@/lib/articles";

const tabs = [
  { key: "all", label: "All" },
  { key: "case_study", label: "Case Studies" },
  { key: "blog_post", label: "Blog Posts" },
] as const;

function readTime(body: string): string {
  const words = body.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function ArticleFilters({ articles }: { articles: Article[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeType = searchParams.get("type") || "all";

  const filtered =
    activeType === "all"
      ? articles
      : articles.filter((a) => a.content_type === activeType);

  function setType(type: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    router.push(`/insights${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-10 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setType(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-[family-name:var(--font-alata)] transition-colors ${
              activeType === tab.key
                ? "bg-primary text-white"
                : "bg-light-gray text-dark/70 hover:bg-dark/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-dark/50 font-[family-name:var(--font-montserrat)] py-12">
          No articles published yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="group bg-white border border-dark/10 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              {article.featured_image_url && (
                <div className="aspect-[16/9] bg-light-gray overflow-hidden">
                  <img
                    src={article.featured_image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-block text-xs px-2.5 py-1 rounded-full font-[family-name:var(--font-montserrat)] ${
                      article.content_type === "case_study"
                        ? "bg-primary/10 text-primary"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {article.content_type === "case_study"
                      ? "Case Study"
                      : "Blog Post"}
                  </span>
                  <span className="text-xs text-dark/40 font-[family-name:var(--font-montserrat)]">
                    {readTime(article.body)}
                  </span>
                </div>
                <h3 className="text-lg font-[family-name:var(--font-alata)] mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)] leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between text-xs text-dark/40 font-[family-name:var(--font-montserrat)]">
                  {article.author && <span>{article.author}</span>}
                  {article.published_at && (
                    <span>
                      {new Date(article.published_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
