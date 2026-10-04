"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import type { Book } from "@/lib/data";

/** PDF preview modal — renders the first 10 pages (full-screen on mobile). */
export default function PreviewModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="modal-root preview-modal open" role="dialog" aria-label={`Preview of ${book.title}`}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-panel modal-lg">
        <div className="preview-header">
          <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <h3 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</h3>
            <span className="badge">First 10 pages</span>
          </div>
          <button className="icon-btn on-light" onClick={onClose} aria-label="Close preview" style={{ flex: "none" }}>
            <X />
          </button>
        </div>
        <div className="preview-frame-wrap">
          {!loaded && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(255,255,255,0.7)", padding: 40, fontSize: 14 }}>
              <Loader2 className="spin" style={{ animation: "spin 1s linear infinite" }} /> Loading preview…
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          <iframe
            src={`/api/preview/${book.slug}`}
            title={`First 10 pages of ${book.title}`}
            onLoad={() => setLoaded(true)}
            style={loaded ? undefined : { position: "absolute", opacity: 0, pointerEvents: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
