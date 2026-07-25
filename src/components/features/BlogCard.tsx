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

/* Mivon journal card: 30px-radius cover with a white category chip,
   uppercase CATEGORY | DATE meta, light-weight title that underlines
   on hover — type does the work, no filled card box. */
export function BlogCard({ article, index = 0 }: BlogCardProps) {
  const locale = useLocale();
  const t = useTranslations("blog");
  const isRtl = locale === "ar";

  const title = isRtl ? article.titleAr : article.titleEn;
  const excerpt = isRtl ? article.excerptAr : article.excerptEn;
  const category = article.tags[0];

  const dateLocale = isRtl ? arSA : enUS;
  const publishDate = article.publishedAt
    ? format(new Date(article.publishedAt), "MMM d, yyyy", { locale: dateLocale })
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
        <article className="flex h-full flex-col">
          {/* Cover */}
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[30px] border border-border bg-surface">
            <Image
              src={article.coverImage || "/images/placeholder.jpg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {category && (
              <span className="absolute bottom-4 start-4 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                {category}
              </span>
            )}
            {/* hover arrow */}
            <span className="absolute end-4 top-4 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight size={18} className="rtl:-scale-x-100" />
            </span>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col px-1 pt-5">
            <div className="mb-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
              <span>{publishDate}</span>
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

            <h3 className="line-clamp-2 min-h-[3.6rem] font-display text-xl font-bold leading-snug text-text-primary md:text-2xl">
              <span className="border-b border-transparent pb-0.5 transition-colors duration-300 group-hover:border-current">
                {title}
              </span>
            </h3>

            <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-text-secondary">
              {excerpt}
            </p>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
