import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getCertificationsByCandidateId,
  addCertification,
} from "@ussp-platform/core/queries/admin/certifications";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole, CertificationSource } from "@ussp-platform/core/types/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const certs = await getCertificationsByCandidateId(id);
  return NextResponse.json(certs);
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

  if (!body.certification_name) {
    return NextResponse.json({ error: "Certification name is required" }, { status: 400 });
  }

  const result = await addCertification({
    candidate_id: id,
    certification_name: body.certification_name,
    issuing_organization: body.issuing_organization || undefined,
    issue_date: body.issue_date || undefined,
    expiry_date: body.expiry_date || undefined,
    credential_id: body.credential_id || undefined,
    source: (body.source as CertificationSource) || "recruiter_added",
  });

  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result.certification, { status: 201 });
}
