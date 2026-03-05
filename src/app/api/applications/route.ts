import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { fullName, email, jobTitle, jobSlug, phone, smsConsent } = body;
    if (!fullName || !email || !jobTitle || !jobSlug || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!smsConsent) {
      return NextResponse.json(
        { error: "SMS consent is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    // Look up position_id from slug
    const { data: position } = await supabase
      .from("positions")
      .select("id")
      .eq("slug", jobSlug)
      .single();

    const positionId = position?.id || null;

    // Check if this person already has an application (by email)
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("email", email)
      .single();

    let applicationId: string;

    if (existing) {
      // Existing applicant — update their profile with latest info
      applicationId = existing.id;
      await supabase
        .from("applications")
        .update({
          full_name: fullName,
          position_id: positionId,
          job_title: jobTitle,
          job_slug: jobSlug,
          resume_path: body.resumePath || undefined,
          resume_name: body.resumeName || undefined,
          linkedin_sub: body.linkedinSub || undefined,
          given_name: body.givenName || undefined,
          family_name: body.familyName || undefined,
          profile_picture: body.profilePicture || undefined,
          locale: body.locale || undefined,
          email_verified: body.emailVerified ?? undefined,
          phone,
        })
        .eq("id", applicationId);
    } else {
      // New applicant — create application record
      const { data: newApp, error: insertError } = await supabase
        .from("applications")
        .insert({
          position_id: positionId,
          full_name: fullName,
          email,
          job_title: jobTitle,
          job_slug: jobSlug,
          resume_path: body.resumePath || null,
          resume_name: body.resumeName || null,
          auth_provider: body.authProvider || "linkedin",
          linkedin_sub: body.linkedinSub || null,
          given_name: body.givenName || null,
          family_name: body.familyName || null,
          profile_picture: body.profilePicture || null,
          locale: body.locale || null,
          email_verified: body.emailVerified ?? null,
          phone,
          sms_consent: true,
          sms_consent_timestamp: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertError || !newApp) {
        return NextResponse.json(
          { error: "Failed to save application" },
          { status: 500 }
        );
      }

      applicationId = newApp.id;
    }

    // Insert into junction table (link this applicant to this position)
    if (positionId) {
      await supabase.from("application_positions").upsert(
        {
          application_id: applicationId,
          position_id: positionId,
          applied_at: new Date().toISOString(),
        },
        { onConflict: "application_id,position_id" }
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
