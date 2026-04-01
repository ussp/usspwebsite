"use client";

import { useState } from "react";
import { AI_LAW_CATALOG, getAvailableStates, getLawsByState, getFederalLaws } from "@ussp-platform/core";
import type { AILaw } from "@ussp-platform/core";

function LawCard({ law }: { law: AILaw }) {
  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    effective_2026: "bg-amber-100 text-amber-700",
    effective_2027: "bg-amber-100 text-amber-700",
    proposed: "bg-gray-100 text-gray-600",
    enacted: "bg-blue-100 text-blue-700",
  };

  const statusLabels: Record<string, string> = {
    active: "Active",
    effective_2026: "Effective 2026",
    effective_2027: "Effective 2027",
    proposed: "Proposed",
    enacted: "Enacted",
  };

  return (
    <div className="border border-light-gray rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold">{law.law_name}</h4>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${statusColors[law.status] || "bg-gray-100 text-gray-600"}`}>
          {statusLabels[law.status] || law.status}
        </span>
      </div>
      <p className="text-xs text-dark/60 mb-2">{law.summary}</p>
      <div className="bg-blue-50 rounded p-2 mb-2">
        <p className="text-xs text-blue-800">
          <strong>Impact on AI training:</strong> {law.ai_training_impact}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {law.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-light-gray text-dark/50 capitalize">
              {tag}
            </span>
          ))}
        </div>
        <a
          href={law.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline font-medium"
        >
          Read law text &rarr;
        </a>
      </div>
    </div>
  );
}

export default function StateLawSelector() {
  const [selectedState, setSelectedState] = useState("");
  const states = getAvailableStates();
  const federalLaws = getFederalLaws();
  const stateLaws = selectedState ? getLawsByState(selectedState).filter((l) => l.jurisdiction_code !== "US") : [];

  return (
    <div>
      {/* State selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select the organization&apos;s primary state</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">-- Choose a state --</option>
          {states.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
        <p className="text-[11px] text-dark/40 mt-1">
          This determines which state-specific AI regulations apply to the organization.
        </p>
      </div>

      {/* State-specific laws */}
      {selectedState && stateLaws.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">
            {states.find((s) => s.code === selectedState)?.name} AI Regulations
          </h4>
          <div className="space-y-3">
            {stateLaws.map((law) => (
              <LawCard key={law.id} law={law} />
            ))}
          </div>
        </div>
      )}

      {selectedState && stateLaws.length === 0 && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-800">
            No state-specific AI regulations found for {states.find((s) => s.code === selectedState)?.name}.
            Federal regulations below still apply.
          </p>
        </div>
      )}

      {/* Federal laws (always shown) */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Federal Regulations (apply to all states)</h4>
        <div className="space-y-3">
          {federalLaws.map((law) => (
            <LawCard key={law.id} law={law} />
          ))}
        </div>
      </div>
    </div>
  );
}
