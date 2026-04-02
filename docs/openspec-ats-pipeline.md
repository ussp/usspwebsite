# OpenSpec: ATS Pipeline Upgrade
## USSP Backoffice - Applicant Tracking System Enhancements

**Version:** 1.0
**Date:** 2026-03-31
**Status:** Implemented
**Author:** USSP Engineering

---

## 1. Overview

This document describes the ATS (Applicant Tracking System) pipeline upgrade implemented in the USSP backoffice (`app.ussp.co`). The system was upgraded from a flat 7-status workflow to a granular 12-stage pipeline inspired by CareerPlug and Indeed, enabling better tracking of candidates through the hiring process.

---

## 2. Problem Statement

The previous system had only 7 application statuses: `new`, `screening`, `interview`, `offer`, `hired`, `rejected`, `withdrawn`. This was too coarse for a staffing company workflow, making it difficult to:

- Track exactly where a candidate is in the hiring pipeline
- Know who moved a candidate and when
- See applicant flow trends over time
- Review qualification matching at a glance
- Efficiently triage new applications per position

---

## 3. Solution Architecture

### 3.1 Expanded Pipeline Stages

The application `status` column (`String(50)`) now supports 12 values:

| # | Status | Label | Type |
|---|--------|-------|------|
| 1 | `new` | New Application | Linear |
| 2 | `phone_screen` | Phone Screen | Linear |
| 3 | `interview_zoom` | Zoom Interview | Linear |
| 4 | `interview_in_person` | In-Person Interview | Linear |
| 5 | `employment_verification` | Employment Verification | Linear |
| 6 | `references` | References | Linear |
| 7 | `clearances` | Clearances | Linear |
| 8 | `offer_pending` | Offer Pending | Linear |
| 9 | `onboarding` | Onboarding | Linear |
| 10 | `hired` | Hired | Linear (terminal) |
| 11 | `rejected` | Rejected | Terminal |
| 12 | `withdrawn` | Withdrawn | Terminal |

**Migration**: Alembic revision `0014` remaps existing data:
- `screening` -> `phone_screen`
- `interview` -> `interview_zoom`
- `offer` -> `offer_pending`

### 3.2 Pipeline Accordion (Application Detail)

The application detail page sidebar now features a vertical accordion pipeline:

- **Completed stages**: Green filled circle with checkmark
- **Current stage**: Green outlined circle, expanded with:
  - Timestamp and staff name of who moved the candidate
  - "Advance" button (moves to next stage)
  - "Deactivate" button (rejects with confirmation)
- **Future stages**: Gray hollow circles, collapsed
- **Terminal statuses**: Shown as colored banners above the pipeline
- **Duplicate detection**: Banner shown when applicant has other applications
- **Manual override**: "..." menu for setting any status directly

**Data source**: Audit log entries (`action = 'update_status'`, `entity_type = 'application'`) provide the status history timeline.

### 3.3 Position Detail Page (CareerPlug Layout)

Redesigned with three sections:

**Header**: Title, badges (HOT, type), location, status, Edit/Close buttons

**Overview Row** (4-column grid):
- Left column: Stat cards (Total, New, Rejected, In Progress, Hires)
- Right 3 columns: Applicant Flow Summary bar chart (8-week view)

**Bottom Row** (3-column grid):
- Left 2/3: Recently Active Candidates table + Full applicants DataTable with status filter tabs
- Right 1/3: Activity Feed timeline (audit log entries for this position and its applications)

### 3.4 Positions Table Enhancements

New columns added to the positions list:
- **Applicants**: Total count with "N new" badge
- **Review link**: "Review new applicants ->" link when new applications exist
- **ACTIVE badge**: Inline status indicator

### 3.5 Matching Qualifications

Leverages the existing scoring engine (`match_scores`, `position_requirements` tables):

- **Application detail sidebar**: Shows dimension-level match indicators (green/amber/red dots), overall score percentage, strength areas, and gap areas
- **Dimensions scored**: Skills, Experience, Location, Education, Certifications, Resume Recency, Availability, Rate Compatibility

### 3.6 Dashboard Updates

- Pipeline bar chart now shows all 12 statuses with readable labels
- "In Interview" metric card replaced with "In Progress" (sum of all active pipeline stages)
- Status color palette expanded for new stages

---

## 4. Technical Implementation

### 4.1 Files Modified

**Platform Core** (`packages/platform-core/src/`):
| File | Changes |
|------|---------|
| `types/admin.ts` | `ApplicationStatus` expanded to 12 values; added `PIPELINE_STAGES`, `TERMINAL_STATUSES`, `STAGE_LABELS`, `STAGE_COLORS` constants; added `StatusHistoryEntry`, `PositionStats`, `PositionListItem` interfaces |
| `queries/admin/applications.ts` | Added `getApplicationStatusHistory()` |
| `queries/admin/positions.ts` | Added `getPositionStats()`, `getAllPositionsWithCounts()` |
| `queries/admin/audit.ts` | Added `getPositionActivityFeed()` |
| `queries/admin/dashboard.ts` | Updated all status count objects to 12 statuses |
| `index.ts` | Exported new types |

**Backoffice** (`packages/backoffice/src/`):
| File | Changes |
|------|---------|
| `components/PipelineAccordion.tsx` | **NEW** - Vertical accordion pipeline with Advance/Deactivate |
| `components/ApplicantFlowChart.tsx` | **NEW** - CSS bar chart for weekly application volume |
| `components/ActivityFeed.tsx` | **NEW** - Audit log timeline with human-readable actions |
| `components/MatchingQualifications.tsx` | **NEW** - Dimension-level match score display |
| `components/StatusBadge.tsx` | Updated for 12 statuses with readable labels |
| `app/applications/[id]/page.tsx` | Replaced flat status buttons with PipelineAccordion + MatchingQualifications |
| `app/applications/applications-table.tsx` | Updated filter tabs for 12 statuses |
| `app/positions/[id]/page.tsx` | Full redesign: stats sidebar, flow chart, recent candidates, activity feed |
| `app/positions/positions-table.tsx` | Added Applicants column, review links, ACTIVE badge |
| `app/positions/page.tsx` | Uses `getAllPositionsWithCounts()` |
| `app/page.tsx` | Updated STATUS_COLORS, pipeline labels, "In Progress" metric |
| `app/api/applications/[id]/history/route.ts` | **NEW** - GET status history |
| `app/api/positions/[id]/stats/route.ts` | **NEW** - GET position stats |
| `app/api/positions/[id]/activity/route.ts` | **NEW** - GET activity feed |

**Migrations**:
| File | Changes |
|------|---------|
| `migrations/versions/20260401_000014_expand_pipeline_stages.py` | **NEW** - Data migration for status values |
| `migrations/models.py` | Updated status column comment |

### 4.2 Database Changes

- No DDL changes (column is already `String(50)`)
- Data migration only: 3 UPDATE statements remapping old status values
- Fully reversible downgrade path

### 4.3 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/applications/[id]/history` | Application status history timeline |
| GET | `/api/positions/[id]/stats` | Position applicant statistics |
| GET | `/api/positions/[id]/activity` | Position activity feed (audit log) |
| GET | `/api/positions/[id]/matches` | Match scores for position (existing) |

---

## 5. Per-Position Application Tracking (v1.1 — 2026-04-02)

### 5.1 Problem

The original system created ONE application record per email (upsert-by-email). When a candidate applied to a second job, their previous application was overwritten — losing the resume, pipeline status, and notes for the first position. Recruiters couldn't track progress independently per job.

### 5.2 Solution

Each `(email + position)` now creates a **separate application record** with its own resume, pipeline status, notes, and audit trail.

**Database changes (migration `0017`):**
- Added unique constraint `uq_applications_site_email_position` on `(site_id, email, position_id)`
- Added indexes: `(site_id, email)` and `(site_id, position_id)` for fast lookups

**Application logic change** (`createOrUpdateApplication`):
- Before: lookup by `email` only → single record per person
- After: lookup by `email + position_id` → one record per person per position
- Same person, same job → UPDATE (e.g., new resume)
- Same person, new job → INSERT (separate record)

**New API endpoint:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/applications/by-email?email=X` | All applications by a candidate |

**UI changes:**
- **Applications list**: Added position filter dropdown to filter by specific job
- **Application detail**: "Other Applications" section now correctly shows all jobs the person applied to, each with its own status and resume
- **Application detail**: New "Position Details" card showing description, bill rate, location, type, work mode, duration, client, and end client
- **Candidate detail**: Applications sidebar now shows all applications (one per job) with independent statuses

### 5.3 Data Model

```
candidates (1) ──< applications (N) >── positions (1)
   person record      one per (email+position)     job listing
                      own resume, status, notes
```

The `candidates` table remains the unified "person" entity. The `application_positions` junction table is kept for backward compatibility but is effectively superseded — each application row now maps to exactly one position.

### 5.4 Future: AI Candidate Matching

With complete application history preserved per position, the system is ready for:
- **AI job matching**: When a new position is created, match against the candidate pool using resume data, past applications, and outcomes
- **Candidate re-engagement**: Surface candidates rejected for Role A who fit new Role B
- **Analytics**: Rejection rates per position, time-to-hire, pipeline velocity

---

## 6. Future Enhancements

### 6.1 Planned
- **Email integration**: Send templated emails at each pipeline stage (invite to phone screen, schedule interview, etc.)
- **Scorecard system**: Staff can fill out structured evaluation forms at each stage
- **Automated scoring**: Trigger match score computation on application submit when resume extraction is wired up
- **Bulk actions**: Select multiple applications and advance/reject in batch
- **Kanban board view**: Drag-and-drop candidates between pipeline stages

### 6.2 Considered
- **Custom pipeline templates**: Allow different pipelines per position type (e.g., healthcare vs IT)
- **SLA tracking**: Alert when a candidate has been in a stage too long
- **Interview scheduling**: Calendar integration for scheduling interviews from within the pipeline
- **SMS/email notifications**: Notify candidates on stage transitions

---

## 7. Verification Checklist

- [x] Run Alembic migration `0014` against database
- [x] Rebuild platform-core: `cd packages/platform-core && npx tsc`
- [ ] Verify application detail page shows pipeline accordion
- [ ] Test Advance and Deactivate buttons create audit log entries
- [ ] Verify position detail page shows stats sidebar, flow chart, activity feed
- [ ] Verify positions table shows applicant counts and review links
- [ ] Verify dashboard pipeline shows all 12 statuses
- [x] Build both apps: `npm run build` (main site) + `cd packages/backoffice && npm run build`

---

## 8. API Documentation

### 7.1 Application Endpoints

#### `GET /api/applications`
List all applications with optional filters.

| Param | Type | Description |
|-------|------|-------------|
| `status` | `ApplicationStatus` | Filter by pipeline status |
| `search` | `string` | Search by name or email |
| `position_id` | `UUID` | Filter by position |

**Response**: `AdminApplication[]`

#### `GET /api/applications/by-email`
Get all applications for a candidate by email address.

| Param | Type | Description |
|-------|------|-------------|
| `email` | `string` | **Required.** Candidate email address |

**Response**: `AdminApplication[]` — one per position applied to, ordered by `created_at` descending.

#### `GET /api/applications/[id]`
Get a single application by ID.

**Response**: `AdminApplication`

#### `PATCH /api/applications/[id]`
Update application status or assignment. Requires `applications.update` permission.

| Body Field | Type | Description |
|------------|------|-------------|
| `status` | `ApplicationStatus` | New pipeline status |
| `assigned_to` | `UUID \| null` | Staff user to assign |

**Response**: `{ success: true }` — also creates an audit log entry.

#### `GET /api/applications/[id]/history`
Get the status change history for an application from the audit log.

**Response**:
```json
[
  {
    "status": "phone_screen",
    "changed_at": "2026-03-31T14:21:00Z",
    "changed_by_name": "Srikanth Ch."
  }
]
```

#### `GET /api/applications/[id]/notes`
List all notes for an application.

**Response**: `ApplicationNote[]` (includes `staff_user.full_name`)

#### `POST /api/applications/[id]/notes`
Add a note. Requires `applications.update` permission.

| Body Field | Type | Description |
|------------|------|-------------|
| `content` | `string` | Note text |

#### `PATCH /api/applications/[id]/notes/[noteId]`
Edit a note. Requires `applications.update` permission.

#### `DELETE /api/applications/[id]/notes/[noteId]`
Delete a note. Requires `applications.update` permission.

### 7.2 Position Endpoints

#### `GET /api/positions`
List all positions with joined client names.

**Response**: `AdminPosition[]`

#### `POST /api/positions`
Create a new position. Requires `positions.create` permission.

| Body Field | Type | Required | Description |
|------------|------|----------|-------------|
| `title` | `string` | Yes | Job title |
| `slug` | `string` | Yes | URL-friendly identifier |
| `location` | `string` | Yes | Job location |
| `type` | `string` | Yes | Full-time, Part-time, Contract, Internship |
| `work_mode` | `string` | No | On-site, Remote, Hybrid |
| `description` | `string` | No | Full job description |
| `salary_range` | `string` | No | e.g. "$60k-$80k" |
| `department` | `string` | No | Department/team |
| `client_id` | `UUID` | No | FK to clients |
| `end_client_id` | `UUID` | No | FK to end_clients |
| `active` | `boolean` | No | Default: true |
| `is_hot` | `boolean` | No | Default: false |
| `bill_rate` | `string` | No | Internal billing rate |
| `duration_hours` | `string` | No | Contract duration |

#### `GET /api/positions/[id]`
Get a single position by ID.

**Response**: `AdminPosition`

#### `PATCH /api/positions/[id]`
Update a position. Requires `positions.update` permission.
- Send `{ toggleActive: true }` to toggle active/closed status.

#### `GET /api/positions/[id]/stats`
Get applicant statistics for a position.

**Response**:
```json
{
  "totalApplicants": 17,
  "newApplicants": 2,
  "rejectedCount": 4,
  "inProgressCount": 11,
  "hiredCount": 0,
  "statusBreakdown": { "new": 2, "phone_screen": 3, ... },
  "recentCandidates": [
    { "id": "uuid", "full_name": "John", "status": "phone_screen", "status_updated_at": "...", "created_at": "..." }
  ],
  "applicantFlow": [
    { "week": "03/01", "count": 1 },
    { "week": "03/08", "count": 3 }
  ]
}
```

#### `GET /api/positions/[id]/activity`
Get the activity feed for a position (includes activity for all its applications).

**Response**: `AuditLogEntry[]` — sorted by `created_at` descending, max 30 entries.

#### `GET /api/positions/[id]/matches`
Get match scores for all candidates applied to this position.

| Param | Type | Description |
|-------|------|-------------|
| `match_type` | `"applied" \| "passive_scan" \| "manual_trigger"` | Filter by match type |
| `is_stale` | `"true" \| "false"` | Filter stale scores |
| `min_score` | `number` | Minimum overall score |

**Response**: `AdminMatchScore[]`

### 7.3 Dashboard Endpoint

#### `GET /api/dashboard`
Get dashboard metrics.

**Response**: `DashboardMetrics` — includes `applicationsByStatus` with all 12 pipeline statuses.

---

## 9. User Flows

### 8.1 New Application Flow
1. Candidate applies on public careers page via LinkedIn OAuth
2. Application created with `status = "new"`
3. Dashboard shows new application count badge
4. Positions table shows "Review new applicants ->" link
5. Staff clicks through to position detail -> sees in "Recently Active Candidates"
6. Staff clicks "View Profile" -> goes to application detail page

### 8.2 Pipeline Progression Flow
1. Staff views application detail page
2. Pipeline accordion shows current stage with green dot
3. Staff clicks **"Advance"** -> application moves to next stage
4. Audit log records: `{ action: "update_status", details: { new_status: "phone_screen" } }`
5. History shows "Moved to this step on 03/31/2026 by Staff Name"
6. Repeat until `hired` or click **"Deactivate"** -> sets to `rejected`

### 8.3 Position Overview Flow
1. Staff navigates to position detail page
2. **Stats sidebar** shows Total/New/Rejected/In Progress/Hires counts
3. **Flow chart** shows weekly application volume for last 8 weeks
4. **Recently Active Candidates** table shows last 5 candidates by activity
5. **Activity Feed** shows chronological audit log (stage changes, edits, etc.)
6. **Full applicants table** below with status filter tabs and counts

### 8.4 Qualification Matching Flow
1. When `position_requirements` and `match_scores` exist for a position:
2. Application detail sidebar shows **Matching Qualifications** card
3. Green/amber/red dots indicate dimension-level scores (Skills, Experience, etc.)
4. Overall percentage score displayed
5. Strengths and gaps listed as tags

---

## 10. Component Reference

### New Components Created

| Component | Location | Props | Purpose |
|-----------|----------|-------|---------|
| `PipelineAccordion` | `components/PipelineAccordion.tsx` | `currentStatus`, `statusHistory`, `onAdvance`, `onDeactivate`, `onManualSet`, `isDuplicate` | Vertical accordion pipeline with stage progression |
| `ApplicantFlowChart` | `components/ApplicantFlowChart.tsx` | `data: Array<{week, count}>` | CSS bar chart for weekly applicant volume |
| `ActivityFeed` | `components/ActivityFeed.tsx` | `entries: AuditEntry[]` | Timeline of audit log events with human-readable descriptions |
| `MatchingQualifications` | `components/MatchingQualifications.tsx` | `positionId` | Dimension-level match score display with strength/gap tags |

### Updated Components

| Component | Changes |
|-----------|---------|
| `StatusBadge` | 12 status colors + human-readable labels instead of raw status strings |
| `PositionsTable` | Added Applicants column, "Review new applicants" link, ACTIVE badge |
| `ApplicationsTable` | Updated filter tabs for 12 statuses with readable labels |

---

## 11. Design Decisions & Best Practices

### Pipeline Design
- **Linear stages**: The 10 progression stages are ordered, reflecting a typical staffing workflow. Applications advance one stage at a time via the "Advance" button.
- **Terminal stages**: `rejected` and `withdrawn` are non-linear — an application can be deactivated from any stage.
- **Manual override**: A "..." menu allows staff to set any status directly for edge cases (e.g., re-opening a rejected application).
- **No hard constraints**: The system allows moving between any statuses programmatically, but the UI guides the typical linear flow.

### Audit Trail
- Every status change is logged to `audit_log` with `action = "update_status"` and `details = { new_status: "..." }`.
- The pipeline accordion reads this history to show who moved the candidate and when.
- Pre-migration applications won't have history — the accordion handles this gracefully by showing just the current status.

### Performance
- Position detail page makes 4 parallel API calls (`position`, `applications`, `stats`, `activity`) via `Promise.all`.
- Stats are computed in-memory from a single `applications` query (no additional DB round-trips for counts).
- Activity feed limits to 30 entries to keep response size manageable.

### Multi-Tenancy
- All new queries include `site_id` filtering.
- New API endpoints verify authentication before returning data.
- Status history query filters by `site_id` via the audit log.
