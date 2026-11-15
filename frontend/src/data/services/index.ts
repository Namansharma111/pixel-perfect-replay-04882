import type { ServiceContent, ServiceSlug } from "../types";
import { servicesPart1 } from "./part1";
import { servicesPart2 } from "./part2";

/** Display order for all 10 services. */
export const SERVICE_ORDER: ServiceSlug[] = [
  "seo-services",
  "google-ads-performance-marketing",
  "social-media-marketing",
  "content-marketing-email-automation",
  "branding-creative-strategy",
  "website-app-development",
  "ui-ux-cro-optimization",
  "offline-local-advertising",
  "public-relations",
  "photoshoot-creative-media",
];

const bySlug = new Map<ServiceSlug, ServiceContent>(
  [...servicesPart1, ...servicesPart2].map((s) => [s.slug, s]),
);

export const services: ServiceContent[] = SERVICE_ORDER.map((slug) => {
  const s = bySlug.get(slug);
  if (!s) throw new Error(`Missing service content for ${slug}`);
  return s;
});

export function getService(slug: ServiceSlug): ServiceContent {
  const s = bySlug.get(slug);
  if (!s) throw new Error(`Missing service content for ${slug}`);
  return s;
}
