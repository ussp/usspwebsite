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

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const siteId = process.env.SITE_ID || "ussp";
const email = process.env.ADMIN_EMAIL || "vinay@lagisetty.com";
const fullName = process.env.ADMIN_NAME || "Vinay Lagisetty";

async function seed() {
  console.log(`Seeding admin user: ${email} for site: ${siteId}`);

  const { data, error } = await supabase
    .from("staff_users")
    .upsert(
      {
        site_id: siteId,
        email,
        full_name: fullName,
        role: "admin",
        active: true,
      },
      { onConflict: "site_id,email" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }

  console.log(`Admin user created/updated: ${data.email} (${data.id})`);
}

seed();
