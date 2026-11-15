import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  FileCode2,
  Globe,
  Layers,
  Layout,
  LineChart,
  Lock,
  MapPin,
  MessageCircle,
  MessageSquare,
  Palette,
  Phone,
  RefreshCw,
  Rocket,
  Search,
  Server,
  Share2,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*                                DATA OBJECTS                                */
/* -------------------------------------------------------------------------- */

const STANDARDS_CARDS = [
  {
    num: "01",
    title: "Modern Front-End Engineering",
    description:
      "Component-driven TypeScript and React architectures engineered for instant page transitions, modular reusability, and zero bloated template weight.",
    points: [
      "Sub-second mobile loading speeds",
      "Zero vulnerable legacy plugin overhead",
      "Clean modular code and typed design tokens",
    ],
  },
  {
    num: "02",
    title: "Conversion-Led UX & Ergonomics",
    description:
      "Custom user journeys architected around buyer psychology, clear visual hierarchy, accessible tap targets, and seamless lead conversion funnels.",
    points: [
      "Mobile-first thumb zone navigation",
      "Above-the-fold CTA enquiry pathways",
      "High-converting 1-click WhatsApp routing",
    ],
  },
  {
    num: "03",
    title: "Technical & Local Search SEO",
    description:
      "Deep semantic search optimization designed to capture high-intent commercial queries across Chandigarh, Punjab, Himachal, Haryana, and North India.",
    points: [
      "Complete Schema.org JSON-LD microdata",
      "Topical content clustering & internal linking",
      "Google Maps local business authority",
    ],
  },
  {
    num: "04",
    title: "Enterprise Security & Cloud Reliability",
    description:
      "Hardened cloud infrastructure with automated backups, end-to-end SSL encryption, strict form validation, and 99.9% uptime dependability.",
    points: [
      "Automated off-site cloud backups",
      "DDoS mitigation & secure form sanitization",
      "Proactive post-launch maintenance & care",
    ],
  },
];

const LIFECYCLE_STAGES = [
  {
    badge: "STAGE 01: COMMERCIAL DISCOVERY & SEARCH MAPPING",
    title: "Market Benchmarking & Architecture Blueprinting",
    description:
      "Before writing any code or launching campaigns, we study your target market, buyer personas, and high-performing competitors across Chandigarh, North India, and broader target regions. We map high-intent commercial and transactional search queries to your sitemap architecture, ensuring every page has a distinct commercial purpose and clear conversion paths.",
    deliverables: [
      "Competitor digital audit and content gap analysis",
      "Sitemap taxonomy with shallow 3-click navigation depth",
      "Customer purchase journey & enquiry funnel mapping",
      "Target commercial keyword clusters and search intent mapping",
    ],
  },
  {
    badge: "STAGE 02: RESPONSIVE UI/UX & BRAND DESIGN SYSTEMS",
    title: "Custom Brand Aesthetics & Mobile-First Ergonomics",
    description:
      "We design bespoke visual prototypes that authentically capture your brand identity. Our designers emphasize mobile ergonomics, accessible contrast ratios, intuitive tap targets, and conversion-focused page hierarchy. You review and approve interactive prototypes before our engineering team begins production development.",
    deliverables: [
      "Custom typography hierarchies & brand color palettes",
      "Interactive component prototypes for client walkthrough and sign-off",
      "Thumb-friendly mobile sticky navigation and action bars",
      "Conversion-optimized forms, trust badges, and WhatsApp hooks",
    ],
  },
  {
    badge: "STAGE 03: STANDARDS-BASED DEVELOPMENT & CORE WEB VITALS",
    title: "Clean Modular Code & Sub-Second Load Speeds",
    description:
      "Our developers write clean, modular TypeScript, modern React, and optimized CSS. We strictly reject bloated legacy theme builders and unvetted plugins that slow down page rendering. Every build undergoes rigorous speed audits to achieve 90+ Google PageSpeed scores, fast LCP, and zero visual layout shifts on mobile devices.",
    deliverables: [
      "Static generation & edge asset caching for instant response",
      "Modern WebP image optimization and lazy-loading pipelines",
      "Zero Cumulative Layout Shift (CLS) during web font rendering",
      "Accessible semantic HTML5 landmarks and ARIA attributes",
    ],
  },
  {
    badge: "STAGE 04: PRODUCTION LAUNCH, WARRANTY & SEO SETUP",
    title: "Enterprise Security Handover & Full Search Indexing",
    description:
      "We configure SSL encryption certificates, automated off-site cloud backups, and Schema.org structured data markup. Once your platform launches, we provide a 30-day technical warranty, administrative training, and complete handover of 100% intellectual property, domain access, and source code ownership.",
    deliverables: [
      "Google Search Console verification & XML sitemap indexing",
      "Google Analytics 4 & Meta Pixel conversion tracking setup",
      "Automated daily cloud backups and firewall safeguards",
      "100% source code ownership with zero proprietary vendor lock-in",
    ],
  },
];

const INDUSTRY_SOLUTIONS = [
  {
    sector: "HEALTHCARE & SPECIALIST CLINICS",
    title: "Clinical Healthcare & Specialist Medical Networks",
    description:
      "Hospitals, specialty clinics, dental studios, and wellness centers across Chandigarh Tricity and North India require clinical websites that establish deep patient confidence. We build patient-centric web platforms with instant WhatsApp appointment booking, consultant credentials, diagnostic department listings, and strict privacy compliance, making it easy for patients to find doctor schedules and clinic directions on their smartphones.",
  },
  {
    sector: "EDUCATION, COACHING & EDTECH",
    title: "Higher Education, Coaching Academies & Skill Institutes",
    description:
      "Competitive examination institutes, study-abroad consultants, private schools, and colleges need high-converting student enrolment platforms. We design structured course curricula, faculty profiles, fee inquiry funnels, downloadable prospectuses, and targeted Meta/Google Ads campaigns that consistently attract motivated students and supportive parents.",
  },
  {
    sector: "D2C, E-COMMERCE & URBAN RETAIL",
    title: "High-Velocity E-Commerce & Consumer Lifestyle Brands",
    description:
      "Retailers and emerging direct-to-consumer brands require ultra-fast online stores that keep mobile bounce rates near zero. We build custom e-commerce storefronts with frictionless checkout, dynamic product filtering, real-time inventory hooks, automated order notifications, and high-ROAS Meta Ads creative funnels.",
  },
  {
    sector: "TRAVEL, TOURISM & ADVENTURE EXPEDITIONS",
    title: "Experiential Travel, Mountain Treks & Hospitality Resorts",
    description:
      "Tour operators, boutique homestays, and trekking companies across Himachal Pradesh, Uttarakhand, and Punjab rely on cinematic visual storytelling. We develop high-speed booking portals, detailed day-by-day itineraries, season-specific gear checklists, and viral Instagram Reels strategies that convert wanderlust into paid bookings.",
  },
  {
    sector: "FASHION, COUTURE & LUXURY APPAREL",
    title: "Bespoke Ethnic Wear, Designers & Luxury Boutiques",
    description:
      "Fashion designers and boutique bridal couture labels require sophisticated digital storefronts that mirror the craftsmanship of their garments. We engineer immersive lookbooks, high-resolution zoom galleries, custom size consult forms, and curated Instagram grid marketing that attract discerning luxury buyers.",
  },
  {
    sector: "REAL ESTATE, INFRASTRUCTURE & BUILDERS",
    title: "Property Developers, Commercial Projects & Luxury Estates",
    description:
      "Real estate builders and property consultants across North India need lead capture funnels that pre-qualify serious buyers. We build project showcase platforms featuring interactive floor plans, construction progress timelines, location maps, RERA compliance badges, and automated CRM lead distribution.",
  },
  {
    sector: "RESTAURANTS, CAFÉS & FOOD BRANDS",
    title: "Dining Destinations, Cloud Kitchens & Artisanal Food",
    description:
      "Dining venues, bakeries, and packaged snack brands need appetizing digital presence. We build mobile-optimized digital menus, table reservation triggers, Google Maps local SEO dominance, and short-form video campaigns that turn food lovers into loyal regulars.",
  },
  {
    sector: "PROFESSIONAL SERVICES & CORPORATE B2B",
    title: "Legal Firms, Chartered Accountants & Technology Consultancies",
    description:
      "Corporate service providers, manufacturing exporters, and IT consultancies require digital authority that commands executive respect. We develop authoritative thought leadership hubs, case study libraries, downloadable whitepapers, and targeted LinkedIn/Google Ads campaigns that generate high-value corporate inquiries.",
  },
];

const COMMITMENTS = [
  {
    title: "Transparent Milestone Proposals",
    text: "We provide line-item commercial proposals where payments are tied to verifiable sprint milestones: wireframe approval, staging demo sign-off, and final production launch. You never face surprise maintenance fees or hidden charges.",
  },
  {
    title: "Direct Access to Senior Strategists",
    text: "You collaborate directly with our lead developers, UI designers, and certified SEO/marketing strategists based in Chandigarh. Direct communication eliminates misunderstandings and speeds up project execution across every phase.",
  },
  {
    title: "Long-Term Maintenance & Account Care",
    text: "Our partnership continues long after your website or campaign goes live. We offer dedicated monthly maintenance plans covering automated cloud backups, security patches, speed audits, and continuous search ranking optimizations.",
  },
  {
    title: "Modern React & TypeScript Engineering",
    text: "We build lightning-fast web applications without the sluggish weight of legacy templates. Our hand-crafted components achieve 90+ scores on Google PageSpeed Insights, ensuring flawless mobile browsing across all device screens.",
  },
  {
    title: "Full-Funnel Search Engine Optimization",
    text: "Every website is architected for search visibility from day one. We integrate Schema.org structured data, high-intent transactional keywords, and optimized internal linking to help your business dominate competitive search rankings.",
  },
  {
    title: "Predictable Timelines & Fast Delivery",
    text: "We respect your business launch schedule. By running structured agile development sprints, we deliver polished, fully tested websites in as little as 14 to 28 business days without sacrificing code quality or security.",
  },
];

const REGIONAL_COVERAGE = [
  {
    region: "Chandigarh Tricity",
    sub: "Chandigarh • Mohali • Panchkula • Zirakpur",
    desc: "As the commercial and technological nucleus of North India, Chandigarh businesses face intense competition. We help Tricity clinics, tech firms, retailers, and educational institutes build top-tier digital presence with dominant Google Maps local SEO and targeted social campaigns.",
  },
  {
    region: "Punjab",
    sub: "Ludhiana • Jalandhar • Amritsar • Patiala • Bathinda",
    desc: "From industrial manufacturing in Ludhiana and sports exporters in Jalandhar to cultural retail in Amritsar, Punjab businesses demand strong B2B and consumer visibility. We engineer bilingual content, export-ready digital catalogs, and high-impact Meta Ads that reach local and diaspora audiences.",
  },
  {
    region: "Himachal Pradesh",
    sub: "Shimla • Dharamshala • Solan • Mandi • Kullu-Manali",
    desc: "Himachal's thriving tourism, boutique hospitality, horticulture, and education sectors require visually arresting storytelling. We build lightweight, fast-loading platforms optimized for hilly mobile networks, driving direct hotel and tour bookings while eliminating middleman commissions.",
  },
  {
    region: "Haryana",
    sub: "Gurugram • Faridabad • Karnal • Panipat • Ambala",
    desc: "Serving both enterprise hubs in Gurugram and industrial manufacturing corridors in Panipat and Faridabad, our solutions bridge corporate software polish with high-intent lead generation for commercial enterprises.",
  },
  {
    region: "Uttar Pradesh",
    sub: "Noida • Greater Noida • Lucknow • Agra • Kanpur",
    desc: "Positioned at the crossroads of commerce and modern industry, UP enterprises need scalable websites and performance marketing systems that stand out across dense urban centers and statewide consumer markets.",
  },
  {
    region: "Delhi NCR",
    sub: "Central Delhi • South Delhi • West Delhi • East Delhi",
    desc: "Competing in the capital requires digital marketing that cuts through immense noise. We deliver rapid-loading web platforms, hyper-targeted Google Search Ads, and creative social campaigns that convert discerning metropolitan buyers.",
  },
];

const BENCHMARKS = [
  {
    badge: "SPEED INDEX",
    title: "Largest Contentful Paint (LCP)",
    target: "Target under 1.8 seconds. Main hero content loads almost instantly on 4G and 5G connections.",
  },
  {
    badge: "INTERACTION",
    title: "Interaction to Next Paint (INP)",
    target: "Target under 100 milliseconds. Menus, tabs, buttons, and forms respond without sluggish delays.",
  },
  {
    badge: "VISUAL STABILITY",
    title: "Cumulative Layout Shift (CLS)",
    target: "Target zero shifts (0.00). Content stays perfectly stable as web fonts, images, and embeds load.",
  },
  {
    badge: "SEARCH READY",
    title: "Rich Schema.org Markup",
    target: "Valid JSON-LD schema graphs for LocalBusiness, FAQPage, Services, Breadcrumbs, and Organization.",
  },
  {
    badge: "ACCESSIBILITY",
    title: "WCAG 2.1 AA Compliance",
    target: "High-contrast color ratios, legible typography, semantic landmarks, and full keyboard navigation support.",
  },
  {
    badge: "HOSTING & CDN",
    title: "Edge Network Cloud CDN",
    target: "Global edge servers deliver cached static assets close to your local visitors in India and internationally.",
  },
];

const FAQ_ITEMS = [
  {
    q: "What sets Social Waale apart from template builders and freelance networks?",
    a: "Unlike drag-and-drop website builders or unverified freelance marketplaces, Social Waale operates as a dedicated digital engineering and marketing partner based in Chandigarh. Every project is assigned an experienced full-stack web architect and growth strategist who handles custom wireframing, type-safe clean code engineering, Core Web Vitals optimization, and post-launch maintenance. We provide enforceable milestone-based agreements, transparent deliverables, and 100% intellectual property transfer upon project launch.",
  },
  {
    q: "How do you guarantee sub-two-second load times and high Google PageSpeed scores?",
    a: "We engineer high performance directly into our component architecture. By decoupling front-end presentation from heavy backend plugins, utilizing modern static generation, purging unused CSS, and serving assets from Tier-1 edge caching nodes in India, we consistently achieve Largest Contentful Paint (LCP) times under 1.8 seconds. All images are transcoded to modern WebP formats with explicit aspect-ratio containers, guaranteeing a Cumulative Layout Shift (CLS) of 0.00 across all mobile viewports.",
  },
  {
    q: "What does 100% intellectual property (IP) and source code transfer include?",
    a: "Upon final milestone approval and project completion, Social Waale transfers complete, unrestricted ownership of all Git source repositories, design assets, Figma master files, database schemas, and cloud deployment credentials to you. You are never bound by proprietary platform locks or recurring licensing fees, giving your business complete freedom to scale, host, or modify your platform independently.",
  },
  {
    q: "How does your technical SEO framework ensure visibility across Chandigarh and North India?",
    a: "Our technical SEO goes far beyond basic meta tags. We implement comprehensive Schema.org JSON-LD microdata hierarchies (including Organization, LocalBusiness, ProfessionalService, FAQPage, and BreadcrumbList), automated XML sitemaps submitted directly to Google Search Console and Bing Webmaster Tools, canonical URL management, and mobile-friendly semantic heading tags that help search engine bots and AI answer engines index and cite your business accurately.",
  },
  {
    q: "How do you optimize websites for AI answer engines like ChatGPT, Perplexity, and Google SGE?",
    a: "Modern search extends beyond traditional blue links. We structure your site's content using entity-first semantic architecture, explicit schema markup, structured Q&A formats, and authoritative topical clusters. This enables Large Language Models (LLMs) and generative search engines (such as Google AI Overviews, Perplexity AI, and ChatGPT Search) to parse your business data as a verified citation source.",
  },
  {
    q: "What security, firewall, and backup protocols protect our digital platforms?",
    a: "All client deployments incorporate end-to-end SSL/TLS cryptographic transport with HSTS enforcement, automated Web Application Firewall (WAF) rule sets protecting against DDoS and SQL injection vulnerabilities, and strict form input sanitization. Customer contact records and transactional databases benefit from automated daily off-site cloud backups with point-in-time recovery archives.",
  },
  {
    q: "How do you integrate social media marketing, Meta Ads, and website conversions together?",
    a: "We believe marketing channels should never exist in silos. We connect your Meta Pixel, Conversion API (CAPI), and Google Analytics 4 tracking so that traffic from Instagram Reels, Facebook Ads, and YouTube campaigns feeds directly into your website's conversion funnels. Retargeting campaigns re-engage visitors who browsed specific services, while direct WhatsApp buttons allow warm prospects to connect immediately.",
  },
  {
    q: "What is your typical timeline for delivering a custom website or marketing campaign?",
    a: "A bespoke corporate or e-commerce website is typically designed, developed, tested, and launched within 14 to 28 business days across our 4-stage sprint cycle. Digital marketing and Meta Ads campaigns can be launched in as few as 5 to 7 days following brand asset review, creative development, and tracking pixel configuration.",
  },
  {
    q: "How do you handle ongoing website maintenance, security updates, and performance monitoring?",
    a: "We offer proactive monthly maintenance plans that include regular dependency updates, automated cloud backups, 24/7 uptime monitoring, Core Web Vitals health checks, and content updates. If any issue arises, our dedicated support team resolves it quickly, ensuring your website remains fast, secure, and always accessible.",
  },
  {
    q: "What pricing models does Social Waale offer for web development and digital marketing?",
    a: "We provide transparent, fixed-price milestone proposals for web development projects so you know exact costs before work starts. For social media management, SEO, and paid ad campaigns, we offer clear monthly retainer models with detailed weekly performance reports, ad spend transparency, and zero hidden agency markups.",
  },
  {
    q: "Why is mobile-first design essential for Indian businesses today?",
    a: "Over 75% to 85% of web traffic in India originates from mobile devices. If a website takes longer than 3 seconds to load or has tiny buttons that are difficult to tap, prospective customers leave immediately for a competitor. We design every interface thumb-first with clear sticky action bars, legible font sizing, and instant WhatsApp inquiry paths.",
  },
  {
    q: "Can you help migrate our existing website without losing our organic search rankings?",
    a: "Yes. When redesigning or migrating an existing website, we perform a complete URL inventory audit, set up strict 1:1 301 redirects, preserve existing high-ranking meta structures, and migrate all content cleanly. This ensures your hard-earned organic traffic, backlinks, and keyword rankings remain protected throughout the launch.",
  },
  {
    q: "How do you measure and report ROI from Meta Ads and digital marketing campaigns?",
    a: "We focus on commercial metrics that genuinely impact your bottom line: cost per qualified inquiry (CPL), verified WhatsApp leads, ROAS (Return on Ad Spend), and organic search impressions. You receive clear weekly and monthly performance dashboards without confusing vanity jargon.",
  },
  {
    q: "Do you work with regional businesses outside Chandigarh in Himachal, Punjab, and Haryana?",
    a: "Yes. While our core headquarters is in Chandigarh, over 60% of our clients operate across Himachal Pradesh (Shimla, Dharamshala, Solan), Punjab (Ludhiana, Jalandhar, Amritsar), Haryana (Gurugram, Panipat, Karnal), Delhi NCR, and across India. We communicate seamlessly via scheduled video consultations, WhatsApp updates, and collaborative digital sprint boards.",
  },
  {
    q: "What content and assets do we need to provide before our project kicks off?",
    a: "To get started, we typically require your existing brand logo files, high-resolution product/service photos (if available), any existing marketing collateral, and a brief overview of your business goals. If you don't have finished photography or copy, our team can help write professional website copy and source premium brand assets.",
  },
  {
    q: "How do we get started with Social Waale on a new project?",
    a: "Getting started is straightforward. Submit an inquiry through our contact form or send a message directly on WhatsApp at +91 9805789363. We'll schedule a complimentary 30-minute discovery consultation to discuss your growth goals, review your competitors, and provide an itemized commercial proposal within 24 hours.",
  },
];

/* -------------------------------------------------------------------------- */
/*                            COMPONENT DEFINITION                            */
/* -------------------------------------------------------------------------- */

export function LongFormSeoContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="relative text-white overflow-hidden bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35]">
      {/* ==================================================================== */}
      {/* SECTION 01 & 08: ARCHITECTURAL EXCELLENCE & DELIVERY STANDARDS      */}
      {/* ==================================================================== */}
      <section className="relative py-20 lg:py-28 border-t border-white/5">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              ARCHITECTURAL EXCELLENCE & DELIVERY STANDARDS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Building Powerful Digital Experiences That Drive{" "}
              <span className="text-gradient">Business Growth</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[#D5DAE7]/90 leading-relaxed max-w-3xl mx-auto">
              Operating as a specialized digital engineering and marketing studio in Chandigarh, Social Waale helps ambitious businesses across North India build commanding online presence. We blend modern front-end engineering with rigorous search engine optimization and full-funnel paid advertising to deliver digital platforms that perform, rank, and convert.
            </p>
          </div>

          {/* 4 Standards Cards (Matching Reference Image 1) */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STANDARDS_CARDS.map((card) => (
              <div
                key={card.num}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF941E]/50 hover:shadow-[0_12px_30px_rgba(255,148,30,0.15)]"
              >
                <div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-xs font-black text-primary-foreground shadow-glow mb-5">
                    {card.num}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FFB03A] transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-xs text-[#D5DAE7]/90">
                  {card.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF941E]" />
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
      {/* SECTION 02 - 05: TECHNICAL DEEP DIVE (SPEED, SEO, CRO, SECURITY)     */}
      {/* ==================================================================== */}
      <section className="relative py-20 bg-black/20 border-t border-white/5">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
                CORE TECHNICAL COMPETENCIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Engineering Integrity Behind Every Single Click
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/85 leading-relaxed">
                A digital presence is more than visual decoration. It is your most active 24/7 sales representative. Here is how our technical standards protect your brand reputation and drive consistent commercial inquiries.
              </p>
              <div className="mt-8 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                <p className="text-xs font-bold text-[#FFD84A] uppercase tracking-wider mb-2">
                  OUR GUARANTEE
                </p>
                <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">
                  Every website delivered by Social Waale is custom engineered in type-safe React/TypeScript with zero bloated third-party page builder dependencies.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {/* Pillar 1: Front-End & Speed */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all hover:border-[#FF941E]/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FF941E]/15 text-[#FF941E]">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Front-End Engineering & Website Performance
                  </h3>
                </div>
                <p className="mt-4 text-sm text-[#D5DAE7]/85 leading-relaxed">
                  Over 75% of Indian web traffic arrives through mobile connections. We develop responsive, mobile-first layouts that render cleanly on all screen sizes. By minimizing DOM size, compressing assets with modern WebP transcoding, and utilizing static page caching, your pages achieve near-instant initial render times.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    Mobile-First Ergonomics
                  </span>
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    WebP Image Pipelines
                  </span>
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    Sub-2s LCP Load Speeds
                  </span>
                </div>
              </div>

              {/* Pillar 2: SEO & AI Search */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all hover:border-[#FF941E]/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FF941E]/15 text-[#FF941E]">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Advanced Technical SEO, Semantic HTML & AI Search
                  </h3>
                </div>
                <p className="mt-4 text-sm text-[#D5DAE7]/85 leading-relaxed">
                  Search engines favor well-structured code. We implement rich Schema.org JSON-LD microdata, clean semantic HTML5 headings (H1–H4), structured URL taxonomy, and topical content clustering. Our content architecture is explicitly formatted so generative AI engines like ChatGPT, Perplexity, and Google AI Overviews cite your business as an authoritative source.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    JSON-LD Schema Hierarchy
                  </span>
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    Topical Search Mapping
                  </span>
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    AI Answer Optimization
                  </span>
                </div>
              </div>

              {/* Pillar 3: CRO & UX */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all hover:border-[#FF941E]/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FF941E]/15 text-[#FF941E]">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Conversion Rate Optimization & User-Centric Design
                  </h3>
                </div>
                <p className="mt-4 text-sm text-[#D5DAE7]/85 leading-relaxed">
                  Traffic without conversions is a waste of marketing budget. We engineer conversion-focused layouts with high-visibility call-to-actions, lightweight forms, sticky mobile action bars, and direct 1-click WhatsApp buttons that reduce friction and capture high-intent inquiries the instant a prospect is interested.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    Direct WhatsApp Paths
                  </span>
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    Frictionless Form UX
                  </span>
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    Conversion Funnel Analytics
                  </span>
                </div>
              </div>

              {/* Pillar 4: Security & Reliability */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all hover:border-[#FF941E]/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FF941E]/15 text-[#FF941E]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Website Security, Reliability & Continuous Governance
                  </h3>
                </div>
                <p className="mt-4 text-sm text-[#D5DAE7]/85 leading-relaxed">
                  We harden your digital platform with end-to-end SSL/TLS certificates, input sanitization against cross-site scripting (XSS) and SQL injection, automated off-site cloud backups, and proactive uptime monitoring to ensure zero unexpected downtime for your business.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    256-Bit SSL Encryption
                  </span>
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    Automated Cloud Backups
                  </span>
                  <span className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[#FFD84A]">
                    99.9% Uptime Reliability
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 06: THREE DETAILED DELIVERABLES BLOCKS                       */}
      {/* ==================================================================== */}
      <section className="relative py-20 border-t border-white/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-2">
              COMPREHENSIVE DELIVERABLES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Deliverables Included in Every Social Waale Solution
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              When you partner with Social Waale, you receive an enterprise-grade digital asset designed for commercial durability.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Block 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-xl bg-gradient-brand flex items-center justify-center text-primary-foreground mb-6 shadow-glow">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Speed & Mobile Experience
              </h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/85 leading-relaxed mb-6">
                Engineered for sub-second page transitions, thumb-friendly navigation, and smooth responsive scaling across smartphones, tablets, laptops, and ultra-wide desktop monitors.
              </p>
              <ul className="space-y-2.5 text-xs text-[#D5DAE7]/90 border-t border-white/10 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF941E] shrink-0" />
                  <span>Sub-1.8s mobile LCP load times</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF941E] shrink-0" />
                  <span>Next-gen WebP image compression</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF941E] shrink-0" />
                  <span>Thumb-friendly sticky action bars</span>
                </li>
              </ul>
            </div>

            {/* Block 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-xl bg-gradient-brand flex items-center justify-center text-primary-foreground mb-6 shadow-glow">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Search & AI Visibility
              </h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/85 leading-relaxed mb-6">
                Architected to establish topical search authority across Chandigarh and target regional markets, with semantic schema markup for both traditional and generative AI search engines.
              </p>
              <ul className="space-y-2.5 text-xs text-[#D5DAE7]/90 border-t border-white/10 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF941E] shrink-0" />
                  <span>Schema.org JSON-LD microdata graph</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF941E] shrink-0" />
                  <span>Google Search Console indexing setup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF941E] shrink-0" />
                  <span>Entity-optimized AI answer formatting</span>
                </li>
              </ul>
            </div>

            {/* Block 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-xl bg-gradient-brand flex items-center justify-center text-primary-foreground mb-6 shadow-glow">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Security & Reliability
              </h3>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/85 leading-relaxed mb-6">
                Protected with high-grade SSL/TLS certificates, input verification, automated backups, and 100% intellectual property and source code handover upon project launch.
              </p>
              <ul className="space-y-2.5 text-xs text-[#D5DAE7]/90 border-t border-white/10 pt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF941E] shrink-0" />
                  <span>Automated off-site cloud backups</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF941E] shrink-0" />
                  <span>100% source code and Git repository transfer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF941E] shrink-0" />
                  <span>Post-launch warranty and technical handover</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 07 & 09: OUR STRUCTURED 4-STAGE DIGITAL ENGINEERING LIFECYCLE*/}
      {/* (MATCHING REFERENCE IMAGES 2 & 3)                                    */}
      {/* ==================================================================== */}
      <section className="relative py-20 lg:py-28 bg-black/25 border-t border-white/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              PROVEN DELIVERY METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Our Structured 4-Stage Digital Growth Lifecycle
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/85 leading-relaxed">
              Successful launches shape how we build. We combine design thinking, modern web frameworks, and data-backed search strategies to ensure your investment drives measurable commercial returns.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {LIFECYCLE_STAGES.map((stg) => (
              <div
                key={stg.badge}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-8 backdrop-blur-sm transition-all hover:border-[#FF941E]/40"
              >
                <span className="inline-block text-[11px] font-extrabold tracking-wider text-[#FF941E] uppercase mb-2">
                  {stg.badge}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">
                  {stg.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#D5DAE7]/85 leading-relaxed mb-6">
                  {stg.description}
                </p>
                <div className="border-t border-white/10 pt-5 space-y-2">
                  {stg.deliverables.map((del) => (
                    <div key={del} className="flex items-start gap-2.5 text-xs text-[#D5DAE7]/90">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD84A]" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 10: INDUSTRY-SPECIFIC DIGITAL GROWTH SOLUTIONS                */}
      {/* (MATCHING REFERENCE IMAGE 4)                                         */}
      {/* ==================================================================== */}
      <section className="relative py-20 lg:py-28 border-t border-white/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              LOCAL & REGIONAL COMMERCIAL ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Enterprise Digital Engineering Standards Across Key Industries
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/85 leading-relaxed">
              As North India's commercial corridors expand across Chandigarh, Punjab, Himachal Pradesh, Haryana, and NCR, corporate digital requirements have grown increasingly sophisticated. We engineer industry-specific web architectures designed for rapid customer conversions:
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {INDUSTRY_SOLUTIONS.map((ind) => (
              <div
                key={ind.sector}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all hover:border-[#FF941E]/40"
              >
                <span className="inline-block text-[11px] font-extrabold tracking-wider text-[#FF941E] uppercase mb-1.5">
                  {ind.sector}
                </span>
                <h3 className="text-lg font-bold text-white mb-2.5">
                  {ind.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                  {ind.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 11 & 12: WHY BUSINESSES PARTNER WITH SOCIAL WAALE            */}
      {/* (MATCHING REFERENCE IMAGE 5 & 6)                                     */}
      {/* ==================================================================== */}
      <section className="relative py-20 lg:py-28 bg-black/20 border-t border-white/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              PARTNERSHIP GUARANTEE & RESULTS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Why Businesses Partner with Social Waale
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/85 leading-relaxed">
              We have built trusted partnerships with emerging startups, clinical networks, manufacturers, retail brands, and service leaders across North India. Here is how we ensure your project succeeds:
            </p>
          </div>

          {/* 6 Reasons Cards (Reference Image 5) */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMITMENTS.map((com, i) => (
              <div
                key={com.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all hover:border-[#FF941E]/40"
              >
                <h3 className="text-lg font-bold text-white mb-2.5">
                  <span className="text-[#FF941E] mr-2">{i + 1}.</span>
                  {com.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#D5DAE7]/80 leading-relaxed">
                  {com.text}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Trust Highlights Card (Reference Image 6) */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-7 sm:p-9 backdrop-blur-md">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Building High-Converting Digital Platforms for Growing Businesses
            </h3>
            <p className="text-xs sm:text-sm text-[#D5DAE7]/85 leading-relaxed mb-8 max-w-4xl">
              North India is one of the most vibrant commercial landscapes in South Asia. Whether you run a healthcare facility in Chandigarh, an e-commerce boutique in Ludhiana, or an adventure tourism platform in Shimla, your business needs a digital presence that commands immediate credibility. At Social Waale, our websites turn casual visitors into qualified phone inquiries, WhatsApp chats, and confirmed orders.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4 text-center sm:text-left">
                <p className="text-lg font-extrabold text-[#FFD84A]">50+ Clients Scaled</p>
                <p className="text-xs text-[#D5DAE7]/70 mt-1">
                  Trusted agency partner serving brands across North India.
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4 text-center sm:text-left">
                <p className="text-lg font-extrabold text-[#FFD84A]">90+ Lighthouse Architecture</p>
                <p className="text-xs text-[#D5DAE7]/70 mt-1">
                  Sub-second mobile speeds optimized for Google Core Web Vitals.
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4 text-center sm:text-left">
                <p className="text-lg font-extrabold text-[#FFD84A]">100% Code Ownership</p>
                <p className="text-xs text-[#D5DAE7]/70 mt-1">
                  Complete source code and intellectual property transferred upon launch.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 13: BUILDING DIGITAL BRANDS ACROSS NORTH INDIA               */}
      {/* ==================================================================== */}
      <section className="relative py-20 border-t border-white/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              REGIONAL COVERAGE & MARKET AUTHORITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Building Digital Brands Across North India
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              We understand the cultural, linguistic, and commercial nuances of local customer behavior across northern Indian markets.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONAL_COVERAGE.map((reg) => (
              <div
                key={reg.region}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all hover:border-[#FF941E]/40"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <MapPin className="h-4 w-4 text-[#FF941E]" />
                  <h3 className="text-lg font-bold text-white">{reg.region}</h3>
                </div>
                <p className="text-[11px] font-semibold text-[#FFD84A] mb-3">{reg.sub}</p>
                <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">{reg.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 14: WHY MODERN WEB ENGINEERING MATTERS (REF IMAGE 7)        */}
      {/* ==================================================================== */}
      <section className="relative py-20 bg-black/20 border-t border-white/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              DIGITAL GROWTH GUIDE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Modern Web Engineering Matters for North Indian Businesses
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              A business website is more than an online brochure. It is your most active sales tool. Here is how modern web standards help you win more clients:
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="text-base font-bold text-white mb-2">
                1. Sub-Second Speed
              </h3>
              <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">
                Fast pages rank higher on Google search results. Visitors stay longer when pages open without delay. Every split second saved improves lead conversions.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="text-base font-bold text-white mb-2">
                2. Mobile-First Layouts
              </h3>
              <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">
                Over 75% of North Indian web traffic comes from mobile devices. We design clean mobile layouts first. Text stays sharp, and buttons are easy to tap.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="text-base font-bold text-white mb-2">
                3. High-Converting Forms
              </h3>
              <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">
                Complex forms lose sales. We use simple input fields and direct WhatsApp chat links. Inquiries reach your sales team right away without drop-offs.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="text-base font-bold text-white mb-2">
                4. Enterprise Security
              </h3>
              <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">
                We protect your web assets with HTTPS encryption and safe code patterns. Your customer data remains private and secure around the clock.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 15: DIGITAL PERFORMANCE & QUALITY BENCHMARKS (REF IMAGE 8)   */}
      {/* ==================================================================== */}
      <section className="relative py-20 border-t border-white/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              TECHNICAL QUALITY ASSURANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Key Benchmarks We Target on Every Web Project
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              We test every build using Google Lighthouse and Core Web Vitals before launch. Here are the quality standards we maintain for our clients:
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENCHMARKS.map((bm) => (
              <div
                key={bm.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <span className="inline-block text-[10px] font-extrabold tracking-wider text-[#FFD84A] uppercase mb-1">
                  {bm.badge}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{bm.title}</h3>
                <p className="text-xs text-[#D5DAE7]/80 leading-relaxed">{bm.target}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 16: ADVANCED DIGITAL ARCHITECTURE & GROWTH FRAMEWORK         */}
      {/* ==================================================================== */}
      <section className="relative py-20 bg-black/25 border-t border-white/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              ARCHITECTURAL FOUNDATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Advanced Digital Architecture & Growth Framework
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              Four pillars engineered into every custom solution for long-term technical resilience.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex items-center gap-3 mb-3">
                <Code2 className="h-5 w-5 text-[#FF941E]" />
                <h3 className="text-lg font-bold text-white">Modern Component-Driven Architecture</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/85 leading-relaxed">
                By decoupling the presentation layer with modern React and TypeScript, our solutions prevent legacy code rot. Interfaces are broken down into reusable design tokens and UI components, making future updates seamless and cost-effective.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex items-center gap-3 mb-3">
                <Cpu className="h-5 w-5 text-[#FF941E]" />
                <h3 className="text-lg font-bold text-white">Core Web Vitals & Rendering Pipeline</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/85 leading-relaxed">
                We optimize the critical rendering path: critical CSS is inlined, non-essential scripts are deferred, fonts are preloaded, and images utilize responsive source sets to eliminate layout shift and ensure snappy user feedback.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-[#FF941E]" />
                <h3 className="text-lg font-bold text-white">Multi-Channel Conversion Funnel Strategy</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/85 leading-relaxed">
                We combine organic search traffic, paid Meta/Google advertising, and social proof into a unified customer journey. Visitors are greeted with compelling value propositions and frictionless lead capture channels.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="h-5 w-5 text-[#FF941E]" />
                <h3 className="text-lg font-bold text-white">Technical SEO & AI Search Indexing</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#D5DAE7]/85 leading-relaxed">
                Complete Schema.org JSON-LD microdata, XML sitemaps, canonical tags, and structured semantic hierarchies ensure both traditional Google crawlers and next-generation AI answer engines cite your business with accuracy.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 17: FREQUENTLY ASKED TECHNICAL & OPERATIONAL QUESTIONS       */}
      {/* (MATCHING REFERENCE IMAGE 9 & 10)                                    */}
      {/* ==================================================================== */}
      <section id="technical-faqs" className="relative py-20 lg:py-28 border-t border-white/5">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              FREQUENTLY ASKED TECHNICAL & OPERATIONAL QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Frequently Asked Questions About Digital Marketing & Web Development
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D5DAE7]/80">
              Clear, transparent answers about our engineering methodology, pricing, timelines, technology stack, and ongoing growth support.
            </p>
          </div>

          {/* Premium 2-Column Accordion Grid */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
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
                    className="flex w-full items-start justify-between gap-4 p-6 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-white leading-snug">
                      {item.q}
                    </span>
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[#FFD84A] transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-[#FF941E] text-white" : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#D5DAE7]/90 leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 18: FINAL CALL TO ACTION (CTA)                               */}
      {/* ==================================================================== */}
      <section className="relative py-20 lg:py-24 border-t border-white/10 bg-gradient-to-b from-transparent via-[#0E1B5A]/60 to-[#080F35]">
        <div
          className="pointer-events-none absolute inset-0 bg-radial-gradient opacity-20"
          aria-hidden="true"
        />
        <Container>
          <div className="relative rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-12 lg:p-16 text-center backdrop-blur-md shadow-2xl max-w-4xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FF941E] uppercase mb-3">
              START YOUR PROJECT TODAY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Ready to Grow Your Business with{" "}
              <span className="text-gradient">Social Waale?</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-[#D5DAE7]/90 leading-relaxed max-w-2xl mx-auto">
              Let's build a stronger digital presence for your brand with the right strategy, creativity and technology.
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
    </div>
  );
}
