import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { StaffRole } from "@ussp-platform/core";
import {
  getTenantBySiteId,
  updateTenant,
} from "@ussp-platform/core/queries/admin/tenants";

async function requireOwnerAdmin() {
  const session = await auth();
  if (!session) return null;

  const user = session.user as Record<string, unknown>;
  const role = user.role as StaffRole;
  const siteId = user.siteId as string;

  if (role !== "admin") return null;

  const tenant = await getTenantBySiteId(siteId);
  if (!tenant?.is_owner) return null;

  return { user, role, siteId, staffUserId: user.staffUserId as string };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const ctx = await requireOwnerAdmin();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { siteId } = await params;
  const tenant = await getTenantBySiteId(siteId);
  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  return NextResponse.json(tenant);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const ctx = await requireOwnerAdmin();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { siteId } = await params;
  const body = await request.json();
  const result = await updateTenant(siteId, body);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.tenant);
}
