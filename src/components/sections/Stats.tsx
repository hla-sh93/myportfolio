"use client";

import { Counter } from "@/components/ui/Counter";
import { motion } from "framer-motion";

interface StatsProps {
  stats: { value: number; suffix?: string; label: string }[];
}

/* Agency-style proof strip: giant gradient numerals on hairline rails.
   Every figure is CV-verified. */
export function Stats({ stats }: StatsProps) {
  return (
    <section className="relative border-y border-border py-16 md:py-20">
      {/* faint wine wash behind the strip */}
      <div
        aria-hidden
        className="glow-accent pointer-events-none absolute inset-0 opacity-40"
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: index * 0.08,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col gap-3 lg:border-s lg:border-border lg:px-10 lg:first:border-s-0 lg:first:ps-0"
            >
              <span className="font-display text-4xl font-bold leading-none text-accent md:text-5xl lg:text-6xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-text-secondary md:text-sm">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
