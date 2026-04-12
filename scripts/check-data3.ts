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
  // Just get position IDs and titles — minimal columns
  const { data: pos, error: posErr } = await sb
    .from("positions")
    .select("id, title")
    .eq("site_id", "ussp")
    .limit(3);
  console.log("Positions:", pos, "Error:", posErr?.message);

  // Get one position with all columns to see what exists
  if (pos && pos.length > 0) {
    const { data: fullPos, error: fpErr } = await sb
      .from("positions")
      .select("*")
      .eq("id", pos[0].id)
      .single();
    console.log("\nFull position columns:", Object.keys(fullPos || {}));
    console.log("Position data:", JSON.stringify(fullPos, null, 2));
  }

  // Get one application
  const { data: apps, error: appErr } = await sb
    .from("applications")
    .select("*")
    .eq("site_id", "ussp")
    .limit(1);
  if (apps && apps.length > 0) {
    console.log("\nApplication columns:", Object.keys(apps[0]));
    console.log("Application:", JSON.stringify(apps[0], null, 2));
  } else {
    console.log("\nApplications error:", appErr?.message);
  }
}

main().catch(console.error);
