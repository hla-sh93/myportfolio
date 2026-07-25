import { ViewTracker } from "@/components/features/ViewTracker";
import { BlogExplorer } from "@/components/features/BlogExplorer";
import { getCounters } from "@/lib/counters";
import { getPublicArticles } from "@/lib/content";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("blog");
  return { title: t("heading") };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("blog");
  const counters = await getCounters("article");
  const articles = (await getPublicArticles()).map((a) => ({
    ...a,
    views: counters[a.slug]?.views ?? 0,
  }));

  return (
    <>
      <ViewTracker type="page" slug="blog" />
      <PageHeader
        label={t("subtitle")}
        title={t("heading")}
        description={t("description")}
        backdrop="BLOG"
      />

      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8 md:pb-32">
        <BlogExplorer articles={articles} locale={locale} />
      </div>

      <CTABanner />
    </>
  );
}
