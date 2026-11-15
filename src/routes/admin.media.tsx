import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCmsMediaFn, saveCmsMediaFn, deleteCmsMediaFn } from "@/lib/cms/cms.functions";
import type { CMSMediaItem } from "@/lib/cms/types";
import { Image as ImageIcon, Plus, Trash2, Copy, Check, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/media")({
  component: MediaPageWrapper,
});

function MediaPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <MediaPage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function MediaPage() {
  const { token } = useAdminAuth();
  const [media, setMedia] = useState<CMSMediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Add media modal/form
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshMedia = () => {
    setLoading(true);
    getCmsMediaFn()
      .then((res) => {
        if (res.ok) setMedia(res.media);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshMedia();
  }, []);

  const handleCopyUrl = (item: CMSMediaItem) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      toast.success("Image URL copied to clipboard.");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!url.trim()) {
      toast.error("Image URL is required.");
      return;
    }

    const filename = url.split("/").pop() || "image.jpg";
    const newItem: CMSMediaItem = {
      id: `media-${Date.now()}`,
      filename,
      url: url.trim(),
      fileType: filename.endsWith(".png") ? "image/png" : "image/jpeg",
      fileSize: 85000,
      altText: altText.trim() || title.trim(),
      title: title.trim() || filename,
      uploadedAt: new Date().toISOString(),
    };

    const res = await saveCmsMediaFn({ data: { token, item: newItem } });
    if (res.ok) {
      toast.success("Media item added.");
      setTitle("");
      setUrl("");
      setAltText("");
      setShowAdd(false);
      refreshMedia();
    } else {
      toast.error("Failed to add media item.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!token) return;
    if (!window.confirm(`Delete image "${name}"?`)) return;

    const res = await deleteCmsMediaFn({ data: { token, id } });
    if (res.ok) {
      toast.success("Image deleted.");
      refreshMedia();
    } else {
      toast.error("Failed to delete image.");
    }
  };

  const filteredMedia = media.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.altText.toLowerCase().includes(search.toLowerCase()) ||
      m.filename.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout
      title="Media Library"
      actions={
        <Button
          type="button"
          size="sm"
          onClick={() => setShowAdd(!showAdd)}
          className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20"
        >
          <Plus className="w-4 h-4 mr-1" /> Add New Asset
        </Button>
      }
    >
      {/* Upload/Add Form Box */}
      {showAdd && (
        <div className="mb-8 p-6 rounded-3xl bg-[#0B1437] border border-[#FF941E]/40 shadow-xl max-w-2xl">
          <h3 className="text-base font-bold text-white mb-3">Register Media Asset</h3>
          <p className="text-xs text-slate-300 mb-4">
            Link an existing image asset (e.g. from <code>/src/assets/</code> or a public CDN) to the CMS media library with SEO ALT tags.
          </p>

          <form onSubmit={handleAddMedia} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Asset URL / Path
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/src/assets/blog-seo.jpg or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs font-mono focus:ring-2 focus:ring-[#FF941E] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Image Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Search Analytics Dashboard"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  ALT Text (SEO)
                </label>
                <input
                  type="text"
                  required
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Descriptive image explanation..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080F35] border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                size="sm"
                className="rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs"
              >
                Save to Library
              </Button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-[#0B1437] border border-white/10 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media by title, filename, or ALT text..."
            className="w-full pl-10 pr-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="bg-[#0B1437] rounded-3xl border border-white/10 overflow-hidden shadow-xl flex flex-col group hover:border-[#FF941E]/40 transition-all"
          >
            <div className="aspect-[16/10] bg-slate-800 relative overflow-hidden">
              <img
                src={item.url}
                alt={item.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item)}
                  className="p-1.5 rounded-lg bg-black/70 text-white hover:text-[#FFD84A]"
                  title="Copy URL"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1.5 rounded-lg bg-black/70 text-rose-300 hover:text-rose-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-[#FFD84A] font-mono truncate mt-0.5">{item.filename}</p>
                <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  ALT: {item.altText}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                <span>{(item.fileSize / 1024).toFixed(1)} KB</span>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item)}
                  className="text-white hover:text-[#FF941E] font-semibold flex items-center gap-1"
                >
                  {copiedId === item.id ? "Copied!" : "Copy Path"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
