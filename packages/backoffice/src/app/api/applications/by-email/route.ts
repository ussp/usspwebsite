import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getApplicationsByEmail } from "@ussp-platform/core/queries/admin/applications";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
  }

  const applications = await getApplicationsByEmail(email);
  return NextResponse.json(applications);
}
