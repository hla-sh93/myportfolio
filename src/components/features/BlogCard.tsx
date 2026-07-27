"use client";

import { Link } from "@/i18n/navigation";
import type { ArticleWithMeta } from "@/types";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface BlogCardProps {
  article: ArticleWithMeta;
  index?: number;
}

/**
 * Journal card — a contained hairline object rather than loose type on the page.
 *
 * The cover sits inside the card with its own inset radius, the tag and date
 * share one quiet meta line, and the footer carries reading time / views next
 * to the arrow. Hover warms the whole card to burgundy (border, title, arrow)
 * — no underline: a rule under Arabic type crowds the descenders and reads
 * as a mistake.
 */
export function BlogCard({ article, index = 0 }: BlogCardProps) {
  const locale = useLocale();
  const t = useTranslations("blog");
  const isRtl = locale === "ar";

  const title = isRtl ? article.titleAr : article.titleEn;
  const excerpt = isRtl ? article.excerptAr : article.excerptEn;
  const category = article.tags[0];

  const dateLocale = isRtl ? arSA : enUS;
  const publishDate = article.publishedAt
    ? format(new Date(article.publishedAt), "d MMM yyyy", { locale: dateLocale })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
      className="h-full"
    >
      <Link
        href={`/blog/${article.slug}`}
        className="group block h-full rounded-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <article className="card-line flex h-full flex-col p-3 transition-colors duration-300">
          {/* Cover */}
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[22px] border border-border bg-surface">
            <Image
              src={article.coverImage || "/images/placeholder.jpg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col px-3 pb-2 pt-5">
            {/* Tag + date — one calm line */}
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
              {category && (
                <span className="rounded-full bg-accent-light px-3 py-1 text-accent">
                  {category}
                </span>
              )}
              <span>{publishDate}</span>
            </div>

            <h3 className="mt-4 line-clamp-2 min-h-[3.2rem] font-display text-lg font-bold leading-snug text-text-primary transition-colors duration-300 group-hover:text-accent md:text-xl">
              {title}
            </h3>

            <p className="mb-5 mt-2.5 line-clamp-2 min-h-[2.6rem] text-sm leading-relaxed text-text-secondary">
              {excerpt}
            </p>

            {/* Footer — pinned to the bottom so every card lines up */}
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex items-center gap-4 text-xs font-semibold text-text-tertiary">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readTime} {t("minRead")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span className="tabular-nums">
                    {(article.views ?? 0).toLocaleString()}
                  </span>
                </span>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-text-secondary transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white rtl:-scale-x-100">
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
