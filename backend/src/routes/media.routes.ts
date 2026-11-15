import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { getAllMedia, saveMediaItem, deleteMediaItem } from "../storage/cms-storage.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const mediaRouter = Router();

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "-");
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

mediaRouter.get("/", (_req, res) => {
  try {
    res.json({ success: true, media: getAllMedia() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

mediaRouter.post("/upload", requireAuth, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file provided" });
      return;
    }

    const { title, alt, category } = req.body;
    const mediaItem = saveMediaItem({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      title: title || req.file.originalname,
      alt: alt || "",
      category: category || "general",
    } as any);

    res.json({ success: true, media: mediaItem });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

mediaRouter.delete("/:id", requireAuth, (req, res) => {
  try {
    const ok = deleteMediaItem(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: "Media item not found" });
      return;
    }
    res.json({ success: true, message: "Media item deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
