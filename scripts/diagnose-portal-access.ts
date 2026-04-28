/**
 * Diagnostic: find candidate rows + applications + document requests
 * matching a name or email to spot portal-access issues.
 *
 * Read-only. Safe to run.
 *
 *   SITE_ID=ussp npx tsx scripts/diagnose-portal-access.ts "Nishanth"
 *   SITE_ID=ussp npx tsx scripts/diagnose-portal-access.ts nkollu1@gmail.com
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
const term = process.argv[2];

if (!term) {
  console.error('Usage: SITE_ID=ussp npx tsx scripts/diagnose-portal-access.ts "<name or email>"');
  process.exit(1);
}

const isEmail = term.includes("@");

async function main() {
  console.log(`\n=== Searching for "${term}" in site ${SITE_ID} ===\n`);

  let query = supabase
    .from("candidates")
    .select("id, email, full_name, linkedin_sub, candidate_type, current_status, created_at")
    .eq("site_id", SITE_ID);

  if (isEmail) {
    query = query.ilike("email", term);
  } else {
    query = query.ilike("full_name", `%${term}%`);
  }

  const { data: candidates } = await query.order("created_at");

  console.log(`Candidate rows found: ${candidates?.length || 0}`);
  for (const c of candidates || []) {
    console.log(`  - ${c.id}`);
    console.log(`      name: ${c.full_name}`);
    console.log(`      email: ${c.email}`);
    console.log(`      linkedin_sub: ${c.linkedin_sub || "(none)"}`);
    console.log(`      type/status: ${c.candidate_type} / ${c.current_status}`);
    console.log(`      created: ${c.created_at}`);
  }
  console.log();

  if (!candidates || candidates.length === 0) return;
  const ids = candidates.map((c) => c.id);

  const { data: apps } = await supabase
    .from("applications")
    .select("id, candidate_id, email, status, created_at")
    .eq("site_id", SITE_ID)
    .in("candidate_id", ids);
  console.log(`Applications: ${apps?.length || 0}`);
  for (const a of apps || []) {
    console.log(`  - app ${a.id} → candidate ${a.candidate_id} · ${a.email} · status ${a.status}`);
  }
  console.log();

  const { data: reqs } = await supabase
    .from("document_requests")
    .select("id, candidate_id, application_id, request_type, status, description, created_at")
    .eq("site_id", SITE_ID)
    .in("candidate_id", ids)
    .order("created_at", { ascending: false });
  console.log(`Document requests: ${reqs?.length || 0}`);
  for (const r of reqs || []) {
    console.log(`  - req ${r.id} → candidate ${r.candidate_id} · ${r.request_type} · ${r.status}`);
    if (r.description) console.log(`      desc: ${r.description}`);
  }
  console.log();

  console.log("=== Diagnosis ===");
  if ((candidates?.length || 0) > 1) {
    console.log("⚠️  MULTIPLE candidate rows — likely a portal/document mismatch.");
    console.log("    Each row has its own linkedin_sub & document_requests.");
    console.log("    The portal will match exactly ONE on login (linkedin_sub or email).");
    const withLinkedIn = candidates!.filter((c) => c.linkedin_sub);
    const withReqs = new Set((reqs || []).map((r) => r.candidate_id));
    console.log(`    Rows with linkedin_sub set: ${withLinkedIn.length}`);
    console.log(`    Rows with document_requests: ${withReqs.size}`);
    const candidateIdsWithLinkedIn = new Set(withLinkedIn.map((c) => c.id));
    const orphanRequests = [...withReqs].filter((id) => !candidateIdsWithLinkedIn.has(id));
    if (orphanRequests.length > 0) {
      console.log(`    🔴 Document requests on candidate(s) WITHOUT linkedin_sub: ${orphanRequests.join(", ")}`);
      console.log(`       → Portal login may match the OTHER row, leaving requests invisible.`);
      console.log(`    Fix: clear the stale linkedin_sub or merge candidate rows.`);
    }
  } else if (candidates && candidates[0]) {
    const c = candidates[0];
    if (!c.linkedin_sub) {
      console.log(`✓  Single candidate row, linkedin_sub null → portal will email-match on login.`);
      console.log(`   Auto-backfill will populate linkedin_sub on first successful login.`);
    } else {
      console.log(`ℹ️  Single candidate row with linkedin_sub set: ${c.linkedin_sub}`);
      console.log(`   If portal still empty, the sub may be stale. Run:`);
      console.log(`     npx tsx scripts/clear-candidate-linkedin-sub.ts ${c.id}`);
      console.log(`   Then ask the candidate to log in again — auto-backfill captures the real sub.`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
