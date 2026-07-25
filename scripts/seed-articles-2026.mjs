/**
 * Seed the 2026 article set: 4 articles × 4 categories, bilingual, with
 * branded covers. Replaces the 3 demo placeholder articles (a1–a3).
 * Usage: node scripts/seed-articles-2026.mjs
 */
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { uiuxArticles } from "./articles-2026/uiux.mjs";
import { frontendArticles } from "./articles-2026/frontend.mjs";
import { graphicArticles } from "./articles-2026/graphic.mjs";
import { productArticles } from "./articles-2026/product.mjs";

const all = [
  ...uiuxArticles,
  ...frontendArticles,
  ...graphicArticles,
  ...productArticles,
];

// 1. covers
const covers = all.map((a) => ({ slug: a.slug, title: a.titleEn, cat: a.cat }));
fs.writeFileSync("scripts/_covers.json", JSON.stringify(covers));
const r = spawnSync("node", ["scripts/article-covers.mjs"], { encoding: "utf8" });
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
fs.rmSync("scripts/_covers.json");

// 2. store — staggered publish dates (newest first on the blog)
const start = new Date("2026-07-18T10:00:00Z").getTime();
const DAY = 86400000;
const articles = all.map((a, i) => ({
  id: `art-2026-${a.slug.slice(0, 20)}`,
  slug: a.slug,
  titleEn: a.titleEn,
  titleAr: a.titleAr,
  excerptEn: a.excerptEn,
  excerptAr: a.excerptAr,
  bodyEn: a.bodyEn,
  bodyAr: a.bodyAr,
  coverImage: `/images/blog/${a.slug}.webp`,
  tags: a.tags,
  readTime: a.readTime,
  published: true,
  publishedAt: new Date(start - i * 4 * DAY).toISOString(),
}));

fs.writeFileSync("data/articles.json", JSON.stringify(articles, null, 1));
console.error(`SEEDED ${articles.length} articles (demo placeholders replaced)`);
