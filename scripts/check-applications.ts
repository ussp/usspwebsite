import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  const { data: apps, error, count } = await supabase
    .from("applications")
    .select("*", { count: "exact" })
    .eq("site_id", "ussp");

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log(`\nTotal applications for USSP: ${count ?? apps?.length ?? 0}\n`);

  if (apps && apps.length > 0) {
    for (const a of apps) {
      console.log(`  - ${a.full_name} | ${a.email} | ${a.job_title || a.job_slug} | ${a.created_at}`);
    }
  } else {
    console.log("  No applications received yet.");
  }

  // Also check junction table
  const { data: junctions, count: jCount } = await supabase
    .from("application_positions")
    .select("*", { count: "exact" });

  console.log(`\nApplication-Position links: ${jCount ?? junctions?.length ?? 0}`);
}

check();
