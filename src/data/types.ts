// Shared content types for Social Waale site data.

export type FAQ = { q: string; a: string };

export type TitledItem = { title: string; description: string };

export type ServiceSlug =
  | "seo-services"
  | "google-ads-performance-marketing"
  | "social-media-marketing"
  | "content-marketing-email-automation"
  | "branding-creative-strategy"
  | "website-app-development"
  | "ui-ux-cro-optimization"
  | "offline-local-advertising"
  | "public-relations"
  | "photoshoot-creative-media";

export type ServiceContent = {
  slug: ServiceSlug;
  /** Full display name, e.g. "SEO & Organic Growth" */
  name: string;
  /** Short name for menus, e.g. "SEO" */
  shortName: string;
  /** 1–2 sentence card description */
  tagline: string;
  /** <= 60 chars */
  metaTitle: string;
  /** 140–160 chars */
  metaDescription: string;
  /** The single H1 for the page */
  h1: string;
  heroEyebrow: string;
  /** 2–3 sentence hero paragraph */
  heroIntro: string;
  intro: { heading: string; paragraphs: string[] };
  problems: TitledItem[];
  deliverables: TitledItem[];
  benefits: TitledItem[];
  process: TitledItem[];
  whoNeeds: { heading: string; items: string[] };
  whyUs: TitledItem[];
  related: ServiceSlug[];
  faqs: FAQ[];
};

export type ArticleCategory =
  | "seo"
  | "social-media-marketing"
  | "google-ads"
  | "digital-marketing"
  | "branding"
  | "website-development"
  | "content-marketing";

/**
 * Paragraph and list text may contain inline markdown links: [anchor text](/seo-services)
 * Only internal links (starting with "/") are used.
 */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string };

export type ArticleSection = { id: string; heading: string; blocks: ArticleBlock[] };

export type Article = {
  slug: string;
  title: string;
  /** <= 60 chars */
  metaTitle: string;
  /** 140–160 chars */
  metaDescription: string;
  excerpt: string;
  category: ArticleCategory;
  author: string;
  /** ISO date YYYY-MM-DD */
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  /** Alt text describing the featured image */
  imageAlt: string;
  sections: ArticleSection[];
  faqs?: FAQ[];
  relatedServices: ServiceSlug[];
};

export type LegalSection = { heading: string; paragraphs: string[]; list?: string[] };
