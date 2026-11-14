import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, FileUp, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  POSITION_OPTIONS,
  RESUME_MAX_BYTES,
  RESUME_TYPES,
  applicationSchema,
  type ApplicationInput,
} from "@/lib/form-schemas";
import { submitApplication } from "@/lib/forms.functions";
import { Field, Honeypot, fieldCls } from "./form-fields";

export function CareerForm() {
  const submit = useServerFn(submitApplication);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { fullName: "", email: "", phone: "", message: "", website: "" },
  });

  const validateFile = (f: File | null) => {
    if (!f) return "Please attach your resume";
    if (!RESUME_TYPES[f.type]) return "Resume must be a PDF, DOC or DOCX file";
    if (f.size > RESUME_MAX_BYTES) return "Resume must be 5 MB or smaller";
    return "";
  };

  const onSubmit = async (values: ApplicationInput) => {
    const fe = validateFile(file);
    setFileError(fe);
    if (fe || !file) return;
    setStatus("idle");
    setServerError("");
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v ?? ""));
    fd.append("resume", file);
    try {
      const res = await submit({ data: fd });
      if (res.ok) {
        setStatus("success");
        reset();
        setFile(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setStatus("error");
        setServerError(res.error);
      }
    } catch (e) {
      setStatus("error");
      setServerError(
        e instanceof Error && e.message.length < 120
          ? e.message
          : "Something went wrong. Please try again.",
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
        <h3 className="mt-4 text-2xl font-bold">Application received — thank you!</h3>
        <p className="mt-3 max-w-md text-muted-foreground">
          We’ve saved your details and resume. If your profile matches a current or upcoming
          requirement, we’ll reach out.
        </p>
        <Button variant="glass" size="lg" className="mt-6" onClick={() => setStatus("idle")}>
          Submit another application
        </Button>
      </div>
    );
  }

  const err = (k: keyof ApplicationInput) => errors[k]?.message as string | undefined;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative grid gap-5 sm:grid-cols-2"
    >
      <Honeypot register={register} />
      <Field label="Full name" htmlFor="app-fullName" error={err("fullName")}>
        <input
          id="app-fullName"
          autoComplete="name"
          className={fieldCls}
          aria-invalid={!!errors.fullName}
          {...register("fullName")}
        />
      </Field>
      <Field label="Email" htmlFor="app-email" error={err("email")}>
        <input
          id="app-email"
          type="email"
          autoComplete="email"
          className={fieldCls}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>
      <Field label="Phone" htmlFor="app-phone" error={err("phone")}>
        <input
          id="app-phone"
          type="tel"
          autoComplete="tel"
          className={fieldCls}
          placeholder="+91 98xxxxxxxx"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
      </Field>
      <Field label="Position / area of interest" htmlFor="app-position" error={err("position")}>
        <select
          id="app-position"
          className={fieldCls}
          defaultValue=""
          aria-invalid={!!errors.position}
          {...register("position")}
        >
          <option value="" disabled>
            Select an area
          </option>
          {POSITION_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>
      <Field
        label="Message"
        htmlFor="app-message"
        optional
        error={err("message")}
        className="sm:col-span-2"
      >
        <textarea
          id="app-message"
          rows={4}
          className={fieldCls}
          placeholder="Tell us about your skills, experience and portfolio links"
          {...register("message")}
        />
      </Field>
      <Field
        label="Resume (PDF, DOC or DOCX, max 5 MB)"
        htmlFor="app-resume"
        error={fileError}
        className="sm:col-span-2"
      >
        <label
          htmlFor="app-resume"
          className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-input bg-background/40 px-5 py-5 transition-colors hover:border-primary/60"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <FileUp className="h-5 w-5" />
          </span>
          <span className="text-sm">
            <span className="block font-semibold text-foreground">
              {file ? file.name : "Choose your resume file"}
            </span>
            <span className="text-muted-foreground">
              {file
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                : "Click to browse from your device"}
            </span>
          </span>
        </label>
        <input
          ref={fileRef}
          id="app-resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setFile(f);
            setFileError(f ? validateFile(f) : "");
          }}
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
      <div className="sm:col-span-2">
        <Button
          type="submit"
          variant="hero"
          size="xl"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
          {isSubmitting ? "Submitting…" : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
