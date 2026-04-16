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
          <div className="flex gap-2">
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
