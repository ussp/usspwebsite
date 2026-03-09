export interface SiteConfig {
  siteId: string;
  siteName: string;
  siteDomain: string;
}

export interface SiteRecord {
  id: string;
  name: string;
  domain: string;
  config: Record<string, unknown>;
  active: boolean;
  created_at: string;
}
