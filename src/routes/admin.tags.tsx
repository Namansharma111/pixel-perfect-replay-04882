import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getCmsTagsFn,
  saveCmsTagFn,
  deleteCmsTagFn,
  getCmsArticlesFn,
} from "@/lib/cms/cms.functions";
import type { CMSTag, CMSArticle } from "@/lib/cms/types";
import { Tag, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tags")({
  component: TagsPageWrapper,
});

function TagsPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <TagsPage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function TagsPage() {
  const { token, user } = useAdminAuth();
  const [tags, setTags] = useState<CMSTag[]>([]);
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const refreshData = () => {
    setLoading(true);
    Promise.all([getCmsTagsFn(), getCmsArticlesFn({})])
      .then(([tagRes, artRes]) => {
        if (tagRes.ok) setTags(tagRes.tags);
        if (artRes.ok) setArticles(artRes.articles);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshData();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setName("");
    setSlug("");
  };

  const handleEditClick = (t: CMSTag) => {
    setIsEditing(true);
    setEditId(t.id);
    setName(t.name);
    setSlug(t.slug);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!name.trim() || !slug.trim()) {
      toast.error("Tag name and slug required.");
      return;
    }

    const payload: CMSTag = {
      id: editId || `tag-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
    };

    const res = await saveCmsTagFn({ data: { token, tag: payload } });
    if (res.ok) {
      toast.success(editId ? "Tag updated." : "Tag created.");
      resetForm();
      refreshData();
    } else {
      toast.error("Failed to save tag.");
    }
  };

  const handleDelete = async (id: string, tagName: string) => {
    if (!token) return;
    if (user?.role !== "admin") {
      toast.error("Admin permissions required.");
      return;
    }
    if (!window.confirm(`Delete tag "${tagName}"?`)) return;

    const res = await deleteCmsTagFn({ data: { token, id } });
    if (res.ok) {
      toast.success("Tag deleted.");
      refreshData();
    } else {
      toast.error("Failed to delete tag.");
    }
  };

  return (
    <AdminLayout title="Tag Management">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl sticky top-28">
            <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
              <span>{isEditing ? "Edit Tag" : "Add New Tag"}</span>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              )}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tag Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!isEditing) {
                      setSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"));
                    }
                  }}
                  placeholder="e.g. Meta Ads"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tag Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="meta-ads"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20"
              >
                <Save className="w-3.5 h-3.5 mr-1" /> {isEditing ? "Update Tag" : "Create Tag"}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-[#0B1437] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
            <div className="p-4 bg-[#080F35]/70 border-b border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Existing Tags ({tags.length})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="p-4 font-semibold uppercase tracking-wider text-[10px]">Name</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-[10px]">Slug</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-[10px]">Tagged Articles</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tags.map((t) => {
                    const count = articles.filter((a) => (a.tags || []).includes(t.slug)).length;
                    return (
                      <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-bold text-white text-xs">#{t.name}</td>
                        <td className="p-4 whitespace-nowrap font-mono text-[11px] text-[#FFD84A]">
                          {t.slug}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0E1B5A] text-white">
                            {count} posts
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap space-x-1">
                          <button
                            type="button"
                            onClick={() => handleEditClick(t)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FF941E] hover:text-[#080F35] text-white transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {user?.role === "admin" && (
                            <button
                              type="button"
                              onClick={() => handleDelete(t.id, t.name)}
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
