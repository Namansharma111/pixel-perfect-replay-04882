import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Phone,
  AlertTriangle,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, PageHero, IconBadge, Container } from "./primitives";
import { ServiceCard, ArticleCard } from "./cards";
import { FAQList } from "./FAQ";
import { CTASection } from "./CTASection";
import { ContactForm } from "./ContactForm";
import { SERVICE_ICONS } from "./service-icons";
import { getService } from "@/data/services";
import { articles } from "@/data/articles";
import type { ServiceSlug } from "@/data/types";
import { SERVICE_OPTIONS } from "@/lib/form-schemas";
import { SITE, absoluteUrl } from "@/config/site";
import { pageHead, faqSchema, organizationRef } from "@/lib/seo";

/** head() output for a service page: meta, canonical, Service + FAQ + breadcrumb schema. */
export function serviceHead(slug: ServiceSlug) {
  const s = getService(slug);
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
  const s = getService(slug);
  const Icon = SERVICE_ICONS[s.slug];
  const related = s.related.map(getService);
  const relatedArticles = articles.filter((a) => a.relatedServices.includes(s.slug)).slice(0, 3);
  const defaultService = toServiceOption(s.name);

  return (
    <>
      <PageHero
        eyebrow={s.heroEyebrow}
        title={s.h1}
        description={s.heroIntro}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: s.name, path: `/${s.slug}` },
        ]}
        aside={
          <div className="card-premium relative overflow-hidden p-7">
            <div
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
              aria-hidden
            />
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
              <Icon className="h-6 w-6" />
            </span>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              What’s included
            </p>
            <ul className="mt-4 space-y-3">
              {s.deliverables.slice(0, 5).map((d) => (
                <li key={d.title} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-foreground">{d.title}</span>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="hero" size="xl">
            <a href="#enquiry">
              Get a Free Consultation <ArrowRight />
            </a>
          </Button>
          <Button asChild variant="whatsapp" size="xl">
            <a
              href={SITE.whatsappMessage(`Hi Social Waale, I’m interested in ${s.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle /> WhatsApp
            </a>
          </Button>
          <Button asChild variant="glass" size="xl">
            <a href={SITE.phoneHref}>
              <Phone /> Call Now
            </a>
          </Button>
        </div>
      </PageHero>

      {/* Intro */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{s.intro.heading}</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
            {s.intro.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      {/* Problems */}
      <Section className="bg-gradient-section">
        <SectionHeading eyebrow="Common challenges" title="Problems we help you solve" />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {s.problems.map((p) => (
            <div key={p.title} className="reveal card-premium p-7">
              <IconBadge className="border-brand-orange/30 bg-brand-orange/10 text-brand-orange">
                <AlertTriangle className="h-5 w-5" />
              </IconBadge>
              <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Deliverables */}
      <Section>
        <SectionHeading
          eyebrow="What we deliver"
          title={`What our ${s.shortName} service includes`}
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {s.deliverables.map((d, i) => (
            <div key={d.title} className="reveal card-premium flex gap-5 p-7">
              <span className="text-gradient text-3xl font-extrabold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-bold">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {d.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section className="bg-gradient-section">
        <SectionHeading eyebrow="Benefits" title="What your business gains" />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {s.benefits.map((b) => (
            <div key={b.title} className="reveal card-premium card-hover p-7">
              <IconBadge>
                <Sparkles className="h-5 w-5" />
              </IconBadge>
              <h3 className="mt-5 text-lg font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section>
        <SectionHeading eyebrow="Our process" title="How we work, step by step" />
        <ol className="mx-auto mt-14 max-w-3xl space-y-4">
          {s.process.map((p, i) => (
            <li key={p.title} className="reveal card-premium flex gap-5 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-brand font-extrabold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Who needs it + Why us */}
      <Section className="bg-gradient-section">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">
              <span className="h-px w-6 bg-primary" aria-hidden />
              Who it’s for
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight">{s.whoNeeds.heading}</h2>
            <ul className="mt-8 space-y-3">
              {s.whoNeeds.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Users className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow">
              <span className="h-px w-6 bg-primary" aria-hidden />
              Why Social Waale
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight">
              Why choose us for {s.shortName}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {s.whyUs.map((w) => (
                <div
                  key={w.title}
                  className="reveal rounded-2xl border border-border bg-surface/70 p-5"
                >
                  <h3 className="font-bold">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {w.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Enquiry form */}
      <section id="enquiry" className="relative scroll-mt-24 py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                align="left"
                eyebrow="Free consultation"
                title={`Talk to us about ${s.shortName}`}
                description="Share a few details and we’ll get back with honest recommendations for your business."
              />
              <div className="mt-8 space-y-3 text-sm">
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-3 text-foreground hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary" /> {SITE.phone}
                </a>
                <a
                  href={SITE.emailHref}
                  className="flex items-center gap-3 text-foreground hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4 text-primary" /> {SITE.email}
                </a>
              </div>
            </div>
            <div className="card-premium p-6 sm:p-8 lg:col-span-7">
              <ContactForm defaultService={defaultService} />
            </div>
          </div>
        </Container>
      </section>

      {/* Related services */}
      <Section className="bg-gradient-section">
        <SectionHeading eyebrow="Related services" title="Services that work well together" />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <ServiceCard key={r.slug} service={r} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {relatedArticles.length > 0 && (
        <Section>
          <SectionHeading eyebrow="From our articles" title="Helpful reads" />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      <Section labelledBy="service-faq">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              align="left"
              id="service-faq"
              eyebrow="FAQs"
              title={`${s.shortName} questions, answered`}
            />
          </div>
          <div className="lg:col-span-8">
            <FAQList faqs={s.faqs} />
          </div>
        </div>
      </Section>

      <CTASection
        title={`Ready to grow with ${s.shortName}?`}
        whatsappText={`Hi Social Waale, I’d like a free consultation for ${s.name}.`}
      />
    </>
  );
}
