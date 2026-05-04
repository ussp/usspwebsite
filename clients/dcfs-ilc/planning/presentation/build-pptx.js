#!/usr/bin/env node
/**
 * Generate PPTX from slide content — runs in Node.js, no browser needed.
 * Usage: node build-pptx.js
 *
 * Matches the framework-presentation-main.html deck (12 slides).
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'CUSTOM', width: 13.33, height: 7.5 });
pptx.layout = 'CUSTOM';
pptx.author = 'Krasan Consulting Services';
pptx.company = 'Krasan Consulting Services';
pptx.title = 'AI-Augmented Agile Delivery — Framework for DCFS Illinois Connect';

// Colors
const DARK_BG = '1a1a2e';
const NAVY = '16213e';
const ACCENT = '0f3460';
const HIGHLIGHT = 'e94560';
const GREEN = '27ae60';
const AMBER = 'f39c12';
const BLUE = '2980b9';
const PURPLE = '8e44ad';
const GRAY = '95a5a6';
const WHITE = 'FFFFFF';
const LIGHT_GRAY = 'E8EAEC';
const TEXT_DARK = '222222';

// Logo
const logoPath = path.join(__dirname, '..', '..', 'assets', 'krasan-logo.png');
const hasLogo = fs.existsSync(logoPath);

function addLogo(slide, opts = {}) {
  if (!hasLogo) return;
  const defaults = { x: 0.4, y: 0.3, h: 0.4, w: 1.6 };
  slide.addImage({ path: logoPath, ...defaults, ...opts });
}

function addSlideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 12.2, y: 7.0, w: 1, h: 0.3,
    fontSize: 12, color: '999999', align: 'right', fontFace: 'Arial'
  });
}

function addTitleBar(slide, title) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0.9, w: 13.33, h: 0.04, fill: { color: HIGHLIGHT } });
  slide.addText(title, { x: 0.5, y: 0.2, w: 12, h: 0.7, fontSize: 26, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
}

const TOTAL = 12;
let slideNum = 0;

// ═══════════════════════════════════════════
// SLIDE 1: Title
// ═══════════════════════════════════════════
slideNum++;
const s1 = pptx.addSlide();
s1.background = { fill: WHITE };
s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: HIGHLIGHT } });
addLogo(s1, { x: 5.5, y: 1.0, w: 2.4, h: 0.6 });

s1.addText('AI-Augmented Agile Delivery', {
  x: 1, y: 2.2, w: 11.33, h: 1,
  fontSize: 36, bold: true, color: ACCENT, align: 'center', fontFace: 'Arial'
});
s1.addText('Framework for DCFS Illinois Connect', {
  x: 1, y: 3.2, w: 11.33, h: 0.6,
  fontSize: 20, color: '666666', align: 'center', fontFace: 'Arial'
});
s1.addText([
  { text: 'Prepared for: DCFS Illinois Connect Leadership\n', options: { fontSize: 14, color: '555555' } },
  { text: 'Presented by: Vinay Lagisetty & Emil "Romi" Kovacs\n', options: { fontSize: 14, color: '555555' } },
  { text: 'Krasan Consulting Services\n', options: { fontSize: 14, color: '555555' } },
  { text: 'Version: V04222026', options: { fontSize: 14, color: '555555', bold: true } },
], { x: 3, y: 4.2, w: 7.33, h: 1.5, align: 'center', fontFace: 'Arial' });
s1.addText('CONFIDENTIAL — KRASAN INTERNAL + DCFS LEADERSHIP', {
  x: 0, y: 6.9, w: 13.33, h: 0.4,
  fontSize: 13, color: '999999', align: 'center', fontFace: 'Arial'
});

// ═══════════════════════════════════════════
// SLIDE 2: Opportunity
// ═══════════════════════════════════════════
slideNum++;
const s2 = pptx.addSlide();
addTitleBar(s2, 'Illinois Connect — The Opportunity');

s2.addText('The Program', { x: 0.5, y: 1.1, w: 12, h: 0.4, fontSize: 14, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
s2.addText('Illinois Connect is migrating three legacy systems — SACWIS, CYCIS, and MARS — to a unified CCWIS platform on Microsoft Dynamics 365. Across 12 SAFe product teams and 160+ Krasan consultants, this ART is delivering critical capabilities for DCFS.', {
  x: 0.5, y: 1.5, w: 12.33, h: 0.7, fontSize: 13, color: TEXT_DARK, fontFace: 'Arial'
});

s2.addText('Why AI, Why Now', { x: 0.5, y: 2.3, w: 12, h: 0.4, fontSize: 14, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
const whyItems = [
  'AI is becoming standard for high-performing delivery teams',
  'The State has already invested in GitHub Copilot and Atlassian Rovo',
  'Teams are delivering well — AI builds on a strong foundation',
  'Krasan is developing a structured AI transformation framework — designed for engagements like ILC',
];
whyItems.forEach((item, i) => {
  s2.addText(`•  ${item}`, { x: 0.7, y: 2.7 + i * 0.3, w: 11.8, h: 0.3, fontSize: 13, color: TEXT_DARK, fontFace: 'Arial' });
});

s2.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.1, w: 12.33, h: 0.55, fill: { color: 'FEF0F3' }, rectRadius: 0.05 });
s2.addText('Target: 10-15% productivity improvement — measured by tangible outputs, not story points. Pilot establishes the trajectory; schedule under finalization.', {
  x: 0.7, y: 4.1, w: 12, h: 0.55, fontSize: 13, bold: true, color: TEXT_DARK, fontFace: 'Arial', valign: 'middle'
});

const cards = [
  { title: "Amplify, Don't Replace", items: ['Same people, better tools', 'No workforce reduction', 'AI assists, human decides'] },
  { title: "Measure, Don't Guess", items: ['Baseline first, then compare', 'Tangible outputs: LOC, docs, config', 'Before/after with control group'] },
  { title: 'Pilot, Then Scale', items: ['Start with 1 team (Intact), 5 roles', 'AI adoption from day 1 under HITL', 'Scale what works'] },
];
cards.forEach((card, i) => {
  const cx = 0.5 + i * 4.2;
  s2.addShape(pptx.ShapeType.rect, { x: cx, y: 4.9, w: 3.9, h: 2.0, fill: { color: 'F5F5F5' }, rectRadius: 0.05, line: { color: 'DDDDDD', width: 0.5 } });
  s2.addText(card.title, { x: cx + 0.2, y: 5.0, w: 3.5, h: 0.4, fontSize: 15, bold: true, color: ACCENT, fontFace: 'Arial' });
  card.items.forEach((item, j) => {
    s2.addText(`•  ${item}`, { x: cx + 0.3, y: 5.4 + j * 0.3, w: 3.4, h: 0.3, fontSize: 14, color: TEXT_DARK, fontFace: 'Arial' });
  });
});
addSlideNumber(s2, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 3: Framework — Krasan's Approach
// ═══════════════════════════════════════════
slideNum++;
const s3 = pptx.addSlide();
addTitleBar(s3, "The Framework — Krasan's Approach");
s3.addText('Structured to work within government guardrails while delivering measurable results.', {
  x: 0.5, y: 1.0, w: 12.33, h: 0.4, fontSize: 13, color: '666666', fontFace: 'Arial'
});

const phases = ['Govern', 'Baseline', 'Design', 'Train', 'Pilot', 'Measure', 'Playbook', 'Scale'];
phases.forEach((phase, i) => {
  const px = 0.5 + i * 1.55;
  s3.addShape(pptx.ShapeType.roundRect, { x: px, y: 1.5, w: 1.3, h: 0.5, fill: { color: ACCENT }, rectRadius: 0.05 });
  s3.addText(phase, { x: px, y: 1.5, w: 1.3, h: 0.5, fontSize: 14, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
  if (i < phases.length - 1) s3.addText('→', { x: px + 1.3, y: 1.5, w: 0.25, h: 0.5, fontSize: 14, color: '999999', align: 'center' });
});

const fwRows = [
  [{ text: 'PHASE', options: { bold: true, color: WHITE, fill: { color: ACCENT } } }, { text: 'WHAT HAPPENS', options: { bold: true, color: WHITE, fill: { color: ACCENT } } }, { text: 'DELIVERABLE', options: { bold: true, color: WHITE, fill: { color: ACCENT } } }],
  ['Govern', 'Align with DoIT AI Policy, define guardrails, confirm tool access', 'Governance Proposal, Compliance Map'],
  ['Baseline', 'Capture current metrics from JIRA (last 3 sprints)', 'Baseline Metrics Report'],
  ['Design', 'Map current → AI-augmented state per role; tools and methods', 'Process Design Docs, Playbooks, Training Plan'],
  ['Train', 'Role-specific training: responsible AI use, prompts, guardrails', 'Training Completion Report'],
  ['Pilot', '1 team (Intact), 5 roles for Sprints PI 6.2.1 & PI 6.2.2', 'Weekly Check-in Reports'],
  ['Measure', 'Continuous metrics; pilot vs baseline vs control', 'Pilot Results Report'],
  ['Playbook', 'Codify what worked — living docs, updated continuously', 'Ongoing'],
  ['Scale', 'Roll out to remaining teams based on proven results', 'ART-Wide Rollout Plan'],
];
s3.addTable(fwRows.map((row, ri) => row.map((cell, ci) => {
  if (ri === 0) return cell;
  return { text: cell, options: { fontSize: 14, color: TEXT_DARK, bold: ci === 0 } };
})), {
  x: 0.5, y: 2.3, w: 12.33, fontSize: 14, fontFace: 'Arial',
  border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
  colW: [1.2, 7.5, 3.63],
});
addSlideNumber(s3, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 4: Govern / Baseline / Design
// ═══════════════════════════════════════════
slideNum++;
const s4 = pptx.addSlide();
addTitleBar(s4, 'Where We Are — Govern, Baseline & Design');
phases.forEach((phase, i) => {
  const px = 0.5 + i * 1.55;
  const isActive = i <= 2;
  s4.addShape(pptx.ShapeType.roundRect, { x: px, y: 1.1, w: 1.3, h: 0.45, fill: { color: isActive ? HIGHLIGHT : ACCENT }, rectRadius: 0.05 });
  s4.addText(phase, { x: px, y: 1.1, w: 1.3, h: 0.45, fontSize: 13, bold: true, color: WHITE, align: 'center' });
  if (i < phases.length - 1) s4.addText('→', { x: px + 1.3, y: 1.1, w: 0.25, h: 0.45, fontSize: 13, color: '999999', align: 'center' });
});

const cols4 = [
  { title: 'Govern', items: ['DoIT AI Policy — all 12 sections mapped', 'NIST AI RMF governance framework', 'Establish governance team (DCFS-led)', 'Code generation policy — HITL compliant'], deliverable: 'Governance Proposal & Compliance Map' },
  { title: 'Baseline', items: ['Capture current metrics from JIRA (last 3 sprints)', 'Readiness assessment — all 12 teams', 'Pilot team selected: Intact — 5 roles', 'Team health survey (SPACE/DevEx)'], deliverable: 'Baseline Metrics Report' },
  { title: 'Design / Develop', items: ['Map current → AI-augmented state per role', 'AI-assisted code generation under HITL', 'Dynamics configuration exploration', 'Build training materials from process designs'], deliverable: 'Process Design Docs, Playbooks & Training Plan' },
];
cols4.forEach((col, i) => {
  const cx = 0.5 + i * 4.2;
  s4.addText(col.title, { x: cx, y: 1.8, w: 3.9, h: 0.4, fontSize: 14, bold: true, color: TEXT_DARK });
  col.items.forEach((item, j) => {
    s4.addText(`•  ${item}`, { x: cx + 0.1, y: 2.2 + j * 0.4, w: 3.8, h: 0.4, fontSize: 14, color: TEXT_DARK, valign: 'top' });
  });
  s4.addShape(pptx.ShapeType.rect, { x: cx, y: 4.0, w: 3.9, h: 0.5, fill: { color: 'E8F5E9' }, rectRadius: 0.03 });
  s4.addText(`Deliverable: ${col.deliverable}`, { x: cx + 0.1, y: 4.0, w: 3.7, h: 0.5, fontSize: 13, bold: true, color: TEXT_DARK, valign: 'middle' });
});
addSlideNumber(s4, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 5: Train / Pilot / Measure
// ═══════════════════════════════════════════
slideNum++;
const s5 = pptx.addSlide();
addTitleBar(s5, 'Train, Pilot & Measure');
phases.forEach((phase, i) => {
  const px = 0.5 + i * 1.55;
  const isActive = i >= 3 && i <= 5;
  s5.addShape(pptx.ShapeType.roundRect, { x: px, y: 1.1, w: 1.3, h: 0.45, fill: { color: isActive ? HIGHLIGHT : ACCENT }, rectRadius: 0.05 });
  s5.addText(phase, { x: px, y: 1.1, w: 1.3, h: 0.45, fontSize: 13, bold: true, color: WHITE, align: 'center' });
  if (i < phases.length - 1) s5.addText('→', { x: px + 1.3, y: 1.1, w: 0.25, h: 0.45, fontSize: 13, color: '999999', align: 'center' });
});

const cols5 = [
  { title: 'Train', items: ['Foundation (all): DoIT compliance, guardrails', 'BA — story quality, AC generation', 'Tester — test generation from AC', 'Developer — code explanation, docs, refactoring', 'SA — SDD, architecture, pre-ARB', 'Testing Services Lead — testing strategy, cross-team'], deliverable: 'Training Completion Report' },
  { title: 'Pilot', items: ['1 team (Intact) — 5 roles', 'Remaining teams as control group', 'Sprints PI 6.2.1 & PI 6.2.2', 'Pair programmers (1 per role) for ~2 sprints', 'AI-assisted from day 1 under HITL'], deliverable: 'Weekly Check-in Reports' },
  { title: 'Measure', items: ['Pre/post comparison vs baseline', 'Pilot vs control teams', '8-12 metrics across 4 families', 'SPACE team health survey', 'Weekly bias / quality spot checks'], deliverable: 'Pilot Results Report, Lessons Learned' },
];
cols5.forEach((col, i) => {
  const cx = 0.5 + i * 4.2;
  s5.addText(col.title, { x: cx, y: 1.8, w: 3.9, h: 0.4, fontSize: 14, bold: true, color: TEXT_DARK });
  col.items.forEach((item, j) => {
    s5.addText(`•  ${item}`, { x: cx + 0.1, y: 2.2 + j * 0.3, w: 3.8, h: 0.3, fontSize: 13, color: TEXT_DARK, valign: 'top' });
  });
  s5.addShape(pptx.ShapeType.rect, { x: cx, y: 5.3, w: 3.9, h: 0.5, fill: { color: 'E8F5E9' }, rectRadius: 0.03 });
  s5.addText(`Deliverable: ${col.deliverable}`, { x: cx + 0.1, y: 5.3, w: 3.7, h: 0.5, fontSize: 13, bold: true, color: TEXT_DARK, valign: 'middle' });
});
addSlideNumber(s5, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 6: Playbook & Scale
// ═══════════════════════════════════════════
slideNum++;
const s6 = pptx.addSlide();
addTitleBar(s6, 'Playbook & Scale');
phases.forEach((phase, i) => {
  const px = 0.5 + i * 1.55;
  const isActive = i >= 6;
  s6.addShape(pptx.ShapeType.roundRect, { x: px, y: 1.1, w: 1.3, h: 0.45, fill: { color: isActive ? HIGHLIGHT : ACCENT }, rectRadius: 0.05 });
  s6.addText(phase, { x: px, y: 1.1, w: 1.3, h: 0.45, fontSize: 13, bold: true, color: WHITE, align: 'center' });
  if (i < phases.length - 1) s6.addText('→', { x: px + 1.3, y: 1.1, w: 0.25, h: 0.45, fontSize: 13, color: '999999', align: 'center' });
});

s6.addText('Playbook', { x: 0.5, y: 1.8, w: 6, h: 0.4, fontSize: 14, bold: true, color: TEXT_DARK });
s6.addText('Living documents — drafted in Design, refined through Pilot, v1.0 at end of pilot:', { x: 0.5, y: 2.2, w: 6, h: 0.35, fontSize: 14, color: '666666' });
['BA Playbook — story writing, AC generation', 'Tester Playbook — test generation, edge cases', 'Developer Playbook — code, docs, refactoring', 'SA Playbook — SDD, architecture, pre-ARB', 'Testing Services Playbook — testing strategy'].forEach((item, i) => {
  s6.addText(`•  ${item}`, { x: 0.7, y: 2.6 + i * 0.3, w: 5.8, h: 0.3, fontSize: 14, color: TEXT_DARK });
});
s6.addShape(pptx.ShapeType.rect, { x: 0.5, y: 5.5, w: 6, h: 0.4, fill: { color: 'E8F5E9' }, rectRadius: 0.03 });
s6.addText('Deliverable: Finalized Playbooks (updated with pilot lessons)', { x: 0.6, y: 5.5, w: 5.8, h: 0.4, fontSize: 13, bold: true, color: TEXT_DARK });

s6.addText('Scale', { x: 7, y: 1.8, w: 6, h: 0.4, fontSize: 14, bold: true, color: TEXT_DARK });
s6.addText('Expand based on proven results, not assumptions.', { x: 7, y: 2.2, w: 6, h: 0.35, fontSize: 14, color: '666666' });
['Go/no-go decision based on pilot data', 'Pair programmers redeploy to 5 other teams (Wave 1)', 'Phased rollout — not all teams at once', 'DCFS AI champions embedded per role per team', 'Continuous measurement at ART level'].forEach((item, i) => {
  s6.addText(`•  ${item}`, { x: 7.2, y: 2.6 + i * 0.35, w: 5.8, h: 0.35, fontSize: 14, color: TEXT_DARK });
});
s6.addShape(pptx.ShapeType.rect, { x: 7, y: 5.5, w: 6, h: 0.4, fill: { color: 'E8F5E9' }, rectRadius: 0.03 });
s6.addText('Deliverable: ART-Wide Rollout Plan', { x: 7.1, y: 5.5, w: 5.8, h: 0.4, fontSize: 13, bold: true, color: TEXT_DARK });
addSlideNumber(s6, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 7: Governance — Two-Phase Structure
// ═══════════════════════════════════════════
slideNum++;
const s7 = pptx.addSlide();
addTitleBar(s7, 'Governance — Two-Phase Structure');
s7.addText('Lightweight during pilot. DCFS AI Governance Team stood up DURING the pilot so they can approve results before scale.', {
  x: 0.5, y: 1.0, w: 12.33, h: 0.4, fontSize: 13, color: '666666'
});

// Phase A
s7.addText('Phase A — Pilot Governance Team', { x: 0.5, y: 1.5, w: 6.2, h: 0.4, fontSize: 14, bold: true, color: ACCENT });
s7.addText('Runs the pilot · weekly 45 min · documentation over formal approval', { x: 0.5, y: 1.85, w: 6.2, h: 0.3, fontSize: 14, italic: true, color: '666666' });
const phaseARows = [
  [{ text: 'Role', options: { bold: true, fill: { color: LIGHT_GRAY } } }, { text: 'Filled by', options: { bold: true, fill: { color: LIGHT_GRAY } } }],
  ['Pilot Governance Lead', 'DCFS designee'],
  ['Executive Sponsor', 'Agency CIO'],
  ['Security & Privacy observer', 'DCFS designee (optional)'],
];
s7.addTable(phaseARows.map((row, ri) => row.map((cell, ci) => {
  if (ri === 0) return cell;
  return { text: cell, options: { fontSize: 14, bold: ci === 0 } };
})), { x: 0.5, y: 2.2, w: 6.2, fontSize: 14, border: { type: 'solid', pt: 0.5, color: 'CCCCCC' }, colW: [2.8, 3.4] });

s7.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.9, w: 6.2, h: 0.9, fill: { color: 'E3F2FD' }, rectRadius: 0.03 });
s7.addText('Authority: approve pilot scope, tools, guardrails. Can halt pilot on safety concern. NOT in scope: ART-wide scale decisions.', {
  x: 0.6, y: 3.95, w: 6.0, h: 0.8, fontSize: 14, color: TEXT_DARK, valign: 'middle'
});
s7.addText('Krasan AI Transformation Lead + Engagement Director present to team; not members.', { x: 0.5, y: 4.9, w: 6.2, h: 0.3, fontSize: 13, italic: true, color: '888888' });

// Phase B
s7.addText('Phase B — DCFS AI Governance Team', { x: 6.9, y: 1.5, w: 6.2, h: 0.4, fontSize: 14, bold: true, color: HIGHLIGHT });
s7.addText('Stood up DURING pilot · monthly 60 min · approves scale', { x: 6.9, y: 1.85, w: 6.2, h: 0.3, fontSize: 14, italic: true, color: '666666' });
s7.addText('Minimum Viable (3 seats) — start immediately', { x: 6.9, y: 2.2, w: 6.2, h: 0.3, fontSize: 14, bold: true, color: TEXT_DARK });
const mvgRows = [
  ['Executive Sponsor (CIO)', 'DCFS'],
  ['AI Governance Chair (+ Program)', 'DCFS'],
  ['Security & Privacy Lead', 'DCFS'],
];
s7.addTable(mvgRows.map(row => row.map((cell, ci) => ({ text: cell, options: { fontSize: 14, bold: ci === 0 } }))), { x: 6.9, y: 2.5, w: 6.2, border: { type: 'solid', pt: 0.5, color: 'DDDDDD' }, colW: [4.0, 2.2] });

s7.addText('Expanded (adds 3 seats) — as pilot matures', { x: 6.9, y: 3.9, w: 6.2, h: 0.3, fontSize: 14, bold: true, color: '888888' });
const expRows = [
  ['Program Director (split from Chair)', 'DCFS'],
  ['Data Privacy Officer (split from Security)', 'DCFS'],
  ['Business Representative', 'DCFS'],
];
s7.addTable(expRows.map(row => row.map((cell, ci) => ({ text: cell, options: { fontSize: 14, color: '777777' } }))), { x: 6.9, y: 4.2, w: 6.2, border: { type: 'solid', pt: 0.5, color: 'DDDDDD' }, colW: [4.0, 2.2] });

// Bottom callout
s7.addShape(pptx.ShapeType.rect, { x: 0.5, y: 5.6, w: 12.33, h: 0.7, fill: { color: 'FFF3CD' }, rectRadius: 0.03 });
s7.addText('⚠ Key dependency: Phase B team should be seated by July so they can review pilot results + approve playbooks at end of pilot. If not seated in time, scale decisions slip.', {
  x: 0.7, y: 5.65, w: 12, h: 0.6, fontSize: 13, bold: true, color: TEXT_DARK, valign: 'middle'
});
s7.addText('Aligned with NIST AI RMF GOVERN 2 + DoIT AI Policy §4', { x: 0.5, y: 6.35, w: 12.33, h: 0.3, fontSize: 13, italic: true, color: '888888', align: 'right' });
addSlideNumber(s7, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 8: Tools — Existing Investment + Pending
// ═══════════════════════════════════════════
slideNum++;
const s8 = pptx.addSlide();
addTitleBar(s8, 'Tools — Existing Investment + Pending Confirmations');

// Already invested
s8.addText('✅ Already invested by the State', { x: 0.5, y: 1.1, w: 6.2, h: 0.4, fontSize: 15, bold: true, color: GREEN });
const invRows = [
  [{ text: 'Tool', options: { bold: true, fill: { color: LIGHT_GRAY } } }, { text: 'Primary roles', options: { bold: true, fill: { color: LIGHT_GRAY } } }],
  ['GitHub Copilot', 'Developer (plugins, APIs, logic apps)'],
  ['Atlassian Rovo', 'BA, Tester — story/test drafts'],
];
s8.addTable(invRows.map((row, ri) => row.map(cell => {
  if (ri === 0) return cell;
  return typeof cell === 'string' ? { text: cell, options: { fontSize: 14 } } : cell;
})), { x: 0.5, y: 1.5, w: 6.2, border: { type: 'solid', pt: 0.5, color: 'CCCCCC' }, colW: [2.5, 3.7] });
s8.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.7, w: 6.2, h: 0.5, fill: { color: 'E3F2FD' }, rectRadius: 0.03 });
s8.addText('Copilot supports multiple models (OpenAI, Google, Anthropic) — approval status needs validation with DCFS / DoIT.', {
  x: 0.6, y: 2.7, w: 6.0, h: 0.5, fontSize: 13, color: TEXT_DARK, valign: 'middle'
});

// Pending
s8.addText('⏳ Pending confirmation', { x: 6.9, y: 1.1, w: 6.2, h: 0.4, fontSize: 15, bold: true, color: AMBER });
const penRows = [
  [{ text: 'Tool', options: { bold: true, fill: { color: LIGHT_GRAY } } }, { text: 'Why we need it', options: { bold: true, fill: { color: LIGHT_GRAY } } }],
  ['Microsoft 365 Copilot', 'SA — SDD, Word, Visio, SharePoint'],
  ['Dynamics 365 Copilot', 'Platform Dev — config-first workflow'],
];
s8.addTable(penRows.map((row, ri) => row.map(cell => {
  if (ri === 0) return cell;
  return typeof cell === 'string' ? { text: cell, options: { fontSize: 14 } } : cell;
})), { x: 6.9, y: 1.5, w: 6.2, border: { type: 'solid', pt: 0.5, color: 'CCCCCC' }, colW: [2.5, 3.7] });
s8.addShape(pptx.ShapeType.rect, { x: 6.9, y: 2.7, w: 6.2, h: 0.5, fill: { color: 'FEF0F3' }, rectRadius: 0.03 });
s8.addText('Needed before pilot start to enable SA + Platform Dev tracks', { x: 7.0, y: 2.7, w: 6.0, h: 0.5, fontSize: 13, color: TEXT_DARK, valign: 'middle' });

// Open questions
s8.addText('Open questions we need answered', { x: 0.5, y: 3.4, w: 12.33, h: 0.3, fontSize: 14, bold: true, color: TEXT_DARK });
const oqRows = [
  [{ text: 'Question', options: { bold: true, fill: { color: LIGHT_GRAY } } }, { text: 'Why it matters', options: { bold: true, fill: { color: LIGHT_GRAY } } }],
  ['GitHub Copilot tier (Business / Enterprise)?', 'Only Business/Enterprise keeps code out of training'],
  ['Atlassian Rovo tier?', 'Lower tiers are orchestration-only; BA/Tester tracks need generative'],
  ['Microsoft 365 Copilot licensed + available to pilot?', 'Need DCFS licensing + budget confirmation'],
  ['Dynamics 365 Copilot enabled in Dynamics GCC?', 'Platform Dev track depends on this'],
  ['§5e: Copilot on ILC source = "State data for AI"?', 'Determines if Agency Head written consent required'],
  ['Which AI models (OpenAI, Google, Anthropic) State-approved?', 'Enterprise admin sets model policy'],
];
s8.addTable(oqRows.map((row, ri) => row.map(cell => {
  if (ri === 0) return cell;
  return typeof cell === 'string' ? { text: cell, options: { fontSize: 13 } } : cell;
})), { x: 0.5, y: 3.7, w: 12.33, border: { type: 'solid', pt: 0.5, color: 'CCCCCC' }, colW: [5.5, 6.83] });

// Risk callout
s8.addShape(pptx.ShapeType.rect, { x: 0.5, y: 6.3, w: 12.33, h: 0.5, fill: { color: 'FEF0F3' }, rectRadius: 0.03 });
s8.addText('⚠ Risk / dependency: Tool access must be confirmed and provisioned before Design & Develop can start. Any delay cascades into training and pilot start.', {
  x: 0.7, y: 6.3, w: 12, h: 0.5, fontSize: 14, bold: true, color: TEXT_DARK, valign: 'middle'
});
addSlideNumber(s8, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 9: Timeline
// ═══════════════════════════════════════════
slideNum++;
const s9 = pptx.addSlide();
addTitleBar(s9, 'Timeline — PI 6 Pilot Plan');
s9.addText('Anchored to PI 6 Planning on May 5. Govern & Design phases run in parallel before PI starts.', {
  x: 0.5, y: 1.0, w: 12.33, h: 0.4, fontSize: 14, color: '666666'
});

// Build Gantt as a table (11 cols + phase label)
const dates = ['Apr 14', 'Apr 28', 'May 12', 'May 26', 'Jun 9', 'Jun 23', 'Jul 7', 'Jul 21', 'Aug 4', 'Aug 18', 'Sep 1'];
const ganttHeader = [{ text: 'Phase', options: { bold: true, color: WHITE, fill: { color: ACCENT } } }, ...dates.map(d => ({ text: d, options: { bold: true, fontSize: 12, color: TEXT_DARK, fill: { color: LIGHT_GRAY }, align: 'center' } }))];

// Build rows with colored cells per phase
function makeRow(label, spans) {
  // spans = array of 11, each entry is either null (empty) or { color, text }
  const row = [{ text: label, options: { bold: true, fontSize: 13, fill: { color: 'F8F8F8' } } }];
  spans.forEach(s => {
    if (!s) { row.push({ text: '', options: { fill: { color: 'FFFFFF' } } }); }
    else row.push({ text: s.text || '', options: { fontSize: 11, color: WHITE, bold: true, fill: { color: s.color }, align: 'center' } });
  });
  return row;
}

// PI Cadence row
const cadence = [
  { color: 'F9F9F9', text: '' }, // Apr 14 - Pre-PI
  { color: 'FFF3CD', text: 'PI Plan' }, // Apr 28
  { color: 'E8F5E9', text: '6.2.1' }, { color: 'E8F5E9', text: '6.2.2' }, { color: 'E8F5E9', text: '6.2.3' }, { color: 'E8F5E9', text: '6.2.4' }, { color: 'E8F5E9', text: '6.2.5' },
  { color: 'F9F9F9', text: 'Post-pilot' }, { color: 'F9F9F9', text: '' }, { color: 'F9F9F9', text: '' }, { color: 'F9F9F9', text: '' },
];
const cadenceRow = [{ text: 'PI Cadence', options: { bold: true, fontSize: 13, fill: { color: 'F8F8F8' } } }];
cadence.forEach(c => cadenceRow.push({ text: c.text, options: { fontSize: 11, bold: true, fill: { color: c.color }, align: 'center' } }));

// Phase rows
const govRow = makeRow('Govern', [{ color: ACCENT, text: 'DoIT policy, tool access' }, { color: ACCENT }, null, null, null, null, null, null, null, null, null]);
const basRow = makeRow('Baseline', [{ color: BLUE, text: 'JIRA metrics, survey' }, { color: BLUE }, null, null, null, null, null, null, null, null, null]);
const desRow = makeRow('Design', [null, { color: PURPLE, text: 'Process mapping, playbook drafts' }, { color: PURPLE }, null, null, null, null, null, null, null, null]);
const trnRow = makeRow('Train', [null, null, { color: AMBER, text: '5 role tracks' }, { color: AMBER }, null, null, null, null, null, null, null]);
const pltRow = makeRow('Pilot', [null, null, null, { color: GREEN, text: 'Intact — Sprint PI 6.2.1 → PI 6.2.5' }, { color: GREEN }, { color: GREEN }, { color: GREEN }, null, null, null, null]);
const msrRow = makeRow('Measure', [null, null, null, { color: HIGHLIGHT, text: 'Continuous metrics + before/after' }, { color: HIGHLIGHT }, { color: HIGHLIGHT }, { color: HIGHLIGHT }, { color: HIGHLIGHT }, { color: HIGHLIGHT }, null, null]);
const pbkRow = makeRow('Playbook', [null, { color: '16A085', text: 'Drafted → refined → v1.0 in Aug' }, { color: '16A085' }, { color: '16A085' }, { color: '16A085' }, { color: '16A085' }, { color: '16A085' }, { color: '16A085' }, { color: '16A085' }, null, null]);
const sclRow = makeRow('Scale', [null, null, null, null, null, null, null, null, null, { color: GRAY, text: 'Scale decision' }, { color: GRAY }]);

s9.addTable([ganttHeader, cadenceRow, govRow, basRow, desRow, trnRow, pltRow, msrRow, pbkRow, sclRow], {
  x: 0.5, y: 1.5, w: 12.33, fontSize: 12, fontFace: 'Arial',
  border: { type: 'solid', pt: 0.5, color: 'DDDDDD' },
  colW: [1.2, 1.013, 1.013, 1.013, 1.013, 1.013, 1.013, 1.013, 1.013, 1.013, 1.013, 1.013],
  rowH: [0.3, 0.3, 0.35, 0.35, 0.35, 0.35, 0.4, 0.35, 0.35, 0.35],
});

// Legend
s9.addText('Pilot scope (draft): Intact team, 5 roles. Team composition will be finalized after the baselining phase.', {
  x: 0.5, y: 6.0, w: 12.33, h: 0.4, fontSize: 14, italic: true, color: '666666'
});
addSlideNumber(s9, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 10: Pair-Programmer Strategy
// ═══════════════════════════════════════════
slideNum++;
const s10 = pptx.addSlide();
addTitleBar(s10, 'Pair-Programmer Strategy — For Discussion');
s10.addText('5 AI-experienced specialists (one per pilot role) accelerate the pilot — then redeploy as embedded AI specialists into 5 other teams to enable scale. Same hiring investment, used twice. Proposed model — open for DCFS feedback.', {
  x: 0.5, y: 1.0, w: 12.33, h: 0.6, fontSize: 14, color: TEXT_DARK
});

// Phase 1 — left panel
s10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.7, w: 6.2, h: 3.6, fill: { color: 'FFFFFF' }, line: { color: GREEN, width: 2 }, rectRadius: 0.05 });
s10.addText('Phase 1 — Pilot (May → Jul)', { x: 0.7, y: 1.8, w: 5.9, h: 0.35, fontSize: 15, bold: true, color: GREEN });
s10.addText('5 specialists × 1 Intact pilot team', { x: 0.7, y: 2.15, w: 5.9, h: 0.25, fontSize: 14, italic: true, color: '666666' });
const p1Rows = [
  [{ text: 'Role', options: { bold: true, fill: { color: LIGHT_GRAY } } }, { text: 'Pair programmer', options: { bold: true, fill: { color: LIGHT_GRAY } } }],
  ['Tester', 'AI-experienced Tester'],
  ['Solution Architect', 'AI-experienced SA'],
  ['Business Analyst', 'AI-experienced BA'],
  ['Developer', 'AI-experienced Dev'],
  ['Testing Services Lead', 'AI-experienced testing lead'],
];
s10.addTable(p1Rows.map((row, ri) => row.map(cell => {
  if (ri === 0) return cell;
  return typeof cell === 'string' ? { text: cell, options: { fontSize: 13 } } : cell;
})), { x: 0.7, y: 2.45, w: 5.9, border: { type: 'solid', pt: 0.5, color: 'DDDDDD' }, colW: [2.2, 3.7] });
s10.addText('Sprints PI 6.2.1–6.2.2 (co-pilot): Work side-by-side. Sprints PI 6.2.3–6.2.5 (coach): DCFS member owns work, specialist advises.', {
  x: 0.7, y: 4.65, w: 5.9, h: 0.6, fontSize: 13, color: '444444'
});

// Phase 2 — right panel
s10.addShape(pptx.ShapeType.rect, { x: 6.9, y: 1.7, w: 6.2, h: 3.6, fill: { color: 'FFFFFF' }, line: { color: HIGHLIGHT, width: 2 }, rectRadius: 0.05 });
s10.addText('Phase 2 — Scale Wave 1 (Aug onward)', { x: 7.1, y: 1.8, w: 5.9, h: 0.35, fontSize: 15, bold: true, color: HIGHLIGHT });
s10.addText('Same 5 specialists × 5 other ILC teams = scale mechanism', { x: 7.1, y: 2.15, w: 5.9, h: 0.25, fontSize: 14, italic: true, color: '666666' });
const p2Rows = [
  [{ text: 'Team', options: { bold: true, fill: { color: LIGHT_GRAY } } }, { text: 'Embedded AI specialist', options: { bold: true, fill: { color: LIGHT_GRAY } } }],
  ['Team 2', '1 specialist (rotates through role)'],
  ['Team 3', '1 specialist'],
  ['Team 4', '1 specialist'],
  ['Team 5', '1 specialist'],
  ['Team 6', '1 specialist'],
];
s10.addTable(p2Rows.map((row, ri) => row.map(cell => {
  if (ri === 0) return cell;
  return typeof cell === 'string' ? { text: cell, options: { fontSize: 13 } } : cell;
})), { x: 7.1, y: 2.45, w: 5.9, border: { type: 'solid', pt: 0.5, color: 'DDDDDD' }, colW: [1.8, 4.1] });
s10.addText('~2 sprints per team, then rotate. Output: each team finishes with named internal DCFS AI champion per role.', {
  x: 7.1, y: 4.65, w: 5.9, h: 0.6, fontSize: 13, color: '444444'
});

// Bottom callouts
s10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 5.5, w: 6.2, h: 0.6, fill: { color: 'E3F2FD' }, rectRadius: 0.03 });
s10.addText('Exit strategy: Specialists rotate out team by team. 30+ DCFS internal AI champions by end of Wave 1; consultants phased out.', {
  x: 0.7, y: 5.5, w: 6.0, h: 0.6, fontSize: 13, color: TEXT_DARK, valign: 'middle'
});
s10.addShape(pptx.ShapeType.rect, { x: 6.9, y: 5.5, w: 6.2, h: 0.6, fill: { color: 'FFF3E0' }, rectRadius: 0.03 });
s10.addText('Why this matters: Same pilot hiring investment becomes the scale mechanism. Playbooks battle-tested across 6 teams, not just 1.', {
  x: 7.1, y: 5.5, w: 6.0, h: 0.6, fontSize: 13, color: TEXT_DARK, valign: 'middle'
});

s10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 6.2, w: 12.6, h: 0.5, fill: { color: 'FEF0F3' }, rectRadius: 0.03 });
s10.addText('⚠ Key constraint: Finding the right AI-experienced specialists is difficult. Hiring velocity is a real risk — stair-step onboarding is the mitigation.', {
  x: 0.7, y: 6.2, w: 12.4, h: 0.5, fontSize: 14, bold: true, color: TEXT_DARK, valign: 'middle'
});
addSlideNumber(s10, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 11: Risks
// ═══════════════════════════════════════════
slideNum++;
const s11 = pptx.addSlide();
addTitleBar(s11, 'Risks — What Could Derail Us');
s11.addText('Top risks actively managing. Flagging for awareness; asking DCFS for any risks (audits, release freezes, Maximus reviews, leadership) we have not captured.', {
  x: 0.5, y: 1.0, w: 12.33, h: 0.4, fontSize: 14, color: '666666'
});

const riskRows = [
  [
    { text: 'Risk', options: { bold: true, color: WHITE, fill: { color: ACCENT } } },
    { text: 'Lik.', options: { bold: true, color: WHITE, fill: { color: ACCENT } } },
    { text: 'Imp.', options: { bold: true, color: WHITE, fill: { color: ACCENT } } },
    { text: 'Mitigation in progress', options: { bold: true, color: WHITE, fill: { color: ACCENT } } },
  ],
  ['DoIT 30-day notice delays pilot start', 'Unknown', 'High', 'Template + owner + parallel-work determination in this meeting'],
  ['Tool access not in place before Design & Develop (Copilot tier, M365/D365 Copilot)', 'High', 'High', 'Close 6 tool questions this week; fallback to sequenced training'],
  ['§5e ambiguity — Copilot on source = "State data for AI"?', 'Medium', 'High', 'Written determination requested from DCFS interim AI lead'],
  ['Pair-programmer hiring velocity — 5-6 external hires needed', 'Medium', 'Medium', 'Stair-step onboarding; start with 1-2 roles; Krasan bench in progress'],
  ['10-15% target on config-first platform — ambitious, small sample', 'Medium', 'Medium', 'Frame as trajectory; 2-PI full adoption; measure trends not absolutes'],
  ['V3 workflow transition is a measurement confound', 'Medium', 'Medium', 'Freeze Intact workflow, or record state alongside each measurement'],
  ['State pulls AI tools mid-pilot (CMS Oct 2025 precedent)', 'Medium', 'Critical', 'Full DoIT + NIST compliance upfront; documentation first-class'],
  ['Sensitive data in AI prompts (PII, case data)', 'Low', 'Critical', '"No PII" training; per-sprint spot checks; incident reporting path'],
];
s11.addTable(riskRows.map((row, ri) => row.map(cell => {
  if (ri === 0) return cell;
  return typeof cell === 'string' ? { text: cell, options: { fontSize: 13 } } : cell;
})), { x: 0.5, y: 1.5, w: 12.33, border: { type: 'solid', pt: 0.5, color: 'DDDDDD' }, colW: [4.5, 1.0, 1.0, 5.83] });

s11.addShape(pptx.ShapeType.rect, { x: 0.5, y: 5.9, w: 12.33, h: 0.5, fill: { color: 'E3F2FD' }, rectRadius: 0.03 });
s11.addText('Full risk register (20+ items with owners + status) in planning/deliverables/assumptions-and-risks.md. Reviewed weekly in Pilot Governance meetings.', {
  x: 0.7, y: 5.9, w: 12, h: 0.5, fontSize: 14, color: TEXT_DARK, valign: 'middle'
});
s11.addShape(pptx.ShapeType.rect, { x: 0.5, y: 6.5, w: 12.33, h: 0.5, fill: { color: 'FEF0F3' }, rectRadius: 0.03 });
s11.addText('Ask for DCFS: Any risks we have not captured? Production release freeze, Maximus audit window, leadership transitions, federal reporting deadlines?', {
  x: 0.7, y: 6.5, w: 12, h: 0.5, fontSize: 14, bold: true, color: TEXT_DARK, valign: 'middle'
});
addSlideNumber(s11, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 12: Summary / Discussion & Next Steps
// ═══════════════════════════════════════════
slideNum++;
const s12 = pptx.addSlide();
s12.background = { fill: WHITE };
s12.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: HIGHLIGHT } });
addLogo(s12, { x: 0.5, y: 0.35, w: 2.4, h: 0.55 });

s12.addText('Discussion & Next Steps', { x: 0.5, y: 1.15, w: 12, h: 0.8, fontSize: 30, bold: true, color: ACCENT });

// Recap
s12.addText([
  { text: 'Target: ', options: { color: HIGHLIGHT, bold: true } },
  { text: '10-15% productivity improvement — tangible outputs, not story points\n', options: { color: TEXT_DARK } },
  { text: 'Scope: ', options: { color: HIGHLIGHT, bold: true } },
  { text: 'Pilot team = Intact, 5 roles (draft — confirmed after baselining)\n', options: { color: TEXT_DARK } },
  { text: 'Approach: ', options: { color: HIGHLIGHT, bold: true } },
  { text: 'AI-assisted work from day 1 under mandatory Human-in-the-Loop review', options: { color: TEXT_DARK } },
], { x: 0.5, y: 2.0, w: 12.33, h: 1.2, fontSize: 15, fontFace: 'Arial' });

// What we need from DCFS box (light background, highlight border)
s12.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.4, w: 12.33, h: 3.2, fill: { color: 'F5F5F5' }, line: { color: HIGHLIGHT, width: 2 }, rectRadius: 0.05 });
s12.addText('What we need from DCFS', { x: 0.7, y: 3.5, w: 12, h: 0.4, fontSize: 15, bold: true, color: ACCENT });

// Left col — this week
s12.addText('🔴 This week — pilot blockers', { x: 0.7, y: 4.0, w: 6, h: 0.3, fontSize: 13, bold: true, color: 'C0392B' });
['• §5e written determination (Copilot on source = State data?)', '• Tool availability (6 questions confirmed)', '• DoIT 30-day notice template + owner'].forEach((item, i) => {
  s12.addText(item, { x: 0.7, y: 4.35 + i * 0.3, w: 6, h: 0.3, fontSize: 13, color: TEXT_DARK });
});

// Right col — this month
s12.addText('🟡 This month', { x: 6.9, y: 4.0, w: 6, h: 0.3, fontSize: 13, bold: true, color: 'B7850F' });
['• Pilot Governance Lead — DCFS designee', '• Security & Privacy observer (optional)', '• Clearance process + timeline for pair-programming AI specialists'].forEach((item, i) => {
  s12.addText(item, { x: 6.9, y: 4.35 + i * 0.3, w: 6, h: 0.3, fontSize: 13, color: TEXT_DARK });
});

s12.addText('Krasan drives execution. DCFS provides these decisions + designees.', {
  x: 0.7, y: 6.2, w: 12, h: 0.3, fontSize: 12, italic: true, color: '666666'
});

s12.addText('CONFIDENTIAL — KRASAN CONSULTING SERVICES', {
  x: 0, y: 6.9, w: 13.33, h: 0.4,
  fontSize: 11, color: '999999', align: 'center', fontFace: 'Arial'
});

// ═══════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════
const outputPath = path.join(__dirname, 'DCFS-AI-Framework-Krasan.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log(`✓ PPTX created: ${outputPath}`))
  .catch(err => console.error('✗ Failed:', err));
