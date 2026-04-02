/**
 * Backfill missing candidate records.
 *
 * Finds all applications where candidate_id IS NULL, creates candidate
 * records for them, and links them back. Safe to run multiple times.
 *
 * Usage: npx tsx scripts/backfill-candidates.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
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
  console.log("No .env.local found, using existing environment variables");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteId = process.env.SITE_ID || "ussp";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function backfill() {
  console.log(`Backfilling candidates for site_id="${siteId}"...\n`);

  // Find applications without candidate_id
  const { data: orphaned, error } = await supabase
    .from("applications")
    .select("id, email, full_name, phone, linkedin_sub, profile_picture")
    .eq("site_id", siteId)
    .is("candidate_id", null);

  if (error) {
    console.error("Failed to query applications:", error.message);
    process.exit(1);
  }

  if (!orphaned || orphaned.length === 0) {
    console.log("No orphaned applications found. All candidates are linked.");
    return;
  }

  console.log(`Found ${orphaned.length} application(s) without candidate records.\n`);

  // Group by email (one candidate per email)
  const byEmail = new Map<string, typeof orphaned>();
  for (const app of orphaned) {
    const existing = byEmail.get(app.email) || [];
    existing.push(app);
    byEmail.set(app.email, existing);
  }

  let created = 0;
  let linked = 0;
  let errors = 0;

  for (const [email, apps] of byEmail) {
    const first = apps[0];

    // Check if candidate already exists
    const { data: existing } = await supabase
      .from("candidates")
      .select("id")
      .eq("site_id", siteId)
      .eq("email", email)
      .maybeSingle();

    let candidateId: string;

    if (existing) {
      candidateId = existing.id;
    } else {
      // Create candidate
      const { data: newCandidate, error: createError } = await supabase
        .from("candidates")
        .insert({
          site_id: siteId,
          email,
          full_name: first.full_name,
          phone: first.phone || null,
          linkedin_sub: first.linkedin_sub || null,
          profile_picture: first.profile_picture || null,
          candidate_type: "external",
          current_status: "available",
          source: "application",
        })
        .select("id")
        .single();

      if (createError || !newCandidate) {
        console.error(`  FAIL create candidate for ${email}:`, createError?.message);
        errors += apps.length;
        continue;
      }

      candidateId = newCandidate.id;
      created++;
      console.log(`  + Created candidate: ${first.full_name} <${email}>`);
    }

    // Link all applications for this email
    for (const app of apps) {
      const { error: linkError } = await supabase
        .from("applications")
        .update({ candidate_id: candidateId })
        .eq("id", app.id);

      if (linkError) {
        console.error(`  FAIL link app ${app.id}:`, linkError.message);
        errors++;
      } else {
        linked++;
      }
    }
  }

  console.log(`\nDone.`);
  console.log(`  Candidates created: ${created}`);
  console.log(`  Applications linked: ${linked}`);
  if (errors > 0) console.log(`  Errors: ${errors}`);
}

backfill();
