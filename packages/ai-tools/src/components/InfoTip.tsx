"use client";

import { useState } from "react";

interface InfoTipProps {
  text: string;
  children?: React.ReactNode;
}

/**
 * Inline tooltip for contextual help. Hover or click the (?) icon to show help text.
 * Use next to form labels for field-level guidance.
 */
export default function InfoTip({ text, children }: InfoTipProps) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="w-4 h-4 rounded-full bg-dark/10 text-dark/40 flex items-center justify-center text-[10px] font-bold hover:bg-primary/20 hover:text-primary transition-colors cursor-help"
        aria-label="Help"
      >
        ?
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64">
          <div className="bg-near-black text-white text-xs rounded-lg px-3 py-2 shadow-lg leading-relaxed">
            {text}
            {children}
          </div>
          <div className="w-2 h-2 bg-near-black rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </span>
  );
}
