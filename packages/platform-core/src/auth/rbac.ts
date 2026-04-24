import type { StaffRole } from "../types/admin.js";

const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  admin: ["*"],
  recruiter: [
    "positions.*",
    "applications.*",
    "candidates.*",
    "document_requests.*",
    "client_documents.*",
    "clients.*",
    "end_clients.*",
    "contacts.read",
    "dashboard.read",
    "ai_engagements.read",
    "ai_assessments.read",
    "ai_reports.read",
  ],
  sales: [
    "contacts.*",
    "applications.read",
    "articles.*",
    "dashboard.read",
  ],
  hr_manager: [
    "applications.*",
    "document_requests.*",
    "staff.read",
    "dashboard.read",
  ],
  viewer: ["*.read"],
};

// Resources that are NOT covered by the generic `*.read` wildcard — they
// must be granted explicitly (via `resource.*` or `resource.read`). Used to
// keep sensitive resources (corporate vault, client documents) out of the
// default viewer role.
const PROTECTED_RESOURCES = new Set(["corporate_vault", "client_documents"]);

export function hasPermission(role: StaffRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  // Admin has all permissions
  if (permissions.includes("*")) return true;

  // Check exact match
  if (permissions.includes(permission)) return true;

  // Check wildcard patterns
  const [resource, action] = permission.split(".");

  // Check resource.* (e.g., "positions.*" matches "positions.create")
  if (permissions.includes(`${resource}.*`)) return true;

  // Check *.action (e.g., "*.read" matches "positions.read"),
  // but skip protected resources.
  if (!PROTECTED_RESOURCES.has(resource) && permissions.includes(`*.${action}`)) {
    return true;
  }

  return false;
}

export function requirePermission(role: StaffRole, permission: string): void {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `Permission denied: role '${role}' does not have '${permission}' permission`
    );
  }
}
