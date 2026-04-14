## 1. Database Schema
- [ ] 1.1 Add team_members table (name, role, vendor, in_pilot, ai_tool, team_id)
- [ ] 1.2 Add team_workflow_states table (team_id, order, status_name, role, duration)
- [ ] 1.3 Add team_objectives table (team_id, pi, objective, priority, capacity_pct)
- [ ] 1.4 Add team_tools table (team_id, category, tool_name, is_ai_tool)
- [ ] 1.5 Add team_augmentation_map table (team_id, process, role, current_state, augmented_state, ai_tool, stair_step)
- [ ] 1.6 Add team_training_status table (team_member_id, track, status, scheduled_date, completed_date)
- [ ] 1.7 Create Alembic migration

## 2. Platform Core (Types & Queries)
- [ ] 2.1 Add TypeScript interfaces for all new tables
- [ ] 2.2 Add queries: createTeamProfile, getTeamProfile, updateTeamProfile
- [ ] 2.3 Add queries: team members CRUD
- [ ] 2.4 Add queries: workflow states CRUD
- [ ] 2.5 Add queries: augmentation map CRUD
- [ ] 2.6 Add queries: training status CRUD
- [ ] 2.7 Export from platform-core index.ts

## 3. API Routes
- [ ] 3.1 POST/GET/PATCH /api/engagements/[id]/teams/[teamId]/profile
- [ ] 3.2 POST/GET/PATCH /api/engagements/[id]/teams/[teamId]/members
- [ ] 3.3 POST/GET/PATCH /api/engagements/[id]/teams/[teamId]/workflow
- [ ] 3.4 POST/GET/PATCH /api/engagements/[id]/teams/[teamId]/augmentation-map
- [ ] 3.5 POST/GET/PATCH /api/engagements/[id]/teams/[teamId]/training-status

## 4. UI — Team Profile Page
- [ ] 4.1 Team profile detail page layout (tabbed or scrollable sections)
- [ ] 4.2 Team composition section (add/edit/remove members with role, vendor, pilot flag, AI tool)
- [ ] 4.3 SDLC workflow section (drag-to-reorder status states)
- [ ] 4.4 Team objectives section (PI objectives, capacity %)
- [ ] 4.5 Tools inventory section (current + AI additions)
- [ ] 4.6 AI augmentation map section (process → role → current → augmented → tool → step)
- [ ] 4.7 Baseline metrics display (read from assessment module)
- [ ] 4.8 Readiness assessment display (read from assessment module)
- [ ] 4.9 Training status display (per member, per track)

## 5. Integration
- [ ] 5.1 Link team profile to existing engagement team list
- [ ] 5.2 Use workflow states in cycle time computation (measurement module)
- [ ] 5.3 Use composition data in training plan auto-generation
- [ ] 5.4 Use augmentation map in reporting (which processes improved)

## 6. Testing
- [ ] 6.1 Unit tests for all new queries
- [ ] 6.2 API route tests
- [ ] 6.3 UI component tests
- [ ] 6.4 End-to-end: create team → add profile → view profile

## 7. Documentation
- [ ] 7.1 Update tools platform user guide (Ch 12)
- [ ] 7.2 Add tooltips for new fields
- [ ] 7.3 Update deployment guide (Ch 13)
