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
  console.log("No .env.local found");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Notify PostgREST to reload schema cache
async function reloadSchema() {
  const res = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: "HEAD",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });
  console.log("Schema cache ping status:", res.status);

  // Send NOTIFY pgrst to reload
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase.rpc("pg_notify" as string, {
    channel: "pgrst",
    payload: "reload schema",
  });
  if (error) {
    console.log("pg_notify not available, trying direct SQL...");
    // Try using the management API or just wait
    const { error: sqlErr } = await supabase.from("staff_users").select("id").limit(1);
    if (sqlErr) {
      console.log("staff_users still not in cache. The Supabase project may need a manual schema cache reload from the dashboard.");
      console.log("Go to: Supabase Dashboard > Project Settings > API > Reload Schema Cache");
    } else {
      console.log("staff_users table is accessible!");
    }
  } else {
    console.log("Schema reload triggered successfully");
  }
}

reloadSchema();
