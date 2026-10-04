"use client";

import { useState } from "react";
import { BookOpen, Download, Heart, ShoppingBag } from "lucide-react";
import type { Book } from "@/lib/data";
import { formatKES } from "@/lib/utils";
import { useShop } from "@/components/Providers";
import PreviewModal from "@/components/PreviewModal";

export default function BookDetailActions({ book }: { book: Book }) {
  const { openCheckout, openFreeDownload, addToCart, wishlist, toggleWishlist } = useShop();
  const [previewOpen, setPreviewOpen] = useState(false);
  const isFree = book.price === 0;
  const wished = wishlist.includes(book.slug);

  return (
    <>
      <div className="detail-ctas">
        {isFree ? (
          <button className="btn btn-secondary btn-lg" onClick={() => openFreeDownload(book)}>
            <Download /> Download Now — Free
          </button>
        ) : (
          <>
            <button className="btn btn-primary btn-lg" onClick={() => openCheckout(book)}>
              <ShoppingBag /> Buy &amp; Download — {formatKES(book.price)}
            </button>
            <button className="btn btn-outline-black btn-lg" onClick={() => addToCart(book)} aria-label="Add to cart">
              + Cart
            </button>
          </>
        )}
        <button className="btn btn-black btn-lg" onClick={() => setPreviewOpen(true)}>
          <BookOpen /> Preview First 10 Pages
        </button>
        <button
          className="btn btn-outline-black btn-lg"
          onClick={() => toggleWishlist(book)}
          aria-pressed={wished}
          style={wished ? { borderColor: "#e0245e", color: "#e0245e" } : undefined}
        >
          <Heart size={15} fill={wished ? "currentColor" : "none"} /> {wished ? "Saved" : "Wishlist"}
        </button>
      </div>
      {previewOpen && <PreviewModal book={book} onClose={() => setPreviewOpen(false)} />}
    </>
  );
}
