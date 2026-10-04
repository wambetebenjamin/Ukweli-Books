import { SEED_REVIEWS, getBook, type Review } from "@/lib/data";
import { kv } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/reviews?slug= — seed reviews + community reviews (Vercel KV). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "";
  const stored = (await kv.get<Review[]>(`reviews:${slug}`)) ?? [];
  const seeded = SEED_REVIEWS.filter((r) => r.bookSlug === slug);
  const reviews = [...stored, ...seeded]
    .map((r) => ({ id: r.id, name: r.name, rating: r.rating, date: r.date, text: r.text }))
    .sort((a, b) => b.date.localeCompare(a.date));
  return Response.json({ ok: true, count: reviews.length, reviews });
}

/** POST /api/reviews — save a new review. */
export async function POST(req: Request) {
  let body: { bookSlug?: string; name?: string; rating?: number; text?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const book = body.bookSlug ? getBook(body.bookSlug) : undefined;
  if (!book) return Response.json({ ok: false, error: "Book not found." }, { status: 404 });

  const name = body.name?.trim().slice(0, 60);
  const text = body.text?.trim().slice(0, 1200);
  const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 0)));
  if (!name || !text || !rating) {
    return Response.json({ ok: false, error: "Name, rating and review text are required." }, { status: 400 });
  }

  const review: Review = {
    id: `u-${Date.now().toString(36)}`,
    bookSlug: book.slug,
    name,
    rating,
    date: new Date().toISOString(),
    text,
  };
  const key = `reviews:${book.slug}`;
  const stored = (await kv.get<Review[]>(key)) ?? [];
  await kv.set(key, [review, ...stored].slice(0, 100));

  return Response.json({ ok: true, review });
}
