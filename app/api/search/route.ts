import { getAuthor, searchBooks } from "@/lib/data";

export const dynamic = "force-dynamic";

/** GET /api/search?q= — full-text search on title, author and genre. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const results = searchBooks(q).map((b) => ({
    slug: b.slug,
    title: b.title,
    author: getAuthor(b.authorSlug)?.name ?? "",
    authorSlug: b.authorSlug,
    price: b.price,
    genre: b.genre,
    rating: b.rating,
    cover: `/api/covers/${b.slug}?w=120`,
  }));
  return Response.json({ ok: true, q, count: results.length, results });
}
