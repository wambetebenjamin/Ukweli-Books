import { kv } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/contact — store a message for the support team. */
export async function POST(req: Request) {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const email = body.email?.trim().toLowerCase();
  const message = body.message?.trim().slice(0, 2000);
  if (!email || !email.includes("@") || !message) {
    return Response.json({ ok: false, error: "Email and message are required." }, { status: 400 });
  }
  await kv.set(`contact:${Date.now()}:${email}`, {
    name: body.name?.trim().slice(0, 80) ?? "",
    email,
    subject: body.subject?.trim().slice(0, 120) ?? "General",
    message,
    at: new Date().toISOString(),
  });
  console.info(`[ukweli] contact message from ${email}: ${body.subject}`);
  return Response.json({ ok: true, message: "Received — we reply within one working hour." });
}
