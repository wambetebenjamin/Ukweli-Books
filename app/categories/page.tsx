import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/ui";
import { CATEGORIES, bookCountsByCategory } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Ukweli Books by category: fiction, academic & textbooks, African literature, business, law, health, children and more.",
};

export default function CategoriesPage() {
  const counts = bookCountsByCategory();
  return (
    <>
      <PageHero title="Categories" crumb="Categories" image="/images/about-shelves.jpg" />
      <section className="section">
        <div className="container">
          <div className="grid-categories" style={{ rowGap: 24 }}>
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <Link href={`/categories/${c.slug}`} className="category-card" style={{ minHeight: 260 }}>
                  <span className="cat-bg">
                    <Image src={c.image} alt="" fill sizes="(max-width: 768px) 50vw, 20vw" style={{ objectFit: "cover" }} />
                  </span>
                  <span className="cat-overlay" />
                  <h3>{c.name}</h3>
                  <span className="cat-count">{counts[c.slug] ?? 0} titles · {c.blurb}</span>
                  <span className="cat-link">Browse <ArrowRight /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
