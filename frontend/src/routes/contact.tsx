import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero, Section, IconBadge } from "@/components/site/primitives";
import { ContactForm } from "@/components/site/ContactForm";
import { SocialLinks } from "@/components/site/SocialLinks";
import { FAQList } from "@/components/site/FAQ";
import { PageWrapper } from "@/components/site/PageWrapper";
import { pageHead, faqSchema } from "@/lib/seo";
import { SITE } from "@/config/site";

const CONTACT_FAQS = [
  {
    q: "How quickly will you reply?",
    a: "We aim to respond to every enquiry as soon as possible during working days. For the fastest reply, message us on WhatsApp.",
  },
  {
    q: "Is the first consultation free?",
    a: "Yes. The first discovery call is free. We use it to understand your business and goals before recommending anything.",
  },
  {
    q: "Do you work with businesses outside Chandigarh?",
    a: "Yes. We work with businesses across Himachal Pradesh, Punjab, Haryana, Uttar Pradesh, Delhi NCR and other parts of India, mostly over calls and WhatsApp.",
  },
];

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact Social Waale | Digital Marketing Agency Chandigarh",
      description:
        "Contact Social Waale in Chandigarh for a free digital marketing consultation. Call +91 9805789363, WhatsApp us, email or send an enquiry form.",
      path: "/contact",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ],
      jsonLd: [faqSchema(CONTACT_FAQS)],
    }),
  component: ContactPage,
});

const CHANNELS = [
  { Icon: Phone, label: "Call us", value: SITE.phone, href: SITE.phoneHref, external: false },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: SITE.whatsappHref,
    external: true,
  },
  { Icon: Mail, label: "Email", value: SITE.email, href: SITE.emailHref, external: false },
];

function ContactPage() {
  return (
    <PageWrapper>
      <PageHero
        eyebrow="Contact us"
        title={
          <>
            Let’s talk about <span className="text-gradient">growing your business</span>
          </>
        }
        description="Tell us what you’re working on. We’ll get back with honest recommendations and a clear next step — no pressure."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="space-y-4 lg:col-span-4">
            {CHANNELS.map(({ Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="card-premium card-hover flex items-center gap-4 p-5"
              >
                <IconBadge>
                  <Icon className="h-5 w-5" />
                </IconBadge>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </span>
                  <span className="mt-0.5 block break-all font-semibold text-foreground">
                    {value}
                  </span>
                </span>
              </a>
            ))}
            <div className="card-premium flex items-center gap-4 p-5">
              <IconBadge>
                <MapPin className="h-5 w-5" />
              </IconBadge>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Based in
                </span>
                <span className="mt-0.5 block font-semibold text-foreground">{SITE.location}</span>
              </span>
            </div>
            <div className="card-premium p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Follow us
              </p>
              <SocialLinks className="mt-3" />
            </div>
          </aside>
          <div className="card-premium p-6 sm:p-8 lg:col-span-8">
            <h2 className="text-2xl font-extrabold">Send us an enquiry</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fields marked optional can be left blank.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
      <Section className="bg-gradient-section" labelledBy="contact-faq">
        <div className="mx-auto max-w-3xl">
          <h2 id="contact-faq" className="text-center text-3xl font-extrabold">
            Before you reach out
          </h2>
          <div className="mt-10">
            <FAQList faqs={CONTACT_FAQS} />
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}
