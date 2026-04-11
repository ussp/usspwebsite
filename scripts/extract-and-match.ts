/**
 * Extract text from uploaded resumes (PDF/DOCX) and run OpenSpecMatch
 *
 * Run: npx tsx scripts/extract-and-match.ts
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
// @ts-ignore — pdf-parse has no types
import pdfParse from "pdf-parse";
import { OpenSpecMatchEngine } from "../packages/openspecmatch/src/index.js";
import type { PositionInput } from "../packages/openspecmatch/src/extractors/position-extractor.js";
import type { ResumeInput } from "../packages/openspecmatch/src/extractors/resume-extractor.js";

// Load env
for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq > 0) process.env[t.slice(0, eq)] = t.slice(eq + 1);
}

const SITE_ID = "ussp";
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// ── Step 1: Extract text from all uploaded resumes ──────────────

async function extractResumes() {
  console.log("═".repeat(70));
  console.log("  Step 1: Extract text from uploaded resumes");
  console.log("═".repeat(70));

  // Get all applications with resume uploads
  const { data: apps } = await sb
    .from("applications")
    .select("id, full_name, email, resume_path, resume_name, position_id, candidate_id")
    .eq("site_id", SITE_ID)
    .not("resume_path", "is", null);

  if (!apps?.length) {
    console.log("No applications with resumes found.");
    return [];
  }

  // Dedupe by candidate_id (keep first/latest application per candidate)
  const seen = new Set<string>();
  const uniqueApps = apps.filter(a => {
    const key = a.candidate_id || a.email;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\nProcessing ${uniqueApps.length} unique candidates...\n`);

  const extracted: { app: typeof apps[0]; text: string; skills: string[] }[] = [];

  for (const app of uniqueApps) {
    const fileName = app.resume_name || app.resume_path || "unknown";
    const ext = fileName.toLowerCase().split(".").pop();

    try {
      const { data, error } = await sb.storage
        .from("resumes")
        .download(app.resume_path!);

      if (error || !data) {
        console.log(`  ✗ ${app.full_name}: download failed — ${error?.message}`);
        continue;
      }

      const buffer = Buffer.from(await data.arrayBuffer());
      let text = "";

      if (ext === "pdf") {
        const result = await pdfParse(buffer);
        text = result.text || "";
      } else if (ext === "docx") {
        // DOCX: extract from XML parts
        text = extractDocxText(buffer);
      } else if (ext === "doc") {
        // Legacy .doc — try raw text extraction
        text = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ");
      } else {
        text = buffer.toString("utf-8");
      }

      text = text.trim();
      if (text.length < 50) {
        console.log(`  ✗ ${app.full_name}: too little text (${text.length} chars from ${ext})`);
        continue;
      }

      console.log(`  ✓ ${app.full_name}: ${text.length} chars from ${ext}`);
      extracted.push({ app, text, skills: [] });

      // Store in resumes table
      await upsertResume(app, text);
    } catch (err: any) {
      console.log(`  ✗ ${app.full_name}: ${err.message || err}`);
    }
  }

  return extracted;
}

/** Extract text from DOCX (ZIP containing XML) */
function extractDocxText(buffer: Buffer): string {
  // DOCX is a ZIP file. Look for the document.xml content.
  // Simple approach: find XML text between <w:t> tags
  const str = buffer.toString("utf-8");
  const parts: string[] = [];

  // Look for <w:t ...>text</w:t> patterns
  const pattern = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
  let match;
  while ((match = pattern.exec(str)) !== null) {
    parts.push(match[1]);
  }

  if (parts.length > 0) {
    return parts.join(" ").replace(/\s+/g, " ").trim();
  }

  // Fallback: extract any printable runs
  const runs = str.match(/[\x20-\x7E]{5,}/g) || [];
  return runs
    .filter(r => !r.includes("<?xml") && !r.includes("xmlns") && !r.includes("Content_Types"))
    .join("\n")
    .trim();
}

/** Store extracted resume text in the resumes table */
async function upsertResume(app: any, text: string) {
  // Quick skill extraction for the DB field
  const engine = new OpenSpecMatchEngine();
  const capSpec = engine.extractResume({
    id: app.candidate_id || app.id,
    name: app.full_name,
    text,
  });

  const skills = capSpec.capabilities
    .filter(c => c.category === "technical_skill")
    .map(c => c.rawText);

  const education = capSpec.capabilities
    .filter(c => c.category === "education")
    .map(c => ({ degree: c.rawText, institution: "extracted", year: undefined }));

  const row = {
    site_id: SITE_ID,
    candidate_id: app.candidate_id,
    extracted_text: text,
    extracted_skills: skills,
    extracted_experience_years: capSpec.context.totalExperienceYears ?? null,
    extracted_education: education,
    extraction_status: "completed",
    extraction_error: null,
    file_name: app.resume_name,
    file_type: app.resume_name?.split(".").pop() || "pdf",
    storage_path: app.resume_path,
    is_primary: true,
    uploaded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await sb
    .from("resumes")
    .upsert(row, { onConflict: "site_id,candidate_id,storage_path" })
    .select();

  if (error) {
    // Try insert if upsert fails (no unique constraint may exist)
    const { error: insertErr } = await sb.from("resumes").insert(row);
    if (insertErr) {
      console.log(`    DB: failed to save — ${insertErr.message}`);
    } else {
      console.log(`    DB: saved (insert)`);
    }
  } else {
    console.log(`    DB: saved`);
  }
}

// ── Step 2: Run matching ────────────────────────────────────────

async function runMatching(
  extracted: { app: any; text: string }[],
) {
  console.log(`\n${"═".repeat(70)}`);
  console.log("  Step 2: Run OpenSpecMatch");
  console.log("═".repeat(70));

  // Load all positions
  const { data: positions } = await sb
    .from("positions")
    .select("id, title, location, work_mode, description")
    .eq("site_id", SITE_ID)
    .limit(10);

  // Load position requirements
  const { data: allReqs } = await sb
    .from("position_requirements")
    .select("*")
    .eq("site_id", SITE_ID);

  const reqMap = new Map((allReqs || []).map(r => [r.position_id, r]));

  if (!positions?.length) {
    console.log("No positions found. Creating test positions...\n");
  }

  // Build position inputs — use real positions if they have requirements,
  // otherwise use test positions
  const testPositions: PositionInput[] = [
    {
      id: "test-fullstack",
      title: "Senior Full-Stack Developer",
      requiredSkills: ["TypeScript", "React", "Node.js", "Python", "PostgreSQL"],
      preferredSkills: ["AWS", "Docker", "Kubernetes", "Next.js", "GraphQL"],
      educationLevel: "Bachelor's",
      minExperienceYears: 5,
      sector: "commercial",
      location: { city: "Chicago", state: "IL", workMode: "hybrid" },
    },
    {
      id: "test-data",
      title: "Senior Data Analyst",
      requiredSkills: ["SQL", "Python", "Tableau", "Excel"],
      preferredSkills: ["Power BI", "R", "Snowflake", "AWS"],
      educationLevel: "Bachelor's",
      educationField: "Data Science",
      minExperienceYears: 3,
      location: { workMode: "remote" },
    },
    {
      id: "test-ba",
      title: "Business Analyst",
      requiredSkills: ["SQL", "Excel", "JIRA"],
      preferredSkills: ["Tableau", "Power BI", "Python", "Agile"],
      educationLevel: "Bachelor's",
      minExperienceYears: 3,
      location: { city: "Chicago", state: "IL", workMode: "hybrid" },
    },
    {
      id: "test-devops",
      title: "DevOps Engineer",
      requiredSkills: ["AWS", "Docker", "Kubernetes", "Terraform", "Linux"],
      preferredSkills: ["Python", "Jenkins", "Ansible", "Git", "CI/CD"],
      requiredCertifications: ["AWS Solutions Architect"],
      educationLevel: "Bachelor's",
      minExperienceYears: 5,
      location: { city: "Chicago", state: "IL", workMode: "hybrid" },
    },
  ];

  const engine = new OpenSpecMatchEngine();

  const resumes: ResumeInput[] = extracted.map(r => ({
    id: r.app.candidate_id || r.app.id,
    name: r.app.full_name,
    text: r.text,
  }));

  for (const pos of testPositions) {
    console.log(`\n${"─".repeat(70)}`);
    console.log(`POSITION: ${pos.title}`);
    console.log(`  Required: ${pos.requiredSkills?.join(", ")}`);
    console.log(`  Preferred: ${pos.preferredSkills?.join(", ")}`);
    console.log(`${"─".repeat(70)}`);

    const results = engine.matchResumes(pos, resumes);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const candidate = extracted.find(
        r => `cs-${r.app.candidate_id || r.app.id}` === result.capabilityIds[0],
      );
      if (!candidate) continue;

      console.log(
        `  ${String(i + 1).padStart(2)}. ${candidate.app.full_name.padEnd(35)} ` +
        `${String(result.overallScore).padStart(3)}/100  ` +
        `conf:${result.confidence}  ` +
        `skills:${result.categoryScores["technical_skill"]?.score ?? "?"}`,
      );

      if (result.strengths.length > 0) {
        console.log(`      ✓ ${result.strengths.map(s => s.rawText).slice(0, 5).join(", ")}`);
      }
      if (result.gaps.length > 0) {
        console.log(`      ✗ ${result.gaps.map(g => g.rawText).slice(0, 5).join(", ")}`);
      }
    }
  }
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  const extracted = await extractResumes();

  if (extracted.length === 0) {
    console.log("\nNo resumes extracted. Cannot run matching.");
    return;
  }

  await runMatching(extracted);

  console.log(`\n${"═".repeat(70)}`);
  console.log(`Done. ${extracted.length} resumes extracted and matched against 4 positions.`);
  console.log("═".repeat(70));
}

main().catch(console.error);
