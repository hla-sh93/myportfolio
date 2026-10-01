"use client";

import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

/* Infinite tool marquee — every name comes straight from the CV.
   Editorial scale: big alternating filled/outlined words, not a quiet
   ticker. Pure CSS animation (see .animate-marquee in globals.css);
   reverses in RTL, holds on hover, on focus and from the button, and
   freezes under prefers-reduced-motion. */

const tools = [
  "Figma",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "After Effects",
  "Premiere Pro",
  "React",
  "Next.js",
  "JavaScript",
  "HTML5",
  "CSS3",
  "MUI",
  "Bootstrap",
] as const;

function Words({ offset }: { offset: number }) {
  return (
    <>
      {tools.map((tool, i) => (
        <span key={tool} className="flex items-center">
          <span
            className={`marquee-word px-5 font-display text-xl md:px-8 md:text-3xl ${
              (i + offset) % 2 === 0 ? "text-text-primary" : "text-text-tertiary/50"
            }`}
          >
            {tool}
          </span>
          <span aria-hidden className="text-lg text-accent md:text-xl">
            ✦
          </span>
        </span>
      ))}
    </>
  );
}

export function ToolsMarquee() {
  const t = useTranslations("a11y");
  const [paused, setPaused] = useState(false);

  return (
    <section aria-label={t("tools")} className="relative py-6 md:py-8">
      <div className="marquee-mask overflow-hidden">
        <div
          dir="ltr"
          className={cn("animate-marquee flex w-max items-center", paused && "marquee-paused")}
        >
          <Words offset={0} />
          {/* The second copy only closes the loop; assistive tech reads the
              list once. */}
          <span aria-hidden="true" className="flex items-center">
            <Words offset={tools.length} />
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? t("playMarquee") : t("pauseMarquee")}
        className="absolute bottom-1 end-4 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/80 text-text-secondary backdrop-blur-sm transition-colors hover:text-text-primary"
      >
        {paused ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
      </button>
    </section>
  );
}
