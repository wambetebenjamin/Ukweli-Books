import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import BookCard from "@/components/BookCard";
import Reveal from "@/components/Reveal";
import { SectionHead } from "@/components/ui";
import { AUTHORS, booksByAuthor, getAuthor } from "@/lib/data";

export const revalidate = 300;

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const author = getAuthor(params.slug);
  if (!author) return {};
  return {
    title: `${author.name} — Author`,
    description: author.bio,
    openGraph: author.photo ? { images: [{ url: author.photo }] } : undefined,
  };
}

function personJsonLd(author: NonNullable<ReturnType<typeof getAuthor>>, bookCount: number) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    address: { "@type": "PostalAddress", addressLocality: author.location },
    description: author.bio,
    image: author.photo ? `${base}${author.photo}` : undefined,
    url: `${base}/authors/${author.slug}`,
    worksFor: { "@type": "Organization", name: "Ukweli Books" },
    knowsAbout: `${bookCount} published works on Ukweli Books`,
  };
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = getAuthor(params.slug);
  if (!author) notFound();
  const books = booksByAuthor(author.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(author, books.length)) }} />

      <section className="section" style={{ paddingTop: "10em", paddingBottom: "4em" }}>
        <div className="container">
          <div className="author-spot-row" style={{ marginBottom: 0 }}>
            <Reveal variant="left">
              <div className="author-photo">
                {author.photo ? (
                  <Image src={author.photo} alt={`Portrait of ${author.name}`} fill sizes="(max-width: 992px) 100vw, 38vw" style={{ objectFit: "cover" }} priority />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, fontWeight: 700 }}>
                    {author.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal variant="right">
              <div>
                <span className="author-role">{author.role}</span>
                <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 6 }}>{author.name}</h1>
                <p style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: "#999" }}>
                  <MapPin size={14} /> {author.location}
                </p>
                {author.longBio.map((p, i) => (
                  <p key={i} style={{ fontSize: 15 }}>{p}</p>
                ))}
                <div className="author-stats">
                  <div><span className="n">{books.length}</span><span className="l">Titles on Ukweli</span></div>
                  <div>
                    <span className="n">
                      {books.length ? (books.reduce((s, b) => s + b.rating, 0) / books.length).toFixed(1) : "—"}
                    </span>
                    <span className="l">Avg. Rating</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <SectionHead sub="The Shelf" title={`Books by ${author.name.split(" ")[0]}`} style={{ marginBottom: 40 }} />
          <div className="grid-books cols-4">
            {books.map((b, i) => (
              <Reveal key={b.slug} delay={(i % 8) * 70}>
                <BookCard book={b} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
