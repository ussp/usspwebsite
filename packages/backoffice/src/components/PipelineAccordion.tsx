"use client";

import { useState } from "react";
import type { ApplicationStatus } from "@ussp-platform/core/types/admin";
import {
  PIPELINE_STAGES,
  TERMINAL_STATUSES,
  STAGE_LABELS,
} from "@ussp-platform/core/types/admin";

interface StatusHistoryEntry {
  status: string;
  changed_at: string;
  changed_by_name: string | null;
}

interface PipelineAccordionProps {
  currentStatus: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];
  onAdvance: () => Promise<void>;
  onDeactivate: () => Promise<void>;
  onManualSet: (status: ApplicationStatus) => Promise<void>;
  isDuplicate?: boolean;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function PipelineAccordion({
  currentStatus,
  statusHistory,
  onAdvance,
  onDeactivate,
  onManualSet,
  isDuplicate,
}: PipelineAccordionProps) {
  const [advancing, setAdvancing] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showManualMenu, setShowManualMenu] = useState(false);

  const isTerminal = TERMINAL_STATUSES.includes(currentStatus);
  const currentIndex = PIPELINE_STAGES.indexOf(currentStatus);
  const isLastStage = currentIndex === PIPELINE_STAGES.length - 1;

  // Build a map of stage -> history entry
  const historyMap = new Map<string, StatusHistoryEntry>();
  for (const entry of statusHistory) {
    historyMap.set(entry.status, entry);
  }

  async function handleAdvance() {
    setAdvancing(true);
    try {
      await onAdvance();
    } finally {
      setAdvancing(false);
    }
  }

  async function handleDeactivate() {
    if (!confirm("Are you sure you want to deactivate (reject) this application?")) return;
    setDeactivating(true);
    try {
      await onDeactivate();
    } finally {
      setDeactivating(false);
    }
  }

  async function handleManualSet(status: ApplicationStatus) {
    setShowManualMenu(false);
    await onManualSet(status);
  }

  return (
    <div className="bg-white rounded-lg border border-light-gray p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Pipeline</h3>
        <div className="relative">
          <button
            onClick={() => setShowManualMenu(!showManualMenu)}
            className="text-dark/40 hover:text-dark/70 text-sm px-2 py-1 rounded hover:bg-light-gray transition-colors"
            title="Manual status override"
          >
            &bull;&bull;&bull;
          </button>
          {showManualMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-light-gray rounded-lg shadow-lg z-10 w-48 py-1">
              <p className="text-[10px] text-dark/40 px-3 py-1 uppercase tracking-wide">Set status manually</p>
              {[...PIPELINE_STAGES, ...TERMINAL_STATUSES].map((s) => (
                <button
                  key={s}
                  onClick={() => handleManualSet(s)}
                  className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-light-gray transition-colors ${
                    currentStatus === s ? "text-primary font-medium" : "text-dark/70"
                  }`}
                >
                  {STAGE_LABELS[s]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Duplicate applicant banner */}
      {isDuplicate && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          This is a duplicate applicant.
        </div>
      )}

      {/* Terminal status banner */}
      {isTerminal && (
        <div
          className={`mb-4 px-3 py-2 rounded-lg text-sm font-medium ${
            currentStatus === "rejected"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-gray-100 border border-gray-200 text-gray-600"
          }`}
        >
          {STAGE_LABELS[currentStatus]}
          {historyMap.has(currentStatus) && (
            <span className="font-normal ml-1">
              &middot; {timeAgo(historyMap.get(currentStatus)!.changed_at)}
              {historyMap.get(currentStatus)!.changed_by_name &&
                ` by ${historyMap.get(currentStatus)!.changed_by_name}`}
            </span>
          )}
        </div>
      )}

      {/* Pipeline stages */}
      <div className="space-y-0">
        {PIPELINE_STAGES.map((stage, index) => {
          const isCompleted = !isTerminal && currentIndex > index;
          const isCurrent = !isTerminal && currentIndex === index;
          const isFuture = isTerminal || currentIndex < index;
          // For terminal: show all as completed up to where they were before terminal
          const historyEntry = historyMap.get(stage);
          const wasReached = !!historyEntry;

          // Determine circle state
          let circleClass: string;
          if (isTerminal) {
            circleClass = wasReached
              ? "border-emerald-500 bg-emerald-500"
              : "border-gray-300 bg-white";
          } else if (isCompleted) {
            circleClass = "border-emerald-500 bg-emerald-500";
          } else if (isCurrent) {
            circleClass = "border-emerald-500 bg-white";
          } else {
            circleClass = "border-gray-300 bg-white";
          }

          return (
            <div key={stage}>
              <div
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors ${
                  isCurrent ? "bg-blue-50/50" : ""
                }`}
              >
                {/* Circle indicator */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                  >
                    {(isCompleted || (isTerminal && wasReached)) && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isCurrent && (
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    )}
                  </div>
                </div>

                {/* Stage label */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      isCurrent
                        ? "font-semibold text-dark"
                        : isCompleted || (isTerminal && wasReached)
                          ? "font-medium text-dark/70"
                          : "text-dark/40"
                    }`}
                  >
                    {STAGE_LABELS[stage]}
                  </p>
                </div>

                {/* Chevron for current stage */}
                {isCurrent && (
                  <svg className="w-4 h-4 text-dark/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
                {!isCurrent && (
                  <svg className="w-4 h-4 text-dark/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>

              {/* Expanded content for current stage */}
              {isCurrent && (
                <div className="ml-12 pb-3 space-y-3">
                  {/* History info */}
                  {historyEntry && (
                    <p className="text-xs text-dark/50 italic">
                      Moved to this step on{" "}
                      {new Date(historyEntry.changed_at).toLocaleDateString()}{" "}
                      {new Date(historyEntry.changed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {historyEntry.changed_by_name && (
                        <> by {historyEntry.changed_by_name}</>
                      )}
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {!isLastStage && (
                      <button
                        onClick={handleAdvance}
                        disabled={advancing}
                        className="px-4 py-1.5 text-sm font-medium border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                      >
                        {advancing ? "Advancing..." : "Advance"}
                      </button>
                    )}
                    <button
                      onClick={handleDeactivate}
                      disabled={deactivating}
                      className="px-4 py-1.5 text-sm font-medium border-2 border-red-400 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      {deactivating ? "..." : "Deactivate"}
                    </button>
                  </div>
                </div>
              )}

              {/* Connector line between stages */}
              {index < PIPELINE_STAGES.length - 1 && !isCurrent && (
                <div className="ml-[22px] h-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
