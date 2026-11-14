import { createServerFn } from "@tanstack/react-start";
import { applicationSchema, contactSchema, RESUME_MAX_BYTES, RESUME_TYPES } from "./form-schemas";

type Result = { ok: true } | { ok: false; error: string };

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }): Promise<Result> => {
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
      console.error("contact insert failed", error);
      return { ok: false, error: "We couldn’t send your enquiry right now. Please try again or WhatsApp us." };
    }
    return { ok: true };
  });

export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
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
    if (!(resume instanceof File) || resume.size === 0) throw new Error("Please attach your resume");
    if (resume.size > RESUME_MAX_BYTES) throw new Error("Resume must be 5 MB or smaller");
    if (!RESUME_TYPES[resume.type]) throw new Error("Resume must be a PDF, DOC or DOCX file");
    return { fields, resume };
  })
  .handler(async ({ data }): Promise<Result> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { fields, resume } = data;
    const ext = RESUME_TYPES[resume.type];
    const safeName = fields.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}.${ext}`;

    const upload = await supabaseAdmin.storage
      .from("resumes")
      .upload(path, await resume.arrayBuffer(), { contentType: resume.type, upsert: false });
    if (upload.error) {
      console.error("resume upload failed", upload.error);
      return { ok: false, error: "We couldn’t upload your resume. Please try again." };
    }

    const { error } = await supabaseAdmin.from("career_applications").insert({
      full_name: fields.fullName,
      email: fields.email,
      phone: fields.phone,
      position: fields.position,
      message: fields.message || null,
      resume_path: path,
    });
    if (error) {
      console.error("application insert failed", error);
      await supabaseAdmin.storage.from("resumes").remove([path]);
      return { ok: false, error: "We couldn’t submit your application. Please try again." };
    }
    return { ok: true };
  });
