import type { Metadata } from "next";
import { Suspense } from "react";
import SectionHeading from "@/components/SectionHeading";
import { getPublishedArticles } from "@/lib/articles";
import ArticleFilters from "./ArticleFilters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights - USSP",
  description:
    "Since 2003, USSP shares IT consulting case studies, AI transformation insights, and staffing best practices from 20+ years of expertise in technology and healthcare.",
  keywords:
    "IT consulting case studies, AI transformation blog, technology insights, staffing best practices, healthcare IT, enterprise AI, USSP blog",
  openGraph: {
    title: "Insights | Case Studies & Blog - USSP",
    description:
      "Case studies and thought leadership from USSP — 20+ years of IT consulting, AI transformation, and staffing expertise.",
    type: "website",
  },
};

export default async function InsightsPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-alata)] mb-4">
            Insights
          </h1>
          <p className="text-xl text-white/80 font-[family-name:var(--font-montserrat)]">
            Case studies, thought leadership, and lessons from 20+ years of
            technology consulting
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={null}>
            <ArticleFilters articles={articles} />
          </Suspense>
        </div>
      </section>

      {/* Follow CTA */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <SectionHeading
            title="Stay Connected"
            subtitle="Follow USSP on LinkedIn for the latest insights, case studies, and company updates."
          />
          <a
            href="https://www.linkedin.com/company/ussp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-md hover:bg-[#004182] transition-colors font-[family-name:var(--font-alata)]"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Follow USSP on LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
