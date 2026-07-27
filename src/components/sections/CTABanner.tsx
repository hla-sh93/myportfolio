"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * The closing invitation, in two shapes:
 *
 *  full (default) — a full-bleed wine room that ends the inner pages.
 *  contained      — a rounded card that sits inside the home page's content
 *                   column, so it keeps the same rhythm as the sections above
 *                   it instead of breaking out of the layout.
 */
export function CTABanner({ contained = false }: { contained?: boolean }) {
  const t = useTranslations("home.ctaBanner");

  const Body = (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="chip-label !border-white/25 !text-white [--accent:#E64A6E]">
        {t("label")}
      </span>

      <div
        className={
          contained
            ? "mt-8"
            : "mt-8 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between"
        }
      >
        <div className={contained ? "" : "max-w-3xl"}>
          <h2
            className="font-display font-bold leading-[1.15] text-white"
            style={{
              fontSize: contained
                ? "clamp(1.9rem, 4vw, 3rem)"
                : "clamp(2.5rem, 7vw, 5.5rem)",
            }}
          >
            {t("heading")}
            <span className="text-[#E64A6E]">.</span>
          </h2>
          <p
            className={`mt-5 max-w-xl leading-relaxed text-white/70 ${
              contained ? "" : "mt-8 text-lg md:text-xl"
            }`}
          >
            {t("subheading")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Anchored on purpose: this used to be magnetic + scale-on-hover,
                which made the button chase the cursor and jitter at its own
                edge. The hover now only changes colour. */}
            <Link
              href="/contact"
              className={`shine group flex items-center gap-2.5 rounded-full bg-white font-bold text-[#120409] transition-colors duration-300 hover:bg-[#E64A6E] hover:text-white ${
                contained ? "px-7 py-3.5 text-sm" : "px-9 py-4.5 text-base"
              }`}
            >
              <Mail size={contained ? 15 : 17} />
              {t("primaryButton")}
            </Link>
            <Link
              href="/projects"
              className={`group flex items-center gap-2 rounded-full border border-white/25 font-bold text-white transition-colors hover:border-white/60 ${
                contained ? "px-6 py-3 text-sm" : "px-8 py-4 text-base"
              }`}
            >
              {t("secondaryButton")}
              <ArrowUpRight
                size={contained ? 15 : 16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Direct line — quiet, factual */}
        <div
          className={`shrink-0 border-s-2 border-[#E64A6E]/40 ps-5 text-sm leading-relaxed text-white/50 ${
            contained ? "mt-10" : ""
          }`}
        >
          <p className="font-bold uppercase tracking-[0.18em] text-white/70">
            {t("directLabel")}
          </p>
          <a
            dir="ltr"
            href="mailto:hla.shindeah@gmail.com"
            className="mt-2 block font-mono text-white/80 transition-colors hover:text-white"
          >
            hla.shindeah@gmail.com
          </a>
        </div>
      </div>
    </motion.div>
  );

  const backdrop = (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-[0.35] [--border:rgba(255,255,255,0.06)]" />
        <div className="ambient-blob -start-24 -top-24 h-96 w-96 bg-[var(--accent-deep)] !opacity-50" />
        <div className="ambient-blob -bottom-32 -end-16 h-80 w-80 bg-[#B91942] !opacity-30 [animation-delay:-9s]" />
      </div>
      <span
        aria-hidden
        className={`ghost-numeral -end-6 top-6 font-display leading-none [--ghost-color:rgba(255,255,255,0.04)] ${
          contained ? "text-[9rem] lg:text-[12rem]" : "text-[30vw] lg:text-[16rem]"
        }`}
      >
        حلا
      </span>
    </>
  );

  if (contained) {
    return (
      <section className="relative py-16 md:py-24">
        <div className="relative isolate overflow-hidden rounded-[30px] bg-[#120409] px-7 py-12 md:px-12 md:py-16">
          {backdrop}
          <div className="relative z-10">{Body}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#120409] py-28 md:py-40">
      {backdrop}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        {Body}
      </div>
    </section>
  );
}
