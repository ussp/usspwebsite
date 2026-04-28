/**
 * Clear a candidate's stale linkedin_sub so the portal email-fallback works
 * on their next login. After they log in successfully, the auto-backfill in
 * getCandidateByLinkedInOrEmail() will populate the real sub.
 *
 *   SITE_ID=ussp npx tsx scripts/clear-candidate-linkedin-sub.ts <candidate-id>
 */

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
  /* ignore */
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_ID = process.env.SITE_ID || "ussp";
const candidateId = process.argv[2];

if (!candidateId) {
  console.error("Usage: SITE_ID=ussp npx tsx scripts/clear-candidate-linkedin-sub.ts <candidate-id>");
  process.exit(1);
}

async function main() {
  const { data: before } = await supabase
    .from("candidates")
    .select("id, full_name, email, linkedin_sub")
    .eq("id", candidateId)
    .eq("site_id", SITE_ID)
    .single();

  if (!before) {
    console.error(`Candidate ${candidateId} not found in site ${SITE_ID}`);
    process.exit(1);
  }

  console.log("Before:", before);

  if (!before.linkedin_sub) {
    console.log("\nNo linkedin_sub to clear — already null. No-op.");
    return;
  }

  const { error } = await supabase
    .from("candidates")
    .update({ linkedin_sub: null })
    .eq("id", candidateId)
    .eq("site_id", SITE_ID);

  if (error) {
    console.error("Update failed:", error.message);
    process.exit(1);
  }

  const { data: after } = await supabase
    .from("candidates")
    .select("id, full_name, email, linkedin_sub")
    .eq("id", candidateId)
    .eq("site_id", SITE_ID)
    .single();

  console.log("After: ", after);
  console.log(`\n✓ Cleared. Tell ${before.full_name} to log in to https://www.ussp.co/portal again.`);
  console.log(`  They must use LinkedIn with email = ${before.email}.`);
  console.log(`  Auto-backfill will capture their real sub on successful login.`);
}

main();
