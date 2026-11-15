import { Router } from "express";
import {
  getAllCmsServices,
  getCmsServiceById,
  getCmsServiceBySlug,
  saveCmsService,
  toggleCmsServiceStatus,
  deleteCmsService,
  reorderCmsServices,
} from "../storage/cms-storage.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const servicesRouter = Router();

servicesRouter.get("/", (req, res) => {
  try {
    const includeUnpublished = req.query.includeUnpublished === "true" || !!req.headers.authorization;
    const services = getAllCmsServices(includeUnpublished);
    res.json({ success: true, services });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRouter.get("/by-slug/:slug", (req, res) => {
  try {
    const includeUnpublished = req.query.includeUnpublished === "true" || !!req.headers.authorization;
    const service = getCmsServiceBySlug(req.params.slug, includeUnpublished);
    if (!service) {
      res.status(404).json({ success: false, error: "Service not found" });
      return;
    }
    res.json({ success: true, service });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRouter.get("/:id", (req, res) => {
  try {
    const service = getCmsServiceById(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, error: "Service not found" });
      return;
    }
    res.json({ success: true, service });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRouter.post("/", requireAuth, (req, res) => {
  try {
    const saved = saveCmsService(req.body);
    res.json({ success: true, service: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRouter.post("/:id/toggle", requireAuth, (req, res) => {
  try {
    const updated = toggleCmsServiceStatus(req.params.id);
    if (!updated) {
      res.status(404).json({ success: false, error: "Service not found" });
      return;
    }
    res.json({ success: true, service: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRouter.delete("/:id", requireAuth, (req, res) => {
  try {
    const ok = deleteCmsService(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: "Service not found" });
      return;
    }
    res.json({ success: true, message: "Service deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRouter.post("/reorder", requireAuth, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ success: false, error: "orderedIds must be an array" });
      return;
    }
    const updated = reorderCmsServices(orderedIds);
    res.json({ success: true, services: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
