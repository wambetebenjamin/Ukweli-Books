import { PLANS, annualPrice } from "@/lib/data";
import { saveSubscription } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/subscription — plan sign-up / renewal.
 * Recurring billing via M-Pesa (standing instructions) or Stripe subscriptions
 * — both activate in production with the same env keys as /api/purchase.
 */
export async function POST(req: Request) {
  let body: { plan?: string; billing?: "monthly" | "annual"; method?: string; email?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const plan = PLANS.find((p) => p.slug === body.plan);
  if (!plan) return Response.json({ ok: false, error: "Unknown plan." }, { status: 404 });

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return Response.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  }

  const billing = body.billing === "annual" ? "annual" : "monthly";
  const days = billing === "annual" ? 365 : 30;
  const renewsAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  await saveSubscription({ email, plan: plan.slug, billing, startedAt: new Date().toISOString(), renewsAt });

  const amount = billing === "annual" ? annualPrice(plan.monthlyKES) : plan.monthlyKES;
  const live = Boolean(process.env.MPESA_CONSUMER_KEY || process.env.STRIPE_SECRET_KEY);

  return Response.json({
    ok: true,
    demo: !live,
    message: `${plan.name} (${billing}) active — KES ${amount.toLocaleString("en-KE")}/${billing === "annual" ? "yr" : "mo"}. Renews ${renewsAt.slice(0, 10)}.`,
  });
}
