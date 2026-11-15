import { describe, expect, it } from "vitest";
import { parseInstagramUrl } from "@/lib/downloader/instagram";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
const matches = (path: string) => router.matchRoutes(path).at(-1)?.routeId;

describe("Instagram URL Parser", () => {
  it("parses valid Instagram Reel URLs", () => {
    const res = parseInstagramUrl("https://www.instagram.com/reel/C7r_9s3pW2K/?utm_source=ig_web_copy_link");
    expect(res.isValid).toBe(true);
    expect(res.contentType).toBe("reel");
    expect(res.shortcode).toBe("C7r_9s3pW2K");
    expect(res.normalizedUrl).toBe("https://www.instagram.com/reel/C7r_9s3pW2K/");
  });

  it("parses valid Instagram Post URLs", () => {
    const res = parseInstagramUrl("https://www.instagram.com/p/DAY3Z9_S123/");
    expect(res.isValid).toBe(true);
    expect(res.contentType).toBe("photo");
    expect(res.shortcode).toBe("DAY3Z9_S123");
  });

  it("parses valid Instagram Story URLs", () => {
    const res = parseInstagramUrl("https://www.instagram.com/stories/virat.kohli/334567891234/");
    expect(res.isValid).toBe(true);
    expect(res.contentType).toBe("story");
    expect(res.username).toBe("virat.kohli");
  });

  it("parses Instagram TV (IGTV) URLs", () => {
    const res = parseInstagramUrl("https://www.instagram.com/tv/B-xyz123/");
    expect(res.isValid).toBe(true);
    expect(res.contentType).toBe("video");
    expect(res.shortcode).toBe("B-xyz123");
  });

  it("rejects invalid non-Instagram URLs", () => {
    const res = parseInstagramUrl("https://www.youtube.com/watch?v=12345");
    expect(res.isValid).toBe(false);
    expect(res.errorMessage).toBeDefined();
  });

  it("rejects empty inputs", () => {
    const res = parseInstagramUrl("");
    expect(res.isValid).toBe(false);
  });
});

describe("Downloader Routes & Admin Navigation", () => {
  const DOWNLOADER_ROUTES = [
    "/instagram-downloader",
    "/instagram-video-downloader",
    "/instagram-reels-downloader",
    "/instagram-photo-downloader",
    "/instagram-carousel-downloader",
    "/instagram-story-downloader",
    "/instagram-viewer",
  ];

  it.each(DOWNLOADER_ROUTES)("has a valid route registered for %s", (path) => {
    expect(matches(path)).toBe(path);
  });

  it("has a valid route registered for /admin/downloader", () => {
    expect(matches("/admin/downloader")).toBe("/admin/downloader");
  });
});
