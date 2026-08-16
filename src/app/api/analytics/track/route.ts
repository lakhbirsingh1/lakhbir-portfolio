import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

interface TrackRequest {
  visitorId?: string;
  sessionId?: string;

  eventType?: string;
  eventName?: string;
  path?: string;
  elementId?: string;
  elementText?: string;
  targetUrl?: string;
  metadata?: Record<string, unknown>;

  videoKey?: string;
  title?: string;
  src?: string;
  positionSeconds?: number;
  progressPercent?: number;
  durationSeconds?: number;
}

interface VisitorMetadata {
  visitorId: string;
  deviceType?: string;
  operatingSystem?: string;
  browser?: string;
  browserVersion?: string | null;
  screenWidth?: number | null;
  screenHeight?: number | null;
  language?: string | null;
  timezone?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
}

function safeNumber(
  value: unknown,
): number | null {
  if (typeof value !== "number") {
    return null;
  }

  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.max(0, value);
}

function safeProgress(
  value: unknown,
): number | null {
  const number = safeNumber(value);

  if (number === null) {
    return null;
  }

  return Math.min(100, number);
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as TrackRequest;

    const visitorId =
      body.visitorId?.trim();

    const sessionId =
      body.sessionId?.trim();

    if (!visitorId || !sessionId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing visitorId or sessionId",
        },
        { status: 400 },
      );
    }

    const visitorMetadata =
      (body.metadata?.visitor as
        | VisitorMetadata
        | undefined) ?? null;

    const now =
      new Date().toISOString();

    // --------------------------------------------------
    // 1. FIND OR CREATE VISITOR
    // --------------------------------------------------

    const {
      data: existingVisitor,
      error: visitorLookupError,
    } = await supabaseServer
      .from("analytics_visitors")
      .select("id, is_returning")
      .eq("visitor_id", visitorId)
      .maybeSingle();

    if (visitorLookupError) {
      throw visitorLookupError;
    }

    let visitorRecordId: string;

    if (existingVisitor) {
      visitorRecordId =
        existingVisitor.id;

      const { error } =
        await supabaseServer
          .from("analytics_visitors")
          .update({
            last_seen_at: now,
            is_returning: true,
            device_type:
              visitorMetadata?.deviceType,
            operating_system:
              visitorMetadata?.operatingSystem,
            browser:
              visitorMetadata?.browser,
            browser_version:
              visitorMetadata?.browserVersion,
            screen_width:
              visitorMetadata?.screenWidth,
            screen_height:
              visitorMetadata?.screenHeight,
            language:
              visitorMetadata?.language,
            timezone:
              visitorMetadata?.timezone,
            referrer:
              visitorMetadata?.referrer,
          })
          .eq(
            "id",
            visitorRecordId,
          );

      if (error) {
        throw error;
      }
    } else {
      const {
        data: newVisitor,
        error,
      } = await supabaseServer
        .from("analytics_visitors")
        .insert({
          visitor_id: visitorId,
          first_seen_at: now,
          last_seen_at: now,
          is_returning: false,
          device_type:
            visitorMetadata?.deviceType,
          operating_system:
            visitorMetadata?.operatingSystem,
          browser:
            visitorMetadata?.browser,
          browser_version:
            visitorMetadata?.browserVersion,
          screen_width:
            visitorMetadata?.screenWidth,
          screen_height:
            visitorMetadata?.screenHeight,
          language:
            visitorMetadata?.language,
          timezone:
            visitorMetadata?.timezone,
          referrer:
            visitorMetadata?.referrer,
          landing_page:
            visitorMetadata?.landingPage,
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      visitorRecordId =
        newVisitor.id;
    }

    // --------------------------------------------------
    // 2. FIND OR CREATE SESSION
    // --------------------------------------------------

    const {
      data: existingSession,
      error: sessionLookupError,
    } = await supabaseServer
      .from("analytics_sessions")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (sessionLookupError) {
      throw sessionLookupError;
    }

    let sessionRecordId: string;

    if (existingSession) {
      sessionRecordId =
        existingSession.id;

      const { error } =
        await supabaseServer
          .from("analytics_sessions")
          .update({
            last_activity_at: now,
          })
          .eq(
            "id",
            sessionRecordId,
          );

      if (error) {
        throw error;
      }
    } else {
      const {
        data: newSession,
        error,
      } = await supabaseServer
        .from("analytics_sessions")
        .insert({
          visitor_id:
            visitorRecordId,
          session_id: sessionId,
          started_at: now,
          last_activity_at: now,
          landing_page:
            body.path ?? "/",
          referrer:
            visitorMetadata?.referrer ??
            null,
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      sessionRecordId =
        newSession.id;
    }

    // --------------------------------------------------
    // 3. PAGE VIEW
    // --------------------------------------------------

    if (
      body.eventType ===
      "page_view"
    ) {
      const { error } =
        await supabaseServer
          .from("analytics_page_views")
          .insert({
            visitor_id:
              visitorRecordId,
            session_id:
              sessionRecordId,
            path:
              body.path ?? "/",
            page_title:
              body.eventName ??
              null,
            referrer:
              visitorMetadata?.referrer ??
              null,
            entered_at: now,
          });

      if (error) {
        throw error;
      }
    }

    // --------------------------------------------------
    // 4. VIDEO ANALYTICS
    // --------------------------------------------------

    if (
      body.eventType?.startsWith(
        "video_",
      ) &&
      body.videoKey
    ) {
      const durationSeconds =
        safeNumber(
          body.durationSeconds,
        );

      const positionSeconds =
        safeNumber(
          body.positionSeconds,
        ) ?? 0;

      const progressPercent =
        safeProgress(
          body.progressPercent,
        );

      // ----------------------------------------------
      // FIND VIDEO
      // ----------------------------------------------

      const {
        data: video,
        error: videoLookupError,
      } = await supabaseServer
        .from("analytics_videos")
        .select(
          "id, duration_seconds",
        )
        .eq(
          "video_key",
          body.videoKey,
        )
        .maybeSingle();

      if (videoLookupError) {
        throw videoLookupError;
      }

      let videoId =
        video?.id;

      // ----------------------------------------------
      // CREATE VIDEO IF IT DOESN'T EXIST
      // ----------------------------------------------

      if (!videoId) {
        const {
          data: newVideo,
          error,
        } = await supabaseServer
          .from(
            "analytics_videos",
          )
          .insert({
            video_key:
              body.videoKey,

            title:
              body.title ??
              body.videoKey,

            src:
              body.src ?? null,

            duration_seconds:
              durationSeconds,
          })
          .select("id")
          .single();

        if (error) {
          throw error;
        }

        videoId =
          newVideo.id;
      }

      // ----------------------------------------------
      // UPDATE DURATION IF WE LEARN IT LATER
      // ----------------------------------------------

      if (
        durationSeconds !==
          null &&
        (!video ||
          video.duration_seconds ===
            null)
      ) {
        const { error } =
          await supabaseServer
            .from(
              "analytics_videos",
            )
            .update({
              duration_seconds:
                durationSeconds,
            })
            .eq(
              "id",
              videoId,
            );

        if (error) {
          throw error;
        }
      }

      // ----------------------------------------------
      // SAVE VIDEO EVENT
      // ----------------------------------------------

      const { error } =
        await supabaseServer
          .from(
            "analytics_video_events",
          )
          .insert({
            video_id:
              videoId,

            visitor_id:
              visitorRecordId,

            session_id:
              sessionRecordId,

            event_type:
              body.eventType,

            position_seconds:
              positionSeconds,

            progress_percent:
              progressPercent,
          });

      if (error) {
        throw error;
      }
    }

    // --------------------------------------------------
    // 5. GENERAL EVENTS
    // --------------------------------------------------

    if (
      body.eventType &&
      body.eventType !==
        "page_view" &&
      !body.eventType.startsWith(
        "video_",
      )
    ) {
      const { error } =
        await supabaseServer
          .from(
            "analytics_events",
          )
          .insert({
            visitor_id:
              visitorRecordId,

            session_id:
              sessionRecordId,

            event_type:
              body.eventType,

            event_name:
              body.eventName ??
              null,

            path:
              body.path ?? null,

            element_id:
              body.elementId ??
              null,

            element_text:
              body.elementText ??
              null,

            target_url:
              body.targetUrl ??
              null,

            metadata:
              body.metadata ?? {},
          });

      if (error) {
        throw error;
      }
    }

    // --------------------------------------------------
    // 6. SUCCESS
    // --------------------------------------------------

    return NextResponse.json({
      success: true,
      eventType:
        body.eventType ?? null,
      videoKey:
        body.videoKey ?? null,
    });
  } catch (error) {
    console.error(
      "Analytics tracking error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to record analytics event",
      },
      { status: 500 },
    );
  }
}