import { Router } from "express";
import {
  getCmsHomepage,
  getPublicHomepage,
  saveCmsHomepageDraft,
  publishCmsHomepage,
  restoreCmsHomepageRevision,
} from "../storage/cms-storage.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const homepageRouter = Router();

homepageRouter.get("/", (_req, res) => {
  try {
    const data = getPublicHomepage();
    res.json({ success: true, homepage: data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

homepageRouter.get("/cms", requireAuth, (_req, res) => {
  try {
    const full = getCmsHomepage(true);
    res.json({ success: true, homepage: full });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

homepageRouter.post("/draft", requireAuth, (req, res) => {
  try {
    const saved = saveCmsHomepageDraft(req.body);
    res.json({ success: true, homepage: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

homepageRouter.post("/publish", requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { data, note } = req.body;
    const authorName = req.user?.name || req.user?.email || "Admin";
    const published = publishCmsHomepage(data, authorName, note);
    res.json({ success: true, homepage: published });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

homepageRouter.post("/restore-revision", requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { revisionId } = req.body;
    if (!revisionId) {
      res.status(400).json({ success: false, error: "revisionId is required" });
      return;
    }
    const authorName = req.user?.name || req.user?.email || "Admin";
    const restored = restoreCmsHomepageRevision(revisionId, authorName);
    res.json({ success: true, homepage: restored });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
