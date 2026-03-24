import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getResumesByCandidateId, createResume } from "@ussp-platform/core/queries/admin/resumes";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const resumes = await getResumesByCandidateId(id);
  return NextResponse.json(resumes);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const result = await createResume({ ...body, candidate_id: id });
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result.resume, { status: 201 });
}
