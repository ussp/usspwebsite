/**
 * Audit: What skills from real resumes/positions are NOT in our taxonomy?
 * This reveals gaps we need to fix for better matching.
 *
 * Run: npx tsx scripts/audit-taxonomy.ts
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { OpenSpecMatchEngine } from "../packages/openspecmatch/src/index.js";

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
  const engine = new OpenSpecMatchEngine();
  const resolver = engine.taxonomy;

  // ── 1. Audit position requirements ─────────────────────────────
  console.log("═".repeat(70));
  console.log("  TAXONOMY AUDIT: Position Requirements");
  console.log("═".repeat(70));

  const { data: reqs } = await sb
    .from("position_requirements")
    .select("position_id, required_skills, preferred_skills, required_certifications, education_level, industry")
    .eq("site_id", "ussp");

  const { data: positions } = await sb
    .from("positions")
    .select("id, title")
    .eq("site_id", "ussp");

  const posMap = new Map((positions || []).map(p => [p.id, p.title]));

  const allReqSkills = new Set<string>();
  const unmatchedReqSkills: { skill: string; position: string }[] = [];
  const matchedReqSkills: { skill: string; position: string; path: string }[] = [];

  for (const req of reqs || []) {
    const posTitle = posMap.get(req.position_id) || "?";
    const allSkills = [
      ...(req.required_skills || []),
      ...(req.preferred_skills || []),
      ...(req.required_certifications || []),
    ];

    for (const skill of allSkills) {
      allReqSkills.add(skill);
      const result = resolver.resolve(skill);
      if (result.node) {
        matchedReqSkills.push({ skill, position: posTitle, path: result.node.path });
      } else {
        unmatchedReqSkills.push({ skill, position: posTitle });
      }
    }
  }

  console.log(`\nTotal unique skills in requirements: ${allReqSkills.size}`);
  console.log(`  Matched in taxonomy: ${new Set(matchedReqSkills.map(m => m.skill)).size}`);
  console.log(`  NOT in taxonomy: ${new Set(unmatchedReqSkills.map(m => m.skill)).size}`);

  // Show unmatched grouped by skill
  const unmatchedGrouped = new Map<string, string[]>();
  for (const { skill, position } of unmatchedReqSkills) {
    const list = unmatchedGrouped.get(skill) || [];
    list.push(position);
    unmatchedGrouped.set(skill, list);
  }

  console.log("\n  MISSING FROM TAXONOMY (position requirements):");
  for (const [skill, positions] of [...unmatchedGrouped].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`    ✗ "${skill}" — used in ${positions.length} position(s): ${positions.slice(0, 2).join(", ")}`);
  }

  // ── 2. Audit resume extractions ────────────────────────────────
  console.log(`\n${"═".repeat(70)}`);
  console.log("  TAXONOMY AUDIT: Resume Extractions");
  console.log("═".repeat(70));

  const { data: resumes } = await sb
    .from("resumes")
    .select("candidate_id, extracted_text")
    .eq("site_id", "ussp")
    .eq("extraction_status", "completed");

  const { data: candidates } = await sb
    .from("candidates")
    .select("id, full_name")
    .eq("site_id", "ussp");

  const candMap = new Map((candidates || []).map(c => [c.id, c.full_name]));

  if (!resumes?.length) {
    console.log("No extracted resumes found.");
    return;
  }

  // Run extraction on each resume and check what resolves vs what doesn't
  let totalExtracted = 0;
  let totalResolved = 0;
  let totalUnresolved = 0;
  const allUnresolved = new Map<string, number>();

  for (const resume of resumes) {
    const name = candMap.get(resume.candidate_id) || "?";
    const text = resume.extracted_text as string;
    if (!text || text.length < 50) continue;

    const capSpec = engine.extractResume({
      id: resume.candidate_id,
      name,
      text,
    });

    let resolved = 0;
    let unresolved = 0;

    for (const cap of capSpec.capabilities) {
      totalExtracted++;
      if (cap.taxonomyRef) {
        resolved++;
        totalResolved++;
      } else {
        unresolved++;
        totalUnresolved++;
        const count = allUnresolved.get(cap.rawText) || 0;
        allUnresolved.set(cap.rawText, count + 1);
      }
    }

    console.log(`\n  ${name}: ${capSpec.capabilities.length} items extracted (${resolved} resolved, ${unresolved} unresolved)`);

    // Show what was extracted
    const byCategory = new Map<string, typeof capSpec.capabilities>();
    for (const cap of capSpec.capabilities) {
      const list = byCategory.get(cap.category) || [];
      list.push(cap);
      byCategory.set(cap.category, list);
    }

    for (const [cat, items] of byCategory) {
      const resolved = items.filter(i => i.taxonomyRef);
      const unresolved = items.filter(i => !i.taxonomyRef);
      if (resolved.length > 0) {
        console.log(`    ${cat}: ${resolved.map(i => i.rawText).join(", ")}`);
      }
      if (unresolved.length > 0) {
        console.log(`    ${cat} (UNRESOLVED): ${unresolved.map(i => i.rawText).join(", ")}`);
      }
    }
  }

  console.log(`\n${"═".repeat(70)}`);
  console.log("  SUMMARY");
  console.log("═".repeat(70));
  console.log(`  Total items extracted from resumes: ${totalExtracted}`);
  console.log(`  Resolved in taxonomy: ${totalResolved} (${Math.round(totalResolved / totalExtracted * 100)}%)`);
  console.log(`  Unresolved: ${totalUnresolved} (${Math.round(totalUnresolved / totalExtracted * 100)}%)`);

  if (allUnresolved.size > 0) {
    console.log("\n  UNRESOLVED ITEMS (across all resumes):");
    const sorted = [...allUnresolved].sort((a, b) => b[1] - a[1]);
    for (const [item, count] of sorted) {
      console.log(`    ✗ "${item}" — found in ${count} resume(s)`);
    }
  }

  // ── 3. Cross-check: What position skills can't match any resume? ──
  console.log(`\n${"═".repeat(70)}`);
  console.log("  CROSS-CHECK: Position skills vs Resume capabilities");
  console.log("═".repeat(70));

  // For each required skill, check if any resume has a matching capability
  const allResumeSkills = new Set<string>();
  for (const resume of resumes) {
    const text = resume.extracted_text as string;
    if (!text) continue;
    const capSpec = engine.extractResume({
      id: resume.candidate_id,
      name: "x",
      text,
    });
    for (const cap of capSpec.capabilities) {
      if (cap.taxonomyRef) {
        allResumeSkills.add(cap.taxonomyRef.path);
      }
    }
  }

  console.log(`\n  Unique taxonomy paths found in resumes: ${allResumeSkills.size}`);

  for (const req of reqs || []) {
    const posTitle = posMap.get(req.position_id) || "?";
    const reqSkills = [...(req.required_skills || [])];
    const unmatched: string[] = [];

    for (const skill of reqSkills) {
      const result = resolver.resolve(skill);
      if (!result.node) {
        unmatched.push(`${skill} (not in taxonomy)`);
      } else if (!allResumeSkills.has(result.node.path)) {
        unmatched.push(`${skill} (in taxonomy but no candidate has it)`);
      }
    }

    if (unmatched.length > 0) {
      console.log(`\n  ${posTitle}:`);
      for (const u of unmatched) {
        console.log(`    ⚠ ${u}`);
      }
    }
  }
}

main().catch(console.error);
