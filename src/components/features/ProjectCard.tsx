"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ProjectWithStats } from "@/types";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { LikeButton } from "./LikeButton";

const categoryKeyMap: Record<string, string> = {
  VIDEOS: "videos",
  GRAPHIC_DESIGN: "graphic-design",
  UIUX: "uiux",
  WEBSITES: "websites",
};

type ProjectWithViews = ProjectWithStats & { views?: number };

interface ProjectCardProps {
  project: ProjectWithViews;
  view?: "grid" | "list";
  className?: string;
  index?: number;
}

/* Drake portfolio item: 30px-radius cover with white category chips pinned
   bottom-start, light-weight title below that underlines on hover. */
export function ProjectCard({
  project,
  view = "grid",
  className,
  index = 0,
}: ProjectCardProps) {
  const locale = useLocale();
  const t = useTranslations("projects");
  const isGrid = view === "grid";

  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const description = locale === "ar" ? project.descAr : project.descEn;
  const views = project.views ?? 0;
  const categoryLabel = t(
    `categories.${categoryKeyMap[project.category] || project.category.toLowerCase()}` as Parameters<
      typeof t
    >[0]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
      className={className}
    >
      <Link
        href={`/projects/detail/${project.slug}`}
        className={cn(
          "group block h-full rounded-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          !isGrid && "card-line card-line-static flex flex-col gap-5 p-4 sm:flex-row"
        )}
      >
        {/* Cover */}
        <div
          className={cn(
            "relative overflow-hidden border border-border bg-surface",
            isGrid
              ? "aspect-[16/11] w-full rounded-[30px]"
              : "aspect-video w-full shrink-0 rounded-[22px] sm:aspect-[4/3] sm:w-72"
          )}
        >
          <Image
            src={project.coverImage || "/images/placeholder.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            sizes={
              isGrid
                ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                : "(max-width: 640px) 100vw, 288px"
            }
            placeholder={project.blurDataUrl ? "blur" : "empty"}
            blurDataURL={project.blurDataUrl || undefined}
          />

          {/* Category chip — Drake white pill on the image */}
          <span className="absolute bottom-4 start-4 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
            {categoryLabel}
          </span>

          {/* Favorite — icon only, on the image */}
          <span className="absolute end-3 top-3 z-10">
            <LikeButton slug={project.slug} variant="overlay" />
          </span>
        </div>

        {/* Content */}
        <div className={cn("flex flex-1 flex-col", isGrid ? "px-1 pt-5" : "py-2")}>
          <div className="flex items-start justify-between gap-3">
            {/* Hover recolours the title instead of underlining it — a rule
                under Arabic type collides with the descenders. */}
            <h3 className="line-clamp-1 font-display text-lg font-bold text-text-primary transition-colors duration-300 group-hover:text-accent md:text-xl">
              {title}
            </h3>
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-strong text-text-secondary transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-rotate-45">
              <ArrowUpRight size={14} />
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
            {description}
          </p>

          <div className="mt-auto flex items-center gap-1.5 pt-3 text-text-tertiary">
            <Eye className="h-4 w-4" />
            <span className="text-xs font-semibold tabular-nums">
              {views.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
