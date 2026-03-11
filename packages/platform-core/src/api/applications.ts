import { createOrUpdateApplication } from "../queries/applications.js";
import type { ApiResponse } from "./upload.js";

export async function handleApplication(body: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const { fullName, email, jobTitle, jobSlug, phone, smsConsent, applicantType } = body as {
      fullName?: string;
      email?: string;
      jobTitle?: string;
      jobSlug?: string;
      phone?: string;
      smsConsent?: boolean;
      applicantType?: string;
    };

    if (!fullName || !email || !jobTitle || !jobSlug || !phone) {
      return { status: 400, body: { error: "Missing required fields" } };
    }

    if (!smsConsent) {
      return { status: 400, body: { error: "SMS consent is required" } };
    }

    if (applicantType === "vendor") {
      if (!body.expectedBillRate) {
        return { status: 400, body: { error: "Expected bill rate is required for vendor submissions" } };
      }
      if (!body.availabilityDate) {
        return { status: 400, body: { error: "Availability date is required for vendor submissions" } };
      }
    }

    const result = await createOrUpdateApplication({
      fullName,
      email,
      jobTitle,
      jobSlug,
      phone,
      resumePath: body.resumePath as string | null,
      resumeName: body.resumeName as string | null,
      authProvider: body.authProvider as string,
      linkedinSub: body.linkedinSub as string | null,
      givenName: body.givenName as string | null,
      familyName: body.familyName as string | null,
      profilePicture: body.profilePicture as string | null,
      locale: body.locale as string | null,
      emailVerified: body.emailVerified as boolean | null,
      applicantType: (applicantType as "employee" | "vendor") || "employee",
      expectedBillRate: (body.expectedBillRate as string) || null,
      availabilityDate: (body.availabilityDate as string) || null,
    });

    if (!result.success) {
      return { status: 500, body: { error: result.error } };
    }

    return { status: 200, body: { success: true } };
  } catch {
    return { status: 500, body: { error: "Internal server error" } };
  }
}
