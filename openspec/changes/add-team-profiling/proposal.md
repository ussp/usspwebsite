# Change: Add Team Profiling to AI Transformation Tools

## Why
When adding a team to an engagement in tools.ussp.co, we currently capture only basic info (team name, members). To run an effective AI pilot, we need to understand each team's composition (roles, vendors), SDLC workflow, objectives, current tools, and which processes will be augmented. This data drives training customization, baseline measurement, and measurement methodology. Without it, we're guessing.

## What Changes
- Add team profiling workflow when creating/editing a team in an engagement
- Capture: team composition (roles + vendors), SDLC workflow states, team objectives, current tools, AI augmentation map, readiness assessment link, baseline metrics, training status
- Display team profile as a detail page within the engagement
- Use SDLC workflow states for cycle time computation in measurement
- Use composition data to auto-generate role-specific training plans

## Impact
- Affected specs: new capability `team-profiling`
- Affected code: `packages/ai-tools/src/app/` (team pages), `packages/platform-core/src/` (queries, types)
- Database: new columns/tables for team profile data
- Existing team creation flow gets expanded (not replaced)
