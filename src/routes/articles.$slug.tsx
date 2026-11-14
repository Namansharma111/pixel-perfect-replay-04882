import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import {
  Breadcrumbs,
  Container,
  InlineText,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { ArticleCard, ServiceCard } from "@/components/site/cards";
import { FAQList } from "@/components/site/FAQ";
import { CTASection } from "@/components/site/CTASection";
import { PageWrapper } from "@/components/site/PageWrapper";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_IMAGES,
  CATEGORY_LABELS,
  formatDate,
  getArticle,
  getRelatedArticles,
} from "@/data/articles";
import { getService } from "@/data/services";
import type { ArticleBlock } from "@/data/types";
import { pageHead, faqSchema, organizationRef } from "@/lib/seo";
import { absoluteUrl } from "@/config/site";

export const Route = createFileRoute("/articles/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { slug: article.slug };
  },
  head: ({ loaderData, params }) => {
    const article = loaderData ? getArticle(loaderData.slug) : undefined;
    if (!article) {
      return pageHead({
        title: "Article not found | Social Waale",
        description:
          "This article could not be found. Browse all Social Waale digital marketing articles and guides.",
        path: `/articles/${params.slug}`,
        noindex: true,
      });
    }
    const path = `/articles/${article.slug}`;
    return pageHead({
      title: article.metaTitle,
      description: article.metaDescription,
      path,
      type: "article",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Articles", path: "/articles" },
        { name: article.title, path },
      ],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.metaDescription,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: { "@type": "Organization", name: article.author },
          publisher: organizationRef,
          mainEntityOfPage: absoluteUrl(path),
          articleSection: CATEGORY_LABELS[article.category],
        },
        ...(article.faqs?.length ? [faqSchema(article.faqs)] : []),
      ],
    });
  },
  component: ArticlePage,
});

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <InlineText text={block.text} />
        </p>
      );
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return (
        <ul>
          {block.items.map((t) => (
            <li key={t}>
              <InlineText text={t} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((t) => (
            <li key={t}>
              <InlineText text={t} />
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div className="my-6 rounded-2xl border border-primary/30 bg-primary/10 p-5 text-foreground">
          <InlineText text={block.text} />
        </div>
      );
  }
}

function ArticlePage() {
  const { slug } = Route.useLoaderData();
  const article = getArticle(slug)!;
  const related = getRelatedArticles(article);
  const services = article.relatedServices.map(getService);
  const path = `/articles/${article.slug}`;

  return (
    <PageWrapper>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35]">
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <Container className="relative pb-12 pt-10 lg:pt-14">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Articles", path: "/articles" },
              { name: article.title, path },
            ]}
          />
          <div className="mx-auto mt-10 max-w-4xl text-center">
            <span className="glass inline-block rounded-full px-4 py-1.5 text-xs font-semibold text-primary">
              {CATEGORY_LABELS[article.category]}
            </span>
            <h1 className="mt-6 text-3xl font-extrabold leading-[1.12] sm:text-5xl">
              {article.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
              {article.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {article.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />{" "}
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {article.readingMinutes} min read
              </span>
            </div>
          </div>
          <img
            src={CATEGORY_IMAGES[article.category]}
            alt={article.imageAlt}
            width={1200}
            height={688}
            className="mx-auto mt-10 aspect-[16/9] w-full max-w-5xl rounded-[2rem] border border-border object-cover shadow-card"
          />
        </Container>
      </section>

      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav aria-label="Table of contents" className="card-premium p-5 lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                In this article
              </p>
              <ol className="mt-4 space-y-2.5 text-sm">
                {article.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <article className="prose-article min-w-0 lg:col-span-9 lg:max-w-3xl">
            {article.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.heading}</h2>
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </section>
            ))}

            <div className="not-prose mt-12 rounded-3xl border border-primary/25 bg-navy p-7">
              <p className="text-lg font-bold text-foreground">
                Need help putting this into practice?
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Our team can plan and run it for your business.
              </p>
              <Button asChild variant="hero" size="lg" className="mt-5">
                <Link to="/contact">
                  Get a Free Consultation <ArrowRight />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </Container>

      {article.faqs && article.faqs.length > 0 && (
        <Section className="bg-gradient-section" labelledBy="article-faq">
          <div className="mx-auto max-w-3xl">
            <h2 id="article-faq" className="text-center text-3xl font-extrabold">
              Frequently asked questions
            </h2>
            <div className="mt-10">
              <FAQList faqs={article.faqs} />
            </div>
          </div>
        </Section>
      )}

      {services.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Related services" title="How we can help" />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Section>
      )}

      <Section className="bg-gradient-section">
        <SectionHeading eyebrow="Keep reading" title="Related articles" />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Section>

      <CTASection />
    </PageWrapper>
  );
}
