import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { SeoPanel } from "@/components/admin/SeoPanel";
import {
  getCmsArticleByIdFn,
  saveCmsArticleFn,
  deleteCmsArticleFn,
  getCmsCategoriesFn,
  getCmsTagsFn,
  getCmsAuthorsFn,
} from "@/lib/cms/cms.functions";
import type { CMSArticle, CMSCategory, CMSTag, CMSAuthor, ArticleSEO, ArticleFAQ } from "@/lib/cms/types";
import {
  Save,
  ArrowLeft,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Plus,
  Clock,
  History,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/articles/$id")({
  component: EditArticlePageWrapper,
});

function EditArticlePageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <EditArticlePage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function EditArticlePage() {
  const { id } = Route.useParams();
  const { token, user } = useAdminAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [tags, setTags] = useState<CMSTag[]>([]);
  const [authors, setAuthors] = useState<CMSAuthor[]>([]);

  const [article, setArticle] = useState<CMSArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled" | "archived">("published");
  const [publishedAt, setPublishedAt] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [allowSharing, setAllowSharing] = useState(true);
  const [faqs, setFaqs] = useState<ArticleFAQ[]>([]);
  const [seo, setSeo] = useState<ArticleSEO>({
    title: "",
    metaDescription: "",
    focusKeyword: "",
    secondaryKeywords: [],
    robots: "index,follow",
    twitterCard: "summary_large_image",
    seoScore: 85,
  });

  useEffect(() => {
    getCmsCategoriesFn().then((res) => {
      if (res.ok) setCategories(res.categories);
    });
    getCmsTagsFn().then((res) => {
      if (res.ok) setTags(res.tags);
    });
    getCmsAuthorsFn().then((res) => {
      if (res.ok) setAuthors(res.authors);
    });

    getCmsArticleByIdFn({ data: { id } })
      .then((res) => {
        if (res.ok && res.article) {
          const a = res.article;
          setArticle(a);
          setTitle(a.title);
          setSlug(a.slug);
          setExcerpt(a.excerpt);
          setContentHtml(a.contentHtml);
          setFeaturedImage(a.featuredImage);
          setFeaturedImageAlt(a.featuredImageAlt);
          setCategory(a.category);
          setSelectedTags(a.tags || []);
          setAuthorName(a.authorName);
          setStatus(a.status);
          setPublishedAt(a.publishedAt);
          setScheduledAt(a.scheduledAt || "");
          setIsFeatured(Boolean(a.isFeatured));
          setIsSticky(Boolean(a.isSticky));
          setAllowSharing(a.allowSharing ?? true);
          setFaqs(a.faqs || []);
          if (a.seo) setSeo(a.seo);
        } else {
          toast.error("Article not found.");
          navigate({ to: "/admin/articles" });
        }
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

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

  const handleSave = async (targetStatus?: "draft" | "published" | "scheduled" | "archived") => {
    if (!token || !article) return;
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required.");
      return;
    }

    const currentStatus = targetStatus || status;
    const words = contentHtml.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.ceil(words / 200) || 1;

    const updated: CMSArticle = {
      ...article,
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      contentHtml,
      featuredImage,
      featuredImageAlt: featuredImageAlt.trim() || title.trim(),
      category,
      tags: selectedTags,
      authorName,
      status: currentStatus,
      publishedAt: currentStatus === "scheduled" && scheduledAt ? scheduledAt : publishedAt,
      ...(currentStatus === "scheduled" && scheduledAt ? { scheduledAt } : {}),
      readingMinutes,
      isFeatured,
      isSticky,
      allowSharing,
      seo: {
        ...seo,
        title: seo.title || title.trim(),
        metaDescription: seo.metaDescription || excerpt.trim(),
      },
      faqs: faqs.filter((f) => f.q.trim() && f.a.trim()),
    };

    setSaving(true);
    try {
      const res = await saveCmsArticleFn({ data: { token, article: updated } });
      if (res.ok && res.article) {
        setArticle(res.article);
        toast.success("Article updated successfully!");
      } else {
        toast.error("Failed to update article.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving article.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !article) return;
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return;

    const res = await deleteCmsArticleFn({ data: { token, id: article.id } });
    if (res.ok) {
      toast.success("Article deleted.");
      navigate({ to: "/admin/articles" });
    } else {
      toast.error(res.error || "Failed to delete.");
    }
  };

  const handleRestoreRevision = (revHtml: string, revTitle: string) => {
    if (window.confirm("Restore this previous revision content?")) {
      setContentHtml(revHtml);
      setTitle(revTitle);
      toast.info("Revision loaded into editor. Remember to click Save.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-slate-400">Loading article editor...</div>
      </AdminLayout>
    );
  }

  if (!article) return null;

  return (
    <AdminLayout
      title={`Edit: ${article.title}`}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/articles"
            className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            ← Back
          </Link>
          <a
            href={`/articles/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FFD84A]" /> Public Page
          </a>
          <Button
            type="button"
            size="sm"
            disabled={saving}
            onClick={() => handleSave()}
            className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20"
          >
            <Save className="w-3.5 h-3.5 mr-1" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Article Title (H1)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#080F35] border border-white/15 text-white text-lg font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                URL Permalink Slug
              </label>
              <div className="flex items-center rounded-xl bg-[#080F35] border border-white/10 px-3 py-2 text-xs">
                <span className="text-slate-500 font-mono">/articles/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none resize-y"
              />
            </div>
          </div>

          {/* TipTap Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Article Body Content
              </label>
              <span className="text-[11px] text-[#FFD84A]">Last Updated: {article.updatedAt}</span>
            </div>
            <TipTapEditor content={contentHtml} onChange={setContentHtml} />
          </div>

          {/* FAQ Manager */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Frequently Asked Questions (FAQs)</h3>
                <p className="text-xs text-slate-400">
                  Visible Q&A accordion rendered directly on the public article page.
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

          {/* Revisions History Box */}
          {article.revisions && article.revisions.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-[#FFD84A]" /> Revisions & Edit History
              </h3>
              <div className="space-y-2">
                {article.revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-[#080F35] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{rev.authorName}</p>
                      <p className="text-[11px] text-slate-400">{rev.timestamp}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRestoreRevision(rev.contentHtml, rev.title)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#FF941E] hover:text-[#080F35] text-[11px] font-semibold transition-colors"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Publishing Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3">
              Status & Publishing
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
                <option value="published">Published (Public)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

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
                    {a.name}
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
                <span>Display Social Share buttons</span>
              </label>
            </div>

            <Button
              type="button"
              disabled={saving}
              onClick={() => handleSave()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-lg shadow-orange-500/25"
            >
              {saving ? "Saving..." : "Update & Save"}
            </Button>

            {user?.role === "admin" && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors mt-2"
              >
                Delete Article
              </button>
            )}
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
                className="w-full px-3.5 py-2 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Image ALT Text
              </label>
              <input
                type="text"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
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
