"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Clapperboard, Code2, Palette, PenTool } from "lucide-react";
import { useTranslations } from "next-intl";

const services = [
  {
    titleKey: "uiux.title",
    descKey: "uiux.desc",
    href: "/projects?category=UIUX",
    category: "UIUX",
    icon: PenTool,
  },
  {
    titleKey: "websites.title",
    descKey: "websites.desc",
    href: "/projects?category=WEBSITES",
    category: "WEBSITES",
    icon: Code2,
  },
  {
    titleKey: "branding.title",
    descKey: "branding.desc",
    href: "/projects?category=GRAPHIC_DESIGN",
    category: "GRAPHIC_DESIGN",
    icon: Palette,
  },
  {
    titleKey: "video.title",
    descKey: "video.desc",
    href: "/projects?category=VIDEOS",
    category: "VIDEOS",
    icon: Clapperboard,
  },
] as const;

interface ServicesProps {
  counts?: Partial<Record<string, number>>;
}

/* Drake "My Specializations": hairline cards at 20px radius, accent icon
   in the corner, project count as the quiet proof line. */
export function Services({ counts }: ServicesProps) {
  const t = useTranslations("home.services");

  return (
    <section className="relative py-16 md:py-24">
      <span className="chip-label">{t("sectionTitle")}</span>
      <h2 className="title-display mt-9 font-display text-3xl md:text-4xl">
        {t("heading")}
      </h2>
      <p className="mt-5 max-w-xl leading-relaxed text-text-secondary">
        {t("description")}
      </p>

      <div className="mt-12 flex flex-col gap-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          const count = counts?.[service.category] ?? 0;

          return (
            <motion.div
              key={service.titleKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: index * 0.06,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={service.href}
                className="group relative block rounded-[20px] border border-border-strong p-8 transition-colors duration-300 hover:border-accent md:p-11"
              >
                <Icon
                  size={30}
                  aria-hidden
                  className="absolute end-8 top-8 text-accent md:end-11 md:top-10"
                />
                <h3 className="pe-14 font-display text-xl font-bold text-text-primary transition-colors group-hover:text-accent md:text-2xl">
                  {t(service.titleKey)}
                </h3>
                <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-text-secondary">
                  {t(service.descKey)}
                </p>
                {count > 0 && (
                  <span className="mt-7 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-text-primary group-hover:underline">
                    {t("projectsCount", { count })}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
