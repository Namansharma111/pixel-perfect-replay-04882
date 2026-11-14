import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/primitives";
import { ArticleCard } from "@/components/site/cards";
import { CTASection } from "@/components/site/CTASection";
import { PageWrapper } from "@/components/site/PageWrapper";
import { articles } from "@/data/articles";
import { pageHead } from "@/lib/seo";
import { absoluteUrl } from "@/config/site";

export const Route = createFileRoute("/articles/")({
  head: () =>
    pageHead({
      title: "Digital Marketing Articles & Guides | Social Waale",
      description:
        "Practical guides on SEO, social media marketing, Google Ads, branding, websites and content for businesses in Chandigarh and across North India.",
      path: "/articles",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Articles", path: "/articles" },
      ],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Social Waale Articles",
          url: absoluteUrl("/articles"),
          blogPost: articles.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            url: absoluteUrl(`/articles/${a.slug}`),
            datePublished: a.publishedAt,
          })),
        },
      ],
    }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const [featured, ...rest] = articles;
  return (
    <PageWrapper>
      <PageHero
        eyebrow="Articles"
        title={
          <>
            Digital marketing guides for <span className="text-gradient">growing businesses</span>
          </>
        }
        description="Clear, practical advice on SEO, social media, ads, branding and websites — written for business owners, not marketers."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
        ]}
      />
      <Section>
        {featured && (
          <div className="mb-10 grid lg:grid-cols-2">
            <ArticleCard article={featured} />
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Section>
      <CTASection />
    </PageWrapper>
  );
}
