"use client";

import { useRef, useState } from "react";
import {
  Media,
  MasonryGrid,
  Icon,
} from "@once-ui-system/core";

import { gallery } from "@/resources";
import type { GalleryImage } from "@/types";

import { trackClick } from "@/lib/analytics/track-interaction";
import { trackEvent } from "@/lib/analytics/tracker";

type Filter =
  | "all"
  | "vertical"
  | "landscape"
  | "ai";

type GalleryViewProps = {
  images?: GalleryImage[];
};

const tabs = [
  {
    value: "all" as Filter,
    icon: "allVideos" as const,
    tooltip: "All Videos",
  },
  {
    value: "vertical" as Filter,
    icon: "verticalVideo" as const,
    tooltip: "Vertical Videos",
  },
  {
    value: "landscape" as Filter,
    icon: "landscapeVideo" as const,
    tooltip: "Landscape Videos",
  },
  {
    value: "ai" as Filter,
    icon: "aiVideo" as const,
    tooltip: "AI Videos",
  },
];

function isVideoFile(src: string) {
  const lowerSrc = src.toLowerCase();

  return (
    lowerSrc.endsWith(".mp4") ||
    lowerSrc.endsWith(".webm") ||
    lowerSrc.endsWith(".mov") ||
    lowerSrc.endsWith(".m4v")
  );
}

export default function GalleryView({
  images = gallery.images,
}: GalleryViewProps) {
  const [selectedVideo, setSelectedVideo] =
    useState<string | null>(null);

  const [activeFilter, setActiveFilter] =
    useState<Filter>("all");

  const videoRef =
    useRef<HTMLVideoElement>(null);

  // Prevent duplicate tracking for the same modal session.
  const videoSessionRef = useRef<{
    src: string | null;
    playStarted: boolean;
    lastTrackedTime: number;
  }>({
    src: null,
    playStarted: false,
    lastTrackedTime: 0,
  });

  const filteredImages = images.filter(
    (image: GalleryImage) => {
      if (activeFilter === "all") {
        return true;
      }

      if (activeFilter === "vertical") {
        return image.orientation === "vertical";
      }

      if (activeFilter === "landscape") {
        return image.orientation === "horizontal";
      }

      if (activeFilter === "ai") {
        return image.orientation === "ai";
      }

      return true;
    },
  );

  /**
   * Open video and track the click.
   */
  const handleVideoClick = (
    image: GalleryImage,
  ) => {
    videoSessionRef.current = {
      src: image.src,
      playStarted: false,
      lastTrackedTime: 0,
    };

    void trackClick({
      eventName: "Gallery Video Click",
      elementId: `gallery-video-${image.src}`,
      elementText: image.alt,
      targetUrl: image.src,
      metadata: {
        source: "gallery",
        orientation: image.orientation,
        mediaType: "video",
      },
    });

    setSelectedVideo(image.src);
  };

  /**
   * Track when the video actually starts playing.
   */
  const handleVideoPlay = () => {
    const video = videoRef.current;

    if (!video || !selectedVideo) {
      return;
    }

    const session =
      videoSessionRef.current;

    if (!session.playStarted) {
      session.playStarted = true;

      void trackEvent("video_play", {
        eventName: "Gallery Video Play",
        elementId: `gallery-video-${selectedVideo}`,
        elementText: selectedVideo,
        targetUrl: selectedVideo,
        metadata: {
          source: "gallery",
          videoSrc: selectedVideo,
          duration: video.duration || 0,
          currentTime: video.currentTime || 0,
        },
      });
    }
  };

  /**
   * Track pause position.
   */
  const handleVideoPause = () => {
    const video = videoRef.current;

    if (!video || !selectedVideo) {
      return;
    }

    if (
      video.ended ||
      !videoSessionRef.current.playStarted
    ) {
      return;
    }

    void trackEvent("video_pause", {
      eventName: "Gallery Video Pause",
      elementId: `gallery-video-${selectedVideo}`,
      elementText: selectedVideo,
      targetUrl: selectedVideo,
      metadata: {
        source: "gallery",
        videoSrc: selectedVideo,
        duration: video.duration || 0,
        currentTime: video.currentTime || 0,
        watchedSeconds: Math.round(
          video.currentTime || 0,
        ),
      },
    });
  };

  /**
   * Track video progress approximately every 10 seconds.
   * This lets the analytics dashboard know how much
   * of the video was actually watched.
   */
  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;

    if (!video || !selectedVideo) {
      return;
    }

    if (!videoSessionRef.current.playStarted) {
      return;
    }

    const currentTime = video.currentTime || 0;
    const lastTracked =
      videoSessionRef.current.lastTrackedTime;

    if (currentTime - lastTracked < 10) {
      return;
    }

    videoSessionRef.current.lastTrackedTime =
      currentTime;

    void trackEvent("video_progress", {
      eventName: "Gallery Video Progress",
      elementId: `gallery-video-${selectedVideo}`,
      elementText: selectedVideo,
      targetUrl: selectedVideo,
      metadata: {
        source: "gallery",
        videoSrc: selectedVideo,
        duration: video.duration || 0,
        currentTime,
        watchedSeconds: Math.round(currentTime),
        progressPercent:
          video.duration > 0
            ? Math.round(
                (currentTime / video.duration) *
                  100,
              )
            : 0,
      },
    });
  };

  /**
   * Track when the complete video is watched.
   */
  const handleVideoEnded = () => {
    const video = videoRef.current;

    if (!video || !selectedVideo) {
      return;
    }

    void trackEvent("video_complete", {
      eventName: "Gallery Video Complete",
      elementId: `gallery-video-${selectedVideo}`,
      elementText: selectedVideo,
      targetUrl: selectedVideo,
      metadata: {
        source: "gallery",
        videoSrc: selectedVideo,
        duration: video.duration || 0,
        watchedSeconds: Math.round(
          video.duration || 0,
        ),
        completed: true,
        progressPercent: 100,
      },
    });

    videoSessionRef.current.lastTrackedTime =
      video.duration || 0;
  };

  /**
   * Close modal and reset current video session.
   */
  const handleCloseVideo = () => {
    const video = videoRef.current;

    if (video && selectedVideo) {
      void trackEvent("video_close", {
        eventName: "Gallery Video Close",
        elementId: `gallery-video-${selectedVideo}`,
        elementText: selectedVideo,
        targetUrl: selectedVideo,
        metadata: {
          source: "gallery",
          videoSrc: selectedVideo,
          duration: video.duration || 0,
          currentTime: video.currentTime || 0,
          watchedSeconds: Math.round(
            video.currentTime || 0,
          ),
          progressPercent:
            video.duration > 0
              ? Math.round(
                  (video.currentTime /
                    video.duration) *
                    100,
                )
              : 0,
        },
      });
    }

    setSelectedVideo(null);

    videoSessionRef.current = {
      src: null,
      playStarted: false,
      lastTrackedTime: 0,
    };
  };

  return (
    <>
      {/* Filter Tabs */}
      <div className="grid grid-col justify-center">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px",
              borderRadius: "999px",
              background:
                "var(--neutral-alpha-weak)",
            }}
          >
            {tabs.map((tab) => {
              const isActive =
                activeFilter === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  title={tab.tooltip}
                  aria-label={tab.tooltip}
                  aria-pressed={isActive}
                  onClick={() =>
                    setActiveFilter(tab.value)
                  }
                  style={{
                    appearance: "none",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    width: "40px",
                    height: "38px",
                    padding: 0,
                    borderRadius: "999px",
                    background: isActive
                      ? "var(--neutral-background-strong)"
                      : "transparent",
                    color: isActive
                      ? "var(--neutral-on-background-strong)"
                      : "var(--neutral-on-background-weak)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition:
                      "all 180ms ease",
                    WebkitTapHighlightColor:
                      "transparent",
                  }}
                >
                  <Icon
                    name={tab.icon}
                    size="s"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry */}
        <MasonryGrid
          columns={2}
          s={{ columns: 1 }}
        >
          {filteredImages.map(
            (
              image: GalleryImage,
              index: number,
            ) => {
              const isVideo = isVideoFile(
                image.src,
              );

              if (isVideo) {
                return (
                  <div
                    key={`${image.src}-${index}`}
                    onClick={() =>
                      handleVideoClick(image)
                    }
                    style={{
                      position: "relative",
                      cursor: "pointer",
                      borderRadius: "12px",
                      overflow: "hidden",
                      aspectRatio:
                        image.orientation ===
                        "horizontal"
                          ? "16 / 9"
                          : "3 / 4",
                    }}
                  >
                    <video
                      src={image.src}
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={image.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    {/* Play Icon */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        justifyContent:
                          "center",
                        alignItems: "center",
                        background:
                          "rgba(0,0,0,.20)",
                      }}
                    >
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          background:
                            "rgba(0,0,0,.55)",
                          display: "flex",
                          justifyContent:
                            "center",
                          alignItems: "center",
                          backdropFilter:
                            "blur(8px)",
                        }}
                      >
                        <Icon
                          name="play"
                          size="l"
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Media
                  key={`${image.src}-${index}`}
                  enlarge
                  priority={index < 10}
                  sizes="(max-width: 560px) 100vw, 50vw"
                  radius="m"
                  aspectRatio={
                    image.orientation ===
                    "horizontal"
                      ? "16 / 9"
                      : "3 / 4"
                  }
                  src={image.src}
                  alt={image.alt}
                />
              );
            },
          )}
        </MasonryGrid>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          onClick={handleCloseVideo}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.92)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: 24,
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleCloseVideo}
            aria-label="Close video"
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              background:
                "rgba(255,255,255,.12)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <Icon
              name="close"
              size="l"
            />
          </button>

          <video
            ref={videoRef}
            src={selectedVideo}
            controls
            autoPlay
            playsInline
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onTimeUpdate={
              handleVideoTimeUpdate
            }
            onEnded={handleVideoEnded}
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: "1200px",
              maxHeight: "90vh",
              borderRadius: "16px",
              background: "#000",
            }}
          />
        </div>
      )}
    </>
  );
}