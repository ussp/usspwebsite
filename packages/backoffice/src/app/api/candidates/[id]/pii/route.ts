import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCandidatePii, upsertCandidatePii } from "@ussp-platform/core/queries/admin/candidate-pii";
import { logAuditEvent } from "@ussp-platform/core/queries/admin/audit";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core/types/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "candidates.pii")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const pii = await getCandidatePii(id);

  return NextResponse.json(pii, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "candidates.pii")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  // Validate SSN format (9 digits)
  if (body.ssn !== undefined && body.ssn !== null && body.ssn !== "") {
    const ssnClean = body.ssn.replace(/[-\s]/g, "");
    if (!/^\d{9}$/.test(ssnClean)) {
      return NextResponse.json({ error: "SSN must be 9 digits" }, { status: 400 });
    }
    body.ssn = ssnClean;
  }

  // Validate DL state (2 uppercase letters)
  if (body.dl_state !== undefined && body.dl_state !== null && body.dl_state !== "") {
    if (!/^[A-Z]{2}$/.test(body.dl_state)) {
      return NextResponse.json({ error: "DL state must be a 2-letter state code" }, { status: 400 });
    }
  }

  // Validate DOB (valid date string)
  if (body.dob !== undefined && body.dob !== null && body.dob !== "") {
    const date = new Date(body.dob);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date of birth" }, { status: 400 });
    }
  }

  const result = await upsertCandidatePii(id, body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Audit log: record which fields were updated, never the actual values
  const staffUserId = user.staffUserId as string;
  await logAuditEvent({
    staffUserId,
    action: "update_pii",
    entityType: "candidate",
    entityId: id,
    details: { fields_updated: result.fieldsUpdated },
  });

  return NextResponse.json({ success: true }, {
    headers: { "Cache-Control": "no-store" },
  });
}
