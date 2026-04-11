/**
 * Test OpenSpecMatch with real USSP ATS data
 *
 * Run: npx tsx scripts/test-openspecmatch.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(import.meta.dirname || __dirname, "../.env.local");
for (const line of readFileSync(envPath, "utf-8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq > 0) {
    process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
}

import { createClient } from "@supabase/supabase-js";
import { OpenSpecMatchEngine } from "../packages/openspecmatch/src/index.js";
import type { PositionInput } from "../packages/openspecmatch/src/extractors/position-extractor.js";
import type { ResumeInput } from "../packages/openspecmatch/src/extractors/resume-extractor.js";

const SITE_ID = process.env.SITE_ID || "ussp";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  console.log("═".repeat(70));
  console.log("  OpenSpecMatch — Real ATS Data Test");
  console.log("═".repeat(70));

  // 1. Load open positions with requirements
  const { data: positions, error: posErr } = await supabase
    .from("positions")
    .select("id, title, description, location, work_mode, salary_range, status")
    .eq("site_id", SITE_ID)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(5);

  if (posErr || !positions?.length) {
    console.log("No open positions found. Trying all positions...");
    const { data: allPos } = await supabase
      .from("positions")
      .select("id, title, description, location, work_mode, salary_range, status")
      .eq("site_id", SITE_ID)
      .order("created_at", { ascending: false })
      .limit(5);
    if (!allPos?.length) {
      console.log("No positions found at all. Exiting.");
      return;
    }
    positions!.push(...allPos);
  }

  console.log(`\nFound ${positions!.length} positions:`);
  for (const p of positions!) {
    console.log(`  - ${p.title} (${p.status}) [${p.location || "no location"}]`);
  }

  // Pick the first position
  const pos = positions![0];
  console.log(`\nTesting with: "${pos.title}"\n`);

  // Load position requirements
  const { data: reqs } = await supabase
    .from("position_requirements")
    .select("*")
    .eq("site_id", SITE_ID)
    .eq("position_id", pos.id)
    .maybeSingle();

  const positionInput: PositionInput = {
    id: pos.id,
    title: pos.title,
    requiredSkills: reqs?.required_skills || [],
    preferredSkills: reqs?.preferred_skills || [],
    requiredCertifications: reqs?.required_certifications || [],
    educationLevel: reqs?.education_level || undefined,
    minExperienceYears: reqs?.min_experience_years || undefined,
    maxExperienceYears: reqs?.max_experience_years || undefined,
    industry: reqs?.industry || undefined,
    location: pos.location ? {
      ...parseLocation(pos.location),
      workMode: (reqs?.work_mode || pos.work_mode || "onsite") as "remote" | "hybrid" | "onsite",
    } : undefined,
    description: pos.description || undefined,
  };

  console.log("Position requirements:");
  console.log(`  Required skills: ${positionInput.requiredSkills?.join(", ") || "(none)"}`);
  console.log(`  Preferred skills: ${positionInput.preferredSkills?.join(", ") || "(none)"}`);
  console.log(`  Certifications: ${positionInput.requiredCertifications?.join(", ") || "(none)"}`);
  console.log(`  Education: ${positionInput.educationLevel || "(none)"}`);
  console.log(`  Experience: ${positionInput.minExperienceYears || "?"} years`);
  console.log(`  Location: ${pos.location || "?"} (${positionInput.location?.workMode || "?"})`);

  // 2. Load candidates with resumes
  const { data: candidates } = await supabase
    .from("candidates")
    .select("id, full_name, email, location, work_preference, current_status, candidate_type")
    .eq("site_id", SITE_ID)
    .neq("current_status", "blacklisted")
    .order("created_at", { ascending: false })
    .limit(50);

  if (!candidates?.length) {
    console.log("\nNo candidates found. Exiting.");
    return;
  }

  console.log(`\nLoading resumes for ${candidates.length} candidates...`);

  // Load latest resumes
  const candidateIds = candidates.map(c => c.id);
  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, candidate_id, extracted_text, extracted_skills, extracted_experience_years, extracted_education, extraction_status, uploaded_at")
    .eq("site_id", SITE_ID)
    .in("candidate_id", candidateIds)
    .eq("extraction_status", "completed")
    .order("uploaded_at", { ascending: false });

  // Dedupe to latest per candidate
  const resumeMap = new Map<string, typeof resumes extends (infer T)[] | null ? T : never>();
  for (const r of resumes || []) {
    if (!resumeMap.has(r.candidate_id)) {
      resumeMap.set(r.candidate_id, r);
    }
  }

  const withResumes = candidates.filter(c => {
    const r = resumeMap.get(c.id);
    return r?.extracted_text && r.extracted_text.length > 50;
  });

  console.log(`  ${withResumes.length} candidates have extracted resume text\n`);

  if (withResumes.length === 0) {
    console.log("No candidates with resume text. Exiting.");
    return;
  }

  // 3. Run OpenSpecMatch
  const engine = new OpenSpecMatchEngine();

  const demand = engine.extractPosition(positionInput);
  console.log(`Extracted ${demand.requirements.length} requirements from position\n`);

  const resumeInputs: ResumeInput[] = withResumes.map(c => {
    const r = resumeMap.get(c.id)!;
    return {
      id: c.id,
      name: c.full_name || c.email || c.id,
      text: r.extracted_text as string,
    };
  });

  console.log("Running matching...\n");
  const results = engine.matchResumes(positionInput, resumeInputs);

  // 4. Display results
  console.log("═".repeat(70));
  console.log(`RESULTS: ${pos.title}`);
  console.log("═".repeat(70));

  for (let i = 0; i < Math.min(results.length, 15); i++) {
    const result = results[i];
    const candidate = withResumes.find(c => `cs-${c.id}` === result.capabilityIds[0]);
    if (!candidate) continue;
    const resume = resumeMap.get(candidate.id)!;

    console.log(`\n${i + 1}. ${candidate.full_name || candidate.email}`);
    console.log(`   Score: ${result.overallScore}/100 | Confidence: ${result.confidence}/100 | Gate: ${result.passedMandatoryGate ? "PASS" : "FAIL"}`);
    console.log(`   Location: ${candidate.location || "?"} | Pref: ${candidate.work_preference || "?"} | Type: ${candidate.candidate_type || "?"}`);

    // Category breakdown
    for (const [cat, cs] of Object.entries(result.categoryScores)) {
      if (cs.itemCount > 0) {
        console.log(`   ${cat}: ${cs.score}/100 (${cs.matchedCount}/${cs.itemCount})`);
      }
    }

    // Strengths
    if (result.strengths.length > 0) {
      console.log(`   Strengths: ${result.strengths.map(s => s.rawText).join(", ")}`);
    }
    // Gaps
    if (result.gaps.length > 0) {
      console.log(`   Gaps: ${result.gaps.map(g => g.rawText).join(", ")}`);
    }
  }

  // Summary
  console.log(`\n${"═".repeat(70)}`);
  console.log("RANKING:");
  for (let i = 0; i < Math.min(results.length, 15); i++) {
    const result = results[i];
    const candidate = withResumes.find(c => `cs-${c.id}` === result.capabilityIds[0]);
    const name = candidate?.full_name || candidate?.email || "?";
    console.log(`  ${String(i + 1).padStart(2)}. ${name.padEnd(30)} ${result.overallScore}/100`);
  }

  console.log(`\nTotal: ${results.length} candidates scored, ${results.filter(r => r.overallScore >= 50).length} above 50`);
}

function parseLocation(loc: string): { city?: string; state?: string } {
  if (!loc) return {};
  const parts = loc.split(",").map(s => s.trim());
  if (parts.length >= 2) return { city: parts[0], state: parts[1] };
  return { city: parts[0] };
}

main().catch(console.error);
