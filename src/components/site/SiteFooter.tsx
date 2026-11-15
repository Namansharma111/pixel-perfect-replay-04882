import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { LogoMark } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { services } from "@/data/services";
import { articles } from "@/data/articles";
import { SITE } from "@/config/site";
import { FooterCallbackForm } from "./FooterCallbackForm";

const company = [
  { to: "/about", label: "About Us" },
  { to: "/services", label: "All Services" },
  { to: "/articles", label: "Articles & Blog" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact Us" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-and-conditions", label: "Terms & Conditions" },
] as const;

const headingCls = "mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary";
const linkCls = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35]">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3" aria-label="Social Waale home">
              <LogoMark size={56} />
              <span className="text-2xl font-extrabold">
                Social <span className="text-primary">Waale</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A Chandigarh-based digital marketing and social media marketing agency helping brands
              across North India grow with strategy, creativity and technology. {SITE.stats.clients}{" "}
              clients served across {SITE.stats.services} services.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-3 text-foreground hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary" /> {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={SITE.emailHref}
                  className="flex items-center gap-3 text-foreground hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" /> {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> {SITE.location}
              </li>
            </ul>
            <SocialLinks className="mt-6" />
          </div>

          <div className="lg:col-span-3">
            <p className={headingCls}>Services</p>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`} className={linkCls}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className={headingCls}>Company</p>
            <ul className="space-y-2.5">
              {company.map((c) => (
                <li key={c.to}>
                  <Link to={c.to} className={linkCls}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className={headingCls}>Latest Articles</p>
            <ul className="space-y-2.5">
              {articles.slice(0, 5).map((a) => (
                <li key={a.slug}>
                  <Link to="/articles/$slug" params={{ slug: a.slug }} className={linkCls}>
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Callback Request Form */}
        <div className="mt-12">
          <FooterCallbackForm />
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-surface/50 p-6">
          <p className={headingCls + " mb-3"}>Areas We Serve</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Digital marketing agency in Chandigarh · Social media marketing services in Himachal
            Pradesh · Digital marketing company in Punjab · SEO services in Punjab · Digital
            marketing agency in Haryana · Digital marketing services in Uttar Pradesh · Social media
            marketing services in Delhi NCR · and businesses across India — all served from our base
            in Chandigarh.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Social Waale. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-foreground">
              Terms & Conditions
            </Link>
            <a href="/sitemap.xml" className="hover:text-foreground">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
