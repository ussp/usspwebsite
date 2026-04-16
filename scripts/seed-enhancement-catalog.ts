/**
 * Seed AI Enhancement Catalog v1 with ~120 items across 9 pillars.
 *
 * Usage: npx tsx scripts/seed-enhancement-catalog.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface CatalogItem {
  pillar: string;
  name: string;
  description: string;
  example_tools: string;
}

const items: CatalogItem[] = [
  // ── Development (~15) ─────────────────────────────────
  { pillar: "development", name: "Code Completion / Suggestion", description: "AI-powered inline code suggestions and autocomplete", example_tools: "GitHub Copilot, Cursor, Tabnine" },
  { pillar: "development", name: "Code Generation from Natural Language", description: "Generate code from natural language descriptions or comments", example_tools: "GitHub Copilot, ChatGPT, Claude" },
  { pillar: "development", name: "Code Refactoring Assistance", description: "AI-suggested refactoring for cleaner, more maintainable code", example_tools: "GitHub Copilot, SonarQube AI" },
  { pillar: "development", name: "Code Review Automation", description: "AI-assisted PR review with suggestions, bug detection, style checks", example_tools: "GitHub Copilot, CodeRabbit, Codacy" },
  { pillar: "development", name: "Code Translation (Language-to-Language)", description: "Convert code between programming languages", example_tools: "GitHub Copilot, ChatGPT" },
  { pillar: "development", name: "Boilerplate / Scaffold Generation", description: "Generate project scaffolding, config files, and boilerplate", example_tools: "GitHub Copilot, Yeoman AI" },
  { pillar: "development", name: "Regex Generation", description: "Generate and explain regular expressions from natural language", example_tools: "GitHub Copilot, ChatGPT" },
  { pillar: "development", name: "SQL Query Generation", description: "Generate SQL queries from natural language descriptions", example_tools: "GitHub Copilot, ChatGPT" },
  { pillar: "development", name: "API Client Generation", description: "Generate API client code from OpenAPI/Swagger specs", example_tools: "GitHub Copilot, OpenAPI Generator" },
  { pillar: "development", name: "Merge Conflict Resolution", description: "AI-assisted resolution of git merge conflicts", example_tools: "GitHub Copilot, GitLens AI" },
  { pillar: "development", name: "Dead Code Detection", description: "Identify unused code, imports, and dependencies", example_tools: "SonarQube AI, GitHub Copilot" },
  { pillar: "development", name: "Dependency Upgrade Assistance", description: "AI analysis of dependency updates, breaking changes, migration paths", example_tools: "Dependabot, Renovate, ChatGPT" },
  { pillar: "development", name: "Code Search / Explanation", description: "AI-powered codebase search and code explanation", example_tools: "GitHub Copilot Chat, Sourcegraph Cody" },
  { pillar: "development", name: "Commit Message Generation", description: "Auto-generate meaningful commit messages from diffs", example_tools: "GitHub Copilot, Conventional Commits AI" },
  { pillar: "development", name: "PR Description Generation", description: "Auto-generate pull request descriptions and summaries", example_tools: "GitHub Copilot, CodeRabbit" },

  // ── Testing (~14) ─────────────────────────────────────
  { pillar: "testing", name: "Unit Test Generation", description: "AI-generated unit tests from source code", example_tools: "GitHub Copilot, Diffblue" },
  { pillar: "testing", name: "Integration Test Generation", description: "AI-generated integration and API tests", example_tools: "GitHub Copilot, Postman AI" },
  { pillar: "testing", name: "E2E Test Scenario Generation", description: "Generate end-to-end test scenarios from user stories", example_tools: "Playwright AI, ChatGPT" },
  { pillar: "testing", name: "Test Data / Fixture Generation", description: "AI-generated test data, fixtures, and mock objects", example_tools: "GitHub Copilot, ChatGPT" },
  { pillar: "testing", name: "Regression Test Prioritization", description: "AI-ranked regression tests based on code changes and risk", example_tools: "Launchable, Codecov AI" },
  { pillar: "testing", name: "Flaky Test Detection", description: "Identify and diagnose flaky/intermittent test failures", example_tools: "BuildPulse, Launchable" },
  { pillar: "testing", name: "Mutation Testing", description: "AI-assisted mutation testing to validate test quality", example_tools: "Stryker, PIT" },
  { pillar: "testing", name: "Visual Regression Testing", description: "AI-powered visual comparison for UI changes", example_tools: "Applitools, Percy" },
  { pillar: "testing", name: "API Contract Test Generation", description: "Generate contract tests from API specs and usage patterns", example_tools: "Pact AI, Postman AI" },
  { pillar: "testing", name: "Load Test Scenario Generation", description: "AI-designed load/performance test scenarios", example_tools: "k6, Gatling, ChatGPT" },
  { pillar: "testing", name: "Test Coverage Gap Analysis", description: "AI identification of untested code paths and risk areas", example_tools: "Codecov AI, SonarQube" },
  { pillar: "testing", name: "Bug Reproduction Automation", description: "AI-assisted reproduction of reported bugs", example_tools: "ChatGPT, Replay.io" },
  { pillar: "testing", name: "Assertion Generation", description: "Auto-generate test assertions from expected behavior", example_tools: "GitHub Copilot" },
  { pillar: "testing", name: "Test Maintenance / Self-Healing Selectors", description: "AI that updates test selectors when UI changes", example_tools: "Testim, Mabl, Healenium" },

  // ── Documentation (~10) ───────────────────────────────
  { pillar: "documentation", name: "API Documentation Generation", description: "Auto-generate API docs from code and OpenAPI specs", example_tools: "GitHub Copilot, Swagger AI" },
  { pillar: "documentation", name: "Code Comment Generation", description: "AI-generated inline code comments and JSDoc/docstrings", example_tools: "GitHub Copilot, Mintlify" },
  { pillar: "documentation", name: "README Generation", description: "Auto-generate project README files", example_tools: "GitHub Copilot, ChatGPT" },
  { pillar: "documentation", name: "Changelog Generation", description: "Auto-generate changelogs from commits and PRs", example_tools: "GitHub Copilot, Release Drafter" },
  { pillar: "documentation", name: "Architecture Diagram Generation", description: "Generate architecture diagrams from code structure", example_tools: "ChatGPT, Claude, Mermaid AI" },
  { pillar: "documentation", name: "Runbook Generation", description: "Generate operational runbooks from infrastructure and incidents", example_tools: "ChatGPT, Claude" },
  { pillar: "documentation", name: "Inline Documentation Enhancement", description: "Improve existing documentation with AI suggestions", example_tools: "GitHub Copilot, Grammarly" },
  { pillar: "documentation", name: "User-Facing Help Text Generation", description: "Generate UI help text, tooltips, and error messages", example_tools: "ChatGPT, Claude" },
  { pillar: "documentation", name: "Migration Guide Generation", description: "Generate migration guides for version upgrades", example_tools: "ChatGPT, Claude" },
  { pillar: "documentation", name: "ADR (Architecture Decision Record) Drafting", description: "AI-assisted drafting of architecture decision records", example_tools: "ChatGPT, Claude" },

  // ── PMO (~10) ─────────────────────────────────────────
  { pillar: "pmo", name: "Sprint Velocity Forecasting", description: "AI-predicted velocity based on historical sprint data", example_tools: "Jira AI, LinearB" },
  { pillar: "pmo", name: "Effort Estimation", description: "AI-assisted story point estimation and effort prediction", example_tools: "Jira AI, Planning Poker AI" },
  { pillar: "pmo", name: "Risk Identification", description: "AI-detected sprint and project risks from patterns", example_tools: "Jira AI, ChatGPT" },
  { pillar: "pmo", name: "Status Report Generation", description: "Auto-generated sprint/project status reports", example_tools: "Jira AI, ChatGPT, Claude" },
  { pillar: "pmo", name: "Dependency Mapping", description: "AI-identified cross-team and cross-story dependencies", example_tools: "Jira AI, Miro AI" },
  { pillar: "pmo", name: "Resource Allocation Optimization", description: "AI-suggested team allocation based on skills and capacity", example_tools: "Jira AI, Forecast.app" },
  { pillar: "pmo", name: "Milestone Tracking Anomaly Detection", description: "AI alerts for milestone drift and schedule risk", example_tools: "Jira AI, Microsoft Project AI" },
  { pillar: "pmo", name: "Meeting Summarization", description: "AI-generated meeting notes, action items, and decisions", example_tools: "Otter.ai, Fireflies, Microsoft Copilot" },
  { pillar: "pmo", name: "Backlog Prioritization", description: "AI-assisted backlog ordering by value, risk, and dependency", example_tools: "Jira AI, ChatGPT" },
  { pillar: "pmo", name: "Schedule Compression Analysis", description: "AI analysis of critical path and schedule optimization", example_tools: "Microsoft Project AI, ChatGPT" },

  // ── BA & Requirements (~9) ────────────────────────────
  { pillar: "ba", name: "Requirements Extraction from Transcripts", description: "Extract requirements from meeting recordings and transcripts", example_tools: "Otter.ai, ChatGPT, Claude" },
  { pillar: "ba", name: "User Story Generation", description: "AI-generated user stories from requirements or conversations", example_tools: "Jira AI, ChatGPT, Claude" },
  { pillar: "ba", name: "Acceptance Criteria Generation", description: "Auto-generate acceptance criteria and edge cases for stories", example_tools: "Jira AI, ChatGPT" },
  { pillar: "ba", name: "Process Flow Generation", description: "Generate process flow diagrams from natural language descriptions", example_tools: "Miro AI, ChatGPT, Lucidchart AI" },
  { pillar: "ba", name: "Gap Analysis", description: "AI-identified gaps in requirements coverage", example_tools: "ChatGPT, Claude" },
  { pillar: "ba", name: "Stakeholder Sentiment Analysis", description: "AI analysis of stakeholder feedback and sentiment trends", example_tools: "ChatGPT, MonkeyLearn" },
  { pillar: "ba", name: "Requirements Traceability", description: "AI-maintained traceability between requirements, stories, and tests", example_tools: "Jira AI, Azure DevOps AI" },
  { pillar: "ba", name: "Competitive Feature Analysis", description: "AI research on competitor features and market positioning", example_tools: "ChatGPT, Claude" },
  { pillar: "ba", name: "Change Request Impact Analysis", description: "AI assessment of change request impact on scope, timeline, and dependencies", example_tools: "Jira AI, ChatGPT" },

  // ── DevOps (~11) ──────────────────────────────────────
  { pillar: "devops", name: "Infrastructure-as-Code Generation", description: "Generate Terraform, CloudFormation, or Pulumi from requirements", example_tools: "GitHub Copilot, ChatGPT" },
  { pillar: "devops", name: "CI/CD Pipeline Generation", description: "Auto-generate CI/CD pipeline configs (GitHub Actions, Azure Pipelines)", example_tools: "GitHub Copilot, ChatGPT" },
  { pillar: "devops", name: "Incident Root Cause Analysis", description: "AI-assisted incident investigation and root cause identification", example_tools: "PagerDuty AI, Datadog AI" },
  { pillar: "devops", name: "Log Anomaly Detection", description: "AI detection of unusual patterns in application and system logs", example_tools: "Datadog AI, Elastic AI, Splunk AI" },
  { pillar: "devops", name: "Alert Noise Reduction", description: "AI filtering and correlation of monitoring alerts to reduce noise", example_tools: "PagerDuty AI, Datadog AI" },
  { pillar: "devops", name: "Deployment Risk Scoring", description: "AI-assessed risk level for each deployment based on change scope", example_tools: "LinearB, Sleuth" },
  { pillar: "devops", name: "Configuration Drift Detection", description: "AI detection of infrastructure config drift from desired state", example_tools: "Terraform, AWS Config AI" },
  { pillar: "devops", name: "Capacity Forecasting", description: "AI-predicted infrastructure capacity needs", example_tools: "AWS Cost Explorer AI, Datadog" },
  { pillar: "devops", name: "Auto-Remediation Playbook Generation", description: "AI-generated runbooks for common incident types", example_tools: "PagerDuty AI, ChatGPT" },
  { pillar: "devops", name: "Dockerfile / Container Optimization", description: "AI optimization of container images for size and security", example_tools: "GitHub Copilot, Docker Scout" },
  { pillar: "devops", name: "Cloud Cost Optimization", description: "AI recommendations to reduce cloud infrastructure costs", example_tools: "AWS Cost Explorer AI, Infracost" },

  // ── Data (~10) ────────────────────────────────────────
  { pillar: "data", name: "Schema Design Suggestion", description: "AI-suggested database schema based on requirements", example_tools: "GitHub Copilot, ChatGPT" },
  { pillar: "data", name: "Data Pipeline Generation", description: "AI-generated ETL/ELT pipeline code", example_tools: "GitHub Copilot, dbt AI" },
  { pillar: "data", name: "SQL Optimization", description: "AI-optimized SQL queries for performance", example_tools: "GitHub Copilot, EverSQL" },
  { pillar: "data", name: "Data Quality Anomaly Detection", description: "AI detection of data quality issues and anomalies", example_tools: "Great Expectations, Monte Carlo" },
  { pillar: "data", name: "ETL Code Generation", description: "Generate ETL transformation code from specifications", example_tools: "GitHub Copilot, ChatGPT" },
  { pillar: "data", name: "Data Lineage Mapping", description: "AI-traced data lineage across pipelines and systems", example_tools: "Atlan, Monte Carlo" },
  { pillar: "data", name: "Synthetic Data Generation", description: "AI-generated realistic test data preserving statistical properties", example_tools: "Gretel, Faker AI, ChatGPT" },
  { pillar: "data", name: "Data Migration Script Generation", description: "AI-generated data migration and transformation scripts", example_tools: "GitHub Copilot, ChatGPT" },
  { pillar: "data", name: "Query Performance Analysis", description: "AI analysis of query execution plans and optimization suggestions", example_tools: "EverSQL, pganalyze" },
  { pillar: "data", name: "Data Catalog Enrichment", description: "AI-generated descriptions and tags for data catalog entries", example_tools: "Atlan AI, ChatGPT" },

  // ── Security (~10) ────────────────────────────────────
  { pillar: "security", name: "Vulnerability Detection in Code", description: "AI-identified security vulnerabilities during development", example_tools: "GitHub Advanced Security, Snyk, SonarQube" },
  { pillar: "security", name: "SAST/DAST Finding Triage", description: "AI prioritization and deduplication of security scan findings", example_tools: "Snyk AI, GitHub Copilot" },
  { pillar: "security", name: "Secrets Detection", description: "AI detection of hardcoded secrets, keys, and credentials", example_tools: "GitGuardian, GitHub Secret Scanning" },
  { pillar: "security", name: "Dependency Vulnerability Assessment", description: "AI analysis of dependency vulnerabilities and upgrade paths", example_tools: "Snyk, Dependabot, Renovate" },
  { pillar: "security", name: "Threat Modeling Assistance", description: "AI-assisted threat modeling for new features and architectures", example_tools: "ChatGPT, Claude, STRIDE AI" },
  { pillar: "security", name: "Security Policy Generation", description: "AI-generated security policies and standards documentation", example_tools: "ChatGPT, Claude" },
  { pillar: "security", name: "Penetration Test Scenario Generation", description: "AI-generated pen test scenarios based on application architecture", example_tools: "ChatGPT, Burp AI" },
  { pillar: "security", name: "Compliance Check Automation", description: "AI-automated compliance verification (SOC2, ISO 27001, HIPAA)", example_tools: "Drata AI, Vanta AI" },
  { pillar: "security", name: "Incident Response Playbook Generation", description: "AI-generated security incident response procedures", example_tools: "PagerDuty AI, ChatGPT" },
  { pillar: "security", name: "Attack Surface Analysis", description: "AI mapping of application attack surface and exposure points", example_tools: "Snyk, GitHub Advanced Security" },

  // ── Design (~10) ──────────────────────────────────────
  { pillar: "design", name: "UI Component Generation from Wireframes", description: "Generate UI components from wireframe images or descriptions", example_tools: "v0, Figma AI, ChatGPT" },
  { pillar: "design", name: "Design-to-Code Conversion", description: "Convert design files to production-ready frontend code", example_tools: "Figma Dev Mode, Locofy, Anima" },
  { pillar: "design", name: "Accessibility Audit", description: "AI-powered accessibility compliance checking (WCAG, Section 508)", example_tools: "axe AI, Stark, AccessiBe" },
  { pillar: "design", name: "Design System Compliance", description: "AI verification that designs follow the design system", example_tools: "Figma AI, Zeplin AI" },
  { pillar: "design", name: "Responsive Layout Suggestion", description: "AI-suggested responsive breakpoint layouts", example_tools: "Figma AI, v0" },
  { pillar: "design", name: "UX Copy Generation", description: "AI-generated microcopy, button labels, error messages", example_tools: "Writer, ChatGPT, Claude" },
  { pillar: "design", name: "Color/Contrast Validation", description: "AI verification of color contrast ratios and accessibility", example_tools: "Stark, axe AI" },
  { pillar: "design", name: "Prototype Generation", description: "AI-generated interactive prototypes from descriptions", example_tools: "v0, Figma AI" },
  { pillar: "design", name: "Design Token Generation", description: "AI-generated design tokens from brand guidelines", example_tools: "Figma AI, Style Dictionary AI" },
  { pillar: "design", name: "User Flow Optimization", description: "AI analysis and optimization of user flows", example_tools: "Hotjar AI, FullStory AI" },
];

async function seed() {
  console.log(`Seeding AI Enhancement Catalog v1 with ${items.length} items...`);

  // Check for existing catalog version
  const { data: existingVersion } = await supabase
    .from("catalog_versions")
    .select("id")
    .eq("version_number", 1)
    .single();

  if (existingVersion) {
    console.log("Catalog v1 already exists. Skipping seed.");
    return;
  }

  // Create catalog version
  const { data: version, error: vError } = await supabase
    .from("catalog_versions")
    .insert({
      version_number: 1,
      release_notes: "Initial catalog with ~120 AI enhancements across 9 SDLC pillars",
      item_count: items.length,
      created_by: "system_seed_v1",
    })
    .select()
    .single();

  if (vError) { console.error("Failed to create version:", vError.message); process.exit(1); }

  // Insert items
  const rows = items.map((item) => ({
    pillar: item.pillar,
    name: item.name,
    description: item.description,
    example_tools: item.example_tools,
    version: 1,
    status: "active",
    parent_item_id: null,
    catalog_version_id: version.id,
  }));

  const { error } = await supabase.from("ai_enhancement_catalog").insert(rows);
  if (error) { console.error("Failed to insert items:", error.message); process.exit(1); }

  // Count per pillar
  const pillars = [...new Set(items.map((i) => i.pillar))];
  for (const p of pillars) {
    const count = items.filter((i) => i.pillar === p).length;
    console.log(`  ${p}: ${count} items`);
  }

  console.log(`\nSuccessfully seeded catalog v1: ${items.length} items across ${pillars.length} pillars.`);
}

seed();
