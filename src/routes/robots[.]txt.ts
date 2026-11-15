import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const base = SITE.url || new URL(request.url).origin;
        return new Response(`User-agent: *\nDisallow: /admin/\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
