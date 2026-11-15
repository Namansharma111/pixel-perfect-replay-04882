import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  authenticateUser,
  verifyToken,
  createPasswordResetToken,
  validateResetToken,
  resetPasswordWithToken,
  getAllArticles,
  getArticleById,
  saveArticle,
  deleteArticle,
  duplicateArticle,
  bulkUpdateArticles,
  getAllCategories,
  saveCategory,
  deleteCategory,
  getAllTags,
  saveTag,
  deleteTag,
  getAllAuthors,
  saveAuthor,
  deleteAuthor,
  getAllMedia,
  saveMediaItem,
  deleteMediaItem,
  getAllRedirects,
  saveRedirect,
  deleteRedirect,
  getSiteSettings,
  saveSiteSettings,
  getAllCmsServices,
  getCmsServiceById,
  getCmsServiceBySlug,
  saveCmsService,
  deleteCmsService,
  toggleCmsServiceStatus,
  reorderCmsServices,
  getCmsHomepage,
  getPublicHomepage,
  saveCmsHomepageDraft,
  publishCmsHomepage,
  restoreCmsHomepageRevision,
  getAllDownloaderPages,
  getDownloaderPageBySlug,
  saveDownloaderPage,
  toggleDownloaderPageStatus,
  deleteDownloaderPage,
  getDownloaderStats,
  saveDownloaderDraft,
  publishDownloaderPage,
  restoreDownloaderRevision,
  getDownloaderSettings,
  saveDownloaderSettings,
  getDownloaderLogs,
  clearDownloaderLogs,
  getAllLeads,
  getLeadById,
  saveWebsiteLead,
  updateLeadStatus,
  assignLead,
  addLeadNote,
  markLeadAsRead,
  deleteLead,
  bulkUpdateLeads,
  getLeadStats,
} from "./cms-storage";
import type {
  CMSArticle,
  CMSCategory,
  CMSTag,
  CMSAuthor,
  CMSMediaItem,
  CMSRedirect,
  CMSSiteSettings,
  CMSService,
  CMSHomepage,
  CMSHomepageData,
  CMSDownloaderPage,
  CMSLead,
  CMSLeadStats,
  LeadStatus,
  FormType,
} from "./types";

// Auth helper
function requireAuth(token?: string) {
  if (!token) throw new Error("Unauthorized: Session token required.");
  const user = verifyToken(token);
  if (!user) throw new Error("Unauthorized: Invalid or expired session token.");
  return user;
}

// ---------------------------------------------------------------------------
// AUTH FUNCTIONS (SECURE AUTH, RATE LIMITING & RECOVERY)
// ---------------------------------------------------------------------------

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const res = authenticateUser(data.email, data.password);
    if (!res.ok) {
      return {
        ok: false as const,
        error: res.error,
        locked: res.locked ?? false,
      };
    }

    const { user, token } = res;
    return {
      ok: true as const,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  });

export const requestPasswordResetFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        email: z.string().email(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const res = createPasswordResetToken(data.email);
    // In local / development environment, we return the reset link token so the administrator can immediately set their new password
    return {
      ok: true as const,
      message: "If an account with this email exists, a password reset token has been generated.",
      token: res.token,
    };
  });

export const validatePasswordResetTokenFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const res = validateResetToken(data.token);
    return res;
  });

export const resetPasswordWithTokenFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string().min(1),
        newPassword: z.string().min(8, "Password must be at least 8 characters long"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const res = resetPasswordWithToken(data.token, data.newPassword);
    if (!res.ok) {
      return { ok: false as const, error: res.error || "Password reset failed." };
    }
    return { ok: true as const, message: "Password updated successfully! You can now sign in." };
  });

export const adminVerifySessionFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const verified = verifyToken(data.token);
    if (!verified) return { ok: false as const };
    return { ok: true as const, user: verified };
  });

// ---------------------------------------------------------------------------
// DASHBOARD STATS
// ---------------------------------------------------------------------------

export const getCmsDashboardStatsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const articles = getAllArticles(true);
    const services = getAllCmsServices(true);
    const categories = getAllCategories();
    const tags = getAllTags();
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

    const published = articles.filter((a) => a.status === "published").length;
    const drafts = articles.filter((a) => a.status === "draft").length;
    const scheduled = articles.filter((a) => a.status === "scheduled").length;
    const archived = articles.filter((a) => a.status === "archived").length;

    const publishedServices = services.filter((s) => s.status === "published").length;

    const recentArticles = articles.slice(0, 5);

    return {
      ok: true as const,
      stats: {
        totalArticles: articles.length,
        publishedArticles: published,
        draftArticles: drafts,
        scheduledArticles: scheduled,
        archivedArticles: archived,
        totalServices: services.length,
        publishedServices,
        totalCategories: categories.length,
        totalTags: tags.length,
        totalViews,
      },
      recentArticles,
      recentServices: services.slice(0, 5),
    };
  });

// ---------------------------------------------------------------------------
// ARTICLES CRUD
// ---------------------------------------------------------------------------

export const getCmsArticlesFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        search: z.string().optional(),
        category: z.string().optional(),
        status: z.string().optional(),
      })
      .optional()
      .parse(data),
  )
  .handler(async ({ data }) => {
    let list = getAllArticles(true);

    if (data?.category && data.category !== "all") {
      list = list.filter((a) => a.category === data.category);
    }
    if (data?.status && data.status !== "all") {
      list = list.filter((a) => a.status === data.status);
    }
    if (data?.search && data.search.trim()) {
      const q = data.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          a.authorName.toLowerCase().includes(q),
      );
    }

    return { ok: true as const, articles: list };
  });

export const getCmsArticleByIdFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const article = getArticleById(data.id);
    if (!article) return { ok: false as const, error: "Article not found." };
    return { ok: true as const, article };
  });

export const saveCmsArticleFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        article: z.any(), // Complete CMSArticle object
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    const saved = saveArticle(data.article as CMSArticle, { name: user.email });
    return { ok: true as const, article: saved };
  });

export const deleteCmsArticleFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    if (user.role !== "admin") {
      return { ok: false as const, error: "Only Admins can delete articles." };
    }
    const success = deleteArticle(data.id);
    return { ok: success };
  });

export const duplicateCmsArticleFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const dup = duplicateArticle(data.id);
    if (!dup) return { ok: false as const, error: "Article not found." };
    return { ok: true as const, article: dup };
  });

export const bulkUpdateCmsArticlesFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        ids: z.array(z.string()),
        action: z.enum(["publish", "draft", "delete", "archive"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    if (data.action === "delete" && user.role !== "admin") {
      return { ok: false as const, error: "Only Admins can delete articles in bulk." };
    }
    bulkUpdateArticles(data.ids, data.action);
    return { ok: true as const };
  });

// ---------------------------------------------------------------------------
// CATEGORIES & TAGS
// ---------------------------------------------------------------------------

export const getCmsCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  return { ok: true as const, categories: getAllCategories() };
});

export const saveCmsCategoryFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), category: z.any() }).parse(data))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const saved = saveCategory(data.category as CMSCategory);
    return { ok: true as const, category: saved };
  });

export const deleteCmsCategoryFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    if (user.role !== "admin") return { ok: false as const, error: "Admin only." };
    const success = deleteCategory(data.id);
    return { ok: success };
  });

export const getCmsTagsFn = createServerFn({ method: "GET" }).handler(async () => {
  return { ok: true as const, tags: getAllTags() };
});

export const saveCmsTagFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), tag: z.any() }).parse(data))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const saved = saveTag(data.tag as CMSTag);
    return { ok: true as const, tag: saved };
  });

export const deleteCmsTagFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    if (user.role !== "admin") return { ok: false as const, error: "Admin only." };
    const success = deleteTag(data.id);
    return { ok: success };
  });

// ---------------------------------------------------------------------------
// AUTHORS
// ---------------------------------------------------------------------------

export const getCmsAuthorsFn = createServerFn({ method: "GET" }).handler(async () => {
  return { ok: true as const, authors: getAllAuthors() };
});

export const saveCmsAuthorFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), author: z.any() }).parse(data))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const saved = saveAuthor(data.author as CMSAuthor);
    return { ok: true as const, author: saved };
  });

export const deleteCmsAuthorFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    if (user.role !== "admin") return { ok: false as const, error: "Admin only." };
    const success = deleteAuthor(data.id);
    return { ok: success };
  });

// ---------------------------------------------------------------------------
// MEDIA LIBRARY
// ---------------------------------------------------------------------------

export const getCmsMediaFn = createServerFn({ method: "GET" }).handler(async () => {
  return { ok: true as const, media: getAllMedia() };
});

export const saveCmsMediaFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), item: z.any() }).parse(data))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const saved = saveMediaItem(data.item as CMSMediaItem);
    return { ok: true as const, item: saved };
  });

export const deleteCmsMediaFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const success = deleteMediaItem(data.id);
    return { ok: success };
  });

// ---------------------------------------------------------------------------
// REDIRECTS & SETTINGS
// ---------------------------------------------------------------------------

export const getCmsRedirectsFn = createServerFn({ method: "GET" }).handler(async () => {
  return { ok: true as const, redirects: getAllRedirects() };
});

export const saveCmsRedirectFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), redirect: z.any() }).parse(data))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const saved = saveRedirect(data.redirect as CMSRedirect);
    return { ok: true as const, redirect: saved };
  });

export const deleteCmsRedirectFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const success = deleteRedirect(data.id);
    return { ok: success };
  });

export const getCmsSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  return { ok: true as const, settings: getSiteSettings() };
});

export const saveCmsSettingsFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string(), settings: z.any() }).parse(data))
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    if (user.role !== "admin") return { ok: false as const, error: "Admin only." };
    const saved = saveSiteSettings(data.settings as CMSSiteSettings);
    return { ok: true as const, settings: saved };
  });

// ---------------------------------------------------------------------------
// SERVICES MANAGEMENT
// ---------------------------------------------------------------------------

export const getCmsServicesFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string().optional(),
          includeDrafts: z.boolean().optional(),
        })
        .optional()
        .parse(data) || {},
  )
  .handler(async ({ data }) => {
    // If includeDrafts is true, verify user
    let includeDrafts = false;
    if (data?.token) {
      try {
        const user = verifyToken(data.token);
        if (user) includeDrafts = data.includeDrafts ?? true;
      } catch {
        includeDrafts = false;
      }
    }
    const services = getAllCmsServices(includeDrafts);
    return { ok: true as const, services };
  });

export const getPublicServicesFn = createServerFn({ method: "GET" }).handler(async () => {
  const services = getAllCmsServices(false);
  return { ok: true as const, services };
});

export const getCmsServiceByIdFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const service = getCmsServiceById(data.id);
    if (!service) return { ok: false as const, error: "Service not found" };
    return { ok: true as const, service };
  });

export const getCmsServiceBySlugFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const service = getCmsServiceBySlug(data.slug);
    if (!service) return { ok: false as const, error: "Service not found" };
    return { ok: true as const, service };
  });

export const saveCmsServiceFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          service: z.any(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const saved = saveCmsService(data.service as CMSService);
    return { ok: true as const, service: saved };
  });

export const deleteCmsServiceFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          id: z.string(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const success = deleteCmsService(data.id);
    return { ok: success };
  });

export const toggleCmsServiceStatusFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          id: z.string(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const updated = toggleCmsServiceStatus(data.id);
    if (!updated) return { ok: false as const, error: "Service not found" };
    return { ok: true as const, service: updated };
  });

export const reorderCmsServicesFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          orderedIds: z.array(z.string()),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const services = reorderCmsServices(data.orderedIds);
    return { ok: true as const, services };
  });

// ---------------------------------------------------------------------------
// HOMEPAGE MANAGEMENT FUNCTIONS
// ---------------------------------------------------------------------------

export const getPublicHomepageFn = createServerFn({ method: "GET" }).handler(async () => {
  const homepage = getPublicHomepage();
  return { ok: true as const, homepage };
});

export const getCmsHomepageFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string() }).parse(data))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const homepage = getCmsHomepage(true);
    return { ok: true as const, homepage };
  });

export const saveCmsHomepageDraftFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          data: z.any(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    const homepage = saveCmsHomepageDraft(data.data as CMSHomepageData, user.name);
    return { ok: true as const, homepage };
  });

export const publishCmsHomepageFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          data: z.any(),
          note: z.string().optional(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    const homepage = publishCmsHomepage(data.data as CMSHomepageData, user.name, data.note);
    return { ok: true as const, homepage };
  });

export const restoreCmsHomepageRevisionFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          revisionId: z.string(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    const homepage = restoreCmsHomepageRevision(data.revisionId, user.name);
    return { ok: true as const, homepage };
  });

// ---------------------------------------------------------------------------
// DOWNLOADER PAGES (CRM & PUBLIC)
// ---------------------------------------------------------------------------

export const getCmsDownloaderPagesFn = createServerFn({ method: "GET" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string().optional(),
          includeDrafts: z.boolean().optional(),
        })
        .optional()
        .parse(data),
  )
  .handler(async ({ data }) => {
    if (data?.token) {
      requireAuth(data.token);
    }
    const pages = getAllDownloaderPages(data?.includeDrafts ?? true);
    return { ok: true as const, pages };
  });

export const getPublicDownloaderPageFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const page = getDownloaderPageBySlug(data.slug, false);
    return { ok: true as const, page: page || null };
  });

export const saveCmsDownloaderPageFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          page: z.any(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const page = saveDownloaderPage(data.page as CMSDownloaderPage);
    return { ok: true as const, page };
  });

export const toggleCmsDownloaderPageStatusFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          id: z.string(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const page = toggleDownloaderPageStatus(data.id);
    return { ok: true as const, page };
  });

export const deleteCmsDownloaderPageFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          id: z.string(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const deleted = deleteDownloaderPage(data.id);
    return { ok: true as const, deleted };
  });

export const getCmsDownloaderStatsFn = createServerFn({ method: "GET" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string().optional(),
        })
        .optional()
        .parse(data),
  )
  .handler(async ({ data }) => {
    if (data?.token) {
      requireAuth(data.token);
    }
    const stats = getDownloaderStats();
    return { ok: true as const, stats };
  });

export const saveCmsDownloaderDraftFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          id: z.string(),
          draft: z.any(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const page = saveDownloaderDraft(data.id, data.draft as Partial<CMSDownloaderPage>);
    return { ok: true as const, page };
  });

export const publishCmsDownloaderPageFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          id: z.string(),
          notes: z.string().optional(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const result = publishDownloaderPage(data.id, data.notes);
    return { ok: true as const, page: result.page, redirectCreated: result.redirectCreated };
  });

export const restoreCmsDownloaderRevisionFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          id: z.string(),
          revisionId: z.string(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const page = restoreDownloaderRevision(data.id, data.revisionId);
    return { ok: true as const, page };
  });

export const getCmsDownloaderSettingsFn = createServerFn({ method: "GET" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string().optional(),
        })
        .optional()
        .parse(data),
  )
  .handler(async ({ data }) => {
    if (data?.token) {
      requireAuth(data.token);
    }
    const settings = getDownloaderSettings();
    return { ok: true as const, settings };
  });

export const saveCmsDownloaderSettingsFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
          settings: z.any(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const settings = saveDownloaderSettings(data.settings);
    return { ok: true as const, settings };
  });

export const getCmsDownloaderLogsFn = createServerFn({ method: "GET" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string().optional(),
          limit: z.number().optional(),
        })
        .optional()
        .parse(data),
  )
  .handler(async ({ data }) => {
    if (data?.token) {
      requireAuth(data.token);
    }
    const logs = getDownloaderLogs(data?.limit ?? 100);
    return { ok: true as const, logs };
  });

export const clearCmsDownloaderLogsFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          token: z.string(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const cleared = clearDownloaderLogs();
    return { ok: true as const, cleared };
  });

// ---------------------------------------------------------------------------
// CENTRALIZED WEBSITE LEADS & FORMS MANAGEMENT (PUBLIC & CRM)
// ---------------------------------------------------------------------------

export const submitWebsiteLeadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        fullName: z.string().trim().min(2, "Full name is required").max(120),
        phone: z.string().trim().min(7, "Valid phone number is required").max(25),
        email: z.string().trim().email("Valid email address is required").max(255),
        service: z.string().optional(),
        businessName: z.string().optional(),
        budget: z.string().optional(),
        message: z.string().optional(),
        position: z.string().optional(),
        resumeUrl: z.string().optional(),
        sourceUrl: z.string().default("/"),
        formName: z.string().default("Website Enquiry Form"),
        formType: z
          .enum([
            "contact",
            "project_inquiry",
            "service_inquiry",
            "consultation",
            "callback",
            "quote",
            "career",
            "general",
          ])
          .default("general"),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
        utmContent: z.string().optional(),
        utmTerm: z.string().optional(),
        referrer: z.string().optional(),
        customFields: z.record(z.any()).optional(),
        // Anti-spam honeypot: real users never fill this field
        website: z.string().optional().or(z.literal("")),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    // Spam protection: if honeypot is filled, return silent success without saving
    if (data.website && data.website.trim().length > 0) {
      return { ok: true as const, leadId: "spam-filtered", message: "Enquiry received successfully." };
    }

    const result = saveWebsiteLead({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      service: data.service,
      businessName: data.businessName,
      budget: data.budget,
      message: data.message,
      position: data.position,
      resumeUrl: data.resumeUrl,
      sourceUrl: data.sourceUrl,
      formName: data.formName,
      formType: data.formType as FormType,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmContent: data.utmContent,
      utmTerm: data.utmTerm,
      referrer: data.referrer,
      customFields: data.customFields,
    });

    return {
      ok: true as const,
      lead: result.lead,
      isDuplicate: result.isDuplicate,
      message: result.isDuplicate
        ? "We already received your recent request. Our team will contact you shortly!"
        : "Thank you! Your enquiry has been received. Our team will reach out within 2–4 hours.",
    };
  });

export const getCmsLeadsFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        search: z.string().optional(),
        status: z
          .enum(["all", "new", "contacted", "follow_up", "in_progress", "converted", "rejected"])
          .optional(),
        formType: z.string().optional(),
        service: z.string().optional(),
        isRead: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const leads = getAllLeads({
      search: data.search,
      status: data.status,
      formType: data.formType,
      service: data.service,
      isRead: data.isRead,
    });
    return { ok: true as const, leads };
  });

export const getCmsLeadByIdFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        id: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const lead = getLeadById(data.id);
    if (!lead) return { ok: false as const, error: "Lead not found" };
    return { ok: true as const, lead };
  });

export const updateCmsLeadStatusFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        id: z.string(),
        status: z.enum(["new", "contacted", "follow_up", "in_progress", "converted", "rejected"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    const updated = updateLeadStatus(data.id, data.status as LeadStatus, user.name);
    if (!updated) return { ok: false as const, error: "Lead not found" };
    return { ok: true as const, lead: updated };
  });

export const assignCmsLeadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        id: z.string(),
        assignedTo: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    const updated = assignLead(data.id, data.assignedTo, user.name);
    if (!updated) return { ok: false as const, error: "Lead not found" };
    return { ok: true as const, lead: updated };
  });

export const addCmsLeadNoteFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        id: z.string(),
        text: z.string().min(1, "Note cannot be empty"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const user = requireAuth(data.token);
    const updated = addLeadNote(data.id, data.text, { name: user.name, email: user.email });
    if (!updated) return { ok: false as const, error: "Lead not found" };
    return { ok: true as const, lead: updated };
  });

export const markCmsLeadAsReadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        id: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const updated = markLeadAsRead(data.id);
    if (!updated) return { ok: false as const, error: "Lead not found" };
    return { ok: true as const, lead: updated };
  });

export const deleteCmsLeadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        id: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const success = deleteLead(data.id);
    return { ok: success as boolean };
  });

export const bulkUpdateCmsLeadsFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        ids: z.array(z.string()),
        action: z.enum(["delete", "mark_read", "status", "assign"]),
        value: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const success = bulkUpdateLeads(data.ids, data.action, data.value);
    return { ok: success as boolean };
  });

export const getCmsLeadStatsFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string().optional(),
      })
      .optional()
      .parse(data),
  )
  .handler(async ({ data }) => {
    if (data?.token) {
      requireAuth(data.token);
    }
    const stats = getLeadStats();
    return { ok: true as const, stats };
  });
