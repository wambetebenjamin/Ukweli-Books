import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, BookOpen, Download, Users } from "lucide-react";

const ThreeBook = dynamic(() => import("@/components/ThreeBook"), { ssr: false });

const HEADLINE = "Every Book You Need. Download in Seconds.";

/** Split into word spans (natural wrapping) of char spans (0.03s stagger). */
function LetterHeadline() {
  let i = 0;
  return (
    <>
      {HEADLINE.split(" ").map((word, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((char, ci) => (
            <span key={ci} className="char" style={{ "--char-i": i++ } as React.CSSProperties}>
              {char}
            </span>
          ))}
          {wi < HEADLINE.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <Image
          src="/images/hero-library.jpg"
          alt="A student reading among the shelves of an East African library"
          fill
          priority
          quality={75}
          sizes="100vw"
          style={{ objectPosition: "72% 30%" }}
        />
        <div className="hero-overlay" />
      </div>

      <div className="container">
        <div className="hero-grid">
          <div className="hero-text">
            <span className="subheading">East Africa&apos;s Digital Bookshop</span>
            <h1>
              <LetterHeadline />
            </h1>
            <p className="hero-sub">Thousands of East African and global titles. Buy once. Read forever.</p>
            <div className="hero-ctas">
              <Link href="/browse" className="btn btn-primary btn-lg">
                <BookOpen /> Browse Books
              </Link>
              <Link href="/subscription" className="btn btn-outline-white btn-lg">
                Start Free Trial <ArrowRight />
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-num">15,000<em>+</em></span>
                <span className="stat-label">Readers</span>
              </div>
              <div className="hero-stat">
                <span className="stat-num">1,200<em>+</em></span>
                <span className="stat-label">Titles &amp; Papers</span>
              </div>
              <div className="hero-stat">
                <span className="stat-num">24</span>
                <span className="stat-label">Free Forever</span>
              </div>
              <div className="hero-stat">
                <span className="stat-num"><Download size={20} style={{ verticalAlign: "-3px" }} /> 7<span style={{ textTransform: "lowercase" }}>-day</span></span>
                <span className="stat-label">Download Links</span>
              </div>
              <div className="hero-stat" style={{ display: "none" }}>
                <Users />
              </div>
            </div>
          </div>

          <div className="hero-book">
            <div className="book-swing">
              <div style={{ width: 420, height: 440, maxWidth: "100%" }}>
                <ThreeBook />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
