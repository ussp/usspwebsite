#!/usr/bin/env node
/**
 * Add Mintlify frontmatter to guide markdown files.
 * Run once: node add-frontmatter.js
 */
const fs = require('fs');
const path = require('path');

const frontmatter = {
  'README.md': { title: 'AI Transformation Framework', description: 'Complete guide for Krasan\'s AI-Augmented Agile Delivery framework' },
  '01-introduction.md': { title: 'Introduction', description: 'Why AI transformation, philosophy, and the 8-phase framework' },
  '02-executive-discovery.md': { title: 'Executive Discovery', description: 'Org contact, context gathering, and executive interview process' },
  '03-governance-compliance.md': { title: 'Governance & Compliance', description: 'DoIT AI Policy alignment, guardrails, and regulatory mapping' },
  '04-readiness-assessment.md': { title: 'Readiness Assessment', description: '23-question survey instrument for AI readiness across all teams' },
  '05-baseline-measurement.md': { title: 'Baseline Measurement', description: 'JIRA metrics, SPACE/DevEx surveys, and baseline report' },
  '06-process-design.md': { title: 'Process Design', description: 'Mapping current → AI-augmented state for each SDLC process' },
  '07-training-delivery.md': { title: 'Training Delivery', description: '6 role-based training tracks with content, delivery methods, and materials' },
  '08-pilot-execution.md': { title: 'Pilot Execution', description: 'Team selection, control group design, and weekly cadence' },
  '09-measurement-reporting.md': { title: 'Measurement & Reporting', description: 'KPIs, before/after comparison, and leadership dashboard' },
  '10-playbooks.md': { title: 'Playbooks', description: 'Role-based playbooks for BA, Tester, Developer, and Scrum Master' },
  '11-scale-rollout.md': { title: 'Scale & Rollout', description: 'ART-wide expansion from pilot to all 12 teams' },
  '12-tools-platform.md': { title: 'Tools Platform', description: 'tools.ussp.co user guide, dashboard configuration, and tooltips' },
  '13-deployment.md': { title: 'Deployment Guide', description: 'How to set up the framework for a new engagement' },
  'appendix-a-kpi-catalog.md': { title: 'KPI Catalog', description: 'Full 22-KPI reference with formulas and selection guidance' },
  'appendix-b-doit-policy-map.md': { title: 'DoIT Policy Map', description: 'Section-by-section compliance checklist' },
  'appendix-c-research-citations.md': { title: 'Research Citations', description: 'DORA, SPACE, QUS, ISO, Six Sigma methodology references' },
  'appendix-d-templates.md': { title: 'Templates', description: 'Survey templates, report templates, and cheat sheets' },
};

const dir = __dirname;

Object.entries(frontmatter).forEach(([file, meta]) => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`SKIP: ${file} not found`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  // Skip if frontmatter already exists
  if (content.startsWith('---')) {
    console.log(`SKIP: ${file} already has frontmatter`);
    return;
  }
  const fm = `---\ntitle: "${meta.title}"\ndescription: "${meta.description}"\n---\n\n`;
  fs.writeFileSync(filePath, fm + content, 'utf8');
  console.log(`DONE: ${file}`);
});

console.log('Frontmatter added.');
