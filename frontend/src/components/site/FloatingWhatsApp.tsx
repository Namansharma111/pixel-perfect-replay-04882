import { MessageCircle } from "lucide-react";
import { SITE } from "@/config/site";

export function FloatingWhatsApp() {
  return (
    <a
      href={SITE.whatsappMessage(
        "Hi Social Waale, I’d like to discuss digital marketing for my business.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Social Waale on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-glow transition-transform hover:scale-105"
    >
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-whatsapp" aria-hidden />
      <MessageCircle className="relative h-6 w-6" />
    </a>
  );
}
