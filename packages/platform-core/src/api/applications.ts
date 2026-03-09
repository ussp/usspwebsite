import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateApplication } from "../queries/applications.js";

export async function handleApplicationPost(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const { fullName, email, jobTitle, jobSlug, phone, smsConsent, applicantType } = body;
    if (!fullName || !email || !jobTitle || !jobSlug || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!smsConsent) {
      return NextResponse.json({ error: "SMS consent is required" }, { status: 400 });
    }

    if (applicantType === "vendor") {
      if (!body.expectedBillRate) {
        return NextResponse.json({ error: "Expected bill rate is required for vendor submissions" }, { status: 400 });
      }
      if (!body.availabilityDate) {
        return NextResponse.json({ error: "Availability date is required for vendor submissions" }, { status: 400 });
      }
    }

    const result = await createOrUpdateApplication({
      fullName,
      email,
      jobTitle,
      jobSlug,
      phone,
      resumePath: body.resumePath,
      resumeName: body.resumeName,
      authProvider: body.authProvider,
      linkedinSub: body.linkedinSub,
      givenName: body.givenName,
      familyName: body.familyName,
      profilePicture: body.profilePicture,
      locale: body.locale,
      emailVerified: body.emailVerified,
      applicantType: applicantType || "employee",
      expectedBillRate: body.expectedBillRate || null,
      availabilityDate: body.availabilityDate || null,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
