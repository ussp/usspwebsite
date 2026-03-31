import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  updateApplicationNote,
  deleteApplicationNote,
} from "@ussp-platform/core/queries/admin/applications";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "applications.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { noteId } = await params;
  const body = await request.json();
  const result = await updateApplicationNote(noteId, body.content);

  if (!result.success)
    return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "applications.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { noteId } = await params;
  const result = await deleteApplicationNote(noteId);

  if (!result.success)
    return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ success: true });
}
