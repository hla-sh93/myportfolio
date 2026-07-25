"use client";

import { Link } from "@/i18n/navigation";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface HomeIntroProps {
  stats: { value: number; suffix?: string; label: string }[];
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { stiffness: 50, damping: 20, mass: 1 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, spring, value]);

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

/* Drake hero: chip → oversized light heading with a burgundy line →
   description → CTAs → giant accent facts. */
export function HomeIntro({ stats }: HomeIntroProps) {
  const t = useTranslations();

  return (
    <section className="relative pb-16 pt-4 md:pb-24 md:pt-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="chip-label">{t("home.intro.label")}</span>

        <h1 className="title-display mt-9 font-display text-[clamp(2rem,4.4vw,3.8rem)]">
          {t("hero.greeting")} {t("hero.name")} —
          <br />
          {t("hero.titleL1")} <span>{t("hero.titleL2")}</span>
        </h1>

        <p className="mt-7 max-w-lg leading-relaxed text-text-secondary">
          {t("hero.description")}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link href="/projects" className="btn-pill">
            {t("hero.cta")}
            <ArrowDownRight size={16} className="rtl:-scale-x-100" aria-hidden />
          </Link>
          <Link href="/contact" className="btn-pill btn-pill-ghost">
            {t("hero.contact")}
          </Link>
        </div>
      </motion.div>

      {/* Facts — Drake's giant accent numerals */}
      <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 md:mt-20 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              delay: index * 0.08,
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="block font-display text-4xl font-bold leading-none text-accent md:text-5xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </span>
            <span className="mt-4 block max-w-[180px] text-xs font-medium uppercase leading-relaxed tracking-[0.1em] text-text-secondary">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
