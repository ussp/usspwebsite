## ADDED Requirements

### Requirement: Corporate Vault Storage

The system SHALL provide a site-scoped corporate document vault that stores USSP's own entity-level documents (W-9, Articles of Incorporation, BEP Certification, Certificate of Good Standing, Certificate of Insurance, ACH voided check / bank letter, and an extensible "other" type). Each document SHALL have a doc_type, display name, description, file metadata (filename, storage path, MIME type, size), issued date, optional expiry date, uploader reference, free-text notes, and a boolean `is_current` flag.

#### Scenario: Upload a new corporate document

- **WHEN** an admin uploads a PDF, DOC, or DOCX file up to 10 MB with a doc_type, display name, and issued date
- **THEN** the file is stored in the `corporate-vault` Supabase bucket at `{site_id}/{YYYY-MM}/{uuid}-{filename}`
- **AND** a `corporate_documents` row is written with `is_current = true`, `uploaded_by` set to the current staff user, and expiry_date defaulted per the doc_type policy (365 days for w9/bep_cert/cert_insurance, null otherwise)
- **AND** the user can override the defaulted expiry date before saving

#### Scenario: Reject disallowed file types or oversized files

- **WHEN** an admin attempts to upload a file whose MIME type is not PDF, DOC, or DOCX, or whose size exceeds 10 MB
- **THEN** the upload is rejected with a 400 response and an explanatory error message
- **AND** no storage object or database row is created

#### Scenario: List corporate documents shows only current versions by default

- **WHEN** an admin opens `/corporate-vault`
- **THEN** the table lists one row per doc_type where `is_current = true`, ordered by doc_type
- **AND** superseded prior versions are not shown unless the admin opens the history view for a given row

### Requirement: Corporate Document Version History

The system SHALL preserve prior versions when a corporate document is replaced. Replacement SHALL flip the prior row's `is_current` to false and set its `superseded_by_id` FK to the new row. Prior versions SHALL remain downloadable for audit purposes.

#### Scenario: Replace an existing document creates a new version

- **WHEN** an admin uploads a replacement for an existing `bep_cert` document
- **THEN** a new `corporate_documents` row is created with `is_current = true`
- **AND** the prior row is updated to `is_current = false` and `superseded_by_id` pointing to the new row
- **AND** both rows remain in the database and their files remain in storage

#### Scenario: Viewing version history for a doc_type

- **WHEN** an admin clicks "Version history" on a corporate document row
- **THEN** the UI lists all rows of that doc_type (current + superseded), sorted by `created_at` descending
- **AND** each prior version exposes a "Download" action that returns a signed URL for the archived file

### Requirement: Corporate Document Expiry Display

The system SHALL compute and display expiry status at render time based on `expiry_date`. The computed status SHALL NOT be persisted to the database.

#### Scenario: Document with no expiry date

- **WHEN** a corporate document has `expiry_date = NULL`
- **THEN** the UI shows no expiry badge and no expiry date
- **AND** the document is never flagged as expiring

#### Scenario: Document expiring within 30 days

- **WHEN** a corporate document's `expiry_date` is between today and today + 30 days (inclusive)
- **THEN** the UI shows a red "Expires in N days" badge where N is the day count

#### Scenario: Document expiring within 90 days

- **WHEN** a corporate document's `expiry_date` is between today + 31 days and today + 90 days (inclusive)
- **THEN** the UI shows an amber "Expires in N days" badge where N is the day count

#### Scenario: Expired document

- **WHEN** a corporate document's `expiry_date` is before today
- **THEN** the UI shows a red "Expired" badge with the expiry date

#### Scenario: Admin edits expiry date after upload

- **WHEN** an admin edits the expiry_date field on a current corporate document
- **THEN** the database row is updated with the new date
- **AND** the rendered status badge recomputes on the next page load

### Requirement: Corporate Vault RBAC

The system SHALL restrict all corporate vault operations to staff users with the `corporate_vault.*` permission. Only the `admin` role SHALL hold this permission.

#### Scenario: Non-admin user attempts to access the Corporate Vault page

- **WHEN** a staff user with role `recruiter`, `sales`, `hr_manager`, or `viewer` navigates to `/corporate-vault`
- **THEN** the server returns a 403 Forbidden response
- **AND** the "Corporate Vault" link is hidden from their sidebar

#### Scenario: Non-admin user hits a Corporate Vault API route

- **WHEN** a non-admin staff user sends any request to `/api/corporate-vault/*`
- **THEN** the API returns a 403 response with an error body
- **AND** no database read or storage operation is performed

### Requirement: Corporate Document Download

The system SHALL provide authenticated downloads of any corporate document (current or superseded) via a short-lived signed URL generated by the service client.

#### Scenario: Admin downloads a current corporate document

- **WHEN** an admin clicks "Download" on a current corporate document
- **THEN** the server generates a signed URL for the file with a TTL of 60 seconds
- **AND** the client is redirected to the signed URL
- **AND** the download action is recorded in the application server log (for audit)

#### Scenario: Admin downloads a superseded corporate document

- **WHEN** an admin opens the version history for a doc_type and clicks "Download" on a prior version
- **THEN** the same signed-URL flow applies as for current versions
- **AND** the file at the superseded row's `storage_path` is returned
