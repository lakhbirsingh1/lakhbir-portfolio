"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics/tracker";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Private analytics dashboard ko analytics mein count nahi karna.
    if (pathname.startsWith("/analytics")) return;

    void trackPageView(pathname);
  }, [pathname]);

  return null;
}