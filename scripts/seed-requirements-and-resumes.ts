/**
 * Seed position requirements and store extracted resume text.
 *
 * Run: npx tsx scripts/seed-requirements-and-resumes.ts
 */

import { readFileSync } from "node:fs";
// @ts-ignore
import pdfParse from "pdf-parse";
import { createClient } from "@supabase/supabase-js";

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

// ── Position Requirements (extracted from job descriptions) ─────

const REQUIREMENTS: Record<string, {
  required_skills: string[];
  preferred_skills: string[];
  required_certifications: string[];
  education_level: string;
  min_experience_years: number;
  max_experience_years?: number;
  work_mode: string;
  industry: string;
}> = {
  "Senior GIS Integration Specialist": {
    required_skills: ["GIS", "ArcGIS", "Python", "SQL", "REST API", "ESRI"],
    preferred_skills: ["PostgreSQL", "PostGIS", "JavaScript", "ETL", "AWS", "Docker"],
    required_certifications: [],
    education_level: "Bachelor's",
    min_experience_years: 5,
    work_mode: "onsite",
    industry: "State Government",
  },
  "Microsoft Dynamics 365 Junior Solution Architect": {
    required_skills: ["Microsoft Dynamics 365", "Power Platform", "C#", ".NET", "SQL"],
    preferred_skills: ["Azure", "Power Automate", "Power BI", "JavaScript", "TypeScript"],
    required_certifications: ["Microsoft Dynamics 365"],
    education_level: "Bachelor's",
    min_experience_years: 3,
    work_mode: "onsite",
    industry: "State Government",
  },
  "Senior .NET Developer": {
    required_skills: ["C#", ".NET", "ASP.NET", "SQL Server", "REST API", "Entity Framework"],
    preferred_skills: ["Azure", "Docker", "React", "TypeScript", "CI/CD", "Git"],
    required_certifications: [],
    education_level: "Bachelor's",
    min_experience_years: 5,
    work_mode: "hybrid",
    industry: "State Government",
  },
  "Senior Database Developer": {
    required_skills: ["SQL Server", "T-SQL", "SSIS", "SSRS", "Database Design", "Performance Tuning"],
    preferred_skills: ["PostgreSQL", "Azure SQL", "Python", "ETL", "Data Warehousing", "Power BI"],
    required_certifications: [],
    education_level: "Bachelor's",
    min_experience_years: 5,
    work_mode: "hybrid",
    industry: "State Government",
  },
  "Senior Software Developer (Full Stack - AI Agent Interface & UI)": {
    required_skills: ["React", "TypeScript", "Node.js", "Python", "REST API", "PostgreSQL"],
    preferred_skills: ["Next.js", "Azure", "Docker", "GraphQL", "Tailwind", "LLM Integration"],
    required_certifications: [],
    education_level: "Bachelor's",
    min_experience_years: 5,
    work_mode: "hybrid",
    industry: "State Government",
  },
  "Senior Software Developer (Azure AI & Integration)": {
    required_skills: ["Azure", "Python", "Azure AI Services", "REST API", ".NET", "Docker"],
    preferred_skills: ["Azure OpenAI", "Cognitive Services", "Kubernetes", "Terraform", "CI/CD", "PostgreSQL"],
    required_certifications: ["Azure Solutions Architect"],
    education_level: "Bachelor's",
    min_experience_years: 5,
    work_mode: "hybrid",
    industry: "State Government",
  },
  "Azure AI & Integration Developer (Intelligent Document Processing)": {
    required_skills: ["Azure", "Python", "Azure AI Services", "Document Intelligence", "REST API"],
    preferred_skills: ["Azure OpenAI", "OCR", "Docker", "Kubernetes", ".NET", "CI/CD"],
    required_certifications: [],
    education_level: "Bachelor's",
    min_experience_years: 3,
    work_mode: "remote",
    industry: "State Government",
  },
  "Full-Stack Developer": {
    required_skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "REST API"],
    preferred_skills: ["Next.js", "Python", "AWS", "Docker", "GraphQL", "Git"],
    required_certifications: [],
    education_level: "Bachelor's",
    min_experience_years: 3,
    work_mode: "hybrid",
    industry: "Commercial",
  },
  "Senior Software Engineer": {
    required_skills: ["TypeScript", "React", "Node.js", "Python", "PostgreSQL", "AWS"],
    preferred_skills: ["Next.js", "Docker", "Kubernetes", "GraphQL", "Terraform", "CI/CD"],
    required_certifications: [],
    education_level: "Bachelor's",
    min_experience_years: 5,
    work_mode: "hybrid",
    industry: "Commercial",
  },
  "Project Manager": {
    required_skills: ["Project Management", "Agile", "JIRA", "Stakeholder Management"],
    preferred_skills: ["Scrum", "Azure DevOps", "Risk Management", "Budget Management", "PMP"],
    required_certifications: ["PMP"],
    education_level: "Bachelor's",
    min_experience_years: 5,
    work_mode: "onsite",
    industry: "State Government",
  },
  "QA Engineer": {
    required_skills: ["Test Automation", "Selenium", "SQL", "JIRA", "REST API Testing"],
    preferred_skills: ["Cypress", "Playwright", "Python", "CI/CD", "Performance Testing", "Agile"],
    required_certifications: [],
    education_level: "Bachelor's",
    min_experience_years: 3,
    work_mode: "onsite",
    industry: "Commercial",
  },
  "IT Consultant": {
    required_skills: ["Cloud Architecture", "AWS", "Azure", "Solution Design", "Agile"],
    preferred_skills: ["Terraform", "Docker", "Kubernetes", "CI/CD", "Python", "Security"],
    required_certifications: ["AWS Solutions Architect"],
    education_level: "Bachelor's",
    min_experience_years: 5,
    work_mode: "hybrid",
    industry: "State Government",
  },
  "Solution Architect": {
    required_skills: ["Solution Architecture", "AWS", "Azure", "Microservices", "REST API"],
    preferred_skills: ["Kubernetes", "Terraform", "Docker", "Python", "TypeScript", "CI/CD"],
    required_certifications: ["AWS Solutions Architect"],
    education_level: "Bachelor's",
    min_experience_years: 8,
    work_mode: "onsite",
    industry: "State Government",
  },
  "Business Analyst": {
    required_skills: ["Requirements Gathering", "SQL", "JIRA", "Agile", "Documentation"],
    preferred_skills: ["Tableau", "Power BI", "Python", "Confluence", "User Stories", "Data Analysis"],
    required_certifications: [],
    education_level: "Bachelor's",
    min_experience_years: 3,
    work_mode: "hybrid",
    industry: "Commercial",
  },
  "Data Analyst": {
    required_skills: ["SQL", "Python", "Tableau", "Excel", "Data Visualization"],
    preferred_skills: ["Power BI", "R", "Snowflake", "AWS", "ETL", "Statistical Analysis"],
    required_certifications: [],
    education_level: "Bachelor's",
    min_experience_years: 3,
    work_mode: "hybrid",
    industry: "Commercial",
  },
  "AI/ML Engineer": {
    required_skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "AWS"],
    preferred_skills: ["NLP", "LLM", "Kubernetes", "Docker", "Spark", "MLOps"],
    required_certifications: [],
    education_level: "Master's",
    min_experience_years: 3,
    work_mode: "hybrid",
    industry: "Commercial",
  },
  "DevOps Engineer": {
    required_skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Linux", "CI/CD"],
    preferred_skills: ["Python", "Ansible", "Jenkins", "GitHub Actions", "Prometheus", "Grafana"],
    required_certifications: ["AWS Solutions Architect"],
    education_level: "Bachelor's",
    min_experience_years: 5,
    work_mode: "hybrid",
    industry: "Commercial",
  },
};

async function seedPositionRequirements() {
  console.log("═".repeat(70));
  console.log("  Seeding Position Requirements");
  console.log("═".repeat(70));

  const { data: positions } = await sb
    .from("positions")
    .select("id, title, location")
    .eq("site_id", SITE_ID)
    .eq("active", true);

  if (!positions?.length) {
    console.log("No active positions found.");
    return;
  }

  let seeded = 0;
  for (const pos of positions) {
    const reqs = REQUIREMENTS[pos.title];
    if (!reqs) {
      console.log(`  ⊘ ${pos.title} — no requirements defined, skipping`);
      continue;
    }

    // Parse location for work_mode and location_requirement
    const locStr = pos.location || "";

    const { error } = await sb
      .from("position_requirements")
      .upsert({
        site_id: SITE_ID,
        position_id: pos.id,
        required_skills: reqs.required_skills,
        preferred_skills: reqs.preferred_skills,
        required_certifications: reqs.required_certifications,
        education_level: reqs.education_level,
        min_experience_years: reqs.min_experience_years,
        max_experience_years: reqs.max_experience_years ?? null,
        work_mode: reqs.work_mode,
        location_requirement: locStr,
        industry: reqs.industry,
        extraction_method: "manual",
      }, { onConflict: "site_id,position_id" });

    if (error) {
      console.log(`  ✗ ${pos.title}: ${error.message}`);
    } else {
      console.log(`  ✓ ${pos.title} — ${reqs.required_skills.length} required, ${reqs.preferred_skills.length} preferred`);
      seeded++;
    }
  }

  console.log(`\nSeeded ${seeded}/${positions.length} positions with requirements.`);
}

async function extractAndStoreResumes() {
  console.log(`\n${"═".repeat(70)}`);
  console.log("  Extracting & Storing Resume Text");
  console.log("═".repeat(70));

  // Get applications with resume paths
  const { data: apps } = await sb
    .from("applications")
    .select("id, full_name, email, resume_path, resume_name, candidate_id")
    .eq("site_id", SITE_ID)
    .not("resume_path", "is", null);

  if (!apps?.length) {
    console.log("No applications with resumes.");
    return 0;
  }

  // Dedupe by candidate
  const seen = new Set<string>();
  const unique = apps.filter(a => {
    const key = a.candidate_id || a.email;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  let stored = 0;
  for (const app of unique) {
    try {
      const { data, error } = await sb.storage
        .from("resumes")
        .download(app.resume_path!);

      if (error || !data) {
        console.log(`  ✗ ${app.full_name}: ${error?.message}`);
        continue;
      }

      const buffer = Buffer.from(await data.arrayBuffer());
      const ext = (app.resume_name || "").toLowerCase().split(".").pop();
      let text = "";

      if (ext === "pdf") {
        const result = await pdfParse(buffer);
        text = result.text || "";
      } else if (ext === "docx") {
        const str = buffer.toString("utf-8");
        const parts: string[] = [];
        const pattern = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
        let m;
        while ((m = pattern.exec(str)) !== null) parts.push(m[1]);
        text = parts.join(" ").replace(/\s+/g, " ").trim();
      }

      if (text.length < 50) {
        console.log(`  ✗ ${app.full_name}: too little text (${text.length})`);
        continue;
      }

      // Store in resumes table (no created_at/updated_at columns)
      const { error: insertErr } = await sb.from("resumes").insert({
        site_id: SITE_ID,
        candidate_id: app.candidate_id,
        file_name: app.resume_name,
        file_type: ext || "pdf",
        storage_path: app.resume_path,
        extracted_text: text,
        extracted_skills: [],  // Will be populated by matching engine
        extracted_experience_years: null,
        extracted_education: [],
        extraction_status: "completed",
        is_primary: true,
        uploaded_at: new Date().toISOString(),
      });

      if (insertErr) {
        // Might already exist — try update
        const { error: updateErr } = await sb
          .from("resumes")
          .update({
            extracted_text: text,
            extraction_status: "completed",
          })
          .eq("site_id", SITE_ID)
          .eq("candidate_id", app.candidate_id)
          .eq("storage_path", app.resume_path);

        if (updateErr) {
          console.log(`  ✗ ${app.full_name}: ${insertErr.message}`);
          continue;
        }
        console.log(`  ✓ ${app.full_name}: ${text.length} chars (updated)`);
      } else {
        console.log(`  ✓ ${app.full_name}: ${text.length} chars (inserted)`);
      }
      stored++;
    } catch (err: any) {
      console.log(`  ✗ ${app.full_name}: ${err.message}`);
    }
  }

  console.log(`\nStored ${stored}/${unique.length} resumes.`);
  return stored;
}

async function main() {
  await seedPositionRequirements();
  await extractAndStoreResumes();

  // Verify
  console.log(`\n${"═".repeat(70)}`);
  console.log("  Verification");
  console.log("═".repeat(70));

  const { count: reqCount } = await sb
    .from("position_requirements")
    .select("*", { count: "exact", head: true })
    .eq("site_id", SITE_ID);
  console.log(`  Position requirements: ${reqCount}`);

  const { count: resCount } = await sb
    .from("resumes")
    .select("*", { count: "exact", head: true })
    .eq("site_id", SITE_ID);
  console.log(`  Resumes: ${resCount}`);

  console.log("\nDone! Now trigger matching from the backoffice or run:");
  console.log("  npx tsx scripts/extract-and-match.ts");
}

main().catch(console.error);
