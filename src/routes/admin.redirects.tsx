import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getCmsRedirectsFn,
  saveCmsRedirectFn,
  deleteCmsRedirectFn,
} from "@/lib/cms/cms.functions";
import type { CMSRedirect } from "@/lib/cms/types";
import { ArrowRightLeft, Plus, Trash2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/redirects")({
  component: RedirectsPageWrapper,
});

function RedirectsPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <RedirectsPage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function RedirectsPage() {
  const { token, user } = useAdminAuth();
  const [redirects, setRedirects] = useState<CMSRedirect[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState<301 | 302>(301);

  const refreshRedirects = () => {
    setLoading(true);
    getCmsRedirectsFn()
      .then((res) => {
        if (res.ok) setRedirects(res.redirects);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshRedirects();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!fromPath.trim() || !toPath.trim()) {
      toast.error("Source and destination paths are required.");
      return;
    }

    const payload: CMSRedirect = {
      id: `redir-${Date.now()}`,
      fromPath: fromPath.trim().startsWith("/") ? fromPath.trim() : `/${fromPath.trim()}`,
      toPath: toPath.trim().startsWith("/") ? toPath.trim() : `/${toPath.trim()}`,
      statusCode,
      createdAt: new Date().toISOString(),
      hits: 0,
    };

    const res = await saveCmsRedirectFn({ data: { token, redirect: payload } });
    if (res.ok) {
      toast.success("Redirect rule created.");
      setFromPath("");
      setToPath("");
      refreshRedirects();
    } else {
      toast.error("Failed to save redirect rule.");
    }
  };

  const handleDelete = async (id: string, from: string) => {
    if (!token) return;
    if (!window.confirm(`Delete redirect from ${from}?`)) return;

    const res = await deleteCmsRedirectFn({ data: { token, id } });
    if (res.ok) {
      toast.success("Redirect rule deleted.");
      refreshRedirects();
    } else {
      toast.error("Failed to delete redirect.");
    }
  };

  return (
    <AdminLayout title="URL Redirect Manager (301 / 302)">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl sticky top-28">
            <h3 className="text-base font-bold text-white mb-2">Create Redirect Rule</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Preserve link equity and prevent 404 errors when altering an article slug or retiring old landing pages.
            </p>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  From URL Path
                </label>
                <input
                  type="text"
                  required
                  value={fromPath}
                  onChange={(e) => setFromPath(e.target.value)}
                  placeholder="/articles/old-slug"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Destination Target Path
                </label>
                <input
                  type="text"
                  required
                  value={toPath}
                  onChange={(e) => setToPath(e.target.value)}
                  placeholder="/articles/new-slug"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Redirect Type
                </label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value) as 301 | 302)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                >
                  <option value={301}>301 Permanent Redirect (SEO Recommended)</option>
                  <option value={302}>302 Temporary Redirect</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Redirect Rule
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-[#0B1437] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
            <div className="p-4 bg-[#080F35]/70 border-b border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Configured Redirects ({redirects.length})
              </span>
            </div>

            {redirects.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No custom redirect rules configured yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="p-4 font-semibold uppercase tracking-wider text-[10px]">From</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-[10px]">To</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-[10px]">Type</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {redirects.map((r) => (
                      <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-mono text-[11px] text-rose-300">{r.fromPath}</td>
                        <td className="p-4 font-mono text-[11px] text-emerald-300">{r.toPath}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0E1B5A] text-[#FFD84A]">
                            {r.statusCode}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDelete(r.id, r.fromPath)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
