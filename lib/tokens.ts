/* HMAC-signed download tokens — the same contract a Vercel Blob signed-URL
   flow fulfills: a tamper-proof link valid for 7 days, tracked per user. */

import crypto from "crypto";
import { DOWNLOAD_LINK_DAYS } from "./data";

const SECRET = process.env.DOWNLOAD_SECRET ?? "ukweli-demo-secret-change-me";

export interface TokenPayload {
  bookSlug: string;
  email: string;
  orderId: string;
  exp: number; // unix ms
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}
function fromB64url(s: string): Buffer {
  return Buffer.from(s, "base64url");
}

export function signDownloadToken(bookSlug: string, email: string, orderId: string): string {
  const payload: TokenPayload = {
    bookSlug,
    email,
    orderId,
    exp: Date.now() + DOWNLOAD_LINK_DAYS * 24 * 60 * 60 * 1000,
  };
  const data = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyDownloadToken(token: string): TokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  const a = fromB64url(sig);
  const b = fromB64url(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(fromB64url(data).toString()) as TokenPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function orderId(): string {
  return `UKW-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}
