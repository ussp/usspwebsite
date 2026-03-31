"use client";

import { useEffect, useState } from "react";
import type {
  DocumentRequest,
  DocumentRequestType,
  CandidateReferenceRecord,
} from "@ussp-platform/core/types/admin";
import {
  DOCUMENT_REQUEST_TYPE_LABELS,
  DOCUMENT_REQUEST_STATUS_LABELS,
} from "@ussp-platform/core/types/admin";

interface Props {
  applicationId: string;
  candidateId: string | null;
}

const REQUEST_TYPES: DocumentRequestType[] = [
  "ssn",
  "drivers_license",
  "dob",
  "visa_document",
  "references",
  "background_check_consent",
  "other",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  submitted: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

interface RequestDetail extends DocumentRequest {
  submitted_text_decrypted?: string | null;
  references?: CandidateReferenceRecord[];
}

export default function DocumentRequestsPanel({ applicationId, candidateId }: Props) {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Set<DocumentRequestType>>(new Set());
  const [dueDate, setDueDate] = useState("");
  const [minRefs, setMinRefs] = useState(2);
  const [otherDesc, setOtherDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<RequestDetail | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    fetch(`/api/applications/${applicationId}/requests`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
      });
  }, [applicationId]);

  function toggleType(type: DocumentRequestType) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  async function handleCreate() {
    if (selected.size === 0 || !candidateId) return;
    setCreating(true);

    const reqs = Array.from(selected).map((type) => ({
      request_type: type,
      due_date: dueDate || undefined,
      min_references: type === "references" ? minRefs : undefined,
      description: type === "other" ? otherDesc : undefined,
    }));

    const res = await fetch(`/api/applications/${applicationId}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate_id: candidateId, requests: reqs }),
    });

    if (res.ok) {
      const newRequests = await res.json();
      setRequests((prev) => [...prev, ...(Array.isArray(newRequests) ? newRequests : [])]);
      setShowCreate(false);
      setSelected(new Set());
      setDueDate("");
      setOtherDesc("");
    }
    setCreating(false);
  }

  async function handleExpand(reqId: string) {
    if (expandedId === reqId) {
      setExpandedId(null);
      setDetail(null);
      return;
    }
    setExpandedId(reqId);
    const res = await fetch(
      `/api/applications/${applicationId}/requests/${reqId}`
    );
    if (res.ok) {
      setDetail(await res.json());
      setReviewNotes("");
    }
  }

  async function handleReview(reqId: string, status: "approved" | "rejected") {
    const res = await fetch(
      `/api/applications/${applicationId}/requests/${reqId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewer_notes: reviewNotes || undefined }),
      }
    );
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status } : r))
      );
      setExpandedId(null);
      setDetail(null);
    }
  }

  // Determine which types are already requested
  const existingTypes = new Set(requests.map((r) => r.request_type));

  return (
    <div className="bg-white rounded-lg border border-light-gray p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-dark/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="font-semibold">Document Requests</h3>
          {requests.length > 0 && (
            <span className="text-xs bg-light-gray px-2 py-0.5 rounded-full">
              {requests.length}
            </span>
          )}
        </div>
        {candidateId && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="text-sm text-primary hover:text-primary-dark font-medium"
          >
            {showCreate ? "Cancel" : "+ Request Documents"}
          </button>
        )}
      </div>

      {!candidateId && (
        <p className="text-sm text-dark/40">
          No candidate record linked — documents cannot be requested yet.
        </p>
      )}

      {/* Create Form */}
      {showCreate && candidateId && (
        <div className="mb-5 p-4 bg-light-gray/50 rounded-lg space-y-3">
          <p className="text-sm font-medium">Select documents to request:</p>
          <div className="grid grid-cols-2 gap-2">
            {REQUEST_TYPES.map((type) => (
              <label
                key={type}
                className={`flex items-center gap-2 p-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  existingTypes.has(type)
                    ? "opacity-50 cursor-not-allowed"
                    : selected.has(type)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-light-gray"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(type)}
                  onChange={() => toggleType(type)}
                  disabled={existingTypes.has(type)}
                  className="rounded"
                />
                {DOCUMENT_REQUEST_TYPE_LABELS[type]}
              </label>
            ))}
          </div>

          {selected.has("references") && (
            <div>
              <label className="block text-sm text-dark/70 mb-1">
                Minimum references required
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={minRefs}
                onChange={(e) => setMinRefs(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-light-gray rounded text-sm"
              />
            </div>
          )}

          {selected.has("other") && (
            <div>
              <label className="block text-sm text-dark/70 mb-1">
                Description of required document
              </label>
              <input
                type="text"
                value={otherDesc}
                onChange={(e) => setOtherDesc(e.target.value)}
                placeholder="e.g., I-9 form, education transcripts..."
                className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-dark/70 mb-1">
              Due date (optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-2 border border-light-gray rounded-lg text-sm"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={selected.size === 0 || creating}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {creating ? "Sending..." : `Send ${selected.size} Request${selected.size !== 1 ? "s" : ""}`}
          </button>
        </div>
      )}

      {/* Existing Requests */}
      {requests.length > 0 && (
        <div className="space-y-2">
          {requests.map((req) => (
            <div key={req.id}>
              <div
                onClick={() => req.status === "submitted" ? handleExpand(req.id) : undefined}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  req.status === "submitted" ? "cursor-pointer hover:bg-light-gray/50" : ""
                } bg-light-gray/30`}
              >
                <div>
                  <span className="text-sm font-medium">
                    {DOCUMENT_REQUEST_TYPE_LABELS[req.request_type as DocumentRequestType] || req.request_type}
                  </span>
                  {req.description && (
                    <p className="text-xs text-dark/50 mt-0.5">{req.description}</p>
                  )}
                  {req.due_date && (
                    <p className="text-xs text-dark/40">
                      Due: {new Date(req.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    STATUS_COLORS[req.status] || "bg-gray-100"
                  }`}
                >
                  {DOCUMENT_REQUEST_STATUS_LABELS[req.status as keyof typeof DOCUMENT_REQUEST_STATUS_LABELS] || req.status}
                </span>
              </div>

              {/* Expanded Detail for Review */}
              {expandedId === req.id && detail && (
                <div className="mt-2 ml-4 p-4 border border-light-gray rounded-lg space-y-3">
                  {/* Decrypted text submissions (SSN, DOB, DL) */}
                  {detail.submitted_text_decrypted && (
                    <div>
                      <p className="text-xs text-dark/50 mb-1">Submitted Value</p>
                      <p className="text-sm font-mono bg-light-gray/50 px-3 py-2 rounded">
                        {detail.submitted_text_decrypted}
                      </p>
                    </div>
                  )}

                  {detail.submitted_dl_state && (
                    <div>
                      <p className="text-xs text-dark/50 mb-1">DL State</p>
                      <p className="text-sm">{detail.submitted_dl_state}</p>
                    </div>
                  )}

                  {/* File submissions */}
                  {detail.submitted_file_name && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm">{detail.submitted_file_name}</span>
                    </div>
                  )}

                  {/* References */}
                  {detail.references && detail.references.length > 0 && (
                    <div>
                      <p className="text-xs text-dark/50 mb-2">
                        References ({detail.references.length})
                      </p>
                      <div className="space-y-2">
                        {detail.references.map((ref) => (
                          <div
                            key={ref.id}
                            className="text-sm bg-light-gray/50 p-3 rounded"
                          >
                            <p className="font-medium">{ref.ref_name}</p>
                            {ref.ref_title && (
                              <p className="text-dark/60">
                                {ref.ref_title}
                                {ref.ref_company && ` at ${ref.ref_company}`}
                              </p>
                            )}
                            {ref.relationship && (
                              <p className="text-xs text-dark/40">{ref.relationship}</p>
                            )}
                            <div className="flex gap-4 mt-1 text-xs text-dark/50">
                              {ref.ref_phone && <span>{ref.ref_phone}</span>}
                              {ref.ref_email && <span>{ref.ref_email}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {detail.submitted_at && (
                    <p className="text-xs text-dark/40">
                      Submitted {new Date(detail.submitted_at).toLocaleString()}
                    </p>
                  )}

                  {/* Review actions */}
                  <div className="border-t border-light-gray pt-3">
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Review notes (optional)..."
                      rows={2}
                      className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(req.id, "approved")}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(req.id, "rejected")}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {requests.length === 0 && candidateId && !showCreate && (
        <p className="text-sm text-dark/40">No document requests yet</p>
      )}
    </div>
  );
}
