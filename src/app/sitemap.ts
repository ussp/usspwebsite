import type { MetadataRoute } from "next";
import { getArticleSlugs } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.ussp.co";
  const lastModified = new Date();

  // Fetch published article slugs for dynamic entries
  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await getArticleSlugs();
    articleEntries = articles.map((a) => ({
      url: `${baseUrl}/insights/${a.slug}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // If DB is unavailable during build, skip dynamic articles
  }

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/healthcare`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/healthcare-staffing`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/healthcare-organization`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tops`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-transformation`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blockchain`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/small-business-solutions`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai-training`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/edge-ai`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...articleEntries,
    {
      url: `${baseUrl}/careers`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers/apply/software-engineers`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers/apply/healthcare-recruiters`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers/apply/it-consultants`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers/apply/blockchain-developers`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers/apply/data-analysts`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/careers/apply/project-managers`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/lca-page`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
