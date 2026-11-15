import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/cms/auth-context";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Tag,
  Users,
  Image as ImageIcon,
  Compass,
  ArrowRightLeft,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Briefcase,
  LayoutTemplate,
  Download,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({ children, title, actions }: AdminLayoutProps) {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Homepage Management", to: "/admin/homepage", icon: LayoutTemplate },
    { label: "Manage Services", to: "/admin/services", icon: Briefcase },
    { label: "Tools Management", to: "/admin/downloader", icon: Download },
    { label: "All Articles", to: "/admin/articles", icon: FileText },
    { label: "Add New Article", to: "/admin/articles/new", icon: PlusCircle },
    { label: "Categories", to: "/admin/categories", icon: FolderTree },
    { label: "Tags", to: "/admin/tags", icon: Tag },
    { label: "Authors", to: "/admin/authors", icon: Users },
    { label: "Media Library", to: "/admin/media", icon: ImageIcon },
    { label: "Technical SEO", to: "/admin/seo", icon: Compass },
    { label: "301 Redirects", to: "/admin/redirects", icon: ArrowRightLeft },
    { label: "Analytics & GSC", to: "/admin/analytics", icon: BarChart3 },
    { label: "CMS Settings", to: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-[#080F35] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#080F35] border-b border-white/10 sticky top-0 z-40">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black flex items-center justify-center text-sm shadow-md">
            SW
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">Social Waale CMS</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop & Mobile Sidebar */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#0B1437] border-r border-white/10 flex-shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-30 flex flex-col justify-between`}
      >
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-black flex items-center justify-center text-sm shadow-lg shadow-orange-500/20">
                SW
              </div>
              <div>
                <p className="font-black text-sm tracking-tight text-white leading-tight">
                  SOCIAL WAALE
                </p>
                <p className="text-[10px] font-bold text-[#FFD84A] uppercase tracking-wider">
                  Admin CMS Panel
                </p>
              </div>
            </Link>
          </div>

          {/* User Profile Mini Bar */}
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0E1B5A] border border-white/15 text-[#FFD84A] flex items-center justify-center font-bold text-xs">
              {user?.name?.[0] || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || "Administrator"}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#FF941E] uppercase">
                <ShieldCheck className="w-3 h-3" /> {user?.role || "admin"}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF941E] to-[#FFD84A] text-[#080F35] font-bold shadow-md shadow-orange-500/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#080F35]" : "text-slate-400"}`} />
                  <span className="flex-grow">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#080F35]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions in Sidebar */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/services"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-[#FF941E]" /> View Live Services
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href="/articles"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD84A]" /> View Live Blog
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 bg-[#080F35] overflow-y-auto">
        {/* Top Header if title provided */}
        {title && (
          <header className="p-6 lg:px-8 border-b border-white/10 bg-[#0B1437]/50 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h1>
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </header>
        )}

        <div className="p-6 lg:p-8 flex-grow">{children}</div>
      </main>
    </div>
  );
}
