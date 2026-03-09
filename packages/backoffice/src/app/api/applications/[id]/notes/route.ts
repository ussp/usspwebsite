import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getApplicationNotes,
  addApplicationNote,
} from "@ussp-platform/core/queries/admin/applications";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const notes = await getApplicationNotes(id);
  return NextResponse.json(notes);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "applications.update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const staffUserId = user.staffUserId as string;

  const result = await addApplicationNote(id, staffUserId, body.content);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json(result.note, { status: 201 });
}
