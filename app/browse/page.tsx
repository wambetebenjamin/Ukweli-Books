import type { Metadata } from "next";
import BrowseClient from "./BrowseClient";
import { PageHero } from "@/components/ui";
import { BOOKS, CATEGORIES } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Browse Books",
  description: "Browse the full Ukweli Books catalogue — East African fiction, textbooks, business, law, health, children's books and more. Free and paid, PDF and EPUB.",
};

export default function BrowsePage() {
  return (
    <>
      <PageHero title="Browse Books" crumb="Browse Books" image="/images/about-shelves.jpg" />
      <section className="section">
        <div className="container">
          <BrowseClient books={BOOKS} categories={CATEGORIES} />
        </div>
      </section>
    </>
  );
}
