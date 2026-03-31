import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getDocumentRequestsForApplication,
  createDocumentRequests,
} from "@ussp-platform/core/queries/admin/document-requests";
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
  if (!hasPermission(role, "document_requests.read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const requests = await getDocumentRequestsForApplication(id);
  return NextResponse.json(requests);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "document_requests.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: applicationId } = await params;
  const body = await request.json();
  const staffUserId = user.staffUserId as string;

  // body.requests is an array of { request_type, description?, due_date?, min_references? }
  const inputs = (body.requests || []).map(
    (r: { request_type: string; description?: string; due_date?: string; min_references?: number }) => ({
      application_id: applicationId,
      candidate_id: body.candidate_id,
      request_type: r.request_type,
      description: r.description,
      due_date: r.due_date,
      min_references: r.min_references,
    })
  );

  if (inputs.length === 0) {
    return NextResponse.json({ error: "No requests provided" }, { status: 400 });
  }

  const result = await createDocumentRequests(inputs, staffUserId);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.requests, { status: 201 });
}
