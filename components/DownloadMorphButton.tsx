"use client";

import { useRef, useState } from "react";
import { Check, Download } from "lucide-react";

/**
 * Download button motion spec: on click the button morphs into a progress
 * bar, then into a checkmark. prefers-reduced-motion → instant state change
 * (all transitions removed by the global RM block).
 */
export default function DownloadMorphButton({
  href,
  label = "Download",
  fileName,
  className = "btn btn-secondary",
  small,
}: {
  href: string;
  label?: string;
  fileName?: string;
  className?: string;
  small?: boolean;
}) {
  const [state, setState] = useState<"idle" | "downloading" | "done">("idle");
  const busy = useRef(false);

  const start = () => {
    if (busy.current) return;
    busy.current = true;
    setState("downloading");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      setState("done");
      const a = document.createElement("a");
      a.href = href;
      if (fileName) a.download = fileName;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => { setState("idle"); busy.current = false; }, 5000);
    }, reduced ? 150 : 1700);
  };

  return (
    <button
      type="button"
      onClick={start}
      className={`dl-btn ${className} ${small ? "btn-sm" : ""} ${state}`}
      aria-live="polite"
    >
      <span className="dl-bar" aria-hidden />
      <span className="dl-label" style={{ position: "relative", zIndex: 1 }}>
        <Download /> {state === "downloading" ? "Preparing…" : label}
      </span>
      <span className="dl-done" style={{ zIndex: 1 }}>
        <Check /> Downloaded
      </span>
    </button>
  );
}
