import { ViewTracker } from "@/components/features/ViewTracker";
import { ProjectGrid } from "@/components/features/ProjectGrid";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublicProjects, projectCard } from "@/lib/content";
import { getCounters } from "@/lib/counters";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "projects" });
  return localizedPageMetadata({
    locale,
    path: "/projects",
    title: t("heading"),
    description: t("description"),

    card: "projects",
  });
}


export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  // live engagement counters (views/likes) merged onto static content
  const counters = await getCounters("project");
  const projectsWithStats = (await getPublicProjects()).map((p) =>
    projectCard(p, counters[p.slug])
  );

  return (
    <>
      <ViewTracker type="page" slug="projects" />
      <PageHeader
        label={t("subtitle")}
        title={t("heading")}
        description={t("description")}
        backdrop="WORK"
      />

      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8 md:pb-32">
        <ProjectGrid projects={projectsWithStats} initialCategory="ALL" />
      </div>

      <CTABanner />
    </>
  );
}
