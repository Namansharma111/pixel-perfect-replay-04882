import { createServerFn } from "@tanstack/react-start";
import { applicationSchema, contactSchema, RESUME_MAX_BYTES, RESUME_TYPES } from "./form-schemas";
import { saveWebsiteLead } from "./cms/cms-storage";

type Result = { ok: true } | { ok: false; error: string };

export const submitContact = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }): Promise<Result> => {
    // Honeypot check
    if (data.website && data.website.length > 0) {
      return { ok: true };
    }

    // 1. Centralized CRM Lead persistence
    try {
      saveWebsiteLead({
        fullName: data.fullName,
        businessName: data.businessName || undefined,
        phone: data.phone,
        email: data.email,
        service: data.service,
        budget: data.budget || undefined,
        message: data.message,
        sourceUrl: data.sourcePage || "/contact",
        formName: data.sourcePage ? `Website Form (${data.sourcePage})` : "Contact Us Form",
        formType: "contact",
      });
    } catch (cmsErr) {
      console.warn("[CRM] Failed to record contact lead:", cmsErr);
    }

    // 2. Supabase optional sync
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("contact_submissions").insert({
        full_name: data.fullName,
        business_name: data.businessName || null,
        phone: data.phone,
        email: data.email,
        service: data.service,
        budget: data.budget || null,
        message: data.message,
        source_page: data.sourcePage ?? null,
      });
      if (error) {
        console.warn("Supabase contact sync warning (lead is safe in CRM):", error);
      }
    } catch (e) {
      // Supabase is optional; CRM storage is primary
    }

    return { ok: true };
  });

export const submitApplication = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Invalid form submission");
    const fields = applicationSchema.parse({
      fullName: data.get("fullName") ?? "",
      email: data.get("email") ?? "",
      phone: data.get("phone") ?? "",
      position: data.get("position") ?? "",
      message: data.get("message") ?? "",
      website: data.get("website") ?? "",
    });
    const resume = data.get("resume");
    if (!(resume instanceof File) || resume.size === 0)
      throw new Error("Please attach your resume");
    if (resume.size > RESUME_MAX_BYTES) throw new Error("Resume must be 5 MB or smaller");
    if (!RESUME_TYPES[resume.type]) throw new Error("Resume must be a PDF, DOC or DOCX file");
    return { fields, resume };
  })
  .handler(async ({ data }): Promise<Result> => {
    const { fields, resume } = data;

    // Honeypot check
    if (fields.website && fields.website.length > 0) {
      return { ok: true };
    }

    let resumePath: string | undefined = undefined;

    // Optional Supabase storage
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const ext = RESUME_TYPES[resume.type];
      const safeName = fields.fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 40);
      const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}.${ext}`;

      const upload = await supabaseAdmin.storage
        .from("resumes")
        .upload(path, await resume.arrayBuffer(), { contentType: resume.type, upsert: false });

      if (!upload.error) {
        resumePath = path;
        await supabaseAdmin.from("career_applications").insert({
          full_name: fields.fullName,
          email: fields.email,
          phone: fields.phone,
          position: fields.position,
          message: fields.message || null,
          resume_path: path,
        });
      }
    } catch (e) {
      console.warn("Supabase career storage fallback:", e);
    }

    // Primary Centralized CRM Lead persistence
    try {
      saveWebsiteLead({
        fullName: fields.fullName,
        phone: fields.phone,
        email: fields.email,
        position: fields.position,
        message: fields.message || undefined,
        resumeUrl: resumePath || resume.name,
        sourceUrl: "/careers",
        formName: "Careers Job Application",
        formType: "career",
      });
    } catch (cmsErr) {
      console.warn("[CRM] Failed to record career lead:", cmsErr);
    }

    return { ok: true };
  });
