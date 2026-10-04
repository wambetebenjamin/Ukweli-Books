import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/ui";
import { CATEGORIES, booksByCategory, getCategory } from "@/lib/data";

export const revalidate = 300;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cat = getCategory(params.slug);
  if (!cat) return {};
  return {
    title: `${cat.name} Books`,
    description: `${cat.blurb} — Browse ${cat.name} on Ukweli Books. PDF and EPUB, free and paid.`,
    openGraph: { images: [{ url: cat.image }] },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = getCategory(params.slug);
  if (!cat) notFound();
  const books = booksByCategory(cat.slug);
  return (
    <>
      <PageHero title={cat.name} crumb={`Categories · ${cat.name}`} image={cat.image} />
      <section className="section">
        <div className="container">
          <p style={{ maxWidth: 560, marginBottom: 40 }}>{cat.blurb}</p>
          {books.length === 0 ? (
            <div className="empty-state">
              <h3>New titles coming to this shelf</h3>
              <p>We add books weekly. Ask on WhatsApp if you can&apos;t find what you need.</p>
            </div>
          ) : (
            <div className="grid-books cols-4">
              {books.map((b, i) => (
                <Reveal key={b.slug} delay={(i % 8) * 70}>
                  <BookCard book={b} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
