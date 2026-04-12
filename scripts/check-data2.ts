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
  // Check application columns
  const { data: apps } = await sb
    .from("applications")
    .select("id, candidate_id, position_id, status, resume_url")
    .eq("site_id", "ussp")
    .limit(3);
  console.log("Applications:", JSON.stringify(apps, null, 2));

  // Check positions columns (required_skills might be on the position itself)
  const { data: pos } = await sb
    .from("positions")
    .select("id, title, status, description, location, work_mode, required_skills, preferred_skills, education_level, min_experience_years, required_certifications")
    .eq("site_id", "ussp")
    .limit(5);
  console.log("\nPositions:", JSON.stringify(pos, null, 2));
}

main().catch(console.error);
