import { ReadingProgress } from "@/components/features/ReadingProgress";
import { TableOfContents } from "@/components/features/TableOfContents";
import { ViewTracker } from "@/components/features/ViewTracker";
import { CTABanner } from "@/components/sections/CTABanner";
import { Link } from "@/i18n/navigation";
import { getCounters } from "@/lib/counters";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getPublicArticle, getPublicArticles } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { DetailNav } from "@/components/features/DetailNav";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
} from "@/components/seo/JsonLd";


export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const article = await getPublicArticle(slug);

  if (!article) return { title: "Not Found" };

  const title = locale === "ar" ? article.titleAr : article.titleEn;
  const excerpt = locale === "ar" ? article.excerptAr : article.excerptEn;

  return {
    title,
    description: excerpt?.slice(0, 160) || "",
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        ar: `/ar/blog/${slug}`,
        en: `/en/blog/${slug}`,
        "x-default": `/ar/blog/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      publishedTime: new Date(article.publishedAt).toISOString(),
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&type=article`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations("blog");
  const isRtl = locale === "ar";

  const article = await getPublicArticle(slug);

  if (!article || !article.published) {
    notFound();
  }

  const title = isRtl ? article.titleAr : article.titleEn;
  const body = isRtl ? article.bodyAr : article.bodyEn;
  const bodyHtml = await renderMarkdown(body);

  const dateLocale = isRtl ? arSA : enUS;
  const publishDate = article.publishedAt
    ? format(new Date(article.publishedAt), "MMMM d, yyyy", { locale: dateLocale })
    : "";

  const counters = await getCounters("article");
  const views = counters[article.slug]?.views ?? 0;

  // Prev/next within published articles (blog order)
  const allArticles = await getPublicArticles();
  const aIdx = allArticles.findIndex((a) => a.slug === article.slug);
  const prevArticle = aIdx > 0 ? allArticles[aIdx - 1] : null;
  const nextArticle = aIdx < allArticles.length - 1 ? allArticles[aIdx + 1] : null;

  return (
    <>
      <JsonLd data={articleSchema(locale, article)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: isRtl ? "الرئيسية" : "Home", path: `/${locale}` },
          { name: isRtl ? "المدونة" : "Blog", path: `/${locale}/blog` },
          { name: title, path: `/${locale}/blog/${article.slug}` },
        ])}
      />
      <ViewTracker type="article" slug={article.slug} />
      <ReadingProgress />

      <article className="min-h-screen pt-24 pb-16 md:pb-24">
        {/* Article Header */}
        <header className="container mx-auto px-6 max-w-4xl mb-12 md:mb-20 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-tertiary hover:text-accent font-medium mb-10 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            {isRtl ? "العودة للمدونة" : "Back to Blog"}
          </Link>

          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm font-medium text-text-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <time dateTime={article.publishedAt?.toISOString()}>{publishDate}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>{article.readTime} {t("minRead")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent" />
              <span className="tabular-nums">{views.toLocaleString()}</span>
            </div>
          </div>

          <h1 className="title-display mb-8 font-display text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>

          <div className="flex flex-wrap justify-center gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="rounded-full border border-border-strong px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-accent hover:text-accent"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="container mx-auto px-6 max-w-5xl mb-16 md:mb-24">
            <div className="relative w-full aspect-[21/9] rounded-[30px] border border-border overflow-hidden bg-surface">
              <Image
                src={article.coverImage}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        )}

        {/* Content with Sidebar TOC */}
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col xl:flex-row gap-16 relative">
            <div className="w-full xl:w-[calc(100%-20rem)] shrink-0">
              <div
                className={`prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-headings:text-text-primary
                  prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-3xl prose-h2:border-s-4 prose-h2:border-accent prose-h2:ps-4
                  prose-h3:mt-9 prose-h3:text-xl
                  prose-p:leading-[1.9] prose-p:text-text-secondary
                  prose-li:my-1.5 prose-li:leading-[1.85] prose-li:text-text-secondary
                  prose-strong:text-text-primary
                  prose-a:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-accent prose-blockquote:bg-bg-elevated prose-blockquote:rounded-e-2xl prose-blockquote:py-1
                  prose-code:rounded-md prose-code:bg-bg-elevated prose-code:px-1.5 prose-code:py-0.5 prose-code:text-accent prose-code:before:content-none prose-code:after:content-none
                  prose-pre:rounded-2xl prose-pre:border prose-pre:border-border prose-pre:bg-[#0d0d0f] prose-pre:shadow-inner
                  prose-table:overflow-hidden prose-table:rounded-xl prose-th:bg-bg-elevated prose-th:px-4 prose-th:py-3 prose-td:px-4 prose-td:py-3
                  prose-img:rounded-2xl prose-hr:border-border
                  ${isRtl ? "prose-pre:text-left prose-pre:[direction:ltr]" : ""}`}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>

            <TableOfContents />
          </div>
        </div>
      </article>

      <DetailNav
        prev={
          prevArticle
            ? {
                slug: prevArticle.slug,
                title: isRtl ? prevArticle.titleAr : prevArticle.titleEn,
                coverImage: prevArticle.coverImage,
                href: `/blog/${prevArticle.slug}`,
              }
            : null
        }
        next={
          nextArticle
            ? {
                slug: nextArticle.slug,
                title: isRtl ? nextArticle.titleAr : nextArticle.titleEn,
                coverImage: nextArticle.coverImage,
                href: `/blog/${nextArticle.slug}`,
              }
            : null
        }
        prevLabel={t("prevArticle")}
        nextLabel={t("nextArticle")}
      />

      <CTABanner />
    </>
  );
}
