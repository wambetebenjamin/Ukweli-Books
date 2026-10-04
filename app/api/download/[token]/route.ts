import { getBook } from "@/lib/data";
import { generateBookPdf } from "@/lib/pdf";
import { getPurchase, updatePurchase } from "@/lib/store";
import { verifyDownloadToken } from "@/lib/tokens";
import { MAX_DOWNLOADS_PER_PURCHASE } from "@/lib/data";

export const runtime = "nodejs";

/**
 * GET /api/download/[token]
 * Signed download link (7-day expiry contract, per spec). Downloads are
 * tracked per purchase in the KV store — the Vercel Blob signed-URL swap
 * point is documented below.
 */
export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const payload = verifyDownloadToken(params.token);
  if (!payload) {
    return Response.json(
      { ok: false, error: "This download link is invalid or has expired (links last 7 days). Re-download from My Library or contact us on WhatsApp." },
      { status: 410 }
    );
  }

  const book = getBook(payload.bookSlug);
  if (!book) return Response.json({ ok: false, error: "Book not found." }, { status: 404 });

  /* Track per-user download counts (Vercel KV in production). */
  const purchase = await getPurchase(payload.orderId);
  if (purchase) {
    if (purchase.downloadsUsed >= MAX_DOWNLOADS_PER_PURCHASE) {
      return Response.json(
        { ok: false, error: `Download limit reached (${MAX_DOWNLOADS_PER_PURCHASE}). Ask us on WhatsApp and we'll top you up.` },
        { status: 429 }
      );
    }
    purchase.downloadsUsed += 1;
    await updatePurchase(purchase);
  }

  /*
   * PRODUCTION: replace the generated buffer with a signed fetch from Vercel Blob:
   *   import { get } from "@vercel/blob";
   *   const blob = await get(`books/${book.slug}.pdf`, {
   *     token: process.env.BLOB_READ_WRITE_TOKEN,
   *     expiresIn: 7 * 24 * 60 * 60, // 7-day signed URL
   *   });
   */
  const pdf = generateBookPdf(book, null);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${book.slug}-ukweli-books.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Downloads-Remaining": purchase ? String(MAX_DOWNLOADS_PER_PURCHASE - purchase.downloadsUsed) : "n/a",
    },
  });
}
