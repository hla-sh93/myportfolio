"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

export interface DetailNavItem {
  slug: string;
  title: string;
  coverImage: string;
  href: string;
}

/**
 * Prev/next editorial navigation for detail pages — large teaser cards so the
 * visitor never dead-ends (blueprint §9). Direction-aware: "previous" points
 * backward in reading direction, arrows flip in RTL via rtl: classes.
 */
export function DetailNav({
  prev,
  next,
  prevLabel,
  nextLabel,
}: {
  prev: DetailNavItem | null;
  next: DetailNavItem | null;
  prevLabel: string;
  nextLabel: string;
}) {
  if (!prev && !next) return null;

  const card = (item: DetailNavItem, label: string, isNext: boolean) => (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={isNext ? "md:col-start-2" : ""}
    >
      <Link
        href={item.href}
        className={`group relative block overflow-hidden rounded-3xl border border-border bg-bg-elevated/60 transition-colors hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          isNext ? "text-end" : "text-start"
        }`}
      >
        {/* cover peek — clear image, dark scrim for label legibility */}
        <div className="relative h-44 overflow-hidden md:h-52">
          <Image
            src={item.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 transition-opacity duration-500 group-hover:from-black/85" />
          <span
            className={`absolute bottom-4 ${isNext ? "end-5" : "start-5"} flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white drop-shadow`}
          >
            {!isNext && (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
                <ArrowLeft size={15} className="rtl:rotate-180" />
              </span>
            )}
            {label}
            {isNext && (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                <ArrowRight size={15} className="rtl:rotate-180" />
              </span>
            )}
          </span>
        </div>

        <div className={`p-5 md:p-6 ${isNext ? "text-end" : "text-start"}`}>
          <h3 className="line-clamp-2 text-lg font-black leading-snug text-text-primary transition-colors group-hover:text-accent md:text-xl">
            {item.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <nav aria-label="More" className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {prev && card(prev, prevLabel, false)}
        {next && card(next, nextLabel, true)}
      </div>
    </nav>
  );
}
