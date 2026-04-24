"use client";

import { useEffect, useState, useCallback } from "react";
import type { ClientDocument } from "@ussp-platform/core";
import { CLIENT_DOC_TYPE_DEFAULTS } from "@ussp-platform/core";
import ExpiryBadge from "./ExpiryBadge";
import UploadClientDocDialog from "./UploadClientDocDialog";

interface Props {
  clientId: string;
}

export default function ClientDocumentsCard({ clientId }: Props) {
  const [docs, setDocs] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/clients/${clientId}/documents`);
    if (res.ok) {
      const json = await res.json();
      setDocs(json.data || []);
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(docId: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/clients/${clientId}/documents/${docId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDocs(docs.filter((d) => d.id !== docId));
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Delete failed");
    }
  }

  return (
    <div className="bg-white rounded-lg border border-light-gray p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Documents</h2>
          <p className="text-xs text-dark/50 mt-0.5">
            Client-specific signed paperwork (MVA, NDA, Work Orders, etc.)
          </p>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-dark"
        >
          + Upload
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-dark/50">Loading...</p>
      ) : docs.length === 0 ? (
        <div className="rounded border border-dashed border-light-gray p-6 text-center">
          <p className="text-sm text-dark/60">
            No documents uploaded yet.
          </p>
          <button
            onClick={() => setUploadOpen(true)}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Upload the first document
          </button>
        </div>
      ) : (
        <div className="overflow-hidden border border-light-gray rounded">
          <table className="w-full text-sm">
            <thead className="bg-light-gray/40">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Type</th>
                <th className="text-left px-3 py-2 font-medium">Name</th>
                <th className="text-left px-3 py-2 font-medium">Effective</th>
                <th className="text-left px-3 py-2 font-medium">Expiry</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
                <th className="text-right px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id} className="border-t border-light-gray">
                  <td className="px-3 py-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-light-gray/60">
                      {CLIENT_DOC_TYPE_DEFAULTS[doc.doc_type].label}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium">{doc.display_name}</td>
                  <td className="px-3 py-2 text-dark/60">
                    {doc.effective_date || <span className="text-dark/30">—</span>}
                  </td>
                  <td className="px-3 py-2 text-dark/60">
                    {doc.expiry_date || <span className="text-dark/30">—</span>}
                  </td>
                  <td className="px-3 py-2">
                    <ExpiryBadge expiryDate={doc.expiry_date} />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <a
                      href={`/api/clients/${clientId}/documents/${doc.id}/download`}
                      className="text-primary hover:underline text-xs mr-3"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id, doc.display_name)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {uploadOpen && (
        <UploadClientDocDialog
          clientId={clientId}
          onClose={() => setUploadOpen(false)}
          onUploaded={() => load()}
        />
      )}
    </div>
  );
}
