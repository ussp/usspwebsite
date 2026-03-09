import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getPublishedArticles } from "@/lib/articles";
import ShareButtons from "@/components/ShareButtons";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.ussp.co";

function readTime(body: string): string {
  const words = body.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };

  const title = article.meta_title || `${article.title} | USSP`;
  const description =
    article.meta_description ||
    article.excerpt ||
    `${article.title} — insights from USSP, Since 2003.`;

  return {
    title,
    description,
    keywords: article.meta_keywords || undefined,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${BASE_URL}/insights/${article.slug}`,
      images: article.featured_image_url
        ? [{ url: article.featured_image_url, width: 1200, height: 627 }]
        : undefined,
      publishedTime: article.published_at || undefined,
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.featured_image_url
        ? [article.featured_image_url]
        : undefined,
    },
    alternates: {
      canonical: `${BASE_URL}/insights/${article.slug}`,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const articleUrl = `${BASE_URL}/insights/${article.slug}`;

  // Fetch related articles (same type, exclude current)
  const allArticles = await getPublishedArticles(article.content_type);
  const related = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const isCaseStudy = article.content_type === "case_study";
  const csd = article.case_study_data;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isCaseStudy ? "Article" : "BlogPosting",
    headline: article.title,
    description: article.excerpt || article.title,
    ...(article.featured_image_url && { image: article.featured_image_url }),
    ...(article.published_at && { datePublished: article.published_at }),
    ...(article.published_at && { dateModified: article.published_at }),
    author: {
      "@type": "Person",
      name: article.author || "USSP Team",
    },
    publisher: {
      "@type": "Organization",
      name: "US Software Professionals Inc.",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(isCaseStudy &&
      csd?.industry && {
        about: {
          "@type": "Thing",
          name: csd.industry,
        },
      }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Insights",
        item: `${BASE_URL}/insights`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-near-black text-white">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/insights"
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6 font-[family-name:var(--font-montserrat)] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Insights
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`inline-block text-xs px-2.5 py-1 rounded-full ${
                isCaseStudy
                  ? "bg-primary/20 text-primary-lighter"
                  : "bg-purple-500/20 text-purple-300"
              }`}
            >
              {isCaseStudy ? "Case Study" : "Blog Post"}
            </span>
            <span className="text-sm text-white/50 font-[family-name:var(--font-montserrat)]">
              {readTime(article.body)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-alata)] mb-4">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-lg text-white/70 font-[family-name:var(--font-montserrat)]">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 mt-6 text-sm text-white/50 font-[family-name:var(--font-montserrat)]">
            {article.author && <span>By {article.author}</span>}
            {article.published_at && (
              <span>
                {new Date(article.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured image */}
      {article.featured_image_url && (
        <div className="max-w-4xl mx-auto px-4 -mt-1">
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="w-full rounded-lg shadow-lg aspect-[16/9] object-cover"
          />
        </div>
      )}

      {/* Article content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Share buttons (top) */}
          <div className="mb-8">
            <ShareButtons
              url={articleUrl}
              title={article.title}
              excerpt={article.excerpt || undefined}
            />
          </div>

          {/* Case study structured data */}
          {isCaseStudy && csd && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {csd.challenge && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-5">
                  <h3 className="text-sm font-[family-name:var(--font-alata)] text-red-800 mb-2">
                    Challenge
                  </h3>
                  <p className="text-sm text-red-700/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
                    {csd.challenge}
                  </p>
                </div>
              )}
              {csd.solution && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                  <h3 className="text-sm font-[family-name:var(--font-alata)] text-blue-800 mb-2">
                    Solution
                  </h3>
                  <p className="text-sm text-blue-700/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
                    {csd.solution}
                  </p>
                </div>
              )}
              {csd.result && (
                <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                  <h3 className="text-sm font-[family-name:var(--font-alata)] text-green-800 mb-2">
                    Result
                  </h3>
                  <p className="text-sm text-green-700/80 font-[family-name:var(--font-montserrat)] leading-relaxed">
                    {csd.result}
                  </p>
                </div>
              )}
            </div>
          )}

          {isCaseStudy && csd && (csd.client_name || csd.industry) && (
            <div className="flex gap-4 mb-8 text-sm font-[family-name:var(--font-montserrat)]">
              {csd.client_name && (
                <span className="bg-light-gray px-3 py-1 rounded-full text-dark/70">
                  Client: {csd.client_name}
                </span>
              )}
              {csd.industry && (
                <span className="bg-light-gray px-3 py-1 rounded-full text-dark/70">
                  Industry: {csd.industry}
                </span>
              )}
            </div>
          )}

          {/* Body content — rendered as plain text with line breaks for now */}
          <div className="prose prose-lg max-w-none font-[family-name:var(--font-montserrat)] text-dark/80 leading-relaxed">
            {article.body.split("\n\n").map((paragraph, i) => {
              // Simple markdown-lite: headings
              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="text-xl font-[family-name:var(--font-alata)] text-dark mt-8 mb-4"
                  >
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-2xl font-[family-name:var(--font-alata)] text-dark mt-10 mb-4"
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              // Bullet lists
              if (paragraph.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 my-4">
                    {paragraph.split("\n").map((line, j) => (
                      <li key={j}>{line.replace(/^- /, "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-dark/10">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-light-gray text-dark/60 px-3 py-1 rounded-full font-[family-name:var(--font-montserrat)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share buttons (bottom) */}
          <div className="mt-8 pt-6 border-t border-dark/10">
            <ShareButtons
              url={articleUrl}
              title={article.title}
              excerpt={article.excerpt || undefined}
            />
          </div>

          {/* Follow CTA */}
          <div className="mt-8 p-6 bg-light-gray rounded-lg text-center">
            <p className="text-sm text-dark/70 font-[family-name:var(--font-montserrat)] mb-3">
              Enjoyed this article? Follow USSP on LinkedIn for more insights.
            </p>
            <a
              href="https://www.linkedin.com/company/ussp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white text-sm rounded-md hover:bg-[#004182] transition-colors font-[family-name:var(--font-alata)]"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Follow USSP on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="py-16 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-[family-name:var(--font-alata)] text-center mb-10">
              Related {isCaseStudy ? "Case Studies" : "Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/insights/${r.slug}`}
                  className="group bg-white border border-dark/10 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {r.featured_image_url && (
                    <div className="aspect-[16/9] bg-light-gray overflow-hidden">
                      <img
                        src={r.featured_image_url}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-[family-name:var(--font-alata)] group-hover:text-primary transition-colors mb-2">
                      {r.title}
                    </h3>
                    {r.excerpt && (
                      <p className="text-sm text-dark/60 font-[family-name:var(--font-montserrat)] line-clamp-2">
                        {r.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
