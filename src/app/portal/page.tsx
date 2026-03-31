"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import DocumentRequestForm from "@/components/portal/DocumentRequestForm";
import {
  DOCUMENT_REQUEST_TYPE_LABELS,
} from "@ussp-platform/core/types/admin";
import type { DocumentRequestType } from "@ussp-platform/core/types/admin";

interface PortalApplication {
  id: string;
  job_title: string;
  status: string;
  status_label: string;
  created_at: string;
}

interface PortalRequest {
  id: string;
  application_id: string;
  request_type: DocumentRequestType;
  status: string;
  description: string | null;
  due_date: string | null;
  min_references: number | null;
  submitted_at: string | null;
  reviewer_notes: string | null;
  job_title?: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  submitted: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function PortalPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [applications, setApplications] = useState<PortalApplication[]>([]);
  const [requests, setRequests] = useState<PortalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReq, setExpandedReq] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    Promise.all([
      fetch("/api/portal/applications").then((r) =>
        r.ok ? r.json() : []
      ),
      fetch("/api/portal/requests").then((r) =>
        r.ok ? r.json() : []
      ),
    ]).then(([apps, reqs]) => {
      setApplications(Array.isArray(apps) ? apps : []);
      setRequests(Array.isArray(reqs) ? reqs : []);
      setLoading(false);
    });
  }, [sessionStatus]);

  function refreshRequests() {
    fetch("/api/portal/requests")
      .then((r) => (r.ok ? r.json() : []))
      .then((reqs) => setRequests(Array.isArray(reqs) ? reqs : []));
  }

  // Not authenticated
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <p className="text-dark/50">Loading...</p>
      </div>
    );
  }

  if (sessionStatus !== "authenticated" || !session?.user) {
    return (
      <div className="min-h-screen bg-light-gray">
        <header className="bg-white border-b border-light-gray px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <span className="text-xl font-bold font-[family-name:var(--font-alata)] text-primary">
              USSP
            </span>
            <span className="text-sm text-dark/50">Candidate Portal</span>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-alata)] mb-4">
            Welcome to Your Candidate Portal
          </h1>
          <p className="text-dark/60 mb-8 max-w-md mx-auto">
            Sign in with LinkedIn to view your application status and complete
            any requested documents.
          </p>
          <button
            onClick={() => signIn("linkedin", { callbackUrl: "/portal" })}
            className="px-6 py-3 bg-[#0077B5] text-white rounded-lg text-sm font-medium hover:bg-[#006097] transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Sign in with LinkedIn
          </button>
        </main>
      </div>
    );
  }

  // Group requests by application
  const requestsByApp = new Map<string, PortalRequest[]>();
  for (const req of requests) {
    const list = requestsByApp.get(req.application_id) || [];
    list.push(req);
    requestsByApp.set(req.application_id, list);
  }

  const pendingCount = requests.filter(
    (r) => r.status === "pending" || r.status === "rejected"
  ).length;

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-white border-b border-light-gray px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold font-[family-name:var(--font-alata)] text-primary">
              USSP
            </span>
            <span className="text-sm text-dark/50">Candidate Portal</span>
          </div>
          <div className="flex items-center gap-3">
            {session.user.image && (
              <img
                src={session.user.image}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm">{session.user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/careers" })}
              className="text-xs text-dark/50 hover:text-dark"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-dark/50">Loading your portal...</p>
        ) : (
          <div className="space-y-8">
            {/* Action Required Banner */}
            {pendingCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Action Required: {pendingCount} document{pendingCount !== 1 ? "s" : ""} needed
                  </p>
                  <p className="text-xs text-yellow-700">
                    Please complete the pending requests below to proceed with your application.
                  </p>
                </div>
              </div>
            )}

            {/* Applications */}
            <div>
              <h2 className="text-lg font-bold font-[family-name:var(--font-alata)] mb-4">
                Your Applications
              </h2>
              {applications.length === 0 ? (
                <p className="text-sm text-dark/50">
                  No applications found. <a href="/careers" className="text-primary hover:underline">Browse open positions</a>.
                </p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => {
                    const appRequests = requestsByApp.get(app.id) || [];
                    const pendingReqs = appRequests.filter(
                      (r) => r.status === "pending" || r.status === "rejected"
                    );

                    return (
                      <div
                        key={app.id}
                        className="bg-white rounded-lg border border-light-gray overflow-hidden"
                      >
                        {/* App Header */}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold">{app.job_title}</h3>
                            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                              {app.status_label}
                            </span>
                          </div>
                          <p className="text-xs text-dark/50">
                            Applied {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Document Requests */}
                        {appRequests.length > 0 && (
                          <div className="border-t border-light-gray">
                            <div className="px-5 py-3 bg-light-gray/30">
                              <p className="text-xs font-medium text-dark/60">
                                Document Requests ({appRequests.length})
                                {pendingReqs.length > 0 && (
                                  <span className="ml-2 text-yellow-700">
                                    &bull; {pendingReqs.length} pending
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="divide-y divide-light-gray">
                              {appRequests.map((req) => (
                                <div key={req.id} className="px-5 py-4">
                                  <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() =>
                                      setExpandedReq(
                                        expandedReq === req.id ? null : req.id
                                      )
                                    }
                                  >
                                    <div>
                                      <p className="text-sm font-medium">
                                        {DOCUMENT_REQUEST_TYPE_LABELS[req.request_type] || req.request_type}
                                      </p>
                                      {req.description && (
                                        <p className="text-xs text-dark/50 mt-0.5">
                                          {req.description}
                                        </p>
                                      )}
                                      {req.due_date && (
                                        <p className="text-xs text-dark/40">
                                          Due: {new Date(req.due_date).toLocaleDateString()}
                                        </p>
                                      )}
                                      {req.status === "rejected" && req.reviewer_notes && (
                                        <p className="text-xs text-red-600 mt-1">
                                          Rejected: {req.reviewer_notes}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${
                                          STATUS_COLORS[req.status] || "bg-gray-100"
                                        }`}
                                      >
                                        {req.status === "pending"
                                          ? "Action Required"
                                          : req.status === "rejected"
                                          ? "Resubmit"
                                          : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                      </span>
                                      <svg
                                        className={`w-4 h-4 text-dark/30 transition-transform ${
                                          expandedReq === req.id ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>

                                  {expandedReq === req.id && (
                                    <div className="mt-4">
                                      <DocumentRequestForm
                                        request={req}
                                        onSubmitted={refreshRequests}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="text-center text-xs text-dark/40 py-4">
              <p>
                Your sensitive information is encrypted and stored securely.
                USSP takes your privacy seriously.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
