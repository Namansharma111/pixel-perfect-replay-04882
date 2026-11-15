import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCmsSettingsFn, saveCmsSettingsFn } from "@/lib/cms/cms.functions";
import type { CMSSiteSettings } from "@/lib/cms/types";
import { Settings, ShieldCheck, Save, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPageWrapper,
});

function SettingsPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <SettingsPage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function SettingsPage() {
  const { user, token } = useAdminAuth();
  const [settings, setSettings] = useState<CMSSiteSettings>({
    siteName: "Social Waale",
    siteDescription: "Digital Marketing Agency in Chandigarh",
    enableXmlSitemap: true,
    enableRssFeed: true,
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
      toast.error("Admin permissions required.");
      return;
    }

    setSaving(true);
    try {
      const res = await saveCmsSettingsFn({ data: { token, settings } });
      if (res.ok) {
        toast.success("Settings saved successfully.");
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
    <AdminLayout title="CMS & Account Settings">
      <div className="max-w-3xl space-y-8">
        {/* General Settings Form */}
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#FF941E]" /> General CMS Configuration
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Brand / Website Name
              </label>
              <input
                type="text"
                required
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Default Site Description
              </label>
              <textarea
                rows={2}
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none resize-y"
              />
            </div>

            <div className="pt-2 space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableXmlSitemap}
                  onChange={(e) => setSettings({ ...settings, enableXmlSitemap: e.target.checked })}
                  className="rounded border-white/20 bg-[#080F35] text-[#FF941E] focus:ring-0"
                />
                <span>Automatically update public XML Sitemap on article publish</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableRssFeed}
                  onChange={(e) => setSettings({ ...settings, enableRssFeed: e.target.checked })}
                  className="rounded border-white/20 bg-[#080F35] text-[#FF941E] focus:ring-0"
                />
                <span>Enable RSS Feed generation</span>
              </label>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20 px-6 py-2.5"
              >
                <Save className="w-3.5 h-3.5 mr-1" /> {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </div>

        {/* Current Admin Account Card */}
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#FFD84A]" /> Current Admin Session
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#080F35] border border-white/5">
              <p className="text-slate-400 font-medium">Logged in as:</p>
              <p className="text-sm font-bold text-white mt-0.5">{user?.name}</p>
              <p className="text-slate-400 font-mono mt-0.5">{user?.email}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#080F35] border border-white/5">
              <p className="text-slate-400 font-medium">Role & Permissions:</p>
              <p className="text-sm font-bold text-[#FF941E] mt-0.5 capitalize flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> {user?.role} (Full Access)
              </p>
              <p className="text-slate-400 mt-0.5">Protected session token active</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
