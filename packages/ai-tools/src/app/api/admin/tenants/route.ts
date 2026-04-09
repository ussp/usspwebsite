import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { StaffRole } from "@ussp-platform/core";
import {
  getAllTenants,
  getTenantStats,
  createTenant,
} from "@ussp-platform/core/queries/admin/tenants";
import { getTenantBySiteId } from "@ussp-platform/core/queries/admin/tenants";

async function requireOwnerAdmin() {
  const session = await auth();
  if (!session) return null;

  const user = session.user as Record<string, unknown>;
  const role = user.role as StaffRole;
  const siteId = user.siteId as string;

  if (role !== "admin") return null;

  // Check this user is from an owner tenant
  const tenant = await getTenantBySiteId(siteId);
  if (!tenant?.is_owner) return null;

  return { user, role, siteId, staffUserId: user.staffUserId as string };
}

export async function GET() {
  const ctx = await requireOwnerAdmin();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [tenants, stats] = await Promise.all([
    getAllTenants(),
    getTenantStats(),
  ]);

  // Merge stats into tenants
  const result = tenants.map((t) => {
    const s = stats.find((s) => s.site_id === t.site_id);
    return {
      ...t,
      active_users: s?.active_users ?? 0,
      tools_enabled: s?.tools_enabled ?? 0,
    };
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const ctx = await requireOwnerAdmin();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();

  if (!body.site_id || !body.name || !body.short_name) {
    return NextResponse.json(
      { error: "site_id, name, and short_name are required" },
      { status: 400 }
    );
  }

  const result = await createTenant(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.tenant, { status: 201 });
}
