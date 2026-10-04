import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/ui";
import { AUTHORS, booksByAuthor } from "@/lib/data";
import { Stars } from "@/components/ui";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Authors — East Africa's Voices",
  description: "Meet the novelists, scholars and storytellers publishing with Ukweli Books.",
};

export default function AuthorsPage() {
  return (
    <>
      <PageHero title="Meet the Authors" crumb="Authors" image="/images/author-ochieng.jpg" />
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28 }}>
            {AUTHORS.map((author, i) => {
              const books = booksByAuthor(author.slug);
              const avg = books.length ? books.reduce((s, b) => s + b.rating, 0) / books.length : 0;
              return (
                <Reveal key={author.slug} delay={i * 70}>
                  <Link href={`/authors/${author.slug}`} className="category-card" style={{ minHeight: 0 }}>
                    <div style={{ display: "flex", gap: 18, alignItems: "center", background: "#fff", padding: "26px 24px", border: "1px solid #eee" }}>
                      <div style={{ position: "relative", width: 86, height: 86, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                        {author.photo ? (
                          <Image src={author.photo} alt={`Portrait of ${author.name}`} fill style={{ objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "#1089ff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700 }}>
                            {author.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontSize: 19, fontWeight: 600, margin: 0 }}>{author.name}</h3>
                        <p style={{ margin: "3px 0 6px", fontSize: 12.5, color: "#999", display: "flex", alignItems: "center", gap: 5 }}>
                          <MapPin size={12} /> {author.location}
                        </p>
                        <Stars rating={Math.round(avg * 10) / 10} />
                        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#1089ff", display: "flex", alignItems: "center", gap: 6 }}>
                          {books.length} {books.length === 1 ? "title" : "titles"} <ArrowRight size={13} />
                        </p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
