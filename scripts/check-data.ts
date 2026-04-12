import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Load env
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
  console.log("Checking USSP ATS data...\n");

  for (const t of ["positions", "candidates", "resumes", "applications", "position_requirements"]) {
    const { count, error } = await sb
      .from(t)
      .select("*", { count: "exact", head: true })
      .eq("site_id", "ussp");
    console.log(`${t}: ${count ?? 0} rows${error ? " ERROR: " + error.message : ""}`);
  }

  const { data: pos } = await sb
    .from("positions")
    .select("id, title, status, location, work_mode")
    .eq("site_id", "ussp")
    .limit(5);
  console.log("\nPositions:", JSON.stringify(pos, null, 2));

  const { data: cands } = await sb
    .from("candidates")
    .select("id, full_name, email, location, current_status")
    .eq("site_id", "ussp")
    .limit(5);
  console.log("\nCandidates:", JSON.stringify(cands, null, 2));

  const { data: res } = await sb
    .from("resumes")
    .select("id, candidate_id, extraction_status, file_name, uploaded_at")
    .eq("site_id", "ussp")
    .limit(5);
  console.log("\nResumes:", JSON.stringify(res, null, 2));
}

main().catch(console.error);
