import "dotenv/config";
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
const db = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) });
const APPLY = process.argv.includes("--apply");

/* Inserts only the media rows the file has and the database does not.
   Never updates an existing row, never deletes anything. */
const projects = JSON.parse(fs.readFileSync("data/projects.json", "utf8"));
const liveIds = new Set((await db.media.findMany({ select: { id: true } })).map((m) => m.id));
const liveProjects = new Set((await db.project.findMany({ select: { id: true } })).map((p) => p.id));

let n = 0;
for (const p of projects) {
  if (!liveProjects.has(p.id)) continue;
  for (const m of p.media ?? []) {
    if (liveIds.has(m.id)) continue;
    console.log(`  + ${p.id.padEnd(30)} ${m.id.replace(p.id + "-", "").padEnd(5)} ${m.url.slice(-52)}`);
    n++;
    if (APPLY) {
      await db.media.create({
        data: {
          id: m.id, url: m.url, type: m.type, altEn: m.altEn, altAr: m.altAr,
          order: m.order ?? 0, width: m.width, height: m.height, projectId: p.id,
        },
      });
    }
  }
}
console.log(`\n${n} media rows ${APPLY ? "inserted" : "would be inserted"}`);
console.log(`db media now: ${await db.media.count()}`);
console.log(APPLY ? "APPLIED" : "DRY RUN — re-run with --apply");
await db.$disconnect();
