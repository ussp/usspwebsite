"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import ReadinessSteps from "@/components/ReadinessSteps";
import { TEAM_MEMBER_ROLE_LABELS } from "@ussp-platform/core";
import InfoTip from "@/components/InfoTip";
import type { TeamMemberRole } from "@ussp-platform/core";

interface MemberResponse {
  id: string;
  response_id?: string;
  name: string;
  email: string;
  role: string;
  response_status: string;
  response_token: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export default function DistributePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<{ status: string } | null>(null);
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [distributing, setDistributing] = useState(false);
  const [reminding, setReminding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/readiness/${id}`).then((r) => r.json()).then(setAssessment);
    loadResponses();
  }, [id]);

  async function loadResponses() {
    const res = await fetch(`/api/readiness/${id}/responses`);
    const data = await res.json();
    setMembers(data.members || []);
    setTotal(data.total || 0);
    setCompleted(data.completed || 0);
    setPercentage(data.percentage || 0);
  }

  async function distribute() {
    setDistributing(true);
    await fetch(`/api/readiness/${id}/distribute`, { method: "POST" });
    setDistributing(false);
    loadResponses();
  }

  async function sendReminder() {
    setReminding(true);
    await fetch(`/api/readiness/${id}/remind`, { method: "POST" });
    setReminding(false);
  }

  function downloadTemplate() {
    window.location.href = `/api/readiness/${id}/questionnaire/export`;
  }

  function downloadForMember(responseId: string | undefined) {
    if (!responseId) {
      alert("This member has no response yet — click Send All first to create their response record.");
      return;
    }
    window.location.href = `/api/readiness/${id}/questionnaire/export?responseId=${encodeURIComponent(responseId)}`;
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/readiness/${id}/questionnaire/import`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setImportResult(`Error: ${data.error || "Import failed"}`);
      } else {
        const warn = data.warnings?.length ? ` (${data.warnings.length} warning${data.warnings.length > 1 ? "s" : ""})` : "";
        setImportResult(`Imported ${data.answers_imported} answer${data.answers_imported !== 1 ? "s" : ""}${warn}`);
        loadResponses();
      }
    } catch (err) {
      setImportResult(`Error: ${err instanceof Error ? err.message : "Import failed"}`);
    }
    setImporting(false);
    e.target.value = "";
  }

  const STATUS_COLORS: Record<string, string> = {
    not_sent: "bg-gray-100 text-gray-600",
    not_started: "bg-amber-100 text-amber-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

  const hasSent = members.some((m) => m.response_status !== "not_sent");
  const incompleteCount = members.filter((m) => m.response_status !== "completed" && m.response_status !== "not_sent").length;

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-4xl">
        <ReadinessSteps assessmentId={id} currentStep={11} status={assessment?.status || "draft"} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold mb-1">Distribution & Tracking<InfoTip text="Each team member receives a unique email link to their questionnaire. No login required for respondents. You can send reminders to those who haven't completed." /></h1>
            <p className="text-sm text-dark/50">Send questionnaires and track responses.</p>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={downloadTemplate}
              className="text-sm border border-light-gray rounded-lg px-3 py-2 hover:bg-light-gray/40 transition-colors"
              title="Download a blank XLSX template. Respondent fills Email: cell, scores, and comments. Use this when you distribute via email / SharePoint instead of the web link.">
              Download Template
            </button>
            <label className="text-sm border border-light-gray rounded-lg px-3 py-2 hover:bg-light-gray/40 transition-colors cursor-pointer"
              title="Upload a filled XLSX (per-respondent or template) to import the answers.">
              {importing ? "Importing..." : "Import Responses"}
              <input type="file" accept=".xlsx" onChange={handleImport} disabled={importing} className="hidden" />
            </label>
            {!hasSent && (
              <button onClick={distribute} disabled={distributing}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50">
                {distributing ? "Sending..." : "Send All"}
              </button>
            )}
            {hasSent && incompleteCount > 0 && (
              <button onClick={sendReminder} disabled={reminding}
                className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50">
                {reminding ? "Sending..." : `Send Reminder (${incompleteCount})`}
              </button>
            )}
          </div>
        </div>

        {importResult && (
          <div className={`rounded-lg p-3 mb-4 text-sm ${importResult.startsWith("Error") ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
            {importResult}
          </div>
        )}

        {/* Progress bar */}
        {hasSent && (
          <div className="bg-white rounded-lg border border-light-gray p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Response Progress</span>
              <span className="text-sm text-dark/50">{completed}/{total} ({percentage}%)</span>
            </div>
            <div className="w-full bg-light-gray rounded-full h-3">
              <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        )}

        {/* Members table */}
        <div className="bg-white rounded-lg border border-light-gray overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-light-gray/50 text-dark/60 text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Completed</th>
                <th className="px-4 py-3 font-medium">Offline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-gray">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-light-gray/30">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-dark/50">{m.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-light-gray px-2 py-0.5 rounded">
                      {TEAM_MEMBER_ROLE_LABELS[m.role as TeamMemberRole] || m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[m.response_status] || STATUS_COLORS.not_sent}`}>
                      {m.response_status === "not_sent" ? "Not Sent" : m.response_status === "not_started" ? "Sent" : m.response_status === "in_progress" ? "In Progress" : "Completed"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark/50 text-xs">
                    {m.completed_at ? new Date(m.completed_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => downloadForMember(m.response_id)}
                      disabled={!m.response_id}
                      className="text-xs text-primary hover:underline disabled:text-dark/30 disabled:cursor-not-allowed disabled:hover:no-underline"
                      title={m.response_id ? "Download this respondent's XLSX with their response_id embedded" : "No response record yet — click Send All first"}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => router.push(`/readiness/${id}/questionnaire`)} className="text-sm text-dark/50 hover:text-dark">
            &larr; Back
          </button>
          <button onClick={() => router.push(`/readiness/${id}/risks`)}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
            Next: Risks &rarr;
          </button>
        </div>
      </main>
    </>
  );
}
