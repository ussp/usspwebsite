"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import type { EngagementDetail, AIEngagementDocument, DocumentCategory } from "@ussp-platform/core";
import { DOCUMENT_CATEGORY_LABELS } from "@ussp-platform/core";

const CATEGORIES: DocumentCategory[] = ["general", "policy", "framework", "meeting_notes", "playbook", "reference"];

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const [eng, setEng] = useState<EngagementDetail | null>(null);
  const [docs, setDocs] = useState<AIEngagementDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>("general");
  const [uploadDescription, setUploadDescription] = useState("");

  const loadDocs = useCallback(() => {
    fetch(`/api/engagements/${id}/documents`).then((r) => r.json()).then(setDocs);
  }, [id]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/engagements/${id}`).then((r) => r.json()),
      fetch(`/api/engagements/${id}/documents`).then((r) => r.json()),
    ]).then(([engData, docData]) => {
      setEng(engData);
      setDocs(Array.isArray(docData) ? docData : []);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Get signed upload URL
      const urlRes = await fetch(`/api/engagements/${id}/documents?uploadUrl=${encodeURIComponent(file.name)}`);
      const { signedUrl, path, error: urlError } = await urlRes.json();
      if (urlError || !signedUrl) throw new Error(urlError || "Failed to get upload URL");

      // 2. Upload file to Supabase storage
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      // 3. Save document metadata
      await fetch(`/api/engagements/${id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: path,
          category: uploadCategory,
          description: uploadDescription || undefined,
        }),
      });

      setUploadDescription("");
      loadDocs();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const downloadDoc = async (doc: AIEngagementDocument) => {
    const res = await fetch(`/api/engagements/${id}/documents?download=${encodeURIComponent(doc.storage_path)}`);
    const { signedUrl, error } = await res.json();
    if (error || !signedUrl) return alert(error || "Download failed");
    window.open(signedUrl, "_blank");
  };

  const deleteDoc = async (docId: string) => {
    if (!confirm("Delete this document?")) return;
    await fetch(`/api/engagements/${id}/documents?docId=${docId}`, { method: "DELETE" });
    loadDocs();
  };

  if (loading) return (<><AdminSidebar /><AdminTopbar /><main className="ml-60 mt-14 p-6"><p className="text-dark/40">Loading...</p></main></>);
  if (!eng) return (<><AdminSidebar /><AdminTopbar /><main className="ml-60 mt-14 p-6"><p className="text-red-600">Not found</p></main></>);

  const docsByCategory = CATEGORIES.map((cat) => ({
    category: cat,
    label: DOCUMENT_CATEGORY_LABELS[cat],
    docs: docs.filter((d) => d.category === cat),
  })).filter((g) => g.docs.length > 0);

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <div className="flex items-center gap-3 mb-1">
          <Link href={`/engagements/${id}`} className="text-sm text-primary hover:underline">&larr; {eng.name}</Link>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Documents</h1>
            <p className="text-sm text-dark/50 mt-1">{eng.client_name} — {eng.name} &middot; {docs.length} document{docs.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Upload area */}
        <div className="bg-white rounded-lg border border-light-gray p-5 mb-6">
          <h3 className="font-semibold mb-3">Upload Document</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-dark/60 block mb-1">Category</label>
              <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)} className="w-full border border-light-gray rounded-lg p-2 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{DOCUMENT_CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-dark/60 block mb-1">Description (optional)</label>
              <input type="text" value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)} className="w-full border border-light-gray rounded-lg p-2 text-sm" placeholder="Brief description of the document" />
            </div>
          </div>
          <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${uploading ? "border-primary/30 bg-primary/5" : "border-light-gray hover:border-primary/30 hover:bg-light-gray/30"}`}>
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.csv" />
            {uploading ? (
              <span className="text-sm text-primary">Uploading...</span>
            ) : (
              <span className="text-sm text-dark/40">Click to select a file — PDF, DOC, DOCX, PPT, XLS, TXT, MD, CSV</span>
            )}
          </label>
        </div>

        {/* Documents by category */}
        {docsByCategory.length > 0 ? (
          docsByCategory.map((group) => (
            <div key={group.category} className="mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-dark/50 mb-3">{group.label}</h2>
              <div className="bg-white rounded-lg border border-light-gray divide-y divide-light-gray">
                {group.docs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-light-gray/30 group">
                    <div className="flex-1 min-w-0">
                      <button onClick={() => downloadDoc(doc)} className="text-sm font-medium text-primary hover:underline truncate block text-left">
                        {doc.file_name}
                      </button>
                      <div className="flex items-center gap-3 mt-1 text-xs text-dark/40">
                        {doc.file_size && <span>{formatFileSize(doc.file_size)}</span>}
                        {doc.uploaded_by && <span>by {doc.uploaded_by}</span>}
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                      {doc.description && <p className="text-xs text-dark/50 mt-1">{doc.description}</p>}
                    </div>
                    <button onClick={() => deleteDoc(doc.id)} className="text-xs text-dark/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-4" title="Delete">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-light-gray p-8 text-center">
            <p className="text-dark/40 text-sm mb-2">No documents uploaded yet.</p>
            <p className="text-dark/30 text-xs">Upload reference docs, policies, meeting notes, and playbooks above.</p>
          </div>
        )}
      </main>
    </>
  );
}
