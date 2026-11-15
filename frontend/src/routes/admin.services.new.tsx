import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminAuthProvider, RequireAdminAuth, useAdminAuth } from "@/lib/cms/auth-context";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ServiceEditorForm } from "@/components/admin/ServiceEditorForm";
import { saveCmsServiceFn } from "@/lib/cms/cms.functions";
import type { CMSService } from "@/lib/cms/types";

export const Route = createFileRoute("/admin/services/new")({
  component: NewServicePageWrapper,
});

function NewServicePageWrapper() {
  return (
    <AdminAuthProvider>
      <RequireAdminAuth>
        <NewServicePage />
      </RequireAdminAuth>
    </AdminAuthProvider>
  );
}

function NewServicePage() {
  const { token } = useAdminAuth();

  const emptyService: CMSService = {
    id: `srv-${Date.now()}`,
    slug: "",
    name: "",
    shortName: "",
    tagline: "",
    heroEyebrow: "Digital Marketing Agency in Chandigarh",
    h1: "",
    heroIntro: "",
    iconName: "Briefcase",
    icon: "Briefcase",
    category: "SEO & Organic Search",
    displayOrder: 11,
    featuredImage: "/src/assets/hero-bg.jpg",
    featuredImageAlt: "",
    status: "published",
    updatedAt: new Date().toISOString(),
    contentHtml: "<p>We build conversion-focused digital systems that grow your business.</p>",
    deliverables: [],
    problems: [],
    benefits: [],
    process: [],
    whyUs: [],
    whoNeeds: { heading: "Who Needs This Service", items: [] },
    faqs: [],
    relatedSlugs: [],
    metaTitle: "",
    metaDescription: "",
  };

  const handleSave = async (service: CMSService) => {
    if (!token) return false;
    const res = await saveCmsServiceFn({ data: { token, service } });
    return res.ok;
  };

  return (
    <AdminLayout title="Add New Service">
      <ServiceEditorForm initialService={emptyService} isNew={true} onSave={handleSave} />
    </AdminLayout>
  );
}
