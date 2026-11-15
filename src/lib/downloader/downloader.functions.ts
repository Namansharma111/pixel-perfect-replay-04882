import { createServerFn } from "@tanstack/react-start";
import {
  resolveInstagramMedia,
  parseInstagramUrl,
  type InstagramMediaResult,
  type ParsedInstagramUrl,
} from "./instagram";
import {
  getDownloaderSettings,
  logDownloaderRequest,
} from "@/lib/cms/cms-storage";

/**
 * Validates an Instagram URL on the client/server
 */
export const validateInstagramUrlFn = createServerFn({ method: "POST" })
  .validator((data: { url: string }) => data)
  .handler(async ({ data }: { data: { url: string } }): Promise<ParsedInstagramUrl> => {
    return parseInstagramUrl(data.url);
  });

/**
 * Resolves Instagram media streams, images, carousels, and download links
 */
export const resolveInstagramMediaFn = createServerFn({ method: "POST" })
  .validator((data: { url: string; toolType?: string }) => data)
  .handler(
    async ({
      data,
    }: {
      data: { url: string; toolType?: string };
    }): Promise<InstagramMediaResult> => {
      const startTime = Date.now();

      // Check backend maintenance status
      try {
        const settings = getDownloaderSettings();
        if (settings && settings.status === "maintenance") {
          const maintenanceMsg =
            "The Instagram downloader backend is currently undergoing scheduled maintenance. Service will resume shortly.";
          logDownloaderRequest({
            url: data.url,
            toolType: data.toolType || "video",
            contentType: "unknown",
            status: "failed",
            durationMs: Date.now() - startTime,
            error: maintenanceMsg,
          });
          return {
            ok: false,
            shortcode: "",
            url: data.url,
            contentType: "unknown",
            items: [],
            error: maintenanceMsg,
            errorType: "rate_limited",
          };
        }
      } catch (e) {
        // Fall through to regular resolution
      }

      try {
        const result = await resolveInstagramMedia(data.url);
        const durationMs = Date.now() - startTime;

        // Log actual request to CMS store
        logDownloaderRequest({
          url: data.url,
          toolType: data.toolType || "video",
          contentType: result.contentType,
          status: result.ok ? "success" : "failed",
          durationMs,
          ...(result.error ? { error: result.error } : {}),
        });

        return result;
      } catch (err: any) {
        console.error("[resolveInstagramMediaFn] Error resolving Instagram media:", err);
        const durationMs = Date.now() - startTime;
        const errorMsg =
          err?.message ||
          "An unexpected server error occurred while retrieving media. Please try again.";

        logDownloaderRequest({
          url: data.url,
          toolType: data.toolType || "video",
          contentType: "unknown",
          status: "failed",
          durationMs,
          error: errorMsg,
        });

        return {
          ok: false,
          shortcode: "",
          url: data.url,
          contentType: "unknown",
          items: [],
          error: errorMsg,
          errorType: "unknown",
        };
      }
    },
  );
