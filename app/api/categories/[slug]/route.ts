import { booksByCategory, getAuthor, getCategory } from "@/lib/data";

export const revalidate = 300;

/** GET /api/categories/[slug] — books filtered by category. */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) return Response.json({ ok: false, error: "Category not found" }, { status: 404 });
  const books = booksByCategory(params.slug).map((b) => ({
    slug: b.slug,
    title: b.title,
    author: getAuthor(b.authorSlug)?.name,
    price: b.price,
    rating: b.rating,
    cover: `/api/covers/${b.slug}`,
  }));
  return Response.json({ ok: true, category, count: books.length, books });
}
