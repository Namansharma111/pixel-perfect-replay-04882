import { Router } from "express";
import {
  generateArticleDraft,
  optimizeArticleSeo,
  generateArticleFaqs,
  improveArticleContent,
  generateMarketingAudit,
} from "../services/gemini.service.js";
import { saveWebsiteLead } from "../storage/cms-storage.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const aiRouter = Router();

/**
 * Health & Configuration Status Check
 */
aiRouter.get("/status", (_req, res) => {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GEMINI_API_KEY
  );

  res.json({
    success: true,
    geminiConfigured: hasKey,
    model: "gemini-4-hydrogen",
    fallbackModel: "gemini-3.5-flash-lite",
    provider: "Google Gemini API (Social Waale AI Engine)",
  });
});

/**
 * AI Article Studio: Generate Complete Long-Form Article Draft
 * Protected: Admin/Editor Only
 */
aiRouter.post("/generate-article", requireAuth, async (req, res) => {
  try {
    const { topic, targetAudience, tone, focusKeywords, location, category } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      res.status(400).json({ success: false, error: "Article topic is required." });
      return;
    }

    const result = await generateArticleDraft({
      topic: topic.trim(),
      targetAudience,
      tone,
      focusKeywords,
      location,
      category,
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error("AI Generate Article Error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to generate article." });
  }
});

/**
 * AI SEO Copilot: Optimize Meta Title, Description, and Keywords
 * Protected: Admin/Editor Only
 */
aiRouter.post("/optimize-seo", requireAuth, async (req, res) => {
  try {
    const { title, contentHtml, excerpt, focusKeyword } = req.body;

    if (!title && !contentHtml) {
      res.status(400).json({ success: false, error: "Title or Content is required for SEO optimization." });
      return;
    }

    const result = await optimizeArticleSeo({
      title: title || "Digital Marketing Strategy",
      contentHtml: contentHtml || "",
      excerpt,
      focusKeyword,
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error("AI Optimize SEO Error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to optimize SEO." });
  }
});

/**
 * AI FAQ Generator: Generate Schema-Ready FAQs
 * Protected: Admin/Editor Only
 */
aiRouter.post("/generate-faqs", requireAuth, async (req, res) => {
  try {
    const { title, contentHtml, count } = req.body;

    if (!title && !contentHtml) {
      res.status(400).json({ success: false, error: "Title or Content is required." });
      return;
    }

    const result = await generateArticleFaqs({
      title: title || "Digital Marketing FAQs",
      contentHtml: contentHtml || "",
      count: count ? Number(count) : 4,
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error("AI Generate FAQs Error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to generate FAQs." });
  }
});

/**
 * AI Content Polisher & Transformer
 * Protected: Admin/Editor Only
 */
aiRouter.post("/improve-content", requireAuth, async (req, res) => {
  try {
    const { text, action, tone } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      res.status(400).json({ success: false, error: "Text content is required." });
      return;
    }

    const result = await improveArticleContent({
      text: text.trim(),
      action: action || "polish",
      tone,
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    console.error("AI Improve Content Error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to improve content." });
  }
});

/**
 * Public AI Growth & Marketing Audit Engine
 * Evaluates business growth vectors and optionally captures high-intent client leads
 */
aiRouter.post("/marketing-audit", async (req, res) => {
  try {
    const {
      businessName,
      industry,
      monthlyBudget,
      primaryGoal,
      location,
      websiteOrSocial,
      contactName,
      contactPhone,
      contactEmail,
    } = req.body;

    if (!businessName || !industry || !monthlyBudget || !primaryGoal) {
      res.status(400).json({
        success: false,
        error: "Business Name, Industry, Monthly Budget, and Primary Goal are required.",
      });
      return;
    }

    const auditResult = await generateMarketingAudit({
      businessName: businessName.trim(),
      industry: industry.trim(),
      monthlyBudget: monthlyBudget.trim(),
      primaryGoal: primaryGoal.trim(),
      location: location?.trim(),
      websiteOrSocial: websiteOrSocial?.trim(),
    });

    // If prospective client provided contact info, automatically log as a qualified lead in CMS!
    if (contactPhone || contactEmail) {
      try {
        const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
        const userAgent = req.headers["user-agent"] || "";

        saveWebsiteLead({
          fullName: contactName || businessName,
          phone: contactPhone || "",
          email: contactEmail || "",
          service: auditResult.recommendedServices[0] || "Google Ads & Performance Marketing",
          budget: monthlyBudget,
          businessName: businessName,
          message: `[AI Growth Audit Generated]\nIndustry: ${industry}\nGoal: ${primaryGoal}\nWebsite/Social: ${websiteOrSocial || "N/A"}\nRecommended Budget Split: ${auditResult.channelRecommendations.map((c) => `${c.channel} (${c.budgetAllocationPercent}%)`).join(", ")}`,
          formName: "AI Marketing Audit Tool",
          formType: "consultation",
          sourceUrl: "/ai-audit",
          ipAddress: ip,
          userAgent,
        });
      } catch (leadErr) {
        console.error("Failed to automatically save AI Audit lead:", leadErr);
      }
    }

    res.json({ success: true, data: auditResult });
  } catch (err: any) {
    console.error("AI Marketing Audit Error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to generate marketing audit." });
  }
});
