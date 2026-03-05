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

    const { error } = await supabase.from("applications").insert({
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
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to save application" },
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
