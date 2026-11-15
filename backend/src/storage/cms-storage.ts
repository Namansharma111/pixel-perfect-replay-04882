import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type {
  AdminUser,
  CMSArticle,
  CMSCategory,
  CMSTag,
  CMSAuthor,
  CMSMediaItem,
  CMSRedirect,
  CMSSiteSettings,
  CMSStoreState,
  CMSService,
  CMSHomepage,
  CMSHomepageData,
  CMSHomepageRevision,
  CMSDownloaderPage,
  CMSDownloaderSettings,
  CMSDownloaderLog,
  CMSDownloaderStats,
  CMSDownloaderRevision,
  CMSLead,
  CMSLeadNote,
  CMSLeadStats,
  LeadStatus,
  FormType,
} from "../models/types.js";

// =============================================================================
// CRYPTOGRAPHY & SECURITY
// =============================================================================

export function hashPasswordSecure(password: string, existingSalt?: string): string {
  const salt = existingSalt || crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !password) return false;

  // The compromised legacy password hash is strictly rejected
  const COMPROMISED_LEGACY_HASH = "1bc69e97dec53db7814d4b5f7c41a1981a45445e3b2aef0195b22d01ac105258";
  if (storedHash === COMPROMISED_LEGACY_HASH) {
    return false;
  }

  if (storedHash.startsWith("scrypt:")) {
    const parts = storedHash.split(":");
    if (parts.length !== 3) return false;
    const [, salt, derived] = parts;
    if (!salt || !derived) return false;
    try {
      const testDerived = crypto.scryptSync(password, salt, 64).toString("hex");
      return crypto.timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(testDerived, "hex"));
    } catch {
      return false;
    }
  }

  return false;
}

export function generateToken(payload: { id: string; email: string; role: string; name?: string }): string {
  const secret = process.env.SESSION_SECRET || "social-waale-cms-super-secret-key-2026-production";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${claims}`)
    .digest("base64url");
  return `${header}.${claims}.${signature}`;
}

export function verifyToken(
  token: string,
): { id: string; email: string; role: string; name: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, claims, signature] = parts;
    if (!header || !claims || !signature) return null;
    const secret = process.env.SESSION_SECRET || "social-waale-cms-super-secret-key-2026-production";
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${header}.${claims}`)
      .digest("base64url");
    if (signature !== expected) return null;

    const payload = JSON.parse(Buffer.from(claims, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// =============================================================================
// DATABASE ENGINE (JSON STORE)
// =============================================================================

let memoryStore: CMSStoreState | null = null;

function getStoreFilePath(): string {
  if (process.env.DATABASE_FILE) {
    return path.resolve(process.cwd(), process.env.DATABASE_FILE);
  }
  return path.resolve(process.cwd(), "data", "cms-store.json");
}

export function getStore(): CMSStoreState {
  if (memoryStore) return memoryStore;

  const filePath = getStoreFilePath();
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      memoryStore = JSON.parse(raw) as CMSStoreState;
      return memoryStore;
    } catch (err) {
      console.error("[CMS Store] Error reading database file:", err);
    }
  }

  // Fallback initial schema if file did not exist
  memoryStore = {
    users: [
      {
        id: "admin-1",
        email: "admin@socialwaale.com",
        name: "Social Waale Administrator",
        role: "admin",
        passwordHash: "scrypt:727ddba141660263a92dfdef2160a40e:41015bfbc3fd5f6ff7da1671e6204e9d690f3321355985fbf8b98efef5d816260dacea3d614aafdacd3b7b9dee476904d5eb4b804dd0da92a9119ae42de02486",
        createdAt: new Date().toISOString(),
      },
    ],
    articles: [],
    categories: [],
    tags: [],
    authors: [],
    media: [],
    redirects: [],
    settings: {
      siteName: "Social Waale",
      siteDescription: "Digital Marketing Agency in Chandigarh",
      enableXmlSitemap: true,
      enableRssFeed: true,
      customRobotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/",
    },
    services: [],
    downloaderPages: [],
    leads: [],
  };

  saveStore(memoryStore);
  return memoryStore;
}

export function saveStore(store: CMSStoreState): void {
  memoryStore = store;
  const filePath = getStoreFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.error("[CMS Store] Error writing database file:", err);
  }
}

// =============================================================================
// AUTHENTICATION & RECOVERY
// =============================================================================

export type AuthResult =
  | { ok: true; user: AdminUser; token: string }
  | { ok: false; error: string; locked?: boolean; remainingAttempts?: number };

export function authenticateUser(email: string, passwordPlain: string): AuthResult {
  const store = getStore();
  const targetEmail = email.trim().toLowerCase();
  const userList = store.users || [];
  const user = userList.find((u) => u.email.toLowerCase() === targetEmail);

  if (!user) {
    return { ok: false, error: "Invalid email or password." };
  }

  // Check temporary account lockout
  if (user.lockedUntil) {
    const lockExpires = new Date(user.lockedUntil).getTime();
    const now = Date.now();
    if (lockExpires > now) {
      const minutesRemaining = Math.max(1, Math.ceil((lockExpires - now) / 60000));
      return {
        ok: false,
        error: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute${minutesRemaining > 1 ? "s" : ""} or use Forgot Password to reset.`,
        locked: true,
      };
    } else {
      user.lockedUntil = undefined;
      user.failedAttempts = 0;
    }
  }

  const isMatch = verifyPassword(passwordPlain, user.passwordHash);

  if (!isMatch) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    if (user.failedAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      saveStore(store);
      return {
        ok: false,
        error: "Too many failed attempts. Your account has been temporarily locked for 15 minutes.",
        locked: true,
      };
    }

    saveStore(store);
    const remaining = 5 - user.failedAttempts;
    return {
      ok: false,
      error: `Invalid email or password. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining before temporary lockout.`,
      remainingAttempts: remaining,
    };
  }

  // Successful login
  user.failedAttempts = 0;
  user.lockedUntil = undefined;
  saveStore(store);

  const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  return { ok: true, user, token };
}

export function createPasswordResetToken(email: string): { ok: boolean; token?: string; error?: string } {
  const store = getStore();
  const targetEmail = email.trim().toLowerCase();
  const userList = store.users || [];
  const user = userList.find((u) => u.email.toLowerCase() === targetEmail);

  if (!user) {
    return { ok: true };
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  saveStore(store);

  return { ok: true, token };
}

export function validateResetToken(token: string): { ok: boolean; email?: string; error?: string } {
  if (!token) return { ok: false, error: "Invalid token" };
  const store = getStore();
  const userList = store.users || [];
  const user = userList.find((u) => u.resetToken === token);

  if (!user || !user.resetTokenExpires) {
    return { ok: false, error: "Password reset link is invalid or has already been used." };
  }

  const expires = new Date(user.resetTokenExpires).getTime();
  if (expires < Date.now()) {
    return { ok: false, error: "Password reset link has expired. Please request a new link." };
  }

  return { ok: true, email: user.email };
}

export function resetPasswordWithToken(
  token: string,
  newPasswordPlain: string,
): { ok: boolean; error?: string } {
  const store = getStore();
  const userList = store.users || [];
  const user = userList.find((u) => u.resetToken === token);

  if (!user || !user.resetTokenExpires) {
    return { ok: false, error: "Password reset link is invalid or has already been used." };
  }

  const expires = new Date(user.resetTokenExpires).getTime();
  if (expires < Date.now()) {
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    saveStore(store);
    return { ok: false, error: "Password reset link has expired. Please request a new one." };
  }

  if (!newPasswordPlain || newPasswordPlain.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters long." };
  }

  user.passwordHash = hashPasswordSecure(newPasswordPlain);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  user.failedAttempts = 0;
  user.lockedUntil = undefined;
  user.updatedAt = new Date().toISOString();
  saveStore(store);

  return { ok: true };
}

// =============================================================================
// ARTICLES CRUD
// =============================================================================

export function getAllArticles(includeUnpublished = false): CMSArticle[] {
  const store = getStore();
  if (includeUnpublished) {
    return [...store.articles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }
  const now = new Date().toISOString();
  return store.articles
    .filter((a) => a.status === "published" && a.publishedAt <= now)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticleById(id: string): CMSArticle | undefined {
  const store = getStore();
  return store.articles.find((a) => a.id === id);
}

export function getArticleBySlug(slug: string, includeUnpublished = false): CMSArticle | undefined {
  const store = getStore();
  const article = store.articles.find((a) => a.slug === slug);
  if (!article) return undefined;
  if (!includeUnpublished && article.status !== "published") return undefined;
  return article;
}

export function saveArticle(article: CMSArticle, author: { name: string }): CMSArticle {
  const store = getStore();
  const index = store.articles.findIndex((a) => a.id === article.id);

  const updated: CMSArticle = {
    ...article,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    store.articles[index] = updated;
  } else {
    store.articles.unshift(updated);
  }

  saveStore(store);
  return updated;
}

export function deleteArticle(id: string): boolean {
  const store = getStore();
  const initialLength = store.articles.length;
  store.articles = store.articles.filter((a) => a.id !== id);
  if (store.articles.length !== initialLength) {
    saveStore(store);
    return true;
  }
  return false;
}

export function duplicateArticle(id: string): CMSArticle | null {
  const store = getStore();
  const original = store.articles.find((a) => a.id === id);
  if (!original) return null;

  const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
  const copy: CMSArticle = {
    ...original,
    id: `art-${Date.now()}`,
    slug: newSlug,
    title: `${original.title} (Copy)`,
    status: "draft",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
  };

  store.articles.unshift(copy);
  saveStore(store);
  return copy;
}

export function bulkUpdateArticles(ids: string[], action: "publish" | "draft" | "archive" | "delete"): void {
  const store = getStore();
  if (action === "delete") {
    store.articles = store.articles.filter((a) => !ids.includes(a.id));
  } else {
    store.articles = store.articles.map((a) => {
      if (ids.includes(a.id)) {
        return {
          ...a,
          status: action === "publish" ? "published" : action === "draft" ? "draft" : "archived",
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    });
  }
  saveStore(store);
}

// =============================================================================
// CATEGORIES & TAGS & AUTHORS
// =============================================================================

export function getAllCategories(): CMSCategory[] {
  return getStore().categories || [];
}

export function saveCategory(category: CMSCategory): CMSCategory {
  const store = getStore();
  const idx = store.categories.findIndex((c) => c.id === category.id);
  if (idx >= 0) {
    store.categories[idx] = category;
  } else {
    store.categories.push(category);
  }
  saveStore(store);
  return category;
}

export function deleteCategory(id: string): boolean {
  const store = getStore();
  const len = store.categories.length;
  store.categories = store.categories.filter((c) => c.id !== id);
  if (store.categories.length !== len) {
    saveStore(store);
    return true;
  }
  return false;
}

export function getAllTags(): CMSTag[] {
  return getStore().tags || [];
}

export function saveTag(tag: CMSTag): CMSTag {
  const store = getStore();
  const idx = store.tags.findIndex((t) => t.id === tag.id);
  if (idx >= 0) {
    store.tags[idx] = tag;
  } else {
    store.tags.push(tag);
  }
  saveStore(store);
  return tag;
}

export function deleteTag(id: string): boolean {
  const store = getStore();
  const len = store.tags.length;
  store.tags = store.tags.filter((t) => t.id !== id);
  if (store.tags.length !== len) {
    saveStore(store);
    return true;
  }
  return false;
}

export function getAllAuthors(): CMSAuthor[] {
  return getStore().authors || [];
}

export function saveAuthor(author: CMSAuthor): CMSAuthor {
  const store = getStore();
  const idx = store.authors.findIndex((a) => a.id === author.id);
  if (idx >= 0) {
    store.authors[idx] = author;
  } else {
    store.authors.push(author);
  }
  saveStore(store);
  return author;
}

export function deleteAuthor(id: string): boolean {
  const store = getStore();
  const len = store.authors.length;
  store.authors = store.authors.filter((a) => a.id !== id);
  if (store.authors.length !== len) {
    saveStore(store);
    return true;
  }
  return false;
}

// =============================================================================
// MEDIA & REDIRECTS & SETTINGS
// =============================================================================

export function getAllMedia(): CMSMediaItem[] {
  return getStore().media || [];
}

export function saveMediaItem(item: CMSMediaItem): CMSMediaItem {
  const store = getStore();
  const idx = store.media.findIndex((m) => m.id === item.id);
  if (idx >= 0) {
    store.media[idx] = item;
  } else {
    store.media.unshift(item);
  }
  saveStore(store);
  return item;
}

export function deleteMediaItem(id: string): boolean {
  const store = getStore();
  const len = store.media.length;
  store.media = store.media.filter((m) => m.id !== id);
  if (store.media.length !== len) {
    saveStore(store);
    return true;
  }
  return false;
}

export function getAllRedirects(): CMSRedirect[] {
  return getStore().redirects || [];
}

export function saveRedirect(redirect: CMSRedirect): CMSRedirect {
  const store = getStore();
  const idx = store.redirects.findIndex((r) => r.id === redirect.id);
  if (idx >= 0) {
    store.redirects[idx] = redirect;
  } else {
    store.redirects.unshift(redirect);
  }
  saveStore(store);
  return redirect;
}

export function deleteRedirect(id: string): boolean {
  const store = getStore();
  const len = store.redirects.length;
  store.redirects = store.redirects.filter((r) => r.id !== id);
  if (store.redirects.length !== len) {
    saveStore(store);
    return true;
  }
  return false;
}

export function getSiteSettings(): CMSSiteSettings {
  return getStore().settings;
}

export function saveSiteSettings(settings: Partial<CMSSiteSettings>): CMSSiteSettings {
  const store = getStore();
  store.settings = { ...store.settings, ...settings };
  saveStore(store);
  return store.settings;
}

// =============================================================================
// SERVICES MANAGEMENT
// =============================================================================

export function getAllCmsServices(includeUnpublished = true): CMSService[] {
  const store = getStore();
  const services = store.services || [];
  if (includeUnpublished) {
    return [...services].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }
  return services.filter((s) => s.status === "published").sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

export function getCmsServiceById(id: string): CMSService | undefined {
  const store = getStore();
  return (store.services || []).find((s) => s.id === id);
}

export function getCmsServiceBySlug(slug: string, includeUnpublished = true): CMSService | undefined {
  const store = getStore();
  const s = (store.services || []).find((item) => item.slug === slug);
  if (!s) return undefined;
  if (!includeUnpublished && s.status !== "published") return undefined;
  return s;
}

export function saveCmsService(service: CMSService): CMSService {
  const store = getStore();
  if (!store.services) store.services = [];
  const index = store.services.findIndex((s) => s.id === service.id);

  const updated: CMSService = {
    ...service,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    store.services[index] = updated;
  } else {
    store.services.push(updated);
  }

  saveStore(store);
  return updated;
}

export function toggleCmsServiceStatus(id: string): CMSService | undefined {
  const store = getStore();
  const service = (store.services || []).find((s) => s.id === id);
  if (!service) return undefined;

  service.status = service.status === "published" ? "draft" : "published";
  service.updatedAt = new Date().toISOString();
  saveStore(store);
  return service;
}

export function deleteCmsService(id: string): boolean {
  const store = getStore();
  if (!store.services) return false;
  const initial = store.services.length;
  store.services = store.services.filter((s) => s.id !== id);
  if (store.services.length !== initial) {
    saveStore(store);
    return true;
  }
  return false;
}

export function reorderCmsServices(orderedIds: string[]): CMSService[] {
  const store = getStore();
  if (!store.services) return [];

  const map = new Map(store.services.map((s) => [s.id, s]));
  const reordered: CMSService[] = [];

  orderedIds.forEach((id, idx) => {
    const s = map.get(id);
    if (s) {
      s.displayOrder = idx + 1;
      s.updatedAt = new Date().toISOString();
      reordered.push(s);
      map.delete(id);
    }
  });

  map.forEach((s) => {
    s.displayOrder = reordered.length + 1;
    reordered.push(s);
  });

  store.services = reordered;
  saveStore(store);
  return store.services;
}

// =============================================================================
// HOMEPAGE MANAGEMENT
// =============================================================================

export function getCmsHomepage(includeDraft = false): CMSHomepage {
  const store = getStore();
  if (!store.homepage) {
    throw new Error("Homepage not initialized");
  }
  return store.homepage;
}

export function getPublicHomepage(): CMSHomepageData {
  const store = getStore();
  if (!store.homepage) throw new Error("Homepage not initialized");
  return store.homepage.live;
}

export function saveCmsHomepageDraft(data: CMSHomepageData): CMSHomepage {
  const store = getStore();
  if (!store.homepage) throw new Error("Homepage not initialized");
  store.homepage.draft = data;
  store.homepage.status = "draft";
  store.homepage.updatedAt = new Date().toISOString();
  saveStore(store);
  return store.homepage;
}

export function publishCmsHomepage(data: CMSHomepageData, authorName = "Admin", note = "Published updates"): CMSHomepage {
  const store = getStore();
  if (!store.homepage) throw new Error("Homepage not initialized");

  const revision: CMSHomepageRevision = {
    id: `rev-${Date.now()}`,
    timestamp: new Date().toISOString(),
    authorName,
    note,
    data: store.homepage.live,
  };
  const revisions = [revision, ...(store.homepage.revisions || [])].slice(0, 20);

  store.homepage.live = data;
  store.homepage.draft = undefined;
  store.homepage.status = "published";
  store.homepage.updatedAt = new Date().toISOString();
  store.homepage.revisions = revisions;

  saveStore(store);
  return store.homepage;
}

export function restoreCmsHomepageRevision(revisionId: string, authorName = "Admin"): CMSHomepage {
  const store = getStore();
  if (!store.homepage) throw new Error("Homepage not initialized");

  const targetRev = (store.homepage.revisions || []).find((r) => r.id === revisionId);
  if (!targetRev) throw new Error("Revision not found");

  const backupRev: CMSHomepageRevision = {
    id: `rev-${Date.now()}`,
    timestamp: new Date().toISOString(),
    authorName,
    note: `Rollback to revision ${targetRev.id} (${targetRev.note || targetRev.timestamp})`,
    data: store.homepage.live,
  };

  store.homepage.live = targetRev.data;
  store.homepage.draft = undefined;
  store.homepage.status = "published";
  store.homepage.updatedAt = new Date().toISOString();
  store.homepage.revisions = [backupRev, ...(store.homepage.revisions || [])].slice(0, 20);

  saveStore(store);
  return store.homepage;
}

// =============================================================================
// DOWNLOADER MANAGEMENT
// =============================================================================

export function getAllDownloaderPages(includeDrafts = true): CMSDownloaderPage[] {
  const store = getStore();
  const pages = store.downloaderPages || [];
  if (includeDrafts) return pages;
  return pages.filter((p) => p.status === "published");
}

export function getDownloaderPageBySlug(slug: string, includeDraft = false): CMSDownloaderPage | undefined {
  const store = getStore();
  const pages = store.downloaderPages || [];
  const page = pages.find((p) => p.slug === slug);
  if (!page) return undefined;
  if (!includeDraft && page.status !== "published") return undefined;
  return page;
}

export function saveDownloaderPage(page: CMSDownloaderPage): CMSDownloaderPage {
  const store = getStore();
  if (!store.downloaderPages) store.downloaderPages = [];
  const idx = store.downloaderPages.findIndex((p) => p.id === page.id);
  const updated: CMSDownloaderPage = {
    ...page,
    updatedAt: new Date().toISOString(),
  };

  if (idx >= 0) {
    store.downloaderPages[idx] = updated;
  } else {
    store.downloaderPages.push(updated);
  }

  saveStore(store);
  return updated;
}

export function saveDownloaderDraft(id: string, draftData: Partial<CMSDownloaderPage>): CMSDownloaderPage {
  const store = getStore();
  if (!store.downloaderPages) store.downloaderPages = [];
  const pageIndex = store.downloaderPages.findIndex((p) => p.id === id);
  if (pageIndex === -1) throw new Error("Downloader page not found");

  const page = store.downloaderPages[pageIndex]!;
  page.draft = {
    ...(page.draft || {}),
    ...draftData,
  };
  page.updatedAt = new Date().toISOString();
  store.downloaderPages[pageIndex] = page;
  saveStore(store);
  return page;
}

export function publishDownloaderPage(
  id: string,
  liveData: Partial<CMSDownloaderPage>,
  authorName = "Admin",
  changeLog = "Published updates",
): CMSDownloaderPage {
  const store = getStore();
  if (!store.downloaderPages) store.downloaderPages = [];
  const pageIndex = store.downloaderPages.findIndex((p) => p.id === id);
  if (pageIndex === -1) throw new Error("Downloader page not found");

  const page = store.downloaderPages[pageIndex]!;
  const oldSlug = page.slug;
  const newSlug = liveData.slug && liveData.slug.trim() !== "" ? liveData.slug.trim() : page.slug;

  if (oldSlug !== newSlug) {
    if (!store.redirects) store.redirects = [];
    const redirectId = `redir-dl-${Date.now()}`;
    const newRedirect: CMSRedirect = {
      id: redirectId,
      fromPath: `/${oldSlug}`,
      toPath: `/${newSlug}`,
      statusCode: 301,
      createdAt: new Date().toISOString(),
      hits: 0,
    };
    store.redirects.unshift(newRedirect);

    if (!page.redirectHistory) page.redirectHistory = [];
    page.redirectHistory.unshift({
      oldSlug,
      newSlug,
      timestamp: new Date().toISOString(),
    });
  }

  const snapshot: Partial<CMSDownloaderPage> = {
    name: page.name,
    seoTitle: page.seoTitle,
    metaDescription: page.metaDescription,
    focusKeyword: page.focusKeyword,
    secondaryKeywords: page.secondaryKeywords,
    canonicalUrl: page.canonicalUrl,
    inputPlaceholder: page.inputPlaceholder,
    downloadButtonText: page.downloadButtonText,
    introHtml: page.introHtml,
    howToHeading: page.howToHeading,
    howToSteps: page.howToSteps,
    featuresHeading: page.featuresHeading,
    features: page.features,
    whyChooseHeading: page.whyChooseHeading,
    whyChooseDescription: page.whyChooseDescription,
    whyChooseBenefits: page.whyChooseBenefits,
    faqs: page.faqs,
    internalLinks: page.internalLinks,
    additionalContentHtml: page.additionalContentHtml,
    ctaHeading: page.ctaHeading,
    ctaSubtext: page.ctaSubtext,
    ctaButtonText: page.ctaButtonText,
    ctaButtonUrl: page.ctaButtonUrl,
  };

  const revision: CMSDownloaderRevision = {
    id: `rev-dl-${Date.now()}`,
    timestamp: new Date().toISOString(),
    author: authorName,
    notes: changeLog,
    snapshot,
  };

  if (!page.revisions) page.revisions = [];
  page.revisions = [revision, ...page.revisions].slice(0, 20);

  Object.assign(page, liveData);
  page.status = "published";
  page.draft = undefined;
  page.updatedAt = new Date().toISOString();

  store.downloaderPages[pageIndex] = page;
  saveStore(store);
  return page;
}

export function restoreDownloaderRevision(id: string, revisionId: string): CMSDownloaderPage {
  const store = getStore();
  if (!store.downloaderPages) store.downloaderPages = [];
  const pageIndex = store.downloaderPages.findIndex((p) => p.id === id);
  if (pageIndex === -1) throw new Error("Downloader page not found");

  const page = store.downloaderPages[pageIndex]!;
  const revision = (page.revisions || []).find((r) => r.id === revisionId);
  if (!revision) throw new Error("Revision not found");

  Object.assign(page, revision.snapshot);
  page.updatedAt = new Date().toISOString();
  store.downloaderPages[pageIndex] = page;
  saveStore(store);
  return page;
}

export function toggleDownloaderPageStatus(id: string): CMSDownloaderPage | undefined {
  const store = getStore();
  const page = (store.downloaderPages || []).find((p) => p.id === id);
  if (!page) return undefined;
  page.status = page.status === "published" ? "draft" : "published";
  page.updatedAt = new Date().toISOString();
  saveStore(store);
  return page;
}

export function deleteDownloaderPage(id: string): boolean {
  const store = getStore();
  if (!store.downloaderPages) return false;
  const initial = store.downloaderPages.length;
  store.downloaderPages = store.downloaderPages.filter((p) => p.id !== id);
  if (store.downloaderPages.length !== initial) {
    saveStore(store);
    return true;
  }
  return false;
}

export function getDownloaderSettings(): CMSDownloaderSettings {
  const store = getStore();
  if (store.downloaderSettings) return store.downloaderSettings;
  return {
    apiProvider: "SnapSave Fast Engine",
    apiEndpoint: "https://snapsave.app/action.php",
    apiKeyMasked: "snapsave_live_••••••••••••94b2",
    status: "active",
    supportedFormats: ["mp4", "webm", "jpg", "png"],
    rateLimitPerMinute: 60,
    enableProxyCaching: true,
    cacheDurationSeconds: 86400,
  };
}

export function saveDownloaderSettings(settings: Partial<CMSDownloaderSettings>): CMSDownloaderSettings {
  const store = getStore();
  store.downloaderSettings = {
    ...getDownloaderSettings(),
    ...settings,
  };
  saveStore(store);
  return store.downloaderSettings;
}

export function getDownloaderLogs(limit = 100): CMSDownloaderLog[] {
  const store = getStore();
  return (store.downloaderLogs || []).slice(0, limit);
}

export function clearDownloaderLogs(): boolean {
  const store = getStore();
  store.downloaderLogs = [];
  saveStore(store);
  return true;
}

export function logDownloaderRequest(entry: Omit<CMSDownloaderLog, "id" | "timestamp">): void {
  const store = getStore();
  if (!store.downloaderLogs) store.downloaderLogs = [];
  if (!store.downloaderStats) {
    store.downloaderStats = {
      totalPages: (store.downloaderPages || []).length,
      publishedPages: (store.downloaderPages || []).filter((p) => p.status === "published").length,
      draftPages: (store.downloaderPages || []).filter((p) => p.status === "draft").length,
      totalRequests: 0,
      successfulDownloads: 0,
      failedRequests: 0,
    };
  }

  const logItem: CMSDownloaderLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  store.downloaderLogs = [logItem, ...store.downloaderLogs].slice(0, 150);
  store.downloaderStats.totalRequests = (store.downloaderStats.totalRequests || 0) + 1;
  if (entry.status === "success") {
    store.downloaderStats.successfulDownloads = (store.downloaderStats.successfulDownloads || 0) + 1;
  } else {
    store.downloaderStats.failedRequests = (store.downloaderStats.failedRequests || 0) + 1;
  }
  store.downloaderStats.lastRequestAt = logItem.timestamp;
  store.downloaderStats.lastUpdatedAt = logItem.timestamp;
  saveStore(store);
}

export function getDownloaderStats(): CMSDownloaderStats {
  const store = getStore();
  const pages = store.downloaderPages || [];
  const published = pages.filter((p) => p.status === "published").length;
  const drafts = pages.filter((p) => p.status === "draft").length;

  const currentStats: Partial<CMSDownloaderStats> = store.downloaderStats || {
    totalRequests: 0,
    successfulDownloads: 0,
    failedRequests: 0,
  };

  return {
    totalPages: pages.length,
    publishedPages: published,
    draftPages: drafts,
    totalRequests: currentStats.totalRequests || 0,
    successfulDownloads: currentStats.successfulDownloads || 0,
    failedRequests: currentStats.failedRequests || 0,
    lastRequestAt: currentStats.lastRequestAt,
    lastUpdatedAt: currentStats.lastUpdatedAt || new Date().toISOString(),
  };
}

// =============================================================================
// LEADS & WEBSITE FORM SUBMISSIONS
// =============================================================================

export function getAllLeads(filters?: {
  search?: string | undefined;
  status?: LeadStatus | "all" | undefined;
  formType?: string | "all" | undefined;
  service?: string | "all" | undefined;
  isRead?: boolean | undefined;
}): CMSLead[] {
  const store = getStore();
  let list = store.leads ? [...store.leads] : [];

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (l) =>
        l.fullName.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.businessName && l.businessName.toLowerCase().includes(q)) ||
        (l.message && l.message.toLowerCase().includes(q)),
    );
  }

  if (filters?.status && filters.status !== "all") {
    list = list.filter((l) => l.status === filters.status);
  }

  if (filters?.formType && filters.formType !== "all") {
    list = list.filter((l) => l.formType === filters.formType);
  }

  if (filters?.service && filters.service !== "all") {
    list = list.filter((l) => l.service === filters.service);
  }

  if (filters?.isRead !== undefined) {
    list = list.filter((l) => l.isRead === filters.isRead);
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getLeadById(id: string): CMSLead | undefined {
  const store = getStore();
  return (store.leads || []).find((l) => l.id === id);
}

export function saveWebsiteLead(data: {
  fullName: string;
  phone: string;
  email: string;
  service?: string | undefined;
  businessName?: string | undefined;
  budget?: string | undefined;
  message?: string | undefined;
  position?: string | undefined;
  resumeUrl?: string | undefined;
  sourceUrl: string;
  formName: string;
  formType: FormType;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmContent?: string | undefined;
  utmTerm?: string | undefined;
  referrer?: string | undefined;
  customFields?: Record<string, string | number | boolean | null | undefined> | undefined;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}): { ok: boolean; lead: CMSLead; isDuplicate?: boolean } {
  const store = getStore();
  if (!store.leads) store.leads = [];

  const now = Date.now();
  const cleanPhone = data.phone.replace(/[^0-9]/g, "");
  const cleanEmail = data.email.toLowerCase().trim();

  const recentDuplicate = store.leads.find((l) => {
    const lPhone = l.phone.replace(/[^0-9]/g, "");
    const lEmail = l.email.toLowerCase().trim();
    const isSame = (cleanPhone.length > 5 && lPhone === cleanPhone) || (cleanEmail.length > 3 && lEmail === cleanEmail);
    const createdTime = new Date(l.createdAt).getTime();
    return isSame && now - createdTime < 60000;
  });

  if (recentDuplicate) {
    return { ok: true, lead: recentDuplicate, isDuplicate: true };
  }

  const newLead: CMSLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    service: data.service || undefined,
    businessName: data.businessName?.trim() || undefined,
    budget: data.budget || undefined,
    message: data.message?.trim() || undefined,
    position: data.position || undefined,
    resumeUrl: data.resumeUrl || undefined,
    sourceUrl: data.sourceUrl || "/",
    formName: data.formName || "Website Form",
    formType: data.formType || "general",
    utmSource: data.utmSource || undefined,
    utmMedium: data.utmMedium || undefined,
    utmCampaign: data.utmCampaign || undefined,
    utmContent: data.utmContent || undefined,
    utmTerm: data.utmTerm || undefined,
    referrer: data.referrer || undefined,
    customFields: data.customFields || undefined,
    status: "new",
    assignedTo: "Unassigned",
    notes: [],
    isRead: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ipAddress: data.ipAddress || undefined,
    userAgent: data.userAgent || undefined,
  };

  store.leads = [newLead, ...store.leads];
  saveStore(store);

  return { ok: true, lead: newLead };
}

export function updateLeadStatus(id: string, status: LeadStatus, updatedBy = "Admin"): CMSLead | undefined {
  const store = getStore();
  if (!store.leads) return undefined;
  const lead = store.leads.find((l) => l.id === id);
  if (!lead) return undefined;

  const oldStatus = lead.status;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  lead.isRead = true;
  lead.notes.push({
    id: `note-${Date.now()}`,
    authorName: updatedBy,
    authorEmail: "admin@socialwaale.com",
    text: `Status updated from ${oldStatus} to ${status}`,
    createdAt: new Date().toISOString(),
  });

  saveStore(store);
  return lead;
}

export function assignLead(id: string, assignedTo: string, updatedBy = "Admin"): CMSLead | undefined {
  const store = getStore();
  if (!store.leads) return undefined;
  const lead = store.leads.find((l) => l.id === id);
  if (!lead) return undefined;

  const oldAssignee = lead.assignedTo || "Unassigned";
  lead.assignedTo = assignedTo;
  lead.updatedAt = new Date().toISOString();
  lead.isRead = true;
  lead.notes.push({
    id: `note-${Date.now()}`,
    authorName: updatedBy,
    authorEmail: "admin@socialwaale.com",
    text: `Lead reassigned from "${oldAssignee}" to "${assignedTo}"`,
    createdAt: new Date().toISOString(),
  });

  saveStore(store);
  return lead;
}

export function addLeadNote(id: string, text: string, author: { name: string; email: string }): CMSLead | undefined {
  const store = getStore();
  if (!store.leads) return undefined;
  const lead = store.leads.find((l) => l.id === id);
  if (!lead) return undefined;

  lead.notes.push({
    id: `note-${Date.now()}`,
    authorName: author.name,
    authorEmail: author.email,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  });
  lead.updatedAt = new Date().toISOString();
  saveStore(store);
  return lead;
}

export function markLeadAsRead(id: string): CMSLead | undefined {
  const store = getStore();
  if (!store.leads) return undefined;
  const lead = store.leads.find((l) => l.id === id);
  if (!lead) return undefined;

  lead.isRead = true;
  lead.updatedAt = new Date().toISOString();
  saveStore(store);
  return lead;
}

export function deleteLead(id: string): boolean {
  const store = getStore();
  if (!store.leads) return false;
  const index = store.leads.findIndex((l) => l.id === id);
  if (index === -1) return false;

  store.leads.splice(index, 1);
  saveStore(store);
  return true;
}

export function bulkUpdateLeads(
  ids: string[],
  action: "delete" | "mark_read" | "status" | "assign",
  value?: string,
): boolean {
  const store = getStore();
  if (!store.leads) return false;

  if (action === "delete") {
    store.leads = store.leads.filter((l) => !ids.includes(l.id));
  } else if (action === "mark_read") {
    store.leads.forEach((l) => {
      if (ids.includes(l.id)) l.isRead = true;
    });
  } else if (action === "status" && value) {
    store.leads.forEach((l) => {
      if (ids.includes(l.id)) {
        l.status = value as LeadStatus;
        l.isRead = true;
      }
    });
  } else if (action === "assign" && value) {
    store.leads.forEach((l) => {
      if (ids.includes(l.id)) {
        l.assignedTo = value;
      }
    });
  }

  saveStore(store);
  return true;
}

export function getLeadStats(): CMSLeadStats {
  const store = getStore();
  const leads = store.leads || [];

  const byForm: Record<string, number> = {};
  const byService: Record<string, number> = {};
  const bySourcePage: Record<string, number> = {};

  let newCount = 0;
  let contactedCount = 0;
  let followUpCount = 0;
  let inProgressCount = 0;
  let convertedCount = 0;
  let rejectedCount = 0;

  for (const l of leads) {
    if (l.status === "new") newCount++;
    else if (l.status === "contacted") contactedCount++;
    else if (l.status === "follow_up") followUpCount++;
    else if (l.status === "in_progress") inProgressCount++;
    else if (l.status === "converted") convertedCount++;
    else if (l.status === "rejected") rejectedCount++;

    const fName = l.formName || "Unknown Form";
    byForm[fName] = (byForm[fName] || 0) + 1;

    const sName = l.service || "Unspecified";
    byService[sName] = (byService[sName] || 0) + 1;

    const pName = l.sourceUrl || "/";
    bySourcePage[pName] = (bySourcePage[pName] || 0) + 1;
  }

  return {
    totalLeads: leads.length,
    newLeads: newCount,
    contactedLeads: contactedCount,
    followUpLeads: followUpCount,
    inProgressLeads: inProgressCount,
    convertedLeads: convertedCount,
    rejectedLeads: rejectedCount,
    byForm,
    byService,
    bySourcePage,
    lastLeadAt: leads[0]?.createdAt,
  };
}
