import { getAuthor, getBook } from "@/lib/data";

export const revalidate = 300;

/** GET /api/books/[slug] — single book with full metadata. */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const book = getBook(params.slug);
  if (!book) return Response.json({ ok: false, error: "Book not found" }, { status: 404 });
  const author = getAuthor(book.authorSlug);
  return Response.json({
    ok: true,
    book: {
      ...book,
      author,
      cover: `/api/covers/${book.slug}?w=600`,
      previewUrl: `/api/preview/${book.slug}`,
    },
  });
}
