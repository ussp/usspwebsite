"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import StatusBadge from "@/components/StatusBadge";

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
  status: string;
  created_at: string;
  auth_provider: string;
  linkedin_sub: string | null;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  staff_user?: { full_name: string } | null;
}

const STATUSES = [
  "new",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected",
  "withdrawn",
];

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/applications/${params.id}`).then((r) => r.json()),
      fetch(`/api/applications/${params.id}/notes`).then((r) => r.json()),
    ]).then(([appData, notesData]) => {
      setApp(appData);
      setNotes(notesData);
      setLoading(false);
    });
  }, [params.id]);

  async function handleStatusChange(status: string) {
    await fetch(`/api/applications/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setApp((prev) => (prev ? { ...prev, status } : prev));
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

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-dark/50 hover:text-dark mb-4 inline-block"
        >
          &larr; Back to applications
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="lg:col-span-2 space-y-6">
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
                <StatusBadge status={app.status || "new"} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-dark/50">Position:</span>{" "}
                  {app.job_title}
                </div>
                <div>
                  <span className="text-dark/50">Applied:</span>{" "}
                  {new Date(app.created_at).toLocaleDateString()}
                </div>
                {app.resume_name && (
                  <div>
                    <span className="text-dark/50">Resume:</span>{" "}
                    {app.resume_name}
                  </div>
                )}
                <div>
                  <span className="text-dark/50">Auth:</span>{" "}
                  {app.auth_provider}
                </div>
              </div>
            </div>

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
                    className="border-l-2 border-primary/20 pl-3 py-1"
                  >
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-dark/40 mt-1">
                      {note.staff_user?.full_name || "Staff"} &middot;{" "}
                      {new Date(note.created_at).toLocaleString()}
                    </p>
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
            <div className="bg-white rounded-lg border border-light-gray p-5">
              <h3 className="font-semibold mb-3">Update Status</h3>
              <div className="space-y-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg capitalize transition-colors ${
                      app.status === s
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-light-gray"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
