"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { BookOpen, CalendarDays, Crown, LogOut } from "lucide-react";
import BookCard from "@/components/BookCard";
import DownloadMorphButton from "@/components/DownloadMorphButton";
import Reveal from "@/components/Reveal";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { useShop } from "@/components/Providers";
import { BOOKS, MAX_DOWNLOADS_PER_PURCHASE, type Book } from "@/lib/data";
import { formatDate, formatKES } from "@/lib/utils";

interface LibraryItem {
  orderId: string;
  purchasedAt: string;
  downloadsUsed: number;
  downloadToken: string;
  method: string;
  book: { slug: string; title: string; formats: string[] };
}

interface Sub {
  plan: string;
  billing: "monthly" | "annual";
  renewsAt: string;
}

type Tab = "books" | "wishlist" | "subscription";

export default function LibraryClient({
  userName,
  userEmail,
  items,
  subscription,
}: {
  userName: string;
  userEmail: string;
  items: LibraryItem[];
  subscription: Sub | null;
}) {
  const [tab, setTab] = useState<Tab>("books");
  const { wishlist } = useShop();
  const wishlistBooks: Book[] = wishlist
    .map((slug) => BOOKS.find((b) => b.slug === slug))
    .filter((b): b is Book => Boolean(b));

  return (
    <section className="section" style={{ paddingTop: "10em" }}>
      <div className="container">
        <div className="library-header">
          <div>
            <span className="subheading">My Library</span>
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>
              Karibu, {userName.split(" ")[0]}
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 14 }}>{userEmail}</p>
          </div>
          <button className="btn btn-outline-black" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut /> Sign Out
          </button>
        </div>

        {subscription ? (
          <div className="subscription-banner">
            <div className="sb-left">
              <div className="sb-icon"><Crown /></div>
              <div>
                <h3>Ukweli Unlimited — {subscription.plan}</h3>
                <p>
                  {subscription.billing === "annual" ? "Annual" : "Monthly"} plan · renews{" "}
                  {formatDate(subscription.renewsAt)}
                </p>
              </div>
            </div>
            <Link href="/subscription" className="btn btn-outline-white btn-sm">Manage Plan</Link>
          </div>
        ) : (
          <div className="subscription-banner" style={{ background: "#f8f9fa", color: "#4d4d4d", border: "1px solid #e6e6e6" }}>
            <div className="sb-left">
              <div className="sb-icon" style={{ background: "rgba(16,137,255,0.1)", color: "#1089ff" }}><BookOpen /></div>
              <div>
                <h3 style={{ color: "rgba(0,0,0,0.8)" }}>You&apos;re on pay-per-book</h3>
                <p>Unlock the whole catalogue from {formatKES(299)}/month with Ukweli Unlimited.</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setTab("subscription")}>See Plans</button>
          </div>
        )}

        <div className="tabs" role="tablist">
          {(
            [
              ["books", `My Books (${items.length})`],
              ["wishlist", `Wishlist (${wishlistBooks.length})`],
              ["subscription", "Subscription"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>

        {tab === "books" && (
          items.length === 0 ? (
            <div className="empty-state">
              <BookOpen />
              <h3>Your shelf is empty — for now</h3>
              <p>Buy a book or grab a free one, and it will live here with its download links.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
                <Link href="/browse" className="btn btn-primary">Browse Books</Link>
                <Link href="/free-books" className="btn btn-secondary">Get a Free Book</Link>
              </div>
            </div>
          ) : (
            <div className="library-grid">
              {items.map((item, i) => (
                <Reveal key={item.orderId} delay={i * 60}>
                  <LibraryCard item={item} />
                </Reveal>
              ))}
            </div>
          )
        )}

        {tab === "wishlist" && (
          wishlistBooks.length === 0 ? (
            <div className="empty-state">
              <BookOpen />
              <h3>No saved books yet</h3>
              <p>Tap the heart on any book and it will wait for you here.</p>
              <Link href="/browse" className="btn btn-primary" style={{ marginTop: 16 }}>Find Something to Read</Link>
            </div>
          ) : (
            <div className="grid-books cols-4">
              {wishlistBooks.map((b, i) => (
                <Reveal key={b.slug} delay={i * 60}>
                  <BookCard book={b} />
                </Reveal>
              ))}
            </div>
          )
        )}

        {tab === "subscription" && (
          <div>
            {subscription && (
              <div className="subscription-banner" style={{ marginBottom: 30 }}>
                <div className="sb-left">
                  <div className="sb-icon"><CalendarDays /></div>
                  <div>
                    <h3>{subscription.plan} — active</h3>
                    <p>Renews {formatDate(subscription.renewsAt)} · change or cancel anytime.</p>
                  </div>
                </div>
              </div>
            )}
            <SubscriptionPlans compact />
          </div>
        )}
      </div>
    </section>
  );
}

function LibraryCard({ item }: { item: LibraryItem }) {
  const storageKey = `ukweli-progress-${item.book.slug}`;
  const [progress, setProgress] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem(storageKey) ?? 0);
  });
  const remaining = Math.max(0, MAX_DOWNLOADS_PER_PURCHASE - item.downloadsUsed);
  const expires = new Date(new Date(item.purchasedAt).getTime() + 7 * 24 * 60 * 60 * 1000);
  const ownBook = BOOKS.find((b) => b.slug === item.book.slug);

  const update = (value: number) => {
    setProgress(value);
    try { localStorage.setItem(storageKey, String(value)); } catch {}
  };

  return (
    <article className="library-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/covers/${item.book.slug}?w=168`} alt={`Cover of ${item.book.title}`} width={84} height={122} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 className="lc-title">
          <Link href={`/books/${item.book.slug}`} style={{ color: "inherit" }}>{item.book.title}</Link>
        </h3>
        <p className="lc-meta">
          Purchased {formatDate(item.purchasedAt)}
          {item.method === "free" ? " · free edition" : item.method === "mpesa" ? " · via M-Pesa" : " · by card"}
          {ownBook?.price ? ` · ${formatKES(ownBook.price)}` : ""}
        </p>
        <p className="lc-downloads">
          <BookOpen /> {remaining} of {MAX_DOWNLOADS_PER_PURCHASE} downloads left · link expires {formatDate(expires.toISOString())}
        </p>
        <DownloadMorphButton
          href={`/api/download/${item.downloadToken}`}
          label="Download"
          fileName={`${item.book.slug}.pdf`}
          small
          className="btn btn-secondary"
        />
        <div className="progress-block">
          <label>
            <span>Reading progress</span>
            <span>{progress}%</span>
          </label>
          <div className="progress-bar"><span style={{ width: `${progress}%` }} /></div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={progress}
            onChange={(e) => update(Number(e.target.value))}
            aria-label={`Mark how much of ${item.book.title} you have read`}
          />
        </div>
      </div>
    </article>
  );
}
