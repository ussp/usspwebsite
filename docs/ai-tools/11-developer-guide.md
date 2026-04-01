# Chapter 11: Developer Guide

[Back to Table of Contents](README.md) | [Previous: Tracking & Monitoring](10-tracking-monitoring.md)

---

## Architecture Overview

The AI Transformation Monitor follows the same monorepo architecture as the USSP platform:

```
packages/
├── platform-core/          ← Shared backend (queries, types, integrations)
│   └── src/
│       ├── types/ai-tools.ts          ← All TypeScript interfaces
│       ├── queries/admin/
│       │   ├── ai-engagements.ts      ← Engagement + team + member CRUD
│       │   ├── ai-assessments.ts      ← Assessment + metrics CRUD
│       │   ├── ai-reports.ts          ← Report computation engine
│       │   └── ai-training.ts         ← Training plan generation
│       └── integrations/
│           ├── types.ts               ← Unified integration types
│           ├── jira.ts                ← Jira REST API client
│           ├── azure-devops.ts        ← Azure DevOps client
│           ├── github-metrics.ts      ← GitHub metrics client
│           └── adapter.ts            ← Multi-source normalizer
├── ai-tools/               ← Next.js app (tools.ussp.co)
│   └── src/
│       ├── app/             ← Pages and API routes
│       ├── components/      ← UI components
│       └── lib/auth.ts      ← Auth configuration
└── backoffice/              ← Existing ATS app (app.ussp.co)
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Independent tables** | All 6 `ai_*` tables only FK to `sites` and `staff_users` — can be spun off |
| **Unified metrics table** | Single `ai_metrics` with `category` + `metric_name` — extensible, simple |
| **No external chart libs** | Custom SVG RadarChart — keeps bundle small, matches codebase pattern |
| **Integration-first** | Data from Jira/ADO/GitHub, not manual entry |

## Local Development Setup

### Prerequisites
- Node.js 20+
- Access to Supabase project (env vars)
- Python 3.10+ (for Alembic migrations)

### Step 1: Install Dependencies
```bash
cd packages/ai-tools
npm install
```

### Step 2: Environment Variables
```bash
cp .env.example .env.local
# Fill in Supabase and Google OAuth credentials
```

### Step 3: Build Platform Core
```bash
cd packages/platform-core
npx tsc
```

### Step 4: Run the App
```bash
cd packages/ai-tools
npm run dev
# Opens at http://localhost:3002
```

### Step 5: Run Tests
```bash
cd packages/platform-core
npm test
# Runs 31 unit tests
```

## Database Schema

### Tables (Alembic revision 0016)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `ai_engagements` | Training engagement with client | name, client_name, status, integration_type |
| `ai_teams` | Teams within engagement | name, team_size, external_team_id |
| `ai_team_members` | Individual members with roles | display_name, role, external_user_id |
| `ai_assessments` | Measurement period (baseline/post) | assessment_type, period_start/end, data_source |
| `ai_metrics` | Unified metrics storage | category, metric_name, metric_value, member_id |
| `ai_training_plans` | Role-based training recommendations | role, recommended_tools, recommended_training |

### Multi-Tenancy
All tables include `site_id` FK to `sites.id`. Queries filter by `getSiteId()`.

### Running Migrations
```bash
cd /path/to/project
alembic upgrade head
```

## Adding a New Metric

1. Add the metric definition to `METRIC_CATALOG` in `packages/platform-core/src/types/ai-tools.ts`
2. The metric is automatically available in assessments and reports — no schema change needed
3. The unified `ai_metrics` table stores any metric with `category` + `metric_name`

## Adding a New Integration

1. Create client file in `packages/platform-core/src/integrations/` (e.g., `linear.ts`)
2. Implement `testConnection()` and `fetchData()` functions
3. Return data in `NormalizedSprint` / `NormalizedIssue` format
4. Register in `adapter.ts` `fetchIntegrationData()` switch
5. Add export to `packages/platform-core/package.json` exports map

## Testing

### Unit Tests
```bash
cd packages/platform-core
npm test                    # Run all tests
npx vitest run --reporter verbose  # Verbose output
npx vitest --watch          # Watch mode
```

### Test Coverage
- `ai-reports.test.ts` — 21 tests for computation logic
- `integrations/adapter.test.ts` — 10 tests for data normalization

### What to Test
- All computation functions (pure functions, easy to test)
- Integration adapter normalization
- Edge cases: zero baseline, missing data, negative improvement

## Code Style

- Follow existing platform-core patterns
- Use `getServiceClient()` for Supabase queries
- Use `getSiteId()` for multi-tenant filtering
- Return `{ success, data?, error? }` from mutations
- Use `export const dynamic = "force-dynamic"` on all server component pages

---

[Next: API Reference →](12-api-reference.md)
