"use client";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { ProjectCardData } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: ProjectCardData[];
  initialCategory?: string;
}

const CATEGORIES = ["ALL", "VIDEOS", "GRAPHIC_DESIGN", "UIUX", "WEBSITES"] as const;
type Category = (typeof CATEGORIES)[number];

/* Clears the fixed nav pill: 16px of top padding plus its 56px height,
   then 8px of air. Keep in sync with layout/navbar.tsx. */
const STICKY_TOP = 80;

const categoryTranslationKey: Record<Category, string> = {
  ALL: "categories.all",
  VIDEOS: "categories.videos",
  GRAPHIC_DESIGN: "categories.graphic-design",
  UIUX: "categories.uiux",
  WEBSITES: "categories.websites",
};

export function ProjectGrid({ projects, initialCategory = "ALL" }: ProjectGridProps) {
  const t = useTranslations("projects");
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory as Category);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  /* The controls bar sticks under the floating nav pill so the filters stay
     reachable deep into a 55-card grid. The sentinel tells us when it has
     actually stuck, so the acrylic backing only appears once it is needed. */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: `-${STICKY_TOP + 1}px 0px 0px 0px`, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchCategory = activeCategory === "ALL" || project.category === activeCategory;
      const matchQuery =
        project.titleEn.toLowerCase().includes(query.toLowerCase()) ||
        project.titleAr.toLowerCase().includes(query.toLowerCase()) ||
        project.descEn.toLowerCase().includes(query.toLowerCase()) ||
        project.descAr.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [projects, activeCategory, query]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Controls Bar */}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      <div
        style={{ top: STICKY_TOP }}
        className={cn(
          // bleeds into the page gutter so cards never show at the edges
          "sticky z-30 -mx-6 flex flex-col justify-between gap-4 px-6 py-3 transition-[background-color,border-color,box-shadow] duration-300 lg:-mx-8 lg:px-8 md:flex-row md:items-center",
          stuck
            ? "rounded-2xl border border-border bg-surface-acrylic shadow-lg backdrop-blur-2xl"
            : "border border-transparent bg-transparent"
        )}
      >
        {/* Category filters — every one of them, at every width.
            These used to sit in a scroll rail with the scrollbar hidden, so on
            a narrow screen the last filter slid off the edge with nothing to
            say it was there and read as missing. They wrap now, like the blog
            and certificate filters do. */}
        <div className="flex-1">
          {/* isolate keeps the -z-10 active pill from sliding behind the
              acrylic backing once the bar sticks */}
          <div className="flex flex-wrap items-center gap-2 isolate">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
                  activeCategory === category
                    ? "text-white"
                    : "text-text-secondary hover:text-text-primary hover:bg-accent-light"
                )}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="category-pill"
                    className="absolute inset-0 bg-accent rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                {t(categoryTranslationKey[category] as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>

        {/* Search & View Toggle. On a phone the whole bar is three rows tall,
            so once it sticks these fold away and leave the filters, which are
            what you actually reach for mid-scroll. An active query keeps them
            on screen, otherwise there would be no way to see or clear it. */}
        <div
          className={cn(
            "flex items-center gap-4 shrink-0",
            stuck && !query && "max-md:hidden"
          )}
        >
          <div className="w-full md:w-64">
            <Input
              type="text"
              placeholder={t("filters.search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          {/* Shown at every width too: list view stacks into a bordered card
              on a phone, so the toggle still does something there. */}
          <div className="flex shrink-0 items-center bg-surface rounded-full p-1 border border-border isolate">
            <button
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn(
                "relative p-2 rounded-full transition-colors",
                view === "grid" ? "text-white" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {view === "grid" && (
                <motion.div
                  layoutId="view-pill"
                  className="absolute inset-0 bg-accent rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn(
                "relative p-2 rounded-full transition-colors",
                view === "list" ? "text-white" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {view === "list" && (
                <motion.div
                  layoutId="view-pill"
                  className="absolute inset-0 bg-accent rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid rendering */}
      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Search className="w-12 h-12 text-text-tertiary mb-4" />
          <h3 className="text-xl font-medium text-text-primary mb-1">No results found</h3>
          <p className="text-text-secondary">Try a different search term or category.</p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className={cn(
            "grid gap-6",
            view === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} view={view} index={index} titleAs="h2" />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
