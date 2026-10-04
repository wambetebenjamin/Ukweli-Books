"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import BookCard from "@/components/BookCard";
import Reveal from "@/components/Reveal";
import { BOOKS, type Book } from "@/lib/data";

interface Hit {
  slug: string;
}

export default function SearchClient() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const [slugs, setSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSlugs(null);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data: { results: Hit[] }) => { if (!cancelled) setSlugs(data.results.map((h) => h.slug)); })
      .catch(() => { if (!cancelled) setSlugs([]); });
    return () => { cancelled = true; };
  }, [q]);

  const books: Book[] = slugs
    ? slugs.map((s) => BOOKS.find((b) => b.slug === s)).filter((b): b is Book => Boolean(b))
    : [];

  return (
    <>
      <p style={{ marginBottom: 26 }}>
        {slugs === null ? "Searching…" : slugs.length === 0 ? (
          <>No results for <strong>“{q}”</strong>.</>
        ) : (
          <>{slugs.length} {slugs.length === 1 ? "result" : "results"} for <strong>“{q}”</strong></>
        )}
      </p>
      {slugs !== null && books.length === 0 && (
        <div className="empty-state">
          <Search />
          <h3>No matches yet</h3>
          <p>Try a shorter query — or WhatsApp us the title and we&apos;ll source it for you.</p>
        </div>
      )}
      <div className="grid-books cols-4">
        {books.map((b, i) => (
          <Reveal key={b.slug} delay={(i % 8) * 60}>
            <BookCard book={b} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
