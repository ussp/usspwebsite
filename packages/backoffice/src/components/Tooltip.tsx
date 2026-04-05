"use client";

import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  text: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ text, children, position = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isRichContent = typeof text !== "string";

  useEffect(() => {
    if (show && triggerRef.current && tooltipRef.current) {
      const trigger = triggerRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = trigger.top - tooltip.height - 8;
          left = trigger.left + trigger.width / 2 - tooltip.width / 2;
          break;
        case "bottom":
          top = trigger.bottom + 8;
          left = trigger.left + trigger.width / 2 - tooltip.width / 2;
          break;
        case "left":
          top = trigger.top + trigger.height / 2 - tooltip.height / 2;
          left = trigger.left - tooltip.width - 8;
          break;
        case "right":
          top = trigger.top + trigger.height / 2 - tooltip.height / 2;
          left = trigger.right + 8;
          break;
      }

      setCoords({ top, left });
    }
  }, [show, position]);

  function handleShow() {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setShow(true);
  }

  function handleHide() {
    if (isRichContent) {
      hideTimeout.current = setTimeout(() => setShow(false), 150);
    } else {
      setShow(false);
    }
  }

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      className="inline-flex items-center"
    >
      {children}
      {show && (
        <div
          ref={tooltipRef}
          onMouseEnter={isRichContent ? handleShow : undefined}
          onMouseLeave={isRichContent ? handleHide : undefined}
          className={`fixed z-50 max-w-xs px-3 py-2 text-xs text-white bg-near-black rounded-lg shadow-lg ${
            isRichContent ? "" : "pointer-events-none"
          }`}
          style={{ top: coords.top, left: coords.left }}
        >
          {text}
        </div>
      )}
    </span>
  );
}
