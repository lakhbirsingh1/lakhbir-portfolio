"use client";

import { useRef, useState } from "react";
import { Media, MasonryGrid, Icon } from "@once-ui-system/core";
import { gallery } from "@/resources";

export default function GalleryView() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      <MasonryGrid columns={2} s={{ columns: 1 }}>
        {gallery.images.map((image, index) => {
          const isVideo = image.src.toLowerCase().endsWith(".mp4");

          if (isVideo) {
            return (
              <div
                key={index}
                onClick={() => setSelectedVideo(image.src)}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  borderRadius: "12px",
                  overflow: "hidden",
                  aspectRatio:
                    image.orientation === "horizontal"
                      ? "16 / 9"
                      : "3 / 4",
                }}
              >
                <video
                  src={image.src}
                  muted
                  playsInline
                  preload="metadata"
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
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(0,0,0,.20)",
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,.55)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Icon name="play" size="l" />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Media
              key={index}
              enlarge
              priority={index < 10}
              sizes="(max-width: 560px) 100vw, 50vw"
              radius="m"
              aspectRatio={
                image.orientation === "horizontal"
                  ? "16 / 9"
                  : "3 / 4"
              }
              src={image.src}
              alt={image.alt}
            />
          );
        })}
      </MasonryGrid>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
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
            onClick={() => setSelectedVideo(null)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,.12)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <Icon name="close" size="l" />
          </button>

          <video
            ref={videoRef}
            src={selectedVideo}
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
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