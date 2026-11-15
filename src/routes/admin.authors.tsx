import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getCmsAuthorsFn,
  saveCmsAuthorFn,
  deleteCmsAuthorFn,
} from "@/lib/cms/cms.functions";
import type { CMSAuthor } from "@/lib/cms/types";
import { Users, Plus, Edit, Trash2, Save, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/authors")({
  component: AuthorsPageWrapper,
});

function AuthorsPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <AuthorsPage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function AuthorsPage() {
  const { token, user } = useAdminAuth();
  const [authors, setAuthors] = useState<CMSAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/favicon.png");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");

  const refreshData = () => {
    setLoading(true);
    getCmsAuthorsFn()
      .then((res) => {
        if (res.ok) setAuthors(res.authors);
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
    setDesignation("");
    setBio("");
    setAvatarUrl("/favicon.png");
    setLinkedin("");
    setInstagram("");
  };

  const handleEditClick = (a: CMSAuthor) => {
    setIsEditing(true);
    setEditId(a.id);
    setName(a.name);
    setDesignation(a.designation);
    setBio(a.bio);
    setAvatarUrl(a.avatarUrl || "/favicon.png");
    setLinkedin(a.socialLinks?.linkedin || "");
    setInstagram(a.socialLinks?.instagram || "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!name.trim()) {
      toast.error("Author name is required.");
      return;
    }

    const payload: CMSAuthor = {
      id: editId || `author-${Date.now()}`,
      slug: name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
      name: name.trim(),
      designation: designation.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || "/favicon.png",
      socialLinks: {
        ...(linkedin.trim() ? { linkedin: linkedin.trim() } : {}),
        ...(instagram.trim() ? { instagram: instagram.trim() } : {}),
      },
    };

    const res = await saveCmsAuthorFn({ data: { token, author: payload } });
    if (res.ok) {
      toast.success(editId ? "Author updated." : "Author created.");
      resetForm();
      refreshData();
    } else {
      toast.error("Failed to save author.");
    }
  };

  const handleDelete = async (id: string, authorName: string) => {
    if (!token) return;
    if (user?.role !== "admin") {
      toast.error("Admin permissions required.");
      return;
    }
    if (!window.confirm(`Delete author "${authorName}"?`)) return;

    const res = await deleteCmsAuthorFn({ data: { token, id } });
    if (res.ok) {
      toast.success("Author deleted.");
      refreshData();
    } else {
      toast.error("Failed to delete author.");
    }
  };

  return (
    <AdminLayout title="Author & Editorial Management">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 shadow-xl sticky top-28">
            <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
              <span>{isEditing ? "Edit Author" : "Add New Author"}</span>
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
                  Author Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Social Waale Team"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Digital Growth Strategist"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Short Biography
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short author background..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Avatar / Profile Photo URL
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="/favicon.png"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20"
              >
                <Save className="w-3.5 h-3.5 mr-1" /> {isEditing ? "Update Author" : "Save Author"}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-[#0B1437] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
            <div className="p-4 bg-[#080F35]/70 border-b border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Authors ({authors.length})
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {authors.map((a) => (
                <div key={a.id} className="p-6 flex items-start justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0E1B5A] border border-white/15 overflow-hidden shrink-0 flex items-center justify-center font-bold text-sm text-[#FFD84A]">
                      {a.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{a.name}</h4>
                      <p className="text-xs font-semibold text-[#FF941E]">{a.designation}</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-md">{a.bio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditClick(a)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FF941E] hover:text-[#080F35] text-white transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {user?.role === "admin" && (
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id, a.name)}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
