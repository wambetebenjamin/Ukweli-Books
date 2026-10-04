import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import BookCard from "@/components/BookCard";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHead } from "@/components/ui";
import { freeBooks } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Free Books",
  description: "24 freely available titles: African classics, public domain works, government education materials and open academic papers. Download free with your email.",
};

export default function FreeBooksPage() {
  const free = freeBooks();
  return (
    <>
      <PageHero title="Free Books" crumb="Free Books" image="/images/community-6.jpg" />
      <section className="section">
        <div className="container">
          <SectionHead sub="No Cost. All Wonderful." title={`${free.length} Titles, Free Forever`} style={{ marginBottom: 40 }}>
            African classics, public-domain works, government education materials and open academic
            papers. Enter your email on any book — the download link arrives in seconds.
          </SectionHead>
          <div className="grid-books cols-4">
            {free.map((b, i) => (
              <Reveal key={b.slug} delay={(i % 8) * 70}>
                <BookCard book={b} />
              </Reveal>
            ))}
          </div>

          <div className="empty-state" style={{ marginTop: 60, display: "flex", gap: 20, alignItems: "center", textAlign: "left", padding: "34px 30px" }}>
            <BookOpen style={{ width: 40, height: 40, color: "#01d28e", flex: "none", margin: 0 }} />
            <div>
              <h3 style={{ marginBottom: 6 }}>Know a public-domain gem?</h3>
              <p style={{ margin: 0 }}>
                Tell us on WhatsApp and our editors will typeset and release it free — beautifully.
                The free shelf is never finished.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
