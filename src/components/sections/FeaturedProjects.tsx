"use client";

import { Link } from "@/i18n/navigation";
import type { ProjectWithStats } from "@/types";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface FeaturedProjectsProps {
  projects: ProjectWithStats[];
}

const CATEGORY_LABEL_KEY: Record<string, string> = {
  UIUX: "uiux",
  WEBSITES: "websites",
  GRAPHIC_DESIGN: "graphic-design",
  VIDEOS: "videos",
};

/* Drake portfolio grid: 30px-radius covers, white category chips pinned
   to the image, light-weight title underneath that underlines on hover.
   First project takes the full row. */
export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const t = useTranslations("home.featured");
  const tCats = useTranslations("projects.categories");
  const locale = useLocale();
  const isAr = locale === "ar";

  if (!projects || projects.length === 0) return null;

  const items = projects.slice(0, 5);

  return (
    <section className="relative py-16 md:py-24">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="chip-label">{t("sectionTitle")}</span>
          <h2 className="title-display mt-9 font-display text-3xl md:text-4xl">
            {t("heading")}
          </h2>
        </div>
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-primary transition-colors hover:text-accent"
        >
          <span className="border-b border-current pb-0.5">{t("viewAll")}</span>
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
          />
        </Link>
      </div>

      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {items.map((project, index) => {
          const title = isAr ? project.titleAr : project.titleEn;
          const isFull = index === 0;
          const catKey = CATEGORY_LABEL_KEY[project.category];

          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: (index % 2) * 0.08,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={isFull ? "md:col-span-2" : undefined}
            >
              <Link href={`/projects/detail/${project.slug}`} className="group block">
                <div
                  className={`relative overflow-hidden rounded-[30px] border border-border ${
                    isFull ? "aspect-[16/8]" : "aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={project.coverImage}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    sizes={
                      isFull
                        ? "(max-width: 1024px) 100vw, 60vw"
                        : "(max-width: 768px) 100vw, 30vw"
                    }
                    placeholder={project.blurDataUrl ? "blur" : "empty"}
                    blurDataURL={project.blurDataUrl || undefined}
                  />

                  {/* Category chips — Drake white pills on the image */}
                  <ul className="absolute bottom-5 start-5 flex flex-wrap gap-2">
                    {catKey && (
                      <li className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                        {tCats(catKey)}
                      </li>
                    )}
                    {project.tools[0] && (
                      <li
                        dir="ltr"
                        className="rounded-full bg-white/85 px-4 py-1.5 text-xs font-semibold text-black backdrop-blur-sm"
                      >
                        {project.tools[0]}
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4 px-1">
                  <h3 className="font-display text-lg font-bold leading-snug text-text-primary transition-colors duration-300 group-hover:text-accent md:text-2xl">
                    {title}
                  </h3>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong text-text-secondary transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-rotate-45">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
