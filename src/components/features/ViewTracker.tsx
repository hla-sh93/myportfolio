"use client";

import { useEffect } from "react";
import { readStorage, writeStorage } from "@/lib/safe-storage";

const SESSION_FLAG = "session:started";

/** Dedup for this tab when sessionStorage is unavailable (blocked storage). */
const seenInTab = new Set<string>();

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
    if (seenInTab.has(key) || readStorage("session", key)) return;
    seenInTab.add(key);
    writeStorage("session", key, "1");

    const newSession =
      !seenInTab.has(SESSION_FLAG) && !readStorage("session", SESSION_FLAG);
    seenInTab.add(SESSION_FLAG);
    if (newSession) writeStorage("session", SESSION_FLAG, "1");

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug, action: "view", newSession }),
      keepalive: true,
    }).catch(() => {});
  }, [type, slug]);

  return null;
}
