"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

/* Drake "ABOUT" block: chip, statement heading, story paragraphs, quiet link. */
export function AboutSnippet() {
  const t = useTranslations("home.about");

  return (
    <section className="relative py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="chip-label">{t("sectionTitle")}</span>

        <h2 className="title-display mt-9 max-w-2xl font-display text-3xl md:text-4xl">
          {t("statement")}
        </h2>

        <div className="mt-8 max-w-2xl space-y-4 leading-relaxed text-text-secondary">
          <p>{t("paragraph1")}</p>
          <p>{t("paragraph2")}</p>
        </div>

        <Link
          href="/about"
          className="group mt-9 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-text-primary transition-colors hover:text-accent"
        >
          <span className="border-b border-current pb-0.5">{t("cta")}</span>
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
          />
        </Link>
      </motion.div>
    </section>
  );
}
