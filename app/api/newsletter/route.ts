import { addSubscriber } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/newsletter — join the editors' monthly list (Vercel KV). */
export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > 120) {
    return Response.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  }
  await addSubscriber(email);
  return Response.json({ ok: true, message: "Karibu! You're on the list." });
}
