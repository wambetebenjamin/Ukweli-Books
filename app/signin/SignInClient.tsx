"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { BookOpen, KeyRound, Mail } from "lucide-react";

function SignInInner({ googleEnabled }: { googleEnabled: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/library";

  async function emailSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setBusy(true);
    await signIn("email-demo", { email, name, callbackUrl });
  }

  return (
    <div className="signin-card">
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <BookOpen size={34} style={{ color: "#1089ff", marginBottom: 10 }} />
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Welcome back, reader</h1>
        <p style={{ fontSize: 14, margin: 0 }}>Sign in to open your library, downloads and subscription.</p>
      </div>

      {googleEnabled && (
        <>
          <button className="btn btn-outline-black oauth-btn" onClick={() => signIn("google", { callbackUrl })}>
            <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.8 39.4 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Continue with Google
          </button>
          <div className="divider">or with email</div>
        </>
      )}

      <form onSubmit={emailSignIn}>
        <div className="form-group">
          <label htmlFor="si-name">Name</label>
          <input id="si-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Achieng Otieno" required />
        </div>
        <div className="form-group">
          <label htmlFor="si-email">Email address</label>
          <input id="si-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <button className="btn btn-primary btn-block" disabled={busy}>
          <Mail /> {busy ? "Signing you in…" : "Sign In with Email"}
        </button>
        <p style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#999", marginTop: 14, marginBottom: 0 }}>
          <KeyRound size={13} />
          {googleEnabled
            ? "Email sign-in sends a one-time code — no password needed."
            : "Demo mode: any valid email signs you in (no SMTP configured). Your purchases attach to this email."}
        </p>
      </form>
    </div>
  );
}

export default function SignInClient({ googleEnabled }: { googleEnabled: boolean }) {
  return (
    <Suspense>
      <SignInInner googleEnabled={googleEnabled} />
    </Suspense>
  );
}
