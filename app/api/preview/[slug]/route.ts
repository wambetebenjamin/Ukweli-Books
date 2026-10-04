import { getBook } from "@/lib/data";
import { generateBookPdf } from "@/lib/pdf";

export const runtime = "nodejs";

/** GET /api/preview/[slug] — "Preview First 10 Pages" PDF, inline. */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const book = getBook(params.slug);
  if (!book) return new Response("Not found", { status: 404 });

  const pdf = generateBookPdf(book, 10);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${book.slug}-preview.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
