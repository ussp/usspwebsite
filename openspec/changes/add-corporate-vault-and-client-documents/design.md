# Design: Corporate Vault and Client Documents

## Context

USSP is a subvendor under primes (Krasan today, more later). Every prime onboarding requires the same entity-level USSP corporate documents. Every client relationship also produces client-specific signed paper. The backoffice has no home for either today — the existing `partners.ts` config file only tracks a status label.

Stakeholders:
- **Admins** — own the corporate vault; upload/replace/track expiry on USSP's own corporate documents.
- **Recruiters** — need access to client-specific paperwork (MVA, NDA, Work Orders) while servicing placements; must not access corporate vault.
- **Primes (e.g., Krasan)** — request documents via email; USSP team downloads from vault and responds. No external-facing portal in v1.

## Goals / Non-Goals

**Goals:**
- Single source of truth for USSP's corporate documents.
- Version history on corporate documents — regulatory docs (BEP, COI) are replaced annually and the prior version may need audit retrieval.
- Expiry visibility that prevents surprise "oh it expired last month" moments.
- Clear separation between USSP-entity docs (vault) and client-specific paper (client record).
- Fit within existing backoffice patterns: Alembic migrations, platform-core queries, Next.js server component pages, signed-upload flow via Supabase.

**Non-Goals:**
- External-facing document-sharing portal. Primes do not log in to USSP.
- Automated notifications (email, Slack) when documents near expiry. Badges only in v1.
- E-signature / DocuSign integration. Signed docs arrive via DocuSign externally and are uploaded to the vault/client record as finished PDFs.
- Migrating the existing `partners.ts` enrollment status array. Follow-up change after the vault is proven in use.

## Decisions

### 1. Two tables, two buckets — intentional separation

**Decision:** Create `corporate_documents` and `client_documents` as separate tables with separate Supabase buckets (`corporate-vault`, `client-documents`).

**Alternatives considered:**
- *Single `documents` table with a polymorphic `owner_type` column* — rejected. The two capabilities have different RBAC (admin-only vs. admin+recruiter), different doc-type enums, different expiry semantics, and different lifecycle (vault needs version history; client docs don't). A single table conflates two distinct domains.
- *Attach corporate docs to the `sites` table as JSONB* — rejected. JSONB blobs resist version-history queries and can't hold binary file references cleanly.

**Why two tables:** Different RBAC boundaries, different schemas, different expiry rules. Cleaner queries, cleaner permission checks, cleaner UI.

### 2. Version history on corporate vault, NOT on client documents

**Decision:** `corporate_documents` supports versioning via `is_current` boolean and `superseded_by_id` self-FK. When a doc of a given `doc_type` is replaced, the prior row flips `is_current` to false and `superseded_by_id` points to the replacement. The default list query filters `is_current = true`; a "View prior versions" affordance on the detail/edit row exposes the chain.

`client_documents` does **not** support versioning. Replacing a client doc is delete-then-upload.

**Why:** Corporate docs are regulatory artifacts (BEP cert, COI) — an auditor may legitimately ask "what COI was on file when Nishant was placed in April 2026?" Client-specific paperwork is point-in-time (the MVA signed on a given date is the MVA signed on that date; a new one is a new agreement, not a version).

**Alternatives considered:**
- *Symmetric versioning on both* — rejected for complexity without benefit on the client side.
- *Separate `corporate_document_versions` child table* — considered, but soft flag + self-FK keeps queries simpler and row counts low (handful of versions per doc_type over a decade).

### 3. Expiry defaults are configured in code, not the database

**Decision:** Default expiry offsets live in a TypeScript config constant in `packages/platform-core/src/types/admin.ts`:

```ts
export const CORPORATE_DOC_TYPE_DEFAULTS: Record<CorporateDocType, { defaultExpiryDays: number | null; label: string }> = {
  w9: { defaultExpiryDays: 365, label: "W-9 Form" },
  bep_cert: { defaultExpiryDays: 365, label: "BEP Certification Letter" },
  cert_insurance: { defaultExpiryDays: 365, label: "Certificate of Insurance" },
  articles_incorporation: { defaultExpiryDays: null, label: "Articles of Incorporation" },
  cert_good_standing: { defaultExpiryDays: null, label: "Certificate of Good Standing" },
  ach_voided_check: { defaultExpiryDays: null, label: "ACH Voided Check / Bank Letter" },
  other: { defaultExpiryDays: null, label: "Other Corporate Document" },
};
```

**Why not in the database:** These are app-policy defaults, not data. Making them config-in-code means they show up in code review when changed, and we don't need a `corporate_doc_type_config` table that's read-mostly.

**Override model:** The UI pre-fills the computed expiry date at upload time; the user can edit it before saving. After save, the expiry date is editable from the document detail view.

### 4. Status is derived, not stored

**Decision:** The expiry status (on_file, expiring_soon, expired) is computed from `expiry_date` at query/render time:

- `expiry_date IS NULL` → no status badge (doc never expires)
- `expiry_date < now()` → expired (red)
- `expiry_date < now() + 30 days` → critical (red, "Expires in X days")
- `expiry_date < now() + 90 days` → warning (amber, "Expires in X days")
- otherwise → on file (green)

**Why:** One source of truth (the date). A stored status column would drift and require a cron to keep fresh.

### 5. Storage pattern reuses existing signed-upload flow

**Decision:** Reuse `packages/platform-core/src/api/upload.ts` signed-upload pattern. Each bucket gets its own `createSignedUploadUrl` helper that prefixes paths with `{site_id}/{YYYY-MM}/{uuid}-{sanitized_filename}`.

**Why:** Same pattern already in use for `resumes` and `engagement-docs` buckets. Service-client only on the server, signed URL to the browser, client POSTs the file directly to Supabase. Never funnel file bytes through the Next.js app.

### 6. MIME + size constraints

**Decision:** PDF, DOC, DOCX only. 10 MB max (current resume flow is 5 MB; docs like 20-page COI PDFs run larger).

### 7. Work Order to Assignment link

**Decision:** `client_documents.assignment_id` is a nullable FK to `assignments.id`. Only used when `doc_type = 'work_order'`. Enforced at the application layer — a CHECK constraint on the table would require a trigger and adds little value (the UI will only offer the picker when doc_type is work_order).

**Why optional FK:** Allows querying "show Work Orders for assignment X" without requiring a Work Order to be tied to an assignment (some are master-level).

### 8. Bucket creation — migration writes to `storage.buckets`

**Decision:** The Alembic migration does `INSERT INTO storage.buckets (id, name, public) VALUES ('corporate-vault', 'corporate-vault', false), ('client-documents', 'client-documents', false) ON CONFLICT DO NOTHING;`. No separate Supabase-dashboard step required.

**Trade-off:** Couples the migration to Supabase's storage schema. If we ever move off Supabase Storage, buckets would need to be replaced. Accepted — we're already committed to Supabase Storage elsewhere.

### 9. Sidebar gating

**Decision:** The Corporate Vault link is conditionally rendered in `AdminSidebar.tsx` based on `session.user.role === 'admin'`. Non-admins don't see it. The route also enforces with `requirePermission('corporate_vault.read')` server-side.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Users upload sensitive docs to wrong store (e.g., COI into client documents) | Separate UI entry points; doc_type enums differ by capability; team training + UI labels. |
| Corporate vault bucket becomes a single point of data loss | Supabase storage is replicated; we'll enable versioning on the bucket at the Supabase level (separate from our row-level version chain). |
| Expiry date drift — docs rot because no one checks the page | Accept for v1. Follow-up change: weekly digest email to admins listing items expiring within 60 days. |
| Sidebar nav growth — adding "Corporate Vault" on an already-long sidebar | Accept; it's admin-only and rarely visible. Revisit when backoffice nav becomes unwieldy. |

## Migration Plan

1. Alembic migration `0029` adds both tables and both Supabase buckets in a single transaction.
2. Deploy migration to staging; confirm buckets created; confirm tables present.
3. Ship platform-core queries + RBAC + backoffice pages in one release.
4. Manually seed initial corporate documents (upload current W-9, BEP, COI, Good Standing, Articles, Voided Check PDFs).
5. Respond to Krasan's Pragyta with docs downloaded from the vault.
6. Follow-up change (separate proposal) migrates the static `partners.ts` `enrollmentDocuments` status array to reference vault items.

**Rollback:** Alembic downgrade drops both tables; bucket drops require manual Supabase intervention (keep buckets empty on rollback; re-seed on re-apply).

## Open Questions

- None blocking. Version-pruning policy (how long to keep superseded corporate docs — forever? 7 years?) is deferred to a future change.
