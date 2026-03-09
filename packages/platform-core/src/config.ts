import type { SiteConfig } from "./types/site.js";

let cachedConfig: SiteConfig | null = null;

export function getSiteId(): string {
  const siteId = process.env.SITE_ID;
  if (!siteId) {
    throw new Error(
      "SITE_ID environment variable is not set. " +
      "Each site must set SITE_ID (e.g. 'ussp', 'vqlab') in .env.local and hosting env vars."
    );
  }
  return siteId;
}

export function getSiteConfig(): SiteConfig {
  if (cachedConfig) return cachedConfig;

  cachedConfig = {
    siteId: getSiteId(),
    siteName: process.env.SITE_NAME || getSiteId().toUpperCase(),
    siteDomain: process.env.SITE_DOMAIN || "localhost:3000",
  };

  return cachedConfig;
}
