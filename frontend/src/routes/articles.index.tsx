import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Calendar,
  User,
  Sparkles,
  BookOpen,
  TrendingUp,
  Target,
  Globe,
  BarChart3,
  Layers,
  FileText,
  ChevronDown,
  CheckCircle2,
  Share2,
  Compass,
  Lightbulb,
  MapPin,
  Flame,
  X,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/site/primitives";
import { PageWrapper } from "@/components/site/PageWrapper";
import { Button } from "@/components/ui/button";
import { articles, CATEGORY_IMAGES, CATEGORY_LABELS, formatDate } from "@/data/articles";
import type { Article, ArticleCategory } from "@/data/types";
import { pageHead } from "@/lib/seo";
import { absoluteUrl } from "@/config/site";

export const Route = createFileRoute("/articles/")({
  head: () =>
    pageHead({
      title: "Digital Marketing Insights & SEO Blog | Social Waale",
      description:
        "Practical digital marketing insights, SEO strategies, Meta Ads guides, website tips and brand building advice for ambitious businesses across North India.",
      path: "/articles",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Articles", path: "/articles" },
      ],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Social Waale Digital Marketing Blog & Insights",
          description:
            "Actionable insights on SEO, social media marketing, paid advertising, branding and web development.",
          url: absoluteUrl("/articles"),
          blogPost: articles.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            description: a.excerpt,
            url: absoluteUrl(`/articles/${a.slug}`),
            datePublished: a.publishedAt,
            dateModified: a.updatedAt,
            author: {
              "@type": "Organization",
              name: a.author,
            },
          })),
        },
      ],
    }),
  component: ArticlesPage,
});

/* ========================================================================== */
/* CATEGORY FILTER DEFINITIONS                                                */
/* ========================================================================== */

type FilterCategory = "all" | ArticleCategory;

interface CategoryFilterOption {
  key: FilterCategory;
  label: string;
}

const CATEGORY_FILTERS: CategoryFilterOption[] = [
  { key: "all", label: "All Articles" },
  { key: "seo", label: "SEO & Organic Growth" },
  { key: "social-media-marketing", label: "Social Media Marketing" },
  { key: "google-ads", label: "Meta Ads & Google Ads" },
  { key: "website-development", label: "Website Development" },
  { key: "branding", label: "Branding & Creative" },
  { key: "content-marketing", label: "Content Marketing" },
  { key: "digital-marketing", label: "Digital Growth" },
];

/* ========================================================================== */
/* STATIC SECTION DATA                                                        */
/* ========================================================================== */

const KNOWLEDGE_PILLARS = [
  {
    num: "01",
    title: "SEO & Organic Growth",
    icon: Globe,
    desc: "Learn about high-intent keyword research, technical website audits, local Google Business optimization, search visibility, and sustainable content clustering.",
    links: [
      { text: "Local SEO for Punjab & Chandigarh", url: "/articles/local-seo-strategies-punjab" },
      { text: "Actionable SEO Search Visibility", url: "/articles/improve-google-search-visibility" },
      { text: "SEO vs Google Ads: ROI Breakdown", url: "/articles/seo-vs-google-ads" },
    ],
    serviceUrl: "/seo-services",
    serviceLabel: "Explore SEO Services",
  },
  {
    num: "02",
    title: "Social Media & Brand Building",
    icon: Sparkles,
    desc: "Explore Instagram reels, Facebook community growth, strategic content planning, customer engagement formulas, and genuine brand communication.",
    links: [
      { text: "Instagram Marketing for Growing Brands", url: "/articles/instagram-marketing-for-local-businesses" },
      { text: "Why Small Businesses Need Social Media", url: "/articles/why-small-businesses-need-social-media-marketing" },
      { text: "Building a Converting Content Strategy", url: "/articles/how-to-build-social-media-content-strategy" },
    ],
    serviceUrl: "/social-media-marketing",
    serviceLabel: "Explore Social Services",
  },
  {
    num: "03",
    title: "Performance Marketing & Paid Ads",
    icon: Target,
    desc: "Learn about Meta Ads, Google Search campaigns, budget optimization, audience targeting, high-intent lead generation, and multi-touch performance tracking.",
    links: [
      { text: "Quality Leads with Facebook & Instagram Ads", url: "/articles/quality-leads-facebook-instagram-ads" },
      { text: "Google Ads vs Meta Ads: Platform Guide", url: "/articles/google-ads-vs-meta-ads-which-is-better" },
      { text: "Choosing the Right Growth Agency", url: "/articles/how-to-choose-digital-marketing-agency-chandigarh" },
    ],
    serviceUrl: "/google-ads-performance-marketing",
    serviceLabel: "Explore Paid Media Services",
  },
  {
    num: "04",
    title: "Website Development & Conversion",
    icon: Layers,
    desc: "Explore high-performing web design, responsive mobile ergonomics, Core Web Vitals speed optimization, UX wireframing, and conversion rate optimization.",
    links: [
      { text: "10 Website Design Tips That Convert", url: "/articles/website-design-tips-that-improve-conversions" },
      { text: "Why Every Business Needs a Professional Website", url: "/articles/why-your-business-needs-professional-website" },
      { text: "How Strategic Branding Builds Customer Trust", url: "/articles/how-branding-builds-customer-trust" },
    ],
    serviceUrl: "/website-app-development",
    serviceLabel: "Explore Web Engineering",
  },
];

const EDITORIAL_STANDARDS = [
  {
    num: "01",
    title: "Research-Driven Content",
    desc: "Every article is grounded in real Google Search documentation, Meta ad policy updates, industry benchmarks, and empirical campaign data observed directly from our agency client work.",
  },
  {
    num: "02",
    title: "Practical Business Applications",
    desc: "We reject theoretical agency buzzwords and fluffy generalities. Our guides focus on actionable checklists, budget calculators, and clear execution steps business owners can implement immediately.",
  },
  {
    num: "03",
    title: "SEO-Friendly Content Structure",
    desc: "Our insights are structured with semantic clarity, logical heading hierarchy, and verified schema markup so that both human readers and search engines receive maximum clarity.",
  },
];

const KNOWLEDGE_CATEGORIES_DEEP = [
  {
    num: "01",
    title: "Social Media Strategy",
    summary:
      "Turning passive followers into engaged brand champions through consistent aesthetic storytelling, video hooks, and genuine audience communication.",
    topics: ["Short-form video retention formulas", "Bilingual content for North Indian audiences", "Community engagement & comment handling"],
  },
  {
    num: "02",
    title: "Search Engine Optimization",
    summary:
      "Establishing long-term organic authority through technical infrastructure audits, structured JSON-LD schemas, and local Google Map Pack rankings.",
    topics: ["Local citation consistency (NAP)", "Keyword intent mapping (commercial vs informational)", "Topical authority & content clustering"],
  },
  {
    num: "03",
    title: "Performance Marketing",
    summary:
      "Engineering scalable paid advertising funnels across Meta and Google with laser-targeted buyer personas, strict CPA targets, and CRM lead verification.",
    topics: ["Conversion API (CAPI) pixel setups", "High-converting ad creative formats", "Negative keyword harvesting & bidding strategies"],
  },
  {
    num: "04",
    title: "Website & Creative Growth",
    summary:
      "Crafting sub-second responsive digital platforms that pair brand aesthetics with seamless mobile UX and friction-free inquiry pathways.",
    topics: ["Thumb-friendly sticky action bars", "Above-the-fold value proposition clarity", "Form simplification and micro-copy optimization"],
  },
];

const CONTENT_DEVELOPMENT_STEPS = [
  {
    step: "01",
    title: "Identify Business Challenges",
    desc: "We analyze recurring operational questions and marketing dilemmas voiced by founders during client consultations.",
  },
  {
    step: "02",
    title: "Research Search Trends",
    desc: "We evaluate search volume, seasonal spikes, and search engine intent signals using professional SEO intelligence tools.",
  },
  {
    step: "03",
    title: "Understand Audience Intent",
    desc: "We determine whether readers seek instant procedural guidance, cost benchmarks, or vendor evaluation checklists.",
  },
  {
    step: "04",
    title: "Develop Useful Content",
    desc: "Our strategists draft clear, comprehensive breakdowns enriched with relatable examples and practical steps.",
  },
  {
    step: "05",
    title: "Optimize for Search",
    desc: "We apply semantic headings, descriptive alt text, structured data schemas, and internal links for optimal discovery.",
  },
  {
    step: "06",
    title: "Update & Improve",
    desc: "We review published guides regularly, updating metrics and advice as platform algorithms and market conditions evolve.",
  },
];

const MODERN_TOPICS = [
  {
    title: "Website Performance & User Experience",
    desc: "Sub-2-second load times, mobile-first layouts, and accessible typography that keep bounce rates under 30%.",
    icon: Layers,
  },
  {
    title: "Technical SEO & Local Search",
    desc: "Dominating local geographic queries, Google Business Profiles, and structured microdata for voice and mobile search.",
    icon: Globe,
  },
  {
    title: "Social Media Growth",
    desc: "Organic reach frameworks, viral reel hooks, and building brand equity on Instagram, Facebook, and LinkedIn.",
    icon: Sparkles,
  },
  {
    title: "Meta & Google Advertising",
    desc: "Laser-targeted pay-per-click and paid social campaigns engineered for low acquisition costs and high lead quality.",
    icon: Target,
  },
  {
    title: "Branding & Creative Strategy",
    desc: "Distinctive brand positioning, color psychology, and memorable visual assets that stand out in crowded markets.",
    icon: Lightbulb,
  },
  {
    title: "Content Marketing & AI Search",
    desc: "Authoritative topical guides and entity-first publishing designed for Google AI Overviews and modern search engines.",
    icon: TrendingUp,
  },
];

const NORTH_INDIA_REGIONS = [
  {
    region: "Chandigarh Tri-City",
    summary:
      "A sophisticated, tech-aware consumer base with high digital expectations. Businesses here require premium visual branding, sub-2-second website speed, and top-tier local Google Map Pack dominance to compete.",
    focus: "Local SEO, Premium UI/UX & High-Definition Reel Creative",
  },
  {
    region: "Punjab",
    summary:
      "Thriving retail, immigration, education, healthcare, and fashion brands. Audiences respond strongly to visual video storytelling, cultural authenticity, and frictionless WhatsApp inquiry funnels.",
    focus: "Bilingual Social Content, WhatsApp Funnels & Meta Ads",
  },
  {
    region: "Himachal Pradesh",
    summary:
      "Hospitality, eco-tourism, organic products, and specialty clinics. Success depends on capturing high-intent seasonal travel searches and building national social media awareness.",
    focus: "Seasonal Google Search Ads, Travel Storytelling & Visual SEO",
  },
  {
    region: "Haryana",
    summary:
      "Fast-expanding commercial hubs, manufacturing clusters, and real estate corridors. Companies require corporate website engineering, LinkedIn B2B outreach, and targeted lead generation.",
    focus: "B2B Lead Generation, Corporate Portals & Search Advertising",
  },
  {
    region: "Uttar Pradesh",
    summary:
      "Massive, rapidly digitalizing consumer markets with unprecedented mobile adoption. Businesses need hyper-localized search optimization and lightweight mobile web experiences.",
    focus: "Localized Search Marketing, High-Volume Reels & Fast Mobile Sites",
  },
  {
    region: "Delhi NCR",
    summary:
      "Hyper-competitive corporate and consumer landscape where multi-channel performance marketing, aggressive conversion optimization, and advanced analytics are vital for market share.",
    focus: "Full-Funnel Omnichannel Ads, CRO Testing & Data Analytics",
  },
];

const UPCOMING_GUIDES = [
  {
    num: "01",
    title: "AI Search & Generative Engine Optimization (GEO)",
    desc: "How Google AI Overviews, Perplexity, and ChatGPT search are transforming organic search discovery and how brands should adapt.",
    status: "In Research & Editorial Review",
  },
  {
    num: "02",
    title: "Advanced Instagram Marketing Strategies",
    desc: "Unlocking algorithmic reach through high-retention video hooks, carousel structures, and community-building DM automations.",
    status: "Scheduled for Publication",
  },
  {
    num: "03",
    title: "Local SEO for Growing Businesses",
    desc: "A tactical playbook for managing multi-location Google Business Profiles, acquiring authentic reviews, and earning local pack positions.",
    status: "Drafting Case Studies",
  },
  {
    num: "04",
    title: "Conversion-Focused Website Design",
    desc: "Behavioral psychology principles, typography hierarchy, and micro-copy patterns that double landing page conversion rates.",
    status: "Final Review",
  },
];

const BLOG_FAQS = [
  {
    q: "What is the purpose of a business blog?",
    a: "A business blog establishes your brand as an authoritative voice in your industry, provides answers to customer questions before they buy, improves Google Search visibility by targeting relevant keywords, and creates valuable content to share across social media and email channels.",
  },
  {
    q: "How does blogging help SEO?",
    a: "Search engines reward websites that consistently publish fresh, comprehensive, and helpful content. Each well-structured blog post targets specific long-tail keywords, earns external backlinks, strengthens internal site architecture, and signals topical authority to Google's ranking algorithms.",
  },
  {
    q: "How often should businesses publish articles?",
    a: "Quality and consistency always beat raw volume. For most growing businesses, publishing 2 to 4 in-depth, high-value articles per month is far more effective than posting daily low-effort content. Consistency builds algorithmic momentum and gives your audience reliable insights.",
  },
  {
    q: "What topics should businesses write about?",
    a: "Start by writing down the top 20 questions your prospective customers ask before purchasing: cost considerations, comparisons between options, procedural guides, case studies, common mistakes to avoid, and industry trend breakdowns. Content that solves real customer dilemmas performs best.",
  },
  {
    q: "How long should an SEO-friendly article be?",
    a: "There is no magic word count. An effective article should be as long as necessary to fully answer the user's search query without fluff. In competitive niches, comprehensive guides typically range from 1,200 to 2,500 words, featuring clear headings, bulleted lists, and structured summaries.",
  },
  {
    q: "What is keyword research?",
    a: "Keyword research is the process of discovering the exact phrases, questions, and terms potential customers enter into search engines when looking for services like yours. It helps you understand search intent, competitor visibility, and commercial demand before writing content.",
  },
  {
    q: "How can social media support content marketing?",
    a: "Social media acts as a high-speed distribution amplifier for your long-form articles. You can extract short video hooks, visual carousels, key statistics, and pull-quotes from a single blog post to fuel weeks of Instagram, LinkedIn, and Facebook content while driving traffic back to your website.",
  },
  {
    q: "What is local SEO?",
    a: "Local SEO focuses on optimizing your online presence to attract customers from immediate geographic searches (such as 'digital marketing agency in Chandigarh' or 'orthopedic clinic near me'). It involves optimizing your Google Business Profile, managing local reviews, and building consistent local citations.",
  },
  {
    q: "How can I find the right digital marketing strategy for my business?",
    a: "The right strategy depends on your sales cycle, customer acquisition economics, and market demand. Immediate-need services thrive on Google Search Ads and Local SEO, while visual and lifestyle products succeed through Meta Ads and Instagram Reels. We recommend booking a strategy consultation with our team to map your optimal channels.",
  },
  {
    q: "Can I share or request a topic for an article?",
    a: "Yes! We welcome suggestions from founders, entrepreneurs, and marketers. If there is a specific digital marketing challenge, channel comparison, or local marketing topic you would like us to analyze, feel free to send us a message via our contact page.",
  },
  {
    q: "How do I stay updated with digital marketing trends?",
    a: "Bookmark this Social Waale blog, follow verified industry publications (such as Google Search Central and platform release notes), and monitor our social channels. We regularly publish timely updates whenever major search algorithms or ad platforms announce fundamental updates.",
  },
  {
    q: "How can Social Waale help my business grow?",
    a: "Social Waale provides complete end-to-end digital growth services: high-converting website development, local and technical SEO, Meta and Google Ads performance management, social media creative production, and brand identity design. We partner closely with ambitious businesses across North India to deliver measurable commercial outcomes.",
  },
];

/* ========================================================================== */
/* MAIN COMPONENT                                                             */
/* ========================================================================== */

function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // The first article serves as the spotlight / featured article
  const featuredArticle = articles[0];

  // Filtered article list based on active category and live search query
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "all" ? true : article.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        article.author.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Non-featured articles for the latest grid
  // When filtering or searching, we display from the full filtered pool
  const gridArticles = useMemo(() => {
    if (selectedCategory !== "all" || searchQuery.trim().length > 0) {
      return filteredArticles;
    }
    // Default view: exclude spotlight from grid to avoid immediate repetition
    return filteredArticles.slice(1);
  }, [filteredArticles, selectedCategory, searchQuery]);

  const displayedArticles = gridArticles.slice(0, visibleCount);
  const hasMore = visibleCount < gridArticles.length;

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setVisibleCount(6);
  };

  return (
    <PageWrapper>
      {/* ==================================================================== */}
      {/* SECTION 01 — BLOG HERO                                               */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] text-white pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" aria-hidden />
        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD84A]" />
              <span className="text-xs font-bold tracking-widest text-[#FFD84A] uppercase">
                SOCIAL WAALE • BLOG & INSIGHTS
              </span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Digital Insights That Inspire{" "}
              <span className="bg-gradient-to-r from-[#FFD84A] via-[#FF941E] to-[#FFD84A] bg-clip-text text-transparent">
                Smarter Growth
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-[#D5DAE7]/90 leading-relaxed max-w-2xl mx-auto">
              Explore practical insights, digital marketing strategies, SEO guides and creative
              ideas to help businesses build stronger online brands.
            </p>

            {/* 3 Trust Highlights */}
            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#FF941E] shrink-0" />
                <span>Digital Marketing Insights</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#FFD84A] shrink-0" />
                <span>SEO & Growth Strategies</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#FF941E] shrink-0" />
                <span>Practical Business Guides</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 02 — CATEGORY FILTERS & SEARCH                               */}
      {/* ==================================================================== */}
      <section className="sticky top-16 z-30 bg-[#F7F8FC]/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-4">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Horizontal Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {CATEGORY_FILTERS.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setVisibleCount(6);
                    }}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 ${
                      isActive
                        ? "bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-bold shadow-md shadow-orange-500/20"
                        : "bg-white text-slate-700 hover:text-[#080F35] hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(6);
                }}
                placeholder="Search articles, topics and insights..."
                className="w-full pl-9 pr-9 py-2 bg-white rounded-full border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF941E] focus:border-transparent transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 03 — FEATURED ARTICLE SPOTLIGHT                              */}
      {/* ==================================================================== */}
      {selectedCategory === "all" && !searchQuery && featuredArticle && (
        <section className="py-14 lg:py-18 bg-white border-b border-slate-100">
          <Container>
            <div className="mb-6 flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF941E]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF941E]">
                  FEATURED SPOTLIGHT
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#F7F8FC] rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow">
              {/* Cover Image Side */}
              <div className="lg:col-span-6 overflow-hidden rounded-2xl group">
                <Link to="/articles/$slug" params={{ slug: featuredArticle.slug }}>
                  <img
                    src={CATEGORY_IMAGES[featuredArticle.category]}
                    alt={featuredArticle.imageAlt}
                    className="w-full h-auto aspect-[16/10] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-sm"
                    loading="eager"
                  />
                </Link>
              </div>

              {/* Content Side */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#080F35] text-white">
                    {CATEGORY_LABELS[featuredArticle.category]}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {featuredArticle.readingMinutes} min read
                  </span>
                </div>

                <Link to="/articles/$slug" params={{ slug: featuredArticle.slug }}>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080F35] hover:text-[#FF941E] transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>
                </Link>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#080F35] text-[#FFD84A] flex items-center justify-center font-bold text-xs">
                      SW
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#080F35]">{featuredArticle.author}</p>
                      <p className="text-[11px] text-slate-500">
                        {formatDate(featuredArticle.publishedAt)}
                      </p>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#080F35] to-[#0E1B5A] text-white hover:from-[#FF941E] hover:to-[#FFD84A] hover:text-[#080F35] transition-all rounded-full font-semibold text-xs px-5 py-2"
                  >
                    <Link to="/articles/$slug" params={{ slug: featuredArticle.slug }}>
                      Read Full Article <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ==================================================================== */}
      {/* SECTION 04 — LATEST ARTICLES GRID                                    */}
      {/* ==================================================================== */}
      <section className="py-16 lg:py-24 bg-[#F7F8FC] border-b border-slate-200/70">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF941E]">
                LATEST INSIGHTS & ARTICLES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#080F35] mt-1">
                {selectedCategory === "all"
                  ? "Recent Marketing Guides & Breakdowns"
                  : `${CATEGORY_FILTERS.find((c) => c.key === selectedCategory)?.label || "Filtered"} Articles`}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Showing {displayedArticles.length} of {gridArticles.length} articles
            </p>
          </div>

          {/* Empty Search / Filter State */}
          {gridArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#080F35]">No matching articles found</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                We couldn't find any articles matching your search criteria. Try a different keyword or reset filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 px-5 py-2.5 rounded-full bg-[#080F35] text-white text-xs font-semibold hover:bg-[#FF941E] hover:text-[#080F35] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedArticles.map((article) => (
                <article
                  key={article.slug}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  {/* Card Cover Image */}
                  <Link
                    to="/articles/$slug"
                    params={{ slug: article.slug }}
                    className="overflow-hidden aspect-[16/10] block relative"
                  >
                    <img
                      src={CATEGORY_IMAGES[article.category]}
                      alt={article.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#080F35]/90 text-white backdrop-blur-sm">
                        {CATEGORY_LABELS[article.category]}
                      </span>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(article.publishedAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {article.readingMinutes} min read
                      </span>
                    </div>

                    <Link to="/articles/$slug" params={{ slug: article.slug }}>
                      <h3 className="text-lg font-bold text-[#080F35] group-hover:text-[#FF941E] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed flex-grow">
                      {article.excerpt}
                    </p>

                    {/* Card Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{article.author}</span>
                      <Link
                        to="/articles/$slug"
                        params={{ slug: article.slug }}
                        className="font-bold text-[#0E1B5A] group-hover:text-[#FF941E] transition-colors inline-flex items-center gap-1"
                      >
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="rounded-full border-slate-300 text-[#080F35] hover:bg-[#080F35] hover:text-white font-semibold text-xs px-8"
              >
                Load More Articles ({gridArticles.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 05 — TAILORED DIGITAL KNOWLEDGE PILLARS                      */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF941E]">
              KNOWLEDGE PILLARS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080F35] mt-2">
              Explore Our Digital Marketing Knowledge Hub
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Deepen your strategic knowledge across the four core dimensions of modern business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {KNOWLEDGE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className="bg-[#F7F8FC] rounded-3xl p-8 border border-slate-200/80 hover:border-[#FF941E]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white text-[#080F35] shadow-sm border border-slate-200 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#FF941E]" />
                      </div>
                      <span className="text-2xl font-black text-slate-300">{pillar.num}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#080F35] mb-2">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {pillar.desc}
                    </p>

                    {/* Topic Links */}
                    <div className="space-y-2 pt-4 border-t border-slate-200/70">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Recommended Insights:
                      </p>
                      {pillar.links.map((link, idx) => (
                        <Link
                          key={idx}
                          to={link.url}
                          className="block text-xs font-semibold text-[#0E1B5A] hover:text-[#FF941E] transition-colors"
                        >
                          → {link.text}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full border-slate-300 text-[#080F35] hover:bg-[#080F35] hover:text-white text-xs font-semibold"
                    >
                      <Link to={pillar.serviceUrl}>
                        {pillar.serviceLabel} <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 06 — EDITORIAL QUALITY STANDARDS                             */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-24 bg-[#F7F8FC] border-b border-slate-200/70">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF941E]">
              EDITORIAL INTEGRITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080F35] mt-2">
              Our Approach to Useful, Practical & Reliable Insights
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              We aim to publish honest, understandable information tailored for entrepreneurs and growing businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {EDITORIAL_STANDARDS.map((std) => (
              <div
                key={std.num}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#080F35] text-[#FFD84A] flex items-center justify-center font-bold text-sm mb-5">
                  {std.num}
                </div>
                <h3 className="text-lg font-bold text-[#080F35] mb-2">{std.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{std.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 07 — FOUR KNOWLEDGE CATEGORIES DEEP DIVE                     */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] text-white border-b border-white/10">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFD84A]">
              SYSTEMATIC FRAMEWORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Four Core Marketing Domains We Practice Every Day
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#D5DAE7]/80">
              Clear principles connecting business objectives to digital marketing execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {KNOWLEDGE_CATEGORIES_DEEP.map((item) => (
              <div
                key={item.num}
                className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-[#FFD84A]">{item.num}</span>
                  <h3 className="text-lg font-bold text-white mt-3 mb-2">{item.title}</h3>
                  <p className="text-xs text-[#D5DAE7]/80 leading-relaxed mb-4">{item.summary}</p>
                </div>
                <ul className="space-y-1.5 pt-4 border-t border-white/10 text-xs text-[#D5DAE7]/70">
                  {item.topics.map((t, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#FF941E]">✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 08 — HOW WE DEVELOP OUR CONTENT                              */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF941E]">
              EDITORIAL METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080F35] mt-2">
              From Research to Actionable Digital Insights
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Our 6-step framework for crafting practical marketing guides that solve genuine business problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CONTENT_DEVELOPMENT_STEPS.map((step) => (
              <div
                key={step.step}
                className="relative bg-[#F7F8FC] rounded-3xl p-7 border border-slate-200/80 hover:border-[#FF941E]/40 hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-sm flex items-center justify-center">
                    {step.step}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Phase {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#080F35] mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 09 — CONTENT TOPICS FOR MODERN BUSINESSES                    */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-24 bg-[#F7F8FC] border-b border-slate-200/70">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF941E]">
              ESSENTIAL THEMES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080F35] mt-2">
              Key Marketing Disciplines Modern Businesses Must Understand
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Mastering these core areas separates fast-growing brands from stagnant competitors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODERN_TOPICS.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#080F35] text-[#FFD84A] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#080F35] mb-1">{topic.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{topic.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 10 — NORTH INDIA DIGITAL INSIGHTS                            */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] text-white border-b border-white/10">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFD84A]">
              REGIONAL COMMERCIAL DYNAMICS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Digital Growth Insights for Businesses Across North India
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#D5DAE7]/80">
              Understanding regional consumer psychology, search habits, and language nuances across our primary markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {NORTH_INDIA_REGIONS.map((item, i) => (
              <div
                key={i}
                className="rounded-3xl p-7 bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-[#FF941E]" />
                    <h3 className="text-lg font-bold text-white">{item.region}</h3>
                  </div>
                  <p className="text-xs text-[#D5DAE7]/80 leading-relaxed mb-6">{item.summary}</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFD84A] mb-1">
                    Optimal Digital Focus:
                  </p>
                  <p className="text-xs font-semibold text-white/95">{item.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 11 — UPCOMING GUIDES                                         */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF941E]">
              EDITORIAL PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080F35] mt-2">
              What's Coming Next?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Upcoming research guides and tactical frameworks currently in development by our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {UPCOMING_GUIDES.map((guide) => (
              <div
                key={guide.num}
                className="bg-[#F7F8FC] rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-slate-300">{guide.num}</span>
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                    Upcoming Guide
                  </div>
                  <h3 className="text-sm font-bold text-[#080F35] mt-3 mb-2">{guide.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{guide.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] font-medium text-slate-500">
                  Status: {guide.status}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 12 — BLOG FAQS                                               */}
      {/* ==================================================================== */}
      <section className="py-20 lg:py-24 bg-[#F7F8FC] border-b border-slate-200/70">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF941E]">
              HELPFUL ANSWERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#080F35] mt-2">
              Frequently Asked Questions About Digital Marketing Insights
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Clear, transparent answers about content marketing, SEO strategy, and growing online.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3.5">
            {BLOG_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#080F35] hover:text-[#FF941E] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#FF941E]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
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
      {/* SECTION 13 — FINAL CALL TO ACTION                                    */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] text-white py-20 lg:py-24">
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" aria-hidden />
        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-bold tracking-widest text-[#FFD84A] uppercase mb-4">
              READY TO SCALE YOUR BRAND?
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Have a Digital Growth Challenge?
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[#D5DAE7]/90 leading-relaxed max-w-2xl mx-auto">
              Let's discuss how the right website, SEO and digital marketing strategy can help your business move forward.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold hover:opacity-95 shadow-lg shadow-orange-500/25 px-8 rounded-full"
              >
                <Link to="/contact">
                  Discuss Your Project <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 font-semibold"
              >
                <Link to="/services">Explore Our Services</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </PageWrapper>
  );
}
