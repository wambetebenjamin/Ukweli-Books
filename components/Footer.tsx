import Link from "next/link";
import { BookOpen, ChevronRight, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Smartphone, Twitter } from "lucide-react";
import { CATEGORIES } from "@/lib/data";

export default function Footer() {
  const year = 2026;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="footer-logo">
              <BookOpen strokeWidth={2.2} />
              Ukweli<span>Books</span>
            </Link>
            <p style={{ fontSize: 14, maxWidth: 300 }}>
              “Ukweli” means <em>truth</em> in Kiswahili. We are East Africa&apos;s digital bookshop — real books,
              real authors, delivered in seconds. Buy once. Read forever.
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer"><Twitter /></a>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer"><Facebook /></a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram /></a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin /></a>
            </div>
            <div className="payment-badges" aria-label="Accepted payment methods">
              <span className="pay"><i style={{ background: "#01d28e" }} />M-PESA</span>
              <span className="pay">VISA</span>
              <span className="pay">Mastercard</span>
            </div>
          </div>

          <div>
            <h3>Explore</h3>
            <ul>
              {[
                ["Browse Books", "/browse"],
                ["Free Books", "/free-books"],
                ["Ukweli Unlimited", "/subscription"],
                ["My Library", "/library"],
                ["Author Spotlights", "/#authors"],
                ["Blog", "/blog"],
              ].map(([label, href]) => (
                <li key={href}><Link href={href}><ChevronRight />{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Categories</h3>
            <ul>
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}><Link href={`/categories/${c.slug}`}><ChevronRight />{c.name}</Link></li>
              ))}
              <li><Link href="/categories"><ChevronRight />All Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3>Get in Touch</h3>
            <div className="contact-row"><MapPin /><span>Kencom House, Moi Avenue<br />Nairobi, Kenya</span></div>
            <div className="contact-row"><Phone /><span>+254 112 272 061</span></div>
            <div className="contact-row"><Mail /><span>hello@ukwelibooks.co.ke</span></div>
            <div className="app-placeholder">
              <span className="app-btn" title="Coming soon">
                <Smartphone />
                <span><small>COMING SOON</small><b>Download App</b></span>
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} Ukweli Books Ltd. Nairobi, Kenya. All rights reserved.</span>
          <span>
            <Link href="/contact" style={{ color: "inherit" }}>Privacy</Link>
            {" · "}
            <Link href="/contact" style={{ color: "inherit" }}>Terms</Link>
            {" · "}Serving all of East Africa
          </span>
        </div>
      </div>
    </footer>
  );
}
