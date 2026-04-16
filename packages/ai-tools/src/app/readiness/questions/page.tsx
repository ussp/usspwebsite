"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminTopbar from "@/components/AdminTopbar";
import { TEAM_MEMBER_ROLE_LABELS } from "@ussp-platform/core";
import type { TeamMemberRole } from "@ussp-platform/core";

interface Question {
  id: string;
  category: string;
  capability: string | null;
  question_text: string;
  description: string | null;
  roles: string[];
  entity_types: string[];
  version: number;
  status: string;
  created_by: string | null;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  dora_capability: "DORA Capabilities",
  ai_policy: "AI Policy",
  role_specific: "Role-Specific",
  workflow: "Workflow",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  draft: "bg-gray-100 text-gray-600",
  deprecated: "bg-red-100 text-red-600",
};

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState({ category: "", status: "active" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [filter]);

  async function loadQuestions() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.category) params.set("category", filter.category);
    if (filter.status) params.set("status", filter.status);
    const res = await fetch(`/api/readiness/questions?${params}`);
    setQuestions(await res.json());
    setLoading(false);
  }

  const filtered = search
    ? questions.filter((q) => q.question_text.toLowerCase().includes(search.toLowerCase()))
    : questions;

  return (
    <>
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-60 mt-14 p-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Question Bank</h1>
            <p className="text-sm text-dark/50">{questions.length} questions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <input type="text" placeholder="Search questions..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-light-gray rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30" />

          <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="border border-light-gray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>

        {/* Questions list */}
        {loading ? (
          <p className="text-dark/40">Loading...</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((q) => (
              <div key={q.id} className="bg-white rounded-lg border border-light-gray p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm">{q.question_text}</p>
                    {q.description && <p className="text-xs text-dark/40 mt-1">{q.description}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                        {CATEGORY_LABELS[q.category] || q.category}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${STATUS_COLORS[q.status]}`}>
                        {q.status} v{q.version}
                      </span>
                      {q.roles.length === 0 ? (
                        <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">Universal</span>
                      ) : (
                        q.roles.slice(0, 3).map((r) => (
                          <span key={r} className="text-[10px] bg-light-gray text-dark/50 px-1.5 py-0.5 rounded">
                            {TEAM_MEMBER_ROLE_LABELS[r as TeamMemberRole] || r}
                          </span>
                        ))
                      )}
                      {q.roles.length > 3 && (
                        <span className="text-[10px] text-dark/30">+{q.roles.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
