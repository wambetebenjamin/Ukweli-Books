"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email address.");
    setState("busy");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Could not subscribe right now — try again shortly.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p style={{ display: "flex", alignItems: "center", gap: 10, color: "#01d28e", fontWeight: 500, fontSize: 15 }}>
        <CheckCircle2 /> You&apos;re on the list — the next editors&apos; letter arrives with the new moon.
      </p>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <input
        className="input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        required
      />
      <button className="btn btn-secondary" disabled={state === "busy"}>
        <Mail /> {state === "busy" ? "Subscribing…" : "Subscribe"}
      </button>
      {error && <p style={{ width: "100%", color: "#ff8b8b", fontSize: 13, margin: "8px 0 0" }}>{error}</p>}
    </form>
  );
}
