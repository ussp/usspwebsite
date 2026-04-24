# Tasks

## 1. Database schema + storage buckets

- [ ] 1.1 Add `CorporateDocument` SQLAlchemy model to `migrations/models.py` (fields per design.md §2, including `is_current`, `superseded_by_id` self-FK, all file metadata, `issued_date`, `expiry_date`, `uploaded_by` FK → `staff_users`).
- [ ] 1.2 Add `ClientDocument` SQLAlchemy model to `migrations/models.py` (FK → `clients.id`, optional FK → `assignments.id`, `doc_type`, file metadata, `effective_date`, `expiry_date`, `uploaded_by`).
- [ ] 1.3 Create Alembic migration `20260424_000029_add_corporate_vault_and_client_documents.py` that creates both tables with `site_id` FK → `sites.id`, all indexes (site+doc_type, site+client_id, site+is_current), and seeds the two Supabase buckets via `INSERT INTO storage.buckets ... ON CONFLICT DO NOTHING`.
- [ ] 1.4 Run migration locally against a fresh DB and verify both tables + buckets exist; verify FKs and cascading rules.

## 2. Platform-core types + RBAC

- [ ] 2.1 Add `CorporateDocType`, `ClientDocType`, `CorporateDocument`, `ClientDocument`, `CorporateDocTypeDefaults`, `ClientDocTypeDefaults` types to `packages/platform-core/src/types/admin.ts`.
- [ ] 2.2 Export `CORPORATE_DOC_TYPE_DEFAULTS` and `CLIENT_DOC_TYPE_DEFAULTS` const maps from the same file.
- [ ] 2.3 Update `packages/platform-core/src/auth/rbac.ts`: add `"corporate_vault.*"` to the `admin` role's wildcard (already covered by `*`), and add `"client_documents.*"` to `admin` (via `*`) and `recruiter` role's explicit list.
- [ ] 2.4 Build `packages/platform-core` with `npx tsc` and confirm no type errors.

## 3. Platform-core queries

- [ ] 3.1 Create `packages/platform-core/src/queries/admin/corporate-documents.ts` with `listCurrent()`, `listAllVersionsForDocType()`, `getById()`, `create()` (signed upload URL + row insert), `replace()` (flip `is_current` on prior, create new row), `updateExpiry()`, `getDownloadUrl()`, `getDownloadUrlForVersion()`.
- [ ] 3.2 Create `packages/platform-core/src/queries/admin/client-documents.ts` with `listForClient()`, `listForAssignment()`, `getById()`, `create()`, `updateMetadata()`, `getDownloadUrl()`, `delete()` (storage remove + row delete).
- [ ] 3.3 Export both modules from `packages/platform-core/src/index.ts`.
- [ ] 3.4 Add Vitest unit tests for both query modules covering: upload happy path, oversized file rejection, wrong MIME rejection, version flip on replace, delete removes storage + row.

## 4. Corporate Vault API routes

- [ ] 4.1 Create `packages/backoffice/src/app/api/corporate-vault/route.ts` — `GET` (list current), `POST` (upload: accepts fileName/fileType/fileSize + metadata → returns signed upload URL + pre-created row id). Enforces `corporate_vault.read` / `corporate_vault.write`.
- [ ] 4.2 Create `packages/backoffice/src/app/api/corporate-vault/[id]/route.ts` — `GET` (row detail + version list), `PATCH` (update expiry_date, notes), `POST /replace` (flip + upload new).
- [ ] 4.3 Create `packages/backoffice/src/app/api/corporate-vault/[id]/download/route.ts` — returns 307 redirect to signed URL.
- [ ] 4.4 Add Vitest integration tests for each route covering RBAC (403 for non-admin) and happy path.

## 5. Client Documents API routes

- [ ] 5.1 Create `packages/backoffice/src/app/api/clients/[id]/documents/route.ts` — `GET` (list for client), `POST` (upload: signed URL + row insert). Enforces `client_documents.read` / `client_documents.write`.
- [ ] 5.2 Create `packages/backoffice/src/app/api/clients/[id]/documents/[docId]/route.ts` — `PATCH` (update metadata), `DELETE` (storage remove + row delete).
- [ ] 5.3 Create `packages/backoffice/src/app/api/clients/[id]/documents/[docId]/download/route.ts` — returns 307 redirect to signed URL.
- [ ] 5.4 Add Vitest integration tests for each route covering RBAC (403 for `sales` / `viewer`) and happy path.

## 6. Corporate Vault UI

- [ ] 6.1 Create `packages/backoffice/src/app/corporate-vault/page.tsx` — server component with `export const dynamic = "force-dynamic"`, RBAC gate, table of current docs with expiry badges, upload affordance, per-row actions (download, replace, edit expiry, view history).
- [ ] 6.2 Create `packages/backoffice/src/app/corporate-vault/[id]/history/page.tsx` — server component listing all versions for a doc_type with download per version.
- [ ] 6.3 Create a shared `ExpiryBadge` component at `packages/backoffice/src/components/ExpiryBadge.tsx` that renders red/amber/green badges per the threshold rules in design.md §4.
- [ ] 6.4 Create an `UploadCorporateDocDialog` client component that handles the signed-upload → POST → refresh flow, pre-filling expiry based on doc_type default.
- [ ] 6.5 Add "Corporate Vault" link to `packages/backoffice/src/components/AdminSidebar.tsx` inside an admin-only conditional block.

## 7. Client Documents UI

- [ ] 7.1 Create a `ClientDocumentsCard` component at `packages/backoffice/src/components/ClientDocumentsCard.tsx` — lists documents for a client, upload affordance, per-row actions (download, edit metadata, delete).
- [ ] 7.2 Create an `UploadClientDocDialog` client component handling signed-upload → POST → refresh flow, with doc_type dropdown and optional assignment picker when doc_type is `work_order`.
- [ ] 7.3 Integrate `ClientDocumentsCard` into `packages/backoffice/src/app/clients/[id]/page.tsx`.
- [ ] 7.4 (Optional in v1) Surface linked Work Orders on the assignment detail page — defer if time-boxed.

## 8. Validation + docs

- [ ] 8.1 Run `openspec validate add-corporate-vault-and-client-documents --strict` and resolve any issues.
- [ ] 8.2 Update `CLAUDE.md` "Quick Reference" table with rows for "Upload a corporate document", "View corporate vault", "Upload a client document", "Link Work Order to assignment".
- [ ] 8.3 Update `~/.claude/projects/D--Code-ussp/memory/MEMORY.md` with a pointer to a new memory file documenting vault + client-documents architecture choices.
- [ ] 8.4 Manual smoke test: upload W-9, BEP, COI, Good Standing, Articles, Voided Check to the vault; upload Krasan MVA + NDA to the Krasan client record once those arrive via DocuSign.

## 9. Follow-up (tracked here, delivered in a separate change)

- [ ] 9.1 Migrate `packages/backoffice/src/lib/partners.ts` `enrollmentDocuments` status array to reference vault items by doc_type — out of scope for this change.
- [ ] 9.2 Automated expiry digest email to admins (weekly, items expiring <60 days) — out of scope for this change.
