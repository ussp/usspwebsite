"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CorporateDocType } from "@ussp-platform/core";
import { CORPORATE_DOC_TYPES, CORPORATE_DOC_TYPE_DEFAULTS } from "@ussp-platform/core";

interface Props {
  initialDocType?: CorporateDocType;
  onClose: () => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysIso(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function UploadCorporateDocDialog({ initialDocType, onClose }: Props) {
  const router = useRouter();
  const [docType, setDocType] = useState<CorporateDocType>(initialDocType || "w9");
  const [displayName, setDisplayName] = useState(
    CORPORATE_DOC_TYPE_DEFAULTS[initialDocType || "w9"].label
  );
  const [description, setDescription] = useState("");
  const [issuedDate, setIssuedDate] = useState(todayIso());
  const [expiryDate, setExpiryDate] = useState(() => {
    const days = CORPORATE_DOC_TYPE_DEFAULTS[initialDocType || "w9"].defaultExpiryDays;
    return days ? addDaysIso(todayIso(), days) : "";
  });
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function handleDocTypeChange(newType: CorporateDocType) {
    setDocType(newType);
    const defaults = CORPORATE_DOC_TYPE_DEFAULTS[newType];
    setDisplayName(defaults.label);
    if (defaults.defaultExpiryDays) {
      setExpiryDate(addDaysIso(issuedDate || todayIso(), defaults.defaultExpiryDays));
    } else {
      setExpiryDate("");
    }
  }

  function handleIssuedDateChange(newDate: string) {
    setIssuedDate(newDate);
    const defaults = CORPORATE_DOC_TYPE_DEFAULTS[docType];
    if (defaults.defaultExpiryDays && newDate) {
      setExpiryDate(addDaysIso(newDate, defaults.defaultExpiryDays));
    }
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
      // 1. Get signed upload URL
      const urlRes = await fetch("/api/corporate-vault/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });
      const urlJson = await urlRes.json();
      if (!urlRes.ok) throw new Error(urlJson.error || "Failed to get upload URL");

      // 2. Upload file to Supabase
      const uploadRes = await fetch(urlJson.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("File upload failed");

      // 3. Create the row
      const createRes = await fetch("/api/corporate-vault", {
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
          issued_date: issuedDate || null,
          expiry_date: expiryDate || null,
          notes: notes || undefined,
        }),
      });
      const createJson = await createRes.json();
      if (!createRes.ok) throw new Error(createJson.error || "Failed to save document");

      onClose();
      router.refresh();
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
          <h2 className="text-lg font-bold">Upload Corporate Document</h2>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Document type</label>
            <select
              value={docType}
              onChange={(e) => handleDocTypeChange(e.target.value as CorporateDocType)}
              className="w-full border border-light-gray rounded px-3 py-2 text-sm"
            >
              {CORPORATE_DOC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {CORPORATE_DOC_TYPE_DEFAULTS[t].label}
                </option>
              ))}
            </select>
            <p className="text-xs text-dark/50 mt-1">
              {CORPORATE_DOC_TYPE_DEFAULTS[docType].description}
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
              <label className="block text-sm font-medium mb-1">Issued date</label>
              <input
                type="date"
                value={issuedDate}
                onChange={(e) => handleIssuedDateChange(e.target.value)}
                className="w-full border border-light-gray rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Expiry date
                {CORPORATE_DOC_TYPE_DEFAULTS[docType].defaultExpiryDays && (
                  <span className="text-xs text-dark/50 ml-1">
                    (default {CORPORATE_DOC_TYPE_DEFAULTS[docType].defaultExpiryDays}d)
                  </span>
                )}
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-light-gray rounded px-3 py-2 text-sm"
                placeholder="No expiry"
              />
            </div>
          </div>

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
            <label className="block text-sm font-medium mb-1">File (PDF, DOC, DOCX; max 10MB)</label>
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
