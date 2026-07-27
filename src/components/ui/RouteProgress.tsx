"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Hairline bar that reports a route change the instant a link is clicked.
 *
 * `loading.tsx` skeletons cover the wait *inside* the page; this covers the
 * gap before the new route commits — including navigations so fast that no
 * skeleton ever shows. It listens on the capture phase from a single
 * document-level listener (no wrapper component around every Link) and
 * animates `transform: scaleX` only, so it never triggers layout.
 */

/** Never leave the bar running longer than this (ms). */
const STALL_MS = 8000;

export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const start = () => {
      clearTimers();
      setActive(true);
      setProgress(0.08);
      // Creep toward — but never reach — the end while the route resolves.
      timers.current.push(setTimeout(() => setProgress(0.45), 90));
      timers.current.push(setTimeout(() => setProgress(0.72), 380));
      timers.current.push(setTimeout(() => setProgress(0.88), 1100));
      // Safety valve: a navigation that never commits must not hang the bar.
      timers.current.push(setTimeout(() => setActive(false), STALL_MS));
    };

    const onClick = (e: MouseEvent) => {
      // Let the browser own anything that isn't a plain left-click nav.
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      // Same-document (hash) links and external origins never trigger a
      // route transition, so they must not trigger the bar either.
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      start();
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", start);

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", start);
      clearTimers();
    };
  }, []);

  // The new route committed — snap to full, then fade out.
  useEffect(() => {
    if (!active) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setProgress(1);
    const done = setTimeout(() => setActive(false), 280);
    return () => clearTimeout(done);
    // Intentionally keyed on pathname only: it changes exactly once per commit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      className="route-bar"
      aria-hidden="true"
      style={{
        transform: `scaleX(${active ? progress : 1})`,
        opacity: active ? 1 : 0,
      }}
    />
  );
}
