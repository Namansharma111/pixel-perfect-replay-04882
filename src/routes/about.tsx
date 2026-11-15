import { useState } from "react";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Cpu,
  FileCode2,
  Globe,
  GraduationCap,
  HeartHandshake,
  Hotel,
  Layers,
  Layout,
  LineChart,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Palette,
  Phone,
  Rocket,
  Search,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Utensils,
  Zap,
} from "lucide-react";
import aboutImg from "@/assets/about-studio.jpg";
import teamImg from "@/assets/careers-team.jpg";
import heroImg from "@/assets/hero-growth.jpg";
import { Button } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/site/primitives";
import { PageWrapper } from "@/components/site/PageWrapper";
import { pageHead } from "@/lib/seo";
import { SITE } from "@/config/site";
import {
  SERVICE_OPTIONS,
  contactSchema,
  type ContactInput,
} from "@/lib/form-schemas";
import { submitWebsiteLeadFn } from "@/lib/cms/cms.functions";
import { getLeadTrackingPayload } from "@/lib/tracking";

/* -------------------------------------------------------------------------- */
/*                                 ROUTE SETUP                                */
/* -------------------------------------------------------------------------- */

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Social Waale | Digital Marketing Agency in Chandigarh",
      description:
        "Learn about Social Waale, an ambitious digital marketing and website development agency based in Chandigarh. We help businesses across North India grow with SEO, Meta Ads, social media and high-converting websites.",
      path: "/about",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ],
    }),
  component: AboutPage,
});

/* -------------------------------------------------------------------------- */
/*                                DATA OBJECTS                                */
/* -------------------------------------------------------------------------- */

const CORE_BENCHMARK_STATS = [
  { value: "50+", label: "Clients Served", sub: "Across 8+ key industries" },
  { value: "10", label: "Digital Growth Services", sub: "Under one unified roof" },
  { value: "1–2 Years", label: "Focused Experience", sub: "High-velocity modern delivery" },
  { value: "Chandigarh", label: "Headquarters Base", sub: "Serving businesses Pan-North India" },
];

const DIGITAL_GROWTH_PHILOSOPHY = [
  {
    num: "01",
    title: "Modern Digital Strategy",
    desc: "We align creative campaigns and technological platforms directly with commercial revenue goals, eliminating disjointed marketing tactics and vanity metrics.",
  },
  {
    num: "02",
    title: "Search Engine Visibility",
    desc: "We engineer deep technical SEO, structured JSON-LD schema, and local search dominance to capture high-intent commercial buyers when they are ready to purchase.",
  },
  {
    num: "03",
    title: "Conversion-Focused Experience",
    desc: "Every website layout, social reel, and ad funnel is architected with clear visual hierarchy, accessible tap targets, and frictionless 1-click WhatsApp inquiry paths.",
  },
  {
    num: "04",
    title: "Long-Term Brand Growth",
    desc: "We focus on sustainable organic authority, community trust, and scalable advertising ecosystems that compound in business value year after year.",
  },
];

const QUALITY_STANDARDS = [
  {
    num: "01",
    title: "Speed & Mobile Experience",
    points: [
      "Sub-1.8s mobile LCP load times engineered on modern frameworks",
      "Next-generation WebP asset compression and responsive source sets",
      "Mobile-first ergonomics with thumb-accessible sticky action bars",
      "Zero cumulative layout shifts during web font and media rendering",
    ],
  },
  {
    num: "02",
    title: "Search & AI Visibility",
    points: [
      "Complete Schema.org JSON-LD microdata graphs for verified indexing",
      "Topical content clustering and shallow 3-click navigation depth",
      "Google Search Console & Bing Webmaster Tools verification setup",
      "Entity-first content architecture optimized for AI search engines",
    ],
  },
  {
    num: "03",
    title: "User Experience & Reliability",
    points: [
      "Accessible high-contrast typography and clear call-to-actions",
      "256-bit SSL encryption and strict form input sanitization",
      "Automated off-site cloud backups with point-in-time recovery",
      "100% intellectual property, source code, and asset ownership handover",
    ],
  },
];

const CLIENT_COMMITMENTS = [
  {
    num: "01",
    title: "Transparent Communication",
    desc: "No confusing technical jargon or hidden costs. We provide clear, itemized milestone proposals with open WhatsApp communication and scheduled video progress reviews.",
  },
  {
    num: "02",
    title: "Customized Strategies",
    desc: "We reject cookie-cutter templates. Every marketing campaign and web build is tailored specifically to your industry, target audience, and local competitive landscape.",
  },
  {
    num: "03",
    title: "Clear Project Milestones",
    desc: "Work proceeds in structured agile sprints: research, prototype sign-off, staging review, and final production launch, keeping you in complete control at every stage.",
  },
  {
    num: "04",
    title: "Business-Focused Solutions",
    desc: "We measure success by commercial metrics that genuinely impact your growth: qualified customer inquiries, verified phone calls, confirmed orders, and tangible revenue.",
  },
];

const INDUSTRY_SECTORS = [
  {
    Icon: Stethoscope,
    name: "Healthcare & Clinics",
    desc: "Patient-centric websites, doctor credential showcases, appointment funnels, and compliant local health marketing.",
  },
  {
    Icon: GraduationCap,
    name: "Education & Coaching",
    desc: "Student enrollment funnels, course catalogs, faculty showcases, and high-ROAS admission campaigns.",
  },
  {
    Icon: ShoppingBag,
    name: "E-Commerce & Retail",
    desc: "High-speed digital storefronts, frictionless checkout, dynamic product showcases, and scalable Meta Ads.",
  },
  {
    Icon: Hotel,
    name: "Travel & Tourism",
    desc: "Cinematic mountain itineraries, direct resort booking engines, trekking guides, and viral travel reel strategies.",
  },
  {
    Icon: Building2,
    name: "Real Estate & Builders",
    desc: "Project landing pages, interactive floor plans, construction progress updates, and verified buyer lead generation.",
  },
  {
    Icon: Palette,
    name: "Fashion & Lifestyle",
    desc: "Aesthetic lookbooks, luxury couture storefronts, influencer outreach, and curated Instagram feed direction.",
  },
  {
    Icon: Utensils,
    name: "Food & Restaurants",
    desc: "Mobile-friendly digital menus, table reservation triggers, Google Maps local SEO, and appetizing video reels.",
  },
  {
    Icon: ShieldCheck,
    name: "Professional Services",
    desc: "Corporate thought-leadership hubs, case study libraries, B2B lead generation, and executive brand positioning.",
  },
];

const SIX_CORE_STANDARDS = [
  {
    num: "01",
    title: "Mobile-First Website Design",
    desc: "Crafted specifically for the 80%+ of Indian consumers browsing on mobile phones with thumb-friendly navigation and crisp visual ergonomics.",
  },
  {
    num: "02",
    title: "Search-Friendly Website Structure",
    desc: "Semantic HTML5, shallow taxonomy, structured schema tags, and optimized internal linking to secure top search positions.",
  },
  {
    num: "03",
    title: "Quality Content & Branding",
    desc: "Cohesive typography, bespoke brand palettes, compelling conversion copy, and visual storytelling that commands marketplace authority.",
  },
  {
    num: "04",
    title: "Performance-Focused Campaigns",
    desc: "Data-backed Meta Ads, Google Search Ads, and creative social campaigns engineered to maximize return on ad spend (ROAS).",
  },
  {
    num: "05",
    title: "Responsive User Experience",
    desc: "Instant page loads, zero visual shifting (CLS), and fluid responsiveness across smart devices, laptops, and 4K displays.",
  },
  {
    num: "06",
    title: "Clear Client Communication",
    desc: "Dedicated project coordinators, transparent weekly reporting dashboards, and direct WhatsApp accessibility whenever you need assistance.",
  },
];

const DEVELOPMENT_JOURNEY = [
  {
    step: "01",
    title: "Discovery & Requirements",
    desc: "We analyze your commercial goals, target audience demographics, existing digital presence, and local market competitors.",
  },
  {
    step: "02",
    title: "Research & Strategy",
    desc: "We formulate a unified roadmap covering channel mix, commercial search keyword clusters, content themes, and conversion paths.",
  },
  {
    step: "03",
    title: "Design & Planning",
    desc: "Our design team crafts bespoke visual wireframes, brand aesthetics, and interactive prototypes for your review and sign-off.",
  },
  {
    step: "04",
    title: "Development & Execution",
    desc: "We engineer clean, modular, type-safe code, produce creative assets, configure tracking pixels, and deploy campaign infrastructure.",
  },
  {
    step: "05",
    title: "Testing & Launch",
    desc: "Rigorous quality audits across mobile devices, cross-browser testing, Core Web Vitals verification, SSL setup, and production release.",
  },
  {
    step: "06",
    title: "Optimization & Ongoing Growth",
    desc: "Continuous performance reviews, A/B ad creative testing, search ranking improvements, and proactive maintenance support.",
  },
];

const TECH_PILLARS = [
  {
    num: "01",
    title: "Website Design & Development",
    desc: "Modern front-end engineering using component-driven frameworks, responsive layouts, Core Web Vitals optimization, and custom e-commerce integrations.",
    skills: ["React & TypeScript", "Next-Gen Build Pipelines", "Sub-2s Page Loads", "Custom Checkout Funnels", "Zero Bloated Themes"],
  },
  {
    num: "02",
    title: "SEO & Performance Marketing",
    desc: "Comprehensive search engine optimization and data-backed paid advertising engineered to dominate commercial search terms and deliver verified buyer inquiries.",
    skills: ["Topical Authority Architecture", "Schema.org JSON-LD Graphs", "Meta Ads & CAPI Integration", "Google Search & Local Maps", "Weekly ROAS Analytics"],
  },
  {
    num: "03",
    title: "Creative Media & Brand Communication",
    desc: "Bespoke brand identities, high-impact social media creatives, engaging short-form video reels, and cohesive multi-channel marketing collateral.",
    skills: ["Brand Guidelines & Logos", "Instagram Reels Production", "Conversion Ad Creatives", "Content Writing & PR", "Multi-Platform Visuals"],
  },
];

const SPECIALIZED_SOLUTIONS = [
  {
    title: "Healthcare & Education",
    desc: "Digital platforms built for clinical credibility and student enrollment with structured appointment booking, course catalogs, and patient trust funnels.",
  },
  {
    title: "E-Commerce & Retail",
    desc: "Rapid-loading online storefronts engineered for high visual conversions, friction-free mobile checkout, dynamic filtering, and high-ROAS Meta Ads.",
  },
  {
    title: "Travel & Tourism",
    desc: "Immersive visual portals for trekking expeditions, mountain resorts, and tour operators with detailed itineraries and direct booking pathways.",
  },
  {
    title: "Lifestyle & Professional Brands",
    desc: "Bespoke digital architecture for couture designers, architects, legal firms, and corporate consultancies commanding premium marketplace authority.",
  },
];

const ABOUT_FAQS = [
  {
    q: "What is Social Waale?",
    a: "Social Waale is a Chandigarh-based digital marketing and website development agency. We serve as a dedicated growth partner for emerging businesses, clinics, retail brands, and service leaders across North India, delivering integrated website engineering, SEO, social media management, Meta Ads, and creative branding.",
  },
  {
    q: "Where is Social Waale based?",
    a: "Our core agency operations and studio are based in Chandigarh, India. We maintain close hands-on partnerships across the Chandigarh Tricity (Chandigarh, Mohali, Panchkula) while serving clients across North India and nationally.",
  },
  {
    q: "Which locations does Social Waale serve?",
    a: "We work actively with businesses across Chandigarh, Punjab (Ludhiana, Jalandhar, Amritsar, Patiala), Himachal Pradesh (Shimla, Dharamshala, Solan, Kullu), Haryana (Gurugram, Panipat, Karnal, Ambala), Uttar Pradesh, Delhi NCR, and across India through scheduled consultations and collaborative digital workflows.",
  },
  {
    q: "What digital marketing services do you provide?",
    a: "We provide 10 comprehensive growth services under one unified roof: Search Engine Optimization (SEO), Google Ads & Performance Marketing, Social Media Marketing, Content Marketing & Email Automation, Brand Strategy & Identity Design, Website & App Development, UI/UX & Conversion Rate Optimization (CRO), Offline & Local Advertising, Public Relations (PR), and Photoshoot & Creative Media.",
  },
  {
    q: "Do you provide social media management?",
    a: "Yes. We manage end-to-end social media presence for brands, including content calendars, aesthetic graphic design, high-engagement Instagram Reels production, community interaction, and growth strategies for Instagram, Facebook, LinkedIn, and YouTube.",
  },
  {
    q: "Do you manage Meta Ads?",
    a: "Yes. We engineer high-performing Meta Ads (Facebook & Instagram) campaigns. This includes audience research, custom creative ad sets, conversion tracking pixel & Conversion API (CAPI) setup, retargeting funnels, and continuous A/B testing to deliver maximum return on ad spend (ROAS).",
  },
  {
    q: "Do you offer SEO services?",
    a: "Yes. Our SEO services cover in-depth technical audits, on-page optimization, Schema.org JSON-LD microdata, topical keyword clustering, high-intent local search optimization on Google Maps, and high-authority link acquisition.",
  },
  {
    q: "Do you develop business websites?",
    a: "Yes. We develop custom, high-speed business websites, corporate platforms, and e-commerce storefronts using modern frameworks like React and TypeScript. Every website is mobile-first, secure, and optimized for sub-2-second load times.",
  },
  {
    q: "Which industries do you work with?",
    a: "We work across healthcare, education and coaching, e-commerce and retail, travel and tourism, luxury fashion, real estate, restaurants and artisanal food brands, manufacturing, and corporate professional services.",
  },
  {
    q: "How much do your digital marketing services cost?",
    a: "We provide transparent, fixed-price milestone proposals for website development projects so you know exact costs before kickoff. For digital marketing retainers (social media, SEO, paid ads), we offer flexible monthly plans based on your specific growth goals, with zero hidden markups.",
  },
  {
    q: "How can I start working with Social Waale?",
    a: "Getting started is straightforward. Submit your requirements through the project inquiry form on this page or message us directly on WhatsApp at +91 9805789363. We will schedule a complimentary discovery call and deliver an itemized growth proposal within 24 hours.",
  },
  {
    q: "Why should I choose Social Waale?",
    a: "Unlike scattered freelancers or bloated legacy agencies, Social Waale gives you direct access to experienced digital strategists, transparent milestone pricing, 100% intellectual property ownership, modern type-safe code, and marketing campaigns tied to verified commercial revenue.",
  },
  {
    q: "Do you offer customized packages?",
    a: "Yes. We recognize that an emerging clinic in Chandigarh has different priorities than a growing e-commerce brand in Ludhiana or a mountain resort in Shimla. We tailor our scope, channel focus, and deliverables to your exact commercial stage.",
  },
  {
    q: "How can I contact your team?",
    a: "You can reach us directly by phone at +91 9805789363, by email at socialgrow111@gmail.com, or through WhatsApp. We are available Monday through Saturday from 9:30 AM to 6:30 PM IST.",
  },
  {
    q: "Can I use multiple services together?",
    a: "Absolutely. In fact, our clients achieve the strongest results when combining services — such as pairing a high-speed website with targeted Meta Ads and ongoing SEO. This unified ecosystem ensures maximum conversion efficiency at every customer touchpoint.",
  },
];

/* -------------------------------------------------------------------------- */
/*                            HERO INQUIRY FORM                               */
/* -------------------------------------------------------------------------- */

function HeroInquiryCard() {
  const submitLead = useServerFn(submitWebsiteLeadFn);
  const location = useLocation();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      phone: "",
      email: "",
      service: "Website & App Development",
      budget: "Prefer to discuss",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("idle");
    setServerError("");
    try {
      const tracking = getLeadTrackingPayload(location.pathname);
      const res = await submitLead({
        data: {
          fullName: values.fullName,
          businessName: values.businessName || "About Page Inquiry",
          phone: values.phone,
          email: values.email,
          service: values.service,
          budget: values.budget || "Prefer to discuss",
          message: values.message || "Consultation enquiry submitted from About Us page.",
          sourceUrl: tracking.sourceUrl,
          formName: "About Page Free Consultation Form",
          formType: "consultation",
          utmSource: tracking.utmSource,
          utmMedium: tracking.utmMedium,
          utmCampaign: tracking.utmCampaign,
          utmContent: tracking.utmContent,
          utmTerm: tracking.utmTerm,
          referrer: tracking.referrer,
          website: values.website,
        },
      });
      if (res && res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
        setServerError("Submission could not be completed.");
      }
    } catch {
      setStatus("error");
      setServerError("Network error. Please try again or WhatsApp us directly.");
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-7 backdrop-blur-md shadow-2xl">
      <div className="mb-5">
        <span className="inline-block text-[11px] font-bold text-[#FFD84A] uppercase tracking-wider">
          PROJECT INQUIRY
        </span>
        <h3 className="text-xl font-bold text-white mt-1">
          Start Your Project With Us
        </h3>
        <p className="text-xs text-[#D5DAE7]/80 mt-1">
          Tell us about your requirements for a free strategy consultation.
        </p>
      </div>

      {status === "success" ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center animate-in fade-in">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">Inquiry Received</h4>
          <p className="text-xs text-[#D5DAE7]/90 mt-2 leading-relaxed">
            Thank you for reaching out! A senior strategist from Social Waale will review your project and connect with you within 24 hours.
          </p>
          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={() => setStatus("idle")}
            className="mt-4 text-xs"
          >
            Send Another Inquiry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Honeypot field */}
          <input
            type="text"
            {...register("website")}
            tabIndex={-1}
            autoComplete="off"
            className="sr-only pointer-events-none"
            aria-hidden="true"
          />

          <div>
            <label htmlFor="hero-name" className="block text-xs font-semibold text-[#D5DAE7]/90 mb-1">
              Full Name *
            </label>
            <input
              id="hero-name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              {...register("fullName")}
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#FF941E] focus:outline-none focus:ring-1 focus:ring-[#FF941E]"
            />
            {errors.fullName && (
              <p className="mt-1 text-[11px] text-red-400">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="hero-email" className="block text-xs font-semibold text-[#D5DAE7]/90 mb-1">
                Email Address *
              </label>
              <input
                id="hero-email"
                type="email"
                placeholder="name@company.com"
                {...register("email")}
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#FF941E] focus:outline-none focus:ring-1 focus:ring-[#FF941E]"
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="hero-phone" className="block text-xs font-semibold text-[#D5DAE7]/90 mb-1">
                Phone Number *
              </label>
              <input
                id="hero-phone"
                type="tel"
                placeholder="e.g. 9805789363"
                {...register("phone")}
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#FF941E] focus:outline-none focus:ring-1 focus:ring-[#FF941E]"
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-red-400">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="hero-service" className="block text-xs font-semibold text-[#D5DAE7]/90 mb-1">
              Service Interested In *
            </label>
            <select
              id="hero-service"
              {...register("service")}
              className="w-full rounded-xl border border-white/10 bg-[#0E1B5A] px-3.5 py-2.5 text-xs text-white focus:border-[#FF941E] focus:outline-none focus:ring-1 focus:ring-[#FF941E]"
            >
              {SERVICE_OPTIONS.map((svc) => (
                <option key={svc} value={svc} className="bg-[#080F35] text-white">
                  {svc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="hero-message" className="block text-xs font-semibold text-[#D5DAE7]/90 mb-1">
              Project Requirements *
            </label>
            <textarea
              id="hero-message"
              rows={3}
              placeholder="Tell us about your brand goals, target timeline, or current challenges..."
              {...register("message")}
              className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#FF941E] focus:outline-none focus:ring-1 focus:ring-[#FF941E]"
            />
            {errors.message && (
              <p className="mt-1 text-[11px] text-red-400">{errors.message.message}</p>
            )}
          </div>

          {status === "error" && (
            <p className="text-xs text-red-400 text-center">{serverError}</p>
          )}

          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={isSubmitting}
            className="w-full text-xs font-bold tracking-wide"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Project Inquiry <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </>
            )}
          </Button>

          <p className="text-[10px] text-center text-[#D5DAE7]/60">
            🔒 Direct consultation. No spam. You'll receive an itemized proposal.
          </p>
        </form>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <PageWrapper>
      {/* ==================================================================== */}
      {/* SECTION 01 — WHO WE ARE (ABOUT US HERO)                              */}
      {/* ==================================================================== */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden text-white">
        <div
          className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[#3B82F6]/10 blur-[130px]"
          aria-hidden="true"
        />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
                WHO WE ARE
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                About <span className="text-gradient">Social Waale</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#D5DAE7]/90 leading-relaxed max-w-2xl">
                A creative digital growth partner helping businesses build stronger online identities through strategic marketing, modern websites and performance-focused digital solutions.
              </p>

              {/* 3 Genuine Statistics */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#FFD84A]">1–2 Years</p>
                  <p className="text-xs text-[#D5DAE7]/70 mt-1 font-medium">Of Experience</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#FFD84A]">50+</p>
                  <p className="text-xs text-[#D5DAE7]/70 mt-1 font-medium">Clients Served</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#FFD84A]">10</p>
                  <p className="text-xs text-[#D5DAE7]/70 mt-1 font-medium">Digital Services</p>
                </div>
              </div>
            </div>

            {/* Right Project Inquiry Form Card */}
            <div className="lg:col-span-5">
              <HeroInquiryCard />
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 02 — OUR COMPANY STORY                                      */}
      {/* ==================================================================== */}
      <section className="relative py-20 lg:py-24 border-t border-white/5 bg-black/20 text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
                <img
                  src={aboutImg}
                  alt="Social Waale digital marketing agency team collaborating in Chandigarh"
                  className="w-full h-auto object-cover aspect-[4/3]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080F35]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#080F35]/85 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-bold text-[#FFD84A]">Chandigarh Headquarters</p>
                  <p className="text-[11px] text-[#D5DAE7]/80 mt-0.5">
                    Operating locally, partnering with ambitious brands across North India.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
                OUR COMPANY STORY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Building Digital Experiences & Growing Brands Through Strategy
              </h2>
              <div className="mt-5 space-y-4 text-sm sm:text-base text-[#D5DAE7]/85 leading-relaxed">
                <p>
                  Social Waale was founded with a straightforward conviction: Indian businesses deserve a digital marketing partner that delivers tangible commercial growth rather than confusing vanity metrics. Too many business owners were left stranded between fragmented freelancers, opaque agencies, and sluggish websites that generated zero real inquiries.
                </p>
                <p>
                  Headquartered in Chandigarh, we built an integrated studio that combines modern front-end web engineering, organic search optimization (SEO), performance-driven Meta Ads, and compelling creative media. In our first years, we have had the privilege of partnering with over 50 businesses — from healthcare clinics and education academies to retail boutiques and luxury tourism operators across North India.
                </p>
                <p>
                  Every engagement is guided by complete transparency, clean type-safe code, and campaigns engineered to generate qualified customer phone calls, direct WhatsApp inquiries, and sustained brand recognition.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 03 — OUR PHILOSOPHY                                          */}
      {/* ==================================================================== */}
      <section className="relative py-20 border-t border-white/5 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              OUR GUIDING PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Turning Business Ambitions Into{" "}
              <span className="text-gradient">Digital Growth</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[#D5DAE7]/90 leading-relaxed max-w-3xl mx-auto">
              We believe sustainable marketing begins with listening. We study what makes your business unique, what your local competitors are missing, and how modern consumers actually make buying decisions online. By blending creative thinking with rigorous data analysis and long-term partnership ethics, we turn digital presence into your most valuable asset.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">
                  Talk to Our Team <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 04 — FULL-SERVICE DIGITAL SOLUTIONS                          */}
      {/* ==================================================================== */}
      <section className="relative py-20 bg-black/20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              FULL-SERVICE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Complete Digital Growth Solutions Under One Roof
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              Our 10 core services work cohesively together, ensuring consistent messaging from the first social impression to final website conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm">
              <div className="p-3 rounded-xl bg-[#FF941E]/15 text-[#FF941E] w-fit mb-5">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Creative Strategy</h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                Brand identity systems, memorable logos, positioning frameworks, and multi-platform visual guidelines that command authority.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm">
              <div className="p-3 rounded-xl bg-[#FF941E]/15 text-[#FF941E] w-fit mb-5">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Digital Marketing</h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                Full-funnel social media management, viral reels production, YouTube marketing, and localized community engagement strategies.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm">
              <div className="p-3 rounded-xl bg-[#FF941E]/15 text-[#FF941E] w-fit mb-5">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Website & SEO</h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                Type-safe, sub-2-second responsive websites engineered for Core Web Vitals alongside top Google Search rankings.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm">
              <div className="p-3 rounded-xl bg-[#FF941E]/15 text-[#FF941E] w-fit mb-5">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Performance & Optimization</h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                High-ROAS Meta and Google Ads management, conversion rate optimization (CRO), and continuous weekly attribution tuning.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 05 — OUR CORE BENCHMARK                                      */}
      {/* ==================================================================== */}
      <section className="relative py-20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              PROVEN TRACK RECORD
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Quality in Every Digital Experience We Create
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              We hold every deliverable to strict standards of visual appeal, code cleanliness, search accessibility, and commercial conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_BENCHMARK_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-center backdrop-blur-sm"
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-gradient">{stat.value}</p>
                <p className="text-sm font-bold text-white mt-2">{stat.label}</p>
                <p className="text-xs text-[#D5DAE7]/70 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 06 — OUR DIGITAL GROWTH PHILOSOPHY                           */}
      {/* ==================================================================== */}
      <section className="relative py-20 bg-black/20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              FOUR CORE PILLARS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Our Digital Growth Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIGITAL_GROWTH_PHILOSOPHY.map((item) => (
              <div
                key={item.num}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all hover:border-[#FF941E]/40"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-xs font-black text-primary-foreground shadow-glow mb-4">
                  {item.num}
                </span>
                <h3 className="text-lg font-bold text-white mb-2.5">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 07 — OUR QUALITY STANDARDS (3 LARGE CARDS)                   */}
      {/* ==================================================================== */}
      <section className="relative py-20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              RIGOROUS EXECUTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Core Standards We Follow in Every Project
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {QUALITY_STANDARDS.map((card) => (
              <div
                key={card.num}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-xs font-black text-primary-foreground shadow-glow mb-5">
                  {card.num}
                </span>
                <h3 className="text-xl font-bold text-white mb-5">{card.title}</h3>
                <ul className="space-y-3 text-xs text-[#D5DAE7]/90 border-t border-white/10 pt-5">
                  {card.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#FF941E] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 08 — OUR CLIENT SERVICE COMMITMENTS                          */}
      {/* ==================================================================== */}
      <section className="relative py-20 bg-black/20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              SERVICE ETHICS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Our Client Service Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLIENT_COMMITMENTS.map((item) => (
              <div
                key={item.num}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-xs font-black text-primary-foreground shadow-glow mb-4">
                  {item.num}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 09 — INDUSTRY EXPERTISE (8 DETAILED SECTORS)                */}
      {/* ==================================================================== */}
      <section className="relative py-20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              SECTOR KNOWLEDGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Digital Growth Solutions Across Multiple Industries
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              We engineer specialized web architectures and digital marketing funnels tailored to specific buyer journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INDUSTRY_SECTORS.map(({ Icon, name, desc }) => (
              <div
                key={name}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-[#FF941E]/40"
              >
                <div className="p-3 rounded-xl bg-[#FF941E]/15 text-[#FF941E] w-fit mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{name}</h3>
                <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 10 — OUR PARTNERSHIP APPROACH                                */}
      {/* ==================================================================== */}
      <section className="relative py-20 bg-black/20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              PARTNERSHIP CULTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built on Creativity, Strategy & Client Relationships
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <span className="text-xs font-black text-[#FF941E] uppercase">01</span>
              <h3 className="text-lg font-bold text-white mt-2 mb-2">Customized Solutions</h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                Every business model requires tailored tactics. We adapt our sprint scope and deliverables to your specific growth stage.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <span className="text-xs font-black text-[#FF941E] uppercase">02</span>
              <h3 className="text-lg font-bold text-white mt-2 mb-2">Clear Communication</h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                Direct access to strategists and developers via WhatsApp and scheduled check-ins, eliminating bureaucratic lag.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <span className="text-xs font-black text-[#FF941E] uppercase">03</span>
              <h3 className="text-lg font-bold text-white mt-2 mb-2">Creative Execution</h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                Compelling visuals, scroll-stopping video reels, and modern web aesthetics that genuinely distinguish your brand.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <span className="text-xs font-black text-[#FF941E] uppercase">04</span>
              <h3 className="text-lg font-bold text-white mt-2 mb-2">Continuous Improvement</h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                We monitor real-time campaign performance and user feedback, refining ads and web conversions iteratively.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 11 — OUR EXPERIENCE & DIGITAL EVOLUTION                      */}
      {/* ==================================================================== */}
      <section className="relative py-20 border-t border-white/5 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              MODERN ADAPTABILITY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Growing With Modern Digital Marketing
            </h2>
            <div className="mt-6 space-y-4 text-sm sm:text-base text-[#D5DAE7]/85 leading-relaxed text-left sm:text-center max-w-3xl mx-auto">
              <p>
                The digital ecosystem in India evolves at breakneck speed. Consumer search habits have expanded beyond conventional search engine listings into generative AI answer engines, short-form video reels, and direct instant messaging inquiries.
              </p>
              <p>
                At Social Waale, our focused 1–2 years of experience means we are unburdened by outdated legacy agency practices. We build with modern component-driven web frameworks, execute high-velocity Meta Ads with Conversion API (CAPI) machine learning, and optimize content for next-generation discovery platforms like ChatGPT, Perplexity, and Google AI Overviews.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 12 — SIX CORE QUALITY STANDARDS                              */}
      {/* ==================================================================== */}
      <section className="relative py-20 bg-black/20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              EXECUTION BENCHMARKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Six Core Quality Standards Behind Every Project
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SIX_CORE_STANDARDS.map((card) => (
              <div
                key={card.num}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-xs font-black text-primary-foreground mb-4">
                  {card.num}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
                <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 13 — OUR PROJECT DEVELOPMENT JOURNEY                         */}
      {/* ==================================================================== */}
      <section className="relative py-20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              STRUCTURED ROADMAP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Our 6-Step Project Development Journey
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              A transparent, predictable process from preliminary requirement discovery to post-launch scaling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEVELOPMENT_JOURNEY.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#FFD84A]">{step.step}</span>
                  <span className="text-[10px] font-bold tracking-wider text-[#FF941E] uppercase">
                    PHASE {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 14 — TECHNOLOGY & DIGITAL EXPERTISE                          */}
      {/* ==================================================================== */}
      <section className="relative py-20 bg-black/20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              CAPABILITY MATRIX
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Our Digital Technology, Marketing & Creative Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TECH_PILLARS.map((col) => (
              <div
                key={col.num}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm flex flex-col justify-between"
              >
                <div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-xs font-black text-primary-foreground shadow-glow mb-5">
                    {col.num}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">{col.title}</h3>
                  <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed mb-6">
                    {col.desc}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-5 space-y-2">
                  {col.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-xs text-[#D5DAE7]/90">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#FF941E] shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 15 — SPECIALIZED INDUSTRY SOLUTIONS                          */}
      {/* ==================================================================== */}
      <section className="relative py-20 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              TARGETED VERTICALS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Our Specialized Industry Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPECIALIZED_SOLUTIONS.map((sol) => (
              <div
                key={sol.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm"
              >
                <h3 className="text-base font-bold text-white mb-2">{sol.title}</h3>
                <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">{sol.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 16 — ABOUT SOCIAL WAALE FAQs (ACCORDION)                     */}
      {/* ==================================================================== */}
      <section id="about-faqs" className="relative py-20 lg:py-28 bg-black/25 border-t border-white/5 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              TRANSPARENT ANSWERS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Frequently Asked Questions About Social Waale
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              Clear, straightforward answers about our agency background, services, location reach, pricing, and onboarding process.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
            {ABOUT_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[#FF941E]/60 bg-white/[0.05] shadow-[0_10px_30px_rgba(255,148,30,0.12)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 p-5 sm:p-6 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[#FFD84A] transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-[#FF941E] text-white" : ""
                      }`}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs text-[#D5DAE7]/90 leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 17 — FINAL CTA                                               */}
      {/* ==================================================================== */}
      <section className="relative py-20 lg:py-24 border-t border-white/10 bg-gradient-to-b from-transparent via-[#0E1B5A]/60 to-[#080F35] text-white">
        <Container>
          <div className="relative rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-12 lg:p-16 text-center backdrop-blur-md shadow-2xl max-w-4xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              GET IN TOUCH TODAY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Let's Build Something <span className="text-gradient">Great Together.</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-[#D5DAE7]/90 leading-relaxed max-w-2xl mx-auto">
              Have a business idea or looking to grow your digital presence? Let's discuss how Social Waale can help.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="hero" size="xl" className="shadow-glow">
                <Link to="/contact">
                  Let's Discuss Your Project <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <a href="tel:+919805789363">
                  <Phone className="mr-2 h-4 w-4 text-[#FF941E]" />
                  Call +91 9805789363
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}
