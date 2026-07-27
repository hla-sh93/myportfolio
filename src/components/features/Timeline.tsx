"use client";

import type { TimelineEntry } from "@/types";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

interface TimelineProps {
  entries: TimelineEntry[];
}

/* Drake resume timeline: a thin hairline rail with dot markers that warm
   to burgundy on hover. No cards — the type carries the structure.
   Identical logic in RTL and LTR (logical properties in .resume-item). */
export function Timeline({ entries }: TimelineProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <ol>
      {entries.map((entry, index) => {
        const description = entry.desc ?? (isRtl ? entry.descAr : entry.descEn);
        return (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="resume-item group"
          >
            <span
              className={`meta-mono mb-4 block text-sm transition-colors group-hover:text-accent ${
                entry.current ? "text-accent" : "text-text-tertiary"
              }`}
            >
              {entry.period}
            </span>

            <h3 className="font-display text-xl font-bold text-text-primary md:text-2xl">
              {entry.role}
              {entry.current && (
                <span className="ms-3 inline-block -translate-y-1 rounded-full bg-accent px-3 py-1 align-middle text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  {isRtl ? "الحالي" : "Current"}
                </span>
              )}
            </h3>
            <p className="mt-1.5 text-sm font-medium text-text-secondary">
              {entry.company}
            </p>

            {description && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-tertiary">
                {description}
              </p>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}
