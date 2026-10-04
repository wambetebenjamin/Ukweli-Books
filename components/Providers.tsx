"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ShoppingCart, X, Trash2 } from "lucide-react";
import type { Book } from "@/lib/data";
import { formatKES } from "@/lib/utils";
import CheckoutModal from "@/components/CheckoutModal";
import FreeDownloadModal from "@/components/FreeDownloadModal";

/* ------------------------------------------------------------------ toast */
type ToastFn = (message: string) => void;

/* ------------------------------------------------------------------- shop */
interface ShopContextValue {
  cart: Book[];
  cartCount: number;
  cartOpen: boolean;
  setCartOpen(open: boolean): void;
  addToCart(book: Book): void;
  removeFromCart(slug: string): void;
  clearCart(): void;
  checkoutBooks: Book[] | null;
  openCheckout(book?: Book | null): void;
  closeCheckout(): void;
  freeBook: Book | null;
  openFreeDownload(book: Book): void;
  closeFreeDownload(): void;
  wishlist: string[];
  toggleWishlist(book: Book): void;
  toast: ToastFn;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within <Providers>");
  return ctx;
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutBooks, setCheckoutBooks] = useState<Book[] | null>(null);
  const [freeBook, setFreeBook] = useState<Book | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const toastId = useRef(0);

  /* hydrate persisted state */
  useEffect(() => {
    setCart(loadJSON<Book[]>("ukweli-cart", []));
    setWishlist(loadJSON<Book[]>("ukweli-wishlist", []));
  }, []);
  useEffect(() => { try { localStorage.setItem("ukweli-cart", JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => { try { localStorage.setItem("ukweli-wishlist", JSON.stringify(wishlist)); } catch {} }, [wishlist]);

  const toast = useCallback<ToastFn>((message) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const addToCart = useCallback((book: Book) => {
    setCart((c) => {
      if (c.some((b) => b.slug === book.slug)) return c;
      return [...c, book];
    });
    toast(`"${book.title}" added to cart.`);
  }, [toast]);

  const removeFromCart = useCallback((slug: string) => setCart((c) => c.filter((b) => b.slug !== slug)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const openCheckout = useCallback((book?: Book | null) => {
    setCheckoutBooks(book ? [book] : null);
    setCartOpen(false);
  }, []);
  const closeCheckout = useCallback(() => setCheckoutBooks(null), []);
  const openFreeDownload = useCallback((book: Book) => setFreeBook(book), []);
  const closeFreeDownload = useCallback(() => setFreeBook(null), []);
  const toggleWishlist = useCallback((book: Book) => {
    setWishlist((w) => {
      const has = w.some((b) => b.slug === book.slug);
      toast(has ? `Removed "${book.title}" from your wishlist.` : `"${book.title}" saved to your wishlist.`);
      return has ? w.filter((b) => b.slug !== book.slug) : [...w, book];
    });
  }, [toast]);

  const value = useMemo<ShopContextValue>(() => ({
    cart,
    cartCount: cart.length,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    clearCart,
    checkoutBooks,
    openCheckout,
    closeCheckout,
    freeBook,
    openFreeDownload,
    closeFreeDownload,
    wishlist: wishlist.map((b) => b.slug),
    toggleWishlist,
    toast,
  }), [cart, cartOpen, checkoutBooks, freeBook, wishlist, addToCart, removeFromCart, clearCart, openCheckout, closeCheckout, openFreeDownload, closeFreeDownload, toggleWishlist, toast]);

  return (
    <SessionProvider>
      <ShopContext.Provider value={value}>
        {children}
        <CartDrawer />
        {checkoutBooks !== null && (
          <CheckoutModal
            books={checkoutBooks.length ? checkoutBooks : cart}
            onClose={closeCheckout}
            onComplete={() => { clearCart(); }}
          />
        )}
        {freeBook && <FreeDownloadModal book={freeBook} onClose={closeFreeDownload} />}
        <div className="toast-stack" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className="toast">
              <CheckCircle2 />
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      </ShopContext.Provider>
    </SessionProvider>
  );
}

/* ---------------------------------------------------------------- cart drawer */
function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, openCheckout } = useShop();
  const total = cart.reduce((s, b) => s + b.price, 0);
  return (
    <>
      <div className={`drawer-backdrop ${cartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} />
      <aside className={`drawer ${cartOpen ? "open" : ""}`} aria-label="Shopping cart">
        <div className="drawer-header">
          <h3>
            <ShoppingCart size={18} style={{ verticalAlign: "-3px", marginRight: 8 }} />
            Your Cart {cart.length > 0 && `(${cart.length})`}
          </h3>
          <button className="icon-btn on-light" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <X />
          </button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-state" style={{ marginTop: 20 }}>
              <ShoppingCart />
              <h3>Your cart is empty</h3>
              <p>Browse the catalogue and add something wonderful to read.</p>
            </div>
          ) : (
            cart.map((b) => (
              <div className="cart-item" key={b.slug}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/covers/${b.slug}?w=120`} alt={`Cover of ${b.title}`} width={56} height={80} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="ci-title">{b.title}</p>
                  <p className="ci-author">{b.formats.join(" · ")}</p>
                  <span className="ci-price">{b.price === 0 ? "Free" : formatKES(b.price)}</span>
                </div>
                <button className="ci-remove" onClick={() => removeFromCart(b.slug)} aria-label={`Remove ${b.title}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-total-row">
              <span>Total</span>
              <b>{formatKES(total)}</b>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => openCheckout(null)}>
              Checkout {cart.length > 1 ? `All ${cart.length} Books` : ""}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
