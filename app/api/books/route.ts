import { BOOKS, getAuthor, searchBooks } from "@/lib/data";

export const revalidate = 300;

/** GET /api/books?page=1&limit=10&category=fiction&q=… — paginated catalogue. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 10)));
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  let list = q ? searchBooks(q) : [...BOOKS];
  if (category) list = list.filter((b) => b.category === category);

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const items = list.slice((page - 1) * limit, page * limit).map((b) => ({
    slug: b.slug,
    title: b.title,
    author: getAuthor(b.authorSlug)?.name,
    authorSlug: b.authorSlug,
    price: b.price,
    free: b.price === 0,
    category: b.category,
    genre: b.genre,
    rating: b.rating,
    reviewCount: b.reviewCount,
    year: b.year,
    formats: b.formats,
    cover: `/api/covers/${b.slug}`,
  }));

  return Response.json({ ok: true, page, limit, total, totalPages, items });
}
