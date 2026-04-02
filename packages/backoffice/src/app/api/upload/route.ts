import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import { handleUpload } from "@ussp-platform/core/api/upload";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "applications.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const result = await handleUpload(body);
  return NextResponse.json(result.body, { status: result.status });
}
