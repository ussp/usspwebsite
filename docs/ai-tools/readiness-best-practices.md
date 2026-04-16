# AI Readiness Assessment — Development Best Practices

> Standards for building, testing, documenting, and maintaining the readiness assessment module.

---

## 1. InfoTips & Contextual Help

Every form field and section heading that could confuse a user MUST have an `<InfoTip>` tooltip.

### When to Add InfoTips

| Location | Required? | Example |
|----------|-----------|---------|
| Form field labels | Yes, for non-obvious fields | "Entity Type" needs one; "Company Name" is optional |
| Section headings | Yes, for scored/computed sections | "Capability Scores", "Role-Based Perception" |
| Action buttons | If the action has side effects | "Send All" should explain what happens |
| Report metrics | Yes, for any computed value | Tier badge, blocker threshold |
| Respondent-facing pages | Yes, for flags and scale anchors | "Flag as unclear" / "Not applicable" |

### InfoTip Writing Rules

1. **Under 40 words.** If you need more, use a `GuideBanner` instead.
2. **Explain "why" not "what."** "Determines which regulations apply" > "Select the entity type"
3. **Mention consequences.** "Not having one is flagged as a blocker in the report"
4. **No jargon.** Write for someone who hasn't read the docs.

### Component Usage

```tsx
import InfoTip from "@/components/InfoTip";

<label>
  Entity Type *
  <InfoTip text="Determines which AI regulations and compliance requirements apply." />
</label>
```

---

## 2. Question Bank Versioning

The question bank is a living system. These rules prevent data corruption and ensure historical accuracy.

### Version Rules

| Rule | Enforcement |
|------|------------|
| **Never edit question text in place** | Editing creates version N+1; old version is deprecated |
| **Pin versions in questionnaires** | `questionnaire_questions.question_version` stores the version used |
| **Reports show pinned version** | Historical reports always display the original wording |
| **Deprecation is reversible** | Admins can reactivate deprecated questions |
| **Global defaults are site_id = null** | Tenant-specific questions use the tenant's site_id |

### Adding New Questions

1. Use the Question Bank admin UI or the seed script
2. Tag with: `category`, `capability`, `roles[]`, `entity_types[]`
3. Empty `roles[]` = universal (all team members)
4. Empty `entity_types[]` = applies to all entity types
5. Set `sort_order` to control display order within a category

### Revising Questions

1. Admin opens question in the bank
2. Edits the text
3. System creates new version (N+1) with status "active"
4. Old version set to "deprecated"
5. Full diff visible in version history

### Unmapped Roles

When a member has role "other" with a custom label and no matching questions:
1. System assigns only universal questions
2. A `question_development_requests` record is created (status: pending)
3. Admin sees pending count in Question Bank UI
4. Admin creates questions tagged to that role label
5. Request status updated to "completed"
6. Future assessments auto-include the new questions

---

## 3. Unit Testing Standards

Unit tests are **mandatory** for all readiness workflow logic. No PR should be merged without passing tests.

### What to Test

| Layer | What | Coverage |
|-------|------|----------|
| **Constants** | Role taxonomy completeness, tier ranges, policy areas | Every constant array/record must be validated |
| **Selection logic** | Question filtering by role, entity type, status | All filter combinations including edge cases |
| **Aggregation** | Score computation, tier assignment, blocker detection | Include: zero scores, N/A flags, single response, many responses |
| **Versioning** | Version increment, deprecation, history chain | New version number, old status change |
| **Feedback** | Threshold computation, needs_review flag | Boundary conditions: exactly 25%, below 10 responses |
| **Deltas** | Re-assessment comparison | Positive, negative, zero delta |
| **Gaps** | Policy gap detection | No policy, partial coverage, full coverage |

### Test File Location

```
packages/platform-core/src/__tests__/readiness-workflow.test.ts
```

### Running Tests

```bash
cd packages/platform-core
npx vitest run src/__tests__/readiness-workflow.test.ts
```

### Test Writing Rules

1. **Test pure logic, not Supabase calls.** Extract computation into pure functions; test those.
2. **Cover edge cases.** Zero values, empty arrays, null scores, all-N/A responses.
3. **Use descriptive names.** `"excludes not_applicable flagged answers from scoring"` > `"test flag"`
4. **Group by feature.** Use `describe()` blocks: "Readiness tier assignment", "Question selection logic", etc.
5. **Minimum 1 test per requirement.** Each spec requirement should have at least one test validating its behavior.

### Current Test Count: 59 tests

---

## 4. Documentation Standards

### Required Documents

| Document | Location | Audience | When to Update |
|----------|----------|----------|---------------|
| **Usage Guide** | `docs/ai-tools/readiness-assessment-guide.md` | USSP consultants | Any workflow change |
| **Best Practices** | `docs/ai-tools/readiness-best-practices.md` | Developers | Any code pattern change |
| **OpenSpec Proposal** | `openspec/changes/add-readiness-workflow/` | Review team | Before implementation |
| **Seed Script** | `scripts/seed-question-bank.ts` | DevOps | When default questions change |

### Usage Guide Rules

1. **Step-by-step with screenshots** when UI changes significantly
2. **Tables for field definitions** — field, required?, purpose
3. **"Tip" callouts** for non-obvious behaviors
4. **Environment setup section** with all required env vars
5. **Database table reference** for debugging

### Publishing

Documentation must be:
1. Committed to the repo (not external wiki)
2. Referenced in the main `CLAUDE.md` file map
3. Updated when features change (part of the PR checklist)
4. Reviewed by at least one person who didn't write it

---

## 5. Code Standards for Readiness Module

### File Organization

```
packages/platform-core/src/
  types/ai-tools.ts          # All readiness types, constants, enums
  queries/admin/readiness*.ts # Admin query modules (auth required)
  queries/readiness-*.ts      # Public query modules (token-based)
  __tests__/readiness-*.ts    # Unit tests

packages/ai-tools/src/
  app/readiness/              # UI pages (step workflow)
  app/api/readiness/          # API routes
  components/InfoTip.tsx      # Tooltip component
  components/ReadinessSteps.tsx # Step indicator
  lib/email.ts                # Email templates
```

### API Route Standards

1. Every route checks `auth()` (except public `/respond/[token]`)
2. Every protected route checks `hasPermission(role, action)`
3. Standard response format: direct JSON, error with `{ error: string }`
4. Use platform-core query functions — no raw Supabase calls in routes

### Component Standards

1. Use `InfoTip` for field-level help
2. Use `GuideBanner` for page-level help
3. Use `ReadinessSteps` on every step page
4. Client components start with `"use client"`
5. Server components use `export const dynamic = "force-dynamic"`

### Multi-Tenant

1. All tables have `site_id` column
2. All queries filter by `site_id`
3. Question bank supports global (site_id = null) and tenant-specific questions
4. Development requests are site-scoped

---

## 6. Checklist: Before Merging a Readiness PR

- [ ] Unit tests pass (`npx vitest run src/__tests__/readiness-workflow.test.ts`)
- [ ] Platform-core compiles (`cd packages/platform-core && npx tsc`)
- [ ] AI-tools app compiles (`cd packages/ai-tools && npx tsc --noEmit`)
- [ ] New fields have InfoTips
- [ ] New API routes have auth checks
- [ ] New tables have site_id + index
- [ ] Usage guide updated if workflow changed
- [ ] Question bank seed script updated if default questions changed
- [ ] OpenSpec tasks.md reflects completed work
