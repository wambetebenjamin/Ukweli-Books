import type { Metadata } from "next";
import { MapPin, MessageCircle, Phone, Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/ui";
import ContactForm from "./ContactForm";
import { WHATSAPP_HELP_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Ukweli Books — WhatsApp, phone or email. We reply within one working hour, Monday to Saturday.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" crumb="Contact" image="/images/blog-1.jpg" />
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
            <div>
              <span className="subheading">We Answer Fast</span>
              <h2 style={{ fontSize: 32, fontWeight: 600 }}>Talk to a human, not a ticket queue</h2>
              <p style={{ marginBottom: 30 }}>
                Looking for a title? Need an invoice for your school? Trouble with a download?
                Reach us any of these ways — WhatsApp is fastest.
              </p>
              <div className="contact-row" style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <MessageCircle style={{ color: "#01d28e", flex: "none", marginTop: 4 }} />
                <div>
                  <strong style={{ display: "block", fontSize: 15 }}>WhatsApp (fastest)</strong>
                  <a href={WHATSAPP_HELP_URL} target="_blank" rel="noreferrer">+254 112 272 061 — chat now</a>
                </div>
              </div>
              <div className="contact-row" style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <Phone style={{ color: "#01d28e", flex: "none", marginTop: 4 }} />
                <div>
                  <strong style={{ display: "block", fontSize: 15 }}>Phone</strong>
                  <span>+254 112 272 061</span>
                </div>
              </div>
              <div className="contact-row" style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <Mail style={{ color: "#01d28e", flex: "none", marginTop: 4 }} />
                <div>
                  <strong style={{ display: "block", fontSize: 15 }}>Email</strong>
                  <span>hello@ukwelibooks.co.ke</span>
                </div>
              </div>
              <div className="contact-row" style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <MapPin style={{ color: "#01d28e", flex: "none", marginTop: 4 }} />
                <div>
                  <strong style={{ display: "block", fontSize: 15 }}>Office</strong>
                  <span>Kencom House, Moi Avenue, Nairobi</span>
                </div>
              </div>
              <div className="contact-row" style={{ display: "flex", gap: 14 }}>
                <Clock style={{ color: "#01d28e", flex: "none", marginTop: 4 }} />
                <div>
                  <strong style={{ display: "block", fontSize: 15 }}>Hours</strong>
                  <span>Mon–Sat, 8:00–18:00 EAT</span>
                </div>
              </div>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
