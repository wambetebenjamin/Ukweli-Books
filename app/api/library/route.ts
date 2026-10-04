import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBook } from "@/lib/data";
import { getSubscription, purchasesFor } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/library — the signed-in user's purchased books + subscription. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json({ ok: false, error: "Sign in required." }, { status: 401 });
  }
  const email = session.user.email;
  const [purchases, subscription] = await Promise.all([purchasesFor(email), getSubscription(email)]);

  return Response.json({
    ok: true,
    email,
    subscription,
    items: purchases.map((p) => {
      const book = getBook(p.bookSlug);
      return {
        orderId: p.orderId,
        slug: p.bookSlug,
        title: book?.title ?? p.bookSlug,
        purchasedAt: p.purchasedAt,
        downloadsUsed: p.downloadsUsed,
        amountKES: p.amountKES,
        method: p.method,
        downloadToken: p.token,
        cover: `/api/covers/${p.bookSlug}?w=168`,
      };
    }),
  });
}
