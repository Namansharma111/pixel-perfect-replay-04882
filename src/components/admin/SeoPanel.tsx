import React, { useState } from "react";
import type { ArticleSEO } from "@/lib/cms/types";
import {
  Globe,
  Share2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Eye,
  FileCode,
} from "lucide-react";

interface SeoPanelProps {
  seo: ArticleSEO;
  slug: string;
  articleTitle: string;
  articleExcerpt: string;
  featuredImage: string;
  contentHtml: string;
  onChange: (updatedSeo: ArticleSEO) => void;
}

export function SeoPanel({
  seo,
  slug,
  articleTitle,
  articleExcerpt,
  featuredImage,
  contentHtml,
  onChange,
}: SeoPanelProps) {
  const [activeTab, setActiveTab] = useState<"general" | "social" | "schema" | "checklist">("general");
  const [copiedSchema, setCopiedSchema] = useState(false);

  const displayTitle = seo.title || articleTitle || "Article Title";
  const displayDesc = seo.metaDescription || articleExcerpt || "Enter a compelling meta description...";
  const displayUrl = `https://socialwaale.com/articles/${slug || "article-slug"}`;

  // Length checks
  const titleLen = displayTitle.length;
  const descLen = displayDesc.length;
  const isTitleGood = titleLen >= 40 && titleLen <= 65;
  const isDescGood = descLen >= 120 && descLen <= 160;

  // Real-time SEO checklist
  const focusKw = (seo.focusKeyword || "").toLowerCase().trim();
  const kwInTitle = focusKw ? displayTitle.toLowerCase().includes(focusKw) : false;
  const kwInDesc = focusKw ? displayDesc.toLowerCase().includes(focusKw) : false;
  const kwInSlug = focusKw ? slug.toLowerCase().includes(focusKw.replace(/\s+/g, "-")) : false;
  const kwInContent = focusKw ? contentHtml.toLowerCase().includes(focusKw) : false;
  const hasH2 = contentHtml.includes("<h2");
  const hasImages = contentHtml.includes("<img");
  const hasLinks = contentHtml.includes("<a href");
  const wordCount = contentHtml.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const isLongEnough = wordCount >= 600;

  // Calculate dynamic score
  const checks = [
    { label: "Focus Keyword defined", passed: Boolean(focusKw), weight: 15 },
    { label: "Focus Keyword in SEO Title", passed: kwInTitle, weight: 15 },
    { label: "Focus Keyword in Meta Description", passed: kwInDesc, weight: 15 },
    { label: "Focus Keyword in URL Slug", passed: kwInSlug, weight: 10 },
    { label: "Focus Keyword in Content Body", passed: kwInContent, weight: 10 },
    { label: "SEO Title length optimal (40-65 chars)", passed: isTitleGood, weight: 10 },
    { label: "Meta Description length optimal (120-160 chars)", passed: isDescGood, weight: 10 },
    { label: "Content depth (at least 600 words)", passed: isLongEnough, weight: 5 },
    { label: "Structured headings (H2/H3)", passed: hasH2, weight: 5 },
    { label: "Internal/External links present", passed: hasLinks, weight: 5 },
  ];

  const calculatedScore = checks.reduce((acc, c) => (c.passed ? acc + c.weight : acc), 0);

  // Generated JSON-LD
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: displayTitle,
    description: displayDesc,
    image: featuredImage || "https://socialwaale.com/social-waale-logo.jpg",
    url: displayUrl,
    datePublished: new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      name: "Social Waale",
      url: "https://socialwaale.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Social Waale",
      logo: {
        "@type": "ImageObject",
        url: "https://socialwaale.com/favicon.png",
      },
    },
  };

  const handleCopySchema = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(JSON.stringify(schemaJson, null, 2));
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  return (
    <div className="bg-[#0B1437] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
      {/* Header with Score */}
      <div className="p-4 bg-[#080F35] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#FF941E]" />
          <h3 className="text-sm font-bold text-white">On-Page SEO & Social Distribution</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
            <span className="text-slate-400">SEO Health:</span>
            <span
              className={`font-black ${
                calculatedScore >= 80
                  ? "text-emerald-400"
                  : calculatedScore >= 50
                    ? "text-[#FFD84A]"
                    : "text-rose-400"
              }`}
            >
              {calculatedScore} / 100
            </span>
          </div>

          <div className="flex rounded-lg bg-white/5 p-0.5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeTab === "general" ? "bg-[#FF941E] text-[#080F35]" : "text-slate-300 hover:text-white"
              }`}
            >
              Search Meta
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("social")}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeTab === "social" ? "bg-[#FF941E] text-[#080F35]" : "text-slate-300 hover:text-white"
              }`}
            >
              Social Previews
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("checklist")}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeTab === "checklist" ? "bg-[#FF941E] text-[#080F35]" : "text-slate-300 hover:text-white"
              }`}
            >
              Audit ({checks.filter((c) => c.passed).length}/{checks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schema")}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeTab === "schema" ? "bg-[#FF941E] text-[#080F35]" : "text-slate-300 hover:text-white"
              }`}
            >
              JSON-LD
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: General Search Meta */}
      {activeTab === "general" && (
        <div className="p-6 space-y-6">
          {/* Google Preview Snippet */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Google Desktop Search Preview
            </p>
            <div className="p-4 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-sm max-w-2xl font-sans">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-800">socialwaale.com</span>
                <span>› articles › {slug || "article-slug"}</span>
              </div>
              <h4 className="text-blue-700 text-lg hover:underline cursor-pointer font-medium leading-snug line-clamp-1">
                {displayTitle}
              </h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {displayDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Focus Keyword */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Focus Keyword
              </label>
              <input
                type="text"
                value={seo.focusKeyword || ""}
                onChange={(e) => onChange({ ...seo, focusKeyword: e.target.value })}
                placeholder="e.g. digital marketing agency chandigarh"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Primary search term this article aims to rank for.
              </p>
            </div>

            {/* Robots Directive */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Robots Meta
              </label>
              <select
                value={seo.robots || "index,follow"}
                onChange={(e) => onChange({ ...seo, robots: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
              >
                <option value="index,follow">index, follow (Default - Recommended)</option>
                <option value="noindex,follow">noindex, follow (Hide from search)</option>
                <option value="noindex,nofollow">noindex, nofollow (Strict block)</option>
              </select>
            </div>
          </div>

          {/* SEO Title Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                SEO Meta Title
              </label>
              <span
                className={`text-xs font-mono font-bold ${
                  isTitleGood ? "text-emerald-400" : titleLen > 65 ? "text-rose-400" : "text-amber-400"
                }`}
              >
                {titleLen} / 60 characters {titleLen > 65 && "(Warning: May be truncated on Google)"}
              </span>
            </div>
            <input
              type="text"
              value={seo.title || ""}
              onChange={(e) => onChange({ ...seo, title: e.target.value })}
              placeholder={articleTitle || "Enter SEO title..."}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
            />
          </div>

          {/* Meta Description Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                SEO Meta Description
              </label>
              <span
                className={`text-xs font-mono font-bold ${
                  isDescGood ? "text-emerald-400" : descLen > 160 ? "text-rose-400" : "text-amber-400"
                }`}
              >
                {descLen} / 155 characters {descLen > 160 && "(Warning: Over recommended 160 max)"}
              </span>
            </div>
            <textarea
              rows={3}
              value={seo.metaDescription || ""}
              onChange={(e) => onChange({ ...seo, metaDescription: e.target.value })}
              placeholder={articleExcerpt || "Enter compelling meta description..."}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none resize-y"
            />
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Canonical URL Override (Optional)
            </label>
            <input
              type="text"
              value={seo.canonicalUrl || ""}
              onChange={(e) => onChange({ ...seo, canonicalUrl: e.target.value })}
              placeholder={displayUrl}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to automatically use the default article URL.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Social Media Previews */}
      {activeTab === "social" && (
        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-300">
            Customize how this article appears when shared across WhatsApp, LinkedIn, Facebook, and Twitter.
          </p>

          {/* Social Card Preview */}
          <div className="max-w-md mx-auto rounded-2xl overflow-hidden bg-white text-slate-900 border border-slate-300 shadow-xl font-sans">
            <div className="aspect-[16/9] bg-slate-200 relative overflow-hidden">
              <img
                src={seo.ogImage || featuredImage || "/src/assets/blog-seo.jpg"}
                alt="Social Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] uppercase font-bold tracking-wider">
                Preview Card
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                SOCIALWAALE.COM
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                {seo.ogTitle || displayTitle}
              </h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {seo.ogDescription || displayDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Social Title (OG Title)
              </label>
              <input
                type="text"
                value={seo.ogTitle || ""}
                onChange={(e) => onChange({ ...seo, ogTitle: e.target.value })}
                placeholder={displayTitle}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Social Image URL
              </label>
              <input
                type="text"
                value={seo.ogImage || ""}
                onChange={(e) => onChange({ ...seo, ogImage: e.target.value })}
                placeholder={featuredImage || "/src/assets/blog-seo.jpg"}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Audit Checklist */}
      {activeTab === "checklist" && (
        <div className="p-6">
          <div className="space-y-3">
            {checks.map((c, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
                  c.passed
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {c.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{c.label}</span>
                </div>
                <span className="font-bold text-[11px] opacity-80">+{c.weight} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: JSON-LD Schema */}
      {activeTab === "schema" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">
              Article JSON-LD Microdata (Google Verified)
            </span>
            <button
              type="button"
              onClick={handleCopySchema}
              className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSchema ? "Copied" : "Copy JSON-LD"}
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-[#080F35] border border-white/10 text-emerald-400 font-mono text-xs overflow-x-auto">
            {JSON.stringify(schemaJson, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
