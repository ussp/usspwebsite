import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { StaffRole } from "@ussp-platform/core";
import {
  getTenantBySiteId,
  getTenantUsers,
  createTenantUser,
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
  const users = await getTenantUsers(siteId);
  return NextResponse.json(users);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const ctx = await requireOwnerAdmin();
  if (!ctx) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { siteId } = await params;
  const body = await request.json();

  if (!body.email || !body.full_name || !body.role) {
    return NextResponse.json(
      { error: "email, full_name, and role are required" },
      { status: 400 }
    );
  }

  const result = await createTenantUser(siteId, body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
