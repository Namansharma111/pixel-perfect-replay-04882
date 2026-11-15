import React, { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getCmsServicesFn,
  saveCmsServiceFn,
  deleteCmsServiceFn,
  toggleCmsServiceStatusFn,
  reorderCmsServicesFn,
} from "@/lib/cms/cms.functions";
import type { CMSService } from "@/lib/cms/types";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Layers,
  Sparkles,
  Eye,
  FileCheck,
  FileEdit,
  SearchCheck,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

export const Route = createFileRoute("/admin/services/")({
  component: ServicesListPageWrapper,
});

function ServicesListPageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <ServicesListPage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function renderServiceIcon(iconName?: string) {
  if (!iconName) return <Briefcase className="w-5 h-5 text-[#FF941E]" />;
  const IconComp = (LucideIcons as any)[iconName] || Briefcase;
  return <IconComp className="w-5 h-5 text-[#FF941E]" />;
}

function ServicesListPage() {
  const { token, user } = useAdminAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<CMSService[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await getCmsServicesFn({
        data: {
          token: token || undefined,
          includeDrafts: true,
        },
      });
      if (res.ok) {
        setServices(res.services);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
      toast.error("Failed to load services from CMS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [token]);

  // Categories list derived from services
  const categories = Array.from(new Set(services.map((s) => s.category).filter(Boolean)));

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase()) ||
      (s.tagline && s.tagline.toLowerCase().includes(search.toLowerCase())) ||
      (s.category && s.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = async (id: string, currentStatus: string, name: string) => {
    if (!token) return;
    try {
      const res = await toggleCmsServiceStatusFn({ data: { token, id } });
      if (res.ok) {
        toast.success(
          `Service "${name}" is now ${res.service.status === "published" ? "Published" : "Draft"}.`,
        );
        fetchServices();
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("Network error toggling status.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete service "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await deleteCmsServiceFn({ data: { token, id } });
      if (res.ok) {
        toast.success(`Service "${name}" deleted successfully.`);
        fetchServices();
      } else {
        toast.error("Failed to delete service.");
      }
    } catch {
      toast.error("Error deleting service.");
    }
  };

  const handleDuplicate = async (service: CMSService) => {
    if (!token) return;
    try {
      const duplicatedService: CMSService = {
        ...service,
        id: `srv-${Date.now()}`,
        slug: `${service.slug}-copy`,
        name: `${service.name} (Copy)`,
        shortName: `${service.shortName} (Copy)`,
        status: "draft",
        updatedAt: new Date().toISOString(),
      };
      const res = await saveCmsServiceFn({ data: { token, service: duplicatedService } });
      if (res.ok) {
        toast.success(`Duplicated "${service.name}" as draft.`);
        fetchServices();
      } else {
        toast.error("Failed to duplicate service.");
      }
    } catch {
      toast.error("Error duplicating service.");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (!token) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const reordered = [...services];
    const moved = reordered[index];
    if (!moved) return;
    reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update local state immediately for snappy UX
    setServices(reordered);

    try {
      const orderedIds = reordered.map((s) => s.id);
      const res = await reorderCmsServicesFn({ data: { token, orderedIds } });
      if (res.ok) {
        toast.success("Display order updated.");
        setServices(res.services);
      }
    } catch {
      toast.error("Failed to persist order.");
      fetchServices();
    }
  };

  const publishedCount = services.filter((s) => s.status === "published").length;
  const draftCount = services.filter((s) => s.status === "draft").length;

  return (
    <AdminLayout
      title="Manage Services"
      actions={
        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20 hover:opacity-95"
          >
            <Link to="/admin/services/new">
              <Plus className="w-4 h-4 mr-1.5" /> Add New Service
            </Link>
          </Button>
        </div>
      }
    >
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-[#0B1437] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Services</p>
            <p className="text-2xl font-black text-white mt-1">{services.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1437] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live / Published</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{publishedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1437] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Drafts / Inactive</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{draftCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FileEdit className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1437] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Categories</p>
            <p className="text-2xl font-black text-[#FFD84A] mt-1">{categories.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#FFD84A]">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 p-4 rounded-2xl bg-[#0B1437] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name, slug, or keywords..."
            className="w-full pl-10 pr-4 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080F35] border border-white/10 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080F35] border border-white/10 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published (Live)</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-[#0B1437] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#080F35]/70 text-slate-400">
                <th className="py-4 px-4 font-semibold uppercase tracking-wider text-[10px] w-14 text-center">
                  Order
                </th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px]">Service Info</th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px]">Deliverables</th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="py-4 pr-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Loading services...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No services found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredServices.map((srv, idx) => (
                  <tr key={srv.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Order & Reordering buttons */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="w-7 h-7 rounded-lg bg-[#080F35] border border-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                          {String(srv.displayOrder || idx + 1).padStart(2, "0")}
                        </span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(idx, "up")}
                            disabled={idx === 0}
                            title="Move Up"
                            className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(idx, "down")}
                            disabled={idx === services.length - 1}
                            title="Move Down"
                            className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Service Name & Icon & Tagline */}
                    <td className="py-4 pr-4 max-w-md">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF941E]/20 to-[#FFD84A]/10 border border-[#FF941E]/30 flex items-center justify-center shrink-0">
                          {renderServiceIcon(srv.iconName || srv.icon)}
                        </div>
                        <div className="min-w-0">
                          <Link
                            to="/admin/services/$id"
                            params={{ id: srv.id }}
                            className="font-bold text-white hover:text-[#FF941E] transition-colors text-sm line-clamp-1"
                          >
                            {srv.name}
                          </Link>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{srv.tagline}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">/{srv.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0E1B5A] text-[#FFD84A] border border-white/5">
                        {srv.category}
                      </span>
                    </td>

                    {/* Deliverables count */}
                    <td className="py-4 pr-4 whitespace-nowrap text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold">{srv.deliverables?.length || 0} items</span>
                      </div>
                    </td>

                    {/* Status Pill with Toggle */}
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(srv.id, srv.status, srv.name)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          srv.status === "published"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                        }`}
                        title="Click to toggle status"
                      >
                        {srv.status === "published" ? "● Published" : "○ Draft"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 pr-4 text-right whitespace-nowrap space-x-1.5">
                      {/* Live Preview Button */}
                      <a
                        href={`/${srv.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        title="View Public Service Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>

                      {/* Edit Button */}
                      <Link
                        to="/admin/services/$id"
                        params={{ id: srv.id }}
                        className="inline-flex p-2 rounded-xl bg-white/5 border border-white/10 text-blue-300 hover:text-white hover:bg-blue-600/30 transition-colors"
                        title="Edit Service"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      {/* Duplicate Button */}
                      <button
                        type="button"
                        onClick={() => handleDuplicate(srv)}
                        className="inline-flex p-2 rounded-xl bg-white/5 border border-white/10 text-amber-300 hover:text-white hover:bg-amber-600/30 transition-colors"
                        title="Duplicate as Draft"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      {user?.role === "admin" && (
                        <button
                          type="button"
                          onClick={() => handleDelete(srv.id, srv.name)}
                          className="inline-flex p-2 rounded-xl bg-white/5 border border-white/10 text-rose-400 hover:text-white hover:bg-rose-600/40 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
