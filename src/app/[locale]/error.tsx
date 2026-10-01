"use client"; // Error boundaries must be Client Components

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * The error page for every locale route.
 *
 * Without it, any render error — a failed database read, a component that
 * throws — replaced the whole page with Next's bare English message, with no
 * navbar and no RTL. This one sits inside the locale layout, so the navbar,
 * footer, fonts and direction all survive, and it offers a retry before a
 * way home. It is the not-found page's twin on purpose.
 */
export default function LocaleError({ retry }: { error: Error; retry: () => void }) {
  const t = useTranslations("error");

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="glow-accent absolute -end-40 -top-40 h-[480px] w-[480px] opacity-60" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 pb-24 pt-32 lg:px-8 md:pb-32">
        <span className="chip-label">{t("label")}</span>
        <h1 className="title-display mt-9 max-w-3xl font-display text-3xl md:text-5xl lg:text-6xl">
          {t("title")}
          <span>.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl">
          {t("description")}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button type="button" onClick={() => retry()} className="btn-pill">
            {t("retry")}
          </button>
          <Link href="/" className="btn-pill btn-pill-ghost">
            {t("home")}
          </Link>
        </div>
      </div>
    </section>
  );
}
