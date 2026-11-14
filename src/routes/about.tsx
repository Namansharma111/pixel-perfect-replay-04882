import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  HeartHandshake,
  LineChart,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import aboutImg from "@/assets/about-studio.jpg";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading, IconBadge } from "@/components/site/primitives";
import { CTASection } from "@/components/site/CTASection";
import { pageHead } from "@/lib/seo";
import { SITE } from "@/config/site";

const VALUES = [
  {
    Icon: ShieldCheck,
    title: "Honest advice",
    description:
      "We recommend what your business actually needs — even if that means starting small.",
  },
  {
    Icon: LineChart,
    title: "Clear reporting",
    description:
      "Simple monthly reports that show what was done, what worked and what we’ll change next.",
  },
  {
    Icon: HeartHandshake,
    title: "Real partnership",
    description:
      "One team that understands your business, reachable on call and WhatsApp when you need us.",
  },
  {
    Icon: Sparkles,
    title: "Creative that converts",
    description:
      "Good-looking content is the start. We design every post, ad and page to move people to act.",
  },
];

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Social Waale | Digital Marketing Agency Chandigarh",
      description:
        "Meet Social Waale, a Chandigarh digital marketing agency helping businesses across North India grow with social media, SEO, ads, branding and websites.",
      path: "/about",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ],
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Social Waale"
        title={
          <>
            A Chandigarh agency built to help{" "}
            <span className="text-gradient">local brands grow</span>
          </>
        }
        description="Social Waale is a digital marketing and social media marketing agency based in Chandigarh. We help businesses across North India get discovered, build trust and turn attention into enquiries."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img
            src={aboutImg}
            alt="Social Waale team planning a digital marketing campaign in their Chandigarh studio"
            width={1200}
            height={900}
            loading="lazy"
            className="reveal aspect-[4/3] w-full rounded-[2rem] border border-border object-cover shadow-card"
          />
          <div>
            <SectionHeading align="left" eyebrow="Our story" title="Why we started Social Waale" />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                Many growing businesses know they need to be online, but get stuck between scattered
                freelancers, confusing reports and campaigns that don’t bring enquiries.
              </p>
              <p>
                We started Social Waale to be the one team that handles it properly — strategy,
                content, ads, websites and reporting, all connected to real business goals.
              </p>
              <p>
                Over the last {SITE.stats.experience.toLowerCase()} we’ve worked with{" "}
                {SITE.stats.clients} clients across different industries, and every project has
                sharpened how we plan, create and measure.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-section">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { value: SITE.stats.clients, label: "Clients served" },
            { value: SITE.stats.services, label: "Services under one roof" },
            { value: SITE.stats.experience, label: "Of hands-on experience" },
          ].map((s) => (
            <div key={s.label} className="reveal card-premium p-8 text-center">
              <p className="text-gradient text-5xl font-extrabold">{s.value}</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="reveal card-premium p-8">
            <IconBadge>
              <Compass className="h-5 w-5" />
            </IconBadge>
            <h2 className="mt-5 text-2xl font-extrabold">Our mission</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              To make professional, results-focused digital marketing accessible to growing
              businesses in Chandigarh and across North India — with clear communication and no
              jargon.
            </p>
          </div>
          <div className="reveal card-premium p-8">
            <IconBadge>
              <MapPin className="h-5 w-5" />
            </IconBadge>
            <h2 className="mt-5 text-2xl font-extrabold">Where we work</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              We’re based in Chandigarh and work with businesses in{" "}
              {SITE.locations.slice(1).join(", ")} — mostly over calls, WhatsApp and shared reports,
              with in-person meetings in the tricity.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-section">
        <SectionHeading eyebrow="What we believe" title="How we work with every client" />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ Icon, title, description }) => (
            <div key={title} className="reveal card-premium card-hover p-7">
              <IconBadge>
                <Icon className="h-5 w-5" />
              </IconBadge>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="hero" size="xl">
            <Link to="/services">
              Explore our services <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
