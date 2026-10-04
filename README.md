# Ukweli Books

**East Africa's online bookshop** — buy once, download everywhere. Based in Nairobi, Kenya.

Next.js 14 (App Router) + TypeScript, deployable to Vercel. Design system tokens extracted from the uploaded design source (`carbook-master.zip`) into `:root` custom properties in `app/globals.css` (primary `#1089ff`, secondary `#01d28e`).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (78 prerendered pages)
```

No env vars are required for the demo: payments, email/WhatsApp delivery and auth
all run in clearly-labelled demo mode. See `.env.example` to enable production
integrations (M-Pesa Daraja, Stripe, SendGrid, WhatsApp Cloud API, Vercel KV/Blob, Google OAuth, SMTP).

## Highlights

- **Home** — 15 sections: sticky navbar, animated hero (char-by-char headline + 3D Three.js open book with sine-wave page ripple), featured & new-arrival strips, 10-category browse grid, free-books strip (24 titles), subscription teaser, author spotlight (alternating slide-ins), reading community, institutional accounts, blog, newsletter, footer.
- **Book page** (`/books/[slug]`) — 39 titles, Book + Product JSON-LD, OG cover images, 10-page PDF preview modal (`/api/preview/[slug]`), read-more toggle, author bio, reviews (GET/POST `/api/reviews`), related carousel.
- **My Library** (`/library`) — protected via NextAuth (Google OAuth when configured + demo email OTP): purchases with remaining-download counters, reading-progress trackers, wishlist, subscription status.
- **Commerce** — M-Pesa STK-push style checkout (simulated until Daraja keys exist) or card (/api/purchase); free downloads gated on email (/api/free-download); 3-tier subscription with monthly/annual 20%-off toggle; HMAC **signed 7-day download links** (`lib/tokens.ts`) tracked per purchase (max 5 downloads), served as PDF attachments (`/api/download/[token]`); "Get Download Link via WhatsApp" share on confirmations.
- **Covers** — deterministic typographic SVG covers generated at runtime (`/api/covers/[slug]`), palette derived strictly from the design source.
- **SEO** — dynamic sitemap + robots, ISR (`revalidate = 300`) on catalogue pages, SSR no-cache library, `next/image` with blur placeholders, security headers, edge rate limiting on download/purchase endpoints (`middleware.ts`).
- **Accessibility & motion spec** — Lucide icons only, `prefers-reduced-motion` honored site-wide (no staggers, morph completes instantly, 3D book static), focus rings, aria labels.
- **Floating WhatsApp help button** bottom-right (+254 112 272 061).

## Image credits

Royalty-free Pexels/Unsplash photography saved locally — see [`image-credits.md`](image-credits.md).
