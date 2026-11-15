import React from "react";
import { Link } from "@tanstack/react-router";
import type { CMSDownloaderPage } from "@/lib/cms/types";
import { DownloaderHero } from "./DownloaderHero";
import { DownloaderHowTo } from "./DownloaderHowTo";
import { DownloaderFeatures } from "./DownloaderFeatures";
import { DownloaderDeviceGuide } from "./DownloaderDeviceGuide";
import { DownloaderFaq } from "./DownloaderFaq";
import { DownloaderRelatedTools } from "./DownloaderRelatedTools";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Film,
  Zap,
  Smartphone,
  Infinity as InfinityIcon,
  HelpCircle,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";

interface DownloaderPageLayoutProps {
  page: CMSDownloaderPage;
  isPreview?: boolean;
}

const BENEFIT_ICONS: Record<string, any> = {
  Film,
  Sparkles,
  Zap,
  Infinity: InfinityIcon,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
};

export function DownloaderPageLayout({ page, isPreview }: DownloaderPageLayoutProps) {
  // Only display and schema-index enabled FAQs
  const activeFaqs = (page.faqs || []).filter((f) => f.enabled !== false);

  // Generate WebApplication and Breadcrumb structured data
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: page.name,
    url: page.canonicalUrl || `https://socialwaale.com/${page.slug}`,
    description: page.metaDescription,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://socialwaale.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://socialwaale.com/instagram-downloader",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.name,
        item: page.canonicalUrl || `https://socialwaale.com/${page.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#080F35] text-white">
      {/* Draft Preview Bar */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
          <Info className="w-4 h-4" />
          <span>Viewing Unpublished Draft Preview — Changes are not yet live to visitors</span>
        </div>
      )}

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero & Input Section */}
      <DownloaderHero
        currentSlug={page.slug}
        toolType={page.toolType}
        h1={page.h1}
        subtitle={page.subtitle}
        inputPlaceholder={page.inputPlaceholder}
        downloadButtonText={page.downloadButtonText}
        heroImage={page.heroImage}
        heroImageAlt={page.heroImageAlt}
      />

      {/* Long-form SEO Intro & Copy */}
      {page.introHtml && (
        <section className="py-12 md:py-16 relative">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm">
              <div
                className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 [&>p]:leading-relaxed [&>h2]:text-white [&>h2]:font-bold [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h3]:text-[#FFD84A] [&>h3]:font-bold [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 [&>strong]:text-white"
                dangerouslySetInnerHTML={{ __html: page.introHtml }}
              />
            </div>
          </div>
        </section>
      )}

      {/* How It Works (3 Steps) */}
      <DownloaderHowTo steps={page.howToSteps} toolName={page.name} />

      {/* Features Grid */}
      <DownloaderFeatures features={page.features} toolName={page.name} />

      {/* Why Choose Us Section */}
      {page.whyChooseBenefits && page.whyChooseBenefits.length > 0 && (
        <section className="py-16 md:py-20 bg-[#0B1437]/60 border-t border-white/10 relative">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FFD84A] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Advantages & Quality</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                {page.whyChooseHeading || `Why Choose Our ${page.name}?`}
              </h2>
              {page.whyChooseDescription && (
                <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                  {page.whyChooseDescription}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.whyChooseBenefits.map((benefit, idx) => {
                const Icon = (benefit.icon && BENEFIT_ICONS[benefit.icon]) || CheckCircle2;
                return (
                  <div
                    key={benefit.title || idx}
                    className="p-6 rounded-3xl bg-[#0E1B5A]/50 border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-[#FFD84A] flex items-center justify-center mb-4 group-hover:bg-gradient-to-tr group-hover:from-[#FF941E] group-hover:to-[#FFD84A] group-hover:text-[#080F35] transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#FFD84A] transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Supported Formats & Usage Guidelines */}
      {(page.supportedContentTypes || page.limitationsNotice) && (
        <section className="py-14 bg-black/20 border-t border-white/5">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {page.supportedContentTypes && page.supportedContentTypes.length > 0 && (
              <div className="p-7 rounded-3xl bg-white/[0.02] border border-white/10">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#FFD84A]" /> Supported Formats & Content
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {page.supportedContentTypes.map((fmt, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{fmt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {page.limitationsNotice && (
              <div className="p-7 rounded-3xl bg-white/[0.02] border border-white/10">
                <h3 className="text-base font-bold text-amber-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Platform Security & Limits
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {page.limitationsNotice}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Multi-Device Guide */}
      <DownloaderDeviceGuide />

      {/* Frequently Asked Questions */}
      <DownloaderFaq faqs={activeFaqs} toolName={page.name} />

      {/* Internal Linking Management Section */}
      {page.internalLinks && page.internalLinks.length > 0 && (
        <section className="py-14 bg-[#0B1437]/50 border-t border-white/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-black text-white mb-6 text-center">
              Helpful Resources & Related Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {page.internalLinks.map((link) => (
                <Link
                  key={link.id || link.url}
                  to={link.url as any}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD84A]">
                      {link.category || "Related"}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1 group-hover:text-[#FFD84A] transition-colors">
                      {link.label}
                    </h4>
                    {link.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {link.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 text-xs font-semibold text-amber-300 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Visit page</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cross-linking to Other Tools */}
      <DownloaderRelatedTools currentSlug={page.slug} />

      {/* Agency Marketing Banner (Customizable from CRM) */}
      <section className="py-16 relative overflow-hidden bg-gradient-to-b from-[#0B1437] to-[#080F35]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-[#0E1B5A] to-[#142370] border border-white/15 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#FFD84A] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grow Your Brand Organically</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight max-w-2xl mx-auto">
              {page.ctaHeading || "Want Viral Instagram Growth & High-ROI Marketing?"}
            </h2>

            <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {page.ctaSubtext ||
                "Social Waale is Chandigarh’s leading growth and digital marketing agency. We engineer viral content, manage multi-channel ad campaigns, and drive measurable revenue."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={(page.ctaButtonUrl || "/contact") as any}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-sm sm:text-base hover:opacity-95 transition shadow-lg shadow-orange-500/20 inline-flex items-center gap-2"
              >
                <span>{page.ctaButtonText || "Get a Free Strategy Audit"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-sm sm:text-base font-bold transition border border-white/15"
              >
                Explore Agency Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
