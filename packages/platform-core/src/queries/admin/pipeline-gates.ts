import { getServiceClient } from "../../supabase/server.js";
import { getSiteId } from "../../config.js";
import { PIPELINE_STAGES } from "../../types/admin.js";
import type { ApplicationStatus, PipelineGateResult } from "../../types/admin.js";

/**
 * Check pipeline gate requirements before advancing an application.
 *
 * Returns an array of gate results. Empty array = all clear.
 * Failed gates are soft blocks — UI can show override for authorized roles.
 */
export async function checkPipelineGates(
  applicationId: string,
  currentStatus: ApplicationStatus,
  targetStatus: ApplicationStatus
): Promise<PipelineGateResult[]> {
  const supabase = getServiceClient();
  const siteId = getSiteId();
  const gates: PipelineGateResult[] = [];

  const targetIndex = PIPELINE_STAGES.indexOf(targetStatus);
  const newIndex = PIPELINE_STAGES.indexOf("new");
  const referencesIndex = PIPELINE_STAGES.indexOf("references");
  const offerPendingIndex = PIPELINE_STAGES.indexOf("offer_pending");

  // Get application details
  const { data: app } = await supabase
    .from("applications")
    .select("id, resume_path, candidate_id")
    .eq("site_id", siteId)
    .eq("id", applicationId)
    .single();

  if (!app) return gates;

  // ── Gate 1: Resume required to advance past "new" ──────────────────
  if (targetIndex > newIndex) {
    let hasResume = !!app.resume_path;

    if (!hasResume && app.candidate_id) {
      const { count } = await supabase
        .from("resumes")
        .select("id", { count: "exact", head: true })
        .eq("site_id", siteId)
        .eq("candidate_id", app.candidate_id);
      hasResume = (count || 0) > 0;
    }

    if (!hasResume) {
      gates.push({
        passed: false,
        gate: "resume_required",
        message: "A resume is required to advance past New Application",
        missingItems: ["Resume upload"],
      });
    }
  }

  // ── Gate 2: References required to advance past "references" ───────
  if (targetIndex > referencesIndex) {
    const { data: refRequests } = await supabase
      .from("document_requests")
      .select("id, status")
      .eq("site_id", siteId)
      .eq("application_id", applicationId)
      .eq("request_type", "references")
      .in("status", ["submitted", "approved"]);

    if (!refRequests || refRequests.length === 0) {
      gates.push({
        passed: false,
        gate: "references_required",
        message: "References must be submitted or approved before advancing past References",
        missingItems: ["Reference submission"],
      });
    }
  }

  // ── Gate 3: PII required before offer ──────────────────────────────
  if (targetIndex >= offerPendingIndex && app.candidate_id) {
    const { data: pii } = await supabase
      .from("candidate_pii")
      .select("ssn_encrypted, visa_type")
      .eq("site_id", siteId)
      .eq("candidate_id", app.candidate_id)
      .maybeSingle();

    const missing: string[] = [];
    if (!pii?.ssn_encrypted) missing.push("SSN");
    if (!pii?.visa_type) missing.push("Visa / Work Authorization");

    if (missing.length > 0) {
      gates.push({
        passed: false,
        gate: "pii_before_offer",
        message: `Identity documents required before Offer Pending: ${missing.join(", ")}`,
        missingItems: missing,
      });
    }
  }

  // No candidate linked — warn but don't hard block
  if (!app.candidate_id && targetIndex >= offerPendingIndex) {
    gates.push({
      passed: false,
      gate: "candidate_link_required",
      message: "Application has no linked candidate record. Link a candidate before offer stage.",
      missingItems: ["Candidate record"],
    });
  }

  return gates;
}
