"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    if (!email.includes("@")) return setError("Enter a valid email so we can reply.");
    setState("busy");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email,
          subject: form.get("subject"),
          message: form.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Could not send right now — please use WhatsApp instead.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="empty-state" style={{ padding: "60px 30px" }}>
        <CheckCircle2 style={{ width: 44, height: 44, color: "#01d28e" }} />
        <h3>Message received</h3>
        <p>Asante! We reply within one working hour, Monday to Saturday.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ background: "#f8f9fa", padding: "36px 32px" }}>
      <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 22 }}>Send a Message</h3>
      <div className="form-group">
        <label htmlFor="ct-name">Your name</label>
        <input id="ct-name" name="name" className="input" placeholder="Achieng Otieno" required />
      </div>
      <div className="form-group">
        <label htmlFor="ct-email">Email</label>
        <input id="ct-email" name="email" type="email" className="input" placeholder="you@example.com" required />
      </div>
      <div className="form-group">
        <label htmlFor="ct-subject">Subject</label>
        <select id="ct-subject" name="subject" className="select" defaultValue="Finding a book">
          <option>Finding a book</option>
          <option>Download help</option>
          <option>School / institutional account</option>
          <option>Publishing with Ukweli</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="ct-msg">Message</label>
        <textarea id="ct-msg" name="message" className="textarea" placeholder="Tell us what you need…" required />
      </div>
      {error && <p style={{ color: "#dc3545", fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <button className="btn btn-primary btn-block" disabled={state === "busy"}>
        <Send /> {state === "busy" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
