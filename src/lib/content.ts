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

/* ── Key highlights ───────────────────────────────────────────────────────
   Every number on the home page is counted from the content itself, so it
   can't drift out of date the way a hand-typed figure does: publish a
   project and the count moves with it. A stat with no `source` keeps the
   literal value stored for it. */

const MONTH_INDEX: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** "Aug 2016 – Jan 2019" → the start date. */
function parsePeriodStart(period: string): Date | null {
  const m = /^\s*([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/.exec(period);
  if (!m) return null;
  const month = MONTH_INDEX[m[1].toLowerCase()];
  if (month === undefined) return null;
  return new Date(Date.UTC(Number(m[2]), month, 1));
}

/** The same client written in both languages must not be counted twice. */
const CLIENT_ALIASES: Record<string, string> = {
  "أخضر": "akhdar",
  "نعناع": "nana",
  "bw group": "bw",
};

function clientKey(raw: string) {
  const trimmed = raw.trim();
  return CLIENT_ALIASES[trimmed] ?? CLIENT_ALIASES[trimmed.toLowerCase()] ?? trimmed.toLowerCase();
}

async function countHighlight(source: string): Promise<number | null> {
  switch (source) {
    case "years": {
      const starts = (await getStoredExperiences())
        .map((e) => parsePeriodStart(e.periodEn))
        .filter((d): d is Date => d !== null);
      if (!starts.length) return null;

      const first = new Date(Math.min(...starts.map((d) => d.getTime())));
      const now = new Date();
      const years = now.getUTCFullYear() - first.getUTCFullYear();
      // a year only counts once it has actually finished
      const reached =
        now.getUTCMonth() > first.getUTCMonth() ||
        (now.getUTCMonth() === first.getUTCMonth() &&
          now.getUTCDate() >= first.getUTCDate());
      return Math.max(0, reached ? years : years - 1);
    }
    case "projects":
      return (await getPublicProjects()).length;
    case "clients": {
      const clients = (await getPublicProjects())
        .map((p) => clientKey(p.client ?? ""))
        .filter(Boolean);
      return new Set(clients).size;
    }
    case "certificates":
      return (await getCertificates()).length;
    default:
      return null;
  }
}

export async function getHighlights(locale: string) {
  const ar = locale === "ar";
  const all = await getStoredStats();
  return Promise.all(
    all.map(async (s) => ({
      value: (s.source ? await countHighlight(s.source) : null) ?? s.value,
      suffix: s.suffix,
      label: ar ? s.labelAr : s.labelEn,
    }))
  );
}

export async function getCertificates() {
  return getStoredCertificates();
}
