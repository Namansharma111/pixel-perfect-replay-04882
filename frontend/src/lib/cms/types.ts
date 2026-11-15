export type AdminRole = "admin" | "editor";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  passwordHash: string; // scrypt:<salt>:<derivedKey> or secure salted representation
  salt?: string | undefined;
  failedAttempts?: number | undefined;
  lockedUntil?: string | undefined; // ISO timestamp for temporary account lockout
  resetToken?: string | undefined;
  resetTokenExpires?: string | undefined; // ISO timestamp
  avatarUrl?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
}

export type ArticleStatus = "draft" | "published" | "scheduled" | "archived";

export interface ArticleSEO {
  title: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  canonicalUrl?: string;
  robots: "index,follow" | "noindex,follow" | "noindex,nofollow";
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard: "summary_large_image" | "summary";
  seoScore: number;
  notes?: string;
}

export interface ArticleFAQ {
  q: string;
  a: string;
}

export interface CMSArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  featuredImage: string;
  featuredImageAlt: string;
  featuredImageTitle?: string;
  category: string; // Category slug
  tags: string[]; // Tag slugs
  authorId: string;
  authorName: string;
  status: ArticleStatus;
  publishedAt: string;
  updatedAt: string;
  scheduledAt?: string;
  readingMinutes: number;
  isFeatured: boolean;
  isSticky: boolean;
  allowComments: boolean;
  allowSharing: boolean;
  views: number;
  seo: ArticleSEO;
  faqs: ArticleFAQ[];
  relatedArticleIds: string[];
  relatedServices: string[];
  revisions?: {
    id: string;
    timestamp: string;
    authorName: string;
    title: string;
    contentHtml: string;
  }[];
}

export interface CMSCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

export interface CMSTag {
  id: string;
  slug: string;
  name: string;
}

export interface CMSAuthor {
  id: string;
  slug: string;
  name: string;
  designation: string;
  bio: string;
  avatarUrl: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface CMSMediaItem {
  id: string;
  filename: string;
  url: string;
  fileType: string;
  fileSize: number; // bytes
  dimensions?: { width: number; height: number };
  altText: string;
  title: string;
  uploadedAt: string;
}

export interface CMSRedirect {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302;
  createdAt: string;
  hits: number;
}

export interface CMSSiteSettings {
  siteName: string;
  siteDescription: string;
  ga4MeasurementId?: string;
  googleSearchConsoleCode?: string;
  googleTagManagerId?: string;
  customRobotsTxt?: string;
  enableXmlSitemap: boolean;
  enableRssFeed: boolean;
}

// ---------------------------------------------------------------------------
// SERVICE MANAGEMENT TYPES
// ---------------------------------------------------------------------------

export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  step?: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface CMSService {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  heroEyebrow: string;
  h1: string;
  heroIntro: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  robots?: "index,follow" | "noindex,follow" | "noindex,nofollow";
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCardImage?: string;
  iconName: string;
  icon?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  category: string;
  displayOrder: number;
  status: "published" | "draft";
  contentHtml?: string;
  problems: { title: string; description: string }[];
  deliverables: ServiceDeliverable[];
  benefits: { title: string; description: string }[];
  process: ServiceProcessStep[];
  whyUs: { title: string; description: string }[];
  whoNeeds: { heading: string; items: string[] };
  faqs: ServiceFAQ[];
  relatedSlugs: string[];
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// HOMEPAGE MANAGEMENT TYPES
// ---------------------------------------------------------------------------

export interface CMSHomepageHeroSlide {
  id: string;
  title: string;
  subheading: string;
  description: string;
  desktopBannerImage: string;
  mobileBannerImage?: string;
  imageAlt: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export interface CMSHomepageHero {
  enabled: boolean;
  eyebrowBadge: string;
  h1: string;
  subheading: string;
  description1: string;
  description2: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  desktopBannerImage: string;
  mobileBannerImage?: string;
  imageAlt: string;
  stats: { value: string; label: string }[];
  floatingCardTitle: string;
  floatingCardSubtitle: string;
  floatingBadgeText: string;
  slides?: CMSHomepageHeroSlide[];
}

export interface CMSHomepageTrustBar {
  enabled: boolean;
  eyebrowBadge: string;
  heading: string;
  description: string;
  stats: { value: string; title: string; description: string }[];
}

export interface CMSHomepageAbout {
  enabled: boolean;
  eyebrowBadge: string;
  heading: string;
  descriptionParagraphs: string[];
  featuredImage: string;
  imageAlt: string;
  readMoreButtonText: string;
  readMoreButtonLink: string;
  highlights: string[];
}

export interface CMSHomepageServices {
  enabled: boolean;
  eyebrowBadge: string;
  heading: string;
  description: string;
  mode: "all" | "selected";
  selectedSlugs: string[];
  ctaButtonText: string;
  ctaButtonLink: string;
}

export interface CMSHomepageWhyChooseItem {
  title: string;
  description: string;
  iconName?: string;
}

export interface CMSHomepageWhyChoose {
  enabled: boolean;
  eyebrowBadge: string;
  heading: string;
  description: string;
  items: CMSHomepageWhyChooseItem[];
}

export interface CMSHomepageProcessStep {
  step: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface CMSHomepageProcess {
  enabled: boolean;
  eyebrowBadge: string;
  heading: string;
  description: string;
  steps: CMSHomepageProcessStep[];
}

export interface CMSHomepageTestimonial {
  id: string;
  name: string;
  designation: string;
  company?: string;
  text: string;
  rating?: number;
  avatarUrl?: string;
  enabled: boolean;
}

export interface CMSHomepageTestimonials {
  enabled: boolean;
  eyebrowBadge: string;
  heading: string;
  description: string;
  items: CMSHomepageTestimonial[];
}

export interface CMSHomepageFaqItem {
  q: string;
  a: string;
  enabled: boolean;
}

export interface CMSHomepageFaqs {
  enabled: boolean;
  eyebrowBadge: string;
  heading: string;
  description: string;
  items: CMSHomepageFaqItem[];
}

export interface CMSHomepageCta {
  enabled: boolean;
  heading: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  eyebrowBadge?: string;
}

export interface CMSHomepageArticles {
  enabled: boolean;
  eyebrowBadge: string;
  heading: string;
  description: string;
  mode: "auto" | "manual";
  selectedSlugs?: string[];
}

export interface CMSHomepageIndustries {
  enabled: boolean;
  eyebrowBadge: string;
  heading: string;
  description: string;
}

export interface CMSHomepageLocations {
  enabled: boolean;
  eyebrowBadge: string;
  heading: string;
  description: string;
}

export interface CMSHomepagePortfolio {
  enabled: boolean;
  heading: string;
  description: string;
}

export interface CMSHomepageSeo {
  metaTitle: string;
  metaDescription: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  robots: "index,follow" | "noindex,follow" | "noindex,nofollow";
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  customSchemaJson?: string;
}

export interface CMSHomepageRevision {
  id: string;
  timestamp: string;
  authorName: string;
  note?: string;
  data: CMSHomepageData;
}

export interface CMSHomepageData {
  hero: CMSHomepageHero;
  trustBar: CMSHomepageTrustBar;
  about: CMSHomepageAbout;
  services: CMSHomepageServices;
  portfolio: CMSHomepagePortfolio;
  whyChoose: CMSHomepageWhyChoose;
  process: CMSHomepageProcess;
  industries: CMSHomepageIndustries;
  testimonials: CMSHomepageTestimonials;
  locations: CMSHomepageLocations;
  articles: CMSHomepageArticles;
  faqs: CMSHomepageFaqs;
  cta: CMSHomepageCta;
  seo: CMSHomepageSeo;
  sectionOrder: string[];
}

export interface CMSHomepage {
  id: string;
  status: "published" | "draft";
  updatedAt: string;
  live: CMSHomepageData;
  draft?: CMSHomepageData;
  revisions: CMSHomepageRevision[];
}

export type DownloaderToolType =
  | "all"
  | "video"
  | "reels"
  | "photo"
  | "story"
  | "carousel"
  | "viewer";

export interface CMSDownloaderHowToStep {
  step: number;
  title: string;
  description: string;
  image?: string | undefined;
  icon?: string | undefined;
}

export interface CMSDownloaderFeature {
  icon?: string | undefined;
  title: string;
  description: string;
}

export interface CMSDownloaderFaq {
  id?: string | undefined;
  q: string;
  a: string;
  question?: string | undefined;
  answer?: string | undefined;
  enabled?: boolean | undefined;
  order?: number | undefined;
}

export interface CMSDownloaderBenefit {
  title: string;
  description: string;
  icon?: string | undefined;
}

export interface CMSDownloaderInternalLink {
  id: string;
  label: string;
  url: string;
  description?: string | undefined;
  category?: "tool" | "article" | "page" | undefined;
}

export interface CMSDownloaderRevision {
  id: string;
  timestamp: string;
  snapshot: Partial<CMSDownloaderPage>;
  author?: string | undefined;
  notes?: string | undefined;
}

export interface CMSDownloaderRedirectHistory {
  oldSlug: string;
  newSlug: string;
  timestamp: string;
}

export interface CMSDownloaderPage {
  id: string;
  slug: string;
  toolType: DownloaderToolType;
  name: string;
  h1: string;
  subtitle: string;
  status: "published" | "draft";

  // Hero Section
  inputPlaceholder?: string | undefined;
  downloadButtonText?: string | undefined;
  heroImage?: string | undefined;
  heroImageAlt?: string | undefined;

  // SEO & Meta
  seoTitle: string;
  metaDescription: string;
  focusKeyword?: string | undefined;
  secondaryKeywords?: string[] | undefined;
  canonicalUrl?: string | undefined;
  metaRobots?: "index, follow" | "noindex, follow" | "noindex, nofollow" | undefined;
  ogTitle?: string | undefined;
  ogDescription?: string | undefined;
  ogImage?: string | undefined;
  ogImageAlt?: string | undefined;

  // Content Sections
  introHtml?: string | undefined;
  howToHeading?: string | undefined;
  howToSteps: CMSDownloaderHowToStep[];
  featuresHeading?: string | undefined;
  features: CMSDownloaderFeature[];
  whyChooseHeading?: string | undefined;
  whyChooseDescription?: string | undefined;
  whyChooseBenefits?: CMSDownloaderBenefit[] | undefined;

  // Additional Content
  additionalContentHtml?: string | undefined;
  supportedContentTypes?: string[] | undefined;
  usageInstructions?: string | undefined;
  limitationsNotice?: string | undefined;

  // CTA Section
  ctaHeading?: string | undefined;
  ctaSubtext?: string | undefined;
  ctaButtonText?: string | undefined;
  ctaButtonUrl?: string | undefined;

  // FAQs
  faqs: CMSDownloaderFaq[];

  // Internal Linking
  internalLinks?: CMSDownloaderInternalLink[] | undefined;

  // Draft, Revisions & Redirects
  draft?: Partial<CMSDownloaderPage> | undefined;
  revisions?: CMSDownloaderRevision[] | undefined;
  redirectHistory?: CMSDownloaderRedirectHistory[] | undefined;

  updatedAt: string;
}

export interface CMSDownloaderSettings {
  apiProvider: string;
  apiEndpoint: string;
  apiKeyMasked?: string;
  apiKeySecret?: string;
  status: "active" | "maintenance" | "fallback";
  supportedFormats: string[];
  rateLimitPerMinute: number;
  enableProxyCaching: boolean;
  cacheDurationSeconds: number;
}

export interface CMSDownloaderLog {
  id: string;
  timestamp: string;
  url: string;
  toolType: string;
  contentType?: string;
  status: "success" | "failed";
  ip?: string;
  durationMs?: number;
  error?: string;
}

export interface CMSDownloaderStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  totalRequests: number;
  successfulDownloads: number;
  failedRequests: number;
  lastRequestAt?: string;
  lastUpdatedAt?: string;
}

// =============================================================================
// CENTRALIZED WEBSITE LEADS & FORMS MANAGEMENT TYPES
// =============================================================================

export type LeadStatus =
  | "new"
  | "contacted"
  | "follow_up"
  | "in_progress"
  | "converted"
  | "rejected";

export type FormType =
  | "contact"
  | "project_inquiry"
  | "service_inquiry"
  | "consultation"
  | "callback"
  | "quote"
  | "career"
  | "general";

export interface CMSLeadNote {
  id: string;
  authorName: string;
  authorEmail: string;
  text: string;
  createdAt: string;
}

export interface CMSLead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  service?: string | undefined;
  businessName?: string | undefined;
  budget?: string | undefined;
  message?: string | undefined;
  position?: string | undefined; // For career / job inquiries
  resumeUrl?: string | undefined;

  // Source Tracking & Marketing Attribution
  sourceUrl: string; // The website page URL where submitted (e.g. /contact, /services/seo, /)
  formName: string; // e.g. "Contact Us Form", "Project Inquiry Form", "Service Consultation Form", "Footer Quick Callback Request", "Careers Application"
  formType: FormType;

  // UTM parameters
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmContent?: string | undefined;
  utmTerm?: string | undefined;
  referrer?: string | undefined;

  // Additional custom fields submitted with the form
  customFields?: Record<string, string | number | boolean | null | undefined> | undefined;

  // CRM Management Fields
  status: LeadStatus;
  assignedTo?: string | undefined; // e.g. "Naman (Founder)", "Sales Team", "Growth Strategist", "Unassigned"
  notes: CMSLeadNote[];
  isRead: boolean; // For new enquiry badge / notification

  createdAt: string; // ISO 8601
  updatedAt: string;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

export interface CMSLeadStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  followUpLeads: number;
  inProgressLeads: number;
  convertedLeads: number;
  rejectedLeads: number;
  byForm: Record<string, number>;
  byService: Record<string, number>;
  bySourcePage: Record<string, number>;
  lastLeadAt?: string | undefined;
}

export interface CMSStoreState {
  users: AdminUser[];
  articles: CMSArticle[];
  categories: CMSCategory[];
  tags: CMSTag[];
  authors: CMSAuthor[];
  media: CMSMediaItem[];
  redirects: CMSRedirect[];
  settings: CMSSiteSettings;
  services: CMSService[];
  homepage?: CMSHomepage;
  downloaderPages?: CMSDownloaderPage[];
  downloaderSettings?: CMSDownloaderSettings;
  downloaderLogs?: CMSDownloaderLog[];
  downloaderStats?: CMSDownloaderStats;
  leads?: CMSLead[];
  leadStats?: CMSLeadStats;
}
