import type { StaffRole } from "../types/admin.js";

const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  admin: ["*"],
  recruiter: [
    "positions.*",
    "applications.*",
    "clients.*",
    "end_clients.*",
    "contacts.read",
    "dashboard.read",
  ],
  sales: [
    "contacts.*",
    "applications.read",
    "articles.*",
    "dashboard.read",
  ],
  hr_manager: [
    "applications.*",
    "staff.read",
    "dashboard.read",
  ],
  viewer: ["*.read"],
};

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

  // Check *.action (e.g., "*.read" matches "positions.read")
  if (permissions.includes(`*.${action}`)) return true;

  return false;
}

export function requirePermission(role: StaffRole, permission: string): void {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `Permission denied: role '${role}' does not have '${permission}' permission`
    );
  }
}
