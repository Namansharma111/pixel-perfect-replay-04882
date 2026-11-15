import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getCmsDownloaderPagesFn,
  getPublicDownloaderPageFn,
  saveCmsDownloaderDraftFn,
  publishCmsDownloaderPageFn,
  restoreCmsDownloaderRevisionFn,
  getCmsDownloaderStatsFn,
  getCmsDownloaderSettingsFn,
  saveCmsDownloaderSettingsFn,
  getCmsDownloaderLogsFn,
  clearCmsDownloaderLogsFn,
  toggleCmsDownloaderPageStatusFn,
} from "@/lib/cms/cms.functions";
import type {
  CMSDownloaderPage,
  CMSDownloaderHowToStep,
  CMSDownloaderFeature,
  CMSDownloaderBenefit,
  CMSDownloaderFaq,
  CMSDownloaderInternalLink,
  CMSDownloaderSettings,
  CMSDownloaderLog,
  CMSDownloaderStats,
} from "@/lib/cms/types";
import {
  Video,
  Sparkles,
  Layers,
  HelpCircle,
  Link2,
  Server,
  Activity,
  History,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search,
  Globe,
  Film,
  Zap,
  ShieldCheck,
  Check,
  Smartphone,
  Key,
  Clock,
  FileText,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/downloader")({
  component: DownloaderAdminPageWrapper,
});

function DownloaderAdminPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <InstagramVideoDownloaderAdmin />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

const PRIMARY_SLUG = "instagram-video-downloader";

function InstagramVideoDownloaderAdmin() {
  const { token } = useAdminAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "content"
    | "seo"
    | "faqs"
    | "links"
    | "backend"
    | "logs"
    | "redirects"
    | "revisions"
  >("overview");

  // Data State
  const [loading, setLoading] = useState(true);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [page, setPage] = useState<CMSDownloaderPage | null>(null);
  const [stats, setStats] = useState<CMSDownloaderStats | null>(null);
  const [backendSettings, setBackendSettings] = useState<CMSDownloaderSettings | null>(null);
  const [logs, setLogs] = useState<CMSDownloaderLog[]>([]);
  const [logFilter, setLogFilter] = useState<"all" | "success" | "failed">("all");

  // Editable Form State (initialized from page or page.draft)
  const [formData, setFormData] = useState<Partial<CMSDownloaderPage>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [publishNotes, setPublishNotes] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);

  // New item draft states
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [newLink, setNewLink] = useState({ label: "", url: "", description: "", category: "tool" });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pagesRes, statsRes, settingsRes, logsRes] = await Promise.all([
        getCmsDownloaderPagesFn({ data: { token: token || undefined, includeDrafts: true } }),
        getCmsDownloaderStatsFn({ data: { token: token || undefined } }),
        getCmsDownloaderSettingsFn({ data: { token: token || undefined } }),
        getCmsDownloaderLogsFn({ data: { token: token || undefined, limit: 100 } }),
      ]);

      if (pagesRes && pagesRes.ok) {
        const found = pagesRes.pages.find((p) => p.slug === PRIMARY_SLUG) || pagesRes.pages[0];
        if (found) {
          setPage(found);
          // If draft exists, populate formData with draft merged over live page
          const initialForm = {
            ...found,
            ...(found.draft || {}),
          };
          setFormData(initialForm);
        }
      }

      if (statsRes && statsRes.ok) setStats(statsRes.stats);
      if (settingsRes && settingsRes.ok) setBackendSettings(settingsRes.settings);
      if (logsRes && logsRes.ok) setLogs(logsRes.logs);
    } catch (err: any) {
      toast.error("Failed to load downloader CRM data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateField = (key: keyof CMSDownloaderPage, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  // 1. Action: Save Draft
  const handleSaveDraft = async () => {
    if (!page) return;
    setSavingDraft(true);
    try {
      const res = await saveCmsDownloaderDraftFn({
        data: {
          token: token || "",
          id: page.id,
          draft: formData,
        },
      });
      if (res && res.ok) {
        toast.success("Draft saved successfully. Live website remains untouched.");
        setPage(res.page);
        setHasUnsavedChanges(false);
      } else {
        toast.error("Failed to save draft.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving draft.");
    } finally {
      setSavingDraft(false);
    }
  };

  // 2. Action: Publish Changes
  const handlePublish = async () => {
    if (!page) return;
    setPublishing(true);
    try {
      // First save current form data as draft to ensure latest changes are applied
      await saveCmsDownloaderDraftFn({
        data: {
          token: token || "",
          id: page.id,
          draft: formData,
        },
      });

      const res = await publishCmsDownloaderPageFn({
        data: {
          token: token || "",
          id: page.id,
          notes: publishNotes || "Published from CRM",
        },
      });

      if (res && res.ok) {
        toast.success(`Published "${res.page.name}" live!`);
        if (res.redirectCreated) {
          toast.info("Created automatic 301 redirect for the updated slug.");
        }
        setPage(res.page);
        setFormData(res.page);
        setHasUnsavedChanges(false);
        setShowPublishModal(false);
        setPublishNotes("");
        // Reload stats
        const statsRes = await getCmsDownloaderStatsFn({ data: { token: token || undefined } });
        if (statsRes?.ok) setStats(statsRes.stats);
      } else {
        toast.error("Failed to publish page.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error publishing page.");
    } finally {
      setPublishing(false);
    }
  };

  // 3. Action: Restore Revision
  const handleRestoreRevision = async (revisionId: string) => {
    if (!page) return;
    if (!confirm("Are you sure you want to restore this revision? It will overwrite current settings.")) return;
    try {
      const res = await restoreCmsDownloaderRevisionFn({
        data: {
          token: token || "",
          id: page.id,
          revisionId,
        },
      });
      if (res && res.ok) {
        toast.success("Revision restored successfully!");
        setPage(res.page);
        setFormData(res.page);
        setHasUnsavedChanges(false);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to restore revision.");
    }
  };

  // 4. Action: Save Backend Settings
  const handleSaveSettings = async () => {
    if (!backendSettings) return;
    try {
      const res = await saveCmsDownloaderSettingsFn({
        data: {
          token: token || "",
          settings: backendSettings,
        },
      });
      if (res && res.ok) {
        toast.success("Backend settings updated.");
        setBackendSettings(res.settings);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update backend settings.");
    }
  };

  // 5. Action: Clear Logs
  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to clear all request logs?")) return;
    try {
      const res = await clearCmsDownloaderLogsFn({
        data: { token: token || "" },
      });
      if (res && res.ok) {
        toast.success("Request logs cleared.");
        setLogs([]);
      }
    } catch (err: any) {
      toast.error("Failed to clear logs.");
    }
  };

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    if (logFilter === "all") return true;
    return log.status === logFilter;
  });

  // Real-time SEO checklist checks
  const seoChecklist = {
    title: (formData.seoTitle?.length || 0) >= 30 && (formData.seoTitle?.length || 0) <= 65,
    desc: (formData.metaDescription?.length || 0) >= 100 && (formData.metaDescription?.length || 0) <= 165,
    keywordInTitle: Boolean(
      formData.focusKeyword &&
        formData.seoTitle?.toLowerCase().includes(formData.focusKeyword.toLowerCase()),
    ),
    keywordInDesc: Boolean(
      formData.focusKeyword &&
        formData.metaDescription?.toLowerCase().includes(formData.focusKeyword.toLowerCase()),
    ),
    keywordInH1: Boolean(
      formData.focusKeyword &&
        formData.h1?.toLowerCase().includes(formData.focusKeyword.toLowerCase()),
    ),
    canonical: Boolean(formData.canonicalUrl && formData.canonicalUrl.startsWith("http")),
    robots: formData.metaRobots === "index, follow",
    faqsPresent: (formData.faqs?.length || 0) >= 3,
  };

  if (loading && !page) {
    return (
      <AdminLayout title="Tools Management → Instagram Video Downloader">
        <div className="p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-[#FFD84A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-semibold text-white">Loading Video Downloader CRM Backend...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Tools Management → Instagram Video Downloader"
      actions={
        <div className="flex items-center gap-2">
          {page?.draft && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <AlertTriangle className="w-3 h-3" /> Draft Pending
            </span>
          )}

          {/* Action: Preview Draft / Live */}
          <a
            href={`/${formData.slug || PRIMARY_SLUG}?preview=draft`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white border border-white/10 transition"
          >
            <Eye className="w-3.5 h-3.5 text-[#FFD84A]" /> Preview
          </a>

          {/* Action: Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={savingDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-200 border border-white/10 transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-sky-400" />
            {savingDraft ? "Saving..." : "Save Draft"}
          </button>

          {/* Action: Publish */}
          <button
            type="button"
            onClick={() => setShowPublishModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] text-xs font-black hover:opacity-95 transition shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Publish Live
          </button>
        </div>
      }
    >
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Module Header Bar */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0E1B5A] to-[#12236e] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFD84A] flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Tools Management
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300">Dedicated Backend Controller</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Instagram Video Downloader
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Complete CRM command center: customize hero content, SEO metadata, URL slug, Google FAQ schemas, internal links, backend API proxy, and monitor real-time request logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${
                page?.status === "published"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-400 border-amber-500/30"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {page?.status === "published" ? "Published (Live)" : "Draft Mode"}
            </span>

            <a
              href={`/${page?.slug || PRIMARY_SLUG}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs font-mono text-[#FFD84A] hover:underline inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5"
            >
              /{page?.slug || PRIMARY_SLUG} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 9 Navigation Tabs */}
        <div className="border-b border-white/10 bg-[#0B1437] rounded-2xl p-1 flex gap-1 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "content", label: "Page Content", icon: FileText },
            { id: "seo", label: "SEO Settings", icon: Globe },
            { id: "faqs", label: "FAQs", icon: HelpCircle },
            { id: "links", label: "Internal Links", icon: Link2 },
            { id: "backend", label: "API & Backend", icon: Server },
            { id: "logs", label: "Request Logs", icon: Clock },
            { id: "redirects", label: "Redirects", icon: ArrowRightLeft },
            { id: "revisions", label: "Revisions", icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] shadow-md shadow-orange-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW / DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Real Database Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-5 rounded-2xl bg-[#0E1B5A]/60 border border-white/10">
                <span className="text-xs text-slate-400 font-medium">Total Tools</span>
                <p className="text-2xl font-black text-white mt-1">{stats?.totalPages ?? 7}</p>
                <span className="text-[10px] text-slate-500">In database</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E1B5A]/60 border border-white/10">
                <span className="text-xs text-slate-400 font-medium">Published</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">{stats?.publishedPages ?? 7}</p>
                <span className="text-[10px] text-emerald-500/80">Live to visitors</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E1B5A]/60 border border-white/10">
                <span className="text-xs text-slate-400 font-medium">Drafts</span>
                <p className="text-2xl font-black text-amber-400 mt-1">{stats?.draftPages ?? 0}</p>
                <span className="text-[10px] text-amber-500/80">Unpublished</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E1B5A]/60 border border-white/10">
                <span className="text-xs text-slate-400 font-medium">Total Requests</span>
                <p className="text-2xl font-black text-sky-400 mt-1">{stats?.totalRequests ?? 0}</p>
                <span className="text-[10px] text-slate-500">Real attempts</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E1B5A]/60 border border-white/10">
                <span className="text-xs text-slate-400 font-medium">Successful</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">{stats?.successfulDownloads ?? 0}</p>
                <span className="text-[10px] text-emerald-500/80">Media resolved</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E1B5A]/60 border border-white/10">
                <span className="text-xs text-slate-400 font-medium">Failed</span>
                <p className="text-2xl font-black text-rose-400 mt-1">{stats?.failedRequests ?? 0}</p>
                <span className="text-[10px] text-rose-500/80">Restricted / invalid</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 rounded-3xl bg-[#0E1B5A]/40 border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition text-left group cursor-pointer"
                >
                  <FileText className="w-5 h-5 text-[#FFD84A] mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-white text-sm">Edit Content</p>
                  <p className="text-xs text-slate-400 mt-0.5">Hero, steps, features & copy</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition text-left group cursor-pointer"
                >
                  <Globe className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-white text-sm">Manage SEO</p>
                  <p className="text-xs text-slate-400 mt-0.5">Meta titles, SERP & robots</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("faqs")}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition text-left group cursor-pointer"
                >
                  <HelpCircle className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-white text-sm">Manage FAQs</p>
                  <p className="text-xs text-slate-400 mt-0.5">Questions & schema</p>
                </button>

                <a
                  href={`/${page?.slug || PRIMARY_SLUG}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition text-left group block"
                >
                  <ExternalLink className="w-5 h-5 text-amber-300 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-white text-sm">Preview Website</p>
                  <p className="text-xs text-slate-400 mt-0.5">Inspect live public layout</p>
                </a>

                <button
                  type="button"
                  onClick={() => setShowPublishModal(true)}
                  className="p-4 rounded-2xl bg-gradient-to-tr from-[#FF941E]/20 to-[#FFD84A]/20 border border-[#FF941E]/40 hover:bg-gradient-to-tr hover:from-[#FF941E]/30 hover:to-[#FFD84A]/30 transition text-left group cursor-pointer"
                >
                  <Send className="w-5 h-5 text-[#FFD84A] mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-white text-sm">Publish Changes</p>
                  <p className="text-xs text-slate-400 mt-0.5">Deploy draft to production</p>
                </button>
              </div>
            </div>

            {/* Live Status & Information Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-[#0E1B5A]/40 border border-white/10 space-y-3">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Current Production Status
                </h4>
                <div className="text-xs text-slate-300 space-y-2">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Canonical Path:</span>
                    <span className="font-mono text-white">/{page?.slug}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Primary Focus Keyword:</span>
                    <span className="font-bold text-amber-300">{page?.focusKeyword}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Active FAQs:</span>
                    <span className="text-white">{page?.faqs?.filter((f) => f.enabled !== false).length || 0} questions</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Revisions Saved:</span>
                    <span className="text-white">{page?.revisions?.length || 0} revisions</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Last Database Update:</span>
                    <span className="text-white font-mono text-[11px]">
                      {page?.updatedAt ? new Date(page.updatedAt).toLocaleString() : "Initial"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#0E1B5A]/40 border border-white/10 space-y-3">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FFD84A]" /> Backend Health & Resolver
                </h4>
                <div className="text-xs text-slate-300 space-y-2">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Engine Provider:</span>
                    <span className="font-semibold text-white">{backendSettings?.apiProvider || "SnapSave Fast Engine"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Resolver Mode:</span>
                    <span className="font-bold text-emerald-400 uppercase tracking-wider">
                      {backendSettings?.status || "Active (Online)"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Rate Limit Per IP:</span>
                    <span className="text-white">{backendSettings?.rateLimitPerMinute || 60} req/min</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Proxy Caching:</span>
                    <span className="text-emerald-400 font-semibold">Enabled (Fast CDN Proxy)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PAGE CONTENT MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "content" && (
          <div className="space-y-8 p-6 md:p-8 rounded-3xl bg-[#0E1B5A]/30 border border-white/10">
            {/* 1. Hero Section */}
            <div className="space-y-4 pb-8 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FFD84A] text-[#080F35] font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-lg font-bold text-white">Hero & Main Search Section</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Main H1 Heading
                  </label>
                  <input
                    type="text"
                    value={formData.h1 || ""}
                    onChange={(e) => updateField("h1", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400 font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Subtitle / Value Proposition
                  </label>
                  <textarea
                    rows={2}
                    value={formData.subtitle || ""}
                    onChange={(e) => updateField("subtitle", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Search Box Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={formData.inputPlaceholder || ""}
                    onChange={(e) => updateField("inputPlaceholder", e.target.value)}
                    placeholder="Paste Instagram video, reel, or IGTV link here..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Download Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.downloadButtonText || ""}
                    onChange={(e) => updateField("downloadButtonText", e.target.value)}
                    placeholder="Download MP4 Video"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Introductory SEO Paragraph (HTML supported)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.introHtml || ""}
                    onChange={(e) => updateField("introHtml", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-mono outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* 2. How To Download Section */}
            <div className="space-y-4 pb-8 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#FFD84A] text-[#080F35] font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-lg font-bold text-white">How To Download Section</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const steps = [...(formData.howToSteps || [])];
                    steps.push({
                      step: steps.length + 1,
                      title: "New Step",
                      description: "Enter step instructions...",
                    });
                    updateField("howToSteps", steps);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" /> Add Step
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={formData.howToHeading || ""}
                  onChange={(e) => updateField("howToHeading", e.target.value)}
                  placeholder="How to Download Instagram Videos in 3 Steps"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400 font-semibold mb-4"
                />
              </div>

              <div className="space-y-3">
                {formData.howToSteps?.map((st, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col md:flex-row gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#FFD84A] text-[#080F35] font-black text-sm flex items-center justify-center shrink-0">
                      0{index + 1}
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="text"
                        value={st.title}
                        onChange={(e) => {
                          const steps = [...(formData.howToSteps || [])];
                          const curr = steps[index] ?? { step: index + 1, title: "", description: "" };
                          steps[index] = { ...curr, title: e.target.value, step: index + 1 };
                          updateField("howToSteps", steps);
                        }}
                        placeholder="Step Title"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-sm font-bold text-white outline-none focus:border-amber-400"
                      />
                      <textarea
                        rows={2}
                        value={st.description}
                        onChange={(e) => {
                          const steps = [...(formData.howToSteps || [])];
                          const curr = steps[index] ?? { step: index + 1, title: "", description: "" };
                          steps[index] = { ...curr, description: e.target.value, step: index + 1 };
                          updateField("howToSteps", steps);
                        }}
                        placeholder="Detailed instructions for this step..."
                        className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-slate-300 outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const steps = (formData.howToSteps || []).filter((_, i) => i !== index);
                        updateField("howToSteps", steps);
                      }}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Features Section */}
            <div className="space-y-4 pb-8 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#FFD84A] text-[#080F35] font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-lg font-bold text-white">Features Section</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const feats = [...(formData.features || [])];
                    feats.push({
                      icon: "Sparkles",
                      title: "New Feature",
                      description: "Feature description...",
                    });
                    updateField("features", feats);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" /> Add Feature
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.features?.map((feat, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FFD84A]">Feature #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const feats = (formData.features || []).filter((_, i) => i !== index);
                          updateField("features", feats);
                        }}
                        className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const feats = [...(formData.features || [])];
                        const curr = feats[index] ?? { title: "", description: "", icon: "Sparkles" };
                        feats[index] = { ...curr, title: e.target.value };
                        updateField("features", feats);
                      }}
                      placeholder="Title"
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-sm font-bold text-white outline-none focus:border-amber-400"
                    />
                    <textarea
                      rows={2}
                      value={feat.description}
                      onChange={(e) => {
                        const feats = [...(formData.features || [])];
                        const curr = feats[index] ?? { title: "", description: "", icon: "Sparkles" };
                        feats[index] = { ...curr, description: e.target.value };
                        updateField("features", feats);
                      }}
                      placeholder="Description"
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-slate-300 outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Why Choose Us Section */}
            <div className="space-y-4 pb-8 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#FFD84A] text-[#080F35] font-black text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-lg font-bold text-white">Why Choose Us Benefits</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const benefits = [...(formData.whyChooseBenefits || [])];
                    benefits.push({
                      title: "New Benefit",
                      description: "Benefit explanation...",
                      icon: "CheckCircle2",
                    });
                    updateField("whyChooseBenefits", benefits);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" /> Add Benefit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Why Choose Us Heading
                  </label>
                  <input
                    type="text"
                    value={formData.whyChooseHeading || ""}
                    onChange={(e) => updateField("whyChooseHeading", e.target.value)}
                    placeholder="Why Choose Social Waale Instagram Video Downloader?"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Why Choose Us Subtext
                  </label>
                  <input
                    type="text"
                    value={formData.whyChooseDescription || ""}
                    onChange={(e) => updateField("whyChooseDescription", e.target.value)}
                    placeholder="Engineered specifically for creators, digital marketers..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {formData.whyChooseBenefits?.map((b, index) => (
                  <div key={index} className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#FFD84A]">Benefit #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const benefits = (formData.whyChooseBenefits || []).filter((_, i) => i !== index);
                          updateField("whyChooseBenefits", benefits);
                        }}
                        className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => {
                        const benefits = [...(formData.whyChooseBenefits || [])];
                        const curr = benefits[index] ?? { title: "", description: "" };
                        benefits[index] = { ...curr, title: e.target.value };
                        updateField("whyChooseBenefits", benefits);
                      }}
                      placeholder="Title"
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-bold text-white outline-none focus:border-amber-400"
                    />
                    <textarea
                      rows={2}
                      value={b.description}
                      onChange={(e) => {
                        const benefits = [...(formData.whyChooseBenefits || [])];
                        const curr = benefits[index] ?? { title: "", description: "" };
                        benefits[index] = { ...curr, description: e.target.value };
                        updateField("whyChooseBenefits", benefits);
                      }}
                      placeholder="Description"
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-slate-300 outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Additional Content & CTA */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FFD84A] text-[#080F35] font-black text-xs flex items-center justify-center">
                  5
                </span>
                <h3 className="text-lg font-bold text-white">Supported Formats, Limitations & CTA Banner</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Supported Content Types (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.supportedContentTypes?.join(", ") || ""}
                    onChange={(e) =>
                      updateField(
                        "supportedContentTypes",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      )
                    }
                    placeholder="Instagram Feed Videos, Reels, IGTV, Carousels"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Limitations Notice
                  </label>
                  <input
                    type="text"
                    value={formData.limitationsNotice || ""}
                    onChange={(e) => updateField("limitationsNotice", e.target.value)}
                    placeholder="To protect user privacy, our tool only accesses public content..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    CTA Banner Heading
                  </label>
                  <input
                    type="text"
                    value={formData.ctaHeading || ""}
                    onChange={(e) => updateField("ctaHeading", e.target.value)}
                    placeholder="Want Viral Instagram Growth & High-ROI Marketing?"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    CTA Button Text & Link URL
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.ctaButtonText || ""}
                      onChange={(e) => updateField("ctaButtonText", e.target.value)}
                      placeholder="Get Free Strategy Audit"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={formData.ctaButtonUrl || ""}
                      onChange={(e) => updateField("ctaButtonUrl", e.target.value)}
                      placeholder="/contact"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer"
              >
                {savingDraft ? "Saving Draft..." : "Save Draft Changes"}
              </button>
              <button
                type="button"
                onClick={() => setShowPublishModal(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xs hover:opacity-95 transition cursor-pointer"
              >
                Publish Live
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: COMPLETE SEO MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-2 space-y-4 p-6 md:p-8 rounded-3xl bg-[#0E1B5A]/30 border border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" /> SEO Tags & Keywords
                </h3>

                {/* SEO Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      SEO Title Tag
                    </label>
                    <span
                      className={`text-xs font-mono font-bold ${
                        (formData.seoTitle?.length || 0) > 60 ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {formData.seoTitle?.length || 0} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.seoTitle || ""}
                    onChange={(e) => updateField("seoTitle", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Meta Description
                    </label>
                    <span
                      className={`text-xs font-mono font-bold ${
                        (formData.metaDescription?.length || 0) > 160 ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {formData.metaDescription?.length || 0} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.metaDescription || ""}
                    onChange={(e) => updateField("metaDescription", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Focus Keyword & Secondary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Primary Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={formData.focusKeyword || ""}
                      onChange={(e) => updateField("focusKeyword", e.target.value)}
                      placeholder="Instagram Video Downloader"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Meta Robots Directives
                    </label>
                    <select
                      value={formData.metaRobots || "index, follow"}
                      onChange={(e) => updateField("metaRobots", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                    >
                      <option value="index, follow">index, follow (Standard Public)</option>
                      <option value="noindex, follow">noindex, follow (Hidden from Google)</option>
                      <option value="noindex, nofollow">noindex, nofollow (Strict Block)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Secondary Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.secondaryKeywords?.join(", ") || ""}
                      onChange={(e) =>
                        updateField(
                          "secondaryKeywords",
                          e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
                        )
                      }
                      placeholder="Download Instagram video MP4, Save IG video online, IGTV saver"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      value={formData.canonicalUrl || ""}
                      onChange={(e) => updateField("canonicalUrl", e.target.value)}
                      placeholder="https://socialwaale.com/instagram-video-downloader"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Social Sharing Open Graph */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD84A]">
                    Open Graph (Social Cards)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">OG Title</label>
                      <input
                        type="text"
                        value={formData.ogTitle || ""}
                        onChange={(e) => updateField("ogTitle", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">OG Image URL</label>
                      <input
                        type="text"
                        value={formData.ogImage || ""}
                        onChange={(e) => updateField("ogImage", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Google Search Preview & Live SEO Checklist */}
              <div className="space-y-6">
                {/* Google Search SERP Preview */}
                <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FFD84A]">
                      Google Search Preview
                    </span>
                    <span className="text-[10px] text-slate-400">Desktop SERP</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#202124] text-left space-y-1 font-sans">
                    <div className="flex items-center gap-2 text-xs text-[#dadce0]">
                      <span className="w-5 h-5 rounded-full bg-[#303134] flex items-center justify-center text-[10px] font-bold">
                        SW
                      </span>
                      <div className="leading-tight">
                        <p className="text-[12px] font-normal text-[#bdc1c6]">socialwaale.com</p>
                        <p className="text-[10px] text-[#9aa0a6] truncate max-w-[220px]">
                          https://socialwaale.com &gt; {formData.slug || "instagram-video-downloader"}
                        </p>
                      </div>
                    </div>

                    <h4 className="text-[#8ab4f8] text-base font-normal leading-snug hover:underline cursor-pointer line-clamp-1 pt-1">
                      {formData.seoTitle || "Instagram Video Downloader — Social Waale"}
                    </h4>

                    <p className="text-[#bdc1c6] text-xs leading-relaxed line-clamp-2 pt-0.5">
                      {formData.metaDescription || "Download Instagram feed videos and IGTV online in high quality MP4 with audio."}
                    </p>
                  </div>
                </div>

                {/* SEO Checklist */}
                <div className="p-6 rounded-3xl bg-[#0E1B5A]/40 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Live SEO Audit Checklist
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-center justify-between">
                      <span className="text-slate-300">Title tag length (40–60 chars)</span>
                      {seoChecklist.title ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Optimal
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold">Needs attention</span>
                      )}
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-slate-300">Meta description (100–160 chars)</span>
                      {seoChecklist.desc ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Optimal
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold">Needs attention</span>
                      )}
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-slate-300">Focus keyword in SEO title</span>
                      {seoChecklist.keywordInTitle ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold">Missing</span>
                      )}
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-slate-300">Focus keyword in Meta description</span>
                      {seoChecklist.keywordInDesc ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold">Missing</span>
                      )}
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-slate-300">Focus keyword in H1 Heading</span>
                      {seoChecklist.keywordInH1 ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold">Missing</span>
                      )}
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-slate-300">Valid Canonical URL</span>
                      {seoChecklist.canonical ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Valid
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold">Invalid</span>
                      )}
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-slate-300">Google Search Indexable</span>
                      {seoChecklist.robots ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Indexable
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold">Blocked (Noindex)</span>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FAQ MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "faqs" && (
          <div className="space-y-6 p-6 md:p-8 rounded-3xl bg-[#0E1B5A]/30 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">Frequently Asked Questions</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage questions displayed on the website. Enabled questions automatically generate Google FAQPage JSON-LD schema.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-medium">
                  {formData.faqs?.filter((f) => f.enabled !== false).length || 0} of {formData.faqs?.length || 0} active
                </span>
              </div>
            </div>

            {/* Add New FAQ Form */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFD84A] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add New Question
              </span>
              <input
                type="text"
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
                placeholder="Question (e.g. Can I download videos with audio?)"
                className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-sm text-white font-medium outline-none focus:border-amber-400"
              />
              <textarea
                rows={2}
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                placeholder="Detailed answer..."
                className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-300 outline-none focus:border-amber-400 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!newFaqQ.trim() || !newFaqA.trim()) {
                      toast.error("Please enter both question and answer.");
                      return;
                    }
                    const newFaqs = [
                      ...(formData.faqs || []),
                      {
                        id: `faq-${Date.now()}`,
                        q: newFaqQ.trim(),
                        a: newFaqA.trim(),
                        question: newFaqQ.trim(),
                        answer: newFaqA.trim(),
                        enabled: true,
                        order: (formData.faqs?.length || 0) + 1,
                      },
                    ];
                    updateField("faqs", newFaqs);
                    setNewFaqQ("");
                    setNewFaqA("");
                    toast.success("FAQ added to draft.");
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-bold text-xs hover:opacity-95 transition cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </div>

            {/* List of Existing FAQs */}
            <div className="space-y-3">
              {formData.faqs?.map((faq, index) => {
                const isEnabled = faq.enabled !== false;
                const qText = faq.q || faq.question || "";
                const aText = faq.a || faq.answer || "";
                return (
                  <div
                    key={faq.id || index}
                    className={`p-4 rounded-2xl border transition-all ${
                      isEnabled
                        ? "bg-black/30 border-white/10"
                        : "bg-black/10 border-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#FFD84A]">
                          #{index + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isEnabled
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-500/20 text-slate-400"
                          }`}
                        >
                          {isEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Reorder Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            if (index === 0) return;
                            const faqs = [...(formData.faqs || [])];
                            const a = faqs[index - 1];
                            const b = faqs[index];
                            if (a && b) {
                              faqs[index - 1] = b;
                              faqs[index] = a;
                              updateField("faqs", faqs);
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Reorder Down */}
                        <button
                          type="button"
                          disabled={index === (formData.faqs?.length || 0) - 1}
                          onClick={() => {
                            if (index >= (formData.faqs?.length || 0) - 1) return;
                            const faqs = [...(formData.faqs || [])];
                            const a = faqs[index];
                            const b = faqs[index + 1];
                            if (a && b) {
                              faqs[index + 1] = a;
                              faqs[index] = b;
                              updateField("faqs", faqs);
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Enable/Disable */}
                        <button
                          type="button"
                          onClick={() => {
                            const faqs = [...(formData.faqs || [])];
                            const curr = faqs[index];
                            if (curr) {
                              faqs[index] = { ...curr, enabled: !isEnabled };
                              updateField("faqs", faqs);
                            }
                          }}
                          className="px-2 py-1 rounded text-[11px] font-bold bg-white/10 hover:bg-white/15 text-slate-200 cursor-pointer"
                        >
                          {isEnabled ? "Disable" : "Enable"}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            const faqs = (formData.faqs || []).filter((_, i) => i !== index);
                            updateField("faqs", faqs);
                          }}
                          className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={qText}
                      onChange={(e) => {
                        const faqs = [...(formData.faqs || [])];
                        const curr = faqs[index];
                        if (curr) {
                          faqs[index] = {
                            ...curr,
                            q: e.target.value,
                            question: e.target.value,
                          };
                          updateField("faqs", faqs);
                        }
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-sm font-bold text-white outline-none focus:border-amber-400 mb-2"
                    />

                    <textarea
                      rows={2}
                      value={aText}
                      onChange={(e) => {
                        const faqs = [...(formData.faqs || [])];
                        const curr = faqs[index];
                        if (curr) {
                          faqs[index] = {
                            ...curr,
                            a: e.target.value,
                            answer: e.target.value,
                          };
                          updateField("faqs", faqs);
                        }
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-slate-300 outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: INTERNAL LINKING MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "links" && (
          <div className="space-y-6 p-6 md:p-8 rounded-3xl bg-[#0E1B5A]/30 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">Internal Linking Architecture</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Link related downloader tools, high-performing blog articles, and service landing pages to boost SEO and crawler flow.
                </p>
              </div>
            </div>

            {/* Add New Link Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFD84A] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Internal Link
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newLink.label}
                  onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                  placeholder="Link Anchor Text"
                  className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="/instagram-reels-downloader or /services"
                  className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white outline-none focus:border-amber-400 font-mono"
                />
                <select
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white outline-none focus:border-amber-400"
                >
                  <option value="tool">Downloader Tool</option>
                  <option value="article">Blog Article</option>
                  <option value="page">Agency Service / Page</option>
                </select>
              </div>
              <input
                type="text"
                value={newLink.description}
                onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                placeholder="Short description displayed on card..."
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-300 outline-none focus:border-amber-400"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!newLink.label || !newLink.url) {
                      toast.error("Please provide both label and URL.");
                      return;
                    }
                    const updated = [
                      ...(formData.internalLinks || []),
                      {
                        id: `link-${Date.now()}`,
                        ...newLink,
                        category: newLink.category as any,
                      },
                    ];
                    updateField("internalLinks", updated);
                    setNewLink({ label: "", url: "", description: "", category: "tool" });
                    toast.success("Internal link added to draft.");
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-bold text-xs hover:opacity-95 transition cursor-pointer"
                >
                  Add Link
                </button>
              </div>
            </div>

            {/* List of Managed Internal Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.internalLinks?.map((lnk, index) => (
                <div key={lnk.id || index} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD84A] px-2 py-0.5 rounded bg-white/5">
                      {lnk.category || "Link"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.internalLinks || []).filter((_, i) => i !== index);
                        updateField("internalLinks", updated);
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={lnk.label}
                    onChange={(e) => {
                      const updated = [...(formData.internalLinks || [])];
                      const curr = updated[index];
                      if (curr) {
                        updated[index] = { ...curr, label: e.target.value };
                        updateField("internalLinks", updated);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-bold text-white"
                  />
                  <input
                    type="text"
                    value={lnk.url}
                    onChange={(e) => {
                      const updated = [...(formData.internalLinks || [])];
                      const curr = updated[index];
                      if (curr) {
                        updated[index] = { ...curr, url: e.target.value };
                        updateField("internalLinks", updated);
                      }
                    }}
                    className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-[11px] font-mono text-slate-300"
                  />
                  <textarea
                    rows={2}
                    value={lnk.description || ""}
                    onChange={(e) => {
                      const updated = [...(formData.internalLinks || [])];
                      const curr = updated[index];
                      if (curr) {
                        updated[index] = { ...curr, description: e.target.value };
                        updateField("internalLinks", updated);
                      }
                    }}
                    placeholder="Short description"
                    className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-[11px] text-slate-400 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: API / BACKEND CONFIGURATION */}
        {/* ========================================================================= */}
        {activeTab === "backend" && (
          <div className="space-y-6 p-6 md:p-8 rounded-3xl bg-[#0E1B5A]/30 border border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-[#FFD84A]" /> Downloader Backend Engine Configuration
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure primary resolver endpoints, server-side rate limits, and fallback streaming parameters safely without frontend exposure.
              </p>
            </div>

            {backendSettings && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Engine Provider Name
                    </label>
                    <input
                      type="text"
                      value={backendSettings.apiProvider}
                      onChange={(e) =>
                        setBackendSettings({ ...backendSettings, apiProvider: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Backend Processing Status
                    </label>
                    <select
                      value={backendSettings.status}
                      onChange={(e) =>
                        setBackendSettings({
                          ...backendSettings,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                    >
                      <option value="active">Active (Full Online Resolution)</option>
                      <option value="maintenance">Maintenance Mode (Polite notice to users)</option>
                      <option value="fallback">Fallback Mirror Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Resolver Endpoint
                    </label>
                    <input
                      type="text"
                      value={backendSettings.apiEndpoint}
                      onChange={(e) =>
                        setBackendSettings({ ...backendSettings, apiEndpoint: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      API Key / Secure Token (Masked on Server)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={backendSettings.apiKeyMasked || "snapsave_live_••••••••••••94b2"}
                        readOnly
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-slate-400 text-xs font-mono outline-none cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-400">
                        Encrypted
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Rate Limit Per IP (requests / minute)
                    </label>
                    <input
                      type="number"
                      value={backendSettings.rateLimitPerMinute}
                      onChange={(e) =>
                        setBackendSettings({
                          ...backendSettings,
                          rateLimitPerMinute: parseInt(e.target.value) || 60,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Proxy Cache Duration (Seconds)
                    </label>
                    <input
                      type="number"
                      value={backendSettings.cacheDurationSeconds}
                      onChange={(e) =>
                        setBackendSettings({
                          ...backendSettings,
                          cacheDurationSeconds: parseInt(e.target.value) || 86400,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xs hover:opacity-95 transition cursor-pointer"
                  >
                    Save Backend Configuration
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: REAL REQUEST LOGS */}
        {/* ========================================================================= */}
        {activeTab === "logs" && (
          <div className="space-y-4 p-6 md:p-8 rounded-3xl bg-[#0E1B5A]/30 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-400" /> Real Downloader Request Logs
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live database log of actual user requests processed by the Instagram Video Downloader.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setLogFilter("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      logFilter === "all" ? "bg-white/20 text-white" : "text-slate-400"
                    }`}
                  >
                    All ({logs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogFilter("success")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      logFilter === "success" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400"
                    }`}
                  >
                    Success
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogFilter("failed")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      logFilter === "failed" ? "bg-rose-500/20 text-rose-300" : "text-slate-400"
                    }`}
                  >
                    Failed
                  </button>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const res = await getCmsDownloaderLogsFn({ data: { token: token || undefined } });
                    if (res?.ok) setLogs(res.logs);
                    toast.success("Logs refreshed.");
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Refresh logs"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleClearLogs}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-bold transition cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-black/50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Requested URL</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Details / Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-sans text-xs">
                        No request logs recorded yet. Real user downloads will automatically appear here.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              log.status === "success"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4 text-white max-w-[260px] truncate" title={log.url}>
                          {log.url}
                        </td>
                        <td className="py-3 px-4 text-amber-300 uppercase font-bold text-[10px]">
                          {log.contentType || log.toolType}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {log.durationMs ? `${log.durationMs}ms` : "-"}
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-400 max-w-[280px] truncate" title={log.error}>
                          {log.error || "Media resolved & downloaded successfully"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: URL & REDIRECT MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "redirects" && (
          <div className="space-y-6 p-6 md:p-8 rounded-3xl bg-[#0E1B5A]/30 border border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#FFD84A]" /> URL & 301 Redirect Management
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage the live URL path. Changing a published slug automatically creates a permanent 301 redirect entry in the Technical SEO Redirects engine.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Current Page URL Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-400">
                    https://socialwaale.com/
                  </span>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Notice: Only lowercase letters, numbers, and hyphens. Do not change existing URLs unless migrating structure.
                </p>
              </div>

              {/* Redirect History */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Slug Transition & 301 Redirect History
                </h4>
                {page?.redirectHistory && page.redirectHistory.length > 0 ? (
                  <div className="space-y-2">
                    {page.redirectHistory.map((rh, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-rose-400">/{rh.oldSlug}</span>
                          <span className="text-slate-500">&rarr;</span>
                          <span className="text-emerald-400">/{rh.newSlug}</span>
                        </div>
                        <span className="text-slate-500 text-[10px]">
                          {new Date(rh.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No slug changes recorded. The original canonical slug is active.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: REVISION HISTORY */}
        {/* ========================================================================= */}
        {activeTab === "revisions" && (
          <div className="space-y-6 p-6 md:p-8 rounded-3xl bg-[#0E1B5A]/30 border border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-[#FFD84A]" /> Version & Revision History
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every time changes are published, an automated snapshot is saved. You can restore previous content and SEO settings with 1 click.
              </p>
            </div>

            {page?.revisions && page.revisions.length > 0 ? (
              <div className="space-y-3">
                {page.revisions.map((rev, index) => (
                  <div
                    key={rev.id || index}
                    className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Revision #{page.revisions!.length - index}</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(rev.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Notes: {rev.notes || "Published via CRM"}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Title: {rev.snapshot?.seoTitle?.slice(0, 60)}...
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition border border-white/10 cursor-pointer"
                    >
                      Restore This Revision
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 rounded-2xl bg-black/20 border border-white/5">
                No past revisions recorded yet. When you publish changes, snapshots will appear here.
              </div>
            )}
          </div>
        )}

        {/* Publish Confirmation Modal */}
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md bg-[#0E1B5A] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-[#FFD84A] flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Publish to Production?</h3>
                  <p className="text-xs text-slate-300">All draft changes will immediately go live on the website.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Revision Notes (Optional)
                </label>
                <input
                  type="text"
                  value={publishNotes}
                  onChange={(e) => setPublishNotes(e.target.value)}
                  placeholder="e.g. Updated meta description and added 2 new FAQs"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-black/30 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Automatic Safety Checks:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                  <li>Creates a rollback snapshot in Revision History.</li>
                  <li>Generates a 301 redirect if the URL slug was changed.</li>
                  <li>Updates XML sitemap timestamp automatically.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={publishing}
                  onClick={handlePublish}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xs hover:opacity-95 transition cursor-pointer disabled:opacity-50"
                >
                  {publishing ? "Deploying..." : "Confirm & Publish"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
