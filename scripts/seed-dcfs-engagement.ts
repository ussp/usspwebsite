import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// =============================================================================
// Seed script: DCFS Illinois Connect — AI Productivity Pilot
//
// Creates engagement, 3 pilot teams with members, baseline assessments,
// and sample baseline metrics for Team Alpha.
//
// Usage:
//   npx tsx scripts/seed-dcfs-engagement.ts
//   npx tsx scripts/seed-dcfs-engagement.ts --dry-run
// =============================================================================

// ---------------------------------------------------------------------------
// Load .env.local
// ---------------------------------------------------------------------------

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
const dryRun = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// Data definitions
// ---------------------------------------------------------------------------

const engagement = {
  site_id: siteId,
  name: "DCFS Illinois Connect — AI Productivity Pilot",
  client_name: "DCFS / State of Illinois",
  integration_type: "jira",
  status: "draft",
  notes: "CIO Jim Doherty requested 5% productivity improvement via AI. Pilot across select ILC product teams. PI Planning May 5-7, 2026.",
};

interface TeamDef {
  name: string;
  members: { display_name: string; role: string }[];
}

const teams: TeamDef[] = [
  {
    name: "ILC Pilot Team Alpha",
    members: [
      { display_name: "Scrum Lead Alpha", role: "scrum_master" },
      { display_name: "Dev-A1", role: "developer" },
      { display_name: "Dev-A2", role: "developer" },
      { display_name: "QA-A1", role: "qa" },
      { display_name: "BA-A1", role: "product_owner" },
    ],
  },
  {
    name: "ILC Pilot Team Beta",
    members: [
      { display_name: "Scrum Lead Beta", role: "scrum_master" },
      { display_name: "Dev-B1", role: "developer" },
      { display_name: "Dev-B2", role: "developer" },
      { display_name: "QA-B1", role: "qa" },
      { display_name: "BA-B1", role: "product_owner" },
    ],
  },
  {
    name: "ILC Data Team Pilot",
    members: [
      { display_name: "Data Lead", role: "scrum_master" },
      { display_name: "Data-Dev-1", role: "developer" },
      { display_name: "Data-Dev-2", role: "developer" },
      { display_name: "Data-Ops-1", role: "devops" },
    ],
  },
];

const baselineAssessment = {
  assessment_type: "baseline" as const,
  period_start: "2026-03-01",
  period_end: "2026-04-03",
  sprint_count: 3,
  data_source: "manual" as const,
  status: "draft" as const,
};

// Sample baseline metrics for Team Alpha (realistic values for a Dynamics 365 team)
const teamAlphaMetrics = [
  // DORA
  { category: "dora", metric_name: "deployment_frequency", metric_value: 1.5, metric_unit: "per_week" },
  { category: "dora", metric_name: "lead_time_minutes", metric_value: 2880, metric_unit: "minutes" },
  { category: "dora", metric_name: "change_failure_rate", metric_value: 12, metric_unit: "percentage" },
  { category: "dora", metric_name: "mttr_minutes", metric_value: 240, metric_unit: "minutes" },
  // Scrum
  { category: "scrum", metric_name: "velocity", metric_value: 34, metric_unit: "story_points" },
  { category: "scrum", metric_name: "cycle_time_days", metric_value: 4.2, metric_unit: "days" },
  { category: "scrum", metric_name: "predictability", metric_value: 78, metric_unit: "percentage" },
  { category: "scrum", metric_name: "throughput", metric_value: 8, metric_unit: "items_per_sprint" },
  { category: "scrum", metric_name: "bug_escape_rate", metric_value: 15, metric_unit: "percentage" },
];

// ---------------------------------------------------------------------------
// Seed logic
// ---------------------------------------------------------------------------

async function seed() {
  if (dryRun) {
    console.log("=== DRY RUN — no data will be written ===\n");
  }

  // 1. Create engagement
  console.log("1. Engagement:");
  console.log(`   Name: ${engagement.name}`);
  console.log(`   Client: ${engagement.client_name}`);
  console.log(`   Integration: ${engagement.integration_type}`);
  console.log(`   Status: ${engagement.status}`);
  console.log(`   Notes: ${engagement.notes}\n`);

  let engagementId: string | null = null;

  if (!dryRun) {
    const { data, error } = await supabase
      .from("ai_engagements")
      .insert(engagement)
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create engagement:", error.message);
      process.exit(1);
    }
    engagementId = data.id;
    console.log(`   Created with id: ${engagementId}\n`);
  }

  // 2. Create teams and members
  console.log("2. Teams & Members:");
  const teamIds: Map<string, string> = new Map();

  for (const team of teams) {
    const teamSize = team.members.length;
    console.log(`\n   Team: ${team.name} (${teamSize} members)`);
    for (const m of team.members) {
      console.log(`     - ${m.display_name} (${m.role})`);
    }

    if (!dryRun && engagementId) {
      const { data: teamData, error: teamError } = await supabase
        .from("ai_teams")
        .insert({
          site_id: siteId,
          engagement_id: engagementId,
          name: team.name,
          team_size: teamSize,
        })
        .select("id")
        .single();

      if (teamError) {
        console.error(`   Failed to create team "${team.name}":`, teamError.message);
        continue;
      }

      const teamId = teamData.id;
      teamIds.set(team.name, teamId);
      console.log(`     Created team id: ${teamId}`);

      // Insert members
      const memberRows = team.members.map((m) => ({
        site_id: siteId,
        team_id: teamId,
        display_name: m.display_name,
        role: m.role,
      }));

      const { error: membersError } = await supabase
        .from("ai_team_members")
        .insert(memberRows);

      if (membersError) {
        console.error(`   Failed to create members for "${team.name}":`, membersError.message);
      } else {
        console.log(`     Created ${memberRows.length} members`);
      }
    }
  }

  // 3. Create baseline assessments for each team
  console.log("\n\n3. Baseline Assessments:");
  console.log(`   Period: ${baselineAssessment.period_start} to ${baselineAssessment.period_end}`);
  console.log(`   Sprint count: ${baselineAssessment.sprint_count}`);
  console.log(`   Data source: ${baselineAssessment.data_source}`);
  console.log(`   Status: ${baselineAssessment.status}`);

  const assessmentIds: Map<string, string> = new Map();

  for (const team of teams) {
    console.log(`\n   Assessment for: ${team.name}`);

    if (!dryRun) {
      const teamId = teamIds.get(team.name);
      if (!teamId) {
        console.error(`   Skipping — team id not found for "${team.name}"`);
        continue;
      }

      const { data: assessData, error: assessError } = await supabase
        .from("ai_assessments")
        .insert({
          site_id: siteId,
          team_id: teamId,
          ...baselineAssessment,
        })
        .select("id")
        .single();

      if (assessError) {
        console.error(`   Failed to create assessment for "${team.name}":`, assessError.message);
        continue;
      }

      assessmentIds.set(team.name, assessData.id);
      console.log(`     Created assessment id: ${assessData.id}`);
    }
  }

  // 4. Insert sample metrics for Team Alpha
  console.log("\n\n4. Sample Baseline Metrics (Team Alpha):");
  for (const m of teamAlphaMetrics) {
    console.log(`   [${m.category}] ${m.metric_name}: ${m.metric_value} ${m.metric_unit}`);
  }

  if (!dryRun) {
    const alphaAssessmentId = assessmentIds.get("ILC Pilot Team Alpha");
    if (!alphaAssessmentId) {
      console.error("\n   Skipping metrics — assessment id not found for Team Alpha");
    } else {
      const metricRows = teamAlphaMetrics.map((m) => ({
        site_id: siteId,
        assessment_id: alphaAssessmentId,
        category: m.category,
        metric_name: m.metric_name,
        metric_value: m.metric_value,
        metric_unit: m.metric_unit,
      }));

      const { error: metricsError } = await supabase
        .from("ai_metrics")
        .insert(metricRows);

      if (metricsError) {
        console.error("\n   Failed to insert metrics:", metricsError.message);
      } else {
        console.log(`\n   Inserted ${metricRows.length} metrics for Team Alpha baseline`);
      }
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  if (dryRun) {
    console.log("DRY RUN COMPLETE — no data was written.");
    console.log("Run without --dry-run to create records in Supabase.");
  } else {
    console.log("SEED COMPLETE");
    console.log(`  Engagement: ${engagementId}`);
    console.log(`  Teams: ${teamIds.size}`);
    console.log(`  Assessments: ${assessmentIds.size}`);
    console.log(`  Metrics: ${teamAlphaMetrics.length} (Team Alpha)`);
  }
  console.log("=".repeat(60));
}

seed();
