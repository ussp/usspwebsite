# Tasks

## 1. Database schema + storage buckets

- [x] 1.1 Add `CorporateDocument` SQLAlchemy model to `migrations/models.py` (fields per design.md §2, including `is_current`, `superseded_by_id` self-FK, all file metadata, `issued_date`, `expiry_date`, `uploaded_by` FK → `staff_users`).
- [x] 1.2 Add `ClientDocument` SQLAlchemy model to `migrations/models.py` (FK → `clients.id`, optional FK → `employee_assignments.id`, `doc_type`, file metadata, `effective_date`, `expiry_date`, `uploaded_by`).
- [x] 1.3 Create Alembic migration `20260424_000029_add_corporate_vault_and_client_documents.py` that creates both tables with `site_id` FK → `sites.id`, all indexes, and seeds the two Supabase buckets via `INSERT INTO storage.buckets ... ON CONFLICT DO NOTHING`.
- [ ] 1.4 Run migration locally against a fresh DB and verify both tables + buckets exist; verify FKs and cascading rules. **(Deferred to deploy time — user to run `python -m alembic upgrade head`.)**

## 2. Platform-core types + RBAC

- [x] 2.1 Add `CorporateDocType`, `ClientDocType`, `CorporateDocument`, `ClientDocument` types and related input types to `packages/platform-core/src/types/admin.ts`.
- [x] 2.2 Export `CORPORATE_DOC_TYPE_DEFAULTS` and `CLIENT_DOC_TYPE_DEFAULTS` const maps from the same file + `deriveExpiryStatus()` helper.
- [x] 2.3 Update `packages/platform-core/src/auth/rbac.ts`: add `client_documents.*` to recruiter; add `PROTECTED_RESOURCES` set to keep `corporate_vault` and `client_documents` out of the viewer `*.read` wildcard.
- [x] 2.4 Build `packages/platform-core` with `npx tsc` — no type errors.

## 3. Platform-core queries

- [x] 3.1 Create `packages/platform-core/src/queries/admin/corporate-documents.ts` with `listCurrent()`, `listAllVersionsForDocType()`, `getById()`, `create()`, `replace()` (version flip), `updateMetadata()`, `deleteDocument()`, `getUploadUrl()`, `getDownloadUrl()`.
- [x] 3.2 Create `packages/platform-core/src/queries/admin/client-documents.ts` with `listForClient()`, `listForAssignment()`, `getById()`, `create()`, `updateMetadata()`, `deleteDocument()`, `getUploadUrl()`, `getDownloadUrl()`.
- [x] 3.3 Export both modules (namespaced) and all types from `packages/platform-core/src/index.ts`.
- [x] 3.4 Vitest tests covering doc-type registries, expiry derivation, RBAC protected resources, and upload validation — 24 tests passing. (Supabase-mocked integration tests for query happy-path deferred.)

## 4. Corporate Vault API routes

- [x] 4.1 Create `/api/corporate-vault/upload-url/route.ts` (POST — signed upload URL) and `/api/corporate-vault/route.ts` (GET list, POST create — auto-flips prior current row).
- [x] 4.2 Create `/api/corporate-vault/[id]/route.ts` — GET (detail + version list), PATCH (metadata), DELETE.
- [x] 4.3 Create `/api/corporate-vault/[id]/download/route.ts` — 307 redirect to signed URL.
- [ ] 4.4 Add Vitest integration tests for each route covering RBAC (403 for non-admin) and happy path. **(Deferred.)**

## 5. Client Documents API routes

- [x] 5.1 Create `/api/clients/[id]/documents/upload-url/route.ts` (POST) and `/api/clients/[id]/documents/route.ts` (GET list, POST create).
- [x] 5.2 Create `/api/clients/[id]/documents/[docId]/route.ts` — PATCH (metadata), DELETE.
- [x] 5.3 Create `/api/clients/[id]/documents/[docId]/download/route.ts` — 307 redirect to signed URL.
- [ ] 5.4 Add Vitest integration tests for each route covering RBAC (403 for `sales` / `viewer`) and happy path. **(Deferred.)**

## 6. Corporate Vault UI

- [x] 6.1 Create `packages/backoffice/src/app/corporate-vault/page.tsx` (server component, RBAC gate) + `CorporateVaultClient.tsx` (table of current docs per doc_type with expiry badges, upload/replace/download/edit-expiry actions).
- [ ] 6.2 Dedicated `/corporate-vault/[id]/history` page. **(Deferred — versions already surfaced via GET `/api/corporate-vault/[id]` and are retrievable; UI for browsing history can ship in a follow-up.)**
- [x] 6.3 Create `packages/backoffice/src/components/ExpiryBadge.tsx` — red/amber/green badges per threshold rules.
- [x] 6.4 Create `packages/backoffice/src/components/UploadCorporateDocDialog.tsx` — signed-upload → POST → refresh flow, pre-fills expiry from doc_type defaults, auto-updates expiry when issued_date changes.
- [x] 6.5 Add "Corporate Vault" link to `AdminSidebar.tsx` as admin-only (`session.user.role === 'admin'`).

## 7. Client Documents UI

- [x] 7.1 Create `packages/backoffice/src/components/ClientDocumentsCard.tsx` — lists client docs, upload/download/delete, empty state.
- [x] 7.2 Create `packages/backoffice/src/components/UploadClientDocDialog.tsx` — doc_type dropdown + optional assignment UUID field when doc_type is `work_order`.
- [x] 7.3 Integrate `ClientDocumentsCard` into `packages/backoffice/src/app/clients/[id]/page.tsx`.
- [ ] 7.4 (Optional) Surface linked Work Orders on the assignment detail page. **(Deferred.)**

## 8. Validation + docs

- [x] 8.1 Run `openspec validate add-corporate-vault-and-client-documents --strict` — passes.
- [x] 8.2 Update `CLAUDE.md` "Quick Reference" table with rows for corporate vault and client documents operations.
- [x] 8.3 Update `~/.claude/projects/D--Code-ussp/memory/MEMORY.md` with pointer to new `corporate-vault-architecture.md` memory file.
- [ ] 8.4 Manual smoke test — **user action**: upload W-9, BEP, COI, Good Standing, Articles, Voided Check to the vault; upload Krasan MVA + NDA to the Krasan client record once those arrive via DocuSign.

## 9. Follow-up (separate change)

- [ ] 9.1 Migrate `packages/backoffice/src/lib/partners.ts` `enrollmentDocuments` status array to reference vault items by doc_type — out of scope for this change.
- [ ] 9.2 Automated expiry digest email to admins (weekly, items expiring <60 days) — out of scope for this change.
- [ ] 9.3 Supabase-mocked integration tests for query modules and API routes — covers happy path + version flip + storage cleanup.
- [ ] 9.4 Dedicated `/corporate-vault/[id]/history` browsable version history page.
