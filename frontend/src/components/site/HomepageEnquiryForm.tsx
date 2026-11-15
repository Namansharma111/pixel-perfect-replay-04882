import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import {
  CheckCircle2,
  Loader2,
  Send,
  MessageCircle,
  Sparkles,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  contactSchema,
  type ContactInput,
} from "@/lib/form-schemas";
import { submitWebsiteLeadFn } from "@/lib/cms/cms.functions";
import { getLeadTrackingPayload } from "@/lib/tracking";
import { SITE } from "@/config/site";

export function HomepageEnquiryForm() {
  const submitLead = useServerFn(submitWebsiteLeadFn);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");

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
      service: "SEO & Organic Growth",
      budget: "₹30,000 – ₹60,000 / month",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("idle");
    setServerMsg("");

    try {
      const tracking = getLeadTrackingPayload("/");
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
          formName: "Homepage Quick Enquiry & Quote Form",
          formType: "quote",
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
        setServerMsg(res.message || "Thank you! Your enquiry has been received.");
        reset();
      } else {
        setStatus("error");
        setServerMsg("Could not submit enquiry. Please try again or WhatsApp us.");
      }
    } catch {
      setStatus("error");
      setServerMsg("Something went wrong. Please check your connection and try again.");
    }
  };

  return (
    <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 sm:p-10 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Glow highlight */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF941E]/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/10 text-[#FFD84A] border border-white/10">
            <Sparkles className="w-3 h-3 text-[#FF941E]" /> FAST PROPOSAL IN 24H
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          Request a Free Growth Audit & Quote
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          Tell us about your brand and what you want to achieve. No hard pitch, no pressure.
        </p>
      </div>

      {status === "success" ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center animate-in fade-in">
          <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
          <h4 className="text-xl font-bold text-white">Enquiry Received!</h4>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-md mx-auto">
            {serverMsg} A dedicated marketing strategist will review your business and prepare an actionable plan.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="whatsapp" size="sm">
              <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-1.5" /> Instant WhatsApp Connect
              </a>
            </Button>
            <Button
              type="button"
              variant="glass"
              size="sm"
              onClick={() => setStatus("idle")}
            >
              Submit Another Inquiry
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Honeypot field for bot prevention */}
          <input
            type="text"
            {...register("website")}
            tabIndex={-1}
            autoComplete="off"
            className="sr-only pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hp-name" className="block text-xs font-bold text-slate-200 mb-1">
                Your Full Name *
              </label>
              <input
                id="hp-name"
                type="text"
                placeholder="e.g. Aman Verma"
                {...register("fullName")}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              {errors.fullName && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="hp-business" className="block text-xs font-bold text-slate-200 mb-1">
                Business / Company Name (Optional)
              </label>
              <input
                id="hp-business"
                type="text"
                placeholder="e.g. Verma Retail & Co."
                {...register("businessName")}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hp-phone" className="block text-xs font-bold text-slate-200 mb-1">
                Phone Number *
              </label>
              <input
                id="hp-phone"
                type="tel"
                placeholder="e.g. +91 98xxxxxxxx"
                {...register("phone")}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="hp-email" className="block text-xs font-bold text-slate-200 mb-1">
                Email Address *
              </label>
              <input
                id="hp-email"
                type="email"
                placeholder="you@company.com"
                {...register("email")}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hp-service" className="block text-xs font-bold text-slate-200 mb-1">
                Primary Service Needed *
              </label>
              <select
                id="hp-service"
                {...register("service")}
                className="w-full rounded-xl border border-white/10 bg-[#0B1437] px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
              >
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hp-budget" className="block text-xs font-bold text-slate-200 mb-1">
                Estimated Monthly Budget
              </label>
              <select
                id="hp-budget"
                {...register("budget")}
                className="w-full rounded-xl border border-white/10 bg-[#0B1437] px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
              >
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="hp-message" className="block text-xs font-bold text-slate-200 mb-1">
              Project Requirements / Current Challenges *
            </label>
            <textarea
              id="hp-message"
              rows={3}
              placeholder="Tell us what you sell, where you want to grow, or any current hurdles with marketing..."
              {...register("message")}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none"
            />
            {errors.message && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.message.message}</p>
            )}
          </div>

          {status === "error" && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {serverMsg}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> 100% confidential. No spam ever.
            </span>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xs hover:opacity-95 transition shadow-lg shadow-orange-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending Enquiry...
                </>
              ) : (
                <>
                  Get Free Strategy Proposal <Send className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
