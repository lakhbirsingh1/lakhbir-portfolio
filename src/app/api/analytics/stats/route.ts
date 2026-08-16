import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    // --------------------------------------------------
    // VISITORS
    // --------------------------------------------------

    const { count: totalVisitors, error: visitorsError } =
      await supabaseServer
        .from("analytics_visitors")
        .select("*", {
          count: "exact",
          head: true,
        });

    if (visitorsError) {
      throw visitorsError;
    }

    const { count: returningVisitors, error: returningError } =
      await supabaseServer
        .from("analytics_visitors")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("is_returning", true);

    if (returningError) {
      throw returningError;
    }

    // --------------------------------------------------
    // SESSIONS
    // --------------------------------------------------

    const { count: totalSessions, error: sessionsError } =
      await supabaseServer
        .from("analytics_sessions")
        .select("*", {
          count: "exact",
          head: true,
        });

    if (sessionsError) {
      throw sessionsError;
    }

    // --------------------------------------------------
    // PAGE VIEWS
    // --------------------------------------------------

    const { count: totalPageViews, error: pageViewsError } =
      await supabaseServer
        .from("analytics_page_views")
        .select("*", {
          count: "exact",
          head: true,
        });

    if (pageViewsError) {
      throw pageViewsError;
    }

    // --------------------------------------------------
    // GENERAL EVENTS
    // --------------------------------------------------

    const { count: totalEvents, error: eventsError } =
      await supabaseServer
        .from("analytics_events")
        .select("*", {
          count: "exact",
          head: true,
        });

    if (eventsError) {
      throw eventsError;
    }

    // --------------------------------------------------
    // CLICKS
    // --------------------------------------------------

    const { count: totalClicks, error: clicksError } =
      await supabaseServer
        .from("analytics_events")
        .select("*", {
          count: "exact",
          head: true,
        })
        .in("event_type", [
          "click",
          "link_click",
          "project_click",
          "social_click",
          "cta_click",
        ]);

    if (clicksError) {
      throw clicksError;
    }

    // --------------------------------------------------
    // DOWNLOADS
    // --------------------------------------------------

    const { count: totalDownloads, error: downloadsError } =
      await supabaseServer
        .from("analytics_events")
        .select("*", {
          count: "exact",
          head: true,
        })
        .in("event_type", [
          "download",
          "file_download",
          "cv_download",
        ]);

    if (downloadsError) {
      throw downloadsError;
    }

    // --------------------------------------------------
    // VIDEO EVENTS
    // --------------------------------------------------

    const { count: totalVideoPlays, error: videoPlaysError } =
      await supabaseServer
        .from("analytics_video_events")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("event_type", "video_play");

    if (videoPlaysError) {
      throw videoPlaysError;
    }

    const { count: completedVideos, error: completedError } =
      await supabaseServer
        .from("analytics_video_events")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("event_type", "video_complete");

    if (completedError) {
      throw completedError;
    }

    // --------------------------------------------------
    // RECENT ACTIVITY
    // --------------------------------------------------

    const { data: recentEvents, error: recentEventsError } =
      await supabaseServer
        .from("analytics_events")
        .select(
          `
            id,
            event_type,
            event_name,
            path,
            element_text,
            target_url,
            created_at
          `,
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(10);

    if (recentEventsError) {
      throw recentEventsError;
    }

    // --------------------------------------------------
    // RECENT PAGE VIEWS
    // --------------------------------------------------

    const { data: recentPageViews, error: recentPageViewsError } =
      await supabaseServer
        .from("analytics_page_views")
        .select(
          `
            id,
            path,
            page_title,
            entered_at
          `,
        )
        .order("entered_at", {
          ascending: false,
        })
        .limit(10);

    if (recentPageViewsError) {
      throw recentPageViewsError;
    }

    // --------------------------------------------------
    // MOST VIEWED PAGES
    // --------------------------------------------------

    const { data: pageRows, error: pageRowsError } =
      await supabaseServer
        .from("analytics_page_views")
        .select("path");

    if (pageRowsError) {
      throw pageRowsError;
    }

    const pageCounts = new Map<string, number>();

    for (const row of pageRows ?? []) {
      const path = row.path || "/";

      pageCounts.set(
        path,
        (pageCounts.get(path) ?? 0) + 1,
      );
    }

    const topPages = Array.from(pageCounts.entries())
      .map(([path, views]) => ({
        path,
        views,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // --------------------------------------------------
    // MOST CLICKED ELEMENTS
    // --------------------------------------------------

    const { data: clickRows, error: clickRowsError } =
      await supabaseServer
        .from("analytics_events")
        .select(
          "event_type,event_name,element_id,element_text,target_url",
        )
        .in("event_type", [
          "click",
          "link_click",
          "project_click",
          "social_click",
          "cta_click",
        ]);

    if (clickRowsError) {
      throw clickRowsError;
    }

    const clickCounts = new Map<
      string,
      {
        label: string;
        count: number;
      }
    >();

    for (const row of clickRows ?? []) {
      const label =
        row.element_text ||
        row.event_name ||
        row.element_id ||
        row.target_url ||
        "Unknown element";

      const existing = clickCounts.get(label);

      if (existing) {
        existing.count += 1;
      } else {
        clickCounts.set(label, {
          label,
          count: 1,
        });
      }
    }

    const topClicks = Array.from(clickCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // --------------------------------------------------
    // VIDEO DATA
    // --------------------------------------------------

    const { data: videoRows, error: videoRowsError } =
      await supabaseServer
        .from("analytics_video_events")
        .select(
          `
            event_type,
            position_seconds,
            progress_percent,
            video_id,
            analytics_videos (
              video_key,
              title,
              src
            )
          `,
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(100);

    if (videoRowsError) {
      throw videoRowsError;
    }

    // --------------------------------------------------
    // DOWNLOAD DATA
    // --------------------------------------------------

    const { data: downloadRows, error: downloadRowsError } =
      await supabaseServer
        .from("analytics_events")
        .select(
          `
            id,
            event_name,
            path,
            element_text,
            target_url,
            created_at
          `,
        )
        .in("event_type", [
          "download",
          "file_download",
          "cv_download",
        ])
        .order("created_at", {
          ascending: false,
        })
        .limit(20);

    if (downloadRowsError) {
      throw downloadRowsError;
    }

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      overview: {
        totalVisitors: totalVisitors ?? 0,
        returningVisitors: returningVisitors ?? 0,
        totalSessions: totalSessions ?? 0,
        totalPageViews: totalPageViews ?? 0,
        totalEvents: totalEvents ?? 0,
        totalClicks: totalClicks ?? 0,
        totalDownloads: totalDownloads ?? 0,
        totalVideoPlays: totalVideoPlays ?? 0,
        completedVideos: completedVideos ?? 0,
      },

      topPages,

      topClicks,

      recentEvents: recentEvents ?? [],

      recentPageViews: recentPageViews ?? [],

      videos: videoRows ?? [],

      downloads: downloadRows ?? [],
    });
  } catch (error) {
    console.error(
      "Analytics stats error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load analytics",
      },
      {
        status: 500,
      },
    );
  }
}