import { MessageCircle } from "lucide-react";
import { WHATSAPP_HELP_URL } from "@/lib/utils";

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_HELP_URL}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label="Chat with Ukweli Books on WhatsApp"
    >
      <MessageCircle strokeWidth={2.1} />
      <span className="wa-tip">Ask about a book or get help</span>
    </a>
  );
}
