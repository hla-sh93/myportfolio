import { ToolsMarquee } from "@/components/sections/ToolsMarquee";
import { getCounters } from "@/lib/counters";
import {
  getFeaturedProjects,
  getHighlights,
  getPublicArticles,
  getPublicProjects,
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
  const [projCounters, artCounters] = await Promise.all([
    getCounters("project"),
    getCounters("article"),
  ]);
  const featured = getFeaturedProjects().map((p) => ({
    ...p,
    views: projCounters[p.slug]?.views ?? 0,
    likeCount: projCounters[p.slug]?.likes ?? 0,
  }));
  const articles = getPublicArticles()
    .slice(0, 3)
    .map((a) => ({ ...a, views: artCounters[a.slug]?.views ?? 0 }));
  const stats = getHighlights(locale);

  const categoryCounts = getPublicProjects().reduce<Record<string, number>>(
    (acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <>
      {/* Drake split shell: fixed identity card + scrolling content column.
          The split only pays off with a wide content column, so it starts
          at xl; below that the card stacks on top at a comfortable width. */}
      <div className="mx-auto max-w-[1440px] px-4 pt-6 md:px-6 lg:px-8 xl:pt-10">
        <div className="xl:grid xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start xl:gap-14 2xl:grid-cols-[460px_minmax(0,1fr)] 2xl:gap-16">
          <div className="no-scrollbar mx-auto mb-12 w-full max-w-md xl:sticky xl:top-[calc(var(--navbar-height)+16px)] xl:mb-0 xl:max-h-[calc(100vh-var(--navbar-height)-32px)] xl:max-w-none xl:overflow-y-auto">
            <ProfileCard />
          </div>

          <div className="min-w-0">
            <HomeIntro stats={stats} />
            <ToolsMarquee />
            <AboutSnippet />
            <Services counts={categoryCounts} />
            <FeaturedProjects projects={featured} />
            <LatestBlog articles={articles} />
          </div>
        </div>
      </div>

      <CTABanner />
    </>
  );
}
