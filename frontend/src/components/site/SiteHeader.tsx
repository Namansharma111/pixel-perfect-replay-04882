import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Phone, X, ArrowRight, Video, Sparkles } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { SERVICE_ICONS } from "./service-icons";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
] as const;

export const TOOLS_NAV_ITEMS = [
  {
    name: "Instagram Video Downloader",
    to: "/instagram-video-downloader" as const,
    tagline: "Save high-definition MP4 videos directly without watermarks",
    icon: Video,
    badge: "Popular",
  },
] as const;

const NAV_AFTER = [
  { to: "/articles", label: "Articles" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

const linkCls =
  "relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const [mobileTools, setMobileTools] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass border-x-0 border-t-0" : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}

          <div className="group relative">
            <Link to="/services" className={cn(linkCls, "inline-flex items-center gap-1")}>
              Services{" "}
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[760px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div
                className="glass grid grid-cols-2 gap-1 rounded-3xl p-3 shadow-card"
                style={{
                  background: "#000000ff",
                  borderRadius: "28px",
                }}
              >
                {services.map((s) => {
                  const Icon = SERVICE_ICONS[s.slug];
                  return (
                    <Link
                      key={s.slug}
                      to={`/${s.slug}`}
                      className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-accent"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">
                          {s.name}
                        </span>
                        <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                          {s.tagline}
                        </span>
                      </span>
                    </Link>
                  );
                })}
                <Link
                  to="/services"
                  className="col-span-2 mt-1 flex items-center justify-center gap-2 rounded-2xl border border-border p-3 text-sm font-semibold text-primary hover:bg-accent"
                >
                  View all services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Tools Dropdown */}
          <div className="group relative">
            <button
              type="button"
              className={cn(linkCls, "inline-flex items-center gap-1 cursor-pointer")}
              aria-haspopup="true"
            >
              Tools{" "}
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full w-[380px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div
                className="glass rounded-3xl p-3 shadow-card space-y-1"
                style={{
                  background: "#080F35",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FFD84A]">
                  Free Social Media Tools
                </div>
                {TOOLS_NAV_ITEMS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-white/10 group/item"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-[#FF941E] to-[#FFD84A] text-[#080F35] font-bold shadow-md">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="block text-sm font-bold text-white group-hover/item:text-[#FFD84A] transition-colors">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <span className="mt-0.5 line-clamp-1 block text-xs text-slate-300">
                          {tool.tagline}
                        </span>
                      </div>
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-white/10">
                  <Link
                    to="/instagram-downloader"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#FFD84A] hover:bg-white/5 transition"
                  >
                    <span>View all Instagram tools</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {NAV_AFTER.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SITE.phoneHref}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary xl:inline-flex"
          >
            <Phone className="h-4 w-4 text-primary" /> {SITE.phone}
          </a>
          <Button asChild variant="hero" size="lg" className="hidden sm:inline-flex">
            <Link to="/contact">Get Started</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-foreground lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-background/98 px-5 pb-10 pt-4 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={close}
                className="rounded-2xl px-4 py-3 text-lg font-semibold hover:bg-accent"
              >
                {n.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setMobileServices((v) => !v)}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-left text-lg font-semibold hover:bg-accent"
              aria-expanded={mobileServices}
            >
              Services
              <ChevronDown
                className={cn("h-5 w-5 transition-transform", mobileServices && "rotate-180")}
              />
            </button>
            {mobileServices && (
              <div className="ml-3 flex flex-col border-l border-border pl-3">
                <Link
                  to="/services"
                  onClick={close}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-primary"
                >
                  All services
                </Link>
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/${s.slug}`}
                    onClick={close}
                    className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
            {/* Mobile Tools Accordion */}
            <button
              type="button"
              onClick={() => setMobileTools((v) => !v)}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-left text-lg font-semibold hover:bg-accent"
              aria-expanded={mobileTools}
            >
              Tools
              <ChevronDown
                className={cn("h-5 w-5 transition-transform", mobileTools && "rotate-180")}
              />
            </button>
            {mobileTools && (
              <div className="ml-3 flex flex-col border-l border-border pl-3">
                {TOOLS_NAV_ITEMS.map((tool) => (
                  <Link
                    key={tool.to}
                    to={tool.to}
                    onClick={close}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-primary hover:text-foreground"
                  >
                    {tool.name}
                  </Link>
                ))}
                <Link
                  to="/instagram-downloader"
                  onClick={close}
                  className="rounded-xl px-3 py-2 text-xs font-semibold text-[#FFD84A]"
                >
                  All Tools &rarr;
                </Link>
              </div>
            )}

          {NAV_AFTER.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={close}
                className="rounded-2xl px-4 py-3 text-lg font-semibold hover:bg-accent"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 grid gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/contact" onClick={close}>
                Get Started
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <a href={SITE.phoneHref}>
                <Phone /> Call {SITE.phone}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
