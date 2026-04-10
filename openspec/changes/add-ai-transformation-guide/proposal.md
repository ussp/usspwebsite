# Change: Add AI Transformation Framework Guide

## Why
The DCFS AI transformation framework exists as scattered files (rollout plan, slides, meeting notes, questionnaires) with 3 critical gaps: no formal assessment instrument, no training delivery plan, and no leadership dashboard concept. We need a cohesive, publishable guide that users (Krasan consultants, team leads, client stakeholders) can reference — organized as chapters covering the full 8-phase framework.

## What Changes
- Create 13-chapter guide + 4 appendices under `clients/dcfs-ilc/planning/guide/`
- New content: AI Readiness Assessment (Ch 4), Training Delivery Plan (Ch 7), Measurement & Dashboard (Ch 9), Tools Platform Guide (Ch 12), Deployment Guide (Ch 13)
- Extracted/restructured content: Introduction, Executive Discovery, Governance, Baseline, Process Design, Pilot Execution, Playbooks, Scale (Ch 1-3, 5-6, 8, 10-11)
- Update `rollout-plan.md` to v3 with 8-phase naming and guide cross-references
- Update presentation slides post-Jim meeting

## Impact
- Affected specs: new capability `ai-transformation-guide`
- Affected code: `clients/dcfs-ilc/planning/` (guide directory + rollout-plan.md + slides)
- No code changes to the platform (tools.ussp.co) — dashboard concept is documentation only
