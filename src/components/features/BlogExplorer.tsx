"use client";

import { BlogCard } from "@/components/features/BlogCard";
import { Input } from "@/components/ui/Input";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

/* The four content pillars — first tag of every article */
const CATEGORIES = [
  "ALL",
  "UI/UX",
  "Front-End",
  "Graphic Design",
  "Product Design",
] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABEL_AR: Record<Category, string> = {
  ALL: "الكل",
  "UI/UX": "UI/UX",
  "Front-End": "فرونت-إند",
  "Graphic Design": "جرافيك",
  "Product Design": "تصميم منتج",
};

/* Whatever BlogCard accepts is what we filter — stays in sync automatically */
export type ExplorerArticle = React.ComponentProps<typeof BlogCard>["article"];

export function BlogExplorer({
  articles,
  locale,
}: {
  articles: ExplorerArticle[];
  locale: string;
}) {
  const t = useTranslations("blog");
  const isAr = locale === "ar";
  const [category, setCategory] = useState<Category>("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const inCategory = category === "ALL" || a.tags.includes(category);
      if (!inCategory) return false;
      if (!q) return true;
      return [a.titleEn, a.titleAr, a.excerptEn, a.excerptAr, ...a.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [articles, category, query]);

  return (
    <div>
      {/* Filter rail — mirrors the projects explorer */}
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`relative cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="blog-cat-pill"
                    className="absolute inset-0 rounded-full bg-accent shadow-[0_0_20px_var(--accent-glow)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {isAr ? CATEGORY_LABEL_AR[c] : c === "ALL" ? "All" : c}
                </span>
              </button>
            );
          })}
        </div>

        <div className="w-full md:w-72">
          <Input
            id="blog-search"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Result count */}
      <p className="mb-8 text-sm font-medium text-text-secondary" aria-live="polite">
        {t("resultsCount", { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-24 text-center">
          <p className="text-lg font-semibold text-text-primary">{t("noResults")}</p>
          <p className="mt-2 text-sm text-text-secondary">{t("noResultsHint")}</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((article, index) => (
              <motion.div
                layout
                key={article.id}
                className="h-full"
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 30,
                  delay: index * 0.03,
                }}
              >
                <BlogCard article={article} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
