import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCmsArticlesFn, getCmsSettingsFn } from "@/lib/cms/cms.functions";
import type { CMSArticle, CMSSiteSettings } from "@/lib/cms/types";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPageWrapper,
});

function AnalyticsPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <AnalyticsPage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function AnalyticsPage() {
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [settings, setSettings] = useState<CMSSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCmsArticlesFn({}), getCmsSettingsFn()])
      .then(([artRes, setRes]) => {
        if (artRes.ok) setArticles(artRes.articles);
        if (setRes.ok) setSettings(setRes.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const sortedByViews = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0));
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const avgViews = articles.length ? Math.round(totalViews / articles.length) : 0;

  return (
    <AdminLayout title="Blog Analytics & Webmaster Integrations">
      <div className="space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Recorded Views
            </span>
            <p className="text-3xl font-black text-white mt-1">{totalViews}</p>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Organic Public Traffic
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Average Views / Guide
            </span>
            <p className="text-3xl font-black text-white mt-1">{avgViews}</p>
            <p className="text-xs text-slate-400 mt-2">Across {articles.length} published guides</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Google Integrations
            </span>
            <div className="mt-2 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span>GA4:</span>
                <span className={settings?.ga4MeasurementId ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {settings?.ga4MeasurementId || "Not Connected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Search Console:</span>
                <span className={settings?.googleSearchConsoleCode ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {settings?.googleSearchConsoleCode ? "Verified" : "Pending Tag"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Articles Table */}
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Top Performing Articles by Readership</h3>
              <p className="text-xs text-slate-400">Real content engagement across your blog</p>
            </div>
            <Link
              to="/admin/seo"
              className="text-xs font-bold text-[#FF941E] hover:text-[#FFD84A] transition-colors"
            >
              Configure Google IDs →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Article Title</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">SEO Score</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px]">Views</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedByViews.map((art, idx) => (
                  <tr key={art.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/5 font-bold text-[11px] text-[#FFD84A] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-white line-clamp-1">{art.title}</p>
                          <span className="text-[10px] text-slate-400">/articles/{art.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0E1B5A] text-[#FFD84A]">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span className="font-bold text-emerald-400">{art.seo?.seoScore || 85} / 100</span>
                    </td>
                    <td className="py-3.5 pr-4 whitespace-nowrap font-mono font-bold text-white">
                      {art.views || 0}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
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
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors inline-block"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-[#FF941E]" />
            <h3 className="text-sm font-bold text-white">Connecting Google Analytics & Search Console</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            To view live organic impressions, click-through rates, and keyword positions directly inside Google:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-300">
            <li>Go to <strong>Google Search Console</strong> and add property: <code>https://socialwaale.com</code>.</li>
            <li>Copy the verification meta tag and paste it into <Link to="/admin/seo" className="text-[#FFD84A] underline">Technical SEO settings</Link>.</li>
            <li>Submit your live sitemap: <code>https://socialwaale.com/sitemap.xml</code> in Google Search Console.</li>
            <li>Add your <code>G-XXXXXXXXXX</code> Measurement ID in settings for Google Analytics 4 tracking.</li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  );
}
