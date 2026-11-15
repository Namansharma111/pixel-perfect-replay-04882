import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCmsSettingsFn, saveCmsSettingsFn } from "@/lib/cms/cms.functions";
import type { CMSSiteSettings } from "@/lib/cms/types";
import { Compass, Globe, Save, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/seo")({
  component: SeoSettingsPageWrapper,
});

function SeoSettingsPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <SeoSettingsPage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function SeoSettingsPage() {
  const { token, user } = useAdminAuth();
  const [settings, setSettings] = useState<CMSSiteSettings>({
    siteName: "Social Waale",
    siteDescription: "Digital Marketing Agency in Chandigarh",
    enableXmlSitemap: true,
    enableRssFeed: true,
    customRobotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://socialwaale.com/sitemap.xml",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCmsSettingsFn()
      .then((res) => {
        if (res.ok) setSettings(res.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (user?.role !== "admin") {
      toast.error("Only Admins can modify global Technical SEO settings.");
      return;
    }

    setSaving(true);
    try {
      const res = await saveCmsSettingsFn({ data: { token, settings } });
      if (res.ok) {
        toast.success("Technical SEO configuration updated.");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Technical SEO & Crawl Directives">
      <div className="max-w-4xl space-y-8">
        {/* Overview Banner */}
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#0E1B5A] text-[#FFD84A] flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Automated Search Engine Feeds</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Social Waale automatically generates standards-compliant XML sitemaps and robots directives based on published blog articles and service pages.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFD84A] hover:underline flex items-center gap-1"
              >
                Inspect Live XML Sitemap <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-slate-500">•</span>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFD84A] hover:underline flex items-center gap-1"
              >
                Inspect Robots.txt <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Robots.txt Editor */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-white block">
                  Robots.txt Crawl Directives
                </label>
                <p className="text-xs text-slate-400">
                  Controls how Googlebot and Bingbot index your website. Admin routes are protected by default.
                </p>
              </div>
            </div>
            <textarea
              rows={5}
              value={settings.customRobotsTxt || ""}
              onChange={(e) => setSettings({ ...settings, customRobotsTxt: e.target.value })}
              className="w-full p-4 rounded-2xl bg-[#080F35] border border-white/10 text-emerald-400 font-mono text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
            />
          </div>

          {/* Verification IDs */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3">
              Webmaster Verification & Tag Integrations
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Google Search Console HTML Verification Code / Tag
              </label>
              <input
                type="text"
                value={settings.googleSearchConsoleCode || ""}
                onChange={(e) => setSettings({ ...settings, googleSearchConsoleCode: e.target.value })}
                placeholder="e.g. google-site-verification=abc123xyz"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  type="text"
                  value={settings.ga4MeasurementId || ""}
                  onChange={(e) => setSettings({ ...settings, ga4MeasurementId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Google Tag Manager Container ID
                </label>
                <input
                  type="text"
                  value={settings.googleTagManagerId || ""}
                  onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-lg shadow-orange-500/25"
          >
            <Save className="w-3.5 h-3.5 mr-1" /> {saving ? "Saving..." : "Save SEO Settings"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
