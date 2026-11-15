import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { useLocation } from "@tanstack/react-router";
import { PhoneCall, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { submitWebsiteLeadFn } from "@/lib/cms/cms.functions";
import { getLeadTrackingPayload } from "@/lib/tracking";
import { SERVICE_OPTIONS } from "@/lib/form-schemas";

const callbackSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Valid phone required")
    .max(20)
    .regex(/^[+]?[0-9\s-]{7,20}$/, "Digits only"),
  service: z.string().optional(),
  website: z.string().optional().or(z.literal("")),
});

type CallbackInput = z.infer<typeof callbackSchema>;

export function FooterCallbackForm() {
  const submitLead = useServerFn(submitWebsiteLeadFn);
  const location = useLocation();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CallbackInput>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      service: "SEO & Organic Growth",
      website: "",
    },
  });

  const onSubmit = async (values: CallbackInput) => {
    setStatus("idle");
    try {
      const tracking = getLeadTrackingPayload(location.pathname);
      const res = await submitLead({
        data: {
          fullName: values.fullName,
          phone: values.phone,
          email: `${values.phone.replace(/[^0-9]/g, "")}@callback-lead.socialwaale.internal`,
          service: values.service || "General Callback",
          message: `Quick callback request from website footer on page ${location.pathname}.`,
          sourceUrl: tracking.sourceUrl,
          formName: "Footer Quick Callback Request",
          formType: "callback",
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
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <p className="text-xs font-bold text-white">Callback Requested!</p>
        <p className="text-[11px] text-slate-300 mt-1">
          Our team will call your phone number within business hours.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-lg bg-[#FFD84A] text-[#080F35] flex items-center justify-center">
          <PhoneCall className="w-3.5 h-3.5" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-white">
          Request a Quick Callback
        </p>
      </div>
      <p className="text-[11px] text-slate-400 mb-3">
        Leave your number and our marketing director will call you back.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5" noValidate>
        <input
          type="text"
          {...register("website")}
          tabIndex={-1}
          autoComplete="off"
          className="sr-only pointer-events-none"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <input
              type="text"
              placeholder="Your name"
              {...register("fullName")}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
            />
            {errors.fullName && (
              <p className="text-[10px] text-rose-400 mt-0.5">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              placeholder="+91 Phone"
              {...register("phone")}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
            />
            {errors.phone && (
              <p className="text-[10px] text-rose-400 mt-0.5">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            {...register("service")}
            className="flex-1 px-3 py-2 rounded-xl bg-[#0B1437] border border-white/10 text-xs text-slate-300 outline-none focus:border-amber-400"
          >
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xs hover:opacity-95 transition shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                Call Me <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

        {status === "error" && (
          <p className="text-[10px] text-rose-400">Failed to request callback. Please call us directly.</p>
        )}
      </form>
    </div>
  );
}
