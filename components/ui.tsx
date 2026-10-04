import { Star, StarHalf } from "lucide-react";
import React from "react";
import { starStates } from "@/lib/utils";

/** Tiny 2x3 base64 blur placeholder (Poppins-brand dark gradient) for next/image. */
export const COVER_BLUR =
  "data:image/svg+xml;base64," +
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjMiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjMiIGZpbGw9IiMxMDg5ZmYiLz48cmVjdCB5PSIxIiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMzUiLz48L3N2Zz4=";

/** 1–5 star rating, brand green (extracted #01d28e — source review stars). */
export function Stars({ rating, showCount, count }: { rating: number; showCount?: boolean; count?: number }) {
  const states = starStates(rating);
  return (
    <span className="stars" aria-label={`Rated ${rating} out of 5${count ? ` from ${count} reviews` : ""}`}>
      {states.map((s, i) =>
        s === "half" ? (
          <StarHalf key={i} fill="currentColor" strokeWidth={0} />
        ) : (
          <Star key={i} className={s === "empty" ? "dim" : undefined} fill="currentColor" strokeWidth={0} />
        )
      )}
      {showCount && typeof count === "number" && <span className="review-count">({count.toLocaleString()})</span>}
    </span>
  );
}

/** Section heading pair in the extracted CarBook pattern (subheading over h2). */
export function SectionHead({
  sub,
  title,
  children,
  center,
  onDark,
  style,
}: {
  sub: string;
  title: string;
  children?: React.ReactNode;
  center?: boolean;
  onDark?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`heading-section ${center ? "heading-center" : ""} ${onDark ? "on-dark" : ""}`} style={style}>
      <span className="subheading">{sub}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

/** Breadcrumb + title band used at the top of inner pages. */
export function PageHero({
  title,
  crumb,
  image,
}: {
  title: string;
  crumb: string;
  image?: string;
}) {
  return (
    <section className="page-hero">
      {image && (
        <div className="page-hero-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" aria-hidden />
        </div>
      )}
      <div className="container">
        <h1>{title}</h1>
        <div className="breadcrumbs">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Home</a>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          <span>{crumb}</span>
        </div>
      </div>
    </section>
  );
}
