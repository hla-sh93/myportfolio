import { LikeButton } from "@/components/features/LikeButton";
import { CTABanner } from "@/components/sections/CTABanner";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublicProject, getPublicProjects } from "@/lib/content";
import { DetailNav } from "@/components/features/DetailNav";
import { SiteWall, getCollection } from "@/components/features/SiteWall";
import { ProjectFacts } from "@/components/features/ProjectFacts";
import { getTranslations } from "next-intl/server";
import { MediaGallery } from "@/components/features/MediaGallery";
import { ViewTracker } from "@/components/features/ViewTracker";
import { getCounters } from "@/lib/counters";
import { renderMarkdown } from "@/lib/markdown";
import type { Media as PrismaMedia } from "@prisma/client";
import {
  JsonLd,
  breadcrumbSchema,
  creativeWorkSchema,
} from "@/components/seo/JsonLd";

const categoryKeyMap: Record<string, string> = {
  VIDEOS: "videos",
  GRAPHIC_DESIGN: "graphic-design",
  UIUX: "uiux",
  WEBSITES: "websites",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const project = await getPublicProject(slug);

  if (!project) return { title: "Not Found" };

  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const desc = locale === "ar" ? project.descAr : project.descEn;

  return {
    title,
    description: desc.slice(0, 160),
    alternates: {
      canonical: `/${locale}/projects/detail/${slug}`,
      languages: {
        ar: `/ar/projects/detail/${slug}`,
        en: `/en/projects/detail/${slug}`,
        "x-default": `/ar/projects/detail/${slug}`,
      },
    },
    openGraph: {
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&type=project`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const isRtl = locale === "ar";

  const project = await getPublicProject(slug);

  if (!project || !project.published) {
    notFound();
  }

  const t = await getTranslations("projects");
  const title = isRtl ? project.titleAr : project.titleEn;
  const description = isRtl ? project.descAr : project.descEn;
  const body = isRtl ? project.bodyAr : project.bodyEn;
  const bodyHtml = body ? await renderMarkdown(body) : null;

  const counters = await getCounters("project");
  const stats = counters[project.slug] ?? { views: 0, likes: 0 };

  /* The strip that answers "what field, for whom, and what was her part"
     before a single line of prose is read. A project family counts its
     shipped sites here; a single site has nothing extra to say. */
  const collection = getCollection(project.slug);
  const facts = [
    {
      label: t("detail.labels.category"),
      value: t(
        `categories.${categoryKeyMap[project.category] ?? project.category.toLowerCase()}` as Parameters<typeof t>[0]
      ),
    },
    { label: t("detail.labels.client"), value: project.client ?? "" },
    {
      label: t("detail.labels.role"),
      // Roles are stored once in English; Arabic reads its own wording.
      value: project.role
        ? t.has(`detail.roles.${project.role}`)
          ? t(`detail.roles.${project.role}` as Parameters<typeof t>[0])
          : project.role
        : "",
    },
    {
      label: t("detail.labels.scope"),
      value: collection?.length
        ? t("detail.scopeSites", { count: collection.length })
        : "",
    },
    { label: t("detail.labels.year"), value: project.year ? String(project.year) : "" },
    { label: t("detail.labels.tools"), value: project.tools.join(isRtl ? "، " : ", ") },
  ];

  // Prev/next within the published set (gallery order) — never dead-end
  const all = await getPublicProjects();
  const idx = all.findIndex((p) => p.slug === project.slug);
  const prevProject = idx > 0 ? all[idx - 1] : null;
  const nextProject = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <>
      <JsonLd data={creativeWorkSchema(locale, project)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: isRtl ? "الرئيسية" : "Home", path: `/${locale}` },
          { name: isRtl ? "المشاريع" : "Projects", path: `/${locale}/projects` },
          { name: title, path: `/${locale}/projects/detail/${project.slug}` },
        ])}
      />
      <ViewTracker type="project" slug={project.slug} />
      <article className="min-h-screen">
        {/* Cover */}
        <div className="relative h-[52vh] w-full bg-black md:h-[64vh]">
          <Image
            src={project.coverImage}
            alt={title}
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
            placeholder={project.blurDataUrl ? "blur" : "empty"}
            blurDataURL={project.blurDataUrl || undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />

          <div className="container absolute inset-0 mx-auto flex max-w-5xl flex-col justify-end px-6 pb-12 md:pb-16">
            <Link
              href="/projects"
              className="group mb-8 inline-flex w-fit items-center gap-2 font-medium text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
              {t("detail.back")}
            </Link>

            <div className="mb-5">
              <Badge category={project.category} />
            </div>

            <h1 className="mb-6 font-display text-3xl font-bold text-white drop-shadow-xl md:text-5xl lg:text-6xl">{title}</h1>

            <div className="flex flex-wrap items-center gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#120409] transition-colors hover:bg-accent hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t("detail.visit")}
                </a>
              )}
              <LikeButton
                slug={project.slug}
                initialCount={stats.likes}
                className="border-white/20 bg-white/10 text-white"
              />
              <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
                <Eye className="h-4 w-4" />
                <span className="tabular-nums">{stats.views.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl px-6 py-14 md:py-20">
          <ProjectFacts facts={facts} />

          {/* The lead: what this is, at a size that gets read. */}
          <section className="mt-14 md:mt-20">
            <h2 className="chip-label mb-5 text-text-tertiary">
              {t("detail.overview")}
            </h2>
            <p className="max-w-3xl text-lg leading-[1.95] text-text-secondary md:text-xl md:leading-[1.9]">
              {description}
            </p>
          </section>

          {bodyHtml && (
            <section className="mt-14 md:mt-20">
              <h2 className="chip-label mb-6 text-text-tertiary">
                {t("detail.caseStudy")}
              </h2>
              <div
                className={`prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-display prose-headings:font-bold prose-headings:text-text-primary
                  prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl prose-h2:border-s-4 prose-h2:border-accent prose-h2:ps-4
                  prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-lg
                  prose-p:leading-[1.9] prose-p:text-text-secondary
                  prose-li:my-2 prose-li:leading-[1.8] prose-li:text-text-secondary
                  prose-li:marker:text-accent
                  prose-strong:text-text-primary
                  prose-a:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                  prose-hr:border-border`}
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </section>
          )}

          {/* Project gallery */}
          {project.media.length > 0 && (
            <section className="mt-16 md:mt-20">
              <h2 className="chip-label mb-6 text-text-tertiary">
                {t("detail.gallery")}
              </h2>
              <MediaGallery
                media={project.media as unknown as PrismaMedia[]}
                isRtl={isRtl}
              />
            </section>
          )}

          {/* Collection projects list every site they shipped */}
          <SiteWall slug={project.slug} isRtl={isRtl} />

          {project.tags.length > 0 && (
            <section className="mt-16 border-t border-border pt-8">
              <h2 className="chip-label mb-4 text-text-tertiary">
                {t("detail.labels.tags")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3.5 py-1.5 text-sm text-text-secondary"
                  >
                    {t.has(`detail.tagNames.${tag}`)
                      ? t(`detail.tagNames.${tag}` as Parameters<typeof t>[0])
                      : tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <DetailNav
        prev={
          prevProject
            ? {
                slug: prevProject.slug,
                title: isRtl ? prevProject.titleAr : prevProject.titleEn,
                coverImage: prevProject.coverImage,
                href: `/projects/detail/${prevProject.slug}`,
              }
            : null
        }
        next={
          nextProject
            ? {
                slug: nextProject.slug,
                title: isRtl ? nextProject.titleAr : nextProject.titleEn,
                coverImage: nextProject.coverImage,
                href: `/projects/detail/${nextProject.slug}`,
              }
            : null
        }
        prevLabel={t("prevProject")}
        nextLabel={t("nextProject")}
      />

      <CTABanner />
    </>
  );
}
