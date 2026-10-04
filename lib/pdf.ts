/* ==========================================================================
   Minimal valid-PDF generator (PDF 1.4, Helvetica, A5-ish pages).
   Builds the "first 10 pages" preview file and the full demo download.
   In production these buffers come from Vercel Blob / Supabase Storage
   behind signed URLs — the route contract is identical.
   ========================================================================== */

import type { Book } from "./data";
import { getAuthor } from "./data";

const PAGE_W = 595.28;
const PAGE_H = 841.89;

function esc(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/[^\x20-\x7E]/g, "·");
}

function wrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars) {
      lines.push(line.trim());
      line = w;
    } else {
      line += " " + w;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

interface PageSpec {
  title?: string;
  heading?: string;
  lines?: string[];
  big?: string;
  center?: boolean;
  footer?: string;
}

function buildContent(ps: PageSpec): string {
  const ops: string[] = [];
  let y = PAGE_H - 90;
  const left = 85;
  if (ps.big) {
    ops.push(`BT /F2 26 Tf 85 ${y} Td 1.35 TL (${esc(ps.big)}) Tj ET`);
    y -= 46;
  }
  if (ps.title) {
    for (const line of wrap(ps.title, 34)) {
      ops.push(`BT /F2 22 Tf ${left} ${y} Td 1.3 TL (${esc(line)}) Tj ET`);
      y -= 32;
    }
    y -= 10;
  }
  if (ps.heading) {
    ops.push(`BT /F2 13 Tf ${left} ${y} Td (${esc(ps.heading)}) Tj ET`);
    y -= 30;
  }
  for (const chunk of ps.lines ?? []) {
    for (const line of wrap(chunk, 68)) {
      if (y < 90) break;
      ops.push(`BT /F1 11.5 Tf ${left} ${y} Td 1.65 TL (${esc(line)}) Tj ET`);
      y -= 20;
    }
    y -= 10;
  }
  ops.push(`0.06 0.54 1 RG 2 w ${left} 70 m ${PAGE_W - left} 70 l S`);
  if (ps.footer) {
    ops.push(`BT /F1 9 Tf ${left} 50 Td 0.6 0.6 0.6 rg (${esc(ps.footer)}) Tj ET`);
  }
  return ops.join("\n");
}

export function generateBookPdf(book: Book, previewPages: number | null): Buffer {
  const author = getAuthor(book.authorSlug)?.name ?? "Ukweli Books";
  const pages: PageSpec[] = [];

  // Cover page
  pages.push({
    big: "UKWELI BOOKS",
    title: book.title,
    heading: `${author} · ${book.publisher} · ${book.year}`,
    lines: previewPages ? ["PREVIEW EDITION — the first 10 pages of this title are shown free of charge. Purchase to unlock the complete file."] : ["Thank you for reading with Ukweli Books. Buy once. Read forever."],
    footer: "ukweli-books · Nairobi, Kenya",
  });
  // Copyright
  pages.push({
    heading: "Copyright & Edition Notice",
    lines: [
      `${book.title}`,
      `by ${author}`,
      `Published by ${book.publisher}, ${book.year}. Format: ${book.formats.join(" / ")}.`,
      previewPages
        ? "This is a limited preview made available by the publisher. (c) All rights reserved to the author and publisher."
        : "Licensed to the purchaser for personal use. Please do not redistribute.",
    ],
    footer: "Page 2",
  });
  // Body pages from description
  const bodyText = book.description;
  const totalBody = (previewPages ?? 10) - pages.length - 1;
  for (let i = 0; i < totalBody; i++) {
    const para = bodyText[i % bodyText.length];
    pages.push({
      heading: i === 0 ? "Chapter One" : `Continuing…`,
      lines: [para, para.split(" ").reverse().join(" ")],
      footer: `Page ${pages.length + 1} · ${book.title}`,
    });
  }
  // Closing page
  pages.push({
    heading: previewPages ? "End of preview" : "Asante sana",
    lines: previewPages
      ? ["You have reached the end of the free 10-page preview.", "Buy the complete edition to keep reading — your download link arrives by email and WhatsApp within seconds."]
      : ["Enjoyed this book? Leave a review on its Ukweli Books page — reviews help East African authors find their readers."],
    footer: "ukweli-books",
  });

  // ---- serialize
  const objects: string[] = [];
  const pageIds: number[] = [];
  // 1 catalog, 2 pages-node, 3+ fonts at the end (two fonts)
  const fontRegularIdIdx = 0;
  const chunks: string[] = [];
  const pageCount = pages.length;
  const firstPageObj = 3;
  const fontRegularObj = firstPageObj + pageCount * 2;
  const fontBoldObj = fontRegularObj + 1;

  objects[0] = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  const kids = Array.from({ length: pageCount }, (_, i) => `${firstPageObj + i * 2} 0 R`).join(" ");
  objects[1] = `2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>\nendobj\n`;

  pages.forEach((spec, i) => {
    const pageObjN = firstPageObj + i * 2;
    const contentObjN = pageObjN + 1;
    objects[pageObjN - 1] =
      `${pageObjN} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
      `/Resources << /Font << /F1 ${fontRegularObj} 0 R /F2 ${fontBoldObj} 0 R >> >> /Contents ${contentObjN} 0 R >>\nendobj\n`;
    const stream = buildContent(spec);
    objects[contentObjN - 1] =
      `${contentObjN} 0 obj\n<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream\nendobj\n`;
  });

  objects[fontRegularObj - 1] = `${fontRegularObj} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>\nendobj\n`;
  objects[fontBoldObj - 1] = `${fontBoldObj} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>\nendobj\n`;

  let out = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets: number[] = [];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(out, "latin1"));
    out += obj;
  }
  void chunks; void pageIds; void fontRegularIdIdx;
  const xrefPos = Buffer.byteLength(out, "latin1");
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) out += `${String(off).padStart(10, "0")} 00000 n \n`;
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return Buffer.from(out, "latin1");
}
