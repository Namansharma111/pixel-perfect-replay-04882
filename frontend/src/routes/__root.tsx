import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { NorthIndiaSection } from "@/components/site/NorthIndiaSection";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { Toaster } from "sonner";
import { SITE, absoluteUrl } from "@/config/site";
import { AdminAuthProvider } from "@/lib/cms/auth-context";
import { initTracking } from "@/lib/tracking";

function NotFoundComponent() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-5 py-24">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="relative max-w-xl text-center">
        <p className="text-gradient text-8xl font-extrabold">404</p>
        <h1 className="mt-4 text-3xl font-extrabold">This page took a different route.</h1>
        <p className="mt-4 text-muted-foreground">
          The page you’re looking for doesn’t exist or may have moved. Let’s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-gradient-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow"
          >
            Back to home
          </Link>
          <Link
            to="/services"
            className="glass rounded-full px-6 py-3 text-sm font-semibold text-foreground"
          >
            Explore services
          </Link>
          <Link
            to="/contact"
            className="glass rounded-full px-6 py-3 text-sm font-semibold text-foreground"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Page-specific title/description/canonical live in each route's head().
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Social Waale — Digital Marketing Agency in Chandigarh" },
      { name: "description", content: SITE.description },
      { name: "author", content: "Social Waale" },
      { name: "theme-color", content: "#0b0f1a" },
      { property: "og:site_name", content: "Social Waale" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Organization", "ProfessionalService"],
          "@id": absoluteUrl("/#organization"),
          name: SITE.name,
          url: absoluteUrl("/"),
          logo: absoluteUrl("/favicon.png"),
          description: SITE.description,
          telephone: SITE.phone,
          email: SITE.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Chandigarh",
            addressCountry: "IN",
          },
          areaServed: [...SITE.locations, "India"].map((name) => ({ "@type": "Place", name })),
          sameAs: Object.values(SITE.socials),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: absoluteUrl("/"),
          inLanguage: "en-IN",
          publisher: { "@id": absoluteUrl("/#organization") },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    initTracking();
  }, [location.pathname, location.search]);

  if (isAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <AdminAuthProvider>
          <Toaster position="top-right" richColors />
          <main id="admin-main" className="min-h-screen bg-[#080F35] text-white">
            <Outlet />
          </main>
        </AdminAuthProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main
        id="main"
        className={
          isHome
            ? undefined
            : "min-h-screen bg-gradient-to-b from-[#080F35] via-[#0E1B5A] to-[#080F35]"
        }
      >
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <NorthIndiaSection />
      <SiteFooter />
      <FloatingWhatsApp />
    </QueryClientProvider>
  );
}
