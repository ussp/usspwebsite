import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) continue;
  env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const staffMembers = [
  { site_id: "ussp", email: "raheem@ussoftwarepro.com", full_name: "Shaik Abdul Raheem", role: "recruiter", active: true },
  { site_id: "ussp", email: "srikanthch@ussoftwarepro.com", full_name: "Srikanth Chennoji", role: "recruiter", active: true },
  { site_id: "ussp", email: "ayesha.fatima@ussoftwarepro.com", full_name: "Ayesha Fatima", role: "recruiter", active: true },
];

async function addStaff() {
  for (const member of staffMembers) {
    const res = await fetch(`${supabaseUrl}/rest/v1/staff_users`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(member),
    });

    const data = await res.json();
    if (res.ok) {
      console.log(`Added: ${member.full_name} <${member.email}> (${member.role})`);
    } else {
      console.error(`Error adding ${member.email}:`, data.message || data);
    }
  }
}

addStaff();
