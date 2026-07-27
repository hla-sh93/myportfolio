import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton primitives.
 *
 * Server components on purpose — a loading screen that ships JavaScript is a
 * contradiction. Nothing here uses hooks, refs or event handlers, so route
 * skeletons render straight from the server with zero client bundle cost.
 *
 * The look comes from the `.skeleton` class in globals.css, which is built on
 * the theme tokens (so it reads on the warm light background *and* on studio
 * black) and animates a transform-only sweep.
 */

interface SkeletonProps {
  /** Explicit width — e.g. "60%", 240 */
  width?: string | number;
  /** Explicit height — e.g. "1.25rem", 18 */
  height?: string | number;
  /**
   * Reserve space by ratio instead of height — e.g. "16 / 11".
   * Use this for image placeholders: it's what keeps the swap to the real
   * cover from shifting anything. Pass it here rather than as an `aspect-*`
   * class, so it can't collide with the default height.
   */
  aspect?: string;
  /** Corner radius override — e.g. "30px", "9999px" */
  radius?: string;
  className?: string;
  style?: CSSProperties;
}

const size = (v: string | number | undefined) =>
  typeof v === "number" ? `${v}px` : v;

export function Skeleton({
  width,
  height,
  aspect,
  radius,
  className,
  style,
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "skeleton",
        width === undefined && "w-full",
        height === undefined && aspect === undefined && "h-4",
        className
      )}
      style={{
        width: size(width),
        height: size(height),
        aspectRatio: aspect,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

/** Paragraph placeholder — the last line is short, like real text. */
export function SkeletonText({
  lines = 3,
  height = 12,
  className,
}: {
  lines?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={height}
          width={i === lines - 1 ? "62%" : "100%"}
        />
      ))}
    </div>
  );
}

/** The uppercase pill that opens every section. */
export function SkeletonChip({ width = 132 }: { width?: number }) {
  return <Skeleton width={width} height={34} radius="9999px" />;
}

/**
 * Announces the wait to screen readers.
 *
 * Skeleton blocks are decorative and `aria-hidden`, so without this a screen
 * reader user would hear nothing at all while a route loads. Client component
 * only because the translation lives in the next-intl client context.
 */
export { LoadingStatus } from "./LoadingStatus";
