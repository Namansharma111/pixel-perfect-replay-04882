import { useState } from "react";
import { ArrowUpRight, Globe, Instagram, LayoutGrid, Sparkles } from "lucide-react";
import { Container, SectionHeading } from "@/components/site/primitives";

/* ---------------- Website Projects Data ---------------- */
export interface WebsiteProject {
  id: string;
  name: string;
  url: string;
  category: string;
  tags: string[];
  image: string;
  alt: string;
  description: string;
}

const WEBSITE_PROJECTS: WebsiteProject[] = [
  {
    id: "desi-tokri",
    name: "Desi Tokri",
    url: "https://www.deshitokri.com/",
    category: "E-commerce | Food & Snacks",
    tags: ["E-Commerce", "Food & Snacks", "Shopify/Web"],
    image: "/images/portfolio/websites/desi-tokri.png",
    alt: "Desi Tokri official website homepage designed by Social Waale",
    description: "Traditional snacks and authentic regional culinary treats online store with custom product showcase and seamless checkout.",
  },
  {
    id: "ked",
    name: "KED – Kaereste Event & Decor",
    url: "https://ked.co.in/",
    category: "E-commerce | Events & Decoration",
    tags: ["E-Commerce", "Event Decor", "Luxury Styling"],
    image: "/images/portfolio/websites/ked.png",
    alt: "KED Kaereste Event & Decor website homepage designed by Social Waale",
    description: "Boutique event design, premium decor rentals and celebration management platform with curated portfolio gallery.",
  },
  {
    id: "dreamy-design",
    name: "Dreamy Design",
    url: "https://dreamydesign.co.in/",
    category: "E-commerce | Gifts & Lifestyle",
    tags: ["E-Commerce", "Gifts & Lifestyle", "Custom Merch"],
    image: "/images/portfolio/websites/dreamy-design.png",
    alt: "Dreamy Design lifestyle and gift brand website designed by Social Waale",
    description: "Personalized gifting, aesthetic stationery and modern lifestyle products online shopping experience.",
  },
  {
    id: "noor-zaar",
    name: "Noor Zaar",
    url: "https://noorzaar.in/",
    category: "Fashion | Luxury Clothing",
    tags: ["Fashion", "Luxury Apparel", "High-End Couture"],
    image: "/images/portfolio/websites/noor-zaar.png",
    alt: "Noor Zaar luxury fashion clothing online store designed by Social Waale",
    description: "High-end bespoke ethnic wear and modern couture fashion storefront designed for high visual conversions.",
  },
  {
    id: "lets-go-trippin",
    name: "Let's Go Trippin",
    url: "https://letsgotrippin.in/",
    category: "Travel | Tourism & Adventures",
    tags: ["Travel & Tourism", "Adventure Tours", "Booking Engine"],
    image: "/images/portfolio/websites/lets-go-trippin.png",
    alt: "Let's Go Trippin travel and tourism portal designed by Social Waale",
    description: "Experiential travel itineraries, adventure packages and curated mountain expeditions across North India.",
  },
  {
    id: "karyarth",
    name: "Karyarth",
    url: "https://www.karyarth.com/",
    category: "Recruitment | Technology",
    tags: ["Recruitment", "Tech Talent", "HR Solutions"],
    image: "/images/portfolio/websites/karyarth.png",
    alt: "Karyarth recruitment and technology talent platform designed by Social Waale",
    description: "Enterprise tech recruitment, staffing solutions and career enablement portal connecting top Indian talent.",
  },
];

/* ---------------- Social Media Accounts Data ---------------- */
export interface SocialProfile {
  id: string;
  name: string;
  handle: string;
  url: string;
  avatar: string;
  role: string;
  services: string[];
  description: string;
}

const SOCIAL_PROFILES: SocialProfile[] = [
  {
    id: "lets-go-trippin",
    name: "Let's Go Trippin",
    handle: "@letsgotrippin1",
    url: "https://www.instagram.com/letsgotrippin1/?hl=en",
    avatar: "/images/portfolio/social/letsgotrippin.jpg",
    role: "Social Media Management",
    services: ["Meta Ads", "Content Strategy", "Reels Production"],
    description: "Travel community building, cinematic mountain reels, adventure tour campaigns, and high-engagement social storytelling.",
  },
  {
    id: "sanjay-rattan",
    name: "Sanjay Rattan",
    handle: "@sanjay_rattan",
    url: "https://www.instagram.com/sanjay_rattan/?hl=en",
    avatar: "/images/portfolio/social/sanjay_rattan.jpg",
    role: "Social Media Management",
    services: ["Public Outreach", "Meta Ads", "Content Strategy"],
    description: "Public figure digital communication, constituency outreach updates, event media coverage and organic community engagement.",
  },
  {
    id: "bjp-himachal",
    name: "BJP Himachal Pradesh",
    handle: "@bjp4himachal",
    url: "https://www.instagram.com/bjp4himachal/?hl=en",
    avatar: "/images/portfolio/social/bjp4himachal.jpg",
    role: "Social Media Management",
    services: ["Meta Ads", "Public Communication", "Event Broadcasts"],
    description: "Statewide public messaging, leadership press updates, regional digital campaigns, and community engagement.",
  },
  {
    id: "bjp-haryana",
    name: "BJP Haryana",
    handle: "@bjp4haryana",
    url: "https://www.instagram.com/bjp4haryana/?hl=en",
    avatar: "/images/portfolio/social/bjp4haryana.jpg",
    role: "Social Media Management",
    services: ["State Outreach", "Meta Ads", "Content Creation"],
    description: "State political outreach, public initiatives amplification, ground event creative coverage, and voter communications.",
  },
  {
    id: "we-pahadi",
    name: "We Pahadi",
    handle: "@we._.pahadi",
    url: "https://www.instagram.com/we._.pahadi/?hl=en",
    avatar: "/images/portfolio/social/we_pahadi.jpg",
    role: "Social Media Management",
    services: ["Audience Growth", "Cultural Content", "Viral Reels"],
    description: "Himalayan culture and lifestyle media brand with viral reels, heritage storytelling, and engaged community scaling.",
  },
  {
    id: "pkke-pahadi",
    name: "PKKE Pahadi",
    handle: "@pkke_pahadi",
    url: "https://www.instagram.com/pkke_pahadi/",
    avatar: "/images/portfolio/social/pkke_pahadi.jpg",
    role: "Social Media Management",
    services: ["Content Strategy", "Creator Marketing", "Community"],
    description: "Regional youth culture hub producing engaging short-form video content, folk appreciation and North Indian creative media.",
  },
  {
    id: "himalayan-routes-music",
    name: "Himalayan Routes Music",
    handle: "@himalayanroutesmusic",
    url: "https://www.instagram.com/himalayanroutesmusic/?hl=en",
    avatar: "/images/portfolio/social/himalayanroutesmusic.jpg",
    role: "Social Media Management",
    services: ["YouTube Marketing", "Meta Ads", "Music Distribution"],
    description: "Independent record label marketing, multi-platform song releases, YouTube SEO and artist promotion campaigns.",
  },
  {
    id: "khwaab-lushal",
    name: "Khwaab Lushal",
    handle: "@khwaab__lushal",
    url: "https://www.instagram.com/khwaab__lushal/",
    avatar: "/images/portfolio/social/khwaab__lushal.jpg",
    role: "Social Media Management",
    services: ["Branding", "Content Strategy", "Digital Growth"],
    description: "Creative fashion and creative identity portfolio with curated visuals, aesthetic feed direction, and growth campaigns.",
  },
];

/* ---------------- Portfolio Section Component ---------------- */
export function PortfolioSection() {
  const [activeTab, setActiveTab] = useState<"social" | "websites">("social");

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="relative py-16 lg:py-24 bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] border-t border-b border-white/5 overflow-hidden"
    >
      {/* Background Ambient Lighting Accents */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[#3B82F6]/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-[#FF941E]/10 blur-[140px]"
        aria-hidden="true"
      />

      <Container>
        {/* Section Heading (Shortened, Clean & Premium) */}
        <SectionHeading
          id="portfolio-heading"
          eyebrow="OUR PORTFOLIO"
          title={
            <>
              Our Projects. <span className="text-gradient">Our Clients.</span>
            </>
          }
        />

        {/* Tab Navigation Controls (Social First, Websites Second) */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Portfolio Categories"
            className="inline-flex items-center gap-1.5 rounded-full p-1.5 bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-xl"
          >
            {/* Tab 1: Social Media & Digital Marketing */}
            <button
              role="tab"
              id="tab-social"
              aria-selected={activeTab === "social"}
              aria-controls="panel-social"
              tabIndex={activeTab === "social" ? 0 : -1}
              onClick={() => setActiveTab("social")}
              className={`flex items-center gap-2.5 rounded-full px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === "social"
                  ? "bg-gradient-to-r from-[#FF941E] via-[#FF850A] to-[#FFB03A] text-white shadow-[0_0_20px_rgba(255,148,30,0.5)] scale-[1.02]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Instagram className="h-4 w-4" />
              <span>SOCIAL MEDIA & DIGITAL MARKETING</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                  activeTab === "social"
                    ? "bg-black/25 text-white"
                    : "bg-white/10 text-white/80"
                }`}
              >
                8
              </span>
            </button>

            {/* Tab 2: Website Projects */}
            <button
              role="tab"
              id="tab-websites"
              aria-selected={activeTab === "websites"}
              aria-controls="panel-websites"
              tabIndex={activeTab === "websites" ? 0 : -1}
              onClick={() => setActiveTab("websites")}
              className={`flex items-center gap-2.5 rounded-full px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === "websites"
                  ? "bg-gradient-to-r from-[#FF941E] via-[#FF850A] to-[#FFB03A] text-white shadow-[0_0_20px_rgba(255,148,30,0.5)] scale-[1.02]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>WEBSITE PROJECTS</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                  activeTab === "websites"
                    ? "bg-black/25 text-white"
                    : "bg-white/10 text-white/80"
                }`}
              >
                6
              </span>
            </button>
          </div>
        </div>

        {/* ---------------- TAB 1: SOCIAL MEDIA & DIGITAL MARKETING (4-Column Grid) ---------------- */}
        {activeTab === "social" && (
          <div
            role="tabpanel"
            id="panel-social"
            aria-labelledby="tab-social"
            className="mt-10 sm:mt-12 transition-opacity duration-300"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SOCIAL_PROFILES.map((profile) => (
                <article
                  key={profile.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF941E]/60 hover:shadow-[0_16px_36px_rgba(255,148,30,0.18)]"
                >
                  <div>
                    {/* Header: Profile Avatar & Account Name */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-[#FF941E] transition-colors shadow-md bg-[#080F35]">
                          <img
                            src={profile.avatar}
                            alt={`${profile.name} official Instagram avatar`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        {/* Instagram Icon Badge */}
                        <div
                          className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF7A00] via-[#E1306C] to-[#C13584] text-white shadow-sm ring-2 ring-[#080F35]"
                          aria-hidden="true"
                        >
                          <Instagram className="h-3 w-3" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#FF941E]">
                          {profile.role}
                        </span>
                        <h3 className="text-base font-bold text-white transition-colors group-hover:text-[#FFB03A] truncate mt-0.5">
                          {profile.name}
                        </h3>
                        <p className="text-xs text-[#D5DAE7]/70 font-mono truncate">
                          {profile.handle}
                        </p>
                      </div>
                    </div>

                    {/* Services Tags */}
                    <div className="mt-4 flex flex-wrap gap-1">
                      {profile.services.map((svc) => (
                        <span
                          key={svc}
                          className="rounded-md bg-white/[0.05] border border-white/5 px-2 py-0.5 text-[10px] font-medium text-[#FFD84A]/90"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>

                    {/* Brief Account Narrative */}
                    <p className="mt-3 text-xs text-[#D5DAE7]/80 leading-relaxed line-clamp-3">
                      {profile.description}
                    </p>
                  </div>

                  {/* View Profile Action */}
                  <div className="mt-5 pt-3.5 border-t border-white/10">
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full rounded-xl bg-white/[0.05] hover:bg-gradient-to-r hover:from-[#FF941E] hover:to-[#FFB03A] px-3.5 py-2 text-xs font-semibold text-white transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(255,148,30,0.3)]"
                      aria-label={`View Instagram profile for ${profile.name} (opens in new tab)`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Instagram className="h-3.5 w-3.5 text-[#FF941E] group-hover:text-white" />
                        <span>View Profile</span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: WEBSITE PROJECTS (3-Column Grid) ---------------- */}
        {activeTab === "websites" && (
          <div
            role="tabpanel"
            id="panel-websites"
            aria-labelledby="tab-websites"
            className="mt-10 sm:mt-12 transition-opacity duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {WEBSITE_PROJECTS.map((project) => (
                <article
                  key={project.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF941E]/60 hover:shadow-[0_16px_36px_rgba(255,148,30,0.2)]"
                >
                  {/* Top Image Viewport Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#080F35]">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {/* Subtle Gradient Overlays for Readability */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080F35] via-transparent to-black/30" />

                    {/* Category Badge on Top-Left */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#080F35]/85 px-3 py-1 text-[11px] font-semibold text-[#FFD84A] backdrop-blur-md border border-white/10 shadow-sm">
                        <Sparkles className="h-3 w-3 text-[#FF941E]" />
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-transparent to-[#080F35]/40">
                    <div>
                      {/* Project Title */}
                      <h3 className="text-xl font-bold text-white transition-colors duration-200 group-hover:text-[#FFB03A]">
                        {project.name}
                      </h3>

                      {/* Tags */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/[0.05] border border-white/5 px-2 py-0.5 text-[10px] font-medium text-[#D5DAE7]/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-xs sm:text-sm text-[#D5DAE7]/85 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Live Website Button */}
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full rounded-xl bg-white/[0.06] hover:bg-gradient-to-r hover:from-[#FF941E] hover:to-[#FFB03A] px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,148,30,0.35)]"
                        aria-label={`View live website for ${project.name} (opens in new tab)`}
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-[#FFD84A] group-hover:text-white" />
                          <span>View Live Website</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
