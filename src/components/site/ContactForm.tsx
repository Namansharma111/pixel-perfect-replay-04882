import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { useLocation } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  contactSchema,
  type ContactInput,
} from "@/lib/form-schemas";
import { submitWebsiteLeadFn } from "@/lib/cms/cms.functions";
import { getLeadTrackingPayload } from "@/lib/tracking";
import type { FormType } from "@/lib/cms/types";
import { Field, Honeypot, fieldCls } from "./form-fields";
import { SITE } from "@/config/site";

export function ContactForm({
  defaultService,
  formName = "Contact Us & Project Inquiry Form",
  formType = "contact",
}: {
  defaultService?: (typeof SERVICE_OPTIONS)[number] | undefined;
  formName?: string | undefined;
  formType?: FormType | undefined;
}) {
  const submitLead = useServerFn(submitWebsiteLeadFn);
  const location = useLocation();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      phone: "",
      email: "",
      ...(defaultService ? { service: defaultService } : {}),
      budget: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("idle");
    setServerError("");
    try {
      const tracking = getLeadTrackingPayload(location.pathname);
      const res = await submitLead({
        data: {
          fullName: values.fullName,
          businessName: values.businessName || undefined,
          phone: values.phone,
          email: values.email,
          service: values.service,
          budget: values.budget || undefined,
          message: values.message,
          sourceUrl: tracking.sourceUrl,
          formName,
          formType,
          utmSource: tracking.utmSource,
          utmMedium: tracking.utmMedium,
          utmCampaign: tracking.utmCampaign,
          utmContent: tracking.utmContent,
          utmTerm: tracking.utmTerm,
          referrer: tracking.referrer,
          website: values.website,
        },
      });

      if (res && res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
        setServerError("We couldn't save your enquiry. Please check your details and try again.");
      }
    } catch (err) {
      setStatus("error");
      setServerError(
        "Something went wrong while sending. Please check your details and try again.",
      );
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-3xl border border-success/40 bg-success/10 p-10 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-success" />
        <h3 className="mt-4 text-2xl font-bold">Thank you — your enquiry has been received.</h3>
        <p className="mt-3 max-w-md text-muted-foreground">
          Our team will review your details and get back to you soon. For a faster reply, you can
          also message us on WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="whatsapp" size="lg">
            <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle /> WhatsApp us
            </a>
          </Button>
          <Button variant="glass" size="lg" onClick={() => setStatus("idle")}>
            Send another enquiry
          </Button>
        </div>
      </div>
    );
  }

  const err = (k: keyof ContactInput) => errors[k]?.message as string | undefined;
  const aria = (k: keyof ContactInput) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative grid gap-5 sm:grid-cols-2"
    >
      <Honeypot register={register} />
      <Field label="Full name" htmlFor="fullName" error={err("fullName")}>
        <input
          id="fullName"
          autoComplete="name"
          className={fieldCls}
          placeholder="Your name"
          {...aria("fullName")}
          {...register("fullName")}
        />
      </Field>
      <Field label="Business name" htmlFor="businessName" optional error={err("businessName")}>
        <input
          id="businessName"
          autoComplete="organization"
          className={fieldCls}
          placeholder="Your business"
          {...register("businessName")}
        />
      </Field>
      <Field label="Phone" htmlFor="phone" error={err("phone")}>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          className={fieldCls}
          placeholder="+91 98xxxxxxxx"
          {...aria("phone")}
          {...register("phone")}
        />
      </Field>
      <Field label="Email" htmlFor="email" error={err("email")}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={fieldCls}
          placeholder="you@business.com"
          {...aria("email")}
          {...register("email")}
        />
      </Field>
      <Field label="Interested service" htmlFor="service" error={err("service")}>
        <select
          id="service"
          className={fieldCls}
          defaultValue={defaultService ?? ""}
          {...aria("service")}
          {...register("service")}
        >
          <option value="" disabled>
            Select a service
          </option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Monthly budget" htmlFor="budget" optional error={err("budget")}>
        <select id="budget" className={fieldCls} defaultValue="" {...register("budget")}>
          <option value="">Select a range</option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Message" htmlFor="message" error={err("message")} className="sm:col-span-2">
        <textarea
          id="message"
          rows={5}
          className={fieldCls}
          placeholder="Tell us about your business, goals and timeline"
          {...aria("message")}
          {...register("message")}
        />
      </Field>
      {status === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:col-span-2"
        >
          {serverError}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          By submitting, you agree to our{" "}
          <a href="/privacy-policy" className="text-primary hover:underline">
            privacy policy
          </a>
          .
        </p>
        <Button type="submit" variant="hero" size="xl" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
          {isSubmitting ? "Sending…" : "Send Enquiry"}
        </Button>
      </div>
    </form>
  );
}
