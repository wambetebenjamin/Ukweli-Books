import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Download, Globe, Heart } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHead } from "@/components/ui";
import { WHATSAPP_NUMBER } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description: "Ukweli Books is Nairobi's digital bookshop — making East African books affordable, instant and impossible to run out of. 'Ukweli' means truth in Kiswahili.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Ukweli Books" crumb="About" image="/images/cat-academic.jpg" />

      <section className="section">
        <div className="container">
          <div className="author-spot-row">
            <Reveal variant="left">
              <div className="author-photo" style={{ aspectRatio: "4/4.6" }}>
                <Image src="/images/cat-academic.jpg" alt="A student studying in an East African university library" fill sizes="(max-width: 992px) 100vw, 40vw" style={{ objectFit: "cover" }} />
              </div>
            </Reveal>
            <Reveal variant="right">
              <div>
                <span className="subheading">Our Story</span>
                <h2 style={{ fontSize: 34, fontWeight: 600 }}>“Ukweli” means truth. We sell books that carry it.</h2>
                <p>
                  Ukweli Books started in 2021 with a frustration every East African reader knows: the
                  book you need is either out of stock, out of budget, or three towns away. So we built
                  the bookshop we wanted — one where every title is in stock forever, priced for real
                  budgets, and delivered before your tea cools.
                </p>
                <p>
                  Today we serve students, researchers, professionals and curious readers in Kenya,
                  Uganda, Tanzania, Rwanda and beyond — with East African voices at the centre of the
                  shelf, not its edge.
                </p>
                <Link href="/browse" className="btn btn-primary" style={{ marginTop: 14 }}>
                  Browse the Catalogue <ArrowRight />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-sm newsletter-band">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 30, textAlign: "center" }}>
            {[
              { n: "15,000+", l: "Active readers" },
              { n: "1,200+", l: "Titles & open papers" },
              { n: "5", l: "East African countries served" },
              { n: "24", l: "Books free forever" },
            ].map((s) => (
              <div key={s.l}>
                <span style={{ display: "block", fontSize: 40, fontWeight: 700, color: "#fff" }}>{s.n}</span>
                <span style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead sub="What We Stand For" title="Four Unreasonable Beliefs" center style={{ marginBottom: 48 }} />
          <div className="grid-plans" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {[
              { icon: BookOpen, t: "Books are infrastructure", d: "Like roads and power lines. A country's readers build everything else." },
              { icon: Download, t: "Instant is respectful", d: "When a student needs a book tonight, 'ships in 3 weeks' is a refusal. Seconds matter." },
              { icon: Heart, t: "Free is part of the deal", d: "A third of our catalogue costs nothing, forever. Reading is a right before it's a market." },
              { icon: Globe, t: "African shelves first", d: "Global titles are welcome — but the centre of our shelf is written here, in our languages." },
            ].map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <div className="plan-card" style={{ padding: "30px 28px" }}>
                  <v.icon size={26} style={{ color: "#1089ff", marginBottom: 14 }} />
                  <h3 style={{ fontSize: 18 }}>{v.t}</h3>
                  <p style={{ fontSize: 14, margin: 0 }}>{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="author-spot-row flip">
            <Reveal variant="right">
              <div className="author-photo" style={{ aspectRatio: "4/4.2" }}>
                <Image src="/images/institutional.jpg" alt="Students studying together in a library" fill sizes="(max-width: 992px) 100vw, 40vw" style={{ objectFit: "cover" }} />
              </div>
            </Reveal>
            <Reveal variant="left">
              <div>
                <span className="subheading">Work With Us</span>
                <h2 style={{ fontSize: 34, fontWeight: 600 }}>Authors, schools and partners</h2>
                <p>
                  Publishing with us takes days, not years: fair royalties (70% to the author), professional
                  typesetting, and distribution to every reader in the region. Schools and libraries get
                  dedicated account managers and term-time support.
                </p>
                <a
                  className="btn btn-secondary"
                  style={{ marginTop: 14 }}
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Ukweli Books! I'd like to talk about publishing/partnership.")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Talk to the Team <ArrowRight />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
