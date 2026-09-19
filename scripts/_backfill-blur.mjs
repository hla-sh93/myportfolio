import "dotenv/config";
import { revalidateSite } from "./_revalidate.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/* Gives a cover placeholder to any project missing one. Touches blurDataUrl
   and nothing else. Safe to run while the panel is in use. */
const APPLY = process.argv.includes("--apply");
const db = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) });

const blur = async (buf) => {
  try {
    const t = await sharp(buf).resize(16, 16, { fit: "inside" }).webp({ quality: 45 }).toBuffer();
    return `data:image/webp;base64,${t.toString("base64")}`;
  } catch { return null; }
};
const load = async (url) => {
  if (url.startsWith("/")) {
    try { return await fs.readFile(path.join(process.cwd(), "public", url.split("?")[0].replace(/^\/+/, ""))); }
    catch { return null; }
  }
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    return r.ok ? Buffer.from(await r.arrayBuffer()) : null;
  } catch { return null; }
};

const file = JSON.parse(await fs.readFile("data/projects.json", "utf8"));
const live = new Map((await db.project.findMany({ select: { id: true, coverImage: true, blurDataUrl: true } })).map((p) => [p.id, p]));

let n = 0;
for (const p of file) {
  const lp = live.get(p.id);
  if (!lp || (lp.blurDataUrl && p.blurDataUrl)) continue;
  const b = await blur(await load(lp.coverImage) ?? Buffer.alloc(0));
  if (!b) { console.log(`  ?? ${p.id} — could not read ${lp.coverImage.slice(-40)}`); continue; }
  console.log(`  + ${p.id.padEnd(30)} ${b.length} chars`);
  p.blurDataUrl = b;
  n++;
  if (APPLY) await db.project.update({ where: { id: p.id }, data: { blurDataUrl: b } });
}
if (APPLY) await fs.writeFile("data/projects.json", JSON.stringify(file, null, 2) + "\n");
console.log(`\n${n} covers ${APPLY ? "given a placeholder (file + database)" : "would get one"}`);
console.log(APPLY ? "APPLIED" : "DRY RUN — re-run with --apply");
if (APPLY) await revalidateSite();
await db.$disconnect();
