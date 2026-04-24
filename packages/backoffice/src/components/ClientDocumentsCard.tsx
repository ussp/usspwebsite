"use client";

import { useEffect, useState, useCallback } from "react";
import type { ClientDocument, AssignmentSummaryForDoc } from "@ussp-platform/core";
import { CLIENT_DOC_TYPE_DEFAULTS, deriveExpiryStatus } from "@ussp-platform/core";
import ExpiryBadge from "./ExpiryBadge";
import UploadClientDocDialog from "./UploadClientDocDialog";

interface Props {
  clientId: string;
}

const TYPE_LABELS: Record<string, string> = {
  internal_employee: "W-2 Employee",
  external: "1099 / External",
  vendor: "Corp-to-Corp",
};

function endDateBadge(endDate: string | null): { text: string; cls: string } | null {
  if (!endDate) return null;
  const status = deriveExpiryStatus(endDate);
  if (status === "none") return null;
  const base = "text-xs px-2 py-0.5 rounded-full font-medium";
  if (status === "expired") return { text: `Ended ${endDate}`, cls: `${base} bg-gray-100 text-gray-600` };
  if (status === "expiring_soon_30") return { text: `Ends ${endDate}`, cls: `${base} bg-red-100 text-red-700` };
  if (status === "expiring_soon_90") return { text: `Ends ${endDate}`, cls: `${base} bg-amber-100 text-amber-700` };
  return { text: `Ends ${endDate}`, cls: `${base} bg-green-100 text-green-700` };
}

export default function ClientDocumentsCard({ clientId }: Props) {
  const [docs, setDocs] = useState<ClientDocument[]>([]);
  const [assignmentMap, setAssignmentMap] = useState<Map<string, AssignmentSummaryForDoc>>(new Map());
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [docsRes, asnRes] = await Promise.all([
      fetch(`/api/clients/${clientId}/documents`),
      fetch(`/api/clients/${clientId}/assignments-for-docs`),
    ]);
    if (docsRes.ok) {
      const json = await docsRes.json();
      setDocs(json.data || []);
    }
    if (asnRes.ok) {
      const json = await asnRes.json();
      const map = new Map<string, AssignmentSummaryForDoc>();
      for (const a of json.data || []) map.set(a.id, a);
      setAssignmentMap(map);
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
            Client-specific signed paperwork (MVA, NDA, Work Orders, etc.) —
            <span className="text-red-700"> internal only, not visible to consultants</span>
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
              {docs.map((doc) => {
                const asn = doc.assignment_id ? assignmentMap.get(doc.assignment_id) : null;
                const endBadge = asn ? endDateBadge(asn.end_date) : null;
                return (
                  <tr key={doc.id} className="border-t border-light-gray align-top">
                    <td className="px-3 py-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-light-gray/60">
                        {CLIENT_DOC_TYPE_DEFAULTS[doc.doc_type].label}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{doc.display_name}</div>
                      {doc.doc_type === "work_order" && asn && (
                        <div className="text-xs text-dark/60 mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span>For:</span>
                          <span className="font-medium text-dark">{asn.candidate_name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                            {TYPE_LABELS[asn.candidate_type] || asn.candidate_type}
                          </span>
                          <span className="text-dark/40">·</span>
                          <span>{asn.role_title}</span>
                          {endBadge && (
                            <span className={endBadge.cls}>{endBadge.text}</span>
                          )}
                        </div>
                      )}
                      {doc.doc_type === "work_order" && !asn && doc.assignment_id && (
                        <div className="text-xs text-amber-700 mt-0.5">
                          Linked assignment not found (may have been deleted)
                        </div>
                      )}
                    </td>
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
                );
              })}
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
