/**
 * Public read layer over the content store — revives dates and fills the
 * runtime fields (likeCount/views) so components keep the same shapes they
 * had with the static content files.
 */
import "server-only";
import {
  getStoredArticles,
  getStoredExperiences,
  getStoredProject,
  getStoredProjects,
  getStoredStats,
  type StoredArticle,
  type StoredProject,
} from "@/lib/content-store";

function reviveProject(p: StoredProject) {
  return {
    ...p,
    year: p.year,
    likeCount: 0,
    publishedAt: new Date(p.publishedAt),
    createdAt: new Date(p.publishedAt),
    updatedAt: new Date(p.publishedAt),
    media: p.media.map((m) => ({
      ...m,
      projectId: p.id,
      createdAt: new Date(p.publishedAt),
    })),
    likes: [] as never[],
  };
}

function reviveArticle(a: StoredArticle) {
  return {
    ...a,
    views: 0,
    publishedAt: new Date(a.publishedAt),
    createdAt: new Date(a.publishedAt),
    updatedAt: new Date(a.publishedAt),
  };
}

export type PublicProject = ReturnType<typeof reviveProject>;
export type PublicArticle = ReturnType<typeof reviveArticle>;

export function getPublicProjects(): PublicProject[] {
  return getStoredProjects()
    .filter((p) => p.published)
    .map(reviveProject);
}

export function getFeaturedProjects(): PublicProject[] {
  return getPublicProjects().filter((p) => p.featured).slice(0, 4);
}

export function getPublicProject(slug: string): PublicProject | null {
  const p = getStoredProject(slug);
  return p && p.published ? reviveProject(p) : null;
}

export function getPublicArticles(): PublicArticle[] {
  return getStoredArticles()
    .filter((a) => a.published)
    .map(reviveArticle)
    .sort((a, b) => +b.publishedAt - +a.publishedAt);
}

export function getPublicArticle(slug: string): PublicArticle | null {
  const a = getStoredArticles().find((x) => x.slug === slug && x.published);
  return a ? reviveArticle(a) : null;
}

export function getExperiences(locale: string) {
  const ar = locale === "ar";
  return getStoredExperiences().map((e) => ({
    role: ar ? e.roleAr : e.roleEn,
    company: ar ? e.companyAr : e.companyEn,
    period: ar ? e.periodAr : e.periodEn,
    desc: ar ? e.descAr : e.descEn,
  }));
}

export function getHighlights(locale: string) {
  const ar = locale === "ar";
  return getStoredStats().map((s) => ({
    value: s.value,
    suffix: s.suffix,
    label: ar ? s.labelAr : s.labelEn,
  }));
}
