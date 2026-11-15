import { snapsave } from "snapsave-media-downloader";

export type InstagramContentType =
  | "reel"
  | "video"
  | "photo"
  | "carousel"
  | "story"
  | "profile"
  | "unknown";

export interface ParsedInstagramUrl {
  isValid: boolean;
  normalizedUrl: string;
  shortcode?: string;
  contentType: InstagramContentType;
  username?: string;
  errorMessage?: string;
}

export interface ResolvedMediaItem {
  id: string;
  type: "video" | "image";
  url: string;
  thumbnailUrl?: string;
  resolution?: string;
  downloadUrl: string;
  filename: string;
}

export interface InstagramMediaResult {
  ok: boolean;
  shortcode: string;
  url: string;
  contentType: InstagramContentType;
  title?: string;
  caption?: string;
  author?: {
    username?: string;
    fullName?: string;
    avatarUrl?: string;
  };
  items: ResolvedMediaItem[];
  error?: string;
  errorType?:
    | "invalid_url"
    | "private_account"
    | "story_restricted"
    | "not_found"
    | "rate_limited"
    | "unsupported"
    | "unknown";
}

/**
 * Validates and extracts shortcode and content type from Instagram URLs
 */
export function parseInstagramUrl(rawInput: string): ParsedInstagramUrl {
  if (!rawInput || typeof rawInput !== "string") {
    return {
      isValid: false,
      normalizedUrl: "",
      contentType: "unknown",
      errorMessage: "Please enter a valid Instagram link.",
    };
  }

  const clean = rawInput.trim();

  // Basic URL regex
  const urlPattern =
    /^(?:https?:\/\/)?(?:www\.|m\.)?(?:instagram\.com|instagr\.am)\/([^?#]+)/i;
  const match = clean.match(urlPattern);

  if (!match || !match[1]) {
    return {
      isValid: false,
      normalizedUrl: clean,
      contentType: "unknown",
      errorMessage:
        "The link you entered is not a recognized Instagram URL. Please check the link and try again.",
    };
  }

  const path = match[1].replace(/^\/+|\/+$/g, "");
  const segments = path.split("/");

  // 1. Stories: /stories/username/1234567890
  if (segments[0] === "stories") {
    const username = segments[1];
    return {
      isValid: true,
      normalizedUrl: `https://www.instagram.com/stories/${username || ""}/`,
      contentType: "story",
      ...(username ? { username } : {}),
    };
  }

  // 2. Reels: /reel/SHORTCODE or /reels/SHORTCODE
  if (segments[0] === "reel" || segments[0] === "reels") {
    const shortcode = segments[1];
    if (!shortcode) {
      return {
        isValid: false,
        normalizedUrl: clean,
        contentType: "reel",
        errorMessage: "Missing Instagram Reel identifier in link.",
      };
    }
    return {
      isValid: true,
      normalizedUrl: `https://www.instagram.com/reel/${shortcode}/`,
      shortcode,
      contentType: "reel",
    };
  }

  // 3. Posts: /p/SHORTCODE
  if (segments[0] === "p") {
    const shortcode = segments[1];
    if (!shortcode) {
      return {
        isValid: false,
        normalizedUrl: clean,
        contentType: "photo",
        errorMessage: "Missing Instagram post identifier in link.",
      };
    }
    return {
      isValid: true,
      normalizedUrl: `https://www.instagram.com/p/${shortcode}/`,
      shortcode,
      contentType: "photo", // might be video/carousel after resolving
    };
  }

  // 4. IGTV: /tv/SHORTCODE
  if (segments[0] === "tv") {
    const shortcode = segments[1];
    return {
      isValid: true,
      normalizedUrl: `https://www.instagram.com/tv/${shortcode || ""}/`,
      ...(shortcode ? { shortcode } : {}),
      contentType: "video",
    };
  }

  // 5. Shared links: /share/r/SHORTCODE or /share/p/SHORTCODE
  if (segments[0] === "share" && segments[2]) {
    const shortcode = segments[2];
    const type: InstagramContentType = segments[1] === "r" ? "reel" : "photo";
    return {
      isValid: true,
      normalizedUrl: `https://www.instagram.com/${segments[1] === "r" ? "reel" : "p"}/${shortcode}/`,
      shortcode,
      contentType: type,
    };
  }

  // 6. Profiles: /username
  if (segments.length === 1 && segments[0] && !["explore", "direct", "accounts", "legal"].includes(segments[0])) {
    const userSegment = segments[0];
    return {
      isValid: true,
      normalizedUrl: `https://www.instagram.com/${userSegment}/`,
      username: userSegment,
      contentType: "profile",
    };
  }

  return {
    isValid: false,
    normalizedUrl: clean,
    contentType: "unknown",
    errorMessage:
      "Unsupported Instagram URL format. Please paste a link to a public Post, Reel, Video, or Photo.",
  };
}

/**
 * Resolves media from public Instagram links
 */
export async function resolveInstagramMedia(
  rawInput: string,
): Promise<InstagramMediaResult> {
  const parsed = parseInstagramUrl(rawInput);

  if (!parsed.isValid) {
    return {
      ok: false,
      shortcode: "",
      url: rawInput,
      contentType: parsed.contentType,
      items: [],
      error: parsed.errorMessage || "Invalid Instagram link.",
      errorType: "invalid_url",
    };
  }

  // 1. Stories handling (Strictly transparent & compliant)
  if (parsed.contentType === "story") {
    return {
      ok: false,
      shortcode: "",
      url: parsed.normalizedUrl,
      contentType: "story",
      items: [],
      error:
        "Instagram Stories and Highlights require private user authentication. To protect your security and avoid requesting your Instagram password or cookies, our downloader only supports media from publicly accessible Posts and Reels.",
      errorType: "story_restricted",
    };
  }

  // 2. Profile handling
  if (parsed.contentType === "profile") {
    return {
      ok: false,
      shortcode: "",
      url: parsed.normalizedUrl,
      contentType: "profile",
      items: [],
      error:
        "You entered a profile URL. To download media, please open any specific post, reel, or video on their profile, copy its individual link, and paste it here.",
      errorType: "unsupported",
    };
  }

  const shortcode = parsed.shortcode || "";

  // 3. Multi-tier resolution for Posts, Reels, Carousels, and Videos
  try {
    // Attempt Tier 1: snapsave resolver
    const snapResult = await snapsave(parsed.normalizedUrl, {
      retry: 2,
      retryDelay: 800,
    });

    if (snapResult && snapResult.success && snapResult.data?.media?.length) {
      const items: ResolvedMediaItem[] = snapResult.data.media
        .filter((m: any) => m.url)
        .map((m: any, idx: number) => {
          const isVideo = m.type === "video";
          const ext = isVideo ? "mp4" : "jpg";
          const filename = `socialwaale_ig_${shortcode}_${idx + 1}.${ext}`;
          // Build direct streaming proxy download link
          const downloadUrl = `/api/download?url=${encodeURIComponent(m.url)}&filename=${encodeURIComponent(filename)}`;
          const thumb = m.thumbnail || snapResult?.data?.preview;

          return {
            id: `item-${idx + 1}`,
            type: isVideo ? "video" : "image",
            url: m.url,
            ...(thumb ? { thumbnailUrl: thumb } : {}),
            ...(m.resolution ? { resolution: m.resolution } : {}),
            downloadUrl,
            filename,
          };
        });

      if (items.length > 0) {
        let detectedType: InstagramContentType = parsed.contentType;
        if (items.length > 1) {
          detectedType = "carousel";
        } else if (items[0]?.type === "video") {
          detectedType = parsed.contentType === "reel" ? "reel" : "video";
        } else {
          detectedType = "photo";
        }

        return {
          ok: true,
          shortcode,
          url: parsed.normalizedUrl,
          contentType: detectedType,
          title: snapResult.data.description || `Instagram ${detectedType.toUpperCase()}`,
          ...(snapResult.data.description ? { caption: snapResult.data.description } : {}),
          items,
        };
      }
    }

    // If snapsave returned an error message like "Unable to connect"
    if (snapResult && !snapResult.success) {
      const msg = snapResult.message || "";
      if (
        msg.includes("private") ||
        msg.includes("restricted") ||
        msg.includes("login")
      ) {
        return {
          ok: false,
          shortcode,
          url: parsed.normalizedUrl,
          contentType: parsed.contentType,
          items: [],
          error:
            "This Instagram post is from a private account or requires an Instagram login to view. Only media from public Instagram posts can be downloaded.",
          errorType: "private_account",
        };
      }

      if (msg.includes("not found") || msg.includes("deleted")) {
        return {
          ok: false,
          shortcode,
          url: parsed.normalizedUrl,
          contentType: parsed.contentType,
          items: [],
          error:
            "This Instagram post could not be found. It may have been deleted, archived, or the link is incorrect.",
          errorType: "not_found",
        };
      }
    }
  } catch (err: any) {
    console.warn("[Downloader] Primary resolver error:", err?.message || err);
  }

  // Fallback: Return informative guidance for the public post
  return {
    ok: false,
    shortcode,
    url: parsed.normalizedUrl,
    contentType: parsed.contentType,
    items: [],
    error:
      "Unable to extract media from this Instagram link right now. Please confirm that the post is from a public profile and accessible without logging in, or try again in a moment.",
    errorType: "rate_limited",
  };
}
