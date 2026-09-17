import { setRequestLocale } from "next-intl/server";
import { ViewTracker } from "@/components/features/ViewTracker";
import { ToolsMarquee } from "@/components/sections/ToolsMarquee";
import { getCounters } from "@/lib/counters";
import {
  articleCard,
  getFeaturedProjects,
  getHighlights,
  getPublicArticles,
  getPublicProjects,
  projectCard,
} from "@/lib/content";
import { ProfileCard } from "@/components/sections/ProfileCard";
import { HomeIntro } from "@/components/sections/HomeIntro";
import { AboutSnippet } from "@/components/sections/AboutSnippet";
import { Services } from "@/components/sections/Services";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { LatestBlog } from "@/components/sections/LatestBlog";
import { CTABanner } from "@/components/sections/CTABanner";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [projCounters, artCounters] = await Promise.all([
    getCounters("project"),
    getCounters("article"),
  ]);
  const featured = (await getFeaturedProjects()).map((p) =>
    projectCard(p, projCounters[p.slug])
  );
  const articles = (await getPublicArticles())
    .slice(0, 3)
    .map((a) => articleCard(a, artCounters[a.slug]));
  const stats = await getHighlights(locale);

  const categoryCounts = (await getPublicProjects()).reduce<Record<string, number>>(
    (acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <>
      <ViewTracker type="page" slug="home" />
      {/* Drake split shell: fixed identity card + scrolling content column.
          The split only pays off with a wide content column, so it starts
          at xl; below that the card stacks on top at a comfortable width. */}
      <div className="mx-auto max-w-[1440px] px-4 pt-6 md:px-6 lg:px-8 xl:pt-10">
        <div className="xl:grid xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start xl:gap-14 2xl:grid-cols-[460px_minmax(0,1fr)] 2xl:gap-16">
          <div className="no-scrollbar mx-auto mb-8 w-full max-w-md xl:sticky xl:top-[calc(var(--navbar-height)+16px)] xl:mb-0 xl:max-h-[calc(100vh-var(--navbar-height)-32px)] xl:max-w-none xl:overflow-y-auto">
            <ProfileCard />
          </div>

          <div className="min-w-0">
            <HomeIntro stats={stats} />
            <ToolsMarquee />
            <AboutSnippet />
            <Services counts={categoryCounts} />
            <FeaturedProjects projects={featured} />
            <LatestBlog articles={articles} />
            <CTABanner contained />
          </div>
        </div>
      </div>
    </>
  );
}
