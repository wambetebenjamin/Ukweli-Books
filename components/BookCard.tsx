"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Heart, ShoppingBag } from "lucide-react";
import type { Book } from "@/lib/data";
import { getAuthor } from "@/lib/data";
import { formatKES } from "@/lib/utils";
import { COVER_BLUR, Stars } from "@/components/ui";
import { useShop } from "@/components/Providers";

/**
 * Catalogue card — extracted card style (white bg, soft shadow) with the
 * hover spec: translateY(-6px), shadow spread, cover scale 1.04, title lift.
 */
export default function BookCard({ book }: { book: Book }) {
  const author = getAuthor(book.authorSlug);
  const { openCheckout, openFreeDownload, addToCart, wishlist, toggleWishlist } = useShop();
  const isFree = book.price === 0;
  const wished = wishlist.includes(book.slug);

  return (
    <article className="book-card">
      <Link href={`/books/${book.slug}`} className="book-cover" aria-label={`View ${book.title}`}>
        <Image
          src={`/api/covers/${book.slug}?w=480`}
          alt={`Cover of ${book.title} by ${author?.name ?? "Unknown"}`}
          width={320}
          height={480}
          placeholder="blur"
          blurDataURL={COVER_BLUR}
          sizes="(max-width: 768px) 72vw, (max-width: 1024px) 25vw, 20vw"
        />
        {isFree && <span className="badge">Free</span>}
        {!isFree && book.newArrival && <span className="badge badge-new">New</span>}
        {!isFree && !book.newArrival && book.bestseller && <span className="badge badge-bestseller">Bestseller</span>}
      </Link>
      <button
        className="icon-btn on-light"
        onClick={() => toggleWishlist(book)}
        aria-label={wished ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
        style={{
          position: "absolute", top: 8, right: 8, zIndex: 3,
          background: "rgba(255,255,255,0.92)", width: 34, height: 34,
          color: wished ? "#e0245e" : "#4d4d4d",
        }}
      >
        <Heart size={15} fill={wished ? "currentColor" : "none"} />
      </button>

      <div className="book-info">
        <h3 className="book-title">
          <Link href={`/books/${book.slug}`}>{book.title}</Link>
        </h3>
        <p className="book-author">
          <Link href={`/authors/${book.authorSlug}`}>{author?.name}</Link>
        </p>
        <div className="book-meta-row">
          <span className="genre-tag">{book.genre}</span>
        </div>
        <div className="book-meta-row" style={{ marginTop: -4 }}>
          <Stars rating={book.rating} showCount count={book.reviewCount} />
        </div>
        <div className="book-meta-row" style={{ marginTop: 2 }}>
          <span className={`book-price ${isFree ? "free" : ""}`}>{isFree ? "Free" : formatKES(book.price)}</span>
        </div>
        <div className="book-actions">
          {isFree ? (
            <button className="btn btn-secondary" onClick={() => openFreeDownload(book)}>
              <Download /> Download Free
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => openCheckout(book)}>
              <ShoppingBag /> Buy
            </button>
          )}
          {!isFree && (
            <button className="btn btn-outline-black" onClick={() => addToCart(book)} aria-label={`Add ${book.title} to cart`} style={{ flex: "0 0 auto", padding: "11px 13px" }}>
              +
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
