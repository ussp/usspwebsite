import { NextRequest, NextResponse } from "next/server";
import { updateJobAlerts } from "@ussp-platform/core/queries/applications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, jobSlug } = body;
    if (!email || !jobSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await updateJobAlerts(email, jobSlug);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
