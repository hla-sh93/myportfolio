import "dotenv/config";
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
const db = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) });
const APPLY = process.argv.includes("--apply");

/* Writes ONLY the fields this session changed.
   Never touches: coverImage, blurDataUrl, featured, media, tags, tools,
   titles, slugs — everything the admin panel owns stays as it is live. */
const TEXT = ["descEn", "descAr", "bodyEn", "bodyAr"];
const projects = JSON.parse(fs.readFileSync("data/projects.json", "utf8"));
const liveP = new Map((await db.project.findMany({ select: { id: true, descEn: true, descAr: true, bodyEn: true, bodyAr: true } })).map((p) => [p.id, p]));

let pRows = 0, pFields = 0;
for (const p of projects) {
  const lp = liveP.get(p.id); if (!lp) continue;
  const data = {};
  for (const k of TEXT) if ((p[k] ?? null) !== (lp[k] ?? null)) data[k] = p[k] ?? null;
  if (!Object.keys(data).length) continue;
  pRows++; pFields += Object.keys(data).length;
  if (APPLY) await db.project.update({ where: { id: p.id }, data });
}
console.log(`projects : ${pRows} rows, ${pFields} text fields`);

const articles = JSON.parse(fs.readFileSync("data/articles.json", "utf8"));
const liveA = new Map((await db.article.findMany({ select: { id: true, publishedAt: true } })).map((a) => [a.id, a]));
let aRows = 0;
for (const a of articles) {
  const la = liveA.get(a.id); if (!la) continue;
  if (la.publishedAt.toISOString() === a.publishedAt) continue;
  aRows++;
  if (APPLY) await db.article.update({ where: { id: a.id }, data: { publishedAt: new Date(a.publishedAt) } });
}
console.log(`articles : ${aRows} publishedAt`);

const exps = JSON.parse(fs.readFileSync("data/experiences.json", "utf8"));
const liveE = new Map((await db.experience.findMany({ select: { id: true, roleAr: true } })).map((e) => [e.id, e]));
let eRows = 0;
for (const e of exps) {
  const le = liveE.get(e.id); if (!le || le.roleAr === e.roleAr) continue;
  console.log(`  ${e.id}: "${le.roleAr}" -> "${e.roleAr}"`);
  eRows++;
  if (APPLY) await db.experience.update({ where: { id: e.id }, data: { roleAr: e.roleAr } });
}
console.log(`experiences: ${eRows} roleAr`);
console.log(APPLY ? "\nAPPLIED" : "\nDRY RUN — nothing written. Re-run with --apply");
await db.$disconnect();
