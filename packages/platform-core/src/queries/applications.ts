import { getServiceClient } from "../supabase/server.js";
import { getSiteId } from "../config.js";
import { findOrCreateCandidate } from "./admin/candidates.js";

export interface CreateApplicationInput {
  fullName: string;
  email: string;
  jobTitle: string;
  jobSlug: string;
  phone: string;
  resumePath?: string | null;
  resumeName?: string | null;
  authProvider?: string;
  linkedinSub?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  profilePicture?: string | null;
  locale?: string | null;
  emailVerified?: boolean | null;
  applicantType?: "employee" | "vendor";
  expectedBillRate?: string | null;
  availabilityDate?: string | null;
}

export async function createOrUpdateApplication(input: CreateApplicationInput): Promise<{ success: boolean; applicationId?: string; error?: string }> {
  const supabase = getServiceClient();
  const siteId = getSiteId();

  // Look up position_id from slug
  const { data: position } = await supabase
    .from("positions")
    .select("id")
    .eq("site_id", siteId)
    .eq("slug", input.jobSlug)
    .single();

  const positionId = position?.id || null;

  // Check if this person already applied for this specific position
  let existingQuery = supabase
    .from("applications")
    .select("id")
    .eq("site_id", siteId)
    .eq("email", input.email);

  if (positionId) {
    existingQuery = existingQuery.eq("position_id", positionId);
  } else {
    existingQuery = existingQuery.eq("job_slug", input.jobSlug);
  }

  const { data: existing } = await existingQuery.maybeSingle();

  let applicationId: string;

  if (existing) {
    applicationId = existing.id;
    await supabase
      .from("applications")
      .update({
        full_name: input.fullName,
        position_id: positionId,
        job_title: input.jobTitle,
        job_slug: input.jobSlug,
        resume_path: input.resumePath || undefined,
        resume_name: input.resumeName || undefined,
        linkedin_sub: input.linkedinSub || undefined,
        given_name: input.givenName || undefined,
        family_name: input.familyName || undefined,
        profile_picture: input.profilePicture || undefined,
        locale: input.locale || undefined,
        email_verified: input.emailVerified ?? undefined,
        phone: input.phone,
        applicant_type: input.applicantType || "employee",
        expected_bill_rate: input.expectedBillRate || null,
        availability_date: input.availabilityDate || null,
      })
      .eq("id", applicationId);
  } else {
    const { data: newApp, error: insertError } = await supabase
      .from("applications")
      .insert({
        site_id: siteId,
        position_id: positionId,
        full_name: input.fullName,
        email: input.email,
        job_title: input.jobTitle,
        job_slug: input.jobSlug,
        resume_path: input.resumePath || null,
        resume_name: input.resumeName || null,
        auth_provider: input.authProvider || "linkedin",
        linkedin_sub: input.linkedinSub || null,
        given_name: input.givenName || null,
        family_name: input.familyName || null,
        profile_picture: input.profilePicture || null,
        locale: input.locale || null,
        email_verified: input.emailVerified ?? null,
        phone: input.phone,
        sms_consent: true,
        sms_consent_timestamp: new Date().toISOString(),
        applicant_type: input.applicantType || "employee",
        expected_bill_rate: input.expectedBillRate || null,
        availability_date: input.availabilityDate || null,
      })
      .select("id")
      .single();

    if (insertError || !newApp) {
      return { success: false, error: "Failed to save application" };
    }
    applicationId = newApp.id;
  }

  // Find or create candidate record and link to application
  try {
    const { candidate } = await findOrCreateCandidate({
      email: input.email,
      full_name: input.fullName,
      phone: input.phone,
      linkedin_sub: input.linkedinSub || undefined,
      profile_picture: input.profilePicture || undefined,
    });
    if (candidate) {
      await supabase
        .from("applications")
        .update({ candidate_id: candidate.id })
        .eq("id", applicationId);
    }
  } catch (err) {
    console.error("[applications] Failed to link candidate record:", err);
  }

  // Insert into junction table
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

  return { success: true, applicationId };
}

export async function updateJobAlerts(email: string, jobSlug: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from("applications")
    .update({
      job_alerts_opt_in: true,
      job_alerts_timestamp: new Date().toISOString(),
    })
    .eq("site_id", getSiteId())
    .eq("email", email)
    .eq("job_slug", jobSlug);

  if (error) {
    return { success: false, error: "Failed to update job alerts preference" };
  }
  return { success: true };
}
