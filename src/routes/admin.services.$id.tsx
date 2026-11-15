import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ServiceEditorForm } from "@/components/admin/ServiceEditorForm";
import { getCmsServiceByIdFn, saveCmsServiceFn, deleteCmsServiceFn } from "@/lib/cms/cms.functions";
import type { CMSService } from "@/lib/cms/types";
import { Trash2, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/services/$id")({
  component: EditServicePageWrapper,
});

function EditServicePageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <EditServicePage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function EditServicePage() {
  const { id } = Route.useParams();
  const { token, user } = useAdminAuth();
  const navigate = useNavigate();

  const [service, setService] = useState<CMSService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCmsServiceByIdFn({ data: { id } })
      .then((res) => {
        if (res.ok && res.service) {
          setService(res.service);
        } else {
          toast.error("Service not found");
          navigate({ to: "/admin/services" });
        }
      })
      .catch((err) => {
        console.error("Error loading service:", err);
        toast.error("Failed to load service");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (updatedService: CMSService) => {
    if (!token) return false;
    const res = await saveCmsServiceFn({ data: { token, service: updatedService } });
    if (res.ok) {
      setService(res.service);
      return true;
    }
    return false;
  };

  const handleDelete = async () => {
    if (!token || !service) return;
    if (!window.confirm(`Permanently delete "${service.name}"? This cannot be undone.`)) return;
    const res = await deleteCmsServiceFn({ data: { token, id: service.id } });
    if (res.ok) {
      toast.success("Service deleted.");
      navigate({ to: "/admin/services" });
    } else {
      toast.error("Failed to delete service.");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Service">
        <div className="p-12 text-center text-slate-400">Loading service details...</div>
      </AdminLayout>
    );
  }

  if (!service) {
    return (
      <AdminLayout title="Service Not Found">
        <div className="p-12 text-center text-slate-400">
          <p>The requested service could not be found.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link to="/admin/services">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Edit Service: ${service.name}`}
      actions={
        <div className="flex items-center gap-2">
          <a
            href={`/${service.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Page
          </a>

          {user?.role === "admin" && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
        </div>
      }
    >
      <ServiceEditorForm initialService={service} isNew={false} onSave={handleSave} />
    </AdminLayout>
  );
}
