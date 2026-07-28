import { LikeButton } from "@/components/features/LikeButton";
import { CTABanner } from "@/components/sections/CTABanner";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Calendar, Code2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublicProject, getPublicProjects } from "@/lib/content";
import { DetailNav } from "@/components/features/DetailNav";
import { SiteWall } from "@/components/features/SiteWall";
import { getTranslations } from "next-intl/server";
import { MediaGallery } from "@/components/features/MediaGallery";
import { ViewTracker } from "@/components/features/ViewTracker";
import { getCounters } from "@/lib/counters";
import { Eye } from "lucide-react";
import type { Media as PrismaMedia } from "@prisma/client";
import {
  JsonLd,
  breadcrumbSchema,
  creativeWorkSchema,
} from "@/components/seo/JsonLd";



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

  const title = isRtl ? project.titleAr : project.titleEn;
  const description = isRtl ? project.descAr : project.descEn;
  const body = isRtl ? project.bodyAr : project.bodyEn;

  const counters = await getCounters("project");
  const stats = counters[project.slug] ?? { views: 0, likes: 0 };

  // Prev/next within the published set (gallery order) — never dead-end
  const tNav = await getTranslations("projects");
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
        {/* Cover Section */}
        <div className="relative h-[60vh] md:h-[80vh] w-full bg-black">
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

          <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-6 max-w-5xl pb-16 md:pb-24">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-8 transition-colors w-fit group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
              {isRtl ? "العودة للمشاريع" : "Back to Projects"}
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge category={project.category} />
              {project.year && (
                <div className="flex items-center text-white/80 text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  {project.year}
                </div>
              )}
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
                  {isRtl ? "زيارة الموقع" : "Visit the site"}
                </a>
              )}
              <LikeButton
                slug={project.slug}
                initialCount={stats.likes}
                className="border-white/20 bg-white/10 text-white"
              />
              <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
                <Eye className="h-4 w-4" />
                <span className="tabular-nums">
                  {stats.views.toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-5xl py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="title-display mb-6 font-display text-2xl md:text-3xl">
                  {isRtl ? "نظرة عامة" : "Overview"}
                </h2>
                <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed text-text-secondary whitespace-pre-wrap">
                  {description}
                </div>
              </section>

              {body && (
                <section>
                  <h2 className="title-display mb-6 font-display text-2xl md:text-3xl">
                    {isRtl ? "التفاصيل" : "Details"}
                  </h2>
                  <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed text-text-secondary whitespace-pre-wrap">
                    {body}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar / Meta */}
            <div className="space-y-10">
              <div className="card-line card-line-static p-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-6">
                  {isRtl ? "معلومات المشروع" : "Project Info"}
                </h3>

                <dl className="space-y-6">
                  {project.client && (
                    <div>
                      <dt className="text-sm font-medium text-text-secondary mb-1">
                        {isRtl ? "العميل" : "Client"}
                      </dt>
                      <dd className="text-base font-semibold text-text-primary">{project.client}</dd>
                    </div>
                  )}

                  {project.role && (
                    <div>
                      <dt className="text-sm font-medium text-text-secondary mb-1">
                        {isRtl ? "الدور" : "Role"}
                      </dt>
                      <dd className="text-base font-semibold text-text-primary">{project.role}</dd>
                    </div>
                  )}

                  {project.tools.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        {isRtl ? "التقنيات المستخدمة" : "Technologies"}
                      </dt>
                      <dd className="flex flex-wrap gap-2">
                        {project.tools.map((tool) => (
                          <span key={tool} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent/10 text-accent">
                            {tool}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {project.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-4">
                    {isRtl ? "الكلمات الدالة" : "Tags"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project gallery */}
          {project.media.length > 0 && (
            <section className="mt-20">
              <h2 className="mb-8 text-2xl font-bold text-text-primary">
                {isRtl ? "معرض المشروع" : "Project Gallery"}
              </h2>
              <MediaGallery
                media={project.media as unknown as PrismaMedia[]}
              />
            </section>
          )}

          {/* Collection projects list every site they shipped */}
          <SiteWall slug={project.slug} isRtl={isRtl} />
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
        prevLabel={tNav("prevProject")}
        nextLabel={tNav("nextProject")}
      />

      <CTABanner />
    </>
  );
}
