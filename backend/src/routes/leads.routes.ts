import { Router } from "express";
import {
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
} from "../storage/cms-storage.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const leadsRouter = Router();

// ============================================================================
// PUBLIC FORM SUBMISSION (Any website form: Contact, Get Quote, Callback, etc.)
// ============================================================================
leadsRouter.post("/submit", (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "";

    const {
      name,
      fullName,
      phone,
      email,
      service,
      budget,
      city,
      company,
      businessName,
      message,
      formName,
      formType,
      sourceUrl,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      honeypot,
    } = req.body;

    // Spam honeypot trap
    if (honeypot) {
      res.json({ success: true, message: "Enquiry submitted successfully." });
      return;
    }

    if (!phone && !email) {
      res.status(400).json({ success: false, error: "Please provide a valid phone number or email address." });
      return;
    }

    const result = saveWebsiteLead({
      fullName: fullName || name || "Website Visitor",
      phone: phone || "",
      email: email || "",
      service: service || "",
      businessName: businessName || company || "",
      budget: budget || "",
      message: message || (city ? `City: ${city}` : ""),
      formName: formName || "Website Enquiry Form",
      formType: (formType as any) || "contact",
      sourceUrl: sourceUrl || "/",
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      ipAddress: ip,
      userAgent,
    });

    res.json({
      success: true,
      message: "Thank you for reaching out! Our team will contact you shortly.",
      leadId: result.lead?.id,
      isDuplicate: result.isDuplicate,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to submit enquiry." });
  }
});

// ============================================================================
// ADMIN CRM LEADS ENDPOINTS
// ============================================================================
leadsRouter.get("/", requireAuth, (req, res) => {
  try {
    const { status, formType, search, service } = req.query;
    const leads = getAllLeads({
      status: status as any,
      formType: formType as any,
      search: search as string,
      service: service as string,
    });
    res.json({ success: true, leads });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

leadsRouter.get("/stats", requireAuth, (_req, res) => {
  try {
    res.json({ success: true, stats: getLeadStats() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

leadsRouter.get("/:id", requireAuth, (req, res) => {
  try {
    const lead = getLeadById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }
    markLeadAsRead(req.params.id);
    res.json({ success: true, lead });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

leadsRouter.put("/:id/status", requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { status } = req.body;
    const authorName = req.user?.name || req.user?.email || "Admin";
    const updated = updateLeadStatus(req.params.id, status, authorName);
    if (!updated) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }
    res.json({ success: true, lead: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

leadsRouter.put("/:id/assign", requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { assignedTo } = req.body;
    const authorName = req.user?.name || req.user?.email || "Admin";
    const updated = assignLead(req.params.id, assignedTo, authorName);
    if (!updated) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }
    res.json({ success: true, lead: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

leadsRouter.post("/:id/notes", requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      res.status(400).json({ success: false, error: "Note text cannot be empty" });
      return;
    }
    const author = {
      name: req.user?.name || req.user?.email || "Admin",
      email: req.user?.email || "admin@socialwaale.com",
    };
    const updated = addLeadNote(req.params.id, text.trim(), author);
    if (!updated) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }
    res.json({ success: true, lead: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

leadsRouter.delete("/:id", requireAuth, (req, res) => {
  try {
    const ok = deleteLead(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }
    res.json({ success: true, message: "Lead deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

leadsRouter.post("/bulk", requireAuth, (req, res) => {
  try {
    const { ids, action, value } = req.body;
    if (!Array.isArray(ids) || !action) {
      res.status(400).json({ success: false, error: "Missing ids array or action" });
      return;
    }
    bulkUpdateLeads(ids, action, value);
    res.json({ success: true, message: `Bulk lead ${action} complete` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
