"use client";

import { Link } from "@/i18n/navigation";
import type { ArticleWithMeta } from "@/types";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface LatestBlogProps {
  articles: ArticleWithMeta[];
}

/* Editorial article index: numbered rows, cover slides in on hover. */
export function LatestBlog({ articles }: LatestBlogProps) {
  const t = useTranslations("home.blog");
  const locale = useLocale();
  const isAr = locale === "ar";
  const dateLocale = isAr ? arSA : enUS;

  if (!articles || articles.length === 0) return null;

  return (
    <section className="relative py-16 md:py-24">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end"
        >
          <div>
            <span className="chip-label">{t("sectionTitle")}</span>
            <h2 className="title-display mt-9 font-display text-3xl md:text-4xl">
              {t("heading")}
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-primary transition-colors hover:text-accent"
          >
            <span className="border-b border-current pb-0.5">{t("viewAll")}</span>
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            />
          </Link>
        </motion.div>

        <div>
          {articles.slice(0, 3).map((article, index) => {
            const title = isAr ? article.titleAr : article.titleEn;
            const excerpt = isAr ? article.excerptAr : article.excerptEn;
            const date = article.publishedAt
              ? format(new Date(article.publishedAt), "d MMMM yyyy", {
                  locale: dateLocale,
                })
              : null;

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={`/blog/${article.slug}`}
                  className="index-row group py-6 md:py-8"
                >
                  <div className="relative z-10 flex items-center gap-5 px-1 md:gap-8 md:px-4">
                    <span
                      dir="ltr"
                      className="font-mono text-sm font-bold text-text-tertiary transition-colors group-hover:text-accent"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                        {article.tags[0] && (
                          <span className="text-accent">{article.tags[0]}</span>
                        )}
                        {date && <time>{date}</time>}
                      </div>
                      <h3 className="font-display text-xl font-bold leading-snug text-text-primary transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-2xl lg:text-3xl rtl:group-hover:-translate-x-2">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="mt-2 line-clamp-1 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
                          {excerpt}
                        </p>
                      )}
                    </div>

                    {/* Cover peek — slides in on hover (desktop) */}
                    {article.coverImage && (
                      <span className="pointer-events-none hidden h-20 w-32 shrink-0 -rotate-3 overflow-hidden rounded-lg border border-border opacity-0 shadow-lg transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0 group-hover:opacity-100 lg:block">
                        <Image
                          src={article.coverImage}
                          alt=""
                          width={256}
                          height={160}
                          className="h-full w-full object-cover"
                        />
                      </span>
                    )}

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-400 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-white md:h-14 md:w-14 rtl:-scale-x-100 rtl:group-hover:-rotate-45">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
