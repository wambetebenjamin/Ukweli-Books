import { getAuthor, getBook } from "@/lib/data";
import { hashSeed } from "@/lib/utils";

export const runtime = "nodejs";
export const revalidate = false;

/* --------------------------------------------------------------------------
   Deterministic typographic book covers (SVG).
   Palette derived strictly from the uploaded design source (carbook-master):
   $primary #1089ff · $secondary #01d28e · dark #3c312e · black · mixes
   (systematic lighten/darken of those source colours — no invented hues).
   ------------------------------------------------------------------------- */

const W = 600;
const H = 900;

function mix(hex: string, target: string, t: number): string {
  const a = parseInt(hex.slice(1), 16);
  const b = parseInt(target.slice(1), 16);
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, "0")}`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function wrapTitle(title: string, maxChars: number): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line += " " + w;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 5);
}

function motif(seed: number, accent: string): string {
  const m = seed % 5;
  const op = 0.32;
  switch (m) {
    case 0: { // concentric circles (circles only — no faceted geometry per spec)
      const cx = 470, cy = 235;
      return [70, 115, 160].map((r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${accent}" stroke-opacity="${op}" stroke-width="2"/>`).join("");
    }
    case 1: { // rule ladder
      return Array.from({ length: 5 }, (_, i) => {
        const y = 150 + i * 44;
        const w = 300 - i * 46;
        return `<rect x="64" y="${y}" width="${w}" height="3" fill="${accent}" fill-opacity="${op + 0.08}"/>`;
      }).join("");
    }
    case 2: { // sweeping bottom arc
      return `<path d="M -40 ${H - 190} A 640 640 0 0 1 ${W + 40} ${H - 330}" fill="none" stroke="${accent}" stroke-opacity="${op}" stroke-width="2.5"/>
<path d="M -40 ${H - 150} A 700 700 0 0 1 ${W + 40} ${H - 300}" fill="none" stroke="${accent}" stroke-opacity="${op * 0.6}" stroke-width="1.5"/>`;
    }
    case 3: { // diagonal stripe band (parallel lines, not diamonds)
      return Array.from({ length: 7 }, (_, i) => {
        const x = 330 + i * 34;
        return `<line x1="${x}" y1="120" x2="${x - 120}" y2="330" stroke="${accent}" stroke-opacity="${op}" stroke-width="6"/>`;
      }).join("");
    }
    default: { // dot grid
      const dots: string[] = [];
      for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
        dots.push(`<circle cx="${390 + c * 26}" cy="${150 + r * 26}" r="3.2" fill="${accent}" fill-opacity="${op + (r * 7 + c) % 3 * 0.1}"/>`);
      }
      return dots.join("");
    }
  }
}

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const book = getBook(params.slug);
  if (!book) return new Response("Not found", { status: 404 });

  const author = getAuthor(book.authorSlug)?.name ?? "Ukweli Books";
  const seed = hashSeed(book.slug);

  const PRIMARY = "#1089ff";
  const SECONDARY = "#01d28e";
  const DARK = "#3c312e";
  const BLACK = "#0b0b0b";
  const backgrounds = [
    PRIMARY,
    mix(SECONDARY, "#000000", 0.35),
    DARK,
    BLACK,
    mix(PRIMARY, "#000000", 0.42),
    mix(DARK, "#000000", 0.25),
  ];
  const bg = backgrounds[seed % backgrounds.length];
  const accent = bg === SECONDARY || seed % backgrounds.length === 1 ? PRIMARY : SECONDARY;
  const accentSoft = mix(accent, "#ffffff", 0.25);

  const fontSize = book.title.length > 40 ? 36 : book.title.length > 24 ? 42 : 50;
  const maxChars = Math.floor((W - 150) / (fontSize * 0.6));
  const lines = wrapTitle(book.title, maxChars);
  const lineH = fontSize * 1.18;
  const titleY = Math.round(H * 0.6 - (lines.length - 1) * lineH);
  const isFree = book.price === 0;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.38"/>
    </linearGradient>
  </defs>
  ${motif(seed, mix(accent, "#ffffff", 0.1))}
  <rect x="0" y="0" width="10" height="${H}" fill="${accent}"/>
  <text x="64" y="86" font-family="Arial, Helvetica, sans-serif" font-size="20" letter-spacing="6" fill="#ffffff" fill-opacity="0.75" font-weight="bold">UKWELI BOOKS</text>
  <rect x="64" y="104" width="52" height="3" fill="${accent}"/>
  ${isFree ? `<g><rect x="${W - 196}" y="62" width="142" height="34" fill="none" stroke="${accent}" stroke-width="1.5"/><text x="${W - 125}" y="84" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" letter-spacing="2.5" fill="${accentSoft}">FREE EDITION</text></g>` : ""}
  <text x="64" y="${titleY - 34}" font-family="Arial, Helvetica, sans-serif" font-size="15" letter-spacing="4.5" fill="${accentSoft}">${esc(book.genre.toUpperCase())}</text>
  ${lines
    .map(
      (line, i) =>
        `<text x="62" y="${titleY + i * lineH}" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${fontSize}" fill="#ffffff">${esc(line)}</text>`
    )
    .join("\n  ")}
  <rect x="64" y="${H - 158}" width="120" height="2" fill="#ffffff" fill-opacity="0.35"/>
  <text x="64" y="${H - 118}" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#ffffff">${esc(author)}</text>
  <text x="64" y="${H - 84}" font-family="Arial, Helvetica, sans-serif" font-size="15" letter-spacing="2.5" fill="#ffffff" fill-opacity="0.6">${esc(book.publisher.toUpperCase())} · ${book.year}</text>
  <rect x="0" y="${H - 12}" width="${W}" height="12" fill="${accent}"/>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
