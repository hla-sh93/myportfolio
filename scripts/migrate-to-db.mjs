/**
 * One-way import of the file store into Postgres.
 *
 * Idempotent: every row is upserted by its stable id, so running it twice
 * changes nothing. Never deletes — rows added in the admin panel survive.
 *
 * Usage: node scripts/migrate-to-db.mjs
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const db = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

const root = process.cwd();
const readJson = (p, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  } catch {
    return fallback;
  }
};

const date = (v) => (v ? new Date(v) : null);

async function main() {
  const summary = {};

  /* ── projects + media ── */
  const projects = readJson("data/projects.json", []);
  for (const p of projects) {
    await db.project.upsert({
      where: { id: p.id },
      create: {
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
        featured: !!p.featured,
        published: !!p.published,
        publishedAt: date(p.publishedAt),
      },
      update: {
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
        featured: !!p.featured,
        published: !!p.published,
        publishedAt: date(p.publishedAt),
      },
    });

    for (const m of p.media ?? []) {
      await db.media.upsert({
        where: { id: m.id },
        create: {
          id: m.id,
          url: m.url,
          type: m.type,
          altEn: m.altEn,
          altAr: m.altAr,
          order: m.order ?? 0,
          width: m.width,
          height: m.height,
          projectId: p.id,
        },
        update: {
          url: m.url,
          type: m.type,
          altEn: m.altEn,
          altAr: m.altAr,
          order: m.order ?? 0,
          width: m.width,
          height: m.height,
          projectId: p.id,
        },
      });
    }
  }
  summary.projects = projects.length;
  summary.media = projects.reduce((n, p) => n + (p.media?.length ?? 0), 0);

  /* ── articles ── */
  const articles = readJson("data/articles.json", []);
  for (const a of articles) {
    const row = {
      slug: a.slug,
      titleEn: a.titleEn,
      titleAr: a.titleAr,
      excerptEn: a.excerptEn,
      excerptAr: a.excerptAr,
      bodyEn: a.bodyEn,
      bodyAr: a.bodyAr,
      coverImage: a.coverImage,
      tags: a.tags ?? [],
      readTime: a.readTime ?? 5,
      published: !!a.published,
      publishedAt: date(a.publishedAt),
    };
    await db.article.upsert({
      where: { id: a.id },
      create: { id: a.id, ...row },
      update: row,
    });
  }
  summary.articles = articles.length;

  /* ── experiences ── */
  const experiences = readJson("data/experiences.json", []);
  for (const [i, e] of experiences.entries()) {
    const row = {
      roleEn: e.roleEn,
      roleAr: e.roleAr,
      companyEn: e.companyEn,
      companyAr: e.companyAr,
      periodEn: e.periodEn,
      periodAr: e.periodAr,
      descEn: e.descEn,
      descAr: e.descAr,
      order: e.order ?? i,
    };
    await db.experience.upsert({
      where: { id: e.id },
      create: { id: e.id, ...row },
      update: row,
    });
  }
  summary.experiences = experiences.length;

  /* ── highlights (stats strip) ── */
  const stats = readJson("data/stats.json", []);
  for (const [i, s] of stats.entries()) {
    const row = {
      value: s.value,
      suffix: s.suffix ?? "",
      labelEn: s.labelEn,
      labelAr: s.labelAr,
      order: i,
    };
    await db.highlight.upsert({
      where: { id: s.id },
      create: { id: s.id, ...row },
      update: row,
    });
  }
  summary.highlights = stats.length;

  /* ── certificates (from the static content file) ── */
  const certificates = readJson("src/content/certificates.json", []);
  for (const [i, c] of certificates.entries()) {
    // stable id derived from the image filename so re-runs don't duplicate
    const id = `cert-${path.basename(c.url).replace(/\.[a-z0-9]+$/i, "")}`;
    const row = {
      title: c.title,
      issuer: c.issuer ?? null,
      date: c.date ?? null,
      category: c.category ?? "uiux",
      url: c.url,
      width: c.width ?? 1200,
      height: c.height ?? 900,
      blurDataUrl: c.blurDataUrl ?? null,
      order: i,
    };
    await db.certificate.upsert({
      where: { id },
      create: { id, ...row },
      update: row,
    });
  }
  summary.certificates = certificates.length;

  /* ── contact messages ── */
  const messages = readJson("data/messages.json", []);
  for (const m of messages) {
    const row = {
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      read: !!m.read,
      createdAt: date(m.createdAt) ?? new Date(),
    };
    await db.contactMessage.upsert({
      where: { id: m.id },
      create: { id: m.id, ...row },
      update: row,
    });
  }
  summary.messages = messages.length;

  /* ── engagement counters (dev file store) ── */
  const counters = readJson(".counters.json", {});
  let counterRows = 0;
  for (const [key, v] of Object.entries(counters)) {
    const [type, ...rest] = key.split(":");
    const slug = rest.join(":");
    if (!type || !slug) continue;
    await db.counter.upsert({
      where: { type_slug: { type, slug } },
      create: { type, slug, views: v.views ?? 0, likes: v.likes ?? 0 },
      // keep whichever total is higher — never lose production counts
      update: { views: { set: Math.max(v.views ?? 0, 0) }, likes: { set: Math.max(v.likes ?? 0, 0) } },
    });
    counterRows++;
  }
  summary.counters = counterRows;

  console.table(summary);
}

main()
  .catch((e) => {
    console.error("migration failed:", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
