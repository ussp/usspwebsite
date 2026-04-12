import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
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

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  console.log("═".repeat(70));
  console.log("  OpenSpecMatch — Real Resume Test");
  console.log("═".repeat(70));

  // 1. Get all applications with resume paths
  const { data: apps } = await sb
    .from("applications")
    .select("id, full_name, email, resume_path, resume_name, job_title, position_id, candidate_id")
    .eq("site_id", "ussp")
    .not("resume_path", "is", null);

  if (!apps?.length) {
    console.log("No applications with resumes found.");
    return;
  }

  console.log(`\nFound ${apps.length} applications with resumes:`);
  for (const a of apps) {
    console.log(`  - ${a.full_name} → ${a.job_title} (${a.resume_name})`);
  }

  // 2. Download resume PDFs and extract text
  console.log("\nDownloading resumes from storage...");
  const resumeTexts: { app: typeof apps[0]; text: string }[] = [];

  for (const app of apps) {
    if (!app.resume_path) continue;
    try {
      const { data, error } = await sb.storage
        .from("resumes")
        .download(app.resume_path);

      if (error || !data) {
        console.log(`  ✗ ${app.full_name}: ${error?.message || "no data"}`);
        continue;
      }

      // Convert PDF to text — use basic text extraction
      const buffer = Buffer.from(await data.arrayBuffer());
      const text = extractTextFromPDF(buffer);

      if (text.length < 50) {
        console.log(`  ✗ ${app.full_name}: extracted text too short (${text.length} chars)`);
        continue;
      }

      console.log(`  ✓ ${app.full_name}: ${text.length} chars extracted`);
      resumeTexts.push({ app, text });
    } catch (err) {
      console.log(`  ✗ ${app.full_name}: ${err}`);
    }
  }

  if (resumeTexts.length === 0) {
    console.log("\nCould not extract text from any resumes.");
    console.log("PDFs need a proper parser. Let me try with the raw bytes as text...");

    // Fallback: try to find any readable text in the PDF bytes
    for (const app of apps.slice(0, 3)) {
      if (!app.resume_path) continue;
      const { data } = await sb.storage.from("resumes").download(app.resume_path);
      if (!data) continue;
      const buf = Buffer.from(await data.arrayBuffer());
      const rawText = extractTextFallback(buf);
      if (rawText.length > 100) {
        console.log(`  ✓ ${app.full_name} (fallback): ${rawText.length} chars`);
        resumeTexts.push({ app, text: rawText });
      }
    }
  }

  if (resumeTexts.length === 0) {
    console.log("\nNo resume text could be extracted. Testing with position data only.");
    console.log("The PDF parser is needed for production use.");
    return;
  }

  // 3. Create a test position
  const position: PositionInput = {
    id: "test-pos",
    title: "Senior Full-Stack Developer",
    requiredSkills: ["TypeScript", "React", "Node.js", "Python", "PostgreSQL", "AWS"],
    preferredSkills: ["Docker", "Kubernetes", "GraphQL", "Next.js", "Terraform"],
    requiredCertifications: ["AWS Solutions Architect"],
    educationLevel: "Bachelor's",
    educationField: "Computer Science",
    minExperienceYears: 5,
    sector: "commercial",
    location: { city: "Chicago", state: "IL", workMode: "hybrid" },
  };

  // 4. Run matching
  const engine = new OpenSpecMatchEngine();

  console.log(`\n${"═".repeat(70)}`);
  console.log(`POSITION: ${position.title}`);
  console.log(`Required: ${position.requiredSkills?.join(", ")}`);
  console.log(`Preferred: ${position.preferredSkills?.join(", ")}`);
  console.log(`${"═".repeat(70)}`);

  const resumes: ResumeInput[] = resumeTexts.map((r) => ({
    id: r.app.candidate_id || r.app.id,
    name: r.app.full_name,
    text: r.text,
  }));

  const results = engine.matchResumes(position, resumes);

  for (const result of results) {
    const rt = resumeTexts.find(r => `cs-${r.app.candidate_id || r.app.id}` === result.capabilityIds[0]);
    if (!rt) continue;

    console.log(`\n${"─".repeat(70)}`);
    console.log(`CANDIDATE: ${rt.app.full_name}`);
    console.log(`  Applied for: ${rt.app.job_title}`);
    console.log(`  Score: ${result.overallScore}/100 | Confidence: ${result.confidence}/100`);

    for (const [cat, cs] of Object.entries(result.categoryScores)) {
      if (cs.itemCount > 0) {
        console.log(`  ${cat}: ${cs.score}/100 (${cs.matchedCount}/${cs.itemCount})`);
      }
    }
    if (result.strengths.length > 0) {
      console.log(`  Strengths: ${result.strengths.map(s => `${s.rawText}(${s.score})`).join(", ")}`);
    }
    if (result.gaps.length > 0) {
      console.log(`  Gaps: ${result.gaps.map(g => g.rawText).join(", ")}`);
    }
  }
}

/** Basic text extraction from PDF buffer — looks for text between stream markers */
function extractTextFromPDF(buffer: Buffer): string {
  const str = buffer.toString("latin1");
  const textParts: string[] = [];

  // Extract text from PDF text objects (BT...ET blocks)
  const btEtPattern = /BT\s([\s\S]*?)ET/g;
  let match;
  while ((match = btEtPattern.exec(str)) !== null) {
    const block = match[1];
    // Extract text from Tj and TJ operators
    const tjPattern = /\((.*?)\)\s*Tj/g;
    let tjMatch;
    while ((tjMatch = tjPattern.exec(block)) !== null) {
      textParts.push(tjMatch[1]);
    }
    // TJ array
    const tjArrayPattern = /\[(.*?)\]\s*TJ/g;
    let arrMatch;
    while ((arrMatch = tjArrayPattern.exec(block)) !== null) {
      const inner = arrMatch[1];
      const strPattern = /\((.*?)\)/g;
      let sMatch;
      while ((sMatch = strPattern.exec(inner)) !== null) {
        textParts.push(sMatch[1]);
      }
    }
  }

  return textParts
    .join(" ")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Fallback: extract any printable ASCII runs from the PDF */
function extractTextFallback(buffer: Buffer): string {
  const str = buffer.toString("latin1");
  // Find runs of printable ASCII (at least 4 chars)
  const runs = str.match(/[\x20-\x7E]{4,}/g) || [];
  // Filter out PDF operators and binary noise
  const textRuns = runs.filter(r => {
    if (r.match(/^[\d\s.]+$/)) return false; // pure numbers
    if (r.match(/^[A-Z]{1,3}\s/)) return false; // PDF operators
    if (r.includes("endobj") || r.includes("endstream")) return false;
    if (r.includes("<<") || r.includes(">>")) return false;
    return r.length > 5;
  });
  return textRuns.join("\n").trim();
}

main().catch(console.error);
