import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type {
  AdminUser,
  CMSArticle,
  CMSCategory,
  CMSTag,
  CMSAuthor,
  CMSMediaItem,
  CMSRedirect,
  CMSSiteSettings,
  CMSStoreState,
  CMSService,
  CMSHomepage,
  CMSHomepageData,
  CMSHomepageRevision,
  CMSDownloaderPage,
  CMSDownloaderSettings,
  CMSDownloaderLog,
  CMSDownloaderStats,
  CMSDownloaderRevision,
  CMSLead,
  CMSLeadNote,
  CMSLeadStats,
  LeadStatus,
  FormType,
} from "./types";
import { articles as initialArticles } from "@/data/articles";
import { services as initialServices } from "@/data/services";
import { DEFAULT_DOWNLOADER_PAGES } from "../downloader/seo-data";

// Strong cryptographic password hashing using memory-hard scrypt algorithm
export function hashPasswordSecure(password: string, existingSalt?: string): string {
  const salt = existingSalt || crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

// Invalidate legacy compromised passwords and verify scrypt hashes
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !password) return false;

  // The compromised legacy password hash is strictly rejected
  const COMPROMISED_LEGACY_HASH = "1bc69e97dec53db7814d4b5f7c41a1981a45445e3b2aef0195b22d01ac105258";
  if (storedHash === COMPROMISED_LEGACY_HASH) {
    return false;
  }

  if (storedHash.startsWith("scrypt:")) {
    const parts = storedHash.split(":");
    if (parts.length !== 3) return false;
    const [, salt, derived] = parts;
    if (!salt || !derived) return false;
    try {
      const testDerived = crypto.scryptSync(password, salt, 64).toString("hex");
      return crypto.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(testDerived, "hex"));
    } catch {
      return false;
    }
  }

  return false;
}

// Legacy helper for backwards compatibility
export function hashPassword(password: string): string {
  return hashPasswordSecure(password);
}

export function generateToken(payload: { id: string; email: string; role: string; name?: string }): string {
  const secret = process.env["SESSION_SECRET"] || "social-waale-cms-super-secret-key-2026";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${claims}`)
    .digest("base64url");
  return `${header}.${claims}.${signature}`;
}

export function verifyToken(
  token: string,
): { id: string; email: string; role: string; name: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, claims, signature] = parts;
    if (!header || !claims || !signature) return null;
    const secret = process.env["SESSION_SECRET"] || "social-waale-cms-super-secret-key-2026";
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${header}.${claims}`)
      .digest("base64url");
    if (signature !== expected) return null;
    const data = JSON.parse(Buffer.from(claims, "base64url").toString("utf8"));
    if (data.exp && Date.now() > data.exp) return null;
    return { id: data.id, email: data.email, role: data.role, name: (data.name as string) || (data.email as string) };
  } catch {
    return null;
  }
}

// Initial Seeding
const DEFAULT_CATEGORIES: CMSCategory[] = [
  {
    id: "cat-1",
    slug: "seo",
    name: "SEO & Organic Growth",
    description: "Search engine optimization, keyword mapping, technical audits, and local map pack dominance.",
    seoTitle: "SEO & Organic Growth Guides | Social Waale",
    metaDescription: "Read the latest SEO strategies and guides for ranking higher on Google.",
  },
  {
    id: "cat-2",
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    description: "Instagram, Facebook, LinkedIn, short-form video hooks, and organic audience engagement.",
    seoTitle: "Social Media Marketing Strategies | Social Waale",
    metaDescription: "Build a converting social media audience with practical frameworks.",
  },
  {
    id: "cat-3",
    slug: "google-ads",
    name: "Meta Ads & Google Ads",
    description: "Performance marketing, conversion API, lead generation funnels, and ROAS optimization.",
    seoTitle: "Paid Ads & Performance Marketing | Social Waale",
    metaDescription: "Actionable pay-per-click and paid social advertising strategies.",
  },
  {
    id: "cat-4",
    slug: "website-development",
    name: "Website Development",
    description: "High-performance web architecture, mobile UX, speed audits, and conversion rate optimization.",
    seoTitle: "Website Development & CRO Insights | Social Waale",
    metaDescription: "Learn how to build conversion-focused websites that retain visitors.",
  },
  {
    id: "cat-5",
    slug: "branding",
    name: "Branding & Creative Strategy",
    description: "Visual identity design, brand positioning, messaging, and emotional customer loyalty.",
    seoTitle: "Branding & Creative Strategy | Social Waale",
    metaDescription: "Establish a distinctive brand presence in competitive North Indian markets.",
  },
  {
    id: "cat-6",
    slug: "content-marketing",
    name: "Content Marketing",
    description: "Topical clustering, video storytelling, YouTube strategy, and editorial planning.",
    seoTitle: "Content Marketing Playbooks | Social Waale",
    metaDescription: "Turn content into a sustainable lead generation asset.",
  },
  {
    id: "cat-7",
    slug: "digital-marketing",
    name: "Digital Growth",
    description: "Holistic marketing execution, multi-channel ecosystems, and agency selection advice.",
    seoTitle: "Digital Growth & Agency Insights | Social Waale",
    metaDescription: "Comprehensive marketing perspectives for founders and business owners.",
  },
];

const DEFAULT_TAGS: CMSTag[] = [
  { id: "tag-1", slug: "seo-tips", name: "SEO Tips" },
  { id: "tag-2", slug: "google-ads", name: "Google Ads" },
  { id: "tag-3", slug: "meta-ads", name: "Meta Ads" },
  { id: "tag-4", slug: "instagram-growth", name: "Instagram Growth" },
  { id: "tag-5", slug: "local-business", name: "Local Business" },
  { id: "tag-6", slug: "chandigarh", name: "Chandigarh" },
  { id: "tag-7", slug: "conversion-rate", name: "Conversion Rate" },
  { id: "tag-8", slug: "branding", name: "Branding" },
  { id: "tag-9", slug: "content-strategy", name: "Content Strategy" },
  { id: "tag-10", slug: "lead-generation", name: "Lead Generation" },
];

const DEFAULT_AUTHORS: CMSAuthor[] = [
  {
    id: "author-1",
    slug: "social-waale-team",
    name: "Social Waale Team",
    designation: "Digital Growth & Strategy Team",
    bio: "Our multidisciplinary team of SEO specialists, performance media buyers, copywriters, and web engineers based in Chandigarh.",
    avatarUrl: "/favicon.png",
    socialLinks: {
      instagram: "https://www.instagram.com/socialwaale",
      linkedin: "https://www.linkedin.com/company/socialwaale",
    },
  },
  {
    id: "author-2",
    slug: "growth-editor",
    name: "Senior Growth Editor",
    designation: "Head of Editorial & Content Strategy",
    bio: "Passionate about research-backed digital marketing tactics, commercial conversion psychology, and search engine algorithms.",
    avatarUrl: "/favicon.png",
  },
];

const DEFAULT_SETTINGS: CMSSiteSettings = {
  siteName: "Social Waale",
  siteDescription: "Digital Marketing Agency in Chandigarh serving ambitious brands across North India.",
  enableXmlSitemap: true,
  enableRssFeed: true,
  customRobotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://socialwaale.com/sitemap.xml",
};

// Default Admin user with secure memory-hard scrypt hash
const DEFAULT_ADMIN: AdminUser = {
  id: "admin-1",
  email: "admin@socialwaale.com",
  name: "Social Waale Administrator",
  role: "admin",
  passwordHash: "scrypt:727ddba141660263a92dfdef2160a40e:41015bfbc3fd5f6ff7da1671e6204e9d690f3321355985fbf8b98efef5d816260dacea3d614aafdacd3b7b9dee476904d5eb4b804dd0da92a9119ae42de02486",
  createdAt: new Date().toISOString(),
};

const DEFAULT_EDITOR: AdminUser = {
  id: "editor-1",
  email: "editor@socialwaale.com",
  name: "Content Editor",
  role: "editor",
  passwordHash: "scrypt:7507f07c5f7bf8b0d94ffeda543612a3:d5b48e2add649294322d147b7b0cd6f935c0ab8e7332629b33eac528b081292060b40d155d42ad16d5262e207e0dc3fdc9382a98c290c9f8efd2afded7a49080",
  createdAt: new Date().toISOString(),
};

function seedInitialArticles(): CMSArticle[] {
  return initialArticles.map((art, idx) => {
    // Generate clean HTML from sections
    const contentHtml = art.sections
      .map((s) => {
        const blocksHtml = s.blocks
          .map((b) => {
            if (b.type === "p") return `<p>${b.text}</p>`;
            if (b.type === "h3") return `<h3>${b.text}</h3>`;
            if (b.type === "ul")
              return `<ul>${b.items.map((it) => `<li>${it}</li>`).join("")}</ul>`;
            if (b.type === "ol")
              return `<ol>${b.items.map((it) => `<li>${it}</li>`).join("")}</ol>`;
            if (b.type === "callout")
              return `<blockquote class="callout"><p>${b.text}</p></blockquote>`;
            return "";
          })
          .join("\n");
        return `<section id="${s.id}"><h2>${s.heading}</h2>\n${blocksHtml}</section>`;
      })
      .join("\n\n");

    return {
      id: `art-${idx + 1}`,
      slug: art.slug,
      title: art.title,
      excerpt: art.excerpt,
      contentHtml,
      featuredImage: `/src/assets/${art.category === "seo" ? "blog-seo.jpg" : art.category === "social-media-marketing" ? "blog-social.jpg" : art.category === "google-ads" ? "blog-ads.jpg" : art.category === "website-development" ? "blog-website.jpg" : art.category === "branding" ? "blog-branding.jpg" : art.category === "content-marketing" ? "blog-content.jpg" : "blog-digital.jpg"}`,
      featuredImageAlt: art.imageAlt,
      category: art.category,
      tags: ["seo-tips", "local-business"],
      authorId: "author-1",
      authorName: art.author,
      status: "published",
      publishedAt: art.publishedAt,
      updatedAt: art.updatedAt || art.publishedAt,
      readingMinutes: art.readingMinutes,
      isFeatured: idx === 0,
      isSticky: false,
      allowComments: false,
      allowSharing: true,
      views: 120 + idx * 35,
      seo: {
        title: art.metaTitle || art.title,
        metaDescription: art.metaDescription || art.excerpt,
        focusKeyword: art.title.split(" ").slice(0, 3).join(" "),
        secondaryKeywords: ["digital marketing", "chandigarh", "agency"],
        robots: "index,follow",
        twitterCard: "summary_large_image",
        seoScore: 92,
      },
      faqs: art.faqs || [],
      relatedArticleIds: [],
      relatedServices: art.relatedServices || [],
    };
  });
}

const ICON_NAME_MAP: Record<string, string> = {
  "seo-services": "Search",
  "google-ads-performance-marketing": "Target",
  "social-media-marketing": "Share2",
  "content-marketing-email-automation": "Mail",
  "branding-creative-strategy": "Palette",
  "website-app-development": "Code2",
  "ui-ux-cro-optimization": "MousePointerClick",
  "offline-local-advertising": "Megaphone",
  "public-relations": "Newspaper",
  "photoshoot-creative-media": "Camera",
};

export function seedInitialServices(): CMSService[] {
  return initialServices.map((s, idx) => ({
    id: `srv-${s.slug}`,
    slug: s.slug,
    name: s.name,
    shortName: s.shortName,
    tagline: s.tagline,
    heroEyebrow: s.heroEyebrow,
    h1: s.h1,
    heroIntro: s.heroIntro,
    metaTitle: s.metaTitle,
    metaDescription: s.metaDescription,
    focusKeyword: s.name,
    secondaryKeywords: ["digital marketing", "chandigarh", s.shortName],
    canonicalUrl: `https://socialwaale.com/${s.slug}`,
    robots: "index,follow",
    ogTitle: s.metaTitle,
    ogDescription: s.metaDescription,
    iconName: ICON_NAME_MAP[s.slug] || "Sparkles",
    category: "digital-marketing",
    displayOrder: idx + 1,
    status: "published",
    problems: s.problems,
    deliverables: s.deliverables,
    benefits: s.benefits,
    process: s.process,
    whyUs: s.whyUs,
    whoNeeds: s.whoNeeds,
    faqs: s.faqs,
    relatedSlugs: s.related,
    updatedAt: new Date().toISOString(),
  }));
}

export function seedInitialHomepage(): CMSHomepage {
  const liveData: CMSHomepageData = {
    hero: {
      enabled: true,
      eyebrowBadge: "CHANDIGARH-BASED DIGITAL MARKETING AGENCY",
      h1: "Digital Marketing Agency in Chandigarh That Turns Brands Into Growth Stories.",
      subheading: "Strategic Growth • Measurable Enquiries • North India Focus",
      description1:
        "Looking for a reliable digital marketing agency in Chandigarh? Social Waale helps businesses across Chandigarh, Punjab, Himachal Pradesh, Haryana and beyond build a stronger online presence through SEO, social media marketing, Google Ads, creative branding and digital growth solutions.",
      description2:
        "From building brand awareness to attracting relevant audiences and generating meaningful enquiries, we combine strategy, creativity and technology to move your business forward.",
      primaryCtaText: "Request a Free Quote",
      primaryCtaLink: "/contact",
      secondaryCtaText: "+91 9805789363",
      secondaryCtaLink: "tel:+919805789363",
      desktopBannerImage: "/src/assets/hero-growth.jpg",
      mobileBannerImage: "/src/assets/hero-growth.jpg",
      imageAlt: "Social Waale digital marketing agency growth strategies",
      stats: [
        { value: "50+", label: "Clients Served" },
        { value: "10", label: "Growth Services" },
        { value: "1–2 Years", label: "Experience" },
        { value: "Pan India", label: "Service Reach" },
      ],
      floatingCardTitle: "Sustainable Growth",
      floatingCardSubtitle: "Strategic execution for North Indian businesses",
      floatingBadgeText: "Your Digital Growth Partner",
      slides: [],
    },
    trustBar: {
      enabled: true,
      eyebrowBadge: "✦ TRUSTED BY BUSINESSES ACROSS NORTH INDIA",
      heading: "Trusted by Ambitious Brands & Growing Businesses",
      description:
        "From emerging startups to established businesses, Social Waale helps brands build stronger digital identities and meaningful online connections.",
      stats: [
        { value: "50+", title: "Clients Served", description: "Across diverse North India businesses" },
        { value: "10", title: "Digital Marketing Services", description: "Full-funnel digital growth solutions" },
        { value: "1–2 Years", title: "Agency Experience", description: "Focused & transparent execution" },
        { value: "Pan India", title: "Service Reach", description: "Himachal, Punjab, Haryana & beyond" },
      ],
    },
    about: {
      enabled: true,
      eyebrowBadge: "About Social Waale",
      heading: "A Chandigarh agency built for ambitious brands",
      descriptionParagraphs: [
        "Social Waale is a digital marketing and social media marketing agency based in Chandigarh. In our first years we’ve worked with 50+ businesses — from local shops and clinics to growing service brands — helping them show up online with confidence and turn attention into real conversations.",
      ],
      featuredImage: "/src/assets/about-studio.jpg",
      imageAlt:
        "Social Waale creative workspace with analytics dashboard, social media feed and brand mood boards",
      readMoreButtonText: "More about us",
      readMoreButtonLink: "/about",
      highlights: [
        "Strategy first — every campaign starts with your business goals",
        "One team for social, search, ads, design and web",
        "Clear reporting you can actually understand",
        "Local understanding of North Indian audiences",
      ],
    },
    services: {
      enabled: true,
      eyebrowBadge: "What we do",
      heading: "10 services. One growth partner.",
      description:
        "From the first impression on Instagram to the final click on your website, we cover every stage of your customer’s digital journey.",
      mode: "all",
      selectedSlugs: [],
      ctaButtonText: "Talk to our team",
      ctaButtonLink: "/contact",
    },
    portfolio: {
      enabled: true,
      heading: "Our Portfolio & Creative Showcases",
      description: "Real campaigns delivered for North Indian businesses across social, web, and search.",
    },
    whyChoose: {
      enabled: true,
      eyebrowBadge: "Why Social Waale",
      heading: "Why businesses choose Social Waale",
      description:
        "We’re a young, hands-on agency — which means you get senior attention, quick decisions and a team that genuinely cares about your growth.",
      items: [
        {
          title: "Strategy before posting",
          description:
            "We understand your business, customers and competitors before creating a single post or ad, so every rupee has a purpose.",
          iconName: "Compass",
        },
        {
          title: "A team that knows North India",
          description:
            "Festivals, languages, local buying habits — we plan campaigns that feel native to audiences in Punjab, Himachal, Haryana and beyond.",
          iconName: "Users",
        },
        {
          title: "Creative that stops the scroll",
          description:
            "Design, reels, copy and photography produced in-house, crafted to match your brand and built to earn attention.",
          iconName: "Lightbulb",
        },
        {
          title: "Honest, clear reporting",
          description:
            "Simple monthly reports focused on what matters — enquiries, reach and progress — without vanity metrics or jargon.",
          iconName: "BarChart3",
        },
        {
          title: "Transparent pricing",
          description:
            "Clear scope and fees in writing. Your ad budget stays in your own ad accounts, fully visible to you.",
          iconName: "ShieldCheck",
        },
        {
          title: "Direct, responsive support",
          description:
            "Talk directly to the people working on your account over WhatsApp or call — no ticket queues, no runaround.",
          iconName: "HeartHandshake",
        },
      ],
    },
    process: {
      enabled: true,
      eyebrowBadge: "How we work",
      heading: "Our 6-Step Growth Process",
      description: "A structured, transparent methodology designed to convert visitors into loyal clients.",
      steps: [
        { step: "01", title: "Understand", description: "We learn about your business, audience, industry, competitors, and objectives.", iconName: "Search" },
        { step: "02", title: "Strategize", description: "We identify opportunities and develop a marketing strategy around your growth goals.", iconName: "Target" },
        { step: "03", title: "Create", description: "We develop content, campaigns, creatives, websites, and other required marketing assets.", iconName: "Palette" },
        { step: "04", title: "Execute", description: "We launch and manage campaigns across social, search, and digital channels with tight quality control.", iconName: "Rocket" },
        { step: "05", title: "Analyze", description: "We track performance metrics, conversion signals, and audience behavior to measure real ROI.", iconName: "LineChart" },
        { step: "06", title: "Scale", description: "We double down on the highest-performing assets and scale campaigns systematically.", iconName: "TrendingUp" },
      ],
    },
    industries: {
      enabled: true,
      eyebrowBadge: "Industries we serve",
      heading: "Marketing that understands your industry",
      description: "Every industry has its own customers, seasons and buying journey. We adapt our approach to fit yours.",
    },
    testimonials: {
      enabled: true,
      eyebrowBadge: "Client testimonials",
      heading: "Real words from real clients",
      description:
        "We’ve had the privilege of working with 50+ businesses across North India. Read what they say about our strategy, execution, and communication.",
      items: [
        {
          id: "test-1",
          name: "Amit Sharma",
          designation: "Founder",
          company: "Tricity Healthcare",
          text: "Social Waale transformed our local patient enquiries in Mohali and Chandigarh. Their transparent weekly reporting and dedicated attention set them apart.",
          rating: 5,
          enabled: true,
        },
        {
          id: "test-2",
          name: "Simran Kaur",
          designation: "Marketing Director",
          company: "Punjab Agro Brands",
          text: "From creative reel production to targeted Meta ads, our return on ad spend improved significantly within 60 days.",
          rating: 5,
          enabled: true,
        },
        {
          id: "test-3",
          name: "Rohit Verma",
          designation: "Co-Founder",
          company: "Himachal Hospitality Group",
          text: "They understand the North Indian market better than any metropolitan agency we previously hired. Highly recommended.",
          rating: 5,
          enabled: true,
        },
      ],
    },
    locations: {
      enabled: true,
      eyebrowBadge: "Service locations",
      heading: "Based in Chandigarh. Growing brands across India.",
      description:
        "We work with clients remotely across North India and beyond, with the same dedicated team and transparent reporting wherever you are.",
    },
    articles: {
      enabled: true,
      eyebrowBadge: "Knowledge Base",
      heading: "Latest Marketing Insights & Practical Guides",
      description: "Clear, jargon-free guides on SEO, paid ads, and social media growth for Indian business owners.",
      mode: "auto",
    },
    faqs: {
      enabled: true,
      eyebrowBadge: "Got Questions?",
      heading: "Everything You Need to Know Before Getting Started",
      description: "Honest answers about costs, timelines, ad budgets, and how our team works with you.",
      items: [
        {
          q: "What does a digital marketing agency in Chandigarh like Social Waale do?",
          a: "We help businesses get discovered and generate enquiries online. That includes social media marketing, SEO, Google Ads, content, branding, websites and creative production — planned together so every channel supports the same business goal.",
          enabled: true,
        },
        {
          q: "Do you only work with businesses in Chandigarh?",
          a: "No. We’re based in Chandigarh and work with businesses across Himachal Pradesh, Punjab, Haryana, Uttar Pradesh, Delhi NCR and other parts of India. Most collaboration happens over calls, WhatsApp and shared reports, with in-person meetings possible in the tricity.",
          enabled: true,
        },
        {
          q: "How much do your digital marketing services cost?",
          a: "Pricing depends on the services, number of platforms, content volume and ad budget involved. After a free consultation we share a clear proposal with scope and fees, so you know exactly what you’re paying for before anything starts.",
          enabled: true,
        },
        {
          q: "How soon can I expect results from digital marketing?",
          a: "Paid campaigns can start bringing enquiries within days of launch, while SEO and organic social media build momentum over a few months. We set realistic expectations upfront and track progress with transparent monthly reporting.",
          enabled: true,
        },
        {
          q: "Is the ad budget included in your fees?",
          a: "Usually not. Ad spend is paid directly to platforms like Google or Meta, and our fee covers strategy, creatives, setup, optimisation and reporting. This keeps your ad money fully visible and under your control.",
          enabled: true,
        },
        {
          q: "Can you manage everything — social media, website and ads — together?",
          a: "Yes. Many clients prefer one team handling all channels so messaging stays consistent and nothing falls between agencies. You can also start with a single service and add more as you grow.",
          enabled: true,
        },
        {
          q: "How do we get started?",
          a: "Fill in the contact form, WhatsApp us or call +91 9805789363. We’ll schedule a short discovery call, understand your business and goals, and then recommend the services that make sense for you.",
          enabled: true,
        },
      ],
    },
    cta: {
      enabled: true,
      eyebrowBadge: "START TODAY",
      heading: "Ready to turn your online presence into a growth engine?",
      description:
        "Book a free 30-minute discovery call. We'll analyze your current digital presence and share an actionable growth roadmap with zero obligations.",
      primaryButtonText: "Book Free Consultation",
      primaryButtonLink: "/contact",
      secondaryButtonText: "WhatsApp +91 9805789363",
      secondaryButtonLink: "https://wa.me/919805789363",
    },
    seo: {
      metaTitle: "Digital Marketing Agency in Chandigarh | Social Waale",
      metaDescription:
        "Social Waale is a Chandigarh-based digital marketing agency for social media marketing, SEO, Google Ads, branding and websites across North India.",
      focusKeyword: "digital marketing agency in chandigarh",
      secondaryKeywords: ["social media marketing chandigarh", "seo services chandigarh", "google ads agency", "branding agency punjab"],
      canonicalUrl: "https://socialwaale.com/",
      robots: "index,follow",
      ogTitle: "Social Waale — Digital Marketing Agency in Chandigarh",
      ogDescription: "Digital marketing agency in Chandigarh helping ambitious brands grow through SEO, social media, ads, websites and branding.",
      ogImage: "/src/assets/hero-growth.jpg",
      ogImageAlt: "Social Waale Chandigarh Digital Marketing Team",
    },
    sectionOrder: [
      "hero",
      "trustBar",
      "about",
      "services",
      "portfolio",
      "whyChoose",
      "process",
      "industries",
      "featuredWork",
      "locations",
      "testimonials",
      "articles",
      "faqs",
      "cta",
      "longFormSeo",
    ],
  };

  return {
    id: "homepage-root",
    status: "published",
    updatedAt: new Date().toISOString(),
    live: liveData,
    revisions: [
      {
        id: `rev-initial`,
        timestamp: new Date().toISOString(),
        authorName: "System",
        note: "Initial base version from production site",
        data: liveData,
      },
    ],
  };
}

export function seedInitialLeads(): CMSLead[] {
  return [
    {
      id: "lead-101",
      fullName: "Vikram Malhotra",
      businessName: "Malhotra Enterprises",
      phone: "+91 98140 12345",
      email: "vikram@malhotraenterprises.com",
      service: "SEO & Organic Growth",
      budget: "₹30,000 – ₹60,000 / month",
      message: "We need comprehensive local and regional SEO for our B2B manufacturing firm in Mohali. Looking to dominate Google map pack and organic keywords.",
      sourceUrl: "/seo-services",
      formName: "Service Consultation Form - SEO & Organic Growth",
      formType: "service_inquiry",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "chandigarh_b2b_seo",
      referrer: "https://www.google.com/",
      status: "new",
      assignedTo: "Naman (Founder)",
      notes: [
        {
          id: "note-1",
          authorName: "System",
          authorEmail: "admin@socialwaale.com",
          text: "Enquiry received from Google Ads campaign. Priority B2B manufacturing lead.",
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        },
      ],
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: "lead-102",
      fullName: "Ananya Sharma",
      businessName: "Lumina Cafe & Roasters",
      phone: "+91 98765 43210",
      email: "ananya@luminacafe.in",
      service: "Social Media Marketing & Paid Campaigns",
      budget: "₹15,000 – ₹30,000 / month",
      message: "Looking for high-impact Instagram reels, influencer visits, and local Meta ads for our new cafe opening in Sector 26, Chandigarh.",
      sourceUrl: "/contact",
      formName: "Contact Us & Project Inquiry Form",
      formType: "contact",
      utmSource: "instagram",
      utmMedium: "social",
      utmCampaign: "brand_awareness",
      referrer: "https://www.instagram.com/",
      status: "contacted",
      assignedTo: "Sales Team",
      notes: [
        {
          id: "note-2",
          authorName: "Naman",
          authorEmail: "admin@socialwaale.com",
          text: "Contacted via WhatsApp, shared portfolio deck. Scheduled a cafe discovery visit for Wednesday.",
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        },
      ],
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: "lead-103",
      fullName: "Gurpreet Singh",
      businessName: "Punjab Agro Implements",
      phone: "+91 94172 88990",
      email: "gurpreet@punjabagro.com",
      service: "Google Ads & Performance Marketing",
      budget: "₹60,000+ / month",
      message: "Want to run Google Search ads across Punjab and Haryana for agricultural equipment before the sowing season.",
      sourceUrl: "/",
      formName: "Homepage Quick Enquiry & Quote Form",
      formType: "quote",
      status: "follow_up",
      assignedTo: "Growth Strategist",
      notes: [
        {
          id: "note-3",
          authorName: "Growth Strategist",
          authorEmail: "admin@socialwaale.com",
          text: "Discovery call completed. Budget approved for pilot run. Preparing keyword plan and forecast.",
          createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
        },
      ],
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 40).toISOString(),
    },
  ];
}

// In-Memory fallback cache
let memoryStore: CMSStoreState | null = null;

function isNodeEnv(): boolean {
  return typeof window === "undefined" && typeof process !== "undefined" && Boolean(process.versions?.node);
}

function getDataPaths(): { dataDir: string; storeFile: string } | null {
  if (!isNodeEnv()) return null;
  try {
    const cwd = typeof process.cwd === "function" ? process.cwd() : ".";
    const dataDir = path.resolve(cwd, "data");
    const storeFile = path.join(dataDir, "cms-store.json");
    return { dataDir, storeFile };
  } catch {
    return null;
  }
}

function ensureStoreFile(): CMSStoreState {
  if (memoryStore) {
    if (!memoryStore.services || memoryStore.services.length === 0) {
      memoryStore.services = seedInitialServices();
    }
    if (!memoryStore.homepage) {
      memoryStore.homepage = seedInitialHomepage();
    }
    if (!memoryStore.downloaderPages || memoryStore.downloaderPages.length === 0) {
      memoryStore.downloaderPages = DEFAULT_DOWNLOADER_PAGES;
    }
    return memoryStore;
  }

  const paths = getDataPaths();
  if (paths) {
    try {
      if (!fs.existsSync(paths.dataDir)) {
        fs.mkdirSync(paths.dataDir, { recursive: true });
      }

      if (fs.existsSync(paths.storeFile)) {
        const raw = fs.readFileSync(paths.storeFile, "utf8");
        const parsed = JSON.parse(raw) as CMSStoreState;
        let needsSave = false;
        if (!parsed.services || parsed.services.length === 0) {
          parsed.services = seedInitialServices();
          needsSave = true;
        }
        if (!parsed.homepage) {
          parsed.homepage = seedInitialHomepage();
          needsSave = true;
        }
        if (!parsed.downloaderPages || parsed.downloaderPages.length === 0) {
          parsed.downloaderPages = DEFAULT_DOWNLOADER_PAGES;
          needsSave = true;
        }
        if (!parsed.leads || parsed.leads.length === 0) {
          parsed.leads = seedInitialLeads();
          needsSave = true;
        }
        if (needsSave) {
          saveStore(parsed);
        }
        memoryStore = parsed;
        return memoryStore;
      }
    } catch (err) {
      console.warn("[CMS Store] File access warning, using in-memory store:", err);
    }
  }

  // Initialize fresh store
  const freshStore: CMSStoreState = {
    users: [DEFAULT_ADMIN, DEFAULT_EDITOR],
    articles: seedInitialArticles(),
    categories: DEFAULT_CATEGORIES,
    tags: DEFAULT_TAGS,
    authors: DEFAULT_AUTHORS,
    media: [
      {
        id: "media-1",
        filename: "blog-seo.jpg",
        url: "/src/assets/blog-seo.jpg",
        fileType: "image/jpeg",
        fileSize: 85730,
        altText: "SEO search rankings and organic visibility graph",
        title: "SEO Analytics Dashboard",
        uploadedAt: "2026-08-01T10:00:00Z",
      },
      {
        id: "media-2",
        filename: "blog-social.jpg",
        url: "/src/assets/blog-social.jpg",
        fileType: "image/jpeg",
        fileSize: 81010,
        altText: "Social media marketing on smartphone and laptop",
        title: "Social Media Campaign Visuals",
        uploadedAt: "2026-08-01T10:00:00Z",
      },
      {
        id: "media-3",
        filename: "blog-ads.jpg",
        url: "/src/assets/blog-ads.jpg",
        fileType: "image/jpeg",
        fileSize: 74070,
        altText: "Google Ads and Meta advertising performance metrics",
        title: "Paid Advertising Interface",
        uploadedAt: "2026-08-01T10:00:00Z",
      },
    ],
    redirects: [],
    settings: DEFAULT_SETTINGS,
    services: seedInitialServices(),
    homepage: seedInitialHomepage(),
    downloaderPages: DEFAULT_DOWNLOADER_PAGES,
    leads: seedInitialLeads(),
  };

  memoryStore = freshStore;
  if (paths) {
    try {
      fs.writeFileSync(paths.storeFile, JSON.stringify(freshStore, null, 2), "utf8");
    } catch (err) {
      console.warn("[CMS Store] Could not write seed file:", err);
    }
  }

  return memoryStore;
}

export function getStore(): CMSStoreState {
  return ensureStoreFile();
}

export function saveStore(store: CMSStoreState): void {
  memoryStore = store;
  const paths = getDataPaths();
  if (paths) {
    try {
      if (!fs.existsSync(paths.dataDir)) {
        fs.mkdirSync(paths.dataDir, { recursive: true });
      }
      fs.writeFileSync(paths.storeFile, JSON.stringify(store, null, 2), "utf8");
    } catch (err) {
      console.error("[CMS Store] Error writing store file:", err);
    }
  }
}

// ---------------------------------------------------------------------------
// ARTICLES CRUD
// ---------------------------------------------------------------------------

export function getAllArticles(includeUnpublished = false): CMSArticle[] {
  const store = getStore();
  if (includeUnpublished) {
    return [...store.articles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }
  const now = new Date().toISOString();
  return store.articles
    .filter((a) => a.status === "published" && a.publishedAt <= now)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticleById(id: string): CMSArticle | undefined {
  const store = getStore();
  return store.articles.find((a) => a.id === id);
}

export function getArticleBySlug(slug: string, includeUnpublished = false): CMSArticle | undefined {
  const store = getStore();
  const article = store.articles.find((a) => a.slug === slug);
  if (!article) return undefined;
  if (!includeUnpublished && article.status !== "published") return undefined;
  return article;
}

export function saveArticle(article: CMSArticle, user: { name: string }): CMSArticle {
  const store = getStore();
  const index = store.articles.findIndex((a) => a.id === article.id);

  const now = new Date().toISOString();
  const updatedArticle: CMSArticle = {
    ...article,
    updatedAt: now,
    revisions: [
      ...(article.revisions || []),
      {
        id: `rev-${Date.now()}`,
        timestamp: now,
        authorName: user.name,
        title: article.title,
        contentHtml: article.contentHtml,
      },
    ].slice(-10), // Keep last 10 revisions
  };

  if (index >= 0) {
    store.articles[index] = updatedArticle;
  } else {
    store.articles.unshift(updatedArticle);
  }

  saveStore(store);
  return updatedArticle;
}

export function deleteArticle(id: string): boolean {
  const store = getStore();
  const prevCount = store.articles.length;
  store.articles = store.articles.filter((a) => a.id !== id);
  if (store.articles.length !== prevCount) {
    saveStore(store);
    return true;
  }
  return false;
}

export function duplicateArticle(id: string): CMSArticle | null {
  const store = getStore();
  const original = store.articles.find((a) => a.id === id);
  if (!original) return null;

  const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
  const copy: CMSArticle = {
    ...original,
    id: `art-${Date.now()}`,
    slug: newSlug,
    title: `${original.title} (Copy)`,
    status: "draft",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    revisions: [],
  };

  store.articles.unshift(copy);
  saveStore(store);
  return copy;
}

export function bulkUpdateArticles(ids: string[], action: "publish" | "draft" | "delete" | "archive"): void {
  const store = getStore();
  if (action === "delete") {
    store.articles = store.articles.filter((a) => !ids.includes(a.id));
  } else {
    store.articles = store.articles.map((a) => {
      if (ids.includes(a.id)) {
        return {
          ...a,
          status: action === "publish" ? "published" : action === "draft" ? "draft" : "archived",
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    });
  }
  saveStore(store);
}

// ---------------------------------------------------------------------------
// CATEGORIES & TAGS
// ---------------------------------------------------------------------------

export function getAllCategories(): CMSCategory[] {
  return getStore().categories;
}

export function saveCategory(cat: CMSCategory): CMSCategory {
  const store = getStore();
  const index = store.categories.findIndex((c) => c.id === cat.id);
  if (index >= 0) {
    store.categories[index] = cat;
  } else {
    store.categories.push(cat);
  }
  saveStore(store);
  return cat;
}

export function deleteCategory(id: string): boolean {
  const store = getStore();
  const prev = store.categories.length;
  store.categories = store.categories.filter((c) => c.id !== id);
  if (store.categories.length !== prev) {
    saveStore(store);
    return true;
  }
  return false;
}

export function getAllTags(): CMSTag[] {
  return getStore().tags;
}

export function saveTag(tag: CMSTag): CMSTag {
  const store = getStore();
  const index = store.tags.findIndex((t) => t.id === tag.id);
  if (index >= 0) {
    store.tags[index] = tag;
  } else {
    store.tags.push(tag);
  }
  saveStore(store);
  return tag;
}

export function deleteTag(id: string): boolean {
  const store = getStore();
  const prev = store.tags.length;
  store.tags = store.tags.filter((t) => t.id !== id);
  if (store.tags.length !== prev) {
    saveStore(store);
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// AUTHORS
// ---------------------------------------------------------------------------

export function getAllAuthors(): CMSAuthor[] {
  return getStore().authors;
}

export function saveAuthor(author: CMSAuthor): CMSAuthor {
  const store = getStore();
  const index = store.authors.findIndex((a) => a.id === author.id);
  if (index >= 0) {
    store.authors[index] = author;
  } else {
    store.authors.push(author);
  }
  saveStore(store);
  return author;
}

export function deleteAuthor(id: string): boolean {
  const store = getStore();
  const prev = store.authors.length;
  store.authors = store.authors.filter((a) => a.id !== id);
  if (store.authors.length !== prev) {
    saveStore(store);
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// MEDIA LIBRARY
// ---------------------------------------------------------------------------

export function getAllMedia(): CMSMediaItem[] {
  return getStore().media;
}

export function saveMediaItem(item: CMSMediaItem): CMSMediaItem {
  const store = getStore();
  const index = store.media.findIndex((m) => m.id === item.id);
  if (index >= 0) {
    store.media[index] = item;
  } else {
    store.media.unshift(item);
  }
  saveStore(store);
  return item;
}

export function deleteMediaItem(id: string): boolean {
  const store = getStore();
  const prev = store.media.length;
  store.media = store.media.filter((m) => m.id !== id);
  if (store.media.length !== prev) {
    saveStore(store);
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// REDIRECTS & SETTINGS
// ---------------------------------------------------------------------------

export function getAllRedirects(): CMSRedirect[] {
  return getStore().redirects;
}

export function saveRedirect(redirect: CMSRedirect): CMSRedirect {
  const store = getStore();
  const index = store.redirects.findIndex((r) => r.id === redirect.id);
  if (index >= 0) {
    store.redirects[index] = redirect;
  } else {
    store.redirects.unshift(redirect);
  }
  saveStore(store);
  return redirect;
}

export function deleteRedirect(id: string): boolean {
  const store = getStore();
  const prev = store.redirects.length;
  store.redirects = store.redirects.filter((r) => r.id !== id);
  if (store.redirects.length !== prev) {
    saveStore(store);
    return true;
  }
  return false;
}

export function getSiteSettings(): CMSSiteSettings {
  return getStore().settings;
}

export function saveSiteSettings(settings: CMSSiteSettings): CMSSiteSettings {
  const store = getStore();
  store.settings = { ...store.settings, ...settings };
  saveStore(store);
  return store.settings;
}

// ---------------------------------------------------------------------------
// SERVICES CRUD
// ---------------------------------------------------------------------------

export function getAllCmsServices(includeUnpublished = false): CMSService[] {
  const store = getStore();
  let list = store.services || [];
  if (!includeUnpublished) {
    list = list.filter((s) => s.status === "published");
  }
  return [...list].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

export function getCmsServiceById(id: string): CMSService | undefined {
  const store = getStore();
  return (store.services || []).find((s) => s.id === id);
}

export function getCmsServiceBySlug(slug: string, includeUnpublished = false): CMSService | undefined {
  const store = getStore();
  const service = (store.services || []).find((s) => s.slug === slug);
  if (!service) return undefined;
  if (!includeUnpublished && service.status !== "published") return undefined;
  return service;
}

export function saveCmsService(service: CMSService): CMSService {
  const store = getStore();
  if (!store.services) store.services = seedInitialServices();
  const index = store.services.findIndex((s) => s.id === service.id);

  const updated: CMSService = {
    ...service,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    store.services[index] = updated;
  } else {
    store.services.push(updated);
  }

  saveStore(store);
  return updated;
}

export function deleteCmsService(id: string): boolean {
  const store = getStore();
  if (!store.services) return false;
  const prevCount = store.services.length;
  store.services = store.services.filter((s) => s.id !== id);
  if (store.services.length !== prevCount) {
    saveStore(store);
    return true;
  }
  return false;
}

export function toggleCmsServiceStatus(id: string): CMSService | null {
  const store = getStore();
  if (!store.services) return null;
  const s = store.services.find((x) => x.id === id);
  if (!s) return null;
  s.status = s.status === "published" ? "draft" : "published";
  s.updatedAt = new Date().toISOString();
  saveStore(store);
  return s;
}

export function reorderCmsServices(orderedIds: string[]): CMSService[] {
  const store = getStore();
  if (!store.services) return [];
  orderedIds.forEach((id, idx) => {
    const s = store.services.find((x) => x.id === id);
    if (s) {
      s.displayOrder = idx + 1;
    }
  });
  saveStore(store);
  return getAllCmsServices(true);
}

// ---------------------------------------------------------------------------
// HOMEPAGE CRUD & PUBLISHING
// ---------------------------------------------------------------------------

export function getCmsHomepage(includeDraft = false): CMSHomepage {
  const store = getStore();
  if (!store.homepage) {
    store.homepage = seedInitialHomepage();
    saveStore(store);
  }
  return store.homepage;
}

export function getPublicHomepage(): CMSHomepageData {
  const hp = getCmsHomepage(false);
  return hp.live;
}

export function saveCmsHomepageDraft(data: CMSHomepageData, authorName = "Admin"): CMSHomepage {
  const store = getStore();
  if (!store.homepage) {
    store.homepage = seedInitialHomepage();
  }
  store.homepage.draft = data;
  store.homepage.status = "draft";
  store.homepage.updatedAt = new Date().toISOString();
  saveStore(store);
  return store.homepage;
}

export function publishCmsHomepage(data: CMSHomepageData, authorName = "Admin", note = "Published updates"): CMSHomepage {
  const store = getStore();
  if (!store.homepage) {
    store.homepage = seedInitialHomepage();
  }
  const revision: CMSHomepageRevision = {
    id: `rev-${Date.now()}`,
    timestamp: new Date().toISOString(),
    authorName,
    note,
    data: store.homepage.live,
  };
  const revisions = [revision, ...(store.homepage.revisions || [])].slice(0, 20);

  store.homepage.live = data;
  delete store.homepage.draft;
  store.homepage.status = "published";
  store.homepage.updatedAt = new Date().toISOString();
  store.homepage.revisions = revisions;
  saveStore(store);
  return store.homepage;
}

export function restoreCmsHomepageRevision(revisionId: string, authorName = "Admin"): CMSHomepage {
  const store = getStore();
  if (!store.homepage) {
    store.homepage = seedInitialHomepage();
  }
  const targetRev = (store.homepage.revisions || []).find((r) => r.id === revisionId);
  if (!targetRev) {
    throw new Error("Revision not found");
  }

  const backupRev: CMSHomepageRevision = {
    id: `rev-${Date.now()}`,
    timestamp: new Date().toISOString(),
    authorName,
    note: `Before restoring revision from ${new Date(targetRev.timestamp).toLocaleString()}`,
    data: store.homepage.live,
  };

  store.homepage.live = targetRev.data;
  delete store.homepage.draft;
  store.homepage.status = "published";
  store.homepage.updatedAt = new Date().toISOString();
  store.homepage.revisions = [backupRev, ...(store.homepage.revisions || [])].slice(0, 20);
  saveStore(store);
  return store.homepage;
}

// ---------------------------------------------------------------------------
// DOWNLOADER PAGES
// ---------------------------------------------------------------------------

export function getAllDownloaderPages(includeDrafts = true): CMSDownloaderPage[] {
  const store = getStore();
  const pages = store.downloaderPages || DEFAULT_DOWNLOADER_PAGES;
  if (includeDrafts) return pages;
  return pages.filter((p) => p.status === "published");
}

export function getDownloaderPageBySlug(slug: string, includeDrafts = true): CMSDownloaderPage | undefined {
  const pages = getAllDownloaderPages(includeDrafts);
  return pages.find((p) => p.slug === slug);
}

export function saveDownloaderPage(pageData: Partial<CMSDownloaderPage> & { id?: string }): CMSDownloaderPage {
  const store = getStore();
  if (!store.downloaderPages) {
    store.downloaderPages = DEFAULT_DOWNLOADER_PAGES;
  }

  const existingIndex = pageData.id
    ? store.downloaderPages.findIndex((p) => p.id === pageData.id)
    : -1;

  if (existingIndex >= 0) {
    const updated: CMSDownloaderPage = {
      ...store.downloaderPages[existingIndex]!,
      ...pageData,
      updatedAt: new Date().toISOString(),
    };
    store.downloaderPages[existingIndex] = updated;
    saveStore(store);
    return updated;
  } else {
    const newPage: CMSDownloaderPage = {
      id: pageData.id || `tool-${Date.now()}`,
      slug: pageData.slug || `instagram-${Date.now()}`,
      toolType: pageData.toolType || "all",
      name: pageData.name || "Instagram Downloader",
      h1: pageData.h1 || "Instagram Downloader",
      subtitle: pageData.subtitle || "Download Instagram media",
      status: pageData.status || "draft",
      seoTitle: pageData.seoTitle || "Instagram Downloader",
      metaDescription: pageData.metaDescription || "Download Instagram media in HD",
      ...(pageData.focusKeyword ? { focusKeyword: pageData.focusKeyword } : {}),
      ...(pageData.secondaryKeywords ? { secondaryKeywords: pageData.secondaryKeywords } : {}),
      ...(pageData.canonicalUrl ? { canonicalUrl: pageData.canonicalUrl } : {}),
      ...(pageData.introHtml ? { introHtml: pageData.introHtml } : {}),
      howToSteps: pageData.howToSteps || [],
      features: pageData.features || [],
      faqs: pageData.faqs || [],
      updatedAt: new Date().toISOString(),
    };
    store.downloaderPages.push(newPage);
    saveStore(store);
    return newPage;
  }
}

export function toggleDownloaderPageStatus(id: string): CMSDownloaderPage {
  const store = getStore();
  if (!store.downloaderPages) store.downloaderPages = DEFAULT_DOWNLOADER_PAGES;
  const page = store.downloaderPages.find((p) => p.id === id);
  if (!page) throw new Error("Downloader page not found");
  page.status = page.status === "published" ? "draft" : "published";
  page.updatedAt = new Date().toISOString();
  saveStore(store);
  return page;
}

export function deleteDownloaderPage(id: string): boolean {
  const store = getStore();
  if (!store.downloaderPages) return false;
  const initialLen = store.downloaderPages.length;
  store.downloaderPages = store.downloaderPages.filter((p) => p.id !== id);
  if (store.downloaderPages.length !== initialLen) {
    saveStore(store);
    return true;
  }
  return false;
}

export function getDownloaderStats(): CMSDownloaderStats {
  const store = getStore();
  const pages = store.downloaderPages || DEFAULT_DOWNLOADER_PAGES;
  const published = pages.filter((p) => p.status === "published").length;
  const draft = pages.filter((p) => p.status === "draft").length;

  const currentStats = store.downloaderStats || {
    totalRequests: 0,
    successfulDownloads: 0,
    failedRequests: 0,
    totalPages: pages.length,
    publishedPages: published,
    draftPages: draft,
  };

  return {
    totalPages: pages.length,
    publishedPages: published,
    draftPages: draft,
    totalRequests: currentStats.totalRequests || 0,
    successfulDownloads: currentStats.successfulDownloads || 0,
    failedRequests: currentStats.failedRequests || 0,
    ...(currentStats.lastRequestAt ? { lastRequestAt: currentStats.lastRequestAt } : {}),
    lastUpdatedAt: new Date().toISOString(),
  };
}

export function saveDownloaderDraft(
  id: string,
  draftData: Partial<CMSDownloaderPage>,
): CMSDownloaderPage {
  const store = getStore();
  if (!store.downloaderPages) store.downloaderPages = DEFAULT_DOWNLOADER_PAGES;
  const pageIndex = store.downloaderPages.findIndex((p) => p.id === id);
  if (pageIndex === -1) throw new Error("Downloader page not found");

  const page = store.downloaderPages[pageIndex]!;
  page.draft = {
    ...(page.draft || {}),
    ...draftData,
    updatedAt: new Date().toISOString(),
  };
  page.updatedAt = new Date().toISOString();
  store.downloaderPages[pageIndex] = page;
  saveStore(store);
  return page;
}

export function publishDownloaderPage(
  id: string,
  notes?: string,
): { page: CMSDownloaderPage; redirectCreated?: boolean } {
  const store = getStore();
  if (!store.downloaderPages) store.downloaderPages = DEFAULT_DOWNLOADER_PAGES;
  const pageIndex = store.downloaderPages.findIndex((p) => p.id === id);
  if (pageIndex === -1) throw new Error("Downloader page not found");

  const page = store.downloaderPages[pageIndex]!;
  const oldSlug = page.slug;

  // Snapshot before publish for revision history
  const revisionSnapshot: Partial<CMSDownloaderPage> = {
    name: page.name,
    h1: page.h1,
    subtitle: page.subtitle,
    seoTitle: page.seoTitle,
    metaDescription: page.metaDescription,
    ...(page.focusKeyword ? { focusKeyword: page.focusKeyword } : {}),
    ...(page.secondaryKeywords ? { secondaryKeywords: [...page.secondaryKeywords] } : {}),
    ...(page.canonicalUrl ? { canonicalUrl: page.canonicalUrl } : {}),
    ...(page.introHtml ? { introHtml: page.introHtml } : {}),
    howToSteps: JSON.parse(JSON.stringify(page.howToSteps || [])),
    features: JSON.parse(JSON.stringify(page.features || [])),
    faqs: JSON.parse(JSON.stringify(page.faqs || [])),
    ...(page.whyChooseHeading ? { whyChooseHeading: page.whyChooseHeading } : {}),
    ...(page.whyChooseDescription ? { whyChooseDescription: page.whyChooseDescription } : {}),
    ...(page.whyChooseBenefits ? { whyChooseBenefits: JSON.parse(JSON.stringify(page.whyChooseBenefits)) } : {}),
    ...(page.inputPlaceholder ? { inputPlaceholder: page.inputPlaceholder } : {}),
    ...(page.downloadButtonText ? { downloadButtonText: page.downloadButtonText } : {}),
    ...(page.internalLinks ? { internalLinks: JSON.parse(JSON.stringify(page.internalLinks)) } : {}),
  };

  const newRevision: CMSDownloaderRevision = {
    id: `rev-${Date.now()}`,
    timestamp: new Date().toISOString(),
    snapshot: revisionSnapshot,
    ...(notes ? { notes } : {}),
  };

  const revisions = [newRevision, ...(page.revisions || [])].slice(0, 30);
  page.revisions = revisions;

  let redirectCreated = false;

  // If draft exists, apply draft changes to live page
  if (page.draft) {
    const draft = page.draft;
    // Check if slug changed
    if (draft.slug && draft.slug !== oldSlug) {
      const newSlug = draft.slug.trim().replace(/^\/+|\/+$/g, "");
      // Validate not duplicate
      const duplicate = store.downloaderPages.find(
        (p) => p.id !== id && p.slug === newSlug,
      );
      if (duplicate) {
        throw new Error(`The slug "/${newSlug}" is already in use by another page.`);
      }

      // Add automatic 301 redirect in store.redirects
      if (!store.redirects) store.redirects = [];
      const fromPath = `/${oldSlug}`;
      const toPath = `/${newSlug}`;
      // Remove any existing duplicate redirect for this fromPath
      store.redirects = store.redirects.filter((r) => r.fromPath !== fromPath);
      store.redirects.unshift({
        id: `redir-${Date.now()}`,
        fromPath,
        toPath,
        statusCode: 301,
        hits: 0,
        createdAt: new Date().toISOString(),
      });
      redirectCreated = true;

      // Add to redirect history
      const redirectHist = [
        { oldSlug, newSlug, timestamp: new Date().toISOString() },
        ...(page.redirectHistory || []),
      ];
      page.redirectHistory = redirectHist;
      page.slug = newSlug;
    }

    // Merge all draft fields
    Object.assign(page, draft);
    delete page.draft;
  }

  page.status = "published";
  page.updatedAt = new Date().toISOString();
  store.downloaderPages[pageIndex] = page;
  saveStore(store);
  return { page, redirectCreated };
}

export function restoreDownloaderRevision(
  id: string,
  revisionId: string,
): CMSDownloaderPage {
  const store = getStore();
  if (!store.downloaderPages) store.downloaderPages = DEFAULT_DOWNLOADER_PAGES;
  const pageIndex = store.downloaderPages.findIndex((p) => p.id === id);
  if (pageIndex === -1) throw new Error("Downloader page not found");

  const page = store.downloaderPages[pageIndex]!;
  const revision = (page.revisions || []).find((r) => r.id === revisionId);
  if (!revision) throw new Error("Revision not found");

  // Restore snapshot fields into page
  Object.assign(page, revision.snapshot);
  page.updatedAt = new Date().toISOString();
  store.downloaderPages[pageIndex] = page;
  saveStore(store);
  return page;
}

export function getDownloaderSettings(): CMSDownloaderSettings {
  const store = getStore();
  if (store.downloaderSettings) return store.downloaderSettings;

  const defaultSettings: CMSDownloaderSettings = {
    apiProvider: "SnapSave Fast Engine",
    apiEndpoint: "https://snapsave.app/action.php",
    apiKeyMasked: "snapsave_live_••••••••••••94b2",
    status: "active",
    supportedFormats: ["mp4", "webm", "jpg", "png"],
    rateLimitPerMinute: 60,
    enableProxyCaching: true,
    cacheDurationSeconds: 86400,
  };
  return defaultSettings;
}

export function saveDownloaderSettings(
  settings: Partial<CMSDownloaderSettings>,
): CMSDownloaderSettings {
  const store = getStore();
  const current = getDownloaderSettings();
  const updated: CMSDownloaderSettings = {
    ...current,
    ...settings,
  };
  store.downloaderSettings = updated;
  saveStore(store);
  return updated;
}

export function getDownloaderLogs(limit = 100): CMSDownloaderLog[] {
  const store = getStore();
  return (store.downloaderLogs || []).slice(0, limit);
}

export function clearDownloaderLogs(): boolean {
  const store = getStore();
  store.downloaderLogs = [];
  saveStore(store);
  return true;
}

export function logDownloaderRequest(
  entry: Omit<CMSDownloaderLog, "id" | "timestamp">,
): void {
  try {
    const store = getStore();
    if (!store.downloaderLogs) store.downloaderLogs = [];
    if (!store.downloaderStats) {
      store.downloaderStats = {
        totalPages: 7,
        publishedPages: 7,
        draftPages: 0,
        totalRequests: 0,
        successfulDownloads: 0,
        failedRequests: 0,
      };
    }

    const logItem: CMSDownloaderLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };

    // Prepend and limit logs to latest 150 entries
    store.downloaderLogs = [logItem, ...store.downloaderLogs].slice(0, 150);

    // Update real stats
    store.downloaderStats.totalRequests =
      (store.downloaderStats.totalRequests || 0) + 1;
    if (entry.status === "success") {
      store.downloaderStats.successfulDownloads =
        (store.downloaderStats.successfulDownloads || 0) + 1;
    } else {
      store.downloaderStats.failedRequests =
        (store.downloaderStats.failedRequests || 0) + 1;
    }
    store.downloaderStats.lastRequestAt = logItem.timestamp;
    store.downloaderStats.lastUpdatedAt = logItem.timestamp;

    saveStore(store);
  } catch (err) {
    console.warn("[Downloader] Failed to write request log:", err);
  }
}

// ---------------------------------------------------------------------------
// CENTRALIZED LEADS & WEBSITE FORM SUBMISSIONS MANAGEMENT
// ---------------------------------------------------------------------------

export function getAllLeads(filters?: {
  search?: string | undefined;
  status?: LeadStatus | "all" | undefined;
  formType?: string | "all" | undefined;
  service?: string | "all" | undefined;
  isRead?: boolean | undefined;
}): CMSLead[] {
  const store = getStore();
  let list = store.leads ? [...store.leads] : [];

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.businessName && l.businessName.toLowerCase().includes(q)) ||
        (l.message && l.message.toLowerCase().includes(q))
    );
  }

  if (filters?.status && filters.status !== "all") {
    list = list.filter((l) => l.status === filters.status);
  }

  if (filters?.formType && filters.formType !== "all") {
    list = list.filter((l) => l.formType === filters.formType);
  }

  if (filters?.service && filters.service !== "all") {
    list = list.filter((l) => l.service === filters.service);
  }

  if (filters?.isRead !== undefined) {
    list = list.filter((l) => l.isRead === filters.isRead);
  }

  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getLeadById(id: string): CMSLead | undefined {
  const store = getStore();
  return (store.leads || []).find((l) => l.id === id);
}

export function saveWebsiteLead(data: {
  fullName: string;
  phone: string;
  email: string;
  service?: string | undefined;
  businessName?: string | undefined;
  budget?: string | undefined;
  message?: string | undefined;
  position?: string | undefined;
  resumeUrl?: string | undefined;
  sourceUrl: string;
  formName: string;
  formType: FormType;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmContent?: string | undefined;
  utmTerm?: string | undefined;
  referrer?: string | undefined;
  customFields?: Record<string, string | number | boolean | null | undefined> | undefined;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}): { ok: boolean; lead: CMSLead; isDuplicate?: boolean } {
  const store = getStore();
  if (!store.leads) store.leads = seedInitialLeads();

  // Deduplication check: check if same contact was submitted in the last 60 seconds
  const now = Date.now();
  const cleanPhone = data.phone.replace(/[^0-9]/g, "");
  const cleanEmail = data.email.toLowerCase().trim();

  const recentDuplicate = store.leads.find((l) => {
    const lPhone = l.phone.replace(/[^0-9]/g, "");
    const lEmail = l.email.toLowerCase().trim();
    const isSame = (cleanPhone.length > 5 && lPhone === cleanPhone) || (cleanEmail.length > 3 && lEmail === cleanEmail);
    const createdTime = new Date(l.createdAt).getTime();
    return isSame && now - createdTime < 60000;
  });

  if (recentDuplicate) {
    return { ok: true, lead: recentDuplicate, isDuplicate: true };
  }

  const newLead: CMSLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    service: data.service || undefined,
    businessName: data.businessName?.trim() || undefined,
    budget: data.budget || undefined,
    message: data.message?.trim() || undefined,
    position: data.position || undefined,
    resumeUrl: data.resumeUrl || undefined,
    sourceUrl: data.sourceUrl || "/",
    formName: data.formName || "Website Form",
    formType: data.formType || "general",
    utmSource: data.utmSource || undefined,
    utmMedium: data.utmMedium || undefined,
    utmCampaign: data.utmCampaign || undefined,
    utmContent: data.utmContent || undefined,
    utmTerm: data.utmTerm || undefined,
    referrer: data.referrer || undefined,
    customFields: data.customFields || undefined,
    status: "new",
    assignedTo: "Unassigned",
    notes: [],
    isRead: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ipAddress: data.ipAddress || undefined,
    userAgent: data.userAgent || undefined,
  };

  store.leads = [newLead, ...store.leads];
  saveStore(store);

  return { ok: true, lead: newLead };
}

export function updateLeadStatus(
  id: string,
  status: LeadStatus,
  updatedBy = "Admin"
): CMSLead | undefined {
  const store = getStore();
  if (!store.leads) return undefined;
  const lead = store.leads.find((l) => l.id === id);
  if (!lead) return undefined;

  const oldStatus = lead.status;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  lead.isRead = true;
  lead.notes.push({
    id: `note-${Date.now()}`,
    authorName: updatedBy,
    authorEmail: "admin@socialwaale.com",
    text: `Status updated from ${oldStatus} to ${status}`,
    createdAt: new Date().toISOString(),
  });

  saveStore(store);
  return lead;
}

export function assignLead(
  id: string,
  assignedTo: string,
  updatedBy = "Admin"
): CMSLead | undefined {
  const store = getStore();
  if (!store.leads) return undefined;
  const lead = store.leads.find((l) => l.id === id);
  if (!lead) return undefined;

  const oldAssignee = lead.assignedTo || "Unassigned";
  lead.assignedTo = assignedTo;
  lead.updatedAt = new Date().toISOString();
  lead.isRead = true;
  lead.notes.push({
    id: `note-${Date.now()}`,
    authorName: updatedBy,
    authorEmail: "admin@socialwaale.com",
    text: `Lead reassigned from "${oldAssignee}" to "${assignedTo}"`,
    createdAt: new Date().toISOString(),
  });

  saveStore(store);
  return lead;
}

export function addLeadNote(
  id: string,
  text: string,
  author: { name: string; email: string }
): CMSLead | undefined {
  const store = getStore();
  if (!store.leads) return undefined;
  const lead = store.leads.find((l) => l.id === id);
  if (!lead) return undefined;

  lead.notes.push({
    id: `note-${Date.now()}`,
    authorName: author.name,
    authorEmail: author.email,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  });
  lead.updatedAt = new Date().toISOString();
  saveStore(store);
  return lead;
}

export function markLeadAsRead(id: string): CMSLead | undefined {
  const store = getStore();
  if (!store.leads) return undefined;
  const lead = store.leads.find((l) => l.id === id);
  if (!lead) return undefined;

  lead.isRead = true;
  lead.updatedAt = new Date().toISOString();
  saveStore(store);
  return lead;
}

export function deleteLead(id: string): boolean {
  const store = getStore();
  if (!store.leads) return false;
  const index = store.leads.findIndex((l) => l.id === id);
  if (index === -1) return false;

  store.leads.splice(index, 1);
  saveStore(store);
  return true;
}

export function bulkUpdateLeads(
  ids: string[],
  action: "delete" | "mark_read" | "status" | "assign",
  value?: string
): boolean {
  const store = getStore();
  if (!store.leads) return false;

  if (action === "delete") {
    store.leads = store.leads.filter((l) => !ids.includes(l.id));
  } else if (action === "mark_read") {
    store.leads.forEach((l) => {
      if (ids.includes(l.id)) l.isRead = true;
    });
  } else if (action === "status" && value) {
    store.leads.forEach((l) => {
      if (ids.includes(l.id)) {
        l.status = value as LeadStatus;
        l.isRead = true;
      }
    });
  } else if (action === "assign" && value) {
    store.leads.forEach((l) => {
      if (ids.includes(l.id)) {
        l.assignedTo = value;
      }
    });
  }

  saveStore(store);
  return true;
}

export function getLeadStats(): CMSLeadStats {
  const store = getStore();
  const leads = store.leads || [];

  const byForm: Record<string, number> = {};
  const byService: Record<string, number> = {};
  const bySourcePage: Record<string, number> = {};

  let newCount = 0;
  let contactedCount = 0;
  let followUpCount = 0;
  let inProgressCount = 0;
  let convertedCount = 0;
  let rejectedCount = 0;

  for (const l of leads) {
    if (l.status === "new") newCount++;
    else if (l.status === "contacted") contactedCount++;
    else if (l.status === "follow_up") followUpCount++;
    else if (l.status === "in_progress") inProgressCount++;
    else if (l.status === "converted") convertedCount++;
    else if (l.status === "rejected") rejectedCount++;

    const fName = l.formName || "Unknown Form";
    byForm[fName] = (byForm[fName] || 0) + 1;

    const sName = l.service || "Unspecified";
    byService[sName] = (byService[sName] || 0) + 1;

    const pName = l.sourceUrl || "/";
    bySourcePage[pName] = (bySourcePage[pName] || 0) + 1;
  }

  return {
    totalLeads: leads.length,
    newLeads: newCount,
    contactedLeads: contactedCount,
    followUpLeads: followUpCount,
    inProgressLeads: inProgressCount,
    convertedLeads: convertedCount,
    rejectedLeads: rejectedCount,
    byForm,
    byService,
    bySourcePage,
    lastLeadAt: leads[0]?.createdAt,
  };
}

// ---------------------------------------------------------------------------
// AUTHENTICATION, RATE LIMITING & SECURE PASSWORD RECOVERY
// ---------------------------------------------------------------------------

export type AuthResult =
  | { ok: true; user: AdminUser; token: string }
  | { ok: false; error: string; locked?: boolean; remainingAttempts?: number };

export function authenticateUser(email: string, passwordPlain: string): AuthResult {
  const store = getStore();
  const targetEmail = email.trim().toLowerCase();
  const userList = store.users && store.users.length > 0 ? store.users : [DEFAULT_ADMIN, DEFAULT_EDITOR];
  const user = userList.find((u) => u.email.toLowerCase() === targetEmail);

  if (!user) {
    // Avoid user enumeration
    return { ok: false, error: "Invalid email or password." };
  }

  // Check temporary account lockout
  if (user.lockedUntil) {
    const lockExpires = new Date(user.lockedUntil).getTime();
    const now = Date.now();
    if (lockExpires > now) {
      const minutesRemaining = Math.max(1, Math.ceil((lockExpires - now) / 60000));
      return {
        ok: false,
        error: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute${minutesRemaining > 1 ? "s" : ""} or use Forgot Password to reset.`,
        locked: true,
      };
    } else {
      // Lock expired: reset lockout state
      user.lockedUntil = undefined;
      user.failedAttempts = 0;
    }
  }

  const isMatch = verifyPassword(passwordPlain, user.passwordHash);

  if (!isMatch) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    if (user.failedAttempts >= 5) {
      // 15-minute temporary lockout after 5 failed attempts
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      saveStore(store);
      return {
        ok: false,
        error: "Too many failed attempts. Your account has been temporarily locked for 15 minutes.",
        locked: true,
      };
    }

    saveStore(store);
    const remaining = 5 - user.failedAttempts;
    return {
      ok: false,
      error: `Invalid email or password. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining before temporary lockout.`,
      remainingAttempts: remaining,
    };
  }

  // Successful login: reset failed attempts & lockout
  user.failedAttempts = 0;
  user.lockedUntil = undefined;
  saveStore(store);

  const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  return { ok: true, user, token };
}

export function createPasswordResetToken(email: string): { ok: boolean; token?: string; error?: string } {
  const store = getStore();
  const targetEmail = email.trim().toLowerCase();
  const userList = store.users && store.users.length > 0 ? store.users : [DEFAULT_ADMIN, DEFAULT_EDITOR];
  const user = userList.find((u) => u.email.toLowerCase() === targetEmail);

  if (!user) {
    // Return generic success to prevent email enumeration
    return { ok: true };
  }

  // Generate 32-byte cryptographically secure random token (64-char hex)
  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  // Token expires in 15 minutes
  user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  saveStore(store);

  return { ok: true, token };
}

export function validateResetToken(token: string): { ok: boolean; email?: string; error?: string } {
  if (!token) return { ok: false, error: "Invalid token" };
  const store = getStore();
  const userList = store.users || [];
  const user = userList.find((u) => u.resetToken === token);

  if (!user || !user.resetTokenExpires) {
    return { ok: false, error: "Password reset link is invalid or has already been used." };
  }

  const expires = new Date(user.resetTokenExpires).getTime();
  if (expires < Date.now()) {
    return { ok: false, error: "Password reset link has expired. Please request a new link." };
  }

  return { ok: true, email: user.email };
}

export function resetPasswordWithToken(
  token: string,
  newPasswordPlain: string
): { ok: boolean; error?: string } {
  const store = getStore();
  const userList = store.users || [];
  const user = userList.find((u) => u.resetToken === token);

  if (!user || !user.resetTokenExpires) {
    return { ok: false, error: "Password reset link is invalid or has already been used." };
  }

  const expires = new Date(user.resetTokenExpires).getTime();
  if (expires < Date.now()) {
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    saveStore(store);
    return { ok: false, error: "Password reset link has expired. Please request a new one." };
  }

  if (!newPasswordPlain || newPasswordPlain.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters long." };
  }

  // Securely hash with memory-hard scrypt algorithm
  user.passwordHash = hashPasswordSecure(newPasswordPlain);
  // Clear single-use token and lockout
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  user.failedAttempts = 0;
  user.lockedUntil = undefined;
  user.updatedAt = new Date().toISOString();
  saveStore(store);

  return { ok: true };
}
