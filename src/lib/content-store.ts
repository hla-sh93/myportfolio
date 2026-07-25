/**
 * Content store — Postgres when DATABASE_URL is reachable, JSON files under
 * data/ otherwise. Same contract either way, so callers never branch.
 *
 * Why both: Vercel's filesystem is ephemeral, so the database is the only
 * durable store in production. Locally (and on a fresh clone with no DB) the
 * JSON files keep the site fully working, and they double as the seed that
 * scripts/migrate-to-db.mjs imports.
 *
 * Every function is async — the database path cannot be synchronous.
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import { projects as staticProjects } from "@/content/projects";
import staticCertificates from "@/content/certificates.json";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

const DATA_DIR = path.join(process.cwd(), "data");

/* ── types ────────────────────────────────────────────────────────────── */

export type MediaItem = {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  altEn: string;
  altAr: string;
  order: number;
  width: number;
  height: number;
};

export type StoredProject = {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  bodyEn: string | null;
  bodyAr: string | null;
  category: "UIUX" | "WEBSITES" | "GRAPHIC_DESIGN" | "VIDEOS";
  tags: string[];
  coverImage: string;
  blurDataUrl: string | null;
  client: string | null;
  role: string | null;
  tools: string[];
  year: number | null;
  featured: boolean;
  published: boolean;
  publishedAt: string; // ISO
  media: MediaItem[];
};

export type StoredArticle = {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  coverImage: string;
  tags: string[];
  readTime: number;
  published: boolean;
  publishedAt: string; // ISO
};

export type StoredExperience = {
  id: string;
  roleEn: string;
  roleAr: string;
  companyEn: string;
  companyAr: string;
  periodEn: string;
  periodAr: string;
  descEn: string;
  descAr: string;
  order: number;
};

export type StoredStat = {
  id: string;
  value: number;
  suffix: string;
  labelEn: string;
  labelAr: string;
};

export type StoredCertificate = {
  id: string;
  title: string;
  issuer: string | null;
  date: string | null;
  category: string;
  url: string;
  width: number;
  height: number;
  blurDataUrl: string | null;
  order: number;
};

export type StoredMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO
};

/* ── low-level file helpers ───────────────────────────────────────────── */

function file(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readFileCollection<T>(name: string, seed: () => T[]): T[] {
  try {
    return JSON.parse(fs.readFileSync(file(name), "utf8")) as T[];
  } catch {
    const seeded = seed();
    writeFileCollection(name, seeded);
    return seeded;
  }
}

function writeFileCollection<T>(name: string, data: T[]) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(file(name), JSON.stringify(data, null, 1));
  } catch {
    /* read-only FS (serverless) — writes are dev/local only */
  }
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

const iso = (d: Date | null | undefined) => (d ?? new Date()).toISOString();

/* ── seeds ────────────────────────────────────────────────────────────── */

function seedProjects(): StoredProject[] {
  return staticProjects.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleEn: p.titleEn,
    titleAr: p.titleAr,
    descEn: p.descEn,
    descAr: p.descAr,
    bodyEn: p.bodyEn ?? null,
    bodyAr: p.bodyAr ?? null,
    category: p.category,
    tags: p.tags,
    coverImage: p.coverImage,
    blurDataUrl: p.blurDataUrl ?? null,
    client: p.client ?? null,
    role: p.role ?? null,
    tools: p.tools,
    year: p.year ?? null,
    featured: p.featured,
    published: p.published,
    publishedAt: new Date(p.publishedAt).toISOString(),
    media: p.media.map((m) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      altEn: m.altEn,
      altAr: m.altAr,
      order: m.order,
      width: m.width,
      height: m.height,
    })),
  }));
}

type ExpMsg = { role: string; company: string; period: string; desc: string };

function seedExperiences(): StoredExperience[] {
  const ar = (arMessages as Record<string, any>).about.experience;
  const en = (enMessages as Record<string, any>).about.experience;
  const keys = Object.keys(ar).filter((k) => /^e\d+$/.test(k));
  return keys.map((k, i) => {
    const a = ar[k] as ExpMsg;
    const e = en[k] as ExpMsg;
    return {
      id: k,
      roleEn: e.role,
      roleAr: a.role,
      companyEn: e.company,
      companyAr: a.company,
      periodEn: e.period,
      periodAr: a.period,
      descEn: e.desc,
      descAr: a.desc,
      order: i,
    };
  });
}

function seedStats(): StoredStat[] {
  const ar = (arMessages as Record<string, any>).home.stats;
  const en = (enMessages as Record<string, any>).home.stats;
  // Real numbers from the CV (Zanqa Education Platform + career span)
  return [
    { id: "years", value: 7, suffix: "+", labelEn: en.yearsExperience, labelAr: ar.yearsExperience },
    { id: "users", value: 94, suffix: "K+", labelEn: en.usersReached, labelAr: ar.usersReached },
    { id: "downloads", value: 50, suffix: "K+", labelEn: en.appDownloads, labelAr: ar.appDownloads },
    { id: "publishers", value: 3, suffix: "K+", labelEn: en.publishersServed, labelAr: ar.publishersServed },
  ];
}

function seedCertificates(): StoredCertificate[] {
  return (staticCertificates as any[]).map((c, i) => ({
    id: `cert-${path.basename(c.url).replace(/\.[a-z0-9]+$/i, "")}`,
    title: c.title,
    issuer: c.issuer ?? null,
    date: c.date ?? null,
    category: c.category ?? "uiux",
    url: c.url,
    width: c.width ?? 1200,
    height: c.height ?? 900,
    blurDataUrl: c.blurDataUrl ?? null,
    order: i,
  }));
}

function seedArticles(): StoredArticle[] {
  return [];
}

/* ── row mappers (Prisma → Stored) ────────────────────────────────────── */

const toProject = (p: any): StoredProject => ({
  id: p.id,
  slug: p.slug,
  titleEn: p.titleEn,
  titleAr: p.titleAr,
  descEn: p.descEn,
  descAr: p.descAr,
  bodyEn: p.bodyEn,
  bodyAr: p.bodyAr,
  category: p.category,
  tags: p.tags ?? [],
  coverImage: p.coverImage,
  blurDataUrl: p.blurDataUrl,
  client: p.client,
  role: p.role,
  tools: p.tools ?? [],
  year: p.year,
  featured: p.featured,
  published: p.published,
  publishedAt: iso(p.publishedAt),
  media: (p.media ?? [])
    .slice()
    .sort((a: any, b: any) => a.order - b.order)
    .map((m: any) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      altEn: m.altEn ?? "",
      altAr: m.altAr ?? "",
      order: m.order,
      width: m.width ?? 1600,
      height: m.height ?? 1200,
    })),
});

const toArticle = (a: any): StoredArticle => ({
  id: a.id,
  slug: a.slug,
  titleEn: a.titleEn,
  titleAr: a.titleAr,
  excerptEn: a.excerptEn ?? "",
  excerptAr: a.excerptAr ?? "",
  bodyEn: a.bodyEn,
  bodyAr: a.bodyAr,
  coverImage: a.coverImage ?? "/images/placeholder.jpg",
  tags: a.tags ?? [],
  readTime: a.readTime ?? 5,
  published: a.published,
  publishedAt: iso(a.publishedAt),
});

const toCertificate = (c: any): StoredCertificate => ({
  id: c.id,
  title: c.title,
  issuer: c.issuer,
  date: c.date,
  category: c.category,
  url: c.url,
  width: c.width,
  height: c.height,
  blurDataUrl: c.blurDataUrl,
  order: c.order,
});

const toMessage = (m: any): StoredMessage => ({
  id: m.id,
  name: m.name,
  email: m.email,
  subject: m.subject,
  message: m.message,
  read: m.read,
  createdAt: iso(m.createdAt),
});

/* ── projects ─────────────────────────────────────────────────────────── */

export async function getStoredProjects(): Promise<StoredProject[]> {
  try {
    const rows = await db.project.findMany({
      include: { media: true },
      orderBy: { publishedAt: "desc" },
    });
    if (rows.length > 0) return rows.map(toProject);
  } catch {
    /* no database — fall through to the file store */
  }
  return readFileCollection<StoredProject>("projects", seedProjects);
}

export async function getStoredProject(
  idOrSlug: string
): Promise<StoredProject | null> {
  try {
    const row = await db.project.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: { media: true },
    });
    if (row) return toProject(row);
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredProject>("projects", seedProjects);
  return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
}

export async function upsertProject(project: StoredProject) {
  const { media, ...rest } = project;
  const row = {
    slug: rest.slug,
    titleEn: rest.titleEn,
    titleAr: rest.titleAr,
    descEn: rest.descEn,
    descAr: rest.descAr,
    bodyEn: rest.bodyEn,
    bodyAr: rest.bodyAr,
    category: rest.category,
    tags: rest.tags,
    coverImage: rest.coverImage,
    blurDataUrl: rest.blurDataUrl,
    client: rest.client,
    role: rest.role,
    tools: rest.tools,
    year: rest.year,
    featured: rest.featured,
    published: rest.published,
    publishedAt: new Date(rest.publishedAt),
  };
  try {
    await db.project.upsert({
      where: { id: project.id },
      create: { id: project.id, ...row },
      update: row,
    });
    // replace the gallery wholesale — order and membership both come from the form
    await db.media.deleteMany({ where: { projectId: project.id } });
    if (media.length > 0) {
      await db.media.createMany({
        data: media.map((m) => ({ ...m, projectId: project.id })),
      });
    }
    return;
  } catch {
    /* fall through to the file store */
  }
  const all = readFileCollection<StoredProject>("projects", seedProjects);
  const i = all.findIndex((p) => p.id === project.id);
  if (i >= 0) all[i] = project;
  else all.unshift(project);
  writeFileCollection("projects", all);
}

export async function deleteProject(id: string) {
  try {
    await db.project.delete({ where: { id } });
    return;
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredProject>("projects", seedProjects);
  writeFileCollection(
    "projects",
    all.filter((p) => p.id !== id)
  );
}

/* ── articles ─────────────────────────────────────────────────────────── */

export async function getStoredArticles(): Promise<StoredArticle[]> {
  try {
    const rows = await db.article.findMany({ orderBy: { publishedAt: "desc" } });
    if (rows.length > 0) return rows.map(toArticle);
  } catch {
    /* fall through */
  }
  return readFileCollection<StoredArticle>("articles", seedArticles);
}

export async function getStoredArticle(
  idOrSlug: string
): Promise<StoredArticle | null> {
  try {
    const row = await db.article.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (row) return toArticle(row);
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredArticle>("articles", seedArticles);
  return all.find((a) => a.id === idOrSlug || a.slug === idOrSlug) ?? null;
}

export async function upsertArticle(article: StoredArticle) {
  const { id, publishedAt, ...rest } = article;
  const row = { ...rest, publishedAt: new Date(publishedAt) };
  try {
    await db.article.upsert({
      where: { id },
      create: { id, ...row },
      update: row,
    });
    return;
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredArticle>("articles", seedArticles);
  const i = all.findIndex((a) => a.id === id);
  if (i >= 0) all[i] = article;
  else all.unshift(article);
  writeFileCollection("articles", all);
}

export async function deleteArticle(id: string) {
  try {
    await db.article.delete({ where: { id } });
    return;
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredArticle>("articles", seedArticles);
  writeFileCollection(
    "articles",
    all.filter((a) => a.id !== id)
  );
}

/* ── experiences ──────────────────────────────────────────────────────── */

export async function getStoredExperiences(): Promise<StoredExperience[]> {
  try {
    const rows = await db.experience.findMany({ orderBy: { order: "asc" } });
    if (rows.length > 0) {
      return rows.map((e) => ({
        id: e.id,
        roleEn: e.roleEn,
        roleAr: e.roleAr,
        companyEn: e.companyEn,
        companyAr: e.companyAr,
        periodEn: e.periodEn,
        periodAr: e.periodAr,
        descEn: e.descEn,
        descAr: e.descAr,
        order: e.order,
      }));
    }
  } catch {
    /* fall through */
  }
  return readFileCollection<StoredExperience>("experiences", seedExperiences).sort(
    (a, b) => a.order - b.order
  );
}

export async function upsertExperience(exp: StoredExperience) {
  const { id, ...row } = exp;
  try {
    await db.experience.upsert({
      where: { id },
      create: { id, ...row },
      update: row,
    });
    return;
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredExperience>("experiences", seedExperiences);
  const i = all.findIndex((e) => e.id === id);
  if (i >= 0) all[i] = exp;
  else all.push(exp);
  writeFileCollection("experiences", all);
}

export async function deleteExperience(id: string) {
  try {
    await db.experience.delete({ where: { id } });
    return;
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredExperience>("experiences", seedExperiences);
  writeFileCollection(
    "experiences",
    all.filter((e) => e.id !== id)
  );
}

/* ── stats (key highlights) ───────────────────────────────────────────── */

export async function getStoredStats(): Promise<StoredStat[]> {
  try {
    const rows = await db.highlight.findMany({ orderBy: { order: "asc" } });
    if (rows.length > 0) {
      return rows.map((s) => ({
        id: s.id,
        value: s.value,
        suffix: s.suffix,
        labelEn: s.labelEn,
        labelAr: s.labelAr,
      }));
    }
  } catch {
    /* fall through */
  }
  return readFileCollection<StoredStat>("stats", seedStats);
}

export async function saveStats(stats: StoredStat[]) {
  try {
    await db.$transaction([
      db.highlight.deleteMany({ where: { id: { notIn: stats.map((s) => s.id) } } }),
      ...stats.map((s, i) =>
        db.highlight.upsert({
          where: { id: s.id },
          create: {
            id: s.id,
            value: s.value,
            suffix: s.suffix,
            labelEn: s.labelEn,
            labelAr: s.labelAr,
            order: i,
          },
          update: {
            value: s.value,
            suffix: s.suffix,
            labelEn: s.labelEn,
            labelAr: s.labelAr,
            order: i,
          },
        })
      ),
    ]);
    return;
  } catch {
    /* fall through */
  }
  writeFileCollection("stats", stats);
}

/* ── certificates ─────────────────────────────────────────────────────── */

export async function getStoredCertificates(): Promise<StoredCertificate[]> {
  try {
    const rows = await db.certificate.findMany({ orderBy: { order: "asc" } });
    if (rows.length > 0) return rows.map(toCertificate);
  } catch {
    /* fall through */
  }
  return readFileCollection<StoredCertificate>("certificates", seedCertificates);
}

export async function upsertCertificate(cert: StoredCertificate) {
  const { id, ...row } = cert;
  try {
    await db.certificate.upsert({
      where: { id },
      create: { id, ...row },
      update: row,
    });
    return;
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredCertificate>("certificates", seedCertificates);
  const i = all.findIndex((c) => c.id === id);
  if (i >= 0) all[i] = cert;
  else all.push(cert);
  writeFileCollection("certificates", all);
}

export async function deleteCertificate(id: string) {
  try {
    await db.certificate.delete({ where: { id } });
    return;
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredCertificate>("certificates", seedCertificates);
  writeFileCollection(
    "certificates",
    all.filter((c) => c.id !== id)
  );
}

/* ── contact messages ─────────────────────────────────────────────────── */

export async function getStoredMessages(): Promise<StoredMessage[]> {
  try {
    const rows = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toMessage);
  } catch {
    /* fall through */
  }
  return readFileCollection<StoredMessage>("messages", () => []).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export async function addMessage(
  msg: Omit<StoredMessage, "id" | "read" | "createdAt">
) {
  try {
    await db.contactMessage.create({ data: { ...msg, read: false } });
    return;
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredMessage>("messages", () => []);
  all.unshift({
    ...msg,
    id: newId("msg"),
    read: false,
    createdAt: new Date().toISOString(),
  });
  writeFileCollection("messages", all);
}

export async function setMessageRead(id: string, read: boolean) {
  try {
    await db.contactMessage.update({ where: { id }, data: { read } });
    return;
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredMessage>("messages", () => []);
  const m = all.find((x) => x.id === id);
  if (m) m.read = read;
  writeFileCollection("messages", all);
}

export async function deleteMessage(id: string) {
  try {
    await db.contactMessage.delete({ where: { id } });
    return;
  } catch {
    /* fall through */
  }
  const all = readFileCollection<StoredMessage>("messages", () => []);
  writeFileCollection(
    "messages",
    all.filter((m) => m.id !== id)
  );
}
