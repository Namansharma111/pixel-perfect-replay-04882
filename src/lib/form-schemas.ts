import { z } from "zod";

export const SERVICE_OPTIONS = [
  "SEO & Organic Growth",
  "Google Ads & Performance Marketing",
  "Social Media Marketing & Paid Campaigns",
  "Content Marketing & Email Automation",
  "Branding & Creative Strategy",
  "Website & App Development",
  "UI/UX & CRO Optimization",
  "Offline & Local Advertising",
  "Public Relations (PR)",
  "Photoshoot & Creative Media",
  "Not sure yet — need guidance",
] as const;

export const BUDGET_OPTIONS = [
  "Under ₹15,000 / month",
  "₹15,000 – ₹30,000 / month",
  "₹30,000 – ₹60,000 / month",
  "₹60,000+ / month",
  "One-time project",
  "Prefer to discuss",
] as const;

export const POSITION_OPTIONS = [
  "Social Media Marketing",
  "SEO",
  "Performance Marketing / Ads",
  "Graphic Design",
  "Video Editing / Content Creation",
  "Web Development",
  "Content Writing",
  "Internship",
  "Other",
] as const;

const phone = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number")
  .max(20, "Please enter a valid phone number")
  .regex(/^[+]?[0-9\s-]{7,20}$/, "Use digits only, e.g. +91 98xxxxxxxx");

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  businessName: z.string().trim().max(120).optional().or(z.literal("")),
  phone,
  email: z.string().trim().email("Please enter a valid email address").max(255),
  service: z.enum(SERVICE_OPTIONS, { errorMap: () => ({ message: "Please choose a service" }) }),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters)")
    .max(2000),
  sourcePage: z.string().max(200).optional(),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0).optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone,
  position: z.enum(POSITION_OPTIONS, { errorMap: () => ({ message: "Please choose a position" }) }),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};
