/**
 * Public read layer over the content store — revives dates and fills the
 * runtime fields (likeCount/views) so components keep the same shapes they
 * had with the static content files.
 */
import "server-only";
import {
  getStoredArticles,
  getStoredCertificates,
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

export async function getPublicProjects(): Promise<PublicProject[]> {
  const all = await getStoredProjects();
  return all.filter((p) => p.published).map(reviveProject);
}

export async function getFeaturedProjects(): Promise<PublicProject[]> {
  const all = await getPublicProjects();
  return all.filter((p) => p.featured).slice(0, 4);
}

export async function getPublicProject(
  slug: string
): Promise<PublicProject | null> {
  const p = await getStoredProject(slug);
  return p && p.published ? reviveProject(p) : null;
}

export async function getPublicArticles(): Promise<PublicArticle[]> {
  const all = await getStoredArticles();
  return all
    .filter((a) => a.published)
    .map(reviveArticle)
    .sort((a, b) => +b.publishedAt - +a.publishedAt);
}

export async function getPublicArticle(
  slug: string
): Promise<PublicArticle | null> {
  const all = await getStoredArticles();
  const a = all.find((x) => x.slug === slug && x.published);
  return a ? reviveArticle(a) : null;
}

export async function getExperiences(locale: string) {
  const ar = locale === "ar";
  const all = await getStoredExperiences();
  return all.map((e) => ({
    role: ar ? e.roleAr : e.roleEn,
    company: ar ? e.companyAr : e.companyEn,
    period: ar ? e.periodAr : e.periodEn,
    desc: ar ? e.descAr : e.descEn,
  }));
}

export async function getHighlights(locale: string) {
  const ar = locale === "ar";
  const all = await getStoredStats();
  return all.map((s) => ({
    value: s.value,
    suffix: s.suffix,
    label: ar ? s.labelAr : s.labelEn,
  }));
}

export async function getCertificates() {
  return getStoredCertificates();
}
