# Chapter 12: API Reference

[Back to Table of Contents](README.md) | [Previous: Developer Guide](11-developer-guide.md)

---

All endpoints require authentication (Google OAuth via NextAuth). Include the session cookie in requests.

## Engagements

### `GET /api/engagements`
List all engagements.

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status (draft, baseline, training, post_assessment, completed, archived) |
| `search` | string | Search by name (case-insensitive) |

**Response**: `AIEngagement[]`

### `POST /api/engagements`
Create a new engagement. Requires `ai_engagements.create` permission.

| Body Field | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Engagement name |
| `client_name` | string | Yes | Client organization |
| `integration_type` | string | No | jira, azure_devops, github, gitlab, linear, manual |
| `integration_config` | object | No | Connection details |
| `notes` | string | No | Internal notes |

**Response**: `AIEngagement` (201)

### `GET /api/engagements/[id]`
Get engagement detail with teams, members, and assessment status.

**Response**: `EngagementDetail`

### `PATCH /api/engagements/[id]`
Update engagement. Requires `ai_engagements.update`.

### `DELETE /api/engagements/[id]`
Archive engagement (soft delete). Requires `ai_engagements.delete`.

---

## Teams

### `GET /api/teams?engagement_id=X`
List teams for an engagement.

### `POST /api/teams`
Add a team. Requires `ai_engagements.update`.

| Body Field | Type | Required |
|-----------|------|----------|
| `engagement_id` | string | Yes |
| `name` | string | Yes |
| `team_size` | number | Yes |
| `external_team_id` | string | No |

### `GET /api/teams/[id]/members`
List team members.

### `POST /api/teams/[id]/members`
Add a team member.

| Body Field | Type | Required |
|-----------|------|----------|
| `display_name` | string | Yes |
| `role` | string | Yes (developer, qa, scrum_master, product_owner, devops, designer) |
| `external_user_id` | string | No |

---

## Assessments

### `GET /api/assessments?team_id=X`
List assessments for a team.

### `POST /api/assessments`
Create an assessment.

| Body Field | Type | Required |
|-----------|------|----------|
| `team_id` | string | Yes |
| `assessment_type` | string | Yes (baseline, post_training) |
| `period_start` | string (ISO date) | Yes |
| `period_end` | string (ISO date) | Yes |
| `sprint_count` | number | No |
| `data_source` | string | No (integration, manual) |

### `GET /api/assessments/[id]/metrics`
Get all metrics for an assessment.

**Response**: `AIMetric[]`

### `POST /api/assessments/[id]/metrics`
Batch upsert metrics (replaces existing for this assessment).

```json
{
  "metrics": [
    {
      "category": "scrum",
      "metric_name": "velocity",
      "metric_value": 42,
      "metric_unit": "story_points"
    }
  ]
}
```

### `POST /api/assessments/[id]/survey`
Submit SPACE/DevEx survey responses.

```json
{
  "responses": [
    {
      "member_id": "uuid",
      "metrics": [
        { "category": "space", "metric_name": "satisfaction", "metric_value": 4, "metric_unit": "score_1_5" },
        { "category": "devex", "metric_name": "flow_state", "metric_value": 3, "metric_unit": "score_1_5" }
      ]
    }
  ]
}
```

---

## Training Plans

### `GET /api/training-plans?team_id=X`
List training plans for a team.

### `POST /api/training-plans/generate`
Auto-generate training plans for all team members.

```json
{ "team_id": "uuid" }
```

**Response**: `AITrainingPlan[]`

---

## Reports

### `GET /api/reports/[teamId]`
Generate and return transformation report for a team.

Requires both baseline and post-training assessments to be present.

**Response**: `TransformationReport`

```json
{
  "team_id": "uuid",
  "team_name": "Platform Team",
  "engagement_name": "Acme Corp Q2 2026",
  "client_name": "Acme Corporation",
  "baseline_period": { "start": "2026-01-06", "end": "2026-03-28", "sprint_count": 6 },
  "post_period": { "start": "2026-05-19", "end": "2026-07-25", "sprint_count": 5 },
  "categories": [
    {
      "category": "dora",
      "deltas": [
        { "metric_name": "deployment_frequency", "label": "Deployment Frequency", "baseline_value": 2, "post_value": 5, "improvement_pct": 150, "direction": "higher_better", "unit": "per_week" }
      ],
      "avg_improvement_pct": 47.8
    }
  ],
  "overall_improvement_pct": 37.2,
  "benchmark_context": "Consistent with McKinsey (20-45%) and Harvard/BCG (25% faster, 40% higher quality) research findings.",
  "benchmarks": [...],
  "computed_at": "2026-07-26T10:30:00Z"
}
```

## Tenant Management (Owner Admin Only)

These endpoints are restricted to superadmin users on the owner site.

### `GET /api/admin/tenants`
List all tenants with user counts and entitlement stats.

**Response**: `Tenant[]` with `user_count` and `enabled_tools_count` fields.

### `POST /api/admin/tenants`
Create a new tenant.

| Body Field | Type | Required | Description |
|-----------|------|----------|-------------|
| `site_id` | string | Yes | Unique tenant identifier (e.g., `acme`) |
| `name` | string | Yes | Display name |
| `domain` | string | No | Allowed email domain |
| `auth_provider` | string | No | `google` or `microsoft` (default: `google`) |

**Response**: `Tenant` (201)

### `GET /api/admin/tenants/:siteId`
Get tenant details including configuration and stats.

**Response**: `TenantDetail`

### `PATCH /api/admin/tenants/:siteId`
Update tenant configuration (name, domain, auth provider, active status).

### `GET /api/admin/tenants/:siteId/entitlements`
Get tool entitlements for a tenant.

**Response**: `ToolEntitlement[]` — each with `toolKey`, `enabled`, `enabled_at`.

### `PUT /api/admin/tenants/:siteId/entitlements`
Bulk update tool entitlements.

```json
{
  "entitlements": [
    { "toolKey": "ai_transformation", "enabled": true },
    { "toolKey": "quality_scan", "enabled": false }
  ]
}
```

### `GET /api/admin/tenants/:siteId/users`
List users for a tenant.

**Response**: `StaffUser[]`

### `POST /api/admin/tenants/:siteId/users`
Add a user to a tenant.

| Body Field | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | User email |
| `name` | string | Yes | Display name |
| `role` | string | No | Role (default: `viewer`) |

**Response**: `StaffUser` (201)

### `PATCH /api/admin/tenants/:siteId/users/:userId`
Update a tenant user (role, active status).

### `DELETE /api/admin/tenants/:siteId/users/:userId`
Remove a user from a tenant.

---

## Current Tenant

These endpoints return information scoped to the current session's tenant.

### `GET /api/entitlements`
Get enabled tools for the current session.

**Response**:
```json
{
  "tools": ["ai_transformation", "quality_scan"],
  "site_id": "acme"
}
```

### `GET /api/tenant`
Get current tenant branding info.

**Response**:
```json
{
  "site_id": "acme",
  "name": "Acme Corporation",
  "auth_provider": "microsoft",
  "logo_url": null,
  "theme": null
}
```

---

[Next: Troubleshooting & FAQ →](13-troubleshooting-faq.md)
