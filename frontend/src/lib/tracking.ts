/**
 * Marketing Attribution & Lead Source Tracking
 * Captures UTM parameters, referrer, and source page across the user journey.
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export interface TrackingData {
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  utmContent?: string | undefined;
  utmTerm?: string | undefined;
  referrer?: string | undefined;
  sourceUrl: string;
}

export function initTracking(): void {
  if (typeof window === "undefined") return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    let foundUtm = false;

    for (const key of UTM_KEYS) {
      const val = urlParams.get(key);
      if (val) {
        sessionStorage.setItem(`sw_${key}`, val);
        foundUtm = true;
      }
    }

    // Save initial landing page & referrer if not already stored
    if (!sessionStorage.getItem("sw_first_landing")) {
      sessionStorage.setItem("sw_first_landing", window.location.pathname);
    }
    if (document.referrer && !sessionStorage.getItem("sw_referrer")) {
      sessionStorage.setItem("sw_referrer", document.referrer);
    }
  } catch (err) {
    // SessionStorage may be restricted in private/sandboxed mode
  }
}

export function getLeadTrackingPayload(currentPath?: string): TrackingData {
  if (typeof window === "undefined") {
    return {
      sourceUrl: currentPath || "/",
    };
  }

  const payload: TrackingData = {
    sourceUrl: currentPath || window.location.pathname || "/",
  };

  try {
    // Current URL query takes priority, fallback to sessionStorage
    const urlParams = new URLSearchParams(window.location.search);

    payload.utmSource =
      urlParams.get("utm_source") ||
      sessionStorage.getItem("sw_utm_source") ||
      undefined;

    payload.utmMedium =
      urlParams.get("utm_medium") ||
      sessionStorage.getItem("sw_utm_medium") ||
      undefined;

    payload.utmCampaign =
      urlParams.get("utm_campaign") ||
      sessionStorage.getItem("sw_utm_campaign") ||
      undefined;

    payload.utmContent =
      urlParams.get("utm_content") ||
      sessionStorage.getItem("sw_utm_content") ||
      undefined;

    payload.utmTerm =
      urlParams.get("utm_term") ||
      sessionStorage.getItem("sw_utm_term") ||
      undefined;

    payload.referrer =
      document.referrer ||
      sessionStorage.getItem("sw_referrer") ||
      undefined;
  } catch (err) {
    // Ignore storage errors
  }

  return payload;
}
