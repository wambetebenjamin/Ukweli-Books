import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: "12em", minHeight: "70vh", textAlign: "center" }}>
      <div className="container">
        <BookOpen size={52} style={{ color: "#1089ff", marginBottom: 18 }} />
        <h1 style={{ fontSize: 40, fontWeight: 700 }}>This page fell off the shelf</h1>
        <p style={{ maxWidth: 420, margin: "0 auto 28px" }}>
          The page you&apos;re looking for doesn&apos;t exist — but thousands of books do.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-black">Back Home</Link>
          <Link href="/browse" className="btn btn-primary">Browse Books</Link>
        </div>
      </div>
    </section>
  );
}
