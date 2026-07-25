import { ViewTracker } from "@/components/features/ViewTracker";
import { CertificatesGrid } from "@/components/features/CertificatesGrid";
import { SkillsGrid } from "@/components/features/SkillsGrid";
import { Timeline } from "@/components/features/Timeline";
import { CTABanner } from "@/components/sections/CTABanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stats } from "@/components/sections/Stats";
import type { TimelineEntry } from "@/types";
import { getCertificates, getExperiences, getHighlights } from "@/lib/content";
import { getTranslations } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("about");

  // Career history — admin-managed (seeded from the CV), newest first.
  // "Present"/"الآن" in the period marks the current role.
  const experiences: TimelineEntry[] = (await getExperiences(locale)).map((e) => ({
    ...e,
    current: /present|الآن|حتى الان/i.test(e.period),
  }));
  const certificates = await getCertificates();

  return (
    <>
      <ViewTracker type="page" slug="about" />
      {/* Page hero — editorial: giant faint backdrop word + statement */}
      <header className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="glow-accent absolute -end-40 -top-40 h-[480px] w-[480px] opacity-70" />
          <div className="glow-accent absolute -bottom-56 -start-40 h-[420px] w-[420px] opacity-50" />
          <span
            className="absolute -top-8 end-0 select-none font-display text-[22vw] font-black leading-none text-text-primary opacity-[0.05] md:text-[12rem]"
            dir="ltr"
          >
            {locale === "ar" ? "حلا" : "HLA"}
          </span>
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 lg:px-8 md:pb-20 md:pt-32">
          <span className="chip-label">{t("subtitle")}</span>
          <h1 className="title-display mt-9 max-w-4xl font-display text-3xl md:text-5xl lg:text-6xl">
            {t("heading")}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            {t("description")}
          </p>
        </div>
      </header>

      {/* The numbers carry the momentum */}
      <Stats stats={await getHighlights(locale)} />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Experience — a decade drifting behind the timeline */}
        <section className="relative border-t border-border py-16 md:py-24">
          <span
            aria-hidden
            className="pointer-events-none absolute -end-8 top-24 select-none font-display text-[9rem] font-black leading-none text-text-primary opacity-[0.04] md:text-[13rem]"
            dir="ltr"
          >
            10+
          </span>
          <div className="relative grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <SectionHeader
                  index="01"
                  label={t("subtitle")}
                  title={t("experience.title")}
                  className="mb-0 md:mb-0"
                />
              </div>
            </div>
            <div className="lg:col-span-8">
              <Timeline entries={experiences} />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="border-t border-border py-16 md:py-24">
          <SectionHeader
            index="02"
            label={t("subtitle")}
            title={t("skills.title")}
          />
          <SkillsGrid />
        </section>

        {/* Certificates — admin-managed; hidden while the list is empty */}
        {certificates.length > 0 && (
          <section className="border-t border-border py-16 md:py-24">
            <SectionHeader
              index="03"
              label={t("certificates.label")}
              title={t("certificates.title")}
              description={t("certificates.description")}
            />
            <CertificatesGrid items={certificates} />
          </section>
        )}
      </div>

      <CTABanner />
    </>
  );
}
