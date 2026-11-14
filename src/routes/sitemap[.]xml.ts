import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";
import { SERVICE_ORDER } from "@/data/services";
import { articles } from "@/data/articles";

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
        const entries = [
          ...STATIC_PATHS.map((p) => ({ loc: p, lastmod: undefined as string | undefined })),
          ...SERVICE_ORDER.map((s) => ({ loc: `/${s}`, lastmod: undefined as string | undefined })),
          ...articles.map((a) => ({ loc: `/articles/${a.slug}`, lastmod: a.updatedAt })),
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
