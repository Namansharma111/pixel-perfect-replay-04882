import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./primitives";
import { SITE } from "@/config/site";

export function CTASection({
  title = "Ready to turn your brand into a growth story?",
  description = "Tell us about your business and goals. We’ll come back with honest recommendations and a clear plan — no pressure, no jargon.",
  whatsappText = "Hi Social Waale, I’d like a free consultation for my business.",
}: {
  title?: string;
  description?: string;
  whatsappText?: string;
}) {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        <div className="reveal relative overflow-hidden rounded-[2.5rem] border border-primary/25 bg-navy p-8 sm:p-12 lg:p-16">
          <div
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-orange/25 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
            aria-hidden
          />
          <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow">Let’s grow together</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">{description}</p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-5">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">
                  Get a Free Consultation <ArrowRight />
                </Link>
              </Button>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild variant="whatsapp" size="xl">
                  <a
                    href={SITE.whatsappMessage(whatsappText)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle /> WhatsApp
                  </a>
                </Button>
                <Button asChild variant="glass" size="xl">
                  <a href={SITE.phoneHref}>
                    <Phone /> Call Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
