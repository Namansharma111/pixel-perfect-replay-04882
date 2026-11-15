import React, { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getCmsArticlesFn,
  deleteCmsArticleFn,
  duplicateCmsArticleFn,
  bulkUpdateCmsArticlesFn,
  getCmsCategoriesFn,
} from "@/lib/cms/cms.functions";
import type { CMSArticle, CMSCategory } from "@/lib/cms/types";
import {
  Plus,
  Search,
  Trash2,
  Copy,
  Edit,
  ExternalLink,
  CheckCircle2,
  Clock,
  Archive,
  Filter,
  Eye,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/articles/")({
  component: ArticlesListPageWrapper,
});

function ArticlesListPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <ArticlesListPage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function ArticlesListPage() {
  const { token, user } = useAdminAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = () => {
    setLoading(true);
    getCmsArticlesFn({
      data: {
        search,
        category: selectedCategory,
        status: selectedStatus,
      },
    })
      .then((res) => {
        if (res.ok) setArticles(res.articles);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, [search, selectedCategory, selectedStatus]);

  useEffect(() => {
    getCmsCategoriesFn().then((res) => {
      if (res.ok) setCategories(res.categories);
    });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    const res = await deleteCmsArticleFn({ data: { token, id } });
    if (res.ok) {
      toast.success("Article deleted successfully.");
      fetchArticles();
    } else {
      toast.error(res.error || "Failed to delete article.");
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!token) return;
    const res = await duplicateCmsArticleFn({ data: { token, id } });
    if (res.ok) {
      toast.success("Article duplicated as draft.");
      fetchArticles();
    } else {
      toast.error(res.error || "Failed to duplicate.");
    }
  };

  const handleBulkAction = async (action: "publish" | "draft" | "delete" | "archive") => {
    if (!token || selectedIds.length === 0) return;
    if (action === "delete" && !window.confirm(`Delete ${selectedIds.length} selected articles?`)) return;

    const res = await bulkUpdateCmsArticlesFn({ data: { token, ids: selectedIds, action } });
    if (res.ok) {
      toast.success(`Bulk ${action} executed.`);
      setSelectedIds([]);
      fetchArticles();
    } else {
      toast.error(res.error || "Bulk action failed.");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === articles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(articles.map((a) => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <AdminLayout
      title="Articles & Knowledge Base"
      actions={
        <Button
          asChild
          size="sm"
          className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20"
        >
          <Link to="/admin/articles/new">
            <Plus className="w-4 h-4 mr-1" /> Add New Article
          </Link>
        </Button>
      }
    >
      {/* Search and Filters Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-[#0B1437] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, slug, excerpt or author..."
            className="w-full pl-10 pr-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080F35] border border-white/10 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080F35] border border-white/10 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Controls */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-[#0E1B5A] border border-[#FF941E]/40 flex items-center justify-between gap-4 text-xs">
          <span className="font-bold text-white">
            {selectedIds.length} article(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkAction("publish")}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction("draft")}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors"
            >
              Draft
            </button>
            {user?.role === "admin" && (
              <button
                type="button"
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-[#0B1437] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#080F35]/70 text-slate-400">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={articles.length > 0 && selectedIds.length === articles.length}
                    onChange={toggleSelectAll}
                    className="rounded border-white/20 bg-[#080F35] text-[#FF941E] focus:ring-0"
                  />
                </th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px]">Article</th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px]">Author</th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px]">SEO Score</th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px]">Date</th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(art.id)}
                      onChange={() => toggleSelect(art.id)}
                      className="rounded border-white/20 bg-[#080F35] text-[#FF941E] focus:ring-0"
                    />
                  </td>
                  <td className="py-4 pr-4 max-w-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-9 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-white/10">
                        <img
                          src={art.featuredImage || "/src/assets/blog-seo.jpg"}
                          alt={art.featuredImageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          to="/admin/articles/$id"
                          params={{ id: art.id }}
                          className="font-bold text-white hover:text-[#FF941E] transition-colors line-clamp-1 text-xs"
                        >
                          {art.title}
                        </Link>
                        <p className="text-[10px] text-slate-400 truncate">
                          /articles/{art.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0E1B5A] text-[#FFD84A] border border-white/5">
                      {art.category}
                    </span>
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap text-slate-300">
                    {art.authorName}
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        (art.seo?.seoScore || 80) >= 80
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {art.seo?.seoScore || 85} / 100
                    </span>
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        art.status === "published"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : art.status === "draft"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {art.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap text-[11px] text-slate-400">
                    {art.publishedAt}
                  </td>
                  <td className="py-4 pr-4 text-right whitespace-nowrap space-x-1">
                    <Link
                      to="/admin/articles/$id"
                      params={{ id: art.id }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FF941E] hover:text-[#080F35] text-white transition-all inline-block"
                      title="Edit Article"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(art.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors inline-block"
                      title="Duplicate Article"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`/articles/${art.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors inline-block"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {user?.role === "admin" && (
                      <button
                        type="button"
                        onClick={() => handleDelete(art.id, art.title)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors inline-block"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {articles.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm">No articles match your search/filter criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
