export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import CorporateVaultClient from "./CorporateVaultClient";
import { corporateDocuments } from "@ussp-platform/core";
import { CORPORATE_DOC_TYPES, CORPORATE_DOC_TYPE_DEFAULTS } from "@ussp-platform/core";
import { hasPermission } from "@ussp-platform/core/auth/rbac";
import type { StaffRole } from "@ussp-platform/core";

export const metadata = { title: "Corporate Vault" };

export default async function CorporateVaultPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = session.user as Record<string, unknown>;
  const role = (user.role as StaffRole) || "viewer";
  if (!hasPermission(role, "corporate_vault.read")) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <div className="rounded-lg border border-light-gray bg-white p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Access denied</h2>
            <p className="text-sm text-dark/60">
              The Corporate Vault is restricted to administrators.
            </p>
          </div>
        </main>
      </>
    );
  }

  const currentDocs = await corporateDocuments.listCurrent();

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <CorporateVaultClient
          initialDocs={currentDocs}
          docTypes={CORPORATE_DOC_TYPES}
          docTypeLabels={Object.fromEntries(
            CORPORATE_DOC_TYPES.map((t) => [t, CORPORATE_DOC_TYPE_DEFAULTS[t].label])
          )}
        />
      </main>
    </>
  );
}
