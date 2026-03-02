"use client";

import { useState } from "react";

interface ExpandableSectionProps {
  title: string;
  content: string;
}

export default function ExpandableSection({
  title,
  content,
}: ExpandableSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-light-gray/50 transition-colors"
      >
        <h3 className="text-lg font-[family-name:var(--font-alata)]">{title}</h3>
        <svg
          className={`w-5 h-5 text-dark/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-dark/70 font-[family-name:var(--font-montserrat)] leading-relaxed">
            {content}
          </p>
        </div>
      )}
    </div>
  );
}
