import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * The 404 for every locale route.
 *
 * Without this file an unknown URL fell through to Next's bare default —
 * no layout, no `lang`/`dir`, English only, system font — which is the one
 * page a lost visitor is guaranteed to see. This one keeps the navbar and
 * footer, speaks the visitor's language, and points at the two places they
 * most likely wanted.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="glow-accent absolute -end-40 -top-40 h-[480px] w-[480px] opacity-60" />
        <span
          className="absolute -top-6 end-0 select-none font-display text-[26vw] font-black leading-none text-text-primary opacity-[0.05] md:text-[14rem]"
          dir="ltr"
        >
          404
        </span>
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
          <Link href="/" className="btn-pill">
            {t("home")}
          </Link>
          <Link href="/projects" className="btn-pill btn-pill-ghost">
            {t("projects")}
            <ArrowUpRight size={15} className="rtl:-scale-x-100" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
