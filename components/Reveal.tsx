"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal wrapper implementing the motion spec:
 *  - 'up'    → card fade-up (stagger 70/80ms via `delay`)
 *  - 'left' / 'right' → author spotlight alternating slides (400ms)
 * Reduced-motion users get no transform (CSS forces final state).
 */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  variant?: "up" | "left" | "right";
  delay?: number;
  className?: string;
  as?: "div" | "article" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${variant !== "up" ? `reveal-${variant}` : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
