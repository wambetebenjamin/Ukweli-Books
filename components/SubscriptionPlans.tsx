"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard, Smartphone, X } from "lucide-react";
import { PLANS, annualPrice, type Plan } from "@/lib/data";
import { formatKES } from "@/lib/utils";

/**
 * Ukweli Unlimited plans with the monthly/annual toggle.
 * Annual = 20% off; prices swap with a 300ms counter-flip animation.
 */
export default function SubscriptionPlans({ compact }: { compact?: boolean }) {
  const [annual, setAnnual] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [checkout, setCheckout] = useState<Plan | null>(null);

  const toggle = (toAnnual: boolean) => {
    if (toAnnual === annual) return;
    setAnnual(toAnnual);
    setFlipping(true);
    setTimeout(() => setFlipping(false), 320);
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div className={`billing-toggle ${annual ? "annual" : ""}`} role="tablist" aria-label="Billing period">
          <span className="toggle-thumb" aria-hidden />
          <button className={annual ? "" : "active"} onClick={() => toggle(false)} role="tab" aria-selected={!annual}>
            Monthly
          </button>
          <button className={annual ? "active" : ""} onClick={() => toggle(true)} role="tab" aria-selected={annual}>
            Annual <span className="save-chip">−20%</span>
          </button>
        </div>
      </div>

      <div className="grid-plans">
        {PLANS.map((plan) => {
          const price = annual ? annualPrice(plan.monthlyKES) : plan.monthlyKES;
          return (
            <article key={plan.slug} className={`plan-card ${plan.featured ? "featured" : ""}`}>
              {plan.badge && <span className="badge">{plan.badge}</span>}
              <h3>{plan.name}</h3>
              <p className="plan-for">{plan.forWhom}</p>
              <div>
                <span className={`plan-price price-flip ${flipping ? "flip" : ""}`}>
                  <span className="kes">KES</span>
                  {price.toLocaleString("en-KE")}
                </span>
                <span className="plan-period">
                  {annual ? "per year — 20% off monthly" : "per month · cancel anytime"}
                </span>
              </div>
              <ul>
                {plan.inclusions.map((inc) => (
                  <li key={inc}>
                    <CheckCircle2 />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`btn ${plan.featured ? "btn-secondary" : "btn-black"} btn-block`}
                onClick={() => setCheckout(plan)}
              >
                Subscribe Now
              </button>
            </article>
          );
        })}
      </div>

      {!compact && (
        <p style={{ textAlign: "center", fontSize: 13, marginTop: 30, color: "#999" }}>
          All plans start with a 14-day free trial · Billed via M-Pesa or card · Institutions can pay by invoice.
        </p>
      )}

      {checkout && (
        <SubscribeCheckout plan={checkout} annual={annual} onClose={() => setCheckout(null)} />
      )}
    </>
  );
}

function SubscribeCheckout({ plan, annual, onClose }: { plan: Plan; annual: boolean; onClose: () => void }) {
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("254");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const amount = annual ? annualPrice(plan.monthlyKES) : plan.monthlyKES;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (method === "mpesa" && !/^254\d{9}$/.test(phone)) return setError("M-Pesa number format: 2547XXXXXXXX");
    setBusy(true);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.slug, billing: annual ? "annual" : "monthly", method, email, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Subscription failed.");
      setTimeout(() => setDone(true), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed.");
      setBusy(false);
    }
  }

  return (
    <div className="modal-root open" role="dialog" aria-label={`Subscribe to ${plan.name}`}>
      <div className="modal-backdrop" onClick={busy ? undefined : onClose} />
      <div className="modal-panel">
        <button className="icon-btn on-light modal-close" onClick={onClose} aria-label="Close"><X /></button>
        {!done ? (
          <>
            <h3>Ukweli Unlimited — {plan.name}</h3>
            <p className="modal-sub">
              {formatKES(amount)} {annual ? "per year" : "per month"} · 14-day free trial · cancel anytime.
            </p>
            <div className="pill-row" style={{ marginBottom: 18 }}>
              <button className={`pill ${method === "mpesa" ? "active" : ""}`} onClick={() => setMethod("mpesa")}>
                <Smartphone size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />M-Pesa
              </button>
              <button className={`pill ${method === "card" ? "active" : ""}`} onClick={() => setMethod("card")}>
                <CreditCard size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />Card (recurring)
              </button>
            </div>
            <form onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="sub-email">Email</label>
                <input id="sub-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              {method === "mpesa" && (
                <div className="form-group">
                  <label htmlFor="sub-phone">M-Pesa phone number</label>
                  <input id="sub-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))} placeholder="2547XXXXXXXX" required />
                </div>
              )}
              {error && <p style={{ color: "#dc3545", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <button className="btn btn-secondary btn-block" disabled={busy}>
                {busy ? "Setting up your plan…" : `Start Free Trial — then ${formatKES(amount)}/${annual ? "yr" : "mo"}`}
              </button>
            </form>
          </>
        ) : (
          <div className="modal-success">
            <div className="success-icon"><CheckCircle2 /></div>
            <h3>Welcome to Ukweli Unlimited</h3>
            <p>
              Your <strong>{plan.name}</strong> plan is active. We&apos;ve sent confirmation and your first download
              links to <strong>{email}</strong>. Usome kwa raha!
            </p>
            <a href="/library" className="btn btn-black" onClick={onClose}>Open My Library</a>
          </div>
        )}
      </div>
    </div>
  );
}
