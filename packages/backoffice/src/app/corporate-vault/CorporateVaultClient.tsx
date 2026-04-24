"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CorporateDocType, CorporateDocument } from "@ussp-platform/core";
import ExpiryBadge from "@/components/ExpiryBadge";
import UploadCorporateDocDialog from "@/components/UploadCorporateDocDialog";

interface Props {
  initialDocs: CorporateDocument[];
  docTypes: CorporateDocType[];
  docTypeLabels: Record<string, string>;
}

export default function CorporateVaultClient({
  initialDocs,
  docTypes,
  docTypeLabels,
}: Props) {
  const router = useRouter();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<CorporateDocType | undefined>();

  // Index current docs by doc_type
  const byType = new Map<string, CorporateDocument>();
  for (const d of initialDocs) byType.set(d.doc_type, d);

  function openUploadFor(t?: CorporateDocType) {
    setUploadDocType(t);
    setUploadOpen(true);
  }

  async function handleEditExpiry(docId: string, currentExpiry: string | null) {
    const input = window.prompt(
      "New expiry date (YYYY-MM-DD), or blank to clear:",
      currentExpiry || ""
    );
    if (input === null) return;
    const body = { expiry_date: input.trim() || null };
    const res = await fetch(`/api/corporate-vault/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Update failed");
      return;
    }
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Corporate Vault</h1>
          <p className="text-sm text-dark/60 mt-0.5">
            USSP's own corporate documents. Upload once, reuse across every prime.
          </p>
        </div>
        <button
          onClick={() => openUploadFor(undefined)}
          className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-dark"
        >
          + Upload Document
        </button>
      </div>

      <div className="rounded-lg border border-light-gray bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-light-gray/40">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">Document type</th>
              <th className="text-left px-4 py-2.5 font-medium">Display name</th>
              <th className="text-left px-4 py-2.5 font-medium">Issued</th>
              <th className="text-left px-4 py-2.5 font-medium">Expiry</th>
              <th className="text-left px-4 py-2.5 font-medium">Status</th>
              <th className="text-right px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {docTypes.map((docType) => {
              const doc = byType.get(docType);
              return (
                <tr key={docType} className="border-t border-light-gray">
                  <td className="px-4 py-3 font-medium">{docTypeLabels[docType]}</td>
                  <td className="px-4 py-3 text-dark/80">
                    {doc?.display_name || <span className="text-dark/40">—</span>}
                  </td>
                  <td className="px-4 py-3 text-dark/60">
                    {doc?.issued_date || <span className="text-dark/30">—</span>}
                  </td>
                  <td className="px-4 py-3 text-dark/60">
                    {doc?.expiry_date || <span className="text-dark/30">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {doc ? (
                      <ExpiryBadge expiryDate={doc.expiry_date} />
                    ) : (
                      <span className="text-xs text-dark/40">Not uploaded</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {doc ? (
                      <div className="inline-flex gap-2">
                        <a
                          href={`/api/corporate-vault/${doc.id}/download`}
                          className="text-primary hover:underline text-xs"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => handleEditExpiry(doc.id, doc.expiry_date)}
                          className="text-dark/60 hover:underline text-xs"
                        >
                          Edit expiry
                        </button>
                        <button
                          onClick={() => openUploadFor(docType)}
                          className="text-dark/60 hover:underline text-xs"
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openUploadFor(docType)}
                        className="text-primary hover:underline text-xs"
                      >
                        Upload
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-dark/50 mt-4">
        Version history: replacing a document retains the prior version for audit.
        Only current versions are shown here.
      </p>

      {uploadOpen && (
        <UploadCorporateDocDialog
          initialDocType={uploadDocType}
          onClose={() => setUploadOpen(false)}
        />
      )}
    </>
  );
}
