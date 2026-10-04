import { getBook } from "@/lib/data";
import { addSubscriber, savePurchase } from "@/lib/store";
import { orderId, signDownloadToken } from "@/lib/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/free-download
 * Email capture → sends the free book link by email (+WhatsApp option on the client).
 */
export async function POST(req: Request) {
  let body: { slug?: string; email?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const book = body.slug ? getBook(body.slug) : undefined;
  if (!book) return Response.json({ ok: false, error: "Book not found." }, { status: 404 });
  if (book.price > 0) {
    return Response.json({ ok: false, error: "That title isn't free — but the first 10 pages are." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return Response.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  }

  await addSubscriber(email);

  const oid = orderId();
  const token = signDownloadToken(book.slug, email, oid);
  await savePurchase({
    orderId: oid,
    bookSlug: book.slug,
    email,
    method: "free",
    amountKES: 0,
    purchasedAt: new Date().toISOString(),
    downloadsUsed: 0,
    token,
  });

  console.info(`[ukweli] (demo) free download link for "${book.title}" -> ${email}`);

  return Response.json({
    ok: true,
    message: `“${book.title}” is on its way to ${email}.`,
    downloadToken: token,
  });
}
