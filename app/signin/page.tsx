import type { Metadata } from "next";
import { Suspense } from "react";
import SignInClient from "./SignInClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Ukweli Books to open your library, downloads and subscription.",
};

export default function SignInPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return (
    <section className="section" style={{ paddingTop: "11em", minHeight: "80vh", background: "#f8f9fa" }}>
      <div className="container">
        <Suspense>
          <SignInClient googleEnabled={googleEnabled} />
        </Suspense>
      </div>
    </section>
  );
}
