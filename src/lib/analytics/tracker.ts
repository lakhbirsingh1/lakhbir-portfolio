type AnalyticsEventType =
  | "click"
  | "download"
  | "external_link"
  | "contact"
  | "video_play"
  | "video_pause"
  | "video_progress"
  | "video_complete"
  | "video_close"
  | "page_view";

type TrackEventData = {
  eventName?: string;
  elementId?: string;
  elementText?: string;
  targetUrl?: string;
  metadata?: Record<string, unknown>;
};

function getSessionId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const key = "lakhbir_analytics_session_id";

  const existing = window.sessionStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const sessionId =
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  window.sessionStorage.setItem(
    key,
    sessionId,
  );

  return sessionId;
}

function getVisitorId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const key = "lakhbir_analytics_visitor_id";

  const existing =
    window.localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const visitorId =
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  window.localStorage.setItem(
    key,
    visitorId,
  );

  return visitorId;
}

function getVideoValue(
  metadata: Record<string, unknown>,
  key: string,
): number | undefined {
  const value = metadata[key];

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  return undefined;
}

function getVideoString(
  metadata: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = metadata[key];

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value;
  }

  return undefined;
}

export async function trackEvent(
  eventType: AnalyticsEventType,
  data: TrackEventData = {},
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const metadata = data.metadata ?? {};

    const isVideoEvent =
      eventType.startsWith("video_");

    const payload = {
      visitorId: getVisitorId(),

      sessionId: getSessionId(),

      eventType,

      eventName:
        data.eventName ??
        eventType,

      elementId:
        data.elementId ?? null,

      elementText:
        data.elementText ?? null,

      targetUrl:
        data.targetUrl ?? null,

      path:
        window.location.pathname,

      metadata,

      createdAt:
        new Date().toISOString(),

      ...(isVideoEvent
        ? {
            videoKey:
              getVideoString(
                metadata,
                "videoSrc",
              ) ??
              data.targetUrl ??
              null,

            title:
              data.elementText ??
              getVideoString(
                metadata,
                "title",
              ) ??
              null,

            src:
              getVideoString(
                metadata,
                "videoSrc",
              ) ??
              data.targetUrl ??
              null,

            positionSeconds:
              getVideoValue(
                metadata,
                "currentTime",
              ) ?? 0,

            progressPercent:
              getVideoValue(
                metadata,
                "progressPercent",
              ) ?? null,

            durationSeconds:
              getVideoValue(
                metadata,
                "duration",
              ) ?? null,
          }
        : {}),
    };

    const response = await fetch(
      "/api/analytics",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          payload,
        ),

        keepalive: true,
      },
    );

    if (!response.ok) {
      let errorDetails = "";

      try {
        errorDetails =
          await response.text();
      } catch {
        // Ignore response parsing errors.
      }

      console.error(
        "Analytics API error:",
        response.status,
        errorDetails,
      );
    }
  } catch (error) {
    console.error(
      "Analytics tracking failed:",
      error,
    );
  }
}

/**
 * Track a page view.
 */
export function trackPageView(
  path?: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  void trackEvent("page_view", {
    eventName:
      document.title ||
      "Page View",

    targetUrl:
      path ??
      window.location.pathname,

    metadata: {
      pagePath:
        path ??
        window.location.pathname,

      pageTitle:
        document.title ||
        undefined,
    },
  });
}