"use client";

import { trackEvent } from "@/lib/analytics/tracker";

/**
 * Track any clickable portfolio interaction.
 */
export function trackClick(data: {
  eventName: string;
  elementId?: string;
  elementText?: string;
  targetUrl?: string;
  metadata?: Record<string, unknown>;
}): void {
  void trackEvent("click", {
    eventName: data.eventName,
    elementId:
      data.elementId ?? "portfolio-click",
    elementText:
      data.elementText,
    targetUrl:
      data.targetUrl,
    metadata: {
      interactionType: "click",
      ...data.metadata,
    },
  });
}

/**
 * Track downloadable files.
 *
 * Example:
 * Resume, CV, case study, project file, etc.
 */
export function trackDownload(data: {
  fileName: string;
  targetUrl: string;
  elementId?: string;
  metadata?: Record<string, unknown>;
}): void {
  void trackEvent("download", {
    eventName:
      `Download: ${data.fileName}`,

    elementId:
      data.elementId ??
      `download-${data.fileName}`,

    elementText:
      data.fileName,

    targetUrl:
      data.targetUrl,

    metadata: {
      interactionType: "download",
      fileName: data.fileName,
      ...data.metadata,
    },
  });
}

/**
 * Track external links.
 *
 * Example:
 * LinkedIn, Instagram, Behance,
 * YouTube, GitHub, etc.
 */
export function trackExternalLink(data: {
  name: string;
  url: string;
  elementId?: string;
  metadata?: Record<string, unknown>;
}): void {
  void trackEvent("external_link", {
    eventName:
      `${data.name} Click`,

    elementId:
      data.elementId ??
      `external-${data.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,

    elementText:
      data.name,

    targetUrl:
      data.url,

    metadata: {
      interactionType:
        "external_link",

      linkName:
        data.name,

      ...data.metadata,
    },
  });
}

/**
 * Track contact actions.
 */
export function trackContact(data: {
  type:
    | "email"
    | "phone"
    | "whatsapp"
    | "calendar";

  value?: string;

  metadata?: Record<string, unknown>;
}): void {
  const labels = {
    email: "Email Contact",
    phone: "Phone Contact",
    whatsapp: "WhatsApp Contact",
    calendar: "Calendar Contact",
  };

  const label =
    labels[data.type];

  void trackEvent("contact", {
    eventName: label,

    elementId:
      `contact-${data.type}`,

    elementText:
      label,

    targetUrl:
      data.value,

    metadata: {
      interactionType: "contact",
      contactType:
        data.type,
      contactValue:
        data.value,
      ...data.metadata,
    },
  });
}

/**
 * Track a video thumbnail/card click.
 *
 * This is separate from video_play:
 * click = user opened the video
 * play = video actually started
 */
export function trackVideoClick(data: {
  videoSrc: string;
  videoName?: string;
  orientation?:
    | "horizontal"
    | "vertical"
    | "ai";
  metadata?: Record<string, unknown>;
}): void {
  void trackEvent("click", {
    eventName:
      "Gallery Video Click",

    elementId:
      `gallery-video-${data.videoSrc}`,

    elementText:
      data.videoName ??
      data.videoSrc,

    targetUrl:
      data.videoSrc,

    metadata: {
      interactionType:
        "video_click",

      mediaType:
        "video",

      videoSrc:
        data.videoSrc,

      videoName:
        data.videoName,

      orientation:
        data.orientation,

      ...data.metadata,
    },
  });
}

/**
 * Track gallery filter/tab clicks.
 */
export function trackGalleryFilter(data: {
  filter:
    | "all"
    | "vertical"
    | "landscape"
    | "ai";

  metadata?: Record<string, unknown>;
}): void {
  void trackEvent("click", {
    eventName:
      `Gallery Filter: ${data.filter}`,

    elementId:
      `gallery-filter-${data.filter}`,

    elementText:
      data.filter,

    metadata: {
      interactionType:
        "gallery_filter",

      filter:
        data.filter,

      ...data.metadata,
    },
  });
}

/**
 * Track generic media/image view.
 */
export function trackMediaView(data: {
  src: string;
  alt?: string;
  orientation?:
    | "horizontal"
    | "vertical"
    | "ai";
  metadata?: Record<string, unknown>;
}): void {
  void trackEvent("click", {
    eventName:
      "Gallery Media View",

    elementId:
      `gallery-media-${data.src}`,

    elementText:
      data.alt ??
      data.src,

    targetUrl:
      data.src,

    metadata: {
      interactionType:
        "media_view",

      mediaType:
        "image",

      src:
        data.src,

      alt:
        data.alt,

      orientation:
        data.orientation,

      ...data.metadata,
    },
  });
}