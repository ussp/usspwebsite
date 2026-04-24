/**
 * Unit tests for corporate vault + client documents — pure logic only
 * (expiry derivation, RBAC protected-resource behavior, upload validation).
 *
 * Supabase-mocked integration tests for query modules deferred to a
 * follow-up pass; these tests cover the logic that has no I/O.
 */

import { describe, it, expect } from "vitest";
import {
  CORPORATE_DOC_TYPES,
  CORPORATE_DOC_TYPE_DEFAULTS,
  CLIENT_DOC_TYPES,
  CLIENT_DOC_TYPE_DEFAULTS,
  deriveExpiryStatus,
} from "../types/admin.js";
import { hasPermission } from "../auth/rbac.js";
import { validateUpload as validateCorporateUpload } from "../queries/admin/corporate-documents.js";
import { validateUpload as validateClientUpload } from "../queries/admin/client-documents.js";

// =============================================================================
// Doc type registries
// =============================================================================

describe("Corporate doc types", () => {
  it("has the 7 standard types", () => {
    expect(CORPORATE_DOC_TYPES.length).toBe(7);
    expect(CORPORATE_DOC_TYPES).toContain("w9");
    expect(CORPORATE_DOC_TYPES).toContain("articles_incorporation");
    expect(CORPORATE_DOC_TYPES).toContain("bep_cert");
    expect(CORPORATE_DOC_TYPES).toContain("cert_good_standing");
    expect(CORPORATE_DOC_TYPES).toContain("cert_insurance");
    expect(CORPORATE_DOC_TYPES).toContain("ach_voided_check");
    expect(CORPORATE_DOC_TYPES).toContain("other");
  });

  it("annual-renewal docs have 365-day default expiry", () => {
    expect(CORPORATE_DOC_TYPE_DEFAULTS.w9.defaultExpiryDays).toBe(365);
    expect(CORPORATE_DOC_TYPE_DEFAULTS.bep_cert.defaultExpiryDays).toBe(365);
    expect(CORPORATE_DOC_TYPE_DEFAULTS.cert_insurance.defaultExpiryDays).toBe(365);
  });

  it("non-expiring docs default to null", () => {
    expect(CORPORATE_DOC_TYPE_DEFAULTS.articles_incorporation.defaultExpiryDays).toBeNull();
    expect(CORPORATE_DOC_TYPE_DEFAULTS.cert_good_standing.defaultExpiryDays).toBeNull();
    expect(CORPORATE_DOC_TYPE_DEFAULTS.ach_voided_check.defaultExpiryDays).toBeNull();
    expect(CORPORATE_DOC_TYPE_DEFAULTS.other.defaultExpiryDays).toBeNull();
  });

  it("every type has a label", () => {
    for (const t of CORPORATE_DOC_TYPES) {
      expect(CORPORATE_DOC_TYPE_DEFAULTS[t].label).toBeTruthy();
    }
  });
});

describe("Client doc types", () => {
  it("has the 6 standard types", () => {
    expect(CLIENT_DOC_TYPES.length).toBe(6);
    expect(CLIENT_DOC_TYPES).toContain("mva");
    expect(CLIENT_DOC_TYPES).toContain("nda");
    expect(CLIENT_DOC_TYPES).toContain("ssa");
    expect(CLIENT_DOC_TYPES).toContain("requisition");
    expect(CLIENT_DOC_TYPES).toContain("work_order");
    expect(CLIENT_DOC_TYPES).toContain("other");
  });

  it("every type has a label", () => {
    for (const t of CLIENT_DOC_TYPES) {
      expect(CLIENT_DOC_TYPE_DEFAULTS[t].label).toBeTruthy();
    }
  });
});

// =============================================================================
// Expiry derivation
// =============================================================================

describe("deriveExpiryStatus", () => {
  const today = new Date("2026-04-24T12:00:00Z");

  it("returns 'none' when no expiry date", () => {
    expect(deriveExpiryStatus(null, today)).toBe("none");
    expect(deriveExpiryStatus(undefined, today)).toBe("none");
  });

  it("returns 'expired' when expiry is before today", () => {
    expect(deriveExpiryStatus("2026-04-23", today)).toBe("expired");
    expect(deriveExpiryStatus("2025-01-01", today)).toBe("expired");
  });

  it("returns 'expiring_soon_30' when expiry is within 30 days", () => {
    expect(deriveExpiryStatus("2026-04-25", today)).toBe("expiring_soon_30"); // 1 day
    expect(deriveExpiryStatus("2026-05-20", today)).toBe("expiring_soon_30"); // 26 days
    expect(deriveExpiryStatus("2026-05-24", today)).toBe("expiring_soon_30"); // 30 days
  });

  it("returns 'expiring_soon_90' when expiry is within 31-90 days", () => {
    expect(deriveExpiryStatus("2026-05-25", today)).toBe("expiring_soon_90"); // 31 days
    expect(deriveExpiryStatus("2026-07-23", today)).toBe("expiring_soon_90"); // 90 days
  });

  it("returns 'on_file' when expiry is beyond 90 days", () => {
    expect(deriveExpiryStatus("2026-07-24", today)).toBe("on_file"); // 91 days
    expect(deriveExpiryStatus("2027-04-24", today)).toBe("on_file"); // 365 days
  });

  it("treats same-day expiry as expiring_soon_30 (not expired)", () => {
    expect(deriveExpiryStatus("2026-04-24", today)).toBe("expiring_soon_30");
  });
});

// =============================================================================
// RBAC — protected resources
// =============================================================================

describe("RBAC protected resources", () => {
  it("admin can read corporate vault", () => {
    expect(hasPermission("admin", "corporate_vault.read")).toBe(true);
    expect(hasPermission("admin", "corporate_vault.write")).toBe(true);
  });

  it("recruiter cannot access corporate vault", () => {
    expect(hasPermission("recruiter", "corporate_vault.read")).toBe(false);
    expect(hasPermission("recruiter", "corporate_vault.write")).toBe(false);
  });

  it("viewer cannot access corporate vault (protected from *.read)", () => {
    expect(hasPermission("viewer", "corporate_vault.read")).toBe(false);
  });

  it("sales/hr_manager cannot access corporate vault", () => {
    expect(hasPermission("sales", "corporate_vault.read")).toBe(false);
    expect(hasPermission("hr_manager", "corporate_vault.read")).toBe(false);
  });

  it("admin + recruiter can access client documents", () => {
    expect(hasPermission("admin", "client_documents.read")).toBe(true);
    expect(hasPermission("admin", "client_documents.write")).toBe(true);
    expect(hasPermission("recruiter", "client_documents.read")).toBe(true);
    expect(hasPermission("recruiter", "client_documents.write")).toBe(true);
  });

  it("sales/hr_manager/viewer cannot access client documents (protected from *.read)", () => {
    expect(hasPermission("sales", "client_documents.read")).toBe(false);
    expect(hasPermission("hr_manager", "client_documents.read")).toBe(false);
    expect(hasPermission("viewer", "client_documents.read")).toBe(false);
  });

  it("existing *.read wildcard still works for non-protected resources", () => {
    expect(hasPermission("viewer", "positions.read")).toBe(true);
    expect(hasPermission("viewer", "applications.read")).toBe(true);
  });
});

// =============================================================================
// Upload validation
// =============================================================================

describe("Upload validation (corporate)", () => {
  it("accepts PDF/DOC/DOCX under 10MB", () => {
    expect(validateCorporateUpload("application/pdf", 1024 * 1024)).toBeNull();
    expect(validateCorporateUpload("application/msword", 9 * 1024 * 1024)).toBeNull();
    expect(
      validateCorporateUpload(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        10 * 1024 * 1024
      )
    ).toBeNull();
  });

  it("rejects non-PDF/DOC types", () => {
    expect(validateCorporateUpload("image/jpeg", 1024)).toContain("PDF, DOC");
    expect(validateCorporateUpload("application/zip", 1024)).toContain("PDF, DOC");
  });

  it("rejects files over 10MB", () => {
    expect(validateCorporateUpload("application/pdf", 10 * 1024 * 1024 + 1)).toContain("10 MB");
  });
});

describe("Upload validation (client)", () => {
  it("accepts PDF/DOC/DOCX under 10MB", () => {
    expect(validateClientUpload("application/pdf", 1024 * 1024)).toBeNull();
  });

  it("rejects oversized and wrong-type files", () => {
    expect(validateClientUpload("image/png", 1024)).toContain("PDF, DOC");
    expect(validateClientUpload("application/pdf", 11 * 1024 * 1024)).toContain("10 MB");
  });
});
