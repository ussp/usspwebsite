# Change: Add Corporate Vault and Client Documents

## Why

USSP's subvendor onboarding with primes (Krasan today, others tomorrow) repeatedly asks for the same set of corporate documents: W-9, Articles of Incorporation, BEP Certification Letter, Certificate of Good Standing, Certificate of Insurance, and a voided check / ACH bank letter. Today the portal at `packages/backoffice/src/lib/partners.ts` only tracks a static status label (`"on_file"`) — **no actual files are stored, no version history, no expiry tracking.** Each time Krasan (or any prime) re-requests (BEP and COI renew annually), the team hunts through email and local drives to find the latest version.

Separately, each client relationship produces its own signed paperwork (Master Vendor Agreement, NDA, Subcontractor Services Agreement, Requisition Process, Work Orders) that today also has no home in the backoffice.

This change introduces two clearly-separated stores:

1. **Corporate Vault** — USSP's own entity-level docs. Upload once, reuse across every prime.
2. **Client Documents** — per-client signed paperwork, attached to the existing `clients` record.

Trigger: Krasan Partner Operations Lead Pragyta Sharan's April 2026 onboarding request for Nishant's placement. The same request will recur for every future prime.

## What Changes

### Corporate Vault (new capability)

- **New page** `/corporate-vault` in backoffice — table of corporate documents with upload, replace, download, expiry management.
- **Six seeded doc types** + extensible "other": `w9`, `articles_incorporation`, `bep_cert`, `cert_good_standing`, `cert_insurance`, `ach_voided_check`, `other`.
- **Version history** — replacing a document retains the prior version (soft version chain via `is_current` flag + `superseded_by_id`). Admin can view/download any prior version.
- **Editable expiry dates** with sensible per-type defaults at upload:
  - `bep_cert`: issued_date + 365 days
  - `cert_insurance`: issued_date + 365 days
  - `w9`: issued_date + 365 days (convention, not legal)
  - `articles_incorporation`, `cert_good_standing`, `ach_voided_check`, `other`: null (no expiry by default)
  - **All defaults are user-editable at upload time and any time after.**
- **Expiry warnings** — amber badge when expiry is <90 days, red when <30 days, gray when expired.
- **RBAC** — new permission `corporate_vault.*`, admin-only.
- **Storage** — new Supabase bucket `corporate-vault` (private), PDF/DOC/DOCX only, 10 MB max.
- **Sidebar** — new "Corporate Vault" entry, visible only to admins.

### Client Documents (new capability)

- **New "Documents" card** on existing `/clients/[id]` page — upload, list, download, delete.
- **Six seeded doc types** + extensible "other": `mva`, `nda`, `ssa`, `requisition`, `work_order`, `other`.
- **Optional assignment link** — Work Orders may link to a specific `assignments.id` (nullable FK), so a recruiter viewing an assignment can surface the associated Work Order.
- **Effective and expiry dates** — both user-editable, both nullable.
- **RBAC** — new permission `client_documents.*`, admin + recruiter.
- **Storage** — new Supabase bucket `client-documents` (private), PDF/DOC/DOCX only, 10 MB max.
- No version history for this capability (client-specific paperwork is typically point-in-time; replacing means deleting and re-uploading).

## Impact

- **Affected specs:** `corporate-vault` (new), `client-documents` (new).
- **Affected code:**
  - `migrations/models.py` — add `CorporateDocument` and `ClientDocument` SQLAlchemy models.
  - `migrations/versions/20260424_000029_add_corporate_vault_and_client_documents.py` — new tables + Supabase bucket seeds.
  - `packages/platform-core/src/types/admin.ts` — add `CorporateDocument`, `ClientDocument`, `CorporateDocType`, `ClientDocType` types.
  - `packages/platform-core/src/auth/rbac.ts` — add `corporate_vault.*` (admin) and `client_documents.*` (admin + recruiter).
  - `packages/platform-core/src/queries/admin/corporate-documents.ts` — new.
  - `packages/platform-core/src/queries/admin/client-documents.ts` — new.
  - `packages/platform-core/src/index.ts` — export new query modules and types.
  - `packages/backoffice/src/app/corporate-vault/page.tsx` — new admin-only page.
  - `packages/backoffice/src/app/api/corporate-vault/route.ts` + `[id]/route.ts` + `[id]/download/route.ts` — new API routes.
  - `packages/backoffice/src/app/api/clients/[id]/documents/route.ts` + `[docId]/route.ts` + `[docId]/download/route.ts` — new API routes.
  - `packages/backoffice/src/app/clients/[id]/page.tsx` — add Documents card.
  - `packages/backoffice/src/components/AdminSidebar.tsx` — add "Corporate Vault" link (admin gated).

- **Out of scope (explicit non-goals):**
  - Email sharing / signed URL delivery — team downloads and sends manually.
  - Automated expiry notifications (Slack, email) — only visual badges in v1.
  - Migration of the existing `enrollmentDocuments` status array in `partners.ts` to the new Vault — follow-up change.
  - OCR / metadata extraction from uploaded PDFs.
