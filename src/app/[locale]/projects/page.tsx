import { ViewTracker } from "@/components/features/ViewTracker";
import { ProjectGrid } from "@/components/features/ProjectGrid";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublicProjects } from "@/lib/content";
import { getCounters } from "@/lib/counters";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("projects");
  return { title: t("heading") };
}


export default async function ProjectsPage() {
  const t = await getTranslations("projects");
  // live engagement counters (views/likes) merged onto static content
  const counters = await getCounters("project");
  const projectsWithStats = (await getPublicProjects()).map((p) => ({
    ...p,
    views: counters[p.slug]?.views ?? 0,
    likeCount: counters[p.slug]?.likes ?? 0,
  }));

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
