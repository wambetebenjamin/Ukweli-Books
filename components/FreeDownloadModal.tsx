"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MessageCircle, X } from "lucide-react";
import type { Book } from "@/lib/data";
import { whatsappDownloadLink } from "@/lib/utils";
import DownloadMorphButton from "@/components/DownloadMorphButton";

/** Free books: email capture → /api/free-download sends the link via email (and WhatsApp option). */
export default function FreeDownloadModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email address.");
    setBusy(true);
    try {
      const res = await fetch("/api/free-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: book.slug, email, name }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setToken(data.downloadToken as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const url = token ? `/api/download/${token}` : "";
  const absolute = token && typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  return (
    <div className="modal-root open" role="dialog" aria-label={`Download ${book.title} free`}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-panel">
        <button className="icon-btn on-light modal-close" onClick={onClose} aria-label="Close"><X /></button>
        {!token ? (
          <>
            <span className="badge badge-free">Free Download</span>
            <h3 style={{ marginTop: 12 }}>{book.title}</h3>
            <p className="modal-sub">No payment needed — tell us where to send your PDF and EPUB links.</p>
            <form onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="fd-name">Name (optional)</label>
                <input id="fd-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Achieng Otieno" />
              </div>
              <div className="form-group">
                <label htmlFor="fd-email">Email address</label>
                <input id="fd-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              {error && <p style={{ color: "#dc3545", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <button className="btn btn-secondary btn-block" disabled={busy}>
                {busy ? "Preparing your link…" : "Send My Free Book"}
              </button>
              <p style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#999", marginTop: 12, marginBottom: 0 }}>
                <Mail size={12} /> One email, no spam — plus our monthly editors&apos; list (unsubscribe anytime).
              </p>
            </form>
          </>
        ) : (
          <div className="modal-success">
            <div className="success-icon"><CheckCircle2 /></div>
            <h3>Your Book Is Ready</h3>
            <p>We&apos;ve also sent the link to <strong>{email}</strong>. It stays valid for 7 days.</p>
            <div className="link-row">
              <DownloadMorphButton href={url} label="Download Free PDF" fileName={`${book.slug}.pdf`} />
              <a className="btn btn-outline-black" href={whatsappDownloadLink(book.title, absolute)} target="_blank" rel="noreferrer">
                <MessageCircle size={14} /> Get Download Link via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
