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
    const value = trimmed
      .slice(eqIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.log("No .env.local found, using existing environment variables");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const siteId = process.env.SITE_ID || "ussp";

// USSP sales & recruiting team
const staffMembers = [
  {
    email: "raheem@ussoftwarepro.com",
    full_name: "Shaik Abdul Raheem",
    role: "recruiter",
  },
  {
    email: "srikanthch@ussoftwarepro.com",
    full_name: "Srikanth Chennoji",
    role: "recruiter",
  },
  {
    email: "ayesha.fatima@ussoftwarepro.com",
    full_name: "Ayesha Fatima",
    role: "recruiter",
  },
];

async function seed() {
  console.log(`Seeding ${staffMembers.length} staff users for site: ${siteId}`);

  for (const member of staffMembers) {
    const { data, error } = await supabase
      .from("staff_users")
      .upsert(
        {
          site_id: siteId,
          email: member.email,
          full_name: member.full_name,
          role: member.role,
          active: true,
        },
        { onConflict: "site_id,email" }
      )
      .select()
      .single();

    if (error) {
      console.error(`Error seeding ${member.email}:`, error.message);
    } else {
      console.log(
        `Staff user created/updated: ${data.full_name} <${data.email}> (role: ${data.role})`
      );
    }
  }

  console.log("Done.");
}

seed();
