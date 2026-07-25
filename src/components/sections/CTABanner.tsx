"use client";

import { Link } from "@/i18n/navigation";
import { Magnetic } from "@/components/ui/Magnetic";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

/* Full-bleed studio finale: near-black wine room, giant invitation,
   one magnetic circular action. */
export function CTABanner() {
  const t = useTranslations("home.ctaBanner");

  return (
    <section className="relative isolate overflow-hidden bg-[#120409] py-28 md:py-40">
      {/* Studio backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-[0.35] [--border:rgba(255,255,255,0.06)]" />
        <div className="ambient-blob -start-24 -top-24 h-96 w-96 bg-[var(--accent-deep)] !opacity-50" />
        <div className="ambient-blob -bottom-32 -end-16 h-80 w-80 bg-[#B91942] !opacity-30 [animation-delay:-9s]" />
      </div>

      {/* Giant ghost word */}
      <span
        aria-hidden
        className="ghost-numeral -end-6 top-6 font-display text-[30vw] leading-none lg:text-[16rem] [--ghost-color:rgba(255,255,255,0.04)]"
      >
        حلا
      </span>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="chip-label !border-white/25 !text-white [--accent:#E64A6E]">
            {t("label")}
          </span>

          <div className="mt-8 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2
                className="font-display font-bold leading-[1.15] text-white"
                style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
              >
                {t("heading")}
                <span className="text-[#E64A6E]">.</span>
              </h2>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
                {t("subheading")}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Magnetic>
                  <Link
                    href="/contact"
                    className="shine group flex items-center gap-2.5 rounded-full bg-white px-9 py-4.5 text-base font-bold text-[#120409] transition-transform duration-300 hover:scale-[1.03]"
                  >
                    <Mail size={17} />
                    {t("primaryButton")}
                  </Link>
                </Magnetic>
                <Link
                  href="/projects"
                  className="group flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-bold text-white transition-colors hover:border-white/60"
                >
                  {t("secondaryButton")}
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Direct line — quiet, factual */}
            <div className="shrink-0 border-s-2 border-[#E64A6E]/40 ps-6 text-sm leading-relaxed text-white/50">
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
      </div>
    </section>
  );
}
