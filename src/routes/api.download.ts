import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const reqUrl = new URL(request.url);
        const targetUrl = reqUrl.searchParams.get("url");
        const filename = reqUrl.searchParams.get("filename") || "socialwaale_instagram_media.mp4";

        if (!targetUrl) {
          return new Response("Missing target url parameter", { status: 400 });
        }

        try {
          const parsedTarget = new URL(targetUrl);

          // SSRF Protection: Only allow known media CDN domains
          const allowedDomains = [
            "cdninstagram.com",
            "fbcdn.net",
            "instagram.com",
            "facebook.com",
            "snapsave.app",
            "fastdl.app",
          ];

          const isAllowed = allowedDomains.some(
            (domain) =>
              parsedTarget.hostname === domain ||
              parsedTarget.hostname.endsWith(`.${domain}`),
          );

          if (!isAllowed) {
            return new Response("Forbidden media domain", { status: 403 });
          }

          const response = await fetch(targetUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              Referer: "https://www.instagram.com/",
            },
          });

          if (!response.ok) {
            return new Response(
              `Failed to fetch media upstream: ${response.statusText}`,
              { status: response.status },
            );
          }

          const cleanFilename = filename
            .replace(/[^a-zA-Z0-9_.-]/g, "_")
            .slice(0, 100);

          const contentType =
            response.headers.get("content-type") ||
            (cleanFilename.endsWith(".jpg") ? "image/jpeg" : "video/mp4");

          const headers = new Headers();
          headers.set("Content-Type", contentType);
          headers.set(
            "Content-Disposition",
            `attachment; filename="${cleanFilename}"`,
          );
          headers.set("Cache-Control", "public, max-age=86400");

          const contentLength = response.headers.get("content-length");
          if (contentLength) {
            headers.set("Content-Length", contentLength);
          }

          return new Response(response.body, {
            status: 200,
            headers,
          });
        } catch (err: any) {
          return new Response(`Error proxying download: ${err.message}`, {
            status: 500,
          });
        }
      },
    },
  },
});
