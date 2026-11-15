import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";
import { SERVICE_ORDER } from "@/data/services";
import { articles } from "@/data/articles";
import { getAllCmsServices, getAllArticles, getAllDownloaderPages } from "@/lib/cms/cms-storage";

const STATIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/articles",
  "/careers",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const base = SITE.url || new URL(request.url).origin;

        // Fetch dynamic CMS services & articles
        let dynamicServices: { slug: string; updatedAt?: string }[] = [];
        try {
          const cmsServices = getAllCmsServices(false);
          dynamicServices = cmsServices.map((s) => ({ slug: s.slug, ...(s.updatedAt ? { updatedAt: s.updatedAt } : {}) }));
        } catch {
          dynamicServices = SERVICE_ORDER.map((s) => ({ slug: s }));
        }

        const serviceUrlsMap = new Map<string, string | undefined>();
        SERVICE_ORDER.forEach((slug) => serviceUrlsMap.set(`/${slug}`, undefined));
        dynamicServices.forEach((s) => serviceUrlsMap.set(`/${s.slug}`, s.updatedAt));

        // Fetch dynamic CMS downloader pages
        let downloaderEntries: { loc: string; lastmod?: string }[] = [];
        try {
          const dlPages = getAllDownloaderPages(false);
          downloaderEntries = dlPages.map((p) => ({
            loc: `/${p.slug}`,
            ...(p.updatedAt ? { lastmod: p.updatedAt } : {}),
          }));
        } catch {}

        const entries = [
          ...STATIC_PATHS.map((p) => ({ loc: p, lastmod: undefined as string | undefined })),
          ...Array.from(serviceUrlsMap.entries()).map(([loc, lastmod]) => ({ loc, lastmod })),
          ...articles.map((a) => ({ loc: `/articles/${a.slug}`, lastmod: a.updatedAt })),
          ...downloaderEntries,
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${base}${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
