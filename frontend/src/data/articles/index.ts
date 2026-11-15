import type { Article, ArticleCategory } from "../types";
import { articlesPart1 } from "./part1";
import { articlesPart2 } from "./part2";
import { articlesPart3 } from "./part3";

import seoImg from "@/assets/blog-seo.jpg";
import socialImg from "@/assets/blog-social.jpg";
import adsImg from "@/assets/blog-ads.jpg";
import digitalImg from "@/assets/blog-digital.jpg";
import brandingImg from "@/assets/blog-branding.jpg";
import websiteImg from "@/assets/blog-website.jpg";
import contentImg from "@/assets/blog-content.jpg";

/**
 * To publish a new article: add an Article object to part1.ts / part2.ts / part3.ts.
 * It is automatically listed on /articles, gets its own page at
 * /articles/<slug>, and is added to the sitemap.
 */
export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  seo: "SEO",
  "social-media-marketing": "Social Media Marketing",
  "google-ads": "Google Ads",
  "digital-marketing": "Digital Marketing",
  branding: "Branding",
  "website-development": "Website Development",
  "content-marketing": "Content Marketing",
};

export const CATEGORY_IMAGES: Record<ArticleCategory, string> = {
  seo: seoImg,
  "social-media-marketing": socialImg,
  "google-ads": adsImg,
  "digital-marketing": digitalImg,
  branding: brandingImg,
  "website-development": websiteImg,
  "content-marketing": contentImg,
};

export const articles: Article[] = [...articlesPart1, ...articlesPart2, ...articlesPart3].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(article: Article, count = 3): Article[] {
  const same = articles.filter((a) => a.slug !== article.slug && a.category === article.category);
  const rest = articles.filter((a) => a.slug !== article.slug && a.category !== article.category);
  return [...same, ...rest].slice(0, count);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d} ${months[(m ?? 1) - 1]} ${y}`;
}
