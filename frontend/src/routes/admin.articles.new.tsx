import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { SeoPanel } from "@/components/admin/SeoPanel";
import {
  saveCmsArticleFn,
  getCmsCategoriesFn,
  getCmsTagsFn,
  getCmsAuthorsFn,
} from "@/lib/cms/cms.functions";
import type { CMSArticle, CMSCategory, CMSTag, CMSAuthor, ArticleSEO, ArticleFAQ } from "@/lib/cms/types";
import {
  Save,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/articles/new")({
  component: NewArticlePageWrapper,
});

function NewArticlePageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <NewArticlePage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function NewArticlePage() {
  const { token, user } = useAdminAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [tags, setTags] = useState<CMSTag[]>([]);
  const [authors, setAuthors] = useState<CMSAuthor[]>([]);

  // Article state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("<p>Write your high-impact digital marketing guide here...</p>");
  const [featuredImage, setFeaturedImage] = useState("/src/assets/blog-seo.jpg");
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [category, setCategory] = useState("seo");
  const [selectedTags, setSelectedTags] = useState<string[]>(["seo-tips"]);
  const [authorName, setAuthorName] = useState("Social Waale Team");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("published");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split("T")[0]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [allowSharing, setAllowSharing] = useState(true);

  // FAQs state
  const [faqs, setFaqs] = useState<ArticleFAQ[]>([
    { q: "What is the key takeaway of this strategy?", a: "Consistent execution and measurable tracking drive the best return on investment." },
  ]);

  // SEO state
  const [seo, setSeo] = useState<ArticleSEO>({
    title: "",
    metaDescription: "",
    focusKeyword: "",
    secondaryKeywords: [],
    robots: "index,follow",
    twitterCard: "summary_large_image",
    seoScore: 85,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCmsCategoriesFn().then((res) => {
      if (res.ok && res.categories && res.categories.length > 0 && res.categories[0]) {
        setCategories(res.categories);
        setCategory(res.categories[0].slug);
      }
    });
    getCmsTagsFn().then((res) => {
      if (res.ok && res.tags) setTags(res.tags);
    });
    getCmsAuthorsFn().then((res) => {
      if (res.ok && res.authors && res.authors.length > 0 && res.authors[0]) {
        setAuthors(res.authors);
        setAuthorName(res.authors[0].name);
      }
    });
  }, []);

  // Auto-slugify
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(generated);
    }
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { q: "", a: "" }]);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleFaqChange = (idx: number, field: "q" | "a", val: string) => {
    const updated = [...faqs];
    const item = updated[idx];
    if (item) {
      item[field] = val;
      setFaqs(updated);
    }
  };

  const toggleTag = (tagSlug: string) => {
    if (selectedTags.includes(tagSlug)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagSlug));
    } else {
      setSelectedTags([...selectedTags, tagSlug]);
    }
  };

  const handleSave = async (targetStatus?: "draft" | "published" | "scheduled") => {
    if (!token) return;
    if (!title.trim()) {
      toast.error("Please enter an article title.");
      return;
    }
    if (!slug.trim()) {
      toast.error("Please enter a valid article slug.");
      return;
    }

    const currentStatus = targetStatus || status;
    const words = contentHtml.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.ceil(words / 200) || 1;

    const newArticle: CMSArticle = {
      id: `art-${Date.now()}`,
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      contentHtml,
      featuredImage,
      featuredImageAlt: featuredImageAlt.trim() || title.trim(),
      category,
      tags: selectedTags,
      authorId: "author-1",
      authorName,
      status: currentStatus,
      publishedAt: currentStatus === "scheduled" && scheduledAt ? scheduledAt : publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(currentStatus === "scheduled" && scheduledAt ? { scheduledAt } : {}),
      readingMinutes,
      isFeatured,
      isSticky,
      allowComments: false,
      allowSharing,
      views: 0,
      seo: {
        ...seo,
        title: seo.title || title.trim(),
        metaDescription: seo.metaDescription || excerpt.trim(),
      },
      faqs: faqs.filter((f) => f.q.trim() && f.a.trim()),
      relatedArticleIds: [],
      relatedServices: ["seo-services", "social-media-marketing"],
    };

    setSaving(true);
    try {
      const res = await saveCmsArticleFn({ data: { token, article: newArticle } });
      if (res.ok) {
        toast.success(
          currentStatus === "published"
            ? "Article published live!"
            : currentStatus === "scheduled"
              ? "Article scheduled successfully."
              : "Draft saved successfully.",
        );
        navigate({ to: "/admin/articles" });
      } else {
        toast.error("Failed to save article.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Create New Blog Article"
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/articles"
            className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="rounded-full text-xs border-white/20 text-white hover:bg-white/10"
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={saving}
            onClick={() => handleSave("published")}
            className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20"
          >
            <Save className="w-3.5 h-3.5 mr-1" /> Publish Immediately
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Editor & Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug Box */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Article Title (H1)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. 10 Actionable SEO Strategies for Businesses in North India"
                className="w-full px-4 py-3 rounded-2xl bg-[#080F35] border border-white/15 text-white text-lg font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  URL Permalink Slug
                </label>
                <button
                  type="button"
                  onClick={() => setIsSlugManual(!isSlugManual)}
                  className="text-[11px] text-[#FFD84A] hover:underline"
                >
                  {isSlugManual ? "Auto-generate from Title" : "Edit Slug Manually"}
                </button>
              </div>
              <div className="flex items-center rounded-xl bg-[#080F35] border border-white/10 px-3 py-2 text-xs">
                <span className="text-slate-500 font-mono">/articles/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsSlugManual(true);
                  }}
                  placeholder="article-slug"
                  className="bg-transparent border-0 text-white font-mono text-xs focus:outline-none w-full ml-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Article Excerpt / Summary
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="2-3 sentence overview displayed on article cards, RSS feed, and search snippets..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none resize-y"
              />
            </div>
          </div>

          {/* TipTap Rich Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Article Body Content
              </label>
              <span className="text-[11px] text-[#FFD84A]">Full Rich Text & HTML Supported</span>
            </div>
            <TipTapEditor content={contentHtml} onChange={setContentHtml} />
          </div>

          {/* FAQ Manager */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Frequently Asked Questions (FAQs)</h3>
                <p className="text-xs text-slate-400">
                  Adds structured Q&A accordions to the public article page and outputs FAQ schema.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="px-3 py-1.5 rounded-xl bg-[#0E1B5A] text-[#FFD84A] hover:bg-[#FF941E] hover:text-[#080F35] text-xs font-bold transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#080F35] border border-white/10 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(i)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-400"
                    title="Remove question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="space-y-2 pr-6">
                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => handleFaqChange(i, "q", e.target.value)}
                      placeholder="Question..."
                      className="w-full px-3 py-2 rounded-lg bg-[#0B1437] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF941E]"
                    />
                    <textarea
                      rows={2}
                      value={faq.a}
                      onChange={(e) => handleFaqChange(i, "a", e.target.value)}
                      placeholder="Answer..."
                      className="w-full px-3 py-2 rounded-lg bg-[#0B1437] border border-white/10 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF941E]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On-Page SEO Panel */}
          <SeoPanel
            seo={seo}
            slug={slug}
            articleTitle={title}
            articleExcerpt={excerpt}
            featuredImage={featuredImage}
            contentHtml={contentHtml}
            onChange={setSeo}
          />
        </div>

        {/* Right Column: Publishing Controls & Metadata */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication Card */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3">
              Publishing Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Article Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
              >
                <option value="published">Publish Immediately</option>
                <option value="draft">Save as Draft</option>
                <option value="scheduled">Schedule Publication</option>
              </select>
            </div>

            {status === "scheduled" && (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Author
              </label>
              <select
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name} ({a.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Publish Date
              </label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
              />
            </div>

            {/* Toggles */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-white/20 bg-[#080F35] text-[#FF941E] focus:ring-0"
                />
                <span>Set as Featured Spotlight article</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSticky}
                  onChange={(e) => setIsSticky(e.target.checked)}
                  className="rounded border-white/20 bg-[#080F35] text-[#FF941E] focus:ring-0"
                />
                <span>Pin to top of blog list</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowSharing}
                  onChange={(e) => setAllowSharing(e.target.checked)}
                  className="rounded border-white/20 bg-[#080F35] text-[#FF941E] focus:ring-0"
                />
                <span>Display WhatsApp & Social Share buttons</span>
              </label>
            </div>

            <Button
              type="button"
              disabled={saving}
              onClick={() => handleSave()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-lg shadow-orange-500/25"
            >
              {saving ? "Saving..." : "Save & Commit"}
            </Button>
          </div>

          {/* Featured Image Card */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#FF941E]" /> Featured Image
            </h3>

            <div className="aspect-[16/10] rounded-xl bg-slate-800 overflow-hidden border border-white/10 relative">
              <img
                src={featuredImage}
                alt="Featured preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Image Asset URL
              </label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="/src/assets/blog-seo.jpg"
                className="w-full px-3.5 py-2 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Image ALT Text (Critical for SEO)
              </label>
              <input
                type="text"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                placeholder="Descriptive image text for Google Image search..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
              />
            </div>
          </div>

          {/* Categories Card */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FFD84A]" /> Primary Category
            </h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Card */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => {
                const active = selectedTags.includes(t.slug);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTag(t.slug)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                      active
                        ? "bg-[#FF941E] text-[#080F35]"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    #{t.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
