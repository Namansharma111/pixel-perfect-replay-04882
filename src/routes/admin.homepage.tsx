import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getCmsHomepageFn,
  saveCmsHomepageDraftFn,
  publishCmsHomepageFn,
  restoreCmsHomepageRevisionFn,
  getCmsServicesFn,
} from "@/lib/cms/cms.functions";
import type {
  CMSHomepage,
  CMSHomepageData,
  CMSHomepageRevision,
  CMSService,
} from "@/lib/cms/types";
import {
  LayoutTemplate,
  Save,
  CheckCircle2,
  AlertTriangle,
  Eye,
  History,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  ExternalLink,
  Globe,
  Sparkles,
  Smartphone,
  Monitor,
  X,
  FileText,
  Search,
  Layers,
  Award,
  BarChart3,
  MessageSquareQuote,
  HelpCircle,
  Megaphone,
  Briefcase,
  Users,
  Check,
  Info,
  RotateCcw,
  Palette,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/homepage")({
  component: AdminHomepageRouteWrapper,
});

function AdminHomepageRouteWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <AdminHomepagePage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function AdminHomepagePage() {
  const { token, user } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [homepageState, setHomepageState] = useState<CMSHomepage | null>(null);
  const [formData, setFormData] = useState<CMSHomepageData | null>(null);
  const [servicesList, setServicesList] = useState<CMSService[]>([]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "hero"
    | "about"
    | "services"
    | "whyChoose"
    | "trustBar"
    | "testimonials"
    | "faqs"
    | "cta"
    | "other"
    | "seo"
    | "design"
  >("overview");

  // UI state
  const [saving, setSaving] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [showRevisionsModal, setShowRevisionsModal] = useState(false);
  const [publishNote, setPublishNote] = useState("");
  const [showPublishPrompt, setShowPublishPrompt] = useState(false);

  // Load homepage & services data
  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [hpRes, srvRes] = await Promise.all([
        getCmsHomepageFn({ data: { token } }),
        getCmsServicesFn({ data: { token, includeDrafts: true } }),
      ]);

      if (hpRes.ok && hpRes.homepage) {
        setHomepageState(hpRes.homepage);
        // Start editing from draft if available, otherwise from live
        setFormData(hpRes.homepage.draft || hpRes.homepage.live);
      }
      if (srvRes.ok && srvRes.services) {
        setServicesList(srvRes.services);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load homepage management data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  if (loading || !formData) {
    return (
      <AdminLayout title="Homepage Management">
        <div className="p-16 text-center text-slate-400">Loading Homepage CMS Data...</div>
      </AdminLayout>
    );
  }

  // Save Draft
  const handleSaveDraft = async () => {
    if (!token || !formData) return;
    setSaving(true);
    try {
      const res = await saveCmsHomepageDraftFn({ data: { token, data: formData } });
      if (res.ok && res.homepage) {
        setHomepageState(res.homepage);
        toast.success("Draft saved successfully. Live website is unchanged.");
      } else {
        toast.error("Failed to save draft.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving draft.");
    } finally {
      setSaving(false);
    }
  };

  // Publish
  const handleConfirmPublish = async () => {
    if (!token || !formData) return;
    setSaving(true);
    try {
      const res = await publishCmsHomepageFn({
        data: { token, data: formData, note: publishNote.trim() || undefined },
      });
      if (res.ok && res.homepage) {
        setHomepageState(res.homepage);
        setShowPublishPrompt(false);
        setPublishNote("");
        toast.success("Homepage published live! All changes are now public.");
      } else {
        toast.error("Failed to publish changes.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error publishing homepage.");
    } finally {
      setSaving(false);
    }
  };

  // Restore Revision
  const handleRestoreRevision = async (revId: string) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to restore this revision? Your current live homepage will be replaced with this version.")) {
      return;
    }
    setSaving(true);
    try {
      const res = await restoreCmsHomepageRevisionFn({ data: { token, revisionId: revId } });
      if (res.ok && res.homepage) {
        setHomepageState(res.homepage);
        setFormData(res.homepage.live);
        setShowRevisionsModal(false);
        toast.success("Revision restored successfully and published live.");
      } else {
        toast.error("Failed to restore revision.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error restoring revision.");
    } finally {
      setSaving(false);
    }
  };

  // SEO Score & Checklist
  const seo = formData.seo;
  const seoChecks = [
    {
      label: "Homepage SEO Title Length (50–60 characters)",
      pass: seo.metaTitle.trim().length >= 40 && seo.metaTitle.trim().length <= 65,
      hint: `${seo.metaTitle.trim().length} chars (Target: 50–60)`,
    },
    {
      label: "Meta Description Length (140–160 characters)",
      pass: seo.metaDescription.trim().length >= 120 && seo.metaDescription.trim().length <= 165,
      hint: `${seo.metaDescription.trim().length} chars (Target: 140–160)`,
    },
    {
      label: "Main H1 Headline Configured",
      pass: formData.hero.h1.trim().length > 0,
      hint: formData.hero.h1.trim() ? "H1 set" : "Missing H1",
    },
    {
      label: "Focus Keyword Configured",
      pass: Boolean(seo.focusKeyword?.trim()),
      hint: seo.focusKeyword ? `"${seo.focusKeyword}"` : "Add primary focus keyword",
    },
    {
      label: "Focus Keyword in H1",
      pass: Boolean(seo.focusKeyword && formData.hero.h1.toLowerCase().includes(seo.focusKeyword.toLowerCase())),
      hint: "Crucial search engine relevancy signal",
    },
    {
      label: "Focus Keyword in Title Tag",
      pass: Boolean(seo.focusKeyword && seo.metaTitle.toLowerCase().includes(seo.focusKeyword.toLowerCase())),
      hint: "Highest-weight on-page factor",
    },
    {
      label: "Focus Keyword in Meta Description",
      pass: Boolean(seo.focusKeyword && seo.metaDescription.toLowerCase().includes(seo.focusKeyword.toLowerCase())),
      hint: "Improves organic search snippet CTR",
    },
    {
      label: "Hero Desktop Image ALT text defined",
      pass: formData.hero.imageAlt.trim().length > 0,
      hint: formData.hero.imageAlt ? "Alt text provided" : "Missing image alt text",
    },
    {
      label: "Canonical URL Configured",
      pass: Boolean(seo.canonicalUrl?.trim()),
      hint: seo.canonicalUrl || "https://socialwaale.com/",
    },
    {
      label: "Robots Indexing Enabled (index, follow)",
      pass: seo.robots === "index,follow",
      hint: seo.robots,
    },
    {
      label: "FAQ Section with at least 3 Questions",
      pass: formData.faqs.items.filter((f) => f.enabled !== false).length >= 3,
      hint: `${formData.faqs.items.filter((f) => f.enabled !== false).length} FAQs active (eligible for FAQ Schema)`,
    },
  ];
  const passedSeoCount = seoChecks.filter((c) => c.pass).length;
  const seoScorePercentage = Math.round((passedSeoCount / seoChecks.length) * 100);

  const isDraftPending = Boolean(homepageState?.draft);

  return (
    <AdminLayout title="Homepage Management">
      <div className="space-y-6 pb-24 font-sans">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0B1437] border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF941E]/20 to-[#FFD84A]/10 border border-[#FF941E]/30 text-[#FFD84A] flex items-center justify-center font-bold">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    isDraftPending
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {isDraftPending ? "○ Draft Changes Pending" : "● Live & Published"}
                </span>
                <span className="text-[11px] text-slate-400">
                  Updated: {new Date(homepageState?.updatedAt || "").toLocaleString()}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white mt-1">
                Website Homepage CMS
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRevisionsModal(true)}
              className="rounded-xl border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
              title="View & restore past published revisions"
            >
              <History className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
              History ({homepageState?.revisions?.length || 0})
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreviewModal(true)}
              className="rounded-xl border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Preview
            </Button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Live Site
            </a>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={handleSaveDraft}
              className="rounded-xl border-white/10 text-xs text-amber-300 hover:bg-amber-500/10"
            >
              Save Draft
            </Button>

            <Button
              type="button"
              size="sm"
              disabled={saving}
              onClick={() => setShowPublishPrompt(true)}
              className="rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20 hover:opacity-95"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Publish Changes
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 text-xs font-semibold">
          {[
            { key: "overview", label: "Sections Overview", icon: LayoutTemplate },
            { key: "hero", label: "Hero Banner", icon: Sparkles },
            { key: "about", label: "About Agency", icon: FileText },
            { key: "services", label: "Services Offerings", icon: Briefcase },
            { key: "whyChoose", label: "Why Choose Us", icon: Award },
            { key: "trustBar", label: "Stats & Partners", icon: BarChart3 },
            { key: "testimonials", label: "Client Reviews", icon: MessageSquareQuote },
            { key: "faqs", label: `FAQs (${formData.faqs.items.length})`, icon: HelpCircle },
            { key: "cta", label: "Final CTA", icon: Megaphone },
            { key: "other", label: "Process & Portfolio", icon: Layers },
            { key: "seo", label: `SEO & Schema (${seoScorePercentage}%)`, icon: Search },
            { key: "design", label: "Section Order", icon: Sliders },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD                                      */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-2">
              <h2 className="text-base font-extrabold text-white">Homepage Sections Manager</h2>
              <p className="text-xs text-slate-400">
                Quickly toggle sections on/off or click "Configure Section" to customize text, images, and buttons.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: "hero",
                  name: "Hero / Main Banner",
                  desc: "Primary H1, introduction, CTA buttons, and floating showcase card",
                  enabled: formData.hero.enabled,
                  tab: "hero",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, enabled: !formData.hero.enabled },
                    }),
                },
                {
                  id: "trustBar",
                  name: "Stats & Brand Partners",
                  desc: "Verified performance metrics, client numbers, and platform logos",
                  enabled: formData.trustBar.enabled,
                  tab: "trustBar",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      trustBar: { ...formData.trustBar, enabled: !formData.trustBar.enabled },
                    }),
                },
                {
                  id: "about",
                  name: "Introduction / About Agency",
                  desc: "Workspace image, agency narrative, and key value highlights",
                  enabled: formData.about.enabled,
                  tab: "about",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, enabled: !formData.about.enabled },
                    }),
                },
                {
                  id: "services",
                  name: "Services & Offerings Grid",
                  desc: "Interactive cards for 10 growth services linked directly to CMS",
                  enabled: formData.services.enabled,
                  tab: "services",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      services: { ...formData.services, enabled: !formData.services.enabled },
                    }),
                },
                {
                  id: "portfolio",
                  name: "Portfolio & Case Studies",
                  desc: "Real campaign results and client creative highlights",
                  enabled: formData.portfolio.enabled,
                  tab: "other",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      portfolio: { ...formData.portfolio, enabled: !formData.portfolio.enabled },
                    }),
                },
                {
                  id: "whyChoose",
                  name: "The Social Waale Advantage",
                  desc: "Why businesses choose us: transparency, senior attention, North India focus",
                  enabled: formData.whyChoose.enabled,
                  tab: "whyChoose",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      whyChoose: { ...formData.whyChoose, enabled: !formData.whyChoose.enabled },
                    }),
                },
                {
                  id: "process",
                  name: "Structured 6-Step Process",
                  desc: "The roadmap timeline explaining our discovery, execution, and scaling",
                  enabled: formData.process.enabled,
                  tab: "other",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      process: { ...formData.process, enabled: !formData.process.enabled },
                    }),
                },
                {
                  id: "industries",
                  name: "Industries Served",
                  desc: "12 vertical sectors customized for North Indian businesses",
                  enabled: formData.industries.enabled,
                  tab: "other",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      industries: { ...formData.industries, enabled: !formData.industries.enabled },
                    }),
                },
                {
                  id: "locations",
                  name: "Regional Coverage Footprint",
                  desc: "Chandigarh HQ with Punjab, HP, Haryana, UP, and Delhi NCR footprint",
                  enabled: formData.locations.enabled,
                  tab: "other",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      locations: { ...formData.locations, enabled: !formData.locations.enabled },
                    }),
                },
                {
                  id: "testimonials",
                  name: "Client Testimonials & Reviews",
                  desc: "Genuine client endorsements and ratings with verified feedback",
                  enabled: formData.testimonials.enabled,
                  tab: "testimonials",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      testimonials: {
                        ...formData.testimonials,
                        enabled: !formData.testimonials.enabled,
                      },
                    }),
                },
                {
                  id: "faqs",
                  name: "Frequently Asked Questions",
                  desc: "Transparent client answers and automated Google FAQ Schema",
                  enabled: formData.faqs.enabled,
                  tab: "faqs",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      faqs: { ...formData.faqs, enabled: !formData.faqs.enabled },
                    }),
                },
                {
                  id: "cta",
                  name: "Final Consultation CTA",
                  desc: "High-conversion enquiry banner with contact and WhatsApp triggers",
                  enabled: formData.cta.enabled,
                  tab: "cta",
                  toggle: () =>
                    setFormData({
                      ...formData,
                      cta: { ...formData.cta, enabled: !formData.cta.enabled },
                    }),
                },
              ].map((sec) => (
                <div
                  key={sec.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    sec.enabled
                      ? "bg-[#0B1437] border-white/10"
                      : "bg-[#080F35] border-white/5 opacity-60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white line-clamp-1">{sec.name}</span>
                      <button
                        type="button"
                        onClick={sec.toggle}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                          sec.enabled
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700 text-slate-400 border border-slate-600"
                        }`}
                      >
                        {sec.enabled ? "Active" : "Disabled"}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{sec.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab(sec.tab as any)}
                      className="text-xs font-bold text-[#FF941E] hover:underline flex items-center gap-1"
                    >
                      Configure Section →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: HERO BANNER                                             */}
        {/* ============================================================== */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                    Hero / Main Banner Content
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    This is the first impression visitors see when arriving at your website.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hero.enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, enabled: e.target.checked },
                      })
                    }
                    className="rounded border-white/20 text-[#FF941E]"
                  />
                  Enable Section
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Eyebrow Badge (Location / Subtitle)
                </label>
                <input
                  type="text"
                  value={formData.hero.eyebrowBadge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, eyebrowBadge: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-[#FF941E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Main H1 Heading *
                </label>
                <textarea
                  rows={2}
                  value={formData.hero.h1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, h1: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-sm font-bold text-white focus:ring-1 focus:ring-[#FF941E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description Paragraph 1
                  </label>
                  <textarea
                    rows={3}
                    value={formData.hero.description1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, description1: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-slate-200 focus:ring-1 focus:ring-[#FF941E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description Paragraph 2
                  </label>
                  <textarea
                    rows={3}
                    value={formData.hero.description2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, description2: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-slate-200 focus:ring-1 focus:ring-[#FF941E]"
                  />
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#080F35] border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-[#FFD84A] uppercase">
                    Primary CTA Button
                  </span>
                  <input
                    type="text"
                    value={formData.hero.primaryCtaText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, primaryCtaText: e.target.value },
                      })
                    }
                    placeholder="Button Text"
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    value={formData.hero.primaryCtaLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, primaryCtaLink: e.target.value },
                      })
                    }
                    placeholder="Destination Link (/contact)"
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-lg text-xs font-mono text-slate-300"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#080F35] border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-[#FFD84A] uppercase">
                    Secondary CTA Button
                  </span>
                  <input
                    type="text"
                    value={formData.hero.secondaryCtaText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, secondaryCtaText: e.target.value },
                      })
                    }
                    placeholder="Button Text"
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    value={formData.hero.secondaryCtaLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, secondaryCtaLink: e.target.value },
                      })
                    }
                    placeholder="Destination Link (tel:+91...)"
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-lg text-xs font-mono text-slate-300"
                  />
                </div>
              </div>

              {/* Images & Alt */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Desktop Banner Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.hero.desktopBannerImage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, desktopBannerImage: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-[#080F35] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mobile Banner Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.hero.mobileBannerImage || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, mobileBannerImage: e.target.value },
                      })
                    }
                    placeholder="Same as desktop if left empty"
                    className="w-full px-3 py-1.5 bg-[#080F35] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Image ALT Text (SEO) *
                  </label>
                  <input
                    type="text"
                    value={formData.hero.imageAlt}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, imageAlt: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-[#080F35] border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Hero Stats */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-xs font-bold text-[#FFD84A] uppercase tracking-wider block mb-3">
                  Hero Metrics Indicators (4 Numbers Below CTA)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.hero.stats.map((st, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#080F35] border border-white/10 space-y-1">
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const updated = [...formData.hero.stats];
                          if (updated[idx]) {
                            updated[idx].value = e.target.value;
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, stats: updated },
                            });
                          }
                        }}
                        placeholder="50+"
                        className="w-full px-2 py-1 bg-[#0B1437] rounded text-sm font-black text-[#FFD84A]"
                      />
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const updated = [...formData.hero.stats];
                          if (updated[idx]) {
                            updated[idx].label = e.target.value;
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, stats: updated },
                            });
                          }
                        }}
                        placeholder="Clients Served"
                        className="w-full px-2 py-1 bg-[#0B1437] rounded text-xs text-slate-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ABOUT INTRO                                             */}
        {/* ============================================================== */}
        {activeTab === "about" && (
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                About Social Waale Section
              </h2>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.about.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, enabled: e.target.checked },
                    })
                  }
                  className="rounded border-white/20 text-[#FF941E]"
                />
                Enable Section
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Section Eyebrow</label>
              <input
                type="text"
                value={formData.about.eyebrowBadge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, eyebrowBadge: e.target.value },
                  })
                }
                className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Main Section Heading</label>
              <input
                type="text"
                value={formData.about.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, heading: e.target.value },
                  })
                }
                className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-sm font-bold text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">About Narrative Paragraph</label>
              <textarea
                rows={3}
                value={formData.about.descriptionParagraphs[0] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, descriptionParagraphs: [e.target.value] },
                  })
                }
                className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Featured Studio Image URL</label>
                <input
                  type="text"
                  value={formData.about.featuredImage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, featuredImage: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-[#080F35] border border-white/10 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Image Alt Text (SEO)</label>
                <input
                  type="text"
                  value={formData.about.imageAlt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, imageAlt: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-[#080F35] border border-white/10 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            {/* Highlights */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Key Pillars (Bullet Points)</label>
              <div className="space-y-2">
                {formData.about.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF941E] shrink-0" />
                    <input
                      type="text"
                      value={hl}
                      onChange={(e) => {
                        const updated = [...formData.about.highlights];
                        updated[idx] = e.target.value;
                        setFormData({
                          ...formData,
                          about: { ...formData.about, highlights: updated },
                        });
                      }}
                      className="flex-grow px-3 py-1 bg-[#080F35] border border-white/10 rounded-lg text-xs text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: SERVICES OFFERINGS                                      */}
        {/* ============================================================== */}
        {activeTab === "services" && (
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                  Services Section Configuration
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connected directly with your CMS Services. Select which services to feature on the homepage.
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.services.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      services: { ...formData.services, enabled: e.target.checked },
                    })
                  }
                  className="rounded border-white/20 text-[#FF941E]"
                />
                Enable Section
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Section Eyebrow</label>
                <input
                  type="text"
                  value={formData.services.eyebrowBadge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      services: { ...formData.services, eyebrowBadge: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Main Section Heading</label>
                <input
                  type="text"
                  value={formData.services.heading}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      services: { ...formData.services, heading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs font-bold text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Section Description</label>
              <textarea
                rows={2}
                value={formData.services.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    services: { ...formData.services, description: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-slate-200"
              />
            </div>

            {/* Selection Mode */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Display Mode</label>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="servicesMode"
                    checked={formData.services.mode === "all"}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, mode: "all" },
                      })
                    }
                  />
                  Show all published CMS services (Default: 10 services)
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="servicesMode"
                    checked={formData.services.mode === "selected"}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, mode: "selected" },
                      })
                    }
                  />
                  Manually select which services to display
                </label>
              </div>

              {formData.services.mode === "selected" && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {servicesList.map((srv) => {
                    const isChecked = formData.services.selectedSlugs.includes(srv.slug);
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          const updated = isChecked
                            ? formData.services.selectedSlugs.filter((s) => s !== srv.slug)
                            : [...formData.services.selectedSlugs, srv.slug];
                          setFormData({
                            ...formData,
                            services: { ...formData.services, selectedSlugs: updated },
                          });
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isChecked
                            ? "bg-[#FF941E]/20 border-[#FF941E] text-white"
                            : "bg-[#080F35] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black ${
                            isChecked ? "bg-[#FF941E] text-[#080F35]" : "border border-white/20"
                          }`}
                        >
                          {isChecked ? "✓" : ""}
                        </div>
                        <span className="text-xs font-bold truncate">{srv.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: WHY CHOOSE US                                           */}
        {/* ============================================================== */}
        {activeTab === "whyChoose" && (
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                  The Social Waale Advantage (Why Choose Us)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Core differentiators that convince visitors to choose Social Waale.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    whyChoose: {
                      ...formData.whyChoose,
                      items: [
                        ...formData.whyChoose.items,
                        { title: "New Advantage", description: "Details..." },
                      ],
                    },
                  });
                }}
                className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Advantage
              </Button>
            </div>

            <div className="space-y-3">
              {formData.whyChoose.items.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#080F35] border border-white/10 flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-white/10 text-[#FFD84A] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    {idx + 1}
                  </span>
                  <div className="flex-grow space-y-1.5">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...formData.whyChoose.items];
                        if (updated[idx]) {
                          updated[idx].title = e.target.value;
                          setFormData({
                            ...formData,
                            whyChoose: { ...formData.whyChoose, items: updated },
                          });
                        }
                      }}
                      placeholder="Advantage Title"
                      className="w-full px-3 py-1 bg-[#0B1437] border border-white/10 rounded-lg text-xs font-bold text-white"
                    />
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...formData.whyChoose.items];
                        if (updated[idx]) {
                          updated[idx].description = e.target.value;
                          setFormData({
                            ...formData,
                            whyChoose: { ...formData.whyChoose, items: updated },
                          });
                        }
                      }}
                      placeholder="Advantage Rationale..."
                      className="w-full px-3 py-1 bg-[#0B1437] border border-white/10 rounded-lg text-xs text-slate-300"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.whyChoose.items.filter((_, i) => i !== idx);
                      setFormData({
                        ...formData,
                        whyChoose: { ...formData.whyChoose, items: updated },
                      });
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: STATS & PARTNERS                                        */}
        {/* ============================================================== */}
        {activeTab === "trustBar" && (
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                  Verified Statistics & Brand Platforms
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Only verified metrics should be displayed.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    trustBar: {
                      ...formData.trustBar,
                      stats: [
                        ...formData.trustBar.stats,
                        { value: "100%", title: "Metric Title", description: "Metric Details" },
                      ],
                    },
                  });
                }}
                className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Statistic
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.trustBar.stats.map((st, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#080F35] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Stat #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.trustBar.stats.filter((_, i) => i !== idx);
                        setFormData({
                          ...formData,
                          trustBar: { ...formData.trustBar, stats: updated },
                        });
                      }}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => {
                      const updated = [...formData.trustBar.stats];
                      if (updated[idx]) {
                        updated[idx].value = e.target.value;
                        setFormData({
                          ...formData,
                          trustBar: { ...formData.trustBar, stats: updated },
                        });
                      }
                    }}
                    placeholder="50+"
                    className="w-full px-3 py-1.5 bg-[#0B1437] rounded-lg text-sm font-black text-[#FFD84A]"
                  />
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => {
                      const updated = [...formData.trustBar.stats];
                      if (updated[idx]) {
                        updated[idx].title = e.target.value;
                        setFormData({
                          ...formData,
                          trustBar: { ...formData.trustBar, stats: updated },
                        });
                      }
                    }}
                    placeholder="Clients Served"
                    className="w-full px-3 py-1.5 bg-[#0B1437] rounded-lg text-xs font-bold text-white"
                  />
                  <input
                    type="text"
                    value={st.description}
                    onChange={(e) => {
                      const updated = [...formData.trustBar.stats];
                      if (updated[idx]) {
                        updated[idx].description = e.target.value;
                        setFormData({
                          ...formData,
                          trustBar: { ...formData.trustBar, stats: updated },
                        });
                      }
                    }}
                    placeholder="Across diverse North India businesses"
                    className="w-full px-3 py-1.5 bg-[#0B1437] rounded-lg text-xs text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: TESTIMONIALS & REVIEWS                                  */}
        {/* ============================================================== */}
        {activeTab === "testimonials" && (
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                  Client Testimonials & Feedback
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Display verified testimonials from real clients.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    testimonials: {
                      ...formData.testimonials,
                      items: [
                        ...formData.testimonials.items,
                        {
                          id: `test-${Date.now()}`,
                          name: "Client Name",
                          designation: "Founder",
                          company: "Company Name",
                          text: "Detailed review of their collaboration with Social Waale...",
                          rating: 5,
                          enabled: true,
                        },
                      ],
                    },
                  });
                }}
                className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Testimonial
              </Button>
            </div>

            <div className="space-y-4">
              {formData.testimonials.items.map((test, idx) => (
                <div key={test.id} className="p-4 rounded-2xl bg-[#080F35] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FFD84A]">Review #{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={test.enabled}
                          onChange={(e) => {
                            const updated = [...formData.testimonials.items];
                            if (updated[idx]) {
                              updated[idx].enabled = e.target.checked;
                              setFormData({
                                ...formData,
                                testimonials: { ...formData.testimonials, items: updated },
                              });
                            }
                          }}
                        />
                        Active
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.testimonials.items.filter((_, i) => i !== idx);
                          setFormData({
                            ...formData,
                            testimonials: { ...formData.testimonials, items: updated },
                          });
                        }}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={test.name}
                      onChange={(e) => {
                        const updated = [...formData.testimonials.items];
                        if (updated[idx]) {
                          updated[idx].name = e.target.value;
                          setFormData({
                            ...formData,
                            testimonials: { ...formData.testimonials, items: updated },
                          });
                        }
                      }}
                      placeholder="Name"
                      className="px-3 py-1.5 bg-[#0B1437] rounded-lg text-xs font-bold text-white"
                    />
                    <input
                      type="text"
                      value={test.designation}
                      onChange={(e) => {
                        const updated = [...formData.testimonials.items];
                        if (updated[idx]) {
                          updated[idx].designation = e.target.value;
                          setFormData({
                            ...formData,
                            testimonials: { ...formData.testimonials, items: updated },
                          });
                        }
                      }}
                      placeholder="Designation"
                      className="px-3 py-1.5 bg-[#0B1437] rounded-lg text-xs text-slate-300"
                    />
                    <input
                      type="text"
                      value={test.company || ""}
                      onChange={(e) => {
                        const updated = [...formData.testimonials.items];
                        if (updated[idx]) {
                          updated[idx].company = e.target.value;
                          setFormData({
                            ...formData,
                            testimonials: { ...formData.testimonials, items: updated },
                          });
                        }
                      }}
                      placeholder="Company"
                      className="px-3 py-1.5 bg-[#0B1437] rounded-lg text-xs text-slate-300"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={test.text}
                    onChange={(e) => {
                      const updated = [...formData.testimonials.items];
                      if (updated[idx]) {
                        updated[idx].text = e.target.value;
                        setFormData({
                          ...formData,
                          testimonials: { ...formData.testimonials, items: updated },
                        });
                      }
                    }}
                    placeholder="Feedback / Review text..."
                    className="w-full px-3 py-1.5 bg-[#0B1437] rounded-lg text-xs text-slate-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: FAQS MANAGEMENT                                         */}
        {/* ============================================================== */}
        {activeTab === "faqs" && (
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                  Frequently Asked Questions (FAQPage Schema)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Directly renders in the homepage accordion and injects Google FAQ structured data.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    faqs: {
                      ...formData.faqs,
                      items: [
                        ...formData.faqs.items,
                        { q: "New Question?", a: "Detailed transparent answer...", enabled: true },
                      ],
                    },
                  });
                }}
                className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ
              </Button>
            </div>

            <div className="space-y-4">
              {formData.faqs.items.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#080F35] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FFD84A]">Question {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...formData.faqs.items];
                          const [item] = updated.splice(idx, 1);
                          if (item) {
                            updated.splice(idx - 1, 0, item);
                            setFormData({ ...formData, faqs: { ...formData.faqs, items: updated } });
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={idx === formData.faqs.items.length - 1}
                        onClick={() => {
                          const updated = [...formData.faqs.items];
                          const [item] = updated.splice(idx, 1);
                          if (item) {
                            updated.splice(idx + 1, 0, item);
                            setFormData({ ...formData, faqs: { ...formData.faqs, items: updated } });
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.faqs.items.filter((_, i) => i !== idx);
                          setFormData({ ...formData, faqs: { ...formData.faqs, items: updated } });
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={faq.q}
                    onChange={(e) => {
                      const updated = [...formData.faqs.items];
                      if (updated[idx]) {
                        updated[idx].q = e.target.value;
                        setFormData({ ...formData, faqs: { ...formData.faqs, items: updated } });
                      }
                    }}
                    placeholder="Enter question..."
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs font-bold text-white"
                  />
                  <textarea
                    rows={2}
                    value={faq.a}
                    onChange={(e) => {
                      const updated = [...formData.faqs.items];
                      if (updated[idx]) {
                        updated[idx].a = e.target.value;
                        setFormData({ ...formData, faqs: { ...formData.faqs, items: updated } });
                      }
                    }}
                    placeholder="Enter answer..."
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 9: FINAL CTA                                               */}
        {/* ============================================================== */}
        {activeTab === "cta" && (
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                Final Consultation Enquiry Banner
              </h2>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cta.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cta: { ...formData.cta, enabled: e.target.checked },
                    })
                  }
                  className="rounded border-white/20 text-[#FF941E]"
                />
                Enable Section
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Eyebrow Tag</label>
              <input
                type="text"
                value={formData.cta.eyebrowBadge || "START TODAY"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta: { ...formData.cta, eyebrowBadge: e.target.value },
                  })
                }
                className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Main CTA Heading</label>
              <input
                type="text"
                value={formData.cta.heading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta: { ...formData.cta, heading: e.target.value },
                  })
                }
                className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-sm font-bold text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description Text</label>
              <textarea
                rows={2}
                value={formData.cta.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cta: { ...formData.cta, description: e.target.value },
                  })
                }
                className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#080F35] border border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-[#FFD84A] uppercase">Primary CTA Button</span>
                <input
                  type="text"
                  value={formData.cta.primaryButtonText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cta: { ...formData.cta, primaryButtonText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-[#0B1437] rounded text-xs text-white"
                />
                <input
                  type="text"
                  value={formData.cta.primaryButtonLink}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cta: { ...formData.cta, primaryButtonLink: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-[#0B1437] rounded text-xs font-mono text-slate-300"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#080F35] border border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-[#FFD84A] uppercase">Secondary Button (WhatsApp)</span>
                <input
                  type="text"
                  value={formData.cta.secondaryButtonText || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cta: { ...formData.cta, secondaryButtonText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-[#0B1437] rounded text-xs text-white"
                />
                <input
                  type="text"
                  value={formData.cta.secondaryButtonLink || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cta: { ...formData.cta, secondaryButtonLink: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-[#0B1437] rounded text-xs font-mono text-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 10: HOMEPAGE SEO SETTINGS                                  */}
        {/* ============================================================== */}
        {activeTab === "seo" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Google Search Preview */}
              <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                  Google Search Snippet Preview
                </h2>
                <div className="p-4 rounded-2xl bg-[#080F35] border border-white/10 font-sans max-w-2xl space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>socialwaale.com</span>
                  </div>
                  <p className="text-base font-bold text-blue-400 hover:underline cursor-pointer line-clamp-1">
                    {seo.metaTitle || "Digital Marketing Agency in Chandigarh | Social Waale"}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {seo.metaDescription || "Social Waale is a Chandigarh-based digital marketing agency for social media, SEO, Google Ads, and websites."}
                  </p>
                </div>
              </div>

              {/* Title & Description Form */}
              <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                  Meta Tags & Keywords
                </h2>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">Homepage SEO Title (Title Tag) *</label>
                    <span
                      className={`text-[10px] font-mono ${
                        seo.metaTitle.length >= 40 && seo.metaTitle.length <= 65
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {seo.metaTitle.length} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seo.metaTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, metaTitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">SEO Meta Description *</label>
                    <span
                      className={`text-[10px] font-mono ${
                        seo.metaDescription.length >= 120 && seo.metaDescription.length <= 165
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {seo.metaDescription.length} / 155 characters
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={seo.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, metaDescription: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Focus Keyword</label>
                    <input
                      type="text"
                      value={seo.focusKeyword || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, focusKeyword: e.target.value },
                        })
                      }
                      placeholder="e.g. digital marketing agency in chandigarh"
                      className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meta Robots Directive</label>
                    <select
                      value={seo.robots}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, robots: e.target.value as any },
                        })
                      }
                      className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white"
                    >
                      <option value="index,follow">index, follow (Standard / Live)</option>
                      <option value="noindex,follow">noindex, follow</option>
                      <option value="noindex,nofollow">noindex, nofollow</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Canonical URL</label>
                  <input
                    type="text"
                    value={seo.canonicalUrl || "https://socialwaale.com/"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, canonicalUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs font-mono text-slate-300"
                  />
                </div>
              </div>

              {/* Open Graph Social Sharing */}
              <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                  Open Graph (Facebook, WhatsApp, LinkedIn Sharing)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">OG Title</label>
                    <input
                      type="text"
                      value={seo.ogTitle || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, ogTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">OG Share Image URL</label>
                    <input
                      type="text"
                      value={seo.ogImage || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, ogImage: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">OG Description</label>
                  <textarea
                    rows={2}
                    value={seo.ogDescription || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, ogDescription: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* SEO Checklist Sidebar */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4 sticky top-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                    SEO Audit Checklist
                  </h2>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      seoScorePercentage >= 80
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {seoScorePercentage}% Score
                  </span>
                </div>

                <div className="space-y-2.5">
                  {seoChecks.map((chk, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      {chk.pass ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={chk.pass ? "text-slate-200 font-medium" : "text-slate-400"}>
                          {chk.label}
                        </p>
                        <p className="text-[10px] text-slate-500">{chk.hint}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#FFD84A] shrink-0" />
                  <span>Organization & WebSite Schema is auto-injected.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 11: SECTION ORDER & DESIGN                                 */}
        {/* ============================================================== */}
        {activeTab === "design" && (
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                Homepage Section Layout & Ordering
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Use the Move Up and Move Down controls to customize the exact vertical sequence of homepage sections.
              </p>
            </div>

            <div className="space-y-2 max-w-xl">
              {formData.sectionOrder.map((secKey, idx) => (
                <div
                  key={secKey}
                  className="p-3.5 rounded-xl bg-[#080F35] border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-[#FFD84A] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white capitalize">
                      {secKey.replace(/([A-Z])/g, " $1")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...formData.sectionOrder];
                        const [moved] = updated.splice(idx, 1);
                        if (moved) {
                          updated.splice(idx - 1, 0, moved);
                          setFormData({ ...formData, sectionOrder: updated });
                        }
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === formData.sectionOrder.length - 1}
                      onClick={() => {
                        const updated = [...formData.sectionOrder];
                        const [moved] = updated.splice(idx, 1);
                        if (moved) {
                          updated.splice(idx + 1, 0, moved);
                          setFormData({ ...formData, sectionOrder: updated });
                        }
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 12: OTHER SECTIONS (PROCESS, PORTFOLIO, ETC)               */}
        {/* ============================================================== */}
        {activeTab === "other" && (
          <div className="space-y-6">
            {/* Process Section */}
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                    6-Step Delivery Process
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Timeline roadmap explaining your client journey.</p>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.process.enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        process: { ...formData.process, enabled: e.target.checked },
                      })
                    }
                  />
                  Enable Section
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.process.steps.map((st, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#080F35] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#FFD84A]">{st.step}</span>
                      <input
                        type="text"
                        value={st.title}
                        onChange={(e) => {
                          const updated = [...formData.process.steps];
                          if (updated[idx]) {
                            updated[idx].title = e.target.value;
                            setFormData({
                              ...formData,
                              process: { ...formData.process, steps: updated },
                            });
                          }
                        }}
                        className="px-2 py-0.5 bg-[#0B1437] rounded text-xs font-bold text-white text-right"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={st.description}
                      onChange={(e) => {
                        const updated = [...formData.process.steps];
                        if (updated[idx]) {
                          updated[idx].description = e.target.value;
                          setFormData({
                            ...formData,
                            process: { ...formData.process, steps: updated },
                          });
                        }
                      }}
                      className="w-full px-2 py-1 bg-[#0B1437] rounded text-xs text-slate-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Section */}
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                    Portfolio & Showcases Section
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Toggle and customize portfolio presentation.</p>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.portfolio.enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        portfolio: { ...formData.portfolio, enabled: e.target.checked },
                      })
                    }
                  />
                  Enable Section
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Section Heading</label>
                <input
                  type="text"
                  value={formData.portfolio.heading}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      portfolio: { ...formData.portfolio, heading: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs font-bold text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PUBLISH CONFIRMATION MODAL                                     */}
        {/* ============================================================== */}
        {showPublishPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-[#0B1437] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] flex items-center justify-center font-bold">
                  <Save className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Publish Homepage Live</h3>
                  <p className="text-xs text-slate-400">This will immediately update the live public website.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Release Note (Optional for Revision History)
                </label>
                <input
                  type="text"
                  value={publishNote}
                  onChange={(e) => setPublishNote(e.target.value)}
                  placeholder="e.g. Updated hero banner and holiday stats"
                  className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPublishPrompt(false)}
                  className="rounded-xl border-white/10 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={saving}
                  onClick={handleConfirmPublish}
                  className="rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md"
                >
                  {saving ? "Publishing..." : "Confirm & Publish"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* REVISION HISTORY MODAL                                         */}
        {/* ============================================================== */}
        {showRevisionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-[#0B1437] border border-white/15 rounded-3xl p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <History className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Homepage Revision History</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRevisionsModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                {(homepageState?.revisions || []).map((rev, i) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-[#080F35] border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {rev.authorName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(rev.timestamp).toLocaleString()}
                        </span>
                        {i === 0 && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            Current Live
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {rev.note || "No release notes provided"}
                      </p>
                      <p className="text-[11px] text-[#FFD84A] mt-0.5 font-mono truncate max-w-md">
                        H1: {rev.data?.hero?.h1}
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="rounded-xl border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-xs shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restore Version
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* LIVE PREVIEW MODAL                                             */}
        {/* ============================================================== */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md">
            <div className="p-4 bg-[#080F35] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFD84A]">
                  Homepage Simulator Preview
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  https://socialwaale.com/
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#0B1437] p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                      previewDevice === "desktop"
                        ? "bg-[#FF941E] text-[#080F35]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                      previewDevice === "mobile"
                        ? "bg-[#FF941E] text-[#080F35]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 sm:p-8 flex justify-center bg-[#060B28]">
              <div
                className={`bg-[#080F35] text-white rounded-3xl border border-white/15 overflow-hidden shadow-2xl transition-all duration-300 ${
                  previewDevice === "mobile"
                    ? "w-[375px] max-w-[375px] min-h-[700px]"
                    : "w-full max-w-5xl"
                }`}
              >
                {/* Hero Preview */}
                {formData.hero.enabled && (
                  <div className="p-8 sm:p-12 bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35] border-b border-white/10">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#FFD84A] mb-4">
                      {formData.hero.eyebrowBadge}
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                      {formData.hero.h1}
                    </h1>
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-2xl">
                      {formData.hero.description1}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FFD84A] to-[#FF941E] text-[#080F35] font-bold text-xs uppercase">
                        {formData.hero.primaryCtaText} →
                      </div>
                      <div className="px-5 py-2.5 rounded-full border border-white/20 text-white font-semibold text-xs">
                        {formData.hero.secondaryCtaText}
                      </div>
                    </div>
                  </div>
                )}

                {/* About Preview */}
                {formData.about.enabled && (
                  <div className="p-8 sm:p-12 bg-white text-[#080F35] border-b border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
                      {formData.about.eyebrowBadge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black mt-1 mb-3">
                      {formData.about.heading}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {formData.about.descriptionParagraphs[0]}
                    </p>
                  </div>
                )}

                {/* Services Preview */}
                {formData.services.enabled && (
                  <div className="p-8 sm:p-12 bg-[#F7F8FC] text-[#080F35] border-b border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
                      {formData.services.eyebrowBadge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black mt-1 mb-4">
                      {formData.services.heading}
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {(formData.services.mode === "selected" && formData.services.selectedSlugs.length > 0
                        ? servicesList.filter((s) => formData.services.selectedSlugs.includes(s.slug))
                        : servicesList.slice(0, 6)
                      ).map((s) => (
                        <div key={s.id} className="p-4 rounded-xl bg-white border border-slate-200">
                          <h3 className="font-bold text-xs text-[#080F35]">{s.name}</h3>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{s.tagline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ Preview */}
                {formData.faqs.enabled && (
                  <div className="p-8 sm:p-12 bg-white text-[#080F35]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
                      FREQUENTLY ASKED QUESTIONS
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black mt-1 mb-4">
                      {formData.faqs.heading}
                    </h2>
                    <div className="space-y-2">
                      {formData.faqs.items.slice(0, 4).map((f, i) => (
                        <div key={i} className="p-3 rounded-lg bg-[#F7F8FC] border border-slate-200">
                          <p className="font-bold text-xs">{f.q}</p>
                          <p className="text-[11px] text-slate-600 mt-1">{f.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
