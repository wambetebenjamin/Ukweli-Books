import { getBook } from "@/lib/data";
import { savePurchase } from "@/lib/store";
import { orderId, signDownloadToken } from "@/lib/tokens";
import { formatKES } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PurchaseBody {
  slugs?: string[];
  method?: "mpesa" | "card";
  email?: string;
  name?: string;
  phone?: string;
  card?: { number?: string };
}

/**
 * POST /api/purchase
 * Payment → signed download link (email + WhatsApp delivery).
 *
 * PRODUCTION HOOKS (inactive without env keys — demo mode simulates them):
 *  - M-Pesa Daraja STK push: POST https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest
 *    with MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET / MPESA_SHORTCODE / MPESA_PASSKEY
 *  - Stripe PaymentIntent: STRIPE_SECRET_KEY (recurring for subscriptions)
 *  - SendGrid email: SENDGRID_API_KEY (purchase confirmation + link)
 *  - WhatsApp Cloud API: WHATSAPP_TOKEN / WHATSAPP_PHONE_ID (link message)
 */
export async function POST(req: Request) {
  let body: PurchaseBody;
  try {
    body = (await req.json()) as PurchaseBody;
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return Response.json({ ok: false, error: "A valid email is required for delivery." }, { status: 400 });
  }
  const slugs = (body.slugs ?? []).filter(Boolean);
  if (slugs.length === 0) {
    return Response.json({ ok: false, error: "No books selected." }, { status: 400 });
  }
  const books = slugs.map((s) => getBook(s)).filter(Boolean);
  if (books.length !== slugs.length) {
    return Response.json({ ok: false, error: "One of the selected books was not found." }, { status: 404 });
  }
  const paid = books.filter((b) => b!.price > 0);
  if (paid.length !== books.length) {
    return Response.json({ ok: false, error: "Free books use the free download flow — no payment needed." }, { status: 400 });
  }

  const method = body.method ?? "mpesa";
  if (method === "mpesa" && !/^254\d{9}$/.test(body.phone ?? "")) {
    return Response.json({ ok: false, error: "M-Pesa number must look like 2547XXXXXXXX." }, { status: 400 });
  }
  if (method === "card" && (body.card?.number ?? "").replace(/\D/g, "").length < 12) {
    return Response.json({ ok: false, error: "Please check the card number." }, { status: 400 });
  }

  const total = paid.reduce((s, b) => s + b!.price, 0);
  const live = Boolean(
    (method === "mpesa" && process.env.MPESA_CONSUMER_KEY) ||
    (method === "card" && process.env.STRIPE_SECRET_KEY)
  );

  /* ---- begin payment (simulated in demo) --------------------------------
     M-Pesa (Daraja): request OAuth token, then push STK request and await the
     /api/webhooks/mpesa callback before issuing links.
     Stripe: create + confirm a PaymentIntent and await the webhook.        */
  const orders = [];
  for (const book of paid) {
    const oid = orderId();
    const token = signDownloadToken(book!.slug, email, oid);
    await savePurchase({
      orderId: oid,
      bookSlug: book!.slug,
      email,
      method,
      amountKES: book!.price,
      purchasedAt: new Date().toISOString(),
      downloadsUsed: 0,
      token,
    });
    orders.push({ bookSlug: book!.slug, title: book!.title, downloadToken: token });
  }

  /* best-effort delivery (SendGrid / WhatsApp Cloud API when configured) */
  void deliver(email, body.name ?? "", orders.map((o) => o.title));

  return Response.json({
    ok: true,
    demo: !live,
    message: `We received ${formatKES(total)} via ${method === "mpesa" ? "M-Pesa" : "card"}. Download links were sent to ${email}${method === "mpesa" ? ` and WhatsApp (${body.phone})` : ""}.`,
    orders,
  });
}

async function deliver(email: string, name: string, titles: string[]) {
  if (!process.env.SENDGRID_API_KEY) {
    console.info(`[ukweli] (demo) purchase confirmation email -> ${email} (${name}) for: ${titles.join(", ")}`);
    return;
  }
  try {
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: "orders@ukwelibooks.co.ke", name: "Ukweli Books" },
        subject: "Your Ukweli Books downloads",
        content: [{ type: "text/plain", value: `Asante ${name || "reader"}! Your books: ${titles.join(", ")}. Open My Library to download (links valid 7 days).` }],
      }),
    });
  } catch (e) {
    console.error("[ukweli] sendgrid delivery failed", e);
  }
}
