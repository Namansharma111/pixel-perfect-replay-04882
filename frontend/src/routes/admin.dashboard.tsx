import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCmsDashboardStatsFn } from "@/lib/cms/cms.functions";
import type { CMSArticle } from "@/lib/cms/types";
import {
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  FolderTree,
  Tag,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPageWrapper,
});

function DashboardPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <DashboardPage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function DashboardPage() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentArticles, setRecentArticles] = useState<CMSArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCmsDashboardStatsFn()
      .then((res) => {
        if (res.ok) {
          setStats(res.stats);
          setRecentArticles(res.recentArticles);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout
      title="CMS Overview & Analytics"
      actions={
        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-full border-white/20 text-white hover:bg-white/10 text-xs font-bold"
          >
            <Link to="/admin/services">
              <Briefcase className="w-4 h-4 mr-1.5 text-[#FF941E]" /> Manage Services
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20"
          >
            <Link to="/admin/articles/new">
              <Plus className="w-4 h-4 mr-1" /> Create New Article
            </Link>
          </Button>
        </div>
      }
    >
      {/* Welcome Banner */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#0E1B5A] to-[#080F35] border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#FFD84A] uppercase">
            CHANDIGARH DIGITAL MARKETING HQ
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Welcome back, {user?.name || "Administrator"}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Manage your digital marketing services, blog publications, on-page SEO meta tags, and monitor search distribution across North India.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="/services"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#FF941E]" /> Live Services
          </a>
          <a
            href="/articles"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FFD84A]" /> Live Public Blog
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Link
          to="/admin/services"
          className="p-5 rounded-2xl bg-[#0B1437] border border-white/10 shadow-sm hover:border-[#FF941E]/50 transition-colors group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors">
              Services
            </span>
            <Briefcase className="w-4 h-4 text-[#FF941E]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {stats?.publishedServices ?? 10}
            <span className="text-sm font-normal text-slate-400">/{stats?.totalServices ?? 10}</span>
          </p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active Offerings
          </p>
        </Link>

        <div className="p-5 rounded-2xl bg-[#0B1437] border border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Articles</span>
            <FileText className="w-4 h-4 text-[#FF941E]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{stats?.totalArticles ?? "—"}</p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {stats?.publishedArticles ?? 0} Published
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1437] border border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Drafts & Sched.</span>
            <Clock className="w-4 h-4 text-[#FFD84A]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {(stats?.draftArticles ?? 0) + (stats?.scheduledArticles ?? 0)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats?.draftArticles ?? 0} drafts, {stats?.scheduledArticles ?? 0} scheduled
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1437] border border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Blog Views</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{stats?.totalViews ?? "—"}</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Organic Engagement
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1437] border border-white/10 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Categories / Tags</span>
            <FolderTree className="w-4 h-4 text-[#FF941E]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalCategories ?? 0} / {stats?.totalTags ?? 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Structured taxonomy</p>
        </div>
      </div>

      {/* Main Grid: Recent Articles & SEO Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Articles Table */}
        <div className="lg:col-span-8 bg-[#0B1437] rounded-3xl border border-white/10 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Recently Updated Articles</h3>
              <p className="text-xs text-slate-400">Quickly edit or inspect your latest content</p>
            </div>
            <Link
              to="/admin/articles"
              className="text-xs font-bold text-[#FF941E] hover:text-[#FFD84A] transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Article</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Views</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4 max-w-xs">
                      <Link
                        to="/admin/articles/$id"
                        params={{ id: art.id }}
                        className="font-bold text-white hover:text-[#FF941E] transition-colors line-clamp-1"
                      >
                        {art.title}
                      </Link>
                      <span className="text-[10px] text-slate-400">/{art.slug}</span>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0E1B5A] text-[#FFD84A]">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          art.status === "published"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap font-mono text-slate-300">
                      {art.views}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <Link
                        to="/admin/articles/$id"
                        params={{ id: art.id }}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-[#FF941E] hover:text-[#080F35] font-bold text-white transition-all mr-2"
                      >
                        Edit
                      </Link>
                      <a
                        href={`/articles/${art.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5 inline" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: SEO Health & Fast Tools */}
        <div className="lg:col-span-4 space-y-6">
          {/* SEO Health Card */}
          <div className="bg-[#0B1437] rounded-3xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-[#FF941E]" />
              <h3 className="text-base font-bold text-white">Search Engine Health</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              All articles have automated JSON-LD schema generation, Open Graph social tags, and XML sitemap indexing active.
            </p>

            <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>XML Sitemap</span>
                <a href="/sitemap.xml" target="_blank" className="font-bold text-[#FFD84A] hover:underline flex items-center gap-1">
                  /sitemap.xml <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Robots.txt</span>
                <a href="/robots.txt" target="_blank" className="font-bold text-[#FFD84A] hover:underline flex items-center gap-1">
                  /robots.txt <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Structured Data</span>
                <span className="text-emerald-400 font-bold">BlogPosting Active</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Button asChild variant="outline" className="w-full text-xs font-bold rounded-xl border-white/20 text-white hover:bg-white/10">
                <Link to="/admin/seo">Configure Technical SEO</Link>
              </Button>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-[#0B1437] rounded-3xl border border-white/10 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFD84A]" /> Quick Management Links
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/admin/categories"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-slate-200 transition-colors text-center"
              >
                Categories
              </Link>
              <Link
                to="/admin/tags"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-slate-200 transition-colors text-center"
              >
                Tags
              </Link>
              <Link
                to="/admin/authors"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-slate-200 transition-colors text-center"
              >
                Authors
              </Link>
              <Link
                to="/admin/media"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-slate-200 transition-colors text-center"
              >
                Media Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
