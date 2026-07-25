"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Custom cursor — accent dot + lazy trailing ring that swells over
 * interactive elements. Fine-pointer devices only; disabled with
 * prefers-reduced-motion. The native cursor stays visible (no cursor:none)
 * so usability never depends on the effect.
 */
export function CursorRing() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setActive(!!t?.closest("a, button, [role=button], input, textarea, select, [data-cursor]"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block">
      {/* instant dot */}
      <motion.div
        style={{ x, y }}
        className="absolute -ms-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent"
      />
      {/* lazy ring — outer div carries the motion transform, inner one
          centers itself so the two transforms don't fight */}
      <motion.div style={{ x: ringX, y: ringY }} className="absolute">
        <motion.div
          animate={{
            width: active ? 44 : 28,
            height: active ? 44 : 28,
            opacity: active ? 0.9 : 0.5,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent"
        />
      </motion.div>
    </div>
  );
}
