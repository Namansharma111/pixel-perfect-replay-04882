import { useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
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
  articles,
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
        <p className="text-slate-700 leading-relaxed mb-5 text-base sm:text-lg">
          <InlineText text={block.text} />
        </p>
      );
    case "h3":
      return (
        <h3 className="text-xl sm:text-2xl font-bold text-[#080F35] mt-8 mb-4">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="space-y-3 my-5 pl-5 list-disc text-slate-700 text-base sm:text-lg marker:text-[#FF941E]">
          {block.items.map((t) => (
            <li key={t}>
              <InlineText text={t} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-3 my-5 pl-5 list-decimal text-slate-700 text-base sm:text-lg marker:font-bold marker:text-[#080F35]">
          {block.items.map((t) => (
            <li key={t}>
              <InlineText text={t} />
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div className="my-8 rounded-2xl border-l-4 border-l-[#FF941E] bg-[#F7F8FC] border border-slate-200/80 p-6 text-slate-800 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#FF941E] shrink-0 mt-0.5" />
            <div className="text-sm sm:text-base font-medium leading-relaxed">
              <InlineText text={block.text} />
            </div>
          </div>
        </div>
      );
  }
}

function ArticlePage() {
  const { slug } = Route.useLoaderData();
  const article = getArticle(slug)!;
  const related = getRelatedArticles(article, 3);
  const services = article.relatedServices.map(getService);
  const path = `/articles/${article.slug}`;

  // Latest 5 published articles excluding currently active article
  const recentArticles = articles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 5);

  // Previous & Next navigation
  const currentIndex = articles.findIndex((a) => a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  // Social share links
  const [copied, setCopied] = useState(false);
  const articleUrl = absoluteUrl(path);
  const shareTitle = encodeURIComponent(`${article.title} | Social Waale`);
  const encodedUrl = encodeURIComponent(articleUrl);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <PageWrapper>
      {/* ==================================================================== */}
      {/* HERO SECTION                                                         */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] text-white border-b border-white/10 pt-20 pb-12 lg:pt-28 lg:pb-16">
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" aria-hidden />
        <Container className="relative">
          {/* Top Navigation Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Articles", path: "/articles" },
                { name: article.title, path },
              ]}
            />
            <Link
              to="/articles"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFD84A] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to all articles
            </Link>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            {/* Category Pill */}
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#FFD84A] border border-white/15 backdrop-blur-md">
              {CATEGORY_LABELS[article.category]}
            </span>

            {/* H1 Title */}
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] text-white">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-[#D5DAE7]/90 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Metadata Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#D5DAE7]/80">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4 text-[#FF941E]" /> {article.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#FFD84A]" />{" "}
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#FF941E]" /> {article.readingMinutes} min read
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mx-auto mt-10 max-w-4xl rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
            <img
              src={CATEGORY_IMAGES[article.category]}
              alt={article.imageAlt}
              width={1200}
              height={675}
              className="w-full h-auto aspect-[16/9] object-cover"
              loading="eager"
            />
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* ARTICLE CONTENT & SIDEBAR                                            */}
      {/* ==================================================================== */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Sticky Sidebar */}
            <aside className="lg:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-28">
                {/* Recent Articles Widget */}
                <div className="bg-[#F7F8FC] rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#080F35] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF941E]" /> Recent Articles
                    </p>
                    <Link
                      to="/articles"
                      className="text-[11px] font-bold text-[#0E1B5A] hover:text-[#FF941E] transition-colors"
                    >
                      All Articles →
                    </Link>
                  </div>

                  <div className="space-y-3.5">
                    {recentArticles.map((item) => (
                      <Link
                        key={item.slug}
                        to="/articles/$slug"
                        params={{ slug: item.slug }}
                        className="group flex items-start gap-3 p-2 -mx-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200/70 transition-all duration-200"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200 border border-slate-200/80">
                          <img
                            src={CATEGORY_IMAGES[item.category]}
                            alt={item.imageAlt || item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3 text-[#FF941E] shrink-0" />
                            <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-[#080F35] group-hover:text-[#FF941E] line-clamp-2 leading-snug transition-colors">
                            {item.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Social Share Box */}
                <div className="bg-[#F7F8FC] rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#080F35] mb-3 flex items-center gap-2">
                    <Share2 className="w-3.5 h-3.5 text-[#FF941E]" /> Share this guide
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href={`https://api.whatsapp.com/send?text=${shareTitle}%20${encodedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#080F35] hover:border-slate-300 font-semibold text-center transition-all shadow-sm"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#080F35] hover:border-slate-300 font-semibold text-center transition-all shadow-sm"
                    >
                      LinkedIn
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#080F35] hover:border-slate-300 font-semibold text-center transition-all shadow-sm"
                    >
                      X (Twitter)
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#080F35] hover:border-slate-300 font-semibold text-center transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" /> Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Direct Consultation Widget */}
                <div className="rounded-2xl p-6 bg-gradient-to-br from-[#080F35] to-[#0E1B5A] text-white border border-white/10 shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FFD84A] mb-1">
                    CHANDIGARH GROWTH AGENCY
                  </p>
                  <h4 className="text-base font-bold text-white mb-2">
                    Need help executing this strategy?
                  </h4>
                  <p className="text-xs text-[#D5DAE7]/80 leading-relaxed mb-5">
                    Our team can audit your digital presence and execute tailored growth campaigns for your business.
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="w-full rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-bold text-xs"
                  >
                    <Link to="/contact">
                      Discuss Your Project <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main Article Body */}
            <article className="min-w-0 lg:col-span-8">
              {article.sections.map((s) => (
                <section key={s.id} aria-labelledby={s.id} className="mb-12">
                  <h2
                    id={s.id}
                    className="text-2xl sm:text-3xl font-extrabold text-[#080F35] mb-6 pt-4 border-t border-slate-100 first:border-0 first:pt-0"
                  >
                    {s.heading}
                  </h2>
                  {s.blocks.map((b, i) => (
                    <Block key={i} block={b} />
                  ))}
                </section>
              ))}

              {/* Previous & Next Article Navigation */}
              <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link
                    to="/articles/$slug"
                    params={{ slug: prevArticle.slug }}
                    className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-200 hover:border-[#FF941E] transition-all group"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous Article
                    </span>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-[#080F35] group-hover:text-[#FF941E] line-clamp-2 transition-colors">
                      {prevArticle.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}

                {nextArticle ? (
                  <Link
                    to="/articles/$slug"
                    params={{ slug: nextArticle.slug }}
                    className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-200 hover:border-[#FF941E] transition-all group text-right sm:text-right"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 inline-flex items-center gap-1 justify-end">
                      Next Article <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-[#080F35] group-hover:text-[#FF941E] line-clamp-2 transition-colors">
                      {nextArticle.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* ==================================================================== */}
      {/* ARTICLE FAQS (IF ANY)                                                */}
      {/* ==================================================================== */}
      {article.faqs && article.faqs.length > 0 && (
        <Section className="bg-[#F7F8FC] border-b border-slate-200/70" labelledBy="article-faq">
          <div className="mx-auto max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF941E] text-center block">
              DEEPEN YOUR UNDERSTANDING
            </span>
            <h2 id="article-faq" className="text-center text-2xl sm:text-3xl font-extrabold text-[#080F35] mt-1 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              <FAQList faqs={article.faqs} />
            </div>
          </div>
        </Section>
      )}

      {/* ==================================================================== */}
      {/* RELATED SERVICES                                                     */}
      {/* ==================================================================== */}
      {services.length > 0 && (
        <Section className="bg-white border-b border-slate-100">
          <SectionHeading eyebrow="RELATED SERVICES" title="How Social Waale Can Help" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Section>
      )}

      {/* ==================================================================== */}
      {/* RELATED ARTICLES                                                     */}
      {/* ==================================================================== */}
      <Section className="bg-[#F7F8FC] border-b border-slate-200/70">
        <SectionHeading eyebrow="KEEP EXPLORING" title="Related Articles & Growth Guides" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Section>

      {/* ==================================================================== */}
      {/* FINAL CALL TO ACTION                                                 */}
      {/* ==================================================================== */}
      <CTASection />
    </PageWrapper>
  );
}
