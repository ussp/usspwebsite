#!/usr/bin/env node
/**
 * Generate PPTX from slide content — runs in Node.js, no browser needed.
 * Usage: node build-pptx.js
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
const WHITE = 'FFFFFF';
const LIGHT_GRAY = 'E8EAEC';
const TEXT_DARK = '222222';

// Logo
const logoPath = path.join(__dirname, '..', 'assets', 'krasan-logo.png');
const hasLogo = fs.existsSync(logoPath);

function addLogo(slide, opts = {}) {
  if (!hasLogo) return;
  const defaults = { x: 0.4, y: 0.3, h: 0.4, w: 1.6 };
  slide.addImage({ path: logoPath, ...defaults, ...opts });
}

function addConfidential(slide) {
  slide.addText('CONFIDENTIAL — KRASAN CONSULTING SERVICES', {
    x: 0, y: 6.9, w: 13.33, h: 0.4,
    fontSize: 9, color: '888888', align: 'center', fontFace: 'Arial'
  });
}

function addSlideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 12.2, y: 7.0, w: 1, h: 0.3,
    fontSize: 8, color: '999999', align: 'right', fontFace: 'Arial'
  });
}

const TOTAL = 8;
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
  { text: 'Prepared for: Jim Daugherty, CIO — DCFS / DeWitt\n', options: { fontSize: 12, color: '555555' } },
  { text: 'Presented by: Vinay Lagisetty & Emil "Romi" Kovacs\n', options: { fontSize: 12, color: '555555' } },
  { text: 'Krasan Consulting Services\n', options: { fontSize: 12, color: '555555' } },
  { text: 'April 13, 2026', options: { fontSize: 12, color: '555555' } },
], { x: 3, y: 4.2, w: 7.33, h: 1.5, align: 'center', fontFace: 'Arial' });
s1.addText('CONFIDENTIAL — KRASAN INTERNAL + DCFS LEADERSHIP', {
  x: 0, y: 6.9, w: 13.33, h: 0.4,
  fontSize: 9, color: '999999', align: 'center', fontFace: 'Arial'
});

// ═══════════════════════════════════════════
// SLIDE 2: Agenda
// ═══════════════════════════════════════════
slideNum++;
const s2 = pptx.addSlide();
s2.addShape(pptx.ShapeType.rect, { x: 0, y: 0.9, w: 13.33, h: 0.04, fill: { color: HIGHLIGHT } });
s2.addText('Agenda', { x: 0.5, y: 0.2, w: 12, h: 0.7, fontSize: 28, bold: true, color: TEXT_DARK, fontFace: 'Arial' });

const agendaItems = [
  ['1', 'Illinois Connect — The Opportunity'],
  ['2', 'The Framework — Krasan\'s Approach'],
  ['3', 'Where We Are — Govern, Baseline & Design'],
  ['4', 'Train, Pilot & Measure'],
  ['5', 'Playbook & Scale'],
  ['6', 'Discussion & Next Steps'],
];

const agendaRows = [
  [{ text: '#', options: { bold: true, color: WHITE, fill: { color: ACCENT } } }, { text: 'Topic', options: { bold: true, color: WHITE, fill: { color: ACCENT } } }],
  ...agendaItems.map(([num, topic]) => [
    { text: num, options: { color: TEXT_DARK } },
    { text: topic, options: { color: TEXT_DARK, bold: num === '6' } }
  ])
];

s2.addTable(agendaRows, {
  x: 0.5, y: 1.2, w: 12.33,
  fontSize: 14, fontFace: 'Arial',
  border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
  colW: [0.6, 11.73],
  rowH: [0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45],
});

s2.addText('Supporting detail — Capability map, measurement, timeline, and asks are in the appendix for reference.', {
  x: 0.5, y: 5.0, w: 12.33, h: 0.6,
  fontSize: 12, italic: true, color: '666666', fontFace: 'Arial'
});
addSlideNumber(s2, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 3: The Opportunity
// ═══════════════════════════════════════════
slideNum++;
const s3 = pptx.addSlide();
s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0.9, w: 13.33, h: 0.04, fill: { color: HIGHLIGHT } });
s3.addText('Illinois Connect — The Opportunity', { x: 0.5, y: 0.2, w: 12, h: 0.7, fontSize: 28, bold: true, color: TEXT_DARK, fontFace: 'Arial' });

s3.addText('The Program', { x: 0.5, y: 1.2, w: 12, h: 0.4, fontSize: 16, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
s3.addText('Illinois Connect is migrating three legacy systems — SACWIS, CYCIS, and MARS — to a unified CCWIS platform on Microsoft Dynamics 365. Across 12 SAFe product teams and 160+ Krasan consultants, this ART is delivering critical capabilities for DCFS.', {
  x: 0.5, y: 1.6, w: 12.33, h: 0.7, fontSize: 12, color: TEXT_DARK, fontFace: 'Arial'
});

s3.addText('Why AI, Why Now', { x: 0.5, y: 2.4, w: 12, h: 0.4, fontSize: 16, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
const whyItems = [
  'AI is becoming standard for high-performing delivery teams',
  'The State has already invested in GitHub Copilot and Atlassian Rovo',
  'Teams are delivering well — AI builds on a strong foundation',
  'Krasan is developing a structured AI transformation framework — designed for engagements like ILC',
];
whyItems.forEach((item, i) => {
  s3.addText(`•  ${item}`, { x: 0.7, y: 2.8 + i * 0.35, w: 11.8, h: 0.35, fontSize: 12, color: TEXT_DARK, fontFace: 'Arial' });
});

s3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.3, w: 12.33, h: 0.6, fill: { color: 'E8F5E9' }, rectRadius: 0.05 });
s3.addText('Objective: Apply AI to SAFe delivery processes — pilot with select teams, measure the impact, scale what works.', {
  x: 0.7, y: 4.3, w: 12, h: 0.6, fontSize: 12, bold: false, color: TEXT_DARK, fontFace: 'Arial'
});

// Three cards
const cards = [
  { title: 'Amplify, Don\'t Replace', items: ['Same people, better tools', 'No workforce reduction', 'AI assists, human decides'] },
  { title: 'Measure, Don\'t Guess', items: ['Baseline first, then compare', 'Select up to 8 KPIs that matter', 'Before/after with control group'] },
  { title: 'Pilot, Then Scale', items: ['Start with 2 teams', 'Select targeted SDLC processes', 'Scale what works'] },
];

cards.forEach((card, i) => {
  const cx = 0.5 + i * 4.2;
  s3.addShape(pptx.ShapeType.rect, { x: cx, y: 5.2, w: 3.9, h: 2.0, fill: { color: 'F5F5F5' }, rectRadius: 0.05, line: { color: 'DDDDDD', width: 0.5 } });
  s3.addText(card.title, { x: cx + 0.2, y: 5.3, w: 3.5, h: 0.4, fontSize: 13, bold: true, color: ACCENT, fontFace: 'Arial' });
  card.items.forEach((item, j) => {
    s3.addText(`•  ${item}`, { x: cx + 0.3, y: 5.7 + j * 0.3, w: 3.4, h: 0.3, fontSize: 10, color: TEXT_DARK, fontFace: 'Arial' });
  });
});
addSlideNumber(s3, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 4: Framework Overview
// ═══════════════════════════════════════════
slideNum++;
const s4 = pptx.addSlide();
s4.addShape(pptx.ShapeType.rect, { x: 0, y: 0.9, w: 13.33, h: 0.04, fill: { color: HIGHLIGHT } });
s4.addText('The Framework — Krasan\'s Approach', { x: 0.5, y: 0.2, w: 12, h: 0.7, fontSize: 28, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
s4.addText('This is the framework Krasan is building for ILC — structured to work within government guardrails while delivering measurable results.', {
  x: 0.5, y: 1.0, w: 12.33, h: 0.5, fontSize: 12, color: '666666', fontFace: 'Arial'
});

// Phase flow boxes
const phases = ['Govern', 'Baseline', 'Design', 'Train', 'Pilot', 'Measure', 'Playbook', 'Scale'];
phases.forEach((phase, i) => {
  const px = 0.5 + i * 1.55;
  s4.addShape(pptx.ShapeType.roundRect, { x: px, y: 1.6, w: 1.3, h: 0.5, fill: { color: ACCENT }, rectRadius: 0.05 });
  s4.addText(phase, { x: px, y: 1.6, w: 1.3, h: 0.5, fontSize: 10, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
  if (i < phases.length - 1) {
    s4.addText('→', { x: px + 1.3, y: 1.6, w: 0.25, h: 0.5, fontSize: 12, color: '999999', align: 'center', fontFace: 'Arial' });
  }
});

// Framework table
const fwRows = [
  [{ text: 'PHASE', options: { bold: true, color: WHITE, fill: { color: ACCENT } } }, { text: 'WHAT HAPPENS (illustrative)', options: { bold: true, color: WHITE, fill: { color: ACCENT } } }, { text: 'DELIVERABLE', options: { bold: true, color: WHITE, fill: { color: ACCENT } } }],
  ['Govern', 'Align with DoIT AI Policy, define guardrails, confirm tool access', 'AI Usage Playbook, Compliance Map'],
  ['Baseline', 'Capture current velocity, quality, and cycle time from JIRA (last 3 sprints)', 'Baseline Metrics Report'],
  ['Design', 'Map current → AI-augmented state for SDLC processes; define tools and methods per role', 'Process Design Docs, Role-Based Playbooks, Training Plan'],
  ['Train', 'Role-specific training: responsible AI use, prompt engineering, approved SDLC processes', 'Training Materials (per role)'],
  ['Pilot', '2 teams use AI tools for 1 full PI; remaining teams are control group', 'Weekly Check-in Reports'],
  ['Measure', 'Continuous metrics collection; compare pilot vs baseline vs control', 'Pilot Results Report'],
  ['Playbook', 'Codify what worked into role-based playbooks (BA, Tester, Dev, Scrum Master) — living documents, updated continuously', 'Ongoing'],
  ['Scale', 'Roll out to all 12 teams based on proven results', 'ART-Wide Rollout Plan'],
];

s4.addTable(fwRows.map((row, ri) => row.map((cell, ci) => {
  if (ri === 0) return cell; // header already formatted
  return { text: cell, options: { fontSize: 10, color: TEXT_DARK, bold: ci === 0 } };
})), {
  x: 0.5, y: 2.4, w: 12.33,
  fontSize: 10, fontFace: 'Arial',
  border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
  colW: [1.2, 7.5, 3.63],
  rowH: [0.35, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
  autoPage: false,
});
addSlideNumber(s4, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 5: Govern, Baseline & Design
// ═══════════════════════════════════════════
slideNum++;
const s5 = pptx.addSlide();
s5.addShape(pptx.ShapeType.rect, { x: 0, y: 0.9, w: 13.33, h: 0.04, fill: { color: HIGHLIGHT } });
s5.addText('Where We Are — Govern, Baseline & Design', { x: 0.5, y: 0.2, w: 12, h: 0.7, fontSize: 28, bold: true, color: TEXT_DARK, fontFace: 'Arial' });

// Phase flow with active
phases.forEach((phase, i) => {
  const px = 0.5 + i * 1.55;
  const isActive = i <= 2;
  s5.addShape(pptx.ShapeType.roundRect, { x: px, y: 1.1, w: 1.3, h: 0.45, fill: { color: isActive ? HIGHLIGHT : ACCENT }, rectRadius: 0.05 });
  s5.addText(phase, { x: px, y: 1.1, w: 1.3, h: 0.45, fontSize: 9, bold: true, color: WHITE, align: 'center', fontFace: 'Arial', transparency: isActive ? 0 : 60 });
  if (i < phases.length - 1) s5.addText('→', { x: px + 1.3, y: 1.1, w: 0.25, h: 0.45, fontSize: 11, color: '999999', align: 'center' });
});

// Three columns
const cols5 = [
  { title: 'Govern', items: ['Review DoIT AI Policy — all 12 sections mapped', 'Define data guardrails (no case data, no PII in any AI tool)', 'Confirm approved tools & licensing status', 'Align on constraints: no autonomous code, SDLC only'], deliverable: 'AI Usage Playbook & Compliance Map' },
  { title: 'Baseline', items: ['Capture current metrics from JIRA (last 3 sprints)', 'Establish baseline per team — before AI is introduced', 'Identify 2 pilot teams and control group', 'Distribute team health survey'], deliverable: 'Baseline Metrics Report' },
  { title: 'Design / Develop', items: ['Map current state → AI-augmented state for each SDLC process', 'Define AI-augmented SDLC processes per role', 'Select tools & methods for each process', 'Build training materials from process designs'], deliverable: 'Process Design Docs, Role-Based Playbooks & Training Plan' },
];

cols5.forEach((col, i) => {
  const cx = 0.5 + i * 4.2;
  s5.addText(col.title, { x: cx, y: 1.8, w: 3.9, h: 0.4, fontSize: 14, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
  col.items.forEach((item, j) => {
    s5.addText(`•  ${item}`, { x: cx + 0.1, y: 2.2 + j * 0.4, w: 3.8, h: 0.4, fontSize: 10, color: TEXT_DARK, fontFace: 'Arial', valign: 'top' });
  });
  s5.addShape(pptx.ShapeType.rect, { x: cx, y: 4.0, w: 3.9, h: 0.5, fill: { color: 'E8F5E9' }, rectRadius: 0.03 });
  s5.addText(`Deliverable: ${col.deliverable}`, { x: cx + 0.1, y: 4.0, w: 3.7, h: 0.5, fontSize: 9, bold: true, color: TEXT_DARK, fontFace: 'Arial', valign: 'middle' });
});

s5.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.8, w: 12.33, h: 0.5, fill: { color: 'E3F2FD' }, rectRadius: 0.03 });
s5.addText('This is where your input is critical — which processes matter most, what data is available, and which teams are right for the pilot.', {
  x: 0.7, y: 4.8, w: 12, h: 0.5, fontSize: 11, bold: true, color: TEXT_DARK, fontFace: 'Arial'
});
addSlideNumber(s5, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 6: Train, Pilot & Measure
// ═══════════════════════════════════════════
slideNum++;
const s6 = pptx.addSlide();
s6.addShape(pptx.ShapeType.rect, { x: 0, y: 0.9, w: 13.33, h: 0.04, fill: { color: HIGHLIGHT } });
s6.addText('Train, Pilot & Measure', { x: 0.5, y: 0.2, w: 12, h: 0.7, fontSize: 28, bold: true, color: TEXT_DARK, fontFace: 'Arial' });

phases.forEach((phase, i) => {
  const px = 0.5 + i * 1.55;
  const isActive = i >= 3 && i <= 5;
  s6.addShape(pptx.ShapeType.roundRect, { x: px, y: 1.1, w: 1.3, h: 0.45, fill: { color: isActive ? HIGHLIGHT : ACCENT }, rectRadius: 0.05 });
  s6.addText(phase, { x: px, y: 1.1, w: 1.3, h: 0.45, fontSize: 9, bold: true, color: WHITE, align: 'center', fontFace: 'Arial', transparency: isActive ? 0 : 60 });
  if (i < phases.length - 1) s6.addText('→', { x: px + 1.3, y: 1.1, w: 0.25, h: 0.45, fontSize: 11, color: '999999', align: 'center' });
});

const cols6 = [
  { title: 'Train', items: ['Everyone gets:', '  • DoIT AI Policy compliance', '  • Data guardrails & boundaries', '  • What success looks like & how we measure it', 'Role-specific:', '  • BAs — story quality, AC generation', '  • Testers — test script generation', '  • Devs — code review, documentation', '  • Scrum Masters — sprint insights, metrics'], deliverable: 'Training Completion Report (per role)' },
  { title: 'Pilot', items: ['2 teams with AI tools & training', 'Remaining teams as control group', 'Learn and iterate — weekly check-ins to adjust what\'s working', 'Not a "set and forget" — continuous learning cycle'], deliverable: 'Weekly Check-in Reports' },
  { title: 'Measure', items: ['Pre & post comparison against baseline', 'Pilot teams vs control teams', 'Up to 8 KPIs tied to specific SDLC processes', 'Team health survey (before & after)', 'Lessons learned & improvements for next phase'], deliverable: 'Pilot Results Report, Lessons Learned & Scale Recommendation' },
];

cols6.forEach((col, i) => {
  const cx = 0.5 + i * 4.2;
  s6.addText(col.title, { x: cx, y: 1.8, w: 3.9, h: 0.4, fontSize: 14, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
  col.items.forEach((item, j) => {
    const isBold = item === 'Everyone gets:' || item === 'Role-specific:';
    s6.addText(item.startsWith('  •') ? item : `•  ${item}`, { x: cx + 0.1, y: 2.2 + j * 0.3, w: 3.8, h: 0.3, fontSize: 9, color: TEXT_DARK, fontFace: 'Arial', bold: isBold, valign: 'top', bullet: false });
  });
  s6.addShape(pptx.ShapeType.rect, { x: cx, y: 5.2, w: 3.9, h: 0.5, fill: { color: 'E8F5E9' }, rectRadius: 0.03 });
  s6.addText(`Deliverable: ${col.deliverable}`, { x: cx + 0.1, y: 5.2, w: 3.7, h: 0.5, fontSize: 9, bold: true, color: TEXT_DARK, fontFace: 'Arial', valign: 'middle' });
});
addSlideNumber(s6, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 7: Playbook & Scale
// ═══════════════════════════════════════════
slideNum++;
const s7 = pptx.addSlide();
s7.addShape(pptx.ShapeType.rect, { x: 0, y: 0.9, w: 13.33, h: 0.04, fill: { color: HIGHLIGHT } });
s7.addText('Playbook & Scale', { x: 0.5, y: 0.2, w: 12, h: 0.7, fontSize: 28, bold: true, color: TEXT_DARK, fontFace: 'Arial' });

phases.forEach((phase, i) => {
  const px = 0.5 + i * 1.55;
  const isActive = i >= 6;
  s7.addShape(pptx.ShapeType.roundRect, { x: px, y: 1.1, w: 1.3, h: 0.45, fill: { color: isActive ? HIGHLIGHT : ACCENT }, rectRadius: 0.05 });
  s7.addText(phase, { x: px, y: 1.1, w: 1.3, h: 0.45, fontSize: 9, bold: true, color: WHITE, align: 'center', fontFace: 'Arial', transparency: isActive ? 0 : 60 });
  if (i < phases.length - 1) s7.addText('→', { x: px + 1.3, y: 1.1, w: 0.25, h: 0.45, fontSize: 11, color: '999999', align: 'center' });
});

// Playbook column
s7.addText('Playbook', { x: 0.5, y: 1.8, w: 6, h: 0.4, fontSize: 14, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
s7.addText('Living documents — started during Design, refined through Pilot, finalized at Scale:', { x: 0.5, y: 2.2, w: 6, h: 0.35, fontSize: 11, color: '666666', fontFace: 'Arial' });

const playbooks = [
  'BA Playbook — story writing, AC generation, refinement',
  'Tester Playbook — test script generation, edge cases',
  'Developer Playbook — code review, documentation',
  'Scrum Master Playbook — sprint insights, metrics',
];
playbooks.forEach((item, i) => {
  s7.addText(`•  ${item}`, { x: 0.7, y: 2.6 + i * 0.3, w: 5.8, h: 0.3, fontSize: 10, color: TEXT_DARK, fontFace: 'Arial' });
});

s7.addText('Each playbook includes:', { x: 0.5, y: 3.9, w: 6, h: 0.3, fontSize: 11, color: TEXT_DARK, fontFace: 'Arial' });
const pbIncludes = ['What works, what doesn\'t', 'Prompts & processes that proved effective', 'Guardrails & compliance reminders', 'Lessons learned from pilot'];
pbIncludes.forEach((item, i) => {
  s7.addText(`•  ${item}`, { x: 0.7, y: 4.2 + i * 0.3, w: 5.8, h: 0.3, fontSize: 10, color: TEXT_DARK, fontFace: 'Arial' });
});

s7.addShape(pptx.ShapeType.rect, { x: 0.5, y: 5.5, w: 6, h: 0.4, fill: { color: 'E8F5E9' }, rectRadius: 0.03 });
s7.addText('Deliverable: Finalized Playbooks (updated with pilot lessons learned)', { x: 0.6, y: 5.5, w: 5.8, h: 0.4, fontSize: 9, bold: true, color: TEXT_DARK, fontFace: 'Arial' });

// Scale column
s7.addText('Scale', { x: 7, y: 1.8, w: 6, h: 0.4, fontSize: 14, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
s7.addText('Expand from pilot to all 12 teams — based on proven results, not assumptions.', { x: 7, y: 2.2, w: 6, h: 0.35, fontSize: 11, color: '666666', fontFace: 'Arial' });

const scaleItems = [
  'Go/no-go decision based on pilot data',
  'Pilot team members become AI champions for their ART',
  'Phased rollout — not all 12 at once',
  'Continuous measurement continues at ART level',
  'Playbooks updated as more teams adopt',
];
scaleItems.forEach((item, i) => {
  s7.addText(`•  ${item}`, { x: 7.2, y: 2.6 + i * 0.35, w: 5.8, h: 0.35, fontSize: 10, color: TEXT_DARK, fontFace: 'Arial' });
});

s7.addShape(pptx.ShapeType.rect, { x: 7, y: 5.5, w: 6, h: 0.4, fill: { color: 'E8F5E9' }, rectRadius: 0.03 });
s7.addText('Deliverable: ART-Wide Rollout Plan', { x: 7.1, y: 5.5, w: 5.8, h: 0.4, fontSize: 9, bold: true, color: TEXT_DARK, fontFace: 'Arial' });
addSlideNumber(s7, slideNum, TOTAL);

// ═══════════════════════════════════════════
// SLIDE 8: Discussion & Next Steps
// ═══════════════════════════════════════════
slideNum++;
const s8 = pptx.addSlide();
s8.background = { fill: WHITE };
s8.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: HIGHLIGHT } });
addLogo(s8, { x: 0.5, y: 0.4, w: 2.0, h: 0.5 });

s8.addText('Discussion & Next Steps', { x: 0.5, y: 1.2, w: 12, h: 0.8, fontSize: 30, bold: true, color: ACCENT, fontFace: 'Arial' });

const discussItems = [
  { label: 'What we showed:', value: 'Our intent — a framework we\'re building for ILC' },
  { label: 'What we need:', value: 'Your expectations, priorities, and feedback' },
];

discussItems.forEach((item, i) => {
  s8.addText(item.label, { x: 0.5, y: 2.4 + i * 0.6, w: 2.5, h: 0.5, fontSize: 16, bold: true, color: HIGHLIGHT, fontFace: 'Arial' });
  s8.addText(item.value, { x: 3.0, y: 2.4 + i * 0.6, w: 9.5, h: 0.5, fontSize: 16, color: TEXT_DARK, fontFace: 'Arial' });
});

const questions = [
  'What does success look like to you?',
  'What AI tools do we have access to right now?',
  'What should we focus on first?',
  'What concerns do you have?',
];

s8.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.0, w: 0.04, h: 2.2, fill: { color: HIGHLIGHT } });
questions.forEach((q, i) => {
  s8.addText(q, { x: 0.8, y: 4.1 + i * 0.5, w: 11, h: 0.45, fontSize: 15, color: '555555', fontFace: 'Arial' });
});

s8.addText('CONFIDENTIAL — KRASAN CONSULTING SERVICES', {
  x: 0, y: 6.9, w: 13.33, h: 0.4,
  fontSize: 9, color: '999999', align: 'center', fontFace: 'Arial'
});

// ═══════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════
const outputPath = path.join(__dirname, 'DCFS-AI-Framework-Krasan.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log(`PPTX created: ${outputPath}`))
  .catch(err => console.error('Failed:', err));
