import { BlogCard } from "@/components/features/BlogCard";
import { CTABanner } from "@/components/sections/CTABanner";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPublicArticles } from "@/lib/content";
import { localizedPageMetadata } from "@/lib/seo";

/**
 * A tag is one path segment, and Next hands it over decoded: "UI%2FUX" is
 * already "UI/UX" here. The second decode only matters for a tag that
 * contains a percent sign itself, and a malformed one must not become a 500.
 */
function tagFromParam(param: string): string {
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

async function articlesTagged(tag: string) {
  return (await getPublicArticles()).filter((a) => a.tags.includes(tag));
}

export async function generateStaticParams() {
  const articles = await getPublicArticles();
  const tags = new Set(articles.flatMap((a) => a.tags));
  // Raw values: Next percent-encodes them itself, so "UI/UX" becomes the one
  // segment "UI%2FUX". Encoding here as well prerendered "UI%252FUX".
  return [...tags].map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale, tag: param } = await params;
  const tag = tagFromParam(param);

  // An unknown tag is a 404, not an empty page that answers 200. The call is
  // made here because metadata resolves before the response starts; by the
  // time the page body runs, loading.tsx has already sent a 200.
  if ((await articlesTagged(tag)).length === 0) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });

  // Its own canonical and hreflang: with only a title here, every tag page
  // inherited the layout's, and told search engines it was the home page.
  return localizedPageMetadata({
    locale,
    path: `/blog/tag/${encodeURIComponent(tag)}`,
    title: `${tag} | ${t("heading")}`,
    description: t("tagDescription", { tag }),
    card: "blog",
  });
}

export default async function BlogTagPage({ params }: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale, tag: param } = await params;
  setRequestLocale(locale);
  const decodedTag = tagFromParam(param);
  const isRtl = locale === "ar";

  // An unknown tag is a 404, not an empty page that answers 200.
  const articles = await articlesTagged(decodedTag);
  if (articles.length === 0) notFound();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <BlogCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>

      <CTABanner />
    </>
  );
}
