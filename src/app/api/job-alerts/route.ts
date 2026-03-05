import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, jobSlug } = body;
    if (!email || !jobSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    const { error } = await supabase
      .from("applications")
      .update({
        job_alerts_opt_in: true,
        job_alerts_timestamp: new Date().toISOString(),
      })
      .eq("email", email)
      .eq("job_slug", jobSlug);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update job alerts preference" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
