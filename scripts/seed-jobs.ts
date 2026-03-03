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

const sampleJobs = [
  {
    title: "Senior Software Engineer",
    slug: "senior-software-engineer",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    description:
      "Design and build scalable web applications, APIs, and enterprise software. Work with modern stacks across government and Fortune 500 projects.",
    active: true,
  },
  {
    title: "Full-Stack Developer",
    slug: "full-stack-developer",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    description:
      "Develop end-to-end features across front-end and back-end systems. React, Node.js, cloud platforms, and database design.",
    active: true,
  },
  {
    title: "DevOps Engineer",
    slug: "devops-engineer",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    description:
      "Build and maintain CI/CD pipelines, cloud infrastructure, and deployment automation on AWS and Azure.",
    active: true,
  },
  {
    title: "QA Engineer",
    slug: "qa-engineer",
    location: "Chicago, IL",
    type: "Full-time",
    description:
      "Ensure software quality through automated and manual testing. Develop test strategies for enterprise and government applications.",
    active: true,
  },
  {
    title: "IT Consultant",
    slug: "it-consultant",
    location: "Chicago, IL / Springfield, IL",
    type: "Contract",
    description:
      "Provide technology advisory services to Illinois state agencies under the TOPS contract. Cloud strategy, modernization, and digital transformation.",
    active: true,
  },
  {
    title: "Solution Architect",
    slug: "solution-architect",
    location: "Chicago, IL",
    type: "Full-time",
    description:
      "Design enterprise-scale technical architectures and lead solution delivery for complex government and commercial engagements.",
    active: true,
  },
  {
    title: "Business Analyst",
    slug: "business-analyst",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    description:
      "Translate business requirements into technical specifications. Bridge stakeholders and engineering teams on enterprise projects.",
    active: true,
  },
  {
    title: "Project Manager",
    slug: "project-manager",
    location: "Chicago, IL",
    type: "Full-time",
    description:
      "Lead cross-functional teams using Agile methodologies. Manage timelines, budgets, and delivery for government and enterprise clients.",
    active: true,
  },
  {
    title: "Data Analyst",
    slug: "data-analyst",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    description:
      "Analyze complex datasets, build dashboards, and deliver insights using SQL, Python, and modern visualization tools.",
    active: true,
  },
  {
    title: "AI/ML Engineer",
    slug: "ai-ml-engineer",
    location: "Chicago, IL / Remote",
    type: "Full-time",
    description:
      "Build and deploy machine learning models, LLM integrations, and AI-powered solutions for enterprise clients.",
    active: true,
  },
];

async function seed() {
  console.log(`Seeding ${sampleJobs.length} positions into Supabase...`);

  const { data, error } = await supabase
    .from("positions")
    .upsert(sampleJobs, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("Error seeding positions:", error.message);
    process.exit(1);
  }

  console.log(`Successfully inserted/updated ${data.length} positions:`);
  for (const job of data) {
    console.log(`  - ${job.title} (${job.location}) [${job.type}]`);
  }
}

seed();
