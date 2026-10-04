import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, GraduationCap, MessageCircle, Users } from "lucide-react";
import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import Reveal from "@/components/Reveal";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import NewsletterForm from "@/components/NewsletterForm";
import { SectionHead } from "@/components/ui";
import {
  AUTHORS,
  BLOG_POSTS,
  CATEGORIES,
  COMMUNITY_TILES,
  bookCountsByCategory,
  booksByAuthor,
  featuredBooks,
  freeBooks,
  newArrivals,
} from "@/lib/data";
import { SITE_NAME, WHATSAPP_NUMBER } from "@/lib/utils";

export const revalidate = 300; // ISR per spec

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: "https://ukwelibooks.co.ke",
      logo: "https://ukwelibooks.co.ke/api/covers/beneath-the-jacaranda-sky",
      sameAs: ["https://twitter.com", "https://instagram.com"],
      contactPoint: { "@type": "ContactPoint", telephone: "+254112272061", contactType: "customer service", areaServed: "East Africa" },
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: "https://ukwelibooks.co.ke",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://ukwelibooks.co.ke/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function HomePage() {
  const featured = featuredBooks();
  const arrivals = newArrivals();
  const free = freeBooks().slice(0, 8);
  const counts = bookCountsByCategory();
  const spotlight = AUTHORS.filter((a) => a.featured);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />

      {/* ---------------------------------------------- featured & new arrivals */}
      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <SectionHead sub="Handpicked For You" title="Featured This Week" />
            <Link href="/browse" className="view-all-link">View All Books <ArrowRight /></Link>
          </div>
          <div className="strip-mobile">
            {featured.map((b, i) => (
              <Reveal key={b.slug} delay={i * 70}>
                <BookCard book={b} />
              </Reveal>
            ))}
          </div>

          <div className="section-head-row" style={{ marginTop: 64 }}>
            <SectionHead sub="Just Landed" title="New Arrivals" />
          </div>
          <div className="strip-mobile">
            {arrivals.map((b, i) => (
              <Reveal key={b.slug} delay={i * 70}>
                <BookCard book={b} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- category browse */}
      <section className="section section-light">
        <div className="container">
          <SectionHead sub="Every Shelf Imaginable" title="Browse by Category" center style={{ marginBottom: 48 }}>
            From KCSE revision packs to coastal poetry — ten shelves, thousands of reads.
          </SectionHead>
          <div className="grid-categories">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <Link href={`/categories/${c.slug}`} className="category-card">
                  <span className="cat-bg">
                    <Image src={c.image} alt="" fill sizes="(max-width: 768px) 50vw, 20vw" style={{ objectFit: "cover" }} />
                  </span>
                  <span className="cat-overlay" />
                  <h3>{c.name}</h3>
                  <span className="cat-count">{counts[c.slug] ?? 0} titles in catalogue</span>
                  <span className="cat-link">Browse <ArrowRight /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- free books */}
      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <SectionHead sub="No Cost. All Wonderful." title="Free Books, Forever Free">
              African classics, public-domain works, government education materials and open
              academic papers — free because reading is a right.
            </SectionHead>
            <Link href="/free-books" className="view-all-link">All 24 Free Titles <ArrowRight /></Link>
          </div>
          <div className="strip-mobile">
            {free.map((b, i) => (
              <Reveal key={b.slug} delay={i * 70}>
                <BookCard book={b} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- subscription */}
      <section className="section section-light" id="unlimited">
        <div className="container">
          <SectionHead sub="Ukweli Unlimited" title="One Subscription. Every Book." center style={{ marginBottom: 44 }}>
            Read the whole catalogue — bestsellers, textbooks and papers — for less than the cost
            of one paperback a month.
          </SectionHead>
          <SubscriptionPlans />
        </div>
      </section>

      {/* ---------------------------------------------- author spotlight */}
      <section className="section" id="authors">
        <div className="container">
          <SectionHead sub="Meet The Makers" title="East African Voices" style={{ marginBottom: 56 }} />
          {spotlight.map((author, i) => {
            const titles = booksByAuthor(author.slug);
            const photoFirst = i % 2 === 0;
            return (
              <div key={author.slug} className={`author-spot-row ${photoFirst ? "" : "flip"}`}>
                <Reveal variant={photoFirst ? "left" : "right"}>
                  <div className="author-photo">
                    {author.photo && (
                      <Image src={author.photo} alt={`Portrait of ${author.name}`} fill sizes="(max-width: 992px) 100vw, 38vw" style={{ objectFit: "cover" }} />
                    )}
                  </div>
                </Reveal>
                <Reveal variant={photoFirst ? "right" : "left"}>
                  <div>
                    <span className="author-role">{author.role}</span>
                    <h3>{author.name}</h3>
                    <p>{author.longBio[0]}</p>
                    <div className="author-stats">
                      <div><span className="n">{titles.length}</span><span className="l">Titles Here</span></div>
                      <div><span className="n">4.7</span><span className="l">Avg. Rating</span></div>
                      <div><span className="n">{author.location.split(",")[0]}</span><span className="l">Based In</span></div>
                    </div>
                    <Link href={`/authors/${author.slug}`} className="btn btn-outline-black">
                      View All Books <ArrowRight />
                    </Link>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------- reading community */}
      <section className="section section-light">
        <div className="container">
          <SectionHead sub="The Ukweli Community" title="Join 15,000 Readers Across East Africa" center style={{ marginBottom: 44 }}>
            From Kampala book clubs to Mombasa study groups — readers sharing shelves, quotes and
            Sunday afternoons.
          </SectionHead>
          <div className="community-grid">
            {COMMUNITY_TILES.map((tile, i) => (
              <Reveal key={tile.image} delay={i * 70}>
                <div className="community-tile">
                  <Image src={tile.image} alt={`${tile.name} from ${tile.place} reading`} fill sizes="(max-width: 768px) 33vw, 16vw" style={{ objectFit: "cover" }} />
                  <div className="tile-quote">
                    <p>“{tile.quote}”</p>
                    <span>{tile.name} · {tile.place}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a
              className="btn btn-secondary"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Ukweli! I'd love to share a photo of what I'm reading with the community.")}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle /> Share Your Reading
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- institutions */}
      <section className="section institutional">
        <div className="container">
          <div className="heading-section on-dark" style={{ maxWidth: 720 }}>
            <span className="subheading">For Schools &amp; Libraries</span>
            <h2>Institutional &amp; School Accounts</h2>
            <p>
              Equip a whole classroom, staffroom or campus library. One account, managed seats,
              curriculum-mapped collections, and bulk licences that respect your budget.
            </p>
          </div>
          <div className="inst-list">
            {[
              { icon: GraduationCap, title: "Curriculum-Mapped", text: "CBC, 8-4-4, UBE and CSEE collections pre-built by Kenyan and Ugandan educators." },
              { icon: Users, title: "50 Managed Seats", text: "Assign access by class or department. Usage reports for bursars and librarians." },
              { icon: Building2, title: "Bulk Licensing", text: "Whole-class licences for paid titles at education pricing, invoiced termly." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="inst-item">
                  <item.icon />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <a
            className="btn btn-secondary btn-lg"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! We are a school/library interested in an Ukweli Books institutional account. Please send a proposal.")}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle /> Request a Proposal
          </a>
        </div>
      </section>

      {/* ---------------------------------------------- blog */}
      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <SectionHead sub="From The Blog" title="Reading Notes" />
            <Link href="/blog" className="view-all-link">All Articles <ArrowRight /></Link>
          </div>
          <div className="grid-blog">
            {BLOG_POSTS.map((post, i) => (
              <Reveal key={post.slug} delay={i * 70}>
                <article className="blog-card">
                  <Link href={`/blog/${post.slug}`} className="blog-img">
                    <Image src={post.image} alt="" width={420} height={263} sizes="(max-width: 768px) 100vw, 33vw" placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=" style={{ objectFit: "cover" }} />
                  </Link>
                  <div className="blog-body">
                    <div className="blog-meta">
                      <span><CalendarDays /> {post.date}</span>
                      <span className="badge">{post.tag}</span>
                    </div>
                    <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                    <p>{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="read-more">Read Article <ArrowRight /></Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- newsletter */}
      <section className="section-sm newsletter-band">
        <div className="container">
          <div className="heading-section on-dark" style={{ marginBottom: 26 }}>
            <span className="subheading" style={{ color: "rgba(255,255,255,0.9)" }}>The Editors&apos; Letter</span>
            <h2>Monthly reading list from our editors.</h2>
            <p>Always African. Always excellent.</p>
          </div>
          <NewsletterForm />
          <p className="newsletter-note">One email a month. Unsubscribe anytime. We never share your address.</p>
        </div>
      </section>
    </>
  );
}
