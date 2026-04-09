import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { StaffRole } from "@ussp-platform/core";
import {
  getTenantBySiteId,
  getToolEntitlements,
  bulkUpdateToolEntitlements,
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
  const entitlements = await getToolEntitlements(siteId);
  return NextResponse.json(entitlements);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const ctx = await requireOwnerAdmin();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { siteId } = await params;
  const body = await request.json();

  if (!Array.isArray(body.entitlements)) {
    return NextResponse.json(
      { error: "entitlements array is required" },
      { status: 400 }
    );
  }

  const result = await bulkUpdateToolEntitlements(
    siteId,
    body.entitlements,
    ctx.staffUserId
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
