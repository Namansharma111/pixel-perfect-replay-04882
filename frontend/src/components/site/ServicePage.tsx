import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  MessageCircle,
  Phone,
  Mail,
  AlertTriangle,
  Sparkles,
  Users,
  ShieldCheck,
  TrendingUp,
  Layers,
  Clock,
  Target,
  ChevronRight,
  Star,
  Compass,
  FileText,
  Check,
  Zap,
  BarChart3,
  Globe,
  Building2,
  Briefcase,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs, Container } from "./primitives";
import { PageWrapper } from "./PageWrapper";
import { ServiceCard, ArticleCard } from "./cards";
import { FAQList } from "./FAQ";
import { ContactForm } from "./ContactForm";
import { SERVICE_ICONS } from "./service-icons";
import { getService } from "@/data/services";
import { articles } from "@/data/articles";
import type { ServiceSlug } from "@/data/types";
import { SERVICE_OPTIONS } from "@/lib/form-schemas";
import { SITE, absoluteUrl } from "@/config/site";
import { pageHead, faqSchema, organizationRef } from "@/lib/seo";
import { getCmsServiceBySlug } from "@/lib/cms/cms-storage";

// Contextual Visual Banners for Services
import seoBanner from "@/assets/blog-seo.jpg";
import adsBanner from "@/assets/blog-ads.jpg";
import socialBanner from "@/assets/blog-social.jpg";
import contentBanner from "@/assets/blog-content.jpg";
import brandingBanner from "@/assets/blog-branding.jpg";
import websiteBanner from "@/assets/blog-website.jpg";
import digitalBanner from "@/assets/blog-digital.jpg";
import offlineBanner from "@/assets/about-studio.jpg";
import prBanner from "@/assets/careers-team.jpg";
import mediaBanner from "@/assets/hero-growth.jpg";

export const SERVICE_BANNER_IMAGES: Record<ServiceSlug, string> = {
  "seo-services": seoBanner,
  "google-ads-performance-marketing": adsBanner,
  "social-media-marketing": socialBanner,
  "content-marketing-email-automation": contentBanner,
  "branding-creative-strategy": brandingBanner,
  "website-app-development": websiteBanner,
  "ui-ux-cro-optimization": digitalBanner,
  "offline-local-advertising": offlineBanner,
  "public-relations": prBanner,
  "photoshoot-creative-media": mediaBanner,
};

/** head() output for a service page: meta, canonical, Service + FAQ + breadcrumb schema. */
export function serviceHead(slug: ServiceSlug) {
  const baseService = getService(slug);
  let cmsService: any = null;
  try {
    cmsService = getCmsServiceBySlug(slug);
  } catch {}
  const s = cmsService
    ? {
        ...baseService,
        ...cmsService,
        metaTitle: cmsService.seo?.metaTitle || cmsService.metaTitle || baseService.metaTitle,
        metaDescription: cmsService.seo?.metaDescription || cmsService.metaDescription || baseService.metaDescription,
        faqs: cmsService.faqs?.length ? cmsService.faqs : baseService.faqs,
      }
    : baseService;

  return pageHead({
    title: s.metaTitle,
    description: s.metaDescription,
    path: `/${s.slug}`,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: s.name, path: `/${s.slug}` },
    ],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: s.name,
        serviceType: s.name,
        description: s.metaDescription,
        url: absoluteUrl(`/${s.slug}`),
        provider: organizationRef,
        areaServed: [...SITE.locations, "India"].map((name) => ({ "@type": "Place", name })),
      },
      faqSchema(s.faqs),
    ],
  });
}

function toServiceOption(name: string) {
  return (SERVICE_OPTIONS as readonly string[]).includes(name)
    ? (name as (typeof SERVICE_OPTIONS)[number])
    : undefined;
}

export function ServicePage({ slug }: { slug: ServiceSlug }) {
  const baseService = getService(slug);
  let cmsService: any = null;
  try {
    cmsService = getCmsServiceBySlug(slug);
  } catch {}

  const s = cmsService
    ? {
        ...baseService,
        ...cmsService,
        heroEyebrow: cmsService.heroEyebrow || baseService.heroEyebrow,
        h1: cmsService.h1 || baseService.h1,
        heroIntro: cmsService.heroIntro || baseService.heroIntro,
        deliverables: cmsService.deliverables?.length ? cmsService.deliverables : baseService.deliverables,
        problems: cmsService.problems?.length ? cmsService.problems : baseService.problems,
        benefits: cmsService.benefits?.length ? cmsService.benefits : baseService.benefits,
        faqs: cmsService.faqs?.length ? cmsService.faqs : baseService.faqs,
      }
    : baseService;

  let Icon = SERVICE_ICONS[s.slug as keyof typeof SERVICE_ICONS];
  if (!Icon && cmsService?.icon) {
    Icon = (LucideIcons as any)[cmsService.icon];
  }
  if (!Icon) Icon = Briefcase;

  const related = baseService.related.map(getService);
  const relatedArticles = articles.filter((a) => a.relatedServices.includes(s.slug)).slice(0, 3);
  const defaultService = toServiceOption(s.name);
  const bannerImage = SERVICE_BANNER_IMAGES[slug] || seoBanner;

  return (
    <PageWrapper>
      {/* ==================================================================== */}
      {/* SECTION 1: MODERN HERO SECTION                                       */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] text-white pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" aria-hidden />
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#FF941E]/10 blur-[120px] pointer-events-none" />

        <Container className="relative">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: s.name, path: `/${s.slug}` },
              ]}
            />
          </div>

          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Highlight Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#FFD84A] border border-white/15 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF941E] animate-pulse" />
                {s.heroEyebrow}
              </div>

              {/* H1 Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.12] text-white tracking-tight">
                {s.h1}
              </h1>

              {/* Compelling Introduction */}
              <p className="text-base sm:text-lg text-[#D5DAE7]/90 leading-relaxed max-w-2xl">
                {s.heroIntro}
              </p>

              {/* Conversion CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="xl"
                  className="rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:opacity-95 transition-all"
                >
                  <a href="#enquiry" className="inline-flex items-center gap-2">
                    Get a Free Consultation <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="whatsapp"
                  size="xl"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md"
                >
                  <a
                    href={SITE.whatsappMessage(`Hi Social Waale, I would like to consult on ${s.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  variant="glass"
                  size="xl"
                  className="rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-xs sm:text-sm"
                >
                  <a href={SITE.phoneHref} className="inline-flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#FFD84A]" /> {SITE.phone}
                  </a>
                </Button>
              </div>

              {/* Trust Metric Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-slate-300 font-medium">North India Regional Focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FFD84A] shrink-0" />
                  <span className="text-slate-300 font-medium">100% Attribution Transparency</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF941E] shrink-0" />
                  <span className="text-slate-300 font-medium">Zero Vendor Lock-In</span>
                </div>
              </div>
            </div>

            {/* Right Visual Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-3 shadow-2xl group">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                  <img
                    src={bannerImage}
                    alt={`${s.name} preview`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080F35] via-transparent to-transparent opacity-80" />
                </div>

                {/* Floating Service Highlights Card */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] flex items-center justify-center text-[#080F35] font-black shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD84A]">
                          GROWTH SERVICE SCOPE
                        </span>
                        <h4 className="text-base font-bold text-white leading-tight">{s.name}</h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#D5DAE7]/90 leading-relaxed border-t border-white/10 pt-3">
                    {s.tagline}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-300">
                    {s.deliverables.slice(0, 4).map((d: any) => (
                      <div key={d.title} className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{d.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2: INTRODUCTION & COMMERCIAL CONTEXT                         */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-24 bg-[#F7F8FC] border-b border-slate-200/80">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Narrative Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
                  COMMERCIAL STRATEGY & APPROACH
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080F35] leading-tight">
                  {s.intro.heading}
                </h2>
              </div>

              {/* Styled Lead Paragraph */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#FF941E] shadow-sm">
                <p className="text-base sm:text-lg font-medium text-[#080F35] leading-relaxed">
                  {s.intro.paragraphs[0]}
                </p>
              </div>

              {/* Subsequent Paragraphs */}
              {s.intro.paragraphs.slice(1).map((para: string, idx: number) => (
                <p key={idx} className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  {para}
                </p>
              ))}

              {/* Execution Pillars */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <Target className="w-5 h-5 text-[#FF941E] mb-2" />
                  <p className="text-xs font-bold text-[#080F35]">Intent Driven</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">High-intent searches</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-xs font-bold text-[#080F35]">Accurate Data</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Zero vanity metrics</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <Globe className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-xs font-bold text-[#080F35]">Local Authority</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">North India corridors</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <Zap className="w-5 h-5 text-[#FFD84A] mb-2" />
                  <p className="text-xs font-bold text-[#080F35]">ROI Compounding</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Sustainable pipeline</p>
                </div>
              </div>
            </div>

            {/* Right Service Blueprint Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 rounded-3xl bg-white p-7 border border-slate-200 shadow-md space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF941E]">
                    SERVICE SPECIFICATIONS
                  </span>
                  <h3 className="text-xl font-bold text-[#080F35] mt-1">{s.name} Blueprint</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="pb-3 border-b border-slate-100">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                      Core Regional Hub
                    </span>
                    <span className="text-[#080F35] font-bold text-sm">
                      Chandigarh HQ (serving North India)
                    </span>
                  </div>

                  <div className="pb-3 border-b border-slate-100">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                      Target Market Footprint
                    </span>
                    <span className="text-slate-700 font-medium">
                      Chandigarh, Mohali, Panchkula, Punjab, Himachal Pradesh, Haryana, UP & Delhi NCR
                    </span>
                  </div>

                  <div className="pb-3 border-b border-slate-100">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                      Strategic Model
                    </span>
                    <span className="text-slate-700 font-medium">
                      Direct Senior Strategist Assignment • Custom Weekly Reporting
                    </span>
                  </div>

                  <div className="pb-3 border-b border-slate-100">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                      Ownership & IP
                    </span>
                    <span className="text-emerald-700 font-bold">
                      100% Client Ownership of Accounts, Data & Creative Assets
                    </span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full rounded-xl bg-[#080F35] hover:bg-[#0E1B5A] text-white font-bold text-xs uppercase tracking-wider py-2.5 shadow-sm"
                >
                  <a href="#enquiry" className="inline-flex items-center justify-center gap-2">
                    Request Growth Assessment <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 3: KEY FEATURES / WHAT WE OFFER (DELIVERABLES)               */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
              COMPREHENSIVE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080F35] tracking-tight">
              What Our {s.shortName} Service Delivers
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Every deliverable is documented, actionable, and tied directly to commercial outcomes for your business.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {s.deliverables.map((d: any, idx: number) => (
              <div
                key={d.title}
                className="group relative rounded-2xl p-6 bg-[#F7F8FC] border border-slate-200/80 hover:border-[#FF941E]/50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 group-hover:text-[#FF941E] transition-colors">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:bg-[#FF941E] group-hover:text-white flex items-center justify-center text-slate-600 transition-colors shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#080F35] group-hover:text-[#0E1B5A] mb-2 leading-snug">
                    {d.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {d.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-[#FF941E] transition-colors">
                  <span>Included in scope</span>
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 4: WHY CHOOSE US (GENUINE ADVANTAGES)                         */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-28 bg-[#080F35] text-white relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" aria-hidden />
        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFD84A]">
              THE SOCIAL WAALE ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why North Indian Brands Partner With Us for {s.shortName}
            </h2>
            <p className="text-base text-[#D5DAE7]/80 leading-relaxed">
              We replace agency jargon with transparent workflows, realistic roadmaps, and measurable customer conversions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {s.whyUs.map((w: any, idx: number) => (
              <div
                key={w.title}
                className="rounded-2xl p-6 bg-[#0E1B5A]/80 border border-white/10 hover:border-[#FFD84A]/40 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-[#FFD84A] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    {idx === 0 ? <Building2 className="w-5 h-5" /> : idx === 1 ? <Target className="w-5 h-5" /> : idx === 2 ? <ShieldCheck className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">{w.title}</h3>
                  <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">{w.description}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 text-[11px] font-bold text-[#FFD84A] flex items-center gap-1">
                  <span>Guaranteed Standard</span> <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 5: OUR PROCESS / HOW IT WORKS (NUMBERED ROADMAP)              */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-28 bg-[#F7F8FC] border-b border-slate-200/80">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
              PROVEN DELIVERY LIFECYCLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080F35] tracking-tight">
              Our Structured {s.process.length}-Stage {s.shortName} Process
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Every phase has defined milestones, client review checkpoints, and measurable progress tracking.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative">
            {s.process.map((p: any, idx: number) => (
              <div
                key={p.title}
                className="relative rounded-2xl bg-white p-7 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-sm flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      PHASE {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#080F35] mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Milestones Verified
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 6: BENEFITS & WHO CAN BENEFIT (TARGET AUDIENCE & IMPACT)      */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Left Box: Who Can Benefit */}
            <div className="lg:col-span-6 rounded-3xl p-8 bg-[#F7F8FC] border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
                  TARGET SECTORS & PROFILE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080F35] mt-1">
                  {s.whoNeeds.heading}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  This service is tailored for ambitious businesses that require predictable, measurable growth.
                </p>
              </div>

              <div className="space-y-3">
                {s.whoNeeds.items.map((item: any) => (
                  <div key={item} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#080F35] text-[#FFD84A] flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-[#080F35] leading-snug">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Box: Commercial Benefits & Problems Solved */}
            <div className="lg:col-span-6 rounded-3xl p-8 bg-[#080F35] text-white border border-white/10 shadow-lg space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FFD84A]">
                  TANGIBLE COMMERCIAL OUTCOMES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  What Your Business Gains
                </h2>
                <p className="text-xs sm:text-sm text-[#D5DAE7]/80 mt-2">
                  Clear returns on your investment across audience reach, lead volume, and customer conversion.
                </p>
              </div>

              <div className="space-y-3">
                {s.benefits.slice(0, 5).map((b: any) => (
                  <div key={b.title} className="p-4 rounded-xl bg-[#0E1B5A] border border-white/10 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{b.title}</h4>
                      <p className="text-xs text-[#D5DAE7]/80 mt-0.5 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 7: RELATED SERVICES & CROSS-CHANNEL SYNERGY                  */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-28 bg-[#F7F8FC] border-b border-slate-200/80">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
              CROSS-CHANNEL ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080F35] tracking-tight">
              Services That Work Well Together
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Digital growth accelerates when search, paid campaigns, high-speed web experiences, and brand creative work in unison.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <ServiceCard key={r.slug} service={r} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-300 text-xs font-bold text-[#080F35] hover:bg-[#080F35] hover:text-white transition-all shadow-sm"
            >
              Explore All 10 Digital Marketing Services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 8: RELATED ARTICLES & KNOWLEDGE RESOURCES                     */}
      {/* ==================================================================== */}
      {relatedArticles.length > 0 && (
        <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
          <Container>
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
                PRACTICAL KNOWLEDGE & RESEARCH
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080F35] tracking-tight">
                Recommended Insights for {s.shortName}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Read our in-depth playbooks and guides on how we structure and optimize campaigns.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ==================================================================== */}
      {/* SECTION 9: FREQUENTLY ASKED QUESTIONS (FAQ)                          */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-28 bg-[#F7F8FC] border-b border-slate-200/80" aria-labelledby="service-faq">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-4 sticky top-28 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
                  TRANSPARENT ANSWERS
                </span>
                <h2 id="service-faq" className="text-2xl sm:text-3xl font-extrabold text-[#080F35] mt-1 leading-tight">
                  {s.shortName} Questions, Answered
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Straightforward answers about scopes, timelines, commercial expectations, and working with Social Waale.
              </p>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <p className="text-xs font-bold text-[#080F35]">Have a specific project question?</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Call our Chandigarh team directly for immediate advice on your requirements.
                </p>
                <div className="pt-1">
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#FF941E] hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call +91 9805789363
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm">
                <FAQList faqs={s.faqs} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 10: FINAL CONVERSION CTA & CONSULTATION ENQUIRY FORM         */}
      {/* ==================================================================== */}
      <section id="enquiry" className="relative scroll-mt-20 py-20 lg:py-28 bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] text-white">
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" aria-hidden />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Value Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#FFD84A] border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-[#FF941E]" /> STRATEGY SESSION
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Ready to Grow With {s.name}?
              </h2>

              <p className="text-sm sm:text-base text-[#D5DAE7]/90 leading-relaxed">
                Connect with our senior digital growth team in Chandigarh. We’ll analyze your current market presence, review your competitor landscape, and provide actionable recommendations.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10 text-xs sm:text-sm">
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-3 text-slate-300 hover:text-[#FFD84A] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#FFD84A]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>{SITE.phone} (Direct Consultation)</span>
                </a>
                <a
                  href={SITE.emailHref}
                  className="flex items-center gap-3 text-slate-300 hover:text-[#FFD84A] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#FFD84A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>{SITE.email}</span>
                </a>
                <a
                  href={SITE.whatsappMessage(`Hi Social Waale, I would like to consult on ${s.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span>Instant WhatsApp Chat Available</span>
                </a>
              </div>
            </div>

            {/* Right Contact Form Card */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-[#0B1437]/90 backdrop-blur-xl border border-white/15 p-6 sm:p-10 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Book a Free Strategy Consultation</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Fill in your project details below and we’ll respond within 24 business hours.
                  </p>
                </div>
                <ContactForm
                  defaultService={defaultService}
                  formName={`Service Inquiry Form — ${s.name}`}
                  formType="service_inquiry"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}
