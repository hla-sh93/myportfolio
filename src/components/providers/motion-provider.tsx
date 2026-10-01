"use client";

import { MotionConfig } from "framer-motion";

/**
 * Honour the visitor's reduce-motion setting in every framer-motion
 * animation. The CSS rule in globals.css cannot reach these: they run
 * through the Web Animations API, so without this a visitor who asked for
 * less motion still got every slide, spring and scale.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
