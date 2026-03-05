import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.log("No .env.local found");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function listApplications() {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log(`Total applicants: ${data.length}\n`);

  for (const app of data) {
    // Fetch all positions this applicant applied for
    const { data: positions } = await supabase
      .from("application_positions")
      .select("position_id, applied_at, positions(title, slug)")
      .eq("application_id", app.id)
      .order("applied_at", { ascending: false });

    console.log("─".repeat(60));
    console.log(`Name:           ${app.full_name}`);
    console.log(`Email:          ${app.email}`);
    console.log(`Phone:          ${app.phone || "Not provided"}`);
    console.log(`Auth Provider:  ${app.auth_provider}`);
    console.log(`LinkedIn Sub:   ${app.linkedin_sub || "N/A"}`);
    console.log(`Given Name:     ${app.given_name || "N/A"}`);
    console.log(`Family Name:    ${app.family_name || "N/A"}`);
    console.log(`Locale:         ${app.locale || "N/A"}`);
    console.log(`Email Verified: ${app.email_verified ?? "N/A"}`);
    console.log(`Profile Pic:    ${app.profile_picture ? "Yes" : "No"}`);
    console.log(`Resume:         ${app.resume_path ? app.resume_name + " → " + app.resume_path : "Not uploaded"}`);
    console.log(`SMS Consent:    ${app.sms_consent ? "Yes (" + app.sms_consent_timestamp + ")" : "No"}`);
    console.log(`Job Alerts:     ${app.job_alerts_opt_in ? "Yes (" + app.job_alerts_timestamp + ")" : "No"}`);
    console.log(`Registered:     ${app.created_at}`);

    if (positions && positions.length > 0) {
      console.log(`Positions Applied (${positions.length}):`);
      for (const p of positions) {
        const pos = p.positions as unknown as { title: string; slug: string } | null;
        console.log(`  → ${pos?.title || "Unknown"} (${pos?.slug || p.position_id}) — ${p.applied_at}`);
      }
    } else {
      console.log(`Positions Applied: ${app.job_title} (${app.job_slug}) [legacy]`);
    }
  }
}

listApplications();
