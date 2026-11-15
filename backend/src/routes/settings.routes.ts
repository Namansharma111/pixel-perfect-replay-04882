import { Router } from "express";
import {
  getSiteSettings,
  saveSiteSettings,
  getAllRedirects,
  saveRedirect,
  deleteRedirect,
} from "../storage/cms-storage.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const settingsRouter = Router();

settingsRouter.get("/", (_req, res) => {
  try {
    res.json({ success: true, settings: getSiteSettings() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

settingsRouter.post("/", requireAuth, (req, res) => {
  try {
    const updated = saveSiteSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Redirects
settingsRouter.get("/redirects", (_req, res) => {
  try {
    res.json({ success: true, redirects: getAllRedirects() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

settingsRouter.post("/redirects", requireAuth, (req, res) => {
  try {
    const saved = saveRedirect(req.body);
    res.json({ success: true, redirect: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

settingsRouter.delete("/redirects/:id", requireAuth, (req, res) => {
  try {
    const ok = deleteRedirect(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
