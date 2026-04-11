/**
 * OpenSpecMatch — Compare Rule-Based vs LLM Resume Extraction
 *
 * Run (rule-based only):
 *   npx tsx examples/compare-extractors.ts
 *
 * Run (with LLM comparison):
 *   ANTHROPIC_API_KEY=sk-... npx tsx examples/compare-extractors.ts
 *   OPENAI_API_KEY=sk-... OPENAI_MODE=1 npx tsx examples/compare-extractors.ts
 */

import { OpenSpecMatchEngine } from "../src/engine/index.js";
import type { PositionInput } from "../src/extractors/position-extractor.js";
import type { ResumeInput } from "../src/extractors/resume-extractor.js";
import type { CapabilitySpec } from "../src/specs/capability-spec.js";
import type { SpecMatchResult } from "../src/specs/match-result.js";
import type { LLMProviderConfig } from "../src/llm/types.js";

// ── Position ─────────────────────────────────────────────────────

const position: PositionInput = {
  id: "pos-demo",
  title: "Senior Full-Stack Developer",
  requiredSkills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
  preferredSkills: ["Next.js", "Docker", "AWS", "GraphQL"],
  requiredCertifications: ["AWS Solutions Architect"],
  educationLevel: "Bachelor's",
  educationField: "Computer Science",
  minExperienceYears: 5,
  industry: "fintech",
  location: { city: "Chicago", state: "IL", workMode: "hybrid" },
};

// ── Resume ───────────────────────────────────────────────────────

const resume: ResumeInput = {
  id: "candidate-demo",
  name: "Demo Candidate",
  text: `
SARAH CHEN
Senior Software Engineer | Chicago, IL
sarah.chen@email.com | (312) 555-0199

SUMMARY
Full-stack engineer with 9 years of experience building scalable web applications.
Passionate about clean architecture, mentoring junior developers, and shipping
reliable software in fast-paced fintech environments.

SKILLS
- TypeScript (6 years) — React, Next.js, Node.js, Express, NestJS
- Python (4 years) — FastAPI, Django, data pipelines with pandas
- PostgreSQL (7 years) — Schema design, query optimization, replication
- MongoDB (3 years) — Aggregation pipelines, Atlas Search
- Docker & Kubernetes (4 years) — Production container orchestration on AWS EKS
- AWS (5 years) — EC2, S3, Lambda, RDS, CloudFormation, ECS
- Terraform (2 years) — Infrastructure as code for multi-region deployments
- GraphQL (3 years) — Apollo Server, Hasura, schema federation
- Git, GitHub Actions, CircleCI, Datadog

EXPERIENCE

Senior Full-Stack Engineer | PayGrid (Fintech) | 2021 - Present
- Architected React + Next.js frontend serving 800K monthly active users
- Designed Node.js microservices handling $3B annual payment volume
- Led migration from REST to GraphQL, reducing API calls by 60%
- Managed PostgreSQL clusters with read replicas and pgbouncer
- Mentored team of 4 junior engineers through code reviews and pair programming
- Implemented CI/CD pipeline with GitHub Actions reducing deploy time from 45min to 8min
- Collaborated with product, design, and compliance teams across 3 time zones

Backend Engineer | DataFlow Inc. | 2018 - 2021
- Built real-time ETL pipelines with Python, Kafka, and PostgreSQL
- Designed REST APIs serving 50+ internal microservices
- Containerized 15 services with Docker, deployed on AWS ECS
- Led initiative to add integration testing, reducing production bugs by 35%

Junior Developer | TechStart Labs | 2016 - 2018
- Built full-stack features with React, Node.js, and MongoDB
- Created automated test suites with Jest and Cypress
- Participated in agile ceremonies and sprint planning

EDUCATION
B.S. Computer Science | University of Illinois at Urbana-Champaign | 2016

CERTIFICATIONS
AWS Solutions Architect Associate (SAA-C03) | 2023
Certified Kubernetes Administrator (CKA) | 2022

SPEAKING
"Scaling GraphQL in Fintech" — Chicago JS Meetup, 2024
"From REST to GraphQL: Migration Playbook" — Internal tech talk, 2023
  `,
};

// ── Helpers ──────────────────────────────────────────────────────

function printExtraction(label: string, spec: CapabilitySpec) {
  console.log(`\n${"─".repeat(70)}`);
  console.log(`${label}: ${spec.capabilities.length} items extracted`);
  console.log(`${"─".repeat(70)}`);

  if (spec.context.totalExperienceYears) {
    console.log(`  Total Experience: ${spec.context.totalExperienceYears} years`);
  }
  if (spec.context.currentRole) {
    console.log(`  Current Role: ${spec.context.currentRole}`);
  }
  if (spec.context.location) {
    const loc = spec.context.location;
    console.log(`  Location: ${[loc.city, loc.state, loc.country].filter(Boolean).join(", ")}`);
  }
  console.log();

  // Group by category
  const byCategory = new Map<string, typeof spec.capabilities>();
  for (const cap of spec.capabilities) {
    const list = byCategory.get(cap.category) ?? [];
    list.push(cap);
    byCategory.set(cap.category, list);
  }

  for (const [cat, items] of byCategory) {
    console.log(`  ${cat.toUpperCase()} (${items.length}):`);
    for (const item of items) {
      const parts = [`    • ${item.rawText}`];
      parts.push(`[${item.level}]`);
      if (item.years) parts.push(`${item.years}yr`);
      if (item.taxonomyRef) parts.push(`→ ${item.taxonomyRef.path}`);
      else parts.push(`(no taxonomy match)`);
      if (item.evidence.length > 0) {
        parts.push(`| ${item.evidence[0].description.slice(0, 60)}...`);
      }
      console.log(parts.join(" "));
    }
  }
}

function printResult(label: string, result: SpecMatchResult) {
  console.log(`\n${"═".repeat(70)}`);
  console.log(`${label}`);
  console.log(`  Overall: ${result.overallScore}/100 | Confidence: ${result.confidence}/100 | Gate: ${result.passedMandatoryGate ? "PASS" : "FAIL"}`);
  console.log(`${"═".repeat(70)}`);

  for (const [cat, cs] of Object.entries(result.categoryScores)) {
    if (cs.itemCount > 0) {
      console.log(`  ${cat}: ${cs.score}/100 (${cs.matchedCount}/${cs.itemCount} matched)`);
    }
  }

  if (result.strengths.length > 0) {
    console.log("\n  STRENGTHS:");
    for (const s of result.strengths) {
      console.log(`    ✓ ${s.rawText} (${s.score})`);
    }
  }
  if (result.gaps.length > 0) {
    console.log("\n  GAPS:");
    for (const g of result.gaps) {
      console.log(`    ✗ ${g.rawText} (${g.score})`);
    }
  }
  if (result.unknowns.length > 0) {
    console.log("\n  NOT FOUND:");
    for (const u of result.unknowns) {
      console.log(`    ? ${u.rawText}`);
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════════════╗");
  console.log("║           OpenSpecMatch — Extractor Comparison                      ║");
  console.log("╚══════════════════════════════════════════════════════════════════════╝");

  // 1. Rule-based extraction + matching
  const ruleEngine = new OpenSpecMatchEngine();

  const ruleSpec = ruleEngine.extractResume(resume);
  printExtraction("RULE-BASED EXTRACTION", ruleSpec);

  const demand = ruleEngine.extractPosition(position);
  const ruleResult = ruleEngine.match(demand, ruleSpec);
  printResult("RULE-BASED MATCH RESULT", ruleResult);

  // 2. LLM extraction + matching (if API key provided)
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const useOpenAI = process.env.OPENAI_MODE === "1";

  let llmConfig: LLMProviderConfig | undefined;
  if (anthropicKey && !useOpenAI) {
    llmConfig = { type: "anthropic", apiKey: anthropicKey };
  } else if (openaiKey) {
    llmConfig = { type: "openai", apiKey: openaiKey };
  }

  if (llmConfig) {
    console.log(`\n\n${"*".repeat(70)}`);
    console.log(`* Running LLM extraction with ${llmConfig.type}...`);
    console.log(`${"*".repeat(70)}`);

    const llmEngine = new OpenSpecMatchEngine({ llm: llmConfig });

    const llmSpec = await llmEngine.extractResumeAsync(resume);
    printExtraction("LLM EXTRACTION", llmSpec);

    const llmResult = llmEngine.match(demand, llmSpec);
    printResult("LLM MATCH RESULT", llmResult);

    // Side-by-side comparison
    console.log(`\n\n${"═".repeat(70)}`);
    console.log("COMPARISON: Rule-Based vs LLM");
    console.log(`${"═".repeat(70)}`);
    console.log(`  Items extracted:  Rule=${ruleSpec.capabilities.length}  LLM=${llmSpec.capabilities.length}`);
    console.log(`  Overall score:    Rule=${ruleResult.overallScore}  LLM=${llmResult.overallScore}`);
    console.log(`  Confidence:       Rule=${ruleResult.confidence}  LLM=${llmResult.confidence}`);
    console.log(`  Strengths:        Rule=${ruleResult.strengths.length}  LLM=${llmResult.strengths.length}`);
    console.log(`  Gaps:             Rule=${ruleResult.gaps.length}  LLM=${llmResult.gaps.length}`);
    console.log(`  Unknowns:         Rule=${ruleResult.unknowns.length}  LLM=${llmResult.unknowns.length}`);
  } else {
    console.log("\n─────────────────────────────────────────────────────────────────");
    console.log("To compare with LLM extraction, run with an API key:");
    console.log("  ANTHROPIC_API_KEY=sk-... npx tsx examples/compare-extractors.ts");
    console.log("  OPENAI_API_KEY=sk-... OPENAI_MODE=1 npx tsx examples/compare-extractors.ts");
    console.log("─────────────────────────────────────────────────────────────────");
  }
}

main().catch(console.error);
