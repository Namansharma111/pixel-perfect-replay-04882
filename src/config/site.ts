/**
 * Central site configuration. The domain is not final yet:
 * set VITE_SITE_URL (e.g. "https://socialwaale.com") once it is decided and every
 * canonical URL, Open Graph URL, sitemap and schema entry switches to it automatically.
 * Until then canonical URLs are relative and the sitemap uses the requesting host.
 */
export const SITE = {
  name: "Social Waale",
  legalName: "Social Waale",
  tagline: "Digital Marketing & Social Media Marketing Agency in Chandigarh",
  description:
    "Social Waale is a Chandigarh-based digital marketing agency offering social media marketing, SEO, Google Ads, branding, websites and creative media for businesses across North India.",
  url: (import.meta.env["VITE_SITE_URL"] as string | undefined)?.replace(/\/$/, "") ?? "",
  phone: "+91 9805789363",
  phoneHref: "tel:+919805789363",
  email: "socialgrow111@gmail.com",
  emailHref: "mailto:socialgrow111@gmail.com",
  whatsappHref: "https://wa.me/919805789363",
  whatsappMessage: (text: string) => `https://wa.me/919805789363?text=${encodeURIComponent(text)}`,
  location: "Chandigarh, India",
  socials: {
    instagram: "https://www.instagram.com/socialwaale/",
    facebook: "https://www.facebook.com/socialwaale/",
    linkedin: "https://www.linkedin.com/in/social-waale-b82695449/",
  },
  stats: {
    clients: "50+",
    services: "10",
    experience: "1–2 Years",
  },
  locations: ["Chandigarh", "Himachal Pradesh", "Punjab", "Haryana", "Uttar Pradesh", "Delhi NCR"],
} as const;

export function absoluteUrl(path: string): string {
  return SITE.url ? `${SITE.url}${path}` : path;
}
