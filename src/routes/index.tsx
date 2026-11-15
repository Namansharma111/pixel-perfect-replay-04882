import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  Camera,
  CheckCircle2,
  Compass,
  Handshake,
  HeartHandshake,
  HeartPulse,
  Laptop,
  Lightbulb,
  LineChart,
  MapPin,
  MessageSquareQuote,
  Palette,
  Rocket,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
  Users,
  Utensils,
  Stethoscope,
  Building2,
  GraduationCap,
  ShoppingBag,
  Hotel,
  Dumbbell,
  Factory,
  Gem,
  Car,
  Instagram,
  Phone,
  Zap,
} from "lucide-react";
import heroImg from "@/assets/hero-growth.jpg";
import aboutImg from "@/assets/about-studio.jpg";
import socialImg from "@/assets/blog-social.jpg";
import brandingImg from "@/assets/blog-branding.jpg";
import websiteImg from "@/assets/blog-website.jpg";
import adsImg from "@/assets/blog-ads.jpg";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, Container, IconBadge } from "@/components/site/primitives";
import { ServiceCard } from "@/components/site/cards";
import { FAQList } from "@/components/site/FAQ";
import { CTASection } from "@/components/site/CTASection";
import { PortfolioSection } from "@/components/site/PortfolioSection";
import { LongFormSeoContent } from "@/components/site/LongFormSeoContent";
import { NorthIndiaArtwork } from "@/components/site/NorthIndiaArtwork";
import { services } from "@/data/services";
import { SITE } from "@/config/site";
import { pageHead, faqSchema } from "@/lib/seo";
import { getPublicHomepageFn } from "@/lib/cms/cms.functions";
import type {
  CMSHomepageHero,
  CMSHomepageTrustBar,
  CMSHomepageAbout,
  CMSHomepageServices,
  CMSHomepageWhyChoose,
  CMSHomepageProcess,
  CMSHomepageTestimonials,
  CMSHomepageFaqs,
} from "@/lib/cms/types";

const HOME_FAQS = [
  {
    q: "What does a digital marketing agency in Chandigarh like Social Waale do?",
    a: "We help businesses get discovered and generate enquiries online. That includes social media marketing, SEO, Google Ads, content, branding, websites and creative production — planned together so every channel supports the same business goal.",
  },
  {
    q: "Do you only work with businesses in Chandigarh?",
    a: "No. We’re based in Chandigarh and work with businesses across Himachal Pradesh, Punjab, Haryana, Uttar Pradesh, Delhi NCR and other parts of India. Most collaboration happens over calls, WhatsApp and shared reports, with in-person meetings possible in the tricity.",
  },
  {
    q: "How much do your digital marketing services cost?",
    a: "Pricing depends on the services, number of platforms, content volume and ad budget involved. After a free consultation we share a clear proposal with scope and fees, so you know exactly what you’re paying for before anything starts.",
  },
  {
    q: "How soon can I expect results from digital marketing?",
    a: "Paid campaigns can start bringing enquiries within days of launch, while SEO and organic social media build momentum over a few months. We set realistic expectations upfront and track progress with transparent monthly reporting.",
  },
  {
    q: "Is the ad budget included in your fees?",
    a: "Usually not. Ad spend is paid directly to platforms like Google or Meta, and our fee covers strategy, creatives, setup, optimisation and reporting. This keeps your ad money fully visible and under your control.",
  },
  {
    q: "Can you manage everything — social media, website and ads — together?",
    a: "Yes. Many clients prefer one team handling all channels so messaging stays consistent and nothing falls between agencies. You can also start with a single service and add more as you grow.",
  },
  {
    q: "How do we get started?",
    a: "Fill in the contact form, WhatsApp us or call +91 9805789363. We’ll schedule a short discovery call, understand your business and goals, and then recommend the services that make sense for you.",
  },
];

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const res = await getPublicHomepageFn();
      return { homepage: res.ok ? res.homepage : null };
    } catch {
      return { homepage: null };
    }
  },
  head: ({ loaderData }) => {
    const hp = loaderData?.homepage;
    const title = hp?.seo?.metaTitle || "Digital Marketing Agency in Chandigarh | Social Waale";
    const description =
      hp?.seo?.metaDescription ||
      "Social Waale is a Chandigarh-based digital marketing agency for social media marketing, SEO, Google Ads, branding and websites across North India.";
    const activeFaqs =
      hp?.faqs?.enabled !== false && hp?.faqs?.items && hp.faqs.items.length > 0
        ? hp.faqs.items
            .filter((f: any) => f.enabled !== false)
            .map((f: any) => ({ q: f.q, a: f.a }))
        : HOME_FAQS;

    return pageHead({
      title,
      description,
      path: "/",
      jsonLd: [faqSchema(activeFaqs.length > 0 ? activeFaqs : HOME_FAQS)],
    });
  },
  component: HomePage,
});

function HomePage() {
  const loaderData = Route.useLoaderData();
  const hp = loaderData?.homepage;

  return (
    <>
      {(!hp || hp.hero?.enabled !== false) && <Hero data={hp?.hero} />}
      {(!hp || hp.trustBar?.enabled !== false) && <TrustBar data={hp?.trustBar} />}
      {(!hp || hp.about?.enabled !== false) && <AboutIntro data={hp?.about} />}
      {(!hp || hp.services?.enabled !== false) && <ServicesGrid data={hp?.services} />}
      {(!hp || hp.portfolio?.enabled !== false) && <PortfolioSection />}
      {(!hp || hp.whyChoose?.enabled !== false) && <WhyChoose data={hp?.whyChoose} />}
      {(!hp || hp.process?.enabled !== false) && <Process />}
      {(!hp || hp.industries?.enabled !== false) && <Industries />}
      <FeaturedWork />
      <Locations />
      {(!hp || hp.testimonials?.enabled !== false) && <Testimonials data={hp?.testimonials} />}
      {(!hp || hp.faqs?.enabled !== false) && <SeoContent data={hp?.faqs} />}
      {(!hp || hp.cta?.enabled !== false) && (
        <CTASection
          {...(hp?.cta?.heading ? { title: hp.cta.heading } : {})}
          {...(hp?.cta?.description ? { description: hp.cta.description } : {})}
        />
      )}
      <LongFormSeoContent />
    </>
  );
}

/* ---------------- Hero (Redesigned per IMAGE 1 reference) ---------------- */
function Hero({ data }: { data?: CMSHomepageHero | undefined }) {
  const defaultStats = [
    { value: "50+", label: "Clients Served" },
    { value: "10", label: "Growth Services" },
    { value: "1–2 Years", label: "Experience" },
    { value: "Pan India", label: "Service Reach" },
  ];
  const stats = data?.stats && data.stats.length > 0 ? data.stats : defaultStats;

  return (
    <section className="relative -mt-20 overflow-hidden pt-20 bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] text-white">
      {/* Background ambient lighting and subtle grid matching Image 1 */}
      <div
        className="pointer-events-none absolute -left-32 top-10 h-[34rem] w-[34rem] rounded-full bg-[#142A82]/40 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-[36rem] w-[36rem] rounded-full bg-[#0E1E68]/35 blur-[140px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-[#FF941E]/10 blur-[120px]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />

      <Container className="relative pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-14">
          {/* ================= LEFT SIDE ================= */}
          <div className="lg:col-span-7 xl:col-span-7">
            {/* 1. Location badge with location pin icon (matching Image 1) */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD84A]/30 bg-[#080F35]/90 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#FFD84A] shadow-sm backdrop-blur-md transition-colors hover:border-[#FFD84A]/60">
              <MapPin className="h-3.5 w-3.5 text-[#FFD84A] shrink-0" />
              <span>{data?.eyebrowBadge || "CHANDIGARH-BASED DIGITAL MARKETING AGENCY"}</span>
            </div>

            {/* 2. Main H1 headline with yellow-to-orange gradient highlight */}
            <h1 className="mt-5 text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] xl:text-[3.65rem]">
              {data?.h1 ? (
                data.h1
              ) : (
                <>
                  Digital Marketing Agency in Chandigarh That Turns Brands Into{" "}
                  <span className="bg-gradient-to-r from-[#FFD84A] via-[#FFB834] to-[#FF941E] bg-clip-text text-transparent">
                    Growth Stories.
                  </span>
                </>
              )}
            </h1>

            {/* 3. Description paragraphs */}
            <p className="mt-6 text-base leading-relaxed text-[#D5DAE7] sm:text-lg sm:leading-relaxed">
              {data?.description1 ||
                "Looking for a reliable digital marketing agency in Chandigarh? Social Waale helps businesses across Chandigarh, Punjab, Himachal Pradesh, Haryana and beyond build a stronger online presence through SEO, social media marketing, Google Ads, creative branding and digital growth solutions."}
            </p>
            <p className="mt-3.5 text-sm leading-relaxed text-[#D5DAE7]/90 sm:text-base sm:leading-relaxed">
              {data?.description2 ||
                "From building brand awareness to attracting relevant audiences and generating meaningful enquiries, we combine strategy, creativity and technology to move your business forward."}
            </p>

            {/* 4. Two CTA buttons side by side */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              {/* Primary button with yellow/orange gradient and dark text */}
              <Button
                asChild
                size="xl"
                className="group relative h-13 rounded-full bg-gradient-to-r from-[#FFD84A] to-[#FF941E] px-7 font-bold text-[#080F35] shadow-[0_12px_28px_-6px_rgba(255,148,30,0.45)] transition-all duration-300 hover:scale-[1.02] hover:brightness-105 active:scale-[0.98]"
              >
                <Link to={data?.primaryCtaLink || "/contact"} className="inline-flex items-center gap-2">
                  <span>{data?.primaryCtaText || "Request a Free Quote"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              {/* Secondary button: transparent with subtle border and phone icon */}
              <Button
                asChild
                size="xl"
                className="h-13 rounded-full border border-white/20 bg-white/5 px-6 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/10 active:scale-[0.98]"
              >
                <a href={data?.secondaryCtaLink || "tel:+919805789363"} className="inline-flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-[#FFD84A]" />
                  <span>{data?.secondaryCtaText || "+91 9805789363"}</span>
                </a>
              </Button>
            </div>

            {/* 5. Four small trust / statistic indicators below the buttons (matching Image 1) */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4 sm:gap-6">
              {stats.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-2xl font-extrabold tracking-tight text-[#FFD84A] sm:text-3xl">
                    {item.value}
                  </span>
                  <span className="mt-1 text-xs font-medium uppercase tracking-wider text-[#D5DAE7]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT SIDE (VISUAL CARD) ================= */}
          <div className="relative mt-8 lg:col-span-5 lg:mt-0 xl:col-span-5">
            {/* Visual Card Container with subtle float and tilt matching Image 1 */}
            <div className="relative mx-auto max-w-[500px] lg:max-w-none">
              {/* Soft ambient back glow behind the white card */}
              <div
                className="pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-[#FFD84A]/20 via-[#142A82]/40 to-[#FF941E]/20 blur-2xl opacity-70"
                aria-hidden
              />

              {/* Top-Right Floating Yellow/Orange Badge (slanted like Image 1 "Award-winning • 2024") */}
              <div className="absolute -top-3.5 right-2 z-30 rotate-[6deg] sm:-top-5 sm:right-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FFD84A] to-[#FF941E] px-3.5 py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-tight text-[#080F35] shadow-[0_8px_20px_-4px_rgba(255,148,30,0.5)]">
                  <Sparkles className="h-3.5 w-3.5 fill-[#080F35]" />
                  Your Digital Growth Partner
                </span>
              </div>

              {/* The Tilted White Architectural Card (Matching Image 1 Card) */}
              <div className="group relative rounded-[2rem] bg-white p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.2)] transition-transform duration-500 hover:rotate-0 rotate-[-3.5deg] sm:rotate-[-4.5deg]">
                {/* Visual Header / Micro Tag inside card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Chandigarh • Punjab • Himachal
                  </span>
                </div>

                {/* The Custom Architectural Panorama Artwork */}
                <div className="mt-3 overflow-hidden rounded-xl bg-gradient-to-b from-slate-50/50 to-white">
                  <NorthIndiaArtwork className="w-full h-auto drop-shadow-sm transition-transform duration-700 group-hover:scale-[1.02]" />
                </div>

                {/* Subtitle inside card */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-500">
                  <span className="text-slate-700 font-bold">Growing Brands Across North India</span>
                  <span className="text-amber-600 font-bold">Social Waale™</span>
                </div>
              </div>

              {/* Floating Glass Notification Card 1 (Upper Left) */}
              <div className="glass absolute -left-4 top-12 z-20 hidden sm:flex items-center gap-2.5 rounded-xl border border-white/20 bg-[#080F35]/85 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md animate-float">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#FFD84A] text-[#080F35]">
                  <Lightbulb className="h-3.5 w-3.5" />
                </span>
                <span>Creative Ideas. Strategic Growth.</span>
              </div>

              {/* Floating Glass Notification Card 2 (Bottom Right) */}
              <div className="glass absolute -bottom-4 right-4 z-20 hidden sm:flex items-center gap-2.5 rounded-xl border border-white/20 bg-[#080F35]/85 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md animate-float-delayed">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#FF941E] text-white">
                  <Rocket className="h-3.5 w-3.5" />
                </span>
                <span>Social Media • SEO • Performance</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Brand SVG Logos ---------------- */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ig-grad-marquee" cx="20%" cy="110%" r="140%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="10%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad-marquee)" />
      <path
        fill="#ffffff"
        d="M12 5.838c2.007 0 2.245.008 3.037.043.734.034 1.132.157 1.398.26.351.137.602.3.865.563.263.263.426.514.563.865.103.266.226.664.26 1.398.035.792.043 1.03.043 3.037s-.008 2.245-.043 3.037c-.034.734-.157 1.132-.26 1.398a2.33 2.33 0 0 1-.563.865 2.33 2.33 0 0 1-.865.563c-.266.103-.664.226-1.398.26-.792.035-1.03.043-3.037.043s-2.245-.008-3.037-.043c-.734-.034-1.132-.157-1.398-.26a2.33 2.33 0 0 1-.865-.563 2.33 2.33 0 0 1-.563-.865c-.103-.266-.226-.664-.26-1.398-.035-.792-.043-1.03-.043-3.037s.008-2.245.043-3.037c.034-.734.157-1.132.26-1.398.137-.351.3-.602.563-.865.263-.263.514-.426.865-.563.266-.103.664-.226 1.398-.26.792-.035 1.03-.043 3.037-.043zm0-1.638c-2.041 0-2.298.009-3.1.045-.8.037-1.348.164-1.826.35a3.97 3.97 0 0 0-1.436.935 3.97 3.97 0 0 0-.935 1.436c-.186.478-.313 1.026-.35 1.826-.036.802-.045 1.059-.045 3.1s.009 2.298.045 3.1c.037.8.164 1.348.35 1.826.186.479.447.886.935 1.436.488.55 1.026.81 1.436.935.478.186 1.026.313 1.826.35.802.036 1.059.045 3.1.045s2.298-.009 3.1-.045c.8-.037 1.348-.164 1.826-.35a3.97 3.97 0 0 0 1.436-.935 3.97 3.97 0 0 0 .935-1.436c.186-.478.313-1.026.35-1.826.036-.802.045-1.059.045-3.1s-.009-2.298-.045-3.1c-.037-.8-.164-1.348-.35-1.826a4.19 4.19 0 0 0-.935-1.436 3.97 3.97 0 0 0-1.436-.935c-.478-.186-1.026-.313-1.826-.35-.802-.036-1.059-.045-3.1-.045zm0 3.738a4.262 4.262 0 1 0 0 8.524 4.262 4.262 0 0 0 0-8.524zm0 7.024a2.762 2.762 0 1 1 0-5.524 2.762 2.762 0 0 1 0 5.524zm5.432-7.194a.996.996 0 1 0 0 1.992.996.996 0 0 0 0-1.992z"
      />
    </svg>
  );
}

function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#FF0000"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      />
      <path fill="#ffffff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#0A66C2"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z"
      />
    </svg>
  );
}

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#25D366"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15c-1.5 0-2.97-.4-4.26-1.17l-.3-.18-3.12.82.83-3.04-.2-.31a8.12 8.12 0 0 1-1.25-4.36c0-4.51 3.67-8.18 8.18-8.18 4.51 0 8.18 3.67 8.18 8.18 0 4.51-3.67 8.18-8.18 8.18zm4.49-6.13c-.25-.12-1.47-.72-1.7-.81-.23-.09-.39-.12-.56.12-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"
      />
    </svg>
  );
}

function MetaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#0081FB"
        d="M12 7.02c-1.92 0-3.32 1.3-4.2 2.68-1.08-1.63-2.6-2.68-4.52-2.68C1.45 7.02 0 8.7 0 11.28c0 3.64 3.03 7.7 6.78 7.7 2.22 0 3.89-1.26 5.22-3.16 1.33 1.9 3 3.16 5.22 3.16 3.75 0 6.78-4.06 6.78-7.7 0-2.58-1.45-4.26-3.28-4.26-1.92 0-3.44 1.05-4.52 2.68-.88-1.38-2.28-2.68-4.2-2.68zm-5.22 9.9c-2.3 0-4.14-2.88-4.14-5.64 0-1.35.73-2.2 1.83-2.2 1.57 0 2.87 1.4 3.84 3.1-.73 2.62-1.17 4.74-1.53 4.74zm10.44 0c-.36 0-.8-2.12-1.53-4.74.97-1.7 2.27-3.1 3.84-3.1 1.1 0 1.83.85 1.83 2.2 0 2.76-1.84 5.64-4.14 5.64z"
      />
    </svg>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#000000"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function PinterestLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#E60023"
        d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.98-.12-2.48.02-3.55.13-.98.86-5.83.86-5.83s-.22-.44-.22-1.1c0-1.03.6-1.8 1.34-1.8.63 0 .94.48.94 1.05 0 .64-.4 1.6-.62 2.49-.18.74.37 1.34 1.1 1.34 1.32 0 2.34-1.39 2.34-3.4 0-1.78-1.28-3.02-3.1-3.02-2.12 0-3.37 1.59-3.37 3.23 0 .64.25 1.33.56 1.7.06.07.07.14.05.21-.06.24-.19.78-.22.9-.04.15-.12.18-.28.11-1.05-.49-1.7-2.02-1.7-3.25 0-2.65 1.92-5.08 5.55-5.08 2.91 0 5.18 2.08 5.18 4.85 0 2.9-1.83 5.23-4.37 5.23-.85 0-1.66-.45-1.93-.98l-.53 2c-.19.74-.71 1.67-1.06 2.23A12 12 0 1 0 12 0z"
      />
    </svg>
  );
}

function SnapchatLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#FFFC00" />
      <path
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="1.2"
        strokeLinejoin="round"
        d="M12 4.5c-3.1 0-5.1 2.3-5.1 4.7 0 .8.2 2 .5 2.5-.3.4-1 .6-1.5.7-.3.1-.4.3-.3.5.2.4.9.7 1.7.7.1.6.4 1.5 1.2 1.7.7.2 1.4-.4 1.8-.7.5.3 1.1.5 1.7.5s1.2-.2 1.7-.5c.4.3 1.1.9 1.8.7.8-.2 1.1-1.1 1.2-1.7.8 0 1.5-.3 1.7-.7.1-.2 0-.4-.3-.5-.5-.1-1.2-.3-1.5-.7.3-.5.5-1.7.5-2.5 0-2.4-2-4.7-5.1-4.7z"
      />
    </svg>
  );
}

/* ---------------- Trust bar (Redesigned per IMAGE 1 reference) ---------------- */
function TrustBar({ data }: { data?: CMSHomepageTrustBar | undefined }) {
  const sampleLogos = [
    {
      name: "Google",
      tag: "SEARCH & ADS",
      Logo: GoogleLogo,
    },
    {
      name: "Facebook",
      tag: "META NETWORK",
      Logo: FacebookLogo,
    },
    {
      name: "Instagram",
      tag: "REELS & SOCIAL",
      Logo: InstagramLogo,
    },
    {
      name: "YouTube",
      tag: "VIDEO & SHORTS",
      Logo: YouTubeLogo,
    },
    {
      name: "LinkedIn",
      tag: "B2B & OUTREACH",
      Logo: LinkedInLogo,
    },
    {
      name: "WhatsApp",
      tag: "DIRECT CHAT & CRM",
      Logo: WhatsAppLogo,
    },
    {
      name: "Meta",
      tag: "PERFORMANCE ADS",
      Logo: MetaLogo,
    },
    {
      name: "X (Twitter)",
      tag: "TRENDS & PR",
      Logo: XLogo,
    },
    {
      name: "Pinterest",
      tag: "VISUAL DISCOVERY",
      Logo: PinterestLogo,
    },
    {
      name: "Snapchat",
      tag: "AR & YOUNG AUDIENCE",
      Logo: SnapchatLogo,
    },
  ];

  const defaultStats = [
    {
      value: "50+",
      title: "Clients Served",
      description: "Across diverse North India businesses",
    },
    {
      value: "10",
      title: "Digital Marketing Services",
      description: "Full-funnel digital growth solutions",
    },
    {
      value: "1–2 Years",
      title: "Agency Experience",
      description: "Focused & transparent execution",
    },
    {
      value: "Pan India",
      title: "Service Reach",
      description: "Chandigarh, Tricity & nationwide",
    },
  ];
  const stats = data?.stats && data.stats.length > 0 ? data.stats : defaultStats;

  const trackRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let animId: number;
    let pos = -50;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Check whether CSS animation is running natively
      const style = window.getComputedStyle(el);
      const isCssRunning =
        style.animationName.includes("marquee-ltr") &&
        style.animationPlayState === "running" &&
        parseFloat(style.animationDuration) > 0.01;

      // If CSS animation is not running (e.g. reduced-motion override), drive smoothly with JS
      if (!isCssRunning && !isHoveredRef.current) {
        // Move from -50% to 0% over 26 seconds (Left to Right ->)
        pos += dt * (50 / 26);
        if (pos >= 0) {
          pos = -50;
        }
        el.style.transform = `translate3d(${pos}%, 0, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      aria-label="Trusted by Ambitious Brands"
      className="relative overflow-hidden border-y border-[#142A82]/40 bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] py-16 sm:py-20 lg:py-24 text-white"
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[#142A82]/30 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-[#FF941E]/10 blur-[100px]"
        aria-hidden
      />

      <Container className="relative">
        {/* 1. Centered Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD84A]/30 bg-[#080F35]/90 px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#FFD84A] shadow-sm backdrop-blur-md">
            <span>✦</span>
            <span>{data?.eyebrowBadge || "TRUSTED BY BUSINESSES ACROSS NORTH INDIA"}</span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] leading-[1.18]">
            {data?.heading ? (
              data.heading
            ) : (
              <>
                Trusted by{" "}
                <span className="bg-gradient-to-r from-[#FFD84A] via-[#FFB834] to-[#FF941E] bg-clip-text text-transparent">
                  Ambitious Brands
                </span>{" "}
                & Growing Businesses
              </>
            )}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-[#D5DAE7] sm:text-lg">
            {data?.description ||
              "From emerging startups to established businesses, Social Waale helps brands build stronger digital identities and meaningful online connections."}
          </p>
        </div>
      </Container>

      {/* Embedded CSS animation for guaranteed continuous Left-to-Right scrolling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-ltr {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }
        .marquee-track-ltr {
          display: flex !important;
          width: max-content !important;
          animation: marquee-ltr 26s linear infinite !important;
          will-change: transform;
        }
        .group:hover .marquee-track-ltr,
        .marquee-track-ltr:hover {
          animation-play-state: paused !important;
        }
      `}} />

      {/* 2. Continuously Scrolling Brand Logos (Infinite Marquee Left to Right) */}
      <div
        className="relative mt-12 sm:mt-14 w-full overflow-hidden group"
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
      >
        {/* Subtle gradient edge fades */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-20 sm:w-36 bg-gradient-to-r from-[#080F35] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-20 sm:w-36 bg-gradient-to-l from-[#080F35] to-transparent"
          aria-hidden
        />

        {/* Scrolling track: duplicated 10+10 items for seamless -50% to 0% loop (Left to Right ->) */}
        <div
          ref={trackRef}
          className="marquee-track-ltr flex w-max gap-4 sm:gap-5 py-2"
        >
          {[...sampleLogos, ...sampleLogos].map((b, idx) => {
            const Logo = b.Logo;

            return (
              <div
                key={`${b.name}-${idx}`}
                className="flex h-18 sm:h-20 min-w-[210px] sm:min-w-[230px] items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white px-5 py-3 text-slate-900 shadow-[0_4px_18px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:scale-105 select-none shrink-0"
              >
                <div className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl bg-slate-50 border border-slate-100 p-1.5 shrink-0">
                  <Logo className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
                    {b.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                    {b.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Four Statistic Cards in One Horizontal Row */}
      <Container className="relative mt-12 sm:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-2xl sm:rounded-3xl border border-[#142A82]/50 bg-[#0B1540]/60 p-6 sm:p-7 text-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FFD84A]/40 hover:shadow-[0_16px_40px_-10px_rgba(20,42,130,0.5)]"
            >
              {/* Subtle top accent highlight on hover */}
              <div
                className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-[#FFD84A]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
              <p className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-[#FFD84A] via-[#FFB834] to-[#FF941E] bg-clip-text text-transparent">
                {s.value}
              </p>
              <h3 className="mt-3 text-base sm:text-lg font-bold text-white">
                {s.title}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- About intro ---------------- */
function AboutIntro({ data }: { data?: CMSHomepageAbout | undefined }) {
  const defaultPoints = [
    "Strategy first — every campaign starts with your business goals",
    "One team for social, search, ads, design and web",
    "Clear reporting you can actually understand",
    "Local understanding of North Indian audiences",
  ];
  const points = data?.highlights && data.highlights.length > 0 ? data.highlights : defaultPoints;

  return (
    <Section labelledBy="about-heading">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="reveal relative">
          <img
            src={data?.featuredImage || aboutImg}
            alt={data?.imageAlt || "Social Waale creative workspace with analytics dashboard, social media feed and brand mood boards"}
            loading="lazy"
            width={1280}
            height={960}
            className="rounded-[2rem] border border-border object-cover shadow-card"
          />
          <div className="glass absolute -bottom-6 right-6 rounded-2xl p-5 shadow-card">
            <p className="text-3xl font-extrabold text-gradient">{SITE.stats.clients}</p>
            <p className="text-xs text-muted-foreground">Businesses served</p>
          </div>
        </div>
        <div>
          <SectionHeading
            align="left"
            id="about-heading"
            eyebrow={data?.eyebrowBadge || "About Social Waale"}
            title={
              data?.heading ? (
                data.heading
              ) : (
                <>
                  A Chandigarh agency built for{" "}
                  <span className="text-gradient">ambitious brands</span>
                </>
              )
            }
            description={
              data?.descriptionParagraphs?.[0] ||
              "Social Waale is a digital marketing and social media marketing agency based in Chandigarh. In our first years we’ve worked with 50+ businesses — from local shops and clinics to growing service brands — helping them show up online with confidence and turn attention into real conversations."
            }
          />
          <ul className="mt-8 grid gap-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {p}
              </li>
            ))}
          </ul>
          <Button asChild variant="glass" size="lg" className="mt-8">
            <Link to={data?.readMoreButtonLink || "/about"}>
              {data?.readMoreButtonText || "More about us"} <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- Services ---------------- */
function ServicesGrid({ data }: { data?: CMSHomepageServices | undefined }) {
  const renderedServices =
    data?.mode === "selected" && data.selectedSlugs && data.selectedSlugs.length > 0
      ? services.filter((s) => data.selectedSlugs.includes(s.slug))
      : services;

  return (
    <Section labelledBy="services-heading" className="bg-gradient-section">
      <SectionHeading
        id="services-heading"
        eyebrow={data?.eyebrowBadge || "What we do"}
        title={
          data?.heading ? (
            data.heading
          ) : (
            <>
              10 services. <span className="text-gradient">One growth partner.</span>
            </>
          )
        }
        description={
          data?.description ||
          "From the first impression on Instagram to the final click on your website, we cover every stage of your customer’s digital journey."
        }
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {renderedServices.map((s, i) => (
          <ServiceCard key={s.slug} service={s} index={i} />
        ))}
        <Link
          to={data?.ctaButtonLink || "/contact"}
          className="reveal card-premium group flex flex-col justify-between overflow-hidden border-primary/30 bg-navy p-7 sm:col-span-2 xl:col-span-2"
        >
          <div>
            <p className="eyebrow">Not sure where to start?</p>
            <h3 className="mt-4 text-2xl font-extrabold leading-snug">
              Get a free consultation and we’ll recommend the right mix for your business.
            </h3>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
            {data?.ctaButtonText || "Talk to our team"}{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </Section>
  );
}

/* ---------------- Why choose ---------------- */
function WhyChoose({ data }: { data?: CMSHomepageWhyChoose | undefined }) {
  const defaultItems = [
    {
      Icon: Compass,
      title: "Strategy before posting",
      text: "We understand your business, customers and competitors before creating a single post or ad, so every rupee has a purpose.",
    },
    {
      Icon: Users,
      title: "A team that knows North India",
      text: "Festivals, languages, local buying habits — we plan campaigns that feel native to audiences in Punjab, Himachal, Haryana and beyond.",
    },
    {
      Icon: Lightbulb,
      title: "Creative that stops the scroll",
      text: "Design, reels, copy and photography produced in-house, crafted to match your brand and built to earn attention.",
    },
    {
      Icon: BarChart3,
      title: "Honest, clear reporting",
      text: "Simple monthly reports focused on what matters — enquiries, reach and progress — without vanity metrics or jargon.",
    },
    {
      Icon: ShieldCheck,
      title: "Transparent pricing",
      text: "Clear scope and fees in writing. Your ad budget stays in your own ad accounts, fully visible to you.",
    },
    {
      Icon: HeartHandshake,
      title: "Direct, responsive support",
      text: "Talk directly to the people working on your account over WhatsApp or call — no ticket queues, no runaround.",
    },
  ];

  const items =
    data?.items && data.items.length > 0
      ? data.items.map((it) => ({
          Icon: Compass,
          title: it.title,
          text: it.description,
        }))
      : defaultItems;

  return (
    <Section labelledBy="why-heading">
      <SectionHeading
        id="why-heading"
        eyebrow={data?.eyebrowBadge || "Why Social Waale"}
        title={
          data?.heading ? (
            data.heading
          ) : (
            <>
              Why businesses choose <span className="text-gradient">Social Waale</span>
            </>
          )
        }
        description={
          data?.description ||
          "We’re a young, hands-on agency — which means you get senior attention, quick decisions and a team that genuinely cares about your growth."
        }
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ Icon, title, text }) => (
          <div key={title} className="reveal card-premium card-hover p-7">
            <IconBadge>
              <Icon className="h-5 w-5" />
            </IconBadge>
            <h3 className="mt-5 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Process (6-Step Interactive Timeline) ---------------- */
const PROCESS_STEPS = [
  {
    phase: "PHASE 01",
    num: "01",
    title: "Understand",
    text: "We learn about your business, audience, industry, competitors, and objectives.",
    Icon: Search,
  },
  {
    phase: "PHASE 02",
    num: "02",
    title: "Strategize",
    text: "We identify opportunities and develop a marketing strategy around your growth goals.",
    Icon: Target,
  },
  {
    phase: "PHASE 03",
    num: "03",
    title: "Create",
    text: "We develop content, campaigns, creatives, websites, and other required marketing assets.",
    Icon: Palette,
  },
  {
    phase: "PHASE 04",
    num: "04",
    title: "Launch",
    text: "We execute your SEO, social media, advertising, content, or digital campaigns.",
    Icon: Zap,
  },
  {
    phase: "PHASE 05",
    num: "05",
    title: "Analyze",
    text: "We review available performance data to understand audience response and campaign results.",
    Icon: BarChart3,
  },
  {
    phase: "PHASE 06",
    num: "06",
    title: "Optimize",
    text: "We refine the strategy and marketing activities based on insights and changing opportunities.",
    Icon: TrendingUp,
  },
];

function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [lineFill, setLineFill] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger progressive fill for current step's connecting line
  useEffect(() => {
    setLineFill(false);
    const fillTimer = setTimeout(() => {
      setLineFill(true);
    }, 80);
    return () => clearTimeout(fillTimer);
  }, [activeStep]);

  // Pause progression when outside viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsInView(entry.isIntersecting);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sequential progression: Phase 01 -> Phase 02 -> ... -> Phase 06 -> loop
  useEffect(() => {
    if (!isInView || isInteracting) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isInView, isInteracting]);

  const handleStepSelect = (index: number) => {
    setActiveStep(index);
    setIsInteracting(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 4500);
  };

  const handleContainerMouseLeave = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 800);
  };

  return (
    <Section labelledBy="process-heading" className="bg-gradient-section">
      <div ref={sectionRef} className="relative">
        <SectionHeading
          id="process-heading"
          eyebrow="Our working process"
          title={
            <>
              A simple, proven <span className="text-gradient">way of working</span>
            </>
          }
          description="No confusion, no guesswork. Here’s how we take your brand from where it is today to where you want it to be."
        />

        {/* ---------------- DESKTOP 6-STEP HORIZONTAL ROW (IMAGE 1 SPEC) ---------------- */}
        <div
          className="hidden lg:block relative mt-16"
          onMouseLeave={handleContainerMouseLeave}
        >
          <div className="grid grid-cols-6 gap-6 relative">
            {PROCESS_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPast = idx < activeStep;
              const IconComponent = step.Icon;

              return (
                <div
                  key={step.phase}
                  onMouseEnter={() => handleStepSelect(idx)}
                  onClick={() => handleStepSelect(idx)}
                  className="group relative flex flex-col items-start text-left cursor-pointer transition-transform duration-300"
                >
                  {/* Connecting Line to next step (behind icons, steps 0..4) */}
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div
                      className="absolute left-[36px] top-[36px] -translate-y-1/2 w-[calc(100%+1.5rem)] h-[2.5px] pointer-events-none z-0"
                      aria-hidden="true"
                    >
                      {/* Inactive line track */}
                      <div className="w-full h-full bg-[#FFD4A3]/35 rounded-full" />
                      {/* Active progressive fill */}
                      <div
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF941E] via-[#FFB03A] to-[#FFD84A] rounded-full transition-all shadow-[0_0_10px_rgba(255,148,30,0.6)] ${
                          isPast
                            ? "w-full duration-300"
                            : isActive && lineFill
                            ? "w-full duration-[2400ms] ease-linear"
                            : "w-0 duration-300"
                        }`}
                      />
                    </div>
                  )}

                  {/* Icon Box with Badge */}
                  <div className="relative z-10 mb-6">
                    {/* Active Outer Glow */}
                    <div
                      className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] blur-sm transition-opacity duration-500 ${
                        isActive ? "opacity-75" : "opacity-0"
                      }`}
                    />

                    <div
                      className={`relative w-[72px] h-[72px] rounded-2xl flex items-center justify-center transition-all duration-300 select-none ${
                        isActive
                          ? "bg-gradient-to-br from-[#FF941E] via-[#FF8000] to-[#FFA726] text-white shadow-[0_0_24px_rgba(255,148,30,0.65),0_8px_16px_rgba(255,120,0,0.35)] scale-105 border-2 border-[#FFE082]"
                          : "bg-white text-slate-700 border-2 border-[#FFD4A3] shadow-md group-hover:border-[#FF941E] group-hover:shadow-lg"
                      }`}
                    >
                      <IconComponent
                        className={`w-7 h-7 transition-all duration-300 ${
                          isActive
                            ? "text-white stroke-[2.2] scale-110"
                            : "text-[#E65100] stroke-[1.8] group-hover:scale-105"
                        }`}
                      />

                      {/* Small circular numbered badge at top-right */}
                      <div
                        className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300 shadow-md ${
                          isActive
                            ? "bg-white text-[#E65100] border-2 border-[#FF941E] scale-110 shadow-orange-500/30"
                            : "bg-[#080F35] text-white border-2 border-white/60"
                        }`}
                      >
                        {step.num}
                      </div>
                    </div>
                  </div>

                  {/* Uppercase Phase Label */}
                  <span
                    className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                      isActive ? "text-[#FFB03A]" : "text-[#FF941E]"
                    }`}
                  >
                    {step.phase}
                  </span>

                  {/* Step Heading */}
                  <h3
                    className={`mt-1.5 text-lg font-bold leading-snug transition-all duration-300 ${
                      isActive
                        ? "text-[#FF941E] font-black"
                        : "text-white group-hover:text-[#FFD4A3]"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-2 text-xs xl:text-sm text-[#D5DAE7]/90 leading-relaxed font-normal">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- MOBILE & TABLET VERTICAL TIMELINE ---------------- */}
        <div className="lg:hidden relative mt-12 space-y-8 pl-3 sm:pl-6">
          {/* Continuous vertical connecting line behind icons */}
          <div
            className="absolute left-[31px] sm:left-[43px] top-7 bottom-7 w-[2.5px] -translate-x-1/2 pointer-events-none"
            aria-hidden="true"
          >
            {/* Base line track */}
            <div className="w-full h-full bg-[#FFD4A3]/35 rounded-full" />
            {/* Active vertical progress fill */}
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#FF941E] via-[#FFB03A] to-[#FFD84A] rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,148,30,0.7)]"
              style={{
                height: `${(activeStep / (PROCESS_STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {PROCESS_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            const IconComponent = step.Icon;

            return (
              <div
                key={step.phase}
                onClick={() => handleStepSelect(idx)}
                className="relative flex items-start gap-4 sm:gap-6 cursor-pointer group"
              >
                {/* Icon box */}
                <div className="relative shrink-0 z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 select-none ${
                      isActive
                        ? "bg-gradient-to-br from-[#FF941E] via-[#FF8000] to-[#FFA726] text-white shadow-[0_0_20px_rgba(255,148,30,0.6)] scale-105 border-2 border-[#FFE082]"
                        : "bg-white text-slate-700 border-2 border-[#FFD4A3] shadow-md"
                    }`}
                  >
                    <IconComponent
                      className={`w-6 h-6 transition-transform duration-300 ${
                        isActive ? "text-white stroke-[2.2]" : "text-[#E65100] stroke-[1.8]"
                      }`}
                    />
                    {/* Top-Right Badge */}
                    <div
                      className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 shadow ${
                        isActive
                          ? "bg-white text-[#E65100] border border-[#FF941E]"
                          : "bg-[#080F35] text-white border border-white/40"
                      }`}
                    >
                      {step.num}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-0.5 flex-1 text-left">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                      isActive ? "text-[#FFB03A]" : "text-[#FF941E]"
                    }`}
                  >
                    {step.phase}
                  </span>
                  <h3
                    className={`text-base sm:text-lg font-bold transition-colors duration-300 ${
                      isActive ? "text-[#FF941E] font-black" : "text-white"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#D5DAE7]/90 leading-relaxed font-normal">
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- Industries ---------------- */
function Industries() {
  const list = [
    { Icon: Utensils, name: "Restaurants & Cafés" },
    { Icon: Stethoscope, name: "Clinics & Healthcare" },
    { Icon: Building2, name: "Real Estate" },
    { Icon: GraduationCap, name: "Education & Coaching" },
    { Icon: ShoppingBag, name: "Retail & E-commerce" },
    { Icon: Hotel, name: "Hotels & Homestays" },
    { Icon: Dumbbell, name: "Fitness & Wellness" },
    { Icon: Gem, name: "Fashion & Jewellery" },
    { Icon: Factory, name: "Manufacturing & B2B" },
    { Icon: Car, name: "Automobile Dealers" },
    { Icon: Handshake, name: "Professional Services" },
    { Icon: Sparkles, name: "Salons & Beauty" },
  ];
  return (
    <Section labelledBy="industries-heading">
      <SectionHeading
        id="industries-heading"
        eyebrow="Industries we serve"
        title="Marketing that understands your industry"
        description="Every industry has its own customers, seasons and buying journey. We adapt our approach to fit yours."
      />
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.map(({ Icon, name }) => (
          <div
            key={name}
            className="reveal group flex items-center gap-4 rounded-2xl border border-border bg-surface/60 p-5 transition-all hover:-translate-y-1 hover:border-primary/40"
          >
            <Icon className="h-6 w-6 shrink-0 text-primary transition-transform group-hover:scale-110" />
            <span className="text-sm font-semibold">{name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Featured work ---------------- */
function FeaturedWork() {
  const work = [
    {
      img: socialImg,
      title: "Social Media Content & Reels",
      text: "Scroll-stopping creatives, reels and content calendars for Instagram and Facebook.",
      to: "/social-media-marketing" as const,
    },
    {
      img: brandingImg,
      title: "Brand Identity Design",
      text: "Logos, colour systems and brand guidelines that make businesses instantly recognisable.",
      to: "/branding-creative-strategy" as const,
    },
    {
      img: websiteImg,
      title: "Websites & Landing Pages",
      text: "Fast, mobile-first websites designed to turn visitors into enquiries.",
      to: "/website-app-development" as const,
    },
    {
      img: adsImg,
      title: "Performance Ad Campaigns",
      text: "Google and Meta campaigns structured around leads, calls and measurable outcomes.",
      to: "/google-ads-performance-marketing" as const,
    },
  ];
  return (
    <Section labelledBy="work-heading" className="bg-gradient-section">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading
          align="left"
          id="work-heading"
          eyebrow="Featured work"
          title="What we create for our clients"
          description="A look at the kind of work we deliver every day. Ask us on WhatsApp for samples relevant to your industry."
        />
        <Button asChild variant="glass" size="lg">
          <a href={SITE.socials.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram /> See our work on Instagram
          </a>
        </Button>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {work.map((w, i) => (
          <Link
            key={w.title}
            to={w.to}
            className={`reveal group relative overflow-hidden rounded-[2rem] border border-border ${i === 0 || i === 3 ? "md:aspect-[16/10]" : "md:aspect-[16/10]"}`}
          >
            <img
              src={w.img}
              alt={`${w.title} by Social Waale`}
              loading="lazy"
              width={1200}
              height={688}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <h3 className="text-xl font-bold">{w.title}</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">{w.text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Learn more <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Locations ---------------- */
function Locations() {
  const locs = [
    { name: "Chandigarh", desc: "Digital Marketing Agency in Chandigarh", primary: true },
    { name: "Himachal Pradesh", desc: "Social Media Marketing Services in Himachal Pradesh" },
    { name: "Punjab", desc: "Digital Marketing Company in Punjab" },
    { name: "Haryana", desc: "Digital Marketing Agency in Haryana" },
    { name: "Uttar Pradesh", desc: "Digital Marketing Services in Uttar Pradesh" },
    { name: "Delhi NCR", desc: "Social Media Marketing Services in Delhi NCR" },
  ];
  return (
    <Section labelledBy="locations-heading">
      <SectionHeading
        id="locations-heading"
        eyebrow="Service locations"
        title={
          <>
            Based in Chandigarh. <span className="text-gradient">Growing brands across India.</span>
          </>
        }
        description="We work with clients remotely across North India and beyond, with the same dedicated team and transparent reporting wherever you are."
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locs.map((l) => (
          <div
            key={l.name}
            className={`reveal card-premium card-hover flex items-center gap-4 p-6 ${l.primary ? "border-primary/40" : ""}`}
          >
            <IconBadge className={l.primary ? "bg-gradient-brand text-primary-foreground" : ""}>
              <MapPin className="h-5 w-5" />
            </IconBadge>
            <div>
              <h3 className="text-lg font-bold">
                {l.name}{" "}
                {l.primary && (
                  <span className="ml-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Home base
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">{l.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Plus businesses in other cities across India — wherever you are, we’re a call away.
      </p>
    </Section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials({ data }: { data?: CMSHomepageTestimonials | undefined }) {
  const activeReviews = (data?.items || []).filter((item) => item.enabled !== false);
  const hasReviews = activeReviews.length > 0;

  if (hasReviews) {
    return (
      <Section labelledBy="testimonials-heading" className="bg-gradient-section">
        <SectionHeading
          id="testimonials-heading"
          eyebrow={data?.eyebrowBadge || "Client Reviews"}
          title={data?.heading || "What our clients say about partnering with us"}
          description={data?.description || "Real feedback from brands that scale with Social Waale."}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeReviews.map((item) => (
            <div key={item.id} className="reveal card-premium p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#FFD84A] mb-3">
                  {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
                  "{item.text}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
                {item.avatarUrl ? (
                  <img src={item.avatarUrl} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xs flex items-center justify-center">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  {(item.designation || item.company) && (
                    <p className="text-xs text-slate-400">
                      {[item.designation, item.company].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section labelledBy="testimonials-heading" className="bg-gradient-section">
      <div className="reveal mx-auto max-w-4xl card-premium overflow-hidden p-8 text-center sm:p-14">
        <div
          className="absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />
        <MessageSquareQuote className="relative mx-auto h-12 w-12 text-primary" />
        <p className="eyebrow relative mt-6 justify-center">Client testimonials</p>
        <h2 id="testimonials-heading" className="relative mt-4 text-3xl font-extrabold sm:text-4xl">
          Real words from real clients — coming soon
        </h2>
        <p className="relative mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
          We’ve had the privilege of working with 50+ businesses, and we’re currently collecting
          verified feedback to share here. We’d rather show you genuine reviews than made-up quotes.
          In the meantime, follow our work on social media or ask us to connect you with a client in
          your industry.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="hero" size="lg">
            <a href={SITE.socials.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram /> Follow @socialwaale
            </a>
          </Button>
          <Button asChild variant="glass" size="lg">
            <Link to="/contact">Talk to us</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- SEO educational content ---------------- */
function SeoContent({ data }: { data?: CMSHomepageFaqs | undefined }) {
  return (
    <Section labelledBy="guide-heading">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              align="left"
              id="guide-heading"
              eyebrow="Learn"
              title="A practical guide to digital marketing for growing businesses"
            />
            <Button asChild variant="glass" size="lg" className="mt-8">
              <Link to="/articles">
                Read our articles <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
        <div className="prose-article lg:col-span-8">
          <h3>Why digital marketing matters for businesses in Chandigarh and North India</h3>
          <p>
            Customers in Chandigarh, Mohali, Ludhiana or Shimla now research almost every purchase
            online before they call, visit or buy. They check Instagram to see if a café feels
            right, search Google for “best dentist near me”, and compare websites before choosing a
            coaching institute. If your business isn’t visible and convincing in those moments, the
            enquiry goes to a competitor — even if your product is better.
          </p>
          <p>
            A good <Link to="/services">digital marketing agency in Chandigarh</Link> helps you show
            up in the right places, with the right message, for people who are already looking.
            That’s very different from simply “posting regularly” or “running some ads”.
          </p>
          <h3>Social media marketing: building familiarity and trust</h3>
          <p>
            Platforms like Instagram and Facebook are where people discover local brands and decide
            whether they trust them. Effective{" "}
            <Link to="/social-media-marketing">social media marketing</Link> combines a consistent
            content calendar, reels that show your product or service in action, and targeted paid
            campaigns that reach the right age group, location and interests. For businesses in
            Punjab, Haryana and Himachal Pradesh, local language, festivals and seasonal moments
            make content far more relatable.
          </p>
          <h3>SEO and Google Ads: capturing people who are ready to act</h3>
          <p>
            When someone searches for a service, they’re usually close to making a decision.{" "}
            <Link to="/seo-services">SEO services</Link> improve your website and Google Business
            Profile so you appear in organic and map results over time, while{" "}
            <Link to="/google-ads-performance-marketing">Google Ads</Link> can put you at the top of
            results almost immediately. Most growing businesses benefit from a mix — ads for quick
            enquiries, SEO for long-term, lower-cost visibility.
          </p>
          <h3>Your website: where interest becomes an enquiry</h3>
          <p>
            Every channel eventually points to your website or WhatsApp. A slow, confusing or
            outdated site wastes the attention you’ve paid for. A fast, mobile-friendly website with
            clear calls to action, built by a team that understands{" "}
            <Link to="/ui-ux-cro-optimization">conversion optimisation</Link>, turns more visitors
            into customers.
          </p>
          <h3>Branding and content: the foundation of everything</h3>
          <p>
            Strong <Link to="/branding-creative-strategy">branding</Link> makes every post, ad and
            page more effective because people recognise and remember you. Helpful{" "}
            <Link to="/content-marketing-email-automation">content and email marketing</Link> keeps
            you in front of past enquiries and customers, so they come back when they’re ready.
          </p>
          <h3>Choosing the right partner</h3>
          <p>
            Look for an agency that asks about your business before talking about tools, explains
            pricing clearly, keeps ad accounts in your name and reports on outcomes you care about.
            That’s exactly how we work at Social Waale. If you’d like a second opinion on your
            current marketing, <Link to="/contact">get in touch</Link> for a free consultation.
          </p>

          {data?.items && data.items.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-700/60 not-prose">
              <h3 className="text-2xl font-bold text-white mb-6">
                {data.heading || "Frequently Asked Questions"}
              </h3>
              <FAQList faqs={data.items.filter((item) => item.enabled !== false).map((faq) => ({ q: faq.q, a: faq.a }))} />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
