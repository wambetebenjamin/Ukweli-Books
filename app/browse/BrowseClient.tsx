"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import BookCard from "@/components/BookCard";
import Reveal from "@/components/Reveal";
import type { Book, Category } from "@/lib/data";
import { getAuthor } from "@/lib/data";

type SortKey = "featured" | "rating" | "price-asc" | "price-desc" | "newest";

export default function BrowseClient({ books, categories }: { books: Book[]; categories: Category[] }) {
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = cat === "all" ? books : books.filter((b) => b.category === cat);
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter((b) => {
        const author = getAuthor(b.authorSlug)?.name ?? "";
        return b.title.toLowerCase().includes(query) || author.toLowerCase().includes(query) || b.genre.toLowerCase().includes(query);
      });
    }
    const sorted = [...list];
    switch (sort) {
      case "rating": sorted.sort((a, b) => b.rating - a.rating); break;
      case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
      case "newest": sorted.sort((a, b) => b.year - a.year); break;
      default: sorted.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.reviewCount - a.reviewCount);
    }
    return sorted;
  }, [books, cat, sort, q]);

  return (
    <>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", marginBottom: 26 }}>
        <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 380 }}>
          <input
            className="input"
            style={{ paddingLeft: 44 }}
            placeholder="Filter by title, author, genre…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Filter books"
          />
          <Search size={17} style={{ position: "absolute", left: 15, top: 17, color: "#999" }} />
        </div>
        <select className="select" style={{ maxWidth: 210 }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort books">
          <option value="featured">Sort: Featured</option>
          <option value="rating">Sort: Top Rated</option>
          <option value="newest">Sort: Newest</option>
          <option value="price-asc">Sort: Price — Low to High</option>
          <option value="price-desc">Sort: Price — High to Low</option>
        </select>
      </div>

      <div className="pill-row" style={{ marginBottom: 34 }}>
        <button className={`pill ${cat === "all" ? "active" : ""}`} onClick={() => setCat("all")}>All ({books.length})</button>
        {categories.map((c) => (
          <button key={c.slug} className={`pill ${cat === c.slug ? "active" : ""}`} onClick={() => setCat(c.slug)}>
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Search />
          <h3>Nothing on this shelf yet</h3>
          <p>Try a different filter — or ask us on WhatsApp and we&apos;ll hunt it down for you.</p>
        </div>
      ) : (
        <div className="grid-books cols-4">
          {filtered.map((b, i) => (
            <Reveal key={b.slug} delay={(i % 8) * 60}>
              <BookCard book={b} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
