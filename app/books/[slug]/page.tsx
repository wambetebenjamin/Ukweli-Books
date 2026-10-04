import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Globe, Mail, Repeat, ShieldCheck } from "lucide-react";
import BookCard from "@/components/BookCard";
import BookDetailActions from "@/components/BookDetailActions";
import DescriptionToggle from "@/components/DescriptionToggle";
import Reveal from "@/components/Reveal";
import ReviewsSection from "@/components/ReviewsSection";
import { COVER_BLUR, SectionHead, Stars } from "@/components/ui";
import { BOOKS, getAuthor, getBook, relatedBooks, type Book } from "@/lib/data";
import { formatKES, truncate } from "@/lib/utils";

export const revalidate = 300;

export function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const book = getBook(params.slug);
  if (!book) return {};
  const author = getAuthor(book.authorSlug);
  const description = truncate(book.description[0], 155);
  return {
    title: `${book.title} — ${author?.name}`,
    description,
    openGraph: {
      type: "book",
      title: `${book.title} by ${author?.name}`,
      description,
      images: [{ url: `/api/covers/${book.slug}?w=600`, width: 600, height: 900, alt: `Cover of ${book.title}` }],
    },
    twitter: { card: "summary_large_image" },
  };
}

function jsonLd(book: Book, authorName: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        name: book.title,
        author: { "@type": "Person", name: authorName, url: `${base}/authors/${book.authorSlug}` },
        publisher: { "@type": "Organization", name: book.publisher },
        datePublished: String(book.year),
        numberOfPages: book.pages,
        inLanguage: book.language,
        bookFormat: "https://schema.org/EBook",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: book.rating,
          reviewCount: book.reviewCount,
        },
        image: `${base}/api/covers/${book.slug}?w=600`,
        url: `${base}/books/${book.slug}`,
      },
      {
        "@type": "Product",
        name: book.title,
        image: `${base}/api/covers/${book.slug}?w=600`,
        description: truncate(book.description[0], 280),
        offers: {
          "@type": "Offer",
          price: book.price,
          priceCurrency: "KES",
          availability: "https://schema.org/InStock",
          url: `${base}/books/${book.slug}`,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: book.rating,
          reviewCount: book.reviewCount,
        },
      },
    ],
  };
}

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = getBook(params.slug);
  if (!book) notFound();
  const author = getAuthor(book.authorSlug)!;
  const authorBooks = BOOKS.filter((b) => b.authorSlug === book.authorSlug);
  const related = relatedBooks(book);
  const isFree = book.price === 0;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(book, author.name)) }} />

      <section className="section" style={{ paddingTop: "9.5em", paddingBottom: "3.5em" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#999", marginBottom: 36, flexWrap: "wrap" }}>
            <Link href="/">Home</Link> <ChevronRight size={12} />
            <Link href="/browse">Browse</Link> <ChevronRight size={12} />
            <Link href={`/categories/${book.category}`}>{book.genre}</Link> <ChevronRight size={12} />
            <span style={{ color: "#4d4d4d" }}>{book.title}</span>
          </div>

          <div className="book-detail">
            {/* left: cover */}
            <div className="book-detail-cover">
              <div className="cover-frame">
                <Image
                  src={`/api/covers/${book.slug}?w=600`}
                  alt={`Cover of ${book.title} by ${author.name}`}
                  width={600}
                  height={900}
                  priority
                  placeholder="blur"
                  blurDataURL={COVER_BLUR}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                {book.formats.map((f) => (
                  <span key={f} className="badge badge-dark">{f}</span>
                ))}
                <span className="badge badge-dark">{book.fileSizeMB.toFixed(1)} MB</span>
                {isFree && <span className="badge badge-free">Free forever</span>}
              </div>
            </div>

            {/* right: details */}
            <div>
              <Link href={`/categories/${book.category}`} className="genre-tag" style={{ marginBottom: 10, display: "inline-block" }}>
                {book.genre}
              </Link>
              <h1 className="detail-title">{book.title}</h1>
              <p className="detail-author">
                by <Link href={`/authors/${author.slug}`}><strong>{author.name}</strong></Link>
              </p>
              <div className="detail-rating-row">
                <Stars rating={book.rating} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.8)" }}>{book.rating.toFixed(1)}</span>
                <span style={{ fontSize: 13, color: "#999" }}>({book.reviewCount.toLocaleString()} reviews)</span>
              </div>

              <div className="price-block">
                {isFree ? (
                  <>
                    <span className="price" style={{ color: "#00b377" }}>Free</span>
                    <span className="price-note">no payment — just your email</span>
                  </>
                ) : (
                  <>
                    <span className="price">{formatKES(book.price)}</span>
                    <span className="price-note">one-time purchase · yours forever</span>
                  </>
                )}
              </div>

              <BookDetailActions book={book} />

              <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "6px 0 8px" }}>
                <span className="delivery-note"><Mail /> Download link sent by email — with a WhatsApp option at checkout.</span>
                <span className="delivery-note"><Repeat /> Link valid 7 days · re-download anytime in My Library.</span>
                <span className="delivery-note"><ShieldChecIconFallback /> Signed, secure links · up to 5 downloads per book.</span>
              </div>

              <table className="spec-table">
                <tbody>
                  <tr><th>Author</th><td><Link href={`/authors/${author.slug}`}>{author.name}</Link></td></tr>
                  <tr><th>Publisher</th><td>{book.publisher}</td></tr>
                  <tr><th>Publication year</th><td>{book.year}</td></tr>
                  <tr><th>Language</th><td>{book.language}</td></tr>
                  <tr><th>Pages</th><td>{book.pages}</td></tr>
                  <tr><th>Formats</th><td>{book.formats.join(", ")}</td></tr>
                  <tr><th>File size</th><td>{book.fileSizeMB.toFixed(1)} MB</td></tr>
                  <tr><th>Category</th><td><Link href={`/categories/${book.category}`}>{book.genre}</Link></td></tr>
                  {book.language.includes("English") === false && (
                    <tr><th>Note</th><td><Globe size={13} style={{ verticalAlign: "-2px", marginRight: 6 }} />Kiswahili edition</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* description */}
      <section className="section no-pad-top" style={{ paddingBottom: "3.5em" }}>
        <div className="container">
          <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 18 }}>About This Book</h2>
          <DescriptionToggle paragraphs={book.description} />
        </div>
      </section>

      {/* author bio */}
      <section className="section no-pad-top" style={{ paddingBottom: "3.5em" }}>
        <div className="container">
          <div className="author-bio-card">
            {author.photo ? (
              <Image src={author.photo} alt={`Portrait of ${author.name}`} width={96} height={96} style={{ borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#1089ff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700 }}>
                {author.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
            )}
            <div>
              <h3>{author.name}</h3>
              <p>{author.bio}</p>
              <Link href={`/authors/${author.slug}`} className="view-all-link">
                All {authorBooks.length} {authorBooks.length === 1 ? "book" : "books"} by {author.name.split(" ")[0]} <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* reviews */}
      <section className="section no-pad-top" style={{ paddingBottom: "3.5em" }}>
        <div className="container">
          <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Reader Reviews</h2>
          <ReviewsSection bookSlug={book.slug} />
        </div>
      </section>

      {/* related */}
      <section className="section section-light">
        <div className="container">
          <SectionHead sub="Keep Reading" title="Related Books" style={{ marginBottom: 36 }} />
          <div className="carousel">
            {related.map((b, i) => (
              <Reveal key={b.slug} delay={i * 70}>
                <BookCard book={b} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* lucide icon alias kept server-side */
function ShieldChecIconFallback() {
  return <ShieldCheck />;
}
