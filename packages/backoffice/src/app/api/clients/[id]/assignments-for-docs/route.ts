// Rate-free assignment projection for the Work Order picker and card display.
// NEVER add bill_rate / pay_rate to this response — that would leak into
// downstream UI paths tied to document views.

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import { clientDocuments } from "@ussp-platform/core";
import type { StaffRole } from "@ussp-platform/core";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "client_documents.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: clientId } = await params;
  const summaries = await clientDocuments.listAssignmentsForClient(clientId);
  return NextResponse.json({ data: summaries });
}
