"use client";

import { useEffect, useState } from "react";
import { MessageSquareText, Star } from "lucide-react";
import { Stars } from "@/components/ui";
import { formatDate } from "@/lib/utils";

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
}

export default function ReviewsSection({ bookSlug }: { bookSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?slug=${encodeURIComponent(bookSlug)}`)
      .then((r) => r.json())
      .then((data: { reviews: Review[] }) => { setReviews(data.reviews); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [bookSlug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setPosting(true);
    const draft: Review = { id: `tmp-${Date.now()}`, name: name.trim(), rating, date: new Date().toISOString(), text: text.trim() };
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookSlug, name: draft.name, rating, text: draft.text }),
      });
      if (res.ok) {
        const data = await res.json();
        setReviews((r) => [data.review, ...r]);
      } else {
        setReviews((r) => [draft, ...r]);
      }
    } catch {
      setReviews((r) => [draft, ...r]);
    } finally {
      setPosting(false);
      setText(""); setName(""); setRating(5);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48 }}>
      <div>
        {!loaded ? (
          <p style={{ fontSize: 14 }}>Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <MessageSquareText />
            <h3>No reviews yet</h3>
            <p>Read it? Be the first to tell East Africa what you thought.</p>
          </div>
        ) : (
          reviews.map((r, i) => (
            <div className="review-item" key={r.id}>
              <div className={`avatar ${i % 3 === 1 ? "a2" : i % 3 === 2 ? "a3" : ""}`}>
                {r.name.trim().charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <h4>{r.name}</h4>
                  <span className="review-date">{formatDate(r.date)}</span>
                </div>
                <Stars rating={r.rating} />
                <p>{r.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <form onSubmit={submit} style={{ background: "#f8f9fa", padding: "30px 28px" }}>
          <h3 style={{ fontSize: 19, fontWeight: 600, marginBottom: 18 }}>Write a Review</h3>
          <div className="form-group">
            <label>Your rating</label>
            <div className="star-input">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" className={n <= rating ? "active" : ""} onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`}>
                  <Star fill="currentColor" strokeWidth={0} />
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="rv-name">Name</label>
            <input id="rv-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label htmlFor="rv-text">Review</label>
            <textarea id="rv-text" className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="What did you think? Be honest, be kind." required />
          </div>
          <button className="btn btn-primary" disabled={posting}>
            {posting ? "Posting…" : "Post Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
