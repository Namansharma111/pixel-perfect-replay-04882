import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  getArticleBySlug,
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
} from "../storage/cms-storage.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const articlesRouter = Router();

// ============================================================================
// ARTICLES
// ============================================================================

articlesRouter.get("/", (req, res) => {
  try {
    const includeUnpublished = req.query.includeUnpublished === "true" || !!req.headers.authorization;
    const articles = getAllArticles(includeUnpublished);
    res.json({ success: true, articles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.get("/by-slug/:slug", (req, res) => {
  try {
    const includeUnpublished = req.query.includeUnpublished === "true" || !!req.headers.authorization;
    const article = getArticleBySlug(req.params.slug, includeUnpublished);
    if (!article) {
      res.status(404).json({ success: false, error: "Article not found" });
      return;
    }
    res.json({ success: true, article });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.get("/:id", (req, res) => {
  try {
    const article = getArticleById(req.params.id);
    if (!article) {
      res.status(404).json({ success: false, error: "Article not found" });
      return;
    }
    res.json({ success: true, article });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.post("/", requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const article = req.body;
    const author = { name: req.user?.name || req.user?.email || "Admin" };
    const saved = saveArticle(article, author);
    res.json({ success: true, article: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.delete("/:id", requireAuth, (req, res) => {
  try {
    const ok = deleteArticle(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: "Article not found" });
      return;
    }
    res.json({ success: true, message: "Article deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.post("/:id/duplicate", requireAuth, (req, res) => {
  try {
    const duplicated = duplicateArticle(req.params.id);
    if (!duplicated) {
      res.status(404).json({ success: false, error: "Article not found to duplicate" });
      return;
    }
    res.json({ success: true, article: duplicated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.post("/bulk", requireAuth, (req, res) => {
  try {
    const { ids, action } = req.body;
    if (!Array.isArray(ids) || !action) {
      res.status(400).json({ success: false, error: "Missing ids array or action" });
      return;
    }
    bulkUpdateArticles(ids, action);
    res.json({ success: true, message: `Bulk ${action} completed` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// CATEGORIES
// ============================================================================

articlesRouter.get("/categories/all", (_req, res) => {
  try {
    res.json({ success: true, categories: getAllCategories() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.post("/categories", requireAuth, (req, res) => {
  try {
    const saved = saveCategory(req.body);
    res.json({ success: true, category: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.delete("/categories/:id", requireAuth, (req, res) => {
  try {
    const ok = deleteCategory(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// TAGS
// ============================================================================

articlesRouter.get("/tags/all", (_req, res) => {
  try {
    res.json({ success: true, tags: getAllTags() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.post("/tags", requireAuth, (req, res) => {
  try {
    const saved = saveTag(req.body);
    res.json({ success: true, tag: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.delete("/tags/:id", requireAuth, (req, res) => {
  try {
    const ok = deleteTag(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// AUTHORS
// ============================================================================

articlesRouter.get("/authors/all", (_req, res) => {
  try {
    res.json({ success: true, authors: getAllAuthors() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.post("/authors", requireAuth, (req, res) => {
  try {
    const saved = saveAuthor(req.body);
    res.json({ success: true, author: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

articlesRouter.delete("/authors/:id", requireAuth, (req, res) => {
  try {
    const ok = deleteAuthor(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
