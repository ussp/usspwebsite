/**
 * OpenSpecMatch — Resume Matching Example
 *
 * Run:  npx tsx examples/match-resume.ts
 *
 * Edit the position and resumes below to test with your own data.
 */

import { OpenSpecMatchEngine } from "../src/engine/index.js";
import type { PositionInput } from "../src/extractors/position-extractor.js";
import type { ResumeInput } from "../src/extractors/resume-extractor.js";

// ── Define a position ────────────────────────────────────────────

const position: PositionInput = {
  id: "pos-demo",
  title: "Senior Full-Stack Developer",
  requiredSkills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
  preferredSkills: ["Next.js", "Docker", "AWS", "GraphQL"],
  requiredCertifications: [],
  educationLevel: "Bachelor's",
  educationField: "Computer Science",
  minExperienceYears: 5,
  industry: "fintech",
  location: { city: "Chicago", state: "IL", workMode: "hybrid" },
  compensation: { min: 65, max: 90, currency: "USD", type: "hourly" },
};

// ── Define candidate resumes ─────────────────────────────────────

const resumes: ResumeInput[] = [
  {
    id: "candidate-a",
    name: "Candidate A — Strong Match",
    text: `
SENIOR FULL-STACK ENGINEER
8 years of professional experience

SKILLS
- TypeScript (5 years) — React, Next.js, Node.js
- PostgreSQL (6 years) — Schema design, performance tuning
- Docker & AWS (3 years) — ECS, Lambda, S3
- GraphQL (2 years) — Apollo Server, Hasura
- Python (4 years) — FastAPI, data pipelines
- Git, GitHub Actions, Terraform

EXPERIENCE
Lead Developer | PayTech Inc. | 2021 - Present
- Built React + Next.js frontend serving 500K monthly users
- Designed Node.js microservices processing $2B in payments
- Managed PostgreSQL clusters with replication

Full-Stack Dev | StartupCo | 2018 - 2021
- Built TypeScript APIs with Express and PostgreSQL
- Deployed to AWS using Docker and Terraform

EDUCATION
B.S. Computer Science | Northwestern University | 2018
    `,
  },
  {
    id: "candidate-b",
    name: "Candidate B — Partial Match",
    text: `
BACKEND DEVELOPER
4 years of professional experience

SKILLS
- Python (4 years) — Django, Flask
- PostgreSQL (3 years)
- Docker (2 years)
- Linux, Git

EXPERIENCE
Backend Developer | DataCorp | 2022 - Present
- Built REST APIs with Django and PostgreSQL
- Managed Docker deployments on AWS EC2

Junior Developer | TechStart | 2020 - 2022
- Built Python automation scripts
- Database maintenance with PostgreSQL

EDUCATION
B.S. Information Technology | DePaul University | 2020
    `,
  },
  {
    id: "candidate-c",
    name: "Candidate C — Weak Match",
    text: `
UX DESIGNER
3 years of experience

SKILLS
- Figma, Sketch, Adobe XD
- HTML, CSS
- User research, wireframing
- Prototyping

EXPERIENCE
UX Designer | DesignStudio | 2022 - Present
- Designed interfaces for mobile and web apps
- Conducted user research with 200+ participants

EDUCATION
B.A. Graphic Design | Columbia College | 2022
    `,
  },
];

// ── Run matching ─────────────────────────────────────────────────

const engine = new OpenSpecMatchEngine();

console.log("=".repeat(70));
console.log(`POSITION: ${position.title}`);
console.log(`Required: ${position.requiredSkills?.join(", ")}`);
console.log(`Preferred: ${position.preferredSkills?.join(", ")}`);
console.log("=".repeat(70));
console.log();

// Extract position once
const demand = engine.extractPosition(position);
console.log(`Extracted ${demand.requirements.length} requirements from position\n`);

// Match all resumes
const results = engine.matchResumes(position, resumes);

for (const result of results) {
  const resume = resumes.find((r) => `cs-${r.id}` === result.capabilityIds[0])!;
  console.log("-".repeat(70));
  console.log(`CANDIDATE: ${resume.name}`);
  console.log(`  Overall Score:  ${result.overallScore}/100`);
  console.log(`  Confidence:     ${result.confidence}/100`);
  console.log(`  Mandatory Gate: ${result.passedMandatoryGate ? "PASSED" : "FAILED"}`);
  console.log();

  // Category breakdown
  console.log("  Category Scores:");
  for (const [cat, cs] of Object.entries(result.categoryScores)) {
    if (cs.itemCount > 0) {
      console.log(`    ${cat}: ${cs.score}/100 (${cs.matchedCount}/${cs.itemCount} items matched, weight: ${cs.weight})`);
    }
  }
  console.log();

  // Strengths
  if (result.strengths.length > 0) {
    console.log("  Strengths:");
    for (const s of result.strengths) {
      console.log(`    ✓ ${s.rawText} (${s.score}/100)`);
    }
  }

  // Gaps
  if (result.gaps.length > 0) {
    console.log("  Gaps:");
    for (const g of result.gaps) {
      console.log(`    ✗ ${g.rawText} (${g.score}/100)`);
    }
  }

  // Unknowns
  if (result.unknowns.length > 0) {
    console.log("  Not Found:");
    for (const u of result.unknowns) {
      console.log(`    ? ${u.rawText}`);
    }
  }

  console.log();
}

console.log("=".repeat(70));
console.log("RANKING (best to worst):");
for (let i = 0; i < results.length; i++) {
  const resume = resumes.find((r) => `cs-${r.id}` === results[i].capabilityIds[0])!;
  console.log(`  ${i + 1}. ${resume.name} — ${results[i].overallScore}/100`);
}
console.log("=".repeat(70));
