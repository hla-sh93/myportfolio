"use client";

import { useEffect } from "react";

const SESSION_FLAG = "session:started";

/**
 * Fires one "view" per browser session per slug (sessionStorage dedup) and
 * flags the first hit of the session so the server can count a visitor
 * separately from a page view. Renders nothing.
 */
export function ViewTracker({
  type,
  slug,
}: {
  type: "project" | "article" | "page";
  slug: string;
}) {
  useEffect(() => {
    const key = `viewed:${type}:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    const newSession = !sessionStorage.getItem(SESSION_FLAG);
    if (newSession) sessionStorage.setItem(SESSION_FLAG, "1");

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug, action: "view", newSession }),
      keepalive: true,
    }).catch(() => {});
  }, [type, slug]);

  return null;
}
