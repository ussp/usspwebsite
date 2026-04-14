# Change: Add Team Profiling to AI Transformation Tools

## Why
When adding a team to an engagement in tools.ussp.co, we currently capture only basic info (team name, members). To run an effective AI pilot, we need to understand each team's composition (roles, vendors), SDLC workflow, objectives, current tools, and which processes will be augmented. This data drives training customization, baseline measurement, and measurement methodology. Without it, we're guessing.

## Existing Capabilities (Already Built)

The **readiness assessment module** (`add-readiness-workflow` + `add-readiness-deliverables`, both complete) already provides:

| Feature | Readiness Module Page | Status |
|---------|----------------------|--------|
| Company profile (entity type, state, industry) | `/readiness/[id]/company` | **Built** |
| Team composition with 24+ roles | `/readiness/[id]/team` | **Built** |
| AI policy intake & coverage assessment | `/readiness/[id]/policy` | **Built** |
| Assessment scope (9 pillars) | `/readiness/[id]/scope` | **Built** |
| Organizational constraints (6 categories) | `/readiness/[id]/constraints` | **Built** |
| SDLC workflow analysis (current vs AI-augmented) | `/readiness/[id]/sdlc` | **Built** |
| AI enhancement catalog (120+ items, versioned) | `/readiness/[id]/enhancements` | **Built** |
| Custom questionnaire generation (role-based) | `/readiness/[id]/questionnaire` | **Built** |
| Email distribution with tokenized links | `/readiness/[id]/distribute` | **Built** |
| Use case prioritization (effort/impact matrix) | `/readiness/[id]/use-cases` | **Built** |
| Risk register | `/readiness/[id]/risks` | **Built** |
| Pilot recommendations | `/readiness/[id]/pilot` | **Built** |
| Data readiness scorecard | `/readiness/[id]/data` | **Built** |
| Full report generation | `/readiness/[id]/report` | **Built** |

## What's Actually New (This Proposal)

The team profiling proposal should **extend** the existing readiness module with engagement-specific features, not rebuild what exists:

1. **Vendor tracking** — readiness team module has roles but not vendor/organization (Krasan, CSG, ISI, State). Needed for multi-vendor pilot management.
2. **Pilot participation flag** — mark which members are in the AI pilot vs not (Krasan roles only initially).
3. **AI tool assignment per member** — which specific tool each member uses (Copilot, Rovo, D365 AI).
4. **Stair-step tracking** — which step of the stair-stepped code generation approach each process is at.
5. **Training status tracking** — per-member, per-track completion (scheduled/completed/pending).
6. **Baseline metrics integration** — display JIRA baseline data within the team profile.
7. **Pilot readiness gate** — validate team is ready for pilot (training complete, readiness above threshold, baseline captured).
8. **Engagement-level team dashboard** — summary view of all teams in an engagement with readiness, training, and pilot status.

## Impact
- Affected specs: extends `readiness-assessment` capability (not new capability)
- Affected code: `packages/ai-tools/src/app/readiness/[id]/team/` (extend existing), `packages/platform-core/src/queries/admin/readiness-team.ts` (extend existing)
- Database: add columns to existing team/member tables (vendor, in_pilot, ai_tool, stair_step)
- Minimal new tables: team_training_status only
