import { getServiceClient } from "../../supabase/server.js";
import type {
  Tenant,
  CreateTenantInput,
  UpdateTenantInput,
  TenantToolEntitlement,
  UpdateToolEntitlementInput,
} from "../../types/tenant.js";

const TENANT_COLUMNS =
  "id, site_id, name, short_name, domain, auth_provider, logo_url, favicon_url, primary_color, tagline, auto_provision, default_role, allowed_domain, is_owner, active, created_at, updated_at";

// ── Tenant CRUD ────────────────────────────────────────────────────

export async function getAllTenants(): Promise<Tenant[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("tenants")
    .select(TENANT_COLUMNS)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function getTenantBySiteId(
  siteId: string
): Promise<Tenant | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("tenants")
    .select(TENANT_COLUMNS)
    .eq("site_id", siteId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function createTenant(
  input: CreateTenantInput
): Promise<{ success: boolean; tenant?: Tenant; error?: string }> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("tenants")
    .insert({
      site_id: input.site_id,
      name: input.name,
      short_name: input.short_name,
      domain: input.domain,
      auth_provider: input.auth_provider || "google",
      logo_url: input.logo_url,
      favicon_url: input.favicon_url,
      primary_color: input.primary_color || "#2563EB",
      tagline: input.tagline,
      auto_provision: input.auto_provision ?? false,
      default_role: input.default_role || "viewer",
      allowed_domain: input.allowed_domain,
      is_owner: input.is_owner ?? false,
    })
    .select(TENANT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, tenant: data };
}

export async function updateTenant(
  siteId: string,
  input: UpdateTenantInput
): Promise<{ success: boolean; tenant?: Tenant; error?: string }> {
  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) updateData.name = input.name;
  if (input.short_name !== undefined) updateData.short_name = input.short_name;
  if (input.domain !== undefined) updateData.domain = input.domain;
  if (input.auth_provider !== undefined) updateData.auth_provider = input.auth_provider;
  if (input.logo_url !== undefined) updateData.logo_url = input.logo_url;
  if (input.favicon_url !== undefined) updateData.favicon_url = input.favicon_url;
  if (input.primary_color !== undefined) updateData.primary_color = input.primary_color;
  if (input.tagline !== undefined) updateData.tagline = input.tagline;
  if (input.auto_provision !== undefined) updateData.auto_provision = input.auto_provision;
  if (input.default_role !== undefined) updateData.default_role = input.default_role;
  if (input.allowed_domain !== undefined) updateData.allowed_domain = input.allowed_domain;
  if (input.active !== undefined) updateData.active = input.active;

  const { data, error } = await supabase
    .from("tenants")
    .update(updateData)
    .eq("site_id", siteId)
    .select(TENANT_COLUMNS)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, tenant: data };
}

// ── Tool Entitlements ──────────────────────────────────────────────

export async function getToolEntitlements(
  siteId: string
): Promise<TenantToolEntitlement[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("tenant_tool_entitlements")
    .select("*")
    .eq("site_id", siteId)
    .order("tool_key");

  if (error || !data) return [];
  return data;
}

export async function getEnabledToolKeys(
  siteId: string
): Promise<string[]> {
  const supabase = getServiceClient();

  // Check if this is an owner tenant (gets all tools)
  const { data: tenant } = await supabase
    .from("tenants")
    .select("is_owner")
    .eq("site_id", siteId)
    .single();

  if (tenant?.is_owner) {
    // Owner tenants get everything
    return ["readiness", "engagements", "governance", "methodology", "tools"];
  }

  const { data, error } = await supabase
    .from("tenant_tool_entitlements")
    .select("tool_key")
    .eq("site_id", siteId)
    .eq("enabled", true);

  if (error || !data) return [];
  return data.map((row) => row.tool_key);
}

export async function updateToolEntitlement(
  siteId: string,
  input: UpdateToolEntitlementInput,
  enabledBy?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const now = new Date().toISOString();

  // Upsert — insert if not exists, update if exists
  const { error } = await supabase
    .from("tenant_tool_entitlements")
    .upsert(
      {
        site_id: siteId,
        tool_key: input.tool_key,
        enabled: input.enabled,
        enabled_by: input.enabled ? enabledBy : null,
        enabled_at: input.enabled ? now : null,
        updated_at: now,
      },
      { onConflict: "site_id,tool_key" }
    );

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function bulkUpdateToolEntitlements(
  siteId: string,
  entitlements: UpdateToolEntitlementInput[],
  enabledBy?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();
  const now = new Date().toISOString();

  const rows = entitlements.map((e) => ({
    site_id: siteId,
    tool_key: e.tool_key,
    enabled: e.enabled,
    enabled_by: e.enabled ? enabledBy : null,
    enabled_at: e.enabled ? now : null,
    updated_at: now,
  }));

  const { error } = await supabase
    .from("tenant_tool_entitlements")
    .upsert(rows, { onConflict: "site_id,tool_key" });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Tenant User Management (cross-tenant) ──────────────────────────

export async function getTenantUsers(siteId: string) {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("staff_users")
    .select("id, site_id, email, full_name, role, avatar_url, active, last_login_at, created_at, updated_at")
    .eq("site_id", siteId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function createTenantUser(
  siteId: string,
  input: { email: string; full_name: string; role: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase.from("staff_users").insert({
    site_id: siteId,
    email: input.email,
    full_name: input.full_name,
    role: input.role,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateTenantUser(
  siteId: string,
  userId: string,
  input: { full_name?: string; role?: string; active?: boolean }
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (input.full_name !== undefined) updateData.full_name = input.full_name;
  if (input.role !== undefined) updateData.role = input.role;
  if (input.active !== undefined) updateData.active = input.active;

  const { error } = await supabase
    .from("staff_users")
    .update(updateData)
    .eq("site_id", siteId)
    .eq("id", userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteTenantUser(
  siteId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("staff_users")
    .delete()
    .eq("site_id", siteId)
    .eq("id", userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Tenant Stats (for list view) ───────────────────────────────────

export async function getTenantStats(): Promise<
  Array<{ site_id: string; active_users: number; tools_enabled: number }>
> {
  const supabase = getServiceClient();

  const [tenantsRes, usersRes, toolsRes] = await Promise.all([
    supabase.from("tenants").select("site_id"),
    supabase.from("staff_users").select("site_id, active"),
    supabase.from("tenant_tool_entitlements").select("site_id, enabled"),
  ]);

  const tenantIds = (tenantsRes.data || []).map((t) => t.site_id);
  const users = usersRes.data || [];
  const tools = toolsRes.data || [];

  return tenantIds.map((siteId) => ({
    site_id: siteId,
    active_users: users.filter((u) => u.site_id === siteId && u.active).length,
    tools_enabled: tools.filter((t) => t.site_id === siteId && t.enabled).length,
  }));
}
