"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, Lock, MessageCircle, Smartphone, X } from "lucide-react";
import type { Book } from "@/lib/data";
import { formatKES, whatsappDownloadLink } from "@/lib/utils";
import DownloadMorphButton from "@/components/DownloadMorphButton";

interface OrderResult {
  bookSlug: string;
  title: string;
  downloadToken: string;
}

type Step = "details" | "processing" | "success" | "error";

/**
 * Purchase flow: M-Pesa STK push (Daraja) or card (Stripe) → the API issues
 * a 7-day signed download link, "delivered" via email + WhatsApp.
 * Demo mode (no API keys) simulates the STK push and issues real tokens.
 */
export default function CheckoutModal({
  books,
  onClose,
  onComplete,
}: {
  books: Book[];
  onClose: () => void;
  onComplete?: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("254");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const total = books.reduce((s, b) => s + b.price, 0);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email — your download links are sent there.");
    if (method === "mpesa" && !/^254\d{9}$/.test(phone)) return setError("M-Pesa number format: 2547XXXXXXXX");
    setStep("processing");
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slugs: books.map((b) => b.slug),
          method,
          email,
          name,
          phone: method === "mpesa" ? phone : undefined,
          card: method === "card" ? card : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Payment failed. Please try again.");
      // Simulated STK push confirmation window
      setTimeout(() => {
        setOrders(data.orders);
        setMessage(data.message);
        setStep("success");
        onComplete?.();
      }, 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setStep("error");
    }
  }

  return (
    <div className="modal-root open" role="dialog" aria-label="Checkout">
      <div className="modal-backdrop" onClick={step === "processing" ? undefined : onClose} />
      <div className="modal-panel">
        <button className="icon-btn on-light modal-close" onClick={onClose} aria-label="Close checkout" disabled={step === "processing"}>
          <X />
        </button>

        {(step === "details" || step === "error" || step === "processing") && (
          <>
            <h3>Complete Your Purchase</h3>
            <p className="modal-sub">
              {books.length} {books.length === 1 ? "book" : "books"} · Total <strong className="text-primary">{formatKES(total)}</strong>
              {" "}· download links arrive by email &amp; WhatsApp in seconds.
            </p>

            <div style={{ border: "1px solid #e6e6e6", padding: "12px 16px", marginBottom: 18, fontSize: 13 }}>
              {books.map((b) => (
                <div key={b.slug} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span style={{ color: "#4d4d4d" }}>{b.title}</span>
                  <strong style={{ color: "rgba(0,0,0,0.8)" }}>{b.price === 0 ? "Free" : formatKES(b.price)}</strong>
                </div>
              ))}
            </div>

            <div className="pill-row" role="tablist" aria-label="Payment method" style={{ marginBottom: 18 }}>
              <button className={`pill ${method === "mpesa" ? "active" : ""}`} onClick={() => setMethod("mpesa")} role="tab" aria-selected={method === "mpesa"}>
                <Smartphone size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />M-Pesa
              </button>
              <button className={`pill ${method === "card" ? "active" : ""}`} onClick={() => setMethod("card")} role="tab" aria-selected={method === "card"}>
                <CreditCard size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />Card (Visa / Mastercard)
              </button>
            </div>

            <form onSubmit={pay}>
              <div className="form-group">
                <label htmlFor="co-name">Full name</label>
                <input id="co-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Achieng Otieno" required />
              </div>
              <div className="form-group">
                <label htmlFor="co-email">Email — download links go here</label>
                <input id="co-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              {method === "mpesa" ? (
                <div className="form-group">
                  <label htmlFor="co-phone">M-Pesa phone number</label>
                  <input id="co-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))} placeholder="2547XXXXXXXX" required />
                  <small style={{ fontSize: 12, color: "#999" }}>You&apos;ll receive an STK push — enter your M-Pesa PIN to confirm.</small>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
                  <div className="form-group">
                    <label htmlFor="co-card">Card number</label>
                    <input id="co-card" className="input" inputMode="numeric" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="co-exp">Expiry</label>
                    <input id="co-exp" className="input" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="12/28" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="co-cvc">CVC</label>
                    <input id="co-cvc" className="input" inputMode="numeric" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} placeholder="123" required />
                  </div>
                </div>
              )}

              {error && <p style={{ color: "#dc3545", fontSize: 13, marginBottom: 12 }}>{error}</p>}

              <button className="btn btn-secondary btn-block" disabled={step === "processing"}>
                {step === "processing"
                  ? method === "mpesa"
                    ? "Waiting for M-Pesa confirmation…"
                    : "Authorising card…"
                  : `Pay ${formatKES(total)}${method === "mpesa" ? " via M-Pesa" : ""}`}
              </button>
              <p style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#999", marginTop: 12, marginBottom: 0 }}>
                <Lock size={12} /> Secured checkout · demo mode {method === "mpesa" ? "(Daraja STK push simulated)" : "(Stripe simulated)"} — no real charge.
              </p>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="modal-success">
            <div className="success-icon"><CheckCircle2 /></div>
            <h3>Asante! Payment Confirmed</h3>
            <p>{message} Links are valid for <strong>7 days</strong>; each book can be downloaded up to <strong>5 times</strong> from My Library.</p>
            <div style={{ textAlign: "left", marginTop: 20 }}>
              {orders.map((o) => {
                const url = `/api/download/${o.downloadToken}`;
                const absolute = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;
                return (
                  <div key={o.bookSlug} style={{ borderTop: "1px solid #eee", padding: "14px 0" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.8)", marginBottom: 10 }}>{o.title}</p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <DownloadMorphButton href={url} label="Download PDF" fileName={`${o.bookSlug}.pdf`} small className="btn btn-primary" />
                      <a className="btn btn-sm btn-secondary" href={whatsappDownloadLink(o.title, absolute)} target="_blank" rel="noreferrer">
                        <MessageCircle size={14} /> Get Link via WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="link-row">
              <button className="btn btn-black" onClick={() => { onClose(); router.push("/library"); }}>
                Go to My Library
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
