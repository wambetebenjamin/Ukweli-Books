/** Shared formatting + string helpers for Ukweli Books. */

/** Format a number as Kenyan Shillings: 1,250 -> "KES 1,250" */
export function formatKES(amount: number): string {
  return `KES ${Math.round(amount).toLocaleString("en-KE")}`;
}

/** Deterministic pseudo-random from a string seed (stable covers/accents). */
export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Render 1–5 star state list from a float rating. */
export function starStates(rating: number): ("full" | "half" | "empty")[] {
  const states: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i - 0.25) states.push("full");
    else if (rating >= i - 0.75) states.push("half");
    else states.push("empty");
  }
  return states;
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length).trimEnd() + "…" : text;
}

export const SITE_NAME = "Ukweli Books";
export const SITE_TAGLINE = "Every Book You Need. Download in Seconds.";
export const WHATSAPP_NUMBER = "254112272061";
export const WHATSAPP_HELP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello! I need help finding a book on Ukweli Books."
)}`;

export function whatsappDownloadLink(bookTitle: string, downloadUrl: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Ukweli Books! I just purchased "${bookTitle}". Please send my download link: ${downloadUrl}`
  )}`;
}
