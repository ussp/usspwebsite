"use client";

import { useState, useEffect } from "react";
import type { ClientDocType, AssignmentSummaryForDoc } from "@ussp-platform/core";
import { CLIENT_DOC_TYPES, CLIENT_DOC_TYPE_DEFAULTS } from "@ussp-platform/core";

interface Props {
  clientId: string;
  onClose: () => void;
  onUploaded: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  internal_employee: "W-2 Employee",
  external: "1099 / External",
  vendor: "Corp-to-Corp",
};

export default function UploadClientDocDialog({ clientId, onClose, onUploaded }: Props) {
  const [docType, setDocType] = useState<ClientDocType>("mva");
  const [displayName, setDisplayName] = useState(CLIENT_DOC_TYPE_DEFAULTS.mva.label);
  const [description, setDescription] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [assignments, setAssignments] = useState<AssignmentSummaryForDoc[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (docType !== "work_order") return;
    setLoadingAssignments(true);
    fetch(`/api/clients/${clientId}/assignments-for-docs`)
      .then((r) => r.json())
      .then((j) => setAssignments(j.data || []))
      .finally(() => setLoadingAssignments(false));
  }, [docType, clientId]);

  function handleDocTypeChange(newType: ClientDocType) {
    setDocType(newType);
    setDisplayName(CLIENT_DOC_TYPE_DEFAULTS[newType].label);
    if (newType !== "work_order") setAssignmentId("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please choose a file");
      return;
    }
    setError("");
    setUploading(true);

    try {
      const urlRes = await fetch(`/api/clients/${clientId}/documents/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });
      const urlJson = await urlRes.json();
      if (!urlRes.ok) throw new Error(urlJson.error || "Failed to get upload URL");

      const uploadRes = await fetch(urlJson.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("File upload failed");

      const createRes = await fetch(`/api/clients/${clientId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_type: docType,
          display_name: displayName,
          description: description || undefined,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: urlJson.path,
          effective_date: effectiveDate || null,
          expiry_date: expiryDate || null,
          assignment_id: docType === "work_order" && assignmentId ? assignmentId : null,
          notes: notes || undefined,
        }),
      });
      const createJson = await createRes.json();
      if (!createRes.ok) throw new Error(createJson.error || "Failed to save document");

      onUploaded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-light-gray">
          <h2 className="text-lg font-bold">Upload Client Document</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Document type</label>
            <select
              value={docType}
              onChange={(e) => handleDocTypeChange(e.target.value as ClientDocType)}
              className="w-full border border-light-gray rounded px-3 py-2 text-sm"
            >
              {CLIENT_DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {CLIENT_DOC_TYPE_DEFAULTS[t].label}
                </option>
              ))}
            </select>
            <p className="text-xs text-dark/50 mt-1">
              {CLIENT_DOC_TYPE_DEFAULTS[docType].description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border border-light-gray rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-light-gray rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Effective date</label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full border border-light-gray rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-light-gray rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {docType === "work_order" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Link to consultant&apos;s assignment
              </label>
              {loadingAssignments ? (
                <p className="text-sm text-dark/50">Loading assignments...</p>
              ) : assignments.length === 0 ? (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                  No assignments exist for this client yet. Create one under
                  /assignments first, or leave blank for a master-level Work Order.
                </p>
              ) : (
                <select
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  className="w-full border border-light-gray rounded px-3 py-2 text-sm"
                >
                  <option value="">— No link (master-level WO) —</option>
                  {assignments.map((a) => {
                    const endLabel = a.end_date ? `ends ${a.end_date}` : "no end date";
                    const typeLabel = TYPE_LABELS[a.candidate_type] || a.candidate_type;
                    const statusBadge = a.status !== "active" ? ` [${a.status}]` : "";
                    return (
                      <option key={a.id} value={a.id}>
                        {a.candidate_name} ({typeLabel}) — {a.role_title} — {endLabel}
                        {statusBadge}
                      </option>
                    );
                  })}
                </select>
              )}
              <p className="text-xs text-dark/50 mt-1">
                Work Orders tie to one consultant at this client. Internal record — not visible to the consultant.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-light-gray rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              File (PDF, DOC, DOCX; max 10MB)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 justify-end pt-2 border-t border-light-gray">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-sm border border-light-gray rounded hover:bg-light-gray disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
