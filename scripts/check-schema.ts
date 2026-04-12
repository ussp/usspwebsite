import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq > 0) process.env[t.slice(0, eq)] = t.slice(eq + 1);
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  // Get resumes table columns by inserting a dummy and reading the error
  // Actually, just try a select * with limit 0 to get column names
  // Better: query information_schema via RPC or just insert with known-good columns

  // Check what columns the resumes table accepts by looking at the Alembic model
  console.log("=== RESUMES TABLE ===");
  // Try inserting a minimal row to see what columns exist
  const { error: testErr } = await sb
    .from("resumes")
    .insert({
      site_id: "test-schema-check",
      candidate_id: "00000000-0000-0000-0000-000000000000",
    });
  console.log("Insert error (shows expected columns):", testErr?.message);

  // Clean up
  await sb.from("resumes").delete().eq("site_id", "test-schema-check");

  // Try with common columns to discover what exists
  const cols = [
    "id", "site_id", "candidate_id", "file_name", "file_type", "storage_path",
    "extracted_text", "extracted_skills", "extracted_experience_years",
    "extracted_education", "extraction_status", "extraction_error",
    "is_primary", "uploaded_at", "created_at", "updated_at",
  ];
  for (const col of cols) {
    const { error } = await sb
      .from("resumes")
      .select(col)
      .eq("site_id", "ussp")
      .limit(0);
    console.log(`  ${col}: ${error ? "NOT FOUND - " + error.message : "EXISTS"}`);
  }

  // Get all positions with their descriptions
  console.log("\n=== ALL POSITIONS ===");
  const { data: positions } = await sb
    .from("positions")
    .select("id, title, description, location, work_mode, type, active, salary_range, bill_rate")
    .eq("site_id", "ussp")
    .order("created_at", { ascending: false });

  for (const p of positions || []) {
    console.log(`\n${p.title} (${p.active ? "active" : "inactive"})`);
    console.log(`  Location: ${p.location || "?"} | Mode: ${p.work_mode || "?"} | Type: ${p.type || "?"}`);
    console.log(`  Rate: ${p.bill_rate || p.salary_range || "?"}`);
    if (p.description) {
      console.log(`  Description: ${p.description.slice(0, 200)}...`);
    } else {
      console.log(`  Description: (none)`);
    }
  }

  // Check existing position_requirements
  console.log("\n=== POSITION REQUIREMENTS ===");
  const { data: reqs } = await sb
    .from("position_requirements")
    .select("*")
    .eq("site_id", "ussp");
  console.log(`${reqs?.length || 0} position requirements found`);
}

main().catch(console.error);
