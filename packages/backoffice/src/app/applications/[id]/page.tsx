"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import StatusBadge from "@/components/StatusBadge";
import PipelineAccordion from "@/components/PipelineAccordion";
import GateOverrideDialog from "@/components/GateOverrideDialog";
import MatchingQualifications from "@/components/MatchingQualifications";
import DocumentRequestsPanel from "@/components/DocumentRequestsPanel";
import type { ApplicationStatus } from "@ussp-platform/core/types/admin";
import { PIPELINE_STAGES } from "@ussp-platform/core/types/admin";

interface GateResult {
  passed: boolean;
  gate: string;
  message: string;
  missingItems: string[];
}

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  job_title: string;
  job_slug: string;
  resume_path: string | null;
  resume_name: string | null;
  profile_picture: string | null;
  status: ApplicationStatus;
  created_at: string;
  auth_provider: string;
  linkedin_sub: string | null;
  applicant_type: string | null;
  expected_bill_rate: string | null;
  availability_date: string | null;
  position_id: string | null;
  candidate_id: string | null;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  staff_user?: { full_name: string } | null;
}

interface OtherApplication {
  id: string;
  job_title: string;
  job_slug: string;
  status: string;
  created_at: string;
  resume_name: string | null;
}

interface PositionInfo {
  id: string;
  title: string;
  description: string | null;
  bill_rate: string | null;
  location: string | null;
  type: string | null;
  work_mode: string | null;
  department: string | null;
  duration_hours: string | null;
  client_name: string | null;
  end_client_name: string | null;
  active: boolean;
}

interface StatusHistoryEntry {
  status: string;
  changed_at: string;
  changed_by_name: string | null;
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [position, setPosition] = useState<PositionInfo | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [otherApps, setOtherApps] = useState<OtherApplication[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState("");
  const [gateWarnings, setGateWarnings] = useState<GateResult[]>([]);
  const [showGateDialog, setShowGateDialog] = useState(false);
  const [gateOverrideAdvancing, setGateOverrideAdvancing] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/applications/${params.id}`).then((r) => r.json()),
      fetch(`/api/applications/${params.id}/notes`).then((r) => r.json()),
      fetch(`/api/applications/${params.id}/history`).then((r) => r.json()),
    ]).then(([appData, notesData, historyData]) => {
      setApp(appData);
      setNotes(notesData);
      setStatusHistory(Array.isArray(historyData) ? historyData : []);
      setLoading(false);

      // Fetch pipeline gate warnings for next stage
      fetch(`/api/applications/${params.id}/gate-check`)
        .then((r) => r.json())
        .then((data) => {
          if (data.gates) setGateWarnings(data.gates);
        });

      // Fetch position details (description, rate, etc.)
      if (appData?.position_id) {
        fetch(`/api/positions/${appData.position_id}`)
          .then((r) => r.ok ? r.json() : null)
          .then((posData) => {
            if (posData) setPosition(posData);
          });
      }

      // Fetch other applications by the same person (each job = separate record)
      if (appData?.email) {
        fetch(`/api/applications/by-email?email=${encodeURIComponent(appData.email)}`)
          .then((r) => r.json())
          .then((allApps) => {
            if (Array.isArray(allApps)) {
              setOtherApps(
                allApps.filter(
                  (a: OtherApplication) => a.id !== appData.id
                )
              );
            }
          });
      }
    });
  }, [params.id]);

  async function handleStatusChange(status: ApplicationStatus, forceOverride = false) {
    const res = await fetch(`/api/applications/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, forceOverride }),
    });

    const data = await res.json();

    // If blocked by gates, show the override dialog
    if (res.status === 422 && data.blocked) {
      setGateWarnings(data.gates);
      setShowGateDialog(true);
      return;
    }

    setApp((prev) => (prev ? { ...prev, status } : prev));
    // Refresh history and gate warnings
    const [historyRes, gateRes] = await Promise.all([
      fetch(`/api/applications/${params.id}/history`),
      fetch(`/api/applications/${params.id}/gate-check`),
    ]);
    const historyData = await historyRes.json();
    const gateData = await gateRes.json();
    setStatusHistory(Array.isArray(historyData) ? historyData : []);
    if (gateData.gates) setGateWarnings(gateData.gates);
  }

  async function handleAdvance(forceOverride = false) {
    if (!app) return;
    const currentIndex = PIPELINE_STAGES.indexOf(app.status);
    if (currentIndex < 0 || currentIndex >= PIPELINE_STAGES.length - 1) return;
    const nextStatus = PIPELINE_STAGES[currentIndex + 1];
    await handleStatusChange(nextStatus, forceOverride);
  }

  async function handleGateOverride() {
    setGateOverrideAdvancing(true);
    await handleAdvance(true);
    setShowGateDialog(false);
    setGateOverrideAdvancing(false);
  }

  async function handleDeactivate() {
    await handleStatusChange("rejected");
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;
    const res = await fetch(`/api/applications/${params.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newNote }),
    });
    if (res.ok) {
      const data = await res.json();
      setNotes((prev) => [data, ...prev]);
      setNewNote("");
    }
  }

  async function handleEditNote(noteId: string) {
    if (!editNoteContent.trim()) return;
    const res = await fetch(
      `/api/applications/${params.id}/notes/${noteId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editNoteContent }),
      }
    );
    if (res.ok) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, content: editNoteContent } : n
        )
      );
      setEditingNoteId(null);
    }
  }

  async function handleDeleteNote(noteId: string) {
    const res = await fetch(
      `/api/applications/${params.id}/notes/${noteId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  }

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-dark/50">Loading...</p>
        </main>
      </>
    );
  }

  if (!app) {
    return (
      <>
        <AdminSidebar />
        <AdminTopbar />
        <main className="ml-60 mt-14 p-6">
          <p className="text-danger">Application not found</p>
        </main>
      </>
    );
  }

  const availabilityLabel = app.availability_date
    ? new Date(app.availability_date) <= new Date()
      ? "Available now"
      : `Available ${new Date(app.availability_date).toLocaleDateString()}`
    : null;

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-dark/50 hover:text-dark mb-4 inline-block"
        >
          &larr; Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-light-gray p-6">
              <div className="flex items-start gap-4">
                {app.profile_picture && (
                  <img
                    src={app.profile_picture}
                    alt=""
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{app.full_name}</h2>
                  <p className="text-dark/60">{app.email}</p>
                  {app.phone && (
                    <p className="text-dark/60 text-sm">{app.phone}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {app.applicant_type && (
                    <span
                      title={
                        app.applicant_type === "vendor"
                          ? "Submitted by a staffing agency or vendor on behalf of the candidate"
                          : "Candidate applied directly for this position"
                      }
                      className={`inline-block px-2.5 py-1 rounded-full text-xs cursor-default ${
                        app.applicant_type === "vendor"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {app.applicant_type === "vendor"
                        ? "Vendor"
                        : "Employee"}
                    </span>
                  )}
                  <StatusBadge status={app.status || "new"} />
                </div>
              </div>

              {/* Details Grid */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-dark/50">Position:</span>{" "}
                  {app.job_title}
                </div>
                <div>
                  <span className="text-dark/50">Applied:</span>{" "}
                  {new Date(app.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="text-dark/50">Auth:</span>{" "}
                  {app.auth_provider}
                </div>
                {app.expected_bill_rate && (
                  <div>
                    <span className="text-dark/50">Bill Rate:</span>{" "}
                    {app.expected_bill_rate}
                  </div>
                )}
                {availabilityLabel && (
                  <div>
                    <span className="text-dark/50">Availability:</span>{" "}
                    <span
                      className={
                        availabilityLabel === "Available now"
                          ? "text-success font-medium"
                          : ""
                      }
                    >
                      {availabilityLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Position Details */}
            {position && (
              <div className="bg-white rounded-lg border border-light-gray p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Position Details</h3>
                  {!position.active && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      Closed
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  {position.location && (
                    <div>
                      <span className="text-dark/50">Location:</span>{" "}
                      {position.location}
                    </div>
                  )}
                  {position.type && (
                    <div>
                      <span className="text-dark/50">Type:</span>{" "}
                      {position.type}
                    </div>
                  )}
                  {position.work_mode && (
                    <div>
                      <span className="text-dark/50">Work Mode:</span>{" "}
                      {position.work_mode}
                    </div>
                  )}
                  {position.bill_rate && (
                    <div>
                      <span className="text-dark/50">Bill Rate:</span>{" "}
                      <span className="font-medium">{position.bill_rate}</span>
                    </div>
                  )}
                  {position.duration_hours && (
                    <div>
                      <span className="text-dark/50">Duration:</span>{" "}
                      {position.duration_hours}
                    </div>
                  )}
                  {position.department && (
                    <div>
                      <span className="text-dark/50">Department:</span>{" "}
                      {position.department}
                    </div>
                  )}
                  {position.client_name && (
                    <div>
                      <span className="text-dark/50">Client:</span>{" "}
                      {position.client_name}
                    </div>
                  )}
                  {position.end_client_name && (
                    <div>
                      <span className="text-dark/50">End Client:</span>{" "}
                      {position.end_client_name}
                    </div>
                  )}
                </div>
                {position.description && (
                  <div>
                    <p className="text-dark/50 text-sm mb-1">Description:</p>
                    <div className="text-sm text-dark/80 whitespace-pre-line bg-light-gray/30 rounded-lg p-3 max-h-48 overflow-y-auto">
                      {position.description}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resume */}
            <div className="bg-white rounded-lg border border-light-gray p-6">
              <h3 className="font-semibold mb-3">Resume</h3>
              {app.resume_name ? (
                <div className="flex items-center gap-3 p-3 bg-light-gray/50 rounded-lg">
                  <svg
                    className="w-8 h-8 text-primary/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{app.resume_name}</p>
                    <p className="text-xs text-dark/50">
                      Submitted{" "}
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-dark/40">No resume uploaded</p>
              )}
            </div>

            {/* Document Requests */}
            <DocumentRequestsPanel
              applicationId={app.id}
              candidateId={app.candidate_id}
            />

            {/* Other Applications by Same Person */}
            {otherApps.length > 0 && (
              <div className="bg-white rounded-lg border border-light-gray p-6">
                <h3
                  className="font-semibold mb-3"
                  title="Other positions this candidate has applied to — each has its own pipeline, resume, and notes"
                >
                  Other Applications ({otherApps.length})
                </h3>
                <div className="space-y-2">
                  {otherApps.map((oa) => (
                    <div
                      key={oa.id}
                      onClick={() => router.push(`/applications/${oa.id}`)}
                      className="flex items-center justify-between p-3 bg-light-gray/50 rounded-lg cursor-pointer hover:bg-light-gray transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{oa.job_title}</p>
                        <p className="text-xs text-dark/50">
                          Applied{" "}
                          {new Date(oa.created_at).toLocaleDateString()}
                          {oa.resume_name && (
                            <span className="ml-2 text-primary">
                              &bull; Resume: {oa.resume_name}
                            </span>
                          )}
                        </p>
                      </div>
                      <StatusBadge status={oa.status || "new"} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-lg border border-light-gray p-6">
              <h3 className="font-semibold mb-4">Notes</h3>
              <div className="flex gap-2 mb-4">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddNote()
                  }
                />
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="border-l-2 border-primary/20 pl-3 py-1 group"
                  >
                    {editingNoteId === note.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editNoteContent}
                          onChange={(e) => setEditNoteContent(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNote(note.id)}
                            className="px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary-dark"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-3 py-1 text-xs rounded-lg border border-light-gray hover:bg-light-gray"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm">{note.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-dark/40">
                            {note.staff_user?.full_name || "Staff"} &middot;{" "}
                            {new Date(note.created_at).toLocaleString()}
                          </p>
                          <button
                            onClick={() => {
                              setEditingNoteId(note.id);
                              setEditNoteContent(note.content);
                            }}
                            className="text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-xs text-red-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-sm text-dark/40">No notes yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Pipeline Accordion */}
            <PipelineAccordion
              currentStatus={app.status}
              statusHistory={statusHistory}
              onAdvance={handleAdvance}
              onDeactivate={handleDeactivate}
              onManualSet={handleStatusChange}
              isDuplicate={otherApps.length > 0}
              gateWarnings={gateWarnings}
            />

            {/* Matching Qualifications */}
            <MatchingQualifications positionId={app.position_id} />

            {/* Quick Info */}
            <div className="bg-white rounded-lg border border-light-gray p-5">
              <h3 className="font-semibold mb-3">Quick Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark/50">Type</span>
                  <span className="capitalize">
                    {app.applicant_type || "employee"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/50">Total Applications</span>
                  <span>{otherApps.length + 1}</span>
                </div>
                {app.expected_bill_rate && (
                  <div className="flex justify-between">
                    <span className="text-dark/50">Rate</span>
                    <span>{app.expected_bill_rate}</span>
                  </div>
                )}
                {availabilityLabel && (
                  <div className="flex justify-between">
                    <span className="text-dark/50">Availability</span>
                    <span
                      className={
                        availabilityLabel === "Available now"
                          ? "text-success font-medium"
                          : ""
                      }
                    >
                      {availabilityLabel}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-dark/50">Resumes</span>
                  <span>
                    {(app.resume_name ? 1 : 0) +
                      otherApps.filter((a) => a.resume_name).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Gate Override Dialog */}
      {showGateDialog && (
        <GateOverrideDialog
          gates={gateWarnings}
          onConfirm={handleGateOverride}
          onCancel={() => setShowGateDialog(false)}
          canOverride={true}
          advancing={gateOverrideAdvancing}
        />
      )}
    </>
  );
}
