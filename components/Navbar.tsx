"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { BookOpen, ChevronRight, Library, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useShop } from "@/components/Providers";
import { formatKES } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse Books" },
  { href: "/categories", label: "Categories" },
  { href: "/free-books", label: "Free Books" },
  { href: "/subscription", label: "Subscription" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, setCartOpen } = useShop();
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  const solid = scrolled || pathname !== "/";
  const firstName = session?.user?.name?.split(" ")[0] ?? session?.user?.email?.split("@")[0];

  return (
    <>
      <header className={`navbar ${solid ? "scrolled" : ""}`}>
        <div className="container navbar-inner">
          <Link href="/" className="navbar-brand" aria-label="Ukweli Books home">
            <BookOpen strokeWidth={2.2} />
            Ukweli<span>Books</span>
          </Link>

          <nav className="navbar-links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="navbar-actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search books">
              <Search />
            </button>
            <Link href="/library" className="icon-btn hide-md" aria-label="My Library" title="My Library">
              <Library />
            </Link>
            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label={`Cart, ${cartCount} items`}>
              <ShoppingCart />
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </button>
            {session ? (
              <Link href="/library" className="navbar-signin" title="My Library">
                <User size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />
                {firstName}
              </Link>
            ) : (
              <Link href="/signin" className="navbar-signin">Sign In</Link>
            )}
            <Link href="/subscription" className="btn btn-secondary btn-sm navbar-subscribe">Subscribe</Link>
            <button className="icon-btn nav-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ position: "absolute", top: 18, right: 18 }}>
          <X />
        </button>
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
            {l.label} <ChevronRight />
          </Link>
        ))}
        <div className="mobile-actions">
          <Link href="/library" className="btn btn-outline-white">
            <Library size={15} /> My Library
          </Link>
          {session ? (
            <Link href="/api/auth/signout" className="btn btn-outline-white">Sign Out</Link>
          ) : (
            <Link href="/signin" className="btn btn-outline-white">
              <User size={15} /> Sign In
            </Link>
          )}
          <Link href="/subscription" className="btn btn-secondary">Subscribe — Ukweli Unlimited</Link>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

/* ------------------------------------------------------------- search overlay */
interface SearchHit {
  slug: string;
  title: string;
  author: string;
  price: number;
  genre: string;
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!q.trim()) { setHits([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = (await res.json()) as { results: SearchHit[] };
          setHits(data.results.slice(0, 7));
        }
      } catch { /* network hiccup — ignore */ }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="search-overlay open" role="dialog" aria-label="Search">
      <button className="icon-btn search-close" onClick={onClose} aria-label="Close search"><X /></button>
      <form
        className="search-box"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) { onClose(); router.push(`/search?q=${encodeURIComponent(q.trim())}`); }
        }}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles, authors, genres…"
          aria-label="Search titles, authors, genres"
        />
        <Search />
      </form>
      <div className="search-results">
        {hits.map((h) => (
          <Link key={h.slug} href={`/books/${h.slug}`} className="search-result-item" onClick={onClose}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/covers/${h.slug}?w=76`} alt="" width={38} height={54} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="r-title">{h.title}</p>
              <p className="r-meta">{h.author} · {h.genre}</p>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: h.price === 0 ? "#01d28e" : "#1089ff" }}>
              {h.price === 0 ? "Free" : formatKES(h.price)}
            </span>
          </Link>
        ))}
        {q.trim() && hits.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.55)", padding: "18px 4px", fontSize: 14 }}>
            No matches for “{q}”. Try an author name or category like “KCSE” or “poetry”.
          </p>
        )}
      </div>
    </div>
  );
}
