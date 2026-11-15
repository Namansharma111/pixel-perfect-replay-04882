import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { useAdminAuth } from "@/lib/cms/auth-context";
import { saveCmsRedirectFn, getCmsServicesFn } from "@/lib/cms/cms.functions";
import type { CMSService, ServiceDeliverable, ServiceProcessStep, ServiceFAQ } from "@/lib/cms/types";
import {
  Save,
  ArrowLeft,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  FileText,
  AlertTriangle,
  TrendingUp,
  Workflow,
  Copy,
  Check,
  Search,
  Target,
  Share2,
  Mail,
  Palette,
  Code2,
  MousePointerClick,
  Megaphone,
  Newspaper,
  Camera,
  BarChart3,
  Zap,
  Rocket,
  Globe,
  Shield,
  Award,
  Users,
  MessageSquare,
  ShoppingBag,
  Smartphone,
  Briefcase,
  Monitor,
  X,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

const AVAILABLE_ICONS = [
  { name: "Search", label: "Search / SEO", icon: Search },
  { name: "Target", label: "Target / Ads", icon: Target },
  { name: "Share2", label: "Share / Social", icon: Share2 },
  { name: "Mail", label: "Mail / Email", icon: Mail },
  { name: "Palette", label: "Palette / Branding", icon: Palette },
  { name: "Code2", label: "Code / Development", icon: Code2 },
  { name: "MousePointerClick", label: "Click / CRO", icon: MousePointerClick },
  { name: "Megaphone", label: "Megaphone / Local", icon: Megaphone },
  { name: "Newspaper", label: "Newspaper / PR", icon: Newspaper },
  { name: "Camera", label: "Camera / Media", icon: Camera },
  { name: "TrendingUp", label: "Trending / Growth", icon: TrendingUp },
  { name: "BarChart3", label: "Analytics", icon: BarChart3 },
  { name: "Zap", label: "Fast / Zap", icon: Zap },
  { name: "Sparkles", label: "AI / Sparkles", icon: Sparkles },
  { name: "Rocket", label: "Rocket / Scale", icon: Rocket },
  { name: "Globe", label: "Globe / Web", icon: Globe },
  { name: "Shield", label: "Shield / Security", icon: Shield },
  { name: "Award", label: "Award / Premium", icon: Award },
  { name: "Users", label: "Users / Audience", icon: Users },
  { name: "ShoppingBag", label: "E-Commerce", icon: ShoppingBag },
  { name: "Smartphone", label: "Mobile Apps", icon: Smartphone },
  { name: "Briefcase", label: "Briefcase / Business", icon: Briefcase },
];

const PRESET_CATEGORIES = [
  "SEO & Organic Search",
  "Performance Marketing",
  "Social Media Marketing",
  "Content Marketing",
  "Branding & Design",
  "Web & App Development",
  "Conversion Optimization (CRO)",
  "Local & Offline Advertising",
  "Public Relations (PR)",
  "Creative Media & Production",
];

interface ServiceEditorFormProps {
  initialService: CMSService;
  isNew?: boolean;
  onSave: (service: CMSService) => Promise<boolean | void>;
}

export function ServiceEditorForm({ initialService, isNew = false, onSave }: ServiceEditorFormProps) {
  const navigate = useNavigate();
  const { token } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<
    "basic" | "content" | "deliverables" | "benefits" | "process" | "whyus" | "faqs" | "related" | "seo"
  >("basic");

  // Basic Info state
  const [name, setName] = useState(initialService.name || "");
  const [shortName, setShortName] = useState(initialService.shortName || initialService.name || "");
  const [slug, setSlug] = useState(initialService.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(!isNew);
  const [heroEyebrow, setHeroEyebrow] = useState(
    initialService.heroEyebrow || "Digital Marketing Agency in Chandigarh",
  );
  const [h1, setH1] = useState(initialService.h1 || "");
  const [tagline, setTagline] = useState(initialService.tagline || "");
  const [heroIntro, setHeroIntro] = useState(initialService.heroIntro || "");
  const [icon, setIcon] = useState(initialService.iconName || initialService.icon || "Briefcase");
  const [category, setCategory] = useState(initialService.category || PRESET_CATEGORIES[0] || "SEO & Organic Search");
  const [displayOrder, setDisplayOrder] = useState<number>(initialService.displayOrder || 1);
  const [featuredImage, setFeaturedImage] = useState(
    initialService.featuredImage || "/src/assets/hero-bg.jpg",
  );
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialService.featuredImageAlt || "");
  const [status, setStatus] = useState<"published" | "draft">(initialService.status || "published");

  // Content HTML
  const [contentHtml, setContentHtml] = useState(
    initialService.contentHtml ||
      `<h2>Transforming Your Business Through Strategic Execution</h2><p>${initialService.heroIntro || "We deliver measurable impact for growing companies."}</p>`,
  );

  // Deliverables
  const [deliverables, setDeliverables] = useState<ServiceDeliverable[]>(
    initialService.deliverables && initialService.deliverables.length > 0
      ? initialService.deliverables
      : [
          { title: "Strategic Audit & Roadmap", description: "Comprehensive analysis of existing assets and competitors." },
          { title: "Execution & Optimization", description: "Full hands-on implementation by dedicated specialists." },
          { title: "Weekly Reporting & KPI Tracking", description: "Transparent visibility into metrics and conversions." },
        ],
  );

  // Problems & Benefits
  const [problems, setProblems] = useState<{ title: string; description: string }[]>(
    initialService.problems && initialService.problems.length > 0
      ? initialService.problems
      : [
          { title: "High ad spend without qualified leads", description: "Wasted budgets due to poor targeting and weak messaging." },
          { title: "Low organic visibility on search", description: "Competitors ranking for key revenue keywords." },
        ],
  );

  const [benefits, setBenefits] = useState<{ title: string; description: string }[]>(
    initialService.benefits && initialService.benefits.length > 0
      ? initialService.benefits
      : [
          { title: "Predictable Customer Acquisition", description: "Consistent inquiries and higher return on advertising spend." },
          { title: "Long-term Organic Compounding", description: "Growing asset that drives value month after month." },
        ],
  );

  // Who Needs / Target Profile
  const [whoNeedsHeading, setWhoNeedsHeading] = useState(
    initialService.whoNeeds?.heading || "Who Can Benefit From This Service",
  );
  const [whoNeedsItems, setWhoNeedsItems] = useState<string[]>(
    initialService.whoNeeds?.items && initialService.whoNeeds.items.length > 0
      ? initialService.whoNeeds.items
      : [
          "Growth-stage businesses scaling their customer base",
          "Established brands expanding into North India markets",
          "Companies seeking predictable, cost-effective leads",
        ],
  );

  // Process Steps
  const [processSteps, setProcessSteps] = useState<ServiceProcessStep[]>(
    initialService.process && initialService.process.length > 0
      ? initialService.process
      : [
          { step: "01", title: "Discovery & Audit", description: "We analyze your audience, current funnel, and market opportunities." },
          { step: "02", title: "Strategy Formulation", description: "We build a step-by-step roadmap aligned with commercial targets." },
          { step: "03", title: "Creative Execution", description: "We build assets, campaigns, pages, and tracking setups." },
          { step: "04", title: "Scale & Refine", description: "Continuous optimization based on conversion data and revenue." },
        ],
  );

  // Why Us points
  const [whyUs, setWhyUs] = useState<{ title: string; description: string }[]>(
    initialService.whyUs && initialService.whyUs.length > 0
      ? initialService.whyUs
      : [
          {
            title: "100% Transparent Reporting",
            description: "Direct Slack and WhatsApp communication with live dashboard visibility.",
          },
          {
            title: "Dedicated Specialists",
            description: "Experienced strategists and technical experts execute your campaigns.",
          },
          {
            title: "Outcome & ROI Driven",
            description: "Obsession with commercial pipeline and cost-per-lead, not vanity clicks.",
          },
        ],
  );

  // FAQs
  const [faqs, setFaqs] = useState<ServiceFAQ[]>(
    initialService.faqs && initialService.faqs.length > 0
      ? initialService.faqs
      : [
          {
            q: "How soon can we expect measurable results?",
            a: "Most clients see early indicators within 14–30 days, with substantial compounding growth typically occurring in months 2 and 3.",
          },
          {
            q: "Is there a long-term contract requirement?",
            a: "We offer flexible monthly retainers as well as project-based milestones without restrictive lock-ins.",
          },
        ],
  );

  // Related Services
  const [relatedSlugs, setRelatedSlugs] = useState<string[]>(initialService.relatedSlugs || []);
  const [allServicesList, setAllServicesList] = useState<{ id: string; name: string; slug: string }[]>([]);

  // SEO
  const [metaTitle, setMetaTitle] = useState(
    initialService.metaTitle || `${initialService.name || "Service"} | Social Waale Chandigarh`,
  );
  const [metaDescription, setMetaDescription] = useState(
    initialService.metaDescription || initialService.tagline || "",
  );
  const [focusKeyword, setFocusKeyword] = useState(
    initialService.focusKeyword || (initialService.name ? initialService.name.toLowerCase() : ""),
  );
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(
    initialService.secondaryKeywords || [],
  );
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState(
    initialService.canonicalUrl || (initialService.slug ? `https://socialwaale.com/${initialService.slug}` : "https://socialwaale.com"),
  );
  const [robots, setRobots] = useState<"index,follow" | "noindex,follow" | "noindex,nofollow">(
    initialService.robots || "index,follow",
  );
  const [ogTitle, setOgTitle] = useState(initialService.ogTitle || initialService.name || "");
  const [ogDescription, setOgDescription] = useState(
    initialService.ogDescription || initialService.tagline || "",
  );
  const [ogImage, setOgImage] = useState(
    initialService.ogImage || initialService.featuredImage || "/src/assets/hero-bg.jpg",
  );

  // 301 Redirect option
  const [create301Redirect, setCreate301Redirect] = useState(true);

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const [saving, setSaving] = useState(false);

  // Load all services for the related services picker
  useEffect(() => {
    getCmsServicesFn({ data: { token: token || undefined, includeDrafts: true } })
      .then((res) => {
        if (res.ok && res.services) {
          setAllServicesList(
            res.services
              .filter((s) => s.id !== initialService.id)
              .map((s) => ({ id: s.id, name: s.name, slug: s.slug })),
          );
        }
      })
      .catch(() => {});
  }, [initialService.id, token]);

  // Auto-slugify
  const handleNameChange = (val: string) => {
    setName(val);
    if (!shortName || shortName === name) {
      setShortName(val);
    }
    if (!isSlugManual) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(generated);
      if (!initialService.canonicalUrl) {
        setCanonicalUrl(`https://socialwaale.com/${generated}`);
      }
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManual(true);
    const cleaned = val
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(cleaned);
    setCanonicalUrl(`https://socialwaale.com/${cleaned}`);
  };

  // Deliverables handlers
  const handleAddDeliverable = () => {
    setDeliverables([...deliverables, { title: "", description: "" }]);
  };
  const handleRemoveDeliverable = (idx: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };
  const handleDeliverableChange = (idx: number, field: "title" | "description", val: string) => {
    const updated = [...deliverables];
    const item = updated[idx];
    if (item) {
      item[field] = val;
      setDeliverables(updated);
    }
  };

  // Problems handlers
  const handleAddProblem = () => {
    setProblems([...problems, { title: "", description: "" }]);
  };
  const handleRemoveProblem = (idx: number) => {
    setProblems(problems.filter((_, i) => i !== idx));
  };
  const handleProblemChange = (idx: number, field: "title" | "description", val: string) => {
    const updated = [...problems];
    const item = updated[idx];
    if (item) {
      item[field] = val;
      setProblems(updated);
    }
  };

  // Benefits handlers
  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "", description: "" }]);
  };
  const handleRemoveBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };
  const handleBenefitChange = (idx: number, field: "title" | "description", val: string) => {
    const updated = [...benefits];
    const item = updated[idx];
    if (item) {
      item[field] = val;
      setBenefits(updated);
    }
  };

  // Who Needs handlers
  const handleAddWhoNeedsItem = () => {
    setWhoNeedsItems([...whoNeedsItems, ""]);
  };
  const handleRemoveWhoNeedsItem = (idx: number) => {
    setWhoNeedsItems(whoNeedsItems.filter((_, i) => i !== idx));
  };
  const handleWhoNeedsItemChange = (idx: number, val: string) => {
    const updated = [...whoNeedsItems];
    updated[idx] = val;
    setWhoNeedsItems(updated);
  };

  // Process handlers
  const handleAddProcess = () => {
    const stepNum = String(processSteps.length + 1).padStart(2, "0");
    setProcessSteps([...processSteps, { step: stepNum, title: "", description: "" }]);
  };
  const handleRemoveProcess = (idx: number) => {
    setProcessSteps(processSteps.filter((_, i) => i !== idx));
  };
  const handleProcessChange = (idx: number, field: "step" | "title" | "description", val: string) => {
    const updated = [...processSteps];
    const item = updated[idx];
    if (item) {
      item[field] = val;
      setProcessSteps(updated);
    }
  };

  // Why Us handlers
  const handleAddWhyUs = () => {
    setWhyUs([...whyUs, { title: "", description: "" }]);
  };
  const handleRemoveWhyUs = (idx: number) => {
    setWhyUs(whyUs.filter((_, i) => i !== idx));
  };
  const handleWhyUsChange = (idx: number, field: "title" | "description", val: string) => {
    const updated = [...whyUs];
    const item = updated[idx];
    if (item) {
      item[field] = val;
      setWhyUs(updated);
    }
  };

  // FAQs handlers
  const handleAddFaq = () => {
    setFaqs([...faqs, { q: "", a: "" }]);
  };
  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };
  const handleFaqChange = (idx: number, field: "q" | "a", val: string) => {
    const updated = [...faqs];
    const item = updated[idx];
    if (item) {
      item[field] = val;
      setFaqs(updated);
    }
  };

  // Secondary keywords chips
  const handleAddKeyword = () => {
    if (newKeywordInput.trim() && !secondaryKeywords.includes(newKeywordInput.trim())) {
      setSecondaryKeywords([...secondaryKeywords, newKeywordInput.trim()]);
      setNewKeywordInput("");
    }
  };
  const handleRemoveKeyword = (kw: string) => {
    setSecondaryKeywords(secondaryKeywords.filter((k) => k !== kw));
  };

  // Related services toggle
  const toggleRelatedSlug = (targetSlug: string) => {
    if (relatedSlugs.includes(targetSlug)) {
      setRelatedSlugs(relatedSlugs.filter((s) => s !== targetSlug));
    } else {
      setRelatedSlugs([...relatedSlugs, targetSlug]);
    }
  };

  // SEO Score calculation
  const seoChecks = [
    {
      label: "SEO Title length (50–60 characters)",
      pass: metaTitle.trim().length >= 40 && metaTitle.trim().length <= 65,
      hint: `Current: ${metaTitle.trim().length} chars (Target: 50–60)`,
    },
    {
      label: "Meta Description length (140–160 characters)",
      pass: metaDescription.trim().length >= 120 && metaDescription.trim().length <= 165,
      hint: `Current: ${metaDescription.trim().length} chars (Target: 140–160)`,
    },
    {
      label: "Main H1 Heading is defined",
      pass: h1.trim().length > 0,
      hint: h1.trim() ? "H1 set" : "Missing H1",
    },
    {
      label: "Focus Keyword is configured",
      pass: focusKeyword.trim().length > 0,
      hint: focusKeyword.trim() ? `"${focusKeyword.trim()}"` : "Add primary keyword",
    },
    {
      label: "Focus Keyword in H1",
      pass: Boolean(focusKeyword.trim() && h1.toLowerCase().includes(focusKeyword.toLowerCase().trim())),
      hint: "Helps search engines identify primary topic",
    },
    {
      label: "Focus Keyword in SEO Title",
      pass: Boolean(focusKeyword.trim() && metaTitle.toLowerCase().includes(focusKeyword.toLowerCase().trim())),
      hint: "Critical on-page ranking signal",
    },
    {
      label: "Focus Keyword in Meta Description",
      pass: Boolean(focusKeyword.trim() && metaDescription.toLowerCase().includes(focusKeyword.toLowerCase().trim())),
      hint: "Increases search result CTR",
    },
    {
      label: "Featured Image with Alt Text",
      pass: featuredImageAlt.trim().length > 0,
      hint: featuredImageAlt.trim() ? "Descriptive alt text set" : "Add image alt text",
    },
    {
      label: "Deliverables / Service Scope defined (at least 3)",
      pass: deliverables.filter((d) => d.title.trim()).length >= 3,
      hint: `${deliverables.filter((d) => d.title.trim()).length} deliverables`,
    },
    {
      label: "Client FAQs defined (at least 2)",
      pass: faqs.filter((f) => f.q.trim()).length >= 2,
      hint: "Eligible for Google FAQ Schema",
    },
    {
      label: "Search Engine Indexing Enabled",
      pass: robots === "index,follow",
      hint: robots,
    },
  ];

  const passedChecksCount = seoChecks.filter((c) => c.pass).length;
  const seoPercentage = Math.round((passedChecksCount / seoChecks.length) * 100);

  // Save handler
  const handleSave = async (forceStatus?: "published" | "draft") => {
    if (!name.trim()) {
      toast.error("Please enter a service name.");
      setActiveTab("basic");
      return;
    }
    if (!slug.trim()) {
      toast.error("Please enter a valid URL slug.");
      setActiveTab("basic");
      return;
    }

    const currentStatus = forceStatus || status;

    // Check if slug changed on an existing published service
    const isSlugChanged = !isNew && initialService.slug && initialService.slug !== slug.trim();

    const payload: CMSService = {
      id: initialService.id || `srv-${Date.now()}`,
      slug: slug.trim(),
      name: name.trim(),
      shortName: shortName.trim() || name.trim(),
      tagline: tagline.trim() || name.trim(),
      heroEyebrow: heroEyebrow.trim() || `${name} agency in Chandigarh`,
      h1: h1.trim() || name.trim(),
      heroIntro: heroIntro.trim() || tagline.trim(),
      iconName: icon || "Briefcase",
      icon: icon || "Briefcase",
      category: category.trim(),
      displayOrder: Number(displayOrder) || 1,
      featuredImage: featuredImage.trim(),
      featuredImageAlt: featuredImageAlt.trim() || name.trim(),
      status: currentStatus,
      updatedAt: new Date().toISOString(),
      contentHtml: contentHtml,
      deliverables: deliverables.filter((d) => d.title.trim()),
      problems: problems.filter((p) => p.title.trim()),
      benefits: benefits.filter((b) => b.title.trim()),
      process: processSteps.filter((p) => p.title.trim()),
      whyUs: whyUs.filter((w) => w.title.trim()),
      whoNeeds: {
        heading: whoNeedsHeading.trim() || "Who Can Benefit From This Service",
        items: whoNeedsItems.filter((i) => i.trim()),
      },
      faqs: faqs.filter((f) => f.q.trim()),
      relatedSlugs: relatedSlugs,
      metaTitle: metaTitle.trim() || `${name} | Social Waale`,
      metaDescription: metaDescription.trim() || tagline || heroIntro,
      ...(focusKeyword.trim() ? { focusKeyword: focusKeyword.trim() } : {}),
      ...(secondaryKeywords.length > 0 ? { secondaryKeywords } : {}),
      canonicalUrl: canonicalUrl.trim() || `https://socialwaale.com/${slug.trim()}`,
      robots: robots,
      ogTitle: ogTitle.trim() || name.trim(),
      ogDescription: ogDescription.trim() || metaDescription.trim() || tagline.trim(),
      ogImage: ogImage.trim() || featuredImage.trim(),
    };

    setSaving(true);
    try {
      // 1. Auto create 301 redirect if slug changed and option checked
      if (isSlugChanged && create301Redirect && token) {
        try {
          await saveCmsRedirectFn({
            data: {
              token,
              redirect: {
                id: `redir-${Date.now()}`,
                fromPath: `/${initialService.slug}`,
                toPath: `/${slug.trim()}`,
                statusCode: 301,
                createdAt: new Date().toISOString(),
                hits: 0,
              },
            },
          });
          toast.info(`Created 301 redirect: /${initialService.slug} → /${slug.trim()}`);
        } catch (redirErr) {
          console.error("Failed to auto-create redirect:", redirErr);
        }
      }

      const res = await onSave(payload);
      if (res !== false) {
        toast.success(
          isNew
            ? `Service "${name}" created successfully!`
            : `Service "${name}" updated successfully!`,
        );
        if (isNew) {
          navigate({ to: "/admin/services" });
        }
      } else {
        toast.error("Failed to save service. Check server permissions.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving service.");
    } finally {
      setSaving(false);
    }
  };

  const CurrentIconComp = (LucideIcons as any)[icon] || Briefcase;

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0B1437] border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-xl border border-white/10 text-slate-300 hover:text-white"
          >
            <Link to="/admin/services">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Services
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-[#FFD84A]">
                /{slug || "slug"}
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  status === "published"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {status}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white mt-1 line-clamp-1">
              {name || "Untitled Service"}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Preview Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreviewModal(true)}
            className="rounded-xl border-white/10 text-slate-200 hover:text-white hover:bg-white/10"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Preview Page
          </Button>

          {/* View Live URL if published */}
          {!isNew && slug && (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Live URL
            </a>
          )}

          {/* Save Draft */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="rounded-xl border-white/10 text-xs text-amber-300 hover:bg-amber-500/10"
          >
            Save Draft
          </Button>

          {/* Publish / Update Button */}
          <Button
            type="button"
            size="sm"
            disabled={saving}
            onClick={() => handleSave(status)}
            className="rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md shadow-orange-500/20 hover:opacity-95"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? "Saving..." : status === "published" ? "Publish / Update" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Slug Change 301 Redirect Alert */}
      {!isNew && initialService.slug && initialService.slug !== slug.trim() && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">URL Slug Changed</p>
            <p>
              You changed the URL from <code className="bg-black/30 px-1 py-0.5 rounded font-mono">/{initialService.slug}</code> to{" "}
              <code className="bg-black/30 px-1 py-0.5 rounded font-mono">/{slug}</code>.
            </p>
            <label className="flex items-center gap-2 pt-1 font-semibold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={create301Redirect}
                onChange={(e) => setCreate301Redirect(e.target.checked)}
                className="rounded border-amber-400 text-amber-500 focus:ring-0"
              />
              Automatically create 301 Redirect to preserve search ranking & avoid 404 errors
            </label>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 text-xs font-semibold">
        {[
          { key: "basic", label: "Basic Info & URL", icon: FileText },
          { key: "content", label: "Article Content", icon: FileText },
          { key: "deliverables", label: `Deliverables (${deliverables.length})`, icon: Layers },
          { key: "benefits", label: "Outcomes & Audience", icon: TrendingUp },
          { key: "process", label: `Lifecycle (${processSteps.length})`, icon: Workflow },
          { key: "whyus", label: `Why Us (${whyUs.length})`, icon: Award },
          { key: "faqs", label: `FAQs (${faqs.length})`, icon: HelpCircle },
          { key: "related", label: `Related Services (${relatedSlugs.length})`, icon: Sparkles },
          { key: "seo", label: `SEO & Schema (${seoPercentage}%)`, icon: Search },
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
      {/* TAB 1: BASIC INFO & URL                                        */}
      {/* ============================================================== */}
      {activeTab === "basic" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Core Names */}
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                Service Identity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Service Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. SEO Services Chandigarh"
                    className="w-full px-4 py-2.5 bg-[#080F35] border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Short Menu / Card Name
                  </label>
                  <input
                    type="text"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="e.g. SEO & Organic"
                    className="w-full px-4 py-2.5 bg-[#080F35] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                  />
                </div>
              </div>

              {/* URL Slug Management */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Page URL / Slug *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center flex-grow px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs font-mono text-slate-300">
                    <span className="text-slate-500">socialwaale.com/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="service-url-slug"
                      className="flex-grow bg-transparent text-[#FFD84A] font-bold focus:outline-none ml-0.5"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsSlugManual(false);
                      const generated = name
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, "")
                        .trim()
                        .replace(/\s+/g, "-");
                      setSlug(generated);
                    }}
                    className="rounded-xl border-white/10 text-xs text-slate-300 shrink-0"
                    title="Auto-generate slug from service name"
                  >
                    Reset
                  </Button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Preview URL: <span className="text-emerald-400 font-mono">https://socialwaale.com/{slug || "..."}</span>
                </p>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Service Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Sustainable Google rankings that compound monthly revenue."
                  className="w-full px-4 py-2.5 bg-[#080F35] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>
            </div>

            {/* Hero Section Copy */}
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                Hero Banner Content
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Hero Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={heroEyebrow}
                  onChange={(e) => setHeroEyebrow(e.target.value)}
                  placeholder="e.g. Digital Marketing Agency in Chandigarh"
                  className="w-full px-4 py-2.5 bg-[#080F35] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Main H1 Heading *
                </label>
                <input
                  type="text"
                  value={h1}
                  onChange={(e) => setH1(e.target.value)}
                  placeholder="e.g. SEO Services in Chandigarh That Grow Pipeline & Revenue"
                  className="w-full px-4 py-2.5 bg-[#080F35] border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Hero Introduction Paragraph
                </label>
                <textarea
                  rows={3}
                  value={heroIntro}
                  onChange={(e) => setHeroIntro(e.target.value)}
                  placeholder="Compelling opening statement explaining how this service solves the client's biggest growth challenge."
                  className="w-full px-4 py-2.5 bg-[#080F35] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings (Status, Order, Category, Image) */}
          <div className="space-y-6">
            {/* Status & Display Order */}
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                Publishing Controls
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Publication Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("published")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      status === "published"
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                        : "bg-[#080F35] border border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    ● Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("draft")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      status === "draft"
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "bg-[#080F35] border border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    ○ Draft
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Display Order / Priority
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>
            </div>

            {/* Icon Picker */}
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                  Service Icon
                </h2>
                <span className="text-xs font-mono text-slate-400">{icon}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {AVAILABLE_ICONS.map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected = icon === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setIcon(item.name)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? "bg-[#FF941E] text-[#080F35] border-[#FF941E] shadow-md"
                          : "bg-[#080F35] border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                      }`}
                      title={item.label}
                    >
                      <ItemIcon className="w-4 h-4" />
                      <span className="text-[9px] truncate w-full text-center">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured Image */}
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                Banner Image & Alt
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="/src/assets/hero-bg.jpg"
                  className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Image Alt Text (SEO) *
                </label>
                <input
                  type="text"
                  value={featuredImageAlt}
                  onChange={(e) => setFeaturedImageAlt(e.target.value)}
                  placeholder="e.g. Social Waale SEO team analyzing search rankings in Chandigarh"
                  className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: RICH TEXT CONTENT EDITOR                                */}
      {/* ============================================================== */}
      {activeTab === "content" && (
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white">Full Service Page Article / Guide</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Use the TipTap rich-text editor below to format headings, detailed content, lists, and images.
              </p>
            </div>
          </div>
          <div className="bg-[#080F35] rounded-2xl border border-white/10 overflow-hidden">
            <TipTapEditor content={contentHtml} onChange={setContentHtml} />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: DELIVERABLES BUILDER                                    */}
      {/* ============================================================== */}
      {activeTab === "deliverables" && (
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white">
                What’s Included (Deliverables & Scope)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                These cards appear in Section 3 ("What Our Service Delivers") with icons and checkmarks.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddDeliverable}
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Deliverable
            </Button>
          </div>

          <div className="space-y-3">
            {deliverables.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#080F35] border border-white/10 flex items-start gap-4"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  {idx + 1}
                </div>
                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleDeliverableChange(idx, "title", e.target.value)}
                    placeholder="Deliverable Title (e.g. Technical SEO & Architecture Audit)"
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                  />
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleDeliverableChange(idx, "description", e.target.value)}
                    placeholder="Detailed explanation of what the client receives..."
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDeliverable(idx)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: OUTCOMES & TARGET AUDIENCE                              */}
      {/* ============================================================== */}
      {activeTab === "benefits" && (
        <div className="space-y-6">
          {/* Pain Points / Problems */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Client Pain Points We Solve
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  The commercial bottlenecks your prospective clients struggle with before hiring you.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleAddProblem}
                size="sm"
                variant="outline"
                className="rounded-xl border-white/10 text-xs text-slate-200"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Pain Point
              </Button>
            </div>

            <div className="space-y-3">
              {problems.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#080F35] border border-white/10 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    !
                  </span>
                  <div className="flex-grow space-y-1.5">
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => handleProblemChange(idx, "title", e.target.value)}
                      placeholder="Problem summary (e.g. Stagnant traffic with zero inbound leads)"
                      className="w-full px-3 py-1 bg-[#0B1437] border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                    <textarea
                      rows={1}
                      value={p.description}
                      onChange={(e) => handleProblemChange(idx, "description", e.target.value)}
                      placeholder="Why this hurts the business..."
                      className="w-full px-3 py-1 bg-[#0B1437] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProblem(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Key Benefits & Business Impact
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  The positive transformational outcomes of this service.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleAddBenefit}
                size="sm"
                variant="outline"
                className="rounded-xl border-white/10 text-xs text-slate-200"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Benefit
              </Button>
            </div>

            <div className="space-y-3">
              {benefits.map((b, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#080F35] border border-white/10 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    ✓
                  </span>
                  <div className="flex-grow space-y-1.5">
                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => handleBenefitChange(idx, "title", e.target.value)}
                      placeholder="Benefit title (e.g. 3x Higher Conversion Velocity)"
                      className="w-full px-3 py-1 bg-[#0B1437] border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                    <textarea
                      rows={1}
                      value={b.description}
                      onChange={(e) => handleBenefitChange(idx, "description", e.target.value)}
                      placeholder="How this helps them scale..."
                      className="w-full px-3 py-1 bg-[#0B1437] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Target Profile / Who Needs */}
          <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" /> Target Profile & Who Needs This
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Renders the "Who Can Benefit" section on the service page.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleAddWhoNeedsItem}
                size="sm"
                variant="outline"
                className="rounded-xl border-white/10 text-xs text-slate-200"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Sector
              </Button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Section Heading</label>
              <input
                type="text"
                value={whoNeedsHeading}
                onChange={(e) => setWhoNeedsHeading(e.target.value)}
                placeholder="e.g. Who Can Benefit From Our SEO Services"
                className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <div className="space-y-2">
              {whoNeedsItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleWhoNeedsItemChange(idx, e.target.value)}
                    placeholder="e.g. Manufacturing & B2B brands looking for enterprise RFQs"
                    className="flex-grow px-3 py-1.5 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveWhoNeedsItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: PROCESS & METHODOLOGY                                   */}
      {/* ============================================================== */}
      {activeTab === "process" && (
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Structured Execution Lifecycle
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The numbered roadmap phases shown on the service page.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddProcess}
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Phase
            </Button>
          </div>

          <div className="space-y-3">
            {processSteps.map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#080F35] border border-white/10 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-sm flex items-center justify-center shrink-0 mt-1">
                  {p.step || String(idx + 1).padStart(2, "0")}
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={p.step || String(idx + 1).padStart(2, "0")}
                      onChange={(e) => handleProcessChange(idx, "step", e.target.value)}
                      placeholder="01"
                      className="w-16 px-2.5 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs font-mono font-bold text-[#FFD84A] text-center"
                    />
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => handleProcessChange(idx, "title", e.target.value)}
                      placeholder="Phase Title (e.g. Discovery & Technical Audit)"
                      className="flex-grow px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={p.description}
                    onChange={(e) => handleProcessChange(idx, "description", e.target.value)}
                    placeholder="Milestones, checkpoints, and execution actions in this phase..."
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProcess(idx)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: WHY US ADVANTAGES                                       */}
      {/* ============================================================== */}
      {activeTab === "whyus" && (
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FFD84A]" /> The Social Waale Advantage (Why Choose Us)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Key differentiators that convince clients to partner with Social Waale over other agencies.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddWhyUs}
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Advantage
            </Button>
          </div>

          <div className="space-y-3">
            {whyUs.map((w, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#080F35] border border-white/10 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-white/10 text-[#FFD84A] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  ✓
                </div>
                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    value={w.title}
                    onChange={(e) => handleWhyUsChange(idx, "title", e.target.value)}
                    placeholder="Advantage Title (e.g. 100% Client Ownership of Data & Accounts)"
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FFD84A]"
                  />
                  <textarea
                    rows={2}
                    value={w.description}
                    onChange={(e) => handleWhyUsChange(idx, "description", e.target.value)}
                    placeholder="Describe how this protects the client's interests and accelerates ROI..."
                    className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FFD84A]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveWhyUs(idx)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: FAQS BUILDER                                            */}
      {/* ============================================================== */}
      {activeTab === "faqs" && (
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Answer high-intent customer questions. These are also automatically included in the Google FAQPage schema.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddFaq}
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs shadow-md"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ
            </Button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#080F35] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#FFD84A] uppercase tracking-wider">
                    Question {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.q}
                  onChange={(e) => handleFaqChange(idx, "q", e.target.value)}
                  placeholder="e.g. How soon can we expect measurable results?"
                  className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
                <textarea
                  rows={2}
                  value={faq.a}
                  onChange={(e) => handleFaqChange(idx, "a", e.target.value)}
                  placeholder="Detailed, transparent answer explaining your approach..."
                  className="w-full px-3 py-1.5 bg-[#0B1437] border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 8: RELATED SERVICES CROSS-LINKING                          */}
      {/* ============================================================== */}
      {activeTab === "related" && (
        <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-5">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF941E]" /> Cross-link Related Services
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select which complimentary services to promote at the bottom of this page to increase page views and internal link authority.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allServicesList.map((srv) => {
              const isChecked = relatedSlugs.includes(srv.slug);
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => toggleRelatedSlug(srv.slug)}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    isChecked
                      ? "bg-gradient-to-tr from-[#FF941E]/20 to-[#FFD84A]/10 border-[#FF941E] text-white"
                      : "bg-[#080F35] border-white/10 text-slate-400 hover:text-white hover:border-white/25"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold mt-0.5 shrink-0 ${
                      isChecked ? "bg-[#FF941E] text-[#080F35]" : "border border-white/20"
                    }`}
                  >
                    {isChecked ? "✓" : ""}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-white">{srv.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">/{srv.slug}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 9: SEO & SCHEMA MANAGEMENT                                 */}
      {/* ============================================================== */}
      {activeTab === "seo" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main SEO Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* SERP Snippet Preview */}
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                Google SERP Snippet Preview
              </h2>
              <div className="p-4 rounded-2xl bg-[#080F35] border border-white/10 font-sans max-w-2xl space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>socialwaale.com › {slug || "service-slug"}</span>
                </div>
                <p className="text-base font-bold text-blue-400 hover:underline cursor-pointer line-clamp-1">
                  {metaTitle || `${name || "Service Name"} | Social Waale`}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {metaDescription || tagline || heroIntro || "High-impact digital marketing service in Chandigarh."}
                </p>
              </div>
            </div>

            {/* Title & Description */}
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                Meta Tags & Target Keywords
              </h2>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">SEO Meta Title *</label>
                  <span
                    className={`text-[10px] font-mono ${
                      metaTitle.length >= 40 && metaTitle.length <= 65
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {metaTitle.length} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="e.g. SEO Services in Chandigarh | Social Waale"
                  className="w-full px-4 py-2.5 bg-[#080F35] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">SEO Meta Description *</label>
                  <span
                    className={`text-[10px] font-mono ${
                      metaDescription.length >= 120 && metaDescription.length <= 165
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {metaDescription.length} / 155 characters
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="High-intent description to maximize organic click-through rates from Google search."
                  className="w-full px-4 py-2.5 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>

              {/* Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Focus Keyword
                  </label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="e.g. seo services chandigarh"
                    className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Search Engine Robots
                  </label>
                  <select
                    value={robots}
                    onChange={(e) => setRobots(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                  >
                    <option value="index,follow">index, follow (Default / Public)</option>
                    <option value="noindex,follow">noindex, follow</option>
                    <option value="noindex,nofollow">noindex, nofollow</option>
                  </select>
                </div>
              </div>

              {/* Secondary Keywords */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Secondary Keywords
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Type keyword and press Enter or Add..."
                    className="flex-grow px-3 py-1.5 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF941E]"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddKeyword}
                    className="rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {secondaryKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-200"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-slate-400 hover:text-rose-400 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://socialwaale.com/seo-services"
                  className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>
            </div>

            {/* Social Sharing / Open Graph */}
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                Open Graph / Social Sharing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder={name}
                    className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    OG Image URL
                  </label>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="/src/assets/hero-bg.jpg"
                    className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  OG Description
                </label>
                <textarea
                  rows={2}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder={tagline}
                  className="w-full px-3 py-2 bg-[#080F35] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#FF941E]"
                />
              </div>
            </div>
          </div>

          {/* Real-time SEO Validation Checklist */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0B1437] border border-white/10 space-y-4 sticky top-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD84A]">
                  SEO Audit Checklist
                </h2>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    seoPercentage >= 80
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : seoPercentage >= 50
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {seoPercentage}% Score
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
                <span>Structured data (Service + FAQPage Schema) is automatically compiled.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* LIVE PREVIEW MODAL                                             */}
      {/* ============================================================== */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          {/* Modal Header */}
          <div className="p-4 bg-[#080F35] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFD84A]">
                Live Page Preview
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                https://socialwaale.com/{slug || "preview"}
              </span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#0B1437] p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
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
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
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
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body Preview Content */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-8 flex justify-center bg-[#060B28]">
            <div
              className={`bg-[#080F35] text-white rounded-3xl border border-white/15 overflow-hidden shadow-2xl transition-all duration-300 ${
                previewDevice === "mobile"
                  ? "w-[375px] max-w-[375px] min-h-[700px]"
                  : "w-full max-w-5xl"
              }`}
            >
              {/* Simulated Hero Section */}
              <div className="p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#0E1B5A] to-[#080F35] border-b border-white/10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#FFD84A] border border-white/15 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#FF941E]" />
                  {heroEyebrow || "Digital Marketing Agency in Chandigarh"}
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {h1 || name || "Service Page Title"}
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  {heroIntro || tagline || "We deliver measurable impact for growing businesses."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-extrabold text-xs uppercase tracking-wider shadow-md">
                    Get a Free Consultation →
                  </div>
                </div>
              </div>

              {/* Simulated Deliverables Section */}
              <div className="p-8 sm:p-12 bg-white text-[#080F35]">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
                  COMPREHENSIVE CAPABILITIES
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#080F35] mt-1 mb-6">
                  What Our {shortName || name} Service Delivers
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {deliverables.slice(0, 6).map((d, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-200">
                      <span className="text-lg font-black text-slate-300">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="font-bold text-sm text-[#080F35] mt-1">{d.title || "Deliverable Title"}</h3>
                      <p className="text-xs text-slate-600 mt-1">{d.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Process Section */}
              <div className="p-8 sm:p-12 bg-[#F7F8FC] text-[#080F35] border-t border-slate-200">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
                  PROVEN DELIVERY LIFECYCLE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#080F35] mt-1 mb-6">
                  Our Structured {processSteps.length}-Stage Process
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {processSteps.map((p, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      <h3 className="font-bold text-xs text-[#080F35] mt-2">{p.title}</h3>
                      <p className="text-[11px] text-slate-600 mt-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated FAQs Section */}
              <div className="p-8 sm:p-12 bg-white text-[#080F35] border-t border-slate-200">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF941E]">
                  COMMERCIAL FAQ
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#080F35] mt-1 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {faqs.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#F7F8FC] border border-slate-200">
                      <p className="font-bold text-xs text-[#080F35]">{f.q || "Question?"}</p>
                      <p className="text-xs text-slate-600 mt-1">{f.a || "Answer details..."}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
