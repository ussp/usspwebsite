// ── Tenant Types ───────────────────────────────────────────────────

export type AuthProvider = "google" | "microsoft";

export interface Tenant {
  id: string;
  site_id: string;
  name: string;
  short_name: string;
  domain: string | null;
  auth_provider: AuthProvider;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  tagline: string | null;
  auto_provision: boolean;
  default_role: string;
  allowed_domain: string | null;
  is_owner: boolean;
  active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface CreateTenantInput {
  site_id: string;
  name: string;
  short_name: string;
  domain?: string;
  auth_provider?: AuthProvider;
  logo_url?: string;
  favicon_url?: string;
  primary_color?: string;
  tagline?: string;
  auto_provision?: boolean;
  default_role?: string;
  allowed_domain?: string;
  is_owner?: boolean;
}

export interface UpdateTenantInput {
  name?: string;
  short_name?: string;
  domain?: string;
  auth_provider?: AuthProvider;
  logo_url?: string | null;
  favicon_url?: string | null;
  primary_color?: string | null;
  tagline?: string | null;
  auto_provision?: boolean;
  default_role?: string;
  allowed_domain?: string | null;
  active?: boolean;
}

// ── Tool Entitlements ──────────────────────────────────────────────

export interface TenantToolEntitlement {
  id: string;
  site_id: string;
  tool_key: string;
  enabled: boolean;
  enabled_by: string | null;
  enabled_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface UpdateToolEntitlementInput {
  tool_key: string;
  enabled: boolean;
}

// ── Tool Keys Registry ─────────────────────────────────────────────

export const TOOL_KEYS = [
  "readiness",
  "engagements",
  "governance",
  "methodology",
  "tools",
] as const;

export type ToolKey = (typeof TOOL_KEYS)[number];

export const TOOL_KEY_LABELS: Record<ToolKey, string> = {
  readiness: "Readiness Assessment",
  engagements: "Transformation Monitor",
  governance: "GRC & Compliance",
  methodology: "Methodology & Research",
  tools: "Free Public Tools",
};

export const TOOL_KEY_SECTIONS: Record<ToolKey, string> = {
  readiness: "1 · Assess",
  engagements: "2 · Transform",
  governance: "3 · Govern",
  methodology: "Reference",
  tools: "Reference",
};
