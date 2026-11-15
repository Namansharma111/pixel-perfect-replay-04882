import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Link as LinkIcon,
  Download,
  ClipboardPaste,
  X,
  Sparkles,
  ShieldCheck,
  Video,
  Film,
  Image as ImageIcon,
  Layers,
  BookOpen,
  Eye,
  Check,
} from "lucide-react";
import { resolveInstagramMediaFn } from "@/lib/downloader/downloader.functions";
import type { InstagramMediaResult } from "@/lib/downloader/instagram";
import { DownloaderResults } from "./DownloaderResults";

export interface DownloaderHeroProps {
  currentSlug: string;
  toolType: "all" | "video" | "reels" | "photo" | "story" | "carousel" | "viewer";
  h1: string;
  subtitle: string;
  inputPlaceholder?: string | undefined;
  downloadButtonText?: string | undefined;
  heroImage?: string | undefined;
  heroImageAlt?: string | undefined;
}

const TOOLS_NAV = [
  { slug: "instagram-downloader", label: "All in One", icon: Sparkles, type: "all" },
  { slug: "instagram-video-downloader", label: "Video", icon: Video, type: "video" },
  { slug: "instagram-reels-downloader", label: "Reels", icon: Film, type: "reels" },
  { slug: "instagram-photo-downloader", label: "Photo", icon: ImageIcon, type: "photo" },
  { slug: "instagram-carousel-downloader", label: "Carousel", icon: Layers, type: "carousel" },
  { slug: "instagram-story-downloader", label: "Story", icon: BookOpen, type: "story" },
  { slug: "instagram-viewer", label: "Viewer", icon: Eye, type: "viewer" },
] as const;

export function DownloaderHero({
  currentSlug,
  toolType,
  h1,
  subtitle,
  inputPlaceholder,
  downloadButtonText,
}: DownloaderHeroProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InstagramMediaResult | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const handlePaste = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setClientError(null);
          setPasteSuccess(true);
          setTimeout(() => setPasteSuccess(false), 2000);
        }
      }
    } catch {
      // Clipboard permission denied or unsupported
      setClientError("Unable to access clipboard. Please manually paste your link.");
    }
  };

  const handleClear = () => {
    setUrl("");
    setClientError(null);
    setResult(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setClientError(null);

    const clean = url.trim();
    if (!clean) {
      setClientError("Please paste an Instagram link to start downloading.");
      return;
    }

    if (!clean.includes("instagram.com") && !clean.includes("instagr.am")) {
      setClientError("Please enter a valid Instagram URL (e.g. instagram.com/reel/...).");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await resolveInstagramMediaFn({
        data: { url: clean, toolType },
      });
      setResult(response);
    } catch (err: any) {
      console.error("[DownloaderHero] fetch error:", err);
      setResult({
        ok: false,
        shortcode: "",
        url: clean,
        contentType: "unknown",
        items: [],
        error:
          err?.message ||
          "Failed to connect to the downloader service. Please check your internet and try again.",
        errorType: "unknown",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-orange-500/15 to-amber-400/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-amber-300 shadow-sm mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD84A]" />
          <span>Fast, Free & 100% Watermark-Free Downloader</span>
        </div>

        {/* H1 Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          {h1}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          {subtitle}
        </p>

        {/* Categories Tab Navigation */}
        <div className="mt-8 flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md max-w-full overflow-x-auto">
            {TOOLS_NAV.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentSlug === tool.slug;
              return (
                <Link
                  key={tool.slug}
                  to={`/${tool.slug}`}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] shadow-md shadow-orange-500/20"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tool.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Downloader Search / URL Input Box */}
        <div className="mt-8 mx-auto max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col sm:flex-row items-center gap-2.5 p-2.5 rounded-3xl bg-[#0E1B5A]/90 border-2 border-white/20 shadow-2xl backdrop-blur-xl focus-within:border-amber-400/80 transition-all"
          >
            <div className="relative flex-1 w-full flex items-center">
              <div className="absolute left-4 text-slate-400">
                <LinkIcon className="w-5 h-5" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (clientError) setClientError(null);
                }}
                placeholder={inputPlaceholder || "Paste Instagram post, reel, or photo link here..."}
                className="w-full pl-12 pr-20 py-3.5 bg-transparent text-white placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
              />

              <div className="absolute right-3 flex items-center gap-1.5">
                {url ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    title="Clear input"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    title="Paste from clipboard"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition border border-white/10"
                  >
                    {pasteSuccess ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Pasted</span>
                      </>
                    ) : (
                      <>
                        <ClipboardPaste className="w-3 h-3 text-amber-300" />
                        <span>Paste</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-base hover:opacity-95 active:scale-95 transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#080F35] border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>{downloadButtonText || "Download"}</span>
                </>
              )}
            </button>
          </form>

          {/* Client Error validation */}
          {clientError && (
            <p className="mt-3 text-xs sm:text-sm font-semibold text-rose-300 text-left px-2">
              {clientError}
            </p>
          )}

          {/* Security and Trust Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free & Safe</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFD84A]" />
              <span>Full HD 1080p Quality</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-sky-400" />
              <span>No Watermark & No Login</span>
            </span>
          </div>
        </div>

        {/* Results Component Container */}
        <DownloaderResults
          result={result}
          isLoading={loading}
          onReset={handleClear}
        />
      </div>
    </section>
  );
}
