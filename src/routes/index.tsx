import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Handshake,
  HeartHandshake,
  Lightbulb,
  LineChart,
  MapPin,
  MessageSquareQuote,
  Rocket,
  ShieldCheck,
  Sparkles,
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
import { services } from "@/data/services";
import { SITE } from "@/config/site";
import { pageHead, faqSchema } from "@/lib/seo";

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
  head: () =>
    pageHead({
      title: "Digital Marketing Agency in Chandigarh | Social Waale",
      description:
        "Social Waale is a Chandigarh-based digital marketing agency for social media marketing, SEO, Google Ads, branding and websites across North India.",
      path: "/",
      jsonLd: [faqSchema(HOME_FAQS)],
    }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <AboutIntro />
      <ServicesGrid />
      <WhyChoose />
      <Process />
      <Industries />
      <FeaturedWork />
      <Locations />
      <Testimonials />
      <SeoContent />
      <Section labelledBy="faq-heading">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              align="left"
              id="faq-heading"
              eyebrow="FAQs"
              title="Questions businesses ask us"
              description="Straight answers about working with a digital marketing agency in Chandigarh."
            />
          </div>
          <div className="lg:col-span-8">
            <FAQList faqs={HOME_FAQS} />
          </div>
        </div>
      </Section>
      <CTASection />
    </>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative -mt-20 overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <Container className="relative grid items-center gap-14 pb-20 pt-12 lg:grid-cols-12 lg:pb-28 lg:pt-20">
        <div className="lg:col-span-6">
          <p className="eyebrow animate-in fade-in slide-in-from-bottom-3 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Chandigarh-based digital marketing agency
          </p>
          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.04] sm:text-6xl lg:text-[4.2rem] animate-in fade-in slide-in-from-bottom-4 duration-700">
            Digital Marketing That Turns Your Brand Into a{" "}
            <span className="text-gradient">Growth Story.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-5 duration-1000">
            At Social Waale, we help businesses build a powerful digital presence through strategic
            social media marketing, SEO, paid advertising, creative branding and conversion-focused
            digital solutions.
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            From building brand awareness to generating meaningful enquiries, we bring strategy,
            creativity and technology together to help your business move forward.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/contact">
                Let’s Grow Together <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/services">Explore Our Services</Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[Users, BarChart3, Sparkles].map((Icon, i) => (
                <span
                  key={i}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-surface-raised text-primary"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
            <span>
              Trusted by{" "}
              <strong className="text-foreground">{SITE.stats.clients} businesses</strong> across
              North India
            </span>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-square max-w-[560px]">
            <div className="absolute inset-6 rounded-full bg-primary/20 blur-3xl" aria-hidden />
            <img
              src={heroImg}
              alt="Glowing growth arrows and floating social media and analytics panels representing digital marketing growth"
              width={1280}
              height={1280}
              fetchPriority="high"
              className="relative h-full w-full rounded-[2.5rem] border border-border object-cover shadow-card"
            />
            <div className="glass absolute -left-4 top-10 flex animate-float items-center gap-3 rounded-2xl p-3 pr-5 shadow-card sm:-left-10">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
                <Bell className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">Just now</span>
                <span className="block text-sm font-bold">New enquiry received</span>
              </span>
            </div>
            <div className="glass absolute -right-3 top-1/2 animate-float-delayed rounded-2xl p-4 shadow-card sm:-right-8">
              <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <LineChart className="h-4 w-4 text-primary" /> Organic reach
              </span>
              <svg viewBox="0 0 120 40" className="mt-2 h-10 w-32" aria-hidden>
                <defs>
                  <linearGradient id="spark" x1="0" x2="1">
                    <stop offset="0" stopColor="var(--brand-yellow)" />
                    <stop offset="1" stopColor="var(--brand-orange)" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 34 L20 28 L36 30 L54 20 L72 22 L90 10 L118 4"
                  fill="none"
                  stroke="url(#spark)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="glass absolute -bottom-4 left-8 flex animate-float items-center gap-3 rounded-2xl p-3 pr-5 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-whatsapp/20 text-whatsapp">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">This week</span>
                <span className="block text-sm font-bold">Content calendar ready</span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Trust bar ---------------- */
function TrustBar() {
  const items = [
    { value: SITE.stats.clients, label: "Clients served", Icon: Users },
    { value: SITE.stats.services, label: "Digital marketing services", Icon: Sparkles },
    { value: "Chandigarh", label: "Based & serving North India", Icon: MapPin },
    { value: SITE.stats.experience, label: "Of focused agency experience", Icon: Rocket },
  ];
  return (
    <section
      aria-label="Why businesses trust Social Waale"
      className="relative border-y border-border bg-navy-deep/70"
    >
      <Container className="grid grid-cols-2 gap-px lg:grid-cols-4">
        {items.map(({ value, label, Icon }) => (
          <div key={label} className="flex items-center gap-4 px-2 py-8 sm:px-6">
            <IconBadge>
              <Icon className="h-5 w-5" />
            </IconBadge>
            <div>
              <p className="text-2xl font-extrabold text-foreground sm:text-3xl">{value}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
            </div>
          </div>
        ))}
      </Container>
      <div className="overflow-hidden border-t border-border py-4">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
          {[...services, ...services].map((s, i) => (
            <span key={i} className="flex items-center gap-10">
              {s.name} <span className="text-primary">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- About intro ---------------- */
function AboutIntro() {
  const points = [
    "Strategy first — every campaign starts with your business goals",
    "One team for social, search, ads, design and web",
    "Clear reporting you can actually understand",
    "Local understanding of North Indian audiences",
  ];
  return (
    <Section labelledBy="about-heading">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="reveal relative">
          <img
            src={aboutImg}
            alt="Social Waale creative workspace with analytics dashboard, social media feed and brand mood boards"
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
            eyebrow="About Social Waale"
            title={
              <>
                A Chandigarh agency built for{" "}
                <span className="text-gradient">ambitious brands</span>
              </>
            }
            description="Social Waale is a digital marketing and social media marketing agency based in Chandigarh. In our first years we’ve worked with 50+ businesses — from local shops and clinics to growing service brands — helping them show up online with confidence and turn attention into real conversations."
          />
          <ul className="mt-8 grid gap-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {p}
              </li>
            ))}
          </ul>
          <Button asChild variant="glass" size="lg" className="mt-8">
            <Link to="/about">
              More about us <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- Services ---------------- */
function ServicesGrid() {
  return (
    <Section labelledBy="services-heading" className="bg-gradient-section">
      <SectionHeading
        id="services-heading"
        eyebrow="What we do"
        title={
          <>
            10 services. <span className="text-gradient">One growth partner.</span>
          </>
        }
        description="From the first impression on Instagram to the final click on your website, we cover every stage of your customer’s digital journey."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((s, i) => (
          <ServiceCard key={s.slug} service={s} index={i} />
        ))}
        <Link
          to="/contact"
          className="reveal card-premium group flex flex-col justify-between overflow-hidden border-primary/30 bg-navy p-7 sm:col-span-2 xl:col-span-2"
        >
          <div>
            <p className="eyebrow">Not sure where to start?</p>
            <h3 className="mt-4 text-2xl font-extrabold leading-snug">
              Get a free consultation and we’ll recommend the right mix for your business.
            </h3>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
            Talk to our team{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </Section>
  );
}

/* ---------------- Why choose ---------------- */
function WhyChoose() {
  const items = [
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
  return (
    <Section labelledBy="why-heading">
      <SectionHeading
        id="why-heading"
        eyebrow="Why Social Waale"
        title={
          <>
            Why businesses choose <span className="text-gradient">Social Waale</span>
          </>
        }
        description="We’re a young, hands-on agency — which means you get senior attention, quick decisions and a team that genuinely cares about your growth."
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

/* ---------------- Process ---------------- */
function Process() {
  const steps = [
    {
      title: "Discover",
      text: "A free discovery call to understand your business, audience, goals and current digital presence.",
    },
    {
      title: "Strategise",
      text: "A clear plan covering channels, content themes, budgets, timelines and the results we’ll track.",
    },
    {
      title: "Create",
      text: "Our team produces creatives, content, campaigns and pages that reflect your brand.",
    },
    {
      title: "Launch",
      text: "Campaigns go live with proper tracking so every enquiry and click is measured.",
    },
    {
      title: "Optimise & Grow",
      text: "We review performance regularly, refine what works and scale what brings results.",
    },
  ];
  return (
    <Section labelledBy="process-heading" className="bg-gradient-section">
      <SectionHeading
        id="process-heading"
        eyebrow="Our working process"
        title="A simple, proven way of working"
        description="No confusion, no guesswork. Here’s how we take your brand from where it is today to where you want it to be."
      />
      <ol className="relative mt-16 grid gap-6 md:grid-cols-5">
        <div
          className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-brand opacity-40 md:block"
          aria-hidden
        />
        {steps.map((s, i) => (
          <li key={s.title} className="reveal relative">
            <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-lg font-extrabold text-primary-foreground shadow-glow">
              {i + 1}
            </span>
            <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
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

/* ---------------- Testimonials (honest) ---------------- */
function Testimonials() {
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
function SeoContent() {
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
        </div>
      </div>
    </Section>
  );
}
