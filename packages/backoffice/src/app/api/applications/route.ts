import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getApplications } from "@ussp-platform/core/queries/admin/applications";
import { createOrUpdateApplication } from "@ussp-platform/core/queries/applications";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { ApplicationStatus, StaffRole } from "@ussp-platform/core/types/admin";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get("status") as ApplicationStatus | null;
  const search = url.searchParams.get("search") || undefined;
  const position_id = url.searchParams.get("position_id") || undefined;

  const applications = await getApplications({
    status: status || undefined,
    search,
    position_id,
  });
  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "applications.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { fullName, email, phone, jobTitle, jobSlug, resumePath, resumeName, applicantType, expectedBillRate, availabilityDate } = body;

  if (!fullName || !email || !phone || !jobSlug) {
    return NextResponse.json({ error: "Name, email, phone, and position are required" }, { status: 400 });
  }

  const result = await createOrUpdateApplication({
    fullName,
    email,
    phone,
    jobTitle: jobTitle || "",
    jobSlug,
    resumePath: resumePath || null,
    resumeName: resumeName || null,
    authProvider: "manual",
    linkedinSub: null,
    applicantType: applicantType || "employee",
    expectedBillRate: expectedBillRate || null,
    availabilityDate: availabilityDate || null,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, applicationId: result.applicationId });
}
