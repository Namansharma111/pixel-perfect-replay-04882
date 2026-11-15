import { SITE, absoluteUrl } from "@/config/site";

type Crumb = { name: string; path: string };

type PageHeadInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>[];
  breadcrumbs?: Crumb[];
  noindex?: boolean;
};

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export const organizationRef = {
  "@type": "Organization",
  name: SITE.name,
  url: absoluteUrl("/"),
};

/** Builds head() output for a route: title, description, canonical, OG/Twitter and JSON-LD. */
export function pageHead({
  title,
  description,
  path,
  type = "website",
  jsonLd = [],
  breadcrumbs,
  noindex,
}: PageHeadInput) {
  const url = absoluteUrl(path);
  const schemas = [...jsonLd];
  if (breadcrumbs) schemas.push(breadcrumbSchema(breadcrumbs));

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: schemas.map((s) => ({
      type: "application/ld+json",
      children: JSON.stringify(s),
    })),
  };
}
