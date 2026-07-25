import { BlogCard } from "@/components/features/BlogCard";
import { CTABanner } from "@/components/sections/CTABanner";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getPublicArticles } from "@/lib/content";


export async function generateMetadata({ params }: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: `${decodedTag} | ${t("heading")}`,
  };
}

export default async function BlogTagPage({ params }: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale, tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const t = await getTranslations({ locale, namespace: "blog" });
  const isRtl = locale === "ar";

  // Filter mock articles by tag
  const articles = getPublicArticles().filter(
    (a) => a.published && a.tags.includes(decodedTag)
  );

  return (
    <>
      <div className="container mx-auto px-6 max-w-6xl py-24 md:py-32">
        <header className="mb-16 md:mb-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-tertiary hover:text-accent font-medium mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            {isRtl ? "العودة للمدونة" : "Back to Blog"}
          </Link>

          <div className="mb-8 flex items-center gap-3">
            <span className="chip-label">
              <Tag className="h-3.5 w-3.5" />
              {isRtl ? "وسم" : "Tag"}
            </span>
          </div>
          <h1 className="title-display font-display text-3xl md:text-5xl">
            {decodedTag}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-5 text-lg text-text-secondary">
            {articles.length} {isRtl ? "مقال" : articles.length === 1 ? "article" : "articles"}
          </p>
        </header>

        {articles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-text-secondary">
              {isRtl ? "لا توجد مقالات لهذا الوسم" : "No articles found for this tag"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <BlogCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}
      </div>

      <CTABanner />
    </>
  );
}
