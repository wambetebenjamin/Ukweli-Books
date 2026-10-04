import type { Metadata } from "next";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { PageHero, SectionHead } from "@/components/ui";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Ukweli Unlimited — Reading Subscription",
  description: "Unlimited access to the whole Ukweli Books catalogue. Student KES 299/mo, Personal KES 499/mo, Institution KES 4,999/mo. Annual billing saves 20%.",
};

const FAQS = [
  { q: "What does Ukweli Unlimited include?", a: "Every title on Ukweli Books — paid bestsellers, African classics, all textbooks and every open paper. Students get 5 offline downloads a month; Personal and Institution are unlimited." },
  { q: "How does the free trial work?", a: "Your first 14 days are free on any plan. We remind you by email before your trial ends, and you can cancel in two taps from My Library." },
  { q: "Can I pay with M-Pesa?", a: "Yes — monthly and annual billing both work with M-Pesa (we send an STK push to your phone). International readers can pay by Visa or Mastercard." },
  { q: "What is an Institution account?", a: "Up to 50 users under one school, university or library account, with an admin dashboard, usage reports and bulk licences for class sets. KES 4,999/month or KES 47,990/year." },
  { q: "Do downloads stay mine if I cancel?", a: "Anything you downloaded while subscribed is yours to keep. Your library's download links simply pause until you resubscribe." },
];

export default function SubscriptionPage() {
  return (
    <>
      <PageHero title="Ukweli Unlimited" crumb="Subscription" image="/images/community-2.jpg" />
      <section className="section">
        <div className="container">
          <SectionHead sub="Read Without Limits" title="Choose Your Plan" center style={{ marginBottom: 44 }}>
            One subscription, the entire library — bestsellers, textbooks, papers and classics.
            Start free for 14 days.
          </SectionHead>
          <SubscriptionPlans />
        </div>
      </section>

      <section className="section section-light no-pad-top" style={{ paddingTop: "5em" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <SectionHead sub="Good To Know" title="Frequently Asked" center style={{ marginBottom: 40 }} />
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .faq-list { display: flex; flex-direction: column; gap: 14px; }
        .faq-item { background: #fff; box-shadow: var(--shadow-card); padding: 22px 26px; }
        .faq-item summary { cursor: pointer; font-size: 16px; font-weight: 600; color: rgba(0,0,0,0.8); list-style: none; display: flex; justify-content: space-between; align-items: center; }
        .faq-item summary::after { content: "+"; font-size: 22px; color: var(--color-primary); font-weight: 400; transition: transform 250ms; }
        .faq-item[open] summary::after { transform: rotate(45deg); }
        .faq-item p { font-size: 14px; margin: 14px 0 0; }
      `}</style>
    </>
  );
}
